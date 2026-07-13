import { readFile } from "node:fs/promises";

import Ajv from "ajv";
import addFormats from "ajv-formats";

const server = JSON.parse(await readFile(new URL("../server.json", import.meta.url), "utf8"));
const schemaUrl = new URL(server.$schema);

if (schemaUrl.protocol !== "https:" || schemaUrl.hostname !== "static.modelcontextprotocol.io") {
  throw new Error("server.json must use an official HTTPS MCP Registry schema");
}

const response = await fetch(schemaUrl);
if (!response.ok) {
  throw new Error(`Could not load MCP Registry schema (${response.status})`);
}

const schema = await response.json();
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

if (!validate(server)) {
  for (const error of validate.errors ?? []) {
    console.error(`${error.instancePath || "/"} ${error.message}`);
  }
  process.exitCode = 1;
} else {
  console.log(`server.json matches ${server.$schema}`);
}
