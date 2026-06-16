---
title: "I evaluated 21+ AI memory systems just to get three agents to talk"
date: 2026-06-16
description: "The full archaeology of building one shared memory for three AI agents: 21+ systems scored on paper, 7 actually deployed and torn down, a 180-probe eval harness, and the failures I almost shipped (a 27% baseline that was lying, a V8 ceiling that killed semantic search, and a fancy engine that lost 0-to-6 to a SQLite file)."
story: 1
tags: ["ai-memory", "agentmemory", "local-llm", "claude-code", "bm25", "self-hosted", "evals"]
platforms:
  reddit: "https://www.reddit.com/r/ClaudeCode/comments/1u7l40v/i_evaluated_21_ai_memory_systems_just_to_get/"
draft: false
---

The premise of personal AI memory used to be simple: store what the assistant knows about you so it doesn't forget between sessions. Then I built a workspace with three real AI surfaces (Claude Code, Codex, and a personal AI assistant called Pam), accumulated 4,475 sessions of work history, and discovered that "memory" is at least five different unsolved problems at once.

Here is the full archaeology:

- 21+ memory systems formally scored on 10 criteria before I installed anything
- 7+ different architectures actually deployed and torn down, in chronological order
- 1 structured eval harness with 180 probes, 3 modes, and a measurement bug I had to confess
- A "frightening" 27.2% recall baseline that turned out to be my probes lying to me, not a broken engine
- A V8 string-length ceiling at 194K observations that killed semantic search
- A head-to-head comparison where the fancy system (GBrain: 0 pass, 7 fail) lost to the boring one (history-search: 6 pass, 0 fail) on a 10-question test

Half this post is code. The receipts are real.

---

## Proof Is What Matters

Information without proof is just noise. If you're building AI memory, the thing that separates a real system from vaporware is an eval harness, real numbers, and the courage to publish them when they're ugly.

This article shows you a real GBrain vs. custom engine ("history-search") with GBrain scoring 0 pass / 3 partial / 7 fail on its first eval. It shows you the exact V8 string-length ceiling that killed semantic search at ~194K observations. It shows you a live eval JSON with 180 probes and an honest `session_hit_rate` of 0.378.


---

## What I actually needed

Before the tools. Before the bake-off. The requirements.

I run three AI surfaces:

- **Claude Code** (the coding and strategy surface)
- **Codex** (implementation and verification)
- **Hermes/Pam** (personal AI assistant, conversational)

Each surface keeps its own session history. None of them can read the others. So when I started a new Claude Code session, it had no idea what Pam and I had been working on all week. And vice versa.

That is the origin of this whole project.

If you only run ONE AI surface, you do not need any of this. That surface can already search its own history.

I run three surfaces. Three surfaces cannot read each other's session files. So the only way to give all three access to shared memory is to EXPORT each surface's history and NORMALIZE it into one common format that every surface can read.

That requirement is what forced the normalized session layer into existence. And it's why no single off-the-shelf tool fit: most memory tools are designed for one surface talking to one backend. I needed three surfaces, zero surface-specific backends.

Here's what I actually needed, in plain language:

1. Search my own local files (Workspace and System)
2. See my current state (what's in progress, what's decided)
3. Search my session histories across ALL THREE surfaces: Claude Code, Codex, and Hermes
4. Files I can read AND that the agent can read well (human-readable + machine-readable)
5. A reliable way to find and retrieve all of that

Because it has to serve three surfaces, the histories have to be exported and normalized so every surface can read them. One surface would not need this. Three surfaces force it.

That's the spine of the whole article. Everything below exists because of that one constraint.

---

## The permanent foundation: normalized sessions and the swappable-reader insight

Before any of the systems: the data layer that made all of them possible.

Every session from every surface gets written to `System/Data/Normalized/Sessions/{surface}/` as a JSONL file. One turn per line. Same schema across all three surfaces:

```json
{
  "profile": "-active-work",
  "provenance": {
    "artifact_type": "session-turn",
    "normalizer": "agentcontinuity-native-session-normalizer",
    "raw_source_path": ".claude/projects/-active-work/<session-uuid>.jsonl"
  },
  "role": "user",
  "schema": "active-work.normalized-session-turn.v1",
  "session_id": "<session-uuid>",
  "session_key": "<session-key>",
  "source_id": "<source-id>",
  "source_path": ".claude/projects/-active-work/<session-uuid>.jsonl",
  "surface": "claude",
  "text": "Set up the writing workflow for a new voice profile.",
  "timestamp": "2026-06-12T02:27:48.178000+00:00",
  "turn_index": 0
}
```

This format is the single decision that made every later system possible.

The key insight: GBrain, history-search, AgentMemory, and the Obsidian vault all read the SAME normalized sessions. The foundation never changed. Only the readers changed. That's why swapping engines was cheap. No engine was ever load-bearing.

The constraint that shaped every system choice: **memory must live on infrastructure I own.**

```text
Allowed:
  - local files
  - local databases
  - self-hosted services on the primary laptop
  - later migration to an always-on owned host (VPS or second laptop)
  - paid or remote model providers for embeddings only

Not allowed as canonical memory:
  - hosted memory platforms
  - SaaS-only storage
  - memory that cannot be exported or inspected
  - adding a new agent surface just to get memory
```

That single constraint eliminated Supermemory, managed Zep, and OpenAI File Search before I ran a single eval.

---

## The paper bake-off: 21+ systems, 10 criteria, requirements did the filtering

Before I installed anything, I ran a structured scoring exercise against every local-owned memory system I could find.

### The 10 criteria

| Requirement                | Technical Nomenclature | Why it matters                                                                                                 |
| -------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| File-based / on my machine | Local-owned storage    | Required. Memory must be portable and inspectable.                                                             |
| Works with all my agents   | Cross-surface access   | Codex, Claude Code, the assistant surface, and MCP-compatible tools should share the same substrate.           |
| Knows what to remember     | Prompt-aware recall    | Every prompt needs some memory decision: skill, file, current state, session recall, or injected context.      |
| Shows its sources          | Source provenance      | Derived memories must link back to files, sessions, logs, messages, or other evidence.                         |
| Knows what's still true    | Temporal correctness   | The system must answer what is true now vs what was true before.                                               |
| Promotes facts on its own  | Autonomous validation  | The system must promote safe facts without routine human approval.                                             |
| Survives moving machines   | Second-host viability  | The storage and API shape should survive moving the assistant to another machine.                              |
| Easy to run                | Operational simplicity | Prefer one-binary, SQLite, or simple Docker before heavier stacks.                                             |
| Doesn't leak secrets       | Security posture       | Memory poisoning, secret leakage, and cross-project bleed must be guarded.                                     |
| Lots of Stars on Github    | Maturity               | Prefer maintained projects with real usage, docs, tests, releases, issue activity, and enough adoption signal. |

### The full tally (Stars as of 2026-06-05)

**Pilot candidates (actively evaluated):**

