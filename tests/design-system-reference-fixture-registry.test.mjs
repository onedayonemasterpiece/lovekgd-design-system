import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const registry = await readJson('../catalog/fixtures/design-system-reference/v1/registry.v1.json');
const scenario = await readJson('../catalog/fixtures/design-system-reference/v1/scenarios/archetype.collections.free.desktop-ready.v1.json');
const routes = await readJson('../catalog/global-archetype-sot-v1/route-archetype-registry.v1.json');
const documentation = await readFile(new URL('../docs/ui-reference-fixture-registry.md', import.meta.url), 'utf8');

test('the canonical archetype event pool is five immutable factual identities', () => {
  assert.equal(registry.schema_version, 'design-system-reference-fixture-registry.v1');
  assert.equal(registry.registry_id, 'design-system-reference-v1');
  const pool = registry.pools['events.archetype-core.v1'];
  assert.deepEqual(pool, ['event.real.7030', 'event.real.7006', 'event.real.6901', 'event.real.6996', 'event.real.6997']);
  assert.equal(new Set(pool).size, 5);
  assert.deepEqual(registry.fixtures.map((fixture) => fixture.fixture_id), pool);
  for (const fixture of registry.fixtures) {
    assert.match(fixture.payload_sha256, /^[0-9a-f]{64}$/u);
    if (fixture.asset) assert.match(fixture.asset.sha256, /^[0-9a-f]{64}$/u);
  }
  assert.equal(registry.fixtures.find((fixture) => fixture.source_id === 6996).asset, null);
});

test('free collection scenario binds route, components, container and actual rendered order separately', () => {
  assert.equal(scenario.scenario_id, 'free-collection-5-desktop-v1');
  assert.equal(scenario.route_ref.archetype_id, 'archetype.collections');
  assert.ok(routes.generated_routes.some((route) => route.public_path === scenario.route_ref.route && route.archetype_id === 'archetype.collections'));
  assert.deepEqual(scenario.fixture_input_order, registry.pools['events.archetype-core.v1']);
  assert.deepEqual(scenario.expected_render_order, ['event.real.7006', 'event.real.6996', 'event.real.6997', 'event.real.7030', 'event.real.6901']);
  assert.equal(scenario.component_projection.family, 'event-card-family');
  assert.equal(scenario.container_projection.semantic_id, 'event-card-equal-height-grid');
  assert.deepEqual(scenario.container_projection.row_card_counts, [3, 2]);
  assert.equal(scenario.acceptance.penpot_linked_instances_required, 5);
});

test('documentation keeps distinct container families and forbids page-local fixture arrays', () => {
  for (const phrase of ['EventCard equal-height grid', 'Desktop listing rows', 'Festival timeline rows', 'Interest-club grid']) {
    assert.match(documentation, new RegExp(phrase, 'u'));
  }
  assert.match(documentation, /Page-local fixture ID arrays are forbidden/u);
});
