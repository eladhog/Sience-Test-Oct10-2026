/* ============================================================
   MONSTER CIVICS — hand-written questions
   MC questions straight from both review practice tests, plus the
   written (self-marked) questions with model answers.
   ============================================================ */

const M = (topic, q, right, wrong, why, hint) => Object.assign(mcq({ cat: 'K', q, right, wrong, why, hint }), { topic, fixed: true });

const STATIC_BANK = [
/* ---------- from the Part 1 practice test ---------- */
M('levels', 'Which level of government is responsible for <b>education in Ontario</b>?', 'Provincial', ['Federal', 'Municipal'],
  'Education is <b>provincial</b>. Ontario runs its own school system, which is why other provinces have different curriculums.', 'Each province has its own schools.'),
M('whoswho', 'Who is Canada\'s <b>Head of State</b>?', 'King Charles III', ['Prime Minister', 'Governor General'],
  'Canada is a constitutional monarchy, so the <b>King</b> is Head of State. The Governor General <i>represents</i> him; the PM is the head of <i>government</i>.', 'The Governor General represents this person.'),
M('branches', 'Which branch <b>makes</b> laws?', 'Legislative', ['Executive', 'Judicial'], '<b>L</b>egislative = <b>L</b>aws made.', 'L for Laws.'),
M('branches', 'Which branch <b>interprets</b> laws?', 'Judicial', ['Executive', 'Legislative'], '<b>J</b>udicial = <b>J</b>udges. Judges interpret the law.', 'Who works in courts?'),
M('executive', 'Who leads Canada\'s <b>federal government</b>?', 'Prime Minister', ['Premier', 'Governor General'],
  'The <b>Prime Minister</b> leads the federal government. A Premier leads a province. The Governor General represents the King.', 'Federal = the whole country.'),
M('parliament', 'How are <b>Senators</b> selected?', 'Appointed on the Prime Minister\'s advice', ['Elected by voters', 'Chosen by the courts'],
  'Senators are <b>appointed</b> by the Governor General on the advice of the Prime Minister. MPs are the ones who are elected.', 'They are NOT elected.'),
M('parliament', 'What is a <b>bill</b>?', 'A proposed law', ['A court decision', 'A government election'],
  'A bill is a <b>proposed</b> law. It must be debated and approved by Parliament and get Royal Assent before it becomes law.', 'It is not a law yet.'),
M('parliament', 'What is <b>Royal Assent</b>?', 'Formal approval of a bill', ['A federal election', 'A court hearing'],
  'Royal Assent is the formal approval by the King or Governor General &mdash; the <b>final step</b> before a bill becomes law.', 'Royal = the King\'s side. Assent = agreeing.'),
M('executive', 'What does the <b>PMO</b> do?', 'Provides political support to the Prime Minister', ['Runs the Supreme Court', 'Appoints all MPs'],
  'PMO = Prime Minister\'s Office = <b>political</b> advice and support. (The PCO gives <b>non-partisan</b> support.)', 'It is the PM\'s own team.'),
M('branches', 'What is the main purpose of having <b>three branches</b>?', 'To prevent one branch from having too much power', ['To make elections longer', 'To give all power to the Prime Minister'],
  'Dividing power creates <b>checks and balances</b>, which keeps government fair and accountable.', 'Think "checks and balances".'),

/* ---------- from the Part 2 final practice test ---------- */
M('executive', 'Who <b>represents the Sovereign</b> in Canada?', 'Governor General', ['Prime Minister', 'Chief Justice', 'Premier'],
  'The <b>Governor General</b> represents the King in Canada. (In Ontario, the Lieutenant Governor represents him at the provincial level.)', 'This person gives Royal Assent.'),
M('parliament', 'Which two bodies make up Parliament along with the Sovereign?', 'House of Commons and Senate', ['Cabinet and Supreme Court', 'Premier and Mayor', 'PMO and PCO'],
  'Parliament = <b>Sovereign + Senate + House of Commons</b>.', 'One is elected, one is appointed.'),
M('executive', 'What is the main responsibility of the <b>Executive Branch</b>?', 'Carrying out laws', ['Making laws', 'Interpreting laws', 'Running elections'],
  'The Executive <b>carries out</b> (executes) laws and policies.', 'Executive &asymp; execute = do.'),
M('criminal', 'What is <b>Actus Reus</b>?', 'The guilty act', ['The guilty mind', 'The judge\'s decision', 'The standard of proof'],
  'Actus reus = the <b>guilty act</b> (the prohibited action). Actus &asymp; ACTion.', 'Actus sounds like "action".'),
M('criminal', 'What is <b>Mens Rea</b>?', 'The guilty mind', ['The guilty act', 'A court appeal', 'The Crown\'s evidence'],
  'Mens rea = the <b>guilty mind</b> (intention or knowledge). Mens &asymp; MENtal.<br><span class="dimline">The review sheet spells it "Men\'s Rea" &mdash; the correct Latin is "mens rea". Either way: MIND.</span>', 'Mens sounds like "mental".'),
M('criminal', 'What is the standard of proof for a <b>criminal conviction</b>?', 'Beyond a reasonable doubt', ['Balance of probabilities', 'More likely than not', 'The accused must prove innocence'],
  'Criminal = <b>beyond a reasonable doubt</b>. Civil = balance of probabilities.', 'It is the highest standard.'),
M('youth', 'What is the main focus of <b>restorative justice</b>?', 'Repairing harm caused by an offence', ['Longer prison sentences', 'Scaring others away from crime', 'Fining the offender'],
  'Restore = fix. Restorative justice focuses on <b>repairing the harm</b> and having the offender take responsibility.', 'Restore = fix.'),
M('youth', 'Which law applies to young people aged <b>12&ndash;17</b>?', 'Youth Criminal Justice Act', ['Criminal Code only', 'Charter of Rights and Freedoms', 'Canada Elections Act'],
  'The <b>YCJA</b> sets up a separate youth justice system for ages 12&ndash;17.', 'Y for Youth.'),
M('civil', 'Who is the <b>plaintiff</b>?', 'The person bringing the claim', ['The person responding to the claim', 'The judge', 'The Crown'],
  'Plaintiff &asymp; com<b>plaint</b>: the one bringing the claim. The <b>defendant</b> defends.', 'Who is complaining?'),
M('electoral', 'Who wins under <b>First-Past-the-Post</b>?', 'The candidate with the most votes', ['The candidate with over 50%', 'The party with the most money', 'Whoever wins a second round'],
  'FPTP is like a race: the candidate with the <b>most votes</b> wins, even under 50%.', 'You do NOT need a majority.'),

/* ---------- concept extras ---------- */
M('judicial', 'What is the <b>highest court</b> in Canada?', 'The Supreme Court of Canada', ['The Federal Court', 'The Ontario Court of Justice', 'The Senate'],
  'The <b>Supreme Court of Canada</b> is the final court of appeal. It is led by the Chief Justice.', 'Supreme = highest.'),
M('judicial', 'What is the purpose of an <b>appeal</b>?', 'A higher court reviews a lower court\'s decision for a legal error', ['The jury votes again', 'The police re-investigate the crime', 'Parliament changes the law'],
  'An appeal lets a <b>higher court</b> check whether a <b>legal error</b> was made in a lower court\'s decision.', 'Think "going up a level".'),
M('executive', 'What is the main difference between the <b>PMO</b> and the <b>PCO</b>?', 'The PMO is political; the PCO is non-partisan', ['The PMO is non-partisan; the PCO is political', 'The PMO runs courts; the PCO runs elections', 'There is no difference'],
  '<b>PMO</b> = the PM\'s <b>political</b> team. <b>PCO</b> = <b>professional, non-partisan</b> public servants supporting the PM and Cabinet.<br>This is one of the teacher\'s "biggest test tip" items.', 'The "O" in PMO is the PM\'s Own office.'),
M('criminal', 'What does the <b>presumption of innocence</b> mean?', 'A person is innocent until proven guilty', ['A person is guilty until proven innocent', 'Only the judge can decide if police may investigate', 'Youth cannot be charged'],
  'Everyone is considered <b>innocent until proven guilty</b> in court. That is why the Crown must do the proving.', 'Who has to prove things?'),
M('criminal', 'What is the role of the <b>Crown</b>?', 'It represents the state and presents the case against the accused', ['It defends the accused', 'It decides the sentence', 'It gives Royal Assent'],
  'In a criminal case, the <b>Crown</b> is the prosecutor, acting for society.', 'Crown = the state\'s side.'),
M('criminal', 'Why is the <b>right to a lawyer</b> important?', 'It helps the accused understand their rights and get a fair trial', ['It makes trials shorter', 'It means the accused does not need to go to court', 'It lets the accused choose the judge'],
  'A lawyer helps the accused <b>understand their rights</b>, get <b>legal advice</b>, and receive a <b>fair trial</b>.', 'Think fairness.'),
M('youth', 'Why does Canada have a <b>separate youth justice system</b>?', 'Young people are still developing and have different maturity than adults', ['Youth crimes are never serious', 'Adult courts are too busy', 'Youth cannot be held responsible at all'],
  'Young people have <b>different levels of maturity and responsibility</b>, so the system focuses on their development: rehabilitation, reintegration, and meaningful consequences.', 'Think about maturity.'),
M('youth', 'Why is <b>reintegration</b> important for young offenders?', 'It helps them return to their community and school and become responsible members of society', ['It keeps them away from their community', 'It makes sentences longer', 'It replaces the trial'],
  'Reintegration = helping young offenders <b>return to their communities</b>, continue their education, and become responsible members of society.', 'Re-integrate = fit back in.'),
M('civil', 'What is a <b>precedent</b>?', 'An earlier court decision that guides judges in similar cases', ['A brand-new law passed by Parliament', 'The first step of a trial', 'A type of electoral system'],
  'Precedent = an earlier decision. Judges follow past decisions on similar cases &mdash; this is the heart of <b>common law</b>.', 'PRE = before.'),
M('civil', 'Which of these is a <b>remedy</b> a civil court may give?', 'Ordering the defendant to pay damages', ['Sending the defendant to jail', 'Taking away the defendant\'s vote', 'Royal Assent'],
  'Civil remedies: <b>money (damages)</b>, or an <b>order</b> requiring someone to stop doing something or take an action. Jail is for criminal cases.', 'Civil cases deal in money and orders.'),
M('elections', 'What protects the democratic right of eligible citizens to vote and run in elections?', 'The Canadian Charter of Rights and Freedoms', ['The Youth Criminal Justice Act', 'The PMO', 'Precedent'],
  'The <b>Charter</b> protects democratic rights, including the right of citizens to vote and to run in federal and provincial elections.', 'It protects rights and freedoms.'),
M('elections', 'Which is a common reason for <b>voter apathy</b>?', 'Believing your vote will not make a difference', ['Having a secret ballot', 'Being 18 years old', 'Living in a riding'],
  'Reasons people do not vote: believing their vote won\'t matter, lack of interest in politics, not knowing enough about candidates or issues.', 'Apathy = not caring.'),
M('elections', 'Which is a good way to <b>encourage voter participation</b>?', 'Better education about elections and government', ['Making voting age 25', 'Removing the secret ballot', 'Fewer polling stations'],
  'Ways to boost turnout: <b>education</b> about elections and government, making voting information and registration <b>more accessible</b>, encouraging informed discussion.', 'What would make YOU more likely to vote?'),
M('electoral', 'Under FPTP, does a candidate need <b>more than 50%</b> of the votes to win?', 'No &mdash; they just need more votes than anyone else', ['Yes, always', 'Only in the Senate', 'Only in Ontario'],
  'No! A candidate only needs <b>more votes than any other candidate</b>. That is the single most-tested FPTP fact.', 'Think of a race with 4 runners.'),
M('electoral', 'What is the main goal of <b>Proportional Representation</b>?', 'Seats reflect each party\'s percentage of the vote', ['The most votes in each riding wins', 'Only two parties can run', 'Elections happen twice'],
  'PR aims for seats that <b>match the vote share</b>: 40% of votes &asymp; 40% of seats.', 'Proportional = in proportion.'),
M('electoral', 'Which two types of representation are combined in <b>MMP</b>?', 'Local representation and proportional representation', ['Federal and municipal', 'Elected and appointed', 'Criminal and civil'],
  'Mixed Member Proportional = <b>local MPs</b> + <b>proportional</b> seats.', 'Mixed = two things.'),

/* ============================================================
   WRITTEN ANSWERS — self-marked against a model answer
   part:'B' short answer, part:'C' application/critical thinking
   ============================================================ */
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 3,
  q: 'Identify the <b>three branches</b> of Canadian government and explain the main responsibility of each.',
  model: '&bull; <b>Legislative</b>: makes and passes laws. It is Parliament &mdash; the Sovereign, the House of Commons and the Senate.<br>&bull; <b>Executive</b>: carries out and enforces laws. It includes the Prime Minister, Cabinet and government departments.<br>&bull; <b>Judicial</b>: interprets laws, resolves legal disputes and makes sure justice is fair.',
  why: '<b>Checklist:</b> 3 names &check; 3 jobs &check; one example of who is in each &check;' },
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 2,
  q: 'Explain the difference between the <b>House of Commons</b> and the <b>Senate</b>.',
  model: 'The <b>House of Commons</b> is made up of <b>elected</b> Members of Parliament (MPs) who represent Canadians in their electoral districts. They debate and vote on proposed laws.<br>The <b>Senate</b> is made up of <b>appointed</b> Senators who review and study proposed laws, represent regional interests, and give legislation a second look.',
  why: '<b>Key words to include:</b> elected vs appointed &middot; MPs vs Senators &middot; debate/vote vs review.' },
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 4,
  q: 'Describe the basic process through which a <b>bill becomes law</b> in Canada.',
  model: '1. A bill is introduced in the House of Commons or the Senate.<br>2. It goes through readings and debate.<br>3. A committee studies and examines it.<br>4. It is voted on.<br>5. It goes through the same process in the other chamber &mdash; both must approve the same version.<br>6. It receives <b>Royal Assent</b> from the Governor General.<br>7. It becomes law.',
  why: 'Memory chain: <b>Intro &rarr; Debate &rarr; Committee &rarr; Vote &rarr; Other chamber &rarr; Royal Assent &rarr; Law.</b> The teacher flagged this one as especially important.' },
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 3,
  q: 'Explain the difference between <b>Actus Reus</b> and <b>Mens Rea</b>. Give an example of each.',
  model: '<b>Actus reus</b> is the guilty act. <b>Mens rea</b> is the guilty mind (the intention or knowledge).<br>Example &mdash; someone intentionally steals a bicycle:<br>&bull; Actus reus: taking the bicycle without permission.<br>&bull; Mens rea: intending to take a bicycle that belongs to someone else.',
  why: '<b>Checklist:</b> both definitions &check; an example with BOTH parts labelled &check;' },
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 3,
  q: 'Identify <b>three rights of an accused person</b> protected by the Canadian Charter of Rights and Freedoms.',
  model: '&bull; The right to be <b>presumed innocent</b> until proven guilty.<br>&bull; The right to <b>retain and instruct a lawyer</b>.<br>&bull; The right to be <b>informed promptly of the reasons</b> for arrest or detention.',
  why: 'Short version to remember: <b>innocent &middot; lawyer &middot; told why.</b>' },
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 2,
  q: 'Explain <b>two differences</b> between criminal law and common law / private (civil) disputes.',
  model: '1. Criminal law deals with <b>offences against society</b>; civil disputes are disagreements <b>between individuals or organizations</b>.<br>2. In criminal cases the <b>Crown</b> prosecutes the <b>accused</b> and guilt must be proven <b>beyond a reasonable doubt</b>. In civil cases a <b>plaintiff</b> sues a <b>defendant</b>, and the standard is the <b>balance of probabilities</b>.',
  why: 'The teacher listed criminal vs civil as a key test concept. Use the vocabulary: Crown, accused, plaintiff, defendant.' },
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 3,
  q: 'Describe the <b>three approaches to justice</b>.',
  model: '&bull; <b>Punishment and deterrence</b>: gives consequences for wrongdoing and discourages future offences.<br>&bull; <b>Rehabilitation</b>: helps offenders change their behaviour through education, counselling and support.<br>&bull; <b>Restorative justice</b>: focuses on repairing harm and having offenders take responsibility for their actions.',
  why: 'One line each: <b>discourage &middot; change &middot; repair.</b>' },
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 2,
  q: 'What is the purpose of the <b>Youth Criminal Justice Act</b>?',
  model: 'The YCJA creates a <b>separate justice system for young people aged 12 to 17</b>. It recognizes that young people are still developing, and it focuses on <b>rehabilitation, reintegration, accountability and meaningful consequences</b>.',
  why: 'Must include: <b>ages 12&ndash;17</b> + <b>why</b> it is separate (still developing).' },
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 2,
  q: 'Explain the difference between the <b>Executive</b> and <b>Legislative</b> branches.',
  model: 'The <b>Executive</b> branch carries out and administers laws (the PM, Cabinet and government departments). The <b>Legislative</b> branch creates, debates and passes laws (Parliament).',
  why: 'Executive = does. Legislative = makes.' },
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 2,
  q: 'Why is it important to <b>divide government responsibilities</b> among different branches?',
  model: 'It prevents any one branch from having too much power. It creates <b>checks and balances</b>, protects citizens\' rights, and helps keep the government <b>fair and accountable</b>.',
  why: 'Key phrase: <b>checks and balances</b>.' },
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 2,
  q: 'What is the difference between a <b>Prime Minister</b> and a <b>Premier</b>?',
  model: 'The <b>Prime Minister</b> leads the <b>federal</b> government and makes decisions affecting all of Canada. A <b>Premier</b> leads a <b>provincial</b> government and makes decisions affecting their province.',
  why: 'Give an example: PM Mark Carney (Canada) vs Premier Doug Ford (Ontario).' },
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 2,
  q: 'What is the difference between the <b>PMO</b> and the <b>PCO</b>?',
  model: 'The <b>PMO</b> (Prime Minister\'s Office) provides <b>political</b> advice and support to the Prime Minister. The <b>PCO</b> (Privy Council Office) provides <b>professional, non-partisan</b> advice and support to the Prime Minister and Cabinet.',
  why: 'One word each: PMO = <b>political</b>, PCO = <b>non-partisan</b>.' },
{ topic: 'written', part: 'B', cat: 'C', type: 'open', marks: 2,
  q: 'Why is the <b>history of voting rights</b> important?',
  model: 'It shows how voting rights <b>expanded over time</b> and how different groups <b>fought for equal participation</b> in Canadian democracy &mdash; for example, Agnes Macphail becoming the first woman elected to the House of Commons in 1921, and the voting age dropping from 21 to 18 in 1970.',
  why: 'Including a date or name as evidence gets you the full marks.' },

