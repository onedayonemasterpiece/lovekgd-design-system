import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { demand, reject } from './structured-error.mjs';

export const MERGED_MAIN = '3cbe35326ead04ac67070e5b400d30d9edc6eb01';
export const AUDITED_HEAD = '20eab45534e2c64497e4db661e6a5ca8582229ea';
export const MERGE_PARENT_1 = '45288b001d724e0d3603d0c44d392ff370407bd0';
export const MERGE_PARENT_2 = AUDITED_HEAD;
export const EVENTS_SHA = '66bc0d43e36299417626f992021cfb7299ddf704';
export const EVENTS_TREE = '72e24f49ad6642915131438de8c56b804c4826b0';
export const EVENTS_SITE_SRC_TREE = 'd737458f8a87a9b7dad4f4badffd1b3f4ce544dd';
export const EVENTS_SITE_PUBLIC_TREE = 'f42a045ec9ff3b1b2f3396a4df9f54cc6a767934';
export const PENPOT_TREE = 'b5cc94d35586f34554e8873e3a4380111057116d';
export const COMPONENT_DECODER_TREE = 'c2af02d0796f91b7510422db9b9e6179c70f606e';
export const DECODER_MANIFEST_SHA = 'f7740f7f533c3f0cda5d4d0b8ebe98b565d7f521368b96462daecbd26522d5cc';
export const BEHAVIORAL_MANIFEST_SHA = 'c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1';
export const OLD_RECEIPT_SHA = 'd84f55217fbd0745334f81a737acaedc171231a053ae57f28278cf41db67df8e';
export const RECEIPT_PATH = 'receipts/normalization/event-media-blocker-closure-v1.json';
export const FINAL_STATUS = 'EVENT_MEDIA_BLOCKER_CLOSURE_INCOMPLETE';
export const BRANCH = 'normalization/event-media-blocker-closure-v1';
export const PR_NUMBER = 33;
export const PR_URL = 'https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/33';

const DECODER = 'catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc';
const BEHAVIOR = 'catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc';
const PACK = 'prototypes/event-media-decision-pack';
const FILES = Object.freeze({
  sourceBlockers: 'catalog/normalization/event-media/blocker-closure.jsonl',
  consumers: 'catalog/normalization/event-media/consumer-requirement-matrix.jsonl',
  semantics: 'catalog/normalization/event-media/semantic-media-types.jsonl',
  boundaries: 'catalog/normalization/event-media/boundary-model.jsonl',
  ownerQueue: 'catalog/normalization/event-media/owner-decision-queue.jsonl',
  sourceReadiness: 'catalog/normalization/event-media/readiness.jsonl',
  alternatives: 'catalog/normalization/event-media/alternatives-and-recommendations.jsonl',
  derivedBlockers: 'catalog/normalization/event-media/blocker-closure-v1.jsonl',
  cards: 'catalog/normalization/event-media/owner-decisions.jsonl',
  fixtures: 'catalog/normalization/event-media/decision-fixtures.jsonl',
  reviews: 'catalog/normalization/event-media/decision-visual-review-ledger.jsonl',
  readiness: 'catalog/normalization/event-media/readiness-v1.jsonl',
  fixtureProvenance: `${PACK}/fixture-provenance.jsonl`,
  behavioralProvenance: `${PACK}/behavioral-evidence-provenance.jsonl`,
});
export const FROZEN = Object.freeze({
  [FILES.sourceBlockers]: ['22337fc3911fcbfb73be7cfc3045808245d430030a65990dc7209ce83878024f', 12],
  [FILES.consumers]: ['b3f041ad3e64cce6c4690c84a12515fbdef6f8ce649ab85fecc9d03c3d89c009', 52],
  [FILES.semantics]: ['8989734d1057fb3785dbd05403d7803c052de804eb798e3faeb21b56208e81ee', 23],
  [FILES.boundaries]: ['420f2547bc95eddfb6f5374d25c508cb43a3a135f34bd78c0d84bb93a4b6ffec', 31],
  [FILES.ownerQueue]: ['19ca340ef0e8e42717fb1a849875aa8082fe5ccff0ccab15812c3b9db708de39', 2],
  [FILES.sourceReadiness]: ['87bf003c9f9ffc80afcfd361f5a257e1ff56a227d5a41138665c4e6e886a5204', 3],
  [FILES.alternatives]: ['7848ae9dae25763020dcb065879763897e5b31ed74a2343b81e411c6ebe33d0d', 31],
});
export const CANDIDATES = Object.freeze({
  'candidate.event-primary-media': ['catalog/normalization/event-media/candidate-contracts/candidate.event-primary-media.json', 'a5e7186be9051ac8861b2223576480215add941520141052941ed2542aaba76d'],
  'candidate.event-media-viewer': ['catalog/normalization/event-media/candidate-contracts/candidate.event-media-viewer.json', 'f1983b68fecdf715cd176a3ef5b4229936aad71bec420f91582beec4bed6375a'],
  'candidate.event-fallback-art': ['catalog/normalization/event-media/candidate-contracts/candidate.event-fallback-art.json', '41a0812f606522c7ee5985ca63dd654645d03bb78ab4b2355281eb6255177b61'],
});
export const OWNER_IDS = Object.freeze(['EM-CENSUS-001', 'EM-GOV-010', 'EM-LABRAIL-011']);
export const OPEN_IDS = Object.freeze(['EM-RATIO-002', 'EM-SEMANTIC-003', 'EM-CROP-004', 'EM-TINY-005', 'EM-FALLBACK-006', 'EM-LAYOUT-007', 'EM-RESP-008', 'EM-RUNTIME-009', 'EM-PROVENANCE-012']);
export const ALL_BLOCKER_IDS = Object.freeze(['EM-CENSUS-001', 'EM-RATIO-002', 'EM-SEMANTIC-003', 'EM-CROP-004', 'EM-TINY-005', 'EM-FALLBACK-006', 'EM-LAYOUT-007', 'EM-RESP-008', 'EM-RUNTIME-009', 'EM-GOV-010', 'EM-LABRAIL-011', 'EM-PROVENANCE-012']);
export const CHECK_IDS = Object.freeze(['entity_kind_component_identity','semantic_role_contract','explicit_non_goals','requirement_provenance_reconciled','identity_boundary','anatomy_contract','content_model_contract','implementation_membership','consumer_application_census','route_surface_context','state_event_contract','responsive_container_contract','accessibility_contract','runtime_visual_reconciliation','operational_finding_closure','unresolved_decision_blockers_absent','candidate_contract_review','migration_and_rollback','evidence_refs_exist','media_consumer_policy','loading_recovery','experiment_decision','product_model_dependency']);
export const TERMINAL_STATUSES = Object.freeze(['resolved_by_existing_evidence','resolved_by_targeted_capture','invalidated','owner_decision_required','still_open_with_exact_missing_evidence']);
export const VIEWPORTS = Object.freeze(['desktop-1440x1024', 'mobile-390x844']);

