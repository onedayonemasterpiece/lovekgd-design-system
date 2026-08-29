import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const require = createRequire(import.meta.url);
const mod = require('../scripts/round-trip-reconstruction/penpot-materialize-favorites-ov38-39.js');
const source = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-favorites-ov38-39.js', import.meta.url), 'utf8');

test('OV-38/39 materializer targets Favorites owners and exact source events', () => {
  assert.equal(mod.constants.PAGE_ID, 'd87e18f1-dcb4-80a6-8008-880d209a7fcd');
  assert.equal(mod.constants.DESKTOP_OWNER_ID, 'd87e18f1-dcb4-80a6-8008-880d2c628515');
  assert.equal(mod.constants.MOBILE_OWNER_ID, 'd87e18f1-dcb4-80a6-8008-880d3512f2f7');
  assert.deepEqual(Object.keys(mod.constants.CARD_DESKTOP), ['6947', '7006', '7030']);
  assert.deepEqual(Object.keys(mod.constants.CARD_MOBILE), ['6947', '7006', '7030']);
});

test('OV-38/39 materializer preserves linked EventCard ancestry and three-plus-one geometry', () => {
  assert.match(source, /fixtures=7030,7006,6947/);
  assert.match(source, /source=\$\{source\}/);
  assert.match(source, /calendar/);
  assert.match(source, /like/);
  assert.match(source, /1280, 2288/);
  assert.match(source, /390, 2742/);
  assert.match(source, /component\.instance\(\)/);
  assert.doesNotMatch(source, /\.detach\s*\(/);
  assert.doesNotMatch(source, /screenshot[-_ ]fill/i);
});