{ topic: 'written', part: 'C', cat: 'A', type: 'open', marks: 3,
  q: '<div class="scen">A person intentionally takes a bicycle belonging to another person without permission.</div>a) Identify the actus reus. b) Identify the mens rea. c) Explain why both elements may be important in a criminal case.',
  model: 'a) <b>Actus reus</b>: taking the bicycle without the owner\'s permission.<br>b) <b>Mens rea</b>: intending to take property that belongs to someone else without permission.<br>c) Both help establish whether a criminal offence happened. The Crown generally must prove the prohibited act <b>and</b> the required mental element <b>beyond a reasonable doubt</b>.',
  why: 'Answer a), b) and c) as separate labelled lines &mdash; it makes marking easy for the teacher.' },
{ topic: 'written', part: 'C', cat: 'A', type: 'open', marks: 3,
  q: '<div class="scen">A student damages another student\'s property. The school considers a restorative approach.</div>a) What does restorative justice aim to achieve? b) Suggest two actions the student could take to repair the harm. c) How is this different from simply punishing the student?',
  model: 'a) To repair the harm, encourage accountability, and rebuild relationships.<br>b) Pay for or replace the property; apologise sincerely and take responsibility.<br>c) Restorative justice focuses on <b>repairing the damage</b> and helping the student understand the consequences. Punishment focuses mainly on giving a consequence for breaking the rules.',
  why: 'Two actions means TWO &mdash; count them before moving on.' },
{ topic: 'written', part: 'C', cat: 'A', type: 'open', marks: 3,
  q: '<div class="scen">A homeowner claims that a neighbour\'s actions damaged their property.</div>a) Who is the plaintiff? b) Who is the defendant? c) Identify one possible remedy.',
  model: 'a) The <b>homeowner</b> &mdash; they are bringing the claim.<br>b) The <b>neighbour</b> &mdash; they are responding to the claim.<br>c) The court could order the neighbour to <b>pay damages</b> (money) to cover the property damage.',
  why: 'Always give the reason ("because they are bringing the claim") &mdash; that is the explanation mark.' },
{ topic: 'written', part: 'C', cat: 'A', type: 'open', marks: 3,
  q: 'Explain the difference between <b>First-Past-the-Post</b> and <b>Proportional Representation</b>. Which system aims to make a party\'s seats reflect its share of the vote?',
  model: '<b>FPTP</b> gives the seat to the candidate with the most votes in an electoral district, even with less than 50%.<br><b>PR</b> gives seats to parties based on their percentage of the total vote.<br><b>Proportional Representation</b> is the one that makes seats reflect vote share.',
  why: 'Do not forget the last part &mdash; the question asks you to NAME the system.' },
{ topic: 'written', part: 'C', cat: 'A', type: 'open', marks: 4,
  q: 'Identify <b>two reasons</b> people may not participate in elections and suggest <b>two ways</b> to encourage voter participation.',
  model: 'Reasons:<br>&bull; They believe their vote will not make a difference.<br>&bull; They lack interest in politics or do not know enough about candidates.<br>Ways to encourage voting:<br>&bull; More education about elections, parties and government.<br>&bull; Make voting information and registration more accessible.<br>Voting matters because it lets citizens choose their leaders and have a voice in decisions that affect the country.',
  why: '2 + 2 = 4 marks. Number them so the teacher can count them.' }
];

