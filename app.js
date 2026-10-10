/* ============================================================
   MONSTER CHEM — engine + UI
   ============================================================ */
const KEY = 'monsterchem.v1';
const DEFAULT_STATE = { topics:{}, sessions:0, totalQ:0, totalC:0, bestRehearsal:null, focus:false, streak:0, bestStreak:0 };
let S = load();
function load(){ try{ return Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem(KEY)||'{}')); }catch(e){ return Object.assign({}, DEFAULT_STATE); } }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
function tstat(t){ if(!S.topics[t]) S.topics[t]={c:0,n:0}; return S.topics[t]; }

const $ = s => document.querySelector(s);
const app = () => $('#app');
let session = null;   /* {queue, i, results[], mode, started, marks} */
let answered = false, chosen = null, timerId = null;

/* ============================================================
   SESSION BUILDERS
   ============================================================ */
function genUntil(topics, pred, guard){
  for(let i=0;i<(guard||200);i++){ const q = randomQuestion(topics); if(pred(q)) return q; }
  return randomQuestion(topics);
}
const PRACTICE_TOPICS = ['reactions','balancing','naming','counting','activity','acids','ph','application','communication'];

function buildQuick(n){
  const out=[]; const pool = PRACTICE_TOPICS.filter(t=>t!=='application'&&t!=='communication');
  for(let i=0;i<n;i++) out.push(randomQuestion(pool));
  return out.map(q=>(q.marks=1,q));
}
function buildTopic(topic,n){
  const out=[]; for(let i=0;i<n;i++) out.push(questionFrom(topic));
  return out.map(q=>(q.marks=1,q));
}
function buildWeak(n){
  /* weight toward topics with the worst accuracy and the least practice */
  const scored = PRACTICE_TOPICS.map(t=>{
    const s = S.topics[t]||{c:0,n:0};
    const acc = s.n ? s.c/s.n : 0.5;
    const unseen = s.n < 5 ? 0.25 : 0;
    return { t, w: Math.max(0.05, (1-acc)) + unseen };
  });
  const total = scored.reduce((a,b)=>a+b.w,0);
  const draw = ()=>{ let r=Math.random()*total; for(const s of scored){ r-=s.w; if(r<=0) return s.t; } return scored[0].t; };
  const out=[]; for(let i=0;i<n;i++) out.push(questionFrom(draw()));
  return out.map(q=>(q.marks=1,q));
}

/* Full mock paper, mirroring the real SNC2D test: K22 / T16 / C13 / A12 = 63 */
function buildRehearsal(){
  const q=[];
  const add=(x,marks,section,cat)=>{ x.marks=marks; x.section=section; x.cat=cat; q.push(x); };
  /* Part 1 — Multiple Choice [K-14] */
  for(let i=0;i<14;i++)
    add(genUntil(['reactions','acids','activity','ph','naming'], x=>x.type==='mc'), 1, 'Part 1 · Multiple Choice  [K–14]', 'K');
  /* Part 2 — counting atoms [K-4] */
  add(genUntil(['counting'], x=>x.type==='multi'), 4, 'Part 2 · Counting Atoms  [K–4]', 'K');
  /* Part 3 — ionic/molecular + naming [K-4] [C-4] */
  for(let i=0;i<4;i++) add(genIonicOrMolecular(), 1, 'Part 3 · Ionic or Molecular?  [K–4]', 'K');
  for(let i=0;i<4;i++) add(Math.random()<.5?genNameIonic():genNameMolecular(), 1, 'Part 3 · IUPAC Names  [C–4]', 'C');
  /* Part 4 — balancing [T-8] */
  for(let i=0;i<4;i++) add(genBalance(), 2, 'Part 4 · Balance the Equations  [T–8]', 'T');
  /* Part 5 — thinking short answers [T-8] */
  add(genPHDirection(), 1, 'Part 5 · Short Answers  [T–8]', 'T');
  add(genPHFactor(), 1, 'Part 5 · Short Answers  [T–8]', 'T');
  add(STATIC_BANK.find(x=>x.type==='multi'&&x.topic==='acids'), 4, 'Part 5 · Short Answers  [T–8]', 'T');
  add(genPHFactor(), 2, 'Part 5 · Short Answers  [T–8]', 'T');
  /* Communication [C-9] */
  const comms = shuffle(STATIC_BANK.filter(x=>x.topic==='communication'));
  add(comms[0], 1, 'Communication  [C–9]', 'C');
  add(comms[1], 4, 'Communication  [C–9]', 'C');
  add(comms[2], 4, 'Communication  [C–9]', 'C');
  /* Part 6 — Application [A-12] */
  for(let i=0;i<4;i++) add(genWordEq(), 3, 'Part 6 · Application  [A–12]', 'A');
  return q.map(x=>JSON.parse(JSON.stringify(x)));
}

