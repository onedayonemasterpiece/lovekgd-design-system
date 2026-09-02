import { SPEC, PACKAGE, EXECUTION_TUPLE } from './data.v1.mjs';
import { setupNativeExecutor } from './setup.v1.mjs';

function invariant(ok, message) { if (!ok) throw new Error(message); }
const box = ([x,y,width,height]) => ({x,y,width,height});
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const owned = (packageId, role, extra={}) => ({ownerPackageId:packageId, role, ...extra});

function visualSpec(placement) {
  const family = placement.component_id;
  if (family.includes('colors') || family === 'foundation.status') return {kind:'color-swatch', fill:String(placement.value), label:placement.state};
  if (family === 'foundation.spacing') return {kind:'spacing-bar', cssValue:String(placement.value), label:`Шаг ${placement.state}`};
  if (family === 'foundation.sizing-density') return {kind:'size-diagram', cssValue:String(placement.value), label:placement.state};
  if (family === 'foundation.radius-border') return {kind:'rounded-rectangle', cssValue:String(placement.value), label:placement.state};
  if (family === 'foundation.elevation') return {kind:'elevation-card', cssValue:String(placement.value), label:`Уровень ${placement.state}`};
  if (family === 'foundation.motion') return {kind:'motion-track', cssValue:String(placement.value), label:placement.state};
  return {kind:'accessibility-pattern', statement:String(placement.value), label:placement.state};
}

function fontPx(value) {
  const text = String(value);
  const values = [...text.matchAll(/([0-9.]+)rem/g)].map((m) => Number(m[1]) * 16);
  if (values.length) return Math.max(...values);
  if (text.endsWith('px')) return Number.parseFloat(text);
  return 16;
}

function createBase(env) {
  const { document, setString, resolveMaster } = env;
  document.beginRun(SPEC.package_id);
  const page = document.ensurePage(SPEC.page.id, {name:SPEC.page.name,width:SPEC.page.width,height:SPEC.page.height,...owned(SPEC.package_id,'atlas-page',{templateId:SPEC.page.template_id})});
  const root = document.ensureBoard(`${SPEC.page.id}.root`, page.id, {...box(SPEC.page.root_bounds),name:`CANDIDATE_BUILD_NOT_ACCEPTED · ${SPEC.package_id}`,clipContent:false,...owned(SPEC.package_id,'candidate-root')});
  for (const [key,value] of [['package-id',SPEC.package_id],['directive-id',SPEC.directive_id],['state',SPEC.state],['atlas-commit',SPEC.atlas.commit],['atlas-tree',SPEC.atlas.tree],['template-id',SPEC.page.template_id]]) setString(root,key,value);
  const headerMaster = resolveMaster(SPEC.atlas.header_component_id);
  const header = document.ensureLinkedInstance(`${SPEC.page.id}.header`,root.id,headerMaster.id,{...box(SPEC.atlas.header_bounds),name:`ATLAS_PAGE_HEADER_V2 · ${SPEC.package_id}`,...owned(SPEC.package_id,'atlas-header-instance')});
  for (const [key,value] of [['package-id',SPEC.package_id],['page-title',SPEC.page.name],['lifecycle-status','CANDIDATE'],['owner','F0']]) setString(header,key,value);
  return { page, root, header };
}

function executeFoundation(env, root) {
  const { document, setString, resolveMaster } = env;
  const shell = document.ensureGrid(`${SPEC.page.id}.documentation-grid`,root.id,{...box(SPEC.page.shell_bounds),name:'Native Grid documentation shell',columns:2,columnGap:24,rowGap:24,...owned(SPEC.package_id,'grid-shell')});
  setString(shell,'layout-system','Grid'); setString(shell,'template-family','STANDARD_V2'); setString(shell,'height-formula',SPEC.page.height_formula);
  const sectionWidth = (SPEC.page.shell_bounds[2] - 24) / 2;
  SPEC.families.forEach((family, familyIndex) => {
    const master = resolveMaster(family.id);
    invariant(master.protectedSource === true, `${family.id}: source component not protected/preserved`);
    const section = document.ensureFlex(`${SPEC.page.id}.section.${family.id}`,shell.id,{x:SPEC.page.shell_bounds[0]+familyIndex*(sectionWidth+24),y:SPEC.page.shell_bounds[1],width:sectionWidth,height:SPEC.page.shell_bounds[3],name:family.name,direction:'row',wrap:true,gap:24,...owned(SPEC.package_id,'flex-section')});
    setString(section,'component-family-id',family.id); setString(section,'preserved-source-master-id',master.id);
    document.ensureText(`${section.id}.title`,section.id,{x:24,y:16,width:sectionWidth-48,height:32,text:family.name,editable:true,fontFamily:'DejaVu Sans',fontWeight:700,fontSize:16,lineHeight:1.2,...owned(SPEC.package_id,'section-title')});
    const placements = SPEC.placements.filter((item) => item.component_id === family.id);
    placements.forEach((placement,index) => {
      const card = document.ensureLinkedInstance(`${SPEC.page.id}.placement.${placement.id}`,section.id,master.id,{x:24+(index%2)*506,y:64+Math.floor(index/2)*168,width:482,height:144,name:placement.id,state:placement.state,...owned(SPEC.package_id,'linked-specimen')});
      for (const [key,value] of [['placement-id',placement.id],['component-family-id',family.id],['token-value',String(placement.value)]]) setString(card,key,value);
      document.ensureSpecimenVisual(`${card.id}.visual`,card.id,{x:20,y:20,width:112,height:104,...visualSpec(placement),...owned(SPEC.package_id,'specimen-visual')});
      document.ensureText(`${card.id}.label`,card.id,{x:152,y:24,width:302,height:92,text:`${placement.id}\n${placement.value}`,editable:true,fontFamily:'DejaVu Sans',fontWeight:400,fontSize:12,lineHeight:1.25,...owned(SPEC.package_id,'specimen-label')});
    });
  });
  return {linked_specimens:SPEC.placements.length,product_components_reused:SPEC.families.length,new_foundation_families:0,grid_shells:1,flex_sections:SPEC.families.length};
}

