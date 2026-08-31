/* Native, resumable Penpot adapter for F-FOUNDATIONS-SPECIMENS v3.
 * Load this file as an execute_code body, then append:
 * return await runF0FoundationSpecimensV3({penpot, penpotUtils, storage});
 */
const F0_CONFIG = Object.freeze({
  schema: "kenigevents.f0-foundation-native-adapter.v3",
  fileId: "40e06342-8830-80d6-8008-8fc8a3a4cd4f",
  pageName: "03 · Foundations · Current reconstructed specimens · Candidate",
  rootName: "CANDIDATE_BUILD_NOT_ACCEPTED · F-FOUNDATIONS-SPECIMENS · current-reconstructed",
  candidateLabel: "CANDIDATE_BUILD_NOT_ACCEPTED",
  packageCommit: "b749050203cb3d5d62cce118b50784086ff92f38",
  protectedPageId: "c16498cb-b51d-8030-8008-904bd8fc9c53",
  protectedRootIds: ["313fb1ed-0d5c-8095-8008-9108df52b2ce", "313fb1ed-0d5c-8095-8008-912c45090653"],
  writer: "/root/publish_r2",
  protectedProjectionSha256: "ae6ce7d3627f486399f1f8299690ce7f5eb25b86843a67b7970ffea00ebba2d5",
  namespace: "kenigevents-f0-r3",
  maxCreatesPerCall: 3,
  domains: {
    "foundation.colors-and-modes": {name:"Foundation/Specimen/ColorsAndModes", values:{"brand-600":"#a54821","brand-700":"#98401f","brand-800":"#793014","brand-900":"#5f250f","accent-600":"#0f766e","accent-700":"#0f5d57","canvas":"#fbf7ef","canvas-soft":"#f2e7d7","surface":"#fffdf8","surface-strong":"#ffffff","ink":"#221a14","copy":"#44362d","muted":"#6d6259","line":"#e1d3c2","focus":"#0f766e","inverse-surface":"#24211f","inverse-surface-raised":"#292521","header":"#fffaf2"}},
    "foundation.status": {name:"Foundation/Specimen/StatusPairs", values:{"success.surface":"#e6f6e9","success.content":"#0f6c3d","warning.surface":"#fff8db","warning.content":"#5a3b06","danger.surface":"#fff0f0","danger.content":"#a92d2d","info.surface":"#e7f2f7","info.content":"#1f658d"}},
    "foundation.spacing": {name:"Foundation/Specimen/SpacingScale", values:{"1":"0.25rem","2":"0.5rem","3":"0.75rem","4":"1rem","5":"1.25rem","6":"1.5rem","8":"2rem","10":"2.5rem","12":"3rem","16":"4rem"}},
    "foundation.sizing-density": {name:"Foundation/Specimen/SizingDensity", values:{"control_min":"44px","content_max":"1180px","content_wide_max":"1440px","listing_media_height":"clamp(221px, min(13vw, 24svh), 244px)"}},
    "foundation.radius-border": {name:"Foundation/Specimen/Radii", values:{"sm":"0.5rem","md":"0.875rem","lg":"1.25rem","xl":"1.75rem","pill":"999px"}},
    "foundation.elevation": {name:"Foundation/Specimen/Elevation", values:{"1":"0 8px 22px rgba(72,45,25,0.08)","2":"0 18px 45px rgba(72,45,25,0.12)","3":"0 24px 64px rgba(72,45,25,0.18)"}},
    "foundation.motion": {name:"Foundation/Specimen/Motion", values:{"duration_fast":"160ms","duration_base":"220ms","ease_standard":"cubic-bezier(0.2, 0.8, 0.2, 1)","reduced_motion":"mandatory-no-op"}},
    "foundation.accessibility": {name:"Foundation/Specimen/Accessibility", values:{"focus_visible":"distinct outline independent from border","aria_current":"semantic current state plus visible state","aria_disabled":"semantic disabled state plus visible state","safe_area":"env(safe-area-inset-bottom)","status_not_color_only":"status shape or text accompanies color"}}
  },
  placements: []
});

