# Event Media validation lane L5 — results

## Scope

Owned delivery/validation lane for Event Media boundary and contract decision v1. No L1–L4 catalog/candidate/readiness output was authored here; cross-lane corrections were integrated as separate dependency commits. No final receipt, Penpot, prototype or production file was changed.

## Result

- Strict semantic validation: **PASS**.
- Final statuses: `EVENT_MEDIA_BOUNDARY_MODEL_COMPLETE` and `EVENT_MEDIA_NOT_READY_WITH_EXACT_BLOCKERS`.
- Exact facts: 52 consumers, 23 semantic records, 31 boundaries, 12 exact blockers, 3 candidate contracts, 31 alternatives, 3 readiness rows, 2 owner questions, 23 readiness checks per candidate.
- Readiness: 0 ready / 3 blocked; global baseline 47/47 not ready, 0 scored, 0 first-wave; 239 Product Value rows pending; six experiments `NOT_MERGED`.
- Negative suite: exactly 56 named cases; 54 aggregate semantic rejections plus 2 STOP path rejections; stable expected/actual `EMV_*` codes; baseline restored.
- Receipt is intentionally absent for L0 Draft-PR metadata materialization. Default schema, validator and builder commands reject absence with `EMV_RECEIPT_MISSING`; `--skip-receipt` is explicit and limited to pre-receipt/local or current-head legacy semantic validation.

## Dependency commits kept separate

| Upstream correction | Local cherry-pick | Purpose |
|---|---|---|
| `2a57ce6dcce0aa3b5bd6301111d1a808ea94ff01` | `dbdfb99` | authoritative design base = exact `45288b…` |
| `f4db09a8e0d081bb201e2f182bfba74b14f8622d` | `0716904` | deduplicate exact test evidence refs |
| `f8fbce98eea2f417347033040f0facdf4d81e475` | `60b14fd` | join viewer to `EM-LABRAIL-011` |
| `62da2649d85b0eb3ccbf7ef433e213eaf180783f` | `5f5d55e` | refresh viewer candidate/readiness hash |
| `96c779e7a8a1960705495edf3cdf0318a8723d27` | `16794a8` | join viewer candidate to rail owner question |
| `98409e9c8445bf58d3bc123265605865c83c1c27` | `05dcd32` | refresh final viewer candidate/readiness hash |

L5-owned commits begin with `f7d3216` (`structured-validation-error.mjs` and initial semantic library) and the final L5 commit reported in the handoff.

## Commands executed

All commands used the clean exact events checkout at `/home/dev/.codex/worktrees/events-bot-new/action-map-design-pinned-events` and, where required, exact verified archives:

- `python3 scripts/validate-event-media-contract-decision-schemas-v1.py --root . --skip-receipt` — PASS, Draft 2020-12, exact 52/23/31/12/31/3/2 catalog counts plus 3 candidates.
- `node scripts/validate-event-media-contract-decision-v1.mjs --root . --events-repo <exact-events> --skip-receipt` — PASS, exact two final statuses.
- `node tests/event-media-contract-decision-v1-negative.mjs` — PASS, 56/56 rejected as expected and restored baseline.
- `node tests/event-media-contract-decision-v1-workflow-path-filters.mjs` — PASS, 16 identical push/pull patterns covering 34 concrete authorities; pinned actions/runtimes and legacy bridge verified.
- `node scripts/normalization-v1-1/validate-workflow-path-filters.mjs --root .` — PASS.
- `node --test tests/project-normalization-v1-1-workflow-path-filters.mjs` — PASS.
- `python3 scripts/validate-normalization-schemas-v1-1.py .` — PASS.
- `node scripts/normalization-v1-1/validate-event-media-dossier.mjs --root .` — PASS.
- `node scripts/normalization-v1-1/test-event-media-dossier-validator.mjs .` — PASS.
- `bash -n scripts/normalization-v1-1/replay-normalization-workflow.sh` — PASS.
- current-head legacy aggregate with `--skip-receipt` and exact prior/closure archives — PASS; final `independent_delta_reaudit` field reports `receipt-skipped`.
- detached exact `45288b001d724e0d3603d0c44d392ff370407bd0` legacy aggregate with receipt validation enabled and exact archives — PASS; final `independent_delta_reaudit` field remains `pending`.
- clean temporary clone receipt smoke with synthetic Draft PR `#999`: deliberate `--write`, receipt schema, full semantic validator and default check-only rebuild all PASS with 35 self-excluding outputs. A committed synthetic receipt also passed both checks from detached HEAD, preserving materialization branch metadata rather than deriving an empty CI branch. The temporary receipt was not copied into this branch; L0 will recompute the final byte total.
- `git diff --check` — PASS.

Expected pre-receipt negative delivery checks:

- schema validator without `--skip-receipt`: exit 1, `EMV_RECEIPT_MISSING`.
- semantic validator without `--skip-receipt`: exit 1, `EMV_RECEIPT_MISSING`.
- receipt builder default check without a receipt: exit 1, `EMV_RECEIPT_MISSING`.

Archive evidence used only from `/tmp`: prior 44,805,665 bytes / `c677f695…` and closure 3,015,654 bytes / `8bb8712e…`; neither is committed.

## Legacy bridge and risks

The replay now proves the frozen receipt at exact `45288b…` with receipt validation enabled, then validates current-head legacy semantics with explicit `--skip-receipt`. It does not make the historical receipt attest later files. The source bundle is created from `HEAD` with full ancestry, so exact `45288b…` must remain reachable; the bridge deliberately fails if that object is absent. Both legacy archive inputs remain SHA/byte checked by the existing workflow.

Current-head `--skip-receipt` is safe only because the new Event Media workflow performs full current receipt validation after L0 materializes Draft PR metadata. Removing either half would reopen a guaranteed-red or unreceipted gap.

## Remaining delivery action (L0)

After the Draft PR exists, run the builder once with `--write --pr-number N --pr-url https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/N`, commit only the generated receipt, and rerun schema, semantic and builder commands without `--skip-receipt`/`--write`. The committed receipt records content hashes and constraints but explicitly does not self-assert CI execution.
