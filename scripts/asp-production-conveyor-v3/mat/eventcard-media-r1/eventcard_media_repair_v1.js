'use strict';

/**
 * Native EventCard media-only repair executor.
 *
 * This module deliberately owns no Penpot session.  A separately authorized
 * PUBLISH caller must inject the narrow native adapter documented below.  The
 * executor compares A/B/C/D outside the accepted collection, then changes only
 * the fill of the four existing media rectangles inside one atomic transaction.
 */

const PACKAGE_ID = 'MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1';
const FILE_ID = '40e06342-8830-80d6-8008-8fc8a3a4cd4f';
const PAGE_ID = 'c16498cb-b51d-8030-8008-904bd8fc9c53';
const COLLECTION_ID = '313fb1ed-0d5c-8095-8008-9108df52b2ce';
const MEDIA_SLOT = 'event.media-frame/image-content';
const VARIANTS = Object.freeze([
  Object.freeze({id:'A_current', operation:'createShapeFromSvgWithImages_then_resize_place', rank:4, sourceInput:'createShapeFromSvgWithImages current SVG then common resize/place'}),
  Object.freeze({id:'B_no_post_import_resize', operation:'createShapeFromSvgWithImages_at_final_dimensions_no_resize', rank:2, sourceInput:'import SVG at final dimensions, append and position without second resize'}),
  Object.freeze({id:'C_direct_native_fill', operation:'uploadMediaData_then_createRectangle_fillImage', rank:1, sourceInput:'uploadMediaData then createRectangle with fills=[{fillOpacity:1, fillImage:imageData}]'}),
  Object.freeze({id:'D_optional_minimal_import', operation:'single_href_svg_at_final_dimensions_no_resize', rank:3, sourceInput:'single-href minimal SVG image import only if needed to isolate importer behavior'}),
]);
const FACTUAL = Object.freeze({
  'event.real.8006': Object.freeze({sha256:'dd8834258d4a1ebde029aca1960bdd224bdf636d3fd8aee8fc7824012475de8b',bytes:111072,intrinsic:Object.freeze({width:1440,height:1920}),fit:'contain',focal:'50% 50%',desktopBox:Object.freeze({width:531.797,height:709.063})}),
  'event.real.2182': Object.freeze({sha256:'99d4b75ef3291c90e1457b6fdc3fe89e519b327f9d6c8ff56cd95f763e71ab1e',bytes:229072,intrinsic:Object.freeze({width:1280,height:853}),fit:'cover',focal:'50% 50%',desktopBox:Object.freeze({width:531.797,height:425.438})}),
});
const ROOTS = Object.freeze([
  Object.freeze({caseId:'eventcard.desktop-wide-calendar.8006',fixtureId:'event.real.8006',rootId:'313fb1ed-0d5c-8095-8008-912c45090653'}),
  Object.freeze({caseId:'eventcard.desktop-packed-calendar-absent.2182',fixtureId:'event.real.2182',rootId:'313fb1ed-0d5c-8095-8008-914c76615924'}),
  Object.freeze({caseId:'eventcard.mobile-wide-calendar.8006',fixtureId:'event.real.8006',rootId:'313fb1ed-0d5c-8095-8008-916b340de148'}),
  Object.freeze({caseId:'eventcard.mobile-packed-calendar-absent.2182',fixtureId:'event.real.2182',rootId:'313fb1ed-0d5c-8095-8008-916bd0ab6c98'}),
]);

const req = (value, code) => { if (!value) throw new Error(code); return value; };
const canonical = value => Array.isArray(value)
  ? `[${value.map(canonical).join(',')}]`
  : value && typeof value === 'object'
    ? `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`
    : JSON.stringify(value);
const finite = value => typeof value === 'number' && Number.isFinite(value);
const close = (a,b,epsilon=1e-9) => finite(a) && finite(b) && Math.abs(a-b) <= epsilon;

function expectedCrop(fixtureId, box) {
  const fact = FACTUAL[fixtureId];
  req(fact && finite(box?.width) && finite(box?.height) && box.width > 0 && box.height > 0, 'CROP_INPUT_INVALID');
  if (fact.fit === 'contain') {
    req(close(box.width / box.height, fact.intrinsic.width / fact.intrinsic.height, 2e-6), 'CONTAIN_BOX_WOULD_LETTERBOX');
    return {x:0,y:0,width:1,height:1,axis:'none'};
  }
  const width = (box.width / box.height) / (fact.intrinsic.width / fact.intrinsic.height);
  req(width > 0 && width < 1, 'COVER_CROP_INVALID');
  return {x:(1-width)/2,y:0,width,height:1,axis:'horizontal'};
}

