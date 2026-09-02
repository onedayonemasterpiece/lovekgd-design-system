# Launch normalization — current status

Status owner: `N0`  
Coordination issue: `onedayonemasterpiece/events-bot-new#621`  
Programme start `T+0`: `NOT_SET`

T+0 is set only when N0/F0/M0/A0/V0 and R0 accept the corrected real-data-first
programme. No implementation window should launch from an older Golden-owner-
review or `/lab/launch/*` prompt.

## Current verified baseline

```yaml
events_bot_new:
  main_commit_at_programme_design: 61f7a6af5f5e82515dcd42c93dd02748297112bc
  integration_branch: integration/ui-normalization-launch-20260902
  product_state: substantial Astro implementation with historical UI drift
  actual_date_routes:
    today: /segodnya/
    tomorrow: /zavtra/
    arbitrary_date: /date-YYYY-MM-DD/
    active_weekend: /vyhodnye/
    selected_weekend: /vyhodnye/YYYY-MM-DD/
  shared_compositions:
    date: DateListingSurface
    weekend: WeekendListingSurface
  owner_preview_entrypoint: /<buildId>/__preview/
  current_checked_in_production_catalog: historical_and_must_be_refreshed
  existing_export_preview_production_kaggle_paths: present
  existing_foundations_components_and_checks: present_but_drifted

lovekgd_design_system:
  integration_branch: integration/launch-normalized-sot-penpot-20260902
  role: thin_family_consumer_asset_golden_penpot_binding
  reusable_inputs:
    - decoder 107 logical components
    - normalization synthesis 47 analytical families
    - PR 37 card/icon/medallion/framing donors
    - PR 42 Golden Event Corpus
    - PR 43 Date Listing + Shell
    - PR 52 17 archetypes / 34 desktop-mobile cases
    - old Penpot selective donor archive

penpot:
  target_file_id: 40e06342-8830-80d6-8008-8fc8a3a4cd4f
  current_value: historical_partial_candidate_only
  accepted_launch_families: 0
  accepted_launch_pages: 0
  free_page_ASP: false

owner_review:
  first_required_surface: fresh_real_data_preview
  golden_corpus_review_required: false
  new_owner_facing_lab_pages: forbidden

golden_conformance:
  purpose: internal_deterministic_A_equals_S_equals_P
  frozen_current_day: Friday
  routes:
    friday: /segodnya/
    saturday: /zavtra/
    sunday: /date-YYYY-MM-DD/
    weekend: /vyhodnye/
    free: /podborki/besplatnye-sobytiya/
```

## Owner-visible checkpoint board

| Checkpoint | Latest | Required owner-visible result | Status | Exact link / artifact | Blocker |
|---|---:|---|---|---|---|
| Fresh current product | T+1h | fresh real-data `/<buildId>/__preview/` + build verdict | NOT_STARTED | — | T0 not set |
| Normalization baseline | T+3h | compact foundations/family/icon/media drift report | NOT_STARTED | — | T0 not set |
| First normalized wave | T+6h | refreshed real-data preview with foundations/icons applied | NOT_STARTED | — | T0 not set |
| Media/cards wave | T+10h | refreshed real-data preview with MediaFrame/EventCard normalized | NOT_STARTED | — | T0 not set |
| Key actual pages | T+14h | normalized free + today/tomorrow/weekend/date pages on real data | NOT_STARTED | — | T0 not set |
| First Penpot parity | T+16h | native foundations/icons/media/cards + linked free board + V0 verdict | NOT_STARTED | — | T0 not set |
| Half route scope | T+24h | ≥ half launch route families normalized on real data | NOT_STARTED | — | T0 not set |
| Astro normalization | T+32h | all critical families normalized or bounded deviation | NOT_STARTED | — | T0 not set |
| Internal Golden evidence | T+36h | deterministic conformance across critical shared families | NOT_STARTED | — | T0 not set |
| Production-form candidate | T+40h | fresh real-data Kaggle/build candidate | NOT_STARTED | — | T0 not set |
| Broad Penpot | T+44h | launch-scope masters + linked representative route boards | NOT_STARTED | — | T0 not set |
| Terminal | T+48h | final candidate + normalization report + free page A=S=P | NOT_STARTED | — | T0 not set |

## Normalization delivery board

Status values:

```text
NOT_STARTED
ASTRO_BUILDING
REAL_DATA_REVIEW
ASTRO_ACCEPTED
PENPOT_VISIBLE
ASP_PASS
REAL_DATA_PASS
BLOCKED_EXTERNAL
BLOCKED_PRODUCT_DECISION
```

| Family / surface | Owner | Central Astro + consumers | Real-data review | Thin S | Penpot linked | Golden V0 | Blocker |
|---|---|---|---|---|---|---|---|
| Fresh data export and preview | N0 | NOT_STARTED | NOT_STARTED | n/a | n/a | n/a | T0 not set |
| Foundations/type/spacing/colour/radii | F0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Four icon-size roles + SVG/brand/medallions | F0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| MediaFrame | M0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| EventCard / ListingEventCard family | M0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Other content/card families | M0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Shell/navigation/footer/floating | A0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| DateListingSurface consumers | A0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| WeekendListingSurface consumers | A0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Free collection | A0 + M0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Remaining route archetypes | A0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Production/Kaggle release | N0 | NOT_STARTED | NOT_STARTED | n/a | n/a | n/a | T0 not set |

## Required normalization report sections

- font families/weights and H1/H2/H3/H4/body/label/metadata roles;
- spacing/sizing/containers;
- semantic colours;
- radii/borders/elevation/layering;
- exactly four icon size roles and every consumer mapping;
- canonical SVG identities;
- MediaFrame modes and framing rules;
- normalized families/variants/states and actual route consumers;
- removed page-local forks/internal overrides;
- bounded deviations;
- fresh real-data preview URL and checks;
- Penpot master/linked-instance and A=S=P status.

## Live actors

| Actor | Required role | Actual liveness | Branch/task | Last meaningful result |
|---|---|---|---|---|
| N0 | docs/data/integration/release | NOT_LAUNCHED | — | — |
| F0 | foundations/icons/assets | NOT_LAUNCHED | — | — |
| M0 | media/component families | NOT_LAUNCHED | — | — |
| A0 | shell/listings/archetypes | NOT_LAUNCHED | — | — |
| V0 | real-data sanity + Golden Penpot audit | NOT_LAUNCHED | — | — |
| K0 | detailed consultant | SPEC_UPDATED | this branch | real-data-first correction |
| R0 | direct persistent Codex execution | NOT_LAUNCHED | — | — |

N0 updates this file only after a meaningful result. No internal materializer
phases, hashes, child handoffs or empty Penpot objects are recorded.