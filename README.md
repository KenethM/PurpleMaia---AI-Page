# Artificial Intelligence 101 — Purple Maiʻa staff learning page

A single static page for hosting workshop material: lessons, video recordings,
a prompt library, a glossary, an agenda and links — plus a quiz under every
lesson, seven hands-on activities, and three questions up top that point a
first-time visitor at the right place to start. No build step, no framework, no
dependencies. Edit one file, push, done.

```
index.html          the page structure (you rarely need to touch this)
content.js          ← EVERYTHING YOU EDIT LIVES HERE
assets/styles.css   colours, type, layout
assets/app.js       rendering, the module pages and routing, search, progress, quizzes, activities
assets/favicon.svg  the little icon in the browser tab
assets/stamp.png    the ʻohe kāpala texture in the page margins (a CSS mask)
assets/pm-*.png     Purple Maiʻa mark and lockup, each with a -white variant
Dockerfile          Dokku deploy — nginx, no build step (see section 1)
deploy/nginx.conf   gzip, cache headers and try_files for that container
tools/              generators: social card, QR code — re-run after a rebrand
assets/qr*.png|svg  QR to this page, plain and as a projectable slide
.nojekyll           tells GitHub Pages to serve the files as-is
HANDOFF.md          what changed each session, and what is still open
```

This README is the reference — how things work and how to edit them.
[`HANDOFF.md`](HANDOFF.md) is the running log: what changed in each work session,
why, and what was left open. Start there if you are picking the page up mid-stream.

### Two editions, one set of words

There are two versions of this page and they share a single source of content.

| | Branch | Who it is for |
|---|---|---|
| **Artificial Intelligence 101** | `main` | Purple Maiʻa staff and partners. The full thing. |
| **Intro to AI** | `community-hub` | Anyone. The same topics, much shallower. |

`community-hub` is `main` plus **one file's worth of difference**: its own
`index.html`, which changes the title, the social preview, the pre-launch meta
and adds one `<script>` tag. That tag loads [`community.js`](community.js), an
*overlay*. It does not copy `content.js` — it loads after it and reshapes it in
memory: shortening each article section to its opening block, swapping the hero
copy, cutting the prompt list, replacing the FAQ.

**So every correction goes in `content.js` on `main`, once.** A fixed citation, a
reworded takeaway, a new video — all of it reaches the community edition by
merging `main` into `community-hub`, because the sentence only ever existed in
one place. Nothing on the community page is written anywhere but `content.js`.

```
git checkout community-hub
git merge main          # this should be boring. If it is not, see below
```

The one thing that merge must never take with it is `community-hub`'s
`index.html` — its title, its `noindex`, its `<script src="community.js">`. If a
merge ever flattens those, put that file back and commit; nothing else on the
branch is its own.

`main` also ships `community.js` without loading it. That is deliberate: deleting
it from `main` would carry the deletion down into `community-hub` on the next
merge and take the community edition apart.

---

## 1. Put it on GitHub Pages

The code is pushed to `github.com/KenethM/PurpleMaia---AI-Page`. The one
remaining step is a setting only a repo admin can flip:

**Settings → Pages → Source: Deploy from a branch → Branch: `main`,
folder: `/ (root)` → Save.**

A minute later it is live at:

`https://kenethm.github.io/PurpleMaia---AI-Page/`

Every `git push` after that republishes automatically — usually within a minute.

### It also runs on Purple Maiʻa's own box

`dokku-pmf-sandbox.westus2.cloudapp.azure.com` is the PMF Dokku VM. You do not
run a local `dokku` binary — every command is an ssh call to that host, and your
public key has to be on it first (ask David or Jaden). Check you are already on:

```
ssh dokku@dokku-pmf-sandbox.westus2.cloudapp.azure.com apps:list
```

Dokku's global domain is `sandbox.purplemaia.org` and `*.sandbox.purplemaia.org`
is a wildcard pointing straight at the VM, so **an app is reachable the moment it
is created — no DNS request needed.** An app called `ai-page` answers on
`ai-page.sandbox.purplemaia.org`, and **that is the canonical URL** — every
absolute reference on the page points at it. The Pages copy serves the same
`index.html`, so it self-identifies as a duplicate rather than competing in
search. One file, correct on both hosts.

