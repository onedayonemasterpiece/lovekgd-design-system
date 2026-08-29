/** OV-31/32/33 Popular framing and layered islands over Astro 812ffc279. */

const FILE = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE = '8e7accff-5c78-8007-8008-8964f8dc3b14';
const ROOT_STABLE_ID = 'ov31-33-popular-framing-islands';
const COMPONENTS = {
  brandLockup: '8f804431-c282-8075-8008-8d9fde40299c',
  navigationItem: 'a21f5e36-5d76-8065-8008-86ae48eca567',
  discoveryRail: 'c0b867fa-32d2-8062-8008-8d679ca1da53',
  visual54: '7f078c80-87b8-80f5-8008-85831e139d49',
  naturalLandscape: '7f078c80-87b8-80f5-8008-858a6558d8dd',
  naturalPortrait: '7f078c80-87b8-80f5-8008-85908bd96bff',
  desktopNatural: 'cab027cf-d52b-8091-8008-85fb9a2fe5cb',
  rail54: '06b5fc29-ba80-803f-8008-87516651257f',
  cropProfile: 'a21f0524-f565-8038-8008-7895a470c1b1',
};

function installPopularFramingIslandsOv3133(penpot, storage) {
  const component = (id) => penpot.library.local.components.find((item) => item.id === id);
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE || penpot.currentPage?.id !== PAGE) throw new Error(`open settled Popular framing page ${PAGE}`);
  };
  const root = () => penpot.currentPage.root.children.find((shape) => shape.getSharedPluginData('recovery', 'stable-id') === ROOT_STABLE_ID);
  const linkedInstance = (id, name, x, y, parent = root()) => {
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
    const specimen = root();
    const linkedRoots = [...specimen.children].filter((shape) => shape.getSharedPluginData('recovery', 'canonical-component-id'));
    const city = linkedRoots.find((shape) => shape.component()?.id === COMPONENTS.discoveryRail);
    const cityLabels = [...city.children].filter((shape) => /^City option/u.test(shape.name) && !shape.hidden).map((shape) => shape.characters);
    return {
      page: penpot.currentPage.name,
      root: { id: specimen.id, size: [specimen.width, specimen.height] },
      linkedRoots: linkedRoots.map((shape) => ({ id: shape.id, component: shape.component()?.id, copy: shape.isComponentCopyInstance() })),
      cityLabels,
      romanovoCount: cityLabels.filter((label) => label === 'Романово').length,
      visibleComponentMains: penpot.currentPage.root.children.filter((shape) => !shape.hidden && shape.isComponentMainInstance()).length,
      validation: penpot.currentFile.validate(),
    };
  };
  storage.popularFramingIslandsOv3133 = { linkedInstance, readback, COMPONENTS };
  return { installed: true, methods: Object.keys(storage.popularFramingIslandsOv3133) };
}

installPopularFramingIslandsOv3133(penpot, storage);
