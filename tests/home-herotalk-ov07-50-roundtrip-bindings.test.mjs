import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const contract = read('catalog/reconstruction-atlas/v1/home-herotalk-ov07-50-source-exact.v1.json');
const bindings = read('catalog/round-trip-reconstruction/v1/bindings.v1.json');

test('Home round trip stays on the accepted July 30 HeroTalk donor', () => {
  assert.deepEqual(contract.review_items, ['OV-07', 'OV-50']);
  assert.equal(contract.authority.accepted_preview, 'https://kenigevents.ru/preview-20260730-hero-talk-date-donor-r2/');
  assert.equal(contract.penpot.desktop.hero_component_id, 'd87e18f1-dcb4-80a6-8008-88516ef71d68');
  assert.equal(contract.penpot.mobile.hero_component_id, 'c0b867fa-32d2-8062-8008-8d71ad5ce73b');
  assert.equal(contract.penpot.chains.chain_count, 7);
  assert.equal(contract.astro.desktop_mode, 'photo-mosaic generated at runtime');
  assert.equal(contract.astro.mobile_mode, 'text-only');
  assert.equal(contract.astro.manual_controls, false);
  assert.equal(contract.astro.details_block, false);
  assert.equal(contract.astro.fabricated_cta, false);
});

test('Home bindings point to the current accepted linked HeroTalk consumers', () => {
  const archetype = bindings.archetypes.find(({ archetype_id }) => archetype_id === 'archetype.home');
  assert.equal(archetype.source_exact_correction.sha256, sha256(archetype.source_exact_correction.path));
  const desktop = archetype.boards.find(({ viewport }) => viewport === 'desktop');
  const mobile = archetype.boards.find(({ viewport }) => viewport === 'mobile');
  assert.equal(desktop.height, 1431.71875);
  assert.equal(desktop.penpot.revision, 2889);
  assert.equal(desktop.penpot.direct_children[1].component.id, contract.penpot.desktop.hero_component_id);
  assert.equal(mobile.penpot.direct_children[1].component.id, contract.penpot.mobile.hero_component_id);
  const hero = archetype.dependencies.find(({ component_id }) => component_id === 'home.hero-talk');
  assert.equal(hero.source_exact_resolution.status, 'RESOLVED_ACCEPTED_2026_07_30_DONOR');
  assert.equal(hero.source_exact_resolution.communication_chain_count, 7);
});
