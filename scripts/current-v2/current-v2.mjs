#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const REQUIRED_PACK = ['astro.png','penpot.png','overlay-50.png','diff.png','geometry.json','computed-style.json','structural-findings.json','pixel-metrics.json','agent-review.json','final-receipt.json','run-manifest.json'];
const SHA256=/^[a-f0-9]{64}$/u; const GITSHA=/^[a-f0-9]{40}$/u; const PNG=Buffer.from([137,80,78,71,13,10,26,10]);
const stableValue=(v)=>Array.isArray(v)?v.map(stableValue):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map((k)=>[k,stableValue(v[k])])):v;
const digest=(v)=>createHash('sha256').update(typeof v==='string'||Buffer.isBuffer(v)?v:`${JSON.stringify(stableValue(v))}\n`).digest('hex');
const fileDigest=(p)=>digest(readFileSync(p)); const read=(p)=>JSON.parse(readFileSync(resolve(p),'utf8'));
const write=(p,v)=>{mkdirSync(dirname(resolve(p)),{recursive:true});writeFileSync(resolve(p),`${JSON.stringify(v,null,2)}\n`);};
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
  const ri=structuredClone(r);delete ri.resolved_case_sha256;if(digest(ri)!==r.resolved_case_sha256||r.resolved_case_sha256!==entry.resolved_case_sha256||c.resolved_case_sha256!==r.resolved_case_sha256||receipt.resolved_case_sha256!==r.resolved_case_sha256)errors.push(`resolved hash join mismatch ${entry.case_id}`);
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
function cleanup(root,dryRun=true){const kept=[];const candidates=[];if(!existsSync(root))return{ok:true,dry_run:dryRun,kept,candidates};for(const name of readdirSync(root)){const p=join(root,name);if(!lstatSync(p).isDirectory())continue;if(existsSync(join(p,'durable-evidence-manifest.json'))){kept.push({name,reason:'durable-current-v2'});continue;}if(existsSync(join(p,'ephemeral-run-manifest.json'))){candidates.push({name,path:p});if(!dryRun)rmSync(p,{recursive:true,force:true});}else kept.push({name,reason:'unmarked'});}return{ok:true,dry_run:dryRun,kept,candidates,removed:dryRun?[]:candidates};}
function validateReadback(bindingsPath,receiptPath){const b=read(bindingsPath),r=read(receiptPath);const row=b.bindings.find((x)=>x.case_id===r.case_id);const errors=[];if(!row)errors.push('case absent from bindings');if(r.contract_sha256!==b.contract_sha256)errors.push('contract mismatch');if(!Number.isInteger(r.message_id)||r.message_id<=0||!Number.isInteger(r.supersedes_message_id)||r.supersedes_message_id<=0||r.read_back_status!=='verified'||!SHA256.test(r.image_sha256||'')||!SHA256.test(r.verdict_sha256||'')||!SHA256.test(r.content_hash||''))errors.push('read-back is not verified/hash-bound/superseding');return{ok:errors.length===0,errors};}
const help=`current-v2 commands:\n  validate --registry <json> [--design-repo <repo>] [--events-repo <repo>] [--tooling-repo <repo>] [--require-ready]\n  batch-plan --manifest <json> [--batch event-card-large-current-v2]\n  finalize-evidence --case <json> --source <dir> --storage-root <dir> [--created-at <RFC3339>]\n  cleanup --root <dir> [--dry-run]\n  validate-readback --bindings <json> --receipt <json>\n`;
try{const{command,a}=parse(process.argv.slice(2));let result;
 if(command==='help')process.stdout.write(help);
 else if(command==='validate'){result=validateRegistry(need(a,'registry'),{designRepo:a['design-repo'],eventsRepo:a['events-repo'],toolingRepo:a['tooling-repo'],requireReady:Boolean(a['require-ready'])});console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=2;}
 else if(command==='batch-plan'){const m=read(need(a,'manifest'));const selected=a.batch==='event-card-large-current-v2'?m.cases:[];result={ok:true,verdict:selected.length?'BLOCKED_UNTIL_RUNTIME_EVIDENCE':'NOT_APPLICABLE',batch:a.batch||null,cases:selected};console.log(JSON.stringify(result,null,2));}
 else if(command==='finalize-evidence'){result=finalizeEvidence({casePath:need(a,'case'),source:need(a,'source'),storageRoot:need(a,'storage-root'),createdAt:a['created-at']});console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=2;}
 else if(command==='cleanup'){result=cleanup(resolve(need(a,'root')),Boolean(a['dry-run']));console.log(JSON.stringify(result,null,2));}
 else if(command==='validate-readback'){result=validateReadback(need(a,'bindings'),need(a,'receipt'));console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=2;}
 else throw new Error(`unknown command ${command}`);
}catch(e){console.error(JSON.stringify({ok:false,errors:[e.message]},null,2));process.exitCode=1;}
