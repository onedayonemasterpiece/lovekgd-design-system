#!/usr/bin/env node
// Deterministic, local-only renderer for the three owner-decision boards.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

// The central host installation is the renderer authority. Do not inherit a
// project/user cache that may point at a different browser revision.
process.env.PLAYWRIGHT_BROWSERS_PATH = "/opt/ms-playwright";
const require = createRequire(import.meta.url);
const { chromium } = require("/opt/nodejs/lib/node_modules/playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const pack = path.resolve(here, "..");
const indexPath = path.join(pack, "index.html");
const expected = [
  "decision.EM-CENSUS-001",
  "decision.EM-GOV-010",
  "decision.EM-LABRAIL-011",
];

function usage() {
  console.error("usage: node scripts/render.mjs --output-dir <new-or-empty-directory>");
  process.exit(2);
}

const marker = process.argv.indexOf("--output-dir");
if (marker === -1 || !process.argv[marker + 1]) usage();
const outputDir = path.resolve(process.argv[marker + 1]);
if (fs.existsSync(outputDir) && fs.readdirSync(outputDir).length !== 0) {
  throw new Error(`refusing to clear or overwrite non-empty output directory: ${outputDir}`);
}
fs.mkdirSync(outputDir, { recursive: true });

const requests = [];
const failures = [];
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    locale: "en-US",
    timezoneId: "UTC",
    colorScheme: "light",
    reducedMotion: "reduce",
    forcedColors: "none",
    serviceWorkers: "block",
    javaScriptEnabled: true,
  });
  await context.addInitScript(() => {
    const fixedNow = 1786320000000;
    Date.now = () => fixedNow;
    Math.random = () => 0.125;
    window.requestAnimationFrame = callback => window.setTimeout(() => callback(0), 0);
  });
  const page = await context.newPage();
  page.on("request", request => requests.push(request.url()));
  page.on("requestfailed", request => failures.push(`${request.url()} :: ${request.failure()?.errorText}`));
  await page.route("**/*", async route => {
    const url = route.request().url();
    if (url.startsWith("file:") || url.startsWith("data:")) await route.continue();
    else await route.abort("blockedbyclient");
  });
  await page.goto(pathToFileURL(indexPath).href, { waitUntil: "load" });
  await page.waitForFunction(() => document.documentElement.dataset.renderReady === "true");
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => image.decode()));
    const bad = [...document.images].filter(image => image.naturalWidth === 0);
    if (bad.length) throw new Error(`undecoded local images: ${bad.map(image => image.src).join(", ")}`);
  });

  const observedIds = await page.locator(".decision-board").evaluateAll(nodes => nodes.map(node => node.id));
  if (JSON.stringify(observedIds) !== JSON.stringify(expected)) {
    throw new Error(`decision board identity/order mismatch: ${JSON.stringify(observedIds)}`);
  }
  const optionContracts = await page.locator(".option").evaluateAll(nodes => nodes.map(node => ({
    decision: node.closest(".decision-board")?.id,
    option: node.dataset.optionId,
    fixtureCount: node.dataset.fixtureCount,
    fixtureSetSha256: node.dataset.fixtureSetSha256,
    viewports: node.dataset.viewports,
    desktopFrames: node.querySelectorAll(".mini-frame.desktop").length,
    mobileFrames: node.querySelectorAll(".mini-frame.mobile").length,
    miniFixtureIds: [...node.querySelectorAll(".mini-frame")].map(frame => frame.dataset.fixtureIds),
    miniFixtureSetSha256: [...node.querySelectorAll(".mini-frame")].map(frame => frame.dataset.fixtureSetSha256),
  })));
  if (optionContracts.length !== 9) throw new Error(`expected 9 option regions, got ${optionContracts.length}`);
  const fixtureSets = new Set(optionContracts.map(row => `${row.fixtureCount}:${row.fixtureSetSha256}:${row.viewports}`));
  if (fixtureSets.size !== 1) throw new Error("options do not share one exact fixture/state/viewport contract");
  const expectedFixtureIds = [
    "fixture.photo-landscape-3x2-focal-safe-cover",
    "fixture.photo-portrait-4x5-derived-cover",
    "fixture.photo-reviewed-5x4-cover",
    "fixture.photo-2x3-container-contain",
    "fixture.poster-ocr-square-1x1-contain",
    "fixture.poster-ocr-intrinsic-contain",
    "fixture.unknown-text-contain",
    "fixture.mixed-primary-previews",
    "fixture.poster-companion",
    "fixture.state-missing",
    "fixture.state-broken",
    "fixture.state-tiny",
    "fixture.state-skeleton-reservation",
  ];
  for (const row of optionContracts) {
    if (row.desktopFrames !== 1 || row.mobileFrames !== 1) {
      throw new Error(`option lacks exactly one desktop and one mobile frame: ${JSON.stringify(row)}`);
    }
    if (row.miniFixtureIds.some(value => value !== expectedFixtureIds.join(" "))) {
      throw new Error(`option mini-frame fixture order mismatch: ${JSON.stringify(row)}`);
    }
    if (row.miniFixtureSetSha256.some(value => value !== row.fixtureSetSha256)) {
      throw new Error(`option mini-frame fixture hash mismatch: ${JSON.stringify(row)}`);
    }
  }
  const atlasByBoard = await page.locator(".decision-board").evaluateAll(nodes => nodes.map(node => ({
    id: node.id,
    fixtureIds: [...node.querySelectorAll(".fixture-atlas .fixture")].map(fixture => fixture.dataset.fixtureId),
  })));
  for (const row of atlasByBoard) {
    if (JSON.stringify(row.fixtureIds) !== JSON.stringify(expectedFixtureIds)) {
      throw new Error(`fixture atlas mismatch for ${row.id}: ${JSON.stringify(row.fixtureIds)}`);
    }
  }

  const outputs = [];
  for (const id of expected) {
    // Decision IDs contain literal dots, so bind through an attribute selector
    // rather than treating the dots as CSS class separators.
    const board = page.locator(`[id="${id}"]`);
    const box = await board.boundingBox();
    if (!box || Math.round(box.width) !== 1920 || box.height < 2500) {
      throw new Error(`unexpected board geometry for ${id}: ${JSON.stringify(box)}`);
    }
    const outputPath = path.join(outputDir, `${id}.png`);
    await board.screenshot({
      path: outputPath,
      animations: "disabled",
      caret: "hide",
      scale: "css",
      timeout: 60_000,
    });
    const bytes = fs.readFileSync(outputPath);
    outputs.push({
      path: outputPath,
      bytes: bytes.length,
      sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
      css_width: Math.round(box.width),
      css_height: Math.round(box.height),
    });
  }
  const nonLocal = requests.filter(url => !url.startsWith("file:") && !url.startsWith("data:"));
  if (nonLocal.length) throw new Error(`network requests observed: ${JSON.stringify(nonLocal)}`);
  if (failures.length) throw new Error(`request failures observed: ${JSON.stringify(failures)}`);
  console.log(JSON.stringify({
    browser: `Chromium ${browser.version()}`,
    option_regions: optionContracts.length,
    playwright: require("/opt/nodejs/lib/node_modules/playwright/package.json").version,
    requests: requests.length,
    network_requests: nonLocal.length,
    outputs,
  }));
  await context.close();
} finally {
  await browser.close();
}
