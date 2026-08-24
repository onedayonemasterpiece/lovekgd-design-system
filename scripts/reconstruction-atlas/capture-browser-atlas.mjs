import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { archetypes, viewports } from './reconstruction-atlas.config.mjs';

const designRoot = resolve(new URL('../..', import.meta.url).pathname);
const eventsRoot = resolve(process.env.EVENTS_BOT_ROOT || '/home/dev/.codex/worktrees/events-bot-new/event-card-semantic-closure-int');
const origin = String(process.env.ATLAS_ASTRO_ORIGIN || 'http://127.0.0.1:4322').replace(/\/$/u, '');
const outputPath = join(designRoot, 'catalog/reconstruction-atlas/v1/evidence/browser-observations.v1.json');
const playwrightUrl = pathToFileURL(join(eventsRoot, 'site/node_modules/playwright/index.mjs')).href;
const { chromium } = await import(playwrightUrl);
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const unique = (values) => [...new Set(values)].sort();

const tasks = [];
for (const archetype of archetypes) {
  for (const route of archetype.representative_routes) {
    tasks.push({ archetype_id: archetype.id, route, viewport: viewports.mobile });
    tasks.push({ archetype_id: archetype.id, route, viewport: viewports.desktop });
    if (archetype.id === 'archetype.event-detail') tasks.push({ archetype_id: archetype.id, route, viewport: viewports.tablet });
  }
}

async function capture(browser, task) {
  const context = await browser.newContext({ viewport: { width: task.viewport.width, height: task.viewport.height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await context.route(/\.(?:avif|gif|jpe?g|png|webp|woff2?|mp4|webm)(?:\?.*)?$/iu, (route) => route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror:${String(error.message || error).slice(0, 300)}`));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console:${message.text().slice(0, 300)}`); });
  let response = null;
  let navigationError = null;
  const started = Date.now();
  try {
    response = await page.goto(`${origin}${task.route}`, { waitUntil: 'domcontentloaded', timeout: 25_000 });
    await page.waitForTimeout(120);
  } catch (error) {
    navigationError = String(error.message || error).slice(0, 500);
  }
  const observation = navigationError ? null : await page.evaluate(() => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return !element.hidden && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
    };
    const compactClass = (element) => String(element.className?.baseVal || element.className || '').trim().split(/\s+/u).filter(Boolean).slice(0, 4).join(' ');
    const semantic = [...document.querySelectorAll('[data-ds-component]')].map((element) => ({
      component: element.getAttribute('data-ds-component'),
      version: element.getAttribute('data-ds-version'),
      tag: element.tagName.toLowerCase(),
      class: compactClass(element),
      visible: visible(element),
    }));
    const componentCounts = {};
    const visibleComponentCounts = {};
    for (const item of semantic) {
      componentCounts[item.component] = (componentCounts[item.component] || 0) + 1;
      if (item.visible) visibleComponentCounts[item.component] = (visibleComponentCounts[item.component] || 0) + 1;
    }
    const landmarks = [...document.querySelectorAll('header,nav,main,section,article,aside,footer,[role]')].slice(0, 500).map((element) => ({
      tag: element.tagName.toLowerCase(),
      id: element.id || null,
      class: compactClass(element) || null,
      role: element.getAttribute('role'),
      label: element.getAttribute('aria-label') || element.getAttribute('aria-labelledby'),
      visible: visible(element),
    }));
    const interactive = [...document.querySelectorAll('a[href],button,input,select,textarea,[tabindex],[role="button"],[role="link"]')].slice(0, 500).map((element) => ({
      tag: element.tagName.toLowerCase(),
      class: compactClass(element) || null,
      role: element.getAttribute('role'),
      type: element.getAttribute('type'),
      href: element.getAttribute('href'),
      label: element.getAttribute('aria-label') || element.textContent?.trim().replace(/\s+/gu, ' ').slice(0, 90) || null,
      current: element.getAttribute('aria-current'),
      pressed: element.getAttribute('aria-pressed'),
      expanded: element.getAttribute('aria-expanded'),
      disabled: element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true',
      visible: visible(element),
    }));
    const stateAttrs = {};
    for (const element of [...document.querySelectorAll('*')]) {
      for (const attr of [...element.attributes]) {
        if (!/^(?:data-.*(?:state|status|variant|presentation|treatment|mode|section|kind|daypart|empty|loading|ready|locked|checking|selected|unread)|aria-(?:current|expanded|pressed|busy|disabled|selected|hidden|live))$/u.test(attr.name)) continue;
        const key = `${attr.name}=${attr.value || 'present'}`;
        stateAttrs[key] = (stateAttrs[key] || 0) + 1;
      }
    }
    const dataMarkers = {};
    for (const element of [...document.querySelectorAll('*')]) {
      for (const attr of [...element.attributes]) {
        if (!attr.name.startsWith('data-')) continue;
        dataMarkers[attr.name] = (dataMarkers[attr.name] || 0) + 1;
      }
    }
    const headings = [...document.querySelectorAll('h1,h2,h3')].slice(0, 20).map((element) => ({ tag: element.tagName.toLowerCase(), text: element.textContent?.trim().replace(/\s+/gu, ' ').slice(0, 180), visible: visible(element) }));
    const domContract = landmarks.map(({ tag, id, class: className, role, label, visible: isVisible }) => [tag, id, className, role, label, isVisible]);
    const aggregate = (items, keyFor) => {
      const counts = {};
      for (const item of items) {
        const key = keyFor(item);
        counts[key] = (counts[key] || 0) + 1;
      }
      return counts;
    };
    return {
      title: document.title,
      html_lang: document.documentElement.lang,
      body_classes: compactClass(document.body),
      h1: document.querySelector('h1')?.textContent?.trim().replace(/\s+/gu, ' ').slice(0, 240) || null,
      headings,
      component_counts: componentCounts,
      visible_component_counts: visibleComponentCounts,
      semantic_component_signatures: aggregate(semantic, (item) => `${item.component}@${item.version || 'unversioned'}|${item.tag}|${item.class}|visible=${item.visible}`),
      landmark_signatures: aggregate(landmarks, (item) => `${item.tag}|${item.id || ''}|${item.class || ''}|role=${item.role || ''}|label=${item.label || ''}|visible=${item.visible}`),
      interactive_control_signatures: aggregate(interactive, (item) => `${item.tag}|${item.class || ''}|role=${item.role || ''}|type=${item.type || ''}|current=${item.current || ''}|pressed=${item.pressed || ''}|expanded=${item.expanded || ''}|disabled=${item.disabled}|visible=${item.visible}`),
      state_attributes: stateAttrs,
      data_markers: dataMarkers,
      dom_contract: domContract,
    };
  });
  const finalUrl = page.url();
  await context.close();
  const domContract = observation?.dom_contract || [];
  if (observation) delete observation.dom_contract;
  return {
    archetype_id: task.archetype_id,
    requested_route: task.route,
    viewport: task.viewport,
    response_status: response?.status() ?? null,
    final_url: finalUrl,
    redirected: finalUrl !== `${origin}${task.route}`,
    navigation_error: navigationError,
    runtime_errors: unique(errors),
    elapsed_ms: Date.now() - started,
    dom_contract_sha256: sha256(JSON.stringify(domContract)),
    observation,
  };
}

