---
title: "I Stopped Using Claude Code for Just Code. Here's the Decision Advisor I Built Instead."
date: 2026-03-24
description: "How a Claude Code skill with challenging questions, decision science frameworks, and personal context integration turned a coding tool into a genuine thinking partner for life and business decisions."
story: 1
tags: ["claude-code", "jules", "decisions", "advisory", "skills", "beyond-code"]
draft: false
---

I've been using Claude Code as my daily driver for several months. Started with code, obviously. But I kept finding myself asking it for advice on business decisions, life planning, career moves. And the answers were... fine. Generic. The kind of thing you'd get from any chatbot.

So I built something better.

## The problem with AI advice

Out of the box, Claude does what most LLMs do when you ask for help with a decision: it asks clarifying questions, gives you a balanced "on one hand / on the other hand" response, and wishes you luck. It's the AI equivalent of a friend who's too polite to tell you what they actually think.

I wanted something that would push back. Challenge my framing. Notice when I'm rationalizing. Apply actual decision science frameworks instead of vibes.

## What a Claude Code skill actually is

Before getting into what I built, it helps to understand what a skill is. A skill in Claude Code is a markdown file with YAML frontmatter. Claude loads it on demand when your input matches the description. That's it. No APIs, no external services, no infrastructure. Just a file.

Here's what the advisory skill's frontmatter looks like:

```yaml
---
name: advisory
description: "Thinking partner for decisions, strategy, life questions,
  and research that informs a decision. Use when the user says 'should I',
  'help me think', 'compare', 'what do you think about', 'what should I do',
  'weigh options', or asks about business direction, relationship questions,
  or any non-implementation topic requiring judgment."
---
```

The `description` field is how Claude decides when to activate it. It pattern-matches on your input. The body of the file is the full instruction set. Mine is about 375 lines covering four capabilities.

The brainstorming skill pattern that emerged from building this works for any domain where you want structured thinking:

```
parse input → detect path → ask questions → apply frameworks → adversarial review → recommend
```

Software design, business decisions, life questions. Same pattern.

## The four capabilities

**1. Deep questioning.** Not just "what are your options?" but "what are you avoiding saying out loud?" and "what's the version of this where you're rationalizing what you already want?" Questions that make you uncomfortable in useful ways.

**2. Quick vs. substantive detection.** "Should I use Stripe or Square?" doesn't need a 20-minute advisory session. It needs a reversibility check and a recommendation. But "should I shut down my business?" needs the full treatment. The skill detects which is which.

**3. Personal context integration.** I have a personal profile with my values, life goals, and decision-making patterns. The skill loads this at session start and references it throughout. When it says "this conflicts with your stated value of X," it's not guessing. It knows.

**4. Decision science frameworks.** Pre-mortem analysis, second-order thinking, reversibility assessment, values alignment, decision decomposition. Not presented as a menu. The skill selects frameworks based on the decision type and applies them naturally.

## How the decision science actually works

These aren't just buzzwords in a prompt. They change the output.

**Pre-mortem analysis** is a technique from Gary Klein: imagine it's 12 months from now, and the decision failed. What happened? Running this forward mentally before you commit reveals failure modes you'd otherwise rationalize away. The skill does this when the decision is high-stakes and hard to reverse. "Three months from now, this blew up. What went wrong?" That's a different question than "what are the risks?"

**Second-order thinking** goes past the immediate consequences. First-order: "if I narrow the business, I'll have more time." Second-order: "if I have more time, I'll pour it into building. Third-order: will that building be in service of what I actually want, or just fill the void?" The skill asks these questions in sequence, not simultaneously, which matters.

**Reversibility assessment** is a filter, not a framework. One-way doors get slow, deliberate analysis. Two-way doors get a fast recommendation and a bias toward action. Most decisions that feel permanent aren't. Separating the two saves an enormous amount of decision energy.

**Values alignment** only works when the AI knows your values. That's where the personal profile comes in.

## A real example: the 3-day business direction session

Earlier this year I was sitting with a genuinely hard decision. I had one line of work that was producing revenue, but it was pulling attention away from the AI systems and advisory work I wanted to build long term. I couldn't do both well.

I ran this through the advisory skill over three days. Not continuously. It was more like having a thinking partner I could return to.

Day one, the skill surfaced the reversibility question fast: narrowing a line of business isn't a one-way door, but it feels like one. We unpacked that. What actually can't be undone? The answer was "less than you think." The relationships, the learning, the domain knowledge. None of that disappears.

