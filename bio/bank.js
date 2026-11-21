/* ============================================================
   MONSTER BIO — hand-written questions
   Part A: the 20 multiple-choice questions from the practice test (answers from the
   SOLUTIONS file). Written: practice-test Part B + concept check + worksheets.
   ============================================================ */

/* keep: true = don't reshuffle (options like "all of the above" must stay last) */
const PT = (topic, q, choices, a, why, hint, keep) => ({ topic, cat: 'K', type: 'mc', q, choices, a, why, hint, fixed: true, keep: !!keep, pt: true });

const STATIC_BANK = [
PT('cells', 'Which statement about cells is <b>true</b>?', ['All cells contain chloroplasts.', 'All cells contain DNA.', 'All cells have a cell wall.', 'All organisms consist of many cells.'], 1,
  'Every cell needs instructions, so <b>all cells contain DNA</b>. Only plant cells have chloroplasts and cell walls, and some organisms (like bacteria) are just one cell.', 'Watch the word "all".'),
PT('cells', 'Which cell structures are contained in the <b>cytoplasm</b>?', ['mitochondria', 'nucleus', 'endoplasmic reticulum', 'all of the above'], 3,
  'The cytoplasm holds <b>all</b> the organelles &mdash; mitochondria, nucleus, ER and more &mdash; inside the cell membrane.', 'The cytoplasm holds every organelle.', true),
PT('cells', 'You see a cell under a microscope that is <b>square</b> and has a <b>large, empty area</b> in the middle. Which organism could it come from?', ['bacterium', 'bear', 'maple tree', 'zebra', 'mushroom'], 2,
  'Square shape = <b>cell wall</b>. Large empty area = one big <b>vacuole</b>. Both point to a <b>plant</b> cell &rarr; maple tree.', 'Which one is a plant?'),
PT('dna', 'Which list shows the correct order from <b>largest to smallest</b>?', ['chromosome, DNA, gene, nucleus', 'DNA, nucleus, chromosome, gene', 'gene, DNA, chromosome, nucleus', 'nucleus, chromosome, DNA, gene', 'nucleus, DNA, gene, chromosome'], 3,
  '<b>Nucleus &gt; chromosome &gt; DNA &gt; gene.</b> The nucleus holds chromosomes; chromosomes are made of DNA; a gene is a small segment of DNA.', 'Start with the container.', true),
PT('mutations', 'Which statement is <b>FALSE</b>?', ['All mutations are good.', 'Mutations are caused by mutagens.', 'Mutations are changes in the DNA code.', 'Mutations can be caused by X-rays.', 'All of the above'], 0,
  '"All mutations are good" is false &mdash; some are harmful (like cancer), some neutral, some helpful. The other statements are true.', 'Read FALSE twice. "All" is often the trap.', true),
PT('division', 'Which statement about cell division is <b>TRUE</b>?', ['In cell division, two identical cells are formed.', 'Multicellular organisms grow through cell division.', 'Single-celled organisms reproduce through cell division', 'Multicellular organisms replace lost or damaged cells through cell division.', 'All of the above'], 4,
  'Every statement is true: identical daughter cells, <b>growth</b>, <b>reproduction</b> and <b>repair</b>. So the answer is <b>all of the above</b>.', 'Check each one &mdash; are any false?', true),
PT('mitosis', 'During which phase of mitosis does the <b>nuclear membrane disappear</b>?', ['anaphase', 'interphase', 'metaphase', 'prophase', 'telophase'], 3,
  '<b>Prophase</b> (preparation): chromatin condenses into chromosomes and the nuclear membrane breaks down.', 'The first stage of mitosis.', true),
PT('mitosis', 'During which stage of mitosis do replicated chromosomes <b>align in the middle</b>?', ['anaphase', 'interphase', 'metaphase', 'prophase', 'telophase'], 2,
  '<b>Metaphase = Middle.</b>', 'M for Middle.', true),
PT('mitosis', 'During which stage of cell division does the <b>cytoplasm separate</b>?', ['anaphase', 'prophase', 'metaphase', 'cytokinesis', 'telophase'], 3,
  '<b>Cytokinesis</b> &mdash; "cyto" = cell/cytoplasm, "kinesis" = movement. It splits the cell into two daughter cells.', 'It\'s not one of the four PMAT stages.'),
PT('cancer', 'Which statement is <b>FALSE</b>?', ['Benign tumors are less harmful than malignant tumors.', 'A benign tumor is never harmful.', 'A tumor is a result of a mutation in the DNA.', 'Tumours are created when cells do not stop dividing.'], 1,
  '"Never harmful" is false. Benign tumours don\'t spread, but they can still press on organs, and some can become malignant &mdash; that\'s why they\'re removed by surgery.', 'Watch out for "never".'),
PT('cancer', 'What is the best definition for the word <b>tumour</b>?', ['an abnormal lump of rapidly dividing cells', 'a clump of cells that are about to die', 'a clump of cells that are producing toxins', 'cells that are dividing slower than usual'], 0,
  'A tumour is an <b>abnormal mass of rapidly dividing cells</b> with no function.', 'Cancer = division out of control.'),
PT('cancer', 'Which medical imaging technology would be best for viewing a <b>broken arm</b>?', ['CT scan', 'MRI', 'PET', 'ultrasound', 'X ray'], 4,
  '<b>X-ray</b> &mdash; dense bone blocks X-rays, so bones show up clearly.', 'What do they use at the hospital for a broken bone?', true),
PT('tissues', 'Which type of tissue is <b>bone</b>?', ['connective', 'epithelial', 'muscle', 'nervous', 'skeletal'], 0,
  'Bone is <b>connective</b> tissue (so are blood and fat). "Skeletal" is a type of <i>muscle</i>, not a tissue type &mdash; a trap!', 'Bone, blood and fat share a tissue type.'),
PT('tissues', 'What are groups of <b>organs working together</b> called?', ['cells', 'organs', 'organ systems', 'organelles', 'tissue'], 2,
  'Cell &rarr; tissue &rarr; organ &rarr; <b>organ system</b> &rarr; organism.', 'One level above organs.'),
PT('tissues', 'Which type of muscle is found in the <b>heart</b>?', ['cardiac', 'skeletal', 'smooth', 'both cardiac and skeletal', 'both skeletal and smooth'], 0,
  '<b>Cardiac</b> muscle is found only in the heart.', 'Cardiac = heart.', true),
PT('digestive', 'Which list shows the correct order of <b>food passage</b> through the digestive system?', ['large intestine, small intestine, stomach, esophagus, anus', 'mouth, esophagus, stomach, small intestine, large intestine', 'mouth, stomach, liver, large intestine, small intestine', 'mouth, small intestine, large intestine, stomach, esophagus'], 1,
  '<b>Mouth &rarr; esophagus &rarr; stomach &rarr; small intestine &rarr; large intestine</b> (&rarr; rectum &rarr; anus). Food never passes through the liver.', 'Small comes before large.'),
PT('tissues', 'Which are cells called <b>before they become specialized</b>?', ['antibodies', 'antigens', 'pathogens', 'phagocytes', 'stem cells'], 4,
  '<b>Stem cells</b> are unspecialized and can become any type of cell.', 'Every plant grows from a "stem".'),
PT('digestive', 'Which system(s) help cells get the <b>nutrients</b> they need to survive?', ['circulatory system', 'respiratory system', 'digestive system', 'all of the above'], 3,
  '<b>All of them:</b> respiratory gets oxygen, digestive gets food nutrients, circulatory delivers both to every cell.', 'Oxygen is a nutrient too.', true),
PT('respiratory', 'Where does <b>gas exchange</b> take place in the human body?', ['at the surface of the body', 'in the bronchus', 'in the capillaries', 'in the arteries', 'in the veins'], 2,
  'Gas exchange happens in the <b>capillaries</b> &mdash; around the alveoli in the lungs, and next to body cells.', 'The tiniest blood vessels.'),
PT('digestive', 'Which of the following organs is <b>NOT</b> part of the digestive system?', ['Stomach', 'Pancreas', 'Liver', 'Bladder'], 3,
  'The <b>bladder</b> stores urine. The pancreas and liver make digestive juices, so they ARE digestive.', 'Which one deals with urine?'),

/* ============================================================
   WRITTEN ANSWERS — self-marked. rubric = teacher's mark scheme.
   ============================================================ */
{ topic: 'written', part: 'B', cat: 'T', type: 'open', marks: 4,
  q: 'Explain the connection between <b>cell division</b> and <b>tumours</b>. <span class="dimline">(T-4)</span>',
  model: 'Cell division is how new cells are made, but there are only specific times when a cell should divide &ndash; for growth, reproduction or repair. When a cell divides out of control at the wrong time, it can produce a mass of cells with no function that we call a tumour.',
  why: '<b>Teacher\'s marks:</b> 1 what cell division is &middot; 1 what a tumour is &middot; 1 the connection &middot; 1 full sentences.' },
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 5,
  q: 'Explain why <b>plant cells do not have chloroplasts in all of their cells</b>. <span class="dimline">(C-5)</span>',
  model: 'Chloroplasts are an <u>organelle</u> that plants use in <u>photosynthesis</u> to turn carbon dioxide, water and sunlight into glucose. The plant cells that contain chloroplasts are generally in the green parts of the plant, especially the leaves, which absorb sunlight. Cells in the roots, for example, do not contain chloroplasts because the roots are underground. They cannot absorb sunlight, so there is no need for them to have chloroplasts.',
  why: '<b>Teacher\'s marks:</b> 1 what chloroplasts are &middot; 1 which cells DO have them &middot; 1 why only those cells &middot; 1 key vocabulary (organelle, photosynthesis) &middot; 1 full sentences.' },
{ topic: 'written', part: 'B', cat: 'T', type: 'open', marks: 3,
  q: '"Blood is the <b>delivery system</b> of your body." Explain what is meant by this statement. <span class="dimline">(T-3)</span>',
  model: 'Blood delivers vital nutrients to all of the cells in your body and removes the wastes they produce. Oxygen from the respiratory system and nutrients absorbed from food in the digestive system are carried by the blood in the circulatory system to every part of the body.',
  why: '<b>Teacher\'s marks:</b> 1 full sentences &middot; 2 for WHAT blood delivers and WHY it matters.' },
{ topic: 'written', part: 'B', cat: 'T', type: 'open', marks: 4,
  q: 'Capillaries play a role in the <b>circulatory</b> and <b>respiratory</b> systems. Describe how they are important to each. <span class="dimline">(T-4)</span>',
  model: 'Capillaries are the tiny blood vessels that are the site of gas exchange. In the circulatory system, capillaries let oxygen be delivered to your cells while removing carbon dioxide waste. In the respiratory system, capillaries surround the alveoli so the oxygen you breathe in can get into the bloodstream, and carbon dioxide can pass back into the lungs to be exhaled.',
  why: '<b>Teacher\'s marks:</b> 1 what capillaries are &middot; 1 circulatory role &middot; 1 respiratory role &middot; 1 full sentences.' },
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 6,
  q: 'Why is <b>DNA</b> so important? Explain why it is found in every cell, where it is found, and describe the different forms DNA takes during a cell\'s lifetime. <span class="dimline">(C-6)</span>',
  model: 'DNA is the genetic material that contains all the instructions for creating a living thing. Every cell needs a full set of DNA so it can pass it on to new daughter cells after dividing. DNA is found inside the nucleus in a string-like form called chromatin. When the cell prepares to divide, the DNA is duplicated, and the chromatin condenses into chromosomes made of two sister chromatids. After mitosis, each new daughter cell receives one of each pair of chromatids.',
  why: '<b>Teacher\'s marks:</b> 1 what DNA is &middot; 1 why every cell needs it &middot; 1 where it is &middot; 2 the forms (chromatin &rarr; duplicated &rarr; chromosomes/sister chromatids) &middot; 1 full sentences.' },

