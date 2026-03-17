---
title: "I Built Most of What NVIDIA Just Announced. Here's the Part I Didn't."
date: 2026-03-17
description: "NemoClaw dropped yesterday. My first reaction: I already have most of this. A practitioner's comparison of Docker sandbox isolation, CLAUDE.md policy controls, and the one real gap (inference routing) that NemoClaw actually adds."
story: 1
tags: ["claude-code", "docker", "security", "architecture", "nemoclaw", "openclaw"]
draft: false
---

NVIDIA dropped NemoClaw yesterday. Sandboxed execution, policy-based access controls, network egress filtering. Enterprise security wrapper around OpenClaw.

My first reaction: I have almost all of this.

Not because I was building toward NemoClaw. I was solving specific problems as they came up. But the architecture converged on the same place. So here's a practitioner's comparison -- what maps, what doesn't, and when NemoClaw actually makes sense.

---

## The sandbox layer

My Claude sessions run inside a Docker container. `tini` is PID 1.

That second part matters. Without a proper init process, zombie processes accumulate indefinitely. Every `claude -p` call spawned by my Slack daemon left a zombie `node` process behind. Bash doesn't call `wait()` on child processes. I hit 40+ zombies during load testing before I figured out why.

`tini` reaps them automatically. Container isolation limits filesystem access to my active workspace via bind mounts. All scheduled jobs run inside the container, not on the host.

```dockerfile
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/home/claude/entrypoint.sh"]
```

That's it. NemoClaw markets this as "sandboxed execution" and "network egress filtering." I built it from first principles because zombie processes were eating my container.

## The policy layer

NemoClaw's "policy-based access controls" is a product feature. Mine is a markdown table in `CLAUDE.md`.

I call it Standing Orders. It defines what Claude can do autonomously vs. what requires my sign-off. Actions that Claude handles well once earn a permanent category authorization. One line revokes it:

```markdown
| Standing Order | Bounds | Override |
|---------------|--------|---------|
| Content Prep | Only approved articles. Report at wrap-up. | New content = Ask First |
| Production Deploy | Staging must pass CI + smoke test first. | New features = Ask First |
| Report-Driven Optimization | Data-driven only. Copy/CTA changes only. | Structural refactors = Ask First |
```

RBAC in markdown. No dashboard. No vendor dependency. The Standing Orders table is the living record of earned autonomy -- Claude asks first, proves it handles the category well, then gets authorized.

## What NemoClaw actually adds

Here's where I stop comparing and get honest.

NemoClaw has an inference routing layer I haven't built. A privacy proxy between your LLM calls and the provider, with hot-reloadable egress policies enforced at the network layer. For enterprise deployments where legal requires verification that prompts containing PII never leave a specific network boundary -- that's real value. It's genuinely novel.

The catch: NemoClaw's routing infrastructure pushes Nemotron models. If you're running Claude and want to stay there, the inference routing layer doesn't apply to you. The whole enterprise value prop assumes you want NVIDIA's model ecosystem.

Worth watching as inference privacy requirements mature. Not the reason to adopt NemoClaw today unless you're enterprise and already committed to Nemotron.

## On OpenClaw

NemoClaw wraps OpenClaw, so this matters.

The async agent loop pattern is solid. I'd built something equivalent before OpenClaw went mainstream: a Slack daemon, file-based message passing, `claude -p` for execution. The architecture makes sense.

ClawHub is a different story. 135,000 exposed instances. 22-26% of ClawHub skills tagged malicious. This wasn't bad luck -- it was predictable from the design. Skills from a public registry are a supply chain attack vector. You're installing arbitrary code from strangers.

Claude Code's native skills are markdown and bash running in your own environment. No registry. No install step. No attack surface. You write them; you know exactly what they do.

## The recommendation for solo builders

Build the sandbox: Docker + tini. One-time setup.

Build the policy layer: a Standing Orders table in your `CLAUDE.md`. It grows as you work.

Skip OpenClaw. You'd be trading a better architecture for a worse one.

Skip NemoClaw unless you're enterprise, need inference privacy at the network layer, and are willing to adopt Nemotron. It's solving a real problem -- just not one most solo builders have yet.

---

I would have loved if someone had written this six months ago. So here it is.

Happy to share the full Docker setup or the Standing Orders pattern in the comments.

*Full setup source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*

*I build AI infrastructure for communities mainstream tech ignores.*
