/* ============================================================
   MONSTER BIO — runtime question generators
   type: 'mc' | 'text' | 'number' | 'multi' | 'open'
   ============================================================ */

/* ---------- generic: glossary, true/false, ordering ---------- */
function genGlossary(topic) {
  const pool = GLOSSARY.filter(x => !topic || x.topic === topic);
  const item = pick(pool);
  let fam = GLOSSARY.filter(x => x.g === item.g && x !== item);
  if (fam.length < 3) fam = fam.concat(sample(GLOSSARY.filter(x => x.g !== item.g), 3 - fam.length));
  const wrong = sample(fam, 3);
  if (Math.random() < 0.5)
    return mcq({ cat: 'K', topic: item.topic, q: `What does <b>${item.t}</b> mean?`, right: item.d, wrong: wrong.map(x => x.d),
      why: `<b>${item.t}</b>: ${item.d}.`, hint: 'Cross out the ones that describe a different word you know.' });
  return mcq({ cat: 'K', topic: item.topic, q: `Which term matches?<br><i>"${item.d}"</i>`, right: item.t, wrong: wrong.map(x => x.t),
    why: `That is <b>${item.t}</b>.`, hint: 'Find the key word in the description.' });
}
const glossFor = t => () => genGlossary(t);
function genTypeTerm(topic) {
  const item = pick(GLOSSARY.filter(x => x.topic === topic));
  const base = item.t.replace(/\s*\(.*\)/, '');
  return { cat: 'K', type: 'text', topic, q: `Type the term:<br><i>"${item.d}"</i>`, a: [base, item.t], placeholder: 'term',
    why: `<b>${item.t}</b>.`, hint: `It starts with "${base[0]}" and has ${base.length} letters.` };
}
const typeFor = t => () => genTypeTerm(t);
function genTF(topic) {
  const s = pick(TF.filter(x => !topic || x[3] === topic));
  return { cat: 'K', type: 'mc', topic: s[3], q: `True or false?<br><b>${s[0]}</b>`, choices: ['True', 'False'], a: s[1] ? 0 : 1,
    why: s[2], hint: 'Words like "all", "never" and "always" are often traps.' };
}
const tfFor = t => () => genTF(t);
function genMatch(topic) {
  const items = sample(GLOSSARY.filter(x => x.topic === topic), 4), defs = shuffle(items), L = ['A', 'B', 'C', 'D'];
  return { cat: 'K', type: 'multi', topic,
    q: '<b>Match each term</b> to its description.<div class="deflist">' + defs.map((d, i) => `<div><b>${L[i]}.</b> ${d.d}</div>`).join('') + '</div>',
    parts: items.map(it => ({ label: `<b>${it.t}</b>`, choices: L.slice(), a: defs.indexOf(it) })),
    why: items.map(it => `&bull; <b>${it.t}</b> &rarr; ${L[defs.indexOf(it)]}. ${it.d}`).join('<br>'),
    hint: 'Do the one you are surest about first, then eliminate.' };
}
const matchFor = t => () => genMatch(t);
/* put 4 of a sequence in order */
function genOrder(steps, title, why, n) {
  n = n || 4;
  const idx = sample(steps.map((_, i) => i), n).sort((a, b) => a - b);
  const chosen = idx.map(i => steps[i]), shown = shuffle(chosen), L = 'ABCDEF'.split('').slice(0, n);
  return { cat: 'T', type: 'multi',
    q: `${title}<div class="deflist">` + shown.map((s, i) => `<div><b>${L[i]}.</b> ${s}</div>`).join('') + '</div>',
    parts: ['1st', '2nd', '3rd', '4th', '5th', '6th'].slice(0, n).map((lab, k) => ({ label: lab, choices: L.slice(), a: shown.indexOf(chosen[k]) })),
    why: 'The correct order:<br>' + chosen.map((s, k) => `${k + 1}. ${s}`).join('<br>') + (why ? '<br><br>' + why : ''),
    hint: 'Find the very first and very last step first.' };
}
function genNext(steps, what, why, loop) {
  const i = rnd(loop ? steps.length : steps.length - 1), nx = steps[(i + 1) % steps.length];
  return mcq({ cat: 'T', q: `${what}<br>What comes <b>right after</b> <b>${steps[i]}</b>?`, right: nx,
    wrong: sample(steps.filter(s => s !== nx && s !== steps[i]), 3),
    why: 'The order: ' + steps.map(s => s === nx ? `<b>${s}</b>` : s).join(' &rarr; ') + (loop ? ' &rarr; (back to the start)' : '') + (why ? '<br><br>' + why : ''),
    hint: 'Say the whole sequence out loud from the start.' });
}

