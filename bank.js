/* ============================================================
   MONSTER CHEM — hand-written question bank
   Concepts, definitions, communication answers.
   ============================================================ */

const STATIC_BANK = [
/* ---------------- ACIDS, BASES & pH ---------------- */
{topic:'acids',cat:'K',type:'mc',q:'Which of the following pairs of substances tastes <b>sour</b>?',
 choices:['HCl and NaOH','KOH and NH<sub>3</sub>','HCl and HNO<sub>3</sub>','H<sub>2</sub>O and H<sub>3</sub>PO<sub>4</sub>'],a:2,raw:true,
 why:'<b>Acids taste sour</b> (think lemon juice and vinegar). HCl and HNO<sub>3</sub> are both acids. NaOH, KOH and NH<sub>3</sub> are bases &mdash; bases taste bitter and feel slippery. H<sub>2</sub>O is neutral.',
 hint:'Sour = acid. Which option has TWO acids in it?'},

{topic:'acids',cat:'K',type:'mc',q:'Which of the following statements is <b>not incorrect</b>? <span class="warnflag">read that wording twice</span>',
 choices:['Water has normally a pH of 7.','Bases have a pH lower than the pH of water.','Acids have a pH that is more than 7.','The higher the pH value, the more acidic it is.'],a:0,
 why:'"Not incorrect" is a <b>double negative</b> &mdash; it just means <b>which one is TRUE</b>. Slow down and translate the question first.<br><br>&bull; <b>Water has a pH of 7</b> &mdash; TRUE. This is the answer.<br>&bull; Bases have a pH <b>higher</b> than 7, not lower.<br>&bull; Acids have a pH <b>less</b> than 7, not more.<br>&bull; The higher the pH, the <b>less</b> acidic it is.',
 hint:'"Not incorrect" = correct. Three of these are false &mdash; find the one true statement.'},

{topic:'acids',cat:'K',type:'mc',q:'In addition to water, what kind of substance is formed in an acid&ndash;base <b>neutralization</b> reaction?',
 choices:['Salt','Gas','Molecular compound','Aqueous solution'],a:0,
 why:'<b>Acid + Base &rarr; Salt + Water.</b> That is the one you must memorise. Example: HCl + NaOH &rarr; NaCl + H<sub>2</sub>O, where NaCl is the salt.',
 hint:'There is a famous two-product rule for neutralization. Water is one of them &mdash; what is the other?'},

{topic:'ph',cat:'K',type:'mc',q:'______ is a numerical scale ranging from 0 to 14 that is used to classify aqueous solutions as acidic, basic, or neutral.',
 choices:['pH scale','Weighing scale','pH indicator','pH meter'],a:0,
 why:'The <b>pH scale</b> is the 0&ndash;14 scale itself. A pH <i>meter</i> and a pH <i>indicator</i> are TOOLS you use to measure where something sits on that scale.',
 hint:'The question asks for the SCALE, not the tool that measures it.'},

{topic:'acids',cat:'K',type:'mc',q:'Which of the following is a <b>binary acid</b>?',
 choices:['NaHCO<sub>3</sub>','HNO<sub>3</sub>','HF','NH<sub>3</sub>'],a:2,raw:true,
 why:'<b>HF</b> &mdash; hydrofluoric acid. A binary acid = hydrogen + exactly one other element, with <b>no oxygen</b>. HNO<sub>3</sub> has oxygen so it is an oxoacid. NaHCO<sub>3</sub> is a salt, and NH<sub>3</sub> is a base.',
 hint:'"Binary" means TWO elements. And it must start with H.'},

{topic:'acids',cat:'K',type:'mc',q:'Which of the following acids is H<sub>2</sub>SO<sub>4 (aq)</sub>?',
 choices:['Sulfurous acid','Hydrosulfuric acid','Sulfuric acid','Sulfate acid'],a:2,
 why:'<b>Sulfuric acid.</b> It comes from the <b>sulfate</b> ion SO<sub>4</sub><sup>2&minus;</sup>, and the rule is <b>&ndash;ate becomes &ndash;ic acid</b>. H<sub>2</sub>SO<sub>3</sub> comes from sulf<b>ite</b>, so it is sulfur<b>ous</b> acid.',
 hint:'-ate &rarr; -ic acid.   -ite &rarr; -ous acid.'},

{topic:'acids',cat:'K',type:'mc',q:'What is a solid that forms and separates out when two aqueous solutions react?',
 choices:['An ice','An element','A precipitate','A compound'],a:2,
 why:'A <b>precipitate</b> is an insoluble solid that appears when two solutions are mixed. It is written with the state <b>(s)</b> in the equation.',
 hint:'It is the cloudy solid that suddenly appears when you mix two clear liquids.'},

{topic:'acids',cat:'K',type:'mc',q:'Which property belongs to <b>bases</b>, not acids?',
 choices:['Taste sour','Feel slippery','Turn blue litmus red','Have a pH below 7'],a:1,
 why:'<b>Bases feel slippery</b> (like soap) and taste bitter, turn red litmus blue, and have pH above 7. The other three options all describe acids.',
 hint:'Think about what soap feels like on your hands.'},

{topic:'ph',cat:'K',type:'mc',q:'A solution has a pH of 3. Which statement is correct?',
 choices:['It is a base and feels slippery','It is acidic and will turn blue litmus red','It is neutral','It has more hydroxide ions than hydrogen ions'],a:1,
 why:'pH 3 is below 7, so it is <b>acidic</b>. Acids turn blue litmus red and contain more H<sup>+</sup> ions than OH<sup>&minus;</sup> ions.',
 hint:'Below 7 = acid. Above 7 = base. Exactly 7 = neutral.'},

{topic:'ph',cat:'T',type:'number',q:'A solution has a pH of 5. Another has a pH of 2. How many times more acidic is the second one?',a:1000,
 why:'The difference is 5 &minus; 2 = <b>3</b> pH units. Each unit is a factor of 10, so 10<sup>3</sup> = <b>1000 times</b> more acidic.',
 hint:'Find the difference in pH, then raise 10 to that power.'},

/* ---------------- COMMUNICATION (self-marked) ---------------- */
{topic:'communication',cat:'C',type:'open',
 q:'Why is it important that the pH of a swimming pool be carefully monitored and maintained? <span class="marks">[C&ndash;1]</span>',
 model:'If the pool water becomes <b>too acidic</b> (low pH) it can irritate or burn swimmers&rsquo; eyes and skin, and it corrodes the metal pipes, ladders and pump equipment. If it becomes <b>too basic</b> (high pH) the water goes cloudy, scale builds up, and the chlorine stops working properly so bacteria can grow. Pool water is kept close to neutral (about pH 7.2&ndash;7.8) to be safe for people and for the equipment.',
 why:'For a 1-mark communication question you need ONE clear reason plus WHY it matters &mdash; name the harm (eyes/skin, or equipment, or chlorine failing).',
 hint:'Think about two things the water touches: people, and the pool equipment.'},

{topic:'communication',cat:'C',type:'open',
 q:'Distinguish between acids and bases. Mention at least <b>2 properties or characteristics</b> of each. <span class="marks">[C&ndash;4]</span>',
 model:'<b>Acids</b><br>&bull; Taste sour (lemon juice, vinegar)<br>&bull; Have a pH <b>less than 7</b><br>&bull; Turn blue litmus paper <b>red</b><br>&bull; React with metals to produce hydrogen gas<br>&bull; Produce H<sup>+</sup> ions in water<br><br><b>Bases</b><br>&bull; Taste bitter<br>&bull; Feel <b>slippery</b> like soap<br>&bull; Have a pH <b>greater than 7</b><br>&bull; Turn red litmus paper <b>blue</b><br>&bull; Produce OH<sup>&minus;</sup> ions in water',
 why:'4 marks = 2 properties for acids AND 2 for bases. Give a pH statement and a litmus statement and you cannot go wrong. Do not write only about acids &mdash; half the marks are for bases.',
 hint:'Two for acids, two for bases. pH and litmus are the safest two to use.'},

{topic:'communication',cat:'C',type:'open',
 q:'Using the Activity Series:<div class="eqbox">Ca (s) + ZnCl<sub>2</sub> (aq) <span class="arrow">&rarr;</span></div><b>A.</b> Will a chemical reaction happen or not between these reactants? How do you know?<br><b>B.</b> If the reaction will happen, predict the products. <span class="marks">[C&ndash;4]</span>',
 model:'<b>A. Yes, a reaction WILL happen.</b> On the Activity Series, <b>calcium is higher up than zinc</b>, which means calcium is <b>more reactive</b>. A more reactive metal can displace a less reactive metal out of its compound, so calcium pushes the zinc out.<br><br><b>B.</b> This is a <b>single displacement</b> reaction:<div class="eqbox">Ca (s) + ZnCl<sub>2</sub> (aq) <span class="arrow">&rarr;</span> CaCl<sub>2</sub> (aq) + Zn (s)</div>The calcium takes the chloride, and the zinc comes out as a solid metal.',
 why:'<b>This is the most-missed question on the whole unit.</b> The classic wrong answer is "no reaction, because Zn is lower on the pH scale than calcium". Two things to fix there: (1) it is the <b>Activity Series</b>, not the pH scale &mdash; they are unrelated, and (2) because Ca IS higher than Zn, the reaction <b>does</b> happen. Higher on the series means the lone metal WINS.',
 hint:'Find Ca and Zn on the Activity Series. Which one is higher? The higher one is more reactive and takes over.'},

{topic:'communication',cat:'C',type:'open',
 q:'Explain, in your own words, what the <b>Law of Conservation of Mass</b> means and why it forces us to balance chemical equations.',
 model:'The Law of Conservation of Mass says that <b>matter cannot be created or destroyed in a chemical reaction</b>. The atoms you start with are the same atoms you end with &mdash; they just get rearranged into new combinations. That means the <b>number of atoms of each element must be identical on both sides</b> of the equation. We add coefficients in front of the formulas to make the counts match, which is what "balancing" is. We are never allowed to change a subscript, because that would change the actual substance.',
 why:'The key marks: atoms are rearranged not created/destroyed, the count of each element must match on both sides, and you change coefficients NOT subscripts.',
 hint:'What happens to the atoms during a reaction? Are any lost?'},

{topic:'communication',cat:'C',type:'open',
 q:'A student says: "I balanced the equation H<sub>2</sub> + O<sub>2</sub> &rarr; H<sub>2</sub>O by changing it to H<sub>2</sub> + O<sub>2</sub> &rarr; H<sub>2</sub>O<sub>2</sub>." Explain what the student did wrong and balance it correctly.',
 model:'The student changed a <b>subscript</b> instead of adding a <b>coefficient</b>. Changing the subscript turned water (H<sub>2</sub>O) into hydrogen peroxide (H<sub>2</sub>O<sub>2</sub>) &mdash; a completely different substance. You may only put numbers <b>in front of</b> formulas.<br><br>Correct answer:<div class="eqbox">2H<sub>2</sub> + O<sub>2</sub> <span class="arrow">&rarr;</span> 2H<sub>2</sub>O</div>Now there are 4 H and 2 O on each side.',
 why:'Golden rule: <b>coefficients go in front, subscripts never change.</b> Changing a subscript changes the chemical itself.',
 hint:'What is the difference between the number in FRONT of a formula and the small number INSIDE it?'},

{topic:'communication',cat:'C',type:'open',
 q:'Describe <b>two safety precautions</b> you should take when working with acids in the chemistry lab, and explain why each one matters. <span class="marks">[C&ndash;2]</span>',
 model:'<b>1. Wear safety goggles and an apron.</b> Acids are corrosive &mdash; a splash in the eye can cause permanent damage, and they can burn skin or destroy clothing.<br><br><b>2. Always add acid TO water, never water to acid.</b> Diluting acid releases a lot of heat. If you pour water onto concentrated acid, the heat can make it boil and spit acid out of the container.<br><br><i>Other acceptable answers:</i> work in a fume hood for fumes; never mouth-pipette; rinse spills with lots of water and tell the teacher; know where the eyewash station is.',
 why:'Each mark needs the precaution AND the reason. "Wear goggles" alone is usually only half a mark &mdash; say what it protects you from.',
 hint:'There is a famous rule about the ORDER you mix acid and water in. Do you remember it?'},

/* ---------------- THINKING / DATA ---------------- */
{topic:'acids',cat:'T',type:'multi',
 q:'The data below were collected during an investigation of acids and bases. Classify each solution.<div class="databox"><table class="dtable"><tr><th>Solution</th><th>Red litmus</th><th>Blue litmus</th></tr><tr><td><b>A</b></td><td>Stays red</td><td>Stays blue</td></tr><tr><td><b>B</b></td><td>Turns blue</td><td>Stays blue</td></tr><tr><td><b>C</b></td><td>Stays red</td><td>Turns red</td></tr></table></div>',
 parts:[
   {label:'Solution A', choices:['Acidic','Basic','Neutral'], a:2},
   {label:'Solution B', choices:['Acidic','Basic','Neutral'], a:1},
   {label:'Solution C', choices:['Acidic','Basic','Neutral'], a:0}
 ],
 why:'<b>A = neutral</b> &mdash; nothing changed colour at all.<br><b>B = basic</b> &mdash; red litmus turned BLUE, and only a base does that.<br><b>C = acidic</b> &mdash; blue litmus turned RED, and only an acid does that.<br><br>Memory trick: <b>B</b>lue to red = acid. <b>R</b>ed to blue = base. No change = neutral.',
 hint:'Look for the paper that CHANGED. If neither changed, it must be neutral.'},

{topic:'counting',cat:'K',type:'multi',
 q:'How many atoms of each element are in <span class="big-formula">2(NH<sub>4</sub>)<sub>3</sub>PO<sub>4</sub></span> ?',
 parts:[
   {label:'Nitrogen (N)', type:'number', a:6},
   {label:'Hydrogen (H)', type:'number', a:24},
   {label:'Phosphorus (P)', type:'number', a:2},
   {label:'Oxygen (O)', type:'number', a:8}
 ],
 why:'Inside <b>one</b> (NH<sub>4</sub>)<sub>3</sub>PO<sub>4</sub>: N = 1&times;3 = 3, H = 4&times;3 = 12, P = 1, O = 4.<br>Then the <b>2</b> out front doubles everything:<br>N = <b>6</b>, H = <b>24</b>, P = <b>2</b>, O = <b>8</b>.',
 hint:'The subscript 3 only applies to what is inside the brackets (NH4). The 2 in front applies to EVERYTHING.'},

{topic:'balancing',cat:'T',type:'mc',
 q:'When balancing an equation, which of these are you allowed to change?',
 choices:['The subscripts inside a formula','The coefficients in front of a formula','Both subscripts and coefficients','Neither'],a:1,
 why:'Only <b>coefficients</b> &mdash; the big numbers in front. Changing a subscript changes the substance itself (H<sub>2</sub>O is water, H<sub>2</sub>O<sub>2</sub> is hydrogen peroxide &mdash; totally different).',
 hint:'One of them changes HOW MANY molecules. The other changes WHAT the molecule is.'},

{topic:'reactions',cat:'K',type:'mc',
 q:'What are the products of the <b>complete combustion</b> of any hydrocarbon?',
 choices:['Carbon dioxide and water','Carbon monoxide and water','Carbon and hydrogen gas','Oxygen and water'],a:0,
 why:'Complete combustion of a hydrocarbon (something made of only C and H) always gives <b>CO<sub>2</sub> + H<sub>2</sub>O</b>. If there is not enough oxygen you get <i>incomplete</i> combustion, which makes poisonous carbon monoxide (CO) and soot instead.',
 hint:'This one is worth memorising &mdash; it shows up on every chemistry test.'},

{topic:'reactions',cat:'C',type:'open',
 q:'Explain the difference between <b>complete</b> and <b>incomplete</b> combustion, and why incomplete combustion is dangerous.',
 model:'<b>Complete combustion</b> happens when there is <b>plenty of oxygen</b>. The fuel burns fully and the only products are carbon dioxide and water:<div class="eqbox">CH<sub>4</sub> + 2O<sub>2</sub> <span class="arrow">&rarr;</span> CO<sub>2</sub> + 2H<sub>2</sub>O</div><b>Incomplete combustion</b> happens when oxygen is <b>limited</b>. The fuel does not burn fully, so you also get <b>carbon monoxide (CO)</b> and carbon (soot).<br><br>It is dangerous because <b>carbon monoxide is a colourless, odourless, poisonous gas</b>. You cannot see or smell it, and it stops your blood from carrying oxygen, which is why homes need CO detectors near furnaces and gas appliances.',
 why:'Marks: the oxygen supply is the difference, name CO as the extra product, and say CO is toxic AND undetectable by the senses.',
 hint:'The difference is how much of ONE reactant is available. And the dangerous product is a gas you cannot detect.'},

{topic:'application',cat:'A',type:'open',
 q:'Acid rain is formed when sulfur dioxide from burning coal reacts with water in the atmosphere. Write the balanced equation, and describe <b>one</b> environmental effect of acid rain.',
 model:'<b>Balanced equation:</b><div class="eqbox">SO<sub>2</sub> (g) + H<sub>2</sub>O (l) <span class="arrow">&rarr;</span> H<sub>2</sub>SO<sub>3</sub> (aq)</div>This is a <b>synthesis</b> reaction producing sulfurous acid. (Sulfur trioxide gives sulfuric acid: SO<sub>3</sub> + H<sub>2</sub>O &rarr; H<sub>2</sub>SO<sub>4</sub>.)<br><br><b>Environmental effect &mdash; any one of:</b><br>&bull; Lowers the pH of lakes and rivers, killing fish and the insects they eat<br>&bull; Damages leaves and strips nutrients out of the soil, harming forests<br>&bull; Corrodes limestone and marble buildings, statues and bridges<br>&bull; Leaches toxic metals like aluminum out of soil into water',
 why:'Application questions want the chemistry AND the real-world consequence. Include states of matter in the equation.',
 hint:'Non-metal oxide + water = an acid. Then think about what happens to a lake when its pH drops.'},

{topic:'reactions',cat:'K',type:'mc',
 q:'Which of these is the correct general form of a <b>double displacement</b> reaction?',
 choices:['A + B &rarr; AB','AB &rarr; A + B','A + BC &rarr; AC + B','AB + CD &rarr; AD + CB'],a:3,raw:true,
 why:'<b>AB + CD &rarr; AD + CB</b>. Two compounds swap partners &mdash; like changing dance partners. Compare: A + BC &rarr; AC + B is SINGLE displacement (only one swap).',
 hint:'"Double" means TWO swaps happen.'},

{topic:'activity',cat:'T',type:'mc',
 q:'Why will copper <b>not</b> react with a solution of zinc sulfate?',
 choices:['Copper is less reactive than zinc on the Activity Series','Copper is more reactive than zinc','Copper is not a metal','Zinc sulfate is not soluble'],a:0,
 why:'On the Activity Series, <b>zinc sits above copper</b>, so zinc is the more reactive metal. A <b>less</b> reactive metal cannot displace a more reactive one, so there is <b>no reaction</b>.',
 hint:'Find both metals on the Activity Series list and see which is higher.'},

{topic:'activity',cat:'K',type:'mc',
 q:'On the Activity Series of Metals, which metal is the <b>most reactive</b>?',
 choices:['Gold','Lithium','Copper','Iron'],a:1,
 why:'<b>Lithium</b> is at the very top of the Activity Series = most reactive. <b>Gold</b> is at the very bottom = least reactive, which is exactly why gold jewellery does not tarnish or corrode.',
 hint:'Think about which metal is used for jewellery because it never corrodes &mdash; that one is the LEAST reactive.'}
];

