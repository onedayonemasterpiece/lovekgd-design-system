import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repo=resolve(import.meta.dirname,'..');
const cli=join(repo,'scripts/current-v2/current-v2.mjs');
const current=join(repo,'catalog/ui-components/event-card-large/current-v2');
const registry=join(current,'active-registry.json');
const eventsRepo=process.env.EVENTS_REPO||'/home/dev/.codex/worktrees/events-bot-new/golden-event-corpus-v1';
const toolingRepo=process.env.EVENTS_TOOLING_REPO||'/home/dev/.codex/worktrees/events-bot-new/event-card-conformance-p0p1';
const run=(args,opts={})=>spawnSync('node',[cli,...args],{encoding:'utf8',...opts});
const json=(p)=>JSON.parse(readFileSync(p,'utf8'));
const schema=(instance,schemaPath)=>spawnSync('python3',['-c','import json,jsonschema,sys; jsonschema.validate(json.load(open(sys.argv[1])),json.load(open(sys.argv[2])))',instance,schemaPath],{encoding:'utf8'});

let result=run(['validate','--registry',registry,'--design-repo',repo,'--events-repo',eventsRepo,'--tooling-repo',toolingRepo]);
assert.equal(result.status,0,result.stderr||result.stdout);
const validation=JSON.parse(result.stdout);assert.equal(validation.cases,7);assert.equal(validation.evidence_readiness,'READY');
result=run(['batch-plan','--manifest',join(current,'batch-manifest.json')]);assert.equal(result.status,0);assert.equal(JSON.parse(result.stdout).verdict,'NOT_APPLICABLE');result=run(['batch-plan','--manifest',join(current,'batch-manifest.json'),'--batch','event-card-large-current-v2']);assert.equal(result.status,0);assert.equal(JSON.parse(result.stdout).cases.length,7);
const reg=json(registry);assert.equal(reg.active_case_count,7);assert.equal(reg.cases.length,7);assert.match(reg.design_sha,/^[a-f0-9]{40}$/u);assert.match(reg.astro_sha,/^[a-f0-9]{40}$/u);
assert.equal(reg.design_sha,'0882917a1328607c498d82e4c2a652bbd3df946d');assert.equal(reg.astro_sha,'22ebe3c5e92b13684cca32c14357ef7b91834977');assert.equal(reg.events_tooling_sha,'713a035a8aaa9ecfdcdd5fbd817fe504160df2f5');
assert.equal(new Set(reg.cases.map((x)=>x.contract_sha256)).size,1);
assert.equal(new Set(reg.cases.map((x)=>x.case_id)).size,7);
assert.equal(schema(registry,join(repo,'contracts/ui-conformance/event-card-large-current-v2-registry.v1.schema.json')).status,0);
for(const entry of reg.cases){
 const c=join(current,entry.case_path),receipt=join(current,entry.receipt_path);assert.equal(schema(c,join(repo,'contracts/ui-conformance/event-card-large-current-v2-case.v1.schema.json')).status,0);assert.equal(schema(receipt,join(repo,'contracts/ui-conformance/event-card-large-current-v2-final-receipt.v1.schema.json')).status,0);
	 const row=json(c);assert.equal(row.lifecycle_status,'active_ready');assert.equal(row.evidence_status,'durable_pack_verified');assert.equal(row.penpot_binding.binding_status,'bound');assert(!JSON.stringify(row).includes('pending-'));assert.equal(row.current_penpot_structural_readback.status,'verified_found');assert.equal(row.current_penpot_structural_readback.file_revision,1408);assert.equal(row.penpot_binding.metadata_readback_status,'verified_current_v2');assert.equal(row.penpot_binding.metadata_readback_revision,1410);assert(existsSync(join(current,row.current_penpot_structural_readback.facts_path)));assert(existsSync(resolve(join(c,'..',row.evidence_manifest_path))));assert.equal(row.penpot_binding.revision,1409);assert.equal(row.penpot_binding.export_revision_status,'verified_exact');if(row.viewport.id==='desktop-1280'){assert.equal(row.viewport.container_width,380);assert.notEqual(row.viewport.container_width,474);assert.equal(row.penpot_binding.shape_id,row.current_penpot_structural_readback.shape_id);}else{assert.equal(typeof row.penpot_binding.historical_materialization_label,'string');}
	}
	const metadataReadback=json(join(current,'penpot-readback/current-v2-metadata.rev1410.json'));assert.equal(metadataReadback.file_revision,1410);assert.equal(metadataReadback.contract_sha256,reg.contract_sha256);assert.equal(metadataReadback.cases.length,7);for(const row of metadataReadback.cases){assert.equal(row.case_id,row.metadata.case_id);assert.equal(row.metadata.contract_sha256,reg.contract_sha256);assert.equal(row.metadata.promotion_status,'NOT_PROMOTED');}
assert.equal(schema(join(current,'telegram-bindings.json'),join(repo,'contracts/ui-conformance/event-card-large-current-v2-telegram-bindings.v1.schema.json')).status,0);
const readbackFixture=join(mkdtempSync(join(tmpdir(),'current-v2-readback-')),'readback.json');writeFileSync(readbackFixture,JSON.stringify({schema_version:'event_card_large_current_v2_telegram_readback.v1',case_id:reg.cases[0].case_id,contract_sha256:reg.contract_sha256,message_id:1074,message_link:'https://t.me/c/4337049383/1074',image_sha256:'a'.repeat(64),verdict_sha256:'b'.repeat(64),content_hash:'c'.repeat(64),sent_at:'2026-08-22T15:00:00Z',read_back_at:'2026-08-22T15:01:00Z',read_back_status:'verified',supersedes_message_id:1073}));assert.equal(schema(readbackFixture,join(repo,'contracts/ui-conformance/event-card-large-current-v2-telegram-readback.v1.schema.json')).status,0);