export const shaBuffer = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
export const stable = (value) => `${JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a],[b]) => a.localeCompare(b))) : item, 2)}\n`;
export const sameArray = (a, b) => JSON.stringify(a) === JSON.stringify(b);
export const sameSet = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
export const gitCommand = (root, args) => childProcess.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 }).trim();
const abs = (root, relative) => path.join(root, relative);
const read = (root, relative) => fs.readFileSync(abs(root, relative));
const sha = (root, relative) => shaBuffer(read(root, relative));
const json = (root, relative) => JSON.parse(read(root, relative).toString('utf8'));
export const jsonl = (root, relative) => {
  const lines = read(root, relative).toString('utf8').split('\n');
  if (lines.at(-1) === '') lines.pop();
  demand(lines.length > 0 && lines.every(Boolean), 'EMC_JSONL_BLANK', 'schema', relative, '/', 'JSONL must be non-empty with no blank records');
  return lines.map((line, index) => {
    let row;
    try { row = JSON.parse(line); } catch (error) { reject('EMC_JSONL_PARSE', 'schema', relative, `/${index}`, error.message); }
    demand(JSON.stringify(row, Object.keys(row).sort()) !== '', 'EMC_JSONL_INVALID', 'schema', relative, `/${index}`, 'row is not serializable');
    return row;
  });
};
const unique = (values, code, record, pointer = '/') => demand(values.length === new Set(values).size, code, 'join', record, pointer, 'duplicate stable identity');
const requireFalse = (row, fields, record) => fields.forEach((field) => demand(row[field] === false, 'EMC_STOP_ESCAPE', 'stop', record, `/${field}`, `${field} must remain false`));
const validateProductStop = (row, record) => {
  demand(row.product_value_gate_mode === 'observe' && row.value_evidence_status === 'pending_product_model' && row.promotion_ready === false, 'EMC_PRODUCT_VALUE_ESCAPE', 'product-value', record, '/', 'Product Value must remain observe/pending_product_model/promotion false');
  demand(row.decision === 'NOT_MERGED' && (!Object.hasOwn(row, 'experiment_decision') || row.experiment_decision === 'NOT_MERGED'), 'EMC_EXPERIMENT_ESCAPE', 'stop', record, '/', 'decision and experiment must remain NOT_MERGED');
};

export const allowedChangedPath = (relative) => [
  /^\.codex\/integration\/event-media-blocker-closure-v1\//u,
  /^\.codex\/lanes\/event-media-blocker-(evidence|readiness|validation)\//u,
  /^\.codex\/lanes\/event-media-(owner-decisions|visual-pack)\//u,
  /^\.github\/workflows\/event-media-blocker-closure-v1\.yml$/u,
  /^\.github\/workflows\/event-media-contract-decision-v1\.yml$/u,
  /^catalog\/normalization\/event-media\/(blocker-closure-v1|owner-decisions|decision-fixtures|decision-visual-review-ledger|readiness-v1)\.jsonl$/u,
  /^contracts\/normalization\/event-media-blocker-closure-[^/]+\.json$/u,
  /^docs\/normalization\/event-media-(blocker-closure-v1|owner-decision-pack)\.md$/u,
  /^prototypes\/event-media-decision-pack\//u,
  /^receipts\/normalization\/event-media-blocker-closure-v1\.json$/u,
  /^scripts\/event-media-blocker-closure-v1\//u,
  /^scripts\/(?:validate-event-media-blocker-closure-v1|build-event-media-blocker-closure-v1-receipt)\.mjs$/u,
  /^scripts\/validate-project-normalization-synthesis-v1-1\.mjs$/u,
  /^tests\/event-media-blocker-closure-v1-[^/]+\.mjs$/u,
].some((pattern) => pattern.test(relative));

export const validateChangedPaths = (paths) => {
  unique(paths, 'EMC_CHANGED_PATH_DUPLICATE', 'changed-paths');
  for (const relative of paths) {
    demand(!relative.startsWith('penpot/'), 'EMC_PENPOT_MUTATION', 'stop', relative, '/', 'Penpot is protected');
    demand(!/(^|\/)site\/(src|public)(\/|$)/u.test(relative), 'EMC_PRODUCTION_MUTATION', 'stop', relative, '/', 'production site source/public is protected');
    if (relative.startsWith('prototypes/')) demand(relative.startsWith(`${PACK}/`), 'EMC_NONPACK_PROTOTYPE_MUTATION', 'stop', relative, '/', 'only the decision-pack prototype subtree is authorized');
    demand(allowedChangedPath(relative), 'EMC_FORBIDDEN_PATH_CHANGED', 'stop', relative, '/', 'path is outside the blocker-closure allowlist');
  }
};

