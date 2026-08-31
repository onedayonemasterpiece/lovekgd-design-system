/* Native, resumable Penpot adapter for F-FOUNDATIONS-SPECIMENS v3.
 * Load this file as an execute_code body, then append:
 * return await runF0FoundationSpecimensV3({penpot, storage});
 */
const F0_CONFIG = Object.freeze({
  schema: "kenigevents.f0-foundation-native-adapter.v3",
  adapterRevision: "R3.1",
  fileId: "40e06342-8830-80d6-8008-8fc8a3a4cd4f",
  pageName: "03 · Foundations · Current reconstructed specimens · Candidate",
  pageId: "313fb1ed-0d5c-8095-8008-9183322ab3a9",
  rootName: "CANDIDATE_BUILD_NOT_ACCEPTED · F-FOUNDATIONS-SPECIMENS · current-reconstructed",
  candidateLabel: "CANDIDATE_BUILD_NOT_ACCEPTED",
  packageCommit: "b749050203cb3d5d62cce118b50784086ff92f38",
  protectedPageId: "c16498cb-b51d-8030-8008-904bd8fc9c53",
  protectedRootIds: ["313fb1ed-0d5c-8095-8008-9108df52b2ce", "313fb1ed-0d5c-8095-8008-912c45090653"],
  writer: "/root/publish_r2",
  activeRunKey: "asp-active-run-v1",
  runId: "974e8f09-353c-49ca-b19d-982b973e939c",
  leaseToken: "66ae648a076266184812ac30f6fa7f21b8e90050deb1afd7eba8c48230709529",
  cancelToken: "c442552db7cdf652ff4adc70644129ae3b818681b04b0cda21402c8cdf898a20",
  contractSha256: "54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72",
  pageProfileSha256: "a2fbdba547f8829308f88231f96fce0cc54c441f741e99a7a846dcf0333ea461",
  assetRegistrySha256: "bbb07cc7d218d4ff69cc21ee002652b21c9e6c4efdbf65a23b9805f97eb7efb4",
  geometryProofSha256: "5395c56376847d36a6ebc8e5d4988a2b06c4cac9acd27426dd73276620031307",
  protectedProjectionMode: "SAME_RUN_PROBE_THEN_EXECUTE",
  protectedProbeBaseline: {revision:79,chars:84033,utf8Bytes:84034,sha256:"0b00102e348367601fe35de30e06dc22b10883577a22917320955058115fc042"},
  rev79Partial: {componentId:"foundation.colors-and-modes",boardIdSuffix:"918348f8d9c1",visualIdSuffix:"91834928ee42",labelIdSuffix:"9183493eed4f"},
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
function f0Utf8(value) {
  const out=[]; for(const ch of value){const cp=ch.codePointAt(0); if(cp<0x80)out.push(cp);else if(cp<0x800)out.push(0xc0|(cp>>6),0x80|(cp&63));else if(cp<0x10000)out.push(0xe0|(cp>>12),0x80|((cp>>6)&63),0x80|(cp&63));else out.push(0xf0|(cp>>18),0x80|((cp>>12)&63),0x80|((cp>>6)&63),0x80|(cp&63));} return out;
}
async function f0Sha256(value) {
  const input=ArrayBuffer.isView(value)?Array.from(new Uint8Array(value.buffer,value.byteOffset,value.byteLength)):f0Utf8(typeof value==="string"?value:f0Canonical(value));
  const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19], bytes=input.slice(), bitLo=(input.length<<3)>>>0, bitHi=Math.floor(input.length/0x20000000)>>>0; bytes.push(0x80); while(bytes.length%64!==56)bytes.push(0); for(let i=3;i>=0;i--)bytes.push((bitHi>>>(i*8))&255); for(let i=3;i>=0;i--)bytes.push((bitLo>>>(i*8))&255);
  const rotr=(x,n)=>(x>>>n)|(x<<(32-n));
  for(let off=0;off<bytes.length;off+=64){const w=new Array(64);for(let i=0;i<16;i++)w[i]=((bytes[off+i*4]<<24)|(bytes[off+i*4+1]<<16)|(bytes[off+i*4+2]<<8)|bytes[off+i*4+3])>>>0;for(let i=16;i<64;i++){const a=w[i-15],b=w[i-2],s0=rotr(a,7)^rotr(a,18)^(a>>>3),s1=rotr(b,17)^rotr(b,19)^(b>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0;}let [a,b,c,d,e,f,g,hh]=h;for(let i=0;i<64;i++){const s1=rotr(e,6)^rotr(e,11)^rotr(e,25),ch=(e&f)^((~e)&g),t1=(hh+s1+ch+k[i]+w[i])>>>0,s0=rotr(a,2)^rotr(a,13)^rotr(a,22),maj=(a&b)^(a&c)^(b&c),t2=(s0+maj)>>>0;hh=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}h[0]=(h[0]+a)>>>0;h[1]=(h[1]+b)>>>0;h[2]=(h[2]+c)>>>0;h[3]=(h[3]+d)>>>0;h[4]=(h[4]+e)>>>0;h[5]=(h[5]+f)>>>0;h[6]=(h[6]+g)>>>0;h[7]=(h[7]+hh)>>>0;}
  return h.map(x=>x.toString(16).padStart(8,"0")).join("");
}
function f0Stable(shape) {
  const component = shape.component?.();
  return {id:shape.id,name:shape.name,type:shape.type,x:shape.x,y:shape.y,width:shape.width,height:shape.height,hidden:shape.hidden,visible:shape.visible,
    componentId:component?.id || null, componentName:component?.name || null,
    children:(shape.children || []).map(f0Stable)};
}
function f0Walk(root) { const out=[]; const visit=s=>{out.push(s);for(const child of Array.from(s.children||[]))visit(child)}; visit(root); return out; }
function f0FindStable(page, key) { return f0Walk(page.root).filter(s=>s.getSharedPluginData(F0_CONFIG.namespace,"stable-id")===key && !ancestorIsCopy(s)); }
function f0ComponentStable(component) { const marker=component.mainInstance?.()?.getSharedPluginData(F0_CONFIG.namespace,"stable-id")||""; return marker.startsWith("component/")?marker.slice(10):null; }
function ancestorIsCopy(shape) { for(let p=shape.parent;p;p=p.parent) if(p.isComponentCopyInstance?.()) return true; return false; }
function f0SetStable(shape, stableId) { shape.setSharedPluginData(F0_CONFIG.namespace,"stable-id",stableId); }
function f0IdEnds(shape,suffix){return typeof shape?.id==="string"&&shape.id.endsWith(suffix);}
function f0Rev79Partial(page) {
  const exact=F0_CONFIG.rev79Partial,direct=Array.from(page.root.children||[]),boards=f0FindStable(page,`component/${exact.componentId}`);f0Assert(page.id===F0_CONFIG.pageId,"rev79 candidate page id drift");f0Assert(direct.length===2,"rev79 candidate page has nonexact extra shapes");f0Assert(boards.length===1&&f0IdEnds(boards[0],exact.boardIdSuffix),"rev79 partial board missing or drifted");
  const board=boards[0],children=Array.from(board.children||[]),visuals=children.filter(s=>s.getSharedPluginData(F0_CONFIG.namespace,"role")==="visual");f0Assert(board.parent===page.root&&board.name===F0_CONFIG.domains[exact.componentId].name&&board.width===416&&board.height===128&&board.x===1560&&board.y===0&&board.getSharedPluginData(F0_CONFIG.namespace,"candidate-label")===F0_CONFIG.candidateLabel,"rev79 partial board contract drift");f0Assert(children.length===1&&visuals.length===1&&f0IdEnds(visuals[0],exact.visualIdSuffix)&&visuals[0].width===80&&visuals[0].height===64,"rev79 partial visual contract drift");
  const orphans=direct.filter(s=>f0IdEnds(s,exact.labelIdSuffix));f0Assert(orphans.length===1,"rev79 exact orphan missing or duplicated");const label=orphans[0];f0Assert(label.parent===page.root&&label.name==="Value label"&&label.characters==="brand-600  ·  #a54821"&&String(label.fontWeight)==="400"&&!label.getSharedPluginData(F0_CONFIG.namespace,"role")&&!label.getSharedPluginData(F0_CONFIG.namespace,"stable-id"),"rev79 exact orphan contract drift");return {board,visual:visuals[0],label};
}
function f0Guard(penpot, storage, operation) {
  const lock=storage.f0FoundationActiveWriter;
  f0Assert(!lock || (lock.runId===F0_CONFIG.runId && lock.writer===F0_CONFIG.writer), `sole writer conflict before ${operation}`);
  const raw=penpot.currentFile.getSharedPluginData("kenigevents",F0_CONFIG.activeRunKey)||""; let native;
  try { native=JSON.parse(raw); } catch { throw new Error(`native run marker invalid before ${operation}`); }
  f0Assert(native.schema==="kenigevents.asp-run-control.v1" && native.run_id===F0_CONFIG.runId && native.writer_id===F0_CONFIG.writer && native.package_id==="F-FOUNDATIONS-SPECIMENS" && native.state==="ACTIVE" && native.cancelled!==true,`authoritative active run mismatch before ${operation}`);
  f0Assert(native.contract_sha256===F0_CONFIG.contractSha256 && native.page_profile_sha256===F0_CONFIG.pageProfileSha256 && native.asset_registry_sha256===F0_CONFIG.assetRegistrySha256 && native.geometry_proof_sha256===F0_CONFIG.geometryProofSha256,`authoritative run hashes mismatch before ${operation}`);
  const lease=storage.f0FoundationLeaseReceiptV1;
  f0Assert(lease && lease.schema==="kenigevents.asp-lease-receipt.v1" && lease.run_id===native.run_id && lease.writer_id===native.writer_id && lease.state==="ACTIVE" && lease.cancelled!==true && lease.lease_token===F0_CONFIG.leaseToken && lease.cancel_token===F0_CONFIG.cancelToken,`lease/cancel receipt mismatch before ${operation}`);
  storage.f0FoundationActiveWriter={runId:F0_CONFIG.runId,writer:F0_CONFIG.writer}; return {native,lease};
}
function f0Write(penpot, storage, operation, callback) {
  // A synchronous undo block is the smallest recoverable Penpot write unit. The
  // native ACTIVE marker is checked immediately before it; callback must not await.
  f0Guard(penpot,storage,operation); const block=penpot.history.undoBlockBegin();
  try { const result=callback();f0Assert(!(result&&typeof result.then==="function"),`async mutation callback forbidden: ${operation}`);return result; } finally { penpot.history.undoBlockFinish(block); }
}
function f0RequireProtectedDigest(projection, storage) {
  const expected=storage.f0FoundationProtectedProjectionV1;
  f0Assert(expected && expected.schema==="kenigevents.f0-protected-projection.v1" && expected.run_id===F0_CONFIG.runId && expected.file_id===F0_CONFIG.fileId && expected.page_id===F0_CONFIG.protectedPageId && f0Canonical(expected.root_ids)===f0Canonical(F0_CONFIG.protectedRootIds),"missing or stale same-run protected probe binding");
  f0Assert(projection.chars===expected.chars && projection.utf8Bytes===expected.utf8_bytes && projection.sha256===expected.sha256,`protected projection changed after same-run probe: ${f0Canonical(projection)}`);
}
function f0RequireProtectedProbeBaseline(projection) {
  const expected=F0_CONFIG.protectedProbeBaseline;
  f0Assert(projection.chars===expected.chars && projection.utf8Bytes===expected.utf8Bytes && projection.sha256===expected.sha256,`protected probe is not independently frozen rev${expected.revision}: ${f0Canonical(projection)}`);
}
function f0VerifyCensus({components, roots, instances, screenshots, validation}) {
  const componentIds=components.map(c=>c.id), componentStableIds=components.map(f0ComponentStable), rootIds=roots.map(s=>s.id), placementIds=instances.map(s=>s.getSharedPluginData(F0_CONFIG.namespace,"placement-id"));
  f0Assert(components.length===8 && new Set(componentIds).size===8 && f0Canonical([...componentStableIds].sort())===f0Canonical(Object.keys(F0_CONFIG.domains).sort()),"component census mismatch");
  for(const component of components){const stableId=f0ComponentStable(component),main=component.mainInstance?.();f0Assert(main && component.name===F0_CONFIG.domains[stableId].name && main.width===416 && main.height===128,`component master readback mismatch: ${stableId}`);}
  f0Assert(roots.length===1 && new Set(rootIds).size===1,"root census mismatch");
  f0Assert(roots[0].name===F0_CONFIG.rootName && roots[0].width===1440 && roots[0].height===f0RootHeight(),"root geometry mismatch");
  f0Assert(instances.length===57 && new Set(placementIds).size===57 && f0Canonical([...placementIds].sort())===f0Canonical(F0_CONFIG.placements.map(p=>p.id).sort()),"instance census mismatch");
  f0Assert(instances.every(s=>s.isComponentCopyInstance?.() && s.component?.()),"detached instance found");
  for(const instance of instances){const placement=F0_CONFIG.placements.find(p=>p.id===instance.getSharedPluginData(F0_CONFIG.namespace,"placement-id")),xy=f0PlacementXY(placement);f0Assert(f0ComponentStable(instance.component())===placement.componentId,"instance component lineage mismatch");f0Assert(instance.x===roots[0].x+xy.x && instance.y===roots[0].y+xy.y && instance.width===416 && instance.height===128,"instance geometry mismatch");const label=Array.from(instance.children||[]).find(s=>s.getSharedPluginData(F0_CONFIG.namespace,"role")==="label");f0Assert(label?.characters===`${placement.value}  ·  ${F0_CONFIG.domains[placement.componentId].values[placement.value]}`,"instance value readback mismatch");}
  f0Assert(screenshots.length===0,"screenshot shape found");
  f0Assert(validation.length===0,`Penpot validation failed: ${f0Canonical(validation)}`);
  return {componentIds,componentStableIds,rootIds,placementIds};
}
function f0SetParentXY(shape,x,y) { const parent=shape.parent; shape.x=(parent?.x || 0)+x; shape.y=(parent?.y || 0)+y; }
function f0Text(penpot,parent,name,chars,x,y,size=14,color="#44362D") {
  const t=penpot.createText(chars); f0Assert(t,`text creation failed: ${name}`); t.name=name; t.fontSize=String(size); t.fontWeight=size>=18?"700":"400"; t.fills=[{fillColor:color,fillOpacity:1}]; t.growType="auto-width"; parent.appendChild(t); f0SetParentXY(t,x,y); return t;
}
function f0Rect(penpot,parent,name,x,y,w,h,color,r=8) {
  const s=penpot.createRectangle(); s.name=name; s.resize(w,h); s.fills=[{fillColor:color.toUpperCase(),fillOpacity:1}]; s.borderRadius=r; parent.appendChild(s); f0SetParentXY(s,x,y); return s;
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
  page.root.appendChild(b); f0SetStable(b,`component/${componentId}`); b.setSharedPluginData(F0_CONFIG.namespace,"candidate-label",F0_CONFIG.candidateLabel);
  const visual=f0Rect(penpot,b,"Value visual",20,44,80,64,"#F2E7D7",8); visual.setSharedPluginData(F0_CONFIG.namespace,"role","visual");
  const label=f0Text(penpot,b,"Value label",`${first[0]}  ·  ${typeof first[1]==="object"?f0Canonical(first[1]):first[1]}`,120,56,14); label.setSharedPluginData(F0_CONFIG.namespace,"role","label");
  f0Text(penpot,b,"Domain label",componentId,20,16,12,"#6D6259"); f0ApplyValue(penpot,b,componentId,first[0],first[1]);
  const component=penpot.library.local.createComponent([b]); component.name=spec.name; return {shape:b,component};
}
function f0ResumeRev79Partial(penpot,page) {
  const {board,label}=f0Rev79Partial(page),componentId=F0_CONFIG.rev79Partial.componentId,first=Object.entries(F0_CONFIG.domains[componentId].values)[0];board.appendChild(label);f0SetParentXY(label,120,56);label.setSharedPluginData(F0_CONFIG.namespace,"role","label");f0Text(penpot,board,"Domain label",componentId,20,16,12,"#6D6259");f0ApplyValue(penpot,board,componentId,first[0],first[1]);const component=penpot.library.local.createComponent([board]);component.name=F0_CONFIG.domains[componentId].name;return {shape:board,component};
}
function f0RootHeight() {
  let h=112; for(const id of Object.keys(F0_CONFIG.domains)){ const n=F0_CONFIG.placements.filter(p=>p.componentId===id).length; h+=48+Math.ceil(n/3)*152+28; } return h;
}
function f0CreateRoot(penpot,page) {
  const root=penpot.createBoard(); page.root.appendChild(root); root.name=F0_CONFIG.rootName; root.resize(1440,f0RootHeight()); root.fills=[{fillColor:"#FBF7EF",fillOpacity:1}]; root.clipContent=false; root.x=0; root.y=0; f0SetStable(root,"root"); root.setSharedPluginData(F0_CONFIG.namespace,"candidate-label",F0_CONFIG.candidateLabel); root.setSharedPluginData(F0_CONFIG.namespace,"owner-review-state","NOT_ACCEPTED"); f0Text(penpot,root,"Candidate title","Foundation specimens · current reconstructed",48,36,28,"#221A14"); return root;
}
function f0PlacementXY(placement) {
  let y=112; for(const id of Object.keys(F0_CONFIG.domains)){ const rows=F0_CONFIG.placements.filter(p=>p.componentId===id); if(id===placement.componentId){ const i=rows.findIndex(p=>p.id===placement.id); return {x:48+(i%3)*448,y:y+48+Math.floor(i/3)*152,sectionY:y}; } y+=48+Math.ceil(rows.length/3)*152+28; } throw new Error("placement domain missing");
}
async function f0ProtectedProjection(shapes) { const canonical=f0Canonical(shapes.map(f0Stable)); return {chars:canonical.length,utf8Bytes:f0Utf8(canonical).length,sha256:await f0Sha256(canonical)}; }
async function f0ExportBytes(value) { if(value instanceof Uint8Array)return value;if(value instanceof ArrayBuffer)return new Uint8Array(value);if(value?.arrayBuffer)return new Uint8Array(await value.arrayBuffer());if(typeof value==="string"&&value.startsWith("data:")){const raw=value.slice(value.indexOf(",")+1),alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";let bits=0,count=0,out=[];for(const ch of raw.replace(/=+$/,"")){const n=alphabet.indexOf(ch);f0Assert(n>=0,"invalid export base64");bits=(bits<<6)|n;count+=6;if(count>=8){count-=8;out.push((bits>>count)&255)}}return new Uint8Array(out)}throw new Error("unsupported native export result"); }
async function f0FinalizeBatch({penpot,storage,protectedShapes,protectedBefore,phase,created,pageId=null,extra={}}) {
  f0Guard(penpot,storage,`finalize:${phase}:pre`); const after=await f0ProtectedProjection(protectedShapes); f0RequireProtectedDigest(after,storage); f0Assert(after.sha256===protectedBefore.sha256,"protected surface changed in batch");
  const validation=penpot.currentFile.validate(); f0Assert(validation.length===0,`validation failed in ${phase}: ${f0Canonical(validation)}`); f0Guard(penpot,storage,`finalize:${phase}:post-readback`);
  let versionId=null, durableValidation=validation;
  if(created>0){
    const version=await penpot.currentFile.saveVersion(`F0 foundation candidate ${F0_CONFIG.runId} · ${phase}`);versionId=version?.id||null;f0Guard(penpot,storage,`finalize:${phase}:post-version`);
    const durableAfter=await f0ProtectedProjection(protectedShapes);f0RequireProtectedDigest(durableAfter,storage);f0Assert(durableAfter.sha256===protectedBefore.sha256,"protected surface changed after version save");durableValidation=penpot.currentFile.validate();f0Assert(durableValidation.length===0,`durable validation failed in ${phase}: ${f0Canonical(durableValidation)}`);f0Guard(penpot,storage,`finalize:${phase}:post-version-readback`);
  }
  return {schema:F0_CONFIG.schema,status:created>0?"RESUME_REQUIRED_UNKNOWN_OUTCOME_SAFE":"OPEN_PAGE_REQUIRED",phase,created,pageId,protectedDigestBefore:protectedBefore.sha256,protectedDigestAfter:after.sha256,validation,durableValidation,versionId,...extra};
}
async function runF0FoundationSpecimensV3({penpot,storage}) {
  f0Assert(penpot.currentFile?.id===F0_CONFIG.fileId,"wrong Penpot file"); f0Assert(F0_CONFIG.placements.length===57 && Object.keys(F0_CONFIG.domains).length===8,"foundation contract drift"); f0Guard(penpot,storage,"start");
  const protectedPage=penpot.currentFile.pages.find(p=>p.id===F0_CONFIG.protectedPageId); f0Assert(protectedPage,"protected page missing"); const protectedShapes=F0_CONFIG.protectedRootIds.map(id=>protectedPage.getShapeById(id)); f0Assert(protectedShapes.every(Boolean),"protected root missing");
  const protectedBefore=await f0ProtectedProjection(protectedShapes);const probeValidation=penpot.currentFile.validate();f0Assert(probeValidation.length===0,`protected probe validation failed: ${f0Canonical(probeValidation)}`);f0Guard(penpot,storage,"post-protected-preflight");
  if(!storage.f0FoundationProtectedProjectionV1){f0RequireProtectedProbeBaseline(protectedBefore);storage.f0FoundationProtectedProjectionV1={schema:"kenigevents.f0-protected-projection.v1",run_id:F0_CONFIG.runId,file_id:F0_CONFIG.fileId,page_id:F0_CONFIG.protectedPageId,root_ids:[...F0_CONFIG.protectedRootIds],chars:protectedBefore.chars,utf8_bytes:protectedBefore.utf8Bytes,sha256:protectedBefore.sha256};return {schema:F0_CONFIG.schema,status:"PROTECTED_PROBE_BOUND_RERUN_REQUIRED",created:0,secondRunCreated:0,runId:F0_CONFIG.runId,writer:F0_CONFIG.writer,protectedProjection:protectedBefore,validation:probeValidation};}
  f0RequireProtectedDigest(protectedBefore,storage);f0Guard(penpot,storage,"post-protected-binding-check");
  const candidatePages=penpot.currentFile.pages.filter(p=>p.name===F0_CONFIG.pageName);f0Assert(candidatePages.length<=1,"duplicate exact candidate page");let page=candidatePages[0],created=0;if(page)f0Assert(page.id===F0_CONFIG.pageId,"candidate page id drift");
  if(!page){page=f0Write(penpot,storage,"create-page",()=>{const value=penpot.createPage();value.name=F0_CONFIG.pageName;value.setSharedPluginData(F0_CONFIG.namespace,"candidate-label",F0_CONFIG.candidateLabel);created++;return value});return await f0FinalizeBatch({penpot,storage,protectedShapes,protectedBefore,phase:"open-page",created,pageId:page.id});}
  if(penpot.currentPage?.id!==page.id)return await f0FinalizeBatch({penpot,storage,protectedShapes,protectedBefore,phase:"open-page",created:0,pageId:page.id});
  const localComponents=()=>Array.from(penpot.library.local.components||[]),components={};
  for(const [i,id] of Object.keys(F0_CONFIG.domains).entries()){
    const matches=localComponents().filter(c=>f0ComponentStable(c)===id);f0Assert(matches.length<=1,`duplicate component stable id: ${id}`);
    if(matches.length)components[id]=matches[0];else{if(created>=F0_CONFIG.maxCreatesPerCall)return await f0FinalizeBatch({penpot,storage,protectedShapes,protectedBefore,phase:"components",created,pageId:page.id});const partials=f0FindStable(page,`component/${id}`);f0Assert(partials.length<=1,`duplicate partial component board: ${id}`);if(partials.length){f0Assert(id===F0_CONFIG.rev79Partial.componentId,"unrecognized partial component state");components[id]=f0Write(penpot,storage,`reconcile-rev79:${id}`,()=>{created++;return f0ResumeRev79Partial(penpot,page).component});}else components[id]=f0Write(penpot,storage,`component:${id}`,()=>{created++;return f0CreateMaster(penpot,page,id,i).component});}
  }
  let roots=f0FindStable(page,"root");f0Assert(roots.length<=1,"duplicate managed root");let root=roots[0];
  if(!root){if(created>=F0_CONFIG.maxCreatesPerCall)return await f0FinalizeBatch({penpot,storage,protectedShapes,protectedBefore,phase:"root",created,pageId:page.id});root=f0Write(penpot,storage,"root",()=>{created++;return f0CreateRoot(penpot,page)});}
  for(const id of Object.keys(F0_CONFIG.domains)){const xy=f0PlacementXY(F0_CONFIG.placements.find(p=>p.componentId===id)),matches=Array.from(root.children||[]).filter(s=>s.getSharedPluginData(F0_CONFIG.namespace,"section")===id);f0Assert(matches.length<=1,`duplicate section: ${id}`);if(!matches.length){if(created>=F0_CONFIG.maxCreatesPerCall)return await f0FinalizeBatch({penpot,storage,protectedShapes,protectedBefore,phase:"sections",created,pageId:page.id});f0Write(penpot,storage,`section:${id}`,()=>{const t=f0Text(penpot,root,`Section · ${id}`,id,48,xy.sectionY+12,18,"#221A14");t.setSharedPluginData(F0_CONFIG.namespace,"section",id);created++});}}
  for(const placement of F0_CONFIG.placements){const matches=Array.from(root.children||[]).filter(s=>s.getSharedPluginData(F0_CONFIG.namespace,"placement-id")===placement.id);f0Assert(matches.length<=1,`duplicate placement: ${placement.id}`);if(matches.length)continue;if(created>=F0_CONFIG.maxCreatesPerCall)return await f0FinalizeBatch({penpot,storage,protectedShapes,protectedBefore,phase:"instances",created,pageId:page.id});f0Write(penpot,storage,`placement:${placement.id}`,()=>{const inst=components[placement.componentId].instance();root.appendChild(inst);const xy=f0PlacementXY(placement);f0SetParentXY(inst,xy.x,xy.y);inst.setSharedPluginData(F0_CONFIG.namespace,"placement-id",placement.id);f0ApplyValue(penpot,inst,placement.componentId,placement.value,F0_CONFIG.domains[placement.componentId].values[placement.value]);created++});}
  const managedComponents=Object.keys(F0_CONFIG.domains).map(id=>localComponents().find(c=>f0ComponentStable(c)===id)).filter(Boolean);roots=f0FindStable(page,"root");const instances=Array.from(root.children||[]).filter(s=>s.getSharedPluginData(F0_CONFIG.namespace,"placement-id"));const managedTrees=[root,...managedComponents.map(c=>c.mainInstance?.()).filter(Boolean)];const screenshots=managedTrees.flatMap(f0Walk).filter(s=>s.type==="image"||Array.from(s.fills||[]).some(f=>f.fillImage));const validation=penpot.currentFile.validate();const census=f0VerifyCensus({components:managedComponents,roots,instances,screenshots,validation});
  const rawExport=await root.export({type:"png",scale:1});f0Guard(penpot,storage,"post-export");const bytes=await f0ExportBytes(rawExport);f0Assert(bytes.length>0,"native export empty");const exportReceipt={nonempty:true,bytes:bytes.length,sha256:await f0Sha256(bytes)};f0Guard(penpot,storage,"post-export-hash");
  if(created>0){const batch=await f0FinalizeBatch({penpot,storage,protectedShapes,protectedBefore,phase:"terminal-rerun",created,pageId:page.id,extra:{census,export:exportReceipt}});return {...batch,status:"RERUN_FOR_IDEMPOTENCY"};}
  f0Guard(penpot,storage,"terminal-before-final-version");let finalVersionReceipt=storage.f0FoundationFinalVersionReceiptV1;if(!(finalVersionReceipt?.schema==="kenigevents.f0-final-version.v1"&&finalVersionReceipt.run_id===F0_CONFIG.runId)){const finalVersion=await penpot.currentFile.saveVersion(`F0 foundation candidate ${F0_CONFIG.runId} · VERIFIED`);f0Guard(penpot,storage,"terminal-post-final-version");finalVersionReceipt={schema:"kenigevents.f0-final-version.v1",run_id:F0_CONFIG.runId,version_id:finalVersion?.id||null};storage.f0FoundationFinalVersionReceiptV1=finalVersionReceipt;}
  const protectedAfter=await f0ProtectedProjection(protectedShapes);f0RequireProtectedDigest(protectedAfter,storage);f0Assert(protectedAfter.sha256===protectedBefore.sha256,"protected surface changed");const finalValidation=penpot.currentFile.validate();f0Assert(finalValidation.length===0,`terminal validation failed: ${f0Canonical(finalValidation)}`);f0Guard(penpot,storage,"terminal-readback");storage.f0FoundationActiveWriter=null;
  return {schema:F0_CONFIG.schema,status:"CANDIDATE_READBACK_VERIFIED",candidateLabel:F0_CONFIG.candidateLabel,ownerReviewState:"NOT_ACCEPTED",fileId:F0_CONFIG.fileId,pageId:page.id,rootId:root.id,counts:{components:managedComponents.length,roots:roots.length,instances:instances.length,detached:0,screenshots:screenshots.length},stableIds:census,created:0,secondRunCreated:0,protectedDigestBefore:protectedBefore.sha256,protectedDigestAfter:protectedAfter.sha256,validation:finalValidation,export:exportReceipt,finalVersionReceipt,runId:F0_CONFIG.runId,writer:F0_CONFIG.writer};
}

if (typeof module !== "undefined" && module.exports) module.exports={F0_CONFIG,f0Canonical,f0Sha256,f0Guard,f0Write,f0RequireProtectedDigest,f0RequireProtectedProbeBaseline,f0Rev79Partial,f0ResumeRev79Partial,f0VerifyCensus,f0PlacementXY,runF0FoundationSpecimensV3};
