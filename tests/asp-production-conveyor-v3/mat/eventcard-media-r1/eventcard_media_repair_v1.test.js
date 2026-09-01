'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const {
  PACKAGE_ID,FILE_ID,PAGE_ID,COLLECTION_ID,MEDIA_SLOT,VARIANTS,FACTUAL,ROOTS,
  canonical,expectedCrop,runEventcardMediaRepairV1,
}=require('../../../../scripts/asp-production-conveyor-v3/mat/eventcard-media-r1/eventcard_media_repair_v1.js');

const clone=value=>JSON.parse(JSON.stringify(value));
const auth=()=>({schema:'kenigevents.asp-eventcard-media-publish-authorization.v1',penpot_execution_authorized:true,package_id:PACKAGE_ID,logical_writer_id:'/root/publish_r2',state:'ACTIVE',run_id:'native-like-test-run',lease_token:'lease',cancel_token:'cancel',cancelled:false});

class StrictNativeLikeAdapter {
  constructor(outcomes={}) {
    this.outcomes={...outcomes};
    this.probeConstructs=[];
    this.probeCreates=0;
    this.probeDeletes=0;
    this.acceptedMutations=0;
    this.forceAcceptedOverlay=0;
    this.textNodes=[{id:'text-1',characters:'Кант и музыка',x:10,y:20},{id:'text-2',characters:'выставка',x:12,y:40}];
    this.components=[{id:'component-1',path:''},{id:'component-2',path:'KenigEvents / G19 / EventCard 8006 / Accepted'}];
    this.shapes={};
    ROOTS.forEach((spec,index)=>{
      const fact=FACTUAL[spec.fixtureId];
      const box=spec.caseId.startsWith('eventcard.mobile')
        ? (spec.fixtureId==='event.real.8006'?{x:16,y:20,width:294,height:392}:{x:16,y:20,width:294,height:235.2})
        : {x:32,y:48,width:fact.desktopBox.width,height:fact.desktopBox.height};
      this.shapes[spec.rootId]={id:`media-shape-${index+1}`,rootId:spec.rootId,semanticSlot:MEDIA_SLOT,bounds:box,parentX:box.x,parentY:box.y,fills:[{fillImage:{sha256:fact.sha256},fillOpacity:1}],transform:'matrix(1,0,0,1,0,0)',rotation:0,flipX:false,flipY:false,fit:fact.fit,focal:fact.focal,mediaConstructionVariant:null,repaired:false};
    });
  }
  identity(){return {fileId:FILE_ID,pageId:PAGE_ID};}
  protectedProjection(){return canonical({collectionId:COLLECTION_ID,children:18,components:this.components,rootIds:ROOTS.map(x=>x.rootId),shapeIds:Object.values(this.shapes).map(x=>x.id),texts:this.textNodes});}
  collectionSnapshot(){return {rootId:COLLECTION_ID,directChildren:18,localComponents:18,rootIds:ROOTS.map(x=>x.rootId),detachedRoots:0,screenshotRoots:0,routeLocalDuplicateMasters:0,protectedProjection:this.protectedProjection()};}
  root(id){return ROOTS.some(x=>x.rootId===id)?{id}:null;}
  uniqueSemanticShape(root,slot){const shape=this.shapes[root.id];return shape&&shape.semanticSlot===slot?shape:null;}
  shapeReadback(shape){return clone({id:shape.id,semanticSlot:shape.semanticSlot,bounds:shape.bounds,parentX:shape.parentX,parentY:shape.parentY,fills:shape.fills,transform:shape.transform,rotation:shape.rotation,flipX:shape.flipX,flipY:shape.flipY,fit:shape.fit,focal:shape.focal,mediaConstructionVariant:shape.mediaConstructionVariant});}
  async createDisposableProbeRoot({outsideCollectionId}){assert.equal(outsideCollectionId,COLLECTION_ID);this.probeCreates++;return {id:`probe-${this.probeCreates}`,outsideCollection:true};}
  async deleteDisposableProbeRoot(){this.probeDeletes++;}
  async constructProbe(root,{variant,fixtureId,fact,box}) {
    assert.equal(root.outsideCollection,true);
    assert.deepEqual(variant,VARIANTS.find(x=>x.id===variant.id));
    assert.equal(fact.sha256,FACTUAL[fixtureId].sha256);
    assert.deepEqual(box,fact.desktopBox);
    this.probeConstructs.push({variantId:variant.id,operation:variant.operation,fixtureId});
    return {id:`${root.id}-${variant.id}-${fixtureId}`,semanticSlot:MEDIA_SLOT,bounds:{x:0,y:0,...box},parentX:0,parentY:0,fills:[{fillImage:{sha256:fact.sha256},fillOpacity:1}],transform:'matrix(1,0,0,1,0,0)',rotation:0,flipX:false,flipY:false,fit:fact.fit,focal:fact.focal,probe:{variantId:variant.id,fixtureId}};
  }
  outcome(variantId,fixtureId){return this.outcomes[`${variantId}:${fixtureId}`]??(variantId==='A_current'?'KNOWN_FAIL':'KNOWN_PASS');}
  coverageReadback(shape,{scope,variantId,fixtureId}={}) {
    const spec=scope==='probe'?{fixtureId,variantId}:ROOTS.find(x=>x.rootId===shape.rootId);
    const fact=FACTUAL[spec.fixtureId];
    const status=scope==='probe'?this.outcome(spec.variantId,spec.fixtureId):(shape.repaired?'KNOWN_PASS':'KNOWN_FAIL');
    if(status==='UNKNOWN')return {status:'UNKNOWN'};
    if(status==='KNOWN_FAIL')return {status:'KNOWN_FAIL',shapeId:shape.id,rasterSha256:fact.sha256};
    const crop=expectedCrop(spec.fixtureId,shape.bounds);
    return {status:'KNOWN_PASS',shapeId:shape.id,rasterSha256:fact.sha256,fit:fact.fit,focal:fact.focal,rawFill:{completeRaster:true,rasterSha256:fact.sha256},rectangle:{completeRaster:true,rasterSha256:fact.sha256},mediaGroup:{completeRaster:true,rasterSha256:fact.sha256},destination:{fullExactBox:true},uncoveredPixelCount:0,letterboxPixelCount:0,opaqueNonSourceOverlayCount:scope==='accepted-root'?this.forceAcceptedOverlay:0,sourceCropNormalized:{x:crop.x,y:crop.y,width:crop.width,height:crop.height},cropAxis:crop.axis,bounds:{width:shape.bounds.width,height:shape.bounds.height},transform:shape.transform,rotation:shape.rotation,flipX:shape.flipX,flipY:shape.flipY,fillProof:{variantId:spec.variantId,rasterSha256:fact.sha256,nativeFillMetadata:{imageDataSha256:fact.sha256}}};
  }
  async atomic(fn) {
    const snapshot=clone({shapes:this.shapes,textNodes:this.textNodes,components:this.components,acceptedMutations:this.acceptedMutations});
    try{return await fn({id:'atomic-native-like-transaction'});}catch(error){this.shapes=snapshot.shapes;this.textNodes=snapshot.textNodes;this.components=snapshot.components;this.acceptedMutations=snapshot.acceptedMutations;throw error;}
  }
  async applyProvenFillInPlace(transaction,shape,{fixtureId,fact,variant,fillProof}) {
    assert.equal(transaction.id,'atomic-native-like-transaction');
    assert.equal(shape.id,this.shapes[shape.rootId].id);
    assert.equal(fact.sha256,FACTUAL[fixtureId].sha256);
    assert.equal(fillProof.rasterSha256,fact.sha256);
    const changed=!shape.repaired||shape.mediaConstructionVariant!==variant.id;
    if(changed){shape.fills=[{fillOpacity:1,fillImage:{sha256:fact.sha256,imageData:clone(fillProof.nativeFillMetadata)},fit:fact.fit,focal:fact.focal}];shape.mediaConstructionVariant=variant.id;shape.repaired=true;this.acceptedMutations++;}
    return changed;
  }
  validate(){return [];}
}

