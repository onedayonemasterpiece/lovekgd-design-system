/* Read-only ordinary-Penpot G12 preflight. It performs no shape/component/media mutation. */
(()=>{'use strict';
  const requiredPenpot=['createBoard','createRectangle','createText','createShapeFromSvg','createShapeFromSvgWithImages'];
  const requiredUtils=['findShape','setParentXY'];
  const missing=[...requiredPenpot.filter((key)=>typeof globalThis.penpot?.[key]!=='function').map((key)=>`penpot.${key}`),...requiredUtils.filter((key)=>typeof globalThis.penpotUtils?.[key]!=='function').map((key)=>`penpotUtils.${key}`)];
  if(typeof globalThis.penpot?.library?.local?.createComponent!=='function')missing.push('penpot.library.local.createComponent');
  const page=globalThis.penpot?.currentPage||null;
  const file=globalThis.penpot?.currentFile||null;
  const fonts=Array.isArray(globalThis.penpot?.fonts)?globalThis.penpot.fonts.map((font)=>({id:font.id||null,family:font.family||font.name||null,style:font.style||null})):[];
  return Object.freeze({schema:'kenigevents.penpot-empty-baseline-observation.g12.v1',status:missing.length||!page||!file?'INCOMPATIBLE':'OBSERVED_API_FONT_TARGET',file_id:file?.id||null,page_id:page?.id||null,missing_primitives:missing,fonts,native_image_behavior:'NOT_ASSERTED_REQUIRES_SEPARATE_REVERSIBLE_CANARY',mutation_calls:0});
})()
