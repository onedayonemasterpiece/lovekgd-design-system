const assert=require('assert');
const fs=require('fs');
const cp=require('child_process');
const nodeCrypto=require('crypto');
const os=require('os');
const path=require('path');
const adapter=require('../../../scripts/asp-production-conveyor-v3/f0/foundation_specimens_native_adapter_v3.js');

const DIGEST='0b00102e348367601fe35de30e06dc22b10883577a22917320955058115fc042';
const ids=Object.keys(adapter.F0_CONFIG.domains);
assert.equal(ids.length,8);
assert.equal(adapter.F0_CONFIG.placements.length,57);
assert.equal(new Set(adapter.F0_CONFIG.placements.map(x=>x.id)).size,57);
assert.equal(adapter.F0_CONFIG.writer,'/root/publish_r2');
assert.equal(adapter.F0_CONFIG.fileId,'40e06342-8830-80d6-8008-8fc8a3a4cd4f');
assert.notEqual(adapter.F0_CONFIG.pageName,'00 · Components · Free collection');
assert.equal(adapter.F0_CONFIG.protectedProjectionMode,'SAME_RUN_PROBE_THEN_EXECUTE');
assert.deepEqual(adapter.F0_CONFIG.protectedProbeBaseline,{revision:76,chars:84033,utf8Bytes:84034,sha256:DIGEST});
assert.deepEqual(adapter.f0PlacementXY(adapter.F0_CONFIG.placements[0]),{x:48,y:160,sectionY:112});

const sourcePackage=JSON.parse(fs.readFileSync(path.join(__dirname,'../../../catalog/asp-production-conveyor-v3/f0/F-FOUNDATIONS-SPECIMENS.package.v2.json')));
assert.deepEqual(ids,sourcePackage.specimen_components.map(x=>x.id));
assert.deepEqual(adapter.F0_CONFIG.placements,sourcePackage.materialization_entry_point.specimen.placements.map(x=>({id:x.id,componentId:x.component_id,value:x.value})));
for(const item of sourcePackage.specimen_components) {
  const expected=item.id==='foundation.status'
    ? Object.fromEntries(Object.entries(sourcePackage.specimens.status_pairs).flatMap(([k,v])=>[[`${k}.surface`,v.surface],[`${k}.content`,v.content]]))
    : sourcePackage.specimens[item.value_domain];
  assert.deepEqual(adapter.F0_CONFIG.domains[item.id].values,expected);
}

