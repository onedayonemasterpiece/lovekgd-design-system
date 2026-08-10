import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const DECODER_ROOT='catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc';
export const BEHAVIOR_ROOT='catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc';
export const EVENTS_REPOSITORY='onedayonemasterpiece/events-bot-new';
export const PRODUCT_AUTHORITY_COMMIT='66bc0d43e36299417626f992021cfb7299ddf704';
export const PLANES=Object.freeze([
  Object.freeze({
    id:'current_root_prelaunch',
    commit:'5a9d804438377f65fe4b26bd7019e73626529864',
    tree:'2b48fb6f528edceab69ceab2473bd93cb90fceb6'
  }),
  Object.freeze({
    id:'latest_checked_kaggle_candidate',
    commit:'ef7aa62e45c60f7a12da6160f490719c0721ec03',
    tree:'d46996c4444171d7e10ff648aefd35c5620e17bc'
  })
]);

export const RELEASES=Object.freeze({
  prior:Object.freeze({
    lineage:'prior-reviewed-124',
    backend:'github-release',
    release_tag:'current-ui-behavioral-decoder-v1-1-run-31318132051',
    asset_id:507595606,
    asset_name:'current-ui-behavioral-decoder-v1-1-capture-31318132051.zip',
    url:'https://github.com/onedayonemasterpiece/events-bot-new/releases/download/current-ui-behavioral-decoder-v1-1-run-31318132051/current-ui-behavioral-decoder-v1-1-capture-31318132051.zip',
    archive_sha256:'c677f69572ccdbf5b7f1402037a3cb8c164bd2f503fae35eae9168c46eb8d909',
    archive_bytes:44805665,
    entry_prefix:'capture/'
  }),
  closure:Object.freeze({
    lineage:'closure-new-10',
    backend:'github-release',
    release_tag:'current-ui-behavioral-decoder-v1-1-closure-run-31327863197',
    asset_id:507763470,
    asset_name:'current-ui-behavioral-decoder-v1-1-closure-31327863197.zip',
    url:'https://github.com/onedayonemasterpiece/events-bot-new/releases/download/current-ui-behavioral-decoder-v1-1-closure-run-31327863197/current-ui-behavioral-decoder-v1-1-closure-31327863197.zip',
    archive_sha256:'8bb8712effaa0ba3b08a672a784d9e1b90d876c6ca6d039a417bfc0617723523',
    archive_bytes:3015654,
    entry_prefix:'probe-runtime/'
  })
});

export const VERIFIED_AT='2026-08-10T07:22:28Z';

export const assert=(value,message)=>{if(!value)throw new Error(message)};
export const shaBuffer=(value)=>crypto.createHash('sha256').update(value).digest('hex');
export const shaText=(value)=>shaBuffer(Buffer.from(value));
export const canonical=(value)=>JSON.stringify(value,(_key,item)=>item&&typeof item==='object'&&!Array.isArray(item)
  ?Object.fromEntries(Object.entries(item).sort(([a],[b])=>a.localeCompare(b)))
  :item);
export const readJson=(root,relative)=>JSON.parse(fs.readFileSync(path.join(root,relative),'utf8'));
export const readJsonl=(root,relative)=>fs.readFileSync(path.join(root,relative),'utf8').split('\n').filter(Boolean).map((line,index)=>{
  try{return JSON.parse(line)}catch(error){throw new Error(`${relative}:${index+1}: ${error.message}`)}
});
export const writeJson=(file,value)=>fs.writeFileSync(file,`${JSON.stringify(value,null,2)}\n`);
export const writeJsonl=(file,rows)=>fs.writeFileSync(file,rows.map((row)=>JSON.stringify(row)).join('\n')+'\n');

const uniqueMap=(rows,key,label)=>{
  const result=new Map();
  for(const row of rows){
    const value=typeof key==='function'?key(row):row[key];
    assert(!result.has(value),`${label}: duplicate ${value}`);
    result.set(value,row);
  }
  return result;
};

