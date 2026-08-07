#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] || 'prototypes/penpot-resource-graph-004a');
const read = (path) => readFile(resolve(root, path), 'utf8');
const fail = (condition, message) => { if (!condition) throw new Error(message); };
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const [catalogText, plugin, template, ui, manifestText] = await Promise.all([
  read('catalog/catalog.json'),
  read('dist/plugin.js'),
  read('src/plugin.js.template'),
  read('dist/ui.html'),
  read('dist/manifest.json'),
]);
const catalog = JSON.parse(catalogText);
const manifest = JSON.parse(manifestText);

fail(catalog.schemaVersion === 1, 'catalog_schema');
fail(catalog.delivery === 'penpot-resource-graph-004a', 'catalog_delivery');
fail(/^[0-9a-f]{40}$/u.test(catalog.source?.revision || ''), 'source_sha');
fail(/^[0-9a-f]{64}$/u.test(catalog.catalogSha256 || ''), 'catalog_sha');
const unhashed = structuredClone(catalog);
delete unhashed.catalogSha256;
fail(sha256(JSON.stringify(unhashed)) === catalog.catalogSha256, 'catalog_hash_mismatch');
fail(catalog.source?.productionFreshnessClaimed === false, '004a_must_not_claim_production_freshness');
fail(Array.isArray(catalog.pages) && catalog.pages.length === 16, `page_count:${catalog.pages?.length}`);
for (const page of ['00 — System map', '20 — Foundations', '25 — Iconography', '30 — Core UI resources', '70 — Coverage and fragmentation', '90 — Evidence / desktop', '92 — Evidence / mobile']) {
  fail(catalog.pages.includes(page), `missing_page:${page}`);
}
fail(catalog.colors.length >= 20, `colors:${catalog.colors.length}`);
fail(catalog.typography.length >= 8, `typography:${catalog.typography.length}`);
fail(catalog.icons.length >= 40, `icons:${catalog.icons.length}`);
fail(catalog.coreComponents.length === 4, `core_families:${catalog.coreComponents.length}`);

const resourceIds = new Set();
for (const item of [...catalog.colors, ...catalog.typography, ...catalog.icons]) {
  fail(item.id && !resourceIds.has(item.id), `duplicate_resource:${item.id}`);
  resourceIds.add(item.id);
}
for (const icon of catalog.icons) {
  fail(/^<svg\b/iu.test(icon.svg), `icon_svg_root:${icon.id}`);
  fail(!/(?:class|style|aria-[\w-]+|role|title)=\{/u.test(icon.svg) && !icon.svg.includes('{name') && !icon.svg.includes('{title') && !icon.svg.includes('Astro.props'), `icon_unresolved_expression:${icon.id}`);
  fail(/^[0-9a-f]{64}$/u.test(icon.hash || ''), `icon_hash:${icon.id}`);
  fail(sha256(icon.svg) === icon.hash, `icon_hash_mismatch:${icon.id}`);
  fail(['current', 'candidate', 'legacy', 'unused'].includes(icon.status), `icon_status:${icon.id}`);
  fail(Array.isArray(icon.consumers), `icon_consumers:${icon.id}`);
}

fail(manifest.version === 2, 'manifest_version');
fail(manifest.code === 'plugin.js', 'manifest_code');
fail(manifest.icon === 'icon.svg', 'manifest_icon');
fail(JSON.stringify(manifest.permissions) === JSON.stringify(['content:read', 'content:write', 'library:write', 'comment:read']), 'manifest_permissions');

for (const marker of [
  "const NS = 'lovekgd.resourcegraph.004a'",
  "penpot.library.local.createColor()",
  "penpot.library.local.createTypography()",
  "penpot.library.local.createComponent([shape])",
  'penpot.createShapeFromSvg(icon.svg)',
  'penpot.createVariantFromComponents(boards)',
  "message.type === 'update-all'",
  "message.type === 'build-prompt'",
  'page.findCommentThreads',
  'penpot.currentFile?.validate',
  '98 — Runtime 003.2 /',
]) fail(plugin.includes(marker), `plugin_marker:${marker}`);
fail(!plugin.includes('__UI_SHA__'), 'plugin_ui_sha_unresolved');
fail(template.includes("const UI_SHA = '__UI_SHA__'"), 'template_ui_placeholder');
fail(!/update-(page|component|file)/u.test(ui), 'forbidden_per_item_update_action');
for (const marker of [
  "const LIVE_BRANCH = 'resource-graph-004a-live'",
  'Обновить дизайн-систему',
  'Собрать промпт по комментариям',
  "send('update-all'",
  "send('build-prompt'",
  'Production source',
  'Resource library',
  'Iconography',
  'Archetype composition',
]) fail(ui.includes(marker), `ui_marker:${marker}`);

console.log(JSON.stringify({
  ok: true,
  sourceSha: catalog.source.revision,
  catalogSha256: catalog.catalogSha256,
  pages: catalog.pages.length,
  colors: catalog.colors.length,
  typography: catalog.typography.length,
  icons: catalog.icons.length,
  currentIcons: catalog.counts.currentIcons,
  coreFamilies: catalog.coreComponents.length,
}, null, 2));