const validateGitAndImmutable = (root, eventsRoot, fixtureMode) => {
  for (const [relative, [expected, count]] of Object.entries(FROZEN)) {
    demand(sha(root, relative) === expected, 'EMC_FROZEN_CORPUS_DRIFT', 'immutable', relative, '/', `frozen PR #32 hash differs: ${relative}`);
    demand(jsonl(root, relative).length === count, 'EMC_FROZEN_CORPUS_COUNT', 'immutable', relative, '/', `frozen PR #32 count differs: ${relative}`);
  }
  for (const [candidate, [relative, expected]] of Object.entries(CANDIDATES)) {
    demand(sha(root, relative) === expected, 'EMC_FROZEN_CANDIDATE_DRIFT', 'immutable', candidate, '/', 'frozen PR #32 candidate hash differs');
  }
  demand(sha(root, 'receipts/normalization/event-media-contract-decision-v1.json') === OLD_RECEIPT_SHA, 'EMC_FROZEN_RECEIPT_DRIFT', 'immutable', 'PR32-receipt', '/', 'frozen PR #32 receipt changed');
  demand(sha(root, `${DECODER}/manifest.json`) === DECODER_MANIFEST_SHA, 'EMC_DECODER_DRIFT', 'immutable', 'decoder-v1', '/', 'Decoder manifest changed');
  demand(sha(root, `${BEHAVIOR}/manifest.json`) === BEHAVIORAL_MANIFEST_SHA, 'EMC_BEHAVIORAL_DRIFT', 'immutable', 'behavioral-v1.1', '/', 'Behavioral manifest changed');
  if (fixtureMode) return;
  demand(gitCommand(root, ['status', '--porcelain']) === '', 'EMC_DESIGN_DIRTY', 'immutable', 'design', '/', 'design checkout must be clean');
  demand(gitCommand(root, ['rev-parse', `${MERGED_MAIN}^1`]) === MERGE_PARENT_1 && gitCommand(root, ['rev-parse', `${MERGED_MAIN}^2`]) === MERGE_PARENT_2, 'EMC_MERGE_PARENT_DRIFT', 'lineage', MERGED_MAIN, '/', 'PR #32 merge parents differ');
  try { gitCommand(root, ['merge-base', '--is-ancestor', MERGED_MAIN, 'HEAD']); } catch { reject('EMC_MAIN_NOT_ANCESTOR', 'lineage', 'HEAD', '/', 'merged PR #32 main is not an ancestor'); }
  demand(gitCommand(root, ['rev-parse', 'HEAD:penpot']) === PENPOT_TREE, 'EMC_PENPOT_MUTATION', 'stop', 'penpot', '/', 'Penpot tree changed');
  demand(gitCommand(root, ['rev-parse', 'HEAD:catalog/component-decoder']) === COMPONENT_DECODER_TREE, 'EMC_DECODER_TREE_DRIFT', 'immutable', 'catalog/component-decoder', '/', 'component decoder tree changed');
  const changed = gitCommand(root, ['diff', '--name-only', `${MERGED_MAIN}...HEAD`, '--']).split('\n').filter(Boolean);
  const untracked = gitCommand(root, ['ls-files', '--others', '--exclude-standard']).split('\n').filter(Boolean);
  validateChangedPaths([...new Set([...changed, ...untracked])]);
  demand(eventsRoot, 'EMC_EVENTS_ROOT_REQUIRED', 'immutable', 'events-bot-new', '/', '--events-repo is required');
  demand(gitCommand(eventsRoot, ['rev-parse', 'HEAD']) === EVENTS_SHA, 'EMC_EVENTS_HEAD_DRIFT', 'immutable', 'events-bot-new', '/HEAD', 'events evidence checkout differs');
  demand(gitCommand(eventsRoot, ['rev-parse', 'HEAD^{tree}']) === EVENTS_TREE, 'EMC_EVENTS_TREE_DRIFT', 'immutable', 'events-bot-new', '/', 'events evidence tree differs');
  demand(gitCommand(eventsRoot, ['rev-parse', 'HEAD:site/src']) === EVENTS_SITE_SRC_TREE && gitCommand(eventsRoot, ['rev-parse', 'HEAD:site/public']) === EVENTS_SITE_PUBLIC_TREE, 'EMC_EVENTS_PRODUCTION_DRIFT', 'immutable', 'events-bot-new', '/', 'events site/src or site/public differs');
  demand(gitCommand(eventsRoot, ['status', '--porcelain']) === '', 'EMC_EVENTS_DIRTY', 'immutable', 'events-bot-new', '/', 'events evidence checkout must be clean');
};

const pngDimensions = (buffer, record) => {
  demand(buffer.length >= 24 && buffer.subarray(1,4).toString('ascii') === 'PNG', 'EMC_PNG_INVALID', 'visual', record, '/', 'invalid PNG bytes');
  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
};

