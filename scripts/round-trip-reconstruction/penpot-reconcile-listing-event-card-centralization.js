/**
 * Centralize the already source-exact Date/Weekend ListingEventCard masters.
 *
 * These five components were native and linked, but were filed under local
 * fixture-adapter paths.  That made the owner pages look as though they had
 * hand-built their own event cards.  The correction keeps every component ID,
 * main ID, child dependency and consumer link stable and changes only the
 * library ownership path to the canonical compact-card family.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const CANONICAL_PATH = 'Event cards / Compact variants';
const TARGET_IDS = [
  'd87e18f1-dcb4-80a6-8008-87733a67d4bb',
  'd87e18f1-dcb4-80a6-8008-8773575484aa',
  'd87e18f1-dcb4-80a6-8008-877370383914',
  'd87e18f1-dcb4-80a6-8008-87b75354f2ed',
  'd87e18f1-dcb4-80a6-8008-87becba472c7',
];

function installListingEventCardCentralization(penpot, storage) {
  const byId = (id) => penpot.library.local.components.find((component) => component.id === id);

  function readback() {
    if (penpot.currentFile?.id !== FILE_ID) throw new Error(`expected Penpot file ${FILE_ID}`);
    const components = TARGET_IDS.map((id) => {
      const component = byId(id);
      if (!component) throw new Error(`missing compact card component ${id}`);
      const main = component.mainInstance();
      return {
        id: component.id,
        name: component.name,
        path: component.path,
        main: main.id,
        width: main.width,
        height: main.height,
      };
    });
    return {
      file_id: penpot.currentFile.id,
      revision: penpot.currentFile.revn,
      components,
      canonical_count: components.filter((component) => component.path === CANONICAL_PATH).length,
      validation: penpot.currentFile.validate(),
    };
  }

  async function run() {
    const before = readback();
    const changed = [];
    for (const id of TARGET_IDS) {
      const component = byId(id);
      if (component.path === CANONICAL_PATH) continue;
      const block = penpot.history.undoBlockBegin();
      try {
        const oldPath = component.path;
        component.path = CANONICAL_PATH;
        changed.push({ id, old_path: oldPath, new_path: component.path });
      } finally {
        penpot.history.undoBlockFinish(block);
      }
    }
    if (changed.length) {
      await penpot.currentFile.saveVersion('ListingEventCard compact · centralized Date Weekend variants');
    }
    const after = readback();
    if (after.canonical_count !== TARGET_IDS.length) throw new Error('compact card centralization is incomplete');
    if (after.validation.length) throw new Error(`Penpot validation failed: ${JSON.stringify(after.validation)}`);
    return { before, changed, after, idempotent: changed.length === 0 };
  }

  storage.listingEventCardCentralization = { run, readback, constants: { FILE_ID, CANONICAL_PATH, TARGET_IDS } };
  return storage.listingEventCardCentralization;
}

