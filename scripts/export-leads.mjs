import { spawnSync } from "node:child_process";
import { recoveryOptions, recoveryMatches } from "../src/lib/qr-recovery.js";

const wrangler = "./node_modules/.bin/wrangler";
const local = process.argv.includes("--local");
const persistenceIndex = process.argv.indexOf("--persist-to");
const persistence = persistenceIndex >= 0 ? process.argv[persistenceIndex + 1] : "";
const targetArgs = local ? ["--local"] : ["--remote"];
if (local && persistence) targetArgs.push("--persist-to", persistence);

function run(args) {
  const result = spawnSync(wrangler, args, { encoding: "utf8" });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || `wrangler exited ${result.status}\n`);
    process.exit(result.status || 1);
  }
  return result.stdout;
}

function csv(value) {
  let text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  // Neutralize spreadsheet formula injection: values starting with = + - @ (or a
  // leading tab/CR) are treated as formulas by Excel/Sheets. Prefix with a quote.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

if (process.argv.includes("--qr")) {
  let options;
  try { options = recoveryOptions(process.argv.slice(2)); }
  catch (error) { process.stderr.write(`${error.message}\n`); process.exit(2); }
  const keys = JSON.parse(run(["kv", "key", "list", "--binding=LEADS", "--prefix=lead:qr:", ...targetArgs]));
  let scanned = 0, emitted = 0;
  for (const item of keys) {
    if (scanned >= options.scanLimit || emitted >= options.limit) break;
    scanned++;
    const lead = JSON.parse(run(["kv", "key", "get", item.name, "--binding=LEADS", "--text", ...targetArgs]));
    // Older entries may have no metadata. Read at most one delivery record per lead.
    const result = spawnSync(wrangler, ["kv", "key", "get", `delivery:qr:${lead.capture_id}`, "--binding=LEADS", "--text", ...targetArgs], { encoding: "utf8" });
    let delivery = null;
    if (result.status === 0 && result.stdout.trim()) {
      try { delivery = JSON.parse(result.stdout); } catch { /* Retain unknown, not notified. */ }
    }
    if (recoveryMatches(lead, delivery, options)) {
      process.stdout.write(JSON.stringify({ source_key: item.name, lead, delivery: delivery || { status: "unknown" } }) + "\n");
      emitted++;
    }
  }
  process.stderr.write(`QR recovery: ${scanned}/${keys.length} listed keys inspected; ${emitted} records exported. ${scanned < keys.length ? 'INCOMPLETE: limit reached; narrow or increase bounded coverage before claiming all failures were recovered.' : 'Listed keys exhausted.'}\n`);
  process.exit(0);
}

const columns = [
  "email", "name", "form_id", "segment", "tier", "scores", "answers",
  "source_url", "attribution", "submitted_at", "details",
];
const known = new Set(columns.filter((column) => column !== "details"));
const keys = JSON.parse(run(["kv", "key", "list", "--binding=LEADS", "--prefix=lead:", ...targetArgs]));

process.stdout.write(`${columns.map(csv).join(",")}\n`);
for (const item of keys) {
  const raw = run(["kv", "key", "get", item.name, "--binding=LEADS", "--text", ...targetArgs]);
  const record = JSON.parse(raw);
  const details = Object.fromEntries(Object.entries(record).filter(([key]) => !known.has(key)));
  const row = columns.map((column) => csv(column === "details" ? details : record[column]));
  process.stdout.write(`${row.join(",")}\n`);
}