| System                 | Stars | Repo                                     | Maintainer/Org | X handle  | Verdict               | Key reason                                                               |
| ---------------------- | ----- | ---------------------------------------- | -------------- | --------- | --------------------- | ------------------------------------------------------------------------ |
| AgentMemory (rohitg00) | 21.3k | github.com/rohitg00/agentmemory          | Rohit Ghumare  | repo only | ADOPTED               | Mature signal, Codex/Hermes/Claude claims, local default, MCP/REST/hooks |
| Basic Memory           | 3.1k  | github.com/basicmachines-co/basic-memory | Basic Machines | repo only | Pilot candidate       | Markdown/semantic graph, readable storage; AGPL license caveat           |
| mcp-memory-service     | 1.9k  | github.com/doobidoo/mcp-memory-service   | @doobidoo      | repo only | Pilot candidate       | REST/MCP/OAuth/dashboard, self-hosted, active releases                   |
| ClawMem                | 181   | github.com/yoloshii/ClawMem              | yoloshii       | repo only | Pilot candidate       | Hermes/Claude hook fit; lower maturity than primary                      |
| Graphiti               | 27.0k | github.com/getzep/graphiti               | Zep            | repo only | Pilot (heavier infra) | Best temporal graph; requires Neo4j or FalkorDB                          |

**Deferred (architecture fit, but operational cost too high for MVP):**

| System | Stars | Repo | Maintainer/Org | X handle | Verdict | Key reason |
|---|---|---|---|---|---|---|
| Hindsight | 15.7k | github.com/vectorize-io/hindsight | Vectorize | repo only | Deferred | Retain/recall/reflect memory; wrapper pattern and Docker overhead |
| Cognee | 17.7k | github.com/topoteretes/cognee | Topoteretes (Vasilije Markovic) | repo only | Deferred | Graph/vector company-brain; heavier than MVP needs |
| Honcho | 4.8k | github.com/plastic-labs/honcho | Plastic Labs (Courtland Leer) | repo only | Deferred | Tested before; 4+ containers too heavy for first choice |
| Redis Agent Memory Server | 271 | github.com/redis/agent-memory-server | Redis | repo only | Deferred | Good if Redis becomes base infra; too heavy otherwise |

**Watchlist (promising, not mature enough or too narrow):**

| System | Stars | Repo | Maintainer/Org | X handle | Verdict | Key reason |
|---|---|---|---|---|---|---|
| Mem0 OSS | 57.8k | github.com/mem0ai/mem0 | Mem0 (Taranjeet Singh, Deshraj Yadav) | @mem0ai | Watchlist | High stars but cloud-forward product posture; local path needs verification |
| MemOS | 9.6k | github.com/MemTensor/MemOS | MemTensor | @MemOS_dev | Watchlist | Broad "memory OS" direction; likely more platform than MVP needs |
| Nocturne Memory | 1.2k | github.com/Dataojitori/nocturne_memory | Dataojitori | repo only | Watchlist | Rollbackable visual MCP; newer |
| Claude Memory Compiler | 1.1k | github.com/coleam00/claude-memory-compiler | Cole Medin | repo only | Watchlist | Claude-specific, not a shared backend |
| mcp-knowledge-graph | 863 | github.com/shaneholloman/mcp-knowledge-graph | Shane Holloman | repo only | Watchlist | Local knowledge graph MCP; narrower scope |
| ICM | 407 | github.com/rtk-ai/icm | RTK-AI (Patrick Szymkowiak) | repo only | Watchlist | Single-binary local MCP memory; newer |
| jayzeng/agentmemory | 5 | github.com/jayzeng/agentmemory | Jay Zeng | repo only | Pattern ref | Markdown shape appealing; adoption signal too low |

**Excluded (violated local-owned requirement):**

| System | Repo | Maintainer/Org | X handle | Verdict | Reason |
|---|---|---|---|---|---|
| Supermemory | github.com/supermemoryai/supermemory | Dhravya Shah | repo only | Excluded | Hosted/service-first |
| Zep managed | github.com/getzep/zep | Zep | repo only | Excluded | Hosted or in-your-cloud; use Graphiti OSS instead |
| Letta (fka MemGPT) | github.com/letta-ai/letta | Letta | @Letta_AI | Excluded | Adds another agent surface |
| OpenAI File Search | N/A | OpenAI | N/A | Excluded | Hosted vector stores |

### The real lesson from the paper bake-off

Requirements did the filtering. The local-owned plus cross-surface plus provenance requirements eliminated the majority of the field before a single install command ran. Of 57,800-star Mem0, the cloud-forward posture created enough uncertainty about the local-owned path that it became a watchlist item, not a pilot. Graphiti (27,000 stars) was architecturally attractive but required graph database infrastructure that added operational complexity beyond what the MVP needed.

AgentMemory at 21,300 stars won the pilot slot not because it had the most stars. It won because it was the only system with direct claims of Codex/Claude Code/Hermes integrations, a local-owned default, an MCP adapter that all three surfaces could use without surface-specific code, and strong enough adoption signal to justify integration.

---

## The real history: 7+ systems I actually ran

Most of the systems above were evaluated on paper only. But I actually ran seven of them, in order, before arriving at today's setup. Here is the honest chronology.

### System 1: My own LLMWiki-style system (the baseline everything else inherited)

This one gets undersold. It was the foundation.

The pattern comes from Andrej Karpathy's "LLM Wiki" idea: a knowledge base compiled specifically so agents can read it. I built my own version of this. It was my canonical memory substrate until around May 3, 2026. Everything that came after inherited its core design: human-readable files, agent-readable files, a normalized export format.

The LLMWiki pattern is not a thing you install. You build it. The decisions I made here (how to structure the files, what schema to use, what fields matter) are the decisions that made every later system swappable. GBrain, AgentMemory, and the Obsidian vault all read the files this system defined.

If you only take one thing from this article: the session-normalization format is the system. The reader on top of it is just software.

### System 2: Honcho (April 2026, plastic-labs)

Honcho (`github.com/plastic-labs/honcho`, @courtlandleer) is a self-hosted memory platform with an MCP worker. I adopted it in April 2026 and ran it live on Claude Code and Hermes.

It worked. I used it for a real stretch. But 4+ Docker containers for the benefit it delivered was too heavy, and I wasn't seeing enough payoff to justify them. I dropped it around April 20, 2026.

The lesson: operational cost is real cost. Complexity you can't easily inspect or restart during a live session is a liability.

### System 3: Hindsight (April 2026, vectorize-io)

Hindsight (`github.com/vectorize-io/hindsight`) is a retain/recall/reflect memory layer. I adopted it at runtime around April 2026, wired into all three surfaces via Docker, and it briefly served as the sole memory platform.

It was replaced around April 24, 2026. The Docker overhead and wrapper pattern were the same problem as Honcho: too much glue for the benefit.

### System 4: Cognee (May 13-14, 2026, topoteretes)

Cognee (`github.com/topoteretes/cognee`, v1.0.9, by Topoteretes) is a graph/vector "company brain." I ran a real pilot on May 13-14, 2026, against real files. It did not become durable. Call it a real pilot, not a paper evaluation: I ran it, measured it, and decided the operational footprint was more than the MVP needed.

### System 5: GBrain (May 2026, then shelved June 5)

GBrain (`github.com/garrytan/gbrain` by Garry Tan, @garrytan, version `0.40.4.0`, revision `25b68686`) was the most architecturally interesting system I tried. It promised a local brain with PostgreSQL/pgvector storage, OpenAI embeddings, source synchronization from git repos, an MCP endpoint, and a CLI that could query across federated sources.

