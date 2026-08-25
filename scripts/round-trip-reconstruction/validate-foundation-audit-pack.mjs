#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(path, 'utf8'));
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const root = 'evidence/round-trip-reconstruction/v1/foundation-audit-pack-v1';
const manifest = read(`${root}/manifest.v1.json`);
const astro = read(`${root}/astro-browser-computed.v1.json`);
const source = read(`${root}/source-and-sot-census.v1.json`);
const penpot = read(`${root}/penpot-instance-census.v1.json`);
const mapping = read(`${root}/current-to-candidate-template.v1.json`);

assert.equal(manifest.status, 'AUDIT_INPUT_READY_NOT_A_FOUNDATION_DECISION');
assert.equal(manifest.coverage.archetypes, 17);
assert.equal(manifest.coverage.boards, 34);
assert.equal(manifest.coverage.direct_ui_links, 34);
assert.equal(manifest.coverage.astro_browser_cases, 34);
assert.equal(manifest.coverage.penpot_census_boards, 34);
assert.deepEqual(manifest.authority.penpot.validation, []);
for (const artifact of manifest.artifacts) {
  assert.equal(hash(artifact.path), artifact.sha256, `stale audit artifact: ${artifact.path}`);
}

assert.equal(astro.cases.length, 34);
assert.equal(astro.colors.length, manifest.coverage.colors.astro_computed_records);
assert.equal(astro.typography.length, manifest.coverage.typography.astro_computed_records);
assert.equal(astro.astro_commit, manifest.authority.astro_commit);
assert.equal(astro.design_system_commit, manifest.authority.design_system_commit);

assert.equal(penpot.file_id, manifest.authority.penpot.file_id);
assert.equal(penpot.revision, manifest.authority.penpot.revision);
assert.deepEqual(penpot.validation, []);
assert.equal(penpot.scope.pages, 17);
assert.equal(penpot.scope.boards, 34);
assert.equal(penpot.observed.colors.length, manifest.coverage.colors.penpot_observed_records);
assert.equal(penpot.observed.typography.length, manifest.coverage.typography.penpot_observed_records);
assert.equal(penpot.library.color_count, manifest.coverage.colors.penpot_library_resources);
assert.equal(penpot.library.typography_count, manifest.coverage.typography.penpot_library_resources);

assert.equal(source.authority.astro_commit, manifest.authority.astro_commit);
assert.equal(source.authority.design_system_commit, manifest.authority.design_system_commit);
assert.equal(source.boundary.observation_only, true);
assert.equal(source.boundary.tokens_changed, false);
assert.equal(source.boundary.colors_merged, false);
assert.equal(source.boundary.typography_merged, false);
assert.equal(source.boundary.independent_audits_required, 2);

assert.equal(mapping.status, 'UNRESOLVED_AWAITING_INDEPENDENT_AUDITS_AND_OWNER_DECISION');
assert.equal(mapping.colors.length, manifest.coverage.colors.mapping_rows);
assert.equal(mapping.typography.length, manifest.coverage.typography.mapping_rows);
for (const row of [...mapping.colors, ...mapping.typography]) {
  assert.equal(row.disposition, 'UNRESOLVED');
  assert.equal(row.candidate_role, null);
  assert.equal(row.owner_decision, null);
}
assert.ok(mapping.prohibitions.some(item => /independent audits/i.test(item)));
console.log(`FOUNDATION_AUDIT_PACK_PASS ${hash(`${root}/manifest.v1.json`)}`);
