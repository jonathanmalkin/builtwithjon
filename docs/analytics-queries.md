# Analytics Queries

This site uses two Cloudflare analytics surfaces.

- Web Analytics shows page traffic, referrers, paths, countries, devices, and browser data.
- Workers Analytics Engine stores first-party action events from `data-track` links and `data-track-form` forms.

## Dashboards

- Web Analytics: https://dash.cloudflare.com/ea2af21c3301c8177f7ecbc77454b8e8/web-analytics
- Analytics Engine: https://dash.cloudflare.com/ea2af21c3301c8177f7ecbc77454b8e8/workers/analytics-engine

## Event Schema

Dataset: `site_events`

- `blob1`: event name, such as `cta:scorecard-nav`
- `blob2`: page path
- `blob3`: referrer host
- `double1`: event count, normally `1`
- `index1`: event category, the text before the colon

MCP server events (written directly by the worker, not via `/api/event`) use
the same shape with `index1 = 'mcp'`: `blob1` is `mcp:<tool>` (hyphenated,
e.g. `mcp:run-scorecard`, plus `mcp:initialize` and `mcp:tools-list`),
`blob2` is `/mcp`, and `blob3` carries the MCP client name from `initialize`
or the User-Agent instead of a referrer host.

Rows can take a few minutes to appear after the first writes.

## Production Smoke Test

```bash
curl -sS -X POST https://builtwithjon.com/api/event \
  -H 'Origin: https://builtwithjon.com' \
  -H 'Content-Type: application/json' \
  -d '{"e":"cta:test","p":"/"}'
```

Expected response:

```json
{"ok":true}
```

## SQL API Setup

These examples assume the Cloudflare values are already in the shell:

```bash
export CLOUDFLARE_ACCOUNT_ID="..."
export CLOUDFLARE_API_TOKEN="..."
```

Run a query:

```bash
curl -sS "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/analytics_engine/sql" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --data "SHOW TABLES"
```

## Recent Events

```sql
SELECT
  timestamp,
  blob1 AS event,
  blob2 AS path,
  blob3 AS referrer_host,
  index1 AS category
FROM site_events
WHERE timestamp > NOW() - INTERVAL '24' HOUR
ORDER BY timestamp DESC
LIMIT 50
```

## Top Events

```sql
SELECT
  blob1 AS event,
  blob2 AS path,
  SUM(double1 * _sample_interval) AS hits
FROM site_events
WHERE timestamp > NOW() - INTERVAL '24' HOUR
GROUP BY event, path
ORDER BY hits DESC
LIMIT 50
```

## CTA Events

```sql
SELECT
  blob1 AS event,
  blob2 AS path,
  SUM(double1 * _sample_interval) AS hits
FROM site_events
WHERE timestamp > NOW() - INTERVAL '7' DAY
  AND index1 = 'cta'
GROUP BY event, path
ORDER BY hits DESC
LIMIT 100
```

## Form Funnel

```sql
SELECT
  blob1 AS event,
  blob2 AS path,
  SUM(double1 * _sample_interval) AS hits
FROM site_events
WHERE timestamp > NOW() - INTERVAL '7' DAY
  AND blob1 IN (
    'contact:start',
    'contact:submit',
    'hpr-waitlist:start',
    'hpr-waitlist:submit',
    'hpr-waitlist:success',
    'workshop-waitlist:start',
    'workshop-waitlist:submit',
    'workshop-waitlist:success',
    'private-workshop:start',
    'private-workshop:submit',
    'private-workshop:success'
  )
GROUP BY event, path
ORDER BY path, event
```

## MCP Tool Calls

```sql
SELECT
  blob1 AS tool,
  SUM(double1 * _sample_interval) AS calls
FROM site_events
WHERE timestamp > NOW() - INTERVAL '7' DAY
  AND index1 = 'mcp'
GROUP BY tool
ORDER BY calls DESC
LIMIT 50
```

## Owner Tools Hub

```sql
SELECT
  blob1 AS event,
  SUM(double1 * _sample_interval) AS hits
FROM site_events
WHERE timestamp > NOW() - INTERVAL '7' DAY
  AND blob1 IN (
    'tools:view',
    'tools:start:scorecard',
    'tools:start:calculator',
    'tools:start:use-cases',
    'tools:copy-prompt',
    'tools:hpr-click'
  )
GROUP BY event
ORDER BY hits DESC
```

## MCP Clients

```sql
SELECT
  blob3 AS client,
  SUM(double1 * _sample_interval) AS calls
FROM site_events
WHERE timestamp > NOW() - INTERVAL '7' DAY
  AND index1 = 'mcp'
GROUP BY client
ORDER BY calls DESC
LIMIT 50
```

## Referrer Hosts

```sql
SELECT
  blob3 AS referrer_host,
  blob1 AS event,
  SUM(double1 * _sample_interval) AS hits
FROM site_events
WHERE timestamp > NOW() - INTERVAL '7' DAY
  AND blob3 != ''
GROUP BY referrer_host, event
ORDER BY hits DESC
LIMIT 50
```
