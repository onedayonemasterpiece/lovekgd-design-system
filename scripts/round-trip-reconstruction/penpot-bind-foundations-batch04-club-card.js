/** OV-54 batch 04: bind the canonical responsive Interest Club card root to radius.22. */
const FILE_ID='3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID='d87e18f1-dcb4-80a6-8008-880cfe1ec779';
const TOKEN_SET_ID='d87e18f1-dcb4-80a6-8008-876d85fbb5bb';
const ROOT_ID='d87e18f1-dcb4-80a6-8008-88648ab79ab4';
const PROPERTIES=['borderRadiusTopLeft','borderRadiusTopRight','borderRadiusBottomRight','borderRadiusBottomLeft'];
function installFoundationsBatch04ClubCard(penpot,storage){
  const context=()=>{if(penpot.currentFile?.id!==FILE_ID||penpot.currentPage?.id!==PAGE_ID)throw new Error(`open settled Interest clubs page ${PAGE_ID}`)};
  async function reconcile(){context();const set=penpot.library.local.tokens.sets.find(item=>item.id===TOKEN_SET_ID);const token=set?.tokens.find(item=>item.name==='radius.22');const shape=penpot.currentPage.getShapeById(ROOT_ID);if(!token||!shape)throw new Error('radius.22 or Club card root missing');const block=penpot.history.undoBlockBegin();try{shape.applyToken(token,PROPERTIES)}finally{penpot.history.undoBlockFinish(block)}await new Promise(resolve=>setTimeout(resolve,400));return readback()}
  async function readback(){context();const shape=penpot.currentPage.getShapeById(ROOT_ID);return{id:shape?.id,name:shape?.name,radii:[shape?.borderRadiusTopLeft,shape?.borderRadiusTopRight,shape?.borderRadiusBottomRight,shape?.borderRadiusBottomLeft],tokens:shape?.tokens,validation:await penpot.currentFile.validate()}}
  storage.foundationsBatch04ClubCard={reconcile,readback};return{installed:true,methods:Object.keys(storage.foundationsBatch04ClubCard)};
}
if(typeof module!=='undefined')module.exports={installFoundationsBatch04ClubCard,FILE_ID,PAGE_ID,TOKEN_SET_ID,ROOT_ID,PROPERTIES};