This is the system with the best story. It also lost decisively to a SQLite file. More on this below.

### System 6: history-search (self-built, concurrent with GBrain, retired June 8)

A SQLite/FTS5 index over the normalized session JSONL files, exposed as an MCP tool. I built this myself. It was the boring baseline that GBrain kept losing to.

### System 7: AgentMemory (June 5, 2026 to present)

Current primary recall engine. More on this below.

### Parallel experiment: Obsidian vault (June 2026, ongoing)

A parallel experiment running alongside AgentMemory. Not a replacement. More on this in Chapter 5.

---

## Chapter 1: The filesystem-first foundation (May 2026)

The first "system" was a refusal to add one.

In early May 2026, I made one rule explicit: do not treat a runtime memory product as the foundation. The filesystem is canonical. The plain version of that rule:

- The files on disk are the source of truth.
- A surface's built-in memory can hold lightweight working hints, but nothing durable lives only there.
- Durable facts, decisions, procedures, source records, and artifacts all land in visible files.
- Any memory or search engine on top (LLMWiki, Hindsight, Honcho, anything) is a reader, not the foundation. Promoting one back to "foundation" takes a deliberate decision.

The working flow was linear:

```text
capture -> raw source -> normalized source -> triage ->
curated knowledge/decision -> work product -> feedback/outcome -> archive
```

The problem: this works perfectly until session continuity becomes a real operational need. By late May, after accumulating enough history across surfaces that starting a new session required manually summarizing what happened in the last one, the three surfaces had no shared memory. The personal assistant had no idea what Claude Code had been doing all week.

The filesystem-first foundation was the right starting principle. It was not sufficient by itself.

What it gave me that every subsequent system depended on: the normalized session format. Memory systems come and go. These files stay.

---

## Chapter 2: Honcho and Hindsight (April 2026)

Simple story. I ran both. Both worked. Both got too heavy.

Honcho was 4+ Docker containers. Hindsight was a similar Docker wrapper pattern. Neither was delivering enough benefit to justify the operational overhead of keeping those containers healthy, restarting them when they fell over, and debugging why a session wasn't being captured.

The real lesson here is not about Honcho or Hindsight specifically. It's about Docker overhead for memory tooling. When the memory layer needs more maintenance than the actual work it's supporting, you've added a liability.

---

## Chapter 3: GBrain (May 2026, pilot, then shelved June 5)

This is the head-to-head story. The fancy system versus the boring one.

### The pitch

GBrain's pitch was exactly right for what I needed: index your Workspace and System files, query across them semantically, and have every AI surface talk to the same brain.

The Phase 2 stack:

```text
GBrain sources:
  default: 26 pages, 139 chunks, 139 embedded chunks
  system:  79 pages, 394 chunks, 394 embedded chunks
  workspace: 1199 pages, 4893 chunks, 4893 embedded chunks

Database: local Postgres/pgvector at postgresql://postgres@127.0.0.1:[PORT]/gbrain_pilot
MCP service: http://127.0.0.1:[PORT]/mcp
Embedding model: openai:text-embedding-3-large (1536 dimensions)
```

The source sync wrapper I built mirrored Workspace and System into git-initialized mirror directories (GBrain requires git roots, which my canonical folders are not) and then called `gbrain sync --no-embed` followed by `gbrain embed --stale`.

```bash
# System/Scripts/gbrain-phase2-source-sync --full
rsync --delete-excluded --exclude='Workspace/05-Admin/' \
  --exclude='System/Logs/' \
  --exclude='[SECRETS-DIR]/' \
  Workspace/ System/State/Workspace/GBrain/source-mirrors/workspace/
git -C System/State/Workspace/GBrain/source-mirrors/workspace add -A
git -C System/State/Workspace/GBrain/source-mirrors/workspace commit -m "sync $(date -u +%Y%m%dT%H%M%S)"
gbrain sync --source workspace --no-embed
gbrain embed --stale
```

### What the Phase 1 eval showed

The eval was 10 questions run against GBrain and history-search in parallel. Both systems. Same questions. Same judge.

| Query | history-search | GBrain | Winner |
|---|---|---|---|
| 1 | pass | partial | history-search |
| 2 | partial | fail | history-search |
| 3 | pass | partial | history-search |
| 4 | partial | fail | history-search |
| 5 | partial | fail | history-search |
| 6 | pass | partial | history-search |
| 7 | pass | fail | history-search |
| 8 | partial | fail | history-search |
| 9 | pass | fail | history-search |
| 10 | pass | fail | history-search |

Score summary:

- history-search: 6 pass, 4 partial, 0 fail
- GBrain: 0 pass, 3 partial, 7 fail
- GBrain clean exits: 0 out of attempted queries

There were two root causes.

**Root cause 1: PGLite CLI teardown hangs.** Every `gbrain query` printed ranked results and then sat there eating a full CPU core for 60 seconds before I killed it. Every query. The code path: `engine.disconnect()` called `_db.close()` plus lock release after vector queries, and the PGLite vector teardown didn't settle cleanly.

```typescript
// src/cli.ts unconditionally calls engine.disconnect()
// in the non-serve command cleanup path.
// src/core/pglite-engine.ts implements disconnect as:
//   _db.close() plus lock release
// With vector queries, this didn't exit cleanly.
```

The workaround was moving to Postgres (Phase 2 did that), but the short-lived CLI path was still unreliable enough that I couldn't wire it into the assistant's cron jobs.

**Root cause 2: Expansion model resolution ignored the file-plane config.** The config file said `expansion_model: "openai:gpt-5.2"`. GBrain's gateway resolved expansion through a tier-default lookup that won over the explicit file-plane model. Every expansion call attempted `claude-haiku-4-5-20251001`, which doesn't exist.

```text
The requested model 'claude-haiku-4-5-20251001' does not exist
```

Phase 2 moved to Postgres and expanded the corpus to 1,304 total pages. The evaluation improved but never reached the reliability threshold needed for production wiring. The final Postgres dump before shelving: `System/Backups/GBrain/postgres-host/gbrain_host_20260605T174418.dump` (431MB).

The shelving decision was not "GBrain is bad." It was "GBrain requires an operational wrapper we haven't built yet, and AgentMemory passed the same eval criteria with less glue."

```markdown
# GBrain shelved 2026-06-05

GBrain is no longer pilot, conditional, or required architecture. It has been
shelved in favor of persistent shared AgentMemory (content recall) plus
history-search (time-window recall).

Do not start, depend on, or route recall through GBrain. The gbrain-* scripts,
this runtime, the pilot/host Postgres tooling, and System/State/gbrain/ are
kept in place for reversibility only.

## Rollback

1. Restore the four plists from Trash to ~/Library/LaunchAgents/, then
   launchctl bootstrap gui/$(id -u) <plist> each
2. System/Scripts/gbrain-postgres-host-start then System/Scripts/gbrain-host-start
3. Restore DB from the dump above with System/Scripts/gbrain-postgres-host-restore
4. Revert the AGENTS.md governance edit (git)
```

GBrain needed Postgres, custom sync wrappers, git mirror directories, an embedding pipeline, and still produced 0 clean exits. history-search was a SQLite file over the same normalized sessions and answered 6 of 10 correctly on first run.

The heavier, fancier system lost to the boring one on a real test.

---

## Chapter 4: history-search (concurrent with GBrain, retired June 8)

