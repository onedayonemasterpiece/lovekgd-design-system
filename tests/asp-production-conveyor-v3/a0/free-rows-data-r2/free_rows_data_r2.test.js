'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {runFreeRowsDataR2, canonical} = require('../../../../scripts/asp-production-conveyor-v3/a0/free-rows-data-r2/free_rows_native_executor_r2.js');
const {setupFreeRowsDataR2} = require('../../../../scripts/asp-production-conveyor-v3/a0/free-rows-data-r2/setup_free_rows_data_r2.js');

let seq = 0;
class Shared {
  constructor(){ this.data = new Map(); }
  setSharedPluginData(ns,k,v){ this.data.set(`${ns}:${k}`, String(v)); }
  getSharedPluginData(ns,k){ return this.data.get(`${ns}:${k}`) || ''; }
}
class Shape extends Shared {
  constructor(type='board', id=null){
    super(); this.id=id || `s${++seq}`; this.type=type; this.name=''; this.width=100; this.height=100;
    this.children=[]; this.fills=[]; this._component=null; this._instance=false;
  }
  appendChild(x){ x.parent=this; this.children.push(x); }
  resize(w,h){ this.width=w; this.height=h; }
  component(){ return this._component; }
  isComponentCopyInstance(){ return this._instance; }
  async export(){ return new Uint8Array([137,80,78,71,1,2,3]); }
}
class Component {
  constructor(id){ this.id=id; }
  instance(){ const s=new Shape('board'); s._component=this; s._instance=true; return s; }
}
class Page extends Shared {
  constructor(name){ super(); this.id=`p${++seq}`; this.name=name; this.root=new Shape('root',`${this.id}-root`); }
}
class CurrentFile extends Shared {
  constructor(){ super(); this.id='40e06342-8830-80d6-8008-8fc8a3a4cd4f'; }
  validate(){ return []; }
}
class Penpot {
  constructor(){ this.currentFile=new CurrentFile(); this.history={undoBlockBegin:()=>({}),undoBlockFinish:()=>{}}; }
  createBoard(){ return new Shape('board'); }
}
const root = path.resolve(__dirname, '../../../..');
const pkgPath = path.join(root, 'catalog/asp-production-conveyor-v3/a0/free-rows-data-r2/A-FREE-ROWS-DATA-R2.package.v1.json');
const loadPkg = () => JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const digest = x => crypto.createHash('sha256').update(x).digest('hex');

function environment(pkg=loadPkg()){
  seq=0;
  const penpot=new Penpot();
  const targetPage=new Page(pkg.atlas_binding.physical_page_name);
  targetPage.setSharedPluginData('kenigevents-atlas-v2','source-package-id',pkg.atlas_binding.source_package_id);
  targetPage.setSharedPluginData('kenigevents-atlas-v2','projection-role','READY');
  const existing=new Shape('board','protected-existing');
  existing.name='Protected existing Free collection';
  targetPage.root.appendChild(existing);
  const dependencies={
    event_card:{
      package_id:pkg.dependency_gates.event_card.package_id,
      remote_head:pkg.dependency_gates.event_card.remote_head,
      git_blob_sha1:pkg.dependency_gates.event_card.git_blob_sha1,
      semantic_id:pkg.dependency_gates.event_card.semantic_id,
      component:new Component('event-card-component')
    },
    medallion:{
      package_id:pkg.dependency_gates.medallion.package_id,
      remote_head:pkg.dependency_gates.medallion.remote_head,
      git_blob_sha1:pkg.dependency_gates.medallion.git_blob_sha1,
      semantic_id:pkg.dependency_gates.medallion.semantic_id,
      component:new Component('free-medallion-component')
    }
  };
  return {pkg,penpot,targetPage,dependencies,storage:{},existing};
}
async function expectReject(fn, pattern){
  let error;
  try{ await fn(); }catch(e){ error=e; }
  assert.ok(error, `expected ${pattern}`);
  assert.match(String(error.message||error), pattern);
}
async function complete(env){
  await setupFreeRowsDataR2(env.pkg, env);
  let result;
  for(let i=0;i<30;i++){
    result=await runFreeRowsDataR2(env.pkg,env);
    assert.ok((result.created||0)<=3);
    if(result.terminal_state==='MAT_PACKAGE_READY_QA_INTEGRATE_GATED') return result;
  }
  throw new Error('did not reach terminal');
}

