import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const contract = JSON.parse(readFileSync(new URL('../catalog/ui-components/hero-talk/accepted-donor-and-chains.v1.json', import.meta.url), 'utf8'));

test('Hero-talk SoT pins the accepted donor and rejects the fabricated card anatomy', () => {
  assert.equal(contract.status, 'CURRENT_COMPLETE');
  assert.equal(contract.authority.accepted_astro_commit, '0eaf08c6827d5b2cbd4c2603380dd13a36be1ada');
  assert.equal(contract.authority.restored_astro_commit, '4243401a4');
  assert.deepEqual(contract.accepted_donor.desktop_1440.grid, {
    columns: 16,
    rows: 5,
    visible_tiles: 80,
    column_gap: 3,
    row_gap: 0,
  });
  assert.equal(contract.accepted_donor.mobile_390.media_display, 'none');
  assert.equal(contract.accepted_donor.runtime.manual_previous_next_controls, false);
  assert.equal(contract.accepted_donor.runtime.details_block, false);
  assert.equal(contract.accepted_donor.runtime.cta_button, false);
});

test('Hero-talk chain page has the source-required bounded chains', () => {
  const ids = new Set(contract.chains.map((chain) => chain.id));
  for (const id of [
    'intrasession-return-delta',
    'page-end-festival',
    'page-end-calendar-save',
    'page-end-club',
    'cross-session-festival',
    'feature-smart-search',
    'feature-first-artifact',
  ]) assert.ok(ids.has(id), `missing ${id}`);
  assert.ok(contract.chains.every((chain) => chain.nodes.length >= 2));
  assert.match(contract.penpot_projection.desktop_visual, /overlay/u);
  assert.match(contract.penpot_projection.mobile_visual, /text-only/u);
});
