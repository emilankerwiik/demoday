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

After both are resolved, continue with generation. Never ask these
questions a second time in the same project. Do **not** ask the user to
paste a command — all confirmations happen inline via `AskUserQuestion`.

## Generation flow

1. **Study the product navigation.** Before writing any HTML, map the
   user's top-level navigation structure:
   - Read route files (`app/` directory, `pages/`, `src/routes/`, etc.)
     to discover every major section the product has.
   - Read layout files, sidebar components, and nav menus to understand
     the real labels the product uses (e.g. "Table Editor", "SQL Editor",
     "Authentication" for a database product).
   - For each section, read its primary page to understand the kind of
     content it shows (data tables, charts, forms, editors, etc.).
   - The demo must reproduce this navigation faithfully — it is the
     single most important quality signal.

2. **Extract brand identity.** Before generating any HTML, read the
   user's brand colors, logo, and typography so the demo matches their
   product:
   - **Colors** — check, in order: Tailwind config
     (`tailwind.config.{js,ts,mjs}` — look for `theme.extend.colors`),
     CSS custom properties in global stylesheets
     (`globals.css`, `global.css`, `app.css`, `index.css`,
     `variables.css`, `:root` blocks), `theme.json` / `tokens.json`,
     shadcn `components.json`, or any `DESIGN.md`. Extract the primary
     brand color, secondary color, background, surface, border, text,
     and muted text values.
   - **Logo** — look for SVG logos in layout/header components, navbar
     files, or `public/` (`logo.svg`, `favicon.svg`, brand marks). If
     the logo is an SVG, inline it in the demo. If it is a raster image
     (`png`, `ico`), reference the path but do not base64-encode large
     files — use a simple text fallback with the product name instead.
   - **Typography** — note the font stack from CSS or Tailwind config.
     Do not load external fonts (the demo must be self-contained), but
     use the same `font-family` declaration so system fonts match.
   - Map the extracted values to CSS custom properties in the demo's
     `:root` block (e.g. `--brand`, `--bg`, `--text`, `--border`,
     `--muted`). Every UI element in the demo must use these variables
     so the output feels like the user's actual product.

3. **Read the user's project:**
   - `package.json` to detect the framework.
   - The main landing-page file (`app/page.{js,jsx,tsx}`, `pages/index.*`,
     `src/routes/+page.svelte`, `index.html`, etc. — whichever exists).

4. **Identify the three steps to demo.** Lead with the payoff:
   - **Step 01** — the outcome, dashboard, or result. Shown first so
     the viewer sees the value before the setup.
   - **Step 02** — the core action the user takes to get there.
   - **Step 03** — the first-touch / onboarding / install moment.
   - Each step maps to one of the navigation sections discovered in
     step 1 (e.g., step 1 = Dashboard, step 2 = Payments, step 3 =
     Customers for a payments product).

