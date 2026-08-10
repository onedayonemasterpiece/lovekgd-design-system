#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const argv=process.argv.slice(2);
const valueAfter=(flag)=>{const i=argv.indexOf(flag); return i>=0?argv[i+1]:null};
const root=path.resolve(valueAfter('--root')||'.');
const dossierArg=valueAfter('--dossier')||'catalog/normalization/families/event-media/dossier.json';
const markdownArg=valueAfter('--markdown')||'catalog/normalization/families/event-media/dossier.md';
const resolveInput=(p)=>path.isAbsolute(p)?p:path.join(root,p);
const dossierPath=resolveInput(dossierArg);
const markdownPath=resolveInput(markdownArg);
const fail=(message)=>{throw new Error(message)};
const assert=(value,message)=>{if(!value)fail(message)};
const read=(p)=>fs.readFileSync(resolveInput(p));
const shaBuffer=(value)=>crypto.createHash('sha256').update(value).digest('hex');
const sha=(p)=>shaBuffer(read(p));
const json=JSON.parse(fs.readFileSync(dossierPath,'utf8'));
const md=fs.readFileSync(markdownPath,'utf8');
const exactKeys=(object,expected,label)=>assert(JSON.stringify(Object.keys(object).sort())===JSON.stringify(expected.slice().sort()),`${label}: keys differ`);
const unique=(values,label)=>assert(new Set(values).size===values.length,`${label}: duplicate values`);

// Immutable inputs and historical-v1 preservation.
assert(sha('catalog/normalization/families/family.event-media/dossier.json')==='72c8ed2ec07835181b1f4e25a13ff54ca50ac7177004ea9a4a3816df1fd7e44d','historical v1 Event Media JSON changed');
assert(sha('catalog/normalization/families/family.event-media/dossier.md')==='9588bad71030276ae0718a4f0dd7bd96a3ded9c4eb81e7688a58c3a33d46efbb','historical v1 Event Media Markdown changed');
assert(sha('catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/candidate-contracts/candidate.event-media.contract.json')==='a48be25686f4f3434d4d06e3fa7cd7fea8333fdc5f0220743a16d7d425d15c04','immutable candidate.event-media changed');
assert(sha('catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/manifest.json')==='c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1','Behavioral v1.1 manifest changed');
assert(sha('docs/audits/project-normalization-synthesis-v1-independent-red-team-audit.md')==='a466ae5ff4846a1895eb11429c2fe4f175115a119dc9904d5a4a4e50a9507f76','independent audit changed');

// STOP boundary and identity.
assert(json.schema_version==='project_normalization_event_media_dossier_v1_1','schema version mismatch');
assert(json.id==='dossier.event-media.v1-1'&&json.family_id==='family.event-media','dossier identity mismatch');
assert(json.decision==='NOT_MERGED'&&json.decision_accepted===false,'dossier accepted a decision');
assert(json.normalization_allowed===false&&json.runtime_mutation===false&&json.promotion_ready===false,'dossier escaped analysis-only boundary');
assert(json.target_ratio_selection===null,'target ratio was selected');
assert(Array.isArray(json.token_changes)&&json.token_changes.length===0,'token change was introduced');
assert(json.merge_split_decision===null,'merge/split decision was introduced');
assert(json.accepted_contract_decision===null,'contract decision was accepted');
assert(json.authorities.candidate_contract_sha256==='a48be25686f4f3434d4d06e3fa7cd7fea8333fdc5f0220743a16d7d425d15c04','candidate authority hash mismatch');
assert(json.authorities.historical_v1_dossier_sha256==='72c8ed2ec07835181b1f4e25a13ff54ca50ac7177004ea9a4a3816df1fd7e44d','historical dossier authority mismatch');
assert(json.authorities.behavioral_manifest_sha256==='c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1','behavior manifest authority mismatch');
assert(json.authorities.events_source_sha==='ef7aa62e45c60f7a12da6160f490719c0721ec03'&&json.authorities.events_closure_sha==='66bc0d43e36299417626f992021cfb7299ddf704','events authority mismatch');
assert(json.authorities.relevant_source_files_byte_identical_at_closure===true,'source/closure identity is not asserted');

