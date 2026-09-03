# Launch normalization — current status

Status owner: `N0`  
Coordination issue: `onedayonemasterpiece/events-bot-new#621`  
Programme start `T+0`: `NOT_SET`

`T+0` is a clock, not a permission gate. It starts with the first real
fresh-production-data generation command. Source work and reversible rehearsal
may proceed before it.

## Current authority

```yaml
events_bot_new:
  integration_branch: integration/ui-normalization-launch-20260902
  current_head: e2561aac0713e0b801203d09575a4b25932bdac5
  accepted_integrated_wave: ABSENT
  fresh_data_generation: NOT_STARTED
  reachable_normalized_preview: ABSENT
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
```

## Latest verified product candidate

```yaml
branch: r0/combined-wave2-latest-20260903
head: 592bfce1537c1b89b5d7e401a2516a7b7709421b
tree: a1ad4eb99d10de6b645be0a38246c3d9887c540a
result: 5521586228
includes:
  F0: work/ui-normalization-f0-wave-2-20260903@5c5ee45a8cc781c527a3cdcba43d2cff99ede884
  M0: work/ui-normalization-m0-wave-2-20260903@a18210e8fb9574d7ea6ca30a0ca8ca5a3b31c3f3
  A0: work/ui-normalization-a0-wave-2-20260903@e6736e1c98607ea9cc8249c875929f9f9d434115
validation:
  relevant_tests: 46/46_PASS
  astro_preview_pages: 463
  event_pages: 288
  preview_check: PASS
  unified_prototype: PASS
  git_diff_check: PASS
promotion: NOT_PERFORMED
fresh_production_data: NOT_RUN
reachable_preview: false
browser_verdict: NOT_RUN_V0_OWNED
```

M0 personally accepted the latest R0 mechanical output in result `5521646256`.
The URL shape produced by a local rehearsal is not a reachable preview and does
not trigger V0.

## Durable actor state

| Actor | State | Durable evidence | Next product action |
|---|---|---|---|
| N0 | `CRITICAL_PATH_RESUME_NOW` | no N0 result; integration remains `e2561aac...`; no fresh-data run or reachable preview | personally accept/reject `592bfce...`, promote the accepted candidate, determine the existing fresh-data path, authorize native R0 mechanics, review output, publish real baseline and reachable preview |
| F0 | `WAVE_2_COMPLETE_WAVE_3_NOT_STARTED` | Wave 2 result `5521395472`; Wave-3 branch still equals parent `5c5ee45...` | resume existing F0 window and close duplicate legacy style ownership only where source evidence makes it safe |
| M0 | `WAVE_2_ACCEPTED_SCOPE_EXHAUSTED` | role result `5521565674`; R0 acceptance review `5521646256` | intentional standby until N0 integration, A0 consumer migration request or V0 DRIFT |
| A0 | `WAVE_2_COMPLETE_WAVE_3_NOT_STARTED` | Wave 2 result `5521406121`; Wave-3 branch still equals parent `e6736e1...` | resume existing A0 window and apply already-defined F0/M0 bindings in A0-owned consumers |
| V0 | `HARNESS_READY_STANDBY_TRIGGER_ARMED` | harness result `5521263641` | resume only on an exact reachable integrated preview URL or a material harness-changing delta |
| R0 | `LATEST_CANDIDATE_READY_WAITING_N0_AUTHORITY` | latest candidate PASS `5521586228`; true authority boundary `5521772560` | intentional standby until N0 publishes promotion/generation authority, then resume the same native Codex session immediately |
| K0 | `ACTIVE_PRODUCT_FIRST` | current canonical status and issue corrections | keep factual state current and minimize owner messages |
| PM0 | `AVAILABLE_READ_ONLY` | result `5521143401` | readiness forecast only on request |

## Current actionable lanes

```text
N0: product critical path — candidate acceptance → promotion → fresh data → reachable preview
F0: Wave 3 — legacy foundation-owner closure
A0: Wave 3 — actual consumer token/icon/grid/media bindings
M0: standby — source contract and latest candidate already accepted
R0: standby on a real N0 authority boundary, not on missing metadata
V0: standby — complete harness, waiting for reachable preview
```

A finished ChatGPT turn is resumed in the same window. Restart is unnecessary
unless the existing window is genuinely unusable. A dependency pauses only the
exact dependent line.

## Immediate convergence sequence

```text
N0 accepts/promotes latest candidate and publishes exact native-R0 mechanics
+ F0 closes safe legacy style duplication
+ A0 applies current F0/M0 consumer bindings
→ R0 executes N0 promotion/fresh-data mechanics
→ N0 reviews the output and publishes a reachable normalized /<buildId>/__preview/
→ V0 performs the prepared personal DOM/computed-style audit
→ owning role closes critical DRIFT
→ first owner-facing normalized preview
```

## Owner-visible checkpoint board

| Result | State | Current dependency |
|---|---|---|
| latest combined source/build candidate | `PASS_NOT_PROMOTED` | N0 acceptance/promotion |
| M0 Wave 2 | `OWNER_ROLE_ACCEPTED` | integration/browser evidence |
| F0 Wave 3 | `NOT_STARTED_ON_SUCCESSOR_BRANCH` | resume existing F0 window |
| A0 Wave 3 | `NOT_STARTED_ON_SUCCESSOR_BRANCH` | resume existing A0 window |
| technical fresh-data baseline | `PENDING_N0` | real generation command not started |
| reachable normalized preview | `PENDING_N0_R0` | promotion + fresh generation/publication |
| V0 browser verdict | `TRIGGERED_BY_REACHABLE_URL` | exact reachable integrated preview |
| `ASTRO_NORMALIZATION_PASS` | `CLOSED` | consumer migration, fresh build and browser evidence incomplete |

## Blocker discipline

`[BLOCKER]` is valid only at a real authority, product, external-resource,
writer-conflict or irreversible-risk boundary after all independent work is
exhausted. R0 result `5521772560` is such a boundary: integration promotion and
fresh-data path selection belong to N0. It must be resolved by N0, not by an
owner-authored packet or by R0 guessing product authority.

Recoverable metadata, stale checkpoints, ENOSPC/tooling defects and missing
headings remain nonterminal and are resolved autonomously.

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
