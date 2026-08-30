/* Read-only ordinary-Penpot G14 font/target preflight. It performs no mutation. */
(()=>{'use strict';
  const requiredPenpot=['createBoard','createRectangle','createText','createShapeFromSvg','createShapeFromSvgWithImages'];
  const requiredUtils=['findShape','setParentXY'];
  const missing=[...requiredPenpot.filter((key)=>typeof globalThis.penpot?.[key]!=='function').map((key)=>`penpot.${key}`),...requiredUtils.filter((key)=>typeof globalThis.penpotUtils?.[key]!=='function').map((key)=>`penpotUtils.${key}`)];
  if(typeof globalThis.penpot?.library?.local?.createComponent!=='function')missing.push('penpot.library.local.createComponent');
  const page=globalThis.penpot?.currentPage||null,file=globalThis.penpot?.currentFile||null,fontContext=globalThis.penpot?.fonts;
  if(!fontContext||typeof fontContext.findByName!=='function'||typeof fontContext.findAllByName!=='function')missing.push('penpot.fonts.all/findByName/findAllByName');
  const fields=(value)=>({name:value?.name??null,fontId:value?.fontId??null,fontFamily:value?.fontFamily??null,fontWeight:Number(value?.fontWeight),fontVariantId:value?.fontVariantId??null});
  const normalize=(font)=>({...fields(font),variants:Array.from(font?.variants||[]).map(fields)});
  const family='DejaVu Sans',all=Array.from(fontContext?.all||[]).map(normalize);
  const found=typeof fontContext?.findByName==='function'?fontContext.findByName(family):null;
  const foundAll=typeof fontContext?.findAllByName==='function'?Array.from(fontContext.findAllByName(family)||[]):[];
  const native=[...new Set([found,...foundAll].filter(Boolean))];
  const variants=[];for(const font of native){for(const variant of [font,...Array.from(font.variants||[])]){const row=fields(variant);if(row.fontFamily===family&&row.fontId&&row.fontVariantId&&[400,700].includes(row.fontWeight))variants.push(row)}}
  const regular=variants.find((variant)=>variant.fontWeight===400)||null,bold=variants.find((variant)=>variant.fontWeight===700)||null;
  if(!regular)missing.push('penpot.fonts:DejaVu Sans:400');if(!bold)missing.push('penpot.fonts:DejaVu Sans:700');
  return Object.freeze({schema:'kenigevents.penpot-font-target-observation.g14.v1',status:missing.length||!page||!file?'INCOMPATIBLE':'OBSERVED_API_FONT_TARGET',file_id:file?.id||null,page_id:page?.id||null,missing_primitives:missing,font_context:{required_family:family,required_weights:[400,700],all,find_by_name:found?normalize(found):null,find_all_by_name:foundAll.map(normalize),resolved:{regular,bold}},native_image_behavior:'NOT_ASSERTED_REQUIRES_SEPARATE_REVERSIBLE_CANARY',mutation_calls:0});
})()
