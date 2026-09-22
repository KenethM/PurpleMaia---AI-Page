# LLM/NLP 101 — Purple Maiʻa staff learning page

A single static page for hosting workshop material: lessons, video recordings,
a prompt library, a glossary, an agenda and links. No build step, no framework,
no dependencies. Edit one file, push, done.

```
index.html          the page structure (you rarely need to touch this)
content.js          ← EVERYTHING YOU EDIT LIVES HERE
assets/styles.css   colours, type, layout
assets/app.js       rendering, filtering, search, progress tracking
assets/favicon.svg  the little icon in the browser tab
.nojekyll           tells GitHub Pages to serve the files as-is
```

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

- **Dark and light themes** — follows the system setting, with a manual toggle that sticks.
- **Search everything** — press `/` or `Cmd/Ctrl+K`. Searches lessons, prompts, glossary terms, FAQs and agenda items at once.
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
- [ ] Add Purple Maiʻa's own module videos as they come out of production — set `video:` on the lesson; until then it shows a “coming soon” placeholder.
- [x] Every `url: "#"` replaced; all 19 lessons carry resources.
- [ ] **Export the deck to `assets/llm-nlp-101.pdf`** — the page already links that exact path, so the link 404s until the file is committed.

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
so the hero numbers stay honest.

---

## Licence

Do what you like with it. If you run your own version of the session, the
materials are meant to be forked.