A bare `purplemaia.org` subdomain is a separate, manual DNS record; `bill-tracker`
has one alongside its sandbox vhost. That is the route to something like
`ai.purplemaia.org`, and it needs David.

Dokku auto-detects the `Dockerfile` and skips buildpacks. There is no build step —
nginx just serves the repo, which is what GitHub Pages does too.

```
H=dokku@dokku-pmf-sandbox.westus2.cloudapp.azure.com

ssh $H apps:create ai-page
git remote add dokku $H:ai-page
git push dokku main

ssh $H letsencrypt:enable ai-page      # HTTPS once it is answering
ssh $H domains:add ai-page ai.purplemaia.org   # later, after David adds the DNS
```

`.dockerignore` keeps `.git` and the internal Markdown out of the image, so
`HANDOFF.md` is not sitting in a public web root. Build and check it locally
before pushing anything:

```
docker build -t ai-page . && docker run --rm -p 8899:80 ai-page
```

> **A custom domain?** Settings → Pages → Custom domain, then add a `CNAME` file
> here containing just the domain. Point a CNAME DNS record at
> `kenethm.github.io` and tick "Enforce HTTPS" once the certificate is issued.

### The QR code

`assets/qr-slide.png` is a 16:9 card to drop straight into the deck — people
scan it and open this page on their own phone. `assets/qr.png` is the code alone
with the mark in the middle, and `assets/qr.svg` is plain vector for print at any
size. All three are listed under Downloads on the page itself.

They encode the canonical URL, so **they have to be regenerated if that URL ever
moves** — a QR is the one asset that cannot be redirected once it is printed on
something. Change `SITE_URL` in `tools/make-qr.js` and re-run it; it prints the
two Chrome commands for the PNGs.

Error correction is level H, 30% recoverable, which is what buys room for the
logo in the middle without breaking the read. **Always rescan after changing
anything** — `tools/check-qr.js` round-trips the PNGs back to text and fails
loudly if a code has stopped being readable:

```
node tools/check-qr.js assets/qr.png assets/qr-slide.png
```

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

### Editing a module

The three modules are `modules` in section 4b of `content.js`, written from
Purple Maiʻa's "AI 101 Learning Materials" white paper. Each module is one
article page at `#/module/<id>`, and each of its `sections` is one heading on
that page. The comment above `modules` documents every field. In short:

```js
{
  id: "sampling",                      // the deep link: #/module/how-llms-work/sampling
  heading: "Probabilistic output and sampling",
  lesson: "m2-sampling",               // shows that lesson's video, adds its quiz to practice
  body: [
    "A paragraph. **Double asterisks** make bold.",
    { list: ["a bullet", "another"] },
    { steps: ["numbered", "list"] },
    { table: { head: ["A", "B"], rows: [["1", "2"]] } }
  ],
  takeaway: "Optional Key takeaway box.",
  sources: ["learnthatstack-2025"]     // ids in `sources`, shown under the section
}
```

A section can also hold `parts`, sub-sections with their own video, which is how
the generation loop carries four videos. Section and part ids are progress keys,
so don't rename them casually. **Every source in `sources` was checked against
its live page; do not add one without doing the same.** The read time on each
module is computed from its words, so it never needs updating by hand.

### Adding a lesson

A lesson is now a video plus a quiz that a module section points at with
`lesson`. Of the fields below, the page shows `title` (the video caption),
`video`, and the lesson's quiz. `summary` and `takeaways` feed search.
`duration`, `level`, `slides` and `resources` are kept but not displayed since
the lesson cards were retired. A lesson no section points at is never shown.
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

### Outside videos are stand-ins

Seventeen of the 19 videos are Purple Maiʻa's own. The other 2 are outside
explainers, each picked for that specific topic and for how well it has been
received, and each verified against live YouTube rather than recalled — a
made-up video id on a page that teaches people about invented citations would be
a bad joke. Purple Maiʻa's own animations replace them as they are produced.

