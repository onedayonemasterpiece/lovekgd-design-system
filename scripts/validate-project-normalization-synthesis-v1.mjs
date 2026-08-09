#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import childProcess from 'node:child_process';

const argv=process.argv.slice(2);
const allowPending=argv.includes('--allow-pending-audit');
const eventsIndex=argv.indexOf('--events-repo');
const eventsRepo=eventsIndex>=0?path.resolve(argv[eventsIndex+1]):null;
const root=path.resolve(argv.find((x,i)=>!x.startsWith('--')&&(i===0||argv[i-1]!=='--events-repo'))||'.');
const fail=(m)=>{throw new Error(m)}; const assert=(v,m)=>{if(!v)fail(m)};
const read=(p)=>fs.readFileSync(path.join(root,p));
const json=(p)=>JSON.parse(read(p).toString('utf8'));
const jsonl=(p)=>read(p).toString('utf8').split('\n').filter(Boolean).map((line,i)=>{try{return JSON.parse(line)}catch(e){fail(`${p}:${i+1}: ${e.message}`)}});
const shaBuf=(b)=>crypto.createHash('sha256').update(b).digest('hex'); const sha=(p)=>shaBuf(read(p));
const run=(args,cwd=root)=>childProcess.execFileSync('git',args,{cwd,encoding:'utf8'}).trim();
const unique=(rows,key,label)=>assert(new Set(rows.map((x)=>x[key])).size===rows.length,`${label}: duplicate ${key}`);
const enums={classification:new Set(['accidental_divergence','intentional_product_difference','requirement_implementation_gap','accessibility_gap','consumer_override','historical_difference','unresolved_experiment','decoder_or_probe_issue','normalization_candidate','product_model_dependent']),blocking:new Set(['none','family_decision','implementation','migration','promotion','release','experiment_decision']),before:new Set(['target_contract','first_implementation','consumer_migration','legacy_removal','promotion'])};

const required=[
 'docs/normalization/project-normalization-synthesis-v1.md','docs/normalization/family-wave-plan.md','docs/normalization/decision-queue.md',
 'contracts/project-normalization-charter.v1.json','contracts/product-value-evidence-binding.v1.schema.json',
 'catalog/normalization/family-registry.jsonl','catalog/normalization/component-applications.jsonl','catalog/normalization/findings-disposition.jsonl','catalog/normalization/product-value-readiness.jsonl','catalog/normalization/family-wave-plan.json','catalog/normalization/decision-queue.jsonl',
 'receipts/normalization/project-normalization-synthesis-v1.json'
];
for(const p of required)assert(fs.existsSync(path.join(root,p)),`missing required synthesis artifact: ${p}`);

