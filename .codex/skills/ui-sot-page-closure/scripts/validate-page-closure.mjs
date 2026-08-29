#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const fail = (message) => { console.error(`PAGE_CLOSURE_INVALID: ${message}`); process.exit(1); };
const manifestPath = process.argv[2];
if (!manifestPath) fail('manifest path is required');
const root = process.cwd();
const absoluteManifest = path.resolve(root, manifestPath);
let manifest;
try { manifest = JSON.parse(fs.readFileSync(absoluteManifest, 'utf8')); }
catch (error) { fail(`cannot read manifest: ${error.message}`); }

const exact = (actual, expected, label) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(`${label} mismatch`);
};
const requireValue = (condition, label) => { if (!condition) fail(label); };
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const pngSize = (file) => {
  const bytes = fs.readFileSync(file);
  if (bytes.length < 24 || bytes.toString('ascii', 1, 4) !== 'PNG') fail(`${file} is not PNG`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), bytes: bytes.length };
};
const verifyArtifact = (artifact, label, expectedSize = null) => {
  requireValue(artifact && typeof artifact.path === 'string' && /^[a-f0-9]{64}$/.test(artifact.sha256), `${label} identity missing`);
  const file = path.resolve(path.dirname(absoluteManifest), artifact.path);
  requireValue(fs.existsSync(file), `${label} file missing: ${artifact.path}`);
  exact(sha256(file), artifact.sha256, `${label} sha256`);
  if (file.endsWith('.png')) {
    const dimensions = pngSize(file);
    if (expectedSize) exact({ width: dimensions.width, height: dimensions.height }, expectedSize, `${label} dimensions`);
    if (artifact.width != null || artifact.height != null) exact({ width: dimensions.width, height: dimensions.height }, { width: artifact.width, height: artifact.height }, `${label} declared dimensions`);
  }
};

exact(manifest.schema_version, 'ui-sot-page-closure.v1', 'schema_version');
exact(manifest.status, 'PASS', 'status');
exact(manifest.owner_status, 'READY_FOR_OWNER_REVIEW', 'owner_status');
exact(manifest.route, '/podborki/besplatnye-sobytiya/', 'route');
exact(manifest.reference_clock, {
  reference_iso: '2026-08-29T14:00:00+02:00',
  timezone: 'Europe/Kaliningrad',
  locale: 'ru-RU',
}, 'reference_clock');
exact(manifest.fixtures.corpus_id, 'ui-reference-events.v2', 'corpus id');
exact(manifest.fixtures.corpus_sha256, 'b1746f0cd68be6dd6060858fb765c6863535aefbcf4844b9b50c279d69e9306a', 'corpus sha256');
exact(manifest.fixtures.input_order, [2182, 6711, 7609, 8006, 8200], 'fixture input order');
exact(manifest.fixtures.render_order, [8006, 8200, 2182, 6711, 7609], 'render order');
exact(manifest.fixtures.groups, { events: [8006, 8200], exhibitions: [2182, 6711, 7609] }, 'fixture groups');

for (const repo of ['sot', 'astro']) {
  const git = manifest.git?.[repo];
  requireValue(git && /^[a-f0-9]{40}$/.test(git.sha) && typeof git.branch === 'string', `${repo} git identity missing`);
  exact(git.clean, true, `${repo} worktree clean`);
  exact(git.pushed, true, `${repo} branch pushed`);
}
exact(manifest.penpot.file_id, '3be9e5e1-190f-8090-8008-713c0fbe6260', 'Penpot file id');
requireValue(Number.isInteger(manifest.penpot.revision) && manifest.penpot.revision > 0, 'Penpot revision missing');
exact(manifest.penpot.validation_errors, [], 'Penpot validation');
for (const key of ['component_page_id', 'route_page_id', 'review_page_id', 'review_board_id']) {
  requireValue(/^[a-f0-9-]{36}$/.test(manifest.penpot[key] || ''), `Penpot ${key} missing`);
}
exact(manifest.lineage, {
  page_cards: 10,
  linked_canonical_cards: 10,
  detached_cards: 0,
  page_local_visual_masters: 0,
  screenshot_cards: 0,
  data_only_wrappers: 10,
}, 'lineage census');

const requiredCases = [
  ['desktop-top', { width: 1280, height: 1200 }],
  ['desktop-sticky', { width: 1280, height: 1200 }],
  ['desktop-full', null],
  ['mobile-top', { width: 390, height: 844 }],
  ['mobile-scrolled', { width: 390, height: 844 }],
  ['mobile-full', null],
];
exact((manifest.cases || []).map((item) => item.id), requiredCases.map(([id]) => id), 'ordered full-route cases');
for (const [id, expectedSize] of requiredCases) {
  const item = manifest.cases.find((candidate) => candidate.id === id);
  exact(item.verdict, 'PASS', `${id} verdict`);
  for (const name of ['astro', 'penpot', 'side_by_side', 'overlay_50', 'diff']) verifyArtifact(item.artifacts?.[name], `${id}/${name}`, name === 'astro' || name === 'penpot' ? expectedSize : null);
  for (const name of ['geometry', 'computed_style', 'lineage', 'agent_review']) verifyArtifact(item.evidence?.[name], `${id}/${name}`);
}
for (const collection of ['component_cases', 'group_cases']) {
  requireValue(Array.isArray(manifest[collection]) && manifest[collection].length > 0, `${collection} missing`);
  for (const item of manifest[collection]) {
    exact(item.verdict, 'PASS', `${collection}/${item.id} verdict`);
    for (const name of ['astro', 'penpot', 'side_by_side', 'overlay_50', 'diff']) verifyArtifact(item.artifacts?.[name], `${collection}/${item.id}/${name}`);
    for (const name of ['geometry', 'computed_style', 'lineage', 'agent_review']) verifyArtifact(item.evidence?.[name], `${collection}/${item.id}/${name}`);
  }
}
for (const key of ['targeted_tests', 'route_build', 'ci']) exact(manifest.validation?.[key]?.status, 'PASS', `validation ${key}`);
exact(manifest.review_canvas.status, 'PASS', 'review canvas');
exact(manifest.review_canvas.ordered, ['desktop-top', 'desktop-sticky', 'desktop-full', 'mobile-top', 'mobile-scrolled', 'mobile-full'], 'review canvas order');
console.log('PAGE_CLOSURE_VALID');
