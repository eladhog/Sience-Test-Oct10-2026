/* ============================================================
   MONSTER CHEM — chemistry core
   formula formatting, ion tables, naming, criss-cross, activity series
   ============================================================ */

const GCD = (a, b) => (b ? GCD(b, a % b) : a);
const rnd = n => Math.floor(Math.random() * n);
const pick = arr => arr[rnd(arr.length)];
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* --- format a chemical formula into HTML with subscripts, leaving (s)(l)(g)(aq) alone --- */
const STATE_TOK = { '(aq)': '①', '(s)': '②', '(g)': '③', '(l)': '④' };
const TOK_STATE = { '①': 'aq', '②': 's', '③': 'g', '④': 'l' };
function fmt(f) {
  if (f == null) return '';
  let s = String(f).replace(/\((aq|s|g|l)\)/g, m => STATE_TOK[m]);
  s = s.replace(/([A-Za-z\)])(\d+)/g, '$1<sub>$2</sub>');
  s = s.replace(/[①-④]/g, t => '<span class="state">(' + TOK_STATE[t] + ')</span>');
  return s;
}
/* strip states, for comparing */
const bare = f => String(f).replace(/\((aq|s|g|l)\)/g, '');

/* --- render a full equation --- */
function eqHTML(left, right) {
  const side = arr => arr.map(t => (t.c && t.c > 1 ? t.c : '') + fmt(t.f)).join(' + ');
  return side(left) + ' <span class="arrow">&rarr;</span> ' + side(right);
}

/* ============================================================
   IONS
   ============================================================ */
const CATIONS = [
  { f: 'Li',  n: 'lithium',   ch: 1 },
  { f: 'Na',  n: 'sodium',    ch: 1 },
  { f: 'K',   n: 'potassium', ch: 1 },
  { f: 'Ag',  n: 'silver',    ch: 1 },
  { f: 'NH4', n: 'ammonium',  ch: 1, poly: true },
  { f: 'Mg',  n: 'magnesium', ch: 2 },
  { f: 'Ca',  n: 'calcium',   ch: 2 },
  { f: 'Ba',  n: 'barium',    ch: 2 },
  { f: 'Sr',  n: 'strontium', ch: 2 },
  { f: 'Zn',  n: 'zinc',      ch: 2 },
  { f: 'Al',  n: 'aluminum',  ch: 3 },
  /* multivalent -> need Roman numerals */
  { f: 'Fe',  n: 'iron',      ch: 2, mv: true }, { f: 'Fe', n: 'iron',   ch: 3, mv: true },
  { f: 'Cu',  n: 'copper',    ch: 1, mv: true }, { f: 'Cu', n: 'copper', ch: 2, mv: true },
  { f: 'Pb',  n: 'lead',      ch: 2, mv: true }, { f: 'Pb', n: 'lead',   ch: 4, mv: true },
  { f: 'Sn',  n: 'tin',       ch: 2, mv: true }, { f: 'Sn', n: 'tin',    ch: 4, mv: true },
  { f: 'Cr',  n: 'chromium',  ch: 2, mv: true }, { f: 'Cr', n: 'chromium', ch: 3, mv: true },
  { f: 'Mn',  n: 'manganese', ch: 2, mv: true }, { f: 'Mn', n: 'manganese', ch: 4, mv: true },
  { f: 'Co',  n: 'cobalt',    ch: 2, mv: true }, { f: 'Co', n: 'cobalt', ch: 3, mv: true },
  { f: 'Ni',  n: 'nickel',    ch: 2, mv: true }
];
const ANIONS = [
  { f: 'F',  n: 'fluoride',  ch: -1 },
  { f: 'Cl', n: 'chloride',  ch: -1 },
  { f: 'Br', n: 'bromide',   ch: -1 },
  { f: 'I',  n: 'iodide',    ch: -1 },
  { f: 'O',  n: 'oxide',     ch: -2 },
  { f: 'S',  n: 'sulfide',   ch: -2 },
  { f: 'N',  n: 'nitride',   ch: -3 },
  { f: 'P',  n: 'phosphide', ch: -3 },
  { f: 'NO3',    n: 'nitrate',            ch: -1, poly: true },
  { f: 'NO2',    n: 'nitrite',            ch: -1, poly: true },
  { f: 'OH',     n: 'hydroxide',          ch: -1, poly: true },
  { f: 'HCO3',   n: 'hydrogen carbonate', ch: -1, poly: true },
  { f: 'CH3COO', n: 'acetate',            ch: -1, poly: true },
  { f: 'ClO3',   n: 'chlorate',           ch: -1, poly: true },
  { f: 'MnO4',   n: 'permanganate',       ch: -1, poly: true },
  { f: 'CN',     n: 'cyanide',            ch: -1, poly: true },
  { f: 'SO4',    n: 'sulfate',            ch: -2, poly: true },
  { f: 'SO3',    n: 'sulfite',            ch: -2, poly: true },
  { f: 'CO3',    n: 'carbonate',          ch: -2, poly: true },
  { f: 'CrO4',   n: 'chromate',           ch: -2, poly: true },
  { f: 'Cr2O7',  n: 'dichromate',         ch: -2, poly: true },
  { f: 'PO4',    n: 'phosphate',          ch: -3, poly: true },
  { f: 'PO3',    n: 'phosphite',          ch: -3, poly: true }
];
const ROMAN = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII' };

/* criss-cross with reduction */
function ionicFormula(cat, an) {
  const a = cat.ch, b = Math.abs(an.ch);
  const g = GCD(a, b);
  const nc = b / g, na = a / g;
  const wrap = (ion, n) => n > 1 ? (ion.poly ? '(' + ion.f + ')' + n : ion.f + n) : ion.f;
  return wrap(cat, nc) + wrap(an, na);
}
function ionicName(cat, an) {
  return cat.n + (cat.mv ? '(' + ROMAN[cat.ch] + ')' : '') + ' ' + an.n;
}

