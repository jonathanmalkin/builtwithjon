export const useCases = [
  {
    "id": "HR1",
    "categoryId": "hr",
    "name": "The blank page before the first hire",
    "subject": "Job postings and distribution",
    "frequency": "Per opening",
    "automation": "Mostly automatable",
    "painLine": "I spent two hours writing a job description and I'm still not sure I got it right. The last one brought in a hundred people who were completely wrong for the role.",
    "workflow": [
      "A role is needed; a blank document opens",
      "You try to reconstruct what the job actually involves day to day",
      "Other companies' postings get googled and loosely copied",
      "The duties list grows past the point of usefulness",
      "Job boards get chosen and accounts created by hand",
      "The posting gets pasted and reformatted board by board",
      "The required salary field gets a guess"
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
          "optimize"
        ],
        "rationale": "A short intake (role, hours, must-haves, pay range, what good looks like) feeds an AI draft in 90 seconds. You edit a draft instead of fighting a blank page."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Multi-board distribution is plain automation through an ATS. Paste-and-reformat is not a hiring skill."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "A real pay range, decided once with market data, beats a guess typed under deadline."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "Applicant quality per posting becomes visible, which is how the next posting gets sharper."
      }
    ],
    "aiFit": "Drafting a posting from structured answers is exactly the kind of writing AI does well, and the output is easy to review. Distribution is plain automation. Note the boundary: AI drafts the listing here; it screens nobody, so the bias risk lives downstream, not in this step.",
    "afterState": "You answer a short form, edit one draft, and the posting goes everywhere at once. Two hours becomes twenty minutes, and the posting actually describes the job."
  },
  {
    "id": "HR2",
    "categoryId": "hr",
    "name": "The resume avalanche",
    "subject": "First-pass applicant screening",
    "frequency": "Per opening",
    "automation": "Partially automatable",
    "painLine": "I posted the job Monday and by Friday I had 140 applications. I don't have time to read all of these but I'm terrified of missing the right person.",
    "contextStat": {
      "value": "3%",
      "text": "of applicants get an interview; the average employer reviews 33 to find one worth talking to.",
      "source": "CareerPlug, Recruiting Metrics Report"
    },
    "complianceNote": "EEOC and bias: AI ranking of candidates is the highest-risk step in the hiring funnel. Independent tests keep finding demographic bias in AI resume screeners, and employers stay liable even when the tool belongs to a vendor. Use written, job-related knockout criteria applied identically to everyone, keep a human on every rejection, and audit any AI screening tool for disparate impact before trusting it.",
    "workflow": [
      "Applications pour in across email, Indeed, and LinkedIn",
      "Each resume gets opened and skimmed by hand",
      "A rough yes/no/maybe pile forms in a spreadsheet",
      "Who has been contacted gets lost track of",
      "Early applicants go cold while you're still reading",
      "The criteria from Monday drift by Friday",
      "Resume number 60 gets judged by a tired brain"
    ],
    "breakdown": [
      {
        "steps": [
          1
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Every application routes into one tracking system. Three inboxes become one list."
      },
      {
        "steps": [
          2,
          3
        ],
        "dispositions": [
          "simplify",
          "automate"
        ],
        "rationale": "Written knockout questions (the certification, the schedule, the lifting requirement) filter the pool before any human reads a resume. That is structure, not AI, and it cuts the pile by more than half."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Status tracking and same-day acknowledgments keep candidates warm while you work the short list."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "optimize",
          "report"
        ],
        "rationale": "AI may summarize the remaining resumes for faster reading. Rankings, rejections, and the final call stay human, against criteria that are written down."
      }
    ],
    "aiFit": "The honest answer: the big win is structured knockout questions, not AI. AI summarization speeds the reading; AI ranking is where the legal risk concentrates. If the avalanche is the problem, structure solves most of it before any model gets involved.",
    "afterState": "Knockout questions shrink 140 applications to a pre-qualified short list. You read 30 resumes instead of 140, against criteria you wrote when you were fresh, and first contact happens in hours instead of days."
  },
  {
    "id": "HR3",
    "categoryId": "hr",
    "name": "The calendar ping-pong",
    "subject": "Interview scheduling",
    "frequency": "Per hire",
    "automation": "Fully automatable",
    "painLine": "I sent three time options, she came back with none of those work, I sent three more, then she ghosted me for four days.",
    "contextStat": {
      "value": "83.5",
      "text": "days is the average time-to-hire for small and midsize companies. Days of it are calendar back-and-forth.",
      "source": "SHRM, Recruiting Benchmarking Report"
    },
    "workflow": [
      "You decide to interview a candidate",
      "An email proposes two or three slots",
      "None work, or the chosen one conflicts",
      "New times get proposed; the wait restarts",
      "Confirmation eventually lands",
      "The day-before reminder gets sent by hand",
      "Repeat per candidate, with the occasional double-booking"
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
        "rationale": "A booking link with your available windows replaces the entire negotiation. Candidates self-schedule in five minutes."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Confirmations and reminders send themselves."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "eliminate",
          "report"
        ],
        "rationale": "Double-bookings become impossible, and the pipeline view shows who's scheduled, who's pending, and who's gone quiet."
      }
    ],
    "aiFit": "None, and that is the lesson. This is the clearest \"automation beats AI\" case in the hiring category: a cheap scheduling link erases the whole pain. Reach for the calendar tool before you reach for the chatbot.",
    "afterState": "Candidates book themselves into your real availability. The three-day email loop becomes a five-minute self-service step, and your time-to-hire stops bleeding days to logistics."
  },
  {
    "id": "HR4",
    "categoryId": "hr",
    "name": "The paperwork pile-on",
    "subject": "Offers and onboarding paperwork",
    "frequency": "Per hire",
    "automation": "Fully automatable",
    "painLine": "Every time I hire someone I'm printing forms, tracking down signatures, scanning things, and hoping I got the I-9 right. And I hired three people last month.",
    "workflow": [
      "The offer letter gets typed fresh or edited from last year's file",
      "It goes out for signature by email or on paper",
      "Day one is a stack of forms: I-9, W-4, direct deposit, handbook",
      "The new hire fills out paper while the job waits",
      "Forms get scanned and emailed to payroll",
      "Originals go in a physical folder",
      "The three-day I-9 deadline is tracked in your head, or not at all"
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
        "rationale": "Offer letters merge from a template with the hire's details and go out for e-signature in one click."
      },
      {
        "steps": [
          3,
          4,
          5,
          6
        ],
        "dispositions": [
          "eliminate",
          "automate"
        ],
        "rationale": "Digital onboarding collects every form from the new hire's phone before day one, and the data flows to payroll without a scanner involved."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "automate",
          "report"
        ],
        "rationale": "Compliance deadlines track themselves with escalating reminders. Hope is not a compliance system."
      }
    ],
    "aiFit": "No AI anywhere: this is mature, inexpensive document automation built into every major HR and payroll tool. The compliance stakes (I-9 fines start in the hundreds per form) make this worth fixing before any AI conversation happens.",
    "afterState": "You approve a pre-filled offer with one click, the new hire finishes every form from their phone before day one, and day one is about the job instead of the clipboard."
  },
  {
    "id": "HR5",
    "categoryId": "hr",
    "name": "The PTO guessing game",
    "subject": "Time-off tracking and requests",
    "frequency": "Weekly",
    "automation": "Fully automatable",
    "painLine": "Every Monday someone asks me how many vacation days they have left and I have to go find the spreadsheet.",
    "workflow": [
      "An employee asks you directly about their balance",
      "The spreadsheet gets opened and the row gets found",
      "Accruals get calculated by hand",
      "The time-off request arrives verbally or by text",
      "You check whether that week is already thin",
      "Approval happens by text with no record",
      "The spreadsheet update happens days later, or never"
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
        "rationale": "Employees see their own live balance in the app. The Monday question stops being asked because the answer is self-serve."
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
        "rationale": "Requests route through an approval flow that shows you the staffing picture for that week, and every decision leaves a record."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "eliminate",
          "report"
        ],
        "rationale": "There is no spreadsheet to update. Balances, accruals, and history maintain themselves."
      }
    ],
    "aiFit": "None. This is the purest \"buy the tool before you build the bot\" case in the library: an AI chatbot answering PTO questions is a fun demo, but an inexpensive HR tool solves it with an audit trail. The feature already exists; use it.",
    "afterState": "Balances are self-serve, requests carry their own approval trail, and the records are always current. The Monday morning text disappears entirely."
  },
  {
    "id": "HR6",
    "categoryId": "hr",
    "name": "The annual review that never happens",
    "subject": "Performance check-ins",
    "frequency": "Quarterly",
    "automation": "Partially automatable",
    "painLine": "I know I should be doing reviews but every time I think about it I don't have notes and I don't know what to say, so I keep pushing it off.",
    "workflow": [
      "A mental intention forms to do reviews \"this quarter\"",
      "No reminder fires; the quarter ends",
      "The eventual review runs entirely on recent memory",
      "Each employee gets a different format, improvised",
      "Feedback stays verbal and undocumented",
      "A promotion or termination conversation arrives with no paper trail",
      "Employees quietly wonder where they stand"
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
        "rationale": "The cadence runs on reminders and self-serve scheduling, not intention. Check-ins happen because the system fires, not because you remembered."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "simplify",
          "optimize"
        ],
        "rationale": "A repeatable form with the same questions every time, plus an AI draft that turns your bullet-point observations into a coherent written summary you edit."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Every check-in leaves a documented trail, which is what makes the eventual hard conversation fair and defensible."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Predictable check-ins replace ambient uncertainty. People know where they stand because someone tells them on schedule."
      }
    ],
    "aiFit": "AI is the writing assistant for an owner who avoids the blank page: three bullet observations in, a structured summary out, edited by you. The cadence and scheduling are plain automation. The conversation itself never delegates.",
    "afterState": "Check-ins happen on a schedule with ten minutes of prep, every employee has a written trail, and the review you kept pushing off becomes a routine you barely notice."
  }
] as const;
