# MCP Rollout Operations

## Distribution decision

The official MCP Registry listing remains the canonical machine-readable listing.
Do not submit the server to PulseMCP, mcp.so, Smithery, or Glama for this rollout.
Those directories primarily reach MCP implementers and automated discovery systems,
not the small-business owners this site is intended to serve. Reconsider only if
MCP analytics show qualified usage or a directory can demonstrate owner traffic.

## Friction-free owner path

Send owners to `https://builtwithjon.com/tools/`. It is a normal public webpage:
no account, connector, browser flag, or MCP installation is required. A person or
browser-capable agent can follow its ordinary links to the scorecard, calculators,
use cases, articles, and Hidden Profit Review.

`https://builtwithjon.com/mcp` is the optional Streamable HTTP endpoint for clients
that support configured remote MCP servers. Do not imply that pasting the MCP URL
into an ordinary chat automatically installs or invokes it.

## WebMCP decision gate

As of 2026-07-13, WebMCP is an experimental proposed browser standard. Chrome's
implementation is in an origin trial and testing requires experimental support;
Gemini in Chrome support was announced as coming later. Official documentation for
ChatGPT, Claude Chat, Claude Cowork, Claude Code, and Codex browser use does not
document WebMCP tool discovery or invocation from an arbitrary URL.

Do not ship WebMCP or market cross-client support until at least one target surface
supports all of the following without a custom extension or preinstalled connector:

1. The user sends or opens a public Built with Jon URL.
2. The client discovers the page's tools automatically.
3. The client invokes a read-only tool with visible user intent.
4. The flow works in the generally available product, not only behind a flag or trial.

Primary references:

- https://developer.chrome.com/docs/ai/webmcp
- https://developer.chrome.com/docs/ai/webmcp/compare-mcp
- https://developer.chrome.com/blog/ai-webmcp-origin-trial
- https://developer.chrome.com/docs/ai/webmcp/secure-tools

## Production rate limit

Cloudflare Security Rules contains one active rate-limiting rule named
`Protect public MCP endpoint`:

- Match: `(http.request.uri.path eq "/mcp" and not cf.client.bot)`
- Characteristic: source IP
- Threshold: 60 requests per 10 seconds
- Action: block
- Mitigation timeout: 10 seconds

The exact-path match protects JSON-RPC traffic without affecting `/mcp/` docs.
The Worker rejects non-GET requests on `/mcp/`, so the trailing slash cannot bypass
the rule. All protocol clients must use exact `/mcp`.
Known bots are exempt. The short timeout limits accidental bursts and cheap abuse
without leaving a legitimate client locked out for minutes. Cloudflare's Free plan
allows one rate-limiting rule, so changes should be deliberate.

Review the rule's Security Events and the MCP Analytics Engine queries after seven
days. Adjust only with evidence of false positives or sustained abuse.

## Weekly checkpoint

Run the MCP tool and client queries in `docs/analytics-queries.md`, then record:

- tool calls by tool name;
- recognizable client names;
- rate-limit events;
- `/tools/` views and starts;
- qualified visits to the scorecard, calculator, use cases, and review pages.

Traffic volume alone is not success. The useful signal is an owner progressing from
a tool into a diagnosis or review conversation.
