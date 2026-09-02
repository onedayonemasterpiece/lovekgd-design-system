import { SPEC, PACKAGE, EXECUTION_TUPLE, DECLARED_CHECKOUT } from './data.v1.mjs';

const NS = 'kenigevents-f0-medallions-institutions-a-r2';
const MAX_CREATES_PER_PHASE = 3;
const LOGICAL_PAGE_ID = 'medallions-institutions-a';
const PHYSICAL_PAGE_NAME = '04.1 · Assets · Medallions · Institutions A · Candidate';
const ROOT_ID = `${LOGICAL_PAGE_ID}.root`;
const REQUIRED_PROVENANCE = ['session_id','task_id','writer_id','package_head','triggered_by'];

function fail(code, detail=null, unknownOutcome=false) {
  const error = new Error(code);
  error.code = code;
  error.detail = detail;
  error.unknownOutcome = unknownOutcome;
  error.retryAllowed = false;
  throw error;
}
function invariant(ok, code, detail=null) { if (!ok) fail(code, detail); }
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key)=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
function sha256Portable(bytes) {
  const input = Array.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));
  const constants = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
  ];
  const hash=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const rotate=(value,count)=>(value>>>count)|(value<<(32-count));
  const padded=input.slice(), bitLow=(input.length<<3)>>>0, bitHigh=Math.floor(input.length/0x20000000)>>>0;
  padded.push(0x80); while(padded.length%64!==56)padded.push(0);
  for(let index=3;index>=0;index-=1)padded.push((bitHigh>>>(index*8))&255);
  for(let index=3;index>=0;index-=1)padded.push((bitLow>>>(index*8))&255);
  for(let offset=0;offset<padded.length;offset+=64){const words=new Array(64);for(let index=0;index<16;index+=1)words[index]=((padded[offset+index*4]<<24)|(padded[offset+index*4+1]<<16)|(padded[offset+index*4+2]<<8)|padded[offset+index*4+3])>>>0;for(let index=16;index<64;index+=1){const a=words[index-15],b=words[index-2],s0=rotate(a,7)^rotate(a,18)^(a>>>3),s1=rotate(b,17)^rotate(b,19)^(b>>>10);words[index]=(words[index-16]+s0+words[index-7]+s1)>>>0;}let[a,b,c,d,e,f,g,h]=hash;for(let index=0;index<64;index+=1){const s1=rotate(e,6)^rotate(e,11)^rotate(e,25),choice=(e&f)^((~e)&g),first=(h+s1+choice+constants[index]+words[index])>>>0,s0=rotate(a,2)^rotate(a,13)^rotate(a,22),majority=(a&b)^(a&c)^(b&c),second=(s0+majority)>>>0;h=g;g=f;f=e;e=(d+first)>>>0;d=c;c=b;b=a;a=(first+second)>>>0;}hash[0]=(hash[0]+a)>>>0;hash[1]=(hash[1]+b)>>>0;hash[2]=(hash[2]+c)>>>0;hash[3]=(hash[3]+d)>>>0;hash[4]=(hash[4]+e)>>>0;hash[5]=(hash[5]+f)>>>0;hash[6]=(hash[6]+g)>>>0;hash[7]=(hash[7]+h)>>>0;}
  return hash.map((part)=>part.toString(16).padStart(8,'0')).join('');
}
function utf8(text) {
  const out=[];
  for(const char of text){let code=char.codePointAt(0);if(code<=0x7f)out.push(code);else if(code<=0x7ff)out.push(0xc0|(code>>6),0x80|(code&0x3f));else if(code<=0xffff)out.push(0xe0|(code>>12),0x80|((code>>6)&0x3f),0x80|(code&0x3f));else out.push(0xf0|(code>>18),0x80|((code>>12)&0x3f),0x80|((code>>6)&0x3f),0x80|(code&0x3f));}
  return new Uint8Array(out);
}
function hashProjection(value){return sha256Portable(utf8(canonical(value)));}
function sharedGet(node,key){try{return String(node?.getSharedPluginData?.(NS,key)||'');}catch{return '';}}
function sharedSet(node,key,value){invariant(typeof value==='string','PLUGIN_DATA_VALUE_NOT_STRING',{key,type:typeof value});node.setSharedPluginData(NS,key,value);}
function children(page){return page?.findShapes?.()||[];}
function exactOne(rows,code){invariant(rows.length===1,code,{count:rows.length});return rows[0];}
function pageRows(penpot){return Array.from(penpot.currentFile?.pages||[]);}
function componentRows(penpot){return Array.from(penpot.library?.local?.components||[]);}
function mainOf(component){try{return component.mainInstance?.()||null;}catch{return null;}}
function resize(shape,width,height){shape.resize(width,height);}
function append(parent,shape){parent.appendChild(shape);return shape;}
function setGeometry(shape,{x,y,width,height,name}){shape.name=name;resize(shape,width,height);shape.x=x;shape.y=y;return shape;}
function mark(node,stableId,role,extra={}){sharedSet(node,'stable-id',stableId);sharedSet(node,'package-id',SPEC.package_id);sharedSet(node,'role',role);for(const[key,value]of Object.entries(extra))sharedSet(node,key,value);}

