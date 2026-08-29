import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const contract=read('catalog/reconstruction-atlas/v1/cross-cutting-token-contract.v1.json');
const receipt=read('evidence/recovery-20260829/penpot/cross-cutting-foundations-component-batch-03-receipt.v1.json');
const materializer=readFileSync('scripts/round-trip-reconstruction/penpot-bind-foundations-batch03-artifacts.js','utf8');

test('OV-54 batch 03 closes the missing source radius.24 token',()=>{
  assert.equal(contract.penpot_projection.token_set.tokens,97);
  assert.deepEqual(receipt.added_source_conformant_token,{id:'8f804431-c282-8075-8008-8e2068ca67ad',name:'radius.24',type:'borderRadius',value:'24',source_role:'weekend.column'});
  assert.match(materializer,/addToken\(\{type:'borderRadius',name:'radius\.24',value:'24'\}\)/u);
});

test('OV-54 batch 03 binds both exact-seven collection roots without geometry drift',()=>{
  assert.equal(receipt.persisted_bindings.length,2);
  assert.equal(receipt.persisted_token_properties,8);
  assert.deepEqual(receipt.persisted_bindings.map(row=>row.geometry),[[1180,1900,24],[366,2700,24]]);
  assert.ok(receipt.persisted_bindings.every(row=>Object.values(row.tokens).every(value=>value==='radius.24')));
  assert.deepEqual(receipt.penpot.validation,[]);
  assert.equal(receipt.visual_readback.geometry_unchanged,true);
});
