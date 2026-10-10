/* ============================================================
   MONSTER CHEM — question generators
   Every generator returns a fresh randomised question object.
   { topic, cat, type, q, choices?, a, why, hint? }
   type: 'mc' | 'text' | 'number' | 'balance' | 'open' | 'multi'
   cat : 'K' (knowledge) 'T' (thinking) 'C' (communication) 'A' (application)
   ============================================================ */

/* ---------- 1. CLASSIFY REACTION TYPE ---------- */
const RXN_TABLE = [
  [[{c:2,f:'H2'},{c:1,f:'O2'}],[{c:2,f:'H2O'}],'synthesis'],
  [[{c:2,f:'Na'},{c:1,f:'Cl2'}],[{c:2,f:'NaCl'}],'synthesis'],
  [[{c:1,f:'CaO'},{c:1,f:'H2O'}],[{c:1,f:'Ca(OH)2'}],'synthesis'],
  [[{c:1,f:'N2'},{c:3,f:'H2'}],[{c:2,f:'NH3'}],'synthesis'],
  [[{c:2,f:'Al'},{c:3,f:'Br2'}],[{c:2,f:'AlBr3'}],'synthesis'],
  [[{c:1,f:'SO3'},{c:1,f:'H2O'}],[{c:1,f:'H2SO4'}],'synthesis'],
  [[{c:2,f:'H2O'}],[{c:2,f:'H2'},{c:1,f:'O2'}],'decomposition'],
  [[{c:2,f:'KClO3'}],[{c:2,f:'KCl'},{c:3,f:'O2'}],'decomposition'],
  [[{c:1,f:'CaCO3'}],[{c:1,f:'CaO'},{c:1,f:'CO2'}],'decomposition'],
  [[{c:2,f:'H2O2'}],[{c:2,f:'H2O'},{c:1,f:'O2'}],'decomposition'],
  [[{c:2,f:'NaHCO3'}],[{c:1,f:'Na2CO3'},{c:1,f:'H2O'},{c:1,f:'CO2'}],'decomposition'],
  [[{c:2,f:'NaCl'}],[{c:2,f:'Na'},{c:1,f:'Cl2'}],'decomposition'],
  [[{c:1,f:'Zn'},{c:2,f:'HCl'}],[{c:1,f:'ZnCl2'},{c:1,f:'H2'}],'single displacement'],
  [[{c:1,f:'Mg'},{c:2,f:'AgNO3'}],[{c:1,f:'Mg(NO3)2'},{c:2,f:'Ag'}],'single displacement'],
  [[{c:1,f:'Fe'},{c:1,f:'CuSO4'}],[{c:1,f:'FeSO4'},{c:1,f:'Cu'}],'single displacement'],
  [[{c:1,f:'Cl2'},{c:2,f:'NaBr'}],[{c:2,f:'NaCl'},{c:1,f:'Br2'}],'single displacement'],
  [[{c:2,f:'K'},{c:2,f:'H2O'}],[{c:2,f:'KOH'},{c:1,f:'H2'}],'single displacement'],
  [[{c:1,f:'AgNO3'},{c:1,f:'NaCl'}],[{c:1,f:'AgCl'},{c:1,f:'NaNO3'}],'double displacement'],
  [[{c:1,f:'Pb(NO3)2'},{c:2,f:'KI'}],[{c:1,f:'PbI2'},{c:2,f:'KNO3'}],'double displacement'],
  [[{c:1,f:'HCl'},{c:1,f:'NaOH'}],[{c:1,f:'NaCl'},{c:1,f:'H2O'}],'double displacement'],
  [[{c:1,f:'BaCl2'},{c:1,f:'Na2SO4'}],[{c:1,f:'BaSO4'},{c:2,f:'NaCl'}],'double displacement'],
  [[{c:1,f:'H2SO4'},{c:2,f:'KOH'}],[{c:1,f:'K2SO4'},{c:2,f:'H2O'}],'double displacement'],
  [[{c:1,f:'CH4'},{c:2,f:'O2'}],[{c:1,f:'CO2'},{c:2,f:'H2O'}],'combustion'],
  [[{c:1,f:'C3H8'},{c:5,f:'O2'}],[{c:3,f:'CO2'},{c:4,f:'H2O'}],'combustion'],
  [[{c:2,f:'C2H6'},{c:7,f:'O2'}],[{c:4,f:'CO2'},{c:6,f:'H2O'}],'combustion'],
  [[{c:1,f:'C6H12O6'},{c:6,f:'O2'}],[{c:6,f:'CO2'},{c:6,f:'H2O'}],'combustion'],
  [[{c:2,f:'C8H18'},{c:25,f:'O2'}],[{c:16,f:'CO2'},{c:18,f:'H2O'}],'combustion']
];
const RXN_TYPES = ['synthesis','decomposition','single displacement','double displacement','combustion'];
const RXN_WHY = {
  'synthesis':'Two or more substances combine into ONE product. Pattern: A + B &rarr; AB.',
  'decomposition':'ONE substance breaks apart into two or more. Pattern: AB &rarr; A + B.',
  'single displacement':'An ELEMENT swaps places with part of a COMPOUND. Pattern: A + BC &rarr; AC + B.',
  'double displacement':'Two COMPOUNDS swap partners. Pattern: AB + CD &rarr; AD + CB.',
  'combustion':'A hydrocarbon burns in O<sub>2</sub>, giving CO<sub>2</sub> + H<sub>2</sub>O.'
};
function genClassify() {
  const [L, R, type] = pick(RXN_TABLE);
  return {
    topic:'reactions', cat:'K', type:'mc',
    q:'What type of reaction is this?<div class="eqbox">' + eqHTML(L, R) + '</div>',
    choices: RXN_TYPES, a: RXN_TYPES.indexOf(type),
    why: '<b>' + type + '.</b> ' + RXN_WHY[type],
    hint:'Count how many things go IN and how many come OUT. Then check whether they are elements or compounds.'
  };
}