/* ============================================================
   TOPIC REGISTRY — maps each topic to its generators
   ============================================================ */
const TOPICS = {
  reactions:  { name:'Reaction Types',       coach:'frankie',   icon:'&#9889;',
                blurb:'Synthesis, decomposition, displacement, combustion',
                gens:[genClassify, genClassify, genRxnDesc, genPredict] },
  balancing:  { name:'Balancing Equations',  coach:'ghoulia',   icon:'&#9878;',
                blurb:'Make both sides match',
                gens:[genBalance] },
  naming:     { name:'Naming Compounds',     coach:'cleo',      icon:'&#128220;',
                blurb:'Ionic vs molecular, IUPAC names, formulas',
                gens:[genIonicOrMolecular, genNameIonic, genFormulaIonic, genNameMolecular] },
  counting:   { name:'Counting Atoms',       coach:'draculaura',icon:'&#129504;',
                blurb:'Brackets, subscripts and coefficients',
                gens:[genCountAtoms, genCountAtoms, genCountAtomsMulti] },
  activity:   { name:'Activity Series',      coach:'clawdeen',  icon:'&#128293;',
                blurb:'Which metal wins?',
                gens:[genActivity] },
  acids:      { name:'Acids &amp; Bases',    coach:'lagoona',   icon:'&#129514;',
                blurb:'Properties, litmus, neutralization',
                gens:[genAcidKind, genAcidName, genLitmus] },
  ph:         { name:'The pH Scale',         coach:'lagoona',   icon:'&#128202;',
                blurb:'Logarithmic scale and acidity maths',
                gens:[genPHFactor, genPHDirection] },
  application:{ name:'Word Equations',       coach:'spectra',   icon:'&#9997;',
                blurb:'Words to balanced equations with states',
                gens:[genWordEq] },
  communication:{ name:'Explain It',         coach:'spectra',   icon:'&#128172;',
                blurb:'Written answers you mark yourself',
                gens:[] }
};

