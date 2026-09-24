# LLM/NLP 101 — Purple Maiʻa staff learning page

A single static page for hosting workshop material: lessons, video recordings,
a prompt library, a glossary, an agenda and links — plus a quiz under every
lesson, six hands-on activities, and an audience switcher that re-skins the
whole page depending on who is in the room. No build step, no framework, no
dependencies. Edit one file, push, done.

```
index.html          the page structure (you rarely need to touch this)
content.js          ← EVERYTHING YOU EDIT LIVES HERE
assets/styles.css   colours, type, layout
assets/app.js       rendering, filtering, search, progress, quizzes, activities
assets/favicon.svg  the little icon in the browser tab
.nojekyll           tells GitHub Pages to serve the files as-is
HANDOFF.md          what changed each session, and what is still open
```

This README is the reference — how things work and how to edit them.
[`HANDOFF.md`](HANDOFF.md) is the running log: what changed in each work session,
why, and what was left open. Start there if you are picking the page up mid-stream.

---

## 1. Put it on GitHub Pages

The code is pushed to `github.com/KenethM/PurpleMaia---AI-Page`. The one
remaining step is a setting only a repo admin can flip:

**Settings → Pages → Source: Deploy from a branch → Branch: `main`,
folder: `/ (root)` → Save.**

A minute later it is live at:

`https://kenethm.github.io/PurpleMaia---AI-Page/`

Every `git push` after that republishes automatically — usually within a minute.

> **A custom domain?** Settings → Pages → Custom domain, then add a `CNAME` file
> here containing just the domain. Point a CNAME DNS record at
> `kenethm.github.io` and tick "Enforce HTTPS" once the certificate is issued.

### Being findable

Three files carry the search-engine and link-preview setup:

| File | What it does |
|---|---|
| `robots.txt` | Tells crawlers everything is open, and points at the sitemap |
| `sitemap.xml` | The one URL, for Google Search Console |
| `assets/social.png` | 1200×630 card shown when the link is pasted anywhere |

The `<head>` of `index.html` holds the canonical URL, Open Graph / Twitter tags,
and JSON-LD structured data describing the workshop as a `Course`.

**If the URL ever changes** (custom domain, or a move to a Purple Maiʻa org),
find-and-replace `https://kenethm.github.io/PurpleMaia---AI-Page/` across
`index.html`, `robots.txt` and `sitemap.xml`. Nothing else is URL-dependent.

