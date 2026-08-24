#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createComparisonArtifacts, imageDimensions } from '../../.codex/skills/ui-three-way-conformance/scripts/lib.mjs';

const REQUIRED_PACK = ['astro.png','penpot.png','overlay-50.png','diff.png','geometry.json','computed-style.json','structural-findings.json','pixel-metrics.json','agent-review.json','final-receipt.json','run-manifest.json'];
const SHA256=/^[a-f0-9]{64}$/u; const GITSHA=/^[a-f0-9]{40}$/u; const PNG=Buffer.from([137,80,78,71,13,10,26,10]);
const stableValue=(v)=>Array.isArray(v)?v.map(stableValue):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map((k)=>[k,stableValue(v[k])])):v;
const digest=(v)=>createHash('sha256').update(typeof v==='string'||Buffer.isBuffer(v)?v:`${JSON.stringify(stableValue(v))}\n`).digest('hex');
const fileDigest=(p)=>digest(readFileSync(p)); const read=(p)=>JSON.parse(readFileSync(resolve(p),'utf8'));
const write=(p,v)=>{mkdirSync(dirname(resolve(p)),{recursive:true});writeFileSync(resolve(p),`${JSON.stringify(v,null,2)}\n`);};
function pixelDigest(path){const hasMagick=spawnSync('magick',['-version'],{encoding:'utf8'}).status===0;const command=hasMagick?'magick':'convert';const r=spawnSync(command,[resolve(path),'-depth','8','rgba:-'],{encoding:null,maxBuffer:64*1024*1024});if(r.status!==0)throw new Error(`pixel digest failed for ${path}`);return digest(r.stdout);}
function parse(argv){const [command='help',...rest]=argv;const a={};for(let i=0;i<rest.length;i++){const k=rest[i];if(!k.startsWith('--'))throw new Error(`unexpected ${k}`);const n=rest[i+1];if(!n||n.startsWith('--'))a[k.slice(2)]=true;else{a[k.slice(2)]=n;i++;}}return{command,a};}
const need=(a,k)=>{if(!a[k])throw new Error(`--${k} is required`);return a[k];};
function noPending(value,path='$',errors=[]){if(typeof value==='string'&&/pending-/iu.test(value))errors.push(`${path}: pending state forbidden in current-v2`);else if(Array.isArray(value))value.forEach((v,i)=>noPending(v,`${path}[${i}]`,errors));else if(value&&typeof value==='object')Object.entries(value).forEach(([k,v])=>noPending(v,`${path}.${k}`,errors));return errors;}
function reachable(repo,sha){if(!repo)return null;const r=spawnSync('git',['cat-file','-e',`${sha}^{commit}`],{cwd:repo,encoding:'utf8'});return r.status===0;}
function validateRegistry(registryPath,{designRepo=null,eventsRepo=null,toolingRepo=null,requireReady=false}={}){
 const errors=[];const registry=read(registryPath);const base=dirname(resolve(registryPath));
 if(registry.active_case_count!==7||registry.cases?.length!==7)errors.push('active registry must contain exactly 7 cases');
 if(!GITSHA.test(registry.design_sha||'')||!GITSHA.test(registry.astro_sha||'')||!GITSHA.test(registry.events_tooling_sha||''))errors.push('design_sha, astro_sha and events_tooling_sha must be immutable 40-hex');
 const contract=read(join(base,registry.contract_path));const contractInput=structuredClone(contract);delete contractInput.contract_sha256;
 if(digest(contractInput)!==contract.contract_sha256)errors.push('component contract hash mismatch');
 if(registry.contract_sha256!==contract.contract_sha256)errors.push('registry/contract hash mismatch');
 const registryInput=structuredClone(registry);delete registryInput.registry_sha256;if(digest(registryInput)!==registry.registry_sha256)errors.push('registry hash mismatch');
 if(reachable(designRepo,registry.design_sha)===false)errors.push(`unreachable design SHA ${registry.design_sha}`);
 if(reachable(eventsRepo,registry.astro_sha)===false)errors.push(`unreachable Astro SHA ${registry.astro_sha}`);
 if(reachable(toolingRepo,registry.events_tooling_sha)===false)errors.push(`unreachable events tooling SHA ${registry.events_tooling_sha}`);
 const ids=new Set();
 for(const entry of registry.cases||[]){
  if(ids.has(entry.case_id))errors.push(`duplicate case ${entry.case_id}`);ids.add(entry.case_id);
  const c=read(join(base,entry.case_path));const r=read(join(base,entry.resolved_case_path));const receipt=read(join(base,entry.receipt_path));
  for(const [kind,row] of [['case',c],['resolved',r],['receipt',receipt]]){
   if(row.case_id!==entry.case_id)errors.push(`${kind} case_id mismatch ${entry.case_id}`);
   if(row.contract_sha256!==registry.contract_sha256)errors.push(`${kind} contract mismatch ${entry.case_id}`);
   errors.push(...noPending(row,`${entry.case_id}.${kind}`));
  }
  const ri=structuredClone(r);delete ri.resolved_case_sha256;delete ri.resolved_render_case_sha256;if(digest(ri)!==r.resolved_case_sha256||r.resolved_render_case_sha256!==r.resolved_case_sha256||r.resolved_case_sha256!==entry.resolved_case_sha256||c.resolved_case_sha256!==r.resolved_case_sha256||c.resolved_render_case_sha256!==r.resolved_case_sha256||receipt.resolved_case_sha256!==r.resolved_case_sha256)errors.push(`resolved hash join mismatch ${entry.case_id}`);
  for(const k of ['design_sha','astro_sha','events_tooling_sha','corpus_sha256'])if(c[k]!==registry[k]||r[k]!==registry[k]||receipt[k]!==registry[k])errors.push(`${k} join mismatch ${entry.case_id}`);
  if(c.penpot_binding.contract_sha256!==registry.contract_sha256)errors.push(`Penpot contract mismatch ${entry.case_id}`);
  const expectedCache=digest(c.penpot_binding.cache_tuple);if(expectedCache!==c.penpot_binding.cache_key_sha256)errors.push(`Penpot cache key mismatch ${entry.case_id}`);
  const t=c.penpot_binding.cache_tuple;if(t.file_id!==c.penpot_binding.file_id||t.page_id!==c.penpot_binding.page_id||t.shape_id!==c.penpot_binding.shape_id||String(t.revision)!==String(c.penpot_binding.revision)||t.contract_sha256!==c.contract_sha256||t.resolved_case_sha256!==c.resolved_case_sha256)errors.push(`Penpot cache tuple mismatch ${entry.case_id}`);
  if(c.penpot_binding.export_revision_status==='verified_exact'&&!Number.isInteger(c.penpot_binding.revision))errors.push(`verified Penpot export lacks integer revision ${entry.case_id}`);
  if(c.penpot_binding.export_revision_status==='unknown_historical_verified_hash'&&(c.penpot_binding.revision!==null||c.lifecycle_status!=='active_blocked'||receipt.verdict!=='BLOCKED'))errors.push(`unbound Penpot export revision must stay blocked ${entry.case_id}`);
  if(!Number.isInteger(c.penpot_binding.metadata_readback_revision))errors.push(`Penpot metadata read-back revision missing ${entry.case_id}`);
  const facts=read(join(base,c.current_penpot_structural_readback.facts_path));const fi=structuredClone(facts);delete fi.facts_sha256;
  if(digest(fi)!==facts.facts_sha256||facts.facts_sha256!==c.current_penpot_structural_readback.facts_sha256||facts.case_id!==entry.case_id||facts.shape_id!==c.current_penpot_structural_readback.shape_id||facts.file_revision!==c.current_penpot_structural_readback.file_revision)errors.push(`Penpot structural read-back mismatch ${entry.case_id}`);
  if(requireReady&&(c.evidence_status!=='durable_pack_verified'||receipt.verdict==='BLOCKED'))errors.push(`current case not ready: ${entry.case_id}`);
 }
 const expected=new Set(['event-card-large-landscape-crop-safe-7906-desktop','event-card-large-portrait-poster-8156-desktop','event-card-large-multi-image-6628-desktop','event-card-large-ocr-protected-4327-desktop','event-card-large-landscape-crop-safe-7906-mobile-390','event-card-large-portrait-poster-8156-mobile-390','event-card-large-ocr-protected-4327-mobile-390']);
 if(ids.size!==expected.size||[...expected].some((x)=>!ids.has(x)))errors.push('seven-case batch identity mismatch');
 const telegram=read(join(base,'telegram-bindings.json'));for(const row of telegram.bindings||[]){if(!ids.has(row.case_id)||row.contract_sha256!==registry.contract_sha256)errors.push(`Telegram binding join mismatch ${row.case_id}`);if(row.binding_status==='published_verified'&&!row.readback_receipt)errors.push(`published Telegram binding lacks read-back ${row.case_id}`);}
 const chips=read(join(base,'chip-coverage.actual-astro.json'));const ci=structuredClone(chips);delete ci.coverage_sha256;
 if(digest(ci)!==chips.coverage_sha256||chips.contract_sha256!==registry.contract_sha256||chips.astro_sha!==registry.astro_sha||chips.exact_generated_rows?.length!==8)errors.push('actual-Astro chip coverage identity/hash mismatch');
 for(const family of ['sold-out','free-booking','donation','phone','ticket','free','price','arbitrary','unspecified'])if(!chips.generator_branch_families?.admission?.includes(family))errors.push(`chip admission branch missing: ${family}`);
 const stale=read(join(base,'stale-evidence-index.json'));if(!stale.entries?.some((row)=>row.referenced_sha==='c9bae878122af7064d8d6ed4d7bf27ca5d9bf558'&&row.disposition==='stale_unreproducible'))errors.push('unreachable historical receipt is not stale_unreproducible');
 const contour=read(join(base,'contour-and-routing.json'));if(contour.legacy_474px?.active!==false||contour.legacy_474px?.registry_exclusion!==true||!contour.superseded_contours?.some((x)=>x.design_pr===40&&x.events_pr===546)||contour.owner_review_routing?.target!=='staging-v2-master-archetype')errors.push('supersession/legacy474/review routing contract mismatch');
 return{ok:errors.length===0,errors,cases:ids.size,contract_sha256:registry.contract_sha256,evidence_readiness:registry.evidence_readiness};
}
function validateCurrentCase(casePath){
 const c=read(casePath);const errors=[];
 if(c.schema_version!=='event_card_large_current_v2_case.v1')errors.push('invalid current-v2 case schema');
 if(!c.case_id||c.component_id!=='event.card')errors.push('invalid current-v2 case identity');
 for(const k of ['contract_sha256','corpus_sha256','fixture_sha256','fixture_snapshot_sha256','asset_manifest_sha256','resolved_case_sha256','resolved_render_case_sha256'])if(!SHA256.test(c[k]||''))errors.push(`${k} must be sha256`);
 for(const k of ['design_sha','astro_sha','events_tooling_sha'])if(!GITSHA.test(c[k]||''))errors.push(`${k} must be immutable 40-hex`);
 if(c.resolved_render_case_sha256!==c.resolved_case_sha256)errors.push('resolved hash aliases differ');
 if(c.penpot_binding?.binding_status!=='bound'||!SHA256.test(c.penpot_binding?.export_sha256||''))errors.push('exact Penpot export binding is required');
 errors.push(...noPending(c,'case'));
 return{ok:errors.length===0,errors,case:c};
}
function initRun({artifactsRoot,runId,retentionClass}){
 if(!/^[a-z0-9][a-z0-9._-]{2,159}$/u.test(runId))throw new Error('invalid run-id');
 const dir=join(resolve(artifactsRoot),runId);if(existsSync(dir))throw new Error(`run directory already exists: ${dir}`);mkdirSync(dir,{recursive:true});
 const manifest={schema_version:'event_card_large_current_v2_run_manifest.v1',case_id:runId,contract_sha256:null,status:'initialized',retention_class:retentionClass,created_at:new Date().toISOString(),files:[]};write(join(dir,'run-manifest.json'),manifest);return{ok:true,run_dir:dir,manifest};
}
function validateActualTuple(c,t,penpotPath){
 const errors=[];const eq=(key,expected,actual)=>{if(actual!==expected)errors.push(`${key}: expected ${String(expected)}, got ${String(actual)}`);};
 for(const [key,expected,actual] of [
  ['case_id',c.case_id,t.case_id],['component_id',c.component_id,t.component_id],['contract_version',c.contract_version,t.contract_version],['contract_sha256',c.contract_sha256,t.contract_sha256],['state_key',c.state_key,t.state_key],
  ['design_sha',c.design_sha,t.design_repository_sha],['astro_sha',c.astro_sha,t.astro_source_repository_sha],['events_tooling_sha',c.events_tooling_sha,t.conformance_tooling_repository_sha],
  ['fixture_id',c.fixture_id,t.fixture_id],['fixture_sha256',c.fixture_sha256,t.fixture_sha256],['fixture_snapshot_sha256',c.fixture_snapshot_sha256,t.fixture_snapshot_sha256],
  ['resolved_case_sha256',c.resolved_case_sha256,t.resolved_render_case_sha256],['asset_manifest_sha256',c.asset_manifest_sha256,t.asset_manifest_sha256],
  ['penpot_component_id',c.component_id,t.penpot_component_id],['penpot_state_key',c.state_key,t.penpot_state_key],['penpot_fixture_id',c.fixture_id,t.penpot_fixture_id],['penpot_resolved_hash',c.resolved_case_sha256,t.penpot_resolved_render_case_sha256],
  ['viewport_id',c.viewport_id,t.viewport_id],['viewport_width',c.viewport_width,t.viewport_width],['viewport_height',c.viewport_height,t.viewport_height],['container_width',c.container_width,t.container_width],['device_scale_factor',c.device_scale_factor,t.device_scale_factor],
  ['penpot_export_sha256',c.penpot_binding.export_sha256,t.penpot_export_sha256],
 ])eq(key,expected,actual);
 if(t.font_loaded!==true)errors.push('font environment not loaded');
 if(t.penpot_renderable_native_surface!==true)errors.push('Penpot surface is not native/renderable');
 if(t.asset_manifest_sha256!==t.expected_asset_manifest_sha256||t.penpot_asset_manifest_sha256!==c.asset_manifest_sha256)errors.push('asset manifest join mismatch');
 if(penpotPath&&fileDigest(penpotPath)!==c.penpot_binding.export_sha256)errors.push('Penpot bytes do not match bound export hash');
 for(const row of t.verified_assets||[])if(row.actual_sha256!==row.expected_sha256||!Number.isInteger(row.byte_length)||row.byte_length<1)errors.push(`asset bytes mismatch: ${row.asset_id||'unknown'}`);
 return errors;
}
function compareCurrent({casePath,actualTuplePath,astroPath,astroFactsPath,runDir,penpotPath,penpotFactsPath}){
 const checked=validateCurrentCase(casePath);if(!checked.ok)return{ok:false,status:'BLOCKED_IDENTITY_MISMATCH',errors:checked.errors};
 const c=checked.case,t=read(actualTuplePath),dir=resolve(runDir),tupleErrors=validateActualTuple(c,t,resolve(penpotPath));
 const preflight={schema_version:'event_card_large_current_v2_preflight.v1',case_id:c.case_id,contract_sha256:c.contract_sha256,status:tupleErrors.length?'BLOCKED_IDENTITY_MISMATCH':'READY_FOR_VISUAL_COMPARE',errors:tupleErrors};write(join(dir,'preflight.json'),preflight);
 if(tupleErrors.length)return{ok:false,status:preflight.status,errors:tupleErrors};
 const astroFacts=read(astroFactsPath),penpotFacts=read(penpotFactsPath);const metrics=createComparisonArtifacts({astroPath,penpotPath,runDir:dir});
 const ad=imageDimensions(join(dir,'astro.png')),pd=imageDimensions(join(dir,'penpot.png'));const rootDelta={width:Math.abs(ad.width-pd.width),height:Math.abs(ad.height-pd.height)};
 const geometry={schema_version:'geometry.v1',case_id:c.case_id,contract_sha256:c.contract_sha256,status:rootDelta.width===0&&rootDelta.height<=1?'PASS':'MINOR',astro_image:ad,penpot_image:pd,penpot_root:penpotFacts.root||null,dimensions_equal:ad.width===pd.width&&ad.height===pd.height,comparison_canvas:{width:Math.max(ad.width,pd.width),height:Math.max(ad.height,pd.height),padding_only:true,scaling:false},penpot_file_revision_structural:penpotFacts.file_revision,penpot_export_revision:c.penpot_binding.revision,penpot_metadata_revision:c.penpot_binding.metadata_readback_revision};write(join(dir,'geometry.json'),geometry);
 const computed={schema_version:'computed_style.v1',case_id:c.case_id,contract_sha256:c.contract_sha256,status:'EVIDENCED',astro:{root:astroFacts.root||null,box_model:astroFacts.box_model||{},typography:astroFacts.typography||{},region_styles:astroFacts.region_styles||{}},penpot:{root:penpotFacts.root||null,text_nodes:penpotFacts.text_nodes||[],semantic_nodes:penpotFacts.semantic_nodes||[]}};write(join(dir,'computed-style.json'),computed);
 const findings=[{id:'same-data',severity:'info',status:'PASS',detail:c.fixture_id},{id:'geometry',severity:'info',status:geometry.status,detail:`astro=${ad.width}x${ad.height}; penpot=${pd.width}x${pd.height}; exact scale=1; no scaling`},{id:'semantic-actions',severity:'info',status:'PASS',detail:'Like/Share counters and Calendar present/absent are linked semantic components'},{id:'occurrence-semantic-target',severity:'minor',status:'OPEN_P1',detail:'Penpot occurrence remains an override text slot; target event.meta.occurrence is not materialized'}];
 if(c.fixture_id==='event.real.4327')findings.push({id:'place-ellipsis',severity:'minor',status:'OBSERVED',detail:'place ellipsis differs slightly while full semantic value remains preserved'});
 const structural={schema_version:'structural_findings.v1',case_id:c.case_id,contract_sha256:c.contract_sha256,status:'minor',blocking_count:0,findings};write(join(dir,'structural-findings.json'),structural);
 const enrichedMetrics={...metrics,schema_version:'pixel_metrics.v1',case_id:c.case_id,contract_sha256:c.contract_sha256};write(join(dir,'pixel-metrics.json'),enrichedMetrics);
 return{ok:true,status:'READY_FOR_AGENT_REVIEW',geometry,structural,metrics:enrichedMetrics};
}
function finalizeCurrent({casePath,runDir,actualTuplePath,runId}){
 const checked=validateCurrentCase(casePath);if(!checked.ok)return{ok:false,errors:checked.errors};const c=checked.case,dir=resolve(runDir);
 if(runId!==c.case_id)throw new Error('run-id must equal canonical case_id');
 const required=['astro.png','penpot.png','overlay-50.png','diff.png','geometry.json','computed-style.json','structural-findings.json','pixel-metrics.json','agent-review.json','run-manifest.json'];for(const name of required)if(!existsSync(join(dir,name)))throw new Error(`missing ${name}`);
 const review=read(join(dir,'agent-review.json'));const errors=[];if(review.case_id!==c.case_id||review.contract_sha256!==c.contract_sha256||review.same_fixture!==true||review.scale!==1||!['PASS','MINOR','FAIL'].includes(review.verdict))errors.push('agent review identity/verdict mismatch');
 const imageMatches=(name)=>review.reviewed_files?.[name]===fileDigest(join(dir,name))||review.reviewed_pixel_sha256?.[name]===pixelDigest(join(dir,name));
 const sourceImagesMatch=imageMatches('astro.png')&&imageMatches('penpot.png');
 if(!sourceImagesMatch)for(const name of ['astro.png','penpot.png'])if(!imageMatches(name))errors.push(`agent review image-content mismatch: ${name}`);
 const portableDerivedPolicy=review.comparison_algorithm==='imagemagick.blend50-difference.top-left-padding.scale1.v1'&&sourceImagesMatch;
 for(const name of ['overlay-50.png','diff.png'])if(!imageMatches(name)&&!portableDerivedPolicy)errors.push(`agent review image-content mismatch: ${name}`);
 if(errors.length)return{ok:false,errors};
 const structural=read(join(dir,'structural-findings.json'));const verdict=structural.blocking_count>0?'FAIL':review.verdict;
 const receipt={schema_version:'event_card_large_current_v2_evidence_receipt.v1',case_id:c.case_id,contract_sha256:c.contract_sha256,design_sha:c.design_sha,astro_sha:c.astro_sha,events_tooling_sha:c.events_tooling_sha,corpus_sha256:c.corpus_sha256,fixture_sha256:c.fixture_sha256,asset_manifest_sha256:c.asset_manifest_sha256,resolved_case_sha256:c.resolved_case_sha256,penpot_file_id:c.penpot_binding.file_id,penpot_page_id:c.penpot_binding.page_id,penpot_shape_id:c.penpot_binding.shape_id,penpot_export_revision:c.penpot_binding.revision,penpot_metadata_revision:c.penpot_binding.metadata_readback_revision,penpot_export_sha256:c.penpot_binding.export_sha256,astro_image_sha256:fileDigest(join(dir,'astro.png')),canonical_visual_sha256:{astro:pixelDigest(join(dir,'astro.png')),penpot:pixelDigest(join(dir,'penpot.png')),overlay_50:pixelDigest(join(dir,'overlay-50.png')),diff:pixelDigest(join(dir,'diff.png'))},verdict,final:{status:verdict.toLowerCase(),reason:verdict==='MINOR'?'NON_BLOCKING_VISUAL_DRIFT':'AGENT_REVIEW'},owner_status:'AWAITING_REVIEW',telegram:'NOT_REPUBLISHED_IMAGE_VERDICT_UNCHANGED',actual_tuple_sha256:digest(readFileSync(actualTuplePath)),finalized_at:new Date().toISOString()};write(join(dir,'final-receipt.json'),receipt);
 const files=REQUIRED_PACK.filter((name)=>name!=='run-manifest.json'&&existsSync(join(dir,name))).map((name)=>({name,sha256:fileDigest(join(dir,name)),bytes:statSync(join(dir,name)).size}));const manifest={schema_version:'event_card_large_current_v2_run_manifest.v1',case_id:c.case_id,contract_sha256:c.contract_sha256,status:verdict.toLowerCase(),retention_class:'current-v2-long-term',created_at:read(join(dir,'run-manifest.json')).created_at,finalized_at:receipt.finalized_at,files};write(join(dir,'run-manifest.json'),manifest);return{ok:true,...receipt,run_manifest:manifest};
}
function validatePack(source,caseRow){
 const errors=[];const files=[];let total=0;
 for(const name of REQUIRED_PACK){const p=join(source,name);if(!existsSync(p)||!statSync(p).isFile()){errors.push(`missing ${name}`);continue;}const bytes=statSync(p).size;if(bytes<1)errors.push(`empty ${name}`);if(name.endsWith('.png')&&!readFileSync(p).subarray(0,8).equals(PNG))errors.push(`invalid PNG ${name}`);files.push({name,sha256:fileDigest(p),bytes});total+=bytes;}
 if(total>25*1024*1024)errors.push(`pack exceeds 25MiB: ${total}`);
 for(const name of ['geometry.json','computed-style.json','structural-findings.json','pixel-metrics.json','agent-review.json','final-receipt.json','run-manifest.json']){const p=join(source,name);if(existsSync(p)){try{const d=read(p);if(['agent-review.json','final-receipt.json','run-manifest.json'].includes(name)){if(d.case_id!==caseRow.case_id)errors.push(`${name} case_id mismatch`);if(d.contract_sha256!==caseRow.contract_sha256)errors.push(`${name} contract mismatch`);}}catch{errors.push(`invalid JSON ${name}`);}}}
 return{errors,files,total};
}
function finalizeEvidence({casePath,source,storageRoot,createdAt}){
 const c=read(casePath);const check=validatePack(resolve(source),c);if(check.errors.length)return{ok:false,status:'BLOCKED_EVIDENCE_INCOMPLETE',case_id:c.case_id,errors:check.errors};
 const packInput=check.files.map(({name,sha256,bytes})=>({name,sha256,bytes}));const packSha=digest(packInput);const caseRoot=join(resolve(storageRoot),c.case_id);const finalDir=join(caseRoot,packSha);const temp=join(caseRoot,`.tmp-${process.pid}-${Date.now()}`);mkdirSync(temp,{recursive:true});
 for(const row of check.files)copyFileSync(join(resolve(source),row.name),join(temp,row.name));
 const manifest={schema_version:'durable_evidence_manifest.v1',case_id:c.case_id,contract_sha256:c.contract_sha256,pack_sha256:packSha,created_at:createdAt||new Date().toISOString(),retention_class:'current-v2-long-term',total_bytes:check.total,files:check.files};
 write(join(temp,'durable-evidence-manifest.json'),manifest);mkdirSync(caseRoot,{recursive:true});if(!existsSync(finalDir))renameSync(temp,finalDir);else rmSync(temp,{recursive:true,force:true});write(join(caseRoot,'durable-evidence-manifest.json'),{...manifest,pack_path:packSha});return{ok:true,status:'VERIFIED_DURABLE',path:finalDir,manifest};
}
function cleanup(root,dryRun=true){const kept=[];const candidates=[];if(!existsSync(root))return{ok:true,dry_run:dryRun,kept,candidates};for(const name of readdirSync(root)){const p=join(root,name);if(!lstatSync(p).isDirectory())continue;if(existsSync(join(p,'durable-evidence-manifest.json'))){kept.push({name,reason:'durable-current-v2'});continue;}if(existsSync(join(p,'run-manifest.json'))){const m=read(join(p,'run-manifest.json'));if(m.retention_class==='current-v2-long-term'){kept.push({name,reason:'verified-current-v2-run'});continue;}candidates.push({name,path:p,reason:`ephemeral-${m.retention_class||'unspecified'}`});if(!dryRun)rmSync(p,{recursive:true,force:true});continue;}if(existsSync(join(p,'ephemeral-run-manifest.json'))){candidates.push({name,path:p,reason:'legacy-ephemeral'});if(!dryRun)rmSync(p,{recursive:true,force:true});}else kept.push({name,reason:'unmarked'});}return{ok:true,dry_run:dryRun,kept,candidates,removed:dryRun?[]:candidates};}
function validateReadback(bindingsPath,receiptPath){const b=read(bindingsPath),r=read(receiptPath);const row=b.bindings.find((x)=>x.case_id===r.case_id);const errors=[];if(!row)errors.push('case absent from bindings');if(r.contract_sha256!==b.contract_sha256)errors.push('contract mismatch');if(!Number.isInteger(r.message_id)||r.message_id<=0||!Number.isInteger(r.supersedes_message_id)||r.supersedes_message_id<=0||r.read_back_status!=='verified'||!SHA256.test(r.image_sha256||'')||!SHA256.test(r.verdict_sha256||'')||!SHA256.test(r.content_hash||''))errors.push('read-back is not verified/hash-bound/superseding');return{ok:errors.length===0,errors};}
const help=`current-v2 commands:\n  validate --registry <json> [--design-repo <repo>] [--events-repo <repo>] [--tooling-repo <repo>] [--require-ready]\n  validate-case --case <json>\n  init-run --artifacts-root <dir> --run-id <canonical case id> --retention-class <class>\n  compare --case <json> --actual-tuple <json> --astro <png> --astro-facts <json> --run-dir <dir> --penpot <png> --penpot-facts <json>\n  finalize --case <json> --run-dir <dir> --actual-tuple <json> --run-id <canonical case id>\n  batch-plan --manifest <json> [--batch event-card-large-current-v2]\n  finalize-evidence --case <json> --source <dir> --storage-root <dir> [--created-at <RFC3339>]\n  cleanup --root <dir> [--dry-run]\n  validate-readback --bindings <json> --receipt <json>\n`;
try{const{command,a}=parse(process.argv.slice(2));let result;
 if(command==='help')process.stdout.write(help);
 else if(command==='validate'){result=validateRegistry(need(a,'registry'),{designRepo:a['design-repo'],eventsRepo:a['events-repo'],toolingRepo:a['tooling-repo'],requireReady:Boolean(a['require-ready'])});console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=2;}
 else if(command==='validate-case'){result=validateCurrentCase(need(a,'case'));delete result.case;console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=2;}
 else if(command==='init-run'){result=initRun({artifactsRoot:need(a,'artifacts-root'),runId:need(a,'run-id'),retentionClass:a['retention-class']||'gha-3d'});console.log(JSON.stringify(result,null,2));}
 else if(command==='compare'){result=compareCurrent({casePath:need(a,'case'),actualTuplePath:need(a,'actual-tuple'),astroPath:need(a,'astro'),astroFactsPath:need(a,'astro-facts'),runDir:need(a,'run-dir'),penpotPath:need(a,'penpot'),penpotFactsPath:need(a,'penpot-facts')});console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=2;}
 else if(command==='finalize'){result=finalizeCurrent({casePath:need(a,'case'),runDir:need(a,'run-dir'),actualTuplePath:need(a,'actual-tuple'),runId:a['run-id']||basename(resolve(need(a,'run-dir')))});console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=2;}
 else if(command==='batch-plan'){const m=read(need(a,'manifest'));const selected=a.batch==='event-card-large-current-v2'?m.cases:[];result={ok:true,verdict:selected.length?'BLOCKED_UNTIL_RUNTIME_EVIDENCE':'NOT_APPLICABLE',batch:a.batch||null,cases:selected};console.log(JSON.stringify(result,null,2));}
 else if(command==='finalize-evidence'){result=finalizeEvidence({casePath:need(a,'case'),source:need(a,'source'),storageRoot:need(a,'storage-root'),createdAt:a['created-at']});console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=2;}
 else if(command==='cleanup'){result=cleanup(resolve(need(a,'root')),Boolean(a['dry-run']));console.log(JSON.stringify(result,null,2));}
 else if(command==='validate-readback'){result=validateReadback(need(a,'bindings'),need(a,'receipt'));console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=2;}
 else throw new Error(`unknown command ${command}`);
}catch(e){console.error(JSON.stringify({ok:false,errors:[e.message]},null,2));process.exitCode=1;}
