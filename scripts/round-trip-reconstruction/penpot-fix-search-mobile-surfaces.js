/**
 * Lowest-owning correction for the source-reachable mobile Search surface.
 * Astro paints the page background once; the query controller and collection
 * links are transparent sections.  Earlier Penpot masters added opaque white
 * fills, creating one large false white slab in every linked owner instance.
 */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880ac732b6ae';
const MAIN_IDS = [
  'd87e18f1-dcb4-80a6-8008-885ba511f9d9',
  'd87e18f1-dcb4-80a6-8008-885bfcf2f2bc'
];

async function fixSearchMobileSurfaces(penpot) {
  if (penpot.currentFile?.id !== FILE_ID) throw new Error(`wrong Penpot file: ${penpot.currentFile?.id}`);
  const page = penpot.currentFile.pages.find(item => item.id === PAGE_ID);
  if (!page) throw new Error(`missing Search page: ${PAGE_ID}`);
  if (penpot.currentPage?.id !== PAGE_ID) {
    await penpot.openPage(page);
    await new Promise(resolve => setTimeout(resolve, 750));
  }
  const changes = [];
  for (const id of MAIN_IDS) {
    const shape = penpot.currentPage.getShapeById(id);
    if (!shape?.isComponentMainInstance()) throw new Error(`missing Search component main: ${id}`);
    if (shape.fills.length) {
      changes.push({ shape_id: id, name: shape.name, before_fills: shape.fills });
      shape.fills = [];
    }
  }
  await new Promise(resolve => setTimeout(resolve, 750));
  const validation = penpot.currentFile.validate();
  if (validation.length) throw new Error(`Penpot validation failed: ${JSON.stringify(validation)}`);
  return { schema_version: 'round-trip-reconstruction.penpot-search-mobile-surfaces.v1', changed: changes.length, changes, validation };
}

if (typeof module !== 'undefined') module.exports = { fixSearchMobileSurfaces };
