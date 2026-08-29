/** OV-54 batch 03: add the missing source-conformant radius.24 token and bind exact-seven Artifact collection roots. */
const FILE_ID='3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID='d87e18f1-dcb4-80a6-8008-880f9a822a76';
const TOKEN_SET_ID='d87e18f1-dcb4-80a6-8008-876d85fbb5bb';
const ROOT_IDS=['d87e18f1-dcb4-80a6-8008-886a9dd56004','d87e18f1-dcb4-80a6-8008-886a9e3f9cc2'];
const PROPERTIES=['borderRadiusTopLeft','borderRadiusTopRight','borderRadiusBottomRight','borderRadiusBottomLeft'];

function installFoundationsBatch03Artifacts(penpot,storage){
  const context=()=>{if(penpot.currentFile?.id!==FILE_ID||penpot.currentPage?.id!==PAGE_ID)throw new Error(`open settled Artifacts page ${PAGE_ID}`)};
  async function reconcile(){
    context();
    const set=penpot.library.local.tokens.sets.find(item=>item.id===TOKEN_SET_ID);
    if(!set)throw new Error('foundation token set missing');
    let token=set.tokens.find(item=>item.name==='radius.24');
    const block=penpot.history.undoBlockBegin();
    try{
      if(!token)token=set.addToken({type:'borderRadius',name:'radius.24',value:'24'});
      for(const id of ROOT_IDS){const shape=penpot.currentPage.getShapeById(id);if(!shape)throw new Error(`missing ${id}`);shape.applyToken(token,PROPERTIES)}
    }finally{penpot.history.undoBlockFinish(block)}
    await new Promise(resolve=>setTimeout(resolve,400));
    return readback();
  }
  async function readback(){
    context();
    const set=penpot.library.local.tokens.sets.find(item=>item.id===TOKEN_SET_ID);
    const token=set?.tokens.find(item=>item.name==='radius.24');
    return {token_count:set?.tokens.length,token:{id:token?.id,name:token?.name,type:token?.type,value:token?.value},roots:ROOT_IDS.map(id=>{const shape=penpot.currentPage.getShapeById(id);return{id,name:shape?.name,radii:[shape?.borderRadiusTopLeft,shape?.borderRadiusTopRight,shape?.borderRadiusBottomRight,shape?.borderRadiusBottomLeft],tokens:shape?.tokens}}),validation:await penpot.currentFile.validate()};
  }
  storage.foundationsBatch03Artifacts={reconcile,readback};
  return{installed:true,methods:Object.keys(storage.foundationsBatch03Artifacts)};
}
if(typeof module!=='undefined')module.exports={installFoundationsBatch03Artifacts,FILE_ID,PAGE_ID,TOKEN_SET_ID,ROOT_IDS,PROPERTIES};
