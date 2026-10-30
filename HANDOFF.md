# Handoff log

What changed, why, and what is still open — one entry per working session.

Written for whoever picks this page up next: a teammate taking over, a reviewer
who needs context before reading a diff, or you in three months. The git log says
*what* changed; this says *why*, and what was deliberately left undone.

**How to use it**

- Newest entry at the top, directly under the standing notes below.
- Copy the template at the bottom of the file to start an entry.
- Keep **Open / next** honest. It is the only part anyone reads under pressure.
- Note anything held back on purpose. A missing feature and a deliberately
  withheld one look identical from the outside, and the difference matters.

---

## Standing notes

Not an entry. These stay at the top until they stop being true, because a dated
entry gets buried by the next one and these are the things that bite.

### ⚠️ The content flow is ONE WAY: `main` → `community-hub`

**Never `git merge community-hub` while on `main`.** It drags the community
`index.html` onto `main`, and the staff site then quietly serves the overlay:
cut-down content and no audience switcher.

**It does not look broken, which is why it bit twice.** `app.js` writes
`event.name` into the `<title>` at runtime, and `community.js` sets that to
"Artificial Intelligence 101" too, so the tab reads correctly while the page
underneath is the wrong edition. The tell is `?for=partners` rendering no
switcher, because `community.js` sets `S.audiences = []`.

Correct moves:

```
git checkout community-hub && git merge main      # yes, always this way
git checkout main && git merge community-hub      # NO. this is the bug.
```

`index.html` is the only file that may differ between the branches. Check it
with `git diff --name-only main community-hub` — if that prints anything else,
something has crossed over.

The suite now catches it: the **EDITION CONSISTENCY** block checks the working
tree's branch against its own `index.html`, and fails if `main` loads
`community.js` or is `noindex`. It was added after the 27 Oct incident, in
which the staff site was deployed serving the community edition.

### ✅ RESOLVED 27 Oct — the `?for=partners` deploy trap

**Kept here as history, not as a warning.** `main` carried no `audiences`
block from `26fbde8` until 27 Oct, while the deployed staff build still had
one, so any `git push dokku main` would have silently deleted `?for=partners`
from a live site people hold links to.

The block was restored whole from `53abaf9`, verified working on the rebuilt
page, and `main` was deployed. The live staff site now serves all four
audiences *and* all 19 videos. **`git push dokku main` is safe again.**

If `audiences` ever disappears from `content.js` again, this trap comes back
with it. That is the thing to watch, not the command.

---

## 2026-10-30 — Umami on Dokku, next to GA4

**Who:** Sam, with Claude
**Branch:** `main`, then merged forward to `community-hub`
**State:** committed and pushed to `origin`; `ai-community` deploy pending
**Files:** `assets/app.js`, `content.js`, `community.js`, `README.md`

### Why
The self-hosted option from the start: free, cookieless, and the data stays
on Purple Maiʻa's own server, which fits what the course teaches about data.
Running it beside GA4 for a while so the two can be compared.

### What changed
- **Server (done by Sam over ssh):** Dokku app `umami` with Postgres
  `umami-db` linked, `APP_SECRET` (its first value was pasted in a chat; rotate it if that has not been done),
  `DISABLE_TELEMETRY=1`, port `http:80:3000`, image pulled with
  `git:from-image`, Let's Encrypt on. Live at https://umami.sandbox.purplemaia.org.
- **Site:** `track()` now sends to GA4 and/or Umami. Umami's own page views
  are off (`data-auto-pageview="false"`); route() sends them with the same
  hash-to-path URL as GA4. Calls made before its script loads are queued.
  Config is `SITE.analytics.umami = { script, website, domains }`, blank in
  `content.js`, set in `community.js`. FAQ now names both tools.

### Decisions worth knowing
- **Every Umami call sets `url` itself**, events included. Otherwise Umami
  files them under the raw `/#/module/…` address and they never line up with
  the page views.
- `data-domains` is set, so a local or Pages copy of the community edition
  never reports to the real dashboard.

### How it was tested
Headless Chrome with the community hostname mapped to a local server, Umami's
script replaced by a recording stub and GA blocked, so no test data reached
either dashboard. Page views and events arrived with path URLs, the first
(queued) page view was delivered, no console errors. Not yet checked: the real
Umami dashboard after deploy.

### Open / next
- [ ] Deploy `community-hub` to `ai-community`, then watch Umami's Realtime.
- [ ] Pin the Umami image to the version in its Settings instead of `latest`.
- [ ] Ask David whether `umami-db` is covered by any server backup.
- [ ] After a couple of weeks, compare the two and decide whether GA4 stays.

---

## 2026-10-29 — Google Analytics 4 on the community edition

**Who:** Sam, with Claude
**Branch:** `main` (`266ca61`), merged forward to `community-hub`
**State:** deployed to `ai-community` at `9fa89ae`, 29 Oct
**Files:** `assets/app.js`, `content.js`, `community.js`, `README.md`

### Why
We want to know which modules people use and where they stop. GA4 first, as a
comparison; self-hosted Umami on Dokku is still the preferred long-term route.

### What changed
- New ANALYTICS section near the top of `app.js`: loads `gtag.js` only when
  `SITE.analytics.ga4` is set, and a `track()` helper that does nothing otherwise.
- Page views are sent by hand from `route()`, once per page, with the hash
  turned into a path. Events: section read, video start / 90%, practice used,
  quiz completed, placement result, prompt copied, audience switch, feedback
  opened / sent, certificate requested. Full table in README §7.
- `content.js` §16 `analytics.ga4: ""`; `community.js` sets `G-Y6HCB0HT5S`.
- Community FAQ: the scores answer no longer says "nothing is uploaded", and a
  new "Do you track visits to this page?" says what is and is not collected.
  The certificate disclosure on this edition drops "the lessons you opened
  stay in this browser", which stopped being true.

### Decisions worth knowing
- **Staff site stays analytics-free.** The ID lives in `community.js`, not
  `content.js`, so merging main into community-hub can never switch it on there.
- **No scores, no search text, nothing typed.** `quiz_complete` carries the
  module only, because the FAQ says nobody sees your score.
- Off for `file://`, localhost, Do Not Track and Global Privacy Control.
  Google Signals and ad personalisation are off in the tag.

### How it was tested
Headless Chrome against the local files under a non-localhost hostname:
page views fired once per page (a section jump inside a module did not add
one), `video_start`, `practice_use` (once for two clicks) and `feedback_open`
landed in `dataLayer`, no console errors. On `localhost` no script loaded and
no events were queued. Not tested: reports in GA itself, which needs a deploy.

### Open / next
- [ ] Turn off "Page changes based on browser history events" in the stream's
      Enhanced measurement, or page views double up.
- [ ] Register the custom parameters as custom dimensions in GA4.
- [ ] Deploy `community-hub` to `ai-community` and check Realtime in GA4.
- [ ] The `app.js` / `content.js` parts are edition-neutral; land them on
      `main` too so the one-way merge flow stays clean.
- [ ] Umami on Dokku, then decide which one to keep.

---

## 2026-10-28 (later) — Quizzes: five kinds of question, shorter checks, a warm-up, and sound

**Who:** Keneth, with Claude
**Branch:** `main`, then merged forward to `community-hub`
**State:** **deployed, both sites**, 28 Oct: `ai-community` at `091a5ba`, `ai-page` at `c4f6a66`.
Checked after: the right edition on each, `?for=partners` still 200, HTML still `no-cache`.
**Files:** `assets/app.js`, `assets/styles.css`, `content.js`, `HANDOFF.md`

Sheila's PRs #1 and #2 went in first, as fast-forwards. Her footer change was
already on `main`, so the branches still differ in `index.html` only.

### Why

Keneth, after working through the course: every question was the same
three-option multiple choice, Module 2's quiz was 30 questions in one sitting,
and some things were being asked twice. Measured before changing anything:

- **Every lesson question was 3-option multiple choice**, and the scenarios
  4-option. Even Term match was multiple choice, one definition at a time.
- **Module 1 asked "which label fits?" about 8 times in 14**: two lesson
  questions, then five "Which one is it?" scenarios doing the same job.
- **Term match re-asked lesson questions.** It drew glossary terms at random,
  so "What is an embedding?" could come up twice in one sitting.
- **Module 2 was 30 questions**, all at the bottom of a nine-section article.

### What changed

**Five kinds of question, one engine.** `renderQuiz` items now take a `type`:
`choice` (as before), `truefalse`, `order` (arrows, not dragging: same for
mouse, thumb, keyboard and screen reader), `match` (a board: tap a term, then
its meaning) and `sort` (examples filed into buckets one at a time). Each type
was matched to content it suits rather than sprinkled in for variety: `order`
for the generation loop and the nested terms, `sort` for Module 1's labels,
`truefalse` for misconceptions.

**Scoring is in points now, not screens.** A board of five pairs is five
points, a sort of seven cards seven. A pair matched after a slip costs its
point but still has to be found, so the board always finishes.

**Long modules are split into checks.** A module can list `checks`, each with
its lessons, its activities, and the section it sits `after`. Module 2 has
three (6, 8 and 7 screens, was 30), Module 3 two (6 and 11, was 21). Module 1
stays as one, now 5 screens instead of 14. The last check keeps the old key
`module:<id>` and the old `#…/practice` address. Progress counts each check
as a unit, so the certificate needs all of them.

**Nothing is asked twice in one check.** Each Term match board now names its
`terms`, and the lesson questions those terms covered were removed. Module 2's
three boards, Module 3's two, Module 1's one: no overlaps, checked by hand.

**Take a guess, at the top of Module 2.** Three questions nobody can answer
before reading (does it learn from your correction, strawberry, same question
twice). No score, not counted toward progress. Each guess is kept in this
browser and its answer is revealed only once the section that teaches it has
been read; before that it says where to find out. Data-driven: adding one to
another module is a `warmup` block in `content.js`. Trialled on Module 2 only.

**Sound.** Synthesised with Web Audio, so there are no files. A right answer is
a soft bell that climbs a pentatonic step with each answer in a streak; a miss
is a low, muted pair; a sealed result plays a short arpeggio. On by default
and quiet. The speaker button on every quiz switches it off for all of them,
remembered in `aihub:sound`.

### Content decisions worth knowing

- Two questions were **rewritten, not just reformatted**: attention now asks how
  the model tells the two Pythons apart (the lesson's own example, not a new
  one), and Module 1's nesting question became an `order`.
- "Which one is it?" became a `sort` and absorbed the streaming-recommendation
  and translation-app examples from the lesson questions it duplicated.
- "Spot the problem" was suggested but not built: Module 3's "Spot the real
  one" demo already does that job.

### How it was tested

jsdom, both editions (`main`'s `index.html` and `community-hub`'s), against
the working tree: **every check in every module played through by clicking**,
with answers keyed from `content.js` rather than from the page. Order rows
moved with the arrows, boards paired by tapping (one deliberate slip per
midway board), sort cards filed. 199 assertions each, all passing. A second
suite loads saved progress: all modules read on "Done" with every check
passed; a warm-up answer appears only after its section is read; guessing
does not move progress; reset clears guesses. 10 each, all passing.

Screenshots of every new type at 1200px and 390px from headless Edge, dark
theme. **Not tested: what the sounds actually sound like.** Nobody has heard
them; jsdom has no audio. Worth five minutes with headphones before deploying.

### Watch for

- **Anyone who finished Module 2 or 3 before this lands is short a check.**
  The old result counts for the last check, not the new midway ones, so those
  modules read "Practice left" until the short checks are done. It costs a
  six-question check, and the certificate is the reason it should not be waived.
- Term match boards are curated now. **A new glossary term is not on any
  board until it is added to a board's `terms`.**

### Open / next

- [ ] Listen to the sounds, on a laptop and a phone. Adjust in `sfx` (`app.js`).
- [ ] Decide whether the warm-up goes on Modules 1 and 3 after people try it.
- [x] Deploy both editions. Keneth played the checks on localhost first.

---

