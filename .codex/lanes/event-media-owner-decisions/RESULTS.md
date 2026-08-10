# Lane event-media-owner-decisions Results

## Status

Committed on the assigned branch. The branch tip containing this receipt is
authoritative; resolve it with:

```bash
git rev-parse agent/event-media-blocker-closure-v1/owner-decisions
```

## Requirement ID

- **R05 — Done:** three independent, pending owner decision cards with one
  exact source blocker per card and a deterministic, reusable fixture contract
  for the visual decision pack.

## Scope

- Branch: `agent/event-media-blocker-closure-v1/owner-decisions`
- Worktree:
  `/home/dev/.codex/worktrees/lovekgd-design-system/event-media-owner-decisions`
- Base: `37e83da83911e825fd6f1c3618dc6800ea88fb7f`
- Read-only production-source authority:
  `onedayonemasterpiece/events-bot-new@66bc0d43e36299417626f992021cfb7299ddf704`
- Exact design corpus: merged PR #32 at this lane's base.

Only the three assigned files were changed. No source, production UI,
prototype, PNG, validator, contract, readiness, blocker-closure, token,
Penpot, experiment or migration file was edited.

## Files changed

- `catalog/normalization/event-media/owner-decisions.jsonl`
- `catalog/normalization/event-media/decision-fixtures.jsonl`
- `.codex/lanes/event-media-owner-decisions/RESULTS.md`

## Delivered

### Three separate cards

Exactly three cards exist, in source blocker order:

1. `decision.EM-CENSUS-001`;
2. `decision.EM-GOV-010`;
3. `decision.EM-LABRAIL-011`.

Each card:

- copies the exact source blocker statement, closure condition and affected
  consumer IDs;
- binds resolvable application IDs and explicit surfaces;
- carries byte-exact `source_question_id`, `source_question`, `question` and
  `owner_question` from the prior queue, while adding a blocker-specific
  `scoped_owner_prompt`;
- remains independent even though `EM-CENSUS-001` and `EM-GOV-010` both derive
  from the former aggregated `identity-set-v1` queue row;
- presents exactly three genuinely distinct options, with no filler option;
- records preserved versus changed behavior, accessibility, media and content
  consequences, migration impact and reversal action for every option;
- records one agent recommendation with a numeric, level-labelled calibration
  and explicit `recommendation_is_not_acceptance=true`;
- states the exact separate owner choice/receipt required;
- remains `PENDING_OWNER_DECISION`, `NOT_MERGED`, unaccepted and unselected,
  with `accepted_option_id=null` and `decision_receipt_ref=null`;
- keeps contract acceptance, implementation, normalization, migration,
  physical operations, Penpot mutation, token creation and promotion false;
- keeps Product Value at `observe` / `pending_product_model` / false.

The three recommendations are support for owner review only:

- preserve three separately governed non-canonical identity candidates while
  keeping adjacent placements consumer-owned;
- approve the recommendation for contract-decision review only, without
  contract acceptance or implementation authority;
- exclude lab-only `EventMediaRail` as evidence-only unless a later owner
  chooses an inclusion path and accepts its explicit evidence obligations.

### Deterministic fixture manifest

The fixture manifest contains exactly **13** fixture rows. Every fixture is
bound to both `desktop-1440x1024` and `mobile-390x844`. Every one of the nine
options references the identical ordered 13-fixture set, identical source
bytes/crop/state/viewport contract, two comparable visual-example region IDs,
and the same single PNG board target for its blocker. This creates **18**
unique option/viewport visual-example IDs across three per-blocker board
targets without pre-generating L3's HTML or PNGs.

Coverage is explicit for:

- photography, portrait poster, meaningful artwork/OCR and unknown text;
- `4:5`, `5:4`, `3:2`, `2:3`, `1:1` and `intrinsic/source`;
- cover and contain, focal point, valuable/safe region and crop prohibition;
- primary, small previews and poster companion;
- missing, broken/error, tiny source, loading skeleton and layout reservation;
- mobile and desktop comparison regions.

The `4:5` specimen is explicitly a deterministic derived crop and does not
claim an intrinsic source ratio. The `2:3` specimen is explicitly a contain
container treatment around the same pinned real `3:2` photo; it does not use
an adjacent festival identity. Composite fixtures reuse the same leaf fixture
IDs and asset order rather than substituting media between options.

Pinned Git blobs have exact SHA-256, dimensions and media types. Three real
event asset records bind exact event ID, asset index, source URL, dimensions
and decoded pixel SHA-256 from the pinned events JSON; L3 must verify them on
materialization and record the copied-file SHA separately. All fixtures are
marked existing owner-controlled internal evidence only,
`redistribution_rights_claimed=false`, `license_research_performed=false`,
`production_state_claimed=false`, and `NOT_MERGED`.

## Commands run

```text
python3 /tmp/build_owner_decisions.py
python3 /tmp/validate_owner_decisions.py
git diff --check -- \
  catalog/normalization/event-media/owner-decisions.jsonl \
  catalog/normalization/event-media/decision-fixtures.jsonl \
  .codex/lanes/event-media-owner-decisions/RESULTS.md
sha256sum \
  catalog/normalization/event-media/owner-decisions.jsonl \
  catalog/normalization/event-media/decision-fixtures.jsonl
```

## Tests / verification

- Strict cross-reference/count/source validation: **PASS** — cards=3,
  options=9, fixtures=13, visual examples=18, applications=52.
- Exact source blocker statement/condition/consumer bindings: **PASS**.
- Byte-exact source question ID/text binding: **PASS**.
- Identical fixture-set reuse across all options: **PASS**.
- Pinned Git blob SHA-256 checks against events `66bc0d4`: **PASS**.
- Pinned real event ID/index/URL/dimensions/pixel-SHA checks: **PASS**.
- Required semantic/ratio/fit/focal/safe/state/placement/viewport coverage:
  **PASS**.
- Pending/unselected/no-implementation/Product-Value gates: **PASS**.
- Canonical compact JSONL and scoped `git diff --check`: **PASS**.
- `owner-decisions.jsonl` SHA-256:
  `1458e7c256608c44ea3f0b2879ca8567566434359597c62b1c2d765523266331`.
- `decision-fixtures.jsonl` SHA-256:
  `7572d582e0710c11db884791c82134eef038927a603dca049cf2fcf43e5fe362`.

## Risks and honest limits

- A card recommendation is not an owner choice. No decision receipt exists,
  and no readiness result may treat any recommendation as accepted.
- Visual-example IDs and PNG board targets are forward contracts for L3; this
  lane intentionally creates no HTML, copied media or screenshots.
- Existing source metadata and controlled Behavioral evidence remain
  non-production-equivalent where the PR #32 corpus says so.
- Remote event records are not redistributed by this lane. L3 must fail closed
  if materialized bytes do not match pinned decoded pixels and dimensions.
- Governance approval, if later selected by the owner, permits only the stated
  decision-stage review. It does not accept a candidate contract, authorize
  implementation or make Product Value promotion-ready.

## Merge notes

- Cherry-pick the single lane commit reported to the parent integrator.
- L3 should consume the exact card, option, fixture, visual-example and board
  target IDs; it must keep the same fixture set and order across options.
- L5 should reject missing cards, a CENSUS/GOV collapse, altered source
  question text, fixture substitution, accepted options/receipts, or any true
  implementation/normalization/promotion flag.
- Integration may add schemas/validators and visual artifacts, but must not
  rewrite these source blocker or owner-question fields by prose inference.
