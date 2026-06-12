export const useCases = [
  {
    "id": "RE1",
    "categoryId": "re",
    "name": "The database full of maybes",
    "subject": "Long-timeline lead nurture",
    "frequency": "Weekly",
    "automation": "Mostly automatable",
    "painLine": "I have hundreds of people in my CRM who asked about buying two years ago, and I have no idea who's ready now.",
    "workflow": [
      "A new lead lands from a portal, the website, or an open house sign-in",
      "A few manual follow-up emails go out over two to four weeks, then activity stops",
      "The lead goes cold with no scheduled touch or re-engagement sequence",
      "Months later you remember them and dig through email for context",
      "A one-off check-in goes out, hoping the timing is right",
      "Nothing flags it when the lead quietly re-engages with your listings",
      "The agent who stayed in touch earns the transaction"
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
        "rationale": "Every lead enters a nurture sequence bucketed by timeline, running 24 months or more without agent effort."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "The remember-and-dig loop disappears. Context lives on the lead record, and touches happen on schedule, not on memory."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "Behavioral triggers (an email open, a return visit to a listing page) alert you at the moment of re-engagement, with AI classifying a reply as \"call now\" versus \"not yet.\""
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "A monthly view of database size, touch coverage, and re-engagement signals replaces the guess."
      }
    ],
    "aiFit": "Rule-based drip sequences handle 80% of this with no AI at all. AI earns its keep at the edges: varying the message copy so month 18 doesn't read like month 1, and triaging inbound replies. Most dead databases are a sequencing problem, not an AI problem.",
    "afterState": "Every lead gets worked for years, not weeks. You step in for the live conversation when the system says someone is warming up, instead of guessing who might be."
  },
  {
    "id": "RE2",
    "categoryId": "re",
    "name": "Five texts per showing",
    "subject": "Showing scheduling and coordination",
    "frequency": "Daily",
    "automation": "Fully automatable",
    "painLine": "Booking one showing takes five texts between me, the buyer, the listing agent, and the seller. And then they cancel.",
    "workflow": [
      "A buyer asks to see a listing",
      "You check your own calendar by hand",
      "You request a window from the listing agent",
      "The seller comes back with limited times; the buyer counters",
      "You coordinate the final confirmation across all parties",
      "You send the morning-of reminder yourself",
      "After the showing, you chase the feedback request manually"
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
          "automate"
        ],
        "rationale": "A booking link with embedded availability rules does the calendar handshake. Humans should never be the routing layer for time slots."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Reminders fire on their own, to every party."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "automate",
          "report"
        ],
        "rationale": "The feedback request goes out within the hour, and responses accumulate where the seller conversation can use them."
      }
    ],
    "aiFit": "No AI needed anywhere in this one. Scheduling tools already solve it with rules. The teaching point: \"smart automation\" here is just refusing to let humans do calendar back-and-forth.",
    "afterState": "Showings get requested, confirmed, reminded, and followed up automatically. Which homes to see stays a strategy conversation; when to see them stops being your job."
  },
  {
    "id": "RE3",
    "categoryId": "re",
    "name": "Blank page to published in 10 minutes",
    "subject": "Listing descriptions and marketing copy",
    "frequency": "Per listing",
    "automation": "Partially automatable",
    "painLine": "Writing listing descriptions takes me 45 minutes and I stare at a blank page for half of that.",
    "complianceNote": "Fair Housing: listing copy must describe the property, never the people. No language that signals or implies preference by race, religion, family status, disability, or any protected class, and no characterizing a neighborhood's demographics. A human compliance read happens before anything publishes.",
    "workflow": [
      "You walk the property and take notes on features and upgrades",
      "You open a blank document and try to reconstruct the walkthrough from memory",
      "You draft the description from scratch, fighting the same boilerplate phrases",
      "Separate versions get written for MLS, social, and email",
      "Each platform's format and character count gets handled by hand",
      "The MLS version ships, and the Instagram caption still needs a different tone"
    ],
    "breakdown": [
      {
        "steps": [
          2,
          3
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "A structured intake form (features, upgrades, target buyer, neighborhood facts) feeds an AI first draft. Your time shifts from writing to editing."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Platform variants generate from the same input: MLS, social caption, email snippet, each in its own format."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "One review pass covers every channel because everything derives from one approved source."
      }
    ],
    "aiFit": "One of the cleanest AI applications in real estate: structured property details in, polished draft copy out, with platform variants for free. The non-negotiable is the human Fair Housing review before publishing. AI drafts; the agent owns every published word.",
    "afterState": "One intake form produces the MLS description, the social copy, and the email snippet in minutes. The blank page is gone, and the compliance review is the job, not the afterthought."
  },
  {
    "id": "RE4",
    "categoryId": "re",
    "name": "Herding docs to close",
    "subject": "Transaction coordination",
    "frequency": "Per transaction",
    "automation": "Mostly automatable",
    "painLine": "Every deal I have, I spend 30 minutes a day chasing someone for a document that should have been in my inbox yesterday.",
    "workflow": [
      "The contract executes; you build the transaction file and type in every party's contact info",
      "You assemble the deadline checklist by hand from contract dates",
      "You email lender, title, buyer, and seller at each milestone yourself",
      "Document status lives in your inbox search and a spreadsheet",
      "Deadlines approach; you call and chase",
      "A missing document delays a contingency; you scramble to reschedule",
      "After close, the testimonial request and CRM update happen if you remember"
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
        "rationale": "File creation and deadline calculation generate from the executed contract. Newer tools read the contract and extract the dates."
      },
      {
        "steps": [
          3,
          4,
          5
        ],
        "dispositions": [
          "automate",
          "simplify"
        ],
        "rationale": "Milestone notifications and document tracking run on their own, in a shared checklist every party can see. Chasing becomes the exception, not the routine."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "A dashboard of outstanding items per transaction shows trouble while it is still cheap to fix."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Post-close requests and CRM updates fire from the closing date, not from memory."
      }
    ],
    "aiFit": "Mostly a workflow problem, not an AI problem. The one real AI piece is contract reading: extracting dates and terms from the executed PDF to build the timeline. That is bounded document extraction, not generative writing. Hours per transaction of document chasing is a process failure first.",
    "afterState": "From execution day, deadlines populate themselves, every party gets nudged automatically, and your dashboard shows exactly what is outstanding. Your attention goes to the deals that actually go sideways."
  },
  {
    "id": "RE5",
    "categoryId": "re",
    "name": "The comps rabbit hole",
    "subject": "CMA preparation",
    "frequency": "Weekly",
    "automation": "Partially automatable",
    "painLine": "I spend two hours pulling comps and building a CMA every time I take a listing, and the data was already in the MLS.",
    "workflow": [
      "You search the MLS for comparable sales by filter criteria",
      "You review 15 to 30 candidates and pick the 5 to 8 that matter",
      "You adjust for square footage, beds, and condition by hand",
      "Data gets pasted into a presentation template",
      "You write the market narrative and pricing recommendation",
      "You format the final PDF with photos and layout",
      "You present it at the listing appointment"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "The comp pull and first-pass ranking come from the data; you confirm or swap the picks instead of building the list from zero."
      },
      {
        "steps": [
          3,
          4,
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Adjustment math and presentation assembly are structured work. The PDF builds itself."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI drafts the market narrative from the comp set; you own the recommendation and the number."
      }
    ],
    "aiFit": "AI organizes and presents; it does not price. Ranked comp selection, adjustment calculations, and a drafted narrative are real AI work on structured MLS data. The list price and the seller conversation are the agent's highest-value judgment and stay fully human.",
    "afterState": "Subject property in, ranked comps and a client-ready presentation out in minutes. Listing appointment prep drops from hours to a focused review of the number you are about to defend."
  },
  {
    "id": "RE6",
    "categoryId": "re",
    "name": "The referral machine that runs on good intentions",
    "subject": "Past-client and sphere campaigns",
    "frequency": "Monthly",
    "automation": "Mostly automatable",
    "painLine": "I know I should stay in touch with past clients but I get busy and suddenly it's been 18 months since I reached out to anyone.",
    "contextStat": {
      "value": "82%",
      "text": "of real estate transactions come from referrals or repeat business.",
      "source": "NAR, Profile of Home Buyers and Sellers"
    },
    "workflow": [
      "A transaction closes; the client's info lands in the CRM",
      "A closing gift goes out, maybe a handwritten card",
      "You intend to check in at 30, 90, and 180 days, and schedule none of it",
      "Occasional one-off emails go out when someone crosses your mind",
      "Home anniversaries, birthdays, and market updates never run consistently",
      "A past client lists with another agent or refers a friend elsewhere",
      "The referral pipeline feels mysteriously dry"
    ],
    "breakdown": [
      {
        "steps": [
          3,
          4,
          5
        ],
        "dispositions": [
          "eliminate",
          "automate"
        ],
        "rationale": "Good intentions and memory leave the system. Closing day starts a multi-year touch sequence: 30/90/180-day check-ins, home anniversary, annual market update."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI personalizes the market updates by the client's actual neighborhood and varies the copy so year two doesn't read like a template."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Touch coverage and referral source tracking make the pipeline visible instead of mysterious."
      }
    ],
    "aiFit": "Plain automation handles 90% of this. AI's role is keeping a years-long sequence from feeling canned: neighborhood-specific market notes and varied copy. The business case needs no AI at all; the relationship math is overwhelming on its own.",
    "afterState": "Every closed client enters a three-year touch plan the day the deal closes. You make the phone call when someone signals readiness. The machine handles the staying-in-touch."
  }
] as const;
