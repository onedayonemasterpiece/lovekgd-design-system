# Launch normalization — current status

Status owner: `N0`  
Coordination issue: `onedayonemasterpiece/events-bot-new#621`  
Programme start `T+0`: `NOT_SET`

`T+0` is a clock, not a permission gate. It starts with the first real
fresh-data generation command while F0/M0/A0/V0 are launched. Its absence does
not pause source normalization, mechanical verification or integration rehearsal.

## Current authority

```yaml
events_bot_new:
  integration_branch: integration/ui-normalization-launch-20260902
  current_verified_head: e2561aac0713e0b801203d09575a4b25932bdac5
  owner_preview_entrypoint: /<buildId>/__preview/
  fresh_data_generation: NOT_STARTED
  integrated_normalization_wave: ABSENT

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

The design-system branch SHA is intentionally resolved at read time. Exact
source and verification SHAs below remain pinned.

## Durable actor state

| Actor | State | Durable evidence | Next product action |
|---|---|---|---|
| N0 | `LAUNCHED_NO_DURABLE_GENERATION_RESULT` | no N0 fresh-data result or integration branch movement in #621 | finish generation decision, use native R0 for local execution where needed, review output, publish actual fresh-data verdict |
| F0 | `WAVE_1_READY_WAVE_2_ACTIVE` | `work/ui-normalization-f0-20260903@d5f1fab4a09aada97e7b7064c88736c415bb5bef`; result `5521057582`; successor branch exists | continue owned-path saturation on Wave 2 |
| M0 | `WAVE_1_MECHANICALLY_VERIFIED_WAVE_2_ACTIVE` | source `work/ui-normalization-m0-20260903@046b002621eee150adf2560c8e31e1adb53acb53`; R0 verification `r0/m0-verification-20260903@20781baa0fcf421d3a3cc47ab3332595b5b19b6b`; result `5521307436` | M0 reviews R0 diff while continuing independent Wave 2 |
| A0 | `WAVE_1_READY_WAVE_2_ACTIVE` | `work/ui-normalization-a0-20260903@5a4a3d3c2afa2f1a4fb71cd23194081d74dca4a6`; result `5517791881`; successor branch exists | continue route/shell Wave 2 |
| V0 | `HARNESS_READY_STANDBY_TRIGGER_ARMED` | dependency correction `5517639901`; complete harness result `5521263641` | resume on exact integrated preview URL or material source-wave delta |
| K0 | `ACTIVE_PRODUCT_FIRST` | corrections `5521029923`, `5521231641`, `5521334083` | repair process drift directly and keep executable lanes utilized |
| R0 | `M0_PASS_NEXT_TASK_READY` | M0 verification PASS `5521307436`; continuous-utilization task `5521334083` | immediately run Combined Wave 1 integration rehearsal, then consume the next safe N0/Wave-2 mechanical task |
| PM0 | `AVAILABLE_READ_ONLY` | result `5521143401` | readiness forecast only on request |

## Current source and verification waves

### F0 Wave 1

```yaml
branch: work/ui-normalization-f0-20260903
head: d5f1fab4a09aada97e7b7064c88736c415bb5bef
scope:
  - semantic foundations alias layer
  - typography and geometry roles
  - semantic color map and duplicate merges
  - exactly four icon-size roles
  - canonical semantic icon identity
build: NOT_RUN_ON_COMBINED_WAVE
browser: NOT_RUN
```

### M0 Wave 1

```yaml
source_branch: work/ui-normalization-m0-20260903
source_head: 046b002621eee150adf2560c8e31e1adb53acb53
verification_branch: r0/m0-verification-20260903
verification_head: 20781baa0fcf421d3a3cc47ab3332595b5b19b6b
mechanical_verdict: PASS
node_tests: 54/54
preview_build: 463_pages
preview_check: 288_events
unified_prototype: 20_primary_routes_41_hub_links_288_event_pages_343_related_cards
browser: NOT_RUN_V0_OWNED
```

### A0 Wave 1

```yaml
branch: work/ui-normalization-a0-20260903
head: 5a4a3d3c2afa2f1a4fb71cd23194081d74dca4a6
scope:
  - DateListingSurface diagnostics
  - WeekendListingSurface current/dated diagnostics
  - TodayReviewGuard diagnostics
  - preserved date/weekend route semantics