/* ---------- 2. REACTION TYPE FROM A DESCRIPTION ---------- */
const RXN_DESC = [
  ['has only one substance as its reactant','decomposition'],
  ['has an element and a compound as its reactants','single displacement'],
  ['has only ionic compounds as its reactants and products','double displacement'],
  ['combines two or more substances into a single product','synthesis'],
  ['has a hydrocarbon and oxygen as its reactants','combustion'],
  ['always produces carbon dioxide and water','combustion'],
  ['follows the pattern A + BC &rarr; AC + B','single displacement'],
  ['follows the pattern AB + CD &rarr; AD + CB','double displacement'],
  ['follows the pattern AB &rarr; A + B','decomposition'],
  ['follows the pattern A + B &rarr; AB','synthesis'],
  ['can produce a precipitate when two solutions are mixed','double displacement'],
  ['is used by a neutralization reaction between an acid and a base','double displacement']
];
function genRxnDesc() {
  const [d, type] = pick(RXN_DESC);
  return {
    topic:'reactions', cat:'K', type:'mc',
    q:'The type of chemical reaction that ' + d + ' is:',
    choices: RXN_TYPES, a: RXN_TYPES.indexOf(type),
    why:'<b>' + type + '.</b> ' + RXN_WHY[type]
  };
}

/* ---------- 3. COUNT ATOMS  (the Part 2 question) ---------- */
const COUNT_POOL = [
  ['(NH4)3PO4', {N:3,H:12,P:1,O:4}], ['Ca(OH)2', {Ca:1,O:2,H:2}],
  ['Al2(SO4)3', {Al:2,S:3,O:12}],    ['Mg(NO3)2', {Mg:1,N:2,O:6}],
  ['K2Cr2O7', {K:2,Cr:2,O:7}],       ['Fe(OH)3', {Fe:1,O:3,H:3}],
  ['(NH4)2CO3', {N:2,H:8,C:1,O:3}],  ['Ba(ClO3)2', {Ba:1,Cl:2,O:6}],
  ['Cu(CH3COO)2', {Cu:1,C:4,H:6,O:4}], ['Na3PO4', {Na:3,P:1,O:4}],
  ['C6H12O6', {C:6,H:12,O:6}],       ['Pb(NO3)2', {Pb:1,N:2,O:6}],
  ['Zn3(PO4)2', {Zn:3,P:2,O:8}],     ['NH4NO3', {N:2,H:4,O:3}],
  ['Al(HCO3)3', {Al:1,H:3,C:3,O:9}], ['H2SO4', {H:2,S:1,O:4}],
  ['Sr(MnO4)2', {Sr:1,Mn:2,O:8}],    ['(NH4)2SO4', {N:2,H:8,S:1,O:4}]
];
function genCountAtoms() {
  const [f, counts] = pick(COUNT_POOL);
  const coef = 1 + rnd(3);                      // 1, 2 or 3 out front
  const el = pick(Object.keys(counts));
  const total = counts[el] * coef;
  const shown = (coef > 1 ? coef : '') + f;
  const inner = counts[el];
  return {
    topic:'counting', cat:'K', type:'number',
    q:'How many atoms of <b>' + el + '</b> are in <span class="big-formula">' + fmt(shown) + '</span> ?',
    a: total,
    why:'Inside one unit of ' + fmt(f) + ' there ' + (inner === 1 ? 'is' : 'are') + ' <b>' + inner + '</b> ' + el +
        ' atom' + (inner === 1 ? '' : 's') + '.' +
        (coef > 1
          ? ' The big <b>' + coef + '</b> in front multiplies <i>everything</i>: ' + inner + ' &times; ' + coef + ' = <b>' + total + '</b>.'
          : ' There is no coefficient in front, so the answer is just <b>' + total + '</b>.'),
    hint:'Work inside the brackets first, multiply by the bracket subscript, THEN multiply by the big number in front.'
  };
}

