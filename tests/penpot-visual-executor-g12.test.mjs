import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';

const scriptPath='catalog/penpot-executor/g12/capsule/penpot-visual-executor.g12.js';
const source=fs.readFileSync(scriptPath,'utf8');
const expectations=JSON.parse(fs.readFileSync('catalog/penpot-executor/g12/independent-expectations.json'));
const stable=(v)=>JSON.stringify(v,(_k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.entries(x).sort(([a],[b])=>a.localeCompare(b))):x);
const digest=(v)=>crypto.createHash('sha256').update(stable(v)).digest('hex');
const without=(o,keys)=>Object.fromEntries(Object.entries(o).filter(([k])=>!keys.includes(k)));
let serial=0;
class Shape{
  constructor(type,text=''){this.id=`shape-${++serial}`;this.type=type;this.characters=text;this.children=[];this.data={};this.fills=[];this.hidden=false;return new Proxy(this,{set(target,key,value){const allowed=new Set(['id','type','characters','children','data','fills','hidden','name','width','height','x','y','parent','noRemove','svg','asyncResolved','fontFamily','fontSize','fontWeight','lineHeight','clipContent','borderRadiusTopLeft','borderRadiusTopRight','borderRadiusBottomRight','borderRadiusBottomLeft']);if(!allowed.has(String(key)))throw Error(`UNKNOWN_SHAPE_PROPERTY:${String(key)}`);target[key]=value;return true}})}
  resize(w,h){this.width=w;this.height=h} appendChild(s){if(s.parent)s.parent.children=s.parent.children.filter((x)=>x!==s);s.parent=this;this.children.push(s)}
  setPluginData(k,v){this.data[k]=String(v)} getPluginData(k){return this.data[k]||''} remove(){if(this.noRemove)throw Error('remove blocked');if(this.parent)this.parent.children=this.parent.children.filter((x)=>x!==this)}
}
const clone=(s)=>{const n=new Shape(s.type,s.characters);for(const k of ['name','width','height','x','y','fills','hidden','fontFamily','fontSize','fontWeight','lineHeight','clipContent','borderRadiusTopLeft','borderRadiusTopRight','borderRadiusBottomRight','borderRadiusBottomLeft','svg','asyncResolved'])if(s[k]!==undefined)n[k]=structuredClone(s[k]);n.data={...s.data};for(const c of s.children){const q=clone(c);q.parent=n;n.children.push(q)}return n};
function fakeSurface({missing=[]}={}){serial=0;const root=new Shape('root'),components=[];const walk=function*(s){yield s;for(const c of s.children)yield*walk(c)};const fontFaces=[{id:'DejaVuSans',family:'DejaVu Sans',style:'Book',postScriptName:'DejaVuSans'},{id:'DejaVuSans-Bold',family:'DejaVu Sans',style:'Bold',postScriptName:'DejaVuSans-Bold'}];const penpot={currentFile:{id:'file-g12'},currentPage:{id:'page-g12',root},fonts:{all:fontFaces,findByName:(name)=>fontFaces.find((font)=>font.family===name)||null,findAllByName:(name)=>fontFaces.filter((font)=>font.family===name)},createBoard:()=>new Shape('board'),createRectangle:()=>new Shape('rectangle'),createText:(t)=>new Shape('text',t),createShapeFromSvg:(s)=>{assert.match(s,/^<svg/);const n=new Shape('svg');n.svg=s;return n},createShapeFromSvgWithImages:async(s)=>{assert.match(s,/clipPath/);assert.match(s,/data:image\/webp;base64/);await Promise.resolve();const n=new Shape('media-svg');n.svg=s;n.asyncResolved=true;return n},library:{local:{components,createComponent:(shapes)=>{const c={id:`component-${components.length+1}`,name:'',main:shapes[0],instance:()=>clone(shapes[0])};components.push(c);return c}}}};for(const k of missing)delete penpot[k];const penpotUtils={findShape:(fn)=>[...walk(root)].find(fn)||null,setParentXY:(s,x,y)=>{s.x=x;s.y=y}};return{penpot,penpotUtils,root,components,walk:()=>[...walk(root)]}}
async function load(surface=fakeSurface()){const context={...surface,console,Date,JSON,Math,Error,Object,Array,String,Number,Boolean,RegExp,encodeURIComponent,decodeURIComponent,escape,unescape};const api=await vm.runInNewContext(source,context,{filename:scriptPath});return{api,surface}}
function signedTicket(batchId,op,i,overrides={}){const t={schema:'kenigevents.w0-penpot-batch-mutation-ticket.g12.v1',owner:'W3',generation:13,run_id:'W3-G13-R1',file_id:'file-g12',page_id:'page-g12',batch_id:batchId,operation:op,nonce:`${batchId}-${i}-${overrides.rollback?'r':'w'}-nonce`,expires_at:'2099-01-01T00:00:00Z',cancelled:false,...overrides};delete t.rollback;t.body_sha256=digest(t);t.w0_attestation='W0-ATTESTED:test';return t}
function authority(api,batchId,modify=()=>{}){const plan=api.planBatch(batchId);const tickets=plan.operations.map((op,i)=>signedTicket(batchId,op,i));const rollback_tickets=plan.operations.filter((op)=>op.startsWith('create:')).map((op,i)=>signedTicket(batchId,`rollback:${op.slice(7)}`,i,{rollback:true}));const capsule={schema:'kenigevents.w0-issued-w3-batch-capsule.g12.v1',owner:'W3',generation:13,run_id:'W3-G13-R1',file_id:'file-g12',page_id:'page-g12',batch_id:batchId,expires_at:'2099-01-01T00:00:00Z',cancelled:false,accepted_executor:{payload_sha256:api.payload_sha256},tickets,rollback_tickets,image_canary:{schema:'kenigevents.penpot-reversible-image-canary-receipt.g12.v1',status:'PASS',file_id:'file-g12',page_id:'page-g12'}};modify({capsule,tickets,rollback_tickets});capsule.body_sha256=digest(without(capsule,['tickets','body_sha256','w0_attestation']));capsule.w0_attestation='W0-ATTESTED:test';return{capsule,probeReceipt:{schema:'kenigevents.penpot-empty-baseline-probe-receipt.g12.v1',status:'COMPATIBLE_API_FONT_TARGET',file_id:'file-g12',page_id:'page-g12'}}}
const byKey=(s,key)=>s.walk().find((x)=>x.getPluginData?.('kenigevents-semantic-key')===key);
const descendant=(root,suffix)=>{const queue=[...(root?.children||[])];while(queue.length){const node=queue.shift();if(node.getPluginData?.('kenigevents-semantic-key').endsWith(suffix))return node;queue.push(...(node.children||[]))}return null};
const cssNumber=(value)=>{const number=Number.parseFloat(String(value));return Number.isFinite(number)?number:null};

