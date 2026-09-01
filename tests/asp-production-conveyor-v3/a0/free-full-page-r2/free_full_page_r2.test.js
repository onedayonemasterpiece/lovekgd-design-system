'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {runFreeFullPageR2,canonical}=require('../../../../scripts/asp-production-conveyor-v3/a0/free-full-page-r2/free_full_page_native_executor_r2.js');
const {setupFreeFullPageR2}=require('../../../../scripts/asp-production-conveyor-v3/a0/free-full-page-r2/setup_free_full_page_r2.js');

let seq=0;
class Shared{constructor(){this.data=new Map()}setSharedPluginData(n,k,v){this.data.set(`${n}:${k}`,String(v))}getSharedPluginData(n,k){return this.data.get(`${n}:${k}`)||''}}
class Shape extends Shared{constructor(type='board',id=null){super();this.id=id||`s${++seq}`;this.type=type;this.name='';this.width=100;this.height=100;this.children=[];this.fills=[];this._component=null;this._instance=false}appendChild(x){x.parent=this;this.children.push(x)}resize(w,h){this.width=w;this.height=h}component(){return this._component}isComponentCopyInstance(){return this._instance}async export(){return new Uint8Array([137,80,78,71,7])}}
class Component{constructor(id){this.id=id}instance(){const x=new Shape();x._component=this;x._instance=true;return x}}
class Page extends Shared{constructor(name){super();this.id=`p${++seq}`;this.name=name;this.root=new Shape('root',`${this.id}-root`)}}
class File extends Shared{constructor(){super();this.id='40e06342-8830-80d6-8008-8fc8a3a4cd4f'}validate(){return[]}}
class Penpot{constructor(){this.currentFile=new File;this.history={undoBlockBegin:()=>({}),undoBlockFinish:()=>{}}}createBoard(){return new Shape}}
const repo=path.resolve(__dirname,'../../../..');
const load=x=>JSON.parse(fs.readFileSync(path.join(repo,x),'utf8'));
const logicalPath='catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2.logical-package.v1.json';
const readyPath='catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2-READY.package.v1.json';
const exceptionPath='catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2-EXCEPTION.package.v1.json';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function recalc(x){const c=JSON.parse(JSON.stringify(x));delete c.record_sha256;x.record_sha256=hash(canonical(c));return x}
function env(unit,logical=load(logicalPath)){
  seq=0;const penpot=new Penpot,targetPage=new Page(unit.atlas_binding.physical_page_name);
  targetPage.setSharedPluginData('kenigevents-atlas-v2','source-package-id',unit.atlas_binding.source_package_id);
  targetPage.setSharedPluginData('kenigevents-atlas-v2','projection-role',unit.projection_role);
  const protectedExisting=new Shape('board','existing');protectedExisting.name=`existing-${unit.projection_role}`;targetPage.root.appendChild(protectedExisting);
  const dependencies={
    event_card:{...unit.dependency_gates.event_card,component:new Component('event-card')},
    free_shell:{...unit.dependency_gates.free_shell,component:new Component('free-shell')},
    brand:{...unit.dependency_gates.brand,component:new Component('brand')},
  };
  return{unit,logical,penpot,targetPage,dependencies,storage:{},protectedExisting}
}
async function rejects(fn,re){let e;try{await fn()}catch(x){e=x}assert.ok(e,`expected ${re}`);assert.match(String(e.message||e),re)}
async function complete(x){await setupFreeFullPageR2(x.unit,x.logical,x);let out;for(let i=0;i<120;i++){out=await runFreeFullPageR2(x.unit,x.logical,x);assert.ok((out.created||0)<=3);if(out.terminal_state==='MAT_PACKAGE_READY_QA_INTEGRATE_GATED')return out}throw new Error('terminal not reached')}

test('A-FREE-FULL-PAGE-R2 partitions all READY and EXCEPTION states exactly once',()=>{
  const logical=load(logicalPath),ready=load(readyPath),exception=load(exceptionPath);
  const c=JSON.parse(JSON.stringify(logical));delete c.record_sha256;assert.equal(hash(canonical(c)),logical.record_sha256);
  for(const unit of [ready,exception]){const x=JSON.parse(JSON.stringify(unit));delete x.record_sha256;assert.equal(hash(canonical(x)),unit.record_sha256);assert.equal(unit.logical_package_record_sha256,logical.record_sha256);assert.equal(unit.lane1_terminal_head,logical.lane1_terminal_head)}
  const ids=[...ready.states,...exception.states].map(x=>x.scenario_id);
  assert.equal(ids.length,12);assert.equal(new Set(ids).size,12);
  assert.deepEqual(ready.states.map(x=>x.state),['top','top','scrolled','scrolled','full','full']);
  assert.deepEqual(exception.states.map(x=>x.state),['loading','loading','empty','empty','error','error']);
  assert.ok(ready.states.every(x=>x.rendered_fixture_ids.length===5));
  assert.ok(exception.states.every(x=>x.rendered_fixture_ids.length===0));
  assert.ok([...ready.states,...exception.states].every(x=>JSON.stringify(x.factual_fixture_order)===JSON.stringify(logical.factual_fixture_order)));
});

