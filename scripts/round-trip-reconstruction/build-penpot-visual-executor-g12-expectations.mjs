#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root=path.resolve(process.cwd());
const astroRoot=path.resolve(process.argv[2]||process.env.ASTRO_G12_ROOT||'../events-bot-new/w2-free-collection-visual-evidence-g12');
const astroHead='c7c3e2367db8fd8865a735c8b9f5df1ef2b6efd1';
const astroBranch='w2-free-collection-visual-evidence-g12';
const evidenceDir='site/evidence/free-collection-g12';
const outDir=path.join(root,'catalog/penpot-executor/g12');
const sha=(bytes)=>createHash('sha256').update(bytes).digest('hex');
const stable=(value)=>`${JSON.stringify(value,null,2)}\n`;
const read=async(rel)=>readFile(path.join(astroRoot,rel));
const json=async(rel)=>JSON.parse(await read(rel));
const git=(args)=>execFileSync('git',['-C',astroRoot,...args],{encoding:'utf8'}).trim();
const assert=(condition,code)=>{if(!condition)throw new Error(code)};
const relBox=(box,rootBox)=>({x:+(box.x-rootBox.x).toFixed(3),y:+(box.y-rootBox.y).toFixed(3),width:box.width,height:box.height});
const keyOf=(node)=>{
  const a=node.attributes||{};
  if(node.classes.includes('event-card__media-link'))return'media-link'; if(node.classes.includes('event-card__body'))return'body'; if(node.classes.includes('event-card__utility-row'))return'utility-row';
  if('data-card-media-shell'in a)return'media-frame'; if('data-card-image'in a)return'image'; if('data-card-title'in a)return'title';
  if('data-card-type'in a)return'event-type'; if('data-card-meta'in a)return'occurrence'; if('data-card-status'in a)return'admission'; if('data-card-place'in a)return'place';
  if('data-native-share'in a)return'action.share'; if(a['data-feedback-action']==='like')return'action.like'; if(a['data-feedback-action']==='not_interested')return'action.not_interested'; if('data-calendar-action'in a)return'action.calendar';
  return null;
};
const styleOf=(node)=>Object.fromEntries(['fontFamily','fontStyle','fontWeight','fontSize','lineHeight','letterSpacing','color','backgroundColor','borderTopWidth','borderTopColor','borderTopLeftRadius','borderTopRightRadius','borderBottomRightRadius','borderBottomLeftRadius','display','visibility','opacity','objectFit','objectPosition','overflow','flexDirection','alignItems','justifyContent','gap','paddingTop','paddingRight','paddingBottom','paddingLeft'].map((k)=>[k,node.computed[k]]));
const sameBox=(a,b)=>['x','y','width','height'].every((key)=>Math.abs(Number(a?.[key])-Number(b?.[key]))<0.01);
const exactText=(node,all,id)=>node.text_direct??all.find((candidate)=>candidate!==node&&String(candidate.owner_event_id)===String(id)&&typeof candidate.text_direct==='string'&&candidate.text_direct.length&&(sameBox(candidate.box,node.box)||(Math.abs(candidate.box.x-node.box.x)<0.01&&Math.abs(candidate.box.y-node.box.y)<0.01&&candidate.box.width<=node.box.width+0.01&&candidate.box.height<=node.box.height+0.01)))?.text_direct??null;
function cardModel(region,fixtureId){
  const id=fixtureId.replace('event.real.',''); const all=[region.root,...region.descendants];
  const card=all.find((n)=>n.data['data-event-card']!==undefined&&n.data['data-event-id']===id); assert(card,`CARD_MISSING:${region.id}:${fixtureId}`);
  const slots={};
  for(const node of all.filter((n)=>n.owner_event_id===id)){const key=keyOf(node);if(key&&!slots[key])slots[key]={box:relBox(node.box,card.box),style:styleOf(node),text:exactText(node,all,id),line_fragments:node.line_fragments.map((b)=>relBox(b,card.box)),attributes:{src:node.attributes.src||null,'data-card-authoritative-fit':node.attributes['data-card-authoritative-fit']||null,'data-protected-crop-reason':node.attributes['data-protected-crop-reason']||null}};}
  for(const required of ['media-link','media-frame','image','body','utility-row','title','event-type','occurrence','admission','place','action.share','action.like','action.not_interested'])assert(slots[required],`CARD_SLOT_MISSING:${region.id}:${fixtureId}:${required}`);
  return{box:{width:card.box.width,height:card.box.height},slots,actions:['share','like','not_interested','calendar'].filter((name)=>slots[`action.${name}`]),calendar_visible:Boolean(slots['action.calendar'])};
}

