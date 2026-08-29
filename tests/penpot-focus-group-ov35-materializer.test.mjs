import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const require = createRequire(import.meta.url);
const modulePath = '../scripts/round-trip-reconstruction/penpot-materialize-focus-group-ov35.js';
const materializer = require(modulePath);
const source = await readFile(new URL(modulePath, import.meta.url), 'utf8');

test('OV-35 materializer targets the exact Focus Group page and source media', () => {
  assert.equal(materializer.constants.PAGE_ID, 'd87e18f1-dcb4-80a6-8008-880f767c3eb3');
  assert.equal(materializer.constants.ASTRO_COMMIT, '49c351873d40a2ea55f0a32837c7376e344d9c17');
  assert.match(materializer.constants.MEDIA.brand, /announcements-brand-v2-192\.png$/);
  assert.match(materializer.constants.MEDIA.flask, /lab-flask-287837\.svg$/);
});

test('OV-35 materializer encodes native OTP cells and editable source copy', () => {
  assert.match(source, /for \(let index = 0; index < 6; index \+= 1\)/);
  assert.match(source, /После шестой цифры продолжим автоматически/);
  assert.match(source, /focus-agent-e2e@kenigevents\.ru/);
  assert.match(source, /penpot\.createText/);
  assert.match(source, /penpot\.createRectangle/);
  assert.match(source, /penpot\.uploadMediaUrl/);
  assert.doesNotMatch(source, /\.detach\s*\(/);
  assert.doesNotMatch(source, /page screenshot|raster projection/i);
});
