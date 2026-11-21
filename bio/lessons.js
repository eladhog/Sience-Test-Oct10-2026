/* ============================================================
   MONSTER BIO — visual lessons (one per teacher lesson)
   ============================================================ */
const C = DC;
function cards(list) {
  return `<div class="cards n${list.length}">` + list.map(c =>
    `<div class="cmpc" style="--cc:${c[3]}"><div class="cmpt">${c[0]}</div><div class="cmpf2">${c[1]}</div><div class="cmpd">${c[2]}</div></div>`).join('') + '</div>';
}
function flow(rows) {
  return '<div class="flow">' + rows.map(r =>
    `<div class="frow" style="--fc:${r[2]}"><div class="fq">${r[0]}</div><div class="fa">${r[1]}</div></div>`).join('') + '</div>';
}
function timeline(steps, colour) {
  return `<div class="tl" style="--tc:${colour || C.cyan}">` + steps.map((s, i) =>
    `<div class="tls"><div class="tln">${i + 1}</div><div class="tlt">${s}</div></div>`).join('') + '</div>';
}
function memo(big, small) { return `<div class="memo"><div class="mbig">${big}</div><div class="msmall">${small}</div></div>`; }
function keyed(svg, letters) {
  return svg + '<div class="dkey">' + Object.keys(letters).map(k => `<span><b>${letters[k]}</b> ${k}</span>`).join('') + '</div>';
}
const PL = { 'Cell wall': 'A', 'Cell membrane': 'B', 'Cytoplasm': 'C', 'Mitochondria': 'D', 'Chloroplast': 'E', 'Vacuole': 'F', 'Nucleus': 'G' };
const AN = { 'Cell membrane': 'A', 'Cytoplasm': 'B', 'Mitochondria': 'C', 'Nucleus': 'D', 'Vacuole': 'E', 'Ribosome': 'F' };
function phaseRow(list) {
  return '<div class="phrow">' + list.map(p => `<div class="phc">${phaseDiagram(p)}<b>${p}</b><span>${PHASE_TRICK[p]}</span></div>`).join('') + '</div>';
}