function start(mode, opt){
  let queue, label;
  if(mode==='quick'){ queue=buildQuick(10); label='Quick Lab'; }
  else if(mode==='topic'){ queue=buildTopic(opt,12); label=stripTags(TOPICS[opt].name); }
  else if(mode==='weak'){ queue=buildWeak(12); label='Mistake Monsters'; }
  else if(mode==='marathon'){ queue=buildQuick(30); label='Marathon'; }
  else { queue=buildRehearsal(); label='Dress Rehearsal'; }
  session = { queue, i:0, results:[], mode, label, started:Date.now(), topic:opt };
  answered=false; chosen=null;
  if(mode==='rehearsal'){ timerId = setInterval(()=>{ const el=$('#timer'); if(el) el.textContent=clock(Date.now()-session.started); },1000); }
  renderQuestion();
}
const clock = ms => { const s=Math.floor(ms/1000); return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); };
const stripTags = h => String(h).replace(/<[^>]*>/g,'').replace(/&amp;/g,'&');

/* ============================================================
   RENDER — HOME
   ============================================================ */
function renderHome(){
  if(timerId){ clearInterval(timerId); timerId=null; }
  session=null;
  const acc = S.totalQ ? Math.round(100*S.totalC/S.totalQ) : null;
  const topicCards = PRACTICE_TOPICS.map(t=>{
    const T=TOPICS[t], s=S.topics[t]||{c:0,n:0};
    const a = s.n ? Math.round(100*s.c/s.n) : null;
    return `<button class="mode" onclick="start('topic','${t}')">
      <span class="ic">${T.icon}</span>
      <h3>${T.name}</h3>
      <p>${T.blurb}</p>
      ${a!==null?`<span class="tag ${a<60?'hot':''}">${a}%</span>`:''}
    </button>`;
  }).join('');

  app().innerHTML = `
    <div class="grid">
      <button class="mode" onclick="start('quick')">
        <span class="ic">&#9889;</span><h3>Quick Lab</h3>
        <p>10 random questions. Takes about 5 minutes. Best way to start.</p>
      </button>
      <button class="mode" onclick="start('weak')">
        <span class="ic">&#128123;</span><h3>Mistake Monsters</h3>
        <p>12 questions aimed straight at whatever you keep getting wrong.</p>
      </button>
      <button class="mode" onclick="start('rehearsal')">
        <span class="ic">&#127917;</span><h3>Dress Rehearsal</h3>
        <p>The full 63-mark paper, same shape as the real test. K22 / T16 / C13 / A12.</p>
        ${S.bestRehearsal!==null?`<span class="tag">best ${S.bestRehearsal}%</span>`:''}
      </button>
      <button class="mode" onclick="start('marathon')">
        <span class="ic">&#127939;</span><h3>Marathon</h3>
        <p>30 questions straight through, when you want a long run.</p>
      </button>
    </div>
    <h2 class="sec">Train one topic</h2>
    <div class="grid">${topicCards}</div>
    <h2 class="sec">Reference</h2>
    <div class="grid">
      <button class="mode" onclick="showSheet()"><span class="ic">&#128203;</span><h3>Cheat Sheet</h3>
        <p>Activity Series, polyatomic ions, prefixes, the rules that keep showing up.</p></button>
      <button class="mode" onclick="renderProgress()"><span class="ic">&#128200;</span><h3>Progress</h3>
        <p>${acc!==null?`${S.totalQ} questions answered &middot; ${acc}% overall`:'Nothing tracked yet &mdash; go do a Quick Lab.'}</p></button>
    </div>
    <p class="footnote">Keyboard: <span class="kbd">1</span>&ndash;<span class="kbd">4</span> to pick an answer &middot;
      <span class="kbd">Enter</span> to check / continue &middot; <span class="kbd">H</span> for a hint</p>`;
  renderHUD();
}

