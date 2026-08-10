# Lane event-media-blocker-evidence Results

## Status

`committed`

Terminal task status: `EVENT_MEDIA_BLOCKER_CLOSURE_INCOMPLETE`.

## Requirement IDs

- R03 — Reconcile the exact merged PR #32 Event Media corpus without changing
  any source artifact.
- R04 — Give every one of the nine exact evidence blockers an honest terminal
  disposition from the allowed vocabulary, using only pinned existing evidence
  or a narrowly justified capture.

## Branch / worktree / base

- Branch: `agent/event-media-blocker-closure-v1/evidence`
- Worktree:
  `/home/dev/.codex/worktrees/lovekgd-design-system/event-media-blocker-evidence`
- Lane base: `37e83da83911e825fd6f1c3618dc6800ea88fb7f`
- Merged PR #32 main: `3cbe35326ead04ac67070e5b400d30d9edc6eb01`
- Audited PR #32 head: `20eab45534e2c64497e4db661e6a5ca8582229ea`
- Pinned read-only events evidence:
  `66bc0d43e36299417626f992021cfb7299ddf704`

The committed lane SHA is reported to the integrator after commit. A commit
cannot contain its own object ID, so the branch tip is authoritative.

## Files changed

- `catalog/normalization/event-media/blocker-closure-v1.jsonl`
- `.codex/lanes/event-media-blocker-evidence/RESULTS.md`

No PR #32-derived source ledger, production source, `site/src`, `site/public`,
prototype, Penpot, token, archetype, experiment, migration or candidate contract
was changed.

## Immutable corpus reconciliation

Exact merged bytes were checked against audited head `20eab455...` and merged
main `3cbe353...`; both diffs are empty for all source corpus files.

| Corpus | Count | SHA-256 |
|---|---:|---|
| Source blockers | 12 = 3 owner + 9 `still_open` | `22337fc3911fcbfb73be7cfc3045808245d430030a65990dc7209ce83878024f` |
| Consumer applications | 52 = 37 active + 15 current-source nonproduction | `b3f041ad3e64cce6c4690c84a12515fbdef6f8ce649ab85fecc9d03c3d89c009` |
| Semantic records | 23 | `8989734d1057fb3785dbd05403d7803c052de804eb798e3faeb21b56208e81ee` |
| Boundary records | 31 | `420f2547bc95eddfb6f5374d25c508cb43a3a135f34bd78c0d84bb93a4b6ffec` |
| Candidate contracts | 3 | primary `a5e7186...`; viewer `f1983b68...`; fallback `41a0812f...` |
| Readiness | 3 records × 23 checks | `87bf003c9f9ffc80afcfd361f5a257e1ff56a227d5a41138665c4e6e886a5204` |
| Owner queue | 2 pending questions | `19ca340ef0e8e42717fb1a849875aa8082fe5ccff0ccab15812c3b9db708de39` |

PR #32 source wording, order, affected consumer IDs, required evidence,
source status and row identity are preserved byte-for-byte in the derived
ledger. Every derived row carries the exact source-file and raw-row SHA-256.
Every `consumer_application_ref` joins the immutable 52-row census.

## Terminal dispositions

### Preserved source owner blockers

- `EM-CENSUS-001` → `owner_decision_required` — exact missing fact: accepted
  `identity-set-v1` receipt classifying every boundary-pending consumer without
  inferring merge/split from the completed census.
- `EM-GOV-010` → `owner_decision_required` — exact missing fact: a separate
  accepted `identity-set-v1` receipt resolving review, recommendation and
  normalization permission without rewriting immutable evidence.
- `EM-LABRAIL-011` → `owner_decision_required` — exact missing fact: accepted
  `viewer-rail-boundary-v1` inclusion/exclusion receipt; inclusion must retain
  semantic, error, tiny, overflow and keyboard work.

All three remain separately identified, keep their exact source statements,
have `owner_decision_accepted=false`, and have no closure receipt.

### Nine evidence blockers

All nine were terminalized as
`still_open_with_exact_missing_evidence`; none was manufactured closed:

1. `EM-RATIO-002` — missing accepted per-consumer/per-slot ratio applicability
   for 4:5, 5:4, 3:2, 2:3, 1:1 and intrinsic/source, plus direct proof that
   local ratios are not a global token.
