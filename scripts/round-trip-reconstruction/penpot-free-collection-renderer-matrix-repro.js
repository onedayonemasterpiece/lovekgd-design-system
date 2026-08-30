/** Minimal renderer-integrity reproduction for free-collection fixture 8006.
 *
 * Open Penpot file 3be9e5e1-190f-8090-8008-713c0fbe6260 and page
 * fb44de8f-cd63-8060-8008-8f839b2fe1df before installing this helper.
 * It is read-only apart from storing bounded PNG bytes in plugin storage.
 */
const FREE_COLLECTION_RENDERER_REPRO = Object.freeze({
  fileId: '3be9e5e1-190f-8090-8008-713c0fbe6260',
  pageId: 'fb44de8f-cd63-8060-8008-8f839b2fe1df',
  exactTitle: 'Донорская акция «Стань донором крови»',
  B: {
    boardId: 'fb44de8f-cd63-8060-8008-8f97e3ea18b2',
    componentId: 'fb44de8f-cd63-8060-8008-8f84acd03e8f',
    mainId: 'fb44de8f-cd63-8060-8008-8f84ab4a445a',
    contentComponentId: 'fb44de8f-cd63-8060-8008-8f8413fa064a',
    contentMainId: 'fb44de8f-cd63-8060-8008-8f84120d4047',
  },
  C: {
    boardId: 'fb44de8f-cd63-8060-8008-8f97e43c28b1',
    componentId: 'fb44de8f-cd63-8060-8008-8f93ba4a0e59',
    mainId: 'fb44de8f-cd63-8060-8008-8f93abeb23a0',
  },
});

function installFreeCollectionRendererRepro(penpot, penpotUtils, storage) {
  const cfg = FREE_COLLECTION_RENDERER_REPRO;
  const component = (id) => penpot.library.local.components.find((item) => item.id === id);
  const walk = (root) => {
    const out = [];
    const queue = root ? [root] : [];
    while (queue.length) {
      const shape = queue.shift();
      out.push(shape);
      if (shape.children) queue.push(...shape.children);
    }
    return out;
  };
  const assertContext = () => {
    if (penpot.currentFile?.id !== cfg.fileId || penpot.currentPage?.id !== cfg.pageId) {
      throw new Error('open the exact renderer-integrity diagnostic page first');
    }
  };
  const readback = async () => {
    assertContext();
    const result = {};
    for (const key of ['B', 'C']) {
      const item = cfg[key];
      const board = penpot.currentPage.getShapeById(item.boardId);
      const master = component(item.componentId)?.mainInstance();
      if (!board || !master) throw new Error(`missing ${key} reproduction root`);
      const markup = penpot.generateMarkup([board], { type: 'html', withChildren: true });
      result[key] = {
        boardId: board.id,
        componentId: item.componentId,
        mainId: master.id,
        width: board.width,
        height: board.height,
        exactTitleInMarkup: markup.includes(cfg.exactTitle),
        directTitles: walk(master)
          .filter((shape) => shape.type === 'text' && /Event title/.test(shape.name))
          .map((shape) => ({ name: shape.name, characters: shape.characters, hidden: shape.hidden })),
      };
    }
    return {
      fileId: penpot.currentFile.id,
      pageId: penpot.currentPage.id,
      revision: penpot.currentFile.revn,
      exactTitle: cfg.exactTitle,
      cases: result,
      validation: await penpot.currentFile.validate(),
    };
  };
  const exportCase = async (key) => {
    assertContext();
    if (!['B', 'C'].includes(key)) throw new Error('key must be B or C');
    const board = penpot.currentPage.getShapeById(cfg[key].boardId);
    const bytes = await board.export({ type: 'png' });
    storage.bytesToBase64 ||= (data) => {
      let binary = '';
      for (let offset = 0; offset < data.length; offset += 8192) {
        binary += String.fromCharCode(...data.subarray(offset, offset + 8192));
      }
      return btoa(binary);
    };
    storage.freeCollectionRendererReproPng = storage.bytesToBase64(bytes);
    return {
      key,
      boardId: board.id,
      width: board.width,
      height: board.height,
      bytes: bytes.length,
      base64Length: storage.freeCollectionRendererReproPng.length,
    };
  };
  storage.freeCollectionRendererMatrixRepro = { readback, exportCase, constants: cfg };
  return { installed: true, methods: ['readback', 'exportCase'], constants: cfg };
}

if (typeof module !== 'undefined') {
  module.exports = { FREE_COLLECTION_RENDERER_REPRO, installFreeCollectionRendererRepro };
}