build: NOT_RUN_ON_COMBINED_WAVE
browser: NOT_RUN
```

### R0 immediate rehearsal

```yaml
base: integration/ui-normalization-launch-20260902@e2561aac0713e0b801203d09575a4b25932bdac5
target: r0/combined-wave1-rehearsal-20260903
combine:
  - work/ui-normalization-f0-20260903@d5f1fab4a09aada97e7b7064c88736c415bb5bef
  - r0/m0-verification-20260903@20781baa0fcf421d3a3cc47ab3332595b5b19b6b
  - work/ui-normalization-a0-20260903@5a4a3d3c2afa2f1a4fb71cd23194081d74dca4a6
instruction: issue_comment_5521334083
status: READY_TO_EXECUTE
integration_branch_mutation: FORBIDDEN
```

## Utilization discipline

A dependency pauses only the dependent operation.

- F0/M0/A0 continue while owned source work remains.
- V0 is allowed zero-cost standby only because its current independent read-only
  harness scope is complete and it has an exact trigger.
- R0 is not allowed to stop after one bounded result while another safe
  mechanical task is already durable and executable.
- After every R0 result it fresh-reads #621/current refs and continues, in order:
  N0 generation/integration work, advanced Wave 2 verification, then other
  unambiguous reversible mechanical work.
- R0 stops only when no ready safe task remains or at a true semantic/safety
  boundary.

Packets, dispatch, worktree creation and tests without output are not product
checkpoints. Recoverable metadata, tooling failures and stale checkpoints are
resolved autonomously.

## Dependencies, not terminal blockers

| Dependency | Blocks | Does not block |
|---|---|---|
| no fresh preview URL | V0 live DOM/computed sweep | F0/M0/A0 work; N0 analysis; R0 rehearsal |
| no N0 generation result | technical baseline and owner preview | Combined Wave 1 rehearsal and Wave 2 source work |
| Wave 2 still changing | final integration | Wave 1 combined rehearsal and isolated verification |
| Penpot not started | Penpot/Golden parity | Astro normalization and browser preparation |

## Nearest product sequence

```text
R0 Combined Wave 1 integration rehearsal
+ N0 completes fresh-data generation decision/execution
+ F0/M0/A0 continue Wave 2
+ V0 stays harness-ready
→ N0 reviews rehearsal and integrates accepted waves
→ fresh normalized /<buildId>/__preview/
→ resume V0 once for personal DOM/computed-style verdict
→ owning roles repair critical DRIFT
→ first owner-facing normalized preview
```

## Owner-visible checkpoint board

| Result | State | Current dependency |
|---|---|---|
| M0 executable regression verdict | `PASS` | owning M0 review pending |
| Combined Wave 1 rehearsal | `READY_R0_EXECUTION` | resume existing R0 session |
| technical fresh-data baseline | `PENDING_N0_EXECUTION` | generation command has not started |
| F0/M0/A0 Wave 2 | `ACTIVE` | none for independent owned scope |
| V0 browser harness | `READY_STANDBY` | exact trigger only |
| combined normalized preview | `PENDING_GENERATION_AND_INTEGRATION` | N0 |
| V0 DOM/computed verdict | `TRIGGERED_BY_EXACT_PREVIEW_URL` | exact integrated URL |
| `ASTRO_NORMALIZATION_PASS` | `CLOSED` | generation, integration, consumer migration and browser evidence incomplete |

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

Product UI-gap, palette exploration and redesign remain outside the active scope
until this gate opens.
