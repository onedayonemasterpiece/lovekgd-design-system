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
const gitBuffer=(args,cwd=root)=>childProcess.execFileSync('git',args,{cwd});
const unique=(rows,key,label)=>assert(new Set(rows.map((x)=>x[key])).size===rows.length,`${label}: duplicate ${key}`);
const canonical=(value)=>JSON.stringify(value,(_key,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.entries(item).sort(([a],[b])=>a.localeCompare(b))):item);
const enums={classification:new Set(['accidental_divergence','intentional_product_difference','requirement_implementation_gap','accessibility_gap','consumer_override','historical_difference','unresolved_experiment','decoder_or_probe_issue','normalization_candidate','product_model_dependent']),blocking:new Set(['none','family_decision','implementation','migration','promotion','release','experiment_decision']),before:new Set(['target_contract','first_implementation','consumer_migration','legacy_removal','promotion'])};

const required=[
 'docs/normalization/project-normalization-synthesis-v1.md','docs/normalization/family-wave-plan.md','docs/normalization/decision-queue.md',
 'contracts/project-normalization-charter.v1.json','contracts/product-value-evidence-binding.v1.schema.json',
 'catalog/normalization/evidence/fragmentation-report.jsonl',
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
const researchSources={
 R01:['docs/research/ui-normalization-2026-08/01-normalization-charter-product-design-system.md','78a6775faec9d0121fff12a4154ceb15e4fff82020b236927e12c93ced15c778'],
 R02:['docs/research/ui-normalization-2026-08/02-external-best-practices-collection.md','c785e3b4049f555d7efaf128a2a4af329365aa8dab92acf2f52608adb09f97bc'],
 R03:['docs/research/ui-normalization-2026-08/03-ui-component-defragmentation-best-practices.md','abc34bed7c39ba02d2c50da088f32665f461075ff943d76d8de32830ecb9d03a'],
 R04:['docs/research/ui-normalization-2026-08/04-external-evidence-corpus.md','fb46e64ba973a73ff1d401a2bc515adc759f949ddbb2034f4a667c942edacdef'],
 R05:['docs/research/ui-normalization-2026-08/05-normalization-charter-lovekgd.md','8fbfa571eb2d27cc88cec591f9ffbf7b5ec176b3bb568ab17b15622ba0229c9e'],
 R06:['docs/research/ui-normalization-2026-08/06-deep-ui-component-defragmentation-research.md','13b68ce82d2d4ab14561dbfefb5050539be95d2cedcfe3b774935a428ed755d0'],
 R07:['docs/research/ui-normalization-2026-08/07-cross-research-synthesis-and-adoption.md','cc1997ec4ab024a6fcba3e9b6d5c7632e0a367ed15b80ea2347e4f5bac01d944']
};
for(const [report,[sourcePath,sourceHash]] of Object.entries(researchSources)){
 const rows=charter.research_conclusions.filter((x)=>x.report_id===report); assert(rows.length>0,`charter missing ${report}`);
 assert(rows.every((x)=>x.source_path===sourcePath&&x.source_sha256===sourceHash),`${report}: conclusion source binding mismatch`);
 const actual=report==='R07'?shaBuf(gitBuffer(['show',`228126dd78a67a6f335272324dc90c1e680cd8c4:${sourcePath}`])):sha(sourcePath);
 assert(actual===sourceHash,`${report}: research source hash mismatch`);
}
const conclusionCensus=shaBuf(Buffer.from(charter.research_conclusions.slice().sort((a,b)=>a.id.localeCompare(b.id)).map((x)=>JSON.stringify({id:x.id,report_id:x.report_id,conclusion_key:x.conclusion_key,disposition:x.disposition})+'\n').join('')));
assert(conclusionCensus==='683e356a3ca8aa666db480583ba9c969c5eb2081ce4fc42935f69d53c877f8e1','charter conclusion census digest mismatch');
const dispositions=new Set(['adopted','rejected','pending_project_evidence','pending_product_decision','superseded_by_runtime_evidence']);
assert(charter.research_conclusions.every((x)=>dispositions.has(x.disposition)),'invalid charter disposition');
assert(JSON.stringify(charter.principles.allowed_candidate_decisions)===JSON.stringify(['merge','variant','composition','split','preserve','deprecate','archive_experiment']),'decision vocabulary mismatch');
assert(charter.product_value_gate.mode==='observe'&&Object.values(charter.product_value_gate.authoritative_id_allowlist).every((x)=>Array.isArray(x)&&x.length===0),'product authority allowlist is not empty observe mode');
assert(Object.values(charter.constraints).every((x)=>x===false)&&charter.candidate_decisions_are_accepted===false,'charter escaped STOP boundary');
const schema=json('contracts/product-value-evidence-binding.v1.schema.json');
for(const key of ['id','application_id','component_id','component_contract_id','component_contract_version','consumer','route','surface_context_id','surface_context_authority','surface_archetype_id','value_evidence_mode','value_evidence_status','need_ids','job_ids','journey_ids','capability_ids','outcome_ids','metric_ids','guardrail_ids','value_claim','expected_mechanism','evidence_refs','decision_receipt','experimental_evidence_satisfied','experimental_evidence_gaps'])assert(schema.required.includes(key),`product schema missing ${key}`);

// Decoder logical set and family registry.
const componentDir=path.join(root,'catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/components');
const componentFiles=fs.readdirSync(componentDir).filter((x)=>x.endsWith('.json')).sort();
const components=componentFiles.map((x)=>JSON.parse(fs.readFileSync(path.join(componentDir,x),'utf8')));
assert(components.length===107,'expected 107 logical components'); unique(components,'id','components'); unique(components,'logical_path','components');
const componentDigest=shaBuf(Buffer.from(components.map((x)=>({id:x.id,logical_path:x.logical_path})).sort((a,b)=>a.id.localeCompare(b.id)).map((x)=>JSON.stringify(x)+'\n').join('')));
assert(componentDigest==='49ac6474a336f3a9895f3ae5dc186784be50c0f24caa03fa4d2f0b98219f108b','logical component census digest mismatch');
const componentIds=new Set(components.map((x)=>x.id));
const sourceFileRows=jsonl('catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/source-files.jsonl'); const sourceFilesById=new Map(sourceFileRows.map((x)=>[x.id,x]));
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
const finalBehaviorRoot='catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc';
const probeIds=new Set(jsonl(`${finalBehaviorRoot}/breakpoint-probe-observations.jsonl`).map((x)=>x.id));
const unresolvedIds=new Set(jsonl(`${finalBehaviorRoot}/unresolved.jsonl`).map((x)=>x.id));
const contractIds=new Set(fs.readdirSync(path.join(root,'catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/candidate-contracts')).filter((x)=>x.endsWith('.json')).map((x)=>json(`catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/candidate-contracts/${x}`).id));
const fragmentationRows=jsonl('catalog/normalization/evidence/fragmentation-report.jsonl');
assert(sha('catalog/normalization/evidence/fragmentation-report.jsonl')==='967f1b2a5a58fe16d03b03ef47955d1ff61ca044fa9f9a6e1cf6b50ba4021cbb'&&fragmentationRows.length===20,'fragmentation evidence identity mismatch');
const fragmentedIds=new Set(fragmentationRows.filter((x)=>x.status==='fragmented').map((x)=>x.id)); assert(fragmentedIds.size===16,'fragmentation evidence set mismatch');
const expectedFamilyFindings=new Map([...familyIds].map((x)=>[x,[]]));
for(const x of findings){
 assert(enums.classification.has(x.classification),`${x.id}: invalid classification`);assert(enums.blocking.has(x.blocking_scope),`${x.id}: invalid blocking scope`);assert(enums.before.has(x.must_resolve_before),`${x.id}: invalid resolution stage`);assert(x.decision==='NOT_MERGED'&&x.candidate_decision_accepted===false,`${x.id}: finding promoted`);
 assert(Array.isArray(x.family_ids)&&x.family_ids.length>0,`${x.id}: finding is not assigned to a family`);
 for(const f of x.family_ids){assert(familyIds.has(f),`${x.id}: unknown family ${f}`);expectedFamilyFindings.get(f).push(x.id);}
 for(const ref of x.source_record_refs){
  const [file,id]=ref.split('#');
  if(file==='breakpoint-probe-observations.jsonl')assert(probeIds.has(id),`${x.id}: unknown probe ref`);
  else if(file==='unresolved.jsonl')assert(unresolvedIds.has(id),`${x.id}: unknown unresolved ref`);
  else if(file.startsWith('candidate-contracts/'))assert(contractIds.has(id),`${x.id}: unknown contract ref`);
  else if(file.startsWith('components/'))assert(componentIds.has(id),`${x.id}: unknown component ref`);
  else if(file==='catalog/normalization/evidence/fragmentation-report.jsonl')assert(fragmentedIds.has(id),`${x.id}: unknown fragmentation ref`);
  else fail(`${x.id}: unresolvable source ref ${ref}`);
 }
}
for(const f of families)assert(JSON.stringify(f.findings.slice().sort())===JSON.stringify(expectedFamilyFindings.get(f.id).sort()),`${f.id}: registry finding join mismatch`);

// Product application gate.
const apps=jsonl('catalog/normalization/component-applications.jsonl'); const readiness=jsonl('catalog/normalization/product-value-readiness.jsonl');
unique(apps,'id','applications'); unique(apps,'application_id','applications'); unique(readiness,'id','readiness');
assert(apps.length===239&&readiness.length===239,'application/readiness census mismatch');
const readyByApp=new Map(readiness.map((x)=>[x.application_id,x])); const applicationIds=new Set(apps.map((x)=>x.application_id));
const fk=['need_ids','job_ids','journey_ids','capability_ids','outcome_ids','metric_ids','guardrail_ids'];
const schemaProperties=new Set(Object.keys(schema.properties));
for(const a of apps){
 assert(Object.keys(a).every((x)=>schemaProperties.has(x)),`${a.id}: property is not declared by product schema`);
 assert(schema.required.every((x)=>Object.hasOwn(a,x)),`${a.id}: missing required schema property`);
 assert(a.id===a.application_id,`${a.id}: application identity mismatch`);
 assert((componentIds.has(a.component_contract_id)&&a.component_contract_version==='0.0.0-as-is-source')||(contractIds.has(a.component_contract_id)&&a.component_contract_version==='0.1.0-candidate'),`${a.id}: unresolved component contract/version`);
 assert(a.evidence_refs.length===2,`${a.id}: application evidence cardinality mismatch`);
 const componentRef=`components/${a.component_id}.json#${a.component_id}`; assert(a.evidence_refs.includes(componentRef),`${a.id}: component evidence ref missing`);
 const sourceRef=a.evidence_refs.find((x)=>x.startsWith('source-files.jsonl#')); const sourceId=sourceRef?.split('#')[1]; assert(sourceId&&sourceFilesById.has(sourceId)&&sourceFilesById.get(sourceId).path===a.consumer,`${a.id}: consumer source evidence ref unresolved`);
 assert(componentIds.has(a.component_id)&&familyIds.has(a.family_id),`${a.id}: unresolved component/family`);
 assert(a.value_evidence_status==='pending_product_model'&&a.product_value_gate_mode==='observe',`${a.id}: invented product evidence`);
 assert(fk.every((k)=>Array.isArray(a[k])&&a[k].length===0),`${a.id}: unauthorized product ID`);
 assert(a.value_claim===null&&a.expected_mechanism===null&&a.decision_receipt===null,`${a.id}: invented value claim/receipt`);
 assert(typeof a.surface_context_id==='string'&&a.surface_context_id.length>0&&a.surface_context_authority==='pinned-runtime-page-family-or-source-consumer-context',`${a.id}: runtime surface context missing`);
 assert(a.surface_archetype_id===null,`${a.id}: product archetype was invented`);
 if(a.value_evidence_mode==='experimental')assert(a.experimental_evidence_satisfied===false&&JSON.stringify(a.experimental_evidence_gaps)===JSON.stringify(['hypothesis','authoritative_metric','decision_receipt']),`${a.id}: pending experiment gaps are not explicit`);
 else assert(a.experimental_evidence_satisfied===null&&a.experimental_evidence_gaps.length===0,`${a.id}: non-experiment has experimental evidence`);
 assert(a.promotion_ready===false&&a.as_is_preservation_allowed===true,`${a.id}: pending product evidence changed lifecycle`);
 const r=readyByApp.get(a.id); assert(r&&r.value_evidence_status==='pending_product_model'&&r.promotion_ready===false&&r.as_is_preservation_allowed===true,`${a.id}: readiness mismatch`);
}
assert(new Set(readiness.map((x)=>x.application_id)).size===apps.length,'readiness/application join mismatch');
const componentsWithoutApplications=[...componentIds].filter((x)=>!new Set(apps.map((a)=>a.component_id)).has(x)).sort();
assert(canonical(componentsWithoutApplications)===canonical(['component.02effc1d8ab8434b','component.29e9aebbf63be827','component.d65fb5ef1db02f46'].sort()),'source-only/no-consumer component census mismatch');

// Reproduce prioritization and first-wave rules.
const wave=json('catalog/normalization/family-wave-plan.json');
assert(wave.product_value_gate_mode==='observe'&&wave.promotion_ready_family_ids.length===0,'wave escaped product gate');
const weights=wave.algorithm.weights;
const bucket=(n)=>n===0?0:n===1?1:n<=3?2:n<=7?3:n<=15?4:5;
const categoryFromGates=(g)=>g.experiment_decision_refs.length?'experiment_dependent':g.implementation_gap_refs.length?'implementation_gap_blocked':g.product_model_dependency_refs.length?'product_model_dependent':g.insufficient_evidence_refs.length?'insufficient_evidence':'ready_for_contract_decision';
const clarity={ready_for_contract_decision:5,product_model_dependent:4,implementation_gap_blocked:3,insufficient_evidence:2,experiment_dependent:1};
const riskFactor={low:5,medium:3,high:1};
for(const f of wave.families){
 assert(familyIds.has(f.family_id),'wave references unknown family');
 const family=families.find((x)=>x.id===f.family_id); const gates=f.category_gate_inputs;
 assert(canonical(gates)===canonical(family.readiness_evidence.hard_gate_inputs),`${f.family_id}: gate evidence drift`);
 assert(categoryFromGates(gates)===f.category&&family.readiness_category===f.category,`${f.family_id}: category is not derived from gate predicates`);
 const contractCount=family.findings.filter((id)=>findings.find((x)=>x.id===id)?.source_kind==='candidate_as_is_contract').length;
 const raw={component_count:family.implementations.length,consumer_count:family.consumers.length,route_count:family.routes.length,dependency_count:family.dependencies.length,finding_count:family.findings.length,contract_count:contractCount,behavior_contract_count:family.states_events.behavior_contract_refs.length,terminal_probe_count:Object.values(family.responsive_container_behavior.terminal_probe_counts).reduce((a,b)=>a+b,0),production_observed_count:family.implementations.filter((x)=>x.reachability==='production-observed').length,hard_gate_reference_count:Object.values(gates).reduce((n,x)=>n+x.length,0),migration_risk:family.migration_risk};
 raw.evidence_dimensions={component_census:raw.component_count>0,consumer_or_route_census:raw.consumer_count>0||raw.route_count>0,candidate_as_is_contract:raw.contract_count>0,behavior_contract:raw.behavior_contract_count>0,runtime_or_terminal_probe:raw.production_observed_count>0||raw.terminal_probe_count>0};
 assert(canonical(raw)===canonical(f.raw_inputs),`${f.family_id}: raw priority inputs are not reproducible`);
 const derivedFactors={evidence_completeness:Object.values(raw.evidence_dimensions).filter(Boolean).length,semantic_clarity:clarity[f.category],dependency_leverage:bucket(raw.dependency_count),consumer_reach:bucket(raw.consumer_count),finding_urgency:Math.min(5,raw.finding_count),reversibility:riskFactor[raw.migration_risk],blast_radius_safety:Math.max(0,5-bucket(raw.consumer_count)),experiment_readiness:f.category==='experiment_dependent'?0:5,product_model_independence:f.category==='product_model_dependent'?0:5,product_value_readiness:0};
 assert(canonical(derivedFactors)===canonical(f.factors),`${f.family_id}: priority factors are not derived from raw inputs`);
 const score=Math.round(Object.entries(weights).reduce((n,[k,w])=>n+f.factors[k]*w,0)/5);
 assert(score===f.score,`${f.family_id}: score is not reproducible`);
 assert(f.promotion_ready===false&&f.product_value_status==='pending_product_model'&&f.decision==='NOT_MERGED',`${f.family_id}: wave promoted family`);
}
assert(wave.first_wave_family_ids.length>=2&&wave.first_wave_family_ids.length<=4,'first wave must contain 2–4 families');
const sortedPlans=wave.families.slice().sort((a,b)=>b.score-a.score||b.factors.evidence_completeness-a.factors.evidence_completeness||b.factors.blast_radius_safety-a.factors.blast_radius_safety||a.family_id.localeCompare(b.family_id));
const derivedFirstWave=sortedPlans.filter((x)=>x.category==='ready_for_contract_decision'&&x.factors.evidence_completeness>=4).slice(0,4).map((x)=>x.family_id);
assert(JSON.stringify(wave.first_wave_family_ids)===JSON.stringify(derivedFirstWave)&&JSON.stringify(derivedFirstWave)===JSON.stringify(['family.event-media','family.event-token-medallions']),'first wave is not reproducible');
const allowedCandidateDecisions=new Set(charter.principles.allowed_candidate_decisions);
const dossierIds=new Set();
for(const fid of wave.first_wave_family_ids){
 const plan=wave.families.find((x)=>x.family_id===fid); assert(plan?.category==='ready_for_contract_decision'&&plan.selected_first_wave===true,`${fid}: blocked family entered first wave`);
 for(const ext of ['json','md'])assert(fs.existsSync(path.join(root,`catalog/normalization/families/${fid}/dossier.${ext}`)),`${fid}: dossier missing`);
 const dossier=json(`catalog/normalization/families/${fid}/dossier.json`); dossierIds.add(dossier.id);
 assert(dossier.family_id===fid&&dossier.decision_status==='candidate_not_accepted'&&dossier.promotion_ready===false&&dossier.runtime_mutation===false&&dossier.decision==='NOT_MERGED',`${fid}: dossier escaped boundary`);
 assert(allowedCandidateDecisions.has(dossier.candidate_decision)&&dossier.decision_accepted===false,`${fid}: invalid/accepted dossier decision`);
 assert(canonical(dossier.implementation_refs.slice().sort())===canonical(families.find((x)=>x.id===fid).implementations.map((x)=>x.component_id).sort()),`${fid}: dossier implementation set mismatch`);
 assert(canonical(dossier.consumers.slice().sort())===canonical(families.find((x)=>x.id===fid).consumers.slice().sort())&&canonical(dossier.routes.slice().sort())===canonical(families.find((x)=>x.id===fid).routes.slice().sort()),`${fid}: dossier consumer/route set mismatch`);
 assert(dossier.application_ids.every((x)=>applicationIds.has(x))&&canonical(dossier.application_ids.slice().sort())===canonical(families.find((x)=>x.id===fid).application_ids.slice().sort()),`${fid}: dossier application set mismatch`);
 assert(dossier.finding_refs.every((x)=>findings.some((f)=>f.id===x))&&canonical(dossier.finding_refs.slice().sort())===canonical(families.find((x)=>x.id===fid).findings.slice().sort()),`${fid}: dossier finding set mismatch`);
 assert(contractIds.has(dossier.current_contract_ref)&&dossier.requirement_refs.every((x)=>['immutable-decoder-v1','behavioral-supplement-v1.1-final-c676be4f'].includes(x)),`${fid}: dossier authority ref unresolved`);
 assert(dossier.alternatives.length===5&&canonical(dossier.alternatives.map((x)=>x.decision).sort())===canonical(['merge','variant','composition','split','preserve'].sort()),`${fid}: dossier alternatives incomplete`);
 assert(dossier.candidate_canonical_contract&&Object.keys(dossier.candidate_canonical_contract).length>0&&dossier.test_matrix.length>0&&dossier.removal_gate.length>0&&dossier.promotion_gate.length>0,`${fid}: dossier is incomplete`);
}
assert(!wave.first_wave_family_ids.some((x)=>x.includes('transport')||x.includes('event-actions')||x.includes('rail')),'experiment/rail entered first wave');
const rail=families.find((x)=>x.id==='family.listing-rails'); assert(rail?.promotion_ready===false&&rail?.readiness_category==='implementation_gap_blocked','rail classification mismatch');

// Compact decision queue only for evidence-underdetermined questions.
const queue=jsonl('catalog/normalization/decision-queue.jsonl'); unique(queue,'decision_id','decision queue');
const allowedQueue=new Set(['decision.event-token-medallions.consumer-geometry','decision.transport-timetable.winner','decision.event-actions.experimental-treatment','decision.listing-rail.negative-feedback-keyboard-surface']);
const experiments=jsonl('catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/experiment-registry.jsonl');
const experimentIds=new Set(experiments.map((x)=>x.id));
assert(queue.length===4&&queue.every((x)=>allowedQueue.has(x.decision_id)),'decision queue is not compact/allowlisted');
for(const x of queue){
 assert(familyIds.has(x.family_id),`${x.id}: unknown family`);assert(x.options.length>=2&&x.options.length<=4,`${x.id}: option count`);assert(x.options.some((o)=>o.option_id===x.recommendation.option_id),`${x.id}: recommendation missing`);assert(x.owner_required===true&&x.owner_required_reason&&x.status==='pending'&&x.decision_receipt===null&&x.decision==='NOT_MERGED',`${x.id}: owner/receipt boundary mismatch`);
 for(const ref of x.evidence_refs){
  if(ref.startsWith('candidate.'))assert(contractIds.has(ref),`${x.id}: unresolved contract evidence ${ref}`);
  else if(ref.startsWith('unresolved.'))assert(unresolvedIds.has(ref),`${x.id}: unresolved finding evidence ${ref}`);
  else if(ref.startsWith('experiment.'))assert(experimentIds.has(ref),`${x.id}: unresolved experiment evidence ${ref}`);
  else if(ref.startsWith('dossier.'))assert(dossierIds.has(ref),`${x.id}: unresolved dossier evidence ${ref}`);
  else if(ref==='rail-keyboard-packet.json')assert(fs.existsSync(path.join(root,finalBehaviorRoot,ref)),`${x.id}: rail packet evidence missing`);
  else fail(`${x.id}: unresolvable decision evidence ${ref}`);
 }
}
assert(experiments.every((x)=>x.decision==='NOT_MERGED'&&x.winner_decision_receipt==='absent'),'experiment winner selected');

// Receipt binds outputs and final status/audit.
const receipt=json('receipts/normalization/project-normalization-synthesis-v1.json');
assert(receipt.schema_version==='project_normalization_synthesis_receipt_v1','receipt schema mismatch');
assert(JSON.stringify(receipt.final_statuses)===JSON.stringify(['PROJECT_NORMALIZATION_SYNTHESIS_COMPLETE','READY_FOR_FAMILY_DECISION_REVIEW','PRODUCT_VALUE_GATE_SCAFFOLDED_PENDING_PRODUCT_MODEL']),'final statuses mismatch');
assert(receipt.counts.logical_component_paths===107&&receipt.counts.canonical_dispositions===222&&receipt.counts.raw_evidence_refs===279&&receipt.counts.families===47&&receipt.counts.applications===239&&receipt.counts.first_wave_families===2,'receipt counts mismatch');
assert(receipt.product_value_gate.mode==='observe'&&receipt.product_value_gate.authoritative_product_ids===0&&receipt.counts.components_without_concrete_application===3&&canonical(receipt.product_value_gate.components_without_concrete_application)===canonical(componentsWithoutApplications),'receipt product gate mismatch');
assert(Object.values(receipt.constraints).every((x)=>x===false),'receipt escaped STOP boundary');
for(const [p,meta] of Object.entries(receipt.outputs)){assert(fs.existsSync(path.join(root,p)),`receipt output missing: ${p}`);assert(read(p).byteLength===meta.bytes,`receipt bytes mismatch: ${p}`);assert(sha(p)===meta.sha256,`receipt sha mismatch: ${p}`);if(p.endsWith('.jsonl'))assert(jsonl(p).length===meta.records,`receipt records mismatch: ${p}`);}
if(!allowPending){
 assert(receipt.independent_audit?.status==='PASS'&&receipt.independent_audit?.reviewer&&/^[a-f0-9]{64}$/.test(receipt.independent_audit?.report_sha256||''),'independent audit is not bound');
 assert(receipt.independent_audit.report_path&&fs.existsSync(path.join(root,receipt.independent_audit.report_path)),'independent audit report is missing');
 assert(sha(receipt.independent_audit.report_path)===receipt.independent_audit.report_sha256,'independent audit report hash mismatch');
}
else assert(['pending','PASS'].includes(receipt.independent_audit?.status),'invalid provisional audit status');
for(const forbidden of ['READY_FOR_PHYSICAL_DEFRAGMENTATION','NORMALIZATION_APPROVED','PRODUCT_VALUE_VALIDATED','TOKENS_ACCEPTED','DESIGN_SYSTEM_COMPLETE']){
 for(const p of Object.keys(receipt.outputs).filter((x)=>x.startsWith('docs/normalization/')||x.startsWith('catalog/normalization/')||x.startsWith('contracts/project-normalization')||x.startsWith('receipts/normalization/')))assert(!read(p).toString('utf8').includes(forbidden),`forbidden completion claim in ${p}`);
}

process.stdout.write(JSON.stringify({status:'valid',audit:receipt.independent_audit?.status,components:107,families:47,applications:239,canonical_dispositions:222,raw_refs:279,first_wave:2,queue:4})+'\n');
