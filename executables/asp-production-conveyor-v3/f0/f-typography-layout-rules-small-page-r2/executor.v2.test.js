'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const {
  SPEC,
  runLayoutRulesSmallPageAtlasR2Native,
} = require('./executor.v2.js');
const { allNodes, createNativeLikePenpot } = require('./native_like_penpot_double.v2.js');

const FONTS = Object.freeze({
  regular: new Uint8Array(readFileSync('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')),
  bold: new Uint8Array(readFileSync('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')),
});

test('package-local layout projection is the exact remaining 27-specimen source split', () => {
  assert.equal(SPEC.packageId, 'F-TYPOGRAPHY-LAYOUT-RULES-SMALL-PAGE');
  assert.equal(SPEC.specimens.length, 27);
  assert.equal(new Set(SPEC.specimens.map((value) => value.id)).size, 27);
  assert.equal(SPEC.specimens[0].id, 'container/1180px');
  assert.equal(SPEC.specimens.at(-1).id, 'media/max-244');
  assert.deepEqual(SPEC.families.map((value) => value.id), [
    'foundation.layout-containers',
    'foundation.layout-breakpoints',
    'foundation.layout-sticky-stack',
    'foundation.layout-layering',
    'foundation.layout-safe-area',
    'foundation.layout-media-sizing',
  ]);
  assert.equal(SPEC.atlasHead, '663be702d481972cb2e8863af500f1c35dda1d8c');
});

test('actual native-like first run and second replay are idempotent', async () => {
  const penpot = createNativeLikePenpot();
  const first = await runLayoutRulesSmallPageAtlasR2Native({ penpot, fontBytes: FONTS });
  const second = await runLayoutRulesSmallPageAtlasR2Native({ penpot, fontBytes: FONTS });
  assert.ok(first.created > 0);
  assert.equal(second.created, 0);
  assert.equal(second.counts.linkedSpecimens, 27);
  assert.equal(second.counts.detached, 0);
  assert.equal(second.counts.screenshots, 0);
  assert.equal(second.counts.duplicates, 0);
  assert.equal(second.counts.emptyWells, 0);
  assert.equal(second.counts.editableCyrillic, 27);
  assert.equal(second.protectedProjections.unchanged, true);
});

test('WIDE row/root formulas resolve exactly for fourteen native Grid rows', async () => {
  const penpot = createNativeLikePenpot();
  const result = await runLayoutRulesSmallPageAtlasR2Native({ penpot, fontBytes: FONTS });
  assert.equal(result.layout.rootWidth, 2176);
  assert.equal(result.layout.rows, 14);
  assert.equal(result.layout.contentHeight, 4896);
  assert.equal(result.layout.rootHeight, 5216);
  assert.equal(result.layout.cellHeightFormula,
    'clamp(specimen_height + label_block_height + 64, 320, 720)');
  const page = penpot.currentFile.pages.find((value) => value.name === SPEC.pageName);
  const root = page.root.children[0];
  const header = root.children.find((value) => value.isComponentCopyInstance());
  const content = root.children.find((value) => value.getSharedPluginData(SPEC.namespace, 'stable-id') === 'slot/content');
  const grid = content.children.find((value) => value.getSharedPluginData(SPEC.namespace, 'stable-id') === 'slot/review-grid');
  assert.equal(header.component().name, 'ATLAS_PAGE_HEADER_V2');
  assert.equal(root.flex.dir, 'column');
  assert.equal(content.flex.dir, 'row');
  assert.equal(grid.grid.rows.length, 14);
  assert.equal(grid.children.length, 27);
});

test('real layout specimens retain visible source geometry and editable Cyrillic labels', async () => {
  const penpot = createNativeLikePenpot();
  await runLayoutRulesSmallPageAtlasR2Native({ penpot, fontBytes: FONTS });
  const page = penpot.currentFile.pages.find((value) => value.name === SPEC.pageName);
  const nodes = allNodes(page.root);
  const linked = nodes.filter((value) => value.isComponentCopyInstance()
    && value.getSharedPluginData(SPEC.namespace, 'placement-id'));
  assert.equal(linked.length, 27);
  const media = linked.find((value) => value.getSharedPluginData(SPEC.namespace, 'placement-id') === 'media/max-244');
  const safe = linked.find((value) => value.getSharedPluginData(SPEC.namespace, 'placement-id') === 'safe-area/bottom');
  const mediaBar = allNodes(media).find((value) => value.getSharedPluginData(SPEC.namespace, 'stable-id') === 'role/bar');
  const safeBar = allNodes(safe).find((value) => value.getSharedPluginData(SPEC.namespace, 'stable-id') === 'role/bar');
  assert.deepEqual([mediaBar.width, mediaBar.height, mediaBar.fills[0].fillColor], [416, 66, '#DB2777']);
  assert.deepEqual([safeBar.width, safeBar.height, safeBar.fills[0].fillColor], [416, 28, '#F59E0B']);
  const texts = linked.flatMap((value) => allNodes(value)).filter((value) => value.type === 'text');
  assert.ok(texts.some((value) => value.characters.includes('Мобильный нижний стек')));
  assert.ok(texts.every((value) => value.fontFamily === 'DejaVu Sans'));
});

test('strict shared-plugin-data, protected, screenshot and EventCard boundaries stay closed', async () => {
  const penpot = createNativeLikePenpot();
  assert.throws(
    () => penpot.createBoard().setSharedPluginData('strict-double', 'bad', { bytes: 1 }),
    /STRICT_STRING_ONLY/,
  );
  const result = await runLayoutRulesSmallPageAtlasR2Native({ penpot, fontBytes: FONTS });
  assert.equal(result.protectedProjections.unchanged, true);
  assert.equal(result.counts.screenshots, 0);
  assert.equal(result.counts.detached, 0);
  assert.equal(result.doesNotRepairEventcardText, true);
  assert.equal(result.penpotAuthorization, false);
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
    typeof context.KenigeventsLayoutRulesSmallPageAtlasR2Native.runLayoutRulesSmallPageAtlasR2Native,
    'function',
  );
});