export function buildVisualEvidence(root){
  const manualLedgerBytes=fs.readFileSync(path.join(root,`${BEHAVIOR_ROOT}/manual-visual-review-ledger.jsonl`));
  const visualLedgerBytes=fs.readFileSync(path.join(root,`${BEHAVIOR_ROOT}/visual-review-ledger.jsonl`));
  assert(manualLedgerBytes.equals(visualLedgerBytes),'manual and canonical visual review ledgers differ');
  assert(shaBuffer(visualLedgerBytes)==='8dafd73a26c14aa6229fdd9d25eb82f14e8639cd47245666ee0cbe792a5e6864','visual review ledger SHA-256 drift');
  const observations=readJsonl(root,`${BEHAVIOR_ROOT}/behavior-specimen-observations.jsonl`);
  const pages=readJsonl(root,`${BEHAVIOR_ROOT}/behavior-page-verification.jsonl`);
  const reviews=readJsonl(root,`${BEHAVIOR_ROOT}/visual-review-ledger.jsonl`);
  const artifact=readJson(root,`${BEHAVIOR_ROOT}/artifact-index.json`);
  const breakpointRasters=readJsonl(root,`${BEHAVIOR_ROOT}/breakpoint-probe-raster-index.jsonl`);
  const railRasters=readJsonl(root,`${BEHAVIOR_ROOT}/rail-keyboard-raster-index.jsonl`);
  assert(observations.length===134&&pages.length===134&&reviews.length===134,'visual source census must be 134/134/134');
  const observationById=uniqueMap(observations,'id','behavior observations');
  const pageByObservation=uniqueMap(pages,'observation_id','page verification');
  const reviewByObservation=uniqueMap(reviews,'observation_id','visual reviews');
  const imageEntries=artifact.entries.filter((entry)=>entry.media_type==='image/png');
  assert(imageEntries.length===134,'artifact image index must contain 134 rows');
  const artifactByPair=uniqueMap(imageEntries,(entry)=>`${entry.path}\0${entry.sha256}`,'artifact images');
  const sourceRasterByPair=new Map();
  for(const [namespace,rows] of [['breakpoint-probe-rasters',breakpointRasters],['rail-keyboard-rasters',railRasters]]){
    for(const row of rows){
      const key=`${row.path}\0${row.sha256}`;
      assert(!sourceRasterByPair.has(key),`source raster duplicate: ${row.path}`);
      sourceRasterByPair.set(key,{namespace,id:row.id});
    }
  }
  const rows=[];
  for(const review of reviews.slice().sort((a,b)=>a.path.localeCompare(b.path)||a.observation_id.localeCompare(b.observation_id))){
    const observation=observationById.get(review.observation_id);
    const page=pageByObservation.get(review.observation_id);
    assert(observation&&page,`${review.id}: missing observation/page join`);
    assert(review.review_status==='reviewed-full-resolution',`${review.id}: source review is not closed at full resolution`);
    const pair=`${review.path}\0${review.sha256}`;
    const entry=artifactByPair.get(pair);
    assert(entry,`${review.id}: missing artifact-index image`);
    assert(observation.screenshot.path===review.path&&observation.screenshot.sha256===review.sha256,`${review.id}: observation raster mismatch`);
    assert(page.screenshot.path===review.path&&page.screenshot.sha256===review.sha256,`${review.id}: page raster mismatch`);
    const source=sourceRasterByPair.get(pair)??{namespace:'behavior-rasters',id:null};
    const archive=source.namespace==='behavior-rasters'?RELEASES.prior:RELEASES.closure;
    rows.push({
      schema_version:'visual_review_evidence_v1_1',
      id:`visual-evidence.${shaText(review.observation_id).slice(0,16)}`,
      raster_id:`raster.${shaText(`${review.path}\0${review.sha256}`).slice(0,16)}`,
      source_namespace:source.namespace,
      source_raster_id:source.id,
      observation_id:review.observation_id,
      review_id:review.id,
      artifact_path:review.path,
      archive_entry_path:`${archive.entry_prefix}${review.path}`,
      sha256:review.sha256,
      bytes:entry.bytes,
      media_type:review.media_type,
      storage:{
        lineage:archive.lineage,
        backend:archive.backend,
        release_tag:archive.release_tag,
        asset_id:archive.asset_id,
        asset_name:archive.asset_name,
        url:archive.url,
        archive_sha256:archive.archive_sha256,
        archive_bytes:archive.archive_bytes,
        permanence_status:'durable'
      },
      retrieval_validation:{
        status:'verified',
        verified_at:VERIFIED_AT,
        method:'release-http-200-content-length-plus-local-archive-sha256-and-entry-sha256',
        full_archive_integrity:'verified'
      },
      reviewer:review.reviewer,
      reviewed_at:review.reviewed_at,
      review_method:'manual-full-resolution-open',
      review_status:'reviewed',
      full_resolution_opened:review.full_resolution_opened,
      conclusion:review.visual_result,
      review_note:review.review_note,
      decision:review.decision,
      component_state:{
        component_id:null,
        binding_status:'packet-phase-state-only-no-deterministic-component-binding',
        packet_id:review.plan_id,
        family:review.family,
        phase:review.phase,
        observation_id:review.observation_id,
        page_verification_id:page.id,
        route_hash:observation.route_hash,
        viewport:observation.viewport,
        breakpoint_probe_ids:observation.breakpoint_probe_ids,
        state_sha256:shaText(canonical(observation.state))
      }
    });
  }
  assert(rows.length===134,'visual evidence row count mismatch');
  assert(new Set(rows.map((row)=>row.raster_id)).size===134,'canonical raster IDs are not unique');
  assert(rows.filter((row)=>row.storage.release_tag===RELEASES.prior.release_tag).length===124,'prior raster lineage must contain 124 rows');
  assert(rows.filter((row)=>row.storage.release_tag===RELEASES.closure.release_tag).length===10,'closure raster lineage must contain 10 rows');
  assert(rows.filter((row)=>row.conclusion==='capture-valid-as-is').length===109,'capture-valid review count must be 109');
  assert(rows.filter((row)=>row.conclusion!=='capture-valid-as-is').length===25,'conflict review count must be 25');
  return rows;
}

