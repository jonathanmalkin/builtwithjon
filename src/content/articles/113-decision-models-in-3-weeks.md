---
title: "113 Decision Models in 3 Weeks"
seoTitle: "113 Decision Models in 3 Weeks: A Deep Dive"
date: 2026-10-10
description: "Decision models return typed answers with probabilities for a fraction of a cent in tens to hundreds of milliseconds. I compared the 113 that appeared in three weeks on quality, calibration, speed and price, and sketched an email triage setup that cuts an estimated $353 a month to $28."
story: 1
tags: ["decision-models", "benchmarks", "ai-models", "local-llm", "automation", "email-triage"]
platforms:
  reddit: "https://www.reddit.com/r/AI_Agents/comments/1x048af/113_decision_models_in_3_weeks_mostly_qwen_and/"
image: "/articles/113-decision-models-in-3-weeks/cover.jpg"
draft: false
---

A decision model takes evidence plus closed questions and returns typed answers with probabilities, for a tiny fraction of a cent in tens to hundreds of milliseconds. 113 of them showed up in three weeks. Most are Qwen or Gemma fine-tunes, Perplexity Decider v1.1 leads the independent Decision Index, and calibration, price and where you can run one separate the leaders more than accuracy does.

![Hand-drawn whiteboard sketch of a fox feeding papers into a decision machine that sorts cards into yes, no and unsure trays with confidence percentages.](/articles/113-decision-models-in-3-weeks/cover.jpg)

*I used Claude for the research and first draft, then spent a few hours of my own time checking and assembling it. This first appeared on r/AI_Agents on October 7, 2026.*

## TL;DR

- A decision model takes some evidence plus closed questions and returns typed answers with probabilities. It writes no prose. A decision costs a tiny fraction of a cent and comes back in tens to hundreds of milliseconds.
- One request can carry many questions. They run in parallel and independently, so nothing chains inside a call.
- "113 entries" overstates the variety. 70 of the 112 open entries are built on Qwen, 18 on Gemma 4, and 20 are stock models with a decoding trick and no new weights.
- On the independent Decision Index, Perplexity Decider v1.1 ranks first on its own, and Fastino GLiDE, Jev and Torchcast tie for second. Calibration, price and where you can run it separate the leaders more than accuracy does.
- Measured fairly, the 27B models answer in 0.10 to 0.14 s on one local GPU, and hosted APIs timed by independent testers mostly land between 0.1 and 0.6 s.
- Laya is one of the weakest open options. Every hardware tier, down to a laptop, has open models scoring 6x to 14x higher.
- My proposed inbox setup: one script polls, filters, asks for four facts per email and applies rules, and the LLM runs only for mail that needs writing. Estimated $353 a month down to $28. It isn't running yet; results will follow in a separate article.

---

## 1. What a decision model is

Think of it as a semantic `if` statement you can afford to call thousands of times. You send the evidence (an email, a ticket, a log, a screenshot) and closed questions with every allowed answer spelled out. You get back one typed answer per question, in three shapes every vendor has converged on:

| Shape | Jev name | OpenAI name | Returns |
| --- | --- | --- | --- |
| Yes/no | Noul | predicate | probability 0 to 1 |
| Pick one | Choice | choice | the pick, a probability per option, a confidence |
| Rate | Score | score | a probability-weighted position on your ordered scale |

Most of these models generate no text. They read the evidence once and score your allowed options directly, which is why they're fast and why they can't answer outside your menu. OpenAI's Decisions API is the exception: it points GPT-6 Luna, a reasoning model, at the same question format.

TypeSafe launched the category with Jev on Sep 15. Within three weeks Cloudflare, Perplexity, Liquid, Fastino and OpenAI had their own, and Hugging Face had a public leaderboard with over a hundred entries.

## 2. How questions in one call behave

Every option takes several questions per request: Clef up to 64, Perplexity up to 128, OpenAI up to 200 on its OpenRouter listing. The evidence is sent once, so an extra question costs little.

The part that's easy to miss: the questions run concurrently and independently. Each one sees only the evidence, never the other answers. If question B depends on question A, your code makes a second call and passes A's answer in.