const browser = await chromium.launch({ headless: true });
const results = new Array(tasks.length);
let cursor = 0;
async function worker() {
  while (true) {
    const index = cursor++;
    if (index >= tasks.length) return;
    results[index] = await capture(browser, tasks[index]);
  }
}
await Promise.all(Array.from({ length: Math.min(5, tasks.length) }, () => worker()));
await browser.close();

const routeStatus = {};
for (const result of results) {
  const key = `${result.archetype_id}:${result.requested_route}`;
  routeStatus[key] ||= [];
  routeStatus[key].push({ viewport_id: result.viewport.id, response_status: result.response_status, final_url: result.final_url, dom_contract_sha256: result.dom_contract_sha256 });
}
const failed = results.filter((item) => item.navigation_error || (item.response_status ?? 500) >= 400);
const browserEvidence = {
  schema_version: 'reconstruction-atlas-browser-observations.v1',
  captured_at: new Date().toISOString(),
  origin,
  policy: {
    screenshots: 'not generated in semantic SoT phase',
    images_fonts_media: 'network-aborted to keep the census bounded; generated HTML/CSS/JS semantics remain observed',
    reduced_motion: true,
    viewports: Object.values(viewports),
  },
  task_count: tasks.length,
  archetype_count: archetypes.length,
  failed_observation_count: failed.length,
  route_status: routeStatus,
  observations: results,
};
await writeFile(outputPath, `${JSON.stringify(browserEvidence, null, 2)}\n`);

const indexPath = join(designRoot, 'catalog/reconstruction-atlas/v1/evidence/index.v1.json');
const index = JSON.parse(await readFile(indexPath, 'utf8'));
index.status = failed.length ? 'BROWSER_CAPTURE_COMPLETE_WITH_RECORDED_GAPS' : 'BROWSER_CAPTURE_COMPLETE';
index.browser_observation_count = results.length;
index.browser_failed_observation_count = failed.length;
index.browser_observations_sha256 = sha256(await readFile(outputPath));
await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`);

console.log(JSON.stringify({
  output_path: outputPath,
  task_count: tasks.length,
  archetype_count: archetypes.length,
  failed_observation_count: failed.length,
  failures: failed.map((item) => ({ archetype_id: item.archetype_id, route: item.requested_route, viewport: item.viewport.id, status: item.response_status, error: item.navigation_error })),
}, null, 2));
