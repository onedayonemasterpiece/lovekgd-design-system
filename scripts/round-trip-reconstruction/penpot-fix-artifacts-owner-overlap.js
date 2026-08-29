/**
 * Remove review/evidence boards that overlapped the live Artifacts owners.
 *
 * The exact-seven owner grew to 2718/2951px after the old C01 and mobile
 * detail boards had already been placed. Those top-level boards then painted
 * over the owner export, producing the large blank block and tiny unrelated
 * rail shown in owner review. This correction only moves those evidence
 * boards; it does not change the native owner composition.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880f9a822a76';
const MOVES = [
  { id: '8f804431-c282-8075-8008-8dab3850410e', x: 0, y: 5200 },
  { id: '8f804431-c282-8075-8008-8dab388f1f43', x: 32, y: 5260 },
  { id: '8f804431-c282-8075-8008-8db68be1180a', x: 1320, y: 5800 },
];

function installArtifactsOwnerOverlapFix(penpot, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Artifacts page ${PAGE_ID}`);
    }
  };

  function reconcile() {
    assertContext();
    const block = penpot.history.undoBlockBegin();
    try {
      return MOVES.map(({ id, x, y }) => {
        const shape = penpot.currentPage.getShapeById(id);
        if (!shape) throw new Error(`missing Artifacts evidence shape ${id}`);
        shape.x = x;
        shape.y = y;
        return { id, name: shape.name, x: shape.x, y: shape.y };
      });
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function readback() {
    assertContext();
    const rootId = '00000000-0000-0000-0000-000000000000';
    const top = penpot.currentPage.findShapes({}).filter((shape) => shape.parent?.id === rootId && !shape.hidden);
    const owners = [
      { id: 'd87e18f1-dcb4-80a6-8008-880f9aaea84e', x: 0, y: 0, width: 1280, height: 2718 },
      { id: 'd87e18f1-dcb4-80a6-8008-880f9c4c81c4', x: 1320, y: 0, width: 390, height: 2951 },
    ];
    const overlaps = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    const collisions = owners.flatMap((owner) => top
      .filter((shape) => shape.id !== owner.id && overlaps(owner, shape))
      .map((shape) => ({ owner: owner.id, shape: shape.id, name: shape.name })));
    return {
      moves: MOVES.map(({ id }) => {
        const shape = penpot.currentPage.getShapeById(id);
        return { id, name: shape?.name, x: shape?.x, y: shape?.y };
      }),
      owner_collisions: collisions,
      validation: await penpot.currentFile.validate(),
    };
  }

  storage.artifactsOwnerOverlapFix = { reconcile, readback };
  return { installed: true, methods: Object.keys(storage.artifactsOwnerOverlapFix) };
}

if (typeof module !== 'undefined') module.exports = { installArtifactsOwnerOverlapFix, FILE_ID, PAGE_ID, MOVES };