A notice saying so renders under every embed. **It is keyed to the video's kind,
not to a flag anyone has to remember to clear.** The in-house animations arrive
as `file:`, so the moment a lesson switches over, its stand-in notice disappears
by itself. Swap the one field and you are done:

```js
video: "youtube:gV0_raKR2UQ",   // stand-in, notice shows
video: "file:assets/bias.mp4",  // ours, notice gone
```

**`videoLength` is recorded but nothing renders it.** It is the real runtime,
read off YouTube. It used to sit bottom-right of the thumbnail — except what was
drawn there was `duration`, which is self-paced time for the *whole lesson*, in
the one corner every viewer reads as the video's length. Two different clocks.
They are still unreconciled: `duration` is documented below as including video
time, and those values predate 16 of the 19 videos, so the per-lesson figures,
the old hero total were all understated. None of them is displayed any more: the
only time on the page is each module's read time, computed from its words, and
it does not include video.

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
so write it to teach rather than to say "correct". The quizzes of every lesson in
a module run together as that module's "Check your understanding", at the end of
its page. Scores live in `localStorage`
alongside lesson progress — this browser only, never uploaded, and the
"Reset progress" button clears both.

**Write the correct option first if that is easiest — the page shuffles them.**
Options are reordered at render time and `answer` is remapped to follow, so the
right answer lands in a different position on every visit. You never have to
scatter them by hand, and you cannot accidentally ship a quiz that is passable by
always clicking A. If a question's options only make sense in a fixed order — a
sequence of steps, or an "all of the above" — add `fixed: true` to that question
and it keeps the order you wrote.

This applies to the module quizzes, Term match and "Would you send it?" alike,
since all three run through the same component.

### Re-skinning the page for a different room

> **Dormant right now.** Since October 2026 the site is one generic version for
> everyone. The `audiences` section, including the held-back community workshop
> and kupuna copy, was deleted from `content.js`; the code below still works if
> it is added back. Any community-facing version still needs a cultural review
> by someone who runs those rooms before it goes live.

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
| `cite` | One real paper among three fabricated ones | `real: [{…}]` and `fake: { authors, titles, venues }` |
| `corpus` | Training coverage vs stated confidence, all rows at once | `questions: [{ q, coverage, confidence, verdict }]` |

Each entry also takes `group`, which decides where it appears:

- `group: "quiz"` (the `scenarios` and `match` types): its questions are added to
  the module's **Check your understanding**, after the lesson quizzes. `module` is
  a track id (`overview`, `how-it-works`, `using-llms`); `"all"` adds it to the
  last module. Term match draws fresh glossary questions on every "Try again".
- `group: "demo"` (the other four): it sits inside the article section named by
  `section`, a section or part id from `modules`. Token chopper is under
  Tokenization, Roll the dice under Sampling, Spot the real one under
  Hallucinations, and How much did it read? under Bias.
| `match` | Definition → term quiz, built from the glossary | `rounds: 6` |
| `scenarios` | Judgment calls | `items`, same shape as a quiz above |

**On `cite`:** it shows one real paper beside three references it fabricates on
the spot, identically formatted, and asks which is real. An earlier version showed
only fabrications, which meant "you cannot tell by looking" was asserted rather
than demonstrated. Two rules if you edit it: the entries under `real` must stay
exactly right, because they are the control and the reveal links to them for
checking; and `fake.authors` must stay generic surnames, because the widget
attributes invented work to whoever it picks. Nothing is labelled until the
reader has answered.

**On `corpus`:** the `coverage` and `confidence` numbers are illustrative, not
measured, and the card says so. Nobody publishes an exact breakdown of a frontier
model's training data. What is not in dispute is the direction, which is the point
the activity makes: coverage collapses, confidence does not follow it down. The
summary line under the table is computed from the data, so reordering or inserting
a question keeps it honest — do not hard-code those numbers back in.

**On the chart colours:** the two series use `--viz-read` / `--viz-sure`, which are
deliberately *not* the UI `--accent` / `--coral`. That pair fails colourblind
separation and the chroma floor when used as data colours. The current steps pass
all six checks in both modes; if you change them, re-run the validator rather than
eyeballing it:

