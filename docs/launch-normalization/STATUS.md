# Launch normalization — current status

Status owner: `N0`  
Coordination issue: `onedayonemasterpiece/events-bot-new#621`  
Programme start `T+0`: `NOT_SET`

`T+0` starts with the first real fresh-production-data generation command. It is
a clock, not a permission gate.

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
  contract_version: 1.5.0

execution_surfaces:
  K0_N0_F0_M0_A0: ChatGPT_GitHub_only
  V0: ChatGPT_GitHub_my_browser_bridge
  R0: native_Codex_local_shell_git_gh
```

## Continuous execution policy

Role prompts cover the complete owned objective. Wave, commit and `[RESULT]` are
checkpoints, not turn boundaries.

```text
checkpoint
→ fresh-read current issue/refs
→ recompute role backlog
→ select next highest-value safe item
→ continue until owned backlog is exhausted
```

Per-Wave owner resume is a process defect. A role enters standby only after all
independent owned work is exhausted and an exact external trigger is known.
N0/R0 critical-path steps use end-to-end conditional authority and bounded R0
watch rather than approval ping-pong.

## Durable actor state

| Actor | State | Durable evidence | Next product action |
|---|---|---|---|
| N0 | `CRITICAL_PATH_DECISION_POSTED_BUT_CHAIN_NOT_CLOSED` | generation decision `5521885317`; accepted Wave-2 candidate `592bfce...`; no integration move, baseline or reachable preview | in one continuous turn review F0/A0 Wave 3 and publish conditional end-to-end authority covering latest candidate rehearsal → same-data baseline → promotion → fresh generation → reachable preview |
| F0 | `OWNED_BACKLOG_EXHAUSTED_STANDBY` | Wave 3 `work/ui-normalization-f0-wave-3-20260903@7ae5282a860e36aa3ca5008053fae053b7474344`; result `5521926959` | standby until integration/build/V0 exposes F0 drift or an actual class-only consumer migration returns to F0 scope |
| M0 | `OWNED_BACKLOG_EXHAUSTED_STANDBY` | Wave 2 `work/ui-normalization-m0-wave-2-20260903@a18210e8fb9574d7ea6ca30a0ca8ca5a3b31c3f3`; result `5521565674`; R0 review accepted `5521646256` | standby until A0/N0 migration question or V0 drift |
| A0 | `OWNED_BACKLOG_EXHAUSTED_STANDBY` | Wave 3 `work/ui-normalization-a0-wave-3-20260903@08ac8eab1674281641ccfe59b89611c1434495c5`; result `5521930424` | standby until latest combined build or V0 reveals route/consumer drift |
| V0 | `HARNESS_READY_STANDBY_TRIGGER_ARMED` | harness result `5521263641` | resume on exact reachable integrated preview URL and run full browser matrix |
| K0 | `ACTIVE_CONTINUOUS_EXECUTION_REPAIR` | contract/docs continuous-owner repair at current branch head | eliminate micro-wave stops and minimize unavoidable platform wake-ups |
| R0 | `READY_FOR_CONTINUOUS_CRITICAL_PATH_EXECUTION` | latest verified Wave-2 candidate `r0/combined-wave2-latest-20260903@592bfce1537c1b89b5d7e401a2516a7b7709421b`; N0 decision `5521885317`; newer F0/A0 heads available | build latest Wave-3 combined candidate, then execute N0 conditional baseline/promotion/generation chain without stopping between reversible stages |
| PM0 | `AVAILABLE_READ_ONLY` | result `5521143401` | readiness forecast only on request |

## Current source convergence

```yaml
F0:
  branch: work/ui-normalization-f0-wave-3-20260903
  head: 7ae5282a860e36aa3ca5008053fae053b7474344
  independent_scope: EXHAUSTED

M0:
  branch: work/ui-normalization-m0-wave-2-20260903
  head: a18210e8fb9574d7ea6ca30a0ca8ca5a3b31c3f3
  independent_scope: EXHAUSTED

A0:
  branch: work/ui-normalization-a0-wave-3-20260903
  head: 08ac8eab1674281641ccfe59b89611c1434495c5
  independent_scope: EXHAUSTED

last_verified_combined_candidate:
  branch: r0/combined-wave2-latest-20260903
  head: 592bfce1537c1b89b5d7e401a2516a7b7709421b
  tests: 46/46_PASS
  preview_build: 463_pages_288_event_pages
  preview_check: PASS
  unified_check: PASS
  reachable_preview: false
  includes_F0_wave3: false
  includes_A0_wave3: false
```

## Immediate critical path

```text
N0 reviews exact F0/A0 Wave-3 heads and issues one conditional end-to-end authority
+
R0 builds/verifies latest candidate:
  592bfce...
  + F0 7ae5282...
  + A0 08ac8ea...
→ same-data before/after baseline
→ IF acceptance criteria PASS:
     promote exact candidate
     run fresh-production generation
     publish exact reachable /<buildId>/__preview/
  ELSE:
     no promotion/deploy
     publish factual lowest-owner defect
→ resume V0 once for full DOM/computed-style verdict
```

N0 may not stop at a dispatch or baseline-only decision. R0 may not stop after a
rehearsal while an authorized next stage is available. R0 uses bounded watch for
an expected N0 trigger instead of exiting immediately.

## Owner-visible checkpoint board

| Result | State | Current dependency |
|---|---|---|
| F0 source convergence | `COMPLETE_STANDBY` | integration/browser evidence |
| M0 source convergence | `COMPLETE_STANDBY` | integration/browser evidence |
| A0 source convergence | `COMPLETE_STANDBY` | integration/browser evidence |
| latest all-source combined candidate | `PENDING_R0_WAVE3_REHEARSAL` | N0 conditional authority and R0 execution |
| technical same-data baseline | `PENDING_R0` | continuous N0 authority |
| accepted integration head | `PENDING_CONDITIONAL_PROMOTION` | baseline/check PASS |
| reachable normalized preview | `PENDING_FRESH_GENERATION` | promotion + publication |
| V0 browser verdict | `TRIGGERED_BY_REACHABLE_URL` | exact integrated URL |
| `ASTRO_NORMALIZATION_PASS` | `CLOSED` | fresh build and browser evidence incomplete |

## Standby versus process defect

Correct standby:

- F0/M0/A0 have exhausted current independent owned source backlog;
- V0 has completed the harness and lacks a physical preview surface.

Process defect:

- asking the owner to resume a role after every numbered Wave;
- N0 ending on dispatch instead of an end-to-end conditional path;
- R0 exiting immediately before an expected critical trigger;
- holding executable backlog while waiting for a formal packet.

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
