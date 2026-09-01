'use strict';

/* Concrete native tablet-review executor. Atlas R2 itself is immutable:
 * execution requires a separately approved ASP_ATLAS_EXTENSION_REQUEST_V1 receipt.
 */
const NS='kenigevents-a0-tablet-review-delta-r1';
function fail(c,d=''){throw new Error(d?`${c}:${d}`:c)}
function ok(v,c,d=''){if(!v)fail(c,d)}
function kids(x){return Array.from(x?.children||[])}
function walk(x){return x?[x,...kids(x).flatMap(walk)]:[]}
function canonical(v){if(Array.isArray(v))return`[${v.map(canonical).join(',')}]`;if(v&&typeof v==='object')return`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`;return JSON.stringify(v)}
async function sha(t){const b=new TextEncoder().encode(t),d=await globalThis.crypto.subtle.digest('SHA-256',b);return Array.from(new Uint8Array(d),x=>x.toString(16).padStart(2,'0')).join('')}
async function record(x){const c=JSON.parse(JSON.stringify(x)),e=c.record_sha256;delete c.record_sha256;ok(e&&await sha(canonical(c))===e,'PACKAGE_RECORD_MISMATCH')}
function get(x,k){return x?.getSharedPluginData?.(NS,k)||''}
function tag(x,k,v){x.setSharedPluginData(NS,k,String(v))}
function stable(page,id){return walk(page.root).filter(x=>get(x,'stable-id')===id)}
function shapeProjection(x){return{id:x.id,name:x.name||'',type:x.type||'',width:x.width||0,height:x.height||0,children:kids(x).map(shapeProjection)}}
async function protectedProjection(page){return sha(canonical(kids(page.root).filter(x=>!get(x,'managed')).map(shapeProjection)))}
function active(unit,penpot,storage){
  let a;try{a=JSON.parse(penpot.currentFile.getSharedPluginData('kenigevents','asp-active-run-v1')||'null')}catch{fail('ACTIVE_RUN_INVALID')}
  const r=unit.run_control,s=storage[unit.storage.setup_receipt];
  ok(a?.schema===r.schema&&a.package_id===unit.package_id&&a.run_id===r.run_id&&a.writer_id===r.writer_id&&a.lease_token===r.lease_token&&a.cancel_token===r.cancel_token&&a.state==='ACTIVE'&&a.cancelled===false,'CANCELLED_OR_INACTIVE_LEASE');
  ok(s?.package_id===unit.package_id&&s?.record_sha256===unit.record_sha256&&s?.executor_sha256===unit.artifacts.executor.sha256&&s?.extension_request_record_sha256===unit.atlas_extension_request.record_sha256&&s?.state==='ACTIVE','SETUP_RECEIPT_MISMATCH')
}
function atlas(unit,page,extensionReceipt){
  ok(page,'ATLAS_TARGET_PAGE_MISSING');
  ok(page.name===unit.atlas_lookup.physical_page_name,'ATLAS_PAGE_NAME_MISMATCH');
  ok(page.getSharedPluginData('kenigevents-atlas-v2','source-package-id')===unit.atlas_lookup.source_package_id,'ATLAS_SOURCE_PACKAGE_MISMATCH');
  ok(page.getSharedPluginData('kenigevents-atlas-v2','projection-role')===unit.atlas_lookup.projection_role,'ATLAS_PROJECTION_ROLE_MISMATCH');
  ok(extensionReceipt?.schema_version==='kenigevents.asp-atlas-extension-receipt.v1'&&extensionReceipt.request_id===unit.atlas_extension_request.request_id&&extensionReceipt.request_record_sha256===unit.atlas_extension_request.record_sha256&&extensionReceipt.approved===true,'ATLAS_EXTENSION_NOT_APPROVED');
  ok(!Object.prototype.hasOwnProperty.call(extensionReceipt,'page_order'),'ATLAS_EXTENSION_PAGE_ORDER_FORBIDDEN')
}
function dep(unit,deps,key){
  const expected=unit.component_bindings.find(x=>x.semantic_id===key),actual=deps?.[key];
  ok(expected&&actual,'DEPENDENCY_MISSING',key);
  ok(actual.semantic_id===key&&actual.source_contract_blob===unit.source_page_unit.git_blob_sha1,'DEPENDENCY_STALE_OR_WRONG',key);
  ok(actual.component&&typeof actual.component.instance==='function','DEPENDENCY_NOT_NATIVE_COMPONENT',key);
  return actual.component
}
function write(unit,penpot,storage,label,fn){active(unit,penpot,storage);const b=penpot.history.undoBlockBegin();try{const r=fn();ok(!(r&&typeof r.then==='function'),'ASYNC_WRITE_FORBIDDEN',label);return r}finally{penpot.history.undoBlockFinish(b)}}
function board(unit,penpot,storage,parent,name,id,w,h){return write(unit,penpot,storage,id,()=>{const x=penpot.createBoard();x.name=name;x.resize(w,h);tag(x,'stable-id',id);tag(x,'managed','true');tag(x,'candidate-label','CANDIDATE_BUILD_NOT_ACCEPTED');parent.appendChild(x);return x})}
function linked(unit,penpot,storage,parent,component,id,meta){return write(unit,penpot,storage,id,()=>{const x=component.instance();ok(x?.isComponentCopyInstance?.()&&x.component?.(),'DETACHED_INSTANCE',id);x.name=id;tag(x,'stable-id',id);tag(x,'managed','true');for(const[k,v]of Object.entries(meta))tag(x,k,Array.isArray(v)?JSON.stringify(v):v);parent.appendChild(x);return x})}
function allIds(unit){const out=[unit.target.root_semantic_id];for(const s of unit.scenarios){out.push(`scenario/${s.scenario_id}`);for(const c of s.expected_components)out.push(`component/${s.scenario_id}/${c}`)}return out}
function noDup(unit,page){for(const id of allIds(unit))ok(stable(page,id).length<=1,'DUPLICATE_MANAGED_SEMANTIC_ID',id)}
function buildTasks(unit,penpot,storage,page,deps){
  const root=stable(page,unit.target.root_semantic_id)[0],out=[];
  if(!root){out.push(()=>board(unit,penpot,storage,page.root,unit.target.root_name,unit.target.root_semantic_id,1160,Math.max(1100,unit.scenarios.length*1100)));return out}
  for(const s of unit.scenarios){
    const sid=`scenario/${s.scenario_id}`,sb=stable(page,sid)[0];
    if(!sb){out.push(()=>board(unit,penpot,storage,root,`${s.viewport.id} · ${s.state}`,sid,s.viewport.width,s.viewport.height));continue}
    for(const key of s.expected_components){
      const id=`component/${s.scenario_id}/${key}`;
      if(!stable(page,id).length)out.push(()=>linked(unit,penpot,storage,sb,dep(unit,deps,key),id,{'scenario-id':s.scenario_id,'semantic-id':key,'state':s.state,'route':s.route}))
    }
  }
  return out
}
async function terminal(unit,penpot,page,deps,baseline){
  const root=stable(page,unit.target.root_semantic_id)[0];ok(root,'ROOT_MISSING');
  for(const s of unit.scenarios){
    const sb=stable(page,`scenario/${s.scenario_id}`)[0];ok(sb,'SCENARIO_BOARD_MISSING',s.scenario_id);
    ok(s.viewport.id==='tablet-768x1024'&&s.viewport.width===768&&s.viewport.height===1024,'TABLET_VIEWPORT_DRIFT',s.scenario_id);
    for(const key of s.expected_components){
      const x=stable(page,`component/${s.scenario_id}/${key}`)[0],component=dep(unit,deps,key);
      ok(x?.isComponentCopyInstance?.()&&x.component?.()?.id===component.id,'DETACHED_INSTANCE',`${s.scenario_id}/${key}`)
    }
  }
  const images=walk(root).filter(x=>x.type==='image'||Array.from(x.fills||[]).some(f=>f.fillImage));ok(images.length===0,'SCREENSHOT_IMPLEMENTATION');
  const validation=penpot.currentFile.validate()||[];ok(validation.length===0,'VALIDATION_NOT_EMPTY');
  ok(await protectedProjection(page)===baseline,'PROTECTED_PROJECTION_DRIFT');
  const raw=await root.export({type:'png',scale:1}),bytes=raw instanceof Uint8Array?raw:new Uint8Array(raw);ok(bytes.length>0,'ROOT_EXPORT_EMPTY');
  return{terminal_state:'MAT_PACKAGE_READY_QA_INTEGRATE_GATED',created:0,second_run_created:0,scenario_ids:unit.scenarios.map(x=>x.scenario_id),export_bytes:bytes.length,validation,visual_acceptance:'PENDING_V0',promotion_authorized:false}
}
async function runTabletReviewDeltaR1(unit,ctx){
  const{penpot,storage,targetPage,dependencies,extensionReceipt}=ctx;await record(unit);
  ok(await sha(canonical(unit.scenarios))===unit.scenario_contract_sha256,'SCENARIO_CONTRACT_DRIFT');
  ok(unit.scenarios.every(x=>x.viewport.id==='tablet-768x1024'&&x.viewport.width===768&&x.viewport.height===1024),'TABLET_VIEWPORT_DRIFT');
  ok(unit.route_registry_mutation===false,'ROUTE_REGISTRY_MUTATION_FORBIDDEN');
  atlas(unit,targetPage,extensionReceipt);active(unit,penpot,storage);noDup(unit,targetPage);
  for(const binding of unit.component_bindings)dep(unit,dependencies,binding.semantic_id);
  const key=unit.storage.protected_baseline;
  if(!storage[key]){storage[key]=await protectedProjection(targetPage);return{terminal_state:'PROTECTED_BASELINE_BOUND_RERUN_REQUIRED',created:0}}
  const baseline=storage[key];ok(await protectedProjection(targetPage)===baseline,'PROTECTED_PROJECTION_DRIFT');
  let created=0;for(const task of buildTasks(unit,penpot,storage,targetPage,dependencies).slice(0,unit.limits.max_managed_creations_per_invocation)){task();created++}
  if(created){ok(await protectedProjection(targetPage)===baseline,'PROTECTED_PROJECTION_DRIFT');return{terminal_state:'RESUME_REQUIRED',created}}
  return terminal(unit,penpot,targetPage,dependencies,baseline)
}
if(typeof module!=='undefined'&&module.exports)module.exports={runTabletReviewDeltaR1,canonical,sha,protectedProjection};
