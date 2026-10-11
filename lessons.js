/* ============================================================
   MONSTER CHEM — visual lessons
   Each lesson is a series of short steps. One idea per screen,
   every step carries a diagram.
   ============================================================ */

/* ---------- tiny SVG toolkit ---------- */
const SV = (w,h,inner) => `<svg class="dia" style="max-width:${w}px" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;
const AT = (x,y,l,c,r=21) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><text x="${x}" y="${y}" class="al">${l}</text>`;
const AR = (x,y,w=52) =>
  `<line x1="${x}" y1="${y}" x2="${x+w-10}" y2="${y}" class="arl"/>` +
  `<polygon points="${x+w},${y} ${x+w-12},${y-7} ${x+w-12},${y+7}" class="arh"/>`;
const PLUS = (x,y) => `<text x="${x}" y="${y}" class="op">+</text>`;
const LBL = (x,y,t,cls='cap') => `<text x="${x}" y="${y}" class="${cls}">${t}</text>`;
const BOX = (x,y,w,h,c,dash) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="none" stroke="${c}" stroke-width="2"${dash?' stroke-dasharray="6 5"':''}/>`;
const C = { pink:'#FF2E88', purple:'#A855F7', acid:'#B9FF2E', cyan:'#22E0D6',
            warn:'#FFC53D', good:'#3DDC7F', bad:'#FF5470', dim:'#6B5A80' };

/* a reaction-pattern diagram: groups of atoms, arrow, groups of atoms */
function pattern(left, right, caption){
  const GAP=30, R=21, pad=26;
  const gw = g => g.length*(R*2) + (g.length-1)*6 + 22;
  const lw = left.reduce((a,g)=>a+gw(g),0) + (left.length-1)*GAP;
  const rw = right.reduce((a,g)=>a+gw(g),0) + (right.length-1)*GAP;
  const W = pad + lw + 70 + rw + pad, H = caption?104:76, cy=42;
  let x = pad, s = '';
  const draw = groups => {
    groups.forEach((g,gi)=>{
      if(gi){ s += PLUS(x+GAP/2-4, cy+7); x += GAP; }
      const w = gw(g);
      if(g.length>1) s += BOX(x-2, cy-R-9, w+4, (R+9)*2, C.dim, true);
      g.forEach((a,ai)=>{ s += AT(x+11+R+ai*(R*2+6), cy, a[0], a[1]); });
      x += w;
    });
  };
  draw(left);
  s += AR(x+9, cy, 52); x += 70;
  draw(right);
  if(caption) s += LBL(W/2, H-10, caption, 'cap mid');
  return SV(W,H,s);
}

/* a balance-scale tally */
function tally(rows, title){
  const W=420, rowH=34, H=40+rows.length*rowH+8;
  let s = LBL(14,24,title||'Atom count','cap');
  s += `<line x1="${W/2}" y1="34" x2="${W/2}" y2="${H-6}" stroke="${C.dim}" stroke-width="1.5" stroke-dasharray="4 4"/>`;
  rows.forEach((r,i)=>{
    const y = 40+i*rowH+22;
    const ok = r[1]===r[2];
    s += LBL(20,y,r[0],'el');
    s += LBL(W/2-30,y, r[1], ok?'num ok':'num no');
    s += LBL(W/2+30,y, r[2], ok?'num ok':'num no');
    s += LBL(W-34,y, ok?'✓':'✗', ok?'tick ok':'tick no');
  });
  s += LBL(W/2-30, 30, 'left', 'mini');
  s += LBL(W/2+30, 30, 'right','mini');
  return SV(W,H,s);
}

/* pH colour strip */
function phStrip(marks){
  const W=560,H=marks?118:66, x0=20, bw=(W-40)/15;
  const col = i => i<3?'#FF3B30' : i<6?'#FF8A3D' : i<7?'#FFC53D' : i===7?'#3DDC7F' : i<11?'#22E0D6' : i<13?'#4D8BFF' : '#A855F7';
  let s='';
  for(let i=0;i<15;i++){
    s += `<rect x="${x0+i*bw}" y="18" width="${bw-1.5}" height="30" rx="3" fill="${col(i)}" opacity="${i===7?1:.88}"/>`;
    s += LBL(x0+i*bw+bw/2-1, 62, i, 'phn');
  }
  s += LBL(x0, 12, 'MORE ACIDIC', 'mini start');
  s += LBL(W-20, 12, 'MORE BASIC', 'mini end');
  s += LBL(x0+7.5*bw-1, 12, 'NEUTRAL', 'mini mid');
  if(marks) marks.forEach(m=>{
    const cx = x0+(m[0]+0.5)*bw-1;
    s += `<line x1="${cx}" y1="48" x2="${cx}" y2="${m[2]||74}" stroke="${C.dim}" stroke-width="1.5"/>`;
    s += LBL(cx, (m[2]||74)+14, m[1], 'phlab');
  });
  return SV(W,H,s);
}

/* ============================================================
   LESSON CONTENT
   ============================================================ */
const LESSONS = {

/* ---------------------------------------------------------- */
reactions: { title:'Reaction Types', sub:'Five patterns. That is the whole topic.', steps:[
 { h:'A reaction just rearranges atoms',
   b:'Nothing is created and nothing disappears. The same atoms you start with are the ones you end with &mdash; they just get grouped differently. Every single reaction type below is one way of regrouping.',
   v: pattern([[['A',C.pink],['B',C.cyan]],[['C',C.acid]]], [[['A',C.pink]],[['B',C.cyan],['C',C.acid]]], 'same atoms, new partners') },

 { h:'1. Synthesis &mdash; things join up',
   b:'Two or more simple things combine into <b>one</b> bigger product. If the right-hand side has only one substance, it is synthesis.<div class="exline">2Na + Cl<sub>2</sub> &rarr; 2NaCl</div>',
   v: pattern([[['A',C.pink]],[['B',C.cyan]]], [[['A',C.pink],['B',C.cyan]]], 'A + B → AB') },

 { h:'2. Decomposition &mdash; things fall apart',
   b:'The exact reverse. <b>One</b> substance breaks into two or more. If the left-hand side has only one substance, it is decomposition.<div class="exline">CaCO<sub>3</sub> &rarr; CaO + CO<sub>2</sub></div>',
   v: pattern([[['A',C.pink],['B',C.cyan]]], [[['A',C.pink]],[['B',C.cyan]]], 'AB → A + B') },

 { h:'3. Single displacement &mdash; one gets swapped out',
   b:'A lone <b>element</b> meets a <b>compound</b> and kicks one part out, taking its place. Look for an element on its own on the left.<div class="exline">Zn + 2HCl &rarr; ZnCl<sub>2</sub> + H<sub>2</sub></div>',
   v: pattern([[['A',C.pink]],[['B',C.warn],['C',C.cyan]]], [[['A',C.pink],['C',C.cyan]],[['B',C.warn]]], 'A + BC → AC + B') },

 { h:'4. Double displacement &mdash; two pairs swap',
   b:'Two <b>compounds</b> trade partners. Both sides have two compounds. This is the one that makes precipitates, and neutralization is a type of it.<div class="exline">AgNO<sub>3</sub> + NaCl &rarr; AgCl + NaNO<sub>3</sub></div>',
   v: pattern([[['A',C.pink],['B',C.cyan]],[['C',C.warn],['D',C.acid]]], [[['A',C.pink],['D',C.acid]],[['C',C.warn],['B',C.cyan]]], 'AB + CD → AD + CB') },

 { h:'5. Combustion &mdash; fuel burns',
   b:'A hydrocarbon (only C and H) burns in oxygen. The products are <b>always</b> carbon dioxide and water. Memorise this one &mdash; it is free marks.<div class="exline">CH<sub>4</sub> + 2O<sub>2</sub> &rarr; CO<sub>2</sub> + 2H<sub>2</sub>O</div>',
   v: pattern([[['C',C.pink],['H',C.cyan]],[['O',C.acid],['O',C.acid]]], [[['C',C.pink],['O',C.acid],['O',C.acid]],[['H',C.cyan],['H',C.cyan],['O',C.acid]]], 'fuel + O₂ → CO₂ + H₂O') },

 { h:'How to tell them apart in 5 seconds',
   b:'Do not try to remember definitions. Just count things and follow this.',
   v: flow([
     ['Only ONE thing on the left?','DECOMPOSITION',C.purple],
     ['Only ONE thing on the right?','SYNTHESIS',C.pink],
     ['Is it a hydrocarbon + O₂?','COMBUSTION',C.warn],
     ['An element + a compound?','SINGLE DISPLACEMENT',C.cyan],
     ['Two compounds swapping?','DOUBLE DISPLACEMENT',C.acid]
   ]) }
]},

/* ---------------------------------------------------------- */
balancing: { title:'Balancing Equations', sub:'Make both sides hold the same atoms.', steps:[
 { h:'Why we balance at all',
   b:'Atoms cannot be created or destroyed. So whatever goes in must come out. If you count 4 hydrogens on the left, there must be 4 on the right. An unbalanced equation is saying atoms vanished &mdash; which is impossible.',
   v: scale() },

 { h:'Coefficients vs subscripts',
   b:'This is the rule people break. The <b>big number in front</b> is a coefficient &mdash; you may change it freely. The <b>small number inside</b> is a subscript &mdash; changing it makes a different chemical entirely.',
   v: coefVsSub() },

 { h:'What a coefficient actually does',
   b:'It multiplies <b>everything</b> in that formula. So 2H<sub>2</sub>O is two whole water molecules &mdash; that is 4 hydrogen atoms and 2 oxygen atoms, not 2 and 1.',
   v: coefExpand() },

 { h:'Worked example, step by step',
   b:'Start: <b>H<sub>2</sub> + O<sub>2</sub> &rarr; H<sub>2</sub>O</b>. Count what you have. Oxygen is 2 on the left but only 1 on the right, so it does not balance yet.',
   v: tally([['H',2,2],['O',2,1]], 'H₂ + O₂ → H₂O') },

 { h:'Fix the worst one first',
   b:'Put a <b>2</b> in front of H<sub>2</sub>O. That fixes oxygen, but now hydrogen is 2 on the left against 4 on the right. Fixing one thing breaking another is completely normal &mdash; keep going.',
   v: tally([['H',2,4],['O',2,2]], 'H₂ + O₂ → 2H₂O') },

 { h:'Then clean up',
   b:'Put a <b>2</b> in front of H<sub>2</sub> as well. Now every element matches on both sides. Done.<div class="exline">2H<sub>2</sub> + O<sub>2</sub> &rarr; 2H<sub>2</sub>O</div>',
   v: tally([['H',4,4],['O',2,2]], '2H₂ + O₂ → 2H₂O  ✓') },

 { h:'The order that saves time',
   b:'Balancing in a random order is why it takes forever. Use this order every time and lone elements sort themselves out at the end.',
   v: flow([
     ['1. Metals','first',C.pink],
     ['2. Non-metals (not H or O)','second',C.purple],
     ['3. Hydrogen','third',C.cyan],
     ['4. Oxygen','fourth',C.acid],
     ['5. Anything alone (O₂, Al, Cl₂)','LAST',C.warn]
   ]) }
]},

/* ---------------------------------------------------------- */
naming: { title:'Naming Compounds', sub:'Two families, two sets of rules.', steps:[
 { h:'First: which family is it?',
   b:'Everything depends on this one question. Look at the <b>first element</b>. A metal means ionic. A non-metal means molecular. Ammonium (NH<sub>4</sub>) counts as a metal here.',
   v: twoFamilies() },

 { h:'Ionic: metal first, then &ndash;ide',
   b:'Write the metal name unchanged, then the non-metal with its ending changed to <b>&ndash;ide</b>. No prefixes are ever used for ionic compounds.<div class="exline">NaCl = sodium chlor<b>ide</b><br>MgO = magnesium ox<b>ide</b></div>',
   v: nameSplit('NaCl','sodium','chloride',C.pink,C.cyan) },

 { h:'Polyatomic ions keep their own name',
   b:'Some anions are whole groups of atoms with their own names. They do <b>not</b> get &ndash;ide &mdash; you write the name exactly as it is. Learn these; they appear constantly.<div class="exline">NaNO<sub>3</sub> = sodium <b>nitrate</b><br>CaSO<sub>4</sub> = calcium <b>sulfate</b></div>',
   v: polyGrid() },

 { h:'&ndash;ate vs &ndash;ite: one atom apart',
   b:'This single letter costs more marks than anything else on the test. The <b>&ndash;ite</b> version has <b>one fewer oxygen</b> than the <b>&ndash;ate</b> version. Same for acids: &ndash;ate becomes &ndash;ic acid, &ndash;ite becomes &ndash;ous acid.',
   v: ateVsIte() },

 { h:'Multivalent metals need a Roman numeral',
   b:'Some metals can form more than one charge, so the name must say which one. Iron can be Fe<sup>2+</sup> or Fe<sup>3+</sup>, and those build different compounds. The numeral is the <b>charge</b>, not how many atoms.',
   v: multivalent() },

 { h:'Criss-cross to build the formula',
   b:'Going from a name to a formula: write both ions with charges, then drop each charge down as the <b>other</b> one&rsquo;s subscript. Reduce if they share a factor. Brackets go round a polyatomic ion if you need more than one.',
   v: crissCross() },

 { h:'Molecular: count with prefixes',
   b:'Two non-metals use prefixes instead of charges &mdash; just count the atoms. The first element skips &ldquo;mono&rdquo;. The second always gets a prefix and ends in <b>&ndash;ide</b>.',
   v: prefixTable() }
]},

/* ---------------------------------------------------------- */
counting: { title:'Counting Atoms', sub:'Three numbers, three jobs.', steps:[
 { h:'A subscript counts the atom in front of it',
   b:'The small number applies <b>only</b> to the symbol immediately before it. No number means one.',
   v: countSimple() },

 { h:'A bracket subscript hits everything inside',
   b:'When a subscript sits outside a bracket, it multiplies <b>every</b> atom inside that bracket &mdash; not just the last one.',
   v: countBracket() },

 { h:'A coefficient multiplies the whole thing',
   b:'The big number out front multiplies the entire formula, brackets and all. It is the last thing you apply.',
   v: countCoef() },

 { h:'Put all three together',
   b:'This is the exact question from the test. Work from the inside out: bracket contents, then bracket subscript, then the coefficient out front.',
   v: countFull() }
]},

/* ---------------------------------------------------------- */
activity: { title:'Activity Series', sub:'A ranking of how badly a metal wants to react.', steps:[
 { h:'It is just a league table',
   b:'The metals are listed from the most desperate to react at the top, down to the ones that barely react at all. Gold sits at the bottom &mdash; which is exactly why gold jewellery never tarnishes.',
   v: ladder() },

 { h:'The only rule you need',
   b:'A lone metal can push another metal out of its compound <b>only if it is higher</b> on the list. Higher beats lower. Lower does nothing.',
   v: ladderRule() },

 { h:'When it works',
   b:'Zinc is above copper, so zinc wins. It takes the sulfate and copper drops out as a solid metal.<div class="exline">Zn (s) + CuSO<sub>4</sub> (aq) &rarr; ZnSO<sub>4</sub> (aq) + Cu (s)</div>',
   v: ladderCase('Zn','Cu',true) },

 { h:'When nothing happens',
   b:'Copper is below zinc, so copper cannot displace it. Write <b>no reaction</b> &mdash; that is the full answer and it earns the mark.<div class="exline">Cu (s) + ZnSO<sub>4</sub> (aq) &rarr; no reaction</div>',
   v: ladderCase('Cu','Zn',false) },

 { h:'Try it yourself',
   b:'Pick any two metals and check the verdict. Do a few until the "higher wins" idea feels obvious.',
   v: '<div id="apick"></div>' + ladder(), after:'mountPicker' }
]},

/* ---------------------------------------------------------- */
acids: { title:'Acids & Bases', sub:'Two opposites and the scale between them.', steps:[
 { h:'The pH scale, visually',
   b:'Below 7 is acidic. Above 7 is basic. Exactly 7 is neutral &mdash; pure water. The further from 7, the stronger it is.',
   v: phStrip([[1,'stomach acid'],[2,'lemon'],[4,'orange juice',88],[6,'milk'],[7,'water',88],[9,'baking soda'],[11,'ammonia',88],[13,'bleach']]) },

 { h:'Acids',
   b:'Taste <b>sour</b> &mdash; lemons, vinegar. pH below 7. They release H<sup>+</sup> ions in water and react with metals to give off hydrogen gas.',
   v: propCard('ACIDS', ['pH less than 7','Taste sour','Turn blue litmus RED','React with metals → H₂','Release H⁺ ions'], C.bad) },

 { h:'Bases',
   b:'Taste <b>bitter</b> and feel <b>slippery</b> &mdash; think soap. pH above 7. They release OH<sup>&minus;</sup> ions in water.',
   v: propCard('BASES', ['pH greater than 7','Taste bitter','Feel slippery','Turn red litmus BLUE','Release OH⁻ ions'], C.cyan) },

 { h:'Litmus paper, both ways',
   b:'There are two papers and you need both. Only one will change. If <b>neither</b> changes, the solution is neutral &mdash; that is the part people forget.',
   v: litmus() },

 { h:'Neutralization',
   b:'An acid and a base cancel each other out. The products are <b>always</b> a salt and water. Learn this sentence word for word.<div class="exline">HCl + NaOH &rarr; NaCl + H<sub>2</sub>O<br><span class="dimline">acid + base &rarr; salt + water</span></div>',
   v: pattern([[['H',C.bad],['Cl',C.warn]],[['Na',C.cyan],['OH',C.good]]], [[['Na',C.cyan],['Cl',C.warn]],[['H',C.bad],['OH',C.good]]], 'acid + base → salt + water') }
]},

/* ---------------------------------------------------------- */
ph: { title:'The pH Scale', sub:'Why one step means ten times.', steps:[
 { h:'Each step is ×10, not +1',
   b:'This is the whole topic. pH is a <b>logarithmic</b> scale. Going down one pH unit means ten times more acidic &mdash; not one unit more.',
   v: logBars() },

 { h:'Which way is which',
   b:'Lower pH means more acidic. Higher pH means more basic. The pH number moves the <b>opposite</b> way to acidity, which is why this trips people up.',
   v: phStrip([[2,'pH 2 = strongly acidic'],[7,'neutral',88],[12,'pH 12 = strongly basic']]) },

 { h:'The method',
   b:'Always two steps, in this order. Subtract first, then raise 10 to that power. Never subtract and give that as the answer.',
   v: phMethod() },

 { h:'Worked example',
   b:'How many times more acidic is pH 2 than pH 5?<br>Difference = 5 &minus; 2 = <b>3</b>. Answer = 10<sup>3</sup> = <b>1000 times</b>.',
   v: logBars(3) },

 { h:'The trap',
   b:'A pH difference of 1 is <b>10</b> times, not 100. Cheese at pH 5.5 and yogurt at pH 4.5 differ by exactly 1, so yogurt is <b>10&times;</b> more acidic. Decimal pH values still work the same way &mdash; just subtract.',
   v: trapCard() }
]},

/* ---------------------------------------------------------- */
application: { title:'Word Equations', sub:'From a sentence to a balanced equation.', steps:[
 { h:'Always the same three steps',
   b:'These questions look hard because they are long. They are not &mdash; it is the same pipeline every time. Do the steps in order and never skip the last one.',
   v: pipeline() },

 { h:'Step 1 — words to formulas',
   b:'Translate each name into a formula. Ionic compounds get criss-crossed, molecular ones use prefixes. Watch for the diatomic elements, which never travel alone.',
   v: diatomic() },

 { h:'Step 2 — balance it',
   b:'Same as any balancing question. Metals, then non-metals, then H, then O, then lone elements last.',
   v: tally([['Mg',2,2],['O',2,2]], '2Mg + O₂ → 2MgO  ✓') },

 { h:'Step 3 — add the states',
   b:'This is where easy marks get thrown away. <b>Every</b> substance needs a state in brackets. If the question says "aqueous solution" or "solid" or "gas", it is telling you the answer.',
   v: statesTable() },

 { h:'Where the marks come from',
   b:'A typical 3-mark question is split like this. You can get the chemistry right and still lose a third of the marks by leaving the states off.',
   v: markSplit() }
]},

/* ---------------------------------------------------------- */
communication: { title:'Explain It', sub:'How to write answers that score.', steps:[
 { h:'Communication marks reward the WHY',
   b:'These questions are not testing whether you know the fact. They are testing whether you can explain it. A correct answer with no reasoning usually gets half the marks.',
   v: whyCard() },

 { h:'Use this shape every time',
   b:'Answer the question, give the reason, then back it up. Three short sentences beats one long vague one.',
   v: flow([
     ['CLAIM','Answer the actual question asked',C.pink],
     ['REASON','Because… / This happens since…',C.purple],
     ['EVIDENCE','Name the rule, series or value',C.cyan]
   ]) },

 { h:'Count the marks, then count your points',
   b:'A [C&ndash;4] question wants <b>four</b> separate things. If you have written two sentences, you cannot have four marks. Check the number in brackets and make sure you have that many distinct points.',
   v: annotated() },

 { h:'What loses marks',
   b:'Almost every lost communication mark is one of these five.',
   v: flow([
     ['Answering only half','"acids AND bases" means both',C.bad],
     ['No reason given','State WHY, not just what',C.bad],
     ['Wrong term','Activity Series ≠ pH scale',C.bad],
     ['Too vague','"it reacts" says nothing',C.bad],
     ['Forgetting units or states','(s) (l) (g) (aq)',C.bad]
   ]) }
]}
};

/* ============================================================
   DIAGRAM HELPERS  (function declarations — hoisted, so the
   LESSONS object above can call them while it is being built)
   ============================================================ */

function flow(rows){
  return '<div class="flow">' + rows.map(r=>
    `<div class="frow" style="--fc:${r[2]}"><div class="fq">${r[0]}</div>
     <div class="fa">${r[1]}</div></div>`).join('') + '</div>';
}

function scale(){
  const s = `<line x1="200" y1="150" x2="200" y2="52" stroke="${C.dim}" stroke-width="4"/>
    <polygon points="200,150 176,186 224,186" fill="${C.dim}"/>
    <line x1="74" y1="52" x2="326" y2="52" stroke="${C.purple}" stroke-width="5" stroke-linecap="round"/>
    <line x1="74" y1="52" x2="74" y2="78" stroke="${C.dim}" stroke-width="2"/>
    <line x1="326" y1="52" x2="326" y2="78" stroke="${C.dim}" stroke-width="2"/>
    <rect x="22" y="78" width="104" height="46" rx="10" fill="none" stroke="${C.pink}" stroke-width="2"/>
    <rect x="274" y="78" width="104" height="46" rx="10" fill="none" stroke="${C.cyan}" stroke-width="2"/>
    ${AT(50,101,'H',C.pink,15)}${AT(82,101,'H',C.pink,15)}${AT(112,101,'O',C.acid,15)}
    ${AT(302,101,'H',C.pink,15)}${AT(334,101,'H',C.pink,15)}${AT(364,101,'O',C.acid,15)}
    ${LBL(74,142,'REACTANTS','mini mid')}${LBL(326,142,'PRODUCTS','mini mid')}
    ${LBL(200,206,'same atoms on both sides = balanced','cap mid')}`;
  return SV(400,216,s);
}

function coefVsSub(){
  return `<div class="cmp">
    <div class="cmpc" style="--cc:${C.good}"><div class="cmpf">2H<sub>2</sub>O</div>
      <div class="cmpt">coefficient</div><div class="cmpd">Two whole water molecules.<br><b>You may change this.</b></div></div>
    <div class="cmpc" style="--cc:${C.bad}"><div class="cmpf">H<sub>2</sub>O<sub>2</sub></div>
      <div class="cmpt">changed subscript</div><div class="cmpd">Not water any more &mdash; this is hydrogen peroxide.<br><b>Never change this.</b></div></div>
  </div>`;
}

function coefExpand(){
  const s = `${LBL(16,34,'2H₂O','bigf')}
    ${LBL(120,34,'means','cap')}
    <rect x="178" y="10" width="92" height="46" rx="10" fill="none" stroke="${C.dim}" stroke-width="1.5" stroke-dasharray="5 4"/>
    ${AT(200,33,'H',C.pink,13)}${AT(226,33,'H',C.pink,13)}${AT(252,33,'O',C.acid,13)}
    <rect x="282" y="10" width="92" height="46" rx="10" fill="none" stroke="${C.dim}" stroke-width="1.5" stroke-dasharray="5 4"/>
    ${AT(304,33,'H',C.pink,13)}${AT(330,33,'H',C.pink,13)}${AT(356,33,'O',C.acid,13)}
    ${LBL(16,82,'total:','cap')}
    ${LBL(74,82,'4 × H','numbig')}${LBL(152,82,'2 × O','numbig')}`;
  return SV(400,96,s);
}

function twoFamilies(){
  return `<div class="cmp">
    <div class="cmpc" style="--cc:${C.pink}"><div class="cmpt">metal + non-metal</div>
      <div class="cmpf2">IONIC</div>
      <div class="cmpd">NaCl · MgO · Fe<sub>2</sub>O<sub>3</sub> · CaSO<sub>4</sub><br><br>
      Charges cancel out. <b>No prefixes.</b> Roman numerals if the metal is multivalent.</div></div>
    <div class="cmpc" style="--cc:${C.cyan}"><div class="cmpt">non-metal + non-metal</div>
      <div class="cmpf2">MOLECULAR</div>
      <div class="cmpd">CO<sub>2</sub> · NF<sub>3</sub> · Cl<sub>2</sub>O<sub>7</sub> · SF<sub>6</sub><br><br>
      Atoms are shared. <b>Prefixes always.</b> Never a Roman numeral.</div></div>
  </div>`;
}

function nameSplit(f,a,b,ca,cb){
  const s = `${LBL(200,40,f,'bigf mid')}
    <line x1="150" y1="56" x2="118" y2="86" stroke="${ca}" stroke-width="2"/>
    <line x1="250" y1="56" x2="282" y2="86" stroke="${cb}" stroke-width="2"/>
    <rect x="30" y="88" width="176" height="42" rx="10" fill="none" stroke="${ca}" stroke-width="2"/>
    <rect x="214" y="88" width="176" height="42" rx="10" fill="none" stroke="${cb}" stroke-width="2"/>
    ${LBL(118,115,a,'nm mid')}${LBL(302,115,b,'nm mid')}
    ${LBL(118,150,'metal, unchanged','mini mid')}${LBL(302,150,'non-metal + IDE','mini mid')}`;
  return SV(420,162,s);
}

function polyGrid(){
  const ions = [['NO₃⁻','nitrate'],['SO₄²⁻','sulfate'],['CO₃²⁻','carbonate'],['PO₄³⁻','phosphate'],
                ['OH⁻','hydroxide'],['NH₄⁺','ammonium'],['HCO₃⁻','hydrogen carbonate'],['CH₃COO⁻','acetate']];
  return '<div class="iongrid">' + ions.map(i=>
    `<div class="ioncell"><span class="ionf">${i[0]}</span><span class="ionn">${i[1]}</span></div>`).join('') + '</div>';
}

function ateVsIte(){
  const s = `<rect x="18" y="14" width="172" height="92" rx="12" fill="none" stroke="${C.acid}" stroke-width="2"/>
    <rect x="212" y="14" width="172" height="92" rx="12" fill="none" stroke="${C.warn}" stroke-width="2"/>
    ${LBL(104,44,'SO₄²⁻','bigf mid')}${LBL(298,44,'SO₃²⁻','bigf mid')}
    ${LBL(104,70,'sulfATE','nm mid')}${LBL(298,70,'sulfITE','nm mid')}
    ${LBL(104,94,'4 oxygens','mini mid')}${LBL(298,94,'3 oxygens — one fewer','mini mid')}
    ${LBL(200,130,'as an acid: H₂SO₄ = sulfurIC acid   ·   H₂SO₃ = sulfurOUS acid','cap mid')}`;
  return SV(402,142,s);
}

function multivalent(){
  const s = `${LBL(200,26,'iron can be either','cap mid')}
    <rect x="16" y="40" width="174" height="80" rx="12" fill="none" stroke="${C.cyan}" stroke-width="2"/>
    <rect x="212" y="40" width="174" height="80" rx="12" fill="none" stroke="${C.pink}" stroke-width="2"/>
    ${LBL(103,72,'Fe²⁺','bigf mid')}${LBL(299,72,'Fe³⁺','bigf mid')}
    ${LBL(103,98,'iron(II) chloride','nm mid')}${LBL(299,98,'iron(III) chloride','nm mid')}
    ${LBL(103,114,'FeCl₂','mini mid')}${LBL(299,114,'FeCl₃','mini mid')}
    ${LBL(200,142,'the numeral is the CHARGE, not the number of atoms','cap mid')}`;
  return SV(402,154,s);
}

function crissCross(){
  const ah = (x1,y1,x2,y2,col) => {
    const a = Math.atan2(y2-y1, x2-x1), L = 11, w = 5;
    const p = (ang,d) => [x2 - d*Math.cos(a+ang), y2 - d*Math.sin(a+ang)];
    const [ax,ay] = p(0.42,L), [bx,by] = p(-0.42,L);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="2.2"/>` +
           `<polygon points="${x2},${y2} ${ax},${ay} ${bx},${by}" fill="${col}"/>`;
  };
  const s = `${LBL(104,44,'Al³⁺','bigf mid')}${LBL(236,44,'O²⁻','bigf mid')}
    ${ah(126,56,224,92,C.pink)}
    ${ah(214,56,116,92,C.cyan)}
    ${LBL(104,112,'Al₂','bigf mid')}${LBL(236,112,'O₃','bigf mid')}
    ${LBL(104,138,'got O’s 2','mini mid')}${LBL(236,138,'got Al’s 3','mini mid')}
    ${AR(292,86,44)}
    ${LBL(404,96,'Al₂O₃','bigf mid')}
    ${LBL(250,172,'each charge drops down as the OTHER one’s subscript','cap mid')}
    ${LBL(250,192,'then reduce if they share a common factor','mini mid')}`;
  return SV(500,204,s);
}
function prefixTable(){
  const p=[[1,'mono'],[2,'di'],[3,'tri'],[4,'tetra'],[5,'penta'],[6,'hexa'],[7,'hepta'],[8,'octa'],[9,'nona'],[10,'deca']];
  return '<div class="prefgrid">' + p.map(x=>
    `<div class="prefcell"><span class="prefn">${x[0]}</span><span class="prefw">${x[1]}</span></div>`).join('') +
    `</div><div class="exline" style="margin-top:12px">Cl<sub>2</sub>O<sub>7</sub> = <b>di</b>chlorine <b>hept</b>oxide<br>
     <span class="dimline">first element skips "mono" · drop the final a/o before "oxide"</span></div>`;
}

