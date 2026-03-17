---
title: "I Burned Through My Claude Max Block in 4 Hours. Here's What the Data Shows."
date: 2026-03-17
description: "Real usage data from running Claude Code across two machines on one Claude Max account. Five days of billing block analysis with ccusage, promo window math, and practical takeaways for managing usage."
story: 1
tags: ["claude-code", "claude-max", "usage", "ccusage", "billing", "infrastructure"]
draft: false
---

I ran out of my 5-hour Claude Max usage block today after about 4 hours of interactive work. Instead of being annoyed, I decided to dig in. What I found was genuinely surprising.

I run Claude Code across two machines. Mac and a VPS container, same Claude Max account. Earlier in the week I was working primarily on the VPS with some light Mac usage. Then I switched to Mac-primary with the VPS handling automated jobs. Either way, the billing blocks don't care which machine the tokens come from.

---

## The Combined Picture

These numbers are API-equivalent costs that ccusage uses to estimate block capacity. Claude Max is a flat subscription, so these aren't actual charges. They're how ccusage maps your token consumption against estimated block limits.

**Daily combined usage (Mac + VPS, API-equivalent):**

- Mar 13: $168 equivalent (VPS alone: $107)
- Mar 14: $73
- Mar 15: $107 (Mac hit 100% of a block at 1x rate)
- Mar 16: $148 (one VPS block consumed 92M tokens)
- Mar 17: $54 (Mac hit 148.6% of estimated block capacity. Ran out.)

Even working mostly on one machine at a time, the secondary machine's usage still eats into your blocks. It adds up.

## The Promo Math

Anthropic is running a [promotion through March 28](https://support.claude.com/en/articles/14063676-claude-march-2026-usage-promotion) that doubles your usage capacity during off-peak hours. Peak is 7 AM to 1 PM CT on weekdays. Everything outside that window (including all weekend) gets 2x capacity.

Today: my block started at 6 AM during the 2x window. At 7 AM, back to 1x. Most of my heavy Opus usage (interactive work plus subagents) happened after 7 AM. One hour of double capacity wasn't enough cushion for four hours of concentrated work.

## Three Things That Surprised Me

### 1. Cache reads dominate everything.

Over 95% of my total tokens are cache reads. That's Claude replaying conversation context on every turn. On a heavy day, that's 68M+ tokens just from context replay.

Before you panic at that number: cache reads are priced at roughly 1/10th the cost of regular input tokens. They dominate token volume but not proportional cost. The interesting insight is that your conversation length is the single biggest lever on usage. Long conversations with deep context windows burn through blocks faster than you'd expect, even with the discount.

### 2. The secondary machine still counts.

I was mostly on one machine at a time. VPS-primary earlier in the week, Mac-primary later. But the other machine was never fully idle. Light interactive use, automated jobs, background tasks. Mar 13: my VPS did the heavy lifting at $107 equivalent while the Mac added $61 of lighter work on top.

If you're running Claude Code on more than one machine, even casually, you're sharing one pool. The billing blocks don't care which machine the tokens came from.

### 3. The 7 AM boundary is a trap for morning workers.

Peak hours (1x rate) are 7 AM to 1 PM CT on weekdays. If your most productive hours are 7 AM to noon, you're running your heaviest work at 1x rate. The promo effectively rewards afternoon and evening workers.

Not complaining. It's a promo, not a contract. But worth knowing so you can plan accordingly.

## What I'm Doing About It

**Monitoring.** `bunx ccusage blocks --breakdown` is now part of my operational awareness. Can't manage what you can't measure.

**Model switching for interactive work.** Sonnet during peak hours (7 AM to 1 PM CT). Opus with high effort during the 2x promo window. Opus is roughly 5x the token cost of Sonnet. Running it during 2x hours means the effective cost is closer to 2.5x. That's a meaningful difference over a full workday.

**Automated jobs are already fine.** My cron jobs (retro at 3 AM, morning briefing at 5 AM, afternoon scan at 4 PM) already run inside the 2x window. The interactive model choice during peak hours was the real lever.

**Conversation length discipline.** Cache reads scale with context. Shorter conversations mean less replay. More intentional about `/clear` and fresh sessions instead of letting conversations grow indefinitely.

## The Takeaway

If you're on Claude Max, your billing blocks are shared across everything hitting your account. Two machines, automated jobs, background agents. Even if you're mostly on one machine, the other one's usage still counts against your blocks.

Run `bunx ccusage blocks --breakdown` and look at the numbers. You might be surprised what you find.

## Appendix: ccusage for usage reporting

`bunx ccusage blocks --breakdown` gives you visibility into your billing blocks. Token counts by model, by time window, by environment. If you're on Claude Max and you've ever wondered "where did my usage go," this is the answer.

I ran it on both my Mac and inside the container, then combined the data. Five days of real usage (Mar 13-17).

---

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*
