export const useCases = [
  {
    "id": "OP1",
    "categoryId": "op",
    "name": "The schedule that falls apart by Tuesday",
    "subject": "Staff scheduling",
    "frequency": "Weekly",
    "automation": "Mostly automatable",
    "painLine": "I spend Sunday night building the week's schedule, and by Tuesday two swaps and a call-out have turned it into fiction.",
    "workflow": [
      "Sunday night opens the spreadsheet from last week",
      "Availability notes get reconstructed from texts and memory",
      "The grid gets filled by hand around requests and skill coverage",
      "The schedule goes out as a photo in the group chat",
      "Swap requests start arriving immediately",
      "Each swap means re-checking coverage and re-sending the photo",
      "By midweek nobody is sure which version is current"
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
          "automate"
        ],
        "rationale": "A scheduling app holds availability and time-off in one place and starts each week from a template of your real staffing pattern. You adjust a draft instead of rebuilding from zero."
      },
      {
        "steps": [
          4,
          7
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "The schedule lives in the app, not in a photo. There is exactly one current version and everyone sees it."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Swaps happen in-app between qualified coworkers, with rules that protect coverage. You approve with a tap or stay out of it entirely."
      },
      {
        "steps": [],
        "dispositions": [
          "optimize",
          "report"
        ],
        "rationale": "Once history accumulates, demand patterns can suggest staffing levels. That is the optional AI layer, never the first move."
      }
    ],
    "aiFit": "The template and the in-app swap rules do most of the work, and neither is AI. AI demand forecasting is a real but later layer for businesses with traffic swings. Fix the version-control problem first; it is the one actually burning your Sundays.",
    "afterState": "The week starts from a template, swaps resolve themselves inside coverage rules, and there is always exactly one current schedule. Sunday night gets shorter and Tuesday stops being a surprise."
  },
  {
    "id": "OP2",
    "categoryId": "op",
    "name": "The 6am no-show scramble",
    "subject": "Call-out and shift coverage",
    "frequency": "Weekly",
    "automation": "Mostly automatable",
    "painLine": "Someone texts at 6am that they're sick, and I spend the next hour calling down a list while getting ready to cover the shift myself.",
    "workflow": [
      "The call-out text lands before you're out of bed",
      "You mentally rank who might be free and willing",
      "Calls and texts go out one at a time",
      "Each reply (or silence) triggers the next call",
      "Someone eventually says yes, or you cover it yourself",
      "Hours and overtime implications get sorted out later",
      "The same scramble repeats next week"
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
        "rationale": "One broadcast goes to every qualified, available person at once; the first to claim it gets the shift. The serial phone tree becomes a single parallel message."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "A standing on-call or incentive rule, decided once, replaces the morning negotiation."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "The claimed shift updates the schedule and the timesheet in the same motion, with overtime flags before approval, not after payroll."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Call-out patterns by person and day become visible, which turns a weekly emergency into a coaching conversation."
      }
    ],
    "aiFit": "None. Broadcast-and-claim is a feature in every modern scheduling tool, and it solves the whole scramble. This case earns its place in the library as proof that the right fix is often a feature you already pay for.",
    "afterState": "A call-out triggers one broadcast, the shift gets claimed in minutes, and the schedule updates itself. You find out it was handled instead of handling it."
  },
  {
    "id": "OP3",
    "categoryId": "op",
    "name": "The supply order we always forget",
    "subject": "Inventory and reordering",
    "frequency": "Weekly / Monthly",
    "automation": "Fully automatable",
    "painLine": "We ran out of the one thing we needed mid-job, again, and someone had to drive across town to buy it retail.",
    "workflow": [
      "Stock levels get noticed only when someone reaches for an empty shelf",
      "A mental or whiteboard list of \"we're low on\" accumulates",
      "Someone eventually walks the shelves before ordering",
      "Orders get placed across several supplier sites and a phone call",
      "The emergency retail run covers whatever was missed",
      "Deliveries arrive unchecked against what was ordered",
      "Nobody knows what the chaos costs"
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
          "automate"
        ],
        "rationale": "Counted items get par levels and reorder thresholds. A simple count cadence (or usage tracking in the POS or job system) replaces noticing-by-empty-shelf."
      },
      {
        "steps": [
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Hitting a threshold drafts the order with the usual supplier and quantity. You approve; it sends."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "The retail run disappears because the stockout that caused it does."
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
        "rationale": "Deliveries get checked against the order on arrival, and spend per category becomes a number instead of a feeling."
      }
    ],
    "aiFit": "Pure rules: par levels, thresholds, and reorder drafts are deterministic, and that is their virtue. AI demand prediction only matters at a scale and seasonality most small businesses never reach. Set the thresholds; skip the model.",
    "afterState": "Supplies reorder themselves before they run out. The mid-job stockout and the retail-price rescue run both become stories you tell about how it used to be."
  },
  {
    "id": "OP4",
    "categoryId": "op",
    "name": "The machine that breaks when you're slammed",
    "subject": "Equipment maintenance tracking",
    "frequency": "Monthly",
    "automation": "Mostly automatable",
    "painLine": "Nothing gets serviced until it dies, and it always dies during the busiest week of the year.",
    "workflow": [
      "Maintenance schedules live in manuals nobody has opened",
      "Service happens reactively, after the failure",
      "The repair call goes out at emergency rates",
      "Work stops or limps while you wait",
      "Repair history lives in a drawer of receipts",
      "Warranty windows expire unnoticed",
      "Replace-or-repair decisions get made with no history"
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
        "rationale": "Every asset gets a recurring service task on a calendar with an owner. The manual's schedule becomes reminders that actually fire."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Scheduled service during slow weeks replaces emergency repair during peak ones. Same maintenance, radically different price and timing."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "A photo of each receipt and service record attaches to the asset, and warranty dates get reminders before they lapse."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Cost-per-asset history makes the replace-or-repair call a calculation instead of a coin flip."
      }
    ],
    "aiFit": "The recurring task and the photo log carry almost all the value, no AI required. Predictive maintenance from sensor data is real technology for factories; for a small business, a calendar and a habit beat a model. The teaching here is timing: the fix costs the same either way, but the failure picks the worst week.",
    "afterState": "Equipment gets serviced on schedule during slow periods, every asset has a history, and the busiest week of the year stops doubling as repair season."
  },
  {
    "id": "OP5",
    "categoryId": "op",
    "name": "Everything lives in my head",
    "subject": "SOP capture and documentation",
    "frequency": "Weekly",
    "automation": "Partially automatable",
    "painLine": "If I got hit by a bus, this business would stop. Nobody else knows how half of this place actually runs.",
    "workflow": [
      "A task needs doing and only you know the steps",
      "You either do it yourself or explain it verbally, again",
      "The explanation varies a little every time",
      "Writing it down gets deferred because writing is miserable",
      "A new hire learns by shadowing for weeks",
      "You answer the same how-do-I questions on your day off",
      "Every vacation is a working vacation"
    ],
    "breakdown": [
      {
        "steps": [
          4
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "Talk through the task once while doing it; AI transcribes and structures the recording into a numbered SOP draft you edit. The writing barrier, which is the real blocker, disappears."
      },
      {
        "steps": [
          1,
          2,
          3
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Documented procedures live in one searchable place with photos. The explanation stops varying because it stops being improvised."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "New hires follow the written version and ask about exceptions, not basics. The day-off questions mostly answer themselves."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "A simple coverage list of which tasks are documented and who's trained makes the bus problem measurable, then fixable."
      }
    ],
    "aiFit": "One of the strongest genuine AI use cases in this entire library. The bottleneck was never knowledge, it was the misery of writing it down, and voice-to-structured-SOP removes exactly that. Ten minutes of talking becomes a usable draft. The editing and the judgment stay yours.",
    "afterState": "The business runs from documented procedures instead of your memory. Training shrinks from weeks of shadowing to days of guided practice, and a vacation becomes an actual vacation."
  },
  {
    "id": "OP6",
    "categoryId": "op",
    "name": "The quality that depends on who's working",
    "subject": "Checklists and quality consistency",
    "frequency": "Daily",
    "automation": "Partially automatable",
    "painLine": "When my best person is on, everything is perfect. When they're off, I get complaints. Same business, different day.",
    "workflow": [
      "Standards exist mostly as your personal taste",
      "Each shift runs on the lead's individual judgment",
      "Opening and closing happen from memory",
      "Steps get skipped under pressure, invisibly",
      "You discover the miss from a customer complaint",
      "The correction is a one-off conversation",
      "Quality stays a function of who showed up"
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
        "rationale": "Standards get written as short, specific checklists: opening, closing, job-complete. Taste becomes a list anyone can execute."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Digital checklists with timestamps and required photos replace memory. Skipping a step now leaves a visible gap instead of a silent one."
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
        "rationale": "Incomplete checklists alert you the same day, before the customer does, and completion rates by shift show where the slips cluster."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Quality stops depending on the roster because the standard travels with the checklist, not the person."
      }
    ],
    "aiFit": "Almost none, deliberately. The checklist is the technology, and the analysis of completion rates is a pivot table, not a model. If a vendor pitches AI quality monitoring before you have written checklists, they are selling the roof before the foundation.",
    "afterState": "Every shift runs the same playbook with timestamped proof. You hear about a missed step from the system that afternoon, not from a one-star review that weekend."
  }
] as const;
