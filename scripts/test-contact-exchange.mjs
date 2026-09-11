// Exercise the real Worker in Node with deterministic KV and provider doubles.
// This deliberately sends no network requests and needs no Cloudflare account.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { recoveryOptions, recoveryMatches } from '../src/lib/qr-recovery.js';
import { introText, smsLink, CARD_URL, VCARD } from '../src/data/contact-card.js';
import { normalizePhone, validLinkedIn } from '../src/lib/scan-contact.js';
const dir = await mkdtemp(join(tmpdir(), 'bwj-contact-'));
const nativeFetch = globalThis.fetch;
const sent = [];
let failEmail = false;
let uncertainEmail = false;
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
      if (uncertainEmail) throw new TypeError('synthetic network failure');
      if (failEmail) return new Response('{}', {status:503});
      sent.push(JSON.parse(init.body)); return Response.json({id:'test-email'});
    }
    throw new Error('Unexpected provider request: '+url);
  };
  const fields = {name:'Alex Test',phone:'(512) 555-0123',inquiry_type:'scan:card',submission_id:'3d19c152-6c12-42f7-a690-2f2a7e92d181',company:'Example & Co',linkedin:'https://www.linkedin.com/in/alex-test'};
  const post = (data, overrides = {}, origin = 'https://builtwithjon.com') => worker.fetch(new Request('https://builtwithjon.com/api/contact', {method:'POST',headers:{Origin:origin},body:new URLSearchParams(data)}), {...env,...overrides});
  let r = await post(fields); assert.equal(r.status,200); assert.equal((await r.json()).stored,true);
  assert.equal(sent.length,1); assert.equal([...env.LEADS.records.keys()].filter(k=>k.startsWith('lead:')).length,1);
  const lead = JSON.parse([...env.LEADS.records.values()][0]); assert.equal(lead.phone,'+15125550123'); assert.equal(lead.company,'Example & Co'); assert.match(lead.capture_id,/^[a-f0-9]{64}$/);
  const envelope = sent[0].text.split('BEGIN BWJ CONTACT EXCHANGE JSON\n')[1].split('\nEND BWJ CONTACT EXCHANGE JSON')[0]; assert.deepEqual(JSON.parse(envelope),lead);
  assert.ok(sent[0].html.includes('href="sms:+15125550123"'));
  await post(fields); assert.equal(sent.length,1); assert.equal([...env.LEADS.records.keys()].filter(k=>k.startsWith('lead:')).length,1);
  console.log('PASS phone-only capture, normalized identity, email envelope, SMS link and retry dedupe');
  for (const bad of [{phone:'abc'},{phone:''},{phone:'',email:''},{phone:'abc',email:'alex@example.test'},{name:''},{email:'broken'},{linkedin:'https://linkedin.com.evil.test/in/a'},{submission_id:'../oops'},{message:'x'.repeat(2001)}]) assert.equal((await post({...fields,...bad})).status,400);
  assert.equal((await post([...Object.entries(fields),['phone','+15125550124']])).status,400);
  assert.equal((await post(fields,{},'https://untrusted.example')).status,403);
  assert.equal((await post(fields,{TURNSTILE_ENABLED:'true'})).status,403);
  assert.equal((await post({...fields,company_website:'spam'})).status,200); assert.equal(sent.length,1);
  assert.equal(normalizePhone('+44 20 7946 0123'),'+442079460123'); assert.equal(normalizePhone('123'),null); assert.ok(validLinkedIn(fields.linkedin));
  console.log('PASS malformed input, duplicate fields, origin, bot checks and international number');
  // Email alone is an accepted way to stay in touch; the notification then offers email instead of SMS.
  { const before=sent.length; const emailOnly=await post({...fields,name:'Email Only',phone:'',email:'email.only@example.test',submission_id:'7a0e2f3c-1b2d-4e5f-8a9b-0c1d2e3f4a5b'}); assert.equal(emailOnly.status,200);
    const stored=[...env.LEADS.records.entries()].filter(([k])=>k.startsWith('lead:qr:')).map(([,v])=>JSON.parse(v)).find(l=>l.name==='Email Only'); assert.equal(stored.phone,null); assert.equal(stored.email,'email.only@example.test');
    assert.ok(sent.length>before); assert.match(sent[sent.length-1].text||JSON.stringify(sent[sent.length-1]),/mailto:email\.only@example\.test/); }
  console.log('PASS email-only capture with mailto notification');
  assert.equal((await post({name:'Generic',email:'generic@example.test',inquiry_type:'contact'})).status,400);
  assert.equal((await post({name:'Generic',email:'generic@example.test',message:'A question',inquiry_type:'contact'})).status,200);
  console.log('PASS existing generic contact requirements');
  failEmail = true;
  r=await post({...fields,submission_id:'6ad914fa-3d9f-4ac7-b2a0-ec207045d0f1'}); const failed=await r.json(); assert.equal(failed.stored,true); assert.equal(failed.notified,false);
  failEmail=false; const before=sent.length; r=await post({...fields,submission_id:'6ad914fa-3d9f-4ac7-b2a0-ec207045d0f1'}); assert.equal((await r.json()).notified,true); assert.equal(sent.length,before+1);
  const delivered = JSON.parse(env.LEADS.records.get(`delivery:qr:${lead.capture_id}`));
  assert.equal(delivered.status, 'notified');
  const failedId = [...env.LEADS.records.keys()].filter(k => k.startsWith('lead:qr:')).at(-1);
  const original = JSON.parse(env.LEADS.records.get(failedId));
  const retryEnvelope = JSON.parse(sent.at(-1).text.split('BEGIN BWJ CONTACT EXCHANGE JSON\n')[1].split('\nEND BWJ CONTACT EXCHANGE JSON')[0]);
  assert.equal(retryEnvelope.submitted_at, original.submitted_at);
  assert.equal(retryEnvelope.capture_id, original.capture_id);
  console.log('PASS original capture timestamp and durable delivery state after retry');
  assert.equal(CARD_URL, 'https://builtwithjon.com/card/');
  const draft = introText('Renée & Taylor', 'We met at the café.');
  assert.ok(draft.includes('Renée & Taylor')); assert.ok(!draft.includes('['));
  assert.equal(introText('Alex'), 'Hi Jonathan! It’s Alex. From your QR card.');
  assert.equal(decodeURIComponent(smsLink(draft).split('?body=')[1]),draft);
  assert.ok(smsLink(draft,true).includes('&body=')); assert.ok(VCARD.includes('TEL;TYPE=CELL,VOICE:+15123874308'));
  const opts = recoveryOptions(['--since','2026-09-01','--until','2026-09-30']);
  assert.ok(recoveryMatches({...lead,submitted_at:'2026-09-10T12:00:00Z'}, {status:'failed'}, opts));
  assert.ok(!recoveryMatches({...lead,submitted_at:'2026-09-10T12:00:00Z'}, {status:'notified'}, opts));
  assert.throws(()=>recoveryOptions(['--since','2026-09-01','--until','2026-09-30','--limit','1000']));
  console.log('PASS personalized SMS, vCard and bounded recovery selection');
  const eventEnv = { LEADS:new KV(), SUBSCRIBE_DEDUPE:new KV(), FORM_RATE_LIMITS_ENABLED:'true', QR_RATE_LIMIT_IP_HOURLY:'60', FORM_RATE_LIMIT_GLOBAL_DAILY:'100' };
  for(let i=0;i<50;i++) {
    const response = await post({...fields,name:`Test ${i}`,phone:`+1512555${String(i).padStart(4,'0')}`,submission_id:crypto.randomUUID()},eventEnv);
    assert.equal(response.status,200); assert.equal((await response.json()).notified,true);
  }
  for(let i=50;i<60;i++) assert.equal((await post({...fields,name:`Test ${i}`,phone:`+1512555${String(i).padStart(4,'0')}`,submission_id:crypto.randomUUID()},eventEnv)).status,200);
  assert.equal((await post({...fields,phone:'+15125559998',submission_id:crypto.randomUUID()},eventEnv)).status,429);
  // Generic forms retain their separate 20/IP/hour cap.
  for(let i=0;i<20;i++) assert.equal((await post({name:'Generic',email:`g${i}@example.test`,message:'Question',inquiry_type:'contact'},eventEnv)).status,200);
  assert.equal((await post({name:'Generic',email:'blocked@example.test',message:'Question',inquiry_type:'contact'},eventEnv)).status,429);
  const budgetEnv = {LEADS:new KV(),SUBSCRIBE_DEDUPE:new KV(),FORM_RATE_LIMITS_ENABLED:'true',FORM_RATE_LIMIT_GLOBAL_DAILY:'1'};
  await post({...fields,submission_id:crypto.randomUUID()},budgetEnv);
  const capped=await (await post({...fields,phone:'+15125559999',submission_id:crypto.randomUUID()},budgetEnv)).json();
  assert.equal(capped.stored,true); assert.equal(capped.notified,false);
  assert.ok([...budgetEnv.LEADS.records.values()].some(v=>JSON.parse(v).reason==='budget_exhausted'));
  console.log('PASS 50 shared-IP QR contacts, unchanged generic cap and exhausted sender budget');
  const uncertainEnv = { LEADS:new KV(), SUBSCRIBE_DEDUPE:new KV() };
  const uncertainFields = {...fields,submission_id:crypto.randomUUID()};
  uncertainEmail=true;
  assert.equal((await (await post(uncertainFields,uncertainEnv)).json()).notified,false);
  uncertainEmail=false;
  const sentBeforeReview=sent.length;
  assert.equal((await (await post(uncertainFields,uncertainEnv)).json()).notified,false);
  assert.equal(sent.length,sentBeforeReview);
  assert.ok([...uncertainEnv.LEADS.records.values()].some(v=>JSON.parse(v).status==='uncertain'));
  class DeliveryWriteFailure extends KV { async put(key,value) { if(key.startsWith('delivery:')) throw new Error('synthetic metadata outage'); return super.put(key,value); } }
  const metadataFailure = await (await post({...fields,submission_id:crypto.randomUUID()}, {LEADS:new DeliveryWriteFailure(),SUBSCRIBE_DEDUPE:new KV()})).json();
  assert.equal(metadataFailure.stored,true); assert.equal(metadataFailure.notified,false);
  console.log('PASS uncertain send held for reconciliation and metadata outage preserves saved truth');
  r=await post(fields,{LEADS:undefined}); assert.equal(r.status,502);
  console.log('PASS archived notification failure, retry recovery and unavailable storage');
} finally { globalThis.fetch=nativeFetch; await rm(dir,{recursive:true,force:true}); }