const statusSet=new Set(['PROVEN_AS_IS_NOT_ACCEPTED','PARTIAL_EVIDENCE','CONFLICT','UNBOUND','NOT_APPLICABLE_WITH_REASON','EVIDENCE_ONLY_OUT_OF_SCOPE']);
exactKeys(json.status_vocabulary,[...statusSet],'status vocabulary');
const evidenceIds=json.evidence_catalog.map((x)=>x.id); unique(evidenceIds,'evidence catalog');
const evidenceSet=new Set(evidenceIds);
assert(evidenceIds.length>=25,'evidence catalog is unexpectedly incomplete');
for(const evidence of json.evidence_catalog){
 assert(evidence.id&&evidence.kind&&evidence.path&&evidence.locator&&evidence.claim,`${evidence.id||'evidence'}: incomplete evidence record`);
 if(evidence.external_repo==='events-bot-new'){
  assert(evidence.source_sha==='ef7aa62e45c60f7a12da6160f490719c0721ec03',`${evidence.id}: source SHA drift`);
  if(evidence.kind==='source')assert(evidence.closure_sha==='66bc0d43e36299417626f992021cfb7299ddf704'&&/^[a-f0-9]{64}$/.test(evidence.file_sha256),`${evidence.id}: closure/file identity missing`);
 }
}
const assertEvidenceRefs=(refs,label,{allowEmpty=false}={})=>{
 assert(Array.isArray(refs),`${label}: refs are not an array`);
 if(!allowEmpty)assert(refs.length>0,`${label}: empty evidence refs`);
 unique(refs,label);
 for(const ref of refs)assert(evidenceSet.has(ref),`${label}: unknown evidence ref ${ref}`);
};

const ratioKeys=['4:5','5:4','3:2','2:3','1:1','intrinsic_source','other_observed'];
const mediaKeys=['photography','poster_artwork','ocr_document','unknown_text'];
const fitKeys=['cover','contain','crop_permission','focal_point','safe_area','object_position'];
const fallbackKeys=['missing','broken','tiny_source'];
const loadingKeys=['skeleton','layout_reservation'];
const responsiveKeys=['resource_selection','art_direction','breakpoints'];
assert(JSON.stringify(json.required_matrix_dimensions.ratios)===JSON.stringify(ratioKeys),'declared ratio vocabulary mismatch');
assert(JSON.stringify(json.required_matrix_dimensions.media_types)===JSON.stringify(mediaKeys),'declared media-type vocabulary mismatch');
assert(JSON.stringify(json.required_matrix_dimensions.fit_crop_and_focus)===JSON.stringify(fitKeys),'declared fit/crop vocabulary mismatch');
assert(JSON.stringify(json.required_matrix_dimensions.fallback_states)===JSON.stringify(fallbackKeys),'declared fallback vocabulary mismatch');
assert(JSON.stringify(json.required_matrix_dimensions.loading_and_layout)===JSON.stringify(loadingKeys),'declared loading/layout vocabulary mismatch');
assert(JSON.stringify(json.required_matrix_dimensions.responsive_art_direction)===JSON.stringify(responsiveKeys),'declared responsive vocabulary mismatch');

const expectedConsumers=[
 'event-detail.desktop.primary-stage','event-detail.desktop.fullscreen-gallery','event-detail.desktop.poster-companion','event-detail.desktop.preview-rails',
 'event-detail.mobile.primary-stage','event-detail.mobile.fullscreen-gallery','event-detail.shared.missing-fallback','lab.event-media-rail',
 'boundary.related-event-card','boundary.mobile-listing-rail'
];
const consumers=json.consumer_policy_matrix;
assert(Array.isArray(consumers)&&consumers.length===10,'expected ten exhaustive consumer/slot records');
unique(consumers.map((x)=>x.consumer_id),'consumer IDs');
assert(JSON.stringify(consumers.map((x)=>x.consumer_id))===JSON.stringify(expectedConsumers),'consumer order/census mismatch');
const consumerSet=new Set(expectedConsumers);
const expectedInScope=expectedConsumers.slice(0,7);
assert(JSON.stringify(json.scope.in_scope_consumer_ids)===JSON.stringify(expectedInScope),'in-scope consumer census mismatch');
assert(JSON.stringify(json.scope.evidence_only_consumer_ids)===JSON.stringify(['lab.event-media-rail']),'evidence-only census mismatch');
assert(JSON.stringify(json.scope.boundary_pending_consumer_ids)===JSON.stringify(['boundary.related-event-card','boundary.mobile-listing-rail']),'boundary-pending census mismatch');
assert(/never expands family scope/i.test(json.scope.boundary_rule)&&/no merge\/split/i.test(json.scope.boundary_rule),'boundary rule is not fail-closed');

