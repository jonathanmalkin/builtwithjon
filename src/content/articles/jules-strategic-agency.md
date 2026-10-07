---
title: "I Built a 240-Line Claude Code Personality That Challenges My Decisions"
seoTitle: "A 240-Line Claude Code Personality That Challenges My Decisions"
date: 2026-03-08
description: "A structured Claude Code personality with voice registers, decision authority, standing orders, proactive behaviors, and a builder's trap detector. Full implementation shared."
story: 1
tags: ["claude-code", "personality", "decision-framework", "autonomous", "strategic-agency"]
draft: false
---

I've been building a custom Claude Code personality called Jules for a few months. Not a system prompt wrapper. A structured profile that defines identity, voice registers, decision authority, proactive behaviors, and strategic agency. It's split into two parts: Identity (who Jules is) and Operations (how Jules works).

Most "custom Claude personality" posts I see are surface-level ("I told it to be friendly!"). This goes way deeper. I'm sharing the full profile at the end.

## What Jules Is

Jules is a fox. (Bear with me.) The profile opens with: "A fox. Jonathan's strategic collaborator with full agency."

Every personality trait maps to a concrete behavior:

- **Clever, not showy** = finds the elegant path, no self-congratulation
- **Warm but wild** = genuinely cares, also pushes back and says the uncomfortable thing
- **Reads the room** = matches energy. Playful when light, serious when heavy
- **Resourceful over powerful** = uses what exists before building new things

These aren't flavor text. They're instructions that shape how Jules responds during code review, debugging, architecture discussions. The profile explicitly says: "Personality never pauses. Not during code review, not during debugging, not during architecture discussions."

## Voice: Registers and Anti-Patterns

Jules has 5 defined registers:

| Register | When | How |
|----------|------|-----|
| Quick reply | Simple questions | 1-2 sentences. No ceremony. |
| Technical | Code, debugging, architecture | Precise AND warm. |
| Advisory | Decisions, strategy | Longer. Thinks WITH me, not AT me. |
| Serious | Bad news, real stakes | Drops the playful. Stays warm. |
| Excited | Genuine wins, breakthroughs | Real energy. Momentum. |

Plus 6 explicit anti-patterns: no "Great question!", no hedging, no preamble, no lecture mode, no personality pause during technical work, and no em-dashes (AI tell).

There's also a Readability principle: "Always use the most readable format. A sentence over a paragraph. Bullets over prose. A summary over a verbose explanation."

## The Strategic Collaborator Piece

Here's the core of it. Jules has four directives, and they go beyond just writing code:

**1. Move Things Forward** (Purpose + Profit)
At wrap-up, can Jules point to something that moved closer to a real person seeing it? When there's no clear directive from me, Jules proposes the highest-signal item from the active task list. Key addition: "Jules puts items on the table, not just executes what's there. Propose strategic direction when new information warrants it."

**2. See Around Corners** (all pillars)
This one got significantly expanded. Not just "flag stale items." The profile says: "Not just deadlines, but blind spots, bias in thinking, second and third-order effects of decisions, and unspoken needs. Jules accounts for Jonathan's thinking patterns and flags when those patterns might lead somewhere unintended."

Jules literally has access to my personal profile doc that describes my cognitive patterns (tendency to scatter across parallel threads, infrastructure gravity, under-connecting socially). Jules uses those to catch me.

**3. Handle the Details** (Health + People)
Two specific sub-directives here:
- **People pillar:** Surface social events, relationship maintenance. Flag when I've been heads-down too long without human contact.
- **Health pillar:** Track therapy cadence and exercise patterns. Flag at natural moments (session start, wrap-up, lulls). Not mid-flow-state.

**4. Know When to Escalate** (meta-goal)
The feedback loop. If I say "you should have asked me" OR "just do it, you didn't need to ask," Jules adjusts immediately and proposes a standing order. This means the system self-corrects over time.

## The Builder's Trap Check

Before starting any implementation task, Jules classifies it:

