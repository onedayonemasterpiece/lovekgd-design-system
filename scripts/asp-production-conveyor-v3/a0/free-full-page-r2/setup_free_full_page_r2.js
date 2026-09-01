'use strict';
function canonical(v){if(Array.isArray(v))return`[${v.map(canonical).join(',')}]`;if(v&&typeof v==='object')return`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`;return JSON.stringify(v)}
async function sha(text){const b=new TextEncoder().encode(text),d=await globalThis.crypto.subtle.digest('SHA-256',b);return Array.from(new Uint8Array(d),x=>x.toString(16).padStart(2,'0')).join('')}
async function valid(x){const c=JSON.parse(JSON.stringify(x)),e=c.record_sha256;delete c.record_sha256;if(await sha(canonical(c))!==e)throw new Error('PACKAGE_RECORD_MISMATCH')}
async function setupFreeFullPageR2(unit,logical,{penpot,storage}){
  await valid(logical);await valid(unit);
  if(unit.logical_package_record_sha256!==logical.record_sha256)throw new Error('LOGICAL_PACKAGE_BINDING_MISMATCH');
  const r=unit.run_control;
  const marker={schema:r.schema,package_id:unit.package_id,run_id:r.run_id,writer_id:r.writer_id,lease_token:r.lease_token,cancel_token:r.cancel_token,state:'ACTIVE',cancelled:false};
  penpot.currentFile.setSharedPluginData('kenigevents','asp-active-run-v1',JSON.stringify(marker));
  storage[unit.storage.setup_receipt]={schema:'kenigevents.a0-free-full-page-r2.setup-receipt.v1',package_id:unit.package_id,record_sha256:unit.record_sha256,logical_record_sha256:logical.record_sha256,executor_sha256:unit.artifacts.executor.sha256,state:'ACTIVE'};
  return{created:0,marker}
}
if(typeof module!=='undefined'&&module.exports)module.exports={setupFreeFullPageR2};
