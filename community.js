/* =============================================================
   community.js  —  THE COMMUNITY EDITION, AS AN OVERLAY.

   Loads after content.js and before assets/app.js. It does not copy
   content.js; it reshapes it. That is deliberate. Every correction made
   on main (a fixed citation, a reworded takeaway, a new video) reaches
   this edition by merging main into this branch, because the source
   text still lives in exactly one file.

   The brief, from the AF-builders meeting: "a mile wide and an inch
   deep" for public-facing orgs. Same breadth of topics as the staff
   course, much shallower:
     - every module keeps its practice (Don asked for the quizzes) and
       every topic keeps its place
     - one idea per topic: each section is cut to its opening block
     - only Purple Maiʻa's own short videos play inline. Outside
       explainers run 3 to 27 minutes, so each one becomes an optional
       link instead of the main event
     - the long version is one link away, in Resources

   The page became three module articles in October 2026. The overlay
   survived that rewrite without being rewritten itself, because it has
   always edited the content rather than the markup. Keep it that way:
   if something here starts reaching for an element id, it is the wrong
   file for the job.

   What to edit here:
     INCH     the one-idea version of each lesson, keyed by lesson id
     gist()   the rule that shortens the article sections
     EVENT    the hero copy for this audience
     FAQ / RESOURCES below
   ============================================================= */

/* This file lives on `main` as well as on `community-hub`, and on `main`
   nothing loads it: only the community edition's index.html carries the
   <script src="community.js"> tag. It is kept here on purpose. If it were
   deleted from `main`, the next merge down into `community-hub` would carry
   that deletion with it and quietly take the community edition apart. Leaving
   one unused file in the staff web root is the cheaper of the two problems. */

