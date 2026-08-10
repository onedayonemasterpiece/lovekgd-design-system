# Project Normalization Synthesis v1.1.1 — proof-closure report

## Report state

**State:** `DRAFT — PROOF CLOSURE NOT YET ESTABLISHED`

This is the evidence ledger to be completed against the final reconciled commit.
It is not an independent re-audit, not a self-issued closure verdict, and not
merge authorization. Planned paths and pending runs are named so that later
integration cannot replace primary evidence with a summary.

Authoritative inputs:

- audited v1.1 head:
  `bcdff9de56663bb77f15f32660ab0156c937e77b`;
- byte-preserved independent report:
  [`project-normalization-synthesis-v1-1-independent-red-team-reaudit.md`](project-normalization-synthesis-v1-1-independent-red-team-reaudit.md),
  61,775 bytes, SHA-256
  `7dfdb90abc7798a0c3c69db8d818f16ef803571bcac4ac32b921fd1514db3b41`;
- accepted six-finding ledger:
  [`project-normalization-synthesis-v1-1-reaudit-disposition.md`](project-normalization-synthesis-v1-1-reaudit-disposition.md);
- future reconciled candidate SHA, incorporated `main` SHA, final receipt SHA and
  CI run IDs: **pending integration**.

The retained independent verdict is:

- **`FAIL — SEMANTIC_REMEDIATION_PARTIALLY_PROVEN`** for exact-head semantics;
- **`BLOCKED — MERGE_NOT_AUTHORIZED`** for merge readiness.

Nothing in this draft changes those verdicts. Only a later independent delta
re-audit over the frozen reconciled candidate may issue a replacement verdict.

## Evidence acceptance rules

A finding can move from `PENDING` only when the report identifies primary,
SHA-bound evidence that can be replayed. A prose integration summary, committed
receipt literal, green badge without its run artifact, or checklist written
before the final exact head is frozen is insufficient. Every execution claim
must be derived from results and must identify command, runtime, exit code,
source SHA and artifact hash.

The historical implementation checklist at
`.codex/integration/project-normalization-synthesis-v1-1/CHECKLIST_REVIEW.md`
reviewed `e005a1c3fa5ffda07a8e76d994aa1d96b53ec45b` and recorded 72 receipt
outputs. It is explicitly historical for v1.1.1: it is not evidence for audited
head `bcdff9de…`, for the future reconciled candidate, or for delta re-audit.
A new read-only checklist is pending after the integration head and CI artifacts
are final, and that checklist will still not be the independent delta re-audit.

## Six-finding proof ledger

| Finding | Current state | Correction evidence required | Validation evidence required | Residual limitation / next gate |
|---|---|---|---|---|
| REAUDIT-PN-001 | `PENDING` | Stable structured error codes in the validator plus a generated 14-case catalog binding each mutation to its expected code. **Evidence refs:** L2 mutation-proof commit and exact artifact paths pending. | Exact-SHA results must show 14/14 aggregate rejection and 14/14 `expected_error_code == actual_error_code`; local and CI commands/exits/artifact hashes pending. | Named branch proof does not establish component readiness. Independent delta re-audit remains pending. |
| REAUDIT-PN-002 | `PENDING` | Generated mutation definitions/results with positive baselines typed separately; receipt builder/receipt no longer self-assert execution PASS or literal negative counts. **Evidence refs:** L2 artifacts and L0 final receipt/attestation pending. | Results must derive 90 lane negatives and 104 total negatives for the audited corpus, exclude the positive baseline and fail on any catalog/result/count mismatch. Final candidate counts must be derived again rather than copied from this paragraph. | Counts bind only the recorded candidate/run. Independent delta re-audit remains pending. |
| REAUDIT-PN-003 | `PENDING` | Exact-SHA clean replay workflow/helpers, machine-readable provenance, and separate committed-range/audit-byte gates. **Evidence refs:** L3 commit, workflow run and replay artifact pending. | Record Node/Python versions, commands/exits, immutable replay, census, archive 134/134, schemas, secret scan, diff result, artifact hashes and empty final status for both checkouts. | A CI replay is first-party execution evidence, not independent review. Independent delta re-audit remains pending. |
| REAUDIT-PN-004 | `PENDING` | Historical-checklist notice plus new exact-head proof ledger, integration report and post-freeze read-only checklist derived from the final receipt inventory. **Evidence refs:** this draft provides the notice; final L0/L4 reports and output count are pending. | New checklist must name the reconciled SHA and completed run artifacts, and its output inventory must equal the final receipt rather than a literal carried from v1.1. | Implementation checklist review cannot self-close the audit. Independent delta re-audit remains pending. |
| MERGE-PN-001 | `PENDING — BLOCKER` | Non-rewriting merge of current `main`, semantic conflict disposition, regenerated corpus/receipt, and proof that `bcdff9de…` remains an ancestor. **Evidence refs:** L0 merge commit, ancestry transcript and conflict record pending. | Full local and CI replay on the new candidate, clean status, frozen SHAs and independent delta comparison of audited head, incorporated `main` and reconciled head. | Any reconciliation creates a new audit target. Merge remains unauthorized until the independent delta verdict. |
| MERGE-PN-002 | `PENDING` | Workflow filters covering both named omitted contracts plus an authoritative validated input-path registry. **Evidence refs:** L3 workflow/registry/tests pending. | Filter-consistency negatives must reject each omission; CI trigger evidence for contract-only deltas and the final exact-SHA workflow run are pending. | Scheduling coverage is not a successful validation result or an independent verdict. |

