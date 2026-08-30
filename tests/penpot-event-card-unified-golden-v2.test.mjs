import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-event-card-unified-golden-v2.js', import.meta.url), 'utf8');

test('EventCard Large has one central Penpot page and four source-owned structural variants', () => {
  assert.match(source, /40\.1b — EventCard · Unified Golden variants/u);
  assert.match(source, /Event cards \/ Large \/ Unified Golden v2/u);
  for (const key of ['desktop-wide-calendar', 'desktop-packed-no-calendar', 'mobile-wide-calendar', 'mobile-packed-no-calendar']) {
    assert.match(source, new RegExp(`'${key}'`, 'u'));
  }
  assert.match(source, /component-family','event-card-large'/u);
  assert.match(source, /fixture-corpus',CORPUS_ID/u);
});

test('central variants retain a linked canonical base and exact Astro card geometry', () => {
  assert.match(source, /const card=base\.instance\(\)/u);
  assert.match(source, /baseComponentId:card\.component\(\)\?\.id/u);
  assert.match(source, /place\(media,1,1,v\.width-2,v\.media\)/u);
  assert.match(source, /place\(feedback,1\.59375,v\.height-56,v\.width-3\.1875,56\)/u);
  assert.match(source, /desktop\?145\.125:142\.25/u);
  assert.match(source, /desktop\?147\.4375:185\.875/u);
  assert.doesNotMatch(source, /\.detach\(/u);
});

test('Golden fixture values are data overrides, not page-local visual reconstruction', () => {
  for (const id of [8006, 8200, 2182, 6711, 7609]) assert.match(source, new RegExp(String(id), 'u'));
  assert.match(source, /applyFixture\(card,id\)/u);
  assert.match(source, /lineage\.some\(n=>\/Share\//u);
  assert.match(source, /storage\.freeSepV2Media/u);
});
