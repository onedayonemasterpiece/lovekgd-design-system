# Lane event-media-contracts Results

## Status

committed after validation; exact branch-tip SHA is reported in the integrator handoff

## Requirement IDs

- R03 — Materialize a defensible Event Media boundary model using only the exact
  allowed entity kinds, with explicit reconciliation of every semantic-ledger
  forward reference.
- R05 — Define strict candidate-only contracts for only the independently proved
  component identities.
- R06 — Compare all six requested alternatives for every boundary and retain
  recommendation evidence, differences, risk, reversibility and owner-decision
  state without accepting a decision.

## Branch

`agent/event-media-contract-decision-v1/contracts`

## Worktree

`/home/dev/.codex/worktrees/lovekgd-design-system/event-media-contracts`

## Base SHA

`b1c923cfbc7e46f7d86727fe37158bce73078cfc`

## Head SHA

A Git commit cannot contain its own final object ID. The committed branch tip is
therefore authoritative and is reported as a full SHA in the parent handoff;
the integrator can also resolve it with:

```text
git rev-parse agent/event-media-contract-decision-v1/contracts
```

## Files changed

- `contracts/normalization/event-media-boundary-model.v1.json`
- `contracts/normalization/event-media-candidate-contract.v1.schema.json`
- `catalog/normalization/event-media/boundary-model.jsonl`
- `catalog/normalization/event-media/candidate-contracts/candidate.event-primary-media.json`
- `catalog/normalization/event-media/candidate-contracts/candidate.event-media-viewer.json`
- `catalog/normalization/event-media/candidate-contracts/candidate.event-fallback-art.json`
- `catalog/normalization/event-media/alternatives-and-recommendations.jsonl`
- `.codex/lanes/event-media-contracts/RESULTS.md`

No validator, test, documentation, readiness, receipt, previous dossier,
immutable snapshot, Penpot, prototype, token, page archetype or production file
was changed.

## Delivered boundary model

- 31 machine-readable records:
  - 23 exact semantic-ledger forward-reference targets;
  - one `family.event-media` analytical boundary, classified only as
    `composition_pattern`;
  - exactly three `component_identity_candidate` boundaries;
  - two foundation candidates;
  - two explicit unresolved internal viewer/rail boundaries.
- All eight and only the eight requested entity kinds are available.
- Only the three `component_identity_candidate` rows own candidate contract
  references. Composition, placement, mode, foundation, implementation detail,
  subcomponent and unresolved rows own none.
- All 52 consumer application references and all 12 blocker references resolve
  against the exact L1/L2 ledgers.
- Consumer-specific behavior remains referenced to the exact requirement-matrix
  row instead of being collapsed into a family default.
- No global ratio, token, physical operation, migration, Penpot materialization,
  accepted decision, winner, Product Value promotion or production change is
  authorized.

### Explicit provisional-kind reconciliation

All 23 forward references resolve exactly once: missing 0, duplicate 0. Thirteen
source classifications are intentionally changed and retain both
`source_semantic_ref` and `source_semantic_entity_kind` plus rationale:

1. five adjacent unresolved exclusions become four `consumer_placement` rows
   and one festival `composition_pattern`;
2. share/social changes from `component_identity_candidate` to
   `composition_pattern`;
3. EventHero changes from `consumer_placement` to `composition_pattern`;
4. gallery preview changes from `subcomponent_candidate` to
   `consumer_placement`;
5. poster companion changes from `consumer_placement` to
   `composition_pattern`;
6. primary gallery media changes from `subcomponent_candidate` to
   `consumer_placement`, with the broader standard/efficient/exhibitions set
   unresolved;
7. textual artwork changes from `unresolved_boundary` to
   `semantic_media_mode`;
8. loading skeleton changes from `subcomponent_candidate` to
   `implementation_detail`;
9. no-image fallback changes from `component_identity_candidate` to
   `semantic_media_mode`.

## Candidate contract identity recommendations

Exactly three candidate-only contracts are emitted; none is accepted:

1. `candidate.event-primary-media` / stable ID `event-media.primary` — one
   selected event-detail primary asset or typed presentation fallback in a
   prominent frame, optionally opening a separately owned viewer. EventHero
   content/actions, poster companion, preview rails, viewer, EventCard/listing
   media and share/social generation are explicit non-goals.
2. `candidate.event-media-viewer` / stable ID `event-media.viewer` — only the
   standard `.hero-gallery` modal viewer with ordered media, navigation, focus,
   dismissal, live index and lazy activation. Efficient portrait/group viewers,
   preview rails and other superficially similar viewers are excluded and stay
   unresolved.
3. `candidate.event-fallback-art` / stable ID `event-media.fallback-art` — only
   deterministic typed concert/lecture decorative art for initially missing
   primary media. Generic no-image presentation and broken-source recovery are
   not candidates and remain consumer-owned states.

