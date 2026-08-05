// Places a QR code pointing at builtwithjon.com lives. The slug becomes the URL
// segment (/scan/<slug>), so the printed URL names where the scan came FROM.
// Adding a new printed thing means adding one entry here.

export interface ScanOrigin {
  slug: string;
  /** Shown in the inbound email so you can tell scan sources apart. */
  label: string;
  subject: string;
  /** Optional mono kicker above the name. */
  context?: string;
  messagePlaceholder?: string;
}

export const SCAN_ORIGINS: ScanOrigin[] = [
  {
    slug: 'card',
    label: 'business card',
    subject: 'Business card scan — builtwithjon.com/scan/card',
  },
  {
    slug: 'meetup',
    label: 'Claude Meetup',
    subject: 'Claude Meetup scan — builtwithjon.com/scan/meetup',
    context: 'Company Brain 🧠',
    messagePlaceholder: 'What question would your company brain answer first?',
  },
];
