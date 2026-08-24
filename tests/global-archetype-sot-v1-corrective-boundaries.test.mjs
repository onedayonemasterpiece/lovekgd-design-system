#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const root = resolve('.');
const pkg = join(root, 'catalog/global-archetype-sot-v1');
const astroRoot = resolve(process.env.EVENTS_BOT_ROOT ?? '.astro-source');
const baseSha = process.env.BASE_SHA ?? 'da16dde8812220125a806bd5a03d5015357d4c07';
const expectedAstroSha = '7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00';
const expectedRouteSha = 'fb6f8252aba36eca906b6c1516ef19ef83532dda45c87ca0aa41c116773aae0d';
const candidateStatus = 'CORRECTIVE_CANDIDATE_READY_WITH_EXPLICIT_UNRESOLVED';
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const sha = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const shaText = (value) => createHash('sha256').update(value).digest('hex');
const forbiddenSemantic = /\/penpot\/|materialization-ir|renderer(?:_|\s|-)?(?:data|input|delta)?|penpot_component_id|penpot_main_shape_id/iu;

function parentManifestRaw() {
  if (process.env.CORRECTIVE_PARENT_MANIFEST) return readFileSync(process.env.CORRECTIVE_PARENT_MANIFEST, 'utf8');
  return execFileSync('git', ['show', `${baseSha}:catalog/global-archetype-sot-v1/manifest.v1.json`], { encoding: 'utf8' });
}

function objectBlock(raw, key) {
  const marker = `${JSON.stringify(key)}:`;
  const keyPos = raw.indexOf(marker);
  assert.notEqual(keyPos, -1, `missing ${key}`);
  const start = raw.indexOf('{', keyPos + marker.length);
  assert.notEqual(start, -1, `missing object start for ${key}`);
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < raw.length; index += 1) {
    const char = raw[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) return raw.slice(keyPos, index + 1);
    }
  }
  assert.fail(`unterminated object ${key}`);
}

const sourceLockPath = join(pkg, 'source-lock.v1.json');
const sourceLockText = readFileSync(sourceLockPath, 'utf8');
const sourceLock = JSON.parse(sourceLockText);
assert.equal(forbiddenSemantic.test(sourceLockText), false, 'design-tool/renderer data leaked into semantic source lock');
assert.deepEqual(sourceLock.allowed_input_classes, [
  'verified_handoff', 'astro_source', 'generated_html', 'browser_computed', 'semantic_atlas', 'foundations', 'fixtures',
]);
assert.equal(sourceLock.corrective_parent_sha, baseSha);
assert.equal(sourceLock.astro_commit, expectedAstroSha);
for (const input of sourceLock.design_system_inputs) assert.equal(forbiddenSemantic.test(JSON.stringify(input)), false);
for (const input of sourceLock.astro_source_inputs) {
  assert.equal(input.repository, 'onedayonemasterpiece/events-bot-new');
  assert.equal(input.commit, expectedAstroSha);
  assert.match(input.sha256, /^[0-9a-f]{64}$/u);
}