/* ============================================================ CELLS (L1) */
function genOrganelle() {
  const o = pick(ORGANELLES);
  const wrong = sample(ORGANELLES.filter(x => x !== o), 3);
  if (Math.random() < 0.5)
    return mcq({ cat: 'K', q: `Which organelle does this?<br><i>"${o.f}"</i>`, right: o.n, wrong: wrong.map(x => x.n),
      why: `<b>${o.n}</b>: ${o.f}.${o.where === 'plant' ? ' Found <b>only in plant cells</b>.' : ''}`, hint: 'Picture the cell. Where would this job happen?' });
  return mcq({ cat: 'K', q: `What is the job of the <b>${o.n.toLowerCase()}</b>?`, right: o.f, wrong: wrong.map(x => x.f),
    why: `<b>${o.n}</b>: ${o.f}.`, hint: 'Eliminate the jobs you already know belong to other organelles.' });
}
function genOrganelleTyped() {
  const o = pick(ORGANELLES);
  return { cat: 'K', type: 'text', q: `Name the organelle:<br><i>"${o.f}"</i>`, a: [o.n].concat(o.alt || []), placeholder: 'organelle',
    why: `<b>${o.n}</b>.`, hint: `Starts with "${o.n[0]}".` };
}
function genWhereFound() {
  const o = pick(ORGANELLES.filter(x => x.n !== 'Cytoskeleton'));
  const right = o.where === 'plant' ? 'Plant cells only' : 'Both plant and animal cells';
  return mcq({ cat: 'K', q: `Where is the <b>${o.n.toLowerCase()}</b> found?`, right, wrong: ['Plant cells only', 'Animal cells only', 'Both plant and animal cells'].filter(x => x !== right),
    why: o.where === 'plant' ? `Only plants have a <b>${o.n.toLowerCase()}</b>. The two plant-only parts are the <b>cell wall</b> and <b>chloroplasts</b>.`
      : `Both have it. ${o.n === 'Vacuole' ? 'Plants have one <b>large</b> vacuole, animals have several <b>small</b> ones.' : 'Only the cell wall and chloroplasts are plant-only.'}`,
    hint: 'Only two parts are plant-only. Is this one of them?' });
}
const CELL_CLUES = [
  ['It has a rectangular shape and a rigid outer layer.', 'Plant', 'A rigid outer layer = <b>cell wall</b>, which gives a rectangular shape.'],
  ['It is square and has a large, empty-looking area in the middle.', 'Plant', 'Square = cell wall. Big empty area = one <b>large vacuole</b>. That\'s a plant cell (practice test Q3).'],
  ['It contains small green oval structures.', 'Plant', 'Green ovals = <b>chloroplasts</b>.'],
  ['It is round and irregular, with several small vacuoles.', 'Animal', 'No wall means no fixed shape, and several small vacuoles = animal cell.'],
  ['It has no cell wall and no chloroplasts.', 'Animal', 'Missing both plant-only parts &rarr; animal.'],
  ['It came from the leaf of a maple tree.', 'Plant', 'Leaves are plant parts.'],
  ['It came from the cheek of a human.', 'Animal', 'Humans are animals.']
];
function genPlantOrAnimal() {
  const c = pick(CELL_CLUES);
  return mcq({ cat: 'T', q: `A cell under the microscope: <i>${c[0]}</i><br>Is it a <b>plant</b> or an <b>animal</b> cell?`, right: c[1] + ' cell', wrong: [(c[1] === 'Plant' ? 'Animal' : 'Plant') + ' cell'],
    why: c[2], hint: 'Look for the plant-only clues: cell wall (rectangle), chloroplasts (green), one big vacuole.' });
}
const CELL_THEORY = [
  ['All living things are composed of one or more ___.', 'cells', ['organelles', 'tissues', 'atoms']],
  ['The cell is the ___ unit of structure, function and organization in all living things.', 'basic', ['largest', 'rarest', 'newest']],
  ['All cells come from ___ cells.', 'pre-existing', ['dead', 'plant', 'brand-new']]
];
function genCellTheory() {
  const t = pick(CELL_THEORY);
  return mcq({ cat: 'K', q: `Complete this idea of <b>cell theory</b>:<br><i>${t[0]}</i>`, right: t[1], wrong: t[2],
    why: 'The 3 ideas of cell theory:<br>1. All living things are made of one or more <b>cells</b>.<br>2. The cell is the <b>basic unit</b> of structure, function and organization.<br>3. All cells come from <b>pre-existing cells</b>.',
    hint: 'Cell theory has 3 ideas. Which word completes this one?' });
}
function genLabelCell(force) {
  const kind = force || (Math.random() < 0.7 ? 'plant' : 'animal');
  const parts = Object.keys(CELL_PARTS[kind]);
  const asked = sample(parts, 4), L = shuffle('ABCDEFG'.split('').slice(0, parts.length));
  const letters = {}; parts.forEach((p, i) => letters[p] = L[i]);
  const pool = kind === 'plant' ? parts : parts.concat(['Chloroplast', 'Cell wall']);
  const qs = asked.sort((a, b) => letters[a] < letters[b] ? -1 : 1);
  return { cat: 'A', type: 'multi', q: `Label this <b>${kind} cell</b>.${cellDiagram(kind, letters)}`,
    parts: qs.map(p => { const ch = shuffle([p].concat(sample(pool.filter(x => x !== p), 3))); return { label: `<b>${letters[p]}</b>`, choices: ch, a: ch.indexOf(p) }; }),
    why: qs.map(p => `&bull; <b>${letters[p]}</b> = ${p}`).join('<br>') + '<br><br>' + (kind === 'plant'
      ? 'Plant tells: the thick outer <b>cell wall</b>, green <b>chloroplasts</b>, and one <b>large vacuole</b>.'
      : 'Animal cells: no cell wall, no chloroplasts, only small vacuoles.'),
    hint: 'Outer layers first: wall (thick, outside) then membrane (thin, just inside).' };
}

/* ============================================================ ENERGY (L1) */
function genPhotoResp() {
  const items = [
    ['Which process <b>releases energy</b> from glucose?', 'Cellular respiration', ['Photosynthesis', 'Osmosis', 'Mitosis']],
    ['Which process <b>makes glucose</b> using sunlight?', 'Photosynthesis', ['Cellular respiration', 'Diffusion', 'Cytokinesis']],
    ['Which organelle carries out <b>cellular respiration</b>?', 'Mitochondria', ['Chloroplast', 'Nucleus', 'Golgi body']],
    ['Which organelle carries out <b>photosynthesis</b>?', 'Chloroplast', ['Mitochondria', 'Ribosome', 'Vacuole']],
    ['What does photosynthesis <b>need</b>?', 'Carbon dioxide, water and sunlight', ['Glucose and oxygen', 'Oxygen and water', 'Glucose and carbon dioxide']],
    ['What does photosynthesis <b>produce</b>?', 'Glucose and oxygen', ['Carbon dioxide and water', 'Only water', 'Proteins']],
    ['What does cellular respiration <b>need</b>?', 'Glucose and oxygen', ['Carbon dioxide and water', 'Sunlight only', 'Chloroplasts']],
    ['What does cellular respiration <b>produce</b>?', 'Energy, carbon dioxide and water', ['Glucose and oxygen', 'Sunlight', 'Chlorophyll']],
    ['Where does the <b>oxygen</b> for cellular respiration come from?', 'The air you breathe', ['The food you eat', 'Sunlight', 'Your bones']],
    ['Where does the <b>glucose</b> for your cellular respiration come from?', 'The food you eat', ['The air you breathe', 'Sunlight on your skin', 'Your DNA']],
    ['Which cells do cellular respiration?', 'Both plant and animal cells', ['Only animal cells', 'Only plant cells', 'Only bacteria']],
    ['Why don\'t animals need chloroplasts?', 'They get glucose by eating plants or other animals', ['They don\'t need energy', 'They have a cell wall instead', 'They make glucose in their mitochondria']]
  ];
  const it = pick(items);
  return mcq({ cat: 'K', q: it[0], right: it[1], wrong: it[2],
    why: '<b>Photosynthesis</b> (chloroplast): carbon dioxide + water + sunlight &rarr; glucose + oxygen<br><b>Cellular respiration</b> (mitochondria): glucose + oxygen &rarr; carbon dioxide + water + energy<br><br>They are <b>opposite</b> reactions &mdash; one\'s outputs are the other\'s inputs.',
    hint: 'Photo = light, synthesis = make. Respiration = breathing (uses oxygen).' });
}
function genPhotoRespMulti() {
  const P = ['Photosynthesis', 'Cellular respiration'];
  const facts = shuffle([['Takes in carbon dioxide', 0], ['Takes in oxygen', 1], ['Gives off oxygen', 0], ['Gives off carbon dioxide', 1], ['Happens in chloroplasts', 0], ['Happens in mitochondria', 1], ['Needs sunlight', 0], ['Releases energy for the cell', 1], ['Makes glucose', 0], ['Uses up glucose', 1]]).slice(0, 4);
  return { cat: 'T', type: 'multi', q: 'Photosynthesis or cellular respiration?', parts: facts.map(f => ({ label: f[0], choices: P.slice(), a: f[1] })),
    why: facts.map(f => `&bull; ${f[0]} &rarr; <b>${P[f[1]]}</b>`).join('<br>') + '<br><br>They are opposites: CO<sub>2</sub> + H<sub>2</sub>O &#8644; glucose + O<sub>2</sub>.',
    hint: 'Plants take in CO₂ and give off O₂. You do the reverse every breath.' };
}