No row is marked closed in this draft.

## Reconciled-head minimum evidence matrix

The independent report requires every item below before a new merge verdict. The
status is intentionally conservative until a primary artifact is attached.

| # | Required evidence | Status | Primary reference to attach |
|---:|---|---|---|
| 1 | Exact reconciled commit SHA, incorporated `main` SHA, merge base and proof that `bcdff9de…` is an ancestor | `PENDING` | merge/ancestry transcript |
| 2 | Full positive-validator replay | `PENDING` | exact-SHA local results and CI job artifact |
| 3 | Full Draft 2020-12 schema validation | `PENDING` | command/exit/result artifact |
| 4 | Release archive replay, 134/134 entry hashes and bytes | `PENDING` | archive replay result artifact |
| 5 | Immutable Decoder and Behavioral verification | `PENDING` | pinned-tree/manifest replay result |
| 6 | External Git census replay | `PENDING` | pinned product SHA and census result |
| 7 | Secret scan | `PENDING` | command/exit/log artifact |
| 8 | Full committed-range diff check with exactly named, size/hash-verified audit-byte exceptions | `PENDING` | diff-gate result plus both file hashes/sizes |
| 9 | Empty final status for design-system and pinned product checkout | `PENDING` | final `git status --porcelain` outputs |
| 10 | Fourteen mandatory mutations rejected by their named diagnostics | `PENDING` | generated catalog/results and attestation |
| 11 | Factual lane and aggregate negative counts derived from executable results | `PENDING` | generated results and final receipt/attestation binding |
| 12 | Independent delta re-audit of `bcdff9de…`, incorporated `main` and reconciled head | `PENDING — EXTERNAL GATE` | independent report with verdict |

In addition, workflow input coverage, runtime versions, commands, exit codes,
artifact hashes, final receipt inventory and a post-freeze read-only checklist
must be attached before handoff. They do not replace any of the twelve rows.

## Preserved semantic boundary to revalidate

The source report found no corrupted core partition/readiness state or fail-open
normalization at `bcdff9de…`; that statement is not automatically inherited by a
new commit. The reconciled replay and delta re-audit must re-establish the
279-identity exact-once partition into 222 findings, 57 typed aliases, 47
`NOT_READY` groups, zero scored/selected groups, blocked Event Media and
medallions, observe-mode Product Value, preserved unreachable implementations,
immutable evidence and archive lineage.

This v1.1.1 work is proof remediation only. Production UI, Penpot, prototypes,
tokens, component semantics, product entities, experiments, migration,
decommissioning, promotion and physical normalization remain outside scope.

## Merge and closure decision

Until all primary evidence is attached and the independent delta re-audit issues
its own verdict:

- draft PR #31 must remain open and unmerged;
- the future reconciled commit remains an unaudited candidate;
- a green local or CI summary must not be rewritten as audit closure;
- this report must remain `DRAFT — PROOF CLOSURE NOT YET ESTABLISHED`;
- the controlling verdict remains **`FAIL — SEMANTIC_REMEDIATION_PARTIALLY_PROVEN`**
  and **`BLOCKED — MERGE_NOT_AUTHORIZED`**.