function countSimple(){
  const s = `${LBL(30,46,'H₂O','bigf')}
    <line x1="60" y1="56" x2="60" y2="78" stroke="${C.pink}" stroke-width="2"/>
    <line x1="92" y1="56" x2="92" y2="78" stroke="${C.acid}" stroke-width="2"/>
    ${LBL(60,96,'2 H','numbig mid')}${LBL(92,96,'1 O','numbig mid')}
    ${LBL(220,52,'the 2 belongs to H only.','cap')}
    ${LBL(220,76,'O has no number, so it is 1.','cap')}`;
  return SV(420,110,s);
}

function countBracket(){
  const s = `${LBL(30,46,'Ca(OH)₂','bigf')}
    <rect x="62" y="22" width="56" height="34" rx="8" fill="none" stroke="${C.warn}" stroke-width="2"/>
    <line x1="90" y1="58" x2="90" y2="80" stroke="${C.warn}" stroke-width="2"/>
    ${LBL(90,100,'everything inside × 2','cap mid')}
    ${LBL(250,46,'Ca = 1','numbig')}${LBL(250,74,'O = 1 × 2 = 2','numbig')}${LBL(250,100,'H = 1 × 2 = 2','numbig')}`;
  return SV(420,114,s);
}

function countCoef(){
  const s = `${LBL(30,48,'3','bigf')}${LBL(56,48,'Ca(OH)₂','bigf')}
    <circle cx="38" cy="40" r="22" fill="none" stroke="${C.pink}" stroke-width="2"/>
    <line x1="38" y1="64" x2="38" y2="84" stroke="${C.pink}" stroke-width="2"/>
    ${LBL(38,102,'×3 on ALL of it','cap mid')}
    ${LBL(250,48,'Ca = 3','numbig')}${LBL(250,76,'O = 6','numbig')}${LBL(250,102,'H = 6','numbig')}`;
  return SV(420,116,s);
}

