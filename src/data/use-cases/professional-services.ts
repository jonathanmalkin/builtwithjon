export const useCases = [
  {
    "id": "PS1",
    "categoryId": "ps",
    "name": "The invisible clock",
    "subject": "Time entry and billing narratives",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "I bill my time at the end of the day from memory, and I know I'm leaving 20% on the table every single day.",
    "workflow": [
      "The day runs across calls, emails, drafting, and meetings with no tracking",
      "At 6pm, the billing software opens and the day gets reconstructed from memory",
      "Narrative descriptions get written from scratch for each entry",
      "Entries get checked against each client's billing guidelines",
      "The billing coordinator reviews for obvious misses",
      "The partner rewrites narratives on the draft invoice",
      "A vague entry triggers a client dispute after the invoice lands"
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
        "rationale": "Passive capture from the calendar, sent mail, and document activity builds the day's log automatically. Reconstruction from memory, where the 20% leaks out, stops existing."
      },
      {
        "steps": [
          3
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI turns the activity log into polished, guideline-aware narrative drafts. You review and approve instead of writing from a blank line."
      },
      {
        "steps": [
          4,
          5,
          6
        ],
        "dispositions": [
          "automate",
          "simplify"
        ],
        "rationale": "Rules check entries against each client's known billing preferences before submission; partner review shrinks to the flagged exceptions."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Dispute rates by matter and narrative pattern become visible, which is how the narratives improve."
      }
    ],
    "aiFit": "The capture layer is pure integration, no AI. AI earns its place turning a structured activity log into professional narratives that match your voice and each client's guidelines, a drafting task models do well. The hard gate: you are professionally responsible for every entry billed, so the day ends with your sign-off, never an auto-send.",
    "afterState": "Time gets captured passively all day, and the end of the day is a ten-minute review of drafted entries. The hours you actually worked become the hours you actually bill."
  },
  {
    "id": "PS2",
    "categoryId": "ps",
    "name": "First impression roulette",
    "subject": "Client intake and engagement letters",
    "frequency": "Weekly (per new matter)",
    "automation": "Mostly automatable",
    "painLine": "A hot lead calls Friday afternoon, and by Tuesday when I finally get back to them with paperwork, they've hired someone else.",
    "workflow": [
      "A prospect calls and the details get jotted down by hand",
      "Someone manually searches the system for conflicts of interest",
      "A callback intake happens with notes in a personal notebook",
      "The conflict check gets rerun when new parties surface",
      "A matter gets created by copying an old one",
      "The engagement letter gets hand-edited in Word from a master template",
      "The PDF goes out by email and staff chase the signature for days"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          3
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "An online intake form captures structured details the moment a prospect reaches out, feeding the system directly instead of a notebook."
      },
      {
        "steps": [
          2,
          4,
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "The conflict check runs automatically against every party in the system, and a cleared check creates the matter from a real template."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "Intake data populates the letter; AI drafts the matter-specific scope paragraph. You review before anything goes out, an ethics requirement, not a convenience."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "automate",
          "eliminate"
        ],
        "rationale": "E-signature handles delivery, reminders, and filing the signed copy. The chase disappears."
      }
    ],
    "aiFit": "AI fits in one narrow spot: drafting the scope description from intake notes, which also surfaces the exclusions practitioners skip when writing from memory. Everything else is data routing, rule-based conflict matching, and e-signature, 80% of the win before AI enters. Professional review before send is a hard gate.",
    "afterState": "A Friday afternoon prospect fills out a form, the conflict check clears in minutes, and a drafted engagement letter is ready for your five-minute review. Paperwork goes out same-day instead of Tuesday."
  },
  {
    "id": "PS3",
    "categoryId": "ps",
    "name": "The document hostage",
    "subject": "Client document collection",
    "frequency": "Weekly",
    "automation": "Fully automatable",
    "painLine": "It's March 15th and I'm still waiting on three clients' bank statements. I've asked four times. I can't start their return.",
    "contextStat": {
      "value": "50%",
      "text": "of accounting firms report delays of several days just collecting documents from clients.",
      "source": "Financial Cents, State of Accounting Workflow and Automation Report"
    },
    "workflow": [
      "A custom document checklist gets built in Word for each engagement",
      "The checklist goes out by email with a request for attachments",
      "Partial documents trickle back in the wrong formats",
      "Each missing item gets chased by untracked email or phone call",
      "A second thread of documents creates version confusion",
      "Receipt gets marked by hand in a spreadsheet tracker",
      "The accountant finds out it's complete after moving on to another deadline"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2
        ],
        "dispositions": [
          "simplify",
          "automate"
        ],
        "rationale": "Checklist templates fire by engagement type the day the engagement opens, with a portal link instead of an attachment request."
      },
      {
        "steps": [
          3,
          4,
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Portal uploads track item by item, and reminders escalate on a set ladder (day 3, day 7, day 10 flag for a call) without staff touching it."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "eliminate",
          "automate"
        ],
        "rationale": "The spreadsheet tracker stops existing; documents file themselves and the accountant gets notified the moment the set is complete."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "A standing view of outstanding items per client shows where the season's bottleneck actually is."
      }
    ],
    "aiFit": "Zero AI, and that is the teaching point. Checklists, portals, timed reminders, and completion alerts are mature features in practice management tools today. AI could personalize the reminder wording, but that is complexity without value. Get the chase automated first; it was never a writing problem.",
    "afterState": "Clients get a portal checklist the day the engagement opens, reminders escalate on their own, and you get pinged when everything is in. The four-times ask becomes zero."
  },
  {
    "id": "PS4",
    "categoryId": "ps",
    "name": "Scope creep amnesia",
    "subject": "Scope changes and change orders",
    "frequency": "Weekly",
    "automation": "Partially automatable",
    "painLine": "The client swears we agreed to include the extra deliverable in the original price. I know we didn't. But I have no proof.",
    "workflow": [
      "The client asks for extra work in a call or a casual Slack message",
      "You do it because the conversation is harder than the work",
      "The invoice includes it and the client disputes the line",
      "Emails and notes get searched for proof that doesn't exist",
      "A discount gets negotiated to save the relationship",
      "The SOW has no exclusions list, so their reading is defensible",
      "The next engagement uses the same template and repeats the cycle"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2
        ],
        "dispositions": [
          "simplify",
          "eliminate"
        ],
        "rationale": "A standing rule, every scope addition goes through a one-page change order before work starts, is process design, not software. It removes the undocumented work entirely."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Meeting transcription (now a commodity feature in call platforms) creates a searchable record of what was actually discussed, before there is anything to dispute."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI reviews the SOW template against your past disputes and drafts an explicit exclusions section, so the template stops re-creating the problem."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Write-offs get tracked by engagement type, which turns scope creep from a feeling into a number worth fixing."
      }
    ],
    "aiFit": "This is a process discipline problem first. The change order gate is the fix, and no tool installs a habit. AI helps at the edges: transcripts as evidence, and a sharper exclusions section drafted from your dispute history. Neither matters until the gate exists.",
    "afterState": "Every scope addition has a signed change order before the work starts, and every call has a transcript. The dispute conversation stops happening because the proof exists before the invoice does."
  },
  {
    "id": "PS5",
    "categoryId": "ps",
    "name": "The blank page tax",
    "subject": "Proposal and deliverable reuse",
    "frequency": "Weekly",
    "automation": "Partially automatable",
    "painLine": "I know I've written almost this exact proposal before. I just can't find it, so I'm starting from scratch again.",
    "workflow": [
      "A new proposal or memo is needed; the search through old folders begins",
      "Twenty to sixty minutes later, the right prior example may or may not surface",
      "Writing starts from a blank page or a generic template",
      "Standard sections get retyped or pasted and hand-edited",
      "The reviewer suggests changes that already existed in a version they never saw",
      "The final lands in a personal folder where nobody will find it",
      "The firm's collective knowledge stays in individual heads"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "A shared, tagged document library is organization, not AI, and it is the prerequisite for everything else here."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "A filing rule, final deliverables save to the shared library automatically, kills the personal-folder graveyard."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI retrieves the three most relevant prior documents and drafts a starting version from their applicable sections. You refine instead of reconstruct."
      },
      {
        "steps": [
          5,
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Reviewers pull prior versions themselves, and the library becomes the firm's queryable memory instead of folklore."
      }
    ],
    "aiFit": "A genuine AI fit: retrieval over your own past work, then a first draft assembled from it, cuts a half-day task to an hour. The honest prerequisite is unglamorous: if the documents are scattered across personal folders, the AI has nothing to retrieve. Build the library first, then the AI makes it pay.",
    "afterState": "You describe the new engagement, the three closest prior documents surface with a drafted starting version, and your time goes into tailoring, not archaeology."
  },
  {
    "id": "PS6",
    "categoryId": "ps",
    "name": "The research rabbit hole",
    "subject": "Legal and regulatory research",
    "frequency": "Weekly",
    "automation": "Partially automatable",
    "painLine": "I just spent three hours reading cases to write a two-paragraph memo that any partner could have told me in five minutes.",
    "complianceNote": "Hallucinated citations: general-purpose AI chatbots fabricate case citations that look completely real, and courts have sanctioned attorneys for filing briefs built on them. Use legal-specific research tools with database verification built in, and verify every citation against the original source before anything leaves the firm. The reading help is real; the citation trust is not.",
    "workflow": [
      "A research question arrives and the database search begins",
      "Eight to fifteen cases get read in full to find the relevant holdings",
      "Secondary sources get read for doctrinal context",
      "Unstructured notes pile up, different for every researcher",
      "The memo gets drafted and citations formatted by hand",
      "Partner review spawns research on tangential issues",
      "The memo gets filed and never found again; the next matter starts from zero"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2,
          3
        ],
        "dispositions": [
          "simplify",
          "optimize"
        ],
        "rationale": "Legal-specific AI research tools surface the most relevant holdings and synthesize across cases, compressing the reading phase substantially."
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
        "rationale": "Structured, citable summaries replace ad-hoc notes, and AI produces a first draft of the memo. Citation verification stays a mandatory human step."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "A sharper scope definition up front shrinks the tangent loop. That is a conversation, not a tool."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Filed memos become retrievable firm knowledge, so the next similar question starts from the last answer."
      }
    ],
    "aiFit": "High AI fit with the sharpest caveat in this library. Reading and distilling dense text is exactly what models do well, and the compression is real: a three-hour read becomes one. But the tool class matters, legal-specific with database verification, never a general chatbot, and a human verifies every citation. The judgment and the strategy were never delegable anyway.",
    "afterState": "A verified research memo in 90 minutes instead of four hours, with AI doing the synthesis and you doing the judgment, the strategy, and the citation check."
  }
] as const;