// Immutable source identities.
assert(run(['rev-parse','HEAD:catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc'])==='e77fc2457fadfdffb46ed2d90304ebb91e89a715','immutable Decoder v1 tree changed');
assert(sha('catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/manifest.json')==='f7740f7f533c3f0cda5d4d0b8ebe98b565d7f521368b96462daecbd26522d5cc','immutable Decoder v1 manifest changed');
assert(sha('catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/manifest.json')==='c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1','final Behavioral v1.1 manifest changed');
for(const commit of ['228126dd78a67a6f335272324dc90c1e680cd8c4','f9cb3c931d6f2200f0a4221f5130b3a6299f7005'])run(['cat-file','-e',`${commit}^{commit}`]);
const changed=run(['diff','--name-only','228126dd78a67a6f335272324dc90c1e680cd8c4','--']).split('\n').filter(Boolean);
for(const p of changed)assert(!/^(penpot|prototypes)\//.test(p)&&!/(^|\/)site\/(src|public)\//.test(p),`forbidden design diff path: ${p}`);
if(eventsRepo){
 assert(run(['cat-file','-e','66bc0d43e36299417626f992021cfb7299ddf704^{commit}'],eventsRepo)==='', 'unreachable');
 assert(run(['rev-parse','66bc0d43e36299417626f992021cfb7299ddf704^{tree}'],eventsRepo)==='72e24f49ad6642915131438de8c56b804c4826b0','events commit tree mismatch');
 assert(run(['rev-parse','66bc0d43e36299417626f992021cfb7299ddf704:site/src'],eventsRepo)==='d737458f8a87a9b7dad4f4badffd1b3f4ce544dd','events site/src baseline mismatch');
 assert(run(['rev-parse','66bc0d43e36299417626f992021cfb7299ddf704:site/public'],eventsRepo)==='f42a045ec9ff3b1b2f3396a4df9f54cc6a767934','events site/public baseline mismatch');
}

// Charter and schema.
const charter=json('contracts/project-normalization-charter.v1.json');
assert(charter.schema_version==='project_normalization_charter_v1'&&charter.normative_status==='candidate-not-accepted','charter status mismatch');
assert(charter.research_conclusions.length===104,'charter conclusion census mismatch');
unique(charter.research_conclusions,'id','charter conclusions');
for(const report of ['R01','R02','R03','R04','R05','R06','R07'])assert(charter.research_conclusions.some((x)=>x.report_id===report),`charter missing ${report}`);
const dispositions=new Set(['adopted','rejected','pending_project_evidence','pending_product_decision','superseded_by_runtime_evidence']);
assert(charter.research_conclusions.every((x)=>dispositions.has(x.disposition)),'invalid charter disposition');
assert(JSON.stringify(charter.principles.allowed_candidate_decisions)===JSON.stringify(['merge','variant','composition','split','preserve','deprecate','archive_experiment']),'decision vocabulary mismatch');
assert(charter.product_value_gate.mode==='observe'&&Object.values(charter.product_value_gate.authoritative_id_allowlist).every((x)=>Array.isArray(x)&&x.length===0),'product authority allowlist is not empty observe mode');
assert(Object.values(charter.constraints).every((x)=>x===false)&&charter.candidate_decisions_are_accepted===false,'charter escaped STOP boundary');
const schema=json('contracts/product-value-evidence-binding.v1.schema.json');
for(const key of ['application_id','component_contract_id','component_contract_version','consumer','route','surface_archetype_id','value_evidence_mode','value_evidence_status','need_ids','job_ids','journey_ids','capability_ids','outcome_ids','metric_ids','guardrail_ids','value_claim','expected_mechanism','evidence_refs','decision_receipt'])assert(schema.required.includes(key),`product schema missing ${key}`);

// Decoder logical set and family registry.
const componentDir=path.join(root,'catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/components');
const componentFiles=fs.readdirSync(componentDir).filter((x)=>x.endsWith('.json')).sort();
const components=componentFiles.map((x)=>JSON.parse(fs.readFileSync(path.join(componentDir,x),'utf8')));
assert(components.length===107,'expected 107 logical components'); unique(components,'id','components'); unique(components,'logical_path','components');
const componentDigest=shaBuf(Buffer.from(components.map((x)=>({id:x.id,logical_path:x.logical_path})).sort((a,b)=>a.id.localeCompare(b.id)).map((x)=>JSON.stringify(x)+'\n').join('')));
assert(componentDigest==='49ac6474a336f3a9895f3ae5dc186784be50c0f24caa03fa4d2f0b98219f108b','logical component census digest mismatch');
const componentIds=new Set(components.map((x)=>x.id));
const families=jsonl('catalog/normalization/family-registry.jsonl'); unique(families,'id','families'); assert(families.length===47,'family count mismatch');
const familyIds=new Set(families.map((x)=>x.id)); const dispositionsByComponent=[];
for(const f of families){
 for(const key of ['implementations','consumers','routes','reachability','requirement_provenance','anatomy','states_events','accessibility','responsive_container_behavior','media','loading_recovery','experiments','findings','lifecycle','current_authority','candidate_decision','dependencies','migration_risk','rollback_feasibility'])assert(key in f,`${f.id}: missing ${key}`);
 assert(f.candidate_decision.accepted===false&&f.promotion_ready===false&&f.decision==='NOT_MERGED',`${f.id}: candidate promoted`);
 for(const i of f.implementations){assert(componentIds.has(i.component_id),`${f.id}: unknown component`); assert(i.primary_family_id===f.id,`${i.component_id}: primary family mismatch`); dispositionsByComponent.push(i.component_id);}
}
assert(dispositionsByComponent.length===107&&new Set(dispositionsByComponent).size===107,'107 components do not have exactly one primary family');
assert(JSON.stringify([...componentIds].sort())===JSON.stringify([...new Set(dispositionsByComponent)].sort()),'family/component set mismatch');

// Exact-once findings: 279 raw refs -> 222 canonical identities.
const findings=jsonl('catalog/normalization/findings-disposition.jsonl'); unique(findings,'id','findings'); unique(findings,'canonical_issue_key','findings');
assert(findings.length===222,'canonical finding count mismatch');
assert(findings.reduce((n,x)=>n+x.source_record_refs.length,0)===279,'raw finding reference coverage mismatch');
const rawCount=(name)=>findings.filter((x)=>x.raw_categories.includes(name)).length;
for(const [key,n] of Object.entries({MISMATCH:39,UNREACHABLE_WITH_REASON:18,unresolved:87,fragmentation_candidate:16,candidate_as_is_contract:12,logical_component:107}))assert(rawCount(key)===n,`raw finding category mismatch: ${key}`);
assert(findings.filter((x)=>x.source_kind==='behavioral_probe').length===57,'paired probe count mismatch');
assert(findings.filter((x)=>x.source_kind==='behavioral_probe').every((x)=>x.source_record_refs.length===2&&x.raw_categories.includes('unresolved')),'probe/unresolved aliases were double-counted or lost');
for(const x of findings){assert(enums.classification.has(x.classification),`${x.id}: invalid classification`);assert(enums.blocking.has(x.blocking_scope),`${x.id}: invalid blocking scope`);assert(enums.before.has(x.must_resolve_before),`${x.id}: invalid resolution stage`);assert(x.decision==='NOT_MERGED'&&x.candidate_decision_accepted===false,`${x.id}: finding promoted`);for(const f of x.family_ids)assert(familyIds.has(f),`${x.id}: unknown family ${f}`);}

// Product application gate.
const apps=jsonl('catalog/normalization/component-applications.jsonl'); const readiness=jsonl('catalog/normalization/product-value-readiness.jsonl');
unique(apps,'id','applications'); unique(apps,'application_id','applications'); unique(readiness,'id','readiness');
assert(apps.length===242&&readiness.length===242,'application/readiness census mismatch');
const readyByApp=new Map(readiness.map((x)=>[x.application_id,x]));
const fk=['need_ids','job_ids','journey_ids','capability_ids','outcome_ids','metric_ids','guardrail_ids'];
for(const a of apps){
 assert(componentIds.has(a.component_id)&&familyIds.has(a.family_id),`${a.id}: unresolved component/family`);
 assert(a.value_evidence_status==='pending_product_model'&&a.product_value_gate_mode==='observe',`${a.id}: invented product evidence`);
 assert(fk.every((k)=>Array.isArray(a[k])&&a[k].length===0),`${a.id}: unauthorized product ID`);
 assert(a.value_claim===null&&a.expected_mechanism===null&&a.decision_receipt===null,`${a.id}: invented value claim/receipt`);
 assert(a.promotion_ready===false&&a.as_is_preservation_allowed===true,`${a.id}: pending product evidence changed lifecycle`);
 const r=readyByApp.get(a.id); assert(r&&r.value_evidence_status==='pending_product_model'&&r.promotion_ready===false&&r.as_is_preservation_allowed===true,`${a.id}: readiness mismatch`);
}
assert(new Set(readiness.map((x)=>x.application_id)).size===apps.length,'readiness/application join mismatch');

// Reproduce prioritization and first-wave rules.
const wave=json('catalog/normalization/family-wave-plan.json');
assert(wave.product_value_gate_mode==='observe'&&wave.promotion_ready_family_ids.length===0,'wave escaped product gate');
const weights=wave.algorithm.weights;
for(const f of wave.families){
 assert(familyIds.has(f.family_id),'wave references unknown family');
 const score=Math.round(Object.entries(weights).reduce((n,[k,w])=>n+f.factors[k]*w,0)/5);
 assert(score===f.score,`${f.family_id}: score is not reproducible`);
 assert(f.promotion_ready===false&&f.product_value_status==='pending_product_model'&&f.decision==='NOT_MERGED',`${f.family_id}: wave promoted family`);
}
assert(wave.first_wave_family_ids.length>=2&&wave.first_wave_family_ids.length<=4,'first wave must contain 2–4 families');
assert(JSON.stringify(wave.first_wave_family_ids)===JSON.stringify(['family.event-detail-presentation','family.event-media','family.event-token-medallions']),'unexpected first wave');
for(const fid of wave.first_wave_family_ids){
 const plan=wave.families.find((x)=>x.family_id===fid); assert(plan?.category==='ready_for_contract_decision'&&plan.selected_first_wave===true,`${fid}: blocked family entered first wave`);
 for(const ext of ['json','md'])assert(fs.existsSync(path.join(root,`catalog/normalization/families/${fid}/dossier.${ext}`)),`${fid}: dossier missing`);
 const dossier=json(`catalog/normalization/families/${fid}/dossier.json`); assert(dossier.decision_status==='candidate_not_accepted'&&dossier.promotion_ready===false&&dossier.runtime_mutation===false&&dossier.decision==='NOT_MERGED',`${fid}: dossier escaped boundary`);
}
assert(!wave.first_wave_family_ids.some((x)=>x.includes('transport')||x.includes('event-actions')||x.includes('rail')),'experiment/rail entered first wave');
const rail=families.find((x)=>x.id==='family.listing-rails'); assert(rail?.promotion_ready===false&&rail?.readiness_category==='implementation_gap_blocked','rail classification mismatch');

// Compact decision queue only for evidence-underdetermined questions.
const queue=jsonl('catalog/normalization/decision-queue.jsonl'); unique(queue,'decision_id','decision queue');
const allowedQueue=new Set(['decision.event-token-medallions.consumer-geometry','decision.transport-timetable.winner','decision.event-actions.experimental-treatment','decision.listing-rail.negative-feedback-keyboard-surface']);
assert(queue.length===4&&queue.every((x)=>allowedQueue.has(x.decision_id)),'decision queue is not compact/allowlisted');
for(const x of queue){assert(familyIds.has(x.family_id),`${x.id}: unknown family`);assert(x.options.length>=2&&x.options.length<=4,`${x.id}: option count`);assert(x.options.some((o)=>o.option_id===x.recommendation.option_id),`${x.id}: recommendation missing`);assert(x.owner_required===true&&x.owner_required_reason&&x.status==='pending'&&x.decision_receipt===null&&x.decision==='NOT_MERGED',`${x.id}: owner/receipt boundary mismatch`);}
const experiments=jsonl('catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/experiment-registry.jsonl');
assert(experiments.every((x)=>x.decision==='NOT_MERGED'&&x.winner_decision_receipt==='absent'),'experiment winner selected');

// Receipt binds outputs and final status/audit.
const receipt=json('receipts/normalization/project-normalization-synthesis-v1.json');
assert(receipt.schema_version==='project_normalization_synthesis_receipt_v1','receipt schema mismatch');
assert(JSON.stringify(receipt.final_statuses)===JSON.stringify(['PROJECT_NORMALIZATION_SYNTHESIS_COMPLETE','READY_FOR_FAMILY_DECISION_REVIEW','PRODUCT_VALUE_GATE_SCAFFOLDED_PENDING_PRODUCT_MODEL']),'final statuses mismatch');
assert(receipt.counts.logical_component_paths===107&&receipt.counts.canonical_dispositions===222&&receipt.counts.raw_evidence_refs===279&&receipt.counts.families===47&&receipt.counts.applications===242&&receipt.counts.first_wave_families===3,'receipt counts mismatch');
assert(receipt.product_value_gate.mode==='observe'&&receipt.product_value_gate.authoritative_product_ids===0,'receipt product gate mismatch');
assert(Object.values(receipt.constraints).every((x)=>x===false),'receipt escaped STOP boundary');
for(const [p,meta] of Object.entries(receipt.outputs)){assert(fs.existsSync(path.join(root,p)),`receipt output missing: ${p}`);assert(read(p).byteLength===meta.bytes,`receipt bytes mismatch: ${p}`);assert(sha(p)===meta.sha256,`receipt sha mismatch: ${p}`);if(p.endsWith('.jsonl'))assert(jsonl(p).length===meta.records,`receipt records mismatch: ${p}`);}
if(!allowPending)assert(receipt.independent_audit?.status==='PASS'&&receipt.independent_audit?.reviewer&&/^[a-f0-9]{64}$/.test(receipt.independent_audit?.report_sha256||''),'independent audit is not bound');
else assert(['pending','PASS'].includes(receipt.independent_audit?.status),'invalid provisional audit status');
for(const forbidden of ['READY_FOR_PHYSICAL_DEFRAGMENTATION','NORMALIZATION_APPROVED','PRODUCT_VALUE_VALIDATED','TOKENS_ACCEPTED','DESIGN_SYSTEM_COMPLETE']){
 for(const p of Object.keys(receipt.outputs).filter((x)=>x.startsWith('docs/normalization/')||x.startsWith('catalog/normalization/')||x.startsWith('contracts/project-normalization')||x.startsWith('receipts/normalization/')))assert(!read(p).toString('utf8').includes(forbidden),`forbidden completion claim in ${p}`);
}

process.stdout.write(JSON.stringify({status:'valid',audit:receipt.independent_audit?.status,components:107,families:47,applications:242,canonical_dispositions:222,raw_refs:279,first_wave:3,queue:4})+'\n');
