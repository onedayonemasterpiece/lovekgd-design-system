#!/usr/bin/env node
import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  BEHAVIOR_ROOT,
  RELEASES,
  assert,
  readJson,
  readJsonl,
  shaBuffer,
  validateCensusDeterminism,
  validateProductRecords,
  validateVisualEvidence
} from './evidence-value-gates-v1-1-lib.mjs';

const argv=process.argv.slice(2);
const valueAfter=(flag)=>{const i=argv.indexOf(flag);return i<0?null:argv[i+1]};
const optionValues=new Set(['--events-repo','--prior-archive','--closure-archive'].flatMap((flag)=>{const value=valueAfter(flag);return value?[flag,value]:[flag]}));
const root=path.resolve(argv.find((value)=>!value.startsWith('--')&&!optionValues.has(value))??'.');
const eventsRepo=valueAfter('--events-repo');
const priorArchive=valueAfter('--prior-archive');
const closureArchive=valueAfter('--closure-archive');

const visual=readJsonl(root,'catalog/normalization/visual-review-evidence.jsonl');
const counts=readJson(root,'catalog/normalization/behavioral-manifest-counts.json');
const census=readJsonl(root,'catalog/normalization/independent-consumer-census.jsonl');
const applications=readJsonl(root,'catalog/normalization/component-applications.jsonl');
const readiness=readJsonl(root,'catalog/normalization/product-value-readiness.jsonl');
const schema=readJson(root,'contracts/product-value-evidence-binding.v1.schema.json');

const behaviorManifest=fs.readFileSync(path.join(root,BEHAVIOR_ROOT,'manifest.json'));
assert(shaBuffer(behaviorManifest)==='c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1','immutable behavioral manifest changed');
validateVisualEvidence(root,visual,counts);
validateProductRecords(applications,readiness,census);
assert(census.filter((row)=>row.record_kind==='consumer-edge').length===239,'current independent census must contain 239 active edges');

const schemaProperties=new Set(Object.keys(schema.properties));
for(const key of ['parent_application_id','enabler_kind','effective_value_application_id','census_edge_id','identity_key_sha256','lifecycle_status','deletion_receipt','successor_application_id','record_preserved','adoption_evidence'])assert(schema.required.includes(key),`schema does not require ${key}`);
for(const app of applications){
  assert(Object.keys(app).every((key)=>schemaProperties.has(key)),`${app.id}: undeclared product-binding property`);
  assert(schema.required.every((key)=>Object.hasOwn(app,key)),`${app.id}: required product-binding property missing`);
}
for(const row of census){
  assert(row.scanner.id==='independent-git-object-import-scanner'&&row.scanner.decoder_consumer_edges_read===false,`${row.id}: census is not independent`);
  assert(row.component_inventory.path.endsWith('/source-files.jsonl')&&row.component_inventory.sha256==='0fd45fb92be8f4b2cf36e025e95c32158864921c893020c86a04190f59931c37'&&row.component_inventory.consumer_edges_read===false,`${row.id}: census component inventory provenance mismatch`);
  assert(row.component_source_refs.length>=1&&row.component_source_refs.every((ref)=>/^[a-f0-9]{40}$/.test(ref.commit)&&/^[a-f0-9]{40}$/.test(ref.site_src_tree)&&/^[a-f0-9]{40}$/.test(ref.blob_oid)&&/^[a-f0-9]{64}$/.test(ref.sha256)),`${row.id}: component Git/blob refs incomplete`);
  if(row.record_kind==='consumer-edge')assert(row.occurrences.length>=1&&row.occurrences.every((ref)=>/^[a-f0-9]{40}$/.test(ref.consumer_blob_oid)&&/^[a-f0-9]{64}$/.test(ref.consumer_sha256)&&/^[a-f0-9]{40}$/.test(ref.component_blob_oid)&&/^[a-f0-9]{64}$/.test(ref.component_sha256)),`${row.id}: occurrence Git/blob refs incomplete`);
}
if(eventsRepo)validateCensusDeterminism(root,path.resolve(eventsRepo),applications,census);

function validateArchive(file,release,rows){
  const buffer=fs.readFileSync(file);
  assert(buffer.byteLength===release.archive_bytes,`${release.release_tag}: archive byte count mismatch`);
  assert(shaBuffer(buffer)===release.archive_sha256,`${release.release_tag}: archive SHA-256 mismatch`);
  childProcess.execFileSync('unzip',['-tq',file],{stdio:'pipe'});
  const listing=new Set(childProcess.execFileSync('unzip',['-Z1',file],{encoding:'utf8',maxBuffer:16*1024*1024}).split('\n').filter(Boolean));
  for(const row of rows){
    assert(listing.has(row.archive_entry_path),`${row.id}: archive entry missing`);
    const entry=childProcess.execFileSync('unzip',['-p',file,row.archive_entry_path],{maxBuffer:16*1024*1024});
    assert(entry.byteLength===row.bytes&&shaBuffer(entry)===row.sha256,`${row.id}: archive entry bytes/SHA mismatch`);
  }
}
assert(Boolean(priorArchive)===Boolean(closureArchive),'--prior-archive and --closure-archive must be supplied together');
if(priorArchive){
  validateArchive(path.resolve(priorArchive),RELEASES.prior,visual.filter((row)=>row.storage.lineage===RELEASES.prior.lineage));
  validateArchive(path.resolve(closureArchive),RELEASES.closure,visual.filter((row)=>row.storage.lineage===RELEASES.closure.lineage));
}

process.stdout.write(JSON.stringify({
  status:'valid',
  visual_reviews:visual.length,
  release_lineage:{prior:visual.filter((row)=>row.storage.lineage===RELEASES.prior.lineage).length,closure:visual.filter((row)=>row.storage.lineage===RELEASES.closure.lineage).length},
  source_count_conflicts_observed:counts.source_audit.observed_excluded_conflict_count,
  current_count_conflicts:counts.conflict_count,
  census_edges:census.filter((row)=>row.record_kind==='consumer-edge').length,
  zero_consumer_components:census.filter((row)=>row.record_kind==='zero-consumer-component').length,
  applications:applications.length,
  archive_entries_verified:priorArchive?visual.length:0,
  raw_git_census_replayed:Boolean(eventsRepo)
})+'\n');
