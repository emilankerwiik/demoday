#!/usr/bin/env node

import puppeteer from "puppeteer";
import { parseArgs } from "node:util";
import { resolve, dirname } from "node:path";
import { stat, unlink, mkdir } from "node:fs/promises";
import { execFileSync, execSync } from "node:child_process";

const { values: args } = parseArgs({
  options: {
    brand: { type: "string", short: "b" },
    output: { type: "string", short: "o" },
    format: { type: "string", short: "f", default: "mp4" },
    dwell: { type: "string", default: "2000" },
    fps: { type: "string", default: "30" },
    quality: { type: "string", default: "20" },
    steps: { type: "string", default: "3" },
    "base-url": { type: "string", default: "http://localhost:3000" },
    help: { type: "boolean", short: "h", default: false },
  },
  strict: true,
});

if (args.help) {
  console.log(`
  record-demo -- Record a demo walkthrough as a square MP4 or GIF.

  Captures the demo card (iframe + step description) and clicks through
  all steps using the page navigation. Output is a 1:1 square video
  optimized for posting on X (1200x1200, H.264).

  Usage:
    node scripts/record-demo.mjs [options]

  Options:
    -b, --brand <id>        Brand tab to select before recording
                            (mintlify, supabase, stripe, gmail, claude).
                            Defaults to whichever tab is already active.
    -o, --output <path>     Output file path (default: recordings/demo.<format>)
    -f, --format <mp4|gif>  Output format (default: mp4)
    --dwell <ms>            Time per step in ms (default: 2000)
    --fps <n>               Frame rate (default: 30)
    --quality <n>           CRF quality 0-63, lower is better (default: 20)
    --steps <n>             Number of steps to click through (default: 3)
    --base-url <url>        Dev server URL (default: http://localhost:3000)
    -h, --help              Show this help

  Requirements:
    - ffmpeg on PATH
    - Dev server running (npm run dev)

  Examples:
    node scripts/record-demo.mjs
    node scripts/record-demo.mjs --brand supabase
    node scripts/record-demo.mjs --brand stripe --format gif --dwell 1500
  `);
  process.exit(0);
}

const brand = args.brand;
const format = args.format;
const dwell = parseInt(args.dwell, 10);
const fps = parseInt(args.fps, 10);
const quality = parseInt(args.quality, 10);
const steps = parseInt(args.steps, 10);
const baseUrl = args["base-url"];

const ext = format === "gif" ? ".gif" : ".mp4";
const filename = brand ? `demo-${brand}` : "demo";
const output = args.output
  ? resolve(args.output)
  : resolve("recordings", `${filename}${ext}`);

const totalDuration = dwell * steps;
const SIZE = 1200;

// Pre-flight checks
if (format === "mp4") {
  try {
    execSync("ffmpeg -version", { stdio: "pipe" });
  } catch {
    console.error("Error: ffmpeg is not installed or not on PATH.");
    console.error("Install it with: brew install ffmpeg (macOS) or apt install ffmpeg (Linux)");
    console.error("ffmpeg is required to produce H.264 MP4 files for X.");
    process.exit(1);
  }
}

// Ensure output directory exists
await mkdir(dirname(output), { recursive: true });

