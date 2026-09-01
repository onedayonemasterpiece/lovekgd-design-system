'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const {
  SPEC,
  runTypeScaleSmallPageAtlasR2Native,
} = require('./executor.v2.js');
const { allNodes, createNativeLikePenpot } = require('./native_like_penpot_double.v2.js');

const FONTS = Object.freeze({
  regular: new Uint8Array(readFileSync('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')),
  bold: new Uint8Array(readFileSync('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')),
});

test('package-local type-scale projection is the exact 24-specimen source split', () => {
  assert.equal(SPEC.packageId, 'F-TYPOGRAPHY-TYPE-SCALE-SMALL-PAGE');
  assert.equal(SPEC.specimens.length, 24);
  assert.equal(new Set(SPEC.specimens.map((value) => value.id)).size, 24);
  assert.deepEqual(SPEC.specimens.slice(0, 3).map((value) => value.id), [
    'type/caption-12',
    'type/body-16',
    'type/meta-17',
  ]);
  assert.equal(SPEC.specimens.at(-1).id, 'wrap/actions');
  assert.equal(SPEC.families.length, 3);
  assert.equal(SPEC.atlasHardLimitComponentFamilies, 3);
  assert.deepEqual(new Set(SPEC.specimens.map((value) => value.componentId)), new Set([
    'foundation.typography-scale',
    'foundation.typography-line-height',
    'foundation.typography-font-binding',
  ]));
  assert.equal(
    SPEC.specimens.filter((value) => value.sourceComponentId === 'foundation.typography-cyrillic-wrap').length,
    6,
  );
  assert.equal(SPEC.atlasHead, '663be702d481972cb2e8863af500f1c35dda1d8c');
  assert.equal(SPEC.sourceBlob, '501c307799bf412bc658dc89a04245f8a5cabc61');
});

test('actual native-like first run and second replay are idempotent', async () => {
  const penpot = createNativeLikePenpot();
  const first = await runTypeScaleSmallPageAtlasR2Native({ penpot, fontBytes: FONTS });
  const second = await runTypeScaleSmallPageAtlasR2Native({ penpot, fontBytes: FONTS });
  assert.ok(first.created > 0);
  assert.equal(second.created, 0);
  assert.equal(second.counts.linkedSpecimens, 24);
  assert.equal(second.counts.nativeComponentMasters, 3);
  assert.equal(second.counts.detached, 0);
  assert.equal(second.counts.screenshots, 0);
  assert.equal(second.counts.duplicates, 0);
  assert.equal(second.counts.emptyWells, 0);
  assert.equal(second.counts.editableCyrillic, 24);
  assert.equal(second.protectedProjections.unchanged, true);
  assert.equal(first.protectedProjections.before, first.protectedProjections.after);
  assert.equal(second.protectedProjections.before, second.protectedProjections.after);
});

test('Atlas component-family hard limit fails closed before any page mutation', async () => {
  const penpot = createNativeLikePenpot();
  const originalPages = penpot.currentFile.pages.length;
  const overLimitSpec = {
    ...SPEC,
    families: [...SPEC.families, {
      id: 'foundation.typography-cyrillic-wrap',
      label: 'Forbidden fourth native family',
    }],
  };
  const runtime = require('./runtime.v2.js');
  await assert.rejects(
    runtime.runTypographyAtlasR2Native({ penpot, fontBytes: FONTS }, overLimitSpec),
    /ATLAS_COMPONENT_FAMILY_HARD_LIMIT_EXCEEDED/,
  );
  assert.equal(penpot.currentFile.pages.length, originalPages);
  assert.equal(
    penpot.currentFile.pages.some((page) => page.name === SPEC.pageName),
    false,
  );
});

test('WIDE formulas and linked Atlas header are native Flex/Grid, not empty wells', async () => {
  const penpot = createNativeLikePenpot();
  const result = await runTypeScaleSmallPageAtlasR2Native({ penpot, fontBytes: FONTS });
  assert.equal(result.layout.rootWidth, 2176);
  assert.equal(result.layout.rows, 12);
  assert.equal(result.layout.contentHeight, 4192);
  assert.equal(result.layout.rootHeight, 4512);
  assert.deepEqual(result.layout.layoutEngines, ['NATIVE_FLEX', 'NATIVE_GRID']);
  const page = penpot.currentFile.pages.find((value) => value.name === SPEC.pageName);
  const root = page.root.children[0];
  const header = root.children.find((value) => value.isComponentCopyInstance());
  const content = root.children.find((value) => value.getSharedPluginData(SPEC.namespace, 'stable-id') === 'slot/content');
  const grid = content.children.find((value) => value.getSharedPluginData(SPEC.namespace, 'stable-id') === 'slot/review-grid');
  assert.equal(header.component().name, 'ATLAS_PAGE_HEADER_V2');
  assert.equal(root.flex.dir, 'column');
  assert.equal(content.flex.dir, 'row');
  assert.equal(grid.grid.columns.length, 2);
  assert.equal(grid.children.length, 24);
  assert.ok(grid.children.every((cell) => cell.children.some((value) => value.type === 'text')));
  assert.ok(grid.children.every((cell) => cell.children.some((value) => value.isComponentCopyInstance())));
});