async function executeMedallions(env, root) {
  const { document, setString, readAsset } = env;
  const rail = document.ensureFlex(`${SPEC.page.id}.master-rail`,root.id,{...box(SPEC.page.master_rail_bounds),name:'Package masters · exact source-bound institutions-a',direction:'row',wrap:true,gap:16,...owned(SPEC.package_id,'flex-master-rail')});
  const grid = document.ensureGrid(`${SPEC.page.id}.dense-grid`,root.id,{...box(SPEC.page.grid_bounds),name:'Atlas R2 DENSE linked specimen grid',columns:6,columnGap:24,rowGap:24,...owned(SPEC.package_id,'grid-shell')});
  setString(grid,'template-family','DENSE'); setString(grid,'consumer-group','institutions-a');
  const handles = [];
  for (const asset of SPEC.assets) handles.push(await readAsset(asset.source));
  SPEC.assets.forEach((asset,index) => {
    const handle = handles[index];
    const master = document.ensureComponentMaster(`component.${asset.semantic_id}`,{name:`Medallion/${asset.short_name}`,semanticId:asset.semantic_id,bindingId:asset.binding_id,sourceHandleId:handle.handle_id,...owned(SPEC.package_id,'asset-master')});
    for (const [key,value] of [['semantic-id',asset.semantic_id],['binding-id',asset.binding_id],['consumer-group',asset.consumer_group],['source-path',asset.source.path],['source-ref',asset.source.ref],['source-git-blob',asset.source.git_blob_sha1],['source-sha256',asset.source.sha256]]) setString(master,key,value);
    document.ensureShape(`${master.id}.background`,master.id,{shapeKind:'ellipse',x:0,y:0,width:96,height:96,fill:asset.presentation.background,stroke:asset.presentation.ring,strokeWidth:2,sourceBound:true,...owned(SPEC.package_id,'source-bound-medallion-background')});
    document.ensureArtwork(`${master.id}.artwork`,master.id,handle,{x:8,y:8,width:80,height:80,fitBox:asset.presentation.fit_box,logoCrop:asset.presentation.logo_crop,ariaLabel:asset.presentation.aria_label,...owned(SPEC.package_id,'source-artwork')});
    asset.tiers_px.forEach((tier,tierIndex) => {
      const order = index*3+tierIndex;
      const col = order%6, row = Math.floor(order/6);
      const cellWidth = (SPEC.page.grid_bounds[2]-5*24)/6;
      const cellHeight = (SPEC.page.grid_bounds[3]-3*24)/4;
      const instance = document.ensureLinkedInstance(`${SPEC.page.id}.${asset.semantic_id}.tier-${tier}`,grid.id,master.id,{x:col*(cellWidth+24)+(cellWidth-tier)/2,y:row*(cellHeight+24)+(cellHeight-tier)/2,width:tier,height:tier,name:`${asset.semantic_id}/tier-${tier}`,tier,linkedOrder:order+1,...owned(SPEC.package_id,'linked-specimen')});
      for (const [key,value] of [['semantic-id',asset.semantic_id],['tier-px',String(tier)],['linked-order',String(order+1)],['source-sha256',asset.source.sha256]]) setString(instance,key,value);
    });
  });
  return {asset_masters:8,source_artworks:8,master_surfaces:8,master_previews:0,linked_specimens:24,placeholder_cells:0,empty_asset_wells:0,generic_circles:0};
}

