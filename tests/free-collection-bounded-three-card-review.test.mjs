import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const helper = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-bounded-export.js', import.meta.url), 'utf8');
const materializer = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-free-collection-september-v2.js', import.meta.url), 'utf8');
const projection = JSON.parse(await readFile(new URL('../catalog/fixtures/ui-reference-events/v2/projections/free-collection-september.v1.json', import.meta.url), 'utf8'));
const bundle = JSON.parse(await readFile(new URL('../catalog/materialization-bundles/free-collection-page.unresolved.draft-v1.json', import.meta.url), 'utf8'));

test('bounded export uses plugin-context PNG bytes and chunked retrieval after export_shape 504', () => {
  assert.match(helper, /shape\.export\(\{ type \}\)/u);
  assert.match(helper, /storage\[storageKey\] = base64/u);
  assert.match(helper, /readBoundedExportChunk/u);
  assert.match(helper, /48_000/u);
});

test('bounded review derives the exact three-card exhibition row from Golden Corpus v2', () => {
  assert.deepEqual(projection.expected_groups.exhibitions, [
    'event.real.2182',
    'event.real.6711',
    'event.real.7609',
  ]);
  assert.equal(
    bundle.fixture_authority.groups_ref,
    'catalog/fixtures/ui-reference-events/v2/projections/free-collection-september.v1.json#/expected_groups',
  );
  assert.deepEqual(bundle.fixture_authority.render_order_derivation.group_order, ['events', 'exhibitions']);
  assert.equal(bundle.promotion_state, 'BLOCKED_UNRESOLVED_LIVE_INPUTS');
  assert.doesNotMatch(materializer, /const\s+(?:EVENTS|ORDER|GEOMETRY)\s*=/u);
  assert.doesNotMatch(materializer, /\.detach\(/u);
});
