# Monster Chem

A self-contained revision app for the **SNC2D (Grade 10 Academic Science) chemistry unit**.
Open `index.html` in any browser — it runs entirely offline, needs no install,
no build step and no internet connection.

**Live version:** https://eladhog.github.io/Sience-Test-Oct10-2026/

---

## What it covers

Scoped to the chemistry unit only — not the full SNC2D course:

- Reaction types — synthesis, decomposition, single and double displacement, combustion
- Predicting products
- Balancing equations
- Ionic vs molecular compounds, IUPAC naming, formulas from names
- Counting atoms through brackets, subscripts and coefficients
- The Activity Series of Metals
- Acids and bases, litmus tests, neutralization
- The pH scale and its logarithmic arithmetic
- Word equations to balanced equations with states of matter

## Modes

| Mode | What it is |
|---|---|
| **Quick Lab** | 10 random questions, about five minutes |
| **Mistake Monsters** | 12 questions weighted toward your weakest topics |
| **Dress Rehearsal** | A full 63-mark paper in the real test's shape: K22 / T16 / C13 / A12 |
| **Marathon** | 30 questions in one run |
| **Topic training** | Drill any single topic |
| **Cheat Sheet** | Activity Series, polyatomic ions, prefixes, core rules |

## How the questions work

Most questions are **generated at runtime** rather than drawn from a fixed list,
so answer positions can't be memorised. The combination space covers:

- 598 valid ionic compounds (criss-cross from 26 cations × 23 anions, including multivalent metals)
- 36 molecular compounds with prefix naming
- 30 balancing equations
- 27 classifiable reactions
- Every metal pairing on the Activity Series
- Randomised pH values and acidity factors

Alongside these sit 25 hand-written questions covering concepts and written answers.

### Correctness

The chemistry is verified programmatically rather than by eye. An independent
formula parser confirms that:

- all 30 balancing equations and all 27 reaction equations are genuinely balanced
- every declared atom count matches the parsed formula
- all 598 generated ionic formulas are charge-neutral with correct bracketing

## Design

Built for short, low-friction study sessions:

- One question per screen — no scrolling wall of questions
- Immediate feedback that explains the reasoning, never just "wrong"
- A hint available on every question, so being stuck is never a dead end
- No timer outside Dress Rehearsal, and that one counts up rather than down
- Visible progress dots so the end of a session is always in sight
- A brain-break prompt every 10 questions on longer runs
- **Focus mode** hides the streak and score when the numbers add pressure
- Keyboard driven: `1`–`4` to answer, `Enter` to check and continue, `H` for a hint

Progress is saved to the browser's local storage.

## Marking

Multiple choice, numeric, balancing and naming questions are marked automatically.

Written-answer questions are **self-marked**: you write your answer, then compare
it against a model answer and grade yourself. Auto-grading prose would teach the
wrong lesson; comparing your own writing to a strong answer is the skill being practised.

Spelling slips are forgiven with a note. Real chemistry distinctions are not —
sulfate/sulfite, nitrate/nitrite and iron(II)/iron(III) are always marked wrong,
because they are on the real test.

## Files

```
index.html      page shell
styles.css      styling
chem.js         formula formatting, ion tables, naming, Activity Series
generators.js   runtime question generators
bank.js         hand-written questions and topic registry
app.js          quiz engine, grading, scoring, UI
```

No dependencies, no package manager, no build.