/* ---------- 4. IONIC vs MOLECULAR ---------- */
function genIonicOrMolecular() {
  const useIonic = Math.random() < 0.5;
  let f, ans;
  if (useIonic) { f = ionicFormula(pick(CATIONS), pick(ANIONS)); ans = 0; }
  else { f = pick(MOLECULAR)[0]; ans = 1; }
  return {
    topic:'naming', cat:'K', type:'mc',
    q:'Is <span class="big-formula">' + fmt(f) + '</span> ionic or molecular?',
    choices:['Ionic (I)','Molecular (M)'], a: ans,
    why: ans === 0
      ? '<b>Ionic.</b> It starts with a metal (or ammonium, NH<sub>4</sub><sup>+</sup>) joined to a non-metal or a polyatomic ion. Metal + non-metal = ionic.'
      : '<b>Molecular.</b> Every element in it is a <i>non-metal</i>. Two non-metals share electrons, so it is molecular (covalent).',
    hint:'Look at the FIRST element. Metal &rarr; ionic. Non-metal &rarr; molecular. (NH<sub>4</sub> counts as a metal here.)'
  };
}

/* ---------- 5. NAME AN IONIC COMPOUND ---------- */
function genNameIonic() {
  const cat = pick(CATIONS), an = pick(ANIONS);
  const f = ionicFormula(cat, an), name = ionicName(cat, an);
  const accepted = [name];
  if (cat.mv) accepted.push(cat.n + ' (' + ROMAN[cat.ch] + ') ' + an.n);
  return {
    topic:'naming', cat:'C', type:'text',
    q:'Write the IUPAC name of <span class="big-formula">' + fmt(f) + '</span>',
    a: accepted,
    placeholder:'e.g. sodium chloride',
    why:'<b>' + name + '</b><br>' + cat.n + (cat.mv ? ' here has a charge of ' + cat.ch + '+, so you MUST write the Roman numeral (' + ROMAN[cat.ch] + ')' : '') +
        '. The metal keeps its name; the non-metal ending changes to <b>-ide</b>' +
        (an.poly ? '&hellip; except ' + an.n + ' is a <b>polyatomic ion</b>, so you use its name exactly as it is.' : '.'),
    hint: cat.mv
      ? cat.n + ' is multivalent &mdash; work out its charge from the anion, then put it in Roman numerals.'
      : 'Metal name first, then the anion name. Watch out for polyatomic ions.'
  };
}

/* ---------- 6. FORMULA FROM AN IONIC NAME ---------- */
function genFormulaIonic() {
  const cat = pick(CATIONS), an = pick(ANIONS);
  const f = ionicFormula(cat, an), name = ionicName(cat, an);
  return {
    topic:'naming', cat:'T', type:'text',
    q:'Write the chemical formula for <b class="big-name">' + name + '</b>',
    a: [f], exact:true,
    placeholder:'e.g. NaCl  (type numbers normally: Ca(OH)2)',
    why:'<b>' + fmt(f) + '</b><br>' + cat.n + ' is ' + cat.f + '<sup>' + cat.ch + '+</sup> and ' +
        an.n + ' is ' + an.f + '<sup>' + Math.abs(an.ch) + '&minus;</sup>. ' +
        'Criss-cross the charges and reduce. Polyatomic ions need brackets if you need more than one.',
    hint:'Write both ions with their charges, criss-cross, then reduce the subscripts if they share a factor.'
  };
}

/* ---------- 7. NAME / FORMULA FOR MOLECULAR COMPOUNDS ---------- */
function genNameMolecular() {
  const [f, name] = pick(MOLECULAR);
  const toName = Math.random() < 0.5;
  return toName ? {
    topic:'naming', cat:'C', type:'text',
    q:'Write the IUPAC name of the molecular compound <span class="big-formula">' + fmt(f) + '</span>',
    a:[name], placeholder:'e.g. carbon dioxide',
    why:'<b>' + name + '</b><br>Molecular compounds use <b>prefixes</b> for the number of each atom: mono, di, tri, tetra, penta, hexa, hepta, octa, nona, deca. The first element skips "mono". The second element always gets a prefix and ends in <b>-ide</b>.',
    hint:'Count the atoms of each element and turn those numbers into prefixes.'
  } : {
    topic:'naming', cat:'T', type:'text',
    q:'Write the chemical formula for <b class="big-name">' + name + '</b>',
    a:[f], exact:true, placeholder:'e.g. CO2',
    why:'<b>' + fmt(f) + '</b><br>Each prefix becomes a subscript. No prefix on the first element means 1.',
    hint:'Turn each prefix straight into a subscript.'
  };
}

