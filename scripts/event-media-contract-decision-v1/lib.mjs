import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { fail, requireValue } from './structured-validation-error.mjs';

export const BASE_SHA = '45288b001d724e0d3603d0c44d392ff370407bd0';
export const EVENTS_SHA = '66bc0d43e36299417626f992021cfb7299ddf704';
export const EVENTS_TREE = '72e24f49ad6642915131438de8c56b804c4826b0';
export const EVENTS_SITE_SRC_TREE = 'd737458f8a87a9b7dad4f4badffd1b3f4ce544dd';
export const EVENTS_SITE_PUBLIC_TREE = 'f42a045ec9ff3b1b2f3396a4df9f54cc6a767934';
export const DECODER_TREE = 'e77fc2457fadfdffb46ed2d90304ebb91e89a715';
export const DECODER_MANIFEST_SHA256 = 'f7740f7f533c3f0cda5d4d0b8ebe98b565d7f521368b96462daecbd26522d5cc';
export const BEHAVIORAL_MANIFEST_SHA256 = 'c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1';
export const COMPONENT_DECODER_TREE = 'c2af02d0796f91b7510422db9b9e6179c70f606e';
export const PENPOT_TREE = 'b5cc94d35586f34554e8873e3a4380111057116d';
export const PROTOTYPES_TREE = '658fa4cbc942a1e8cc34c005cf3305a944b8e86f';
export const EVENT_MEDIA_DOSSIER_SHA256 = '935c9ffd99cfe0e0e7f0625d20473991f2b5946d77be21666b5e47a4a76923d4';
export const EXACT_BLOCKERS_SHA256 = '77c1a288030173d1d1c25dd932dbf1ba8e576bc195702172a2c1b202981f7a46';

export const EXPECTED_COUNTS = Object.freeze({
  consumers: 52,
  semantic_types: 23,
  boundaries: 31,
  blockers: 12,
  candidates: 3,
  alternatives: 31,
  readiness: 3,
  owner_questions: 2,
  readiness_checks_per_candidate: 23,
});

export const ENTITY_KINDS = Object.freeze([
  'component_identity_candidate',
  'subcomponent_candidate',
  'composition_pattern',
  'consumer_placement',
  'semantic_media_mode',
  'foundation_candidate',
  'implementation_detail',
  'unresolved_boundary',
]);

export const ALTERNATIVES = Object.freeze([
  'merge',
  'preserve_as_variant',
  'preserve_as_composition',
  'split',
  'preserve_product_pattern',
  'preserve_unresolved',
]);

export const BLOCKER_IDS = Object.freeze([
  'EM-CENSUS-001',
  'EM-RATIO-002',
  'EM-SEMANTIC-003',
  'EM-CROP-004',
  'EM-TINY-005',
  'EM-FALLBACK-006',
  'EM-LAYOUT-007',
  'EM-RESP-008',
  'EM-RUNTIME-009',
  'EM-GOV-010',
  'EM-LABRAIL-011',
  'EM-PROVENANCE-012',
]);

export const CANDIDATE_IDS = Object.freeze([
  'candidate.event-primary-media',
  'candidate.event-media-viewer',
  'candidate.event-fallback-art',
]);

export const READINESS_CHECK_IDS = Object.freeze([
  'entity_kind_component_identity',
  'semantic_role_contract',
  'explicit_non_goals',
  'requirement_provenance_reconciled',
  'identity_boundary',
  'anatomy_contract',
  'content_model_contract',
  'implementation_membership',
  'consumer_application_census',
  'route_surface_context',
  'state_event_contract',
  'responsive_container_contract',
  'accessibility_contract',
  'runtime_visual_reconciliation',
  'operational_finding_closure',
  'unresolved_decision_blockers_absent',
  'candidate_contract_review',
  'migration_and_rollback',
  'evidence_refs_exist',
  'media_consumer_policy',
  'loading_recovery',
  'experiment_decision',
  'product_model_dependency',
]);

export const REQUIRED_RATIOS = Object.freeze(['4:5', '5:4', '3:2', '2:3', '1:1', 'intrinsic/source']);
export const OBSERVED_RATIOS = Object.freeze([
  '11:13', '16:10', '1:1', '27:20', '29:26', '2:3', '31:56..199:112', '3:2', '3:4', '40:21', '4:3', '4:5', '5:4', '6:5',
  'intrinsic/source', 'intrinsic/source-clamped-0.2..3.2', 'intrinsic/source-clamped-0.38..2.2', 'intrinsic/source-or-bounded-row',
  'not-fixed/grid-cell-width-by-count', 'not-fixed/grid-row-min-height', 'not-fixed/responsive-target-unknown', 'not-fixed/viewport-derived',
  'source-or-generated-4:5', 'viewport-cover/unspecified-source',
]);

export const REQUIRED_SEMANTIC_IDS = Object.freeze([
  'event-media.semantic.visual-only-photography',
  'event-media.semantic.portrait-poster',
  'event-media.semantic.textual-artwork',
  'event-media.semantic.ocr-document',
  'event-media.semantic.unknown-text-mode',
  'event-media.placement.event-hero',
  'event-media.placement.event-card-preview',
  'event-media.placement.compact-listing-search-media',
  'event-media.placement.primary-gallery-media',
  'event-media.placement.gallery-preview',
  'event-media.placement.poster-companion',
  'event-media.state.no-image-fallback',
  'event-media.state.broken-media-fallback',
  'event-media.output.share-social-media',
]);

const DECODER = 'catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc';
const BEHAVIOR = 'catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc';
export const RECEIPT_PATH = 'receipts/normalization/event-media-contract-decision-v1.json';

export const shaBuffer = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
export const stable = (value) => `${JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.entries(item).sort(([left], [right]) => left.localeCompare(right)))
  : item, 2)}\n`;
export const sameSet = (left, right) => JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());

const git = (root, args) => childProcess.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
const absolute = (root, relative) => path.join(root, relative);
const read = (root, relative) => fs.readFileSync(absolute(root, relative));
const sha = (root, relative) => shaBuffer(read(root, relative));
const json = (root, relative) => JSON.parse(read(root, relative).toString('utf8'));

