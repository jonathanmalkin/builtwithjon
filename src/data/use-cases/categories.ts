export const categories = [
  {
    "id": "admin",
    "num": "01",
    "name": "Admin & Ops",
    "intro": "Small business owners spend roughly 16 hours a week, two full workdays, on administrative work. Studies of knowledge workers put \"work about work\", status chasing, app switching, hunting for files, at around 58–60% of the workday. This is the category where elimination and simplification beat fancy tools.",
    "stat": {
      "value": "58–60%",
      "text": "of the workday goes to \"work about work\", status chasing, app switching, hunting for files.",
      "source": "Asana, Anatomy of Work Index"
    },
    "group": "function"
  },
  {
    "id": "sales",
    "num": "02",
    "name": "Sales",
    "intro": "The brutal math of small business sales: leads contacted within five minutes are dramatically more likely to convert, by some studies 21x versus a 30-minute wait, yet typical business response times run one to two days, and a large share of inquiries never get a response at all. Meanwhile nearly half of leads arrive outside business hours. Sales automation isn’t about replacing selling. It’s about making sure selling actually happens.",
    "stat": {
      "value": "21×",
      "text": "more likely to convert when a lead is contacted within 5 minutes vs. 30, yet the average business takes ~42 hours.",
      "source": "InsideSales / Drift, lead-response research"
    },
    "group": "function"
  },
  {
    "id": "marketing",
    "num": "03",
    "name": "Marketing",
    "intro": "Small business marketing fails for one dominant reason: inconsistency. The newsletter that went out three times, the social account last updated in March, the reviews nobody asked for. Automation’s job here isn’t creativity, it’s making the machine run every week whether you’re busy or not.",
    "stat": null,
    "group": "function"
  },
  {
    "id": "gc",
    "num": "04",
    "name": "General Contractors",
    "intro": "Construction has the worst paperwork-to-profit ratio of any industry we cover. Industry research found construction professionals spend about 35% of their time, over 14 hours a week, on non-optimal work: searching for project information, resolving conflicts, and dealing with rework. Nearly half of rework traces to poor communication and bad data. None of that pours concrete. All of it is exactly what automation eats.",
    "stat": {
      "value": "35%",
      "text": "of construction time, over 14 hours a week, goes to non-optimal work: searching for information, resolving conflicts, and rework.",
      "source": "PlanGrid / FMI, Construction Disconnected"
    },
    "group": "industry"
  },
  {
    "id": "cc",
    "num": "05",
    "name": "Coaches & Creators",
    "intro": "Creators and coaches do the same work, every week, but in a personal voice at scale. The heavy lift is usually packaging and velocity, not originality. Small businesses in this lane win by keeping systems simple and showing up consistently.",
    "stat": null,
    "group": "industry"
  },
  {
    "id": "hs",
    "num": "06",
    "name": "Home Services & Trades",
    "intro": "A trade business loses money in the gaps: the call that rang out while you were under a house, the quote nobody chased, the membership that lapsed quietly, the callback that ate the margin. Almost none of the fix is AI. It is intake, cadence, and proof, with AI saved for the moments that need real judgment, like triaging the 2am emergency.",
    "stat": null,
    "group": "industry"
  },
  {
    "id": "re",
    "num": "07",
    "name": "Real Estate",
    "intro": "Real estate runs on long timelines and short attention. The lead that buys in month 14, the referral that arrives in year three, the transaction with forty documents in flight. The wins here are sequencing and follow-through, with AI drafting copy and reading contracts. It organizes and presents; it never sets the price.",
    "stat": null,
    "group": "industry"
  },
  {
    "id": "pm",
    "num": "08",
    "name": "Property Management",
    "intro": "Property management is the same five problems on a loop: the 11pm emergency that isn't one, the application weekend, the lease that expired unnoticed, the monthly rent chase, the owner report nobody wants to write. Nearly all of it is rules and sequencing. The one genuinely AI-shaped job is triage.",
    "stat": null,
    "group": "industry"
  },
  {
    "id": "ps",
    "num": "09",
    "name": "Professional Services",
    "intro": "Professional services firms run on clarity and timing. The hard part is often not billing software. It is scope clarity, version control, and turning client conversations into repeatable outcomes.",
    "stat": null,
    "group": "industry"
  },
  {
    "id": "hw",
    "num": "10",
    "name": "Health and Wellness",
    "intro": "Health and wellness practices carry trust risk and scheduling pressure at the same time. Fast service is valuable, but process mistakes can harm retention and compliance posture.",
    "stat": null,
    "group": "industry"
  },
  {
    "id": "finance",
    "num": "11",
    "name": "Finance and Bookkeeping",
    "intro": "Bookkeeping is where chaos gets expensive. Small business owners can usually fix most misses with standard discipline and a small set of templates before any AI work can actually help.",
    "stat": null,
    "group": "function"
  },
  {
    "id": "cs",
    "num": "12",
    "name": "Customer Service",
    "intro": "A service business does not lose customers when they send many messages; it loses customers when answers vary. Your system should route first, then support with consistent tone and history.",
    "stat": null,
    "group": "function"
  },
  {
    "id": "hr",
    "num": "13",
    "name": "Hiring and Human Resources",
    "intro": "Early hiring workflows do not fail because of tooling. They fail because criteria, communication, and onboarding signals are not consistent. AI can help with consistency, never with bias judgment.",
    "stat": null,
    "group": "function"
  },
  {
    "id": "op",
    "num": "14",
    "name": "Operations and Scheduling",
    "intro": "Ops teams lose leverage when every day starts with what was done yesterday and never ends with a clear next owner. The gain is less software and more sequencing.",
    "stat": null,
    "group": "function"
  },
  {
    "id": "personal",
    "num": "15",
    "name": "Personal and Household",
    "intro": "The same framework works outside business because home life is a workflow too. The framework does not own your life for you. It gives you the same simple process you use with clients.",
    "stat": null,
    "group": "personal"
  }
] as const;