{ topic: 'written', part: 'X', cat: 'T', type: 'open', marks: 3,
  q: 'What is the difference between <b>arteries, veins and capillaries</b>? What role does each play?',
  model: 'Arteries have thick, elastic walls, are found deeper in the body, and carry oxygenated blood away from the heart at high pressure. Veins have thinner walls, are closer to the surface, contain valves to prevent backflow, and carry deoxygenated blood back to the heart. Capillaries are tiny blood vessels where gas exchange happens between the blood and the cells.',
  why: 'One sentence per vessel. Use: <b>away / toward</b>, <b>thick / thin</b>, <b>valves</b>, <b>gas exchange</b>.' },
{ topic: 'written', part: 'X', cat: 'T', type: 'open', marks: 2,
  q: 'Your cells need oxygen from the air. Where and how do they get the <b>other nutrients</b> they need?',
  model: 'The other nutrients come from the food you eat. Food is broken down in the digestive system, and the villi in the small intestine absorb the nutrients into the bloodstream, which delivers them to the cells.',
  why: 'Must mention: <b>digestive system</b>, <b>villi / small intestine</b>, <b>blood delivers</b>.' },
{ topic: 'written', part: 'X', cat: 'K', type: 'open', marks: 1,
  q: 'How do nutrients actually get <b>inside</b> a cell?',
  model: 'Through <b>diffusion</b> &mdash; particles move from an area of high concentration (the blood) to low concentration (inside the cell).',
  why: 'One word earns it: diffusion. Adding "high to low" makes it airtight.' },
{ topic: 'written', part: 'X', cat: 'K', type: 'open', marks: 3,
  q: 'Why do cells divide? Give <b>3 reasons</b>.',
  model: 'Cells divide so an organism can <b>grow</b> bigger, <b>repair</b> damaged cells, and <b>reproduce</b>.',
  why: 'GRR: Growth, Repair, Reproduction.' },
{ topic: 'written', part: 'X', cat: 'K', type: 'open', marks: 1,
  q: 'What do cells spend <b>most of their lifetime</b> doing?',
  model: 'Growing and doing their everyday jobs during <b>interphase</b> (about 90% of their life).',
  why: 'Interphase, ~90%.' },
{ topic: 'written', part: 'X', cat: 'K', type: 'open', marks: 3,
  q: 'How many types of <b>muscle tissue</b> are there? What does each do?',
  model: 'Three. <b>Skeletal</b> muscle is attached to bones and moves them. <b>Smooth</b> muscle is in the walls of organs like the stomach and intestines. <b>Cardiac</b> muscle is found only in the heart.',
  why: 'Three names + where each is found.' },
{ topic: 'written', part: 'X', cat: 'K', type: 'open', marks: 2,
  q: 'What role does <b>nervous tissue</b> play? Give examples of <b>connective tissue</b>.',
  model: 'Nervous tissue sends and receives signals to other parts of the body and coordinates movement. Examples of connective tissue are bone, fat and blood.',
  why: 'Signals + coordinates; bone, fat, blood.' },
{ topic: 'written', part: 'X', cat: 'T', type: 'open', marks: 3,
  q: 'What is <b>cancer</b>? How is it caused?',
  model: 'Cancer is a group of diseases with uncontrolled cell growth, which can cause life-threatening tumours. It is caused by mutations in DNA that let cells keep dividing even when they are not needed. These mutations can happen naturally or be caused by mutagens like UV rays, X-rays, cigarette smoke and some chemicals.',
  why: 'Definition + mutation + an example of a mutagen.' },
{ topic: 'written', part: 'X', cat: 'T', type: 'open', marks: 2,
  q: 'What do <b>chloroplasts</b> do for a plant cell? Why don\'t animals need them?',
  model: 'Chloroplasts let a plant make its own food (glucose) from sunlight, carbon dioxide and water through photosynthesis. Animals don\'t need them because they get their nutrients by eating plants or other animals.',
  why: 'Photosynthesis + animals eat their food.' },
{ topic: 'written', part: 'X', cat: 'T', type: 'open', marks: 3,
  q: 'Explain how <b>cellular respiration</b> and <b>photosynthesis</b> are opposite reactions.',
  model: 'Photosynthesis uses carbon dioxide, water and sunlight to make glucose and oxygen. Cellular respiration uses glucose and oxygen to release energy, producing carbon dioxide and water. The products of one are the reactants of the other.',
  why: 'Write both equations, then say "the outputs of one are the inputs of the other".' },
{ topic: 'written', part: 'X', cat: 'T', type: 'open', marks: 2,
  q: 'Why do you think releasing energy from glucose is called cellular <b>respiration</b>? How does it connect to taking a breath?',
  model: 'It\'s called respiration because, like breathing, it uses oxygen and gives off carbon dioxide. Every breath in brings the oxygen your cells need for cellular respiration, and every breath out gets rid of the carbon dioxide it produces.',
  why: 'Link: breathe in O<sub>2</sub> &rarr; cells use it; cells make CO<sub>2</sub> &rarr; breathe it out.' },
{ topic: 'written', part: 'X', cat: 'T', type: 'open', marks: 2,
  q: 'Why can\'t a cell just keep growing bigger instead of dividing?',
  model: 'As a cell grows, the material inside increases faster than the cell membrane can grow. There isn\'t enough membrane surface area for nutrients to diffuse in and wastes to diffuse out fast enough, so the cell could die. Dividing keeps cells small.',
  why: 'Key words: <b>surface area</b>, <b>diffusion</b>, <b>too slow</b>.' },
{ topic: 'written', part: 'X', cat: 'C', type: 'open', marks: 3,
  q: 'Explain the difference between <b>chromosomes, DNA and genes</b>.',
  model: 'DNA is the molecule that carries genetic instructions. A chromosome is a thread-like structure in the nucleus made of one long DNA molecule. A gene is a small segment of DNA on a chromosome that controls the production of one protein.',
  why: 'Size order helps: chromosome &gt; DNA &gt; gene.' },
{ topic: 'written', part: 'X', cat: 'T', type: 'open', marks: 2,
  q: 'Why does Canada have <b>ethical concerns</b> about GMOs and cloning? Give one concern for each.',
  model: 'GMOs: people worry about long-term effects that scientists don\'t know about yet, such as effects on organisms (including humans) that eat GMO plants, or on the ecosystem if GMO plants spread. Cloning: cloned animals are genetically identical, so one disease could spread through a whole herd; and few studies have looked at whether cloned meat is safe, so Canada bans selling food from cloned animals.',
  why: 'One concern each. Say "long-term effects are unknown" for GMOs.' },
{ topic: 'written', part: 'X', cat: 'A', type: 'open', marks: 2,
  q: 'A patient\'s cells divide much faster than normal cells. Each cell needs energy to divide. How might this affect someone with a cancerous tumour?',
  model: 'Because the tumour cells keep dividing out of control, they use up much more energy and nutrients than normal cells. That takes energy away from the rest of the body, so the person may feel tired and weak and lose weight.',
  why: 'From the Lesson 5 "Does the patient have cancer?" worksheet.' },
{ topic: 'written', part: 'X', cat: 'C', type: 'open', marks: 3,
  q: 'Describe the path of <b>blood through the heart</b>, starting from the body.',
  model: 'Oxygen-poor blood from the body enters the right atrium, then moves to the right ventricle, which pumps it to the lungs (pulmonary circulation). In the lungs it picks up oxygen and drops off carbon dioxide. Oxygen-rich blood returns to the left atrium, moves to the left ventricle, and is pumped out to the body (systemic circulation). Valves stop the blood flowing backwards.',
  why: 'Right side = to lungs. Left side = to body. Name both circuits for the bonus.' }
];

