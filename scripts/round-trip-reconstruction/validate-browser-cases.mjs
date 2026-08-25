#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import pw from '/home/dev/.codex/worktrees/events-bot-new/round-trip-astro-candidate-20260824/site/node_modules/playwright/index.js';

const { chromium } = pw;
const root = process.env.ROUND_TRIP_ASTRO_ORIGIN ?? 'http://127.0.0.1:4322';
const bindingsPath = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const outPath = 'evidence/round-trip-reconstruction/v1/astro-validation/browser-cases.v1.json';
const bindings = JSON.parse(readFileSync(bindingsPath, 'utf8'));
const sha256 = value => createHash('sha256').update(value).digest('hex');
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const cases = [];

try {
  for (const item of bindings.cases) {
    const width = Math.round(item.width);
    const height = Math.round(item.height);
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(String(error.message || error)));
    const url = new URL(item.astro.route, root).href;
    const started = Date.now();
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
    await page.waitForTimeout(250);
    const selector = item.astro.capture?.selector ?? null;
    const target = selector ? await page.locator(selector).first().evaluate(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        present: true,
        visible: style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
      };
    }).catch(() => ({ present: false, visible: false, rect: null })) : null;
    const runtime = await page.evaluate(() => ({
      title: document.title,
      ready_state: document.readyState,
      document_width: document.documentElement.scrollWidth,
      document_height: document.documentElement.scrollHeight,
      body_children: document.body?.children.length ?? 0
    }));
    cases.push({
      case_id: item.case_id,
      route: item.astro.route,
      url,
      viewport: { width, height },
      status: response?.status() ?? null,
      ok: Boolean(response?.ok()) && runtime.body_children > 0 && pageErrors.length === 0 && (!selector || target?.present && target.visible && target.rect.width > 0 && target.rect.height > 0),
      elapsed_ms: Date.now() - started,
      selector,
      target,
      runtime,
      page_errors: pageErrors
    });
    await page.close();
  }
} finally {
  await browser.close();
}

const receipt = {
  schema_version: 'round-trip-reconstruction.browser-cases.v1',
  captured_at: new Date().toISOString(),
  astro_commit: bindings.authority.astro_commit,
  design_system_commit: bindings.authority.design_system_commit,
  origin: root,
  expected_cases: bindings.cases.length,
  passed_cases: cases.filter(item => item.ok).length,
  failed_cases: cases.filter(item => !item.ok).map(item => item.case_id),
  cases
};
const bytes = `${JSON.stringify(receipt, null, 2)}\n`;
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, bytes);
console.log(`${outPath}: ${sha256(bytes)} (${receipt.passed_cases}/${receipt.expected_cases})`);
if (receipt.failed_cases.length) process.exitCode = 1;