const blockerSet=new Set((json.exact_blockers||[]).map((x)=>x.id));
const checkCell=(cell,label)=>{
 assert(cell&&typeof cell==='object'&&!Array.isArray(cell),`${label}: missing policy cell`);
 assert(statusSet.has(cell.status),`${label}: invalid status ${cell.status}`);
 assert(typeof cell.current_behavior==='string'&&cell.current_behavior.length>0,`${label}: current behavior missing`);
 assert(Object.hasOwn(cell,'target_decision')&&cell.target_decision===null,`${label}: target decision must remain null`);
 assertEvidenceRefs(cell.evidence_refs,`${label}.evidence_refs`);
 if(['NOT_APPLICABLE_WITH_REASON','EVIDENCE_ONLY_OUT_OF_SCOPE'].includes(cell.status))assert(typeof cell.reason==='string'&&cell.reason.length>0,`${label}: reason required for ${cell.status}`);
};
for(const consumer of consumers){
 assert(consumerSet.has(consumer.consumer_id),`${consumer.consumer_id}: unexpected consumer`);
 assert(consumer.component&&consumer.slot_id&&consumer.route_family&&consumer.viewport_scope,`${consumer.consumer_id}: consumer identity incomplete`);
 assert(['in_scope_candidate','evidence_only_preserve','boundary_pending_do_not_merge'].includes(consumer.scope_status),`${consumer.consumer_id}: invalid scope status`);
 exactKeys(consumer.ratios,ratioKeys,`${consumer.consumer_id}.ratios`);
 exactKeys(consumer.media_types,mediaKeys,`${consumer.consumer_id}.media_types`);
 exactKeys(consumer.fit_crop_and_focus,fitKeys,`${consumer.consumer_id}.fit_crop_and_focus`);
 exactKeys(consumer.fallback_states,fallbackKeys,`${consumer.consumer_id}.fallback_states`);
 exactKeys(consumer.loading_and_layout,loadingKeys,`${consumer.consumer_id}.loading_and_layout`);
 exactKeys(consumer.responsive_art_direction,responsiveKeys,`${consumer.consumer_id}.responsive_art_direction`);
 for(const [groupName,group] of Object.entries({ratios:consumer.ratios,media_types:consumer.media_types,fit_crop_and_focus:consumer.fit_crop_and_focus,fallback_states:consumer.fallback_states,loading_and_layout:consumer.loading_and_layout,responsive_art_direction:consumer.responsive_art_direction}))for(const [key,cell] of Object.entries(group))checkCell(cell,`${consumer.consumer_id}.${groupName}.${key}`);
 checkCell(consumer.upscale_tiny_source,`${consumer.consumer_id}.upscale_tiny_source`);
 exactKeys(consumer.provenance,['source_refs','requirement_refs','runtime_refs'],`${consumer.consumer_id}.provenance`);
 assertEvidenceRefs(consumer.provenance.source_refs,`${consumer.consumer_id}.source_refs`,{allowEmpty:consumer.scope_status==='boundary_pending_do_not_merge'});
 assertEvidenceRefs(consumer.provenance.requirement_refs,`${consumer.consumer_id}.requirement_refs`);
 assertEvidenceRefs(consumer.provenance.runtime_refs,`${consumer.consumer_id}.runtime_refs`,{allowEmpty:true});
 const runtime=consumer.runtime_evidence;
 assert(statusSet.has(runtime.status),`${consumer.consumer_id}: invalid runtime status`);
 assert(Array.isArray(runtime.packet_refs),`${consumer.consumer_id}: packet refs missing`);
 assertEvidenceRefs(runtime.packet_refs,`${consumer.consumer_id}.runtime.packet_refs`,{allowEmpty:true});
 for(const field of ['production_state_claimed','production_equivalence','production_observed'])assert(runtime[field]===false,`${consumer.consumer_id}: unsupported runtime production claim ${field}`);
 if(runtime.packet_refs.length===0)assert(runtime.reason,`${consumer.consumer_id}: absent runtime needs exact reason`);
 assert(Array.isArray(consumer.blocker_refs)&&consumer.blocker_refs.length>0,`${consumer.consumer_id}: blocker refs missing`);
 for(const ref of consumer.blocker_refs)assert(blockerSet.has(ref),`${consumer.consumer_id}: unknown blocker ${ref}`);
 if(consumer.scope_status==='boundary_pending_do_not_merge'){
  const boundaryCells=[...Object.values(consumer.ratios),...Object.values(consumer.media_types),...Object.values(consumer.fit_crop_and_focus),consumer.upscale_tiny_source,...Object.values(consumer.fallback_states),...Object.values(consumer.loading_and_layout),...Object.values(consumer.responsive_art_direction)];
  assert(boundaryCells.every((x)=>x.status==='EVIDENCE_ONLY_OUT_OF_SCOPE'),`${consumer.consumer_id}: boundary evidence leaked into family policy`);
 }
 if(consumer.scope_status==='in_scope_candidate'){
  const cells=[...Object.values(consumer.ratios),...Object.values(consumer.media_types),...Object.values(consumer.fit_crop_and_focus),consumer.upscale_tiny_source,...Object.values(consumer.fallback_states),...Object.values(consumer.loading_and_layout),...Object.values(consumer.responsive_art_direction)];
  assert(cells.some((x)=>['PARTIAL_EVIDENCE','CONFLICT','UNBOUND'].includes(x.status)),`${consumer.consumer_id}: unsupported positive readiness`);
 }
}

