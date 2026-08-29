/** Source-proven `/vystavki/` mobile section header and CTA repair. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880cc5490f78';
const MAIN_ID = 'd87e18f1-dcb4-80a6-8008-88631b9f61a6';
const OWNER_ID = 'd87e18f1-dcb4-80a6-8008-886400dce6d3';
const ACTION_PATH = 'Exhibitions / Action';
const ACTION_NAME = 'Mark new seen · viewport=mobile';

const componentByIdentity = (penpot, path, name) => penpot.library.local.components.find(item => item.path === path && item.name === name);

function assertContext(penpot) {
  if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) throw new Error('open settled 63.10 first');
}
function place(penpotUtils, shape, x, y, width, height) {
  if (shape.layoutChild) shape.layoutChild.absolute = true;
  shape.resize(width, height);
  penpotUtils.setParentXY(shape, x, y);
  return shape;
}
function styleText(shape, penpotUtils, spec) {
  shape.characters = spec.characters;
  shape.fontFamily = 'Inter';
  shape.fontStyle = 'normal';
  shape.fontSize = String(spec.size);
  shape.fontWeight = String(spec.weight);
  shape.lineHeight = String(spec.lineHeight);
  shape.letterSpacing = String(spec.letterSpacing ?? 0);
  shape.align = spec.align ?? 'left';
  if (spec.textCase) shape.textCase = spec.textCase;
  if (spec.textDecoration) shape.textDecoration = spec.textDecoration;
  shape.fills = [{ fillColor: spec.color, fillOpacity: 1 }];
  return place(penpotUtils, shape, spec.x, spec.y, spec.width, spec.height);
}

function ensureMarkNewSeenAction(penpot, penpotUtils) {
  assertContext(penpot);
  const existing = componentByIdentity(penpot, ACTION_PATH, ACTION_NAME);
  if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
  const board = penpot.createBoard();
  board.name = `${ACTION_PATH} / ${ACTION_NAME}`;
  board.fills = [];
  board.strokes = [{ strokeColor: '#000000', strokeOpacity: 0, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
  board.borderRadius = 5;
  board.clipContent = true;
  place(penpotUtils, board, 1960, 2070, 370, 44);
  const label = penpot.createText('Снять «новое» у всех');
  label.name = 'Content / Action label';
  board.appendChild(label);
  styleText(label, penpotUtils, { characters: 'Снять «новое» у всех', x: 0, y: 12.952, width: 370, height: 18.096, size: 12.48, weight: 700, lineHeight: 1.45, color: '#a8adb2', align: 'center', textDecoration: 'underline' });
  const component = penpot.library.local.createComponent([board]);
  return { existing: false, id: component.id, main: component.mainInstance().id };
}

function applySectionHeaderMaster(penpot, penpotUtils) {
  assertContext(penpot);
  const main = penpot.currentPage.getShapeById(MAIN_ID);
  if (!main?.isComponentMainInstance()) throw new Error('section header master missing');
  const eyebrow = main.children.find(shape => shape.name === 'Eyebrow');
  const title = main.children.find(shape => shape.name === 'Title');
  const description = main.children.find(shape => shape.name === 'Description');
  if (!eyebrow || !title || !description) throw new Error('section header text anatomy missing');
  main.resize(370, 183.296875);
  main.fills = [];
  main.clipContent = false;
  styleText(eyebrow, penpotUtils, { characters: 'БЫСТРЫЙ РАЗБОР', x: 0, y: 0, width: 370, height: 16.6875, size: 11.52, weight: 800, lineHeight: 1.45, letterSpacing: 1.4976, color: '#54acf7' });
  // Penpot 2.17.2-RC2 rejects negative letterSpacing through the plugin API;
  // preserve the source size/measure and record this renderer limitation.
  styleText(title, penpotUtils, { characters: 'Новое для вас', x: 0, y: 23.875, width: 370, height: 28, size: 28, weight: 700, lineHeight: 1, letterSpacing: 0, color: '#f4f4f2' });
  styleText(description, penpotUtils, { characters: 'Поставьте лайк, отметьте «не интересно» или\nоткройте — и новинка уйдёт из красного\nсчётчика.', x: 0, y: 60.671875, width: 370, height: 62.625, size: 14.4, weight: 400, lineHeight: 1.45, color: '#a8adb2' });
  const actionComponent = componentByIdentity(penpot, ACTION_PATH, ACTION_NAME);
  if (!actionComponent) throw new Error(`missing ${ACTION_PATH} / ${ACTION_NAME}`);
  let action = main.children.find(shape => shape.component?.()?.id === actionComponent.id);
  if (!action) {
    action = actionComponent.instance();
    action.name = 'linked Exhibitions / Action / Mark new seen';
    main.appendChild(action);
  }
  place(penpotUtils, action, 0, 139.296875, 370, 44);
  return { main: { id: main.id, width: main.width, height: main.height }, action: { id: action.id, component: action.component()?.id, x: action.x - main.x, y: action.y - main.y, width: action.width, height: action.height } };
}

function applySectionHeaderOwner(penpot, penpotUtils) {
  assertContext(penpot);
  const owner = penpot.currentPage.getShapeById(OWNER_ID);
  if (!owner?.isComponentCopyInstance()) throw new Error('section header owner missing');
  owner.resetOverrides();
  owner.name = 'linked Exhibitions / Section header / mobile / complete';
  if (owner.layoutChild) owner.layoutChild.absolute = true;
  penpotUtils.setParentXY(owner, 10, 686.28125);
  return { id: owner.id, name: owner.name, x: owner.x - owner.parent.x, y: owner.y - owner.parent.y, width: owner.width, height: owner.height, component: owner.component()?.id, validate: penpot.currentFile.validate() };
}

if (typeof module !== 'undefined') module.exports = { ensureMarkNewSeenAction, applySectionHeaderMaster, applySectionHeaderOwner };