(function buildExactPlacements(config) {
  const order = [
    ["foundation.colors-and-modes", Object.keys(config.domains["foundation.colors-and-modes"].values).map(v=>["color/"+v,v])],
    ["foundation.status", Object.keys(config.domains["foundation.status"].values).map(v=>["status/"+v.replace(".","-"),v])],
    ["foundation.spacing", Object.keys(config.domains["foundation.spacing"].values).map(v=>["spacing/"+v,v])],
    ["foundation.radius-border", Object.keys(config.domains["foundation.radius-border"].values).map(v=>["radius/"+v,v])],
    ["foundation.elevation", Object.keys(config.domains["foundation.elevation"].values).map(v=>["shadow/"+v,v])],
    ["foundation.sizing-density", [["sizing/control-min","control_min"],["sizing/content-max","content_max"],["sizing/content-wide-max","content_wide_max"],["sizing/listing-media-height","listing_media_height"]]],
    ["foundation.motion", [["motion/duration-fast","duration_fast"],["motion/duration-base","duration_base"],["motion/ease-standard","ease_standard"],["motion/reduced","reduced_motion"]]],
    ["foundation.accessibility", [["a11y/focus-visible","focus_visible"],["a11y/aria-current","aria_current"],["a11y/aria-disabled","aria_disabled"],["a11y/safe-area","safe_area"],["a11y/status-not-color-only","status_not_color_only"]]]
  ];
  for (const [componentId, rows] of order) for (const [id,value] of rows) config.placements.push({id,componentId,value});
})(F0_CONFIG);