const contractsDir = join(pkg, 'archetype-contracts');
const contractFiles = readdirSync(contractsDir).filter((name) => name.endsWith('.semantic-contract.v1.json')).sort();
assert.equal(contractFiles.length, 17);
const contracts = Object.fromEntries(contractFiles.map((name) => [name.replace('.semantic-contract.v1.json', ''), readJson(join(contractsDir, name))]));
const foundationSignatures = new Set();
for (const [slug, contract] of Object.entries(contracts)) {
  const text = readFileSync(join(contractsDir, `${slug}.semantic-contract.v1.json`), 'utf8');
  assert.equal(forbiddenSemantic.test(text), false, `design-tool data leaked into ${slug}`);
  assert.equal(contract.source_lock_id, sourceLock.source_lock_id);
  assert.ok(contract.foundations_usage.length >= 3, `${slug} lacks consumer-specific foundations`);
  const signature = contract.foundations_usage.map((item) => item.foundation_group).join('|');
  foundationSignatures.add(signature);
  for (const item of contract.foundations_usage) {
    assert.equal(item.consumer_archetype, contract.archetype_id);
    assert.match(item.source_ref, /^catalog\/reconstruction-atlas\/v1\/foundations\.v1\.json#\/(?!$)/u);
  }
  for (const dependency of contract.component_dependencies ?? []) {
    if (!['reuse_existing', 'new_component'].includes(dependency.disposition)) continue;
    assert.ok(dependency.source_identity_contract?.length > 0, `${slug}/${dependency.component_id} lacks exact source identities`);
    for (const identity of dependency.source_identity_contract) assert.ok(identity.source_refs?.length > 0);
    if (dependency.source_identity_contract.length > 1) {
      assert.equal(dependency.identity_gate?.reconciliation_proof_ref, 'catalog/global-archetype-sot-v1/reconciliation-proofs.v1.json');
    }
  }
}
assert.ok(foundationSignatures.size >= 8, `only ${foundationSignatures.size} foundation signatures`);

const reconciliationPath = join(pkg, 'reconciliation-proofs.v1.json');
const reconciliation = readJson(reconciliationPath);
assert.equal(forbiddenSemantic.test(JSON.stringify(reconciliation)), false);
assert.equal(reconciliation.source_lock_id, sourceLock.source_lock_id);
const socialProof = reconciliation.proofs.find((item) => item.semantic_component_id === 'social-proof.like');
assert.ok(socialProof);
if (socialProof.status === 'PASS') assert.ok(socialProof.source_identities.length >= 2);

const graphPath = join(pkg, 'component-composition-graph.v1.json');
const graphText = readFileSync(graphPath, 'utf8');
const graph = JSON.parse(graphText);
assert.equal(forbiddenSemantic.test(graphText), false);
assert.equal(graph.corrective_source_lock_id, sourceLock.source_lock_id);
for (const node of graph.nodes) {
  if (!node || typeof node !== 'object') continue;
  const id = node.component_id ?? node.id ?? node.node_id;
  if (['reuse_existing', 'new_component'].includes(node.disposition)) {
    assert.ok(node.source_identity_contract?.length > 0, `${id} lacks source identities`);
    for (const identity of node.source_identity_contract) {
      assert.ok(identity.source_identity_id);
      assert.ok(identity.source_refs?.length > 0, `${id}/${identity.source_identity_id} lacks refs`);
      for (const ref of identity.source_refs) {
        assert.equal(ref.repository, 'onedayonemasterpiece/events-bot-new');
        assert.equal(ref.commit, expectedAstroSha);
        assert.match(ref.line_sha256, /^[0-9a-f]{64}$/u);
        if (existsSync(astroRoot)) {
          const sourcePath = join(astroRoot, ref.path);
          assert.ok(existsSync(sourcePath), `missing source ${ref.path}`);
          const line = readFileSync(sourcePath, 'utf8').split(/\r?\n/u)[ref.line_start - 1] ?? '';
          assert.equal(shaText(line), ref.line_sha256, `source drift ${ref.path}:${ref.line_start}`);
        }
      }
    }
    if (node.source_identity_contract.length > 1) {
      assert.equal(node.identity_gate?.reconciliation_proof_ref, 'catalog/global-archetype-sot-v1/reconciliation-proofs.v1.json', `${id} lacks Git semantic reconciliation proof`);
    }
  }
  if (['document.typography', 'listing.page-pattern'].includes(id) && node.source_identity_contract?.length > 1) {
    assert.equal(node.disposition, 'unresolved', `${id} speculative merge was not fail-closed`);
  }
}

const planPath = join(pkg, 'penpot-materialization-plan.v1.json');
const plan = readJson(planPath);
assert.equal(plan.materialization_scope, 'ui_only');
assert.equal(plan.owner_pages.length, 17);
const allowedOwnerKeys = ['owner_page_key', 'archetype_id', 'foundations', 'ui_components', 'visual_patterns', 'compositions', 'visual_states'].sort();
const operational = /source-state|runtime dashboard|status dashboard|coverage dashboard|gap dashboard|hash dashboard|test dashboard|service review route/iu;
for (const page of plan.owner_pages) {
  assert.deepEqual(Object.keys(page).sort(), allowedOwnerKeys);
  assert.equal(operational.test(JSON.stringify(page)), false, `${page.owner_page_key} contains operational materialization`);
  assert.deepEqual(Object.keys(page.compositions).sort(), ['desktop', 'mobile']);
  assert.ok(page.foundations.length >= 3);
  assert.ok(page.visual_patterns.length > 0);
  for (const viewport of ['desktop', 'mobile']) {
    assert.deepEqual(Object.keys(page.compositions[viewport]).sort(), ['branch_ids', 'region_ids']);
    assert.ok(page.compositions[viewport].branch_ids.length > 0, `${page.owner_page_key}/${viewport} lacks branch`);
    assert.ok(page.compositions[viewport].region_ids.length > 0, `${page.owner_page_key}/${viewport} lacks regions`);
  }
}

const currentManifestRaw = readFileSync(join(pkg, 'manifest.v1.json'), 'utf8');
const baselineManifestRaw = parentManifestRaw();
const manifest = JSON.parse(currentManifestRaw);
const baselineManifest = JSON.parse(baselineManifestRaw);
assert.equal(manifest.status, candidateStatus);
assert.equal(manifest.corrective_schema_version, 'global-archetype-sot-v1.corrective.v3');
assert.equal(manifest.corrective_parent_sha, baseSha);
assert.equal(manifest.corrective_source_lock_id, sourceLock.source_lock_id);
assert.equal('corrective_handoff' in manifest, false, 'legacy handoff must not be represented as current corrective handoff');
assert.deepEqual(manifest.pinned_handoff, baselineManifest.pinned_handoff);
assert.equal(objectBlock(currentManifestRaw, 'pinned_handoff'), objectBlock(baselineManifestRaw, 'pinned_handoff'), 'pinned_handoff block is not byte-identical');
assert.equal(manifest.corrective_baseline_history.status, baselineManifest.status);
assert.equal(manifest.corrective_baseline_history.pinned_handoff_block_sha256, shaText(objectBlock(baselineManifestRaw, 'pinned_handoff')));
assert.equal(manifest.corrective_contract_manifest_sha256, manifest.corrective_outputs.archetype_contracts.sorted_manifest_sha256);
assert.equal(manifest.corrective_component_graph_sha256, sha(graphPath));
assert.equal(manifest.corrective_ui_materialization_plan_sha256, sha(planPath));
assert.equal(manifest.corrective_outputs.semantic_source_lock.sha256, sha(sourceLockPath));
assert.equal(manifest.corrective_outputs.ui_only_materialization_plan.materialization_scope, 'ui_only');
assert.equal(manifest.corrective_outputs.route_archetype_registry.sha256_before, expectedRouteSha);
assert.equal(manifest.corrective_outputs.route_archetype_registry.sha256_after, expectedRouteSha);
assert.equal(manifest.corrective_outputs.route_archetype_registry.byte_equal, true);
assert.equal(manifest.corrective_unresolved.status, 'EXPLICIT_UNRESOLVED');
assert.ok(manifest.corrective_unresolved.high_risk_state_count > 0);
assert.ok(manifest.corrective_unresolved.component_identity_gate_count > 0);
for (const value of Object.values(manifest.corrective_zero_change_counters)) assert.equal(value, 0);

const handoff = readJson(join(pkg, 'handoff-lock.v1.json'));
assert.equal(sha(join(pkg, 'route-archetype-registry.v1.json')), expectedRouteSha);
assert.equal(handoff.approved_outputs.route_archetype_registry.sha256, expectedRouteSha);
const proof = readJson(join(pkg, 'byte-equality-proof.v1.json'));
assert.equal(proof.status, 'PASS');
assert.equal(proof.corrective_parent_sha, baseSha);
assert.ok(Object.values(proof.equality).every(Boolean));

const contractManifestLines = contractFiles.map((name) => `${sha(join(contractsDir, name))}  catalog/global-archetype-sot-v1/archetype-contracts/${name}\n`).join('');
const contractManifestSha = shaText(contractManifestLines);
assert.equal(contractManifestSha, manifest.corrective_contract_manifest_sha256);

const receipt = readJson(join(pkg, 'corrective-receipt.v1.json'));
assert.equal(receipt.status, 'PASS');
assert.equal(receipt.candidate_status, candidateStatus);
assert.equal(receipt.corrective_parent_sha, baseSha);
assert.equal(receipt.parent_pinned_handoff_byte_equal, true);
assert.equal(receipt.corrective_manifest_sha256, sha(join(pkg, 'manifest.v1.json')));
assert.equal(receipt.source_lock_sha256, sha(sourceLockPath));
assert.equal(receipt.ui_materialization_plan_sha256, sha(planPath));
assert.equal(receipt.corrected_graph_sha256, sha(graphPath));
assert.equal(receipt.sorted_17_contract_manifest_sha256, contractManifestSha);
assert.equal(receipt.route_registry_sha256_before_after.equal, true);
for (const value of Object.values(receipt.zero_change_counters)) assert.equal(value, 0);

const shaManifest = readJson(join(pkg, 'sha256-manifest.v1.json'));
assert.equal(shaManifest.corrective_parent_sha, baseSha);
assert.equal(shaManifest.contract_directory_sorted_manifest_sha256, contractManifestSha);
assert.equal(shaManifest.route_registry_sha256_before_after.before, expectedRouteSha);
assert.equal(shaManifest.route_registry_sha256_before_after.after, expectedRouteSha);
assert.equal(shaManifest.route_registry_sha256_before_after.equal, true);
for (const [path, expected] of Object.entries(shaManifest.files)) assert.equal(sha(join(root, path)), expected, `SHA-256 mismatch ${path}`);
for (const value of Object.values(shaManifest.zero_change_counters)) assert.equal(value, 0);

try {
  execFileSync('git', ['cat-file', '-e', `${baseSha}^{commit}`], { stdio: 'ignore' });
  const changed = execFileSync('git', ['diff', '--name-only', `${baseSha}...HEAD`], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  const allowedExact = new Set([
    '.github/workflows/global-archetype-sot-v1-corrective.yml',
    'catalog/global-archetype-sot-v1/component-composition-graph.v1.json',
    'catalog/global-archetype-sot-v1/byte-equality-proof.v1.json',
    'catalog/global-archetype-sot-v1/source-lock.v1.json',
    'catalog/global-archetype-sot-v1/penpot-materialization-plan.v1.json',
    'catalog/global-archetype-sot-v1/reconciliation-proofs.v1.json',
    'catalog/global-archetype-sot-v1/manifest.v1.json',
    'catalog/global-archetype-sot-v1/corrective-receipt.v1.json',
    'catalog/global-archetype-sot-v1/sha256-manifest.v1.json',
    'scripts/global-archetype-sot-v1/build-corrective.py',
    'scripts/global-archetype-sot-v1/harden-corrective.py',
    'tests/global-archetype-sot-v1-semantic-completeness.test.mjs',
    'tests/global-archetype-sot-v1-corrective-boundaries.test.mjs',
  ]);
  const contractPath = /^catalog\/global-archetype-sot-v1\/archetype-contracts\/[^/]+\.semantic-contract\.v1\.json$/u;
  for (const path of changed) assert.ok(allowedExact.has(path) || contractPath.test(path), `unrelated corrective diff path: ${path}`);
  assert.equal(changed.includes('catalog/global-archetype-sot-v1/route-archetype-registry.v1.json'), false);
  assert.equal(changed.some((path) => path === '.corrective-finalize-trigger' || path === '.tmp-probe-do-not-commit'), false);
  assert.equal(changed.filter((path) => path.startsWith('.github/workflows/')).length, 1);
  assert.equal(changed.some((path) => path.startsWith('penpot/') || path.startsWith('receipts/penpot/')), false);
  assert.equal(changed.some((path) => path === 'AGENTS.md' || path.startsWith('docs/') || path.startsWith('prototypes/')), false);
} catch (error) {
  if (error?.code !== 128 && error?.status !== 128) throw error;
}

console.log(JSON.stringify({
  status: 'PASS',
  candidate_status: candidateStatus,
  contracts: contractFiles.length,
  foundation_signatures: foundationSignatures.size,
  owner_pages: plan.owner_pages.length,
  identity_gate: graph.identity_gate_summary,
  high_risk_unresolved: manifest.corrective_unresolved.high_risk_state_count,
  route_registry_byte_equal: true,
  pinned_handoff_byte_equal: true,
  zero_change_counters: manifest.corrective_zero_change_counters,
}, null, 2));
