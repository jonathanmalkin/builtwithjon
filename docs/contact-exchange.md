# Website-first contact exchange

Implemented locally September 10, 2026 using the existing Built with Jon design system. This replaces the text-first page hierarchy. It has not been deployed by this task. The Active-Work Lab project `Workspace/01-Lab/Active-Projects/QR-Contact-Exchange/PROJECT.md` owns continuation and acceptance evidence.

## Visitor flow

The new default QR encodes `https://builtwithjon.com/card/`. `/card/` and `/claude-meetup/` use the same short form, retaining distinct `scan:card` and `scan:meetup` inquiry types. Jonathan's September 10 evening direction: four plain fields (name, mobile number, email, optional "Where we met") and no expandable section. Name is required; at least one of mobile or email is required, with mobile preferred for the text step. "Where we met" posts as the existing `message` field. The Worker still accepts optional `company` and `linkedin` for compatibility, but the page no longer shows them. The form confirms durable storage before offering an SMS draft populated from the name and, when supplied, where you met. The visitor must open the draft and tap Send. No scan, download or button click proves SMS delivery or contact import.

The initial direct-text fallback contains no editable bracket placeholders; the footer note asks the visitor to include their name. Its opening alone cannot establish an identity. Jonathan's contact download remains available. Shared contact data in `src/data/contact-card.js` governs the phone, email, website, vCard and SMS helpers. The visitor's supplied name/context goes into a deliberate SMS link only; it is not added to page URLs or analytics.

