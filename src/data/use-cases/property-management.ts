export const useCases = [
  {
    "id": "PM1",
    "categoryId": "pm",
    "name": "The 11pm leak text",
    "subject": "Maintenance triage and dispatch",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "I get a maintenance text at 11pm with a blurry photo and no idea if it's an emergency or a squeaky hinge.",
    "workflow": [
      "A tenant texts or calls with a complaint, usually without useful detail",
      "You try to judge urgency from a vague description or a blurry photo",
      "You ring one or two vendors to check availability and price",
      "You text the tenant an estimated arrival window",
      "The vendor finishes; you follow up to confirm it's actually fixed",
      "You log the repair and cost for accounting, eventually",
      "If the vendor was busy, the whole loop starts over"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2
        ],
        "dispositions": [
          "simplify",
          "optimize"
        ],
        "rationale": "A structured intake form captures category, photo, and urgency up front, and AI classifies the free-text description (\"water coming through the ceiling\") more reliably than a pick-list alone."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Routine requests dispatch to pre-approved vendors by category, with status texts to the tenant at every step. You stop being the switchboard."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "automate",
          "report"
        ],
        "rationale": "Resolution confirmations and cost records create themselves, and a maintenance log per unit appears for the first time."
      }
    ],
    "aiFit": "The triage classification is the honest AI moment: free-text plus a photo into an urgency level and a vendor category. Everything after classification is plain dispatch automation. Most landlords need the triage piece, not an enterprise AI platform.",
    "afterState": "The tenant submits through a portal, the right vendor gets dispatched, and everyone gets status texts, all without you touching your phone at 11pm."
  },
  {
    "id": "PM2",
    "categoryId": "pm",
    "name": "The application stack",
    "subject": "Tenant screening and applications",
    "frequency": "Per vacancy",
    "automation": "Mostly automatable",
    "painLine": "I have seven applications for one unit and I'm spending a whole weekend manually verifying income and running reports.",
    "complianceNote": "Fair Housing: screening criteria must be written down, objective, and applied identically to every applicant. AI may parse documents; it must never infer or weigh protected-class characteristics. Adverse action notices follow your state's requirements. Have an attorney review the criteria once.",
    "workflow": [
      "Applications arrive by email, text, and paper",
      "You check each one for completeness by hand",
      "Background and credit checks get ordered one at a time",
      "You verify employment and income by calling employers and squinting at pay stubs",
      "Applicants get compared against a mental checklist with no consistent scoring",
      "Rejection notices go out worded differently every time",
      "One applicant gets approved and lease signing starts manually"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2,
          3
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "One application flow collects everything, orders the checks, and flags incomplete files without you in the loop."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI parses uploaded pay stubs and bank statements that don't follow a fixed format; the income-to-rent math is plain rules."
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
        "rationale": "The mental checklist becomes written, objective criteria applied identically to everyone, and adverse action notices generate from templates that meet state requirements."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Approval triggers the lease packet and signature flow."
      }
    ],
    "aiFit": "Rules do the scoring; AI's narrow job is reading messy income documents. Documented objective criteria applied consistently by a system reduce Fair Housing risk compared to weekend gut calls. The final approval stays human.",
    "afterState": "Applications arrive complete, verified, and scored against the same written criteria. Your weekend comes back, and your screening file is the defense, not the liability."
  },
  {
    "id": "PM3",
    "categoryId": "pm",
    "name": "The renewal silence",
    "subject": "Lease renewals",
    "frequency": "Monthly",
    "automation": "Mostly automatable",
    "painLine": "I realize a tenant's lease expired two weeks ago because I forgot to send a renewal notice and now I have no leverage.",
    "workflow": [
      "Lease expirations live in memory and a calendar reminder",
      "You hunt for units expiring in the next 60 to 90 days",
      "You call or email the tenant to gauge renewal interest",
      "You work out a new rent number from market rates",
      "You draft the renewal letter or addendum by hand",
      "Weeks pass without a response; you follow up when you remember",
      "A surprise vacate sends you scrambling into turnover"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Lease end dates are structured data. A 90/60/30-day outreach ladder fires on its own; missed expirations stop existing as a failure category."
      },
      {
        "steps": [
          3,
          5,
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Outreach, the renewal offer document, and the follow-up cadence generate from the lease record. Non-responses get flagged for your call."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "A market-rate comparison drafts the number and the letter; you adjust for the tenant you actually know."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "A rolling renewal pipeline shows exposure 90 days out instead of two weeks late."
      }
    ],
    "aiFit": "Plain automation solves the core problem; the dates were always structured data. AI adds a light touch drafting different renewal letters for a strong-history tenant versus a rocky one. This one does not need AI to be effective.",
    "afterState": "Every tenant hears from you 90 days out, then 60, then 30. You negotiate from leverage, and turnover becomes a planned event instead of a surprise."
  },
  {
    "id": "PM4",
    "categoryId": "pm",
    "name": "The monthly rent chase",
    "subject": "Rent collection and late notices",
    "frequency": "Monthly",
    "automation": "Fully automatable",
    "painLine": "Every month I'm manually texting people to pay rent and then feeling like a bad guy when I have to charge them a late fee.",
    "workflow": [
      "Rent is due on the 1st; you watch the bank account to see who paid",
      "You text the stragglers on the 3rd or the 5th",
      "Excuses and partial payments get negotiated ad hoc",
      "You work out who owes late fees by hand",
      "Late notices go out, worded differently each time",
      "Fees get logged in a spreadsheet",
      "By the 10th, the pay-or-quit process starts manually"
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
        "rationale": "Autopay plus automatic reminders (three days before, day of) removes the two biggest causes of late rent: friction and forgetting. Watching the bank account stops being a job."
      },
      {
        "steps": [
          4,
          5,
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Fee calculation, posting, and the notice ladder follow a published rule tree. Every tenant gets the same sequence."
      },
      {
        "steps": [
          3,
          7
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Your judgment enters only for payment plans and escalations, with the routine cycle already handled."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "Collection rate, days-late trends, and fee history per unit, visible at a glance."
      }
    ],
    "aiFit": "No AI anywhere in this one. A due date is known, a payment posts or it doesn't, and the notices follow rules. The hidden win: when the system sends the notice, you stop being the bad guy, and the relationship survives the late fee.",
    "afterState": "Reminders, notices, and fees run on a published schedule. Tenants get consistency, you get your evenings back, and disputes drop because nothing is personal anymore."
  },
  {
    "id": "PM5",
    "categoryId": "pm",
    "name": "The walk-through paper chase",
    "subject": "Move-in and move-out inspections",
    "frequency": "Per tenant turn",
    "automation": "Mostly automatable",
    "painLine": "Six months later my tenant is disputing the security deposit and I can't find the photos from move-in day.",
    "workflow": [
      "Move-in inspection happens on a paper checklist",
      "Photos live on your phone, unorganized and effectively untimestamped",
      "The signed checklist goes into a folder, or wherever folders go",
      "Twelve months later the move-out walk happens the same way",
      "You compare conditions from memory and paper",
      "Deductions and the disposition letter get worked out by hand",
      "The tenant disputes, and you can't produce organized evidence"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2,
          3
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "A mobile inspection flow with required photos, timestamps, and signatures replaces paper. The walk still happens; the documentation becomes automatic."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Inspections trigger from lease dates, and the move-in versus move-out comparison report assembles itself."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "The disposition letter drafts from the comparison data; AI turns structured findings into readable condition notes."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Most disputes die when a timestamped, photo-backed record shows up. The rest are decided by it."
      }
    ],
    "aiFit": "Scheduling, forms, and reports are plain automation. AI's useful sliver is writing readable comments from structured inspection responses and flagging where move-out differs meaningfully from move-in. Some tools even let the tenant run the inspection flow themselves.",
    "afterState": "Every turn produces a timestamped, photo-backed record without a binder in sight. The deposit conversation starts from evidence instead of memory."
  },
  {
    "id": "PM6",
    "categoryId": "pm",
    "name": "The monthly owner report nobody wants to write",
    "subject": "Owner statements and reporting",
    "frequency": "Monthly",
    "automation": "Fully automatable",
    "painLine": "I manage 12 units for three different owners and assembling their monthly reports takes me an entire morning every month.",
    "workflow": [
      "Rent roll data comes out of the bank account or a spreadsheet",
      "Maintenance invoices get pulled and categorized by hand",
      "Net income per property gets calculated manually",
      "A formatted statement gets built in Word or Excel for each owner",
      "You write a short narrative on issues and vacancies",
      "Each owner gets a separate email with their attachment",
      "Owners reply with line-item questions you answer one by one"
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
          "automate"
        ],
        "rationale": "Transactions categorize themselves and per-owner statements generate as PDFs. The assembly morning disappears."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI drafts the narrative from the numbers: units with maintenance events, total spend, vacancy. Structured facts in, readable summary out."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "automate",
          "report"
        ],
        "rationale": "Delivery runs on the same day every month in the same format, which trains owners to read it and cuts the question volume."
      }
    ],
    "aiFit": "Report generation from structured financial data is plain automation. The narrative summary is the right-sized AI job: no fabrication risk because every input is a known number. Your review drops to ten minutes.",
    "afterState": "Owners get a consistent, professional statement on the same day every month, untouched by your hands. The morning you used to lose comes back twelve times a year."
  }
] as const;