const expectedProbeIds=['breakpoint.017c006b1fb4a73e','breakpoint.2b71e3365f6f4029','breakpoint.657255de26bb8525','breakpoint.9007467d208ac7bd','breakpoint.9274460842120519','breakpoint.a2ab8c7ff2962a9a','breakpoint.c86f2675dac5c0dc','breakpoint.e4bb42b01042b720','breakpoint.f573562b45bea1dd'];
assert(JSON.stringify(json.responsive_probe_blockers)===JSON.stringify(expectedProbeIds),'responsive mismatch probe census changed');

const expectedSupersession=new Map([
 ['/candidate_contract/responsive_contract/0/status','resolved_by_evidence'],['/evidence/0/observation_scope','still_open'],['/human_review_status','still_open'],['/normalization_allowed','still_open'],['/normalization_gaps/0','replaced_by_requirement'],['/promotion_blockers/0','still_open'],['/recommendation','owner_decision_required'],['/unresolved_alternatives/0','owner_decision_required'],['/unresolved_alternatives/1','owner_decision_required'],['/normative_status','still_open'],['/decision','owner_decision_required']
]);
assert(json.blocker_supersession.length===expectedSupersession.size,'original blocker supersession census mismatch');
unique(json.blocker_supersession.map((x)=>x.source_pointer),'blocker supersession pointers');
for(const row of json.blocker_supersession){
 assert(expectedSupersession.get(row.source_pointer)===row.status,`${row.source_pointer}: supersession status mismatch`);
 assert(['still_open','resolved_by_evidence','replaced_by_requirement','invalidated','owner_decision_required'].includes(row.status),`${row.source_pointer}: invalid supersession enum`);
 assert(row.original_text&&row.rationale&&Array.isArray(row.superseded_by_refs)&&Array.isArray(row.residual_blocker_refs),`${row.source_pointer}: incomplete supersession`);
 for(const ref of row.superseded_by_refs)assert(evidenceSet.has(ref)||blockerSet.has(ref),`${row.source_pointer}: unresolved superseded-by ref ${ref}`);
 for(const ref of row.residual_blocker_refs)assert(blockerSet.has(ref),`${row.source_pointer}: unknown residual blocker ${ref}`);
}