(function (S) {

  /* The full course, where the depth lives. */
  var FULL = "https://ai-page.sandbox.purplemaia.org/";

  /* ---------- the one-idea version of each lesson ----------
     summary    replaces the lesson's one-liner, only where the staff
                version talked about "this session" or "this module"
     takeaways  two at most, and each one has to stand alone
     keep       the url of the one resource worth keeping from content.js:
                something to try, not something to read
  --------------------------------------------------------------- */
  var INCH = {
    "m1-map": {
      summary: "Five words people swap around that mean different things. Most of them fit inside each other.",
      takeaways: [
        "AI is the umbrella. Machine learning is one way to build it: the system learns from examples instead of following rules someone wrote.",
        "LLMs, the technology behind ChatGPT, Claude and Gemini, are machine learning that works with language and generates new text."
      ]
    },
    "m1-daily": {
      takeaways: [
        "You already use NLP: live captions, translation, spell-check and voice-to-text.",
        "Generative AI and LLMs are the newer layer: drafting emails, summarizing documents, first-draft copy."
      ],
      keep: "https://pair.withgoogle.com/explorables/"
    },
    "m2-loop": {
      summary: "One loop, run once for every word it writes. Every other lesson in this section zooms in on one step of it.",
      takeaways: [
        "Chop the text into tokens, turn them into meaning, weigh which ones matter, rank what could come next, pick one. Then repeat.",
        "Nowhere in that loop does it look up a fact."
      ],
      keep: "https://poloclub.github.io/transformer-explainer/"
    },
    "m2-training-data": {
      summary: "The huge pile of text a model learns from. Most of what it gets right and wrong traces back here.",
      takeaways: [
        "Websites, books, articles and code. It is the source of both what the model knows and what it does not.",
        "Whatever is thin in that pile, such as ʻōlelo Hawaiʻi, the model will be weaker on."
      ],
      keep: "https://quickdraw.withgoogle.com/?locale=en_US"
    },
    "m2-parameters": {
      takeaways: [
        "Parameters are the settings a model learns during training. They decide how likely each possible next word is.",
        "More parameters usually means more capable, but not always."
      ],
      keep: "https://playground.tensorflow.org/"
    },
    "m2-pretraining-inference": {
      takeaways: [
        "Pre-training happens once, before you ever open the app. The model reads and adjusts its settings.",
        "Inference is every message you send. It applies what it already learned and is not learning from your chat, unless a product is specifically built to remember."
      ]
    },
    "m2-tokenization": {
      takeaways: [
        "The model reads numbered chunks called tokens, not letters. \"The\" is one token; \"indistinguishable\" is several.",
        "That is why letter-level tasks, like counting the r's in a word, trip it up."
      ],
      keep: "https://tiktokenizer.vercel.app/"
    },
    "m2-embeddings": {
      takeaways: [
        "Each token becomes a position in a \"meaning space\".",
        "Words used in similar ways sit close together. \"King\" lands near \"queen\"."
      ],
      keep: "https://projector.tensorflow.org/"
    },
    "m2-transformers": {
      takeaways: [
        "For every token, the model weighs which other tokens matter most. That weighing is called attention.",
        "In \"The honu swam toward the ocean\", honu and swam link strongly. The second \"the\" barely matters."
      ],
      keep: "https://poloclub.github.io/transformer-explainer/"
    },
    "m2-next-token": {
      takeaways: [
        "What comes out is a ranked list of likely next tokens, not an answer.",
        "It aims for plausible, not true. That is why it sounds just as sure when it is wrong."
      ],
      keep: "https://poloclub.github.io/transformer-explainer/"
    },
    "m2-sampling": {
      takeaways: [
        "A calculator gives the same answer every time. An LLM rolls weighted dice over its list of likely next tokens, so answers vary.",
        "Temperature changes the odds before the roll. Low favours the top pick; high gives the long shots more chances."
      ]
    },
    "m2-context-window": {
      takeaways: [
        "The window is everything the model can see at once: your prompt, the chat so far, and any documents.",
        "Whatever falls outside it is gone. That is why a long chat seems to forget how it started."
      ]
    },
    "m3-prompts": {
      summary: "Treat it like a capable new hire who knows nothing about your work.",
      takeaways: [
        "Spell out the audience, format and tone, and hand it your source material.",
        "Weak: \"Write a bio for Keiko.\" Strong: \"Write a 100-word bio for Keiko, our program director, for a grant funder, warm but concise, from the notes below.\""
      ],
      keep: "#/reference/prompts"
    },
    "m3-hallucinations": {
      takeaways: [
        "It predicts the next plausible word and never checks a fact, so citations, dates and quotes can be invented.",
        "A specific-sounding page number is not proof. Check it."
      ]
    },
    "m3-grounding": {
      takeaways: [
        "Treat AI output as a draft. Check numbers, quotes and names first.",
        "Tools that show their sources let you click through and check. A plain chat answer gives you nothing to check against."
      ]
    },
    "m3-bias": {
      summary: "The training-data problem, showing up in the answers.",
      takeaways: [
        "Training data over-represents some voices, languages and stories, and a model can repeat those gaps instead of flagging them.",
        "Ask about Hawaiian cultural protocol and you may get a confident outside guess. Defer to community and Native sources."
      ],
      keep: "https://www.sciencelearn.org.nz/videos/2194-chatgpt-ai-and-maori-data-sovereignty"
    },
    "m3-reasoning": {
      takeaways: [
        "Step-by-step reasoning is still generated text, one plausible step at a time.",
        "Tidy steps can still reach a wrong answer. Check the answer, not how rigorous it looks."
      ]
    },
    "m3-oversight": {
      summary: "The one rule to keep: a person signs off on what goes out.",
      takeaways: [
        "AI drafts. A person stays responsible for what actually goes out the door.",
        "Anything public, or touching culture or community, gets read by someone who knows the subject first. Every time."
      ]
    },
    "m3-model-families": {
      summary: "Just enough to follow the conversation.",
      takeaways: [
        "Different companies make different models: ChatGPT from OpenAI, Claude from Anthropic, Gemini from Google.",
        "A \"family\" is one model line over time, the way the iPhone 15 and iPhone 16 are versions of one phone."
      ]
    }
  };

  /* ---------- reshape every lesson ---------- */
  function kind(v) { return (v || "").split(":")[0]; }
  function watchUrl(v) {
    var ref = v.slice(v.indexOf(":") + 1);
    return kind(v) === "youtube" ? "https://www.youtube.com/watch?v=" + ref
         : kind(v) === "vimeo"   ? "https://vimeo.com/" + ref
         : ref;
  }

  var ours = 0;
  (S.lessons || []).forEach(function (l) {
    var o = INCH[l.id] || {};
    if (o.summary) l.summary = o.summary;
    l.takeaways = o.takeaways || (l.takeaways || []).slice(0, 2);

    var kept = (l.resources || []).filter(function (r) { return o.keep && r.url === o.keep; });
    var k = kind(l.video);

    if (k === "file") {
      ours++;
      l.duration = "~2 min";
    } else {
      /* An outside stand-in. Off the stage, still one click away for
         anyone who wants it, labelled with its real length. */
      if (l.video) {
        kept.push({
          label: "Want more? A longer outside explainer",
          url: watchUrl(l.video),
          desc: (l.videoLength ? l.videoLength + " · " : "") + "Not ours. Purple Maiʻa's short video for this lesson is still being made."
        });
      }
      l.video = "";
      l.duration = "~1 min";
    }
    l.resources = kept;
  });
  var total = (S.lessons || []).length;

  /* ---------- the articles: keep the gist, drop the rest ----------
     The page is three module articles now, not a grid of lesson cards.
     Each section carries a few paragraphs lifted from the white paper,
     with its lesson's video and quiz inside it. That prose is the staff
     depth, so this is where "an inch deep" has to happen now.

     The white paper is written topic-sentence first: every section opens
     with a block that states the whole idea, and the blocks after it
     qualify, extend or give examples. So the opener is kept and the rest
     go. Where the opener introduces a list, a table or a set of steps,
     that block comes too, because the opener points straight at it.

     This is a rule, not a rewrite, which is the point: new prose written
     on the staff branch arrives here already shortened, and no sentence
     on this page was written anywhere but content.js. */
  function gist(blocks) {
    if (!blocks || blocks.length < 2) return blocks;
    var out = [blocks[0]];
    if (typeof blocks[1] !== "string") out.push(blocks[1]);
    return out;
  }
  (S.modules || []).forEach(function (m) {
    (m.sections || []).forEach(function (s) {
      s.body = gist(s.body);
      (s.parts || []).forEach(function (part) { part.body = gist(part.body); });
    });
  });

  /* One front door, no switcher. The staff and partner versions stay on
     the staff site; the drafts held for cultural review stay held. */
  S.audiences = [];
  S.placement = null;

  /* Gone with the rebuild, and deliberately not replaced: S.deeper (the
     per-lesson "Full lesson" link), S.copy and S.showVideoLength. The
     article renderer reads none of them. The way through to the long
     version is now the one link in Resources, which is enough. */

  /* ---------- the hero ---------- */
  /* The follow-on explainers are the staff edition's depth layer, and this
     is the edition that deliberately has no depth layer. Ours still plays;
     the 3-to-27 minute outside videos behind them do not belong here. */
  (S.lessons || []).forEach(function (l) { delete l.deeper; });

  var ev = S.event;
  /* `headline` is the <h1>, `shortName` the word in the header, and `name`
     is what the browser tab ends up saying. All three, or the edition
     half-renames itself.

     This edition carries the staff course's name on purpose: it is the same
     course, cut shorter, not a different one. The two sites stay apart by
     host and by depth rather than by name. No period on the headline — the
     staff name has none, and the two have to match exactly to read as one
     course. */
  ev.name = "Artificial Intelligence 101";
  ev.shortName = "Artificial Intelligence 101";
  ev.headline = "Artificial Intelligence 101";
  ev.badge = "";
  ev.tagline = "Every big idea about AI, a minute or two each. Plain words, no math, no login.";
  ev.date = ""; ev.time = ""; ev.location = "";
  /* ev.intro, ev.facts and the two hero buttons are no longer rendered.
     Left unset rather than filled in with copy nobody will ever read. */

  /* ---------- the certificate ----------
     The overlay has to claim this too, or somebody who finishes the
     community edition is handed a certificate for the staff course. */
  if (S.certificate) {
    /* Deliberately still "Intro to AI" while the rest of the edition reads
       "Artificial Intelligence 101". Asked for and chosen on 27 Oct, so that
       certificates issued later stay consistent with any issued earlier.
       Nothing has been issued yet — `certificate.endpoint` is still "" — so if
       that reasoning stops applying, this is a one-line change. Until then it
       prints a course name that appears nowhere else on the page. */
    S.certificate.courseName = "Intro to AI";
    S.certificate.blurb = "You went through all of it. Put your name on it and keep a copy.";
  }

  /* S.pathways is gone too: the rebuild answers "where do I start?" with
     the three placement questions under the module cards instead, and this
     edition turns those off. Three modules in order is the whole map. */

  /* ---------- prompts: the four anyone can use on day one ---------- */
  var KEEP_PROMPTS = ["The capable new hire", "Source-checked answer", "Meeting notes to actions", "Check me before I present"];
  S.prompts = (S.prompts || []).filter(function (p) { return KEEP_PROMPTS.indexOf(p.title) > -1; });

  /* ---------- FAQ ---------- */
  function faq(q) {
    for (var i = 0; i < (S.faq || []).length; i++) if (S.faq[i].q === q) return S.faq[i];
    return null;
  }
  S.faq = [
    { q: "Who is this for?",
      a: "Anyone who works with the public and keeps getting asked about AI: nonprofits, schools, community groups, and the people they serve. It is Purple Maiʻa's staff course, cut down to the one idea per topic that matters most." },
    faq("Do I need any technical background?"),
    { q: "Why is every section so short?",
      a: "On purpose. A mile wide and an inch deep: every topic, the one idea that matters most, so you can explain it to somebody else afterwards. The full staff course covers the same ground at length, and it is linked under Downloads and links." },
    faq("Is the model learning from what I type?"),
    faq("Why do I get a different answer when I ask the same question twice?"),
    { q: "Why is it weak on ʻōlelo Hawaiʻi and Hawaiian cultural context?",
      a: "Training data. If something is underrepresented in what the model read, the model is weaker on it, and it will still answer confidently rather than tell you it is out of its depth." },
    faq("Can I use this to draft something public-facing?"),
    { q: "Where are the Purple Maiʻa videos?",
      a: ours + " of the " + total + " topics have one now, and the rest are being made. Until a topic's video is ready, the few lines of text carry the idea, and a longer outside explainer is linked if you want one." },
    { q: "Are the quizzes graded, and does anyone see my score?",
      a: "No and no. The practice at the end of each module is for you. Your answers and reading progress stay in your own browser and nothing is uploaded. Two things can send anything, and both wait for you to press a button: the feedback form, and the certificate at the end if you want one." },
    { q: "Can our organization use this?",
      a: "Yes. It is free and public, and nothing on it is gated. Share the link, work through it together in a meeting, or copy the source and adapt it for your own group." },
    { q: "What is the certificate at the end?",
      a: "Optional, and it only shows up once you have finished all three modules. Asking for one sends the name you want printed, an email address, and how much of the course you did. Nothing else, and nothing until you press the button. There is no password and no account: you get a one-time link by email, and clicking it is the whole sign-in. Everything else stays in your browser." }
  ].filter(Boolean);

  /* ---------- resources ---------- */
  S.resources = [
    {
      group: "Want to go deeper?",
      items: [
        { label: "The full staff course", url: FULL, desc: "The course this is cut from. Same three modules, every section at full length." },
        { label: "Slide deck (PDF)", url: "assets/llm-nlp-101.pdf", desc: "All 35 slides from the staff session. 15 MB." }
      ]
    },
    {
      group: "Things to play with",
      items: [
        { label: "Quick, Draw!", url: "https://quickdraw.withgoogle.com/?locale=en_US", desc: "Thirty seconds, and training data clicks." },
        { label: "Tiktokenizer", url: "https://tiktokenizer.vercel.app/", desc: "Paste any text and see the tokens a model actually reads." },
        { label: "Embedding projector", url: "https://projector.tensorflow.org/", desc: "A meaning space you can spin and search." },
        { label: "Survival of the Best Fit", url: "https://www.survivalofthebestfit.com/resources", desc: "A short game about how bias gets built in." },
        { label: "AI4Hawaiʻi", url: "https://www.ai4hawaii.org/", desc: "Local context for the conversation." }
      ]
    },
    {
      group: "Use it with your group",
      items: [
        { label: "Prompt library", url: "#/reference/prompts", desc: "Four prompts worth copying, ready to paste." },
        { label: "Copy this page", url: "https://github.com/KenethM/PurpleMaia---AI-Page", desc: "The source, free to adapt for your own group." }
      ]
    }
  ];

  S.footer.note = "Artificial Intelligence 101, from Purple Maiʻa. Free to share and adapt.";

})(window.SITE);
