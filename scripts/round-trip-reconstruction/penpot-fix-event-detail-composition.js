/**
 * Bounded composition reconciliation for 63.07 Event detail.
 *
 * The component masters referenced below are native, linked Penpot resources
 * created from the existing canonical Action/Icon/Shell families.  This helper
 * changes the fixture-specific Summary and owner archetypes only by inserting
 * those semantic components and assigning fixture counts/flow positions.
 * Open 63.07 and settle it before calling either function; wait and read back
 * after each call before any export or navigation.
 */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880bfdfbf2ec';
const MOBILE_BOARD_ID = 'd87e18f1-dcb4-80a6-8008-880c01b4fbef';
const MOBILE_SUMMARY_MAIN_ID = 'd87e18f1-dcb4-80a6-8008-88603d5170c9';
const DESKTOP_BOARD_ID = 'd87e18f1-dcb4-80a6-8008-880bfe361a1d';
const DESKTOP_DESCRIPTION_MAIN_ID = 'd87e18f1-dcb4-80a6-8008-8860d116f17d';

const MOBILE_ACTIONS = [
  {
    componentId: '8e7accff-5c78-8007-8008-895a527a8faa',
    name: 'linked Action / Calendar / mobile icon-only dark',
    x: 24.671875, y: 216, count: null, legacy: /linked Action \/ Calendar$/
  },
  {
    componentId: '8e7accff-5c78-8007-8008-895a8640f57c',
    name: 'linked Action / Share / mobile dark · count=13',
    x: 83.390625, y: 216, count: '13', legacy: /linked Social proof \/ Share/
  },
  {
    componentId: '8e7accff-5c78-8007-8008-895a8728e1f4',
    name: 'linked Action / Like / mobile dark · count=164',
    x: 289.328125, y: 216, count: '164', legacy: /linked Social proof \/ Like/
  }
];

const HEADER_COMPONENT_ID = '8e7accff-5c78-8007-8008-895b5a328f65';
const PRACTICAL_COMPONENT_ID = '8e7accff-5c78-8007-8008-895ea18d6435';

function assertContext(penpot) {
  if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
    throw new Error('open settled page 63.07 before Event detail composition repair');
  }
}

function setCount(instance, value) {
  if (value == null) return;
  const stack = [instance];
  let found = 0;
  while (stack.length) {
    const shape = stack.pop();
    if (shape.type === 'text' && /Content \/ Count/.test(shape.name)) {
      shape.characters = value;
      found += 1;
    }
    if (shape.children) stack.push(...shape.children);
  }
  if (!found) throw new Error(`missing count slot in ${instance.name}`);
}

function applyEventDetailMobileComposition(penpot, penpotUtils) {
  assertContext(penpot);
  const page = penpot.currentPage;
  const board = page.getShapeById(MOBILE_BOARD_ID);
  const summary = page.getShapeById(MOBILE_SUMMARY_MAIN_ID);
  if (!board || !summary?.isComponentMainInstance()) throw new Error('mobile Event detail ancestry missing');

  for (const spec of MOBILE_ACTIONS) {
    let instance = summary.children.find(shape => shape.name === spec.name);
    if (!instance) {
      for (const legacy of [...summary.children].filter(shape => spec.legacy.test(shape.name))) legacy.remove();
      const component = penpot.library.local.components.find(item => item.id === spec.componentId);
      if (!component) throw new Error(`missing semantic action component: ${spec.componentId}`);
      instance = component.instance();
      instance.name = spec.name;
      summary.appendChild(instance);
    }
    penpotUtils.setParentXY(instance, spec.x, spec.y);
    setCount(instance, spec.count);
  }

  const headerComponent = penpot.library.local.components.find(item => item.id === HEADER_COMPONENT_ID);
  if (!headerComponent) throw new Error(`missing transparent mobile header: ${HEADER_COMPONENT_ID}`);
  let header = board.children.find(shape => shape.name === 'linked Shell / Mobile header / transparent hero overlay');
  if (!header) {
    for (const legacy of [...board.children].filter(shape => shape.name === 'linked Shell / Mobile header')) legacy.remove();
    header = headerComponent.instance();
    header.name = 'linked Shell / Mobile header / transparent hero overlay';
    board.appendChild(header);
  }
  penpotUtils.setParentXY(header, 0, 0);
  return { actions: MOBILE_ACTIONS.length, header_id: header.id };
}

function applyEventDetailDesktopComposition(penpot, penpotUtils) {
  assertContext(penpot);
  const page = penpot.currentPage;
  const board = page.getShapeById(DESKTOP_BOARD_ID);
  const descriptionMain = page.getShapeById(DESKTOP_DESCRIPTION_MAIN_ID);
  if (!board || !descriptionMain?.isComponentMainInstance()) throw new Error('desktop Event detail ancestry missing');
  descriptionMain.resize(784, 1162);

  const description = board.children.find(shape => shape.name === 'linked Event detail / Description / desktop');
  const related = board.children.find(shape => shape.name === 'linked Event detail / Related viewport / desktop');
  const footer = board.children.find(shape => shape.name === 'linked Shell / Desktop footer viewport');
  const header = board.children.find(shape => shape.name === 'linked Shell / Desktop header');
  if (!description || !header) throw new Error('desktop Event detail bounded flow regions missing');
  penpotUtils.setParentXY(description, description.parentX, 1245);
  // The canonical owner board is intentionally bounded to the 2998px review
  // capture.  Do not retain invisible linked compositions thousands of pixels
  // below it: they fail the owner-boundary invariant and were a source of page
  // growth without contributing to the exported evidence.
  const removedOffCanvas = [related?.id, footer?.id].filter(Boolean);
  related?.remove();
  footer?.remove();

  // Detail routes do not select one of the listing navigation tabs.
  const headerStack = [header];
  while (headerStack.length) {
    const shape = headerStack.pop();
    if (shape.name === 'Active underline') shape.hidden = true;
    if (shape.type === 'text' && /^Navigation label/.test(shape.name)) {
      shape.fills = [{ fillColor: '#6d6259', fillOpacity: 1 }];
      shape.fontWeight = '700';
    }
    if (shape.children) headerStack.push(...shape.children);
  }

  let practical = board.children.find(shape => shape.name === 'linked Event detail / Practical / desktop event.real.5459');
  if (!practical) {
    const component = penpot.library.local.components.find(item => item.id === PRACTICAL_COMPONENT_ID);
    if (!component) throw new Error(`missing desktop Practical component: ${PRACTICAL_COMPONENT_ID}`);
    practical = component.instance();
    practical.name = 'linked Event detail / Practical / desktop event.real.5459';
    board.appendChild(practical);
  }
  penpotUtils.setParentXY(practical, 76.78125, 2495.765625);
  return { practical_id: practical.id, description_height: descriptionMain.height, removed_off_canvas: removedOffCanvas };
}

if (typeof module !== 'undefined') module.exports = {
  applyEventDetailMobileComposition,
  applyEventDetailDesktopComposition
};
