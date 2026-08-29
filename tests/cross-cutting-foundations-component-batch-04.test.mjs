import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const receipt=JSON.parse(readFileSync('evidence/recovery-20260829/penpot/cross-cutting-foundations-component-batch-04-receipt.v1.json','utf8'));
const materializer=readFileSync('scripts/round-trip-reconstruction/penpot-bind-foundations-batch04-club-card.js','utf8');
test('OV-54 batch 04 binds the responsive Club card root without geometry drift',()=>{
  assert.deepEqual(receipt.persisted_binding.geometry,[360,448,22]);
  assert.equal(receipt.persisted_token_properties,4);
  assert.ok(Object.values(receipt.persisted_binding.tokens).every(value=>value==='radius.22'));
  assert.match(materializer,/shape\.applyToken\(token,PROPERTIES\)/u);
  assert.deepEqual(receipt.penpot.validation,[]);
});
test('OV-54 batch 04 records the 504 as unknown and proves persistence by delayed readback',()=>{
  assert.equal(receipt.timeout_recovery.write_response,'HTTP_504_UNKNOWN_OUTCOME');
  assert.equal(receipt.timeout_recovery.blind_retry_performed,false);
  assert.equal(receipt.timeout_recovery.delayed_readback,'PERSISTED');
  assert.equal(receipt.timeout_recovery.readback_revision,2797);
});
