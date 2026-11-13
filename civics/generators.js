/* ============================================================
   MONSTER CIVICS — runtime question generators
   Each returns a fresh randomised question object.
   type: 'mc' | 'text' | 'number' | 'multi' | 'open'
   ============================================================ */

const LEVEL_NAMES = ['Federal', 'Provincial', 'Municipal'];
const LEVEL_WHY = {
  Federal: 'It affects the <b>whole country</b>, so it is <b>federal</b> (Ottawa).',
  Provincial: 'It is run <b>province by province</b>, so it is <b>provincial</b> (Queen\'s Park in Toronto, for Ontario).',
  Municipal: 'It is a <b>local, everyday city service</b>, so it is <b>municipal</b> (City Hall).'
};

/* ---------- LEVELS ---------- */
function genLevel() {
  const lvl = pick(LEVEL_NAMES), job = pick(LEVELS[lvl].jobs);
  return mcq({ cat: 'K', q: `Which level of government is responsible for <b>${job}</b>?`,
    right: lvl, wrong: LEVEL_NAMES.filter(x => x !== lvl),
    why: LEVEL_WHY[lvl] + '<br><br><span class="dimline">Federal = country &middot; Provincial = province &middot; Municipal = city.</span>',
    hint: 'Ask yourself: does this cover the whole country, just one province, or just your city?' });
}
function genLevelMulti() {
  const lvls = shuffle(LEVEL_NAMES);
  const parts = lvls.map(l => ({ label: `<b>${pick(LEVELS[l].jobs)}</b>`, choices: LEVEL_NAMES.slice(), a: LEVEL_NAMES.indexOf(l), lvl: l }));
  return { cat: 'K', type: 'multi', q: 'Sort each responsibility into the right level of government.', parts,
    why: parts.map(p => `&bull; ${p.label} &rarr; <b>${p.lvl}</b>`).join('<br>') +
      '<br><br>Trick: <b>Country &rarr; Province &rarr; City</b> &mdash; the bigger the area it affects, the higher the level.',
    hint: 'One of each! Each level appears exactly once.' };
}
function genLevelOdd() {
  const lvl = pick(LEVEL_NAMES), others = LEVEL_NAMES.filter(x => x !== lvl);
  const same = sample(LEVELS[lvl].jobs, 3), odd = pick(LEVELS[pick(others)].jobs);
  const oddLvl = others.find(o => LEVELS[o].jobs.includes(odd));
  return mcq({ cat: 'T', q: `Three of these belong to the <b>${lvl.toLowerCase()}</b> government. Which one is the <b>odd one out</b>?`,
    right: odd, wrong: same,
    why: `<b>${odd}</b> is <b>${oddLvl.toLowerCase()}</b>, not ${lvl.toLowerCase()}. ${LEVEL_WHY[oddLvl]}`,
    hint: `Which one does not fit "${LEVELS[lvl].short}"?` });
}

/* ---------- WHO'S WHO ---------- */
function genWhoIs() {
  const p = pick(PEOPLE);
  if (Math.random() < 0.5) {
    return mcq({ cat: 'K', q: `Who is the <b>${p.pos}</b>?`, right: p.who,
      wrong: sample(PEOPLE.filter(x => x !== p), 3).map(x => x.who),
      why: `<b>${p.who}</b> is the ${p.pos}. ${p.role}`, hint: 'Picture the cheat-sheet table: position on the left, person on the right.' });
  }
  return mcq({ cat: 'K', q: `What position does <b>${p.who}</b> hold?`, right: p.pos,
    wrong: sample(PEOPLE.filter(x => x !== p), 3).map(x => x.pos),
    why: `${p.who} is the <b>${p.pos}</b>. ${p.role}`, hint: 'Think about which level of government this person works at.' });
}
function genWhoTyped() {
  const p = pick(PEOPLE);
  return { cat: 'K', type: 'text', q: `Type the name: who is the <b>${p.pos}</b>?`,
    a: [p.who].concat(p.alt), placeholder: 'name',
    why: `<b>${p.who}</b>. ${p.role}`, hint: `Starts with "${p.who[0]}".` };
}
function genRole() {
  const r = pick(ROLES);
  return mcq({ cat: 'K', q: `Who does this? <i>"${r[0]}"</i>`, right: r[1],
    wrong: sample(ROLES.filter(x => x !== r), 3).map(x => x[1]),
    why: `That is the <b>${r[1]}</b>.` + (r[1] === 'Premier' || r[1] === 'Prime Minister'
      ? '<br><br><b>Prime Minister</b> = whole country. <b>Premier</b> = one province.' : ''),
    hint: 'Is this job national, provincial or city-level? Elected or appointed?' });
}

