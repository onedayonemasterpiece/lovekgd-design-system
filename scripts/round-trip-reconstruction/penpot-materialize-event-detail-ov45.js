/**
 * Source-exact OV-45 recovery for Page 63.07.
 *
 * The existing event.real.5459 desktop owner is corrected in place from the
 * browser-measured Astro geometry. Separate native component states preserve
 * the real event.real.5757 top medallion and event.real.5511 occurrence
 * summary/practical matrix. Screenshots are evidence only; every Penpot result
 * is native and every reused resource remains a linked component instance.
 *
 * Open Page 63.07 in a separate call and settle it before installation. Run
 * one method per call. Text records are deliberately split to avoid Penpot's
 * resize-text event loop. A 504 is an unknown outcome: read back before resume.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880bfdfbf2ec';
const DESKTOP_OWNER_ID = 'd87e18f1-dcb4-80a6-8008-880bfe361a1d';
const HERO_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-885fec553e0f';
const SUMMARY_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-88603a654453';
const ACTION_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-88603c044ff2';
const GALLERY_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-88603d456ce8';
const DESCRIPTION_COMPONENT_ID = 'd87e18f1-dcb4-80a6-8008-8860d4142b39';
const PRACTICAL_COMPONENT_ID = '8e7accff-5c78-8007-8008-895ea18d6435';
const HEADER_COMPONENT_ID = 'a21f5e36-5d76-8065-8008-86ae4bdf9963';
const DRAMTEATR_COMPONENT_ID = '45777396-2f2a-80c0-8008-819170e25449';

const TOP_PATH = 'Event detail / Summary source state';
const OCCURRENCE_PATH = 'Event detail / Occurrence navigation';
const STATE_BOARD_PATH = 'Event detail / OV45 source states';
const TOP_NAME = 'fixture=event.real.5757;state=top-medallion;viewport=desktop';
const OCCURRENCE_SUMMARY_NAME = 'fixture=event.real.5511;variant=desktop-summary;state=multiple';
const OCCURRENCE_PRACTICAL_NAME = 'fixture=event.real.5511;variant=practical;state=multiple';
const STATE_BOARD_NAME = 'fixtures=5459+5757+5511;viewport=desktop;source-exact';

const SUMMARY_TEXT = {
  'Event type': { x: 38.390625, y: 42.984375, width: 90.484375, height: 21, size: 13.12, weight: 900, lineHeight: 1.6, letterSpacing: 0.9184, color: '#91401d' },
  'Date range': { x: 388.3125, y: 38.390625, width: 277.78125, height: 30.1875, size: 18.88, weight: 900, lineHeight: 1.6, letterSpacing: 0.9184, color: '#91401d' },
  Weekday: { x: 676.484375, y: 45.390625, width: 68.3125, height: 21, size: 13.12, weight: 900, lineHeight: 1.6, letterSpacing: 0.9184, color: '#7b6b5e' },
  'Event title': { x: 38.390625, y: 82.078125, width: 476.828125, height: 77.375, size: 40.32, weight: 700, lineHeight: 0.96, letterSpacing: -2.2176, color: '#241c17' },
  Lead: { x: 38.390625, y: 172.953125, width: 494.40625, height: 63.9375, size: 14.4, weight: 400, lineHeight: 1.48, letterSpacing: 0, color: '#62564d' },
  Venue: { x: 69.578125, y: 250.390625, width: 675.21875, height: 26.09375, size: 16.32, weight: 700, lineHeight: 1.6, letterSpacing: 0, color: '#241c17' },
  Address: { x: 69.578125, y: 277.4375, width: 675.21875, height: 20.46875, size: 12.8, weight: 700, lineHeight: 1.6, letterSpacing: 0, color: '#72645b' },
};

function installOv45EventDetailMaterializer(penpot, penpotUtils, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) {
      throw new Error(`open settled Event detail page ${PAGE_ID} before OV-45 materialization`);
    }
  };
  const componentById = (id) => penpot.library.local.components.find((component) => component.id === id);
  const componentByIdentity = (path, name) => penpot.library.local.components.find(
    (component) => component.path === path && component.name === name,
  );
  const place = (shape, x, y, width, height) => {
    if (shape.layoutChild) shape.layoutChild.absolute = true;
    if (width != null && height != null) shape.resize(width, height);
    penpotUtils.setParentXY(shape, x, y);
    return shape;
  };
  const board = (parent, name, x, y, width, height, color = null, radius = 0) => {
    const shape = penpot.createBoard();
    shape.name = name;
    shape.fills = color ? [{ fillColor: color, fillOpacity: 1 }] : [];
    shape.strokes = [];
    shape.borderRadius = radius;
    shape.clipContent = false;
    if (parent) parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const rectangle = (parent, name, x, y, width, height, color, radius = 0) => {
    const shape = penpot.createRectangle();
    shape.name = name;
    shape.fills = [{ fillColor: color, fillOpacity: 1 }];
    shape.strokes = [];
    shape.borderRadius = radius;
    parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const ellipse = (parent, name, x, y, width, height, color) => {
    const shape = penpot.createEllipse();
    shape.name = name;
    shape.fills = [{ fillColor: color, fillOpacity: 1 }];
    shape.strokes = [];
    parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const text = (parent, name, characters, x, y, width, height, size, weight, lineHeight, color, align = 'left', letterSpacing = 0) => {
    const shape = penpot.createText(characters);
    shape.name = name;
    shape.fontFamily = 'Inter';
    shape.fontStyle = 'normal';
    shape.fontSize = String(size);
    shape.fontWeight = String(weight);
    shape.lineHeight = String(lineHeight);
    // Current Penpot plugin validation rejects negative values here. Keep the
    // Astro measurement in the evidence contract but use the nearest accepted
    // native value so the source state remains editable and materializable.
    shape.letterSpacing = String(Math.max(0, letterSpacing));
    shape.align = align;
    shape.fills = [{ fillColor: color, fillOpacity: 1 }];
    parent.appendChild(shape);
    return place(shape, x, y, width, height);
  };
  const main = (id) => {
    const component = componentById(id);
    if (!component) throw new Error(`missing OV-45 component ${id}`);
    return component.mainInstance();
  };

  function apply5459HeroGeometry() {
    assertContext();
    const root = main(HERO_COMPONENT_ID);
    const media = [...root.children].find((shape) => shape.name === 'Media / hero photo · event.real.5459');
    const scrim = [...root.children].find((shape) => shape.name === 'Media scrim');
    const breadcrumb = [...root.children].find((shape) => shape.name === 'Breadcrumb');
    if (!media || !scrim || !breadcrumb) throw new Error('5459 hero anatomy missing');
    const block = penpot.history.undoBlockBegin();
    try {
      root.resize(1280, 843);
      place(media, 0, 0, 1280, 843);
      place(scrim, 0, 673, 1280, 170);
      place(breadcrumb, 48.796875, 580.796875, 650, 26);
      return { root: root.id, size: [root.width, root.height], media: media.id, breadcrumb: breadcrumb.id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function apply5459SummaryTextRecord(name) {
    assertContext();
    const spec = SUMMARY_TEXT[name];
    if (!spec) throw new Error(`unknown 5459 summary text record ${name}`);
    const root = main(SUMMARY_COMPONENT_ID);
    const shape = [...root.children].find((child) => child.type === 'text' && child.name === name);
    if (!shape) throw new Error(`missing 5459 summary text ${name}`);
    const block = penpot.history.undoBlockBegin();
    try {
      shape.fontFamily = 'Inter';
      shape.fontStyle = 'normal';
      shape.fontSize = String(spec.size);
      shape.fontWeight = String(spec.weight);
      shape.lineHeight = String(spec.lineHeight);
      // Penpot's plugin contract rejects negative letterSpacing even though the
      // Astro headline uses -2.2176px. Preserve the measured width/height and
      // leave Penpot's native zero spacing rather than aborting materialization.
      shape.letterSpacing = String(Math.max(0, spec.letterSpacing));
      shape.fills = [{ fillColor: spec.color, fillOpacity: 1 }];
      place(shape, spec.x, spec.y, spec.width, spec.height);
      return { root: root.id, shape: shape.id, name, geometry: [spec.x, spec.y, spec.width, spec.height] };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function apply5459SummaryNonTextGeometry() {
    assertContext();
    const root = main(SUMMARY_COMPONENT_ID);
    const find = (name) => [...root.children].find((shape) => shape.name === name);
    const icon = find('Location icon');
    const museum = find('linked Medallion / kaliningrad-art-museum');
    const pushkin = find('linked Medallion / Pushkin card');
    const divider = find('Section divider');
    if (!icon || !museum || !pushkin || !divider) throw new Error('5459 summary non-text anatomy missing');
    const block = penpot.history.undoBlockBegin();
    try {
      root.resize(783.1875, 449.46875);
      place(icon, 38.390625, 250.390625, 20.796875, 20.796875);
      place(museum, 38.390625, 316.4375, 89.59375, 89.59375);
      place(pushkin, 136.78125, 313, 108.59375, 96.484375);
      place(divider, 0, 448.46875, 783.1875, 1);
      return { root: root.id, size: [root.width, root.height], linkedMedallions: [museum.component()?.id, pushkin.component()?.id] };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function apply5459GalleryGeometry() {
    assertContext();
    const root = main(GALLERY_COMPONENT_ID);
    const byName = (name) => [...root.children].find((shape) => shape.name === name);
    const poster = byName('Gallery / poster');
    const photo1 = byName('Gallery / photo 1');
    const photo2 = byName('Gallery / photo 2');
    const more = byName('Gallery / more');
    const label = byName('Gallery / more label');
    if (!poster || !photo1 || !photo2 || !more || !label) throw new Error('5459 gallery anatomy missing');
    const block = penpot.history.undoBlockBegin();
    try {
      root.resize(404, 387.65625);
      place(poster, 11, 11, 260, 365.65625);
      place(photo1, 281, 11, 112, 116.546875);
      place(photo2, 281, 134.546875, 112, 116.546875);
      place(more, 281, 258.09375, 112, 116.5625);
      label.characters = '+3\nфото';
      place(label, 281, 292.09375, 112, 48);
      return { root: root.id, size: [root.width, root.height], label: label.characters };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function apply5459OwnerGeometry() {
    assertContext();
    const owner = penpot.currentPage.getShapeById(DESKTOP_OWNER_ID);
    if (!owner?.isComponentMainInstance()) throw new Error('5459 desktop owner main missing');
    const byComponent = (id) => [...owner.children].find((shape) => shape.isComponentCopyInstance?.() && shape.component()?.id === id);
    const hero = byComponent(HERO_COMPONENT_ID);
    const summary = byComponent(SUMMARY_COMPONENT_ID);
    const action = byComponent(ACTION_COMPONENT_ID);
    const gallery = byComponent(GALLERY_COMPONENT_ID);
    const description = byComponent(DESCRIPTION_COMPONENT_ID);
    const practical = byComponent(PRACTICAL_COMPONENT_ID);
    const header = byComponent(HEADER_COMPONENT_ID);
    if ([hero, summary, action, gallery, description, practical, header].some((shape) => !shape)) throw new Error('5459 owner linked regions missing');
    const block = penpot.history.undoBlockBegin();
    try {
      owner.resize(1280, 3126.09375);
      owner.clipContent = true;
      place(header, 0, 0, 1280, 57);
      place(hero, 0, 57, 1280, 843);
      place(summary, 38.390625, 660, 783.1875, 449.46875);
      place(action, 860, 503, 404, 228.28125);
      place(gallery, 860, 756.078125, 404, 387.65625);
      place(description, 38.390625, 1119.71875, 784, 1162);
      place(practical, 76.78125, 2370.484375, 706.40625, 525.234375);
      return {
        owner: owner.id,
        size: [owner.width, owner.height],
        linked: [hero, summary, action, gallery, description, practical, header].map((shape) => ({ id: shape.id, componentId: shape.component()?.id })),
      };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensure5757TopMedallionSummary() {
    assertContext();
    const existing = componentByIdentity(TOP_PATH, TOP_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const artwork = componentById(DRAMTEATR_COMPONENT_ID);
    if (!artwork) throw new Error(`missing dramteatr39 artwork ${DRAMTEATR_COMPONENT_ID}`);
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${TOP_PATH} / ${TOP_NAME}`, 4700, 100, 783.1875, 417.546875, '#fffaf2', 28);
      text(root, 'Event type / source exact', 'СПЕКТАКЛЬ', 38.390625, 42.984375, 110, 21, 13.12, 900, 1.6, '#91401d', 'left', 0.9184);
      text(root, 'Date / source exact', '29 августа', 469.234375, 38.390625, 120, 30.1875, 18.88, 900, 1.6, '#91401d', 'right', 0.9184);
      text(root, 'Weekday / source exact', 'суббота', 596, 45.390625, 74, 21, 13.12, 900, 1.6, '#7b6b5e', 'right', 0.9184);
      text(root, 'Time / source exact', '18:00', 681, 38.390625, 64, 30.1875, 18.88, 900, 1.6, '#91401d', 'right', 0.9184);
      text(root, 'Event title / source exact', 'Собачье сердце', 38.390625, 82.078125, 560.1875, 45.453125, 40.32, 700, 0.96, '#241c17', 'left', -2.2176);
      text(root, 'Digest / source exact', 'Профессор Преображенский решается на немыслимый и рискованный эксперимент: пересадить человеческий гипофиз бездомному псу Шарику.', 38.390625, 141.03125, 494.40625, 63.9375, 14.4, 400, 1.48, '#62564d');
      text(root, 'Location icon', '●', 38.390625, 218.46875, 20.796875, 20.796875, 18, 700, 1, '#b34a22');
      text(root, 'Venue / source exact', 'Драматический театр', 69.578125, 218.46875, 675.21875, 26.09375, 16.32, 700, 1.6, '#241c17');
      text(root, 'Address / source exact', 'Мира 4', 69.578125, 245.515625, 675.21875, 20.46875, 12.8, 700, 1.6, '#72645b');
      const medallion = board(root, 'Top medallion / dramteatr39 / source exact', 344.234375, -47.359375, 94.71875, 94.71875);
      ellipse(medallion, 'Top medallion / outer paper ring', 0, 0, 94.71875, 94.71875, '#fffaf2');
      ellipse(medallion, 'Top medallion / inner white ring', 2.359375, 2.359375, 90, 90, '#ffffff');
      const linkedArtwork = artwork.instance();
      linkedArtwork.name = 'linked Medallion / Artwork / dramteatr39';
      medallion.appendChild(linkedArtwork);
      place(linkedArtwork, 3.359375, 3.359375, 88, 88);
      rectangle(root, 'Section divider', 0, 416.546875, 783.1875, 1, '#e7d8c8');
      const component = penpot.library.local.createComponent([root]);
      return { existing: false, id: component.id, main: component.mainInstance().id, linkedArtwork: linkedArtwork.component()?.id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensure5511OccurrenceSummary() {
    assertContext();
    const existing = componentByIdentity(OCCURRENCE_PATH, OCCURRENCE_SUMMARY_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${OCCURRENCE_PATH} / ${OCCURRENCE_SUMMARY_NAME}`, 4700, 620, 250.4375, 56.890625);
      text(root, 'Current date / source exact', '24 июля', 0, 0, 88, 30.1875, 18.88, 900, 1.6, '#91401d');
      text(root, 'Current weekday / source exact', 'пятница', 94, 7, 67, 21, 13.12, 900, 1.6, '#7b6b5e');
      text(root, 'Current time / source exact', '19:00', 168, 0, 82.4375, 30.1875, 18.88, 900, 1.6, '#91401d', 'right');
      text(root, 'Other dates link / source exact', 'Другие даты (2) ↓', 86, 34, 164.4375, 22.890625, 11.84, 900, 1.55, '#8d3417', 'right');
      const component = penpot.library.local.createComponent([root]);
      return { existing: false, id: component.id, main: component.mainInstance().id };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensure5511OccurrencePractical() {
    assertContext();
    const existing = componentByIdentity(OCCURRENCE_PATH, OCCURRENCE_PRACTICAL_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const rows = [
      ['24 июля', 'пятница', '19:00', true],
      ['25 июля', 'суббота', '17:00', false],
      ['27 сентября', 'воскресенье', '17:00', false],
    ];
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${OCCURRENCE_PATH} / ${OCCURRENCE_PRACTICAL_NAME}`, 5000, 620, 471.640625, 128.6875);
      rows.forEach(([date, weekday, time, current], index) => {
        const y = index * 42.895833;
        if (index > 0) rectangle(root, `Row separator ${index}`, 0, y, 471.640625, 1, '#eadbd0');
        text(root, `Date ${index + 1} / source exact`, date, 0, y + 8, 105, 22, 13.12, 900, 1.45, '#352820');
        text(root, `Weekday ${index + 1} / source exact`, weekday, 112, y + 9, 112, 20, 11.52, 800, 1.45, '#75665b');
        rectangle(root, `Time chip ${index + 1}${current ? ' / current' : ''}`, 356, y + 5, 88, 32, current ? '#b54d22' : '#fffaf2', 16);
        text(root, `Time ${index + 1} / source exact`, time, 356, y + 11, 88, 20, 12.16, 900, 1, current ? '#fffaf2' : '#8d3417', 'center');
      });
      const component = penpot.library.local.createComponent([root]);
      return { existing: false, id: component.id, main: component.mainInstance().id, rowCount: rows.length };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  function ensureStateBoard() {
    assertContext();
    const existing = componentByIdentity(STATE_BOARD_PATH, STATE_BOARD_NAME);
    if (existing) return { existing: true, id: existing.id, main: existing.mainInstance().id };
    const top = componentByIdentity(TOP_PATH, TOP_NAME);
    const summary = componentByIdentity(OCCURRENCE_PATH, OCCURRENCE_SUMMARY_NAME);
    const practical = componentByIdentity(OCCURRENCE_PATH, OCCURRENCE_PRACTICAL_NAME);
    if (!top || !summary || !practical) throw new Error('create all three OV-45 source state components first');
    const block = penpot.history.undoBlockBegin();
    try {
      const root = board(null, `${STATE_BOARD_PATH} / ${STATE_BOARD_NAME}`, 4700, 850, 1100, 920, '#f7f3ec', 24);
      root.clipContent = false;
      text(root, 'Board eyebrow', 'OV-45 · ASTRO SOURCE STATES', 34, 28, 600, 20, 12, 900, 1.4, '#91401d', 'left', 0.8);
      text(root, 'Board title', 'Event detail · overlap, top medallion, occurrence family', 34, 58, 970, 46, 30, 900, 1.1, '#241c17');
      text(root, 'Top-medallion label', 'event.real.5757 · top medallion', 34, 122, 500, 22, 13, 800, 1.4, '#75665b');
      const topInstance = top.instance();
      topInstance.name = 'linked Event detail / Summary / event.real.5757 / top-medallion';
      root.appendChild(topInstance);
      place(topInstance, 34, 171, 783.1875, 417.546875);
      text(root, 'Occurrence label', 'event.real.5511 · multiple occurrences', 34, 636, 500, 22, 13, 800, 1.4, '#75665b');
      const summaryInstance = summary.instance();
      summaryInstance.name = 'linked Event occurrence / desktop summary / event.real.5511';
      root.appendChild(summaryInstance);
      place(summaryInstance, 34, 680, 250.4375, 56.890625);
      const practicalInstance = practical.instance();
      practicalInstance.name = 'linked Event occurrence / practical matrix / event.real.5511';
      root.appendChild(practicalInstance);
      place(practicalInstance, 334, 666, 471.640625, 128.6875);
      const component = penpot.library.local.createComponent([root]);
      return { existing: false, id: component.id, main: component.mainInstance().id, linked: [top.id, summary.id, practical.id] };
    } finally {
      penpot.history.undoBlockFinish(block);
    }
  }

  async function readback() {
    assertContext();
    const owner = penpot.currentPage.getShapeById(DESKTOP_OWNER_ID);
    const summarizeComponent = (path, name) => {
      const component = componentByIdentity(path, name);
      return component ? { id: component.id, main: component.mainInstance().id, path, name } : { path, name, missing: true };
    };
    return {
      owner: {
        id: owner?.id,
        name: owner?.name,
        width: owner?.width,
        height: owner?.height,
        direct: [...(owner?.children || [])].map((shape) => ({ id: shape.id, name: shape.name, x: shape.x, y: shape.y, width: shape.width, height: shape.height, componentId: shape.component?.()?.id ?? null })),
      },
      states: [
        summarizeComponent(TOP_PATH, TOP_NAME),
        summarizeComponent(OCCURRENCE_PATH, OCCURRENCE_SUMMARY_NAME),
        summarizeComponent(OCCURRENCE_PATH, OCCURRENCE_PRACTICAL_NAME),
        summarizeComponent(STATE_BOARD_PATH, STATE_BOARD_NAME),
      ],
      validation: await penpot.currentFile.validate(),
    };
  }

  storage.ov45EventDetail = {
    apply5459HeroGeometry,
    apply5459SummaryTextRecord,
    apply5459SummaryNonTextGeometry,
    apply5459GalleryGeometry,
    apply5459OwnerGeometry,
    ensure5757TopMedallionSummary,
    ensure5511OccurrenceSummary,
    ensure5511OccurrencePractical,
    ensureStateBoard,
    readback,
    constants: { FILE_ID, PAGE_ID, DESKTOP_OWNER_ID, TOP_PATH, OCCURRENCE_PATH, STATE_BOARD_PATH, TOP_NAME, OCCURRENCE_SUMMARY_NAME, OCCURRENCE_PRACTICAL_NAME, STATE_BOARD_NAME, SUMMARY_TEXT },
  };
  return { installed: true, methods: Object.keys(storage.ov45EventDetail) };
}

if (typeof module !== 'undefined') module.exports = {
  installOv45EventDetailMaterializer,
  constants: { FILE_ID, PAGE_ID, DESKTOP_OWNER_ID, TOP_PATH, OCCURRENCE_PATH, STATE_BOARD_PATH, TOP_NAME, OCCURRENCE_SUMMARY_NAME, OCCURRENCE_PRACTICAL_NAME, STATE_BOARD_NAME, SUMMARY_TEXT },
};
