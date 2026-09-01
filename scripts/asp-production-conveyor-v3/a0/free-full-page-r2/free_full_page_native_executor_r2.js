'use strict';

/*
 * Concrete native executor for one A-FREE-FULL-PAGE-R2 physical unit.
 * READY and EXCEPTION are independently executable and share one logical source.
 * Atlas pages and all U0/F0 component identities must already be exact.
 */
const NS='kenigevents-a0-free-full-page-r2';
function fail(code,detail=''){throw new Error(detail?`${code}:${detail}`:code)}
function ok(v,code,detail=''){if(!v)fail(code,detail)}
function kids(x){return Array.from(x?.children||[])}
function walk(x){return x?[x,...kids(x).flatMap(walk)]:[]}
function canonical(v){if(Array.isArray(v))return`[${v.map(canonical).join(',')}]`;if(v&&typeof v==='object')return`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`;return JSON.stringify(v)}
async function sha(text){const b=new TextEncoder().encode(text),d=await globalThis.crypto.subtle.digest('SHA-256',b);return Array.from(new Uint8Array(d),x=>x.toString(16).padStart(2,'0')).join('')}
async function record(x){const c=JSON.parse(JSON.stringify(x)),e=c.record_sha256;delete c.record_sha256;ok(e&&await sha(canonical(c))===e,'PACKAGE_RECORD_MISMATCH')}
function get(x,k){return x?.getSharedPluginData?.(NS,k)||''}
function tag(x,k,v){x.setSharedPluginData(NS,k,String(v))}
function stable(page,id){return walk(page.root).filter(x=>get(x,'stable-id')===id)}
function projectShape(x){return{id:x.id,name:x.name||'',type:x.type||'',width:x.width||0,height:x.height||0,children:kids(x).map(projectShape)}}
async function protectedProjection(page){return sha(canonical(kids(page.root).filter(x=>!get(x,'managed')).map(projectShape)))}
function active(unit,penpot,storage){
  let a;try{a=JSON.parse(penpot.currentFile.getSharedPluginData('kenigevents','asp-active-run-v1')||'null')}catch{fail('ACTIVE_RUN_INVALID')}
  const r=unit.run_control,s=storage[unit.storage.setup_receipt];
  ok(a?.schema===r.schema&&a.package_id===unit.package_id&&a.run_id===r.run_id&&a.writer_id===r.writer_id&&a.lease_token===r.lease_token&&a.cancel_token===r.cancel_token&&a.state==='ACTIVE'&&a.cancelled===false,'CANCELLED_OR_INACTIVE_LEASE');
  ok(s?.package_id===unit.package_id&&s?.record_sha256===unit.record_sha256&&s?.logical_record_sha256===unit.logical_package_record_sha256&&s?.executor_sha256===unit.artifacts.executor.sha256&&s?.state==='ACTIVE','SETUP_RECEIPT_MISMATCH')
}
function dependency(unit,deps,key){
  const e=unit.dependency_gates[key],a=deps?.[key];
  ok(e&&a,'DEPENDENCY_MISSING',key);
  ok(a.package_id===e.package_id&&a.remote_head===e.remote_head&&a.git_blob_sha1===e.git_blob_sha1&&a.semantic_id===e.semantic_id,'DEPENDENCY_STALE_OR_WRONG',key);
  ok(a.component&&typeof a.component.instance==='function','DEPENDENCY_NOT_NATIVE_COMPONENT',key);
  return a.component
}
function atlas(unit,page){
  ok(page,'ATLAS_PAGE_MISSING');
  ok(page.name===unit.atlas_binding.physical_page_name,'ATLAS_PAGE_NAME_MISMATCH');
  ok(page.getSharedPluginData('kenigevents-atlas-v2','source-package-id')===unit.atlas_binding.source_package_id,'ATLAS_SOURCE_PACKAGE_MISMATCH');
  ok(page.getSharedPluginData('kenigevents-atlas-v2','projection-role')===unit.projection_role,'ATLAS_PROJECTION_ROLE_MISMATCH')
}
function write(penpot,unit,storage,label,fn){active(unit,penpot,storage);const b=penpot.history.undoBlockBegin();try{const r=fn();ok(!(r&&typeof r.then==='function'),'ASYNC_WRITE_FORBIDDEN',label);return r}finally{penpot.history.undoBlockFinish(b)}}
function board(penpot,unit,storage,parent,name,id,w,h){return write(penpot,unit,storage,id,()=>{const x=penpot.createBoard();x.name=name;x.resize(w,h);tag(x,'stable-id',id);tag(x,'managed','true');tag(x,'candidate-label','CANDIDATE_BUILD_NOT_ACCEPTED');parent.appendChild(x);return x})}
function linked(penpot,unit,storage,parent,component,id,meta){return write(penpot,unit,storage,id,()=>{const x=component.instance();ok(x?.isComponentCopyInstance?.()&&x.component?.(),'DETACHED_INSTANCE',id);x.name=id;tag(x,'stable-id',id);tag(x,'managed','true');for(const[k,v]of Object.entries(meta))tag(x,k,Array.isArray(v)?JSON.stringify(v):v);parent.appendChild(x);return x})}
function requiredIds(unit){
  const ids=[unit.target.root_semantic_id];
  for(const s of unit.states){ids.push(`state/${s.scenario_id}`,`shell/${s.scenario_id}`,`brand/${s.scenario_id}`);for(const f of s.rendered_fixture_ids)ids.push(`card/${s.scenario_id}/${f}`)}
  return ids
}
function noDuplicates(unit,page){for(const id of requiredIds(unit))ok(stable(page,id).length<=1,'DUPLICATE_MANAGED_SEMANTIC_ID',id)}
function tasks(unit,penpot,storage,page,components){
  const rootId=unit.target.root_semantic_id,root=stable(page,rootId)[0];const out=[];
  if(!root){out.push(()=>board(penpot,unit,storage,page.root,unit.target.root_name,rootId,1480,Math.max(900,unit.states.length*620)));return out}
  for(const state of unit.states){
    const sid=`state/${state.scenario_id}`,stateBoard=stable(page,sid)[0];
    if(!stateBoard){out.push(()=>board(penpot,unit,storage,root,`${state.viewport.id} · ${state.state}`,sid,state.viewport.width,state.viewport.height));continue}
    const shellId=`shell/${state.scenario_id}`;
    if(!stable(page,shellId).length)out.push(()=>linked(penpot,unit,storage,stateBoard,components.shell,shellId,{'scenario-id':state.scenario_id,'state':state.state,'projection-role':unit.projection_role}));
    const brandId=`brand/${state.scenario_id}`;
    if(!stable(page,brandId).length)out.push(()=>linked(penpot,unit,storage,stateBoard,components.brand,brandId,{'scenario-id':state.scenario_id,'semantic-id':unit.dependency_gates.brand.semantic_id}));
    for(const fixtureId of state.rendered_fixture_ids){
      const cid=`card/${state.scenario_id}/${fixtureId}`;
      if(!stable(page,cid).length)out.push(()=>linked(penpot,unit,storage,stateBoard,components.card,cid,{'scenario-id':state.scenario_id,'fixture-id':fixtureId,'fixture-semantics':'EXACT_PROJECTION_MEMBERSHIP'}))
    }
  }
  return out
}
async function verifyTerminal(unit,logical,penpot,page,components,baseline){
  const root=stable(page,unit.target.root_semantic_id)[0];ok(root,'ROOT_MISSING');
  const stateBoards=unit.states.map(s=>stable(page,`state/${s.scenario_id}`)[0]);ok(stateBoards.every(Boolean),'STATE_BOARD_MISSING');
  const ids=stateBoards.map(x=>get(x,'stable-id'));ok(new Set(ids).size===unit.states.length,'STATE_DUPLICATE');
  for(const state of unit.states){
    const sb=stable(page,`state/${state.scenario_id}`)[0];
    const shell=stable(page,`shell/${state.scenario_id}`)[0],brand=stable(page,`brand/${state.scenario_id}`)[0];
    ok(shell?.isComponentCopyInstance?.()&&shell.component?.()?.id===components.shell.id,'SHELL_DETACHED',state.scenario_id);
    ok(brand?.isComponentCopyInstance?.()&&brand.component?.()?.id===components.brand.id,'BRAND_DETACHED',state.scenario_id);
    const cards=kids(sb).filter(x=>get(x,'fixture-id')).map(x=>get(x,'fixture-id'));
    ok(canonical(cards)===canonical(state.rendered_fixture_ids),'STATE_FIXTURE_RENDER_DRIFT',state.scenario_id);
    ok(canonical(state.factual_fixture_order)===canonical(logical.factual_fixture_order),'FACTUAL_FIXTURE_INPUT_DRIFT',state.scenario_id);
    for(const c of kids(sb).filter(x=>get(x,'fixture-id')))ok(c.isComponentCopyInstance?.()&&c.component?.()?.id===components.card.id,'CARD_DETACHED',state.scenario_id)
  }
  const images=walk(root).filter(x=>x.type==='image'||Array.from(x.fills||[]).some(f=>f.fillImage));ok(images.length===0,'SCREENSHOT_IMPLEMENTATION');
  const validation=penpot.currentFile.validate()||[];ok(validation.length===0,'VALIDATION_NOT_EMPTY');
  ok(await protectedProjection(page)===baseline,'PROTECTED_PROJECTION_DRIFT');
  const raw=await root.export({type:'png',scale:1}),bytes=raw instanceof Uint8Array?raw:new Uint8Array(raw);ok(bytes.length>0,'ROOT_EXPORT_EMPTY');
  return{terminal_state:'MAT_PACKAGE_READY_QA_INTEGRATE_GATED',created:0,second_run_created:0,projection_role:unit.projection_role,state_ids:unit.states.map(x=>x.scenario_id),export_bytes:bytes.length,validation,visual_acceptance:'PENDING_V0',promotion_authorized:false}
}
async function runFreeFullPageR2(unit,logical,ctx){
  const{penpot,storage,targetPage,dependencies}=ctx;await record(logical);await record(unit);
  ok(unit.logical_package_record_sha256===logical.record_sha256,'LOGICAL_PACKAGE_BINDING_MISMATCH');
  ok(unit.lane1_terminal_head===logical.lane1_terminal_head&&/^[0-9a-f]{40}$/.test(unit.lane1_terminal_head),'LANE1_HEAD_BINDING_MISMATCH');
  ok(['READY','EXCEPTION'].includes(unit.projection_role),'INVALID_PROJECTION_ROLE');
  atlas(unit,targetPage);active(unit,penpot,storage);noDuplicates(unit,targetPage);
  const components={card:dependency(unit,dependencies,'event_card'),shell:dependency(unit,dependencies,'free_shell'),brand:dependency(unit,dependencies,'brand')};
  const baselineKey=unit.storage.protected_baseline;
  if(!storage[baselineKey]){storage[baselineKey]=await protectedProjection(targetPage);return{terminal_state:'PROTECTED_BASELINE_BOUND_RERUN_REQUIRED',created:0}}
  const baseline=storage[baselineKey];ok(await protectedProjection(targetPage)===baseline,'PROTECTED_PROJECTION_DRIFT');
  let created=0;for(const task of tasks(unit,penpot,storage,targetPage,components).slice(0,unit.limits.max_managed_creations_per_invocation)){task();created++}
  if(created){ok(await protectedProjection(targetPage)===baseline,'PROTECTED_PROJECTION_DRIFT');return{terminal_state:'RESUME_REQUIRED',created}}
  return verifyTerminal(unit,logical,penpot,targetPage,components,baseline)
}
if(typeof module!=='undefined'&&module.exports)module.exports={runFreeFullPageR2,canonical,sha,protectedProjection};
