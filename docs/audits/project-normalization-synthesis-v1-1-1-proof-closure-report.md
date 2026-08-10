# Project Normalization Synthesis v1.1.1 — proof-closure report

## Report state

**State:** `PROOF DEFINITIONS MATERIALIZED — EXACT-HEAD ACTIONS ATTESTATION REQUIRED`

This report describes the implementation evidence prepared for the reconciled
candidate. It is not an independent delta re-audit, does not authorize merge,
and does not turn a local run or a committed receipt literal into exact-head CI
evidence. The exact Git head, commands, exit codes, runtime versions, mutation
results and final clean statuses are intentionally delegated to the Actions
execution attestation produced after this report and the receipt are committed.

The controlling independent verdict for audited head
`bcdff9de56663bb77f15f32660ab0156c937e77b` remains:

- **`FAIL — SEMANTIC_REMEDIATION_PARTIALLY_PROVEN`**;
- **`BLOCKED — MERGE_NOT_AUTHORIZED`**.

Only an independent delta re-audit of the new frozen head may replace that
verdict.

## Immutable inputs and reconciliation lineage

- original synthesis base and merge base:
  `317938bc72cf7a47ea798b2614d92d3d285dd97a`;
- audited v1.1 head preserved in ancestry:
  `bcdff9de56663bb77f15f32660ab0156c937e77b`;
- main incorporated at reconciliation:
  `1daeb4f3ed2b86319b91e4e5b9d97a8691a72705`;
- non-rewriting reconciliation commit:
  `28a8449396cdfe4531302534d8e82fb9111378cd`;
- read-only product evidence:
  `onedayonemasterpiece/events-bot-new@66bc0d43e36299417626f992021cfb7299ddf704`;
- Behavioral manifest SHA-256:
  `c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1`.

The byte-preserved re-audit is
[`project-normalization-synthesis-v1-1-independent-red-team-reaudit.md`](project-normalization-synthesis-v1-1-independent-red-team-reaudit.md):
61,775 bytes, SHA-256
`7dfdb90abc7798a0c3c69db8d818f16ef803571bcac4ac32b921fd1514db3b41`.
All six findings are accepted in
[`project-normalization-synthesis-v1-1-reaudit-disposition.md`](project-normalization-synthesis-v1-1-reaudit-disposition.md).

## Six-finding implementation ledger

| Finding | Implementation state | Primary correction evidence | Exact-head evidence required from Actions | Residual limitation / next gate |
|---|---|---|---|---|
| REAUDIT-PN-001 | `IMPLEMENTED; EXECUTION ATTESTATION REQUIRED` | `structured-validation-error.mjs`, `validate-mutation-candidate.mjs`, `project-normalization-mutation-proof.mjs`, the 14-case catalog and its Draft 2020-12 schemas. Catalog SHA-256: `9426f8bd06f5637b0dd680c33b6f1613e4d1802a60f064c0167e587e7ada8cc4`. Every case names stable code, stage, record, path and diagnostic; aggregate rejection is separately required and cannot substitute for the targeted code. | Live mutation result must bind the final `GITHUB_SHA`, durations, 14/14 targeted rejections, 14/14 aggregate rejections, 14/14 expected=actual codes, 14 byte restorations and 15 baseline checks. | Named branch proof is not family readiness or merge authorization. |
| REAUDIT-PN-002 | `IMPLEMENTED; EXECUTION ATTESTATION REQUIRED` | The executable lane definitions are parsed into 7 raw + 13 readiness + 8 Event Media + 19 Medallions + 16 lifecycle + 27 evidence/value negatives; the Medallions positive baseline is classified separately. The committed synthesis receipt binds definitions and schemas but contains no literal lane/total result or execution-PASS object. | The live result must derive 90 lane negatives, one excluded positive baseline and 104 total negatives from the definitions/results; the attestation embeds that result verbatim and binds its hash. | Counts apply only to the exact recorded head/run. |
| REAUDIT-PN-003 | `IMPLEMENTED; EXECUTION ATTESTATION REQUIRED` | Workflow uses pinned action commits, exact requested Node/Python/jsonschema versions, a command ledger, clean secondary design/events checkouts, deterministic Git archives/bundles, replay script and checksummed artifact. `build-workflow-attestation.mjs` validates both audit inputs, source identities, mutation result and final checkout cleanliness. Runtime provenance has its own Draft 2020-12 contract: an exposed runner semantic version is recorded exactly; when GitHub-hosted infrastructure does not expose it, the closed status is `not_exposed_by_hosted_runner` and runner/image name, OS, architecture, environment and image version remain mandatory. | The exact-head job must publish and schema-validate `project-normalization-v1-1-execution-attestation.json`, `project-normalization-v1-1-mutation-results.json`, `command-ledger.jsonl`, `versions.json`, `replay.sh`, both bundles/archives and `SHA256SUMS`; both final Git statuses must be empty. | Actions evidence is first-party reproducibility evidence, not independent review. |
| REAUDIT-PN-004 | `IMPLEMENTED; EXACT-HEAD CHECKLIST EXTERNAL` | `.codex/integration/project-normalization-synthesis-v1-1/CHECKLIST_REVIEW.md` is explicitly `historical_non_authoritative`, binds reviewed head `e005a1c3fa5ffda07a8e76d994aa1d96b53ec45b`, and is superseded by the exact-head Actions attestation. | A later read-only reviewer must derive the current output count and hashes from the v1.1.1 receipt/attestation rather than copying the historical 72-output count. | A checklist cannot approve itself or replace the independent delta re-audit. |
| MERGE-PN-001 | `RECONCILED; DELTA RE-AUDIT REQUIRED` | The normal merge retains both parents and audited ancestry. The sole conflict in `docs/resource-graph-004.md` preserves main’s action-map evidence lifecycle and v1.1’s orthogonal 11-state family lifecycle. `docs/component-contract-authority.md` retains main observability while clarifying candidate acceptance cannot set canonical authority or bypass `T10_PROMOTE_FAMILY_AND_ARCHETYPES`. | The exact-head replay must regenerate/check every catalog, dossier, census, archive, schema, lifecycle and receipt and record the final clean state. | Reconciliation creates a new audit target; PR merge remains unauthorized pending independent delta verdict. |
| MERGE-PN-002 | `IMPLEMENTED; TRIGGER/CI EVIDENCE REQUIRED` | Machine registry `project-normalization-v1-1-input-paths.json` is schema-bound. Push and pull-request filters must equal its 35 patterns and retain eight mandatory broad authority roots, including `contracts/**`; omission/duplication/drift negatives are executable. | Final CI must run from a change set containing both formerly missed contract inputs and publish the filter-validator command/exit in the ledger. | Trigger coverage proves scheduling, not validation correctness. |

