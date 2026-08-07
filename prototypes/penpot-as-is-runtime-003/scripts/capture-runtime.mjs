import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key?.startsWith('--') || value == null) throw new Error(`invalid_argument:${key || 'missing'}`);
    result[key.slice(2)] = value;
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));
const siteDir = resolve(args['site-dir'] || '.source/events-bot-new/site');
const outDir = resolve(args.out || 'prototypes/penpot-as-is-runtime-003/catalog');
const baseUrl = String(args['base-url'] || 'http://127.0.0.1:4321').replace(/\/+$/u, '');
const sourceSha = String(args['source-sha'] || '').trim();
if (!/^[0-9a-f]{40}$/u.test(sourceSha)) throw new Error('source_sha_invalid');

const requireFromSite = createRequire(pathToFileURL(join(siteDir, 'package.json')));
const { chromium } = requireFromSite('playwright');

const screenshotsDir = join(outDir, 'screenshots');
await rm(outDir, { recursive: true, force: true });
await mkdir(screenshotsDir, { recursive: true });

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
const slug = (value) => String(value || '')
  .normalize('NFKD')
  .toLowerCase()
  .replace(/[\u0300-\u036f]/gu, '')
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/gu, '')
  .slice(0, 72) || 'item';

const pages = [
  { id: '00-system-map', name: '00 — System map' },
  { id: '20-foundations', name: '20 — Foundations' },
  { id: '30-core-ui', name: '30 — Core UI' },
  { id: '40-announcements-components', name: '40 — Announcements components' },
  { id: '60-page-archetypes', name: '60 — Page archetypes' },
  { id: '70-as-is-registry', name: '70 — AS-IS registry' },
  { id: '80-candidate-review', name: '80 — Candidate review' },
  { id: '90-review-archive', name: '90 — Review archive' },
  { id: '99-technical-tests', name: '99 — Technical tests' },
];

const pageMap = new Map(pages.map((page) => [page.id, page]));
const elements = [];
const usedIds = new Set();
const layoutState = new Map();
const captureErrors = [];

function layout(pageId, width, height) {
  const state = layoutState.get(pageId) || { x: 0, y: 0, rowHeight: 0, column: 0 };
  const gap = 80;
  const maxRowWidth = 2700;
  if (state.x > 0 && state.x + width > maxRowWidth) {
    state.x = 0;
    state.y += state.rowHeight + gap;
    state.rowHeight = 0;
  }
  const position = { x: state.x, y: state.y, width, height };
  state.x += width + gap;
  state.rowHeight = Math.max(state.rowHeight, height);
  layoutState.set(pageId, state);
  return position;
}

function displaySize(originalWidth, originalHeight, kind) {
  const maxWidth = kind === 'page' ? 840 : 1320;
  const maxHeight = kind === 'page' ? 4600 : 3600;
  const scale = Math.min(1, maxWidth / originalWidth, maxHeight / originalHeight);
  return {
    width: Math.max(120, Math.round(originalWidth * scale)),
    height: Math.max(80, Math.round(originalHeight * scale)),
    scale,
  };
}

async function addArtifact({
  id,
  pageId,
  name,
  filePath,
  mimeType,
  originalWidth,
  originalHeight,
  sourcePath,
  runtimePath,
  selector,
  viewport,
  status = 'observed',
  kind = 'component',
  notes = null,
}) {
  if (usedIds.has(id)) throw new Error(`duplicate_element_id:${id}`);
  if (!pageMap.has(pageId)) throw new Error(`unknown_page:${pageId}`);
  usedIds.add(id);
  const bytes = await readFile(filePath);
  const artifactPath = relative(outDir, filePath).replaceAll('\\', '/');
  const size = displaySize(originalWidth, originalHeight, kind);
  elements.push({
    id,
    pageId,
    name,
    kind,
    status,
    source: {
      repository: 'onedayonemasterpiece/events-bot-new',
      revision: sourceSha,
      path: sourcePath,
      url: `https://github.com/onedayonemasterpiece/events-bot-new/blob/${sourceSha}/${sourcePath}`,
      runtimePath,
      selector,
      viewport,
    },
    artifact: {
      type: 'image',
      path: artifactPath,
      mimeType,
      sha256: sha256(bytes),
      byteLength: bytes.byteLength,
      originalWidth,
      originalHeight,
    },
    board: layout(pageId, size.width, size.height),
    notes,
  });
}

async function waitForReady(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.addStyleTag({ content: `
    *, *::before, *::after { animation-duration: 0s !important; animation-delay: 0s !important; transition: none !important; caret-color: transparent !important; }
    html { scroll-behavior: auto !important; }
  ` });
}

async function captureLocator(page, definition) {
  const locator = page.locator(definition.selector).first();
  await locator.waitFor({ state: 'visible', timeout: 30000 });
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) throw new Error(`bounding_box_missing:${definition.id}`);
  const path = join(screenshotsDir, `${definition.id}.png`);
  await locator.screenshot({ path, type: 'png', animations: 'disabled', caret: 'hide' });
  await addArtifact({
    ...definition,
    filePath: path,
    mimeType: 'image/png',
    originalWidth: Math.max(1, Math.round(box.width)),
    originalHeight: Math.max(1, Math.round(box.height)),
  });
}

