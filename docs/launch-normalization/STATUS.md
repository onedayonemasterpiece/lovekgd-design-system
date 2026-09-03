# Launch normalization — current status

Status owner: `N0`  
Coordination issue: `onedayonemasterpiece/events-bot-new#621`  
Programme start `T+0`: `NOT_SET`

`T+0` is a clock, not a permission gate. It starts with the first real
fresh-production-data generation command while F0/M0/A0/V0 have been launched.
Source normalization, rehearsal and verification continue independently.

## Current authority

```yaml
events_bot_new:
  integration_branch: integration/ui-normalization-launch-20260902
  current_verified_head: e2561aac0713e0b801203d09575a4b25932bdac5
  fresh_data_generation: NOT_STARTED
  accepted_integrated_wave: ABSENT
  owner_preview_entrypoint: /<buildId>/__preview/

lovekgd_design_system:
  integration_branch: integration/launch-normalized-sot-penpot-20260902
  branch_head_policy: resolve_current_remote_ref_at_read_time
  contract: contracts/launch-normalized-ui.v1.yaml
  contract_version: 1.4.0

execution_surfaces:
  K0_N0_F0_M0_A0: ChatGPT_GitHub_only
  V0: ChatGPT_GitHub_my_browser_bridge
  R0: native_Codex_local_shell_git_gh

penpot:
  target_file_id: 40e06342-8830-80d6-8008-8fc8a3a4cd4f
  sole_writer: R0.PENPOT
  launch_family_wave: NOT_STARTED
```

The design-system branch SHA is resolved at read time. Exact product source and
verification SHAs below remain pinned.

## Durable actor state

| Actor | State | Durable evidence | Next product action |
|---|---|---|---|
| N0 | `CRITICAL_PATH_NO_DURABLE_RESULT` | integration still `e2561aac...`; no fresh-data result or reachable preview in #621 | review latest combined candidate, accept/promote it, execute existing fresh-data generation, remain owner through exact preview result |
| F0 | `WAVE_2_COMPLETE_WAVE_3_READY` | Wave 2 `work/ui-normalization-f0-wave-2-20260903@5c5ee45a8cc781c527a3cdcba43d2cff99ede884`; result `5521395472` | close historical duplicate style ownership in F0 paths on Wave 3 |
| M0 | `WAVE_2_HEAD_ADVANCED_RESULT_PENDING` | current `work/ui-normalization-m0-wave-2-20260903@a18210e8fb9574d7ea6ca30a0ca8ca5a3b31c3f3`; R0 rehearsed predecessor `2164be00...` | personally review full Wave-2 diff/R0 result and publish durable component-family result; then standby unless an independent owned defect remains |
| A0 | `WAVE_2_COMPLETE_WAVE_3_READY` | Wave 2 `work/ui-normalization-a0-wave-2-20260903@e6736e1c98607ea9cc8249c875929f9f9d434115`; result `5521406121` | apply F0 bindings and explicit M0 APIs in A0-owned consumers on Wave 3 |
| V0 | `HARNESS_READY_STANDBY_TRIGGER_ARMED` | complete source/browser harness result `5521263641` | resume only on exact reachable integrated preview URL or a material harness-changing delta |
| K0 | `ACTIVE_PRODUCT_FIRST` | latest convergence instruction `5521518679` | keep existing sessions utilized, repair factual/process drift directly, minimize owner messages |
| R0 | `COMBINED_WAVE_2_PASS_LATEST_M0_DELTA_READY` | Wave 2 rehearsal `r0/combined-wave2-rehearsal-20260903@063bffeca91bb75792aa177f3e5327218dcdd43d`; result `5521491457` | integrate/verify the final M0 delta, then immediately execute accepted N0 promotion/generation mechanics |
| PM0 | `AVAILABLE_READ_ONLY` | result `5521143401` | readiness forecast only on request |

## Current source waves

### F0 Wave 2

```yaml
branch: work/ui-normalization-f0-wave-2-20260903
head: 5c5ee45a8cc781c527a3cdcba43d2cff99ede884
result: 5521395472
state: SOURCE_REVIEW_COMPLETE
scope:
  - semantic component foundation owner
  - Button/Badge/Field/StatePanel/CopyAction diagnostics and token consumption
  - exactly four icon roles retained
build_in_combined_rehearsal: PASS
browser: NOT_RUN
```

### M0 Wave 2

