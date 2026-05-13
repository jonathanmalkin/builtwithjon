---
title: "AI Reviewing AI Writing Makes It Worse. I Ran the Experiment Twice."
date: 2026-04-23
description: "Autonomous revision loops regressed every technical draft I tested. The obvious suspect was self-review: each model critiquing its own work. So I swapped in Claude Sonnet 4.6 as a strong external reviewer and reran the matrix. Every model still regressed. The bug isn't the reviewer. It's the loop."
story: 1
tags: ["benchmarks", "ai-writing", "convergence", "claude", "gpt-5", "revision"]
platforms: {}
draft: false
---

Here's a finding I didn't expect and didn't want.

Every time I put a frontier AI model through a draft-revise-evaluate loop on technical writing, the revision pass made the output worse. Not sometimes. Not marginally. Every model. Every time. On the register I write in most often.

I thought I knew why. The reviewer in the loop was the same model as the writer, so each model was critiquing its own work. That's a known LLM weakness. Fix it, and revision should help.

So I swapped in Claude Sonnet 4.6 as the external reviewer for every writer model and ran it again.

Every single model regressed. All four. Including the one that had *improved* under self-review.

The bug isn't the reviewer. It's the loop.

## What the original run showed

The setup: four frontier models (GPT-5.4, Kimi K2.6, MiniMax M2.7, Qwen3.6-35B-A3B-4bit) each draft a ~2800-word technical build-log in my voice, then revise their own draft based on a critique panel's findings, then get re-scored by a three-judge panel (Sonnet 4.6 + Gemini 3.1 Pro + GPT-5.4).

Quality composite is /100 across voice fidelity, content quality, structural audit, and fabrication.

**Self-review run (each model reviewed its own draft):**

| Model | Pass 0 Quality | Pass 1 Quality | Δ |
|---|---:|---:|---:|
| MiniMax M2.7 | 59.95 | 69.60 | **+9.65** |
| GPT-5.4 | 87.00 | 74.41 | -12.59 |
| Kimi K2.6 | 77.72 | 69.30 | -8.42 |
| Qwen3.6-35B-A3B | 56.41 | 48.47 | -7.94 |

Three of four regressed. The higher the pass-0 score, the bigger the drop. MiniMax was the only one that gained, starting from the lowest pass-0 score in the set.

Pattern: **revision had room to hurt exactly where there was something to hurt.** If pass 0 was already good, revision made it worse. If pass 0 was mediocre, revision had somewhere to go.

That's anti-convergent. A healthy revision loop should be monotonically non-worse. Critique, address, improve, or at least hold ground.

Mine wasn't doing that.

## The obvious suspect

My first theory: self-review is the problem.

Each model was generating critiques of its own writing, then revising based on those critiques. LLMs are notoriously bad at this. They miss the same things they just generated because they don't have a separate evaluative stance. The writer-brain and the critic-brain are the same brain.

If I gave every writer a strong external critic, specifically Claude Sonnet 4.6 (which is good at structural-audit critique), the reviser should get better findings and produce a better revision.

So I patched the harness to let me override the reviewer model, pointed it at Sonnet, and reran the same four writers on the same task.

## What happened

It didn't fix revision. It broke it in a new way.

**Sonnet-reviewer rerun (composite /100, pass 0 → pass 1):**

| Model | Pass 0 Quality | Pass 1 Quality | Δ |
|---|---:|---:|---:|
| GPT-5.4 | 79.60 | 71.84 | -7.76 |
| Kimi K2.6 | 69.20 | 66.13 | -3.07 |
| MiniMax M2.7 | 70.10 | 56.93 | **-13.17** |
| Qwen3.6-35B-A3B | 44.27 | 24.12 | **-20.15** |

Every model regressed. Including MiniMax M2.7, which had been the single gainer under self-review. Qwen's pass-1 draft bloated from 2,007 words to 9,108 as it tried to address all 31 of Sonnet's findings, and the composite quality cratered by 20 points.

Comparing the two runs head-to-head:

| Model | Self-review Δ | Sonnet-review Δ | Who wins? |
|---|---:|---:|---|
| GPT-5.4 | -12.59 | -7.76 | Sonnet (regression -4.8 pts smaller) |
| Kimi K2.6 | -8.42 | -3.07 | Sonnet (regression -5.4 pts smaller) |
| MiniMax M2.7 | +9.65 | -13.17 | **Self** (only model that gained; Sonnet broke it) |
| Qwen3.6-35B-A3B | -7.94 | -20.15 | **Self** (Sonnet made regression 2.5× worse) |

The picture is more nuanced than "Sonnet broke everything." Sonnet helped the two strongest models regress less — both GPT-5.4 and Kimi K2.6 ended up closer to their pass-0 scores under Sonnet's critique than under self-critique. The reviser-model strong enough to triage Sonnet's findings partially benefited from them.

But the two mid- and low-capacity models got destroyed. MiniMax and Qwen couldn't handle the thoroughness of Sonnet's critique without introducing worse problems. MiniMax went from zero major fabrications in its pass-0 draft to three in pass 1 — introduced specifically by addressing the reviewer's findings. Qwen quadrupled its word count by trying to be "more specific everywhere" and turned into mush.

