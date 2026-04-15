#!/usr/bin/env node
/**
 * @demoday/skill init
 *
 * Non-interactive. Works with Claude Code, Cursor, and Codex:
 *   - Write the skill into ~/.claude/skills/demoday/ (Claude Code)
 *   - Write the skill into ~/.cursor/skills/demoday/ (Cursor)
 *   - Append instructions to ~/.codex/AGENTS.md (Codex CLI)
 *   - Add the package as a dev dependency in the current project.
 *   - Write ~/.demoday/config.json with undecided (null) consent flags.
 *   - Print one next line. Do NOT prompt stdin — the agent asks the user
 *     about telemetry / auto-update / license key in the chat on first run.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const argv = process.argv.slice(2);
const cmd = argv[0] || "init";
if (cmd !== "init" && cmd !== "update") {
  console.error("Usage: npx @demoday/skill@latest <init|update>");
  process.exit(1);
}

const HOME = os.homedir();
const SKILL_SRC = path.join(__dirname, "..", "skill");
const SKILL_TARGETS = [
  { dir: path.join(HOME, ".claude", "skills", "demoday"), label: "Claude Code" },
  { dir: path.join(HOME, ".cursor", "skills", "demoday"), label: "Cursor" },
];
const CODEX_HOME = process.env.CODEX_HOME || path.join(HOME, ".codex");
const CODEX_AGENTS_PATH = path.join(CODEX_HOME, "AGENTS.md");
const DEMODAY_DIR = path.join(HOME, ".demoday");
const CONFIG_PATH = path.join(DEMODAY_DIR, "config.json");
const CWD = process.cwd();

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  mkdirp(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function detectFramework(cwd) {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) return "unknown";
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    if (deps.next) return "nextjs";
    if (deps["@remix-run/react"]) return "remix";
    if (deps.astro) return "astro";
    if (deps.vite) return "vite";
    if (deps["react-scripts"]) return "cra";
    if (deps.vue || deps.nuxt) return "vue";
    if (deps.svelte) return "svelte";
  } catch (_) {}
  return "unknown";
}

function detectRepoType(cwd) {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) return "unknown";
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const name = (pkg.name || "").toLowerCase();
    const desc = (pkg.description || "").toLowerCase();
    const keywords = (pkg.keywords || []).map((k) => k.toLowerCase());
    const all = [name, desc, ...keywords].join(" ");

    const marketingSignals = [
      "landing",
      "marketing",
      "website",
      "docs",
      "blog",
      "homepage",
    ];
    const hasMarketing = marketingSignals.some((s) => all.includes(s));

    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const docTools = [
      "@docusaurus/core",
      "docusaurus",
      "vitepress",
      "gatsby",
      "hugo",
    ];
    const hasDocTool = docTools.some((d) => deps[d]);

    // Check for application signals
    const appDirs = ["src", "api", "server", "lib", "services"];
    const hasAppCode = appDirs.some((d) =>
      fs.existsSync(path.join(cwd, d))
    );

    if ((hasMarketing || hasDocTool) && !hasAppCode) return "marketing";
  } catch (_) {}
  return "app";
}

function addDevDep(cwd) {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) return false;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.devDependencies = pkg.devDependencies || {};
  if (pkg.devDependencies["@demoday/skill"]) return false;
  pkg.devDependencies["@demoday/skill"] = "^0.1.0";
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  return true;
}

const CODEX_MARKER = "<!-- demoday-skill-start -->";
const CODEX_MARKER_END = "<!-- demoday-skill-end -->";

function installCodexAgents() {
  mkdirp(CODEX_HOME);
  const skillMd = fs.readFileSync(path.join(SKILL_SRC, "SKILL.md"), "utf8");
  const body = skillMd.replace(/^---[\s\S]*?---\n*/, "");
  const block = [
    "",
    CODEX_MARKER,
    body.trim(),
    CODEX_MARKER_END,
    "",
  ].join("\n");

  if (fs.existsSync(CODEX_AGENTS_PATH)) {
    const existing = fs.readFileSync(CODEX_AGENTS_PATH, "utf8");
    if (existing.includes(CODEX_MARKER)) {
      const updated = existing.replace(
        new RegExp(CODEX_MARKER + "[\\s\\S]*?" + CODEX_MARKER_END),
        block.trim()
      );
      fs.writeFileSync(CODEX_AGENTS_PATH, updated);
      return "updated";
    }
    fs.appendFileSync(CODEX_AGENTS_PATH, block);
    return "appended";
  }
  fs.writeFileSync(CODEX_AGENTS_PATH, block.trim() + "\n");
  return "created";
}

function writeConfigIfMissing() {
  mkdirp(DEMODAY_DIR);
  if (fs.existsSync(CONFIG_PATH)) return false;
  const config = {
    version: 1,
    createdAt: new Date().toISOString(),
    telemetry: false,
    autoUpdate: null,
  };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");
  return true;
}

// ---- run ----
const isUpdate = cmd === "update";
console.log(isUpdate ? "demoday · updating skill" : "demoday · installing skill");

for (const target of SKILL_TARGETS) {
  mkdirp(path.dirname(target.dir));
  copyDir(SKILL_SRC, target.dir);
  console.log("  ✓ " + target.label + " → " + target.dir.replace(HOME, "~"));
}

const codexResult = installCodexAgents();
console.log("  ✓ Codex → " + CODEX_AGENTS_PATH.replace(HOME, "~") + " (" + codexResult + ")");

const addedDep = addDevDep(CWD);
if (addedDep) console.log("  ✓ added @demoday/skill to devDependencies");
else console.log("  · devDependency already present (or no package.json)");

const framework = detectFramework(CWD);
console.log("  · detected: " + framework);

const repoType = detectRepoType(CWD);
if (repoType === "marketing") {
  console.log("");
  console.log("  Warning: This looks like a marketing/docs site, not your main product repo.");
  console.log("  Demoday works best when run from your application repository.");
  console.log("  If your product code is in a separate repo, run init there instead.");
  console.log("");
}

const wroteCfg = writeConfigIfMissing();
console.log(
  wroteCfg
    ? "  ✓ wrote " + CONFIG_PATH.replace(HOME, "~")
    : "  · config already exists at " + CONFIG_PATH.replace(HOME, "~")
);

console.log("");
console.log("Skill installed for Claude Code, Cursor, and Codex.");
console.log("Demoday reads your code to generate demos. It never modifies your application files.");
console.log("Reload your editor, then ask the agent to generate a demo.");