// Check dev server is reachable
try {
  const res = await fetch(baseUrl, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
} catch (err) {
  console.error(`Error: Dev server not reachable at ${baseUrl}`);
  console.error("Start it first with: npm run dev");
  console.error(`(${err.message})`);
  process.exit(1);
}

console.log(`Recording demo (${steps} steps, ${dwell}ms each, ~${totalDuration / 1000}s total)`);
if (brand) console.log(`  Brand:  ${brand}`);
console.log(`  Output: ${output}`);
console.log(`  Format: ${format} @ ${SIZE}x${SIZE} (1:1), ${fps}fps`);
console.log();

let browser;
try {
  browser = await puppeteer.launch({
    headless: true,
    args: [`--window-size=${SIZE},${SIZE}`],
  });
} catch (err) {
  console.error("Error: Could not launch browser.");
  console.error("Make sure puppeteer is installed: npm i -D puppeteer");
  console.error(`(${err.message})`);
  process.exit(1);
}

const page = await browser.newPage();
await page.setViewport({ width: SIZE, height: SIZE });

try {
  await page.goto(baseUrl, { waitUntil: "networkidle0" });
} catch (err) {
  console.error(`Error: Could not load ${baseUrl}`);
  console.error(`(${err.message})`);
  await browser.close();
  process.exit(1);
}

try {
  await page.waitForSelector(".how-card", { timeout: 10000 });
} catch {
  console.error("Error: Could not find .how-card element on the page.");
  console.error("Make sure the demo carousel is visible at the base URL.");
  await browser.close();
  process.exit(1);
}
await sleep(500);

console.log("Page loaded.");

if (brand) {
  await page.waitForSelector(".how-brand-name", { timeout: 5000 });
  const clicked = await page.evaluate((id) => {
    const names = [...document.querySelectorAll(".how-brand-name")];
    const match = names.find((s) => s.textContent.trim().toLowerCase() === id);
    if (match) {
      match.closest("button").click();
      return true;
    }
    return false;
  }, brand.toLowerCase());
  if (clicked) {
    console.log(`  Selected brand: ${brand}`);
  } else {
    const found = await page.evaluate(() =>
      [...document.querySelectorAll(".how-brand-name")].map((s) => s.textContent.trim())
    );
    console.log(`  Warning: brand "${brand}" not found in [${found}], using default.`);
  }
  await sleep(500);
}

await page.waitForSelector(".how-dot", { timeout: 5000 });
await page.evaluate(() => {
  const dot = document.querySelector(".how-dot");
  if (dot) dot.click();
});
await sleep(300);

// Use the background image served from public/bg.jpg
const bgUrl = `${baseUrl}/bg.jpg`;

await page.evaluate((bgUrl) => {
  const card = document.querySelector(".how-card");
  if (!card) return;

  // Reparent the card: pull it out, hide everything else, rebuild layout
  card.remove();

  // Hide all body children
  for (const child of document.body.children) {
    if (child.tagName !== "SCRIPT" && child.tagName !== "STYLE") {
      child.style.display = "none";
    }
  }

  // Add card back as a direct child
  document.body.appendChild(card);

  const style = document.createElement("style");
  style.textContent = `
    html {
      background: transparent !important;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      background: url("${bgUrl}") center/cover no-repeat !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 100vh !important;
    }
    .how-card {
      position: relative !important;
      top: auto !important;
      left: auto !important;
      transform: none !important;
      max-width: 1000px !important;
      width: 76% !important;
      z-index: 99999 !important;
      margin-top: -2% !important;
    }
    .how-brands { display: none !important; }
  `;
  document.head.appendChild(style);
}, bgUrl);
await sleep(600);

// Try screencast first, fall back to screenshot-based recording
let useScreencast = true;
let recorder;

const needsReencode = format === "mp4";
const rawPath = needsReencode ? output.replace(/\.mp4$/, ".raw.webm") : output;

try {
  const screencastOptions = {
    path: rawPath,
    format: needsReencode ? "webm" : format,
    fps,
    quality,
  };

  if (format === "gif") {
    screencastOptions.colors = 128;
    screencastOptions.loop = 0;
  }

  console.log("Recording started (screencast).");
  recorder = await page.screencast(screencastOptions);
} catch (err) {
  console.warn(`screencast() failed (${err.message}), falling back to screenshot-based recording...`);
  useScreencast = false;
}

const framesDir = resolve("recordings", ".frames");
if (!useScreencast) {
  await mkdir(framesDir, { recursive: true });
  console.log("Recording started (screenshot fallback).");
}

let frameIndex = 0;

async function captureFrames(durationMs) {
  if (useScreencast) {
    await sleep(durationMs);
    return;
  }
  const interval = Math.round(1000 / fps);
  const count = Math.round(durationMs / interval);
  for (let i = 0; i < count; i++) {
    const padded = String(frameIndex++).padStart(6, "0");
    await page.screenshot({ path: resolve(framesDir, `frame-${padded}.png`) });
    await sleep(interval);
  }
}

await captureFrames(dwell);

for (let step = 2; step <= steps; step++) {
  console.log(`  Step ${step}/${steps}`);
  await page.evaluate(() => {
    const btn = document.querySelector(".how-nav-next");
    if (btn) btn.click();
  });
  await captureFrames(dwell);
}

if (useScreencast) {
  try {
    await recorder.stop();
  } catch (err) {
    console.error(`Warning: recorder.stop() failed (${err.message})`);
  }
}
console.log("Recording stopped.");

await browser.close();

if (useScreencast && needsReencode) {
  console.log("Re-encoding to H.264 for X...");
  try {
    execFileSync("ffmpeg", [
      "-y",
      "-i", rawPath,
      "-c:v", "libx264",
      "-preset", "medium",
      "-crf", String(quality),
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-an",
      output,
    ], { stdio: "pipe" });
    await unlink(rawPath);
  } catch (err) {
    console.error("Error: ffmpeg re-encoding failed.");
    console.error(err.stderr?.toString() || err.message);
    console.error(`Raw WebM kept at: ${rawPath}`);
    process.exit(1);
  }
} else if (!useScreencast) {
  console.log("Stitching frames with ffmpeg...");
  try {
    execFileSync("ffmpeg", [
      "-y",
      "-framerate", String(fps),
      "-i", resolve(framesDir, "frame-%06d.png"),
      "-c:v", "libx264",
      "-preset", "medium",
      "-crf", String(quality),
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-an",
      output,
    ], { stdio: "pipe" });
  } catch (err) {
    console.error("Error: ffmpeg frame stitching failed.");
    console.error(err.stderr?.toString() || err.message);
    console.error(`Frames kept at: ${framesDir}`);
    process.exit(1);
  }
  // Clean up frames
  const { readdir } = await import("node:fs/promises");
  const frames = await readdir(framesDir);
  for (const f of frames) await unlink(resolve(framesDir, f));
  const { rmdir } = await import("node:fs/promises");
  await rmdir(framesDir).catch(() => {});
}

let info;
try {
  info = await stat(output);
} catch {
  console.error(`Error: Output file not found at ${output}`);
  console.error("Recording may have failed silently. Check the steps above for warnings.");
  process.exit(1);
}
const sizeMB = (info.size / (1024 * 1024)).toFixed(2);
console.log();
console.log(`Done. ${output} (${sizeMB} MB)`);
console.log();
console.log("X posting checklist:");
console.log(`  Format:     ${format.toUpperCase()}${needsReencode ? " (H.264)" : ""}`);
console.log(`  Resolution: ${SIZE}x${SIZE} (1:1 square)`);
console.log(`  Duration:   ~${(totalDuration / 1000).toFixed(0)}s`);
if (format === "mp4") {
  console.log("  Ready to upload directly to X.");
} else {
  console.log("  GIF works on X, but MP4 gets better quality/compression.");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
