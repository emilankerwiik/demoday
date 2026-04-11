#!/usr/bin/env node
/**
 * @demoday/skill init
 *
 * Non-interactive. Works with both Claude Code and Cursor:
 *   - Write the skill into ~/.claude/skills/demoday/ (Claude Code)
 *   - Write the skill into ~/.cursor/skills/demoday/ (Cursor)
 *   - Add the package as a dev dependency in the current project.
 *   - Write ~/.demoday/config.json with undecided (null) consent flags.
 *   - Print one next line. Do NOT prompt stdin — the agent asks the user
 *     about telemetry / auto-update / license key in the chat on first run,
 *     via AskUserQuestion, per SKILL.md.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const argv = process.argv.slice(2);
const cmd = argv[0] || "init";
if (cmd !== "init") {
  console.error("Usage: npx @demoday/skill@latest init");
  process.exit(1);
}

const HOME = os.homedir();
const SKILL_SRC = path.join(__dirname, "..", "skill");
const SKILL_TARGETS = [
  { dir: path.join(HOME, ".claude", "skills", "demoday"), label: "Claude Code" },
  { dir: path.join(HOME, ".cursor", "skills", "demoday"), label: "Cursor" },
];
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

function writeConfigIfMissing() {
  mkdirp(DEMODAY_DIR);
  if (fs.existsSync(CONFIG_PATH)) return false;
  const config = {
    version: 1,
    createdAt: new Date().toISOString(),
    // All three are `null` = undecided. SKILL.md instructs the agent to
    // resolve these via AskUserQuestion on first invocation.
    telemetry: null, // will default to true on first prompt (gstack-style)
    autoUpdate: null, // opt-in at launch
    licenseKey: null, // Premium key; null = free tier, badge remains
  };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");
  return true;
}

// ---- run ----
console.log("demoday · installing skill");

for (const target of SKILL_TARGETS) {
  mkdirp(path.dirname(target.dir));
  copyDir(SKILL_SRC, target.dir);
  console.log("  ✓ " + target.label + " → " + target.dir.replace(HOME, "~"));
}

const addedDep = addDevDep(CWD);
if (addedDep) console.log("  ✓ added @demoday/skill to devDependencies");
else console.log("  · devDependency already present (or no package.json)");

const framework = detectFramework(CWD);
console.log("  · detected: " + framework);

const wroteCfg = writeConfigIfMissing();
console.log(
  wroteCfg
    ? "  ✓ wrote " + CONFIG_PATH.replace(HOME, "~")
    : "  · config already exists at " + CONFIG_PATH.replace(HOME, "~")
);

console.log("");
console.log("Skill installed for Claude Code and Cursor.");
console.log("Reload your editor, then ask the agent to generate a demo.");