export const jsonl = (root, relative) => read(root, relative).toString('utf8').split('\n').filter(Boolean).map((line, index) => {
  try { return JSON.parse(line); }
  catch (error) { fail('EMV_JSONL_PARSE', 'schema', relative, `/${index}`, error.message); }
});

const unique = (values, code, stage, record, pointer) => requireValue(new Set(values).size === values.length, code, stage, record, pointer, 'duplicate stable value');
const nonEmptyStrings = (value) => Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string' && item.length > 0);
const exactFalseBoundary = (row, record) => {
  for (const [field, expected] of Object.entries({
    candidate_decision_accepted: false,
    normalization_allowed: false,
    physical_operation_authorized: false,
    migration_started: false,
    promotion_ready: false,
    global_ratio_selected: false,
    global_token_selected: false,
    penpot_materialized: false,
  })) requireValue(row[field] === expected, 'EMV_STOP_FLAG_ESCAPED', 'stop', record, `/${field}`, `${field} must remain false`);
  requireValue(row.decision === 'NOT_MERGED', 'EMV_DECISION_MERGED', 'stop', record, '/decision', 'decision must remain NOT_MERGED');
  requireValue(row.product_value_gate_mode === 'observe' && row.value_evidence_status === 'pending_product_model', 'EMV_PRODUCT_GATE_ESCAPED', 'product-value', record, '/', 'Product Value must remain observe/pending');
};

const validateEvidenceRef = (root, eventsRoot, ref, record, pointer, fixtureMode) => {
  requireValue(typeof ref === 'string' && ref.length > 0, 'EMV_EVIDENCE_REF_EMPTY', 'provenance', record, pointer, 'evidence reference is empty');
  const eventMatch = ref.match(/^events-bot-new@([a-f0-9]{40}):([^:#]+)(?::.*)?$/u);
  if (eventMatch) {
    requireValue(eventMatch[1] === EVENTS_SHA, 'EMV_EVENTS_EVIDENCE_SHA', 'provenance', record, pointer, 'events evidence is not pinned to the closure commit');
    if (!fixtureMode && eventsRoot) {
      try { git(eventsRoot, ['cat-file', '-e', `${EVENTS_SHA}:${eventMatch[2]}`]); }
      catch { fail('EMV_EVENTS_EVIDENCE_PATH', 'provenance', record, pointer, `events evidence path does not exist: ${eventMatch[2]}`); }
    }
    return;
  }
  if (ref.startsWith('behavioral@')) {
    requireValue(ref.includes(BEHAVIORAL_MANIFEST_SHA256), 'EMV_BEHAVIORAL_REF_SHA', 'provenance', record, pointer, 'behavioral reference has the wrong manifest digest');
    return;
  }
  if (ref.startsWith('lovekgd-design-system:')) {
    const local = ref.slice('lovekgd-design-system:'.length).split('#')[0];
    requireValue(fs.existsSync(absolute(root, local)), 'EMV_LOCAL_EVIDENCE_PATH', 'provenance', record, pointer, `local evidence path does not exist: ${local}`);
    return;
  }
  if (/^(catalog|contracts|docs)\//u.test(ref)) {
    const local = ref.split('#')[0];
    requireValue(fs.existsSync(absolute(root, local)), 'EMV_LOCAL_EVIDENCE_PATH', 'provenance', record, pointer, `local evidence path does not exist: ${local}`);
  }
};

const verifyRefs = (root, eventsRoot, refs, record, pointer, fixtureMode, allowEmpty = false) => {
  requireValue(Array.isArray(refs) && (allowEmpty || refs.length > 0), 'EMV_EVIDENCE_REFS_REQUIRED', 'provenance', record, pointer, 'evidence references are required');
  // Exact duplicate rejection is applied after cross-lane evidence cleanup.
  // Keep this resolver focused on authority and path validation.
  refs.forEach((ref, index) => validateEvidenceRef(root, eventsRoot, ref, record, `${pointer}/${index}`, fixtureMode));
};

const immutableChecks = (root, eventsRoot, fixtureMode) => {
  requireValue(sha(root, `${DECODER}/manifest.json`) === DECODER_MANIFEST_SHA256, 'EMV_IMMUTABLE_DECODER_MANIFEST', 'immutable', 'decoder-v1', '/manifest', 'Decoder v1 manifest changed');
  requireValue(sha(root, `${BEHAVIOR}/manifest.json`) === BEHAVIORAL_MANIFEST_SHA256, 'EMV_IMMUTABLE_BEHAVIORAL_MANIFEST', 'immutable', 'behavioral-v1.1', '/manifest', 'Behavioral v1.1 manifest changed');
  requireValue(sha(root, 'catalog/normalization/families/event-media/dossier.json') === EVENT_MEDIA_DOSSIER_SHA256, 'EMV_SOURCE_DOSSIER_DRIFT', 'immutable', 'event-media-dossier', '/', 'source Event Media dossier changed');
  const sourceBlockers = json(root, 'catalog/normalization/families/event-media/dossier.json').exact_blockers;
  requireValue(shaBuffer(Buffer.from(JSON.stringify(sourceBlockers, Object.keys(sourceBlockers).sort()))) !== '', 'EMV_SOURCE_BLOCKERS_UNREADABLE', 'immutable', 'event-media-dossier', '/exact_blockers', 'source blockers unreadable');
  const canonicalBlockers = JSON.stringify(sourceBlockers, (_key, value) => value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b))) : value);
  requireValue(shaBuffer(Buffer.from(canonicalBlockers)) === EXACT_BLOCKERS_SHA256, 'EMV_SOURCE_BLOCKERS_DRIFT', 'immutable', 'event-media-dossier', '/exact_blockers', 'exact blocker source changed');
  if (!fixtureMode) {
    requireValue(git(root, ['rev-parse', `HEAD:${DECODER}`]) === DECODER_TREE, 'EMV_IMMUTABLE_DECODER_TREE', 'immutable', 'decoder-v1', '/', 'Decoder v1 tree changed');
    requireValue(git(root, ['rev-parse', 'HEAD:catalog/component-decoder']) === COMPONENT_DECODER_TREE, 'EMV_IMMUTABLE_COMPONENT_DECODER_TREE', 'immutable', 'component-decoder', '/', 'component decoder tree changed');
    requireValue(git(root, ['rev-parse', 'HEAD:penpot']) === PENPOT_TREE, 'EMV_PENPOT_TREE_CHANGED', 'stop', 'penpot', '/', 'Penpot tree changed');
    requireValue(git(root, ['rev-parse', 'HEAD:prototypes']) === PROTOTYPES_TREE, 'EMV_PROTOTYPE_TREE_CHANGED', 'stop', 'prototypes', '/', 'prototype tree changed');
    requireValue(eventsRoot, 'EMV_EVENTS_REPO_REQUIRED', 'immutable', 'events-bot-new', '/', '--events-repo is required');
    requireValue(git(eventsRoot, ['rev-parse', 'HEAD']) === EVENTS_SHA, 'EMV_EVENTS_HEAD_CHANGED', 'immutable', 'events-bot-new', '/HEAD', 'events checkout is not the pinned closure commit');
    requireValue(git(eventsRoot, ['rev-parse', 'HEAD^{tree}']) === EVENTS_TREE, 'EMV_EVENTS_TREE_CHANGED', 'immutable', 'events-bot-new', '/', 'events tree changed');
    requireValue(git(eventsRoot, ['rev-parse', 'HEAD:site/src']) === EVENTS_SITE_SRC_TREE, 'EMV_EVENTS_SITE_SRC_CHANGED', 'immutable', 'events-bot-new', '/site/src', 'production site/src changed');
    requireValue(git(eventsRoot, ['rev-parse', 'HEAD:site/public']) === EVENTS_SITE_PUBLIC_TREE, 'EMV_EVENTS_SITE_PUBLIC_CHANGED', 'immutable', 'events-bot-new', '/site/public', 'production site/public changed');
    requireValue(git(eventsRoot, ['status', '--porcelain']) === '', 'EMV_EVENTS_DIRTY', 'immutable', 'events-bot-new', '/', 'events evidence checkout is dirty');
  }
};

