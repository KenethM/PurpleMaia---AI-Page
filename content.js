/* =============================================================
   content.js  —  EDIT THIS FILE, NOT THE HTML.
   Everything on the page is generated from the object below.
   Save, refresh, done. See README.md for a field-by-field guide.

   Structure follows the LLM/NLP 101 deck:
     Module 1  Overview            (10-12 min)
     Module 2  How an LLM works    (20-25 min)
     Module 3  Using LLMs well     (15-20 min)

   Three things here are worth knowing before you edit:
     audiences  section 3  — re-skins the whole page per room (?for=kupuna)
     quizzes    section 6  — check-your-understanding, keyed by lesson id
     practice   section 7  — the playable activities in the Practice section
   ============================================================= */

window.SITE = {

  /* ---------- 1. THE BASICS ---------- */
  event: {
    name: "LLM/NLP 101",
    shortName: "LLM/NLP 101",
    tagline: "What an LLM actually is, how it generates a response, and where it falls short — at a 101 level, for the whole team.",
    date: "Tuesday, October 6, 2026",
    time: "First Tuesday session",
    location: "Purple Maiʻa all-staff",
    badge: "Staff learning asset",
    intro:
      "Purple Maiʻa's AI footprint is growing, and that means more of us end up speaking about AI in public — to funders, to haumāna, to community. " +
      "This page is the shared baseline so we can do that accurately. Three modules, no math, nothing behind a login. " +
      "Work through it in order, or jump to whatever you need before a session.",
    ctaPrimary: { label: "Start with Module 1", href: "#lessons" },
    ctaSecondary: { label: "See the run of show", href: "#agenda" },
    // Small facts shown under the hero
    facts: [
      { label: "Modules", value: "3" },
      { label: "Lessons", value: "19" },
      { label: "Self-paced", value: "~95 min" },
      { label: "Live session", value: "~59 min" }
    ]
  },

  /* ---------- 2. THREE ENTRY POINTS ---------- */
  pathways: [
    {
      icon: "sprout",
      title: "I use it, but I couldn't explain it",
      body: "You get useful answers out of ChatGPT or Claude, but the words underneath — tokens, training, inference — are a blur. Start at the beginning.",
      action: { label: "Start with the overview", filter: "overview" }
    },
    {
      icon: "wrench",
      title: "I want to know what's under the hood",
      body: "You want the actual mechanism: how text becomes tokens, what attention is doing, and why the same question gives different answers.",
      action: { label: "Go to how an LLM works", filter: "how-it-works" }
    },
    {
      icon: "shield",
      title: "I have to speak about this publicly",
      body: "You present to funders, community, or haumāna and cannot afford to get it wrong. Start with the limits and the judgment calls.",
      action: { label: "Go to using LLMs well", filter: "using-llms" }
    }
  ],

  /* ---------- 3. AUDIENCES ----------
     The same knowledge base, re-skinned for whoever is in the room.
     Every audience inherits everything in `event` above and overrides only
     what it needs. Nothing is ever hidden: `feature` reorders the lessons
     and flags a starting set, but all 19 stay reachable.

     Share a pre-set link:  .../PurpleMaia---AI-Page/?for=partners
     Overridable fields: badge, tagline, intro, date, time, location,
                         facts, pathways, agenda, featureLabel, feature.
     Use "" (empty string) to blank a field out rather than inherit it.

     draft: true holds an audience back entirely. It keeps its content here,
     where it can be read and reviewed, but the live page cannot reach it —
     no chip, and ?for=<that id> falls back to the default. Delete the line
     to publish. Two are held back right now pending a cultural review.
  --------------------------------------------------------------- */
  audiences: [
    {
      id: "staff",
      label: "Staff onboarding",
      short: "Staff",
      blurb: "New to the team, or catching up before an all-staff session.",
      /* No overrides — this is the page exactly as written above. */
      feature: []
    },

    {
      id: "partners",
      label: "Partner education",
      short: "Partners",
      blurb: "Funders, schools and partner orgs asking how we think about AI.",
      badge: "For our partners",
      tagline: "How Purple Maiʻa talks about AI — what these systems actually are, what they are not, and where a person has to stay in the loop.",
      date: "",
      time: "~30 min briefing",
      location: "Partner orientation",
      intro:
        "We get asked a lot of AI questions, and we would rather answer them the same way every time. " +
        "This is the baseline our whole staff works from, published openly so you can read it before a meeting instead of taking our word for it in one. " +
        "No math, no product pitch. Start anywhere.",
      facts: [
        { label: "Read time", value: "~30 min" },
        { label: "Modules", value: "3" },
        { label: "Cost", value: "Free, no login" },
        { label: "Reusable", value: "Fork it" }
      ],
      pathways: [
        {
          icon: "sprout",
          title: "Give me the ten-minute version",
          body: "What an LLM is, in plain terms, and why that definition matters before anybody signs off on using one.",
          action: { label: "Start with the overview", filter: "overview" }
        },
        {
          icon: "shield",
          title: "What are the risks you watch for?",
          body: "Hallucination, bias, and the places where a confident answer is worth less than nothing. This is where our position sits.",
          action: { label: "Go to using LLMs well", filter: "using-llms" }
        },
        {
          icon: "wrench",
          title: "I want the mechanism, not the metaphor",
          body: "How text becomes tokens, what attention does, and why the same question gives two different answers.",
          action: { label: "Go to how an LLM works", filter: "how-it-works" }
        }
      ],
      agenda: [
        { time: "0:00", title: "Why we published this",     detail: "Our AI footprint is growing, and so is the number of people asking us about it. This is the answer, in writing.", tag: "Opening" },
        { time: "0:05", title: "What an LLM is",            detail: "AI, ML, NLP, generative AI and LLMs — five words that are not interchangeable.", tag: "~8 min" },
        { time: "0:13", title: "How it produces an answer", detail: "Next-token prediction, at a level you can repeat back to your own board.", tag: "~7 min" },
        { time: "0:20", title: "Where it breaks",           detail: "Hallucination, bias and inadequate cultural context — and what we do about each.", tag: "~8 min" },
        { time: "0:28", title: "Questions",                 detail: "Anything, including the ones we have not answered well yet.", tag: "Discussion" }
      ],
      featureLabel: "Partner briefing",
      feature: ["m1-map", "m2-loop", "m2-next-token", "m3-hallucinations", "m3-bias", "m3-oversight"]
    },

    {
      id: "workshop",
      draft: true,   // ← awaiting a read from someone who runs these rooms. Delete this line to publish.
      label: "Community workshop",
      short: "Workshop",
      blurb: "Facilitator-led, in a room, hands on keyboards. Leads with the activities.",
      badge: "Community workshop",
      tagline: "Ninety minutes, hands on. Take an LLM apart, break it on purpose, and leave able to explain it to somebody else.",
      date: "",
      time: "~90 min, facilitated",
      location: "Bring a laptop or a phone",
      intro:
        "This runs as a workshop, not a lecture. Every module has something to try in the Practice section, and the fastest way through is to play first and read second. " +
        "Everything here is free and public — open it again at home, or run the whole session yourself for your own group.",
      facts: [
        { label: "Format", value: "Hands-on" },
        { label: "Activities", value: "6" },
        { label: "Session", value: "~90 min" },
        { label: "Bring", value: "A device" }
      ],
      pathways: [
        {
          icon: "sprout",
          title: "Just tell me what to click",
          body: "Start in Practice. Chop a sentence into tokens, roll the dice on a prediction, and the vocabulary makes sense afterwards.",
          action: { label: "Go to the activities", goto: "#practice" }
        },
        {
          icon: "wrench",
          title: "I want to see it come apart",
          body: "The middle module is the machinery: tokens, embeddings, attention, prediction, sampling. Each one has a demo you can open.",
          action: { label: "Go to how an LLM works", filter: "how-it-works" }
        },
        {
          icon: "shield",
          title: "I came for the hard questions",
          body: "Bias, cultural context, and who stays responsible for what goes out. That is Module 3, and it is the point of the workshop.",
          action: { label: "Go to using LLMs well", filter: "using-llms" }
        }
      ],
      agenda: [
        { time: "0:00", title: "Open — what do you already use?", detail: "Go around the room. Almost everyone is already using NLP and has never called it that.", tag: "Talk story" },
        { time: "0:10", title: "Activity — Token chopper",        detail: "Everyone types their own name, then a sentence in ʻōlelo Hawaiʻi. The token counts make the point on their own.", tag: "Hands on" },
        { time: "0:25", title: "Modules 1 and 2 — how it works",  detail: "The loop, end to end, stopping at each stage. The demos open in a browser tab.", tag: "~25 min" },
        { time: "0:50", title: "Activity — Roll the dice",        detail: "Same prompt, different answer, temperature slider. Where “probabilistic” stops being a word and starts being obvious.", tag: "Hands on" },
        { time: "1:05", title: "Module 3 — using it well",        detail: "Hallucination, bias, cultural context, oversight. Run “Would you send it?” as a group vote.", tag: "~20 min" },
        { time: "1:25", title: "Close — what will you try?",      detail: "One thing each person will use it for, and one thing they will not.", tag: "Round" }
      ],
      featureLabel: "Workshop set",
      feature: ["m2-tokenization", "m2-next-token", "m2-sampling", "m1-daily", "m3-prompts", "m3-bias", "m3-oversight"]
    },

    {
      id: "kupuna",
      draft: true,   // ← awaiting a read from someone who runs these rooms. Delete this line to publish.
      label: "Kupuna outreach",
      short: "Kupuna",
      blurb: "Slower, plainer, pointed at the questions that matter to our ʻohana.",
      badge: "Talk story about AI",
      tagline: "What this thing is, in plain words — and why it gets our moʻolelo wrong so confidently.",
      date: "",
      time: "~45 min, talk story",
      location: "No devices needed",
      intro:
        "No jargon, no math, nothing to sign up for. We go slowly, and the questions are the good part. " +
        "The short version: this is a very good guessing machine, trained on what other people wrote down. " +
        "It has read very little of ours, which is exactly why it should never be the last word on anything that belongs to us.",
      facts: [
        { label: "Pace", value: "Talk story" },
        { label: "Jargon", value: "None" },
        { label: "Devices", value: "Not needed" },
        { label: "Cost", value: "Free" }
      ],
      pathways: [
        {
          icon: "sprout",
          title: "What even is it?",
          body: "Plain words first. What people mean by AI, and what the thing on the phone is actually doing when it answers you.",
          action: { label: "Start at the beginning", filter: "overview" }
        },
        {
          icon: "shield",
          title: "Why does it get our things wrong?",
          body: "Because of what it read, and what it never read. This is the part worth staying for.",
          action: { label: "Go to the limits", filter: "using-llms" }
        },
        {
          icon: "wrench",
          title: "How does it guess?",
          body: "If you want to know what is underneath — no math, just the idea of how one word follows another.",
          action: { label: "Go to how it works", filter: "how-it-works" }
        }
      ],
      agenda: [
        { time: "0:00", title: "Talk story — what have you heard?", detail: "What people have been told about AI, and what worries them. We start there.", tag: "Open" },
        { time: "0:10", title: "What it is",                        detail: "A guessing machine that read a great deal of writing. What that means, and what it does not.", tag: "Plain words" },
        { time: "0:22", title: "Why it gets our things wrong",      detail: "It read very little ʻōlelo Hawaiʻi and very little of our moʻolelo — and it will still answer you with full confidence.", tag: "The main point" },
        { time: "0:34", title: "What we do about it",               detail: "Who checks it, what never goes out without a person who knows, and what we do not put into it at all.", tag: "Kuleana" },
        { time: "0:44", title: "Questions",                         detail: "However long it takes.", tag: "Open" }
      ],
      featureLabel: "Talk-story set",
      feature: ["m1-map", "m1-daily", "m2-training-data", "m3-hallucinations", "m3-bias", "m3-oversight"]
    }
  ],

  /* ---------- 4. TRACKS (the filter chips) ---------- */
  tracks: [
    { id: "overview",     label: "1 · Overview" },
    { id: "how-it-works", label: "2 · How an LLM works" },
    { id: "using-llms",   label: "3 · Using LLMs well" }
  ],

  /* ---------- 5. LESSONS ----------
     video:  ""                      -> friendly "video coming soon" placeholder
             "youtube:dQw4w9WgXcQ"   -> YouTube, no cookies loaded until clicked
             "vimeo:123456789"       -> Vimeo
             "file:assets/clip.mp4"  -> a video file committed to the repo
     slides: optional URL (Google Slides, Canva, a PDF in the repo, anything)
  --------------------------------------------------------------- */
  lessons: [

    /* ===== MODULE 1 — OVERVIEW ===== */
    {
      id: "m1-map",
      title: "AI, ML, NLP, generative AI, LLMs",
      track: "overview",
      level: "Module 1",
      duration: "20 min",
      summary: "Five words people use interchangeably that are not interchangeable. They nest inside each other.",
      video: "youtube:oi0JXuL19TA",
      slides: "",
      takeaways: [
        "AI is the umbrella term. Machine learning is a way of building AI: systems learn patterns from data instead of being programmed rule by rule.",
        "NLP is machine learning applied to language — reading, understanding and producing human speech and text.",
        "Generative AI creates new content (text, images, audio, video) rather than only classifying or predicting.",
        "LLMs are the specific technology behind most generative text AI today: ChatGPT, Claude, Gemini."
      ],
      resources: [
        { label: "Glossary of every term used here", url: "#glossary" }
      ]
    },
    {
      id: "m1-daily",
      title: "Where each one shows up in your day",
      track: "overview",
      level: "Module 1",
      duration: "5 min",
      summary: "You already use all three. Naming which is which is most of the literacy.",
      video: "",
      takeaways: [
        "NLP: live captions and transcription, translation tools, grammar and spell-check, voice-to-text.",
        "Generative AI: social graphics, first-draft copy, meeting summaries, curriculum brainstorming.",
        "LLMs: drafting and editing emails, summarizing long documents, quick how-to help, session prep.",
        "If you have used Otter, Google Translate or autocorrect, you have been using NLP for years."
      ],
      resources: [
        { label: "Google PAIR Explorables — interactive essays on how these systems behave", url: "https://pair.withgoogle.com/explorables/" },
        { label: "Glossary of every term used here", url: "#glossary" }
      ]
    },

    /* ===== MODULE 2 — HOW AN LLM WORKS ===== */
    {
      id: "m2-loop",
      title: "The loop, end to end",
      track: "how-it-works",
      level: "Module 2",
      duration: "13 min",
      summary: "Five stages that repeat once per word. Everything else in this module is a zoom-in on one stage.",
      video: "youtube:NKnZYvZA7w4",
      takeaways: [
        "Tokenization → embeddings → transformers → probabilities → sampling, then loop back and do it again.",
        "The loop runs once per token produced. A three-paragraph answer is that circuit running hundreds of times.",
        "The base model is not looking anything up — there is no fact database inside this loop. Search and document tools get bolted on top of it (Module 3), but that is an addition, not part of the machinery."
      ],
      resources: [
        { label: "LLM visualizer — walk a working model layer by layer", url: "https://bbycroft.net/llm" },
        { label: "Transformer Explainer — the whole loop running in your browser", url: "https://poloclub.github.io/transformer-explainer/" }
      ]
    },
    {
      id: "m2-training-data",
      title: "Training data",
      track: "how-it-works",
      level: "Module 2 · Pre-training",
      duration: "4 min",
      summary: "The massive body of text a model reads. The single most important idea in this module.",
      video: "",
      takeaways: [
        "Websites, books, articles and code. It is the source of both what the model knows and what it does not.",
        "If something is underrepresented in training data — ʻōlelo Hawaiʻi, for example — the model will be weaker on it.",
        "This is the root of the 'inadequate cultural context' problem. Bias in Module 3 comes straight back to this slide."
      ],
      resources: [
        { label: "What is training data? — IBM", url: "https://www.ibm.com/think/topics/training-data" },
        { label: "Quick, Draw! — thirty seconds and training data clicks", url: "https://quickdraw.withgoogle.com/?locale=en_US" }
      ]
    },
    {
      id: "m2-parameters",
      title: "Parameters",
      track: "how-it-works",
      level: "Module 2 · Pre-training",
      duration: "11 min",
      summary: "The model's learned settings — the internal knobs that decide how it weighs information.",
      video: "youtube:LPZh9BOjkQs",
      takeaways: [
        "Parameters determine how the model combines what it is reading to produce a probability for the next word.",
        "Change the parameters and you change those probabilities for the same input.",
        "More parameters generally — not always — means more capability. No need to go further than that."
      ],
      resources: [
        { label: "TensorFlow Playground — watch parameters get tuned in real time", url: "https://playground.tensorflow.org/" }
      ]
    },
    {
      id: "m2-pretraining-inference",
      title: "Pre-training vs. inference",
      track: "how-it-works",
      level: "Module 2",
      duration: "2 min",
      summary: "The one distinction that clears up most confusion about whether it is \"learning from you\".",
      video: "",
      takeaways: [
        "Pre-training happens once, up front. The model reads enormous amounts of text and adjusts its parameters.",
        "Inference is every time you send a message. The model applies what it already learned.",
        "It is not learning from your conversation in real time — unless a product is specifically built to remember, which is a different feature.",
        "Everything from this point in the module onward is inference."
      ],
      resources: [
        { label: "Glossary: pre-training, inference, parameters", url: "#glossary" },
        { label: "FAQ: is the model learning from what I type?", url: "#faq" }
      ]
    },
    {
      id: "m2-tokenization",
      title: "Tokenization",
      track: "how-it-works",
      level: "Module 2 · Inference",
      duration: "3 min",
      summary: "The model does not see words. It sees numbered chunks.",
      video: "",
      takeaways: [
        "Text is chopped into tokens, and every token gets a number — a token ID.",
        "Common words are one token. Long or uncommon words get split: \"indistinguishable\" is four tokens, \"the\" is one.",
        "It works with those chunks rather than individual letters, which is why letter-level tasks — counting, reversing, rhyming on spelling — are unreliable."
      ],
      resources: [
        { label: "Tiktokenizer — paste any text and see the tokens and their IDs", url: "https://tiktokenizer.vercel.app/" }
      ]
    },
    {
      id: "m2-embeddings",
      title: "Embeddings",
      track: "how-it-works",
      level: "Module 2 · Inference",
      duration: "3 min",
      summary: "Turning tokens into coordinates in a space where distance means similarity of meaning.",
      video: "",
      takeaways: [
        "Each token becomes a vector — a position in a \"meaning space\".",
        "Words used in similar ways land close together. \"King\" sits near \"queen\".",
        "At this step a word has one position regardless of which sense you meant. Separating Python the language from Python the snake takes the surrounding words — that is the next lesson."
      ],
      resources: [
        { label: "Embedding projector — rotate and search a real meaning space", url: "https://projector.tensorflow.org/" }
      ]
    },
    {
      id: "m2-transformers",
      title: "Transformers and attention",
      track: "how-it-works",
      level: "Module 2 · Inference",
      duration: "3 min",
      summary: "For every token, the model decides which other tokens matter most.",
      video: "",
      takeaways: [
        "Attention is the model weighting the relationships between tokens — some links are strong, some barely matter.",
        "In \"The honu swam toward the ocean\", honu and swam are a strong link; the second \"the\" barely matters.",
        "This happens many times in parallel through different attention heads, each catching a different kind of relationship.",
        "It is also what separates the two Pythons: attention reads whether \"import\" or \"reptile\" is nearby and pulls the same token toward one sense or the other."
      ],
      resources: [
        { label: "Transformer Explainer — hover a token to see what it attends to", url: "https://poloclub.github.io/transformer-explainer/" },
        { label: "Generative AI exists because of the transformer — FT", url: "https://ig.ft.com/generative-ai/" }
      ]
    },
    {
      id: "m2-next-token",
      title: "Next-token prediction",
      track: "how-it-works",
      level: "Module 2 · Inference",
      duration: "3 min",
      summary: "The heart of it. Given everything so far, guess the single most likely next token — then do it again.",
      video: "",
      takeaways: [
        "The output is a ranked list of probabilities, not an answer: ocean 45%, shore 20%, reef 15%, current 12%, sky 8%.",
        "It is optimizing for \"plausible next token\", never for \"true statement\". That is where hallucination comes from.",
        "It also explains why the model sounds equally confident whether it is right or wrong — and why this is not thinking the way a person thinks."
      ],
      resources: [
        { label: "Transformer Explainer — type a sentence and watch the probabilities rank", url: "https://poloclub.github.io/transformer-explainer/" }
      ]
    },
    {
      id: "m2-sampling",
      title: "Probabilistic vs. deterministic",
      track: "how-it-works",
      level: "Module 2 · Inference",
      duration: "2 min",
      summary: "Why asking the same question twice gives you two different answers — and why that is normal.",
      video: "",
      takeaways: [
        "A deterministic system gives the same output every time for the same input. A calculator.",
        "A probabilistic system uses statistical likelihood to produce varied outputs. An LLM.",
        "Greedy decoding always takes the top token. Sampling rolls the dice against those odds instead, so \"reef\" at 15% comes up about one time in seven.",
        "Temperature is a separate dial, and it acts before the roll: low temperature sharpens the odds toward the favourite, high temperature flattens them so the long shots land more often."
      ],
      resources: [
        { label: "Transformer Explainer — it has a temperature slider; move it and watch the odds reshape", url: "https://poloclub.github.io/transformer-explainer/" },
        { label: "FAQ: why do I get a different answer each time?", url: "#faq" }
      ]
    },
    {
      id: "m2-context-window",
      title: "Context windows",
      track: "how-it-works",
      level: "Module 2 · Inference",
      duration: "2 min",
      summary: "How much the model can hold in view at once — and what happens when you go past it.",
      video: "",
      takeaways: [
        "The window covers your prompt, the conversation so far, and any documents you have shared.",
        "Once something falls outside the window, the model cannot see it at all.",
        "This is why a very long conversation seems to \"forget\" what you said at the start. Nothing is broken."
      ],
      resources: [
        { label: "Glossary: context window, token", url: "#glossary" }
      ]
    },

    /* ===== MODULE 3 — USING LLMs WELL ===== */
    {
      id: "m3-prompts",
      title: "Prompts and context",
      track: "using-llms",
      level: "Module 3",
      duration: "4 min",
      summary: "The most immediately useful thing in this whole session. Treat it like a capable new hire.",
      video: "",
      takeaways: [
        "It has vast general knowledge and knows nothing about your specific situation. Be explicit about audience, format and tone.",
        "Hand it the source material. Do not expect it to already know your program, your people or your numbers.",
        "Weak: \"Write a bio for Keiko.\" Strong: \"Write a 100-word bio for Keiko, our program director, for a grant funder audience, warm but concise, drawing on the notes below.\""
      ],
      resources: [
        { label: "Prompt library", url: "#prompts" },
        { label: "Prompt engineering overview — Anthropic", url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview" }
      ]
    },
    {
      id: "m3-hallucinations",
      title: "Hallucinations",
      track: "using-llms",
      level: "Module 3",
      duration: "3 min",
      summary: "Fluent, confident, and simply wrong. Straight back to next-token prediction.",
      video: "",
      takeaways: [
        "It is built to predict the next plausible word, not to verify truth. Invented citations, wrong dates, quotes nobody said.",
        "Ask for the exact page number of a quote and it may hand you a specific-sounding page and citation that does not exist.",
        "That is not the model being confident. It is the model returning a probability."
      ],
      resources: [
        { label: "Survey of Hallucination in Natural Language Generation — Ji et al.", url: "https://arxiv.org/abs/2202.03629" }
      ]
    },
    {
      id: "m3-grounding",
      title: "Grounding and verification",
      track: "using-llms",
      level: "Module 3",
      duration: "3 min",
      summary: "Pairing the model with real, retrievable sources — and checking what comes back.",
      video: "",
      takeaways: [
        "Cross-check anything presented as fact. Numbers, quotes and names are the highest-risk items.",
        "Treat AI output as a draft, not a finished fact.",
        "A search-grounded assistant that shows its sources lets you click through and check the claim. A plain chat answer with no receipts does not."
      ],
      resources: [
        { label: "Retrieval-Augmented Generation — Lewis et al., NeurIPS 2020", url: "https://arxiv.org/abs/2005.11401" }
      ]
    },
    {
      id: "m3-bias",
      title: "Bias",
      track: "using-llms",
      level: "Module 3",
      duration: "7 min",
      summary: "Not a new idea — this is the training data lesson from Module 2, showing up in practice.",
      video: "",
      takeaways: [
        "Training data reflects the internet's existing skews: whose voices, languages and stories are well represented, and whose are not.",
        "A model can reproduce and amplify those gaps rather than flag them.",
        "A model trained mostly on English-language Western sources may answer a question about Hawaiian cultural protocol with a confident outside guess instead of deferring to community and Native sources."
      ],
      resources: [
        { label: "Video: ChatGPT, AI and Māori data sovereignty (3:47)", url: "https://www.sciencelearn.org.nz/videos/2194-chatgpt-ai-and-maori-data-sovereignty" },
        { label: "On the Dangers of Stochastic Parrots — Bender et al., FAccT 2021", url: "https://dl.acm.org/doi/10.1145/3442188.3445922" },
        { label: "Survival of the Best Fit — play out how bias gets baked in", url: "https://www.survivalofthebestfit.com/resources" },
        { label: "AI4Hawaiʻi — local context for this conversation", url: "https://www.ai4hawaii.org/" }
      ]
    },
    {
      id: "m3-reasoning",
      title: "Reasoning, and what it isn't",
      track: "using-llms",
      level: "Module 3",
      duration: "2 min",
      summary: "A corrective to the instinct that \"it showed its work, so it must be right\".",
      video: "",
      takeaways: [
        "When a model shows step-by-step reasoning, it is still generating plausible-sounding text, one step at a time.",
        "Visible steps are not proof of correctness, and they are not human reasoning or understanding.",
        "A tidy, confident-looking chain of steps can add up to the wrong final answer."
      ],
      resources: [
        { label: "Chain-of-Thought Prompting Elicits Reasoning in LLMs — Wei et al.", url: "https://arxiv.org/abs/2201.11903" }
      ]
    },
    {
      id: "m3-oversight",
      title: "Human judgment and oversight",
      track: "using-llms",
      level: "Module 3",
      duration: "3 min",
      summary: "The clearest, most actionable takeaway of the entire session.",
      video: "",
      takeaways: [
        "AI drafts, explores and accelerates. A person stays responsible for what actually goes out the door.",
        "That goes double for anything public-facing, and anything touching culture or community.",
        "If AI drafts a post about a cultural practice, someone who actually knows the topic reads it and fixes what is off before it posts. Every time, no exceptions."
      ],
      resources: [
        { label: "AI Risk Management Framework 1.0 — NIST", url: "https://www.nist.gov/itl/ai-risk-management-framework" }
      ]
    },
    {
      id: "m3-model-families",
      title: "Proprietary models and model families",
      track: "using-llms",
      level: "Module 3",
      duration: "2 min",
      summary: "Just enough to follow a conversation without getting lost. Not benchmark comparison.",
      video: "",
      takeaways: [
        "Different companies build different models: ChatGPT from OpenAI, Claude from Anthropic, Gemini from Google.",
        "A \"family\" is versions of the same model line released over time — GPT-4 and GPT-5, the way iPhone 15 and iPhone 16 are versions.",
        "Similar general ideas underneath, different companies and different strengths."
      ],
      resources: [
        { label: "Claude model overview — Anthropic", url: "https://docs.claude.com/en/docs/about-claude/models/overview" },
        { label: "Model docs — OpenAI", url: "https://platform.openai.com/docs/models" },
        { label: "Gemini model docs — Google", url: "https://ai.google.dev/gemini-api/docs/models" }
      ]
    }
  ],

  /* ---------- 6. CHECK YOUR UNDERSTANDING ----------
     Keyed by lesson id. Anything without an entry simply shows no quiz.
       q       the question
       options 2-4 answers
       answer  index of the correct one (0 = first)
       why     shown after answering, whether they got it right or not
     Keep `why` teaching something rather than saying "correct".

     Write the correct option first if that is easiest. The page shuffles the
     options on every render and remaps `answer` to follow, so the answer is
     never reliably in the same place. Add `fixed: true` to a question whose
     options only make sense in the order given.
  --------------------------------------------------------------- */
  quizzes: {
    "m1-map": [
      {
        q: "Which of these nests inside the others correctly?",
        options: [
          "LLMs sit inside generative AI, which sits inside machine learning, which sits inside AI",
          "AI sits inside machine learning, which sits inside NLP",
          "They are four names for the same thing, used by different companies"
        ],
        answer: 0,
        why: "AI is the umbrella. Machine learning is one way of building AI, generative AI is machine learning that creates new content, and LLMs are the specific technology behind most generative text AI today."
      },
      {
        q: "A translation tool is an example of…",
        options: ["NLP — machine learning applied to language", "Generative AI", "Neither; translation is hand-coded rules"],
        answer: 0,
        why: "Translation, captions and spell-check are all NLP. Most of them long predate ChatGPT, which is why you have been using NLP for years without calling it that."
      }
    ],

    "m1-daily": [
      {
        q: "You dictate a text message and your phone types it out. What did you just use?",
        options: ["NLP", "An LLM", "Nothing — that is not AI"],
        answer: 0,
        why: "Voice-to-text is NLP: machine learning applied to language. No large language model has to be involved for that to count."
      }
    ],

    "m2-loop": [
      {
        q: "How many times does the loop run to produce a three-paragraph answer?",
        options: ["Once per token — so hundreds of times", "Once, for the whole answer", "Once per sentence"],
        answer: 0,
        why: "Tokenization → embeddings → transformers → probabilities → sampling, then back to the top. Every word you see is another lap."
      },
      {
        q: "While the base model runs that loop, what is it looking facts up in?",
        options: [
          "Nothing — there is no fact database inside the loop",
          "An internal encyclopedia built during training",
          "The live web, on every request"
        ],
        answer: 0,
        why: "Search and document tools get bolted on top of the model (Module 3), but they are an addition. The loop itself is prediction, not lookup."
      }
    ],

    "m2-training-data": [
      {
        q: "Why is a model weaker on ʻōlelo Hawaiʻi than on English?",
        options: [
          "There is far less of it in the training data",
          "Hawaiian grammar is too irregular to model",
          "The companies deliberately excluded it"
        ],
        answer: 0,
        why: "Underrepresented in, weak on. And it will still answer confidently rather than tell you it is out of its depth — which is exactly what makes it risky."
      }
    ],

    "m2-parameters": [
      {
        q: "Parameters are best described as…",
        options: [
          "The model's learned settings — internal knobs that decide how it weighs information",
          "The documents the model can search",
          "The settings you change in the app, like tone or length"
        ],
        answer: 0,
        why: "They are set during pre-training and fixed by the time you use it. Change them and the same input produces different probabilities."
      },
      {
        q: "More parameters means…",
        options: ["Generally, though not always, more capability", "Always a better model", "A bigger context window"],
        answer: 0,
        why: "Size correlates with capability but does not guarantee it, and it is a separate thing from how much text the model can hold in view at once."
      }
    ],

    "m2-pretraining-inference": [
      {
        q: "You correct the model mid-conversation. Has it learned from you?",
        options: [
          "No — it is applying what it already learned, and it will use your correction only within this conversation",
          "Yes, its parameters just updated",
          "Yes, but only after you close the chat"
        ],
        answer: 0,
        why: "Pre-training happened once, before you opened the app. Everything you do is inference. Some products separately remember things about you, but that is a product feature, not the model retraining itself."
      }
    ],

    "m2-tokenization": [
      {
        q: "Which is more tokens?",
        options: ["“indistinguishable”, one long word", "“the cat sat”, three short ones", "They are identical — one token per word"],
        answer: 0,
        why: "Common words are usually a single token; long or uncommon ones get split into several. “Indistinguishable” is about four tokens, “the cat sat” is three."
      },
      {
        q: "Why is it unreliable at counting the letters in a word?",
        options: [
          "It works with token chunks, not individual letters",
          "It is bad at arithmetic",
          "Counting is blocked for safety reasons"
        ],
        answer: 0,
        why: "Same reason it struggles to reverse a word or rhyme on spelling. The letters are not what it is looking at."
      }
    ],

    "m2-embeddings": [
      {
        q: "In embedding space, what does it mean for two words to sit close together?",
        options: ["They get used in similar ways", "They are spelled similarly", "They appear equally often"],
        answer: 0,
        why: "Distance stands in for similarity of use. “King” lands near “queen” because of the company those words keep, not because of their letters."
      },
      {
        q: "At the embedding step, does Python-the-language get a different position from Python-the-snake?",
        options: [
          "No — one token, one position. The surrounding words sort it out later",
          "Yes, the model picks the right sense immediately",
          "Yes, they are different tokens entirely"
        ],
        answer: 0,
        why: "Separating the two senses is attention's job, in the next lesson. It reads whether “import” or “reptile” is nearby and pulls that one position toward one meaning or the other."
      }
    ],

    "m2-transformers": [
      {
        q: "In “The honu swam toward the ocean”, attention is deciding…",
        options: [
          "Which words matter most to each other — honu↔swam strongly, the second “the” barely at all",
          "Which words to delete before answering",
          "The alphabetical order of the tokens"
        ],
        answer: 0,
        why: "It is weighting relationships, many times in parallel across different attention heads, each catching a different kind of link."
      }
    ],

    "m2-next-token": [
      {
        q: "At each step, what does the model actually produce?",
        options: [
          "A ranked list of probabilities — ocean 45%, shore 20%, reef 15%…",
          "The single correct next word",
          "A sentence, which it then checks"
        ],
        answer: 0,
        why: "One ranked list, one pick, then the whole thing runs again with that pick included."
      },
      {
        q: "Why does it sound just as confident when it is wrong?",
        options: [
          "It is optimizing for a plausible next token, never for a true statement",
          "It is trained to never admit uncertainty",
          "It is confident only when it has checked a source"
        ],
        answer: 0,
        why: "Confidence in the writing and correctness of the content are unrelated here. That gap is where hallucination lives."
      }
    ],

    "m2-sampling": [
      {
        q: "Same question, asked twice, two different answers. What happened?",
        options: [
          "It sampled from the ranked list instead of always taking the top pick",
          "The model was updated between the two questions",
          "Something is broken and you should report it"
        ],
        answer: 0,
        why: "Probabilistic, not deterministic. A word at 15% comes up about one time in seven. Expected behaviour, not a bug."
      },
      {
        q: "You turn the temperature up. What changes?",
        options: [
          "The odds flatten, so lower-ranked words land more often",
          "The model thinks for longer",
          "The answer gets longer"
        ],
        answer: 0,
        why: "Temperature reshapes the distribution before the dice roll. Low sharpens it toward the favourite; high gives the long shots a real chance."
      }
    ],

    "m2-context-window": [
      {
        q: "A long conversation seems to “forget” what you said at the start. Why?",
        options: [
          "The oldest material fell outside the context window, so the model cannot see it at all",
          "The model deliberately discards old topics",
          "Its memory degrades the longer it runs"
        ],
        answer: 0,
        why: "The window covers your prompt, the conversation so far and any documents you shared. Past the limit, it is not faded — it is gone."
      }
    ],

    "m3-prompts": [
      {
        q: "Which is the stronger prompt?",
        options: [
          "“Write a 100-word bio for Keiko, our program director, for a grant funder audience, warm but concise, from the notes below.”",
          "“Write a bio for Keiko.”",
          "They produce the same thing; the model knows who Keiko is"
        ],
        answer: 0,
        why: "Treat it like a capable new hire: vast general knowledge, zero knowledge of your situation. Audience, length, tone and the source material all have to come from you."
      }
    ],

    "m3-hallucinations": [
      {
        q: "It gives you an exact page number for a quote. What do you do?",
        options: [
          "Check it — specific-sounding citations are a classic invention",
          "Trust it; that level of detail means it looked it up",
          "Ask it again, and trust it if the answer matches"
        ],
        answer: 0,
        why: "Asking twice does not help much either — it can produce the same plausible fiction twice. Go to the actual source."
      }
    ],

    "m3-grounding": [
      {
        q: "Which parts of an AI draft deserve the closest check?",
        options: ["Numbers, quotes and names", "Grammar and spelling", "Length and formatting"],
        answer: 0,
        why: "Those are the high-risk items: specific, confident, and the easiest for the model to fabricate. Grounding means pairing it with real sources you can click through to."
      }
    ],

    "m3-bias": [
      {
        q: "Where does model bias mainly come from?",
        options: [
          "Training data — whose voices and languages are well represented in it, and whose are not",
          "The opinions of the engineers who built it",
          "The way you word the question"
        ],
        answer: 0,
        why: "This is the Module 2 training-data lesson showing up in practice. A model can reproduce and amplify existing skews rather than flag them."
      },
      {
        q: "You ask about Hawaiian cultural protocol and get a fluent, confident answer. What is the risk?",
        options: [
          "It may be an outside guess dressed up as knowledge, where it should have deferred",
          "There is none — fluency means it found good sources",
          "It will refuse, so the question is moot"
        ],
        answer: 0,
        why: "The failure mode is not silence, it is confidence. Community and Native sources hold the authority here, and the model has no way to know it should stand down."
      }
    ],

    "m3-reasoning": [
      {
        q: "The model shows its reasoning step by step. Does that mean the answer is right?",
        options: [
          "No — the steps are plausible-sounding text too",
          "Yes, visible steps can be verified by the model",
          "Yes, reasoning mode turns off hallucination"
        ],
        answer: 0,
        why: "A tidy, confident-looking chain of steps can add up to the wrong final answer. Looking rigorous is not the same as being correct."
      }
    ],

    "m3-oversight": [
      {
        q: "AI drafts a social post about a cultural practice. What happens next?",
        options: [
          "Someone who actually knows the topic reads it and fixes what is off, before it posts",
          "Post it — a second AI pass can check it",
          "Post it if it reads well and nobody objects"
        ],
        answer: 0,
        why: "AI drafts, explores and accelerates. A person stays responsible for what goes out the door. Every time, no exceptions, and doubly so for anything touching culture or community."
      }
    ],

    "m3-model-families": [
      {
        q: "“Model family” means…",
        options: [
          "Versions of the same model line released over time, like GPT-4 then GPT-5",
          "Models from companies that partner with each other",
          "Models that share the same training data"
        ],
        answer: 0,
        why: "The way iPhone 15 and iPhone 16 are versions of one line. Different companies build different families, with similar general ideas underneath."
      }
    ]
  },

  /* ---------- 7. PRACTICE ACTIVITIES ----------
     Four playable widgets. `type` picks the engine, so the only way to add a
     fifth activity is to add an engine in assets/app.js too.
       tokens     live token-chopping sandbox (no data needed)
       predict    next-token dice roll with a temperature slider; needs `rounds`
       match      definition → term quiz, generated from the glossary below
       scenarios  judgment calls; same shape as the quizzes above
  --------------------------------------------------------------- */
  practice: [
    {
      id: "tokens",
      type: "tokens",
      title: "Token chopper",
      tag: "Module 2 · Tokenization",
      blurb: "Type anything and watch it come apart into the chunks a model actually sees. Try your own name. Then try a sentence in ʻōlelo Hawaiʻi and watch the count climb.",
      sample: "Aloha kākou! The honu swam toward the ocean, indistinguishable from the reef.",
      note: "This is an approximation of how real tokenizers behave — close enough to make the point, not the exact chunking any one model uses.",
      link: { label: "The real thing: Tiktokenizer", url: "https://tiktokenizer.vercel.app/" }
    },
    {
      id: "dice",
      type: "predict",
      title: "Roll the dice",
      tag: "Module 2 · Prediction & sampling",
      blurb: "Pick the word you think comes next, then let the model roll. Move the temperature slider and roll again — the odds are the same machinery, reshaped.",
      note: "The percentages are illustrative, in the spirit of the Module 2 example. A real model ranks every token it knows, not five.",
      rounds: [
        {
          stem: "The honu swam toward the",
          options: [
            { word: "ocean",   p: 45 },
            { word: "shore",   p: 20 },
            { word: "reef",    p: 15 },
            { word: "current", p: 12 },
            { word: "sky",     p: 8 }
          ]
        },
        {
          stem: "Before the workshop starts, please open your",
          options: [
            { word: "laptop",   p: 42 },
            { word: "notebook", p: 24 },
            { word: "phone",    p: 18 },
            { word: "eyes",     p: 10 },
            { word: "window",   p: 6 }
          ]
        },
        {
          stem: "The training data came mostly from the",
          options: [
            { word: "internet",  p: 50 },
            { word: "web",       p: 21 },
            { word: "archives",  p: 13 },
            { word: "community", p: 10 },
            { word: "islands",   p: 6 }
          ]
        }
      ]
    },
    {
      id: "match",
      type: "match",
      title: "Term match",
      tag: "All modules · Glossary",
      blurb: "Six definitions, no jargon. Name the term each one describes. Drawn at random from the glossary, so it is a different run every time.",
      rounds: 6
    },
    {
      id: "judge",
      type: "scenarios",
      title: "Would you send it?",
      tag: "Module 3 · Oversight",
      blurb: "Six real situations, the kind that come up in a week of actual work. There is a defensible answer to each one — and the reasoning matters more than the score.",
      items: [
        {
          q: "An LLM drafts your monthly funder update. The numbers match the ones you pasted in. What now?",
          options: ["Read it, fix the tone, send it", "Send it as written — the numbers check out", "Do not use AI for funder communication at all"],
          answer: 0,
          why: "This is close to the ideal use: you supplied the facts, it did the drafting, a person signs off. Grounded in your own source material, with a human between the draft and the door."
        },
        {
          q: "You ask for the protocol around a specific Hawaiian cultural practice. The answer is detailed and confident.",
          options: [
            "Do not use it — take the question to people who hold that ʻike",
            "Use it as a first draft and lightly fact-check",
            "Use it; the detail suggests it found real sources"
          ],
          answer: 0,
          why: "Underrepresented in training data and answered with full confidence anyway. Cultural authority sits with community and Native sources, not with a model, and “lightly fact-check” is not a real safeguard here."
        },
        {
          q: "It cites a 2019 study with an author, a journal and a page number to support a grant claim.",
          options: ["Find the study before the claim goes anywhere", "Cite it — that detail is too specific to be invented", "Drop the claim entirely"],
          answer: 0,
          why: "Invented citations look exactly like this: specific, formatted, plausible. It might well be real. You will not know until you look, and a funder proposal is the wrong place to find out."
        },
        {
          q: "You paste in meeting notes and ask for action items. Two of them have no owner named anywhere in the notes.",
          options: [
            "Good — you told it to write UNASSIGNED rather than guess",
            "Let it assign the most likely person",
            "Rewrite the notes so every item has an owner"
          ],
          answer: 0,
          why: "Left to itself, it will fill the gap with a plausible name, because a name is the plausible next token. Telling it to mark gaps explicitly turns invisible guessing into a visible hole you can go fill."
        },
        {
          q: "Asked to explain a haumāna's assessment result, it produces a step-by-step chain of reasoning ending in a recommendation.",
          options: [
            "Treat the steps as a draft argument and check each one yourself",
            "Follow the recommendation — the reasoning is right there",
            "Ask it to check its own reasoning, then follow it"
          ],
          answer: 0,
          why: "Visible steps are generated text like everything else, and asking it to grade its own work generates more of the same. A tidy chain can land on the wrong answer, and this decision is about a real person."
        },
        {
          q: "A partner asks whether you used AI on a document you sent them.",
          options: ["Tell them what it did and who reviewed it", "Say no — a person edited it, so it counts as yours", "Avoid the question"],
          answer: 0,
          why: "The honest answer is usually the easy one: it drafted, a named person reviewed and is accountable for it. That is the standard we are asking others to hold too."
        }
      ]
    },
    {
      id: "cite",
      type: "cite",
      title: "Invent a citation",
      tag: "Module 3 · Hallucinations",
      blurb: "Pick a claim and watch a source get built for it, field by field, out of whatever looks plausible. Then roll it again — same claim, different source, same confident delivery. Nothing is ever looked up.",
      note: "Every citation this produces is fabricated, and is stamped as such. That is the entire point — it is the same next-token machinery as Roll the dice, pointed at something that looks like a fact.",
      claims: [
        {
          claim: "Place-based learning improves student retention in Hawaiʻi",
          authors: ["Kahale", "Fernandez", "Whitford", "Akana", "Brennan", "Nakamura"],
          titles: [
            "Place-based pedagogy and student persistence",
            "Land, language and learner retention",
            "Situated curriculum in island communities",
            "Belonging and persistence in place-based programs"
          ],
          journals: [
            "Journal of Educational Research",
            "Pacific Educational Review",
            "International Journal of Place-Based Education",
            "Studies in Community Learning"
          ]
        },
        {
          claim: "Students who learn to code before age 12 earn more as adults",
          authors: ["Oyelaran", "Voss", "Chandra", "Mellor", "Iwasaki", "Delacroix"],
          titles: [
            "Early computational exposure and lifetime earnings",
            "Age of first programming and labour market outcomes",
            "Childhood technical education and wage trajectories",
            "Coding age and long-run economic return"
          ],
          journals: [
            "Journal of Labor Economics",
            "Computers & Education",
            "Review of Economics of Education",
            "Technology and Workforce Quarterly"
          ]
        },
        {
          claim: "Community-led data governance increases trust in research",
          authors: ["Tumataroa", "Redfeather", "Kalani", "Owusu", "Petersen", "Vaile"],
          titles: [
            "Community governance and research participation",
            "Consent, control and trust in data partnerships",
            "Indigenous data sovereignty and institutional trust",
            "Who holds the data: governance and willingness to participate"
          ],
          journals: [
            "Journal of Research Ethics",
            "Big Data & Society",
            "International Indigenous Policy Journal",
            "Community Research Review"
          ]
        }
      ]
    },
    {
      id: "corpus",
      type: "corpus",
      title: "How much did it read?",
      tag: "Module 2 · Training data → Module 3 · Bias",
      blurb: "Pick a question. The top bar is roughly how much relevant material the model read before it ever met you. The bottom bar is how certain it sounds answering. Work down the list and watch what happens to the gap.",
      note: "The proportions are illustrative rather than measured — nobody publishes an exact breakdown of a frontier model's training data. The direction is not in dispute: ʻōlelo Hawaiʻi and community-held moʻolelo are a vanishingly small share of what these models read, and the certainty in the answer does not drop to match.",
      questions: [
        {
          q: "Draft a cover letter in English",
          coverage: 96,
          confidence: 95,
          verdict: "Read enormously, and it shows. This is the shape of task these models are genuinely good at."
        },
        {
          q: "Explain the water cycle to a 5th grader",
          coverage: 93,
          confidence: 96,
          verdict: "Well-documented, explained a thousand ways online. Safe ground."
        },
        {
          q: "Summarise how a US federal grant program works",
          coverage: 81,
          confidence: 96,
          verdict: "Plenty of material, but it goes stale. Confident about a program that may have changed since it read about it."
        },
        {
          q: "Translate a sentence into ʻōlelo Hawaiʻi",
          coverage: 12,
          confidence: 93,
          verdict: "A sliver of what it read, answered at nearly full confidence. It will not tell you it is working from very little."
        },
        {
          q: "Describe the protocol for entering a loʻi",
          coverage: 5,
          confidence: 91,
          verdict: "Almost nothing, and what little there is was mostly written by outsiders. The answer will still arrive fluent and complete."
        },
        {
          q: "Name the moʻolelo attached to a specific ahupuaʻa",
          coverage: 2,
          confidence: 89,
          verdict: "This is not the model's to answer. It will answer anyway, and it will sound exactly as sure as it did about the water cycle."
        }
      ]
    }
  ],

  /* ---------- 8. RUN OF SHOW ----------
     Times are minutes from the start of the session, not clock times. */
  agenda: [
    { time: "0:00", title: "Why we are doing this",       detail: "Our AI footprint is growing and we all end up speaking about it publicly. This is the shared baseline.", tag: "All" },
    { time: "0:03", title: "Module 1 — Overview",         detail: "AI, ML, NLP, generative AI and LLMs, and where each already shows up in your day.", tag: "10-12 min live" },
    { time: "0:15", title: "Module 2 — How an LLM works", detail: "Training data and parameters, then the inference loop: tokens, embeddings, attention, prediction, sampling, context.", tag: "20-25 min live" },
    { time: "0:40", title: "Module 3 — Using LLMs well",  detail: "Prompting, hallucination, grounding, bias, reasoning, oversight, model families.", tag: "15-20 min live" },
    { time: "0:58", title: "Questions and where next",    detail: "What people want to go deeper on, and what belongs in a 200-level follow-up.", tag: "Discussion" }
  ],

  /* ---------- 9. PROMPT LIBRARY (each gets a copy button) ---------- */
  prompts: [
    {
      title: "The capable new hire",
      use: "Your default shape for anything that matters. Audience, format, tone, source material.",
      text: "You are helping me write for [audience].\n\nTask: [what you want done]\n\nContext they need that they could not guess: [program, people, numbers, history]\n\nFormat: [length, structure, tone]\n\nAvoid: [what would make this useless]\n\n[paste your source material]"
    },
    {
      title: "Bio for a funder",
      use: "The Module 3 example, ready to use. Note how much context it carries.",
      text: "Write a 100-word bio for [name], our [role], for a grant funder audience. Warm but concise. Draw only on the notes below — do not add accomplishments that are not there.\n\n[paste notes]"
    },
    {
      title: "Source-checked answer",
      use: "Makes guessing visible instead of invisible. The practical antidote to hallucination.",
      text: "Answer using only the document below. Before each claim, quote the exact sentence it came from.\n\nIf the document does not answer the question, say \"Not in the document\" and stop. Do not fill the gap from general knowledge.\n\n[paste document]"
    },
    {
      title: "Meeting notes to actions",
      use: "The most reliably useful thing most of us do with an LLM.",
      text: "Turn these notes into: (1) decisions made, (2) open questions, (3) action items with an owner and a due date where one was stated.\n\nIf an owner or date was never mentioned, write UNASSIGNED. Do not invent either one.\n\n[paste notes]"
    },
    {
      title: "Honest critique",
      use: "When you want the problems, not the praise.",
      text: "Here is my draft. Do not tell me what works.\n\nGive me the three strongest objections a skeptical [audience] would raise, ranked by how much damage each one does. For each, say what would have to be true for the objection to be wrong.\n\n[paste your work]"
    },
    {
      title: "Check me before I present",
      use: "Before you speak publicly about something you are still learning.",
      text: "I am going to explain [topic] to [audience]. Here is my explanation in my own words.\n\nTell me: what is wrong, what is oversimplified in a misleading way, and what a knowledgeable person in the room would push back on. Flag anything I should not say with confidence.\n\n[paste your explanation]"
    }
  ],

  /* ---------- 10. GLOSSARY ---------- */
  glossary: [
    { term: "Machine learning (ML)", def: "A way of building AI. Systems learn patterns from data instead of being explicitly programmed rule by rule." },
    { term: "Natural language processing (NLP)", def: "Machine learning applied specifically to language: getting computers to read, understand and produce human speech and text." },
    { term: "Generative AI", def: "Machine learning that creates new content — text, images, audio, video — rather than only classifying or predicting." },
    { term: "Large language model (LLM)", def: "The specific technology behind most generative text AI today. ChatGPT, Claude and Gemini are products built on LLMs." },
    { term: "Training data", def: "The websites, books, articles and code a model reads during pre-training. The source of both its knowledge and its gaps." },
    { term: "Parameters", def: "The model's learned settings — internal knobs that determine how it weighs and combines information to produce the next word." },
    { term: "Pre-training", def: "The first phase, which happens once. The model reads enormous amounts of text and adjusts its parameters to get better at predicting language." },
    { term: "Inference", def: "Using the model. Happens in real time, every message you send. The model applies what it already learned and is not learning from you." },
    { term: "Token", def: "A chunk of text, roughly three-quarters of a word. Each one gets a number. Common words are one token; long words get split into several." },
    { term: "Embedding / vector", def: "A token turned into coordinates in a \"meaning space\". Words used in similar ways end up close together." },
    { term: "Transformer", def: "The architecture underneath modern LLMs. For every token it decides which other tokens matter most." },
    { term: "Attention", def: "The weighting of relationships between tokens. Strong links carry meaning; weak links barely register. Runs in parallel across many attention heads." },
    { term: "Next-token prediction", def: "The core loop: given everything so far, produce a ranked list of probabilities for what comes next, pick one, repeat." },
    { term: "Probabilistic", def: "Uses statistical likelihood, so the same input can produce different outputs. The opposite of deterministic, like a calculator." },
    { term: "Greedy decoding", def: "Always picking the highest-probability token. Predictable, and flatter." },
    { term: "Temperature", def: "A dial on how confident the probability distribution is. Higher temperature makes lower-ranked tokens more likely to get picked." },
    { term: "Context window", def: "How much text the model can see at once: your prompt, the conversation, and shared documents. Past the limit, the oldest material drops out of view." },
    { term: "Hallucination", def: "Fluent, confident output that is simply false. A side effect of optimizing for plausible next word rather than true statement." },
    { term: "Grounding", def: "Pairing the model with real, retrievable sources so answers can be traced and checked instead of taken on trust." },
    { term: "Model family", def: "Versions of the same model line released over time — GPT-4 and GPT-5, or Claude's successive releases." }
  ],

  /* ---------- 11. FAQ ---------- */
  faq: [
    { q: "Who is this for?",
      a: "Purple Maiʻa staff first, at a 101 level. Our staff distribution mirrors the broader community well enough that this doubles as a useful public asset, which is why the page is open and has no login." },
    { q: "Do I need any technical background?",
      a: "None. There is no math anywhere in these three modules, and nothing assumes you have used a particular tool." },
    { q: "Is the model learning from what I type?",
      a: "Not in real time. Pre-training happened once, before you ever opened the app, and inference is the model applying what it already learned. Some products are separately built to remember things about you — that is a product feature, not the model retraining itself." },
    { q: "Why do I get a different answer when I ask the same question twice?",
      a: "Because an LLM is probabilistic rather than deterministic. It samples from a ranked list of likely next tokens instead of always taking the top one. That variation is expected behaviour, not a bug." },
    { q: "Why is it weak on ʻōlelo Hawaiʻi and Hawaiian cultural context?",
      a: "Training data. If something is underrepresented in what the model read, the model is weaker on it — and it will still answer confidently rather than tell you it is out of its depth. This is covered in Module 2 and returns in Module 3 under bias." },
    { q: "It showed its reasoning step by step. Doesn't that mean it is right?",
      a: "No. Visible reasoning is still plausible-sounding text generated one step at a time. A tidy chain of steps can lead to a wrong answer, and looking rigorous is not the same as being correct." },
    { q: "Can I use this to draft something public-facing?",
      a: "Yes, as a draft. A person who actually knows the subject reads it and fixes what is off before it goes out — every time, especially for anything touching culture or community." },
    { q: "Why isn't fine-tuning, RLHF, agents or open weights covered?",
      a: "Deliberately held back. Those belong with the Sovereign Stack work and a 200-level follow-up, alongside the community responsibility material — governance, data provenance and consent, Indigenous data sovereignty, cultural authority. This asset is the 101 baseline." },
    { q: "What does the “Viewing as” switcher at the top do?",
      a: "It re-skins the same knowledge base for whoever is in the room — staff onboarding, a partner briefing, and more versions as we add them. The framing, the run of show and the suggested starting lessons change; nothing is ever hidden, and all 19 lessons stay reachable in every mode. The switcher writes itself into the address bar, so you can copy the link and send somebody straight into the right version." },
    { q: "Are the quizzes graded, and does anyone see my score?",
      a: "No and no. The checks under each lesson and the activities in Practice are for you. Like the progress ring, answers are kept in your own browser and nothing is uploaded anywhere." },
    { q: "Where are the Purple Maiʻa videos?",
      a: "Being animated from these scripts now. Lessons without one yet say so on the card, and the video appears in place as each one lands. The outside videos already embedded are credited under Downloads & links." },
    { q: "Will these materials stay up?",
      a: "Yes. The page is static and public, and the content is built to be chopped up and reused — short-form social, long-form video, workshops, curriculum." }
  ],

  /* ---------- 12. RESOURCES ---------- */
  resources: [
    {
      group: "Video sequence (~35 min)",
      items: [
        { label: "Natural Language Processing: Crash Course AI #7", url: "https://www.youtube.com/watch?v=oi0JXuL19TA", desc: "13:29 · embedded in Module 1, “AI, ML, NLP, generative AI, LLMs”." },
        { label: "How LLMs Actually Generate Text — LearnThatStack", url: "https://www.youtube.com/watch?v=NKnZYvZA7w4", desc: "9:24 · embedded in Module 2, “The loop, end to end”. The source for most of that module." },
        { label: "Large Language Models explained briefly — 3Blue1Brown", url: "https://www.youtube.com/watch?v=LPZh9BOjkQs", desc: "7:58 · embedded in Module 2, “Parameters”." },
        { label: "ChatGPT, AI and Māori data sovereignty", url: "https://www.sciencelearn.org.nz/videos/2194-chatgpt-ai-and-maori-data-sovereignty", desc: "3:47 · linked from Module 3, “Bias”. Hosted by Science Learning Hub, with a full transcript." }
      ]
    },
    {
      group: "Demos worth playing with",
      items: [
        { label: "LLM visualizer", url: "https://bbycroft.net/llm", desc: "Walk through a working model layer by layer. The best companion to Module 2." },
        { label: "Embedding projector", url: "https://projector.tensorflow.org/", desc: "Meaning space you can rotate and search. Makes embeddings click." },
        { label: "TensorFlow Playground", url: "https://playground.tensorflow.org/", desc: "Train a tiny neural net in the browser and watch it learn." },
        { label: "Survival of the Best Fit", url: "https://www.survivalofthebestfit.com/resources", desc: "Hiring-algorithm game about how bias gets baked in. Good before Module 3." },
        { label: "Google PAIR Explorables", url: "https://pair.withgoogle.com/explorables/", desc: "Interactive essays on bias, privacy and model behaviour." },
        { label: "Quick, Draw!", url: "https://quickdraw.withgoogle.com/?locale=en_US", desc: "Thirty seconds, and everyone understands training data." },
        { label: "AI4Hawaiʻi", url: "https://www.ai4hawaii.org/", desc: "Local context for the conversation." }
      ]
    },
    {
      group: "Sources cited in the deck",
      items: [
        { label: "On the Dangers of Stochastic Parrots — Bender et al., FAccT 2021", url: "https://dl.acm.org/doi/10.1145/3442188.3445922", desc: "The bias slide." },
        { label: "Retrieval-Augmented Generation — Lewis et al., NeurIPS 2020", url: "https://arxiv.org/abs/2005.11401", desc: "The grounding slide." },
        { label: "Chain-of-Thought Prompting — Wei et al., 2022", url: "https://arxiv.org/abs/2201.11903", desc: "The reasoning slide." },
        { label: "Survey of Hallucination in NLG — Ji et al., 2023", url: "https://arxiv.org/abs/2202.03629", desc: "The hallucination slide." },
        { label: "NIST AI Risk Management Framework 1.0", url: "https://www.nist.gov/itl/ai-risk-management-framework", desc: "The human oversight slide." }
      ]
    },
    {
      /* Purple Maiʻa's own short-form animations. As each one lands, drop the
         file in assets/ and set the matching lesson's
         video: "file:assets/<name>.mp4" — the placeholder disappears on its own. */
      group: "Purple Maiʻa originals",
      items: [
        { label: "Short-form animations — in production", url: "#lessons", desc: "Animated from the LLM/NLP 101 scripts. Lessons without a video yet are marked on the card." },
        { label: "Scripts these are built from", url: "#lessons", desc: "Every lesson's takeaways are the script. Open a lesson to read the one you need." }
      ]
    },
    {
      group: "For facilitators",
      items: [
        { label: "Fork this page", url: "https://github.com/KenethM/PurpleMaia---AI-Page/fork", desc: "Run the same session for your own group." },
        /* A PDF in the repo rather than a hosted deck link on purpose: no sign-in
           wall for people outside the org, and it survives being forked. */
        { label: "Slide deck (PDF)", url: "assets/llm-nlp-101.pdf", desc: "All 25 slides, as presented. 11 MB." },
        { label: "Prompt library", url: "#prompts", desc: "The prompts above, ready to copy." }
      ]
    }
  ],

  /* ---------- 13. FOOTER ---------- */
  footer: {
    org: "Purple Maiʻa",
    note: "LLM/NLP 101 is an internal learning asset built to be reused — as video, slides, social clips and workshop material. Free to adapt.",
    links: [
      { label: "Contact", url: "mailto:keneth@purplemaia.org" },
      { label: "Source on GitHub", url: "https://github.com/KenethM/PurpleMaia---AI-Page" },
      { label: "Report a problem", url: "https://github.com/KenethM/PurpleMaia---AI-Page/issues" }
    ]
  }
};
