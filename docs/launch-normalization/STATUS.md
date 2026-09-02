# Launch normalization — current status

Status owner: `N0`  
Coordination issue: `onedayonemasterpiece/events-bot-new#621`  
Programme start `T+0`: `NOT_SET` — set only when N0/F0/M0/A0/V0 and R0 have
accepted the canonical programme.

This file is the compact consolidated state. Other windows post meaningful
results to issue #621; only N0 updates this file.

## Current baseline

```yaml
events_bot_new:
  base_branch: main
  base_commit: 61f7a6af5f5e82515dcd42c93dd02748297112bc
  integration_branch: integration/ui-normalization-launch-20260902
  current_product: working Astro implementation with historical component drift
  existing_design_system:
    tokens: present
    primitives: present
    runtime_catalog: /lab/design-system/
    source_checks: present

lovekgd_design_system:
  base_branch: main
  base_commit: b3567cb72d81a7aad4b47a68e220325f055697a2
  integration_branch: integration/launch-normalized-sot-penpot-20260902
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
  current_value: historical/partial candidate materialization only
  accepted_launch_families: 0
  accepted_launch_pages: 0
  free_page_ASP: false

production_generation:
  existing_local_and_kaggle_paths: present
  current_launch_branch_reproduction: not_started
  current_real_data_review_candidate: absent
```

## Owner-visible checkpoint board

| Checkpoint | Latest | Surface required | Status | Exact link / Penpot page | Blocker |
|---|---:|---|---|---|---|
| Programme routing | T+1h | plan, branches, status | PREPARED_BEFORE_T0 | issue #621 + canonical docs | none |
| Golden date corpus | T+3h | Friday/Saturday/Sunday single-date pages + weekend page | NOT_STARTED | — | T0 not set |
| Corpus coverage review | T+4h | fixture matrix and free projection | NOT_STARTED | — | T0 not set |
| Foundations browser catalogue | T+6h | normalized `/lab/design-system/` | NOT_STARTED | — | T0 not set |
| First Penpot families | T+7h | Foundations, Icons, MediaFrame | NOT_STARTED | — | T0 not set |
| MediaFrame + EventCard | T+10h | four browser cases + Penpot export | NOT_STARTED | — | T0 not set |
| Free collection Golden | T+14h | complete desktop/mobile page | NOT_STARTED | — | T0 not set |
| Free collection Penpot/V0 | T+16h | matching page + visual verdict | NOT_STARTED | — | T0 not set |
| Date/weekend normalized | T+20h | corrected browser pages | NOT_STARTED | — | T0 not set |
| First real-data preview | T+24h | exact review link | NOT_STARTED | — | T0 not set |
| Half route scope | T+24h | ≥ half launch archetypes in browser | NOT_STARTED | — | T0 not set |
| Broad Penpot | T+30h | foundations/cards/shell + 8–10 archetypes | NOT_STARTED | — | T0 not set |
| Full Golden route scope | T+36h | all launch-critical archetypes in browser | NOT_STARTED | — | T0 not set |
| Production-form candidate | T+40h | real-data Kaggle/build result | NOT_STARTED | — | T0 not set |
| Full Penpot route scope | T+44h | every launch archetype represented | NOT_STARTED | — | T0 not set |
| Terminal | T+48h | final real-data candidate + free page A=S=P | NOT_STARTED | — | T0 not set |

## Family delivery board

Status values:

```text
NOT_STARTED
ASTRO_BUILDING
BROWSER_REVIEW
ASTRO_ACCEPTED
PENPOT_VISIBLE
ASP_PASS
REAL_DATA_PASS
BLOCKED_EXTERNAL
BLOCKED_PRODUCT_DECISION
```

| Family / surface | Owner | Astro | Golden browser | Penpot | V0 | Real data | Current blocker |
|---|---|---|---|---|---|---|---|
| Golden Corpus + launch index | N0 | NOT_STARTED | NOT_STARTED | n/a | n/a | n/a | T0 not set |
| Foundations/tokens | F0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Primitives/controls | F0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Canonical icons/brand/medallions | F0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| MediaFrame | M0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| EventCard | M0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Other card/content families | M0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Shell/navigation/footer/floating | A0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Single-date listing (Fri/Sat/Sun) | A0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Weekend/two-day listing | A0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Free collection | A0 + M0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Search/favourites/personal | A0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Collections/exhibitions/festivals/clubs | A0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Event detail | A0 + M0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Focus/partners/special states | A0 | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | T0 not set |
| Production generation/release | N0 | NOT_STARTED | n/a | n/a | NOT_STARTED | NOT_STARTED | T0 not set |

## Live actors

| Actor | Required role | Actual liveness | Branch/task | Last meaningful result |
|---|---|---|---|---|
| N0 | docs/corpus/integration/release | NOT_LAUNCHED | — | — |
| F0 | foundations/primitives/assets | NOT_LAUNCHED | — | — |
| M0 | media/component families | NOT_LAUNCHED | — | — |
| A0 | shell/listings/archetypes | NOT_LAUNCHED | — | — |
| V0 | independent visual audit | NOT_LAUNCHED | — | — |
| K0 | detailed consultant | SPEC_READY | this branch | consultant spec created |
| R0 | direct persistent Codex execution | NOT_LAUNCHED | — | — |

## Update rule

N0 updates this file only after a meaningful issue #621 result or review verdict.
Do not add rows for internal materializer phases, hashes, child-agent handoffs or
empty Penpot objects.
