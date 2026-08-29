/** OV-54 batch 09: bind all seven Collection 1 Artifact component-main roots to radius.12. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = '579a886e-56e8-80a3-8008-81882de9c074';
const TOKEN_SET_ID = 'd87e18f1-dcb4-80a6-8008-876d85fbb5bb';
const COMPONENTS = [
  ['amber_cosmonaut', '8f804431-c282-8075-8008-8db5b8f67f28', '45777396-2f2a-80c0-8008-8192ec65b6e9'],
  ['baltic_light', '8f804431-c282-8075-8008-8db5b940e564', '45777396-2f2a-80c0-8008-8192e5f930ef'],
  ['luise_queen_bridge', '8f804431-c282-8075-8008-8db5b98fcdc2', '45777396-2f2a-80c0-8008-8192e776e4d0'],
  ['marzipan_heart', '8f804431-c282-8075-8008-8db5b9eb27fe', '45777396-2f2a-80c0-8008-8192e8f5f01e'],
  ['sedov_bell', '8f804431-c282-8075-8008-8db5baabe2fc', '45777396-2f2a-80c0-8008-8192eabb8327'],
  ['cosmonaut', '8f804431-c282-8075-8008-8db5bb3b14a1', '45777396-2f2a-80c0-8008-8192edd00155'],
  ['old_brick', '8f804431-c282-8075-8008-8db5bc09c066', '45777396-2f2a-80c0-8008-8192eed54283'],
];
const PROPERTIES = ['borderRadiusTopLeft', 'borderRadiusTopRight', 'borderRadiusBottomRight', 'borderRadiusBottomLeft'];

function installFoundationsBatch09ArtifactCardRoots(penpot, storage) {
  const context = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Artifacts page ${PAGE_ID}`);
    }
  };
  const resolve = () => {
    const components = Array.from(penpot.library.local.components || []);
    return COMPONENTS.map(([artifactId, componentId, mainId]) => {
      const component = components.find((item) => item.id === componentId);
      const main = penpot.currentPage.getShapeById(mainId);
      if (!main) throw new Error(`Artifact component main ${artifactId} / ${componentId} missing`);
      return { artifactId, componentId, component, main };
    });
  };
  const readback = async () => {
    context();
    const set = penpot.library.local.tokens.sets.find((item) => item.id === TOKEN_SET_ID);
    const token = set?.tokens.find((item) => item.name === 'radius.12');
    return {
      revision: penpot.currentFile.revn,
      tokenCount: set?.tokens.length,
      token: token ? { id: token.id, name: token.name, type: token.type, value: token.value } : null,
      roots: resolve().map(({ artifactId, componentId, component, main }) => ({
        artifactId,
        componentId,
        componentName: component.name,
        mainId: main.id,
        mainName: main.name,
        width: main.width,
        height: main.height,
        radii: [main.borderRadiusTopLeft, main.borderRadiusTopRight, main.borderRadiusBottomRight, main.borderRadiusBottomLeft],
        tokens: main.tokens,
      })),
      validation: penpot.currentFile.validate(),
    };
  };
  const reconcile = async () => {
    context();
    const set = penpot.library.local.tokens.sets.find((item) => item.id === TOKEN_SET_ID);
    const token = set?.tokens.find((item) => item.name === 'radius.12');
    if (!token) throw new Error('foundation radius.12 token missing');
    const block = penpot.history.undoBlockBegin();
    try {
      for (const { main } of resolve()) main.applyToken(token, PROPERTIES);
    } finally {
      penpot.history.undoBlockFinish(block);
    }
    return { writeSubmitted: true, roots: COMPONENTS.length };
  };
  storage.foundationsBatch09ArtifactCardRoots = { reconcile, readback };
  return { installed: true, methods: Object.keys(storage.foundationsBatch09ArtifactCardRoots) };
}

if (typeof module !== 'undefined') {
  module.exports = { installFoundationsBatch09ArtifactCardRoots, FILE_ID, PAGE_ID, TOKEN_SET_ID, COMPONENTS, PROPERTIES };
}
