/** OV-54 batch 14: bind Festivals, Interest clubs mobile and Focus group owner roots to radius.20. */
const FILE_ID='3be9e5e1-190f-8090-8008-713c0fbe6260';
const TOKEN_SET_ID='d87e18f1-dcb4-80a6-8008-876d85fbb5bb';
const PAGES={
  festivals:{pageId:'d87e18f1-dcb4-80a6-8008-880c8e21990e',roots:[['desktop','d87e18f1-dcb4-80a6-8008-880c8e48d9e8'],['mobile','d87e18f1-dcb4-80a6-8008-880c911b8674']]},
  interestClubs:{pageId:'d87e18f1-dcb4-80a6-8008-880cfe1ec779',roots:[['mobile','d87e18f1-dcb4-80a6-8008-880cff1a1193']]},
  focusGroup:{pageId:'d87e18f1-dcb4-80a6-8008-880f767c3eb3',roots:[['desktop','d87e18f1-dcb4-80a6-8008-880f76b4ddc0'],['mobile','d87e18f1-dcb4-80a6-8008-880f7859acee']]},
};
const PROPERTIES=['borderRadiusTopLeft','borderRadiusTopRight','borderRadiusBottomRight','borderRadiusBottomLeft'];
function installFoundationsBatch14CommunityOwnerRoots(penpot,storage){
 const context=key=>{const spec=PAGES[key];if(!spec)throw new Error(`unknown batch 14 page ${String(key)}`);if(penpot.currentFile?.id!==FILE_ID||penpot.currentPage?.id!==spec.pageId)throw new Error(`open settled ${key} page ${spec.pageId}`);return spec};
 const readback=async key=>{const spec=context(key);const set=penpot.library.local.tokens.sets.find(x=>x.id===TOKEN_SET_ID);const token=set?.tokens.find(x=>x.name==='radius.20');return {pageKey:key,pageId:spec.pageId,revision:penpot.currentFile.revn,tokenCount:set?.tokens.length,token:token?{id:token.id,name:token.name,type:token.type,value:token.value}:null,roots:spec.roots.map(([viewport,id])=>{const s=penpot.currentPage.getShapeById(id);return {viewport,id:s?.id,name:s?.name,width:s?.width,height:s?.height,radii:[s?.borderRadiusTopLeft,s?.borderRadiusTopRight,s?.borderRadiusBottomRight,s?.borderRadiusBottomLeft],tokens:s?.tokens}}),validation:penpot.currentFile.validate()}};
 const reconcile=async key=>{const spec=context(key);const set=penpot.library.local.tokens.sets.find(x=>x.id===TOKEN_SET_ID);const token=set?.tokens.find(x=>x.name==='radius.20');if(!token)throw new Error('foundation radius.20 token missing');const block=penpot.history.undoBlockBegin();try{for(const [viewport,id]of spec.roots){const shape=penpot.currentPage.getShapeById(id);if(!shape)throw new Error(`${key} ${viewport} owner ${id} missing`);shape.applyToken(token,PROPERTIES)}}finally{penpot.history.undoBlockFinish(block)}return {writeSubmitted:true,pageKey:key,roots:spec.roots.length}};
 storage.foundationsBatch14CommunityOwnerRoots={reconcile,readback};return {installed:true,methods:Object.keys(storage.foundationsBatch14CommunityOwnerRoots)};
}
if(typeof module!=='undefined')module.exports={installFoundationsBatch14CommunityOwnerRoots,FILE_ID,TOKEN_SET_ID,PAGES,PROPERTIES};
