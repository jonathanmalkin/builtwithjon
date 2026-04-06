---
title: "The Best AI Infrastructure Is Temporary"
date: 2026-04-06
description: "I built 24/7 AI infrastructure on Claude Code before Anthropic shipped it natively. Building ahead of the platform was the easy part. Recognizing when to delete what still worked was the real skill."
story: 3
tags: ["claude-code", "ai-automation", "workflow", "simplification", "solo-founder"]
draft: false
---

The best AI infrastructure I built for Claude Code was temporary.

I had 24/7 Slack communication with Jules from my phone. Persistence across sessions. Scheduled workflows. Overnight retrospectives. Morning briefings waiting for me when I woke up. Content automation. Not a framework. Not a wrapper business. Just built directly on Claude Code, because Claude did not natively do what I needed yet.

It worked. Then Anthropic started shipping the primitives I had been compensating for.

So I deleted most of it.

Everything interesting is in why the deletion was harder than the building.

## What I Built and Why

The architecture had three environments:
- Mac for interactive work
- VPS container for always-on automation
- Phone access through a custom Slack daemon.

The Slack daemon handled 24/7 communication. Cron jobs and scripts handled recurring work. The VPS existed because laptop sleep, battery, reboots, and local process fragility were real constraints. This was not speculative architecture. I wanted a working system, not a demo of one. Claude did not give me that yet. So I built it.

For a while, it was the right answer.

## When the Platform Caught Up

Channels changed the phone-access story. Dispatch changed the async-work story. Scheduled tasks changed the recurring-work story. The replacements were not one-to-one perfect, but the direction was clear: what I had custom-built was becoming platform-native.

The custom stack did not break. It stopped being leverage.

That is a harder moment to recognize than a failure. The system still worked. I had months invested. Every piece was doing what I asked it to do. I was not looking at a broken thing. I was looking at a working thing that was no longer the best version of itself.

## Why Self-Improvement Did Not Help Me See It

In the middle of the simplification, I audited the self-improvement loop I had built around the system.

Over 47 retrospective cycles, it had applied 115 changes:
- 105 additive
- 3 simplifications

That's a 35:1 complexity ratio. The system was only getting more complex!

Before my first prompt each session, the system loaded around 1,850 lines of rules, profiles, memory, and workflow instructions. Many were tied to the VPS era, one-off failures, or workarounds for limitations that no longer existed.

This is the pattern I think most people building serious AI systems will hit. Self-improvement loops optimize locally. They fix the last thing that went wrong. They do not step back and ask whether the layer they are improving should still exist. Every individual fix is reasonable. The accumulation is invisible until you audit it.

My system got better and heavier at the same time. The loop that was supposed to optimize it only ever made it bigger.

## What Deletion Bought Me

The simplification pass touched 879 files and removed roughly 62,000 lines.

A lot of that machinery was not strategically differentiating. It was there because Claude did not used to do certain things, and I needed those things anyway. Once the platform closed those gaps, the workarounds became maintenance.

The smaller system starts cleaner, contradicts itself less, and frees me to do the work I built Jules for in the first place instead of maintaining scaffolding.

## The Actual Lesson

Building ahead of the platform is the easy part if you are motivated enough.

The hard part is the deletion. And your self-improvement loops will not help you see when it is time. They are designed to add.

If you build serious AI infrastructure early, assume some of what you build is temporary. That is not failure. That is what happens when you build at the edge of a fast-moving platform.

The skill is not building it. The skill is recognizing when to stop maintaining it.

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*
