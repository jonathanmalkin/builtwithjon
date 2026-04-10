---
title: "I Automated My Morning Briefing With Claude Code and a 990-Line Shell Script"
date: 2026-03-21
description: "A deep dive into running Claude Code as a background service. Three-phase orchestrator, parallel dispatch, memory synthesis safety rails, and every claude -p gotcha I discovered the hard way."
story: 1
tags: ["claude-code", "jules", "automation", "bash", "morning-briefing", "claude-p"]
draft: false
---

Every morning at 7 AM, a launchd job fires a shell script that reads my operational state, synthesizes the last 24 hours of activity, and generates a briefing. By the time I open Claude Code, it knows what happened yesterday, what's stuck, what decisions are pending, and what to focus on today.

This is the first "Claude Code as a background service" architecture I've built. The gotchas were real and mostly undocumented. Here's what it does, how it works, and what I'd change.

---

## What the morning looks like

7:00 AM: `launchd` fires `morning-orchestrator.sh`.

The script runs three phases:
1. **Parallel background tasks** — Claude Code change monitor + memory synthesis + RSS feed fetch (all run simultaneously)
2. **Auto-apply safe memory updates** — if the synthesis found low-risk changes, apply them
3. **Briefing generation** — pipe everything into `claude -p` with Opus, save the output

When I open Claude Code and say "good morning," a SessionStart hook surfaces the briefing. Jules (my Claude Code persona) reads the briefing and gives me the executive summary. The whole thing takes 2-3 minutes of wall clock time, mostly waiting for the LLM calls.

### Before vs. after

Before this existed: I'd open a terminal, type "good morning," and Jules would ask me what I was working on. I'd spend the first 10-15 minutes reconstructing context from yesterday. What did I finish? What's still open? What did I say I'd do next? That's not a great use of morning brain.

After: I say "good morning" and Jules already knows. The briefing is pre-generated. Within about 30 seconds of that first message, I have a prioritized list of what matters today and why.

The difference feels small until you've done it for a month. You stop losing the thread between sessions.

### What the briefing actually looks like

Here's a representative excerpt (dates and specifics genericized):

```
## Today's Focus
1. Deploy client intake fix — breaking for mobile users, blocking new submissions
2. Review memory synthesis proposals from last night (3 items flagged)
3. Content queue: two articles ready to post, window opens Tuesday

## Pending Decisions
- Domain rebrand: 120 naming candidates narrowed, final choice needed
  Revisit date: overdue by 3 days
- AI consulting: evaluate post-SXSW
  No deadline set

## Yesterday's Activity
Commits: 4 (client portal — intake flow, mobile viewport fixes, email template)
Session report: Fixed mobile form submission bug. Identified date math issue
in the scheduling summary. Left a TODO in intake.tsx:287.

## Waiting On
- Austin Simply Fit trainer follow-up (initiated Mar 12, no response)
- CPA engagement letter (sent Mar 10)

## Bold Move
You've been heads-down on intake infrastructure for 8 days straight. The content
queue has two approved articles sitting idle. 90 minutes of posting + engagement
today would be higher leverage than another infrastructure session.
```

That "Bold Move" section is the part I didn't expect to find useful. It's just Jules noticing a pattern across session reports and surfacing it. But it's consistently accurate. It's caught three situations where I was optimizing local tasks while ignoring higher-priority work.

On Mondays, the script generates a weekly review edition instead of the daily format: last week's progress synthesized from session reports, commitments check, stuck items, and a week-ahead plan. More than most of what I'd capture in a manual weekly review, done automatically.

---

## The orchestrator architecture

The script is ~990 lines of bash. That sounds like a lot. Most of it is input assembly — gathering data from a dozen sources and formatting it into a prompt.

### Phase 1: Parallel background tasks

Three tasks run simultaneously:

**Change monitor** (`monitor-claude-changes.sh`) — Checks Anthropic's changelog, release feed, and 9 documentation pages for updates. If anything changed, it pipes the diffs through `claude -p` for analysis. This is its own ~550-line script.

**Memory synthesis** — Extracts session topics from the last 7 days of `history.jsonl`, compares them against the current `MEMORY.md`, and proposes updates. Classifies each as "auto-apply" (safe to change without review) or "needs review" (requires my sign-off). Runs on Haiku.

**RSS feed fetch** — Pulls recent posts from AI news feeds I subscribe to. Light processing, no LLM call.

All three run as background processes (`&`). The orchestrator waits for all of them before proceeding. If any fail, the others still produce output.

