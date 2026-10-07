---
title: "Self-Improvement Loop: My Favorite Claude Code Skill Isn't Flashy. It's a Checklist."
seoTitle: "Self-Improvement Loop: My Favorite Claude Code Skill Is a Checklist"
date: 2026-02-19
description: "The wrap-up skill commits code, updates memory, runs a self-improvement review, and flags publishable content. Four phases that make every session compound."
story: 1
tags: ["claude-code", "skills", "wrap-up", "self-improvement", "automation"]
platforms:
  reddit: "https://www.reddit.com/r/ClaudeCode/comments/1r89084/selfimprovement_loop_my_favorite_claude_code_skill/"
draft: false
---

I've built a bunch of custom skills for Claude Code at this point. Some are clever. Some are over-engineered. The one I actually use every single session is basically a glorified checklist.

It's called `wrap-up`. I run it at the end of every working session. It commits my code, checks if I learned anything worth remembering, reviews whether Claude made mistakes it should learn from, and flags anything worth publishing. Four phases, fully automated, no approval prompts interrupting the flow.

Here's the full thing. I've sanitized paths and project-specific details but the structure is real and unedited.

---

```markdown
---
name: wrap-up
description: Use when user says "wrap up", "close session", "end session",
  "wrap things up", "close out this task", or invokes /wrap-up — runs
  end-of-session checklist for shipping, memory, and self-improvement
---

# Session Wrap-Up

Run four phases in order. Each phase is conversational and inline — no
separate documents. All phases auto-apply without asking; present a
consolidated report at the end.

## Phase 1: Ship It

**Commit:**
1. Run `git status` in each repo directory that was touched during the session
2. If uncommitted changes exist, auto-commit to main with a descriptive message
3. Push to remote

**File placement check:**
4. If any files were created or saved during this session:
   - Verify they follow your naming convention
   - Auto-fix naming violations (rename the file)
   - Verify they're in the correct subfolder per your project structure
   - Auto-move misplaced files to their correct location
5. If any document-type files (.md, .docx, .pdf, .xlsx, .pptx) were created
   at the workspace root or in code directories, move them to the docs folder
   if they belong there

**Deploy:**
6. Check if the project has a deploy skill or script
7. If one exists, run it
8. If not, skip deployment entirely — do not ask about manual deployment

**Task cleanup:**
9. Check the task list for in-progress or stale items
10. Mark completed tasks as done, flag orphaned ones

## Phase 2: Remember It

Review what was learned during the session. Decide where each piece of
knowledge belongs in the memory hierarchy:

**Memory placement guide:**
- **Auto memory** (Claude writes for itself) — Debugging insights, patterns
  discovered during the session, project quirks. Tell Claude to save these:
  "remember that..." or "save to memory that..."
- **CLAUDE.md** (instructions for Claude) — Permanent project rules,
  conventions, commands, architecture decisions that should guide all future
  sessions
- **`.claude/rules/`** (modular project rules) — Topic-specific instructions
  that apply to certain file types or areas. Use `paths:` frontmatter to scope
  rules to relevant files (e.g., testing rules scoped to `tests/**`)
- **`CLAUDE.local.md`** (private per-project notes) — Personal WIP context,
  local URLs, sandbox credentials, current focus areas that shouldn't be
  committed
- **`@import` references** — When a CLAUDE.md would benefit from referencing
  another file rather than duplicating its content

**Decision framework:**
- Is it a permanent project convention? → CLAUDE.md or `.claude/rules/`
- Is it scoped to specific file types? → `.claude/rules/` with `paths:`
  frontmatter
- Is it a pattern or insight Claude discovered? → Auto memory
- Is it personal/ephemeral context? → `CLAUDE.local.md`
- Is it duplicating content from another file? → Use `@import` instead

Note anything important in the appropriate location.

## Phase 3: Review & Apply

Analyze the conversation for self-improvement findings. If the session was
short or routine with nothing notable, say "Nothing to improve" and proceed
to Phase 4.

**Auto-apply all actionable findings immediately** — do not ask for approval
on each one. Apply the changes, commit them, then present a summary of what
was done.

**Finding categories:**
- **Skill gap** — Things Claude struggled with, got wrong, or needed multiple
  attempts
- **Friction** — Repeated manual steps, things user had to ask for explicitly
  that should have been automatic
- **Knowledge** — Facts about projects, preferences, or setup that Claude
  didn't know but should have
- **Automation** — Repetitive patterns that could become skills, hooks, or
  scripts

**Action types:**
- **CLAUDE.md** — Edit the relevant project or global CLAUDE.md
- **Rules** — Create or update a `.claude/rules/` file
- **Auto memory** — Save an insight for future sessions
- **Skill / Hook** — Document a new skill or hook spec for implementation
- **CLAUDE.local.md** — Create or update per-project local memory

Present a summary after applying, in two sections — applied items first,
then no-action items:

Findings (applied):

1. ✅ Skill gap: Cost estimates were wrong multiple times
   → [CLAUDE.md] Added token counting reference table

2. ✅ Knowledge: Worker crashes on 429/400 instead of retrying
   → [Rules] Added error-handling rules for worker

3. ✅ Automation: Checking service health after deploy is manual
   → [Skill] Created post-deploy health check skill spec

---
No action needed:

4. Knowledge: Discovered X works this way
   Already documented in CLAUDE.md

## Phase 4: Publish It

After all other phases are complete, review the full conversation for material
that could be published. Look for:

- Interesting technical solutions or debugging stories
- Community-relevant announcements or updates
- Educational content (how-tos, tips, lessons learned)
- Project milestones or feature launches

**If publishable material exists:**

Draft the article(s) for the appropriate platform and save to a drafts folder.
Present suggestions with the draft:

All wrap-up steps complete. I also found potential content to publish:

1. "Title of Post" — 1-2 sentence description of the content angle.
   Platform: Reddit
   Draft saved to: Drafts/Title-Of-Post/Reddit.md

Wait for the user to respond. If they approve, post or prepare per platform.
If they decline, the drafts remain for later.

**If no publishable material exists:**

Say "Nothing worth publishing from this session" and you're done.

**Scheduling considerations:**
- If the session produced multiple publishable items, do not post them all
  at once
- Space posts at least a few hours apart per platform
- If multiple posts are needed, post the most time-sensitive one now and
  present a schedule for the rest
```

---

## Why this works

The skill isn't doing anything hard. It's doing four things I'd forget to do myself:

**Ship It** catches the "oh I never committed that" problem. I'm bad about this. I'll do an hour of work, close the laptop, and realize the next day nothing got pushed. Now Claude just does it.

**Remember It** is where the compounding happens. Claude has a memory hierarchy (CLAUDE.md, rules, auto memory, local notes) and most people never use it deliberately. This phase forces a review: "did we learn anything that should persist?" Over weeks, your setup gets smarter without you thinking about it.

**Review & Apply** is the one that surprised me. I added it half-expecting it to be useless. But Claude actually catches real patterns. "You asked me to do X three times today that I should've done automatically." Then it writes the rule and commits it. Self-improving tooling with zero effort from me.

**Publish It** is the newest phase. Turns out a lot of sessions produce something worth sharing and I just... never get around to it. Now Claude flags it, drafts it, and saves it. I still decide whether to post, but the draft is there instead of lost in a conversation I'll never reopen.

## The meta point

The best skills aren't the ones that do impressive things. They're the ones that run the boring routines you'd skip. Every session that ends with `/wrap-up` leaves my projects a little more organized, my Claude setup a little smarter, and occasionally produces a blog post I didn't plan to write.

This post, for example.

---

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*
