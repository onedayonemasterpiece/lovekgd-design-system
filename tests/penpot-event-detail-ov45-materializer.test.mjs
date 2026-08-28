import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const require = createRequire(import.meta.url);
const materializer = require('../scripts/round-trip-reconstruction/penpot-materialize-event-detail-ov45.js');
const source = await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-event-detail-ov45.js', import.meta.url), 'utf8');

test('OV-45 materializer targets exact Page 63.07 owners and source states', () => {
  assert.equal(materializer.constants.PAGE_ID, 'd87e18f1-dcb4-80a6-8008-880bfdfbf2ec');
  assert.equal(materializer.constants.DESKTOP_OWNER_ID, 'd87e18f1-dcb4-80a6-8008-880bfe361a1d');
  assert.match(materializer.constants.TOP_NAME, /event\.real\.5757/);
  assert.match(materializer.constants.OCCURRENCE_SUMMARY_NAME, /event\.real\.5511/);
  assert.equal(Object.keys(materializer.constants.SUMMARY_TEXT).length, 7);
  assert.deepEqual(
    [materializer.constants.SUMMARY_TEXT['Event title'].x, materializer.constants.SUMMARY_TEXT['Event title'].y],
    [38.390625, 82.078125],
  );
});

test('OV-45 materializer keeps linked ancestry and bounded resumable methods', () => {
  assert.match(source, /artwork\.instance\(\)/);
  assert.match(source, /top\.instance\(\)/);
  assert.match(source, /summary\.instance\(\)/);
  assert.match(source, /practical\.instance\(\)/);
  assert.match(source, /apply5459SummaryTextRecord/);
  assert.match(source, /Math\.max\(0, (?:spec\.)?letterSpacing\)/);
  assert.match(source, /currentFile\.saveVersion|readback/);
  assert.doesNotMatch(source, /\.detach\s*\(/);
  assert.doesNotMatch(source, /screenshot[-_ ](?:fill|proxy)/i);
});

test('OV-45 owner geometry encodes the exact Astro overlap rather than stacked blocks', () => {
  assert.match(source, /place\(hero, 0, 57, 1280, 843\)/);
  assert.match(source, /place\(summary, 38\.390625, 660, 783\.1875, 449\.46875\)/);
  assert.match(source, /place\(action, 860, 503, 404, 228\.28125\)/);
  assert.match(source, /place\(gallery, 860, 756\.078125, 404, 387\.65625\)/);
  assert.match(source, /label\.characters = '\+3\\nфото'/);
});
