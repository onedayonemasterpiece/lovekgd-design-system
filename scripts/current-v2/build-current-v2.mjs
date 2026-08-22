#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const outRoot = join(root, 'catalog/ui-components/event-card-large/current-v2');
const corpusRoot = join(root, 'catalog/fixtures/ui-reference-events/v1');
const sourceCases = join(corpusRoot, 'cases');
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const penpotReadback = read(join(outRoot, 'penpot-readback/source-readback.rev1408.json'));
const normalizeReadbackCaseId = (id) => id.replace('-event-detail-related-desktop', '-desktop');
const stableValue = (v) => Array.isArray(v) ? v.map(stableValue) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, stableValue(v[k])])) : v;
const digest = (v) => createHash('sha256').update(`${JSON.stringify(stableValue(v))}\n`).digest('hex');
const write = (p, v) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, `${JSON.stringify(v, null, 2)}\n`); };
const DESIGN_SHA = '0882917a1328607c498d82e4c2a652bbd3df946d';
const ASTRO_SHA = '22ebe3c5e92b13684cca32c14357ef7b91834977';
const EVENTS_TOOLING_SHA = '713a035a8aaa9ecfdcdd5fbd817fe504160df2f5';
const corpus = read(join(corpusRoot, 'corpus.json'));
const assets = read(join(corpusRoot, 'assets-manifest.json'));
const sourceNames = [
  'event-card-large-landscape-crop-safe-7906-desktop.case.json',
  'event-card-large-portrait-poster-8156-desktop.case.json',
  'event-card-large-multi-image-6628-desktop.case.json',
  'event-card-large-ocr-protected-4327-desktop.case.json',
  'event-card-large-landscape-crop-safe-7906-mobile-390.case.json',
  'event-card-large-portrait-poster-8156-mobile-390.case.json',
  'event-card-large-ocr-protected-4327-mobile-390.case.json',
];
const chipRows = [
  ['event.real.3132','концерт','1500 ₽','17 октября 20:00',2,0,'present'],
  ['event.real.4327','выставка','Бесплатно · вход свободный','10 апреля',0,0,'absent'],
  ['event.real.6399','концерт','1000 ₽','21 октября 20:00',2,0,'present'],
  ['event.real.6628','выставка','Билеты','10 июля 19:00',5,0,'absent'],
  ['event.real.7807','лекция','Бесплатно · регистрация','22 августа 12:00',10,0,'present'],
  ['event.real.7888','выставка','Условия уточняются','22 августа',53,5,'absent'],
  ['event.real.7906','концерт','1000 ₽','22 августа 18:00',37,0,'present'],
  ['event.real.8156','выставка','Запись по телефону','21 августа',6,0,'absent'],
];
const contractCore = {
  schema_version: 'event_card_large_current_v2_contract.v1',
  component_id: 'event.card',
  contract_version: 'event-card-large.current-v2.1',
  lifecycle: 'staging-v2-not-promoted',
  authority: 'astro-reference-with-owner-approved-penpot-framing-deltas',
  design_source_sha: DESIGN_SHA,
  astro_source_sha: ASTRO_SHA,
  events_tooling_sha: EVENTS_TOOLING_SHA,
  corpus_sha256: corpus.corpus_sha256,
  asset_manifest_sha256: assets.assets_manifest_sha256,
  semantic_components: {
    event_type: { component_id: 'event.meta.event-type', value_model: 'content-override', arbitrary_nonempty_text: true },
    admission: { component_id: 'event.meta.admission', value_model: 'content-override', arbitrary_nonempty_text: true },
    occurrence: { semantic_target: 'event.meta.occurrence', value_model: 'content-override', arbitrary_nonempty_text: true, penpot_materialization_status: 'missing', gap_priority: 'P1' },
    like: { component_id: 'event.social-proof.like', states: ['count-absent','count-positive'] },
    share: { component_id: 'event.social-proof.share', states: ['count-absent','count-positive'] },
    calendar: { component_id: 'event.action.calendar', states: ['present','absent'] },
    not_interested: { component_id: 'event.action.not-interested', fixed_label: 'Не интересно' },
  },
  content_rule: 'Text labels are overrides on semantic masters; a label string never creates a component family.',
  forbidden: ['fixture-specific-geometry-override','mutable-git-ref','nonterminal-current-case','silent-evidence-substitution'],
};
const contract = { ...contractCore, contract_sha256: digest(contractCore) };
write(join(outRoot, 'component-contract.json'), contract);

