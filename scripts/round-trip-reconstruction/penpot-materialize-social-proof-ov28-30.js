/** OV-28/29/30 canonical social-proof fixture over Astro 53f7b2c2c. */

const FILE = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE = '8e7accff-5c78-8007-8008-8970ea1e3f8d';
const ROOT_STABLE_ID = 'ov28-30-social-proof-linked-demo';
const COMPONENTS = {
  shareCompact: 'a21f5e36-5d76-8065-8008-870c7b58f649',
  likeCompact: 'a21f5e36-5d76-8065-8008-86cd5c19e772',
  shareOnLight: '7f078c80-87b8-80f5-8008-85e1f5b85d8f',
  likeStandard: '7f078c80-87b8-80f5-8008-85e0aee9a615',
  likeRailInline: '06b5fc29-ba80-803f-8008-8742d3f6ac5e',
  likeInside: 'a21f5e36-5d76-8065-8008-86cf695f752b',
};

function installSocialProofOv2830(penpot, storage) {
  const component = (id) => penpot.library.local.components.find((item) => item.id === id);
  const root = () => penpot.currentPage.root.children.find((shape) => shape.getSharedPluginData('recovery', 'stable-id') === ROOT_STABLE_ID);
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE || penpot.currentPage?.id !== PAGE) throw new Error(`open settled social-proof page ${PAGE}`);
  };
  const linkedInstance = (id, name, x, y, parent) => {
    const shape = component(id).instance();
    shape.name = name;
    shape.x = x;
    shape.y = y;
    shape.setSharedPluginData('recovery', 'canonical-component-id', id);
    parent.appendChild(shape);
    return shape;
  };
  const readback = () => {
    assertContext();
    const demo = root();
    const linkedRoots = [...demo.children].filter((shape) => shape.getSharedPluginData('recovery', 'canonical-component-id'));
    return {
      page: penpot.currentPage.name,
      demo: { id: demo.id, size: [demo.width, demo.height] },
      linkedRoots: linkedRoots.map((shape) => ({ id: shape.id, component: shape.component()?.id, copy: shape.isComponentCopyInstance() })),
      visibleTopLevelRoots: penpot.currentPage.root.children.filter((shape) => !shape.hidden).length,
      opaqueWhiteOnTransparentRoots: linkedRoots.filter((shape) => !/inside/iu.test(shape.name) && (shape.fills || []).some((fill) => fill.fillColor?.toLowerCase() === '#ffffff' && fill.fillOpacity === 1)).length,
      validation: penpot.currentFile.validate(),
    };
  };
  storage.socialProofOv2830 = { linkedInstance, readback, COMPONENTS };
  return { installed: true, methods: Object.keys(storage.socialProofOv2830) };
}

installSocialProofOv2830(penpot, storage);