Same reviewer. Same task. Opposite effects depending on the writer's capability to discriminate between useful and useless critiques.

And even the two winners still regressed. The best outcome in the entire matrix, Kimi K2.6 under a strong external reviewer, is still a 3-point quality drop from doing one revision pass.

## Why this is happening

The pattern that fits both runs:

**Self-review too weak → reviser changes too little, sometimes wrong things, mild-to-medium regression.** Kimi under self-review generated zero critical and zero high-priority findings on its own draft. Qwen under self-review: same, zero/zero. The models were essentially approving their own drafts. But the reviser still made changes (that's what revisers do), and those arbitrary changes mostly didn't help.

**External strong review too demanding for weaker writers → reviser changes too much, introduces new problems, big regression.** Sonnet gave GPT-5.4 three critical and nine high-priority findings. Gave MiniMax five critical and eight high. Gave Qwen 31 findings total. The strong models (GPT-5.4, Kimi) were able to do some discrimination — regressing less under Sonnet than under self-review. The weaker models (MiniMax mid-tier, Qwen local) addressed most findings literally. Addressing a finding often means adding specificity that wasn't in the source material — which a judge panel scores as fabrication. Or adding qualifying paragraphs — which a structural audit scores as bloat. Or rewriting clean sentences as "clearer" sentences that happen to be longer and duller.

All four regress. The top-2 regress less with Sonnet than with self-review — external critique, at least, gives them something to push back against. The bottom-2 regress far more with Sonnet. No model gains from either setup.

Neither is the right setup.

## What this means

The missing signal isn't review quality. It's **judgment about which critiques to act on**.

When I revise with a model in the loop and things get better, it's because I'm reading the critiques and deciding "this one matters, ignore that one, the reviewer's wrong about this, the reviewer's right about that." The model doesn't have that filter. It treats every finding as a directive to execute.

Seventeen findings from a strong critic on a reasonable draft, executed literally, produces a worse draft. Not because the findings are wrong. Because some of them are wrong-for-this-piece, some are right but not worth the tradeoff, and some are right but the fix breaks something else. Humans discriminate between those cases constantly. Current loops don't.

This is a routing problem, not a review problem. What the revision step needs isn't a better critic. It needs a filter between the critic and the reviser that decides *which* critiques are worth executing.

That filter is the work.

## Where this lands in my workflow

Three practical changes starting today:

1. **No more fully autonomous revision loops for production writing.** Pass 0 from a strong model is my baseline. Revision only happens with me in the loop deciding which findings to address.
2. **Critique generation still happens autonomously.** Sonnet as external critic is valuable — I want those findings, I just don't want a reviser to execute all of them unthinkingly. The findings go to me.
3. **For bulk / draft / disposable content, I'm okay with pass 0.** Paying for a pass 1 that regresses is strictly worse than stopping at pass 0.

The implication for agent architectures is bigger. Any design pattern where "reviewer critiques, reviser addresses all findings" gets the loop running but produces worse output than stopping at the first draft. That's a lot of agent frameworks. Including, until recently, mine.

## What would actually fix this

I don't have a shipped answer. But I have a working hypothesis.

A healthy revision loop needs three roles, not two:

- **Drafter** — generates the draft (model A)
- **Critic** — generates findings (model B, external, strong)
- **Adjudicator** — decides which findings to act on (model C, or a human for now)

Current autonomous loops collapse Critic and Adjudicator into a single step, where every finding becomes a directive. That's the failure mode.

An adjudicator model with good judgment about which critiques are worth executing would, in theory, fix this. It's a different skill from writing or critiquing. It's closer to editing: knowing what to change, what to leave, and when the cost of "fixing" is worse than the original problem.

I haven't tested whether a dedicated adjudicator model beats the no-revision baseline. If I had to guess from the data so far: it probably can, at some quality cost relative to a human adjudicator, and it's almost certainly worth trying. If you're building this, I'd love to see the numbers.

Until then: one draft, then me.

## Methodology + caveats

- Two runs, same baseline (`hormozi-brain-agent`, structural/technical register, ~2800 words).
- Self-review run: 2026-04-23, 4 models, 1 revision pass, reviewer = writer.
- Sonnet-reviewer run: 2026-04-23 (immediately after), same 4 models, same task, reviewer = Claude Sonnet 4.6 for all writers.
- Judge panel held constant across both runs (Sonnet 4.6 + Gemini 3.1 Pro + GPT-5.4, power-mean aggregated).
- n=1 per model per run. Directional, not precise.
- One register (structural / technical). The same experiment on reflective writing produced mixed results in prior runs — some models improved under self-review on that register.
- Both runs scored on the same 4-axis rubric (stop-slop structural audit, voice fidelity, content quality, fabrication).

Full run artifacts, judge rubrics, and per-draft transcripts live in my benchmark repo. Run dates: 2026-04-23 (both).

*Full benchmark source: [github.com/jonathanmalkin/practitioner-voice-benchmarks](https://github.com/jonathanmalkin/practitioner-voice-benchmarks)*
