---
title: "Sonnet Lost to GPT-5.4 by 12 Points. Then I Switched Registers and Sonnet Won by 5."
date: 2026-04-23
description: "Same seven models. Same three-judge panel. Same day. Change the writing register from technical build-log to reflective essay and the leaderboard inverts. 'Best model' is the wrong unit."
story: 2
tags: ["benchmarks", "ai-models", "claude", "gpt-5", "writing", "voice"]
platforms: {}
draft: false
---

I ran the same seven models through two different writing tasks. The top of the leaderboard flipped.

Not slightly. Not "close calls moved a position." The model that won task one finished fourth on task two. The model that won task two finished fourth on task one. Twelve points separated first place across the two runs.

"Which model is best at writing" is the wrong question. "Best at writing what" is the question.

## The two tasks

Both baselines are my own writing, both ~2000-3000 words, scored by the same three-judge panel (Sonnet 4.6 + Gemini 3.1 Pro + GPT-5.4) on voice fidelity, content quality, structural audit, and fabrication.

**Task 1 — Hormozi-brain-agent** (structural / build-log register)
A step-by-step technical walkthrough of how I built a creator-voice AI agent. Lots of numbered phases, concrete commands, specific file counts, specific gotchas. Short sentences. Declarative. The kind of writing that tells you what happened in what order.

**Task 2 — Slot-machine-brain** (reflective / personal essay register)
A personal essay about ADHD-shaped flow states and the kind of brain that can't put AI down. Narrative arc. Vulnerability. Long sentences earn their place. The kind of writing where the structure has to carry emotional weight without getting in the way.

Same author. Same voice calibration. Same rubric. Different register.

## The leaderboard inverted

| Rank | Structural / Hormozi | Quality | Reflective / Slot-machine | Quality |
|---|---|---:|---|---:|
| 1 | **GPT-5.4** | 76.12 | **Sonnet 4.6** | 76.34 |
| 2 | GLM-5.1 | 70.54 | GLM-5.1 | 71.92 |
| 3 | Kimi K2.5 | 68.57 | GPT-5.4 | 71.58 |
| 4 | **Sonnet 4.6** | 64.52 | Opus 4.6 | 70.80 |
| 5 | Opus 4.6 | 64.00 | Kimi K2.5 | 69.92 |
| 6 | Gemini 3.1 Pro | 55.80 | Gemini 3.1 Pro | 58.44 |
| 7 | Qwen3-235B-Thinking | 53.17 | Qwen3-235B-Thinking | 58.43 |

Read the bold rows. Sonnet 4.6 was 4th on structural writing at 64.52. Switch to reflective and it's first at 76.34. GPT-5.4 was first at 76.12. Switch to reflective and it's third at 71.58. Opus moved from 5th to 4th, up 6.8 points.

This is the same model behind both rows. Nothing about "how good Sonnet is at writing" changed between the two runs. The task changed.

## The bottom of the board is also worth looking at

The two lowest-ranked models are **Gemini 3.1 Pro** and **Qwen3-235B-Thinking**.

Gemini 3.1 Pro is currently ranked #1 on LMArena Creative.

Qwen3-235B-Thinking is currently ranked #1 on WritingBench.

Both of them finished 6th and 7th on both of my tasks. Not close to the top. Not close.

The public creative-writing benchmarks are measuring something. It just isn't "how well does this model write in my voice on the tasks I actually do." Whatever gets a model to the top of LMArena Creative — broad appeal across diverse prompts, preference from crowdsourced judges who've never read my other work — doesn't transfer to the narrower task of sounding like one specific person writing one specific kind of piece.

That's not a shot at public benchmarks. It's a caution about generalizing from them.

## Why the flip happens

I have a working theory, not a proof.

Structural writing rewards what Sonnet and Opus famously don't do well: terse, declarative, "just say what happened" prose. GPT-5.4 defaults to exactly that mode. Kimi K2.5 writes short paragraphs by default. Sonnet defaults to elaboration, which hurts when the rubric is scoring stop-slop (which penalizes hedging, throat-clearing, false agency, dramatic fragmentation) on a build-log.

