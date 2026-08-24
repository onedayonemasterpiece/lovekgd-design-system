import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '..');
const base = join(repo, 'catalog/page-archetypes/weekend-listing-v1');
const manifest = JSON.parse(readFileSync(join(base, 'fixture-manifest.v1.json')));
const contract = JSON.parse(readFileSync(join(base, 'component-contract.v1.json')));
const ledger = JSON.parse(readFileSync(join(base, 'decision-ledger.v1.json')));
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

assert.equal(manifest.manifest_id, 'archetype.listing.weekend-v1.golden-v1');
assert.equal(manifest.lifecycle, 'candidate');
assert.equal(manifest.canonical, false);
assert.equal(manifest.promoted, false);
assert.equal(manifest.production_deployed, false);
assert.deepEqual(manifest.weekend_range, {
  start: '2026-08-22', end: '2026-08-23', date_label: '22–23 августа', route: '/vyhodnye/'
});
assert.deepEqual(manifest.fixtures.map((item) => item.fixture_id), ['event.real.7807', 'event.real.7906']);
for (const fixture of manifest.fixtures) {
  const payload = readFileSync(join(repo, fixture.payload_path));
  assert.equal(sha256(payload), fixture.payload_file_sha256);
  const parsed = JSON.parse(payload);
  assert.equal(parsed.fixture_id, fixture.fixture_id);
  assert.equal(parsed.preview_event_sha256, fixture.preview_event_sha256);
  assert.equal(parsed.preview_event.start_date, '2026-08-22');
}
assert.deepEqual(manifest.representations.map((item) => item.id), [
  'typical-desktop', 'typical-mobile', 'sparse', 'empty', 'stress'
]);
assert.deepEqual(manifest.representations.map((item) => item.order), [1,2,3,4,5]);
assert.equal(manifest.representations.find((item) => item.id === 'empty').fixture_ids.length, 0);
assert.deepEqual(manifest.representations.find((item) => item.id === 'stress').fixture_ids, ['event.real.7807','event.real.7906']);
assert.equal(manifest.ranges.length, 6);

assert.equal(contract.reuse_first, true);
assert.ok(contract.common_dependencies.includes('listing-foundations-candidate-v1'));
assert.ok(contract.common_dependencies.includes('site-shell-v1'));
assert.deepEqual(contract.weekend_delta.map((item) => item.id), [
  'listing.weekend-range-navigation',
  'listing.weekend-day-header',
  'listing.weekend-time-marker',
  'listing.weekend-editorial-timeline',
  'archetype.listing.weekend'
]);
assert.equal(new Set(ledger.decisions.map((item) => item.id)).size, ledger.decisions.length);
assert.ok(ledger.decisions.some((item) => item.id === 'WL-003' && item.decision.includes('event.real.7888')));

console.log('weekend-listing-v1.test: PASS (frozen fixtures, honest states, reuse-first delta)');