function f0Assert(ok, message) { if (!ok) throw new Error(message); }
function f0Canonical(value) {
  if (Array.isArray(value)) return "[" + value.map(f0Canonical).join(",") + "]";
  if (value && typeof value === "object") return "{" + Object.keys(value).sort().map(k=>JSON.stringify(k)+":"+f0Canonical(value[k])).join(",") + "}";
  return JSON.stringify(value);
}
async function f0Sha256(value) {
  f0Assert(globalThis.crypto && crypto.subtle, "SHA-256 unavailable; protected digest cannot be proven");
  const bytes = ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : new TextEncoder().encode(typeof value === "string" ? value : f0Canonical(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), b=>b.toString(16).padStart(2,"0")).join("");
}
function f0Stable(shape) {
  const component = shape.component?.();
  return {id:shape.id,name:shape.name,type:shape.type,x:shape.x,y:shape.y,width:shape.width,height:shape.height,hidden:shape.hidden,visible:shape.visible,
    componentId:component?.id || null, componentName:component?.name || null,
    children:(shape.children || []).map(f0Stable)};
}
function f0FindStable(page, key) {
  return page.findShapes().filter(s=>s.getSharedPluginData(F0_CONFIG.namespace,"stable-id")===key && !ancestorIsCopy(s));
}
function ancestorIsCopy(shape) { for(let p=shape.parent;p;p=p.parent) if(p.isComponentCopyInstance?.()) return true; return false; }
function f0SetStable(shape, stableId) { shape.setSharedPluginData(F0_CONFIG.namespace,"stable-id",stableId); }
function f0Guard(storage, run, operation) {
  const live=storage.f0FoundationRunControl;
  f0Assert(live && live.runId===run.runId && live.leaseToken===run.leaseToken && live.cancelToken===run.cancelToken, `lease mismatch before ${operation}`);
  f0Assert(live.state==="ACTIVE" && live.cancelled!==true, `inactive/cancelled before ${operation}`);
  f0Assert(live.writer===F0_CONFIG.writer, `writer mismatch before ${operation}`);
  const lock=storage.f0FoundationActiveWriter;
  f0Assert(!lock || (lock.runId===run.runId && lock.writer===F0_CONFIG.writer), `sole writer conflict before ${operation}`);
  storage.f0FoundationActiveWriter={runId:run.runId,writer:F0_CONFIG.writer};
}
function f0RequireProtectedDigest(run, computed) {
  f0Assert(run.protectedDigest===F0_CONFIG.protectedProjectionSha256,"run is not bound to frozen protected projection");
  f0Assert(computed===F0_CONFIG.protectedProjectionSha256,`stale protected projection: ${computed}`);
}
function f0VerifyCensus({components, roots, instances, screenshots, validation}) {
  const componentIds=components.map(c=>c.id), rootIds=roots.map(s=>s.id), placementIds=instances.map(s=>s.getSharedPluginData(F0_CONFIG.namespace,"placement-id"));
  f0Assert(components.length===8 && new Set(componentIds).size===8,"component census mismatch");
  f0Assert(roots.length===1 && new Set(rootIds).size===1,"root census mismatch");
  f0Assert(instances.length===57 && new Set(placementIds).size===57 && placementIds.every(Boolean),"instance census mismatch");
  f0Assert(instances.every(s=>s.isComponentCopyInstance?.() && s.component?.()),"detached instance found");
  f0Assert(screenshots.length===0,"screenshot shape found");
  f0Assert(validation.length===0,`Penpot validation failed: ${f0Canonical(validation)}`);
  return {componentIds,rootIds,placementIds};
}
function f0Text(penpot,parent,name,chars,x,y,size=14,color="#44362D") {
  const t=penpot.createText(chars); f0Assert(t,`text creation failed: ${name}`); t.name=name; t.fontSize=String(size); t.fontWeight=size>=18?"700":"500"; t.fills=[{fillColor:color,fillOpacity:1}]; t.growType="auto-width"; parent.appendChild(t); penpotUtils.setParentXY(t,x,y); return t;
}
function f0Rect(penpot,parent,name,x,y,w,h,color,r=8) {
  const s=penpot.createRectangle(); s.name=name; s.resize(w,h); s.fills=[{fillColor:color.toUpperCase(),fillOpacity:1}]; s.borderRadius=r; parent.appendChild(s); penpotUtils.setParentXY(s,x,y); return s;
}
function f0ApplyValue(penpot,instance,componentId,key,value) {
  const label=(instance.children||[]).find(s=>s.getSharedPluginData(F0_CONFIG.namespace,"role")==="label");
  const visual=(instance.children||[]).find(s=>s.getSharedPluginData(F0_CONFIG.namespace,"role")==="visual");
  if(label) label.characters=`${key}  ·  ${value}`;
  if(!visual) return;
  visual.fills=[{fillColor:"#F2E7D7",fillOpacity:1}]; visual.borderRadius=8; visual.shadows=[];
  if(componentId==="foundation.colors-and-modes" || componentId==="foundation.status") visual.fills=[{fillColor:String(value).toUpperCase(),fillOpacity:1}];
  if(componentId==="foundation.spacing") visual.resize(Math.max(4,Math.min(176,parseFloat(value)*16)),20);
  if(componentId==="foundation.radius-border") visual.borderRadius=Math.min(48,value.includes("rem")?parseFloat(value)*16:48);
  if(componentId==="foundation.elevation") { const m=String(value).match(/0 (\d+)px (\d+)px rgba\((\d+),(\d+),(\d+),([\d.]+)\)/); if(m) visual.shadows=[{style:"drop-shadow",offsetX:0,offsetY:+m[1],blur:+m[2],spread:0,hidden:false,color:{color:`#${[m[3],m[4],m[5]].map(n=>(+n).toString(16).padStart(2,"0")).join("").toUpperCase()}`,opacity:+m[6]}}]; }
  if(componentId==="foundation.accessibility" && key==="focus_visible") visual.strokes=[{strokeColor:"#0F766E",strokeWidth:3,strokeStyle:"solid"}]; else visual.strokes=[];
}
function f0CreateMaster(penpot,page,componentId,index) {
  const spec=F0_CONFIG.domains[componentId], first=Object.entries(spec.values)[0];
  const b=penpot.createBoard(); b.name=spec.name; b.resize(416,128); b.fills=[{fillColor:"#FFFDF8",fillOpacity:1}]; b.strokes=[{strokeColor:"#E1D3C2",strokeWidth:1,strokeStyle:"solid"}]; b.borderRadius=14; b.clipContent=false; b.x=1560; b.y=index*164;
  f0SetStable(b,`component/${componentId}`); b.setSharedPluginData(F0_CONFIG.namespace,"candidate-label",F0_CONFIG.candidateLabel);
  const visual=f0Rect(penpot,b,"Value visual",20,44,80,64,"#F2E7D7",8); visual.setSharedPluginData(F0_CONFIG.namespace,"role","visual");
  const label=f0Text(penpot,b,"Value label",`${first[0]}  ·  ${typeof first[1]==="object"?f0Canonical(first[1]):first[1]}`,120,56,14); label.setSharedPluginData(F0_CONFIG.namespace,"role","label");
  f0Text(penpot,b,"Domain label",componentId,20,16,12,"#6D6259"); f0ApplyValue(penpot,b,componentId,first[0],first[1]);
  const component=penpot.library.local.createComponent([b]); component.name=spec.name; component.setSharedPluginData(F0_CONFIG.namespace,"stable-id",componentId); return {shape:b,component};
}
function f0RootHeight() {
  let h=112; for(const id of Object.keys(F0_CONFIG.domains)){ const n=F0_CONFIG.placements.filter(p=>p.componentId===id).length; h+=48+Math.ceil(n/3)*152+28; } return h;
}
function f0CreateRoot(penpot) {
  const root=penpot.createBoard(); root.name=F0_CONFIG.rootName; root.resize(1440,f0RootHeight()); root.fills=[{fillColor:"#FBF7EF",fillOpacity:1}]; root.clipContent=false; root.x=0; root.y=0; f0SetStable(root,"root"); root.setSharedPluginData(F0_CONFIG.namespace,"candidate-label",F0_CONFIG.candidateLabel); root.setSharedPluginData(F0_CONFIG.namespace,"owner-review-state","NOT_ACCEPTED"); f0Text(penpot,root,"Candidate title","Foundation specimens · current reconstructed",48,36,28,"#221A14"); return root;
}
function f0PlacementXY(placement) {
  let y=112; for(const id of Object.keys(F0_CONFIG.domains)){ const rows=F0_CONFIG.placements.filter(p=>p.componentId===id); if(id===placement.componentId){ const i=rows.findIndex(p=>p.id===placement.id); return {x:48+(i%3)*448,y:y+48+Math.floor(i/3)*152,sectionY:y}; } y+=48+Math.ceil(rows.length/3)*152+28; } throw new Error("placement domain missing");
}
async function runF0FoundationSpecimensV3({penpot,penpotUtils,storage}) {
  const run=storage.f0FoundationRunControl; f0Assert(run,"storage.f0FoundationRunControl required");
  f0Assert(penpot.currentFile?.id===F0_CONFIG.fileId,"wrong Penpot file"); f0Assert(F0_CONFIG.placements.length===57,"placement contract drift"); f0Assert(Object.keys(F0_CONFIG.domains).length===8,"component contract drift");
  const protectedPage=penpot.currentFile.pages.find(p=>p.id===F0_CONFIG.protectedPageId); f0Assert(protectedPage,"protected page missing");
  const protectedShapes=F0_CONFIG.protectedRootIds.map(id=>protectedPage.getShapeById(id)); f0Assert(protectedShapes.every(Boolean),"protected root missing");
  const protectedBefore=await f0Sha256(protectedShapes.map(f0Stable));
  f0RequireProtectedDigest(run,protectedBefore);
  let page=penpot.currentFile.pages.find(p=>p.name===F0_CONFIG.pageName); let created=0;
  if(!page){ f0Guard(storage,run,"create-page"); const block=penpot.history.undoBlockBegin(); try{page=penpot.createPage();page.name=F0_CONFIG.pageName;page.setSharedPluginData(F0_CONFIG.namespace,"candidate-label",F0_CONFIG.candidateLabel);created++;}finally{penpot.history.undoBlockFinish(block);} return {status:"OPEN_PAGE_REQUIRED",pageId:page.id,protectedDigest:protectedBefore,created}; }
  if(penpot.currentPage?.id!==page.id) return {status:"OPEN_PAGE_REQUIRED",pageId:page.id,protectedDigest:protectedBefore,created:0};
  const components={};
  for(const [i,id] of Object.keys(F0_CONFIG.domains).entries()){
    const matches=penpot.library.local.components.filter(c=>c.getSharedPluginData(F0_CONFIG.namespace,"stable-id")===id); f0Assert(matches.length<=1,`duplicate component stable id: ${id}`);
    if(matches.length) components[id]=matches[0]; else { if(created>=F0_CONFIG.maxCreatesPerCall) return {status:"RESUME_REQUIRED",phase:"components",created,protectedDigest:protectedBefore}; f0Guard(storage,run,`component:${id}`); const block=penpot.history.undoBlockBegin(); try{components[id]=f0CreateMaster(penpot,page,id,i).component;created++;}finally{penpot.history.undoBlockFinish(block);} }
  }
  let roots=f0FindStable(page,"root"); f0Assert(roots.length<=1,"duplicate managed root"); let root=roots[0];
  if(!root){ if(created>=F0_CONFIG.maxCreatesPerCall) return {status:"RESUME_REQUIRED",phase:"root",created,protectedDigest:protectedBefore}; f0Guard(storage,run,"root"); const block=penpot.history.undoBlockBegin(); try{root=f0CreateRoot(penpot);created++;}finally{penpot.history.undoBlockFinish(block);} }
  for(const [id,spec] of Object.entries(F0_CONFIG.domains)){ const xy=f0PlacementXY(F0_CONFIG.placements.find(p=>p.componentId===id)); if(!(root.children||[]).some(s=>s.getSharedPluginData(F0_CONFIG.namespace,"section")===id)){ if(created>=F0_CONFIG.maxCreatesPerCall) return {status:"RESUME_REQUIRED",phase:"sections",created,protectedDigest:protectedBefore}; f0Guard(storage,run,`section:${id}`); const block=penpot.history.undoBlockBegin(); try{const t=f0Text(penpot,root,`Section · ${id}`,id,48,xy.sectionY+12,18,"#221A14");t.setSharedPluginData(F0_CONFIG.namespace,"section",id);created++;}finally{penpot.history.undoBlockFinish(block);} } }
  for(const placement of F0_CONFIG.placements){
    const matches=(root.children||[]).filter(s=>s.getSharedPluginData(F0_CONFIG.namespace,"placement-id")===placement.id); f0Assert(matches.length<=1,`duplicate placement: ${placement.id}`); if(matches.length) continue;
    if(created>=F0_CONFIG.maxCreatesPerCall) return {status:"RESUME_REQUIRED",phase:"instances",created,protectedDigest:protectedBefore};
    f0Guard(storage,run,`placement:${placement.id}`); const block=penpot.history.undoBlockBegin(); try{const inst=components[placement.componentId].instance();root.appendChild(inst);const xy=f0PlacementXY(placement);penpotUtils.setParentXY(inst,xy.x,xy.y);inst.setSharedPluginData(F0_CONFIG.namespace,"placement-id",placement.id);f0ApplyValue(penpot,inst,placement.componentId,placement.value,F0_CONFIG.domains[placement.componentId].values[placement.value]);created++;}finally{penpot.history.undoBlockFinish(block);}
  }
  const managedComponents=Object.keys(F0_CONFIG.domains).map(id=>penpot.library.local.components.find(c=>c.getSharedPluginData(F0_CONFIG.namespace,"stable-id")===id)).filter(Boolean);
  roots=f0FindStable(page,"root");
  const instances=(root.children||[]).filter(s=>s.getSharedPluginData(F0_CONFIG.namespace,"placement-id"));
  const screenshots=penpotUtils.findShapes(s=>s.type==="image" || (s.fills||[]).some?.(f=>f.fillImage),root);
  const validation=penpot.currentFile.validate(); const protectedAfter=await f0Sha256(F0_CONFIG.protectedRootIds.map(id=>f0Stable(protectedPage.getShapeById(id))));
  f0Assert(protectedBefore===protectedAfter,"protected free-page digest changed");
  const census=f0VerifyCensus({components:managedComponents,roots,instances,screenshots,validation});
  const bytes=await root.export({type:"png",scale:1}); f0Assert(bytes && bytes.length>0,"native export empty"); const exportSha256=await f0Sha256(bytes);
  f0Guard(storage,run,"post-export-before-version");
  if(created>0) { await penpot.currentFile.saveVersion(`F0 foundation candidate ${run.runId}`); f0Guard(storage,run,"post-version"); return {schema:F0_CONFIG.schema,status:"RERUN_FOR_IDEMPOTENCY",createdThisRun:created,pageId:page.id,rootId:root.id,protectedDigestBefore:protectedBefore,protectedDigestAfter:protectedAfter,export:{nonempty:true,bytes:bytes.length,sha256:exportSha256},census}; }
  storage.f0FoundationActiveWriter=null;
  return {schema:F0_CONFIG.schema,status:"CANDIDATE_READBACK_VERIFIED",candidateLabel:F0_CONFIG.candidateLabel,ownerReviewState:"NOT_ACCEPTED",fileId:F0_CONFIG.fileId,pageId:page.id,rootId:root.id,counts:{components:managedComponents.length,roots:roots.length,instances:instances.length,detached:0,screenshots:screenshots.length},stableIds:census,created,secondRunCreated:0,protectedProjectionSha256:F0_CONFIG.protectedProjectionSha256,protectedDigestBefore:protectedBefore,protectedDigestAfter:protectedAfter,validation,export:{nonempty:true,bytes:bytes.length,sha256:exportSha256},runId:run.runId,writer:F0_CONFIG.writer};
}

if (typeof module !== "undefined" && module.exports) module.exports={F0_CONFIG,f0Canonical,f0Guard,f0RequireProtectedDigest,f0VerifyCensus,f0PlacementXY,runF0FoundationSpecimensV3};
