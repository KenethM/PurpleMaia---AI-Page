/* =============================================================
   content.js  —  EDIT THIS FILE, NOT THE HTML.
   Everything on the page is generated from the object below.
   Save, refresh, done. See README.md for a field-by-field guide.

   Structure follows the LLM/NLP 101 deck:
     Module 1  Overview            (10-12 min)
     Module 2  How an LLM works    (20-25 min)
     Module 3  Using LLMs well     (15-20 min)
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
      { label: "Runtime", value: "~59 min" },
      { label: "Level", value: "101, no prereqs" }
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

  /* ---------- 3. TRACKS (the filter chips) ---------- */
  tracks: [
    { id: "overview",     label: "1 · Overview" },
    { id: "how-it-works", label: "2 · How an LLM works" },
    { id: "using-llms",   label: "3 · Using LLMs well" }
  ],

  /* ---------- 4. LESSONS ----------
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
      duration: "6 min",
      summary: "Five words people use interchangeably that are not interchangeable. They nest inside each other.",
      video: "",
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
      resources: []
    },

    /* ===== MODULE 2 — HOW AN LLM WORKS ===== */
    {
      id: "m2-loop",
      title: "The loop, end to end",
      track: "how-it-works",
      level: "Module 2",
      duration: "3 min",
      summary: "Five stages that repeat once per word. Everything else in this module is a zoom-in on one stage.",
      video: "",
      takeaways: [
        "Tokenization → embeddings → transformers → probabilities → sampling, then loop back and do it again.",
        "The loop runs once per token produced. A three-paragraph answer is that circuit running hundreds of times.",
        "Nothing in the loop is a lookup. There is no database being consulted."
      ],
      resources: []
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
      resources: []
    },
    {
      id: "m2-parameters",
      title: "Parameters",
      track: "how-it-works",
      level: "Module 2 · Pre-training",
      duration: "3 min",
      summary: "The model's learned settings — the internal knobs that decide how it weighs information.",
      video: "",
      takeaways: [
        "Parameters determine how the model combines what it is reading to produce a probability for the next word.",
        "Change the parameters and you change those probabilities for the same input.",
        "More parameters generally — not always — means more capability. No need to go further than that."
      ],
      resources: []
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
      resources: []
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
        "This is why an LLM can miscount the letters in a word. It never saw the letters."
      ],
      resources: []
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
        "Context decides which meaning: Python the language sits near JavaScript, Python the snake sits near reptile, and those two are far apart."
      ],
      resources: []
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
        "This happens many times in parallel through different attention heads, each catching a different kind of relationship."
      ],
      resources: []
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
        "The output is a ranked list of probabilities, not an answer: ocean 47%, shore 21%, reef 15%, current 12%, sky 10%.",
        "It is optimizing for \"plausible next token\", never for \"true statement\". That is where hallucination comes from.",
        "It also explains why the model sounds equally confident whether it is right or wrong — and why this is not thinking the way a person thinks."
      ],
      resources: []
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
        "Greedy decoding picks the top token every time. Sampling with temperature spreads the choice out — at temperature 0.9 it might pick \"reef\" at 15% over \"ocean\" at 47%."
      ],
      resources: []
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
      resources: []
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
        { label: "Prompt library", url: "#prompts" }
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
      resources: []
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
      resources: []
    },
    {
      id: "m3-bias",
      title: "Bias",
      track: "using-llms",
      level: "Module 3",
      duration: "3 min",
      summary: "Not a new idea — this is the training data lesson from Module 2, showing up in practice.",
      video: "",
      takeaways: [
        "Training data reflects the internet's existing skews: whose voices, languages and stories are well represented, and whose are not.",
        "A model can reproduce and amplify those gaps rather than flag them.",
        "A model trained mostly on English-language Western sources may answer a question about Hawaiian cultural protocol with a confident outside guess instead of deferring to community and Native sources."
      ],
      resources: []
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
      resources: []
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
      resources: []
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
      resources: []
    }
  ],

  /* ---------- 5. RUN OF SHOW ----------
     Times are minutes from the start of the session, not clock times. */
  agenda: [
    { time: "0:00", title: "Why we are doing this",       detail: "Our AI footprint is growing and we all end up speaking about it publicly. This is the shared baseline.", tag: "All" },
    { time: "0:03", title: "Module 1 — Overview",         detail: "AI, ML, NLP, generative AI and LLMs, and where each already shows up in your day.", tag: "10-12 min" },
    { time: "0:15", title: "Module 2 — How an LLM works", detail: "Training data and parameters, then the inference loop: tokens, embeddings, attention, prediction, sampling, context.", tag: "20-25 min" },
    { time: "0:40", title: "Module 3 — Using LLMs well",  detail: "Prompting, hallucination, grounding, bias, reasoning, oversight, model families.", tag: "15-20 min" },
    { time: "0:58", title: "Questions and where next",    detail: "What people want to go deeper on, and what belongs in a 200-level follow-up.", tag: "Discussion" }
  ],

  /* ---------- 6. PROMPT LIBRARY (each gets a copy button) ---------- */
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

  /* ---------- 7. GLOSSARY ---------- */
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

  /* ---------- 8. FAQ ---------- */
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
    { q: "Will these materials stay up?",
      a: "Yes. The page is static and public, and the content is built to be chopped up and reused — short-form social, long-form video, workshops, curriculum." }
  ],

  /* ---------- 9. RESOURCES ---------- */
  resources: [
    {
      group: "Video sequence (~35 min)",
      items: [
        { label: "Natural Language Processing: Crash Course AI #7", url: "#", desc: "13:29 · pairs with Module 1. Add the YouTube link." },
        { label: "Large Language Models explained briefly — 3Blue1Brown", url: "#", desc: "7:58 · pairs with Module 2. Add the YouTube link." },
        { label: "How LLMs Actually Generate Text — LearnThatStack", url: "#", desc: "9:24 · the source for most of Module 2. Add the YouTube link." },
        { label: "ChatGPT, AI and Māori Data Sovereignty", url: "#", desc: "3:47 · pairs with bias in Module 3. Add the YouTube link." }
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
      group: "For facilitators",
      items: [
        { label: "Fork this page", url: "https://github.com/KenethM/PurpleMaia---AI-Page/fork", desc: "Run the same session for your own group." },
        { label: "Slide deck (PDF)", url: "#", desc: "The full LLM/NLP 101 deck. Drop the file in assets/ and link it here." },
        { label: "Prompt library", url: "#prompts", desc: "The prompts above, ready to copy." }
      ]
    }
  ],

  /* ---------- 10. FOOTER ---------- */
  footer: {
    org: "Purple Maiʻa",
    note: "LLM/NLP 101 is an internal learning asset built to be reused — as video, slides, social clips and workshop material. Free to adapt.",
    links: [
      { label: "Contact", url: "#" },
      { label: "Source on GitHub", url: "https://github.com/KenethM/PurpleMaia---AI-Page" },
      { label: "Report a problem", url: "#" }
    ]
  }
};
