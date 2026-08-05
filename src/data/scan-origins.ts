// The two QR codes in circulation, each already encoding its own URL: the
// business card points at /card, the Aug 10 meetup deck slide at
// /claude-meetup. Both render the same ScanCard; only the inbound email
// labelling differs, so a reply tells you which code someone scanned.

export interface ScanOrigin {
  /** Shown in the inbound email so you can tell scan sources apart. */
  label: string;
  subject: string;
  inquiryType: string;
}

export const CARD_ORIGIN: ScanOrigin = {
  label: 'business card',
  subject: 'Business card scan: builtwithjon.com/card',
  inquiryType: 'scan:card',
};

export const MEETUP_ORIGIN: ScanOrigin = {
  label: 'Claude Meetup',
  subject: 'Claude Meetup scan: builtwithjon.com/claude-meetup',
  inquiryType: 'scan:meetup',
};
