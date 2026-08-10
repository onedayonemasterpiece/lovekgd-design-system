# Lane event-media-blocker-validation Results

## Status

`committed`

Terminal task status: `EVENT_MEDIA_BLOCKER_CLOSURE_INCOMPLETE`.

## Requirement IDs

- **R08 — Done:** strict schemas, exact semantic joins, deterministic receipt
  inputs, mutation proof, owner-facing docs, current closure CI, frozen PR #32
  workflow transition and the one exact Project Normalization prototype bridge.

## Branch / worktree / base

- Branch: `agent/event-media-blocker-closure-v1/validation`
- Worktree:
  `/home/dev/.codex/worktrees/lovekgd-design-system/event-media-blocker-validation`
- Lane base: `e04d364ac404c516cb32f4621cbaa845f826180e`
- Implementation commit: `5abe987905c83f8784ec00f8701df0d93807effa`
- Final branch tip: resolve with
  `git rev-parse agent/event-media-blocker-closure-v1/validation`; this result
  file cannot contain its own commit object ID.

## Files changed

Only the assigned L5 scope:

- `.github/workflows/event-media-blocker-closure-v1.yml`
- `.github/workflows/event-media-contract-decision-v1.yml`
- `contracts/normalization/event-media-blocker-closure-catalog.v1.schema.json`
- `contracts/normalization/event-media-blocker-closure-prototype.v1.schema.json`
- `contracts/normalization/event-media-blocker-closure-receipt.v1.schema.json`
- `docs/normalization/event-media-blocker-closure-v1.md`
- `docs/normalization/event-media-owner-decision-pack.md`
- `scripts/event-media-blocker-closure-v1/lib.mjs`
- `scripts/event-media-blocker-closure-v1/receipt.mjs`
- `scripts/event-media-blocker-closure-v1/structured-error.mjs`
- `scripts/event-media-blocker-closure-v1/validate-schemas.py`
- `scripts/build-event-media-blocker-closure-v1-receipt.mjs`
- `scripts/validate-event-media-blocker-closure-v1.mjs`
- `scripts/validate-project-normalization-synthesis-v1-1.mjs`
- `tests/event-media-blocker-closure-v1-negative.mjs`
- `tests/event-media-blocker-closure-v1-workflow-path-filters.mjs`
- `.codex/lanes/event-media-blocker-validation/RESULTS.md`

The final receipt path was not created or edited. No PR #32 catalog, old
receipt, old validator, production UI, `site/src`, `site/public`, Penpot,
token, archetype, experiment, migration or candidate contract was changed.

## Delivered contracts and fail-closed joins

- Three Draft 2020-12 schemas cover all seven new JSONL kinds and the receipt.
  Every object schema, including dynamic file maps, has
  `additionalProperties: false`.
- Frozen PR #32 byte hashes/counts, audited head, merge main and exact merge
  parents are recomputed. The old receipt remains byte-bound at SHA-256
  `d84f55217fbd0745334f81a737acaedc171231a053ae57f28278cf41db67df8e`.
- Every derived blocker is rebound to the frozen source row hash, exact source
  wording, affected abstract consumers, required evidence, source status and
  the 52-row concrete application namespace.
- Closed statuses require a receipt, zero missing facts, direct satisfying
  evidence and runtime/specimen proof. Open statuses require exact missing
  facts and reject satisfying evidence/receipts. Current result is exactly
  three `owner_decision_required`, nine
  `still_open_with_exact_missing_evidence`, zero resolved and zero invalidated.
- Three owner blockers join three separate pending cards; their nine options
  are unselected, unaccepted and each binds the identical ordered 13-fixture
  set, two viewports and its exact deterministic board.
- Thirteen fixtures join exactly nine vendored assets and nine immutable,
  full-resolution-reviewed Behavioral bindings. Every and only four prototype
  PNGs join the exact four-row review ledger with bytes, SHA-256, dimensions,
  card/options/fixtures/viewports and substantive review conclusions.
- Readiness recomputes candidate identity, boundary, path, version, file hash,
  frozen candidate blocker relevance, terminal dispositions and pending owner
  cards. Exact result: three candidates × 23 checks = 33 `PASS`, 33 `BLOCKED`,
  3 `NOT_APPLICABLE_WITH_REASON`; 0 ready and 3 not ready.
- Product Value remains `observe` / `pending_product_model` /
  `promotion_ready=false`, no product/archetype/metric IDs exist, and all six
  experiments remain `NOT_MERGED`.

## Receipt boundary

The deterministic builder binds:

- merged main `3cbe35326ead04ac67070e5b400d30d9edc6eb01`;
- audited head `20eab45534e2c64497e4db661e6a5ca8582229ea`;
- merge parents `45288b001d724e0d3603d0c44d392ff370407bd0`
  and `20eab45534e2c64497e4db661e6a5ca8582229ea`;
- exact frozen PR #32 files/counts/hashes;
- exact nine incomplete blocker IDs and all exact missing-fact strings;
- every new output path, byte count, SHA-256 and JSONL record count;
- protected trees and Draft PR #33 metadata.