/* ============================================================
   TOPIC REGISTRY
   ============================================================ */
const TOPICS = {
  levels:    { name: 'Levels of Government', coach: 'cleo',      icon: '&#127963;', blurb: 'Federal, provincial, municipal — who does what',
               gens: [genLevel, genLevel, genLevelMulti, genLevelOdd, tfFor('levels')] },
  whoswho:   { name: 'Who\'s Who',            coach: 'cleo',      icon: '&#128081;', blurb: 'The King, PM, GG, Chief Justice, Premier…',
               gens: [genWhoIs, genWhoIs, genWhoTyped, genRole, tfFor('whoswho')] },
  branches:  { name: 'The Three Branches',    coach: 'frankie',   icon: '&#9889;',   blurb: 'Makes, carries out, interprets',
               gens: [genBranchTask, genBranchTask, genBranchMember, genBranchMulti, genBranchJob, tfFor('branches')] },
  executive: { name: 'Executive Branch',      coach: 'frankie',   icon: '&#127970;', blurb: 'PM, Cabinet, Governor General, PMO vs PCO',
               gens: [glossFor('executive'), glossFor('executive'), tfFor('executive'), () => genMatch(['executive', 'whoswho'])] },
  parliament:{ name: 'Parliament & Bills',    coach: 'ghoulia',   icon: '&#128220;', blurb: 'Commons vs Senate, how a bill becomes law',
               gens: [glossFor('parliament'), tfFor('parliament'), genBillOrder, genBillNext, () => genMatch(['parliament', 'branches'])] },
  judicial:  { name: 'Courts & Judges',       coach: 'ghoulia',   icon: '&#9878;',   blurb: 'Supreme Court, appeals, Federal Courts',
               gens: [glossFor('judicial'), tfFor('judicial'), glossFor('judicial')] },
  criminal:  { name: 'Criminal Law',          coach: 'clawdeen',  icon: '&#128680;', blurb: 'Actus reus, mens rea, the Crown, proof',
               gens: [glossFor('criminal'), genArMr, genArMr, genArMrMulti, genCrimOrder, tfFor('criminal'), genStandard] },
  youth:     { name: 'Youth & Justice',       coach: 'draculaura',icon: '&#129415;', blurb: 'YCJA, deterrence, rehab, restorative',
               gens: [glossFor('youth'), genApproach, genApproach, genYCJAAge, genRestorativeMulti, tfFor('youth')] },
  civil:     { name: 'Civil Disputes',        coach: 'lagoona',   icon: '&#127969;', blurb: 'Plaintiff, defendant, negligence, remedies',
               gens: [glossFor('civil'), genCrimCivil, genCrimCivil, genCivilParties, genStandard, tfFor('civil')] },
  elections: { name: 'Voting Rights',         coach: 'spectra',   icon: '&#128499;', blurb: 'Who can vote, history, voter apathy',
               gens: [glossFor('elections'), genVoter, genVoter, genHistory, tfFor('elections')] },
  electoral: { name: 'Electoral Systems',     coach: 'abbey',     icon: '&#128202;', blurb: 'FPTP, runoff, PR, MMP — with real numbers',
               gens: [genFPTP, genFPTP, genPR, genWinnerPct, genSystem, glossFor('electoral'), tfFor('electoral')] },
  written:   { name: 'Explain It',            coach: 'spectra',   icon: '&#128172;', blurb: 'Written answers you mark yourself',
               gens: [] }
};

