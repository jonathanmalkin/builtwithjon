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
    "intro": "Firms that sell expertise leak money in the unbillable gaps: the day reconstructed from memory at 6pm, the engagement letter that took until Tuesday, the proposal rewritten from scratch because nobody could find the last one. AI genuinely helps here, drafting narratives, scope sections, and research summaries, because the raw material is text. The gates are professional ones: you sign every bill, review every letter, and verify every citation.",
    "stat": null,
    "group": "industry"
  },
  {
    "id": "hw",
    "num": "10",
    "name": "Health and Wellness",
    "intro": "A practice loses revenue in empty chairs: the no-show, the cancelled slot nobody refilled, the patient who quietly lapsed, the new caller who reached voicemail. Almost every fix is reminders, waitlists, and sequences, plain automation with one big constraint. Everything touches protected health information, so the whole stack lives inside HIPAA-compliant tools with a signed BAA, and nothing clinical ever gets delegated to a bot.",
    "stat": null,
    "group": "industry"
  },
  {
    "id": "finance",
    "num": "11",
    "name": "Finance and Bookkeeping",
    "intro": "Money admin is the same failure repeated at different scales: the receipt pile, the month-end weekend, the can-I-afford-this guess, the January shoebox. Almost all of it is a capture problem, not an intelligence problem. Bank feeds, matching rules, and one connected dashboard do the heavy lifting; AI gets the narrow jobs, like categorizing the weird vendor. And sales tax wants software that follows rules perfectly, not software that reasons.",
    "stat": null,
    "group": "function"
  },
  {
    "id": "cs",
    "num": "12",
    "name": "Customer Service",
    "intro": "Customer service pain is mostly volume wearing a disguise: the same three questions, five inboxes, the 7pm call from the couch, the review that sat for two weeks. Route everything into one place first, automate the recitable answers, and let AI draft where speed beats polish, like positive review replies. The angry customer and the ambiguous complaint stay human. They were always the actual job.",
    "stat": null,
    "group": "function"
  },
  {
    "id": "hr",
    "num": "13",
    "name": "Hiring and Human Resources",
    "intro": "Hiring at a small business is structure problems wearing AI costumes. Knockout questions beat resume-ranking models, a booking link beats a scheduling bot, and digital onboarding beats every chatbot demo. AI earns a place drafting job postings and review summaries. The one step where it touches candidate decisions, screening, is the one step where the legal risk lives, so that one keeps a human on every call.",
    "stat": null,
    "group": "function"
  },
  {
    "id": "op",
    "num": "14",
    "name": "Operations and Scheduling",
    "intro": "Operations problems repeat on a schedule: the Sunday-night roster, the 6am call-out, the supply run, the machine that dies during your busiest week. Nearly every fix here is a template, a threshold, or a checklist, features you may already pay for. The standout genuine AI win is getting the business out of your head: talk through a task once and let AI turn the recording into a written procedure.",
    "stat": null,
    "group": "function"
  },
  {
    "id": "personal",
    "num": "15",
    "name": "Personal and Household",
    "intro": "Everything this library teaches about business workflows applies at home, because home life is workflows too: the subscriptions nobody audits, the inbox that eats an evening, the school newsletter that hides the spirit day. Same five questions, same order. Eliminate the forgotten subscriptions before optimizing anything, let filters and shared calendars do the boring work, and save AI for what it's genuinely good at here: parsing the newsletter, planning the meals, compressing the research.",
    "stat": null,
    "group": "personal"
  }
] as const;
