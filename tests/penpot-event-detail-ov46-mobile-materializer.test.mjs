import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
const require=createRequire(import.meta.url); const mod=require('../scripts/round-trip-reconstruction/penpot-materialize-event-detail-ov46-mobile.js');
const source=await readFile(new URL('../scripts/round-trip-reconstruction/penpot-materialize-event-detail-ov46-mobile.js',import.meta.url),'utf8');
test('OV-46 materializer targets the existing native mobile owner',()=>{assert.equal(mod.constants.OWNER_ID,'d87e18f1-dcb4-80a6-8008-880c01b4fbef'); assert.equal(mod.constants.HERO_COMPONENT_ID,'d87e18f1-dcb4-80a6-8008-885fed185a8c'); assert.equal(mod.constants.SUMMARY_COMPONENT_ID,'d87e18f1-dcb4-80a6-8008-88604132a614');});
test('OV-46 materializer encodes exact mobile geometry and linked ancestry',()=>{assert.match(source,/place\(summary,12,529\.890625,366,422\.59375\)/);assert.match(source,/place\(identity,12,973\.390625,366,1940\.21875\)/);assert.match(source,/component\(\)\.id/);assert.match(source,/root\.appendChild\(primary\)/);assert.doesNotMatch(source,/\.detach\s*\(/);assert.doesNotMatch(source,/screenshot[-_ ]fill/i);});
