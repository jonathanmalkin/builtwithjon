---
title: "My AI System Was Getting Worse at Its Job. Measuring Why Changed How I Build."
date: 2026-04-06
description: "I audited 47 self-improvement cycles in my AI workflow and found a 35:1 bias toward adding over removing. The fix was not more tooling. It was learning when to cut."
story: 3
tags: ["claude-code", "ai-automation", "workflow", "simplification", "solo-founder"]
draft: false
---

I built a self-improving AI workflow, then audited what the improvement loop had actually done. Over 47 retro cycles it applied 115 changes: 105 additions, 7 neutral rewrites, 3 simplifications, and 0 removals. That pushed my startup context to about 1,850 lines before the first prompt. The system was not catastrophically broken. It was just getting worse at the exact job it was supposed to improve.

The failure mode was subtle. Responses got a little slower. Instructions contradicted each other more often. The output was still usable, but less sharp than it had been a few weeks earlier.

That is a dangerous place to be. Not broken enough to trigger a rewrite. Just degraded enough to normalize.

## The Audit

The self-improvement loop ran every night. Claude reviewed the day, identified friction, and proposed fixes. Most of the fixes were reasonable in isolation:

- add a rule for a failure mode
- add a check for a stale state file
- add a process for a new workflow
- add a script for a repeated task

So I stopped looking at the fixes one by one and audited the full history instead.

| Category | Count |
|---|---:|
| Additive fixes | 105 |
| Neutral rewrites | 7 |
| Simplifications | 3 |
| Removals | 0 |

That is a 35:1 ratio of additions to simplifications.

The practical result was startup drag. Before I typed anything, the system was loading rules, profiles, memory files, and workflow instructions accumulated across months of iteration. Some of it still mattered. Some of it was there because a problem happened once in February and never again.

## Why It Kept Growing

Every individual fix made sense locally.

Auth failed at 2 AM? Add a retry. A process produced inconsistent output? Add validation. A piece of context went stale? Add another check. A platform limitation needed a workaround? Add a script.

That is how infrastructure gravity works. Nothing enters the system without a reason. But if nothing ever leaves, correctness at the micro level turns into bloat at the system level.

The improvement loop had no instinct for subtraction. It knew how to be helpful, and "be helpful" usually translated into "add something."

That is fine when a human is making one conservative change every week. It is a very different dynamic when an automated loop is proposing changes every night.

## When the Dead Weight Became Obvious

The turning point was not theoretical. Anthropic shipped Cloud scheduled tasks, and that changed the architecture enough that I could finally see how much of my system existed only to support the old one.

I had three environments:

- Mac for interactive work
- VPS container for always-on automation
- phone access through a custom Slack daemon

Once Cloud tasks were viable, I broke every workflow into three buckets: keep, move, eliminate.

That exercise exposed the dead weight immediately.

Seven of my 13 cron jobs existed only to keep the VPS automation healthy:

- auth validation
- secrets refresh
- auth follow-up validation
- daily auth report
- weekly health digest
- Docker health checks
- session scan

Those were not product workflows. They were workflows for keeping workflows alive.

The session scan was the clearest example. It crawled Claude Code session logs every evening to reconstruct what happened during the day. In the Cloud-task version, each task commits its own output as it runs. The scan disappeared because the new architecture eliminated the need for it.

That was the moment the larger pattern snapped into focus: a lot of what I had built was not helping me do the work. It was helping the old system survive.

## The Question That Unlocked the Cut

The useful question was:

> If we started today with what we know now, what would we actually build?

Not "what took a long time?"

Not "what feels sophisticated?"

Not "what might be useful someday?"

What would I build today, from scratch, given the current platform and the actual work I need done?

That question drove four days of review and 16 architectural decisions.

Three filters ended up doing most of the work:

1. Does this still solve a real current problem?
2. Is the platform handling this natively now?
3. Would I build this from scratch today?

If the answer chain got weak, the thing got cut.

## What Changed

The simplification pass was not cosmetic. In the isolated migration worktree, phase 1 alone deleted 879 files and roughly 62,000 lines across rules, container config, memory files, skills, hooks, scripts, plans, and research artifacts.

The operating shape changed too:

| What | Before | After |
|---|---|---|
| Always-loaded context | ~1,850 lines | ~500 lines |
| Rules files | 20+ | 1 |
| Skills | 34 | 18 |
| Hooks | 12 | 4 |
| Cron jobs | 13 | 4 Cloud tasks |
| Scripts | 76 | ~15 |
| Environments to manage | 3 | 2 |

That is a 73% reduction in what the AI reads before I say a word.

The important part is what did not change: the useful capabilities.

I still get overnight briefings. I still get structured retros. I still have content and research workflows. I still have guardrails. I just stopped making the system carry months of obsolete scaffolding.

## The Countermeasures

Cutting once is easy compared with staying cut. Without structural pressure, the same additive bias comes back.

These are the countermeasures I put in place:

### 1. Three-occurrence threshold

A problem has to happen three separate times before it earns a permanent rule.

Most of the 105 additions in the audit were responses to things that happened exactly once.

### 2. 14-day sunset

Every new rule gets an expiration date. If the underlying problem does not recur, the rule becomes a removal candidate.

This forces the system to answer a question it previously ignored: did the rule solve an active class of problems, or did the world just move on?

### 3. Proposal gate

The improvement loop can suggest changes. It cannot apply them.

That goes against my natural instinct. I like fast iteration and two-way-door experimentation. But permanent modification of the system's own instruction layer is different from trying a reversible implementation detail. If the same agent that suffers additive bias is also allowed to rewrite its operating surface autonomously, it will quietly grow forever.

### 4. Platform-first rule

If a native feature gets to roughly 80% of what the custom implementation does, cut the custom implementation unless the remaining 20% is truly strategic.

The maintenance cost of custom infrastructure is almost always higher than the gap it is preserving.

## What Got Better

The smaller system is easier to reason about.

Responses are faster. Answers are more precise. The startup context is narrower, which means the important instructions are easier for the model to hold onto consistently. I spend less time maintaining the machinery and more time using it.

The first proof was concrete. On March 29, the first cloud-generated morning briefing landed and the old VPS orchestrator was officially redundant. That was not a symbolic cleanup milestone. It was a working replacement for a chunk of infrastructure I had been babysitting for weeks.

That is when I knew the cut was real.

## The Takeaway

If you are building serious AI workflows, measure the improvement system itself.

Do not just track what it adds. Track:

- additions
- simplifications
- removals
- startup context size
- how much of the system exists to maintain the rest of the system

The trap is thinking complexity only arrives through big decisions. Most of it arrives through small, correct, locally justified changes that never get revisited.

My mistake was assuming a self-improving system would eventually learn to subtract.

It did not.

I had to teach it how.

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*
