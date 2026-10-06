// Submits any form[data-odl-form] to /api/contact without leaving the page,
// keeps the visitor's words on failure, and fills the optional workshop
// interest from links marked data-interest. Mirrors workshop-page.js.
document.querySelectorAll('form[data-odl-form]').forEach((form) => {
  const fields = form.querySelector('[data-fields]');
  const status = form.querySelector('[data-status]');
  const button = form.querySelector('[type="submit"]');
  const interest = form.querySelector('[name="workshop_interest"]');
  const note = form.querySelector('[data-interest-note]');
  const label = form.querySelector('[data-interest-label]');
  const clear = form.querySelector('[data-interest-clear]');
  const track = form.dataset.trackForm || 'contact';
  const idle = button.innerHTML;
  let submitting = false;
  let submitted = false;

  if (interest && note && label) {
    document.querySelectorAll('[data-interest]').forEach((link) => {
      link.addEventListener('click', () => {
        if (submitted) return;
        interest.value = link.dataset.interest;
        label.textContent = link.dataset.interest;
        note.hidden = false;
        requestAnimationFrame(() => form.querySelector('[name="name"]')?.focus({ preventScroll: true }));
      });
    });
    clear?.addEventListener('click', () => {
      interest.value = '';
      label.textContent = '';
      note.hidden = true;
      form.querySelector('[name="name"]')?.focus();
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting || submitted) return;
    if (!form.reportValidity()) return;
    submitting = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    status.textContent = '';
    status.className = 'status';
    try {
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) throw new Error(result.error || 'send_failed');
      submitted = true;
      window.bwjTrack?.(`${track}:success`);
      fields.hidden = true;
      if (note) note.hidden = true;
      form.querySelector('.bwj-turnstile-wrap')?.setAttribute('hidden', '');
      button.hidden = true;
      status.className = 'status ok';
      status.textContent = 'Thanks. I’ll reply by email.';
    } catch (error) {
      status.className = 'status err';
      status.textContent = error.message === 'verification_failed'
        ? 'Please complete the security check and try again. Your message is still here.'
        : 'That did not go through. Your message is still here. Please try again, or email jonathan@builtwithjon.com.';
      const widget = form.dataset.turnstileWidget;
      if (widget && window.turnstile) window.turnstile.reset(widget);
      button.disabled = Boolean(widget && window.turnstile);
      button.innerHTML = idle;
    } finally {
      submitting = false;
      form.removeAttribute('aria-busy');
      status.focus();
    }
  });
});
