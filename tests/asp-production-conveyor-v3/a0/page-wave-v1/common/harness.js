'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function sha256(bytes){return crypto.createHash('sha256').update(bytes).digest('hex');}
function canonical(value){
  if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
  if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map((key)=>JSON.stringify(key)+':'+canonical(value[key])).join(',')+'}';
  return JSON.stringify(value);
}
let serial=0;
class Shared {
  constructor(){this._shared=new Map();}
  setSharedPluginData(namespace,key,value){this._shared.set(`${namespace}:${key}`,String(value));}
  getSharedPluginData(namespace,key){return this._shared.get(`${namespace}:${key}`)||'';}
}
class Shape extends Shared {
  constructor(type='board',id=null){super();this.id=id||`shape-${++serial}`;this.name='';this.type=type;this.x=0;this.y=0;this.width=100;this.height=100;this.hidden=false;this.visible=true;this.fills=[];this.children=[];this._component=null;this._isInstance=false;}
  appendChild(child){child.parent=this;this.children.push(child);}
  resize(width,height){this.width=width;this.height=height;}
  component(){return this._component;}
  isComponentCopyInstance(){return this._isInstance;}
  async export(){return new Uint8Array([137,80,78,71,13,10,26,10,1,2,3,4]);}
}
class Component extends Shared {
  constructor(main,id=null){super();this.id=id||`component-${++serial}`;this.name='';this.path='';this._main=main;main._component=this;}
  mainInstance(){return this._main;}
  instance(){const instance=new Shape('board');instance._component=this;instance._isInstance=true;instance.width=this._main.width;instance.height=this._main.height;instance.fills=JSON.parse(JSON.stringify(this._main.fills||[]));return instance;}
}
class Page extends Shared {
  constructor(id=null){super();this.id=id||`page-${++serial}`;this.name='';this.root=new Shape('root',`${this.id}-root`);}
}
class LocalLibrary {
  constructor(){this.components=[];}
  createComponent(shapes){assert.equal(shapes.length,1);const component=new Component(shapes[0]);this.components.push(component);return component;}
}
class CurrentFile extends Shared {
  constructor(id){super();this.id=id;this.pages=[];this.revn=113;this.versions=[];}
  validate(){return [];}
  async saveVersion(label){const version={id:`version-${++serial}`,label};this.versions.push(version);this.revn+=1;return version;}
  async findVersions(){return this.versions;}
}
class FakePenpot {
  constructor(config){
    this.currentFile=new CurrentFile(config.fileId);
    this.library={local:new LocalLibrary()};
    this.history={undoBlockBegin:()=>({}),undoBlockFinish:()=>{}};
    this.currentPage=null;
  }
  createPage(){const page=new Page();this.currentFile.pages.push(page);this.currentPage=page;return page;}
  createBoard(){return new Shape('board');}
  async openPage(page){this.currentPage=page;}
}
function dummyComponent(){
  const main=new Shape('board');main.name='Protected/Dummy';
  const component=new Component(main);component.name='Dummy';component.path='Protected';
  return component;
}
function makeProtectedEnvironment(config){
  serial=0;
  const penpot=new FakePenpot(config);
  const free=new Page(config.protected.free.page_id);free.name='Protected Free Collection';
  for(const id of config.protected.free.root_ids){const root=new Shape('board',id);root.name=`protected-free-${id}`;root.resize(640,480);free.root.appendChild(root);}
  penpot.currentFile.pages.push(free);
  const foundations=new Page(config.protected.foundations.page_id);foundations.name='Protected Foundations';
  const froot=new Shape('board',config.protected.foundations.root_id);froot.name='protected-foundations-index';froot.resize(1200,900);
  const dummy=dummyComponent();penpot.library.local.components.push(dummy);
  for(let i=0;i<config.protected.foundations.placements;i++){const placement=dummy.instance();placement.name=`foundation-placement-${i}`;placement.setSharedPluginData('kenigevents-f0-r3','placement-id',`p-${i}`);placement.x=i*3;placement.y=i*2;froot.appendChild(placement);}
  foundations.root.appendChild(froot);penpot.currentFile.pages.push(foundations);
  const sourceIndex=new Page('protected-source-index');sourceIndex.name='Protected Source Index';
  const sourceRoot=new Shape('board','protected-source-index-root');sourceRoot.name='source-index';sourceRoot.resize(320,240);sourceIndex.root.appendChild(sourceRoot);penpot.currentFile.pages.push(sourceIndex);
  return {penpot,storage:{},free,foundations,froot};
}
async function frozenForTest(executor,env){
  const skeleton=JSON.parse(JSON.stringify(executor.CONFIG.protected));
  const projection=await executor.pwFrozenProjection(env.penpot,skeleton,false);
  skeleton.free.chars=projection.free.chars;skeleton.free.utf8_bytes=projection.free.utf8_bytes;skeleton.free.sha256=projection.free.sha256;
  skeleton.foundations.chars=projection.foundations.chars;skeleton.foundations.utf8_bytes=projection.foundations.utf8_bytes;skeleton.foundations.sha256=projection.foundations.sha256;
  return skeleton;
}
async function expectReject(fn,pattern){
  let error=null;try{await fn();}catch(caught){error=caught;}
  assert.ok(error,`expected rejection ${pattern}`);
  assert.match(String(error.message||error),pattern);
}
async function complete(executor,setup,config){
  const env=makeProtectedEnvironment(config);
  const frozen=await frozenForTest(executor,env);
  setup.setupUnit(env);
  let result=null;
  const partial=[];
  for(let i=0;i<80;i++){
    result=await executor.runUnitTest(env,frozen);
    partial.push(result);
    assert.ok((result.created??0)<=3,'max three managed creations');
    if(result.terminalState==='CANDIDATE_READBACK_VERIFIED_PENDING_V0')break;
  }
  assert.equal(result?.terminalState,'CANDIDATE_READBACK_VERIFIED_PENDING_V0');
  return {env,frozen,result,partial};
}
async function runUnitContract({repoRoot,packagePath}){
  const packageBytes=fs.readFileSync(path.join(repoRoot,packagePath));
  const pkg=JSON.parse(packageBytes.toString('utf8'));
  const executorPath=path.join(repoRoot,pkg.artifacts.executor.path);
  const setupPath=path.join(repoRoot,pkg.artifacts.setup.path);
  const executor=require(executorPath);
  const setup=require(setupPath);
  const executorBytes=fs.readFileSync(executorPath);
  const setupBytes=fs.readFileSync(setupPath);
  assert.equal(pkg.schema_version,'kenigevents.asp-penpot-page-wave-unit.v1');
  assert.equal(pkg.state,'MAT_PACKAGE_READY_QA_INTEGRATE_GATED');
  assert.equal(pkg.penpot_execution_authorized,false);
  assert.equal(pkg.visual_acceptance,'PENDING_V0');
  assert.equal(pkg.promotion_authorized,false);
  assert.equal(pkg.page_contract.candidate_roots,1);
  assert.equal(pkg.page_contract.desktop_mobile_side_by_side,true);
  assert.ok(pkg.limits.component_families<=3);
  assert.ok(pkg.limits.managed_nodes<=30);
  assert.equal(pkg.limits.max_managed_creations_per_invocation,3);
  assert.ok(executorBytes.length<=65000);
  assert.equal(sha256(executorBytes),pkg.artifacts.executor.sha256);
  assert.equal(setup.SETUP_CONFIG.executorSha256,pkg.artifacts.executor.sha256);
  assert.equal(setup.SETUP_CONFIG.packageSha256,sha256(packageBytes));
  const packageCore={...pkg};delete packageCore.package_record_sha256;
  assert.equal(sha256(Buffer.from(canonical(packageCore))),pkg.package_record_sha256);
  assert.equal(executor.CONFIG.sourceAdapter.gitBlobSha1,pkg.source_adapter.git_blob_sha1);
  assert.equal(executor.CONFIG.sourceUnitDigest,pkg.source_unit_digest);
  assert.deepEqual(executor.CONFIG.protected,pkg.protected_projections);
  assert.equal(executor.CONFIG.dependencies.f0ActionNav.package.sha256,pkg.dependencies.exact_current.f0_action_nav.package.sha256);
  assert.equal(executor.CONFIG.dependencies.u0Controls.head,pkg.dependencies.exact_current.u0_controls.head);
  const done=await complete(executor,setup,executor.CONFIG);
  assert.equal(done.result.created,0);assert.equal(done.result.secondRunCreated,0);
  assert.equal(done.result.counts.roots,1);assert.equal(done.result.counts.components,2);assert.equal(done.result.counts.linkedInstances,2);
  assert.equal(done.result.counts.detached,0);assert.equal(done.result.counts.screenshots,0);
  assert.ok(done.result.export.nonempty&&done.result.export.bytes>0);
  const replay=await executor.runUnitTest(done.env,done.frozen);
  assert.equal(replay.created,0);assert.equal(replay.secondRunCreated,0);
  const stale=makeProtectedEnvironment(executor.CONFIG);const staleFrozen=await frozenForTest(executor,stale);setup.setupUnit(stale);stale.storage[executor.CONFIG.storage.binding].package_sha256='0'.repeat(64);
  await expectReject(()=>executor.runUnitTest(stale,staleFrozen),/ARTIFACT_BINDING_MISMATCH/);
  const cancelled=makeProtectedEnvironment(executor.CONFIG);const cancelledFrozen=await frozenForTest(executor,cancelled);setup.setupUnit(cancelled);const marker=JSON.parse(cancelled.penpot.currentFile.getSharedPluginData('kenigevents','asp-active-run-v1'));marker.cancelled=true;cancelled.penpot.currentFile.setSharedPluginData('kenigevents','asp-active-run-v1',JSON.stringify(marker));
  await expectReject(()=>executor.runUnitTest(cancelled,cancelledFrozen),/CANCELLED_OR_INACTIVE_LEASE/);
  const drift=makeProtectedEnvironment(executor.CONFIG);const driftFrozen=await frozenForTest(executor,drift);setup.setupUnit(drift);await executor.runUnitTest(drift,driftFrozen);drift.free.root.children[0].name='drifted';
  await expectReject(()=>executor.runUnitTest(drift,driftFrozen),/FROZEN_FREE_PROJECTION_DRIFT/);
  const duplicate=makeProtectedEnvironment(executor.CONFIG);const duplicateFrozen=await frozenForTest(executor,duplicate);const p1=duplicate.penpot.createPage();p1.name=executor.CONFIG.pageName;const p2=duplicate.penpot.createPage();p2.name=executor.CONFIG.pageName;setup.setupUnit(duplicate);
  await expectReject(()=>executor.runUnitTest(duplicate,duplicateFrozen),/DUPLICATE_PAGE/);
  const screenshot=await complete(executor,setup,executor.CONFIG);const screenPage=screenshot.env.penpot.currentFile.pages.find((page)=>page.name===executor.CONFIG.pageName);const image=new Shape('image');screenPage.root.appendChild(image);
  await expectReject(()=>executor.runUnitTest(screenshot.env,screenshot.frozen),/SCREENSHOT_IMPLEMENTATION/);
  const detached=await complete(executor,setup,executor.CONFIG);const detachedPage=detached.env.penpot.currentFile.pages.find((page)=>page.name===executor.CONFIG.pageName);const detachedRoot=detachedPage.root.children.find((shape)=>shape.getSharedPluginData(executor.CONFIG.namespace,'stable-id')==='root');const detachedInstance=detachedRoot.children.find((shape)=>shape.getSharedPluginData(executor.CONFIG.namespace,'stable-id')==='instance/desktop');detachedInstance._component=null;
  await expectReject(()=>executor.runUnitTest(detached.env,detached.frozen),/DETACHED_INSTANCE/);
  const dupInstance=await complete(executor,setup,executor.CONFIG);const dupPage=dupInstance.env.penpot.currentFile.pages.find((page)=>page.name===executor.CONFIG.pageName);const dupRoot=dupPage.root.children.find((shape)=>shape.getSharedPluginData(executor.CONFIG.namespace,'stable-id')==='root');const original=dupRoot.children.find((shape)=>shape.getSharedPluginData(executor.CONFIG.namespace,'stable-id')==='instance/mobile');const extra=original.component().instance();extra.setSharedPluginData(executor.CONFIG.namespace,'stable-id','instance/mobile');dupRoot.appendChild(extra);
  await expectReject(()=>executor.runUnitTest(dupInstance.env,dupInstance.frozen),/(?:INSTANCE_CENSUS_DRIFT|DUPLICATE_INSTANCE)/);
  return {unit_id:pkg.unit_id,package_sha256:sha256(packageBytes),executor_sha256:sha256(executorBytes),setup_sha256:sha256(setupBytes),executor_bytes:executorBytes.length,managed_nodes:pkg.limits.managed_nodes,checks:29};
}
module.exports={runUnitContract};
