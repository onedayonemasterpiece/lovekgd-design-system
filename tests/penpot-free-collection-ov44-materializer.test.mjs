import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const require = createRequire(import.meta.url);
const modulePath = '../scripts/round-trip-reconstruction/penpot-materialize-free-collection-ov44.js';
const materializer = require(modulePath);
const source = await readFile(new URL(modulePath, import.meta.url), 'utf8');

test('OV-44 materializer targets the exact Collections owner page and source fixtures', () => {
  assert.equal(materializer.constants.PAGE_ID, 'd87e18f1-dcb4-80a6-8008-880c4a36d153');
  assert.deepEqual(Object.keys(materializer.EVENTS).map(Number), [6901, 6996, 6997, 7006, 7030]);
  assert.equal(materializer.constants.SCENARIO_ID, 'free-collection-5-desktop-v1');
  assert.deepEqual(materializer.constants.SCENARIO_EVENTS, [7006, 6996, 6997, 7030, 6901]);
  assert.equal(materializer.EVENTS[7030].title, 'Праздник непослушания');
  assert.equal(materializer.EVENTS[6996].image, null);
  assert.equal(materializer.EVENTS[6997].type, 'спектакль');
  assert.equal(materializer.EVENTS[7006].price, 'Бесплатно · регистрация');
  assert.equal(
    materializer.constants.MEDALLION_SOURCE_URL,
    'https://raw.githubusercontent.com/onedayonemasterpiece/events-bot-new/49c351873d40a2ea55f0a32837c7376e344d9c17/site/public/assets/badges/free-listing-medallion.svg',
  );
  assert.ok(Object.values(materializer.EVENTS).every(({ template }) => (
    template.desktop === 'b0fe69fd-ccaf-8025-8008-846f0b7f12cd'
    && template.mobile === '7f078c80-87b8-80f5-8008-85839e8975f6'
  )));
});

test('OV-44 materializer preserves linked native component ancestry', () => {
  assert.match(source, /template\.instance\(\)/);
  assert.match(source, /component\.instance\(\)/);
  assert.match(source, /penpot\.library\.local\.createComponent/);
  assert.match(source, /penpot\.uploadMediaUrl/);
  assert.match(source, /Content \\\/ Event occurrence\|schedule/);
  assert.match(source, /ensureStickyIdentity/);
  assert.match(source, /Compact identity \/ exact Astro source SVG/);
  assert.match(source, /reconcileDesktopScenarioSlot/);
  assert.match(source, /readbackDesktopScenario/);
  assert.match(source, /Content \/ media fallback \/ event\.real\.6996/);
  assert.doesNotMatch(source, /, (?:750|850),/);
  assert.doesNotMatch(source, /\.detach\s*\(/);
});

test('OV-44 owner boards remain source viewport proofs while dense stress stays in Astro', () => {
  assert.match(source, /owner\.resize\(viewport === 'desktop' \? 1280 : 390, 1200\)/);
  assert.match(source, /Production 23 \+ 14 listing stress\n \* remains Astro-owned/);
  assert.match(source, /5 событий/);
  assert.match(source, /\[49, 837\.421875\]/);
  assert.match(source, /scroll=hero-passed/);
});
