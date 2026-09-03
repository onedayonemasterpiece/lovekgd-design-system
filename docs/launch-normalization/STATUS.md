# Launch normalization — factual status

Status owner: `N0`  
Coordination: `onedayonemasterpiece/events-bot-new#621`  
Contract: `launch-normalized-ui.v1.yaml@1.8.0`

## Current operating mode

```yaml
mode: DAY_PARALLEL
owner_report: N0_F0_M0_A0_V0_R0_tasks_launched
Codex_resource: SCARCE
allocation_goal: role_windows_do_analysis_decisions_direct_GitHub_implementation_and_review; R0_does_local_materialization
```

A running role window is expected to process multiple items and generate the
next owned item inside the same turn. R0 must not duplicate specialist work that
can proceed in the active windows.

## Current product gate

```text
exact reachable normalized /<buildId>/__preview/
+ reproducible fresh-production generation
+ explicit ancestry
→ V0 independent DOM/computed-style verdict
```

Not yet reached.

## Current durable heads and observed post-resume progress

```yaml
integration:
  branch: integration/ui-normalization-launch-20260902
  head: f7455bc3ef2542a7df2634665f83b75e5a171eae

F0:
  branch: work/ui-normalization-f0-wave-3-20260903
  pre_resume_head: bc1f566b6845557983042d8ed27ea94a6f572507
  current_observed_head: 5c0f6a3996438147edaf837ba07f7fb1f54995be
  post_resume_commits: 3
  post_resume_paths: 4
  current_work:
    - collection foundations
    - product theme foundations
    - transport foundations
  resource_effect: specialist_work_done_without_Codex

M0:
  branch: work/ui-normalization-m0-continuity-20260903
  current_observed_head: 00ef7b689cc5d040bd0099962576cadcd88270f7
  owner_report: task_launched
  current_work:
    - family_and_media_recensus
    - rail_variant_hardening
    - MediaFrame_ownership
    - regression_contracts

A0:
  branch: work/ui-normalization-a0-wave-3-20260903
  pre_resume_head: 651f6a8e58bcad06859e42eee87b2b337bd1c536
  current_observed_head: f4fb2247c35d4578cdfefed1b6c410f9fd665f7d
  post_resume_commits: 3
  post_resume_paths: 3
  current_work:
    - remaining service_and_search_route_consumers
  resource_effect: consumer_migration_done_without_Codex

V0:
  owner_report: task_launched
  current_work:
    - latest_ref_harness_delta
    - source_negative_probes
    - current_product_before_baseline
    - normalized_preview_audit_if_URL_appears

N0:
  owner_report: task_launched
  current_work:
    - latest_role_review
    - candidate_inclusion
    - generation_publication_acceptance
    - R0_output_review

R0:
  owner_report: native_task_launched
  current_work:
    - candidate_materialization
    - local_tests_build_generation_publication
  must_report:
    blind_wait_seconds: 0
    duplicated_specialist_work: 0
```

F0 and A0 already advanced after the new parallel launch. This confirms that
non-Codex capacity is actively unloading the scarce native lane. M0/N0/V0/R0
liveness is owner-reported until their next durable result or ref movement.

## Resource allocation policy

### Role windows own

- full source and consumer census;
- product/semantic/architecture decisions;
- broad coherent direct GitHub batches;
- test and negative-probe design;
- branch diff/readback review;
- merge-ready acceptance and removal boundaries.

### R0 owns in DAY_PARALLEL

- cross-branch candidate construction;
- local dependencies and runtime;
- tests/build/checks;
- generation/publication;
- ordinary merge conflict repair;
- local browser smoke;
- deterministic bulk mechanics only when materially cheaper than specialist work.

Before editing role-owned source, R0 checks current role activity and prefers the
specialist branch. Duplicate analysis or implementation is a resource defect.

### NIGHT_AUTONOMOUS

When role windows are intentionally unavailable, R0 receives the broad reversible
engineering contour and continues to the product gate. Night prompts must not be
finite A+B transactions with a stop after one result.

## Codex economy evidence

Each R0 checkpoint must include:

```text
local_runtime_work_completed
role_outputs_integrated_or_verified
Codex_only_implementation_and_why_it_could_not_be_done_economically_in_a_role_window
blind_wait_seconds: 0
duplicated_specialist_work: 0
```

## Exit rule

A role may finish only with:

```text
ready_owned_items: 0
remaining_external_trigger: <exact role/result/url>
```

or a genuine product/safety/writer/platform boundary. A one-item run followed by
stop while ready work remains is `BACKLOG_NOT_FORMING`.

## Immediate parallel sequence

```text
N0: candidate/release/generation review
+
F0: central foundations saturation
+
M0: family/framing/grid/rail saturation
+
A0: actual consumer saturation
+
V0: source harness + production before-baseline
+
R0: integrate/test/build/generate/publish
→ reachable normalized preview
→ V0 full audit
→ critical DRIFT fixes
```

## ASTRO_NORMALIZATION_PASS

Still closed. Required: reproducible fresh generation, tokenized foundations,
four icon roles, canonical family roots, MediaFrame and AdaptiveEventCardGrid
browser pass, migrated actual routes and no critical V0 DRIFT.
