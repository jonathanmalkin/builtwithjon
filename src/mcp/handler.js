// Stateless MCP server transport (Streamable HTTP, JSON responses) for the
// builtwithjon Cloudflare Worker. Hand-rolled on purpose: the tools are pure,
// read-only functions, so the protocol surface is a small JSON-RPC dispatch —
// no SDK, no sessions, no server-initiated streams.
//
// Spec notes for the stateless subset implemented here:
// - POST /mcp answers every request with Content-Type: application/json
//   (a spec-legal alternative to SSE).
// - No Mcp-Session-Id header is ever set — that is how clients detect a
//   stateless server.
// - GET /mcp with Accept: text/event-stream gets 405 (no server push).
//   Browser-style GET /mcp redirects to the static /mcp/ docs page.

import { toolList, callTool, ToolInputError } from "./tools";

const MCP_PATH = "/mcp";
const MAX_BODY_BYTES = 64_000;
const MAX_BATCH = 10;
const SUPPORTED_PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];
const LATEST_PROTOCOL_VERSION = "2025-06-18";

const SERVER_INFO = {
  name: "builtwithjon",
  title: "Built with Jon — Hidden Profit tools",
  version: "1.0.0",
};

const INSTRUCTIONS =
  "Tools from builtwithjon.com — Jonathan Malkin, AI Workflow Consultant & Implementation Partner. " +
  "Use them to diagnose where a small business is leaking deals, time, and cash: " +
  "run_scorecard scores the 3-minute diagnostic conversationally, calculate_leak puts a dollar figure on a specific leak, " +
  "search_use_cases / get_use_case browse 96 worked automation examples, get_frameworks explains the decide-before-you-automate " +
  "frameworks, search_articles / get_article read the writing, and get_hidden_profit_review_info describes the paid review. " +
  "Everything is read-only; results include links for the human's next step.";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, Mcp-Session-Id, MCP-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version",
  "Access-Control-Max-Age": "86400",
};

export function isMcpRequest(url, request) {
  if (url.pathname !== MCP_PATH) return false;
  if (request.method === "OPTIONS" || request.method === "POST") return true;
  // /mcp must reach the worker so browser GETs can redirect to the canonical
  // trailing-slash docs URL. /mcp/ is always the static documentation page.
  if (request.method === "GET") return true;
  const accept = request.headers.get("Accept") || "";
  return accept.includes("text/event-stream");
}

export async function handleMcp(request, env) {
  if (!originAllowed(request, env)) {
    return jsonResponse(errorFor(null, -32600, "Origin not allowed"), 403);
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method === "GET") {
    const accept = request.headers.get("Accept") || "";
    if (!accept.includes("text/event-stream")) {
      return Response.redirect(new URL("/mcp/", request.url), 307);
    }
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32000, message: "This server does not offer a server-initiated event stream. POST JSON-RPC messages to /mcp." },
        id: null,
      }),
      { status: 405, headers: { ...CORS_HEADERS, Allow: "POST, OPTIONS", "Content-Type": "application/json" } }
    );
  }

  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { ...CORS_HEADERS, Allow: "POST, OPTIONS" } });
  }

  const protocolVersion = request.headers.get("MCP-Protocol-Version");
  if (protocolVersion && !SUPPORTED_PROTOCOL_VERSIONS.includes(protocolVersion)) {
    return jsonResponse(errorFor(null, -32600, `Unsupported MCP-Protocol-Version: ${protocolVersion}`), 400);
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse(errorFor(null, -32600, "Request body too large"), 413);
  }

  let raw;
  try {
    raw = await request.text();
  } catch {
    raw = "";
  }
  if (raw.length > MAX_BODY_BYTES) {
    return jsonResponse(errorFor(null, -32600, "Request body too large"), 413);
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return jsonResponse(errorFor(null, -32700, "Parse error"), 400);
  }

  const isBatch = Array.isArray(body);
  const messages = isBatch ? body : [body];
  if (!messages.length || messages.length > MAX_BATCH) {
    return jsonResponse(errorFor(null, -32600, `Batches must contain 1-${MAX_BATCH} messages`), 400);
  }

  const responses = [];
  for (const message of messages) {
    const response = await handleMessage(message, request, env);
    if (response) responses.push(response);
  }

  // All notifications: acknowledge with 202 and no body.
  if (!responses.length) {
    return new Response(null, { status: 202, headers: CORS_HEADERS });
  }

  return jsonResponse(isBatch ? responses : responses[0], 200);
}

async function handleMessage(message, request, env) {
  if (!message || typeof message !== "object" || message.jsonrpc !== "2.0" || typeof message.method !== "string") {
    return errorFor(message?.id ?? null, -32600, "Invalid Request");
  }

  const { method, params, id } = message;
  const isNotification = id === undefined || id === null;

  if (method.startsWith("notifications/")) {
    return null;
  }
  if (isNotification) {
    // Requests require an id; a non-notification method without one is invalid,
    // but per JSON-RPC we stay silent rather than answer an id-less message.
    return null;
  }

  try {
    switch (method) {
      case "initialize": {
        track(env, "mcp:initialize", clientName(params, request));
        const requested = typeof params?.protocolVersion === "string" ? params.protocolVersion : "";
        const protocolVersion = SUPPORTED_PROTOCOL_VERSIONS.includes(requested)
          ? requested
          : LATEST_PROTOCOL_VERSION;
        return resultFor(id, {
          protocolVersion,
          capabilities: { tools: {} },
          serverInfo: SERVER_INFO,
          instructions: INSTRUCTIONS,
        });
      }
      case "ping":
        return resultFor(id, {});
      case "tools/list":
        track(env, "mcp:tools-list", clientName(params, request));
        return resultFor(id, { tools: toolList() });
      case "tools/call": {
        const name = typeof params?.name === "string" ? params.name : "";
        track(env, `mcp:${name.replace(/[^a-z0-9]+/g, "-") || "unknown"}`, clientName(params, request));
        const result = await callTool(name, params?.arguments, { env, request });
        if (result === null) {
          return errorFor(id, -32602, `Unknown tool: ${name}`);
        }
        return resultFor(id, result);
      }
      default:
        return errorFor(id, -32601, `Method not found: ${method}`);
    }
  } catch (err) {
    if (err instanceof ToolInputError) {
      return errorFor(id, -32602, err.message);
    }
    console.error("mcp request failed", err);
    return errorFor(id, -32603, "Internal error");
  }
}

function clientName(params, request) {
  const fromInit = params?.clientInfo?.name;
  const value = `${typeof fromInit === "string" ? fromInit : ""} ${request.headers.get("User-Agent") || ""}`.toLowerCase();
  const knownClients = [
    ["claude", "claude"],
    ["cursor", "cursor"],
    ["smithery", "smithery"],
    ["inspector", "mcp-inspector"],
    ["curl", "curl"],
  ];
  return knownClients.find(([needle]) => value.includes(needle))?.[1] || "other";
}

function originAllowed(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(env.SITE_ORIGIN || "https://builtwithjon.com").origin;
  } catch {
    return false;
  }
}

// Folded into the site's existing Analytics Engine events (same shape as the
// /api/event beacon: blobs [event, path, client], doubles [1], indexes
// [category]) so the standard site_events queries pick MCP traffic up.
function track(env, event, client) {
  if (!env.SITE_EVENTS) return;
  try {
    env.SITE_EVENTS.writeDataPoint({ blobs: [event.slice(0, 64), "/mcp", client], doubles: [1], indexes: ["mcp"] });
  } catch (err) {
    console.error("mcp event write failed", err);
  }
}

function resultFor(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function errorFor(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function jsonResponse(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