const nativeMarker={
  schema:'kenigevents.asp-run-control.v1',
  run_id:adapter.F0_CONFIG.runId,
  writer_id:adapter.F0_CONFIG.writer,
  package_id:'F-FOUNDATIONS-SPECIMENS',
  state:'ACTIVE',
  contract_sha256:adapter.F0_CONFIG.contractSha256,
  page_profile_sha256:adapter.F0_CONFIG.pageProfileSha256,
  asset_registry_sha256:adapter.F0_CONFIG.assetRegistrySha256,
  geometry_proof_sha256:adapter.F0_CONFIG.geometryProofSha256,
};
const native=(overrides={})=>({currentFile:{getSharedPluginData:()=>JSON.stringify({...nativeMarker,...overrides})}});
const active={f0FoundationLeaseReceiptV1:{
  schema:'kenigevents.asp-lease-receipt.v1',
  run_id:adapter.F0_CONFIG.runId,
  writer_id:adapter.F0_CONFIG.writer,
  state:'ACTIVE',cancelled:false,
  lease_token:adapter.F0_CONFIG.leaseToken,
  cancel_token:adapter.F0_CONFIG.cancelToken,
}};
assert.doesNotThrow(()=>adapter.f0Guard(native(),structuredClone(active),'ok'));
assert.throws(()=>adapter.f0Guard(native(),{f0FoundationLeaseReceiptV1:{...active.f0FoundationLeaseReceiptV1,cancelled:true}},'cancelled'),/lease\/cancel receipt mismatch/);
assert.throws(()=>adapter.f0Guard(native(),{...active,f0FoundationActiveWriter:{runId:'other',writer:adapter.F0_CONFIG.writer}},'conflict'),/sole writer conflict/);
assert.throws(()=>adapter.f0Guard(native({state:'CANCELLED'}),structuredClone(active),'native-cancelled'),/authoritative active run mismatch/);
assert.throws(()=>adapter.f0Guard(native({package_id:'wrong'}),structuredClone(active),'native-package'),/authoritative active run mismatch/);
assert.throws(()=>adapter.f0Guard(native({geometry_proof_sha256:'stale'}),structuredClone(active),'native-hash'),/authoritative run hashes mismatch/);
const projection={chars:84033,utf8Bytes:84034,sha256:DIGEST};
const protectedBinding={f0FoundationProtectedProjectionV1:{schema:'kenigevents.f0-protected-projection.v1',run_id:adapter.F0_CONFIG.runId,file_id:adapter.F0_CONFIG.fileId,page_id:adapter.F0_CONFIG.protectedPageId,root_ids:[...adapter.F0_CONFIG.protectedRootIds],chars:84033,utf8_bytes:84034,sha256:DIGEST}};
assert.doesNotThrow(()=>adapter.f0RequireProtectedProbeBaseline(projection));
assert.throws(()=>adapter.f0RequireProtectedProbeBaseline({...projection,sha256:'stale-rev75'}),/not independently frozen rev76/);
assert.doesNotThrow(()=>adapter.f0RequireProtectedDigest(projection,protectedBinding));
assert.throws(()=>adapter.f0RequireProtectedDigest(projection,{}),/missing or stale same-run protected probe binding/);
assert.throws(()=>adapter.f0RequireProtectedDigest({...projection,sha256:'stale'},protectedBinding),/protected projection changed after same-run probe/);

const stableShape=(stableId)=>({width:416,height:128,getSharedPluginData:(_ns,key)=>key==='stable-id'?stableId:''});
const components=Object.fromEntries(ids.map((stableId,i)=>[stableId,{id:`c${i}`,name:adapter.F0_CONFIG.domains[stableId].name,mainInstance:()=>stableShape(`component/${stableId}`)}]));
const rootHeight=112+ids.reduce((sum,id)=>sum+48+Math.ceil(adapter.F0_CONFIG.placements.filter(p=>p.componentId===id).length/3)*152+28,0);
const root={id:'root',name:adapter.F0_CONFIG.rootName,width:1440,height:rootHeight,x:0,y:0};
const instanceFor=(placement,i)=>{
  const xy=adapter.f0PlacementXY(placement);
  return {id:`i${i}`,x:xy.x,y:xy.y,width:416,height:128,
    getSharedPluginData:(_ns,key)=>key==='placement-id'?placement.id:'',
    isComponentCopyInstance:()=>true,component:()=>components[placement.componentId],
    children:[{characters:`${placement.value}  ·  ${adapter.F0_CONFIG.domains[placement.componentId].values[placement.value]}`,getSharedPluginData:(_ns,key)=>key==='role'?'label':''}],
  };
};
const componentList=ids.map(id=>components[id]);
const instances=adapter.F0_CONFIG.placements.map(instanceFor);
const census=adapter.f0VerifyCensus({components:componentList,roots:[root],instances,screenshots:[],validation:[]});
assert.equal(census.placementIds.length,57);
assert.throws(()=>adapter.f0VerifyCensus({components:[...componentList.slice(0,7),componentList[0]],roots:[root],instances,screenshots:[],validation:[]}),/component census mismatch/);
assert.throws(()=>adapter.f0VerifyCensus({components:componentList,roots:[root],instances:instances.slice(0,56),screenshots:[],validation:[]}),/instance census mismatch/);
assert.throws(()=>adapter.f0VerifyCensus({components:componentList,roots:[root],instances:[{...instances[0],isComponentCopyInstance:()=>false},...instances.slice(1)],screenshots:[],validation:[]}),/detached instance found/);
assert.throws(()=>adapter.f0VerifyCensus({components:componentList,roots:[root],instances,screenshots:[{}],validation:[]}),/screenshot shape found/);
assert.throws(()=>adapter.f0VerifyCensus({components:componentList,roots:[root],instances,screenshots:[],validation:[{code:'missing-slot'}]}),/Penpot validation failed/);