function countFull(){
  return `<div class="steps3">
    <div class="s3"><span class="s3n">1</span><div><b>Inside the bracket</b><br>
      NH<sub>4</sub> → N = 1, H = 4</div></div>
    <div class="s3"><span class="s3n">2</span><div><b>Bracket subscript ×3</b><br>
      (NH<sub>4</sub>)<sub>3</sub> → N = 3, H = 12 &nbsp;·&nbsp; then PO<sub>4</sub> → P = 1, O = 4</div></div>
    <div class="s3"><span class="s3n">3</span><div><b>Coefficient ×2 on everything</b><br>
      <span class="hl">N = 6 &nbsp; H = 24 &nbsp; P = 2 &nbsp; O = 8</span></div></div>
    <div class="exline" style="margin-top:4px">2(NH<sub>4</sub>)<sub>3</sub>PO<sub>4</sub></div></div>`;
}

function ladder(hi){
  return '<div class="ladder"><div class="lcap">MOST REACTIVE</div>' +
    ACTIVITY.map(m=>`<div class="lrow${hi&&hi.includes(m)?' on':''}">
      <span class="lsym">${m}</span><span class="lnm">${METAL_NAME[m]}</span></div>`).join('') +
    '<div class="lcap">LEAST REACTIVE</div></div>';
}
function ladderRule(){
  return `<div class="rulecard">
    <div class="rrow" style="--rc:${C.good}"><b>Higher</b> metal meets a <b>lower</b> metal&rsquo;s compound
      <span class="rres ok">REACTION HAPPENS</span></div>
    <div class="rrow" style="--rc:${C.bad}"><b>Lower</b> metal meets a <b>higher</b> metal&rsquo;s compound
      <span class="rres no">NO REACTION</span></div>
  </div>` + ladder();
}
function ladderCase(a,b,works){
  return `<div class="casebar ${works?'ok':'no'}">
    <span class="cm">${METAL_NAME[a]}</span>
    <span class="cvs">${works?'is ABOVE':'is BELOW'}</span>
    <span class="cm">${METAL_NAME[b]}</span>
    <span class="cres">${works?'→ it wins, reaction happens':'→ it cannot win, no reaction'}</span>
  </div>` + ladder([a,b]);
}

