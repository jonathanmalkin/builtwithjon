export const useCases = [
  {
    "id": "A1",
    "categoryId": "admin",
    "name": "\"Where are we on that?\"",
    "subject": "Status updates and check-ins",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "Half my day is asking people what they’re doing and telling other people what those people said.",
    "workflow": [
      "Owner remembers a project exists and wonders about its status",
      "Sends a text/Slack/email asking for an update",
      "Waits; sends a follow-up nudge",
      "Employee stops real work to write up where things stand",
      "Owner relays a summary to the client or another team member",
      "Weekly status meeting re-covers everything already discussed",
      "Someone writes meeting notes nobody reads",
      "Repeat next week"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2,
          3
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "If task state lived in one visible place, the question never gets asked. The ask-and-wait loop is pure waste."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Status derives from activity, tasks moved, files updated, hours logged, instead of being hand-written."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI drafts the client-facing summary from the raw activity; the owner skims and sends."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Status meetings shrink to decision meetings; the \"what happened\" portion is a pre-read."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "AI meeting notes with action items, auto-assigned."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "A live dashboard of every project’s state, the first time many owners have ever had one."
      }
    ],
    "aiFit": "Turning raw activity (task changes, messages, commits, photos) into readable human summaries is genuinely AI work. The underlying tracking is plain software.",
    "afterState": "You glance at one screen each morning instead of running an interrogation. Status meetings get 30 minutes back. Clients get a polished weekly update you spent 90 seconds approving."
  },
  {
    "id": "A2",
    "categoryId": "admin",
    "name": "The inbox that runs your day",
    "subject": "Email triage",
    "frequency": "Daily",
    "automation": "Partially automatable",
    "painLine": "I open email to send one thing and lose an hour.",
    "workflow": [
      "Open inbox to 60+ unread messages",
      "Skim everything to find the urgent ones",
      "Answer the same five questions you answered last week (hours, pricing, \"did you get my…\")",
      "Forward things to the right person with a one-line note",
      "Flag things to deal with later; later never comes",
      "Dig through old threads for an attachment someone needs",
      "Repeat after lunch, and again at 9pm"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "AI triage sorts by what actually needs you: client, money, fire, FYI."
      },
      {
        "steps": [
          3
        ],
        "dispositions": [
          "eliminate",
          "automate"
        ],
        "rationale": "A real FAQ page and auto-replies kill the repeats; AI drafts answers to the rest from your past replies."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Routing rules (\"anything with ‘invoice’ goes to bookkeeping\") plus AI for the ambiguous ones."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Flagged emails become tasks with owners and dates, not a guilt pile."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Attachments auto-file to the right project folder on arrival."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "Response-time and volume trends, find out which client generates 40% of your email."
      }
    ],
    "aiFit": "Reading intent, drafting replies in your voice, deciding what’s urgent. Folder rules and auto-filing are plain automation.",
    "afterState": "You process the inbox twice a day in 20 minutes. Drafts are waiting for the messages that matter. The 9pm session disappears."
  },
  {
    "id": "A3",
    "categoryId": "admin",
    "name": "Calendar Tetris",
    "subject": "Scheduling meetings and appointments",
    "frequency": "Daily",
    "automation": "Fully automatable",
    "painLine": "It took eleven emails to book a thirty-minute call.",
    "workflow": [
      "Someone asks to meet",
      "You propose three times by email",
      "None work; they counter-propose",
      "Two more rounds of back-and-forth",
      "You manually create the calendar invite and video link",
      "Day-of, someone forgets; you reschedule and start over",
      "After the meeting, you type up what was agreed (or don’t)"
    ],
    "breakdown": [
      {
        "steps": [
          2,
          3,
          4,
          5
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "A booking link with your live availability replaces the entire negotiation. This is the single most solved problem in small business operations."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Confirmation plus reminder texts/emails at 24h and 1h. No-show rates drop measurably."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI transcription and summary; you edit the action items instead of reconstructing the meeting from memory."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "See how much of your week meetings actually consume, by type and by client."
      }
    ],
    "aiFit": "Meeting notes and action-item extraction. The booking itself is plain (and cheap) automation.",
    "afterState": "\"Here’s my link\" replaces eleven emails. Reminders cut no-shows. Every meeting ends with notes you didn’t write."
  },
  {
    "id": "A4",
    "categoryId": "admin",
    "name": "The request black hole",
    "subject": "Task intake and assignment",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "Requests come in by text, email, phone, and hallway. Some of them get done.",
    "workflow": [
      "A request arrives in one of six channels",
      "The receiver mentally notes it (or screenshots it, or stars it)",
      "It gets verbally relayed, losing detail",
      "Someone decides who should do it, usually whoever’s nearest",
      "The requester follows up days later asking what happened",
      "The team scrambles; nobody can find the original details",
      "It gets done late, or twice, or never"
    ],
    "breakdown": [
      {
        "steps": [
          1
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "One intake path (a form, a shared inbox, a dedicated channel). Requests can arrive anywhere, but they live in one place."
      },
      {
        "steps": [
          2,
          3
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Every request becomes a tracked task automatically, AI extracts the who/what/when from a forwarded email or voicemail transcript."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Routing rules by request type; AI handles the ambiguous ones with a suggested owner."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "The requester gets automatic status updates (\"received,\" \"scheduled,\" \"done\")."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "These steps are symptoms. Fix intake and they vanish."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "Volume by request type, time-to-done, who’s overloaded, visible for the first time."
      }
    ],
    "aiFit": "Reading unstructured requests (emails, voicemails, texts) and turning them into structured tasks. The tracking and routing is plain automation.",
    "afterState": "Nothing falls through. The phrase \"I never saw that\" leaves your vocabulary. You can see Tuesday’s workload on Monday."
  },
  {
    "id": "A5",
    "categoryId": "admin",
    "name": "Groundhog Day work",
    "subject": "Recurring tasks and checklists",
    "frequency": "Weekly / Monthly",
    "automation": "Mostly automatable",
    "painLine": "Every month we reinvent a process we’ve done fifty times.",
    "workflow": [
      "A recurring obligation comes due (monthly invoicing, payroll prep, license renewal, equipment maintenance, quarterly filings)",
      "Someone remembers, or doesn’t, usually triggered by a near-miss",
      "They reconstruct the steps from memory or an old email",
      "They chase the inputs (numbers, approvals, documents) from other people",
      "They do the work",
      "They forget to note anything for next time",
      "Next month, repeat from scratch, with a different person doing it differently"
    ],
    "breakdown": [
      {
        "steps": [
          2
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Recurring tasks generate themselves on schedule, assigned, with deadlines."
      },
      {
        "steps": [
          3
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "A written checklist/SOP, attached to the task. AI can draft the first version by interviewing whoever does it today."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Input requests go out automatically days before; reminders escalate."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "For document-heavy steps (assembling a report, reconciling a list), AI does the first pass."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Completion history builds itself; misses and bottlenecks become visible."
      }
    ],
    "aiFit": "Drafting SOPs from a recorded walkthrough, doing first-pass document assembly. The scheduling and reminders are plain automation.",
    "afterState": "The recurring stuff runs like a train schedule. Anyone can cover for anyone, because the process lives in the checklist, not in someone’s head."
  },
  {
    "id": "A6",
    "categoryId": "admin",
    "name": "\"It’s in the email… somewhere\"",
    "subject": "Documents and files",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "We have the contract. On three devices. In four versions. Which one is signed?",
    "workflow": [
      "A document is created, or arrives by email, text, or paper",
      "It gets saved wherever the recipient happened to be (desktop, downloads, phone, a drawer)",
      "Someone else needs it and asks around",
      "Twenty minutes of searching across email, drives, and group chats",
      "The wrong version gets used; rework follows",
      "For signatures: print, sign, scan, email, repeat for each signer",
      "Renewal and expiration dates pass unnoticed"
    ],
    "breakdown": [
      {
        "steps": [
          2
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "One filing structure, named conventions, single source of truth. Boring. Transformational."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "Auto-filing of inbound attachments by client/project; AI-powered search that finds \"the signed Henderson contract\" by meaning, not filename."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Live shared docs instead of attachment ping-pong."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "E-signature with automatic routing, reminders, and filing of the executed copy."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "AI extracts key dates (expirations, renewals, deadlines) from contracts on arrival and creates calendar reminders."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "A register of every active contract, value, and renewal date."
      }
    ],
    "aiFit": "Reading documents, extracting dates, amounts, parties, obligations, and semantic search. Filing rules and e-sign flows are plain automation.",
    "afterState": "Any document, found in ten seconds, latest version guaranteed. Renewals never ambush you again."
  },
  {
    "id": "A7",
    "categoryId": "admin",
    "name": "Typing the same thing twice",
    "subject": "Data entry between systems",
    "frequency": "Daily / Weekly",
    "automation": "Fully automatable",
    "painLine": "We enter every job into the calendar, the spreadsheet, the invoice tool, and QuickBooks. Four times. With typos.",
    "workflow": [
      "Information is born somewhere (a form, a phone call, a sale)",
      "Someone types it into System A",
      "Later, someone re-types it into System B (and C, and the spreadsheet)",
      "The copies drift apart, a changed phone number updates in one place",
      "An error surfaces downstream (wrong address on an invoice)",
      "Someone burns an afternoon reconciling which version is right",
      "Monthly: manual export-import gymnastics for the accountant"
    ],
    "breakdown": [
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "This is the textbook case. Connect the systems; data entered once flows everywhere. No-code connectors handle most common tool pairs."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Reconciliation exists because of double entry. Kill the cause."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Scheduled syncs replace export-import rituals."
      },
      {
        "steps": [
          2
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "For unstructured inputs (a photographed business card, a voicemail, a PDF), AI does the extraction and a human confirms."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "With one source of truth, cross-system reporting becomes possible at all."
      }
    ],
    "aiFit": "Extracting structured data from messy inputs, PDFs, photos, voicemails, free-text emails. System-to-system syncing is plain automation and has been for years.",
    "afterState": "Enter it once. It’s everywhere, correct, instantly. The reconciliation afternoon becomes a coffee break."
  },
  {
    "id": "A8",
    "categoryId": "admin",
    "name": "Chasing your own money",
    "subject": "Overdue invoices",
    "frequency": "Weekly",
    "automation": "Mostly automatable",
    "painLine": "I did the work. Now I have a second unpaid job: collections.",
    "contextStat": {
      "value": "56%",
      "text": "of U.S. small businesses report being owed money on unpaid invoices, averaging about $17,500 per business. Roughly half of businesses spend over four hours a week on receivables tasks.",
      "source": "QuickBooks, 2025; Chaser"
    },
    "workflow": [
      "Finish the work; mean to invoice \"this week\"",
      "Build the invoice manually days later",
      "Send it; hear nothing",
      "Notice it’s overdue while doing something else",
      "Agonize over the wording of a polite nudge",
      "Send reminder #1; then #2, slightly less polite",
      "Make the awkward phone call",
      "Payment arrives by check; manually record and reconcile it"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Invoice generates from the completed job/timesheet data the day the work closes. The single biggest lever on getting paid faster is invoicing faster."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Aging is tracked by software, not by anxiety."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "A scheduled reminder sequence (day 1, 7, 14, 30) with escalating firmness; AI personalizes tone for the relationship. Businesses using AR automation get paid significantly faster (Chaser)."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "The call still happens for the stubborn 5%, but with the full history in front of you."
      },
      {
        "steps": [
          8
        ],
        "dispositions": [
          "simplify",
          "automate"
        ],
        "rationale": "Online payment links on every invoice; auto-reconciliation on payment."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "A live aging report and average-days-to-paid by client. Fire your worst payers with data."
      }
    ],
    "aiFit": "Tone-matched reminder drafting and flagging which accounts need a human call. The sequences, payment links, and reconciliation are plain automation.",
    "afterState": "Invoices go out same-day. Reminders send themselves while you sleep. Your average collection time drops by weeks, and cash flow stops being a monthly mystery."
  }
] as const;
