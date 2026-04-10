# Claude Guide for this Repo

> This is the Demoday marketing site and skill source. When working in
> this repo, read this file before making changes. See AGENTS.md for the
> generic agent version.

## Layout

- `app/page.js` — landing page (Next.js App Router).
- `app/globals.css` — single global stylesheet.
- `app/layout.js` — root layout with SEO metadata and JSON-LD.
- `app/robots.js`, `app/sitemap.js` — generate `/robots.txt` and
  `/sitemap.xml`.
- `public/demos/` — sample clickable demos shown on the site.
- `public/llms.txt`, `llms-full.txt`, `agents.md`, `CLAUDE.md`,
  `skills.md` — GEO / LLM-discovery files. Keep them in sync with the
  landing-page copy.
- `skill/` — source for the `@demoday/skill` npm package.

## Editing guardrails

- Keep SEO metadata intact in `app/layout.js`. If you change site copy,
  update the matching LLM-discovery files in `public/`.
- When updating the pricing, hero, or FAQ, also update `llms.txt`,
  `llms-full.txt`, and the JSON-LD blocks in `app/layout.js`.
- The demo files in `public/demos/` are the product's own showcase. Keep
  them calibrated with current messaging.

## Dev commands

- `npm run dev` — Next dev server on port 3000.
- Use `preview_*` tools (never raw Bash) to verify UI changes.

## Voice

Calm, literal, a little dry. No hype, no emoji, no exclamation points.
Tagline: "Beautiful clickable demos." Secondary: "Start for free. Make it
yours."
