/* =============================================================
   content.js  —  EDIT THIS FILE, NOT THE HTML.
   Everything on the page is generated from the object below.
   Save, refresh, done. See README.md for a field-by-field guide.

   Structure follows the slide deck (assets/llm-nlp-101.pdf):
     Module 1  What is AI?           (10-12 min)
     Module 2  How AI chatbots work  (20-25 min)
     Module 3  Using AI well         (15-20 min)
   The module articles are written for a general reader: plain words, each
   technical term bolded and explained where it first appears, and examples
   from everyday life rather than from Purple Maiʻa's own work.

   Three things here are worth knowing before you edit:
     audiences  section 3  — re-skins the whole page per room (?for=kupuna)
     quizzes    section 6  — check-your-understanding, keyed by lesson id
     practice   section 7  — the playable activities in the Practice section
   ============================================================= */

window.SITE = {

  /* ---------- 1. THE BASICS ---------- */
  event: {
    name: "Artificial Intelligence 101",
    shortName: "Artificial Intelligence 101",
    // The home page's big line. `name` stays the page title and the header brand.
    headline: "Artificial Intelligence 101",
    tagline: "A free course from Purple Maiʻa on what AI is, how chatbots come up with an answer, and how to use them well.",
    /* `date` and `time` are deliberately empty. They used to name a specific
       session, which was right up until that session happened and then spent
       every day afterwards announcing a date in the past to new readers. The
       hero drops any of these three that is blank, so no stray separator is
       left behind.
       Fill them in when the next one is booked, and remember the
       CourseInstance in index.html, which is the machine-readable copy and
       the one nobody thinks to check. */
    date: "",
    time: "",
    location: "",
    badge: "",
    /* Not shown since the module pages replaced the hero (October 2026):
       intro, ctaPrimary, ctaSecondary and facts. Kept because the held-back
       audiences still override them. */
    intro:
      "Work through it in order, or jump to whatever you need. Everything is free and public, and nothing you do here leaves your browser.",
    ctaPrimary: { label: "Start with Module 1", href: "#/module/generative-ai" },
    ctaSecondary: { label: "Try the hands-on activities", href: "#/module/how-llms-work/practice" },
    facts: [
      { label: "Modules", value: "3" },
      { label: "Lessons", value: "19" },
      { label: "Activities", value: "7" }
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
      title: "I need to get this right",
      body: "You use these tools for things that matter, or you explain them to other people. Start with the limits and the judgment calls.",
      action: { label: "Go to using LLMs well", filter: "using-llms" }
    }
  ],

  /* ---------- 4. TRACKS (the filter chips) ----------
     `recap` is the one thing to carry out of that module. It shows at the end
     of the module's lessons and again when you finish the last lesson in the
     dialog — the idea being to pa'a the concept before moving to the next. */
  tracks: [
    {
      id: "overview",
      label: "1 · Overview",
      recap: "These five words nest inside each other rather than competing: AI, then machine learning, then NLP, then generative AI, then LLMs. Being able to say which one you mean puts you ahead of most of the conversation."
    },
    {
      id: "how-it-works",
      label: "2 · How an LLM works",
      recap: "Everything it does is one loop, run once per word: chop the text into tokens, turn them into positions in a meaning space, weigh which ones matter, rank what could come next, pick one. There is no lookup step and no fact-check step in that loop — which is precisely why Module 3 exists."
    },
    {
      id: "using-llms",
      label: "3 · Using LLMs well",
      recap: "It drafts, you decide. Give it the context it could not possibly guess, treat every confident claim as unverified until you have checked it, and keep a person who actually knows the subject between the draft and the door."
    }
  ],

  /* ---------- 4b. MODULES (the article pages) ----------
     The three modules a visitor reads, written from Purple Maiʻa's
     "AI 101 Learning Materials" white paper. Each module is one article.

     A section:
       id        part of the deep link, #/module/<module id>/<section id>
       heading   the section title, also its line in "In this module"
       lesson    a lesson id from section 5. The section shows that lesson's
                 video and counts toward that lesson's progress, and the
                 lesson's quiz joins the module's practice at the end.
       body      blocks, in order:
                   "a string"                 a paragraph
                   { list: [...] }            a bulleted list
                   { steps: [...] }           a numbered list
                   { table: { head: [...], rows: [[...], ...] } }
                 **double asterisks** mark bold text inside any string.
       parts     optional sub-sections ({ id, heading, lesson, body }), each
                 with its own video, under the section's own body
       takeaway  optional "Key takeaway" box
       sources   ids from `sources` below, shown under the section

     `image` is the picture on its home-page card. When it is the poster of
     one of our own videos (assets/video/<name>.jpg beside <name>.mp4, used by
     a lesson), hovering the card plays that video, muted. Set
     `preview: "assets/video/<other>.mp4"` to choose a different clip, or
     `preview: ""` to turn it off for that card.
     `track` ties a module to its placement result and its practice
     activities (practice[].module). Every source has been checked against
     the live page; do not add one without doing the same. */
  modules: [
    {
      id: "generative-ai",
      track: "overview",
      image: "assets/video/ai-isnt-one-thing.jpg",
      title: "What is AI?",
      summary: "“AI” is not a single technology. It is a family of related technologies that fit inside one another, and most of us have been using them for years.",
      lede: "AI is a family of technologies, not a single machine. Knowing which one you mean is the first step toward using it well.",
      sections: [
        {
          id: "several-technologies",
          heading: "AI is a family of technologies",
          body: [
            "When people say “AI”, they usually refer to computer systems performing tasks that typically require human intelligence, such as learning, reasoning, pattern recognition, and problem-solving. That everyday definition is useful, but it hides an important point: “AI” does not name a single technology.",
            "It is a family of related technologies working together, each with its own name and its own limitations. Learning to tell them apart makes news coverage and product claims about AI much easier to evaluate."
          ]
        },
        {
          id: "five-terms",
          heading: "Five terms that fit inside one another",
          lesson: "m1-map",
          body: [
            "These terms are best understood as circles, each one sitting inside the one before it.",
            { list: [
              "**Artificial intelligence (AI)** is the broadest circle. Any computer system performing work we would normally associate with human thinking.",
              "**Machine learning** is one way to build AI. Instead of following rules written out by a person, the system learns patterns from large numbers of examples.",
              "**Natural language processing (NLP)** applies machine learning to human language, so that computers can read, interpret and produce text and speech.",
              "**Generative AI** creates new content, such as text, images, audio or video, rather than only sorting or predicting.",
              "**Large language models (LLMs)** process language and generate new text. They are the technology behind AI chatbots such as ChatGPT, Claude, and Gemini."
            ] },
            "An AI chatbot therefore belongs to all five categories at once. “LLM” is simply the most precise name for it."
          ],
          sources: ["toloka-2026"]
        },
        {
          id: "already-met",
          heading: "Where you have already encountered it",
          lesson: "m1-daily",
          body: [
            "Most people have been using these technologies for years without thinking of them as AI.",
            { table: {
              head: ["Technology", "Where you have already encountered it"],
              rows: [
                ["Machine learning", "Streaming recommendations, spam filters, social media feeds"],
                ["Natural language processing", "Live captions, translation apps, spell-check, voice-to-text"],
                ["Generative AI", "Image generators, AI-created graphics, first-draft writing"],
                ["Large language models", "Drafting emails, summarizing long documents, quick how-to help"]
              ]
            } }
          ],
          takeaway: "These five terms fit inside one another rather than competing. Being able to say which one you mean puts you ahead of most conversations about AI."
        }
      ]
    },

    {
      id: "how-llms-work",
      track: "how-it-works",
      /* Three short checks instead of one 30-question block at the end. Each
         sits after the section in `after` and tests only the stretch since
         the last one. The last has no `after`: it closes the module. */
      checks: [
        { id: "learning", title: "How it learns", after: "learning-stops",
          lessons: ["m2-training-data", "m2-parameters", "m2-pretraining-inference"], practice: ["match-2a"] },
        { id: "writing", title: "How it writes an answer", after: "generation-loop",
          lessons: ["m2-loop", "m2-tokenization", "m2-embeddings", "m2-transformers", "m2-next-token"], practice: ["match-2b"] },
        { id: "built", title: "Variation, memory and how chatbots are built",
          lessons: ["m2-sampling", "m2-context-window", "m3-model-families"], practice: ["match-2c"] }
      ],
      /* Take a guess: questions nobody can answer before reading, at the top
         of the module. No score, not counted toward progress. Each answer is
         revealed once the section in `at` (a section or part id) is read. */
      warmup: {
        title: "Take a guess",
        blurb: "Three things most people get wrong about chatbots. You can't know these yet, so just guess. The answers are in this module.",
        items: [
          {
            q: "You correct a chatbot partway through a conversation. Does the model learn from you?",
            options: [
              "No. The model stays exactly as it was",
              "Yes, it updates itself straight away",
              "Yes, but only once the conversation ends"
            ],
            answer: 0,
            why: "Learning stops when training ends. It can use your correction for the rest of that conversation, but the model itself does not change.",
            at: "learning-stops"
          },
          {
            q: "Ask a chatbot how many r's are in “strawberry” and it may well get it wrong. Why?",
            options: [
              "It reads text in chunks, not letter by letter",
              "It was never trained on the word “strawberry”",
              "It is designed to make small mistakes so it seems human"
            ],
            answer: 0,
            why: "Text is split into tokens, numbered chunks that are often whole words. The letters inside a token are not what the model works with.",
            at: "tokenization"
          },
          {
            q: "You ask a chatbot the same question twice and get two different answers. Why?",
            options: [
              "It picks each word from weighted options, so some variation is built in",
              "It learned something new between your two questions",
              "Something went wrong the first time"
            ],
            answer: 0,
            why: "The model is probabilistic. At every step it samples from likely next words rather than always taking the top one, so variation is expected behavior.",
            at: "sampling"
          }
        ]
      },
      image: "assets/video/autocomplete-trick.jpg",
      title: "How AI chatbots work",
      summary: "How a chatbot learns from huge amounts of text then writes every answer, one small piece at a time.",
      lede: "An AI chatbot does not look up answers. It predicts them, one small piece of text at a time, and on its own it is only as reliable as the material it learned from.",
      sections: [
        {
          id: "training-and-inference",
          heading: "Training and inference: learning, then answering",
          body: [
            "Chatbots such as ChatGPT, Claude and Gemini run on a **large language model (LLM)**, and every LLM goes through two distinct phases: **training** and **inference**.",
            "Training is the phase in which the model learns. It processes an enormous amount of text and gradually adjusts itself to become better at predicting what comes next. This first stage, called **pre-training**, happens once for each version of a model, and later stages of training refine the result.",
            "Inference is the phase in which the model answers. Each time you send a message, the model applies what it has already learned to write a response, one small piece at a time."
          ],
          sources: ["cloudflare"]
        },
        {
          id: "training-data",
          heading: "Training data: what the model learned from",
          lesson: "m2-training-data",
          body: [
            "**Training data** is the body of text a model reads while it learns: websites, books, articles and computer code. Everything the model “knows” comes from this material, and so does every gap in its knowledge.",
            "When a subject is underrepresented in the training data, the model performs poorly on it.",
            "**ʻŌlelo Hawaiʻi (the Hawaiian language), Hawaiian cultural practice, and knowledge passed down through families and oral tradition** all appear far less often on the open internet than English-language material. No one designed this gap. It is a direct result of what the model read.",
            "The model also has no way of detecting the gap. It answers a question about Hawaiian protocol with the same confidence it brings to a general-knowledge question. This is the origin of bias and missing cultural context, which Module 3 returns to."
          ],
          sources: ["ibm-2025"]
        },
        {
          id: "parameters",
          heading: "Parameters: where the learning is stored",
          lesson: "m2-parameters",
          body: [
            "**Parameters** are the model's internal settings, a very large number of adjustable values that control how it weighs and combines information. They are often described as “knobs.”",
            "They work somewhat like the channels water carves into the land. Each time rain falls, water follows the easiest path downhill, and over time some channels deepen while others fill in and fade. What the landscape “knows” about where water should flow is not stored in any single groove. It lies in the overall shape of the terrain, the whole pattern of deep cuts and shallow dips that guides each new rainfall along familiar routes.",
            "During training, these settings are adjusted repeatedly until the model's predictions improve. Changing them changes which next word the model considers most likely. In general, models with more parameters tend to be more capable, although not always."
          ],
          sources: ["3b1b-2024"]
        },
        {
          id: "learning-stops",
          heading: "Learning stops when training ends",
          lesson: "m2-pretraining-inference",
          body: [
            "Because learning happens during training and then stops, correcting a chatbot does not correct the underlying model. It may acknowledge the error and give the right answer within that conversation, then repeat the same mistake in a new one. Its learning was complete before it was released.",
            "Two questions are worth keeping separate: whether the model learns from what you type, and whether the company stores what you type. Some products save conversations or offer memory features, and some companies use conversations to train future versions of their models, depending on their policies and your settings. None of this changes the model you are using, but it does mean that what you type may not remain private."
          ]
        },
        {
          id: "generation-loop",
          heading: "The generation loop: how it writes an answer",
          lesson: "m2-loop",
          body: [
            "Every response is produced by the same five-step loop, repeated once for each **token** the model writes. A token is a small unit of text: often a whole word, sometimes part of one.",
            { steps: [
              "**Tokenization.** The input text is divided into tokens, and each token is assigned an ID number.",
              "**Embeddings.** Each token is converted into a list of numbers that places it within a “meaning space,” where words used in similar contexts sit close together.",
              "**Attention.** For each token, the model determines which other tokens are most relevant to it. This is the work of the **transformer**, the design that today's chatbots are built on.",
              "**Probabilities.** Based on the full context, the model assigns every possible next token a probability.",
              "**Sampling.** The model selects one token, usually a likely one but not necessarily the most likely. It adds that token to the text and repeats the loop, until it selects a special token that signals the end of the response."
            ] },
            "A response several paragraphs long represents hundreds of passes through this loop. The videos below examine four of the steps more closely."
          ],
          parts: [
            { id: "tokenization",  heading: "Tokenization",           lesson: "m2-tokenization",
              body: ["The model does not read words the way people do. It processes numbered units of text, and the way a language is divided into tokens affects how much it costs to process. This is also why chatbots often struggle with letter-level tasks, such as counting the letters in a word."] },
            { id: "embeddings",    heading: "Embeddings",             lesson: "m2-embeddings",
              body: ["Each token becomes a list of numbers: a position on a map where nearby positions indicate similar meanings."] },
            { id: "attention",     heading: "Transformers and attention", lesson: "m2-transformers",
              body: ["For every token, the model weighs which other words matter most to it. This is how the same word can carry different meanings in different sentences."] },
            { id: "next-token",    heading: "Next-token prediction",  lesson: "m2-next-token",
              body: ["Given everything so far, the model scores every possible next token, selects one, adds it to the text, and repeats the process."] }
          ],
          sources: ["3b1b-2024", "learnthatstack-2025"]
        },
        {
          id: "sampling",
          heading: "Probabilistic output: why the same question gets different answers",
          lesson: "m2-sampling",
          body: [
            "A calculator produces the same answer every time you enter the same input. This is called **deterministic** behavior. A chatbot is **probabilistic**: it selects from weighted options, so the same question can produce different answers. This variation is expected, not a malfunction.",
            "A setting called **temperature** controls how much variation there is. At a low temperature, the model almost always selects the most likely token. At a higher temperature, it selects less likely tokens more often, so its responses vary more.",
            "The most important point in this module is that no step of the loop retrieves information or verifies facts. When a chatbot sounds confident, that confidence reflects how likely its words are, not whether they are true."
          ],
          sources: ["learnthatstack-2025"]
        },
        {
          id: "context-windows",
          heading: "Context windows: how much it can consider at once",
          lesson: "m2-context-window",
          body: [
            "The **context window** is the amount of text a model can take into account at one time. Your message, the conversation history, and any documents you provide all share that space.",
            "As a conversation grows longer, earlier messages may be dropped, summarized or given less weight, depending on the product. Long documents are subject to the same limit, and many tools do not indicate when only part of a document was processed. As a practical habit, start a new conversation for each new topic, and restate anything essential."
          ],
          takeaway: "A chatbot does not look up answers. It predicts them one token at a time, and on its own it is only as reliable as the text it learned from."
        },
        {
          id: "built-and-adapted",
          heading: "How chatbots are built and refined",
          body: [
            "Before a chatbot is released, the model behind it passes through several stages of development. Each stage shapes what the model knows and how it behaves.",
            { steps: [
              "**Pre-training.** The model processes a very large body of general text and learns to predict the next token. This requires data centers full of specialized computer chips (GPUs) running for weeks or months. The result is a **base model**, which has broad knowledge but little ability to follow instructions.",
              "**Fine-tuning.** The base model receives additional training on a smaller, carefully selected set of examples, which teaches it a specific task, style or subject area. Fine-tuning adjusts the same parameters, building on what the model has already learned.",
              "**Reinforcement learning from human feedback (RLHF).** People compare and rate the model's responses, and the model is trained to favor the kinds of responses that were rated more highly. This accounts for much of a chatbot's courteous, careful manner. It also shapes the model's values and blind spots, which depend on who did the rating and what they were asked to reward."
            ] },
            "**Alignment** is the broader effort to make a model's behavior match human intentions and values, and fine-tuning and RLHF are two of its main methods. This raises an important question for any community, and especially for Indigenous communities: whose values has the model been aligned to?"
          ],
          sources: ["ouyang-2022"]
        },
        {
          id: "families-and-agents",
          heading: "Model families, open weights and agents",
          lesson: "m3-model-families",
          body: [
            "Different companies develop different models, and each company releases a series of versions over time, known as a **model family**. ChatGPT is built on OpenAI's GPT family, Claude is developed by Anthropic, and Gemini by Google. Newer versions usually reflect more training, more data or an improved design, much as each new generation of a phone builds on the last. Model names change frequently, so confirm the current name before citing one.",
            "**Open weights** means that a model's trained parameters have been published, so that others can download and run it. This differs from fully **open source**, which would also include the code and detailed information about the training data. The distinction matters for communities seeking control over their own data (often called data sovereignty), because a community can only control a model it is able to run and adapt itself.",
            "An **agent** is an AI system set up to take actions rather than only produce text: searching the web, operating other software, or completing a task with several steps. Agents run on the same next-token loop, so every limitation described in Module 3 still applies. The stakes are higher, however, because the system is now acting rather than drafting."
          ],
          takeaway: "Each stage of a model's development shapes both what it knows and whose values it reflects.",
          sources: ["osi-2024"]
        }
      ]
    },

    {
      id: "using-llms-well",
      track: "using-llms",
      checks: [
        { id: "checking", title: "Prompting, grounding and checking", after: "hallucinations",
          lessons: ["m3-prompts", "m3-grounding", "m3-hallucinations"], practice: ["match-3a"] },
        { id: "judgment", title: "Bias, reasoning and judgment",
          lessons: ["m3-bias", "m3-reasoning", "m3-oversight"], practice: ["match-3b", "judge"] }
      ],
      image: "assets/video/fake-citation.jpg",
      title: "Using AI well",
      summary: "How to ask for what you need, how to check what comes back, and the limits to keep in mind: hallucinations, bias, privacy, and who's responsible.",
      lede: "A chatbot cannot know what only you know, and it does not check its own work. Provide context, ground it in real sources, and verify what comes back.",
      sections: [
        {
          id: "prompting",
          heading: "Prompting: providing context",
          lesson: "m3-prompts",
          body: [
            "The quality of a chatbot's response depends heavily on the input it receives. That input is called a **prompt**. The model has extensive general knowledge, but no knowledge of your particular situation unless you provide it.",
            "A useful way to think about this is to treat the chatbot as a capable new colleague on their first day. They bring broad general knowledge, but they do not know you, your project or your preferences, and they can only work with what they are given. An effective prompt therefore states:",
            { list: [
              "**The task**, and its purpose",
              "**The audience**, and the appropriate tone",
              "**The length and format**, such as a list, an email or a table",
              "**The source material**, such as notes, a document or an example to follow"
            ] },
            "Compare “Write a thank-you note” with “Write a short, warm thank-you note to my neighbor Leilani, who watered my plants for two weeks while I was away. Keep it under 80 words and mention the tomatoes she saved.” The second prompt supplies everything the model could not have known.",
            "If the first response falls short, there is no need to start over. Explain what to change, as you would with a colleague: make it shorter, adjust the tone, or expand on a particular point."
          ],
          sources: ["anthropic-prompting"]
        },
        {
          id: "grounding",
          heading: "Grounding: connecting it to real sources",
          lesson: "m3-grounding",
          body: [
            "On its own, a chatbot generates responses only from patterns in its training data, without consulting any reference. **Grounding** connects the model to real, retrievable sources, so that its responses are based on actual documents rather than on statistical likelihood alone.",
            "The most widely used grounding method is **retrieval-augmented generation (RAG)**, which works in three steps:",
            { steps: [
              "**Retrieve.** The system searches a defined set of trusted sources, such as a website, a search engine or an organization's own files, for the passages most relevant to the question.",
              "**Augment.** The retrieved passages are added to the context window alongside the question.",
              "**Generate.** The model writes its response from the retrieved material. A well-designed tool also shows which sources it used."
            ] },
            "Grounding does not eliminate errors. A model can still misread a source or retrieve an irrelevant one. A grounded response, however, comes with sources you can check yourself, and an ungrounded one does not.",
            "Grounding also differs from fine-tuning, described in Module 2. Grounding supplies specific, current information at the moment of the question without changing the model. Fine-tuning changes the model itself, to adjust its abilities or its style."
          ],
          sources: ["lewis-2020"]
        },
        {
          id: "verification",
          heading: "Verifying the output",
          body: [
            { list: [
              "Treat all AI output as a first draft, not a finished product.",
              "Check factual claims yourself, especially names, dates, figures, quotations and citations.",
              "Where accuracy matters, use tools that cite their sources, and read those sources directly.",
              "When a response presents step-by-step reasoning, identify the step the conclusion depends on and verify that step yourself."
            ] }
          ],
          takeaway: "A chatbot cannot infer what only you know, so that context must be provided. Ground it in trustworthy sources whenever possible, and verify its output yourself."
        },
        {
          id: "hallucinations",
          heading: "Hallucinations: confident but false",
          lesson: "m3-hallucinations",
          body: [
            "Every limitation in this module follows from two points made in Module 2: the model predicts likely text rather than checking facts, and its knowledge is limited to its training data.",
            "A **hallucination** is output that appears factual, such as a claim, a name or a citation, but is false. Asked for a quotation from a book with a page number, a chatbot may cite a real book while inventing both the quotation and the page.",
            "Hallucination is not lying. Lying requires knowing the truth, and the model has no such knowledge. Having encountered a great many citations during training, it reproduces their form and fills it with the most probable content. Models are also generally rewarded during training for giving an answer rather than acknowledging uncertainty.",
            "As a result, chatbots tend to be most persuasive on exactly the details readers are most inclined to trust, such as names, dates, page numbers and quotations, and those are among the details most often wrong."
          ],
          sources: ["ji-2023", "kalai-2025"]
        },
        {
          id: "bias",
          heading: "Bias and missing cultural context",
          lesson: "m3-bias",
          body: [
            "Bias in a chatbot originates in its training data, which reflects the existing imbalances of the internet: whose voices, languages and histories are well represented, and whose are not. A model can reproduce those imbalances and even amplify them.",
            "The effects are greatest for communities whose knowledge is underrepresented online. A model trained mostly on English-language and Western sources may answer a question about Hawaiian cultural protocol with a generic outside interpretation, rather than deferring to community and Native sources.",
            "Research with educators in Hawaiʻi has documented models reproducing outside, colonial framings of Hawaiian history, such as a sanitized portrayal of Captain Cook. Kumu (teachers) in Kaiapuni (Hawaiian-language immersion) programs have also raised concerns about cultural misalignment and the reliability of AI-generated content. These biases are not opinions the model has formed. They reflect the material it was trained on.",
            "Before relying on a chatbot for information about any culture, community or place, consider who holds that knowledge, and consult them directly."
          ],
          sources: ["bender-2021", "zhao-2026", "mhasakar-2025"]
        },
        {
          id: "reasoning",
          heading: "Reasoning, and what it is not",
          lesson: "m3-reasoning",
          body: [
            "Some chatbots display step-by-step reasoning before giving an answer. This often improves accuracy on complex tasks, but it runs on the same next-token loop. Each step is the most plausible continuation of the text, and no step is checked independently.",
            "A chatbot can therefore produce an orderly, confident sequence of steps that arrives at a wrong conclusion, with every step presented as fact. The reasoning it displays may not even reflect what actually produced the answer.",
            "Displaying reasoning and verifying reasoning are two different things. Asking for step-by-step reasoning can make a response more persuasive without making it more reliable."
          ],
          sources: ["wei-2022", "turpin-2023"]
        },
        {
          id: "privacy",
          heading: "Privacy and data retention",
          body: [
            "Anything you enter into an AI tool is sent to the company that operates it. Depending on the product and your settings, the company may store conversations, have staff review them, or use them to train future versions of the model. This does not change the model you are using, but the information is no longer under your control.",
            "Take particular care with health and financial information, passwords, other people's personal information (including children's and students' records), and community or cultural knowledge that is not yours to share. Before entering anything sensitive, review the tool's privacy policy and settings. When in doubt, leave it out."
          ],
          sources: ["nist-2023"]
        },
        {
          id: "oversight",
          heading: "Human judgment and oversight",
          lesson: "m3-oversight",
          body: [
            "AI is a tool for drafting, exploring ideas and accelerating work. It cannot judge whether a draft is accurate, whose knowledge it contains, or how it will be received. Nor can it take responsibility for errors once they are published.",
            "Anything produced with AI should therefore be reviewed before release by a person with knowledge of the subject, who checks it and corrects it. This applies without exception, and most of all to public-facing material and to anything concerning culture or community. A useful test: if you would not put your name to it without reading it, it is not ready to send."
          ],
          takeaway: "Plausible output may still be false, so a person with subject knowledge should review anything produced with AI before it is released.",
          sources: ["nist-2023"]
        },
        {
          id: "practices",
          heading: "Recommended practices",
          body: [
            "The guidance from all three modules, summarized as practices. The right-hand column gives the reason for each one.",
            { table: {
              head: ["Practice", "Reason"],
              rows: [
                ["State the task, audience, length and tone, and supply the source material", "The model knows nothing about your situation unless you provide it"],
                ["Treat all output as a draft", "The model predicts likely text. No stage of that process checks facts"],
                ["Check names, dates, figures, quotations and citations", "These are the details on which models are most persuasive and most often wrong"],
                ["Where accuracy matters, use tools that cite sources, and read them", "Grounded answers can be verified independently"],
                ["Start a new conversation for each new topic, and restate what matters", "Earlier text can fall outside the context window"],
                ["Do not assume a correction will persist", "Models do not learn from individual conversations"],
                ["Consult knowledgeable people on culture, ʻōlelo Hawaiʻi or community matters", "These subjects are underrepresented in training data, and models cannot detect the gap"],
                ["Review the privacy policy before entering sensitive information", "The provider may retain what you enter"],
                ["Have someone with subject knowledge review anything before release", "Responsibility rests with people, not tools"]
              ]
            } }
          ]
        }
      ]
    }
  ],

  /* Sources cited in the modules, keyed by id. Format follows the white
     paper's APA list. `url` is what the citation links to. Each one was
     checked against its live page in October 2026 (Crossref, arXiv, NeurIPS
     proceedings, YouTube). Two differ from the paper on purpose: Anthropic's
     docs moved to platform.claude.com, and Ji et al. gives Crossref's page
     range because "Article 248" could not be confirmed. */
  sources: {
    "anthropic-prompting": { text: "Anthropic. (n.d.). Prompt engineering overview. Claude Platform Docs.", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview" },
    "bender-2021":  { text: "Bender, E. M., Gebru, T., McMillan-Major, A., & Shmitchell, S. (2021). On the dangers of stochastic parrots: Can language models be too big? In Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency (pp. 610–623). Association for Computing Machinery.", url: "https://doi.org/10.1145/3442188.3445922" },
    "cloudflare":   { text: "Cloudflare. (n.d.). AI inference vs. training: What is AI inference? Cloudflare Learning Center.", url: "https://www.cloudflare.com/learning/ai/inference-vs-training/" },
    "ibm-2025":     { text: "IBM. (2025, May 13). What is training data? IBM Think.", url: "https://www.ibm.com/think/topics/training-data" },
    "ji-2023":      { text: "Ji, Z., Lee, N., Frieske, R., Yu, T., Su, D., Xu, Y., Ishii, E., Bang, Y. J., Madotto, A., & Fung, P. (2023). Survey of hallucination in natural language generation. ACM Computing Surveys, 55(12), 1–38.", url: "https://doi.org/10.1145/3571730" },
    "kalai-2025":   { text: "Kalai, A. T., Nachum, O., Vempala, S. S., & Zhang, E. (2025). Why language models hallucinate (arXiv:2509.04664). arXiv.", url: "https://doi.org/10.48550/arXiv.2509.04664" },
    "learnthatstack-2025": { text: "LearnThatStack. (2025, December 27). How LLMs actually generate text (every dev should know this) [Video]. YouTube.", url: "https://www.youtube.com/watch?v=NKnZYvZA7w4" },
    "lewis-2020":   { text: "Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H., Lewis, M., Yih, W., Rocktäschel, T., Riedel, S., & Kiela, D. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. Advances in Neural Information Processing Systems, 33, 9459–9474.", url: "https://proceedings.neurips.cc/paper_files/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html" },
    "mhasakar-2025": { text: "Mhasakar, M., Baker-Ramos, R., Carter, B., Helekahi-Kaiwi, E.-B., & Hester, J. (2025). “I would never trust anything Western”: Kumu (educator) perspectives on use of LLMs for culturally revitalizing CS education in Hawaiian schools (arXiv:2501.17942). arXiv.", url: "https://doi.org/10.48550/arXiv.2501.17942" },
    "nist-2023":    { text: "National Institute of Standards and Technology. (2023). Artificial intelligence risk management framework (AI RMF 1.0) (NIST AI 100-1). U.S. Department of Commerce.", url: "https://doi.org/10.6028/NIST.AI.100-1" },
    "osi-2024":     { text: "Open Source Initiative. (2024). The open source AI definition 1.0.", url: "https://opensource.org/ai/open-source-ai-definition" },
    "ouyang-2022":  { text: "Ouyang, L., Wu, J., Jiang, X., Almeida, D., Wainwright, C., Mishkin, P., Zhang, C., Agarwal, S., Slama, K., Ray, A., Schulman, J., Hilton, J., Kelton, F., Miller, L., Simens, M., Askell, A., Welinder, P., Christiano, P. F., Leike, J., & Lowe, R. (2022). Training language models to follow instructions with human feedback. Advances in Neural Information Processing Systems, 35, 27730–27744.", url: "https://proceedings.neurips.cc/paper_files/paper/2022/hash/b1efde53be364a73914f58805a001731-Abstract-Conference.html" },
    "3b1b-2024":    { text: "3Blue1Brown. (2024, November 20). Large language models explained briefly [Video]. YouTube.", url: "https://www.youtube.com/watch?v=LPZh9BOjkQs" },
    "toloka-2026":  { text: "Toloka Team. (2026, March 3). Difference between AI, ML, LLM, and generative AI. Toloka.", url: "https://toloka.ai/blog/difference-between-ai-ml-llm-and-generative-ai/" },
    "turpin-2023":  { text: "Turpin, M., Michael, J., Perez, E., & Bowman, S. R. (2023). Language models don't always say what they think: Unfaithful explanations in chain-of-thought prompting. Advances in Neural Information Processing Systems, 36, 74952–74965.", url: "https://proceedings.neurips.cc/paper_files/paper/2023/hash/ed3fea9033a80fea1376299fa7863f4a-Abstract-Conference.html" },
    "wei-2022":     { text: "Wei, J., Wang, X., Schuurmans, D., Bosma, M., Ichter, B., Xia, F., Chi, E., Le, Q., & Zhou, D. (2022). Chain-of-thought prompting elicits reasoning in large language models (arXiv:2201.11903). arXiv.", url: "https://doi.org/10.48550/arXiv.2201.11903" },
    "zhao-2026":    { text: "Zhao, D., Cha, H., Ryan, M. J., Wang, A., Baker-Ramos, R., Helekahi-Kaiwi, E.-B., Diego, R., Hester, J., & Yang, D. (2026). Whose knowledge counts? Co-designing community-centered AI auditing tools with educators in Hawaiʻi (arXiv:2603.16646). arXiv.", url: "https://doi.org/10.48550/arXiv.2603.16646" }
  },

  /* ---------- 5. LESSONS ----------
     video:  ""                      -> friendly "video coming soon" placeholder
             "youtube:dQw4w9WgXcQ"   -> YouTube, no cookies loaded until clicked
             "vimeo:123456789"       -> Vimeo
             "file:assets/clip.mp4"  -> a video file committed to the repo
     slides: optional URL (Google Slides, Canva, a PDF in the repo, anything)
     deeper:  optional. An outside explainer on the same topic, longer and
             slower than ours. It renders as a fold under our player -
             "Go deeper: Outside explainer, 8:30" - which opens into a
             second player. Ours is the lesson; this is the long version
             behind it, and it is the staff edition's depth layer: the
             community edition deletes `deeper`, because "a mile wide and
             an inch deep" is that edition's brief and 3-to-27 minute
             outside videos are exactly the depth it is meant not to have.
             Nothing third-party loads until the fold is opened, and no
             iframe until the poster inside it is clicked. Every id was
             checked against live YouTube via oEmbed, not recalled.
     videoLength: the video's real runtime, read off the file with ffprobe
             rather than estimated. Nothing renders it today. It used to sit bottom-right
             of the thumbnail, but `duration` was what was being drawn there —
             self-paced time for the whole lesson, in the one corner every viewer
             reads as the video's length. Two different clocks, and they have not
             been reconciled since the stand-in videos landed: `duration` is
             documented as including video time, and those values predate all 19
             videos. `duration` is not read by `app.js` at all today — the module
             cards compute minutes from word count. Fix the clocks, then decide
             what the card shows.
  --------------------------------------------------------------- */
  /* RESTORED 27 Oct 2026, lifted whole from 53abaf9. Sam's module-article
     rebuild (26fbde8) dropped this block, and the deployed staff build still
     had it, so pushing main would have silently deleted `?for=partners` from
     a live site people hold links to. Putting it back is what made deploying
     main safe.

     It works on the rebuilt page: the switcher bar renders, and `tagline`,
     `time` and `location` swap per audience. Two fields no longer land
     anywhere — `badge` and `intro` lost their markup in the rebuild, and
     `facts`, `pathways` and `agenda` point at sections the rebuild retired.
     They are left in rather than pruned: they are the record of what each
     audience is for, and deleting them would make restoring any of that
     markup a rewrite instead of a re-bind. The switcher still does its job,
     it just changes less of the page than it used to.

     `workshop` and `kupuna` stay `draft: true`, so the bar shows two buttons,
     not four — same as the live build. Cultural review before either ships. */
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
  lessons: [

    /* ===== MODULE 1 — OVERVIEW ===== */
    {
      id: "m1-map",
      title: "AI, ML, NLP, generative AI, LLMs",
      track: "overview",
      level: "Module 1",
      duration: "20 min",
      summary: "Five words people use interchangeably that are not interchangeable. They nest inside each other.",
      video: "file:assets/video/ai-isnt-one-thing.mp4",
      videoLength: "1:20",
      slides: "",
      deeper: { url: "https://www.youtube.com/watch?v=oi0JXuL19TA", length: "13:29" },
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
      video: "file:assets/video/youve-been-using-it-for-years.mp4",
      videoLength: "1:23",
      /* Shot 9:16 for social and exported onto a 16:9 canvas, so the file
         carries black bars our other films do not. `videoAspect` tells the
         player to show it portrait, which crops those bars back off. */
      videoAspect: "9/16",
      deeper: { url: "https://www.youtube.com/watch?v=oJC8VIDSx_Q", length: "3:23" },
      takeaways: [
        "NLP: live captions and transcription, translation tools, grammar and spell-check, voice-to-text.",
        "Generative AI: image generators, AI-made graphics, first-draft writing.",
        "LLMs: drafting and editing emails, summarizing long documents, meeting summaries, quick how-to help.",
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
      video: "file:assets/video/how-text-is-generated.mp4",
      videoLength: "1:45",
      deeper: { url: "https://www.youtube.com/watch?v=NKnZYvZA7w4", length: "9:24" },
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
      video: "file:assets/video/what-it-learned-from.mp4",
      videoLength: "1:04",
      videoAspect: "9/16",
      deeper: { url: "https://www.youtube.com/watch?v=-4Oso9-9KTQ", length: "27:39" },
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
      video: "file:assets/video/where-the-odds-come-from.mp4",
      videoLength: "1:31",
      videoAspect: "9/16",
      deeper: { url: "https://www.youtube.com/watch?v=LPZh9BOjkQs", length: "7:58" },
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
      video: "file:assets/video/is-it-learning-from-me.mp4",
      videoLength: "1:30",
      deeper: { url: "https://www.youtube.com/watch?v=XtT5i0ZeHHE", length: "10:41" },
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
      video: "file:assets/video/it-reads-in-pieces.mp4",
      videoLength: "1:48",
      deeper: { url: "https://www.youtube.com/watch?v=-0HRzXk8vlk", length: "25:22" },
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
      video: "file:assets/video/where-words-live.mp4",
      videoLength: "2:05",
      deeper: { url: "https://www.youtube.com/watch?v=viZrOnJclY0", length: "16:11" },
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
      video: "file:assets/video/which-words-matter.mp4",
      videoLength: "2:52",
      deeper: { url: "https://www.youtube.com/watch?v=wjZofJX0v4M", length: "27:14" },
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
      video: "file:assets/video/autocomplete-trick.mp4",
      videoLength: "1:35",
      deeper: { url: "https://www.youtube.com/watch?v=5sLYAQS9sWQ", length: "5:33" },
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
      video: "file:assets/video/ask-it-twice.mp4",
      videoLength: "1:41",
      videoAspect: "9/16",
      deeper: { url: "https://www.youtube.com/watch?v=MkaazQttbpc", length: "14:51" },
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
      video: "file:assets/video/why-it-forgets.mp4",
      videoLength: "1:21",
      deeper: { url: "https://www.youtube.com/watch?v=-QVoIxEpFkM", length: "11:30" },
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
      summary: "The most immediately useful thing in the whole course. Treat it like a capable new coworker.",
      video: "file:assets/video/like-a-new-hire.mp4",
      videoLength: "1:30",
      deeper: { url: "https://www.youtube.com/watch?v=jC4v5AS4RIM", length: "8:30" },
      takeaways: [
        "It has vast general knowledge and knows nothing about your specific situation. Be explicit about audience, format and tone.",
        "Hand it the source material. Do not expect it to already know your project, your people or your numbers.",
        "Weak: \"Write a thank-you note.\" Strong: \"Write a short, warm thank-you note to my neighbor Leilani, who watered my plants for two weeks. Under 80 words, and mention the tomatoes she saved.\""
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
      video: "file:assets/video/fake-citation.mp4",
      videoLength: "1:39",
      deeper: { url: "https://www.youtube.com/watch?v=005JLRt3gXI", length: "5:13" },
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
      video: "file:assets/video/show-me-the-receipts.mp4",
      videoLength: "2:02",
      deeper: { url: "https://www.youtube.com/watch?v=T-D1OfcDW1M", length: "6:35" },
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
      video: "file:assets/video/the-uneven-library.mp4",
      videoLength: "1:13",
      deeper: { url: "https://www.youtube.com/watch?v=gV0_raKR2UQ", length: "11:20" },
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
      video: "file:assets/video/it-showed-its-work.mp4",
      videoLength: "1:32",
      deeper: { url: "https://www.youtube.com/watch?v=enLbj0igyx4", length: "8:37" },
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
      summary: "The clearest, most actionable takeaway of the whole course.",
      video: "file:assets/video/who-signs-it.mp4",
      videoLength: "1:27",
      deeper: { url: "https://www.youtube.com/watch?v=9iS-YYLIXiw", length: "10:44" },
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
      video: "file:assets/video/which-one-said-it.mp4",
      videoLength: "2:35",
      deeper: { url: "https://www.youtube.com/watch?v=KrV6ldHymwQ", length: "7:15" },
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

     Two other kinds go in the same lists:
       type: "truefalse"  q is a statement; answer is true or false. Best for
                          a misconception worth knocking down.
       type: "order"      steps: [...] written in the right order; the page
                          shuffles them. Only for things that are a sequence.
     Definitions are not asked here: each module's Term match board (under
     PRACTICE ACTIVITIES) covers them, and asking both was asking twice.

     Write the correct option first if that is easiest. The page shuffles the
     options on every render and remaps `answer` to follow, so the answer is
     never reliably in the same place. Add `fixed: true` to a question whose
     options only make sense in the order given.
  --------------------------------------------------------------- */
  quizzes: {
    /* ===== Module 1 — What is AI? ===== */
    "m1-map": [
      {
        type: "order",
        q: "These terms fit inside one another. Put them in order, from the broadest to the most specific.",
        steps: ["Artificial intelligence", "Machine learning", "Generative AI", "Large language model"],
        why: "AI is the broadest category. Machine learning is one way of building AI, generative AI is machine learning that creates new content, and LLMs are the generative AI behind chatbots. Natural language processing overlaps the last two: an LLM is language work too."
      },
      {
        type: "truefalse",
        q: "Every AI system learns from data.",
        answer: false,
        why: "Machine learning is one way of building AI, not the only one. Some systems follow rules written out by a person. What makes machine learning different is that it learns its patterns from examples."
      }
    ],

    "m1-daily": [
      {
        type: "truefalse",
        q: "When your phone types out a text message you dictate, it is using a large language model.",
        answer: false,
        why: "Voice-to-text is natural language processing: machine learning applied to language. It does not need a large language model, and phones were doing it long before chatbots."
      }
    ],

    /* ===== Module 2 — How AI chatbots work ===== */
    "m2-pretraining-inference": [
      {
        type: "truefalse",
        q: "Once you correct a chatbot's mistake, the model has learned from it and will not make that mistake again for anyone.",
        answer: false,
        why: "Learning ends when training ends. The correction helps for the rest of your conversation, but the model itself has not changed. Some products save conversations or offer memory features; that is a product feature, not the model retraining itself."
      }
    ],

    "m2-training-data": [
      {
        q: "Why is a model weaker on ʻōlelo Hawaiʻi than on English?",
        options: [
          "There is far less ʻōlelo Hawaiʻi in its training data",
          "Hawaiian grammar is too irregular for a model to learn",
          "The companies deliberately excluded it"
        ],
        answer: 0,
        why: "Subjects that are underrepresented in training data are subjects the model performs poorly on. No one designed the gap; it follows from what the model read."
      },
      {
        q: "When a model has very little training data on a subject, how does it usually respond to questions about it?",
        options: [
          "With the same confidence it brings to any other question",
          "By telling you it does not know enough",
          "By refusing to answer"
        ],
        answer: 0,
        why: "The model has no way of detecting gaps in its training data, so it answers with the same confidence either way. That is what makes those gaps risky."
      }
    ],

    "m2-parameters": [
      {
        q: "In the water-channel comparison, where is the model's learning stored?",
        options: [
          "In the overall pattern of all its parameters, not in any single one",
          "In one parameter for each fact it knows",
          "In a separate database of facts"
        ],
        answer: 0,
        why: "Just as a landscape's shape guides water without any single groove holding the route, a model's knowledge lies in the whole pattern of its parameters."
      },
      {
        q: "What do more parameters generally mean?",
        options: ["Greater capability, though not always", "A model that is always better", "A larger context window"],
        answer: 0,
        why: "Size tends to go with capability but does not guarantee it. It is also separate from the context window, which is how much text the model can consider at once."
      }
    ],

    "m2-loop": [
      {
        q: "How many times does the generation loop run to produce a response several paragraphs long?",
        options: ["Once per token, so hundreds of times", "Once for the whole response", "Once per sentence"],
        answer: 0,
        why: "Tokenization, embeddings, attention, probabilities, sampling, then back to the start. Every token you see is another pass through the loop."
      },
      {
        type: "order",
        q: "Put the five steps of the generation loop in order.",
        steps: [
          "Tokenization: the text is split into numbered tokens",
          "Embeddings: each token becomes a list of numbers in a meaning space",
          "Attention: each token weighs which others matter to it",
          "Probabilities: every possible next token gets a score",
          "Sampling: one token is picked, added, and the loop goes again"
        ],
        why: "Text in, numbers, context, probabilities, one pick. Then the new token joins the text and the whole loop runs again, once for every token in the answer."
      },
      {
        type: "truefalse",
        q: "One step of the generation loop looks up facts to check the answer.",
        answer: false,
        why: "The loop is prediction, not lookup. Some tools add search or document retrieval on top of the model (grounding, in Module 3), but that is an addition, not part of the loop."
      }
    ],

    "m2-tokenization": [
      {
        q: "Why do chatbots often struggle to count the letters in a word?",
        options: [
          "They process tokens, not individual letters",
          "They are not able to do arithmetic",
          "Counting is blocked for safety reasons"
        ],
        answer: 0,
        why: "The model sees numbered chunks of text. The individual letters inside a token are not what it is working with."
      }
    ],

    "m2-embeddings": [
      {
        q: "In that meaning space, what does it mean when two words sit close together?",
        options: ["They are used in similar contexts", "They are spelled similarly", "They appear equally often"],
        answer: 0,
        why: "Distance reflects similarity of use, not spelling or frequency."
      }
    ],

    "m2-transformers": [
      {
        q: "“Python” can be a programming language or a snake. How does the model tell which one a sentence means?",
        options: [
          "Attention: it weighs the words nearby, such as “import” or “reptile”, to pull the token toward one sense",
          "It looks the word up in a dictionary of meanings",
          "It can't: both sentences mean the same thing to it"
        ],
        answer: 0,
        why: "Attention is the core of the transformer design. Weighing the surrounding words is how the same word can carry different meanings in different sentences."
      }
    ],

    "m2-next-token": [
      {
        q: "Why does a chatbot sound just as confident when it is wrong?",
        options: [
          "Its confidence reflects how likely its words are, not whether they are true",
          "It only answers when it has checked a source",
          "Its confidence is a reliable sign that it is right"
        ],
        answer: 0,
        why: "Nothing in the loop checks facts. A fluent, confident sentence and a true sentence are produced the same way."
      }
    ],

    "m2-sampling": [
      {
        q: "You ask the same question twice and get two different answers. Why?",
        options: [
          "The model is probabilistic: it selects from weighted options rather than always taking the top one",
          "The model was updated between your two questions",
          "Something is broken and should be reported"
        ],
        answer: 0,
        why: "A calculator is deterministic: the same input always gives the same output. A chatbot is probabilistic, so variation is expected behavior."
      }
    ],

    "m2-context-window": [
      {
        q: "Late in a long conversation, a chatbot seems to have forgotten something you said at the start. What is the most likely reason?",
        options: [
          "The earlier messages fell outside its context window, or were summarized or given less weight",
          "The model deliberately discards old topics",
          "The model's memory wears out the longer it runs"
        ],
        answer: 0,
        why: "Your messages, the conversation history and any documents all share the context window. As a conversation grows, earlier material may be dropped, summarized or given less weight."
      },
      {
        q: "Given how context windows work, which habit is most useful?",
        options: [
          "Start a new conversation for each new topic, and restate anything essential",
          "Keep every topic in one long conversation so the model remembers more",
          "Paste in the longest documents you have"
        ],
        answer: 0,
        why: "A shorter, focused conversation keeps what matters inside the window. Many tools do not tell you when only part of a long document was processed."
      }
    ],

    /* `m3-model-families` plays in Module 2 ("Model families, open weights and
       agents"), so its questions join Module 2's quiz. The RLHF question covers
       "How chatbots are built and refined", which has no video of its own. */
    "m3-model-families": [
      {
        type: "truefalse",
        q: "An “open weights” model has published everything about itself, including all of its training data.",
        answer: false,
        why: "Open weights means the trained parameters are published, so others can run and adapt the model. Publishing the code and training data as well would make it fully open source. Open weights is a narrower step."
      },
      {
        q: "What is RLHF mainly responsible for?",
        options: [
          "Much of a chatbot's careful manner, and some of its values and blind spots",
          "Teaching the model to predict the next token in the first place",
          "Connecting the model to search results"
        ],
        answer: 0,
        why: "In reinforcement learning from human feedback, people rate responses and the model is trained to favor the higher-rated kind. What it learns depends on who did the rating and what they were asked to reward."
      },
      {
        q: "Why do the stakes rise when an AI is set up as an agent?",
        options: [
          "It takes actions, not just drafts text, while running on the same next-token loop",
          "Agents use a different technology that makes more mistakes",
          "Agents learn from every action they take"
        ],
        answer: 0,
        why: "An agent has every limitation of a chatbot, but its output is an action rather than a draft for a person to review."
      }
    ],

    /* ===== Module 3 — Using AI well ===== */
    "m3-prompts": [
      {
        q: "Which is the stronger prompt?",
        options: [
          "“Write a 100-word bio of me for our neighborhood newsletter. I am a retired nurse who now coaches youth soccer. Keep it warm and informal; my notes are below.”",
          "“Write a bio for me.”",
          "They produce the same result, because the model knows who you are"
        ],
        answer: 0,
        why: "The model has broad general knowledge but no knowledge of your situation. The audience, length, tone and source material all have to come from you."
      },
      {
        q: "The first response is close, but too long and too formal. What is the best next step?",
        options: [
          "Explain what to change, as you would with a colleague",
          "Start a new conversation with the same prompt",
          "Accept it, because the model has done its best"
        ],
        answer: 0,
        why: "There is no need to start over. Specific follow-up instructions, such as “shorter and warmer”, are usually the quickest way to the result you want."
      }
    ],

    "m3-grounding": [
      {
        q: "Which parts of an AI-generated draft deserve the closest checking?",
        options: ["Names, dates, figures, quotations and citations", "Grammar and spelling", "Length and formatting"],
        answer: 0,
        why: "These are the details on which models are most persuasive and most often wrong. Where accuracy matters, use a tool that cites its sources, and read them."
      }
    ],

    "m3-hallucinations": [
      {
        q: "A chatbot gives you an exact page number for a quotation. What should you do?",
        options: [
          "Check it against the source, because specific-sounding citations are often invented",
          "Trust it, because that level of detail means it looked it up",
          "Ask again, and trust it if the answer matches"
        ],
        answer: 0,
        why: "Asking twice does not help: the model can produce the same plausible invention twice. Only the actual source can confirm it."
      },
      {
        q: "Why is a hallucination not the same as lying?",
        options: [
          "Lying requires knowing the truth, and the model has no such knowledge",
          "The model is trying to be helpful",
          "Hallucinations are too rare to count as lies"
        ],
        answer: 0,
        why: "The model reproduces the form of a fact or citation and fills it with the most probable content. It has no way of knowing whether that content is true."
      }
    ],

    "m3-bias": [
      {
        q: "Where does bias in a chatbot mainly come from?",
        options: [
          "Its training data: whose voices, languages and histories are well represented, and whose are not",
          "The personal opinions of the engineers who built it",
          "The way you word your question"
        ],
        answer: 0,
        why: "This is the training-data point from Module 2, seen in practice. A model can reproduce existing imbalances and even amplify them."
      },
      {
        q: "You ask about Hawaiian cultural protocol and receive a fluent, confident answer. What is the risk?",
        options: [
          "It may be a generic outside interpretation, where it should have deferred to community and Native sources",
          "There is none, because fluency means it found good sources",
          "There is none, because the model will refuse questions it cannot answer"
        ],
        answer: 0,
        why: "The failure is not silence but confidence. Community and Native sources hold the authority here, and the model has no way to know it should defer to them."
      }
    ],

    "m3-reasoning": [
      {
        type: "truefalse",
        q: "When a chatbot shows its reasoning step by step, each step has been checked, so the answer can be trusted.",
        answer: false,
        why: "Each step is generated text too, and no step is checked independently. An orderly, confident sequence of steps can still reach a wrong conclusion: displaying reasoning and verifying it are two different things."
      }
    ],

    "m3-oversight": [
      {
        q: "AI drafts a social media post about a cultural practice. What should happen next?",
        options: [
          "Someone with knowledge of the subject reviews and corrects it before it is posted",
          "Post it after a second AI tool has checked it",
          "Post it if it reads well and no one objects"
        ],
        answer: 0,
        why: "AI can draft, but it cannot take responsibility. A person with subject knowledge reviews anything produced with AI before release, especially anything concerning culture or community."
      }
    ]
  },

  /* ---------- 7. PRACTICE ACTIVITIES ----------
     `type` picks the engine, so a new kind of activity
     needs an engine in assets/app.js too.

     Where each one appears on a module page:
       group: "quiz"   its questions join that module's practice (module = a
                       track id, or "all" for the last module). In a module
                       with `checks`, the check whose `practice` lists its id.
                       Works for `scenarios`, `match` and `sort`.
       group: "demo"   it sits inside the section named by `section` (a
                       section or part id from `modules`), under the text.
       tokens     live token-chopping sandbox (no data needed)
       predict    next-token dice roll with a temperature slider; needs `rounds`
       match      a board: tap a term, then its meaning. `terms` names the
                  glossary entries to use (pick ones no lesson question
                  already asks), `rounds` how many go on one board.
       sort       examples filed into buckets, one at a time: `prompt`,
                  `buckets` (labels), `cards` ({ text, bucket, why })
       scenarios  judgment calls; same shape as the quizzes above
  --------------------------------------------------------------- */
  practice: [
    {
      id: "which",
      module: "overview",
      group: "quiz",
      type: "sort",
      title: "Which one is it?",
      tag: "Module 1 · AI, ML, NLP, generative AI, LLMs",
      blurb: "Everyday examples, sorted by the most specific label that fits.",
      prompt: "File each everyday example under the most specific label that fits.",
      note: "Because the terms fit inside one another, more than one label is often technically true. The question is always which circle is the most specific fit.",
      buckets: [
        "Machine learning, not language",
        "Natural language processing",
        "Generative AI, not language",
        "Large language model"
      ],
      cards: [
        { text: "Your photo app groups every picture of the same person.", bucket: 0,
          why: "It learned to recognize faces from examples, so it is machine learning. It works with images, not language." },
        { text: "A streaming service recommends a show from what you watched last week.", bucket: 0,
          why: "Recommendations come from patterns learned from viewing data. Nothing new is generated, and no language is processed." },
        { text: "Live captions appear under a speaker on a video call.", bucket: 1,
          why: "Turning speech into text is language work. Nothing new is created; the captions transcribe what was said." },
        { text: "Your phone corrects “teh” to “the” as you type.", bucket: 1,
          why: "Spell-check is natural language processing, and it does not involve a large language model. It long predates chatbots." },
        { text: "A translation app turns a menu into English.", bucket: 1,
          why: "Translation is machine learning applied to language. Most people have used NLP like this for years without calling it AI." },
        { text: "You describe a picture to a design app and it draws it.", bucket: 2,
          why: "It creates something new, so it is generative AI. The output is an image, not text, so it is not a large language model." },
        { text: "Claude drafts an email to your landlord from your notes.", bucket: 3,
          why: "The innermost circle: a large language model, which also makes it generative AI, NLP and machine learning. “LLM” is the most specific label." }
      ]
    },
    {
      id: "tokens",
      section: "tokenization",
      module: "how-it-works",
      group: "demo",
      type: "tokens",
      title: "Token chopper",
      tag: "Module 2 · Tokenization",
      blurb: "Type any text to see the tokens a model would divide it into. Try an English sentence, then a sentence of similar length in ʻōlelo Hawaiʻi, and compare the characters per token. The difference reflects what the model read, not the length of the words.",
      sample: "Aloha kākou! The honu swam toward the ocean, indistinguishable from the reef.",
      note: "A tokenizer's vocabulary is built from its training data, so a word that appeared constantly gets one token and a word the data barely contains has no entry and shatters. ʻOkina and kahakō are several bytes each and rare in an English-heavy corpus, so they tend to come apart on their own. That is the same fact the bias lesson rests on, visible here. Approximate: a real vocabulary holds about 100,000 entries, this one holds a few hundred.",
      link: { label: "The real thing: Tiktokenizer", url: "https://tiktokenizer.vercel.app/" }
    },
    {
      id: "dice",
      section: "sampling",
      module: "how-it-works",
      group: "demo",
      type: "predict",
      title: "Roll the dice",
      tag: "Module 2 · Prediction & sampling",
      blurb: "Choose the word you think comes next, then let the model sample one. Adjust the temperature and sample again to see how the same probabilities are reshaped.",
      note: "The percentages are illustrative. A real model assigns a probability to every token in its vocabulary, not just five.",
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
    /* Term match, once per module. Each draws its definitions and its wrong
       answers only from glossary entries whose `module` is the same track id,
       so every question covers something that module taught. */
    {
      id: "match-1",
      module: "overview",
      group: "quiz",
      type: "match",
      title: "Term match",
      tag: "Module 1 · Key terms",
      blurb: "Match each term to what it means.",
      terms: ["Artificial intelligence (AI)", "Machine learning (ML)", "Natural language processing (NLP)", "Generative AI", "Large language model (LLM)"],
      rounds: 5
    },
    {
      id: "match-2a",
      module: "how-it-works",
      group: "quiz",
      type: "match",
      title: "Term match",
      tag: "Module 2 · How it learns",
      blurb: "Match each term to what it means.",
      terms: ["Training data", "Parameters", "Pre-training", "Inference"],
      rounds: 4
    },
    {
      id: "match-2b",
      module: "how-it-works",
      group: "quiz",
      type: "match",
      title: "Term match",
      tag: "Module 2 · The generation loop",
      blurb: "Match each term to what it means.",
      terms: ["Token", "Embedding", "Attention", "Next-token prediction"],
      rounds: 4
    },
    {
      id: "match-2c",
      module: "how-it-works",
      group: "quiz",
      type: "match",
      title: "Term match",
      tag: "Module 2 · Variation and how chatbots are built",
      blurb: "Match each term to what it means.",
      terms: ["Temperature", "Context window", "Base model", "Fine-tuning", "Model family"],
      rounds: 5
    },
    {
      id: "match-3a",
      module: "using-llms",
      group: "quiz",
      type: "match",
      title: "Term match",
      tag: "Module 3 · Prompting and checking",
      blurb: "Match each term to what it means.",
      terms: ["Prompt", "Grounding", "Retrieval-augmented generation (RAG)", "Hallucination"],
      rounds: 4
    },
    {
      id: "match-3b",
      module: "using-llms",
      group: "quiz",
      type: "match",
      title: "Term match",
      tag: "Module 3 · Judgment",
      blurb: "Match each term to what it means.",
      terms: ["Bias", "Data retention", "Human oversight"],
      rounds: 3
    },
    {
      id: "cite",
      section: "hallucinations",
      module: "using-llms",
      group: "demo",
      type: "cite",
      title: "Spot the real one",
      tag: "Module 3 · Hallucinations",
      blurb: "Four references in the same field and the same format. One is a real paper; the other three were assembled a moment ago from plausible parts. Try to identify the real one.",
      note: "The real papers are among those cited in this course, and the reveal links directly to each. The three fakes are stamped once revealed and are generated fresh every round, so the answer is never in the same place. Nothing here was looked up — which is exactly what a model does when it invents a citation.",
      /* Real papers. Keep these EXACT — they are the control in the experiment,
         and the reveal links to them so anyone can check. */
      real: [
        {
          authors: "Bender, E. M., Gebru, T., McMillan-Major, A. & Shmitchell, S.",
          year: 2021,
          title: "On the dangers of stochastic parrots: can language models be too big?",
          venue: "Proceedings of FAccT '21",
          pages: "610–623",
          url: "https://dl.acm.org/doi/10.1145/3442188.3445922"
        },
        {
          authors: "Lewis, P., Perez, E., Piktus, A. et al.",
          year: 2020,
          title: "Retrieval-augmented generation for knowledge-intensive NLP tasks",
          venue: "Advances in Neural Information Processing Systems 33",
          pages: "9459–9474",
          url: "https://arxiv.org/abs/2005.11401"
        },
        {
          authors: "Wei, J., Wang, X., Schuurmans, D. et al.",
          year: 2022,
          title: "Chain-of-thought prompting elicits reasoning in large language models",
          venue: "Advances in Neural Information Processing Systems 35",
          pages: "24824–24837",
          url: "https://arxiv.org/abs/2201.11903"
        },
        {
          authors: "Ji, Z., Lee, N., Frieske, R. et al.",
          year: 2023,
          title: "Survey of hallucination in natural language generation",
          venue: "ACM Computing Surveys 55(12)",
          pages: "1–38",
          url: "https://arxiv.org/abs/2202.03629"
        }
      ],
      /* Parts the fakes get assembled from. Generic surnames on purpose — the
         widget attributes invented work to whoever it picks, so no real
         researchers go in this list. */
      fake: {
        authors: ["Almeida", "Brennan", "Castellanos", "Duarte", "Ellery", "Fontaine",
                  "Grierson", "Halloran", "Iversen", "Jarrah", "Kowalski", "Lindqvist",
                  "Moreau", "Nakagawa", "Oyelaran", "Pahlavi", "Quint", "Rasmussen"],
        titles: [
          "Measuring factual drift in instruction-tuned language models",
          "Confidence calibration under distribution shift in generative text",
          "Source attribution failures in retrieval-augmented systems",
          "On the limits of self-verification in autoregressive models",
          "Quantifying fabricated references in machine-generated prose",
          "Prompt sensitivity and answer stability across model families",
          "Low-resource language degradation in subword tokenization",
          "Human oversight thresholds for generative drafting workflows"
        ],
        venues: [
          "Transactions of the Association for Computational Linguistics",
          "Proceedings of EMNLP",
          "Journal of Artificial Intelligence Research",
          "Proceedings of ACL",
          "Computational Linguistics",
          "Proceedings of NAACL"
        ]
      }
    },
    {
      id: "corpus",
      section: "bias",
      module: "using-llms",
      group: "demo",
      type: "corpus",
      title: "How much did it read?",
      tag: "Module 2 · Training data → Module 3 · Bias",
      blurb: "Choose a question. The top bar shows roughly how much relevant material the model read during training. The bottom bar shows how confident its answer sounds. Work down the list and notice what happens to the gap between them.",
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
    },
    {
      id: "judge",
      module: "using-llms",
      group: "quiz",
      type: "scenarios",
      title: "Would you send it?",
      tag: "Module 3 · Using AI well",
      blurb: "Six realistic situations of the kind that arise once you use these tools for real work. Each has a defensible answer, and the reasoning matters more than the score.",
      items: [
        {
          q: "A chatbot drafts your monthly update for work. The figures match the ones you pasted in. What should you do?",
          options: ["Read it, adjust the tone, then send it", "Send it as written, since the figures are correct", "Never use AI for work updates"],
          answer: 0,
          why: "This is close to ideal use: you supplied the facts, the model drafted, and a person reviews it before it goes out."
        },
        {
          q: "You ask about the protocol for a specific Hawaiian cultural practice. The answer is detailed and confident.",
          options: [
            "Do not rely on it; take the question to people who hold that ʻike (knowledge)",
            "Use it as a first draft and fact-check it lightly",
            "Use it, since the level of detail suggests it found real sources"
          ],
          answer: 0,
          why: "The subject is underrepresented in training data and was answered with full confidence anyway. Cultural authority rests with community and Native sources, not with a model, and a light fact-check is not an adequate safeguard here."
        },
        {
          q: "It cites a 2019 study, with an author, a journal and a page number, to support a point you are making.",
          options: ["Find the study before using the claim", "Cite it, since that detail is too specific to be invented", "Drop the claim entirely"],
          answer: 0,
          why: "Invented citations look exactly like this: specific, well formatted and plausible. The study may well be real, but you will not know until you check, and anything with your name on it is the wrong place to find out."
        },
        {
          q: "You ask a chatbot to turn meeting notes into action items. Some tasks in the notes have no owner named. What is the best approach?",
          options: [
            "Tell it to mark those items “unassigned” rather than guess a name",
            "Let it assign the most likely person",
            "Accept whatever names it adds, since it read the notes"
          ],
          answer: 0,
          why: "Left to itself, the model may fill the gap with a plausible name, which is a small hallucination. Asking it to mark gaps explicitly turns an invisible guess into a visible question you can resolve."
        },
        {
          q: "Asked to explain your child's school test results, it produces a step-by-step chain of reasoning that ends in a recommendation.",
          options: [
            "Treat the steps as a draft argument and check each one yourself",
            "Follow the recommendation, since the reasoning is shown",
            "Ask it to check its own reasoning, then follow it"
          ],
          answer: 0,
          why: "Displayed reasoning is generated text like everything else, and asking the model to review its own work generates more of the same. An orderly chain can still reach the wrong conclusion, and this decision concerns a real person."
        },
        {
          q: "You want help writing a message about a friend's medical condition, and you are about to paste in their full name and diagnosis.",
          options: [
            "Leave out identifying details, or check the tool's privacy policy and settings first",
            "Paste it in, since the model does not learn from conversations",
            "Paste it in, since only the model will see it"
          ],
          answer: 0,
          why: "The model does not learn from your conversation, but the company may store it, have staff review it, or use it for future training. Health information about someone else is exactly the kind of detail to leave out when in doubt."
        }
      ]
    }
  ],

  /* ---------- 8. RUN OF SHOW ----------
     Times are minutes from the start of the session, not clock times.

     `agendaHidden` takes the whole section off the page without deleting a
     word of it. The nav link, the hero's second button and the search
     entries all follow the flag, so nothing is left pointing at a section
     that is not on the page.

     Everything below, and the three per-audience versions in section 3,
     stay exactly as written. The session these were built for has run, and a
     run of show is no use to somebody reading afterwards, but it is the
     first thing you want back when the next one is booked. Set this to
     false and the section returns, timings intact.

     While it is hidden the hero's second button needs somewhere else to
     go, which is what `ctaSecondaryAlt` is for. */
  agendaHidden: true,
  ctaSecondaryAlt: { label: "Play first with the hands-on activities", href: "#practice" },

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
      title: "The capable new coworker",
      use: "A general-purpose structure for any task that matters: the audience, the task, the background and the format.",
      text: "You are helping me write for [audience].\n\nTask: [what you want done]\n\nBackground you could not guess: [who is involved, what happened, numbers, anything specific to me]\n\nFormat: [length, structure, tone]\n\nAvoid: [what would make this useless]\n\n[paste your source material]"
    },
    {
      title: "A short bio",
      use: "Note how much context it provides, and the instruction that prevents it from inventing details.",
      text: "Write a 100-word bio of [name] for [where it will appear: a newsletter, a program, a website]. Tone: [warm, formal, playful]. Use only the notes below — do not add accomplishments that are not there.\n\n[paste notes]"
    },
    {
      title: "Explain it simply",
      use: "For learning about a new subject, with a built-in reminder to verify.",
      text: "Explain [topic] to me as someone new to it. Use one everyday example and keep it under 200 words.\n\nThen list the specific facts in your answer that I should double-check with a reliable source before I repeat them."
    },
    {
      title: "Source-checked answer",
      use: "Makes any guessing visible. A practical safeguard against hallucination.",
      text: "Answer using only the document below. Before each claim, quote the exact sentence it came from.\n\nIf the document does not answer the question, say \"Not in the document\" and stop. Do not fill the gap from general knowledge.\n\n[paste document]"
    },
    {
      title: "Meeting notes to actions",
      use: "One of the most consistently useful tasks for a chatbot.",
      text: "Turn these notes into: (1) decisions made, (2) open questions, (3) action items with an owner and a due date where one was stated.\n\nIf an owner or date was never mentioned, write UNASSIGNED. Do not invent either one.\n\n[paste notes]"
    },
    {
      title: "Honest critique",
      use: "For when you need candid criticism rather than praise.",
      text: "Here is my draft. Do not tell me what works.\n\nGive me the three strongest objections a skeptical [audience] would raise, ranked by how much damage each one does. For each, say what would have to be true for the objection to be wrong.\n\n[paste your work]"
    },
    {
      title: "Check me before I present",
      use: "Before presenting on a subject you are still learning.",
      text: "I am going to explain [topic] to [audience]. Here is my explanation in my own words.\n\nTell me: what is wrong, what is oversimplified in a misleading way, and what a knowledgeable person in the room would push back on. Flag anything I should not say with confidence.\n\n[paste your explanation]"
    }
  ],

  /* ---------- 10. GLOSSARY ---------- */
  /* `module` is the track id of the module that teaches the term. Each
     module's Term match only asks about its own terms (and needs at least
     four). A term with no `module` appears in the glossary but is never
     quizzed: use that for terms no module explains. */
  glossary: [
    { module: "overview", term: "Artificial intelligence (AI)", def: "The broad term for computer systems performing tasks that typically require human intelligence. It names a family of technologies, not a single one." },
    { module: "overview", term: "Machine learning (ML)", def: "A way of building AI in which systems learn patterns from data instead of following rules written out by a person." },
    { module: "overview", term: "Natural language processing (NLP)", def: "Machine learning applied to language, so that computers can read, interpret and produce human speech and text." },
    { module: "overview", term: "Generative AI", def: "AI that creates new content, such as text, images, audio or video, rather than only sorting or predicting." },
    { module: "overview", term: "Large language model (LLM)", def: "The technology behind AI chatbots. ChatGPT, Claude and Gemini are products built on LLMs." },

    { module: "how-it-works", term: "Training data", def: "The websites, books, articles and code a model reads while it learns. The source of both its knowledge and its gaps." },
    { module: "how-it-works", term: "Parameters", def: "The model's internal settings, adjusted during training, that determine how it weighs and combines information to predict the next word." },
    { module: "how-it-works", term: "Pre-training", def: "The first stage of training, which happens once for each model version. The model reads enormous amounts of text and adjusts its parameters to predict language better." },
    { module: "how-it-works", term: "Inference", def: "The phase in which a trained model is used. Each time you send a message, it applies what it already learned; it is not learning from you." },
    { module: "how-it-works", term: "Token", def: "A small unit of text, often a whole word and sometimes part of one. Each token is assigned an ID number." },
    { module: "how-it-works", term: "Tokenization", def: "Dividing text into tokens and assigning each one an ID number. The first step of the loop that produces every response." },
    { module: "how-it-works", term: "Embedding", def: "A token converted into a list of numbers that places it in a “meaning space”, where words used in similar contexts sit close together." },
    { module: "how-it-works", term: "Transformer", def: "The design behind today's AI chatbots. For every token, it determines which other tokens are most relevant." },
    { module: "how-it-works", term: "Attention", def: "How a model weighs which words in a passage matter most to one another. It allows the same word to carry different meanings in different sentences." },
    { module: "how-it-works", term: "Next-token prediction", def: "The core of the loop: given everything so far, assign a probability to every possible next token, select one, and repeat." },
    { module: "how-it-works", term: "Sampling", def: "Selecting one token from the scored options. A likely token is usually chosen, but not necessarily the most likely one." },
    { module: "how-it-works", term: "Probabilistic", def: "Selecting from weighted options, so the same input can produce different outputs. An LLM is probabilistic." },
    { module: "how-it-works", term: "Deterministic", def: "Producing the same output every time for the same input, as a calculator does." },
    { module: "how-it-works", term: "Temperature", def: "A setting that controls how much variation a model's responses have. At a higher temperature, less likely words are selected more often." },
    { module: "how-it-works", term: "Context window", def: "How much text a model can take into account at once, including your prompt, the conversation history and any documents you provide." },
    { module: "how-it-works", term: "Base model", def: "A model after pre-training and before fine-tuning. It has broad knowledge but little ability to follow instructions." },
    { module: "how-it-works", term: "Fine-tuning", def: "Additional training on a smaller, carefully selected set of examples, to teach a model a specific task, style or subject." },
    { module: "how-it-works", term: "RLHF", def: "Reinforcement learning from human feedback: training a model to favor the kinds of responses people rated more highly. It shapes the model's manner, and its blind spots." },
    { module: "how-it-works", term: "Alignment", def: "The broader effort to make a model's behavior match human intentions and values. An open question is whose values." },
    { module: "how-it-works", term: "Model family", def: "A series of versions of one company's model, released over time, such as OpenAI's GPT models or Anthropic's Claude models." },
    { module: "how-it-works", term: "Open weights", def: "A model whose trained parameters have been published, so others can run and adapt it. Not the same as fully open source." },
    { module: "how-it-works", term: "Agent", def: "An AI system set up to take actions, such as searching the web or operating other software, rather than only producing text." },

    { module: "using-llms", term: "Prompt", def: "The instructions and material you give a model. It knows nothing about your situation beyond what you provide." },
    { module: "using-llms", term: "Grounding", def: "Connecting a model to real, retrievable sources, so that its responses can be traced and checked rather than taken on trust." },
    { module: "using-llms", term: "Retrieval-augmented generation (RAG)", def: "A grounding method: retrieve relevant passages from trusted sources, add them to the context window, then generate a response from them." },
    { module: "using-llms", term: "Hallucination", def: "Output that appears factual but is false, such as an invented quotation or citation. It occurs because the model predicts likely words, not true ones." },
    { module: "using-llms", term: "Bias", def: "A systematic skew in a model's output that comes from imbalances in its training data, such as which voices, languages and histories are well represented." },
    { module: "using-llms", term: "Data retention", def: "A company keeping what you enter into its AI tool. Depending on its policy and your settings, it may store, review or train on your conversations." },
    { module: "using-llms", term: "Human oversight", def: "Review of AI-generated work by a person with knowledge of the subject, who checks and corrects it before it is released." },

    // Kept for reference; no module explains these, so Term match skips them.
    { term: "Greedy decoding", def: "Always selecting the single most likely next token. Predictable, but repetitive." },
    { term: "Proprietary model", def: "A model only its company can run. You use it through the company's own app or services." }
  ],

  /* ---------- 11. FAQ ---------- */
  faq: [
    { q: "Who is this for?",
      a: "Anyone curious about AI who wants a clear, accurate place to start: what it is, how chatbots work, and how to use them well. There is no login, no account, and nothing on this page is locked. Purple Maiʻa first made it for its own staff, and it is open to everyone." },
    { q: "Do I need any technical background?",
      a: "None. There is no math in any of the three modules, and nothing assumes you have used a particular tool." },
    { q: "Is the model learning from what I type?",
      a: "Not as you chat. A chatbot does its learning before it is released, and when you talk to it, it uses what it already learned. That is why correcting it will not fix the mistake for next time. Separately, some products save your conversations or remember things about you, and some companies use conversations to train future models. That is a privacy question, and Module 3 covers it." },
    { q: "Why do I get a different answer when I ask the same question twice?",
      a: "Because a chatbot is probabilistic, not deterministic like a calculator. At each step it picks from a list of likely next words instead of always taking the top one. That variation is expected, not a bug." },
    { q: "Why is it weaker on some languages and cultures, like ʻōlelo Hawaiʻi?",
      a: "Because of what it learned from. If a language or subject barely appears in its training data, the model is weaker on it, and it will still answer confidently rather than tell you it is out of its depth. Module 2 explains why, and Module 3 comes back to it under bias." },
    { q: "If a chatbot shows its reasoning step by step, does that mean it is right?",
      a: "No. Displayed reasoning is still text generated one step at a time, and no step is checked independently. An orderly chain of steps can reach a wrong answer, and appearing rigorous is not the same as being correct." },
    { q: "Can I use AI to draft something other people will read?",
      a: "Yes, as a draft. Before it is released, a person with knowledge of the subject should review it, check the facts and correct any errors. This applies every time, and especially to anything concerning culture or community." },
    { q: "Which AI chatbot should I use?",
      a: "This course does not recommend one. ChatGPT, Claude, Gemini and the others work the same basic way, so everything here applies to all of them. A practical approach is to try more than one on a task you know well, see which suits you, and review the privacy settings of the one you choose." },
    { q: "How deep does it go?",
      a: "This is an introductory course: enough to understand how these tools work and to use them sensibly. Fine-tuning, RLHF, open weights and agents get a short introduction at the end of Module 2. Broader questions, such as who governs AI, where training data comes from and whether people agreed to it, and Indigenous data sovereignty, need more room than a 101 can give them." },
    { q: "Are the quizzes graded, and does anyone see my score?",
      a: "No and no. The practice at the end of each module is for you. Like your reading progress, answers are kept in your own browser and nothing is uploaded anywhere. One thing on this page can send anything, and it waits for you to press a button: the feedback form, which sends only what you type into it." },
    { q: "What does the feedback button send?",
      a: "Only what you send, and only when you press send: your note, which of the three kinds you picked, your name if you chose to fill it in, which module and section you were looking at, the address you were on, which version of the page you had on if it offers a choice, and your browser and window size so a layout bug can be reproduced. No account, no cookie, no tracking, and no raw device fingerprint. It lands in a spreadsheet in Purple Maiʻa’s own Drive and turns into a write-up every Friday." },
    { q: "Where are the Purple Maiʻa videos?",
      a: "All 19 of them. Every lesson in every module now carries Purple Maiʻa's own animation, made from this course's scripts, and there are no outside stand-ins left. If a lesson ever goes back to an outside explainer, a notice under the player says so — that notice is keyed to the kind of video, not to a flag anyone has to remember to set." },
    { q: "Will these materials stay up?",
      a: "Yes. The page is free and public. Teachers and groups are welcome to use it in their own sessions, and the source is on GitHub if you want to make your own copy." }
  ],

  /* ---------- 12. RESOURCES ---------- */
  resources: [
    {
      group: "Outside videos worth watching (~35 min)",
      items: [
        { label: "Natural Language Processing: Crash Course AI #7", url: "https://www.youtube.com/watch?v=oi0JXuL19TA", desc: "13:29 · A friendly introduction to how computers work with language, the NLP circle from Module 1." },
        { label: "How LLMs Actually Generate Text — LearnThatStack", url: "https://www.youtube.com/watch?v=NKnZYvZA7w4", desc: "9:24 · How a model writes text one token at a time. One of the sources for Module 2." },
        { label: "Large Language Models explained briefly — 3Blue1Brown", url: "https://www.youtube.com/watch?v=LPZh9BOjkQs", desc: "7:58 · A short, visual explainer. Plays in Module 2, under “Parameters”." },
        { label: "ChatGPT, AI and Māori data sovereignty", url: "https://www.sciencelearn.org.nz/videos/2194-chatgpt-ai-and-maori-data-sovereignty", desc: "3:47 · Māori perspectives on AI and who controls data. Hosted by Science Learning Hub, with a full transcript." }
      ]
    },
    {
      group: "Demos worth playing with",
      items: [
        { label: "LLM visualizer", url: "https://bbycroft.net/llm", desc: "Step through a working model layer by layer. A strong companion to Module 2." },
        { label: "Embedding projector", url: "https://projector.tensorflow.org/", desc: "A meaning space you can rotate and search. A clear illustration of embeddings." },
        { label: "TensorFlow Playground", url: "https://playground.tensorflow.org/", desc: "Train a small neural network in your browser and watch its settings adjust as it learns." },
        { label: "Survival of the Best Fit", url: "https://www.survivalofthebestfit.com/resources", desc: "A game about a hiring algorithm that shows how bias enters a system. Useful alongside Module 3." },
        { label: "Google PAIR Explorables", url: "https://pair.withgoogle.com/explorables/", desc: "Interactive essays on bias, privacy and model behaviour." },
        { label: "Quick, Draw!", url: "https://quickdraw.withgoogle.com/?locale=en_US", desc: "A thirty-second drawing game that demonstrates how training data works." },
        { label: "AI4Hawaiʻi", url: "https://www.ai4hawaii.org/", desc: "Local perspectives on AI in Hawaiʻi." }
      ]
    },
    {
      group: "Research behind the course",
      items: [
        { label: "On the Dangers of Stochastic Parrots — Bender et al., FAccT 2021", url: "https://dl.acm.org/doi/10.1145/3442188.3445922", desc: "Behind “Bias and missing cultural context” in Module 3." },
        { label: "Retrieval-Augmented Generation — Lewis et al., NeurIPS 2020", url: "https://arxiv.org/abs/2005.11401", desc: "Behind “Grounding” in Module 3." },
        { label: "Chain-of-Thought Prompting — Wei et al., 2022", url: "https://arxiv.org/abs/2201.11903", desc: "Behind “Reasoning, and what it is not” in Module 3." },
        { label: "Survey of Hallucination in NLG — Ji et al., 2023", url: "https://arxiv.org/abs/2202.03629", desc: "Behind “Hallucinations” in Module 3." },
        { label: "NIST AI Risk Management Framework 1.0", url: "https://www.nist.gov/itl/ai-risk-management-framework", desc: "Behind “Privacy and data retention” and “Human judgment and oversight” in Module 3." }
      ]
    },
    {
      /* Purple Maiʻa's own short-form animations. As each one lands, drop the
         file in assets/video/ and set the matching lesson's
         video: "file:assets/video/<name>.mp4" — the stand-in label disappears
         on its own. All 19 carry one today; keep the count below in step with
         the FAQ if that ever stops being true. */
      group: "Purple Maiʻa originals",
      items: [
        { label: "Our own short videos", url: "#/", desc: "All 19 videos in the modules were made by Purple Maiʻa for this course, animated from its scripts." }
      ]
    },
    {
      group: "For teachers and facilitators",
      items: [
        { label: "Fork this page", url: "https://github.com/KenethM/PurpleMaia---AI-Page/fork", desc: "Make your own copy of this site to use with your own group." },
        /* A PDF in the repo rather than a hosted deck link on purpose: no sign-in
           wall for people outside the org, and it survives being forked. */
        { label: "Slide deck (PDF)", url: "assets/llm-nlp-101.pdf", desc: "All 35 slides, as presented. 15 MB." },
        { label: "Prompt library", url: "#prompts", desc: "The prompts on this page, ready to copy." },
        /* Regenerate with tools/make-qr.js if the canonical URL ever moves. A QR
           is the one asset that cannot be redirected once it is on a printed slide. */
        { label: "QR code for this page", url: "assets/qr-slide.png", desc: "A slide to project — people scan it and open this page on their own phone." }
      ]
    }
  ],

  /* ---------- 13. FOOTER ---------- */
  footer: {
    links: [
      { label: "Contact", url: "mailto:keneth@purplemaia.org" },
      { label: "Source on GitHub", url: "https://github.com/KenethM/PurpleMaia---AI-Page" },
      { label: "Report a problem", url: "https://github.com/KenethM/PurpleMaia---AI-Page/issues" }
    ]
  },

  /* ---------- 14. FEEDBACK ----------
     The widget in the bottom-right corner. This is the only thing on the
     page that sends anything anywhere — everything else (progress, quiz
     answers, theme, audience) stays in the visitor's own browser.

     endpoint: paste the Apps Script web-app URL here and the widget starts
       posting to your Sheet. Leave it "" and the widget still works: it
       falls back to opening the visitor's mail client with the message
       already written. Nothing is ever silently dropped.
       Setup steps and the script itself: tools/feedback-apps-script.js

     mailto: the address(es) the fallback writes to, comma-separated for
       more than one. The Friday digest's recipients are set separately,
       in DIGEST_TO in tools/feedback-apps-script.js.
  --------------------------------------------------------------- */
  feedback: {
    endpoint: "https://script.google.com/macros/s/AKfycbzQ3r33WpCDM_DatcNaynMJ9_vn5lYqrtD-S9kLZ2izm_18NwnNNA-ZSJ4CmG77VqFLTQ/exec",
    mailto: "keneth@purplemaia.org, splimon@purplemaia.org",
    button: "Feedback",
    title: "Tell us what to fix",
    blurb: "This page is a working draft and every note goes into the next pass. Say what tripped you up, what was wrong, or what is missing.",
    kinds: [
      { id: "gripe",      label: "Something is wrong",   hint: "Inaccurate, confusing, or it reads badly." },
      { id: "suggestion", label: "Idea or request",      hint: "Something to add, cut, or explain differently." },
      { id: "bug",        label: "Something is broken",  hint: "A link, a video, a quiz, the layout on your screen." }
    ],
    placeholder: "What happened, and what would you rather it did?",
    nameLabel: "Your name, if you want a reply",
    namePlaceholder: "Optional",
    submit: "Send it",
    thanks: "Got it. Thank you — this lands in Friday's list.",
    queued: "Saved on this device. It will send next time you open the page."
  }

,

  /* ---------- 15. CERTIFICATE ----------
     The only part of this page that asks who you are, and it only asks once
     you have finished every lesson. Nothing is gated behind it: every lesson,
     quiz and activity works without ever signing in. If you never want a
     certificate, the page never learns your name.

     How it works, and why it is built this way:

       1. You finish the lessons, then ask for a certificate and give a name
          and an email.
       2. That request goes to the Apps Script, which emails you a one-time
          link. No password is ever created, stored or transmitted.
       3. Clicking the link proves the address is yours. The script records
          the completion, then sends you back here with your name and a
          verification code.
       4. The certificate renders in your browser and prints.

     Nothing is sent while you work through the lessons. The first and only
     transmission happens when you ask for the certificate, which is what
     keeps the progress ring's promise honest.

     endpoint: the Apps Script web-app URL. Leave it "" and the whole feature
       stays hidden, so the page behaves exactly as it did before.
       Setup steps: tools/certificate-apps-script.js
       Only the community edition issues certificates, so it stays "" here
       and community.js sets it. Its FAQ is the one that describes them.

     requireAll: true means the certificate only unlocks at 100%. Set a number
       instead to unlock earlier, e.g. 15 of 19.
  --------------------------------------------------------------- */
  certificate: {
    endpoint: "",
    requireAll: true,

    title: "Certificate of completion",
    courseName: "Artificial Intelligence 101",
    issuer: "Purple Maiʻa",
    blurb: "You have been through all of it. Put your name on it and keep a copy.",

    cta: "Get your certificate",
    nameLabel: "Name as it should appear",
    namePlaceholder: "Your full name",
    emailLabel: "Email, so we can send the link",
    emailPlaceholder: "you@example.org",
    submit: "Email me the link",

    sent: "Check your inbox. The link lasts 15 minutes.",
    sendFailed: "Could not reach the server. Nothing was sent, so nothing was recorded.",
    needName: "A name is needed for the certificate.",
    needEmail: "That does not look like an email address.",

    /* Shown under the form, above the button. Keep this accurate: it is the
       whole reason anybody should trust the thing. */
    disclosure: "What this sends",
    disclosureBody:
      "Your name, your email, and how many lessons you finished. Nothing else, " +
      "and nothing until you press the button. Your answers, your progress and " +
      "the lessons you opened stay in this browser, as they always have. The " +
      "record lives in a spreadsheet in Purple Maiʻa's own Drive.",

    /* Printed on the certificate so a reader can check it is real. */
    verifyNote: "Verify this certificate with Purple Maiʻa, quoting the code above.",
    print: "Print or save as PDF",
    signedOut: "Start over"
  }

};