```yaml
branch: work/ui-normalization-m0-wave-2-20260903
current_head: a18210e8fb9574d7ea6ca30a0ca8ca5a3b31c3f3
rehearsed_head: 2164be00c30dcf2f9b58137f01892548eedd2d33
latest_delta:
  - bind OptimizedEventCardGrid compatibility adapter to canonical responsive strategy
result_comment: PENDING_M0
latest_delta_verification: PENDING_R0_INCREMENTAL
browser: NOT_RUN
```

### A0 Wave 2

```yaml
branch: work/ui-normalization-a0-wave-2-20260903
head: e6736e1c98607ea9cc8249c875929f9f9d434115
result: 5521406121
state: SOURCE_REVIEW_COMPLETE
scope:
  - remaining route composition identities
  - prelaunch/home/popular/exhibitions/event-detail diagnostics
  - one redundant page-local override removed
build_in_combined_rehearsal: PASS
browser: NOT_RUN
```

## Combined Wave 2 rehearsal

```yaml
branch: r0/combined-wave2-rehearsal-20260903
head: 063bffeca91bb75792aa177f3e5327218dcdd43d
result: 5521491457
included:
  F0: 5c5ee45a8cc781c527a3cdcba43d2cff99ede884
  M0: 2164be00c30dcf2f9b58137f01892548eedd2d33
  A0: e6736e1c98607ea9cc8249c875929f9f9d434115
validation:
  relevant_node_tests: 99/99
  astro_preview_pages: 463
  event_pages: 288
  preview_check: PASS
  unified_prototype: PASS
  iconography: PASS
  git_diff_check: PASS
preview_build_id: preview-r0-combined-wave2-a031a309
reachable_preview: false
promotion: NOT_PERFORMED
browser_verdict: NOT_RUN_V0_OWNED
```

The generated URL shape is not a reachable product preview because deployment
was not performed. It does not trigger V0 yet.

## Active convergence instruction

Issue comment `5521518679` is current:

```text
N0 reviews and accepts the combined candidate
+ R0 verifies the final M0 delta and prepares the latest candidate
+ F0 closes duplicate legacy foundation ownership
+ A0 applies central bindings in actual consumers
+ M0 publishes its complete Wave-2 contract/result
+ V0 remains harness-ready
→ N0 promotes and runs fresh-data generation
→ exact reachable normalized /<buildId>/__preview/
→ V0 personal DOM/computed-style PASS or DRIFT
```

A completed ChatGPT turn is resumed in the same window; no restart is needed.
No role waits for a formal packet or handoff. A dependency pauses only the exact
dependent line.

## Owner-visible checkpoint board

| Result | State | Current dependency |
|---|---|---|
| F0 Wave 2 | `SOURCE_REVIEW_COMPLETE` | integration/browser evidence |
| A0 Wave 2 | `SOURCE_REVIEW_COMPLETE` | integration/browser evidence |
| M0 Wave 2 | `SOURCE_HEAD_READY_RESULT_PENDING` | M0 final review plus final-delta verification |
| Combined Wave 2 rehearsal | `PASS_NOT_PROMOTED` | N0 acceptance; final M0 delta |
| technical fresh-data baseline | `PENDING_N0` | real generation command not started |
| reachable normalized preview | `PENDING_N0_R0` | promotion + generation/publication |
| V0 browser verdict | `TRIGGERED_BY_REACHABLE_URL` | exact local/public URL |
| `ASTRO_NORMALIZATION_PASS` | `CLOSED` | consumer migration, fresh build and browser evidence incomplete |

## Utilization discipline

- N0 and R0 are on the critical path and do not stop at analysis, dispatch or
  rehearsal while promotion/generation work is ready.
- F0/A0 continue only concrete independent source closure, not artificial
  busywork.
- M0 completes its durable role result and then may enter standby if no bounded
  owned defect remains.
- V0 is intentionally in zero-cost standby because its harness scope is complete
  and no reachable preview exists.
- Recoverable metadata, stale checkpoints, ENOSPC/tooling defects and missing
  headings are resolved autonomously.
- `[BLOCKER]` requires exhausted independent work plus a concrete product,
  external, writer-conflict or irreversible-risk boundary.

## ASTRO_NORMALIZATION_PASS

The gate opens only when all are true:

- fresh-data generation is reproducible;
- foundations and visible colors are tokenized;
- exactly four icon roles are applied to all consumers;
- visually/behaviorally identical components use one family root;
- MediaFrame/framing passes browser measurements;
- AdaptiveEventCardGrid covers applicable consumers;
- actual routes are migrated;
- V0 reports no critical `DRIFT`.

Product UI-gap, palette exploration and redesign remain outside active scope
until this gate opens.
