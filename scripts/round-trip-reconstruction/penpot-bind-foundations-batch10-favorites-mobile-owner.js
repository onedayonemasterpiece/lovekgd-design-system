/** OV-54 batch 10: bind the source-exact Favorites mobile owner root to radius.20. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880d209a7fcd';
const ROOT_ID = 'd87e18f1-dcb4-80a6-8008-880d230a2b8b';
const TOKEN_SET_ID = 'd87e18f1-dcb4-80a6-8008-876d85fbb5bb';
const PROPERTIES = ['borderRadiusTopLeft', 'borderRadiusTopRight', 'borderRadiusBottomRight', 'borderRadiusBottomLeft'];

function installFoundationsBatch10FavoritesMobileOwner(penpot, storage) {
  const context = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Favorites page ${PAGE_ID}`);
    }
  };
  const readback = async () => {
    context();
    const set = penpot.library.local.tokens.sets.find((item) => item.id === TOKEN_SET_ID);
    const token = set?.tokens.find((item) => item.name === 'radius.20');
    const shape = penpot.currentPage.getShapeById(ROOT_ID);
    return {
      revision: penpot.currentFile.revn,
      tokenCount: set?.tokens.length,
      token: token ? { id: token.id, name: token.name, type: token.type, value: token.value } : null,
      root: {
        id: shape?.id,
        name: shape?.name,
        width: shape?.width,
        height: shape?.height,
        radii: [shape?.borderRadiusTopLeft, shape?.borderRadiusTopRight, shape?.borderRadiusBottomRight, shape?.borderRadiusBottomLeft],
        tokens: shape?.tokens,
      },
      validation: penpot.currentFile.validate(),
    };
  };
  const reconcile = async () => {
    context();
    const set = penpot.library.local.tokens.sets.find((item) => item.id === TOKEN_SET_ID);
    const token = set?.tokens.find((item) => item.name === 'radius.20');
    const shape = penpot.currentPage.getShapeById(ROOT_ID);
    if (!token) throw new Error('foundation radius.20 token missing');
    if (!shape) throw new Error(`Favorites mobile owner ${ROOT_ID} missing`);
    const block = penpot.history.undoBlockBegin();
    try {
      shape.applyToken(token, PROPERTIES);
    } finally {
      penpot.history.undoBlockFinish(block);
    }
    return { writeSubmitted: true, roots: 1 };
  };
  storage.foundationsBatch10FavoritesMobileOwner = { reconcile, readback };
  return { installed: true, methods: Object.keys(storage.foundationsBatch10FavoritesMobileOwner) };
}

if (typeof module !== 'undefined') {
  module.exports = { installFoundationsBatch10FavoritesMobileOwner, FILE_ID, PAGE_ID, ROOT_ID, TOKEN_SET_ID, PROPERTIES };
}