## 2026-10-28 — Module pager, and certificates for the community edition only

**Who:** Sheila, with Claude
**Branch:** `main`, on top of `c1bbafa`
**State:** pager pushed to both branches (PRs open upstream). Certificate prep in the working tree on `main`: not committed, not merged down, not deployed.
**Files:** `assets/app.js`, `assets/styles.css`, `index.html`, `community.js`, `content.js`, `README.md`, `tools/certificate-apps-script.js`

### What changed
- **Previous / next pager** at the end of every module (`c1bbafa`): back on the
  left, next on the right, same height, next is the filled card. Module 1's
  back card goes to all modules. Stacks next-first under 560px.
- **Certificates are the community edition's alone.** `community.js` now sets
  `S.certificate.endpoint` (still `""`); `content.js` keeps it `""` for staff.
  The staff FAQ's certificate question is gone and its "what can send
  anything" answer now names only the feedback form, which closes the open
  item about those answers.
- **Certificate course name is "Artificial Intelligence 101"**, replacing the
  deliberate "Intro to AI". Safe because none had been issued.
- **`ALLOWED_ORIGINS`** now lists `https://ai-community.sandbox.purplemaia.org/`
  and the local test address only. The staff origins were removed.
- Setup notes: Sheet in a Shared Drive, shared with both admins (Keneth and
  Sheila); paste the URL into `community.js`, not `content.js`.

- **Certificate redirect fixed.** The Apps Script's "Opening your
  certificate…" page hung: the sandboxed frame may only move the top window
  after a click. It now shows an "Open my certificate" button (`target="_top"`)
  and keeps the script redirect as a fast path. Deployed as a new version.
