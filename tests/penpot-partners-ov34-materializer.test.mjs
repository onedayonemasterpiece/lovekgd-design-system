import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const require = createRequire(import.meta.url);
const modulePath = '../scripts/round-trip-reconstruction/penpot-materialize-partners-ov34.js';
const materializer = require(modulePath);
const source = await readFile(new URL(modulePath, import.meta.url), 'utf8');

test('OV-34 materializer targets the factual information page owners and current Astro commit', () => {
  assert.equal(materializer.constants.PAGE_ID, 'd87e18f1-dcb4-80a6-8008-880fb747d10c');
  assert.equal(materializer.constants.ASTRO_COMMIT, '49c351873d40a2ea55f0a32837c7376e344d9c17');
  assert.match(materializer.constants.MEDIA.kgd80, /assets\/partners\/kgd80\.svg$/);
  assert.equal(Object.keys(materializer.constants.MEDIA).length, 6);
});

test('OV-34 materializer preserves linked shell ancestry and native editable partner content', () => {
  assert.match(source, /component\.instance\(\)/);
  assert.match(source, /desktopBody\.instance\(\)/);
  assert.match(source, /mobileBody\.instance\(\)/);
  assert.match(source, /penpot\.createText/);
  assert.match(source, /penpot\.createRectangle/);
  assert.match(source, /penpot\.uploadMediaUrl/);
  assert.doesNotMatch(source, /\.detach\s*\(/);
  assert.doesNotMatch(source, /source-exact raster|page screenshot/i);
});