async function capturePageScreenshot(page, definition) {
  const dimensions = await page.evaluate(() => ({
    width: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0),
    height: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0),
  }));
  const maxHeight = definition.viewport.id === 'mobile' ? 9000 : 12000;
  const height = Math.min(dimensions.height, maxHeight);
  const path = join(screenshotsDir, `${definition.id}.jpg`);
  await page.screenshot({
    path,
    type: 'jpeg',
    quality: 84,
    fullPage: dimensions.height <= maxHeight,
    ...(dimensions.height > maxHeight ? { clip: { x: 0, y: 0, width: definition.viewport.width, height } } : {}),
    animations: 'disabled',
    caret: 'hide',
  });
  await addArtifact({
    ...definition,
    filePath: path,
    mimeType: 'image/jpeg',
    originalWidth: definition.viewport.width,
    originalHeight: height,
    notes: dimensions.height > maxHeight ? `Captured first ${maxHeight}px of ${dimensions.height}px document.` : null,
  });
}

async function findEventRoute() {
  const directory = join(siteDir, 'dist', 'sobytiya');
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const candidate = entries.find((entry) => entry.isDirectory() && !entry.name.startsWith('_'));
    return candidate ? `/sobytiya/${candidate.name}/` : null;
  } catch {
    return null;
  }
}

const eventRoute = await findEventRoute();
const routes = [
  { id: 'home', path: '/', sourcePath: 'site/src/pages/index.astro', name: 'Главная' },
  { id: 'today', path: '/segodnya/', sourcePath: 'site/src/pages/segodnya/index.astro', name: 'Сегодня' },
  { id: 'tomorrow', path: '/zavtra/', sourcePath: 'site/src/pages/zavtra/index.astro', name: 'Завтра' },
  { id: 'weekend', path: '/vyhodnye/', sourcePath: 'site/src/pages/vyhodnye/index.astro', name: 'Выходные' },
  { id: 'popular', path: '/populyarnoe/', sourcePath: 'site/src/pages/populyarnoe/index.astro', name: 'Популярное' },
  { id: 'collections', path: '/podborki/', sourcePath: 'site/src/pages/podborki/index.astro', name: 'Подборки' },
  { id: 'festivals', path: '/festivali/', sourcePath: 'site/src/pages/festivali/index.astro', name: 'Фестивали' },
  ...(eventRoute ? [{ id: 'event-detail', path: eventRoute, sourcePath: 'site/src/pages/sobytiya/[slug].astro', name: 'Страница события' }] : []),
];

