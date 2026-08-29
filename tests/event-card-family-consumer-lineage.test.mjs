import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const contract = JSON.parse(readFileSync(new URL('../catalog/ui-components/event-card-family/consumer-lineage.v1.json', import.meta.url), 'utf8'));

test('event-card family requires one Penpot owner while preserving Astro adapters', () => {
  assert.equal(contract.canonical_family.single_penpot_root_required, true);
  assert.equal(contract.canonical_family.visual_similarity_is_not_lineage, true);
  assert.deepEqual(contract.canonical_family.representations.map((item) => item.id), [
    'large',
    'listing-compact',
    'mobile-rail-track',
  ]);
  assert.match(contract.authority.supersession_scope, /Penpot family\/root ownership/u);
});

test('audited Atlas consumers are source-locked and not declared closed', () => {
  const pages = new Set(contract.consumer_map.map((item) => item.atlas_page.replace(/ mobile$/u, '')));
  for (const page of ['63.01 Home', '63.02 Date listing', '63.03 Weekend listing', '63.04 Popular listing', '63.05 Unusual listing', '63.06 Search final results', '63.07 Event details related feed']) {
    assert.ok(pages.has(page), `missing ${page}`);
  }
  assert.equal(contract.penpot_gate.status, 'PAUSED_OWNER_CLOSED_WINDOW');
  assert.equal(contract.penpot_gate.canonical_component_id, null);
  assert.ok(contract.penpot_gate.forbidden.includes('visually similar but unrelated root'));
});