```
node scripts/validate_palette.js "#6b2f96,#b4452c" --mode light
node scripts/validate_palette.js "#a86fd6,#d4634a" --mode dark
```

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
--accent:       #6b2f96;   /* buttons, links, highlights  */
--accent-soft:  #f2e9fa;   /* tinted backgrounds          */
--accent-ink:   #ffffff;   /* text sitting on the accent  */
```

Fonts are set in `--font-display` (headings) and `--font-body` (everything else).
They load from Google Fonts in `index.html`; delete that `<link>` and the system
font stack takes over cleanly.

**The palette is Purple Maiʻa's own**, sampled straight from the brand logo:
purple `#1a002d`, navy `#081659`, green `#006838`, tan `#c3996b`, red `#ec1c24`,
cyan `#00adee`, amber `#faaf40`, lime `#8bc53f`. `--accent` is a lightened step
off that purple chosen for contrast, not by eye: 8.2:1 on `--bg` and 8.5:1 under
white button text. purplemaia.org pairs Montserrat headings with Inter body copy
on a 16px radius, and this page follows it.

**Logo files** live in `assets/` as four PNGs — `pm-mark` (header) and
`pm-lockup` (footer), each with a `-white` variant for dark mode. The swap is
pure CSS, so there is no JavaScript to keep in sync. They are downscaled from
the full-size brand exports; regenerate them at a different size rather than
scaling these up.

**The ʻohe kāpala texture** in the side margins is `assets/stamp.png`, applied in
`body::before` as a CSS *mask* rather than as a background image. That is what
lets one file tint itself from `--accent` and follow the theme, instead of
needing a light and a dark copy like the logos do.

Two things about it that look like mistakes but are not. The PNG keeps a real
alpha channel, which costs about 10KB over plain greyscale — but the default
`mask-mode` is `alpha`, so this never has to rely on `mask-mode: luminance`,
which Chrome only supported from v120 and which fails *loudly*: ignore it and
the mask becomes a solid square. And `body` carries `position: relative;
z-index: 0` purely so the texture can sit at `z-index: -1`, above the page
background but under every bit of content.

It is drawn only at ≥1240px, where there is actually margin to draw in, and is
hidden in print. To move the stamps, edit the `mask-position` list; the vertical
offsets are percentages so they redistribute themselves as the page grows.

Don't forget `assets/favicon.svg` (one hex value) and the `<title>` and
`<meta name="description">` at the top of `index.html`.

---

## 4. What the page does

