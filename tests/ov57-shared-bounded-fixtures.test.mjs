import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
const contract=JSON.parse(readFileSync('catalog/reconstruction-atlas/v1/design-system-reference-fixtures-ov57.v1.json','utf8'));
const fixtures=JSON.parse(readFileSync('catalog/reconstruction-atlas/v1/fixtures.v1.json','utf8'));
test('OV-57 defines one bounded fixture profile shared by Astro and Penpot',()=>{assert.equal(contract.policy.same_fixture_profile_in_astro_and_penpot,true);assert.equal(contract.policy.production_catalog_is_not_penpot_fixture_pool,true);assert.equal(contract.policy.dense_full_listing_validation,'Astro only');assert.equal(contract.profile.id,'design-system-reference-v1');assert.deepEqual(contract.profile.events.fixture_ids,fixtures.golden_event_corpus.fixture_ids)});
test('OV-57 festival profile proves 1/4/2 row mechanics with seven factual slugs',()=>{assert.deepEqual(contract.profile.festivals.rows.map(x=>x.slugs.length),[1,4,2]);const slugs=contract.profile.festivals.rows.flatMap(x=>x.slugs);assert.equal(slugs.length,7);assert.equal(new Set(slugs).size,7);assert.equal(contract.profile.festivals.production_count,21);assert.equal(contract.profile.festivals.representative_count,7)});
test('OV-57 preserves the already bounded club catalogue and exact-seven artifact exception',()=>{assert.deepEqual(contract.profile.clubs.fixture_slugs,['game-vibes','neural-researchers','technology-researchers']);assert.equal(contract.profile.artifacts.fixture_count,7);assert.equal(contract.implementation.clubs_change_required,false)});
