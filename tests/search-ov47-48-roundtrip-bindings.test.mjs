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

test('OV-47/48 round-trip registers the complete visible mobile lifecycle and desktop entered-query owners',()=>{
  assert.deepEqual(archetype.source_exact_state_owners.map(s=>[s.viewport,s.state,s.height]),[
    ['mobile','loading',2626],['mobile','results',2521],['desktop','loading',4044],['desktop','results',3682],
    ['mobile','validation',1612],['mobile','empty',1991],['mobile','error-retry',1652],
    ['mobile','load-more-ready',2404],['mobile','load-more-loading',2432],
    ['mobile','recovery-after-error',2544],
  ]);
  assert.ok(archetype.source_exact_state_owners.every(s=>s.penpot.direct_children.length===4));
  assert.deepEqual(archetype.source_exact_state_owners[0].skeleton_shape_ids.length,3);
  assert.equal(archetype.source_exact_state_owners[1].result_card.fixture,'event.real.7003');
  assert.deepEqual(archetype.source_exact_state_owners[2].skeleton_shape_ids.length,3);
  assert.equal(archetype.source_exact_state_owners[3].result_card.fixture,'event.real.7003');
  assert.ok(archetype.source_exact_state_owners.slice(4).every(s=>s.viewport==='mobile'));
  assert.ok(archetype.source_exact_state_owners.slice(4).every(s=>s.penpot.direct_children.length===4));
  assert.equal(archetype.source_exact_correction.sha256,hash(archetype.source_exact_correction.path));
});

test('Search canonical Product Atlas boards use factual entered-query results, never the stale idle-anonymous baseline',()=>{
  assert.deepEqual(archetype.boards.map(board=>[board.viewport,board.penpot.board_id]),[
    ['desktop','8f804431-c282-8075-8008-8e292b4c6b49'],
    ['mobile','8f804431-c282-8075-8008-8de4b555573e'],
  ]);
  assert.ok(archetype.boards.every(board=>board.astro.commit==='812ffc279728221b547707474bcb521f27c4a73d'));
  assert.ok(archetype.boards.every(board=>board.penpot.revision===2813));
  assert.ok(archetype.boards.every(board=>/state=results/.test(board.penpot.board_name)));
  assert.ok(archetype.boards.every(board=>!JSON.stringify(board).includes('idle-anonymous')));
  const cases=bindings.cases.filter(board=>board.archetype_id==='archetype.search');
  assert.deepEqual(cases,archetype.boards);
});

test('OV-47/48 status closes the visible lifecycle and records stale as a non-visual guard',()=>{
  assert.deepEqual(contract.coverage.mobile_integrated_states,[
    'loading','results','validation','empty','error-retry','load-more-ready','load-more-loading','recovery-after-error',
  ]);
  assert.deepEqual(contract.coverage.desktop_integrated_states,['loading','results']);
  assert.deepEqual(contract.coverage.open_required_states,[]);
  assert.match(contract.coverage.nonvisual_source_dispositions['mobile-stale'],/does not repaint/i);
  assert.equal(contract.status,'MOBILE_VISIBLE_LIFECYCLE_AND_DESKTOP_LOADING_RESULTS_MATERIALIZED_STALE_NONVISUAL');
  assert.equal(receipt.visual_qa.result,'MOBILE_LOADING_RESULTS_PASS_LIFECYCLE_STRUCTURAL_VERIFIED_DESKTOP_STRUCTURAL_VERIFIED');
  assert.equal(receipt.visual_qa.owner_acceptance,'NOT_CLAIMED');
});
