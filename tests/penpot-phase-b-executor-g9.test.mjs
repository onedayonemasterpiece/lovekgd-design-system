import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require=createRequire(import.meta.url);
const { runPenpotPhaseB, verifyCapsule }=require('../scripts/round-trip-reconstruction/penpot-phase-b-executor.js');
const root=path.resolve(import.meta.dirname,'..');
const capsuleDirectory=path.join(root,'catalog/penpot-executor/g9/capsule');
const materializerSha256='a'.repeat(64);
const canonicalize=(v)=>Array.isArray(v)?v.map(canonicalize):(v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonicalize(v[k])])):v);
const digest=(v)=>crypto.createHash('sha256').update(v).digest('hex');

class FakeNativePenpot {
  constructor({cancelAt=Infinity,failCreateAt=Infinity,failRollback=false,generation=9}={}) { this.nodes=new Map();this.roots=new Map();this.leases=new Map();this.reads=0;this.mutations=0;this.next=1;this.cancelAt=cancelAt;this.failCreateAt=failCreateAt;this.failRollback=failRollback;this.generation=generation; }
  async findRootByPluginKey(key){const id=this.roots.get(key);return id?this.nodes.get(id):null;}
  async findRootBySemanticLocator(){return null;}
  async createRoot(spec){this.mutations++;if(this.mutations===this.failCreateAt)throw Object.assign(new Error('native create failed'),{code:'NATIVE_CREATE_FAILED'});const id=`root-${this.next++}`,node={id,...spec,children:[]};this.nodes.set(id,node);this.roots.set(spec.plugin_key,id);return node;}
  async createNode(spec){this.mutations++;if(this.mutations===this.failCreateAt)throw Object.assign(new Error('native create failed'),{code:'NATIVE_CREATE_FAILED'});const id=`node-${this.next++}`,node={id,...spec};this.nodes.set(id,node);this.nodes.get(spec.parent_id).children.push(id);return node;}
  async deleteNode(id){if(this.failRollback)throw Object.assign(new Error('rollback denied'),{code:'ROLLBACK_DENIED'});const node=this.nodes.get(id);if(!node)return;for(const child of [...(node.children||[])])await this.deleteNode(child);if(node.plugin_key)this.roots.delete(node.plugin_key);if(node.parent_id){const p=this.nodes.get(node.parent_id);if(p)p.children=p.children.filter(x=>x!==id);}this.nodes.delete(id);}
  async snapshotNode(id){return structuredClone(this.nodes.get(id));}
  async restoreSnapshot(snapshot){this.nodes.set(snapshot.id,structuredClone(snapshot));if(snapshot.plugin_key)this.roots.set(snapshot.plugin_key,snapshot.id);return snapshot;}
  async acquireRunLease(binding,key,identity){const k=`${binding}:${key}`;if(this.leases.has(k))return{acquired:false,holder:this.leases.get(k)};this.leases.set(k,identity);return{acquired:true};}
  async validateRunLease(binding,key,identity){return{active:this.leases.get(`${binding}:${key}`)===identity};}
  async releaseRunLease(binding,key,identity){const k=`${binding}:${key}`;if(this.leases.get(k)!==identity)return false;this.leases.delete(k);return true;}
  async readExecutionControl(){this.reads++;return{generation:this.generation,cancelled:this.reads>=this.cancelAt};}
}
const run=(nativeApi,runId='g9-test')=>runPenpotPhaseB({capsuleDirectory,nativeApi,runId,materializerSha256,now:()=>new Date(0).toISOString()});

