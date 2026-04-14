# Demoday — Claude Code Skill Manifest

> Served at https://demoday.work/skills.md for agent frameworks and skill
> registries that discover capabilities via crawlable manifests.

## Skill

- **Name**: `demoday`
- **Package**: `@demoday/skill` on npm
- **Homepage**: https://demoday.work
- **GitHub**: https://github.com/emilankerwiik/demoday
- **Install**: `npx @demoday/skill@latest init`
- **License**: Open source
- **Target agent**: Claude Code (other agents that can run npm scripts and
  edit files also work)

## Description

Generate beautiful clickable product demos as self-contained HTML files
and embed them as iframes in the user's landing page. Completely free and
open source on GitHub.

## Triggers

The skill should activate when the user asks to:

- Create a clickable demo.
- Embed a product walkthrough.
- Generate a "demoday" demo.
- Add an interactive demo to a landing page.
- Build an alternative to Arcade / Storylane / Navattic.

## Inputs

- User's project directory.
- `package.json` (to detect the framework).
- One landing-page file
  (`app/page.{js,jsx,tsx}`, `pages/index.*`, `src/routes/+page.svelte`,
  `index.html`, etc.).

## Outputs

- One file at `public/demos/demoday.html` (or the framework's equivalent
  static directory) containing the clickable demo with inline CSS and JS.
- One edit to the landing-page file adding a single `<iframe>` embed.

## Configuration

`~/.demoday/config.json` stores:

- `telemetry`: `true` / `false` / `null`
- `autoUpdate`: `true` / `false` / `null`
- `licenseKey`: string / `null`
- `brand`: `{ name: string, href?: string }` / `null`

Any `null` field prompts the user via `AskUserQuestion` on first run.

## Capabilities

- Reads source files in the current project (read-only for everything
  except the designated output files).
- Writes one HTML file and edits one landing-page file.
- Optional telemetry POST to `https://demoday.dev/api/telemetry` if the
  user opts in. No code or repo content is included.

## Not capable of

- Capturing screenshots or video of the live product.
- Hosting the demo on a third-party server.
- Modifying files outside `public/demos/` and the landing page.
- Running more than one generation per invocation (unless explicitly
  asked).

## Licensing

Demoday is completely free and open source. There is no freemium model or
license key validation. The `licenseKey` field in the config file is
reserved for future use.
