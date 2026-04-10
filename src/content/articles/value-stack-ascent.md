---
title: "Solo Founder + AI Isn't About Productivity. It's About What Kind of Thinking You're Doing."
date: 2026-03-19
description: "The 5-layer value stack model for solo founders using AI. Infrastructure, workflow, tasks, agent management, strategy. The real leverage isn't doing more. It's doing different work."
story: 3
tags: ["claude-code", "jules", "solo-founder", "productivity", "strategy", "ai-agents"]
draft: false
---

I noticed something shift a few months into building Jules, my Claude-based AI setup.

I wasn't spending time on the things I used to spend time on. Not because I got faster at them. Because I'd stopped doing them entirely.

Jules handles deploys, cron jobs, container management, content scheduling, morning briefings. Not "helps me with." Handles. Autonomously. Standing orders, not repeated instructions.

And at first I thought: great, I'm more productive.

But that's the wrong frame.

The more accurate frame: I've moved up a layer. And the further up I go, the more the job changes in character. Not just in volume.

## The 5-Layer Model

Here's how I think about it:

| Layer | Who handles it | What it looks like |
|-------|---------------|-------------------|
| Infrastructure | Jules (fully autonomous) | Servers, deploys, cron, containers |
| Workflow management | Jules (with standing orders) | Pipelines, content cadence, scheduling |
| Task execution | Jules (with parameters) | Write this, research that, post this |
| Managing agents | Me (now) | Directing Jules, approving decisions, setting context |
| Strategic | Me (the core job) | Why we're building this, for whom, what direction |

The progression: **doing → managing agents doing → setting direction for agents managing agents doing**.

## What Each Layer Actually Looks Like

Most discussions of AI productivity stay abstract. Let me make each layer concrete.

**Infrastructure** is everything that has to exist before anything else works. On a given day, this means: the container running on a DigitalOcean VPS stays healthy, secrets refresh at 2:30 AM via a scheduled job, the Slack daemon restarts if it crashes, and production deploys go through a staging check before they're promoted. Jules watches all of this. I don't think about any of it unless something breaks. And if something breaks, Jules tells me.

Before Jules handled this layer, I was the on-call engineer for my own solo app. Now that layer just runs.

**Workflow management** is how work moves through the system. The content pipeline has five stages (seeds, drafts, pending review, approved, published). Jules tracks what's in each stage, expands seeds into drafts overnight, schedules posts for the right days, and flags when something's been sitting in pending too long. I don't manage the pipeline. I put things into it and approve things coming out of it.

**Task execution** is where most people start with AI tools, and where most people stop. "Write me a draft." "Research this." "Post that." These are useful. But they're the smallest layer of value if you stop there. Task execution is the bottom floor, not the ceiling.

**Managing agents** is where things get interesting. This is the layer I actually operate at most of the time now. It means: giving Jules context on what I'm trying to accomplish, reviewing Jules's decisions and approving or redirecting them, setting standing orders that reduce the back-and-forth on recurring decisions. It's not management in the corporate sense. It's more like having a collaborator who moves fast but needs your read on direction.

**Strategic** is the layer the whole stack is supposed to free up. I'll get into this more below, because it's the one that actually matters, and also the one that's easiest to neglect.

## The Solo Founder Is Running All Five Layers Simultaneously

There's something useful about mapping this to a traditional org chart.

At a real company, these five layers correspond roughly to: IT/DevOps (infrastructure), project management (workflow), individual contributors (task execution), middle management (managing agents), and executive leadership (strategic).

Five distinct job functions. Five distinct skill sets. Five different people, or five different teams.

A solo founder is all five simultaneously. Before AI, that was a genuine constraint. You could maybe hire a VA to help with tasks, maybe use tools to handle some infrastructure, but the capacity problem was always: there's only one of me and five layers of work.

The solo founder + AI combination doesn't just make you faster. It redistributes the load across the stack. Jules handles the bottom three layers mostly autonomously. I operate at layers four and five. The leverage isn't "I do the same work faster." It's "the work I'm doing has changed."