function renderHUD(){
  const acc = S.totalQ ? Math.round(100*S.totalC/S.totalQ) : 0;
  $('#hud').innerHTML = S.focus
    ? `<button class="ghost on" onclick="toggleFocus()">Focus mode on</button>`
    : `<span class="chip streak">&#128293; streak <b>${S.streak}</b></span>
       <span class="chip">&#127919; <b>${acc}%</b></span>
       <button class="ghost" onclick="toggleFocus()">Focus mode</button>`;
}
function toggleFocus(){ S.focus=!S.focus; save(); renderHUD(); }

/* ============================================================
   RENDER — QUESTION
   ============================================================ */
function renderQuestion(){
  const q = session.queue[session.i];
  const T = TOPICS[q.topic] || TOPICS.reactions;
  const C = COACHES[T.coach];
  answered=false; chosen = (q.type==='multi') ? new Array(q.parts.length).fill(null) : null;

  const dots = session.queue.map((_,i)=>{
    const r = session.results[i];
    const cls = i===session.i ? 'now' : r ? (r.status==='right'?'done':r.status==='part'?'part':'miss') : '';
    return `<span class="dot ${cls}"></span>`;
  }).join('');

  const bar = session.mode==='rehearsal'
    ? `<div class="rehearsal-bar"><span class="sectitle">${q.section}</span><span class="spacer"></span>
        <span>elapsed</span><span class="t" id="timer">${clock(Date.now()-session.started)}</span>
        <span class="chip">${q.marks} mark${q.marks>1?'s':''}</span></div>` : '';

  app().innerHTML = `
    ${bar}
    <div class="qhead">
      <div class="dots">${dots}</div>
      <button class="ghost" onclick="quitSession()">Exit</button>
    </div>
    <div class="card">
      ${S.focus?'':`<div class="coach">
        <div class="ava" style="background:${C.colour}">${C.name[0]}</div>
        <div><div class="nm" style="color:${C.colour}">${C.name}</div><div class="ln">${C.line}</div></div>
      </div>`}
      <div class="qtext">${q.q}</div>
      ${q.series?seriesHTML():''}
      <div id="answerzone">${answerHTML(q)}</div>
      <div id="fb"></div>
      <div class="actions" id="actions">
        <button class="btn" id="submit" onclick="submit()" ${q.type==='open'?'':'disabled'}>${q.type==='open'?'Show me the answer':'Check'}</button>
        ${q.hint?`<button class="btn alt sm" onclick="showHint()">Hint</button>`:''}
      </div>
    </div>`;
  const first = $('#answerzone input, #answerzone textarea');
  if(first) first.focus();
}

function answerHTML(q){
  switch(q.type){
    case 'mc':
      return `<div class="choices">` + q.choices.map((c,i)=>
        `<button class="choice" data-i="${i}" onclick="choose(${i})">
           <span class="key">${i+1}</span><span>${c}</span></button>`).join('') + `</div>`;
    case 'number':
      return `<input class="tin num" id="in0" type="text" inputmode="numeric" autocomplete="off"
                placeholder="${q.placeholder||'number'}" oninput="liveEnable()" onkeydown="enterKey(event)">`;
    case 'text':
      return `<input class="tin" id="in0" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"
                placeholder="${q.placeholder||'your answer'}" oninput="liveEnable()" onkeydown="enterKey(event)">`;
    case 'balance': {
      const side = (arr,off)=>arr.map((t,i)=>
        `${i?'<span class="plus">+</span>':''}<input type="text" inputmode="numeric" id="b${off+i}" oninput="liveEnable()" onkeydown="enterKey(event)"><span>${fmt(t.f)}</span>`
      ).join('');
      return `<div class="bal">${side(q.left,0)}<span class="arrow">&rarr;</span>${side(q.right,q.left.length)}</div>`;
    }
    case 'multi':
      return `<div class="parts">` + q.parts.map((p,i)=>{
        if(p.type==='number')
          return `<div class="prow"><label>${p.label}</label>
            <input class="tin num" id="in${i}" type="text" inputmode="numeric" oninput="liveEnable()" onkeydown="enterKey(event)"></div>`;
        return `<div class="prow"><label>${p.label}</label><div class="mini" id="mini${i}">` +
          p.choices.map((c,j)=>`<button data-p="${i}" data-j="${j}" onclick="choosePart(${i},${j})">${c}</button>`).join('') +
          `</div></div>`;
      }).join('') + `</div>`;
    case 'open':
      return `<textarea class="openbox" id="in0" placeholder="Write your answer here. Try it before you look &mdash; writing it out is what makes it stick."></textarea>`;
  }
  return '';
}
function seriesHTML(hi){
  return `<div class="series">
    <div class="cap">Activity Series &middot; most reactive <span class="arrow">&rarr;</span> least reactive</div>
    <div class="list">` +
    ACTIVITY.map(m=>`<span class="m${hi&&hi.includes(m)?' hi':''}">${m}</span>`).join('') + `</div></div>`;
}