```bash
# Phase 1: Parallel background tasks
"$SCRIPTS_DIR/monitor-claude-changes.sh" $MONITOR_FLAGS > /tmp/morning-monitor-$$.log 2>&1 &
MONITOR_PID=$!

run_memory_synthesis > "$MEMORY_SYNTHESIS_FILE" 2>/dev/null &
MEMORY_PID=$!

"$SCRIPTS_DIR/fetch-ai-reading.sh" > "$AI_READING_FILE" 2>/dev/null &
AI_READING_PID=$!

# Phase 2: Wait for all background tasks
if wait "$MONITOR_PID"; then
    log "Monitor completed successfully."
else
    log "[warn] Monitor exited with error (continuing anyway)."
fi

if wait "$MEMORY_PID"; then
    log "Memory synthesis completed."
fi

wait "$AI_READING_PID" 2>/dev/null || true
```

### Phase 2: Auto-apply memory updates

If the memory synthesis found low-risk changes — project status updates, new timestamps, factual info backed by multiple sessions — the script applies them directly to `MEMORY.md`.

This is where it gets interesting, and a little scary.

Memory is the connective tissue between sessions. Every session, Jules reads `MEMORY.md` as part of context. If that file drifts from reality or gets corrupted, every subsequent session starts from a wrong baseline. The stakes are higher than they look.

The synthesis prompt asks Haiku to do a specific job: compare what's in `MEMORY.md` against recent session activity, identify what's stale or missing, and classify each proposed change as "auto-apply" (factual, low-risk, backed by multiple data points) or "needs review" (strategic, structural, or uncertain).

The auto-apply safety rails:
- Back up `MEMORY.md` before any edit
- Reject output that's less than 50% of the original line count (catches truncation — the LLM dropped half the file)
- Reject output that's more than 200% of the original line count (catches hallucination — the LLM added paragraphs of invented context)
- Only apply items explicitly marked "auto-apply" — everything else surfaces in the briefing for my review

```bash
# Safety rails for memory auto-apply
cp "$MEMORY_FILE" "$BACKUP_DIR/MEMORY-$TODAY.md.bak"

ORIGINAL_LINES=$(wc -l < "$MEMORY_FILE")
UPDATED_MEMORY=$(cat "$MEMORY_SYNTHESIS_FILE")
UPDATED_LINES=$(echo "$UPDATED_MEMORY" | wc -l)

# Reject if <50% (truncated) or >200% (hallucinated)
MIN_LINES=$(( ORIGINAL_LINES / 2 ))
MAX_LINES=$(( ORIGINAL_LINES * 2 ))

if [ "$UPDATED_LINES" -ge "$MIN_LINES" ] && [ "$UPDATED_LINES" -le "$MAX_LINES" ]; then
    echo "$UPDATED_MEMORY" > "$MEMORY_FILE"
    log "MEMORY.md updated ($ORIGINAL_LINES → $UPDATED_LINES lines)."
else
    log "[warn] Failed safety check ($UPDATED_LINES lines vs $ORIGINAL_LINES original). Skipping."
fi
```

Why 50% and 200%? They're conservative bounds for catching the two most common failure modes. A model that silently drops half your memory file is worse than a model that proposes no changes. The bounds don't catch everything, but they catch the catastrophic cases.

In practice, the auto-apply fires about 60% of mornings. When it does, it's usually updating a "last updated" timestamp or marking a completed task as done. Structural changes reliably land in "needs review," which is exactly the behavior I want.

### Phase 3: Briefing generation

This is where all the data comes together. The script assembles a prompt from:

- `Terrain.md` (my operational dashboard — current projects, priorities, waiting-on items)
- Yesterday's git log
- Today's change monitor report (if anything was detected)
- Memory synthesis results
- Session reports from `/wrap-up` (structured summaries of what got done, decisions made, open items)
- `Decision-Log.md` (for revisit-date scanning)
- AI reading excerpts (from RSS)
- Pre-computed signals: overdue decision revisits, stale memory entries, abandoned content drafts

The assembled prompt goes to `claude -p` with a system prompt that defines the briefing format:

```bash
BRIEFING_CONTENT=$(run_claude_with_timeout 180 claude -p \
    --model opus \
    --system-prompt "$SYSTEM_PROMPT" \
    --tools "" \
    --strict-mcp-config \
    --max-turns 1 \
    --output-format text \
    < "$INPUT_FILE")
```

Opus handles the synthesis because it needs to do date math (calculating days-until for deadlines), merge conflicting data sources, and make judgment calls about what matters today.

A lighter model would save money here. But when I tried Haiku for briefing generation, it hallucinated `tool_call` JSON blocks in the output instead of generating clean text. Haiku with `--tools ""` sometimes outputs raw tool-calling syntax. Opus and Sonnet don't.

The Monday weekly review edition uses the same pipeline but a different system prompt. Instead of "what matters today," it asks for: last week's progress synthesized from session reports, commitments made vs. delivered, stuck items carrying over, and a forward plan for the week ahead. Takes about the same time to generate, substantially more useful to read than any weekly review I'd write myself.

