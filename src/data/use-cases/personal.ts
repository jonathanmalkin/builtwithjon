export const useCases = [
  {
    "id": "P1",
    "categoryId": "personal",
    "name": "The subscription trap",
    "subject": "Recurring charge audit",
    "frequency": "Monthly",
    "automation": "Mostly automatable",
    "painLine": "I pay for things every month and honestly couldn't tell you what half of them are.",
    "contextStat": {
      "value": "89%",
      "text": "of consumers underestimate what they spend on subscriptions each month.",
      "source": "CNET, subscription survey"
    },
    "workflow": [
      "Scroll the bank app hunting for recurring charges",
      "List each service by hand in a notes app",
      "Try to remember whether you still use each one",
      "Search email for the original signup to be sure",
      "Hunt down each service's buried cancellation flow",
      "Cancel a few, or call to negotiate",
      "Repeat next month for the charges you missed"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2,
          7
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "A subscription tracker reads the transaction feed and surfaces every recurring charge automatically, including the new ones, every month."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Most households have three to five services nobody uses. Killing them is the entire win, and it happens once the list exists."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "simplify",
          "optimize"
        ],
        "rationale": "The tracker handles many cancellations directly; AI drafts the negotiation script for the bills worth a phone call."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "A monthly alert flags new recurring charges before they go invisible."
      }
    ],
    "aiFit": "Detection is pure pattern-matching on your transaction feed, no AI involved. AI contributes a negotiation script and a second opinion on the borderline keeps. The real unlock is linking the accounts once, the same lesson as the business bookkeeping cases: capture first.",
    "afterState": "One dashboard shows every recurring charge, the forgotten ones are gone, and new charges get flagged the month they appear instead of the year after."
  },
  {
    "id": "P2",
    "categoryId": "personal",
    "name": "The 45-minute email hole",
    "subject": "Personal inbox triage",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "I check email to find one thing and end up in a 45-minute hole I didn't plan for.",
    "workflow": [
      "Open the inbox to an undifferentiated pile of receipts, newsletters, and actual humans",
      "Hunt for the one email you came for",
      "Read several wrong things on the way",
      "Leave the rest unread for a \"later\" that never comes",
      "Unsubscribe from one list; three more arrive",
      "The pile compounds daily",
      "Something important drowns in the promotional noise"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          5,
          6
        ],
        "dispositions": [
          "eliminate",
          "automate"
        ],
        "rationale": "Filter rules route receipts, shipping alerts, and newsletters into labeled folders before they ever hit the primary inbox, and a bulk unsubscribe pass shrinks the inflow itself."
      },
      {
        "steps": [
          2,
          3
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI search in natural language (\"find the dentist confirmation from March\") replaces the scroll-and-skim hunt."
      },
      {
        "steps": [
          4,
          7
        ],
        "dispositions": [
          "simplify",
          "report"
        ],
        "rationale": "When the inbox holds only human messages, \"later\" becomes a ten-minute daily pass and the important thing is visible by default."
      }
    ],
    "aiFit": "The same lesson as the business inbox case: filters and unsubscribe discipline solve most of it with zero AI. AI helps at the edges, summarizing the long thread you ignored and finding things by description. Don't add an AI layer on top of an unfiltered inbox; clean the structure first.",
    "afterState": "Your inbox contains messages from people. Everything else sorts itself into folders you check on purpose, and email takes ten minutes instead of forty-five."
  },
  {
    "id": "P3",
    "categoryId": "personal",
    "name": "The spirit day you missed",
    "subject": "Family calendar and school logistics",
    "frequency": "Weekly",
    "automation": "Mostly automatable",
    "painLine": "Between the school newsletter, the sports schedule, and three different reminder apps, I still missed the spirit day.",
    "workflow": [
      "School info arrives by email, app, paper flyer, and group text, all separately",
      "Events get typed into the family calendar by hand",
      "Conflicts with work get discovered by accident and resolved by text",
      "Pickup logistics run across three message threads",
      "Reminders get set in triplicate out of self-distrust",
      "An RSVP deadline dies buried under promotions",
      "The whole cycle repeats weekly, per kid"
    ],
    "breakdown": [
      {
        "steps": [
          2
        ],
        "dispositions": [
          "optimize",
          "automate"
        ],
        "rationale": "The genuinely hard step is turning an unstructured newsletter into calendar events, and that is real AI work: parse the PDF, extract \"book fair, Tuesday, 8am\", create the event."
      },
      {
        "steps": [
          1,
          3,
          4
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "One shared family calendar with color-coded owners gives everyone the same picture and erases most of the coordination texts."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "automate",
          "eliminate"
        ],
        "rationale": "Events created in the calendar carry their own reminders and RSVP deadlines. The triple-reminder habit retires."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "A Sunday five-minute family calendar review replaces the weekly scramble."
      }
    ],
    "aiFit": "The calendar layer is solved by existing no-AI tools. AI's real job is intake: reading the newsletter, the PDF schedule, and the flyer photo, then turning them into structured events. Document parsing, not scheduling strategy. That one step is where the missed spirit days actually come from.",
    "afterState": "School events land on the shared calendar when the newsletter arrives, conflicts surface immediately, and the family runs on one picture of the week instead of four."
  },
  {
    "id": "P4",
    "categoryId": "personal",
    "name": "What's for dinner (again)",
    "subject": "Meal planning and grocery lists",
    "frequency": "Weekly",
    "automation": "Mostly automatable",
    "painLine": "By Thursday I've cooked the same five things I always cook and we're ordering pizza anyway.",
    "workflow": [
      "Sunday demands five to seven meal ideas from a blank brain",
      "The fridge and pantry get checked, vaguely",
      "A grocery list gets written from memory, with holes",
      "Monday's planned meals don't survive contact with Friday",
      "Expired food goes in the trash",
      "The store gets navigated without an organized list",
      "Takeout wins because planning felt harder than cooking"
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
        "rationale": "A standing rotation of 10 to 15 family-approved meals kills the blank page without any technology. AI drafts the week's plan from the rotation plus constraints: time, budget, what's in the pantry."
      },
      {
        "steps": [
          2,
          3,
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "A confirmed plan generates its own grocery list, sorted by store section. That is rules, not AI."
      },
      {
        "steps": [
          4,
          5,
          7
        ],
        "dispositions": [
          "eliminate",
          "report"
        ],
        "rationale": "Mid-week choices become \"pick from the plan,\" food waste becomes visible, and pizza goes back to being a choice instead of a surrender."
      }
    ],
    "aiFit": "One of the most-adopted personal AI uses for a reason: drafting under constraints with a low-stakes, instantly editable output. The catch is memory, a raw chatbot forgets your preferences between sessions, so a purpose-built planner that stores your profile beats re-prompting every Sunday.",
    "afterState": "Monday starts with a confirmed plan and a sorted list. The week's dinners are decisions already made, and the same five meals become a real rotation with room to breathe."
  },
  {
    "id": "P5",
    "categoryId": "personal",
    "name": "The trip that took three weekends to plan",
    "subject": "Travel research and itineraries",
    "frequency": "Yearly",
    "automation": "Partially automatable",
    "painLine": "We spent more time planning the trip than we spent on it.",
    "workflow": [
      "Fifteen tabs open: flights, hotels, listicles, a 2019 blog post",
      "Fragments get pasted into a doc nobody maintains",
      "A day-by-day itinerary gets assembled from scraps",
      "The restaurant you planned around is closed that day",
      "The rebuild loses track of which hotel had the good reviews",
      "Bookings scatter across disconnected confirmation emails",
      "You land without knowing how to get to the hotel"
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
          "optimize"
        ],
        "rationale": "One AI conversation replaces the tab sprawl: \"best neighborhoods for a family of four at $200 a night\" is a synthesis question, exactly what models do well. The itinerary drafts itself from the same thread."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Hours, availability, and prices are live data AI cannot promise. The human verification pass on the short list is the step that keeps, by design."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "A mail rule files every confirmation into one trip folder, and the arrival-day logistics go in the itinerary like any other stop."
      }
    ],
    "aiFit": "Travel planning is a breakout personal AI use because the painful part was always research synthesis. Set the boundary honestly: AI collapses the research weekends into one focused session, but it cannot see live prices or current opening hours, so booking and verifying stay human.",
    "afterState": "Trip research happens in one 90-minute session ending in a complete draft itinerary. The weekends go back to being weekends, including the ones on the trip."
  },
  {
    "id": "P6",
    "categoryId": "personal",
    "name": "The big-purchase rabbit hole",
    "subject": "Major purchase research",
    "frequency": "Yearly",
    "automation": "Partially automatable",
    "painLine": "I read 40 reviews, watched three YouTube videos, and still wasn't sure I was making the right call.",
    "contextStat": {
      "value": "1 in 4",
      "text": "car buyers used AI while shopping in 2025, and 97% of those said it would influence their purchase decision.",
      "source": "Cars.com, AI car shopping survey"
    },
    "workflow": [
      "The refrigerator dies and the research clock starts",
      "Search results serve ten affiliate roundups that agree on nothing",
      "Reviews across three platforms contradict each other",
      "YouTube reviews are sponsored or assume you're an expert",
      "A mental shortlist forms and immediately blurs",
      "Three days later the research restarts from the top",
      "The purchase happens under time pressure, half-sure"
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
          "optimize"
        ],
        "rationale": "A constrained AI comparison (\"top three dishwashers under $900 for a family of five, prioritize reliability and noise\") synthesizes the signal from across sources in one pass and answers follow-ups."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "The conversation is the notebook. The shortlist, the rationale, and the open question survive the three-day gap instead of evaporating."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "The decision keeps a written rationale, and it stays yours. AI compares; it doesn't buy."
      }
    ],
    "aiFit": "Strong fit because the job is synthesis under constraints, not live pricing. For slow-moving categories (appliances, mattresses, contractors) AI research holds up well; for fast-moving ones (phones, laptops) add a current forum check on top. Either way, weeks of tab sprawl become one focused session.",
    "afterState": "The decision takes one sitting and comes with a clear rationale. The purchase feels considered instead of panic-bought when the old one finally died."
  }
] as const;