function assertAuthorization(ctx) {
  const auth = ctx?.executionAuthorization;
  req(auth?.schema === 'kenigevents.asp-eventcard-media-publish-authorization.v1', 'EXECUTION_AUTHORIZATION_REQUIRED');
  req(auth.penpot_execution_authorized === true, 'PENPOT_EXECUTION_NOT_AUTHORIZED');
  req(auth.package_id === PACKAGE_ID && auth.logical_writer_id === '/root/publish_r2', 'EXECUTION_AUTHORIZATION_SCOPE_MISMATCH');
  req(auth.state === 'ACTIVE' && auth.run_id && auth.lease_token && auth.cancel_token && !auth.cancelled, 'EXECUTION_AUTHORIZATION_INACTIVE');
}

function assertAdapter(adapter) {
  for (const name of ['identity','collectionSnapshot','root','uniqueSemanticShape','shapeReadback','coverageReadback','createDisposableProbeRoot','constructProbe','deleteDisposableProbeRoot','atomic','applyProvenFillInPlace','validate']) {
    req(typeof adapter?.[name] === 'function', `NATIVE_ADAPTER_METHOD_MISSING:${name}`);
  }
  const identity = adapter.identity();
  req(identity?.fileId === FILE_ID && identity?.pageId === PAGE_ID, 'WRONG_NATIVE_TARGET');
}

function assertCollection(snapshot) {
  req(snapshot?.rootId === COLLECTION_ID, 'FREE_COLLECTION_ROOT_ID_DRIFT');
  req(snapshot.directChildren === 18 && snapshot.localComponents === 18, 'FREE_COLLECTION_CENSUS_DRIFT');
  req(Array.isArray(snapshot.rootIds) && canonical(snapshot.rootIds) === canonical(ROOTS.map(x=>x.rootId)), 'FOUR_ROOT_ID_DRIFT');
  req(snapshot.detachedRoots === 0 && snapshot.screenshotRoots === 0 && snapshot.routeLocalDuplicateMasters === 0, 'PROTECTED_FREE_COLLECTION_LINEAGE_DRIFT');
  req(typeof snapshot.protectedProjection === 'string' && snapshot.protectedProjection, 'PROTECTED_PROJECTION_MISSING');
}

function assertShapeReadback(readback, fact, expectedId) {
  req(readback?.id === expectedId, 'MEDIA_SHAPE_ID_DRIFT');
  req(readback.semanticSlot === MEDIA_SLOT, 'MEDIA_SEMANTIC_SLOT_DRIFT');
  req(finite(readback.bounds?.x) && finite(readback.bounds?.y) && finite(readback.bounds?.width) && finite(readback.bounds?.height), 'MEDIA_BOUNDS_UNKNOWN');
  req(finite(readback.parentX) && finite(readback.parentY), 'MEDIA_PARENT_COORDINATES_UNKNOWN');
  req(readback.transform !== undefined && finite(readback.rotation) && typeof readback.flipX === 'boolean' && typeof readback.flipY === 'boolean', 'MEDIA_TRANSFORM_UNKNOWN');
  req(readback.fit === fact.fit && readback.focal === fact.focal, 'MEDIA_FIT_OR_FOCAL_DRIFT');
  req(Array.isArray(readback.fills), 'MEDIA_FILLS_UNKNOWN');
}

function assertCoverage(coverage, fixtureId, box, expectedShapeId) {
  const fact = FACTUAL[fixtureId];
  req(coverage?.status === 'KNOWN_PASS', `MEDIA_COVERAGE_UNKNOWN_OR_FAIL:${fixtureId}`);
  req(coverage.shapeId === expectedShapeId, 'COVERAGE_SHAPE_ID_DRIFT');
  req(coverage.rasterSha256 === fact.sha256 && coverage.fit === fact.fit && coverage.focal === fact.focal, 'COVERAGE_FACT_DRIFT');
  req(coverage.rawFill?.completeRaster === true && coverage.rectangle?.completeRaster === true && coverage.mediaGroup?.completeRaster === true, 'RAW_FILL_SHAPE_GROUP_NOT_COMPLETE');
  req(coverage.rawFill.rasterSha256 === fact.sha256 && coverage.rectangle.rasterSha256 === fact.sha256 && coverage.mediaGroup.rasterSha256 === fact.sha256, 'COVERAGE_RASTER_MISMATCH');
  req(coverage.destination?.fullExactBox === true && coverage.uncoveredPixelCount === 0 && coverage.letterboxPixelCount === 0, 'MEDIA_DESTINATION_NOT_FULLY_COVERED');
  req(coverage.opaqueNonSourceOverlayCount === 0, 'OPAQUE_NON_SOURCE_OVERLAY');
  const expected = expectedCrop(fixtureId, box);
  const actual = coverage.sourceCropNormalized;
  req(actual && ['x','y','width','height'].every(k => close(actual[k], expected[k], 2e-6)) && coverage.cropAxis === expected.axis, 'MEDIA_CROP_READBACK_MISMATCH');
  req(coverage.bounds && close(coverage.bounds.width,box.width,1e-6) && close(coverage.bounds.height,box.height,1e-6), 'COVERAGE_BOX_DRIFT');
  req(coverage.transform !== undefined && finite(coverage.rotation) && typeof coverage.flipX === 'boolean' && typeof coverage.flipY === 'boolean', 'COVERAGE_TRANSFORM_UNKNOWN');
  return coverage;
}

