---
title: "Kimi K2.6 and MiniMax M2.7 Quietly Caught GPT-5.4"
date: 2026-04-23
description: "Two open-weight cloud models shipped generation upgrades this month. Both are now within 5 quality points of GPT-5.4 on writing tasks, half the cost, and faster on tool-use workloads. The frontier is getting crowded."
story: 1
tags: ["benchmarks", "ai-models", "kimi", "minimax", "gpt-5", "openrouter"]
platforms: {}
draft: false
---

Two things happened this month that should have been bigger news.

Moonshot shipped Kimi K2.6. MiniMax shipped M2.7. Both are generational upgrades, both open-weight, both available on OpenRouter for cents. I benchmarked all three against GPT-5.4 on the same writing task and the same agent workload. The gap I expected wasn't there.

Here's what the numbers actually look like.

## Writing quality (practitioner-voice, 3-judge panel)

Same task, same judges, same day. Score is composite /100 across voice fidelity, content quality, structural audit, and fabrication.

| Model | Quality /100 | Cost per run |
|---|---:|---:|
| GPT-5.4 | 74.41 | $0.44 |
| MiniMax M2.7 | 69.60 | **$0.22** |
| Kimi K2.6 | 69.30 | $0.39 |

Five points separates the winner from second. Two months ago that gap was closer to fifteen. For reference, the previous-generation Kimi K2.5 scored 68.57 and the previous MiniMax M2.5 didn't have a voice score worth reporting in the latest slate. Both are retired in my setup now.

M2.7 is half the price of GPT-5.4 for writing. K2.6 is 10% cheaper. If quality was all I cared about I'd still use GPT-5.4. But quality isn't all most people care about. Cost and speed compound.

## Agent workload (Hermes, multi-turn, with tool use)

This is where it gets interesting. Same three models, plus their retired predecessors, on a 13-turn multi-task agent benchmark. Total wall time end-to-end:

| Model | Agent total (13 turns) | vs GPT-5.4 |
|---|---:|---:|
| **Kimi K2.6** | 448.9s | 0.48× (2.1× faster) |
| MiniMax M2.7 | 466.7s | 0.50× (2.0× faster) |
| MiniMax M2.5 (retired) | 758.2s | 0.81× |
| GPT-5.4 | 932.9s | baseline |
| Kimi K2.5 (retired) | 1198.1s | 1.28× |

Kimi K2.6 is the fastest cloud model I've tested on agent workloads. MiniMax M2.7 is within 4%. **GPT-5.4 never won an agent task** — Kimi K2.6 won messy-planning and debug-analysis, MiniMax M2.7 won repo-inspection, and MiniMax M2.5 (retired) won continuity-and-change. GPT-5.4 was the reliable mid-pack floor: never blocked, never dramatic, never first.

## The weirdest finding: GPT-5.4's agent penalty

Same models, single-turn tasks (basic Hermes benchmark, just 3 prompts):

| Model | Basic total | Agent total | Agent/Basic ratio |
|---|---:|---:|---:|
| Kimi K2.6 | 50.7s | 443.7s | 8.75× |
| MiniMax M2.7 | 42.0s | 459.4s | 10.94× |
| Qwen3.6-35B-A3B (local) | 39.8s | 712.8s | 17.91× |
| MiniMax M2.5 | 53.3s | 754.2s | 14.15× |
| **GPT-5.4** | 38.6s | **927.6s** | **24.03×** |
| Kimi K2.5 | 107.1s | 1177.4s | 10.99× |

GPT-5.4 ties for fastest on single-turn basic prompts. On multi-turn agent workloads it's 24× slower than its own single-turn throughput — the largest penalty of any non-failing model in the suite.

I don't have a clean root cause yet. Three candidates:

1. **Reasoning token expansion.** GPT-5.4 likely spends more tokens on internal reasoning per turn than the other models, and that compounds across 13 turns.
2. **Codex OAuth latency.** I access GPT-5.4 through Codex OAuth, which may add overhead per-call that the direct OpenRouter calls don't incur.
3. **Tool-call round-trip inefficiency.** Something about how GPT-5.4 sequences tool calls in multi-turn may be less efficient than how the others do it.

Whichever it is, the practical effect is the same. If you're building an agent, GPT-5.4 costs you wall time — about 2× what Kimi K2.6 costs, for similar quality.

## So what should you actually use

This is the decision tree I'm landing on after the benchmark:

- **Writing you care about, budget doesn't matter:** GPT-5.4. Still the quality leader.
- **Writing you care about, cost matters:** MiniMax M2.7. 94% of GPT-5.4 quality at 50% the cost.
- **Writing you don't care about, or bulk generation:** Either Kimi K2.6 or M2.7. Both cheap, both fast.
- **Agent workloads, tool use, multi-turn tasks:** Kimi K2.6. Fastest, cheapest per task, wins most tasks.
- **Low-latency quick replies (short prompts):** MiniMax M2.7. 3.8s for a short-brief prompt is the fastest cell in the entire suite.

I've retired Kimi K2.5 and MiniMax M2.5 from my routing. They're strictly dominated by their successors. If you're still on them, upgrade this week.

## Why this matters more than it reads

The gap between "frontier closed model" and "open-weight alternative" has been the defining AI market structure for two years. Closed models led quality. Open models led cost and freedom. You picked a side and accepted the tradeoff.

This is the first benchmark I've run where the tradeoff isn't clean anymore.

K2.6 and M2.7 aren't matching GPT-5.4 everywhere, but they're inside 5-7% quality on writing, beating it on agent speed, beating it on cost, and in some narrow cases (short prompts for M2.7, multi-turn for K2.6) beating it outright. That's not "the open models are catching up soon." That's the wall already having a door in it.

If the next generation of both families maintains this pace — 2.7× speed jump and a few quality points per release — then by the end of Q3 the question stops being "which closed model" and starts being "why are we still paying closed-model prices?"

I'll rerun this when the next ones land. For now, my production writing uses GPT-5.4, my agent routing defaults to Kimi K2.6, and my quick-reply paths use MiniMax M2.7. A year ago I used GPT-5 for all of it without thinking.

## Methodology + caveats

- Writing quality = 3-judge panel (Sonnet 4.6 + Gemini 3.1 Pro + GPT-5.4) scoring voice fidelity, content quality, structural audit (stop-slop), and fabrication. Power-mean aggregation.
- Agent benchmark = Hermes harness, 4 tasks × 13 turns, wall time end-to-end.
- Single task family per benchmark. Results don't generalize to fiction, code generation, or reasoning-heavy tasks without re-testing.
- n=1 per model per run. Directional, not precise.
- Costs are OpenRouter passthrough rates. GPT-5.4 via Codex OAuth has different effective economics.

Full run artifacts and per-task transcripts live in my benchmark repo. Run date: 2026-04-23.

*Full benchmark source: [github.com/jonathanmalkin/practitioner-voice-benchmarks](https://github.com/jonathanmalkin/practitioner-voice-benchmarks)*
