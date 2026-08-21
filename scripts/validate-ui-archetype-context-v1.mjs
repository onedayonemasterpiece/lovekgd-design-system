#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const defaultRepo = resolve(scriptDir, '..');
const sha = (value) => createHash('sha256').update(value).digest('hex');
const stable = (value) => value === null || typeof value !== 'object'
  ? JSON.stringify(value)
  : Array.isArray(value)
    ? `[${value.map(stable).join(',')}]`
    : `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
export const canonicalSha = (value) => sha(`${stable(value)}\n`);
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const close = (a, b, epsilon = 1e-8) => Math.abs(a - b) <= epsilon;

export function validateResolution(row) {
  const errors = [];
  const push = (condition, message) => { if (!condition) errors.push(message); };
  const expectedOrder = ['surface-archetype','viewport-container','grid-columns','packing-placement','row-sibling-equalization','used-card-geometry','media-available-box','framing-rule'];
  push(row.surface?.parent_component === 'OptimizedEventCardGrid', 'parent archetype must be OptimizedEventCardGrid');
  push(row.surface?.layout_authority === 'astro-reference', 'layout authority must remain Astro');
  push(row.surface?.placement_claim === 'controlled-layout-only', 'fixture placement must not claim production selection');
  push(row.container?.border_box_width_px === Math.min(1180, row.viewport.width_px - 32), 'page-shell width formula mismatch');
  const gap = Math.min(Math.max(13.6, row.viewport.width_px * 0.016), 20);
  push(close(row.grid?.column_gap_px, gap) && close(row.grid?.row_gap_px, gap), 'clamped grid gap mismatch');
  const cardWidth = (row.container.content_width_px - 2 * gap) / 3;
  push(close(row.used_card_geometry?.width_px, cardWidth), 'used card width mismatch');
  push(close(row.media_available_box?.available_width_px, cardWidth), 'media available width must equal used card width');
  push(close(row.media_available_box?.available_height_px, cardWidth / row.packing.placement.row_ratio), 'media height must be card width / row ratio');
  push(close(row.media_available_box?.frame_aspect_ratio, row.packing.placement.row_ratio), 'media frame ratio must equal packed row ratio');
  push(JSON.stringify(row.packing?.ordered_input_fixture_ids) === JSON.stringify(['event.real.7906','event.real.8156','event.real.4327','event.real.6628']), 'controlled input order mismatch');
  push(JSON.stringify(row.packing?.ordered_output_fixture_ids) === JSON.stringify(['event.real.7906','event.real.8156','event.real.6628','event.real.4327']), 'packed output order mismatch');
  push(row.packing?.placement?.fixture_id && row.row_policy?.peer_fixture_ids?.includes(row.packing.placement.fixture_id), 'placement fixture must be a row peer');
  push(row.row_policy?.equal_height_policy === 'equal-height-within-row' && row.row_policy?.tallest_sibling_determines_used_height === true, 'row sibling equalization missing');
  push(row.used_card_geometry?.height_px === null, 'card height must remain unmeasured before runtime capture');
  for (const rect of [row.used_card_geometry?.measured_rect, row.media_available_box?.measured_rect]) {
    push(rect?.status === 'runtime-measurement-required', 'DOMRect must be explicitly pending');
    push(rect?.width_px === null && rect?.height_px === null && rect?.capture_ref === null, 'pending DOMRect must not fabricate measurements');
  }
  push(JSON.stringify(row.derivation?.resolution_order) === JSON.stringify(expectedOrder), 'resolution order mismatch');
  push(row.candidate_deltas?.length === 1, 'one explicit framing candidate delta is required');
  for (const delta of row.candidate_deltas || []) {
    push(delta.authority_scope === 'penpot-candidate-only', 'candidate authority must be Penpot-only');
    push(delta.region === 'media' && delta.property === 'framing-rule', 'candidate delta escaped media framing boundary');
    push(delta.does_not_change_reference_authority === true, 'candidate delta changed reference authority');
    push(delta.promotion_effect === 'none-before-owner-browser-approval', 'candidate delta promoted without approval');
  }
  return errors;
}

export function validateBundle(repo = defaultRepo) {
  const base = join(repo, 'catalog/ui-components/event-card-large/archetype-context-v1');
  const registry = readJson(join(base, 'registry.v1.json'));
  const consumer = readJson(join(base, 'consumer-layout-contract.v1.json'));
  const component = readJson(join(repo, 'catalog/ui-components/event-card-large/component-contract.v2.json'));
  const resolverEvidence = readJson(join(base, 'resolver-evidence.v1.json'));
  const materializationIr = readJson(join(base, 'penpot-materialization-ir.v2.json'));
  const errors = [];
  const verifySelfHash = (row, key, label) => {
    const copy = structuredClone(row); const expected = copy[key]; delete copy[key];
    if (canonicalSha(copy) !== expected) errors.push(`${label} self hash mismatch`);
  };
  verifySelfHash(consumer, 'contract_sha256', 'consumer layout contract');
  verifySelfHash(component, 'contract_sha256', 'component contract v2');
  if (canonicalSha(resolverEvidence.resolver_output) !== resolverEvidence.resolver_output_sha256) errors.push('resolver evidence hash mismatch');
  if (materializationIr.contract_sha256 !== component.contract_sha256) errors.push('materialization IR/component contract hash mismatch');
  if (component.penpot.baseline_revision !== 1256 || component.penpot.governed_active_variant_count !== 11 || component.penpot.live_container_member_count !== 13) errors.push('live Penpot revision/member governance evidence drift');
  if (component.penpot.live_member_anomalies.length !== 2) errors.push('two live Penpot anomalies must remain explicit until quarantine reconciliation');
  if (materializationIr.lifecycle !== 'candidate-unexecuted' || materializationIr.execution_gate.exact_live_readback_required !== true) errors.push('materialization IR must remain gated and unexecuted');
  if (materializationIr.operations.some((op) => op.target.binding_mode === 'discovery-ref' && op.target.target_id !== null)) errors.push('materialization IR guessed a new Penpot id');
  if (consumer.contexts[0].used_card_width_px !== 380) errors.push('consumer contract preserved isolated 474px specimen as archetype truth');
  if (!consumer.known_context_gaps.some((gap) => gap.gap_id === 'mobile-flow-ratio-callsite-discrepancy')) errors.push('mobile 4:5 versus 5:4 source discrepancy missing');
  if (!component.known_materialization_gaps.some((gap) => gap.gap_id === 'consumer-layout-context-not-materialized')) errors.push('Penpot consumer materialization gap missing');
  if (!component.known_materialization_gaps.some((gap) => gap.gap_id === 'mobile-flow-ratio-callsite-discrepancy')) errors.push('component mobile ratio gap missing');
  const seen = [];
  for (const entry of registry.cases) {
    const caseRow = readJson(join(base, entry.case_path));
    const resolved = readJson(join(base, entry.resolved_case_path));
    seen.push(caseRow.fixture_id);
    errors.push(...validateResolution(caseRow.consumer_layout_resolution).map((e) => `${caseRow.case_id}: ${e}`));
    const resolverRow = resolverEvidence.resolver_output.output.find((row) => row.fixture_id === caseRow.fixture_id);
    if (!resolverRow) errors.push(`${caseRow.case_id}: exact resolver evidence missing`);
    else {
      const placement = caseRow.consumer_layout_resolution.packing.placement;
      for (const [caseKey, evidenceKey] of [['row_index','rowIndex'],['column_index','rowColumn'],['row_ratio','rowRatio'],['media_ratio','mediaRatio'],['row_mode','rowMode']]) {
        if (placement[caseKey] !== resolverRow.layout[evidenceKey]) errors.push(`${caseRow.case_id}: ${caseKey} differs from executed resolver`);
      }
      if (caseRow.consumer_layout_resolution.framing_rule.crop_fraction !== resolverRow.layout.coverCrop) errors.push(`${caseRow.case_id}: crop differs from executed resolver`);
      if (caseRow.consumer_layout_resolution.framing_rule.crop_reason !== resolverRow.layout.cropReason) errors.push(`${caseRow.case_id}: crop reason differs from executed resolver`);
    }
    if (canonicalSha(caseRow.consumer_layout_resolution) !== caseRow.consumer_layout_resolution_sha256) errors.push(`${caseRow.case_id}: layout hash mismatch`);
    const resolvedCopy = structuredClone(resolved); delete resolvedCopy.resolved_render_case_sha256;
    if (canonicalSha(resolvedCopy) !== resolved.resolved_render_case_sha256) errors.push(`${caseRow.case_id}: resolved case hash mismatch`);
    if (caseRow.resolved_render_case_sha256 !== resolved.resolved_render_case_sha256) errors.push(`${caseRow.case_id}: case/resolved hash link mismatch`);
    if (resolved.container_geometry.used_card_width !== 380) errors.push(`${caseRow.case_id}: used width is not 380`);
    if (resolved.resolved_media.frame_geometry.outer_width !== 380) errors.push(`${caseRow.case_id}: media width is not 380`);
    if (caseRow.container_width !== 1180) errors.push(`${caseRow.case_id}: consumer container is not page-shell 1180`);
    if (caseRow.penpot_binding.binding_status !== 'pending-materialization' || caseRow.penpot_binding.export_sha256 !== null) errors.push(`${caseRow.case_id}: fabricated Penpot consumer binding`);
    if (caseRow.astro_binding.binding_status !== 'source-resolved-pending-capture' || caseRow.astro_binding.specimen_route !== null) errors.push(`${caseRow.case_id}: fabricated Astro consumer capture`);
    if (JSON.stringify(caseRow.expected_candidate_deltas) !== JSON.stringify(resolved.expected_candidate_deltas)) errors.push(`${caseRow.case_id}: candidate delta provenance drift`);
    if (caseRow.fixture_id !== 'event.real.7906' && resolved.resolved_content.labels.calendar !== null) errors.push(`${caseRow.case_id}: expired/noneligible calendar must be absent`);
    if (caseRow.fixture_id !== 'event.real.7906' && resolved.resolved_visibility.calendar !== false) errors.push(`${caseRow.case_id}: absent calendar visibility must be false`);
  }
  if (JSON.stringify(seen) !== JSON.stringify(['event.real.7906','event.real.8156','event.real.6628','event.real.4327'])) errors.push('registry fixture order drift');
  assert.deepEqual(errors, [], errors.join('\n'));
  return { cases: registry.cases.length, status: registry.comparison_status };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = validateBundle(process.argv[2] ? resolve(process.argv[2]) : defaultRepo);
  console.log(`ui-archetype-context-v1: PASS (${result.cases} v2 cases; ${result.status})`);
}
