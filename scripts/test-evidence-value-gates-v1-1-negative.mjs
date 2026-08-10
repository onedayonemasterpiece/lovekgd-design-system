#!/usr/bin/env node
import path from 'node:path';
import {
  authoritativeRegistryDigest,
  readJson,
  readJsonl,
  validateProductRecords,
  validateVisualEvidence
} from './evidence-value-gates-v1-1-lib.mjs';

const root=path.resolve(process.argv[2]??'.');
const base={
  visual:readJsonl(root,'catalog/normalization/visual-review-evidence.jsonl'),
  counts:readJson(root,'catalog/normalization/behavioral-manifest-counts.json'),
  census:readJsonl(root,'catalog/normalization/independent-consumer-census.jsonl'),
  applications:readJsonl(root,'catalog/normalization/component-applications.jsonl'),
  readiness:readJsonl(root,'catalog/normalization/product-value-readiness.jsonl')
};
const clone=(value)=>JSON.parse(JSON.stringify(value));
const registry=(rows)=>({repository:'onedayonemasterpiece/events-bot-new',commit:'66bc0d43e36299417626f992021cfb7299ddf704',path:'product/registry.json',sha256:authoritativeRegistryDigest(rows),rows});
const tests=[];
const positiveTests=[];
const reject=(name,kind,mutate,options={})=>{
  const state=clone(base); mutate(state);
  let rejected=false;
  try{
    if(kind==='visual')validateVisualEvidence(root,state.visual,state.counts);
    else validateProductRecords(state.applications,state.readiness,state.census,options);
  }catch(_error){rejected=true}
  if(!rejected)throw new Error(`negative mutation accepted: ${name}`);
  tests.push(name);
};
const accept=(name,mutate)=>{
  const state=clone(base);mutate(state);validateProductRecords(state.applications,state.readiness,state.census);positiveTests.push(name);
};

