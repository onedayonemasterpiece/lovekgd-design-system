'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {runTabletReviewDeltaR1,canonical}=require('../../../../scripts/asp-production-conveyor-v3/a0/tablet-review-delta-r1/tablet_review_native_executor_r1.js');
const {setupTabletReviewDeltaR1}=require('../../../../scripts/asp-production-conveyor-v3/a0/tablet-review-delta-r1/setup_tablet_review_delta_r1.js');

let seq=0;
class Shared{constructor(){this.data=new Map()}setSharedPluginData(n,k,v){this.data.set(`${n}:${k}`,String(v))}getSharedPluginData(n,k){return this.data.get(`${n}:${k}`)||''}}
class Shape extends Shared{constructor(type='board',id=null){super();this.id=id||`s${++seq}`;this.type=type;this.name='';this.width=100;this.height=100;this.children=[];this.fills=[];this._component=null;this._instance=false}appendChild(x){x.parent=this;this.children.push(x)}resize(w,h){this.width=w;this.height=h}component(){return this._component}isComponentCopyInstance(){return this._instance}async export(){return new Uint8Array([137,80,78,71,9])}}
class Component{constructor(id){this.id=id}instance(){const x=new Shape;x._component=this;x._instance=true;return x}}
class Page extends Shared{constructor(name){super();this.id=`p${++seq}`;this.name=name;this.root=new Shape('root',`${this.id}-root`)}}
class File extends Shared{constructor(){super();this.id='40e06342-8830-80d6-8008-8fc8a3a4cd4f'}validate(){return[]}}
class Penpot{constructor(){this.currentFile=new File;this.history={undoBlockBegin:()=>({}),undoBlockFinish:()=>{}}}createBoard(){return new Shape}}
const repo=path.resolve(__dirname,'../../../..');
const load=x=>JSON.parse(fs.readFileSync(path.join(repo,x),'utf8'));
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const datePath='catalog/asp-production-conveyor-v3/a0/tablet-review-delta-r1/date-listing-tablet.package.v1.json';
const eventPath='catalog/asp-production-conveyor-v3/a0/tablet-review-delta-r1/event-detail-tablet.package.v1.json';
const deltaPath='catalog/asp-production-conveyor-v3/a0/tablet-review-delta-r1/A0-TABLET-REVIEW-DELTA-R1.package.v1.json';
const dateReqPath='catalog/asp-production-conveyor-v3/a0/tablet-review-delta-r1/ASP_ATLAS_EXTENSION_REQUEST_V1.date-listing-tablet.json';
const eventReqPath='catalog/asp-production-conveyor-v3/a0/tablet-review-delta-r1/ASP_ATLAS_EXTENSION_REQUEST_V1.event-detail-tablet.json';
function recalc(x){const c=JSON.parse(JSON.stringify(x));delete c.record_sha256;x.record_sha256=hash(canonical(c));return x}
function extensionReceipt(unit){return{schema_version:'kenigevents.asp-atlas-extension-receipt.v1',request_id:unit.atlas_extension_request.request_id,request_record_sha256:unit.atlas_extension_request.record_sha256,approved:true}}
function environment(unit){
  seq=0;const penpot=new Penpot,targetPage=new Page(unit.atlas_lookup.physical_page_name);
  targetPage.setSharedPluginData('kenigevents-atlas-v2','source-package-id',unit.atlas_lookup.source_package_id);
  targetPage.setSharedPluginData('kenigevents-atlas-v2','projection-role',unit.atlas_lookup.projection_role);
  const existing=new Shape('board','existing');existing.name='Existing desktop/mobile page content';targetPage.root.appendChild(existing);
  const dependencies={};
  for(const b of unit.component_bindings)dependencies[b.semantic_id]={semantic_id:b.semantic_id,source_contract_blob:unit.source_page_unit.git_blob_sha1,component:new Component(b.semantic_id)};
  return{unit,penpot,targetPage,dependencies,storage:{},existing,extensionReceipt:extensionReceipt(unit)}
}
async function rejects(fn,re){let e;try{await fn()}catch(x){e=x}assert.ok(e,`expected ${re}`);assert.match(String(e.message||e),re)}
async function complete(x){await setupTabletReviewDeltaR1(x.unit,x);let out;for(let i=0;i<180;i++){out=await runTabletReviewDeltaR1(x.unit,x);assert.ok((out.created||0)<=3);if(out.terminal_state==='MAT_PACKAGE_READY_QA_INTEGRATE_GATED')return out}throw new Error('terminal not reached')}

test('A0 tablet judgment includes only exact production-manifest-required surfaces',()=>{
  const delta=load(deltaPath),date=load(datePath),event=load(eventPath),dateReq=load(dateReqPath),eventReq=load(eventReqPath);
  for(const x of [delta,date,event,dateReq,eventReq]){const c=JSON.parse(JSON.stringify(x));delete c.record_sha256;assert.equal(hash(canonical(c)),x.record_sha256)}
  assert.deepEqual(delta.judgment.tablet_required_surfaces,['Date Listing','Event Detail']);
  assert.deepEqual(delta.judgment.other_surfaces_added,[]);
  assert.equal(delta.tablet_cases,4);
  for(const req of [dateReq,eventReq]){
    assert.equal(Object.prototype.hasOwnProperty.call(req,'page_order'),false);
    assert.equal(req.atlas_r2_mutation_by_a0,false);
    assert.equal(req.requested_extension.viewport.id,'tablet-768x1024');
  }
  assert.ok([...date.scenarios,...event.scenarios].every(s=>s.viewport.width===768&&s.viewport.height===1024));
});