/* ============================================================ DNA (L2) */
function genSizeOrder() {
  if (Math.random() < 0.5) {
    const shown = shuffle(SIZE_ORDER), L = ['A', 'B', 'C', 'D'];
    return { cat: 'T', type: 'multi', q: 'Put these in order from <b>largest to smallest</b>.<div class="deflist">' + shown.map((s, i) => `<div><b>${L[i]}.</b> ${s}</div>`).join('') + '</div>',
      parts: ['Largest', '2nd', '3rd', 'Smallest'].map((lab, k) => ({ label: lab, choices: L.slice(), a: shown.indexOf(SIZE_ORDER[k]) })),
      why: '<b>Nucleus &gt; Chromosome &gt; DNA &gt; Gene</b><br>The nucleus holds the chromosomes, each chromosome is one long DNA molecule, and a gene is a small segment of that DNA. (Practice test Q4.)',
      hint: 'A gene is just a small piece of something else.' };
  }
  const big = Math.random() < 0.5;
  const set = sample(SIZE_ORDER, 3).sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  const right = big ? set[0] : set[2];
  return mcq({ cat: 'K', q: `Which is the <b>${big ? 'largest' : 'smallest'}</b>?`, right, wrong: set.filter(x => x !== right),
    why: 'Largest &rarr; smallest: <b>Nucleus &gt; Chromosome &gt; DNA &gt; Gene</b>.', hint: 'Nucleus holds chromosomes, chromosomes are made of DNA, genes are pieces of DNA.' });
}
function genChromoNum() {
  const c = pick(CHROMO);
  if (Math.random() < 0.5)
    return { cat: 'T', type: 'number', q: `A body cell of a <b>${c[0]}</b> has <b>${c[1]}</b> chromosomes. How many came from <b>each parent</b>?`, a: c[1] / 2, placeholder: 'chromosomes',
      why: `Chromosomes come in <b>pairs</b> &mdash; one of each pair from each parent. ${c[1]} &divide; 2 = <b>${c[1] / 2}</b>.<br>Humans: 46 total = 23 from mom + 23 from dad.`,
      hint: 'Chromosomes come in pairs.' };
  return { cat: 'T', type: 'number', q: `A ${c[0]} gets <b>${c[1] / 2}</b> chromosomes from each parent. How many chromosomes are in each body cell?`, a: c[1], placeholder: 'chromosomes',
    why: `${c[1] / 2} &times; 2 = <b>${c[1]}</b>. One set from each parent.`, hint: 'Two parents.' };
}
function genDNAFacts() {
  const items = [
    ['How many chromosomes do humans normally have?', '46', ['23', '48', '92']],
    ['How many chromosomes does a human get from their mother?', '23', ['46', '22', '12']],
    ['What does DNA stand for?', 'Deoxyribonucleic acid', ['Dinucleic acid', 'Deoxyribose nitrogen acid', 'Double nucleus acid']],
    ['What shape is a DNA molecule?', 'A double helix (twisted ladder)', ['A single straight line', 'A circle', 'A cube']],
    ['What are the four DNA bases?', 'Adenine, thymine, cytosine, guanine', ['Adenine, thymine, carbon, glucose', 'Alanine, tyrosine, cysteine, glycine', 'Oxygen, hydrogen, carbon, nitrogen']],
    ['What does a gene control?', 'The production of a specific protein', ['How many chromosomes you have', 'The size of the nucleus', 'Photosynthesis']],
    ['What is a karyotype?', 'The complete set of an organism\'s chromosomes', ['A single gene', 'A type of mutation', 'A cell organelle']],
    ['Where is DNA found in the cell?', 'In the nucleus', ['In the cell wall', 'In the vacuole', 'In the cell membrane']],
    ['What is the "genetic code"?', 'The order of the A, T, C and G bases', ['The number of chromosomes', 'The shape of the cell', 'A list of proteins']],
    ['Down syndrome is caused by having&hellip;', 'An extra copy of chromosome 21 (47 chromosomes)', ['One missing gene', 'Too few cells', 'A virus']],
    ['How is PKU tested for in newborn babies?', 'A blood sample from the heel', ['An X-ray', 'A karyotype from amniotic fluid', 'A urine test at age 10']],
    ['If one parent has Huntington disease, what is the chance their child has the gene?', '50%', ['100%', '0%', '25%']],
    ['Why is the genetic code called "universal"?', 'The same 4 bases code for proteins in all living things', ['Every organism has identical DNA', 'It was discovered worldwide', 'It never changes']]
  ];
  const it = pick(items);
  return mcq({ cat: 'K', q: it[0], right: it[1], wrong: it[2], why: `<b>${it[1]}</b>.<br><br>` +
    'Key facts: 46 chromosomes (23 pairs) &middot; DNA = deoxyribonucleic acid, a double helix &middot; bases A, T, C, G &middot; a gene is a DNA segment that controls a protein.',
    hint: 'Think back to the twisted-ladder picture.' });
}
function genBases() {
  const b = pick(BASES), lett = Math.random() < 0.5;
  return mcq({ cat: 'K', q: lett ? `Which base does the letter <b>${b[0]}</b> stand for?` : `Which letter stands for <b>${b[1].toLowerCase()}</b>?`,
    right: lett ? b[1] : b[0], wrong: BASES.filter(x => x !== b).map(x => lett ? x[1] : x[0]),
    why: 'A = Adenine &middot; T = Thymine &middot; C = Cytosine &middot; G = Guanine', hint: 'The letter is the first letter of the name.' });
}

