#!/usr/bin/env node
import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import childProcess from 'node:child_process';import { fileURLToPath } from 'node:url';
import { BRANCH, PR_NUMBER, PR_URL, collectAndValidate, gitCommand, stable, validateChangedPaths } from '../scripts/event-media-blocker-closure-v1/lib.mjs';
import { buildReceipt, verifyReceipt } from '../scripts/event-media-blocker-closure-v1/receipt.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const P={source:'catalog/normalization/event-media/consumer-requirement-matrix.jsonl',blockers:'catalog/normalization/event-media/blocker-closure-v1.jsonl',cards:'catalog/normalization/event-media/owner-decisions.jsonl',fixtures:'catalog/normalization/event-media/decision-fixtures.jsonl',reviews:'catalog/normalization/event-media/decision-visual-review-ledger.jsonl',behavior:'prototypes/event-media-decision-pack/behavioral-evidence-provenance.jsonl',readiness:'catalog/normalization/event-media/readiness-v1.jsonl',experiments:'catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/experiment-registry.jsonl',schema:'contracts/normalization/event-media-blocker-closure-catalog.v1.schema.json'};
const readRows=(p)=>fs.readFileSync(path.join(root,p),'utf8').split('\n').filter(Boolean).map(JSON.parse);const writeRows=(p,rows)=>fs.writeFileSync(path.join(root,p),`${rows.map((x)=>JSON.stringify(x)).join('\n')}\n`);
const baseline=()=>collectAndValidate({root,fixtureMode:true});
const cases=[];const add=(id,file,code,mutate)=>cases.push({id,file,code,mutate});
add('raw-corpus-drift',P.source,'EMC_FROZEN_CORPUS_DRIFT',(r)=>{r[0].consumer+=' drift'});
add('false-closure',P.blockers,'EMC_FALSE_CLOSURE',(r)=>{const x=r.find((v)=>v.blocker_id==='EM-RATIO-002');x.terminal_status='resolved_by_existing_evidence'});
add('open-missing-facts-erased',P.blockers,'EMC_OPEN_MISSING_FACTS',(r)=>{r.find((v)=>v.blocker_id==='EM-RATIO-002').exact_missing_evidence=[]});
add('owner-card-collapse',P.cards,'EMC_OWNER_CARD_COLLAPSE',(r)=>{r[1].blocker_id=r[0].blocker_id});
add('option-selection',P.cards,'EMC_OPTION_SELECTED',(r)=>{r[0].accepted_option_id=r[0].options[0].option_id});
add('option-fixture-substitution',P.cards,'EMC_OPTION_FIXTURE_MISMATCH',(r)=>{r[0].options[0].visual_comparison.fixture_ids.pop()});
add('option-board-drift',P.cards,'EMC_OPTION_BOARD_CONTRACT',(r)=>{r[0].options[0].visual_comparison.visual_board_target='prototypes/event-media-decision-pack/screenshots/wrong.png'});
add('fixture-option-binding-collapse',P.fixtures,'EMC_FIXTURE_OPTION_BINDING',(r)=>{r[0].reuse_contract.option_bindings.pop()});
add('fixture-reuse-failopen',P.fixtures,'EMC_FIXTURE_REUSE_FAILOPEN',(r)=>{r[0].reuse_contract.same_source_bytes_crop_state_and_viewport_across_options=false});
add('png-ledger-hash-drift',P.reviews,'EMC_PNG_LEDGER_DRIFT',(r)=>{r[0].sha256='0'.repeat(64)});
add('full-resolution-review-erased',P.reviews,'EMC_REVIEW_FAILOPEN',(r)=>{r[0].full_resolution_opened=false});
add('behavioral-binding-drift',P.behavior,'EMC_BEHAVIOR_BINDING_DRIFT',(r)=>{r[0].sha256='0'.repeat(64)});
add('readiness-failopen',P.readiness,'EMC_READINESS_FAILOPEN',(r)=>{r[0].status='READY_FOR_OWNER_CONTRACT_DECISION'});
add('readiness-candidate-hash-swap',P.readiness,'EMC_READINESS_CANDIDATE_JOIN',(r)=>{r[0].candidate_contract_sha256=r[1].candidate_contract_sha256});
add('readiness-boundary-rebind',P.readiness,'EMC_READINESS_BOUNDARY_JOIN',(r)=>{r[0].boundary_ref=r[1].boundary_ref});
add('readiness-blocker-erasure',P.readiness,'EMC_READINESS_FROZEN_PROJECTION',(r)=>{r[0].open_blocker_refs=[]});
add('readiness-reason-erasure',P.readiness,'EMC_READINESS_REASON_JOIN',(r)=>{r[0].not_ready_reason_codes=[]});
add('product-value-promotion',P.cards,'EMC_PRODUCT_VALUE_ESCAPE',(r)=>{r[0].promotion_ready=true});
add('stop-normalization',P.cards,'EMC_STOP_ESCAPE',(r)=>{r[0].normalization_allowed=true});
add('experiment-winner',P.experiments,'EMC_EXPERIMENT_REGISTRY_ESCAPE',(r)=>{r[0].decision='MERGED'});

