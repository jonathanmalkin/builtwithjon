---
title: "I'm Rebuilding My AI Memory System Around gbrain"
date: 2026-05-17
description: "My AI setup was turning into a custom memory platform and agent swarm. gbrain changed the plan: keep files as the source of truth, use gbrain as the active memory layer, and retire the parts that only existed because I had to build around missing primitives."
story: 1
tags: ["ai-agents", "memory", "gbrain", "claude-code", "codex", "knowledge-management"]
platforms: {}
draft: true
---

I have been building my own AI operating system for a while now. The first version solved practical problems: better memory, better workflows, cleaner handoffs between Claude Code, Codex, and a few background jobs.

The workaround layer kept growing.

I had a human-readable knowledge base, a local search index, session-history adapters, and background agents for archiving, pattern detection, research, weekly synthesis, creative ideation, personal assistance, writing, editing, design, development, and QA. Some of that was genuinely useful. Some of it existed because the underlying tools did not give me the memory layer I wanted.

Reviewing [gbrain](https://github.com/garrytan/gbrain) changed the plan. I am rebuilding the system with gbrain as the active memory layer, my file-based Knowledge OS as the source of truth, and the rest of the stack treated as surfaces and workflows.

The operating model is the real decision:

- files stay canonical
- indexes are disposable
- session adapters normalize messy data
- gbrain handles retrieval, graph, sync, and memory maintenance
- interactive tools stay where the actual work happens
- background agents become scheduled brain jobs when they do not need independent judgment

That gives me a smaller system than the one I was designing, and a stronger one.

## The Old Shape

My previous plan was drifting toward a full personal AI workforce.

There was a memory system with multiple tiers. There were background agents with names and jobs. There were separate interactive surfaces for writing, coding, personal assistance, research, synthesis, and operations. There was a custom search layer that indexed files and conversations. There was a growing list of planned adapters, workers, report generators, and evaluation layers.

The system worked because each piece solved a real problem.

The problem was that too many pieces were becoming permanent.

When a system is early, every missing primitive becomes infrastructure. Need cross-session memory? Build an index. Need transcript recall? Write adapters. Need weekly synthesis? Add a job. Need recurring pattern detection? Add another job. Need a thinking partner? Add a profile.

That is how useful systems get heavy.

Each new part feels justified in isolation. The weight only shows up when you draw the whole map.

## The New Shape

The new architecture has four required layers:

1. **The file system as truth.**
2. **gbrain as active memory.**
3. **Surface adapters for messy session data.**
4. **Interactive agents for real work.**

Optional layers come later: gstack for execution discipline, advanced bias/contradiction memory, live thinking-partner behavior, and conversation-local context tooling.

The core stays simple:

My knowledge base remains visible as markdown and source files. gbrain indexes it, links it, searches it, and maintains it. Claude Code and Codex remain the places where I write, design, debug, and build. A personal assistant remains the place for scheduling, follow-up, and daily continuity.

That gives each layer a clear job.

## Files Stay the Source of Truth

I care most about this rule: memory should not become a black box. If an agent says, "we decided this," I need to be able to open the file where that decision lives. If a profile changes, I want a visible diff. If a weekly report says a pattern emerged, I want links back to the evidence.

So the canonical layer stays file-based:

- plans
- reports
- decision records
- profile pages
- research notes
- content drafts
- run logs
- normalized session records

gbrain can create a database, embeddings, graph edges, timelines, and summaries over that material. Those retrieval surfaces make the files more useful, but durable facts still need an inspectable home.

Memory helps the system find and connect things. Truth has to remain readable.

## What gbrain Changes

gbrain has the right mental model for this because it treats a brain as something connected to sources. A source can be a repo or markdown corpus attached to the brain.

That matters because my existing knowledge system is already a file tree. The better move is to make the existing files legible to gbrain and let gbrain operate over them.

For my setup, gbrain becomes responsible for:

- hybrid search over files and sessions
- graph links between related notes, decisions, and concepts
- timeline-style memory
- source sync and embedding
- memory maintenance jobs
- citation repair and enrichment
- background synthesis over the corpus

That replaces a lot of custom glue. Good source material still matters; gbrain makes it easier to retrieve, connect, and maintain.

## The Important Question: What Happens to history-search?

I already had a local history-search system.

It crawled multiple AI surfaces, normalized their session formats, indexed them, and exposed recall through a search interface. It was not glamorous, but it solved a hard problem: Claude Code, Codex, and assistant profiles all store conversation history differently.

gbrain still needs clean inputs, so the adapters stay.

The part that changes is what happens after normalization.

Before, history-search was both the adapter layer and the recall layer. It read the native histories, normalized them into searchable rows, and answered recall questions through its own index.

In the new architecture, history-search becomes a bridge:

1. Keep the surface adapters.
2. Keep raw session files.
3. Export normalized transcripts into durable source files.
4. Let gbrain index those files.
5. Use history-search as a parity benchmark until gbrain is better.

That means the hard-won adapter work survives. The local search index stops being the permanent memory surface.

The retirement target is the query layer. The normalization layer stays.

## The Seven Memory Tiers

I still like the seven-tier memory model. gbrain changes how much custom infrastructure I need to build for each tier.

### Tier 1: Sources

This is basic file recall.

"Where is the plan?"

"What report covered this?"

"Which source file explains the decision?"

gbrain is a strong fit here. It can index the knowledge base and system evidence as named sources.

### Tier 2: Conversation History

This is cross-session recall.

"What did we work through yesterday?"

"When did I decide to stop building that?"

"What did Codex fix last week?"

gbrain can handle this once the existing adapters export normalized session records into source files. The hard work is preserving turns, timestamps, tool summaries, provenance, and enough context that the result is actually useful.

This is the main migration gate.

### Tier 3: Concept Search

This is the "I cannot remember what I called it" tier.

Keyword search fails when you remember the shape of an idea but not the label. gbrain's hybrid search and graph behavior should be a better fit than extending my own custom index forever.

This still needs evaluation. Search quality is one of those things that looks good in demos and gets weird in daily use.

### Tier 4: Profiles and Positions

This is authored memory.

Who am I? What do I believe? What have I decided? What preferences should the system respect?

This tier needs governance more than cleverness. gbrain can help surface evidence and propose updates, but profile and decision truth should change through visible diffs or explicit approval.

No silent personality rewrites.

### Tier 5: Patterns

This is where gbrain gets especially interesting.

I had planned separate background agents for archiving, subconscious pattern detection, weekly reflection, and creative recombination. Those jobs still matter, but they can share the same brain-backed infrastructure.

Pattern detection can become a scheduled brain job.

Weekly synthesis can become a gbrain-backed report.

Creative ideation can run as a recurring brain skill.

The capability stays. The agent swarm shrinks.

### Tier 6: Biases and Contradictions

This is a later project.

The system should eventually help distinguish between:

- a stable preference
- a temporary mood
- a real contradiction
- a changed mind
- a bias worth challenging

gbrain can provide evidence. A separate interpreter should decide what a contradiction means.

That interpreter needs careful design.

### Tier 7: Live Thinking Partner

This is also later.

The eventual goal is for the system to notice patterns in the moment: "You have made this move before," or "This sounds like the version of the decision you regretted last time."

That can be valuable. It can also be annoying or overreaching.

So Tier 7 belongs after the backend migration. It is an interaction design problem. Build it after the evidence layer works.

## What Gets Consolidated

The biggest simplification is role consolidation.

Some "agents" are really memory jobs:

- archiving
- transcript cleanup
- citation repair
- pattern detection
- daily maintenance

Those can move into gbrain-backed scheduled jobs.

Some agents are really modes of an interactive surface:

- writer
- editor
- designer
- architect
- strategist

Those belong where the work happens. In my case, that is Claude Code for writing, architecture, and design direction, and Codex for implementation and debugging.

Some roles still deserve a separate surface:

- personal assistance
- calendar and follow-up
- mobile continuity
- approval routing

Those remain assistant jobs.

The result is less like an org chart and more like an operating system.

## Where gstack Fits

[gstack](https://github.com/garrytan/gstack) is interesting, and I am keeping it outside the core V7 plan for now.

The tempting move would be to say:

"gbrain handles memory, gstack handles execution, now the system is complete."

Maybe. The current system does not need that assumption yet.

Right now Claude Code and Codex already give me a strong implementation loop: plan, edit, test, review, debug, ship. My local build and debug workflows are good enough to run the business.

Separately running dev and QA agents may be useful. gstack may catch defects or speed up certain workflows. But it needs to prove that on real work.

So gstack becomes a later evaluation rather than a dependency.

The acceptance gate is simple: if it catches real defects or speeds up real shipping beyond the current workflow, keep exploring it. If not, leave it optional.

## Where Lossless Context Management Fits

Lossless Context Management is a different category.

It preserves continuity inside long or compressed conversations. That helps a different part of the stack than durable memory across files, sessions, profiles, and decisions.

gbrain is the memory substrate.

LCM is conversation-local continuity.

I am separating those evaluations. I only need LCM if I can point to real continuity loss that my current threads, handoff notes, and gbrain-backed recall leave unsolved.

## The Migration Plan

The rollout is deliberately boring.

### Phase 0: Decision record

Write down the architecture, assumptions, and rollback plan.

At this stage I am avoiding daemons, broad installs, and migration theater.

### Phase 1: Read-only gbrain pilot

Point gbrain at a small, safe sample of the knowledge base. Test setup friction, recall quality, provenance, graph behavior, latency, and usefulness.

The first gate is simple: no source mutation and useful recall.

### Phase 2: Canonical source wiring

Add the main knowledge and system evidence folders as named sources. Keep the old search layer available.

Run top recall prompts through both systems.

### Phase 3: Session memory bridge

Reuse the existing adapters for Claude Code, Codex, and assistant sessions. Export normalized transcripts into durable source files that gbrain can index.

Raw session files stay preserved. Normalized files become the readable layer.

The gate: gbrain must answer session-recall questions with citations to normalized source files.

### Phase 4: Always-on brain jobs

Move archiving, pattern detection, creative recombination, and weekly synthesis into scheduled brain jobs.

This is where the system should get smaller. If the number of jobs goes up, the migration failed.

### Phase 5: Optional execution layer

Evaluate gstack or separate dev/QA profiles only after the memory core works.

An execution framework earns promotion through real builds, not through a complete-looking diagram.

### Phase 6: Advanced memory tiers

Build bias, contradiction, and live thinking-partner behavior after the source and session layers are stable.

These features need evidence quality and careful interaction design.

### Phase 7: Optional context management

Evaluate LCM only if real compressed-conversation pain remains.

## The Acceptance Gates

I am trying to avoid the classic failure mode: replacing one messy system with a prettier messy system.

The gates matter.

**Source-of-truth gate:** every durable claim traces back to a visible file or approved brain page.

**Recall parity gate:** gbrain must beat or match the existing recall system on real prompts, not demo prompts.

**Session recall gate:** conversation results must cite useful normalized turns, not just vague session metadata.

**Profile governance gate:** identity and preference updates require visible diffs or explicit approval.

**Job simplification gate:** the number of background agents should decrease while the weekly synthesis gets at least as useful.

**Operational health gate:** sync, embed, maintenance, and report jobs need visible non-secret status.

**Optional execution gate:** gstack earns a permanent place only if it improves real builds.

This is how I keep the migration honest.

## The Lesson

Custom memory solved real problems.

The error would be treating every workaround as permanent infrastructure.

history-search solved a real problem. The adapters still matter. The recall prompts still matter. The eval harness still matters.

Once the normalized data can live as source material, gbrain can become the memory layer over it.

The keeper architecture is a file-based operating system with an active memory layer over it. That is the version I want to keep building.
