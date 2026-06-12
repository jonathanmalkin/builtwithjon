export const useCases = [
  {
    "id": "F1",
    "categoryId": "finance",
    "name": "The receipt pile on your desk",
    "subject": "Receipt capture and categorization",
    "frequency": "Daily",
    "automation": "Mostly automatable",
    "painLine": "By Friday I have a stack of paper receipts I still need to enter, and half of them are faded by the time I get to them.",
    "contextStat": {
      "value": "80+",
      "text": "hours a year go to bookkeeping and tax admin for four in ten small business owners.",
      "source": "SCORE, small business accounting survey"
    },
    "workflow": [
      "Paper and email receipts collect all week",
      "Each one gets photographed or scanned by hand",
      "You open the accounting system and the receipt side by side",
      "Vendor, amount, date, and category get typed in",
      "Ambiguous vendors trigger a category debate with yourself",
      "The receipt image gets attached to the entry",
      "The bank feed still has unmatched card transactions waiting"
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
        "rationale": "A capture tool ingests photos, email forwards, and the card feed directly. Manual entry stops existing as a chore."
      },
      {
        "steps": [
          5,
          7
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "Bank-feed rules categorize the recurring vendors; AI suggests categories for the new and ambiguous ones, learning from your past choices."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Images attach themselves to the matched transaction."
      },
      {
        "steps": [],
        "dispositions": [
          "report"
        ],
        "rationale": "A weekly five-minute outlier scan replaces the Friday data entry session."
      }
    ],
    "aiFit": "Receipt OCR is mature plain automation, not AI. AI's real contribution is the categorization call on a new or ambiguous vendor. Roughly 80% of the win comes from the capture-and-rules layer before AI enters at all.",
    "afterState": "Receipts land in the books the same day, already categorized. Your weekly review is a scan for outliers, not an evening with a shoebox."
  },
  {
    "id": "F2",
    "categoryId": "finance",
    "name": "Month-end musical chairs",
    "subject": "Monthly close and reconciliation",
    "frequency": "Monthly",
    "automation": "Mostly automatable",
    "painLine": "Every month I spend a weekend reconciling the books, and I still find something that doesn't match.",
    "workflow": [
      "Bank and card statements get downloaded",
      "Every statement line gets compared to the books by eye",
      "Unmatched transactions trigger a who-bought-this hunt",
      "Missing entries get added; miscategorized ones get fixed",
      "Receivables and payables get reconciled",
      "Payroll entries get double-checked",
      "A draft P&L comes out and anything odd gets chased",
      "You sign off, hoping nothing slipped"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2
        ],
        "dispositions": [
          "eliminate"
        ],
        "rationale": "Live bank feeds end the download-and-compare ritual. The data was always available; the workflow just never asked for it."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "automate",
          "simplify"
        ],
        "rationale": "Matching rules handle the recurring vendors; the hunt shrinks to a short exception list with the evidence attached."
      },
      {
        "steps": [
          5,
          6,
          7
        ],
        "dispositions": [
          "automate",
          "optimize"
        ],
        "rationale": "Sub-ledgers reconcile continuously, and AI flags entries that look statistically unusual against your history."
      },
      {
        "steps": [
          8
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "Sign-off stays human, now backed by an exception report instead of a weekend of spadework."
      }
    ],
    "aiFit": "Bank feeds and matching rules are plain automation and deliver most of the win. The honest AI role is anomaly detection: surfacing the entry that doesn't fit your own historical pattern. Many owners will never need that layer.",
    "afterState": "Month-end becomes a Thursday afternoon review of a pre-matched ledger. You sign off on exceptions instead of rebuilding the reconciliation from scratch."
  },
  {
    "id": "F3",
    "categoryId": "finance",
    "name": "The \"can I afford this?\" guess",
    "subject": "Cash-flow visibility",
    "frequency": "Daily / Weekly",
    "automation": "Mostly automatable",
    "painLine": "I have money in the account but I genuinely don't know if I can pay for this without hurting payroll next week.",
    "contextStat": {
      "value": "39%",
      "text": "of small businesses hold less than one month of operating expenses in reserve.",
      "source": "Bluevine, small business survey"
    },
    "workflow": [
      "You check the bank balance",
      "You check outstanding invoices and bills in a second system",
      "A rough mental model of the next two weeks takes shape",
      "Payroll dates and scheduled payments get checked on the calendar",
      "Back-of-envelope subtraction produces an available-cash guess",
      "The spending decision rides on that guess",
      "A late payment or surprise bill restarts the whole exercise"
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
        "rationale": "Bank feed, receivables, and payables connect into one cash-position view with a rolling 30-day forecast. The multi-system lookup stops existing."
      },
      {
        "steps": [
          5,
          7
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "The forecast recalculates itself as payments land, with an alert when projected cash crosses your threshold."
      },
      {
        "steps": [
          6
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "The decision stays yours. It just starts from a real number instead of an estimate built in your head at 11pm."
      }
    ],
    "aiFit": "A rolling forecast from known receivables, payables, and payroll dates is plain automation. AI only matters for genuinely irregular or seasonal patterns. A well-connected no-AI dashboard delivers 90% of the value here.",
    "afterState": "One screen each morning: real balance, what's coming in, what's going out, and a flag if the next ten days look tight. The guess becomes a glance."
  },
  {
    "id": "F4",
    "categoryId": "finance",
    "name": "Bill pile and the late-payment shuffle",
    "subject": "Bill payment and approvals",
    "frequency": "Weekly",
    "automation": "Mostly automatable",
    "painLine": "I get invoices by email, by text, and sometimes by mail, and every so often one slips through and we get a late-fee notice.",
    "workflow": [
      "Vendor invoices arrive by email, mail, and the occasional text",
      "Details get typed into the accounting system by hand",
      "The invoice gets forwarded to whoever needs to approve it",
      "The approver finds it in a busy inbox, eventually",
      "Payment gets scheduled back in the accounting system",
      "The weekly batch goes out after a manual vendor-details check",
      "Month-end reconciliation catches whatever slipped"
    ],
    "breakdown": [
      {
        "steps": [
          1,
          2
        ],
        "dispositions": [
          "eliminate",
          "automate"
        ],
        "rationale": "One A/P inbox captures every invoice; OCR reads the details. Paper, email, and text stop being three different filing systems."
      },
      {
        "steps": [
          3,
          4
        ],
        "dispositions": [
          "automate",
          "simplify"
        ],
        "rationale": "Approval routes by dollar threshold. Small bills flow through; large or unusual ones wait for a human."
      },
      {
        "steps": [
          5,
          6
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Payments release on due dates automatically. Late fees stop being a recurring line item."
      },
      {
        "steps": [
          7
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "A standing view of what's due, what's approved, and what's paid replaces the month-end surprise."
      }
    ],
    "aiFit": "Invoice capture and threshold routing are plain automation. AI's narrow job is the fraud-and-error edge: duplicate invoices, vendor-name lookalikes, and amounts that deviate from a vendor's history. For most small businesses the rules-based version is the complete solution.",
    "afterState": "Invoices land in one inbox, route themselves for approval, and pay on the due date. You touch the exceptions, not the pile."
  },
  {
    "id": "F5",
    "categoryId": "finance",
    "name": "The sales tax guessing game",
    "subject": "Sales tax calculation and filing",
    "frequency": "Monthly / Quarterly",
    "automation": "Fully automatable",
    "painLine": "I sell in three states and I have no idea if my rates are still right. I just hope I'm close when I file.",
    "workflow": [
      "You work out which states and jurisdictions you owe in",
      "Current rates get looked up, and they change constantly",
      "Rates get applied to sales by hand, with exemptions handled case by case",
      "Totals get aggregated per jurisdiction at period end",
      "Each state's filing portal gets its own login session",
      "Your hand-built figures go into each portal",
      "Confirmations get filed away, and you hope"
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
        "rationale": "A sales tax engine connected to the point of sale calculates the right rate on every transaction and aggregates by jurisdiction. Manual rate lookup is not a job a person should have."
      },
      {
        "steps": [
          5,
          6,
          7
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "Filing and remittance run on schedule for every state. The portal logins disappear."
      },
      {
        "steps": [
          1
        ],
        "dispositions": [
          "simplify",
          "report"
        ],
        "rationale": "Your remaining job is a quarterly nexus sanity check as the business grows, backed by a report of where you're collecting."
      }
    ],
    "aiFit": "None. This is the purest example in the library of a workflow where you want software that follows the rules perfectly, not software that reasons about them. Rate tables, jurisdiction maps, and filing calendars are deterministic. AI has no meaningful role, and that is the lesson.",
    "afterState": "Tax calculates at the point of sale, aggregates itself, and files on schedule. You think about sales tax exactly once a quarter, on purpose."
  },
  {
    "id": "F6",
    "categoryId": "finance",
    "name": "The shoebox handoff",
    "subject": "Year-end accountant prep",
    "frequency": "Yearly",
    "automation": "Partially automatable",
    "painLine": "Every January I spend three weekends pulling everything together for my accountant, and they still come back with questions I can't answer.",
    "workflow": [
      "Twelve months of statements get gathered from every account",
      "Transaction exports come down from every payment platform",
      "Receipts for large expenses get hunted across email and drawers",
      "A year of miscategorized transactions gets fixed in one sitting",
      "Contractor W-9s get chased for 1099 filing",
      "Mileage logs and home-office numbers get reconstructed",
      "Everything ships to the accountant with an apologetic summary",
      "Follow-up questions trickle in for weeks"
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
          "eliminate"
        ],
        "rationale": "The January project is twelve deferred months wearing a trench coat. Continuous capture and a monthly close upstream make these steps vanish."
      },
      {
        "steps": [
          5
        ],
        "dispositions": [
          "automate"
        ],
        "rationale": "W-9 collection happens at the moment a contractor is onboarded, and 1099 thresholds track themselves."
      },
      {
        "steps": [
          6,
          7
        ],
        "dispositions": [
          "simplify"
        ],
        "rationale": "Year-end becomes a clean export from a reconciled system plus a short cover note."
      },
      {
        "steps": [
          8
        ],
        "dispositions": [
          "report"
        ],
        "rationale": "The accountant's questions get answered by the ledger because the answers were recorded when they were knowable."
      }
    ],
    "aiFit": "None of this needs AI, and that is the point. The shoebox is a process failure, not a technology gap. Cleanup billed at CPA rates is the most expensive data entry you will ever buy. Consistent capture all year makes January a 30-minute export.",
    "afterState": "Your accountant gets a reconciled ledger and matched receipts in one export. Tax prep fees drop because the cleanup hours no longer exist."
  }
] as const;
