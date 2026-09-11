import QRCode from 'qrcode';
import { mkdir, writeFile } from 'node:fs/promises';
import { SMS_QR, CARD_URL } from '../src/data/contact-card.js';
await mkdir('public/contact', { recursive: true });
const options = { errorCorrectionLevel: 'M', margin: 4, color: { dark: '#000000', light: '#ffffff' } };
await QRCode.toFile('public/contact/qr-text.png', SMS_QR, { ...options, width: 1000 });
await writeFile('public/contact/qr-text.svg', await QRCode.toString(SMS_QR, { ...options, type: 'svg' }));
await QRCode.toFile('public/contact/qr-website.png', CARD_URL, { ...options, width: 1000 });
// Filled modules also print correctly in renderers that mishandle scaled SVG strokes.
const { modules } = QRCode.create(CARD_URL, options);
const size = modules.size + 8;
let path = '';
for (let y = 0; y < modules.size; y++) for (let x = 0; x < modules.size; x++) {
  if (modules.get(y, x)) path += `M${x + 4} ${y + 4}h1v1h-1z`;
}
await writeFile('public/contact/qr-website.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${path}" fill="#000"/></svg>`);
console.log('Generated website and legacy text QRs in PNG and SVG.');
