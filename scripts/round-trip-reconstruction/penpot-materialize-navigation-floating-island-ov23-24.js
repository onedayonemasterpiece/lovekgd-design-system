/** OV-23/24 mobile-navigation island over Astro 53f7b2c2c. */

const FILE = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const OWNER_PAGE = 'a21f5e36-5d76-8065-8008-86ac7b368ff6';
const REVIEW_PAGE = '8e7accff-5c78-8007-8008-89bf021cf5fd';
const COMPONENT = 'a21f5e36-5d76-8065-8008-86aec0a54bb5';
const MAIN = 'a21f5e36-5d76-8065-8008-86aebffe176b';
const WRAPPER = '8e7accff-5c78-8007-8008-89c2fcdb53e0';
const REGION = '8e7accff-5c78-8007-8008-89bf5d24d35e';
const REGION_COPY = '8e7accff-5c78-8007-8008-89c2fd96713b';
const BASELINE = '8e7accff-5c78-8007-8008-89bf5cf408ab';
const DESKTOP = '8e7accff-5c78-8007-8008-89bf5c941649';

function installNavigationFloatingIslandOv2324(penpot, storage) {
  const component = (id) => penpot.library.local.components.find((item) => item.id === id);
  const descendants = (root) => {
    const result = [];
    const walk = (shape) => { result.push(shape); if (shape.children) for (const child of shape.children) walk(child); };
    walk(root);
    return result;
  };
  const repairOwner = () => {
    if (penpot.currentFile?.id !== FILE || penpot.currentPage?.id !== OWNER_PAGE) throw new Error(`open settled owner page ${OWNER_PAGE}`);
    const main = component(COMPONENT).mainInstance();
    const block = penpot.history.undoBlockBegin();
    try {
      main.resize(366, 64);
      main.name = 'Shell v1 / Mobile / Mobile bottom navigation / surface=floating-island';
      main.borderRadius = 20;
      main.fills = [{ fillColor: '#fffdf8', fillOpacity: 1 }];
      main.strokes = [{ strokeColor: '#793014', strokeOpacity: 0.13, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
      const children = [...main.children];
      children.find((shape) => /top border/iu.test(shape.name)).hidden = true;
      children.filter((shape) => shape.component?.() && /Mobile tab item/u.test(shape.name)).forEach((shape, index) => {
        shape.resize(91.5, 64);
        shape.x = main.x + index * 91.5;
        shape.y = main.y;
      });
      for (const [key, x] of Object.entries({ afisha: 26.75, search: 209.75, personal: 301.25 })) {
        const pill = children.find((shape) => shape.name.includes(`active=${key}`));
        pill.x = main.x + x;
        pill.y = main.y + 13;
      }
    } finally { penpot.history.undoBlockFinish(block); }
    return { component: COMPONENT, main: MAIN, size: [main.width, main.height] };
  };
  const repairReview = () => {
    if (penpot.currentFile?.id !== FILE || penpot.currentPage?.id !== REVIEW_PAGE) throw new Error(`open settled review page ${REVIEW_PAGE}`);
    const wrapper = penpot.currentPage.getShapeById(WRAPPER);
    const region = penpot.currentPage.getShapeById(REGION);
    const copy = penpot.currentPage.getShapeById(REGION_COPY);
    const block = penpot.history.undoBlockBegin();
    try {
      wrapper.resize(366, 64);
      wrapper.name = 'Unified v1 / Navigation / Mobile bottom navigation · current=search;surface=floating-island;source=Astro-53f7b2c2c';
      const shell = [...wrapper.children][0];
      shell.x = wrapper.x;
      shell.y = wrapper.y;
      descendants(wrapper).find((shape) => /active=search/u.test(shape.name)).hidden = false;
      region.name = 'Search navigation / Mobile / source-exact floating island · current=search';
      region.fills = [{ fillColor: '#f5efe6', fillOpacity: 1 }];
      copy.x = region.x + 12;
      copy.y = region.y + 46;
      const baseline = penpot.currentPage.getShapeById(BASELINE);
      baseline.hidden = true;
      baseline.name = 'DEPRECATED / full-width mobile bottom bar / owner-rejected';
      penpot.currentPage.getShapeById(DESKTOP).name = 'Unified v1 / Navigation / Desktop header + search entry · bottom-island=not-applicable;source=Astro-53f7b2c2c';
    } finally { penpot.history.undoBlockFinish(block); }
    return { wrapper: WRAPPER, region: REGION, copy: REGION_COPY };
  };
  const readback = () => ({
    page: penpot.currentPage.name,
    canonical: { component: COMPONENT, main: MAIN, size: [component(COMPONENT).mainInstance().width, component(COMPONENT).mainInstance().height] },
    validation: penpot.currentFile.validate(),
  });
  storage.navigationFloatingIslandOv2324 = { repairOwner, repairReview, readback };
  return { installed: true, methods: Object.keys(storage.navigationFloatingIslandOv2324) };
}

installNavigationFloatingIslandOv2324(penpot, storage);
