---
title: "Build Your Own Alex Hormozi Brain Agent"
date: 2026-04-08
description: "I collected 99 YouTube transcripts, 3 audiobook transcripts, 15 guest podcast transcripts, and built a voice analysis to create a Hormozi advisor I can chat with through Claude Projects. Here's the full process."
story: 3
tags: ["ai-agents", "claude-code", "claude-projects", "alex-hormozi"]
platforms: {}
draft: false
---

I bought the books. Watched the videos. Still wanted more, especially after Hormozi talked about the agent he created.

All that material is publicly available. Enough to build my own Alex Hormozi Brain Agent?

"Hey Jules, how about it?" Jules is my AI coding assistant (Claude Code). Jules ran off, grabbed transcripts of videos, text of books, whatever is available online. Guest podcasts. Then turned that into files I uploaded to a Claude Project so I can chat through Claude with Alex Hormozi.

**Here's what Jules found**
- 99 long-form YouTube video transcripts
- 3 complete audiobook transcripts
- 15 guest podcast transcripts
- X threads

## Fast Path

If you just want the agent running, start with the public repo instead of rebuilding the whole pipeline:

[github.com/jonathanmalkin/hormozi-brain-claude-project](https://github.com/jonathanmalkin/hormozi-brain-claude-project)

It includes:

- Project instructions you can paste straight into Claude
- Distilled knowledge files for frameworks, voice patterns, and background
- Evaluation prompts to test whether the agent is actually useful
- A source manifest if you want to upgrade to the full-source version later

Setup takes five moves:

1. Open the repo and grab `PROJECT-INSTRUCTIONS.md`
2. Create a new Claude Project
3. Paste `PROJECT-INSTRUCTIONS.md` into Project Instructions
4. Upload the four files in `knowledge/`
5. Run the prompts in `evals/test-prompts.md`

That gets most people to a usable advisor in 20-30 minutes instead of spending a day doing transcript operations.

## Builder Path

If you want the higher-fidelity version, use the repo as the starter kit and then keep going.

Builder path:

1. Start with the GitHub repo so you have a working baseline
2. Inventory the full public source landscape
3. Download transcripts and audiobooks
4. Analyze the voice and frameworks
5. Repackage the highest-signal material for Claude Projects
6. Test, refine, and only then keep expanding the corpus

The rest of this article is the full builder walkthrough.

## What I Did in Four Phases

Phase 1 maps the full source landscape: YouTube channel (4,754 videos), The Game podcast (~900+ episodes), three books, guest podcast appearances, X/Twitter. Figure out what's worth downloading before you start.

Phase 2 downloads and converts. Top 100 longest video transcripts, full audiobook transcripts for all three books, 15 guest podcast transcripts from the highest-view-count appearances, and whatever X/Twitter content the API will give you.

Phase 3 runs voice pattern analysis. Sentence structure, reasoning skeleton, core frameworks, teaching style, verbal signatures. This is where the persona takes shape.

Phase 4 builds the system prompt and optimizes the knowledge base to fit within Claude Projects' limits. Then deploy.

## Phase 1: Inventory

The @AlexHormozi YouTube channel has 4,754 videos. That number is misleading. 4,246 of those are Shorts (under 60 seconds or no duration metadata). Filter those out and you have 508 full-length videos. That's the real content library.

Beyond YouTube, the main sources worth pursuing:

- **The Game podcast** (~900+ episodes). His primary long-form output. The audiobooks for all three books are available free on the podcast and YouTube.
- **Guest podcast appearances.** DOAC, Impact Theory, School of Greatness, Modern Wisdom, Danny Miranda. Hosts push him off-script and into territory he doesn't cover in his own content. High value per byte.
- **X/Twitter threads.** Compressed, punchy formulations of his frameworks. Different texture than the long-form material.
- **Skool community.** Behind a login wall. Low ROI for this project.
- **Acquisition.com.** No blog. Courses are paywalled. Skip.

## Phase 2: Collect

### YouTube Transcripts

The first scrape of the YouTube channel only returned 494 videos. The channel has 4,754. The scraper was pulling from the /videos tab, which doesn't surface the full library. Re-running against the full channel URL (@AlexHormozi) returned everything. Easy to miss, significant difference.

After filtering Shorts: 508 full-length videos. I downloaded auto-generated captions for the top 100 longest videos (sorted by duration, so the meatiest content came first). Auto-generated captions from YouTube come as SRT files with timestamps, line numbers, and duplicate lines. Converting those to clean readable text required stripping all the formatting artifacts and deduplicating language variants (English vs English-Original).

Result: 99 transcripts. A few livestreams had no captions available.

### Book Audiobook Transcripts

All three Hormozi books have full audiobook uploads on YouTube:

- $100M Offers (~4.4 hours)
- $100M Leads (~7 hours)
- $100M Money Models (~4.3 hours)

Same process as the video transcripts. Download the auto-generated captions, convert to clean text. Three files, 855KB total. These are non-negotiable core material for the knowledge base.

### Guest Podcast Transcripts

Searched YouTube for Hormozi guest appearances sorted by view count. The top hit was Diary of a CEO at 4.7M views. Grabbed the 15 highest-view-count appearances.

The guest transcripts are 2.1MB total. Worth every byte. When a host like Steven Bartlett or Tom Bilyeu pushes back on a claim, Hormozi shifts into a different mode. He's more precise and sometimes reveals the edge cases he glosses over on his own channel. You can't get that from watching his channel alone.

### X/Twitter Content

X's API rate limits capped the collection at 9 unique tweets. Not ideal, but enough to confirm the voice texture: "Aggressive with effort. Relaxed with outcome." His Twitter is his most compressed format. Each tweet is a framework distilled to a single line.

9 tweets is thin. For a more complete build, you'd want to manually curate 50-100 of his best threads. The API limitations made automated collection impractical.

## Phase 3: Analyze

I ran voice analysis across the full corpus, looking at seven dimensions.

Hormozi's sentences are short, punchy declarations. Fragments for emphasis. "And so" as his default transition. Short bursts, then a longer sentence that lands the point. Nearly every argument follows the same five-step skeleton: bold claim, personal story, framework, math, then a reductio ad absurdum that makes the alternative sound insane. Once you see it, you can't unsee it.

The core frameworks are Grand Slam Offer, Value Equation, Supply and Demand, Leverage types, Core Four (lead generation methods), and Money Models. Define all of them precisely in the system prompt.

His default mode is intense-casual. Strategic profanity. He'll get vulnerable for a sentence, then pivot straight to the lesson. Never stays there. The teaching style is concentric repetition: same idea from four different angles in two minutes. Analogy, story, math, then back to the principle.

The verbal tics are critical for the persona. "Right?" as a check-in with the audience. "That's it." as a full stop after a framework. "The reality is..." to pivot from what people think to what's true. "you're like..." to voice the audience's resistance before dismantling it. His analogies pull from physical and competitive domains: poker, fighting, dating, weightlifting.

### Coverage Assessment

The collected material captures an estimated 60-70% of his publicly available thinking. Two gaps stood out:

1. **Guest podcast appearances beyond the top 15.** There are dozens more, each with unique material.
2. **X/Twitter threads.** Only 9 tweets collected. His most compressed formulations live here.

Nice to have, not essential. The three books plus 99 video transcripts plus 15 guest appearances cover the core frameworks, teaching style, and reasoning patterns thoroughly.

## Phase 4: Build

### The System Prompt

The system prompt encodes everything from Phase 3 into a persona specification. It covers:

- Voice patterns and verbal tics (the specific phrases, the rhythm, the profanity style)
- The five-step reasoning structure
- All core frameworks with descriptions
- Teaching style (concentric repetition, the four-angle approach)
- Belief system and values
- Emotional register with examples of how he modulates it
- Seven conversational rules for how the agent handles advice-giving
- Background facts (business history, portfolio companies, personal story beats) to reference naturally
- Anti-patterns: what Hormozi doesn't do. No hedging. No "it depends" without immediately following up with when it does and doesn't depend. No abstract theory without a concrete example within 30 seconds.

Without the anti-patterns list, the model defaults to hedge-everything business coach. That's not Hormozi.

### Hitting the Knowledge Limit

First attempt: 47 files, 11.4MB. In practice, that was too much to manage cleanly inside Claude Projects as a single high-signal knowledge base.

The optimization process:

- Three books (855KB): kept as individual files. Non-negotiable.
- All 15 guest appearances merged into one file (2.1MB): unique material, high value per byte.
- Top 12 video transcripts split into two files (4.2MB total): the longest, meatiest content.
- X/Twitter threads (2KB): tiny footprint, worth including for voice calibration.
- System prompt (8KB): the persona specification.

Result: 8 files, 7.0MB. The 84 remaining video transcripts didn't make the cut. The books and guest appearances got priority because they contain the most unique material. Video transcripts have significant overlap with each other (he repeats his frameworks constantly, which is great for learning but redundant in a knowledge base).

Anthropic now says Projects can use retrieval to expand effective capacity by up to 10x. Useful. But the real bottleneck is still curation. If half your files repeat the same points, more storage just gives the model more duplicated material to sift through. The highest-leverage move is still packaging the most unique, diagnostic content first.

### NotebookLM Alternative

Before settling on Claude Projects, I also bundled the transcripts for Google's NotebookLM, which has a 50 sources/notebook limit. That required combining 102 individual files into 38 uploadable text files: 3 books as individual files, 14 top video transcripts as individual files, and 21 "Video Bundle" files containing the remaining 84 videos in groups of 4.

Same content, completely different packaging decisions. Claude Projects has the tighter budget but a better conversational agent on the other end. NotebookLM lets you upload more but the agent doesn't use it as flexibly.

### Can You Copy or Share the Claude Project?

Inside a Claude Team or Enterprise workspace, yes, you can share the Project directly with other people in the workspace.

Across separate accounts, there isn't a clean export-import path for a full Claude Project configuration. That's why the easier unit to share is the kit, not the Project itself.

The portable public repo looks like this:

- `PROJECT-INSTRUCTIONS.md`
- `knowledge/01-core-frameworks.md`
- `knowledge/02-voice-patterns.md`
- `knowledge/03-background-and-beliefs.md`
- `knowledge/04-how-to-use-this-agent.md`
- `evals/test-prompts.md`
- `sources.csv`

Repo:

[github.com/jonathanmalkin/hormozi-brain-claude-project](https://github.com/jonathanmalkin/hormozi-brain-claude-project)

---

## Go Build Yours

Hormozi was mine. Pick whoever matters to your business.

The material is out there for almost anyone with a substantial public body of work. Naval Ravikant, Patrick Bet-David, Seth Godin, Brene Brown. Podcasters, authors, YouTubers. If they've published 100+ hours of content, there's enough to build a useful advisor agent.

The process is the same regardless of who you pick. Start with a starter kit. Then, if it proves useful, inventory the sources, download transcripts, analyze the voice, and upgrade the knowledge base. The whole full-source project took about a day with Claude Code running the collection and analysis.

You still read the books and watch the videos. The agent gives you a different interface to the same material. Pressure-test your specific business problem against their frameworks instead of hoping you remember the right chapter when you need it.

## The Packaging Bottleneck

The work is in the packaging. Auto-generated captions need cleaning. Files need deduplication. Even with better retrieval, you still need hard choices about what makes the cut. Voice analysis requires reading for patterns, not just content volume.

Most major business thinkers have enough publicly available material to build a useful advisor. The information exists. Turning hours of video into a structured knowledge base is where the effort goes.

## What Changes When You Can Ask It

Watching a Hormozi video, you absorb frameworks passively. Whether you remember the right one when you actually need it is a coin flip.

Having a Hormozi brain agent means you can describe your specific offer and get it pressure-tested against his frameworks in real time. "Here's my SaaS pricing page. What would Hormozi say is wrong with this offer?" That's a different interaction than watching a video about pricing.

The questions I find myself asking it: How would you restructure this offer to increase perceived value without changing the deliverable? What's the biggest bottleneck in this lead generation approach? Where am I trading time for money when I should be trading money for time?

The answers aren't magic. They're his frameworks applied to your specifics. What offer would you pressure-test first?

---

## Appendix: Full Reproduction Guide

Everything you need to build your own version. Assumes comfort with the command line.

### Tools

- **yt-dlp**: YouTube metadata extraction and caption downloading. Install via Homebrew: `brew install yt-dlp`
- **Python 3**: File processing, deduplication, bundling
- **Claude Code** (or similar AI coding assistant): Voice analysis, system prompt writing, optimization
- **xurl** (optional): X/Twitter API search. Any Twitter API client works.

### Step 1: Scrape the YouTube Channel

Pull the full video list with metadata:

```bash
yt-dlp --flat-playlist --print "%(id)s\t%(title)s\t%(duration)s" \
  "https://www.youtube.com/@AlexHormozi" > hormozi_all_videos.tsv
```

Important: use the full channel URL (`@AlexHormozi`), not the `/videos` tab URL. The videos tab returns a subset. The full channel URL returns everything.

### Step 2: Filter Out Shorts

Shorts are videos under 60 seconds. Filter them with a simple Python script or awk:

```python
import csv

with open('hormozi_all_videos.tsv') as f:
    reader = csv.reader(f, delimiter='\t')
    full_length = []
    for row in reader:
        try:
            dur = int(float(row[2]))
        except (ValueError, IndexError):
            continue
        if dur >= 60:
            full_length.append(row)

# Sort by duration, longest first
full_length.sort(key=lambda r: int(float(r[2])), reverse=True)

with open('hormozi_full_length.tsv', 'w') as f:
    writer = csv.writer(f, delimiter='\t')
    writer.writerows(full_length)
```

Note: `--flat-playlist` returns incomplete duration data for some videos (shows as `NA` or empty). Full-length videos with missing durations will be dropped by this filter. For more complete results, drop `--flat-playlist` and let yt-dlp load each video page (much slower, but accurate durations).

This should yield ~500+ full-length videos depending on when you run it.

### Step 3: Download Transcripts

Download auto-generated captions for your top N videos (we used the top 100 by duration):

```bash
# For each video ID in your filtered list:
yt-dlp --write-auto-sub --sub-lang "en.*" --convert-subs srt --skip-download \
  -o "transcripts/%(id)s" \
  "https://www.youtube.com/watch?v=VIDEO_ID"
```

Use `--sub-lang "en.*"` to catch language variants (en, en-US, en-orig). The `--convert-subs srt` flag forces consistent output format. Some videos (especially livestreams) may not have auto-generated captions.

### Step 4: Convert SRT/VTT to Clean Text

SRT files contain timestamps, line numbers, and duplicate lines from the auto-caption process. Strip all of that:

```python
import re

def srt_to_text(srt_content):
    # Remove line numbers
    text = re.sub(r'^\d+\s*$', '', srt_content, flags=re.MULTILINE)
    # Remove timestamps
    text = re.sub(r'\d{2}:\d{2}:\d{2}[.,]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[.,]\d{3}', '', text)
    # Remove VTT headers
    text = re.sub(r'^WEBVTT.*$', '', text, flags=re.MULTILINE)
    # Collapse whitespace
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    # Deduplicate consecutive identical lines
    deduped = [lines[0]] if lines else []
    for line in lines[1:]:
        if line != deduped[-1]:
            deduped.append(line)
    return ' '.join(deduped)
```

This deduplication handles the standard YouTube overlap artifact (each caption block repeats the prior line). The result is clean enough for an LLM knowledge base, though not perfectly formatted prose.

Also check for language variant duplicates. YouTube sometimes generates both `en` and `en-orig` captions for the same video. Keep one.

### Step 5: Download Book Audiobook Transcripts

Search YouTube for the full audiobook uploads:
- "$100M Offers full audiobook" (~4.4 hours)
- "$100M Leads full audiobook" (~7 hours)
- "$100M Money Models full audiobook" (~4.3 hours)

Same download and conversion process as the video transcripts. These three files are the highest-value content per byte.

### Step 6: Guest Podcast Transcripts

Search YouTube for guest appearances sorted by view count:

```bash
yt-dlp --flat-playlist --print "%(id)s\t%(title)s\t%(view_count)s\t%(duration)s" \
  "ytsearch100:Alex Hormozi interview podcast" > hormozi_guest_search.tsv
```

Manually curate the top 15-20 highest-quality appearances. Look for hosts who push back (Steven Bartlett, Tom Bilyeu, Lewis Howes). Download and convert transcripts the same way.

### Step 7: X/Twitter Content (Optional)

If you have Twitter API access:

```bash
xurl search "from:AlexHormozi" -n 50
```

X's API requires paid access for meaningful timeline search, and even paid tiers have aggressive rate limits. You'll likely get far fewer results than requested. Manually curating tweets from his profile page is more practical for most people.

### Step 8: Voice Analysis

Feed a representative sample of transcripts (10-15, mixing books, videos, and guest appearances) to Claude or another LLM with this prompt:

> Analyze this person's communication style across these transcripts. Identify: sentence structure patterns, reasoning skeleton (how arguments are built), core recurring frameworks, emotional register and how it shifts, teaching methodology, verbal signatures and verbal tics, preferred analogy domains, and anti-patterns (what they never do).

Use the analysis output to write the system prompt.

### Step 9: Build the System Prompt

The system prompt should cover:

1. Voice patterns (sentence length, fragment usage, transitions)
2. Reasoning structure (the step-by-step argument skeleton)
3. All core frameworks with one-paragraph descriptions
4. Teaching style (how to explain, re-explain, use examples)
5. Emotional register (default mode, when it shifts, how profanity is deployed)
6. Conversational rules (how to handle pushback, how to give advice, when to use stories)
7. Background facts (career history, portfolio, personal story beats)
8. Anti-patterns (what the persona never does, what to avoid)

Test the prompt with questions you know the real person has answered. Compare the agent's response to how they actually answered. Iterate.

### Step 10: Package for Claude Projects

Claude Projects lets you attach reference documents to a Claude conversation that persist across sessions. The knowledge base caps out around 7MB of content (token-based under the hood, but ~7MB of clean text is the practical ceiling). If your total content exceeds that:

1. Prioritize books (most structured, highest unique value per byte)
2. Guest appearances next (unique material not available elsewhere)
3. Merge remaining files by category (video bundles, podcast bundles)
4. X/Twitter content last (small footprint, useful for voice calibration)
5. System prompt as a separate file

Upload all files to a Claude Project. The system prompt goes in the Project Instructions, not as a knowledge file.

For NotebookLM, the limit is 50 sources per notebook with per-source size caps as well. You may need to bundle multiple transcripts into single files to stay under both limits.

### Step 11: Test and Iterate

Ask the agent questions across different domains:
- Offer construction ("Review this offer and tell me what's wrong")
- Lead generation ("What would you change about my lead magnet?")
- Business model ("I'm charging $X for Y. What should I change?")
- Mindset ("I'm afraid to raise my prices. What am I getting wrong?")

Compare responses to how the real person has addressed similar topics. The system prompt almost always needs 2-3 rounds of refinement before the voice feels right.

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*
