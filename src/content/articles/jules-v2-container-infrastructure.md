---
title: "Jules v2 is live. Container infrastructure, 7 scheduled jobs, Slack daemon for phone access. Open source."
date: 2026-03-17
description: "Jules v2 container infrastructure: 8-phase boot sequence, 7 scheduled jobs, Slack daemon, credential flow, and the architectural patterns that make an AI agent truly autonomous."
story: 1
tags: ["claude-code", "jules", "infrastructure", "docker", "automation", "slack", "cron"]
draft: false
---

Three weeks ago I published the [Jules repo](https://github.com/jonathanmalkin/jules). A reference implementation of a Claude Code setup: skills, rules, hooks, agents, profile templates. 258 upvotes on the wrap-up skill post alone. People cloned it, adapted it, built their own versions.

But the repo was incomplete. It showed the interactive layer. The stuff that runs when you're sitting at the terminal. It didn't show the part that runs at 3 AM while you're asleep.

Today I'm publishing v2. The container infrastructure, the scheduled job pipeline, the Slack daemon that lets me message my agent from my phone. The layer that makes the system truly autonomous.

Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)

## What changed from v1 to v2

v1 had 35 skills, 24 rules, 9 hooks, 5 agents. A big configuration surface. Six weeks of daily production use trimmed that down.

v2 has 20 skills, 17 rules, 12 hooks, 5 agents. Plus container infrastructure, 7 scheduled jobs, and a Slack daemon.

15 skills got cut. Not because they didn't work. Because I stopped using them. `deploy-app` got replaced by a bash script. `engage` and `reply-scout` merged into `scout`. `smoke-test`, `test-local-dev`, `test-prod` collapsed into the `app-tester` agent. Skills are probabilistic. The LLM might follow them. Scripts are deterministic. They execute the same way every time.

That's the theme of v2. Push behavior toward determinism.

## The hybrid architecture

Jules runs across two environments.

**Mac** handles interactive work. Claude Code CLI sessions, VS Code, content creation, debugging, agent teams. This is where I sit and work.

**A VPS container** handles everything else. Cron jobs at 3 AM. A Slack daemon that's always listening. MCP servers. SSH for when I need to debug from my phone.

Why not just run everything on the Mac? Because my laptop sleeps. Because cron jobs need to run at 3 AM. Because the Slack daemon needs to be always-on, and a laptop that closes isn't always-on.

The two environments stay in sync through git. The container pulls every minute. Memory files are symlinked to a shared `.claude-memory/` directory in the repo, with a custom merge driver that auto-resolves conflicts (latest push wins). A morning cron job on the container can read memory written during yesterday's interactive session on the Mac.

## The container

It's a Debian-based Docker image. Nothing exotic. The interesting parts are in the entrypoint.

The boot sequence has 8 phases:

1. **Workspace setup.** Symlinks, memory sync, merge driver config.
2. **SSH configuration.** Per-repo deploy keys, known_hosts pre-population.
3. **Secret injection.** 1Password CLI resolves vault references into environment variables.
4. **Claude Code configuration.** Onboarding config, user settings, credentials from the OAuth setup-token.
5. **Boot-check.** If the container restarts mid-day, catch up on jobs that should have already run.
6. **Slack daemon startup.** Install deps if needed, start the Node.js process.
7. **MCP server startup.** Shared servers that persist across Claude sessions.
8. **Supervisor loop.** Keep the container alive. Restart crashed daemons. Hot-reload on code changes.

Phase 3 is worth zooming into. Here's the credential flow:

```
1Password (cloud)
  → OP_SERVICE_ACCOUNT_TOKEN (injected via docker-compose)
    → entrypoint.sh calls `op inject`
      → .env.template vault references resolved to real values
        → /tmp/agent-secrets.env (chmod 600)
          → `source` exports to all child processes
```

Every cron job, every Slack daemon dispatch, every `claude -p` call inherits the secrets from the parent process. No per-job credential fetching. No runtime API calls to 1Password. One injection at startup, inherited everywhere.

Claude Code's own auth gets special treatment. The `CLAUDE_CODE_OAUTH_TOKEN` is a 1-year setup-token that gets written to `~/.claude/.credentials.json`. Then I mark it immutable with `chattr +i`. Why? Because if someone SSH's into the container and runs `claude login` interactively, it overwrites the credentials file with a short-lived OAuth token. That token expires in hours. Every cron job silently fails. The immutable flag prevents that. The auth-refresh job at 2:45 AM detects if it happened anyway and alerts via Slack.

## The job pipeline

Seven jobs run on a schedule inside the container. Here's what a typical day looks like:

| Time | Job | What it does |
|------|-----|-------------|
| Every 1 min | git-auto-pull | Fast-forward pull from GitHub. Keeps container in sync. |
| 2:45 AM | auth-refresh | Validates the Claude setup-token works. Alerts Slack if it doesn't. |
| 3:00 AM | daily-retro | Analyzes yesterday's session issues with parallel `claude -p` agents. |
| 5:00 AM | morning-orchestrator | Memory synthesis, context gathering, briefing generation. |
| 8 AM - 10 PM | news-feed-monitor | Polls AI reading feeds hourly. |
| 4:00 PM | afternoon-scan | Mid-day context refresh. |

