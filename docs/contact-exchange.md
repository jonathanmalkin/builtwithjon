# Text-first contact exchange

Approved September 9, 2026. New QR codes encode an SMS URI addressed to +15123874308. Opening/scanning is not a sent message: visitors edit their name/event and tap Send. Existing printed URL codes keep resolving through `/card` and `/claude-meetup`; these pages offer Text Jonathan first, Save my contact second, and an optional contact form. `/qr` shows the downloadable QR. No marketing subscription is created.

## Phone acceptance

1. Open the private test on a second screen and scan with the phone camera. Check the recipient is 512-387-4308. Replace both placeholders with your actual name and event before sending. Use another phone/number to test a real inbound conversation rather than texting your own number.
2. Check the prepared body on iPhone and Android. The QR uses the standard `sms:number?body=` syntax. Camera and messaging apps vary; some discard body text. The contact page uses the legacy Apple `&body=` variant for its direct button, and displays the instruction to add a name/event even if the body is lost. Never claim a scan or button click means delivery.
3. Open `/card` on the phone, test Text Jonathan and Save my contact. Confirm the imported name, phone, email, website and LinkedIn. Contact saving needs confirmation and may use a download/import flow on Android.
4. Expand the form and More details. Name and phone are required; email, context, company and LinkedIn are optional. The private build (`CONTACT_PREVIEW=true`) validates locally and explicitly submits nothing. Production uses the existing protected `/api/contact` endpoint.
5. After the production release, submit one real form and verify LEADS storage, owner email, the SMS link in that email, and the structured capture envelope. Confirm Google Voice forwarded the real test SMS to the Gmail account read by Daily Compass. Then run native capture/research with its normal source contract and repeat to verify deduplication.

## Capture envelope

The owner email has subject `New website lead: QR contact exchange`. Its text and HTML contain a JSON object bounded by `BEGIN BWJ CONTACT EXCHANGE JSON` / `END BWJ CONTACT EXCHANGE JSON`. Fields include `capture_schema: bwj.contact-exchange.v1`, `capture_kind: qr-contact`, `capture_id`, `submission_id`, `submitted_at`, normalized phone, name, optional email/message/company/LinkedIn, inquiry_type and source_url. Source and identity are self-reported; event association requires corroborating context, not just proximity to a calendar event.

The client keeps one submission UUID until successful completion. Storage keys include a content fingerprint and that UUID, so retrying the same payload keeps the archived record and notification identity. Distinct submissions remain distinct source events; Relationships resolves their person by exact phone/email with conflicts held for review. Existing generic contact/workshop requirements remain intact.

Forms save before owner notification. `stored: true, notified: false` means archived but not delivered to Gmail capture. The existing operational log `contact_archived_not_notified` exposes this condition; recover using the bounded lead export and source-linked capture. This change does not add a scheduled notification retry or pretend that Daily Compass reads KV. Concurrent KV writes retain KV's eventual-consistency limits; this is not an exactly-once mail transport.

## Daily Run integration

The companion Active-Work change adds `Workspace/Relationships/workflows/qr-contact.md` and a bounded exception in the existing native Daily Compass prompt. Supported named QR introductions and authenticated owner notifications can create factual stubs without waiting for Jonathan's reply. Research shares the existing budget, company/event links need evidence, and follow-up remains unsent. No second schedule, SMS provider or Google Contacts write is added.

## Validation and release

- `node scripts/generate-contact-qr.mjs` regenerates the checked-in PNG/SVG from shared contact data.
- `node scripts/test-contact-exchange.mjs` exercises the real bundled Worker with in-memory KV and mocked provider responses, including archiving, notification, retries, invalid inputs, origin checks, bot checks and generic contact compatibility. It sends no real messages.
- `npm run test:email` includes two QR regression cases in the full existing Wrangler suite.
- `npm run build` builds production; `CONTACT_PREVIEW=true npm run build` builds the explicit validation-only preview. Never deploy the preview build as production.
- Build and independent QR image decoding passed in the review environment. The full Wrangler suite could not start because network-interface inspection is unavailable there. Browser visual QA was blocked by the unavailable supervised preview service. Native phone-camera, contact-import and real forwarding acceptance remain Jonathan's test.

Implementation approval is not public deployment approval. Review the exact changes and native integration before releasing builtwithjon.com. GitHub push alone does not deploy the site or establish that the Mac has loaded the new Daily Run rules.
