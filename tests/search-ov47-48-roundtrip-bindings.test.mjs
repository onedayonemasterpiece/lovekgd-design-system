import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const bindings=read('catalog/round-trip-reconstruction/v1/bindings.v1.json');
const contract=read('catalog/reconstruction-atlas/v1/search-ov47-mobile-source-exact.v1.json');
const receipt=read('evidence/recovery-20260828/penpot/search-ov47-mobile-source-exact-receipt.v1.json');
const archetype=bindings.archetypes.find(a=>a.archetype_id==='archetype.search');

test('OV-47/48 round-trip registers two complete mobile entered-query owners',()=>{
  assert.deepEqual(archetype.source_exact_state_owners.map(s=>[s.state,s.height]),[['loading',2626],['results',2521]]);
  assert.ok(archetype.source_exact_state_owners.every(s=>s.penpot.direct_children.length===4));
  assert.deepEqual(archetype.source_exact_state_owners[0].skeleton_shape_ids.length,3);
  assert.equal(archetype.source_exact_state_owners[1].result_card.fixture,'event.real.7003');
  assert.equal(archetype.source_exact_correction.sha256,hash(archetype.source_exact_correction.path));
});

test('OV-47/48 status no longer overclaims missing desktop and lifecycle states',()=>{
  assert.deepEqual(contract.coverage.mobile_integrated_states,['loading','results']);
  assert.deepEqual(contract.coverage.desktop_integrated_states,[]);
  assert.ok(contract.coverage.open_required_states.includes('desktop-results'));
  assert.equal(contract.status,'MOBILE_LOADING_RESULTS_CORRECTION_VERIFIED_DESKTOP_INTEGRATED_STATES_OPEN');
  assert.equal(receipt.visual_qa.result,'MOBILE_PASS_DESKTOP_OPEN');
  assert.equal(receipt.visual_qa.owner_acceptance,'NOT_CLAIMED');
});
