/** Native, bounded Wave 1 floating action-island candidate for page 64.03. */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = '8e7accff-5c78-8007-8008-89c00a062ffc';
const DESKTOP_BASELINE = 'd87e18f1-dcb4-80a6-8008-88603c044ff2';
const MOBILE_SUMMARY_BASELINE = 'd87e18f1-dcb4-80a6-8008-88604132a614';
const CALENDAR_DESKTOP = 'c0d4e5a2-7db6-80c7-8008-81f1911414a5';
const SHARE_PROOF = 'a21f5e36-5d76-8065-8008-870c7b58f649';
const LIKE_PROOF = 'a21f5e36-5d76-8065-8008-86cd5c19e772';
const CALENDAR_MOBILE = '8e7accff-5c78-8007-8008-895a527a8faa';
const SHARE_MOBILE = '8e7accff-5c78-8007-8008-895a8640f57c';
const LIKE_MOBILE = '8e7accff-5c78-8007-8008-895a8728e1f4';
const PATH = 'Unified v1 / Wave 1 / Floating action island';

const componentById = (penpot, id) => penpot.library.local.components.find(component => component.id === id);
const componentByIdentity = (penpot, path, name) => penpot.library.local.components.find(component => component.path === path && component.name === name);
function place(penpotUtils, shape, x, y, width, height) {
  if (shape.layoutChild) shape.layoutChild.absolute = true;
  shape.resize(width, height);
  penpotUtils.setParentXY(shape, x, y);
  return shape;
}
function board(penpot, penpotUtils, name, x, y, width, height, fill = '#fffaf2') {
  const shape = penpot.createBoard();
  shape.name = name;
  shape.fills = [{ fillColor: fill, fillOpacity: 1 }];
  shape.strokes = [];
  shape.clipContent = true;
  return place(penpotUtils, shape, x, y, width, height);
}
function text(penpot, penpotUtils, parent, name, value, x, y, width, height, size, weight, color, align = 'left') {
  const shape = penpot.createText(value);
  shape.name = name;
  shape.fontFamily = 'Inter';
  shape.fontStyle = 'normal';
  shape.fontSize = String(size);
  shape.fontWeight = String(weight);
  shape.lineHeight = '1.2';
  shape.letterSpacing = '0';
  shape.align = align;
  shape.fills = [{ fillColor: color, fillOpacity: 1 }];
  parent.appendChild(shape);
  return place(penpotUtils, shape, x, y, width, height);
}
function overrideCount(root, count) {
  const stack = [root];
  while (stack.length) {
    const shape = stack.pop();
    if (shape.type === 'text' && /^\d+$/.test(String(shape.characters ?? '').trim())) {
      shape.characters = String(count);
      return shape;
    }
    if (shape.children) stack.push(...shape.children);
  }
  throw new Error(`missing semantic count in ${root.name}`);
}
function overrideNamedCount(root, nameFragment, count) {
  const stack = [root];
  while (stack.length) {
    const shape = stack.pop();
    if (shape.name.includes(nameFragment)) return overrideCount(shape, count);
    if (shape.children) stack.push(...shape.children);
  }
  throw new Error(`missing ${nameFragment} action in ${root.name}`);
}
function overrideDirectActionCount(root, nameFragment, count) {
  const action = Array.from(root.children ?? []).find(shape => shape.name.includes(nameFragment));
  if (!action) throw new Error(`missing direct ${nameFragment} action in ${root.name}`);
  return overrideCount(action, count);
}
function proofButton(penpot, penpotUtils, parent, component, name, count, x, y) {
  const surface = penpot.createBoard();
  surface.name = name;
  surface.fills = [{ fillColor: '#4a433d', fillOpacity: 1 }];
  surface.borderRadius = 12;
  surface.clipContent = true;
  parent.appendChild(surface);
  place(penpotUtils, surface, x, y, 80, 44);
  const proof = component.instance();
  proof.name = `linked ${name} / count inside semantic component`;
  surface.appendChild(proof);
  place(penpotUtils, proof, 22, 10, 36, 24);
  overrideCount(proof, count);
  return surface;
}

