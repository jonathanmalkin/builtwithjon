import { readdir, readFile } from 'node:fs/promises';

const siteOrigin = new URL('https://builtwithjon.com');
const endpoint = 'https://api.indexnow.org/indexnow';
const key = '23de13f42d48764bae55b0ac7a24791c';
const keyLocation = new URL(`/${key}.txt`, siteOrigin).href;
const maxUrls = 10_000;
const distDirectory = new URL('../dist/', import.meta.url);

// These routes are intentionally private, transactional, or otherwise excluded
// from indexing. Keep this list aligned with noindex routes in src/pages.
const quietPaths = new Set([
  '/404',
  '/ai-assistant/course/thanks',
  '/card',
  '/claude-meetup',
  '/email-confirmed',
  '/hidden-profit-review/thanks',
  '/next/thanks',
  '/for-dad-h56jbv15ver',
]);

const usage = `Usage: npm run indexnow:submit -- [--dry-run] <changed-url> [changed-url ...]

Submit only canonical, changed builtwithjon.com URLs after ${keyLocation} is live.
The script rejects private/noindex routes.`;

function fail(message) {
  throw new Error(`${message}\n\n${usage}`);
}

function canonicalPathname(url) {
  return url.pathname.replace(/\/+$/, '') || '/';
}

function isQuietPath(pathname) {
  return quietPaths.has(pathname);
}

function parseChangedUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    fail(`Invalid URL: ${value}`);
  }

  if (url.origin !== siteOrigin.origin) {
    fail(`URL must use the ${siteOrigin.origin} origin: ${value}`);
  }
  if (url.username || url.password || url.port) {
    fail(`URL cannot include credentials or a port: ${value}`);
  }
  if (url.search || url.hash) {
    fail(`URL must be a canonical page URL without a query string or fragment: ${value}`);
  }

  const pathname = canonicalPathname(url);
  if (isQuietPath(pathname)) {
    fail(`Refusing to submit an excluded route: ${url.href}`);
  }

  url.pathname = pathname === '/' ? '/' : `${pathname}/`;
  return url.href;
}

function parseArgs(args) {
  let dryRun = false;
  const urls = [];

  for (const arg of args) {
    if (arg === '--dry-run') {
      dryRun = true;
    } else if (arg.startsWith('--')) {
      fail(`Unknown option: ${arg}`);
    } else {
      urls.push(parseChangedUrl(arg));
    }
  }

  if (!urls.length) fail('Provide at least one changed URL.');

  const urlList = [...new Set(urls)];
  if (urlList.length > maxUrls) {
    fail(`IndexNow accepts at most ${maxUrls.toLocaleString()} URLs per request.`);
  }

  return { dryRun, urlList };
}

async function loadIndexableUrls() {
  let names;
  try {
    names = await readdir(distDirectory);
  } catch (error) {
    throw new Error(`Could not read the built sitemap. Run npm run build first.\n${error.message}`);
  }

  const sitemapNames = names.filter((name) => /^sitemap-\d+\.xml$/.test(name));
  if (!sitemapNames.length) {
    throw new Error('No built page sitemap found. Run npm run build first.');
  }

  const indexableUrls = new Set();
  for (const name of sitemapNames) {
    const xml = await readFile(new URL(name, distDirectory), 'utf8');
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      indexableUrls.add(match[1].replaceAll('&amp;', '&'));
    }
  }
  return indexableUrls;
}

async function requireIndexableUrls(urlList) {
  const indexableUrls = await loadIndexableUrls();
  for (const url of urlList) {
    if (!indexableUrls.has(url)) {
      fail(`URL is not in the built sitemap and will not be submitted: ${url}`);
    }
  }
}

async function verifyLiveKey() {
  let response;
  try {
    response = await fetch(keyLocation, { cache: 'no-store', redirect: 'error' });
  } catch (error) {
    throw new Error(`Could not verify the deployed IndexNow key at ${keyLocation}. Deploy the site first.\n${error.message}`);
  }

  if (!response.ok) {
    throw new Error(`IndexNow key verification failed (${response.status}) at ${keyLocation}. Deploy the site first.`);
  }

  const body = (await response.text()).trim();
  if (body !== key) {
    throw new Error(`IndexNow key verification failed: ${keyLocation} does not contain the expected key. Deploy the site first.`);
  }
}

async function main() {
  const { dryRun, urlList } = parseArgs(process.argv.slice(2));
  await requireIndexableUrls(urlList);
  const payload = {
    host: siteOrigin.host,
    key,
    keyLocation,
    urlList,
  };

  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    console.log(`\nDry run: would POST ${urlList.length} URL${urlList.length === 1 ? '' : 's'} to ${endpoint}.`);
    return;
  }

  await verifyLiveKey();

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(`IndexNow submission could not reach ${endpoint}.\n${error.message}`);
  }

  const responseBody = (await response.text()).trim();
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`IndexNow submission failed (${response.status} ${response.statusText}).${responseBody ? `\n${responseBody}` : ''}`);
  }

  const status = response.status === 200
    ? 'received successfully'
    : 'received; key validation is pending';
  console.log(`IndexNow ${status}: ${urlList.length} URL${urlList.length === 1 ? '' : 's'}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