const validateBlockers = (root, consumers) => {
  const sourceLines = read(root, FILES.sourceBlockers).toString('utf8').trimEnd().split('\n');
  const source = sourceLines.map(JSON.parse);
  const rows = jsonl(root, FILES.derivedBlockers);
  demand(rows.length === 12, 'EMC_DERIVED_BLOCKER_COUNT', 'cardinality', FILES.derivedBlockers, '/', 'expected exactly 12 derived blockers');
  demand(sameArray(rows.map((r) => r.blocker_id), ALL_BLOCKER_IDS), 'EMC_BLOCKER_ORDER', 'join', FILES.derivedBlockers, '/', 'derived blocker identity/order differs');
  const consumerIds = new Set(consumers.map((r) => r.id));
  rows.forEach((row, index) => {
    const old = source[index];
    const record = row.blocker_id;
    for (const field of ['blocker_id','order','family_id','dimension','source_blocker_ref','source_text','required_evidence','source_evidence_ref_ids','affected_consumer_ids']) demand(JSON.stringify(row[field]) === JSON.stringify(old[field]), 'EMC_SOURCE_BLOCKER_JOIN', 'join', record, `/${field}`, `derived blocker differs from frozen source ${field}`);
    demand(row.source_identity.path === FILES.sourceBlockers && row.source_identity.file_sha256 === FROZEN[FILES.sourceBlockers][0] && row.source_identity.row_sha256 === shaBuffer(Buffer.from(sourceLines[index])) && row.source_identity.source_status === old.status && row.source_identity.audited_head_sha === AUDITED_HEAD && row.source_identity.merged_main_sha === MERGED_MAIN, 'EMC_SOURCE_BLOCKER_IDENTITY', 'join', record, '/source_identity', 'derived source identity/hash/status does not bind exact frozen row');
    demand(Array.isArray(row.consumer_application_refs) && row.consumer_application_refs.length > 0 && row.consumer_application_refs.every((id) => consumerIds.has(id)), 'EMC_CONSUMER_REF_JOIN', 'join', record, '/consumer_application_refs', 'affected application reference is unresolved');
    unique(row.consumer_application_refs, 'EMC_CONSUMER_REF_DUPLICATE', record, '/consumer_application_refs');
    demand(TERMINAL_STATUSES.includes(row.terminal_status), 'EMC_TERMINAL_STATUS_ENUM', 'closure', record, '/terminal_status', 'unknown terminal disposition');
    validateProductStop(row, record);
    requireFalse(row, ['candidate_contract_accepted','field_presence_closes_blocker','final_media_tokens_created','migration_started','normalization_allowed','penpot_mutation_performed','physical_ui_change_authorized','production_state_claimed','promotion_ready'], record);
    demand(Array.isArray(row.evidence_findings) && row.evidence_findings.length > 0, 'EMC_EVIDENCE_FINDINGS_EMPTY', 'closure', record, '/evidence_findings', 'evidence findings are required');
    for (const [i, finding] of row.evidence_findings.entries()) {
      demand(/^[a-f0-9]{40}$/u.test(finding.commit) && typeof finding.ref === 'string' && finding.ref.length > 0 && typeof finding.finding === 'string' && finding.finding.length > 0 && typeof finding.limitation === 'string' && finding.limitation.length > 0, 'EMC_EVIDENCE_FINDING_INCOMPLETE', 'closure', record, `/evidence_findings/${i}`, 'finding lacks commit/ref/finding/limitation');
      demand(Array.isArray(finding.consumer_application_refs) && finding.consumer_application_refs.length > 0 && finding.consumer_application_refs.every((id) => consumerIds.has(id)), 'EMC_EVIDENCE_CONSUMER_JOIN', 'join', record, `/evidence_findings/${i}/consumer_application_refs`, 'finding consumer reference unresolved');
    }
    const satisfying = row.evidence_findings.filter((f) => f.satisfies_required_evidence === true);
    const closed = ['resolved_by_existing_evidence','resolved_by_targeted_capture','invalidated'].includes(row.terminal_status);
    if (closed) {
      demand(row.closure_supported === true && typeof row.closure_receipt_ref === 'string' && row.closure_receipt_ref.length > 0 && row.exact_missing_evidence.length === 0 && satisfying.length > 0, 'EMC_FALSE_CLOSURE', 'closure', record, '/', 'closed blocker lacks direct satisfying evidence, receipt, or has missing facts');
      demand(satisfying.some((f) => ['runtime','behavioral','specimen','targeted_capture'].includes(f.kind)), 'EMC_FALSE_CLOSURE_RUNTIME', 'closure', record, '/evidence_findings', 'closed blocker lacks runtime/specimen evidence');
      if (row.terminal_status === 'resolved_by_targeted_capture') demand(row.targeted_capture?.performed === true && typeof row.targeted_capture?.capture_id === 'string', 'EMC_TARGETED_CAPTURE_MISSING', 'closure', record, '/targeted_capture', 'targeted capture resolution lacks capture identity');
    } else {
      demand(row.closure_supported === false && row.closure_receipt_ref === null && satisfying.length === 0 && Array.isArray(row.exact_missing_evidence) && row.exact_missing_evidence.length > 0 && row.exact_missing_evidence.every((x) => typeof x === 'string' && x.length > 0), 'EMC_OPEN_MISSING_FACTS', 'closure', record, '/', 'open blocker must name exact missing facts and have no satisfying receipt');
      demand(row.targeted_capture?.performed === false && row.targeted_capture?.capture_id === null, 'EMC_OPEN_CAPTURE_ESCAPE', 'closure', record, '/targeted_capture', 'open blocker cannot claim a capture');
    }
    if (old.status === 'owner_decision_required') demand(row.terminal_status === 'owner_decision_required' && row.owner_decision_accepted === false, 'EMC_OWNER_BLOCKER_STATUS', 'closure', record, '/', 'owner blocker was collapsed or accepted');
    else demand(row.terminal_status === 'still_open_with_exact_missing_evidence' && row.owner_question_id === null, 'EMC_EVIDENCE_BLOCKER_STATUS', 'closure', record, '/', 'evidence blocker must remain honestly open in current state');
  });
  demand(sameArray(rows.filter((r) => r.terminal_status === 'owner_decision_required').map((r) => r.blocker_id), OWNER_IDS), 'EMC_OWNER_SET', 'closure', FILES.derivedBlockers, '/', 'exact owner blocker set differs');
  demand(sameArray(rows.filter((r) => r.terminal_status === 'still_open_with_exact_missing_evidence').map((r) => r.blocker_id), OPEN_IDS), 'EMC_OPEN_SET', 'closure', FILES.derivedBlockers, '/', 'exact incomplete evidence blocker set differs');
  return rows;
};

