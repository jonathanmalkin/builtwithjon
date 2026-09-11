// Local synthetic browser tests. Never run this against a public site.
import assert from 'node:assert/strict';
import { mkdir, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { resolve } from 'node:path';
const playwright = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = playwright.chromium || playwright.default?.chromium;
if (!chromium) throw new Error('PLAYWRIGHT_MODULE must resolve to a Playwright entry file exporting chromium.');
const base = process.env.QR_BASE_URL || 'http://127.0.0.1:4322';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Use a local preview only.');
const out = resolve(process.env.QR_QA_DIR || '/private/tmp/bwj-contact-browser');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
const results = [];
const fakeVerification = `window.turnstile = {
 render(el, options) { window.testVerification = options; const input = document.createElement('input'); input.type='hidden'; input.name='cf-turnstile-response'; input.value='synthetic-token'; el.append(input); queueMicrotask(()=>options.callback('synthetic-token')); return 'local-test'; },
 remove() { document.querySelectorAll('[name="cf-turnstile-response"]').forEach(x=>x.remove()); }, reset() {}
};`;
async function context(viewport, script = fakeVerification, options = {}) {
 const ctx = await browser.newContext({ viewport, ...options });
 await ctx.route('https://challenges.cloudflare.com/**', route=>route.fulfill({status:200,contentType:'application/javascript',body:script}));
 // Analytics is not part of a synthetic capture test.
 await ctx.route('**/api/event', route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
 return ctx;
}
async function fill(page, name='Renée & Taylor', phone='(512) 555-0123') {
 await page.locator('#exchange-name').fill(name);
 await page.locator('#exchange-phone').fill(phone);
}
async function dimensions(page) {
 return page.evaluate(()=>({ width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,
  controls:[...document.querySelectorAll('button,a,summary,input:not([type="hidden"])')].filter(el=>el.getBoundingClientRect().width && getComputedStyle(el).visibility!=='hidden' && !el.classList.contains('exchange-honeypot')).map(el=>({text:(el.textContent||el.getAttribute('name')||'').trim(),height:el.getBoundingClientRect().height})),
  submitBottom:document.querySelector('[type="submit"]').getBoundingClientRect().bottom
 }));
}
try {
 for (const [name,width,height] of [['small',320,740],['mobile',390,844],['large-mobile',430,932],['desktop',1280,800]]) {
  const ctx=await context({width,height},fakeVerification,{hasTouch:width<700}); const page=await ctx.newPage();
  let posts=0;
  await page.route('**/api/contact',route=>{posts++;return route.fulfill({status:200,contentType:'application/json',body:'{"stored":true,"notified":true}'});});
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`${base}/card/`); await page.locator('[type="submit"]:enabled').waitFor();
  await page.evaluate(()=>document.fonts.ready);
  const dim=await dimensions(page); assert.equal(dim.width,width); assert.ok(dim.scrollWidth<=width,JSON.stringify(dim));
  if(name==='mobile') assert.ok(dim.submitBottom<height,'Primary action must fit initial mobile screen.');
  assert.ok(dim.controls.every(c=>c.height>=43),JSON.stringify(dim.controls.filter(c=>c.height<43)));
  await page.screenshot({path:`${out}/card-${name}.png`,fullPage:true});
  await fill(page); await page.locator('#exchange-email').fill('test@example.test'); await page.locator('#exchange-context').fill('We met at the café.');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
  if(name==='mobile') await page.screenshot({path:`${out}/card-mobile-expanded.png`,fullPage:true});
  await page.locator('[type="submit"]').click();
  await page.locator('[data-exchange-success]:visible').waitFor();
  assert.equal(posts,1);
  const sms=await page.locator('[data-sms-next]').getAttribute('href');
  assert.ok(decodeURIComponent(sms).includes('It’s Renée & Taylor. We met at the café.')); assert.ok(!sms.includes('%5B'));
  assert.equal(await page.evaluate(()=>document.activeElement.id),'exchange-saved-title');
  await page.evaluate(()=>window.testVerification['expired-callback']());
  assert.equal(await page.locator('[data-exchange-success]').isVisible(),true);
  // Phones get the SMS step; a laptop gets the number and an email path instead of a dead sms: button.
  assert.equal(await page.locator('[data-next-sms] [data-sms-next]').isVisible(), width<700);
  assert.equal(await page.locator('.exchange-success .exchange-desktop-note').isVisible(), width>=700);
  assert.equal(await page.locator('[data-exchange-entry]').isVisible(),false);
  await page.screenshot({path:`${out}/card-${name}-saved.png`,fullPage:true});
  await page.goto(`${base}/qr/`); await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
  if(name==='mobile'||name==='desktop')await page.screenshot({path:`${out}/qr-${name}.png`,fullPage:true});
  assert.deepEqual(errors,[]);
  results.push({test:name,status:'pass',dimensions:dim}); await ctx.close();
 }
 // Verification outage is recoverable, without transmitting a form.
 {
  const ctx=await context({width:390,height:844},''); const page=await ctx.newPage();
  await page.goto(`${base}/card/`);
  await page.locator('[data-security-retry]:visible').waitFor();
  assert.equal(await page.locator('[type="submit"]').isDisabled(),true);
  await page.screenshot({path:`${out}/card-mobile-verification-error.png`,fullPage:true});
  await ctx.unroute('https://challenges.cloudflare.com/**');
  await ctx.route('https://challenges.cloudflare.com/**',route=>route.fulfill({status:200,contentType:'application/javascript',body:fakeVerification}));
  await page.locator('[data-security-retry]').click();
  await page.locator('[type="submit"]:enabled').waitFor();
  results.push({test:'Verification outage and retry',status:'pass'}); await ctx.close();
 }
 // Request failure/retry, unchanged IDs and no false saved state.
 {
  const ctx=await context({width:390,height:844},fakeVerification,{hasTouch:true}); const page=await ctx.newPage();const bodies=[];let count=0;
  await page.route('**/api/contact',route=>{
   bodies.push(route.request().postData()); count++;
   return route.fulfill({status:count===1?502:200,contentType:'application/json',body:count===1?'{}':'{"stored":true,"notified":false}'});
  });
  await page.goto(`${base}/card/`); await page.locator('[type="submit"]:enabled').waitFor(); await fill(page);
  await page.locator('[type="submit"]').click(); await page.locator('.exchange-status:visible').waitFor();
  assert.equal(await page.locator('[data-exchange-success]').isVisible(),false);
  assert.equal(await page.locator('#exchange-name').inputValue(),'Renée & Taylor');
  await page.screenshot({path:`${out}/card-mobile-save-error.png`,fullPage:true});
  await page.locator('[type="submit"]:enabled').click();await page.locator('[data-exchange-success]:visible').waitFor();
  const id=body=>body.match(/name="submission_id"\r\n\r\n([^\r]+)/)[1]; assert.equal(id(bodies[0]),id(bodies[1]));
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('bwj-exchange:scan:card')),null);
  results.push({test:'Save failure retains input and retry ID; stored/not-notified succeeds truthfully',status:'pass'});await ctx.close();
 }
 // Keyboard, validation, enlarged text, dark preference and short viewport.
 {
  const ctx=await context({width:390,height:500},fakeVerification,{colorScheme:'dark',reducedMotion:'reduce',hasTouch:true}); const page=await ctx.newPage();let posts=0;
  await page.route('**/api/contact',route=>{posts++;return route.abort();});
  await page.goto(`${base}/claude-meetup/`);await page.locator('[type="submit"]:enabled').waitFor();
  await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'exchange-name');
  await fill(page,'Alex','abc');await page.locator('[type="submit"]').click(); assert.equal(posts,0);
  assert.ok(await page.locator('#exchange-phone').evaluate(el=>!!el.validationMessage));
  // Neither mobile nor email is a validation stop; email alone is enough.
  await page.locator('#exchange-phone').fill('');await page.locator('[type="submit"]').click(); assert.equal(posts,0);
  assert.match(await page.locator('#exchange-phone').evaluate(el=>el.validationMessage),/mobile number or an email/);
  await page.locator('#exchange-email').fill('alex@example.test');await page.locator('[type="submit"]').click(); assert.equal(posts,1);
  await page.locator('.exchange-status:visible').waitFor();
  await page.unroute('**/api/contact'); await page.route('**/api/contact',route=>route.fulfill({status:200,contentType:'application/json',body:'{"stored":true,"notified":true}'}));
  await page.locator('[type="submit"]:enabled').click(); await page.locator('[data-exchange-success]:visible').waitFor();
  // Email-only visitors get an email step, not a text step they cannot complete.
  assert.equal(await page.locator('[data-next-email]').isVisible(),true); assert.equal(await page.locator('[data-next-sms]').isVisible(),false);
  assert.ok(decodeURIComponent(await page.locator('[data-next-email] [data-email-next]').getAttribute('href')).startsWith('mailto:jonathan@builtwithjon.com?subject=Staying in touch&body=Hi Jonathan! It’s Alex.'));
  await page.addStyleTag({content:'html {font-size:200% !important}'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);
  await page.screenshot({path:`${out}/card-enlarged-text.png`,fullPage:true});
  results.push({test:'Keyboard, invalid phone, 200% text, dark preference and keyboard-height layout',status:'pass'});await ctx.close();
 }
 // Browser form → actual bundled Worker → local KV/provider doubles.
 {
  const tmp=await mkdtemp(`${tmpdir()}/bwj-browser-worker-`);
  try {
   await build({entryPoints:['src/worker.js'],bundle:true,platform:'node',format:'esm',outfile:`${tmp}/worker.mjs`});
   const worker=(await import(pathToFileURL(`${tmp}/worker.mjs`))).default;
   class KV {records=new Map();async get(k){return this.records.get(k)||null;}async put(k,v){this.records.set(k,v);}}
   const groups=['consent:pending','consent:confirmed','source:newsletter','offer:hidden-profit-review','asset:invoice-chase-kit','asset:follow-up-swipe-file','asset:leak-calculator','asset:starter-kit-cowork','offer:email-course','source:scorecard'];
   const env={LEADS:new KV(),SUBSCRIBE_DEDUPE:new KV(),TURNSTILE_ENABLED:'false',FORM_RATE_LIMITS_ENABLED:'false',SENDER_CAPTURE_ENABLED:'true',SENDER_SENDS_ENABLED:'true',SENDER_API_TOKEN:'synthetic',FORM_HASH_SALT:'synthetic-long-enough',SENDER_FROM:'Built with Jon <jonathan@builtwithjon.com>',SENDER_GROUP_IDS:JSON.stringify(Object.fromEntries(groups.map((g,i)=>[g,String(i)])))};
   const ctx=await context({width:390,height:844},fakeVerification,{hasTouch:true});const page=await ctx.newPage();let notifications=0;
   await page.route('**/api/contact',async route=>{
    const originalFetch=globalThis.fetch;
    try {
     globalThis.fetch=async (url,options)=>{if(String(url).includes('/subscribers/') && options.method==='GET')return new Response('{}',{status:404});assert.ok(String(url).endsWith('/message/send'));notifications++;return Response.json({id:'synthetic-notification'});};
     const response=await worker.fetch(new Request('https://builtwithjon.com/api/contact',{method:'POST',headers:{'content-type':route.request().headers()['content-type'],Origin:'https://builtwithjon.com'},body:route.request().postDataBuffer()}),env);
     await route.fulfill({status:response.status,contentType:'application/json',body:await response.text()});
    }finally{globalThis.fetch=originalFetch;}
   });
   await page.goto(`${base}/card/`);await page.locator('[type="submit"]:enabled').waitFor();await fill(page,'Integration Test');
   await page.locator('[type="submit"]').click();await page.locator('[data-exchange-success]:visible').waitFor();
   const leads=[...env.LEADS.records.entries()].filter(([key])=>key.startsWith('lead:qr:'));
   assert.equal(leads.length,1);assert.equal(notifications,1);assert.equal(JSON.parse(leads[0][1]).phone,'+15125550123');
   results.push({test:'Browser multipart form through actual Worker to synthetic storage and notification',status:'pass'});await ctx.close();
  }finally{await rm(tmp,{recursive:true,force:true});}
 }
 // Preview works on an insecure local network and never posts or loads verification.
 if (process.env.QR_PREVIEW_URL) {
  const preview = process.env.QR_PREVIEW_URL;
  if (!['localhost','127.0.0.1'].includes(new URL(preview).hostname) && !new URL(preview).hostname.startsWith('192.168.')) throw new Error('Preview must be local.');
  const ctx = await browser.newContext({viewport:{width:390,height:844}}); const page = await ctx.newPage(); let posts=0,checks=0;
  page.on('request',req=>{if(req.method()==='POST' && new URL(req.url()).pathname==='/api/contact')posts++;if(req.url().includes('challenges.cloudflare.com'))checks++;});
  await page.goto(`${preview}/card/`);await fill(page,'Preview Test');
  await page.locator('[type="submit"]').click();await page.locator('[data-exchange-success]:visible').waitFor();
  assert.ok((await page.locator('[data-exchange-success]').innerText()).includes('Nothing was submitted'));
  assert.equal(posts,0);assert.equal(checks,0);
  results.push({test:'Preview no-submit behavior on local-network HTTP',status:'pass'});await ctx.close();
 }
 console.log(JSON.stringify(results,null,2));
 await writeFile(`${out}/browser-results.json`,JSON.stringify(results,null,2)+'\n');
} finally {await browser.close();}
