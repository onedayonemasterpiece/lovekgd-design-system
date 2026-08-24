import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => JSON.parse(readFileSync(join(root, 'catalog/reconstruction-atlas/v1', path), 'utf8'));

test('semantic atlas covers every checklist archetype and current Astro page', () => {
  const atlas = read('semantic-atlas.v1.json');
  const routes = read('route-registry.v1.json');
  assert.equal(atlas.archetype_count, 17);
  assert.equal(atlas.archetypes.length, 17);
  assert.equal(new Set(atlas.archetypes.map((item) => item.id)).size, 17);
  assert.equal(routes.source_route_coverage_percent, 100);
  assert.deepEqual(routes.unmapped_production_pages, []);
  for (const item of atlas.archetypes) {
    assert.ok(item.anatomy.length > 0, `${item.id} anatomy`);
    assert.ok(item.states.length > 0, `${item.id} states`);
    assert.ok(item.responsive.length >= 2, `${item.id} responsive branches`);
    assert.ok(item.reuse.length > 0, `${item.id} reuse`);
    assert.ok(item.delta.length > 0, `${item.id} delta`);
  }
});

test('browser output covers mobile and desktop for every archetype and binds failures to gaps', () => {
  const browser = read('evidence/browser-observations.v1.json');
  const gaps = read('gap-ledger.v1.json');
  assert.equal(browser.archetype_count, 17);
  assert.equal(browser.observations.length, 67);
  for (const id of new Set(browser.observations.map((item) => item.archetype_id))) {
    const rows = browser.observations.filter((item) => item.archetype_id === id);
    assert.ok(rows.some((item) => item.viewport.id === 'mobile-390x844'), `${id} mobile`);
    assert.ok(rows.some((item) => item.viewport.id === 'desktop-1280x800'), `${id} desktop`);
  }
  const failures = browser.observations.filter((item) => item.navigation_error || (item.response_status ?? 500) >= 400);
  assert.equal(failures.length, 2);
  assert.ok(failures.every((item) => item.archetype_id === 'archetype.interest-clubs'));
  assert.ok(gaps.gaps.some((item) => item.id === 'GAP-CLUB-DETAIL-RUNTIME'));
});

test('semantic SoT keeps Penpot bindings and evidence separate', () => {
  const atlas = read('semantic-atlas.v1.json');
  const foundations = read('foundations.v1.json');
  const penpot = read('penpot/bindings.v1.json');
  const validation = read('validation-report.v1.json');
  assert.doesNotMatch(JSON.stringify(atlas.archetypes), /penpot_component_id|penpot_main_shape_id|review_board_id/u);
  assert.doesNotMatch(JSON.stringify(foundations), /penpot_component_id|penpot_typography_id|penpot_materialization/u);
  assert.equal(penpot.status, 'CHECKPOINTED_DEFERRED_UNTIL_SEMANTIC_ATLAS_VALIDATED');
  assert.equal(validation.status, 'SEMANTIC_ATLAS_READY_FOR_PENPOT_BATCH');
  assert.equal(validation.fail_count, 0);
});

test('dense/stress and review-by-exception policies are explicit', () => {
  const atlas = read('semantic-atlas.v1.json');
  const fixtures = read('fixtures.v1.json');
  assert.match(fixtures.policy.dense_and_stress, /Astro/u);
  assert.match(fixtures.policy.dense_and_stress, /representative linked instances/u);
  assert.equal(atlas.review_semantics.no_interaction, 'NOT_REVIEWED');
  assert.equal(atlas.review_semantics.bounded_feedback_and_verified_correction, 'REVIEWED_BY_EXCEPTION');
  assert.equal(atlas.review_semantics.uncommented, 'NO_RECORDED_OBJECTION');
});