/* ============================================================
   MOLECULAR COMPOUNDS (explicit — keeps the chemistry honest)
   ============================================================ */
const MOLECULAR = [
  ['CO', 'carbon monoxide'], ['CO2', 'carbon dioxide'], ['CS2', 'carbon disulfide'],
  ['CCl4', 'carbon tetrachloride'], ['CF4', 'carbon tetrafluoride'],
  ['N2O', 'dinitrogen monoxide'], ['NO', 'nitrogen monoxide'], ['NO2', 'nitrogen dioxide'],
  ['N2O3', 'dinitrogen trioxide'], ['N2O4', 'dinitrogen tetroxide'], ['N2O5', 'dinitrogen pentoxide'],
  ['NF3', 'nitrogen trifluoride'], ['NCl3', 'nitrogen trichloride'], ['NBr3', 'nitrogen tribromide'],
  ['PCl3', 'phosphorus trichloride'], ['PCl5', 'phosphorus pentachloride'],
  ['PBr3', 'phosphorus tribromide'], ['P2O5', 'diphosphorus pentoxide'],
  ['P4O10', 'tetraphosphorus decoxide'], ['PF5', 'phosphorus pentafluoride'],
  ['SO2', 'sulfur dioxide'], ['SO3', 'sulfur trioxide'], ['SF6', 'sulfur hexafluoride'],
  ['SCl2', 'sulfur dichloride'], ['SF4', 'sulfur tetrafluoride'],
  ['Cl2O', 'dichlorine monoxide'], ['Cl2O7', 'dichlorine heptoxide'], ['ClF3', 'chlorine trifluoride'],
  ['OF2', 'oxygen difluoride'], ['IF5', 'iodine pentafluoride'], ['IF7', 'iodine heptafluoride'],
  ['BrF3', 'bromine trifluoride'], ['BrCl', 'bromine monochloride'],
  ['SiO2', 'silicon dioxide'], ['SiCl4', 'silicon tetrachloride'], ['XeF4', 'xenon tetrafluoride']
];

/* ============================================================
   ACIDS
   ============================================================ */
const ACIDS = [
  { f: 'HF',     n: 'hydrofluoric acid', kind: 'binary' },
  { f: 'HCl',    n: 'hydrochloric acid', kind: 'binary' },
  { f: 'HBr',    n: 'hydrobromic acid',  kind: 'binary' },
  { f: 'HI',     n: 'hydroiodic acid',   kind: 'binary' },
  { f: 'H2S',    n: 'hydrosulfuric acid', kind: 'binary' },
  { f: 'HNO3',   n: 'nitric acid',       kind: 'oxoacid' },
  { f: 'HNO2',   n: 'nitrous acid',      kind: 'oxoacid' },
  { f: 'H2SO4',  n: 'sulfuric acid',     kind: 'oxoacid' },
  { f: 'H2SO3',  n: 'sulfurous acid',    kind: 'oxoacid' },
  { f: 'H2CO3',  n: 'carbonic acid',     kind: 'oxoacid' },
  { f: 'H3PO4',  n: 'phosphoric acid',   kind: 'oxoacid' },
  { f: 'HClO3',  n: 'chloric acid',      kind: 'oxoacid' },
  { f: 'CH3COOH', n: 'acetic acid',      kind: 'oxoacid' }
];
const BASES = [
  ['NaOH', 'sodium hydroxide'], ['KOH', 'potassium hydroxide'],
  ['Ca(OH)2', 'calcium hydroxide'], ['Mg(OH)2', 'magnesium hydroxide'],
  ['Ba(OH)2', 'barium hydroxide'], ['NH3', 'ammonia'], ['Al(OH)3', 'aluminum hydroxide']
];

/* ============================================================
   ACTIVITY SERIES  (exactly the one printed on the SNC2D unit test)
   ============================================================ */
const ACTIVITY = ['Li', 'K', 'Ca', 'Na', 'Mg', 'Al', 'Zn', 'Fe', 'Ni', 'Sn', 'H', 'Cu', 'Ag', 'Pt', 'Au'];
const METAL_NAME = { Li: 'lithium', K: 'potassium', Ca: 'calcium', Na: 'sodium', Mg: 'magnesium', Al: 'aluminum', Zn: 'zinc', Fe: 'iron', Ni: 'nickel', Sn: 'tin', H: 'hydrogen', Cu: 'copper', Ag: 'silver', Pt: 'platinum', Au: 'gold' };
const METAL_CHARGE = { Li: 1, K: 1, Ca: 2, Na: 1, Mg: 2, Al: 3, Zn: 2, Fe: 2, Ni: 2, Sn: 2, Cu: 2, Ag: 1, Pt: 2, Au: 3 };
const moreReactive = (a, b) => ACTIVITY.indexOf(a) < ACTIVITY.indexOf(b);

/* ============================================================
   ANSWER NORMALISATION for typed responses
   ============================================================ */
function norm(s) {
  return String(s).toLowerCase().trim()
    .replace(/\s*\(\s*/g, '(').replace(/\s*\)\s*/g, ')')
    .replace(/[^a-z0-9()]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\bsulph/g, 'sulf')
    .replace(/\balumininum\b/g, 'aluminum')
    .replace(/\baluminium\b/g, 'aluminum')
    .trim();
}
function answerMatches(given, accepted) {
  const g = norm(given);
  if (!g) return false;
  return (Array.isArray(accepted) ? accepted : [accepted]).some(a => norm(a) === g);
}
