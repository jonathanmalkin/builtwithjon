---
title: "Your CLAUDE.md Should Not Be a Dumping Ground"
date: 2026-04-07
description: "A thin hierarchy beats a giant CLAUDE.md. Where system knowledge actually belongs."
story: 1
tags: ["claude-code", "project-structure", "workflow", "ai-automation", "solo-founder"]
draft: false
---

My `CLAUDE.md` used to be a landfill. Old workarounds that no longer applied. Edge cases from three months ago. Instructions that contradicted each other. Claude started every session carrying context that no longer mattered.

The setup that replaced it is closer to a routing tree than a single system prompt.

One thin root `CLAUDE.md` with the operating contract. Narrower instructions pushed down to where the work changes. Rules for reusable topic-level guidance. Hooks for the things that need enforcement instead of polite suggestion.

Nobody builds it this way the first time.

## The Mistake

I did this too. Treated `CLAUDE.md` like a brain dump:

- personality
- project architecture
- build commands
- coding conventions
- deployment notes
- one-off lessons from old bugs
- weird edge cases from three months ago
- instructions for folders Claude barely touches

At first that feels efficient. One file. One place to look. Nothing gets lost.

But `CLAUDE.md` is startup context. Claude loads it into every session. Anthropic's docs explicitly frame it as context, not hard configuration, and recommend keeping each file concise enough that Claude can follow it. Their [current guidance](https://code.claude.com/docs/en/memory) is to target under 200 lines per file and split large instruction sets into imports or `.claude/rules/` files instead.

The moment your root file becomes a catch-all, you are paying for that bloat every time Claude starts.

## What I Do Instead

My global file is four lines. It points Claude into the real workspace. That is all it does.

The real operating contract lives in the workspace root:

- who my agent persona is and how it should behave
- what kinds of tasks route to quick work vs research vs thinking
- what Claude can do autonomously
- what still needs approval
- communication style
- a few high-value references

The `@filename` syntax is what makes this work. The root file stays short because it imports profiles, rules, and references at session start without duplicating content.

Then I split context by scope.

- `Code/CLAUDE.md` for the software side of the workspace (stack, test commands, deploy patterns)
- `Documents/CLAUDE.md` for folder structure and naming conventions
- project-level `CLAUDE.md` files when a specific codebase has its own constraints
- no `CLAUDE.md` in `Scripts/` because those scripts don't need different behavior

Here is what the structure looks like:

```
~/.claude/CLAUDE.md              # 4 lines — points to workspace
~/workspace/
  CLAUDE.md                      # operating contract (~120 lines)
  Code/
    CLAUDE.md                    # stack, tests, deploy patterns
  Documents/
    CLAUDE.md                    # folder structure, naming rules
  .claude/
    rules/
      safety.md                  # destructive-command policy
      search-tools.md            # which search tool for what
      sanitization.md            # outbound data masking
      ...                        # 7 files total
    hooks/
      safety-guard.sh            # blocks dangerous commands
      session-start.sh           # startup checks
```

Add a new `CLAUDE.md` only when the work changes.

Not when you feel like organizing.
Not because every folder deserves one.
Only when the instructions change.

## What Belongs Where

This is the split that has held up best for me.

`CLAUDE.md`

- project architecture
- workflow rules
- key commands
- decision boundaries
- naming conventions
- stable patterns Claude should know at session start

`.claude/rules/`

- topic-specific guidance that is too large or too narrow for the root file
- reusable conventions like testing, security, or publishing workflows
- rules can be scoped to specific file paths so they only load when Claude works with matching files

Hooks and permission settings

- anything you need enforced, not suggested
- destructive-command blocking
- plan review gates
- session startup checks

Memory or notes

- learnings that emerged from real work
- corrections Claude should carry forward
- operating observations that are useful but not foundational

Instructions are not controls. If something must happen every time, use a hook.

## Why This Structure Ages Better

The main advantage is survivability.

Claude Code loads `CLAUDE.md` files by walking up the directory tree, and it pulls in subdirectory files when work touches those areas. That means you can keep global context thinner and still have rich local context when you need it.

So instead of one bloated root file trying to anticipate everything, you get:

- less startup noise
- fewer contradictions
- more relevant context at the point of work
- easier maintenance when a project changes

I caught this during a simplification pass on my own system. The quality loss was not from any single wrong instruction. Too many old ones were still hanging around. Workarounds from months ago. Edge cases nobody hit anymore. Claude was following stale instructions because I never cleaned them out.

`CLAUDE.md` is the load-bearing layer. Important things go there. Everything else goes somewhere more specific.

## Starting From Scratch

If you are setting this up fresh, four layers:

1. A very thin `~/.claude/CLAUDE.md` for personal defaults that apply everywhere.
2. One real project or workspace root `CLAUDE.md` with architecture, commands, workflow, and decision boundaries.
3. Subdirectory or project-specific `CLAUDE.md` files only where the work genuinely changes.
4. `.claude/rules/` for larger or path-specific guidance that should not bloat the root.

When you learn something new, do not automatically add it to the root file. Ask: Is this global? Is this stable? Does Claude need this at the start of every session? Should this be enforced by a hook instead?

If the answer is no, it does not belong there.

People are not underusing `CLAUDE.md`. They are asking one file to do four jobs: startup context, memory, enforcement, and documentation. That works until the setup gets real.

Everything behind the root file has a place. The landfill is optional.

*Here is the actual setup if you want to steal the structure: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*