const src=fs.readFileSync(path.join(__dirname,'../../../scripts/asp-production-conveyor-v3/f0/foundation_specimens_native_adapter_v3.js'),'utf8');
for(const needle of [
  'f0Write(penpot,storage,`component:${id}`',
  'f0Write(penpot,storage,`placement:${placement.id}`',
  'getSharedPluginData("kenigevents",F0_CONFIG.activeRunKey)',
  'after.sha256===protectedBefore.sha256',
  'root.export({type:"png",scale:1})',
  'saveVersion',
  'maxCreatesPerCall: 3',
  'secondRunCreated:0',
]) assert(src.includes(needle),needle);

const out=path.join(os.tmpdir(),`f0-native-${process.pid}.js`);
const generatedReceipt=JSON.parse(cp.execFileSync('python3',[path.join(__dirname,'../../../scripts/asp-production-conveyor-v3/f0/generate_foundation_specimens_native_executor_v3.py'),'--output',out],{encoding:'utf8'}));
const generated=fs.readFileSync(out,'utf8'); fs.unlinkSync(out);
assert.equal(generatedReceipt.status,'EXECUTOR_READY');
assert.equal(generatedReceipt.run_id,adapter.F0_CONFIG.runId);
assert.equal(generatedReceipt.protected_projection_mode,'SAME_RUN_PROBE_THEN_EXECUTE');
assert.equal(generatedReceipt.protected_baseline_revision,76);
assert.equal(generatedReceipt.requires_authoritative_native_run,true);
assert.equal(generatedReceipt.requires_preinstalled_lease_receipt,true);
assert(generated.startsWith(src));
assert(generated.endsWith('return await runF0FoundationSpecimensV3({penpot,storage});\n'));

(async()=>{
  assert(!src.includes('TextEncoder')); assert(!src.includes('crypto.subtle'));
  assert.equal(await adapter.f0Sha256('Кёнигсберг · Foundations'),nodeCrypto.createHash('sha256').update('Кёнигсберг · Foundations').digest('hex'));
  const longUnicode='ё'.repeat(84033);assert.equal(await adapter.f0Sha256(longUnicode),nodeCrypto.createHash('sha256').update(longUnicode).digest('hex'));
  let began=0,finished=0,wrote=0;const block=Symbol('b');
  const writePenpot=native(); writePenpot.history={undoBlockBegin:()=>{began++;return block},undoBlockFinish:(actual)=>{assert.equal(actual,block);finished++}};
  assert.equal(adapter.f0Write(writePenpot,structuredClone(active),'mock-write',()=>{wrote++;return 7}),7);
  assert.equal(wrote,1); assert.equal(began,1); assert.equal(finished,1);
  assert.throws(()=>adapter.f0Write(writePenpot,structuredClone(active),'async-forbidden',()=>Promise.resolve()),/async mutation callback forbidden/);assert.equal(began,2);assert.equal(finished,2);
  const blockedPenpot=native({state:'CANCELLED'}); blockedPenpot.history={undoBlockBegin:()=>{throw new Error('unexpected write')},undoBlockFinish:()=>{}};
  assert.throws(()=>adapter.f0Write(blockedPenpot,structuredClone(active),'blocked',()=>{wrote++}),/authoritative active run mismatch/);
  assert.equal(wrote,1);
  console.log('F0_FOUNDATION_NATIVE_ADAPTER_V3_TEST_PASS');
})().catch(err=>{console.error(err);process.exitCode=1});
