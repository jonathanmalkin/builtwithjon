export const useCases = [
  {
    "id": "HW1",
    "categoryId": "hw",
    "name": "Three no-shows before lunch",
    "subject": "Appointment reminders and no-show reduction",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "We had three no-shows before lunch and I spent the whole morning calling people who didn't pick up anyway.",
    "complianceNote": "HIPAA: appointment reminders are non-clinical, but a patient name plus an appointment time is still protected health information. Send reminders only through a platform that signs a business associate agreement (BAA), and never paste patient names or schedules into a public AI chat to \"draft messages faster.\"",
    "workflow": [
      "The evening before, tomorrow's schedule gets pulled and printed",
      "Staff call each patient to confirm, mostly reaching voicemail",
      "\"Left VM\" gets marked in the chart and the wait begins",
      "Unanswered patients get a second call in the morning",
      "The no-show happens anyway and the slot sits empty",
      "A standby patient gets scrambled for, usually too late",
      "The no-show gets logged by hand with no follow-up sequence"
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
        "rationale": "A multi-touch reminder sequence (72 hours, 24 hours, 2 hours) by text and email replaces the phone tree, with confirmations writing back to the schedule automatically."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI flags the bookings with the highest no-show risk so staff add a personal call or a deposit prompt to exactly those, not everyone."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "No-show rates by provider, day, and appointment type turn a daily annoyance into a pattern you can act on."
      }
    ],
    "aiFit": "The reminder sequence is plain automation and carries most of the value. AI's honest role is narrow: predicting which appointments deserve extra attention. The constraint that shapes everything is HIPAA, so the whole stack lives inside a compliant platform, not a clever spreadsheet.",
    "afterState": "Confirmations run themselves overnight, staff open to a dashboard of who's confirmed, and the morning phone hour goes back to patients who are actually in the building."
  },
  {
    "id": "HW2",
    "categoryId": "hw",
    "name": "The paper chase",
    "subject": "New patient intake forms",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "New patients show up five minutes early, we hand them a clipboard, and then we spend 20 minutes re-typing everything they just wrote.",
    "complianceNote": "HIPAA: intake forms carry health history, which is squarely protected health information. The forms platform must be HIPAA-compliant with a signed BAA, and any AI-generated summary of a patient's history needs clinician review before anyone relies on it.",
    "workflow": [
      "A new patient books by phone or online",
      "A PDF packet gets emailed, or the clipboard waits at the door",
      "The patient fills out paper in the waiting room",
      "Staff re-type the health history and insurance into the system",
      "Illegible handwriting surfaces as errors mid-visit",
      "Missing signatures send staff chasing the patient back down",
      "The paper gets scanned into a folder nobody can search"
    ],
    "breakdown": [
      {
        "steps": [
          2,
          3,
          4
        ],
        "dispositions": [
          "eliminate",
          "automate"
        ],
        "rationale": "Digital forms go out by text the moment the booking happens, show only the questions relevant to the visit type, and sync straight into the chart. The clipboard and the re-typing both stop existing."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "One mobile flow with built-in e-signature and required fields means nothing arrives illegible or unsigned."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "eliminate",
          "report"
        ],
        "rationale": "Structured data replaces scanned paper, and a completion report flags who hasn't finished their forms the morning of."
      }
    ],
    "aiFit": "Form delivery, conditional questions, and chart sync are plain automation. AI's useful edge is drafting plain-language rewrites of dense medical history questions, and summarizing intake answers into a pre-visit note for the provider, with clinician review as the gate. The compliance boundary, a BAA-backed platform, is non-negotiable.",
    "afterState": "Patients finish intake on their phone before they arrive, the chart is pre-filled, and the front desk greets people instead of transcribing them."
  },
  {
    "id": "HW3",
    "categoryId": "hw",
    "name": "The lost patient",
    "subject": "Recall and reactivation of lapsed patients",
    "frequency": "Weekly / Monthly",
    "automation": "Mostly automatable",
    "painLine": "I know we have hundreds of patients who haven't been in for over a year, but nobody has time to go through the list and call them all.",
    "complianceNote": "HIPAA: recall messages reference visit types and care history, which is protected health information. Run reactivation sequences only inside a compliant platform with a signed BAA, keep message content non-clinical, and never export the lapsed-patient list into outside marketing tools.",
    "workflow": [
      "Once in a while, someone exports the overdue-patient list",
      "Staff call down it when the phones are slow, which is never",
      "Most calls hit voicemail and few come back",
      "A generic postcard batch goes out once or twice a year",
      "After one call and one card, the patient is silently written off",
      "Nobody tracks who was contacted or whether they booked",
      "Reactivation never gets measured against what a new patient costs"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2,
          3
        ],
        "dispositions": [
          "eliminate",
          "automate"
        ],
        "rationale": "Lapsed patients segment themselves by time-since-visit and visit type, and a multi-touch sequence works the list on a rolling basis. The slow-afternoon call-down never happens because it never worked."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI personalizes the message to the patient's actual situation, a hygiene recall reads differently than a treatment follow-up, which is what makes the sequence outperform the postcard."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Contacts, responses, bookings, and recovered revenue get tracked, so reactivation finally competes with acquisition on real numbers."
      }
    ],
    "aiFit": "Segmentation and sequencing are plain automation. AI earns its keep on message personalization, referencing the service actually due instead of blasting \"time for your appointment.\" Everything stays non-clinical in content and BAA-covered in infrastructure.",
    "afterState": "The lapsed list works itself in the background and staff see only the replies. Patients come back because someone finally asked, specifically and more than once."
  },
  {
    "id": "HW4",
    "categoryId": "hw",
    "name": "Stars on demand",
    "subject": "Post-visit review requests",
    "frequency": "Daily",
    "automation": "Fully automatable",
    "painLine": "We have happy patients every day and almost no reviews. The one bad review from two years ago is still the first thing people see.",
    "complianceNote": "HIPAA: even confirming that someone is your patient can be a disclosure, and for therapy or mental health practices it is a sensitive one. Keep review requests free of any health detail, route unhappy feedback to a private channel instead of a public platform, and have sensitive-specialty practices clear request wording with their compliance advisor before automating.",
    "workflow": [
      "The front desk verbally asks for a Google review at checkout",
      "The patient says sure and forgets in the parking lot",
      "No follow-up goes out; the practice hopes",
      "Occasionally someone texts a link to an obviously thrilled patient",
      "A negative review appears with no response process",
      "Review volume stays flat year over year",
      "Competitors with more reviews outrank equal clinical quality"
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
        "rationale": "A review request texts itself an hour or two after the visit, when goodwill is highest, with a direct link. The verbal ask and the hoping both retire."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "simplify",
          "optimize"
        ],
        "rationale": "A one-question satisfaction check can run first: happy patients get the public link, unhappy ones reach the office manager directly. AI drafts the responses to new reviews for human approval."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Monthly volume, rating trend, and recurring themes turn reputation from a fear into a managed asset."
      }
    ],
    "aiFit": "The request engine is pure automation. AI helps draft review responses and surface recurring experience issues across months of feedback. The real design work here is compliance-shaped: what you may say publicly about a patient relationship is narrower in this vertical than any other.",
    "afterState": "Every visit generates a well-timed request, reviews accumulate steadily, and the two-year-old bad one sinks under the weight of recent, real ones."
  },
  {
    "id": "HW5",
    "categoryId": "hw",
    "name": "The seat that went cold",
    "subject": "Cancellation waitlist filling",
    "frequency": "Daily",
    "automation": "Fully automatable",
    "painLine": "Someone cancels at 9am and I spend 30 minutes calling people one by one to fill the 2pm slot. Half the time it stays empty.",
    "complianceNote": "HIPAA: a waitlist notification is just an availability message, but the patient names and appointment times behind it are protected health information. Keep the waitlist and the notifications inside the BAA-covered scheduling platform; no side spreadsheets, no group texts.",
    "workflow": [
      "The cancellation call comes in mid-morning",
      "Someone hunts for the waitlist, if one exists",
      "Candidates get called one at a time",
      "Voicemails get left and the clock runs",
      "The slot stays open or gets filled badly",
      "Nobody tracks which slots were saved or lost",
      "The canceller gets rebooked weeks out with no nudge"
    ],
    "breakdown": [
      {
        "steps": [
          2,
          3,
          4
        ],
        "dispositions": [
          "eliminate",
          "automate"
        ],
        "rationale": "The cancellation instantly notifies every matching waitlist patient at once; first to confirm gets the slot and the schedule updates itself. The phone tree dies."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "Matching can weigh appointment type, provider, and how soon the slot is, so the right patient gets the offer, not just the next name."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "The patient who cancelled gets an automatic rebooking nudge instead of disappearing into next month."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Recovery rate and fill time per slot make the cost of cancellations, and the payoff of the fix, visible."
      }
    ],
    "aiFit": "None needed for the core: cancellation fires an event, the waitlist gets texted, first reply wins. That is webhooks and rules. AI could phrase the offer message, which is trivia. This is the cleanest broadcast-and-claim story in the health vertical.",
    "afterState": "Cancelled slots refill themselves in minutes from a live waitlist. Staff find out it was handled, and the 2pm chair has someone in it."
  },
  {
    "id": "HW6",
    "categoryId": "hw",
    "name": "The phone that never stops",
    "subject": "Front-desk call overflow and after-hours coverage",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "The phone rings while I'm checking someone out, and I know that call is probably a new patient who's about to call a competitor instead.",
    "complianceNote": "HIPAA: a phone agent that captures names, birth dates, or insurance details is handling protected health information, so the platform must sign a BAA. And the agent must never give clinical advice or interpret symptoms; anything clinical routes to a human or a callback, every time.",
    "workflow": [
      "The phone rings while the desk is mid-checkout",
      "The missed call rolls to voicemail most callers won't use",
      "Voicemails get batch-returned during the next peak",
      "After-hours calls wait for the next business day",
      "The unanswered new patient calls the next practice on the list",
      "Half the staff day goes to the phone instead of the lobby",
      "Nobody measures what the missed calls were worth"
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
          "automate",
          "optimize"
        ],
        "rationale": "An AI phone agent answers around the clock: scheduling, hours, directions, refill routing, booked straight into the system. Overflow and after-hours stop being voicemail."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Staff handle the calls that need judgment, clinical questions and nervous new patients, while the lobby gets their full attention back."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Missed-call rate, call-to-booking conversion, and top call reasons show what the phone was costing and what to fix upstream."
      }
    ],
    "aiFit": "The biggest genuine AI role in this vertical: a conversational agent can handle most routine call types end to end. The boundaries make or break it: no clinical advice ever, instant human escalation, a BAA-covered platform, and a review of the agent against real call recordings before it goes live.",
    "afterState": "Every call gets answered, including the 9pm one, and bookable callers book themselves. The morning starts with a queue of appointments instead of a voicemail backlog."
  }
] as const;
