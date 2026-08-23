import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const repo = resolve(import.meta.dirname, '..');
const base = join(repo, 'catalog/page-archetypes/date-listing-shell-v1');
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

const manifest = read(join(base, 'fixture-manifest.v1.json'));
const foundations = read(join(base, 'foundations.v1.json'));
const dependencies = read(join(base, 'dependency-lock.v1.json'));
const components = read(join(base, 'component-contract.v1.json'));
const decisions = read(join(base, 'decision-ledger.v1.json'));

assert.equal(manifest.manifest_id, 'archetype.listing.date-shell-v1.golden-v1');
assert.equal(manifest.fixtures.length, 7);
assert.deepEqual(manifest.representations.map((item) => item.order), [1, 2, 3, 4, 5, 6, 7]);
assert.equal(new Set(manifest.representations.map((item) => item.id)).size, 7);
assert.equal(manifest.canonical, false);
assert.equal(manifest.promoted, false);
assert.equal(manifest.production_deployed, false);

const fixtureIds = new Set(manifest.fixtures.map((fixture) => fixture.fixture_id));
for (const representation of manifest.representations) {
  for (const fixtureId of representation.fixture_ids) {
    assert(fixtureIds.has(fixtureId), `${representation.id} references unknown ${fixtureId}`);
  }
}
for (const fixture of manifest.fixtures) {
  const payloadPath = join(repo, fixture.payload_path);
  const payload = read(payloadPath);
  assert.equal(payload.fixture_id, fixture.fixture_id);
  assert.equal(payload.preview_event_sha256, fixture.preview_event_sha256);
  assert.equal(sha256(payloadPath), fixture.payload_file_sha256);
}

assert.equal(foundations.semantic_colors.canvas, '#fbf7ef');
assert.equal(foundations.containers.desktop_max_px, 1180);
assert.equal(foundations.breakpoints.mobile_listing_max_px, 720);
assert.equal(foundations.breakpoints.mobile_shell_max_px, 759);
assert.equal(foundations.typography.renderer_resolution.astro_source_max_weight, 920);
assert.equal(foundations.typography.renderer_resolution.penpot_display_resolved_weight, 900);
assert.equal(foundations.typography.renderer_resolution.penpot_line_height_mode, 'unitless_ratio');
assert(foundations.accessibility.minimum_target_px >= 44);
assert(foundations.accessibility.safe_areas.length === 4);

assert.deepEqual(dependencies.dependencies.map((item) => item.semantic_id), [
  'event.card.large',
  'listing.event-card.compact',
  'listing.rail-row.track',
  'social-proof.like.compact36',
]);
assert(components.body_components.some((item) => item.id === 'listing.desktop-flow'));
assert(components.body_components.some((item) => item.id === 'listing.page-date-header.specific-date'));
assert(components.body_components.some((item) => item.id === 'listing.date-nav-item.wide'));
assert(components.body_components.some((item) => item.id === 'listing.time-group-header.sparse'));
assert(components.archetype_variants.some((item) => item.id === 'archetype.listing.date.sparse'));
assert(components.body_components.some((item) => item.id === 'listing.mobile-rail-viewport'));
assert(components.body_components.some((item) => item.id === 'listing.mobile-date-accessory'));
assert(components.body_components.some((item) => item.id === 'listing.mobile-date-chip'));
assert(components.body_components.some((item) => item.id === 'listing.mobile-calendar-trigger'));
assert.equal(foundations.mobile_fixed_stack_px.content_clearance_without_safe_area, 120);
assert(components.composition_rules.some((rule) => /one centered chronological column/.test(rule)));
assert(components.shell_components.some((item) => item.id === 'shell.mobile-menu'));
assert(components.shell_components.some((item) => item.id === 'shell.footer'));
assert(decisions.decisions.some((item) => item.id === 'DL-003' && /explicit semantic states/.test(item.decision)));
assert(decisions.decisions.some((item) => item.id === 'DL-007' && /Penpot display styles resolve it/.test(item.decision)));
assert(decisions.decisions.some((item) => item.id === 'DL-008' && /unitless ratio/.test(item.decision)));

console.log('date-listing-shell-v1.test: PASS (fixtures, representations, foundations, dependencies, states, shell)');
