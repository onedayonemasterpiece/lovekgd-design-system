import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const contract=JSON.parse(readFileSync('catalog/reconstruction-atlas/v1/cross-cutting-token-contract.v1.json','utf8'));
const receipt=JSON.parse(readFileSync('evidence/recovery-20260829/penpot/cross-cutting-foundations-component-batch-13-receipt.v1.json','utf8'));
const source=readFileSync('scripts/round-trip-reconstruction/penpot-bind-foundations-batch13-listing-owner-roots.js','utf8');

test('OV-54 batch 13 binds the three factual listing owner roots without geometry drift',()=>{
  assert.equal(receipt.owner_item,'OV-54');
  assert.deepEqual(receipt.pages.map(x=>x.page_key),['popular','collections','exhibitions']);
  assert.deepEqual(receipt.roots.map(x=>[x.page_key,x.viewport]),[['popular','desktop'],['collections','mobile'],['exhibitions','desktop']]);
  assert.equal(receipt.persisted_token_properties,12);
  assert.ok(receipt.roots.every(x=>x.size_before.toString()===x.size_after.toString()));
  assert.ok(receipt.roots.every(x=>Object.values(x.persisted_tokens).every(name=>name==='radius.20')));
  assert.deepEqual(receipt.penpot.validation,[]);
});

test('OV-54 batch 13 remains page-scoped and leaves Artifacts selected for review',()=>{
  const batch=contract.penpot_projection.component_migration_pilots.find(x=>x.batch==='popular-collections-exhibitions-canonical-owner-roots');
  assert.ok(batch);
  assert.equal(batch.persisted_token_properties,12);
  assert.deepEqual(receipt.page_sequence,['popular','collections','exhibitions','return-artifacts-review']);
  assert.equal(receipt.penpot.selected_review_owner,'d87e18f1-dcb4-80a6-8008-880f9aaea84e');
  assert.match(source,/shape\.applyToken\(token, PROPERTIES\)/u);
  assert.doesNotMatch(source,/openPage|detach\(|fillImage|uploadMedia/u);
});