/* ---- input handlers ---- */
function choose(i){
  if(answered) return;
  chosen=i;
  document.querySelectorAll('#answerzone .choice').forEach((b,j)=>b.classList.toggle('sel',j===i));
  $('#submit').disabled=false;
}
function choosePart(p,j){
  if(answered) return;
  chosen[p]=j;
  document.querySelectorAll(`#mini${p} button`).forEach((b,k)=>b.classList.toggle('sel',k===j));
  liveEnable();
}
function liveEnable(){
  const q=session.queue[session.i]; let ok=false;
  if(q.type==='multi'){
    ok = q.parts.every((p,i)=> p.type==='number' ? ($('#in'+i).value.trim()!=='') : chosen[i]!==null );
  } else if(q.type==='balance'){
    ok = q.a.every((_,i)=> $('#b'+i).value.trim()!=='' );
  } else {
    const el=$('#in0'); ok = el && el.value.trim()!=='';
  }
  $('#submit').disabled=!ok;
}
function enterKey(e){ if(e.key==='Enter'){ e.preventDefault(); if(!$('#submit').disabled) submit(); } }
function showHint(){
  const q=session.queue[session.i];
  if($('#hintbox')) return;
  $('#fb').insertAdjacentHTML('beforebegin', `<div class="hintbox" id="hintbox"><b>Hint:</b> ${q.hint}</div>`);
  session.usedHint = true;
}

/* ============================================================
   GRADING
   ============================================================ */
function submit(){
  if(answered) return;
  const q = session.queue[session.i];
  if(q.type==='open'){ revealOpen(q); return; }
  answered=true;

  let status='wrong', detail='', note='';
  if(q.type==='mc'){
    status = chosen===q.a ? 'right':'wrong';
    document.querySelectorAll('#answerzone .choice').forEach((b,j)=>{
      b.disabled=true;
      if(j===q.a) b.classList.add('right');
      else if(j===chosen) b.classList.add('wrong');
      b.classList.remove('sel');
    });
  }
  else if(q.type==='number'){
    const v = parseFloat($('#in0').value.replace(/[, ]/g,''));
    status = (v===q.a) ? 'right':'wrong';
    $('#in0').classList.add(status==='right'?'right':'wrong');
    $('#in0').disabled=true;
    if(status==='wrong') detail = `You wrote <b>${$('#in0').value.trim()}</b>. The answer is <b>${q.a.toLocaleString()}</b>.`;
  }
  else if(q.type==='text'){
    const raw = $('#in0').value;
    const r = checkText(raw,q);
    status = r.ok ? 'right':'wrong';
    note = r.note||'';
    $('#in0').classList.add(r.ok?'right':'wrong');
    $('#in0').disabled=true;
    if(!r.ok) detail = `You wrote <b>${escapeHTML(raw.trim())}</b>. The answer is <b>${fmt(q.a[0])}</b>.`;
  }
  else if(q.type==='balance'){
    let right=0;
    q.a.forEach((corr,i)=>{
      const el=$('#b'+i); const v=parseInt(el.value,10);
      const ok = v===corr; if(ok) right++;
      el.classList.add(ok?'right':'wrong'); el.disabled=true;
      if(!ok) el.value = el.value.trim()+' → '+corr;
    });
    status = right===q.a.length ? 'right' : right>=Math.ceil(q.a.length/2) ? 'part' : 'wrong';
    if(status!=='right') detail = `You got <b>${right} of ${q.a.length}</b> coefficients right. The corrections are shown in the boxes.`;
  }
  else if(q.type==='multi'){
    let right=0;
    q.parts.forEach((p,i)=>{
      let ok;
      if(p.type==='number'){
        const el=$('#in'+i); ok = parseFloat(el.value.replace(/[, ]/g,''))===p.a;
        el.classList.add(ok?'right':'wrong'); el.disabled=true;
        if(!ok) el.value = el.value.trim()+' → '+p.a;
      } else {
        ok = chosen[i]===p.a;
        document.querySelectorAll(`#mini${i} button`).forEach((b,k)=>{
          b.disabled=true;
          if(k===p.a) b.classList.add('right');
          else if(k===chosen[i]) b.classList.add('wrong');
          b.classList.remove('sel');
        });
      }
      if(ok) right++;
    });
    status = right===q.parts.length ? 'right' : right>0 ? 'part' : 'wrong';
    if(status!=='right') detail = `You got <b>${right} of ${q.parts.length}</b> parts right.`;
  }

  const earned = status==='right' ? q.marks : status==='part' ? Math.max(1,Math.round(q.marks/2)) : 0;
  record(q, status, earned);
  showFeedback(q, status, detail, note);
}

