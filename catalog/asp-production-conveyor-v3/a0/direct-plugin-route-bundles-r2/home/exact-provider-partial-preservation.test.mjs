import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const dir = new URL('.', import.meta.url);
const source = fs.readFileSync(new URL('bundle.direct-plugin.r2.js', dir), 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context, {filename:'bundle.direct-plugin.r2.js'});
const api = context.A0DirectPluginHomeR2;
assert.ok(api);
const expected = api.conformance.expectedProviderIdentity();
assert.deepEqual(JSON.parse(JSON.stringify(expected)), {
  branch:'a0/direct-plugin-route-buffer-r2-20260902',
  head:'06e8872a93369d9c2ee0ae7e64f233b5b875dc9f',
  tree:'5d5891ce252e937b580d57a06b899ef426f81a68',
  blob:'00fc83b6ee33fd1e132a76f7a31d43f0cbe9fbb9',
  sha256:'61360192a9606812a4e77bb291fbcddf06698458f23a2d28fe67eef04430bc3f',
  bytes:133628,
});
assert.equal(Object.isFrozen(expected), true);

function node(id,type='shape') {
  const data = new Map();
  return {id,type,name:'',children:[],parent:null,
    appendChild(child){child.parent=this;this.children.push(child);return child},
    setSharedPluginData(ns,key,value){assert.equal(typeof value,'string');data.set(`${ns}\0${key}`,value)},
    getSharedPluginData(ns,key){return data.get(`${ns}\0${key}`)||''},
  };
}
function penpotHost(){
  let seq=0; const pages=[]; const fileData=new Map(); const audit={creates:0,createEvents:[]};
  const currentFile={id:'file',revn:1,pages,validate:()=>[],findVersions:async()=>[],
    setSharedPluginData(ns,key,value){assert.equal(typeof value,'string');fileData.set(`${ns}\0${key}`,value)},
    getSharedPluginData(ns,key){return fileData.get(`${ns}\0${key}`)||''},
  };
  const penpot={currentPage:null,currentFile,library:{local:{components:[]}},selection:[],
    async openPage(page){assert.ok(pages.includes(page));this.currentPage=page},
    createPage(){const p=node(`page-${++seq}`,'page');p.root=node(`page-${seq}-root`,'root');pages.push(p);audit.creates++;audit.createEvents.push({kind:'page',id:p.id});return p},
    __seedPage(id){const p=node(id,'page');p.root=node(`${id}-root`,'root');pages.push(p);return p},
  };
  for(const [method,kind] of [['createBoard','board'],['createText','text']]) penpot[method]=(...args)=>{assert.ok(penpot.currentPage);const n=node(`${kind}-${++seq}`,kind);if(kind==='text')n.characters=String(args[0]??'');audit.creates++;audit.createEvents.push({kind,id:n.id});return n};
  return {penpot,audit,fileData};
}
async function makeHost(){const built=penpotHost();const storage={};const host=await api.conformance.createHost({penpot:built.penpot,storage,pluginNode:node});return {...built,host}}
const markerKey='kenigevents\0asp-active-run-v1';
const providerFields={branch:'package_branch',head:'package_head',tree:'package_tree',blob:'bundle_blob_sha1',sha256:'bundle_sha256',bytes:'bundle_bytes'};
for(const physicalField of Object.values(providerFields)){
  const {host,fileData,audit}=await makeHost();
  const marker=JSON.parse(fileData.get(markerKey)); marker[physicalField]=physicalField==='bundle_bytes'?133629:`wrong-${physicalField}`;
  fileData.set(markerKey,JSON.stringify(marker));
  assert.throws(()=>api.project(host),/ACTIVE_EXACT_(?:GIT|BUNDLE)_TUPLE/);
  assert.equal(audit.creates,0,`${physicalField} drift rejected before create`);
}
{
  const {host,fileData,audit}=await makeHost();
  const marker=JSON.parse(fileData.get(markerKey));
  for(const physicalField of Object.values(providerFields)) marker[physicalField]=physicalField==='bundle_bytes'?1:`coordinated-wrong-${physicalField}`;
  fileData.set(markerKey,JSON.stringify(marker));
  await assert.rejects(api.execute(host),/ACTIVE_EXACT_GIT_TUPLE/);
  assert.equal(audit.creates,0,'coordinated all-copy wrong tuple rejected before create');
}
{
  const {host,penpot,audit}=await makeHost();
  const page=penpot.__seedPage('durable-home-page-uuid'); page.name='A0 · Archetype · Home · Candidate';
  page.setSharedPluginData('kenigevents-a0-route-r2','stable-page-id','a0p-e1e4330e37e53368c3e77d12edbf');
  const stableIds=['a0r2-f3ad741f81a99d60720a5cda4674','a0r2-c14f5a28ab122b711901dfc2b12e','a0r2-cea981d6b2389d0d373af3885ccb','a0r2-8f9779dd921a50d5fb035915afe9','a0r2-ed24ebc66275e9715c306a484087','a0r2-ed88632e4378f8313f2b7ea73f4e','a0r2-1af658fcfbe03c76b9e8d055dae1','a0r2-0f2b17cb37169110119659de7ff9','a0r2-300869785148ce5447c332c703c8','a0r2-ffb28a52b6c9b40076511816ebad'];
  const durable=stableIds.map((stableId,i)=>{const n=node(`durable-home-node-uuid-${i+1}`,i===1||[3,4,6,7,9].includes(i)?'text':'board');n.name=`[A0R2:home] preserved-${i}`;n.setSharedPluginData('kenigevents-a0-route-r2','stable-id',stableId);n.setSharedPluginData('kenigevents-a0-route-r2','owner-job','A0-DIRECT-PLUGIN-HOME-R2');n.setSharedPluginData('kenigevents-a0-route-r2','operation-ordinal',String(i+1));return n});
  page.root.appendChild(durable[0]); for(const n of durable.slice(1)) durable[0].appendChild(n);
  const idsBefore=[page.id,...durable.map(n=>n.id)];
  const result=await api.execute(host); assert.equal(result.created,0); assert.equal(result.terminal,true);
  const settled=await api.settle(host); assert.equal(settled.created,0); assert.equal(settled.page_id,page.id); assert.equal(settled.root_id,durable[0].id);
  assert.deepEqual([page.id,...durable.map(n=>n.id)],idsBefore);
  assert.equal(audit.creates,0,'existing page/root/header/hero/content are never recreated');
}
console.log('HOME_EXACT_PROVIDER_PARTIAL_PRESERVATION_PASS');