/* ---------- BRANCHES ---------- */
const BRANCHES = ['Legislative', 'Executive', 'Judicial'];
const BRANCH_WHY = {
  Legislative: '<b>Legislative = makes laws.</b> Parliament (House of Commons + Senate) introduces, debates and passes laws.',
  Executive: '<b>Executive = carries out laws.</b> The PM, Cabinet and government departments put laws and policies into action.',
  Judicial: '<b>Judicial = interprets laws.</b> Judges and courts decide what the law means and settle legal cases.'
};
function genBranchTask() {
  const b = pick(BRANCHES), t = pick(BRANCH_TASKS[b]);
  return mcq({ cat: 'K', q: `Which branch of government does this? <i>"${t}"</i>`, right: b, wrong: BRANCHES.filter(x => x !== b),
    why: BRANCH_WHY[b], hint: 'Makes laws? Carries them out? Or interprets them?' });
}
function genBranchMember() {
  const m = pick(BRANCH_MEMBERS);
  return mcq({ cat: 'K', q: `<b>${m[0]}</b> ${/s\b|Senators|Judges|MPs|departments/.test(m[0]) ? 'belong' : 'belongs'} to which branch of government?`,
    right: m[1], wrong: BRANCHES.filter(x => x !== m[1]), why: BRANCH_WHY[m[1]],
    hint: 'Courts and judges = judicial. Parliament = legislative. PM and Cabinet = executive.' });
}
function genBranchMulti() {
  const bs = shuffle(BRANCHES);
  const parts = bs.map(b => ({ label: pick(BRANCH_TASKS[b]), choices: BRANCHES.slice(), a: BRANCHES.indexOf(b), b }));
  return { cat: 'K', type: 'multi', q: '<b>Identify the branch</b> for each task (just like Activity 1 on the review).', parts,
    why: parts.map(p => `&bull; ${p.label} &rarr; <b>${p.b}</b>`).join('<br>') +
      '<br><br>Legislative = <b>L</b>aws made &middot; Executive = <b>E</b>xecutes (does) &middot; Judicial = <b>J</b>udges.',
    hint: 'Each branch shows up once.' };
}
function genBranchJob() {
  const b = pick(BRANCHES);
  if (Math.random() < 0.5)
    return mcq({ cat: 'K', q: `Which branch <b>${BRANCH_JOB[b]}</b>?`, right: b, wrong: BRANCHES.filter(x => x !== b), why: BRANCH_WHY[b],
      hint: 'L = Laws made. E = Executes. J = Judges.' });
  return mcq({ cat: 'K', q: `What is the main responsibility of the <b>${b}</b> branch?`,
    right: BRANCH_JOB[b].replace(/^./, c => c.toUpperCase()),
    wrong: BRANCHES.filter(x => x !== b).map(x => BRANCH_JOB[x].replace(/^./, c => c.toUpperCase())).concat(['Runs elections']),
    why: BRANCH_WHY[b], hint: 'L = Laws made. E = Executes. J = Judges.' });
}

/* ---------- GLOSSARY ---------- */
function genGlossary(topic) {
  const pool = GLOSSARY.filter(x => !topic || x.topic === topic);
  const item = pick(pool);
  let fam = GLOSSARY.filter(x => x.g === item.g && x !== item);
  if (fam.length < 3) fam = fam.concat(sample(GLOSSARY.filter(x => x.g !== item.g), 3 - fam.length));
  const wrong = sample(fam, 3);
  if (Math.random() < 0.5)
    return mcq({ cat: 'K', topic: item.topic, q: `What does <b>${item.t}</b> mean?`, right: item.d, wrong: wrong.map(x => x.d),
      why: `<b>${item.t}</b>: ${item.d}.`, hint: 'Cross out the answers that describe a different term you know.' });
  return mcq({ cat: 'K', topic: item.topic, q: `Which term matches this description?<br><i>"${item.d}"</i>`, right: item.t, wrong: wrong.map(x => x.t),
    why: `That is <b>${item.t}</b>.`, hint: 'Read the description slowly and underline the key word in your head.' });
}
const glossFor = t => () => genGlossary(t);