export function buildBehaviorCounts(root,visualRows){
  const manifestPath=`${BEHAVIOR_ROOT}/manifest.json`;
  const manifestBytes=fs.readFileSync(path.join(root,manifestPath));
  const manifest=JSON.parse(manifestBytes);
  const outputRecords=Object.fromEntries(Object.entries(manifest.outputs).filter(([,meta])=>Number.isInteger(meta.records)).sort(([a],[b])=>a.localeCompare(b)).map(([name,meta])=>[name,meta.records]));
  const conflicts=[
    ['actionPacketIndex',0,'outputs.action-packet-index.jsonl.records',67],
    ['pageVerification',0,'outputs.behavior-page-verification.jsonl.records',134],
    ['plans',35,'outputs.behavior-specimen-plan.jsonl.records',67],
    ['unresolved',19,'outputs.unresolved.jsonl.records',87],
    ['visualReviewLedger',0,'outputs.visual-review-ledger.jsonl.records',134]
  ].map(([legacy_key,legacy_value,canonical_pointer,canonical_value])=>({
    legacy_pointer:`counts.${legacy_key}`,
    legacy_key,
    legacy_value,
    canonical_pointer,
    canonical_value,
    disposition:'deprecated-stale-conflict'
  }));
  for(const row of conflicts){
    assert(manifest.counts[row.legacy_key]===row.legacy_value,`${row.legacy_key}: legacy value drift`);
    const [file]=row.canonical_pointer.replace('outputs.','').split('.records');
    assert(manifest.outputs[file].records===row.canonical_value,`${row.legacy_key}: canonical value drift`);
  }
  return {
    schema_version:'behavioral_manifest_counts_v1_1',
    source_manifest:{path:manifestPath,sha256:shaBuffer(manifestBytes)},
    namespace_policy:'canonical values derive from manifest.outputs records or explicit terminal/visual projections; deprecated legacy keys are never read as authority',
    canonical_counts:{
      outputs:outputRecords,
      packets:{
        planned:outputRecords['behavior-specimen-plan.jsonl'],
        executable:manifest.counts.executable_packets,
        explicit_blockers:manifest.counts.explicit_blockers,
        observed_states:outputRecords['behavior-specimen-observations.jsonl']
      },
      terminal_probes:{
        total:manifest.closure.terminal_probe_counts.terminal,
        pass:manifest.closure.terminal_probe_counts.pass,
        mismatch:manifest.closure.terminal_probe_counts.mismatch,
        unreachable:manifest.closure.terminal_probe_counts.unreachable
      },
      visual:{
        rasters:visualRows.length,
        prior_reviewed:visualRows.filter((row)=>row.storage.lineage===RELEASES.prior.lineage).length,
        closure_new:visualRows.filter((row)=>row.storage.lineage===RELEASES.closure.lineage).length,
        reviews:visualRows.length,
        review_conflicts:visualRows.filter((row)=>row.conclusion!=='capture-valid-as-is').length,
        capture_valid:visualRows.filter((row)=>row.conclusion==='capture-valid-as-is').length
      },
      findings:{unresolved_records:outputRecords['unresolved.jsonl'],blocking_unresolved_records:manifest.counts.blocking_unresolved_records},
      automation_evidence:outputRecords['automation-evidence-ledger.jsonl']
    },
    deprecated_legacy_conflicts:conflicts,
    conflict_count:conflicts.length,
    source_manifest_mutated:false
  };
}