Each strict Draft 2020-12 instance requires identity, non-goals, anatomy, slots,
semantic modes, props/defaults, states, valid/invalid combinations, responsive
and container behavior, per-consumer ratio policy, crop/contain, focal/safe-area,
upscaling, loading/skeleton, missing/broken behavior, accessibility, extension
points, composition boundary, fixtures/tests, migration/rollback considerations,
blockers and owner questions. Candidate-only constants keep canonical,
acceptance, normalization, physical operation, migration and promotion false.

Penpot fields are future-compatible but unmaterialized (`binding=null`), limit
instance overrides, mark screenshots evidence-only and preserve the exact
three-way surfaces `penpot`, `astro_specimen`, `generated_page` and equality
tuple `component_id`, `contract_version`, `contract_sha256`, `state_key`,
`fixture_id`, `viewport_id`, `candidate_package_sha`.

## Six-way alternatives and recommendations

Every one of the 31 boundaries has exactly one comparison row and exactly the
same ordered six options:

`merge`, `preserve_as_variant`, `preserve_as_composition`, `split`,
`preserve_product_pattern`, `preserve_unresolved`.

For every row, `rejected_alternatives` is the exact five-option complement of
the recommendation. The record retains support, intentional differences,
migration risk, reversibility and owner state. Owner references use only the
L2 short IDs and only where decision evidence remains underdetermined:

- `identity-set-v1` — analytical-family and exact three-candidate identity-set
  acceptance/rejection/defer receipt;
- `viewer-rail-boundary-v1` — broad gallery-preview/primary-gallery,
  efficient-viewer and lab-rail inclusion/exclusion/reconciliation.

Still-open evidence gaps are preserved as blockers and are not turned into new
owner questions.

## Deterministic validation

Lane-local inline Python assertions (not committed as an out-of-scope script)
validated:

```text
consumer rows: 52
semantic rows / forward refs: 23 / 23
blocker rows: 12
boundary rows: 31
forward refs missing / duplicate: 0 / 0
explicit provisional-kind reconciliations: 13
component identity rows / candidate files: 3 / 3
alternatives rows / exact six-option comparisons: 31 / 31
Draft 2020-12 schema validation: PASS
candidate instances validated: 3 / 3
pinned source/design evidence paths checked: 88; missing: 0
scoped git diff --check: PASS
JSON parse checks: PASS
```

The inline checks also assert exact entity/recommendation enums, candidate-only
contract ownership, family composition classification, source semantic joins,
all consumer/blocker/owner references, exact rejected-option complements,
Product Value observe/pending/promotion-false, experiments `NOT_MERGED`, no
accepted decision, no normalization/physical operation/migration, no global
ratio/token and no Penpot materialization.

Commands used:

```text
python3 /tmp/generate_event_media_boundaries.py
python3 - <<'PY'
# Deterministic 52/23/12 input and 31-row boundary/alternative cross-reference
# assertions; exact enums, ownership, six-way complements and fail-closed flags.
# Draft202012Validator.check_schema plus validation of exactly 3 instances.
PY
python3 - <<'PY'
# Parsed every pinned evidence ref and git cat-file -e checked its exact path at
# events-bot-new@66bc0d43e36299417626f992021cfb7299ddf704 or the design base.
PY
python3 -m json.tool contracts/normalization/event-media-boundary-model.v1.json
python3 -m json.tool contracts/normalization/event-media-candidate-contract.v1.schema.json
find catalog/normalization/event-media/candidate-contracts -type f -name '*.json' \
  -print0 | xargs -0 -n1 python3 -m json.tool
git diff --check -- <owned paths>
```

## Risks and owner queue

- `identity-set-v1`: Does the owner accept, reject or defer each of the exact
  three bounded identity candidates, while explicitly retaining every other
  analytical record as mode, composition, placement, foundation, detail,
  subcomponent or unresolved? Until a separate receipt exists, all three remain
  candidate-only and blocked.
- `viewer-rail-boundary-v1`: Does the owner exclude the efficient portrait
  viewer and lab EventMediaRail from the standard viewer identity, or require a
  separately evidenced reconciliation? Inclusion cannot rely on lab presence or
  name similarity and must preserve semantic, fallback, tiny-source, responsive,
  overflow, keyboard and runtime gaps.
- Ratio, semantic classification, crop, tiny-source, fallback, layout,
  responsive, runtime and provenance gaps remain evidence blockers rather than
  invented owner choices.
- This lane supplies decision material only. It does not claim
  `READY_FOR_OWNER_CONTRACT_DECISION`, start migration, or authorize physical
  defragmentation.

## Merge notes

- Cherry-pick the lane tip reported in the parent handoff.
- Integrator validators may bind these outputs, but must preserve the exact
  candidate set and forward refs and must not reinterpret `split` as acceptance
  or a physical operation.
- `family.event-media` remains `composition_pattern`; Product Value remains
  `observe` / `pending_product_model`; promotion remains false; experiments
  remain `NOT_MERGED`.