## Infrastructure Gravity (The Trap I Keep Catching Myself In)

Infrastructure gravity is real. And it's subtle.

Building systems is engaging. It has a tight feedback loop. Improve a prompt, the output gets better. Wire up a new hook, the workflow smoothes out. Each small improvement compounds. Jules is good at infrastructure work, and watching it get better is genuinely satisfying.

So there's always a reasonable-seeming next thing to build.

A few weeks ago I spent most of an afternoon optimizing how Jules formats morning briefings. Not because the briefings were broken. Not because the format was causing any actual problem. Because there was a more elegant way to do it, and finding elegant solutions is its own reward.

I caught it about three hours in. The question that surfaced: "Is this creating capacity for something specific, or is it infrastructure for its own sake?"

The honest answer was: infrastructure for its own sake. The briefings were fine. What I needed to be doing was working on the product strategy question I'd been avoiding, which required actual thinking and had no tight feedback loop and wouldn't feel like progress when I was done.

I stopped. Wrote a note about what the format improvement would look like if I came back to it. Opened the strategy doc.

This is the tension the model makes visible: every hour spent at the infrastructure layer is an hour not spent at the strategic layer. Sometimes that trade-off is worth it. New infrastructure genuinely does create capacity. But the pull toward infrastructure is constant, and it's not always in service of something real.

The question I try to hold: "What is this load-bearing for?"

## What Strategic Layer Work Actually Looks Like

When I say "strategic layer," I don't mean sitting in a conference room with a whiteboard.

For a solo founder building an app for a specific audience, strategic layer work looks like:

**Customer research.** Talking to users. Reading their feedback. Understanding what they're actually looking for versus what they say they're looking for. An AI product can have strong engagement and still point in the wrong strategic direction. What do users want next? I don't know. That question requires thinking, not automation.

**Direction-setting.** Not "which task should Jules do today" but "what should we be building, and for whom." A few weeks ago I made the decision to shift primary focus toward AI services and implementation work. That decision changed everything downstream. Jules executes within whatever direction I've set. Jules can't set the direction.

**Judgment calls under uncertainty.** Should the rebrand happen now or later? Should I add a monetization layer or stay value-first longer? What kind of content builds the right audience? These questions don't have optimizable answers. They require making a call with incomplete information and seeing what happens. That's the job at the top of the stack.

**Deciding what to build next.** The most valuable question a solo founder can sit with. It's also the one that's easiest to avoid by doing more infrastructure work.

Strategic layer work has no tight feedback loop. You make a decision, and you find out months later whether it was right. It requires sitting with ambiguity in a way that infrastructure work doesn't. That discomfort is part of why infrastructure gravity is so real.

## The Inflection Point Wasn't Dramatic

No single moment where everything changed. It was gradual.

First time Jules shipped to production autonomously. First time a cron job ran without me touching it. First time a standing order covered something I used to decide every time.

Each small delegation moved the floor. Over months, the floor moved a lot.

What I notice now: when I have to drop back down to handle infrastructure, it feels like context-switching into a different job. Not because the work is beneath me. Because I've genuinely adapted to operating at a different layer. The lower layers feel like a different mode.

That's the clearest signal that the stack is working.

## What This Means for How You Build

If you're building an AI setup (or a workflow, or a system), the question isn't just "can I get this to work?"

It's: "What layer am I working toward freeing up? What will I do with that capacity?"

The infrastructure is not the point. The layer it enables you to operate at is the point.

Most Claude Code content, including most of mine, focuses on the bottom layers. How to configure, how to hook, how to automate. That's all load-bearing. But it's load-bearing *for* something.

The thing it's load-bearing for is the capacity to think at a level that actually shapes what gets built and why.

Don't just ask "did I automate this task?" Ask "did automating that task move me up a layer? And what am I doing with that layer?"

That's the question that matters.

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*
