/* ============================================================
   MONSTER CIVICS — engine + UI
   ============================================================ */
const KEY = 'monstercivics.v1';
const DEFAULT_STATE = { topics:{}, sessions:0, totalQ:0, totalC:0, bestRehearsal:null, focus:false, streak:0, bestStreak:0, learned:[] };
let S = load();
function load(){ try{ return Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem(KEY)||'{}')); }catch(e){ return Object.assign({}, DEFAULT_STATE); } }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
function tstat(t){ if(!S.topics[t]) S.topics[t]={c:0,n:0}; return S.topics[t]; }

const $ = s => document.querySelector(s);
const app = () => $('#app');
let session = null;
let answered = false, chosen = null, timerId = null;

/* ============================================================
   SESSION BUILDERS
   ============================================================ */
const PRACTICE_TOPICS = ['levels','whoswho','branches','executive','parliament','judicial','criminal','youth','civil','elections','electoral','written'];
const AUTO_TOPICS = PRACTICE_TOPICS.filter(t=>t!=='written');
const clone = x => JSON.parse(JSON.stringify(x));

function buildQuick(n){
  const out=[]; let last=null;
  for(let i=0;i<n;i++){ let t; do { t=pick(AUTO_TOPICS); } while(t===last); last=t; out.push(questionFrom(t)); }
  return out.map(q=>(q.marks=1,q));
}
function buildTopic(topic,n){
  if(topic==='written') return shuffle(STATIC_BANK.filter(q=>q.topic==='written')).slice(0,n).map(clone);
  const out=[]; for(let i=0;i<n;i++) out.push(questionFrom(topic));
  return out.map(q=>(q.marks=1,q));
}
function buildLightning(n){
  return shuffle(TF).slice(0,n).map(s=>{ const q=genTF();
    Object.assign(q,{ q:`True or false?<br><b>${s[0]}</b>`, a:s[1]?0:1, why:s[2], topic:s[3], marks:1 }); return q; });
}
function buildWeak(n){
  const scored = AUTO_TOPICS.map(t=>{
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

/* Mock paper in the shape of the Part 2 final practice test:
   Part A multiple choice, Part B short answer, Part C application. */
function buildRehearsal(){
  const q=[];
  const add=(x,marks,section)=>{ x.marks=marks; x.section=section; q.push(clone(x)); };
  /* Part A — 12 multiple choice, one per topic area + extras */
  const mcTopics = shuffle(AUTO_TOPICS).concat(shuffle(AUTO_TOPICS)).slice(0,12);
  mcTopics.forEach(t=>{
    let x; for(let g=0;g<60;g++){ x=questionFrom(t); if(x.type==='mc' && x.choices.length>2) break; }
    add(x,1,'Part A · Multiple Choice');
  });
  /* Part B — 8 short answers */
  shuffle(STATIC_BANK.filter(x=>x.part==='B')).slice(0,8).forEach(x=>add(x,x.marks,'Part B · Short Answer'));
  /* Part C — application & critical thinking */
  const C2='Part C · Application & Critical Thinking';
  add(Object.assign(genArMrMulti(),{topic:'criminal'}),4,C2);
  add(Object.assign(genRestorativeMulti(),{topic:'youth'}),3,C2);
  add(Object.assign(genCivilParties(),{topic:'civil'}),5,C2);
  add(Object.assign(genFPTP(),{topic:'electoral'}),3,C2);
  add(pick(STATIC_BANK.filter(x=>x.part==='C' && /two reasons|First-Past/.test(x.q))),4,C2);
  return q;
}

function start(mode, opt){
  let queue, label;
  if(mode==='quick'){ queue=buildQuick(10); label='Quick Round'; }
  else if(mode==='topic'){ queue=buildTopic(opt,opt==='written'?6:12); label=stripTags(TOPICS[opt].name); }
  else if(mode==='weak'){ queue=buildWeak(12); label='Mistake Monsters'; }
  else if(mode==='lightning'){ queue=buildLightning(15); label='Lightning Round'; }
  else if(mode==='marathon'){ queue=buildQuick(30); label='Marathon'; }
  else { queue=buildRehearsal(); label='Dress Rehearsal'; }
  session = { queue, i:0, results:[], mode, label, started:Date.now(), topic:opt };
  lesson = null; answered=false; chosen=null;
  if(timerId){ clearInterval(timerId); timerId=null; }
  if(mode==='rehearsal'){ timerId = setInterval(()=>{ const el=$('#timer'); if(el) el.textContent=clock(Date.now()-session.started); },1000); }
  renderQuestion();
}
const clock = ms => { const s=Math.floor(ms/1000); return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); };
const stripTags = h => String(h).replace(/<[^>]*>/g,'').replace(/&amp;/g,'&');

/* ============================================================
   HOME
   ============================================================ */
function renderHome(){
  if(timerId){ clearInterval(timerId); timerId=null; }
  session=null; lesson=null;
  const acc = S.totalQ ? Math.round(100*S.totalC/S.totalQ) : null;
  const topicCards = PRACTICE_TOPICS.map(t=>{
    const T=TOPICS[t], s=S.topics[t]||{c:0,n:0};
    const a = s.n ? Math.round(100*s.c/s.n) : null;
    const hasLesson = !!LESSONS[t];
    const seen = (S.learned||[]).includes(t);
    return `<div class="mode topic">
      <span class="ic">${T.icon}</span>
      <h3>${T.name}</h3>
      <p>${T.blurb}</p>
      <div class="tactions">
        ${hasLesson?`<button class="tbtn learn${seen?' seen':''}" onclick="startLesson('${t}')">${seen?'&#10003; Learn again':'&#128218; Learn'}</button>`:''}
        <button class="tbtn" onclick="start('topic','${t}')">Practise</button>
      </div>
      ${a!==null?`<span class="tag ${a<60?'hot':''}">${a}%</span>`:''}
    </div>`;
  }).join('');

  app().innerHTML = `
    <div class="grid">
      <button class="mode" onclick="start('quick')">
        <span class="ic">&#9889;</span><h3>Quick Round</h3>
        <p>10 random questions from every topic. About 5 minutes. Best way to start.</p>
      </button>
      <button class="mode" onclick="start('lightning')">
        <span class="ic">&#127775;</span><h3>Lightning Round</h3>
        <p>15 true-or-false traps, super fast. Great warm-up for a tired brain.</p>
      </button>
      <button class="mode" onclick="start('weak')">
        <span class="ic">&#128123;</span><h3>Mistake Monsters</h3>
        <p>12 questions aimed straight at whatever you keep getting wrong.</p>
      </button>
      <button class="mode" onclick="start('rehearsal')">
        <span class="ic">&#127917;</span><h3>Dress Rehearsal</h3>
        <p>A full mock test shaped like the final practice test: Part A multiple choice, Part B short answer, Part C scenarios.</p>
        ${S.bestRehearsal!==null?`<span class="tag">best ${S.bestRehearsal}%</span>`:''}
      </button>
      <button class="mode" onclick="start('marathon')">
        <span class="ic">&#127939;</span><h3>Marathon</h3>
        <p>30 questions straight through, with brain breaks.</p>
      </button>
    </div>
    <h2 class="sec">Learn it first, then train it</h2>
    <p class="sechint">Every topic has a short visual walkthrough with memory tricks &mdash; one idea per screen.
      If something feels shaky, hit <b>Learn</b> before you practise it.</p>
    <div class="grid">${topicCards}</div>
    <h2 class="sec">Reference</h2>
    <div class="grid">
      <button class="mode" onclick="showSheet()"><span class="ic">&#128203;</span><h3>Cheat Sheet</h3>
        <p>Everything the teacher said to memorise, on one screen.</p></button>
      <button class="mode" onclick="renderProgress()"><span class="ic">&#128200;</span><h3>Progress</h3>
        <p>${acc!==null?`${S.totalQ} questions answered &middot; ${acc}% overall`:'Nothing tracked yet &mdash; go do a Quick Round.'}</p></button>
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
   LESSONS
   ============================================================ */
let lesson = null;
function startLesson(topic, step){
  if(timerId){ clearInterval(timerId); timerId=null; }
  session = null;
  lesson = { topic, i: step||0 };
  renderLesson();
}
function lessonStep(d){
  const L = LESSONS[lesson.topic];
  lesson.i = Math.max(0, Math.min(L.steps.length-1, lesson.i + d));
  renderLesson();
}
function finishLesson(){
  const t = lesson.topic;
  S.learned = S.learned || [];
  if(!S.learned.includes(t)) S.learned.push(t);
  save();
  start('topic', t);
}
function renderLesson(){
  const L = LESSONS[lesson.topic];
  const T = TOPICS[lesson.topic];
  const st = L.steps[lesson.i];
  const last = lesson.i === L.steps.length-1;
  const dots = L.steps.map((_,i)=>
    `<span class="dot ${i<lesson.i?'done':i===lesson.i?'now':''}" onclick="lesson.i=${i};renderLesson()"></span>`).join('');
  app().innerHTML = `
    <div class="qhead">
      <div class="dots">${dots}</div>
      <button class="ghost" onclick="renderHome()">Exit</button>
    </div>
    <div class="card lesson">
      <div class="lhead">
        <span class="lic">${T.icon}</span>
        <div><div class="ltitle">${L.title}</div>
             <div class="lsub">${L.sub} &middot; step ${lesson.i+1} of ${L.steps.length}</div></div>
      </div>
      <h2 class="lh">${st.h}</h2>
      <div class="lvis">${st.v}</div>
      ${st.b?`<div class="lbody">${st.b}</div>`:''}
      <div class="actions">
        ${lesson.i>0?`<button class="btn alt" onclick="lessonStep(-1)">&larr; Back</button>`:''}
        ${last
          ? `<button class="btn" onclick="finishLesson()">I get it &mdash; practise this &rarr;</button>
             <button class="btn alt sm" onclick="renderHome()">Back home</button>`
          : `<button class="btn" onclick="lessonStep(1)">Next &rarr;</button>`}
      </div>
    </div>`;
  renderHUD();
}

/* ============================================================
   QUESTION
   ============================================================ */
function renderQuestion(){
  const q = session.queue[session.i];
  const T = TOPICS[q.topic] || TOPICS.branches;
  const Co = COACHES[T.coach];
  answered=false; chosen = (q.type==='multi') ? new Array(q.parts.length).fill(null) : null;
  session.usedHint=false;

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
        <div class="ava" style="background:${Co.colour}">${Co.name[0]}</div>
        <div><div class="nm" style="color:${Co.colour}">${Co.name}</div><div class="ln">${Co.line}</div></div>
      </div>`}
      <div class="qtext">${q.q}</div>
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
      return `<input class="tin" id="in0" type="text" autocomplete="off" autocapitalize="words" spellcheck="false"
                placeholder="${q.placeholder||'your answer'}" oninput="liveEnable()" onkeydown="enterKey(event)">`;
    case 'multi':
      return `<div class="parts">` + q.parts.map((p,i)=>
        `<div class="prow"><label>${p.label}</label><div class="mini" id="mini${i}">` +
          p.choices.map((c,j)=>`<button data-p="${i}" data-j="${j}" onclick="choosePart(${i},${j})">${c}</button>`).join('') +
        `</div></div>`).join('') + `</div>`;
    case 'open':
      return `<textarea class="openbox" id="in0" placeholder="Write your answer here. Try it before you look &mdash; writing it out is what makes it stick. Bullet points are fine!"></textarea>`;
  }
  return '';
}

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
  if(q.type==='multi') ok = chosen.every(c=>c!==null);
  else { const el=$('#in0'); ok = el && el.value.trim()!==''; }
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
    const v = parseFloat($('#in0').value.replace(/[,% ]/g,''));
    status = (v===q.a) ? 'right':'wrong';
    $('#in0').classList.add(status==='right'?'right':'wrong');
    $('#in0').disabled=true;
    if(status==='wrong') detail = `You wrote <b>${escapeHTML($('#in0').value.trim())}</b>. The answer is <b>${q.a.toLocaleString()}</b>.`;
  }
  else if(q.type==='text'){
    const raw = $('#in0').value;
    const r = checkText(raw,q);
    status = r.ok ? 'right':'wrong'; note = r.note||'';
    $('#in0').classList.add(r.ok?'right':'wrong');
    $('#in0').disabled=true;
    if(!r.ok) detail = `You wrote <b>${escapeHTML(raw.trim())}</b>. The answer is <b>${q.a[0]}</b>.`;
  }
  else if(q.type==='multi'){
    let right=0;
    q.parts.forEach((p,i)=>{
      const ok = chosen[i]===p.a;
      document.querySelectorAll(`#mini${i} button`).forEach((b,k)=>{
        b.disabled=true;
        if(k===p.a) b.classList.add('right');
        else if(k===chosen[i]) b.classList.add('wrong');
        b.classList.remove('sel');
      });
      if(ok) right++;
    });
    status = right===q.parts.length ? 'right' : right>0 ? 'part' : 'wrong';
    if(status!=='right') detail = `You got <b>${right} of ${q.parts.length}</b> parts right.`;
    q._frac = right/q.parts.length;
  }

  const earned = status==='right' ? q.marks : status==='part' ? Math.round(q.marks*(q._frac||0.5)*2)/2 : 0;
  record(q, status, earned);
  showFeedback(q, status, detail, note);
}

