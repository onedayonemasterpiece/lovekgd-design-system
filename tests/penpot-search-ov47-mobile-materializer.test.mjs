import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const require = createRequire(import.meta.url);
const mod = require('../scripts/round-trip-reconstruction/penpot-materialize-search-ov47-mobile.js');
const source = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-search-ov47-mobile.js', import.meta.url), 'utf8');

test('OV-47 materializer targets Search and source shell identities', () => {
  assert.equal(mod.constants.PAGE_ID, 'd87e18f1-dcb4-80a6-8008-880ac732b6ae');
  assert.equal(mod.constants.MOBILE_HEADER_COMPONENT_ID, 'a21f5e36-5d76-8065-8008-86aebfc67027');
  assert.equal(mod.constants.MOBILE_SEARCH_BOTTOM_NAV_COMPONENT_ID, '8e7accff-5c78-8007-8008-89c2fd86089e');
  assert.equal(mod.constants.MOBILE_EVENT_CARD_COMPONENT_ID, '7f078c80-87b8-80f5-8008-85839e8975f6');
});

test('OV-47 materializer encodes measured loading/results geometry and native ancestry', () => {
  assert.match(source, /1504\.734375/);
  assert.match(source, /1400\.234375/);
  assert.match(source, /513\.296875, 366, 418\.125/);
  assert.match(source, /541\.71875, 366, 656\.71875/);
  assert.match(source, /progress \/ 55 percent/);
  assert.match(source, /арт-вечеринка с музыкой/);
  assert.match(source, /component\.instance\(\)/);
  assert.doesNotMatch(source, /\.detach\s*\(/);
  assert.doesNotMatch(source, /screenshot[-_ ]fill/i);
});

test('OV-47 authenticated Search evidence uses the account chip, not the login CTA', () => {
  assert.match(source, /Account chip \/ authenticated \/ source exact/);
  assert.match(source, /search-evidence@ex…/);
  assert.doesNotMatch(source, /const login = board\(root, 'Yandex login \/ source exact'/);
  assert.doesNotMatch(source, /text\(login, 'Yandex login label', 'Войти через Яндекс'/);
});