// Actual-Astro-generated chip matrix: every exact corpus value and branch family is explicit,
// while labels remain content overrides rather than one component per string.
const chips=json(join(current,'chip-coverage.actual-astro.json'));
assert.equal(chips.evidence_kind,'actual-astro-build-generated-inventory');assert.equal(chips.exact_generated_rows.length,8);
assert.deepEqual(chips.exact_value_sets.event_type,['концерт','выставка','лекция']);
assert.deepEqual(chips.exact_value_sets.admission,['1500 ₽','1000 ₽','Бесплатно · вход свободный','Билеты','Бесплатно · регистрация','Условия уточняются','Запись по телефону']);
assert.equal(chips.exact_value_sets.occurrence.length,8);
for(const value of ['sold-out','free-booking','donation','phone','ticket','free','price','arbitrary','unspecified'])assert(chips.generator_branch_families.admission.includes(value));
assert.match(chips.coverage_model,/content overrides/u);
const contract=json(join(current,'component-contract.json'));assert.equal(contract.semantic_components.event_type.arbitrary_nonempty_text,true);assert.equal(contract.semantic_components.admission.arbitrary_nonempty_text,true);assert.deepEqual(contract.semantic_components.like.states,['count-absent','count-positive']);assert.equal(contract.semantic_components.occurrence.penpot_materialization_status,'missing');assert(chips.penpot_coverage.missing_corpus_specimens.includes('event_type=лекция'));

// Current-v2 validators fail closed on pending state, mismatched hash and missing Telegram read-back.
for(const mutate of [
 (dir)=>{const p=join(dir,'cases',`${reg.cases[0].case_id}.case.json`);const d=json(p);d.evidence_status='pending-capture';writeFileSync(p,JSON.stringify(d));},
 (dir)=>{const p=join(dir,'cases',`${reg.cases[0].case_id}.case.json`);const d=json(p);d.contract_sha256='0'.repeat(64);writeFileSync(p,JSON.stringify(d));},
 (dir)=>{const p=join(dir,'telegram-bindings.json');const d=json(p);d.bindings[0].binding_status='published_verified';d.bindings[0].readback_receipt=null;writeFileSync(p,JSON.stringify(d));},
]){
 const tmp=mkdtempSync(join(tmpdir(),'current-v2-negative-'));cpSync(current,tmp,{recursive:true});mutate(tmp);result=run(['validate','--registry',join(tmp,'active-registry.json')]);assert.notEqual(result.status,0,'negative current-v2 mutation must fail');
}

// Exact 11-file finalizer fails without evidence and succeeds only for a complete,
// identity-bound synthetic validator fixture (never registered as product evidence).
const casePath=join(current,reg.cases[0].case_path);const caseRow=json(casePath);const work=mkdtempSync(join(tmpdir(),'current-v2-finalizer-'));const incomplete=join(work,'incomplete');mkdirSync(incomplete);
result=run(['finalize-evidence','--case',casePath,'--source',incomplete,'--storage-root',join(work,'durable')]);assert.equal(result.status,2);assert.match(result.stdout,/BLOCKED_EVIDENCE_INCOMPLETE/u);
const complete=join(work,'complete');mkdirSync(complete);const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64');
for(const name of ['astro.png','penpot.png','overlay-50.png','diff.png'])writeFileSync(join(complete,name),png);
for(const name of ['geometry.json','computed-style.json','structural-findings.json','pixel-metrics.json'])writeFileSync(join(complete,name),'{}\n');
for(const name of ['agent-review.json','final-receipt.json','run-manifest.json'])writeFileSync(join(complete,name),JSON.stringify({case_id:caseRow.case_id,contract_sha256:caseRow.contract_sha256}));
result=run(['finalize-evidence','--case',casePath,'--source',complete,'--storage-root',join(work,'durable'),'--created-at','2026-08-22T15:00:00Z']);assert.equal(result.status,0,result.stderr||result.stdout);const finalized=JSON.parse(result.stdout);assert.equal(finalized.status,'VERIFIED_DURABLE');const manifestPath=join(work,'durable',caseRow.case_id,'durable-evidence-manifest.json');assert(existsSync(manifestPath));assert.equal(schema(manifestPath,join(repo,'contracts/ui-conformance/durable-evidence-manifest.v1.schema.json')).status,0);
const ephemeral=join(work,'durable','ephemeral');mkdirSync(ephemeral);writeFileSync(join(ephemeral,'ephemeral-run-manifest.json'),'{}');result=run(['cleanup','--root',join(work,'durable'),'--dry-run']);assert.equal(result.status,0);const cleanup=JSON.parse(result.stdout);assert(cleanup.kept.some((x)=>x.name===caseRow.case_id&&x.reason==='durable-current-v2'));assert(cleanup.candidates.some((x)=>x.name==='ephemeral'));

// Workflow has the exact immutable interface, explicit N/A lane and the real events hook.
for(const workflowPath of ['.github/workflows/ui-three-way-conformance.yml']){const workflow=readFileSync(join(repo,workflowPath),'utf8');for(const input of ['design_tooling_sha','design_sha','events_tooling_sha','astro_sha','batch','publish_telegram','trusted_source'])assert(workflow.includes(`${input}:`));assert(workflow.includes('NOT_APPLICABLE'));assert(workflow.includes('events-bot-new/scripts/ui_conformance/run-current-v2.mjs run-batch'));assert(workflow.includes('actions/cache@v4'));assert(workflow.includes('finalize-evidence'));}
console.log('event-card-large-current-v2: PASS (7 canonical cases; 8 actual-Astro chip rows; fail-closed evidence/CI contracts)');