function rootsPreflight(adapter) {
  const rows=[];
  for (const spec of ROOTS) {
    const root=req(adapter.root(spec.rootId), `ROOT_MISSING:${spec.rootId}`);
    req(root.id === spec.rootId, 'ROOT_RESOLUTION_DRIFT');
    const shape=req(adapter.uniqueSemanticShape(root,MEDIA_SLOT), `MEDIA_SHAPE_MISSING_OR_AMBIGUOUS:${spec.rootId}`);
    const before=adapter.shapeReadback(shape);
    assertShapeReadback(before,FACTUAL[spec.fixtureId],shape.id);
    rows.push({spec,root,shape,before});
  }
  req(new Set(rows.map(x=>x.shape.id)).size===4,'MEDIA_SHAPE_IDS_NOT_UNIQUE');
  return rows;
}

function alreadyRepaired(adapter, rows) {
  try {
    for (const row of rows) {
      if (!VARIANTS.some(v=>v.id===row.before.mediaConstructionVariant)) return false;
      assertCoverage(adapter.coverageReadback(row.shape,{scope:'accepted-root'}),row.spec.fixtureId,row.before.bounds,row.shape.id);
    }
    return true;
  } catch (_) { return false; }
}

async function proveVariants(adapter) {
  const probeRoot=req(await adapter.createDisposableProbeRoot({outsideCollectionId:COLLECTION_ID,name:`${PACKAGE_ID} · DISPOSABLE A-B-C-D`}), 'PROBE_ROOT_CREATE_FAILED');
  req(probeRoot.outsideCollection === true && !ROOTS.some(x=>x.rootId===probeRoot.id), 'PROBE_ROOT_NOT_ISOLATED');
  const outcomes=[];
  try {
    for (const variant of VARIANTS) {
      for (const [fixtureId,fact] of Object.entries(FACTUAL)) {
        const shape=req(await adapter.constructProbe(probeRoot,{variant:{...variant},fixtureId,fact:{...fact,intrinsic:{...fact.intrinsic},desktopBox:{...fact.desktopBox}},box:{...fact.desktopBox}}), `PROBE_CONSTRUCTION_FAILED:${variant.id}:${fixtureId}`);
        const rb=adapter.shapeReadback(shape);
        assertShapeReadback(rb,fact,shape.id);
        const coverage=adapter.coverageReadback(shape,{scope:'probe',variantId:variant.id,fixtureId});
        // Every A/B/C/D result must be explicit.  KNOWN_FAIL is admissible
        // evidence; UNKNOWN/missing fields stop before accepted-root mutation.
        req(coverage?.status==='KNOWN_PASS'||coverage?.status==='KNOWN_FAIL', `PROBE_OUTCOME_UNKNOWN:${variant.id}:${fixtureId}`);
        let passed=false;
        if (coverage.status==='KNOWN_PASS') { assertCoverage(coverage,fixtureId,rb.bounds,shape.id); passed=true; }
        outcomes.push({variantId:variant.id,fixtureId,passed,fillProof:coverage.fillProof||null,coverage});
      }
    }
  } finally {
    await adapter.deleteDisposableProbeRoot(probeRoot);
  }
  req(outcomes.length===VARIANTS.length*Object.keys(FACTUAL).length,'ABCD_PROBE_MATRIX_INCOMPLETE');
  const eligible=VARIANTS.filter(v=>Object.keys(FACTUAL).every(f=>outcomes.some(o=>o.variantId===v.id&&o.fixtureId===f&&o.passed))).sort((a,b)=>a.rank-b.rank);
  req(eligible.length,'NO_NATIVE_CONSTRUCTION_PASSES_BOTH_CASES');
  const selected=eligible[0];
  const proofs=Object.fromEntries(Object.keys(FACTUAL).map(f=>{
    const proof=outcomes.find(o=>o.variantId===selected.id&&o.fixtureId===f)?.fillProof;
    req(proof && proof.rasterSha256===FACTUAL[f].sha256 && proof.variantId===selected.id,'SELECTED_FILL_PROOF_INVALID');
    return [f,proof];
  }));
  return {selected,outcomes,proofs};
}

