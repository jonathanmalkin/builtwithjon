// Shared by the page, downloadable vCard and QR generator.
export const CONTACT = {
  name: 'Jonathan Malkin', phone: '+15123874308', displayPhone: '512-387-4308',
  email: 'jonathan@builtwithjon.com', website: 'https://builtwithjon.com',
  linkedin: 'https://www.linkedin.com/in/jonathanmalkin',
};
// The visitor edits the brackets before sending. A scan never sends an SMS.
export const INTRO_TEXT = 'Hi Jonathan! My name is [your name]. We met at [event or place]. From your QR card.';
export const SMS_QR = `sms:${CONTACT.phone}?body=${encodeURIComponent(INTRO_TEXT)}`;
export function smsLink(body = INTRO_TEXT, apple = false) {
  return `sms:${CONTACT.phone}${apple ? '&' : '?'}body=${encodeURIComponent(body)}`;
}
export const VCARD = [
  'BEGIN:VCARD', 'VERSION:3.0', 'N:Malkin;Jonathan;;;',
  `FN:${CONTACT.name}`, 'ORG:Built with Jon',
  `TEL;TYPE=CELL,VOICE:${CONTACT.phone}`, `EMAIL;TYPE=INTERNET,WORK:${CONTACT.email}`,
  `URL:${CONTACT.website}`, `URL:${CONTACT.linkedin}`, 'END:VCARD', '',
].join('\r\n');
