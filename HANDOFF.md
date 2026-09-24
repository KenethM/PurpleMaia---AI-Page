# Handoff log

What changed, why, and what is still open — one entry per working session.

Written for whoever picks this page up next: a teammate taking over, a reviewer
who needs context before reading a diff, or you in three months. The git log says
*what* changed; this says *why*, and what was deliberately left undone.

**How to use it**

- Newest entry at the top, directly under this line.
- Copy the template at the bottom of the file to start an entry.
- Keep **Open / next** honest. It is the only part anyone reads under pressure.
- Note anything held back on purpose. A missing feature and a deliberately
  withheld one look identical from the outside, and the difference matters.

---

## 2026-09-24 — Accuracy pass on the practice activities

**Who:** Keneth, with Claude Code
**State:** working tree only, not committed
**Files:** `content.js`, `assets/app.js`, `assets/styles.css`, `README.md`

### Why

A review of the six activities against what they actually claim. This page's whole
value is being correct, so a demo that teaches the wrong mechanism is worse than no
demo. One was.

### What changed

**The token chopper was teaching the wrong cause.** It split purely on word length,
so `Aloha kākou` came out as 2 tokens against `Hello everyone` at 3 — ʻōlelo Hawaiʻi
looked *cheaper* than English, the exact opposite of the point, on the widget that
bridges Module 2 to the entire bias argument.

Real tokenizers do not split on length, they split on **frequency**: the vocabulary
is built from the training data, so a word that appeared constantly gets one token
and a word the data barely contains has no entry and shatters. The chopper now models
that — a ~350-word vocabulary, suffix peeling, and non-ASCII characters (ʻokina,
kahakō are several bytes each) coming away on their own. English now runs 4.5–5.8
chars/token against 2.1–2.6 for Hawaiian, which is both the right direction and
roughly the right magnitude.

**Invent a citation → Spot the real one.** The old version only ever showed
fabrications, so "you cannot tell a real citation from an invented one by looking"
was something the card asserted and the reader took on trust. It now shows one real
paper — the ones actually cited in the deck — among three it fabricates on the spot,
identically formatted, and asks which is real. The reveal links to the real paper so
it can be checked. Proven instead of claimed, and it reuses citations already in the
repo.

**How much did it read? shows all six rows at once.** It was a click-through
slideshow that asked the reader to hold five numbers in their head and then take the
conclusion on faith. The pattern is the finding, so the pattern is now visible in one
view. The summary line is computed from the data rather than hard-coded to the first
and last rows, which it previously was — correct only by accident of ordering, and
silently wrong the moment anyone inserted a question.

**Demos are separated from quizzes.** Two labelled groups: **Try it** (token chopper,
roll the dice, spot the real one, how much did it read) and **Check yourself** (term
match, would you send it). They teach differently and were sitting in one grid as if
they were the same kind of thing.

### Decisions worth knowing

- **Chart colours are not the UI colours.** `--accent` and `--coral` fail
  colourblind separation and the chroma floor when used as a data pair. The two
  series use `--viz-read` / `--viz-sure`, which pass all six checks of the dataviz
  validator in both light and dark. Re-run the validator rather than eyeballing any
  change — the command is in the README.
- The corpus table carries a legend, per-row value labels and a screen-reader
  caption, so series identity is never colour-alone.
- The chopper's vocabulary is a few hundred words against a real one's ~100,000.
  The card says so. It models the right *cause*, which is the part that matters.

### How it was tested

143 assertions, up from 125, run four times to check for shuffle flakiness. The new
ones assert the thing that was actually broken: that Hawaiian costs more tokens per
character than English and by a substantial margin, that a five-letter word in the
vocabulary stays whole while a five-letter word outside it shatters, that every
citation round has exactly one real paper with no duplicate titles, that no real
researcher is ever credited with a fabrication, and that the corpus summary matches
the computed min and max rather than the first and last rows.

One old test had encoded the wrong model — "a 5-letter word stays whole" was a
property of length-based splitting. It now asserts vocabulary membership instead.

### Open / next

- [ ] Look at all six cards in a browser, both themes. The corpus table and the
      reference list are new layouts and the chart colours have never been seen.
- [ ] Commit.

---

## 2026-09-24 — Two more mechanism demos: Bias and Hallucinations

**Who:** Keneth, with Claude Code
**State:** working tree only, not committed
**Files:** `content.js`, `index.html`, `assets/app.js`, `assets/styles.css`, `README.md`

### Why

Token chopper and Roll the dice landed well — the ones you manipulate and watch
behave, rather than the ones that quiz you. Bias and Hallucinations were the two
heaviest ideas in Module 3 with no demo of their own.

### What changed

**Invent a citation** (`type: "cite"`, Module 3 · Hallucinations). Pick a claim,
press a button, and a reference assembles itself — author, title, journal, year,
volume, page range — each field highlighted as a plausible pick. Press again and the
same claim yields a *different* source. That is the lesson: it is Roll the dice
pointed at something shaped like a fact, and nothing was ever looked up.