The receipt self-excludes and contains
`committed_receipt_asserts_ci_pass=false`; GitHub Actions metadata/artifacts are
external execution evidence. L0 must materialize the canonical receipt in a
final receipt-only commit with `--write`. A clean temp clone at the
implementation commit deterministically produced and rechecked a 47-output,
6,090,612-byte pre-L0 receipt, then validated it against the strict receipt
schema. The final integrated count/bytes will increase for L0 integration
outputs and must be regenerated, not copied from this lane result.

## Workflow transition

- The new closure workflow checks out the exact PR head, verifies merge
  parents, fetches non-shallow/full events ancestry at `66bc0d43...`, pins Node
  22.18.0, Python 3.13.7, jsonschema 4.25.1 and Playwright 1.58.2 with exact
  Chromium installation, renders twice under `RUNNER_TEMP`, byte-compares both
  runs and committed boards, validates all contracts/joins/receipt/mutations,
  scans secrets, checks clean trees and uploads generated boards/results.
  Push and pull-request concurrency are separated and CI never writes the
  repository.
- The prior workflow is historical-only: it checks out exact audited head
  `20eab455...` and validates the unchanged old schemas, receipt and mutation
  proof there. It never skips the frozen receipt.
- Current-head authority belongs only to the new closure workflow.
- The Project Normalization validator permits only
  `prototypes/event-media-decision-pack/**`; every other prototype and every
  Penpot path remains rejected. Negative path proof covers all three classes.

## Commands run

```text
python3 scripts/event-media-blocker-closure-v1/validate-schemas.py --root . --skip-receipt
node scripts/validate-event-media-blocker-closure-v1.mjs --root . --events-repo <exact-events> --skip-receipt
node tests/event-media-blocker-closure-v1-negative.mjs
node tests/event-media-blocker-closure-v1-workflow-path-filters.mjs
python3 prototypes/event-media-decision-pack/scripts/validate.py --events-root <exact-events>
python3 prototypes/event-media-decision-pack/scripts/build-index.py --output <temp>
node prototypes/event-media-decision-pack/scripts/render.mjs --output-dir <temp-a>
node prototypes/event-media-decision-pack/scripts/render.mjs --output-dir <temp-b>
cmp <temp-a>/<board> <temp-b>/<board>
cmp <temp-a>/<board> prototypes/event-media-decision-pack/screenshots/<board>
node scripts/validate-project-normalization-synthesis-v1-1.mjs . --events-repo <exact-events> --skip-receipt --semantic-only
python3 scripts/scan-normalization-v1-1-secrets.py . 3cbe35326ead04ac67070e5b400d30d9edc6eb01
python3/jsonschema strict validation of the temporary receipt
node build receipt --output <temp>; node build receipt --check <temp>
node/python/git replay in a clean local clone
node/python frozen PR #32 schema/semantic/receipt/negative/filter replay at exact 20eab455...
git diff --check <lane-implementation-parent>...HEAD --
```

## Tests / verification

- New schema validation: **PASS**, 53 JSONL rows, three strict schemas.
- New semantic validation: **PASS** with the exact incomplete result and all
  derived counts above.
- New semantic/schema/receipt/path negative suite: **PASS, 25/25**, restoring
  and revalidating the baseline after every file mutation.
- Workflow filter/action/runtime/repository-write mutations: **PASS, 4/4**.
- Workflow coverage: **PASS**, 17 equal push/PR patterns covering 31 required
  inputs; all action/runtime pins exact.
- Prototype validator: **PASS**, three boards, nine options, 13 fixtures, nine
  assets, nine Behavioral bindings, four PNGs and four review rows.
- HTML rebuild: **byte-identical**.
- Render A/B/committed: **byte-identical** for all three boards; Playwright
  1.58.2 / Chromium 145.0.7632.6, local requests only, zero network requests.
- Current Project Normalization semantic bridge: **PASS**.
- Frozen PR #32 exact-head schemas, semantic joins, receipt, mutation proof and
  workflow filters: **PASS** with receipt validation enabled.
- Secret scan: **PASS**, 47 changed text/binary paths considered, zero matches.
- Temp-clone semantic/receipt rebuild/schema/recheck and clean status: **PASS**.
- L5-owned diff check and clean worktree: **PASS**.

## Risks / merge notes

- The canonical receipt is intentionally absent until L0 integrates every lane
  and PR #33 metadata, then creates the final receipt-only commit.
- GitHub Actions has not yet executed this new workflow; the committed receipt
  must not be edited later to claim a CI result.
- A full pre-integration diff check found two trailing-space pairs in L0's
  execution matrix. L0 confirmed they were removed in the integration
  worktree; they are outside this lane branch. The integrator must run the full
  range check after cherry-pick.
- Cross-host raster identity depends on the pinned Playwright/browser/font
  environment installed by the workflow; local exact byte identity was proved
  on the recorded central environment.
- All nine evidence blockers remain real. Do not upgrade the terminal status or
  claim readiness for owner decisions until their exact missing facts are
  directly satisfied and the positive gate is replayed.

## Merge notes

Cherry-pick the implementation commit and the immediately following RESULTS
commit. After integration, run the full commands above, materialize the receipt
once from the clean integrated parent, commit only that receipt, and rerun the
new exact-head workflow.
