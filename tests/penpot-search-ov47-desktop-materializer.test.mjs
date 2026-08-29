import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const require = createRequire(import.meta.url);
const mod = require('../scripts/round-trip-reconstruction/penpot-materialize-search-ov47-desktop.js');
const source = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-search-ov47-desktop.js', import.meta.url), 'utf8');

test('OV-47 desktop materializer pins exact Search shell and EventCard ancestry', () => {
  assert.equal(mod.constants.PAGE_ID, 'd87e18f1-dcb4-80a6-8008-880ac732b6ae');
  assert.equal(mod.constants.DESKTOP_HEADER_COMPONENT_ID, 'a21f5e36-5d76-8065-8008-86ae4bdf9963');
  assert.equal(mod.constants.DESKTOP_COLLECTION_COMPONENT_ID, 'd87e18f1-dcb4-80a6-8008-885bfcec31ea');
  assert.equal(mod.constants.DESKTOP_FOOTER_COMPONENT_ID, 'd87e18f1-dcb4-80a6-8008-885914f2be1b');
  assert.equal(mod.constants.DESKTOP_EVENT_CARD_COMPONENT_ID, 'cab027cf-d52b-8091-8008-85f7db75ebe3');
});

test('OV-47 desktop materializer encodes measured Astro geometry as native states', () => {
  assert.match(source, /2685\.140625/);
  assert.match(source, /2323\.265625/);
  assert.match(source, /1033\.1875/);
  assert.match(source, /1623\.25/);
  assert.match(source, /1417\.015625/);
  assert.match(source, /3361\.890625/);
  assert.match(source, /3000\.015625/);
  assert.match(source, /component\.instance\(\)/);
  assert.doesNotMatch(source, /\.detach\s*\(/);
  assert.doesNotMatch(source, /screenshot[-_ ]fill/i);
});
