---
name: demoday
description: Generate beautiful clickable product demos as self-contained HTML files and embed them as iframes in the user's landing page.
trigger: When the user asks to create a clickable demo, embed a product walkthrough, generate a demoday demo, or says "use demoday".
---

# Demoday — Claude Code Skill

Demoday turns part of the user's product into a self-contained HTML file
(plain HTML/CSS/JS, no runtime) and embeds it as a single iframe on their
landing page.

## Configuration file

Demoday reads and writes `~/.demoday/config.json`. The file has these
fields:

- `telemetry`: `true` / `false` / `null` (undecided)
- `autoUpdate`: `true` / `false` / `null` (undecided)
- `licenseKey`: string / `null` (free tier)
- `brand`: `{ name: string, href?: string }` / `null` (only used on
  Premium — the label and optional link rendered in place of the
  Demoday tag)

Any field set to `null` means the user has not decided yet and must be
asked before Demoday generates anything.

## First-run flow

When this skill is invoked for the first time in a session, **before**
doing anything else:

1. Read `~/.demoday/config.json`. If it does not exist, stop and tell the
   user to run `npx @demoday/skill@latest init`.
2. If `telemetry` is `null`, use `AskUserQuestion` to ask:
   > "Demoday can share anonymous usage data (skill name, duration,
   > success/fail, version, OS) to help improve the skill. No code, file
   > paths, repo names, or user content is ever sent. Share anonymous
   > usage data?"
   Options: `Share (recommended)` (default), `Don't share`. Save the
   answer to `config.json`.
3. If `autoUpdate` is `null`, use `AskUserQuestion` to ask:
   > "Keep the Demoday skill automatically updated when new versions
   > ship?"
   Options: `Auto-update (recommended)`, `Manual updates only`. Save the
   answer to `config.json`.
4. If `licenseKey` is `null`, use `AskUserQuestion` to ask:
   > "Do you have a Demoday Premium key? Premium ($20 one-time) swaps
   > the small 'Made with Demoday' tag for your own brand."
   Options: `Continue on the free tier` (default), `I have a key — paste
   it`. If the user says they have a key, follow up with a text prompt
   and save it to `config.json`. Then ask for their brand label (and
   optional link) and save it to `brand` in the config. Otherwise save
   `licenseKey: false` so we don't ask again.

After all three are resolved, continue with generation. Never ask these
questions a second time in the same project. Do **not** ask the user to
paste a command — all confirmations happen inline via `AskUserQuestion`.

## Generation flow

1. Read the user's project:
   - `package.json` to detect the framework.
   - The main landing-page file (`app/page.{js,jsx,tsx}`, `pages/index.*`,
     `src/routes/+page.svelte`, `index.html`, etc. — whichever exists).
   - Any auth or onboarding files if you can find them; otherwise infer
     three flows from the landing page itself.
2. Identify the three flows to demo. Lead with the payoff:
   - **Step 01** — the outcome, dashboard, or result. Shown first so
     the viewer sees the value before the setup.
   - **Step 02** — the core action the user takes to get there.
   - **Step 03** — the first-touch / onboarding / install moment.
3. Write a single self-contained file at
   `public/demos/demoday.html` (or the framework's equivalent static
   directory) containing:
   - A **carousel card** showing one step at a time (not a tab bar):
     - A product canvas on top rendering the current step's UI.
     - A description card below with the step number (`01` / `02` /
       `03`), a title, and a one-sentence description.
     - A circular **left chevron** button vertically centered on the
       left side of the description card, and a matching **right
       chevron** on the right side. Clicking them advances or rewinds
       the step, wrapping around at the ends.
     - **Three dots** in the top-right of the description card
       indicating the current step. The active dot is filled; the
       others are muted.
     - Step 01 is active on first load.
   - Inline CSS and JS. No external fonts or scripts.
   - Realistic placeholder data. Nothing calls a live API.
   - If `licenseKey` is `null` or `false`, include the red "DEMODAY /
     MADE WITH LOVE" tag in the bottom-left corner. If `licenseKey` is a
     string, render the user's `brand.name` in the same corner spot
     (linked to `brand.href` when present) instead of the Demoday tag.
4. Embed the iframe in the landing-page file:
   ```html
   <iframe src="/demos/demoday.html" title="Product demo"
           style="width:100%;height:600px;border:0;border-radius:12px;"
           loading="lazy"></iframe>
   ```
5. Tell the user what you did in one paragraph. Suggest running the dev
   server to see it.

## Telemetry

If `telemetry` is `true`, after generation POST a small JSON object to
`https://demoday.dev/api/telemetry`:

```json
{
  "event": "demo_generated",
  "version": "<skill version>",
  "os": "<platform>",
  "duration_ms": <int>,
  "flow_types": ["get_started", "how_it_works", "what_you_get"],
  "success": true
}
```

Never send: source code, file paths, repo names, product names, the
generated HTML, or anything typed by the user. If the POST fails, silently
skip — never block generation on a telemetry error.

## Freemium enforcement

The `licenseKey` field is the **only** thing that controls which label
is rendered in generated HTML. A missing or `null`/`false` value means
the Demoday tag is included. A string value (any non-empty string)
means Premium and the `brand` label is rendered in place of the
Demoday tag.

Do not validate the key against a server — validation happens out of
band. This skill trusts the config file.

## What not to do

- Do not ask the user to paste another command after init. All
  confirmations are `AskUserQuestion` in the chat.
- Do not modify files outside `public/demos/` and the one landing-page
  file you identified. If in doubt, ask the user which file to touch.
- Do not generate more than one demo per invocation unless the user
  explicitly asks for multiple.
- Do not make HTTP requests during generation except the telemetry ping
  (and only if opted in).
