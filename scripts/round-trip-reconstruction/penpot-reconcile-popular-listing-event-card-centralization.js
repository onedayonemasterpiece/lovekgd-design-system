/**
 * Reconcile the Popular desktop surface with the centralized ListingEventCard
 * family that Astro already owns through ListingEventCard.astro.
 *
 * This is intentionally a two-page, resumable reconciler:
 * - runCorpus() on 40.2a verifies the fifteen native card masters, keeps their
 *   linked media visible, and verifies that every behavior group consumes five
 *   linked centralized cards;
 * - runOwner() on 63.04 verifies the visible desktop owner ancestry.
 *
 * It never screenshots, detaches, or reconstructs a card beside an owner.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const CORPUS_PAGE_ID = '8e7accff-5c78-8007-8008-8964f8dc3b14';
const OWNER_PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880937f54501';
const CARD_PATH = 'Event cards / Compact variants / Popular density';
const MEDIA_PATH = 'Event cards / Listing media / Popular corpus';
const GROUP_PATH = 'Popular / Grouping / Fixture';
const OWNER_ID = 'd87e18f1-dcb4-80a6-8008-88093b1df881';
const SHELL_ID = 'a21f5e36-5d76-8065-8008-86ae4bdf9963';
const DISCOVERY_ID = 'c0b867fa-32d2-8062-8008-8d679ca1da53';

const CARD_IDS = [
  '8f804431-c282-8075-8008-8e6c03f62c24',
  '8f804431-c282-8075-8008-8e6b5a53e80d',
  '8f804431-c282-8075-8008-8e6a684a49d4',
  '8f804431-c282-8075-8008-8e6aeee3337f',
  '8f804431-c282-8075-8008-8e6b2e2c9d0e',
  '8f804431-c282-8075-8008-8e6b5e19d033',
  '8f804431-c282-8075-8008-8e6bdb841e65',
  '8f804431-c282-8075-8008-8e6bb3da2302',
  '8f804431-c282-8075-8008-8e6a1de1f155',
  '8f804431-c282-8075-8008-8e6b30f9a275',
  '8f804431-c282-8075-8008-8e6bd83f0a33',
  '8f804431-c282-8075-8008-8e6a358a2a8c',
  '8f804431-c282-8075-8008-8e6a62fe06e9',
  '8f804431-c282-8075-8008-8e6b8763c457',
  '8f804431-c282-8075-8008-8e6bb0f66a4d',
];

const GROUPS = [
  { reason: 'fast_growth', component: '8e7accff-5c78-8007-8008-89695e58e9a8', ownerInstance: '8f804431-c282-8075-8008-8e6c9880e008' },
  { reason: 'multi_source', component: '8e7accff-5c78-8007-8008-896cab00b098', ownerInstance: '8f804431-c282-8075-8008-8e6c99cecdbd' },
  { reason: 'discussed', component: '8e7accff-5c78-8007-8008-896d3d50663f', ownerInstance: '8f804431-c282-8075-8008-8e6c9b1bbf26' },
];

function installPopularListingEventCardCentralization(penpot, storage) {
  const component = (id) => penpot.library.local.components.find((item) => item.id === id);
  const walk = (shape, result = []) => {
    result.push(shape);
    if (shape.children) for (const child of shape.children) walk(child, result);
    return result;
  };
  const assertFile = () => {
    if (String(penpot.currentFile?.id) !== FILE_ID) throw new Error(`expected Penpot file ${FILE_ID}`);
  };
  const assertPage = (pageId) => {
    assertFile();
    if (String(penpot.currentPage?.id) !== pageId) throw new Error(`open settled Penpot page ${pageId}`);
  };
  const cards = () => CARD_IDS.map((id) => {
    const item = component(id);
    if (!item) throw new Error(`missing Popular ListingEventCard ${id}`);
    return item;
  });

  function readback() {
    assertFile();
    const cardRows = cards().map((item) => {
      const main = item.mainInstance();
      const media = walk(main).find((shape) => shape.type === 'board' && shape.isComponentCopyInstance?.() && shape.component?.()?.path === MEDIA_PATH);
      return { id: item.id, name: item.name, path: item.path, main: main.id, size: [main.width, main.height], media: media?.component?.()?.id, mediaVisible: media ? !media.hidden : false };
    });
    const groupRows = GROUPS.map((entry) => {
      const item = component(entry.component);
      if (!item) throw new Error(`missing Popular group ${entry.component}`);
      const main = item.mainInstance();
      const linkedCards = [...main.children].filter((shape) => shape.isComponentCopyInstance?.() && shape.component?.()?.path === CARD_PATH);
      return { ...entry, path: item.path, main: main.id, linkedCards: linkedCards.map((shape) => shape.component().id), visibleLinkedCards: linkedCards.filter((shape) => !shape.hidden).length };
    });
    const owner = component(OWNER_ID)?.mainInstance();
    const visible = owner ? [...owner.children].filter((shape) => !shape.hidden && shape.isComponentCopyInstance?.()) : [];
    return {
      file: penpot.currentFile.id,
      revision: penpot.currentFile.revn,
      page: penpot.currentPage.id,
      cards: cardRows,
      groups: groupRows,
      owner: owner && {
        id: owner.id,
        visibleGroups: GROUPS.map((entry) => visible.some((shape) => shape.component?.()?.id === entry.component)),
        canonicalShell: visible.some((shape) => shape.component?.()?.id === SHELL_ID),
        canonicalDiscovery: visible.some((shape) => shape.component?.()?.id === DISCOVERY_ID),
      },
      validation: penpot.currentFile.validate(),
    };
  }

  function runCorpus() {
    assertPage(CORPUS_PAGE_ID);
    const block = penpot.history.undoBlockBegin();
    try {
      for (const item of cards()) {
        item.path = CARD_PATH;
        for (const shape of walk(item.mainInstance())) {
          if (shape.component?.()?.path === MEDIA_PATH) shape.hidden = false;
        }
      }
      for (const entry of GROUPS) {
        const item = component(entry.component);
        item.path = GROUP_PATH;
        const linkedCards = [...item.mainInstance().children].filter((shape) => shape.isComponentCopyInstance?.() && shape.component?.()?.path === CARD_PATH);
        if (linkedCards.length !== 5) throw new Error(`${entry.reason} must consume five centralized cards`);
        for (const linked of linkedCards) linked.hidden = false;
      }
    } finally {
      penpot.history.undoBlockFinish(block);
    }
    const after = readback();
    if (after.cards.some((item) => item.path !== CARD_PATH || !item.mediaVisible)) throw new Error('Popular card family reconciliation is incomplete');
    if (after.groups.some((item) => item.path !== GROUP_PATH || item.visibleLinkedCards !== 5)) throw new Error('Popular grouping reconciliation is incomplete');
    if (after.validation.length) throw new Error(`Penpot validation failed: ${JSON.stringify(after.validation)}`);
    return after;
  }

  function runOwner() {
    assertPage(OWNER_PAGE_ID);
    const owner = component(OWNER_ID)?.mainInstance();
    if (!owner) throw new Error(`missing Popular desktop owner ${OWNER_ID}`);
    const block = penpot.history.undoBlockBegin();
    try {
      for (const entry of GROUPS) {
        const instance = [...owner.children].find((shape) => shape.id === entry.ownerInstance && shape.component?.()?.id === entry.component);
        if (!instance) throw new Error(`missing centralized owner group ${entry.reason}`);
        instance.hidden = false;
      }
      for (const required of [SHELL_ID, DISCOVERY_ID]) {
        const instance = [...owner.children].find((shape) => shape.component?.()?.id === required);
        if (!instance) throw new Error(`missing canonical owner dependency ${required}`);
        instance.hidden = false;
      }
    } finally {
      penpot.history.undoBlockFinish(block);
    }
    const after = readback();
    if (!after.owner.visibleGroups.every(Boolean) || !after.owner.canonicalShell || !after.owner.canonicalDiscovery) throw new Error('Popular owner ancestry is incomplete');
    if (after.validation.length) throw new Error(`Penpot validation failed: ${JSON.stringify(after.validation)}`);
    return after;
  }

  storage.popularListingEventCardCentralization = {
    runCorpus,
    runOwner,
    readback,
    constants: { FILE_ID, CORPUS_PAGE_ID, OWNER_PAGE_ID, CARD_PATH, MEDIA_PATH, GROUP_PATH, OWNER_ID, SHELL_ID, DISCOVERY_ID, CARD_IDS, GROUPS },
  };
  return storage.popularListingEventCardCentralization;
}