5. **Write a single self-contained file** at `public/demos/demoday.html`
   (or the framework's equivalent static directory) containing:

   **Outer shell — boxed card with step descriptions:**

   The entire demo must render as a floating card, not a full-bleed
   viewport. This means the standalone preview at
   `localhost:3000/demos/<file>.html` looks the same as the final
   embedded version on the landing page. Structure:

   ```
   ┌─ .demo-shell (full viewport, neutral bg, centers the card) ──┐
   │  ┌─ .demo-card (rounded corners, border, overflow:hidden) ──┐│
   │  │  ┌─ .demo-canvas (product UI, 4:3 aspect ratio) ────────┐││
   │  │  │  sidebar / nav + content area                         │││
   │  │  └───────────────────────────────────────────────────────┘││
   │  │  ┌─ .demo-steps (white bg, step descriptions) ──────────┐││
   │  │  │  ‹  01 · Title · Description                    ● ○ ○│││
   │  │  └───────────────────────────────────────────────────────┘││
   │  └──────────────────────────────────────────────────────────┘│
   └──────────────────────────────────────────────────────────────┘
   ```

   - `.demo-shell`: `width:100%; height:100vh; display:flex;
     align-items:center; justify-content:center;
     background:#f5f5f5; padding:20px;`. On embedded (iframe) usage,
     the neutral bg and padding give the card visual breathing room.
   - `.demo-card`: `max-width:640px; width:100%; border-radius:16px;
     border:1px solid #e5e5e5; overflow:hidden; background:#fff;
     box-shadow:0 1px 3px rgba(0,0,0,0.04);`. Contains both the
     canvas and the step bar.
   - `.demo-canvas`: `aspect-ratio:4/3; overflow:hidden; position:relative;`.
     This is where the product UI lives (sidebar, nav, content). It
     fills the full width of the card.
   - `.demo-steps`: sits below the canvas inside the card. White
     background, horizontal padding. Contains:
     - A circular **left chevron** button vertically centered on the
       left side, and a matching **right chevron** on the right side.
       Clicking them advances or rewinds the step, wrapping at ends.
     - The step **number** (`01` / `02` / `03`) in a large, light
       serif or sans-serif font (24–30px, muted color).
     - The step **title** in a bold 18–22px font.
     - A one-sentence **description** in 12–13px muted text.
     - **Three dots** in the top-right of the step area. The active
       dot is filled dark; the others are light/muted.
   - Step 01 is active on first load.

   **Product canvas — interactive navigation:**
   - The product canvas (`.demo-canvas`) must include the real
     sidebar or nav bar from the product (same labels, same icons,
     same order).
   - Clicking any nav item swaps the main content area to show that
     section's content. This works independently of the 3 steps.
   - Use a data-driven `render()` pattern: a JavaScript object maps
     each nav ID to a function returning that section's HTML. A single
     `render()` function rebuilds the content area. Click handlers on
     nav items update the active state and call `render()`.
   - Each section must show realistic, representative content — data
     tables, code editors, metric cards, form layouts, etc. — not
     placeholder "Coming soon" screens.

   **Step messaging — support parent-driven step switching:**
   - Listen for `window.addEventListener("message", ...)` with
     `{ type: "setStep", step: N }` where N is 1, 2, or 3.
   - When a step message arrives, switch to the nav section that
     corresponds to that step and call `render()`.
   - Also read `?step=N` from the URL query string on initial load.

   **Canonical CSS template — copy verbatim, then change colors:**

   The CSS below is the exact, tested Demoday stylesheet. Copy it
   into every generated demo **as-is**. The only things you change
   are the color values in `:root` (map them to the user's brand)
   and you may add product-specific classes after the template.
   **Do not change font sizes, paddings, widths, or border-radii.**

   ```css
   :root{
     --bg:#0f1117;            /* page background          — replace */
     --bg-sidebar:#0a0c10;    /* sidebar background       — replace */
     --bg-card:#181b22;       /* card / elevated surface  — replace */
     --border:#1e2029;        /* borders, dividers        — replace */
     --text:#e4e4e7;          /* primary text              — replace */
     --muted:#71717a;         /* secondary text            — replace */
     --faint:#52525b;         /* tertiary / placeholders   — replace */
     --brand:#3dd68c;         /* primary brand color       — replace */
     --brand-dim:rgba(61,214,140,.1); /* brand at ~10% — replace */
     --font:-apple-system,BlinkMacSystemFont,"Inter","Segoe UI",
            Roboto,Helvetica,Arial,sans-serif;
     --mono:"JetBrains Mono","SF Mono",ui-monospace,Menlo,
            Consolas,monospace
   }
   *{box-sizing:border-box;margin:0;padding:0}
   html,body{
     height:100vh;overflow:hidden;font-family:var(--font);
     font-size:10.5px;color:var(--text);background:var(--bg);
     -webkit-font-smoothing:antialiased
   }

   /* ---- layout ---- */
   .app{display:flex;height:100vh}
   .side{
     width:100px;min-width:100px;flex-shrink:0;
     background:var(--bg-sidebar);border-right:1px solid var(--border);
     display:flex;flex-direction:column;overflow-y:auto;padding:8px 6px
   }
   .main{flex:1;display:flex;flex-direction:column;overflow:hidden}

   /* ---- sidebar ---- */
   .logo{
     padding:8px 8px 10px;display:flex;align-items:center;
     gap:6px;font-size:10px;font-weight:600
   }
   .logo-icon{
     width:16px;height:16px;border-radius:3px;
     display:flex;align-items:center;justify-content:center
   }
   .sec-label{
     font-size:8px;text-transform:uppercase;letter-spacing:.06em;
     color:var(--faint);padding:8px 8px 4px;font-weight:500
   }
   .nav{
     display:flex;align-items:center;gap:7px;padding:5px 8px;
     border-radius:5px;color:var(--muted);font-size:9.5px;
     cursor:pointer;transition:all .1s;user-select:none
   }
   .nav:hover{background:var(--bg-card);color:var(--text)}
   .nav.active{background:var(--brand-dim);color:var(--brand)}
   .nav svg{width:14px;height:14px;flex-shrink:0}
   .nav .dot{
     width:3px;height:3px;border-radius:50%;
     background:currentColor;opacity:.4;flex-shrink:0
   }
   .nav.active .dot{opacity:1;background:var(--brand)}

   /* ---- topbar ---- */
   .topbar{
     height:26px;border-bottom:1px solid var(--border);
     display:flex;align-items:center;justify-content:space-between;
     padding:0 10px;background:var(--bg)
   }
   .search{
     display:flex;align-items:center;gap:4px;
     background:var(--bg-card);border:1px solid var(--border);
     border-radius:4px;padding:2px 8px;font-size:9px;
     color:var(--muted);width:140px
   }
   .search kbd{
     font-family:var(--font);font-size:7px;background:var(--bg);
     border:1px solid var(--border);border-radius:2px;
     padding:0 3px;color:var(--faint);margin-left:auto
   }

   /* ---- content ---- */
   .content{flex:1;overflow-y:auto;padding:14px 16px}
   .crumb{
     font-size:9px;color:var(--faint);margin-bottom:12px;
     display:flex;align-items:center;gap:4px
   }
   .crumb a{color:var(--muted);text-decoration:none}
   h1{font-size:18px;font-weight:700;letter-spacing:-.02em;
      margin-bottom:4px;line-height:1.2}
   .desc{color:var(--muted);font-size:11px;line-height:1.5;
         margin-bottom:14px}
   h2{font-size:13px;font-weight:600;letter-spacing:-.01em;
      margin:16px 0 6px;padding-top:10px;
      border-top:1px solid var(--border)}
   p{color:var(--muted);font-size:10px;line-height:1.6;
     margin-bottom:8px}

   /* ---- code ---- */
   .code{
     background:var(--bg-sidebar);border:1px solid var(--border);
     border-radius:5px;padding:8px 10px;font-family:var(--mono);
     font-size:9px;line-height:1.6;overflow-x:auto;
     margin-bottom:10px;position:relative
   }
   .code .copy{
     position:absolute;top:5px;right:5px;background:var(--bg-card);
     border:1px solid var(--border);border-radius:3px;
     padding:2px 5px;font-size:7px;color:var(--muted);
     cursor:pointer;font-family:var(--font)
   }
   code{
     font-family:var(--mono);font-size:9px;background:var(--bg-card);
     border:1px solid var(--border);border-radius:3px;
     padding:1px 4px;color:var(--brand)
   }

   /* ---- callout ---- */
   .callout{
     background:var(--brand-dim);
     border:1px solid color-mix(in srgb,var(--brand) 18%,transparent);
     border-radius:5px;padding:7px 10px;margin-bottom:10px;
     display:flex;gap:6px;font-size:9.5px;line-height:1.5;
     color:var(--text)
   }
   .callout-icon{color:var(--brand);flex-shrink:0;font-size:12px}

   /* ---- tables ---- */
   table{width:100%;border-collapse:collapse;font-size:9px}
   th{text-align:left;padding:4px 8px;
      background:rgba(255,255,255,.02);
      border-bottom:1px solid var(--border);
      color:var(--muted);font-weight:500;font-size:8px}
   td{padding:4px 8px;border-bottom:1px solid var(--border)}
   table code{font-size:8px}

   /* ---- cards / badges ---- */
   .card{
     background:var(--bg-card);border:1px solid var(--border);
     border-radius:5px;padding:8px 10px;margin-bottom:6px
   }
   .card-name{font-weight:600;font-size:10px;margin-bottom:3px}
   .card-detail{font-size:9px;color:var(--muted);line-height:1.5}
   .badge{
     display:inline-flex;padding:1px 5px;border-radius:3px;
     font-size:8px;font-weight:600;font-family:var(--mono)
   }
   .btn{
     padding:4px 10px;border-radius:5px;font-size:9px;
     font-weight:600;border:none;cursor:pointer;
     font-family:var(--font)
   }

   /* ---- stat metrics ---- */
   .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;
          margin-bottom:12px}
   .stat{background:var(--bg-card);border:1px solid var(--border);
         border-radius:5px;padding:8px 10px}
   .stat-label{font-size:8px;color:var(--muted);
               text-transform:uppercase;letter-spacing:.04em;
               margin-bottom:2px}
   .stat-value{font-size:16px;font-weight:600;
               letter-spacing:-.01em}

   /* ---- demoday tag ---- */
   .demoday-tag{
     position:fixed;bottom:10px;left:12px;font-size:9px;
     letter-spacing:.12em;text-transform:uppercase;
     color:rgba(255,255,255,.22);font-family:var(--font);
     pointer-events:none
   }
   ```

   For light-background demos, change `.demoday-tag` color to
   `rgba(0,0,0,0.18)`.

   **Sidebar rules — common mistakes to avoid:**
   - NEVER set sidebar width below `100px`.
   - NEVER apply `overflow:hidden`, `text-overflow:ellipsis`, or
     `white-space:nowrap` to nav items. Labels must be fully visible.
   - NEVER invent your own font sizes. Use the template values.
   - If the product has long nav labels (e.g. "API References" is
     fine at 100px, but "Advanced Configuration" needs ~110px),
     increase `.side { width }` until all labels fit on one line.
   - The sidebar must use `flex-shrink:0` and `min-width` equal to
     its width so it never collapses when the card is narrow.

   **Other requirements:**
   - Inline CSS and JS. No external fonts or scripts.
   - Realistic placeholder data. Nothing calls a live API.

6. **Preview the demo.** Before touching the landing page:
   - Start the dev server if it is not already running (e.g.
     `npm run dev`).
   - Open the generated file in the browser at
     `http://localhost:3000/demos/<filename>.html` (or the correct port
     for the framework) using the browse / browser tools so the user
     can see it.
   - Tell the user the demo is ready for preview.

7. **Ask the user what to do next.** Use `AskUserQuestion`:
   > "The demo is ready. What would you like to do?"
   Options:
   - `Ship to landing page` — embed the iframe in the landing-page
     file identified in step 2.
   - `Replace an existing demo` — list the HTML files already in
     `public/demos/`, ask the user which one to replace, then swap
     the iframe `src` on the landing page to point to the new file.
   - `Make edits` — ask the user what they want changed, edit or
     regenerate the HTML file, then loop back to step 5 (preview
     again).

   When embedding, use:
   ```html
   <iframe src="/demos/<filename>.html" title="Product demo"
           style="width:100%;height:600px;border:0;border-radius:12px;"
           loading="lazy"></iframe>
   ```

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

## What not to do

- Do not ask the user to paste another command after init. All
  confirmations are `AskUserQuestion` in the chat.
- Do not modify files outside `public/demos/` and the one landing-page
  file you identified. If in doubt, ask the user which file to touch.
- Do not generate more than one demo per invocation unless the user
  explicitly asks for multiple.
- Do not make HTTP requests during generation except the telemetry ping
  (and only if opted in).