/* Matching activity: 4 terms, 4 lettered definitions (like Activity 2). */
function genMatch(topics) {
  let pool = GLOSSARY.filter(x => !topics || topics.includes(x.topic));
  const g = pick(pool).g;
  let set = GLOSSARY.filter(x => x.g === g);
  if (set.length < 4) set = set.concat(sample(pool.filter(x => x.g !== g), 4 - set.length));
  const items = sample(set, 4), defs = shuffle(items), L = ['A', 'B', 'C', 'D'];
  return { cat: 'K', type: 'multi', topic: items[0].topic,
    q: '<b>Match each term</b> to its description.<div class="deflist">' +
       defs.map((d, i) => `<div><b>${L[i]}.</b> ${d.d}</div>`).join('') + '</div>',
    parts: items.map(it => ({ label: `<b>${it.t}</b>`, choices: L.slice(), a: defs.indexOf(it) })),
    why: items.map(it => `&bull; <b>${it.t}</b> &rarr; ${L[defs.indexOf(it)]}. ${it.d}`).join('<br>'),
    hint: 'Start with the one you are surest about, then the rest gets easier by elimination.' };
}

/* ---------- TRUE / FALSE ---------- */
function genTF(topic) {
  const pool = TF.filter(x => !topic || x[3] === topic);
  const s = pick(pool);
  return { cat: 'K', type: 'mc', topic: s[3], q: `True or false?<br><b>${s[0]}</b>`, choices: ['True', 'False'], a: s[1] ? 0 : 1,
    why: s[2], hint: 'If even one word is wrong, the whole statement is false.' };
}
const tfFor = t => () => genTF(t);

/* ---------- ORDERING ---------- */
const BILL_STEPS = [
  'The bill is introduced in Parliament (first reading)',
  'The bill is debated (second reading)',
  'A committee studies the bill in detail',
  'Members vote on the bill (third reading)',
  'The bill goes through the same stages in the other chamber',
  'Royal Assent is granted by the Governor General',
];
const CRIM_STEPS = [
  'Police investigate and gather evidence',
  'The person is charged with an offence',
  'The accused appears in court and is told the charge',
  'Trial: the Crown must prove guilt beyond a reasonable doubt',
  'If found guilty, the judge decides the sentence'
];
function genOrder(steps, title, why) {
  const n = 4;
  /* keep the real order, choose 4 steps */
  const idx = sample(steps.map((_, i) => i), n).sort((a, b) => a - b);
  const chosen = idx.map(i => steps[i]);
  const shown = shuffle(chosen), L = ['A', 'B', 'C', 'D'];
  return { cat: 'T', type: 'multi',
    q: `${title}<div class="deflist">` + shown.map((s, i) => `<div><b>${L[i]}.</b> ${s}</div>`).join('') + '</div>',
    parts: ['1st', '2nd', '3rd', '4th'].map((lab, k) => ({ label: lab, choices: L.slice(), a: shown.indexOf(chosen[k]) })),
    why: 'The correct order:<br>' + chosen.map((s, k) => `${k + 1}. ${s}`).join('<br>') + (why ? '<br><br>' + why : ''),
    hint: 'Find the very first and the very last step first. The middle is easier after that.' };
}
const genBillOrder = () => genOrder(BILL_STEPS, 'Put these steps for <b>how a bill becomes law</b> in order.',
  'Memory trick: <b>Intro &rarr; Debate &rarr; Committee &rarr; Vote &rarr; Other chamber &rarr; Royal Assent</b>. Royal Assent is ALWAYS last.');
const genCrimOrder = () => genOrder(CRIM_STEPS, 'Put the steps of the <b>criminal justice process</b> in order.',
  'Investigate &rarr; Charge &rarr; Court &rarr; Trial &rarr; Sentence. Sentencing only happens if the person is found guilty.');
function genBillNext() {
  const i = rnd(BILL_STEPS.length - 1);
  return mcq({ cat: 'T', q: `In the process of a bill becoming law, what comes <b>right after</b> this step?<br><i>"${BILL_STEPS[i]}"</i>`,
    right: BILL_STEPS[i + 1], wrong: sample(BILL_STEPS.filter((_, k) => k !== i && k !== i + 1), 3),
    why: 'The full order:<br>' + BILL_STEPS.map((s, k) => `${k === i + 1 ? '<b>' : ''}${k + 1}. ${s}${k === i + 1 ? '</b>' : ''}`).join('<br>'),
    hint: 'Intro → Debate → Committee → Vote → Other chamber → Royal Assent.' });
}