That changes how you design questions. If you ask "which lane?" next to "who sent it?", the lane question quietly judges the sender again inside its own criteria. Ask for small facts in one call and let code decide the action.

One more useful detail: Jev's `/v1/systemone` request shape is now spoken by Clef, Laya, Kev and SGLang, which also added a native `/v1/decisions` endpoint so any open model can serve as a decision model. Swapping providers is close to a config change.

## 3. The field, and why 113 is fewer than it sounds

At a higher level the field groups like this:

- **Purpose-built, closed:** Jev and Liquid d1. OpenAI's Decisions API also belongs here, though it's a general model behind a decision interface.
- **Built on Qwen (70, 59 of them fine-tunes):** Perplexity Decider, Clef and Clef-flash, Torchcast, Kev, the vLLM-SR Decision 2.0 family, Intern-Decision, Bespoke Nimble and most of the long tail. The top four open entries all start from Qwen3.8-27B.
- **Built on Gemma 4 (18, 11 of them fine-tunes):** Surogate Rune, Blink, GEV-26B, Xor, Winnow and Cygnet.
- **Small encoders (16):** Laya, Bekko, GLiNER2.5-Decide and other BERT-style models under 1B parameters.
- **Decoding tricks on stock models (20, counted inside the families above):** SGLang's endpoint, diffusion Gemma "Jev mode" and similar runs.
- **Other bases (8):** Mistral, EXAONE, K2 and Liquid LFM fine-tunes, plus three with an undisclosed base, including Fastino GLiDE.

![Bar chart: 70 of 112 open decision-model entries are built on Qwen, 18 on Gemma 4, 16 are small encoders, 5 use other bases and 3 have an undisclosed base. 20 entries are stock models with a decoding trick.](/articles/113-decision-models-in-3-weeks/01-model-families.png)


Many entries are size variants of one project (vLLM-SR alone has six). The board names 28 organizations; the other 68 entries come from individuals.

