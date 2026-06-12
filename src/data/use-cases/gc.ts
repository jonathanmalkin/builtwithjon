export const useCases = [
  {
    "id": "G1",
    "categoryId": "gc",
    "name": "Bid week",
    "subject": "Takeoffs and estimating",
    "frequency": "Weekly",
    "automation": "Partially automatable",
    "painLine": "The ITB came Tuesday. The bid’s due Friday. The plans are 50 pages. There are three other bids due Friday.",
    "workflow": [
      "Invitation to bid arrives with a plan set and a tight deadline",
      "Estimator (often the owner, at night) reads every sheet",
      "Manual takeoff: measuring, counting, calculating quantities for hours or days",
      "Pricing hunted from supplier emails, old quotes, and memory",
      "Labor estimated from gut feel and a past job that was \"kind of like this one\"",
      "Assemble the bid in a spreadsheet; check the math at midnight",
      "Submit and immediately start the next one",
      "Lose track of which bids are outstanding and never hear back on half"
    ],
    "breakdown": [
      {
        "steps": [
          3
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI takeoff tools now read plan sets and produce quantity counts in minutes; the estimator reviews flagged uncertainties instead of counting outlets by hand. This is the most mature AI application in construction."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "A maintained cost database (your real costs from past jobs) replaces supplier-email archaeology."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "Estimates referenced against your actual historical job costs, what this work really took last time."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Templated bid assembly from the takeoff and price data; math checks itself."
      },
      {
        "steps": [
          8
        ],
        "dispositions": [
          "automate",
          "report"
        ],
        "rationale": "A bid log with automatic follow-ups on outstanding bids; hit rate by job type, GC, and size, so you stop bidding work you never win."
      },
      {
        "steps": [
          2
        ],
        "dispositions": [],
        "human": true,
        "rationale": "Stays human. Judgment about site conditions, risk, and whether you want the job is the job."
      }
    ],
    "aiFit": "Plan reading and quantity takeoff (genuinely transformative, vendors report order-of-magnitude time reductions, which you should verify on your own plans), scope-gap flagging, historical cost comparison. Bid logs and follow-ups are plain automation.",
    "afterState": "You bid more work with the same people, your numbers come from your own history instead of midnight guesses, and you know your hit rate, so you bid smarter, not just more."
  },
  {
    "id": "G2",
    "categoryId": "gc",
    "name": "\"Any update on our bid?\"",
    "subject": "Proposal follow-up and pre-construction",
    "frequency": "Weekly",
    "automation": "Mostly automatable",
    "painLine": "We spent 30 hours on that estimate and then forgot to call them back.",
    "workflow": [
      "Bid submitted; mental note to follow up",
      "New fires erupt; the note evaporates",
      "The client had questions but didn’t want to bother you; they asked the other bidder instead",
      "Weeks later you learn you lost, no idea why, or to what number",
      "Won jobs: contract back-and-forth drags by email",
      "Deposit invoicing and scheduling start late because \"signed\" surprised everyone",
      "The handoff from estimating to the field loses half the assumptions in the estimate"
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
        "rationale": "Submitted bids enter a pipeline with scheduled follow-ups (day 2, 7, 14), same machinery as any sales pipeline, almost never used in construction."
      },
      {
        "steps": [
          3
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "A follow-up that invites questions, AI-drafted to reference specifics of their project, keeps you in the conversation."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Win/loss tracking with reasons. Even partial data changes how you price."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "E-signature with reminders; the signed contract auto-triggers step 6."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Signature triggers deposit invoice, schedule slot, and a welcome packet to the client."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "A structured estimate-to-field handoff sheet, assumptions, exclusions, allowances, generated from the bid itself."
      }
    ],
    "aiFit": "Drafting context-aware follow-ups and turning estimate data into a field-ready brief. The pipeline, e-sign, and trigger chain are plain automation.",
    "afterState": "No bid dies of silence. Signed contracts kick off the job machinery the same hour, and the crew starts with the estimator’s actual assumptions in hand."
  },
  {
    "id": "G3",
    "categoryId": "gc",
    "name": "The handshake that cost $12,000",
    "subject": "Change orders",
    "frequency": "Weekly (active jobs)",
    "automation": "Partially automatable",
    "painLine": "We did the extra work. We just never got it in writing. You know how this ends.",
    "contextStat": {
      "value": null,
      "text": "Change order management consistently ranks among GCs’ top administrative pain points, manual logs, scattered email approvals, and surprise costs from subs’ unsubmitted change order requests.",
      "source": "Clearstory, industry reporting"
    },
    "workflow": [
      "Client asks for \"one small change\" verbally, on-site",
      "Crew says sure and does it, schedule pressure beats paperwork",
      "The cost impact is never priced or communicated",
      "Sub change-order requests pile up in email, unlogged",
      "At billing time, the extras appear; the client is shocked",
      "You negotiate from memory against their memory",
      "You eat some or all of it to save the relationship",
      "Multiply by every job, forever"
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
        "rationale": "A field-first capture habit: photo + voice note on the spot. AI turns the voice note into a written change order with scope and price from your rate sheet, ready to send before you leave the driveway."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "One intake channel for sub CORs feeding a live log; nothing lives in email threads."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "No work proceeds without e-signed approval, the system makes the right way the easy way (approval link by text, signed in 60 seconds)."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "The negotiation-from-memory step shouldn’t exist. Signed scope + timestamped photos ends the argument before it starts."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "Change order volume and margin by job and client, often the difference between a profitable year and a confusing one."
      }
    ],
    "aiFit": "Voice-to-change-order drafting, pricing from your historical data, extracting CORs from sub emails into the log. E-signature and the approval gate are plain automation.",
    "afterState": "Every change is priced, signed, and billed, captured in two minutes at the truck instead of disputed in an hour at billing. Most contractors find this single workflow pays for their entire automation effort."
  },
  {
    "id": "G4",
    "categoryId": "gc",
    "name": "Herding subs",
    "subject": "Subcontractor scheduling and coordination",
    "frequency": "Daily",
    "automation": "Partially automatable",
    "painLine": "The drywaller showed up. The electrician hadn’t finished. Now I owe two apologies and a day.",
    "workflow": [
      "Build the schedule in your head, a whiteboard, or a spreadsheet",
      "Call/text each sub individually with their dates",
      "A delay hits (weather, inspection, materials)",
      "Manually re-call/re-text every downstream sub, in dependency order, from memory",
      "Someone gets missed; they show up to an unready site",
      "Sub availability conflicts surface day-of instead of week-before",
      "Docs (insurance certs, W-9s, signed subcontracts) chased separately, repeatedly",
      "Nobody can say what’s happening on which job without calling around"
    ],
    "breakdown": [
      {
        "steps": [
          1
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "One shared schedule with dependencies, visible to everyone who needs it."
      },
      {
        "steps": [
          2,
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "A date change cascades: every affected sub gets notified automatically with their new window, and confirms with one tap."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "A symptom of manual fan-out. Dies with it."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Subs confirm or flag conflicts when notified, days early, not at the curb."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Document tracking with expiration alerts; subs can’t be scheduled with lapsed insurance."
      },
      {
        "steps": [
          8
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "A live board of every job’s state, who’s on site, what’s next, what’s blocked."
      }
    ],
    "aiFit": "Suggesting re-sequencing when delays hit and summarizing schedule state (\"what changed this week across all jobs\"). The notification cascades and doc tracking are plain automation.",
    "afterState": "A delay means one schedule edit, not an afternoon of phone calls. Subs trust your dates because your dates are real, and that reputation gets you better subs."
  },
  {
    "id": "G5",
    "categoryId": "gc",
    "name": "The permit purgatory",
    "subject": "Permits and inspections",
    "frequency": "Weekly (active jobs)",
    "automation": "Partially automatable",
    "painLine": "The job didn’t stall because of the work. It stalled because nobody re-checked the portal on Thursday.",
    "workflow": [
      "Figure out which permits this job needs (memory + the city’s confusing website)",
      "Assemble applications, drawings, and forms; submit",
      "Wait, with no visibility; check the portal when you happen to remember",
      "Corrections come back; sit unnoticed in an inbox for days",
      "Schedule inspections by phone within narrow windows",
      "Inspector finds an issue; the fix and re-inspection add an unplanned week",
      "The client asks why nothing’s happening; you don’t have a crisp answer",
      "Final/closeout permits slip, delaying occupancy and final payment"
    ],
    "breakdown": [
      {
        "steps": [
          1
        ],
        "dispositions": [
          "simplify",
          "optimize"
        ],
        "rationale": "A permit checklist per job type for your jurisdictions; AI helps build and update it from municipal requirements."
      },
      {
        "steps": [
          2
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI pre-fills repetitive application data from the job record; a human verifies."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Status checks on a schedule with alerts on any change, corrections get same-day attention instead of week-late discovery."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Inspection requests tied to schedule milestones; reminders to have the site inspection-ready."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Permit status visible on the client’s update feed (see G6), \"waiting on the city\" lands better when they can see it."
      },
      {
        "steps": [
          8
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Closeout checklist triggered automatically as the job nears completion."
      }
    ],
    "aiFit": "Form pre-fill, requirement research, deadline extraction from correction letters. Status monitoring and reminders are plain automation. Honest caveat: municipal portals vary wildly; some allow clean automation, some require a human clicking. Audit your actual jurisdictions.",
    "afterState": "Permits stop being the invisible schedule-killer. Corrections get answered in hours, inspections book themselves against the schedule, and \"waiting on the city\" comes with a date."
  },
  {
    "id": "G6",
    "categoryId": "gc",
    "name": "\"Just checking in on the project…\"",
    "subject": "Client updates and photo documentation",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "Every client call that starts with ‘just checking in’ means my update system already failed.",
    "workflow": [
      "Crew takes photos all day, they live and die on personal phones",
      "The client texts/calls for updates whenever anxiety strikes",
      "You answer the same questions per-client, per-week, from memory",
      "The weekly update you intend to send goes out sporadically",
      "A dispute arises (\"that wall was supposed to be…\") and the photographic proof is on a phone that left the company in March",
      "Daily logs, weather, crew, work done, are skipped or scribbled",
      "At closeout, assembling the documentation story takes days"
    ],
    "breakdown": [
      {
        "steps": [
          1
        ],
        "dispositions": [
          "simplify",
          "automate"
        ],
        "rationale": "Photos go to a shared, job-tagged stream (one habit change), auto-organized by date and job."
      },
      {
        "steps": [
          2,
          3,
          4
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "A scheduled weekly client update, AI-drafted from the week’s photos, schedule changes, and logs, you approve in two minutes. Proactive updates kill 80% of inbound \"checking in\" calls."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "The photo stream is the evidence locker: timestamped, job-tagged, owned by the company."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "Voice-note daily logs, AI-transcribed and structured (weather, crew, work, issues), 60 seconds at the truck."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Closeout documentation assembles itself from the stream."
      }
    ],
    "aiFit": "Drafting client updates from raw site data, transcribing and structuring voice logs, even captioning photos. Photo organization and scheduled sends are plain automation.",
    "afterState": "Clients feel informed instead of ignored, your referral engine, quietly. And when a dispute comes, you’re the one with timestamps."
  },
  {
    "id": "G7",
    "categoryId": "gc",
    "name": "The last 2%",
    "subject": "Punch lists and closeout",
    "frequency": "Per job",
    "automation": "Mostly automatable",
    "painLine": "98% done in March. 100% done in June. Final payment in August.",
    "workflow": [
      "Walkthrough produces a punch list on a legal pad or a long text thread",
      "Items get verbally assigned to subs who have mentally moved on",
      "No one tracks which items are actually done",
      "The client adds items in dribbles by text, restarting the loop",
      "Final inspection waits on stragglers nobody’s chasing",
      "Closeout docs, warranties, manuals, as-builts, final lien waivers, get assembled in a panicked scavenger hunt",
      "Final payment (often 10%+ of contract, most of your margin) waits on all of the above"
    ],
    "breakdown": [
      {
        "steps": [
          1
        ],
        "dispositions": [
          "simplify",
          "optimize"
        ],
        "rationale": "Punch items captured as photos + voice notes during the walk; AI turns the walk into a structured, itemized list before you reach the car."
      },
      {
        "steps": [
          2,
          3
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Items auto-assigned to the responsible sub with photos and deadlines; reminders escalate; completion requires a photo back."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Client additions go through one channel into the same list, visible, bounded, done."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "The closeout package builds throughout the job (every warranty and manual filed on arrival), not at the end."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "A live \"what’s between us and final payment\" view, for you and the client. Shared visibility creates shared urgency."
      }
    ],
    "aiFit": "Walkthrough-to-list structuring, doc gathering and gap-flagging. Assignment, reminders, and photo-verification loops are plain automation.",
    "afterState": "The 98%-to-100% gap shrinks from months to days. Final payments, your margin, arrive while the job is still warm."
  },
  {
    "id": "G8",
    "categoryId": "gc",
    "name": "Getting paid for built work",
    "subject": "Invoicing, pay apps, and lien waivers",
    "frequency": "Monthly",
    "automation": "Mostly automatable",
    "painLine": "We financed our client’s project for 60 days and called it normal.",
    "contextStat": {
      "value": "30–45+ days",
      "text": "Construction has among the longest payment delays of any U.S. industry, receivables routinely stretch past terms. For a GC, slow paper directly equals slow cash.",
      "source": "Industry AR research"
    },
    "workflow": [
      "Month-end: assemble the pay app / invoice from memory, spreadsheets, and the schedule of values",
      "Collect sub pay apps in inconsistent formats; check their math by hand",
      "Chase missing lien waivers from subs and suppliers, calls, emails, re-sends",
      "Compile the billing package; one missing waiver stalls the whole submission",
      "Submit; wait; no visibility into approval status",
      "Payment arrives short or late; reconciling what was paid against what was billed takes hours",
      "Your subs call asking where their money is; you relay uncertainty downward",
      "Repeat monthly, on every job, simultaneously"
    ],
    "breakdown": [
      {
        "steps": [
          1
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "The pay app builds from live job data, percent complete, approved change orders, stored materials, against a locked schedule of values."
      },
      {
        "steps": [
          2
        ],
        "dispositions": [
          "simplify",
          "automate"
        ],
        "rationale": "Subs submit through one standardized channel; math validates automatically."
      },
      {
        "steps": [
          3
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "Waiver requests generate with each billing cycle, tracked with automatic reminders; AI flags wrong amounts, dates, or unsigned waivers on receipt."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "A live checklist shows exactly what’s blocking submission, days early."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Status tracking and payment-to-billing matching; discrepancies flagged, not discovered."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Subs see their own payment status, the calls stop."
      }
    ],
    "aiFit": "Document checking (waivers, sub pay apps), discrepancy detection, extracting data from whatever PDF format a sub invents. The assembly, reminders, and status tracking are plain automation.",
    "afterState": "Billing day becomes an approval, not an assembly. Packages go out complete and on time, which is the single most controllable lever on when you get paid, and your subs stop calling because they can see for themselves."
  }
] as const;