function checkText(raw,q){
  const given = raw.trim();
  if(q.exact){
    const clean = s => String(s).replace(/\s+/g,'');
    if(clean(given)===clean(q.a[0])) return {ok:true};
    if(clean(given).toLowerCase()===clean(q.a[0]).toLowerCase())
      return {ok:true, note:`Right answer &mdash; but watch your capital letters. Element symbols are a capital then a lowercase: <b>${fmt(q.a[0])}</b>. On a real test that can cost you the mark.`};
    return {ok:false};
  }
  if(answerMatches(given,q.a)) return {ok:true};
  const g=norm(given), a=norm(q.a[0]);

  /* Roman numerals and digits must match EXACTLY — iron(II) is not iron(III). */
  const tokens = s => (String(s).match(/\((?:[ivx]+|\d+)\)|\d+/g)||[]).join(',');
  if(tokens(g)!==tokens(a)){
    if(lev(g,a)<=2 && tokens(a))
      return {ok:false, note:`So close &mdash; but the Roman numeral is the whole point. <b>(${tokens(a).replace(/[()]/g,'').toUpperCase()})</b> tells you the metal's charge, and a different numeral means a different compound.`};
    return {ok:false};
  }

  /* -ate / -ite / -ide / -ous / -ic are different ions, never typos. */
  if(dangerousConfusion(g,a))
    return {ok:false, note:`One letter, completely different chemical. <b>&ndash;ate</b> and <b>&ndash;ite</b> are two different polyatomic ions, and <b>&ndash;ic acid</b> and <b>&ndash;ous acid</b> come from each of them. This exact swap costs marks on every test &mdash; say the right one out loud twice.`};

  /* genuine spelling slip */
  if(g.length>4 && lev(g,a)<=1)
    return {ok:true, note:`Close enough &mdash; but the exact spelling is <b>${q.a[0]}</b>. The mock test says <i>"Wrong spelling is wrong"</i>, so copy it out once.`};
  return {ok:false};
}
function dangerousConfusion(g,a){
  const swaps=[['ate','ite'],['ite','ate'],['ide','ate'],['ate','ide'],
               ['ide','ite'],['ite','ide'],['ous','ic'],['ic','ous']];
  for(const [x,y] of swaps){
    if(g.replace(new RegExp(x+'\\b','g'), y) === a) return true;
  }
  return false;
}
function lev(a,b){
  const m=a.length,n=b.length; if(Math.abs(m-n)>1) return 9;
  const d=Array.from({length:m+1},(_,i)=>[i].concat(new Array(n).fill(0)));
  for(let j=0;j<=n;j++) d[0][j]=j;
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++)
    d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return d[m][n];
}
const escapeHTML = s => String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

/* ---- open (self-marked) ---- */
function revealOpen(q){
  answered=true;
  const mine = $('#in0').value.trim();
  $('#in0').disabled=true;
  $('#actions').innerHTML='';
  $('#fb').innerHTML = `
    <div class="fb neutral">
      <div class="verdict">&#128221; Model answer</div>
      <div class="why">${q.model}</div>
      ${q.why?`<div class="note">${q.why}</div>`:''}
    </div>
    <div class="msg"><b>Be honest with yourself &mdash; how did yours compare?</b>
      ${mine?'':'<br><span style="color:var(--warn)">You left it blank. That counts as "Missed it" &mdash; but read the model answer twice before you move on.</span>'}</div>
    <div class="actions">
      <button class="btn good"  onclick="markOpen('right')">Got it all</button>
      <button class="btn warnb" onclick="markOpen('part')">Got some of it</button>
      <button class="btn badb"  onclick="markOpen('wrong')">Missed it</button>
    </div>`;
}
function markOpen(status){
  const q=session.queue[session.i];
  const earned = status==='right'?q.marks : status==='part'?Math.max(1,Math.round(q.marks/2)) : 0;
  record(q,status,earned);
  next();
}

