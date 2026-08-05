---
title: "Give Claude a Map, Not a Dump"
date: 2026-08-10
description: "Every new session starts from scratch. Connecting Claude to more sources helps, but connection is not organization. A three-file routing pattern gives Claude a reliable way into prepared context without reorganizing your whole workspace."
story: 1
tags: ["claude", "context", "workflow", "ai-automation", "solo-founder"]
draft: true
---

Every new Claude session, I explain who I am. I explain what I'm working on. I point it toward some files. Then I spend several minutes rebuilding context I already built yesterday.

The work was never missing. It exists across email, Google Drive, Notion, calendars, project tools, and three versions of the same document named final, final-2, and final-actually-use-this-one.

We've spent years building a working world across all these places. Opening a new session still doesn't start with a reliable picture of that world.

The obvious response is to connect Claude to more sources. That helps. But it doesn't solve the actual problem.

## Connected is not organized

Connectors are useful. I use them. They surface information that would otherwise stay buried in a specific tool.

But connection opens the doors. It doesn't decide what matters, reconcile the formats, thread a meeting to the right people, or tell Claude how to use what it finds.

Connect every source and stop there, and Claude has access. Not a reliable route through the context.

A map does what connection cannot: it points toward the right material and carries instructions for using it.

## The simplest version

Suppose I ask Claude to prep me for a meeting.

In the Cowork project I use for this, there is one mounted folder and standing project instructions that point toward `CLAUDE.md`. That file is the workspace map. For a meeting question, the intended route goes to Relationships.

Inside Relationships, `CONTEXT.md` explains that part of the workspace. People live here. Meetings live here. Companies live here. Meeting-prep instructions live here.

That file points toward `Meeting-Prep.md`. The workflow explains how to find the relevant meeting and what kind of briefing to produce.

Three files. Three stops.

```
CLAUDE.md                         workspace map
Relationships/CONTEXT.md          relationship map
Relationships/Meeting-Prep.md     meeting-prep instructions
```

This is not magic memory. It is repeatable orientation.

Start with one recurring question, one folder that owns it, and one workflow. You do not need to reorganize your whole workspace over the weekend.

## Where the instructions live

One distinction matters in practice.

Skills are for reusable capabilities you want available across projects or domains. Meeting prep is tied to the Relationships files specifically, so the workflow lives there, and `CONTEXT.md` points to it only when Claude enters that part of the workspace.

The instructions live with the work they govern.

## At company scale

The same pattern applies at company scale. But company material usually arrives in several formats and systems: email, support calls, video transcripts, customer feedback, documents in various states, structured exports.

Some sources need threading. Some need extraction. Some need privacy treatment. Some already have useful text but inconsistent layouts and repeated material.

Before a map can route Claude toward useful context, the material itself has to become consistently usable.

One anonymized client example: we started with roughly 5,000 messages. We narrowed to 1,200 human correspondence threads, ran privacy treatment, and produced 900 prepared, consistently-formatted files.

That preparation runs on a schedule instead of starting inside every question. The original systems stay authoritative. Live connectors handle something newly arrived, intentionally excluded, or outside the prepared route.

At company scale, the file map looks like this:

```
Brain/
  CLAUDE.md                   describes major material types and recurring work
  Indexes/
    Support-Calls.md          shortlist of relevant records
    Video-Transcripts.md
    Customer-Feedback.md
    Email.md
    Marketing-Content.md
  Support-Calls/
    support-call-07.md        prepared record with source details
  ...
```

The route is still three stops: `CLAUDE.md` to `Support-Calls.md` to `support-call-07.md`.

More material does not require a more complicated system. It requires clearer routes and better preparation.

## Where to start

Pick one recurring question your team currently checks five places to answer.

Build three files: a root map that points toward the right domain, a domain file that explains what lives there, and a workflow that guides the specific recurring question.

Prepare the material those files govern. Run that preparation on a schedule. Let the original systems stay authoritative.

Then ask the question.

If it takes noticeably less setup than it did yesterday, the pattern is working. If it doesn't, the route or the preparation is the problem, not the idea.

The framework and starting points are at [builtwithjon.com/claude-meetup](https://builtwithjon.com/claude-meetup).

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*
