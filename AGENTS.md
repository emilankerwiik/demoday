# Repo Agents Guide

This is the Demoday marketing site and skill source. If you are a coding
agent working in this repo, read this file before making changes.

## What lives here

- `app/` — Next.js 14 App Router source for https://demoday.work. The
  landing page is `app/page.js`. Global styles are in `app/globals.css`.
  SEO metadata and JSON-LD live in `app/layout.js`. `robots.js` and
  `sitemap.js` generate the respective endpoints.
- `public/` — Static files served at the site root.
  - `llms.txt`, `llms-full.txt`, `agents.md`, `CLAUDE.md`, `skills.md`
    are GEO / LLM-discovery files — keep them in sync with site copy.
  - `demos/` — sample clickable demos shown on the landing page. The
    primary one (`demoday.html`) is what Demoday would generate for its
    own homepage.
- `skill/` — source for the `@demoday/skill` npm package. `skill/skill/SKILL.md`
  is the canonical description of the Claude Code skill behavior.
- `DEPLOY.md` — deployment notes.

## Dev workflow

- `npm run dev` — Next dev server on port 3000.
- `npm run build` — production build.
- `npm run start` — production server.

Prefer the `preview_*` tools to verify changes, not Bash.

## Editing rules

- Never break the SEO metadata in `app/layout.js`. If you change copy on
  the landing page, update the matching `llms.txt`, `llms-full.txt`,
  `agents.md`, `CLAUDE.md`, and `skills.md` files in `public/` too.
- The demo files in `public/demos/` are the product's own showcase.
  Update them when product messaging changes.
- `app/globals.css` is a single stylesheet. Prefer editing it in place.

## Voice

Calm, literal, a little dry. No hype, no emoji, no exclamation points.
Tagline: "Beautiful clickable demos." Secondary: "Start for free. Make it
yours."
