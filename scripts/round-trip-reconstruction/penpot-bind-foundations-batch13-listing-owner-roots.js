/** OV-54 batch 13: bind Popular desktop, Collections mobile and Exhibitions desktop owner roots to radius.20. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const TOKEN_SET_ID = 'd87e18f1-dcb4-80a6-8008-876d85fbb5bb';
const PAGES = {
  popular: {
    pageId: 'd87e18f1-dcb4-80a6-8008-880937f54501',
    roots: [['desktop', 'd87e18f1-dcb4-80a6-8008-880938344c39']],
  },
  collections: {
    pageId: 'd87e18f1-dcb4-80a6-8008-880c4a36d153',
    roots: [['mobile', 'd87e18f1-dcb4-80a6-8008-880c4cb4c4e6']],
  },
  exhibitions: {
    pageId: 'd87e18f1-dcb4-80a6-8008-880cc5490f78',
    roots: [['desktop', 'd87e18f1-dcb4-80a6-8008-880cc5676c70']],
  },
};
const PROPERTIES = ['borderRadiusTopLeft', 'borderRadiusTopRight', 'borderRadiusBottomRight', 'borderRadiusBottomLeft'];

function installFoundationsBatch13ListingOwnerRoots(penpot, storage) {
  const context = (pageKey) => {
    const spec = PAGES[pageKey];
    if (!spec) throw new Error(`unknown batch 13 page ${String(pageKey)}`);
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== spec.pageId) {
      throw new Error(`open settled ${pageKey} page ${spec.pageId}`);
    }
    return spec;
  };
  const readback = async (pageKey) => {
    const spec = context(pageKey);
    const set = penpot.library.local.tokens.sets.find((item) => item.id === TOKEN_SET_ID);
    const token = set?.tokens.find((item) => item.name === 'radius.20');
    return {
      pageKey,
      pageId: spec.pageId,
      revision: penpot.currentFile.revn,
      tokenCount: set?.tokens.length,
      token: token ? { id: token.id, name: token.name, type: token.type, value: token.value } : null,
      roots: spec.roots.map(([viewport, id]) => {
        const shape = penpot.currentPage.getShapeById(id);
        return {viewport,id:shape?.id,name:shape?.name,width:shape?.width,height:shape?.height,radii:[shape?.borderRadiusTopLeft,shape?.borderRadiusTopRight,shape?.borderRadiusBottomRight,shape?.borderRadiusBottomLeft],tokens:shape?.tokens};
      }),
      validation: penpot.currentFile.validate(),
    };
  };
  const reconcile = async (pageKey) => {
    const spec = context(pageKey);
    const set = penpot.library.local.tokens.sets.find((item) => item.id === TOKEN_SET_ID);
    const token = set?.tokens.find((item) => item.name === 'radius.20');
    if (!token) throw new Error('foundation radius.20 token missing');
    const block = penpot.history.undoBlockBegin();
    try {
      for (const [viewport, id] of spec.roots) {
        const shape = penpot.currentPage.getShapeById(id);
        if (!shape) throw new Error(`${pageKey} ${viewport} owner ${id} missing`);
        shape.applyToken(token, PROPERTIES);
      }
    } finally {
      penpot.history.undoBlockFinish(block);
    }
    return {writeSubmitted:true,pageKey,roots:spec.roots.length};
  };
  storage.foundationsBatch13ListingOwnerRoots = {reconcile,readback};
  return {installed:true,methods:Object.keys(storage.foundationsBatch13ListingOwnerRoots)};
}

if (typeof module !== 'undefined') module.exports={installFoundationsBatch13ListingOwnerRoots,FILE_ID,TOKEN_SET_ID,PAGES,PROPERTIES};