test('A-FREE-ROWS-DATA-R2 exact factual package and native replay', async()=>{
  const env=environment();
  const clone=JSON.parse(JSON.stringify(env.pkg)); delete clone.record_sha256;
  assert.equal(digest(canonical(clone)),env.pkg.record_sha256);
  assert.deepEqual(env.pkg.fixture_order,['event.real.2182','event.real.6711','event.real.7609','event.real.8006','event.real.8200']);
  assert.deepEqual(env.pkg.render_order,['event.real.8006','event.real.8200','event.real.2182','event.real.6711','event.real.7609']);
  assert.deepEqual(env.pkg.rows.map(x=>x.count),[2,3]);
  assert.equal(env.pkg.runtime_fixture_discovery,false);
  const result=await complete(env);
  assert.deepEqual(result.fixture_input_order,env.pkg.fixture_order);
  assert.deepEqual(result.rendered_row_order,env.pkg.render_order);
  assert.equal(result.created,0);
  assert.equal((await runFreeRowsDataR2(env.pkg,env)).created,0);
  assert.equal(env.existing.name,'Protected existing Free collection');
});

test('A-FREE-ROWS-DATA-R2 negatives are fail closed before substitution', async()=>{
  const order=environment();
  order.pkg.fixture_order=[...order.pkg.fixture_order].reverse();
  await expectReject(()=>setupFreeRowsDataR2(order.pkg,order),/PACKAGE_RECORD_MISMATCH/);

  const discovery=environment();
  discovery.pkg.runtime_fixture_discovery=true;
  const d=JSON.parse(JSON.stringify(discovery.pkg)); delete d.record_sha256;
  discovery.pkg.record_sha256=digest(canonical(d));
  await setupFreeRowsDataR2(discovery.pkg,discovery);
  await expectReject(()=>runFreeRowsDataR2(discovery.pkg,discovery),/RUNTIME_FIXTURE_DISCOVERY_FORBIDDEN/);

  const missing=environment();
  delete missing.dependencies.event_card;
  await setupFreeRowsDataR2(missing.pkg,missing);
  await expectReject(()=>runFreeRowsDataR2(missing.pkg,missing),/DEPENDENCY_MISSING:event_card/);

  const stale=environment();
  stale.dependencies.medallion.remote_head='0'.repeat(40);
  await setupFreeRowsDataR2(stale.pkg,stale);
  await expectReject(()=>runFreeRowsDataR2(stale.pkg,stale),/DEPENDENCY_STALE_OR_WRONG:medallion/);

  const wrongAtlas=environment();
  wrongAtlas.targetPage.setSharedPluginData('kenigevents-atlas-v2','projection-role','EXCEPTION');
  await setupFreeRowsDataR2(wrongAtlas.pkg,wrongAtlas);
  await expectReject(()=>runFreeRowsDataR2(wrongAtlas.pkg,wrongAtlas),/ATLAS_READY_BINDING_MISMATCH/);

  const cancelled=environment();
  await setupFreeRowsDataR2(cancelled.pkg,cancelled);
  const marker=JSON.parse(cancelled.penpot.currentFile.getSharedPluginData('kenigevents','asp-active-run-v1'));
  marker.cancelled=true;
  cancelled.penpot.currentFile.setSharedPluginData('kenigevents','asp-active-run-v1',JSON.stringify(marker));
  await expectReject(()=>runFreeRowsDataR2(cancelled.pkg,cancelled),/CANCELLED_OR_INACTIVE_LEASE/);
});

test('A-FREE-ROWS-DATA-R2 detects duplicate, screenshot and protected drift', async()=>{
  const duplicate=environment();
  await setupFreeRowsDataR2(duplicate.pkg,duplicate);
  await runFreeRowsDataR2(duplicate.pkg,duplicate); // baseline
  const a=new Shape(),b=new Shape();
  for(const x of [a,b]){
    x.setSharedPluginData('kenigevents-a0-free-rows-data-r2','stable-id',duplicate.pkg.target.root_semantic_id);
    x.setSharedPluginData('kenigevents-a0-free-rows-data-r2','managed','true');
    duplicate.targetPage.root.appendChild(x);
  }
  await expectReject(()=>runFreeRowsDataR2(duplicate.pkg,duplicate),/DUPLICATE_MANAGED_SEMANTIC_ID/);

  const screenshot=environment();
  await complete(screenshot);
  const rootShape=screenshot.targetPage.root.children.find(x=>x.getSharedPluginData('kenigevents-a0-free-rows-data-r2','stable-id')===screenshot.pkg.target.root_semantic_id);
  rootShape.appendChild(new Shape('image'));
  await expectReject(()=>runFreeRowsDataR2(screenshot.pkg,screenshot),/SCREENSHOT_IMPLEMENTATION/);

  const drift=environment();
  await setupFreeRowsDataR2(drift.pkg,drift);
  await runFreeRowsDataR2(drift.pkg,drift);
  drift.existing.name='drift';
  await expectReject(()=>runFreeRowsDataR2(drift.pkg,drift),/PROTECTED_PROJECTION_DRIFT/);
});
