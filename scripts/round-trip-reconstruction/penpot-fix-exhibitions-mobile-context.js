/**
 * Source-proven Exhibitions mobile shell-context repair.
 *
 * `/vystavki/` renders the leather trigger over the dark page surface.  The
 * owner was linked to the light default mobile header even though the native
 * transparent overlay header already exists.  Swap the linked component;
 * never reproduce the appearance with terminal fill overrides.
 */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880cc5490f78';
const BOARD_ID = 'd87e18f1-dcb4-80a6-8008-880cc78ce882';
const HEADER_ID = 'd87e18f1-dcb4-80a6-8008-8864013cc237';
const TRANSPARENT_HEADER_COMPONENT_ID = '8e7accff-5c78-8007-8008-895b5a328f65';

function applyExhibitionsMobileShellContext(penpot, penpotUtils) {
  if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
    throw new Error('open settled 63.10 Exhibitions owner page first');
  }
  const board = penpot.currentPage.getShapeById(BOARD_ID);
  const header = penpot.currentPage.getShapeById(HEADER_ID);
  const target = penpot.library.local.components.find(component => component.id === TRANSPARENT_HEADER_COMPONENT_ID);
  if (!board || !header?.isComponentCopyInstance() || !target) throw new Error('Exhibitions mobile shell anatomy missing');
  if (header.component()?.id !== TRANSPARENT_HEADER_COMPONENT_ID) header.swapComponent(target);
  header.name = 'linked Shell / Mobile header · transparent hero overlay';
  penpotUtils.setParentXY(header, 0, 0);
  board.borderRadius = 0;
  return {
    board: { id: board.id, radius: board.borderRadius },
    header: { id: header.id, component_id: header.component()?.id, x: header.x - board.x, y: header.y - board.y, width: header.width, height: header.height }
  };
}

if (typeof module !== 'undefined') module.exports = { applyExhibitionsMobileShellContext };
