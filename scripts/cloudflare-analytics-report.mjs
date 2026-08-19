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
  blob2 AS path,
  blob4 AS blob4,
  blob5 AS ai_source,
  SUM(double1 * _sample_interval) AS hits
FROM site_events
WHERE timestamp > NOW() - INTERVAL '${days}' DAY
GROUP BY event, path, blob4, ai_source
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

const hitsOf = (row) => Number(row.hits || 0);
const eventName = (row) => String(row.event || 'unknown');
const rowPath = (row) => String(row.path || '');
const aiSourceOf = (row) => String(row.ai_source || '').trim();
const isAi = (row) => aiSourceOf(row) !== '';

const normalizePath = (path) => {
  const raw = String(path || '');
  if (raw === '/business-map' || raw === '/business-map/') return null;
  const trimmed = raw.replace(/\/+$/, '');
  return trimmed || '/';
};

const totals = new Map();
for (const row of rows) {
  const event = eventName(row);
  totals.set(event, (totals.get(event) || 0) + hitsOf(row));
}

const count = (event) => totals.get(event) || 0;
const rate = (numerator, denominator) => denominator > 0
  ? `${((numerator / denominator) * 100).toFixed(1)}%`
  : 'n/a';

const scorecardView = count('scorecard:view');
const scorecardStart = count('scorecard:start');
const result = count('scorecard:result');
const gateSuccess = count('scorecard:gate-success');
const reviewCta = count('cta:waitlist-scorecard');
const reviewStart = count('hpr-waitlist:start');
const reviewSubmit = count('hpr-waitlist:submit');
const reviewSuccess = count('hpr-waitlist:success');
const toolsView = count('tools:view');
const toolsScorecard = count('tools:start:scorecard');
const toolsCalculator = count('tools:start:calculator');
const toolsUseCases = count('tools:start:use-cases');
const toolsReview = count('tools:hpr-click');

console.log(`Built with Jon funnel — last ${days} day${days === 1 ? '' : 's'}`);
console.log('');
console.log('Scorecard');
console.table([
  { stage: 'Scorecard viewed', events: scorecardView, conversion: '—', end_to_end: '—' },
  { stage: 'Scorecard started', events: scorecardStart, conversion: rate(scorecardStart, scorecardView), end_to_end: '—' },
  { stage: 'Scorecard result', events: result, conversion: rate(result, scorecardStart), end_to_end: '—' },
  { stage: 'Report delivered', events: gateSuccess, conversion: rate(gateSuccess, result), end_to_end: rate(gateSuccess, scorecardView) },
]);

console.log('');
console.log('Hidden Profit Review');
console.table([
  { stage: 'Scorecard waitlist CTA', events: reviewCta, conversion: '—' },
  { stage: 'Waitlist started', events: reviewStart, conversion: rate(reviewStart, reviewCta) },
  { stage: 'Waitlist submitted', events: reviewSubmit, conversion: rate(reviewSubmit, reviewStart) },
  { stage: 'Waitlist success', events: reviewSuccess, conversion: rate(reviewSuccess, reviewSubmit) },
]);

console.log('');
console.log('Owner tools hub');
console.table([
  { stage: 'Tools hub viewed', events: toolsView, conversion: '—' },
  { stage: 'Scorecard started', events: toolsScorecard, conversion: rate(toolsScorecard, toolsView) },
  { stage: 'Calculator started', events: toolsCalculator, conversion: rate(toolsCalculator, toolsView) },
  { stage: 'Use cases opened', events: toolsUseCases, conversion: rate(toolsUseCases, toolsView) },
  { stage: 'Review clicked', events: toolsReview, conversion: rate(toolsReview, toolsView) },
]);

const mcpHandshakes = count('mcp:initialize') + count('mcp:tools-list');
const mcpToolCalls = [...totals.entries()]
  .filter(([event]) => event.startsWith('mcp:') && !['mcp:initialize', 'mcp:tools-list'].includes(event))
  .sort((a, b) => b[1] - a[1]);

