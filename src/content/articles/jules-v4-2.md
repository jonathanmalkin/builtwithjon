---
title: "Jules v4.2: 19 Skills, 3 Hooks. The System Keeps Simplifying."
date: 2026-04-07
description: "Jules v4.2 adds social engagement and config hygiene skills while retiring RTK and trimming hooks from 5 to 3. More capabilities, fewer moving parts."
story: 1
tags: [claude-code, jules, open-source, infrastructure]
draft: false
---

Quick update on Jules, the open source Claude Code setup.

**What changed:**

- 3 new skills: `reply-x` (X/Twitter engagement with multi-account), `watch-contacts` (monitors contacts' posts for engagement opportunities), `simplify-jules` (config hygiene, finds waste and duplication in the cold-start bundle)
- RTK retired. Claude Code doesn't interpret the rewritten output properly and I was spending more time working around it than it saved. One fewer dependency.
- Hooks went from 5 to 3. Same safety coverage.

The v4 theme was simplification (32 skills to 17, 15 hooks to 5, killed the VPS). v4.2 continues it. More things the system can do, fewer moving parts to maintain.

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*