/* ============================================================
   TOPICS
   ============================================================ */
const TOPICS = {
  cells:       { name: 'Cells &amp; Organelles',       coach: 'frankie',    icon: '&#129440;', lesson: 'Lesson 1', blurb: 'Cell theory, organelles, plant vs animal',
                 gens: [genOrganelle, genOrganelle, genOrganelleTyped, genWhereFound, genPlantOrAnimal, genCellTheory, genLabelCell, tfFor('cells')] },
  energy:      { name: 'Photosynthesis &amp; Respiration', coach: 'venus',  icon: '&#127807;', lesson: 'Lesson 1', blurb: 'Opposite reactions that power life',
                 gens: [genPhotoResp, genPhotoResp, genPhotoRespMulti, glossFor('energy'), tfFor('energy')] },
  dna:         { name: 'DNA, Genes &amp; Chromosomes', coach: 'ghoulia',    icon: '&#129516;', lesson: 'Lesson 2', blurb: '46 chromosomes, A-T-C-G, karyotypes',
                 gens: [genDNAFacts, genDNAFacts, genSizeOrder, genChromoNum, genBases, glossFor('dna'), tfFor('dna'), typeFor('dna')] },
  mutations:   { name: 'Mutations, GMOs &amp; Cloning', coach: 'ghoulia',   icon: '&#129516;', lesson: 'Lesson 2', blurb: 'Mutagens, DNA screening, ethics',
                 gens: [genMutagen, genBiotech, genBiotech, genMutationKind, glossFor('mutations'), tfFor('mutations'), matchFor('mutations')] },
  division:    { name: 'Why Cells Divide',             coach: 'lagoona',    icon: '&#128167;', lesson: 'Lesson 3', blurb: 'Growth, repair, reproduction; diffusion &amp; osmosis',
                 gens: [genGRR, genGRR, genDiffOsm, genDiffDirection, genWhySmall, glossFor('division'), tfFor('division')] },
  mitosis:     { name: 'Cell Cycle &amp; Mitosis',      coach: 'cleo',       icon: '&#10024;',  lesson: 'Lesson 4', blurb: 'I-PMAT-C, with pictures of every stage',
                 gens: [genPhaseEvent, genPhaseEvent, genPhasePic, genPhasePic, genMitosisOrder, genMitosisNext, genMitosisFacts, tfFor('mitosis')] },
  cancer:      { name: 'Cancer &amp; Tumours',          coach: 'abbey',      icon: '&#129658;', lesson: 'Lesson 5', blurb: 'Benign vs malignant, causes, lab data',
                 gens: [genTumour, genCancerFacts, genCancerFacts, genCancerData, genImaging, tfFor('cancer'), glossFor('cancer')] },
  tissues:     { name: 'Specialization &amp; Tissues',  coach: 'cleo',       icon: '&#129529;', lesson: 'Lesson 6', blurb: 'Stem cells, 4 tissue types, cell → organism',
                 gens: [genTissue, genTissue, genTissueJob, genMuscle, genLevelOrg, genHierOrder, genStem, tfFor('tissues')] },
  respiratory: { name: 'Respiratory System',           coach: 'clawdeen',   icon: '&#129729;', lesson: 'Lesson 7', blurb: 'Path of air, alveoli, breathing',
                 gens: [genAirOrder, genAirNext, genBreathing, genRespFacts, genRespFacts, glossFor('respiratory'), tfFor('respiratory')] },
  circulatory: { name: 'Circulatory System',           coach: 'draculaura', icon: '&#129656;', lesson: 'Lesson 8', blurb: 'Heart, arteries, veins, capillaries',
                 gens: [genVessel, genVessel, genVesselLabel, genHeartNext, genHeartOrder, genCircFacts, genCircFacts, tfFor('circulatory')] },
  digestive:   { name: 'Digestive System',             coach: 'frankie',    icon: '&#127829;', lesson: 'Lesson 9', blurb: 'Path of food, organs, villi',
                 gens: [genFoodOrder, genFoodNext, genDigestOrgan, genDigestOrgan, genNotDigestive, genDigestStep, genVilli, genWhichSystem, tfFor('digestive')] },
  written:     { name: 'Explain It',                   coach: 'spectra',    icon: '&#128172;', lesson: 'Written', blurb: 'Written answers you mark yourself, with the teacher\'s mark scheme',
                 gens: [] }
};

