#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] || 'prototypes/penpot-resource-graph-004b');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const fail = (condition, message) => { if (!condition) throw new Error(message); };

const catalog = JSON.parse(read('catalog/catalog.json'));
const plugin = read('dist/plugin.js');
const ui = read('dist/ui.html');
const manifest = JSON.parse(read('dist/manifest.json'));

fail(catalog.schemaVersion === 1, 'schema');
fail(catalog.delivery === 'penpot-resource-graph-004b', 'delivery');
fail(/^[0-9a-f]{40}$/u.test(catalog.source?.revision || ''), 'source_sha');
fail(/^[0-9a-f]{64}$/u.test(catalog.catalogSha256 || ''), 'catalog_sha');
fail(catalog.source?.contract === 'site/src/data/design-system-production-surface-contract.v1.json', 'contract');
fail(catalog.fontPolicy?.forbidSilentSerifFallback === true, 'font_policy');
fail(catalog.cleanupPolicy?.mode === 'automatic-safe-organize', 'cleanup_policy');

const requiredPages = [
  '40 — Product component masters',
  '50 — Product patterns',
  '60 — Page archetypes',
  '70 — Coverage and fragmentation',
  '75 — Design gaps',
  '90 — Evidence / desktop',
  '91 — Evidence / tablet',
  '92 — Evidence / mobile',
];
for (const page of requiredPages) fail(catalog.pages.includes(page), `page:${page}`);

fail(catalog.components.length >= 35, `components:${catalog.components.length}`);
fail(catalog.patterns.length >= 10, `patterns:${catalog.patterns.length}`);
fail(catalog.archetypes.length >= 17, `archetypes:${catalog.archetypes.length}`);
fail(catalog.fragmentationClusters.length >= 6, 'fragmentation');
fail(catalog.designGaps.length >= 4, 'gaps');

const componentIds = new Set(catalog.components.map((item) => item.id));
fail(componentIds.size === catalog.components.length, 'component_ids');
const patternIds = new Set(catalog.patterns.map((item) => item.id));
fail(patternIds.size === catalog.patterns.length, 'pattern_ids');
for (const component of catalog.components) {
  fail(component.hash && /^[0-9a-f]{64}$/u.test(component.hash), `component_hash:${component.id}`);
  fail(Array.isArray(component.sources) && component.sources.length > 0, `component_sources:${component.id}`);
  fail(component.width > 0 && component.height > 0, `component_geometry:${component.id}`);
}
for (const pattern of catalog.patterns) {
  for (const id of pattern.components) fail(componentIds.has(id), `pattern_ref:${pattern.id}:${id}`);
}
for (const archetype of catalog.archetypes) {
  fail(Array.isArray(archetype.routes) && archetype.routes.length > 0, `route:${archetype.id}`);
  fail(Array.isArray(archetype.evidenceViewports) && archetype.evidenceViewports.length >= 2, `viewports:${archetype.id}`);
  for (const id of archetype.components) {
    fail(componentIds.has(id) || patternIds.has(id), `archetype_ref:${archetype.id}:${id}`);
  }
}

const unsigned = { ...catalog };
delete unsigned.catalogSha256;
const expectedHash = createHash('sha256').update(JSON.stringify(unsigned)).digest('hex');
fail(expectedHash === catalog.catalogSha256, 'catalog_hash');

for (const marker of [
  "const NS = 'lovekgd.resourcegraph.004b'",
  "penpot.fonts.findByName",
  'font.applyToText',
  'typography.setFont',
  'penpot.library.local.createComponent([shape])',
  'component.instance()',
  'page.remove()',
  'findCommentThreads',
  'snapshotCommentRegistry',
  'organizeLegacyEvidence',
  'reconcileProductComponents',
  'reconcilePatterns',
  'reconcileArchetypes',
  'createFragmentationPage',
  'createDesignGapsPage',
  "type: 'update-all'",
  "type: 'build-prompt'",
]) fail(plugin.includes(marker), `plugin_marker:${marker}`);

for (const marker of [
  'LoveKGD Resource Graph · 004b',
  'Обновить всю дизайн-систему',
  'Product components',
  'Page archetypes',
  'Legacy cleanup',
  'Comment registry',
  'CURRENT',
  'NEEDS UPDATE',
  'INCOMPLETE',
]) fail(ui.includes(marker), `ui_marker:${marker}`);

fail(manifest.version === 2, 'manifest_version');
fail(manifest.code === 'plugin.js', 'manifest_code');
for (const permission of ['content:read', 'content:write', 'library:write', 'comment:read']) {
  fail(manifest.permissions.includes(permission), `permission:${permission}`);
}

console.log(JSON.stringify({
  ok: true,
  source: catalog.source.revision,
  catalogSha256: catalog.catalogSha256,
  counts: catalog.counts,
  manifest: manifest.name,
}, null, 2));
