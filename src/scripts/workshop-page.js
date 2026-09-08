const menu = document.querySelector('.ws26 .menu');
const nav = document.querySelector('.ws26 .nav');
if (menu && nav) {
  function closeMenu() {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = 'Menu';
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? 'Close' : 'Menu';
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });
}

const form = document.querySelector('#workshop-inquiry');
if (form) {
  const interest = form.querySelector('[name="workshop_interest"]');
  const note = form.querySelector('.interest-note');
  const selected = form.querySelector('#selected-interest');
  const status = form.querySelector('#form-status');
  const button = form.querySelector('[type="submit"]');
  let submitting = false;
  let submitted = false;
  document.querySelectorAll('.ws26 [data-interest]').forEach((link) => {
    link.addEventListener('click', () => {
      if (submitted) return;
      interest.value = link.dataset.interest;
      selected.textContent = link.dataset.interest;
      note.hidden = false;
    });
  });
  form.querySelector('#clear-interest').addEventListener('click', () => {
    interest.value = '';
    selected.textContent = '';
    note.hidden = true;
    form.querySelector('[name="name"]').focus();
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting || submitted || !form.reportValidity()) return;
    submitting = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    status.textContent = '';
    status.className = '';
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) {
        const error = new Error(result.error || 'send_failed');
        throw error;
      }
      submitted = true;
      window.bwjTrack?.('workshop-host:success');
      form.querySelector('.inquiry-fields').hidden = true;
      form.querySelector('.interest-note').hidden = true;
      form.querySelector('.bwj-turnstile-wrap')?.setAttribute('hidden', '');
      button.hidden = true;
      status.className = 'form-success';
      status.textContent = 'Thanks. I’ll reply by email.';
    } catch (error) {
      status.className = 'form-error';
      status.textContent = error.message === 'verification_failed'
        ? 'Please complete the security check and try again. Your message is still here.'
        : 'That did not go through. Your message is still here. Please try again, or email jonathan@builtwithjon.com.';
      // Tokens are single use, including when a later delivery step fails.
      const widget = form.dataset.turnstileWidget;
      if (widget && window.turnstile) window.turnstile.reset(widget);
      button.disabled = Boolean(widget && window.turnstile);
      button.textContent = 'Send a message';
    } finally {
      submitting = false;
      form.removeAttribute('aria-busy');
      status.focus();
    }
  });
}

// Move keyboard focus with the same-page links, including revealed inquiry context.
document.querySelectorAll('.ws26 a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    const id = link.getAttribute('href').slice(1);
    const target = id === 'tell-me'
      ? document.querySelector('#workshop-inquiry .inquiry-fields:not([hidden]) [name="name"]') || document.querySelector('#form-status')
      : id === 'moment' ? document.querySelector('.excerpt-toggle') : document.getElementById(id);
    requestAnimationFrame(() => target?.focus({ preventScroll: true }));
  });
});