- **Three module pages** — the home page shows the three modules (`modules` in `content.js`, written from the white paper). Each opens as an article at `#/module/<id>`: the text, the video for each section, a key takeaway, sources, then practice (the module's lesson quizzes plus its activities) and a link to the next module. "In this module" sits to the right and marks the section being read. Old `#lesson-<id>` links land on the matching section.
- **Hover previews** — on a computer with a mouse or trackpad, hovering a module card plays that card's video, muted and looping, in place of its picture; moving away pauses it. Nothing loads until the first hover, and it never plays on touch screens, with reduce-motion, or with data saver on. `preview` on a module in `content.js` picks a different clip, or `""` turns it off.
- **Reference page** — `#/reference` holds the glossary (A–Z, searchable), the prompt library, the FAQ and downloads. The header links and the four cards at the bottom of the home page go straight to each one.
- **One version for everyone** — the `audiences` section was deleted from `content.js` (October 2026), so there is no switcher and `?for=` is ignored. The switcher code in `app.js` stays dormant and comes back if `audiences` is added again (see "Re-skinning the page" above).
- **"Not sure where to start?" and "Why we made this"** — both still have code and a place on the home page, but their content (`placement`, `why`) was removed from `content.js`, so neither shows. Add the keys back to bring them back.
- **Run of show** — off the page right now. `agendaHidden: true` in `content.js` takes the section, its nav link and its search entries together, without deleting any of the timings. The October 6 2026 session has happened; set the flag to `false` when the next one is booked and it comes back on the home page.
- **Check your understanding** — the one practice block at the end of each module: every question from its lessons plus its question activities ("Which one is it?", "Would you send it?", Term match), with an explanation on every answer, right or wrong.
- **Hands-on demos** — token chopper, next-token dice roll, citation fabricator and training-coverage meters, each inside the section it illustrates.
- **Dark and light themes** — follows the system setting, with a manual toggle that sticks.
- **Motion** — pages cross-fade as you move between them, "In this module" links glide to their section, and a marker on that rail follows the section you are reading. Text, images and cards fade up gently as they scroll into view, a few at a time (`REVEAL_SEL` at the top of `app.js` lists what reveals). All of it is instant with the system's reduce-motion setting on.
- **Search everything** — press `/` or `Cmd/Ctrl+K`. Searches modules, their sections, practice activities, prompts, glossary terms, FAQs and, when it is showing, agenda items at once.
- **Progress tracking** — a section counts as read once you have scrolled to its end (jumping past it does not count), and a module's practice once its quiz has been answered all the way through. "In this module" ticks read sections, the bar under the header shows the module's progress, and the home page shows each module's progress, "Continue" to the next unread section, and a "Reset progress" link. Stored in their own browser via `localStorage`; nothing is uploaded and there is no account. Clearing site data resets it.
- **Feedback widget** — the button in the bottom-right corner. The one thing on this page that transmits anything, and only when somebody presses send. See section 6.
- **Copy buttons** on every prompt.
- **Deep links** — every module, section and practice block has an address, e.g. `#/module/how-llms-work/sampling` or `#/module/using-llms-well/practice`. Old `#lesson-<id>` links and the old `#glossary`-style anchors redirect to where that content lives now.
- **Keyboard and screen-reader friendly** — skip link, focus rings, real buttons, labelled regions.
- **Prints cleanly** — navigation and decoration drop out, cards avoid page breaks.
- **Responsive** down to small phones.

## 5. Before you share the link

- [x] Section 1 of `content.js` carries the event name. `date` and `time` are intentionally blank: the Oct 6 2026 session has run, and a past date on a live page misleads every reader after it. If you book another, fill them in **and** restore `startDate` on the `CourseInstance` in `index.html` — that one is machine-readable, so a stale value there is read by search engines and seen by nobody.
- [x] `<title>`, `<meta name="description">` and the JSON-LD in `index.html` match.
- [x] `assets/social.png` is a 1200×630 card for link previews.
- [x] The footer's "Source on GitHub" link points at this repo.
- [x] Reference videos linked and embedded where the deck cites them (three YouTube, one Science Learning Hub).
- [ ] Add Purple Maiʻa's own module videos as they come out of production. Transcode to H.264/AAC MP4 with `-movflags +faststart`, put it in `assets/video/` with a same-named `.jpg` poster beside it, and set `video: "file:assets/video/<name>.mp4"` on the lesson. The section's poster and the stand-in notice follow on their own.
  - Done (Oct 2026): scripts 2–9, one per lesson, on 8 of 19 lessons. Script 2 maps to `m2-sampling` as well, but it sits only on `m2-next-token` so the same film is not on two cards in a row.
  - Not yet placed: "Video 10 – How text is generated" has no script or lesson mapping. Script 1 (`m2-training-data`, `m3-bias`) is not delivered.
  - Oct 26: videos 13 ("Show me the receipts", `m3-grounding`), 14 ("Which one said it", `m3-model-families`) and 15 ("Which words matter", `m2-transformers`) placed. 16 of 19 lessons now have our own video.
  - Oct 26: video 19 ("The Uneven Library", `m3-bias`) placed. 17 of 19.
  - Still on outside stand-ins: `m2-parameters`, `m2-sampling`.
- [x] Every lesson has a check-your-understanding quiz (section 6 of `content.js`).
- [x] Walk the page before sending a link out. There is one version now; old `?for=` links open it too.
- [ ] **Cultural review of the two held-back versions** — Community workshop and Kupuna outreach are written and tested but carry `draft: true`, so nothing on the live site can reach them. Once someone who runs those rooms has read the copy, delete that one line per audience.
- [x] Every `url: "#"` replaced; all 19 lessons carry resources (not displayed since the lesson cards were retired; the Reference page's downloads are).
- [x] **The deck is in** — `assets/llm-nlp-101.pdf`, 35 slides, 15 MB, linked from "For facilitators".
- [ ] Three text fixes in the deck itself, in Canva, then re-export over the same filename (see `HANDOFF.md`). Nothing in the repo changes.

### Content structure

The three modules, as the page counts them (sections, videos, and a read time
computed from the words, at about 200 a minute, video not included):

| Module | Track id | Sections | Videos | Read |
|---|---|---|---|---|
| 1 — What is generative AI? | `overview` | 3 | 2 | ~1 min |
| 2 — How an LLM works | `how-it-works` | 9 | 11 | ~6 min |
| 3 — Using LLMs well | `using-llms` | 9 | 6 | ~6 min |

"Model families" is a Module 2 section now, following the white paper, though
its lesson still carries `track: "using-llms"`; the module a lesson appears in is
decided by which section points at it, not by its track.

The old "two clocks" problem is retired. Lesson `duration`, the hero `facts` and
the agenda times are no longer shown (the agenda comes back with its own times
when a session is booked).

The numbered sections of `content.js`, in order:

| # | Section | What it drives |
|---|---|---|
| 1 | `event` | The home page headline and line under it (`headline`, `tagline`) |
| 2 | `pathways` | Not shown; kept for the held-back audiences |
| — | `placement`, `audiences` | Removed; their places on the page stay empty (see section 4) |
| 4 | `tracks` | Module labels used by placement and practice |
| 4b | `modules`, `sources` | The module pages and their sources (`why` was removed) |
| 5 | `lessons` | Each lesson's video and title, carried by a module section |
| 6 | `quizzes` | Check your understanding, keyed by lesson id, run per module |
| 7 | `practice` | Question activities (in each module's quiz) and demos (in their sections) |
| 8 | `agenda` | Run of show — currently hidden by `agendaHidden: true` |
| 9 | `prompts` | Prompt library |
| 10 | `glossary` | Glossary (shown A–Z), and the Term match activity |
| 11 | `faq` | FAQ |
| 12 | `resources` | Downloads & links |
| 13 | `footer` | Footer text and links |
| 14 | `feedback` | The feedback widget: endpoint, kinds and copy |

---

## 6. Collecting feedback

The button in the bottom-right opens a short form: pick a kind, write a note,
optionally leave a name. Everything else is captured for you — which module
and section the person was on, and their browser and window size — because "confusing" is noise and "confusing on Embeddings" is
a task.

**It ships switched off.** With `feedback.endpoint` empty in `content.js`, the
form falls back to opening the visitor's mail client with the note already
written, addressed to `feedback.mailto`. Nothing is ever silently dropped.

**To turn on collection**, follow the setup comment at the top of
`tools/feedback-apps-script.js`. It takes about five minutes: make a Sheet,
paste that file into Apps Script, run `setup`, deploy as a web app, and paste
the resulting URL into `feedback.endpoint`. From then on notes land in a
spreadsheet in Purple Maiʻa's own Drive, and every Friday at 3pm a trigger
writes a Google Doc grouped by kind and emails it to `DIGEST_TO`.

> **Send one test note after deploying and confirm the row appears.** The widget
> posts with `mode: 'no-cors'`, which is what lets it reach Apps Script without
> a CORS preflight, but it also means the browser cannot see an error response.
> A misconfigured endpoint looks exactly like success from the page.

A note that cannot be sent is queued in `localStorage` under `aihub:feedbackq`
and retried on the next page load, so a dropped connection does not lose it.

**On the privacy claim.** The page tells people twice that nothing is uploaded,
and that stays true of progress, quiz answers, theme and audience, all of which
live in the browser. The feedback form is the single exception, it is labelled
as such in the FAQ, which lists exactly what each note carries. If you extend it, keep that property: no background collection.


## Licence

Do what you like with it. If you run your own version of the session, the
materials are meant to be forked.