/* ---------- 8. BALANCING EQUATIONS ---------- */
const BALANCE_POOL = [
  [[{c:4,f:'C'},{c:1,f:'S8'}],[{c:4,f:'CS2'}]],
  [[{c:3,f:'Li'},{c:1,f:'AlF3'}],[{c:3,f:'LiF'},{c:1,f:'Al'}]],
  [[{c:2,f:'H3PO4'},{c:3,f:'Ca(OH)2'}],[{c:1,f:'Ca3(PO4)2'},{c:6,f:'H2O'}]],
  [[{c:2,f:'C2H6'},{c:7,f:'O2'}],[{c:4,f:'CO2'},{c:6,f:'H2O'}]],
  [[{c:1,f:'CH4'},{c:2,f:'O2'}],[{c:1,f:'CO2'},{c:2,f:'H2O'}]],
  [[{c:1,f:'C3H8'},{c:5,f:'O2'}],[{c:3,f:'CO2'},{c:4,f:'H2O'}]],
  [[{c:2,f:'H2'},{c:1,f:'O2'}],[{c:2,f:'H2O'}]],
  [[{c:2,f:'Na'},{c:1,f:'Cl2'}],[{c:2,f:'NaCl'}]],
  [[{c:2,f:'KClO3'}],[{c:2,f:'KCl'},{c:3,f:'O2'}]],
  [[{c:1,f:'N2'},{c:3,f:'H2'}],[{c:2,f:'NH3'}]],
  [[{c:4,f:'Al'},{c:3,f:'O2'}],[{c:2,f:'Al2O3'}]],
  [[{c:1,f:'Zn'},{c:2,f:'HCl'}],[{c:1,f:'ZnCl2'},{c:1,f:'H2'}]],
  [[{c:2,f:'Mg'},{c:1,f:'O2'}],[{c:2,f:'MgO'}]],
  [[{c:1,f:'Fe2O3'},{c:3,f:'CO'}],[{c:2,f:'Fe'},{c:3,f:'CO2'}]],
  [[{c:2,f:'H2O2'}],[{c:2,f:'H2O'},{c:1,f:'O2'}]],
  [[{c:1,f:'Pb(NO3)2'},{c:2,f:'KI'}],[{c:1,f:'PbI2'},{c:2,f:'KNO3'}]],
  [[{c:1,f:'H2SO4'},{c:2,f:'NaOH'}],[{c:1,f:'Na2SO4'},{c:2,f:'H2O'}]],
  [[{c:2,f:'C4H10'},{c:13,f:'O2'}],[{c:8,f:'CO2'},{c:10,f:'H2O'}]],
  [[{c:1,f:'CaCO3'}],[{c:1,f:'CaO'},{c:1,f:'CO2'}]],
  [[{c:2,f:'Fe'},{c:3,f:'Cl2'}],[{c:2,f:'FeCl3'}]],
  [[{c:1,f:'BaCl2'},{c:1,f:'Na2SO4'}],[{c:1,f:'BaSO4'},{c:2,f:'NaCl'}]],
  [[{c:3,f:'Ca'},{c:1,f:'N2'}],[{c:1,f:'Ca3N2'}]],
  [[{c:2,f:'AgNO3'},{c:1,f:'CaCl2'}],[{c:2,f:'AgCl'},{c:1,f:'Ca(NO3)2'}]],
  [[{c:2,f:'C8H18'},{c:25,f:'O2'}],[{c:16,f:'CO2'},{c:18,f:'H2O'}]],
  [[{c:1,f:'P4'},{c:5,f:'O2'}],[{c:2,f:'P2O5'}]],
  [[{c:2,f:'NaHCO3'}],[{c:1,f:'Na2CO3'},{c:1,f:'H2O'},{c:1,f:'CO2'}]],
  [[{c:2,f:'Al'},{c:6,f:'HCl'}],[{c:2,f:'AlCl3'},{c:3,f:'H2'}]],
  [[{c:1,f:'C6H12O6'},{c:6,f:'O2'}],[{c:6,f:'CO2'},{c:6,f:'H2O'}]],
  [[{c:2,f:'KI'},{c:1,f:'Cl2'}],[{c:2,f:'KCl'},{c:1,f:'I2'}]],
  [[{c:1,f:'SO2'},{c:1,f:'H2O'}],[{c:1,f:'H2SO3'}]]
];
function genBalance() {
  const [L, R] = pick(BALANCE_POOL);
  return {
    topic:'balancing', cat:'T', type:'balance',
    q:'Balance this skeleton equation. Type a coefficient in every box (use 1 where nothing is needed).',
    left: L, right: R,
    a: L.map(t => t.c).concat(R.map(t => t.c)),
    why:'Balanced: <div class="eqbox">' + eqHTML(L, R) + '</div>Atoms are never created or destroyed &mdash; every element must have the same number of atoms on both sides.',
    hint:'Leave single elements (like O<sub>2</sub> or Al) for LAST. Balance metals first, then non-metals, then H, then O.'
  };
}

