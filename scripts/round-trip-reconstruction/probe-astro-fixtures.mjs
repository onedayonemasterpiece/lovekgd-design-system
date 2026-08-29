#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const bindingsPath = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const outputPath = 'catalog/round-trip-reconstruction/v1/astro-observed-fixtures.v1.json';
const origin = process.env.ROUND_TRIP_ASTRO_ORIGIN ?? 'http://127.0.0.1:4322';
const siteRoot = process.env.EVENTS_BOT_SITE_ROOT ?? '/home/dev/.codex/worktrees/events-bot-new/round-trip-astro-candidate-20260824/site';
const playwrightModule = await import(pathToFileURL(join(siteRoot, 'node_modules/playwright/index.js')).href);
const { chromium } = playwrightModule.default ?? playwrightModule;
const bindings = JSON.parse(readFileSync(bindingsPath, 'utf8'));
const sha256 = value => createHash('sha256').update(value).digest('hex');
const results = [];

const browser = await chromium.launch({ headless: true });
try {
  for (const archetype of bindings.archetypes) {
    const item = archetype.boards.find(board => board.viewport === 'desktop');
    const context = await browser.newContext({ viewport: { width: item.width, height: Math.max(item.height, 1200) }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const response = await page.goto(new URL(item.astro.route, origin).href, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(async () => document.fonts?.ready);
    const observation = await page.evaluate(() => {
      const visible = element => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      };
      const eventFrom = element => {
        const article = element.closest('[data-event-id]') || element;
        const image = article.querySelector('img');
        const titleNode = article.querySelector('h1,h2,h3,[data-event-title]');
        return {
          event_id: article.getAttribute('data-event-id'),
          event_title: article.getAttribute('data-event-title') || titleNode?.textContent?.trim() || null,
          image_url: image?.currentSrc || image?.src || null,
          image_alt: image?.getAttribute('alt') || null,
          text: article.textContent?.replace(/\s+/gu, ' ').trim().slice(0, 500) || null
        };
      };
      const events = [];
      for (const element of document.querySelectorAll('[data-event-id]')) {
        if (!visible(element)) continue;
        const event = eventFrom(element);
        if (!event.event_id || events.some(item => item.event_id === event.event_id)) continue;
        events.push(event);
      }
      const popularGroups = Array.from(document.querySelectorAll('[data-popular-behavior-group]')).filter(visible).map(group => ({
        reason: group.getAttribute('data-popular-reason'),
        title: group.querySelector('h2')?.textContent?.trim() || null,
        events: Array.from(group.querySelectorAll('[data-event-id]')).filter(visible).map(eventFrom).filter((event, index, all) => event.event_id && all.findIndex(other => other.event_id === event.event_id) === index)
      }));
      return {
        title: document.title,
        body_data: Object.fromEntries(Array.from(document.body.attributes).filter(attr => attr.name.startsWith('data-')).map(attr => [attr.name, attr.value])),
        main_data: Object.fromEntries(Array.from(document.querySelector('main')?.attributes ?? []).filter(attr => attr.name.startsWith('data-')).map(attr => [attr.name, attr.value])),
        headings: Array.from(document.querySelectorAll('main h1,main h2')).filter(visible).map(node => node.textContent?.replace(/\s+/gu, ' ').trim()),
        events,
        popular_groups: popularGroups
      };
    });
    results.push({ archetype_id: archetype.archetype_id, route: item.astro.route, status: response?.status() ?? null, observation });
    await context.close();
    console.log(`${archetype.archetype_id}: ${observation.events.length} visible events`);
  }
} finally {
  await browser.close();
}

const output = {
  schema_version: 'round-trip-reconstruction.astro-observed-fixtures.v1',
  authority: bindings.authority,
  bindings_sha256: sha256(readFileSync(bindingsPath)),
  origin,
  observations: results
};
writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`${outputPath}: ${sha256(readFileSync(outputPath))}`);
