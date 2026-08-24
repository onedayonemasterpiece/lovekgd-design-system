import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { validateBundle, validateResolution } from '../scripts/validate-ui-archetype-context-v1.mjs';

const repo = resolve(import.meta.dirname, '..');
const base = join(repo, 'catalog/ui-components/event-card-large/archetype-context-v1');
const registry = JSON.parse(readFileSync(join(base, 'registry.v1.json'), 'utf8'));
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const schemaValidate = (instance, schema, shouldPass = true) => {
  const result = spawnSync('python3', ['-c', 'import json,jsonschema,sys;jsonschema.Draft202012Validator(json.load(open(sys.argv[2]))).validate(json.load(open(sys.argv[1])))', instance, schema], { encoding:'utf8' });
  assert.equal(result.status === 0, shouldPass, result.stderr || result.stdout);
};

const result = validateBundle(repo);
assert.deepEqual(result, {cases:4, status:'current-minor-awaiting-owner-review'});
schemaValidate(join(base, 'consumer-layout-contract.v1.json'), join(repo, 'contracts/ui-components/consumer-layout-contract.v1.schema.json'));
schemaValidate(join(repo, 'catalog/ui-components/event-card-large/component-contract.v2.json'), join(repo, 'contracts/ui-components/component-contract.v2.schema.json'));
schemaValidate(join(base, 'penpot-materialization-ir.v2.json'), join(repo, 'contracts/ui-components/penpot-materialization-ir.v2.schema.json'));
schemaValidate(join(base, registry.materialization_receipt_ref), join(repo, 'contracts/ui-components/penpot-materialization-receipt.v1.schema.json'));
for (const fixtureId of ['7906','8156','4327','6628']) {
  schemaValidate(join(repo, `receipts/ui-conformance/golden-event-corpus-v1-archetype-v2/telegram-readback-${fixtureId}.json`), join(repo, 'contracts/ui-conformance/telegram-readback-receipt.v1.schema.json'));
  schemaValidate(join(repo, `receipts/ui-conformance/golden-event-corpus-v1-archetype-v2/telegram-current-${fixtureId}.json`), join(repo, 'contracts/ui-conformance/telegram-readback-receipt.v1.schema.json'));
}
for (const entry of registry.cases) {
  schemaValidate(join(base, entry.case_path), join(repo, 'contracts/ui-conformance/ui-conformance-case.v2.schema.json'));
  schemaValidate(join(base, entry.resolved_case_path), join(repo, 'contracts/ui-conformance/resolved-render-case.v2.schema.json'));
}

const first = read(join(base, registry.cases[0].case_path)).consumer_layout_resolution;
const wrongWidth = structuredClone(first); wrongWidth.used_card_geometry.width_px = 474;
assert(validateResolution(wrongWidth).some((e) => e.includes('used card width')));
const wrongGap = structuredClone(first); wrongGap.grid.column_gap_px = 16;
assert(validateResolution(wrongGap).some((e) => e.includes('grid gap')));
const wrongOrder = structuredClone(first); wrongOrder.packing.ordered_output_fixture_ids.reverse();
assert(validateResolution(wrongOrder).some((e) => e.includes('packed output order')));
const fakeMeasure = structuredClone(first); fakeMeasure.used_card_geometry.measured_rect.width_px = 380;
assert(validateResolution(fakeMeasure).some((e) => e.includes('must not fabricate')));
const escapedCandidate = structuredClone(first); escapedCandidate.candidate_deltas[0].property = 'card-width';
assert(validateResolution(escapedCandidate).some((e) => e.includes('escaped media framing')));

// Schema also rejects authority-blending and fabricated pending measurements.
const temp = mkdtempSync(join(tmpdir(), 'archetype-context-'));
const badCase = read(join(base, registry.cases[0].case_path));
badCase.consumer_layout_resolution.candidate_deltas[0].authority_scope = 'astro-reference';
writeFileSync(join(temp, 'bad-authority.json'), JSON.stringify(badCase));
schemaValidate(join(temp, 'bad-authority.json'), join(repo, 'contracts/ui-conformance/ui-conformance-case.v2.schema.json'), false);
const fakeRect = read(join(base, registry.cases[0].case_path));
fakeRect.consumer_layout_resolution.media_available_box.measured_rect.width_px = 380;
writeFileSync(join(temp, 'fake-rect.json'), JSON.stringify(fakeRect));
schemaValidate(join(temp, 'fake-rect.json'), join(repo, 'contracts/ui-conformance/ui-conformance-case.v2.schema.json'), false);

// Immutable corpus v1 and historical 474px isolated pilot cases remain byte-identical to the lane base.
const corpusDiff = spawnSync('git', ['diff', '--exit-code', '0882917a1328607c498d82e4c2a652bbd3df946d', '--', 'catalog/fixtures/ui-reference-events/v1', 'receipts/ui-conformance/golden-event-corpus-v1-pilot'], {cwd:repo, encoding:'utf8'});
assert.equal(corpusDiff.status, 0, corpusDiff.stdout + corpusDiff.stderr);
const historic = read(join(repo, 'catalog/fixtures/ui-reference-events/v1/cases/event-card-large-landscape-crop-safe-7906-desktop.case.json'));
assert.equal(historic.schema_version, 'ui_conformance_case_v1');
assert.equal(historic.container_width, 474);

const consumer = read(join(base, 'consumer-layout-contract.v1.json'));
assert.equal(consumer.contexts[0].used_card_width_px, 380);
assert.deepEqual(consumer.contexts[0].ordered_input_fixture_ids, ['event.real.7906','event.real.8156','event.real.4327','event.real.6628']);
assert.deepEqual(consumer.contexts[0].ordered_output_fixture_ids, ['event.real.7906','event.real.8156','event.real.6628','event.real.4327']);
assert(consumer.known_context_gaps[0].source_facts.some((fact) => fact.includes('4 / 5')));
assert(consumer.known_context_gaps[0].source_facts.some((fact) => fact.includes('5 / 4')));
const component = read(join(repo, 'catalog/ui-components/event-card-large/component-contract.v2.json'));
assert.equal(component.penpot.baseline_revision, 1256);
assert.equal(component.penpot.governed_active_variant_count, 11);
assert.equal(component.penpot.live_container_member_count, 13);
assert.equal(component.penpot.live_member_anomalies.length, 2);
assert.equal(component.semantic_layout_contracts.meta_flow.display, 'flex-wrap');
assert.equal(component.semantic_layout_contracts.meta_flow.admission.layout, 'one-line-hug');
assert.equal(component.semantic_layout_contracts.penpot_geometry_reconciliation.fixture_specific_visual_patches, false);
const ir = read(join(base, 'penpot-materialization-ir.v2.json'));
assert.equal(ir.lifecycle, 'candidate-unexecuted');
assert(ir.operations.filter((op) => op.operation_type === 'discover-or-create-linked-instance').length >= 4);
assert(ir.operations.every((op) => op.target.binding_mode !== 'discovery-ref' || op.target.target_id === null));

console.log('ui-archetype-context-v1.test: PASS (positive bundle + authority, geometry, order, measurement and history negatives)');