function propCard(title,items,col){
  return `<div class="propc" style="--pc:${col}"><div class="propt">${title}</div><ul>` +
    items.map(i=>`<li>${i}</li>`).join('') + '</ul></div>';
}

function litmus(){
  const sw=(c,l)=>`<div class="sw"><span class="swb" style="background:${c}"></span><span>${l}</span></div>`;
  return `<div class="litmus">
    <div class="litcol"><div class="litt" style="color:${C.bad}">IN ACID</div>
      ${sw('#E8453C','red paper stays RED')}${sw('#E8453C','blue paper turns RED')}</div>
    <div class="litcol"><div class="litt" style="color:${C.cyan}">IN BASE</div>
      ${sw('#3B7DE8','red paper turns BLUE')}${sw('#3B7DE8','blue paper stays BLUE')}</div>
    <div class="litcol"><div class="litt" style="color:${C.good}">IN NEUTRAL</div>
      ${sw('#E8453C','red stays red')}${sw('#3B7DE8','blue stays blue')}
      <div class="litnote">nothing changes</div></div></div>`;
}

function logBars(hi){
  const rows=[[0,'1×','same'],[1,'10×','one pH step'],[2,'100×','two pH steps'],[3,'1000×','three pH steps']];
  return '<div class="logb">' + rows.map(r=>
    `<div class="lbrow${hi===r[0]?' on':''}"><span class="lbn">${r[1]}</span>
      <span class="lbbar"><span style="width:${[4,14,45,100][r[0]]}%"></span></span>
      <span class="lbl2">${r[2]}</span></div>`).join('') + '</div>';
}

