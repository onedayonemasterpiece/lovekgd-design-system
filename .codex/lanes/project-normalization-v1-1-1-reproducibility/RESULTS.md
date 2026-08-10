# L3 reproducibility/workflow lane results

## Status

committed; exact-head Actions replay remains integration-owned

## Scope

- Branch: `agent/project-normalization-v1-1-1/reproducibility`
- Base: `77dd3e5be3531b9bcb11efb3c8c5b3eff8344275`
- Requirements: R07, R08, R09
- No catalog, audit, synthesis receipt, receipt builder, root aggregate
  validator, UI, Penpot, prototype, token, component, product-model or
  experiment-decision file was changed.

## Delivered

1. Replaced the direct checkout run with an exact-SHA replay in fresh sibling
   design and events checkouts. Both are checked before and after the full
   historical/current validator and negative-test corpus.
2. Pinned `actions/checkout`, `actions/setup-node`, `actions/setup-python` and
   `actions/upload-artifact` by commit; requested exact Node `22.18.0`, Python
   `3.13.7`, jsonschema `4.25.1` and exact dependency versions.
3. Added a command wrapper that records ordered argv, logical cwd, start/end,
   duration, exit code, signal, and stdout/stderr byte counts and SHA-256. It
   never serializes the process environment.
4. Added exact-head attestation materialization. `versions.json` records the
   resolved Git, Node, Python, jsonschema/dependency, Actions runner, runner
   image, OS and architecture versions.
5. Captures the L2 mutation harness's single stdout JSON verbatim as
   `project-normalization-v1-1-mutation-results.json`, verifies its live head,
   timings, 14/14 targeted and aggregate expected-code matches, derived
   `90 + 14 = 104` negative count, one positive baseline, 15 baseline checks,
   disabled receipt validation, and catalog hash, then embeds that result in
   the execution attestation.
6. Packages the design and events Git bundles, deterministic Git archives,
   exact visual inputs, replay script, ledger/logs, versions, result JSONs and
   a sorted `SHA256SUMS`. The attestation explicitly disclaims immutability of
   the upload transport/retention.
7. Splits the committed-range whitespace gate from audit preservation:
   `git diff --check 317938bc..GITHUB_SHA` excludes exactly the old audit and
   the new re-audit, while the attestation independently verifies old
   `8046/a466ae...` and new
   `61775/7dfdb90abc7798a0c3c69db8d818f16ef803571bcac4ac32b921fd1514db3b41`
   bytes/SHA-256.
8. Added a machine input-path registry. Both `push` and `pull_request` path
   lists must equal it exactly and include the mandatory broad authorities:
   `contracts/**`, `catalog/normalization/**`, `docs/normalization/**`,
   `docs/audits/**`, `receipts/normalization/**`,
   `scripts/normalization-v1-1/**`, `tests/**`, and the exact workflow.
9. The workflow uploads
   `project-normalization-v1-1-reproducibility-${GITHUB_RUN_ID}` even after a
   replay failure, then enforces the replay result after evidence upload.

## Files changed

- `.github/workflows/project-normalization-synthesis-v1-1.yml`
- `contracts/normalization/project-normalization-v1-1-input-paths.json`
- `contracts/normalization/project-normalization-v1-1-input-paths.schema.json`
- `contracts/normalization/project-normalization-v1-1-execution-attestation.v1.schema.json`
- `scripts/normalization-v1-1/validate-workflow-path-filters.mjs`
- `scripts/normalization-v1-1/workflow-command-ledger.mjs`
- `scripts/normalization-v1-1/build-workflow-attestation.mjs`
- `scripts/normalization-v1-1/replay-normalization-workflow.sh`
- `tests/project-normalization-v1-1-workflow-path-filters.mjs`
- `.codex/lanes/project-normalization-v1-1-1-reproducibility/RESULTS.md`

## Worker verification

```text
node scripts/normalization-v1-1/validate-workflow-path-filters.mjs --root .
  PASS; 35 registered patterns, 8 mandatory broad authorities
node --test tests/project-normalization-v1-1-workflow-path-filters.mjs
  PASS; 7/7 including push/PR omissions, duplicate/drift, weakened registry,
  parser failure, stdout capture and exact nonzero ledger exit
bash -n scripts/normalization-v1-1/replay-normalization-workflow.sh
node --check scripts/normalization-v1-1/{validate-workflow-path-filters,workflow-command-ledger,build-workflow-attestation}.mjs
python3 -m json.tool on both input-path contracts and the attestation schema
git diff --check
  PASS
```

Isolated compatibility fixtures applied the candidate L3 files without
writing either dependency lane here:

- with L1 commit `fe12b3f`, the input attestation verified both audit byte/hash
  pairs, 88 committed
  changed paths, zero forbidden paths and clean design/events checkouts;
- after additionally applying the L2 branch tip, its default mutation CLI
  emitted one schema-bound JSON line with
  14/14 cases, all exact targeted/aggregate codes, 90 lane negatives, one
  positive baseline, 104 total negatives, 15 baseline checks and its runtime
  fixture head on every case.

That fixture is compatibility evidence only. This committed file deliberately
does **not** assert an exact-head workflow PASS. The authoritative execution
attestation and artifact hashes can only be generated by Actions after L0 has
merged L1, L2, L3, current `main`, and regenerated the integration-owned
receipt. The replay fails closed if any of those exact-head inputs drift.

## Integration notes

- Do not invoke the L2 author-only `--write-catalog` option in CI; the replay
  calls the default check command and validates the live catalog hash.
- Preserve the exact runtime artifact names:
  `project-normalization-v1-1-mutation-results.json`,
  `project-normalization-v1-1-execution-attestation.json`, `versions.json`,
  `command-ledger.jsonl`, `replay.sh`, and `SHA256SUMS`.
- The new re-audit must exist at
  `docs/audits/project-normalization-synthesis-v1-1-independent-red-team-reaudit.md`
  before any exact-head replay can pass.
