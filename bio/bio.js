/* ============================================================
   MONSTER BIO — core helpers + fact tables
   Source: SNC2D Unit 1 (Tissues, Organs & Organ Systems), Lessons 1–9,
   the textbook pages for Lesson 2, the concept check and the practice test.
   ============================================================ */

const rnd = n => Math.floor(Math.random() * n);
const pick = arr => arr[rnd(arr.length)];
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function sample(arr, n) { return shuffle(arr).slice(0, n); }
const cap = s => String(s).replace(/^./, c => c.toUpperCase());

/* multiple choice with the right answer at a random position */
function mcq(o) {
  const choices = shuffle([o.right].concat(o.wrong));
  return Object.assign({ type: 'mc' }, o, { choices, a: choices.indexOf(o.right) });
}
function norm(s) {
  return String(s).toLowerCase().trim().replace(/[’'`]/g, '').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ')
    .replace(/^(the|a|an) /, '').replace(/ies\b/, 'y').replace(/s\b/, '').trim();
}
function answerMatches(given, accepted) {
  const g = norm(given); if (!g) return false;
  return (Array.isArray(accepted) ? accepted : [accepted]).some(a => norm(a) === g);
}
function lev(a, b) {
  const m = a.length, n = b.length; if (Math.abs(m - n) > 3) return 9;
  const d = Array.from({ length: m + 1 }, (_, i) => [i].concat(new Array(n).fill(0)));
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

/* ============================================================
   LESSON 1 — ORGANELLES
   where: 'both' | 'plant' (plant cells only)
   ============================================================ */
const ORGANELLES = [
  { n: 'Nucleus', f: 'Controls all cell activities and holds the DNA', where: 'both', alt: ['nuclei'] },
  { n: 'Ribosome', f: 'Helps produce proteins', where: 'both' },
  { n: 'Mitochondria', f: 'Releases energy from glucose (cellular respiration)', where: 'both', alt: ['mitochondrion'] },
  { n: 'Cytoskeleton', f: 'Filaments and tubes that give the cell its framework and act as “tracks” for organelles', where: 'both' },
  { n: 'Endoplasmic reticulum', f: 'Membrane-covered channels that transport materials; connected to the nucleus', where: 'both', alt: ['er'] },
  { n: 'Cytoplasm', f: 'Holds all the organelles plus sugar and water, inside the cell membrane', where: 'both' },
  { n: 'Vacuole', f: 'Stores water and other materials (one large one in plants, small ones in animals)', where: 'both' },
  { n: 'Golgi body', f: 'Sorts and packages proteins for transport out of the cell', where: 'both', alt: ['golgi apparatus', 'golgi'] },
  { n: 'Cell membrane', f: 'Separates the inside of the cell from outside and controls what goes in and out', where: 'both' },
  { n: 'Vesicle', f: 'Membrane-covered sacs that store or transport materials, sometimes across the membrane', where: 'both' },
  { n: 'Chloroplast', f: 'Traps energy from the sun to make glucose (photosynthesis)', where: 'plant' },
  { n: 'Cell wall', f: 'Tough, rigid layer outside the membrane that supports the cell and gives it a rectangular shape', where: 'plant' }
];

/* ============================================================
   LESSON 2 — DNA
   ============================================================ */
const CHROMO = [['human', 46], ['cow', 60], ['chicken', 78], ['corn', 20], ['butterfly', 80], ['fruit fly', 8]];
const SIZE_ORDER = ['Nucleus', 'Chromosome', 'DNA', 'Gene'];   /* largest → smallest */
const BASES = [['A', 'Adenine'], ['T', 'Thymine'], ['C', 'Cytosine'], ['G', 'Guanine']];

/* ============================================================
   LESSON 4 — MITOSIS
   ============================================================ */
const PHASES = ['Interphase', 'Prophase', 'Metaphase', 'Anaphase', 'Telophase', 'Cytokinesis'];
const PHASE_EVENTS = {
  Interphase: ['The cell grows and carries out its “everyday jobs”', 'The cell copies its DNA (chromatin) and organelles', 'About 90% of a cell\'s life is spent here', 'DNA is loose and string-like (chromatin) — no chromosomes are visible'],
  Prophase: ['Chromatin condenses into visible chromosomes', 'The nuclear membrane disappears', 'Centrioles move to opposite poles of the cell', 'Spindle fibres begin to form', 'Each chromosome shows two sister chromatids joined at a centromere'],
  Metaphase: ['Chromosomes line up along the middle of the cell', 'Spindle fibres attach to the chromosomes at the centromeres', 'Chromosomes align so each new nucleus will get one copy of each'],
  Anaphase: ['Chromosomes are pulled apart at the centromere', 'Sister chromatids move toward opposite poles', 'Spindle fibres shorten and drag the chromatids apart'],
  Telophase: ['Chromosomes arrive at opposite poles', 'Two daughter nuclei form', 'Chromosomes spread out back into chromatin'],
  Cytokinesis: ['The cytoplasm splits into two separate cells', 'A cleavage furrow pinches the animal cell in the middle, like a drawstring', 'Two completely separate daughter cells are made']
};
const PHASE_TRICK = { Interphase: 'In-between (resting & growing)', Prophase: 'Preparation', Metaphase: 'Middle', Anaphase: 'Away (pulled apart)', Telophase: 'Two nuclei (termination)', Cytokinesis: 'Cytoplasm cut in two' };

/* ============================================================
   LESSON 6 — TISSUES & ORGANIZATION
   ============================================================ */
const TISSUES = {
  Epithelial: { job: 'Covers and lines the body: skin, and between and inside organs. Cells are tightly connected to form a barrier.',
    ex: ['skin', 'the lining of the stomach', 'the lining of the small intestine', 'the inner lining of the mouth', 'the covering of internal organs'] },
  Connective: { job: 'Supports, connects and protects other tissues.',
    ex: ['bone', 'blood', 'fat', 'cartilage', 'tendons'] },
  Muscle: { job: 'Contracts to make things move. Three types: skeletal, smooth, cardiac.',
    ex: ['the biceps', 'the heart wall', 'the wall of the stomach', 'the muscles that move your leg', 'the diaphragm'] },
  Nervous: { job: 'Made of neurons. Sends and receives signals and coordinates the body\'s actions.',
    ex: ['the brain', 'the spinal cord', 'neurons', 'nerves in your fingertips', 'the optic nerve'] }
};
const MUSCLES = {
  Skeletal: ['attached to bones and helps them move', 'the muscle in your biceps', 'the muscle you use to kick a ball'],
  Smooth: ['found in the walls of organs like the stomach and intestines', 'the muscle that pushes food along by peristalsis', 'lines the walls of the intestines'],
  Cardiac: ['found ONLY in the heart', 'the muscle that pumps blood around the body', 'makes up the heart wall']
};
const LEVELS_ORG = ['Cell', 'Tissue', 'Organ', 'Organ system', 'Organism'];
const HIERARCHY = [
  ['a heart cell', 'cardiac tissue', 'the heart', 'the circulatory system', 'a human'],
  ['a neuron', 'nervous tissue', 'the brain', 'the nervous system', 'a human'],
  ['a cell lining the stomach', 'epithelial tissue', 'the stomach', 'the digestive system', 'a human'],
  ['a smooth muscle cell', 'smooth muscle tissue', 'the small intestine', 'the digestive system', 'a dog'],
  ['a cardiac muscle cell', 'cardiac muscle tissue', 'the heart', 'the circulatory system', 'a horse']
];

/* ============================================================
   LESSONS 7–9 — SYSTEMS
   ============================================================ */
const AIR_PATH = ['Nose or mouth', 'Pharynx (throat)', 'Larynx (voice box)', 'Trachea', 'Bronchi', 'Bronchioles', 'Alveoli'];
const HEART_PATH = ['Body', 'Right atrium', 'Right ventricle', 'Lungs', 'Left atrium', 'Left ventricle'];   /* then back to Body */
const FOOD_PATH = ['Mouth', 'Esophagus', 'Stomach', 'Small intestine', 'Large intestine', 'Rectum', 'Anus'];
const DIGEST_ORGANS = [
  ['Mouth', 'Holds, tears and chews food'],
  ['Tongue', 'Moves the food into a soft ball and pushes it back to be swallowed'],
  ['Salivary glands', 'Release juices (saliva) into the mouth'],
  ['Esophagus', 'Tube that pushes food from the mouth to the stomach by peristalsis'],
  ['Stomach', 'Churns food and adds powerful enzymes (gastric juices)'],
  ['Liver', 'Produces a digestive juice called bile'],
  ['Gall bladder', 'Stores bile until it is needed'],
  ['Pancreas', 'Produces digestive juices that break food down further'],
  ['Small intestine', 'Absorbs nutrients into the blood through villi'],
  ['Large intestine', 'Reabsorbs water and stores solid waste'],
  ['Rectum', 'Holds solid waste (feces) and controls its release']
];
const NOT_DIGESTIVE = ['Bladder', 'Heart', 'Lungs', 'Kidneys', 'Trachea', 'Brain'];
const DIGEST_STEPS = [
  ['Ingestion', 'Food is taken in and the esophagus pushes it to the stomach by peristalsis'],
  ['Digestion', 'Stomach muscles churn the food and enzymes break it down'],
  ['Absorption', 'Nutrients pass into the bloodstream in the small intestine; water is reabsorbed in the large intestine'],
  ['Elimination', 'Undigested material (feces) is stored in the rectum and leaves through the anus']
];
const VESSELS = {
  Artery: ['thick, elastic walls', 'carries blood AWAY from the heart', 'blood moves under high pressure', 'found deeper in the body', 'usually carries oxygen-rich blood'],
  Vein: ['thin, inelastic walls', 'carries blood TOWARD the heart', 'has valves to stop backflow', 'found closer to the skin', 'usually carries oxygen-poor (deoxygenated) blood'],
  Capillary: ['tiny and thin — one cell thick', 'where gas exchange with cells happens', 'where nutrients pass into cells', 'surrounds the alveoli in the lungs', 'connects arterioles to venules']
};

/* ============================================================
   GLOSSARY (teacher's glossary lists, every lesson)
   ============================================================ */
const GLOSSARY = [
  { t: 'Cell', d: 'The basic unit of structure, function and organization in all living things', g: 'cell', topic: 'cells' },
  { t: 'Organelle', d: 'A structure inside a cell that carries out a specific function', g: 'cell', topic: 'cells' },
  { t: 'Nucleus', d: 'Controls all cell activities and contains the DNA', g: 'cell', topic: 'cells' },
  { t: 'Mitochondria', d: 'Where energy is released from glucose', g: 'cell', topic: 'cells' },
  { t: 'Cytoplasm', d: 'Everything inside the cell membrane that holds the organelles', g: 'cell', topic: 'cells' },
  { t: 'Vacuole', d: 'Stores water and other materials', g: 'cell', topic: 'cells' },
  { t: 'Chloroplast', d: 'Plant-only organelle that traps sunlight to make glucose', g: 'cell', topic: 'cells' },
  { t: 'Cell wall', d: 'Plant-only rigid layer that supports the cell', g: 'cell', topic: 'cells' },
  { t: 'Cellular respiration', d: 'Releasing energy from glucose using oxygen', g: 'energy', topic: 'energy' },
  { t: 'Photosynthesis', d: 'Using sunlight, carbon dioxide and water to make glucose and oxygen', g: 'energy', topic: 'energy' },
  { t: 'Chromosome', d: 'A thread-like structure in the nucleus made mostly of DNA', g: 'dna', topic: 'dna' },
  { t: 'DNA', d: 'Deoxyribonucleic acid — the genetic instructions found in the nucleus', g: 'dna', topic: 'dna' },
  { t: 'Gene', d: 'A segment of DNA that controls the production of a protein', g: 'dna', topic: 'dna' },
  { t: 'Karyotype', d: 'The complete set of chromosomes of an organism, arranged as a picture', g: 'dna', topic: 'dna' },
  { t: 'Genetic code', d: 'The order of the A, T, C and G building blocks in DNA', g: 'dna', topic: 'dna' },
  { t: 'Chromatin', d: 'The long, loose, string-like form of DNA in a nucleus that is not dividing', g: 'dna', topic: 'dna' },
  { t: 'Mutation', d: 'A change in the DNA', g: 'mut', topic: 'mutations' },
  { t: 'Mutagen', d: 'A substance or factor that causes a change in DNA', g: 'mut', topic: 'mutations' },
  { t: 'DNA screening', d: 'Testing genetic material for gene mutations that may lead to disease', g: 'mut', topic: 'mutations' },
  { t: 'Genetically modified organism (GMO)', d: 'An organism whose genes have been altered on purpose by scientists', g: 'mut', topic: 'mutations' },
  { t: 'Cloning', d: 'Creating identical genetic copies of an organism', g: 'mut', topic: 'mutations' },
  { t: 'Gene therapy', d: 'Research into correcting faulty genes to treat disease', g: 'mut', topic: 'mutations' },
  { t: 'Parent cell', d: 'The original cell that divides', g: 'div', topic: 'division' },
  { t: 'Daughter cell', d: 'One of the new cells made when a cell divides', g: 'div', topic: 'division' },
  { t: 'Diffusion', d: 'Movement of particles from high concentration to low concentration', g: 'div', topic: 'division' },
  { t: 'Osmosis', d: 'Movement of water across a semi-permeable membrane', g: 'div', topic: 'division' },
  { t: 'Selectively permeable', d: 'Lets some things cross but not others (like the cell membrane)', g: 'div', topic: 'division' },
  { t: 'Asexual reproduction', d: 'One parent; the offspring has identical DNA', g: 'div', topic: 'division' },
  { t: 'Sexual reproduction', d: 'Egg and sperm from two parents join; offspring are not identical', g: 'div', topic: 'division' },
  { t: 'Cell cycle', d: 'The life of a cell: growth (interphase) and division', g: 'mit', topic: 'mitosis' },
  { t: 'Interphase', d: 'The growth stage where the cell spends about 90% of its life', g: 'mit', topic: 'mitosis' },
  { t: 'Mitosis', d: 'Division of the nucleus in four stages: prophase, metaphase, anaphase, telophase', g: 'mit', topic: 'mitosis' },
  { t: 'Cytokinesis', d: 'The cytoplasm divides to make two separate daughter cells', g: 'mit', topic: 'mitosis' },
  { t: 'Sister chromatids', d: 'The two identical copies of a chromosome joined at the centromere', g: 'mit', topic: 'mitosis' },
  { t: 'Centromere', d: 'Where the two sister chromatids are joined', g: 'mit', topic: 'mitosis' },
  { t: 'Spindle fibres', d: 'Fibres that form from the centrioles and pull chromosomes apart', g: 'mit', topic: 'mitosis' },
  { t: 'Cancer', d: 'A group of diseases with uncontrolled growth and spread of abnormal cells', g: 'can', topic: 'cancer' },
  { t: 'Tumour', d: 'An abnormal mass of rapidly dividing cells with no function', g: 'can', topic: 'cancer' },
  { t: 'Benign tumour', d: 'A non-cancerous tumour that stays in one place', g: 'can', topic: 'cancer' },
  { t: 'Malignant tumour', d: 'A cancerous tumour that can spread to other parts of the body', g: 'can', topic: 'cancer' },
  { t: 'Metastasis', d: 'When cancer cells travel through blood or lymph and start new tumours', g: 'can', topic: 'cancer' },
  { t: 'Stem cell', d: 'An unspecialized cell that can become any type of specialized cell', g: 'tis', topic: 'tissues' },
  { t: 'Cell differentiation', d: 'The stage when cells become specialized', g: 'tis', topic: 'tissues' },
  { t: 'Tissue', d: 'A group of similar specialized cells with the same structure and function', g: 'tis', topic: 'tissues' },
  { t: 'Organ', d: 'Several types of tissues working together to do a specific job', g: 'tis', topic: 'tissues' },
  { t: 'Organ system', d: 'A group of organs working together to do a specific job', g: 'tis', topic: 'tissues' },
  { t: 'Epithelial tissue', d: 'Covers and lines the body, like skin', g: 'tis', topic: 'tissues' },
  { t: 'Connective tissue', d: 'Supports and connects, like bone, blood and fat', g: 'tis', topic: 'tissues' },
  { t: 'Nervous tissue', d: 'Sends and receives signals and coordinates actions', g: 'tis', topic: 'tissues' },
  { t: 'Muscle tissue', d: 'Contracts to produce movement', g: 'tis', topic: 'tissues' },
  { t: 'Respiratory system', d: 'Takes in oxygen and gets rid of carbon dioxide', g: 'resp', topic: 'respiratory' },
  { t: 'Alveoli', d: 'Tiny air sacs in the lungs where gas exchange happens', g: 'resp', topic: 'respiratory' },
  { t: 'Gas exchange', d: 'Oxygen moves into the blood and carbon dioxide moves out', g: 'resp', topic: 'respiratory' },
  { t: 'Diaphragm', d: 'The muscle under the lungs that contracts and moves down when you breathe in', g: 'resp', topic: 'respiratory' },
  { t: 'Trachea', d: 'The windpipe that carries air down to the bronchi', g: 'resp', topic: 'respiratory' },
  { t: 'Circulatory system', d: 'The heart and blood vessels: the body\'s delivery and clean-up system', g: 'circ', topic: 'circulatory' },
  { t: 'Pulmonary circulation', d: 'Carries oxygen-poor blood from the heart to the lungs and back', g: 'circ', topic: 'circulatory' },
  { t: 'Systemic circulation', d: 'Carries oxygen-rich blood from the heart to the body and back', g: 'circ', topic: 'circulatory' },
  { t: 'Artery', d: 'Thick-walled vessel carrying blood away from the heart under high pressure', g: 'circ', topic: 'circulatory' },
  { t: 'Vein', d: 'Thin-walled vessel with valves carrying blood back to the heart', g: 'circ', topic: 'circulatory' },
  { t: 'Capillary', d: 'Tiny vessel where gas and nutrient exchange with cells happens', g: 'circ', topic: 'circulatory' },
  { t: 'Valves', d: 'Flaps in the heart and veins that prevent backflow of blood', g: 'circ', topic: 'circulatory' },
  { t: 'Digestive system', d: 'Breaks food down into nutrients that cells can absorb and use', g: 'dig', topic: 'digestive' },
  { t: 'Peristalsis', d: 'Muscular contractions that push food through the digestive system', g: 'dig', topic: 'digestive' },
  { t: 'Villi', d: 'Finger-like projections in the small intestine that increase surface area for absorption', g: 'dig', topic: 'digestive' },
  { t: 'Bile', d: 'Digestive juice made by the liver and stored in the gall bladder', g: 'dig', topic: 'digestive' },
  { t: 'Feces', d: 'Undigested material stored in the rectum', g: 'dig', topic: 'digestive' }
];

/* ============================================================
   TRUE / FALSE — false ones are the classic traps
   ============================================================ */
const TF = [
  ['All cells contain DNA.', true, 'Yes &mdash; every cell needs instructions. (This is Q1 on the practice test.)', 'cells'],
  ['All cells have a cell wall.', false, 'Only <b>plant</b> cells have a cell wall. Animal cells do not.', 'cells'],
  ['All cells contain chloroplasts.', false, 'Only <b>plant</b> cells have chloroplasts &mdash; and not even all plant cells (roots don\'t).', 'cells'],
  ['All cells come from pre-existing cells.', true, 'That is one of the 3 ideas of cell theory.', 'cells'],
  ['Animal cells have one large vacuole.', false, 'Flip it: <b>plants</b> have one large vacuole; animal cells have several <b>small</b> ones.', 'cells'],
  ['The mitochondria release energy from glucose.', true, 'Mitochondria = the powerhouse. That is cellular respiration.', 'cells'],
  ['Ribosomes help produce proteins.', true, 'Ribosomes make proteins &mdash; some float in the cytoplasm, some sit on the ER.', 'cells'],
  ['The Golgi body controls all cell activities.', false, 'The <b>nucleus</b> controls cell activities. The Golgi body packages proteins.', 'cells'],
  ['Plant cells have mitochondria too.', true, 'Yes! Plants make glucose in chloroplasts, then burn it in mitochondria.', 'energy'],
  ['Photosynthesis produces glucose and oxygen.', true, 'CO<sub>2</sub> + water + sunlight &rarr; glucose + oxygen.', 'energy'],
  ['Cellular respiration produces oxygen.', false, 'Respiration <b>uses</b> oxygen and produces carbon dioxide and water (plus energy).', 'energy'],
  ['Photosynthesis and cellular respiration are opposite reactions.', true, 'The products of one are the ingredients of the other.', 'energy'],
  ['Humans normally have 46 chromosomes.', true, '23 from mom + 23 from dad = 46.', 'dna'],
  ['Humans normally have 23 chromosomes.', false, '46 &mdash; that is 23 <b>pairs</b>.', 'dna'],
  ['A gene is bigger than a chromosome.', false, 'Biggest &rarr; smallest: <b>nucleus &gt; chromosome &gt; DNA &gt; gene</b>.', 'dna'],
  ['Every individual has a unique genetic code (except identical twins).', true, 'The order of A, T, C, G is different in everyone.', 'dna'],
  ['DNA is shaped like a double helix.', true, 'A twisted ladder.', 'dna'],
  ['All mutations are harmful.', false, 'Some are harmful, some are neutral, and some help (they drive evolution).', 'mutations'],
  ['X-rays and UV rays can be mutagens.', true, 'Radiation can damage DNA.', 'mutations'],
  ['Mutations can be inherited.', true, 'If the mutation is in an egg or sperm cell, it can be passed on.', 'mutations'],
  ['Scientists have successfully cloned a human.', false, 'No human has been cloned. Sheep, cats, dogs, rabbits and rats have.', 'mutations'],
  ['Taking a cutting from a plant to grow a new one is a type of cloning.', true, 'Gardeners have been cloning for a long time.', 'mutations'],
  ['In cell division, two identical daughter cells are made.', true, 'Identical in the genes they contain.', 'division'],
  ['Cells keep growing bigger instead of dividing.', false, 'There is a limit: big cells have too little membrane surface area for their size, so diffusion gets too slow.', 'division'],
  ['Diffusion moves particles from low concentration to high concentration.', false, 'Backwards! <b>High &rarr; low</b>, like perfume spreading through a room.', 'division'],
  ['Osmosis is the movement of water across a semi-permeable membrane.', true, 'Osmosis = water only.', 'division'],
  ['Sexual reproduction makes offspring identical to the parent.', false, 'That is <b>asexual</b>. Sexual reproduction mixes DNA from two parents.', 'division'],
  ['Cells spend most of their life in interphase.', true, 'About 90%.', 'mitosis'],
  ['The nuclear membrane disappears during telophase.', false, 'It disappears in <b>prophase</b>. In telophase, new nuclei <i>form</i>.', 'mitosis'],
  ['Chromosomes line up in the middle during metaphase.', true, 'Metaphase = Middle.', 'mitosis'],
  ['The cytoplasm splits during cytokinesis.', true, 'Cyto = cell/cytoplasm, kinesis = movement.', 'mitosis'],
  ['Cancer is contagious.', false, 'Cancer is not contagious like the flu or COVID.', 'cancer'],
  ['A benign tumour is never harmful.', false, 'Benign tumours are less harmful, but they can grow, press on organs, and sometimes turn malignant. (Practice test Q10.)', 'cancer'],
  ['Malignant tumours can spread to other parts of the body.', true, 'Through the blood and lymph &mdash; this is called metastasis.', 'cancer'],
  ['You can inherit cancer directly from your parents.', false, 'You can\'t inherit cancer itself &mdash; you can inherit similar DNA that makes you more <i>susceptible</i>.', 'cancer'],
  ['All cells start their lives as stem cells.', true, 'Stem cells are unspecialized and can become any type of cell.', 'tissues'],
  ['Different specialized cells have different DNA.', false, 'All your cells have the <b>same</b> DNA &mdash; they just turn on different genes.', 'tissues'],
  ['Bone is a type of connective tissue.', true, 'Bone, blood and fat are all connective.', 'tissues'],
  ['Cardiac muscle is found only in the heart.', true, 'Cardiac = heart.', 'tissues'],
  ['A tissue is a group of organs.', false, 'A tissue is a group of similar <b>cells</b>. Organs are made of tissues.', 'tissues'],
  ['Gas exchange happens in the alveoli and capillaries.', true, 'Oxygen moves from alveoli into capillaries; CO<sub>2</sub> moves the other way.', 'respiratory'],
  ['The diaphragm moves up when you breathe in.', false, 'When you inhale the diaphragm <b>contracts and moves down</b>.', 'respiratory'],
  ['The larynx contains the vocal cords.', true, 'That is why it\'s called the voice box.', 'respiratory'],
  ['Arteries carry blood away from the heart.', true, '<b>A</b>rteries = <b>A</b>way.', 'circulatory'],
  ['Veins have thick, elastic walls.', false, 'Veins have <b>thin</b> walls and valves. Arteries are the thick, elastic ones.', 'circulatory'],
  ['Veins contain valves to prevent backflow.', true, 'Because blood in veins is under low pressure.', 'circulatory'],
  ['The heart beats about 72 times per minute on average.', true, 'That number is in the lesson note.', 'circulatory'],
  ['The pulmonary circuit carries blood to the lungs.', true, 'Pulmonary = lungs.', 'circulatory'],
  ['Nutrients are absorbed into the blood mainly in the large intestine.', false, 'Mainly the <b>small</b> intestine, through the villi. The large intestine reabsorbs water.', 'digestive'],
  ['Villi increase surface area in the small intestine.', true, 'More surface = faster absorption.', 'digestive'],
  ['The bladder is part of the digestive system.', false, 'The bladder stores urine &mdash; it\'s part of the urinary (excretory) system. (Practice test Q20.)', 'digestive'],
  ['The liver produces bile.', true, 'The liver makes bile; the gall bladder stores it.', 'digestive']
];