To get indexed rather than waiting: add the site at
[search.google.com/search-console](https://search.google.com/search-console),
verify it, and submit `sitemap.xml`.

**To preview locally**, just double-click `index.html`. It works straight off the
file system — nothing needs a server, so what you see locally is what ships.

---

## 2. Edit the content

Open `content.js`. It is one big object with numbered sections, and everything
on the page is generated from it. Save the file, refresh the browser, see the change.

### Adding a lesson

Add an entry to the `lessons` array:

```js
{
  id: "l11",                        // must be unique — used for progress tracking
  title: "Your lesson title",
  track: "practice",                // must match an id in the `tracks` array
  level: "Applied",                 // free text, shown as a small tag
  duration: "14 min",
  summary: "One or two sentences, shown on the card.",
  video: "youtube:dQw4w9WgXcQ",     // see below
  slides: "https://...",            // optional — adds an "Open slides" button
  takeaways: [
    "Key point one.",
    "Key point two."
  ],
  resources: [
    { label: "Worksheet (PDF)", url: "assets/worksheet.pdf" }
  ]
}
```

### Adding videos

The `video` field takes a prefix:

| What you have | What to write |
|---|---|
| A YouTube video | `"youtube:dQw4w9WgXcQ"` — the ID is the bit after `v=` in the URL |
| A Vimeo video | `"vimeo:123456789"` |
| An MP4 in the repo | `"file:assets/lesson-1.mp4"` |
| Nothing yet | `""` — shows a tidy "coming soon" placeholder |

YouTube videos use `youtube-nocookie.com` and only load **after** someone clicks
play, so no tracking scripts run for people who never watch. The page is fast either way.

**On MP4s:** GitHub warns above 50 MB per file and hard-blocks at 100 MB, and Pages
serves a 1 GB site with a soft 100 GB/month bandwidth limit. For anything longer than
a short clip, host on YouTube or Vimeo and link it rather than committing the file.

### Adding handouts

Drop the PDF into `assets/` and reference it as `assets/your-file.pdf` in a
lesson's `resources` or in the `resources` section near the bottom of `content.js`.
Any `url` starting with `http` opens in a new tab; anything else stays in the page.

**Announcing something before it exists.** Add `pending: true` to a resource and it
renders as a dashed, unclickable row badged "Not up yet" instead of a link that 404s.
Delete the flag when the file lands.

```js
{ label: "Slide deck (PDF)", url: "assets/llm-nlp-101.pdf", pending: true, desc: "…" }
```

**Prefer a file in the repo over a link to a hosted deck.** A Google Slides or Canva
link looks fine to you because you are signed in as its owner; for a partner or a
community member with no account it can 403, and you will never see it happen. This
page is public with no login by design, it works off the filesystem with no external
dependencies, and the README tells people to fork it — a PDF forks, a link to your
Drive forks into a dead link. If you want the editable deck available too, add it as a
separate clearly-labelled item, and host it on a Purple Maiʻa account, not a personal one.

### Adding a check-your-understanding quiz

Section 6 of `content.js` is a `quizzes` object keyed by lesson id. A lesson with
no entry simply shows no quiz — nothing breaks.

```js
"m2-tokenization": [
  {
    q: "Why is it unreliable at counting the letters in a word?",
    options: [
      "It works with token chunks, not individual letters",   // answer: 0
      "It is bad at arithmetic",
      "Counting is blocked for safety reasons"
    ],
    answer: 0,                       // index of the correct option
    why: "Same reason it struggles to reverse a word or rhyme on spelling."
  }
]
```

Two to four options each. The `why` is shown whether they got it right or wrong,
so write it to teach rather than to say "correct". A lesson answered perfectly
gets a small **Checked ✓** flag on its card. Scores live in `localStorage`
alongside the progress ring — this browser only, never uploaded, and the
"Reset progress" button clears both.

**Write the correct option first if that is easiest — the page shuffles them.**
Options are reordered at render time and `answer` is remapped to follow, so the
right answer lands in a different position on every visit. You never have to
scatter them by hand, and you cannot accidentally ship a quiz that is passable by
always clicking A. If a question's options only make sense in a fixed order — a
sequence of steps, or an "all of the above" — add `fixed: true` to that question
and it keeps the order you wrote.

This applies to the lesson quizzes, Term match and "Would you send it?" alike,
since all three run through the same component.

### Re-skinning the page for a different room

Section 3 is `audiences`. Each one inherits everything in `event` and overrides
only what it names, so a new audience is usually twenty lines:

```js
{
  id: "funders",
  label: "Funder briefing",          // the chip at the top of the page
  blurb: "One line under the chips explaining who this version is for.",
  badge: "For funders",              // any of: badge, tagline, intro,
  tagline: "…",                      //   date, time, location, facts,
  date: "",                          //   pathways, agenda, ctaPrimary/Secondary
  agenda: [ /* a different run of show */ ],
  featureLabel: "Funder set",
  feature: ["m1-map", "m3-bias"]     // lesson ids to lead with
}
```

- `""` blanks a field on purpose; leaving it out inherits from `event`.
- **`feature` never hides anything.** It sorts those lessons to the front, flags
  them, and adds one extra filter chip. All 19 stay in the grid and in search.
- The first audience in the array is the default.
- Switching writes `?for=<id>` into the address bar, and **Copy link to this
  version** hands you that link. A link beats whatever the visitor last chose,
  so `…/?for=partners` always opens the partner version.
- Delete the whole `audiences` array and the switcher disappears; the page falls
  back to plain `event` content.

#### Holding a version back

`draft: true` on an audience keeps its copy in `content.js` — readable,
reviewable, diffable — while making it unreachable from the live page. No chip,
and `?for=<that id>` falls back to the default rather than opening it. A stale
choice saved in someone's browser falls back too.

```js
{
  id: "kupuna",
  draft: true,        // ← delete this line to publish
  label: "Kupuna outreach",
  …
}
```

**Community workshop and Kupuna outreach are both held back right now**,
pending a read from people who run those rooms. Staff onboarding and Partner
education are live. When a review clears, delete the one line.

### The practice activities

Section 7 is `practice`. Unlike everything else in `content.js`, these are not
pure data — each entry's `type` names an engine in `assets/app.js`, so a genuinely
new kind of activity needs code as well as content.

| `type` | What it is | What it needs |
|---|---|---|
| `tokens` | Live token-chopping sandbox | `sample` starting text |
| `predict` | Next-token dice roll with a temperature slider | `rounds: [{ stem, options: [{ word, p }] }]` |
| `cite` | Builds a fabricated citation field by field | `claims: [{ claim, authors, titles, journals }]` |
| `corpus` | Training-coverage vs stated-confidence meters | `questions: [{ q, coverage, confidence, verdict }]` |
| `match` | Definition → term quiz, built from the glossary | `rounds: 6` |
| `scenarios` | Judgment calls | `items`, same shape as a quiz above |

**On `cite`:** it fabricates academic references on purpose, to show that a
specific-sounding citation costs the model nothing to invent. Every output is
stamped "Invented" in the markup itself, not just in the surrounding copy, so a
screenshot can never be mistaken for a real reference. Keep that stamp if you
edit the engine. Use generic surnames in `authors` and avoid naming real
researchers — the widget attributes work to whoever it picks.

**On `corpus`:** the `coverage` and `confidence` numbers are illustrative, not
measured, and the card says so. Nobody publishes an exact breakdown of a frontier
model's training data. What is not in dispute is the direction, which is the
point the activity makes: coverage collapses, confidence does not follow it down.

`scenarios` is the cheap one to extend: it takes the same `{ q, options, answer, why }`
objects as the lesson quizzes, so adding situations to "Would you send it?" is
pure content. The token chopper is an approximation of byte-pair tokenization,
deliberately — it is there to make the idea land, and it links out to
Tiktokenizer for the real thing.

---

## 3. Change how it looks

Everything visual is a token at the top of `assets/styles.css`. To rebrand,
change these two blocks (light values in `:root`, dark ones in the two dark-theme
blocks below it):

```css
--accent:       #0d7c72;   /* buttons, links, highlights */
--accent-soft:  #e2f2f0;   /* tinted backgrounds          */
--accent-ink:   #ffffff;   /* text sitting on the accent   */
```

Fonts are set in `--font-display` (headings) and `--font-body` (everything else).
They load from Google Fonts in `index.html`; delete that `<link>` and the system
font stack takes over cleanly.

Don't forget `assets/favicon.svg` (one hex value) and the `<title>` and
`<meta name="description">` at the top of `index.html`.

---

## 4. What the page does

- **Audience switcher** — the same knowledge base re-skinned per room. Framing, run of show and starting lessons change; no lesson is ever hidden. Shareable as `?for=<id>`. Live: staff onboarding and partner education. Written but held back behind `draft: true`: community workshop and kupuna outreach.
- **Check your understanding** — a short quiz under each lesson, with an explanation on every answer, right or wrong.
- **Practice activities** — six playable widgets: token chopper, next-token dice roll, citation fabricator, training-coverage meters, term match, and a "would you send it?" judgment round.
- **Dark and light themes** — follows the system setting, with a manual toggle that sticks.
- **Search everything** — press `/` or `Cmd/Ctrl+K`. Searches lessons, practice activities, prompts, glossary terms, FAQs and agenda items at once.
- **Track filters and keyword filtering** on the lessons grid.
- **Progress tracking** — attendees tick off lessons and see a progress ring. Stored in their own browser via `localStorage`; nothing is uploaded and there is no account. Clearing site data resets it.
- **Copy buttons** on every prompt.
- **Deep links** — `yourpage.com/#lesson-l3` opens lesson 3 directly. Handy for pasting into a chat during the session.
- **Keyboard and screen-reader friendly** — skip link, focus rings, real buttons, labelled regions.
- **Prints cleanly** — navigation and decoration drop out, cards avoid page breaks.
- **Responsive** down to small phones.

## 5. Before you share the link

- [x] Section 1 of `content.js` carries the real event (LLM/NLP 101, First Tuesday, Oct 6 2026).
- [x] `<title>`, `<meta name="description">` and the JSON-LD in `index.html` match.
- [x] `assets/social.png` is a 1200×630 card for link previews.
- [x] The footer's "Source on GitHub" link points at this repo.
- [x] Reference videos linked and embedded where the deck cites them (three YouTube, one Science Learning Hub).
- [ ] Add Purple Maiʻa's own module videos as they come out of production — set `video: "file:assets/<name>.mp4"` on the lesson; until then it shows a “coming soon” placeholder.
- [x] Every lesson has a check-your-understanding quiz (section 6 of `content.js`).
- [x] Walk the live audience versions before sending a link out — `?for=partners` and the default.
- [ ] **Cultural review of the two held-back versions** — Community workshop and Kupuna outreach are written and tested but carry `draft: true`, so nothing on the live site can reach them. Once someone who runs those rooms has read the copy, delete that one line per audience.
- [x] Every `url: "#"` replaced; all 19 lessons carry resources.
- [x] **The deck is in** — `assets/llm-nlp-101.pdf`, 25 slides, 11 MB, linked from "For facilitators".
- [ ] Three text fixes in the deck itself, in Canva, then re-export over the same filename (see `HANDOFF.md`). Nothing in the repo changes.

### Content structure

`content.js` follows the three modules of the LLM/NLP 101 deck:

| Track id | Module | Lessons | Self-paced |
|---|---|---|---|
| `overview` | 1 — Overview | 2 | 25 min |
| `how-it-works` | 2 — How an LLM works | 10 | 46 min |
| `using-llms` | 3 — Using LLMs well | 7 | 24 min |

**Two different clocks, deliberately.** A lesson's `duration` is self-paced time
and includes any video on the card, which is why Module 1 reads 25 min against a
10-12 min live budget. The `agenda` tags carry the live run; you would not play
the full Crash Course video during the session. Both numbers show in the hero.

Adding a lesson means adding to `lessons` with one of those three `track` values.
If you change the lesson count or durations, update the `facts` array in section 1
so the hero numbers stay honest — and in any audience that overrides `facts`.

The numbered sections of `content.js`, in order:

| # | Section | What it drives |
|---|---|---|
| 1 | `event` | Hero copy, the hero facts, both CTAs |
| 2 | `pathways` | The three "where should I start?" cards |
| 3 | `audiences` | The switcher, and every per-room override |
| 4 | `tracks` | The filter chips |
| 5 | `lessons` | The grid and the lesson dialog |
| 6 | `quizzes` | Check your understanding, keyed by lesson id |
| 7 | `practice` | The four activities |
| 8 | `agenda` | Run of show |
| 9 | `prompts` | Prompt library |
| 10 | `glossary` | Glossary, and the Term match activity |
| 11 | `faq` | FAQ |
| 12 | `resources` | Downloads & links |
| 13 | `footer` | Footer text and links |

---

## Licence

Do what you like with it. If you run your own version of the session, the
materials are meant to be forked.