- **Printed certificate redesigned.** Landscape letter, `@page { margin: 0 }`
  (which is what keeps the browser's date/title/URL off the PDF), double
  purple/gold frame, "This is to certify that", rule under the name, and a
  Date / Issued by signature row. Colours are fixed in the print block so a
  dark-mode screen still prints a light sheet.
- **Logo fixed on the certificate**, screen and paper: `pm-mark.png` plus the
  name as live text, replacing the lockup PNG whose white wordmark vanished in
  light mode and on paper. The footer logo still uses the lockup.
- **"24 of 24 lessons" was wrong**: n/total count sections plus practices,
  not lessons. A finished run now reads "All 3 modules, practice included".

- **Videos now count, and are required.** A video is watched once 90% of it
  has actually played (`video.played`, so scrubbing to the end does not
  count), stored under `aihub:watched`. Units per module are sections +
  videos + practice; a section ticks only when read and its videos watched;
  Done and the certificate need all 19. Only `file:` videos are tracked,
  because an embed cannot report playback. Sheila chose "required".

### Decisions worth knowing
- **Anyone who finished before this ships drops below 100%** until they watch
  the videos. A certificate already issued stays viewable.
- **The videos have no captions or transcripts**, and they are now required
  for the certificate. That is an access gap for deaf and hard-of-hearing
  learners and on low bandwidth. Captions (`<track>` + `.vtt`) are the fix.
- Partial viewing is not carried over if the player is rebuilt (leaving the
  module): the 90% has to be reached in one viewing of that player.
- Whoever deploys the Apps Script is "Me": the mail comes from that account
  and uses its quota. One admin owns the deployment; both can read the Sheet.
- The request is `no-cors`, so a rejected origin still shows "Check your
  inbox". No email means check `ALLOWED_ORIGINS` first.

### Open / next
- [ ] Enable HTTPS on `ai-community` (the allow-list assumes https).
- [ ] Create the Sheet + Apps Script, deploy, paste `/exec` into `community.js`.
- [ ] Test end to end from `http://127.0.0.1:8777/`, then on the live site;
      then drop the local origin and publish a new version of the deployment.
- [ ] Merge `main` into `community-hub` and deploy `ai-community`.

### How it was tested
`node --check` on all four JS files. Loaded `content.js` + `community.js` in
Node: staff endpoint `""`, community endpoint `""`, both course names correct.
Rendered the staff FAQ: no certificate question, button hidden. Sheila ran the
full flow end to end from `http://127.0.0.1:5500/` (request, mail, link,
certificate). The print design was checked as Chrome PDFs from light and dark
mode: one landscape page each, no browser header/footer. Not checked in Safari
or Firefox print.

Video tracking, in real Chrome via DevTools protocol: a played video ticks at
~90% and shows "Watched"; one scrubbed to the end does not. Seeded storage:
all done but one video gives 98% and "1 video left", certificate hidden; all
19 gives Done and, on the community edition, the certificate button. Not
checked on Safari/iOS, where autoplay and `played` can behave differently.

---

## 2026-10-27 (latest) — The depth layer made real, and what actually separates the two editions

**Who:** Keneth, with Claude Code
**Branch:** `main`, then merged forward to `community-hub`
**Files:** `assets/app.js`, `assets/styles.css`, `content.js`

### Why

Keneth, looking at the two deployed sites: *"I didn't want the staff site to be
the same as the community site."* He is right, and the cause was not where either
of us first looked.

**The two editions did not drift apart; they converged, and it happened gradually
through `main`.** Every time one of Purple Maiʻa's own films landed, it *replaced*
the outside explainer on that lesson rather than joining it — `b34f336`,
`5698c58`, `a663585`, `b2360e0`, and finally `50cf9f0` ("all 19 lessons carry our
own video"). By `50cf9f0` the staff edition had no long-form video left anywhere
on it. The thing that made it the deep one was gone, and nobody noticed, because
each commit on its own was obviously an improvement.

Measured, both editions as deployed this morning:

| | staff | community |
|---|---|---|
| lesson cards with identical title + video + runtime | **19 / 19** | |
| module article words | 2,109 | 715 |
| takeaways | 62 | 38 |
| lesson summary words | 274 | **269** |
| prompts / FAQ / resources | 7 / 14 / 5 | 3 / 10 / 3 |

The grid, the videos and the runtimes are **identical**. Everything that differs
is prose inside a module article, which you only reach by scrolling into a
module. Above the fold the two sites are the same site. That is exactly what
Keneth was seeing.

Note the summary row: 269 vs 274 words. The overlay's `INCH` rewrite *rewords*
the lesson summaries, it does not shorten them. Whatever it is buying, it is not
brevity at the card level.

### What changed

The follow-on explainer is now **a real player on the staff edition, not a link
in the margin**. Under our film sits a fold — `GO DEEPER | Outside explainer,
8:30` — that opens into a second poster, which plays on click.

Two gates, deliberately:

- **Shut, it costs nothing.** The YouTube thumbnail is built on first open, so a
  closed fold makes no third-party request at all. Verified: 0 `ytimg` images and
  0 iframes in the DOM before anything is opened.
- **Open, it still costs no frame.** The iframe only arrives on the click after
  that, `youtube-nocookie.com` as before.

`embedFor` gained a `noStandin` argument. The stand-in notice says *ours has not
been made yet*, and on a `deeper` video ours is the one playing directly above
it — it would have been a lie on every one of the 19.

**The community edition is untouched.** `community.js` already deletes `deeper`,
so all of this stops at `main` by construction, not by anyone remembering.

### The reversal worth recording

The obvious fix — revert `8da015e`, the commit that added the links — would have
made the two editions **more** identical, not less. That commit is the only thing
on staff today that the community edition does not have. Reverting it leaves two
sites with the same 19 films and no difference above the fold at all.

### What should separate them (proposed, not decided)

Joe's brief for the community edition was **"a mile wide and an inch deep."** The
staff edition has no equivalent sentence, and that is the actual gap. Proposed:

- **Community — a mile wide, an inch deep.** One idea per lesson, one film, no
  long-form video, no switcher. A person finishes it.
- **Staff/partner — the same mile, as deep as you want to go.** The film is the
  floor, not the ceiling: the full article, the outside explainer behind the
  fold, every takeaway, the glossary, the prompt library. A person *works from*
  it, repeatedly, and does not finish it.

Under that reading the staff edition is a **reference**, the community edition is
a **course**. That is a real difference, and it decides the open questions
below on its own rather than one at a time.

### Also fixed: the full-width black circle

Reported from a screenshot mid-session. It was **not** on either live site —
`ai-page`, `ai-community` and the Pages mirror were all checked and all clean,
and the Dokku host has no third app. It was a **stale browser tab**.

nginx sent no `Cache-Control` for HTML at all: the existing location regex only
covers `css|js|png|jpg|svg|pdf|mp4`. Browsers fell back to heuristic caching, so
an old tab held a pre-rebuild `index.html` while the scripts beside it
revalidated every 5 minutes. The result was a current `content.js` (new tagline)
rendering into retired markup — including the old progress ring, which nothing
styles any more. Without `.ring { width: 92px }` the SVG stretched to the
container; without `.ring circle { fill: none }` the circle painted solid.
Reproduced from `login:index.html` against today's assets.

Fixed in `deploy/nginx.conf`: `location = /` and `~* \.html?$` both send
`no-cache`. The ETag still does the work, so revalidating costs a 304 and no
body. **If anyone reports a broken-looking page, get them to hard-refresh
before investigating** — and now check the `Cache-Control` on `/` first.

### Open / next

- [ ] **Decide the staff edition's one-sentence brief.** Everything else here is
      downstream of it. Nothing should be built until it exists.
- [ ] The audience switcher: 4 of its 13 fields still render (`label`, `blurb`,
      `tagline`, `time`+`location`). It changes ~97 characters out of 31,000.
      Measured, not estimated. Re-bind `intro`/`facts`/`agenda` to the module
      layout, or retire it — but only after the brief above.
- [ ] The `INCH` summaries save 5 words across 19 lessons. Either make them
      genuinely one-line or drop that part of the overlay.
- [ ] Look at the fold on a phone. The four portrait films still have not been
      seen on one either.
- [ ] Nobody outside has reviewed the community edition yet, so `robots` stays
      `noindex`.

---

## 2026-10-27 (night) — Our films in front on staff, and the switcher saved

**Who:** Keneth, with Claude
**State:** **both sites deployed and current.**
**Files:** `content.js`, `assets/app.js`, `assets/styles.css`, `community.js`, `HANDOFF.md`

### What is live now

| Site | Serving | `?for=` | Videos |
|---|---|---|---|
| `ai-page` | `main`, **deployed today** | **works, all 4 audiences** | 19 ours + 19 deeper links |
| `ai-community` | `community-hub` | off by design | 19 ours, no deeper links |

**The staff site is finally current.** It had been on the 4 Oct build for
three weeks, serving zero videos and calling itself *LLM/NLP 101*.

### Our films in front, outside explainers behind

Every lesson plays Purple Maiʻa's own film, with the outside explainer it
used to carry kept underneath as a link — *"Want it in more depth? Outside
explainer, 7:58"*. Ours run **1:04–2:52**, theirs run **3:23–27:39**, so the
split falls out naturally: ours is the lesson, theirs is the long version.

**A link, not a second embed.** Two players read as "watch both" rather than
"there is more if you want it", and a second embed would pull a third-party
frame into a page that currently loads none until asked.

All 19 ids were taken off the deployed staff build and **re-checked against
live YouTube via oEmbed**, not recalled — a watch URL returns 200 for a dead
video, so oEmbed is the only honest check.

**The community edition strips them** (`delete l.deeper`). It is the
inch-deep one by design, and 3-to-27 minute outside videos are exactly the
depth it is meant not to have.

### `audiences` restored, which is what made the deploy safe

Lifted whole from `53abaf9`. **Verified on the rebuilt page rather than
assumed:** the switcher bar renders with both non-draft audiences, and
`tagline`, `time` and `location` swap per audience. The staff and partner
views differ (1,259 vs 1,315 characters of hero text), so `?for=partners`
still means something.

**Two fields no longer land anywhere.** `badge` and `intro` lost their markup
in the rebuild; `facts`, `pathways` and `agenda` point at retired sections.
They are left in rather than pruned, because they are the record of what each
audience is *for* — pruning them would make restoring any of that markup a
rewrite instead of a re-bind. The switcher works, it just changes less of the
page than it used to.

`workshop` and `kupuna` stay `draft: true`, so the bar shows two buttons, not
four. Cultural review before either ships.

### Open / next

- [ ] **The two drafts still need cultural review** before `workshop` or
      `kupuna` can lose `draft: true`.
- [ ] Consider whether `badge` and `intro` deserve markup again, or whether
      the partner view changing only the tagline and session details is
      enough.
- [ ] Team review of the community site, then flip `robots` to `index, follow`.
- [ ] Settle the app name before any link or QR goes out.
- [ ] `ALLOWED_ORIGINS` needs **both** hosts when the certificate script deploys.
- [ ] Script 19's cultural read, and its title.

---

## 2026-10-27 (evening) — Two sites on the sandbox, side by side

**Who:** Keneth, with Claude
**State:** **deployed.** Both apps live on the PMF Dokku box.
**Files:** `index.html` on `community-hub`, `HANDOFF.md`

### What is running now

| App | Host | Serving | HTTPS |
|---|---|---|---|
| `ai-page` | `ai-page.sandbox.purplemaia.org` | the 4 Oct staff build, **untouched** | yes |
| `ai-community` | `ai-community.sandbox.purplemaia.org` | `community-hub`, **new** | **no — see below** |

**`ai-page` was deliberately not touched.** It still serves all four audiences
(`staff`, `partners`, `workshop`, `kupuna`) and `?for=partners` still returns
200, checked after the new deploy. Standing up a second app sidesteps the whole
`audiences` problem rather than solving it — which is the point. Nobody had to
decide anything to get a community site up.

**`ai-community` serves the real thing.** All 19 videos return 200, where the
staff app still 404s every one of them. Title *Intro to AI*, overlay loaded.

**The community edition now points at its own address.** Its pre-launch comment
listed exactly what to do once it had a URL, so: canonical, `og:url`, four
JSON-LD ids, and absolute `og:image`/`twitter:image` — relative ones do not
survive a scraper, and this link is about to be pasted around for review.
`community.js` still points `FULL` at `ai-page`, which is correct: that is the
community edition's link back to the full course.

### What is not done

**HTTPS is not enabled on `ai-community`.** `letsencrypt:enable` is a certificate
action and was refused in this session. The site answers on **http only**, so a
browser will mark it Not secure. One command fixes it, from someone with the
access:

```
ssh dokku@dokku-pmf-sandbox.westus2.cloudapp.azure.com letsencrypt:enable ai-community
```

**It is still `noindex`, on purpose.** The address exists so the team can
review; the team has not reviewed. Flipping `robots` to `index, follow` is the
launch act and it is one line.

### The problems worth knowing about

**The two sites now disagree with each other, loudly.** Community has 19 videos,
module articles and the current name. Staff has none of the videos, the old
lesson grid, and still calls itself *LLM/NLP 101*. Anyone who opens both will
notice within seconds. That gap is the `audiences` decision, still deferred —
deploying `main` to `ai-page` fixes the staleness and costs `?for=partners`
unless `audiences` is restored from `53abaf9` first.

**The app name `ai-community` was chosen, not agreed.** It follows Samantha's
proposal from today's meeting. Renaming it is free *right now* — nothing points
at it, no QR exists for it. It stops being free the moment a link or a printed
code goes out.

**`ALLOWED_ORIGINS` now has to list two hosts.** The certificate Apps Script is
still undeployed. When it goes out, it needs `ai-community.sandbox.purplemaia.org`
as well, or the magic-link sign-in breaks on the community site specifically.

### Open / next

- [ ] **Enable HTTPS on `ai-community`** — command above. Until then it is http.
- [ ] Team review of the community site, then flip `robots` to `index, follow`.
- [ ] Settle the app name before any link or QR goes out.
- [ ] The staff/community staleness gap, and with it the `audiences` decision.
- [ ] `ALLOWED_ORIGINS` needs both hosts when the certificate script deploys.

---

## 2026-10-27 (later) — Team meeting: two pages, two names, a session with David

**Who:** Keneth, Samantha, David and the team
**State:** nothing changed in the repo. Decisions pending.

### What was decided, and what was not

**Two pages, confirmed:** one for staff and partners, one public and
community-facing. That is the shape the repo has been built around since 20
October, so nothing here changes.

**Samantha proposed calling them "AI Staff" and "AI Community".** Not finalised.
Current names are *Artificial Intelligence 101* (staff) and *Intro to AI*
(community), set on 23 October.

**David offered a screen-share** to check deploy access, rename the existing
Dokku app, and stand up the community one. Possibly after 2:30pm.

**The page was called nearly ready**, and the team was asked for another review.

### The thing to settle before that session

**Renaming the Dokku app and renaming the page are two different decisions with
very different costs, and the meeting treated them as one.**

Creating a *new* app for the community edition is free — `*.sandbox.purplemaia.org`
is a wildcard, so a new host answers immediately and nothing points at it yet.

Renaming the *existing* app is not free. The host is `ai-page.sandbox.purplemaia.org`
and it is written into **21 places across 9 files**, including:

| Where | Why it matters |
|---|---|
| `assets/qr.png`, `qr.svg`, `qr-slide.png` | **A QR cannot be redirected once printed.** `README.md:167` already says this. |
| Slide deck | The QR slide is dropped into it. Anything already handed out dies. |
| `tools/certificate-apps-script.js` | `ALLOWED_ORIGINS` is an exact-match list. Wrong host, and the magic-link sign-in silently stops working. |
| `index.html` ×8 | canonical, `og:url`, JSON-LD `@id`s |
| `WHITEPAPER.md` ×3 | a distributed document |

**So the cheap version of Samantha's proposal is available:** use *AI Staff* and
*AI Community* as the **app and repo names**, which is what they read like, and
leave the learner-facing titles alone. Dokku app name and page title do not have
to match, and nothing outside the box ever sees the app name. That gets the
distinctness she asked for at zero URL churn.

If the hostname really should change, the moment to do it is **before** the
certificate Apps Script is deployed, since `ALLOWED_ORIGINS` has to be edited
then anyway, and **before** any more QR codes are printed.

### Open / next

- [ ] **Decide: rename the app, or only the display names.** See above. Cheap
      version strongly preferred unless there is a reason the public hostname
      must change.
- [ ] **Settle the `audiences` question before David deploys anything.** Already
      written up under Standing notes and in `README.md`; it is the one that
      silently deletes `?for=partners`.
- [ ] If the host does change: regenerate all three QR assets with
      `tools/make-qr.js`, verify with `tools/check-qr.js`, re-export the deck
      slide, and update `ALLOWED_ORIGINS` before deploying the certificate.
- [ ] Review feedback from the team is still outstanding.

---

## 2026-10-27 — Sam's rewrite merged, and film 17's forward reference cut out

**Who:** Keneth, with Claude
**Branch:** `main`, then merged down to `community-hub`
**State:** committed and pushed. **Not deployed.**
**Files:** `content.js`, `HANDOFF.md`, `assets/video/where-the-odds-come-from.mp4`, plus Sam's six via merge

### What changed

**Sam's general-audience rewrite is in.** 959 lines of `content.js`, plus quiz
animations in `app.js` and `styles.css`, and plain-language copy through
`index.html`. Modules are renamed: *What is AI?*, *How AI chatbots work*,
*Using AI well*.

**One conflict, and her shape won it.** She renamed the originals pathway item
to *"Our own short videos"* and dropped *"Scripts these are built from"* on
purpose — both are the point of her commit. Only her count was stale, written
before 17 and 18 landed. It reads 19 now, with no stand-in claim.

**Nothing of ours broke.** All 19 lesson ids and both module orderings are
untouched by her rewrite, so the video wiring survived as-is: `m2-parameters`
and `m2-sampling` still carry the 9:16 films, four portrait videos in total.

**The community overlay still applies.** `gist()` needed no change and nothing
was left empty. Her prose is tighter, so the same rule now cuts deeper: **2,225
words down to 831, 63% where it used to be 49%.** Worth a look at some point —
831 words across three modules is thin even for "a mile wide, an inch deep", and
nobody has decided that is the right depth.

### The film 17 fix, and why it is not the fix we wanted

Film 17 opened on script 2's probability bars with *"Remember these?"*, but it
sits 2nd in Module 2 and script 2 sits 8th. It asked for a memory the viewer had
no way of having.

**The obvious fix — move `m2-parameters` after `m2-next-token` — breaks the
article.** Module 2 runs *training data → parameters → learning stops*, and that
is a chain rather than a list. The parameters section is the one that says the
settings are adjusted during training, and the section after it opens
**"Because learning happens during training and then stops…"**. Pull the middle
section out and that conjunction refers to nothing, and the parameters prose
lands inside the inference walkthrough where it does not belong. Checked by
reading all three sections, not assumed. The prose order is right. It was the
film that was wrong for the slot.

**So the film was cut, not re-recorded.** The whole callback lives in the first
5.6 seconds: "Remember these?" is spoken at 1.81–2.50s, 3.6s of silence follows,
and the burned-in caption clears between 5.4s and 5.6s. Trimming the head at
5.6s removes the beat whole. The film now opens on *"Where do those numbers come
from?"* over bars that are already complete, with the honu sentence above them —
self-contained, and it reads cold.

**1:37 to 1:31**, re-encoded from the untouched `.mov` master at the same
settings as the other eighteen. No voiceover was re-recorded, the poster still
points at a frame that exists, and reverting is a re-encode from the master.

**Film 13's version of this is left open.** Same prose argument applies to
Module 3, and at one beat and one lesson early, a closed book is a weak enough
callback that a viewer who has not seen script 3 just reads it as a closed book.

### How it was tested

**69 assertions, both editions, all passing**, against the merged tree. The
overlay's reduction was measured rather than assumed, and the non-prose blocks
were counted before and after `gist()` to confirm the two it drops sit past
position 2, which is the rule working rather than failing.

The trim was verified three ways: a silence map of the new opening (0.53s, then
the question), frames at 1s intervals confirming no *"Remember these?"* caption
survives, and the new duration read back off the file.

Not tested: anything in a real browser. **The four portrait films have still
never been looked at on a screen or a phone**, and film 17 now has a trimmed
head on top of that.

### Open / next

- [ ] **Look at the four portrait videos in a browser.** Still the oldest open
      item, and film 17 is now a fresh cut as well.
- [ ] **Decide whether the community edition is too thin at 831 words.** The
      overlay rule did not change; her prose got tighter underneath it.
- [ ] **Ask Sam about script 19's cultural read**, and about its title — written
      as *It sounds just as sure*, delivered as `the-uneven-library.mp4`.
- [ ] Film 13's forward reference, if it is worth the same treatment.
- [ ] **Do not `git push dokku main` without thinking.** Unchanged from
      yesterday: the live build still has the staff/partners `?for=` switcher
      and `main` has had no `audiences` block since `26fbde8`, so deploying as-is
      deletes it. Recoverable from `53abaf9`.
- [ ] Certificate Apps Script still undeployed. **Edit `ALLOWED_ORIGINS` first.**
- [ ] Feedback Apps Script still mails a "LLM/NLP 101" subject until
      `tools/feedback-apps-script.js` is re-pasted into it.
- [ ] `assets/llm-nlp-101.pdf` and its slides still carry the old course name.
- [ ] White paper: five old-name mentions, three citation years that disagree
      with the Sources entries, Wei uncited in the body.
- [ ] `ai.purplemaia.org` — still needs David.

---

## 2026-10-26 (latest) — Quiz: right answers get stamped, good results get sealed

**Who:** splimon, with Claude Code
**Branch:** `community-hub`
**State:** working tree only
**Files:** `assets/app.js`, `assets/styles.css`, `HANDOFF.md`

### Why
Getting a quiz question right felt the same as any other click. The ask was to
make it feel exciting, without turning a learning page into a game show.

### What changed
- **The stamp (`renderQuiz()`, `.just-stamped`).** A right pick dips like a
  stamp hitting paper. Its mark lands from a slight lift, Violet Wash floods
  out across the row from the mark, the tick draws itself in, and a few violet
  flecks spatter off. About 0.7s, and nothing waits on it. A wrong pick, or the
  right answer shown after one, gets no ceremony.
- **Streak pill.** "2 in a row", "3 in a row"… beside the question counter. It
  pops on each new right answer and quietly disappears on a miss.
- **Sealed result at 80% or better (`drawSealed()`).** The end card becomes a
  Violet Wash panel. One dot per question fills in order (hollow for a
  miss) while the score counts up beside it, then a violet seal stamps down
  and the wash floods out from it. It shows the percentage, a "New best" pill
  when the run beats the saved best for that quiz, and, on a module quiz, an
  "On to Module N" button (or "Back to all modules" after the last). Focus
  moves to the score. A perfect run turns the number violet. Under 80%, the
  card is unchanged: the one-line score and Try again.
- **Icons.** The ✓ / ✕ text glyphs in the answer marks are now drawn SVG
  strokes, the same tick as the contents rail.
- **Accessibility.** The explanation line is `role="status"`, so screen
  readers hear "Yes." / "Not quite." and the reason. Focus moves to "Next
  question" after answering, because the clicked option becomes disabled.
  Reduced motion drops every stamp animation and shows the finished state.

Because `renderQuiz()` is shared, Term match and Would you send it? get the
same treatment.

- **Explanation box.** `.quiz-why` lost its 3px violet left border (a
  DESIGN.md Don't) for a 1px hairline all round.

### Open / next
- `.corpus-punch` (the corpus activity's callout) still has a 3px coral left
  border, which DESIGN.md also rules out. Left for a decision.

---

## 2026-10-26 — Module articles rewritten for a general audience

**Who:** splimon, with Claude Code
**Branch:** `community-hub`, on top of `a663585`
**State:** working tree only
**Files:** `content.js`, `index.html`, `README.md`, `PRODUCT.md`, `HANDOFF.md`

### Why
The site's purpose is teaching the basics of AI (what it is, how it works, how
to use it well) to a wide, general audience. The module articles still read
like the white paper and carried staff framing ("For Purple Maiʻa, this is a
central concern", "your organization, its records", a grant-funder prompt).

### What changed
- **Module titles:** "What is AI?", "How AI chatbots work", "Using AI well"
  (were "What is generative AI?", "How an LLM works", "Using LLMs well"). Also
  changed in the JSON-LD `hasPart`, the README table and PRODUCT.md.
- **Every section rewritten in plain words.** Each technical term is bolded and
  explained the first time it appears, and the reader meets "AI chatbots like
  ChatGPT, Claude and Gemini" before meeting "LLM". Headings are plainer too
  ("Two phases: learning, then answering", "When it makes things up",
  "You're still responsible").
- **More on using it well:** prompting now has a checklist (what, who, how
  long, what to work from), an everyday weak/strong example and a line on
  follow-ups. Privacy names concrete things to keep out. Bias ends with a habit
  ("ask who would actually know, and go to them"). Oversight ends with a test
  ("if you wouldn't put your name on it without reading it, don't send it").
- Module 1 gained a `lede`. Module word counts went from 251 / 1,285 / 1,129 to
  301 / 1,425 / 1,322, so read times are about 2 / 7 / 7 min.
- **Staff examples swapped for everyday ones** in the quizzes and scenarios:
  funder update → work update or landlord email, Keiko's grant bio →
  neighborhood-newsletter bio, haumāna's assessment → your child's test
  results, partner → someone. Hero tagline and meta descriptions now say
  "how to use them well".

### Decisions worth knowing
- **No ids or structure changed.** Every module, section and part `id`, every
  `lesson` link and every `sources` list is the same as before (checked in
  node against HEAD). Deep links and reading progress still work.
- **No new factual claims.** The rewrite keeps each section's claims and
  sources. The added material is practical advice, not facts that need a citation.
- **The Hawaiian examples and research stay**, with glosses (ʻōlelo Hawaiʻi,
  kumu, Kaiapuni). The Indigenous-alignment line was widened to "any community,
  and especially Indigenous communities". Someone who runs those rooms should
  read the bias, training-data and alignment passages before this ships.

### How it was tested
`node --check` on both JS files, JSON-LD parses, and all three modules render
in headless Chrome with the new titles and section counts.
**Not checked:** a real browser or phone.

### Later the same session: Reference page, and the phone contents list
- **"In this module" on phones** (`assets/styles.css`, the 980px rule). The
  desktop sticky rule's `top: calc(var(--header-h) + 30px)` was still applied
  once the list became `position: relative`, which pushed it 92px down. That
  left a gap above it and made it overlap the first heading. The fix is
  `top: auto`. Measured over the DevTools protocol with a real mobile viewport:
  40px clear above the article at 390 and 820 wide, and no horizontal scroll.
  The right-edge "clipping" seen earlier was an artifact of
  `--window-size` screenshots, not a bug.
- **Reference copy written for a general reader:**
  - Glossary: plainer definitions for LLM, embedding, transformer, attention,
    greedy decoding, temperature, hallucination, proprietary model and agent.
  - Prompts: "Bio for a funder" is now a generic "A short bio", and there's a
    new "Explain it simply" prompt.
  - FAQ: plainer answers, a new "Which AI chatbot should I use?" (it doesn't
    name a pick), and the internal "Sovereign Stack / 200-level" mention is gone.
  - Section blurbs in `index.html` reworded.
- **Fixed stale Resources entries.** Crash Course and LearnThatStack were
  described as "embedded" in modules they no longer play in. The Māori data
  sovereignty video was "linked from" a lesson whose links no longer render.
  "Purple Maiʻa originals" told readers to "open a lesson". "Sources cited in
  the deck" is now "Research behind the course", with each entry pointing at
  its Module 3 section.
- **Left exactly as written:** the feedback and certificate FAQ answers and
  the "quizzes graded" answer, because their wording is deliberately precise.

### Later still: a more professional register
The owner asked for the articles to read slightly more professional while staying
beginner-friendly. Contractions and chatty asides are gone ("That's a fine
everyday meaning", "Here's the most important point"). Headings now lead with
the proper term followed by a plain gloss ("Hallucinations: confident but false",
"Training and inference: learning, then answering"). Several white-paper headings
are back, because they suit this register: "Recommended practices", "Human
judgment and oversight", "Privacy and data retention", "Reasoning, and what it
is not". The owner's three edits made beforehand (the AI definition, the Module
2 summary and "hallucinations" in the Module 3 summary) were kept word for word.
Ids and structure are unchanged, checked against HEAD.

### Later still: quizzes and Reference in the same register
- **Every quiz question now tests its own module's article.** Questions that
  relied on details found only in the videos or old lessons were replaced:
  "attention heads", Python-the-snake, the honu example and "indistinguishable
  is four tokens". The context-window explanation no longer says old text is
  "gone" (the article says it may be dropped, summarized or given less weight).
  The next-token distractor "trained to never admit uncertainty" was removed,
  because Module 3 says something close to it is true. New questions cover
  machine learning, the water-channel comparison, open weights, RLHF, agents,
  follow-up prompts, RAG and why hallucination is not lying. Module 2's article
  gained one sentence (letter-counting under Tokenization) so its tokenization
  question is backed by the text.
- **Term match is per module** (`assets/app.js` `matchItems(n, track)`).
  Glossary entries carry `module`, and `match-1`/`2`/`3` replace the single
  `match` with `module: "all"`, which used to put Module 2 terms in Module 3's
  quiz. Module 3 gained three glossary terms so it has enough to draw from:
  Bias, Data retention and Human oversight. Greedy decoding and Proprietary
  model have no `module`, because no article teaches them.
- **"Would you send it?"**: the meeting-notes question was rewritten so the
  options make sense as answers. The AI-disclosure scenario (not taught
  anywhere) became a privacy scenario, which the Privacy section does teach.
- **Register:** quizzes, demo blurbs, glossary, prompt notes, the FAQ and the
  Resources descriptions now match the articles. "Questions people actually
  ask" is now "Frequently asked questions" everywhere. The "Research behind the
  course" entries quote the current section headings (checked by script).
- **Tested:** in headless Chrome over the DevTools protocol. Question counts
  are 14 / 30 / 21. A script clicked through every question in each module and
  confirmed each Term match used only that module's terms and that the quiz
  reaches its results screen.

### Open / next
- [ ] Cultural read of the training-data, alignment and bias passages.
- [ ] **The certificate is off** (`certificate.endpoint` is `""`), but two
      FAQ answers still describe asking for one. Either turn it on or trim
      those answers.
- [ ] Look at the contents-list fix on a real phone.
- [ ] Lesson titles (the video captions) still use some jargon: "AI, ML, NLP,
      generative AI, LLMs", "Probabilistic vs. deterministic".
## 2026-10-26 (evening) — Nineteen of nineteen, and Sam's four merged in

**Who:** Keneth, with Claude
**Branch:** `main` at `50cf9f0`, then merged down to `community-hub`
**State:** committed and pushed. **Not deployed.**
**Files:** `content.js`, `README.md`, `HANDOFF.md`, `assets/video/{where-the-odds-come-from,ask-it-twice}.{mp4,jpg}`, plus Sam's eight via merge

### What changed

**Every lesson now carries Purple Maiʻa's own video.** Sam's 13, 14, 15 and 19
came in on her `community-hub`; 17 and 18 were cut here. That is the last six
stand-ins gone, 19 of 19, 32:01 of film.

**Her branch merged clean into `main`.** Despite its name, `sam/community-hub`
carries *main's* `index.html`, not the community one — checked before merging,
because merging the community `index.html` onto `main` is exactly the trap from
23 October. Her four lesson edits and our two touch different hunks, so there
were no conflicts.

**Videos 17 and 18 are 9:16.** Same as 1 and 16: shot for social, exported onto
a 1920×1080 canvas, so both carry `videoAspect: "9/16"` and the page crops the
pillarbox off at display time. `cropdetect` gives `608:1080:656:0` on both —
centred on 959.5, and 9/16 of 1080 is 607.5 — so the crop is symmetric and
exact and **nothing is re-encoded**. All four of Sam's are true landscape and
need no such line.

**Posters are caption-free frames found by looking**, at 1:04 and 1:02. Both
films carry burned-in captions nearly end to end, so a threshold scan is no use
here; the two gaps were found by rendering candidates and looking at them.

**The stand-in copy is retired in five places.** The FAQ, the pathways blurb,
two `content.js` comments and the README all still described a page with
outside explainers on it. Details in `50cf9f0`. The *machinery* stays — it is
keyed to the kind of video rather than a flag anyone has to clear, so it costs
nothing and comes back on its own if a lesson ever goes back to an explainer.

**`duration` turns out to be dead data.** It is not read by `app.js` anywhere;
the module cards compute minutes from word count. Worth knowing before anyone
spends time reconciling it — the long-standing "two clocks" note in
`content.js` is about a number nothing draws.

### Decisions worth knowing

**The 128 wpm planning figure is retired.** All six remaining scripts were
timed at it, and five of six came in long — scripts 14 and 15 by 52 and 50
seconds. Measured across all nineteen films, delivery spans **79 to 155 wpm**,
mean 111, and nothing in a script predicts where it lands: 13 and 15 are within
twenty words of each other and came in fifty seconds apart. `VIDEO-SCRIPTS.md`
now says plan at 111 and expect ±40%.

**Two films call back to a film the viewer has not reached yet.** This is a real
defect and the shoot made it permanent in the film, but it is fixable by
*lesson order*:

| Film | Sits at | Calls back to | Which sits at |
|---|---|---|---|
| 17, as its cold open — *"Remember these?"* | `m2-parameters`, 2nd of 11 | script 2's bars | `m2-next-token`, **8th** |
| 13, one beat at 0:09 | `m3-grounding`, 2nd of 6 | script 3's closed book | `m3-hallucinations`, **3rd** |

17 is the bad one: it opens by asking for a memory nobody has yet. Moving
`m2-parameters` after `m2-next-token` and swapping `m3-grounding` with
`m3-hallucinations` fixes both and touches no film. **Left alone deliberately**
— it changes the teaching sequence Sam designed, so it is her call, not a repo
chore.

### Held back deliberately

**Script 19's cultural read is not recorded anywhere.** The script says it
should get one before shooting, the same as script 1 did, because it is the
second film that speaks about Hawaiian knowledge. It has now been shot. That
read may well have happened off the repo — but nothing here says so, and this
is the one film where it matters most. One question to Sam settles it.

**Script 19 shipped under a different title.** Written as *It sounds just as
sure*, delivered as `the-uneven-library.mp4`. The site uses the file so nothing
is broken, but the two names should be reconciled before either is cited.

**Nothing was deployed.** See the trap below.

### How it was tested

The jsdom suite from 23 October, extended: **69 assertions, both editions, all
passing.** Every one of the 19 `file:` videos and its poster confirmed on disk,
every lesson reachable from a section, no section pointing at a missing lesson,
the portrait count in Module 2 now 3 rather than 1, and no dead in-page anchors
in either edition.

Speaking rate was measured rather than claimed: voiceover word counts parsed out
of `VIDEO-SCRIPTS.md` against `ffprobe` durations for all nineteen files.

Not tested: anything in a real browser. **The four portrait films have still
never been looked at on a screen or on a phone.** The crop is arithmetic, and
that arithmetic is now carrying four films instead of two.

### Open / next

- [ ] **Look at the four portrait videos in a browser.** Oldest open item in
      this log, and it just doubled in weight: 1, 16, 17, 18.
- [ ] **Ask Sam about script 19's cultural read**, and about the title.
- [ ] **Decide the two lesson-order moves above**, or decide to live with them.
- [ ] **Do not `git push dokku main` without thinking.** It looks like pure
      upside and is not: the live Dokku build still carries the staff/partners
      `?for=` switcher, and `main` has had no `audiences` block since Sam's
      rebuild (`26fbde8`). Deploying `main` as-is **deletes `?for=partners`
      from the live site.** Restore `audiences` first — it is recoverable from
      `53abaf9` and every bit of switcher code is still in `app.js` — or accept
      losing it on purpose. The live site is now a month behind and has none of
      the 19 videos, so this will keep looking tempting.
- [ ] Certificate Apps Script still undeployed, `certificate.endpoint` still
      `""`. **Edit `ALLOWED_ORIGINS` before deploying it.**
- [ ] The deployed feedback Apps Script still mails a "LLM/NLP 101" subject
      until `tools/feedback-apps-script.js` is re-pasted into it.
- [ ] `assets/llm-nlp-101.pdf` and its slides still carry the old course name.
- [ ] White paper: five old-name mentions, three citation years that disagree
      with the Sources entries, Wei uncited in the body.
- [ ] `ai.purplemaia.org` — still needs David.

---

## 2026-10-26 (later) — Video 19 on bias

**Who:** splimon, with Claude Code
**Branch:** `community-hub`, on top of `5698c58`
**State:** working tree only
**Files:** `content.js`, `README.md`, `HANDOFF.md`, `assets/video/the-uneven-library.{mp4,jpg}`

### What changed
`m3-bias` (Module 3, "Bias and missing cultural context") now plays Video 19,
"The Uneven Library" → `the-uneven-library.mp4` (1:13), in place of the
outside explainer `youtube:gV0_raKR2UQ`. Same handling as videos 13–15 below:
passthrough remux to put `moov` first, 960×540 poster at 7s (the "Mostly
English" shelves). FAQ and README now say 17 of 19.

### How it was tested
`node --check`; `content.js` loaded in node shows 17 `file:` lessons, all with
`.mp4` and `.jpg` on disk; atoms on the output are `ftyp, moov, mdat`.
**Not checked:** playback in a browser.

### Open / next
- [ ] Still on stand-ins: `m2-parameters`, `m2-sampling`.

---

## 2026-10-26 — Videos 13, 14 and 15 replace three more stand-ins

**Who:** splimon, with Claude Code
**Branch:** `community-hub`, on top of `d8694a9`
**State:** working tree only
**Files:** `content.js`, `README.md`, `HANDOFF.md`, `assets/video/` (three new `.mp4` + `.jpg` pairs)

### Why
Three more of Purple Maiʻa's own videos were delivered, each matching a section
that was still on an outside explainer.

### What changed
- `m2-transformers` (Module 2, "Transformers and attention"): Video 15, "Which words matter" → `which-words-matter.mp4` (2:52).
- `m3-grounding` (Module 3, "Grounding and retrieval-augmented generation"): Video 13, "Show me the receipts" → `show-me-the-receipts.mp4` (2:02).
- `m3-model-families` (Module 2, "Model families, open weights and agents"): Video 14, "Which one said it" → `which-one-said-it.mp4` (2:35).
- The FAQ answer and README §"Outside videos are stand-ins" now say 16 of 19 videos are ours (they still said eight).

### Decisions worth knowing
- **Remuxed, not re-encoded.** The deliveries were already H.264/AAC 1920×1080
  but had the `moov` atom at the end, so a browser had to download the whole
  file before playing. They went through an AVFoundation passthrough export
  with network optimisation (the `+faststart` equivalent; ffmpeg is not
  installed on this machine). Same streams, index moved to the front.
- **Posters** are 960×540 frames like the others: 86s of video 15 (the
  honu–swam "strongest link", the lesson's own example), 98s of video 13 (an
  answer with citations beside its source), 124s of video 14 (proprietary
  families next to open models). Captions are burned in throughout, so every
  frame carries one.

### How it was tested
`node --check` on both JS files. Loaded `content.js` in node: 16 of 19 lessons
are `file:`, every `file:` video and its `.jpg` exist on disk, and the three
sections resolve to the new files. Top-level atoms checked on all three outputs.
**Not checked:** playback in a browser, and `docker build`.

### Open / next
- [ ] Still on stand-ins: `m2-parameters`, `m2-sampling`, `m3-bias`.
- [ ] Watch the three in the page once, on a phone as well.

---

## 2026-10-23 (later) — Sam's rebuild merged, and everything of ours moved onto it

**Who:** Keneth, with Claude
**Branch:** `main` at `8bd2df8` (Sam's work, fast-forwarded), `community-hub` at `22cef10`. Both pushed.
**State:** committed and pushed to GitHub. **Not deployed.**
**Files:** `content.js`, `community.js`, `index.html`, `assets/app.js`, `assets/styles.css`, `.gitignore`, `assets/video/*` (four new files)

### Why

Sam opened and merged a pull request on her own fork
(`splimon/AI-101-Community-Site`, `community-hub → main`) rather than against
this repo, which is why nothing showed up in our PR list. She had branched from
`53abaf9`, so the merge base was clean and `main` fast-forwarded to her work
with her authorship intact. Keneth saw the result, liked it, and asked to take
her version and line our work up with it.

### What changed

**Sam rebuilt the page as three module articles written from the white paper.**
A router with three views (`#/`, `#/reference/<section>`, `#/module/<id>`),
reading progress measured by section rather than by ticked-off lesson card,
three placement questions under the module cards, and a live feedback endpoint.
The lesson grid, the lesson dialog, the track filters and the ring progress card
are gone. About 1,900 lines added and 1,200 removed across eight files.

**Her shape won everywhere the two sides disagreed.** Thirteen conflict hunks;
only two were resolved by writing something new, both of them FAQ copy, and both
because her text had become untrue rather than because it was worse.

**Four pieces of ours hung off markup she deleted and had to move:**

| What | Was | Now |
|---|---|---|
| Certificate button | in the progress card | in her progress row under the headline |
| `certEarned()` | counted ticked-off lessons | reads `moduleProgress()` |
| The certificate payload | lessons done / total | the same module measure |
| `#lesson-<id>` deep link | opened the lesson dialog | deleted; her router has `#/module/<id>/<section>` |

**Videos 1 and 16**, on `m2-training-data` and `m1-daily`, taking it to **13 of
19**. These two are a different shape from the other eleven — see below.

**`community.js` survived the rewrite without being rewritten.** It has always
edited the content rather than the markup, so the overlay still applied. It
needed a new rule for the articles, new hero bindings, and four dead levers
removed.

### Decisions worth knowing

**The certificate and the progress line now read the same number.** They used to
measure different things — the certificate counted lessons, the page counts
sections plus module practice — which would eventually have told one learner two
different stories about whether they had finished. `certEarned()` calls
`moduleProgress()` now. If you change how progress is counted, both move
together.

**`gist()` is the inch-deep rule, and it is a rule, not a rewrite.** Each article
section is cut to its opening block, plus a list, table or set of steps when the
opener points straight at one. This works because the white paper is written
topic-sentence first: every section opens with a block that states the whole
idea and the blocks after it qualify or give examples. 49% shorter, 2,544 words
down to 1,295, and **no sentence on the community page is written anywhere but
`content.js`.** New prose written on `main` arrives here already shortened. That
is the whole argument for the overlay; do not start writing community copy into
`community.js`.

**Two FAQ answers had to be rewritten rather than picked.** Hers call the
feedback button "the single exception" on the page that sends anything, which
the certificate makes false, and they omit the audience and the address from the
list of what feedback actually sends. Both now name both senders and list the
whole payload, in her module-and-section vocabulary. This is the claim a sharp
reader at a partner org will test, so keep it exact.

**Her `mailto` fix is kept, with our subject line.** She fixed a real bug — each
address has to be encoded separately or a comma-separated list stops being a
list. Her version hard-codes "LLM/NLP 101" in the subject, which would have the
community edition mailing about a course it does not teach, so the dynamic
`event.shortName` went back in.

**Videos 1 and 16 were shot 9:16 for social.** They were exported onto a 1920×1080
canvas, so the files carry black bars either side that the other eleven do not.
The pillarbox is symmetric and what is left is exactly 9:16, so a lesson can now
declare `videoAspect: "9/16"`; the frame takes that shape and the video is set to
`cover`, which crops the bars off at display time. **Nothing is re-encoded**, so
if Sam re-exports these two as landscape, drop the `videoAspect` line and the
page goes back to normal with no other change.

**Their posters are cut from the portrait region**, at 39s and 70s. Both films
carry burned-in captions almost end to end — the band scan found no clear window
at all in video 1 and a single 1.5s one in video 16 — so these were chosen by
looking at frames rather than by threshold. 39s is the scraped-text pile with
ʻōlelo Hawaiʻi rated weak, which is the lesson's actual point; 70s is all three
rings labelled and filled.

**`assets/video/*.mov` is now ignored.** Sam delivers masters of 25 MB and up,
nothing on the site reads them, and only the built `.mp4` and its `.jpg` poster
belong in the repo and the image. Two were sitting untracked, one `git add -A`
away from going in.

**The branches were put the right way round.** The overlay design says shared
content lives in `content.js` on `main` and the community edition inherits it,
but five video wirings, the portrait-video support, the certificate and the river
had all landed on `community-hub` and never came back. The staff edition was
showing 8 videos while the inch-deep community edition showed 13, and only the
community edition could issue a certificate. All of it moved down to `main`.

**`community-hub` is now `main` plus one file.** Its `index.html` differs by the
title and description, the pre-launch meta block, the three JSON-LD names and the
header fallback, and one `<script src="community.js">` tag. Thirty-eight lines.
Nothing else on the branch is its own, so `git merge main` from there should be
boring, and if it ever flattens that file, putting it back is the whole fix.

**`main` ships `community.js` without loading it.** Deleting it from `main` looks
tidier and is a trap: the next merge down would carry the deletion with it and
quietly take the community edition apart. There is a note at the top of the file
saying so. The README now has a section on all of this.

### Held back deliberately

**The course was renamed, same session.** `main` had been calling itself two
things: `content.js` said `Artificial Intelligence 101`, which `app.js` writes
into the browser tab, while the static `<title>`, `og:title`, `twitter:title` and
both JSON-LD names still said "LLM/NLP 101". Keneth's call is **Artificial
Intelligence 101**, so that went through index.html, the README, the mail-subject
fallback, `certificate.courseName` and both Apps Script setup notes.

**Two generated assets carried the old name as pixels**, so they were rebuilt
from source rather than left to contradict the page: `assets/social.png` (the
og:image) and `assets/qr-slide.png`. The longer name wraps to two lines on the
card and three on the slide, and both still sit inside their frames. Both QR
images were rescanned with `tools/check-qr.js` afterwards and still resolve to
the canonical URL. `qr.svg` and `qr.png` carry no text and the URL did not
change, so they were left alone.

**`community-hub` is still "Intro to AI".** Every conflict in that merge was the
same question and got the same answer: the edition keeps its own name. The one
exception is the mail-subject fallback, which names the course because it only
fires when the overlay has not set `shortName`.

**The community edition's pre-launch meta was left exactly as it was** — no
canonical, no `og:url`, `noindex`, and a relative `og:image`. That is deliberate,
the comment above it is the launch checklist, and taking main's absolute URLs
would have pointed this edition's link preview at the staff card.

**Nothing was changed on Sam's fork, and no PR was opened back to her.** She
pulls from upstream now.

**Both Apps Scripts are still as they were.** Feedback is live — that endpoint is
Sam's, already deployed and collecting. The certificate's is still `""`, so the
feature is invisible in production, and `ALLOWED_ORIGINS` still needs editing
before that one is deployed.

### How it was tested

A new suite boots **both editions** in jsdom against the merged files and checks
what the merge could plausibly have broken: **57 assertions, all passing.** The
router, the module cards, the certificate's new progress model and its position
in her hero, the portrait frame before and after the poster is pressed, that
every `file:` video and its poster exist on disk, that every one of the 19
lessons is reachable from a section, that no section points at a missing lesson,
and that neither edition contains an in-page anchor the router cannot follow.

The overlay's reduction was measured rather than assumed: 2,544 words of article
prose to 1,295, with the block counts printed per section to confirm that the
two sections whose opener introduces a table kept the table.

Not tested: anything in a real browser. The portrait `cover` crop is arithmetic —
the pillarbox is symmetric and the remainder is exactly 9:16 — but it has not
been looked at on a screen, and it has not been looked at on a phone.

### Open / next

- [ ] **Look at the two portrait videos in a browser.** Everything else here was
      verified by test; this one was reasoned out. It is the first thing to
      check.
- [ ] **Two things still say "LLM/NLP 101" and neither can be fixed by editing
      a file.** `assets/llm-nlp-101.pdf` — both the filename and the deck's own
      slides. And the deployed feedback Apps Script, which keeps mailing the old
      subject line and writing the old document title until the updated
      `tools/feedback-apps-script.js` is pasted back into the editor. Five
      minutes, and worth doing before the next Friday digest.
- [ ] The white paper still calls it LLM/NLP 101 in five places, including the
      running footer, and `VIDEO-SCRIPTS.md` in one. Both are gitignored, so that
      is a local edit — and for the paper, a re-export of a PDF already in
      circulation.
- [ ] **The live site is now three weeks behind.** Dokku is still on `e012b70`.
      `assets/video/*.mp4` returns 404 in production — **none of the 13 videos
      are live.** Still needs the same decision first: which branch is the public
      face, `main` or `community-hub`?
- [ ] Deploy the certificate Apps Script, and **edit `ALLOWED_ORIGINS` first**.
      Feedback is already live.
- [ ] Six lessons still on stand-ins: `m2-parameters`, `m2-transformers`,
      `m2-sampling`, `m3-grounding`, `m3-bias`, `m3-model-families`. Scripts
      exist for all six, so this is shooting work, not writing work.
- [ ] `ai.purplemaia.org`. Unchanged: three QR assets, the QR printed into deck
      slide 4, and the URL hard-coded twice in the white paper.
- [ ] The hero no longer claims a total time, so the old "~95 min" problem went
      away with the rebuild. Worth deciding whether the module cards' "about N
      min read" figures count the videos.
- [ ] `README.md` is Sam's rewrite now and describes the module structure, but it
      still carries the old find-and-replace instruction for a domain move.
      Re-check it before anyone acts on it.
- [ ] White paper: three in-text citation years still disagree with the Sources
      entries, and Wei is still uncited in the body.
- [ ] Sam's fork is level with `main` — her commits are `main` now. She pulls
      from upstream from here, and `community-hub` carries an overlay and a
      certificate she has not seen.

---

## 2026-10-23 — One site for everyone: three module pages from the white paper

**Who:** splimon, with Claude Code
**Branch:** `community-hub`, on top of `53abaf9`
**State:** working tree only
**Files:** `content.js`, `index.html`, `assets/app.js`, `assets/styles.css`,
`README.md`, `HANDOFF.md`, `.dockerignore`, new `PRODUCT.md` and `DESIGN.md` (design context,
kept out of the image by `*.md`), new `.impeccable/` (design tooling, now in
`.dockerignore`)

### Why
The page is turning into a community resource. A first-time visitor on their
own was landing on staff framing ("Staff learning asset", "Purple Maiʻa
all-staff") and an audience switcher. The ask was one generic page with the
lessons and practice easy to reach, and the three placement questions as the
first thing you see.

### What changed
- **Hero:** the headline is now "Not sure where to start with AI?" (new
  `event.headline`; `event.name` stays the title and brand). The placement
  quiz moved out of "Where should I start?" and into the hero as a card that
  opens on question 1. Answers vote for a module and the result button opens
  the lessons on it. Two plain links skip straight to the lessons or the
  activities, with a quiet "3 modules · 19 lessons · 7 activities" line under
  them.
- **Progress:** the progress card is gone. A small ring and count appear in the
  hero only once at least one lesson is ticked off.
- **Audiences:** all four carry `draft: true`. With none published, the existing
  code renders the plain page: no "Viewing as" bar, and `?for=` and any saved
  audience are ignored.
- **Generic copy:** tagline, intro, the third start card ("I need to get this
  right"), and placement Q1 and Q3 (no more "in a meeting", "colleagues",
  "funders"). "Six things to play with" became "Seven" (there are 7),
  "Every term we used today" became "Every term on this page", and the
  *Would you send it?* blurb lost "a week of actual work". The OG image alt
  text no longer says "staff learning asset".
- **The section below the hero** is now "Or pick a starting point yourself",
  with the same three cards.

### Decisions worth knowing
- The hero `facts` now show counts only. The "~95 min" self-paced and "~59 min"
  live figures were stale (README §5) and are no longer displayed. Nothing was
  recomputed.
- The quiz still shuffles options, never stores answers, and moves focus to the
  new question after each answer so keyboard and screen-reader users keep
  their place.
- On narrow screens the hero reorders to headline, questions, then the skip
  links, so the questions are still the first thing you reach.
- The eyebrow badge was dropped from the hero. `event.badge` is blank, and the
  `<title>` falls back to just the name.

### Held back deliberately
- Staff and partner copy is kept in `content.js` as drafts, not deleted.
  Community workshop and kupuna still need a cultural review before any reuse.

### How it was tested
- `node --check` on `content.js` and `assets/app.js`.
- Headless Chrome in light and dark at 1440 wide, plus 390 and 820 wide in
  iframes. The answered states were checked too: question 2 of 3, and the
  result card in both themes.
- Not tested: a real screen reader, or the Docker build.

### Later the same day: module pages from the white paper
The quiz-first hero above was replaced. The home page now shows three module
cards (Microsoft "AI 101" style, Purple Maiʻa look). Each opens a module article
at `#/module/<id>` with the header layout and right-hand "In this module" list
the team picked from sketches in `.impeccable/mocks/modules/`.
- **Content:** `modules`, `why` and `sources` in `content.js`, written from
  "AI 101 Learning Materials" (the white paper). All 19 lessons map to exactly
  one section, so each video sits where it is explained. "Model families" moved
  from Module 3 to Module 2 to follow the paper. "Communicating about AI in
  public" was left out, and "Why this matters" became the short "Why we made this".
- **Sources:** all 18 were checked against their live pages. Anthropic's link
  moved to platform.claude.com, Ji et al. shows Crossref's "1–38" because
  "Article 248" could not be confirmed, and three NeurIPS papers got
  proceedings links. Fix the paper's Anthropic link and its p. 10 takeaway too.
- **Removed:** the lesson grid, the lesson dialog, the pathway cards, the
  Practice section and the progress ring, all now carried by the modules.
  Activities render at the end of their module (Term match closes Module 3).
- **Tested:** routing, old lesson links, video swap-in, practice and placement
  were driven in headless Chrome. Light and dark were checked at 1440 and 390 wide.

### Open / next
- [x] Step 3, progress: read sections live in `aihub:read`. Reading a section
      also adds its lessons to `aihub:progress`, so old lesson ticks count as
      read sections. Practice is done once `aihub:quiz["module:<id>"]` exists.
      Tested in a real headless Chrome over the DevTools protocol, because
      `--virtual-time-budget` never fires scroll events.
- [x] Step 4, Reference: the glossary, prompts, FAQ and downloads moved to
      their own page at `#/reference/<section>`, linked from four cards on
      the home page and from the header. Old `#glossary`-style links redirect.
      The glossary gained the paper's 13 missing terms (33 in all) and renders
      A–Z. Five FAQ answers that described the old page were corrected, and the
      "Viewing as" question was removed. The footer no longer says "internal".
- [x] Final pass: every view checked in light and dark at desktop and phone
      width. A keyboard walk found focus rings on every stop. "In this module"
      now comes before the article in the page order (still on the right
      visually), and nothing counts as read until the first scroll. The quiz
      counter no longer wraps. The JSON-LD module names follow the new
      modules, and the placement result no longer quotes a stale 25 minutes.
      README, PRODUCT.md, DESIGN.md and `.impeccable/design.json` describe the
      module site.
- [x] Later: the owner trimmed `content.js` and removed `placement`,
      `audiences` and `why`. Every cross-reference was checked (lessons,
      quizzes, sources, practice modules, files on disk) and every view loaded
      with no errors. Their containers on the home page simply stay hidden.
- [x] Home progress line fixed. It always shows (0% and "Not started yet" on a
      fresh visit), so Reset no longer makes it vanish; only the Reset link
      hides. The bar and the words now measure the same thing (sections read
      plus practice finished, across the course), and a card whose practice is
      done says so beside its section count.
- [x] Practice is now one "Check your understanding" per module. The question
      activities fold into it (Module 1: 8 questions, Module 2: 17, Module 3:
      19), and "Try it yourself" is gone. The four demos moved into the
      sections they illustrate, set by a new `section` field on each practice
      entry. A section with sub-sections now lists its sources after them.
- [x] Header links to Glossary, Prompts, FAQ and Resources now land with the
      section heading 27px under the header, instead of showing the end of the
      section above it. Jumps target the `.section-head`, and the scroll
      margins no longer add the header height a second time on top of
      `html { scroll-padding-top }` (the same double offset was on module
      sections, which now land 21px under the header).
- [x] Home page: all three module buttons are filled violet (only the next
      module's used to be). The navbar is frosted glass on home only
      (`.site-header.is-glass`, set by `route()`), and the hero glow was
      removed, so the title band is the same plain colour as the navbar.
- [x] Home: a hairline divides the title band from the module cards, drawn
      inside the content column (`.hero-inner::after`).
- [x] Phones: the longer site name "Artificial Intelligence 101 | Purple
      Maiʻa" pushed the search, theme and menu buttons off the screen at 390px
      and below, so the navigation was unreachable. The name now wraps under
      560px; the buttons were checked in view at 390, 360 and 320px.
- [x] Motion: Home, module and Reference pages cross-fade with a small
      settle (View Transitions; instant where unsupported). Contents links
      glide, and a glide never counts the sections it passes as read: a jump
      forgets earlier glimpses, ends only when scrolling goes quiet, and
      "on screen" excludes what is under the header. A violet marker follows
      the current section on the rail, and earned ticks draw in. Everything
      is instant under prefers-reduced-motion. Tested in Chrome only; a
      browser without View Transitions simply swaps the page, as before.
- [x] Scroll reveals across all three pages: content blocks fade up 16px as
      they enter the viewport, 60ms apart within a batch (capped at 300ms).
      `REVEAL_SEL` lists them; each element reveals once and then sheds the
      classes, so card hovers keep their own timing. Verified: nothing left
      hidden after scrolling any page, deep links land visible, reduce-motion
      shows everything at once.
- [x] Module cards play their video on hover (muted, looping, resumes where
      it paused). Lazy: the MP4 (5.7–7.9 MB, streamed) loads on first hover only.
      Skipped on touch, reduce-motion and data saver. A dedicated short
      preview clip per module would be lighter; `preview` in content.js takes one.
- [x] Module numeral centred on the header text both ways (`text-box` trim to
      cap height); left-aligned above the title on phones.
- [x] *(Not kept: on 2026-10-26 this was dropped in favour of the emailed-link
      certificate already on `main`. The code is in the git stash.)*
      Certificate of completion at `#/certificate` (`certificate` in
      content.js): every section read, and at least 70% on each module quiz
      (best attempt). The reader's name and the completion date live in
      `aihub:certname` and `aihub:certdate`, and Reset clears the date. It
      prints as one landscape Letter page or downloads as a PNG (http(s)
      only). Signer is blank; add a name and title once someone agrees.
- [ ] Found while building the certificate: `assets/pm-lockup.png` has a
      **white** wordmark, so the footer logo's "PURPLE MAIʻA" text is
      invisible in light mode. A dark-text lockup file would fix it.
- [ ] **Not run:** `docker build`. The Docker daemon was not running on this
      machine. The Dockerfile is unchanged and `.dockerignore` only gained
      `.impeccable`, but build and run it once before `git push dokku main`.
- [ ] **Not tested:** a real screen reader (VoiceOver), and Safari or Firefox.
      All browser checks were headless Chrome.
- [ ] `CLAUDE.md` (an untracked local file) still describes the lesson dialog,
      `?for=` re-skinning and `renderQuiz` for lesson quizzes as live.
- [ ] The sketches in `.impeccable/mocks/` were for choosing layouts. Delete
      them, or keep them as a record; they never ship (`.dockerignore`).
- [ ] Read the new placement wording (Q1 and Q3) with someone who runs community rooms.

---

## 2026-10-23 — Certificate, river prototype, three more videos, and a live site two weeks behind

**Who:** Keneth, with Claude
**Branch:** `community-hub`, now at `17e951b`. `login` at `55f474f`, `main` at `53abaf9`. All three pushed.
**State:** committed and pushed to GitHub. **Not deployed.**
**Files:** `content.js`, `community.js`, `index.html`, `assets/app.js`, `assets/styles.css`, `tools/certificate-apps-script.js`, `tools/river-prototype.html`, `assets/video/*` (six new files)

### Why

Three separate threads landed in the same week. The AF-builders meeting asked for
tracking on the page and floated login, progress and a certificate as stretch
goals. Sam delivered videos 10, 11 and 12. And a conversation about making the
material more engaging turned into the first interactive built from the white
paper's own analogy.

### What changed

**An optional certificate, signed in by emailed link.** Finish every lesson and a
button appears. Name plus email, a one-time link arrives, clicking it records the
completion and returns the learner to the page with a certificate and a `PM-`
verification code. No password is ever created. Config lives in `content.js`
section 15; the server side is `tools/certificate-apps-script.js`, a separate
Apps Script project from the feedback collector.

**Three more Purple Maiʻa videos**, taking it to **11 of 19**:

| Lesson | File | Length |
|---|---|---|
| `m2-loop` | `how-text-is-generated.mp4` | 1:45 |
| `m2-tokenization` | `it-reads-in-pieces.mp4` | 1:48 |
| `m2-embeddings` | `where-words-live.mp4` | 2:05 |

**`tools/river-prototype.html`** — a standalone page, not wired into the site.
Droplet-based hydraulic erosion on a 320×200 heightmap, canvas 2D, no libraries.
Rain on a slope, channels carve, then drop a test droplet anywhere and watch it
slide into the channels you cut. It is the parameters lesson, and it is secretly
the bias lesson.

**`VIDEO-SCRIPTS.md` rebuilt** from Sam's production doc: all 15 scripts, plus two
new ones written to fill the gaps (16 `m1-daily`, 17 `m2-parameters`). Still
gitignored, so it lives only on Keneth's machine.

### Decisions worth knowing

**The certificate round trip avoids CORS on both legs.** The request out is a
no-cors POST, same as the feedback widget. The answer comes back as an ordinary
browser navigation to `#cert=<payload>`, because the Apps Script redirects. Nothing
has to read a cross-origin response, which is the part that is usually fragile
with Apps Script. Do not "simplify" this into a fetch that reads a reply.

**`ALLOWED_ORIGINS` in the certificate script is security-critical.** The redirect
target arrives in the request. Without an exact-match check, anyone could call the
script with their own origin and use Purple Maiʻa's address as a redirector.
Matching is full-string, never `indexOf`: `ai-page.sandbox.purplemaia.org.evil.test`
contains our host too.

**The community overlay claims the certificate.** `community.js` sets
`certificate.courseName` to "Intro to AI". Without that, somebody finishing the
community edition is handed a certificate for the staff course.

**The overlay handled the new videos by itself.** Its rule only demotes *outside*
explainers to optional links, so the moment a lesson got a `file:` video it was
promoted to inline and its "Want more?" link dropped away. One edit to
`content.js`, both editions correct. This is the argument against forking.

**Privacy copy was corrected twice.** The FAQ used to promise the feedback button
was "the single exception" that sends anything; the certificate made that false.
Both editions now name both, and `"free, no login"` became `"nothing on it is
gated"`. Keep that precise — it is the claim a sharp reader at a partner org will
test.

### Held back deliberately

**Both Apps Scripts are written but not deployed.** `feedback.endpoint` and
`certificate.endpoint` are both `""` in the commit, so both features are invisible
in production. Each needs about five minutes: new Sheet, paste the file, run
`setup`, deploy as a web app, paste the `/exec` URL into `content.js`. For the
certificate, **edit `ALLOWED_ORIGINS` before deploying.**

**The river is not wired into any lesson.** Deliberate: the design direction had
not been agreed, and `window.__river` is still exposed as a tuning hook. That
would come out before integration.

**Regions in the river are unlabelled.** Naming one side ʻōlelo Hawaiʻi and the
other English is what would make it land hardest, and it is exactly the framing
that should go past cultural review first.

### How it was tested

Seven suites, all passing: `smoke`, `smoke2`, `standin`, `nobadge`, `feedback`,
`agenda`, `cert`. The certificate adds 42 assertions, including seven on the
open-redirect defence (suffix attack, host-in-query-string, `javascript:` URL).

The sign-in round trip was exercised end to end against a local stand-in for the
Apps Script: request → emailed link → 302 → `#cert=` payload rendered. The real
Google deployment has **not** been tested, because it does not exist yet.

The river was measured rather than eyeballed, which is the only reason it works.
Three bugs: the terrain had no net downhill (noise octaves out-steepened the base
slope, so a droplet ran 900 steps and never left row 15 of 200); the downslope
bias was applied to the raw gradient where it was rounding error; and the erosion
brush was too tight to leave a catchment, giving 12% channel capture against an 8%
baseline. Now 26% against 13%, and 28–30 of 30 droplets reach the sea.

Not tested: the certificate against real Google infrastructure, and the river on a
phone.

### Open / next

- [ ] **The live site is two weeks behind.** Dokku is on `e012b70`; `main` is at
      `53abaf9` and `community-hub` at `17e951b`. `assets/video/*.mp4` returns 404
      in production — **none of the 11 videos are live.** Deploying is one command,
      but it needs a decision first: which branch is the public face, `main`
      (LLM/NLP 101) or `community-hub` (Intro to AI)?
- [ ] Deploy the two Apps Scripts. Nothing is being collected until then.
- [ ] Eight lessons still on stand-ins: `m1-daily`, `m2-training-data`,
      `m2-parameters`, `m2-transformers`, `m2-sampling`, `m3-grounding`, `m3-bias`,
      `m3-model-families`. Scripts already exist for all but two, so these are
      shooting work, not writing work.
- [ ] `ai.purplemaia.org`. This invalidates all three QR assets, **the QR printed
      into deck slide 4**, and the URL hard-coded twice in the white paper. A PDF
      and a printed QR cannot be redirected. Decide the domain before anything
      else circulates.
- [ ] The hero still says **~95 min self-paced**. True figure is nearer 5h26m now
      that 11 lessons carry video. One decision — do stand-ins count? — then three
      recomputes together.
- [ ] `README.md:128` still says to find-and-replace the URL across three files and
      that "nothing else is URL-dependent". Five other things are. That is a trap
      set for whoever does the domain move.
- [ ] White paper: the reference list is verified and the editor's note is gone,
      but three in-text citation years still disagree with the Sources entries
      (3Blue1Brown 2025→2024, LearnThatStack 2026→2025, Cloudflare 2026→n.d.), and
      Wei is still uncited in the body.
- [ ] GitHub Pages was serving a stale build on 10-22. Worth a glance at Settings →
      Pages.
- [ ] Sam is working analytics on her own fork, `splimon/AI-101-Community-Site`.
      She forked from `e012b70`, so she must **pull upstream rather than re-fork**
      to get the videos and the community edition.
- [ ] `VIDEO-SCRIPTS.md` is gitignored. It is now the real production record,
      with 17 scripts. Worth deciding whether it should be tracked.

---

## 2026-10-20 — Community edition: a mile wide, an inch deep (branch `community-hub`)

### Why

The AF-builders meeting asked for a version for public-facing orgs, in Joe's words
"a mile wide and an inch deep". The brief: replace the deep-dive YouTube videos with
Purple Maiʻa's own 1–1.5 minute videos, keep the quizzes and practice checks (Don
asked for them), keep the existing content, and host it at a different URL. Joe
reviews before it goes to Don, target Friday 23 October.

"Simpler" means shallower, not smaller. Every topic stays and every lesson stays.
Each one is cut to its single idea.

### What changed

- **`community.js`, an overlay.** It loads after `content.js` and reshapes it in
  place. It does not copy it. Each lesson gets a one-line summary where the staff
  wording talked about "this session", and two takeaways at most.
- **Only our videos play.** Lessons with a Purple Maiʻa video embed it, with its
  runtime on the card. Every outside explainer, which run 3 to 27 minutes, becomes an
  optional "Want more?" link labelled with its length. No stand-in notice appears
  anywhere in this edition.
- **A "Full lesson" button on every lesson** opens the same lesson on the staff
  site. The depth lives in one place.
- **One front door.** No audience switcher and no placement quiz. The hero, the
  pathways, the FAQ, the resources and the prompt library are rewritten or trimmed
  for a public audience. Practice and the glossary are unchanged.
- **Three small changes in `assets/app.js`**, each switched on by config and inert
  without it, so they can go to main as they are: `copy.videoMissing` and
  `copy.thumbMissing` reword the not-yet-made states, `showVideoLength` puts the
  runtime on our own videos, and `deeper` adds the Full lesson button.
- **`index.html`** loads `community.js`, retitles the page, and asks not to be indexed.

### Decisions worth knowing

- **Why an overlay and not a copy of `content.js`.** Main keeps getting accuracy
  fixes: the white paper, citation years, author names. With an overlay those reach
  this edition by `git merge main`, because the source text still lives in one file.
  The only place a fix will not flow through is a takeaway this edition rewrote in
  `INCH`. That is the price, and it is 38 short lines to re-read.
- **The overlay works by rules, not lists, where it can.** When a new video lands on
  main as `file:`, this edition embeds it, drops the outside link and recounts
  "With our video" without anyone touching `community.js`.
- **Noindex until it has a URL.** Without its own address a crawler can only file it
  as a duplicate of the staff site.

### Held back deliberately

- **The name** is now "Intro to AI" (set in `community.js`, the page head, and a new
  share card, `assets/social-intro.png` from `tools/social-card-intro.html`). The
  staff site keeps "LLM/NLP 101", and this edition still names it where it links there.
- **The URL, the canonical, the QR code and the JSON-LD.** All of them wait on the
  address. The staff QR code was removed from Resources here because it points at
  the staff site.
- **The workshop and kupuna audiences** are still held for cultural review, and are
  not in this edition at all.

### How to keep it in sync

```
git checkout community-hub
git merge main
```

Conflicts should only appear in `index.html` (the head) and, rarely, `assets/app.js`.

### How it was tested

Served locally and driven in headless Edge at 1280 and 375 wide: no console errors,
no horizontal scroll, 19 cards, 9 runtime pills, 10 "Short video on the way" cards,
no stand-in notices, quizzes render, and the Full lesson links resolve to the
matching lesson on the staff site.

### Open / next

- [ ] Joe's review, Friday 23 October.
- [ ] Pick the URL, then do the launch steps listed in the comment at the top of
      `index.html`, and add a Dokku app for it.
- [ ] Place "Video 10 – How text is generated". It has no script entry and no lesson.
- [ ] Ten lessons still have no Purple Maiʻa video.

## 2026-10-04 — Live on Purple Maiʻa's own box, a video on every lesson, QR

**Who:** Keneth, with Claude Code
**State:** pushed to `main` and deployed. Live at
`https://ai-page.sandbox.purplemaia.org/` with HTTPS, and mirrored on Pages.
**Commits:** `f159181`, `9f06e71`, and this one
**Files:** `content.js`, `assets/app.js`, `assets/styles.css`, `assets/social.png`,
`assets/qr*`, `index.html`, `sitemap.xml`, `robots.txt`, `README.md`, new
`Dockerfile`, `deploy/nginx.conf`, `.dockerignore`, `.gitignore`, `tools/`

### Why

David offered a Dokku app on the PMF sandbox VM. Separately: every lesson card
needed a video that actually matches its topic, `social.png` was still teal
against a purple site, and the 10/6 session needs a way to get people onto the
page from a room.

### It is deployed

`ai-page` on `dokku-pmf-sandbox.westus2.cloudapp.azure.com`, HTTPS via
Let's Encrypt, HTTP 301s to it, HSTS on. Everything serves including the 11MB
PDF, and `README.md` / `HANDOFF.md` / `VIDEO-SCRIPTS.md` 404 — which matters,
because this file has candid notes in it and should not sit in a public web
root. `Dockerfile` puts nginx in front of the repo, so Dokku skips buildpacks
and there is no build step. It was built and run locally before being pushed.

Two things that made it easier than the doc suggests. **Keneth's SSH key was
already authorized** — `apps:list` answered immediately, so nothing was ever
blocked on David. And **`*.sandbox.purplemaia.org` is a wildcard** pointing
straight at the VM, so an app is reachable the moment it is created and no DNS
request is needed.

### The canonical URL was wrong, twice

Worth reading before touching those references again.

The first pass pointed all 12 at `https://sandbox.purplemaia.org/`. That is
Dokku's **global domain** — its default vhost, the bare nginx welcome page. Apps
answer one level down. So every absolute reference on the page was aimed at
something that is not this site, and the og:image 404'd, which broke link
previews for a day.

They now point at `https://ai-page.sandbox.purplemaia.org/`, verified inside a
built container before deploying rather than after. Both hosts serve the same
`index.html`, so the Pages copy self-identifies as a duplicate rather than
competing in search. One file, correct on both.

The lesson for next time: a bare `purplemaia.org` subdomain is a separate,
manual DNS record. `bill-tracker` has one alongside its sandbox vhost. That is
the route to `ai.purplemaia.org`, and it is the only remaining flip.

### A verified video on every lesson

All 19 carry one; 3 did before. Each was picked for its specific topic and for
how well it has been received, and **every id was checked against live YouTube**
rather than recalled — a fabricated video id on the page that teaches people
about invented citations would have been indefensible. 3Blue1Brown's transformers
chapter (11.3M) on Transformers, Jeff Su's prompt formula (3.8M) on Prompts,
IBM's RAG explainer (2.0M) on Grounding, Anthropic's own on Hallucinations. No
video is reused.

Two deliberate deviations from pure view count. Tokenization takes a 25-minute
Computerphile piece because "why tokens are expensive" lands the ʻōlelo Hawaiʻi
token-cost argument directly. Sampling is the weak one at 30K views — a genuinely
niche topic with no popular treatment, so precision beat reach.

**The stand-in notice is keyed to the video's kind, not to a flag.** In-house
animations arrive as `file:`, so a lesson's notice disappears by itself the
moment it switches over. Tested by swapping a lesson to `file:` and asserting
the notice is gone.

### Social card and QR

`social.png` rebuilt in headless Chrome so it uses the real Montserrat and Inter
and the actual logo. `assets/qr-slide.png` is a 16:9 card for the deck,
`qr.png` the code alone with the mark in it, `qr.svg` plain vector for print.
Both generators live in `tools/` with their Chrome commands recorded.

Two gotchas kept there so nobody rediscovers them: `--disable-lcd-text`, without
which Windows subpixel-antialiases the text and every letter picks up colour
fringing in the PNG; and QR error correction level H, 30% recoverable, which is
what buys room for the logo in the middle. **Every code is decoded back to text
before it ships** — `tools/check-qr.js` round-trips the PNGs and fails loudly if
one has stopped being readable.

### The regression this surfaced

Adding 16 videos broke the thumbnail badge, and the cause is not what it looks
like. The badge was never showing a wrong video length — it was showing
`duration`, which this repo documents as self-paced time *for the whole lesson,
including its video*. A real number, drawn in the one corner of a video
thumbnail that every viewer reads as runtime. Survivable at 3 videos. At 19 it
meant `m2-tokenization` claiming "3 min" over a 25-minute video.

Keneth's call was to take the time off the thumbnail for now, so no lesson card
shows a time at all. A self-paced tag added mid-fix was pulled back out — it only
relocated a number we had just agreed is stale. `videoLength` is now recorded on
all 19 as the real runtime; nothing renders it, and the schema comment in
`content.js` says so and says why.

### Checks

175 assertions across four suites, no failures. Both QR PNGs rescan to the right
URL. The deployed container was checked asset by asset over HTTPS.

### Open / next

- **The self-paced clocks are still wrong and this is the biggest live issue.**
  `duration`, the hero's "~95 min" and the README module table were written when
  3 lessons had video. True total is ~4h57m under the documented rule. Decide
  first whether a stand-in counts toward self-paced time — they are explicitly
  labelled as not-ours — then recompute `duration`, `facts` and the table
  together. The README carries a warning at that table.
- **`ai.purplemaia.org` needs a DNS record from David** — Keneth is asking
  Monday. It is the last canonical flip, and it means regenerating the QR codes,
  which is why nothing should be *printed* until the domain is settled.
  Projecting the slide is safe; handouts are not.
- The deck is still teal. The 10/6 run-through is two days out, and if it is
  recorded the slides and the site will not match.
- Deck items still Keneth's: learning-outcomes slide, in-deck checkpoints, the
  run-through, the recording plan.
- The long-form handbook the boss asked for is still unbuilt.

---

## 2026-10-01 — Re-skinned to Purple Maiʻa's brand

**Who:** Keneth, with Claude Code
**State:** committed as `08c81ab`, merged to `main`, pushed, and verified live
**Files:** `index.html`, `assets/styles.css`, `assets/favicon.svg`, `README.md`,
plus five new PNGs in `assets/`

### Why

Feedback that the page should look like it belongs to Purple Maiʻa rather than
like a generic course template. The layout was explicitly kept — the ask was to
keep the structure and lean purple, not to rebuild.

### What changed

**The palette is now Purple Maiʻa's, measured rather than guessed.** The brand
colours were sampled pixel-by-pixel out of the logo artwork: purple `#1a002d`,
navy `#081659`, green `#006838`, tan `#c3996b`, red `#ec1c24`, cyan `#00adee`,
amber `#faaf40`, lime `#8bc53f`. purplemaia.org itself was read for the rest of
the system — it is a Framer site, so the values are inline: Montserrat headings
over Inter body, near-black on off-white, a 16px corner radius, and headings set
on tight negative tracking.

`#1a002d` is an ink, not an accent — far too dark to carry buttons and links. So
`--accent` is a lightened step off that purple, `#6b2f96`, picked against numbers
instead of by eye: OKLCH L 0.439, 8.2:1 on `--bg`, 8.5:1 under white button text.
Dark mode mirrors it at `#c9a4ef`.

**`--violet` was renamed `--ocean`** and now carries the brand cyan. With the
accent itself purple, a second token called "violet" holding a different purple
was going to confuse whoever edited this next.

**The chart pair moved too.** `--viz-read` went teal → `#6b2f96` / `#a86fd6` so
the meters read as part of the same family. Both steps were kept inside the
dataviz lightness bands (light 0.43–0.77, dark 0.48–0.67) and well separated in
hue from `--viz-sure`, which did not need to move.

**Real logo, not a stand-in.** The generic sparkle glyph in the header is gone,
replaced by the Purple Maiʻa mark, and the footer carries the full lockup. Each
ships in a colour and a white variant because the mark's deep purple cells
disappear against a dark page; the swap is pure CSS, so it follows the manual
theme toggle and not just the OS setting. The source exports are 2000px, which is
absurd for a 32px header slot, so they were downscaled to 3–8KB each. The favicon
is now the mark's triangular lattice in brand purple.

**ʻOhe kāpala texture in the margins.** The stamp motif from the deck now bleeds
into the empty space either side of the 1180px column — five of them, 340–460px,
scattered down both margins at percentage offsets so they distribute themselves
however long the page gets. They are pushed mostly off-canvas so only an edge
shows, which reads as texture rather than as clip art parked in the margin.

Two decisions inside that worth keeping:

- It ships as a **mask**, not a coloured image, so one file tints itself from
  `--accent` and follows the theme. No light and dark copy to keep in sync.
- The file keeps a **real alpha channel** even though that costs ~10KB. The
  tempting version is plain greyscale with `mask-mode: luminance`, but Chrome
  only supported `mask-mode` from v120, and when it is ignored you do not get a
  subtle miss — you get a solid purple square in the margin.

It only draws at ≥1240px, where there is margin to draw in, and is suppressed in
print. `body` gained its own stacking context so the texture can sit at
`z-index: -1`: above the background, below every bit of content.

### Checks

161 assertions pass across both suites, unchanged from before the re-skin. Every
local asset reference in `index.html` and `styles.css` was walked and resolves.
No stale hex from the old teal palette survives anywhere in the repo.

Viewed rendered for the first time, on a local server — the first time this page
has been looked at rather than only tested. After the push, all ten files were
re-checked against the live Pages URL: every one returns 200, the deployed
stylesheet carries the new palette and the renamed token, and zero old teal
tokens survive in what is actually being served.

### Also shipped in this push

`9a8193d` went out alongside it. That is the boss-feedback work — placement quiz,
Practice banded by module, module recaps — which had been sitting unmerged on the
`boss-feedback` branch since that session. Both commits are now on `main`.

The Kupuna and Community workshop copy was checked before pushing: it was already
on `origin/main` from the earlier auto-sync incident, so this push exposed nothing
new. `draft: true` still keeps both off the rendered page, and they stay
unreachable until someone deletes that line.

### Open / next

- The deck is still on the old teal styling. If the run-through on 10/6 is being
  recorded, the slides and the page will not match. Five days out.
- `assets/social.png` is the old palette and will look wrong in link previews.
- Not yet opened on a phone. The page is below the 1240px texture threshold
  there, so the kāpala should correctly not appear — worth confirming.
- The long-form handbook the boss asked for is still unbuilt, and is still the
  biggest outstanding ask.
- Deck items still Keneth's: learning-outcomes slide, in-deck checkpoints, the
  draft run-through before 10/6, and the recording plan.

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
