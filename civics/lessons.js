/* ============================================================
   MONSTER CIVICS — visual lessons
   One idea per screen, every step carries a picture.
   ============================================================ */

const C = { pink: '#FF2E88', purple: '#A855F7', acid: '#B9FF2E', cyan: '#22E0D6',
            warn: '#FFC53D', good: '#3DDC7F', bad: '#FF5470', dim: '#6B5A80', blue: '#4DC6FF', orange: '#FF8A3D' };

/* ---------- diagram builders (plain HTML, themed by CSS) ---------- */
/* three (or two) side-by-side cards: [kicker, big, body, colour] */
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
/* stacked tiers, top = highest */
function ladder(rows) {
  return '<div class="ladder">' + rows.map((r, i) =>
    `<div class="rung" style="--rc:${r[2]};width:${100 - (rows.length - 1 - i) * 0}%"><b>${r[0]}</b><span>${r[1]}</span></div>` +
    (i < rows.length - 1 ? '<div class="rarrow">&#9650; appeal goes up</div>' : '')).join('') + '</div>';
}
function memo(big, small) { return `<div class="memo"><div class="mbig">${big}</div><div class="msmall">${small}</div></div>`; }
/* a row of seats coloured by party: list of [count, colour, label] */
function seats(groups, title) {
  const dots = groups.map(g => Array.from({ length: g[0] }, () => `<span class="seat" style="background:${g[1]}"></span>`).join('')).join('');
  const key = groups.map(g => `<span class="sk"><span class="seat" style="background:${g[1]}"></span>${g[2]}</span>`).join('');
  return `<div class="seatbox"><div class="cmpt" style="--cc:${C.cyan}">${title}</div><div class="seatrow">${dots}</div><div class="seatkey">${key}</div></div>`;
}
function hbars(rows, title) {
  return `<div class="seatbox"><div class="cmpt" style="--cc:${C.warn}">${title}</div>` + rows.map(r =>
    `<div class="hb"><span class="hbn">${r[0]}</span><span class="hbt"><span class="hbf" style="width:${r[1]}%;background:${r[2]}"></span></span><span class="hbv">${r[1]}%</span></div>`).join('') + '</div>';
}
function parliamentDia() {
  return `<div class="parl">
    <div class="pking">&#128081; <b>The Sovereign</b><span>King Charles III &middot; represented by the Governor General</span></div>
    <div class="pchambers">
      <div class="pch" style="--cc:${C.warn}"><b>Senate</b><span>&ldquo;upper house&rdquo;</span><em>APPOINTED</em><span>reviews &amp; studies bills</span></div>
      <div class="pch" style="--cc:${C.good}"><b>House of Commons</b><span>&ldquo;lower house&rdquo;</span><em>ELECTED</em><span>MPs debate &amp; vote on bills</span></div>
    </div>
    <div class="pcap">All three together = <b>PARLIAMENT</b> = the <b>legislative</b> branch</div>
  </div>`;
}

