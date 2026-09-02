import test from 'node:test';
import assert from 'node:assert/strict';
import { run, TEST_ONLY } from './executor.v3.mjs';
import { SPEC, PROTECTED_MANIFEST } from './package.v3.mjs';
import { buildContext, snapshot } from './native-like-host.v3.mjs';

async function drive(context,max=2000){
  const receipts=[];let total=0;
  for(let index=0;index<max;index+=1){
    const before=context.penpot.nativeCreates;
    const receipt=await run(context);
    const delta=context.penpot.nativeCreates-before;
    assert.equal(receipt.created,delta);
    assert.ok(delta<=3,`phase ${receipt.phase_before} created ${delta}`);
    receipts.push(receipt);total+=delta;
    if(receipt.terminal)return {receipts,total};
  }
  throw new Error('runtime did not terminate');
}

test('PAGE phase creates only page and later phases activate current page',async()=>{
  const context=buildContext();
  let receipt=await run(context);assert.equal(receipt.phase_before,'PREFLIGHT');assert.equal(receipt.created,0);
  receipt=await run(context);assert.equal(receipt.phase_before,'PAGE');assert.equal(receipt.created,1);
  assert.equal(context.penpot.currentFile.pages.length,1);
  assert.equal(context.penpot.currentPage,null);
  assert.equal(context.penpot.currentFile.pages[0].root.children.length,0);
  receipt=await run(context);assert.equal(receipt.phase_before,'ROOT');
  assert.equal(context.penpot.currentPage.id,context.penpot.currentFile.pages[0].id);
  assert.ok(context.penpot.openPageCalls>=1);
});

test('resumable native phases are bounded and second independent replay creates zero',async()=>{
  const context=buildContext();
  const first=await drive(context);
  assert.ok(first.total>0);
  const firstSnapshot=snapshot(context);
  const replay={...context,storage:{}};
  replay.storage[`${SPEC.lease.namespace}:lease`]=JSON.stringify({schema:'kenigevents.f0-package-lease.v4',package_id:SPEC.package_id,run_id:context.claim.run_id,lease_token:context.claim.lease_token,cancel_token:context.claim.cancel_token,state:'ACTIVE',cancelled:false});
  const second=await drive(replay);
  assert.equal(second.total,0);
  assert.equal(snapshot(replay),firstSnapshot);
  assert.equal(second.receipts.at(-1).terminal,true);
});

test('strict string shared plugin data rejects implicit coercion',()=>{
  const context=buildContext();
  const page=context.penpot.createPage();page.name='probe';
  assert.throws(()=>TEST_ONLY.T(page,'bad',{not:'string'}),/PLUGIN_DATA_NOT_STRING/);
  assert.equal(page.getSharedPluginData('kenigevents-f0-morning-r4','bad'),'');
});

test('revision-bound protected manifest fails closed without namespace guessing',async()=>{
  const drift=buildContext({projectionDrift:true});
  await assert.rejects(()=>run(drift),/PROTECTED_DIGEST/);
  assert.equal(drift.penpot.currentFile.pages.length,0);
  const revision=buildContext({revision:181});
  await assert.rejects(()=>run(revision),/FILE_OR_REVISION/);
  assert.equal(PROTECTED_MANIFEST.namespace_enumeration_required,false);
  assert.equal(PROTECTED_MANIFEST.finite_guessed_namespace_list_used,false);
});

test('terminal census has no duplicate, detached, screenshot or empty wells',async()=>{
  const context=buildContext();
  await drive(context);
  const raw=context.storage[`${SPEC.lease.namespace}:terminal`];
  assert.ok(raw);
  const value=JSON.parse(raw);
  assert.deepEqual({duplicates:value.duplicates,detached:value.detached,screenshots:value.screenshots,empty:value.empty_specimen_wells},{duplicates:0,detached:0,screenshots:0,empty:0});
  assert.equal(value.linked_specimens,SPEC.expected.linked_specimens);
});

test('package-specific product contract is exact',async()=>{
  const context=buildContext();await drive(context);
  if(SPEC.kind==='foundation'){
    assert.equal(SPEC.new_foundation_families,0);
    assert.equal(SPEC.families.length,2);
    assert.equal(SPEC.placements.length,SPEC.expected.linked_specimens);
  }else if(SPEC.kind==='typography'){
    assert.equal(SPEC.does_not_repair_eventcard_text,true);
    assert.equal(SPEC.responsive_roles.length,3);
    assert.ok(SPEC.placements.every((row)=>/[А-Яа-яЁё]/.test(row.text)));
    assert.deepEqual([SPEC.font_binding.regular.bytes,SPEC.font_binding.bold.bytes],[759720,708920]);
    assert.deepEqual([SPEC.font_binding.regular.sha256,SPEC.font_binding.bold.sha256],['ae7b7855e115a5966d8b1b3f80f254ccc117ec86f9965e202ee2940453837280','5c1247acef7f2b8522a31742c76d6adcb5569bacc0be7ceaa4dc39dd252ce895']);
    assert.ok(Object.values(SPEC.line_heights).every((value)=>typeof value==='number'&&value>0.5&&value<2.5));
  }else{
    assert.equal(SPEC.assets.length,8);
    assert.equal(SPEC.assets.filter((asset)=>asset.source.extension==='svg').length,6);
    assert.equal(SPEC.assets.filter((asset)=>asset.source.extension==='webp').length,2);
    assert.deepEqual(SPEC.assets.flatMap((asset)=>asset.tiers_px),Array(8).fill([44,60,88]).flat());
    assert.equal(context.penpot.media.length,2);
    assert.equal(SPEC.assets.filter((asset)=>asset.consumer_group==='institutions-a').length,8);
  }
});
