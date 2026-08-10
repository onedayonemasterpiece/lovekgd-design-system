# Project Normalization Synthesis v1.1.1 — integration report

## State

`definitions_materialized_exact_head_attestation_required`

This is the integrator record for proof remediation only. It is not an
independent delta re-audit and does not authorize merge or the next
normalization phase.

## Lineage

| Fact | SHA |
|---|---|
| Original synthesis base / merge base | `317938bc72cf7a47ea798b2614d92d3d285dd97a` |
| Audited old head retained in ancestry | `bcdff9de56663bb77f15f32660ab0156c937e77b` |
| Main incorporated | `1daeb4f3ed2b86319b91e4e5b9d97a8691a72705` |
| Reconciliation merge | `28a8449396cdfe4531302534d8e82fb9111378cd` |
| Authority clarification | `714cfe1` |
| Audit-doc integration | `1de6d4e` |
| Checklist provenance correction | `470e029` |
| Receipt-contract redesign | `58db687`, `a798c31` |
| Mutation-proof integration | `5a74d88` (source `cbd3efb2bf2215f80ec52c228f5dc2bdf04e5f60`) |
| Reproducibility integration | `eea2e09` (source `3cf0314e2bc036e2fbe4afa910d7ac94db245834`) |

The final receipt commit and exact Actions head are intentionally not
self-recorded here. They are bound by the committed content manifest and the
external Actions attestation respectively.

## Lane integration

| Lane | Requirements | Branch | Status | Source head | Integration evidence |
|---|---|---|---|---|---|
| L0 reconciliation/integrator | R02, R05, R10, R12, STOP | `remediation/project-normalization-synthesis-v1-1` | integrated; receipt/CI freeze pending | integration branch | normal merge, semantic conflict resolution, receipt/validator redesign |
| L1 audit/docs | R01, R06, R11 | `agent/project-normalization-v1-1-1/audit-docs` | merged | `fe12b3faa8cad0c5d876e48f83859185ea1723e6` | cherry-pick `1de6d4e`; exact 61,775-byte re-audit and six dispositions |
| L2 mutation proof | R03, R04 | `agent/project-normalization-v1-1-1/mutation-proof` | merged | `cbd3efb2bf2215f80ec52c228f5dc2bdf04e5f60` | cherry-pick `5a74d88`; 14 stable codes/catalog/result schema |
| L3 reproducibility/workflow | R07, R08, R09 | `agent/project-normalization-v1-1-1/reproducibility` | merged | `3cf0314e2bc036e2fbe4afa910d7ac94db245834` | cherry-pick `eea2e09`; exact-head replay, attestation, filters |
| L4 final checklist | R12 | read-only | pending frozen exact head and CI artifact | n/a | must report externally without shifting the attested head |

No worker lane is left dirty or represented only by an untracked patch.

## Semantic conflict disposition

The main merge produced one textual conflict in `docs/resource-graph-004.md`.
The resolution retains both:

1. main's action-map lifecycle: immutable evidence → reviewed finding → optional
   accepted gap, with no automatic contract revision or promotion;
2. v1.1's orthogonal family lifecycle: gap closure cannot advance family state,
   change authority, or bypass a machine transition receipt.

`docs/component-contract-authority.md` auto-merged. The follow-up clarification
makes “accepted Component Contract” a candidate-accepted target only: the
mapping does not set `canonical:true`, change authority, or bypass
`T10_PROMOTE_FAMILY_AND_ARCHETYPES`.

Main-only Product Atlas/action-map documents remain present and unchanged by the
worker lanes.

## Integrated local replay

The serial integrator replayed the complete current corpus against:

- read-only events commit `66bc0d43e36299417626f992021cfb7299ddf704`;
- prior 124-raster archive SHA-256
  `c677f69572ccdbf5b7f1402037a3cb8c164bd2f503fae35eae9168c46eb8d909`;
- closure 10-raster archive SHA-256
  `8bb8712effaa0ba3b08a672a784d9e1b90d876c6ca6d039a417bfc0617723523`.

Observed pre-freeze results:

- raw/canonical/alias: 279 / 222 / 57;
- analytical groups/components: 47 / 107;
- readiness: 47 `NOT_READY`, zero strict-ready, zero scored, empty first wave;
- Event Media: `NOT_READY_WITH_EXACT_BLOCKERS`;
- Medallions: `BOUNDARY_AND_TAXONOMY_REVIEW_REQUIRED`;
- Product Value: observe, 239 pending, zero promotion-ready;
- visual review: 134/134 with 124/10 durable lineage;
- lifecycle: 11 states / 10 transitions / `AS_IS_RECONSTRUCTED`;
- mutation proof: 14/14 targeted+aggregate named codes, 90 lane negatives,
  one excluded positive baseline, 104 total negatives, 15 baseline checks;
- lane negatives: raw 7, readiness 13, Event Media 8, Medallions 19,
  lifecycle 16, evidence/value 27;
- workflow registry/tests: 35 patterns, eight mandatory broad authorities,
  seven path-filter/ledger tests;
- Draft 2020-12 schemas, immutable Decoder/Behavioral inputs, independent raw
  Git census, Resource Graph, historical-v1 validator and secret scan pass;
- current and read-only events worktrees are clean after replay.

These are local pre-freeze observations. The exact-head Actions artifact is the
authoritative execution record and remains required.

## Residual gates

- Generate and commit the deterministic v1.1.1 receipt after all content files.
- Push the existing branch without force and retain PR #31 as open/draft.
- Obtain exact-head Actions result and download/verify its reproducibility
  artifact and `SHA256SUMS`.
- Complete a read-only checklist against that frozen head and artifact.
- Request a separate independent delta re-audit; merge stays unauthorized until
  its verdict.

## STOP

No `events-bot-new` file, production UI, `site/src`, `site/public`, Penpot,
prototype, token, component merge/split/delete, product entity, experiment
winner, target typography/media policy, family promotion or Product Value
enforce state is changed or authorized.