function checkText(raw,q){
  const given = raw.trim();
  if(answerMatches(given,q.a)) return {ok:true};
  const g=norm(given);
  const close = q.a.some(a=>{ const n=norm(a); return n.length>4 && lev(g,n)<=2; });
  if(close) return {ok:true, note:`Close enough &mdash; but the spelling is <b>${q.a[0]}</b>. Write it out once to lock it in.`};
  return {ok:false};
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

function record(q,status,earned){
  session.results[session.i] = { status, earned, max:q.marks, topic:q.topic };
  const st = tstat(q.topic); st.n++; if(status==='right') st.c++; else if(status==='part') st.c+=0.5;
  S.totalQ++; if(status==='right') S.totalC++; else if(status==='part') S.totalC+=0.5;
  if(status==='right'){ S.streak++; if(S.streak>S.bestStreak) S.bestStreak=S.streak; } else S.streak=0;
  save(); renderHUD();
}

function showFeedback(q,status,detail,note){
  const praise = ['Nailed it.','Correct.','That is the one.','Clean.','Exactly right.','Yes &mdash; that is it.','Fangtastic.','Clawsome.'];
  const miss   = ['Not quite.','Close, but no.','Missed that one.','Not this time &mdash; read why.'];
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
  if(session.i>0 && session.i%10===0 && session.queue.length>15) return brainBreak();
  renderQuestion();
}
function brainBreak(){
  app().innerHTML = `<div class="card break">
    <div class="big">&#129504;</div>
    <h2 style="margin:0 0 8px">Brain break.</h2>
    <p style="color:var(--dim);max-width:460px;margin:0 auto 18px">
      You have done ${session.i} questions. Stand up, stretch, get some water, do 10 jumping jacks.
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
  if(pct>=90) msg = `<b>That is test-ready.</b> If you can do this cold, you can do it in the test room. The thing that trips people up now is rushing &mdash; read each question twice on the real paper.`;
  else if(pct>=75) msg = `<b>Solid.</b> You know most of this. Tighten up ${weakest.length?'<b>'+stripTags(TOPICS[weakest[0]].name)+'</b>':'the slow spots'} and you are in great shape.`;
  else if(pct>=55) msg = `<b>Good &mdash; the base is there.</b> Do not try to fix everything at once. Pick ONE topic below and run it until it is boring. Then come back.`;
  else msg = `<b>This is exactly what practice is for.</b> Getting it wrong here is free &mdash; getting it wrong on the test is not. Start with the lowest bar below, one topic at a time.`;

  const retry = weakest.length
    ? `<div class="actions"><span style="color:var(--dim);font-size:14px;width:100%">Weak spots &mdash; learn the idea, then drill it:</span>` +
      weakest.slice(0,3).map(t=>
        `<span class="pairbtn">${LESSONS[t]?`<button class="btn alt sm" onclick="startLesson('${t}')">&#128218; Learn ${TOPICS[t].name}</button>`:''}` +
        `<button class="btn alt sm" onclick="start('topic','${t}')">Drill ${LESSONS[t]?'':TOPICS[t].name}</button></span>`).join('') + `</div>`
    : '';

  app().innerHTML = `
    <div class="card">
      <div class="score">
        <div class="pct">${pct}%</div>
        <div class="sub">${session.label} &middot; ${earned} / ${max} marks &middot; ${done.length} questions &middot; ${mins} min</div>
      </div>
      ${session.mode==='rehearsal'?`<div class="msg" style="border-color:var(--cyan)">
        <b>Dress rehearsal done.</b> ${S.bestRehearsal===pct?'This is your best run so far.':`Your best so far is ${S.bestRehearsal}%.`}
        Remember the self-marked written answers count &mdash; be honest with those and the score means something.</div>`:''}
      <div class="bars">${bars}</div>
      <div class="msg">${msg}</div>
      ${retry}
      <div class="actions">
        <button class="btn" onclick="start('${session.mode}'${session.topic?`,'${session.topic}'`:''})">Run it again</button>
        <button class="btn alt" onclick="renderHome()">Back home</button>
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
  S=Object.assign({},DEFAULT_STATE); S.topics={}; S.learned=[]; save(); renderHome();
}

/* ============================================================
   CHEAT SHEET
   ============================================================ */
function showSheet(){
  const T = rows => `<div class="databox" style="padding:0;overflow:hidden"><table class="dtable sheet">${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table></div>`;
  app().innerHTML = `
    <div class="card">
      <h2 class="sec" style="margin-top:0">Three levels of government</h2>
      ${T([['Federal','Country &mdash; defence, immigration, money, criminal law'],['Provincial','Province &mdash; <b>education</b>, health care, licences'],['Municipal','City &mdash; <b>garbage</b>, <b>local roads</b>, parks, libraries']])}
      <h2 class="sec">Three branches</h2>
      ${T([['Legislative','<b>Makes</b> laws &mdash; Parliament (Sovereign + Senate + House of Commons)'],['Executive','<b>Carries out</b> laws &mdash; PM, Cabinet, departments'],['Judicial','<b>Interprets</b> laws &mdash; courts, judges, Supreme Court']])}
      <h2 class="sec">Important people</h2>
      ${T(PEOPLE.map(p=>[p.pos,p.who]))}
      <h2 class="sec">Abbreviations &amp; must-know differences</h2>
      ${T([['PM / MP','Prime Minister / Member of Parliament'],['PMO','Prime Minister\'s Office &mdash; <b>political</b> support'],['PCO','Privy Council Office &mdash; <b>non-partisan</b> support to PM &amp; Cabinet'],
          ['Commons vs Senate','MPs <b>elected</b> &middot; Senators <b>appointed</b> on PM\'s advice'],['Bill &rarr; law','Intro &rarr; debate &rarr; committee &rarr; vote &rarr; other chamber &rarr; <b>Royal Assent</b>']])}
      <h2 class="sec">Law</h2>
      ${T([['Supreme Court','Highest court in Canada'],['Actus reus','Guilty <b>act</b>'],['Mens rea','Guilty <b>mind</b> <span class="dimline">(sheet spells it "Men\'s Rea")</span>'],
          ['Criminal proof','Beyond a reasonable doubt'],['Civil proof','Balance of probabilities'],['Crown','Represents the state'],['Plaintiff','Brings the claim'],['Defendant','Responds to the claim'],
          ['Precedent','Earlier court decision'],['Negligence','Failing to take reasonable care'],['Trespass','Unlawfully entering property'],['Remedies','Damages (money) or a court order']])}
      <h2 class="sec">Justice</h2>
      ${T([['YCJA','Ages <b>12&ndash;17</b>'],['Deterrence','Discourages crime'],['Rehabilitation','Changes behaviour'],['Restorative','<b>Repairs harm</b>'],['Reintegration','Back to school &amp; community']])}
      <h2 class="sec">Elections</h2>
      ${T([['Can vote','Citizen + 18 on election day'],['Secret ballot','Private voting'],['1921','Agnes Macphail &mdash; first woman in the House of Commons'],['1970','Voting age 21 &rarr; 18'],
          ['FPTP','Most votes wins (no 50% needed)'],['Runoff','Vote again until a majority'],['PR','Seats reflect vote share'],['MMP','Local + proportional']])}
      <div class="msg"><b>Teacher's biggest test tips:</b> the three branches, PMO vs PCO, how a bill becomes law, actus reus vs mens rea, criminal vs civil law, the YCJA, the three approaches to justice, and FPTP vs PR.</div>
      <div class="actions"><button class="btn alt" onclick="renderHome()">Back home</button></div>
    </div>`;
}

/* ============================================================
   KEYBOARD
   ============================================================ */
document.addEventListener('keydown', e=>{
  if(lesson && !session){
    if(e.key==='ArrowRight'||e.key==='Enter'){ e.preventDefault(); lessonStep(1); }
    if(e.key==='ArrowLeft'){ e.preventDefault(); lessonStep(-1); }
    return;
  }
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