/* ---------- 9. ACTIVITY SERIES ---------- */
function genActivity() {
  const anion = pick([
    { f:'Cl', n:'chloride', ch:-1 }, { f:'Br', n:'bromide', ch:-1 },
    { f:'NO3', n:'nitrate', ch:-1, poly:true }, { f:'SO4', n:'sulfate', ch:-2, poly:true }
  ]);
  const metals = ACTIVITY.filter(m => m !== 'H');
  let A = pick(metals), B = pick(metals);
  while (A === B) B = pick(metals);
  const compound = ionicFormula({ f:B, ch:METAL_CHARGE[B] }, anion);
  const reacts = moreReactive(A, B);
  const product = ionicFormula({ f:A, ch:METAL_CHARGE[A] }, anion);

  if (Math.random() < 0.5) {
    return {
      topic:'activity', cat:'T', type:'mc',
      q:'Use the Activity Series. Will a reaction happen?<div class="eqbox">' + fmt(A + '(s)') + ' + ' + fmt(compound + '(aq)') + ' <span class="arrow">&rarr;</span> ?</div>',
      choices:['Yes &mdash; a reaction happens','No reaction'], a: reacts ? 0 : 1,
      why: reacts
        ? '<b>Yes.</b> ' + METAL_NAME[A] + ' is <b>higher</b> (more reactive) than ' + METAL_NAME[B] +
          ' on the Activity Series, so it kicks ' + METAL_NAME[B] + ' out:<div class="eqbox">' +
          fmt(A + '(s)') + ' + ' + fmt(compound + '(aq)') + ' <span class="arrow">&rarr;</span> ' + fmt(product + '(aq)') + ' + ' + fmt(B + '(s)') + '</div>'
        : '<b>No reaction.</b> ' + METAL_NAME[A] + ' is <b>lower</b> (less reactive) than ' + METAL_NAME[B] +
          ' on the Activity Series. A less reactive metal cannot push out a more reactive one.',
      hint:'Find both metals on the list. The lone metal must be ABOVE the one in the compound for anything to happen.',
      series:true
    };
  }
  return {
    topic:'activity', cat:'T', type:'mc',
    q:'Use the Activity Series to predict the products:<div class="eqbox">' + fmt(A + '(s)') + ' + ' + fmt(compound + '(aq)') + ' <span class="arrow">&rarr;</span> ?</div>',
    choices:[ fmt(product + '(aq)') + ' + ' + fmt(B + '(s)'), 'No reaction',
              fmt(B + '(s)') + ' + ' + fmt(A + '(s)'), fmt(compound + '(s)') + ' + ' + fmt(A + '(aq)') ],
    a: reacts ? 0 : 1, raw:true,
    why: reacts
      ? METAL_NAME[A] + ' sits above ' + METAL_NAME[B] + ' on the Activity Series, so it replaces it. The ' + anion.n +
        ' stays with the new metal, and solid ' + METAL_NAME[B] + ' drops out.'
      : METAL_NAME[A] + ' sits below ' + METAL_NAME[B] + ' on the Activity Series, so <b>no reaction</b> happens.',
    hint:'Higher on the list = more reactive = it wins.',
    series:true
  };
}

