---
title: "I Benchmarked 4 Models for Writing in My Voice. The Local One Was Fastest and Worst."
date: 2026-04-23
description: "Qwen3.6-35B-A3B running locally on my M4 hit 40 tokens/sec on long writing — faster than GPT-5.4, Kimi K2.6, and MiniMax M2.7. It also scored 20+ quality points lower than all three. The local-cloud speed story is solved. The quality story is not."
story: 1
tags: ["benchmarks", "local-llm", "mlx", "qwen", "ai-models", "apple-silicon"]
platforms: {}
draft: false
---

I ran the same writing task through four models last week. Three cloud, one local. The local model finished first by a wide margin and scored last by a wider one.

That's the short version. If you're deciding "should I run models locally for writing work," the answer right now is: yes for speed, no for quality, and the gap isn't small.

## The numbers

Task: draft a ~2800-word technical build-log in my voice, scored by a three-judge panel (Sonnet 4.6 + Gemini 3.1 Pro + GPT-5.4) on voice fidelity, content quality, structural cleanliness, and fabrication.

| Model | Where it runs | Speed (long-form tok/s) | Quality /100 |
|---|---|---:|---:|
| Qwen3.6-35B-A3B (4-bit MoE) | Local, M4 Pro 48GB | **40.05** | 48.47 |
| GPT-5.4 | OpenAI (cloud) | 18.81 | **74.41** |
| Kimi K2.6 | Moonshot (cloud) | 18.00 | 69.30 |
| MiniMax M2.7 | MiniMax (cloud) | 16.69 | 69.60 |

Qwen local is more than twice as fast as anything in the cloud. And it loses by 20+ composite points to the slowest cloud model in the set.

That's not a rounding error. That's a category gap.

## Why the local model was so fast

Qwen3.6-35B-A3B is a mixture-of-experts (MoE) model. 35 billion parameters total, but only about 3 billion active per token. 4-bit quantization shrinks it to a ~18 GB memory footprint. On Apple Silicon with unified memory and MLX, that combination is genuinely fast.

How fast? I also tested the dense Qwen3.6-27B (6-bit, same family, comparable parameter class) on the same machine. Long-form throughput: **2 tokens per second**. Not 20. Two.

Same hardware. Same model family. Same day. A 20× speed gap.

The MoE architecture with 4-bit quant is the entire story for local speed right now. If you see a dense local model quoted at 10 tok/s, remember that a well-chosen MoE model on the same hardware can do 40+ without breaking a sweat.

## Why the local model was so bad at writing

The quality gap is the interesting part, because it's not what you'd expect from the speed number. If Qwen is cranking through tokens that fast, why is the output worse?

A few things compound:

**4-bit quantization costs real capability.** Four bits per weight is about a quarter of the information a 16-bit weight carries. The coarse-grained representation loses the fine distinctions that separate a voice from a clone of a voice — specific word choices, sentence-rhythm patterns, where to hold and where to release tension.

**MoE routing is noisier than dense inference.** Only 3B parameters fire per token. That's fast, but the model has to pick the right experts every time, and practitioner-voice tasks don't have a clean expert lane.

**The judges scored fabrication hard.** Voice tasks that hallucinate a fact lose points fast. Qwen was the most fabrication-prone of the four on this test.

None of that makes Qwen a bad model. It makes it a bad *writer for this specific task*. The gap might close on tasks where voice fidelity matters less — summarization, classification, code generation, agent loops that don't care how the prose sounds. I haven't benchmarked those yet. Speed stays impressive regardless.

## What this means for actual work

I'm still a cloud-model writer for now. Not because I want to be — local is faster, private, marginal-cost-zero, and doesn't go down when a provider has an outage — but because the output is 20 points worse and I can tell.

But "for now" is doing work in that sentence. Here's where I think the line is:

- **Anything production-facing that goes out under my name: cloud.** The quality gap is too visible.
- **Drafting, brainstorming, internal notes, code generation, agent scaffolding: local.** 40 tok/s changes how fast you can iterate. Even 60-70% quality is often enough when you're the one editing.
- **Anything privacy-sensitive: local, always.** No quality tradeoff beats "this never left my machine."

The second category is bigger than people realize. Most of my working day isn't producing polished prose. It's iterating. Faster iteration matters more than marginal quality for anything I'll edit myself.

## What I think is underweighted in the conversation

Speed is solved locally. The progress curve on Apple Silicon + MoE + aggressive quantization has been steep enough that "local is slow" is a 2024 sentence. In early 2026, a stock M4 Pro runs a credible frontier-tier local model at 40 tok/s with no fans spinning.

Quality is not solved locally. The cloud-vs-local delta on voice-faithful writing tasks is the largest gap I've measured this year. It's not trending to zero fast. Multiple factors — post-training data, reinforcement from scale, judge access during training — seem to structurally favor cloud for now.

If you're a builder, run the numbers for your own task. Cheap to set up. A single matrix run across 4 models takes ~20 minutes. You'll know within a day whether your specific workload is in "ship local" territory or not.

For mine, the answer was mostly no. But "mostly" is a lot better than it was six months ago.

## Methodology + caveats

- One task family (practitioner-voice technical writing), ~2800 words, judged by a fixed 3-judge panel. Results don't generalize to other tasks without re-testing.
- n=1 per model per run. Treat these as directional, not precise.
- Judge panel uses power-mean aggregation across voice fidelity, content quality, structural audit (stop-slop), and fabrication.
- Local inference is free at the margin but the "$0.2127" cost figure for Qwen in my records is judge-panel API spend, not hardware/energy.
- The 4-bit MoE variant is a specific model choice. Dense and higher-bit variants of Qwen on the same hardware performed much worse.
- Cloud pricing reflects OpenRouter passthrough rates. OAuth-bundled access (Codex, Claude Pro) changes the cost math significantly.

Full run artifacts, judge rubrics, and per-draft transcripts live in my benchmark repo. This was run 2026-04-23. I'll rerun when the next-gen local models land.

## What I'm watching

Two variables in the next six months:

1. **Whether MoE + quantization keeps compounding.** Another 2× speed jump gets local into "no reason to go to cloud for most tasks" territory even with today's quality gap.
2. **Whether distillation from frontier cloud models closes the voice gap.** This is where the leaderboard could flip fastest. A Qwen trained specifically on frontier-quality writing traces could eat into the 20-point delta in a release or two.

Either one changes the calculus. Both together and I'm not writing this article in cloud next year.

Until then: cloud for the writing you care about, local for everything else. And if you're running a dense model locally when you could run a MoE, fix that today. 20× is too much to leave on the table.

*Full benchmark source: [github.com/jonathanmalkin/practitioner-voice-benchmarks](https://github.com/jonathanmalkin/practitioner-voice-benchmarks)*
