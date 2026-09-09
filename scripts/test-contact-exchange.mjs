// Exercise the real Worker in Node with deterministic KV and provider doubles.
// This deliberately sends no network requests and needs no Cloudflare account.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { normalizePhone, validLinkedIn } from '../src/lib/scan-contact.js';
const dir = await mkdtemp(join(tmpdir(), 'bwj-contact-'));
const nativeFetch = globalThis.fetch;
const sent = [];
let failEmail = false;
class KV {
  records = new Map();
  async get(k) { return this.records.get(k) ?? null; }
  async put(k, v) { this.records.set(k, v); }
}
try {
  await build({ entryPoints: ['src/worker.js'], bundle: true, platform: 'node', format: 'esm', outfile: join(dir, 'worker.mjs') });
  const worker = (await import(pathToFileURL(join(dir, 'worker.mjs')))).default;
  const groups = ['consent:pending','consent:confirmed','source:newsletter','offer:hidden-profit-review','asset:invoice-chase-kit','asset:follow-up-swipe-file','asset:leak-calculator','asset:starter-kit-cowork','offer:email-course','source:scorecard'];
  const env = { LEADS: new KV(), SUBSCRIBE_DEDUPE: new KV(), TURNSTILE_ENABLED: 'false', FORM_RATE_LIMITS_ENABLED: 'false', SENDER_CAPTURE_ENABLED: 'true', SENDER_SENDS_ENABLED: 'true', SENDER_API_TOKEN: 'test-only', FORM_HASH_SALT: 'test-only-long-enough', SENDER_FROM: 'Built with Jon <jonathan@builtwithjon.com>', SENDER_GROUP_IDS: JSON.stringify(Object.fromEntries(groups.map((g,i)=>[g,String(i)]))) };
  globalThis.fetch = async (url, init) => {
    if (String(url).includes('/subscribers/') && init.method === 'GET') return new Response('{}', {status:404});
    if (String(url).endsWith('/message/send')) {
      if (failEmail) return new Response('{}', {status:503});
      sent.push(JSON.parse(init.body)); return Response.json({id:'test-email'});
    }
    throw new Error('Unexpected provider request: '+url);
  };
  const fields = {name:'Alex Test',phone:'(512) 555-0123',inquiry_type:'scan:card',submission_id:'3d19c152-6c12-42f7-a690-2f2a7e92d181',company:'Example & Co',linkedin:'https://www.linkedin.com/in/alex-test'};
  const post = (data, overrides = {}, origin = 'https://builtwithjon.com') => worker.fetch(new Request('https://builtwithjon.com/api/contact', {method:'POST',headers:{Origin:origin},body:new URLSearchParams(data)}), {...env,...overrides});
  let r = await post(fields); assert.equal(r.status,200); assert.equal((await r.json()).stored,true);
  assert.equal(sent.length,1); assert.equal(env.LEADS.records.size,1);
  const lead = JSON.parse([...env.LEADS.records.values()][0]); assert.equal(lead.phone,'+15125550123'); assert.equal(lead.company,'Example & Co'); assert.match(lead.capture_id,/^[a-f0-9]{64}$/);
  const envelope = sent[0].text.split('BEGIN BWJ CONTACT EXCHANGE JSON\n')[1].split('\nEND BWJ CONTACT EXCHANGE JSON')[0]; assert.deepEqual(JSON.parse(envelope),lead);
  assert.ok(sent[0].html.includes('href="sms:+15125550123"'));
  await post(fields); assert.equal(sent.length,1); assert.equal(env.LEADS.records.size,1);
  console.log('PASS phone-only capture, normalized identity, email envelope, SMS link and retry dedupe');
  for (const bad of [{phone:'abc'},{name:''},{email:'broken'},{linkedin:'https://linkedin.com.evil.test/in/a'},{submission_id:'../oops'},{message:'x'.repeat(2001)}]) assert.equal((await post({...fields,...bad})).status,400);
  assert.equal((await post([...Object.entries(fields),['phone','+15125550124']])).status,400);
  assert.equal((await post(fields,{},'https://untrusted.example')).status,403);
  assert.equal((await post(fields,{TURNSTILE_ENABLED:'true'})).status,403);
  assert.equal((await post({...fields,company_website:'spam'})).status,200); assert.equal(sent.length,1);
  assert.equal(normalizePhone('+44 20 7946 0123'),'+442079460123'); assert.equal(normalizePhone('123'),null); assert.ok(validLinkedIn(fields.linkedin));
  console.log('PASS malformed input, duplicate fields, origin, bot checks and international number');
  assert.equal((await post({name:'Generic',email:'generic@example.test',inquiry_type:'contact'})).status,400);
  assert.equal((await post({name:'Generic',email:'generic@example.test',message:'A question',inquiry_type:'contact'})).status,200);
  console.log('PASS existing generic contact requirements');
  failEmail = true;
  r=await post({...fields,submission_id:'6ad914fa-3d9f-4ac7-b2a0-ec207045d0f1'}); const failed=await r.json(); assert.equal(failed.stored,true); assert.equal(failed.notified,false);
  failEmail=false; const before=sent.length; r=await post({...fields,submission_id:'6ad914fa-3d9f-4ac7-b2a0-ec207045d0f1'}); assert.equal((await r.json()).notified,true); assert.equal(sent.length,before+1);
  r=await post(fields,{LEADS:undefined}); assert.equal(r.status,502);
  console.log('PASS archived notification failure, retry recovery and unavailable storage');
} finally { globalThis.fetch=nativeFetch; await rm(dir,{recursive:true,force:true}); }
