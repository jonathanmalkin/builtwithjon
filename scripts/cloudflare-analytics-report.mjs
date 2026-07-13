const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const requestedDays = Number(process.argv[2] || 7);
const days = Number.isFinite(requestedDays)
  ? Math.max(1, Math.min(90, Math.round(requestedDays)))
  : 7;

if (!accountId || !apiToken) {
  console.error('Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN before running this report.');
  process.exit(1);
}

const query = `
SELECT
  blob1 AS event,
  SUM(double1 * _sample_interval) AS hits
FROM site_events
WHERE timestamp > NOW() - INTERVAL '${days}' DAY
GROUP BY event
ORDER BY hits DESC
`;

const response = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'text/plain',
    },
    body: query,
  },
);

if (!response.ok) {
  console.error(`Cloudflare analytics request failed (${response.status}).`);
  process.exit(1);
}

const payload = await response.json();
const rows = Array.isArray(payload?.data) ? payload.data : [];
const totals = new Map(rows.map((row) => [
  String(row.event || 'unknown'),
  Number(row.hits || 0),
]));

const count = (event) => totals.get(event) || 0;
const rate = (numerator, denominator) => denominator > 0
  ? `${((numerator / denominator) * 100).toFixed(1)}%`
  : 'n/a';

const q1 = count('scorecard:q1');
const result = count('scorecard:result');
const gateSuccess = count('scorecard:gate-success');
const reviewSuccess = count('hpr-waitlist:success');
const workshopSuccess = count('workshop-waitlist:success');
const privateSuccess = count('private-workshop:success');

console.log(`Built with Jon funnel — last ${days} day${days === 1 ? '' : 's'}`);
console.log('');
console.table([
  { stage: 'Scorecard loaded', events: q1, conversion: '—' },
  { stage: 'Scorecard result', events: result, conversion: rate(result, q1) },
  { stage: 'Report delivered', events: gateSuccess, conversion: rate(gateSuccess, q1) },
  { stage: 'Review waitlist', events: reviewSuccess, conversion: rate(reviewSuccess, gateSuccess) },
  { stage: 'Public workshop waitlist', events: workshopSuccess, conversion: '—' },
  { stage: 'Private workshop request', events: privateSuccess, conversion: '—' },
]);

console.log('Top events');
console.table(
  [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([event, hits]) => ({ event, hits })),
);