async function readActive(context,authorization){
  invariant(typeof context.readActiveMarker==='function','ACTIVE_MARKER_READER_REQUIRED');
  const marker=await context.readActiveMarker();
  invariant(marker&&marker.state==='ACTIVE'&&marker.cancel_requested===false,'ACTIVE_LEASE_NOT_ACTIVE',marker);
  for(const key of ['session_id','task_id','writer_id'])invariant(String(marker[key])===String(authorization.provenance[key]),'ACTIVE_LEASE_IDENTITY_DRIFT',{key,expected:authorization.provenance[key],actual:marker[key]});
  return marker;
}
function validateAuthorization(authorization,projection){
  invariant(authorization?.schema_version==='kenigevents.d0-bounded-native-authorization.v1','AUTH_SCHEMA_MISMATCH');
  invariant(authorization.package_id===SPEC.package_id&&/^[0-9a-f]{40}$/u.test(authorization.package_head),'AUTH_PACKAGE_MISMATCH');
  invariant(authorization.state==='ACTIVE'&&authorization.authorized===true&&authorization.cancel_requested===false,'AUTH_NOT_ACTIVE');
  invariant(Number.isInteger(authorization.revision)&&authorization.revision===projection.revision,'AUTH_REVISION_STALE');
  invariant(Number.isInteger(authorization.cursor)&&authorization.cursor===projection.cursor,'AUTH_CURSOR_STALE');
  invariant(authorization.projection_sha256===projection.projection_sha256,'AUTH_PROJECTION_STALE');
  invariant(authorization.max_creates===MAX_CREATES_PER_PHASE,'AUTH_CREATE_LIMIT_MISMATCH');
  invariant(authorization.provenance&&REQUIRED_PROVENANCE.every((key)=>typeof authorization.provenance[key]==='string'&&authorization.provenance[key]),'AUTH_PROVENANCE_INCOMPLETE');
  invariant(authorization.provenance.package_head===authorization.package_head,'AUTH_PROVENANCE_HEAD_MISMATCH');
}
async function readProtected(context){
  invariant(typeof context.readProtectedProjection==='function','PROTECTED_PROJECTION_READER_REQUIRED');
  const out={};
  for(const[key,expected]of Object.entries(SPEC.protected_projections)){const actual=await context.readProtectedProjection(expected.projection_id);invariant(actual===expected.sha256,'PROTECTED_PROJECTION_DRIFT',{key,expected:expected.sha256,actual});out[key]=actual;}
  return out;
}
function revisionOf(penpot){const value=Number(penpot.currentFile?.revn??penpot.currentFile?.revision);invariant(Number.isInteger(value),'CURRENT_REVISION_UNAVAILABLE');return value;}
function findPage(penpot){
  const byId=pageRows(penpot).filter((page)=>sharedGet(page,'atlas-page-id')===LOGICAL_PAGE_ID);
  if(byId.length)return exactOne(byId,'ATLAS_LOGICAL_PAGE_CARDINALITY');
  const byName=pageRows(penpot).filter((page)=>page.name===PHYSICAL_PAGE_NAME);
  invariant(byName.length<=1,'ATLAS_PHYSICAL_PAGE_CARDINALITY',{count:byName.length});
  return byName[0]||null;
}
function managedShapes(page){return children(page).filter((shape)=>sharedGet(shape,'package-id')===SPEC.package_id);}
function findShape(page,stableId){return managedShapes(page).filter((shape)=>sharedGet(shape,'stable-id')===stableId);}
function findComponent(penpot,stableId){return componentRows(penpot).filter((component)=>sharedGet(component,'stable-id')===stableId);}
function resolveHeaderMaster(penpot){return exactOne(componentRows(penpot).filter((component)=>sharedGet(component,'stable-id')==='ATLAS_PAGE_HEADER_V2'||component.name==='ATLAS_PAGE_HEADER_V2'),'ATLAS_HEADER_MASTER_CARDINALITY');}
function parentShape(page,stableId){return exactOne(findShape(page,stableId),'PARENT_SHAPE_CARDINALITY');}
function operationExists(penpot,page,operation){
  if(operation.kind==='page')return Boolean(page);
  if(!page)return false;
  if(operation.kind==='master')return findComponent(penpot,operation.id).length===1;
  return findShape(page,operation.id).length===1;
}
function assetStable(asset){return `component.${asset.semantic_id}`;}
function operations(){
  const out=[
    {kind:'page',id:LOGICAL_PAGE_ID,role:'atlas-page'},
    {kind:'board',id:ROOT_ID,role:'candidate-root'},
    {kind:'linked',id:`${LOGICAL_PAGE_ID}.header`,role:'atlas-header-instance'},
    {kind:'board',id:`${LOGICAL_PAGE_ID}.master-rail`,role:'package-owned-masters'},
    {kind:'board',id:`${LOGICAL_PAGE_ID}.dense-grid`,role:'linked-review-instances'},
  ];
  for(const asset of SPEC.assets){
    const master=assetStable(asset);
    out.push({kind:'master',id:master,role:'asset-master',asset});
    out.push({kind:'shape',id:`${master}.background`,role:'source-bound-medallion-background',asset});
    out.push({kind:'artwork',id:`${master}.artwork`,role:'source-artwork',asset});
    for(const tier of asset.tiers_px)out.push({kind:'linked',id:`${LOGICAL_PAGE_ID}.${asset.semantic_id}.tier-${tier}`,role:'linked-specimen',asset,tier});
  }
  invariant(out.length===53,'OPERATION_CENSUS_DRIFT',{count:out.length});
  return out;
}
const PLAN=Object.freeze(operations());
function exactAssetHandle(handle,asset){
  const expected=asset.source;
  invariant(handle?.verified===true,'ASSET_NOT_PROVIDER_VERIFIED',expected.path);
  for(const key of ['repository','ref','path','git_blob_sha1','sha256','media_type'])invariant(handle[key]===expected[key],'ASSET_IDENTITY_DRIFT',{path:expected.path,key});
  invariant(Number(handle.bytes)===Number(expected.bytes),'ASSET_BYTES_DRIFT',expected.path);
  invariant(handle.content_kind==='provider-verified-exact-bytes-v1','ASSET_CONTENT_KIND_DRIFT',expected.path);
  if(expected.media_type==='image/svg+xml')invariant(typeof handle.svg==='string'&&handle.svg.length>0,'ASSET_SVG_BYTES_MISSING',expected.path);
  else invariant(handle.data instanceof Uint8Array&&handle.data.byteLength===expected.bytes,'ASSET_BINARY_BYTES_MISSING',expected.path);
  return handle;
}
async function exactAsset(context,asset){invariant(context.assetCheckout&&typeof context.assetCheckout.readVerifiedAsset==='function','DECLARED_EXACT_ASSET_CHECKOUT_REQUIRED');invariant(DECLARED_CHECKOUT.assets.some((row)=>canonical(row)===canonical(asset.source)),'DECLARED_ASSET_NOT_FOUND',asset.source.path);return exactAssetHandle(await context.assetCheckout.readVerifiedAsset(asset.source),asset);}
async function ensureOpen(penpot,page){if(penpot.currentPage?.id!==page.id)await penpot.openPage(page);if(typeof penpot.__settle==='function')await penpot.__settle();invariant(penpot.currentPage?.id===page.id,'CURRENT_PAGE_ACTIVATION_FAILED',{page_id:page.id});}
function createComponent(penpot,shape){try{return penpot.library.local.createComponent([shape]);}catch(error){try{return penpot.library.local.createComponent(shape);}catch{throw error;}}}
function instanceOf(component){const shape=component.instance();invariant(shape,'LINKED_INSTANCE_CREATE_FAILED');return shape;}
function configureLinked(shape,component,operation,x,y,width,height,name){setGeometry(shape,{x,y,width,height,name});mark(shape,operation.id,operation.role,{'component-id':component.id,'semantic-slot':operation.role});}
async function createOperation(context,operation,index){
  const {penpot}=context;
  if(operation.kind==='page'){
    const page=penpot.createPage();page.name=PHYSICAL_PAGE_NAME;sharedSet(page,'atlas-page-id',LOGICAL_PAGE_ID);sharedSet(page,'package-id',SPEC.package_id);sharedSet(page,'atlas-source-package-id','F-MEDALLIONS-INSTITUTIONS-A');sharedSet(page,'template-id','FOUNDATION_ASSET_GRID_DENSE_V2');sharedSet(page,'projection-role','READY');sharedSet(page,'page-order','0090');sharedSet(page,'section','foundations-medallions');await ensureOpen(penpot,page);return;
  }
  const page=findPage(penpot);invariant(page,'TARGET_PAGE_MISSING_AFTER_CREATION');await ensureOpen(penpot,page);
  if(operation.id===ROOT_ID){const root=setGeometry(penpot.createBoard(),{x:0,y:0,width:2176,height:1160,name:`CANDIDATE_BUILD_NOT_ACCEPTED · ${SPEC.package_id}`});root.clipContent=false;mark(root,operation.id,operation.role,{'atlas-page-id':LOGICAL_PAGE_ID,'template-id':'FOUNDATION_ASSET_GRID_DENSE_V2','atlas-head':SPEC.atlas.commit,'atlas-tree':SPEC.atlas.tree});append(page.root,root);return;}
  if(operation.id===`${LOGICAL_PAGE_ID}.header`){const component=resolveHeaderMaster(penpot),shape=instanceOf(component);configureLinked(shape,component,operation,64,64,2048,128,`ATLAS_PAGE_HEADER_V2 · ${PHYSICAL_PAGE_NAME}`);mark(shape,operation.id,operation.role,{'semantic-slot':'page_header','page-title':PHYSICAL_PAGE_NAME});append(parentShape(page,ROOT_ID),shape);return;}
  if(operation.id===`${LOGICAL_PAGE_ID}.master-rail`){const rail=setGeometry(penpot.createBoard(),{x:64,y:256,width:320,height:840,name:'Package-owned masters · exact source-bound institutions-a'});rail.clipContent=false;mark(rail,operation.id,operation.role,{'semantic-slot':'package_owned_masters','consumer-group':'institutions-a'});append(parentShape(page,ROOT_ID),rail);return;}
  if(operation.id===`${LOGICAL_PAGE_ID}.dense-grid`){const grid=setGeometry(penpot.createBoard(),{x:416,y:256,width:1696,height:840,name:'Atlas R2 DENSE linked review instances'});grid.clipContent=false;mark(grid,operation.id,operation.role,{'semantic-slot':'linked_review_instances','columns':'6','column-gap':'24','row-gap':'24','cell-policy':'DENSE_V2'});append(parentShape(page,ROOT_ID),grid);return;}
  const asset=operation.asset, assetIndex=SPEC.assets.findIndex((item)=>item.semantic_id===asset.semantic_id), masterId=assetStable(asset);
  if(operation.kind==='master'){
    const rail=parentShape(page,`${LOGICAL_PAGE_ID}.master-rail`),main=setGeometry(penpot.createBoard(),{x:72,y:264+assetIndex*104,width:96,height:96,name:`Medallion/${asset.short_name}`});main.clipContent=true;mark(main,masterId,'asset-master-main',{'semantic-id':asset.semantic_id,'binding-id':asset.binding_id,'source-sha256':asset.source.sha256});append(rail,main);const component=createComponent(penpot,main);component.name=`Medallion/${asset.short_name}`;component.path='KenigEvents / Medallions / Institutions A';mark(component,masterId,'asset-master',{'semantic-id':asset.semantic_id,'binding-id':asset.binding_id,'source-sha256':asset.source.sha256});return;
  }
  const component=exactOne(findComponent(penpot,masterId),'ASSET_MASTER_CARDINALITY'),main=mainOf(component);invariant(main,'ASSET_MASTER_MAIN_MISSING');
  if(operation.kind==='shape'){
    const shape=asset.presentation.background===asset.presentation.ring?penpot.createEllipse():penpot.createEllipse();setGeometry(shape,{x:main.x,y:main.y,width:96,height:96,name:`${asset.short_name} · background`});shape.fills=[{fillColor:asset.presentation.background}];shape.strokes=[{strokeColor:asset.presentation.ring,strokeWidth:2}];mark(shape,operation.id,operation.role,{'source-bound':'true'});append(main,shape);return;
  }
  if(operation.kind==='artwork'){
    const handle=await exactAsset(context,asset);let shape;
    if(asset.source.media_type==='image/svg+xml'){shape=penpot.createShapeFromSvg(handle.svg);invariant(shape,'SVG_IMPORT_RETURNED_NULL',asset.source.path);}
    else{const image=await penpot.uploadMediaData(`${asset.semantic_id}-${asset.source.sha256.slice(0,12)}`,handle.data,asset.source.media_type);invariant(image,'IMAGE_UPLOAD_RETURNED_NULL',asset.source.path);shape=penpot.createRectangle();shape.fills=[{fillOpacity:1,fillImage:image}];}
    setGeometry(shape,{x:main.x+8,y:main.y+8,width:80,height:80,name:`${asset.short_name} · exact source artwork`});mark(shape,operation.id,operation.role,{'source-path':asset.source.path,'source-ref':asset.source.ref,'source-git-blob':asset.source.git_blob_sha1,'source-sha256':asset.source.sha256,'source-bytes':String(asset.source.bytes),'source-media-type':asset.source.media_type});append(main,shape);return;
  }
  const tierIndex=asset.tiers_px.indexOf(operation.tier),order=assetIndex*3+tierIndex,col=order%6,row=Math.floor(order/6),cellWidth=(1696-5*24)/6,cellHeight=(840-3*24)/4;
  const shape=instanceOf(component);configureLinked(shape,component,operation,416+col*(cellWidth+24)+(cellWidth-operation.tier)/2,256+row*(cellHeight+24)+(cellHeight-operation.tier)/2,operation.tier,operation.tier,`${asset.semantic_id}/tier-${operation.tier}`);mark(shape,operation.id,operation.role,{'semantic-slot':'linked_review_instances','semantic-id':asset.semantic_id,'tier-px':String(operation.tier),'linked-order':String(order+1),'source-sha256':asset.source.sha256});append(parentShape(page,`${LOGICAL_PAGE_ID}.dense-grid`),shape);
}
function inventory(penpot,page){
  if(!page)return{managed_ids:[],roles:{},components:[],detached:0,screenshot_shapes:0};
  const shapes=managedShapes(page),roles={};for(const shape of shapes){const role=sharedGet(shape,'role');roles[role]=(roles[role]||0)+1;}
  const components=componentRows(penpot).filter((component)=>sharedGet(component,'package-id')===SPEC.package_id);
  const componentIds=new Set(components.map((component)=>component.id));
  const linked=shapes.filter((shape)=>['atlas-header-instance','master-preview','linked-specimen'].includes(sharedGet(shape,'role')));
  const detached=linked.filter((shape)=>!componentIds.has(sharedGet(shape,'component-id'))&&sharedGet(shape,'role')!=='atlas-header-instance').length;
  return{managed_ids:shapes.map((shape)=>sharedGet(shape,'stable-id')).filter(Boolean).sort(),roles,components:components.map((component)=>({id:component.id,stable_id:sharedGet(component,'stable-id'),main_id:mainOf(component)?.id||null})).sort((a,b)=>a.stable_id.localeCompare(b.stable_id)),detached,screenshot_shapes:shapes.filter((shape)=>sharedGet(shape,'implementation')==='screenshot').length};
}
export async function projectMedallionsInstitutionsAR2Native(context){
  const {penpot}=context||{};invariant(penpot?.currentFile&&penpot?.library?.local,'PENPOT_NATIVE_CONTEXT_REQUIRED');
  const protectedProjection=await readProtected(context),page=findPage(penpot);if(page)invariant(sharedGet(page,'atlas-page-id')===LOGICAL_PAGE_ID,'UNBOUND_EXISTING_PHYSICAL_PAGE',{page_id:page.id,page_name:page.name});
  if(page)for(const operation of PLAN.filter((row)=>row.kind==='master')){const mainRows=findShape(page,operation.id),componentRowsForId=findComponent(penpot,operation.id);invariant(mainRows.length===componentRowsForId.length,'PARTIAL_COMPONENT_MASTER_UNKNOWN_OUTCOME',{stable_id:operation.id,main_shapes:mainRows.length,components:componentRowsForId.length});}
  const present=PLAN.map((operation)=>operationExists(penpot,page,operation));
  let cursor=present.indexOf(false);if(cursor<0)cursor=PLAN.length;invariant(present.slice(cursor).every((value)=>value===false),'NON_CONTIGUOUS_PARTIAL_STATE',{cursor,present});
  if(page)await ensureOpen(penpot,page);
  const state={schema_version:'kenigevents.f0-medallions-institutions-a-native-projection.v2',package_id:SPEC.package_id,source_parent_head:'03188ef9ad579ae24ffba87b6a15e65a567a4869',atlas:{logical_page_id:LOGICAL_PAGE_ID,physical_page_name:PHYSICAL_PAGE_NAME,template_id:SPEC.page.template_id,semantic_slots:['page_header','package_owned_masters','linked_review_instances']},revision:revisionOf(penpot),page_id:page?.id||null,current_page_id:penpot.currentPage?.id||null,cursor,total_operations:PLAN.length,complete:cursor===PLAN.length,inventory:inventory(penpot,page),protected:protectedProjection,mutation_in_flight:false,penpot_mutations:0};
  return{...state,projection_sha256:hashProjection(state)};
}
export async function executeMedallionsInstitutionsAR2NativePhase(context,authorization){
  const before=await projectMedallionsInstitutionsAR2Native(context);validateAuthorization(authorization,before);await readActive(context,authorization);
  let created=0,lastIndex=before.cursor-1;
  try{
    for(let index=before.cursor;index<PLAN.length&&created<MAX_CREATES_PER_PHASE;index+=1){await readActive(context,authorization);await createOperation(context,PLAN[index],index);created+=1;lastIndex=index;const page=findPage(context.penpot);invariant(operationExists(context.penpot,page,PLAN[index]),'CREATE_NOT_READ_BACK',{index,id:PLAN[index].id});}
  }catch(error){let readback=null,readbackError=null;try{readback=await projectMedallionsInstitutionsAR2Native(context);}catch(projectError){readbackError={code:projectError.code||'PROJECTION_FAILED',detail:projectError.detail||null};}error.unknownOutcome=created>0||Boolean(readback&&(readback.cursor!==before.cursor||readback.revision!==before.revision))||Boolean(readbackError);error.retryAllowed=false;error.requiredNextOperation='DISTINCT_READ_ONLY_PROJECTION';error.readback=readback;error.readbackError=readbackError;throw error;}
  const after=await projectMedallionsInstitutionsAR2Native(context);invariant(after.cursor===before.cursor+created,'RESUME_CURSOR_DRIFT',{before:before.cursor,created,after:after.cursor,lastIndex});invariant(canonical(before.protected)===canonical(after.protected),'PROTECTED_PROJECTION_CHANGED');invariant(after.inventory.detached===0&&after.inventory.screenshot_shapes===0,'NATIVE_NEGATIVE_GATE_FAILED',after.inventory);
  const validation=typeof context.validate==='function'?await context.validate():fail('PENPOT_VALIDATION_READER_REQUIRED');invariant(Array.isArray(validation)&&validation.length===0,'PENPOT_VALIDATION_FAILED',validation);
  return{schema_version:'kenigevents.f0-medallions-institutions-a-native-phase-result.v2',package_id:SPEC.package_id,package_head:authorization.package_head,state:after.complete?(created===0?'REPLAY_ZERO_CREATED':'COMPLETE_PENDING_DISTINCT_READBACK'):'IN_PROGRESS',revision_before:before.revision,revision_after:after.revision,cursor_before:before.cursor,cursor_after:after.cursor,created,max_creates:MAX_CREATES_PER_PHASE,projection_before:before.projection_sha256,projection_after:after.projection_sha256,protected_before:before.protected,protected_after:after.protected,validation,provenance:authorization.provenance,unknown_outcome:false,retry_allowed:false,next_operation:after.complete?'DISTINCT_LATER_READBACK':'AUTHORIZE_NEXT_EXACT_PROJECTION'};
}
export async function readMedallionsInstitutionsAR2Settlement(context,receipt){
  invariant(receipt?.state==='COMPLETE_PENDING_DISTINCT_READBACK'||receipt?.state==='REPLAY_ZERO_CREATED','SETTLEMENT_RECEIPT_REQUIRED');
  const projection=await projectMedallionsInstitutionsAR2Native(context);invariant(projection.complete&&projection.cursor===53,'SETTLEMENT_INCOMPLETE',projection.cursor);invariant(projection.inventory.roles['asset-master-main']===8&&projection.inventory.roles['source-artwork']===8&&!projection.inventory.roles['master-preview']&&projection.inventory.roles['linked-specimen']===24,'TERMINAL_CENSUS_DRIFT',projection.inventory.roles);invariant(projection.inventory.detached===0&&projection.inventory.screenshot_shapes===0,'SETTLEMENT_NEGATIVE_GATE_FAILED');const validation=typeof context.validate==='function'?await context.validate():fail('PENPOT_VALIDATION_READER_REQUIRED');invariant(Array.isArray(validation)&&validation.length===0,'PENPOT_VALIDATION_FAILED',validation);return{state:'MEDALLIONS_INSTITUTIONS_A_READBACK_PASS_PENDING_V0',created:0,cursor:53,components:8,source_artworks:8,master_surfaces:8,linked_instances:24,detached:0,screenshot_shapes:0,validation,projection_sha256:projection.projection_sha256,protected:projection.protected,penpot_mutations:0};
}
export const MEDALLIONS_INSTITUTIONS_A_NATIVE_RUNTIME=Object.freeze({NS,MAX_CREATES_PER_PHASE,LOGICAL_PAGE_ID,PHYSICAL_PAGE_NAME,ROOT_ID,PLAN,projectMedallionsInstitutionsAR2Native,executeMedallionsInstitutionsAR2NativePhase,readMedallionsInstitutionsAR2Settlement});
globalThis.KenigeventsMedallionsInstitutionsAR2Native=MEDALLIONS_INSTITUTIONS_A_NATIVE_RUNTIME;
