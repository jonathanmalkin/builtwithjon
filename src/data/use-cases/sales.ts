export const useCases = [
  {
    "id": "S1",
    "categoryId": "sales",
    "name": "The lead that got away",
    "subject": "Responding to new inquiries",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "They filled out our form Tuesday night. We called Thursday. They’d already hired someone.",
    "contextStat": {
      "value": "~44%",
      "text": "of leads are generated outside business hours, nearly half arrive when no one is watching the inbox.",
      "source": "Lead-response industry research"
    },
    "workflow": [
      "A lead submits a form / calls / DMs, often after hours",
      "The inquiry lands in an inbox nobody’s watching",
      "Someone notices it the next morning (or after the weekend)",
      "They try to figure out if it’s a real prospect or spam",
      "They reply with a generic \"thanks, we’ll be in touch\"",
      "Phone tag begins",
      "By the time contact happens, the lead has called three competitors"
    ],
    "breakdown": [
      {
        "steps": [
          2
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Leads should never land in a personal inbox. They land in a pipeline, with an alert."
      },
      {
        "steps": [
          3,
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Instant acknowledgment by text and email, within one minute, 24/7, with a real next step: a booking link or 2–3 qualifying questions."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "AI scores and tags the inquiry (real/spam, service type, urgency) from the message content."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "The booking link kills phone tag for most leads."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Track speed-to-first-touch. Most owners are shocked by their real number."
      }
    ],
    "aiFit": "Reading the inquiry, qualifying it, and drafting a personal-sounding first response. The instant alerting and booking links are plain automation.",
    "afterState": "Every lead gets a real response in under a minute, including the 10pm Saturday ones. You walk into Monday with calls already booked instead of a pile of cold inquiries."
  },
  {
    "id": "S2",
    "categoryId": "sales",
    "name": "Sorting suspects from prospects",
    "subject": "Lead qualification",
    "frequency": "Daily",
    "automation": "Partially automatable",
    "painLine": "I spent 40 minutes on the phone with someone whose budget was a tenth of our minimum.",
    "workflow": [
      "A new lead appears with one line of context",
      "You google them; check their website and socials",
      "You email back-and-forth gathering basics (budget, timeline, scope)",
      "You book a call to learn what an intake form could have told you",
      "Half the calls are bad fits; you politely run out the clock",
      "The good fits get inconsistent next steps depending on who handled them",
      "Nobody records why the bad fits were bad"
    ],
    "breakdown": [
      {
        "steps": [
          2
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Enrichment, AI pulls and summarizes public info about the lead before you ever look."
      },
      {
        "steps": [
          3
        ],
        "dispositions": [
          "simplify",
          "automate"
        ],
        "rationale": "A short intake form or an AI chat that asks your qualifying questions conversationally, at point of inquiry."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "The 40-minute discovery call with a non-fit shouldn’t happen. Disqualify before the calendar, not on it."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Qualified leads enter one defined path: same questions, same follow-up, same materials."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Disqualification reasons accumulate into real market intelligence, and better marketing targeting."
      }
    ],
    "aiFit": "Conversational intake, lead research summaries, and scoring against your historical wins. The forms and routing are plain automation.",
    "afterState": "You only get on calls with people who fit. Your close rate \"improves\", really, your calendar just stopped lying to you."
  },
  {
    "id": "S3",
    "categoryId": "sales",
    "name": "The follow-up you meant to send",
    "subject": "Nurture and persistence",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "We lose more deals to silence than to competitors.",
    "workflow": [
      "A promising conversation happens; they say \"let me think about it\"",
      "You make a mental note to follow up",
      "A week of fires later, the note is gone",
      "You remember at an awkward time (their invoice is in front of you, or you see them on LinkedIn)",
      "You send a \"just checking in!\" with nothing new to say",
      "Silence; you feel weird sending another",
      "Months later they buy, from whoever happened to follow up that week"
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
        "rationale": "Every open conversation gets a next-touch date the moment it goes quiet. The system remembers so you don’t have to."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI drafts follow-ups with actual substance, referencing their stated problem, sharing a relevant example, instead of \"checking in.\""
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "A defined cadence (e.g., day 3, 10, 25, then quarterly) removes the social guesswork. Most sales require five-plus touches; most owners stop at one or two."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "See exactly where deals stall and how many touches your real wins took."
      }
    ],
    "aiFit": "Drafting personalized, context-aware follow-ups at scale and suggesting when to reach out based on signals. The scheduling and sequencing are plain automation.",
    "afterState": "Nobody goes quiet by accident. The \"let me think about it\" pile becomes a managed pipeline, and deals close that would have evaporated."
  },
  {
    "id": "S4",
    "categoryId": "sales",
    "name": "The quote that took a week",
    "subject": "Proposals and estimates",
    "frequency": "Weekly",
    "automation": "Partially automatable",
    "painLine": "Every proposal starts with ‘find the last one like it and change the names.’ Sometimes we miss a name.",
    "workflow": [
      "A prospect asks for a quote",
      "You hunt for a similar past proposal to copy",
      "You manually swap names, numbers, scope (and occasionally miss one, mortifying)",
      "You rebuild pricing in a spreadsheet from memory and supplier emails",
      "Internal review by whoever’s available",
      "Export to PDF, attach, send, hope",
      "No idea if they even opened it",
      "Follow-up happens if someone remembers (see S3)"
    ],
    "breakdown": [
      {
        "steps": [
          2,
          3
        ],
        "dispositions": [
          "simplify",
          "optimize"
        ],
        "rationale": "Templated proposals with locked structure; AI drafts the custom sections (situation summary, recommended approach) from your call notes."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "A maintained price book replaces archaeology. Update it once, every quote inherits it."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Web-based proposals with e-acceptance and payment/deposit built in."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report",
          "automate"
        ],
        "rationale": "Open and view tracking; an alert when they’re reading it is the perfect moment to call."
      },
      {
        "steps": [
          8
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Unviewed and unsigned proposals trigger their own reminder sequence."
      }
    ],
    "aiFit": "Drafting the narrative sections from discovery notes and flagging inconsistencies (wrong client name, math that doesn’t add up). Templates, e-sign, and tracking are plain automation.",
    "afterState": "Quotes go out in hours, not days, and speed wins deals by itself. You know who’s reading what, and follow-up runs without willpower."
  },
  {
    "id": "S5",
    "categoryId": "sales",
    "name": "Feeding the CRM",
    "subject": "Data entry and pipeline hygiene",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "We bought a CRM. It’s a very expensive list of people we met in 2024.",
    "workflow": [
      "Calls, emails, and meetings happen all day",
      "Logging them is a manual chore, so it mostly doesn’t happen",
      "Deal stages go stale; the pipeline shows deals that died months ago",
      "Contact info rots, people change jobs, numbers change",
      "Before any review, someone spends hours \"cleaning up the CRM\"",
      "Forecasts get built on this fiction",
      "Eventually everyone quietly goes back to spreadsheets"
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
        "rationale": "Email and calendar sync logs touchpoints automatically; call recordings transcribe and attach themselves; AI writes the call summary into the record."
      },
      {
        "steps": [
          3
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI flags stale deals (\"no activity in 30 days, close it or touch it?\") instead of waiting for the quarterly purge."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Enrichment services keep contact data current."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Cleanup parties exist because logging is manual. Fix the input, the cleanup disappears."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "With honest data, the pipeline report becomes the most useful page in the business."
      }
    ],
    "aiFit": "Call summarization, activity-to-record matching, stale-deal detection, next-step suggestions. The syncing is plain automation.",
    "afterState": "The CRM fills itself in. For the first time, the pipeline you look at and the pipeline that exists are the same pipeline."
  },
  {
    "id": "S6",
    "categoryId": "sales",
    "name": "The empty chair",
    "subject": "Appointments, reminders, and no-shows",
    "frequency": "Daily",
    "automation": "Fully automatable",
    "painLine": "A no-show doesn’t just waste the slot. It wastes the prep, the drive, and the lead.",
    "workflow": [
      "Appointment gets booked (often via the email tennis in A3)",
      "Confirmation maybe goes out, maybe doesn’t",
      "No reminder, the customer’s life moves on",
      "Day-of: no-show, or a \"wait, that was today?\"",
      "You text them manually; reschedule from scratch",
      "The slot dies empty; revenue with it",
      "Repeat offenders face no consequence and keep booking"
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
        "rationale": "Confirmation at booking; reminders at 24h and 1–2h by text (texts get read; emails get archived). Include reschedule link."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "A no-show triggers an immediate \"want to rebook?\" message while the intent is still warm."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Cancellations open the slot to a waitlist automatically."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Deposits or card-on-file for repeat offenders, policy, not technology."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "No-show rate by day, type, and source. You’ll find patterns you can act on."
      }
    ],
    "aiFit": "Honestly, barely, this is nearly all plain automation, and that’s the point. It’s cheap, proven, and pays for itself in the first week.",
    "afterState": "No-shows drop hard (text reminders routinely cut them by a third or more in service businesses). Your calendar fills with people who actually arrive."
  },
  {
    "id": "S7",
    "categoryId": "sales",
    "name": "\"How’s the pipeline?\"",
    "subject": "Sales reporting and forecasting",
    "frequency": "Weekly / Monthly",
    "automation": "Mostly automatable",
    "painLine": "Our forecast is a feeling I have on Sunday nights.",
    "workflow": [
      "Owner wants to know how the month looks",
      "Someone exports data from the CRM (or assembles it from memory and sticky notes)",
      "Hours in a spreadsheet making numbers agree",
      "The result is stale by the time it’s read",
      "Decisions get made on gut anyway",
      "Marketing spend continues with no idea which source produces actual revenue",
      "Next month, rebuild the whole thing"
    ],
    "breakdown": [
      {
        "steps": [
          2,
          3,
          4,
          7
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "A live dashboard fed directly from the pipeline: deals by stage, weighted value, win rate, average deal size, speed-to-lead."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI narrates the numbers in plain English, \"you’re behind pace because lead volume dropped, not close rate\", and flags anomalies."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Source-to-revenue tracking finally answers \"is the ad spend working?\""
      },
      {
        "steps": [
          1
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "A weekly digest lands in your inbox; you ask follow-up questions instead of commissioning a report."
      }
    ],
    "aiFit": "Turning charts into explanations, spotting anomalies, answering \"why\" questions about the data. The dashboarding is plain automation.",
    "afterState": "You know your numbers Monday morning without anyone touching a spreadsheet. Forecasts become arithmetic instead of vibes."
  }
] as const;
