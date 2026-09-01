import { SPEC } from './data.v1.mjs';

function invariant(ok, message) { if (!ok) throw new Error(message); }
function b(v) { return {x:v[0],y:v[1],width:v[2],height:v[3]}; }
function put(doc,node,key,value){ invariant(typeof value==='string',`plugin data must be string: ${key}`); doc.setSharedPluginData(node,'kenigevents-atlas-r2',key,value); }
function count(doc,role){ return doc.countRole(role,SPEC.package_id); }

function header(doc,root){
  const master=doc.ensureComponentMaster('component.ATLAS_PAGE_HEADER_V2',{name:'ATLAS_PAGE_HEADER_V2',role:'atlas-header-master',ownerPackageId:SPEC.package_id,sourceAtlasCommit:SPEC.atlas.commit});
  put(doc,master,'stable-id','ATLAS_PAGE_HEADER_V2'); put(doc,master,'atlas-source-commit',SPEC.atlas.commit);
  const instance=doc.ensureLinkedInstance(`${SPEC.page.id}.header`,root.id,master.id,{...b(SPEC.page.header_bounds),name:`ATLAS_PAGE_HEADER_V2 · ${SPEC.package_id}`,role:'atlas-header-instance',ownerPackageId:SPEC.package_id});
  put(doc,instance,'package-id',SPEC.package_id); put(doc,instance,'page-title',SPEC.page.name); put(doc,instance,'lifecycle-status','CANDIDATE');
}

function base(doc){
  invariant(doc?.kind==='native-like-document-v1','native document adapter required');
  const protectedBefore=doc.protectedDigest(); doc.beginRun(SPEC.package_id);
  const page=doc.ensurePage(SPEC.page.id,{name:SPEC.page.name,width:SPEC.page.width,height:SPEC.page.height,role:'atlas-page',ownerPackageId:SPEC.package_id,templateId:SPEC.page.template_id});
  for(const [k,v] of [['package-id',SPEC.package_id],['directive-id',SPEC.directive_id],['state',SPEC.state],['atlas-commit',SPEC.atlas.commit],['template-id',SPEC.page.template_id]]) put(doc,page,k,v);
  const root=doc.ensureBoard(`${SPEC.page.id}.root`,page.id,{...b(SPEC.page.root_bounds),name:`CANDIDATE_BUILD_NOT_ACCEPTED · ${SPEC.package_id}`,role:'candidate-root',ownerPackageId:SPEC.package_id,clipContent:false});
  put(doc,root,'candidate-label','CANDIDATE_BUILD_NOT_ACCEPTED'); put(doc,root,'owner-review-state','NOT_ACCEPTED'); header(doc,root);
  return {root,protectedBefore};
}

function finish(doc,protectedBefore,extra={}){
  const protectedAfter=doc.protectedDigest(); invariant(protectedBefore===protectedAfter,'protected projections changed');
  const created=doc.endRun(),detached=doc.countDetachedInstances(SPEC.package_id),screenshots=doc.countScreenshots(SPEC.package_id);
  invariant(detached===0,'detached instance found'); invariant(screenshots===0,'screenshot node found');
  return {schema_version:'kenigevents.f0-native-execution-result.v1',state:SPEC.state,package_id:SPEC.package_id,directive_id:SPEC.directive_id,page_id:SPEC.page.id,page_width:SPEC.page.width,page_height:SPEC.page.height,template_id:SPEC.page.template_id,linked_header:'ATLAS_PAGE_HEADER_V2',created,detached,screenshots,protected_before:protectedBefore,protected_after:protectedAfter,penpot_reads:0,penpot_mutations:0,...extra};
}

