
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_TEXT=fs.readFileSync(path.join(HERE,'manifest.v1.json'),'utf8');
const MANIFEST=JSON.parse(MANIFEST_TEXT);
const RECEIPT=JSON.parse(fs.readFileSync(path.join(HERE,'receipt.v1.json'),'utf8'));
const BUNDLE=fs.readFileSync(path.join(HERE,MANIFEST.bundle.filename),'utf8');
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');

let sequence=0;
class Shape{
  constructor(env,type='board',id=null){
    this.env=env;this.id=id||'shape-'+(++sequence);this.type=type;this.name='';this.x=0;this.y=0;this.width=0;this.height=0;
    this.children=[];this.fills=[];this.hidden=false;this.visible=true;this._data=new Map();this._component=null;this.characters='';
  }
  appendChild(child){child.parent=this;this.children.push(child);return child}
  resize(width,height){this.width=width;this.height=height}
  setSharedPluginData(ns,key,value){this._data.set(ns+'/'+key,String(value))}
  getSharedPluginData(ns,key){return this._data.get(ns+'/'+key)||''}
  component(){return this._component}
  isComponentCopyInstance(){return Boolean(this._component)}
  async export(){return new Uint8Array([1,3,3,7,9])}
}
class Page{
  constructor(env,id=null){this.env=env;this.id=id||'page-'+(++sequence);this.name='';this.root=new Shape(env,'root','root-'+this.id);this._data=new Map()}
  setSharedPluginData(ns,key,value){this._data.set(ns+'/'+key,String(value))}
  getSharedPluginData(ns,key){return this._data.get(ns+'/'+key)||''}
}
class Component{
  constructor(env,main){this.env=env;this.id='component-'+(++sequence);this._main=main;this.name='';this.path=''}
  mainInstance(){return this._main}
  instance(){this.env.penpot.__a0CreateCount++;const shape=new Shape(this.env,'board');shape._component=this;return shape}
}
function makeFake(){
  sequence=0;
  const env={};
  const localStorageMap=new Map();
  const currentFile={
    id:MANIFEST.target.file_id,pages:[],_data:new Map(),versions:[],
    getSharedPluginData(ns,key){return this._data.get(ns+'/'+key)||''},
    setSharedPluginData(ns,key,value){this._data.set(ns+'/'+key,String(value))},
    validate(){return []},
    async findVersions(){return this.versions},
    async saveVersion(label){const version={id:'version-'+(this.versions.length+1),label};this.versions.push(version);return version}
  };
  const components=[];
  const penpot={
    currentFile,currentPage:null,__a0CreateCount:0,
    localStorage:{getItem:key=>localStorageMap.get(key)||null,setItem:(key,value)=>localStorageMap.set(key,String(value))},
    history:{undoBlockBegin(){return 'undo'},undoBlockFinish(){}},
    library:{local:{components,createComponent(mains){penpot.__a0CreateCount++;const component=new Component(env,mains[0]);components.push(component);return component}}},
    createPage(){penpot.__a0CreateCount++;const page=new Page(env);currentFile.pages.push(page);return page},
    createBoard(){penpot.__a0CreateCount++;return new Shape(env,'board')},
    createText(characters){penpot.__a0CreateCount++;const text=new Shape(env,'text');text.characters=String(characters);return text},
    async openPage(page){penpot.currentPage=page}
  };
  env.penpot=penpot;
  const protectedPolicy=MANIFEST.protected_projections;
  const freePage=new Page(env,protectedPolicy.free.page_id);freePage.name='Protected Free';
  for(const id of protectedPolicy.free.root_ids){const root=new Shape(env,'board',id);root.name='Protected Free Root '+id;root.resize(100,100);freePage.root.appendChild(root)}
  const foundationPage=new Page(env,protectedPolicy.foundations.page_id);foundationPage.name='Protected Foundations';
  const foundationRoot=new Shape(env,'board',protectedPolicy.foundations.root_id);foundationRoot.name='Protected Foundations Root';foundationRoot.resize(100,100);foundationPage.root.appendChild(foundationRoot);
  for(let i=0;i<protectedPolicy.foundations.placements;i++){const placement=new Shape(env,'board','placement-'+i);placement.name='placement-'+i;placement.setSharedPluginData('kenigevents-f0-r3','placement-id','p'+i);foundationRoot.appendChild(placement)}
  currentFile.pages.push(freePage,foundationPage);
  if(MANIFEST.target.mode==='EXACT_EXISTING_ATLAS_PAGE'){
    const page=new Page(env,'atlas-target-page');page.name=MANIFEST.target.page_name;
    page.setSharedPluginData('kenigevents-atlas-v2','source-package-id',MANIFEST.atlas_binding.source_package_id);
    page.setSharedPluginData('kenigevents-atlas-v2','projection-role',MANIFEST.projection_role);
    currentFile.pages.push(page);
  }
  const run={...MANIFEST.run_control,state:'ACTIVE',cancelled:false};
  currentFile.setSharedPluginData('kenigevents','asp-active-run-v1',JSON.stringify(run));
  const dependencies={};
  for(const dep of MANIFEST.dependencies){
    const main=new Shape(env,'board','dependency-main-'+slug(dep.key));main.name=dep.semantic_id;
    const component=new Component(env,main);
    dependencies[dep.key]={...dep,component};
  }
  penpot.__a0CreateCount=0;
  return {penpot,dependencies,protected:{freePage,foundationPage,foundationRoot},env};
}
function slug(value){return String(value).replace(/[^A-Za-z0-9]+/g,'-')}

