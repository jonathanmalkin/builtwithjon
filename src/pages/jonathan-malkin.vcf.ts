import { VCARD } from '../data/contact-card.js';
export function GET() {
  return new Response(VCARD, { headers: { 'Content-Type': 'text/vcard; charset=utf-8', 'Content-Disposition': 'attachment; filename="jonathan-malkin.vcf"' } });
}