function foundation(doc,root){
  const shell=doc.ensureGrid(`${SPEC.page.id}.documentation-grid`,root.id,{...b(SPEC.page.shell_bounds),name:'Native Grid/Flex documentation shell',role:'grid-shell',ownerPackageId:SPEC.package_id,columns:2,columnGap:24,rowGap:24});
  put(doc,shell,'layout-system','Grid/Flex'); put(doc,shell,'template-family','STANDARD_V2');
  SPEC.families.forEach((family,fi)=>{
    const master=doc.ensureComponentMaster(`component.${family.id}`,{name:family.name,role:'product-component-master',ownerPackageId:SPEC.package_id,stableFamilyId:family.id,sourceHead:SPEC.source_authority.head});
    put(doc,master,'stable-family-id',family.id); put(doc,master,'preserved-product-component','true'); put(doc,master,'source-head',SPEC.source_authority.head);
    doc.ensureText(`${master.id}.label`,master.id,{text:family.name,editable:true,fontFamily:'DejaVu Sans',fontWeight:700,fontSize:14,lineHeight:1.2,role:'component-content',ownerPackageId:SPEC.package_id});
    const width=(SPEC.page.shell_bounds[2]-24)/2;
    const section=doc.ensureFlex(`${SPEC.page.id}.section.${family.id}`,shell.id,{x:SPEC.page.shell_bounds[0]+fi*(width+24),y:SPEC.page.shell_bounds[1],width,height:SPEC.page.shell_bounds[3],name:family.name,role:'flex-section',ownerPackageId:SPEC.package_id,direction:'row',wrap:true,gap:24});
    put(doc,section,'component-family-id',family.id);
    doc.ensureText(`${section.id}.title`,section.id,{text:family.name,editable:true,fontFamily:'DejaVu Sans',fontWeight:700,fontSize:16,lineHeight:1.2,role:'section-title',ownerPackageId:SPEC.package_id});
    SPEC.placements.filter(p=>p.component_id===family.id).forEach((p,i)=>{
      const card=doc.ensureLinkedInstance(`${SPEC.page.id}.placement.${p.id}`,section.id,master.id,{x:section.x+(i%2)*506,y:section.y+64+Math.floor(i/2)*168,width:482,height:144,name:p.id,state:p.state,role:'linked-specimen',ownerPackageId:SPEC.package_id});
      put(doc,card,'placement-id',p.id); put(doc,card,'component-family-id',p.component_id); put(doc,card,'token-value',String(p.value));
      doc.ensureText(`${card.id}.label`,card.id,{text:`${p.id} · ${p.value}`,editable:true,fontFamily:'DejaVu Sans',fontWeight:400,fontSize:12,lineHeight:1.25,role:'specimen-label',ownerPackageId:SPEC.package_id});
    });
  });
  invariant(count(doc,'product-component-master')===SPEC.families.length,'master count'); invariant(count(doc,'linked-specimen')===SPEC.placements.length,'specimen count');
  return {product_component_masters:count(doc,'product-component-master'),linked_specimens:count(doc,'linked-specimen'),grid_shells:count(doc,'grid-shell'),flex_sections:count(doc,'flex-section')};
}

function medallion(doc,root){
  const shell=doc.ensureGrid(`${SPEC.page.id}.dense-grid`,root.id,{...b(SPEC.page.grid_bounds),name:'Atlas R2 DENSE medallion grid',role:'grid-shell',ownerPackageId:SPEC.package_id,columns:SPEC.page.columns,columnGap:SPEC.page.gap[0],rowGap:SPEC.page.gap[1]}); put(doc,shell,'template-family','DENSE');
  SPEC.assets.forEach((asset,i)=>{
    const master=doc.ensureComponentMaster(`component.${asset.semantic_id}`,{name:asset.name,role:'asset-master',ownerPackageId:SPEC.package_id,semanticId:asset.semantic_id,sourceSha256:asset.source.sha256,sourcePath:asset.source.path});
    for(const [k,v] of [['semantic-id',asset.semantic_id],['binding-id',asset.binding_id],['source-path',asset.source.path],['source-sha256',asset.source.sha256],['source-git-blob',asset.source.git_blob_sha1]]) put(doc,master,k,v);
    doc.ensureArtwork(`${master.id}.artwork`,master.id,{role:'source-artwork',ownerPackageId:SPEC.package_id,sourcePath:asset.source.path,sourceSha256:asset.source.sha256,mediaType:asset.source.media_type,bytes:asset.source.bytes});
    doc.ensureLinkedInstance(`${SPEC.page.id}.master-preview.${asset.semantic_id}`,shell.id,master.id,{x:SPEC.page.grid_bounds[0]+20+(i%SPEC.page.columns)*(SPEC.page.cell[0]+SPEC.page.gap[0]),y:SPEC.page.grid_bounds[1]+18+Math.floor(i/SPEC.page.columns)*(SPEC.page.cell[1]+SPEC.page.gap[1]),width:64,height:64,name:`${asset.name} · master`,role:'master-preview',ownerPackageId:SPEC.package_id});
    doc.ensureText(`${SPEC.page.id}.label.${asset.semantic_id}`,shell.id,{x:SPEC.page.grid_bounds[0]+100+(i%SPEC.page.columns)*(SPEC.page.cell[0]+SPEC.page.gap[0]),y:SPEC.page.grid_bounds[1]+18+Math.floor(i/SPEC.page.columns)*(SPEC.page.cell[1]+SPEC.page.gap[1]),width:320,height:48,text:asset.name,editable:true,fontFamily:'DejaVu Sans',fontWeight:700,fontSize:14,lineHeight:1.2,role:'semantic-label',ownerPackageId:SPEC.package_id});
    asset.tiers_px.forEach((tier,ti)=>{
      const instance=doc.ensureLinkedInstance(`${SPEC.page.id}.${asset.semantic_id}.tier-${tier}`,shell.id,master.id,{x:SPEC.page.grid_bounds[0]+20+(i%SPEC.page.columns)*(SPEC.page.cell[0]+SPEC.page.gap[0])+ti*72,y:SPEC.page.grid_bounds[1]+112+Math.floor(i/SPEC.page.columns)*(SPEC.page.cell[1]+SPEC.page.gap[1]),width:tier,height:tier,name:`${asset.semantic_id}/tier-${tier}`,tier,order:(i*3)+ti+1,role:'linked-specimen',ownerPackageId:SPEC.package_id});
      put(doc,instance,'semantic-id',asset.semantic_id); put(doc,instance,'tier-px',String(tier)); put(doc,instance,'linked-order',String((i*3)+ti+1)); put(doc,instance,'source-sha256',asset.source.sha256);
    });
  });
  invariant(count(doc,'asset-master')===8,'asset masters'); invariant(count(doc,'master-preview')===8,'master previews'); invariant(count(doc,'linked-specimen')===24,'linked specimens'); invariant(count(doc,'source-artwork')===8,'artwork count');
  return {asset_masters:8,master_previews:8,linked_specimens:24,linked_order_count:24,placeholder_cells:0,empty_asset_wells:0,generic_medallions:0,fallback_assets:0,exact_membership:SPEC.assets.map(a=>a.semantic_id)};
}

