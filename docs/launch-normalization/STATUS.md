# Launch normalization — current status

Status owner: `N0`  
Coordination issue: `onedayonemasterpiece/events-bot-new#621`  
Programme start `T+0`: `NOT_SET`

`T+0` — только clock. Он фиксируется по фактическому старту первой fresh-data
generation command, когда F0/M0/A0/V0 уже запущены. Его отсутствие не блокирует
source normalization, verification preparation или process repair.

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

Self-referential design-system branch SHA intentionally is not embedded here:
this file would make it stale on its own next commit. Readers resolve the current
remote branch ref. Exact source-wave SHAs below remain pinned.

## Durable actor state

| Actor | State | Durable evidence | Next product action |
|---|---|---|---|
| N0 | `LAUNCHED_NO_DURABLE_GENERATION_RESULT` | owner reports window completed; no N0 result, branch or fresh build in #621 | derive generation flow, use native R0 only for local execution, review output, publish real fresh-data verdict |
| F0 | `SOURCE_WAVE_READY` | `work/ui-normalization-f0-20260903@d5f1fab4a09aada97e7b7064c88736c415bb5bef`; result `5521057582` | continue independent consumer bindings; later integrate and browser-check |
| M0 | `SOURCE_WAVE_READY_VERIFICATION_PENDING` | `work/ui-normalization-m0-20260903@046b002621eee150adf2560c8e31e1adb53acb53`; results `5518054473`, `5518064829` | existing native R0 session completes tests/build verification; M0 reviews result |
| A0 | `SOURCE_WAVE_READY` | `work/ui-normalization-a0-20260903@5a4a3d3c2afa2f1a4fb71cd23194081d74dca4a6`; result `5517791881` | continue independent route/consumer work; integrate after N0 review |
| V0 | `DEPENDENCY_WAIT_PREVIEW_CONTINUING` | browser discovery `5517639901`; no product preview URL yet | continue source/selector/harness preparation; audit immediately when URL exists |
| K0 | `ACTIVE_PRODUCT_FIRST` | consultant correction `5521029923`; canonical autonomy repair in current docs | fix correctable process/doc drift directly; minimize owner messages |
| R0 | `EXISTING_SESSION_CORRECTION_REQUIRED` | defective stop `5520870765`; superseding autonomy correction `5520939114` | resume the same M0 verification task; infer recoverable fields; produce actual tests/build result |
| PM0 | `AVAILABLE_READ_ONLY` | role result `5521143401` | readiness forecast only on request; no dispatch or implementation |

No role is classified `NOT_LAUNCHED` merely because integration or preview is
missing. Missing dependent output is a scoped state, not a role-wide terminal
failure.

## Current source waves

### F0 foundations

```yaml
branch: work/ui-normalization-f0-20260903
head: d5f1fab4a09aada97e7b7064c88736c415bb5bef
state: SOURCE_WAVE_READY
scope:
  - semantic foundations alias layer
  - typography and geometry roles
  - semantic color map and duplicate merges
  - exactly four icon-size roles
  - canonical semantic icon identity
build: NOT_RUN
browser: NOT_RUN
```

### M0 components/media/grid

```yaml
branch: work/ui-normalization-m0-20260903
head: 046b002621eee150adf2560c8e31e1adb53acb53
state: SOURCE_WAVE_READY_VERIFICATION_PENDING
scope:
  - AdaptiveEventCardGrid canonical root
  - OptimizedEventCardGrid compatibility adapter
  - EventCard and ListingEventCard diagnostics
  - MediaFrame v1 protocol on existing frame nodes
  - EventMediaRail diagnostics and fail-closed fit
native_R0_verification: PENDING_RESUME
browser: NOT_RUN
```

### A0 routes/consumers

```yaml
branch: work/ui-normalization-a0-20260903
head: 5a4a3d3c2afa2f1a4fb71cd23194081d74dca4a6
state: SOURCE_WAVE_READY
scope:
  - DateListingSurface family/variant/state diagnostics
  - WeekendListingSurface current/dated diagnostics
  - TodayReviewGuard diagnostics
  - date/weekend route semantics preserved
free_collection_grid_migration: PENDING_M0_INTEGRATION_AND_PATH_ASSIGNMENT
build: NOT_RUN
browser: NOT_RUN
```

## Dependencies, not terminal blockers

| Dependency | Blocks | Does not block |
|---|---|---|
| no fresh preview URL | V0 product DOM/computed sweep | V0 harness preparation; F0/M0/A0 source work; N0 generation analysis |
| M0 verification pending | integration of the M0 wave | F0/A0 independent work; M0 next independent slice |
| N0 generation not started | technical baseline and combined preview | source normalization and process repair |
| Penpot not started | Penpot/Golden parity | Astro normalization and browser preparation |

The former `MISSING_PACKET_FIELD` and `BASELINE_PREVIEW_UNAVAILABLE` terminal
interpretations are process defects. Recoverable metadata is inferred; an absent
preview remains a scoped N0 dependency.

## Nearest product sequence

```text
existing R0 resumes M0 tests/build verification
+ N0 finalizes and executes fresh-data generation through native R0 where needed
+ F0/M0/A0 continue independent work
→ N0 reviews and integrates verified F0/M0/A0 source waves
→ fresh combined /<buildId>/__preview/
→ V0 personal DOM/computed-style verdict
→ critical DRIFT repair
→ first owner-facing normalized preview
```

An R0 task description, packet, worktree or dispatch is not a checkpoint. The
owning ChatGPT role remains responsible until it reviews the output and publishes
a real generation/wave/preview result.

## Owner-visible checkpoint board

| Result | State | Current dependency |
|---|---|---|
| technical fresh-data baseline | `PENDING_N0_EXECUTION` | generation command has not started |
| foundations/component/route source census | `AVAILABLE` | F0/M0/A0 durable results exist |
| M0 executable regression verdict | `PENDING_R0_RESUME` | same native R0 session must continue |
| combined normalized preview | `PENDING_GENERATION_AND_INTEGRATION` | N0 |
| V0 DOM/computed verdict | `PENDING_PREVIEW_NONTERMINAL` | exact local or published URL |
| `ASTRO_NORMALIZATION_PASS` | `CLOSED` | generation, integration, consumer migration and browser evidence incomplete |

## ASTRO_NORMALIZATION_PASS

Gate opens only when all are true:

- fresh-data generation is reproducible;
- foundations and visible colors are tokenized;
- exactly four icon roles are applied to all consumers;
- visually/behaviorally same components use one family root;
- MediaFrame/framing passes browser measurements;
- AdaptiveEventCardGrid covers applicable consumers;
- actual routes are migrated;
- V0 reports no critical `DRIFT`.

Product UI-gap, palette exploration and redesign remain outside the active scope
until this gate opens.

## Status discipline

- Fix correctable canonical drift before reporting it.
- Missing metadata, stale checkpoints and dependent surfaces are not terminal.
- `[BLOCKER]` requires exhausted independent work plus a concrete external,
  product-decision, writer-conflict or irreversible-risk boundary.
- N0 updates this file after meaningful durable results; other authorized
  canonical maintainers may repair factual drift immediately rather than leave
  it for the owner.
