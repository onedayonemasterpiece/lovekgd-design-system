import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const helper = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-bounded-export.js', import.meta.url), 'utf8');
const materializer = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-free-collection-september-v2.js', import.meta.url), 'utf8');

test('bounded export uses plugin-context PNG bytes and chunked retrieval after export_shape 504', () => {
  assert.match(helper, /shape\.export\(\{ type \}\)/u);
  assert.match(helper, /storage\[storageKey\] = base64/u);
  assert.match(helper, /readBoundedExportChunk/u);
  assert.match(helper, /48_000/u);
});

test('bounded review remains the exact three-card Golden Corpus exhibition row', () => {
  for (const id of [2182, 6711, 7609]) assert.ok(materializer.includes(`  ${id}: {`));
  assert.match(materializer, /ORDER = \[8006, 8200, 2182, 6711, 7609\]/u);
  assert.match(materializer, /UNIFIED_CARD_PATH = 'Event cards \/ Large \/ Unified Golden v2'/u);
  assert.doesNotMatch(materializer, /\.detach\(/u);
});