/* ============================================================ MUTATIONS, GMOs, CLONING (L2) */
const MUTAGENS = ['X-rays', 'UV rays from the sun', 'tar in cigarette smoke', 'mercury', 'some chemicals', 'radiation'];
const NOT_MUTAGENS = ['drinking water', 'eating an apple', 'sleeping 9 hours', 'listening to music', 'walking the dog', 'reading a book'];
function genMutagen() {
  const yes = Math.random() < 0.5, item = yes ? pick(MUTAGENS) : pick(NOT_MUTAGENS);
  return { cat: 'K', type: 'mc', q: `Is <b>${item}</b> a mutagen?`, choices: ['Yes', 'No'], a: yes ? 0 : 1,
    why: `<b>${yes ? 'Yes' : 'No'}.</b> A mutagen is a substance or factor that changes DNA. Examples: X-rays, UV rays, chemicals like mercury and the tar in cigarettes. Lifestyle (smoking, alcohol) and environment (radiation, chemicals) can cause mutations.`,
    hint: 'Does it physically damage DNA?' };
}
const BIOTECH = [
  ['Scientists put a human insulin gene into bacteria so they make insulin.', 'GMO (genetic modification)'],
  ['Corn is given a gene from bacteria so it resists pests.', 'GMO (genetic modification)'],
  ['Salmon get an extra growth-hormone gene so they grow faster.', 'GMO (genetic modification)'],
  ['A gardener takes a cutting from a plant and grows an identical new plant.', 'Cloning'],
  ['Dolly the sheep was made from the cell of an adult sheep.', 'Cloning'],
  ['A carrot plant is grown from a single carrot cell.', 'Cloning'],
  ['A newborn\'s heel blood is tested for PKU.', 'DNA screening'],
  ['Fluid from around a fetus is tested to look at its chromosomes.', 'DNA screening'],
  ['A woman is tested for genes linked to breast cancer.', 'DNA screening'],
  ['Doctors try to fix a faulty gene that causes inherited blindness.', 'Gene therapy']
];
function genBiotech() {
  const b = pick(BIOTECH);
  return mcq({ cat: 'A', q: `<div class="scen">${b[0]}</div>What is this an example of?`, right: b[1],
    wrong: ['GMO (genetic modification)', 'Cloning', 'DNA screening', 'Gene therapy'].filter(x => x !== b[1]),
    why: '&bull; <b>GMO</b>: genes are deliberately changed or added from another species.<br>&bull; <b>Cloning</b>: making an identical genetic copy.<br>&bull; <b>DNA screening</b>: testing for mutations that may cause disease.<br>&bull; <b>Gene therapy</b>: trying to correct faulty genes.',
    hint: 'Adding a gene? Copying? Testing? Fixing?' });
}
function genMutationKind() {
  const items = [
    ['A skin cell is damaged by UV radiation from a sunburn.', 'Acquired (environment)'],
    ['A person who smokes for years damages the DNA in their lung cells.', 'Acquired (lifestyle)'],
    ['A baby is born with a mutation that was in their parent\'s egg cell.', 'Inherited'],
    ['A worker exposed to a chemical every day develops a mutation.', 'Acquired (environment)'],
    ['A child has the same gene mutation as their father, passed on through sperm.', 'Inherited']
  ];
  const it = pick(items);
  return mcq({ cat: 'A', q: `<div class="scen">${it[0]}</div>What kind of mutation is this?`, right: it[1],
    wrong: ['Inherited', 'Acquired (environment)', 'Acquired (lifestyle)'].filter(x => x !== it[1]),
    why: 'Mutations can be <b>inherited</b> (in egg or sperm, passed to children) or <b>acquired</b> during life from the <b>environment</b> (X-rays, chemicals, UV) or <b>lifestyle</b> choices (smoking, alcohol).',
    hint: 'Was it passed down from a parent, or picked up during life? If picked up: was it a choice or exposure?' });
}

/* ============================================================ WHY CELLS DIVIDE (L3) */
const GRR = [
  ['A baby grows into an adult.', 'Growth'], ['A fertilized egg becomes a baby with trillions of cells.', 'Growth'], ['A seedling grows into a tall tree.', 'Growth'],
  ['A scraped knee heals.', 'Repair'], ['A broken bone mends.', 'Repair'], ['Your skin replaces the millions of cells you shed every day.', 'Repair'], ['A salamander regrows its lost tail.', 'Repair'], ['A blister heals.', 'Repair'],
  ['A bacterium splits into two identical bacteria.', 'Reproduction'], ['An amoeba divides to make a new amoeba.', 'Reproduction'], ['A single-celled yeast cell makes an identical copy of itself.', 'Reproduction']
];
function genGRR() {
  const g = pick(GRR);
  return mcq({ cat: 'A', q: `<div class="scen">${g[0]}</div>Which function of cell division is this?`, right: g[1], wrong: ['Growth', 'Repair', 'Reproduction'].filter(x => x !== g[1]),
    why: 'The 3 reasons cells divide: <b>G</b>rowth, <b>R</b>epair, <b>R</b>eproduction (GRR &mdash; like a monster growl).', hint: 'Getting bigger? Fixing damage? Making a new organism?' });
}
const DIFF_OSM = [
  ['Perfume spreads across a room.', 'Diffusion'], ['Oxygen moves from the alveoli into the blood.', 'Diffusion'], ['Carbon dioxide moves out of a cell into the blood.', 'Diffusion'],
  ['Food colouring spreads through a glass of water.', 'Diffusion'], ['Nutrients pass from the blood into a body cell.', 'Diffusion'], ['A nerve cell releases chemicals that move to the next nerve cell.', 'Diffusion'],
  ['Water moves into a plant root cell across its membrane.', 'Osmosis'], ['A raisin soaked in water swells up as water enters it.', 'Osmosis'], ['Water leaves a cell placed in very salty water.', 'Osmosis'], ['Wilted lettuce becomes crisp in cold water.', 'Osmosis']
];
function genDiffOsm() {
  const d = pick(DIFF_OSM);
  return mcq({ cat: 'A', q: `<div class="scen">${d[0]}</div>Is this <b>diffusion</b> or <b>osmosis</b>?`, right: d[1], wrong: [d[1] === 'Diffusion' ? 'Osmosis' : 'Diffusion'],
    why: '<b>Diffusion</b>: any particles move from <b>high to low</b> concentration.<br><b>Osmosis</b>: specifically <b>water</b> moving across a semi-permeable membrane.',
    hint: 'Is the thing moving WATER crossing a membrane? Then it\'s osmosis.' });
}
function genDiffDirection() {
  const hi = 10 + rnd(40) * 2, lo = 1 + rnd(8);
  const inside = Math.random() < 0.5;
  const sub = pick(['oxygen', 'glucose', 'carbon dioxide']);
  return mcq({ cat: 'T', q: `There are <b>${inside ? hi : lo}</b> ${sub} particles inside a cell and <b>${inside ? lo : hi}</b> just outside it. Which way will ${sub} diffuse?`,
    right: inside ? 'Out of the cell' : 'Into the cell', wrong: [inside ? 'Into the cell' : 'Out of the cell', 'It will not move at all'],
    why: `Diffusion goes from <b>high</b> concentration (${hi}) to <b>low</b> (${lo}), until they are even.`, hint: 'Crowded → empty.' });
}
function genWhySmall() {
  const items = [
    ['Why can\'t a cell just keep getting bigger?', 'Its membrane surface area can\'t keep up, so diffusion becomes too slow', ['It would run out of DNA', 'Cell walls stop it', 'It would become a tissue']],
    ['As a cell grows, what grows faster?', 'The material inside the cell', ['The cell membrane', 'The cell wall', 'The number of chromosomes']],
    ['What could happen to a cell that grows too big?', 'It may die because nutrients and wastes can\'t move fast enough', ['It turns into a plant cell', 'It makes more DNA', 'Nothing']],
    ['How do cells get nutrients in and wastes out?', 'Diffusion', ['Photosynthesis', 'Mitosis', 'Peristalsis']],
    ['What is the original cell that divides called?', 'The parent cell', ['The daughter cell', 'The stem cell', 'The sister cell']],
    ['How are daughter cells related to the parent cell?', 'They have identical genes', ['They have half the DNA', 'They are always bigger', 'They have different genes']],
    ['Which type of reproduction makes offspring identical to the one parent?', 'Asexual reproduction', ['Sexual reproduction', 'Osmosis', 'Differentiation']],
    ['How do your body cells (not sex cells) reproduce?', 'Asexually, by dividing into identical copies', ['Sexually, with egg and sperm', 'By photosynthesis', 'They never divide']]
  ];
  const it = pick(items);
  return mcq({ cat: 'K', q: it[0], right: it[1], wrong: it[2], why: `<b>${it[1]}</b>.<br><br>Big idea: cells stay small so <b>diffusion</b> can move nutrients in and wastes out fast enough. So instead of growing forever, they <b>divide</b>.`,
    hint: 'Think about a huge cell with a tiny "door".' });
}