/* ---------- CRIMINAL: actus reus / mens rea ---------- */
const AR_MR = [
  { s: 'Jordan intentionally takes a bicycle that belongs to someone else, without permission, planning to keep it.', act: 'Taking the bicycle without permission', mind: 'Intending to keep a bicycle that belongs to someone else' },
  { s: 'Riley sneaks a phone from a store shelf into their pocket, knowing they have not paid for it.', act: 'Putting the phone in their pocket and leaving without paying', mind: 'Knowing they had not paid and meaning to take it' },
  { s: 'Sam spray-paints a school wall on purpose because they are angry at a teacher.', act: 'Spray-painting the school wall', mind: 'Deciding on purpose to damage the wall' },
  { s: 'Taylor punches another student after planning to "get back at them" during lunch.', act: 'Punching the other student', mind: 'Planning and intending to hurt the student' },
  { s: 'Casey knowingly sells a "brand-name" watch they know is fake to a buyer who believes it is real.', act: 'Selling the fake watch to the buyer', mind: 'Knowing the watch was fake and meaning to trick the buyer' },
  { s: 'Morgan breaks a car window to grab a laptop from the back seat, wanting to sell it.', act: 'Breaking the window and taking the laptop', mind: 'Intending to take and sell someone else\'s laptop' },
  { s: 'Alex logs into a classmate\'s account using a stolen password to change their grades, knowing it is not allowed.', act: 'Logging in and changing the grades', mind: 'Knowing it was not allowed and meaning to do it anyway' }
];
const AR_DISTRACT = ['The police arresting the accused', 'The judge deciding the sentence', 'The victim reporting the crime', 'The Crown presenting evidence in court'];
function genArMr() {
  const c = pick(AR_MR), wantMind = Math.random() < 0.5;
  return mcq({ cat: 'A', q: `<div class="scen">${c.s}</div>In this scenario, what is the <b>${wantMind ? 'mens rea' : 'actus reus'}</b>?`,
    right: wantMind ? c.mind : c.act, wrong: [wantMind ? c.act : c.mind].concat(sample(AR_DISTRACT, 2)),
    why: `&bull; <b>Actus reus</b> (guilty ACT) = ${c.act.toLowerCase()}.<br>&bull; <b>Mens rea</b> (guilty MIND) = ${c.mind.toLowerCase()}.<br><br>` +
      'The Crown generally must prove <b>both</b> beyond a reasonable doubt.',
    hint: 'Actus = ACTion (what they did). Mens = MENtal (what they were thinking).' });
}
function genArMrMulti() {
  const c = pick(AR_MR);
  return { cat: 'A', type: 'multi', q: `<div class="scen">${c.s}</div>Answer each part.`,
    parts: [
      { label: `"${c.act}" is the&hellip;`, choices: ['Actus reus', 'Mens rea'], a: 0 },
      { label: `"${c.mind}" is the&hellip;`, choices: ['Actus reus', 'Mens rea'], a: 1 },
      { label: 'Who must prove both elements?', choices: ['The accused', 'The Crown', 'The victim'], a: 1 },
      { label: 'How sure must the court be?', choices: ['Balance of probabilities', 'Beyond a reasonable doubt'], a: 1 }
    ],
    why: `<b>Actus reus</b> = the guilty act (${c.act.toLowerCase()}). <b>Mens rea</b> = the guilty mind (${c.mind.toLowerCase()}).<br><br>` +
      'The <b>Crown</b> generally must prove both, <b>beyond a reasonable doubt</b>. The accused is presumed innocent and does not have to prove anything.',
    hint: 'Act = body. Mens = mind. Criminal cases = the highest standard of proof.' };
}

/* ---------- CRIMINAL vs CIVIL ---------- */
const CASES = [
  ['A man is charged with breaking into a house and stealing jewellery.', 'Criminal', 'theft and break-in are offences against society'],
  ['A woman is charged with assault after a fight outside a restaurant.', 'Criminal', 'assault is a crime in the Criminal Code'],
  ['A driver is charged after hitting someone while driving drunk.', 'Criminal', 'impaired driving is a criminal offence'],
  ['A teenager is charged with shoplifting from a mall.', 'Criminal', 'shoplifting is theft, an offence against society'],
  ['Someone is charged with selling illegal drugs.', 'Criminal', 'drug trafficking is a crime'],
  ['A homeowner sues a neighbour whose tree fell and crushed their fence.', 'Civil (private dispute)', 'it is a disagreement between two people about property damage'],
  ['A customer sues a store after slipping on a wet floor that had no warning sign.', 'Civil (private dispute)', 'it is a negligence claim between a person and a business'],
  ['A tenant sues a landlord for not returning a security deposit.', 'Civil (private dispute)', 'it is a money dispute between two private parties'],
  ['A company sues another company for using its logo without permission.', 'Civil (private dispute)', 'it is a dispute between two organizations'],
  ['A farmer sues a hiker who keeps walking across their private field.', 'Civil (private dispute)', 'it is a trespass claim between private parties'],
  ['A student\'s family sues a bus company after a driver carelessly caused an accident.', 'Civil (private dispute)', 'it is a negligence claim for compensation']
];
function genCrimCivil() {
  const c = pick(CASES);
  const civil = c[1] !== 'Criminal';
  return mcq({ cat: 'T', topic: 'civil', q: `<div class="scen">${c[0]}</div>Is this <b>criminal law</b> or a <b>civil (private) dispute</b>?`,
    right: c[1], wrong: [civil ? 'Criminal' : 'Civil (private dispute)'],
    why: `<b>${c[1]}</b> &mdash; ${c[2]}.<br><br>` +
      (civil ? 'Civil: a <b>plaintiff</b> sues a <b>defendant</b>, decided on the <b>balance of probabilities</b>.'
             : 'Criminal: the <b>Crown</b> prosecutes the <b>accused</b>, who must be proven guilty <b>beyond a reasonable doubt</b>.'),
    hint: 'Words like "charged" point to criminal. Words like "sues" point to civil.' });
}