const git=(repo,args,options={})=>childProcess.execFileSync('git',args,{cwd:repo,encoding:options.encoding??'utf8',maxBuffer:128*1024*1024});
const sourceExtensions=['.astro','.ts','.tsx','.js','.jsx','.mjs','.cjs'];

function listSourceTree(eventsRepo,plane){
  assert(git(eventsRepo,['cat-file','-t',plane.commit]).trim()==='commit',`${plane.id}: source commit unavailable`);
  assert(git(eventsRepo,['rev-parse',`${plane.commit}:site/src`]).trim()===plane.tree,`${plane.id}: site/src tree mismatch`);
  const raw=git(eventsRepo,['ls-tree','-r','-z',`${plane.commit}:site/src`]);
  const entries=[];
  for(const record of raw.split('\0').filter(Boolean)){
    const match=record.match(/^[0-9]+ blob ([a-f0-9]+)\t(.+)$/s);
    if(!match)continue;
    const relative=`src/${match[2]}`;
    if(!sourceExtensions.includes(path.posix.extname(relative)))continue;
    const buffer=childProcess.execFileSync('git',['cat-file','blob',match[1]],{cwd:eventsRepo,maxBuffer:128*1024*1024});
    entries.push({path:relative,blob_oid:match[1],sha256:shaBuffer(buffer),content:buffer.toString('utf8')});
  }
  return entries.sort((a,b)=>a.path.localeCompare(b.path));
}

