/** OV-54 batch 12: bind Home, Date and Weekend canonical owner roots to radius.20. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const TOKEN_SET_ID = 'd87e18f1-dcb4-80a6-8008-876d85fbb5bb';
const PAGES = {
  home: {
    pageId: 'd87e18f1-dcb4-80a6-8008-8806c5b98101',
    roots: [
      ['desktop', 'd87e18f1-dcb4-80a6-8008-8806efd8647f'],
      ['mobile', 'd87e18f1-dcb4-80a6-8008-8806f1f90263'],
    ],
  },
  date: {
    pageId: 'd87e18f1-dcb4-80a6-8008-8807f67e8a2e',
    roots: [
      ['desktop', 'd87e18f1-dcb4-80a6-8008-8807f6b14cd1'],
      ['mobile', 'd87e18f1-dcb4-80a6-8008-8807f91d5293'],
    ],
  },
  weekend: {
    pageId: 'd87e18f1-dcb4-80a6-8008-88089c3e75c9',
    roots: [
      ['desktop', 'd87e18f1-dcb4-80a6-8008-88089c93d57f'],
      ['mobile', 'd87e18f1-dcb4-80a6-8008-8808db012d23'],
    ],
  },
};
const PROPERTIES = ['borderRadiusTopLeft', 'borderRadiusTopRight', 'borderRadiusBottomRight', 'borderRadiusBottomLeft'];

function installFoundationsBatch12CoreListingOwnerRoots(penpot, storage) {
  const context = (pageKey) => {
    const spec = PAGES[pageKey];
    if (!spec) throw new Error(`unknown batch 12 page ${String(pageKey)}`);
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
        return {
          viewport,
          id: shape?.id,
          name: shape?.name,
          width: shape?.width,
          height: shape?.height,
          radii: [shape?.borderRadiusTopLeft, shape?.borderRadiusTopRight, shape?.borderRadiusBottomRight, shape?.borderRadiusBottomLeft],
          tokens: shape?.tokens,
        };
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
    return { writeSubmitted: true, pageKey, roots: spec.roots.length };
  };
  storage.foundationsBatch12CoreListingOwnerRoots = { reconcile, readback };
  return { installed: true, methods: Object.keys(storage.foundationsBatch12CoreListingOwnerRoots) };
}

if (typeof module !== 'undefined') {
  module.exports = { installFoundationsBatch12CoreListingOwnerRoots, FILE_ID, TOKEN_SET_ID, PAGES, PROPERTIES };
}