test('Date and Event Detail tablet factual routes/states are exact',()=>{
  const date=load(datePath),event=load(eventPath);
  assert.equal(date.scenarios[0].route,'/segodnya/');
  assert.deepEqual(date.scenarios[0].fixture_ids,['event.real.4240']);
  assert.equal(date.scenarios[0].projection.sha256,'2bc98e1a727ab3936912950a0e087232d4dbcf7bfa601ff7da95a231855b6b58');
  assert.deepEqual(event.scenarios.map(x=>x.state),['wide-image','narrow-image','no-image']);
  assert.deepEqual(event.scenarios.map(x=>x.contract_state),['wide-image','portrait-image','no-image']);
  assert.deepEqual(event.scenarios.map(x=>x.route),[
    '/sobytiya/drevnie-voiny-yantarnogo-kraya-kaliningrad-698/',
    '/sobytiya/vystavka-donbass-proshloe-i-nastoyaschee-kaliningrad-2601/',
    '/sobytiya/nauka-vsegda-kstati-progulka-s-uchenym-kaliningrad-6996/'
  ]);
  assert.ok(event.scenarios.every(x=>x.golden_corpus_membership==='NOT_ASSERTED'));
  assert.equal(event.route_registry_mutation,false);
});

test('Date and Event Detail tablet units execute independently and replay created=0',async()=>{
  for(const p of [datePath,eventPath]){
    const x=environment(load(p)),out=await complete(x);
    assert.equal(out.created,0);
    assert.equal((await runTabletReviewDeltaR1(x.unit,x)).created,0);
    assert.equal(x.existing.name,'Existing desktop/mobile page content');
  }
});

test('Tablet executor rejects viewport, route/component, extension, lease and topology drift',async()=>{
  const viewport=environment(load(datePath));viewport.unit.scenarios[0].viewport.width=769;viewport.unit.scenario_contract_sha256=hash(canonical(viewport.unit.scenarios));recalc(viewport.unit);await setupTabletReviewDeltaR1(viewport.unit,viewport);await rejects(()=>runTabletReviewDeltaR1(viewport.unit,viewport),/TABLET_VIEWPORT_DRIFT/);

  const extra=environment(load(eventPath));extra.unit.scenarios.push(JSON.parse(JSON.stringify(extra.unit.scenarios[0])));extra.unit.scenarios[3].scenario_id='invented';extra.unit.scenarios[3].route='/invented/';recalc(extra.unit);await setupTabletReviewDeltaR1(extra.unit,extra);await rejects(()=>runTabletReviewDeltaR1(extra.unit,extra),/SCENARIO_CONTRACT_DRIFT/);

  const missing=environment(load(eventPath));delete missing.dependencies['event.media-frame'];await setupTabletReviewDeltaR1(missing.unit,missing);await rejects(()=>runTabletReviewDeltaR1(missing.unit,missing),/DEPENDENCY_MISSING:event.media-frame/);

  const staleExt=environment(load(datePath));staleExt.extensionReceipt.request_record_sha256='0'.repeat(64);await rejects(()=>setupTabletReviewDeltaR1(staleExt.unit,staleExt),/ATLAS_EXTENSION_NOT_APPROVED/);

  const order=environment(load(datePath));order.extensionReceipt.page_order='0240';await rejects(()=>setupTabletReviewDeltaR1(order.unit,order),/ATLAS_EXTENSION_NOT_APPROVED/);

  const cancelled=environment(load(datePath));await setupTabletReviewDeltaR1(cancelled.unit,cancelled);const m=JSON.parse(cancelled.penpot.currentFile.getSharedPluginData('kenigevents','asp-active-run-v1'));m.cancelled=true;cancelled.penpot.currentFile.setSharedPluginData('kenigevents','asp-active-run-v1',JSON.stringify(m));await rejects(()=>runTabletReviewDeltaR1(cancelled.unit,cancelled),/CANCELLED_OR_INACTIVE_LEASE/);

  const screenshot=environment(load(datePath));await complete(screenshot);const root=screenshot.targetPage.root.children.find(x=>x.getSharedPluginData('kenigevents-a0-tablet-review-delta-r1','stable-id')===screenshot.unit.target.root_semantic_id);root.appendChild(new Shape('image'));await rejects(()=>runTabletReviewDeltaR1(screenshot.unit,screenshot),/SCREENSHOT_IMPLEMENTATION/);

  const drift=environment(load(datePath));await setupTabletReviewDeltaR1(drift.unit,drift);await runTabletReviewDeltaR1(drift.unit,drift);drift.existing.name='drift';await rejects(()=>runTabletReviewDeltaR1(drift.unit,drift),/PROTECTED_PROJECTION_DRIFT/);
});
