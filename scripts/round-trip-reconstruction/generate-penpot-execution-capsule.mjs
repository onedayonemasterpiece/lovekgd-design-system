#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const GENERATION = 9;
const OUT = 'catalog/penpot-executor/g9/capsule';
const CASES = [
  'eventcard.desktop-wide-calendar.8006',
  'eventcard.desktop-packed-calendar-absent.2182',
  'eventcard.mobile-wide-calendar.8006',
  'eventcard.mobile-packed-calendar-absent.2182',
];
const SOURCES = [
  ['catalog/materialization-bundles/eventcard-free-slice.g4.ready-v1.json', 'canonical-bundle'],
  ['catalog/ui-conformance/free-collection/g4/resolved/resolved-cases.index.json', 'resolved-index'],
  ['catalog/ui-conformance/free-collection/g4/resolved/geometry-proof.json', 'geometry-proof'],
  ...CASES.map((id) => [`catalog/ui-conformance/free-collection/g4/resolved/${id}.resolved-render-case.json`, 'resolved-case']),
  ['catalog/ui-conformance/free-collection/g4/resolved/free-collection.desktop.full.resolved-render-case.json', 'fixture-order-authority'],
  ['catalog/ui-components/event-card-large/component-contract.v2.json', 'component-contract'],
  ['contracts/assets/ui-asset-registry.v1.yaml', 'asset-registry'],
  ['contracts/page-profiles/free-collection.owner-review.v1.yaml', 'page-profile'],
  ['catalog/ui-assets/v1/icons/action-share.svg', 'canonical-asset'],
  ['catalog/ui-assets/v1/icons/action-favorite-outline.svg', 'canonical-asset'],
  ['catalog/ui-assets/v1/icons/action-favorite-solid.svg', 'canonical-asset'],
  ['catalog/ui-assets/v1/icons/action-not-interested.svg', 'canonical-asset'],
  ['catalog/ui-assets/v1/icons/action-calendar-add.svg', 'canonical-asset'],
  ['catalog/ui-assets/v1/icons/nav-afisha.svg', 'canonical-asset'],
  ['catalog/ui-assets/v1/icons/nav-dates.svg', 'canonical-asset'],
  ['catalog/ui-assets/v1/icons/nav-search.svg', 'canonical-asset'],
  ['catalog/ui-assets/v1/icons/nav-personal.svg', 'canonical-asset'],
  ['catalog/ui-assets/v1/illustrations/free-listing-medallion.svg', 'canonical-asset'],
  ['scripts/round-trip-reconstruction/materialization-execution-kernel.js', 'runtime'],
  ['scripts/round-trip-reconstruction/resolved-case-loader.js', 'runtime'],
  ['scripts/round-trip-reconstruction/penpot-native-adapter.js', 'runtime'],
  ['scripts/round-trip-reconstruction/penpot-phase-b-executor.js', 'runtime'],
  ['contracts/penpot-executor/penpot-executor-receipt.v1.schema.json', 'runtime-schema'],
  ['contracts/penpot-executor/runtime-target-capsule.v1.schema.json', 'runtime-schema'],
  ['docs/penpot-executor/phase-b-penpot-only.md', 'instruction'],
];
const RUNTIME_SOURCES = [
  ['catalog/penpot-executor/g9/target/runtime-target-capsule.json', 'runtime/runtime-target-capsule.json', 'runtime-target'],
  ['catalog/penpot-executor/g9/control/accepted-bundle-control.g9.json', 'runtime/accepted-bundle-control.g9.json', 'accepted-control'],
  ['catalog/penpot-executor/g9/control/executor-reuse-bindings.g9.json', 'runtime/executor-reuse-bindings.g9.json', 'reuse-bindings'],
];
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  return value;
}
const canonicalJson = (value) => `${JSON.stringify(canonicalize(value))}\n`;

export async function generate({ root = process.cwd(), check = false } = {}) {
  const entries = [];
  const copies = [...SOURCES.map(([source, role]) => [source, source, role]), ...RUNTIME_SOURCES];
  for (const [source, destination, role] of copies) {
    const bytes = await readFile(path.join(root, source));
    const output = path.join(root, OUT, 'root', destination);
    if (check) {
      const current = await readFile(output);
      if (!current.equals(bytes)) throw new Error(`CAPSULE_DRIFT:${destination}`);
    } else {
      await mkdir(path.dirname(output), { recursive: true });
      await writeFile(output, bytes);
    }
    entries.push({ path: destination, role, sha256: sha256(bytes), bytes: bytes.length });
  }
  entries.sort((a, b) => a.path.localeCompare(b.path));
  const generatorBytes = await readFile(path.join(root, 'scripts/round-trip-reconstruction/generate-penpot-execution-capsule.mjs'));
  const manifest = {
    schema: 'kenigevents.penpot-execution-capsule-manifest.v1',
    generation: GENERATION,
    generator: { path: 'scripts/round-trip-reconstruction/generate-penpot-execution-capsule.mjs', content_sha256: sha256(generatorBytes) },
    adapter: { id: 'kenigevents.penpot.phase-b-native-adapter', version: '1.0.0' },
    supported_case_ids: CASES,
    entries,
    content_sha256: null,
  };
  manifest.content_sha256 = sha256(canonicalJson(manifest));
  const bytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
  const manifestPath = path.join(root, OUT, 'manifest.json');
  if (check) {
    const current = await readFile(manifestPath);
    if (!current.equals(bytes)) throw new Error('CAPSULE_MANIFEST_DRIFT');
  } else {
    await mkdir(path.dirname(manifestPath), { recursive: true });
    await writeFile(manifestPath, bytes);
  }
  return { manifest, manifest_path: `${OUT}/manifest.json`, raw_sha256: sha256(bytes) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes('--check');
  generate({ check }).then((result) => process.stdout.write(`${result.manifest.entries.length} entries manifest=${result.manifest.content_sha256} raw=${result.raw_sha256}\n`)).catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