No row is declared independently closed by this report.

## Local pre-freeze replay

Before receipt materialization, the reconciled working tree was replayed locally
against the exact read-only product commit and both immutable visual archives.
The following evidence was observed and must be reproduced by Actions on the
final head:

- 279 raw identities, 222 canonical findings, 57 typed aliases;
- 47 analytical groups, 107 component memberships;
- 47 `NOT_READY`, zero scored, empty first wave;
- Event Media `NOT_READY_WITH_EXACT_BLOCKERS` with 12 exact blockers;
- Medallions `BOUNDARY_AND_TAXONOMY_REVIEW_REQUIRED`;
- Product Value gate `observe`, 239 pending applications, zero promotion-ready;
- 134 visual-review/archive entries verified across the 124/10 release lineage;
- 11 lifecycle states, 10 transitions, current `AS_IS_RECONSTRUCTED`;
- 14 mandatory targeted and aggregate mutations with exact named codes;
- 90 prior-lane negatives, one excluded positive baseline, 104 total negatives;
- workflow filter registry 35 patterns / eight mandatory authorities and ten
  path-filter/ledger/runner-provenance tests;
- Draft 2020-12 schemas and strict secret scan;
- no forbidden production UI, Penpot, prototype, token, component-operation,
  product-model, experiment-winner or promotion change.

This local replay is compatibility evidence, not the exact-head Actions result.
The committed receipt therefore records these corpus facts and definition
hashes, but deliberately says the execution attestation is externally required.

## Reproducibility and diff contract

The exact-head workflow separates two gates:

1. `git diff --check` for the full committed range from
   `317938bc72cf7a47ea798b2614d92d3d285dd97a`, excluding only the two exact
   byte-preserved audit inputs;
2. independent byte/size checks for:
   - original audit: 8,046 bytes / SHA-256
     `a466ae5ff4846a1895eb11429c2fe4f175115a119dc9904d5a4a4e50a9507f76`;
   - v1.1 re-audit: 61,775 bytes / SHA-256
     `7dfdb90abc7798a0c3c69db8d818f16ef803571bcac4ac32b921fd1514db3b41`.

The second exception is necessary because the user-supplied re-audit is also a
mandatory byte-for-byte input and contains preserved whitespace. No directory
or third-file exception is permitted.

## Receipt and external attestation boundary

`receipts/normalization/project-normalization-synthesis-v1-1.json` is a
content/definition manifest. It binds reconciliation lineage, both audits,
mutation definitions and schemas, workflow input registry, replay/attestation
contracts, corpus facts, strict STOP constraints and every remediation output.
It does **not** assert exact-head command success, CI run identity, derived live
mutation totals, clean checkout outcome or independent review.

The authoritative execution outcome belongs only to the Actions artifact named
`project-normalization-v1-1-reproducibility-${GITHUB_RUN_ID}`. The artifact is
transport evidence with finite retention, not a replacement for Git history or
an independent verdict.

## Handoff boundary

After an exact-head Actions attestation satisfies the contract, the only allowed
implementation/handoff statements are:

- `PROJECT_NORMALIZATION_SYNTHESIS_V1_1_1_PROOF_CLOSURE_COMPLETE`;
- `READY_FOR_INDEPENDENT_DELTA_REAUDIT`.

They do not mean independently approved, merge-ready, normalization-authorized,
product-value-validated, Penpot-authorized or design-system-complete. Draft PR
#31 must remain open, draft and unmerged until a separate independent delta
re-audit issues its own verdict.
