// Keep recovery selection deterministic and bounded; never send from this path.
export function recoveryOptions(args) {
  const value = key => { const i = args.indexOf(key); return i < 0 ? undefined : args[i + 1]; };
  const since = value('--since'), until = value('--until');
  const date = text => { const parsed = new Date(`${text}T00:00:00Z`); return /^\d{4}-\d{2}-\d{2}$/.test(text || '') && Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === text; };
  if (!date(since) || !date(until) || since > until) throw new Error('QR recovery requires --since and --until as an ordered YYYY-MM-DD range (UTC).');
  const limit = Number(value('--limit') || 50);
  const scanLimit = Number(value('--scan-limit') || 200);
  const status = value('--status') || 'needs-attention';
  if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isInteger(scanLimit) || scanLimit < limit || scanLimit > 500) throw new Error('Use --limit 1..100 and --scan-limit between limit and 500.');
  if (!['all', 'needs-attention', 'notified', 'pending', 'failed', 'uncertain', 'sending', 'unknown'].includes(status)) throw new Error('Unknown delivery status.');
  return { since, until, limit, scanLimit, status };
}
export function recoveryMatches(lead, delivery, options) {
  const day = String(lead.submitted_at || '').slice(0, 10);
  const status = delivery?.status || 'unknown';
  return lead.capture_kind === 'qr-contact' && day >= options.since && day <= options.until
    && (options.status === 'all' || (options.status === 'needs-attention' ? status !== 'notified' : status === options.status));
}