2. `EM-SEMANTIC-003` — missing executable tested mapping for photography,
   poster/artwork, OCR/document, unknown-text and classified non-photo media,
   including reconciliation of `media_role` with `image_text_mode`.
3. `EM-CROP-004` — missing direct consumer renderer enforcement of crop
   permission + focal + safe area for cover, or accepted non-applicability,
   with executable tests/runtime.
4. `EM-TINY-005` — missing tested per-consumer upscale ceilings and a reachable,
   executed EventHero low-resolution containment branch.
5. `EM-FALLBACK-006` — missing exact broken-image convergence for Event Detail
   primary, poster, fullscreen and previews, including preserved geometry and
   suppression of failed browser image UI.
6. `EM-LAYOUT-007` — missing per-slot reservation/loading applicability and an
   exact lazy-gallery loading/error runtime path; dimensions and `loading=lazy`
   alone are insufficient.
7. `EM-RESP-008` — missing PASS or accepted non-applicability for all nine exact
   Desktop cascade probes, plus an alternate-source art-direction decision or
   explicit accepted non-applicability.
8. `EM-RUNTIME-009` — missing production-equivalent/observed Event Detail
   desktop/mobile primary, companion, preview and fullscreen evidence,
   including missing/broken/tiny states.
9. `EM-PROVENANCE-012` — missing sufficient source + requirement + exact runtime
   authority (or reasoned runtime non-applicability) for every eventually
   accepted consumer cell.

## Evidence exhaustion

The ledger records exact bounded searches of existing requirements, pinned
source/tests, Decoder v1, Behavioral Decoder v1.1 runtime/specimens, and Git
history. Material negative facts retained fail-closed include:

- all 52 census runtime cells have `production_observed=false` and
  `production_equivalent=false`;
- all 52 fit/crop/focal/safe/object-position/tiny/fallback/loading/responsive
  policies remain `source_observed_requirement_reconciliation_pending`;
- all nine exact `EM-RESP-008` breakpoint probes remain `MISMATCH` with the
  compiled-selector cascade unreconciled;
- all five exact Event Media specimen packets retain
  `production_state_claimed=false`;
- both owner queue records remain `PENDING_OWNER_DECISION`, with no accepted
  option or receipt;
- pinned current source still contains the unreachable EventHero low-resolution
  caller predicate and no Event Detail broken-image convergence contract.

No external/web research was performed. No general decoder was run. No new
controlled capture was performed: existing evidence already isolates the exact
missing positive facts, while another controlled specimen could not create
accepted policy/owner authority or production equivalence.

## Product Value and STOP invariants

Every row preserves:

- `product_value_gate_mode=observe`;
- `value_evidence_status=pending_product_model`;
- `promotion_ready=false`;
- candidate acceptance / normalization / physical UI change / migration /
  Penpot mutation / final media token flags false;
- `experiment_decision=NOT_MERGED`.

## Validation

- Strict derived-ledger validation: **PASS**
  - 12 exact rows in source order;
  - 3 owner-required + 9 still-open-with-exact-missing-evidence;
  - zero resolved/invalidated rows;
  - source text/closure condition/affected IDs byte-equal;
  - exact file and row hashes;
  - all application refs join the 52-row census;
  - every finding has commit, path/ref, concrete consumers, finding, limitation
    and `satisfies_required_evidence=false`;
  - no field-presence closure and no STOP/Product Value escape.
- Decoder v1 validator: **PASS** — 107 components, 12 contracts, 6 capsules.
- Behavioral v1.1 validator: **PASS** — manifest
  `c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1`;
  293 terminal probes, 39 mismatches, 134 reviewed rasters.
- Audited-head/main immutable corpus diff: **PASS**.
- `git diff --check`: **PASS**.
- Derived ledger SHA-256:
  `a998733994a53b4fa0e69096c75e39f647d5cc31122f86c576d1325f0e727e5a`.

## Risks / integration notes

- The owner pack can present decisions but must not represent any option as
  accepted.
- Readiness must retain these nine exact missing-evidence blockers; an empty
  list or field completeness must not make a candidate ready.
- The integrator/L5 validator should require a direct satisfying finding,
  receipt/capture identity and empty missing-evidence list before allowing any
  resolved status.
- The correct overall terminal outcome at this evidence state is
  `EVENT_MEDIA_BLOCKER_CLOSURE_INCOMPLETE`, with the nine IDs above.
