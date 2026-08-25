/**
 * Semantic active-state repair for the reusable mobile bottom navigation.
 *
 * The legacy master exposed only `active=dates`, which made linked Search,
 * Favorites, Home, and other archetypes render a visually wrong Date state.
 * `installMobileNavStateSlots` runs once on the component-main page and adds
 * hidden, named active-pill slots to the reusable master.  The owner-page
 * function then changes only visibility and label emphasis in the linked copy.
 *
 * Penpot 2.17.x may keep a component-copy mutation call open while persistence
 * drains.  Invoke `applyMobileNavOwnerState` only on an already-open page,
 * return immediately, wait outside the MCP call, and read back before retry.
 */
const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const MASTER_PAGE_ID = 'a21f5e36-5d76-8065-8008-86ac7b368ff6';
const MASTER_ID = 'a21f5e36-5d76-8065-8008-86aebffe176b';

const OWNER_STATES = [
  ['d87e18f1-dcb4-80a6-8008-8806c5b98101', 'd87e18f1-dcb4-80a6-8008-8806f1f90263', 'afisha'],
  ['d87e18f1-dcb4-80a6-8008-8807f67e8a2e', 'd87e18f1-dcb4-80a6-8008-8807f91d5293', 'dates'],
  ['d87e18f1-dcb4-80a6-8008-88089c3e75c9', 'd87e18f1-dcb4-80a6-8008-8808db012d23', 'dates'],
  ['d87e18f1-dcb4-80a6-8008-880937f54501', 'd87e18f1-dcb4-80a6-8008-8809ea570ea8', 'afisha'],
  ['d87e18f1-dcb4-80a6-8008-880a6c07b2b2', 'd87e18f1-dcb4-80a6-8008-880a6f9d215e', 'afisha'],
  ['d87e18f1-dcb4-80a6-8008-880ac732b6ae', 'd87e18f1-dcb4-80a6-8008-880acb90d104', 'search'],
  ['d87e18f1-dcb4-80a6-8008-880bfdfbf2ec', 'd87e18f1-dcb4-80a6-8008-880c01b4fbef', null],
  ['d87e18f1-dcb4-80a6-8008-880c4a36d153', 'd87e18f1-dcb4-80a6-8008-880c4cb4c4e6', 'search'],
  ['d87e18f1-dcb4-80a6-8008-880cc5490f78', 'd87e18f1-dcb4-80a6-8008-880cc78ce882', null],
  ['d87e18f1-dcb4-80a6-8008-880cfe1ec779', 'd87e18f1-dcb4-80a6-8008-880cff1a1193', 'afisha'],
  ['d87e18f1-dcb4-80a6-8008-880d209a7fcd', 'd87e18f1-dcb4-80a6-8008-880d230a2b8b', 'personal'],
  ['d87e18f1-dcb4-80a6-8008-880d8bcc2d0b', 'd87e18f1-dcb4-80a6-8008-880d8db35320', 'personal'],
  ['d87e18f1-dcb4-80a6-8008-880f9a822a76', 'd87e18f1-dcb4-80a6-8008-880f9c4c81c4', 'afisha'],
  ['d87e18f1-dcb4-80a6-8008-880fb747d10c', 'd87e18f1-dcb4-80a6-8008-880fb8952b02', 'afisha']
];

const ACTIVE_PILL = 'Mobile bottom active icon pill / active=';

