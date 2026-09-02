import test from 'node:test';
import assert from 'node:assert/strict';
import { SPEC, PACKAGE, DECLARED_CHECKOUT } from './data.v1.mjs';
import { MEDALLIONS_INSTITUTIONS_A_NATIVE_RUNTIME as R } from './penpot-runtime.v2.mjs';

let nextId=1;
class Shared { constructor(){this.shared=new Map();} setSharedPluginData(ns,key,value){assert.equal(typeof value,'string');this.shared.set(`${ns}:${key}`,value);} getSharedPluginData(ns,key){return this.shared.get(`${ns}:${key}`)||'';} }
class Shape extends Shared { constructor(type){super();this.id=`shape-${nextId++}`;this.type=type;this.children=[];this.parent=null;this.name='';this.x=0;this.y=0;this.width=0;this.height=0;} resize(w,h){this.width=w;this.height=h;} appendChild(shape){shape.parent=this;this.children.push(shape);} }
function deep(root){const out=[];for(const child of root.children){out.push(child,...deep(child));}return out;}
class Page extends Shared { constructor(){super();this.id=`page-${nextId++}`;this.name='';this.root=new Shape('root');} findShapes(){return deep(this.root);} }
class Component extends Shared { constructor(main){super();this.id=`component-${nextId++}`;this.name='';this.path='';this.main=main;} mainInstance(){return this.main;} instance(){const shape=new Shape('component-instance');shape.sourceComponentId=this.id;return shape;} }
class FakePenpot {
  constructor(){
    this.currentFile={id:'40e06342-8830-80d6-8008-8fc8a3a4cd4f',revn:180,pages:[]};this.currentPage=null;this.opened=[];this.mutationLog=[];
    const headerMain=new Shape('board'),header=new Component(headerMain);header.name='ATLAS_PAGE_HEADER_V2';header.setSharedPluginData(R.NS,'stable-id','ATLAS_PAGE_HEADER_V2');
    const components=[header];
    this.library={local:{components,createComponent:(value)=>{const main=Array.isArray(value)?value[0]:value,component=new Component(main);components.push(component);this.mutationLog.push(['component',component.id]);return component;}}};
  }
  createPage(){const page=new Page();this.currentFile.pages.push(page);this.mutationLog.push(['page',page.id]);return page;}
  async openPage(page){this.currentPage=page;this.opened.push(page.id);this.mutationLog.push(['open',page.id]);}
  createBoard(){const value=new Shape('board');this.mutationLog.push(['board',value.id]);return value;}
  createEllipse(){const value=new Shape('ellipse');this.mutationLog.push(['ellipse',value.id]);return value;}
  createRectangle(){const value=new Shape('rectangle');this.mutationLog.push(['rectangle',value.id]);return value;}
  createShapeFromSvg(svg){assert.match(svg,/^<svg/u);const value=new Shape('svg');this.mutationLog.push(['svg',value.id]);return value;}
  async uploadMediaData(name,data,mime){assert.ok(name&&data instanceof Uint8Array&&mime==='image/webp');return{id:`image-${nextId++}`};}
  async __settle(){}
}
function assetHandle(descriptor){return{...descriptor,verified:true,content_kind:'provider-verified-exact-bytes-v1',...(descriptor.media_type==='image/svg+xml'?{svg:'<svg viewBox="0 0 10 10"><path d="M0 0h10v10z"/></svg>'}:{data:new Uint8Array(descriptor.bytes)})};}
function context(){
  const penpot=new FakePenpot(),active={state:'ACTIVE',cancel_requested:false,session_id:'session-morning',task_id:'task-m05',writer_id:'sole-publish'};
  return{penpot,active,assetCheckout:{async readVerifiedAsset(descriptor){return assetHandle(descriptor);}},async readActiveMarker(){return{...active};},async readProtectedProjection(id){return Object.values(SPEC.protected_projections).find((row)=>row.projection_id===id).sha256;},async validate(){return[];}};
}
function authorization(projection){const packageHead='aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';return{schema_version:'kenigevents.d0-bounded-native-authorization.v1',package_id:SPEC.package_id,package_head:packageHead,state:'ACTIVE',authorized:true,cancel_requested:false,revision:projection.revision,cursor:projection.cursor,projection_sha256:projection.projection_sha256,max_creates:3,provenance:{session_id:'session-morning',task_id:'task-m05',writer_id:'sole-publish',package_head:packageHead,triggered_by:'D0_MORNING_PRODUCTION_SHIFT'}};}
async function complete(ctx){const receipts=[];for(let phase=0;phase<32;phase+=1){const projection=await R.projectMedallionsInstitutionsAR2Native(ctx);const receipt=await R.executeMedallionsInstitutionsAR2NativePhase(ctx,authorization(projection));receipts.push(receipt);assert.ok(receipt.created<=3);if(receipt.state==='COMPLETE_PENDING_DISTINCT_READBACK')return receipts;}throw new Error('did not complete');}

