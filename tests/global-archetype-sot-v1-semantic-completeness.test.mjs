#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('.');
const pkg = join(root, 'catalog/global-archetype-sot-v1');
const astroRoot = resolve(process.env.EVENTS_BOT_ROOT ?? '.astro-source');
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const sha = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const required = {
  'event-detail': [
    'layout.editorial-wide', 'layout.split-poster', 'layout.editorial-with-poster-companion', 'layout.no-image',
    'mobile-media.single', 'mobile-media.poster', 'mobile-media.gallery', 'mobile-media.no-image',
    'transport.rail', 'transport.bus', 'transport.kaup', 'transport.multiple', 'transport.absent',
    'transport.unavailable', 'transport.stale', 'transport.error', 'question-cta',
    'feedback-boundary.page-feedback', 'feedback-boundary.event-error-report',
  ],
  'focus-group': ['feedback.overall-nps', 'feedback.page-usefulness', 'feedback.improvement-suggestion', 'feedback.event-error-report'],
  search: ['search.validation', 'search.progress', 'search.loading', 'search.results', 'search.empty', 'search.error', 'search.retry', 'search.stale', 'search.load-more', 'search.timeout', 'search.recovery'],
  favorites: ['favorites.local-only', 'favorites.auth-required', 'favorites.reconciling', 'favorites.populated', 'favorites.empty', 'favorites.catalog-failure', 'favorites.cloud-failure', 'favorites.action-refresh'],
  'personal-feed': ['personal-feed.consent', 'personal-feed.profile-insufficient', 'personal-feed.profile-ready', 'personal-feed.profile-deleted', 'personal-feed.loading', 'personal-feed.empty', 'personal-feed.populated', 'personal-feed.stale', 'personal-feed.error', 'personal-feed.hidden', 'personal-feed.restore', 'personal-feed.storage-failure'],
};

const contractsDir = join(pkg, 'archetype-contracts');
const contractFiles = readdirSync(contractsDir).filter((name) => name.endsWith('.semantic-contract.v1.json')).sort();
assert.equal(contractFiles.length, 17);
const contracts = Object.fromEntries(contractFiles.map((name) => [name.replace('.semantic-contract.v1.json', ''), readJson(join(contractsDir, name))]));

for (const [slug, stateIds] of Object.entries(required)) {
  const contract = contracts[slug];
  assert.ok(contract, `missing contract ${slug}`);
  const rows = new Map(contract.evidence_bound_states.map((row) => [row.state_id, row]));
  for (const stateId of stateIds) {
    assert.ok(rows.has(stateId), `${slug} missing requested state ${stateId}`);
    const row = rows.get(stateId);
    assert.ok(['observed', 'unresolved'].includes(row.disposition), `${slug}/${stateId} invalid disposition`);
    if (row.disposition === 'observed') {
      assert.ok(row.source_refs.length > 0 || row.browser_observation_refs.length > 0, `${slug}/${stateId} observed without evidence`);
    } else {
      assert.ok(row.unresolved_reason, `${slug}/${stateId} unresolved without reason`);
    }
    for (const ref of row.source_refs) {
      assert.equal(ref.repository, 'onedayonemasterpiece/events-bot-new');
      assert.equal(ref.commit, '7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00');
      assert.match(ref.line_sha256, /^[0-9a-f]{64}$/u);
      if (existsSync(astroRoot)) {
        const sourcePath = join(astroRoot, ref.path);
        assert.ok(existsSync(sourcePath), `missing exact Astro source ${ref.path}`);
        const line = readFileSync(sourcePath, 'utf8').split(/\r?\n/u)[ref.line_start - 1] ?? '';
        const lineHash = createHash('sha256').update(line).digest('hex');
        assert.equal(lineHash, ref.line_sha256, `Astro line hash drift ${ref.path}:${ref.line_start}`);
      }
    }
  }
}

const sourceLockPath = join(pkg, 'source-lock.v1.json');
const sourceLockText = readFileSync(sourceLockPath, 'utf8').toLowerCase();
for (const forbidden of ['/penpot/', 'materialization-ir', 'renderer', 'penpot_component_id', 'penpot_main_shape_id']) {
  assert.equal(sourceLockText.includes(forbidden), false, `semantic source lock contains ${forbidden}`);
}