function phMethod(){
  return `<div class="steps3">
    <div class="s3"><span class="s3n">1</span><div><b>Subtract the two pH values</b><br>
      bigger pH − smaller pH = the difference</div></div>
    <div class="s3"><span class="s3n">2</span><div><b>Raise 10 to that power</b><br>
      10<sup>difference</sup> = how many times more acidic</div></div></div>`;
}

function trapCard(){
  return `<div class="cmp">
    <div class="cmpc" style="--cc:${C.bad}"><div class="cmpt">the common mistake</div>
      <div class="cmpf2">100×</div><div class="cmpd">Treating a 1-unit difference as if it were two steps.</div></div>
    <div class="cmpc" style="--cc:${C.good}"><div class="cmpt">correct</div>
      <div class="cmpf2">10×</div><div class="cmpd">pH 5.5 → pH 4.5 is a difference of 1, so 10<sup>1</sup> = 10 times.</div></div>
  </div>`;
}

function pipeline(){
  return flow([
    ['WORDS','The sentence in the question',C.purple],
    ['FORMULAS','Criss-cross or prefixes',C.pink],
    ['BALANCE','Coefficients until both sides match',C.cyan],
    ['STATES','(s) (l) (g) (aq) on every substance',C.acid]
  ]);
}

function diatomic(){
  return `<div class="diat"><div class="diatt">These seven NEVER appear alone</div>
    <div class="diatr">${['H₂','N₂','O₂','F₂','Cl₂','Br₂','I₂'].map(d=>`<span class="dcell">${d}</span>`).join('')}</div>
    <div class="dimline">If a question says "oxygen gas", you write O<sub>2</sub>, not O.</div></div>`;
}