/* ============================================================ */
const LESSONS = {

levels: { title: 'Levels of Government', sub: 'Three sizes of government', steps: [
  { h: 'Canada has three levels of government',
    b: 'Think of it like zooming in on a map. The bigger the area a decision affects, the higher the level that handles it.',
    v: cards([['the whole country', 'FEDERAL', 'Ottawa &middot; led by the <b>Prime Minister</b>', C.pink],
              ['one province', 'PROVINCIAL', 'Queen\'s Park, Toronto &middot; led by the <b>Premier</b>', C.purple],
              ['your city', 'MUNICIPAL', 'City Hall &middot; led by the <b>Mayor</b>', C.cyan]]) },
  { h: 'Federal = things that affect ALL of Canada',
    b: 'If it would be weird for each province to do it differently, it is federal. Imagine Ontario printing its own money &mdash; chaos.',
    v: cards([['federal jobs', 'COUNTRY', 'National defence &middot; immigration &middot; citizenship &middot; money &middot; Canada Post &middot; criminal law &middot; foreign affairs', C.pink]]) },
  { h: 'Provincial = things each province runs its own way',
    b: 'The big one on the test: <b>education in Ontario is provincial.</b> Health care is too.',
    v: cards([['provincial jobs', 'PROVINCE', '<b>Education</b> &middot; <b>health care</b> &middot; hospitals &middot; driver\'s licences &middot; highways like the 401 &middot; natural resources', C.purple]]) },
  { h: 'Municipal = what you see on your street',
    b: 'If you can see it from your front window, it is probably municipal.',
    v: cards([['municipal jobs', 'CITY', '<b>Garbage collection</b> &middot; <b>local roads</b> &middot; recycling &middot; libraries &middot; parks &middot; snow removal &middot; the TTC &middot; fire department', C.cyan]]) },
  { h: 'The 3-second test',
    b: 'Ask these in order and you will get almost every level question right.',
    v: flow([['Does it protect or affect the whole country?', 'FEDERAL', C.pink],
             ['Is it schools, hospitals or licences?', 'PROVINCIAL', C.purple],
             ['Is it on your street or in your neighbourhood?', 'MUNICIPAL', C.cyan]]) }
] },

whoswho: { title: 'Who\'s Who', sub: 'Seven names, seven jobs', steps: [
  { h: 'The King is at the very top',
    b: 'Canada is a <b>constitutional monarchy</b>. That means the King is the <b>Head of State</b>, but elected people actually run the government.',
    v: memo('&#128081; King Charles III', 'Head of State (the Sovereign)') },
  { h: 'The King has stand-ins here',
    b: 'The King lives in the UK, so he has representatives. Federal level = <b>Governor General</b>. Ontario = <b>Lieutenant Governor</b>.',
    v: cards([['represents the King in Canada', 'Governor General', '<b>Mary Simon</b> &middot; gives Royal Assent', C.warn],
              ['represents the King in Ontario', 'Lieutenant Governor', '<b>Edith Dumont</b>', C.orange]]) },
  { h: 'Prime Minister vs Premier',
    b: 'This one is on the review sheet as a written question. <b>Prime Minister = country. Premier = province.</b>',
    v: cards([['leads the federal government', 'Prime Minister', '<b>Mark Carney</b> &middot; decisions for all of Canada', C.pink],
              ['leads a provincial government', 'Premier', '<b>Doug Ford</b> (Ontario) &middot; decisions for the province', C.purple]]) },
  { h: 'The judge at the top, and the mayor',
    b: 'The <b>Chief Justice</b> leads the Supreme Court and helps interpret laws and the Constitution. The <b>Mayor</b> leads the city.',
    v: cards([['leads the Supreme Court', 'Chief Justice', '<b>Richard Wagner</b>', C.blue],
              ['leads Toronto', 'Mayor', '<b>Olivia Chow</b>', C.cyan]]) },
  { h: 'The full cast',
    b: 'Cover the right side with your hand and try to say each name. Do it twice.',
    v: `<table class="dtable">${PEOPLE.map(p => `<tr><td>${p.pos}</td><td><b>${p.who}</b></td></tr>`).join('')}</table>` }
] },

branches: { title: 'The Three Branches', sub: 'Makes &middot; carries out &middot; interprets', steps: [
  { h: 'Power is split three ways',
    b: 'Instead of one group doing everything, the job of governing is split up. Each branch has one main job.',
    v: cards([['makes laws', 'LEGISLATIVE', 'Parliament: Sovereign + Senate + House of Commons', C.good],
              ['carries out laws', 'EXECUTIVE', 'PM, Cabinet, government departments', C.pink],
              ['interprets laws', 'JUDICIAL', 'Courts and judges, led by the Supreme Court', C.blue]]) },
  { h: 'Memory trick: the first letter',
    b: 'Say it out loud like a cheer.',
    v: flow([['<b>L</b>egislative &mdash; <b>L</b>aws are made', 'MAKES', C.good],
             ['<b>E</b>xecutive &mdash; <b>E</b>xecutes, like "execute a plan" = do it', 'DOES', C.pink],
             ['<b>J</b>udicial &mdash; <b>J</b>udges', 'INTERPRETS', C.blue]]) },
  { h: 'Think of a school',
    b: 'The <b>student council votes</b> on a new rule (legislative). The <b>principal and staff</b> put it into action (executive). If there is an argument about what the rule means, <b>someone fair decides</b> (judicial).',
    v: cards([['votes on the rule', 'Council', 'legislative', C.good], ['enforces the rule', 'Principal', 'executive', C.pink], ['settles disputes', 'Referee', 'judicial', C.blue]]) },
  { h: 'Why split it up? Checks and balances',
    b: 'If one group could make the laws, enforce them AND judge them, it could do whatever it wanted. Splitting power means each branch <b>checks</b> the others. This keeps government <b>fair and accountable</b> and protects citizens\' rights.',
    v: memo('&#9878; Checks and balances', 'No one branch gets too much power') }
] },

executive: { title: 'The Executive Branch', sub: 'The ones who carry out the laws', steps: [
  { h: 'Who is in the executive?',
    b: 'Its main job: <b>carry out and administer laws and government policies.</b>',
    v: flow([['The Sovereign, represented by the <b>Governor General</b>', 'FORMAL HEAD', C.warn],
             ['The <b>Prime Minister</b>: leads the government and the Cabinet', 'LEADER', C.pink],
             ['The <b>Cabinet</b>: ministers chosen by the PM', 'TEAM', C.purple],
             ['Government <b>departments</b> that deliver services', 'WORKERS', C.cyan]]) },
  { h: 'What does the Prime Minister do?',
    b: '&bull; Leads Canada\'s federal government<br>&bull; Leads the Cabinet<br>&bull; Makes important government decisions<br>&bull; Usually leads the party that has the confidence of the House of Commons',
    v: memo('Mark Carney', 'Prime Minister of Canada') },
  { h: 'The Cabinet',
    b: 'A group of <b>ministers chosen by the Prime Minister</b>. Each one is in charge of one department &mdash; like education, finance or defence. Together they make government policies and decisions.',
    v: cards([['minister of', 'Finance', 'money &amp; budget', C.good], ['minister of', 'Defence', 'the military', C.pink], ['minister of', 'Health', 'health policy', C.cyan]]) },
  { h: 'PMO vs PCO &mdash; the teacher\'s favourite',
    b: 'They sound almost the same. The difference is one word: <b>political</b> vs <b>non-partisan</b>. (Non-partisan = not on any party\'s side.)',
    v: cards([['Prime Minister\'s Office', 'PMO', '<b>POLITICAL</b> advice &amp; support to the PM. The PM\'s own team.', C.pink],
              ['Privy Council Office', 'PCO', '<b>NON-PARTISAN</b>, professional advice &amp; support to the PM <b>and</b> Cabinet.', C.cyan]]) },
  { h: 'Memory trick',
    b: 'The <b>M</b> in PMO is for the PM\'s <b>M</b>ates &mdash; political friends on his side. The <b>C</b> in PCO is for <b>C</b>alm, <b>C</b>areer public servants who stay neutral.',
    v: memo('PMO = Political &middot; PCO = Calm &amp; neutral', 'Say it twice.') }
] },

parliament: { title: 'Parliament &amp; Bills', sub: 'The law-making machine', steps: [
  { h: 'Parliament has three parts',
    b: 'Parliament IS the legislative branch. Its job: <b>create, debate and pass laws.</b>',
    v: parliamentDia() },
  { h: 'Commons vs Senate',
    b: 'The most important difference: <b>elected vs appointed.</b>',
    v: cards([['House of Commons', 'ELECTED', 'MPs are elected by voters. Each MP represents one <b>riding</b> (constituency). They debate and vote on laws.', C.good],
              ['Senate', 'APPOINTED', 'Senators are appointed by the Governor General on the <b>Prime Minister\'s advice</b>. They review and study bills.', C.warn]]) },
  { h: 'A bill is a law-in-waiting',
    b: 'A <b>bill</b> is a <b>proposed</b> law. It has to be debated, examined and approved before it becomes a real law.',
    v: memo('Bill &rarr; Law', 'Not a law until Royal Assent') },
  { h: 'How a bill becomes law',
    b: 'This is flagged as one of the most important things on the test. Learn the order.',
    v: timeline(['Introduced in the House of Commons or Senate (1st reading)', 'Debated (2nd reading)', 'Studied in committee', 'Voted on (3rd reading)', 'Same steps in the other chamber', '<b>Royal Assent</b> from the Governor General', 'It becomes <b>LAW</b>'], C.good) },
  { h: 'Royal Assent is ALWAYS last',
    b: '<b>Royal Assent</b> = the formal approval by the King or Governor General. It is the final step before a bill becomes law. If you see "Royal Assent" anywhere but the end, it is wrong.',
    v: memo('&#128081; Royal Assent', 'The final stamp of approval') }
] },

judicial: { title: 'Courts &amp; Judges', sub: 'The branch that interprets', steps: [
  { h: 'What the judicial branch does',
    b: 'It <b>interprets and applies laws</b>, <b>resolves legal disputes</b>, and makes sure justice is fair.',
    v: memo('&#9878; Judicial = Judges', 'Interpret &middot; resolve &middot; keep it fair') },
  { h: 'Courts are a ladder',
    b: 'If someone thinks a court made a <b>legal error</b>, they can <b>appeal</b> &mdash; ask a higher court to review the decision. The top of the ladder is the Supreme Court.',
    v: ladder([['Supreme Court of Canada', 'Highest court &middot; led by the Chief Justice', C.warn],
               ['Courts of Appeal', 'Review decisions from lower courts', C.purple],
               ['Trial courts', 'Where most cases start', C.cyan]]) },
  { h: 'What does a judge do?',
    b: 'A judge <b>listens to both sides</b>, <b>examines the evidence</b>, interprets the law, and makes a <b>fair decision</b> based on the law.',
    v: flow([['Listen to both sides', '1', C.cyan], ['Examine evidence', '2', C.cyan], ['Apply the law fairly', '3', C.cyan], ['Make a decision', '4', C.cyan]]) },
  { h: 'Federal Courts are special',
    b: 'They handle cases about <b>federal laws</b> and the federal government.',
    v: cards([['Federal Courts handle', 'Federal stuff', 'Immigration &middot; maritime (sea) law &middot; copyright &middot; disputes with the federal government', C.blue]]) }
] },

criminal: { title: 'Criminal Law', sub: 'Offences against society', steps: [
  { h: 'Criminal law = offences against society',
    b: 'Theft, assault, murder. These hurt one person, but they also break the rules that keep <b>everyone</b> safe &mdash; so society, through the <b>Crown</b>, brings the case.',
    v: cards([['represents the state', 'The Crown', 'Presents the case against the accused', C.bad],
              ['person charged', 'The Accused', 'Presumed innocent until proven guilty', C.cyan]]) },
  { h: 'Two ingredients: act + mind',
    b: 'For most crimes the Crown must prove <b>both</b>.',
    v: cards([['the guilty ACT', 'Actus reus', 'Actus &asymp; <b>ACTion</b>. What the person physically did.', C.orange],
              ['the guilty MIND', 'Mens rea', 'Mens &asymp; <b>MENtal</b>. What they intended or knew.', C.purple]]) },
  { h: 'Example: the bicycle',
    b: 'A person intentionally takes someone else\'s bicycle without permission.',
    v: flow([['Taking the bicycle without permission', 'ACTUS REUS', C.orange],
             ['Intending to take a bike that belongs to someone else', 'MENS REA', C.purple]]) },
  { h: 'Beyond a reasonable doubt',
    b: 'Because a person\'s freedom is at stake, the Crown must prove guilt so strongly that <b>no reasonable doubt remains</b>. Together with the <b>presumption of innocence</b>, this protects people from being wrongly convicted.',
    v: hbars([['Criminal: beyond a reasonable doubt', 98, C.bad], ['Civil: balance of probabilities', 51, C.cyan]], 'how sure the court must be') },
  { h: 'The criminal justice process',
    b: 'Every case must follow a <b>fair process</b> to protect people\'s rights and prevent wrongful convictions.',
    v: timeline(['Police <b>investigate</b> and gather evidence', 'The person is <b>charged</b>', 'The accused <b>appears in court</b> and hears the charge', '<b>Trial</b>: the Crown must prove guilt', 'If guilty, the judge decides the <b>sentence</b>'], C.bad) },
  { h: 'Rights of the accused (Charter)',
    b: 'Three to remember for the written question:',
    v: flow([['Presumed <b>innocent</b> until proven guilty', '1', C.good], ['Right to a <b>lawyer</b>', '2', C.good], ['Right to be <b>told why</b> you were arrested, promptly', '3', C.good]]) }
] },

youth: { title: 'Youth &amp; Justice', sub: 'YCJA and the three approaches', steps: [
  { h: 'The Youth Criminal Justice Act',
    b: 'Young people aged <b>12 to 17</b> have their own justice system, because they are still developing and have different maturity than adults.',
    v: cards([['under 12', 'No charge', 'Cannot be charged with a crime', C.dim], ['12 to 17', 'YCJA', 'Youth justice system', C.pink], ['18 and up', 'Adult', 'Adult criminal system', C.purple]]) },
  { h: 'What the YCJA focuses on',
    b: 'Not just punishment. The goal is a young person who does better next time.',
    v: flow([['Rehabilitation &mdash; change the behaviour', 'R', C.good], ['Reintegration &mdash; return to school and community', 'R', C.good], ['Accountability &mdash; meaningful consequences', 'A', C.warn]]) },
  { h: 'Sentencing: three approaches',
    b: '<b>Sentencing</b> decides the consequences after someone is found guilty. There are three main ways to think about it.',
    v: cards([['discourage', 'Deterrence', 'Show there are consequences so people don\'t commit crimes', C.bad],
              ['change', 'Rehabilitation', 'Education, counselling, treatment, support', C.good],
              ['repair', 'Restorative', 'Fix the harm, take responsibility', C.cyan]]) },
  { h: 'Spot it in a scenario',
    b: 'Look for the key action word.',
    v: flow([['"so others will think twice", "big fine to discourage"', 'DETERRENCE', C.bad],
             ['"counselling", "treatment", "job training", "school"', 'REHABILITATION', C.good],
             ['"apologise", "meet the victim", "repair", "replace"', 'RESTORATIVE', C.cyan]]) },
  { h: 'Restorative vs punishment',
    b: '<b>Punishment</b> focuses on giving a consequence for wrongdoing. <b>Restorative justice</b> focuses on <b>repairing the harm</b> and helping the people affected.',
    v: memo('Restore = fix it', 'Apologise sincerely &middot; pay for or replace the damage') }
] },

civil: { title: 'Civil Disputes', sub: 'Person vs person', steps: [
  { h: 'Criminal vs civil',
    b: 'Criminal = offence against <b>society</b>. Civil = a dispute <b>between people or organizations</b>.',
    v: cards([['criminal', 'Crown vs Accused', '"charged" &middot; beyond a reasonable doubt &middot; can lead to jail', C.bad],
              ['civil', 'Plaintiff vs Defendant', '"sues" &middot; balance of probabilities &middot; money or orders', C.cyan]]) },
  { h: 'Plaintiff and defendant',
    b: 'The <b>plaintiff</b> brings the claim. The <b>defendant</b> responds to it.',
    v: cards([['brings the claim', 'Plaintiff', 'Sounds like com<b>PLAINT</b> &mdash; they are complaining', C.warn],
              ['responds to the claim', 'Defendant', 'They <b>DEFEND</b> themselves', C.blue]]) },
  { h: 'Two common claims',
    b: '',
    v: cards([['didn\'t take care', 'Negligence', 'Failing to take reasonable care and causing harm. <i>Wet floor, no sign.</i>', C.orange],
              ['came onto my land', 'Trespass', 'Unlawfully entering or interfering with someone\'s property. <i>Walking through a farmer\'s field.</i>', C.purple]]) },
  { h: 'Remedies: how a court fixes it',
    b: 'Civil courts do not send people to jail. They give <b>remedies</b>.',
    v: flow([['<b>Damages</b> &mdash; money to make up for the harm', '$', C.good], ['An <b>order</b> to stop doing something (or to do something)', '&#9995;', C.good]]) },
  { h: 'Precedent and common law',
    b: 'A <b>precedent</b> is an earlier court decision. Judges use it to decide similar cases the same way. That body of past decisions is <b>common law</b>.',
    v: memo('PRE-cedent = came before', 'Past decisions guide future ones') }
] },

elections: { title: 'Voting Rights', sub: 'Who votes, and how we got here', steps: [
  { h: 'Who can vote federally?',
    b: 'Two checks. Both must be yes.',
    v: flow([['Are you a <b>Canadian citizen</b>?', 'CHECK 1', C.good], ['Are you <b>18 or older on election day</b>?', 'CHECK 2', C.good]]) },
  { h: 'The secret ballot',
    b: 'You vote <b>privately</b>. Nobody has to know who you picked, so nobody can pressure you.',
    v: memo('&#128499; Secret ballot', 'Private voting') },
  { h: 'Two dates to know',
    b: 'Voting rights <b>expanded over time</b> because people fought for equal participation.',
    v: timeline(['<b>1921</b> &mdash; Agnes Macphail becomes the first woman elected to the House of Commons', '<b>1970</b> &mdash; the federal voting age drops from 21 to 18'], C.purple) },
  { h: 'The Charter protects it',
    b: 'The <b>Charter of Rights and Freedoms</b> protects democratic rights &mdash; including the right of citizens to vote and to run in federal and provincial elections.',
    v: memo('Charter', 'Right to vote &middot; right to run') },
  { h: 'Voter apathy',
    b: '<b>Voter apathy</b> = a lack of interest or motivation to vote.',
    v: cards([['why people don\'t vote', 'Reasons', '&bull; "My vote won\'t matter"<br>&bull; Not interested in politics<br>&bull; Don\'t know enough about candidates', C.bad],
              ['how to fix it', 'Solutions', '&bull; Teach about elections &amp; government<br>&bull; Make voting info and registration easier<br>&bull; Encourage informed discussion', C.good]]) }
] },

electoral: { title: 'Electoral Systems', sub: 'Turning votes into seats', steps: [
  { h: 'An electoral system turns votes into seats',
    b: 'Same votes, different system &rarr; different result. That is why people argue about <b>electoral reform</b>.',
    v: memo('Votes &rarr; &#9881; &rarr; Seats', 'The &#9881; is the electoral system') },
  { h: 'First-Past-the-Post (Canada uses this)',
    b: 'Like a race: whoever crosses the line first wins. You do <b>not</b> need 50%. You just need <b>more votes than anyone else</b>.',
    v: hbars([['Frankie', 38, C.good], ['Cleo', 34, C.warn], ['Ghoulia', 28, C.blue]], 'one riding') + '<div class="exline">Frankie wins with 38% &mdash; even though 62% voted for someone else.</div>' },
  { h: 'Runoff voting',
    b: 'If nobody gets a <b>majority</b> (more than 50%), voters vote again until someone does.',
    v: timeline(['Round 1: Frankie 38%, Cleo 34%, Ghoulia 28% &mdash; no majority', 'Round 2: voters choose again &rarr; someone gets over 50%', 'That candidate wins'], C.warn) },
  { h: 'Proportional Representation',
    b: 'Seats match each party\'s share of the vote. 40% of the votes &rarr; about 40% of the seats.',
    v: seats([[4, C.pink, 'Fang 40%'], [3, C.cyan, 'Moonlight 30%'], [2, C.warn, 'Stitch 20%'], [1, C.purple, 'Coffin 10%']], 'PR: 10 seats') },
  { h: 'Same votes, FPTP could look like this',
    b: 'Under FPTP a party can win lots of ridings by small margins and end up with far more seats than its vote share.',
    v: seats([[7, C.pink, 'Fang (40% of votes)'], [3, C.cyan, 'Moonlight (30%)'], [0, C.warn, 'Stitch'], [0, C.purple, 'Coffin']], 'FPTP: 10 seats (possible result)') },
  { h: 'MMP: a mix of both',
    b: '<b>Mixed Member Proportional</b> combines <b>local representation</b> (you still elect your own local MP) with <b>proportional representation</b> (extra seats top things up to match the vote).',
    v: cards([['FPTP', 'Race', 'Most votes wins', C.good], ['PR', 'Pie', 'Seats = vote share', C.pink], ['MMP', 'Mix', 'Local + proportional', C.purple]]) }
] }
};

const LESSON_HOOKS = {};
