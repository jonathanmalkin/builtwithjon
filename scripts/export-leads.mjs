import { spawnSync } from "node:child_process";

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
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
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