async function runEventcardMediaRepairV1(ctx) {
  assertAuthorization(ctx);
  const adapter=ctx.nativeAdapter;
  assertAdapter(adapter);
  const beforeCollection=adapter.collectionSnapshot(COLLECTION_ID);
  assertCollection(beforeCollection);
  req((adapter.validate()||[]).length===0,'NATIVE_VALIDATION_BASELINE_DRIFT');
  const rows=rootsPreflight(adapter);

  if (alreadyRepaired(adapter,rows)) {
    const after=adapter.collectionSnapshot(COLLECTION_ID);
    assertCollection(after);
    req(after.protectedProjection===beforeCollection.protectedProjection,'PROTECTED_FREE_COLLECTION_DRIFT');
    return {schema:'kenigevents.asp-eventcard-media-native-result.v1',packageId:PACKAGE_ID,state:'IDEMPOTENT_NATIVE_READBACK_VERIFIED_PENDING_V0',acceptedRootMutations:0,probeMutations:0,rootIds:ROOTS.map(x=>x.rootId),mediaShapeIds:rows.map(x=>x.shape.id),validation:[]};
  }

  const probe=await proveVariants(adapter); // no accepted-root mutation above this line
  const expectedProtected=beforeCollection.protectedProjection;
  const acceptedResult=await adapter.atomic(async transaction=>{
    let mutations=0;
    for (const row of rows) {
      const liveBefore=adapter.shapeReadback(row.shape);
      req(canonical(liveBefore)===canonical(row.before),'MEDIA_PREMUTATION_READBACK_DRIFT');
      const changed=await adapter.applyProvenFillInPlace(transaction,row.shape,{fixtureId:row.spec.fixtureId,fact:FACTUAL[row.spec.fixtureId],variant:probe.selected,fillProof:probe.proofs[row.spec.fixtureId]});
      mutations += changed ? 1 : 0;
      const after=adapter.shapeReadback(row.shape);
      req(after.id===row.before.id && after.semanticSlot===row.before.semanticSlot,'MEDIA_STABLE_ID_DRIFT');
      for (const key of ['bounds','parentX','parentY','transform','rotation','flipX','flipY','fit','focal']) req(canonical(after[key])===canonical(row.before[key]),`MEDIA_NON_FILL_FIELD_DRIFT:${key}`);
      req(after.mediaConstructionVariant===probe.selected.id,'MEDIA_CONSTRUCTION_VARIANT_READBACK_DRIFT');
      assertCoverage(adapter.coverageReadback(row.shape,{scope:'accepted-root'}),row.spec.fixtureId,row.before.bounds,row.shape.id);
    }
    req((adapter.validate()||[]).length===0,'NATIVE_VALIDATION_AFTER_REPAIR');
    const after=adapter.collectionSnapshot(COLLECTION_ID);
    assertCollection(after);
    req(after.protectedProjection===expectedProtected,'PROTECTED_FREE_COLLECTION_DRIFT');
    return {mutations,after};
  });

  return {
    schema:'kenigevents.asp-eventcard-media-native-result.v1',
    packageId:PACKAGE_ID,
    state:'NATIVE_MEDIA_READBACK_VERIFIED_PENDING_V0',
    selectedVariant:probe.selected.id,
    probeMatrix:probe.outcomes.map(x=>({variantId:x.variantId,fixtureId:x.fixtureId,passed:x.passed,status:x.coverage.status})),
    acceptedRootMutations:acceptedResult.mutations,
    rootIds:ROOTS.map(x=>x.rootId),
    mediaShapeIds:rows.map(x=>x.shape.id),
    textMutations:0,
    componentPathMutations:0,
    opaqueOverlayMutations:0,
    validation:[],
    visualAcceptance:'PENDING_V0',
  };
}

if (typeof module!=='undefined' && module.exports) module.exports={PACKAGE_ID,FILE_ID,PAGE_ID,COLLECTION_ID,MEDIA_SLOT,VARIANTS,FACTUAL,ROOTS,canonical,expectedCrop,assertCoverage,runEventcardMediaRepairV1};
