import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const contract = JSON.parse(readFileSync('catalog/reconstruction-atlas/v1/cross-cutting-token-contract.v1.json', 'utf8'));
const census = JSON.parse(readFileSync('evidence/recovery-20260829/penpot/ov54-canonical-owner-root-token-census.v1.json', 'utf8'));

test('OV-54 canonical owner-root census has an exact 34-board denominator and no missing roots', () => {
  assert.equal(census.denominator, '34 board IDs from catalog/round-trip-reconstruction/v1/bindings.v1.json');
  assert.equal(census.coverage.canonical_owner_roots, 34);
  assert.equal(census.coverage.found, 34);
  assert.equal(census.coverage.uniform_nonzero_radius_roots, 24);
  assert.equal(census.coverage.zero_radius_roots, 10);
  assert.deepEqual(census.validation, []);
});

test('OV-54 reports current progress rather than calling partial owner-root coverage complete', () => {
  assert.equal(census.coverage.bound_uniform_nonzero_radius_roots, 12);
  assert.equal(census.coverage.unbound_uniform_nonzero_radius_roots, 12);
  assert.equal(contract.penpot_projection.canonical_owner_root_census.receipt,
    'evidence/recovery-20260829/penpot/ov54-canonical-owner-root-token-census.v1.json');
  assert.equal(contract.penpot_projection.canonical_owner_root_census.bound, 12);
  assert.equal(contract.penpot_projection.canonical_owner_root_census.remaining, 12);
  assert.match(contract.status, /IN_PROGRESS/u);
  assert.equal(contract.processed, false);
});
