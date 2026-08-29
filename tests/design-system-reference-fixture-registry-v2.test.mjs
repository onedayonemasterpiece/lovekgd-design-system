import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const repo = resolve(import.meta.dirname, '..');
const read = (path) => JSON.parse(readFileSync(join(repo, path), 'utf8'));
const registryPath = 'catalog/fixtures/design-system-reference/v2/registry.v2.json';
const scenarioPath = 'catalog/fixtures/design-system-reference/v2/scenarios/archetype.collections.free.september.desktop-ready.v3.json';
const mobileScenarioPath = 'catalog/fixtures/design-system-reference/v2/scenarios/archetype.collections.free.september.mobile-ready.v3.json';
const registry = read(registryPath);
const scenario = read(scenarioPath);
const mobileScenario = read(mobileScenarioPath);
const corpus = read('catalog/fixtures/ui-reference-events/v2/corpus.json');
const projection = read('catalog/fixtures/ui-reference-events/v2/projections/free-collection-september.v1.json');

const validate = (instance, schema) => {
  const result = spawnSync('python3', ['-c', 'import json,jsonschema,sys; jsonschema.validate(json.load(open(sys.argv[1])),json.load(open(sys.argv[2])))', join(repo, instance), join(repo, schema)], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
};

test('reference registry v2 is derived from one immutable diverse Golden corpus', () => {
  validate(registryPath, 'contracts/ui-conformance/design-system-reference-fixture-registry.v2.schema.json');
  validate(scenarioPath, 'contracts/ui-conformance/design-system-scenario-projection.v1.schema.json');
  validate(mobileScenarioPath, 'contracts/ui-conformance/design-system-scenario-projection.v1.schema.json');
  assert.equal(registry.golden_corpus.corpus_id, corpus.corpus_id);
  assert.equal(registry.golden_corpus.sha256, corpus.corpus_sha256);
  assert.deepEqual(registry.pools['events.golden.v2'], corpus.fixtures.map((row) => row.fixture_id));
  assert.deepEqual(registry.pools['events.free-collection-september.v1'], projection.fixture_input_order);
  assert.deepEqual(registry.fixtures.map((row) => row.payload_sha256), corpus.fixtures.map((row) => row.preview_event_sha256));
});

test('desktop and mobile scenarios share the immutable corpus clock exactly', () => {
  const expected = {
    reference_iso: '2026-08-29T14:00:00+02:00',
    current_date: '2026-08-29',
    timezone: 'Europe/Kaliningrad',
    locale: 'ru-RU',
    authority: 'catalog/fixtures/ui-reference-events/v2/corpus.json#reference_clock',
    override_kind: 'source-bound-scenario-clock',
  };
  assert.deepEqual(scenario.reference_clock, expected);
  assert.deepEqual(mobileScenario.reference_clock, expected);
  assert.equal(expected.reference_iso, corpus.reference_clock.reference_iso);
  assert.deepEqual(mobileScenario.viewport, { width:390, height:844, dpr:1 });
  assert.deepEqual(mobileScenario.fixture_input_order, scenario.fixture_input_order);
  assert.deepEqual(mobileScenario.expected_render_order, scenario.expected_render_order);
});

test('free collection scenario preserves factual groups, all five cards and flexible full-width rows', () => {
  assert.deepEqual(scenario.fixture_input_order, [
    'event.real.2182', 'event.real.6711', 'event.real.7609', 'event.real.8006', 'event.real.8200',
  ]);
  assert.deepEqual(scenario.expected_render_order, [
    'event.real.8006', 'event.real.8200', 'event.real.2182', 'event.real.6711', 'event.real.7609',
  ]);
  assert.deepEqual(scenario.container_projection.groups.map((row) => row.row_card_counts), [[2], [3]]);
  assert.deepEqual(scenario.container_projection.groups.map((row) => row.row_ratio), ['6x7', '1x1']);
  assert.equal(scenario.container_projection.preserve_all_source_cards, true);
  assert.equal(scenario.container_projection.fill_available_width_per_row, true);
  assert.equal(scenario.acceptance.penpot_linked_instances_required, 5);
  assert.equal(scenario.acceptance.visual_comparison_required, true);
  assert.equal(scenario.component_projection.penpot_archetype_component_id, 'b0fe69fd-ccaf-8025-8008-846f0b7f12cd');
  assert.equal(scenario.container_projection.penpot_container_component_id, 'b0fe69fd-ccaf-8025-8008-847108143471');
});

test('the repeated green Chernyakhovsk programme artwork is a durable exclusion, not a verbal preference', () => {
  const excluded = new Set(projection.explicit_exclusions.flatMap((row) => row.asset_keys));
  for (const key of [
    '3f02c57279fb894be9b734b9cf3f39de134d64292bf3cac43cc9506243b696f0',
    '4717a8978f46b70f3c2a6220f83157c9f041375c936ba1e5c2e4863791cd923e',
    'e76bd4b631c6c03700dcfef1817c65cfe8acc4f3212b74af747dbcd50a3593dd',
    '41bf6f47f7c5e81fff221a2844d08fe3118e3f0f0c7499f4bf94c31ea96e0db8',
  ]) assert.ok(excluded.has(key));
  const selectedAssetKeys = new Set(registry.fixtures
    .filter((row) => scenario.fixture_input_order.includes(row.fixture_id))
    .map((row) => row.asset.url.match(/[a-f0-9]{64}(?=\.webp$)/u)?.[0])
    .filter(Boolean));
  for (const key of excluded) assert.equal(selectedAssetKeys.has(key), false);
});

test('the committed registry and scenario hashes are stable bridge inputs for Astro', () => {
  const sha = (path) => createHash('sha256').update(readFileSync(join(repo, path))).digest('hex');
  assert.equal(sha(scenarioPath), '31dbbe8f8df21e895bd2779dcb234beb5cfdf79bb71e9a96c28cd3faa2170545');
  assert.equal(sha(mobileScenarioPath), '3dfe0a0f999a7714bf9a2ae733f1056cd0be8518d839e90a9932c7a66ae0ea9c');
});
