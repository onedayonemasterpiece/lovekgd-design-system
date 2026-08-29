import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const require=createRequire(import.meta.url);
const mod=require('../scripts/round-trip-reconstruction/penpot-materialize-search-ov47-mobile-lifecycle.js');
const source=await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-search-ov47-mobile-lifecycle.js',import.meta.url),'utf8');

test('OV-47 mobile lifecycle pins measured terminal and pagination geometry',()=>{
  assert.equal(mod.constants.PAGE_ID,'d87e18f1-dcb4-80a6-8008-880ac732b6ae');
  assert.equal(mod.constants.STATES.validation.queryH,470.890625);
  assert.equal(mod.constants.STATES.empty.queryH,849.359375);
  assert.equal(mod.constants.STATES.error.queryH,510.4375);
  assert.equal(mod.constants.STATES.loadReady.queryH,1262.359375);
  assert.equal(mod.constants.STATES.loadLoading.queryH,1291.09375);
});

test('OV-47 lifecycle is authenticated, native and keeps stale as a non-visual guard',()=>{
  assert.match(source,/Account chip \/ authenticated \/ source exact/);
  assert.match(source,/Введите хотя бы 3 символа/);
  assert.match(source,/По вашему запросу ничего не/);
  assert.match(source,/Попробуйте ещё раз чуть позже/);
  assert.match(source,/Показать ещё/);
  assert.match(source,/Загружаю ещё…/);
  assert.match(source,/\.instance\(\)/);
  assert.doesNotMatch(source,/\.detach\s*\(/);
  assert.doesNotMatch(source,/screenshot[-_ ]fill/i);
  assert.doesNotMatch(source,/state=stale/);
});
