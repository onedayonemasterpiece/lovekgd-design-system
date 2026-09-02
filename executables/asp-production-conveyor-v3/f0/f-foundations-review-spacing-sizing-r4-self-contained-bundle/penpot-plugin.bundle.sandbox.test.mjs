#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const HERE=dirname(fileURLToPath(import.meta.url)),bundlePath=join(HERE,'dist','penpot-plugin.bundle.js'),source=await readFile(bundlePath,'utf8'),sha256=createHash('sha256').update(source).digest('hex');
for(const pattern of [/\brequire\b/u,/\bmodule\b/u,/\bexports\b/u,/\bprocess\b/u,/\bBuffer\b/u,/\bimport\b/u,/\bstructuredClone\s*\(/u,/\bsaveVersion\b/u,/\blocalStorage\b/u,/\.__d0BundleConformance\b/u,/currentFile\.revision\b/u])assert.equal(pattern.test(source),false,`forbidden:${pattern}`);
for(const value of ['62f26df36b8199e4b8899b9252f796b1fa5e9d42','foundations-review-spacing-sizing','03.2 · Foundations · Spacing & sizing · Candidate','250f32b9-f4ec-800e-8008-92c64c51fdc0','250f32b9-f4ec-800e-8008-92c64a6147cc','313fb1ed-0d5c-8095-8008-9189b3279453','313fb1ed-0d5c-8095-8008-9189b2963057','313fb1ed-0d5c-8095-8008-9189edddf556','313fb1ed-0d5c-8095-8008-9189ed7fc58a'])assert.ok(source.includes(value),`missing:${value}`);
const sandbox={console:Object.freeze({log(){},warn(){},error(){}}),crypto:Object.freeze({}),TextEncoder:undefined,TextDecoder:undefined,structuredClone:undefined,Uint8Array,ArrayBuffer,Blob,URL,setTimeout,clearTimeout};sandbox.globalThis=sandbox;vm.createContext(sandbox,{codeGeneration:{strings:false,wasm:false}});new vm.Script(source).runInContext(sandbox,{timeout:3000});const bundle=sandbox.KenigeventsF0SpacingSizingV5;assert.equal(bundle.metadata.schema,'D0_PLUGIN_BUNDLE_V1');assert.equal(bundle.metadata.max_creates_per_phase,3);assert.equal(bundle.metadata.replay_created,0);assert.equal(bundle.metadata.linked_specimens,14);assert.equal(bundle.metadata.product_components_created,0);assert.deepEqual([...bundle.metadata.source_component_ids],['313fb1ed-0d5c-8095-8008-9189b3279453','313fb1ed-0d5c-8095-8008-9189edddf556']);console.log(JSON.stringify({state:'F0_SPACING_SIZING_V5_STATIC_SANDBOX_PASS',bundle_bytes:source.length,bundle_sha256:sha256,global:'KenigeventsF0SpacingSizingV5'}));
const exactIdentity={...bundle.source.provider_identity};
assert.equal(Object.isFrozen(bundle.source.provider_identity),true);
assert.deepEqual(Object.keys(exactIdentity).sort(),['bundle_blob_sha1','bundle_bytes','bundle_sha256','operation_identity_sha256','package_branch','package_head','package_tree','payload_blob_sha1','payload_bytes','payload_sha256','source_head'].sort());
const baseAuthorization={schema:'kenigevents.asp-spacing-sizing-authorization.v1',package_id:bundle.source.package_id,...exactIdentity,session_id:'spacing-test-session',task_id:'spacing-test-task',writer_id:'/root/publish_r2',triggered_by:'PACKAGE_TEST',lease_token:'spacing-test-lease',cancel_token:'spacing-test-cancel',expires_at:'2999-01-01T00:00:00.000Z',requirements_contract_sha256:bundle.source.requirements_contract.sha256,source_bundle_head:bundle.source.source_bundle.head,source_bundle_tree:bundle.source.source_bundle.tree,source_bundle_sha256:bundle.source.source_bundle.sha256,atlas_head:bundle.source.atlas.head,atlas_tree:bundle.source.atlas.tree,atlas_page_id:bundle.source.atlas.atlas_page_id,atlas_page_order:bundle.source.atlas.page_order,atlas_template_id:bundle.source.atlas.template_id,native_revn:194,protected_projection_revn:194,protected_projection_sha256:'9'.repeat(64),header_component_id:bundle.source.atlas.header_component_id,header_main_id:bundle.source.atlas.header_main_id,source_component_ids:bundle.source.families.map((item)=>item.component_id),source_main_ids:bundle.source.families.map((item)=>item.main_id),source_projection_sha256:bundle.source.source_projection_sha256};
const drifts={package_branch:'d0/wrong',package_head:'0'.repeat(40),package_tree:'0'.repeat(40),bundle_blob_sha1:'0'.repeat(40),bundle_bytes:2,bundle_sha256:'0'.repeat(64),operation_identity_sha256:'0'.repeat(64),payload_sha256:'0'.repeat(64),payload_blob_sha1:'0'.repeat(40),payload_bytes:2,source_head:'0'.repeat(40)};
for(const [field,value] of Object.entries(drifts)){
 let creates=0;
 const authorization={...baseAuthorization,[field]:value};
 const host={storage:{},authorization,penpot:{currentFile:{id:bundle.source.file_id,revn:194},createPage(){creates+=1;throw new Error('CREATE_REACHED')}}};
 await assert.rejects(bundle.projection(host),new RegExp('AUTHORIZATION_PROVIDER_IDENTITY:'+field));
 assert.equal(creates,0,`authorization provider drift reached create: ${field}`);
}
for(const [field,value] of Object.entries(drifts)){
 let creates=0;
 const authorization={...baseAuthorization},active={...authorization,state:'ACTIVE',cancelled:false,[field]:value};
 const host={storage:{},authorization,penpot:{currentFile:{id:bundle.source.file_id,revn:194,getSharedPluginData(){return JSON.stringify(active)}},createPage(){creates+=1;throw new Error('CREATE_REACHED')}}};
 await assert.rejects(bundle.projection(host),new RegExp('PHYSICAL_ACTIVE_TUPLE_MISMATCH:'+field));
 assert.equal(creates,0,`physical provider drift reached create: ${field}`);
}
console.log(JSON.stringify({state:'F0_SPACING_SIZING_V5_PROVIDER_IDENTITY_NEGATIVES_PASS',authorization_cases:11,physical_cases:11,creates:0}));