function loadApi(fake){
  const context=vm.createContext({
    console,Uint8Array,ArrayBuffer,TextEncoder:undefined,crypto:undefined,
    setTimeout:undefined,clearTimeout:undefined,
  });
  context.globalThis=context;
  vm.runInContext(BUNDLE,context,{filename:MANIFEST.bundle.filename,timeout:10000});
  assert.equal(vm.runInContext('typeof require',context),'undefined');
  assert.equal(vm.runInContext('typeof module',context),'undefined');
  assert.equal(vm.runInContext('typeof process',context),'undefined');
  assert.equal(vm.runInContext('typeof Buffer',context),'undefined');
  const api=context.KenigEventsA0DirectPluginBundles[MANIFEST.job_id];
  assert.ok(api);
  return api;
}
function allShapes(page){const out=[];const visit=s=>{out.push(s);for(const child of s.children||[])visit(child)};visit(page.root);return out}
function stableCount(page,nsSuffix,id){
  const ns='kenigevents-a0-direct-plugin-'+nsSuffix;
  return allShapes(page).filter(shape=>shape.getSharedPluginData(ns,'stable-id')===id).length;
}

test('package contract and portable bundle bytes',()=>{
  assert.equal(MANIFEST.state,'DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE');
  assert.equal(MANIFEST.factual_bytes_changed,0);
  assert.equal(MANIFEST.penpot_reads,0);
  assert.equal(MANIFEST.penpot_mutations,0);
  assert.equal(MANIFEST.runtime_shared_imports,0);
  assert.equal(MANIFEST.bundle.bytes,Buffer.byteLength(BUNDLE));
  assert.equal(MANIFEST.bundle.sha256,sha(BUNDLE));
  assert.equal(MANIFEST.bundle.git_blob_sha1,crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+Buffer.byteLength(BUNDLE)+'\0'),Buffer.from(BUNDLE)])).digest('hex'));
  const forbidden=[/\brequire\s*\(/,/\bimport\s*\(/,/\bmodule\.exports\b/,/\bexports\./,/\bprocess\./,/\bBuffer\b/,/\bcrypto\./,/\bnode:/,/fetch\s*\(/];
  for(const pattern of forbidden)assert.equal(pattern.test(BUNDLE),false,String(pattern));
  assert.equal(MANIFEST.limits.max_creates_per_invocation,3);
  assert.equal(MANIFEST.limits.second_terminal_replay_created,0);
  assert.equal(MANIFEST.deterministic_regeneration,'PASS');
  assert.equal(RECEIPT.manifest_sha256,sha(MANIFEST_TEXT));
  assert.ok(Object.values(RECEIPT.tests).every(value=>value==='PASS'));
});

test('exact source and fixture binding',()=>{
  for(const source of MANIFEST.sources){
    const bytes=fs.readFileSync(path.join(HERE,'sources',source.filename));
    assert.equal(bytes.length,source.bytes,source.name);
    assert.equal(sha(bytes),source.sha256,source.name);
    const blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
    assert.equal(blob,source.git_blob_sha1,source.name);
  }
  const fake=makeFake(),api=loadApi(fake);
  const inspection=api.inspect();
  assert.equal(inspection.source_package_record_sha256,MANIFEST.source_package_record_sha256);
  assert.equal(JSON.stringify(api.project().exact_tuple),JSON.stringify(MANIFEST.exact_tuple));
  assert.equal(JSON.stringify(api.project().dependency_specs),JSON.stringify(MANIFEST.dependencies));
});

test('browser Penpot-plugin sandbox direct callability and terminal replay',async()=>{
  const fake=makeFake(),api=loadApi(fake);
  const first=await api.execute({penpot:fake.penpot,dependencies:fake.dependencies});
  assert.equal(first.phase,'PAGE_ONLY');
  assert.ok(first.created===0||first.created===1);
  assert.equal(fake.penpot.currentPage.name,MANIFEST.target.page_name);
  const page=fake.penpot.currentPage;
  assert.equal(stableCount(page,MANIFEST.slug,MANIFEST.target.root_stable_id),0);
  const before=fake.penpot.__a0CreateCount;
  await assert.rejects(()=>api.execute({penpot:fake.penpot,dependencies:{}}),/DEPENDENCY_MISSING/);
  assert.equal(fake.penpot.__a0CreateCount,before);
  let terminal=null;
  for(let i=0;i<2000;i++){
    const result=await api.execute({penpot:fake.penpot,dependencies:fake.dependencies});
    assert.ok(result.created<=3);
    if(result.terminal){terminal=result;break}
  }
  assert.ok(terminal,'terminal execution was not reached');
  assert.equal(terminal.created,0);
  const terminalReplay=await api.execute({penpot:fake.penpot,dependencies:fake.dependencies});
  assert.equal(terminalReplay.terminal,true);
  assert.equal(terminalReplay.created,0);
  const settled=await api.settle({penpot:fake.penpot,dependencies:fake.dependencies});
  assert.equal(settled.created,0);
  assert.equal(settled.second_terminal_replay_created,0);
  const replay=await api.settle({penpot:fake.penpot,dependencies:fake.dependencies});
  assert.equal(replay.created,0);
  assert.equal(replay.second_terminal_replay_created,0);
});

test('protected projection drift fails closed before a create',async()=>{
  const fake=makeFake(),api=loadApi(fake);
  await api.execute({penpot:fake.penpot,dependencies:fake.dependencies});
  fake.protected.foundationRoot.name+=' drift';
  const before=fake.penpot.__a0CreateCount;
  await assert.rejects(()=>api.execute({penpot:fake.penpot,dependencies:fake.dependencies}),/PROTECTED_PROJECTION_DRIFT/);
  assert.equal(fake.penpot.__a0CreateCount,before);
});