test('READY and EXCEPTION are independently executable with terminal replay created=0',async()=>{
  for(const p of [readyPath,exceptionPath]){
    const unit=load(p),x=env(unit),out=await complete(x);
    assert.equal(out.projection_role,unit.projection_role);
    assert.equal(out.created,0);
    assert.equal((await runFreeFullPageR2(x.unit,x.logical,x)).created,0);
    assert.equal(x.protectedExisting.name,`existing-${unit.projection_role}`);
  }
});

test('Lane 2 rejects stale Lane 1/logical/dependency and wrong Atlas role',async()=>{
  const staleHead=env(load(readyPath));staleHead.unit.lane1_terminal_head='0'.repeat(40);recalc(staleHead.unit);await setupFreeFullPageR2(staleHead.unit,staleHead.logical,staleHead);await rejects(()=>runFreeFullPageR2(staleHead.unit,staleHead.logical,staleHead),/LANE1_HEAD_BINDING_MISMATCH/);
  const logicalDrift=env(load(readyPath));logicalDrift.unit.logical_package_record_sha256='0'.repeat(64);recalc(logicalDrift.unit);await rejects(()=>setupFreeFullPageR2(logicalDrift.unit,logicalDrift.logical,logicalDrift),/LOGICAL_PACKAGE_BINDING_MISMATCH/);
  const dep=env(load(readyPath));dep.dependencies.free_shell.remote_head='0'.repeat(40);await setupFreeFullPageR2(dep.unit,dep.logical,dep);await rejects(()=>runFreeFullPageR2(dep.unit,dep.logical,dep),/DEPENDENCY_STALE_OR_WRONG:free_shell/);
  const atlas=env(load(readyPath));atlas.targetPage.setSharedPluginData('kenigevents-atlas-v2','projection-role','EXCEPTION');await setupFreeFullPageR2(atlas.unit,atlas.logical,atlas);await rejects(()=>runFreeFullPageR2(atlas.unit,atlas.logical,atlas),/ATLAS_PROJECTION_ROLE_MISMATCH/);
});

test('Lane 2 rejects cancelled lease, duplicate, screenshot and protected drift',async()=>{
  const cancelled=env(load(exceptionPath));await setupFreeFullPageR2(cancelled.unit,cancelled.logical,cancelled);const m=JSON.parse(cancelled.penpot.currentFile.getSharedPluginData('kenigevents','asp-active-run-v1'));m.cancelled=true;cancelled.penpot.currentFile.setSharedPluginData('kenigevents','asp-active-run-v1',JSON.stringify(m));await rejects(()=>runFreeFullPageR2(cancelled.unit,cancelled.logical,cancelled),/CANCELLED_OR_INACTIVE_LEASE/);
  const dup=env(load(readyPath));await setupFreeFullPageR2(dup.unit,dup.logical,dup);await runFreeFullPageR2(dup.unit,dup.logical,dup);for(let i=0;i<2;i++){const x=new Shape;x.setSharedPluginData('kenigevents-a0-free-full-page-r2','stable-id',dup.unit.target.root_semantic_id);x.setSharedPluginData('kenigevents-a0-free-full-page-r2','managed','true');dup.targetPage.root.appendChild(x)}await rejects(()=>runFreeFullPageR2(dup.unit,dup.logical,dup),/DUPLICATE_MANAGED_SEMANTIC_ID/);
  const screenshot=env(load(exceptionPath));await complete(screenshot);const rootShape=screenshot.targetPage.root.children.find(x=>x.getSharedPluginData('kenigevents-a0-free-full-page-r2','stable-id')===screenshot.unit.target.root_semantic_id);rootShape.appendChild(new Shape('image'));await rejects(()=>runFreeFullPageR2(screenshot.unit,screenshot.logical,screenshot),/SCREENSHOT_IMPLEMENTATION/);
  const drift=env(load(readyPath));await setupFreeFullPageR2(drift.unit,drift.logical,drift);await runFreeFullPageR2(drift.unit,drift.logical,drift);drift.protectedExisting.name='changed';await rejects(()=>runFreeFullPageR2(drift.unit,drift.logical,drift),/PROTECTED_PROJECTION_DRIFT/);
});