function importTokens(content){
  const tokens=[];
  const patterns=[
    ['static-import',/\bimport\s+(?:type\s+)?(?:[^'";]*?\s+from\s*)?["']([^"']+)["']/g],
    ['re-export',/\bexport\s+(?:type\s+)?(?:[^'";]*?\s+from\s*)["']([^"']+)["']/g],
    ['dynamic-import',/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g]
  ];
  for(const [kind,regex] of patterns){
    let match;
    while((match=regex.exec(content))!==null){
      const before=content.slice(0,match.index);
      const line=before.split('\n').length;
      const lastNewline=before.lastIndexOf('\n');
      tokens.push({kind,specifier:match[1],line,column:match.index-lastNewline});
    }
  }
  return tokens.sort((a,b)=>a.line-b.line||a.column-b.column||a.specifier.localeCompare(b.specifier));
}

function resolveSpecifier(importer,specifier,sourcePaths){
  const clean=specifier.split(/[?#]/,1)[0];
  let base;
  if(clean.startsWith('.'))base=path.posix.normalize(path.posix.join(path.posix.dirname(importer),clean));
  else if(clean.startsWith('@/'))base=`src/${clean.slice(2)}`;
  else if(clean.startsWith('~/'))base=`src/${clean.slice(2)}`;
  else if(clean.startsWith('/src/'))base=clean.slice(1);
  else if(clean.startsWith('src/'))base=clean;
  else return null;
  const extension=path.posix.extname(base);
  const candidates=extension?[base]:[base,...sourceExtensions.map((ext)=>`${base}${ext}`),...sourceExtensions.map((ext)=>`${base}/index${ext}`)];
  return candidates.find((candidate)=>sourcePaths.has(candidate))??null;
}

export function scanIndependentConsumers(root,eventsRepo,applications){
  // The scanner deliberately consumes only the decoder's source-file inventory for
  // stable component IDs/paths. It never opens consumers.jsonl, plane_bindings, or
  // any precomputed direct_consumers list; all edges below come from raw Git blobs.
  const inventoryPath=`${DECODER_ROOT}/source-files.jsonl`;
  const inventoryBytes=fs.readFileSync(path.join(root,inventoryPath));
  const inventoryRows=readJsonl(root,inventoryPath).filter((row)=>row.type==='component');
  const componentInventory=new Map();
  for(const row of inventoryRows){
    const suffix=row.id.match(/\.([a-f0-9]{16})$/)?.[1];
    assert(suffix,`${row.id}: component inventory ID has no stable suffix`);
    const component={id:`component.${suffix}`,logical_path:row.path};
    const prior=componentInventory.get(row.path);
    assert(!prior||prior.id===component.id,`${row.path}: component identity differs by plane`);
    componentInventory.set(row.path,component);
  }
  const components=[...componentInventory.values()].sort((a,b)=>a.id.localeCompare(b.id));
  assert(components.length===107,'component source inventory must contain 107 logical paths');
  const componentByPath=new Map(components.map((component)=>[component.logical_path,component]));
  const appByPair=uniqueMap(applications,(app)=>`${app.component_id}\0${app.consumer}`,'applications by component/consumer');
  const occurrencesByPair=new Map();
  const sourcesByComponent=new Map(components.map((component)=>[component.id,[]]));
  for(const plane of PLANES){
    const entries=listSourceTree(eventsRepo,plane);
    const byPath=new Map(entries.map((entry)=>[entry.path,entry]));
    const sourcePaths=new Set(byPath.keys());
    for(const component of components){
      const source=byPath.get(component.logical_path);
      if(!source)continue;
      sourcesByComponent.get(component.id).push({
        plane:plane.id,repository:EVENTS_REPOSITORY,commit:plane.commit,site_src_tree:plane.tree,
        path:component.logical_path,blob_oid:source.blob_oid,sha256:source.sha256
      });
    }
    for(const importer of entries){
      for(const token of importTokens(importer.content)){
        const resolved=resolveSpecifier(importer.path,token.specifier,sourcePaths);
        const component=resolved?componentByPath.get(resolved):null;
        if(!component)continue;
        const componentSource=byPath.get(resolved);
        const key=`${component.id}\0${importer.path}`;
        const list=occurrencesByPair.get(key)??[];
        list.push({
          plane:plane.id,repository:EVENTS_REPOSITORY,commit:plane.commit,site_src_tree:plane.tree,
          import_kind:token.kind,specifier:token.specifier,line:token.line,column:token.column,
          resolved_component_path:resolved,component_blob_oid:componentSource.blob_oid,component_sha256:componentSource.sha256,
          consumer_path:importer.path,consumer_blob_oid:importer.blob_oid,consumer_sha256:importer.sha256
        });
        occurrencesByPair.set(key,list);
      }
    }
  }
  for(const component of components)assert(sourcesByComponent.get(component.id).length>0,`component source unavailable in both pinned planes: ${component.logical_path}`);
  const rows=[];
  for(const [key,occurrences] of [...occurrencesByPair].sort(([a],[b])=>a.localeCompare(b))){
    const [componentId,consumer]=key.split('\0');
    const component=components.find((item)=>item.id===componentId);
    const app=appByPair.get(key);
    assert(app,`independent scanner found unregistered application edge: ${componentId} -> ${consumer}`);
    const normalizedOccurrences=occurrences.sort((a,b)=>a.plane.localeCompare(b.plane)||a.line-b.line||a.column-b.column||a.specifier.localeCompare(b.specifier));
    rows.push({
      schema_version:'independent_consumer_census_v1_1',
      id:`census-edge.${shaText(key).slice(0,16)}`,
      record_kind:'consumer-edge',
      match_key_sha256:shaText(key),
      application_id:app.application_id,
      component_id:componentId,
      component_path:component.logical_path,
      consumer,
      component_source_refs:sourcesByComponent.get(componentId),
      occurrences:normalizedOccurrences,
      planes:[...new Set(normalizedOccurrences.map((item)=>item.plane))].sort(),
      scanner:{id:'independent-git-object-import-scanner',version:'1.1.0',decoder_consumer_edges_read:false},
      component_inventory:{path:inventoryPath,sha256:shaBuffer(inventoryBytes),consumer_edges_read:false},
      decision:'NOT_MERGED'
    });
  }
  const scannedPairs=new Set(rows.map((row)=>`${row.component_id}\0${row.consumer}`));
  for(const key of appByPair.keys())assert(scannedPairs.has(key),`application missing from independent census: ${key.replace('\0',' -> ')}`);
  for(const component of components.filter((item)=>!rows.some((row)=>row.component_id===item.id)).sort((a,b)=>a.id.localeCompare(b.id))){
    rows.push({
      schema_version:'independent_consumer_census_v1_1',
      id:`census-zero.${shaText(component.id).slice(0,16)}`,
      record_kind:'zero-consumer-component',
      match_key_sha256:shaText(`${component.id}\0`),
      application_id:null,
      component_id:component.id,
      component_path:component.logical_path,
      consumer:null,
      component_source_refs:sourcesByComponent.get(component.id),
      occurrences:[],
      planes:PLANES.map((plane)=>plane.id),
      scanner:{id:'independent-git-object-import-scanner',version:'1.1.0',decoder_consumer_edges_read:false},
      component_inventory:{path:inventoryPath,sha256:shaBuffer(inventoryBytes),consumer_edges_read:false},
      decision:'NOT_MERGED'
    });
  }
  rows.sort((a,b)=>a.record_kind.localeCompare(b.record_kind)||a.component_id.localeCompare(b.component_id)||(a.consumer??'').localeCompare(b.consumer??''));
  assert(rows.filter((row)=>row.record_kind==='consumer-edge').length===239,'independent consumer edge count must be 239');
  assert(rows.filter((row)=>row.record_kind==='zero-consumer-component').length===3,'independent zero-consumer count must be 3');
  return rows;
}

const productIdFields=Object.freeze({need_ids:'need',job_ids:'job',journey_ids:'journey',capability_ids:'capability',outcome_ids:'outcome',metric_ids:'metric',guardrail_ids:'guardrail'});
export const authoritativeRegistryDigest=(rows)=>shaText(rows.slice().sort((a,b)=>a.kind.localeCompare(b.kind)||a.id.localeCompare(b.id)).map((row)=>canonical(row)+'\n').join(''));

export function augmentApplications(applications,censusRows){
  const censusByPair=new Map(censusRows.filter((row)=>row.record_kind==='consumer-edge').map((row)=>[`${row.component_id}\0${row.consumer}`,row]));
  return applications.map((app)=>{
    const key=`${app.component_id}\0${app.consumer}`;
    const census=censusByPair.get(key);
    const active=Boolean(census);
    return {
      ...app,
      parent_application_id:app.parent_application_id??null,
      effective_value_application_id:app.application_id,
      census_edge_id:census?.id??null,
      identity_key_sha256:shaText(`${EVENTS_REPOSITORY}\0${key}`),
      lifecycle_status:active?'active':'pending_reconciliation',
      deletion_receipt:null,
      successor_application_id:null,
      record_preserved:true,
      product_authority:{
        ...app.product_authority,
        registry_path:null,
        registry_sha256:null,
        registry_digest_algorithm:'sha256-canonical-jsonl-kind-id-order-v1',
        resolver_status:'registry_absent'
      }
    };
  });
}

export function augmentReadiness(readiness,applications){
  const byId=new Map(applications.map((app)=>[app.application_id,app]));
  return readiness.map((row)=>{
    const app=byId.get(row.application_id);
    assert(app,`${row.id}: application missing`);
    return {
      ...row,
      blocking_reasons:app.lifecycle_status==='active'?row.blocking_reasons:[...new Set([...row.blocking_reasons,'independent_consumer_census_edge_missing'])].sort(),
      parent_application_id:app.parent_application_id,
      effective_value_application_id:app.effective_value_application_id,
      census_edge_id:app.census_edge_id,
      lifecycle_status:app.lifecycle_status,
      deletion_receipt:app.deletion_receipt,
      successor_application_id:app.successor_application_id,
      record_preserved:app.record_preserved,
      authoritative_id_resolution:'registry_absent',
      inheritance_resolution:'self',
      reconciliation_status:app.lifecycle_status==='active'?'active-census-match':'pending-census-reconciliation'
    };
  });
}

export function validateVisualEvidence(root,rows,counts){
  const expected=buildVisualEvidence(root);
  assert(canonical(rows)===canonical(expected),'visual-review-evidence.jsonl is not deterministic');
  assert(rows.every((row)=>row.reviewer&&row.reviewed_at&&row.review_method==='manual-full-resolution-open'&&row.review_status==='reviewed'&&row.full_resolution_opened===true&&row.conclusion&&row.decision==='NOT_MERGED'),'visual review status/method/conclusion invariant failed');
  assert(rows.every((row)=>row.component_state.packet_id&&row.component_state.phase&&row.component_state.page_verification_id&&row.component_state.state_sha256),'visual component-state binding incomplete');
  assert(rows.every((row)=>row.component_state.component_id===null&&row.component_state.binding_status==='packet-phase-state-only-no-deterministic-component-binding'),'visual component-state binding invents an unsupported component ID');
  assert(rows.every((row)=>row.storage.permanence_status==='durable'&&row.retrieval_validation.status==='verified'),'visual permanence/retrieval status incomplete');
  const expectedCounts=buildBehaviorCounts(root,rows);
  assert(canonical(counts)===canonical(expectedCounts),'behavioral-manifest-counts.json is not deterministic');
  assert(counts.conflict_count===5&&counts.deprecated_legacy_conflicts.length===5,'count projection must expose exactly five stale conflicts');
}

export function validateProductRecords(applications,readiness,censusRows,{registry=null}={}){
  const registryKinds=new Set(Object.values(productIdFields));
  let registryIndex=null;
  if(registry!==null){
    assert(registry&&Array.isArray(registry.rows),'authoritative registry must include unmodified typed rows');
    assert(registry.repository===EVENTS_REPOSITORY&&registry.commit===PRODUCT_AUTHORITY_COMMIT&&typeof registry.path==='string'&&registry.path.length>0,'authoritative registry provenance mismatch');
    registryIndex=new Map(); const ids=new Set();
    for(const row of registry.rows){
      assert(row&&typeof row.id==='string'&&registryKinds.has(row.kind),`invalid authoritative registry row: ${canonical(row)}`);
      assert(!ids.has(row.id),`duplicate authoritative registry ID: ${row.id}`); ids.add(row.id);
      registryIndex.set(`${row.kind}:${row.id}`,true);
    }
    assert(registry.sha256===authoritativeRegistryDigest(registry.rows),'authoritative registry digest mismatch');
  }
  assert(applications.length===239&&readiness.length===239,'application/readiness census mismatch');
  const appById=uniqueMap(applications,'application_id','applications');
  uniqueMap(applications,'id','application IDs');
  const readinessByApp=uniqueMap(readiness,'application_id','readiness');
  const activeEdges=censusRows.filter((row)=>row.record_kind==='consumer-edge');
  const zeroRows=censusRows.filter((row)=>row.record_kind==='zero-consumer-component');
  assert(zeroRows.length===3,'independent zero-consumer cardinality mismatch');
  const edgeById=uniqueMap(activeEdges,'id','census edges');
  const edgePairs=new Set(activeEdges.map((row)=>`${row.component_id}\0${row.consumer}`));
  assert(edgePairs.size===activeEdges.length,'independent census pair duplication');
  assert(canonical(zeroRows.map((row)=>row.component_id).sort())===canonical(['component.02effc1d8ab8434b','component.29e9aebbf63be827','component.d65fb5ef1db02f46'].sort()),'zero-consumer component set mismatch');
  const identityKeys=new Set();
  for(const edge of activeEdges){
    const app=appById.get(edge.application_id);
    assert(app&&app.lifecycle_status==='active'&&app.census_edge_id===edge.id,`${edge.id}: census edge has no exact active application`);
  }
  for(const app of applications){
    assert(app.id===app.application_id,`${app.id}: identity mismatch`);
    assert(app.parent_application_id===null||appById.has(app.parent_application_id),`${app.id}: unknown parent`);
    assert(app.parent_application_id!==app.id,`${app.id}: self-parent`);
    if(app.value_evidence_mode==='inherited')assert(typeof app.parent_application_id==='string',`${app.id}: inherited application needs parent`);
    else assert(app.parent_application_id===null,`${app.id}: non-inherited application cannot have parent`);
    const expectedIdentity=shaText(`${EVENTS_REPOSITORY}\0${app.component_id}\0${app.consumer}`);
    assert(app.identity_key_sha256===expectedIdentity,`${app.id}: stable identity key mismatch`);
    assert(!identityKeys.has(expectedIdentity),`${app.id}: duplicate stable identity key`); identityKeys.add(expectedIdentity);
    assert(app.record_preserved===true,`${app.id}: application record is not preserved`);
    if(app.lifecycle_status==='active'){
      assert(typeof app.census_edge_id==='string'&&edgeById.has(app.census_edge_id),`${app.id}: active application lacks census edge`);
      const edge=edgeById.get(app.census_edge_id);
      assert(edge.application_id===app.id&&edge.component_id===app.component_id&&edge.consumer===app.consumer,`${app.id}: independent census mismatch`);
      assert(app.deletion_receipt===null&&app.successor_application_id===null,`${app.id}: active application carries deletion state`);
    }else if(app.lifecycle_status==='pending_reconciliation'){
      assert(app.census_edge_id===null&&app.deletion_receipt===null&&app.promotion_ready===false&&app.as_is_preservation_allowed===true,`${app.id}: pending reconciliation invariant failed`);
    }else if(app.lifecycle_status==='tombstoned'){
      assert(app.census_edge_id===null&&typeof app.deletion_receipt==='string'&&app.deletion_receipt.length>0&&app.promotion_ready===false,`${app.id}: tombstone invariant failed`);
      assert(app.successor_application_id===null||appById.has(app.successor_application_id),`${app.id}: tombstone successor unresolved`);
    }else throw new Error(`${app.id}: invalid lifecycle status`);
    const authority=app.product_authority;
    assert(authority.repository===EVENTS_REPOSITORY&&authority.commit===PRODUCT_AUTHORITY_COMMIT,`${app.id}: product authority drift`);
    assert(authority.registry_digest_algorithm==='sha256-canonical-jsonl-kind-id-order-v1',`${app.id}: product registry digest algorithm drift`);
    assert(app.product_value_gate_mode==='observe'&&app.promotion_ready===false,`${app.id}: observe mode escaped into promotion`);
    if(authority.registry_status==='absent-at-pinned-commit'){
      assert(authority.registry_path===null&&authority.registry_sha256===null&&authority.resolver_status==='registry_absent',`${app.id}: absent registry metadata mismatch`);
      for(const field of Object.keys(productIdFields))assert(Array.isArray(app[field])&&app[field].length===0,`${app.id}: invented ${field}`);
      assert(app.value_evidence_status==='pending_product_model'&&app.value_claim===null&&app.expected_mechanism===null&&app.decision_receipt===null,`${app.id}: invented claim/receipt without registry`);
      assert(app.promotion_ready===false&&app.as_is_preservation_allowed===true,`${app.id}: observe pending lifecycle escaped`);
    }else{
      assert(registryIndex&&authority.registry_status==='present-at-pinned-commit',`${app.id}: authoritative registry not supplied`);
      assert(authority.repository===registry.repository&&authority.commit===registry.commit&&authority.registry_path===registry.path&&authority.registry_sha256===registry.sha256&&authority.resolver_status==='resolved',`${app.id}: authoritative registry binding mismatch`);
      for(const [field,kind] of Object.entries(productIdFields))for(const id of app[field])assert(registryIndex.get(`${kind}:${id}`)===true,`${app.id}: unresolved or wrong-kind product ID ${id}`);
    }
    const ready=readinessByApp.get(app.id); assert(ready,`${app.id}: readiness missing`);
    for(const key of ['parent_application_id','effective_value_application_id','census_edge_id','lifecycle_status','deletion_receipt','successor_application_id','record_preserved'])assert(ready[key]===app[key],`${app.id}: readiness ${key} mismatch`);
    assert(ready.authoritative_id_resolution===(authority.registry_status==='absent-at-pinned-commit'?'registry_absent':'resolved'),`${app.id}: readiness resolver mismatch`);
  }
  assert(readinessByApp.size===appById.size,'readiness/application set mismatch');
  const colors=new Map();
  const rootFor=(id)=>{
    const color=colors.get(id)??0;
    assert(color!==1,`${id}: inheritance cycle`);
    if(color===2)return appById.get(id).effective_value_application_id;
    colors.set(id,1);
    const app=appById.get(id);
    let effective=id;
    if(app.value_evidence_mode==='inherited'){
      const parent=appById.get(app.parent_application_id);
      assert(canonical(parent.product_authority)===canonical(app.product_authority),`${id}: cross-authority inheritance`);
      for(const field of [...Object.keys(productIdFields),'value_claim','expected_mechanism','decision_receipt'])assert(Array.isArray(app[field])?app[field].length===0:app[field]===null,`${id}: inherited child overrides ${field}`);
      effective=rootFor(parent.id);
    }
    assert(app.effective_value_application_id===effective,`${id}: effective inheritance mismatch`);
    colors.set(id,2); return effective;
  };
  for(const id of appById.keys())rootFor(id);
  return true;
}

export function validateCensusDeterminism(root,eventsRepo,applications,censusRows){
  const expected=scanIndependentConsumers(root,eventsRepo,applications);
  assert(canonical(censusRows)===canonical(expected),'independent consumer census is not reproducible from pinned Git objects');
}