/* Civil scenario with named parties (mirrors Q23 of the practice test) */
const CIVIL_SCEN = [
  { p: 'a homeowner', d: 'their neighbour', s: 'A homeowner claims that their neighbour\'s renovation caused cracks in the homeowner\'s wall.', rem: 'Pay money (damages) to fix the wall', kind: 'Negligence' },
  { p: 'a cyclist', d: 'a delivery company', s: 'A cyclist claims a delivery truck driver carelessly opened a door into the bike lane and injured them.', rem: 'Pay money (damages) for the injuries', kind: 'Negligence' },
  { p: 'a cottage owner', d: 'a group of campers', s: 'A cottage owner claims a group of campers keep setting up tents on the owner\'s private beach.', rem: 'An order telling the campers to stay off the land', kind: 'Trespass' },
  { p: 'a restaurant customer', d: 'the restaurant', s: 'A customer claims they broke their wrist after slipping on a spill the restaurant knew about but never cleaned.', rem: 'Pay money (damages) for the injury', kind: 'Negligence' },
  { p: 'a farmer', d: 'a dirt-bike rider', s: 'A farmer claims a dirt-bike rider keeps riding through their crops without permission.', rem: 'An order telling the rider to stop entering the field', kind: 'Trespass' }
];
function genCivilParties() {
  const c = pick(CIVIL_SCEN);
  const cap = s => s.replace(/^./, x => x.toUpperCase());
  return { cat: 'A', type: 'multi', topic: 'civil', q: `<div class="scen">${c.s}</div>Answer each part.`,
    parts: [
      { label: 'Who is the <b>plaintiff</b>?', choices: shuffle([cap(c.p), cap(c.d), 'The Crown']), ans: cap(c.p) },
      { label: 'Who is the <b>defendant</b>?', choices: shuffle([cap(c.p), cap(c.d), 'The judge']), ans: cap(c.d) },
      { label: 'What kind of claim is this?', choices: ['Negligence', 'Trespass'], ans: c.kind },
      { label: 'A possible <b>remedy</b>:', choices: shuffle([c.rem, 'Jail time for the defendant']), ans: c.rem },
      { label: 'Standard of proof:', choices: ['Beyond a reasonable doubt', 'Balance of probabilities'], ans: 'Balance of probabilities' }
    ].map(p => Object.assign(p, { a: p.choices.indexOf(p.ans) })),
    why: `&bull; <b>Plaintiff</b> = ${c.p} (they bring the claim).<br>&bull; <b>Defendant</b> = ${c.d} (they respond to it).<br>` +
      `&bull; It is <b>${c.kind.toLowerCase()}</b> &mdash; ${c.kind === 'Negligence' ? 'failing to take reasonable care and causing harm' : 'unlawfully entering someone else\'s property'}.<br>` +
      `&bull; Remedy: ${c.rem.toLowerCase()}. Civil courts give <b>money or orders</b>, not jail.<br>&bull; Civil cases use the <b>balance of probabilities</b>.`,
    hint: 'Plaintiff = complains. Defendant = defends. Civil = no Crown, no jail.' };
}
function genStandard() {
  const crim = Math.random() < 0.5;
  const c = pick(CASES.filter(x => (x[1] === 'Criminal') === crim));
  return mcq({ cat: 'T', topic: crim ? 'criminal' : 'civil', q: `<div class="scen">${c[0]}</div>What <b>standard of proof</b> applies?`,
    right: crim ? 'Beyond a reasonable doubt' : 'Balance of probabilities',
    wrong: [crim ? 'Balance of probabilities' : 'Beyond a reasonable doubt', 'The accused must prove they are innocent'],
    why: crim ? 'Criminal case &rarr; <b>beyond a reasonable doubt</b>. It is the highest standard because someone\'s freedom is at stake.'
              : 'Civil case &rarr; <b>balance of probabilities</b> &mdash; more likely than not (think 51%).',
    hint: 'Charged = criminal = very high bar. Sues = civil = more likely than not.' });
}

