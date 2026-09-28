# Short-form video scripts

Scripts for the Purple Maiʻa animated explainers, drawn from the LLM/NLP 101
lessons. Each one is written to stand alone — somebody should be able to watch it
cold, without the other eight, and come away with one thing they can use.

**House style**, as set by scripts 1–4:

- **Cold open on a concrete moment.** No title card, no "in this video." A chat box,
  a meeting note, a cursor hovering over Post.
- **One idea per beat.** Short declarative sentences. Second person.
- **Name the term after showing the behaviour**, never before.
- **Land on something to do**, not something to feel. Every script ends on an
  instruction.
- **Runtime ~1:30.**

### Three rules added after the first watch of script 5

All three came from the same note: the viewer was being asked to read and listen at
once, and the things anchoring the diagram kept disappearing.

- **Never narrate over text the viewer has to read.** When a prompt, a question or a
  reply appears, stop talking. Hold 2–3 seconds. The script marks these as
  `(hold Ns)` and they are beats, not padding — protect them in the edit.
- **Ask the question out loud before showing the demo.** One spoken line that tells
  the viewer what they are about to watch for. Without it they spend the opening
  working out what they are looking at instead of watching it happen.
- **Labels go up once and stay up.** Anything anchoring a diagram — where a timeline
  starts, what the far end represents, what a single block stands for — stays on
  screen for the rest of the film. And label a symbol the first time it appears, not
  after the viewer has already wondered.

### A note on pace

Read at a natural clip, these come in around a minute. The gap to 1:30 is **not
closed by reading slower** — that just sounds draggy, and the first recording of
script 5 proved it. It is closed by the holds. Keep your normal delivery and let
the silences do the work: roughly 130–150 words of voiceover and 15–20 seconds of
deliberate silence per film.

| # | Title | Lesson it maps to | Status |
|---|---|---|---|
| 1 | What it learned from | `m2-training-data`, `m3-bias` | written |
| 2 | The autocomplete trick | `m2-next-token`, `m2-sampling` | written |
| 3 | The fake citation | `m3-hallucinations` | written |
| 4 | AI isn't one thing | `m1-map` | written |
| 5 | Is it learning from me? | `m2-pretraining-inference` | below, revised |
| 6 | Why it forgets | `m2-context-window` | below |
| 7 | Like a new hire | `m3-prompts` | below |
| 8 | It showed its work | `m3-reasoning` | below |
| 9 | Who signs it | `m3-oversight` | below |

Still uncovered: tokenization (`m2-tokenization`), embeddings and attention
(`m2-embeddings`, `m2-transformers`), grounding (`m3-grounding`), model families
(`m3-model-families`).

---

## 5. Is it learning from me?

*Maps to `m2-pretraining-inference`. Answers the single most common staff question.*

| Time | Voiceover | On screen |
|---|---|---|
| 0:00 | "Have you ever caught AI getting something wrong?" | An empty chat. Cursor blinking. Nothing else yet. |
| 0:05 | "You tell it. And it folds straight away." | The correction types itself in, one line. |
| 0:10 | *(hold 3s)* | The correction sits alone. No voiceover — let them read it. |
| 0:13 | "It agrees, apologises, and hands you the right answer." | The reply streams in: *"You're right — my mistake."* |
| 0:19 | *(hold 3s)* | The apology sits. |
| 0:22 | "Felt like it learned something." | Small text beneath the reply: **did it?** |
| 0:27 | "So come back tomorrow and ask the same thing." | Wipe to a fresh, empty chat. The same question types in. |
| 0:32 | *(hold 3s)* | The question sits alone. |
| 0:35 | *(silence)* | The original wrong answer streams back in, word for word. |
| 0:40 | "Same mistake. It isn't being stubborn." | The answer holds. |
| 0:45 | "The learning already happened — once, long before you opened the app." | Answer dims. A timeline draws left to right. **TRAINING** anchors at the far left, **YOU, TODAY** at the far right. **Both labels stay up for the rest of the film.** |
| 0:56 | "It read an enormous amount of text, and while it read, it adjusted itself." | Above the left end, the block pile from script 1 builds. Label above it, from the first block: **text data — books, websites, articles**. |
| 1:06 | "Then that stopped." | Pile freezes. A hard vertical line drops beside it: **TRAINING ENDED**. |
| 1:11 | "The version you're typing to is the one that came out the other side. Everything you do sits over here." | Everything left of the line goes flat grey. A cursor blinks beneath **YOU, TODAY**, still anchored at the right. |
| 1:21 | "One thing worth keeping separate — not learning from you isn't the same as not storing what you type." | Two words under the timeline: **LEARNING** / **STORING**. A gap between them. |
| 1:28 | "That one's a settings question. Go and check it." | Sign-off card. |

