#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc');
const fail = (m) => { throw new Error(m); };
const assert = (v,m) => { if (!v) fail(m); };
const bytes = (p) => fs.readFileSync(p);
const sha = (p) => crypto.createHash('sha256').update(bytes(p)).digest('hex');
const json = (p) => JSON.parse(fs.readFileSync(p,'utf8'));
const jsonl = (p) => fs.readFileSync(p,'utf8').split('\n').filter(Boolean).map((line,i) => { try { return JSON.parse(line); } catch(e) { fail(`${p}:${i+1}: ${e.message}`); } });
const unique = (rows,key,label) => assert(new Set(rows.map((x)=>x[key])).size===rows.length,`${label}: duplicate ${key}`);

const manifestPath=path.join(root,'manifest.json');
const receiptPath=path.join(root,'receipt.json');
assert(fs.existsSync(manifestPath)&&fs.existsSync(receiptPath),'manifest/receipt missing');
assert(sha(manifestPath)==='c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1','final behavioral manifest mismatch');
assert(sha(receiptPath)==='d981ad23280dd177d1fef8a59674fe754c5887c76a0981cd722a59c604780d9f','final behavioral receipt mismatch');
const manifest=json(manifestPath); const receipt=json(receiptPath);
assert(manifest.schema_version==='current_ui_behavioral_decoder_v1_1','schema mismatch');
assert(manifest.status==='READY_FOR_PROJECT_NORMALIZATION_SYNTHESIS','closure status mismatch');
assert(receipt.status==='complete'&&receipt.final_status===manifest.status,'receipt is not complete');
assert(receipt.manifest_sha256===sha(manifestPath),'receipt does not bind manifest');
assert(Array.isArray(manifest.blockers)&&manifest.blockers.length===0,'behavioral readiness blockers remain');
assert(manifest.immutable_v1_modified===false,'immutable v1 mutation claimed');
assert(manifest.base_snapshot?.snapshot_id==='decoder-v1-snapshot-20260808T124842-4786ac53bc','base snapshot mismatch');
assert(manifest.base_snapshot?.manifest_sha256==='f7740f7f533c3f0cda5d4d0b8ebe98b565d7f521368b96462daecbd26522d5cc','base manifest mismatch');
for(const key of ['component_deletion','component_merge','component_split','experiment_winner_decision','normalization','penpot','production_astro_css_js','tokens']) assert(manifest.constraints?.[key]===false,`forbidden behavioral constraint: ${key}`);

const outputNames=Object.keys(manifest.outputs||{}).sort();
const files=fs.readdirSync(root,{withFileTypes:true}).filter((x)=>x.isFile()).map((x)=>x.name).sort();
assert(JSON.stringify(files)===JSON.stringify([...outputNames,'manifest.json','receipt.json'].sort()),'behavioral compact file set mismatch');
for(const name of outputNames){
 const p=path.join(root,name); const meta=manifest.outputs[name];
 assert(fs.existsSync(p),`missing behavioral output: ${name}`);
 assert(bytes(p).byteLength===meta.bytes,`behavioral bytes mismatch: ${name}`);
 assert(sha(p)===meta.sha256,`behavioral sha mismatch: ${name}`);
 if(name.endsWith('.jsonl')) assert(jsonl(p).length===meta.records,`behavioral record count mismatch: ${name}`);
 else if(name.endsWith('.json')) json(p);
}

const counts=manifest.counts;
for(const [key,value] of Object.entries({breakpoint_terminal:293,breakpoint_pass:236,breakpoint_mismatch:39,breakpoint_unreachable:18,unresolved_records:87,blocking_unresolved_records:0,observations:134,page_verification:134,rasters:134,visual_reviews:134,behavior_packet_plans:67,executable_packets:59,explicit_blockers:8,automation_evidence:294})) assert(counts[key]===value,`behavioral count mismatch: ${key}`);
const probes=jsonl(path.join(root,'breakpoint-probe-observations.jsonl'));
unique(probes,'id','probes');
const terminal=new Map([['PASS',236],['MISMATCH',39],['UNREACHABLE_WITH_REASON',18]]);
for(const [status,n] of terminal) assert(probes.filter((x)=>x.terminal_status===status).length===n,`probe terminal mismatch: ${status}`);
assert(probes.every((x)=>x.decision==='NOT_MERGED'&&x.normalization_allowed===false),'probe escaped STOP boundary');
const matrix=jsonl(path.join(root,'breakpoint-and-container-matrix.jsonl'));
assert(new Set(matrix.map((x)=>x.id)).size===293,'matrix IDs incomplete');
assert(JSON.stringify([...new Set(matrix.map((x)=>x.id))].sort())===JSON.stringify(probes.map((x)=>x.id).sort()),'matrix/probe IDs differ');
const unresolved=jsonl(path.join(root,'unresolved.jsonl'));
unique(unresolved,'id','unresolved');
assert(unresolved.length===87&&unresolved.every((x)=>x.blocks_ready===false&&x.decision==='NOT_MERGED'),'unresolved closure mismatch');
const plans=jsonl(path.join(root,'behavior-specimen-plan.jsonl'));
assert(plans.length===67&&plans.filter((x)=>x.capture_status==='captured-and-reviewed').length===59&&plans.filter((x)=>x.capture_status==='explicit-blocker').length===8,'plan closure mismatch');
assert(plans.every((x)=>x.blocks_ready===false&&x.decision==='NOT_MERGED'),'plan readiness blocker or merge decision found');
const observations=jsonl(path.join(root,'behavior-specimen-observations.jsonl'));
const reviews=jsonl(path.join(root,'manual-visual-review-ledger.jsonl'));
assert(observations.length===134&&reviews.length===134,'visual evidence count mismatch');
unique(observations,'id','observations'); unique(reviews,'id','reviews');
assert(manifest.human_visual_review?.completed===true&&manifest.human_visual_review?.reviewed_raster_count===134&&manifest.human_visual_review?.ledger_sha256===sha(path.join(root,'manual-visual-review-ledger.jsonl')),'human visual review mismatch');
const experiments=jsonl(path.join(root,'experiment-registry.jsonl'));
assert(experiments.length===6&&experiments.every((x)=>x.decision==='NOT_MERGED'&&x.winner_decision_receipt==='absent'),'experiment winner escaped');
const artifact=json(path.join(root,'artifact-receipt.json'));
assert(artifact.status==='complete'&&artifact.final_status===manifest.status&&artifact.secret_scan?.status==='PASS','artifact receipt incomplete');
assert(artifact.actions?.run_id===31327863197&&artifact.actions?.artifact_id===9042097413,'Actions provenance mismatch');
assert(artifact.permanent_storage?.status==='durable'&&artifact.independent_audit?.status==='PASS','durable/audit provenance missing');

process.stdout.write(JSON.stringify({status:'valid',manifest_sha256:sha(manifestPath),terminal:293,pass:236,mismatch:39,unreachable:18,unresolved:87,rasters:134,reviews:134})+'\n');