/* ============================================================ MITOSIS (L4) */
function genPhaseEvent() {
  const p = pick(PHASES), e = pick(PHASE_EVENTS[p]);
  return mcq({ cat: 'K', q: `In which stage does this happen?<br><i>"${e}"</i>`, right: p, wrong: sample(PHASES.filter(x => x !== p), 3),
    why: `<b>${p}</b> &mdash; trick: <b>${PHASE_TRICK[p]}</b>.<br><br>Order: Interphase &rarr; <b>P</b>rophase &rarr; <b>M</b>etaphase &rarr; <b>A</b>naphase &rarr; <b>T</b>elophase &rarr; Cytokinesis (<b>I PMAT C</b>).`,
    hint: 'Prophase = Prepare, Metaphase = Middle, Anaphase = Away, Telophase = Two.' });
}
function genPhasePic() {
  const p = pick(PHASES);
  return mcq({ cat: 'A', q: `Which stage is shown?${phaseDiagram(p)}`, right: p, wrong: sample(PHASES.filter(x => x !== p), 3),
    why: `<b>${p}</b>: ${PHASE_EVENTS[p][0].toLowerCase()}.<br><br>Clues: loose squiggles = chromatin (interphase/telophase) &middot; X shapes scattered = prophase &middot; X shapes in a line = metaphase &middot; V shapes pulled apart = anaphase &middot; two nuclei, pinching = telophase &middot; two separate cells = cytokinesis.`,
    hint: 'Look at the shape of the chromosomes and where they are.' });
}
const genMitosisOrder = () => genOrder(PHASES, 'Put the stages of the <b>cell cycle</b> in order.', 'Remember <b>I PMAT C</b>: Interphase, Prophase, Metaphase, Anaphase, Telophase, Cytokinesis.');
const genMitosisNext = () => genNext(PHASES, 'Think about the cell cycle.', 'After cytokinesis, each daughter cell goes back into interphase.', true);
function genMitosisFacts() {
  const items = [
    ['What percent of its life does a cell spend in interphase?', 'About 90%', ['About 10%', 'About 50%', 'About 1%']],
    ['What are the two main stages of a cell\'s life?', 'Growth and division', ['Birth and death', 'Photosynthesis and respiration', 'Prophase and telophase']],
    ['What is chromatin?', 'Long, thin, loose DNA in the nucleus', ['A type of organelle', 'A fully condensed chromosome', 'The cell wall']],
    ['What joins two sister chromatids?', 'The centromere', ['The centriole', 'The cell membrane', 'A spindle fibre']],
    ['What pulls the chromatids apart?', 'Spindle fibres', ['The cell wall', 'Ribosomes', 'The Golgi body']],
    ['In animal cells, what pinches the cell in two during cytokinesis?', 'A cleavage furrow', ['A cell plate', 'The nucleus', 'A vacuole']],
    ['Which cells are used in class to view mitosis?', 'Onion root tips and horse ascarid eggs', ['Red blood cells and nerve cells', 'Bone and fat', 'Leaf and bark']],
    ['How many stages are in mitosis itself?', 'Four', ['Two', 'Six', 'Three']]
  ];
  const it = pick(items);
  return mcq({ cat: 'K', q: it[0], right: it[1], wrong: it[2], why: `<b>${it[1]}</b>.<br><br>Mitosis has 4 stages (PMAT), with interphase before and cytokinesis after.`, hint: 'Picture the X-shaped chromosome.' });
}

