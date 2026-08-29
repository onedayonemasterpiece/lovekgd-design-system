/** OV-54 batch 05: bind both source-exact Personal feed owner roots to radius.20. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880d8bcc2d0b';
const TOKEN_SET_ID = 'd87e18f1-dcb4-80a6-8008-876d85fbb5bb';
const ROOT_IDS = [
  'd87e18f1-dcb4-80a6-8008-880d8c05a466',
  'd87e18f1-dcb4-80a6-8008-880d8db35320',
];
const PROPERTIES = ['borderRadiusTopLeft', 'borderRadiusTopRight', 'borderRadiusBottomRight', 'borderRadiusBottomLeft'];

function installFoundationsBatch05PersonalFeedOwners(penpot, storage) {
  const context = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Personal feed page ${PAGE_ID}`);
    }
  };
  async function readback() {
    context();
    return {
      revision: penpot.currentFile.revn,
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
      validation: await penpot.currentFile.validate(),
    };
  }
  async function reconcile() {
    context();
    const set = penpot.library.local.tokens.sets.find((item) => item.id === TOKEN_SET_ID);
    const token = set?.tokens.find((item) => item.name === 'radius.20');
    if (!token) throw new Error('radius.20 missing');
    const block = penpot.history.undoBlockBegin();
    try {
      for (const id of ROOT_IDS) {
        const shape = penpot.currentPage.getShapeById(id);
        if (!shape) throw new Error(`Personal feed owner ${id} missing`);
        shape.applyToken(token, PROPERTIES);
      }
    } finally {
      penpot.history.undoBlockFinish(block);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    return readback();
  }
  storage.foundationsBatch05PersonalFeedOwners = { reconcile, readback };
  return { installed: true, methods: Object.keys(storage.foundationsBatch05PersonalFeedOwners) };
}

if (typeof module !== 'undefined') {
  module.exports = { installFoundationsBatch05PersonalFeedOwners, FILE_ID, PAGE_ID, TOKEN_SET_ID, ROOT_IDS, PROPERTIES };
}