const COACHES = {
  frankie:   { name:'Frankie Stein',  colour:'#7CF03D', line:'Let’s get this reaction sparking.' },
  ghoulia:   { name:'Ghoulia Yelps',  colour:'#4DC6FF', line:'Slow is fine. Correct is better.' },
  cleo:      { name:'Cleo de Nile',   colour:'#FFD447', line:'Names matter. Spell them like royalty.' },
  draculaura:{ name:'Draculaura',     colour:'#FF5FA2', line:'Counting is literally my whole thing.' },
  clawdeen:  { name:'Clawdeen Wolf',  colour:'#FF8A3D', line:'Higher on the list always wins the fight.' },
  lagoona:   { name:'Lagoona Blue',   colour:'#2FE0C8', line:'Keep your pH steady, luv.' },
  spectra:   { name:'Spectra Vondergeist', colour:'#C48BFF', line:'Say what you mean. Marks love detail.' }
};

/* ---- pull a question from a topic ---- */
function questionFrom(topic) {
  const t = TOPICS[topic];
  const statics = STATIC_BANK.filter(q => q.topic === topic);
  const gens = t ? t.gens : [];
  const useStatic = statics.length && (!gens.length || Math.random() < 0.35);
  const q = useStatic ? JSON.parse(JSON.stringify(pick(statics))) : pick(gens)();
  q.topic = topic;
  return q;
}
function randomQuestion(pool) {
  const keys = pool && pool.length ? pool : Object.keys(TOPICS).filter(k => TOPICS[k].gens.length || STATIC_BANK.some(q => q.topic === k));
  return questionFrom(pick(keys));
}
