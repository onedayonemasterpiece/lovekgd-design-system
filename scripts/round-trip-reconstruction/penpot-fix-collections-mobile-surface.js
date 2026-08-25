/** Remove the false opaque surface from the reusable mobile breadcrumb. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880c4a36d153';
const MAIN_ID = 'd87e18f1-dcb4-80a6-8008-886280aa46b0';

async function fixCollectionsMobileSurface(penpot) {
  if (penpot.currentFile?.id !== FILE_ID) throw new Error(`wrong Penpot file: ${penpot.currentFile?.id}`);
  const page = penpot.currentFile.pages.find(item => item.id === PAGE_ID);
  if (!page) throw new Error(`missing Collections page: ${PAGE_ID}`);
  if (penpot.currentPage?.id !== PAGE_ID) {
    await penpot.openPage(page);
    await new Promise(resolve => setTimeout(resolve, 750));
  }
  const main = penpot.currentPage.getShapeById(MAIN_ID);
  if (!main?.isComponentMainInstance()) throw new Error(`missing Collections breadcrumb main: ${MAIN_ID}`);
  const changed = main.fills.length > 0;
  if (changed) main.fills = [];
  await new Promise(resolve => setTimeout(resolve, 750));
  const validation = penpot.currentFile.validate();
  if (validation.length) throw new Error(`Penpot validation failed: ${JSON.stringify(validation)}`);
  return { schema_version: 'round-trip-reconstruction.penpot-collections-mobile-surface.v1', changed: Number(changed), validation };
}

if (typeof module !== 'undefined') module.exports = { fixCollectionsMobileSurface };