const desktopBindings = {
  'event.real.7906': { shape_id:'b0fe69fd-ccaf-8025-8008-847103865879', export_sha256:'5336cf8b0b21770445a8107d19367e76c564f50d6caefd49c21b9030364d8478' },
  'event.real.8156': { shape_id:'b0fe69fd-ccaf-8025-8008-84710493a8c8', export_sha256:'7a9c41e44a9e7eb9c1ca5087c9c6984cf904415e37406b7678bd835ce2c33a6d' },
  'event.real.6628': { shape_id:'b0fe69fd-ccaf-8025-8008-8471057ed23a', export_sha256:'b549994d8b8e61a1627c1ad3520d71b56e6d6f8e675a81c6b72df7b49545c8d4' },
  'event.real.4327': { shape_id:'b0fe69fd-ccaf-8025-8008-84710768100c', export_sha256:'2827216bc7c3328d687eb139a1a822e95698b07594961e6a89fcb561652ef41f' },
};
const desktopContextCases = Object.fromEntries(['event-card-large-landscape-crop-safe-7906-event-detail-related-desktop.case.json','event-card-large-portrait-poster-8156-event-detail-related-desktop.case.json','event-card-large-multi-image-6628-event-detail-related-desktop.case.json','event-card-large-ocr-protected-4327-event-detail-related-desktop.case.json'].map((name)=>{const row=read(join(root,'catalog/ui-components/event-card-large/archetype-context-v1/cases',name));return[row.fixture_id,row];}));
const registryRows = [];
const telegramRows = [];
const batchRows = [];
for (const sourceName of sourceNames) {
  const source = read(join(sourceCases, sourceName));
  const fixture = corpus.fixtures.find((f) => f.fixture_id === source.fixture_id);
  if (!fixture) throw new Error(`fixture absent: ${source.fixture_id}`);
  const isDesktop = source.viewport_id === 'desktop-1280';
  const contextCase = isDesktop ? desktopContextCases[source.fixture_id] : null;
  const exportBinding = isDesktop ? { ...source.penpot_binding, ...desktopBindings[source.fixture_id], revision:1316 } : { ...source.penpot_binding, revision:null };
  const exportRevisionStatus = isDesktop ? 'verified_exact' : 'unknown_historical_verified_hash';
  const historicalMaterializationLabel = isDesktop ? null : source.penpot_binding.revision;
  const id = source.case_id;
  const penpotFacts = penpotReadback.cases.find((row) => normalizeReadbackCaseId(row.case_id) === id);
  if (!penpotFacts || penpotFacts.status !== 'found') throw new Error(`current Penpot read-back absent: ${id}`);
  const penpotFactsCore = { schema_version:'event_card_large_penpot_structural_facts.v1', case_id:id, file_id:penpotReadback.file_id, file_revision:penpotReadback.file_revision, captured_at:penpotReadback.captured_at, page_id:penpotFacts.page_id, shape_id:penpotFacts.shape_id, status:penpotFacts.status, root:penpotFacts.root, node_count:penpotFacts.node_count, text_nodes:penpotFacts.text_nodes, semantic_nodes:penpotFacts.semantic_nodes };
  const normalizedPenpotFacts = { ...penpotFactsCore, facts_sha256:digest(penpotFactsCore) };
  write(join(outRoot, 'penpot-readback', `${id}.facts.json`), normalizedPenpotFacts);
  const readbackReceipt = { schema_version:'event_card_large_penpot_structural_readback_receipt.v1', case_id:id, contract_sha256:contract.contract_sha256, file_id:penpotReadback.file_id, page_id:penpotFacts.page_id, shape_id:penpotFacts.shape_id, file_revision:penpotReadback.file_revision, captured_at:penpotReadback.captured_at, facts_sha256:normalizedPenpotFacts.facts_sha256, export_status:'blocked_no_hash_bound_export_at_revision', last_known_export_sha256:exportBinding.export_sha256 };
  write(join(outRoot, 'penpot-readback', `${id}.receipt.json`), readbackReceipt);
  const resolvedCore = {
    schema_version: 'event_card_large_current_v2_resolved_case.v1',
    case_id: id,
    component_id: 'event.card',
    contract_sha256: contract.contract_sha256,
    design_sha: DESIGN_SHA,
    astro_sha: ASTRO_SHA,
    events_tooling_sha: EVENTS_TOOLING_SHA,
    corpus_sha256: corpus.corpus_sha256,
    fixture_id: source.fixture_id,
    fixture_sha256: source.fixture_sha256,
    fixture_snapshot_sha256: source.fixture_snapshot_sha256,
    asset_manifest_sha256: source.asset_manifest_sha256,
    source_resolved_render_case_sha256: contextCase?.resolved_render_case_sha256 || source.resolved_render_case_sha256,
    viewport: { id: source.viewport_id, width: source.viewport_width, height: source.viewport_height, container_width: isDesktop ? 380 : source.container_width, parent_container_width: isDesktop ? 1180 : null, device_scale_factor: source.device_scale_factor },
    state_key: contextCase?.state_key || source.state_key,
  };
  const resolved = { ...resolvedCore, resolved_case_sha256: digest(resolvedCore) };
  write(join(outRoot, 'resolved', `${id}.resolved.json`), resolved);
  const cacheTuple = {
    file_id: source.penpot_binding.file_id,
    page_id: penpotFacts.page_id,
    shape_id: isDesktop ? desktopBindings[source.fixture_id].shape_id : penpotFacts.shape_id,
    revision: exportBinding.revision,
    export_revision_status: exportRevisionStatus,
    contract_sha256: contract.contract_sha256,
    resolved_case_sha256: resolved.resolved_case_sha256,
  };
  const caseRow = {
    schema_version: 'event_card_large_current_v2_case.v1',
    case_id: id,
    component_id: 'event.card',
    lifecycle_status: 'active_blocked',
    contract_sha256: contract.contract_sha256,
    design_sha: DESIGN_SHA,
    astro_sha: ASTRO_SHA,
    events_tooling_sha: EVENTS_TOOLING_SHA,
    corpus_sha256: corpus.corpus_sha256,
    fixture_id: source.fixture_id,
    fixture_sha256: source.fixture_sha256,
    fixture_snapshot_sha256: source.fixture_snapshot_sha256,
    asset_manifest_sha256: source.asset_manifest_sha256,
    resolved_case_sha256: resolved.resolved_case_sha256,
    resolved_case_path: `resolved/${id}.resolved.json`,
    viewport: resolved.viewport,
    state_key: source.state_key,
    current_penpot_structural_readback: { status:'verified_found', file_revision:penpotReadback.file_revision, page_id:penpotFacts.page_id, shape_id:penpotFacts.shape_id, facts_sha256:normalizedPenpotFacts.facts_sha256, facts_path:`penpot-readback/${id}.facts.json` },
    penpot_binding: {
      binding_status: 'bound', file_id: source.penpot_binding.file_id, page_id: penpotFacts.page_id,
      shape_id: isDesktop ? desktopBindings[source.fixture_id].shape_id : penpotFacts.shape_id, revision: exportBinding.revision,
      export_revision_status: exportRevisionStatus, metadata_readback_revision: penpotReadback.file_revision, historical_materialization_label: historicalMaterializationLabel,
      export_sha256: exportBinding.export_sha256, contract_sha256: contract.contract_sha256,
      metadata_readback_status: 'blocked_requires_current_v2_verified_readback', cache_key_sha256: digest(cacheTuple), cache_tuple: cacheTuple,
    },
    astro_binding: { binding_status: 'source_bound_capture_blocked', repository_sha: ASTRO_SHA, route: source.astro_binding.specimen_route, root_selector: source.astro_binding.root_selector },
    evidence_status: 'blocked_missing_durable_pack',
    evidence_manifest_path: `../../../../../../evidence/ui-conformance/event-card-large/current-v2/${id}/durable-evidence-manifest.json`,
  };
  write(join(outRoot, 'cases', `${id}.case.json`), caseRow);
  const receipt = {
    schema_version: 'event_card_large_current_v2_final_receipt.v1', case_id: id, contract_sha256: contract.contract_sha256,
    design_sha: DESIGN_SHA, astro_sha: ASTRO_SHA, events_tooling_sha: EVENTS_TOOLING_SHA, corpus_sha256: corpus.corpus_sha256,
    fixture_sha256: source.fixture_sha256, asset_manifest_sha256: source.asset_manifest_sha256,
    resolved_case_sha256: resolved.resolved_case_sha256, penpot_export_sha256: exportBinding.export_sha256,
    verdict: 'BLOCKED', reason_codes: ['DURABLE_EVIDENCE_PACK_MISSING','PENPOT_METADATA_READBACK_UNVERIFIED',...(!isDesktop?['PENPOT_EXPORT_REVISION_UNBOUND']:[])],
    evidence_manifest_path: caseRow.evidence_manifest_path, telegram_publication: 'NOT_PUBLISHED_HASH_CHANGED',
    owner_status: 'AWAITING_REVIEW', history_rewritten: false,
  };
  write(join(outRoot, 'receipts', `${id}.receipt.json`), receipt);
  registryRows.push({ case_id: id, case_path: `cases/${id}.case.json`, resolved_case_path: `resolved/${id}.resolved.json`, receipt_path: `receipts/${id}.receipt.json`, contract_sha256: contract.contract_sha256, resolved_case_sha256: resolved.resolved_case_sha256, lifecycle_status: 'active_blocked' });
  const evidenceRoot = `evidence/ui-conformance/event-card-large/current-v2/${id}`;
  batchRows.push({
    case_id: id,
    case: `catalog/ui-components/event-card-large/current-v2/cases/${id}.case.json`,
    resolved: `catalog/ui-components/event-card-large/current-v2/resolved/${id}.resolved.json`,
    penpot: `${evidenceRoot}/penpot.png`,
    penpot_receipt: `catalog/ui-components/event-card-large/current-v2/penpot-readback/${id}.receipt.json`,
    penpot_facts: `catalog/ui-components/event-card-large/current-v2/penpot-readback/${id}.facts.json`,
    agent_review: `${evidenceRoot}/agent-review.json`,
  });
  telegramRows.push({ case_id: id, contract_sha256: contract.contract_sha256, binding_status: 'blocked_not_published', reason: 'image-or-verdict hash must change and receive verified read-back before a current-v2 binding exists', readback_receipt: null });
}
const registryCore = {
  schema_version: 'event_card_large_current_v2_registry.v1', registry_id: 'event-card-large-current-v2',
  component_id: 'event.card', contract_path: 'component-contract.json', contract_sha256: contract.contract_sha256,
  design_sha: DESIGN_SHA, astro_sha: ASTRO_SHA, events_tooling_sha: EVENTS_TOOLING_SHA, corpus_sha256: corpus.corpus_sha256,
  batch_id: 'event-card-large-current-v2', active_case_count: registryRows.length, cases: registryRows,
  evidence_readiness: 'BLOCKED', promotion_status: 'NOT_PROMOTED', owner_review_target: 'staging-v2-master-archetype',
};
write(join(outRoot, 'active-registry.json'), { ...registryCore, registry_sha256: digest(registryCore) });
write(join(outRoot, 'batch-manifest.json'), {
  schema_version: 'event_card_large_current_v2_batch_manifest.v1',
  batch_id: 'event-card-large-current-v2', contract_sha256: contract.contract_sha256,
  design_sha: DESIGN_SHA, astro_sha: ASTRO_SHA, events_tooling_sha: EVENTS_TOOLING_SHA, cases: batchRows,
});
write(join(outRoot, 'telegram-bindings.json'), { schema_version: 'event_card_large_current_v2_telegram_bindings.v1', contract_sha256: contract.contract_sha256, publication_policy: 'publish only superseding messages when image/verdict content hash changes; require verified read-back', bindings: telegramRows });