/* ---------- 10. pH FACTOR MATHS (most-missed question on this unit) ---------- */
function genPHFactor() {
  const d = 1 + rnd(3);
  const lowBase = [4.5, 5.5, 3.0, 2.0, 6.5, 1.0][rnd(6)];
  const low = lowBase, high = +(low + d).toFixed(1);
  const factor = Math.pow(10, d);
  const foods = [['lemon juice','milk'],['vinegar','tomato juice'],['yogurt','cheese'],['cola','black coffee'],['stomach acid','orange juice']];
  const [fa, fb] = pick(foods);
  return {
    topic:'ph', cat:'T', type:'number',
    q:'How many times <b>more acidic</b> is ' + fa + ' (pH ' + low + ') than ' + fb + ' (pH ' + high + ')?',
    a: factor,
    placeholder:'just the number',
    why:'The pH scale is <b>logarithmic</b> &mdash; each whole pH step is a factor of <b>10</b>, not 1.<br>' +
        'Difference in pH = ' + high + ' &minus; ' + low + ' = <b>' + d + '</b><br>' +
        'So the factor is 10<sup>' + d + '</sup> = <b>' + factor.toLocaleString() + ' times</b> more acidic.',
    hint:'Subtract the two pH values first. Then the answer is 10 to the power of that difference.'
  };
}
function genPHDirection() {
  const from = 2 + rnd(9);
  const dir = Math.random() < 0.5;
  const to = dir ? from - 1 : from + 1;
  const acidUp = to < from;
  return {
    topic:'ph', cat:'T', type:'mc',
    q:'If the pH of a solution changes from <b>' + from + '</b> to <b>' + to + '</b>, has the acidity increased or decreased?',
    choices:['Increased','Decreased'], a: acidUp ? 0 : 1,
    why: acidUp
      ? '<b>Increased.</b> pH went DOWN, and lower pH = more acidic. It is now 10&times; more acidic.'
      : '<b>Decreased.</b> pH went UP, and higher pH = less acidic (more basic). It is now 10&times; less acidic.',
    hint:'Low pH = acid. High pH = base. The pH number moves the OPPOSITE way to acidity.'
  };
}

/* ---------- 11. ACIDS: binary vs oxoacid, naming ---------- */
function genAcidKind() {
  const a = pick(ACIDS);
  const want = Math.random() < 0.5 ? 'binary' : 'oxoacid';
  const pool = ACIDS.filter(x => x.kind === want);
  const target = pick(pool);
  const others = shuffle(ACIDS.filter(x => x.kind !== want)).slice(0, 3);
  const choices = shuffle([target].concat(others));
  return {
    topic:'acids', cat:'K', type:'mc',
    q:'Which of the following is ' + (want === 'binary' ? 'a <b>binary acid</b>' : 'an <b>oxoacid</b>') + '?',
    choices: choices.map(c => fmt(c.f)), a: choices.indexOf(target), raw:true,
    why:'<b>' + fmt(target.f) + '</b> (' + target.n + ').<br>' +
        'A <b>binary acid</b> has hydrogen + ONE other element and no oxygen (HCl, HF, H<sub>2</sub>S).<br>' +
        'An <b>oxoacid</b> contains hydrogen, oxygen and one more element &mdash; it comes from a polyatomic ion (HNO<sub>3</sub>, H<sub>2</sub>SO<sub>4</sub>).',
    hint:'Does the formula contain oxygen? Oxygen &rarr; oxoacid. No oxygen &rarr; binary acid.'
  };
}
function genAcidName() {
  const a = pick(ACIDS);
  const toName = Math.random() < 0.5;
  return toName ? {
    topic:'acids', cat:'K', type:'text',
    q:'Name the acid <span class="big-formula">' + fmt(a.f) + '</span>',
    a:[a.n], placeholder:'e.g. hydrochloric acid',
    why:'<b>' + a.n + '</b> &mdash; ' + (a.kind === 'binary'
      ? 'binary acids are named <i>hydro&ndash;(stem)&ndash;ic acid</i>.'
      : 'oxoacids come from polyatomic ions: &ndash;ate becomes <b>&ndash;ic acid</b>, &ndash;ite becomes <b>&ndash;ous acid</b>.')
  } : {
    topic:'acids', cat:'K', type:'text',
    q:'Write the formula for <b class="big-name">' + a.n + '</b>',
    a:[a.f], exact:true, placeholder:'e.g. HCl',
    why:'<b>' + fmt(a.f) + '</b>. Acids start with H. Add enough hydrogens to cancel the charge of the anion.'
  };
}

/* ---------- 12. LITMUS / CLASSIFY SOLUTION ---------- */
function genLitmus() {
  const kinds = [
    ['acid',   'Turns blue litmus RED',  'Stays red'],
    ['base',   'Stays blue',             'Turns red litmus BLUE'],
    ['neutral','Stays blue',             'Stays red']
  ];
  const [kind, blue, red] = pick(kinds);
  return {
    topic:'acids', cat:'T', type:'mc',
    q:'A solution is tested with litmus paper:<div class="databox"><b>Red litmus paper:</b> ' + red +
      '<br><b>Blue litmus paper:</b> ' + blue + '</div>Is the solution acidic, basic, or neutral?',
    choices:['Acidic','Basic','Neutral'], a:['acid','base','neutral'].indexOf(kind),
    why:'<b>' + (kind === 'acid' ? 'Acidic' : kind === 'base' ? 'Basic' : 'Neutral') + '.</b><br>' +
        'Remember: <b>acids turn blue litmus red</b>. <b>Bases turn red litmus blue</b>. If NOTHING changes colour, it is neutral.',
    hint:'Only ONE paper changing colour tells you the answer. If neither changes, it is neutral.'
  };
}

