import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const sha256 = async (path) => createHash('sha256').update(await readFile(new URL(path, import.meta.url))).digest('hex');

const scenario = await readJson('../catalog/fixtures/design-system-reference/v1/scenarios/archetype.collections.free.desktop-ready.v1.json');
const astro = await readJson('../evidence/recovery-20260829/astro/free-collection-5-desktop-evidence.v1.json');
const penpot = await readJson('../evidence/recovery-20260829/penpot/free-collection-5-desktop-structural-readback.v1.json');
const ownerStates = await readJson('../evidence/recovery-20260829/penpot/free-collection-5-desktop-owner-states-readback.v1.json');
const receipt = await readJson('../evidence/recovery-20260829/free-collection-5-desktop-three-way-proof.v1.json');
const consumerProjection = await readJson('../evidence/recovery-20260829/astro/design-system-reference-fixtures.v2.json');

const close = (actual, expected, tolerance = 0.02) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} must be within ${tolerance}px of ${expected}`);
};

test('Astro, UI SoT and Penpot use the same five identities in actual packer order', () => {
  const expected = scenario.expected_render_order.map((id) => Number(id.split('.').at(-1)));
  assert.deepEqual(expected, [7006, 6996, 6997, 7030, 6901]);
  assert.deepEqual(astro.cards.map(({ id }) => id), expected);
  assert.deepEqual(penpot.cards.map(({ eventId }) => eventId), expected);
  assert.equal(astro.heading, scenario.acceptance.heading);
  assert.equal(penpot.heading, scenario.acceptance.heading);
});

test('Penpot reproduces the Astro 3+2 packed-row geometry within subpixel tolerance', () => {
  const astroOrigin = { x: astro.grid.x, y: astro.grid.y };
  const penpotOrigin = { x: penpot.cards[0].localX, y: penpot.cards[0].localY };
  astro.cards.forEach((card, index) => {
    const projected = penpot.cards[index];
    close(projected.localX - penpotOrigin.x, card.rect.x - astroOrigin.x);
    close(projected.localY - penpotOrigin.y, card.rect.y - astroOrigin.y);
    close(projected.width, card.rect.width);
    close(projected.height, card.rect.height);
  });
  assert.deepEqual(scenario.container_projection.row_card_counts, [3, 2]);
});

test('every Penpot adapter has exactly one linked canonical EventCard and no detached card root', () => {
  assert.equal(penpot.linkedCanonicalRootCount, 5);
  assert.equal(penpot.detachedCanonicalRootCount, 0);
  assert.deepEqual(penpot.validation, []);
  for (const card of penpot.cards) {
    assert.equal(card.linkedCanonicalRoots.length, 1);
    assert.equal(card.linkedCanonicalRoots[0].componentId, scenario.component_projection.penpot_component_id);
    assert.equal(card.linkedCanonicalRoots[0].detached, false);
  }
});

test('the actual Penpot owner exposes top, scrolled and full-scroll review states', () => {
  const expected = [7006, 6996, 6997, 7030, 6901];
  assert.match(ownerStates.baseViewport.name, /state=top/u);
  assert.equal(ownerStates.baseViewport.height, 1200);
  assert.equal(ownerStates.baseViewport.clipContent, true);
  assert.deepEqual(ownerStates.scrolledViewport.cards.map(({ eventId }) => eventId), expected);
  assert.deepEqual(ownerStates.fullScrollProof.cards.map(({ eventId }) => eventId), expected);
  assert.deepEqual([ownerStates.scrolledViewport.compactMedallion.width, ownerStates.scrolledViewport.compactMedallion.height], [58, 58]);
  assert.equal(ownerStates.fullScrollProof.height, astro.document.height);
  assert.equal(ownerStates.fullScrollProof.clipContent, false);
  assert.equal(ownerStates.fullScrollProof.footer.componentId, 'a21f5e36-5d76-8065-8008-86af602ad62a');
  assert.deepEqual(ownerStates.validation, []);
  ownerStates.fullScrollProof.cards.forEach((card, index) => {
    close(card.x, astro.cards[index].rect.x, 3);
    close(card.y - ownerStates.fullScrollProof.y, astro.cards[index].rect.y, 3);
  });
});

test('proof receipt pins every durable input and does not turn a 504 into visual acceptance', async () => {
  assert.equal(receipt.status, 'OWNER_STATE_STRUCTURAL_PASS_PENPOT_VISUAL_EXPORT_BLOCKED');
  assert.equal(receipt.ui_sot.registry.sha256, await sha256('../catalog/fixtures/design-system-reference/v1/registry.v1.json'));
  assert.equal(receipt.ui_sot.scenario.sha256, await sha256('../catalog/fixtures/design-system-reference/v1/scenarios/archetype.collections.free.desktop-ready.v1.json'));
  assert.equal(receipt.astro.evidence.sha256, await sha256('../evidence/recovery-20260829/astro/free-collection-5-desktop-evidence.v1.json'));
  assert.equal(receipt.astro.consumer_projection.sha256, await sha256('../evidence/recovery-20260829/astro/design-system-reference-fixtures.v2.json'));
  assert.equal(consumerProjection.authority.ui_sot_contract_sha256, receipt.ui_sot.registry.sha256);
  assert.equal(consumerProjection.authority.ui_sot_scenario_sha256, receipt.ui_sot.scenario.sha256);
  assert.deepEqual(consumerProjection.scenarios[receipt.scenario_id].event_ids, [7030, 7006, 6901, 6996, 6997]);
  assert.equal(receipt.penpot.structural_readback.sha256, await sha256('../evidence/recovery-20260829/penpot/free-collection-5-desktop-structural-readback.v1.json'));
  assert.equal(receipt.penpot.owner_states_readback.sha256, await sha256('../evidence/recovery-20260829/penpot/free-collection-5-desktop-owner-states-readback.v1.json'));
  assert.equal(receipt.penpot.visual_export.status, 'BLOCKED_HTTP_504');
  assert.equal(receipt.penpot.visual_export.visual_acceptance_claimed, false);
  assert.equal(receipt.known_out_of_scope_defect.status, 'OPEN_NOT_HIDDEN');
  assert.equal(receipt.correction.visual_acceptance_claimed, false);
});
