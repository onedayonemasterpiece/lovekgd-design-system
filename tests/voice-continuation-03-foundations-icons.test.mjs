import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const readJson = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const icons = readJson('../catalog/normalization/iconography/svgrepo-candidate-intake-v1.json');
const tokens = readJson('../catalog/reconstruction-atlas/v1/cross-cutting-token-contract.v1.json');

test('SVGRepo acquisition remains candidate-only and license fail-closed', () => {
  assert.equal(icons.owner_item, 'OV-53');
  assert.equal(icons.discovery_source.service, 'svgrepo.org');
  assert.deepEqual(icons.lifecycle, ['discovered', 'candidate', 'accepted', 'rejected', 'superseded']);
  assert.ok(icons.required_fields.includes('license'));
  assert.ok(icons.required_fields.includes('svg_sha256'));
  assert.match(icons.invariants.join('\n'), /does not promote/u);
  assert.deepEqual(Object.keys(icons.style_classes), [
    'outline_thin',
    'outline_regular',
    'bold_solid',
    'illustrative_drawn',
    'duotone',
    'brand_specific',
  ]);
  assert.equal(icons.processed, false);
  assert.equal(icons.penpot_projection.style_cards, 6);
  assert.equal(icons.penpot_projection.candidate_count, 0);
  assert.equal(icons.penpot_projection.token_bound_shapes, 24);
});

test('cross-cutting token audit records the real zero-binding gap', () => {
  assert.equal(tokens.owner_item, 'OV-54');
  assert.equal(tokens.penpot_audit_before_materialization.shapes, 25504);
  assert.equal(tokens.penpot_audit_before_materialization.active_token_set.tokens, 40);
  assert.equal(tokens.penpot_audit_before_materialization.token_bound_shapes, 0);
  assert.ok(tokens.required_groups.includes('typography roles'));
  assert.ok(tokens.required_groups.includes('spacing scale and semantic spacing roles'));
  assert.match(tokens.change_propagation_rule, /semantic tokens/u);
  assert.equal(tokens.processed, false);
  assert.equal(tokens.penpot_projection.token_set.tokens, 96);
  assert.equal(tokens.penpot_projection.page_token_bound_shapes, 70);
  assert.equal(tokens.penpot_projection.bound_property_counts.column_gap, 10);
  assert.equal(tokens.penpot_projection.component_migration_pilots[0].bindings.length, 4);
  assert.match(tokens.penpot_projection.status, /GLOBAL_MIGRATION_IN_PROGRESS/u);
});
