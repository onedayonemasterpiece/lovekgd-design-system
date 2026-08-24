import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (file) => JSON.parse(fs.readFileSync(new URL(`../catalog/reconstruction-atlas/v1/${file}`, import.meta.url)));
const audit = read('penpot/closure-audit.v1.json');
const bindings = read('penpot/bindings.v1.json');
const completion = read('completion-report.v1.json');
const testSummary = read('test-summary.v1.json');

test('all archetypes have three native projections on bounded pages', () => {
  assert.equal(audit.pages.length, 17);
  assert.equal(audit.counts.projections, 51);
  assert.ok(audit.pages.every((p) => p.top_level_count === 3));
  assert.ok(audit.pages.every((p) => p.projections.every((x) => x.shape_id && x.component_id && x.match_count === 1)));
});

test('closure has no detached copies, unregistered overrides or validation findings', () => {
  assert.equal(audit.gates.detached_count, 0);
  assert.equal(audit.gates.unregistered_override_count, 0);
  assert.deepEqual(audit.gates.validation, []);
  assert.equal(audit.gates.idempotency_replay_created, 0);
});

test('sampled conformance passes and renderer export delta is explicit', () => {
  assert.equal(audit.gates.sampled_conformance_pass, true);
  assert.ok(audit.samples.every((sample) => sample.status === 'PASS'));
  assert.deepEqual(audit.renderer_deltas.map((d) => d.status), ['NON_BLOCKING']);
});

test('one linked review route covers every archetype', () => {
  assert.equal(bindings.review_route.linked_row_count, 17);
  assert.ok(bindings.review_route.rows.every((row) => row.is_copy));
  assert.match(bindings.review_route.url, /page-id=d87e18f1-dcb4-80a6-8008-8810544e6b8f/);
});

test('completion report is ready', () => {
  assert.equal(completion.status, 'RECONSTRUCTION_ATLAS_READY');
  assert.equal(completion.fail_count, 0);
});

test('required atlas suite passes and broader stale receipt failure is registered', () => {
  assert.equal(testSummary.required_scope.status, 'PASS');
  assert.equal(testSummary.required_scope.failed, 0);
  assert.equal(testSummary.broader_suite.failed, 1);
  assert.equal(testSummary.broader_suite.registered_out_of_scope_failures[0].impact_on_atlas, 'NONE');
});