const validateCardsFixtures = (root, blockers, consumers) => {
  const cards = jsonl(root, FILES.cards);
  const fixtures = jsonl(root, FILES.fixtures);
  const queue = jsonl(root, FILES.ownerQueue);
  demand(cards.length === 3 && sameArray(cards.map((c) => c.id), OWNER_IDS.map((id) => `decision.${id}`)), 'EMC_OWNER_CARD_SET', 'owner', FILES.cards, '/', 'exact three separate owner cards required');
  unique(cards.map((c) => c.blocker_id), 'EMC_OWNER_CARD_COLLAPSE', FILES.cards, '/blocker_id');
  const consumerIds = new Set(consumers.map((x) => x.id));
  const options = [];
  cards.forEach((card, index) => {
    const blocker = blockers.find((b) => b.blocker_id === card.blocker_id);
    const question = queue.find((q) => q.question_id === card.source_question_id || q.id === card.source_question_id);
    demand(blocker?.terminal_status === 'owner_decision_required' && card.source_blocker_id === blocker.blocker_id && card.blocker_id === blocker.blocker_id, 'EMC_OWNER_BLOCKER_CARD_JOIN', 'join', card.id, '/', 'card does not bind one exact owner blocker');
    demand(card.order === index + 1 && card.source_statement === blocker.source_text && card.source_closure_condition === blocker.required_evidence && JSON.stringify(card.source_affected_consumer_ids) === JSON.stringify(blocker.affected_consumer_ids), 'EMC_OWNER_SOURCE_JOIN', 'join', card.id, '/', 'card changed exact source question/blocker wording');
    demand(question && card.source_question === question.question && card.owner_question === question.question && card.question === question.question, 'EMC_OWNER_QUESTION_JOIN', 'join', card.id, '/source_question', 'card question does not bind frozen owner queue');
    demand(card.status === 'PENDING_OWNER_DECISION' && card.owner_decision_required === true && card.owner_decision_accepted === false && card.accepted_option_id === null && card.decision_receipt_ref === null, 'EMC_OPTION_SELECTED', 'owner', card.id, '/', 'owner card must remain pending/unselected/unaccepted');
    validateProductStop(card, card.id);
    requireFalse(card, ['candidate_contract_acceptance_authorized','implementation_authorized','migration_started','normalization_allowed','penpot_mutation_performed','physical_operation_authorized','promotion_ready','token_creation_authorized'], card.id);
    demand(Array.isArray(card.affected_consumer_application_refs) && card.affected_consumer_application_refs.length > 0 && card.affected_consumer_application_refs.every((id) => consumerIds.has(id)), 'EMC_CARD_CONSUMER_JOIN', 'join', card.id, '/affected_consumer_application_refs', 'card consumer ref unresolved');
    demand(Array.isArray(card.options) && card.options.length >= 2 && card.options.length <= 4, 'EMC_OPTION_COUNT', 'owner', card.id, '/options', 'owner card must have 2-4 real options');
    const expectedBoard = `${PACK}/screenshots/${card.id}.png`;
    card.options.forEach((option) => {
      demand(typeof option.option_id === 'string' && option.option_id.length > 0, 'EMC_OPTION_ID', 'owner', card.id, '/options', 'option identity missing');
      demand(option.visual_comparison?.visual_board_target === expectedBoard && option.visual_comparison?.annotation_only_difference === true && option.visual_comparison?.same_fixture_bytes_and_state_across_options === true && option.visual_comparison?.intended_production_ui_change === false, 'EMC_OPTION_BOARD_CONTRACT', 'visual', `${card.id}:${option.option_id}`, '/visual_comparison', 'option board or evidence-only contract differs');
      demand(sameArray(option.visual_comparison.viewports, VIEWPORTS), 'EMC_OPTION_VIEWPORT_MISMATCH', 'visual', `${card.id}:${option.option_id}`, '/visual_comparison/viewports', 'option viewports differ');
      demand(option.migration_impact?.migration_started_by_this_card === false, 'EMC_OPTION_MIGRATION_ESCAPE', 'stop', `${card.id}:${option.option_id}`, '/migration_impact', 'option started migration');
      options.push({ card, option });
    });
  });
  unique(options.map(({ option }) => option.option_id), 'EMC_OPTION_ID_DUPLICATE', FILES.cards, '/options');
  demand(options.length === 9, 'EMC_OPTION_TOTAL', 'cardinality', FILES.cards, '/options', 'expected exactly nine pending options');
  demand(fixtures.length === 13 && sameArray(fixtures.map((f) => f.order), [...Array(13)].map((_,i) => i + 1)), 'EMC_FIXTURE_SET', 'cardinality', FILES.fixtures, '/', 'expected exactly 13 ordered fixtures');
  const fixtureIds = fixtures.map((f) => f.id);
  unique(fixtureIds, 'EMC_FIXTURE_ID_DUPLICATE', FILES.fixtures, '/id');
  const optionPairs = options.map(({ card, option }) => [card.id, option.option_id]);
  for (const { card, option } of options) demand(sameArray(option.visual_comparison.fixture_ids, fixtureIds), 'EMC_OPTION_FIXTURE_MISMATCH', 'visual', `${card.id}:${option.option_id}`, '/visual_comparison/fixture_ids', 'option substituted fixture set/order');
  for (const fixture of fixtures) {
    validateProductStop(fixture, fixture.id);
    demand(fixture.decision_pack_only === true && fixture.production_state_claimed === false && fixture.normalization_allowed === false && fixture.redistribution_rights_claimed === false && fixture.license_research_performed === false, 'EMC_FIXTURE_STOP_ESCAPE', 'stop', fixture.id, '/', 'fixture overclaims production/rights/normalization');
    demand(sameArray(fixture.required_viewports.map((v) => v.id), VIEWPORTS), 'EMC_FIXTURE_VIEWPORT_MISMATCH', 'visual', fixture.id, '/required_viewports', 'fixture viewport set differs');
    const reuse = fixture.reuse_contract;
    demand(reuse.same_source_bytes_crop_state_and_viewport_across_options === true && reuse.only_decision_annotation_may_differ_between_options === true, 'EMC_FIXTURE_REUSE_FAILOPEN', 'visual', fixture.id, '/reuse_contract', 'fixture reuse contract is fail-open');
    demand(JSON.stringify(reuse.option_bindings.map((b) => [b.decision_card_id,b.option_id])) === JSON.stringify(optionPairs), 'EMC_FIXTURE_OPTION_BINDING', 'join', fixture.id, '/reuse_contract/option_bindings', 'fixture does not bind exact nine card/options');
    for (const binding of reuse.option_bindings) {
      const expected = [`visual-example.${binding.decision_card_id.slice('decision.'.length)}.${binding.option_id}.desktop`, `visual-example.${binding.decision_card_id.slice('decision.'.length)}.${binding.option_id}.mobile`];
      demand(sameArray(binding.visual_example_ids, expected), 'EMC_VISUAL_EXAMPLE_JOIN', 'join', fixture.id, '/reuse_contract/option_bindings', 'visual example IDs do not bind exact option and viewports');
    }
  }
  return { cards, fixtures, options, fixtureIds };
};