/* ---------- 13. WORD -> BALANCED EQUATION (Part 6, Application) ---------- */
const WORD_EQ = [
  ['When magnesium metal reacts with oxygen gas, a solid magnesium oxide forms.',
   'magnesium + oxygen &rarr; magnesium oxide',
   '2Mg(s) + O2(g) &rarr; 2MgO(s)', 'synthesis'],
  ['An aqueous solution of sodium chloride reacts with fluorine gas to form an aqueous solution of sodium fluoride and chlorine gas.',
   'sodium chloride + fluorine &rarr; sodium fluoride + chlorine',
   '2NaCl(aq) + F2(g) &rarr; 2NaF(aq) + Cl2(g)', 'single displacement'],
  ['Aqueous solutions of barium sulfate and sodium hydroxide react to form a precipitate of barium hydroxide and aqueous sodium sulfate.',
   'barium sulfate + sodium hydroxide &rarr; barium hydroxide + sodium sulfate',
   'BaSO4(aq) + 2NaOH(aq) &rarr; Ba(OH)2(s) + Na2SO4(aq)', 'double displacement'],
  ['Propane gas (C3H8) reacts with oxygen gas to produce carbon dioxide gas and water vapour.',
   'propane + oxygen &rarr; carbon dioxide + water',
   'C3H8(g) + 5O2(g) &rarr; 3CO2(g) + 4H2O(g)', 'combustion'],
  ['Solid calcium carbonate is heated and breaks down into solid calcium oxide and carbon dioxide gas.',
   'calcium carbonate &rarr; calcium oxide + carbon dioxide',
   'CaCO3(s) &rarr; CaO(s) + CO2(g)', 'decomposition'],
  ['Zinc metal is placed in hydrochloric acid, producing aqueous zinc chloride and hydrogen gas.',
   'zinc + hydrochloric acid &rarr; zinc chloride + hydrogen',
   'Zn(s) + 2HCl(aq) &rarr; ZnCl2(aq) + H2(g)', 'single displacement'],
  ['Aqueous lead(II) nitrate reacts with aqueous potassium iodide to form a yellow precipitate of lead(II) iodide and aqueous potassium nitrate.',
   'lead(II) nitrate + potassium iodide &rarr; lead(II) iodide + potassium nitrate',
   'Pb(NO3)2(aq) + 2KI(aq) &rarr; PbI2(s) + 2KNO3(aq)', 'double displacement'],
  ['Hydrochloric acid is neutralized by aqueous sodium hydroxide, producing aqueous sodium chloride and liquid water.',
   'hydrochloric acid + sodium hydroxide &rarr; sodium chloride + water',
   'HCl(aq) + NaOH(aq) &rarr; NaCl(aq) + H2O(l)', 'double displacement (neutralization)'],
  ['Methane gas burns completely in oxygen gas to produce carbon dioxide gas and water vapour.',
   'methane + oxygen &rarr; carbon dioxide + water',
   'CH4(g) + 2O2(g) &rarr; CO2(g) + 2H2O(g)', 'combustion'],
  ['Solid aluminum reacts with chlorine gas to produce solid aluminum chloride.',
   'aluminum + chlorine &rarr; aluminum chloride',
   '2Al(s) + 3Cl2(g) &rarr; 2AlCl3(s)', 'synthesis']
];
function genWordEq() {
  const [desc, word, balanced, type] = pick(WORD_EQ);
  return {
    topic:'application', cat:'A', type:'open',
    q:'<div class="databox">' + desc + '</div>Write the <b>word equation</b> and the <b>balanced chemical equation</b>. Include the states of matter.',
    model:'<b>Word equation:</b><div class="eqbox">' + word + '</div>' +
          '<b>Balanced equation:</b><div class="eqbox">' + fmt(balanced.replace('&rarr;', '→')).replace('→', '<span class="arrow">&rarr;</span>') + '</div>' +
          '<b>Reaction type:</b> ' + type,
    why:'Marks come from: correct formulas, correct balancing, AND the states of matter in brackets. Students lose easy marks by forgetting the states.',
    hint:'1. Turn the words into formulas.  2. Balance it.  3. Add (s), (l), (g) or (aq) to every substance.'
  };
}