const chipCoverageCore = {
  schema_version: 'event_card_large_chip_coverage.v1', component_id: 'event.card', contract_sha256: contract.contract_sha256,
  evidence_kind: 'actual-astro-build-generated-inventory', design_sha: DESIGN_SHA, astro_sha: ASTRO_SHA,
  generated_at_reference: '2026-08-22T00:00:00Z', reference_clock: corpus.reference_clock,
  generator: {
    primary_render_report_path: 'tests/fixtures/ui-conformance/event-card-large-chip-inventory.v1.json',
    primary_render_report_sha256: '74ec329cba6b1885ba36e56f74a2eb50536243f489da60f3155a112d115b2446',
    primary_proof_kind: 'Astro-build DOM inventory',
    command_pattern: 'node scripts/ui_conformance/resolve-render-case.mjs --case <exact-corpus-case> --corpus-root <Golden Event Corpus v1> --output <resolved.json>',
    script_path: 'scripts/ui_conformance/resolve-render-case.mjs', script_sha256: '17935ead62255cd8473949f04075a984a85cb1c83400409529f1057b292b1602',
    event_card_path: 'site/src/components/EventCard.astro', event_card_sha256: '92b2ec6e7d07d31d0e5e6e02a233e450e5961acf946e04231885ee86633693ee',
    events_lib_sha256: '23c8c48c5f741a96975eedb6b4677cb67f45ead0a8d311ee5da70c82367fcfde', occurrence_lib_sha256: '041841f258ccb5116955e8ed5627208093f21b70f253a1ae16209f56221c8074',
  },
  exact_generated_rows: chipRows.map(([fixture_id,event_type,admission,occurrence,likes,shares,calendar]) => ({ fixture_id,event_type,admission,occurrence,like:{count:likes,state:likes>0?'count-positive':'count-absent'},share:{count:shares,state:shares>0?'count-positive':'count-absent'},calendar,fixed_labels:{not_interested:'Не интересно',share:'Поделиться',calendar:calendar==='present'?'В календарь':null} })),
  exact_value_sets: {
    event_type: ['концерт','выставка','лекция'],
    admission: ['1500 ₽','1000 ₽','Бесплатно · вход свободный','Билеты','Бесплатно · регистрация','Условия уточняются','Запись по телефону'],
    occurrence: ['17 октября 20:00','10 апреля','21 октября 20:00','10 июля 19:00','22 августа 12:00','22 августа','22 августа 18:00','21 августа'],
    like_states: ['count-absent','count-positive'], share_states: ['count-absent','count-positive'], calendar_states: ['present','absent'],
  },
  generator_branch_families: {
    admission: ['sold-out','free-booking','donation','phone','ticket','free','price','arbitrary','unspecified'],
    occurrence: ['single-date','single-date-time','date-range','multi-date','multi-date-shared-time','multi-date-distinct-times','cross-year','unknown-time'],
  },
  penpot_coverage: { materialized_semantic_masters:['event.meta.event-type','event.meta.admission','event.social-proof.like','event.social-proof.share','event.action.calendar','event.action.not-interested'], semantic_target_missing:['event.meta.occurrence'], missing_corpus_specimens:['event_type=лекция','admission=1500 ₽','admission=Бесплатно · регистрация','admission=Условия уточняются','share=count-positive:5'] },
  coverage_model: 'arbitrary strings are content overrides on semantic masters; branch families are states/behaviors, not one component per literal',
};
write(join(outRoot, 'chip-coverage.actual-astro.json'), { ...chipCoverageCore, coverage_sha256: digest(chipCoverageCore) });
write(join(outRoot, 'stale-evidence-index.json'), {
  schema_version: 'event_card_large_stale_evidence_index.v1', current_contract_sha256: contract.contract_sha256,
  immutable_history_policy: 'do not rewrite historical receipts',
  entries: [
    { evidence_id: 'external-audit-l0-surface-receipt', referenced_sha: 'c9bae878122af7064d8d6ed4d7bf27ca5d9bf558', reachability: 'unreachable-at-audit', disposition: 'stale_unreproducible', source: 'external independent audit 2026-08-22' },
    { evidence_id: 'legacy-474px-case-family', referenced_sha: DESIGN_SHA, reachability: 'reachable', disposition: 'historical_inactive', source: 'catalog/fixtures/ui-reference-events/v1/cases/*desktop.case.json' },
  ],
});
write(join(outRoot, 'contour-and-routing.json'), {
  schema_version: 'event_card_large_current_v2_contour.v1', contract_sha256: contract.contract_sha256,
  current_contour: { design_pr: 42, design_base_sha: DESIGN_SHA, events_pr: 547, astro_sha: ASTRO_SHA, events_tooling_sha: EVENTS_TOOLING_SHA, active_registry: 'active-registry.json' },
  superseded_contours: [{ design_pr: 40, events_pr: 546, disposition: 'superseded_by_current_v2', external_pr_state_action: 'required-outside-repository' }],
  legacy_474px: { active: false, disposition: 'historical_only', registry_exclusion: true },
  owner_review_routing: { target: 'staging-v2-master-archetype', historical_boards_are_targets: false, penpot_comments_resolved_by_this_change: false },
  promotion_status: 'NOT_PROMOTED', production_ui_changed: false,
});
console.log(JSON.stringify({ ok:true, contract_sha256:contract.contract_sha256, cases:registryRows.length }, null, 2));