const expectedBlockers=['EM-CENSUS-001','EM-RATIO-002','EM-SEMANTIC-003','EM-CROP-004','EM-TINY-005','EM-FALLBACK-006','EM-LAYOUT-007','EM-RESP-008','EM-RUNTIME-009','EM-GOV-010','EM-LABRAIL-011','EM-PROVENANCE-012'];
assert(json.exact_blockers.length===12&&JSON.stringify(json.exact_blockers.map((x)=>x.id))===JSON.stringify(expectedBlockers),'exact blocker list mismatch');
unique(json.exact_blockers.map((x)=>x.dimension),'blocker dimensions');
for(const blocker of json.exact_blockers){
 assert(blocker.status==='open'&&blocker.blocks_before==='target_contract',`${blocker.id}: blocker stage/status drift`);
 assert(blocker.statement&&blocker.closure_condition,`${blocker.id}: incomplete blocker`);
 assertEvidenceRefs(blocker.evidence_refs,`${blocker.id}.evidence_refs`);
}

assert(json.positive_readiness_checklist.length===13,'positive checklist census mismatch');
unique(json.positive_readiness_checklist.map((x)=>x.id),'checklist IDs');
const passRows=json.positive_readiness_checklist.filter((x)=>x.status==='PASS');
assert(passRows.length===1&&passRows[0].dimension==='authority_and_byte_integrity','semantic readiness was inferred from source integrity');
const blockedChecks=json.positive_readiness_checklist.filter((x)=>x.status==='BLOCKED');
assert(blockedChecks.length===12,'all twelve semantic blockers must remain on the checklist');
assert(JSON.stringify(blockedChecks.flatMap((x)=>x.blocker_refs))===JSON.stringify(expectedBlockers),'checklist/blocker exact coverage mismatch');
for(const check of json.positive_readiness_checklist){
 assert(['PASS','BLOCKED'].includes(check.status),`${check.id}: invalid checklist status`);
 if(check.status==='PASS')assertEvidenceRefs(check.evidence_refs,`${check.id}.evidence_refs`);
 else for(const ref of check.blocker_refs)assert(blockerSet.has(ref),`${check.id}: unknown blocker ${ref}`);
}
assert(json.readiness_algorithm.mode==='positive_fail_closed'&&json.readiness_algorithm.current_evaluation==='fail','readiness algorithm is not fail-closed');
assert(json.verdict.status==='NOT_READY_WITH_EXACT_BLOCKERS'&&json.verdict.ready_for_contract_decision_review===false,'incorrect readiness verdict');
assert(JSON.stringify(json.verdict.exact_blocker_ids)===JSON.stringify(expectedBlockers),'verdict blocker list mismatch');

// Human-readable dossier must preserve every machine identity and boundary.
for(const literal of ['NOT_READY_WITH_EXACT_BLOCKERS','NOT_MERGED','target ratio','tokens','merge or split','historical v1 dossier'])assert(md.includes(literal),`Markdown missing boundary literal: ${literal}`);
for(const id of expectedConsumers)assert(md.includes(`\`${id}\``),`Markdown missing consumer ${id}`);
for(const id of expectedBlockers)assert(md.includes(`\`${id}\``),`Markdown missing blocker ${id}`);
for(const id of evidenceIds)assert(md.includes(`\`${id}\``),`Markdown missing evidence ${id}`);
for(const id of expectedProbeIds)assert(md.includes(`\`${id}\``),`Markdown missing probe ${id}`);
assert(md.includes('production_state_claimed=false')&&md.includes('production_equivalence=false')&&md.includes('production_observed=false'),'Markdown hides runtime non-equivalence');

process.stdout.write(JSON.stringify({status:'valid',dossier:json.id,verdict:json.verdict.status,consumers:consumers.length,in_scope:expectedInScope.length,evidence_only:1,boundary_pending:2,blockers:expectedBlockers.length,checklist:json.positive_readiness_checklist.length,probes:expectedProbeIds.length})+'\n');
