---
title: "Claude Code 10 Levels: Running My Production Setup Against the Mastery Framework"
seoTitle: "Claude Code 10 Levels: My Production Setup vs. the Mastery Framework"
date: 2026-03-13
description: "I ran my 116-configuration Claude Code setup against @darnoux's 10-level mastery framework. Level by level breakdown with practical details at each stage."
story: 1
tags: ["claude-code", "skills", "hooks", "infrastructure", "vps", "agents"]
platforms:
  reddit: "https://www.reddit.com/r/ClaudeCode/comments/..."
draft: false
---

[darnoux published a 10-level framework for Claude Code mastery](https://github.com/darnoux/claude-code-level-up). Levels 0 through 10, from "using Claude like ChatGPT in a terminal" all the way to "agents spawning agents in autonomous loops."

I've been building a production setup for about three months. 30+ skills, hooks as middleware, a VPS running 24/7, subagent orchestration with model selection. I ran it against the framework honestly.

Here's the breakdown, level by level.

---

## Levels 0-2: Table Stakes

Almost everyone reading this is already here.

- **Level 0:** Claude Code open. No CLAUDE.md. Treating it like a smarter terminal autocomplete.
- **Level 1:** CLAUDE.md exists. Claude has context about who you are and what you're building.
- **Level 2:** MCP servers connected. Live data flows in: filesystem, browser, APIs.

My CLAUDE.md is 6 profile files deep: identity, voice profile, business context, quarterly goals, operational state. Level 1 sounds simple but it's load-bearing for everything above it. The more accurate your CLAUDE.md, the less you're steering and the more the setup just goes.

---

## Level 3: Skilled (3+ custom slash commands)

The framework says "3+ custom slash commands." I have 30+.

The gap between a macro and a skill with routing logic is significant. Some examples:

- `/good-morning` : multi-phase briefing that reads operational state, surfaces stale items and decision queue, pulls in cron job status
- `/scope` : validates requirements and identifies risks before any code gets written, chains to a plan
- `/systematic-debugging` : forces the right diagnostic sequence instead of jumping to fixes
- `/deploy-quiz` : validates locally, deploys to staging, smoke tests, deploys to production (with approval gates)
- `/wrap-up` : end-of-session checklist: commit, memory updates, terrain sync, retro flag

Skills as reusable workflows. The investment compounds because each new task gets a refined process instead of improvised execution.

---

## Level 4: Context Architect (memory that compounds)

The framework describes "memory system where patterns compound over time."

Claude Code's auto memory writes to `/memory/` on every session. Four typed categories: user, feedback, project, reference.

The **feedback** type is where the compounding actually happens. When I correct something ("don't do X, do Y instead") that gets saved as a feedback memory with the *why*. Next session, the behavior changes. It's how I stop making the same correction twice across sessions.

Without the feedback type, memory is just a notepad. With it, the system actually learns.

---

## Level 5: System Builder, the inflection point

The framework says most users plateau here. I think that's right, and the reason matters.

Levels 0-4 are about making Claude more useful. Level 5 is about making Claude *safer* to give real autonomy to. That requires thinking like a system architect.

**Subagents with model selection.** Not all tasks need the same model. Research goes to Haiku (fast, good enough). Synthesis to Sonnet. Complex decisions to Opus. Route wrong and you get either slow expensive results or thin quality where you needed depth.

**Hooks as middleware.** Three hooks running on every command:

```
Safety guard     → intercepts rm, force-push, broad git ops before they run
Output compression → prevents verbose commands from bloating context
Date injection   → live date in every response, no drift
```

**Decision cards instead of yes/no gates.** Format: `[DECISION] Summary | Rec: X | Risk: Y | Reversible? Yes/No -> Approve/Reject/Discuss`. Vague approval gates get bypassed. Structured decision cards get actually reviewed.

The Level 5 inflection is real. Below it, you're a power user. At it and above, you're running a system.

---

## Levels 6-7: Pipelines and Browser Automation

**Level 6:** Claude called headless via `claude -p` in bash pipelines. My tweet scheduler, email triage, and morning orchestrator all use this pattern. Claude becomes a processing step in a larger workflow, not just an interactive assistant.

**Level 7:** Browser automation via Playwright. One hard-won lesson: screenshots are base64 context bombs (~100KB each). Browser work must run in isolated subagents, not inline. Found this out when context bloated mid-session and the quality degraded noticeably. Now it's a rule: all Chrome MCP work delegates to a subagent.

---

## Levels 8-9: Always-On Infrastructure

This is where "Claude as a tool" becomes "Claude as infrastructure."

Setup: DigitalOcean VPS, Docker container with supervised entrypoint, SSH server, Slack daemon for async communication.

7 cron jobs:

| Job | Schedule |
|-----|----------|
| Morning orchestrator | 5:00 AM |
| Tweet scheduler | 5x/day (8, 10, 12, 3, 6 PM) |
| Catch-up scheduler | Every 15 min |
| Auth heartbeat | 4x/day |
| Git auto-pull | Every 1 min |
| Slack daemon restart | Every 1 min |

Claude is running whether I'm at the keyboard or not. The morning briefing is ready before I open my laptop. Tweets go out on schedule. The auth heartbeat catches token expiration before it silently breaks downstream jobs.

The Slack daemon is the UX layer: I get async updates from cron jobs, can send messages to trigger workflows, and the system reports back. It turns a headless VPS into something I can actually interact with from anywhere.

---

## Level 10: Swarm Architect

The framework describes "agents spawning agents."

My implementation: lead agent pattern. Sonnet as orchestrator, holding full context, making routing decisions. Haiku for research (file exploration, web search, API calls). Opus for decisions requiring deep reasoning.

The hard part isn't spawning agents. It's the orchestration layer: which model for which job, how to pass context without bloating it, how to handle failures without losing state.

One specific gotcha: Haiku agents complete work but fail to send results back via SendMessage (they go idle repeatedly). Anything that needs to communicate results to a team lead has to run on Sonnet or Opus. Now documented in CLAUDE.md so the next session doesn't rediscover it.

---

## Where This Actually Lands

@darnoux says 7+ is rare. My setup scores a 10 against the framework.

But I want to be honest about what that means: I didn't build level by level. I built top-down. Foundation first (CLAUDE.md, identity, context), then skills, then infrastructure. The VPS and cron jobs came relatively late. Architecture informed implementation, not the other way around.

The practical advice: don't optimize for reaching Level 10. The framework is a map, not a ladder. Build what you actually need for your specific workflow, and let the requirements pull you up the levels.

---

**@darnoux's framework:** [github.com/darnoux/claude-code-level-up](https://github.com/darnoux/claude-code-level-up)

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*
