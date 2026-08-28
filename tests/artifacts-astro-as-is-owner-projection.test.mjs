import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const contract = JSON.parse(await readFile(new URL(
  '../catalog/reconstruction-atlas/v1/artifacts-astro-as-is-owner-projection.v1.json',
  import.meta.url,
), 'utf8'));

test('OV-06 projection keeps the owner target and current Astro AS-IS distinct', () => {
  assert.equal(contract.review_item, 'OV-06');
  assert.equal(contract.authority_disposition.owner_required_target.artifact_count, 7);
  assert.equal(contract.authority_disposition.current_astro_as_is.implemented_artifact_count, 1);
  assert.equal(contract.authority_disposition.current_astro_as_is.collection_slot_count, 5);
  assert.equal(contract.authority_disposition.current_astro_as_is.focus_egg_count, 12);
  assert.match(contract.authority_disposition.fail_closed_rule, /must not relabel/u);
  assert.equal(contract.acceptance.processed, false);
});

test('OV-06 projection requires thirteen linked native source states', () => {
  assert.equal(contract.source_faithful_state_groups.length, 3);
  const ids = contract.source_faithful_state_groups.flatMap(({ component_ids }) => component_ids);
  assert.equal(ids.length, 13);
  assert.equal(new Set(ids).size, 13);
  assert.equal(contract.acceptance.linked_instance_count, 13);
  assert.equal(contract.acceptance.detached_instance_count, 0);
});