const LESSONS = {

cells: { title: 'Cells &amp; Organelles', sub: 'Lesson 1 · the building blocks', steps: [
  { h: 'Cell theory: 3 big ideas',
    b: 'Everything alive is made of cells. Memorise these three &mdash; they\'re free marks.',
    v: timeline(['All living things are made of one or more <b>cells</b>', 'The cell is the <b>basic unit</b> of structure, function and organization', 'All cells come from <b>pre-existing cells</b>'], C.pink) },
  { h: 'Organelles = tiny organs inside the cell',
    b: 'An <b>organelle</b> is a structure that does one specific job. Many of them help make, store or move <b>proteins</b> &mdash; which your body needs for growth and repair.',
    v: keyed(cellDiagram('animal', AN), AN) },
  { h: 'The control &amp; power team',
    b: 'Think of the cell as a monster school.',
    v: flow([['<b>Nucleus</b> &mdash; the principal: controls everything, holds the DNA', 'BOSS', C.purple],
             ['<b>Mitochondria</b> &mdash; the cafeteria: releases energy from glucose', 'POWER', C.orange],
             ['<b>Ribosomes</b> &mdash; the kitchen: make proteins', 'MAKER', C.warn],
             ['<b>Cell membrane</b> &mdash; the front door: controls what goes in and out', 'DOOR', C.cyan]]) },
  { h: 'The transport &amp; storage team',
    b: '',
    v: flow([['<b>Endoplasmic reticulum</b> &mdash; hallways (channels) connected to the nucleus', 'HALLS', C.blue],
             ['<b>Golgi body</b> &mdash; the mail room: sorts &amp; packages proteins to ship out', 'MAIL', C.pink],
             ['<b>Vesicles</b> &mdash; delivery bags carrying materials', 'BAGS', C.acid],
             ['<b>Vacuole</b> &mdash; storage closet for water and materials', 'STORAGE', C.blue],
             ['<b>Cytoskeleton</b> &mdash; the frame + tracks for organelles', 'FRAME', C.dim],
             ['<b>Cytoplasm</b> &mdash; everything inside the membrane, holding it all', 'JELLY', C.purple]]) },
  { h: 'Plant cells have 2 extra parts',
    b: 'Only plants have a <b>cell wall</b> (rigid, makes them rectangular) and <b>chloroplasts</b> (green, make glucose). Plants also have <b>one large vacuole</b>; animals have several small ones.',
    v: keyed(cellDiagram('plant', PL), PL) },
  { h: 'Spot it under a microscope',
    b: 'This is exactly practice-test Q3.',
    v: cards([['square / rectangle + big empty middle', 'PLANT', 'Cell wall + large vacuole (+ maybe green chloroplasts)', C.good],
              ['round / blobby, small vacuoles', 'ANIMAL', 'No wall, no chloroplasts', C.pink]]) }
] },

energy: { title: 'Photosynthesis &amp; Respiration', sub: 'Lesson 1 · energy for life', steps: [
  { h: 'Every cell needs energy',
    b: '<b>Mitochondria</b> release energy from glucose to power every cell. This is <b>cellular respiration</b>. It needs <b>oxygen</b> (from the air you breathe) and <b>glucose</b> (from the food you eat).',
    v: memo('glucose + oxygen &rarr; energy + CO<sub>2</sub> + water', 'Cellular respiration &middot; in the mitochondria &middot; plants AND animals') },
  { h: 'Plants make their own glucose',
    b: '<b>Chloroplasts</b> use sunlight to make glucose. This is <b>photosynthesis</b> (photo = light, synthesis = making).',
    v: memo('CO<sub>2</sub> + water + sunlight &rarr; glucose + oxygen', 'Photosynthesis &middot; in the chloroplasts &middot; plants only') },
  { h: 'They are opposites',
    b: 'What one makes, the other uses. Plants do <b>both</b>: they make glucose in chloroplasts, then burn it in their mitochondria.',
    v: cards([['chloroplast', 'Photosynthesis', 'IN: CO<sub>2</sub> + water + light<br>OUT: glucose + O<sub>2</sub>', C.good],
              ['mitochondria', 'Respiration', 'IN: glucose + O<sub>2</sub><br>OUT: CO<sub>2</sub> + water + energy', C.orange]]) },
  { h: 'Why "respiration"?',
    b: 'Because it\'s connected to breathing! Each breath <b>in</b> brings the oxygen your cells need. Each breath <b>out</b> gets rid of the carbon dioxide your cells made.',
    v: flow([['Breathe in &rarr; O<sub>2</sub> to your cells', 'IN', C.cyan], ['Cells burn glucose &rarr; energy', 'USE', C.orange], ['CO<sub>2</sub> made &rarr; breathe out', 'OUT', C.dim]]) }
] },

dna: { title: 'DNA, Genes &amp; Chromosomes', sub: 'Lesson 2 · the instruction book', steps: [
  { h: 'The nucleus holds the instructions',
    b: 'The <b>nucleus</b> of every cell has a complete set of DNA &mdash; the instructions that decide what each cell becomes and how it works.',
    v: memo('Nucleus &gt; Chromosome &gt; DNA &gt; Gene', 'Biggest to smallest &mdash; practice-test Q4') },
  { h: 'Chromosomes come in pairs',
    b: 'DNA is packed into thread-like <b>chromosomes</b>. One of each pair comes from each parent. The whole set is called a <b>karyotype</b>.',
    v: cards([['from mom', '23', 'chromosomes', C.pink], ['from dad', '23', 'chromosomes', C.blue], ['total', '46', '23 pairs', C.good]]) },
  { h: 'DNA is a twisted ladder',
    b: '<b>Deoxyribonucleic acid</b> is a <b>double helix</b>. The rungs are made of four bases. The <b>order</b> of the bases is the <b>genetic code</b> &mdash; unique for everyone (except identical twins).',
    v: cards([['A', 'Adenine', '', C.bad], ['T', 'Thymine', '', C.blue], ['C', 'Cytosine', '', C.warn], ['G', 'Guanine', '', C.good]]) },
  { h: 'A gene = one recipe',
    b: 'A <b>gene</b> is a segment of DNA that controls the making of one <b>protein</b>. Proteins build body parts, carry materials, send signals, and speed up reactions (enzymes).',
    v: chain(['DNA', 'gene', 'protein', 'trait (eye colour, digesting milk&hellip;)'], C.purple) },
  { h: 'Other organisms, other numbers',
    b: 'The number of chromosomes is specific to each species. Half always comes from each parent.',
    v: `<table class="dtable">${CHROMO.map(c => `<tr><td>${cap(c[0])}</td><td><b>${c[1]}</b></td><td class="dimline">${c[1] / 2} from each parent</td></tr>`).join('')}</table>` }
] },

mutations: { title: 'Mutations, GMOs &amp; Cloning', sub: 'Lesson 2 · when DNA changes', steps: [
  { h: 'Mutation = a change in DNA',
    b: 'A mutation changes the order of A, T, C, G. That can change the protein the gene makes. Example: <b>sickle cell anemia</b> &mdash; a mutation changes hemoglobin, so red blood cells can\'t carry oxygen well.',
    v: cards([['harmful', 'Bad', 'e.g. cancer, sickle cell', C.bad], ['neutral', 'Meh', 'no effect', C.dim], ['helpful', 'Good', 'drives evolution, e.g. bacteria resisting antibiotics', C.good]]) },
  { h: 'Where mutations come from',
    b: 'A <b>mutagen</b> is a substance or factor that changes DNA.',
    v: flow([['Happens <b>naturally</b>, for no reason', 'NATURAL', C.dim], ['<b>Inherited</b> from a parent\'s egg or sperm', 'INHERITED', C.purple],
             ['<b>Environment</b>: X-rays, UV rays, chemicals (mercury)', 'ACQUIRED', C.warn], ['<b>Lifestyle</b>: smoking, alcohol', 'ACQUIRED', C.orange]]) },
  { h: 'DNA screening',
    b: 'Testing genetic material for mutations that may cause disease &mdash; in adults <b>and</b> in fetuses.',
    v: flow([['<b>PKU</b> &mdash; blood from a newborn\'s heel', 'BLOOD', C.bad], ['<b>Down syndrome</b> &mdash; karyotype from amniotic fluid; 3 copies of chromosome 21 (47 total)', 'KARYOTYPE', C.purple], ['<b>Huntington</b> &mdash; 50% chance if a parent has it; ethical debate about testing', 'ETHICS', C.warn]]) },
  { h: 'GMOs',
    b: 'The genetic code is <b>universal</b> &mdash; all life uses A, T, C, G &mdash; so a gene from one species can work in another. <b>Concern:</b> long-term effects are unknown, for people who eat GMOs and for ecosystems.',
    v: cards([['bacteria', 'Insulin', 'E. coli given a human gene makes insulin for diabetes', C.cyan], ['crops', 'Pest-proof', 'Corn, canola, soy resist pests, drought, cold', C.good], ['animals', 'Big salmon', 'Growth-hormone gene, grows faster', C.pink]]) },
  { h: 'Cloning',
    b: 'Making an <b>identical genetic copy</b>. Gardeners have done it for ages with cuttings. Dolly the sheep (1996) was the first mammal cloned from an adult cell. <b>No human has been cloned.</b>',
    v: memo('Clone = copy', 'Plant cuttings &middot; Steward\'s carrot (1958) &middot; Dolly the sheep (1996)') }
] },

division: { title: 'Why Cells Divide', sub: 'Lesson 3 · stay small, stay alive', steps: [
  { h: 'Parent cell &rarr; two daughter cells',
    b: 'One cell divides into two. The new <b>daughter cells</b> have <b>identical genes</b> to the <b>parent cell</b>.',
    v: chain(['parent cell', '2 identical daughter cells'], C.cyan) },
  { h: 'Why not one giant cell?',
    b: 'As a cell grows, the stuff inside grows <b>faster</b> than the membrane. Not enough membrane = nutrients can\'t get in and wastes can\'t get out fast enough &rarr; the cell could die. So cells <b>divide</b> instead.',
    v: cards([['small cell', 'Lots of door per room', 'Diffusion is fast &#10003;', C.good], ['huge cell', 'Tiny door, huge room', 'Diffusion too slow &#10007;', C.bad]]) },
  { h: 'Diffusion and osmosis',
    b: 'Cells move things in and out without using energy.',
    v: cards([['any particles', 'Diffusion', 'From <b>high</b> concentration to <b>low</b> until evenly spread. Like perfume in a room.', C.cyan],
              ['water only', 'Osmosis', 'Water crossing a <b>semi-permeable</b> membrane. The membrane is <b>selectively permeable</b>: some things pass, others don\'t.', C.blue]]) },
  { h: 'Diffusion happens everywhere',
    b: '',
    v: flow([['<b>Inside</b> a cell: from one organelle to another', '1', C.cyan], ['<b>Across</b> the membrane: O<sub>2</sub> in, CO<sub>2</sub> out', '2', C.cyan], ['<b>Between</b> cells: nerve cells release chemicals to talk', '3', C.cyan]]) },
  { h: 'GRR: 3 reasons cells divide',
    b: 'Growl it like a monster: <b>GRR</b>.',
    v: cards([['egg &rarr; baby &rarr; you', 'Growth', 'One cell becomes trillions', C.good], ['cuts, broken bones', 'Repair', 'Replace dead or injured cells', C.pink], ['bacteria, amoeba', 'Reproduction', 'Make a new organism', C.purple]]) },
  { h: 'Asexual vs sexual reproduction',
    b: '',
    v: cards([['one parent', 'Asexual', 'Offspring has <b>identical</b> DNA. Single-celled organisms + all your body cells.', C.cyan], ['two parents', 'Sexual', 'Egg + sperm join. Offspring are <b>not</b> identical.', C.pink]]) }
] },

mitosis: { title: 'Cell Cycle &amp; Mitosis', sub: 'Lesson 4 · I-PMAT-C', steps: [
  { h: 'A cell\'s life: grow, then divide',
    b: '<b>Interphase</b> = growth. The cell spends about <b>90%</b> of its life here, doing everyday jobs. When triggered, it copies its organelles and makes two identical copies of its DNA (<b>chromatin</b>).',
    v: phaseRow(['Interphase']) },
  { h: 'Mitosis has 4 stages: PMAT',
    b: 'Say it like a name: <b>"P-MAT"</b>. Then cytokinesis splits the cell.',
    v: flow([['<b>P</b>rophase', 'PREPARE', C.pink], ['<b>M</b>etaphase', 'MIDDLE', C.warn], ['<b>A</b>naphase', 'AWAY', C.cyan], ['<b>T</b>elophase', 'TWO NUCLEI', C.good], ['<b>C</b>ytokinesis', 'CUT', C.purple]]) },
  { h: 'Prophase &mdash; prepare',
    b: 'Chromatin condenses into visible <b>chromosomes</b> (X shapes: two <b>sister chromatids</b> joined at a <b>centromere</b>). The <b>nuclear membrane disappears</b>. Centrioles move to the poles and <b>spindle fibres</b> start to form.',
    v: phaseRow(['Prophase']) },
  { h: 'Metaphase &amp; Anaphase',
    b: '<b>Metaphase</b>: chromosomes line up in the <b>middle</b>; spindle fibres attach at the centromeres.<br><b>Anaphase</b>: chromosomes are pulled apart at the centromere and chromatids move <b>away</b> to opposite poles.',
    v: phaseRow(['Metaphase', 'Anaphase']) },
  { h: 'Telophase &amp; Cytokinesis',
    b: '<b>Telophase</b>: chromatids arrive at the poles, <b>two daughter nuclei</b> form, chromosomes relax back into chromatin.<br><b>Cytokinesis</b>: a <b>cleavage furrow</b> pinches the cell like a drawstring &mdash; two separate daughter cells.',
    v: phaseRow(['Telophase', 'Cytokinesis']) },
  { h: 'The whole cycle',
    b: 'Then each daughter cell goes back into interphase. Practise spotting these shapes &mdash; that\'s what you did with the onion root tips and horse ascarid eggs.',
    v: phaseRow(PHASES) }
] },

cancer: { title: 'Cancer &amp; Tumours', sub: 'Lesson 5 · division out of control', steps: [
  { h: 'What is cancer?',
    b: 'A group of diseases (more than 200) with <b>uncontrolled growth and spread of abnormal cells</b>. It can happen anywhere in the body, at any age. It is <b>not contagious</b>.',
    v: cards([['normal division', 'Controlled', 'Only for growth or to replace damaged cells', C.good], ['cancer', 'Out of control', 'Keeps dividing when not needed; crowds out normal cells; damages organs', C.bad]]) },
  { h: 'Tumours',
    b: 'A <b>tumour</b> is a mass of rapidly dividing cells with no function.',
    v: cards([['non-cancerous', 'Benign', 'Doesn\'t spread &middot; stays at original site &middot; removed by surgery &middot; can sometimes become malignant', C.warn],
              ['cancerous', 'Malignant', 'Can spread through blood and lymph &middot; starts new tumours (<b>metastasis</b>)', C.bad]]) },
  { h: 'What causes it?',
    b: 'Cancer starts with a <b>mutation</b> in DNA. Triggers include:',
    v: flow([['UV radiation &middot; cigarette smoke &middot; pollution', 'ENVIRONMENT', C.warn], ['Chemicals &middot; heat &middot; virus infection', 'EXPOSURE', C.orange], ['Age &middot; genetics', 'BODY', C.purple]]) },
  { h: 'Can you inherit cancer?',
    b: '<b>No</b> &mdash; but families share similar DNA (similar weak spots) and similar environments, so some families are more <b>susceptible</b>. Lifestyle choices make a big difference.',
    v: memo('You can\'t inherit cancer', '&hellip;but you can inherit a higher risk') },
  { h: 'Reading the lab data',
    b: 'Normal cells double steadily. Tumour cells grow much faster &mdash; and use way more energy (each division costs energy).',
    v: (() => { const n = [2, 4, 8, 16, 32, 64], p = [2, 6, 10, 30, 92, 180]; return `<table class="dtable"><tr><th>Days</th><th>Normal</th><th>Patient</th></tr>${[15, 30, 45, 60, 75, 90].map((d, i) => `<tr><td>${d}</td><td>${n[i]}</td><td><b>${p[i]}</b></td></tr>`).join('')}</table>`; })() },
  { h: 'Seeing inside the body',
    b: 'Practice-test Q12 asks which imaging is best for a broken arm.',
    v: flow([['Bones (broken arm)', 'X-RAY', C.cyan], ['Baby during pregnancy (sound waves)', 'ULTRASOUND', C.good], ['Soft tissue: brain, ligaments', 'MRI', C.purple], ['Where cancer cells are active', 'PET', C.bad], ['Many X-rays combined into slices', 'CT', C.warn]]) }
] },

tissues: { title: 'Specialization &amp; Tissues', sub: 'Lesson 6 · from cell to organism', steps: [
  { h: 'Why specialize?',
    b: 'Big, complex organisms need different tools for different jobs. Every cell starts as an identical <b>stem cell</b> (made by mitosis), then <b>differentiates</b> into a specialized cell like a muscle cell or red blood cell.',
    v: chain(['stem cell', 'differentiation', 'specialized cell'], C.pink) },
  { h: 'Same DNA, different jobs',
    b: 'All your cells have the <b>same genes</b>, but each type turns on different ones, so it makes <b>different proteins</b>.',
    v: memo('Same DNA &ne; same cell', 'It\'s about which genes are switched ON') },
  { h: 'Levels of organization',
    b: 'Simplest to most complex. Practice-test Q14: groups of organs = <b>organ systems</b>.',
    v: timeline(['<b>Cell</b> &mdash; a heart cell', '<b>Tissue</b> &mdash; cardiac tissue (similar cells, same job)', '<b>Organ</b> &mdash; the heart (several tissues together)', '<b>Organ system</b> &mdash; circulatory system (organs together)', '<b>Organism</b> &mdash; a human'], C.purple) },
  { h: 'The 4 tissue types',
    b: '',
    v: cards([['covers', 'Epithelial', 'Skin; lines organs. Tightly joined cells form a barrier.', C.pink], ['supports', 'Connective', '<b>Bone, blood, fat</b>, cartilage', C.warn], ['moves', 'Muscle', 'Skeletal, smooth, cardiac', C.bad], ['signals', 'Nervous', 'Neurons send &amp; receive signals; coordinate the body', C.purple]]) },
  { h: '3 types of muscle',
    b: 'Trap on the practice test: "skeletal" is a muscle type, not a tissue type.',
    v: cards([['attached to bones', 'Skeletal', 'Moves your bones', C.orange], ['walls of organs', 'Smooth', 'Stomach, intestines', C.pink], ['heart only', 'Cardiac', 'Pumps blood', C.bad]]) },
  { h: 'Stem cell research',
    b: 'Stem cells can be collected from the <b>umbilical cord or placenta</b> after birth, or from unused fertilized <b>embryos</b> at fertility clinics. Scientists hope to use them to <b>regenerate damaged tissues or even whole organs</b>. (Using embryos raises ethical questions.)',
    v: memo('Stem cells = spare parts?', 'Regenerating tissues and organs') }
] },

respiratory: { title: 'Respiratory System', sub: 'Lesson 7 · oxygen in, CO₂ out', steps: [
  { h: 'Why we breathe',
    b: 'Cells need <b>oxygen</b> to release energy from glucose (cellular respiration). That makes <b>carbon dioxide</b> and water. The respiratory system swaps O<sub>2</sub> in and CO<sub>2</sub> out.',
    v: memo('O<sub>2</sub> in &middot; CO<sub>2</sub> out', 'That\'s the whole job') },
  { h: 'The path of air',
    b: 'Follow a breath down. The larynx holds the <b>vocal cords</b>.',
    v: timeline(AIR_PATH.map((s, i) => i === AIR_PATH.length - 1 ? `<b>${s}</b> &mdash; gas exchange happens here` : s), C.cyan) },
  { h: 'Gas exchange',
    b: 'The <b>alveoli</b> are tiny air sacs wrapped in <b>capillaries</b>. Red blood cells pick up O<sub>2</sub> from the alveoli and drop off CO<sub>2</sub>, which you breathe out next breath.',
    v: cards([['alveoli &rarr; blood', 'O<sub>2</sub>', 'into the capillaries', C.bad], ['blood &rarr; alveoli', 'CO<sub>2</sub>', 'breathed out', C.blue]]) },
  { h: 'Breathing movements',
    b: 'Air always flows from <b>high pressure to low</b>.',
    v: cards([['inhalation', 'Breathe IN', 'Diaphragm <b>contracts &amp; moves down</b><br>Ribs <b>up &amp; out</b><br>Volume &uarr; pressure &darr;<br>Air rushes in', C.good],
              ['exhalation', 'Breathe OUT', 'Diaphragm <b>relaxes &amp; moves up</b><br>Ribcage compresses<br>Volume &darr; pressure &uarr;<br>Air pushed out', C.orange]]) }
] },

circulatory: { title: 'Circulatory System', sub: 'Lesson 8 · the delivery system', steps: [
  { h: 'Delivery and clean-up',
    b: 'Blood carries <b>oxygen and nutrients to</b> the cells, and <b>carbon dioxide and wastes away</b>. That\'s why it\'s called the body\'s delivery system.',
    v: memo('Pump + tubes', 'Heart = pump &middot; blood vessels = tubes') },
  { h: 'The heart',
    b: 'A muscular organ between the lungs, beating about <b>72 times a minute</b>. <b>Valves</b> stop blood flowing backwards.',
    v: timeline(['Body (oxygen-poor blood)', '<b>Right atrium</b>', '<b>Right ventricle</b>', 'Lungs &mdash; gas exchange', '<b>Left atrium</b>', '<b>Left ventricle</b> &rarr; out to the body'], C.bad) },
  { h: 'Two circuits',
    b: '',
    v: cards([['heart &#8644; lungs', 'Pulmonary', 'Oxygen-poor blood goes to the lungs and comes back oxygen-rich', C.blue], ['heart &#8644; body', 'Systemic', 'Oxygen-rich blood delivers nutrients, picks up wastes, returns oxygen-poor', C.bad]]) },
  { h: 'Three kinds of blood vessel',
    b: 'Tricks: <b>A</b>rteries go <b>A</b>way. <b>V</b>eins have <b>V</b>alves. <b>C</b>apillaries ex<b>C</b>hange.',
    v: cards([['away from heart', 'Artery', 'Thick, elastic walls &middot; high pressure &middot; deep', C.bad], ['exchange', 'Capillary', 'Tiny, thin &middot; gas &amp; nutrient exchange', C.purple], ['back to heart', 'Vein', 'Thin walls &middot; valves &middot; near the skin &middot; deoxygenated', C.blue]]) },
  { h: 'Big to small and back again',
    b: 'Vessels branch smaller and smaller to reach every cell, then join up again. This is the labelling question in Part C of the practice test.',
    v: keyed(vesselDiagram({ Artery: '1', Arteriole: '2', Capillary: '3', Venule: '4', Vein: '5' }, false), { Artery: '1', Arteriole: '2', Capillary: '3', Venule: '4', Vein: '5' }) }
] },

digestive: { title: 'Digestive System', sub: 'Lesson 9 · food into nutrients', steps: [
  { h: 'The job',
    b: 'Break <b>food</b> down into <b>nutrients</b> that cells can absorb and use.',
    v: chain(FOOD_PATH, C.orange) },
  { h: 'The organs',
    b: 'The <b>liver, gall bladder and pancreas</b> help, but food never passes through them. The <b>bladder</b> is NOT digestive.',
    v: `<table class="dtable">${DIGEST_ORGANS.map(o => `<tr><td><b>${o[0]}</b></td><td>${o[1]}</td></tr>`).join('')}</table>` },
  { h: 'The 4 steps',
    b: '',
    v: timeline(DIGEST_STEPS.map(s => `<b>${s[0]}</b> &mdash; ${s[1]}`), C.orange) },
  { h: 'Villi',
    b: 'Tiny finger-like <b>villi</b> line the small intestine. They massively increase the <b>surface area</b>, and they connect to <b>capillaries</b>, so nutrients pass straight into the blood.',
    v: memo('Villi = more surface area', 'Same idea as alveoli in the lungs!') },
  { h: 'Teamwork',
    b: 'Practice-test Q18: which systems help cells get nutrients? <b>All of them.</b>',
    v: cards([['gets oxygen', 'Respiratory', 'alveoli', C.cyan], ['gets nutrients', 'Digestive', 'villi', C.orange], ['delivers both', 'Circulatory', 'capillaries', C.bad]]) }
] }
};
const LESSON_HOOKS = {};