assert.equal(baseline().final_status,'EVENT_MEDIA_BLOCKER_CLOSURE_INCOMPLETE');let baselineRechecks=1;const results=[];
for(const item of cases){const target=path.join(root,item.file);const bytes=fs.readFileSync(target);try{const rows=readRows(item.file);item.mutate(rows);writeRows(item.file,rows);let caught=null;try{baseline()}catch(error){caught=error}assert.ok(caught,`${item.id}: mutation passed`);assert.equal(caught.code,item.code,`${item.id}: wrong code ${caught?.code}`);results.push({case_id:item.id,expected_error_code:item.code,actual_error_code:caught.code,pass:true});}finally{fs.writeFileSync(target,bytes)}assert.equal(baseline().final_status,'EVENT_MEDIA_BLOCKER_CLOSURE_INCOMPLETE');baselineRechecks++;}
for(const [id,relative,code] of [['non-pack-prototype','prototypes/unrelated/index.html','EMC_NONPACK_PROTOTYPE_MUTATION'],['penpot-mutation','penpot/file.json','EMC_PENPOT_MUTATION'],['production-site-mutation','site/src/example.ts','EMC_PRODUCTION_MUTATION']]){let caught=null;try{validateChangedPaths([relative])}catch(error){caught=error}assert.equal(caught?.code,code);results.push({case_id:id,expected_error_code:code,actual_error_code:caught.code,pass:true});}
// Receipt/output drift: preserve a deterministic baseline receipt, alter one output byte, rebuild and require byte rejection.
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'emc-receipt-negative-'));const receiptPath=path.join(temp,'receipt.json');const metadata={materializationParent:gitCommand(root,['rev-parse','HEAD']),prNumber:PR_NUMBER,prUrl:PR_URL,branch:BRANCH};const receipt=buildReceipt({root,fixtureMode:true,...metadata});fs.writeFileSync(receiptPath,stable(receipt));const receiptOutputPath=path.join(root,'.codex/lanes/event-media-blocker-evidence/RESULTS.md');const receiptOutputBytes=fs.readFileSync(receiptOutputPath);try{fs.appendFileSync(receiptOutputPath,'\n');const expected=buildReceipt({root,fixtureMode:true,...metadata});let caught=null;try{verifyReceipt(root,expected,path.relative(root,receiptPath))}catch(error){caught=error}assert.equal(caught?.code,'EMC_RECEIPT_DRIFT');results.push({case_id:'receipt-output-drift',expected_error_code:'EMC_RECEIPT_DRIFT',actual_error_code:caught.code,pass:true});}finally{fs.writeFileSync(receiptOutputPath,receiptOutputBytes);fs.rmSync(temp,{recursive:true,force:true})}assert.equal(baseline().final_status,'EVENT_MEDIA_BLOCKER_CLOSURE_INCOMPLETE');baselineRechecks++;
// Schema-level unknown property proof (semantic code intentionally does not duplicate JSON Schema structure).
const cardPath=path.join(root,P.cards);const cardBytes=fs.readFileSync(cardPath);try{const rows=readRows(P.cards);rows[0].unknown_fail_open_field=true;writeRows(P.cards,rows);const schema=childProcess.spawnSync('python3',['scripts/event-media-blocker-closure-v1/validate-schemas.py','--root','.','--skip-receipt'],{cwd:root,encoding:'utf8'});assert.notEqual(schema.status,0);assert.match(schema.stderr,/Additional properties are not allowed/u);results.push({case_id:'schema-additional-property',expected_error_code:'EMC_SCHEMA_VALIDATION',actual_error_code:'EMC_SCHEMA_VALIDATION',pass:true});}finally{fs.writeFileSync(cardPath,cardBytes)}assert.equal(baseline().final_status,'EVENT_MEDIA_BLOCKER_CLOSURE_INCOMPLETE');baselineRechecks++;
console.log(JSON.stringify({status:'PASS',cases:results.length,passed:results.length,failed:0,baseline_rechecks:baselineRechecks,restored_after_each:true,results},null,2));
