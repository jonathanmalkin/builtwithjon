export const useCases = [
  {
    "id": "CC1",
    "categoryId": "cc",
    "name": "The repurposing backlog",
    "subject": "Content repurposing",
    "frequency": "Weekly",
    "automation": "Partially automatable",
    "painLine": "I have one long training and no idea where to cut it into useful content.",
    "workflow": [
      "A long recording or session is finished",
      "The raw asset gets dropped into a folder with no structure",
      "You reread notes to find the most useful moments",
      "Key clips are extracted manually from the long recording",
      "Each channel gets a different format by hand",
      "Publishing stretches across the week because one piece always slips",
      "Momentum fades and the next creation sprint starts from zero"
    ],
    "breakdown": [
      {
        "steps": [
          2,
          3
        ],
        "dispositions": [
          "eliminate",
          "simplify"
        ],
        "rationale": "A simple intake step with required labels and deadlines removes the unstructured search cycle right after each recording."
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
        "rationale": "AI extracts talking points and draft posts, while a consistent template handles channel-specific formatting without creative rewrites."
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
        "rationale": "A scheduled calendar and publish queue keep weekly cadence steady, and publishing metrics show which format actually lands."
      }
    ],
    "aiFit": "AI is strongest on first-pass repurposing: creating a first draft for clips, captions, and summaries. The workflow itself is rule-based and should be templated and predictable.",
    "afterState": "One session now produces a full seven day publish plan in minutes. No channel waits for a hero post, and the second week starts with a running pipeline."
  },
  {
    "id": "CC2",
    "categoryId": "cc",
    "name": "The welcome that isn't",
    "subject": "Client onboarding",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "I keep writing the same welcome instructions and still get the same onboarding questions.",
    "workflow": [
      "A new client books and pays",
      "You send a manual message with mixed instructions",
      "The client sends one piece of missing information at a time",
      "Documents and consent forms arrive in random channels",
      "Prep starts late because required details are incomplete",
      "Follow-up questions become support tickets during session week",
      "You lose energy on logistics and keep the core work for last"
    ],
    "breakdown": [
      {
        "steps": [
          2
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "A single onboarding packet with clear order of operations removes the need for repeated manual explanations."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "A mandatory intake flow with checkboxes, signature steps, and required uploads makes missing data visible before prep."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "eliminate",
          "simplify"
        ],
        "rationale": "Session prerequisites shift from memory to system state. If anything is missing, the workflow blocks prep instead of hoping for a follow-up."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "You can now track how often onboarding breaks down and where friction still appears."
      }
    ],
    "aiFit": "This is the no-AI anchor in the set. Most of the lift is sequence and consistency. AI can assist with tone matching, but not with the hard outcome of disciplined onboarding.",
    "afterState": "Every new client receives the same clear path before day one. Logistics questions drop, prep quality improves, and sessions start on time."
  },
  {
    "id": "CC3",
    "categoryId": "cc",
    "name": "Reading the room after the session",
    "subject": "Post-session follow-through",
    "frequency": "Weekly (per session)",
    "automation": "Mostly automatable",
    "painLine": "We solved a lot in the room, then spent the next week rediscovering what we already did.",
    "workflow": [
      "A coaching or consulting session ends with multiple actions",
      "Notes are written in one place while the next tasks stay in your head",
      "A follow-up message is drafted late or never sent",
      "Clients start tasks with wrong assumptions",
      "Some actions get skipped because no one owns them",
      "The next session repeats the same baseline reset",
      "Pattern shifts happen too slowly to compound"
    ],
    "breakdown": [
      {
        "steps": [
          2,
          3
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "AI can produce a first-pass session summary and task list, but your template must enforce owner and due date fields."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "simplify",
          "eliminate"
        ],
        "rationale": "Tasks with accountable owners and explicit deadlines remove repeated interpretation and repeated check-ins."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "A rolling completion report shows which workflows are still failing after each client review."
      }
    ],
    "aiFit": "AI helps compress the session notes into crisp action drafts. Ownership logic, reminders, and accountability are non-AI decisions and must stay explicit.",
    "afterState": "Every session leaves a clear action map. You stop coaching the same issue repeatedly and start coaching progress instead."
  },
  {
    "id": "CC4",
    "categoryId": "cc",
    "name": "Launch week brain melt",
    "subject": "Launch coordination",
    "frequency": "Monthly",
    "automation": "Mostly automatable",
    "painLine": "The launch looks ready at 8pm and falls apart by 10pm.",
    "workflow": [
      "A launch date is set six days out",
      "Content, assets, and links are collected in disconnected places",
      "The checklist is a private notebook and never the source of truth",
      "Stakeholders request updates and changes at the last minute",
      "Publication timing breaks, one platform misses specs or posting windows",
      "Support asks rise as audience confusion appears",
      "After launch, results are not reviewed in one place"
    ],
    "breakdown": [
      {
        "steps": [
          2,
          3
        ],
        "dispositions": [
          "simplify",
          "eliminate"
        ],
        "rationale": "A single launch template with required assets and version status replaces ad hoc prep."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "A queue that locks publishing order and validates assets prevents late rewrites and platform misses."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI support messages for likely questions reduce your support load while preserving your brand voice."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "Launch telemetry on response timing, conversion, and traffic reveals which lane is your next bottleneck."
      }
    ],
    "aiFit": "AI can draft launch reminders and first-pass updates, but the reliable result comes from disciplined sequencing, gating criteria, and checklists.",
    "afterState": "Launch week runs on a stable rail. Assets are complete earlier, posts publish on time, and support traffic drops during the first 24 hours."
  },
  {
    "id": "CC5",
    "categoryId": "cc",
    "name": "The praise that never made it to the page",
    "subject": "Testimonial capture",
    "frequency": "Weekly",
    "automation": "Mostly automatable",
    "painLine": "Clients are thrilled, but we still have almost no usable proof.",
    "workflow": [
      "A client shares positive feedback in a call or message",
      "You ask for permission and wait for a callback",
      "Audio, text, and chat snippets stay scattered",
      "The testimonial is manually rewritten and loses emotional detail",
      "Placement in the right funnel stage is decided after the fact",
      "Consents are not archived consistently",
      "The social proof system never shows momentum"
    ],
    "breakdown": [
      {
        "steps": [
          2,
          3
        ],
        "dispositions": [
          "simplify",
          "eliminate"
        ],
        "rationale": "Collect permission and attribution in one standardized flow at the moment praise appears."
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
        "rationale": "A shared repository and channel-specific placement rules keep proof reusable without rewriting everything each week."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Consent status becomes a system field that blocks publishing without the required checkbox."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "A simple dashboard shows testimonial inventory by offer and by month."
      }
    ],
    "aiFit": "AI can propose shorter quote versions and usage ideas, but you must keep the source content and consent workflow manual and explicit.",
    "afterState": "Every praise moment becomes reusable proof. Client confidence increases because you celebrate outcomes fast and consistently."
  },
  {
    "id": "CC6",
    "categoryId": "cc",
    "name": "The insight graveyard",
    "subject": "Knowledge capture",
    "frequency": "Daily",
    "automation": "Partially automatable",
    "painLine": "Great ideas are generated every week, and most of them are gone by next quarter.",
    "workflow": [
      "An insight appears in a call, workshop, or group session",
      "You write a partial note without context",
      "Ideas are stored in separate systems",
      "No one knows which insight to reuse next",
      "The same lesson is delivered repeatedly in slightly different forms",
      "Execution slows because ownership is split across channels",
      "Reusable patterns never become reusable products"
    ],
    "breakdown": [
      {
        "steps": [
          2,
          3
        ],
        "dispositions": [
          "simplify",
          "automate"
        ],
        "rationale": "A single capture form tags each insight with problem, audience, and outcome before context is lost."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "eliminate",
          "optimize"
        ],
        "rationale": "AI can suggest where a captured insight might be reused, while you control the strategy decisions."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "A searchable pattern log proves which insights became offers, assets, and client outcomes."
      }
    ],
    "aiFit": "AI has a clear role in indexing, pattern grouping, and first-pass clustering. Your competitive edge remains your judgment in which insight becomes a paid step.",
    "afterState": "Captured insights become a living library. Repetition drops, your offers get richer over time, and your prep never starts from zero."
  }
] as const;
