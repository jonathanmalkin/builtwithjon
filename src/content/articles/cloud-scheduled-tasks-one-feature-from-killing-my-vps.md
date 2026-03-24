---
title: "Claude Code Web Scheduled Tasks. One Feature Away from Killing My VPS."
date: 2026-03-24
description: "Migration assessment: 7 of 11 cron jobs eliminated, 3 move cleanly, 2 restructure. The single blocker is persistent messaging. Decision framework for evaluating your own self-hosted AI automation."
story: 1
tags: ["claude-code", "cloud", "infrastructure", "automation", "migration", "scheduled-tasks"]
draft: false
---

When Anthropic shipped Claude Code Cloud with scheduled tasks, my first thought wasn't "cool, new feature." It was "can I turn off the VPS?"

Three environments. Eleven cron jobs. A custom Slack daemon running 24/7. I'd been spending more time keeping the automation running than actually using it. Auth failures at 2 AM. Credential rotation bugs. That was the state of my Claude Code infrastructure when Cloud landed with scheduled tasks and I started mapping what moves cleanly, what needs restructuring, what gets eliminated entirely, and the single feature that's blocking me from turning the VPS off today. The whole setup is open source, so you can see exactly what I'm describing.

## The Current Architecture

Three environments, each with a specific job.

- **Mac.** **Interactive development**. CLI sessions, VS Code, content creation, app development, thinking and decision-support, research. Where 95% of my time goes.
- **VPS Container.** **24/7 Automation**. Docker container on DigitalOcean running 11 cron jobs, a custom Slack daemon for phone access, and enough self-maintenance infrastructure to keep itself alive without my intervention.
- **Phone.** Slack app hits the daemon in the container, spawns Claude Code sessions with full project context, replies in-thread. Threaded conversations, session awareness across the thread.

The system works. Nightly intelligence pipelines scan my work, generate retrospectives, and assemble morning briefings before I wake up. Content gets scheduled and posted. Emails get processed. It's genuinely useful.

## What Moves to Cloud

I broke every workflow into three buckets - **Restructure, Moves Cleanly, and Eliminate**

**Restructure:**

- **Daily retrospective** (parallel workers become sequential; runtime increases but a single session maintains full context across all phases, so quality improves)
- **Morning orchestrator** (same restructuring; reads the retro's committed output directly from git on a fresh clone. Git becomes the state bus between independent Cloud task runs.)

**Moves cleanly:**

- Tweet scheduler (hourly Cloud task, reads content queue from git, posts via X API)
- Email (hourly Cloud task, direct IMAP calls)
- News feed monitor (Cloud task, pairs with the intelligence pipeline)

These three are straightforward. The scripts already exist. The data lives in git. The only changes are where they execute and how credentials get injected.

**Eliminated (all the supporting infrastructure that keeps the Claude Code working on the VPS):**

- Auth token validation
- Secrets refresh
- Auth follow-up validation
- Daily auth report
- Weekly health digest
- Docker healthchecks (no Docker)
- Session scan (Cloud tasks commit their own work. Nothing to scan.)

That last one is worth pausing on. The session scan crawled through Claude Code session logs every evening to extract decisions and changes from the day's work. On Cloud, each task commits its own results as it runs. The scan wasn't migrated. It became unnecessary. The new architecture eliminated the problem the scan existed to solve.

When I counted, 7 of my 11 cron jobs existed solely to keep the system running. All seven disappear on Cloud.

## The Single Blocker

One thing prevents full migration. Persistent messaging (Slack, Telegram, Discord, etc)

My Slack daemon is always there waiting for me, listening for messages 24/7. When a message arrives, it spawns a Claude Code session with full project context, processes the request, and replies in-thread. Response time is near-instant. Conversations are threaded. The daemon maintains session awareness across the thread. This is genuinely useful. A persistent, context-aware Claude Code session manager with real-time message handling.

Cloud tasks are a new environment on every run. Anthropic spins up a VM, clones the repo and runs some scripts. There's no way to listen for incoming events. Cloud is a fundamentally different model from self-hosting.

The constraint isn't specific to Slack. Any persistent message-handling workflow hits the same wall. A Discord bot listening for commands. A webhook receiver processing events in real time. Anything that needs to stay running rather than execute and finish. Cloud doesn't have a model for that yet.

**What would solve it**: always-on Cloud sessions that start, open a connection, and stay running until explicitly stopped. Not scheduled. Persistent.

Or better. Messaging platforms as native trigger channels. Claude Code Cloud already uses GitHub as a trigger channel. If Slack became a trigger channel (message arrives, Cloud session spawns, processes, replies), the daemon architecture becomes unnecessary entirely. The platform handles the persistence.

## Nice-to-haves

The following are things I'd like to see but aren't deal-breakers for moving to Anthropic's Cloud.

- Sub-hourly scheduling (social media management)
- Task chaining (Retro finds and fixes problems, Morning Orchestrator reports on them. Retro is a prerequisite for Morning Orchestrator)
- Persistent storage between runs
- Auto-memory in scheduled tasks (user-level memory at `~/.claude/` doesn't exist in Cloud environments. Project-level CLAUDE.md and rules clone fine. Accumulated context from interactive sessions doesn't.)

## What I Learned

Three principles that apply to anyone running self-hosted AI automation.

**Bet on the platform's momentum.** What I built six months ago, Anthropic just shipped natively. Scheduled tasks. Git integration. Secret management. The right posture isn't "build everything yourself." It's: use what exists, build only what doesn't, be ready to delete your code when they catch up. I've watched this pattern repeat across the entire Claude Code lifecycle. Features I built as custom scripts became first-party capabilities within months. The best infrastructure is the infrastructure you stop maintaining.

**Self-hosting has hidden costs that aren't on the invoice.** Not the hosting fee. The auth debugging at 2 AM when a token validation fails and you can't tell whether it's your token, Anthropic's API, or your network. The credential rotation scripts that need their own monitoring. The monitoring that monitors the monitoring. I built a three-tier auth failure classification system (auth failure vs. API outage vs. network issue) because I kept misdiagnosing one as the other. That system works. It's also engineering time spent on plumbing, not product. When you count honestly, the overhead is real.

**Architecture eliminates problems that process can't.** The session scan is the clearest example. I didn't migrate it to Cloud. It became unnecessary. Each Cloud task commits its own output as it runs. The scan only existed because the old architecture didn't enforce commit discipline by design. The new one does. No scan needed. No workaround needed. The destination made the component irrelevant. When you're evaluating a migration, look for these. The workflows that don't move to the new platform because they don't need to exist there. Those are the strongest signal that the migration is worth doing.

## The Decision Framework

If you're running self-hosted AI automation and wondering whether a managed platform is worth evaluating, here are the questions I'd sit with.

- **What percentage of your automation maintains itself?**
- **What would you gain if that number went to zero?**
- **Is there a managed alternative that didn't exist six months ago?**
- (And the uncomfortable one)
  - **Are you building infrastructure because you need it, or because building infrastructure is satisfying?**

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*
