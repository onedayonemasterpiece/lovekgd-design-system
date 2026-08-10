# Project Normalization Synthesis v1.1 — audit remediation

## Status and boundary

This revision remediates the evidence model published by Project Normalization
Synthesis v1. It does not authorize physical component defragmentation or change
the current product UI.

The byte-preserved red-team input is
[`docs/audits/project-normalization-synthesis-v1-independent-red-team-audit.md`](../audits/project-normalization-synthesis-v1-independent-red-team-audit.md),
SHA-256 `a466ae5ff4846a1895eb11429c2fe4f175115a119dc9904d5a4a4e50a9507f76`.
Its original `FAIL — RESULT_NOT_PROVEN` verdict remains historical evidence and
is not rewritten by this remediation.

## Corrected model

### Raw evidence and findings

The v1.1 raw universe is reconstructed independently from pinned Decoder v1 and
Behavioral Decoder v1.1 artifacts. Exactly 279 raw identities are partitioned
into 222 canonical findings. Fifty-seven probe/unresolved pairs are permitted
only through the typed alias registry; every raw identity appears exactly once
in the partition.

`NOT_MERGED` remains the boundary decision. It is no longer accepted as a
substitute for an operational disposition, provenance, blocking scope, or
resolution stage.

### Analytical groups and semantic identities

The 47 stable `family.*` identifiers are preserved as analytical join keys.
Each record has a typed entity kind. Group membership is census evidence only:
it does not prove semantic identity, equivalence, variant status, or permission
to merge or split implementations.

Only a `component_identity_family` may become ready for a contract decision, and
only after every applicable positive readiness check is evidenced. Empty blocker
arrays never imply readiness.

### Current readiness

The remediated positive gate yields:

- 47 analytical groups assessed;
- 0 strict-ready component identity families;
- 0 first-wave families;
- no minimum first-wave count;
- score calculation disabled for every non-ready group.

`family.brand-identity` is a foundation group, not a ready component identity.
Event Media is a composition group with exact open blockers. Event Token
Medallions is a composition group requiring boundary and taxonomy review.

### Reachability and lifecycle

Reachability observations, lifecycle decisions, and deletion authorization are
separate facts. Zero pinned production importers does not prove that an
implementation is dead, unwanted, removable, or deprecated.

`MobileSearchBottomNav` is retained with
`not_observed_under_pinned_evidence` and
`preserve_pending_reconciliation`. Deletion and deprecation remain forbidden
without the complete proof and decision chain recorded in the lifecycle ledger.

### Product Value Gate

The gate remains `observe`. The pinned product authority has no machine-readable
product registry, so product foreign-key arrays remain empty, product archetype
IDs remain null, every application remains `pending_product_model`, and
`promotion_ready` remains false. No Job, Journey, Outcome, Capability, Metric,
Guardrail, or archetype is inferred from design-side prose or adoption counts.

### Family lifecycle

The only current lifecycle state is `AS_IS_RECONSTRUCTED`. Candidate contract
acceptance, reversible code candidate, native Penpot candidate, three-way
conformance, candidate archetypes and product representations, read-only Gemini
MCP audit, reviewed corrections, and final promotion are separate ordered gates.
Authority changes only at `FAMILY_AND_ARCHETYPE_PROMOTION`.

## Evidence identities

- Design baseline: `317938bc72cf7a47ea798b2614d92d3d285dd97a`.
- Immutable Decoder v1 tree:
  `e77fc2457fadfdffb46ed2d90304ebb91e89a715`.
- Behavioral Decoder v1.1 manifest:
  `c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1`.
- Product evidence closure commit:
  `66bc0d43e36299417626f992021cfb7299ddf704`.

The behavioral manifest is preserved byte-for-byte. A canonical count projection
marks its five conflicting legacy counters as deprecated and derives all current
counts from the actual output rows.

## Strict stop

This remediation performs no production Astro/CSS/JS change, component merge or
split, deletion, target ratio selection, final token or typography decision,
experiment winner selection, product-model invention, Penpot mutation, Penpot
component materialization, promotion, or automatic next phase.

The only completion claims allowed before an independent re-audit are:

- `PROJECT_NORMALIZATION_SYNTHESIS_V1_1_REMEDIATED`
- `READY_FOR_INDEPENDENT_REAUDIT`

