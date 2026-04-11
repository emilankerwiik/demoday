#!/usr/bin/env node

import puppeteer from "puppeteer";
import { parseArgs } from "node:util";
import { resolve } from "node:path";
import { stat, unlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";

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
  optimized for posting on X (1080x1080, H.264).

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
const SIZE = 900;

console.log(`Recording demo (${steps} steps, ${dwell}ms each, ~${totalDuration / 1000}s total)`);
if (brand) console.log(`  Brand:  ${brand}`);
console.log(`  Output: ${output}`);
console.log(`  Format: ${format} @ ${SIZE}x${SIZE} (1:1), ${fps}fps`);
console.log();

const browser = await puppeteer.launch({
  headless: true,
  args: [`--window-size=${SIZE},${SIZE}`],
});

const page = await browser.newPage();
await page.setViewport({ width: SIZE, height: SIZE });
await page.goto(baseUrl, { waitUntil: "networkidle0" });
await page.waitForSelector(".how-card", { timeout: 10000 });
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

await page.evaluate(() => {
  const card = document.querySelector(".how-card");
  if (!card) return;

  const style = document.createElement("style");
  style.textContent = `
    body {
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
    }
    body * { visibility: hidden !important; }

    .how-card {
      visibility: visible !important;
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      z-index: 99999 !important;
      max-width: 580px !important;
      width: 76% !important;
    }
    .how-card * { visibility: visible !important; }
    .how-card iframe { visibility: visible !important; }
    .how-brands { display: none !important; }
  `;
  document.head.appendChild(style);
});
await sleep(600);

const needsReencode = format === "mp4";
const rawPath = needsReencode ? output.replace(/\.mp4$/, ".raw.webm") : output;

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

console.log("Recording started.");
const recorder = await page.screencast(screencastOptions);

await sleep(dwell);

for (let step = 2; step <= steps; step++) {
  console.log(`  Step ${step}/${steps}`);
  await page.evaluate(() => {
    const btn = document.querySelector(".how-nav-next");
    if (btn) btn.click();
  });
  await sleep(dwell);
}

await recorder.stop();
console.log("Recording stopped.");

await browser.close();

if (needsReencode) {
  console.log("Re-encoding to H.264 for X...");
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
}

const info = await stat(output);
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