function statesTable(){
  const r=[['(s)','solid','a metal, a precipitate'],['(l)','liquid','pure liquid water'],
           ['(g)','gas','anything described as a gas or vapour'],['(aq)','aqueous','dissolved in water, "a solution of…"']];
  return '<div class="sttab">' + r.map(x=>
    `<div class="strow"><span class="stk">${x[0]}</span><span class="stn">${x[1]}</span><span class="std">${x[2]}</span></div>`
  ).join('') + '</div>';
}

function markSplit(){
  return `<div class="msplit">
    <div class="mrow" style="--mc:${C.pink}"><span class="mk">1</span><span>Correct formulas for every substance</span></div>
    <div class="mrow" style="--mc:${C.purple}"><span class="mk">1</span><span>Equation correctly balanced</span></div>
    <div class="mrow" style="--mc:${C.acid}"><span class="mk">1</span><span>States of matter on every substance</span></div>
    <div class="dimline" style="margin-top:10px">Perfect chemistry with no states = 2 out of 3.</div></div>`;
}

function whyCard(){
  return `<div class="cmp">
    <div class="cmpc" style="--cc:${C.bad}"><div class="cmpt">half marks</div>
      <div class="cmpd" style="font-size:15px">&ldquo;No reaction.&rdquo;<br><br>
      True, but it explains nothing.</div></div>
    <div class="cmpc" style="--cc:${C.good}"><div class="cmpt">full marks</div>
      <div class="cmpd" style="font-size:15px">&ldquo;No reaction, <b>because</b> copper is <b>below</b> zinc on the <b>Activity Series</b>, so it cannot displace it.&rdquo;</div></div>
  </div>`;
}