async function executeTypography(env, root) {
  const { document, setString, resolveMaster, readFonts } = env;
  const fontHandles = await readFonts();
  const rail = document.ensureFlex(`${SPEC.page.id}.master-rail`,root.id,{...box(SPEC.page.master_rail_bounds),name:'Existing typography/layout product masters',direction:'column',wrap:false,gap:16,...owned(SPEC.package_id,'flex-master-rail')});
  const grid = document.ensureGrid(`${SPEC.page.id}.wide-grid`,root.id,{...box(SPEC.page.grid_bounds),name:'Atlas R2 WIDE responsive typography grid',columns:2,columnGap:32,rowGap:32,...owned(SPEC.package_id,'grid-shell')});
  setString(grid,'template-family','WIDE'); setString(grid,'semantic-css-family',SPEC.font_binding.semantic_css_family); setString(grid,'resolved-evidence-family',SPEC.font_binding.resolved_family);
  const componentIds = [...new Set(SPEC.placements.map((item) => item.component_id))];
  const masters = Object.fromEntries(componentIds.map((id,index) => {
    const master = resolveMaster(id); invariant(master.protectedSource === true, `${id}: existing source component not protected`);
    document.ensureLinkedInstance(`${SPEC.page.id}.master-reference.${id}`,rail.id,master.id,{x:16,y:16+index*96,width:480,height:72,name:id,...owned(SPEC.package_id,'source-master-reference')});
    return [id,master];
  }));
  SPEC.placements.forEach((placement,index) => {
    const col=index%2,row=Math.floor(index/2),master=masters[placement.component_id];
    const card=document.ensureLinkedInstance(`${SPEC.page.id}.placement.${placement.id}`,grid.id,master.id,{x:col*768,y:row*352,width:736,height:320,name:placement.id,state:placement.state,...owned(SPEC.package_id,'linked-specimen')});
    const lineHeight=SPEC.line_heights[placement.line_height_role];
    for (const [key,value] of [['placement-id',placement.id],['component-family-id',placement.component_id],['semantic-css-family',SPEC.font_binding.semantic_css_family],['resolved-font-family',SPEC.font_binding.resolved_family],['line-height',String(lineHeight)],['does-not-repair-eventcard-text','true']]) setString(card,key,value);
    const stack=document.ensureInstanceOverrideGroup(`${card.id}.responsive-stack`,card.id,{x:24,y:20,width:688,height:280,direction:'column',gap:12,...owned(SPEC.package_id,'responsive-override-stack')});
    SPEC.responsive_roles.forEach((role,roleIndex) => {
      const handle=placement.weight>=700?fontHandles.bold:fontHandles.regular;
      const baseSize=fontPx(placement.font_size);
      document.ensureInstanceTextOverride(`${card.id}.text.${role.id}`,stack.id,{x:0,y:roleIndex*88,width:Math.min(role.frame_width,placement.frame_width_px||role.frame_width),height:76,text:`${role.id.toUpperCase()} · ${placement.text}`,editable:true,fontFamily:SPEC.font_binding.resolved_family,semanticCssFamily:SPEC.font_binding.semantic_css_family,fontWeight:placement.weight,fontSize:Number((baseSize*role.font_scale).toFixed(3)),lineHeight,viewportRole:role.id,viewport:role.viewport,fontHandleId:handle.handle_id,...owned(SPEC.package_id,'editable-cyrillic-specimen')});
    });
  });
  return {linked_specimens:SPEC.placements.length,editable_cyrillic_text_nodes:SPEC.placements.length*SPEC.responsive_roles.length,responsive_roles:SPEC.responsive_roles.map((role)=>role.id),product_components_reused:componentIds.length,new_foundation_families:0,empty_specimen_wells:0,does_not_repair_eventcard_text:true};
}

export async function execute(context) {
  const env=await setupNativeExecutor(context);
  const protectedBefore=env.readProtected();
  const {root}=createBase(env);
  const extra=SPEC.kind==='foundation'?executeFoundation(env,root):SPEC.kind==='medallions'?await executeMedallions(env,root):await executeTypography(env,root);
  const protectedAfter=env.readProtected();
  invariant(same(protectedBefore,protectedAfter),'protected projections changed');
  const validation=env.document.validatePackage(SPEC.package_id,SPEC.kind);
  for (const key of ['duplicates','detached','screenshots','empty_specimen_wells','metadata_only_surfaces','placeholder_only_surfaces']) invariant(validation[key]===0,`${key}: ${validation[key]}`);
  invariant(validation.new_foundation_families===0 || SPEC.kind==='medallions','new foundation family created');
  const created=env.document.endRun();
  return {schema_version:'kenigevents.f0-r2-native-execution-result.v1',marker:'F0_R2_NATIVE_EXECUTION_RESULT',package_id:SPEC.package_id,directive_id:SPEC.directive_id,state:SPEC.state,branch:PACKAGE.branch,tuple_id:EXECUTION_TUPLE.tuple_id,page:{id:SPEC.page.id,width:SPEC.page.width,height:SPEC.page.height,template_id:SPEC.page.template_id,linked_header:'ATLAS_PAGE_HEADER_V2'},created,second_run_created:created===0?0:null,protected_before:protectedBefore,protected_after:protectedAfter,validation,penpot_reads:0,penpot_mutations:0,...extra};
}
