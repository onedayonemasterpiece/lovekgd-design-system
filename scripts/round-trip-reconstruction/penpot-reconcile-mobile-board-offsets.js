/**
 * Penpot plugin-context repair for the 63.xx mobile owner boards.
 *
 * This is intentionally bounded and idempotent: it changes only page-absolute
 * positions of already-linked direct children that do not intersect their owner
 * board. It creates no shapes, boards, components, pages or service resources.
 */
const MOBILE_OWNER_TARGETS = [
  ['d87e18f1-dcb4-80a6-8008-880ac732b6ae', 'd87e18f1-dcb4-80a6-8008-880acb90d104'],
  ['d87e18f1-dcb4-80a6-8008-880bfdfbf2ec', 'd87e18f1-dcb4-80a6-8008-880c01b4fbef'],
  ['d87e18f1-dcb4-80a6-8008-880c4a36d153', 'd87e18f1-dcb4-80a6-8008-880c4cb4c4e6'],
  ['d87e18f1-dcb4-80a6-8008-880cc5490f78', 'd87e18f1-dcb4-80a6-8008-880cc78ce882'],
  ['d87e18f1-dcb4-80a6-8008-880cfe1ec779', 'd87e18f1-dcb4-80a6-8008-880cff1a1193'],
  ['d87e18f1-dcb4-80a6-8008-880d209a7fcd', 'd87e18f1-dcb4-80a6-8008-880d230a2b8b'],
  ['d87e18f1-dcb4-80a6-8008-880d8bcc2d0b', 'd87e18f1-dcb4-80a6-8008-880d8db35320'],
  ['d87e18f1-dcb4-80a6-8008-880f767c3eb3', 'd87e18f1-dcb4-80a6-8008-880f7859acee'],
  ['d87e18f1-dcb4-80a6-8008-880f9a822a76', 'd87e18f1-dcb4-80a6-8008-880f9c4c81c4'],
  ['d87e18f1-dcb4-80a6-8008-880fb747d10c', 'd87e18f1-dcb4-80a6-8008-880fb8952b02'],
  ['d87e18f1-dcb4-80a6-8008-880fd2e88456', 'd87e18f1-dcb4-80a6-8008-880fd453e907']
];

/**
 * Repair exactly one owner page per MCP invocation.
 *
 * Penpot 2.17.x can enter a React update loop when a plugin rapidly opens many
 * text-heavy pages: page initialization emits a burst of resize-text and
 * update-position-data events.  The orchestrator therefore invokes this
 * function once per target, sequentially, with a tool-call boundary between
 * pages.  Never wrap all targets in one openPage loop.
 */
async function reconcileMobileBoardOffset(penpot, pageId, boardId) {
  const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
  if (penpot.currentFile?.id !== FILE_ID) throw new Error(`wrong Penpot file: ${penpot.currentFile?.id}`);
  if (!MOBILE_OWNER_TARGETS.some(([expectedPage, expectedBoard]) => expectedPage === pageId && expectedBoard === boardId)) {
    throw new Error(`unregistered mobile owner target: ${pageId}/${boardId}`);
  }
  const changes = [];
  const page = penpot.currentFile.pages.find(candidate => candidate.id === pageId);
  if (!page) throw new Error(`missing owner page: ${pageId}`);
  if (penpot.currentPage?.id !== pageId) {
    await penpot.openPage(page);
    await new Promise(resolve => setTimeout(resolve, 750));
  }
  const board = penpot.currentPage?.getShapeById(boardId);
  if (!board) throw new Error(`missing owner board: ${boardId}`);
  for (const child of board.children) {
    const intersects = child.x < board.x + board.width && child.x + child.width > board.x;
    if (!intersects && child.x + child.width <= board.x) {
      const before = child.x;
      // Use Penpot's parent-coordinate helper instead of the raw page-X setter.
      // It commits the relative coordinate in one modifier operation and avoids
      // the much larger text/layout update storm observed with child.x writes.
      penpotUtils.setParentXY(child, child.parentX + board.x, child.parentY);
      changes.push({ page_id: pageId, board_id: boardId, shape_id: child.id, before_x: before, after_x: child.x });
    }
  }
  // Let page-local layout and text position events drain before returning.
  await new Promise(resolve => setTimeout(resolve, 750));
  const validation = penpot.currentFile.validate();
  if (validation.length !== 0) throw new Error(`Penpot validation failed: ${JSON.stringify(validation)}`);
  return { schema_version: 'round-trip-reconstruction.penpot-mobile-offset-repair.v2', page_id: pageId, board_id: boardId, changed: changes.length, changes, validation };
}

// The MCP runner evaluates this file's function body in plugin context. Exporting
// keeps it unit-readable without executing outside Penpot.
if (typeof module !== 'undefined') module.exports = { MOBILE_OWNER_TARGETS, reconcileMobileBoardOffset };
