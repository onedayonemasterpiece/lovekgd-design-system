#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import childProcess from 'node:child_process';

const root=path.resolve('.');
const validator=path.join(root,'scripts/normalization-v1-1/validate-event-media-dossier.mjs');
const sourcePath=path.join(root,'catalog/normalization/families/event-media/dossier.json');
const source=JSON.parse(fs.readFileSync(sourcePath,'utf8'));
const tempRoot=fs.mkdtempSync(path.join(os.tmpdir(),'event-media-dossier-validator-'));
const clone=(value)=>structuredClone(value);
const run=(args=[])=>childProcess.spawnSync(process.execPath,[validator,'--root',root,...args],{cwd:root,encoding:'utf8'});
const assert=(value,message)=>{if(!value)throw new Error(message)};

const valid=run();
assert(valid.status===0,`valid dossier rejected: ${valid.stderr}`);
assert(JSON.parse(valid.stdout).status==='valid','valid dossier did not return validation receipt');

const mutations=[
 ['missing-required-ratio',(d)=>{delete d.consumer_policy_matrix[0].ratios['4:5']},/ratios: keys differ/],
 ['selected-target-ratio',(d)=>{d.target_ratio_selection='4:5'},/target ratio was selected/],
 ['false-ready-verdict',(d)=>{d.verdict.status='READY_FOR_CONTRACT_DECISION_REVIEW';d.verdict.ready_for_contract_decision_review=true},/incorrect readiness verdict/],
 ['lost-original-blocker',(d)=>{d.blocker_supersession.pop()},/supersession census mismatch/],
 ['invented-production-observation',(d)=>{d.consumer_policy_matrix[0].runtime_evidence.production_observed=true},/unsupported runtime production claim/],
 ['lost-exact-blocker',(d)=>{d.exact_blockers.pop()},/unknown blocker EM-PROVENANCE-012|exact blocker list mismatch/],
 ['normalization-enabled',(d)=>{d.normalization_allowed=true},/escaped analysis-only boundary/],
 ['evidence-free-cell',(d)=>{d.consumer_policy_matrix[0].ratios['4:5'].evidence_refs=[]},/empty evidence refs/]
];
const receipts=[];
for(const [name,mutate,expected] of mutations){
 const document=clone(source); mutate(document);
 const file=path.join(tempRoot,`${name}.json`); fs.writeFileSync(file,JSON.stringify(document,null,2)+'\n');
 const result=run(['--dossier',file]);
 assert(result.status!==0,`${name}: semantic mutation passed`);
 assert(expected.test(result.stderr),`${name}: failed for the wrong reason: ${result.stderr}`);
 receipts.push({name,status:'rejected'});
}
fs.rmSync(tempRoot,{recursive:true,force:true});
process.stdout.write(JSON.stringify({status:'valid',baseline:'accepted',semantic_mutations:receipts.length,receipts})+'\n');
