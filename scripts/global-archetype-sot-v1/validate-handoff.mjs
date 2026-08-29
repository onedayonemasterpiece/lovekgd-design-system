#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');
const packageRoot = join(repoRoot, 'catalog/global-archetype-sot-v1');
const atlasRoot = join(repoRoot, 'catalog/reconstruction-atlas/v1');
const astroRoot = resolve(process.env.EVENTS_BOT_ROOT ?? '/home/dev/.codex/worktrees/events-bot-new/event-card-semantic-closure-int');

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const fileHash = (path) => {
  assert.ok(existsSync(path) && statSync(path).isFile(), `missing file: ${relative(repoRoot, path)}`);
  return sha256(readFileSync(path));
};
const git = (cwd, args) => {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout || `git ${args.join(' ')} failed`);
  return result.stdout.trim();
};

const manifest = readJson(join(packageRoot, 'manifest.v1.json'));
const lock = readJson(join(packageRoot, 'handoff-lock.v1.json'));

assert.equal(lock.status, 'PASS');
assert.equal(lock.green_handoff.head_sha, '8c6b9c1017f1fb646b6bb757e1b6b2cf0e7b815d');
assert.equal(lock.green_handoff.workflow_run_number, 58);
assert.equal(lock.green_handoff.workflow_conclusion, 'success');
assert.match(lock.green_handoff.artifact_zip_sha256, /^[0-9a-f]{64}$/u);
assert.match(lock.green_handoff.payload_tar_sha256, /^[0-9a-f]{64}$/u);

git(repoRoot, ['cat-file', '-e', `${lock.green_handoff.head_sha}^{commit}`]);
git(repoRoot, ['merge-base', '--is-ancestor', lock.freshness.design_system_parent_sha, 'HEAD']);
assert.equal(git(astroRoot, ['rev-parse', 'HEAD']), lock.freshness.astro_source_sha, 'Astro HEAD is stale relative to the green handoff');

for (const [name, item] of Object.entries(lock.approved_outputs)) {
  if (name === 'archetype_contracts') continue;
  assert.equal(fileHash(join(repoRoot, item.path)), item.sha256, `approved semantic hash mismatch: ${name}`);
}

const contractRoot = join(repoRoot, lock.approved_outputs.archetype_contracts.path);
const contractFiles = readdirSync(contractRoot)
  .filter((name) => name.endsWith('.semantic-contract.v1.json'))
  .sort();
assert.equal(contractFiles.length, lock.approved_outputs.archetype_contracts.count);
const checksumManifest = contractFiles.map((name) => {
  const path = join(contractRoot, name);
  const repoPath = relative(repoRoot, path);
  return `${fileHash(path)}  ${repoPath}\n`;
}).join('');
assert.equal(
  sha256(checksumManifest),
  lock.approved_outputs.archetype_contracts.sorted_checksum_manifest_sha256,
  'archetype contract directory hash mismatch',
);

const registry = readJson(join(packageRoot, 'route-archetype-registry.v1.json'));
const graph = readJson(join(packageRoot, 'component-composition-graph.v1.json'));
assert.equal(registry.coverage.production_source_pages, 29);
assert.equal(registry.coverage.mapped_production_source_pages, 29);
assert.equal(registry.coverage.generated_routes, 32);
assert.equal(registry.coverage.mapped_generated_routes, 32);
assert.equal(graph.nodes.filter((node) => node.speculative_merge).length, 0);

const contractArchetypes = new Set(contractFiles.map((name) => readJson(join(contractRoot, name)).archetype_id));
assert.equal(contractArchetypes.size, 17);
for (const contract of contractFiles.map((name) => readJson(join(contractRoot, name)))) {
  assert.equal(contract.source_lock_id, lock.source_lock_id);
  assert.equal(contract.authority_mode, 'reconstructed');
  assert.equal(contract.canonical, false);
  assert.ok(contract.responsive_branches.length >= 2, `${contract.archetype_id} lacks desktop/mobile branches`);
}

assert.equal(manifest.visual_materialization.owner_pages_required, 17);
assert.equal(manifest.penpot_policy.stores, 'native reusable UI and linked UI compositions only');
assert.deepEqual(
  Object.keys(manifest.approved_semantic_outputs).sort(),
  ['archetype_contracts', 'component_composition_graph', 'fixtures', 'foundations', 'gap_ledger', 'reuse_new_map', 'route_archetype_registry'].sort(),
);
for (const excluded of lock.excluded_from_materialization_input) {
  assert.ok(!Object.values(manifest.approved_semantic_outputs).includes(excluded), `excluded operational input was approved: ${excluded}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  handoff_head: lock.green_handoff.head_sha,
  workflow_run_number: lock.green_handoff.workflow_run_number,
  artifact_zip_sha256: lock.green_handoff.artifact_zip_sha256,
  astro_sha: lock.freshness.astro_source_sha,
  archetypes: contractArchetypes.size,
  routes: registry.coverage.generated_routes,
  speculative_component_merges: 0,
  penpot_mutation_gate: 'OPEN',
}, null, 2));
