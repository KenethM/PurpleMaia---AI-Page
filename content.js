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
    name: "Artificial Intelligence 101",
    shortName: "Artificial Intelligence 101",
    // The home page's big line. `name` stays the page title and the header brand.
    headline: "Artificial Intelligence 101",
    tagline: "A free course from Purple Maiʻa on what AI chatbots actually are, how they come up with an answer, and where they fall short.",
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
      title: "What is generative AI?",
      summary: "Five terms people use as if they mean the same thing. They nest inside each other, and you've already met all of them.",
      sections: [
        {
          id: "several-technologies",
          heading: "AI is several technologies, not one",
          body: [
            "Most people use “AI” as the umbrella term for computers doing tasks that seem to need human thinking. That is close enough to be useful and loose enough to cause trouble, because “AI” does not name one technology.",
            "It covers a set of smaller technologies working together, each one with a name and each one with limits you can learn. They build from the outside in."
          ]
        },
        {
          id: "five-terms",
          heading: "Five terms that nest inside each other",
          lesson: "m1-map",
          body: [
            { list: [
              "**Artificial intelligence** covers any computer system doing work we associate with human thinking.",
              "**Machine learning** is a way of building AI where the system learns patterns from data instead of following rules a person wrote out by hand.",
              "**Natural language processing** applies machine learning to human language, so computers can read, interpret and produce text and speech.",
              "**Generative AI** creates new content, such as text, images, audio or video, instead of only sorting or predicting.",
              "**Large language models** sit where NLP and generative AI overlap. They process language and they generate it, and they are the technology behind most text-generating AI today."
            ] }
          ],
          sources: ["toloka-2026"]
        },
        {
          id: "already-met",
          heading: "Where you've already met it",
          lesson: "m1-daily",
          body: [
            "Most of us have been using all of this for years without calling any of it AI.",
            { table: {
              head: ["Technology", "Where you have already met it"],
              rows: [
                ["Machine learning", "Streaming recommendations, spam filters, social feeds"],
                ["Natural language processing", "Live captions, translation tools, spell-check, voice-to-text"],
                ["Generative AI", "Social graphics, image generators, first-draft copy"],
                ["Large language models", "Drafting emails, summarizing long documents, quick how-to help"]
              ]
            } }
          ],
          takeaway: "These five terms nest inside each other instead of competing. Being able to say which one you mean puts you ahead of most of the conversation."
        }
      ]
    },

    {
      id: "how-llms-work",
      track: "how-it-works",
      image: "assets/video/autocomplete-trick.jpg",
      title: "How an LLM works",
      summary: "Training, then the five-step loop that writes every answer one token at a time, and how models are built and adapted.",
      lede: "An LLM doesn't look up answers. It predicts them one token at a time, and on its own it's only as reliable as its training data.",
      sections: [
        {
          id: "training-and-inference",
          heading: "Training and inference",
          body: [
            "A large language model (LLM) works in two distinct phases: **training** and **inference**.",
            "Training begins with pre-training, in which the model processes a very large body of text and adjusts its parameters to improve its predictions of language. Pre-training happens once for each model version, and later stages of training refine the result.",
            "During inference, the model applies what it has already learned to generate a response, one token at a time. This happens every time someone sends a prompt."
          ],
          sources: ["cloudflare"]
        },
        {
          id: "training-data",
          heading: "Training data",
          lesson: "m2-training-data",
          body: [
            "Training data is the body of text a model processes during pre-training, drawn from websites, books, articles and code. It is the source of everything the model knows, and of every gap in that knowledge.",
            "Subjects underrepresented in training data are subjects the model performs poorly on.",
            "**ʻŌlelo Hawaiʻi, Hawaiian cultural practice, and knowledge carried through family and oral tradition** are all far less present on the open internet than English-language material. Nobody designs the gap. It is a direct consequence of what the model reads.",
            "The model has no way of detecting this gap either. It answers a question about Hawaiian protocol with the same confidence it brings to a general knowledge question. This is where bias and missing cultural context come from, which Module 3 returns to."
          ],
          sources: ["ibm-2025"]
        },
        {
          id: "parameters",
          heading: "Parameters",
          lesson: "m2-parameters",
          body: [
            "Parameters are the model's learned internal settings, the “knobs” that control how it weighs and combines information.",
            "They work a bit like the channels water carves into the earth. Each time rain falls, water follows the easiest path downhill, and over time some channels deepen while others fill in and fade. What the landscape “knows” about where water should flow isn't stored in any single groove. It's in the overall shape of the terrain, the whole pattern of deep cuts and shallow dips that guides each new rainfall along familiar routes.",
            "During pre-training, these settings get adjusted over and over until the model's predictions improve. A change to the parameters changes the probabilities the model assigns to each possible next word. All else being equal, more parameters generally means greater capability."
          ],
          sources: ["3b1b-2024"]
        },
        {
          id: "learning-stops",
          heading: "Learning stops at training",
          lesson: "m2-pretraining-inference",
          body: [
            "Because learning happens during training and stops there, correcting a model during a conversation does not correct the model. It may acknowledge the error and give the right answer in that conversation, then repeat the same error in a new one. Its learning concluded before release.",
            "Two questions are worth keeping separate: whether a model learns from what you type, and whether a provider stores it. Some products keep conversations or offer memory features, and some providers use conversations to train future versions of their models, depending on their data policy and your settings. None of this changes the model you are talking to, but it does mean your input may not stay private."
          ]
        },
        {
          id: "generation-loop",
          heading: "The generation loop",
          lesson: "m2-loop",
          body: [
            "Every response comes out of the same five-stage loop, repeated once for each token generated.",
            { steps: [
              "**Tokenization.** The input text is divided into units called tokens, each assigned an ID number.",
              "**Embeddings.** Each token is converted into a list of numbers that positions it within a “meaning space,” where words used in similar contexts sit near one another.",
              "**Transformers.** For each token, the model works out which other tokens are most relevant to it, a mechanism called attention.",
              "**Probabilities.** Based on the full context, the model assigns a probability to every possible next token.",
              "**Sampling.** The model selects one token, typically a likely one, though not necessarily the most likely. The selected token is added to the text, and the loop repeats until the model selects an end-of-sequence token."
            ] },
            "Any answer is that loop running hundreds of times over. The videos below zoom in on four of the stages."
          ],
          parts: [
            { id: "tokenization",  heading: "Tokenization",           lesson: "m2-tokenization",
              body: ["The model never sees words. It sees numbered chunks of text, and how a language gets chopped up decides how much it costs to process."] },
            { id: "embeddings",    heading: "Embeddings",             lesson: "m2-embeddings",
              body: ["Each token becomes a list of numbers, a position in a space where distance means similarity of meaning."] },
            { id: "attention",     heading: "Transformers and attention", lesson: "m2-transformers",
              body: ["For every token, the model decides which other tokens matter most to it. That weighing is what lets context change meaning."] },
            { id: "next-token",    heading: "Next-token prediction",  lesson: "m2-next-token",
              body: ["Given everything so far, the model scores every possible next token, picks one, adds it, and does it again."] }
          ],
          sources: ["3b1b-2024", "learnthatstack-2025"]
        },
        {
          id: "sampling",
          heading: "Probabilistic output and sampling",
          lesson: "m2-sampling",
          body: [
            "A deterministic system, such as a calculator, produces the same output for the same input every time. A probabilistic system, such as an LLM, selects from weighted options, so the same question can produce different answers. This variation is expected behavior.",
            "A setting called **temperature** governs how much variation there is. At a low temperature, the model almost always selects the most probable token. At a higher temperature, it selects less probable tokens more often.",
            "The essential point is that no stage of this loop retrieves information or verifies facts. The model's apparent confidence reflects how likely its words are, not whether they are true."
          ],
          sources: ["learnthatstack-2025"]
        },
        {
          id: "context-windows",
          heading: "Context windows",
          lesson: "m2-context-window",
          body: [
            "The context window is how much text a model can consider at one time. Your prompt, the conversation history, and any documents you supply all share that space.",
            "As a conversation gets longer, older messages may be dropped, summarized, or given less weight, depending on the product. The same limit applies to a long document, and many tools will not tell you when only part of it was processed. In practice, start a new conversation for each new topic, and restate anything essential."
          ],
          takeaway: "An LLM does not look up answers. It predicts them one token at a time, and on its own it is only as reliable as its training data."
        },
        {
          id: "built-and-adapted",
          heading: "How models are built and adapted",
          body: [
            "Commercial AI assistants pass through several development stages before release, and each one shapes what the model knows and how it behaves.",
            { steps: [
              "**Pre-training.** The model processes a very large body of general text and learns to predict the next token. This takes data centers full of specialized processors (GPUs) running for weeks or months. The result is a base model, with broad knowledge and no particular skill at following instructions.",
              "**Fine-tuning.** The base model gets additional training on a smaller, targeted set of examples, which teaches it a specific task, style or subject area. Fine-tuning adjusts the same parameters, building on what the model already learned.",
              "**Reinforcement learning from human feedback (RLHF).** People compare and rate model responses, and the model is trained to favor the kinds of responses rated more highly. This accounts for much of a chatbot's careful manner. It also shapes the model's values and its blind spots, which depend on who did the rating and what they were told to reward."
            ] },
            "**Alignment** is the broader effort to make a model's behavior match human intentions and values, and fine-tuning and RLHF are among its main methods. For Indigenous communities, the central question is whose values a model has been aligned to."
          ],
          sources: ["ouyang-2022"]
        },
        {
          id: "families-and-agents",
          heading: "Model families, open weights and agents",
          lesson: "m3-model-families",
          body: [
            "Different companies develop different models, and each company releases a series of versions over time, called a **model family**. ChatGPT is built on OpenAI's GPT family, Claude is developed by Anthropic, and Gemini by Google. Successive versions usually reflect more training, more data, or a better design, much as each new generation of a phone builds on the last. Model names change often, so check current names before citing them in public.",
            "**Open weights** means a model's trained parameters have been published. That is different from fully open source, which would also include the code and detailed information about the training data. The distinction matters for data sovereignty, since a community can only control a model it is able to run and adapt.",
            "An **agent** is an LLM set up to take actions instead of only writing text: searching the web, operating software tools, or running a multi-step workflow. Agents run on the same next-token loop, so every limitation in Module 3 still applies, and the stakes rise, because the model is now acting rather than drafting."
          ],
          takeaway: "Each stage of development shapes both what a model knows and whose values it reflects.",
          sources: ["osi-2024"]
        }
      ]
    },

    {
      id: "using-llms-well",
      track: "using-llms",
      image: "assets/video/fake-citation.jpg",
      title: "Using LLMs well",
      summary: "Prompting, grounding and checking the answer, then the limits: hallucinations, bias, privacy, and who signs off.",
      lede: "A model cannot know what only you know, and it does not check its own work. Give it context, ground it in real sources, and verify what comes back.",
      sections: [
        {
          id: "prompting",
          heading: "Prompting and context",
          lesson: "m3-prompts",
          body: [
            "The quality of a model's output depends heavily on the input it receives. It has extensive general knowledge, but no knowledge of your specific situation.",
            "A helpful frame is to treat the model as a capable new employee on their first day. They bring broad general knowledge but don't know your organization, its records or its voice, and can only work with what they are given. So write prompts with enough context: the format you want, who it's for, the tone, and any source material that matters."
          ],
          sources: ["anthropic-prompting"]
        },
        {
          id: "grounding",
          heading: "Grounding and retrieval-augmented generation",
          lesson: "m3-grounding",
          body: [
            "On its own, an LLM generates responses only from patterns in its training data and does not consult any reference. **Grounding** pairs the model with real, retrievable sources, so its responses are based on actual documents rather than statistical likelihood alone.",
            "The most widely used grounding method is **retrieval-augmented generation (RAG)**, which works in three steps:",
            { steps: [
              "**Retrieve.** The system searches a defined set of trusted sources, such as a website, a search engine, or an organization's own files, for the passages most relevant to the question.",
              "**Augment.** The retrieved passages are added to the context window alongside the question.",
              "**Generate.** The model writes its response from the retrieved material. A well-designed system also shows which sources it used."
            ] },
            "RAG does not eliminate errors. A model can still misread a source or retrieve an irrelevant one. But a grounded response comes with citations you can check yourself, and an ungrounded one does not.",
            "RAG and fine-tuning solve different problems. RAG supplies specific, current information at the moment of the question without changing the model. Fine-tuning changes the model itself, to adjust its abilities or style. For “What does our 2025 annual report say?”, RAG is the right tool. For “write every response in our voice and format”, fine-tuning is."
          ],
          sources: ["lewis-2020"]
        },
        {
          id: "verification",
          heading: "Verifying what comes back",
          body: [
            { list: [
              "Treat all AI output as a draft, not a finished product.",
              "Check factual claims yourself, especially names, dates, figures, quotations and citations.",
              "Where accuracy matters, use tools that cite their sources, and read those sources directly.",
              "When a response shows step-by-step reasoning, find the step the conclusion depends on and check that step yourself."
            ] }
          ],
          takeaway: "A model cannot infer what only you know, so that context has to be provided. Ground the model in trustworthy sources whenever you can, and verify its output yourself."
        },
        {
          id: "hallucinations",
          heading: "Hallucinations",
          lesson: "m3-hallucinations",
          body: [
            "Every limitation in this module follows from two things you saw in Module 2: the model predicts likely text rather than checking facts, and its knowledge is limited to its training data.",
            "A **hallucination** is output that looks factual, such as a claim, a name or a citation, but is false. Ask a model for a quotation from a book with a page number, and it may cite a real book while inventing both the quotation and the page.",
            "Hallucination is not lying. Lying requires knowing the truth, and the model has no such knowledge. Having seen a great many citations during training, it reproduces their form and fills it with the most probable content. Models are also generally rewarded during training for giving an answer rather than admitting uncertainty.",
            "As a result, models are most persuasive on exactly the details readers are most inclined to trust, such as names, dates, page numbers and quotations, and those are among the details most often wrong."
          ],
          sources: ["ji-2023", "kalai-2025"]
        },
        {
          id: "bias",
          heading: "Bias and missing cultural context",
          lesson: "m3-bias",
          body: [
            "Bias in an LLM starts in its training data, which reflects the existing imbalances of the internet: which voices, languages and histories are well represented, and which are not. A model can reproduce and amplify those imbalances.",
            "For Purple Maiʻa, this is a central concern rather than an edge case. A model trained mostly on English and Western sources may answer a question about Hawaiian cultural protocol with a generic outside interpretation rather than deferring to community and Native sources.",
            "Research with educators in Hawaiʻi has documented models reproducing outside, colonial framings of Hawaiian history, such as a sanitized portrayal of Captain Cook. Kumu in Kaiapuni programs have also raised concerns about cultural misalignment and the reliability of AI-generated content. These biases are not opinions the model formed. They reflect the material it was trained on."
          ],
          sources: ["bender-2021", "zhao-2026", "mhasakar-2025"]
        },
        {
          id: "reasoning",
          heading: "Reasoning, and what it isn't",
          lesson: "m3-reasoning",
          body: [
            "Some models show step-by-step reasoning before giving an answer. This often improves accuracy on complex tasks, but it runs on the same next-token loop. Each step is the most plausible continuation, and no step is checked independently.",
            "So a model can produce an orderly, confident sequence of steps that arrives at a wrong conclusion, with every step presented as fact. The reasoning it shows may not even reflect what actually drove the answer.",
            "Showing reasoning and verifying reasoning are two different things. Asking for step-by-step reasoning can make a response more persuasive without making it more reliable."
          ],
          sources: ["wei-2022", "turpin-2023"]
        },
        {
          id: "privacy",
          heading: "Privacy and data retention",
          body: [
            "Anything you type into an AI tool is sent to the company that runs it. Depending on the product and its settings, the provider may store conversations, have people review them, or use them to train future versions of the model. That does not change the model you are talking to, but the information has left your hands.",
            "This matters most for students' records, personal details, and community or cultural knowledge that is not ours to share. Before entering anything sensitive, check the tool's data policy, and when in doubt, leave it out."
          ],
          sources: ["nist-2023"]
        },
        {
          id: "oversight",
          heading: "Human judgment and oversight",
          lesson: "m3-oversight",
          body: [
            "AI is a tool for drafting, exploring and speeding up work. It cannot tell whether a draft is accurate, whose knowledge it contains, or how it will be received. Nor can it take responsibility for errors once they are published.",
            "Anything made with AI should be reviewed before it goes out by a person who knows the subject, who checks it and corrects it. That applies without exception, and most of all to public-facing material and to anything about culture and community."
          ],
          takeaway: "Plausible output may still be false, so a person with subject knowledge reviews anything made with AI before it is released.",
          sources: ["nist-2023"]
        },
        {
          id: "practices",
          heading: "Recommended practices",
          body: [
            "Everything in these three modules, turned into habits. The right-hand column is the reason for each one.",
            { table: {
              head: ["Practice", "Why"],
              rows: [
                ["Say who it's for, how long, and what tone, and supply the source material", "The model knows nothing about your situation unless you tell it"],
                ["Treat all output as a draft", "The model predicts likely text. No stage of generation checks facts"],
                ["Check names, dates, figures, quotations and citations", "These are the details where models are most persuasive and most often wrong"],
                ["Use source-citing tools where accuracy matters", "Grounded answers can be checked independently"],
                ["Start a new conversation for each new topic, and restate what matters", "Earlier text falls outside the context window"],
                ["Don't assume a correction will stick", "Models do not learn from individual conversations"],
                ["Ask knowledgeable people about culture, ʻōlelo Hawaiʻi, or community", "These subjects are underrepresented in training data, and models cannot detect the gap"],
                ["Read the data policy before entering sensitive or community information", "What you type may be kept by the provider"],
                ["Have someone who knows the subject review anything before it goes out", "Responsibility rests with people, not tools"]
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
     videoLength: the embedded video's real runtime, read off YouTube rather
             than estimated. Nothing renders it today. It used to sit bottom-right
             of the thumbnail, but `duration` was what was being drawn there —
             self-paced time for the whole lesson, in the one corner every viewer
             reads as the video's length. Two different clocks, and they have not
             been reconciled since the stand-in videos landed: `duration` is
             documented as including video time, and those values predate 16 of
             the 19 videos. Fix the clocks, then decide what the card shows.
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
      video: "file:assets/video/ai-isnt-one-thing.mp4",
      videoLength: "1:20",
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
      video: "file:assets/video/youve-been-using-it-for-years.mp4",
      videoLength: "1:23",
      /* Shot 9:16 for social and exported onto a 16:9 canvas, so the file
         carries black bars our other films do not. `videoAspect` tells the
         player to show it portrait, which crops those bars back off. */
      videoAspect: "9/16",
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
      video: "file:assets/video/how-text-is-generated.mp4",
      videoLength: "1:45",
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
      videoLength: "7:58",
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
      video: "youtube:wjZofJX0v4M",
      videoLength: "27:14",
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
      /* Back on its stand-in. "The autocomplete trick" sat here too, because the
         script table maps script 2 to both lessons, but the same film on two cards
         in a row reads as a mistake. It lives on next-token prediction. */
      video: "youtube:MkaazQttbpc",
      videoLength: "14:51",
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
      video: "file:assets/video/like-a-new-hire.mp4",
      videoLength: "1:30",
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
      video: "file:assets/video/fake-citation.mp4",
      videoLength: "1:39",
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
      video: "youtube:T-D1OfcDW1M",
      videoLength: "6:35",
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
      video: "youtube:gV0_raKR2UQ",
      videoLength: "11:20",
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
      video: "file:assets/video/who-signs-it.mp4",
      videoLength: "1:27",
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
      video: "youtube:KrV6ldHymwQ",
      videoLength: "7:15",
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
     Seven activities. `type` picks the engine, so a new kind of activity
     needs an engine in assets/app.js too.

     Where each one appears on a module page:
       group: "quiz"   its questions join that module's "Check your
                       understanding" (module = a track id, or "all" for the
                       last module). Works for `scenarios` and `match`.
       group: "demo"   it sits inside the section named by `section` (a
                       section or part id from `modules`), under the text.
       tokens     live token-chopping sandbox (no data needed)
       predict    next-token dice roll with a temperature slider; needs `rounds`
       match      definition → term quiz, generated from the glossary below
       scenarios  judgment calls; same shape as the quizzes above
  --------------------------------------------------------------- */
  practice: [
    {
      id: "which",
      module: "overview",
      group: "quiz",
      type: "scenarios",
      title: "Which one is it?",
      tag: "Module 1 · AI, ML, NLP, generative AI, LLMs",
      blurb: "Five everyday things. For each one, name the narrowest label that actually fits. The point is not the vocabulary — it is noticing that these nest inside each other, so more than one label is often technically true and only one is useful.",
      note: "Every one of these is machine learning, and everything inside NLP is also machine learning. The question is always which ring you are standing in.",
      items: [
        {
          q: "Your photo app quietly groups every picture of the same person together.",
          options: [
            "Machine learning — but nothing to do with language",
            "NLP",
            "Generative AI, but not a language model",
            "An LLM"
          ],
          answer: 0,
          why: "It learned the pattern from data rather than being programmed face by face, so it is machine learning — but it is looking at pixels, not language. NLP is the ring inside machine learning that deals with words."
        },
        {
          q: "Live captions appear under a speaker on a video call.",
          options: [
            "NLP",
            "Machine learning — but nothing to do with language",
            "Generative AI, but not a language model",
            "An LLM"
          ],
          answer: 0,
          why: "Speech turned into text is language work, so it is NLP. Nothing new is being created — it is transcribing what was said. This is the ring most people have been using for years without calling it AI."
        },
        {
          q: "Your phone fixes \"teh\" to \"the\" before you notice.",
          options: [
            "NLP",
            "Machine learning — but nothing to do with language",
            "Generative AI, but not a language model",
            "An LLM"
          ],
          answer: 0,
          why: "Also NLP, and also nothing to do with LLMs. Autocorrect predates ChatGPT by decades. If you have used spell-check, translation or voice-to-text, you have been using NLP the whole time."
        },
        {
          q: "You type a sentence into Canva and it produces an image.",
          options: [
            "Generative AI, but not a language model",
            "An LLM",
            "NLP",
            "Machine learning — but nothing to do with language"
          ],
          answer: 0,
          why: "It is creating something new, so it is generative AI — but what comes out is an image, not text. LLMs are the part of generative AI that produces language. This is the pair people merge most often."
        },
        {
          q: "Claude drafts your monthly funder update from notes you pasted in.",
          options: [
            "An LLM",
            "Generative AI, but not a language model",
            "NLP",
            "Machine learning — but nothing to do with language"
          ],
          answer: 0,
          why: "The innermost ring. It is an LLM, which makes it generative AI, which makes it NLP, which makes it machine learning — all four are true at once. \"LLM\" is just the most specific and therefore the most useful thing to say."
        }
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
      blurb: "Type anything and watch it come apart into the chunks a model actually sees. Type an English sentence, then the same length in ʻōlelo Hawaiʻi, and compare the characters-per-token. The gap is not about word length — it is about what the model read.",
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
      module: "all",
      group: "quiz",
      type: "match",
      title: "Term match",
      tag: "All modules · Glossary",
      blurb: "Six definitions, no jargon. Name the term each one describes. Drawn at random from the glossary, so it is a different run every time.",
      rounds: 6
    },
    {
      id: "cite",
      section: "hallucinations",
      module: "using-llms",
      group: "demo",
      type: "cite",
      title: "Spot the real one",
      tag: "Module 3 · Hallucinations",
      blurb: "Four references, same field, same formatting. One is a real paper — the other three were assembled a moment ago out of plausible parts. Pick the real one before you scroll.",
      note: "The real papers are the ones cited in the deck, and the reveal links straight to each. The three fakes are stamped once revealed and are generated fresh every round, so the answer is never in the same place. Nothing here was looked up — which is exactly what a model does when it invents a citation.",
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
    },
    {
      id: "judge",
      module: "using-llms",
      group: "quiz",
      type: "scenarios",
      title: "Would you send it?",
      tag: "Module 3 · Oversight",
      blurb: "Six real situations, the kind that come up once you use these tools for real things. There is a defensible answer to each one — and the reasoning matters more than the score.",
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
    { term: "Model family", def: "Versions of the same model line released over time — GPT-4 and GPT-5, or Claude's successive releases." },
    // From the white paper's glossary (AI 101 Learning Materials, pp. 18–20).
    { term: "Artificial intelligence (AI)", def: "The umbrella term for computers doing tasks that seem to need human thinking. It names a family of technologies, not one." },
    { term: "Tokenization", def: "Splitting text into tokens and giving each one an ID number. The first step of the loop that writes every answer." },
    { term: "Sampling", def: "Choosing one token from the scored options. A likely token is usually chosen, but not always the top one." },
    { term: "Deterministic", def: "Gives the same output every time for the same input, like a calculator. An LLM is not; it is probabilistic." },
    { term: "Prompt", def: "The instructions and material you give a model. It knows nothing about your situation beyond what you put here." },
    { term: "Base model", def: "A model after pre-training, before it is fine-tuned to follow instructions. Broad knowledge, no particular manners." },
    { term: "Fine-tuning", def: "Further training a model on a smaller, focused set of examples to teach it a task, style or subject." },
    { term: "RLHF", def: "Reinforcement learning from human feedback: training a model toward the answers people rated higher. Shapes its manner, and its blind spots." },
    { term: "Alignment", def: "Efforts to make a model's behavior match human intentions and values. The open question is whose values." },
    { term: "Retrieval-augmented generation (RAG)", def: "A grounding method: retrieve relevant documents, add them to the prompt, then generate an answer from them." },
    { term: "Proprietary model", def: "A model only its company can run, used through the company's app or API." },
    { term: "Open weights", def: "A model whose trained parameters are published, so anyone can run and adapt it. Not the same as fully open source." },
    { term: "Agent", def: "An LLM set up to take actions, such as searching or running a workflow, not just write text. Same loop, higher stakes." }
  ],

  /* ---------- 11. FAQ ---------- */
  faq: [
    { q: "Who is this for?",
      a: "Anyone who wants an accurate baseline on AI, at a 101 level. It started as Purple Maiʻa’s shared baseline for staff and is open to everyone, with no login. There is no account to make and nothing on this page is gated. The only time it asks who you are is if you want a certificate at the end, and that is entirely optional." },
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
    { q: "How deep does it go on fine-tuning, RLHF, agents and open weights?",
      a: "Fine-tuning, RLHF, open weights and agents get a short introduction at the end of Module 2. The deeper material — governance, data provenance and consent, Indigenous data sovereignty, cultural authority — belongs with the Sovereign Stack work and a 200-level follow-up. This is the 101 baseline." },
    { q: "Are the quizzes graded, and does anyone see my score?",
      a: "No and no. The practice at the end of each module is for you. Like your reading progress, answers are kept in your own browser and nothing is uploaded anywhere. Two things on this page can send anything, and both wait for you to press a button: the feedback form, which sends only what you type into it, and the certificate, which only appears once you have finished every module and only if you want one." },
    { q: "What does the feedback button send?",
      a: "Only what you send, and only when you press send: your note, which of the three kinds you picked, your name if you chose to fill it in, which module and section you were looking at, the address you were on, which version of the page you had on if it offers a choice, and your browser and window size so a layout bug can be reproduced. No account, no cookie, no tracking, and no raw device fingerprint. It lands in a spreadsheet in Purple Maiʻa’s own Drive and turns into a write-up every Friday." },
    { q: "What is the certificate, and what does asking for one send?",
      a: "It appears once you have finished every module, and it is optional — nothing on this page is locked behind it. Asking for one sends three things: the name you want printed, an email address, and how much of the course you finished. Nothing else, and nothing at all until you press the button. There is no password and no account: you get a one-time link by email, clicking it proves the address is yours, and that is the whole sign-in. Your reading progress, your quiz answers and the sections you opened never leave your browser. The record lives in a spreadsheet in Purple Maiʻa’s own Drive, and the code printed on the certificate is how anyone can check it with us." },
    { q: "Where are the Purple Maiʻa videos?",
      a: "Eight of the videos in the modules are Purple Maiʻa's own, and more are being animated. The rest are outside explainers chosen for that specific topic and for how well they have been received, labelled as stand-ins under the player. Each one is replaced the moment ours is ready, and the label disappears with it." },
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
        { label: "Short-form animations — in production", url: "#lessons", desc: "Animated from the LLM/NLP 101 scripts. Until each lands, its lesson carries a labelled stand-in from another channel." },
        { label: "Scripts these are built from", url: "#lessons", desc: "Every lesson's takeaways are the script. Open a lesson to read the one you need." }
      ]
    },
    {
      group: "For facilitators",
      items: [
        { label: "Fork this page", url: "https://github.com/KenethM/PurpleMaia---AI-Page/fork", desc: "Run the same session for your own group." },
        /* A PDF in the repo rather than a hosted deck link on purpose: no sign-in
           wall for people outside the org, and it survives being forked. */
        { label: "Slide deck (PDF)", url: "assets/llm-nlp-101.pdf", desc: "All 35 slides, as presented. 15 MB." },
        { label: "Prompt library", url: "#prompts", desc: "The prompts above, ready to copy." },
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

     requireAll: true means the certificate only unlocks at 100%. Set a number
       instead to unlock earlier, e.g. 15 of 19.
  --------------------------------------------------------------- */
  certificate: {
    endpoint: "",
    requireAll: true,

    title: "Certificate of completion",
    courseName: "LLM/NLP 101",
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