history-search was the system I built myself, before evaluating any third-party memory software. It was a SQLite/FTS5 index over the normalized session JSONL files, exposed as an MCP tool.

It served as the baseline throughout the GBrain evaluation because it actually worked. The Phase 1 numbers above (6 pass, 4 partial, 0 fail) are real. It answered time-windowed queries ("what did we work on yesterday?") reliably. It returned source paths and timestamps. It exited cleanly on every query.

The limitation was structural. It indexed turns as text and returned them ranked by BM25. No semantic layer. No consolidation. No cross-surface memory management. No lifecycle hooks. Every query was essentially a grep over conversation history. For "what was the last decision about X" it worked fine. For "what patterns have emerged across the past month of assistant sessions" it was useless.

The retirement decision:

```markdown
Status: executed and verified 2026-06-06

## 2026-06-06 relaxed recall update

The relaxed model was accepted after the initial cutover:

- AgentMemory native recall is the live standard for ordinary recall and soft
  working memory.
- Exact history-search parity is no longer a standing requirement.
- AgentMemory recency/context behavior is accepted as good enough for ordinary
  recall, with the known caveat that package search is hybrid relevance ranking
  rather than guaranteed newest-first.
- The local parity helper remains available only for fallback/debug provenance
  checks.
- History-search can be fully retired through an explicit cleanup pass once
  native recall smoke, refresh/import, secret scanning, and rebuild/provenance
  inputs are green.
```

The parity table:

| Capability | history-search | AgentMemory recall | Parity |
|---|---|---|---|
| Keyword search | BM25, core path | BM25 via /agentmemory/search | yes |
| Semantic search | no | hybrid BM25+vector | yes (stronger) |
| Time-window filter | core, every tool | adapter-side filter-first | functional |
| Surface/profile filter | yes | adapter-side surface filter | functional for ingested surfaces |
| Cited source paths | yes | yes (Phase 3h) | yes |

```markdown
# History-Search Retired Archive (2026-06-08)

history-search was fully retired and unloaded 2026-06-06. Wrapper scripts and
source plist were already removed/Trashed in the original retirement.
This archive captures the final-state logs.

## Rollback preserved (NOT in this archive)
- Code/personal/history-search and System/State/history-search.
- Re-enable only if AgentMemory rollback is approved.
```

---

## Chapter 5: Obsidian Vault Done Right

A lot of people think this: "I'll dump my notes into a folder and open Obsidian and I'll have a memory system."

You won't. A folder of notes is not a memory system.

To make it real, you have to set it up. Here is what that actually means, step by step.

### Why the vault exists alongside AgentMemory

AgentMemory answers session-history recall well. It does not answer knowledge queries well. "What are the durable principles behind how I structure AI system prompts" is not a session-history question. It's a knowledge question. BM25 over raw conversation turns is a bad substrate for that.

The vault is a parallel experiment, not a replacement. It runs alongside AgentMemory. Both read the same normalized sessions. One is optimized for "what happened in this session." The other is optimized for "what do I know about this topic."

### The setup steps

**Step 1: Collect your files into one area.**

The vault needs a home. Mine lives at `System/Vault/. All notes go there. If your notes are scattered across five apps and three folders, pick one place and start moving things.

**Step 2: Give them a sensible organization.**

A pile of files is still not a system. You need a folder structure you'll actually use. The high-level structure I use:

```text
Workspace/        - the human-facing work
  01-Strategy/    - decisions, plans, reports, research
  03-Sales/       - relationship and outreach work
  04-Marketing/   - content, design, speaking
  00-Identity/    - profile, voice, goals

System/           - operational machinery
  Scripts/        - automation and tooling
  Data/           - raw, normalized, sessions
  Vault/          - the Obsidian vault lives here
    topics/       - durable topic notes
    sessions/     - generated session summaries

.agents/skills/   - shared skill library for all three surfaces

Code/             - project code
```

This structure is not sensitive. The actual file contents are. Having a structure like this means the vault notes know where to point. A random filename soup doesn't.

**Step 3: Link the notes to each other.**

A pile of unlinked notes is just a pile. You can search it, but you can't navigate it. Wikilinks make it a graph.

In Obsidian and in plain markdown, a wikilink looks like this: `[[memory-architecture]]`. That link creates a navigable connection between the current note and the memory-architecture note. Follow enough links and you have a knowledge graph that an agent can traverse.

In topic notes, I add wikilinks to related concepts:

```markdown
Related: [[recall-eval]] [[approval-gates]] [[content-engine]]
```

Those aren't just pretty navigation. When an agent reads this note, it can follow the wikilinks to related context without being told what to search for.

**Step 4: Generate session-summary notes deterministically.**

Session notes are the bridge between "what happened" and "what I know." I generate them with a script that reads each normalized session JSONL and emits a structured markdown note. No network calls. No LLM. Pure extraction.

Here is a real session note:

```yaml
---
type: session-summary
surface: "claude"
session_id: "<session-uuid>"
date: 2026-06-12
topics: ["writing", "workflow", "voice", "profile", "setup"]
key_points: ["Set up the writing workflow for a new voice profile."]
summary: "Set up the writing workflow for a new voice profile."
turns: 2
source_path: "System/Data/Normalized/Sessions/claude/<session-uuid>.jsonl"
generated_by: vault-session-summarizer.py
---
```

The script that generates these (abbreviated for the key functions):

```python
#!/usr/bin/env python3
"""
vault-session-summarizer.py
Read ONE normalized session JSONL and emit a structured markdown note.
Non-destructive. Deterministic. No network calls. No LLM.
Heuristic extractive summarizer: opening user intent, topics (frequency-ranked),
key points (short declarative sentences), frontmatter.
"""

STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "if", "then", "else", "for", "of", "to",
    # ... (full set in source)
}

WORD_RE = re.compile(r"[A-Za-z][A-Za-z0-9_-]{2,}")

def extract_topics(turns, k=6):
    """Frequency-rank meaningful tokens across user+assistant turns."""
    counts = Counter()
    for t in turns:
        if t.get("role") not in ("user", "assistant"):
            continue
        txt = clean_text(t.get("text", "")).lower()
        for w in WORD_RE.findall(txt):
            if w in STOPWORDS:
                continue
            counts[w] += 1
    return [w for w, _ in counts.most_common(k)]

def extract_key_points(turns, max_points=6, max_len=200):
    """Pull short declarative sentences from turns."""
    points = []
    seen = set()
    for t in turns:
        if t.get("role") not in ("user", "assistant"):
            continue
        txt = clean_text(t.get("text", ""))
        if not txt:
            continue
        for sent in SENT_SPLIT_RE.split(txt):
            sent = sent.strip()
            if len(sent) < 25 or len(sent) > max_len:
                continue
            # Skip code-ish or pure-symbol lines.
            if sent.count("{") + sent.count("}") + sent.count("`") > 2:
                continue
            key = sent.lower()[:80]
            if key in seen:
                continue
            seen.add(key)
            points.append(sent)
            if len(points) >= max_points:
                return points
    return points
