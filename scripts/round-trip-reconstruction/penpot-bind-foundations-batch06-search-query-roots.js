/** OV-54 batch 06: add source radius.28 and bind both desktop Search query roots. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880ac732b6ae';
const TOKEN_SET_ID = 'd87e18f1-dcb4-80a6-8008-876d85fbb5bb';
const ROOT_IDS = [
  '8f804431-c282-8075-8008-8e2903bd8817',
  '8f804431-c282-8075-8008-8e2910c883fe',
];
const PROPERTIES = ['borderRadiusTopLeft', 'borderRadiusTopRight', 'borderRadiusBottomRight', 'borderRadiusBottomLeft'];

function installFoundationsBatch06SearchQueryRoots(penpot, storage) {
  const context = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Search page ${PAGE_ID}`);
    }
  };
  async function readback() {
    context();
    const set = penpot.library.local.tokens.sets.find((item) => item.id === TOKEN_SET_ID);
    const token = set?.tokens.find((item) => item.name === 'radius.28');
    return {
      revision: penpot.currentFile.revn,
      tokenCount: set?.tokens.length,
      token: token ? { id: token.id, name: token.name, type: token.type, value: token.value } : null,
      roots: ROOT_IDS.map((id) => {
        const shape = penpot.currentPage.getShapeById(id);
        return {
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
  }
  async function reconcile() {
    context();
    const set = penpot.library.local.tokens.sets.find((item) => item.id === TOKEN_SET_ID);
    if (!set) throw new Error('foundation token set missing');
    let token = set.tokens.find((item) => item.name === 'radius.28');
    const block = penpot.history.undoBlockBegin();
    try {
      if (!token) token = set.addToken({ type: 'borderRadius', name: 'radius.28', value: '28' });
      for (const id of ROOT_IDS) {
        const shape = penpot.currentPage.getShapeById(id);
        if (!shape) throw new Error(`Search query root ${id} missing`);
        shape.applyToken(token, PROPERTIES);
      }
    } finally {
      penpot.history.undoBlockFinish(block);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    return readback();
  }
  storage.foundationsBatch06SearchQueryRoots = { reconcile, readback };
  return { installed: true, methods: Object.keys(storage.foundationsBatch06SearchQueryRoots) };
}

if (typeof module !== 'undefined') {
  module.exports = { installFoundationsBatch06SearchQueryRoots, FILE_ID, PAGE_ID, TOKEN_SET_ID, ROOT_IDS, PROPERTIES };
}
