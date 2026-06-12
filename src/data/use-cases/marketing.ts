export const useCases = [
  {
    "id": "M1",
    "categoryId": "marketing",
    "name": "The content treadmill",
    "subject": "Creating and repurposing content",
    "frequency": "Weekly",
    "automation": "Partially automatable",
    "painLine": "I know we should be posting. I also know how to do forty other jobs that pay today.",
    "workflow": [
      "Stare at a blank page wondering what to post",
      "Write something from scratch, slowly, doubting it",
      "Publish it in one place and consider the job done",
      "The insight you explained brilliantly to a customer on Tuesday is never captured",
      "Each platform would need its own version, too much work, skip it",
      "Posting stops the moment business gets busy (i.e., when it works)",
      "The blog’s last entry is dated two years ago, in public"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          4
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Your content already exists, customer questions, job photos, voice memos from the truck. Capture beats creation. A running idea inbox kills the blank page."
      },
      {
        "steps": [
          2
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI drafts from your raw material, a voice memo becomes a post in your voice. You edit for truth and tone; you don’t compose from zero."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "One core piece becomes a post, an email blurb, three social captions, and a short script, AI handles the reformatting, you approve."
      },
      {
        "steps": [
          3,
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "A scheduled queue publishes consistently regardless of how your week went."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "What actually drove inquiries, not just likes."
      }
    ],
    "aiFit": "Drafting, rewriting for each platform, turning transcripts into posts. The scheduling and cross-posting are plain automation. Honest caveat: unedited AI content reads generic and can hurt trust. The win is AI-drafted, human-finished.",
    "afterState": "One hour of raw input per week becomes a full content calendar. Your business looks alive online even during your busiest month, especially during your busiest month."
  },
  {
    "id": "M2",
    "categoryId": "marketing",
    "name": "Posting into the void",
    "subject": "Social media scheduling",
    "frequency": "Daily / Weekly",
    "automation": "Mostly automatable",
    "painLine": "Marketing is the job I do at 11pm, badly, on my phone.",
    "workflow": [
      "Remember social media exists, feel guilty",
      "Take a photo or hunt for an old one",
      "Write a caption on your phone in the moment",
      "Post to one platform; the others stay stale",
      "Forget hashtags, tagging, posting time, whatever",
      "Comments and DMs arrive; some get answered days later",
      "No idea if any of this leads to actual customers"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2,
          3,
          4,
          5
        ],
        "dispositions": [
          "automate",
          "simplify"
        ],
        "rationale": "A batching ritual, 30 minutes weekly, plus a scheduler that posts at good times to every platform. AI drafts caption variants per platform from your photos."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "Comment/DM inbox unified in one place; AI drafts replies and flags purchase-intent messages (\"do you do X? how much?\") as leads, because that’s what they are."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Followers are vanity; track profile-to-inquiry actions."
      },
      {
        "steps": [],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Posting frequency itself: most small businesses should post less, better, on fewer platforms. Two platforms done weekly beats five done never."
      }
    ],
    "aiFit": "Caption drafting, reply drafting, intent detection in DMs. Scheduling is plain automation, mature and cheap.",
    "afterState": "Sunday’s 30 minutes covers the week. DMs become a managed lead channel instead of a guilt channel."
  },
  {
    "id": "M3",
    "categoryId": "marketing",
    "name": "The newsletter that never launched",
    "subject": "Email marketing",
    "frequency": "Weekly / Monthly",
    "automation": "Mostly automatable",
    "painLine": "We have 1,200 customer emails and we’ve used them to send… nothing.",
    "workflow": [
      "Customer emails accumulate in the invoice tool, unused",
      "Someone proposes a newsletter; everyone agrees enthusiastically",
      "Issue #1 takes six hours and goes out late",
      "Issue #2 never happens",
      "New subscribers (if any) get silence after signup",
      "Past customers never hear from you until they need you, if they remember you",
      "Competitors’ emails sit in your customers’ inboxes instead"
    ],
    "breakdown": [
      {
        "steps": [
          1
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Customers flow into the email list automatically at point of sale/job completion (with consent)."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "optimize",
          "simplify"
        ],
        "rationale": "A fixed, simple format (one tip, one update, one offer). AI drafts each issue from your month’s activity; you edit in 20 minutes."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "A welcome sequence, written once, runs forever, does more than a year of newsletters."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Lifecycle triggers: seasonal reminders, service anniversaries (\"it’s been a year since your last…\"), win-back messages for lapsed customers."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "Revenue per email, not just opens."
      }
    ],
    "aiFit": "Drafting issues and lifecycle messages, segmenting by behavior. The sequences and triggers are plain automation, the most proven ROI machine in small business marketing.",
    "afterState": "Your list finally works. Past customers come back on schedule, and the newsletter ships monthly because the heavy lifting isn’t yours anymore."
  },
  {
    "id": "M4",
    "categoryId": "marketing",
    "name": "\"Could you leave us a review?\"",
    "subject": "Review generation",
    "frequency": "Daily (per job/sale)",
    "automation": "Fully automatable",
    "painLine": "Our happiest customers say nothing online. Our angriest one wrote a novel.",
    "workflow": [
      "Job ends; customer is delighted, says so in person",
      "You mean to ask for a review; it feels awkward; you don’t",
      "Occasionally you remember to ask, days later, when the glow has faded",
      "The customer agrees, then can’t find where to leave it",
      "Meanwhile one bad experience produces an instant 1-star",
      "Your rating drifts down on a trickle of angry outliers",
      "Prospects judge you on a sample of your worst days"
    ],
    "breakdown": [
      {
        "steps": [
          2,
          3,
          4
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "A review request, by text, with the direct link, fires automatically a few hours after job completion, when satisfaction peaks. One automatic follow-up if no action."
      },
      {
        "steps": [
          1
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Job-completion status in your system is the trigger; another reason intake/job tracking matters."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "A quick \"how did we do?\" pulse before the public ask routes unhappy customers to a private conversation first, fixing the problem instead of broadcasting it."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Rating trend, volume vs. local competitors, common praise themes (which become marketing copy)."
      }
    ],
    "aiFit": "Mostly plain automation, and devastatingly effective. AI helps summarize review themes and draft responses (see M5).",
    "afterState": "Review volume goes up several-fold because every happy customer gets asked at the right moment. Your online rating starts reflecting your actual work."
  },
  {
    "id": "M5",
    "categoryId": "marketing",
    "name": "The public conversation",
    "subject": "Responding to reviews and mentions",
    "frequency": "Weekly",
    "automation": "Partially automatable",
    "painLine": "The bad review sat unanswered for three weeks. Every prospect since has read both.",
    "workflow": [
      "Reviews land on Google, Yelp, Facebook, nobody’s watching",
      "A bad one sits publicly unanswered for weeks",
      "When you find it, you’re angry; you draft something you shouldn’t send",
      "You cool off, soften it, eventually post something adequate",
      "Good reviews get no acknowledgment at all",
      "The same complaint appears three times before anyone notices it’s a pattern",
      "The fixable operational issue behind it stays unfixed"
    ],
    "breakdown": [
      {
        "steps": [
          1
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "All review platforms monitored in one feed, with instant alerts for anything under 4 stars."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI drafts a calm, specific, non-defensive response within minutes; you approve. (Never auto-post responses to negative reviews, a human must own those.)"
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "Brief, varied thank-you responses to positive reviews can be AI-drafted and lightly reviewed."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "AI clusters complaints and praise into themes, your most honest operational report, written by your customers for free."
      }
    ],
    "aiFit": "Response drafting (tone is everything and AI is good at calm), theme extraction, sentiment trends. Monitoring and alerting are plain automation.",
    "afterState": "Nothing sits unanswered past a day. Negative reviews become public proof of how you handle problems, which, prospects consistently say, matters more than perfection."
  },
  {
    "id": "M6",
    "categoryId": "marketing",
    "name": "\"Is the ad money working?\"",
    "subject": "Marketing measurement",
    "frequency": "Monthly",
    "automation": "Mostly automatable",
    "painLine": "We spend $1,500 a month on ads because stopping feels scarier than continuing.",
    "workflow": [
      "Money goes out to ads, sponsorships, directories",
      "Leads come in from somewhere",
      "Nobody reliably asks or records \"how did you hear about us?\"",
      "Platform dashboards each claim credit for everything",
      "Monthly review = scrolling four dashboards, concluding \"seems okay?\"",
      "Budgets renew on inertia",
      "The channel quietly producing your best customers gets no extra investment"
    ],
    "breakdown": [
      {
        "steps": [
          3
        ],
        "dispositions": [
          "simplify",
          "automate"
        ],
        "rationale": "Source capture built into intake, tracking numbers, form fields, unique links, recorded on the lead automatically, not asked from memory."
      },
      {
        "steps": [
          4,
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "One blended dashboard: spend per channel next to closed revenue per channel, not clicks."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI reviews the month and recommends in plain English: \"Referrals close at 4x the rate of paid clicks; the directory produced nothing in 90 days.\""
      },
      {
        "steps": [],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Whatever the data shows isn’t working. Measurement’s best output is a shorter spend list."
      }
    ],
    "aiFit": "Plain-language analysis and recommendations. Source tracking and dashboards are plain automation.",
    "afterState": "Every marketing dollar has a receipt. You cut the dead spend, double the live spend, and \"seems okay?\" leaves the vocabulary."
  },
  {
    "id": "M7",
    "categoryId": "marketing",
    "name": "The customers you already won",
    "subject": "Repeat and referral",
    "frequency": "Monthly",
    "automation": "Mostly automatable",
    "painLine": "We spend everything chasing strangers and nothing on the people who already trust us.",
    "workflow": [
      "Job ends; relationship ends with it, by accident",
      "No follow-up at the natural repurchase moment (the season, the year mark, the service interval)",
      "Referrals happen only when a customer spontaneously thinks of you",
      "There’s no easy way for them to refer even if they want to",
      "Past customer data sits unsegmented, best customers treated identically to one-timers",
      "A competitor with a postcard or a reminder email gets the repeat job",
      "You meet the customer again in their review of someone else"
    ],
    "breakdown": [
      {
        "steps": [
          2
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Time- and season-triggered outreach by service type, the gentle \"it’s been 12 months\" message, sent reliably forever."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "simplify",
          "automate"
        ],
        "rationale": "A real referral ask in the post-job sequence with a shareable link and a thank-you (gift, discount, donation) that triggers automatically when a referral converts."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "optimize"
        ],
        "rationale": "AI segments the customer base, high-value, lapsed, seasonal, and suggests who to contact with what."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "Repeat rate and referral rate, finally measured. These two numbers predict your year better than ad metrics ever will."
      }
    ],
    "aiFit": "Segmentation, message personalization, timing suggestions. The triggers and referral mechanics are plain automation.",
    "afterState": "Your existing customer base becomes a system instead of a coincidence. Repeat and referral work, the cheapest revenue you’ll ever earn, runs in the background year-round."
  }
] as const;