const COACHES = {
  frankie:    { name: 'Frankie Stein',       colour: '#7CF03D', line: 'I\'m literally stitched together from cells. Let\'s do this.' },
  venus:      { name: 'Venus McFlytrap',     colour: '#5BD16B', line: 'Plants make their own food. Respect the chloroplast.' },
  ghoulia:    { name: 'Ghoulia Yelps',       colour: '#4DC6FF', line: 'A, T, C, G. Four letters, every living thing.' },
  lagoona:    { name: 'Lagoona Blue',        colour: '#2FE0C8', line: 'Water moves by osmosis, luv. Just go with the flow.' },
  cleo:       { name: 'Cleo de Nile',        colour: '#FFD447', line: 'Prophase, metaphase, anaphase, telophase. In that order. Obviously.' },
  abbey:      { name: 'Abbey Bominable',     colour: '#9FE7FF', line: 'Read the numbers. Numbers do not lie.' },
  clawdeen:   { name: 'Clawdeen Wolf',       colour: '#FF8A3D', line: 'Big howl needs big lungs. Breathe in, diaphragm down.' },
  draculaura: { name: 'Draculaura',          colour: '#FF5FA2', line: 'Blood is kind of my whole thing. Arteries go away, veins come back.' },
  spectra:    { name: 'Spectra Vondergeist', colour: '#C48BFF', line: 'Full sentences. Key words. That\'s where the marks hide.' }
};

/* ---- pull a question from a topic ---- */
function questionFrom(topic) {
  const t = TOPICS[topic];
  const statics = STATIC_BANK.filter(q => q.topic === topic);
  const gens = t ? t.gens : [];
  const useStatic = statics.length && (!gens.length || Math.random() < 0.25);
  const q = useStatic ? JSON.parse(JSON.stringify(pick(statics))) : pick(gens)();
  if (q.type === 'mc' && useStatic && !q.keep) { const r = q.choices[q.a]; q.choices = shuffle(q.choices); q.a = q.choices.indexOf(r); }
  q.topic = topic;
  return q;
}
function randomQuestion(pool) {
  const keys = pool && pool.length ? pool : Object.keys(TOPICS).filter(k => k !== 'written');
  return questionFrom(pick(keys));
}
