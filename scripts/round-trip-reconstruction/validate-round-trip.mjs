#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(path, 'utf8'));
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const bindingsPath = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const bindings = read(bindingsPath);
assert.equal(bindings.cases.length, 34);
assert.equal(bindings.penpot.validation.length, 0);
assert.equal(bindings.penpot.service_resources, 0);
assert.equal(bindings.penpot.direct_children, bindings.penpot.linked_direct_children);
assert.deepEqual(bindings.penpot.detached_direct_children, []);
assert.equal(bindings.penpot.reuse_audit_complete, true);
assert.deepEqual(bindings.penpot.unregistered_terminal_overrides, []);
assert.equal(hash(bindings.authority.manifest.path), bindings.authority.manifest.sha256);

const astroManifest = read('evidence/round-trip-reconstruction/v1/astro/manifest.v1.json');
assert.equal(astroManifest.cases.length, 34, 'Astro capture count');
assert.deepEqual(new Set(astroManifest.cases.map(item => item.case_id)), new Set(bindings.cases.map(item => item.case_id)));
for (const item of astroManifest.cases) {
  assert.equal(item.status, 200, `${item.case_id} HTTP status`);
  assert.ok(existsSync(item.screenshot.path), item.screenshot.path);
  assert.equal(hash(item.screenshot.path), item.screenshot.sha256, `${item.case_id} Astro hash`);
}

const browserReceipt = read('evidence/round-trip-reconstruction/v1/astro-validation/browser-cases.v1.json');
assert.equal(browserReceipt.expected_cases, 34);
assert.equal(browserReceipt.passed_cases, 34);
assert.deepEqual(browserReceipt.failed_cases, []);
assert.ok(browserReceipt.cases.every(item => item.ok && item.status === 200 && item.page_errors.length === 0));

const generationDiff = read('evidence/round-trip-reconstruction/v1/astro-validation/generation-diff.v1.json');
assert.equal(generationDiff.status, 'pass');
assert.equal(generationDiff.generation_diff, 0);
assert.deepEqual(generationDiff.tracked_diff_paths, []);
assert.deepEqual(generationDiff.cached_diff_paths, []);

const missingPenpot = bindings.cases.filter(item => !existsSync(`evidence/round-trip-reconstruction/v1/penpot/${item.case_id}.png`)).map(item => item.case_id);
assert.deepEqual(missingPenpot, [], `missing Penpot exports: ${missingPenpot.join(', ')}`);

const comparisons = read('evidence/round-trip-reconstruction/v1/comparisons/manifest.v1.json');
assert.equal(comparisons.compared_cases, 34, 'comparison coverage');
assert.deepEqual(comparisons.missing_cases, []);
for (const item of comparisons.cases) {
  assert.equal(item.geometry_equal, true, item.case_id);
  for (const evidence of [item.astro, item.penpot, item.overlay, item.diff, item.comparison]) {
    assert.ok(existsSync(evidence.path), evidence.path);
    assert.equal(hash(evidence.path), evidence.sha256, evidence.path);
  }
}

const review = read('catalog/round-trip-reconstruction/v1/owner-review-manifest.v1.json');
const invalidatedArchetypes = new Set((bindings.correction_overlays ?? [])
  .filter(overlay => overlay.comparison_status?.startsWith('INVALIDATED_'))
  .map(overlay => overlay.archetype_id));
const invalidatedCaseIds = bindings.cases.filter(item => invalidatedArchetypes.has(item.archetype_id)).map(item => item.case_id).sort();
assert.equal(review.coverage.reviewable, 34 - invalidatedCaseIds.length);
assert.deepEqual([...review.coverage.missing].sort(), invalidatedCaseIds);
assert.equal(new Set(review.cases.map(item => item.penpot.direct_url)).size, 34);

const replay = read('evidence/round-trip-reconstruction/v1/penpot/replay-receipt.v1.json');
assert.equal(replay.mode, 'actual_idempotent_ensure_replay');
assert.equal(replay.component_count_before, replay.component_count_after);
assert.equal(replay.creates, 0);
assert.deepEqual(replay.validation, []);
assert.ok(replay.phases.length >= 4);
assert.ok(replay.phases.every(phase => phase.creates === 0));
assert.equal(replay.assertions.actual_materializer_entrypoints_invoked, true);
assert.equal(replay.assertions.stable_component_ids_unchanged, true);
assert.equal(replay.assertions.detached_copies_created, 0);
assert.equal(replay.assertions.service_resources_created, 0);
console.log('ROUND_TRIP_VALIDATION_PASS');