function installMobileNavStateSlots(penpot, penpotUtils) {
  if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== MASTER_PAGE_ID) {
    throw new Error('open the exact mobile-nav component page before installing state slots');
  }
  const main = penpot.currentPage.getShapeById(MASTER_ID);
  if (!main?.isComponentMainInstance()) throw new Error(`missing mobile-nav main: ${MASTER_ID}`);
  const dateTab = main.children.find(shape => shape.type === 'board' && shape.children.some(child => child.type === 'text' && child.characters === 'Даты'));
  const datePill = dateTab?.children.find(shape => /active icon pill/.test(shape.name));
  if (!datePill) throw new Error('missing source Date active pill');
  datePill.name = `${ACTIVE_PILL}dates`;

  const slots = [['afisha', 29.75], ['search', 224.75], ['personal', 322.25]];
  const created = [];
  for (const [state, x] of slots) {
    const name = `${ACTIVE_PILL}${state}`;
    if (main.children.some(shape => shape.name === name)) continue;
    const pill = penpot.createRectangle();
    pill.name = name;
    pill.resize(38, 28);
    pill.borderRadius = 10;
    pill.fills = [{ fillColor: '#221a14', fillOpacity: 0.08 }];
    pill.hidden = true;
    main.insertChild(1, pill);
    penpotUtils.setParentXY(pill, x, 13);
    created.push(pill.id);
  }
  return { schema_version: 'round-trip-reconstruction.mobile-nav-slots.v1', created };
}

function applyMobileNavOwnerState(penpot, boardId, state) {
  const board = penpot.currentPage?.getShapeById(boardId);
  if (!board) throw new Error(`owner board is not on the open page: ${boardId}`);
  const registered = OWNER_STATES.some(([, expectedBoard, expectedState]) => expectedBoard === boardId && expectedState === state);
  if (!registered) throw new Error(`unregistered owner nav state: ${boardId}/${state}`);
  const nav = board.children.find(shape => shape.name === 'linked Shell / Mobile bottom navigation');
  if (!nav) throw new Error(`missing linked mobile nav: ${boardId}`);
  const changes = [];
  if (state === null) {
    if (!nav.hidden) { nav.hidden = true; changes.push([nav.id, 'hidden', true]); }
    return { changed: changes.length, changes };
  }

  if (nav.hidden) { nav.hidden = false; changes.push([nav.id, 'hidden', false]); }
  const stack = [nav];
  const labels = { 'Афиша': 'afisha', 'Даты': 'dates', 'Поиск': 'search', 'Для меня': 'personal' };
  while (stack.length) {
    const shape = stack.pop();
    if (shape.name.startsWith(ACTIVE_PILL)) {
      const visible = shape.name === `${ACTIVE_PILL}${state}`;
      if (shape.hidden === visible) { shape.hidden = !visible; changes.push([shape.id, 'hidden', shape.hidden]); }
    }
    if (shape.type === 'text' && labels[shape.characters]) {
      const active = labels[shape.characters] === state;
      const color = active ? '#221a14' : '#766b62';
      const weight = active ? '900' : '700';
      if (shape.fills?.[0]?.fillColor !== color) { shape.fills = [{ fillColor: color, fillOpacity: 1 }]; changes.push([shape.id, 'fill', color]); }
      if (shape.fontWeight !== weight) { shape.fontWeight = weight; changes.push([shape.id, 'fontWeight', weight]); }
    }
    if (shape.children) stack.push(...shape.children);
  }

  // The legacy source icons were all baked with the active dark fill.  State
  // therefore also owns the vector color, not only the label and pill.
  for (const tab of nav.children.filter(shape => shape.type === 'board')) {
    const label = tab.children.find(shape => shape.type === 'text' && labels[shape.characters]);
    if (!label) continue;
    const active = labels[label.characters] === state;
    const color = active ? '#261d18' : '#766b62';
    const iconStack = [...tab.children];
    while (iconStack.length) {
      const shape = iconStack.pop();
      if (shape.type === 'path' && shape.fills?.length) {
        shape.fills = shape.fills.map(fill => ({ ...fill, fillColor: color, fillOpacity: fill.fillOpacity ?? 1 }));
        changes.push([shape.id, 'iconFill', color]);
      }
      if (shape.children) iconStack.push(...shape.children);
    }
  }
  return { changed: changes.length, changes };
}

if (typeof module !== 'undefined') module.exports = { OWNER_STATES, installMobileNavStateSlots, applyMobileNavOwnerState };
