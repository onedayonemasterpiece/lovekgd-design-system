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
  current_head: f7455bc3ef2542a7df2634665f83b75e5a171eae
  current_delta: documentation_only
  fresh_data_generation: NOT_STARTED
  reachable_normalized_preview: ABSENT

lovekgd_design_system:
  integration_branch: integration/launch-normalized-sot-penpot-20260902
  branch_head_policy: resolve_current_remote_ref_at_read_time
  contract: contracts/launch-normalized-ui.v1.yaml
  contract_version: 1.5.0
```

## Verified and role-owned checkpoints

```yaml
verified_combined_wave2:
  branch: r0/combined-wave2-latest-20260903
  head: 592bfce1537c1b89b5d7e401a2516a7b7709421b
  result: 5521586228
  source_build_checks: PASS
  reachable_preview: false

F0:
  branch: work/ui-normalization-f0-wave-3-20260903
  head: 7ae5282a860e36aa3ca5008053fae053b7474344
  result: 5521926959

M0:
  branch: work/ui-normalization-m0-wave-2-20260903
  head: a18210e8fb9574d7ea6ca30a0ca8ca5a3b31c3f3
  result: 5521565674
  R0_review_accepted: 5521646256

A0:
  branch: work/ui-normalization-a0-wave-3-20260903
  head: 08ac8eab1674281641ccfe59b89611c1434495c5
  result: 5521930424
```

## Correction: source contours are not exhausted

The former `F0/M0/A0 OWNED_BACKLOG_EXHAUSTED` classification was too narrow. It
looked only at the last named Wave rather than the full actual-consumer census.
Current source still contains executable independent normalization work:

- `HomeColdStartFeed.astro`: local wrapper/grid around direct EventCard;
- `FreeCollectionSurface.astro`: two local EventCard grids;
- `UnusualListingSurface.astro`: wrapper metadata and local grid;
- `GastronomyCollectionSurface.astro`: future/recent wrapper grids;
- `PersonalFeedSlot.astro`: duplicate grid/equal-height/media ownership;
- `DesktopEventPage.astro`: hero-selector and poster-strip EventMediaRail
  lookalikes;
- class-only Button consumers and route-specific raw foundation values;
- remaining MediaFrame/rail central ownership and token bindings.

These are not blocked by the first preview. N0/R0 operate on a frozen candidate;
F0/M0/A0 continue on role branches for the next integration checkpoint.

## Durable actor state

| Actor | State | Current work |
|---|---|---|
| N0 | `ACTIVE_CRITICAL_PATH` | accepted-candidate baseline task `5522381655/5522499169`; must continue to conditional promotion, fresh generation and reachable preview rather than finish on baseline |
| R0 | `ACTIVE_NATIVE_EXECUTION` | execute current N0 same-data task; after every result fresh-read and continue authorized critical mechanics or bounded-watch for N0 trigger |
| F0 | `ACTIVE_CONTINUOUS_FOUNDATIONS` | whole-product read-only census; add central aliases/roles for remaining home/free/unusual/gastronomy/personal-feed/rail/focus consumers; close visible color/type/spacing/icon gaps in F0 paths |
| M0 | `ACTIVE_CONTINUOUS_FAMILIES` | implement/verify named EventMediaRail hero-selector and poster-strip variants; close remaining shared MediaFrame/family ownership and source/API gaps in M0 roots |
| A0 | `ACTIVE_CONTINUOUS_CONSUMERS` | migrate remaining exact consumer files to AdaptiveEventCardGrid/canonical Button/tokens; later replace DesktopEventPage rail lookalikes with M0 variants |
| V0 | `HARNESS_READY_STANDBY_TRIGGER_ARMED` | resume on exact reachable integrated preview URL; one run covers full browser matrix |
| K0 | `ACTIVE_PRODUCT_FIRST` | maintain continuous execution and repair process/canonical drift directly |
| PM0 | `AVAILABLE_READ_ONLY` | readiness forecast only on request |

## Exact A0 consumer migration scope now assigned

In addition to layouts/listings/pages, A0 owns consumer-only changes in:

```text
site/src/components/HomeColdStartFeed.astro
site/src/components/FreeCollectionSurface.astro
site/src/components/UnusualListingSurface.astro
site/src/components/GastronomyCollectionSurface.astro
site/src/components/PersonalFeedSlot.astro
site/src/components/MobileEventReviewPage.astro
site/src/components/DesktopEventPage.astro  # after M0 rail variants
site/src/components/FocusGroupFeedback.astro
site/src/components/FocusGroupInviteIntake.astro
site/src/components/FocusGroupInviteShare.astro
site/src/components/FocusGroupLabPanel.astro
site/src/components/FocusPwaInstallAction.astro
```

A0 may import/use M0 roots but must not edit `EventCard`, `ListingEventCard`,
`AdaptiveEventCardGrid`, `OptimizedEventCardGrid` or `EventMediaRail`.

## Current parallel sequence

```text
N0 + R0:
  frozen candidate same-data baseline
  → conditional promotion
  → fresh generation/publication
  → reachable preview

F0:
  central semantic coverage for remaining actual surfaces

M0:
  canonical EventMediaRail variants + MediaFrame/family convergence

A0:
  remaining actual consumer migration on separate role branch

V0:
  zero-cost standby until physical URL
```

A checkpoint does not end a role. After each result, the role fresh-reads,
recomputes its actual-consumer backlog and continues. Standby is allowed only
when no independent useful work remains and an exact external trigger is recorded.

## Owner-visible checkpoint board

| Result | State |
|---|---|
| current same-data baseline | `READY_R0_EXECUTION` |
| first conditional promotion/fresh generation | `PENDING_N0_CONTINUATION` |
| reachable normalized preview | `PENDING_N0_R0` |
| F0 remaining foundation coverage | `ACTIVE_PARALLEL` |
| M0 rail/framing convergence | `ACTIVE_PARALLEL` |
| A0 remaining consumer migration | `ACTIVE_PARALLEL` |
| V0 browser verdict | `TRIGGERED_BY_REACHABLE_URL` |
| `ASTRO_NORMALIZATION_PASS` | `CLOSED` |

## ASTRO_NORMALIZATION_PASS

The gate opens only when fresh generation is reproducible, all visible
foundations/colors/icons are normalized, same components use one root,
MediaFrame/framing and AdaptiveEventCardGrid cover actual consumers, routes are
migrated and V0 reports no critical DRIFT.
