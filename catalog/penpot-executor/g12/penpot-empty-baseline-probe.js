/* Read-only ordinary-Penpot G12 preflight. It performs no shape/component/media mutation. */
(()=>{'use strict';
  const requiredPenpot=['createBoard','createRectangle','createText','createShapeFromSvg','createShapeFromSvgWithImages'];
  const requiredUtils=['findShape','setParentXY'];
  const missing=[...requiredPenpot.filter((key)=>typeof globalThis.penpot?.[key]!=='function').map((key)=>`penpot.${key}`),...requiredUtils.filter((key)=>typeof globalThis.penpotUtils?.[key]!=='function').map((key)=>`penpotUtils.${key}`)];
  if(typeof globalThis.penpot?.library?.local?.createComponent!=='function')missing.push('penpot.library.local.createComponent');
  const page=globalThis.penpot?.currentPage||null;
  const file=globalThis.penpot?.currentFile||null;
  const fontContext=globalThis.penpot?.fonts;
  if(!fontContext||typeof fontContext.findByName!=='function'||typeof fontContext.findAllByName!=='function')missing.push('penpot.fonts.all/findByName/findAllByName');
  const normalize=(font)=>({id:font?.id||font?.fontId||font?.postScriptName||null,family:font?.family||font?.familyName||font?.name||null,style:font?.style||font?.variant||null,postscript_name:font?.postScriptName||null});
  const fonts=Array.from(fontContext?.all||[]).map(normalize);
  const requiredFamily='DejaVu Sans';
  const byName=typeof fontContext?.findByName==='function'?normalize(fontContext.findByName(requiredFamily)):null;
  const allByName=typeof fontContext?.findAllByName==='function'?Array.from(fontContext.findAllByName(requiredFamily)||[]).map(normalize):[];
  const availableIdentifiers=[...new Set([...fonts,...allByName,byName].filter(Boolean).flatMap((font)=>[font.id,font.postscript_name]).filter(Boolean))];
  const requiredIdentifiers=['DejaVuSans','DejaVuSans-Bold'];
  const missingFontIdentifiers=requiredIdentifiers.filter((id)=>!availableIdentifiers.includes(id));
  if(missingFontIdentifiers.length)missing.push(...missingFontIdentifiers.map((id)=>`penpot.fonts:${id}`));
  return Object.freeze({schema:'kenigevents.penpot-empty-baseline-observation.g12.v1',status:missing.length||!page||!file?'INCOMPATIBLE':'OBSERVED_API_FONT_TARGET',file_id:file?.id||null,page_id:page?.id||null,missing_primitives:missing,font_context:{required_family:requiredFamily,all:fonts,find_by_name:byName,find_all_by_name:allByName,available_identifiers:availableIdentifiers,required_identifiers:requiredIdentifiers},native_image_behavior:'NOT_ASSERTED_REQUIRES_SEPARATE_REVERSIBLE_CANARY',mutation_calls:0});
})()
