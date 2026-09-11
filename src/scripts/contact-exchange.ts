import { FALLBACK_TEXT, emailLink, introText, smsLink } from '../data/contact-card.js';
import { normalizePhone } from '../lib/scan-contact.js';

type Turnstile = { render: (element: HTMLElement, options: Record<string, unknown>) => string; reset: (id: string) => void; remove: (id: string) => void };
const root = document.querySelector<HTMLElement>('[data-exchange]');
if (root) initialize(root);

function initialize(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('.exchange-form')!;
  const entry = root.querySelector<HTMLElement>('[data-exchange-entry]')!;
  const success = root.querySelector<HTMLElement>('[data-exchange-success]')!;
  const status = form.querySelector<HTMLElement>('.exchange-status')!;
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const security = form.querySelector<HTMLElement>('[data-security-wrap]')!;
  const securityStatus = form.querySelector<HTMLElement>('[data-security-status]')!;
  const retry = form.querySelector<HTMLButtonElement>('[data-security-retry]')!;
  const widget = form.querySelector<HTMLElement>('[data-security-widget]')!;
  const preview = form.dataset.preview === 'true';
  const apple = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement;
  const ts = () => (window as unknown as { turnstile?: Turnstile }).turnstile;
  let ready = preview;
  let busy = false;
  let saved = false;
  let widgetId: string | undefined;
  let verificationTimer: ReturnType<typeof setTimeout> | undefined;
  let loader: HTMLScriptElement | undefined;
  let verifyGeneration = 0;
  const newId = () => crypto.randomUUID?.() || '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, char => (Number(char) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(char) / 4)))).toString(16));
  let currentId = newId();
  let lastFingerprint = '';
  const idKey = `bwj-exchange:${field('inquiry_type').value}`;
  const label = preview ? 'Try sharing my details' : 'Share my details';
  root.querySelector<HTMLAnchorElement>('[data-sms-fallback]')!.href = smsLink(FALLBACK_TEXT, apple);
  // A laptop cannot open an sms: link; show the number and an email path instead of a dead button.
  const phoneLike = navigator.maxTouchPoints > 0 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  if (!phoneLike) root.dataset.desktop = 'true';
  let draft = FALLBACK_TEXT;

  function announce(message: string) {
    status.textContent = message;
    status.hidden = false;
    status.focus();
  }
  function refresh() {
    submit.disabled = saved || busy || !ready;
    // The button itself says why it is not ready yet; a separate status line is easy to miss at an event.
    if (!busy) submit.textContent = ready || saved ? label : 'One moment…';
  }
  function verificationFailed() {
    if (saved) return;
    clearTimeout(verificationTimer);
    ready = false;
    security.hidden = false;
    securityStatus.hidden = false;
    securityStatus.textContent = 'The connection check didn’t finish. Retry it, or use “Text me instead” below.';
    retry.hidden = false;
    refresh();
  }
  function startVerification() {
    if (saved || preview) return;
    const generation = ++verifyGeneration;
    clearTimeout(verificationTimer);
    ready = false;
    security.hidden = false;
    securityStatus.hidden = false;
    retry.hidden = true;
    securityStatus.textContent = 'Checking your connection…';
    refresh();
    verificationTimer = setTimeout(verificationFailed, 15000);
    const render = () => {
      if (saved || generation !== verifyGeneration) return;
      try {
        if (widgetId !== undefined) ts()?.remove(widgetId);
        widgetId = ts()!.render(widget, {
          sitekey: form.dataset.siteKey, action: 'lead-form', appearance: 'interaction-only',
          size: window.matchMedia('(max-width: 520px)').matches ? 'compact' : 'flexible', retry: 'never',
          callback: () => {
            if (saved || generation !== verifyGeneration) return;
            clearTimeout(verificationTimer);
            ready = true;
            securityStatus.textContent = 'Connection checked.';
            securityStatus.hidden = true;
            retry.hidden = true;
            refresh();
          },
          'expired-callback': () => generation === verifyGeneration && verificationFailed(),
          'timeout-callback': () => generation === verifyGeneration && verificationFailed(),
          'error-callback': () => { if (generation === verifyGeneration) verificationFailed(); return true; },
          'unsupported-callback': () => generation === verifyGeneration && verificationFailed(),
        });
      } catch { verificationFailed(); }
    };
    if (ts()) { render(); return; }
    loader?.remove();
    loader = document.createElement('script');
    loader.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    loader.async = true;
    loader.onload = render;
    loader.onerror = () => { if (generation === verifyGeneration) verificationFailed(); };
    document.head.appendChild(loader);
  }
  retry.addEventListener('click', startVerification);
  field('name').addEventListener('input', () => field('name').setCustomValidity(''));
  field('phone').addEventListener('input', () => field('phone').setCustomValidity(''));
  field('email').addEventListener('input', () => field('phone').setCustomValidity(''));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || saved) return;
    field('name').setCustomValidity(field('name').value.trim() ? '' : 'Enter your name.');
    // Mobile is preferred, but either a mobile number or an email is enough to stay in touch.
    const phoneValue = field('phone').value.trim();
    const emailValue = field('email').value.trim();
    field('phone').setCustomValidity(
      phoneValue && !normalizePhone(phoneValue) ? 'Enter a valid mobile number. Outside the US or Canada, include your country code.'
      : !phoneValue && !emailValue ? 'Enter a mobile number or an email.' : '');
    if (!form.reportValidity()) return;
    if (!ready) { verificationFailed(); return; }
    busy = true;
    submit.textContent = preview ? 'Checking…' : 'Saving…';
    refresh();
    status.hidden = true;
    try {
      // Persist only a non-PII fingerprint and identifier, never the entered details.
      const payload = new FormData(form);
      const values = ['inquiry_type', 'name', 'phone', 'email', 'message'].map(name => String(payload.get(name) || ''));
      const hash = crypto.subtle ? await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(values))) : null;
      const fingerprint = hash ? Array.from(new Uint8Array(hash), x => x.toString(16).padStart(2, '0')).join('') : '';
      if (lastFingerprint && lastFingerprint !== fingerprint) currentId = newId();
      lastFingerprint = fingerprint;
      try {
        if (!fingerprint) throw new Error('Session retry persistence requires a secure context.');
        const prior = JSON.parse(sessionStorage.getItem(idKey) || 'null');
        if (prior?.fingerprint === fingerprint && /^[a-f0-9-]{36}$/i.test(prior.id)) currentId = prior.id;
        else currentId = newId();
        sessionStorage.setItem(idKey, JSON.stringify({ id: currentId, fingerprint }));
      } catch { /* The in-memory ID still protects unchanged retries without storage access. */ }
      field('submission_id').value = currentId;
      payload.set('submission_id', currentId);
      if (!preview) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        try {
          const response = await fetch(form.action, { method: 'POST', body: payload, headers: { Accept: 'application/json' }, signal: controller.signal });
          const result = await response.json();
          if (!response.ok || !result.stored) {
            if (response.status === 429) throw new Error('A few too many attempts. Please wait a little, or text me below. Your details are still here.');
            if (response.status === 403) throw new Error('Please retry the connection check, then share your details again.');
            if (response.status === 400) throw new Error('Please check your details, then try again.');
            throw new Error('We couldn’t confirm your details were saved. Try again or text me below. Your details are still here.');
          }
        } finally { clearTimeout(timeout); }
      }
      saved = true;
      clearTimeout(verificationTimer);
      draft = introText(payload.get('name'), payload.get('message'));
      root.querySelector<HTMLAnchorElement>('[data-sms-next]')!.href = smsLink(draft, apple);
      root.querySelectorAll<HTMLAnchorElement>('[data-email-next]').forEach(link => { link.href = emailLink(draft); });
      // Email-only visitors get an email step instead of a text step they cannot complete.
      const emailOnly = !String(payload.get('phone') || '').trim();
      root.querySelector<HTMLElement>('[data-next-sms]')!.hidden = emailOnly;
      root.querySelector<HTMLElement>('[data-next-email]')!.hidden = !emailOnly;
      const intro = root.querySelector<HTMLElement>('[data-saved-intro]')!;
      if (!preview && emailOnly) intro.textContent = 'Saved. Send me a quick email so we stay connected.';
      else if (!preview && root.dataset.desktop) intro.textContent = 'Saved. Text or email me and we stay connected.';
      root.dataset.saved = 'true';
      entry.hidden = true;
      success.hidden = false;
      success.querySelector<HTMLElement>('h1')!.focus();
      try { sessionStorage.removeItem(idKey); } catch { /* Storage is optional. */ }
      form.reset();
    } catch (error) {
      announce(error instanceof Error && error.name !== 'AbortError' && error.name !== 'TypeError'
        ? error.message : 'We couldn’t confirm the save. Check your connection and retry, or text me below. Your details are still here.');
      if (!preview) startVerification();
    } finally {
      busy = false;
      submit.textContent = label;
      refresh();
    }
  });
  root.querySelector('[data-copy-note]')?.addEventListener('click', async () => {
    const copyStatus = root.querySelector<HTMLElement>('.exchange-copy-status')!;
    try { await navigator.clipboard.writeText(draft); copyStatus.textContent = 'Copied. Paste it into your text.'; }
    catch { copyStatus.textContent = `The note is: ${draft}`; }
    copyStatus.hidden = false;
  });
  refresh();
  if (!preview) startVerification();
}