**How much did it read?** (`type: "corpus"`, Module 2 training data → Module 3 bias).
Six questions, two meters: relevant material the model read, and how certain it
sounds answering. Work down from "draft a cover letter in English" to "name the
moʻolelo attached to a specific ahupuaʻa" and coverage falls 96% → 2% while
confidence drops six points. Once every question has been clicked, the widget says
the gap out loud. Bias framed as a property of what it read, not of malice.

**Quiz options are now shuffled at render time.** Every one of the 27 lesson questions
and all 6 scenarios had the correct answer at position A — 100%, not bad luck. The page
was passable by always clicking the first option, which hollows out the whole point of a
check. `renderQuiz` now reorders each question's options and remaps `answer` to follow,
so it is fixed for every future quiz without anyone having to scatter answers by hand.
Measured distribution across 228 renders: 31% / 37% / 32%. A question can opt out with
`fixed: true` if its options only make sense in order.

Worth knowing: three tests were selecting options by the authored index and so were
passing on luck once shuffling landed. They now match on option text. If you write a
test that touches a quiz, never select by index.

### Decisions worth knowing

- **Every fabricated citation is stamped "Invented" in the markup**, not just in the
  surrounding copy, so a screenshot cannot pass as a real reference. Keep that stamp.
  Author surnames are generic on purpose — the widget attributes invented work to
  whoever it picks, so no real researchers go in that list.
- **The corpus numbers are illustrative and the card says so.** No one publishes a
  frontier model's training-data breakdown. The direction is not in dispute, and the
  direction is the entire point.
- Both are mechanism demos, not quizzes. That was the ask — the quiz engine already
  covers Bias and Hallucinations through the lesson checks and "Would you send it?".

### How it was tested

119 assertions, up from 99. The 20 new ones cover citation generation and its stamp,
that re-rolling yields different sources, that an author is never credited twice in
one reference, meter values tracking the data, and the punchline appearing only after
every question has been seen.

Still not visually verified — same caveat as the entry below.

### Open / next

- [ ] Look at both new cards in a browser, desktop and phone.
- [ ] Commit. The entry below is already committed and pushed.

---

## 2026-09-24 — Interactive elements, audience modes, per-lesson quizzes

**Who:** Keneth, with Claude Code
**Branch:** `main`, on top of `5f5336d`
**State:** working tree modified, **not committed, not pushed**
**Files:** `content.js`, `assets/app.js`, `assets/styles.css`, `index.html`, `README.md` — +1549 / −79

### Why

Slack notes from Samantha, carrying feedback from Joe and Donovan:

- preference for interactive elements over a lecture format — possibly a "games" tab
- mini quizzes / check-your-understanding sections
- Donovan's framing: this should be a **knowledge base** for all our AI materials,
  which is what the page already is — so flesh out the content
- two primary audiences: **internal staff onboarding** and **external partners**
- the page should be refactorable and repurposable by context: staff onboarding,
  partner education, community workshops, kupuna outreach
- Samantha is animating short-form videos from the lesson scripts

### What changed

**1. Audience modes** — `content.js` §3 `audiences`, plus a switcher bar under the header

The same knowledge base, re-skinned per room. An audience inherits everything in
`event` and overrides only what it names: badge, tagline, intro, date/time/location,
hero facts, the three "where should I start?" cards, and its own run of show.

The rule held throughout: **nothing is ever hidden.** An audience's `feature` list
sorts those lessons to the front, flags them "Start here", and adds one filter chip.
All 19 lessons stay in the grid and in search in every mode. Repurposing should not
mean a partner cannot see what staff see.

Each mode is a shareable link — `?for=partners` — with a **Copy link to this version**
button. A link beats whatever that browser last chose, so a link always lands where
you meant it to.

**2. Check your understanding** — `content.js` §6 `quizzes`

27 questions across all 19 lessons, in the lesson dialog under the takeaways. Every
answer shows a `why` — right or wrong — written to teach rather than to say "correct".
Ace a lesson and its card gets a **Checked ✓** flag. Scores live in `localStorage`
beside the progress ring; "Reset progress" now clears both.

**3. Practice section** — `content.js` §7 `practice`, own nav item

| | |
|---|---|
| **Token chopper** | Type anything, watch it break into chunks, live counts. Seeded with a Hawaiian sentence so the token climb is the first thing you see. |
| **Roll the dice** | Pick the next word, then roll. Temperature slider reshapes the odds live; "Roll 20 ×" tallies them. |
| **Term match** | Six definitions → name the term. Generated from the glossary, so it reshuffles each run and grows as terms are added. |
| **Would you send it?** | Six judgment calls — the funder update, the cultural protocol question, the too-specific citation. |

**4. Video prep** — a "Purple Maiʻa originals" resource group, and the placeholder now
names the exact step: drop the file in `assets/`, set `video: "file:assets/<name>.mp4"`,
placeholder disappears. Nothing else to change as Samantha's animations land.