The retro and the orchestrator are the interesting ones.

### The daily retro (full code in repo)

This is the job I'm most proud of architecturally. It's 540 lines of bash. The problem it solves: during a session, Jules logs issues it encounters. Configuration gaps, tool failures, patterns that should be codified. The retro analyzes those issues and auto-applies fixes.

The architecture is fully iterative. No single LLM call that scales with issue count. That would blow up on a day with 15 issues.

Instead:

1. **Parse** the issues file into individual issue files (pure bash, no LLM)
2. **Analyze** each issue independently with a `claude -p` agent (12 max-turns, Sonnet, medium effort)
3. **Synthesize** per-issue (Sonnet, high effort, 90-second timeout)
4. **Assemble** the report (concatenation, no LLM needed)
5. **Quality check** (bash, reject if < 200 chars)
6. **Git commit and push** the fixes

Every step has resume support. If the container crashes mid-retro, the next run picks up where it left off. Date-based work directories. Persistent registries tracking which issue files have been processed.

The timeout wrapper deserves mention. Early versions used `timeout` inside command substitutions:

```bash
result=$(timeout 300 claude -p ...)
```

This looks right. It ran fine for weeks. Then one day the Claude API was slow and the process hung for 104 minutes. `timeout` inside `$()` doesn't reliably kill the child process tree. The API call finished, but `timeout` had already exited, and the parent shell was waiting on the substitution.

The fix: poll-and-kill. Background the process, poll with `kill -0`, kill the entire process tree on timeout:

```bash
"$@" < "$input_file" > "$output_file" 2>/dev/null &
local pid=$!
local elapsed=0
while kill -0 "$pid" 2>/dev/null; do
    sleep 5
    elapsed=$((elapsed + 5))
    if [ "$elapsed" -ge "$timeout_secs" ]; then
        pkill -TERM -P "$pid" 2>/dev/null || true
        kill -TERM "$pid" 2>/dev/null || true
        sleep 5
        pkill -9 -P "$pid" 2>/dev/null || true
        kill -9 "$pid" 2>/dev/null || true
        wait "$pid" 2>/dev/null || true
        return 124
    fi
done
```

This pattern is used in every script that calls `claude -p`. It's the only way I've found to reliably timeout Claude Code CLI calls in bash.

### The morning orchestrator (excerpt in repo)

The full orchestrator is 1,390 lines. Too long to sanitize for a public repo. The excerpt shows the key patterns: phase structure, parallel dispatch, signal file coordination.

The interesting architectural pattern is how the retro and orchestrator communicate. The retro writes a signal file:

```
date=2026-03-17
status=success
retro_file=/path/to/retro.md
timestamp=03:42:15
error=
```

The orchestrator reads that file. If it says success, load the report. If it says failed, continue without retro data. If it says running, the retro is still going. Wait? No. Continue without it. The orchestrator doesn't block on the retro. It takes whatever's available.

This decoupling is deliberate. Either job can run independently. Either can fail without breaking the other. Either can be restarted without side effects.

### Signal files over direct calls

This is a pattern I've come back to multiple times. When two scripts need to coordinate, the temptation is to have one call the other. The orchestrator runs the retro, waits for it, reads the output.

The problem: coupling. If the retro hangs, the orchestrator hangs. If the retro's format changes, the orchestrator breaks. If you want to run them on different schedules, you can't.

Signal files decouple them completely. The retro writes a file with a known format. The orchestrator reads it. They don't know about each other. They just know about the file.

## The Slack daemon

This is how I talk to Jules from my phone. 850 lines of Node.js using Slack's Socket Mode (no public URLs, no webhooks, no ngrok).

The message handler has three tiers:

**Tier 0: Research channel.** Messages in a designated Slack channel always go through the deep URL analysis flow. Drop a GitHub repo link, get a comparative analysis against my setup. Drop a tweet URL, get a relevance assessment. Drop a Reddit link, get the post fetched via MCP tools. This is the tier I use most. I see something interesting on my phone, forward it to the research channel, and Jules analyzes it before I get home.

**Tier 1: One-word commands.** `status`, `help`, `logs`, `run`. Handled deterministically in JavaScript. No LLM call, instant response.

**Tier 2: Everything else.** Natural language goes through a complexity heuristic. Two or more complexity patterns (sequential steps, conditionals, multiple action verbs) triggers the decompose-first flow. Otherwise it's a direct `claude -p` dispatch.

The decompose-first flow is the most interesting part. Claude breaks the request into:

- `[AGENT]` steps: things Jules can do autonomously
- `[YOU]` steps: things only I can do (financial decisions, external posts)
- `[AGENT-AFTER:NAME]` steps: things Jules does after I complete a specific `[YOU]` step

