export const SCAN_ORIGINS = new Set(['scan:card', 'scan:meetup']);
export function normalizePhone(value) {
  const raw = String(value || '').trim();
  if (!/^[+\d\s().-]+$/.test(raw)) return null;
  const digits = raw.replace(/\D/g, '');
  if (!raw.startsWith('+') && digits.length === 10) return `+1${digits}`;
  if (!raw.startsWith('+') && digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (raw.startsWith('+') && /^[1-9]\d{7,14}$/.test(digits)) return `+${digits}`;
  return null;
}
export function validLinkedIn(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['linkedin.com', 'www.linkedin.com'].includes(url.hostname)
      && /^\/in\/[^/]+\/?$/.test(url.pathname) && !url.username && !url.password;
  } catch { return false; }
}