Reflective writing rewards what Sonnet and Opus are genuinely great at: holding a voice through emotional material, sustaining metaphor without breaking it, letting sentences breathe when they need to. GPT-5.4 in this register comes off slightly flat. It doesn't fail. It just sounds like a competent writer, not like me.

Two registers. Two different skill sets. Two different models at the top.

There's a simpler way to say it: GPT-5.4 wins when the rubric is "don't overwrite this." Sonnet wins when the rubric is "carry this weight without breaking it."

## What this means for actual work

I was using one model for everything. That was wrong.

Now my writing routing looks like this:

- **Structural / technical / build-log / documentation:** GPT-5.4 drafts it.
- **Reflective / personal / essay / emotional weight:** Sonnet 4.6 drafts it.
- **Whichever way it goes, the judge panel stays mixed.** Three voices catch different things.

This isn't a hack. It's matching the model's strengths to the task. And it's a big enough swing that if you're using one model for every kind of writing, you're leaving meaningful quality on the table in whichever half of your work doesn't fit that model's default mode.

Especially if that one model is GPT-5.4 and half your work is reflective. Or if that one model is Sonnet and half your work is structural. Either direction, you're paying for a 10-12 point quality gap you don't need to.

## The failure modes to watch for

This isn't a two-model story. It's a "test the actual task" story. Two cautions:

**Register within register matters too.** I benchmarked structural and reflective. There's a whole spectrum between them. A product launch post that's 80% structural with a reflective coda might still land better on Sonnet, or vice versa. I haven't mapped the middle.

**The anchor drifts.** GPT-5.4 scored 76.12 on hormozi in April 2026-04-09 and 74.41 on a re-run 2026-04-23. Same task. Same rubric. Different day, slightly different judge panel seed. Treat any single-digit quality difference as noise unless you re-run.

Both mean: use my numbers as a starting hypothesis, not a finished answer. Run your own slate on your actual writing. A full matrix takes about 20 minutes and ~$2-5 in API calls.

## Why this article matters more than the last one

I published a benchmark a few weeks ago saying "here are the best models for practitioner voice." A friend asked the obvious next question I hadn't answered: "best for writing *what*?"

This article is the answer. And the answer is that "best model for writing" is a category error. It's like "best tool for making food." The knife is best for some of it. The pan is best for the rest. Sharpening your knife doesn't make it a better pan.

The frontier model labs compete on generalized writing quality for a reason — broad leaderboards reward breadth, and breadth is what most users want. But practitioner-voice fidelity isn't a breadth problem. It's a register-match problem. And register-match is load-bearing for anyone producing content that has to sound like a specific person.

If you're one of those people, stop picking a single model and start picking per task. The numbers say it matters.

## Methodology + caveats

- Both runs use the same v2 three-judge panel with power-mean aggregation.
- Scores span voice fidelity, content quality, structural audit (stop-slop), and fabrication.
- Baselines are my own previously-published writing, not synthetic test prompts.
- n=1 per model per run. Directional, not precise.
- Register classification (structural vs reflective) is mine, not a formal literary category. Other classifications would produce different swings.
- Run dates: 2026-04-09 for the 7-model slate across both registers. The 2026-04-23 run was 4-model, hormozi only, and anchor drift is documented per-model.

Full run artifacts, judge rubrics, and per-draft transcripts live in my benchmark repo.

## What I'm watching

- **Does the flip hold on the next generation?** K2.6, M2.7, Qwen 3.6, and the next Claude and GPT releases haven't all been run through slot-machine yet. If Sonnet stays dominant on reflective across versions, the register-strength finding is structural, not coincidental.
- **Is there a register where an open-weight model wins?** Nothing in this slate clears GPT-5.4 or Sonnet at their best registers. Would love to find one. Watching what Moonshot and MiniMax do next.
- **How far can you push "match model to register"?** The obvious extension is a routing layer that classifies each incoming writing task by register and picks accordingly. I'm not there yet. If you want to build it, I'd love to see the numbers.

Best model isn't a question with one answer. Stop looking for one.

*Full benchmark source: [github.com/jonathanmalkin/practitioner-voice-benchmarks](https://github.com/jonathanmalkin/practitioner-voice-benchmarks)*