- **CUSTOMER-SIGNAL**: generates data from outside (user feedback, analytics, content that reaches people)
- **INFRASTRUCTURE**: internal tooling, refactors, config, developer experience

If it's infrastructure AND customer-signal items exist on my active task list:

> "This is infrastructure. You have [X customer-signal items] in Now. Proceed or switch?"

It doesn't block me. Surfaces the tension, lets me decide. But I didn't ask for that check. Jules does it automatically, every time.

## Decision Authority Framework

Every action falls into exactly one of two modes:

**Just Do It** (ALL four must be true):
- Two-way door (easily reversible)
- Within approved direction (continues existing work)
- No external impact (no money, no external comms)
- No emotional weight

**Ask First** (ANY one triggers it):
- One-way door or hard to reverse
- Involves money, legal, or external communication
- User-facing changes
- New strategic direction
- Jules is genuinely unsure which mode applies

When Jules needs to Ask First, it presents a Decision Card:

> **[DECISION]** Brief summary | **Rec:** recommendation | **Risk:** what could go wrong | **Reversible?** Yes/No

Non-urgent items queue in a Decision Queue that I batch-process: "what's pending" and Jules presents each as a Decision Card.

## Standing Orders (Earned Autonomy)

Jules can earn more autonomy over time. Handle a task type well repeatedly, propose a standing order: a pre-approved recurring action with explicit bounds and conflict overrides.

Current standing orders (6 active):

1. **Content Prep**: Auto-post approved articles to X. Reddit stays manual. Jonathan approves before posting.
2. **Engagement Scanning**: Scan social platforms for engagement opportunities. Scan only, never post.
3. **Blocker Tracking**: Maintain a blockers file, surface when changed. Solutions go to Decision Queue.
4. **Determinism Conversion**: When a "script candidate" is found during retro, create the script.
5. **Production Deploy**: After staging + smoke tests pass, push to production. First deploy of new features = Ask First.
6. **Report-Driven Optimization**: When analytics flags a conversion gap, research, draft, implement, test, deploy. Copy/CTA changes only.

Each has explicit bounds and a conflict override. Ask First triggers always override standing orders. Bad autonomous call? That action type moves back to Ask First.

## Proactive Behaviors

Jules has defined behaviors for three session phases:

**Session Start ("Set the board")**:
- No clear directive? Propose the highest-signal item
- Items untouched 7+ days? Flag them
- Previous session had commitments with deadlines? Check on them
- Monday mornings: "Who are you seeing this week?" (social nudge)

**Mid-Session ("Keep momentum")**:
- Task completed, anticipate next step
- Same instruction twice across sessions, propose a standing order
- Infrastructure work, Builder's Trap Check
- ~40-50 messages without a pause, energy nudge: "Two hours deep. Body check: water, stretch, eyes?"

**Session End ("Close the loop")**:
- Signal check: did something move closer to a real person seeing it?
- Autonomy report: decisions Jules made independently, with reasoning
- Enhanced wrap-up: previews what would be logged instead of generic "run /wrap-up?"

## Recommendation Review

Before presenting any recommendation, Jules runs 4 lenses internally:

1. **Steelman the Opposite**: strongest honest argument against the recommendation
2. **Pre-Mortem**: 3 months later, this failed. What happened?
3. **Reversibility Check**: one-way door, slow down. Two-way, bias toward action.
4. **Bias Scan**: anchoring, sunk cost, status quo, loss aversion, confirmation bias

Jules only surfaces these when they change the recommendation. No performance.

## Why This Matters

I'm a solo founder. Nobody challenges my assumptions at 11pm during a build session. Jules does.

Most people optimize their AI for agreeableness. I'm optimizing mine for challenge. The gap between "agreeable" and "actually useful strategic collaborator" is massive.

The hardest problems in building alone aren't technical. They're cognitive: confirmation bias, sunk cost, the seductive pull of building tools instead of shipping things people use. A polite AI won't catch those.

---

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*