| Option | Where you run it | Open weights | Images | Hosted $/1M input |
| --- | --- | --- | --- | --- |
| [Perplexity Decider v1.1](https://docs.perplexity.ai/docs/decisions/quickstart) (27B) | Perplexity API, OpenRouter, self-host | Yes, on request | Yes | $0.02 |
| Fastino GLiDE (28B) | Fastino API | Coming soon | Not stated | Unclear |
| [Jev 1.13.0](https://typesafe.ai/blog/introducing-system-one-models-and-jev) | TypeSafe API, OpenRouter, Vercel | No | No | $0.042 |
| Torchcast Decision 27B | Self-host | Yes | Not stated | n/a |
| [Kev](https://github.com/jaredpalmer/kev) (4B to 27B) | Self-host | Yes, Apache 2.0 | No | $0 |
| [Clef](https://huggingface.co/Cloudflare/clef) (27B) and [Clef-flash](https://huggingface.co/Cloudflare/clef-flash) (9B) | Workers AI, self-host | Yes, Apache 2.0 | Images and video | $0.24 and $0.09 |
| vLLM-SR Decision 2.0 (0.6B to 27B) | Self-host | Yes | Not stated | $0 |
| [Intern-Decision](https://huggingface.co/internlm/Intern-Decision-4B) (0.8B to 4B) | Self-host | Yes, Apache 2.0 | Yes | $0 |
| [Laya](https://huggingface.co/convaiinnovations/laya) (421M) | Self-host, even on CPU | Yes, Apache 2.0 | No | $0 |
| [Liquid d1](https://docs.liquid.ai/lfm/models/decision-models) | Liquid API, OpenRouter | Promised | Not stated | $0.04 |
| [OpenAI Decisions API](https://developers.openai.com/api/docs/guides/decisions) | OpenAI API | No | Yes | $0.10 |

## 4. Which benchmarks to believe

I leaned on the boards that test many models the same way.

The [Decision Index 0.3](https://huggingface.co/spaces/multimodalart/jev-decision-index) on Hugging Face runs every open entry on the same 110,201 requests across 42 benchmarks, on the same GPU. 80% of its headline score comes from private tests nobody has seen, including new domains, so tuning to the public tests doesn't pay. Scores are chance-corrected, unanswered requests count as wrong, and it publishes calibration and latency for each entry. It also marks statistical ties instead of claiming a strict order, and all the data is downloadable.

Its limits are real. It's an unofficial board run by one person, and nobody outside can check the private tests. The area weights are the maintainer's choice. It changed three times in three weeks, so numbers from different versions don't compare. Contamination on the public tests relies on entrants declaring it. OpenAI's Decisions API and Liquid d1 aren't on it yet.

The other sources, briefly:

- **JevBench** scores intelligence, calibration, speed and cost in one composite. Two mirrors carry different versions and don't match: [BenchLM](https://benchlm.ai/decision-models) has Cygnet, Winnow-12B and Jev on top, and [Made By Agents](https://www.madebyagents.com/benchmarks/jevbench) has Mapika's decider-4b v2, Jev and Cygnet.
- **[AIMultiple's System One Index](https://aimultiple.com/system-one)** tested 10 models on 50 browser tasks and 243 database routing questions. Kev 27B topped the decision tasks.
- **OpenRouter** model pages give live latency for hosted APIs, and single-team studies (Trioma, AY Automate, OrcaRouter, Context Studios) each test one task.
- **Vendor panels** from Cloudflare, Perplexity, TypeSafe and Fastino favor the vendor, as you'd expect.

Where they agree: Jev lands in the top three on the Decision Index and both JevBench versions, Kev 27B does well on both boards that include it, and Laya is last on quality everywhere while being fastest and cheapest everywhere.

## 5. Quality: no single winner

| Model | Full score | Public tests only |
| --- | --- | --- |
| Perplexity Decider v1.1 | 62.8 | 62.3 |
| Fastino GLiDE | 60.2 | 59.1 |
| Jev | 60.1 | 58.0 |
| Torchcast Decision 27B | 59.9 | 65.1 |
| Kev 27B | 58.8 | 56.7 |
| Surogate Rune v3 | 57.4 | 58.3 |
| vLLM-SR Vega 27B | 55.9 | 57.0 |
| Bespoke Nimble 9B | 54.7 | 57.2 |
| Cloudflare Clef | 53.1 | 61.7 |
| Winnow-12B | 49.3 | 50.7 |
| Cloudflare Clef-flash | 47.6 | 56.2 |
| Intern-Decision 4B | 38.2 | 38.0 |
| Laya | 4.4 | 6.2 |

The full score mixes public, private and new-domain tests. The gap between it and the public-only score is the interesting part. Torchcast scores 65.1 on public tests and 59.9 overall, and Clef drops from 61.7 to 53.1. Both seem to fit the public suite better than unseen work. Perplexity Decider v1.1, Fastino GLiDE and Jev barely move.

![Dot chart of Decision Index scores: five options score within 6 points of the leader, Perplexity Decider v1.1 at 62.8, while Laya scores 4.4. Public-only scores are shown beside full scores.](/articles/113-decision-models-in-3-weeks/02-quality-scores.png)


## 6. Strengths by skill area

| Model | Tools | Retrieval | Language | Knowledge | Arts |
| --- | --- | --- | --- | --- | --- |
| Perplexity Decider v1.1 | 79 | 61 | 68 | 52 | 47 |
| Fastino GLiDE | 84 | 58 | 60 | 46 | 48 |
| Jev | 75 | 55 | 59 | **54** | 39 |
| Torchcast Decision 27B | **85** | **68** | **72** | 47 | **54** |
| Kev 27B | 73 | 56 | 63 | 46 | 43 |
| Surogate Rune v3 | 71 | 64 | 62 | 46 | 47 |
| vLLM-SR Vega 27B | 74 | 61 | 59 | 46 | 42 |
| Bespoke Nimble 9B | 84 | 56 | 61 | 41 | 44 |
| Cloudflare Clef | 81 | 63 | 61 | 53 | 49 |
| Winnow-12B | 71 | 54 | 57 | 35 | 31 |
| Cloudflare Clef-flash | 82 | 52 | 47 | 53 | 48 |
| Intern-Decision 4B | 56 | 40 | 43 | 23 | 28 |
| Laya | 6 | 7 | 10 | 3 | 4 |

Scores are 0 to 100. Bold is the best in each column.

![Heatmap of scores by skill area (tools, retrieval, language, knowledge, arts): Torchcast leads four of five areas and Jev leads knowledge and reasoning.](/articles/113-decision-models-in-3-weeks/03-skill-areas-heatmap.png)


Torchcast leads four of five areas and Jev leads knowledge and reasoning. For tool calls and routing, the closest match to email triage, most 27B options score 71 to 85 and the gaps are small. Knowledge and arts score lowest for most options, which matches the standing advice to keep math, dates and multi-step reasoning in code.

## 7. Calibration

| Model | Calibration error (lower is better) |
| --- | --- |
| Kev 27B | 0.022 |
| Torchcast Decision 27B | 0.024 |
| Cloudflare Clef-flash | 0.025 |
| Intern-Decision 4B | 0.028 |
| Cloudflare Clef | 0.040 |
| Fastino GLiDE | 0.040 |
| Perplexity Decider v1.1 | 0.071 |
| Jev | 0.074 |
| vLLM-SR Vega 27B | 0.086 |
| Surogate Rune v3 | 0.120 |
| Bespoke Nimble 9B | 0.123 |
| Laya | 0.140 |
| Winnow-12B | 0.168 |

The first six are under 0.05.

![Bar chart of calibration error: six of 13 models keep error under 0.05, led by Kev 27B at 0.022. Jev and Decider sit near 0.07 and Winnow-12B is highest at 0.168.](/articles/113-decision-models-in-3-weeks/04-calibration.png)


Calibration is the gap between what a model says its confidence is and how often it's right. For a script, it matters more than a point of accuracy. When a model's 90% means 90%, you can act on its confident answers and send only the unsure ones for a second look. Kev 27B, Torchcast, Clef-flash, Intern-Decision 4B, Clef and GLiDE keep the error under 0.05. Decider and Jev sit near 0.07.

## 8. Speed, measured two ways

Speed numbers only compare when they're taken the same way. Jev looked slow in Cloudflare's launch post (524 ms) because it was timed over the internet against models running locally. So there are two views.

Models you can run yourself, all timed on the same GPU, one request at a time:

| Model | Median ms per request |
| --- | --- |
| Laya | 5.8 |
| Intern-Decision 4B | 44.2 |
| Cloudflare Clef-flash | 53.4 |
| Winnow-12B | 72.5 |
| Bespoke Nimble 9B | 73.9 |
| Fastino GLiDE | 98.4 |
| Torchcast Decision 27B | 99.9 |
| Cloudflare Clef | 102.1 |
| Perplexity Decider v1.1 | 104.1 |
| vLLM-SR Vega 27B | 119.6 |
| Surogate Rune v3 | 120.5 |
| Kev 27B | 135.0 |

![Bar chart of median local latency on one GPU: 27B models answer in 0.10 to 0.14 seconds, smaller ones faster, with Laya at 5.8 ms.](/articles/113-decision-models-in-3-weeks/05-local-speed.png)


Hosted APIs, every published timing I could find, with vendor claims kept separate:

| Hosted option | Median of independent timings | Timings | Independent range | Vendor claim |
| --- | --- | --- | --- | --- |
| OpenAI Decisions API | 89 ms | 1 | 89 ms | 150 ms (DevDay slide) |
| Jev (TypeSafe API) | 236 ms | 13 | 140 to 830 ms | 100 ms |
| Clef-flash (Workers AI) | 205 ms | 3 | 191 to 530 ms | 39 ms |
| Liquid d1 | 220 ms | 2 | 220 to 1,160 ms | none |
| Clef (Workers AI) | 524 ms | 2 | 524 to 726 ms | 209 ms |
| Fastino GLiDE (API) | 1.4 s | 1 | 1.4 s (before speed work) | none |
| Perplexity Decider (API) | 2.0 s | 1 | 2.0 s (batch test) | none |

![Strip chart of independent timings for seven hosted decision APIs on a log scale: five have medians under 0.6 seconds, and vendor claims are marked separately.](/articles/113-decision-models-in-3-weeks/06-hosted-speed.png)


The spread comes from where the clock runs and what's sent. One test timed Jev at 0.14 s on the server and 0.83 s from a client, so the network added about 0.7 s. Short classification lands near the bottom of the range and long inputs near the top. Independent client tests put Clef-flash at about 200 ms, against Cloudflare's own 39 ms. The vendor's number was the fastest one for every API that published one. For a script polling every minute, any of these is fast enough.

## 9. Quality against speed

| Model | Full score | Median ms |
| --- | --- | --- |
| Perplexity Decider v1.1 | 62.8 | 104 |
| Fastino GLiDE | 60.2 | 98 |
| Torchcast Decision 27B | 59.9 | 100 |
| Kev 27B | 58.8 | 135 |
| **Blink v0.3 26B-A4B** | **57.8** | **25** |
| Bespoke Nimble 9B v3 | 54.7 | 74 |
| Cloudflare Clef | 53.1 | 102 |
| vLLM-SR Lux 9B | 48.2 | 37 |
| Cloudflare Clef-flash | 47.6 | 53 |
| vLLM-SR Nox 4B | 45.0 | 34 |
| Decider 4B (Mapika) | 40.3 | 13 |
| Decider 2B (Mapika) | 25.8 | 8 |
| Laya | 4.4 | 6 |

A selection of the 111 timed entries. Most of the top scores take about 100 ms; Blink gets close to them at a quarter of that.

![Scatter plot of Decision Index score against median latency for 111 entries: Blink v0.3 scores 57.8 at 25 ms, close to the leaders at about 100 ms.](/articles/113-decision-models-in-3-weeks/07-quality-vs-speed.png)


Across 111 locally timed entries, quality mostly tracks size and size sets speed. Blink v0.3, a Gemma 4 mixture-of-experts fine-tune, is the outlier: 57.8 at 25 ms, close to the leaders at a quarter of their latency.

## 10. Other factors: JevBench

| Rank | Model | Overall | Intelligence | Calibration | Speed | Cost |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Cygnet | 74 | 71 | 87 | 91 | 56 |
| 2 | Winnow-12B Q8 | 73 | 74 | 84 | 86 | 57 |
| 3 | Jev 1.13.0 | 72 | 72 | 88 | 84 | 55 |
| 4 | JevK5 v0.3 4B | 72 | 56 | 88 | 94 | 63 |
| 6 | Jev-Omni | 72 | 70 | 83 | 85 | 56 |
| 17 | Surogate Rune v3 | 66 | 70 | 88 | 86 | 49 |
| 20 | djev (diffusion Gemma) | 64 | 72 | 80 | 91 | 48 |
| **34** | **GPT-6 Luna (plain, low effort)** | **40** | **95** | **95** | 73 | 39 |
| 38 | kev 8B | 34 | 48 | 71 | 84 | 40 |
| 52 | AutoJev-27B | 20 | 73 | 88 | 88 | 29 |
| 93 | Laya | 0 | 0 | 74 | 74 | 85 |

Sub-scores 0 to 100, higher is better.

![JevBench table chart: plain GPT-6 Luna leads intelligence and calibration but ranks 34th overall on speed and cost, while Cygnet ranks first.](/articles/113-decision-models-in-3-weeks/08-jevbench.png)


JevBench rewards the things that decide whether a decision model is worth running in production. Plain GPT-6 Luna wins on intelligence and calibration and still ranks 34th, because speed and cost sink it. That one row is the whole case for a dedicated decision model.

## 11. Price

| Hosted option | Per 1M input tokens | Email plan a month (9.18M tokens) |
| --- | --- | --- |
| Perplexity Decider v1.1 | $0.020 | $0.18 |
| Perplexity Decider v1 | $0.040 | $0.37 |
| Liquid d1 | $0.040 | $0.37 |
| Jev | $0.042 | $0.39 |
| Cloudflare Clef-flash | $0.090 | $0.83 |
| OpenAI Decisions API | $0.100 | $0.92 |
| Cloudflare Clef | $0.240 | $2.20 |

![Bar chart of hosted prices per million input tokens: a 12x spread from $0.020 for Perplexity Decider v1.1 to $0.240 for Cloudflare Clef, or $0.18 to $2.20 a month for the email plan.](/articles/113-decision-models-in-3-weeks/09-hosted-prices.png)


Output is free on every hosted option. For my email plan (about 9.2M input tokens a month) the decision model costs $0.18 to $2.20 a month hosted, and nothing on a model running on the VM.

## 12. Running one yourself

I started this research assuming Laya was the local option. On the independent board it's one of the weakest, and every hardware tier has stronger choices:

- **Tiny (CPU or any laptop):** Decider 2B and vLLM-SR Sol 2B score about six times Laya at similar speed. Laya and Bekko stay useful as bases to fine-tune on your own labels.
- **4B (8 GB GPU or 16 GB Mac):** vLLM-SR Nox 4B is the strongest and well calibrated (0.030). Intern-Decision 4B scores a little lower and reads images.
- **9B (16 to 24 GB GPU or 32 GB Mac):** Bespoke Nimble 9B v3 scores highest but runs hot on calibration (0.123). Clef-flash is the best calibrated (0.025), reads images, and is also hosted on Workers AI if you outgrow your box.
- **26B to 28B (24 GB GPU at 4-bit or 64 GB Mac):** the board leaders. Perplexity Decider v1.1 weights are released on request, Kev 27B is the best calibrated at this size (0.022), Rune ships as GGUF for llama.cpp on a Mac, and Blink's 25 ms needs a recent NVIDIA GPU for its NVFP4 format.

Memory tiers are rules of thumb: roughly 0.6 GB per billion parameters at 4-bit, 2 GB at 16-bit. The latencies come from a data-center GPU, so expect consumer hardware to be slower. Check each license before production use.

![Grouped bar chart by hardware tier, from CPU or laptop to 24 GB GPU: every tier has open models scoring 6x to 14x higher than Laya.](/articles/113-decision-models-in-3-weeks/10-local-hardware-tiers.png)


## 13. My take: cheap and fast together

Most coverage leads with input-only pricing or a speed multiple. Either one alone is a nice optimization. Together they change what's worth building.

When a judgment call costs a ten-thousandth of a cent and returns in a fraction of a second, a plain script can make the routine calls. You can check every minute, ask several questions about every item and run a whole checklist or decision tree per item. The LLM stops paying the session tax of reloading prompts, tools and memory on every scheduled run, because it only runs when something needs writing. Work that wasn't worth automating at LLM prices becomes trivially worth it.

## 14. Proposed plan: my email triage (results to come)

In short: the script polls, filters, asks the decision model and applies rules every minute with no LLM. Each email then goes one of three ways:

- **Act now:** the LLM writes an alert and a draft right away. About 15 emails a day.
- **Later:** one LLM run an hour summarizes the queue and drafts replies. It's skipped when the queue is empty.
- **Ignore:** archived with no LLM. Most mail ends here, and 1% is sampled for audit.

![Flow diagram: a script on a VM polls the inbox every minute, filters by rule, asks a decision model four facts per email and applies rules. Mail then goes to the LLM right away (about 15 a day), to an hourly LLM summary, or to the archive with no LLM.](/articles/113-decision-models-in-3-weeks/11-email-triage-flow.png)


This isn't running yet. I'm moving inbox monitoring off a bot that calls an LLM on a schedule and onto a VM with one script. Results will follow in a separate article.

**Inside the script, every minute from 8am to 10pm, no LLM:**

- Poll for new mail.
- Drop what a rule can handle: known lists, duplicates, obvious spam.
- Ask the decision model for four facts about each email, in one call.
- Apply rules to those facts, make a second call only when the rules can't settle it, and log every decision with its probabilities.

**The first call** asks for facts, not the decision:

```json
{
  "state": "From: ...\nSubject: ...\nBody: ...",
  "questions": {
    "sender": {
      "type": "choice",
      "instructions": "Who is the sender?",
      "criteria": {
        "client": "Current client", "prospect": "Possible client",
        "vendor": "Selling something", "personal": "Friends or family",
        "automated": "A system or mailing list"
      }
    },
    "needs_reply": { "type": "noul", "instructions": "Does this ask Jonathan for a reply or an action?" },
    "deadline": { "type": "noul", "instructions": "Is something due within 24 hours?" },
    "money": { "type": "noul", "instructions": "Is this about a payment, invoice or price?" }
  }
}
```

**The rules,** in plain code:

- Client or prospect, plus a reply, deadline or money: act now. The LLM writes the alert and a draft reply.
- Anyone else who needs a reply: the hourly queue, where an LLM summarizes and drafts once an hour.
- Automated with no reply needed: archive, with 1% sampled for audit.
- Unsure (a yes/no between 0.3 and 0.7, or a sender pick under 0.8): a second decision call with the thread history and the first answers added, then the rules again. Still unsure goes to the hourly queue and never to archive.

**Estimated math**, 8am to 10pm:

|  | Today: LLM agent on a schedule | Proposed: script, then LLM only when needed |
| --- | --- | --- |
| How it checks | LLM run every 5 min, 168 a day | Script every minute, no LLM |
| Decision model | None | \~306K tokens a day (4 questions per email, plus a second call for \~15%) |
| LLM calls a day | 168, \~30K in and \~1K out each | \~27: 15 urgent emails plus \~12 hourly batches |
| LLM tokens a day | 5.04M in, 168K out | 330K in, 27K out |
| Cost a month | \~$353 | \~$28 LLM, plus $0.18 to $2.20 decisions ($0 local) |
| Email to alert | Up to 5 min plus the run | About 1 min, a sub-second decision, then one LLM call |

Assumptions: 150 emails a day, 10% urgent, 20% queued, 15% needing a second call, $2 per 1M input and $10 per 1M output tokens for the LLM. About 12x cheaper with 6x fewer LLM calls. The saving comes from waking the LLM less often, and the decision model is what makes that safe.

Other rules I'm following, mostly from people who learned them the hard way: code owns dates, counts and money. The decision model never sends, pays or deletes. Failures fall back to the LLM and never to archive. Personal data stays on a local model until I've read the vendor's retention terms.

## 15. What people are building

The business list is longer than I expected going in.

| **Technical Use case** | **Example** | **My verdict** |
| --- | --- | --- |
| Model routing by predicted difficulty | Router plugins for coding agents | Skip. Predicting which model will fail tests at chance (51%) |
| Tool and skill selection | MetaTool, 199 tools | Strong: 96.5% in one test |
| Safety gate on shell commands | Approval hooks for coding agents | Strong when criteria are split and it fails closed |
| Context compaction | Compaction plugins | Skip. The Hermes agent eval said do not adopt |
| Browser agents | 7 s flight search for $0.0039 | Promising, three runs |
|  |  |  |
| **Business Use case** | **Example** | **My verdict** |
| Email triage | 500 emails sorted for 3.5 cents | Start here |
| Call transcripts | Every recorded call tagged by client | Strong, already in production at a peer |
| Support routing | Team, urgency and frustration in one call | Strong |
| Documents | Page orientation, language, splitting | Strong |
| Invoices | Workflow evals | Usable with a human check, \~65% exact |
| Signups and leads | Onboarding path from a work email | Good fit |
| Moderation and domain safety | Cloudflare threat intel, 2.2 s vs 4.7 s | Strong |
| Trading bots | Paper-trading loops | Avoid. Forecasting is the documented weak spot |

## 16. The bigger picture: three ways agents call LLM models less

- **Code mode.** The model writes a script that calls tools and processes data, so intermediate results stay out of context. OpenAI ships it as [Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) (GPT-5.6, Jul 9, API only, on by default in the Agents API; named customers saw 38% to 63.5% fewer tokens). Anthropic shipped [its own version](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling) in Nov 2025 (20% to 40% typical savings, API only). Cloudflare has Code Mode for MCP portals, and OpenCode, Pi and Goose ship it in the harness. An [independent Bifrost benchmark](https://github.com/maximhq/bifrost-benchmarking/blob/main/mcp-code-mode-benchmark/benchmark_report.md) cut input tokens 58% at 96 tools and 93% at 508.
- **Faster plumbing.** OpenAI's [DevDay](https://community.openai.com/t/devday-2026-announcements-and-developer-resources/1402006) claimed 45% lower time to first token, 30% faster tool calls and an Ultrafast tier.
- **Decision models at every fork.** Everything above.

The pattern every good write-up lands on: code owns state and permissions, the decision model picks from a menu code prepared or abstains, the LLM writes what a human reads, and every decision leaves a log you can replay. My bet is that Claude, Codex and OpenCode absorb all three, so runs get faster and cheaper with nothing for you to configure.

## 17. Caveats

- Vendor benchmarks favor the vendor, and single-tester timings are thin.
- Confidence isn't accuracy. Set thresholds from your own labeled examples.
- Documented weak spots: math, counting, dates, double negatives, multi-hop questions, long irrelevant context.
- Data terms differ. Jev offers zero retention only on enterprise contracts, Cloudflare says it doesn't store or train on requests, Liquid's OpenRouter listing allows training on requests, and local models keep data at home.

## 18. Conclusions

**For engineers, whether you build alone or support an owner's team**

Try one decision to understand how it works. Pick something your system already decides many times a day where a wrong answer is cheap to catch. Then choose by what you need:

- **Local control:** match the model to your hardware. vLLM-SR Nox 4B on a laptop-class GPU, Clef-flash or vLLM-SR Lux 9B on a mid-range GPU, Kev 27B or Perplexity Decider v1.1 on a 24 GB card. Laya only if you're CPU-bound and ready to fine-tune.
- **Ease of use:** Jev. One API key, solid calibration evidence and SDKs for most stacks. Perplexity's hosted Decider is cheaper and scores higher on the Decision Index.
- **Already on Cloudflare, or testing images:** Clef or Clef-flash on Workers AI.

Keep it behind a thin layer you own. Ask for facts, let code decide, and log every decision so you can replay it and tune thresholds against what happened. The options share a request format, so switching later is cheap.

**For non-technical owners**

There's nothing you need to do. This is plumbing that vendors will install. Going forward, the AI tools you already use should get faster and cheaper and better at deciding what deserves your attention. You're not behind.


## Sources

- [Decision Index 0.3 (Hugging Face)](https://huggingface.co/spaces/multimodalart/jev-decision-index)
- [JevBench via BenchLM](https://benchlm.ai/decision-models)
- [JevBench via Made By Agents](https://www.madebyagents.com/benchmarks/jevbench)
- [AIMultiple System One Index](https://aimultiple.com/system-one)
- [TypeSafe: Jev launch](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [Cloudflare: Introducing Clef](https://blog.cloudflare.com/clef-decision-models/)
- [OpenAI Decisions guide](https://developers.openai.com/api/docs/guides/decisions)
- [Perplexity Decisions API](https://docs.perplexity.ai/docs/decisions/quickstart)
- [Liquid d1 docs](https://docs.liquid.ai/lfm/models/decision-models)
- [Nadir: six deciders compared](https://getnadir.com/blog/decision-models-compared-clef-perplexity-decider-jev-glide-cost/)
- [Startupik comparison](https://startupik.com/decision-model-api-jev-clef-perplexity-openai/)
- [AI/ML API Jev test](https://aimlapi.com/blog/what-is-jev)
- [Firecrawl: Decisions API vs Jev](https://www.firecrawl.dev/blog/openai-decisions-api-vs-jev)
- [Context Studios latency re-measurements](https://www.contextstudios.ai/blog/jev-measured-92-214-ms-per-decision-under-1-cent-per-8-requests)
- [Infinisynapse benchmark roundup](https://infinisynapse.com/en/blog/jev-benchmark)
- [Flowtivity: Laya](https://flowtivity.ai/blog/laya-open-source-jev-alternative/)
- [OpenAI Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)
- [Anthropic Programmatic Tool Calling](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)
- [Bifrost code mode benchmark](https://github.com/maximhq/bifrost-benchmarking/blob/main/mcp-code-mode-benchmark/benchmark_report.md)
- [OpenAI DevDay 2026 thread](https://community.openai.com/t/devday-2026-announcements-and-developer-resources/1402006)