const validateVisual = (root, eventsRoot, fixtureMode, fixtures, cards, options, fixtureIds) => {
  const provenance = jsonl(root, FILES.fixtureProvenance);
  const behavioral = jsonl(root, FILES.behavioralProvenance);
  const reviews = jsonl(root, FILES.reviews);
  demand(provenance.length === 9 && behavioral.length === 9, 'EMC_VISUAL_PROVENANCE_COUNT', 'visual', PACK, '/', 'expected 9 vendored assets and 9 Behavioral bindings');
  unique(provenance.map((r) => r.fixture_id), 'EMC_ASSET_FIXTURE_DUPLICATE', FILES.fixtureProvenance, '/fixture_id');
  unique(behavioral.map((r) => r.path), 'EMC_BEHAVIOR_BINDING_DUPLICATE', FILES.behavioralProvenance, '/path');
  const fixtureSet = new Set(fixtureIds);
  const materialized = fs.readdirSync(abs(root, `${PACK}/fixtures`)).filter((name) => fs.statSync(abs(root, `${PACK}/fixtures/${name}`)).isFile()).map((name) => `${PACK}/fixtures/${name}`).sort();
  demand(materialized.length === 9 && sameSet(materialized, provenance.map((r) => r.path)), 'EMC_VENDORED_ASSET_SET', 'visual', `${PACK}/fixtures`, '/', 'vendored asset files do not bind exact nine provenance rows');
  for (const row of provenance) {
    demand(fixtureSet.has(row.fixture_id), 'EMC_ASSET_FIXTURE_JOIN', 'join', row.fixture_id, '/', 'vendored asset fixture ref unresolved');
    const bytes = read(root, row.path);
    demand(bytes.byteLength === row.bytes && shaBuffer(bytes) === row.raw_sha256, 'EMC_ASSET_BYTE_DRIFT', 'visual', row.fixture_id, '/raw_sha256', 'vendored asset byte/hash differs');
    demand(row.source_commit === EVENTS_SHA && row.decision === 'NOT_MERGED' && row.redistribution_rights_claimed === false && row.license_research_performed === false, 'EMC_ASSET_PROVENANCE_ESCAPE', 'stop', row.fixture_id, '/', 'asset provenance/rights/decision differs');
  }
  const verification = jsonl(root, `${BEHAVIOR}/behavior-page-verification.jsonl`);
  for (const row of behavioral) {
    demand(row.fixture_ids.length > 0 && row.fixture_ids.every((id) => fixtureSet.has(id)) && row.decision === 'NOT_MERGED' && row.review_authority === 'reviewed Behavioral Decoder v1.1 capture', 'EMC_BEHAVIOR_FIXTURE_JOIN', 'join', row.path, '/', 'Behavioral binding fixture/authority differs');
    const match = verification.find((v) => v.screenshot?.path === `behavior-rasters/${row.path}`);
    demand(match && match.screenshot.sha256 === row.sha256 && match.screenshot.bytes === row.bytes && match.review_status === 'reviewed-full-resolution' && match.production_equivalence === false && match.production_observed === false, 'EMC_BEHAVIOR_BINDING_DRIFT', 'visual', row.path, '/', 'Behavioral binding does not match reviewed immutable capture');
  }
  if (!fixtureMode && eventsRoot) {
    const preview = json(eventsRoot, 'site/src/data/preview-events.json');
    const byId = new Map(preview.events.map((e) => [e.id,e]));
    for (const fixture of fixtures) {
      const source = fixture.source;
      if (source.kind === 'pinned_git_blob') {
        demand(sha(eventsRoot, source.path) === source.sha256, 'EMC_PINNED_SOURCE_DRIFT', 'visual', fixture.id, '/source', 'pinned Git blob differs');
      } else if (source.kind === 'pinned_real_event_asset_record') {
        const event = byId.get(source.event_id); const asset = event?.image_assets?.[source.asset_index];
        demand(event?.title === source.event_title && asset?.src === source.src_from_pinned_record && asset?.width === source.width && asset?.height === source.height && asset?.current_pixel_sha256 === source.expected_pixel_sha256, 'EMC_PINNED_EVENT_ASSET_DRIFT', 'visual', fixture.id, '/source', 'pinned real event asset record differs');
      }
    }
  }
  const pngs = [];
  const visit = (relative) => { for (const entry of fs.readdirSync(abs(root, relative), { withFileTypes: true })) { const child = `${relative}/${entry.name}`; if (entry.isDirectory()) visit(child); else if (entry.name.toLowerCase().endsWith('.png')) pngs.push(child); } };
  visit(PACK); pngs.sort();
  demand(pngs.length === 4 && reviews.length === 4 && sameSet(pngs, reviews.map((r) => r.path)), 'EMC_PNG_LEDGER_SET', 'visual', FILES.reviews, '/', 'every and only four prototype PNGs need review rows');
  const optionByCard = new Map(cards.map((c) => [c.id,c.options.map((o) => o.option_id)]));
  for (const row of reviews) {
    const bytes = read(root, row.path); const [width,height] = pngDimensions(bytes, row.path);
    demand(row.bytes === bytes.byteLength && row.sha256 === shaBuffer(bytes) && row.width === width && row.height === height, 'EMC_PNG_LEDGER_DRIFT', 'visual', row.path, '/', 'PNG byte/hash/dimension does not match review ledger');
    demand(row.review_status === 'reviewed-full-resolution' && row.full_resolution_opened === true && typeof row.conclusion === 'string' && row.conclusion.length > 80 && row.decision === 'NOT_MERGED', 'EMC_REVIEW_FAILOPEN', 'visual', row.path, '/', 'PNG lacks substantive full-resolution review');
    demand(sameArray(row.viewport_ids, VIEWPORTS) && row.fixture_ids.every((id) => fixtureSet.has(id)), 'EMC_REVIEW_CONTEXT_JOIN', 'join', row.path, '/', 'review context fixture/viewport unresolved');
    if (row.png_kind === 'decision-board') {
      demand(row.decision_card_ids.length === 1 && sameArray(row.option_ids, optionByCard.get(row.decision_card_ids[0])) && row.path === `${PACK}/screenshots/${row.decision_card_ids[0]}.png` && sameArray(row.fixture_ids, fixtureIds), 'EMC_BOARD_REVIEW_JOIN', 'join', row.path, '/', 'decision board does not bind exact card/options/fixtures');
    }
  }
  const index = read(root, `${PACK}/index.html`).toString('utf8');
  demand(cards.every((c) => index.includes(c.id) && index.includes(c.question) && c.options.every((o) => index.includes(o.option_id))), 'EMC_HTML_CARD_JOIN', 'visual', `${PACK}/index.html`, '/', 'HTML omits exact card/question/option');
  demand(!/https?:\/\//iu.test(index) && ['PENDING_OWNER_DECISION','NOT_MERGED','EVIDENCE ONLY'].every((x) => index.includes(x)), 'EMC_HTML_NETWORK_OR_STATUS', 'visual', `${PACK}/index.html`, '/', 'HTML is not local-only or omits pending evidence status');
  return { provenance, behavioral, reviews, pngs };
};

const validateReadiness = (root, blockers, cards) => {
  const rows = jsonl(root, FILES.readiness);
  const source = jsonl(root, FILES.sourceReadiness);
  const boundaries = jsonl(root, FILES.boundaries);
  demand(rows.length === 3 && sameArray(rows.map((r) => r.subject_id), Object.keys(CANDIDATES)), 'EMC_READINESS_SET', 'readiness', FILES.readiness, '/', 'readiness must bind exact three candidates in order');
  let pass = 0, blocked = 0, na = 0, ready = 0;
  rows.forEach((row, index) => {
    const record = row.subject_id; const [candidatePath,candidateSha] = CANDIDATES[record]; const candidate = json(root, candidatePath); const old = source.find((r) => r.subject_id === record); const boundary = boundaries.find((b) => b.id === row.boundary_ref);
    demand(candidate.candidate_component_id === record && candidate.contract_version === row.candidate_contract_version && row.candidate_contract_version === '0.1.0-candidate' && row.candidate_contract_ref === candidatePath && sha(root,candidatePath) === row.candidate_contract_sha256 && row.candidate_contract_sha256 === candidateSha, 'EMC_READINESS_CANDIDATE_JOIN', 'join', record, '/', 'readiness candidate path/hash/version/identity differs');
    demand(boundary?.entity_kind === 'component_identity_candidate' && boundary.candidate_contract_ref === candidatePath && boundary.id === `event-media.boundary.${record}`, 'EMC_READINESS_BOUNDARY_JOIN', 'join', record, '/boundary_ref', 'readiness boundary/candidate identity differs');
    for (const field of ['open_blocker_refs','owner_decision_blocker_refs','owner_question_refs']) demand(sameArray(row[field], old[field]), 'EMC_READINESS_FROZEN_PROJECTION', 'join', record, `/${field}`, `readiness ${field} differs from frozen candidate relevance`);
    const expectedAll = ALL_BLOCKER_IDS.filter((id) => row.open_blocker_refs.includes(id) || row.owner_decision_blocker_refs.includes(id));
    demand(sameArray(row.blocker_closure_refs, expectedAll), 'EMC_READINESS_BLOCKER_JOIN', 'join', record, '/blocker_closure_refs', 'readiness blocker union/order is not recomputed');
    demand(row.open_blocker_refs.every((id) => blockers.find((b) => b.blocker_id === id)?.terminal_status === 'still_open_with_exact_missing_evidence') && row.owner_decision_blocker_refs.every((id) => blockers.find((b) => b.blocker_id === id)?.terminal_status === 'owner_decision_required'), 'EMC_READINESS_TERMINAL_JOIN', 'join', record, '/blocker_closure_refs', 'readiness blockers do not match terminal dispositions');
    demand(row.owner_decision_blocker_refs.every((id) => cards.find((c) => c.blocker_id === id)?.status === 'PENDING_OWNER_DECISION'), 'EMC_READINESS_OWNER_JOIN', 'join', record, '/owner_decision_blocker_refs', 'readiness owner blocker lacks pending card');
    demand(row.checklist.length === 23 && sameArray(row.checklist.map((c) => c.check_id), CHECK_IDS), 'EMC_READINESS_CHECK_SET', 'readiness', record, '/checklist', 'exact ordered 23 positive checks required');
    row.checklist.forEach((check) => { demand(['PASS','BLOCKED','NOT_APPLICABLE_WITH_REASON'].includes(check.status) && Array.isArray(check.evidence_refs) && check.evidence_refs.length > 0 && typeof check.assertion === 'string' && check.assertion.length > 0, 'EMC_READINESS_CHECK_FAILOPEN', 'readiness', record, `/checklist/${check.check_id}`, 'check has invalid status or empty positive evidence'); if (check.status === 'PASS') pass++; else if (check.status === 'BLOCKED') blocked++; else na++; });
    const reasonCodes = row.checklist.filter((c) => c.status === 'BLOCKED').map((c) => `check-blocked:${c.check_id}`);
    demand(sameArray(row.not_ready_reason_codes, reasonCodes), 'EMC_READINESS_REASON_JOIN', 'join', record, '/not_ready_reason_codes', 'not-ready reasons do not equal blocked positive checks');
    const canBeReady = row.checklist.every((c) => c.status !== 'BLOCKED') && row.open_blocker_refs.length === 0 && row.owner_decision_blocker_refs.length === 0;
    if (canBeReady) demand(row.status === 'READY_FOR_OWNER_CONTRACT_DECISION' && row.strict_ready === true, 'EMC_READINESS_RESULT', 'readiness', record, '/status', 'fully positive candidate must use only allowed ready status');
    else demand(row.status === 'NOT_READY_WITH_EXACT_BLOCKERS' && row.strict_ready === false, 'EMC_READINESS_FAILOPEN', 'readiness', record, '/status', 'blocked candidate cannot become ready');
    if (row.status === 'READY_FOR_OWNER_CONTRACT_DECISION') ready++;
    validateProductStop(row, record);
    requireFalse(row, ['candidate_contract_accepted','canonical','eligible_for_scoring','migration_started','normalization_allowed','penpot_materialization_authorized','penpot_mutation_performed','physical_operation_authorized','promotion_ready','selected_first_wave','strict_ready'], record);
    for (const field of ['need_ids','job_ids','journey_ids','capability_ids','outcome_ids','metric_ids','guardrail_ids']) demand(Array.isArray(row[field]) && row[field].length === 0, 'EMC_PRODUCT_ID_INVENTED', 'product-value', record, `/${field}`, 'Product Value IDs must not be invented');
    demand(row.score === null && row.surface_archetype_id === null && row.penpot_binding === null && row.promotion_receipt_ref === null && row.decision_receipt_ref === null, 'EMC_STOP_ID_ESCAPE', 'stop', record, '/', 'scoring/archetype/Penpot/receipt must remain null');
  });
  demand(pass === 33 && blocked === 33 && na === 3 && ready === 0, 'EMC_READINESS_COUNTS', 'readiness', FILES.readiness, '/', `expected 33 PASS / 33 BLOCKED / 3 N/A and 0 ready; got ${pass}/${blocked}/${na}/${ready}`);
  return { rows, pass, blocked, na, ready };
};

export const collectAndValidate = ({ root = '.', eventsRoot = null, fixtureMode = false } = {}) => {
  const design = path.resolve(root); const events = eventsRoot ? path.resolve(eventsRoot) : null;
  validateGitAndImmutable(design, events, fixtureMode);
  const consumers = jsonl(design, FILES.consumers);
  const blockers = validateBlockers(design, consumers);
  const owner = validateCardsFixtures(design, blockers, consumers);
  const visual = validateVisual(design, events, fixtureMode, owner.fixtures, owner.cards, owner.options, owner.fixtureIds);
  const readiness = validateReadiness(design, blockers, owner.cards);
  const experiments = jsonl(design, `${BEHAVIOR}/experiment-registry.jsonl`);
  demand(experiments.length === 6 && experiments.every((x) => x.decision === 'NOT_MERGED' && x.winner_decision_receipt === 'absent'), 'EMC_EXPERIMENT_REGISTRY_ESCAPE', 'stop', 'experiments', '/', 'six experiments must remain NOT_MERGED without winner receipt');
  return {
    final_status: FINAL_STATUS,
    facts: {
      source_blockers: 12, owner_blockers: 3, incomplete_evidence_blockers: 9,
      incomplete_blocker_ids: [...OPEN_IDS],
      incomplete_missing_facts: Object.fromEntries(blockers.filter((b) => OPEN_IDS.includes(b.blocker_id)).map((b) => [b.blocker_id,b.exact_missing_evidence])),
      consumers: 52, semantic_records: 23, boundaries: 31, candidates: 3,
      decision_cards: owner.cards.length, options: owner.options.length, fixtures: owner.fixtures.length,
      vendored_assets: visual.provenance.length, behavioral_bindings: visual.behavioral.length,
      pngs: visual.pngs.length, full_resolution_reviews: visual.reviews.length,
      readiness_rows: readiness.rows.length, readiness_checks: readiness.rows.length * 23,
      readiness_pass: readiness.pass, readiness_blocked: readiness.blocked, readiness_not_applicable: readiness.na,
      ready_candidates: readiness.ready, not_ready_candidates: readiness.rows.length - readiness.ready,
      experiments_not_merged: experiments.length,
    },
  };
};

export const outputRecordCount = (root, relative) => relative.endsWith('.jsonl') ? read(root, relative).toString('utf8').split('\n').filter(Boolean).length : null;
export const fileEntry = (root, relative) => { const bytes = read(root, relative); return { bytes: bytes.byteLength, sha256: shaBuffer(bytes), records: outputRecordCount(root, relative) }; };
export const currentOutputPaths = (root, materializationParent = 'HEAD') => {
  const committed = gitCommand(root, ['diff', '--name-only', `${MERGED_MAIN}...${materializationParent}`, '--']).split('\n').filter(Boolean);
  const untracked = materializationParent === 'HEAD' ? gitCommand(root, ['ls-files', '--others', '--exclude-standard']).split('\n').filter(Boolean) : [];
  const paths = [...new Set([...committed,...untracked])].sort().filter((p) => p !== RECEIPT_PATH);
  validateChangedPaths(paths);
  demand(paths.length > 0, 'EMC_RECEIPT_OUTPUT_EMPTY', 'receipt', RECEIPT_PATH, '/outputs', 'receipt output set is empty');
  for (const relative of paths) demand(fs.existsSync(abs(root, relative)) && fs.statSync(abs(root, relative)).isFile(), 'EMC_RECEIPT_OUTPUT_MISSING', 'receipt', relative, '/', 'output file missing');
  return paths;
};