/* ---------- 14. PREDICT THE PRODUCTS ---------- */
const PREDICT = [
  ['Al(s) + O2(g)', ['Al2O3','AlO','Al3O2','Al(OH)3'], 0,
   'Aluminum is Al<sup>3+</sup> and oxygen is O<sup>2&minus;</sup>. Criss-cross: Al<sub>2</sub>O<sub>3</sub>.'],
  ['C4H10(g) + O2(g)', ['CO2 and H2O','CO and H2O','carbon atoms and hydrogen gas','oxygen gas'], 0,
   'Butane is a hydrocarbon, so this is COMBUSTION. Complete combustion always gives carbon dioxide and water.'],
  ['Mg(s) + O2(g)', ['MgO','Mg2O','MgO2','Mg(OH)2'], 0,
   'Mg<sup>2+</sup> with O<sup>2&minus;</sup> &mdash; the charges cancel 1:1, so MgO.'],
  ['Na(s) + Cl2(g)', ['NaCl','Na2Cl','NaCl2','NaClO'], 0,
   'Na<sup>+</sup> with Cl<sup>&minus;</sup> gives a 1:1 ratio: NaCl.'],
  ['H2CO3(aq)', ['H2O and CO2','H2 and CO3','H2O and CO','HCO3 and H'], 0,
   'Carbonic acid is unstable and decomposes into water and carbon dioxide &mdash; that is the fizz in pop.'],
  ['Ca(s) + F2(g)', ['CaF2','CaF','Ca2F','CaF3'], 0,
   'Ca<sup>2+</sup> with F<sup>&minus;</sup> needs two fluorides to balance the charge: CaF<sub>2</sub>.'],
  ['HCl(aq) + KOH(aq)', ['KCl and H2O','KH and ClOH','KClO and H2','KCl and H2'], 0,
   'Acid + base = NEUTRALIZATION. The products are always a <b>salt + water</b>.'],
  ['Li(s) + N2(g)', ['Li3N','LiN','Li2N3','LiN3'], 0,
   'Li<sup>+</sup> with N<sup>3&minus;</sup> needs three lithiums: Li<sub>3</sub>N.']
];
function genPredict() {
  const [react, choices, ans, why] = pick(PREDICT);
  const order = shuffle(choices.map((c, i) => [c, i]));
  return {
    topic:'reactions', cat:'T', type:'mc',
    q:'Predict the product(s) for this reaction:<div class="eqbox">' + fmt(react) + ' <span class="arrow">&rarr;</span> ?</div>',
    choices: order.map(o => fmt(o[0])), a: order.findIndex(o => o[1] === ans), raw:true,
    why: why,
    hint:'Work out the charge on each ion, then criss-cross. For a hydrocarbon + O<sub>2</sub>, it is always CO<sub>2</sub> + H<sub>2</sub>O.'
  };
}

/* ---------- 15. COUNT ATOMS, ALL ELEMENTS (Part 2 style, multi-part) ---------- */
function genCountAtomsMulti() {
  const [f, counts] = pick(COUNT_POOL);
  const coef = 1 + rnd(3);
  const shown = (coef > 1 ? coef : '') + f;
  const els = Object.keys(counts);
  const NAMES = {H:'Hydrogen',C:'Carbon',N:'Nitrogen',O:'Oxygen',P:'Phosphorus',S:'Sulfur',Na:'Sodium',
    K:'Potassium',Ca:'Calcium',Mg:'Magnesium',Al:'Aluminum',Zn:'Zinc',Fe:'Iron',Cu:'Copper',Ba:'Barium',
    Pb:'Lead',Cl:'Chlorine',Cr:'Chromium',Mn:'Manganese',Sr:'Strontium'};
  return {
    topic:'counting', cat:'K', type:'multi',
    q:'How many atoms of each element are in <span class="big-formula">' + fmt(shown) + '</span> ?',
    parts: els.map(e => ({ label:(NAMES[e]||e) + ' (' + e + ')', type:'number', a: counts[e] * coef })),
    why:'Inside one ' + fmt(f) + ': ' + els.map(e => e + ' = ' + counts[e]).join(', ') + '.' +
        (coef > 1
          ? '<br>The <b>' + coef + '</b> in front multiplies every single one:<br>' +
            els.map(e => e + ' = ' + counts[e] + ' &times; ' + coef + ' = <b>' + counts[e] * coef + '</b>').join('<br>')
          : '<br>There is no coefficient in front, so those are your answers.'),
    hint:'Brackets first: multiply what is inside by the bracket subscript. THEN multiply everything by the big number in front.'
  };
}