The September 10 mobile simplification keeps the field names, states and endpoints. The identity block, one-line intro and a single Working Surface form panel carry the task; the three fields, primary action and no-marketing assurance fit a 390×844 first screen (primary action bottom measured at 670px). Phone-first type sizes: 16px-plus for every line, 18px inputs, a 54px primary button and 48px footer actions. Before saving, the footer holds two quiet actions (save Jonathan's vCard, text instead) and a one-line note that asks a text-first visitor to add their name. After a confirmed save `data-saved` on the page root hides that footer, and the saved screen itself carries two full-width buttons: primary "Text Jonathan" (populated SMS draft) and secondary "Save Jonathan's contact" (vCard), each with one line saying what opens and that the visitor taps Send or Add. The earlier copy-number button, separate site link, email footer link and optional-details disclosure were removed. Icons come from the installed Lucide set through `astro-icon`.

Panel-driven refinements (September 10, late evening): the trust line reads "Only I see this, and only to stay in touch. No marketing emails."; the intro is "Add your info, then send me a quick text."; the optional field label is visually lighter. On the saved screen, a visitor who gave no mobile sees "Email Jonathan" (a mailto with the same populated note) instead of the SMS step. Phones get a "Note missing? Copy it." fallback for messaging apps that ignore a pre-filled body; the copy uses the clipboard and otherwise shows the note. A laptop or other non-touch device (no touch points and a non-mobile user agent) gets `data-desktop` on the page root: sms: buttons are hidden and the number plus an email link are shown instead. The owner `/qr/` screen is now the heading, the code, one owner line and the download links.

Client validation mirrors the Worker: a supplied mobile must normalize, and an empty mobile with an empty email stops submission with "Enter a mobile number or an email." The Worker returns `invalid_phone` for an unusable supplied number rather than silently dropping it, and `required_fields_missing` only when neither identifier is present. The owner notification offers an SMS link when a phone exists and a mailto link otherwise; the JSON envelope carries `phone: null` for email-only captures.

`/qr/` is the owner display Jonathan opens on his phone and holds up: a short heading, the large website QR, the readable URL, a one-line name and PNG/SVG downloads. No photo or form. The new files are `public/contact/qr-website.png` and `.svg`; the legacy `qr-text` assets are retained unchanged. Existing printed SMS codes continue opening Messages and cannot be redirected through the website. Use the new image for website-first capture.

## Form states and preview

`src/scripts/contact-exchange.ts` owns initial verification, ready, submitting, saved and recoverable failure states. The shared layout excludes these forms from its generic Turnstile controller; other forms retain their existing controller. Verification is still enforced by the Worker. A blocked script, failed widget, expired token or timeout exposes a retry plus the direct-text alternative. The checking and failure messages are visible; the "Connection checked." confirmation is hidden once the form is ready so the panel stays quiet, while the widget container remains in place for any interactive challenge. A late widget callback cannot undo saved state.

Network failures retain entered details; a 20-second request timeout does not claim that storage failed. Unchanged retries retain their submission identifier. Session storage keeps only a payload fingerprint and UUID; no raw contact fields are stored there. In insecure local previews, in-memory retry identity remains available without secure-context hashing. Values are cleared after confirmed save; the populated SMS action remains. Editing a failed payload creates a distinct capture identity, and concurrency retains KV's eventual-consistency limitations.

`CONTACT_PREVIEW=true` builds a clearly labeled validation-only form and illustrative completion state, with no contact POST or verification widget. SMS/vCard links still work. Its QR page warns that the QR points at the first-party site, not the unpublished preview. Never deploy the preview build as production.

## Capture and delivery

Production posts to the existing `/api/contact` endpoint. The owner notification subject is `New website lead: QR contact exchange`; its text/HTML preserve the JSON envelope between `BEGIN BWJ CONTACT EXCHANGE JSON` and `END BWJ CONTACT EXCHANGE JSON`. Schema `bwj.contact-exchange.v1`, capture ID, submission ID, original timestamp, normalized phone, self-reported name and optional details are unchanged. A retry now reuses the original stored record for the notification, including its timestamp.

Capture is saved first at `lead:qr:<capture_id>`. A separate private `delivery:qr:<capture_id>` record holds status, reason, attempt count and timestamps; it does not alter the capture envelope. Both use the existing LEADS store and retention policy. States are `pending`, `sending`, `notified`, `failed` and `uncertain`; an older or unreadable delivery entry remains `unknown` in recovery exports. `notified` means provider acceptance, not verified arrival in Gmail. If delivery-state writing fails before sending, the contact stays saved and no send starts. Logs include the capture ID for reconciliation.

An explicit provider rejection can be retried by the same submission. A previous in-flight or uncertain send is held for operator reconciliation to avoid automatically duplicating a possibly delivered email. Existing provider/dedupe limits still apply; there is no exactly-once mail promise. There is no new automatic resend, scheduler, public lookup endpoint or contact synchronization.

`stored: true, notified: false` is still a saved contact, but Gmail-based capture will not see it until notification or source-linked recovery. The page keeps the honest saved state and offers texting. It never asks the visitor to repeatedly submit an already saved contact to fix an owner delivery problem.

## Event limits and bounded recovery

QR forms have a separate per-IP/hour bucket controlled by `QR_RATE_LIMIT_IP_HOURLY` (60). Generic forms retain their 20/IP/hour limit. Existing per-contact limits and the separate 100/day Sender budget remain. Tests establish 50 synthetic contacts on one shared IP. The test scenario is not a factual attendance estimate.

For a reviewed recovery window, use the existing export script in QR mode. Dates are UTC; convert from the intended Chicago window before invoking. Example:

```sh
node scripts/export-leads.mjs --qr --since 2026-09-10 --until 2026-09-11 --status needs-attention --limit 50 --scan-limit 200
```

QR mode emits JSONL with the original `source_key`, `lead` and separate `delivery`. Add `--local --persist-to <directory>` only for a local fixture store. This command reads private contact information, so redirect output only to approved private operational storage; never public screenshots or repository fixtures. QR mode requires a date range, caps returned records at 100 and inspected records at 500, and reports when listed-key coverage is incomplete. Key order is not chronological. `unknown` is not evidence of successful notification. Do not use the legacy unrestricted CSV export for a bounded QR recovery. The export sends nothing; reconcile uncertain outcomes before any authorized resend/manual capture.

## Tests and review

```sh
npm run contact:qr
npm run test:contact
npm run test:email
npm run build
```

`test:contact` exercises the actual bundled Worker with synthetic KV/provider doubles, including normalized capture, escaped envelope, retry timestamp, delivery metadata, uncertain-send handling, metadata failure, event volume, budget exhaustion and generic compatibility. `test:email` is the full existing local Wrangler suite, including QR regressions. No real messages are sent by either suite.

The browser suite uses an installed Playwright runtime and local Chrome; it adds no production dependency:

```sh
PLAYWRIGHT_MODULE=<absolute-path-or-file-URL-to-playwright> \
CHROME_EXECUTABLE=<local-chrome-executable> \
QR_BASE_URL=http://127.0.0.1:4322 \
QR_QA_DIR=<private-review-output-directory> \
QR_PREVIEW_URL=http://localhost:4323 \
npm run test:contact:browser
```

Serve a production build locally at `QR_BASE_URL`. Serve the separate validation-only build at `QR_PREVIEW_URL` if testing preview behavior. The suite rejects a public base URL, mocks verification, captures mobile/desktop states, checks recovery and includes browser multipart submission through the actual Worker with synthetic storage/provider responses. It does not solve production challenges or send SMS. If no Playwright override is set, normal module resolution is used. `PLAYWRIGHT_MODULE` may point at a Playwright or `playwright-core` entry file; a CommonJS entry is accepted. Headless Chrome needs to write its profile and crash-handler files, so run the suite outside a write-restricted sandbox. Use an OS-managed temporary output directory rather than an Active-Work root cache.

For local Wrangler preference-write restrictions, use a temporary `XDG_CONFIG_HOME`, `WRANGLER_LOG_PATH` and `WRANGLER_SEND_METRICS=false`. The verification record contains measured viewport sizes, exact outcomes and remaining real-device limitations. QR PNG and rasterized SVG were independently decoded with Apple's Vision framework after fixing SVG renderer compatibility.

## Native capture and release acceptance

Relationships capture/aftercare remains governed by `Workspace/Relationships/workflows/qr-contact.md`. Supported named introductions and authenticated owner envelopes can create factual stubs; identity conflicts stay unresolved; calendar proximity alone does not establish the event. Public research shares the existing budget and follow-up stays unsent. The native job reads the current prompt from the real workspace, but this configuration check is not a real capture receipt.

Before public release, verify the exact candidate against the shared checkout and preserve unrelated changes. Use the authorized Git owner and existing builtwithjon deployment workflow; push alone does not deploy. Record the previous deployment for rollback without deleting captured records. Production release and real sends require existing applicable authorization.

After release, verify the first-party routes/assets and one authorized real form notification, then a second-number inbound SMS forwarded into the Gmail account read by Daily Compass. Verify source IDs, factual person/event capture, bounded aftercare and a repeat run without duplicates. Jonathan confirmed the earlier texting/contact-save links on his phone; the new QR, populated draft and real forwarding chain still need their own phone/source acceptance. Never turn local synthetic success into a claim of live delivery.