test('package carries no ambient Penpot execution authorization',async()=>{
  const adapter=new StrictNativeLikeAdapter();
  await assert.rejects(runEventcardMediaRepairV1({nativeAdapter:adapter}),/EXECUTION_AUTHORIZATION_REQUIRED/);
  assert.equal(adapter.probeCreates,0);
  assert.equal(adapter.acceptedMutations,0);
});

test('exact A/B/C/D native-like matrix selects smallest common construction and repairs only fills',async()=>{
  const adapter=new StrictNativeLikeAdapter();
  const protectedBefore=adapter.protectedProjection();
  const idsBefore=Object.values(adapter.shapes).map(x=>x.id);
  const textsBefore=clone(adapter.textNodes);
  const pathsBefore=adapter.components.map(x=>x.path);
  const result=await runEventcardMediaRepairV1({nativeAdapter:adapter,executionAuthorization:auth()});
  assert.equal(result.state,'NATIVE_MEDIA_READBACK_VERIFIED_PENDING_V0');
  assert.equal(result.selectedVariant,'C_direct_native_fill');
  assert.equal(result.acceptedRootMutations,4);
  assert.equal(result.textMutations,0);
  assert.equal(result.componentPathMutations,0);
  assert.equal(adapter.probeCreates,1);
  assert.equal(adapter.probeDeletes,1);
  assert.equal(adapter.probeConstructs.length,8);
  assert.deepEqual(adapter.probeConstructs.map(x=>x.variantId),VARIANTS.flatMap(v=>[v.id,v.id]));
  assert.deepEqual(Object.values(adapter.shapes).map(x=>x.id),idsBefore);
  assert.deepEqual(adapter.textNodes,textsBefore);
  assert.deepEqual(adapter.components.map(x=>x.path),pathsBefore);
  assert.equal(adapter.protectedProjection(),protectedBefore);
  assert.deepEqual(adapter.collectionSnapshot().rootIds,ROOTS.map(x=>x.rootId));
  assert.equal(adapter.collectionSnapshot().directChildren,18);
  assert.equal(adapter.collectionSnapshot().localComponents,18);
});

