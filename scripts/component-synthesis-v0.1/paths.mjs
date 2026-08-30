export const SYNTHESIS_ROOT = 'catalog/normalization/component-synthesis-v0.1';

export const PATHS = Object.freeze({
  schema: 'contracts/normalization/component-synthesis-registry.v0.1.schema.json',
  receiptSchema: 'contracts/normalization/apply-component-synthesis-receipt.v0.1.schema.json',
  packageVerification: `${SYNTHESIS_ROOT}/package-verification.json`,
  entityRegistry: `${SYNTHESIS_ROOT}/entity-registry.jsonl`,
  mappings: `${SYNTHESIS_ROOT}/current-to-candidate-mapping.jsonl`,
  hierarchy: `${SYNTHESIS_ROOT}/component-hierarchy.json`,
  archetypeRegistry: `${SYNTHESIS_ROOT}/page-archetype-registry.jsonl`,
  plan: `${SYNTHESIS_ROOT}/penpot-materialization-plan.json`,
  ownerAmbiguities: `${SYNTHESIS_ROOT}/owner-ambiguities.json`,
  reconciliationQueue: `${SYNTHESIS_ROOT}/technical-reconciliation-queue.jsonl`,
  sourceDrift: `${SYNTHESIS_ROOT}/source-drift-ledger.jsonl`,
  reconciliationResults: `${SYNTHESIS_ROOT}/technical-reconciliation-results.jsonl`,
  mediaMatrix: `${SYNTHESIS_ROOT}/media-policy-matrix.jsonl`,
  mediaPolicySchema: 'contracts/normalization/component-synthesis-event-media-policy.v0.1.schema.json',
  mediaResolver: `${SYNTHESIS_ROOT}/event-media-resolver-contract.json`,
  mediaRuleDispositions: `${SYNTHESIS_ROOT}/event-media-rule-dispositions.jsonl`,
  mediaConsumerProfiles: `${SYNTHESIS_ROOT}/event-media-consumer-profiles.jsonl`,
  mediaStateFixtures: `${SYNTHESIS_ROOT}/event-media-state-fixture-matrix.jsonl`,
  mediaPenpotProof: `${SYNTHESIS_ROOT}/event-media-penpot-proof-readback.json`,
  contractIndex: `${SYNTHESIS_ROOT}/contracts/index.json`,
  contractsDir: `${SYNTHESIS_ROOT}/contracts`,
  fixtureCatalog: `${SYNTHESIS_ROOT}/fixtures/fixture-catalog.json`,
  fixtureBindings: `${SYNTHESIS_ROOT}/fixtures/entity-fixture-bindings.json`,
  archetypeIndex: `${SYNTHESIS_ROOT}/archetypes/index.json`,
  archetypeGraphsDir: `${SYNTHESIS_ROOT}/archetypes/graphs`,
  materializationIr: `${SYNTHESIS_ROOT}/penpot-materialization-ir.json`,
  penpotReadback: `${SYNTHESIS_ROOT}/penpot-readback.json`,
  rollbackPackage: `${SYNTHESIS_ROOT}/rollback-package.json`,
  uiExplorationHistory: `${SYNTHESIS_ROOT}/ui-exploration-history-plan.json`,
  uiExplorationHistoryMaterializer: 'scripts/component-synthesis-v0.1/materialize-ui-exploration-history.js',
  receipt: 'receipts/normalization/apply-component-synthesis-v0.1.json',
});

export const TERMINAL_DISPOSITIONS = Object.freeze(new Set([
  'evidence_or_lab_only',
  'experiment_unresolved',
  'legacy_preserved',
  'maps_to_component',
  'maps_to_composition',
  'maps_to_variant',
  'nonvisual_runtime',
  'split_into_components',
  'unresolved_boundary',
]));

export const TERMINAL_RECONCILIATION_RESULTS = Object.freeze(new Set([
  'PASS',
  'PASS_WITH_DECLARED_VARIANT',
  'RECLASSIFIED_WITH_EVIDENCE',
  'BLOCKED_EXTERNAL_EVIDENCE',
]));

export const EXCLUDED_ENTITY_KINDS = Object.freeze(new Set([
  'runtime_enabler',
  'legacy_or_experiment',
  'evidence_or_lab_only',
  'unresolved_boundary',
]));

export const MATERIALIZABLE_WAVES = Object.freeze(new Set([
  'W1-core-and-actions',
  'W2-event-media-and-actions',
  'W3-card-listing-navigation',
  'W4-domain-product-specific',
]));

export const STATUS_FALSE_FIELDS = Object.freeze(['canonical', 'accepted', 'promotion_ready']);