test('exact font bytes yield editable Cyrillic typography with source ratios', async () => {
  const penpot = createNativeLikePenpot();
  const result = await runTypeScaleSmallPageAtlasR2Native({ penpot, fontBytes: FONTS });
  assert.deepEqual(result.fonts.regular, {
    bytes: 759720,
    sha256: 'ae7b7855e115a5966d8b1b3f80f254ccc117ec86f9965e202ee2940453837280',
  });
  assert.deepEqual(result.fonts.bold, {
    bytes: 708920,
    sha256: '5c1247acef7f2b8522a31742c76d6adcb5569bacc0be7ceaa4dc39dd252ce895',
  });
  const page = penpot.currentFile.pages.find((value) => value.name === SPEC.pageName);
  const texts = allNodes(page.root).filter((value) => value.type === 'text' && /[А-Яа-яЁё]/.test(value.characters));
  assert.ok(texts.length >= 24);
  assert.ok(texts.every((value) => value.fontFamily === 'DejaVu Sans'));
  const lineHeight = SPEC.specimens.find((value) => value.id === 'line-height/title');
  const wrap = SPEC.specimens.find((value) => value.id === 'wrap/title');
  assert.equal(lineHeight.lineHeight, '1.08');
  assert.equal(wrap.frameWidth, 220);
});

test('strict shared-plugin-data rejects non-strings and EventCard text stays out of scope', async () => {
  const penpot = createNativeLikePenpot();
  assert.throws(
    () => penpot.createBoard().setSharedPluginData('strict-double', 'bad', 759720),
    /STRICT_STRING_ONLY/,
  );
  const result = await runTypeScaleSmallPageAtlasR2Native({ penpot, fontBytes: FONTS });
  assert.equal(result.doesNotRepairEventcardText, true);
  assert.equal(result.penpotAuthorization, false);
  assert.equal(result.publishStarted, false);
  assert.equal(result.status, 'PUBLISHABLE_AFTER_ATLAS_EVIDENCE_GATE');
});

test('package executor loads in a plugin-like browser global without CommonJS', () => {
  const context = { console };
  context.globalThis = context;
  vm.runInNewContext(
    readFileSync(__dirname + '/runtime.v2.js', 'utf8'),
    context,
  );
  vm.runInNewContext(
    readFileSync(__dirname + '/executor.v2.js', 'utf8'),
    context,
  );
  assert.equal(
    typeof context.KenigeventsTypeScaleSmallPageAtlasR2Native.runTypeScaleSmallPageAtlasR2Native,
    'function',
  );
});

test('self-contained SHA-256 matches the canonical abc vector without crypto or require', () => {
  const context = { Uint8Array };
  vm.createContext(context);
  vm.runInContext(
    readFileSync(__dirname + '/runtime.v2.js', 'utf8'),
    context,
  );
  assert.equal(context.crypto, undefined);
  assert.equal(context.require, undefined);
  assert.equal(
    context.KenigeventsTypographyAtlasR2NativeRuntime.sha256Portable(
      new Uint8Array([0x61, 0x62, 0x63]),
    ),
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  );
});

test('full native-like run and replay stay exact with global crypto unavailable', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  try {
    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: undefined });
    const penpot = createNativeLikePenpot();
    const first = await runTypeScaleSmallPageAtlasR2Native({ penpot, fontBytes: FONTS });
    const second = await runTypeScaleSmallPageAtlasR2Native({ penpot, fontBytes: FONTS });
    assert.ok(first.created > 0);
    assert.equal(second.created, 0);
    assert.deepEqual(second.fonts, {
      regular: { bytes: 759720, sha256: 'ae7b7855e115a5966d8b1b3f80f254ccc117ec86f9965e202ee2940453837280' },
      bold: { bytes: 708920, sha256: '5c1247acef7f2b8522a31742c76d6adcb5569bacc0be7ceaa4dc39dd252ce895' },
    });
    assert.equal(second.counts.duplicates, 0);
    assert.equal(second.counts.detached, 0);
    assert.equal(second.counts.screenshots, 0);
    assert.equal(second.protectedProjections.unchanged, true);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'crypto', descriptor);
    else delete globalThis.crypto;
  }
});
