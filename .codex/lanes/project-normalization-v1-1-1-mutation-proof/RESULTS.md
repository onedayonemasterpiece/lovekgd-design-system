# Lane project-normalization-v1-1-1-mutation-proof Results

## Status

committed

## Requirement IDs

- R03 — Prove all 14 mandatory mutations by stable targeted error codes.
- R04 — Generate mutation evidence and derive the lane mutation counts from definitions.

## Branch

`agent/project-normalization-v1-1-1/mutation-proof`

## Worktree

`/home/dev/.codex/worktrees/lovekgd-design-system/pn-v1-1-1-mutation-proof`

## Base SHA

`77dd3e5be3531b9bcb11efb3c8c5b3eff8344275`

## Head SHA

The committed branch tip containing this file is authoritative; resolve it with
`git rev-parse agent/project-normalization-v1-1-1/mutation-proof`.

## Files changed

- `scripts/normalization-v1-1/structured-validation-error.mjs`
- `scripts/normalization-v1-1/validate-mutation-candidate.mjs`
- `scripts/normalization-v1-1/project-normalization-mutation-proof.mjs`
- `tests/project-normalization-synthesis-v1-1-negative.mjs`
- `contracts/normalization/project-normalization-mutation-catalog.v1.schema.json`
- `contracts/normalization/project-normalization-mutation-run.v1.schema.json`
- `receipts/normalization/project-normalization-v1-1-mutation-catalog.json`
- `.codex/lanes/project-normalization-v1-1-1-mutation-proof/RESULTS.md`

## Delivered

- Added `NormalizationValidationError` with stable `code`, `stage`, `record`,
  `path`, and `diagnostic` fields.
- Added candidate-level validators for all 14 mandatory cases. Every case
  reaches its exact expected code before the aggregate validator is invoked.
- Kept the aggregate validator as an independent rejection gate with
  `--fixture-mode --skip-receipt --semantic-only`; generic regeneration
  diagnostics are explicitly not counted as the named proof.
- Restores every mutated file byte-for-byte in `finally`, then reruns both the
  targeted validator and the aggregate baseline after each case.
- Generates a deterministic machine catalog and a schema-bound stdout result.
  The default command checks committed bytes; `--write-catalog` is author-only.
- Binds the live stdout run and every case to the exact Git head and records
  measured per-case and aggregate durations for Actions attestation.
- Discovers and classifies the six existing lane suites from their source
  definitions: `7 + 13 + 8 + 19 + 16 + 27 = 90` negative mutations. The one
  Medallions `node:test` positive baseline is discovered separately, so the
  total negative corpus is `14 + 90 = 104`.

## Commands run

```text
node tests/project-normalization-synthesis-v1-1-negative.mjs . --write-catalog
node tests/project-normalization-synthesis-v1-1-negative.mjs .
node scripts/normalization-v1-1/build-raw-partition.mjs --check --self-test
node scripts/normalization-v1-1/build-registry-readiness.mjs --check --self-test
node tests/normalization-v1-1-registry-readiness.mjs
node scripts/normalization-v1-1/test-event-media-dossier-validator.mjs .
node --test scripts/validate-project-normalization-v1-1-medallions-navigation.test.mjs
node tests/family-lifecycle-v1-negative.mjs .
node scripts/test-evidence-value-gates-v1-1-negative.mjs .
python3 scripts/validate-normalization-schemas-v1-1.py .
node scripts/validate-project-normalization-synthesis-v1-1.mjs . --fixture-mode --skip-receipt --semantic-only
python3 Draft202012Validator checks for the mutation catalog and run schemas
git diff --check
```

## Tests / verification

- Mandatory proof: PASS, 14/14 targeted rejections, 14/14 aggregate
  rejections, 14/14 exact expected/actual error-code matches.
- Receipt validation: disabled for all 14 aggregate mutation runs and all 15
  aggregate baseline runs.
- Mutation restoration: 14/14 byte-exact; baseline PASS initially and after
  each case (`baseline_rechecks=15`).
- Derived prior-lane negative count: 90; positive Medallions baseline: 1;
  complete negative corpus: 104.
- Existing lane suites: 7 raw + 13 registry/readiness + 8 Event Media +
  19 Medallions/navigation + 16 lifecycle + 27 evidence/product value; all PASS.
- Draft 2020-12 mutation catalog and stdout run schemas: PASS.
- Generated catalog SHA-256:
  `fe239c2f4549e8759c13d6a1823aabe775492d51251fb70bdaf98f2196fe1892`.

## Risks

- The aggregate validator remains integration-owned. Its exact diagnostic text
  is deliberately excluded from the deterministic catalog; only its nonzero
  validator exit is required. Named proof comes solely from the structured
  candidate-level validator.
- The catalog is a deterministic definition/proof artifact, not a CI
  attestation. L3 owns exact-head replay and CI result capture.

## Merge notes

- This lane does not modify the root aggregate validator, receipt builder,
  main synthesis receipt, workflow, proof report, UI, Penpot, tokens,
  components, product model, or experiment decisions.
- Preserve the aggregate CLI flags used here when reconciling the root
  validator: `<fixture-root> --fixture-mode --skip-receipt --semantic-only`.
- After cherry-pick, run the default mutation command without
  `--write-catalog`; a deterministic catalog mismatch must fail integration.