test('idempotent replay is read-only and preserves stable IDs',async()=>{
  const adapter=new StrictNativeLikeAdapter();
  await runEventcardMediaRepairV1({nativeAdapter:adapter,executionAuthorization:auth()});
  const probeCreates=adapter.probeCreates;
  const mutations=adapter.acceptedMutations;
  const before=clone(adapter.shapes);
  const replay=await runEventcardMediaRepairV1({nativeAdapter:adapter,executionAuthorization:auth()});
  assert.equal(replay.state,'IDEMPOTENT_NATIVE_READBACK_VERIFIED_PENDING_V0');
  assert.equal(replay.acceptedRootMutations,0);
  assert.equal(adapter.probeCreates,probeCreates);
  assert.equal(adapter.acceptedMutations,mutations);
  assert.deepEqual(adapter.shapes,before);
});

test('unknown A/B/C/D outcome stops before accepted-root mutation',async()=>{
  const adapter=new StrictNativeLikeAdapter({'B_no_post_import_resize:event.real.2182':'UNKNOWN'});
  const before=clone(adapter.shapes);
  await assert.rejects(runEventcardMediaRepairV1({nativeAdapter:adapter,executionAuthorization:auth()}),/PROBE_OUTCOME_UNKNOWN/);
  assert.deepEqual(adapter.shapes,before);
  assert.equal(adapter.acceptedMutations,0);
  assert.equal(adapter.probeDeletes,1);
});

test('no common passing construction fails closed with accepted roots untouched',async()=>{
  const outcomes={};
  for(const variant of VARIANTS)for(const fixtureId of Object.keys(FACTUAL))outcomes[`${variant.id}:${fixtureId}`]='KNOWN_FAIL';
  const adapter=new StrictNativeLikeAdapter(outcomes);
  const before=clone(adapter.shapes);
  await assert.rejects(runEventcardMediaRepairV1({nativeAdapter:adapter,executionAuthorization:auth()}),/NO_NATIVE_CONSTRUCTION_PASSES_BOTH_CASES/);
  assert.deepEqual(adapter.shapes,before);
  assert.equal(adapter.acceptedMutations,0);
});

test('opaque overlay readback rolls back all four accepted shapes atomically',async()=>{
  const adapter=new StrictNativeLikeAdapter();
  adapter.forceAcceptedOverlay=1;
  const before=clone(adapter.shapes);
  await assert.rejects(runEventcardMediaRepairV1({nativeAdapter:adapter,executionAuthorization:auth()}),/OPAQUE_NON_SOURCE_OVERLAY/);
  assert.deepEqual(adapter.shapes,before);
  assert.equal(adapter.acceptedMutations,0);
});

test('contain and cover crop/focal semantics are exact and deterministic',()=>{
  assert.deepEqual(expectedCrop('event.real.8006',{width:531.797,height:709.063}),{x:0,y:0,width:1,height:1,axis:'none'});
  const crop=expectedCrop('event.real.2182',{width:531.797,height:425.438});
  assert.equal(crop.axis,'horizontal');
  assert.ok(Math.abs(crop.x-0.08349648535009802)<1e-15);
  assert.ok(Math.abs(crop.width-0.833007029299804)<1e-15);
  assert.equal(crop.y,0);
  assert.equal(crop.height,1);
});
