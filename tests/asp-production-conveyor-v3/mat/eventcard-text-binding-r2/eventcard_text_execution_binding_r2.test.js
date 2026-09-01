'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const M=require('../../../../scripts/asp-production-conveyor-v3/mat/eventcard-text-binding-r2/eventcard_text_execution_binding_r2.js');
class Adapter{
  constructor(){this.rev=178;this.m='';this.token='stable';this.grows=[];this.plugins=[];this.rows=new Map();for(const[n,s]of M.TARGETS.entries())this.rows.set(s.id,{id:s.id,rootId:s.rootId,parentId:s.rootId,characters:s.characters,growType:'fixed',frame:{x:n*100,y:n*100,width:120,height:16},textBounds:{x:n*100,y:n*100,width:80,height:31}});for(const[n,id]of M.PROTECTED.entries()){const rootId=M.TARGETS[n%4].rootId;this.rows.set(id,{id,rootId,parentId:'protected-parent-'+n,characters:'protected-'+n,growType:'fixed',frame:{x:n,y:500+n,width:90,height:16},textBounds:{x:n,y:500+n,width:70,height:31}})}for(let n=0;n<18;n++){const rootId=M.TARGETS[n%4].rootId;this.rows.set('contained-'+n,{id:'contained-'+n,rootId,parentId:rootId,characters:'ok',growType:'fixed',frame:{x:n,y:n,width:100,height:30},textBounds:{x:n+1,y:n+1,width:70,height:20}})}}
  identity(){return{fileId:M.FILE_ID,pageId:M.PAGE_ID,revision:this.rev}}
  collection(){return{rootId:M.COLLECTION_ID,children:18,components:18,cards:4,texts:38,validation:[],protected:{token:this.token}}}
  text(id){const r=this.rows.get(id);return r?[structuredClone(r)]:[]}
  managed(){return[...this.rows.values()].map(x=>structuredClone(x))}
  marker(){return this.m} writeMarker(_,v){this.m=v}
  async atomic(f){return f()} grow(id,v){this.grows.push([id,v]);this.rows.get(id).growType=v}
  self(){} async wait(id){this.rows.get(id).frame.height=40}
  plugin(id,key,value){if(typeof value!=='string')throw Error('non-string');this.plugins.push([id,key,value])}
}
const auth=p=>({schema:'text-binding-auth-r2',packageId:M.PACKAGE_ID,parentPackageId:M.PARENT_PACKAGE_ID,state:'ACTIVE',authorized:true,cancelled:false,revision:p.revision,projectionSha256:p.projectionSha256});
test('projection binds exact current tuple and is deterministic',()=>{const a=new Adapter(),p=M.projectTextExecutionBindingR2(a);assert.equal(p.revision,178);assert.deepEqual(p.targets.map(x=>x.id),M.TARGETS.map(x=>x.id));assert.equal(new Set(p.caseRoots.map(x=>x.rootId)).size,4);assert.equal(p.protectedRows.length,16);assert.equal(p.projectionSha256,M.projectTextExecutionBindingR2(a).projectionSha256);a.rev=179;assert.notEqual(M.projectTextExecutionBindingR2(a).projectionSha256,p.projectionSha256)});
test('one execution changes only four targets then distinct readback reaches 22/38',async()=>{const a=new Adapter(),p=M.projectTextExecutionBindingR2(a),r=await M.executeTextExecutionBindingR2(a,auth(p));assert.deepEqual(a.grows,M.TARGETS.map(x=>[x.id,'auto-width']));assert.equal(a.plugins.length,4);assert.equal(r.mutationCount,4);assert.equal(r.next,'DISTINCT_LATER_READBACK');const settled=M.readDistinctLaterTextBindingR2(a,r);assert.deepEqual(settled,{state:'COMPATIBLE_OCCURRENCE_PEERS_MEASUREMENT_PASS',contained:22,offenders:16,readbackMutations:0,wholeEventcardPass:false});await assert.rejects(()=>M.executeTextExecutionBindingR2(a,auth(p)),e=>e.code==='TEXT_EXECUTOR_REPLAY_FORBIDDEN')});
test('stale revision/projection and protected drift fail closed',async()=>{let a=new Adapter(),p=M.projectTextExecutionBindingR2(a);a.rev++;await assert.rejects(()=>M.executeTextExecutionBindingR2(a,auth(p)),e=>e.code==='TEXT_STALE_REVISION');a=new Adapter();p=M.projectTextExecutionBindingR2(a);a.token='changed';await assert.rejects(()=>M.executeTextExecutionBindingR2(a,auth(p)),e=>e.code==='TEXT_STALE_PROJECTION_SHA')});
test('strict plugin strings and frozen scope',()=>{assert.equal(M.TARGETS.length,4);assert.equal(M.PROTECTED.length,16);assert.throws(()=>M.str(374),e=>e.code==='PLUGIN_DATA_VALUE_NOT_STRING');assert.equal(M.str('374'),'374')});
