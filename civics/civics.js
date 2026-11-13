/* ============================================================
   MONSTER CIVICS — core helpers + fact tables
   Everything here comes from the CHV2O Unit 2 review sheets
   (Part 1: Government & the three branches, Part 2: Legal system & elections).
   ============================================================ */

const rnd = n => Math.floor(Math.random() * n);
const pick = arr => arr[rnd(arr.length)];
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function sample(arr, n) { return shuffle(arr).slice(0, n); }

/* Build a multiple-choice question with the correct answer at a random position. */
function mcq(o) {
  const choices = shuffle([o.right].concat(o.wrong));
  return Object.assign({ type: 'mc' }, o, { choices, a: choices.indexOf(o.right) });
}

/* ---------- answer normalisation for typed answers ---------- */
function norm(s) {
  return String(s).toLowerCase().trim()
    .replace(/[’'`]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^the /, '')
    .trim();
}
function answerMatches(given, accepted) {
  const g = norm(given);
  if (!g) return false;
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
   1. LEVELS OF GOVERNMENT
   ============================================================ */
const LEVELS = {
  Federal: { short: 'Country', jobs: [
    'national defence and the military', 'immigration', 'Canadian citizenship', 'printing money (currency)',
    'the postal service (Canada Post)', 'criminal law (the Criminal Code)', 'relations with other countries (foreign affairs)',
    'employment insurance', 'passports', 'banking rules', 'fisheries and oceans', 'trade with other countries' ] },
  Provincial: { short: 'Province', jobs: [
    'education (schools in Ontario)', 'health care and hospitals', "driver's licences", 'provincial highways like the 401',
    'colleges and universities', 'natural resources like forests and mines', 'minimum wage', 'licence plates and car registration' ] },
  Municipal: { short: 'City', jobs: [
    'garbage collection', 'local roads and streets', 'recycling and green bins', 'public libraries',
    'local parks and playgrounds', 'snow removal on city streets', 'public transit like the TTC', 'the fire department',
    'water and sewers', 'community centres and arenas', 'dog and cat licences', 'zoning (what can be built where)' ] }
};

/* ============================================================
   2. WHO'S WHO
   ============================================================ */
const PEOPLE = [
  { pos: 'Sovereign (Head of State)', who: 'King Charles III', alt: ['charles', 'king charles', 'charles iii', 'charles 3', 'king charles 3', 'king charles the third'],
    role: 'Canada\'s Head of State. Canada is a constitutional monarchy, so the King is the formal head of the country.' },
  { pos: 'Governor General', who: 'Mary Simon', alt: ['simon'],
    role: 'Represents the King in Canada. Performs ceremonial and constitutional duties, like giving Royal Assent to bills.' },
  { pos: 'Prime Minister', who: 'Mark Carney', alt: ['carney'],
    role: 'Leads the federal government and the Cabinet. Makes decisions that affect all of Canada.' },
  { pos: 'Chief Justice of Canada', who: 'Richard Wagner', alt: ['wagner'],
    role: 'Leads the Supreme Court of Canada and helps interpret Canada\'s laws and Constitution.' },
  { pos: 'Premier of Ontario', who: 'Doug Ford', alt: ['ford'],
    role: 'Leads the provincial government of Ontario. Makes decisions that affect the province.' },
  { pos: 'Lieutenant Governor of Ontario', who: 'Edith Dumont', alt: ['dumont'],
    role: 'Represents the King in Ontario — the provincial version of the Governor General.' },
  { pos: 'Mayor of Toronto', who: 'Olivia Chow', alt: ['chow'],
    role: 'Leads Toronto\'s city (municipal) government.' }
];

/* Role descriptions → title (no names, just jobs) */
const ROLES = [
  ['Leads the federal government and chooses the Cabinet', 'Prime Minister'],
  ['Leads a provincial government', 'Premier'],
  ['Represents the King in Canada and gives Royal Assent', 'Governor General'],
  ['Represents the King in a province', 'Lieutenant Governor'],
  ['Leads the Supreme Court of Canada', 'Chief Justice'],
  ['Leads a city government', 'Mayor'],
  ['Elected by voters to represent one riding in the House of Commons', 'Member of Parliament (MP)'],
  ['Appointed (not elected) to review bills in the upper house', 'Senator'],
  ['Chosen by the Prime Minister to run one government department, like finance or defence', 'Cabinet minister'],
  ['Canada\'s Head of State', 'The Sovereign (the King)']
];

/* ============================================================
   3. THE THREE BRANCHES — tasks to classify
   ============================================================ */
const BRANCH_TASKS = {
  Legislative: [
    'Introduces and debates proposed laws', 'Parliament debates a proposed law', 'Creates and passes new laws',
    'MPs vote on a bill in the House of Commons', 'The Senate reviews a bill sent from the House of Commons',
    'A committee of MPs studies a bill line by line', 'Elected representatives debate and vote on laws' ],
  Executive: [
    'Carries out government policies', 'Cabinet ministers administer government departments', 'Enforces and administers laws',
    'The Prime Minister and Cabinet make government decisions', 'A government department launches a new program',
    'The PCO gives non-partisan advice to Cabinet', 'Puts a new law into action once it has passed' ],
  Judicial: [
    'Interprets laws', 'Makes decisions about legal cases', 'The Supreme Court hears an appeal',
    'A judge sentences someone who was found guilty', 'A court decides whether a law breaks the Charter of Rights',
    'Resolves a legal dispute between two neighbours', 'A judge listens to both sides and examines evidence' ]
};
const BRANCH_MEMBERS = [
  ['The Prime Minister', 'Executive'], ['The Cabinet', 'Executive'], ['Government departments', 'Executive'],
  ['The Privy Council Office (PCO)', 'Executive'], ['The Prime Minister\'s Office (PMO)', 'Executive'],
  ['The House of Commons', 'Legislative'], ['The Senate', 'Legislative'], ['Members of Parliament (MPs)', 'Legislative'],
  ['Senators', 'Legislative'], ['The Supreme Court of Canada', 'Judicial'], ['The Chief Justice', 'Judicial'],
  ['Judges', 'Judicial'], ['The Federal Courts', 'Judicial']
];
const BRANCH_JOB = { Legislative: 'makes laws', Executive: 'carries out laws', Judicial: 'interprets laws' };

/* ============================================================
   GLOSSARY — term / definition pairs, grouped so distractors
   come from the same family (harder, fairer).
   ============================================================ */
const GLOSSARY = [
  /* executive */
  { t: 'Cabinet', d: 'A group of ministers chosen by the Prime Minister, each responsible for a government department', g: 'exec', topic: 'executive' },
  { t: 'PMO (Prime Minister\'s Office)', d: 'Gives political advice and support to the Prime Minister', g: 'exec', topic: 'executive' },
  { t: 'PCO (Privy Council Office)', d: 'Gives professional, non-partisan advice and support to the Prime Minister and Cabinet', g: 'exec', topic: 'executive' },
  { t: 'Governor General', d: 'Represents the King in Canada and grants Royal Assent', g: 'exec', topic: 'executive' },
  { t: 'Prime Minister', d: 'Leads the federal government and the Cabinet', g: 'exec', topic: 'executive' },
  { t: 'Head of State', d: 'The formal, highest representative of the country — in Canada, the King', g: 'exec', topic: 'executive' },
  { t: 'Non-partisan', d: 'Not taking the side of any political party', g: 'exec', topic: 'executive' },
  /* legislative */
  { t: 'Parliament', d: 'The Sovereign, the Senate and the House of Commons together', g: 'leg', topic: 'parliament' },
  { t: 'House of Commons', d: 'Elected MPs who debate and vote on proposed laws', g: 'leg', topic: 'parliament' },
  { t: 'Senate', d: 'Appointed members who review and study proposed laws', g: 'leg', topic: 'parliament' },
  { t: 'Bill', d: 'A proposed law that Parliament must debate and approve', g: 'leg', topic: 'parliament' },
  { t: 'Royal Assent', d: 'The formal approval of a bill by the King or Governor General — the final step before it becomes law', g: 'leg', topic: 'parliament' },
  { t: 'Constituency (riding)', d: 'An electoral district that one MP represents', g: 'leg', topic: 'parliament' },
  { t: 'Checks and balances', d: 'Each branch limits the others so no single branch gets too much power', g: 'leg', topic: 'branches' },
  /* courts */
  { t: 'Supreme Court of Canada', d: 'The highest court in Canada', g: 'court', topic: 'judicial' },
  { t: 'Appeal', d: 'Asking a higher court to review a lower court\'s decision for a legal error', g: 'court', topic: 'judicial' },
  { t: 'Federal Courts', d: 'Courts that handle immigration, maritime law, copyright and disputes with the federal government', g: 'court', topic: 'judicial' },
  { t: 'Judge', d: 'Listens to both sides, examines evidence, and makes a fair decision based on the law', g: 'court', topic: 'judicial' },
  { t: 'Chief Justice', d: 'Leads the Supreme Court of Canada', g: 'court', topic: 'judicial' },
  /* criminal */
  { t: 'Criminal law', d: 'Law about offences against society, like theft and assault', g: 'crim', topic: 'criminal' },
  { t: 'The Crown', d: 'Represents the state and presents the case against the accused', g: 'crim', topic: 'criminal' },
  { t: 'The accused', d: 'The person charged with committing a criminal offence', g: 'crim', topic: 'criminal' },
  { t: 'Actus reus', d: 'The guilty act — the prohibited action', g: 'crim', topic: 'criminal' },
  { t: 'Mens rea', d: 'The guilty mind — the intention or knowledge behind the act', g: 'crim', topic: 'criminal' },
  { t: 'Beyond a reasonable doubt', d: 'The standard of proof in a criminal case — so certain that no reasonable doubt remains', g: 'crim', topic: 'criminal' },
  { t: 'Presumption of innocence', d: 'A person is considered innocent until proven guilty in court', g: 'crim', topic: 'criminal' },
  { t: 'Police investigation', d: 'Gathering evidence to find out what happened and identify suspects', g: 'crim', topic: 'criminal' },
  /* justice approaches + youth */
  { t: 'Youth Criminal Justice Act (YCJA)', d: 'The law for how young people aged 12–17 accused of crimes are treated', g: 'just', topic: 'youth' },
  { t: 'Sentencing', d: 'Deciding the legal consequences after someone is found guilty', g: 'just', topic: 'youth' },
  { t: 'Deterrence', d: 'Discouraging crime by showing there are consequences for breaking the law', g: 'just', topic: 'youth' },
  { t: 'Rehabilitation', d: 'Helping offenders change their behaviour through education, counselling and support', g: 'just', topic: 'youth' },
  { t: 'Restorative justice', d: 'Repairing the harm caused by an offence and having the offender take responsibility', g: 'just', topic: 'youth' },
  { t: 'Reintegration', d: 'Helping a young offender return to their community and school', g: 'just', topic: 'youth' },
  { t: 'Punishment', d: 'Focuses on giving consequences for wrongdoing', g: 'just', topic: 'youth' },
  /* civil */
  { t: 'Plaintiff', d: 'The person or organization bringing a legal claim', g: 'civ', topic: 'civil' },
  { t: 'Defendant', d: 'The person or organization responding to a legal claim', g: 'civ', topic: 'civil' },
  { t: 'Precedent', d: 'An earlier court decision that guides judges in similar future cases', g: 'civ', topic: 'civil' },
  { t: 'Negligence', d: 'Failing to take reasonable care, which causes harm to someone else', g: 'civ', topic: 'civil' },
  { t: 'Trespass', d: 'Unlawfully entering or interfering with someone else\'s property', g: 'civ', topic: 'civil' },
  { t: 'Damages', d: 'Money a court orders one side to pay the other as compensation', g: 'civ', topic: 'civil' },
  { t: 'Balance of probabilities', d: 'The civil standard of proof — more likely than not', g: 'civ', topic: 'civil' },
  { t: 'Remedy', d: 'What a court gives to fix a wrong, like money or an order to stop', g: 'civ', topic: 'civil' },
  /* elections */
  { t: 'Secret ballot', d: 'Voting privately without revealing who you voted for', g: 'elec', topic: 'elections' },
  { t: 'Voter apathy', d: 'A lack of interest or motivation to vote', g: 'elec', topic: 'elections' },
  { t: 'Agnes Macphail', d: 'The first woman elected to Canada\'s House of Commons (1921)', g: 'elec', topic: 'elections' },
  { t: 'Charter of Rights and Freedoms', d: 'Protects democratic rights, like the right of citizens to vote and run in elections', g: 'elec', topic: 'elections' },
  { t: 'Electoral system', d: 'The method used to turn votes into seats', g: 'sys', topic: 'electoral' },
  { t: 'First-Past-the-Post (FPTP)', d: 'The candidate with the most votes in a riding wins — even under 50%', g: 'sys', topic: 'electoral' },
  { t: 'Runoff voting', d: 'If no one gets a majority, another round of voting is held', g: 'sys', topic: 'electoral' },
  { t: 'Proportional Representation (PR)', d: 'Parties get seats that match their share of the total vote', g: 'sys', topic: 'electoral' },
  { t: 'Mixed Member Proportional (MMP)', d: 'Combines local representation with proportional representation', g: 'sys', topic: 'electoral' },
  { t: 'Electoral reform', d: 'Changing the way votes are turned into seats', g: 'sys', topic: 'electoral' }
];

/* ============================================================
   TRUE / FALSE — each false one is a classic trap
   ============================================================ */
const TF = [
  ['Senators are elected by Canadian voters.', false, 'Senators are <b>appointed</b> by the Governor General on the advice of the Prime Minister. MPs are the elected ones.', 'parliament'],
  ['MPs are elected by Canadian voters.', true, 'Yes &mdash; each MP is elected in a federal election to represent one riding (constituency).', 'parliament'],
  ['Parliament is made up of the Sovereign, the Senate and the House of Commons.', true, 'Those are the three parts of Parliament. Remember: <b>King + Senate + Commons</b>.', 'parliament'],
  ['Parliament is made up of the Prime Minister, the Senate and the Supreme Court.', false, 'Parliament = <b>Sovereign + Senate + House of Commons</b>. The PM belongs to the executive and the Supreme Court to the judicial branch.', 'parliament'],
  ['Royal Assent is the first step in making a law.', false, 'Royal Assent is the <b>last</b> step &mdash; the formal approval after both the House and the Senate pass the bill.', 'parliament'],
  ['A bill is a law that has already been passed.', false, 'A bill is a <b>proposed</b> law. It only becomes a law after it passes both chambers and gets Royal Assent.', 'parliament'],
  ['The Legislative branch makes laws.', true, '<b>L</b>egislative = <b>L</b>aws are made.', 'branches'],
  ['The Executive branch interprets laws.', false, 'The Executive <b>carries out</b> laws. The <b>Judicial</b> branch interprets them.', 'branches'],
  ['The Judicial branch interprets laws.', true, '<b>J</b>udicial = <b>J</b>udges, and judges interpret the law.', 'branches'],
  ['Dividing power into three branches stops any one branch from getting too much power.', true, 'That is the whole point &mdash; <b>checks and balances</b> keep government fair and accountable.', 'branches'],
  ['Education in Ontario is the responsibility of the federal government.', false, 'Education is <b>provincial</b>. Each province runs its own schools.', 'levels'],
  ['Garbage collection is a municipal responsibility.', true, 'Yes &mdash; the <b>city</b> (municipal government) collects garbage and runs local roads.', 'levels'],
  ['National defence is a provincial responsibility.', false, 'Defence protects the whole country, so it is <b>federal</b>.', 'levels'],
  ['The Governor General represents the King in Canada.', true, 'Correct &mdash; the King lives in the UK, so the Governor General acts for him here.', 'executive'],
  ['The Prime Minister is Canada\'s Head of State.', false, 'The Head of State is <b>King Charles III</b>. The Prime Minister is the head of <b>government</b>.', 'whoswho'],
  ['A Premier leads a provincial government.', true, 'Premier = province. Prime Minister = whole country.', 'whoswho'],
  ['The PMO gives non-partisan advice to the Prime Minister.', false, 'Flip it: the <b>PMO</b> is <b>political</b>. The <b>PCO</b> is the <b>non-partisan</b>, professional one.', 'executive'],
  ['The PCO gives professional, non-partisan support to the Prime Minister and Cabinet.', true, 'Yes. PCO = professional public servants who do not pick a party side.', 'executive'],
  ['Cabinet ministers are chosen by the Prime Minister.', true, 'The PM picks the ministers, and each one runs a department like finance or defence.', 'executive'],
  ['The Supreme Court of Canada is the highest court in Canada.', true, 'Yes &mdash; it is the final court of appeal.', 'judicial'],
  ['An appeal asks a higher court to review a lower court\'s decision.', true, 'Exactly &mdash; it checks whether a legal error was made.', 'judicial'],
  ['Federal Courts handle cases like immigration and copyright.', true, 'Federal Courts deal with federal law: immigration, maritime law, copyright, and disputes with the federal government.', 'judicial'],
  ['Actus reus means the guilty mind.', false, 'Swap them: <b>actus reus = guilty ACT</b>, <b>mens rea = guilty MIND</b>.', 'criminal'],
  ['Mens rea means the guilty mind.', true, 'Mens &asymp; "mental" &rarr; the mind.', 'criminal'],
  ['In a criminal case, the Crown must prove guilt beyond a reasonable doubt.', true, 'That is the highest standard of proof in the system.', 'criminal'],
  ['In a criminal case, the accused must prove they are innocent.', false, 'No &mdash; the <b>presumption of innocence</b> means the <b>Crown</b> must prove guilt. The accused does not have to prove anything.', 'criminal'],
  ['The Crown represents the state in a criminal case.', true, 'The Crown is the prosecutor &mdash; it brings the case against the accused on behalf of society.', 'criminal'],
  ['The YCJA applies to young people aged 12 to 17.', true, '12 to 17. Under 12 cannot be charged; 18 and up is the adult system.', 'youth'],
  ['The YCJA applies to anyone under 21.', false, 'It is <b>12 to 17</b>. At 18 you are in the adult system.', 'youth'],
  ['Restorative justice focuses on repairing harm.', true, 'Yes &mdash; repair the harm, take responsibility, rebuild relationships.', 'youth'],
  ['Rehabilitation focuses on scaring other people out of committing crimes.', false, 'That is <b>deterrence</b>. Rehabilitation helps the offender <b>change their behaviour</b>.', 'youth'],
  ['The plaintiff is the person bringing the claim.', true, 'Plaintiff &asymp; com<b>plaint</b> &mdash; they are the one complaining.', 'civil'],
  ['The defendant is the person bringing the claim.', false, 'The defendant <b>defends</b> &mdash; they respond to the claim. The plaintiff brings it.', 'civil'],
  ['The standard of proof in a civil case is "beyond a reasonable doubt".', false, 'Civil cases use the <b>balance of probabilities</b> (more likely than not). Beyond a reasonable doubt is for criminal cases.', 'civil'],
  ['A precedent is an earlier court decision that guides judges in similar cases.', true, 'Yes &mdash; that is how common law grows over time.', 'civil'],
  ['You must be at least 18 on election day to vote in a federal election.', true, 'Canadian citizen + 18 on election day.', 'elections'],
  ['Permanent residents can vote in federal elections.', false, 'You must be a <b>Canadian citizen</b>.', 'elections'],
  ['The federal voting age changed from 21 to 18 in 1970.', true, '1970 &mdash; memorise this date.', 'elections'],
  ['Agnes Macphail was the first woman elected to the House of Commons, in 1921.', true, 'Correct &mdash; 1921.', 'elections'],
  ['A secret ballot means you must tell officials who you voted for.', false, 'The opposite &mdash; a secret ballot lets you vote <b>privately</b>.', 'elections'],
  ['Under First-Past-the-Post, a candidate needs more than 50% of the votes to win.', false, 'No! Under FPTP you just need <b>more votes than anyone else</b>. 38% can win.', 'electoral'],
  ['Proportional Representation tries to make seats match each party\'s share of the vote.', true, 'That is exactly its goal.', 'electoral'],
  ['MMP combines local representation and proportional representation.', true, 'Mixed Member Proportional = local MPs + proportional top-up seats.', 'electoral'],
  ['Runoff voting holds another round if no candidate gets a majority.', true, 'Yes &mdash; it keeps going until someone has a majority.', 'electoral']
];
