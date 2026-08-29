import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const require = createRequire(import.meta.url);
const mod = require('../scripts/round-trip-reconstruction/penpot-materialize-event-detail-ov55-56.js');
const source = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-event-detail-ov55-56.js', import.meta.url), 'utf8');

test('OV-55/56 materializer targets factual Event Detail source identities', () => {
  assert.equal(mod.constants.PAGE_ID, 'd87e18f1-dcb4-80a6-8008-880bfdfbf2ec');
  assert.equal(mod.constants.DESKTOP_HEADER_COMPONENT_ID, 'a21f5e36-5d76-8065-8008-86ae4bdf9963');
  assert.equal(mod.constants.MUZTEATR_ARTWORK_COMPONENT_ID, '45777396-2f2a-80c0-8008-819182948b91');
  assert.equal(mod.constants.KAUP_ARTWORK_COMPONENT_ID, '45777396-2f2a-80c0-8008-81916e721fe4');
  assert.equal(mod.constants.RELATED_DESKTOP_COMPONENT_ID, 'd87e18f1-dcb4-80a6-8008-8860d9a764a5');
  assert.equal(mod.constants.FOOTER_VIEWPORT_COMPONENT_ID, 'd87e18f1-dcb4-80a6-8008-885914f2be1b');
});

test('OV-55/56 materializer uses original media, linked ancestry and source order', () => {
  assert.match(source, /event\.real\.4783/);
  assert.match(source, /event\.real\.4671/);
  assert.match(source, /Hero image/);
  assert.match(source, /uploadMediaUrl/);
  assert.match(source, /linked Event detail \/ Transport/);
  assert.match(source, /linked Event detail \/ Related viewport/);
  assert.match(source, /linked Shell \/ Desktop footer viewport/);
  assert.doesNotMatch(source, /\.detach\s*\(/);
  assert.doesNotMatch(source, /screenshot[-_ ]fill/i);
  assert.doesNotMatch(source, /HeroTalk/);
});