function materializeFloatingActionIsland(penpot, penpotUtils) {
  if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) throw new Error('open settled page 64.03 first');
  const ids = [DESKTOP_BASELINE, MOBILE_SUMMARY_BASELINE, CALENDAR_DESKTOP, SHARE_PROOF, LIKE_PROOF, CALENDAR_MOBILE, SHARE_MOBILE, LIKE_MOBILE];
  const components = ids.map(id => componentById(penpot, id));
  if (components.some(item => !item)) throw new Error('missing certified action dependency');

  const ctaName = 'Primary ticket CTA · candidate-v1';
  let cta = componentByIdentity(penpot, PATH, ctaName);
  let ctaMain;
  if (!cta) {
    ctaMain = board(penpot, penpotUtils, `${PATH} / ${ctaName}`, 940, 300, 360, 52, '#c64e1f');
    ctaMain.borderRadius = 14;
    text(penpot, penpotUtils, ctaMain, 'Ticket CTA / label', 'Купить билет', 0, 15, 360, 22, 15, 900, '#ffffff', 'center');
    cta = penpot.library.local.createComponent([ctaMain]);
  } else ctaMain = cta.mainInstance();

  const desktopName = 'Action island · viewport=desktop · candidate-v1';
  let desktop = componentByIdentity(penpot, PATH, desktopName);
  let desktopMain;
  if (!desktop) {
    desktopMain = board(penpot, penpotUtils, `${PATH} / ${desktopName}`, 470, 0, 404, 220, '#312a24');
    desktopMain.borderRadius = 22;
    desktopMain.strokes = [{ strokeColor: '#5b524a', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
    text(penpot, penpotUtils, desktopMain, 'Admission / eyebrow', 'ВХОД', 22, 18, 80, 14, 10, 800, '#c9bcb0');
    text(penpot, penpotUtils, desktopMain, 'Admission / value', '150–300 ₽', 22, 36, 250, 28, 18, 900, '#fffaf2');
    const ticket = cta.instance();
    ticket.name = 'linked Primary ticket CTA / candidate-v1';
    desktopMain.appendChild(ticket);
    place(penpotUtils, ticket, 22, 72, 360, 52);
    const calendar = components[2].instance();
    calendar.name = 'linked Action / Calendar';
    desktopMain.appendChild(calendar);
    place(penpotUtils, calendar, 22, 146, 138, 44);
    proofButton(penpot, penpotUtils, desktopMain, components[3], 'linked Social proof / Share · count=13', 13, 202, 146);
    proofButton(penpot, penpotUtils, desktopMain, components[4], 'linked Social proof / Like · count=164', 164, 302, 146);
    desktop = penpot.library.local.createComponent([desktopMain]);
  } else desktopMain = desktop.mainInstance();

  // The compact proof components belong to a light surface and become too
  // low-contrast inside the dark island. Reuse the already certified dark
  // action family for both responsive branches instead of restyling icons.
  for (const child of Array.from(desktopMain.children ?? []).filter(shape =>
    shape.name === 'linked Action / Calendar'
    || shape.name.startsWith('linked Social proof / Share')
    || shape.name.startsWith('linked Social proof / Like')
  )) child.remove();
  const desktopDarkActions = [
    [components[5], 'linked Action / Calendar / dark responsive', null, 42, 52],
    [components[6], 'linked Action / Share / dark responsive · count=13', 13, 102, 199.21875],
    [components[7], 'linked Action / Like / dark responsive · count=164', 164, 309.21875, 52]
  ];
  for (const [component, name, count, x, width] of desktopDarkActions) {
    let copy = Array.from(desktopMain.children ?? []).find(shape => shape.name === name);
    if (!copy) {
      copy = component.instance();
      copy.name = name;
      desktopMain.appendChild(copy);
    }
    place(penpotUtils, copy, x, 146, width, 52);
    if (count !== null) overrideCount(copy, count);
  }

  const mobileName = 'Action island · viewport=mobile · candidate-v1';
  let mobile = componentByIdentity(penpot, PATH, mobileName);
  let mobileMain;
  if (!mobile) {
    mobileMain = board(penpot, penpotUtils, `${PATH} / ${mobileName}`, 940, 0, 366, 196, '#312a24');
    mobileMain.borderRadius = 22;
    mobileMain.strokes = [{ strokeColor: '#5b524a', strokeOpacity: 1, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];
    text(penpot, penpotUtils, mobileMain, 'Admission / compact', 'Вход · 150–300 ₽', 14, 14, 250, 20, 13, 800, '#fffaf2');
    const ticket = cta.instance();
    ticket.name = 'linked Primary ticket CTA / candidate-v1';
    mobileMain.appendChild(ticket);
    place(penpotUtils, ticket, 14, 42, 338, 52);
    for (const [component, name, count, x, width] of [
      [components[5], 'linked Action / Calendar / mobile', null, 14, 52],
      [components[6], 'linked Action / Share / mobile · count=13', 13, 74, 199.21875],
      [components[7], 'linked Action / Like / mobile · count=164', 164, 281.21875, 52]
    ]) {
      const copy = component.instance();
      copy.name = name;
      mobileMain.appendChild(copy);
      place(penpotUtils, copy, x, 116, width, 52);
      if (count !== null) overrideCount(copy, count);
    }
    mobile = penpot.library.local.createComponent([mobileMain]);
  } else mobileMain = mobile.mainInstance();

  // Idempotent correction for already materialized candidate masters: fixture
  // counts remain content overrides inside the linked semantic action, never
  // free-floating text beside an icon.
  overrideDirectActionCount(desktopMain, 'Share', 13);
  overrideDirectActionCount(desktopMain, 'Like', 164);
  overrideDirectActionCount(mobileMain, 'Like', 164);
  // Apply Share last: this wrapper contains a nested action component whose
  // propagation can otherwise restore its source fixture count.
  overrideDirectActionCount(mobileMain, 'Share', 13);

  let desktopBaseline = Array.from(penpot.currentPage.root.children).find(shape => shape.name === 'Wave 1 / Floating action island / Desktop / baseline region');
  if (!desktopBaseline) {
    desktopBaseline = board(penpot, penpotUtils, 'Wave 1 / Floating action island / Desktop / baseline region', 0, 0, 440, 280);
    const copy = components[0].instance();
    copy.name = 'linked baseline Event detail / Action panel / desktop';
    desktopBaseline.appendChild(copy);
    place(penpotUtils, copy, 18, 24, 404, 232);
  }

  let mobileBaseline = Array.from(penpot.currentPage.root.children).find(shape => shape.name === 'Wave 1 / Floating action island / Mobile / baseline region');
  if (!mobileBaseline) {
    mobileBaseline = board(penpot, penpotUtils, 'Wave 1 / Floating action island / Mobile / baseline region', 470, 300, 390, 220);
    const copy = components[1].instance();
    copy.name = 'linked baseline Event detail / Summary / mobile action crop';
    mobileBaseline.appendChild(copy);
    place(penpotUtils, copy, 12, -142, 366, 420);
  }

  return {
    page_id: PAGE_ID,
    pattern_id: 'pattern.floating-action-island.candidate-v1',
    components: { ticket_cta: cta.id, desktop_candidate: desktop.id, mobile_candidate: mobile.id },
    boards: { desktop_baseline: desktopBaseline.id, desktop_candidate: desktopMain.id, mobile_baseline: mobileBaseline.id, mobile_candidate: mobileMain.id },
    linked_dependencies: ids,
    applicability: { 'archetype.event-detail': 'candidate', 'archetype.listing.date': 'not_applicable', 'archetype.search': 'not_applicable' },
    validate: penpot.currentFile.validate()
  };
}

if (typeof module !== 'undefined') module.exports = { materializeFloatingActionIsland };