/* ---------- YOUTH / APPROACHES ---------- */
function genYCJAAge() {
  const age = pick([9, 10, 11, 12, 13, 14, 15, 16, 17, 17, 18, 19, 22]);
  const right = age < 12 ? 'Cannot be charged with a crime (under 12)' : age <= 17 ? 'The youth system (YCJA)' : 'The adult criminal justice system';
  return mcq({ cat: 'A', topic: 'youth', q: `A <b>${age}-year-old</b> is accused of shoplifting. Which applies?`, right,
    wrong: ['Cannot be charged with a crime (under 12)', 'The youth system (YCJA)', 'The adult criminal justice system'].filter(x => x !== right),
    why: `The YCJA covers ages <b>12 to 17</b>. ${age < 12 ? 'Under 12, a child cannot be charged with a criminal offence.' : age <= 17 ? `${age} is inside that range.` : `At ${age} they are an adult.`}`,
    hint: 'YCJA = 12 to 17.' });
}
const APPROACH_SCEN = [
  ['A judge gives a tough, well-publicised sentence so that other people will think twice before doing the same crime.', 'Deterrence'],
  ['A city announces big fines for vandalism to discourage people from damaging bus shelters.', 'Deterrence'],
  ['An offender is required to attend anger-management counselling.', 'Rehabilitation'],
  ['A young offender takes job training and finishes high school while serving their sentence.', 'Rehabilitation'],
  ['Someone caught with drugs is sent to an addiction treatment program.', 'Rehabilitation'],
  ['A student who broke a classmate\'s headphones meets with them, apologises, and pays to replace them.', 'Restorative justice'],
  ['A teen who spray-painted a fence meets the owner and spends a weekend repainting it.', 'Restorative justice'],
  ['An offender sits in a circle with the victim and community members to talk about the harm and how to repair it.', 'Restorative justice']
];
const APPROACH_WHY = {
  'Deterrence': '<b>Deterrence</b> = discouraging crime by showing there are consequences. The focus is on stopping <i>future</i> crimes.',
  'Rehabilitation': '<b>Rehabilitation</b> = helping the offender <b>change their behaviour</b> through education, counselling, treatment and support.',
  'Restorative justice': '<b>Restorative justice</b> = <b>repairing the harm</b> and having the offender take responsibility, often by meeting the person they hurt.'
};
function genApproach() {
  const s = pick(APPROACH_SCEN);
  return mcq({ cat: 'A', topic: 'youth', q: `<div class="scen">${s[0]}</div>Which approach to justice is this?`, right: s[1],
    wrong: Object.keys(APPROACH_WHY).filter(x => x !== s[1]), why: APPROACH_WHY[s[1]],
    hint: 'Discourage others = deterrence. Change the person = rehabilitation. Fix the damage = restorative.' });
}
function genRestorativeMulti() {
  return { cat: 'A', type: 'multi', topic: 'youth',
    q: '<div class="scen">A student damages another student\'s property. The school decides to use a <b>restorative approach</b>.</div>Answer each part.',
    parts: [
      { label: 'What does restorative justice mainly aim to do?', choices: shuffle(['Repair the harm', 'Scare other students', 'Remove the student from school']), ans: 'Repair the harm' },
      { label: 'Which action fits a restorative approach?', choices: shuffle(['Apologise and pay to replace the property', 'A 5-day suspension with no meeting']), ans: 'Apologise and pay to replace the property' },
      { label: 'How is it different from punishment?', choices: shuffle(['It focuses on fixing damage, not just giving a consequence', 'It gives a bigger consequence']), ans: 'It focuses on fixing damage, not just giving a consequence' }
    ].map(p => Object.assign(p, { a: p.choices.indexOf(p.ans) })),
    why: 'Restorative justice aims to <b>repair the harm</b>, encourage <b>accountability</b> and rebuild the relationship. Good actions: apologise sincerely, pay for or replace the property. Punishment focuses mainly on giving a consequence for breaking the rules.',
    hint: 'Restore = fix.' };
}