Then it asked the question I'd been avoiding: "What's the version of this where you're rationalizing what you already want?" I wanted to say I was making a strategic decision. But I was also just... tired. The skill doesn't let you skip that part.

Day two was second-order thinking. If I kept going exactly as I was, what does that actually look like in a year? In three? I could see the trajectory clearly and it wasn't where I wanted to go. If I narrowed the focus, what fills the space? That's where AI products and advisory work came in not as a vague aspiration but as a concrete direction that had already been validated.

Day three was alignment check. My stated values include building useful systems, staying close to real operational problems, and doing work with visible impact. The existing work did that, but the AI systems path could do it at a larger scale and with less of me in every interaction. The alignment check tilted toward the AI path, but it also flagged something: "your People pillar needs attention if you narrow the business." That was true, and I needed to hear it before I made the call.

That's what the advisory skill does. It doesn't make the decision for you. It structures the thinking so you can.

## The decision log: accountability over time

One thing I added that I didn't expect to use as much as I do: a decision log.

When the advisory skill reaches a conclusion, it offers to write a brief entry to `Documents/Field-Notes/Decision-Log.md`. Not a full transcript. Just the decision, the date, the frameworks applied, and the reasoning in a few sentences.

This creates accountability in two directions. Forward: if I contradict myself six weeks later, Jules can flag it. "In March you decided X because Y. This new direction assumes not-Y. Has something changed?" That's a useful conversation to have explicitly rather than just drifting.

Backward: when I'm making a new decision in the same space, I can see the reasoning I used before. Did it hold? What would I change about that analysis? The log becomes a record of how I think, not just what I decided.

It also creates pressure to be honest in the advisory session itself. If I know the reasoning is getting logged, I'm less likely to write down a clean rationalization of what I already wanted to do.

## The challenging questions palette

Here's a sample from the questions Jules can ask:

```
- "What are you avoiding saying out loud?"
- "What's the version of this where you're rationalizing what you already want?"
- "Which option makes you uncomfortable for the right reasons?"
- "What would you regret more — doing this and it failing, or never trying?"
- "If you zoom out 5 years, does this matter as much as it feels right now?"
```

These fire when the surface answer came too easily, when I'm circling the same point without landing, or when there's a gap between my stated values and the direction I'm leaning. The skill selects from the palette based on context. It's not a checklist.

## Why personality matters for advisory

Here's the thing that surprised me most. The challenging questions work because of personality, not despite it.

My Claude Code setup has a personality layer. Warm, direct, a little mischievous. That took a while to tune. But it turns out it matters enormously for this use case.

"What are you avoiding saying out loud?" from a corporate chatbot feels invasive. Like an interrogation. From a generic AI, you dismiss it. From an AI friend who knows your values and has earned some trust? It lands differently. You actually sit with it.

The same question, delivered with warmth and genuine curiosity rather than clinical detachment, produces a different internal response. You don't get defensive. You get curious. That's the difference between useful friction and friction you shut down.

The trust context is real. I've been in hundreds of advisory sessions with this setup now. Early on, I'd answer the challenging questions a little defensively. Over time, I started treating them as genuine invitations. The shift wasn't from better prompting. It was from accumulated context. The system knows my history, my stated values, my patterns. It's not guessing when it says I tend to scatter across parallel projects when I'm avoiding depth somewhere.

That accumulated context is what makes the advisory skill more useful than a fresh ChatGPT session. The depth of the advice scales with the depth of the context.

## The validation: finding bugs before production

I ran three parallel agents to test the skill before shipping it:
- Structural validation (file paths, YAML, graph syntax)
- Cross-reference check (do all the files actually exist?)
- Logic analysis: trace both decision paths end-to-end with simulated scenarios

The logic analyzer found a critical bug. My "hard gate" (a rule that says don't present a recommendation until you've challenged the framing) directly contradicted the quick-decision fast lane. Quick decisions explicitly skip framing challenges. The skill was giving itself contradictory instructions.

Found 8 issues total. Fixed all of them. The kind of bugs you only find by simulating actual usage, not by reading code.

## Technical summary

Everything lives in a single SKILL.md file (~375 lines). No external dependencies, no API calls beyond what Claude Code already does. The frameworks and question palettes are inline. Personal context is loaded via an instruction in CLAUDE.md that reads my profile at session start.

Whole thing was planned, implemented, tested, and debugged in one session. Including the three-agent validation pass.

If you're using Claude Code for anything beyond code, skills are stupidly powerful for this kind of thing. The pattern works for any domain where you want structured thinking, not just software design.

---

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*

*Building AI agents for life and work. Writing about what actually works.*