test('exact Atlas R2 logical/physical binding and immutable eight-asset identities',()=>{
  assert.equal(R.LOGICAL_PAGE_ID,'medallions-institutions-a');assert.equal(R.PHYSICAL_PAGE_NAME,'04.1 · Assets · Medallions · Institutions A · Candidate');
  assert.equal(SPEC.page.template_id,'FOUNDATION_ASSET_GRID_DENSE_V2');assert.deepEqual(SPEC.page.semantic_slots,{header:'page_header',master_column:'package_owned_masters',review_grid:'linked_review_instances'});
  assert.equal(SPEC.assets.length,8);assert.equal(DECLARED_CHECKOUT.assets.length,8);for(const asset of SPEC.assets)assert.ok(DECLARED_CHECKOUT.assets.some((row)=>JSON.stringify(row)===JSON.stringify(asset.source)));
});

test('plan is package-local 53 creates with 8 masters and exactly 24 linked specimens, never 8 extra preview instances',()=>{
  assert.equal(R.PLAN.length,53);assert.equal(R.PLAN.filter((row)=>row.kind==='master').length,8);assert.equal(R.PLAN.filter((row)=>row.role==='linked-specimen').length,24);assert.equal(R.PLAN.filter((row)=>row.role==='master-preview').length,0);
});

test('each authorized native phase creates at most three and opens exact page before geometry',async()=>{
  const ctx=context(),receipts=await complete(ctx);assert.ok(receipts.length>1);assert.ok(receipts.every((row)=>row.created<=3));assert.equal(receipts.reduce((sum,row)=>sum+row.created,0),53);const page=ctx.penpot.currentFile.pages[0];assert.equal(ctx.penpot.currentPage.id,page.id);assert.ok(ctx.penpot.opened.length>=1);assert.equal(page.name,R.PHYSICAL_PAGE_NAME);assert.ok(ctx.penpot.mutationLog.findIndex((row)=>row[0]==='open')<ctx.penpot.mutationLog.findIndex((row)=>row[0]==='board'));
});

test('terminal census is 8 masters / 8 exact artworks / 24 linked specimens with protected projections and validation empty',async()=>{
  const ctx=context(),receipts=await complete(ctx),settled=await R.readMedallionsInstitutionsAR2Settlement(ctx,receipts.at(-1));assert.equal(settled.cursor,53);assert.equal(settled.components,8);assert.equal(settled.source_artworks,8);assert.equal(settled.master_surfaces,8);assert.equal(settled.linked_instances,24);assert.equal(settled.detached,0);assert.equal(settled.screenshot_shapes,0);assert.deepEqual(settled.validation,[]);
});

test('replay after completion is exact created=0',async()=>{const ctx=context();await complete(ctx);const p=await R.projectMedallionsInstitutionsAR2Native(ctx),receipt=await R.executeMedallionsInstitutionsAR2NativePhase(ctx,authorization(p));assert.equal(receipt.state,'REPLAY_ZERO_CREATED');assert.equal(receipt.created,0);assert.equal(receipt.cursor_before,53);assert.equal(receipt.cursor_after,53);});

test('stale cursor, cancelled lease and protected drift fail closed before create',async()=>{
  let ctx=context(),p=await R.projectMedallionsInstitutionsAR2Native(ctx),a=authorization(p);a.cursor=1;await assert.rejects(()=>R.executeMedallionsInstitutionsAR2NativePhase(ctx,a),(error)=>error.code==='AUTH_CURSOR_STALE');
  ctx=context();p=await R.projectMedallionsInstitutionsAR2Native(ctx);a=authorization(p);ctx.active.cancel_requested=true;ctx.active.state='CANCEL_REQUESTED';await assert.rejects(()=>R.executeMedallionsInstitutionsAR2NativePhase(ctx,a),(error)=>error.code==='ACTIVE_LEASE_NOT_ACTIVE');
  ctx=context();ctx.readProtectedProjection=async()=> 'drift';await assert.rejects(()=>R.projectMedallionsInstitutionsAR2Native(ctx),(error)=>error.code==='PROTECTED_PROJECTION_DRIFT');
});

test('unknown outcome forces distinct read-only projection and forbids blind retry',async()=>{
  const ctx=context(),p=await R.projectMedallionsInstitutionsAR2Native(ctx),a=authorization(p),base=ctx.penpot.createBoard.bind(ctx.penpot);let calls=0;ctx.penpot.createBoard=()=>{calls+=1;if(calls===1)throw new Error('injected failure');return base();};
  await assert.rejects(()=>R.executeMedallionsInstitutionsAR2NativePhase(ctx,a),(error)=>{assert.equal(error.unknownOutcome,true);assert.equal(error.retryAllowed,false);assert.equal(error.requiredNextOperation,'DISTINCT_READ_ONLY_PROJECTION');assert.equal(error.readback.cursor,1);return true;});
});

test('all plugin data values are exact strings',async()=>{const ctx=context();await complete(ctx);for(const page of ctx.penpot.currentFile.pages){for(const value of page.shared.values())assert.equal(typeof value,'string');for(const shape of page.findShapes())for(const value of shape.shared.values())assert.equal(typeof value,'string');}for(const component of ctx.penpot.library.local.components)for(const value of component.shared.values())assert.equal(typeof value,'string');});