```

Running this across all 4,475 normalized sessions produces 4,475 session notes. That is the bulk of the vault corpus.

**Step 5: Stand up the MCP server so an agent can actually query the vault.**

This is the step everyone skips.

Without an MCP query layer, Obsidian is a notes app. A nice one, but a notes app. The MCP server is what makes the vault queryable by an AI agent without you manually copying and pasting content.

The config is simple. It points the filesystem MCP server at the vault folder:

```json
{
  "mcpServers": {
    "markdown-vault": {
      "command": "~/.local/bin/npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem@2026.1.14",
        "~/Active-Work/System/Vault"
      ],
      "env": {}
    }
  }
}
```

No LLM. No embeddings. No Docker. A filesystem MCP server is enough to let agents read and search the vault. Add it to your MCP config for every surface that needs vault access.

**Step 6: Run an eval so you know it actually retrieves.**

Don't trust a system you haven't measured. Use the same 180-probe harness described below. Run it against the vault. Look at the session-hit numbers by mode. Then you'll know what you have.

The vault's honest numbers are in the eval section below.

### What a topic note looks like

```yaml
---
topic: memory-architecture
status: active
source: AGENTS.md (Knowledge And Recall), Workspace/01-Strategy/Plans/2026-06-14-program-roadmap.md (A2)
date: 2026-06-14
summary: The minimal 3-part memory shape finalized 2026-06-08, plus the A2 vault
  built alongside it. Generated memories are convenience layers, not canonical truth.
---

The memory architecture is a minimal 3-part shape:

1. Normalized session files at System/Data/Normalized/Sessions/
2. AgentMemory engine reading them
3. One scheduled re-read (normalize + import)

Related: [[recall-eval]] [[approval-gates]] [[content-engine]]
```

The wikilinks, the YAML frontmatter, and the source citation are all load-bearing. They make the note machine-readable, navigable, and traceable back to its origin.

This chapter could stand alone as its own post. If it does, the core point is this: an Obsidian vault is infrastructure. Like any infrastructure, it only works if you set it up properly. The six steps above are the setup.

---

## Chapter 6: AgentMemory (June 5, 2026 to present)

AgentMemory (`rohitg00/agentmemory`, version `0.9.26`) is what I run today. It is a local REST service that exposes working memory, episodic memory, semantic memory, and procedural memory through a single API, with a four-tier consolidation model and BM25+vector hybrid search.

The reason it won the pilot slot: it was the only system with direct claims of Codex/Claude Code/Hermes integrations, strong adoption signal (21,300 GitHub stars), local-owned storage by default, and an MCP adapter that all three surfaces could use without surface-specific code. No surface-specific backends. One shared substrate.

### The eval gauntlet (Phases 3 through 3h)

I ran AgentMemory through a progressive eval harness before wiring it in permanently.

**Phase 3 (one-day import, June 5):**

```text
Input: 28 normalized sessions / 582 turns (Central date: 2026-05-23)
Seeded: 11 source-backed durable memories via /agentmemory/remember
Export: 30 sessions / 4,639 observations / 11 memories
Result: 16/16 on the scoped Phase 3 eval
Run root: System/Runs/AgentContinuity/phase3-agentmemory-only-final-<ts>/
Key finding: replay/import alone is insufficient as a retrieval index.
Source-backed durable memories are the breakpoint.
```

**Phase 3b (30-day import):**

```text
Input: 764 normalized sessions / 23,174 turns (30-day window)
Seeded: 52 durable memories
Export: 8 paged export files
Restored into fresh instance: yes
Result: 24/24 on both primary and restored eval
Secret scan: 0 matches
Run root: System/Runs/AgentContinuity/phase3b-agentmemory-30day-final-<ts>/
```

**Phase 3c (full history):**

```text
Input: 3,573 normalized sessions / 166,786 turns
Seeded: 77 durable memories
Export: 36 paged export files
Restored into fresh instance: yes
Result: 35/35 on both primary and restored eval
Secret scan: 0 matches
Run root: System/Runs/AgentContinuity/phase3c-agentmemory-full-history-final-<ts>/
```

**Phase 3f (persistent LaunchAgent, 9/9 surface eval):**

After exact approval, the persistent LaunchAgent install passed. Scored 9/9 on the surface eval covering Codex, Claude Code, and the assistant. Notable: the eval passed BOTH in the benign health-critical 503 state AND after the rollback/reinstall cycle.

```text
agentmemory-http=503-health-closed
agentmemory-alerts=memory_critical_96%_rss978mb
agentmemory-usable=true-benign-memory-critical

Surface eval: 9/9 (in both critical and healthy states)
```

**Phase 3g (incremental freshness):**

```text
Input: 1 new normalized session
Result: passed
Finding: fresh-session marker found without full reimport
```

**Phase 3h (citation/provenance):**

```text
Result: 4/4 citation eval
Recall now returns:
  - citation_summary.unique_files
  - citation_summary.unique_source_paths
  - ranked citations
  - source_of_truth_rule: "source files win over recalled memory on conflict"
