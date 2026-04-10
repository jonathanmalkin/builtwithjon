---
title: "I Replaced Claude Code's Built-In Explore Agent. Here's What Actually Worked."
date: 2026-03-16
description: "Claude Code's Explore agent rediscovers your workspace from scratch every time. A pre-computed structural index cuts that to one read. Full code for both the index generator and the custom agent."
story: 1
tags: ["claude-code", "agents", "explore", "performance", "hooks"]
platforms:
  reddit: "https://www.reddit.com/r/ClaudeCode/comments/1ik2mty/i_replaced_claude_codes_builtin_explore_agent/"
draft: false
---

Every time Claude Code's built-in Explore agent answers a question about your codebase, it starts from zero. Glob for directories. Grep for patterns. Read a few files. Repeat. Five to fifteen tool calls per question, rediscovering structure it already mapped ten minutes ago.

I wrote about replacing it a few weeks back. That version used per-project indexes. It worked, but I never actually deployed it. This version is the real one, running in production on the workspace where I build everything. Single index file covering the entire workspace. Sub-second generation. The agent reads one file and knows where everything is.

## The Architecture

Three pieces:

**1. Index generator** (`generate-index.sh`, ~230 lines of bash). Runs at session start via a SessionStart hook. Scans the workspace and writes `.claude/index.md` with everything the Explore agent needs: project stacks, entry points, test locations, npm scripts, document structure, skill/agent/rule/hook inventories, cron job schedules. Takes under a second.

**2. Custom Explore agent** (`explore.md`). Overrides the built-in by placing a file with `name: explore` in `.claude/agents/`. Reads the index first, checks staleness, then does targeted drill-downs only when needed. Runs on Haiku for speed.

**3. SessionStart hook wiring**. One entry in `settings.json` that fires the generator before any Explore agent gets spawned.

## Why a Single Index

The original version generated one index per project in a `Code/` directory. That made sense for a workspace with multiple independent repos. But my workspace is a monorepo: code, documents, scripts, profiles, and Claude Code infrastructure all in one git repo. The Explore agent needs to answer questions that cross those boundaries. "Where are the client portal tests?" is a code question. "What's in the Content Pipeline?" is a docs question. "How many skills are there?" is an infrastructure question. One index handles all of them.

The result is 150 lines of markdown. Compact enough for Haiku to reason over accurately, comprehensive enough to answer most questions without a single additional tool call.

## The Freshness Gate

The generator runs at every session start, but it's smart about it. Before regenerating, it checks:

1. Does the index file exist?
2. Is it less than 5 minutes old? (Handles concurrent sessions.)
3. Does the commit hash embedded in the index match the current `HEAD`?

If all three pass, it exits in 25 milliseconds. You only pay the full generation cost after a new commit.

```bash
if [ "${1:-}" != "--force" ] && [ -f "$INDEX" ]; then
    index_age=$(( $(now_epoch) - $(file_epoch "$INDEX") ))
    if [ "$index_age" -lt 300 ]; then
        current_hash=$(git -C "$WORKSPACE" rev-parse --short HEAD 2>/dev/null || echo "none")
        index_hash=$(grep -oP '(?<=Commit: `)[a-f0-9]+' "$INDEX" 2>/dev/null | head -1 || echo "stale")
        if [ "$current_hash" = "$index_hash" ]; then
            exit 0
        fi
    fi
fi
```

Cross-platform too. macOS uses `stat -f %m`, Linux uses `stat -c %Y`. The script detects the platform once at startup and branches in helper functions.

## The Routing Table Pattern

This is the key insight. Instead of teaching the agent how to search, you give it a lookup table. Every directory in the workspace gets a row with its type and purpose:

```markdown
| Path | Type | Purpose |
|------|------|---------|
| `Code/my-app/` | project | React+TS frontend, PHP backend |
| `Documents/Content-Pipeline/` | docs | 5-stage content pipeline (has CLAUDE.md) |
| `.claude/skills/` | infra | 33 custom skills |
| `Terrain.md` | state | Live operational state |
```

The agent becomes a router, not a searcher. "Where are the client portal tests?" hits the routing table, finds the right project, and reads the project detail section. One lookup, not a recursive glob.

## The Agent

The custom agent overrides Claude Code's built-in Explore when you place a file with `name: explore` in `.claude/agents/`. Here's what makes it different:

**Index-first protocol.** Step 1 is always "read `.claude/index.md`." No exceptions. Most questions get answered right there.

**Staleness detection.** The agent compares the index's embedded commit hash against `git rev-parse --short HEAD`. If they differ, it notes the staleness and verifies details with direct reads.

**LSP enabled.** The built-in Explore agent doesn't have access to Language Server Protocol tools. This one does. "Where is this function defined?" gets a precise `goToDefinition` answer, not a grep guess.

**Haiku model.** Fast, cheap, preserves rate limits. The index does the heavy lifting. Haiku just reads a 150-line document and routes to the answer.

```yaml
---
name: explore
description: >
  Read-only workspace explorer with pre-computed structural index.
  Answers questions about codebase, documents, scripts, and infrastructure
  in 1-3 tool calls instead of 5-15.
model: haiku
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - LSP
---
```

## Performance

Real numbers from my workspace (4 code projects, 33 skills, 16 rules, 12 hooks, 5 document sections):

- **Index generation:** 0.96 seconds
- **Freshness gate (index is current):** 25 milliseconds
- **Index size:** 150 lines
- **Typical question ("Where are the client portal tests?"):** 4 tool calls (read index, check staleness, read test dirs, report)
- **Simple question ("How many skills?"):** 2 tool calls (read index, report)
- **Built-in Explore agent for the same questions:** 8-15 tool calls

## Setup

**1. Create the index generator**

Place `generate-index.sh` at `.claude/scripts/generate-index.sh` and make it executable. The script auto-discovers your workspace structure: it finds Node, Python, Rust, Go, PHP, and Docker projects automatically. No hardcoded paths.

**2. Create the Explore agent**

Place `explore.md` at `.claude/agents/explore.md`. The `name: explore` in the frontmatter is what triggers the override.

**3. Wire the SessionStart hook**

Add this to your `.claude/settings.json` hooks:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/scripts/generate-index.sh"
          }
        ]
      }
    ]
  }
}
```

**4. Gitignore the index**

Add `.claude/index.md` to your `.gitignore` (or verify it's already covered by a `.claude/*` pattern).

The full source for both files is in the Jules repo.

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules/tree/main/.claude/agents)*
