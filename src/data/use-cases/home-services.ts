export const useCases = [
  {
    "id": "HS1",
    "categoryId": "hs",
    "name": "The phone that never sleeps",
    "subject": "After-hours and overflow call capture",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "I'm under a house at 2pm and the phone rings four times. By the time I surface, that customer already called the guy down the street.",
    "contextStat": {
      "value": "62%",
      "text": "of calls to home-service businesses go unanswered, and most callers who hit voicemail never call back.",
      "source": "Housecall Pro, missed-call research"
    },
    "workflow": [
      "A customer calls with an emergency, often after hours or while every tech is on a job",
      "Nobody can answer; the call rolls to voicemail",
      "Most callers hang up and dial the next company on the list",
      "Voicemails pile up until the end of the day",
      "Someone calls back blind to figure out what the job actually is",
      "The job finally gets entered and confirmed, hours after the customer first called"
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
        "rationale": "Structured 24/7 intake (an answering service, a form, or an AI receptionist) captures name, address, issue, and urgency the moment the call lands. The miss never happens."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "eliminate",
          "simplify"
        ],
        "rationale": "Voicemail review disappears. The owner works a prioritized queue with the details already captured instead of cold-calling back blind."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Job records and confirmation texts generate themselves from the intake data."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "Calls captured, response times, and booked-versus-lost, visible by week for the first time."
      }
    ],
    "aiFit": "The genuine AI moment is urgency triage: telling \"my heat is out and it's 12 degrees\" from \"I'd like a tune-up sometime\" takes language understanding, not a phone menu. Everything else, intake, logging, confirmations, is plain automation. Start with structured voicemail-to-text and auto-reply; add conversational AI only when call volume justifies it.",
    "afterState": "Every call is captured and triaged in under a minute, even the 2am ones. You wake up to a sorted queue with addresses and urgency labels instead of a row of voicemails."
  },
  {
    "id": "HS2",
    "categoryId": "hs",
    "name": "Napkin to invoice",
    "subject": "Field notes to billable invoices",
    "frequency": "Daily",
    "automation": "Partially automatable",
    "painLine": "My tech writes three lines on a work order. I have to call him to figure out what he actually did before I can invoice.",
    "workflow": [
      "The tech finishes the job and scribbles a few lines about what was done",
      "The notes are shorthand only the tech understands",
      "The work order lands at the office as a photo, a text, or a crumpled page",
      "Office staff decipher the notes and build the invoice line by line",
      "Parts get cross-checked against supply receipts",
      "The invoice finally goes out days after the job",
      "The customer calls with questions about vague line items"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "A structured job-close form (system, symptom, diagnosis, parts, hours) or a 30-second voice note replaces the napkin. The tech can't mark the job complete without it."
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
        "rationale": "The invoice assembles itself from structured job data and a price book; parts reconcile against purchase orders."
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
        "rationale": "Invoices go out at job close with plain-English line items, and the ones that stall get flagged instead of forgotten."
      }
    ],
    "aiFit": "Voice-to-invoice is the honest AI win: the tech talks through the job and AI turns rambling speech into structured line items. But a structured mobile form gets you 80% of the benefit with no AI at all. The price-book math is plain automation either way.",
    "afterState": "The tech talks for 30 seconds at job close. A clean, itemized invoice is in the customer's inbox before the truck leaves the driveway."
  },
  {
    "id": "HS3",
    "categoryId": "hs",
    "name": "The slow follow-up",
    "subject": "Estimate follow-up after the site visit",
    "frequency": "Daily / Weekly",
    "automation": "Mostly automatable",
    "painLine": "I sent the quote, heard nothing for a week, and by the time I followed up they'd already hired someone else.",
    "workflow": [
      "An estimate goes out after the site visit",
      "Silence for 48 hours",
      "You make a mental note to follow up at some point",
      "The follow-up happens days later, by phone, from memory",
      "Still nothing; the quote gets mentally written off",
      "Months later you find a pile of unconverted quotes nobody touched"
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
        "rationale": "The mental-note system goes away. Sending the estimate starts the follow-up cadence automatically."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "A 48-hour text with a one-click accept link, then a day-7 touch with a different angle. AI drafts the nudge with real context, the specific system quoted, the season, financing, instead of \"just checking in.\""
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "A weekly view of open quotes and close rate by job type replaces the surprise pile."
      }
    ],
    "aiFit": "Timing and delivery are plain automation. AI earns its spot writing the nudge: a follow-up that mentions the quoted heat pump and the cold snap forecast this weekend outperforms a static template.",
    "afterState": "Every estimate chases itself. You see open quotes and close rates weekly, and jobs stop quietly defecting to whoever called back first."
  },
  {
    "id": "HS4",
    "categoryId": "hs",
    "name": "The lapsed member",
    "subject": "Maintenance agreement renewals",
    "frequency": "Monthly",
    "automation": "Mostly automatable",
    "painLine": "I signed up 200 people for a maintenance plan. I couldn't tell you which ones expired or who hasn't paid in three months.",
    "workflow": [
      "A customer joins the maintenance plan after a service call",
      "The agreement lands in a spreadsheet, a CRM, or a binder",
      "The renewal date approaches and nothing flags it",
      "The agreement lapses without a word to the customer",
      "You discover the lapse a quarter later, or when they call with a breakdown",
      "Staff phone lapsed members; some already signed with a competitor"
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
        "rationale": "Enrollment creates the renewal record and visit schedule; 60-day and 30-day reminders fire on their own."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Default to auto-renew with a clear cancellation window. The quiet lapse stops existing."
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
        "rationale": "A standing view of active, expiring, and at-risk agreements replaces the quarterly archaeology, and lapsed accounts get a re-engagement sequence instead of an awkward cold call."
      }
    ],
    "aiFit": "Renewal tracking is pure automation. AI helps decide which lapsed members are worth chasing first, based on system age and job history, and writes outreach that names their actual equipment. Add that only after the plain automation is running.",
    "afterState": "No agreement lapses quietly. Renewals run on cadence and you get a weekly snapshot of the membership base with the revenue at stake."
  },
  {
    "id": "HS5",
    "categoryId": "hs",
    "name": "The comeback call",
    "subject": "Callback prevention and tracking",
    "frequency": "Daily",
    "automation": "Partially automatable",
    "painLine": "My tech was back at the same house three days later for something he should have caught the first time. That's a free truck roll eating my margin.",
    "workflow": [
      "A tech closes a job with no structured pre-close check",
      "An adjacent issue sits there unflagged: no readings, no photos, no walkthrough",
      "The customer calls back days later with the same problem",
      "A new job gets created; the tech returns for free",
      "Labor, fuel, and a lost slot come out of your margin",
      "Nobody tracks why, so the pattern repeats across the team"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "A required pre-close checklist on the tech's phone: readings, findings, photos, customer signoff, before the job can close."
      },
      {
        "steps": [
          3
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "A 48-hour check-in text catches problems while they're still a conversation instead of a callback."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Callbacks auto-link to the original job and get tagged as warranty returns, so the cost is visible instead of buried."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Callback rate by tech, job type, and season turns anecdotes into a coaching conversation with data."
      }
    ],
    "aiFit": "Checklists and check-in texts are plain automation. The honest AI case is pattern detection across hundreds of job notes: which unit types, which techs, which fixes keep coming back. No human reads all of that; AI can.",
    "afterState": "Callbacks drop toward the top-performer range and the ones that remain teach you something. The free truck rolls stop being invisible."
  },
  {
    "id": "HS6",
    "categoryId": "hs",
    "name": "Prove it happened",
    "subject": "Job documentation and review generation",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "Customer called disputing the bill, said we never replaced the part. I had nothing to show them. No photos, no notes, just my word.",
    "contextStat": {
      "value": "68%",
      "text": "of homeowners expect photo or video proof of completed work.",
      "source": "Housecall Pro, Customer Service Trends Report"
    },
    "workflow": [
      "The tech finishes the work and explains it at the door",
      "No before or after photos get taken",
      "The invoice goes out with generic line items and no proof",
      "The customer disputes a charge or forgets what was done",
      "You eat the charge to avoid the fight",
      "Nobody asks for a review, and the good jobs evaporate"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "Before and after photos become a required step in the job-close flow, captured in seconds on the phone already in the tech's pocket."
      },
      {
        "steps": [
          3
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Photos and a plain-English summary attach to every invoice automatically."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Most disputes never start when the proof arrives with the bill; the rest end with one attachment."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate",
          "report"
        ],
        "rationale": "A review request fires 24 hours after job close with a direct link, and a monthly report shows the rating climb."
      }
    ],
    "aiFit": "Photo capture and review requests are plain automation. AI writes the customer-facing summary from the tech's structured notes: what was replaced, what the photos show, what spec the system runs at now. Readable output from structured input, with the tech's data as ground truth, exactly what AI is for.",
    "afterState": "Every invoice ships with visual proof and a summary a homeowner actually understands. Disputes fade, reviews accumulate, and your word stops being the only evidence."
  }
] as const;