---

## The `claude -p` gotchas

Running `claude -p` from shell scripts has specific failure modes that aren't documented anywhere. I discovered all of these the hard way.

**`--strict-mcp-config` is mandatory.** Without it, `claude -p` starts every MCP server defined in your settings — even with `--tools ""`. Those MCP server processes are children of the claude process. When the timeout kills claude, the children survive and hold stdout open. If you're running `claude -p` inside `$()`, the subshell blocks indefinitely waiting for stdout to close.

The fix: `--strict-mcp-config` tells claude to only start MCP servers explicitly listed in the command. Since we're not listing any, none start. No zombie children.

**`unset CLAUDECODE` before calling.** Claude Code sets a `CLAUDECODE` environment variable. If you call `claude -p` from a script that's already running inside Claude Code (like during development), the nested call detects the variable and refuses to start. Always unset it before scripted calls:

```bash
unset CLAUDECODE 2>/dev/null || true
```

**`timeout -k 15` for SIGKILL safety net.** macOS `timeout` sends SIGTERM. If the process doesn't die, `-k 15` sends SIGKILL 15 seconds later. Without this, a hung `claude -p` can block the orchestrator forever.

**Haiku hallucinates tool calls.** When Haiku runs with `--tools ""` and `--output-format text`, it sometimes outputs JSON blocks that look like tool call requests instead of plain text. This corrupts output files. Use Sonnet or Opus for tasks where the output format matters. Haiku is fine for analysis where the output feeds another LLM step.

**Batch large inputs.** My change monitor can produce 900KB of raw data (Anthropic's changelog includes full system prompt diffs). One `claude -p` call can't handle that. The solution: each data source gets its own call with an 80KB input cap, and a merge step combines the outputs. If any individual call fails, the others still produce results.

---

## The notification chain

Getting the briefing to my attention was the second hard problem after generating it.

**File output.** The briefing saves to `Documents/Field-Notes/YYYY-MM-DD-Briefing.md` (dated archive) and `Briefing.md` at the workspace root (always-current copy).

**SessionStart hook.** My `good-morning` skill reads `Briefing.md` and presents it. The skill triggers on "good morning," "what's today look like," "morning rundown."

**Monitor report.** The change monitor report is surfaced separately by `inbox-notify.sh` if there are unread items. The briefing clears the monitor's unread marker so I don't see the same report twice.

**macOS notification.** `terminal-notifier` fires when the orchestrator finishes: "Morning Briefing Ready — say 'good morning' to Jules."

The notification chain sounds overbuilt. In practice, I mostly just say "good morning" and the hook handles it. The macOS notification is there for the mornings I'm not already at my desk at 7:05 AM.

---

## What I'd change

The orchestrator is over-engineered for what it does. Three `claude -p` calls (monitor, synthesis, briefing) when one well-constructed prompt with all the data could probably do 80% of the job.

The memory auto-apply is the riskiest part. It's editing a file that affects every future session. The safety rails (backup, line-count bounds) help, but I still review the "Needs Review" items manually in the briefing. If I were starting over, I might skip auto-apply entirely and just surface the proposals. Less automation, more control over the most sensitive piece of state.

The RSS reading is the least valuable part. The AI summaries are fine but rarely actionable. I'd cut it to reduce the orchestrator's runtime.

A few things I'd keep:

**The parallel execution pattern.** Three things running simultaneously instead of sequentially cuts the wall clock time roughly in half. The pattern works. Worth keeping.

**Session report integration.** Knowing what I committed yesterday, in structured format, is genuinely useful. The session reports come from `/wrap-up` — a skill that runs at the end of each working session and saves a structured summary of what got done, decisions made, and open items. The briefing's access to those reports is probably the highest-signal input in the whole system.

**Deadline scanning.** The orchestrator pre-computes overdue decision revisit dates and stale items before the LLM call. The LLM doesn't have to discover them from raw data. The pre-computation catches what the LLM might otherwise smooth over. It's caught two overdue decision-revisit dates in six weeks of running.

The meta-lesson: Claude Code as a background service is powerful but fragile. The `claude -p` gotchas are real. If you're building something similar, start with `--strict-mcp-config`, `timeout -k 15`, and `unset CLAUDECODE`. Then add complexity slowly.

The architecture I'd recommend for someone starting from scratch: get the briefing generation working first (one `claude -p` call, all your context in a single prompt). Run it manually for a week. Add the launchd scheduling once you trust the output. Add memory synthesis last, if at all.

The goal isn't a complex system. The goal is knowing what to work on in the morning without having to reconstruct it yourself.

---

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*