const allowedChangedPath = (relative) => [
  /^\.codex\/integration\/event-media-contract-decision-v1\//u,
  /^\.codex\/lanes\/event-media-/u,
  /^\.github\/workflows\/event-media-contract-decision-v1\.yml$/u,
  /^\.github\/workflows\/project-normalization-synthesis-v1-1\.yml$/u,
  /^catalog\/normalization\/event-media\//u,
  /^contracts\/normalization\/event-media-/u,
  /^docs\/normalization\/event-media-/u,
  /^docs\/index\.md$/u,
  /^receipts\/normalization\/event-media-contract-decision-v1\.json$/u,
  /^scripts\/event-media-contract-decision-v1\//u,
  /^scripts\/[^/]*event-media-contract-decision[^/]*\.(mjs|py)$/u,
  /^scripts\/normalization-v1-1\/replay-normalization-workflow\.sh$/u,
  /^tests\/[^/]*event-media-contract-decision-v1[^/]*\.mjs$/u,
].some((pattern) => pattern.test(relative));

const stopPathChecks = (root, fixtureMode) => {
  if (fixtureMode) return;
  const changed = git(root, ['diff', '--name-only', `${BASE_SHA}...HEAD`, '--']).split('\n').filter(Boolean);
  const untracked = git(root, ['ls-files', '--others', '--exclude-standard']).split('\n').filter(Boolean);
  for (const relative of [...changed, ...untracked]) {
    requireValue(allowedChangedPath(relative), 'EMV_FORBIDDEN_PATH_CHANGED', 'stop', relative, '/', 'path is outside the Event Media decision allowlist');
    requireValue(!/\.(png|jpe?g|webp|gif|avif)$/iu.test(relative), 'EMV_RASTER_ADDED', 'stop', relative, '/', 'new raster evidence is forbidden');
  }
};

const assertProductBoundary = (row, record) => {
  requireValue(row.product_value_gate_mode === 'observe' && row.value_evidence_status === 'pending_product_model' && row.promotion_ready === false, 'EMV_PRODUCT_GATE_ESCAPED', 'product-value', record, '/', 'Product Value must remain observe/pending and promotion false');
};