const foundationSignatures = new Set();
for (const [slug, contract] of Object.entries(contracts)) {
  assert.ok(Array.isArray(contract.foundations_usage) && contract.foundations_usage.length > 0, `${slug} lacks foundations usage`);
  for (const usage of contract.foundations_usage) {
    assert.equal(usage.consumer_archetype, contract.archetype_id, `${slug} foundation is not consumer-bound`);
    assert.match(usage.source_ref, /^catalog\/reconstruction-atlas\/v1\/foundations\.v1\.json#/u);
  }
  foundationSignatures.add(contract.foundations_usage.map((item) => item.foundation_group).join('|'));
}
assert.ok(foundationSignatures.size >= 8, `foundations usage remains non-specific: ${foundationSignatures.size} signatures`);

const graph = readJson(join(pkg, 'component-composition-graph.v1.json'));
for (const node of graph.nodes) {
  if (!node || typeof node !== 'object') continue;
  const disposition = node.disposition;
  if (['reuse_existing', 'new_component'].includes(disposition)) {
    assert.ok(Array.isArray(node.source_identity_contract) && node.source_identity_contract.length > 0, `${node.component_id ?? node.id} lacks source identities`);
    for (const identity of node.source_identity_contract) {
      assert.ok(identity.source_identity_id);
      assert.ok(Array.isArray(identity.source_refs) && identity.source_refs.length > 0, `${node.component_id ?? node.id}/${identity.source_identity_id} lacks exact refs`);
    }
    if (node.source_identity_contract.length > 1) {
      assert.ok(node.identity_gate?.reconciliation_proof_ref, `${node.component_id ?? node.id} merges identities without reconciliation`);
    }
  }
  if (['document.typography', 'listing.page-pattern'].includes(node.component_id ?? node.id) && node.source_identity_contract?.length > 1) {
    assert.equal(disposition, 'unresolved', `${node.component_id ?? node.id} speculative merge was not closed`);
  }
}
for (const contract of Object.values(contracts)) {
  for (const dependency of contract.component_dependencies ?? []) {
    if (['reuse_existing', 'new_component'].includes(dependency.disposition)) {
      assert.ok(dependency.source_identity_contract?.length > 0, `${contract.archetype_id}/${dependency.component_id} lacks exact identity contract`);
    }
  }
}

const plan = readJson(join(pkg, 'penpot-materialization-plan.v1.json'));
assert.equal(plan.materialization_scope, 'ui_only');
assert.equal(plan.owner_pages.length, 17);
const forbiddenOwnerContent = /source-state|runtime dashboard|status dashboard|coverage dashboard|gap dashboard|hash dashboard|test dashboard|service review route/iu;
for (const ownerPage of plan.owner_pages) {
  const serialized = JSON.stringify(ownerPage);
  assert.equal(forbiddenOwnerContent.test(serialized), false, `${ownerPage.owner_page_key} contains service/operational materialization`);
  assert.ok(ownerPage.foundations.length > 0);
  assert.ok(ownerPage.compositions.desktop && ownerPage.compositions.mobile);
  assert.ok(Array.isArray(ownerPage.ui_components));
  assert.ok(Array.isArray(ownerPage.visual_patterns));
  assert.ok(Array.isArray(ownerPage.visual_states));
}

const handoff = readJson(join(pkg, 'handoff-lock.v1.json'));
assert.equal(sha(join(pkg, 'route-archetype-registry.v1.json')), handoff.approved_outputs.route_archetype_registry.sha256, 'route registry lost byte equality');
const proof = readJson(join(pkg, 'byte-equality-proof.v1.json'));
assert.equal(proof.status, 'PASS');
assert.ok(Object.values(proof.equality).every(Boolean));

const receipt = readJson(join(pkg, 'corrective-receipt.v1.json'));
assert.equal(receipt.status, 'PASS');
assert.equal(receipt.route_registry_sha256_before_after.equal, true);
const shaManifest = readJson(join(pkg, 'sha256-manifest.v1.json'));
for (const [path, expectedHash] of Object.entries(shaManifest.files)) {
  assert.equal(sha(join(root, path)), expectedHash, `SHA-256 mismatch for ${path}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  high_risk_contracts: Object.keys(required),
  contract_count: contractFiles.length,
  changed_contracts: receipt.changed_contracts.map((item) => item.file),
  route_registry_byte_equal: true,
  foundation_signatures: foundationSignatures.size,
  identity_gate: graph.identity_gate_summary,
}, null, 2));
