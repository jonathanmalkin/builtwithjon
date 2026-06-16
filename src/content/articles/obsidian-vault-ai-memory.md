---
title: "How to Set Up an Obsidian Vault as a Real AI Memory System (6 Steps, Including the MCP Layer Everyone Skips)"
date: 2026-06-16
description: "A folder of markdown is not AI memory. Six steps turn an Obsidian vault into something an agent can query, including the MCP layer everyone skips."
story: 1
tags: ["obsidian", "ai-memory", "mcp", "pkm", "knowledge-management"]
draft: false
---

Most people do the same three things. They collect their markdown into one folder, they open Obsidian, and they decide they now have an AI memory system. They do not. A folder of notes is not a memory system. It is a folder of notes.

The gap between those two things is six deliberate setup steps. Five of them are the kind of thing a careful PKM person already half-does: a real home, a real folder structure, wikilinks, structured notes. The sixth is the one almost everyone skips, and it is the one that actually matters. You have to stand up an MCP server so an AI agent can query the vault directly, without you copying and pasting note contents into a chat window.

I built this alongside a larger memory project (three AI surfaces sharing one substrate, documented in full at [builtwithjon.com/articles/memory-systems-history](https://builtwithjon.com/articles/memory-systems-history)). This piece is the vault walkthrough pulled out and expanded, with the real config, the real summarizer code, and the real eval numbers, including a measurement bug I had to confess. The receipts are at the bottom.

---

## Why a vault, and not just a notes app

Before the steps, the one constraint that makes this worth doing.

I needed memory my AI agents could actually read and search, not memory I had to read to them. A notes app solves the human side of that. You can see your notes, link them, and search them with your own eyes. It does nothing for the agent side. The agent cannot open Obsidian. It cannot click a graph view. It has no idea your notes exist unless something hands them over in a structured, queryable form.

That is the whole difference between a notes app and a memory system. A notes app is read by a human. A memory system is read by both a human and an agent, from the same files, with no manual copy-paste in the middle. Every step below exists to satisfy that one requirement: human-readable and machine-readable from a single source of truth.

If you only ever read your own notes, you do not need any of this. Obsidian alone is enough. The moment you want an agent to retrieve from your vault on its own, you need all six steps.

---

## Step 1: Collect your files into one area

A memory system needs a home. Mine lives in a single vault folder under `System/Vault/`. Every note goes there.

This sounds trivial. It is the step people skip without noticing, because their notes are not actually in one place. They are spread across a notes app, a Downloads folder, three project repos, and a synced cloud drive. You cannot point an agent at five locations and call it a vault. Pick one root. Start moving things into it. The point of consolidation is not tidiness. It is that an agent can be told exactly one path and find everything from there.

---

## Step 2: Give them a real folder structure

A pile of files in one folder is still a pile. You need an organization you will actually use and that the notes can point into.

This is the high-level structure I run. It is not sensitive, and high-level is all you need to copy the pattern:

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

.agents/skills/   - shared skill library for the agents

Code/             - project code
```

Two things matter here. First, `Workspace/` is human work and `System/` is machinery, with the vault living inside `System/` next to the data that feeds it. Second, the vault itself splits into `topics/` (durable notes about a subject) and `sessions/` (generated summaries of what happened). That split is load-bearing, and it shows up again in steps 3 and 4.

The structure is not the secret. The discipline is. A structure like this means every note knows where it sits and where it can point. A filename soup does not, and an agent retrieving from filename soup gets soup back.

---

## Step 3: Link notes with wikilinks so it is a graph, not a pile

A pile of unlinked notes is searchable but not navigable. You can grep it. You cannot traverse it. Wikilinks are what turn the pile into a graph.

In Obsidian and in plain markdown, a wikilink looks like this:

```text
[[memory-architecture]]
```

That single link creates a navigable connection from the current note to the `memory-architecture` note. Follow enough of them and you have a knowledge graph an agent can walk, not just a flat index it can keyword-match against.

In a topic note, I keep a `Related:` line that gathers the wikilinks to neighboring concepts:

```markdown
Related: [[recall-eval]] [[approval-gates]] [[content-engine]]
```

Those are not decoration. When an agent reads a note and sees that line, it can follow the links to related context without being told in advance what to search for. The note carries its own map of where to look next. That is the difference between a memory system that answers the question you asked and one that surfaces the thing you should have asked about.

---

## Step 4: Generate session-summary notes deterministically

Steps 1 through 3 give you durable topic notes. But most of your useful memory is not durable knowledge. It is the running record of what you actually did: the sessions. Session notes are the bridge between "what happened" and "what I know."

The trap here is reaching for an LLM to write those summaries. Do not. An LLM summarizer is slow, costs money per note, is non-deterministic (re-run it and you get a different summary), and quietly hallucinates. For a memory system, determinism beats cleverness. You want the same input to produce the same note every time, with zero network calls.

I generate session notes with a script that reads one normalized session file and emits a structured markdown note by pure extraction. Here is a real session note it produces (the captured content is a synthetic neutral example, and the session id is a placeholder):

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

The two functions that do the real work are an extractive topic ranker and an extractive key-point puller. No model. Just frequency counts and sentence heuristics:

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

`extract_topics` counts meaningful tokens across the session and keeps the top six. `extract_key_points` walks each turn, splits it into sentences, and keeps short declarative ones while skipping anything that looks like code or pure symbols. That is the entire intelligence layer, and it is enough. Running this across all 4,475 of my normalized sessions produces 4,475 session notes, and that is the bulk of the vault corpus.

If you do not have normalized session files, the same pattern works on any source you can read line by line: chat exports, meeting transcripts, daily logs. The principle holds. Extract deterministically, write structured frontmatter, do not phone an LLM for every note.

---

## Step 5: Stand up the MCP server so an agent can query the vault

This is the step everyone skips. It is also the step that converts a notes app into a memory system, so read this one twice.

Without a query layer, Obsidian is a notes app. A very good one, but a notes app. The agent still cannot read it. You are still the integration: you open the vault, you find the note, you paste it into the chat. That is not memory. That is you being a slow database.

The Model Context Protocol (MCP) is the missing layer. An MCP server exposes a capability to an AI agent over a standard interface. The filesystem MCP server exposes a folder: the agent can list it, search it, and read files in it. Point that server at your vault and the agent can now query the vault on its own.

Here is the config. It runs the official filesystem MCP server and points it at the vault folder (paths shown relative, with `~/` standing in for your home directory):

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

That is the whole thing. Read it again and notice what is not there.

No LLM. No embeddings. No vector database. No Docker. No background service to keep alive. The filesystem MCP server is a small npx package that reads files off disk and hands them to the agent when asked. For a markdown vault, that is enough. The notes are already human-readable text with structured frontmatter and wikilinks, so plain filesystem access plus the agent's own reasoning does the retrieval. You do not need to vectorize a folder of markdown to make it queryable. You need to expose it.

Add this block to the MCP config of every surface that needs vault access (any MCP-compatible agent client). Once it is wired, an agent can answer "what do my notes say about how I structure system prompts" by listing the vault, searching for relevant files, and reading them, with no human in the loop.

People skip this step because the first four steps feel like progress and look like a finished system in the Obsidian UI. They are not finished. Until step 5, nothing but you can read the vault. Step 5 is the difference between a beautiful graph you admire and a memory an agent uses.

---

## Step 6: Run an eval so you know it actually retrieves

Do not trust a retrieval system you have not measured. A vault that looks great and retrieves badly is worse than no vault, because you will rely on it and not notice the misses.

So I ran the vault against the same 180-probe eval harness I use for the rest of the memory project. The harness scores two different things on purpose, because they answer different questions. Did the vault return any relevant document at all (candidate hit)? And did it return the specific note I expected (session hit)? A system can be great at the first and weak at the second.

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

Here are the honest numbers. The vault indexed 4,488 documents (4,475 generated session notes, 12 durable topic notes, and 1 other). From `System/Vault/eval-results.json`:

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

Decomposed by query type:

| Mode | Probes | Session hits | Session hit rate |
|---|---|---|---|
| intent (realistic) | 81 | 43 | 0.531 |
| verbatim | 51 | 18 | 0.353 |
| scatter (bag-of-words) | 48 | 7 | 0.146 |

Read those numbers honestly. The `candidate_hit_rate` of 1.0 means the vault returned some relevant document for every single probe. It always has something useful to say. That is exactly what you want for a knowledge query like "what are my durable principles for structuring AI system prompts." The vault is strong there.

The `session_hit_rate` of 0.378 overall (53.1% on the realistic intent-mode queries) means it surfaces the one specific note you expected a little over half the time on realistic queries, and much worse on adversarial bag-of-words queries. That is honest, and it is the part to be clear-eyed about: the vault is a strong knowledge retriever and not yet a reliable replacement for session-history recall. For "what exactly did I decide in that session three weeks ago," a dedicated session-recall engine still wins. The full head-to-head against that engine is in the [flagship article](https://builtwithjon.com/articles/memory-systems-history).

---

## The measurement bug I found while running this eval

This is the part most write-ups bury. I am putting it in the middle.

When I first ran the vault eval, all 60 probes for one agent surface scored zero session hits and reported `expected_session_in_vault: false`. That looked suspiciously clean, in the bad way, so I traced it.

The eval set expects session ids of the form `session_<id>`. But the summarizer writes each note's filename as `{surface}-{session_id}.md`, which produces files named `assistant-session_<id>.md` with `session_id: "session_<id>"` in the frontmatter. The harness matcher compares `expect_session_uuid` against the `session_id` field by exact match, and the filename-prefix mismatch meant every one of those 60 probes appeared as "not in the vault" even though the notes were sitting right there. The bug silently zeroed 60 probes and quietly inflated how clean the rest of the run looked.

That is an open bug in my measurement, not a happy accident in my favor, and I am reporting it loudly rather than burying it. The honest takeaway is the reason step 6 exists at all: an eval is not there to produce a flattering number. It is there to catch the moment your numbers are lying to you. The clean-looking result was the tell. If I had skipped the eval, I would be trusting a vault I had never actually tested on a third of its corpus.

---

## This is not just a notes app

Here is the framing to keep. An Obsidian vault, set up this way, is infrastructure. Like any infrastructure, it does nothing until it is wired correctly, and it fails quietly when it is not.

A notes app stops at step 1. Some careful PKM setups reach step 3. Almost nobody does step 5, and that is the exact step that separates "a folder I look at" from "memory an agent queries." Steps 4 and 6 are what keep it honest at scale: deterministic generation so the corpus is trustworthy, and a real eval so you know what it actually retrieves.

You do not need a vector database, an embeddings pipeline, or a Docker stack to make a markdown vault readable by an AI. You need one place, a real structure, wikilinks, deterministic notes, a filesystem MCP server, and an eval. Six steps. The fifth is the one to stop skipping.

The full memory-systems story, including the engines I ran alongside this vault, the ones I tore down, and the head-to-head numbers, lives in the flagship piece at [builtwithjon.com/articles/memory-systems-history](https://builtwithjon.com/articles/memory-systems-history).

---

For the r/ObsidianMD crowd: has anyone here actually wired their vault to an AI agent through MCP, rather than copy-pasting notes into a chat? I am especially curious whether plain filesystem access has held up for you at scale, or whether you found you genuinely needed embeddings on top of the markdown. Where did filesystem-only retrieval start to break down in your vault?