const viewports = [
  { id: 'desktop', width: 1440, height: 1000 },
  { id: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
];

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      isMobile: Boolean(viewport.isMobile),
      hasTouch: Boolean(viewport.hasTouch),
      locale: 'ru-RU',
      timezoneId: 'Europe/Kaliningrad',
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    const designSystemPath = '/lab/design-system/';
    try {
      await page.goto(`${baseUrl}${designSystemPath}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await waitForReady(page);

      const sectionDefinitions = [
        { key: 'intro', selector: '.ds-catalog__intro', pageId: '00-system-map', name: 'Runtime design-system intro', sourcePath: 'site/src/pages/lab/design-system/index.astro', kind: 'system' },
        { key: 'foundations', selector: '#foundations', pageId: '20-foundations', name: 'Foundations', sourcePath: 'site/src/pages/lab/design-system/index.astro', kind: 'foundation' },
        { key: 'actions', selector: '#actions', pageId: '30-core-ui', name: 'Actions and badges', sourcePath: 'site/src/pages/lab/design-system/index.astro', kind: 'core-ui' },
        { key: 'fields', selector: '#fields', pageId: '30-core-ui', name: 'Fields', sourcePath: 'site/src/pages/lab/design-system/index.astro', kind: 'core-ui' },
        { key: 'states', selector: '#states', pageId: '30-core-ui', name: 'State panels', sourcePath: 'site/src/pages/lab/design-system/index.astro', kind: 'core-ui' },
        { key: 'registry', selector: '#registry', pageId: '70-as-is-registry', name: 'Runtime component registry', sourcePath: 'site/src/pages/lab/design-system/index.astro', kind: 'registry' },
      ];

      for (const item of sectionDefinitions) {
        try {
          await captureLocator(page, {
            id: `runtime.ds.${item.key}.${viewport.id}`,
            pageId: item.pageId,
            name: `${item.name} · ${viewport.id}`,
            selector: item.selector,
            sourcePath: item.sourcePath,
            runtimePath: `${designSystemPath}${item.selector.startsWith('#') ? item.selector : ''}`,
            viewport,
            status: 'observed-runtime',
            kind: item.kind,
          });
        } catch (error) {
          captureErrors.push({ id: `runtime.ds.${item.key}.${viewport.id}`, error: String(error?.message || error) });
        }
      }

      const registry = await page.locator('#registry tbody tr').evaluateAll((rows) => rows.map((row) => ({
        component: row.getAttribute('data-ds-component'),
        version: row.getAttribute('data-ds-version'),
        replacedBy: row.getAttribute('data-ds-replaced-by'),
        cells: [...row.querySelectorAll('td')].map((cell) => cell.textContent?.trim().replace(/\s+/gu, ' ') || ''),
      })));
      await writeFile(join(outDir, `registry.${viewport.id}.json`), `${JSON.stringify(registry, null, 2)}\n`, 'utf8');

      const blocks = page.locator('#product-components article.ds-component-block');
      const count = await blocks.count();
      for (let index = 0; index < count; index += 1) {
        const block = blocks.nth(index);
        const title = (await block.locator('h3').first().textContent())?.trim() || `Product component ${index + 1}`;
        const status = (await block.locator('.ke-badge, .ds-badge').first().textContent().catch(() => 'observed'))?.trim() || 'observed';
        const id = `runtime.product.${slug(title)}.${viewport.id}`;
        try {
          await block.scrollIntoViewIfNeeded();
          const box = await block.boundingBox();
          if (!box) throw new Error('bounding_box_missing');
          const path = join(screenshotsDir, `${id}.png`);
          await block.screenshot({ path, type: 'png', animations: 'disabled', caret: 'hide' });
          await addArtifact({
            id,
            pageId: '40-announcements-components',
            name: `${title} · ${viewport.id}`,
            filePath: path,
            mimeType: 'image/png',
            originalWidth: Math.max(1, Math.round(box.width)),
            originalHeight: Math.max(1, Math.round(box.height)),
            sourcePath: 'site/src/pages/lab/design-system/index.astro',
            runtimePath: `${designSystemPath}#product-components`,
            selector: `#product-components article.ds-component-block:nth-of-type(${index + 1})`,
            viewport,
            status: status.toLowerCase(),
            kind: 'product-component',
            notes: `Captured from the real Astro runtime component gallery. Heading: ${title}.`,
          });
        } catch (error) {
          captureErrors.push({ id, error: String(error?.message || error) });
        }
      }
    } catch (error) {
      captureErrors.push({ id: `runtime.design-system.${viewport.id}`, error: String(error?.message || error) });
    }

    for (const route of routes) {
      const id = `runtime.page.${route.id}.${viewport.id}`;
      try {
        await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await waitForReady(page);
        await capturePageScreenshot(page, {
          id,
          pageId: '60-page-archetypes',
          name: `${route.name} · ${viewport.id}`,
          sourcePath: route.sourcePath,
          runtimePath: route.path,
          selector: 'document',
          viewport,
          status: 'observed-runtime',
          kind: 'page',
        });
      } catch (error) {
        captureErrors.push({ id, error: String(error?.message || error) });
      }
    }

    await context.close();
  }
} finally {
  await browser.close();
}

const totalBytes = elements.reduce((sum, element) => sum + element.artifact.byteLength, 0);
const catalog = {
  schemaVersion: 1,
  catalogRevision: `003-as-is-${sourceSha.slice(0, 12)}`,
  generatedAt: new Date().toISOString(),
  source: {
    repository: 'onedayonemasterpiece/events-bot-new',
    revision: sourceSha,
    designSystemPage: 'site/src/pages/lab/design-system/index.astro',
    runtimePath: '/lab/design-system/',
  },
  contract: {
    mode: 'observed-as-is',
    statement: 'Every visual artifact is a Playwright screenshot of the exact Astro runtime at source.revision. No component is redrawn by the Penpot plugin.',
    statuses: ['observed-runtime', 'approved', 'candidate', 'deprecated', 'rejected', 'conditional', 'feature-gated', 'baseline'],
  },
  pages,
  elements,
  metrics: {
    elementCount: elements.length,
    totalBytes,
    screenshotCount: elements.length,
    captureErrorCount: captureErrors.length,
  },
  captureErrors,
  prompt: {
    template: '@GitHub onedayonemasterpiece/lovekgd-design-system\n\nReview the AS-IS runtime artifact `{{elementId}}` from `events-bot-new@{{sourceRevision}}`.\n\nSource: {{sourceUrl}}\nRuntime path: {{runtimePath}}\nPenpot page: {{pageName}}\n\nUnresolved comments:\n{{comments}}\n\nDo not reconstruct the interface from memory. Use the exact source revision and prepare a candidate preview; do not update production without owner sign-off.',
  },
};

await writeFile(join(outDir, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
await writeFile(join(outDir, 'capture-errors.json'), `${JSON.stringify(captureErrors, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  ok: captureErrors.length === 0,
  sourceSha,
  elements: elements.length,
  totalBytes,
  errors: captureErrors,
}, null, 2));
if (captureErrors.length) process.exitCode = 2;
