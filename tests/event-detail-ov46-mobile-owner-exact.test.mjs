import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
const json=async p=>JSON.parse(await readFile(new URL(p,import.meta.url),'utf8'));
const contract=await json('../catalog/reconstruction-atlas/v1/event-detail-ov46-mobile-owner-exact.v1.json');
const browser=await json('../evidence/recovery-20260828/astro/ov46-event-detail-5459-mobile-browser-evidence.v1.json');
const receipt=await json('../evidence/recovery-20260828/penpot/event-detail-ov46-mobile-owner-exact-receipt.v1.json');
const png=await readFile(new URL('../evidence/recovery-20260828/penpot/event-detail-ov46-mobile-summary-final.png',import.meta.url));
const pngSize=buf=>[buf.readUInt32BE(16),buf.readUInt32BE(20)];
test('OV-46 contract follows the real accepted-v8 mobile first screen',()=>{
 assert.equal(contract.review_item,'OV-46'); assert.equal(contract.authority.fixture,5459); assert.equal(contract.authority.variant,'accepted-v8');
 assert.deepEqual(contract.astro.viewport,[390,844]); assert.deepEqual(contract.astro.geometry.decision,[12,529.890625,366,422.59375]);
 assert.deepEqual(contract.astro.geometry.facts,[16,2518.140625,358,221.4375]); assert.equal(contract.penpot.detached_instances_allowed,0);
});
test('OV-46 browser evidence has the poster overlap and no horizontal overflow',()=>{
 assert.deepEqual(browser.viewport,{width:390,height:844}); assert.equal(browser.document.overflowX,0);
 assert.equal(browser.selectors.image.width,390); assert.equal(browser.selectors.image.height,551.484375);
 assert.equal(browser.selectors.decision.y,529.890625); assert.match(browser.selectors.decision.text,/Купить билет/); assert.deepEqual(browser.errors,[]);
});
test('OV-46 final Penpot visual receipt does not overclaim owner acceptance',()=>{
 assert.equal(receipt.processed,false); assert.equal(receipt.idempotency.created_on_second_run,0); assert.deepEqual(receipt.structural_readback.page_validation,[]);
 assert.equal(receipt.visual_qa.result,'PASS'); assert.equal(receipt.visual_qa.owner_acceptance,'NOT_CLAIMED'); assert.deepEqual(pngSize(png),[366,430]);
});