export const collectAndValidate = ({ root, eventsRoot = null, fixtureMode = false } = {}) => {
  const absoluteRoot = path.resolve(root ?? '.');
  const absoluteEvents = eventsRoot ? path.resolve(eventsRoot) : null;
  immutableChecks(absoluteRoot, absoluteEvents, fixtureMode);
  stopPathChecks(absoluteRoot, fixtureMode);

  const consumers = jsonl(absoluteRoot, 'catalog/normalization/event-media/consumer-requirement-matrix.jsonl');
  const semantics = jsonl(absoluteRoot, 'catalog/normalization/event-media/semantic-media-types.jsonl');
  const boundaries = jsonl(absoluteRoot, 'catalog/normalization/event-media/boundary-model.jsonl');
  const blockers = jsonl(absoluteRoot, 'catalog/normalization/event-media/blocker-closure.jsonl');
  const alternatives = jsonl(absoluteRoot, 'catalog/normalization/event-media/alternatives-and-recommendations.jsonl');
  const readiness = jsonl(absoluteRoot, 'catalog/normalization/event-media/readiness.jsonl');
  const ownerQueue = jsonl(absoluteRoot, 'catalog/normalization/event-media/owner-decision-queue.jsonl');
  const boundaryContract = json(absoluteRoot, 'contracts/normalization/event-media-boundary-model.v1.json');
  const candidates = fs.readdirSync(absolute(absoluteRoot, 'catalog/normalization/event-media/candidate-contracts')).filter((name) => name.endsWith('.json')).sort()
    .map((name) => ({ path: `catalog/normalization/event-media/candidate-contracts/${name}`, document: json(absoluteRoot, `catalog/normalization/event-media/candidate-contracts/${name}`) }));

  for (const [name, rows, count, key] of [
    ['consumers', consumers, EXPECTED_COUNTS.consumers, 'id'],
    ['semantic-types', semantics, EXPECTED_COUNTS.semantic_types, 'id'],
    ['boundaries', boundaries, EXPECTED_COUNTS.boundaries, 'id'],
    ['blockers', blockers, EXPECTED_COUNTS.blockers, 'blocker_id'],
    ['alternatives', alternatives, EXPECTED_COUNTS.alternatives, 'id'],
    ['readiness', readiness, EXPECTED_COUNTS.readiness, 'id'],
    ['owner-queue', ownerQueue, EXPECTED_COUNTS.owner_questions, 'id'],
  ]) {
    requireValue(rows.length === count, 'EMV_COUNT_MISMATCH', 'cardinality', name, '/', `expected ${count}, got ${rows.length}`);
    unique(rows.map((row) => row[key]), 'EMV_STABLE_ID_DUPLICATE', 'cardinality', name, `/${key}`);
  }
  requireValue(candidates.length === EXPECTED_COUNTS.candidates, 'EMV_CANDIDATE_COUNT', 'cardinality', 'candidate-contracts', '/', 'candidate file count mismatch');

  const semanticIds = new Set(semantics.map((row) => row.id));
  REQUIRED_SEMANTIC_IDS.forEach((id) => requireValue(semanticIds.has(id), 'EMV_REQUIRED_SEMANTIC_TYPE_MISSING', 'semantics', id, '/', 'required semantic media type is missing'));
  requireValue(semanticIds.has('event-media.semantic.visual-only-photography') && semanticIds.has('event-media.semantic.portrait-poster'), 'EMV_PHOTO_POSTER_COLLAPSED', 'semantics', 'media-types', '/', 'photography and poster must remain separate');

  const allRatios = new Set();
  const censusText = [];
  for (const consumer of consumers) {
    const record = consumer.id;
    requireValue(consumer.schema_version === 'event_media_consumer_requirement_matrix_v1' && consumer.record_kind === 'event_media_consumer_application', 'EMV_CONSUMER_SCHEMA', 'census', record, '/', 'consumer record identity differs');
    requireValue(consumer.family_id === 'family.event-media' && consumer.decision === 'NOT_MERGED', 'EMV_CONSUMER_BOUNDARY', 'census', record, '/', 'consumer escaped family boundary');
    requireValue(consumer.normalization_allowed === false && consumer.physical_ui_change_authorized === false && consumer.candidate_contract_accepted === false, 'EMV_CONSUMER_MUTATION_AUTHORIZED', 'stop', record, '/', 'consumer authorizes mutation or acceptance');
    assertProductBoundary(consumer, record);
    requireValue(consumer.source_component?.repository === 'onedayonemasterpiece/events-bot-new' && consumer.source_component?.commit === EVENTS_SHA && typeof consumer.source_component?.path === 'string', 'EMV_SOURCE_COMPONENT_INVALID', 'census', record, '/source_component', 'source component must bind exact events evidence');
    if (!fixtureMode && absoluteEvents) {
      try { git(absoluteEvents, ['cat-file', '-e', `${EVENTS_SHA}:${consumer.source_component.path}`]); }
      catch { fail('EMV_SOURCE_COMPONENT_MISSING', 'census', record, '/source_component/path', consumer.source_component.path); }
    }
    requireValue(nonEmptyStrings(consumer.routes), 'EMV_CONSUMER_ROUTE_MISSING', 'census', record, '/routes', 'consumer route/surface is missing');
    const assignedSemanticIds = Object.values(consumer.semantic_axis_assignments ?? {}).flat();
    requireValue(Array.isArray(consumer.semantic_media_types)
      && consumer.semantic_media_types.every((id) => semanticIds.has(id))
      && assignedSemanticIds.length > 0
      && assignedSemanticIds.every((id) => semanticIds.has(id)), 'EMV_CONSUMER_SEMANTIC_REF', 'census', record, '/semantic_axis_assignments', 'consumer semantic type/placement/state reference is unresolved');
    requireValue(consumer.aspect_ratio_policy?.target_ratio_selected === false && nonEmptyStrings(consumer.aspect_ratio_policy?.evidence_refs), 'EMV_GLOBAL_RATIO_SELECTED', 'ratios', record, '/aspect_ratio_policy', 'ratio policy selected a global target or lacks provenance');
    requireValue(Array.isArray(consumer.aspect_ratio_policy.ratios) && consumer.aspect_ratio_policy.ratios.length > 0, 'EMV_RATIO_MISSING', 'ratios', record, '/aspect_ratio_policy/ratios', 'consumer ratio evidence is empty');
    consumer.aspect_ratio_policy.ratios.forEach((ratio, index) => {
      requireValue(typeof ratio.notation === 'string' && ratio.notation.length > 0 && ratio.global_token_selected === false, 'EMV_RATIO_GLOBAL_TOKEN', 'ratios', record, `/aspect_ratio_policy/ratios/${index}`, 'ratio is missing or was promoted to a global token');
      verifyRefs(absoluteRoot, absoluteEvents, ratio.evidence_refs, record, `/aspect_ratio_policy/ratios/${index}/evidence_refs`, fixtureMode);
      if (ratio.notation.includes('intrinsic/source')) requireValue(!/error|invalid/iu.test(ratio.status), 'EMV_SOURCE_RATIO_INVALID', 'ratios', record, `/aspect_ratio_policy/ratios/${index}/status`, 'intrinsic/source ratio was treated as an error');
      allRatios.add(ratio.notation);
    });
    verifyRefs(absoluteRoot, absoluteEvents, consumer.evidence_refs, record, '/evidence_refs', fixtureMode);
    for (const field of ['requirement_authority', 'geometry', 'fit_policy', 'crop_permission', 'focal_point_policy', 'safe_area_policy', 'object_position_policy', 'upscale_tiny_source_policy', 'loading_skeleton_policy', 'missing_broken_fallback_policy', 'responsive_art_direction', 'accessibility_alt_behavior']) {
      requireValue(consumer[field] && typeof consumer[field].status === 'string', 'EMV_CONSUMER_DIMENSION_MISSING', 'census', record, `/${field}`, 'required consumer policy dimension is missing');
      verifyRefs(absoluteRoot, absoluteEvents, consumer[field].evidence_refs ?? consumer[field].refs, record, `/${field}/evidence_refs`, fixtureMode);
    }
    requireValue(consumer.runtime_evidence?.production_equivalent === false && consumer.runtime_evidence?.production_observed === false, 'EMV_RUNTIME_OVERCLAIM', 'runtime', record, '/runtime_evidence', 'pinned evidence is not production-equivalent or production-observed');
    verifyRefs(absoluteRoot, absoluteEvents, consumer.runtime_evidence.refs, record, '/runtime_evidence/refs', fixtureMode);
    const provenanceKeys = ['current_source', 'requirements', 'tests', 'fixtures', 'decoder_v1', 'behavioral_decoder_v1_1', 'git_history', 'experiments'];
    requireValue(provenanceKeys.every((key) => consumer.cell_level_provenance?.[key]), 'EMV_CELL_PROVENANCE_MISSING', 'provenance', record, '/cell_level_provenance', 'cell-level provenance is incomplete');
    provenanceKeys.forEach((key) => verifyRefs(absoluteRoot, absoluteEvents, consumer.cell_level_provenance[key].refs, record, `/cell_level_provenance/${key}/refs`, fixtureMode, true));
    censusText.push(`${consumer.id} ${consumer.consumer} ${consumer.routes.join(' ')}`.toLowerCase());
  }
  REQUIRED_RATIOS.forEach((ratio) => requireValue(allRatios.has(ratio), ratio === '4:5' ? 'EMV_RATIO_4_5_MISSING' : ratio === '5:4' ? 'EMV_RATIO_5_4_MISSING' : 'EMV_REQUIRED_RATIO_MISSING', 'ratios', ratio, '/', 'required ratio is absent'));
  requireValue(sameSet(allRatios, OBSERVED_RATIOS), 'EMV_DISCOVERED_RATIO_DRIFT', 'ratios', 'observed-ratios', '/', 'observed ratio provenance set changed');
  const joinedCensus = [...censusText, ...semantics.map((row) => `${row.id} ${row.label} ${row.reason ?? ''}`.toLowerCase())].join('\n');
  for (const token of ['event-detail', 'event-card', 'search', 'listing', 'personal-feed', 'favorites', 'collection', 'festival', 'club', 'artifact', 'share', 'lab']) {
    requireValue(joinedCensus.includes(token), 'EMV_CENSUS_SURFACE_MISSING', 'census', token, '/', `required consumer/surface coverage is absent: ${token}`);
  }

  const boundaryById = new Map(boundaries.map((row) => [row.id, row]));
  for (const semantic of semantics) {
    assertProductBoundary(semantic, semantic.id);
    requireValue(semantic.decision === 'NOT_MERGED' && semantic.candidate_contract_accepted === false && semantic.normalization_allowed !== true, 'EMV_SEMANTIC_ACCEPTED', 'semantics', semantic.id, '/', 'semantic record was accepted or normalized');
    requireValue(ENTITY_KINDS.includes(semantic.entity_kind), 'EMV_ENTITY_KIND_INVALID', 'semantics', semantic.id, '/entity_kind', 'semantic entity kind is invalid');
    requireValue(boundaryById.has(semantic.boundary_model_ref), 'EMV_SEMANTIC_BOUNDARY_REF', 'boundary', semantic.id, '/boundary_model_ref', 'semantic forward reference is unresolved');
    verifyRefs(absoluteRoot, absoluteEvents, semantic.authority?.refs, semantic.id, '/authority/refs', fixtureMode);
  }

  const candidateBoundaryIds = new Set();
  for (const boundary of boundaries) {
    exactFalseBoundary(boundary, boundary.id);
    requireValue(ENTITY_KINDS.includes(boundary.entity_kind), 'EMV_ENTITY_KIND_INVALID', 'boundary', boundary.id, '/entity_kind', 'boundary entity kind is invalid');
    requireValue(boundary.entity_kind_reconciled === true, 'EMV_ENTITY_KIND_UNRECONCILED', 'boundary', boundary.id, '/entity_kind_reconciled', 'boundary kind reconciliation is incomplete');
    verifyRefs(absoluteRoot, absoluteEvents, boundary.supporting_evidence_refs, boundary.id, '/supporting_evidence_refs', fixtureMode);
    if (boundary.candidate_contract_ref !== null) {
      requireValue(boundary.entity_kind === 'component_identity_candidate', 'EMV_COMPOSITION_AS_COMPONENT', 'boundary', boundary.id, '/candidate_contract_ref', 'only a component identity candidate may own a contract');
      requireValue(fs.existsSync(absolute(absoluteRoot, boundary.candidate_contract_ref)), 'EMV_CANDIDATE_CONTRACT_REF', 'boundary', boundary.id, '/candidate_contract_ref', 'candidate contract file is missing');
      candidateBoundaryIds.add(path.basename(boundary.candidate_contract_ref, '.json'));
    } else requireValue(boundary.entity_kind !== 'component_identity_candidate', 'EMV_CANDIDATE_CONTRACT_MISSING', 'boundary', boundary.id, '/candidate_contract_ref', 'component identity candidate lacks a contract');
  }
  requireValue(boundaryById.get('event-media.boundary.family.event-media')?.entity_kind === 'composition_pattern' && boundaryById.get('event-media.boundary.family.event-media')?.candidate_contract_ref === null, 'EMV_FAMILY_COMPOSITION_ESCAPED', 'boundary', 'family.event-media', '/', 'Event Media analytical family must remain a composition pattern');
  requireValue(sameSet(candidateBoundaryIds, CANDIDATE_IDS), 'EMV_CANDIDATE_SET_MISMATCH', 'boundary', 'candidate-identities', '/', 'candidate boundary/contract set differs');
  for (const id of ['event-media.boundary.placement.event-card-preview', 'event-media.boundary.placement.event-hero', 'event-media.boundary.semantic.portrait-poster', 'event-media.boundary.placement.poster-companion', 'event-media.boundary.placement.primary-gallery-media', 'event-media.boundary.placement.gallery-preview', 'event-media.boundary.state.no-image-fallback', 'event-media.boundary.state.loading-skeleton-media-frame', 'event-media.boundary.output.share-social-media']) {
    requireValue(boundaryById.has(id), 'EMV_REQUIRED_BOUNDARY_MISSING', 'boundary', id, '/', 'required boundary subject is missing');
  }

  const sourceBlockers = json(absoluteRoot, 'catalog/normalization/families/event-media/dossier.json').exact_blockers;
  const sourceById = new Map(sourceBlockers.map((row) => [row.id, row]));
  const blockerById = new Map(blockers.map((row) => [row.blocker_id, row]));
  requireValue(sameSet(blockerById.keys(), BLOCKER_IDS), 'EMV_BLOCKER_SET_MISMATCH', 'blockers', 'blocker-closure', '/', 'closure ledger is not the exact 12-blocker set');
  for (const blocker of blockers) {
    const record = blocker.blocker_id;
    requireValue(sourceById.get(record)?.statement === blocker.source_text, 'EMV_BLOCKER_SOURCE_TEXT_DRIFT', 'blockers', record, '/source_text', 'source blocker text is not exact');
    requireValue(['resolved_by_existing_evidence', 'resolved_by_requirement', 'invalidated', 'owner_decision_required', 'still_open'].includes(blocker.status), 'EMV_BLOCKER_STATUS_INVALID', 'blockers', record, '/status', 'blocker status is invalid');
    requireValue(blocker.field_presence_closes_blocker === false && blocker.owner_decision_accepted === false && blocker.closure_receipt === null && blocker.production_state_claimed === false && blocker.promotion_ready === false, 'EMV_BLOCKER_FAIL_OPEN', 'blockers', record, '/', 'blocker was closed or promoted without evidence');
    requireValue(Array.isArray(blocker.actual_evidence) && blocker.actual_evidence.length > 0 && blocker.actual_evidence.every((item) => item.ref && item.finding && item.limitation), 'EMV_BLOCKER_EVIDENCE_MISSING', 'blockers', record, '/actual_evidence', 'blocker evidence must include finding and limitation');
    blocker.actual_evidence.forEach((item, index) => validateEvidenceRef(absoluteRoot, absoluteEvents, item.ref, record, `/actual_evidence/${index}/ref`, fixtureMode));
    if (['resolved_by_existing_evidence', 'resolved_by_requirement', 'invalidated'].includes(blocker.status)) requireValue(blocker.closure_receipt !== null, 'EMV_BLOCKER_RESOLVED_WITHOUT_RECEIPT', 'blockers', record, '/closure_receipt', 'resolved blocker requires evidence receipt');
    if (blocker.status === 'owner_decision_required') requireValue(typeof blocker.owner_question_id === 'string', 'EMV_BLOCKER_OWNER_QUEUE_MISSING', 'blockers', record, '/owner_question_id', 'owner-required blocker lacks queue reference');
    if (blocker.status === 'still_open') requireValue(blocker.owner_question_id === null && blocker.residual_risk.length > 0, 'EMV_BLOCKER_OPEN_STATE_INVALID', 'blockers', record, '/', 'open blocker must retain exact residual risk');
  }

  const alternativeByBoundary = new Map();
  for (const row of alternatives) {
    exactFalseBoundary(row, row.id);
    requireValue(boundaryById.has(row.boundary_ref), 'EMV_ALTERNATIVE_BOUNDARY_REF', 'alternatives', row.id, '/boundary_ref', 'alternative row has no boundary');
    requireValue(sameSet(row.compared_options, ALTERNATIVES), 'EMV_ALTERNATIVE_SET_INCOMPLETE', 'alternatives', row.id, '/compared_options', 'all six alternatives are required');
    requireValue(ALTERNATIVES.includes(row.recommendation), 'EMV_RECOMMENDATION_INVALID', 'alternatives', row.id, '/recommendation', 'recommendation is invalid');
    requireValue(sameSet(row.rejected_alternatives, ALTERNATIVES.filter((item) => item !== row.recommendation)), 'EMV_REJECTED_ALTERNATIVES_MISMATCH', 'alternatives', row.id, '/rejected_alternatives', 'rejected alternatives are not the exact complement');
    requireValue(row.option_assessments.length === 6 && row.option_assessments.filter((item) => item.status === 'recommended').length === 1, 'EMV_OPTION_ASSESSMENTS_INVALID', 'alternatives', row.id, '/option_assessments', 'six assessments and one recommendation are required');
    requireValue(typeof row.recommendation_support === 'string' && row.recommendation_support.length > 0 && nonEmptyStrings(row.intentional_differences), 'EMV_RECOMMENDATION_EVIDENCE_MISSING', 'alternatives', row.id, '/', 'recommendation evidence/differences are missing');
    verifyRefs(absoluteRoot, absoluteEvents, row.supporting_evidence_refs, row.id, '/supporting_evidence_refs', fixtureMode);
    alternativeByBoundary.set(row.boundary_ref, row);
  }
  requireValue(alternativeByBoundary.size === boundaries.length, 'EMV_ALTERNATIVE_COVERAGE', 'alternatives', 'boundary-set', '/', 'every boundary must have exactly one alternatives row');

  const candidateById = new Map();
  for (const { path: candidatePath, document: candidate } of candidates) {
    const record = candidate.candidate_component_id;
    requireValue(CANDIDATE_IDS.includes(record) && path.basename(candidatePath, '.json') === record, 'EMV_CANDIDATE_ID_PATH', 'candidate', record, '/', 'candidate ID/file mismatch');
    requireValue(candidate.entity_kind === 'component_identity_candidate' && candidate.normative_status === 'candidate-not-accepted' && candidate.contract_decision_status === 'draft' && candidate.candidate_contract_accepted === false && candidate.canonical === false, 'EMV_CANDIDATE_ACCEPTED', 'candidate', record, '/', 'candidate was accepted or made canonical');
    requireValue(candidate.decision === 'NOT_MERGED' && candidate.normalization_allowed === false && candidate.physical_operation_authorized === false && candidate.migration_started === false, 'EMV_CANDIDATE_OPERATION_AUTHORIZED', 'candidate', record, '/', 'candidate authorized a physical operation');
    requireValue(candidate.product_value?.gate_mode === 'observe' && candidate.product_value?.value_evidence_status === 'pending_product_model' && candidate.product_value?.promotion_ready === false && candidate.product_value?.product_ids_created === false && candidate.product_value?.metrics_created === false, 'EMV_CANDIDATE_PRODUCT_GATE', 'product-value', record, '/product_value', 'candidate invented product evidence or promotion');
    requireValue(candidate.experiments?.decision === 'NOT_MERGED' && candidate.experiments?.winner_receipt === null, 'EMV_EXPERIMENT_WINNER_SELECTED', 'experiments', record, '/experiments', 'candidate selected an experiment winner');
    requireValue(candidate.penpot_future?.status === 'unmaterialized' && candidate.penpot_future?.binding === null && candidate.penpot_future?.materialization_authorized === false && candidate.penpot_future?.screenshots_role === 'evidence_only' && nonEmptyStrings(candidate.penpot_future?.allowed_instance_overrides) && nonEmptyStrings(candidate.penpot_future?.forbidden_instance_overrides), 'EMV_PENPOT_FUTURE_INVALID', 'penpot', record, '/penpot_future', 'future Penpot contract escaped bounded, unmaterialized state');
    unique([...(candidate.penpot_future.variant_axes ?? []), ...(candidate.penpot_future.state_axes ?? [])], 'EMV_PENPOT_STABLE_ID_DUPLICATE', 'penpot', record, '/penpot_future', 'variant/state axis ID is duplicated');
    for (const policy of candidate.crop_contain_policy ?? []) {
      if (['ocr_document', 'unknown_text_protected'].includes(policy.semantic_mode)) requireValue(policy.fit === 'contain' && /forbidden/iu.test(policy.crop_permission), 'EMV_OCR_DEFAULT_CROP', 'media-policy', record, '/crop_contain_policy', 'OCR/document or unknown-text mode must default to contain/no-crop');
    }
    requireValue(nonEmptyStrings(candidate.consumer_application_refs) && candidate.consumer_application_refs.every((id) => consumers.some((row) => row.id === id)), 'EMV_CANDIDATE_CONSUMER_REF', 'candidate', record, '/consumer_application_refs', 'candidate consumer reference is unresolved');
    verifyRefs(absoluteRoot, absoluteEvents, candidate.evidence_refs, record, '/evidence_refs', fixtureMode);
    candidateById.set(record, candidate);
  }
  requireValue(sameSet(candidateById.keys(), CANDIDATE_IDS), 'EMV_CANDIDATE_SET_MISMATCH', 'candidate', 'candidate-set', '/', 'candidate file set differs');

  const ownerById = new Map(ownerQueue.map((row) => [row.id, row]));
  for (const row of ownerQueue) {
    requireValue(row.status === 'PENDING_OWNER_DECISION' && row.owner_required === true && row.accepted_option_id === null && row.decision_receipt_ref === null, 'EMV_OWNER_DECISION_ACCEPTED', 'owner-queue', row.id, '/', 'owner queue item was accepted');
    requireValue(row.decision === 'NOT_MERGED' && row.implementation_authorized === false && row.candidate_contract_acceptance_authorized === false && row.normalization_allowed === false && row.migration_started === false && row.promotion_ready === false, 'EMV_OWNER_QUEUE_AUTHORIZED', 'owner-queue', row.id, '/', 'owner queue authorized downstream work');
    requireValue(row.penpot_binding === null && row.penpot_materialization_status === 'unmaterialized' && row.penpot_mutation_performed === false, 'EMV_OWNER_QUEUE_PENPOT', 'owner-queue', row.id, '/penpot_binding', 'owner queue changed Penpot');
    assertProductBoundary(row, row.id);
    requireValue(row.blocking_refs.every((id) => blockerById.has(id)) && row.alternative_refs.every((id) => alternatives.some((item) => item.id === id)), 'EMV_OWNER_QUEUE_REF', 'owner-queue', row.id, '/', 'owner queue foreign key is unresolved');
  }
  for (const blocker of blockers.filter((row) => row.status === 'owner_decision_required')) requireValue(ownerById.has(blocker.owner_question_id), 'EMV_BLOCKER_OWNER_QUEUE_MISSING', 'owner-queue', blocker.blocker_id, '/owner_question_id', 'blocker owner queue reference is unresolved');

  for (const row of readiness) {
    const candidate = candidateById.get(row.subject_id);
    requireValue(candidate && row.subject_entity_kind === 'component_identity_candidate', 'EMV_READINESS_SUBJECT_INVALID', 'readiness', row.id, '/subject_id', 'readiness subject is not a candidate identity');
    requireValue(row.checklist.length === READINESS_CHECK_IDS.length && sameSet(row.checklist.map((item) => item.check_id), READINESS_CHECK_IDS), 'EMV_READINESS_DIMENSION_MISSING', 'readiness', row.id, '/checklist', 'positive readiness checklist is incomplete');
    unique(row.checklist.map((item) => item.check_id), 'EMV_READINESS_DIMENSION_DUPLICATE', 'readiness', row.id, '/checklist');
    for (const check of row.checklist) {
      requireValue(['PASS', 'BLOCKED', 'NOT_APPLICABLE_WITH_REASON'].includes(check.status), 'EMV_READINESS_STATUS_INVALID', 'readiness', row.id, `/checklist/${check.check_id}`, 'readiness status is invalid');
      requireValue(typeof check.assertion === 'string' && check.assertion.length > 0, 'EMV_READINESS_REASON_MISSING', 'readiness', row.id, `/checklist/${check.check_id}/assertion`, 'readiness assertion/reason is missing');
      verifyRefs(absoluteRoot, absoluteEvents, check.evidence_refs, row.id, `/checklist/${check.check_id}/evidence_refs`, fixtureMode);
      if (check.applicability === 'NOT_APPLICABLE') requireValue(check.status === 'NOT_APPLICABLE_WITH_REASON', 'EMV_READINESS_NA_WITHOUT_REASON', 'readiness', row.id, `/checklist/${check.check_id}`, 'not-applicable check lacks reasoned status');
    }
    const blocked = row.checklist.filter((item) => item.status === 'BLOCKED');
    requireValue(blocked.length > 0 && row.status === 'NOT_READY_WITH_EXACT_BLOCKERS' && row.strict_ready === false && row.eligible_for_scoring === false && row.score === null && row.selected_first_wave === false, 'EMV_FALSE_POSITIVE_READINESS', 'readiness', row.id, '/', 'blocked candidate escaped fail-closed readiness');
    requireValue(row.candidate_contract_accepted === false && row.canonical === false && row.promotion_ready === false && row.normalization_allowed === false && row.physical_operation_authorized === false, 'EMV_READINESS_PROMOTED', 'readiness', row.id, '/', 'readiness accepted/promoted a candidate');
    requireValue(row.product_value_gate_mode === 'observe' && row.value_evidence_status === 'pending_product_model' && ['need_ids', 'job_ids', 'journey_ids', 'capability_ids', 'outcome_ids', 'metric_ids', 'guardrail_ids'].every((field) => row[field].length === 0), 'EMV_PRODUCT_ID_CREATED', 'product-value', row.id, '/', 'readiness invented product IDs');
    requireValue(row.experiment_decision === 'NOT_MERGED', 'EMV_EXPERIMENT_WINNER_SELECTED', 'experiments', row.id, '/experiment_decision', 'readiness selected an experiment');
    requireValue(sha(absoluteRoot, row.candidate_contract_ref) === row.candidate_contract_sha256, 'EMV_CANDIDATE_HASH_MISMATCH', 'readiness', row.id, '/candidate_contract_sha256', 'readiness candidate hash differs');
    requireValue(sameSet(row.blocker_closure_refs, candidate.open_blocker_refs), 'EMV_READINESS_BLOCKER_JOIN', 'readiness', row.id, '/blocker_closure_refs', 'candidate/readiness blocker set differs');
    const expectedOwner = row.owner_decision_blocker_refs.map((id) => blockerById.get(id)?.owner_question_id).filter(Boolean);
    requireValue(expectedOwner.every((id) => row.owner_question_refs.includes(id) && ownerById.has(id)), 'EMV_READINESS_OWNER_JOIN', 'readiness', row.id, '/owner_question_refs', 'readiness owner queue join differs');
  }

  const experimentRows = jsonl(absoluteRoot, `${BEHAVIOR}/experiment-registry.jsonl`);
  requireValue(experimentRows.length === 6 && experimentRows.every((row) => row.decision === 'NOT_MERGED' && row.winner_decision_receipt === 'absent'), 'EMV_EXPERIMENT_WINNER_SELECTED', 'experiments', 'behavioral-registry', '/', 'pinned experiments are not all NOT_MERGED');
  const globalReadiness = jsonl(absoluteRoot, 'catalog/normalization/semantic-readiness.jsonl');
  const wave = json(absoluteRoot, 'catalog/normalization/family-wave-plan.json');
  const apps = jsonl(absoluteRoot, 'catalog/normalization/component-applications.jsonl');
  const valueRows = jsonl(absoluteRoot, 'catalog/normalization/product-value-readiness.jsonl');
  requireValue(globalReadiness.length === 47 && globalReadiness.every((row) => row.status === 'NOT_READY' && row.strict_ready === false && row.score === null), 'EMV_GLOBAL_READINESS_DRIFT', 'baseline', 'semantic-readiness', '/', 'global 47-row readiness changed');
  requireValue(wave.counts?.not_ready === 47 && wave.counts?.strict_ready === 0 && wave.counts?.selected_first_wave === 0 && wave.first_wave_family_ids.length === 0, 'EMV_FIRST_WAVE_DRIFT', 'baseline', 'family-wave', '/', 'global first wave changed');
  requireValue(apps.length === 239 && valueRows.length === 239 && apps.every((row) => row.value_evidence_status === 'pending_product_model' && row.promotion_ready === false) && valueRows.every((row) => row.value_evidence_status === 'pending_product_model' && row.promotion_ready === false), 'EMV_PRODUCT_BASELINE_DRIFT', 'baseline', 'product-value', '/', 'global Product Value baseline changed');

  requireValue(boundaryContract.schema_version === 'event_media_boundary_model_manifest_v1' && boundaryContract.id === 'contract.event-media-boundary-model.v1', 'EMV_BOUNDARY_CONTRACT_INVALID', 'boundary', 'boundary-contract', '/', 'boundary contract identity differs');
  requireValue(sameSet(boundaryContract.entity_kind_enum, ENTITY_KINDS) && sameSet(boundaryContract.recommendation_enum, ALTERNATIVES), 'EMV_BOUNDARY_CONTRACT_ENUM', 'boundary', 'boundary-contract', '/', 'boundary contract enum differs');
  requireValue(boundaryContract.source_of_truth?.design_base_commit === BASE_SHA && boundaryContract.source_of_truth?.events_commit === EVENTS_SHA, 'EMV_BOUNDARY_AUTHORITY_SHA', 'boundary', 'boundary-contract', '/source_of_truth', 'boundary contract authority SHA differs');
  requireValue(boundaryContract.cardinality?.consumer_applications === 52 && boundaryContract.cardinality?.semantic_forward_refs === 23 && boundaryContract.cardinality?.boundary_records === 31 && boundaryContract.cardinality?.blockers === 12 && boundaryContract.cardinality?.candidate_contract_files === 3, 'EMV_BOUNDARY_CARDINALITY', 'boundary', 'boundary-contract', '/cardinality', 'boundary contract cardinality differs');

  const readyCandidates = readiness.filter((row) => row.status === 'READY_FOR_CONTRACT_DECISION_REVIEW');
  const finalStatuses = readyCandidates.length > 0
    ? ['EVENT_MEDIA_BOUNDARY_MODEL_COMPLETE', 'READY_FOR_OWNER_CONTRACT_DECISION']
    : ['EVENT_MEDIA_BOUNDARY_MODEL_COMPLETE', 'EVENT_MEDIA_NOT_READY_WITH_EXACT_BLOCKERS'];
  requireValue(readyCandidates.length === 0, 'EMV_UNSUPPORTED_READY_STATUS', 'readiness', 'final-status', '/', 'current package has unresolved exact blockers and cannot be ready');

  return {
    root: absoluteRoot,
    eventsRoot: absoluteEvents,
    rows: { consumers, semantics, boundaries, blockers, alternatives, readiness, ownerQueue, candidates },
    facts: {
      ...EXPECTED_COUNTS,
      observed_ratios: [...allRatios].sort(),
      open_blocker_ids: blockers.filter((row) => ['still_open', 'owner_decision_required'].includes(row.status)).map((row) => row.blocker_id),
      blocker_status_counts: Object.fromEntries([...new Set(blockers.map((row) => row.status))].sort().map((status) => [status, blockers.filter((row) => row.status === status).length])),
      ready_candidates: readyCandidates.length,
      blocked_candidates: readiness.length - readyCandidates.length,
      baseline_analytical_groups: 47,
      baseline_component_memberships: 107,
      baseline_not_ready: 47,
      baseline_scored: 0,
      baseline_first_wave: 0,
      baseline_applications_pending_product_model: 239,
      baseline_experiments_not_merged: 6,
    },
    finalStatuses,
  };
};

export const allowedOutputPath = allowedChangedPath;
export const readFile = read;
export const shaFile = sha;
export const gitCommand = git;