/* ---------- ELECTIONS ---------- */
const VOTERS = [
  { d: 'Maya is a Canadian citizen who is 18 years old.', ok: true, why: 'Canadian citizen + at least 18 on election day = can vote.' },
  { d: 'Leo is a Canadian citizen who is 16 years old.', ok: false, why: 'Leo is a citizen, but he is under 18.' },
  { d: 'Priya is 30, has lived in Toronto for 10 years, and is a permanent resident (not a citizen).', ok: false, why: 'You must be a <b>Canadian citizen</b>. Permanent residents cannot vote federally.' },
  { d: 'Noah is a Canadian citizen. He is 17 today, and turns 18 two days before election day.', ok: true, why: 'What matters is your age <b>on election day</b>. He will be 18 by then.' },
  { d: 'Ava is a Canadian citizen. She is 17 and turns 18 the day after the election.', ok: false, why: 'She is still 17 <b>on election day</b>, so she cannot vote yet.' },
  { d: 'Grandpa Ben is an 88-year-old Canadian citizen.', ok: true, why: 'There is no upper age limit. Citizen + 18 or older = can vote.' },
  { d: 'Sofia is a 25-year-old tourist visiting from Italy.', ok: false, why: 'She is not a Canadian citizen.' },
  { d: 'Omar became a Canadian citizen last month. He is 40.', ok: true, why: 'He is now a citizen and over 18 &mdash; he can vote.' }
];
function genVoter() {
  const v = pick(VOTERS);
  return { cat: 'A', type: 'mc', topic: 'elections', q: `<div class="scen">${v.d}</div>Can they vote in a <b>federal</b> election?`,
    choices: ['Yes', 'No'], a: v.ok ? 0 : 1,
    why: `<b>${v.ok ? 'Yes' : 'No'}.</b> ${v.why}<br><br>The rule: <b>Canadian citizen</b> + <b>at least 18 on election day</b>.`,
    hint: 'Two checks: citizen? 18 on election day?' };
}
function genHistory() {
  const items = [
    ['In what year did the federal voting age change from 21 to 18?', '1970', ['1921', '1918', '1982']],
    ['In what year was Agnes Macphail elected, the first woman in the House of Commons?', '1921', ['1970', '1867', '1982']],
    ['Who was the first woman elected to Canada\'s House of Commons?', 'Agnes Macphail', ['Mary Simon', 'Edith Dumont', 'Olivia Chow']],
    ['What is the federal voting age in Canada today?', '18', ['16', '19', '21']],
    ['Before 1970, what was the federal voting age?', '21', ['16', '18', '19']]
  ];
  const it = pick(items);
  return mcq({ cat: 'K', topic: 'elections', q: it[0], right: it[1], wrong: it[2],
    why: '<b>1921</b>: Agnes Macphail becomes the first woman elected to the House of Commons.<br><b>1970</b>: the federal voting age drops from 21 to 18.',
    hint: 'Two dates to know: 1921 and 1970.' });
}

