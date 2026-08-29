/**
 * Reconcile the bounded Festival owners with the centralized FestivalCard
 * family already used by Astro through FestivalCard.astro.
 *
 * The structural migration was materialized once at Penpot revision 2917.
 * This script is deliberately fail-closed: it verifies stable IDs, restores
 * canonical paths/visibility, and refuses to fabricate a missing component.
 * It never detaches, screenshots, uploads media, or rebuilds a card beside an
 * archetype owner.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880c8e21990e';
const CARD_PATH = 'Event cards / Festival / Context';
const OWNERS = [
  {
    viewport: 'desktop',
    component: '8f804431-c282-8075-8008-8e47c794010e',
    main: '8f804431-c282-8075-8008-8e47c74a4773',
    cards: [
      ['city-jazz', 'd87e18f1-dcb4-80a6-8008-8840098153da', '8f804431-c282-8075-8008-8e4a643f04cc'],
      ['sosedi', '8f804431-c282-8075-8008-8e70872ba99d', '8f804431-c282-8075-8008-8e70b9bb0201'],
      ['grozd', '8f804431-c282-8075-8008-8e70ba357167', '8f804431-c282-8075-8008-8e70ba3e3e06'],
      ['more-vnutri', '8f804431-c282-8075-8008-8e70c528e875', '8f804431-c282-8075-8008-8e70c5348243'],
      ['bolshoy-kaup', '8f804431-c282-8075-8008-8e70c5ace50b', '8f804431-c282-8075-8008-8e70c5b714d4'],
      ['v-edinstve', '8f804431-c282-8075-8008-8e70d27bd879', '8f804431-c282-8075-8008-8e70d2854fdf'],
      ['jazz-v-filarmonii', '8f804431-c282-8075-8008-8e70d30b247b', '8f804431-c282-8075-8008-8e70d3165dd7'],
    ],
  },
  {
    viewport: 'mobile',
    component: '8f804431-c282-8075-8008-8e4b71af533f',
    main: '8f804431-c282-8075-8008-8e4b7165f61c',
    cards: [
      ['city-jazz', 'd87e18f1-dcb4-80a6-8008-8841ea46c2cc', '8f804431-c282-8075-8008-8e4bb30b2bab'],
      ['sosedi', '8f804431-c282-8075-8008-8e70e0b9808a', '8f804431-c282-8075-8008-8e70e0c5f0ba'],
      ['grozd', '8f804431-c282-8075-8008-8e70e14636dc', '8f804431-c282-8075-8008-8e70e14f4dc5'],
      ['more-vnutri', '8f804431-c282-8075-8008-8e70eeb2d2f1', '8f804431-c282-8075-8008-8e70eebe199b'],
      ['bolshoy-kaup', '8f804431-c282-8075-8008-8e70ef679d4b', '8f804431-c282-8075-8008-8e70ef76b304'],
      ['v-edinstve', '8f804431-c282-8075-8008-8e7103293b96', '8f804431-c282-8075-8008-8e710336adad'],
      ['jazz-v-filarmonii', '8f804431-c282-8075-8008-8e7103e330f5', '8f804431-c282-8075-8008-8e7103f0b7b2'],
    ],
  },
];

function installFestivalCardCentralization(penpot, storage) {
  const component = (id) => penpot.library.local.components.find((item) => item.id === id);
  const assertContext = () => {
    if (String(penpot.currentFile?.id) !== FILE_ID) throw new Error(`expected Penpot file ${FILE_ID}`);
    if (String(penpot.currentPage?.id) !== PAGE_ID) throw new Error(`open settled Festivals page ${PAGE_ID}`);
  };
  const resolve = (entry) => {
    const ownerComponent = component(entry.component);
    if (!ownerComponent) throw new Error(`missing Festival owner ${entry.component}`);
    const owner = ownerComponent.mainInstance();
    if (owner.id !== entry.main) throw new Error(`Festival owner main drift for ${entry.viewport}`);
    return { ownerComponent, owner };
  };

  function readback() {
    assertContext();
    return {
      file: penpot.currentFile.id,
      page: penpot.currentPage.id,
      revision: penpot.currentFile.revn,
      owners: OWNERS.map((entry) => {
        const { owner } = resolve(entry);
        const native = [...owner.children].filter((shape) => /^Festival fixture \/ .+ \/ native$/u.test(shape.name));
        const linked = entry.cards.map(([fixture, componentId, instanceId]) => {
          const central = component(componentId);
          if (!central) throw new Error(`missing FestivalCard component ${componentId}`);
          const instance = [...owner.children].find((shape) => shape.id === instanceId);
          return {
            fixture,
            component: componentId,
            componentPath: central.path,
            instance: instanceId,
            linked: Boolean(instance?.isComponentCopyInstance?.() && instance.component?.()?.id === componentId),
            visible: Boolean(instance && !instance.hidden),
          };
        });
        return { viewport: entry.viewport, component: entry.component, main: owner.id, native: native.map((shape) => shape.id), linked };
      }),
      validation: penpot.currentFile.validate(),
    };
  }

  function run() {
    assertContext();
    const block = penpot.history.undoBlockBegin();
    try {
      for (const entry of OWNERS) {
        const { owner } = resolve(entry);
        for (const [fixture, componentId, instanceId] of entry.cards) {
          const central = component(componentId);
          if (!central) throw new Error(`missing FestivalCard ${fixture}/${entry.viewport}`);
          central.path = CARD_PATH;
          const instance = [...owner.children].find((shape) => shape.id === instanceId);
          if (!instance || !instance.isComponentCopyInstance?.() || instance.component?.()?.id !== componentId) {
            throw new Error(`missing linked FestivalCard ${fixture}/${entry.viewport}`);
          }
          instance.hidden = false;
        }
      }
    } finally {
      penpot.history.undoBlockFinish(block);
    }
    const after = readback();
    if (after.owners.some((owner) => owner.native.length || owner.linked.length !== 7)) throw new Error('Festival owner card ancestry is incomplete');
    if (after.owners.some((owner) => owner.linked.some((card) => !card.linked || !card.visible || card.componentPath !== CARD_PATH))) throw new Error('FestivalCard centralization drift detected');
    if (after.validation.length) throw new Error(`Penpot validation failed: ${JSON.stringify(after.validation)}`);
    return after;
  }

  storage.festivalCardCentralization = { run, readback, constants: { FILE_ID, PAGE_ID, CARD_PATH, OWNERS } };
  return storage.festivalCardCentralization;
}
