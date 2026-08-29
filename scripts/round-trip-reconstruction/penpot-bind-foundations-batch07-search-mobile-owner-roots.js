/** OV-54 batch 07: bind all source-exact mobile Search owner roots to radius.20. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880ac732b6ae';
const TOKEN_SET_ID = 'd87e18f1-dcb4-80a6-8008-876d85fbb5bb';
const ROOTS = [
  ['loading', '8f804431-c282-8075-8008-8de4a4d7e156'],
  ['results', '8f804431-c282-8075-8008-8de4b555573e'],
  ['validation', '8f804431-c282-8075-8008-8e305adcf98b'],
  ['empty', '8f804431-c282-8075-8008-8e3061e03319'],
  ['error-retry', '8f804431-c282-8075-8008-8e3067efb33c'],
  ['load-more-ready', '8f804431-c282-8075-8008-8e306ea7f026'],
  ['load-more-loading', '8f804431-c282-8075-8008-8e30772dfe35'],
  ['recovery-after-error', '8f804431-c282-8075-8008-8e307ddd6546'],
];
const PROPERTIES = ['borderRadiusTopLeft', 'borderRadiusTopRight', 'borderRadiusBottomRight', 'borderRadiusBottomLeft'];

function installFoundationsBatch07SearchMobileOwnerRoots(penpot, storage) {
  const context = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Search page ${PAGE_ID}`);
    }
  };
  async function readback() {
    context();
    const set = penpot.library.local.tokens.sets.find((item) => item.id === TOKEN_SET_ID);
    const token = set?.tokens.find((item) => item.name === 'radius.20');
    return {
      revision: penpot.currentFile.revn,
      tokenCount: set?.tokens.length,
      token: token ? { id: token.id, name: token.name, type: token.type, value: token.value } : null,
      roots: ROOTS.map(([state, id]) => {
        const shape = penpot.currentPage.getShapeById(id);
        return {
          state,
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
    const token = set?.tokens.find((item) => item.name === 'radius.20');
    if (!token) throw new Error('foundation radius.20 token missing');
    const block = penpot.history.undoBlockBegin();
    try {
      for (const [state, id] of ROOTS) {
        const shape = penpot.currentPage.getShapeById(id);
        if (!shape) throw new Error(`Search mobile owner root ${state} / ${id} missing`);
        shape.applyToken(token, PROPERTIES);
      }
    } finally {
      penpot.history.undoBlockFinish(block);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    return readback();
  }
  storage.foundationsBatch07SearchMobileOwnerRoots = { reconcile, readback };
  return { installed: true, methods: Object.keys(storage.foundationsBatch07SearchMobileOwnerRoots) };
}

if (typeof module !== 'undefined') {
  module.exports = { installFoundationsBatch07SearchMobileOwnerRoots, FILE_ID, PAGE_ID, TOKEN_SET_ID, ROOTS, PROPERTIES };
}
