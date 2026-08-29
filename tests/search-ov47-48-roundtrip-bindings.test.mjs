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

test('OV-47/48 round-trip registers four complete mobile and desktop entered-query owners',()=>{
  assert.deepEqual(archetype.source_exact_state_owners.map(s=>[s.viewport,s.state,s.height]),[
    ['mobile','loading',2626],['mobile','results',2521],['desktop','loading',4044],['desktop','results',3682],
  ]);
  assert.ok(archetype.source_exact_state_owners.every(s=>s.penpot.direct_children.length===4));
  assert.deepEqual(archetype.source_exact_state_owners[0].skeleton_shape_ids.length,3);
  assert.equal(archetype.source_exact_state_owners[1].result_card.fixture,'event.real.7003');
  assert.deepEqual(archetype.source_exact_state_owners[2].skeleton_shape_ids.length,3);
  assert.equal(archetype.source_exact_state_owners[3].result_card.fixture,'event.real.7003');
  assert.equal(archetype.source_exact_correction.sha256,hash(archetype.source_exact_correction.path));
});

test('OV-47/48 status closes desktop loading/results but not remaining lifecycle states',()=>{
  assert.deepEqual(contract.coverage.mobile_integrated_states,['loading','results']);
  assert.deepEqual(contract.coverage.desktop_integrated_states,['loading','results']);
  assert.ok(!contract.coverage.open_required_states.includes('desktop-results'));
  assert.ok(contract.coverage.open_required_states.includes('mobile-error-retry'));
  assert.equal(contract.status,'MOBILE_DESKTOP_LOADING_RESULTS_MATERIALIZED_LIFECYCLE_STATES_OPEN');
  assert.equal(receipt.visual_qa.result,'MOBILE_PASS_DESKTOP_STRUCTURAL_VERIFIED_LIFECYCLE_OPEN');
  assert.equal(receipt.visual_qa.owner_acceptance,'NOT_CLAIMED');
});