function annotated(){
  return `<div class="annot">
    <div class="aq">Distinguish between acids and bases. Mention at least 2 properties of each. <b>[C–4]</b></div>
    <div class="aline">Acids have a pH below 7 <span class="amk">1</span></div>
    <div class="aline">and they turn blue litmus red. <span class="amk">2</span></div>
    <div class="aline">Bases have a pH above 7 <span class="amk">3</span></div>
    <div class="aline">and they feel slippery. <span class="amk">4</span></div>
    <div class="dimline" style="margin-top:10px">Four marks asked for, four distinct points given. Short sentences are fine.</div>
  </div>`;
}

/* interactive Activity Series picker */
function mountPicker(){
  const host = document.getElementById('apick');
  if(!host) return;
  const opts = ACTIVITY.filter(m=>m!=='H').map(m=>`<option value="${m}">${METAL_NAME[m]}</option>`).join('');
  host.innerHTML = `<div class="picker">
      <select id="pA">${opts}</select>
      <span class="pmid">added to a solution of</span>
      <select id="pB">${opts}</select>
      <span class="pmid">chloride</span>
    </div><div id="pout" class="pout"></div>`;
  const A=document.getElementById('pA'), B=document.getElementById('pB');
  A.value='Zn'; B.value='Cu';
  const upd=()=>{
    const a=A.value,b=B.value, out=document.getElementById('pout');
    if(a===b){ out.className='pout'; out.innerHTML='Pick two different metals.'; return; }
    const win = moreReactive(a,b);
    out.className = 'pout '+(win?'ok':'no');
    out.innerHTML = win
      ? `<b>Reaction happens.</b> ${METAL_NAME[a]} is above ${METAL_NAME[b]}, so it displaces it.
         <div class="exline">${fmt(a+'(s)')} + ${fmt(ionicFormula({f:b,ch:METAL_CHARGE[b]},{f:'Cl',ch:-1})+'(aq)')}
         <span class="arrow">&rarr;</span> ${fmt(ionicFormula({f:a,ch:METAL_CHARGE[a]},{f:'Cl',ch:-1})+'(aq)')} + ${fmt(b+'(s)')}</div>`
      : `<b>No reaction.</b> ${METAL_NAME[a]} is below ${METAL_NAME[b]} on the series, so it cannot displace it.`;
    document.querySelectorAll('#apick ~ .ladder .lrow, .ladder .lrow').forEach(el=>{
      const sym = el.querySelector('.lsym').textContent;
      el.classList.toggle('on', sym===a||sym===b);
    });
  };
  A.onchange=upd; B.onchange=upd; upd();
}

/* hooks that run after a lesson step is injected into the page */
const LESSON_HOOKS = { mountPicker };
