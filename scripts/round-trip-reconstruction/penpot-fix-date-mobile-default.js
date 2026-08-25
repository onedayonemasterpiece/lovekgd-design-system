/**
 * Bounded Penpot plugin-context repair for the Date mobile owner board.
 *
 * The source-reachable default is the closed listing.  The existing linked
 * component was materialized with its menu-open child visible and both shell
 * children hidden.  Its date accessory was also placed above the feed even
 * though the source-reachable mobile shell pins it directly above the bottom
 * navigation. Repair the master, then reset only the canonical 63.02 mobile
 * owner instance so the correction propagates through normal component
 * inheritance. No resources or detached shapes are created.
 */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const COMPONENT_ID = 'a21f5e36-5d76-8065-8008-86dac3f1f23a';
const MAIN_ID = 'a21f5e36-5d76-8065-8008-86dac0a44a53';
const OWNER_PAGE_ID = 'd87e18f1-dcb4-80a6-8008-8807f67e8a2e';
const OWNER_BOARD_ID = 'd87e18f1-dcb4-80a6-8008-882bc2dad4ce';

const settle = () => new Promise(resolve => setTimeout(resolve, 750));
const assertFile = penpot => {
  if (penpot.currentFile?.id !== FILE_ID) {
    throw new Error(`wrong Penpot file: ${penpot.currentFile?.id}`);
  }
};

/** First MCP call: mutate only the Date mobile main component page. */
async function fixDateMobileDefaultMaster(penpot) {
  assertFile(penpot);
  const component = penpot.library.local.components.find(item => item.id === COMPONENT_ID);
  if (!component) throw new Error(`missing Date mobile component: ${COMPONENT_ID}`);
  const main = component.mainInstance();
  if (!main || main.id !== MAIN_ID) throw new Error(`unexpected Date mobile main: ${main?.id}`);

  const mainPage = penpot.currentFile.pages.find(page => page.getShapeById(MAIN_ID));
  if (!mainPage) throw new Error(`main page not found for ${MAIN_ID}`);
  if (penpot.currentPage?.id !== mainPage.id) {
    await penpot.openPage(mainPage);
    await settle();
  }
  const liveMain = penpot.currentPage?.getShapeById(MAIN_ID);
  if (!liveMain) throw new Error(`main unavailable after opening ${mainPage.id}`);

  const wanted = new Map([
    ['linked Shell / Mobile header', false],
    ['linked Shell / Mobile bottom navigation', false],
    ['linked Shell / Mobile menu / open', true]
  ]);
  const changes = [];
  for (const [name, hidden] of wanted) {
    const child = liveMain.children.find(item => item.name === name);
    if (!child) throw new Error(`missing Date mobile master child: ${name}`);
    if (child.hidden !== hidden) {
      const before = child.hidden;
      child.hidden = hidden;
      changes.push({ shape_id: child.id, name, before_hidden: before, after_hidden: hidden });
    }
  }

  const rail = liveMain.children.find(item => item.name === 'linked Listing / Mobile rail viewport');
  const accessory = liveMain.children.find(item => item.name === 'linked Listing / Mobile date accessory');
  if (!rail || !accessory) throw new Error('missing Date mobile rail/accessory layout children');

  // Astro's source-reachable 390x844 shell is header(84) + scroll viewport(640)
  // + date accessory(56) + bottom navigation(64).  Keep this correction at the
  // composition master so the owner and every future instance inherit it.
  if (rail.parentX !== 0 || rail.parentY !== 84) {
    const before = { parent_x: rail.parentX, parent_y: rail.parentY };
    penpotUtils.setParentXY(rail, 0, 84);
    changes.push({ shape_id: rail.id, name: rail.name, field: 'position', before, after: { parent_x: rail.parentX, parent_y: rail.parentY } });
  }
  if (rail.width !== 390 || rail.height !== 640) {
    const before = { width: rail.width, height: rail.height };
    rail.resize(390, 640);
    changes.push({ shape_id: rail.id, name: rail.name, field: 'size', before, after: { width: rail.width, height: rail.height } });
  }
  if (accessory.parentX !== 0 || accessory.parentY !== 724) {
    const before = { parent_x: accessory.parentX, parent_y: accessory.parentY };
    penpotUtils.setParentXY(accessory, 0, 724);
    changes.push({ shape_id: accessory.id, name: accessory.name, field: 'position', before, after: { parent_x: accessory.parentX, parent_y: accessory.parentY } });
  }

  await settle();
  const validation = penpot.currentFile.validate();
  if (validation.length) throw new Error(`Penpot validation failed: ${JSON.stringify(validation)}`);
  return {
    schema_version: 'round-trip-reconstruction.penpot-date-mobile-default-master-repair.v2',
    changed: changes.length,
    changes,
    validation
  };
}

/** Second MCP call: reset only the canonical 63.02 linked owner instance. */
async function resetDateMobileDefaultOwner(penpot) {
  assertFile(penpot);
  const ownerPage = penpot.currentFile.pages.find(page => page.id === OWNER_PAGE_ID);
  if (!ownerPage) throw new Error(`missing Date owner page: ${OWNER_PAGE_ID}`);
  if (penpot.currentPage?.id !== OWNER_PAGE_ID) {
    await penpot.openPage(ownerPage);
    await settle();
  }
  const owner = penpot.currentPage?.getShapeById(OWNER_BOARD_ID);
  if (!owner) throw new Error(`missing Date mobile owner: ${OWNER_BOARD_ID}`);
  if (!owner.isComponentCopy) throw new Error(`Date mobile owner is detached: ${OWNER_BOARD_ID}`);
  owner.resetOverrides();
  await settle();
  const validation = penpot.currentFile.validate();
  if (validation.length) throw new Error(`Penpot validation failed: ${JSON.stringify(validation)}`);
  return {
    schema_version: 'round-trip-reconstruction.penpot-date-mobile-default-owner-reset.v2',
    owner_page_id: OWNER_PAGE_ID,
    owner_shape_id: OWNER_BOARD_ID,
    owner_reset: true,
    validation
  };
}

if (typeof module !== 'undefined') module.exports = { fixDateMobileDefaultMaster, resetDateMobileDefaultOwner };
