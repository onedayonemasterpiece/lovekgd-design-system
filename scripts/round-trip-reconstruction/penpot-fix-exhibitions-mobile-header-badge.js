/** Source-proven transparent mobile-header state with exhibitions count badge. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880cc5490f78';
const OWNER_ID = 'd87e18f1-dcb4-80a6-8008-8864013cc237';
const BASE_HEADER_ID = '8e7accff-5c78-8007-8008-895b5a328f65';
const BADGE_PATH = 'Shell v1 / Mobile / Header badge';
const BADGE_NAME = 'context=exhibitions';
const HEADER_PATH = 'Shell v1 / Mobile';
const HEADER_NAME = 'Mobile header · transparent hero overlay · badge=exhibitions';

const componentById = (penpot, id) => penpot.library.local.components.find(item => item.id === id);
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

function ensureExhibitionsBadge(penpot, penpotUtils) {
  assertContext(penpot);
  const existing = componentByIdentity(penpot, BADGE_PATH, BADGE_NAME);
  if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
  const board = penpot.createBoard();
  board.name = `${BADGE_PATH} / ${BADGE_NAME}`;
  board.fills = [{ fillColor: '#d93b48', fillOpacity: 1 }];
  board.borderRadius = 999;
  board.clipContent = true;
  place(penpotUtils, board, 2360, 2070, 60.71875, 20);
  const label = penpot.createText('5 новых');
  label.name = 'Content / Badge count / exhibitions';
  label.fontFamily = 'Inter';
  label.fontStyle = 'normal';
  label.fontSize = '10.56';
  label.fontWeight = '800';
  label.lineHeight = '1';
  label.letterSpacing = '0';
  label.align = 'center';
  label.fills = [{ fillColor: '#ffffff', fillOpacity: 1 }];
  board.appendChild(label);
  place(penpotUtils, label, 6.078125, 4.71875, 48.5625, 10.5625);
  const component = penpot.library.local.createComponent([board]);
  return { existing: false, id: component.id, main: component.mainInstance().id };
}

function ensureExhibitionsHeaderState(penpot, penpotUtils) {
  assertContext(penpot);
  const existing = componentByIdentity(penpot, HEADER_PATH, HEADER_NAME);
  if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
  const base = componentById(penpot, BASE_HEADER_ID);
  const badge = componentByIdentity(penpot, BADGE_PATH, BADGE_NAME);
  if (!base || !badge) throw new Error('transparent header or exhibitions badge missing');
  const board = penpot.createBoard();
  board.name = `${HEADER_PATH} / ${HEADER_NAME}`;
  board.fills = [];
  board.clipContent = false;
  place(penpotUtils, board, 2360, 2120, 390, 84);
  const header = base.instance();
  header.name = 'linked Shell v1 / Mobile / transparent hero overlay';
  board.appendChild(header);
  place(penpotUtils, header, 0, 0, 390, 84);
  const badgeCopy = badge.instance();
  badgeCopy.name = 'linked Shell v1 / Mobile / Header badge / exhibitions / count=5';
  board.appendChild(badgeCopy);
  place(penpotUtils, badgeCopy, 64.5625, 6.71875, 60.71875, 20);
  const component = penpot.library.local.createComponent([board]);
  return { existing: false, id: component.id, main: component.mainInstance().id, base: base.id, badge: badge.id };
}

function applyExhibitionsHeaderOwner(penpot, penpotUtils) {
  assertContext(penpot);
  const owner = penpot.currentPage.getShapeById(OWNER_ID);
  const target = componentByIdentity(penpot, HEADER_PATH, HEADER_NAME);
  if (!owner?.isComponentCopyInstance() || !target) throw new Error('header owner or target state missing');
  if (owner.component()?.id !== target.id) owner.swapComponent(target);
  owner.resetOverrides();
  owner.name = 'linked Shell / Mobile header · transparent hero overlay · badge=exhibitions';
  if (owner.layoutChild) owner.layoutChild.absolute = true;
  penpotUtils.setParentXY(owner, 0, 0);
  return { id: owner.id, name: owner.name, x: owner.x - owner.parent.x, y: owner.y - owner.parent.y, width: owner.width, height: owner.height, component: owner.component()?.id, validate: penpot.currentFile.validate() };
}

if (typeof module !== 'undefined') module.exports = { ensureExhibitionsBadge, ensureExhibitionsHeaderState, applyExhibitionsHeaderOwner };