console.log('');
console.log('MCP usage');
console.table([
  { event: 'Discovery/crawler handshakes', hits: mcpHandshakes },
  ...mcpToolCalls.map(([event, hits]) => ({ event, hits })),
]);

const aiPageViews = rows
  .filter((row) => eventName(row) === 'page:view' && isAi(row))
  .reduce((sum, row) => sum + hitsOf(row), 0);

const aiPageViewsBySource = new Map();
const aiPageViewsByPath = new Map();
for (const row of rows) {
  if (eventName(row) !== 'page:view' || !isAi(row)) continue;
  const source = aiSourceOf(row) || 'unknown';
  const path = normalizePath(rowPath(row));
  aiPageViewsBySource.set(source, (aiPageViewsBySource.get(source) || 0) + hitsOf(row));
  if (path) aiPageViewsByPath.set(path, (aiPageViewsByPath.get(path) || 0) + hitsOf(row));
}

const directCaptures = rows
  .filter((row) => eventName(row) === 'business-map:capture'
    && normalizePath(rowPath(row)) === '/'
    && isAi(row))
  .reduce((sum, row) => sum + hitsOf(row), 0);

const workshopSubmits = rows
  .filter((row) => eventName(row) === 'workshop-host:submit' && isAi(row))
  .reduce((sum, row) => sum + hitsOf(row), 0);

const aiDirectViews = aiPageViewsByPath.get('/') || 0;
const aiWorkshopViews = [...aiPageViewsByPath.entries()]
  .filter(([path]) => path === '/workshops' || path.startsWith('/workshops/'))
  .reduce((sum, [, hits]) => sum + hits, 0);

console.log('');
console.log('AI-attributed channels');
console.log('Direct = business-map:capture on /. /business-map/ is retired and excluded.');
console.table([
  { stage: 'AI-referred page:view', events: aiPageViews, conversion: '—' },
  { stage: 'AI-referred views on /', events: aiDirectViews, conversion: rate(aiDirectViews, aiPageViews) },
  { stage: 'Direct email captures', events: directCaptures, conversion: rate(directCaptures, aiDirectViews) },
  { stage: 'AI-referred views on /workshops/', events: aiWorkshopViews, conversion: rate(aiWorkshopViews, aiPageViews) },
  { stage: 'Workshop host submits', events: workshopSubmits, conversion: rate(workshopSubmits, aiWorkshopViews) },
]);

if (aiPageViewsBySource.size) {
  console.log('');
  console.log('AI-referred page:view by source');
  console.table(
    [...aiPageViewsBySource.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([source, hits]) => ({ source, hits })),
  );
}

const edgeRows = rows.filter((row) => eventName(row) === 'edge:visit');
if (edgeRows.length) {
  const edgeByKind = new Map();
  const edgeByFamily = new Map();
  for (const row of edgeRows) {
    const kind = String(row.blob4 || 'unknown');
    const family = String(row.ai_source || kind);
    edgeByKind.set(kind, (edgeByKind.get(kind) || 0) + hitsOf(row));
    if (kind !== 'human') {
      edgeByFamily.set(`${kind}:${family}`, (edgeByFamily.get(`${kind}:${family}`) || 0) + hitsOf(row));
    }
  }
  console.log('');
  console.log('Edge visits');
  console.table(
    ['fetcher', 'crawler', 'human']
      .filter((kind) => edgeByKind.has(kind))
      .map((kind) => ({ kind, hits: edgeByKind.get(kind) })),
  );
  if (edgeByFamily.size) {
    console.log('');
    console.log('AI fetchers vs crawlers');
    console.table(
      [...edgeByFamily.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([label, hits]) => ({ label, hits })),
    );
  }
}

console.log('Top events');
console.table(
  [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([event, hits]) => ({ event, hits })),
);
