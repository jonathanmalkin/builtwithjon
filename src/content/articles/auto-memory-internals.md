---
title: "Auto-Memory Internals Across Every Claude Code Environment"
date: 2026-03-24
description: "Claude Code's autoMemoryDirectory is simple to set, but each environment (CLI, self-hosted Docker, Claude Code Web) needs its own configuration path. Here's how to wire it up everywhere, with the sync strategy that ties them together."
story: 1
tags: ["claude-code", "memory", "hooks", "docker", "cloud", "settings"]
platforms:
  reddit: "https://www.reddit.com/r/ClaudeCode/comments/1s2o9c6/automemory_internals_across_every_claude_code/"
draft: false
---

I set `autoMemoryDirectory` in my settings.json and assumed memory would just work everywhere. It didn't.

- Local CLI? Fine.
- Docker container? Silent failure. Memory looked intact but never made it into sessions.
- [Claude Code Web](https://code.claude.com/docs/en/claude-code-on-the-web)? The setting vanished between sessions entirely.

I'm running 25+ memory files across three environments. Each one needs a different mechanism, and figuring out which one is the whole game.

---

## How Auto-Memory Works

You point [`autoMemoryDirectory`](https://code.claude.com/docs/en/memory) at a directory. Claude reads `MEMORY.md` from that directory into every session's system prompt. Individual topic files live alongside it with YAML frontmatter:

```yaml
---
name: infrastructure
description: VPS setup, container architecture, SSH aliases, GitHub repos
type: reference
---
```

The `description` field helps Claude decide which files are relevant to pull into context. Write it well or the right files don't get loaded. MEMORY.md is the index that ties them together.

The complexity is in wiring up `autoMemoryDirectory` correctly in each environment.

---

## [CLI](https://code.claude.com/docs/en/getting-started) (Local Mac/Linux)

The setting goes in the [user-level settings file](https://code.claude.com/docs/en/settings), not project-level. This matters because the user-level file applies to all projects.

```json
{
  "autoMemoryDirectory": "/Users/you/project/.claude-memory"
}
```

File location: `~/.claude/settings.json`

First: use an absolute path. The `~/` shorthand doesn't reliably expand in this context. There's an [open issue](https://github.com/anthropics/claude-code/issues/36636) about it. Hardcode the full path.

Second: the setting only applies to CLI sessions. It has no effect in Claude Code Web environments. That's the part I didn't account for when I first set this up.

You can use a symlink as a fallback:

```bash
ln -sfn /absolute/path/to/.claude-memory \
  ~/.claude/projects/$(pwd | tr '/' '-')/.claude-memory
```

The directory name is a transformed version of your project path. Note: this depends on an internal naming convention that could change. The `autoMemoryDirectory` setting is the documented, stable path. Use the symlink only if you hit edge cases where the setting isn't being read.

---

## Self-Hosted (Docker Container)

The container has no persistent home directory between rebuilds. Anything written to `~/.claude/settings.json` inside a running container survives until the next rebuild.

The fix: write `settings.json` at container startup via [`entrypoint.sh`](https://github.com/jonathanmalkin/jules/blob/main/.claude/container/entrypoint.sh). In my case, I own the full settings.json in the container (no platform hooks to preserve), so a clean write is safe here. That's different from cloud environments where you need to merge.

```bash
# entrypoint.sh — runs before anything else
mkdir -p "$HOME/.claude"
cat > "$HOME/.claude/settings.json" << 'EOF'
{
  "autoMemoryDirectory": "/home/claude/active-work/.claude-memory"
}
EOF
```

This runs every time the container starts, so the config is always fresh.

The symlink is belt-and-suspenders. Same caveat as CLI: it depends on an internal naming convention, but it's caught real failures where the setting wasn't loaded.

```bash
# Also in entrypoint.sh
MEMORY_TARGET="/home/claude/active-work/.claude-memory"
SYMLINK_PATH="$HOME/.claude/projects/$(echo "$HOME/active-work" | tr '/' '-')/memory"
mkdir -p "$(dirname "$SYMLINK_PATH")"
ln -sfn "$MEMORY_TARGET" "$SYMLINK_PATH"
```

The setting is primary. The symlink catches edge cases where Claude Code is invoked in a way that doesn't load user settings.

---

## Claude Code Web (The Hard One)

This is where I spent the most time. [Claude Code Web](https://code.claude.com/docs/en/claude-code-on-the-web) runs Claude Code in Anthropic's cloud compute. It's a different environment from the CLI or a container you control.

In my testing, I found that Claude Code Web pre-seeds `settings.json` with platform-specific hooks before your session starts. If you write your config with `cat >` or any overwrite approach, you nuke those platform hooks and things break in ways that are hard to diagnose.

A [SessionStart hook](https://code.claude.com/docs/en/hooks) merges `autoMemoryDirectory` into the existing config rather than replacing it:

```bash
#!/bin/bash
# .claude/hooks/cloud-bootstrap.sh

USER_SETTINGS="$HOME/.claude/settings.json"
PROJECT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# Create settings file if it doesn't exist
if [ ! -f "$USER_SETTINGS" ]; then
  mkdir -p "$(dirname "$USER_SETTINGS")"
  echo '{}' > "$USER_SETTINGS"
fi

# Merge autoMemoryDirectory — don't overwrite existing config
if command -v jq &>/dev/null; then
  jq --arg dir "${PROJECT_DIR}/.claude-memory" \
    '. + {"autoMemoryDirectory": $dir}' \
    "$USER_SETTINGS" > "${USER_SETTINGS}.tmp" \
    && mv "${USER_SETTINGS}.tmp" "$USER_SETTINGS"
elif command -v python3 &>/dev/null; then
  python3 - << PYEOF
import json
settings_path = "$USER_SETTINGS"
with open(settings_path, 'r') as f:
    config = json.load(f)
config['autoMemoryDirectory'] = "${PROJECT_DIR}/.claude-memory"
with open(settings_path, 'w') as f:
    json.dump(config, f, indent=2)
PYEOF
fi
```

The hook runs on every session start. Platform overwrites settings.json between sessions, so the hook re-applies the config every time.

Path gotcha: in cloud environments, `$HOME` is often `/root/` but your repo lives at `/home/user/active-work/`. `git rev-parse --show-toplevel` gets you the correct repo root regardless of what `$HOME` resolves to.

Note on the jq merge: `. + {"autoMemoryDirectory": $dir}` is a shallow merge. It preserves all existing top-level keys (including `hooks` and `permissions`) and only adds or overwrites the `autoMemoryDirectory` key. If you extend this pattern to merge nested objects, you'll need a deeper merge strategy.

Register the hook in your project-level `.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/cloud-bootstrap.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Syncing Across Environments

Memory is only useful if it's the same everywhere. I use git.

Three-way merges on structured markdown don't resolve cleanly. Two environments write different things at different times, and git's default merge creates conflicts nobody wants to resolve manually.

A custom merge driver makes the remote version always win on pull:

```bash
# .gitattributes
.claude-memory/** merge=theirs-memory
```

```bash
# Run this in each environment after cloning
git config merge.theirs-memory.name "Always accept incoming memory changes"
git config merge.theirs-memory.driver "cp %B %A"
```

`%B` is the incoming version. `%A` is the local file. The driver copies incoming over local. In practice this means when you pull, the remote version wins. Memory files are context hints, not critical data. Eventually-consistent is the right call.

The git config line needs to run on each environment after cloning. It doesn't live in `.gitattributes`. The driver is local git config, not shared config. Add it to your environment setup runbook or entrypoint script.

---

## What Breaks Without Warning

**The cat-overwrite nuke.** Writing `cat > ~/.claude/settings.json` anywhere that might run in a cloud environment will destroy platform hooks. Always merge.

**Absolute paths only.** The `~/` expansion [doesn't reliably work](https://github.com/anthropics/claude-code/issues/36636) in `autoMemoryDirectory`. Hardcode the full path everywhere.

**Silent failures.** If memory isn't loading, you won't get an error. You'll just notice Claude doesn't know things it should know. Check that `autoMemoryDirectory` is set (`cat ~/.claude/settings.json`), check that the directory exists, check that `MEMORY.md` is present and non-empty.

Each environment has a different mechanism for wiring this up. CLI uses settings.json directly. Container uses entrypoint.sh to write settings.json at startup. Claude Code Web uses a SessionStart hook to merge into settings.json. Same end state, different paths.

---

## Summary

| Environment | Config mechanism | Key gotcha |
|---|---|---|
| CLI (local) | `~/.claude/settings.json` | Absolute path only, no `~/` |
| Self-hosted (Docker) | entrypoint.sh writes settings.json + symlink fallback | Safe to overwrite here (you own the config); use merge elsewhere |
| [Claude Code Web](https://code.claude.com/docs/en/claude-code-on-the-web) | SessionStart hook merges into existing settings.json | Must merge (jq/python3), not overwrite. Re-applies every session. |
| All | git + theirs-memory merge driver | Register driver in git config on each environment separately |

Three environments, three mechanisms, one memory directory.

Happy to answer questions about any of the above or help you adapt this to your setup.

*Source: [entrypoint.sh](https://github.com/jonathanmalkin/jules/blob/main/.claude/container/entrypoint.sh) (container) | [cloud-bootstrap.sh](https://github.com/jonathanmalkin/jules/blob/main/.claude/hooks/cloud-bootstrap.sh) (cloud web) | [Full repo](https://github.com/jonathanmalkin/jules)*
