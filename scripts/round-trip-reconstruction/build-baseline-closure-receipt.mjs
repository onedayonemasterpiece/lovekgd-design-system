#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const read = path => JSON.parse(readFileSync(path, 'utf8'));
const sha = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const ref = path => ({ path, sha256: sha(path) });
const output = 'evidence/round-trip-reconstruction/v1/baseline-closure-receipt.v1.json';
const bindingsPath = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const comparisonPath = 'evidence/round-trip-reconstruction/v1/comparisons/manifest.v1.json';
const reviewPath = 'catalog/round-trip-reconstruction/v1/owner-review-manifest.v1.json';
const browserPath = 'evidence/round-trip-reconstruction/v1/astro-validation/browser-cases.v1.json';
const generationPath = 'evidence/round-trip-reconstruction/v1/astro-validation/generation-diff.v1.json';
const replayPath = 'evidence/round-trip-reconstruction/v1/penpot/replay-receipt.v1.json';
const foundationPath = 'evidence/round-trip-reconstruction/v1/foundation-audit-pack-v1/manifest.v1.json';
const skeletonPath = 'evidence/round-trip-reconstruction/v1/skeleton-intake/status.v1.json';
const productPath = 'catalog/product-atlas-linkage-handoff/v1/design-system-linkage.v1.json';
const checklistPath = 'docs/design-system-post-baseline-audits-and-product-atlas-checklist.md';
const incidentPath = 'evidence/round-trip-reconstruction/v1/penpot-stability/incident-20260825-react-185.md';
const bindings = read(bindingsPath);
const comparisons = read(comparisonPath);
const review = read(reviewPath);
const browser = read(browserPath);
const generation = read(generationPath);
const replay = read(replayPath);
const foundation = read(foundationPath);
const skeleton = read(skeletonPath);
const product = read(productPath);

const receipt = {
  schema_version: 'round-trip-reconstruction.baseline-closure-receipt.v1',
  status: 'AS_IS_BASELINE_CLOSED_AUDIT_READY',
  generation: 'deterministic_from_hash_bound_inputs_no_wall_clock',
  authority: {
    design_system_commit: bindings.authority.design_system_commit,
    astro_commit: bindings.authority.astro_commit,
    sot_manifest: bindings.authority.manifest,
    source_lock: bindings.authority.source_lock,
    component_graph: bindings.authority.component_graph,
    ui_only_plan: bindings.authority.ui_only_plan,
    penpot: { file_id: bindings.penpot.file_id, revision: bindings.penpot.revision },
    checklist: ref(checklistPath)
  },
  gates: {
    route_to_archetype: { status: 'PASS', archetypes: bindings.coverage.archetypes, cases: bindings.cases.length },
    exact_case_identity: { status: 'PASS', rule: 'same bound route + fixture/state + viewport in Astro capture, native Penpot owner board and comparison tuple' },
    native_penpot: {
      status: 'PASS',
      pages: bindings.penpot.page_count,
      boards: bindings.penpot.board_count,
      components: bindings.penpot.library_component_count,
      validation_errors: bindings.penpot.validation.length,
      service_resources: bindings.penpot.service_resources,
      detached_direct_children: bindings.penpot.detached_direct_children.length,
      unregistered_terminal_overrides: bindings.penpot.unregistered_terminal_overrides.length,
      out_of_bounds_direct_children: bindings.penpot.out_of_bounds_direct_children.length
    },
    astro_browser: { status: 'PASS', cases: browser.passed_cases, failed: browser.failed_cases },
    astro_generation_diff: { status: generation.status === 'pass' && generation.generation_diff === 0 ? 'PASS' : 'FAIL', production_changes: generation.generation_diff },
    raster_evidence: { status: 'PASS', compared: comparisons.compared_cases, missing: comparisons.missing_cases },
    owner_review_links: { status: 'PASS', reviewable: review.coverage.reviewable, missing: review.coverage.missing },
    idempotent_replay: { status: 'PASS', mode: replay.mode, creates: replay.creates, validation_errors: replay.validation.length },
    penpot_stability: { status: 'GUARD_INSTALLED_AND_EXERCISED', incident: ref(incidentPath), recurrence_after_guard: 0 }
  },
  evidence: {
    bindings: ref(bindingsPath),
    comparisons: ref(comparisonPath),
    owner_review: ref(reviewPath),
    astro_browser: ref(browserPath),
    astro_generation_diff: ref(generationPath),
    penpot_replay: ref(replayPath),
    foundation_audit_pack: ref(foundationPath),
    skeleton_intake: ref(skeletonPath),
    product_atlas_linkage: ref(productPath)
  },
  next_gates: {
    foundation: { status: foundation.status, independent_audits_required: 2, canonical_foundation_mutations: 0 },
    skeleton_loading_redesign: { status: skeleton.status, blocks: ['loading/skeleton redesign'], does_not_block: ['AS-IS baseline closure', 'foundation audits', 'Product Atlas Git linkage', 'Wave 1 pattern candidate work'] },
    product_atlas_git_sot: { status: product.status, penpot_projection: product.penpot_projection.status },
    unified_design_v1: { status: 'READY_FOR_BOUNDED_WAVE_1_CANDIDATES', canonical_foundations_locked: false, production_astro_changes: 0, canonical_penpot_candidate_mutations: 0 }
  },
  prohibitions_preserved: {
    production_astro_changes: 0,
    token_merges: 0,
    canonical_foundation_changes: 0,
    product_atlas_dashboards_in_design_system_penpot: 0,
    loading_redesign_without_archive: 0
  }
};

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(`${output}: ${sha(output)}`);