```

### The import adapter

Plain English first: this script reads the normalized session JSONL files and converts each turn into an "observation" that AgentMemory can ingest. The key filter: turns from users and assistants only. Secret-like patterns excluded before import.

```python
# System/Scripts/agentcontinuity-normalized-to-agentmemory-jsonl.py
def session_turns_to_observations(session_path: Path) -> list[dict]:
    turns = []
    with open(session_path, "r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            try:
                turns.append(json.loads(line))
            except json.JSONDecodeError:
                continue

    observations = []
    for t in turns:
        role = t.get("role", "")
        text = t.get("text", "").strip()
        if not text or role not in ("user", "assistant"):
            continue
        # Exclude known secret-like patterns before import
        if SECRET_PATTERN.search(text):
            continue
        obs = {
            "content": text,
            "metadata": {
                "surface": t.get("surface", "unknown"),
                "session_id": t.get("session_id", ""),
                "session_key": t.get("session_key", ""),
                "source_path": t.get("source_path", ""),
                "timestamp": t.get("timestamp", ""),
                "turn_index": t.get("turn_index", 0),
                "role": role,
            }
        }
        observations.append(obs)
    return observations
```

### Wiring it as a persistent service

The LaunchAgent plist that keeps it alive:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.example.agentmemory-shared</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/bin/python3</string>
    <string>~/Active-Work/System/Scripts/agentcontinuity-agentmemory-shared-service.py</string>
    <string>serve</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <dict>
    <key>SuccessfulExit</key>
    <false/>
  </dict>
  <key>ThrottleInterval</key>
  <integer>10</integer>
  <key>WorkingDirectory</key>
  <string>~/Active-Work</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>~/.bun/bin:~/.local/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    <key>HOME</key>
    <string>~</string>
    <key>NODE_OPTIONS</key>
    <string>--max-old-space-size=4096</string>
  </dict>
  <key>StandardOutPath</key>
  <string>~/Active-Work/System/Logs/AgentContinuity/agentmemory-shared.launchd.out.log</string>
  <key>StandardErrorPath</key>
  <string>~/Active-Work/System/Logs/AgentContinuity/agentmemory-shared.launchd.err.log</string>
</dict>
</plist>
```

The shared adapter config that all three surfaces use:

```json
{
  "schema": "active-work.agent-continuity.agentmemory-shared-adapters.v1",
  "status": "shared_primary_ready",
  "service": {
    "rest_url": "http://127.0.0.1:[PORT]",
    "stream_url": "http://127.0.0.1:[PORT]",
    "viewer_url": "http://127.0.0.1:[PORT]",
    "state_root": "System/State/AgentContinuity/AgentMemory/shared",
    "single_writer": true
  },
  "source_of_truth": {
    "canonical_files": ["Workspace/", "System/", ".agents/skills/", "AGENTS.md"],
    "normalized_sessions": "System/Data/Normalized/Sessions",
    "rule": "AgentMemory is recall substrate only; Workspace/System and normalized
             session files remain canonical provenance."
  },
  "surfaces": [
    {
      "id": "codex",
      "label": "Codex",
      "adapter_command": "System/Scripts/agentcontinuity-agentmemory-recall.py --surface codex --query <query>",
      "role": "implementation and verification recall"
    },
    {
      "id": "claude-code",
      "label": "Claude Code",
      "adapter_command": "System/Scripts/agentcontinuity-agentmemory-recall.py --surface claude-code --query <query>",
      "role": "project coding and session continuity recall"
    },
    {
      "id": "assistant",
      "label": "Assistant",
      "adapter_command": "System/Scripts/agentcontinuity-agentmemory-recall.py --surface assistant --query <query>",
      "excluded_profiles": ["<profile-1>", "<profile-2>", "<profile-3>", "<profile-4>"],
      "role": "assistant continuity recall; primary profile only"
    }
  ]
}
```

The MCP config that connects the coding surfaces to the running service:

```json
{
  "mcpServers": {
    "agentmemory": {
      "command": "~/.local/bin/npx",
      "args": ["-y", "@agentmemory/mcp@0.9.26"],
      "env": {
        "AGENTMEMORY_AUTO_COMPRESS": "false",
        "AGENTMEMORY_INJECT_CONTEXT": "false",
        "AGENTMEMORY_TOOLS": "all",
        "AGENTMEMORY_URL": "http://127.0.0.1:[PORT]"
      }
    }
  }
}
```

### The memory-pressure wall

Once the full corpus is loaded (~170K+ observations), the AgentMemory health endpoint reports `memory_critical`. Here is why:

```javascript
// dist/index.mjs:14681
// The package computes:
memPercent = heapUsed / heapTotal
// Flags critical when:
memPercent > 95 AND rss >= 512MB
// Hard-coded thresholds (no config override):
memoryWarnPercent = 80
memoryCriticalPercent = 95
memoryRssFloorBytes = 512MB
// Calls evaluateHealth(snapshot) with no config at dist/index.mjs:14764
```

At full corpus, the heap legitimately occupies ~786MB of live (non-garbage) memory. GC cannot reclaim it because it is the resident BM25 index. `heapUsed/heapTotal` rides ~95-96% permanently. The health endpoint returns HTTP 503. But recall continues to work fine.

```text
agentmemory-http=503-health-closed
agentmemory-alerts=memory_critical_96%_rss978mb
agentmemory-usable=true-benign-memory-critical
```

The fix was not to reduce corpus size. It was to update the verifier and status tooling to read the 503 body and key off a `usable` flag instead of HTTP status. Critical-but-only-memory-alerts is treated as usable. The production eval still scored 9/9 while health was in this state.

---

## The benchmarking apparatus

Most posts skip this section. It's the part that matters most.

### The eval set: 180 probes, 3 surfaces, 3 modes

The canonical eval set lives at `System/Config/AgentContinuity/recall-eval-set.json`. Schema: `active-work.recall-eval.v2`. Generated 2026-06-08.

```json
{
  "schema": "active-work.recall-eval.v2",
  "generated_at": "2026-06-08T12:36:39-05:00",
  "params": {
    "per_surface": 60,
    "k": 10,
    "seed": 20260608,
    "regions": ["early", "mid", "late"],
    "modes": ["verbatim", "scatter"]
  }
}
```

60 probes per surface (claude-code, codex, assistant) = 180 probes total.

Each probe specifies:

```json
{
  "id": "auto-claude-0001",
  "surface": "claude-code",
  "origin_surface": "claude",
  "query": "How does Code determine project directory use under",
  "region": "early",
  "mode": "intent",
  "expect_session_uuid": "<session-uuid>",
  "expect_within_k": 10,
  "since": "all",
  "source_path": ".claude/projects/-active-work/<session-uuid>/...",
  "note": "auto-generated"
}
```

The three modes are the key design insight:

- **intent**: each session's first substantive user prompt as the query. This is what a real recall looks like ("How does Code determine project directory use"). Realistic.
- **verbatim**: an exact phrase lifted from an early turn in the session. Tests indexing health and basic retrieval.
- **scatter**: a bag of words drawn from mid-turn content ("terminal custom plugin-shipped deny allowWrite show"). Adversarial by design. Tests whether the engine can handle non-representative queries.

Three session regions: early, mid, late. This catches whether recall degrades as sessions age into the corpus.

### The harness: BM25 scoring against the vault

Plain English: the harness scores two things separately. Did the system return ANY relevant document? And did it return the SPECIFIC document we expected? Both matter. They measure different things.

```python
# vault-eval-harness.py (key scoring logic)

def score_probe(probe, docs, df, N, k):
    query_tokens = tokenize(probe["query"])
    expect_uuid = probe.get("expect_session_uuid", "")

    scores = {}
    for path, doc in docs.items():
        score = bm25_score(query_tokens, doc, df, N)
        if score > 0:
            scores[path] = score

    ranked = sorted(scores.items(), key=lambda x: -x[1])[:k]
    top_paths = [p for p, _ in ranked]

    # CANDIDATE HIT: did any vault doc score above threshold?
    candidate_hit = len(top_paths) > 0

    # SESSION HIT: did the vault surface the SPECIFIC expected session?
    session_hit = False
    for p in top_paths:
        doc = docs[p]
        if doc.get("session_id") == expect_uuid:
            session_hit = True
            break

    return candidate_hit, session_hit
```

### The phase gauntlet: AgentMemory results

All from `Workspace/01-Strategy/Reports/AgentContinuity/phase-3e-3h-agentmemory-cutover-freshness-citations-2026-06-05.md` and the MVP plan:

| Phase | Input scope | Seeded memories | Key result |
|---|---|---|---|
| Phase 3 | 28 sessions / 582 turns | 11 | 16/16 scoped eval |
| Phase 3b | 764 sessions / 23,174 turns | 52 | 24/24 (primary + restored) |
| Phase 3c | 3,573 sessions / 166,786 turns | 77 | 35/35 (primary + restored) |
| Phase 3d (shared) | Phase 3c restored into shared service | 77 | 35/35 + 9/9 surface eval |
| Phase 3f (LaunchAgent) | Persistent service | 77 | 9/9 (in both 503-critical and healthy states) |
| Phase 3g (freshness) | 1 new session | 77 | Passed, no full reimport needed |
| Phase 3h (citations) | Persistent service | 77 | 4/4 citation/provenance eval |

Export scope after the full pipeline:

| Artifact | Count |
|---|---|
| Export pages | 36 |
| Exported sessions | 3,576 |
| Exported observations | 170,897 |
| Exported memories | 77 |
| Secret scan matches | 0 |

The delta between 3,573 input sessions and 3,576 exported sessions is the 3 extra sessions added during incremental freshness testing.

---

## The recall-ranking investigation: how I almost misread 27% as a bug

This is the best debugging story in the whole project. It's also the part most memory-system write-ups skip entirely.

### The alarming baseline

After running the hardened 180-probe eval, the first result was:

| Cut | Hit-rate |
|---|---|
| Overall | 27.2% (49/180) |
| Verbatim queries | 36.7% |
| Scatter queries | 17.8% |
| Early-session content | 46.7% |
| Mid-session content | 16.7% |
| Late-session content | 18.3% |

My first instinct was that the ranking was broken. I was wrong.

### What the investigation found

The investigation traced one miss to the engine directly. Probe `auto-claude-0003`, query `"JSON fields date sync note topline"`, expects a specific session.

That session IS in the engine (18 observations). It is correctly NOT in the global top-100 for that query, because the session is an overnight briefing whose observations are dominated by a long system prompt. The query is a scatter of content words lifted from a mid-session turn. No relevance engine should rank that session first for that query.

The investigation also confirmed that the `--since all` path goes through `POST /agentmemory/search` (the engine's own ranking), NOT through a custom term-frequency scorer. Re-running six known misses with `--overfetch 50` and `--limit 50` (fetching up to 500 candidates, keeping 50) recovered zero of them. The correct sessions were genuinely absent from the engine's relevance results, not merely truncated.

The conclusion:

```text
The low baseline is substantially a harness artifact, in the opposite direction
from a bug: distinctive_phrase frequently produces queries that are not actually
distinctive of their source session, worst in scatter mode and in mid/late turns
thick with scaffolding (system prompts, tool boilerplate). The engine is behaving
reasonably; the probes are weak.
```

### The fix: better probes, not a new scorer

Added an `intent` mode that uses each session's first substantive user prompt as the query. This is the shape a real recall actually receives. Re-baselined 180 probes:

| Mode | Hit-rate | Meaning |
|---|---|---|
| intent (realistic) | 85.2% (69/81) | the number that matters |
| verbatim (early) | 56.9% | indexing-health canary |
| scatter (bag-of-words) | 12.5% | worst-case floor |
| Overall blended | 57.8% | mix; not a gating number |
| Mean hit rank | 1.86 | when found, found near the top |
| Duplicate sessions in top-K | 35 | real dedup signal |

When the query reflects the session's actual topic, recall returns the right session 85% of the time at mean rank 1.86. The 27% was the artifact. 85% on realistic queries is the true recall quality.

The obvious fix (rewrite the scorer) would have been effort spent on a path the baseline does not even exercise. The eval's value was not its 27% number. It was proving the 27% was a measurement problem. The real fix was better measurement.

Canonical baselines:

- Strong-probe run: `System/Runs/AgentContinuity/recall-eval/baseline-20260608-representative.json`
- Weak-probe artifact (kept for audit trail): `System/Runs/AgentContinuity/recall-eval/baseline-20260608-weakprobes-artifact.json`

---

## The semantic search abort: when staying boring was the right call

After confirming 85% intent recall on BM25, the natural next step was enabling vector (semantic) recall to close the 12.5% scatter gap.

I enabled `EMBEDDING_PROVIDER=local`, measured it, and turned it back off.

### Why vectors did nothing to existing data

The env var alone changed nothing. The live engine env flipped correctly, but the recall eval was byte-identical to BM25-only (intent 85%, scatter 12.5%). Vectors were never computed for the existing corpus.

The code path: vectors are only ever computed by `rebuildIndex`, which runs at boot only when the BM25 index is empty. The import/observe/write path calls `getSearchIndex().add(...)`, which is BM25-only. New captures never get vectors. Only a full boot-time rebuild does.

### The V8 serialize ceiling

Plain English: at large enough corpus size, the vector index becomes too big to save. V8 (the JavaScript engine) has a maximum string size of about 512MB. The vector index, when serialized to JSON, exceeds that at around 194K observations. That's not a weird edge case. That's what happens when you run a real local memory system at real scale.

```javascript
// buffer.constants.MAX_STRING_LENGTH = 536,870,888 bytes (~512MB)
// At ~194K observations, VectorIndex.serialize() produces ~423MB
// One per-boot ~9-minute CPU pass at ~360 obs/sec
// Risk of Invalid string length error on serialize
```

`VectorIndex.serialize()` builds the entire index as a single `JSON.stringify` string before sharding. At ~194K observations, that string is approximately 423MB, near V8's max string length.

Number reconciliation: the Phase 3c import covered 166,786 turns / 170,897 observations exported. The corpus grew to ~194K observations by June 8 as new sessions accumulated. Both numbers are real; they refer to different dates.

### The second experiment that knocked the live service offline

I tried running an isolated second engine for an A/B test to measure the semantic lift before committing:

```text
The engine bus port and viewer are effectively singletons on the host;
a second isolated engine connects to the LIVE engine bus, and starting/stopping it
twice knocked the live REST routes offline (all /agentmemory/* returned 404 until
a clean launchctl kickstart). The live store was never corrupted (session count
held at 3657 throughout), but the experiment harness cannot run concurrently
with the live service.
```

### The decision: stay BM25-only

BM25 recall is healthy on the queries that matter (85% intent, mean rank 1.86). The scatter/synonym gap is the only real weakness. Closing it requires either an upstream fix (embed on the write path, shard before serialize) or a bounded-corpus approach (embed only the last 30-60 days). Neither was justified by the narrow gap.

Boring and online beats clever and offline.

---

## The honest eval numbers (today)

### AgentMemory numbers

- 35/35 at full history (3,573 sessions / 166,786 turns)
- 9/9 surface adapter eval (all three surfaces)
- 85.2% on realistic intent-mode queries, mean rank 1.86
- BM25-only, ~170K+ observations, REST on a loopback port, persistent LaunchAgent

### Vault numbers

The vault was run against all 180 probes. Corpus: 4,488 docs indexed (4,475 session notes + 12 topic notes + 1 other). Results from `System/Vault/eval-results.json`:

```json
{
  "vault_docs_indexed": 4488,
  "session_notes": 4475,
  "topic_notes": 12,
  "probes_evaluated": 180,
  "expected_sessions_present_in_vault": 120,
  "candidate_hit_rate": 1.0,
  "session_hit_rate": 0.3778
}
```

Decomposed by mode:

| Mode | Probes | Session hits | Session hit rate |
|---|---|---|---|
| intent | 81 | 43 | 0.531 |
| verbatim | 51 | 18 | 0.353 |
| scatter | 48 | 7 | 0.146 |

On probes where the expected session IS in the vault (120 scoreable probes):

```text
68 / 120 = 0.567 session hit rate
```

The `candidate_hit_rate` of 1.0 means the vault returned SOME relevant document for every single probe. It is useful for knowledge queries. It is not yet a reliable replacement for session-history recall.

### The measurement bug I found during this eval

All 60 assistant-surface probes scored zero `session_hit` and showed `expected_session_in_vault: false`. The eval set expects assistant session IDs like:

```text
session_<id>
```

But the vault session notes are named:

```text
assistant-session_<id>.md
```

The summarizer writes the filename as `{surface}-{session_id}.md`, so the vault file contains `session_id: "session_<id>"` in frontmatter. The eval harness's UUID matcher looks for an exact match of `expect_session_uuid` against the `session_id` field. The assistant session IDs include the `session_` prefix, so every assistant probe appears as "not in vault" even though the notes exist. That's 60 probes excluded from the scoreable set. The 0.567 rate on 120 scoreable probes only covers the two coding surfaces.

This is an open bug, not a false positive in the good direction. I'm reporting it prominently rather than burying it. When I found a result that looked suspiciously clean, I traced it until I found the bug. That's the honest measurement story.

### Side-by-side comparison

| System | Realistic query hit-rate | Mean rank (hits) | Notes |
|---|---|---|---|
| AgentMemory (BM25) | 85.2% (intent mode, 69/81) | 1.86 | Session-history recall |
| Vault (BM25) | 53.1% (intent, 43/81 scoreable) | not computed | Knowledge + session queries |
| history-search (pre-retirement) | "6 pass, 4 partial" on 10 questions | not computed | Time-window recall only |
| GBrain (Phase 1) | 0 pass, 3 partial, 7 fail | not computed | Zero clean exits |

---

## The 3-part architecture that survived all of this

After seven iterations, the system is deliberately minimal. From AGENTS.md, Knowledge And Recall section (finalized 2026-06-08):

### Knowledge And Recall

- The memory architecture is a minimal 3-part shape (finalized 2026-06-08):
  (1) a folder of tagged normalized session files at System/Data/Normalized/Sessions/,
      which is the canonical provenance and the cross-surface capture mechanism;
  (2) the shared AgentMemory engine reading it, the canonical cross-surface recall
      substrate on a loopback REST port;
  (3) one scheduled re-read, the 2-step agentmemory-refresh job (normalize + import).
  Use native AgentMemory MCP/tools for ordinary recall when available. Verify recalled
  facts against the real file before editing.
- history-search is fully retired and unloaded as of 2026-06-08: both LaunchAgents
  booted out and their plists plus wrapper scripts moved to Trash.
- GBrain is shelved as of 2026-06-05. It is no longer pilot, conditional, or required
  architecture. Do not start, depend on, or route recall through it.

That paragraph was written in four passes over three months. Each sentence represents something that broke.

1. Normalized session files (System/Data/Normalized/Sessions/)
   One JSONL per session, one turn per line, schema active-work.normalized-session-turn.v1
   Organized by surface: claude/, codex/, assistant/
   This is the canonical provenance. Memory systems come and go. These files stay.

2. AgentMemory engine (loopback REST port)
   BM25-only by choice (semantic search hit the V8 512MB serialize ceiling)
   ~170K+ observations across 4,475 sessions (growing toward ~194K by June 8)
   35/35 on the full-history eval, 9/9 on the surface adapter eval
   Persistent as a LaunchAgent
   Memory-critical health state is benign at full corpus (no fix needed)

3. One scheduled re-read (agentmemory-refresh job)
   2 steps: normalize new sessions + incremental import
   No full reimport needed for new sessions

The rule that prevented adding the wrong layer:

AgentMemory is recall substrate only.
Workspace/System and normalized session files remain canonical provenance.
Generated memories, indexes, and search systems are convenience layers.
They are not canonical truth unless promoted into Workspace/ or System/ with provenance.
Always verify a recalled fact against the real file before editing.

---

## What I learned

### Part A: The principles (plain language)

**Build the eval harness before you build the system.** I ran 10 questions against GBrain without a formal harness. I learned more from 180 formally specified probes with decomposed modes than I did from the entire GBrain pilot. The harness is not overhead. It's the point.

**Let requirements do the filtering.** Of 21+ systems I evaluated, the local-owned plus cross-surface plus provenance requirements eliminated most candidates before touching a terminal. The paper bake-off saved weeks of installation work. You don't need to run everything. You need to know what you need.

**The heavier system lost.** GBrain needed Postgres, custom sync wrappers, git mirror directories, an embedding pipeline, and still produced 0 clean exits on a 10-question test. history-search was a SQLite file and answered 6 of 10 correctly. Operational complexity is a real cost. It shows up in failures at 2am when the cron job can't get a clean exit.

**Curation is being automated.** Every memory system here indexes what you give it. None decides which old reports are stale, which facts are still true, or what should be promoted to canonical truth. I built skills for curation and consolidation, and am now turning them into a scheduled process. Scheduling a skill on a timer is roughly the same as giving it an agent. So curation is moving from manual to automated, not permanently unsolved.

**Keep rollback evidence for everything.** The GBrain Postgres dump exists (431MB). The history-search rollback is documented. The vault runs alongside AgentMemory, not instead of it. Never decommission the old thing before the new thing has passed eval.

### Part B: The technical notes (keep these)

**The 27% finding.** The 27.2% overall recall baseline turned out to be substantially a probe artifact. The `distinctive_phrase` generator picks phrases that are "distinctive" within a session but often share no surface tokens with the way a real user would query that session. Scatter probes (bag-of-words drawn from mid-turn content) hit 12.5%. Intent probes (first substantive user turn as query) hit 85.2%. The number that matters is 85.2%. The 27% was measuring probe representativeness, not recall quality. Build intent mode into your eval from the start.

**The V8 serialization ceiling.** At ~194K observations, `VectorIndex.serialize()` in AgentMemory produces a JSON string approximately 423MB in size. V8's `buffer.constants.MAX_STRING_LENGTH` is ~512MB. The risk of an `Invalid string length` error on `serialize()` is real at this scale. At ~360 obs/sec on the rebuild path, a per-boot full rebuild takes ~9 minutes. The cleanest mitigation paths are embedding on the write path (avoid the full rebuild) or shard-before-serialize (avoid the single-string limit). Neither was implemented upstream as of June 2026. BM25-only is the practical choice at full corpus scale on a laptop.

**The BM25-only tradeoff.** Staying BM25-only means the scatter gap (12.5%) stays open. Semantic search would narrow it: queries that share no surface tokens with the session would start finding results. But at 194K+ observations, enabling semantic search requires either an upstream fix or a bounded-corpus approach. The scatter gap is real. The cost to close it is non-trivial. 85% on realistic queries is a good enough floor for now.

---

## Current state: a head-to-head test

Right now I'm testing both AgentMemory AND the Obsidian vault for the same kind of recall. It's a head-to-head. Not "session memory vs. knowledge memory." Both systems are being asked the same questions and measured on the same probes.

The source of truth underneath both is the same: the Workspace and System files, plus the normalized session histories. Two candidate readers over one canonical source of truth.

The question being answered: which reader do you reach for first?

AgentMemory currently wins on session-history recall (85.2% intent vs. 53.1% vault). The vault currently wins on knowledge queries (candidate_hit_rate 1.0: it always returns something relevant). The assistant-surface measurement bug needs fixing before the vault eval is reliable across all three surfaces.

The thing everything was built to prove:

**Three AI surfaces share the same memory substrate without any surface-specific backends.**

That is the spine of this whole article. Claude Code, Codex, and Hermes/Pam all read the same normalized sessions. They all query the same AgentMemory instance. They all have access to the same vault. No surface has its own separate memory backend. No surface is isolated from what the others have done.

That was the requirement. Everything else was engineering to satisfy it.

---

I'll keep this page updated as the vault eval progresses and the assistant-surface bug gets fixed.

What are you using for local-owned AI memory? Curious whether anyone else has hit the V8 serialize ceiling or found a clean path to per-write vector indexing without a full rebuild.
