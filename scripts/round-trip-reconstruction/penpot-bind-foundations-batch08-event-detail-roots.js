/** OV-54 batch 08: bind source-exact Event Detail roots that visibly use radius.20. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880bfdfbf2ec';
const TOKEN_SET_ID = 'd87e18f1-dcb4-80a6-8008-876d85fbb5bb';
const ROOTS = [
  ['mobile-owner', 'd87e18f1-dcb4-80a6-8008-880c01b4fbef'],
  ['portrait-hero-image', '8f804431-c282-8075-8008-8de9abb9b6df'],
  ['portrait-viewer', '8f804431-c282-8075-8008-8de9c51369b4'],
  ['transport', '8f804431-c282-8075-8008-8de9d4fe4c9b'],
  ['continuation', '8f804431-c282-8075-8008-8de9ec4fef26'],
];
const PROPERTIES = ['borderRadiusTopLeft', 'borderRadiusTopRight', 'borderRadiusBottomRight', 'borderRadiusBottomLeft'];

function installFoundationsBatch08EventDetailRoots(penpot, storage) {
  const context = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Event Detail page ${PAGE_ID}`);
    }
  };
  const readback = async () => {
    context();
    const set = penpot.library.local.tokens.sets.find((item) => item.id === TOKEN_SET_ID);
    const token = set?.tokens.find((item) => item.name === 'radius.20');
    return {
      revision: penpot.currentFile.revn,
      tokenCount: set?.tokens.length,
      token: token ? { id: token.id, name: token.name, type: token.type, value: token.value } : null,
      roots: ROOTS.map(([role, id]) => {
        const shape = penpot.currentPage.getShapeById(id);
        return {
          role,
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
  const reconcile = async () => {
    context();
    const set = penpot.library.local.tokens.sets.find((item) => item.id === TOKEN_SET_ID);
    const token = set?.tokens.find((item) => item.name === 'radius.20');
    if (!token) throw new Error('foundation radius.20 token missing');
    const block = penpot.history.undoBlockBegin();
    try {
      for (const [role, id] of ROOTS) {
        const shape = penpot.currentPage.getShapeById(id);
        if (!shape) throw new Error(`Event Detail root ${role} / ${id} missing`);
        shape.applyToken(token, PROPERTIES);
      }
    } finally {
      penpot.history.undoBlockFinish(block);
    }
    return { writeSubmitted: true, roots: ROOTS.length };
  };
  storage.foundationsBatch08EventDetailRoots = { reconcile, readback };
  return { installed: true, methods: Object.keys(storage.foundationsBatch08EventDetailRoots) };
}

if (typeof module !== 'undefined') {
  module.exports = { installFoundationsBatch08EventDetailRoots, FILE_ID, PAGE_ID, TOKEN_SET_ID, ROOTS, PROPERTIES };
}