/* ============================================================ CANCER (L5) */
const TUMOUR_FACTS = [
  ['Does not spread', 'Benign'], ['Abnormal cells stay at the original site', 'Benign'], ['Usually removed by surgery', 'Benign'], ['Non-cancerous', 'Benign'],
  ['Can spread to other parts of the body', 'Malignant'], ['Carried by blood and lymph to other tissues', 'Malignant'], ['Can metastasize and start new tumours', 'Malignant'], ['Cancerous', 'Malignant']
];
function genTumour() {
  const t = pick(TUMOUR_FACTS);
  return mcq({ cat: 'K', q: `Benign or malignant?<br><b>${t[0]}</b>`, right: t[1], wrong: [t[1] === 'Benign' ? 'Malignant' : 'Benign'],
    why: '<b>Benign</b> = stays put, non-cancerous (but can still cause harm or later become malignant).<br><b>Malignant</b> = cancerous, can spread through blood and lymph (metastasis).',
    hint: 'Benign sounds like "be nice". Malignant = mean, it spreads.' });
}
function genCancerFacts() {
  const items = [
    ['What is cancer?', 'A group of diseases with uncontrolled growth and spread of abnormal cells', ['An infection caught from other people', 'A type of healthy tissue', 'Cells dividing more slowly than usual']],
    ['What causes cancer to develop?', 'A mutation in the DNA', ['A cell wall breaking', 'Too much oxygen', 'Eating vegetables']],
    ['Which is a possible trigger of cancer-causing mutations?', 'UV radiation', ['Drinking water', 'Sleeping', 'Breathing clean air']],
    ['Is cancer contagious?', 'No', ['Yes, like the flu', 'Only in children', 'Only malignant ones']],
    ['About how many known types of cancer are there?', 'More than 200', ['About 10', 'Exactly 4', 'About 60']],
    ['In normal cell division, new cells are made only for&hellip;', 'Growth or replacing damaged cells', ['Making tumours', 'Any time at all', 'Making the cell bigger']],
    ['What do cancer cells do to normal cells?', 'Crowd them out and stop organs working properly', ['Help them divide', 'Turn them into stem cells', 'Nothing']],
    ['Can you inherit cancer?', 'No, but you can inherit DNA that makes you more susceptible', ['Yes, always', 'Only from your mother', 'Only skin cancer']],
    ['What is a tumour?', 'An abnormal lump of rapidly dividing cells', ['A clump of cells about to die', 'Cells dividing slower than usual', 'A clump of cells producing toxins']]
  ];
  const it = pick(items);
  return mcq({ cat: 'K', q: it[0], right: it[1], wrong: it[2], why: `<b>${it[1]}</b>.<br><br>Cancer = cells dividing <b>out of control</b> because of a <b>mutation</b>. The result is a <b>tumour</b> &mdash; a mass of cells with no function.`,
    hint: 'Think "cell division gone wrong".' });
}
/* Lesson 5 worksheet: normal vs patient sample */
function genCancerData() {
  const start = 2, normal = [], patient = [];
  let n = start, p = start;
  const f = 2.4 + rnd(6) / 10;
  for (let i = 0; i < 6; i++) { normal.push(n); patient.push(Math.round(p)); n *= 2; p = p * f; }
  patient[0] = 2;
  for (let i = 1; i < 6; i++) if (patient[i] <= normal[i]) patient[i] = normal[i] + 2 * i;
  const times = [15, 30, 45, 60, 75, 90];
  const table = `<table class="dtable restab"><tr><th>Days</th><th>Normal cells</th><th>Patient sample</th></tr>` +
    times.map((t, i) => `<tr><td>${t}</td><td>${normal[i]}</td><td>${patient[i]}</td></tr>`).join('') + '</table>';
  const v = rnd(3);
  if (v === 0) return { cat: 'T', type: 'multi', q: `A lab grows two samples of the same cell type.${table}`,
    parts: [
      { label: 'Which sample divides faster?', choices: ['Normal cells', 'Patient sample'], a: 1 },
      { label: 'Does the patient sample suggest a tumour?', choices: ['Yes', 'No'], a: 0 },
      { label: 'The normal cells&hellip;', choices: ['double every 15 days', 'triple every 15 days', 'stay the same'], a: 0 }
    ],
    why: `The normal cells double steadily (2, 4, 8, 16&hellip;). The patient's cells grow much faster (${patient[5]} vs ${normal[5]} at 90 days). Cells dividing out of control = a possible <b>tumour</b>, so the patient should be checked for cancer.`,
    hint: 'Compare the last row.' };
  const which = v === 1 ? 'patient' : 'normal', cells = which === 'patient' ? patient[5] : normal[5];
  return { cat: 'A', type: 'number', q: `${table}Each cell needs <b>2 units of energy</b> to divide. How much energy do the <b>${which === 'patient' ? 'patient\'s' : 'normal'}</b> cells use at <b>90 days</b>?`,
    a: cells * 2, placeholder: 'units',
    why: `${cells} cells &times; 2 units = <b>${cells * 2} units</b>.<br>${which === 'patient' ? `The normal sample only needs ${normal[5] * 2}. A tumour steals lots of energy and nutrients from the body, which is why people with cancer can feel tired and lose weight.` : `The patient sample would need ${patient[5] * 2} &mdash; much more.`}`,
    hint: 'Cells at 90 days × 2.' };
}
/* Practice-test Q12: medical imaging */
const IMAGING = [
  ['viewing a broken arm', 'X-ray', 'X-rays pass through soft tissue but not through dense bone, so bones show up clearly.'],
  ['checking a broken bone in the leg', 'X-ray', 'Bones = X-ray.'],
  ['watching a baby develop during pregnancy', 'Ultrasound', 'Ultrasound uses sound waves &mdash; no radiation, so it\'s safe for a fetus.'],
  ['looking at a torn ligament in the knee (soft tissue)', 'MRI', 'MRI uses magnets and radio waves and is best for soft tissues like the brain, muscles and ligaments.'],
  ['getting a detailed picture of the brain', 'MRI', 'MRI is best for soft tissues like the brain.'],
  ['finding where cancer cells are very active in the body', 'PET', 'PET scans show where cells are using lots of energy, like cancer cells.']
];
function genImaging() {
  const im = pick(IMAGING);
  return mcq({ cat: 'A', q: `Which medical imaging technology would be best for <b>${im[0]}</b>?`, right: im[1],
    wrong: sample(['X-ray', 'Ultrasound', 'MRI', 'PET', 'CT scan'].filter(x => x !== im[1]), 3),
    why: `<b>${im[1]}</b> &mdash; ${im[2]}<br><br><span class="dimline">This is practice-test Q12. Bones &rarr; X-ray &middot; pregnancy &rarr; ultrasound &middot; soft tissue/brain &rarr; MRI &middot; active cancer &rarr; PET &middot; CT = many X-rays combined into slices.</span>`,
    hint: 'Hard bone? Baby? Soft tissue? Active cells?' });
}

/* ============================================================ TISSUES (L6) */
function genTissue() {
  const t = pick(Object.keys(TISSUES)), ex = pick(TISSUES[t].ex);
  return mcq({ cat: 'K', q: `Which type of tissue is <b>${ex}</b>?`, right: t, wrong: Object.keys(TISSUES).filter(x => x !== t),
    why: `<b>${t}</b>: ${TISSUES[t].job}<br><br>Epithelial = covers &middot; Connective = supports (bone, blood, fat) &middot; Muscle = moves &middot; Nervous = signals.`,
    hint: 'Does it cover, support, move, or send signals?' });
}
function genTissueJob() {
  const t = pick(Object.keys(TISSUES));
  return mcq({ cat: 'K', q: `Which tissue does this?<br><i>"${TISSUES[t].job}"</i>`, right: t, wrong: Object.keys(TISSUES).filter(x => x !== t),
    why: `That is <b>${t}</b> tissue.`, hint: 'Cover, support, move, signal.' });
}
function genMuscle() {
  const m = pick(Object.keys(MUSCLES)), d = pick(MUSCLES[m]);
  return mcq({ cat: 'K', q: `Which type of muscle tissue is this?<br><i>"${d}"</i>`, right: m, wrong: Object.keys(MUSCLES).filter(x => x !== m),
    why: '<b>Skeletal</b> = attached to bones &middot; <b>Smooth</b> = walls of organs like the stomach and intestines &middot; <b>Cardiac</b> = heart only.',
    hint: 'Bones? Organ walls? Heart?' });
}
function genLevelOrg() {
  const row = pick(HIERARCHY), i = rnd(5);
  return mcq({ cat: 'K', q: `What level of organization is <b>${row[i]}</b>?`, right: LEVELS_ORG[i], wrong: sample(LEVELS_ORG.filter((_, k) => k !== i), 3),
    why: 'Simplest &rarr; most complex:<br>' + LEVELS_ORG.map((l, k) => `${k === i ? '<b>' : ''}${l}: ${row[k]}${k === i ? '</b>' : ''}`).join('<br>'),
    hint: 'Cell → Tissue → Organ → Organ system → Organism.' });
}
function genHierOrder() {
  const row = pick(HIERARCHY);
  return genOrder(row, 'Put these in order from <b>simplest to most complex</b>.', 'Cell &rarr; Tissue &rarr; Organ &rarr; Organ system &rarr; Organism.', 5);
}
function genStem() {
  const items = [
    ['What are cells called before they become specialized?', 'Stem cells', ['Antibodies', 'Antigens', 'Pathogens', 'Phagocytes']],
    ['What is cell differentiation?', 'When cells become specialized', ['When cells die', 'When cells copy DNA', 'When cells photosynthesize']],
    ['How do cells become specialized?', 'By turning on different genes to make different proteins', ['By getting different DNA', 'By losing their nucleus', 'By growing a cell wall']],
    ['Where can stem cells be collected after birth?', 'The umbilical cord or placenta', ['The fingernails', 'The bladder', 'The hair']],
    ['Why do researchers study stem cells?', 'They might regenerate damaged tissues or whole organs', ['To make cells bigger', 'To stop photosynthesis', 'To remove DNA']],
    ['Why do cells specialize?', 'Larger, complex organisms need specialized cells for different jobs', ['All cells must be identical', 'To make the organism smaller', 'So cells can stop dividing']]
  ];
  const it = pick(items);
  return mcq({ cat: 'K', q: it[0], right: it[1], wrong: it[2].slice(0, 3), why: `<b>${it[1]}</b>.<br><br>All cells start as identical <b>stem cells</b>. They have the same DNA but turn on different genes &rarr; different proteins &rarr; different jobs.`,
    hint: 'Stem = the starting point.' });
}

