export const useCases = [
  {
    "id": "CS1",
    "categoryId": "cs",
    "name": "The same question, twenty times a day",
    "subject": "FAQ deflection",
    "frequency": "Daily",
    "automation": "Fully automatable",
    "painLine": "Half the messages we get are the exact same three questions. I could recite the answers in my sleep.",
    "workflow": [
      "A message arrives with one of the usual questions",
      "Someone reads it and recognizes the type",
      "The standard answer gets located, often from memory or a sticky note",
      "A response gets written or pasted, lightly personalized",
      "Send, resolve, repeat for the next identical message",
      "The 9pm version waits until morning"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2,
          3,
          4
        ],
        "dispositions": [
          "eliminate",
          "automate"
        ],
        "rationale": "The top 10 to 20 recurring questions get answered instantly by a FAQ bot or canned-response triggers. Humans stop performing recital."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Anything unrecognized escalates to a person automatically, so the team's queue is only the questions that need one."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Instant answers don't keep business hours."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "A monthly view of what people actually ask becomes the roadmap for fixing the confusing thing upstream."
      }
    ],
    "aiFit": "Canned responses and a structured FAQ bot are plain automation and carry most of the value. AI earns a place when the same question arrives phrased fifty different ways, or when answers live across a larger knowledge base. Start with automation; add AI when variety demands it.",
    "afterState": "The recitable questions answer themselves around the clock. Your inbox contains conversations that actually need a human, which is what you hired humans for."
  },
  {
    "id": "CS2",
    "categoryId": "cs",
    "name": "Inbox overload across five apps",
    "subject": "Multi-channel message consolidation",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "I'm checking email, Instagram DMs, Google Messages, and my phone all at once. Things fall through the cracks and I don't even notice until a customer is angry.",
    "workflow": [
      "Scan the email inbox for new inquiries",
      "Switch to Instagram and check the DMs",
      "Check Google and Yelp messages separately",
      "Check the business texting app",
      "Hold a mental ranking of what's urgent",
      "Respond across platforms in whatever order feels right",
      "End the day unsure what you missed in the channel you didn't check"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2,
          3,
          4
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Every channel routes into one unified inbox. The app-switching tour stops existing."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "Tagging by channel and intent happens on arrival; AI triages urgency when volume gets high, so the angriest message never waits the longest."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "simplify",
          "report"
        ],
        "rationale": "One screen with full context per customer, and a response-time view that tells you whether the cracks are actually closed."
      }
    ],
    "aiFit": "Aggregation and routing are plain automation, and under about 50 inquiries a day they're the whole answer. AI's role is intent-and-urgency triage at higher volume, surfacing what matters without a human reading everything first.",
    "afterState": "Every message lands in one feed, tagged and prioritized. Nothing lives in an app you might forget to check, and the angry-customer surprise stops happening."
  },
  {
    "id": "CS3",
    "categoryId": "cs",
    "name": "After-hours black hole",
    "subject": "After-hours inquiry coverage",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "Someone calls at 7pm when we're closed and I either miss the job or I'm answering texts from my couch for the rest of the night.",
    "workflow": [
      "A customer reaches out after closing",
      "The message sits unread or the call hits voicemail",
      "You may or may not see the notification from the couch",
      "Answer personally and the work-home boundary dissolves",
      "Wait until morning and the prospect may be gone",
      "The team starts each day digging out of the overnight backlog",
      "The genuinely urgent thing has already escalated by the time anyone sees it"
    ],
    "breakdown": [
      {
        "steps": [
          2,
          3
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Every after-hours inquiry gets an immediate, professional acknowledgment that collects name, need, and contact info, and sets an expectation."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "Qualified requests book themselves; an AI agent asks the qualifying questions for the complex ones. The couch-versus-lost-job dilemma stops being binary."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "simplify",
          "report"
        ],
        "rationale": "Urgent keywords escalate to your phone; everything else waits in a morning triage summary instead of a voicemail backlog."
      }
    ],
    "aiFit": "An auto-reply with a booking link handles most of the volume with zero AI. The AI case is the conversational layer for inquiries that need qualifying before they can book. For appointment businesses this is one of the cleanest AI fits in the library; the boundary it protects is yours.",
    "afterState": "Every evening inquiry gets answered in seconds, the bookable ones book themselves, and your morning starts with a triage summary instead of an apology tour."
  },
  {
    "id": "CS4",
    "categoryId": "cs",
    "name": "The review you never got around to answering",
    "subject": "Review monitoring and response",
    "frequency": "Daily / Weekly",
    "automation": "Partially automatable",
    "painLine": "I see a Google review notification, tell myself I'll respond later, and two weeks go by. Now it looks like we don't care.",
    "contextStat": {
      "value": "81%",
      "text": "of all customer reviews now live on Google.",
      "source": "Birdeye, State of Online Reviews"
    },
    "workflow": [
      "Review platforms get checked when someone remembers",
      "Each review gets read and judged for whether it needs a reply",
      "Positive replies get drafted to sound personal, not templated",
      "Negative reviews trigger an investigation before any reply",
      "The careful, non-defensive response gets written",
      "Responses get posted platform by platform",
      "The operational issue behind the bad review may or may not get fixed"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2
        ],
        "dispositions": [
          "eliminate",
          "automate"
        ],
        "rationale": "Every platform feeds one monitor, and every new review triggers a notification. \"When someone remembers\" stops being the system."
      },
      {
        "steps": [
          3,
          6
        ],
        "dispositions": [
          "optimize",
          "automate"
        ],
        "rationale": "AI drafts warm, varied responses to 4-and-5-star reviews; you read for 30 seconds and approve. Posting fans out to each platform."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Low-star reviews flag with urgency and stay human-written. The draft can start the thinking, never finish it."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Review themes roll up monthly, so the recurring complaint becomes an operations fix instead of a recurring apology."
      }
    ],
    "aiFit": "This is the clearest \"AI as first draft\" pattern in the library. Positive-review replies are low-stakes drafting where instant beats perfect. Negative reviews are relationship surgery and stay human. The monitoring underneath is plain automation.",
    "afterState": "No review sits unanswered past a day. Positive ones get warm replies in minutes, negative ones get a thoughtful same-day response, and it never depends on you remembering to check."
  },
  {
    "id": "CS5",
    "categoryId": "cs",
    "name": "Complaint without a process",
    "subject": "Complaint and refund handling",
    "frequency": "Weekly",
    "automation": "Partially automatable",
    "painLine": "When something goes wrong, I panic and figure it out on the fly. Sometimes we over-refund just to make it go away. Sometimes we under-communicate and it blows up.",
    "workflow": [
      "A complaint arrives through any channel",
      "Whoever catches it has no script or policy to follow",
      "It escalates to the owner, who drops everything",
      "The investigation means checking records and asking around",
      "A resolution gets improvised: refund, credit, redo, apology",
      "The decision gets communicated over several messages",
      "Nothing gets recorded anywhere useful"
    ],
    "breakdown": [
      {
        "steps": [
          2
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "The first fix is not software. It is a written resolution policy: what gets refunded, who decides, what gets said. Everything else builds on that."
      },
      {
        "steps": [
          1,
          3
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Intake gets tagged and acknowledged within minutes, and routes by complaint type instead of defaulting to you."
      },
      {
        "steps": [
          4,
          5,
          6
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "In-policy cases (the refund under $50) resolve on rails. AI flags the messages whose tone is escalating toward a public review. The ambiguous, relationship-sensitive calls stay yours."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Complaint types and resolutions accumulate into trend data, which is how the same failure stops happening quarterly."
      }
    ],
    "aiFit": "Write the policy first; no tool can automate a decision you haven't made. After that, acknowledgment and routing are plain automation, AI watches sentiment for escalation risk, and bounded refunds can process themselves. Ambiguity keeps a human in the loop.",
    "afterState": "Every complaint gets acknowledged in minutes and follows a defined path. You handle exceptions, not everything, and the panic improvisation is replaced by a process you wrote once."
  },
  {
    "id": "CS6",
    "categoryId": "cs",
    "name": "\"Where's my order?\" (for the fourth time today)",
    "subject": "Order and job status inquiries",
    "frequency": "Daily",
    "automation": "Fully automatable",
    "painLine": "Half my support time is people asking where their thing is. I have to look it up in one system, then go back and type the answer somewhere else.",
    "workflow": [
      "A customer asks for a status update",
      "Someone looks them up by name or order number",
      "The tracking system gets opened to find the current status",
      "The answer gets typed back in the messaging platform",
      "Unchanged statuses need an explanation and a new estimate",
      "Delays raise the question of whether to say something proactively",
      "The same customer asks again in 48 hours"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          7
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Proactive milestone notifications remove the question before it gets asked. The fourth ask of the day never happens."
      },
      {
        "steps": [
          2,
          3,
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "The order system connects to the messaging layer; a self-service status link or bot answers from live data. The lookup-and-retype loop dies."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "simplify",
          "report"
        ],
        "rationale": "Delay communication becomes a rule, not a judgment call, and a delay report shows which jobs keep generating the question."
      }
    ],
    "aiFit": "Pure automation: connect the systems and let customers query live data. AI's only role would be phrasing, which is trivial. The higher-leverage move is proactive notification, which removes the inquiry entirely instead of answering it faster.",
    "afterState": "Customers hear from you at every milestone without asking. The status question largely disappears, and the team stops being a human lookup service."
  }
] as const;
