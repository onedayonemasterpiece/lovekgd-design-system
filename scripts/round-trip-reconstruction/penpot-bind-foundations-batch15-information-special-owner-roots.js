/** OV-54 batch 15: bind Information mobile and Special states owner roots to radius.20. */
const FILE_ID='3be9e5e1-190f-8090-8008-713c0fbe6260';
const TOKEN_SET_ID='d87e18f1-dcb4-80a6-8008-876d85fbb5bb';
const PAGES={
 information:{pageId:'d87e18f1-dcb4-80a6-8008-880fb747d10c',roots:[['mobile','d87e18f1-dcb4-80a6-8008-880fb8952b02']]},
 special:{pageId:'d87e18f1-dcb4-80a6-8008-880fd2e88456',roots:[['desktop','d87e18f1-dcb4-80a6-8008-880fd30f9860'],['mobile','d87e18f1-dcb4-80a6-8008-880fd453e907']]},
};
const PROPERTIES=['borderRadiusTopLeft','borderRadiusTopRight','borderRadiusBottomRight','borderRadiusBottomLeft'];
function installFoundationsBatch15InformationSpecialOwnerRoots(penpot,storage){
 const context=key=>{const spec=PAGES[key];if(!spec)throw new Error(`unknown batch 15 page ${String(key)}`);if(penpot.currentFile?.id!==FILE_ID||penpot.currentPage?.id!==spec.pageId)throw new Error(`open settled ${key} page ${spec.pageId}`);return spec};
 const readback=async key=>{const spec=context(key),set=penpot.library.local.tokens.sets.find(x=>x.id===TOKEN_SET_ID),token=set?.tokens.find(x=>x.name==='radius.20');return {pageKey:key,pageId:spec.pageId,revision:penpot.currentFile.revn,tokenCount:set?.tokens.length,token:token?{id:token.id,name:token.name,type:token.type,value:token.value}:null,roots:spec.roots.map(([viewport,id])=>{const s=penpot.currentPage.getShapeById(id);return {viewport,id:s?.id,name:s?.name,width:s?.width,height:s?.height,radii:[s?.borderRadiusTopLeft,s?.borderRadiusTopRight,s?.borderRadiusBottomRight,s?.borderRadiusBottomLeft],tokens:s?.tokens}}),validation:penpot.currentFile.validate()}};
 const reconcile=async key=>{const spec=context(key),set=penpot.library.local.tokens.sets.find(x=>x.id===TOKEN_SET_ID),token=set?.tokens.find(x=>x.name==='radius.20');if(!token)throw new Error('foundation radius.20 token missing');const block=penpot.history.undoBlockBegin();try{for(const [viewport,id]of spec.roots){const shape=penpot.currentPage.getShapeById(id);if(!shape)throw new Error(`${key} ${viewport} owner ${id} missing`);shape.applyToken(token,PROPERTIES)}}finally{penpot.history.undoBlockFinish(block)}return {writeSubmitted:true,pageKey:key,roots:spec.roots.length}};
 storage.foundationsBatch15InformationSpecialOwnerRoots={reconcile,readback};return {installed:true,methods:Object.keys(storage.foundationsBatch15InformationSpecialOwnerRoots)};
}
if(typeof module!=='undefined')module.exports={installFoundationsBatch15InformationSpecialOwnerRoots,FILE_ID,TOKEN_SET_ID,PAGES,PROPERTIES};