---

## 6. Why it forgets

*Maps to `m2-context-window`. The other question that comes up every single time.*

| Time | Voiceover | On screen |
|---|---|---|
| 0:00 | "Ever had a long back-and-forth with AI, and partway through it loses the plot?" | A long chat, scrolling fast. Dozens of turns blur past. |
| 0:07 | "Let's ask it about something from right at the start." | Scroll stops. The question types in: *"What was the name I gave you at the beginning?"* |
| 0:13 | *(hold 3s)* | The question sits alone. |
| 0:16 | *(silence)* | The answer streams in — confident, and wrong. |
| 0:21 | *(hold 2s)* | Hold on the wrong answer. |
| 0:23 | "It didn't forget. It can't see it." | **CAN'T SEE IT** stamps over the answer. |
| 0:29 | "Everything the AI is able to use has to fit inside one window." | The chat collapses into a horizontal strip of blocks. A bright frame slides over the right-hand end, labelled **WHAT IT CAN SEE**. **This label stays up.** |
| 0:40 | "Your question. The conversation so far. Any document you pasted in." | Three colours fill the framed section, stacking to the edge. Each is labelled as it lands: **your prompt** / **the conversation** / **documents**. |
| 0:51 | "All of it shares the same space." | The frame holds, completely full. Nothing spare. |
| 0:57 | *(hold 2s)* | Let the full frame sit. |
| 0:59 | "So as you keep going, the window slides forward — and the oldest part slides out the back." | The strip scrolls left. Early blocks pass outside the frame and drop away. |
| 1:10 | "Not faded. Not deprioritised. Gone." | The dropped blocks land below the strip, dark and unlabelled. |
| 1:16 | "Same thing happens to a long document. It won't tell you it only got through half." | A tall document slides in. Only its top third fits inside the frame. The rest sits outside, grey. |
| 1:25 | "So start a new chat for a new topic. And if something matters, paste it again." | Sign-off card. |

---

## 7. Like a new hire

*Maps to `m3-prompts`. The most immediately useful ninety seconds on the list.*

| Time | Voiceover | On screen |
|---|---|---|
| 0:00 | "Ever asked AI for something and got back a paragraph of nothing?" | An empty chat. Cursor blinking. |
| 0:06 | *(silence)* | Four words type in: *Write a bio for Keiko.* |
| 0:09 | *(hold 3s)* | The prompt sits alone. Nothing else on screen. |
| 0:12 | *(silence)* | A bland, generic paragraph streams in. |
| 0:17 | *(hold 3s)* | Let them read it and be unimpressed. |
| 0:20 | "That's not the AI being bad at its job. That's it guessing, because you didn't tell it anything." | The paragraph greys out. |
| 0:29 | "It knows an enormous amount in general — and nothing at all about you." | Two panels. One dense with text: **GENERAL KNOWLEDGE**. One empty: **YOUR SITUATION**. **Both labels stay up.** |
| 0:38 | "Treat it like a capable new hire on their first morning. Sharp. Never met anyone here." | The empty panel pulses once. |
| 0:46 | "So tell it who's reading." | The prompt rebuilds, line by line. Line one: *for a grant funder.* **Every line stays on screen as the next arrives.** |
| 0:51 | "How long." | *100 words.* |
| 0:55 | "What it should sound like." | *warm, but concise.* |
| 1:00 | "And here's the one people skip — give it the actual material." | *…drawing only on the notes below.* A block of real notes drops in beneath. |
| 1:08 | *(hold 3s)* | The whole rebuilt prompt on screen at once. |
| 1:11 | "Same question. Same model. Same minute." | The new answer streams in — specific, usable. |
| 1:18 | "All that changed is how much you told it." | Split screen: the two answers side by side, both labelled with their prompt. |
| 1:25 | "It can't guess the things only you know. So hand them over." | Sign-off card. |