const COACHES = {
  frankie:   { name: 'Frankie Stein',       colour: '#7CF03D', line: 'Power is shared three ways. That is what keeps it safe.' },
  ghoulia:   { name: 'Ghoulia Yelps',       colour: '#4DC6FF', line: 'Bills follow steps. Steps follow order. I love order.' },
  cleo:      { name: 'Cleo de Nile',        colour: '#FFD447', line: 'Royalty, rulers and who runs what. My favourite subject.' },
  clawdeen:  { name: 'Clawdeen Wolf',       colour: '#FF8A3D', line: 'Act plus mind. The Crown has to prove both.' },
  draculaura:{ name: 'Draculaura',          colour: '#FF5FA2', line: 'Everyone deserves a chance to fix things. Fangs-ally.' },
  lagoona:   { name: 'Lagoona Blue',        colour: '#2FE0C8', line: 'Plaintiff complains, defendant defends. Easy as, luv.' },
  spectra:   { name: 'Spectra Vondergeist', colour: '#C48BFF', line: 'Every vote is a voice. Even a ghost wants one.' },
  abbey:     { name: 'Abbey Bominable',     colour: '#9FE7FF', line: 'Numbers are cold and honest. Let us count the votes.' }
};

/* ---- pull a question from a topic ---- */
function questionFrom(topic) {
  const t = TOPICS[topic];
  const statics = STATIC_BANK.filter(q => q.topic === topic);
  const gens = t ? t.gens : [];
  const useStatic = statics.length && (!gens.length || Math.random() < 0.3);
  const q = useStatic ? JSON.parse(JSON.stringify(pick(statics))) : pick(gens)();
  if (q.type === 'mc' && useStatic) {           /* reshuffle fixed MC so positions can't be memorised */
    const right = q.choices[q.a];
    q.choices = shuffle(q.choices); q.a = q.choices.indexOf(right);
  }
  q.topic = topic;
  return q;
}
function randomQuestion(pool) {
  const keys = pool && pool.length ? pool : Object.keys(TOPICS).filter(k => k !== 'written');
  return questionFrom(pick(keys));
}
