import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const contract = await readJson('../catalog/reconstruction-atlas/v1/personal-feed-ov36-37-source-exact.v1.json');
const receipt = await readJson('../evidence/recovery-20260829/penpot/personal-feed-ov36-37-native-receipt.v1.json');
const browser = await readJson('../evidence/recovery-20260829/astro/ov36-37-personal-feed-browser-evidence.v1.json');
const materializer = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-personal-feed-ov36-37-native.js', import.meta.url), 'utf8');

test('OV-36/37 binds the always-nonempty personal feed to current Astro', () => {
  assert.deepEqual(contract.review_items, ['OV-36', 'OV-37']);
  assert.equal(contract.authority.astro_commit, 'bebb49b3ae5478cbb7d8f7c3ca303bd0c357bbbf');
  assert.equal(contract.owner_requirements.feed_is_never_blank, true);
  assert.deepEqual(contract.owner_requirements.authentication_choices, ['email', 'yandex']);
  assert.equal(contract.owner_requirements.extra_personalization_consent, false);
  assert.equal(browser.viewports.desktop.workspaceHidden, false);
  assert.equal(browser.viewports.mobile.workspaceHidden, false);
  assert.equal(browser.viewports.desktop.consentPresent, false);
  assert.equal(browser.viewports.mobile.consentPresent, false);
});

test('OV-37 preserves three desktop columns and one mobile column with exact fixtures', () => {
  assert.equal(browser.viewports.desktop.columns, '350px 350px 350px');
  assert.equal(browser.viewports.mobile.columns, '324px');
  assert.deepEqual(contract.bounded_penpot_projection.representative_events.map(({ event_id }) => event_id), [5459, 6870, 6941]);
  assert.equal(contract.penpot.desktop.columns, 3);
  assert.equal(contract.penpot.mobile.columns, 1);
  assert.deepEqual(receipt.native_readback.representative_event_ids, [5459, 6870, 6941]);
});

test('OV-36/37 Penpot owners are native linked compositions, not full-page raster proxies', () => {
  assert.equal(contract.penpot.source_projection_count, 0);
  assert.equal(receipt.native_readback.source_projection_count, 0);
  assert.equal(receipt.native_readback.desktop_owner.direct_linked_regions, 6);
  assert.equal(receipt.native_readback.mobile_owner.direct_linked_regions, 6);
  assert.deepEqual(receipt.native_readback.page_validation, []);
  assert.ok(Object.values(receipt.visual_readback).filter((value) => value?.path).every(({ status }) => status === 'PASS'));
  assert.match(materializer, /component\.instance\(\)/u);
  assert.doesNotMatch(materializer, /uploadMedia|fillImage\s*=|Source exact projection|screenshot fill/iu);
  assert.doesNotMatch(materializer, /detach\(/u);
  assert.equal(contract.acceptance.owner_acceptance, 'NOT_CLAIMED');
  assert.equal(contract.processed, false);
});