test('capsule verifies every self-contained immutable entry',()=>{const {manifest}=verifyCapsule(capsuleDirectory);assert.equal(manifest.generation,9);assert.equal(manifest.supported_case_ids.length,4);assert.ok(manifest.entries.every(x=>!x.path.includes('github')));});
test('exact generation-9 accepted-bundle authorization is required',async()=>{const temp=fs.mkdtempSync(path.join(os.tmpdir(),'g9-capsule-auth-'));fs.cpSync(capsuleDirectory,temp,{recursive:true});const controlPath=path.join(temp,'root/runtime/accepted-bundle-control.g9.json');const control=JSON.parse(fs.readFileSync(controlPath));control.accepted_bundles['eventcard-free-slice.g4.ready-v1'].authorization='NOT_ACCEPTED';fs.writeFileSync(controlPath,`${JSON.stringify(control,null,2)}\n`);const manifestPath=path.join(temp,'manifest.json'),manifest=JSON.parse(fs.readFileSync(manifestPath)),entry=manifest.entries.find(x=>x.path==='runtime/accepted-bundle-control.g9.json'),bytes=fs.readFileSync(controlPath);entry.sha256=digest(bytes);entry.bytes=bytes.length;manifest.content_sha256=null;manifest.content_sha256=digest(`${JSON.stringify(canonicalize(manifest))}\n`);fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`);const receipt=await runPenpotPhaseB({capsuleDirectory:temp,nativeApi:new FakeNativePenpot(),runId:'bad-auth',materializerSha256});assert.equal(receipt.terminal_state,'FAILED_PREFLIGHT');assert.equal(receipt.preflight.code,'BUNDLE_NOT_ACCEPTED');});
test('production executor creates four structural roots and canonical semantic children',async()=>{const api=new FakeNativePenpot();const receipt=await run(api);assert.equal(receipt.terminal_state,'SUCCEEDED');assert.equal(receipt.outputs.created.length,4);assert.equal(api.roots.size,4);assert.ok([...api.nodes.values()].some(x=>x.name==='event.action.share'));assert.ok(receipt.pre_write_checks.length===api.mutations);assert.equal(receipt.adapter.id,'kenigevents.penpot.phase-b-native-adapter');});
test('second run is idempotent and creates no duplicate roots',async()=>{const api=new FakeNativePenpot();assert.equal((await run(api,'first')).terminal_state,'SUCCEEDED');const mutations=api.mutations;const second=await run(api,'second');assert.equal(second.terminal_state,'SUCCEEDED');assert.equal(api.mutations,mutations);assert.equal(api.roots.size,4);assert.equal(second.outputs.reused.length,4);});
test('generation and cancellation are reread immediately before each native mutation',async()=>{const api=new FakeNativePenpot({cancelAt:3});const receipt=await run(api);assert.equal(receipt.terminal_state,'CANCELLED');assert.equal(receipt.pre_write_checks[2].cancelled,true);assert.equal(receipt.mutations.completed.length,2);assert.equal(receipt.mutations.rolled_back.length,2);assert.equal(api.roots.size,0);});
test('native failure rolls back all reversible mutations',async()=>{const api=new FakeNativePenpot({failCreateAt:4});const receipt=await run(api);assert.equal(receipt.terminal_state,'FAILED_ROLLED_BACK');assert.equal(receipt.failure.code,'NATIVE_CREATE_FAILED');assert.equal(receipt.mutations.unreverted.length,0);assert.equal(api.roots.size,0);});
test('unreverted native writes emit exact FAILED_PARTIAL_STATE receipt',async()=>{const api=new FakeNativePenpot({failCreateAt:3,failRollback:true});const receipt=await run(api);assert.equal(receipt.terminal_state,'FAILED_PARTIAL_STATE');assert.ok(receipt.mutations.completed.length>0);assert.equal(receipt.mutations.unreverted.length,receipt.mutations.completed.length);assert.ok(receipt.mutations.unreverted.every(x=>x.native_id));});
test('production fails closed without each concrete runtime binding',async()=>{for(const mutation of ['nativeApi','lease','cancel']){const api=new FakeNativePenpot();if(mutation==='lease')api.validateRunLease=undefined;if(mutation==='cancel')api.readExecutionControl=undefined;await assert.rejects(runPenpotPhaseB({capsuleDirectory,nativeApi:mutation==='nativeApi'?null:api,runId:'bad',materializerSha256}),/REQUIRED|MISSING/u);}});
test('generation drift before a mutation writes nothing',async()=>{const api=new FakeNativePenpot({generation:8});const receipt=await run(api);assert.equal(receipt.terminal_state,'FAILED_WRITE');assert.equal(receipt.failure.code,'GENERATION_DRIFT');assert.equal(api.mutations,0);});
test('runtime code has no network namespace or independently authored visual payload',()=>{const {manifest,root:embeddedRoot}=verifyCapsule(capsuleDirectory);for(const entry of manifest.entries.filter(x=>x.role==='runtime')){const source=fs.readFileSync(path.join(embeddedRoot,entry.path),'utf8');assert.doesNotMatch(source,/github\.com|api\.github|const\s+(EVENTS|GEOMETRY)|static\.kenigevents\.ru\//u,entry.path);}});
