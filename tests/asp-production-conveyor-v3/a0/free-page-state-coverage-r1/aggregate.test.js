'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const repo=path.resolve(__dirname,'../../../..');
const load=x=>JSON.parse(fs.readFileSync(path.join(repo,x),'utf8'));
const bytes=x=>fs.readFileSync(path.join(repo,x));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex');
const canonical=v=>Array.isArray(v)?`[${v.map(canonical).join(',')}]`:v&&typeof v==='object'?`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`:JSON.stringify(v);
function record(x){const c=JSON.parse(JSON.stringify(x)),e=c.record_sha256;delete c.record_sha256;assert.equal(sha(Buffer.from(canonical(c))),e)}
function hasKey(v,key){if(Array.isArray(v))return v.some(x=>hasKey(x,key));if(v&&typeof v==='object')return Object.entries(v).some(([k,x])=>k===key||hasKey(x,key));return false}
test('A0 free-page/state-coverage aggregate is exact and bounded',()=>{
 const m=load('catalog/asp-production-conveyor-v3/a0/free-page-state-coverage-r1/manifest.v1.json');
 const q=load('catalog/asp-production-conveyor-v3/a0/free-page-state-coverage-r1/queue.v1.json');
 const inv=load('catalog/asp-production-conveyor-v3/a0/free-page-state-coverage-r1/publication-inventory.v1.json');
 for(const x of [m,q,inv])record(x);
 assert.equal(m.state,'A0_FREE_PAGE_AND_TABLET_GAPS_REMOTE_READY');
 assert.equal(m.next_owner,'D0_QA_INTEGRATE');
 assert.deepEqual(m.free_rows.fixture_order,['event.real.2182','event.real.6711','event.real.7609','event.real.8006','event.real.8200']);
 assert.equal(m.free_rows.events,2);assert.equal(m.free_rows.exhibitions,3);
 assert.equal(m.free_ready_states.length,6);assert.equal(new Set(m.free_ready_states).size,6);
 assert.equal(m.free_exception_states.length,6);assert.equal(new Set(m.free_exception_states).size,6);
 assert.equal(new Set([...m.free_ready_states,...m.free_exception_states]).size,12);
 assert.deepEqual(m.tablet_delta.surfaces,['Date Listing','Event Detail']);
 assert.equal(m.tablet_delta.cases,4);assert.equal(m.tablet_delta.viewport,'tablet-768x1024');
 assert.equal(m.atlas_extensions_requested.length,2);
 assert.equal(m.boundaries.new_archetype_wave,false);
 assert.equal(m.boundaries.penpot_mutations,0);
 assert.equal(m.boundaries.atlas_r2_mutated,false);
 assert.equal(m.boundaries.kaggle_used,false);
 assert.equal(m.boundaries.visual_acceptance,'PENDING_V0');
 assert.equal(m.boundaries.promotion_authorized,false);
 assert.match(m.commit_chain.lane1_free_rows_head,/^[0-9a-f]{40}$/);
 assert.match(m.commit_chain.lane2_free_full_page_head,/^[0-9a-f]{40}$/);
 assert.match(m.commit_chain.lane3_tablet_delta_head,/^[0-9a-f]{40}$/);
});
test('publication inventory proves exact remote file bytes',()=>{
 const inv=load('catalog/asp-production-conveyor-v3/a0/free-page-state-coverage-r1/publication-inventory.v1.json');
 assert.equal(inv.files.length,24);
 for(const item of inv.files){const b=bytes(item.path);assert.equal(b.length,item.bytes,item.path);assert.equal(sha(b),item.sha256,item.path);assert.equal(blob(b),item.git_blob_sha1,item.path)}
});
test('Lane 2 is anchored to exact Lane 1 head and tablet requests omit page_order',()=>{
 const m=load('catalog/asp-production-conveyor-v3/a0/free-page-state-coverage-r1/manifest.v1.json');
 const logical=load('catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2.logical-package.v1.json');
 const ready=load('catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2-READY.package.v1.json');
 const exc=load('catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2-EXCEPTION.package.v1.json');
 for(const x of [logical,ready,exc])record(x);
 assert.equal(logical.lane1_terminal_head,m.commit_chain.lane1_free_rows_head);
 assert.equal(ready.lane1_terminal_head,m.commit_chain.lane1_free_rows_head);
 assert.equal(exc.lane1_terminal_head,m.commit_chain.lane1_free_rows_head);
 assert.equal(ready.logical_package_record_sha256,logical.record_sha256);
 assert.equal(exc.logical_package_record_sha256,logical.record_sha256);
 for(const p of [
  'catalog/asp-production-conveyor-v3/a0/tablet-review-delta-r1/ASP_ATLAS_EXTENSION_REQUEST_V1.date-listing-tablet.json',
  'catalog/asp-production-conveyor-v3/a0/tablet-review-delta-r1/ASP_ATLAS_EXTENSION_REQUEST_V1.event-detail-tablet.json']){
   const r=load(p);record(r);assert.equal(hasKey(r,'page_order'),false);assert.equal(r.atlas_r2_mutation_by_a0,false)
 }
});
test('the frozen 18-unit wave and source adapters remain byte-identical',()=>{
 const units=fs.readdirSync(path.join(repo,'catalog/asp-production-conveyor-v3/a0/page-wave-v1/units')).filter(x=>x.endsWith('.json'));
 assert.equal(units.length,18);
 const exact={
  'catalog/asp-production-conveyor-v3/a0/archetype-wave-1-candidate-adapter.v1.json':'c6b66cc3919e54097b61b75b879f668db471ef48',
  'catalog/asp-production-conveyor-v3/a0/archetype-wave-2-candidate-adapter.v1.json':'7bf0d01b420e035e59c322e71ae9fc83856c2eb1',
  'catalog/asp-production-conveyor-v3/a0/date-listing-shell-candidate-adapter.v1.json':'20d6e95421da1ba9396b4e30f0f6af70465387fc',
  'catalog/asp-production-conveyor-v3/a0/owner-review-index-candidate-adapter.v1.json':'10902365d7ca04fbd973a59b86d0bc531bc30030'
 };
 for(const [p,h] of Object.entries(exact))assert.equal(blob(bytes(p)),h,p);
});
