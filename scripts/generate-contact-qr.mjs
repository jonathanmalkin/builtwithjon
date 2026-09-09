import QRCode from 'qrcode';
import { mkdir, writeFile } from 'node:fs/promises';
import { SMS_QR } from '../src/data/contact-card.js';
await mkdir('public/contact', { recursive: true });
const options = { errorCorrectionLevel: 'M', margin: 4, color: { dark: '#000000', light: '#ffffff' } };
await QRCode.toFile('public/contact/qr-text.png', SMS_QR, { ...options, width: 1000 });
await writeFile('public/contact/qr-text.svg', await QRCode.toString(SMS_QR, { ...options, type: 'svg' }));
console.log('Generated contact QR in PNG and SVG.');