/* ---- scoring bookkeeping ---- */
function record(q,status,earned){
  session.results[session.i] = { status, earned, max:q.marks, topic:q.topic };
  const st = tstat(q.topic); st.n++; if(status==='right') st.c++; else if(status==='part') st.c+=0.5;
  S.totalQ++; if(status==='right') S.totalC++; else if(status==='part') S.totalC+=0.5;
  if(status==='right'){ S.streak++; if(S.streak>S.bestStreak) S.bestStreak=S.streak; } else S.streak=0;
  save(); renderHUD();
}

function showFeedback(q,status,detail,note){
  const praise = ['Nailed it.','Correct.','That is the one.','Clean.','Exactly right.','Yes &mdash; that is it.'];
  const miss   = ['Not quite.','Close, but no.','Missed that one.','Not this time.'];
  const head = status==='right' ? `&#9889; ${pick(praise)}`
             : status==='part'  ? `&#9889; Partly there.`
             : `&#128123; ${pick(miss)}`;
  const streakLine = (status==='right' && S.streak>=3 && !S.focus)
    ? `<div class="note" style="color:var(--pink);border-color:var(--pink);background:rgba(255,46,136,.1)">&#128293; ${S.streak} in a row.</div>` : '';
  $('#fb').innerHTML = `
    <div class="fb ${status==='right'?'ok':status==='part'?'neutral':'no'}">
      <div class="verdict">${head}</div>
      <div class="why">${detail?detail+'<br><br>':''}${q.why}</div>
      ${note?`<div class="note">${note}</div>`:''}
      ${streakLine}
    </div>`;
  $('#actions').innerHTML = `<button class="btn" id="submit" onclick="next()">
    ${session.i===session.queue.length-1?'See results':'Next question'} &rarr;</button>`;
  $('#submit').focus();
}

function next(){
  session.i++;
  if(session.i>=session.queue.length) return renderResults();
  if(session.i>0 && session.i%10===0 && session.queue.length>14) return brainBreak();
  renderQuestion();
}
function brainBreak(){
  app().innerHTML = `<div class="card break">
    <div class="big">&#129504;</div>
    <h2 style="margin:0 0 8px">Brain break.</h2>
    <p style="color:var(--dim);max-width:460px;margin:0 auto 18px">
      You have done ${session.i} questions. Stand up, get water, look out a window for 30 seconds.
      Your brain keeps more when you break it up &mdash; this is not slacking, it is strategy.</p>
    <div class="actions" style="justify-content:center">
      <button class="btn" onclick="renderQuestion()">Back in &mdash; keep going</button>
      <button class="btn alt" onclick="renderResults()">Stop here, show results</button>
    </div></div>`;
}
function quitSession(){
  if(session.results.filter(Boolean).length===0) return renderHome();
  renderResults();
}

/* ============================================================
   RESULTS
   ============================================================ */
