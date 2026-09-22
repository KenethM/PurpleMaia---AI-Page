/* =============================================================
   content.js  —  EDIT THIS FILE, NOT THE HTML.
   Everything on the page is generated from the object below.
   Save, refresh, done. See README.md for a field-by-field guide.
   ============================================================= */

window.SITE = {

  /* ---------- 1. THE BASICS ---------- */
  event: {
    name: "AI Fundamentals",
    shortName: "AI Fundamentals",
    tagline: "A hands-on session on what AI actually is, what it is good at, and how to use it well.",
    date: "Saturday, October 18, 2026",
    time: "9:00 AM - 3:00 PM HST",
    location: "Community Hall + livestream",
    badge: "Workshop materials",
    intro:
      "Everything from the session lives on this page: slides, recordings, exercises, and the links we mentioned. " +
      "Nothing here expires and nothing is behind a login. Work through it in order, or jump to whatever you need.",
    ctaPrimary: { label: "Start with Lesson 1", href: "#lessons" },
    ctaSecondary: { label: "See the run of show", href: "#agenda" },
    // Small facts shown under the hero
    facts: [
      { label: "Lessons", value: "10" },
      { label: "Total runtime", value: "~2h 35m" },
      { label: "Cost", value: "Free, forever" },
      { label: "Prereqs", value: "None" }
    ]
  },

  /* ---------- 2. THREE ENTRY POINTS ---------- */
  pathways: [
    {
      icon: "sprout",
      title: "Brand new to AI",
      body: "Never typed anything into a chatbot, or tried once and bounced off. Start at the beginning and go in order.",
      action: { label: "Start the foundations track", filter: "foundations" }
    },
    {
      icon: "wrench",
      title: "I use it, but badly",
      body: "You get mediocre answers and assume that is just how it is. It is not. Skip ahead to prompting.",
      action: { label: "Jump to prompting", filter: "prompting" }
    },
    {
      icon: "shield",
      title: "I need to make a call",
      body: "You are deciding what your team, classroom, or organization should allow. Start with responsible use.",
      action: { label: "Review responsible use", filter: "responsible" }
    }
  ],

  /* ---------- 3. TRACKS (the filter chips) ---------- */
  tracks: [
    { id: "foundations", label: "Foundations" },
    { id: "prompting",   label: "Prompting" },
    { id: "practice",    label: "Practice" },
    { id: "responsible", label: "Responsible use" },
    { id: "build",       label: "Build something" }
  ],

  /* ---------- 4. LESSONS ----------
     video:  ""                      -> friendly "video coming soon" placeholder
             "youtube:dQw4w9WgXcQ"   -> YouTube, no cookies loaded until clicked
             "vimeo:123456789"       -> Vimeo
             "file:assets/clip.mp4"  -> a video file committed to the repo
     slides: optional URL (Google Slides, Canva, a PDF in the repo, anything)
  --------------------------------------------------------------- */
  lessons: [
    {
      id: "l1",
      title: "What generative AI actually is",
      track: "foundations",
      level: "Start here",
      duration: "12 min",
      summary: "No math, no hype. A working mental model you can explain to someone else over dinner.",
      video: "",
      slides: "",
      takeaways: [
        "It predicts likely next words. It does not look anything up unless you give it a tool that does.",
        "Confidence and correctness are unrelated. It sounds equally sure either way.",
        "It has no memory between conversations unless the product adds one."
      ],
      resources: [
        { label: "One-page mental model (PDF)", url: "#" },
        { label: "Glossary of terms used today", url: "#glossary" }
      ]
    },
    {
      id: "l2",
      title: "Your first ten minutes",
      track: "foundations",
      level: "Start here",
      duration: "10 min",
      summary: "Pick a tool, open it, and get one genuinely useful result before we go any further.",
      video: "",
      takeaways: [
        "Any of the major assistants will do for today. Do not shop around yet.",
        "Start with a task you already know the right answer to, so you can judge the output.",
        "If the first answer is bad, that is information, not a verdict."
      ],
      resources: [
        { label: "Exercise 1: the warm-up task", url: "#" }
      ]
    },
    {
      id: "l3",
      title: "The five-part prompt recipe",
      track: "prompting",
      level: "Core",
      duration: "18 min",
      summary: "Role, task, context, format, constraints. The highest-leverage thing in this whole session.",
      video: "",
      takeaways: [
        "Say who it should be, what to do, what it needs to know, how to shape the answer, and what to avoid.",
        "Specific beats polite. \"120 words, third person, no adjectives\" beats \"please write something nice\".",
        "Show one example of what good looks like and quality jumps immediately."
      ],
      resources: [
        { label: "Prompt library", url: "#prompts" },
        { label: "Exercise 2: rewrite a bad prompt", url: "#" }
      ]
    },
    {
      id: "l4",
      title: "Giving it the right context",
      track: "prompting",
      level: "Core",
      duration: "15 min",
      summary: "Pasting documents, sharing links, and spotting when the model is guessing instead of reading.",
      video: "",
      takeaways: [
        "It only knows what is in front of it. Assume nothing is implied.",
        "Long context is not free. Bury the key fact on page nine and it may be missed.",
        "Ask it to quote the source line before it answers. Guessing becomes obvious."
      ],
      resources: []
    },
    {
      id: "l5",
      title: "Using it as a thought partner",
      track: "practice",
      level: "Core",
      duration: "14 min",
      summary: "Brainstorming, pressure-testing an idea, and getting critique that is not just flattery.",
      video: "",
      takeaways: [
        "Ask for the three strongest objections to your plan, not for feedback.",
        "Ask for ten options and throw away eight. Volume is cheap here.",
        "Make it argue the other side before you commit to yours."
      ],
      resources: []
    },
    {
      id: "l6",
      title: "Hallucinations and how to catch them",
      track: "responsible",
      level: "Core",
      duration: "16 min",
      summary: "Why confident nonsense happens, where it shows up most, and a checking habit that takes 30 seconds.",
      video: "",
      takeaways: [
        "Highest risk: names, dates, citations, quotes, statistics, legal and medical specifics.",
        "Never accept a source you have not opened yourself.",
        "If it cannot be wrong in a way that matters, you may not need to check it."
      ],
      resources: [
        { label: "The 30-second verification checklist", url: "#" }
      ]
    },
    {
      id: "l7",
      title: "Privacy: what not to paste",
      track: "responsible",
      level: "Core",
      duration: "11 min",
      summary: "A practical line between fine, ask first, and never - plus how to find your own data settings.",
      video: "",
      takeaways: [
        "Assume anything you paste may be stored and reviewed unless the settings say otherwise.",
        "Never: identifiable personal records, credentials, unreleased legal or financial material.",
        "Check the data controls in whatever tool you use. They are usually one screen deep."
      ],
      resources: []
    },
    {
      id: "l8",
      title: "Automating one real task",
      track: "practice",
      level: "Applied",
      duration: "20 min",
      summary: "Take one recurring chore from your actual week and build it into something repeatable.",
      video: "",
      takeaways: [
        "Good candidates: repetitive, text-heavy, low stakes, obvious when wrong.",
        "Write the prompt once, save it, reuse it. That saved prompt is the actual product.",
        "Keep a human check on the step where a mistake would cost something."
      ],
      resources: [
        { label: "Exercise 3: your automation worksheet", url: "#" }
      ]
    },
    {
      id: "l9",
      title: "Bias, attribution, and community values",
      track: "responsible",
      level: "Applied",
      duration: "17 min",
      summary: "Whose data trained it, whose voice it flattens, and what disclosure looks like in practice.",
      video: "",
      takeaways: [
        "Training data over-represents some communities and languages and under-represents others.",
        "Disclose AI involvement where a reader would want to know. That is usually the right test.",
        "Some knowledge is not yours to feed into someone else's model. Ask before you do."
      ],
      resources: []
    },
    {
      id: "l10",
      title: "Building your own assistant",
      track: "build",
      level: "Applied",
      duration: "22 min",
      summary: "Turn your best prompt into a reusable custom assistant your whole group can share.",
      video: "",
      takeaways: [
        "A custom assistant is mostly a good instruction block plus a few reference files.",
        "Write the instructions like onboarding a new volunteer, not like code.",
        "Test it with the three weirdest requests you can think of before you share it."
      ],
      resources: []
    }
  ],

  /* ---------- 5. RUN OF SHOW ---------- */
  agenda: [
    { time: "9:00",  title: "Welcome and why we are here", detail: "Introductions, ground rules, and what you will walk out with.", tag: "All" },
    { time: "9:30",  title: "Foundations",                 detail: "Lessons 1 and 2. Everyone gets a working result before the break.", tag: "Hands-on" },
    { time: "10:45", title: "Break",                       detail: "Coffee, snacks, questions in the hallway.", tag: "" },
    { time: "11:00", title: "Prompting workshop",          detail: "Lessons 3 and 4, then rewrite your own prompts in pairs.", tag: "Hands-on" },
    { time: "12:00", title: "Lunch",                       detail: "Provided. Vegetarian option available.", tag: "" },
    { time: "1:00",  title: "Responsible use panel",       detail: "Lessons 6, 7, and 9. Bring the hard questions.", tag: "Discussion" },
    { time: "2:00",  title: "Build something",             detail: "Lessons 8 and 10. Leave with one working assistant.", tag: "Hands-on" },
    { time: "2:45",  title: "Show and tell, then pau",     detail: "Share what you built. Where to go next.", tag: "All" }
  ],

  /* ---------- 6. PROMPT LIBRARY (each gets a copy button) ---------- */
  prompts: [
    {
      title: "The five-part recipe",
      use: "Your default starting shape for anything that matters.",
      text: "You are a [role] with experience in [domain].\n\nTask: [what you want done]\n\nContext: [what it needs to know that it could not guess]\n\nFormat: [length, structure, tone, audience]\n\nAvoid: [what would make this answer useless]"
    },
    {
      title: "Honest critique",
      use: "When you want the problems, not the praise.",
      text: "Here is my draft. Do not tell me what works.\n\nGive me the three strongest objections a skeptical [audience] would raise, ranked by how much damage each one does. For each, say what would have to be true for the objection to be wrong.\n\n[paste your work]"
    },
    {
      title: "Explain it to me properly",
      use: "Learning something new without getting an encyclopedia dump.",
      text: "Explain [topic] to me. I already understand [what you know]. I get lost at [where you get lost].\n\nStart with one concrete example before any definitions. Then check my understanding by asking me two questions. Do not move on until I answer."
    },
    {
      title: "Meeting notes to actions",
      use: "The most reliably useful thing most people do with AI.",
      text: "Turn these notes into: (1) decisions made, (2) open questions, (3) action items with an owner and a due date where one was stated.\n\nIf an owner or date was never mentioned, write UNASSIGNED. Do not invent either one.\n\n[paste notes]"
    },
    {
      title: "Source-checked answer",
      use: "Makes guessing visible instead of invisible.",
      text: "Answer using only the document below. Before each claim, quote the exact sentence it came from.\n\nIf the document does not answer the question, say \"Not in the document\" and stop. Do not fill the gap from general knowledge.\n\n[paste document]"
    },
    {
      title: "Ten options, fast",
      use: "Names, headlines, framings, approaches.",
      text: "Give me 10 options for [thing]. Make them genuinely different from each other, not 10 versions of the same idea.\n\nNumbers 8, 9, and 10 should be ones a cautious person would not suggest. One line each, no explanation."
    }
  ],

  /* ---------- 7. GLOSSARY ---------- */
  glossary: [
    { term: "Model", def: "The trained system itself. GPT, Claude, Gemini and Llama are models; the app you type into is the product wrapped around one." },
    { term: "Prompt", def: "Everything you send it: your question plus any pasted context, files, or instructions the product adds behind the scenes." },
    { term: "Token", def: "A chunk of text, roughly three-quarters of a word. Models read and write in tokens, and pricing is usually per token." },
    { term: "Context window", def: "How much text it can hold in mind at once. Go past it and the earliest material falls out of view." },
    { term: "Hallucination", def: "Fluent, confident output that is simply false. Not lying and not quite a bug: a side effect of predicting plausible text." },
    { term: "Training data", def: "The text, code and images the model learned patterns from. It shapes what the model is good at and what it is blind to." },
    { term: "Fine-tuning", def: "Extra training on a narrow dataset to specialise a general model for one job or one voice." },
    { term: "RAG", def: "Retrieval-augmented generation: look up real documents first, then answer from them. How most useful company chatbots work." },
    { term: "Agent", def: "A model given tools and permission to take steps on its own - search, run code, send a message - rather than only replying." },
    { term: "Multimodal", def: "Handles more than text: images, audio, video and documents, going in and coming out." },
    { term: "Temperature", def: "A randomness dial. Low is repetitive and safe, high is creative and unreliable. Most chat products hide it." },
    { term: "Open weights", def: "The trained model files are published, so anyone can run or modify it on their own hardware." },
    { term: "Guardrails", def: "Rules and filters layered around a model to block certain outputs. Useful, imperfect, and not the same as the model being safe." },
    { term: "Inference", def: "Actually running the model to get an answer, as opposed to training it. This is what you pay for per use." }
  ],

  /* ---------- 8. FAQ ---------- */
  faq: [
    { q: "Do I need to pay for anything to follow along?",
      a: "No. Every exercise works on a free tier. Paid plans are faster and hold more context, but nothing here requires one." },
    { q: "Which tool should I use?",
      a: "For today, whichever one you can open right now. The skills transfer between all of them, and the differences matter far less than how you prompt." },
    { q: "Is it safe to use with our organization's information?",
      a: "It depends entirely on the tool's settings and your own policy. Lesson 7 covers the practical line. The short version: never paste identifiable personal records or credentials into a consumer chat product." },
    { q: "Is it going to take my job?",
      a: "Honest answer: it is already changing which parts of many jobs are worth a person's time. The useful response is to get specific about which parts of yours are repetitive text work, and then decide deliberately what you want to keep doing yourself." },
    { q: "Can students use this?",
      a: "Yes, and the responsible-use track is written with that in mind. Whether they may use it for a given assignment is your institution's call, not ours." },
    { q: "How do I cite or disclose AI use?",
      a: "Disclose where a reader would want to know - that is the test that holds up. Lesson 9 goes through what that looks like in writing, in design work, and in research." },
    { q: "Will these materials stay up?",
      a: "Yes. This page is static and public, and there is no login. Bookmark it, or fork the repository if you want your own copy." }
  ],

  /* ---------- 9. RESOURCES ---------- */
  resources: [
    {
      group: "Handouts from today",
      items: [
        { label: "Slide deck", url: "#", desc: "The full deck as a PDF." },
        { label: "Exercise workbook", url: "#", desc: "All three exercises in one printable file." },
        { label: "Prompt library", url: "#prompts", desc: "The prompts above, ready to copy." }
      ]
    },
    {
      group: "Keep going",
      items: [
        { label: "Reading list", url: "#", desc: "Six things worth your time, none of them hype." },
        { label: "Community channel", url: "#", desc: "Where participants keep asking questions afterward." },
        { label: "Next session", url: "#", desc: "Dates for the follow-up workshop." }
      ]
    },
    {
      group: "For facilitators",
      items: [
        { label: "Fork this page", url: "https://github.com/KenethM/PurpleMaia---AI-Page/fork", desc: "Run the same session for your own group." },
        { label: "Facilitator notes", url: "#", desc: "Timing, common questions, what usually goes sideways." }
      ]
    }
  ],

  /* ---------- 10. FOOTER ---------- */
  footer: {
    org: "AI Fundamentals",
    note: "These materials are free to reuse and adapt. If you run your own version, we would love to hear how it went.",
    links: [
      { label: "Contact", url: "#" },
      { label: "Source on GitHub", url: "https://github.com/KenethM/PurpleMaia---AI-Page" },
      { label: "Report a problem", url: "#" }
    ]
  }
};
