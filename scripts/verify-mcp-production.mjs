const origin = process.env.SITE_ORIGIN || 'https://builtwithjon.com';
const endpoint = `${origin}/mcp`;
const protocolVersion = '2025-06-18';
const timeoutMs = 10_000;

const failures = [];
const results = [];

const check = (name, condition, detail = '') => {
  results.push({ check: name, result: condition ? 'PASS' : 'FAIL', detail });
  if (!condition) failures.push(`${name}${detail ? `: ${detail}` : ''}`);
};

const request = async (name, url, init = {}) => {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
  } catch (error) {
    check(`${name} network`, false, error instanceof Error ? error.message : String(error));
    return null;
  }
};

const rpc = async (method, params, id) => {
  const response = await request(method, endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'MCP-Protocol-Version': protocolVersion,
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, ...(params ? { params } : {}) }),
  });
  if (!response) return {};
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  check(`${method} HTTP`, response.status === 200, `status ${response.status}`);
  check(`${method} JSON content type`, contentType.includes('application/json'), contentType);
  try {
    return JSON.parse(text);
  } catch {
    check(`${method} JSON body`, false, text.slice(0, 120));
    return {};
  }
};

const toolText = (payload) => payload?.result?.content
  ?.filter((item) => item?.type === 'text')
  .map((item) => item.text)
  .join('\n') || '';

const initialized = await rpc('initialize', {
  protocolVersion,
  capabilities: {},
  clientInfo: { name: 'builtwithjon-production-verifier', version: '1.0.0' },
}, 0);
check('initialize negotiates protocol', initialized?.result?.protocolVersion === protocolVersion,
  `protocol ${initialized?.result?.protocolVersion ?? 'missing'}`);

const initializedNotification = await request('notifications/initialized', endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'MCP-Protocol-Version': protocolVersion },
  body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
});
check('notifications/initialized acknowledged', initializedNotification?.status === 202,
  `status ${initializedNotification?.status ?? 'network error'}`);

const tools = await rpc('tools/list', undefined, 1);
check('tools/list exposes 11 tools', tools?.result?.tools?.length === 11,
  `count ${tools?.result?.tools?.length ?? 'missing'}`);
check('start_here is the first tool', tools?.result?.tools?.[0]?.name === 'start_here',
  `first ${tools?.result?.tools?.[0]?.name ?? 'missing'}`);

const start = await rpc('tools/call', {
  name: 'start_here',
  arguments: {},
}, 4);
const startText = toolText(start);
const startSucceeded = !start?.error && start?.result?.isError !== true;
check('start_here call succeeds', startSucceeded,
  start?.error?.message || (start?.result?.isError ? 'tool returned isError' : ''));
check('start_here maps the scorecard', startSucceeded && startText.includes('run_scorecard'));
check('start_here maps the calculators', startSucceeded && startText.includes('calculate_leak'));
check('start_here maps use cases', startSucceeded && startText.includes('search_use_cases'));
check('start_here explains privacy boundary', startSucceeded
  && startText.includes('read-only') && startText.includes('not stored'));

const leak = await rpc('tools/call', {
  name: 'calculate_leak',
  arguments: {
    calculator_id: 'missed-calls',
    inputs: { calls: 30, per: 3, ticket: 450 },
  },
}, 2);
check('calculate_leak returns $4,500', toolText(leak).includes('$4,500'));

const scorecard = await rpc('tools/call', {
  name: 'run_scorecard',
  arguments: {
    segment: 'hs',
    q2: 'A day or two',
    q3: 'Usually nothing',
    q6: 'A lot of manual copying',
    q7: 'Most weeks',
    q8: 'It slips, and some of it never gets chased',
  },
}, 3);
check('run_scorecard returns Wide open', toolText(scorecard).includes('Wide open'));

const browserGet = await request('browser GET', endpoint, {
  headers: { Accept: 'text/html' },
  redirect: 'manual',
});
check('browser GET redirects', browserGet?.status === 307, `status ${browserGet?.status ?? 'network error'}`);
const redirectLocation = browserGet?.headers.get('location');
check('browser GET redirects to /mcp/',
  redirectLocation && new URL(redirectLocation, origin).pathname === '/mcp/',
  `location ${redirectLocation}`);

const docs = await request('MCP docs', `${origin}/mcp/`);
check('MCP docs page', docs?.status === 200, `status ${docs?.status ?? 'network error'}`);

const slashPost = await request('slash-path POST', `${origin}/mcp/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 99, method: 'tools/list' }),
});
check('slash-path POST cannot bypass WAF path', slashPost?.status === 405,
  `status ${slashPost?.status ?? 'network error'}`);

const metadata = await request('MCP metadata', `${origin}/.well-known/mcp.json`);
check('MCP metadata', metadata?.status === 200, `status ${metadata?.status ?? 'network error'}`);

const sse = await request('SSE GET', endpoint, { headers: { Accept: 'text/event-stream' } });
check('SSE GET rejected', sse?.status === 405, `status ${sse?.status ?? 'network error'}`);

const options = await request('OPTIONS', endpoint, { method: 'OPTIONS' });
check('OPTIONS preflight', options?.status === 204, `status ${options?.status ?? 'network error'}`);
check('CORS allows public clients', options?.headers.get('access-control-allow-origin') === '*',
  `origin ${options?.headers.get('access-control-allow-origin') ?? 'missing'}`);

const llms = await request('llms.txt', `${origin}/llms.txt`);
const llmsText = llms ? await llms.text() : '';
check('llms.txt MCP section', llms?.status === 200 && llmsText.includes('MCP Server'));

for (const path of ['/scorecard/', '/use-cases/', '/tools/leak-calculator/']) {
  const response = await request(`${path} regression`, `${origin}${path}`);
  check(`${path} regression`, response?.status === 200, `status ${response?.status ?? 'network error'}`);
}

const reportWithoutOrigin = await request('scorecard report', `${origin}/api/scorecard-report`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '{}',
});
check('scorecard report rejects missing Origin', reportWithoutOrigin?.status === 403,
  `status ${reportWithoutOrigin?.status ?? 'network error'}`);

console.table(results);

if (failures.length) {
  console.error(`\n${failures.length} production verification check(s) failed.`);
  process.exit(1);
}

console.log(`\n${results.length} production verification checks passed.`);