assert(git(['rev-parse','HEAD'])===astroHead,'ASTRO_HEAD_MISMATCH');
assert(git(['branch','--show-current'])===astroBranch,'ASTRO_BRANCH_MISMATCH');
const astroTree=git(['rev-parse','HEAD^{tree}']);
const files=['evidence-index.json','fixture-input.json','regions.json','runtime-font-manifest.json','captures-manifest.json','export-readback-map.json','root-receipt-contract.json'];
const artifacts=[]; for(const name of files){const bytes=await read(`${evidenceDir}/${name}`);artifacts.push({path:`${evidenceDir}/${name}`,git_blob_sha1:git(['rev-parse',`HEAD:${evidenceDir}/${name}`]),sha256:sha(bytes),bytes:bytes.length});}
const binding={schema:'kenigevents.astro-current-a-evidence-binding.g12.v1',repository:'onedayonemasterpiece/events-bot-new',branch:astroBranch,head:astroHead,tree:astroTree,base:'64f75d10f7aff33fa616cee212878bd9d03673b1',artifacts};
const regionDoc=await json(`${evidenceDir}/regions.json`); const fixtureDoc=await json(`${evidenceDir}/fixture-input.json`); const fonts=await json(`${evidenceDir}/runtime-font-manifest.json`); const captures=await json(`${evidenceDir}/captures-manifest.json`);
const fontSourceBinding=JSON.parse(await readFile(path.join(root,'catalog/penpot-executor/g14/font-source-binding.json')));
assert(fontSourceBinding.family==='DejaVu Sans','FONT_SOURCE_FAMILY_MISMATCH');assert(fontSourceBinding.required_weights.join(',')==='400,700','FONT_SOURCE_WEIGHTS_MISMATCH');
assert(fontSourceBinding.frozen_astro_evidence.runtime_font_manifest_sha256===artifacts.find((a)=>a.path.endsWith('/runtime-font-manifest.json')).sha256,'FONT_SOURCE_EVIDENCE_MISMATCH');
const resolvedFont=(style)=>({family:fontSourceBinding.family,weight:Number.parseInt(style.fontWeight,10)>=700?700:400,source_binding_sha256:fontSourceBinding.content_sha256});
const applyResolvedFonts=(card)=>{for(const slot of Object.values(card.slots))if(slot.text!==null)slot.resolved_font=resolvedFont(slot.style);return card};
const fixtures=Object.fromEntries(fixtureDoc.fixtures.map((f)=>[f.fixture_id,{title:f.preview_event.title,city:f.preview_event.city,venue:f.preview_event.venue_name,place:[f.preview_event.city,f.preview_event.venue_name].filter(Boolean).join(' · '),event_type:f.preview_event.event_type,status:f.preview_event.status_label,likes:f.preview_event.likes_count||0,shares:f.preview_event.shares_count||0,media:{...fixtureDoc.media.find((m)=>m.fixture_id===f.fixture_id),width:f.preview_event.image_assets?.[0]?.width||null,height:f.preview_event.image_assets?.[0]?.height||null}}]));
const caseRegions=regionDoc.regions.filter((r)=>r.level==='L2_EVENTCARD');
const cases=caseRegions.map((region)=>{const fixtureId=region.fixture_ids[0];const card=applyResolvedFonts(cardModel(region,fixtureId));assert(card.slots.occurrence.text,`OCCURRENCE_SLOT_TEXT_MISSING:${region.id}:${fixtureId}`);return{case_id:region.id,variant:region.id.replace(/^eventcard\./,'').replace(/\.8006$|\.2182$/,''),fixture_id:fixtureId,viewport:region.id.includes('.desktop')?'desktop':'mobile',source_region_id:region.id,source_capture_sha256:captures.captures.find((c)=>c.region_id===region.id).sha256,...card};});
const groups=regionDoc.regions.filter((r)=>r.level==='L3_ROWS_AND_GROUPS').map((region)=>{
  const all=[region.root,...region.descendants]; const heading=all.find((n)=>n.tag==='h2'); const grid=all.find((n)=>'data-search-collection-results'in n.attributes||'data-search-collection-exhibitions'in n.attributes);
  const instances=region.fixture_ids.map((fixtureId)=>{const model=applyResolvedFonts(cardModel(region,fixtureId));assert(model.slots.occurrence.text,`OCCURRENCE_SLOT_TEXT_MISSING:${region.id}:${fixtureId}`);const id=fixtureId.replace('event.real.','');const card=all.find((n)=>n.data['data-event-card']!==undefined&&n.data['data-event-id']===id);return{...model,fixture_id:fixtureId,box:relBox(card.box,region.root.box)};});
  const rows=[];for(const instance of instances){let row=rows.find((x)=>Math.abs(x.y-instance.box.y)<1);if(!row){row={y:instance.box.y,fixture_ids:[],heights:[]};rows.push(row)}row.fixture_ids.push(instance.fixture_id);row.heights.push(instance.box.height)}
  return{group_id:region.id,viewport:region.id.startsWith('row.desktop')?'desktop':'mobile',source_region_id:region.id,source_capture_sha256:captures.captures.find((c)=>c.region_id===region.id).sha256,box:{width:region.root.box.width,height:region.root.box.height},heading:{text:heading?.text_direct||'',box:heading?relBox(heading.box,region.root.box):null,style:heading?styleOf(heading):null},count:region.fixture_ids.length,grid:{box:grid?relBox(grid.box,region.root.box):null,gap:grid?.computed.gap||null,rowGap:grid?.computed.rowGap||null,columnGap:grid?.computed.columnGap||null},rows:rows.map((r)=>({...r,equal_height:new Set(r.heights).size===1})),instances};
});
const assetPaths={
  'action-share':'catalog/ui-assets/v1/icons/action-share.svg','action-like':'catalog/ui-assets/v1/icons/action-favorite-outline.svg','action-not_interested':'catalog/ui-assets/v1/icons/action-not-interested.svg','action-calendar':'catalog/ui-assets/v1/icons/action-calendar-add.svg',
  'nav-afisha':'catalog/ui-assets/v1/icons/nav-afisha.svg','nav-dates':'catalog/ui-assets/v1/icons/nav-dates.svg','nav-search':'catalog/ui-assets/v1/icons/nav-search.svg','nav-personal':'catalog/ui-assets/v1/icons/nav-personal.svg','free-listing-medallion':'catalog/ui-assets/v1/illustrations/free-listing-medallion.svg',
};
const assets=[];for(const[id,assetPath]of Object.entries(assetPaths)){const bytes=await readFile(path.join(root,assetPath));assets.push({id,path:assetPath,sha256:sha(bytes),kind:id.startsWith('action-')?'action':id.startsWith('nav-')?'mobile-nav':'medallion'});}
const expectations={schema:'kenigevents.penpot-executor-independent-current-a-expectations.g12.v1',status:'CURRENT_A_USED_VALUES_AUTHORITY',provenance:{astro_binding_sha256:null,regions_sha256:artifacts.find((a)=>a.path.endsWith('/regions.json')).sha256,fixture_input_sha256:artifacts.find((a)=>a.path.endsWith('/fixture-input.json')).sha256,font_manifest_sha256:artifacts.find((a)=>a.path.endsWith('/runtime-font-manifest.json')).sha256,captures_manifest_sha256:artifacts.find((a)=>a.path.endsWith('/captures-manifest.json')).sha256,font_source_binding_sha256:fontSourceBinding.content_sha256},component_model:{semantic_identity:'component.event-card.free-collection',master_count:1,variant_container:true,variant_axis:'structural_context',variants:cases.map((c)=>c.variant)},assets,fixtures,cases,groups,runtime_fonts:{family:fontSourceBinding.family,required_weights:fontSourceBinding.required_weights,source_binding_sha256:fontSourceBinding.content_sha256,source_manifest_sha256:fontSourceBinding.frozen_astro_evidence.runtime_font_manifest_sha256,font_ready:fonts.font_ready}};
await mkdir(outDir,{recursive:true}); const bindingBytes=Buffer.from(stable(binding)); await writeFile(path.join(outDir,'astro-evidence-binding.json'),bindingBytes); expectations.provenance.astro_binding_sha256=sha(bindingBytes); await writeFile(path.join(outDir,'independent-expectations.json'),stable(expectations));
console.log(JSON.stringify({binding_sha256:sha(bindingBytes),expectations_sha256:sha(Buffer.from(stable(expectations))),astro_head:astroHead,astro_tree:astroTree,cases:cases.length,groups:groups.length}));