test('run-agnostic artifact has no forbidden loader/network authority and rejects incomplete globals',async()=>{
  for(const p of [/\brequire\s*\(/,/node:/,/\bprocess\b/,/\bfetch\s*\(/,/XMLHttpRequest/,/github\.com/i,/w2-penpot-visual-executor-g12/,/generation\s*[:=]\s*12/])assert.doesNotMatch(source,p);
  const{api}=await load();assert.equal(api.identity,'kenigevents.free-collection.ordinary-penpot-visual-executor');assert.match(api.threat_model.cancellation,/withholding the next batch/);
  const bad=await load(fakeSurface({missing:['createShapeFromSvgWithImages']}));await assert.rejects(bad.api.executeBatch(authority(bad.api,'B00_ROOT')),/PENPOT_PRIMITIVE_MISSING/);
});

test('independent current-A expectations pin exact geometry, content, media, fonts and hidden calendar',()=>{
  assert.equal(expectations.status,'CURRENT_A_USED_VALUES_AUTHORITY');assert.equal(expectations.component_model.master_count,1);assert.equal(expectations.component_model.variants.length,4);
  const wide=expectations.cases.find((c)=>c.case_id==='eventcard.desktop-wide-calendar.8006'),packed=expectations.cases.find((c)=>c.case_id==='eventcard.desktop-packed-calendar-absent.2182');
  assert.deepEqual(wide.box,{width:533.797,height:947.328});assert.equal(wide.slots.title.text,'Донорская акция «Стань донором крови»');assert.equal(wide.slots.image.style.objectFit,'contain');assert.equal(wide.calendar_visible,true);
  assert.equal(packed.slots.image.style.objectFit,'cover');assert.equal(packed.calendar_visible,false);assert.equal(expectations.fixtures['event.real.6711'].title,'Выставка «Под шум балтийского ветра»');assert.ok(expectations.runtime_fonts.font_files.some((f)=>f.file_sha256));assert.equal(wide.slots.occurrence.text,'2 сентября 09:00');assert.equal(packed.slots.occurrence.text,'11 января 14:00');assert.deepEqual(wide.slots.occurrence.resolved_font.family,'DejaVu Sans');assert.equal(wide.slots.occurrence.resolved_font.face,'DejaVuSans-Bold');
  assert.equal(expectations.groups.find((g)=>g.group_id==='row.desktop.events').heading.text,'2 событий');assert.equal(expectations.groups.find((g)=>g.group_id==='row.desktop.exhibitions').count,3);
});

test('read-only probe uses ordinary font context and exact current-A faces without mutation',()=>{
  const probeSource=fs.readFileSync('catalog/penpot-executor/g12/penpot-empty-baseline-probe.js','utf8');
  const surface=fakeSurface();let findByNameCalls=0,findAllByNameCalls=0;
  const originalFind=surface.penpot.fonts.findByName,originalFindAll=surface.penpot.fonts.findAllByName;
  surface.penpot.fonts.findByName=(name)=>{findByNameCalls++;return originalFind(name)};
  surface.penpot.fonts.findAllByName=(name)=>{findAllByNameCalls++;return originalFindAll(name)};
  const before=surface.walk().length;const observation=vm.runInNewContext(probeSource,{...surface,Object,Array,String,Set});
  assert.equal(observation.status,'OBSERVED_API_FONT_TARGET');assert.equal(observation.mutation_calls,0);assert.equal(surface.walk().length,before);assert.equal(findByNameCalls,1);assert.equal(findAllByNameCalls,1);
  assert.equal(observation.font_context.required_family,'DejaVu Sans');assert.deepEqual([...observation.font_context.required_identifiers],['DejaVuSans','DejaVuSans-Bold']);for(const id of ['DejaVuSans','DejaVuSans-Bold'])assert.ok(observation.font_context.available_identifiers.includes(id));
});

test('fail closed before writes for wrong owner, missing probe, missing image canary and stale generation',async()=>{
  for(const mode of ['owner','probe','canary','generation']){const{api,surface}=await load();const batch=mode==='canary'?'B10_L0_ASSETS':'B00_ROOT';const auth=authority(api,batch,({capsule})=>{if(mode==='owner')capsule.owner='W2';if(mode==='canary')delete capsule.image_canary;if(mode==='generation')capsule.generation=12});if(mode==='probe')delete auth.probeReceipt;await assert.rejects(api.executeBatch(auth),/BATCH_CAPSULE_INVALID|EMPTY_BASELINE_PROBE_REQUIRED|REVERSIBLE_IMAGE_CANARY_REQUIRED/);assert.equal(surface.root.children.length,0)}
});

test('bounded batches create real L0-L3 visuals, one master/four variants and fixture-correct linked instances',async()=>{
  const{api,surface}=await load();let checkpoint=null;const receipts=[];for(const batchId of api.batches){const receipt=await api.executeBatch({...authority(api,batchId),checkpoint});checkpoint=receipt.checkpoint;receipts.push(receipt)}
  for(const key of ['g12.L0','g12.L1','component.event-card.free-collection','g12.L2','l0.asset.action-share','l0.asset.nav-search','l0.media.event.real.7609','l1.medallion','l3.group.row.desktop.events','l3.group.row.desktop.exhibitions','l3.group.group.mobile.events','l3.group.group.mobile.exhibitions'])assert.ok(byKey(surface,key),key);
  assert.equal(surface.components.length,1);const master=byKey(surface,'component.event-card.free-collection');assert.equal(master.children.filter((x)=>x.getPluginData('kenigevents-semantic-key').includes('.variant.')).length,4);
  const direct=byKey(surface,'l2.case.eventcard.desktop-packed-calendar-absent.2182');const active=direct.children.find((x)=>x.hidden===false&&x.getPluginData('kenigevents-semantic-key').includes('.variant.'));assert.ok(active);const cal=active.children.find((x)=>x.getPluginData('kenigevents-semantic-key').endsWith('.action.calendar'));assert.ok(!cal||cal.hidden);const title=active.children.find((x)=>x.getPluginData('kenigevents-semantic-key').endsWith('.title'));assert.equal(title.characters,'Песчаная палитра Куршской косы');assert.ok(active.children.some((x)=>x.getPluginData('kenigevents-media-sha256')===expectations.fixtures['event.real.2182'].media.sha256));
  for(const id of ['8006','8200','2182','6711','7609'])assert.ok(receipts.flatMap((r)=>r.lineage).some((x)=>x.fixture_id===`event.real.${id}`),id);
  assert.ok(receipts.every((r)=>r.pre_write_checks.length===r.completed_mutations.length&&r.pre_write_checks.every((x)=>x.checked_immediately_before_write)));
});

test('all governed masters plus every direct and group instance have exact occurrence font radii awaited media and action visibility',async()=>{
  const{api,surface}=await load();let checkpoint=null;for(const batchId of api.batches){const receipt=await api.executeBatch({...authority(api,batchId),checkpoint});checkpoint=receipt.checkpoint}
  const master=byKey(surface,'component.event-card.free-collection');assert.ok(master);const actionNames=['share','like','not_interested','calendar'];
  for(const model of expectations.cases){
    const variant=descendant(master,`.variant.${model.variant}`);assert.ok(variant,`master:${model.variant}`);
    for(const action of actionNames){const node=descendant(variant,`.action.${action}`);assert.equal(Boolean(node&&!node.hidden),model.actions.includes(action),`master:${model.variant}:${action}`)}
  }
  const targets=[...expectations.cases.map((model)=>({key:`l2.case.${model.case_id}`,model})),...expectations.groups.flatMap((group)=>group.instances.map((model)=>({key:`l3.group.${group.group_id}.${model.fixture_id}`,model})))];
  for(const {key,model} of targets){
    const instance=byKey(surface,key);assert.ok(instance,key);const variantName=expectations.cases.find((candidate)=>candidate.viewport===(key.includes('mobile')?'mobile':'desktop')&&candidate.variant.includes(key.includes('exhibitions')||model.fixture_id==='event.real.2182'&&!key.includes('events')?'packed':'wide'))?.variant;
    const active=instance.children.find((node)=>!node.hidden&&node.getPluginData('kenigevents-semantic-key').includes('.variant.'));assert.ok(active,`${key}:active`);
    const occurrence=descendant(active,'.occurrence');assert.equal(occurrence.characters,model.slots.occurrence.text,`${key}:occurrence`);assert.ok(occurrence.characters.length);assert.equal(occurrence.fontFamily,model.slots.occurrence.resolved_font.family,`${key}:font-family`);assert.equal(occurrence.getPluginData('kenigevents-font-face'),model.slots.occurrence.resolved_font.face,`${key}:font-face`);
    for(const slot of ['media-link','media-frame','body','utility-row']){const node=descendant(active,`.${slot}`),style=model.slots[slot].style;assert.ok(node,`${key}:${slot}`);assert.equal(node.borderRadiusTopLeft,cssNumber(style.borderTopLeftRadius),`${key}:${slot}:tl`);assert.equal(node.borderRadiusTopRight,cssNumber(style.borderTopRightRadius),`${key}:${slot}:tr`);assert.equal(node.borderRadiusBottomRight,cssNumber(style.borderBottomRightRadius),`${key}:${slot}:br`);assert.equal(node.borderRadiusBottomLeft,cssNumber(style.borderBottomLeftRadius),`${key}:${slot}:bl`)}
    const media=descendant(active,`${key}.image.override`)||descendant(active,'.image.override');assert.ok(media,`${key}:media`);assert.equal(media.asyncResolved,true,`${key}:media-awaited`);assert.equal(media.parent,active,`${key}:media-parent`);assert.equal(media.getPluginData('kenigevents-media-sha256'),expectations.fixtures[model.fixture_id].media.sha256,`${key}:media-sha`);
    for(const action of actionNames){const node=descendant(active,`.action.${action}`);assert.equal(Boolean(node&&!node.hidden),model.actions.includes(action),`${key}:${action}`)}
    assert.ok(variantName||active,`${key}:variant-evidence`);
  }
  const strict=new Shape('rectangle');assert.throws(()=>{strict.radii=[1,2,3,4]},/UNKNOWN_SHAPE_PROPERTY:radii/);
});

test('second bounded run is idempotent without duplicate roots, components or instances',async()=>{
  const{api,surface}=await load();let checkpoint=null;for(const id of api.batches){const r=await api.executeBatch({...authority(api,id),checkpoint});checkpoint=r.checkpoint}const before=surface.walk().length;checkpoint=null;for(const id of api.batches){const r=await api.executeBatch({...authority(api,id),checkpoint});checkpoint=r.checkpoint;assert.equal(r.terminal_state,'SUCCEEDED_IDEMPOTENT_REUSE')}assert.equal(surface.walk().length,before);assert.equal(surface.components.length,1);
});

test('ticket cancellation/drift between writes rolls back and incomplete rollback is exact partial state',async()=>{
  for(const mode of ['cancel','stale','expiry','replay']){const{api,surface}=await load();const auth=authority(api,'B00_ROOT',({tickets})=>{const i=3;if(mode==='cancel')tickets[i].cancelled=true;if(mode==='stale')tickets[i].generation=14;if(mode==='expiry')tickets[i].expires_at='2020-01-01T00:00:00Z';if(mode==='replay')tickets[i].nonce=tickets[i-1].nonce;delete tickets[i].body_sha256;delete tickets[i].w0_attestation;tickets[i].body_sha256=digest(tickets[i]);tickets[i].w0_attestation='W0-ATTESTED:test'});let error;try{await api.executeBatch(auth)}catch(e){error=e}assert.ok(error,mode);assert.equal(error.receipt.terminal_state,'FAILED_ROLLED_BACK');assert.equal(surface.root.children.length,0)}
  const{api,surface}=await load();const first=await api.executeBatch(authority(api,'B00_ROOT'));const auth=authority(api,'B10_L0_ASSETS',({tickets,rollback_tickets})=>{tickets[20].cancelled=true;delete tickets[20].body_sha256;delete tickets[20].w0_attestation;tickets[20].body_sha256=digest(tickets[20]);tickets[20].w0_attestation='W0-ATTESTED:test';rollback_tickets.length=0});let error;try{await api.executeBatch({...auth,checkpoint:first.checkpoint})}catch(e){error=e}assert.equal(error.receipt.terminal_state,'FAILED_PARTIAL_STATE');assert.ok(error.receipt.unreverted.length);assert.ok(surface.root.children.length);
});

test('generator consumes independent expectations and contains no substitute geometry formulas or old Penpot authority',()=>{
  const generator=fs.readFileSync('scripts/round-trip-reconstruction/generate-penpot-visual-executor-g12.mjs','utf8');assert.doesNotMatch(generator,/viewport\.width\s*-|Math\.max\([^)]*width|oldPenpotGeometry|penpotReadback\.(width|height|x|y)/i);assert.doesNotMatch(generator,/fixture\.occurrence|\.radii\b/);assert.match(generator,/await penpot\.createShapeFromSvgWithImages/);assert.match(generator,/CURRENT_A_USED_DOM_PLUS_PROMOTED_CANONICAL_INPUTS/);assert.equal(JSON.parse(fs.readFileSync('catalog/penpot-executor/g12/capsule/manifest.json')).historical_penpot_readback_authority,false);
});