/* ============================================================ RESPIRATORY (L7) */
const genAirOrder = () => genOrder(AIR_PATH, 'Put the path of <b>air</b> into the body in order.', 'Nose/mouth &rarr; pharynx &rarr; larynx &rarr; trachea &rarr; bronchi &rarr; bronchioles &rarr; alveoli.');
const genAirNext = () => genNext(AIR_PATH, 'You take a breath in.');
function genBreathing() {
  const IN = ['Diaphragm contracts and moves down', 'Ribs are pulled up and out', 'Lung volume increases', 'Pressure in the lungs decreases', 'Air rushes in'];
  const OUT = ['Diaphragm relaxes and moves up', 'Ribcage compresses', 'Lung volume decreases', 'Pressure in the lungs increases', 'Air (carbon dioxide) is pushed out'];
  const facts = shuffle(IN.map(x => [x, 0]).concat(OUT.map(x => [x, 1]))).slice(0, 4);
  const C = ['Inhalation', 'Exhalation'];
  return { cat: 'T', type: 'multi', q: 'Inhalation (breathing in) or exhalation (breathing out)?', parts: facts.map(f => ({ label: f[0], choices: C.slice(), a: f[1] })),
    why: '<b>Inhale</b>: diaphragm contracts &amp; moves DOWN, ribs UP &amp; OUT &rarr; more volume &rarr; lower pressure &rarr; air flows in.<br><b>Exhale</b>: diaphragm relaxes &amp; moves UP, ribs come in &rarr; less volume &rarr; higher pressure &rarr; air pushed out.',
    hint: 'Air always moves from high pressure to low pressure.' };
}
function genRespFacts() {
  const items = [
    ['Where does gas exchange happen in the lungs?', 'Between the alveoli and the capillaries', ['In the trachea', 'In the larynx', 'In the bronchi']],
    ['What surrounds each alveolus?', 'Capillaries', ['Bone', 'Cartilage rings', 'Villi']],
    ['Which part contains the vocal cords?', 'Larynx', ['Pharynx', 'Trachea', 'Bronchi']],
    ['What carries oxygen in the blood?', 'Red blood cells', ['White blood cells', 'Platelets', 'Villi']],
    ['What gas do you breathe out as a waste?', 'Carbon dioxide', ['Oxygen', 'Nitrogen only', 'Glucose']],
    ['Why do your cells need oxygen?', 'To release energy from glucose (cellular respiration)', ['To make DNA', 'To digest food', 'To build cell walls']],
    ['The two tubes that branch from the trachea into the lungs are the&hellip;', 'Bronchi', ['Alveoli', 'Bronchioles', 'Capillaries']],
    ['What is the function of the respiratory system?', 'To exchange oxygen and carbon dioxide', ['To pump blood', 'To digest food', 'To make glucose']]
  ];
  const it = pick(items);
  return mcq({ cat: 'K', q: it[0], right: it[1], wrong: it[2], why: `<b>${it[1]}</b>.<br><br>Air path: nose &rarr; pharynx &rarr; larynx &rarr; trachea &rarr; bronchi &rarr; bronchioles &rarr; <b>alveoli</b> (gas exchange with capillaries).`,
    hint: 'Follow the air.' });
}

/* ============================================================ CIRCULATORY (L8) */
function genVessel() {
  const v = pick(Object.keys(VESSELS)), f = pick(VESSELS[v]);
  return mcq({ cat: 'K', q: `Which blood vessel?<br><i>"${f}"</i>`, right: v, wrong: Object.keys(VESSELS).filter(x => x !== v),
    why: '<b>Artery</b>: thick, elastic, <b>A</b>way from heart, high pressure, deep.<br><b>Vein</b>: thin, valves, back to heart, near skin, deoxygenated.<br><b>Capillary</b>: tiny, where gas &amp; nutrient exchange happens.',
    hint: 'Arteries = Away. Veins = Valves. Capillaries = exChange.' });
}
function genVesselLabel() {
  const parts = ['Vein', 'Venule', 'Capillary', 'Arteriole', 'Artery'];
  const nums = shuffle(['1', '2', '3', '4', '5']), map = {}; parts.forEach((p, i) => map[p] = nums[i]);
  const flip = Math.random() < 0.5;
  const asked = parts.slice().sort((a, b) => map[a] - map[b]);
  return { cat: 'A', type: 'multi', q: `Label the blood vessels. Arrows show the direction the blood flows. <span class="dimline">(Red = oxygen-rich, blue = oxygen-poor.)</span>${vesselDiagram(map, flip)}`,
    parts: asked.map(p => ({ label: `<b>${map[p]}</b>`, choices: parts.slice(), a: parts.indexOf(p) })),
    why: 'Blood flows: <b>Artery &rarr; Arteriole &rarr; Capillaries &rarr; Venule &rarr; Vein</b>.<br>Arteries (red) carry blood away from the heart and branch into smaller arterioles, then tiny capillaries where gas exchange happens; then the vessels join up again into venules and veins (blue) heading back to the heart.<br><span class="dimline">This is Part C of the practice test.</span>',
    hint: 'Find the red end first: that is the artery. "-iole" and "-ule" mean "small".' };
}
const genHeartNext = () => genNext(HEART_PATH, 'Follow the blood through the heart.', 'Body &rarr; right atrium &rarr; right ventricle &rarr; lungs (gas exchange) &rarr; left atrium &rarr; left ventricle &rarr; body. Right side = oxygen-poor, left side = oxygen-rich.', true);
const genHeartOrder = () => genOrder(HEART_PATH, 'Put the path of blood in order, starting from the body.', 'Right side pumps to the lungs; left side pumps to the body.');
function genCircFacts() {
  const items = [
    ['Which circuit carries blood to the lungs and back?', 'Pulmonary', ['Systemic', 'Digestive', 'Lymphatic']],
    ['Which circuit carries oxygen-rich blood to the body?', 'Systemic', ['Pulmonary', 'Respiratory', 'Nervous']],
    ['Which structure carries deoxygenated blood back to the heart?', 'Veins', ['Arteries', 'Arterioles', 'Alveoli']],
    ['Which structure is the site of gas exchange with cells?', 'Capillary', ['Artery', 'Vein', 'Venule']],
    ['What prevents blood from flowing backwards in the heart and veins?', 'Valves', ['Capillaries', 'Villi', 'Platelets']],
    ['The circulatory system is basically a&hellip;', 'Pump and tubes', ['Filter and bag', 'Fan and pipes', 'Battery and wires']],
    ['On average, how many times a minute does the heart beat?', '72', ['12', '150', '30']],
    ['Where is the heart located?', 'Between the lungs in the chest', ['Under the stomach', 'In the abdomen', 'Behind the liver']],
    ['Why is blood called the body\'s "delivery system"?', 'It brings oxygen and nutrients to cells and takes wastes away', ['It only carries water', 'It makes glucose', 'It digests food']]
  ];
  const it = pick(items);
  return mcq({ cat: 'K', q: it[0], right: it[1], wrong: it[2], why: `<b>${it[1]}</b>.<br><br>The circulatory system is a <b>delivery and clean-up</b> system: it delivers oxygen and nutrients, and removes carbon dioxide and wastes.`,
    hint: 'Pulmonary = lungs (think "pulmonologist" = lung doctor).' });
}

