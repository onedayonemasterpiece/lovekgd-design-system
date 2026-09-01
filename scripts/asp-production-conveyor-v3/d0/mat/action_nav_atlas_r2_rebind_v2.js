'use strict';
const ACTION_NAV_R2_EXECUTOR_SHA256='9f4c7f5149656090f4d21b14fa229157b1094482994ba8e1d0c203f320a14d82';
const ACTION_NAV_R2_EXECUTOR_BLOB='a6ed8b0d4175d9f303f1b079b634aa4dd423551e';
const ACTION_NAV_R2_ATLAS_HEAD='663be702d481972cb2e8863af500f1c35dda1d8c';
const ACTION_NAV_R2_ATLAS_TREE='cf9a1e6a5e0a84aea5636334dbd3be4961039b75';
const ACTION_NAV_R2_SOURCE_HEAD='fecb90c6b1c475687d77b8cce4c905d932a0bf23';
const ACTION_NAV_R2_SOURCE_BLOB='b211bcec98a144a8e3ee7ed87098c37757fb8298';
const ACTION_NAV_R2_FILE_ID='40e06342-8830-80d6-8008-8fc8a3a4cd4f';
const PACKAGE_ID='F-ACTION-NAV-ICONS';
const ADAPTER_ID='D0-MAT-F-ACTION-NAV-ICONS-ATLAS-R2';
const req=(x,m)=>{if(!x)throw Error(m)};
function checkActionNavAtlasR2Claim(penpot,claim){
  req(penpot.currentFile?.id===ACTION_NAV_R2_FILE_ID,'WRONG_FILE');
  req(claim?.schema==='kenigevents.asp-atlas-publish-claim.v1'&&claim.package_id===PACKAGE_ID&&claim.logical_writer_id==='/root/publish_r2'&&claim.adapter_id===ADAPTER_ID&&claim.adapter_sha256===ACTION_NAV_R2_EXECUTOR_SHA256&&claim.source_blob===ACTION_NAV_R2_SOURCE_BLOB&&claim.atlas_head===ACTION_NAV_R2_ATLAS_HEAD&&claim.atlas_tree===ACTION_NAV_R2_ATLAS_TREE&&claim.publish_identity&&claim.run_id&&claim.lease_token&&claim.cancel_token,'PUBLISH_CLAIM_INVALID');
  let run;try{run=JSON.parse(penpot.currentFile.getSharedPluginData('kenigevents','asp-active-run-v1')||'null')}catch{throw Error('ACTIVE_RUN_INVALID')}
  req(run?.schema==='kenigevents.asp-run-control.v1'&&run.package_id===PACKAGE_ID&&run.writer_id===claim.logical_writer_id&&run.publish_identity===claim.publish_identity&&run.run_id===claim.run_id&&run.lease_token===claim.lease_token&&run.cancel_token===claim.cancel_token&&run.adapter_id===claim.adapter_id&&run.adapter_sha256===ACTION_NAV_R2_EXECUTOR_SHA256&&run.source_blob===ACTION_NAV_R2_SOURCE_BLOB&&run.atlas_head===ACTION_NAV_R2_ATLAS_HEAD&&run.atlas_tree===ACTION_NAV_R2_ATLAS_TREE&&run.state==='ACTIVE'&&!run.cancelled,'CANCELLED_OR_INACTIVE_LEASE');
}
function setupActionNavAtlasR2RebindV2({penpot,storage,claim}){
  checkActionNavAtlasR2Claim(penpot,claim);
  const binding={schema:'kenigevents.asp-atlas-adapter-binding.v2',adapter_id:ADAPTER_ID,adapter_sha256:ACTION_NAV_R2_EXECUTOR_SHA256,adapter_git_blob_sha1:ACTION_NAV_R2_EXECUTOR_BLOB,source_head:ACTION_NAV_R2_SOURCE_HEAD,source_blob:ACTION_NAV_R2_SOURCE_BLOB,atlas_head:ACTION_NAV_R2_ATLAS_HEAD,atlas_tree:ACTION_NAV_R2_ATLAS_TREE,template_id:'FOUNDATION_ASSET_GRID_DENSE_V2',package_id:PACKAGE_ID,publish_identity:claim.publish_identity,logical_writer_id:claim.logical_writer_id,run_id:claim.run_id,lease_token:claim.lease_token,cancel_token:claim.cancel_token};
  storage[`d0F0AtlasBindingV2:${PACKAGE_ID}`]=binding;
  return{schema:'kenigevents.asp-atlas-adapter-setup-result.v2',state:'ACTIVE',mutations:0,penpotAuthorization:false,binding};
}
let payloadRun=null;if(typeof module!=='undefined'&&module.exports)payloadRun=require('./action_nav_atlas_r2_rebind_payload_v2.js').runActionNavAtlasR2RebindPayloadV2;
async function runActionNavAtlasR2RebindV2(ctx){checkActionNavAtlasR2Claim(ctx.penpot,ctx.claim);const run=payloadRun||globalThis.runActionNavAtlasR2RebindPayloadV2;req(typeof run==='function','PAYLOAD_NOT_LOADED');return await run(ctx,PACKAGE_ID,ACTION_NAV_R2_EXECUTOR_SHA256)}
if(typeof module!=='undefined'&&module.exports)module.exports={ACTION_NAV_R2_EXECUTOR_SHA256,ACTION_NAV_R2_EXECUTOR_BLOB,ACTION_NAV_R2_ATLAS_HEAD,ACTION_NAV_R2_ATLAS_TREE,ACTION_NAV_R2_SOURCE_HEAD,ACTION_NAV_R2_SOURCE_BLOB,PACKAGE_ID,ADAPTER_ID,setupActionNavAtlasR2RebindV2,runActionNavAtlasR2RebindV2};
