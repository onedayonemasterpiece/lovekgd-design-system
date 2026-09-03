# Launch normalization — factual status

Status owner: `N0`  
Coordination: `onedayonemasterpiece/events-bot-new#621`  
Contract: `launch-normalized-ui.v1.yaml@1.7.0`

## Current execution state

```yaml
chatgpt_windows_currently_running: 0
native_R0_currently_running: 0
background_self_resume: false
ready_role_backlog_exists: true
stopped_capacity_is_idle: true
```

The absence of background execution does not justify leaving stopped role windows
without work. Each activation is expected to process multiple backlog items and
self-generate the next item inside the same turn.

## Current product gate

```text
exact reachable normalized /<buildId>/__preview/
+ reproducible fresh-production generation
+ explicit ancestry
```

Not reached. Integration still has no reachable normalized preview.

## Current durable heads

```yaml
integration:
  branch: integration/ui-normalization-launch-20260902
  head: f7455bc3ef2542a7df2634665f83b75e5a171eae

F0:
  branch: work/ui-normalization-f0-wave-3-20260903
  head: bc1f566b6845557983042d8ed27ea94a6f572507

M0:
  branch: work/ui-normalization-m0-continuity-20260903
  head: 00ef7b689cc5d040bd0099962576cadcd88270f7

A0:
  branch: work/ui-normalization-a0-wave-3-20260903
  head: 651f6a8e58bcad06859e42eee87b2b337bd1c536

V0:
  full_harness: 5521263641
  latest_harness_delta: [5522861326, 5522899558]

N0:
  end_to_end_policy: 5522876492

R0:
  outcome_backlog_policy: 5523168515
  active_wait_policy: 5523352908
```

## Resource allocation now

All five ChatGPT role windows have ready work and should be resumed. R0 also has
ready native execution work.

| Role | State | Ready contour |
|---|---|---|
| N0 | `STOPPED_WITH_READY_BACKLOG` | review latest role heads; candidate inclusion; generation/publication acceptance; R0 output review; exact preview and V0 trigger |
| F0 | `STOPPED_WITH_READY_BACKLOG` | audit latest A0/M0 deltas; close remaining central semantic aliases, duplicate values and icon-role/SVG gaps |
| M0 | `STOPPED_WITH_READY_BACKLOG` | rail variant hardening, shared MediaFrame ownership, regression coverage, API recensus against latest A0 consumers |
| A0 | `STOPPED_WITH_READY_BACKLOG` | consume latest F0/M0 APIs in DesktopEventPage, PersonalFeedSlot, Popular, MobileEventReview and remaining route consumers |
| V0 | `STOPPED_WITH_READY_BACKLOG` | update harness to latest refs, run source negative probes and current-production browser before-baseline; full audit if preview appears |
| R0 | `STOPPED_WITH_READY_BACKLOG` | construct/test latest candidate, fresh generation/publication, local browser smoke, continue mechanical product backlog |

## Multi-item evidence already observed

F0, M0 and A0 have demonstrated that one turn can process many distinct items:

```yaml
F0:
  additional_commits_after_former_checkpoint: 6
  changed_paths: 10

M0:
  commits_on_continuity_branch: 6
  changed_paths: 3

A0:
  additional_commits_after_former_checkpoint: 10
  changed_paths: 20
```

Therefore these roles are not limited to one micro-task. The correct action is to
resume them with full contours and concrete seed backlogs, not to leave them idle
or route all work to R0.

## Exit rule

A role may finish only with one of:

```text
ready_owned_items: 0
remaining_external_trigger: <exact role/result/url>
```

or a genuine product/safety/writer/platform boundary.

A one-item run followed by stop while ready work remains is
`BACKLOG_NOT_FORMING`.

## Immediate parallel sequence

```text
N0: latest candidate/release/generation contour
+
F0: remaining central foundations saturation
+
M0: remaining family/framing/grid/rail saturation
+
A0: remaining actual consumer saturation
+
V0: latest source-harness + production before-baseline
+
R0: materialize/test/build/publish
→ reachable normalized preview
→ V0 full audit
→ critical DRIFT fixes
```

## ASTRO_NORMALIZATION_PASS

Still closed. Required: reproducible fresh generation, tokenized foundations,
four icon roles, canonical family roots, MediaFrame and AdaptiveEventCardGrid
browser pass, migrated actual routes and no critical V0 DRIFT.
