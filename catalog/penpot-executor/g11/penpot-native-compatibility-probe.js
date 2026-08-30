/* READ ONLY. W3 runs this before any executor mutation; W0 signs the returned receipt. */
(async()=>{'use strict';
const missing=[];
if(typeof penpot!=='object'||!penpot)missing.push('penpot');
if(typeof penpotUtils!=='object'||!penpotUtils)missing.push('penpotUtils');
for(const k of ['currentFile','currentPage'])if(!penpot?.[k])missing.push('penpot.'+k);
if(typeof penpotUtils?.setParentXY!=='function')missing.push('penpotUtils.setParentXY');
const candidates=[...(penpot?.selection||[]),...(penpot?.currentPage?.findShapes?.({})||[])];
const nativeImage=candidates.find(s=>Array.isArray(s.fills)&&s.fills.some(f=>f?.fillImage&&typeof f.fillImage.data==='function'));
const board=candidates.find(s=>'clipContent' in s&&typeof s.resize==='function');
return {schema:'kenigevents.penpot-native-compatibility-probe-observation.v1',status:missing.length||!nativeImage||!board?'INCOMPATIBLE':'COMPATIBLE',file_id:String(penpot?.currentFile?.id||''),page_id:String(penpot?.currentPage?.id||''),strategy:'clipped-native-image-shape-v1',observed:{fill_image_data_callable:Boolean(nativeImage),board_clip_content:Boolean(board&&'clipContent' in board),shape_resize:Boolean(board&&typeof board.resize==='function'),parent_xy:typeof penpotUtils?.setParentXY==='function'},missing,limitations:['Read-only observation only; it creates no shapes and changes no properties.','W0 must bind and sign the observation as a compatibility probe receipt before W3 execution.'],probed_at:new Date().toISOString()};})()
