# Launch normalization — current status

Status owner: `N0`  
Coordination issue: `onedayonemasterpiece/events-bot-new#621`  
Programme start `T+0`: `NOT_SET`

`T+0` фиксируется, когда N0 начал fresh-data generation и одновременно
запущены минимум F0/M0/A0/V0. Формального ожидания acceptance от каждого окна
нет.

Canonical plan:

```text
docs/launch-normalization/README.md
docs/launch-normalization/PARALLEL-WINDOWS.md
docs/launch-normalization/CONSULTANT-K0.md
contracts/launch-normalized-ui.v1.yaml
```

## Current verified baseline

```yaml
events_bot_new:
  main_commit_at_programme_design: 61f7a6af5f5e82515dcd42c93dd02748297112bc
  integration_branch: integration/ui-normalization-launch-20260902
  branch_head_at_latest_doc_read: 2d594cc0414de8a8d1105526691241adcf41a0ac
  product_state: substantial_Astro_with_historical_UI_drift
  actual_routes:
    - / 
    - /segodnya/
    - /zavtra/
    - /date-YYYY-MM-DD/
    - /vyhodnye/
    - /vyhodnye/YYYY-MM-DD/
    - /podborki/besplatnye-sobytiya/
  shared_compositions:
    date: DateListingSurface
    weekend: WeekendListingSurface
  owner_preview_entrypoint: /<buildId>/__preview/
  checked_in_production_catalog: historical_and_requires_fresh_export
  existing_generation_paths: present_but_not_yet_reproduced_for_this_programme
  existing_row_donors:
    - site/src/lib/relatedCardLayout.mjs
    - site/src/components/OptimizedEventCardGrid.astro
  simple_local_grid_consumers_exist: true

lovekgd_design_system:
  integration_branch: integration/launch-normalized-sot-penpot-20260902
  role: thin_family_consumer_asset_golden_penpot_browser_binding
  current_contract_version: 1.3.0
  parallel_roles_documented: true

penpot:
  target_file_id: 40e06342-8830-80d6-8008-8fc8a3a4cd4f
  current_value: historical_partial_candidate_only
  accepted_launch_families: 0
  accepted_launch_pages: 0
  sole_writer: R0.PENPOT

owner_review:
  first_required_surface: first_normalized_fresh_real_data_preview
  technical_baseline_review_required: false
  golden_corpus_review_required: false
  new_owner_facing_lab_pages: forbidden

browser_validation:
  owner: V0
  connector: my-browser-bridge
  mode: read_only
  baseline_report: absent
  first_normalized_preview_verdict: absent
```

## Owner-visible checkpoint board

| Latest | Required result | Status | Exact link / artifact | Blocker |
|---:|---|---|---|---|
| T+1h | technical fresh-data generation verdict and baseline identity | NOT_STARTED | — | T0 not set |
| T+3h | compact census: roots/colors/type/icons/framing/card rows | NOT_STARTED | — | T0 not set |
| T+6h | first normalized real-data `/<buildId>/__preview/` + V0 DOM verdict | NOT_STARTED | — | T0 not set |
| T+10h | MediaFrame + EventCard roots + AdaptiveEventCardGrid on real data | NOT_STARTED | — | T0 not set |
| T+14h | free + today/tomorrow/date/weekend routes normalized | NOT_STARTED | — | T0 not set |
| T+18h | Penpot foundations/icons/media/cards/free board + first Golden verdict | NOT_STARTED | — | T0 not set |
| T+24h | at least half launch route families normalized; fresh preview | NOT_STARTED | — | T0 not set |
| T+32h | `ASTRO_NORMALIZATION_PASS` or one bounded deviation | NOT_STARTED | — | T0 not set |
| T+36h | internal Golden coverage for launch-critical families | NOT_STARTED | — | T0 not set |
| T+40h | UI-gap work opened + fresh production-form candidate | NOT_STARTED | — | T0 not set |
| T+44h | Penpot launch-scope masters and linked route boards | NOT_STARTED | — | T0 not set |
| T+48h | final real-data candidate + report + critical A=S=P | NOT_STARTED | — | T0 not set |

## Normalization delivery board

Status values:

```text
NOT_STARTED
SOURCE_CENSUS
ASTRO_BUILDING
FRESH_DATA_BUILD
DOM_AUDIT
DRIFT_REPAIR
ASTRO_NORMALIZED
PENPOT_VISIBLE
ASP_PASS
REAL_DATA_PASS
BLOCKED_EXTERNAL
BLOCKED_PRODUCT_DECISION
```

| Family / result | Owner | Source/root | Fresh data | V0 DOM | Thin S | Penpot | Blocker |
|---|---|---|---|---|---|---|---|
| Existing export/build reproduction | N0 | NOT_STARTED | NOT_STARTED | n/a | n/a | n/a | T0 not set |
| Technical fresh-data baseline | N0 | n/a | NOT_STARTED | NOT_STARTED | n/a | n/a | T0 not set |
| Typography/spacing/containers/radii | F0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Semantic colours + duplicate merge | F0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Four icon roles + canonical SVG/brand | F0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Component-root census and decisions | M0 | NOT_STARTED | n/a | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| MediaFrame/framing | M0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| EventCard / ListingEventCard family | M0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| AdaptiveEventCardGrid | M0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Shell/navigation/footer/floating | A0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| DateListingSurface consumers | A0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| WeekendListingSurface consumers | A0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Free collection actual route | A0 + M0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Remaining actual route archetypes | A0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Browser DOM/computed drift loop | V0 | read_only | NOT_STARTED | NOT_STARTED | n/a | later | T0 not set |
| Production/Kaggle release | N0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | n/a | n/a | T0 not set |

## ASTRO_NORMALIZATION_PASS

Gate is closed until all are true:

- fresh-data generation reproducible;
- foundations and colours tokenized;
- four icon roles applied to all consumers;
- visually/behaviorally same components use one family root;
- MediaFrame/framing passes browser measurements;
- AdaptiveEventCardGrid is used by all applicable consumers;
- actual routes migrated;
- V0 has no critical `DRIFT`.

Only after this gate may the programme start product UI-gap/change work.

## Live actors

| Actor | Required role | Actual liveness | Branch/task | Last meaningful result |
|---|---|---|---|---|
| N0 | generation/integration/status/release | NOT_LAUNCHED | — | — |
| F0 | foundations/colors/type/icons | NOT_LAUNCHED | — | — |
| M0 | component roots/media/cards/rows | NOT_LAUNCHED | — | — |
| A0 | shell/listings/routes/consumer migration | NOT_LAUNCHED | — | — |
| V0 | my-browser-bridge DOM audit; later Penpot | NOT_LAUNCHED | — | — |
| K0 | consultant/prompt author | SPEC_UPDATED | this branch | contract v1.3 + parallel plan |
| R0 | direct Codex worktrees + sole Penpot writer | NOT_LAUNCHED | — | — |

N0 обновляет этот файл только после meaningful result. Commits, test counts,
internal child handoffs и empty Penpot objects не считаются прогрессом.