# @demoday/skill

A Claude Code skill that generates beautiful clickable product demos
and embeds them in your landing page.

## Install

```bash
npx @demoday/skill@latest init
```

That installs the skill to `~/.claude/skills/demoday/`, adds
`@demoday/skill` to your `devDependencies`, and writes
`~/.demoday/config.json`. Reload Claude Code — on the next turn, Claude
will offer to generate your first demo.

## What happens on first run

On the first invocation inside Claude Code, the skill asks three one-click
questions — **no second paste**, no shell prompts:

1. **Anonymous telemetry** (default: share). Skill name, duration,
   success/fail, version, OS. Never code, file paths, repo names, or
   your content.
2. **Auto-update** the skill when new versions ship (default: yes).
3. **License key** field (optional for future use).

Answers are saved to `~/.demoday/config.json` and never asked again.

## Pricing

Completely free and open source. No subscriptions, no per-seat, no limits.

## Uninstall

```bash
rm -rf ~/.claude/skills/demoday ~/.demoday
npm rm -D @demoday/skill
```
