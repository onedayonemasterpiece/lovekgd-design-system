import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] || 'prototypes/penpot-as-is-runtime-003');
const readText = (path) => readFile(resolve(root, path), 'utf8');
const fail = (condition, message) => { if (!condition) throw new Error(message); };
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

const [catalog, plugin, ui, manifest] = await Promise.all([
  readText('catalog/catalog.json').then(JSON.parse),
  readText('dist/plugin.js'),
  readText('dist/ui.html'),
  readText('dist/manifest.json').then(JSON.parse),
]);

fail(catalog.schemaVersion === 1, 'schema');
fail(catalog.contract?.mode === 'observed-as-is', 'mode');
fail(catalog.source?.repository === 'onedayonemasterpiece/events-bot-new', 'source_repository');
fail(/^[0-9a-f]{40}$/u.test(catalog.source?.revision || ''), 'source_revision');
fail(Array.isArray(catalog.pages) && catalog.pages.length === 9, 'page_count');
fail(Array.isArray(catalog.elements) && catalog.elements.length >= 24, `element_count:${catalog.elements?.length}`);
fail(catalog.metrics?.captureErrorCount === 0, `capture_errors:${catalog.metrics?.captureErrorCount}`);

const pageIds = new Set(catalog.pages.map((page) => page.id));
for (const required of [
  '00-system-map',
  '20-foundations',
  '30-core-ui',
  '40-announcements-components',
  '60-page-archetypes',
  '70-as-is-registry',
  '80-candidate-review',
  '90-review-archive',
  '99-technical-tests',
]) fail(pageIds.has(required), `missing_page:${required}`);

const ids = new Set();
const viewports = new Set();
const pageArchetypes = new Set();
let totalBytes = 0;
for (const element of catalog.elements) {
  fail(typeof element.id === 'string' && element.id, 'element_id');
  fail(!ids.has(element.id), `duplicate:${element.id}`);
  ids.add(element.id);
  fail(pageIds.has(element.pageId), `unknown_page:${element.id}`);
  fail(element.source?.repository === 'onedayonemasterpiece/events-bot-new', `source:${element.id}`);
  fail(element.source?.revision === catalog.source.revision, `source_revision:${element.id}`);
  fail(element.source?.url?.includes(`/blob/${catalog.source.revision}/`), `source_url:${element.id}`);
  fail(element.source?.viewport?.id, `viewport:${element.id}`);
  viewports.add(element.source.viewport.id);
  fail(element.artifact?.type === 'image', `artifact_type:${element.id}`);
  fail(['image/png', 'image/jpeg'].includes(element.artifact.mimeType), `mime:${element.id}`);
  fail(/^[0-9a-f]{64}$/u.test(element.artifact.sha256 || ''), `sha:${element.id}`);
  const path = resolve(root, 'catalog', element.artifact.path);
  const bytes = await readFile(path);
  fail(sha256(bytes) === element.artifact.sha256, `artifact_hash:${element.id}`);
  fail(bytes.byteLength === element.artifact.byteLength, `artifact_size:${element.id}`);
  totalBytes += bytes.byteLength;
  fail(Number.isFinite(element.board?.x) && Number.isFinite(element.board?.y), `slot:${element.id}`);
  fail(Number.isFinite(element.board?.width) && element.board.width > 0, `width:${element.id}`);
  fail(Number.isFinite(element.board?.height) && element.board.height > 0, `height:${element.id}`);
  if (element.pageId === '60-page-archetypes') pageArchetypes.add(element.source.runtimePath);
  fail(!JSON.stringify(element).includes('NOT APPROVED DESIGN'), `synthetic_fixture_leak:${element.id}`);
}
fail(totalBytes === catalog.metrics.totalBytes, 'total_bytes');
fail(viewports.has('desktop') && viewports.has('mobile'), 'viewport_coverage');
for (const route of ['/', '/segodnya/', '/zavtra/', '/vyhodnye/', '/populyarnoe/', '/podborki/', '/festivali/']) {
  fail(pageArchetypes.has(route), `missing_route:${route}`);
}

for (const marker of [
  "const NS = 'lovekgd.runtime.003'",
  'createPage',
  'openPage',
  'archive-replace',
  'uploadMediaData',
  'renameTechnicalPage',
  'findCommentThreads',
  'CURRENT',
  'STALE',
  'SYNC FAILED',
]) fail(plugin.includes(marker), `plugin_marker:${marker}`);

for (const marker of [
  "CATALOG_BRANCH = 'penpot-as-is-live'",
  'crypto.subtle.digest',
  'Git screenshot',
  'CURRENT',
  'STALE',
  'SYNC FAILED',
]) fail(ui.includes(marker), `ui_marker:${marker}`);

fail(manifest.code === 'plugin.js', 'manifest_code');
fail(JSON.stringify(manifest.permissions) === JSON.stringify(['content:read', 'content:write', 'comment:read']), 'permissions');
console.log(JSON.stringify({ ok: true, elements: catalog.elements.length, totalBytes, viewports: [...viewports], routes: [...pageArchetypes] }, null, 2));
