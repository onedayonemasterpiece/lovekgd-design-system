# Launch normalization — factual status

Status owner: `N0`  
Coordination: `onedayonemasterpiece/events-bot-new#621`  
Contract: `launch-normalized-ui.v1.yaml@1.6.0`

## Execution truth

```yaml
chatgpt_background_workers: 0
chatgpt_roles:
  type: burst_specialists
  self_resume_after_turn: false
native_persistent_workers_active_now: 0
native_R0_session:
  state: STOPPED_BEFORE_CURRENT_PRODUCT_GATE
external_supervisor:
  authorized: false
```

All visible ChatGPT turns have finished. This is not an always-on worker pool.
The prior process description that implied otherwise was false and is superseded.
With the current no-supervisor constraint, only a running native R0 session can
provide persistent execution.

## Current product gate

```text
exact reachable normalized /<buildId>/__preview/
+ reproducible fresh-production generation
+ explicit source ancestry
```

This gate has not been reached. Integration remains without the normalized
product candidate and no reachable preview has been published.

## Durable source work already available

```yaml
integration:
  branch: integration/ui-normalization-launch-20260902
  head: f7455bc3ef2542a7df2634665f83b75e5a171eae

F0:
  branch: work/ui-normalization-f0-wave-3-20260903
  head: bc1f566b6845557983042d8ed27ea94a6f572507
  observed_after_previous_checkpoint:
    commits: 6
    distinct_work:
      - whole-product surface foundation bindings
      - exact surface token bindings
      - component token-owner consolidation
      - shell/navigation foundations
      - event-detail foundations

M0:
  branch: work/ui-normalization-m0-continuity-20260903
  head: 00ef7b689cc5d040bd0099962576cadcd88270f7
  observed_since_wave2:
    commits: 6
    distinct_work:
      - EventMediaRail hero-selector
      - EventMediaRail poster-strip
      - AdaptiveEventCardGrid live-region API
      - ListingEventCard root metadata bridge
      - production rail runtime preservation

A0:
  branch: work/ui-normalization-a0-wave-3-20260903
  head: 651f6a8e58bcad06859e42eee87b2b337bd1c536
  observed_after_previous_checkpoint:
    commits: 10
    changed_paths: 20
    distinct_work:
      - Home/Free/Unusual/Gastronomy/PersonalFeed migrations
      - focus runtime and invite states
      - service route composition identities
      - partnership and collection catalogue bindings

V0:
  full_harness: 5521263641
  latest_harness_delta: [5522861326, 5522899558]
  remaining_without_preview: 0
  trigger: exact reachable integrated preview

N0:
  end_to_end_policy: 5522876492
  result_state: AUTHORITY_EXISTS_PRODUCT_OUTPUT_ABSENT

R0:
  outcome_backlog_policy: 5523168515
  active_wait_policy: 5523352908
  product_output: ABSENT
```

F0/M0/A0 demonstrated multi-item backlog processing inside their last turns.
That proves useful burst execution, not persistence. They are durable inputs for
R0, not active background processes.

## Required recovery topology

Do not wake every ChatGPT tab again.

```text
one native R0 principal-executor resume
→ integrate/review latest safe role work
→ tests/build/local browser smoke
→ fresh generation/publication
→ exact reachable preview
→ one V0 independent browser burst
```

R0 is now allowed to make reversible engineering decisions that are determined
by current product behaviour and canonical invariants. It does not wait for
F0/M0/A0 to be awake. It wakes a burst specialist only for a genuine product or
semantic ambiguity.

## Owner action budget

Current unavoidable action:

```yaml
messages_now: 1
recipient: existing native R0 session
purpose: resume principal execution to current product gate
```

After preview:

```yaml
messages_later: 1
recipient: existing V0 window
purpose: independent full browser verdict
```

Zero-touch continuation after a native session has fully ended is impossible
without an external supervisor. Such a supervisor remains outside the current
authorized topology.

## ASTRO_NORMALIZATION_PASS

Still closed. Required: reproducible fresh generation, tokenized foundations,
four icon roles, canonical family roots, MediaFrame and AdaptiveEventCardGrid
browser pass, migrated actual routes and no critical V0 DRIFT.
