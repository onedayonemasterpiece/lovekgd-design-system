# Event Media owner decision queue

## Status and scope

This is the compact owner-only queue for Event Media Boundary & Contract Decision v1. It is derived from the exact blocker-closure ledger and the alternatives ledger at the L1–L3 integration base. It accepts no boundary or candidate contract, authorizes no implementation or migration, changes no Product Value or experiment decision, and performs no Penpot operation.

The queue order is normative and matches `catalog/normalization/event-media/owner-decision-queue.jsonl` exactly:

| Order | ID | Decision | Exact blocker refs | Recommendation | Current status |
|---:|---|---|---|---|---|
| 1 | `identity-set-v1` | Decide whether the Event Media composition preserves exactly three separately governed, non-canonical identity candidates. | `EM-CENSUS-001`, `EM-GOV-010` | `preserve-three-candidate-split` | `PENDING_OWNER_DECISION` |
| 2 | `viewer-rail-boundary-v1` | Decide the boundary among the standard viewer candidate, consumer preview compositions, efficient portrait viewer, and lab-only `EventMediaRail`. | `EM-LABRAIL-011` | `preserve-bounded-separation` | `PENDING_OWNER_DECISION` |

Neither row is a candidate-contract accept/return/reject decision: all three candidates are currently `NOT_READY_WITH_EXACT_BLOCKERS`.

## 1. `identity-set-v1`

**Question.** Should the Event Media analytical composition preserve exactly the three evidence-backed identities as separate non-canonical candidates while every placement, semantic mode, foundation, implementation detail, and unresolved boundary remains outside component identity?

Candidate set:

1. `candidate.event-primary-media`;
2. `candidate.event-media-viewer`;
3. `candidate.event-fallback-art`.

Options, in machine order:

1. `preserve-three-candidate-split` — recommended; resolves to `split` in the family alternatives row and all three candidate alternatives rows.
2. `preserve-composition-only` — resolves to `preserve_as_composition` for the family row.
3. `preserve-unresolved` — resolves to `preserve_unresolved` for the family row.

This decision can close only its owner-controlled boundary/governance scope. It cannot close ratio, semantic, crop, tiny-source, fallback, loading/layout, responsive, runtime, or cell-provenance gaps by field presence.

## 2. `viewer-rail-boundary-v1`

**Question.** Should the standard viewer remain the only viewer identity candidate while gallery previews remain consumer compositions and the efficient portrait viewer plus lab `EventMediaRail` remain unresolved/evidence-only?

Options, in machine order:

1. `preserve-bounded-separation` — recommended: gallery preview remains `preserve_as_composition`; the broader primary-gallery category, efficient portrait viewer, and lab rail remain `preserve_unresolved`.
2. `preserve-as-viewer-variants` — asks whether unresolved viewer/rail boundaries should instead become variants; current evidence rejects this.
3. `split-additional-identities` — asks whether the efficient viewer and lab rail should become separate identity candidates; current evidence rejects this.
4. `merge-viewer-and-rails` — asks whether those surfaces should merge; current evidence rejects this.

A lab-only source binding or controlled screenshot remains evidence, not production equivalence or a native component. Inclusion would reopen semantic mode, error recovery, overflow, keyboard, and runtime closure; exclusion requires an owner receipt and does not delete the lab evidence.

## Evidence gaps are not owner questions

The blocker closure ledger contains nine `still_open` evidence gaps. They are deliberately excluded from the owner queue:

1. `EM-RATIO-002` — consumer/slot ratio matrix;
2. `EM-SEMANTIC-003` — semantic media-mode reconciliation;
3. `EM-CROP-004` — crop/focal/safe-area enforcement;
4. `EM-TINY-005` — tiny-source/upscale policy and executable test;
5. `EM-FALLBACK-006` — missing/broken state convergence;
6. `EM-LAYOUT-007` — loading, skeleton, and layout reservation;
7. `EM-RESP-008` — responsive art direction and terminal probes;
8. `EM-RUNTIME-009` — production-equivalent runtime binding;
9. `EM-PROVENANCE-012` — cell-level authority and runtime provenance.

Those gaps must be resolved by evidence or requirements. They must not be converted into owner preference questions. In particular, this queue does not ask for a global ratio or token, Product Value entities, Penpot materialization, migration start, or an experiment winner.

## Positive readiness boundary

`catalog/normalization/event-media/readiness.jsonl` contains exactly the three `component_identity_candidate` rows and no composition, placement, semantic mode, foundation, implementation detail, subcomponent, or unresolved-boundary row. Each row evaluates the same ordered 23-dimension Project Normalization checklist with only:

- `PASS` for positively evidenced applicable checks;
- `BLOCKED` for applicable checks without closure;
- `NOT_APPLICABLE_WITH_REASON` only when applicability is explicitly `NOT_APPLICABLE` and the assertion/evidence states why.

Readiness is recomputed from positive checks plus exact blocker/decision closure. Empty blocker arrays alone are never readiness. Every current candidate remains:

```text
status = NOT_READY_WITH_EXACT_BLOCKERS
strict_ready = false
eligible_for_scoring = false
score = null
selected_first_wave = false
```

The global 47-row readiness catalog and empty first wave remain unchanged. Candidate-scoped readiness cannot make the parent `family.event-media` composition a component identity.

## Product Value, experiments, and Penpot

For both queue rows and all three readiness rows:

- Product Value remains `observe` / `pending_product_model` / `promotion_ready=false`;
- product ID arrays are empty and `surface_archetype_id=null` in readiness records;
- `decision=NOT_MERGED` and `experiment_decision=NOT_MERGED`;
- lifecycle remains `AS_IS_RECONSTRUCTED`, authority `reconstructed`, and candidates non-canonical/non-accepted;
- Penpot remains `unmaterialized`, binding `null`, mutation/materialization authorization false;
- screenshots remain `evidence_only` and cannot satisfy runtime or three-way conformance.

## Safe status projection

Always:

`EVENT_MEDIA_BOUNDARY_MODEL_COMPLETE`

Current additional status:

`EVENT_MEDIA_NOT_READY_WITH_EXACT_BLOCKERS`

`READY_FOR_OWNER_CONTRACT_DECISION` is not claimed because no candidate passes the complete positive gate.