---

## 8. It showed its work

*Maps to `m3-reasoning`. The corrective nobody expects to need.*

| Time | Voiceover | On screen |
|---|---|---|
| 0:00 | "Sometimes AI doesn't just answer — it shows you how it got there. Does that make it right?" | A question sits in the chat box. Nothing else yet. |
| 0:08 | *(silence)* | Reasoning steps begin streaming, numbered 1 to 5. |
| 0:14 | *(hold 4s)* | All five steps on screen. Tidy. Confident. Let them actually read it. |
| 0:18 | "Step one, step two, step three. It looks like being shown a proof." | The steps sit complete. |
| 0:25 | "The final answer is wrong." | The last line turns red. Everything above it stays black. |
| 0:30 | *(hold 3s)* | Let that sit. |
| 0:33 | "And every step above it still looks right." | Slow pan up through the steps. They don't change. |
| 0:40 | "Here's the part worth holding onto. Those steps were generated the same way the answer was." | The steps dissolve into the probability bars from script 2. |
| 0:51 | "Each one is the most plausible next step. Not a step that got checked." | The bars carry two labels, side by side, and **both stay up**: **PLAUSIBLE** / **VERIFIED**. The second is greyed out. |
| 1:01 | "Showing the work isn't the same as checking the work." | **SHOWN** and **CHECKED**, alone on screen. |
| 1:08 | "This isn't a reason to distrust it. Working step by step genuinely does make it more accurate on a lot of tasks." | **SHOWN** brightens. A small upward arrow beside it. |
| 1:18 | "It also makes it more convincing. Those two don't always move together." | A second arrow appears beside **CHECKED** — flat. |
| 1:25 | "So find the step the whole answer rests on, and check that one yourself." | Sign-off card. |

---

## 9. Who signs it

*Maps to `m3-oversight`. The one to end a session on.*

| Time | Voiceover | On screen |
|---|---|---|
| 0:00 | "Say AI just wrote you a post about a cultural practice. Who decides whether it goes out?" | A finished social post, image and caption. Cursor drifting toward **Post**. |
| 0:08 | *(hold 4s)* | The cursor hovers. Doesn't click. Let them read the caption. |
| 0:12 | "It took about nine seconds to write." | A small timer in the corner: **0:09**. |
| 0:17 | "That part is real, and it's genuinely useful. Drafting is the thing it's best at." | The caption highlights. |
| 0:25 | "Here's what it couldn't do." | The caption dims. |
| 0:29 | "It couldn't tell whether any of that is accurate." | Line one appears and **stays**: **can't tell if it's true.** |
| 0:36 | "It couldn't tell who it belongs to, or who it might land badly with." | Line two, beneath it: **can't tell whose it is.** |
| 0:45 | "And if it's wrong, it isn't the one who has to sit with that." | Line three: **can't carry it.** |
| 0:53 | *(hold 3s)* | All three lines together on screen. |
| 0:56 | "A tool can't hold kuleana. A person does." | The three lines resolve into one word: **KULEANA**. |
| 1:03 | "So before anything goes out, somebody reads it. Not to check whether it reads well —" | Cursor pulls back from **Post**. |
| 1:12 | "— to check whether it's true." | **READS WELL** and **IS TRUE**, side by side. The second highlights. |
| 1:18 | "For anything public. Doubly for anything touching culture or community." | The post reappears, now with a named reviewer beside it. |
| 1:25 | "AI drafts. A person signs. Every time — and you should be able to say who." | Sign-off card. |