function fontPx(value){ const text=String(value); if(text.includes('clamp')){const nums=[...text.matchAll(/([0-9.]+)rem/g)].map(m=>Number(m[1])*16);return Math.max(...nums);} if(text.endsWith('rem'))return Number.parseFloat(text)*16; return Number.parseFloat(text)||16;}
function typography(doc,root){
  const shell=doc.ensureGrid(`${SPEC.page.id}.wide-grid`,root.id,{...b(SPEC.page.grid_bounds),name:'Atlas R2 WIDE typography grid',role:'grid-shell',ownerPackageId:SPEC.package_id,columns:2,columnGap:32,rowGap:32}); put(doc,shell,'template-family','WIDE');
  const ids=[...new Set(SPEC.placements.map(p=>p.component_id))];
  for(const id of ids){ const master=doc.ensureComponentMaster(`component.${id}`,{name:id,role:'product-component-master',ownerPackageId:SPEC.package_id,stableFamilyId:id,sourceHead:SPEC.source_authority.head}); put(doc,master,'stable-family-id',id); put(doc,master,'source-head',SPEC.source_authority.head); }
  SPEC.placements.forEach((p,i)=>{
    const master=`component.${p.component_id}`; const card=doc.ensureLinkedInstance(`${SPEC.page.id}.placement.${p.id}`,shell.id,master,{x:608+(i%2)*768,y:256+Math.floor(i/2)*352,width:736,height:320,name:p.id,state:p.state,role:'linked-specimen',ownerPackageId:SPEC.package_id});
    put(doc,card,'placement-id',p.id); put(doc,card,'component-family-id',p.component_id); const family=SPEC.font_binding.resolved_family, lineHeight=SPEC.line_heights[p.line_height_role]; put(doc,card,'font-family',family); put(doc,card,'line-height',String(lineHeight));
    doc.ensureText(`${card.id}.text`,card.id,{x:24,y:24,width:688,height:232,text:p.text,editable:true,fontFamily:family,fontWeight:p.weight,fontSize:fontPx(p.font_size),lineHeight,role:'editable-cyrillic-specimen',ownerPackageId:SPEC.package_id});
  });
  invariant(count(doc,'linked-specimen')===SPEC.placements.length,'typography specimen count'); invariant(count(doc,'editable-cyrillic-specimen')===SPEC.placements.length,'editable specimen count');
  return {product_component_masters:count(doc,'product-component-master'),linked_specimens:count(doc,'linked-specimen'),editable_cyrillic_specimens:count(doc,'editable-cyrillic-specimen'),does_not_repair_eventcard_text:true};
}

export function execute(document){ const {root,protectedBefore}=base(document); const extra=SPEC.kind==='foundation'?foundation(document,root):SPEC.kind==='medallions'?medallion(document,root):typography(document,root); return finish(document,protectedBefore,extra); }
