/**
 * OV-40 Interest clubs source-exact reconciliation.
 *
 * The factual three-card owners were already materialized from Astro. This
 * bounded reconciler removes the stale `state=empty` component identity and
 * reads back the six linked canonical Club card consumers without rebuilding
 * the page.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880cfe1ec779';
const DESKTOP_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880d073401a1';
const MOBILE_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880d0cc8465b';
const CLUB_CARD_ID = 'd87e18f1-dcb4-80a6-8008-88648c204cec';
const DESKTOP_HEADER_ID = 'd87e18f1-dcb4-80a6-8008-8864884b188a';
const MOBILE_HEADER_ID = 'd87e18f1-dcb4-80a6-8008-8864892f5750';
const DESKTOP_HEADER_NAME = 'viewport=desktop;state=ready;catalog=3';
const MOBILE_HEADER_NAME = 'viewport=mobile;state=ready;catalog=3';

function installInterestClubsOv40Reconciler(penpot, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Interest clubs page ${PAGE_ID}`);
    }
  };
  const componentById = (id) => penpot.library.local.components.find((component) => component.id === id);
  const walk = (shape, result = []) => {
    result.push(shape);
    for (const child of shape.children || []) walk(child, result);
    return result;
  };

  function reconcileHeaderNames() {
    assertContext();
    const block = penpot.history.undoBlockBegin();
    try {
      const pairs = [[DESKTOP_HEADER_ID, DESKTOP_HEADER_NAME], [MOBILE_HEADER_ID, MOBILE_HEADER_NAME]];
      return pairs.map(([id, name]) => {
        const component = componentById(id);
        if (!component) throw new Error(`missing Interest clubs header ${id}`);
        component.name = name;
        component.mainInstance().name = `Interest clubs / Header / ${name}`;
        return { id, name: component.name, main: component.mainInstance().id };
      });
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function readback() {
    assertContext();
    const owners = [DESKTOP_OWNER_ID, MOBILE_OWNER_ID].map((id) => {
      const component = componentById(id);
      if (!component) throw new Error(`missing Interest clubs owner ${id}`);
      const main = component.mainInstance();
      const linkedCards = walk(main).filter((shape) =>
        shape.name?.startsWith('linked Interest clubs / Club card /') &&
        shape.component?.()?.id === CLUB_CARD_ID,
      );
      return {
        id,
        name: component.name,
        main: main.id,
        size: [main.width, main.height],
        linked_card_roots: linkedCards.map((shape) => ({ id: shape.id, name: shape.name })),
      };
    });
    return {
      owners,
      headers: [DESKTOP_HEADER_ID, MOBILE_HEADER_ID].map((id) => {
        const component = componentById(id);
        return { id, name: component?.name, main: component?.mainInstance()?.id };
      }),
      validation: await penpot.currentFile.validate(),
    };
  }

  storage.interestClubsOv40 = { reconcileHeaderNames, readback };
  return { installed: true, methods: Object.keys(storage.interestClubsOv40) };
}

if (typeof module !== 'undefined') {
  module.exports = {
    installInterestClubsOv40Reconciler,
    constants: {
      FILE_ID, PAGE_ID, DESKTOP_OWNER_ID, MOBILE_OWNER_ID, CLUB_CARD_ID,
      DESKTOP_HEADER_ID, MOBILE_HEADER_ID,
    },
  };
}