**5. Fixed a live 404, and shipped the deck** — `assets/llm-nlp-101.pdf` had been linked
from "For facilitators" since `5f5336d` without ever existing, so every click on
"Slide deck (PDF)" 404'd. The deck has now been exported and committed: 25 slides, 11 MB,
fonts embedded, well under GitHub's 50 MB warning.

Along the way, resources gained `pending: true` — an item announced but not linked, rendered
dashed and badged "Not up yet" instead of pointing at a file that is not there. Nothing uses
it right now; it is there for the next thing that gets announced early. The Resources section
and the lesson dialog now share one renderer, so it behaves identically in both.

A test sweeps every repo-local link and in-page anchor on the rendered page and fails if any
of them do not resolve. That is the check that would have caught the original 404 in `5f5336d`.

**6. Supporting** — three new FAQ entries (switcher, quiz privacy, where the videos are);
section backgrounds rebalanced for the new section; nav tightened between 761–1040px,
where seven items no longer fit.

### Decisions worth knowing

- **`content.js` stays the only file you edit** for content. Audiences, quizzes and
  activity copy all live there, numbered and commented, as before.
- **Practice activities are not pure data.** Each entry's `type` maps to an engine in
  `app.js`, so a genuinely new *kind* of activity needs code. `scenarios` is the cheap
  one to extend — adding situations to "Would you send it?" is pure content.
- **Nothing is uploaded.** Quiz scores, progress and audience choice are all
  `localStorage`, same as progress always was. No accounts, no analytics.
- **The token chopper is an approximation** of byte-pair tokenization, on purpose. It
  exists to make the idea land and links out to Tiktokenizer for the real thing.
- **Handouts belong in the repo, not on a hosted deck link.** A Google Slides or Canva
  link looks fine to whoever owns it and can 403 for everyone else, silently. This page
  is public with no login, has no external dependencies, and is meant to be forked —
  a PDF forks, a Drive link forks into a dead link. Reasoning is in the README.
- One quiz component serves three places (lesson dialog, Term match, Would you send it?),
  so a fix to one fixes all three.

### Held back deliberately

**Community workshop** and **Kupuna outreach** are written, styled and tested, and both
carry `draft: true` in `content.js`. They are **fully dark on the live page**: no chip,
`?for=kupuna` falls back to the default and leaves no trace in the URL, and a stale saved
choice in a browser falls back too. The copy stays in `content.js` where it can be read
and reviewed.

Why: those framings need a read from people who actually run those rooms. They were
written carefully — plain words, no talking down, kuleana front and centre — but that is
a judgment call, not lived practice, and the kupuna one especially is not mine to ship
unreviewed.

Publishing is deleting one line per audience. A test already boots the page with those
lines stripped, so both versions are known to work the day the review clears.

### How it was tested

92 headless assertions over two jsdom suites — rendering, every activity, both quiz
paths, audience switching, deep links, storage, reset, the held-back modes being
unreachable, and the held-back modes working once the flag comes off. All green.

**Not visually verified.** The CSS is reasoned, not looked at. The audience bar and the
practice cards are new layouts and deserve a desktop and phone pass before pushing.

### Open / next

- [ ] **Look at it in a browser** — desktop and phone. Audience bar, practice cards.
- [ ] **Commit and push** the live state. Nothing is committed yet.
- [ ] **Cultural review** of the two held-back audiences, then delete `draft: true`.
- [ ] *Parked, not urgent* — p.4 of the deck reads "Where LLM's play a roll during your
      day" ("roll" → "role", and "LLM's" → "LLMs" in the title and heading). Cosmetic,
      known, deliberately left for a later Canva pass. p.19 and p.20 were fixed.
- [ ] **Decide on the Canva link.** The deck source is Canva design `DAHVk94LbFA`. The URL
      handy for editing is an `/edit` link and must not go on a public page — use
      Share → "Anyone with the link" → **View**, and add that as its own item under
      "For facilitators" labelled as the editable source. Not added yet, deliberately.
- [ ] Purple Maiʻa animations as they land — set `video:` per lesson.
- [ ] Possible next: more scenarios in "Would you send it?", and a 200-level follow-up
      covering fine-tuning, RLHF, agents, data sovereignty — deliberately out of scope
      for this 101 page.

---

## Template — copy this to start an entry

```markdown
## YYYY-MM-DD — Short title

**Who:**
**Branch:** `main`, on top of `<short sha>`
**State:** committed / pushed / working tree only
**Files:**

### Why
Where the request came from — the Slack thread, the meeting, the person.

### What changed
The substance. Enough that a reader does not have to open the diff.

### Decisions worth knowing
Choices a future editor could accidentally undo. Why it is built this way.

### Held back deliberately
Anything written but not shipped, and what unblocks it. Leave the section out
if there is nothing.

### How it was tested
What was checked, and — just as useful — what was not.

### Open / next
- [ ] The honest list.
```