function renderResults(){
  if(timerId){ clearInterval(timerId); timerId=null; }
  const done = session.results.filter(Boolean);
  const earned = done.reduce((a,r)=>a+r.earned,0);
  const max = done.reduce((a,r)=>a+r.max,0);
  const pct = max ? Math.round(100*earned/max) : 0;
  const mins = Math.round((Date.now()-session.started)/60000);

  S.sessions++;
  if(session.mode==='rehearsal' && session.i>=session.queue.length){
    if(S.bestRehearsal===null || pct>S.bestRehearsal) S.bestRehearsal=pct;
  }
  save();

  /* per-topic breakdown for this session */
  const byTopic={};
  done.forEach(r=>{ const b=byTopic[r.topic]=byTopic[r.topic]||{e:0,m:0}; b.e+=r.earned; b.m+=r.max; });
  const bars = Object.entries(byTopic).sort((a,b)=>(a[1].e/a[1].m)-(b[1].e/b[1].m)).map(([t,b])=>{
    const p=Math.round(100*b.e/b.m);
    return `<div class="bar"><span>${TOPICS[t]?TOPICS[t].name:t}</span>
      <span class="track"><span class="fill ${p>=80?'hi':p<60?'lo':''}" style="width:${p}%"></span></span>
      <span class="v">${p}%</span></div>`;
  }).join('');

  const weakest = Object.entries(byTopic).filter(([,b])=>b.e/b.m<0.7)
    .sort((a,b)=>(a[1].e/a[1].m)-(b[1].e/b[1].m)).map(([t])=>t);

  let msg;
  if(pct>=90) msg = `<b>That is test-ready.</b> If you can do this cold, you can do it in the exam room. The thing that gets people now is rushing &mdash; read each question twice on the real paper.`;
  else if(pct>=75) msg = `<b>Solid.</b> You know most of this. Tighten up ${weakest.length?'<b>'+stripTags(TOPICS[weakest[0]].name)+'</b>':'the slow spots'} and you are in good shape.`;
  else if(pct>=55) msg = `<b>Good &mdash; the base is there.</b> Do not try to fix everything at once. Pick ONE topic below and run it until it is boring. Then come back.`;
  else msg = `<b>This is exactly what practice is for.</b> Getting it wrong here is free &mdash; getting it wrong on the test is not. Start with the lowest bar below and do one topic at a time.`;

  const retry = weakest.length
    ? `<div class="actions"><span style="color:var(--dim);font-size:14px;width:100%">Drill the weak spots:</span>` +
      weakest.slice(0,3).map(t=>`<button class="btn alt sm" onclick="start('topic','${t}')">${TOPICS[t].name}</button>`).join('') + `</div>`
    : '';

  app().innerHTML = `
    <div class="card">
      <div class="score">
        <div class="pct">${pct}%</div>
        <div class="sub">${session.label} &middot; ${earned} / ${max} marks &middot; ${done.length} questions &middot; ${mins} min</div>
      </div>
      ${session.mode==='rehearsal'?`<div class="msg" style="border-color:var(--cyan)">
        <b>Dress rehearsal done.</b> The real test is marked the same way: 63 marks split K22 / T16 / C13 / A12.
        ${S.bestRehearsal===pct?'This is your best run so far.':`Your best so far is ${S.bestRehearsal}%.`}</div>`:''}
      <div class="bars">${bars}</div>
      <div class="msg">${msg}</div>
      ${retry}
      <div class="actions">
        <button class="btn" onclick="start('${session.mode}'${session.topic?`,'${session.topic}'`:''})">Run it again</button>
        <button class="btn alt" onclick="renderHome()">Back to the lab</button>
      </div>
    </div>`;
  renderHUD();
}

/* ============================================================
   PROGRESS
   ============================================================ */
function renderProgress(){
  const rows = PRACTICE_TOPICS.map(t=>{
    const s=S.topics[t]||{c:0,n:0};
    if(!s.n) return `<div class="bar"><span>${TOPICS[t].name}</span>
      <span class="track"></span><span class="v" style="font-size:12px">&mdash;</span></div>`;
    const p=Math.round(100*s.c/s.n);
    return `<div class="bar"><span>${TOPICS[t].name}</span>
      <span class="track"><span class="fill ${p>=80?'hi':p<60?'lo':''}" style="width:${p}%"></span></span>
      <span class="v">${p}%</span></div>`;
  }).join('');
  const acc = S.totalQ?Math.round(100*S.totalC/S.totalQ):0;
  app().innerHTML = `
    <div class="card">
      <div class="score"><div class="pct">${acc}%</div>
        <div class="sub">${S.totalQ} questions answered &middot; ${S.sessions} sessions &middot; best streak ${S.bestStreak}
        ${S.bestRehearsal!==null?`&middot; best rehearsal ${S.bestRehearsal}%`:''}</div></div>
      <h2 class="sec">By topic</h2>
      <div class="bars">${rows}</div>
      <div class="msg">Anything under 60% is where the marks are hiding. Topics with a dash just need a first run.</div>
      <div class="actions">
        <button class="btn" onclick="start('weak')">Drill my weak spots</button>
        <button class="btn alt" onclick="renderHome()">Back</button>
        <button class="btn alt sm" onclick="resetAll()">Reset all progress</button>
      </div>
    </div>`;
}
function resetAll(){
  if(!confirm('Erase all progress and start fresh?')) return;
  S=Object.assign({},DEFAULT_STATE); S.topics={}; save(); renderHome();
}

/* ============================================================
   CHEAT SHEET
   ============================================================ */