Agent steps execute immediately. YOU steps get queued in Terrain.md. AGENT-AFTER steps wait until I check off the corresponding YOU step. From any channel. Any message. Any session. The unblocking is pattern-matched, not channel-specific.

The security model: every `claude -p` call gets an appended system prompt that blocks reading SSH keys, credential files, or making unauthorized network requests. The daemon only accepts messages from one Slack user ID. Everything else is silently dropped.

### Hot-reload

The supervisor loop in entrypoint.sh tracks a checksum of the Slack daemon's code:

```bash
DAEMON_CHECKSUM=$(find "$SLACK_DAEMON_DIR" -name "*.js" -o -name "*.json" \
    | sort | xargs cat 2>/dev/null | md5sum | cut -d' ' -f1)
```

Every 10 seconds, it recalculates. If the checksum changed (because git-auto-pull pulled new code), it kills and restarts the daemon. Zero-downtime deploys for the Slack daemon, triggered by a `git push` from my Mac.

## tini as PID 1

This is an architectural invariant. Not optional. Here's why.

The supervisor loop uses `while true; sleep 10`. Bash doesn't call `wait()` on child processes. Every `claude -p` spawned by cron or the Slack daemon forks a Node.js process. When that process exits, the parent (bash) never reaps it. It becomes a zombie.

During load testing, I hit 40 zombie processes. They don't use CPU or memory, but they consume PID slots. With `pids: 400` in the Docker compose resource limits, that's 10% of capacity consumed by ghosts.

`tini` acts as PID 1 and reaps orphaned processes automatically. Must use exec form in the Dockerfile:

```dockerfile
ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/docker-entrypoint-root.sh"]
```

Shell form (`ENTRYPOINT /sbin/tini --`) puts `sh` at PID 1, defeating the purpose.

After adding tini and rebuilding: zero zombies.

## What I cut from v1

The evolution from v1 to v2 was as much about removing things as adding them.

**15 skills removed.** `afternoon`, `catchup`, `deploy-app`, `engage`, `growth-audit`, `preview-report`, `reply-scout`, `report-latest`, `smoke-test`, `test-local-dev`, `test-prod`. Most were replaced by scripts or merged into other skills.

**13 rules removed.** `1password`, `browser-testing`, `business-principles`, `code-intelligence`, `decision-gates`, `hosting-provider`, `plan-execution`, `production-deploys`, `read-efficiency`, `skills`, `social-posting-automation`, `wordpress-elementor`, `x-browser-posting`. These were either too specific to my product (hosting provider conventions), superseded by better patterns (production deploys got a standing order), or codified into hooks instead.

**6 rules added.** `credential-lookup`, `cron-status`, `docker-container`, `env-vars-config`, `investigation-budget`, `research-phase`. Every new rule came from a repeated question. "How do I check container cron status?" came up three times across sessions. Now it's a rule.

**3 hooks added.** `inject-datetime` (every prompt gets the current date/time), `inject-environment` (session knows if it's on Mac or container), `slack-log-hook` (tool calls get logged to Slack for mobile monitoring).

The pattern: rules and hooks got added when the same problem appeared in multiple sessions. Skills got removed when a script did the job better.

## What you can take from this

The repo is a reference implementation, not a one-click deploy. Here's what I think is actually portable:

**The entrypoint pattern.** 8 phases, each independent, each logged. If phase 3 fails (1Password), phases 1-2 are fine and phases 4-8 degrade gracefully. This is better than a monolithic startup script that fails at line 40 and you don't know why.

**The credential flow.** 1Password service account + `op inject` at startup + inherited environment variables. No per-job credential management. Works for any secret store that supports CLI injection.

**Signal files for job coordination.** The retro writes a file, the orchestrator reads it. Decoupled, restartable, debuggable. Better than chaining scripts together.

**The poll-and-kill timeout.** If you're running `claude -p` in scheduled jobs, you need this. The naive `timeout` approach will eventually fail.

**The Slack daemon architecture.** Socket Mode + complexity heuristic + `claude -p` dispatch. The decompose-first pattern for complex requests is genuinely useful. You don't need my specific implementation. You need the idea: classify message complexity, handle simple things fast, decompose complex things before executing.

**The immutable credentials pattern.** `chattr +i` on credential files inside containers. If you've ever had a `claude login` overwrite a service token, you know why this matters.

## Try it

Give Claude Code the URL and ask it to compare your setup:

```
Analyze my current Claude Code setup and compare it against
https://github.com/jonathanmalkin/jules. Tell me what's worth
adopting and what to skip for MY setup.
```

Or browse the container infrastructure directly. The entrypoint.sh is the most instructive file. 8 phases, commented, with the actual patterns I use in production.

The v1 tag is preserved if you want to see what the system looked like before the container layer. Both are browsable on GitHub.

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*

---

*I build AI systems for real operational work. The Jules repo is the infrastructure that makes it possible.*
