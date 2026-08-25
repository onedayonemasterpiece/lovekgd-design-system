#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const bindingsPath = process.env.ROUND_TRIP_BINDINGS ?? 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const outputDir = process.env.ROUND_TRIP_ASTRO_EVIDENCE ?? 'evidence/round-trip-reconstruction/v1/astro';
const origin = process.env.ROUND_TRIP_ASTRO_ORIGIN ?? 'http://127.0.0.1:4322';
const siteRoot = process.env.EVENTS_BOT_SITE_ROOT ?? '/home/dev/.codex/worktrees/events-bot-new/round-trip-astro-candidate-20260824/site';
const playwrightModule = await import(pathToFileURL(join(siteRoot, 'node_modules/playwright/index.js')).href);
const { chromium } = playwrightModule.default ?? playwrightModule;
const bindings = JSON.parse(readFileSync(join(ROOT, bindingsPath), 'utf8'));
const selected = new Set(String(process.env.ROUND_TRIP_CASES ?? '').split(',').map(value => value.trim()).filter(Boolean));
const sha256 = value => createHash('sha256').update(value).digest('hex');
const results = [];
mkdirSync(join(ROOT, outputDir), { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  for (const item of bindings.cases.filter(item => selected.size === 0 || selected.has(item.case_id))) {
    const context = await browser.newContext({ viewport: { width: Math.round(item.width), height: Math.round(item.height) }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const response = await page.goto(new URL(item.astro.route, origin).href, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(async () => document.fonts?.ready);
    await page.waitForTimeout(250);
    const file = `${item.case_id}.png`;
    const path = join(ROOT, outputDir, file);
    const capture = item.astro.capture ?? { mode: 'viewport', full_page: false };
    let sourceGeometry = null;
    if (capture.mode === 'viewport') {
      await page.screenshot({ path, fullPage: capture.full_page === true, animations: 'disabled' });
    } else {
      // Component-only receipts must not contain fixed shell chrome that visually
      // overlaps the element at capture time.
      await page.addStyleTag({ content: '.site-header,.mobile-bottom-nav{display:none!important}' });
      const locator = page.locator(capture.selector);
      await locator.waitFor({ state: 'visible', timeout: 30000 });
      sourceGeometry = await locator.boundingBox();
      const temporary = `${path}.element.png`;
      await locator.screenshot({ path: temporary, animations: 'disabled' });
      if (capture.mode === 'element_on_canvas') {
        execFileSync('magick', [
          '-size', `${capture.canvas.width}x${capture.canvas.height}`,
          `canvas:${capture.canvas.background}`,
          temporary,
          '-geometry', `+${capture.offset.x}+${capture.offset.y}`,
          '-composite', path
        ]);
      } else {
        execFileSync('mv', [temporary, path]);
      }
      if (capture.mode === 'element_on_canvas') execFileSync('rm', ['-f', temporary]);
    }
    const buffer = readFileSync(path);
    const computed = await page.evaluate(() => ({
      title: document.title,
      body: {
        scrollWidth: document.body.scrollWidth,
        scrollHeight: document.body.scrollHeight,
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        color: getComputedStyle(document.body).color,
        fontFamily: getComputedStyle(document.body).fontFamily
      },
      documentElement: {
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight
      }
    }));
    results.push({
      case_id: item.case_id,
      route: item.astro.route,
      requested_url: new URL(item.astro.route, origin).href,
      final_url: page.url(),
      status: response?.status() ?? null,
      viewport: { width: item.width, height: item.height },
      capture,
      source_geometry: sourceGeometry,
      screenshot: { path: `${outputDir}/${file}`, sha256: sha256(buffer), bytes: buffer.length },
      computed
    });
    await context.close();
    console.log(`${item.case_id}: ${response?.status()} ${buffer.length} bytes`);
  }
} finally {
  await browser.close();
}

const manifestPath = join(ROOT, outputDir, 'manifest.v1.json');
let finalResults = results;
if (selected.size > 0 && existsSync(manifestPath)) {
  const previous = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const currentById = new Map(results.map(item => [item.case_id, item]));
  finalResults = previous.cases.map(item => currentById.get(item.case_id) ?? item);
  for (const item of results) if (!previous.cases.some(previousItem => previousItem.case_id === item.case_id)) finalResults.push(item);
}
const manifest = {
  schema_version: 'round-trip-reconstruction.astro-captures.v1',
  authority: bindings.authority,
  bindings_sha256: sha256(readFileSync(join(ROOT, bindingsPath))),
  origin,
  cases: finalResults
};
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${manifestPath}: ${sha256(readFileSync(manifestPath))}`);