/* ============================================================ DIGESTIVE (L9) */
const genFoodOrder = () => genOrder(FOOD_PATH, 'Put the path of <b>food</b> through the digestive system in order.', 'Mouth &rarr; esophagus &rarr; stomach &rarr; small intestine &rarr; large intestine &rarr; rectum &rarr; anus. (Liver and pancreas help, but food never passes through them.)');
const genFoodNext = () => genNext(FOOD_PATH, 'You just swallowed a bite of pizza.');
function genDigestOrgan() {
  const o = pick(DIGEST_ORGANS), wrong = sample(DIGEST_ORGANS.filter(x => x !== o), 3);
  if (Math.random() < 0.5)
    return mcq({ cat: 'K', q: `Which organ does this?<br><i>"${o[1]}"</i>`, right: o[0], wrong: wrong.map(x => x[0]), why: `<b>${o[0]}</b>: ${o[1]}.`, hint: 'Follow the food in your head.' });
  return mcq({ cat: 'K', q: `What does the <b>${o[0].toLowerCase()}</b> do?`, right: o[1], wrong: wrong.map(x => x[1]), why: `<b>${o[0]}</b>: ${o[1]}.`, hint: 'Where is it along the path?' });
}
function genNotDigestive() {
  const odd = pick(NOT_DIGESTIVE), ok = sample(['Stomach', 'Pancreas', 'Liver', 'Esophagus', 'Small intestine', 'Gall bladder', 'Large intestine'], 3);
  return mcq({ cat: 'K', q: 'Which organ is <b>NOT</b> part of the digestive system?', right: odd, wrong: ok,
    why: `<b>${odd}</b> is not digestive.${odd === 'Bladder' ? ' The bladder stores urine. Watch out: the <b>gall</b> bladder IS digestive (it stores bile).' : ''}<br><br>Organs that help digestion without food passing through them: <b>liver, gall bladder, pancreas</b>.`,
    hint: 'Does food or digestive juice ever touch it?' });
}
function genDigestStep() {
  const s = pick(DIGEST_STEPS);
  return mcq({ cat: 'K', q: `Which step of digestion is this?<br><i>"${s[1]}"</i>`, right: s[0], wrong: DIGEST_STEPS.filter(x => x !== s).map(x => x[0]),
    why: '1. <b>Ingestion</b> &rarr; 2. <b>Digestion</b> &rarr; 3. <b>Absorption</b> &rarr; 4. <b>Elimination</b>.', hint: 'In → break down → absorb → out.' });
}
function genVilli() {
  const items = [
    ['What are villi?', 'Tiny finger-like projections lining the small intestine', ['Tiny air sacs in the lungs', 'Valves in veins', 'Teeth in the stomach']],
    ['Why are villi important?', 'They increase surface area so nutrients are absorbed faster', ['They chew food', 'They make bile', 'They pump blood']],
    ['Villi are connected to which blood vessels?', 'Capillaries', ['Arteries only', 'Veins only', 'None']],
    ['What is peristalsis?', 'Muscle contractions that push food along', ['Breathing out', 'A digestive juice', 'Absorbing water']],
    ['Where is most water reabsorbed?', 'Large intestine', ['Mouth', 'Esophagus', 'Stomach']],
    ['Where are most nutrients absorbed into the blood?', 'Small intestine', ['Stomach', 'Large intestine', 'Esophagus']]
  ];
  const it = pick(items);
  return mcq({ cat: 'K', q: it[0], right: it[1], wrong: it[2], why: `<b>${it[1]}</b>.<br><br>Villi = little fingers in the small intestine &rarr; huge surface area &rarr; nutrients pass into the capillaries &rarr; blood delivers them to every cell.`,
    hint: 'Villi ↔ alveoli: both are about surface area.' });
}
/* cross-system: which system? */
function genWhichSystem() {
  const items = [
    ['Takes in oxygen and removes carbon dioxide', 'Respiratory'], ['Breaks down food into nutrients', 'Digestive'], ['Pumps blood around the body', 'Circulatory'],
    ['Contains the alveoli', 'Respiratory'], ['Contains the villi', 'Digestive'], ['Contains arteries and veins', 'Circulatory'], ['Uses peristalsis', 'Digestive'],
    ['Includes the diaphragm and trachea', 'Respiratory'], ['Includes the heart', 'Circulatory'], ['Includes the pancreas and liver', 'Digestive']
  ];
  const it = pick(items);
  return mcq({ cat: 'K', q: `Which organ system?<br><i>"${it[0]}"</i>`, right: it[1], wrong: ['Respiratory', 'Digestive', 'Circulatory'].filter(x => x !== it[1]),
    why: 'All three work as a team: <b>respiratory</b> gets oxygen, <b>digestive</b> gets nutrients, and <b>circulatory</b> delivers both to every cell (practice test Q18: "all of the above").',
    hint: 'Air, food or blood?' });
}