function showSheet(){
  const polyRows = ANIONS.filter(a=>a.poly).map(a=>
    `<tr><td>${fmt(a.f)}<sup>${Math.abs(a.ch)===1?'':Math.abs(a.ch)}&minus;</sup></td><td>${a.n}</td></tr>`).join('');
  app().innerHTML = `
    <div class="card">
      <h2 class="sec" style="margin-top:0">Activity Series of Metals</h2>
      ${seriesHTML()}
      <p style="color:var(--dim);font-size:15px;margin-top:-4px">
        A metal will displace any metal <b>below</b> it from a compound. If it is below, there is <b>no reaction</b>.
        This is the one you got wrong on the mock &mdash; higher means more reactive, and more reactive wins.</p>

      <h2 class="sec">The rules that keep coming back</h2>
      <div class="databox" style="font-size:15.5px;line-height:1.85">
        <b>Acid + Base &rarr; Salt + Water</b> (neutralization)<br>
        <b>Hydrocarbon + O<sub>2</sub> &rarr; CO<sub>2</sub> + H<sub>2</sub>O</b> (complete combustion)<br>
        <b>Acids</b>: pH &lt; 7 &middot; sour &middot; turn blue litmus <b>red</b><br>
        <b>Bases</b>: pH &gt; 7 &middot; bitter &middot; slippery &middot; turn red litmus <b>blue</b><br>
        <b>pH is logarithmic</b>: 1 pH unit = <b>10&times;</b>, 2 units = 100&times;, 3 units = 1000&times;<br>
        <b>Balancing</b>: change coefficients (in front), <b>never</b> subscripts<br>
        <b>&ndash;ate &rarr; &ndash;ic acid</b> &middot; <b>&ndash;ite &rarr; &ndash;ous acid</b> &middot; no oxygen &rarr; <b>hydro&ndash;(stem)&ndash;ic acid</b>
      </div>

      <h2 class="sec">Reaction types</h2>
      <div class="databox" style="font-size:15.5px;line-height:1.85">
        <b>Synthesis</b> &nbsp; A + B &rarr; AB<br>
        <b>Decomposition</b> &nbsp; AB &rarr; A + B<br>
        <b>Single displacement</b> &nbsp; A + BC &rarr; AC + B &nbsp;<span style="color:var(--dim)">(element + compound)</span><br>
        <b>Double displacement</b> &nbsp; AB + CD &rarr; AD + CB &nbsp;<span style="color:var(--dim)">(two compounds swap)</span><br>
        <b>Combustion</b> &nbsp; C<sub>x</sub>H<sub>y</sub> + O<sub>2</sub> &rarr; CO<sub>2</sub> + H<sub>2</sub>O
      </div>

      <h2 class="sec">Prefixes (molecular compounds only)</h2>
      <div class="databox" style="font-size:15.5px">
        1 mono &middot; 2 di &middot; 3 tri &middot; 4 tetra &middot; 5 penta &middot; 6 hexa &middot; 7 hepta &middot; 8 octa &middot; 9 nona &middot; 10 deca
        <br><span style="color:var(--dim)">The first element never takes "mono". Before "oxide" you drop the final a/o: mon<b>oxide</b>, pent<b>oxide</b>, hept<b>oxide</b>.</span>
      </div>

      <h2 class="sec">Polyatomic ions</h2>
      <div class="databox" style="padding:0;overflow:hidden">
        <table class="dtable">${polyRows}</table>
      </div>
      <div class="actions"><button class="btn alt" onclick="renderHome()">Back to the lab</button></div>
    </div>`;
}

/* ============================================================
   KEYBOARD
   ============================================================ */
document.addEventListener('keydown', e=>{
  if(!session) return;
  const tag = document.activeElement && document.activeElement.tagName;
  const typing = tag==='INPUT'||tag==='TEXTAREA';
  if(e.key==='Enter' && !typing){
    const b=$('#submit'); if(b && !b.disabled){ e.preventDefault(); b.click(); } return;
  }
  if(typing) return;
  if(/^[1-9]$/.test(e.key)){
    const q=session.queue[session.i];
    if(q.type==='mc' && !answered){ const i=+e.key-1; if(i<q.choices.length){ e.preventDefault(); choose(i); } }
  }
  if(e.key.toLowerCase()==='h' && !answered){ const q=session.queue[session.i]; if(q.hint) showHint(); }
});

renderHome();