/* ---------- ELECTORAL SYSTEMS: generated election results ---------- */
const CANDS = ['Frankie', 'Clawdeen', 'Cleo', 'Lagoona', 'Draculaura', 'Ghoulia', 'Spectra', 'Abbey', 'Operetta', 'Toralei'];
const PARTIES = ['Fang Party', 'Moonlight Party', 'Stitch Party', 'Coffin Party', 'Howl Party'];
function riding(majorityChance) {
  for (let g = 0; g < 200; g++) {
    const n = 3 + rnd(2);
    const pct = []; let left = 100;
    for (let i = 0; i < n - 1; i++) { const v = 8 + rnd(Math.max(1, Math.min(55, left - 8 * (n - i - 1)) - 7)); pct.push(v); left -= v; }
    pct.push(left);
    if (pct.some(p => p < 5)) continue;
    const sorted = pct.slice().sort((a, b) => b - a);
    if (sorted[0] === sorted[1]) continue;
    const maj = sorted[0] > 50;
    if ((Math.random() < majorityChance) !== maj) continue;
    const names = sample(CANDS, n);
    const rows = names.map((nm, i) => ({ nm, pct: pct[i], votes: pct[i] * 240 }));
    return rows;
  }
  return [{ nm: 'Frankie', pct: 41, votes: 9840 }, { nm: 'Cleo', pct: 35, votes: 8400 }, { nm: 'Ghoulia', pct: 24, votes: 5760 }];
}
function resultsTable(rows, showPct) {
  const total = rows.reduce((a, r) => a + r.votes, 0);
  return `<table class="dtable restab"><tr><th>Candidate</th><th>Votes</th>${showPct ? '<th>%</th>' : ''}</tr>` +
    rows.map(r => `<tr><td>${r.nm}</td><td>${r.votes.toLocaleString()}</td>${showPct ? `<td>${r.pct}%</td>` : ''}</tr>`).join('') +
    `<tr><td><i>Total</i></td><td><i>${total.toLocaleString()}</i></td>${showPct ? '<td></td>' : ''}</tr></table>`;
}
function genFPTP() {
  const rows = riding(0.3);
  const win = rows.slice().sort((a, b) => b.votes - a.votes)[0];
  const maj = win.pct > 50;
  return { cat: 'A', type: 'multi', topic: 'electoral',
    q: `Results in the riding of <b>${pick(['Monster Falls', 'Skull Shores', 'New Salem', 'Boo York', 'Gloom Valley'])}</b>:${resultsTable(rows, true)}`,
    parts: [
      { label: 'Under <b>First-Past-the-Post</b>, who wins the seat?', choices: rows.map(r => r.nm), a: rows.indexOf(win) },
      { label: 'Did the winner get a <b>majority</b> (more than 50%)?', choices: ['Yes', 'No'], a: maj ? 0 : 1 },
      { label: 'Under <b>runoff voting</b>, would a second round be needed?', choices: ['Yes', 'No'], a: maj ? 1 : 0 }
    ],
    why: `<b>${win.nm}</b> has the most votes (${win.pct}%), so under FPTP ${win.nm} wins &mdash; no 50% needed.<br>` +
      (maj ? `${win.nm} also has more than 50%, so even under runoff voting there is no second round.`
           : `But ${win.pct}% is <b>not</b> a majority. Under <b>runoff voting</b> there would be another round until someone has a majority.<br>` +
             `<span class="dimline">That means ${100 - win.pct}% of voters picked someone else and still "lost" &mdash; a big criticism of FPTP.</span>`),
    hint: 'FPTP is a race: the most votes wins, by any amount. Runoff needs over 50%.' };
}
function genPR() {
  for (let g = 0; g < 100; g++) {
    const seats = pick([50, 100, 200]);
    const step = seats === 50 ? 2 : 1;
    const parties = sample(PARTIES, 3 + rnd(2));
    const pct = []; let left = 100;
    for (let i = 0; i < parties.length - 1; i++) { let v = 10 + rnd(35); v -= v % step; pct.push(v); left -= v; }
    if (left < 6 || left % step) continue;
    pct.push(left);
    const i = rnd(parties.length), ans = pct[i] * seats / 100;
    return { cat: 'A', type: 'number', topic: 'electoral',
      q: `A legislature has <b>${seats} seats</b> and uses <b>Proportional Representation</b>.<br>The national vote:` +
         `<table class="dtable restab"><tr><th>Party</th><th>Share of vote</th></tr>` +
         parties.map((p, k) => `<tr><td>${p}</td><td>${pct[k]}%</td></tr>`).join('') + '</table>' +
         `How many seats should the <b>${parties[i]}</b> get?`,
      a: ans, placeholder: 'seats',
      why: `Under PR, seats match the share of the vote: <b>${pct[i]}% of ${seats} = ${ans} seats</b>.<br><br>` +
        `<span class="dimline">Under FPTP the numbers could be very different, because seats are won riding by riding.</span>`,
      hint: `Work out ${pct[i]}% of ${seats}.` };
  }
}
function genWinnerPct() {
  const rows = riding(0.3);
  const win = rows.slice().sort((a, b) => b.votes - a.votes)[0];
  const total = rows.reduce((a, r) => a + r.votes, 0);
  return { cat: 'T', type: 'number', topic: 'electoral', q: `Riding results:${resultsTable(rows, false)}What <b>percent</b> of the vote did the FPTP winner get?`,
    a: win.pct, placeholder: '%',
    why: `${win.nm}: ${win.votes.toLocaleString()} &divide; ${total.toLocaleString()} = <b>${win.pct}%</b>. ` +
      (win.pct > 50 ? 'That is a majority.' : `Not a majority, but under FPTP ${win.nm} still wins the seat.`),
    hint: 'Winner\'s votes ÷ total votes × 100.' };
}
function genSystem() {
  const items = [
    ['The candidate with the most votes in a riding wins, even with less than half.', 'First-Past-the-Post'],
    ['If no one wins a majority, voters vote again until someone does.', 'Runoff voting'],
    ['A party with 30% of the votes gets about 30% of the seats.', 'Proportional Representation'],
    ['Voters elect a local MP and the legislature is topped up so seats match the vote share.', 'Mixed Member Proportional'],
    ['The system Canada uses for federal elections today.', 'First-Past-the-Post']
  ];
  const it = pick(items);
  return mcq({ cat: 'K', topic: 'electoral', q: `Which electoral system is this?<br><i>"${it[0]}"</i>`, right: it[1],
    wrong: ['First-Past-the-Post', 'Runoff voting', 'Proportional Representation', 'Mixed Member Proportional'].filter(x => x !== it[1]),
    why: '&bull; <b>FPTP</b>: most votes wins (Canada uses this).<br>&bull; <b>Runoff</b>: keep voting until someone has a majority.<br>&bull; <b>PR</b>: seats match vote share.<br>&bull; <b>MMP</b>: local MPs + proportional seats.',
    hint: 'FPTP = race. Runoff = rematch. PR = fair slices of pie. MMP = mix of both.' });
}