reject('visual-row-deletion','visual',(x)=>x.visual.pop());
reject('visual-full-resolution-false','visual',(x)=>{x.visual[0].full_resolution_opened=false});
reject('visual-reviewer-blank','visual',(x)=>{x.visual[0].reviewer=''});
reject('visual-review-status-pending','visual',(x)=>{x.visual[0].review_status='pending'});
reject('visual-archive-lineage-swap','visual',(x)=>{const a=x.visual.find((row)=>row.storage.lineage==='prior-reviewed-124');const b=x.visual.find((row)=>row.storage.lineage==='closure-new-10');[a.storage,b.storage]=[b.storage,a.storage]});
reject('visual-component-state-phase-drift','visual',(x)=>{x.visual[0].component_state.phase='invented'});
reject('manifest-conflict-count-drift','visual',(x)=>{x.counts.conflict_count=4});
reject('manifest-stale-key-promoted','visual',(x)=>{x.counts.canonical_counts.outputs['action-packet-index.jsonl']=0});
reject('census-edge-deletion','product',(x)=>{x.census=x.census.filter((row)=>row.id!==x.applications[0].census_edge_id)});
reject('census-edge-consumer-swap','product',(x)=>{const edge=x.census.find((row)=>row.id===x.applications[0].census_edge_id);edge.consumer='src/pages/invented.astro'});
reject('readiness-row-deletion','product',(x)=>x.readiness.pop());
reject('unknown-parent','product',(x)=>{const app=x.applications.find((row)=>row.value_evidence_mode==='direct');app.value_evidence_mode='inherited';app.parent_application_id='application.ffffffffffffffff'});
reject('non-inherited-parent','product',(x)=>{const [a,b]=x.applications.filter((row)=>row.value_evidence_mode==='direct');a.parent_application_id=b.id});
reject('self-parent','product',(x)=>{const app=x.applications.find((row)=>row.value_evidence_mode==='direct');app.value_evidence_mode='inherited';app.parent_application_id=app.id});
reject('two-node-inheritance-cycle','product',(x)=>{const [a,b]=x.applications.filter((row)=>row.value_evidence_mode==='direct');a.value_evidence_mode='inherited';b.value_evidence_mode='inherited';a.parent_application_id=b.id;b.parent_application_id=a.id;a.effective_value_application_id=a.id;b.effective_value_application_id=b.id;const ar=x.readiness.find((row)=>row.application_id===a.id),br=x.readiness.find((row)=>row.application_id===b.id);ar.parent_application_id=b.id;br.parent_application_id=a.id;ar.effective_value_application_id=a.id;br.effective_value_application_id=b.id;ar.inheritance_resolution='inherited';br.inheritance_resolution='inherited'});
reject('invented-id-with-absent-registry','product',(x)=>{x.applications[0].need_ids=['need.invented']});
reject('wrong-kind-authoritative-id','product',(x)=>{
  const app=x.applications[0]; const ready=x.readiness.find((row)=>row.application_id===app.id);
  const digest=authoritativeRegistryDigest([{kind:'metric',id:'metric.real'}]);app.product_authority.registry_status='present-at-pinned-commit';app.product_authority.registry_path='product/registry.json';app.product_authority.registry_sha256=digest;app.product_authority.resolver_status='resolved';
  app.value_evidence_status='existing_authoritative_mapping';app.need_ids=['metric.real'];ready.authoritative_id_resolution='resolved';
},{registry:registry([{kind:'metric',id:'metric.real'}])});
reject('unknown-authoritative-id','product',(x)=>{
  const rows=[{kind:'need',id:'need.other'}],app=x.applications[0],ready=x.readiness.find((row)=>row.application_id===app.id),digest=authoritativeRegistryDigest(rows);
  Object.assign(app.product_authority,{registry_status:'present-at-pinned-commit',registry_path:'product/registry.json',registry_sha256:digest,resolver_status:'resolved'});app.value_evidence_status='existing_authoritative_mapping';app.need_ids=['need.unknown'];ready.authoritative_id_resolution='resolved';
},{registry:registry([{kind:'need',id:'need.other'}])});
reject('duplicate-authoritative-registry-id','product',(_x)=>{}, {registry:registry([{kind:'need',id:'shared.id'},{kind:'metric',id:'shared.id'}])});
reject('pending-reconciliation-promotion-flip','product',(x)=>{const app=x.applications[0];const ready=x.readiness.find((row)=>row.application_id===app.id);app.lifecycle_status='pending_reconciliation';app.census_edge_id=null;app.promotion_ready=true;ready.lifecycle_status='pending_reconciliation';ready.census_edge_id=null;ready.promotion_ready=true});
reject('tombstone-without-deletion-receipt','product',(x)=>{const app=x.applications[0];const ready=x.readiness.find((row)=>row.application_id===app.id);app.lifecycle_status='tombstoned';app.census_edge_id=null;ready.lifecycle_status='tombstoned';ready.census_edge_id=null});
reject('silent-application-deletion','product',(x)=>{const removed=x.applications.pop();x.readiness=x.readiness.filter((row)=>row.application_id!==removed.id)});
reject('stable-identity-key-drift','product',(x)=>{x.applications[0].identity_key_sha256='0'.repeat(64)});
reject('readiness-census-binding-drift','product',(x)=>{x.readiness[0].census_edge_id=x.readiness[1].census_edge_id});
accept('missing-census-edge-preserved-pending-reconciliation',(x)=>{const app=x.applications[0],ready=x.readiness.find((row)=>row.application_id===app.id);x.census=x.census.filter((row)=>row.id!==app.census_edge_id);app.lifecycle_status='pending_reconciliation';app.census_edge_id=null;ready.lifecycle_status='pending_reconciliation';ready.census_edge_id=null;ready.reconciliation_status='pending-census-reconciliation';ready.blocking_reasons.push('independent_consumer_census_edge_missing')});

if(new Set(tests).size!==tests.length)throw new Error('negative test name duplication');
process.stdout.write(JSON.stringify({status:'valid',semantic_negative_mutations:tests.length,semantic_positive_preservation_cases:positiveTests.length,tests,positive_tests:positiveTests})+'\n');
