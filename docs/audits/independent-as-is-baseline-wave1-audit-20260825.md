# Independent AS-IS Baseline and Unified Design Wave 1 Audit — 2026-08-25

- **Status:** `FINAL`
- **Terminal verdict:** `NEEDS_BOUNDED_FIXES_BEFORE_OWNER_REVIEW`
- **Audit mutation boundary:** this report only; Penpot remained read-only; no promotion, merge, deploy, production Astro mutation, token/foundation decision, validator change, or correction PR.

## Executive verdict

- **Terminal verdict:** `NEEDS_BOUNDED_FIXES_BEFORE_OWNER_REVIEW`
- **Confidence:** `HIGH — 0.90`
- **P0 count:** `0`
- **P1 count:** `7 bounded fix groups`
- **Owner review ready now:** `NO` for the combined AS-IS Baseline + Unified Design Wave 1 review. The AS-IS visual/structural baseline itself is closed and current, but the affected flow-state gaps and five incomplete Wave 1 review cases must not be presented as complete.
- **Audited PR head:** `b86bab3e91511b3d4bd7d953b22bceb847f02a51`
- **Live Penpot audit target:** revision `2479`
- **Audit branch:** `audit/independent-as-is-wave1-20260825`
- **Audit branch final commit:** this document's commit; exact SHA is returned by GitHub and reported in the completion response because a commit cannot embed its own SHA.

The baseline is not rejected. No substantial Astro↔Penpot mismatch, route/fixture substitution, broad stale evidence, detached owner composition, duplicate candidate family, image stretching or letterboxing was proven. The blockers are bounded: eight declared state-evidence gaps across three archetypes and insufficient real-page/state context in five of six Wave 1 cases.

## Audit authority and immutable scope

- Repository: `onedayonemasterpiece/lovekgd-design-system`
- Audited Draft PR: `#52`
- Audited head: `b86bab3e91511b3d4bd7d953b22bceb847f02a51`
- Corrected SoT base: `9b8043f3bdb86fab4eee00bf94b0f10d4f029c50`
- Astro authority: `onedayonemasterpiece/events-bot-new@7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00`
- Penpot file: `3be9e5e1-190f-8090-8008-713c0fbe6260`
- Committed baseline Penpot revision: `2463`
- Live / Unified Design Wave 1 Penpot revision: `2479`
- Audit branch: `audit/independent-as-is-wave1-20260825`

PR #52 was re-read before the audit branch was created and again before final continuation. It remained open and Draft, with head `b86bab3e91511b3d4bd7d953b22bceb847f02a51` and base `9b8043f3bdb86fab4eee00bf94b0f10d4f029c50`. The audit branch was created directly from the pinned head; neither the PR branch nor the audited commit was changed.

## Delivery and reproducibility checkpoint

- Exact-head checks completed successfully.
- Production Astro generation diff is `0`.
- Wave 1 boundaries remain `new_foundation_tokens=0`, `canonical_foundation_mutations=0`, and `production_astro_changes=0`.
- Live Penpot readback target is revision `2479`; the successful audit readback reported `validate()=[]`.
- Committed baseline revision `2463` contains 17 archetypes, 34 desktop/mobile cases, 709 components and 0 validation errors.
- Browser receipt reports 34/34 cases passed.
- Idempotent replay reports creates `0`, components `709→709`, validation `[]`.
- Wave 1 readback reports 3 pages, 6 review cases, 717 components and status `REVIEWABLE_NOT_ACCEPTED`.
- A final continuation attempt to invoke the live Penpot connector returned a connector-level `FORBIDDEN`; no retry loop or mutation was attempted. The state and Wave 1 conclusions below use the earlier successful bounded live readbacks plus committed revision-bound Git evidence.

## Live staleness classification

The 34 exact owner-board identities and their linked composition ancestry remain valid. Thirty-one live exports are pixel-identical to committed revision 2463 evidence. The remaining three deltas were bounded to their exact boards and linked descendants.

### 1. Date Listing desktop

- Case: `archetype.listing.date.desktop.current-v1`
- Page: `63.02`; page ID `d87e18f1-dcb4-80a6-8008-8807f67e8a2e`
- Owner board: `d87e18f1-dcb4-80a6-8008-8807f6b14cd1`
- Changed ratio: `0.00074`; normalized RMSE: `0.01343`
- Delta box: `x=715..916, y=189..200`
- Readback: the linked date-navigation identities, geometry and labels `Сегодня` / `Завтра` are unchanged; the delta is confined to glyph rows.
- Classification: `NOT_STALE_RENDERER_DELTA`
- Semantic impact: none found.
- Regeneration scope: none.

### 2. Exhibitions mobile

- Case: `archetype.exhibitions.mobile.current-v1`
- Page: `63.10`; page ID `d87e18f1-dcb4-80a6-8008-880cc5490f78`
- Owner board: `d87e18f1-dcb4-80a6-8008-880cc78ce882`
- Changed ratio: `0.00031`; normalized RMSE: `0.01105`
- Bottom navigation: shape `d87e18f1-dcb4-80a6-8008-8864016475f1`, component `a21f5e36-5d76-8065-8008-86aec0a54bb5`
- Affected personal-navigation icon remains linked to component `a21f5e36-5d76-8065-8008-86f0841620ba`.
- Classification: `NOT_STALE_RENDERER_DELTA`
- Semantic impact: none found; the delta is confined to icon rasterization.
- Regeneration scope: none.

### 3. Popular Listing mobile

- Case: `archetype.listing.popular.mobile.current-v1`
- Page: `63.04`; page ID `d87e18f1-dcb4-80a6-8008-880937f54501`
- Owner board: `d87e18f1-dcb4-80a6-8008-8809ea570ea8`
- Changed ratio: `0.01269`; normalized RMSE: `0.04589`
- `fast_growth`: shape `8e7accff-5c78-8007-8008-897cc44fe01d`, component `8e7accff-5c78-8007-8008-897c31f71935`
- `discussed`: shape `8e7accff-5c78-8007-8008-897cc5663dfa`, component `8e7accff-5c78-8007-8008-897c49550721`
- Readback: both grouping identities, geometry, source-locked fixtures and descendant component ancestry remain stable; no component-master mutation or missing/extra region was found.
- Classification: `MINOR_LIVE_DRIFT`
- Semantic impact: bounded instance content/media rendering only; the pinned committed baseline is not stale.
- Optional regeneration scope: only this case's live Penpot PNG, overlay and diff when an exact-live evidence refresh is desired; no master, contract or baseline-wide regeneration.

**Staleness conclusion:** `0/34` committed baseline cases are classified as `STALE_BASELINE_EVIDENCE`.

## Baseline matrix

The matrix separates semantic visual conformance from renderer/capture differences. `KNOWN_RENDERER_DELTA` does not hide a missing region, changed component/state, geometry defect, crop rule violation or route/fixture substitution; it records visible typography, antialiasing, image-raster or capture-alignment variance after those semantic causes were checked.

| case | identity | structure | visual | states | verdict | defect summary |
| --- | --- | --- | --- | --- | --- | --- |
| archetype.home.desktop.current-v1 | PASS | PASS; 4/4 linked | typography/image raster variance only | default owner represented | KNOWN_RENDERER_DELTA | no semantic defect found |
| archetype.home.mobile.current-v1 | PASS | PASS; 5/5 linked | typography/image raster variance only | default owner represented | KNOWN_RENDERER_DELTA | no semantic defect found |
| archetype.listing.date.desktop.current-v1 | PASS | PASS; 1/1 linked | bounded text-renderer delta in date navigation | default owner represented | KNOWN_RENDERER_DELTA | live evidence remains semantically current |
| archetype.listing.date.mobile.current-v1 | PASS | PASS; 1/1 linked | no semantic difference found | default owner represented | PASS | none |
| archetype.listing.weekend.desktop.current-v1 | PASS | PASS; 1/1 linked | no semantic difference found | default owner represented | PASS | none |
| archetype.listing.weekend.mobile.current-v1 | PASS | PASS; 1/1 linked | lower-frame typography/capture variance | default owner represented | KNOWN_RENDERER_DELTA | no missing or extra region |
| archetype.listing.popular.desktop.current-v1 | PASS | PASS; 6/6 linked | no semantic difference found | default owner represented | PASS | none |
| archetype.listing.popular.mobile.current-v1 | PASS | PASS; 5/5 linked | renderer/content-raster variance; live instance drift bounded | default owner represented | KNOWN_RENDERER_DELTA | no master mutation; optional single-case evidence refresh only |
| archetype.listing.unusual.desktop.current-v1 | PASS | PASS; 4/4 linked | no semantic difference found | default owner represented | PASS | none |
| archetype.listing.unusual.mobile.current-v1 | PASS | PASS; 4/4 linked | typography/capture variance only | default owner represented | KNOWN_RENDERER_DELTA | no semantic defect found |
| archetype.search.desktop.current-v1 | PASS | PASS; 4/4 linked | typography/alignment variance only | owner plus linked state components present | KNOWN_RENDERER_DELTA | no route or region mismatch |
| archetype.search.mobile.current-v1 | PASS | PASS; 4/4 linked | bounded `dy=8` capture/typography variance | owner plus linked state components present | KNOWN_RENDERER_DELTA | Search destination and composition preserved |
| archetype.event-detail.desktop.current-v1 | PASS | PASS; 7/7 linked | fixture 5459 composition conforms | default photo composition; gap audit separate | PASS | none in represented composition |
| archetype.event-detail.mobile.current-v1 | PASS | PASS; 5/5 linked | fixture 5459 composition conforms | poster/protected-media composition; gap audit separate | PASS | none in represented composition |
| archetype.collections.desktop.current-v1 | PASS | PASS; 10/10 linked | no semantic difference found | default owner represented | PASS | none |
| archetype.collections.mobile.current-v1 | PASS | PASS; 9/9 linked | typography/image-raster variance only | default owner represented | KNOWN_RENDERER_DELTA | no semantic defect found |
| archetype.festivals.desktop.current-v1 | PASS | PASS; 5/5 linked | largest variance confined to lower capture bands | default owner and linked festival regions present | KNOWN_RENDERER_DELTA | no missing timeline/header/card region found; live export refresh returned 502 after successful readback |
| archetype.festivals.mobile.current-v1 | PASS | PASS; 6/6 linked | typography/image-raster variance only | default owner represented | KNOWN_RENDERER_DELTA | no semantic defect found |
| archetype.exhibitions.desktop.current-v1 | PASS | PASS; 8/8 linked | no semantic difference found | default owner represented | PASS | none |
| archetype.exhibitions.mobile.current-v1 | PASS | PASS; 6/6 linked | bounded bottom-navigation icon raster delta | default owner represented | KNOWN_RENDERER_DELTA | live evidence remains semantically current |
| archetype.interest-clubs.desktop.current-v1 | PASS | PASS; 4/4 linked | no semantic difference found | default owner represented | PASS | none |
| archetype.interest-clubs.mobile.current-v1 | PASS | PASS; 4/4 linked | typography/capture variance only | default owner represented | KNOWN_RENDERER_DELTA | no semantic defect found |
| archetype.favorites.desktop.current-v1 | PASS | PASS; 5/5 linked | represented anonymous-empty composition conforms | state gaps audited separately | PASS | none in represented composition |
| archetype.favorites.mobile.current-v1 | PASS | PASS; 5/5 linked | typography/capture variance only | state gaps audited separately | KNOWN_RENDERER_DELTA | live export retry unavailable after 502; committed evidence and exact live ancestry remain valid |
| archetype.personal-feed.desktop.current-v1 | PASS | PASS; 5/5 linked | typography/capture variance only | state gap audited separately | KNOWN_RENDERER_DELTA | no semantic defect in consent-undecided owner |
| archetype.personal-feed.mobile.current-v1 | PASS | PASS; 6/6 linked | typography/capture variance only | state gap audited separately | KNOWN_RENDERER_DELTA | no semantic defect in consent-undecided owner |
| archetype.focus-group.desktop.current-v1 | PASS | PASS; 3/3 linked | large type/wrapping and lower-content raster variance | represented composition intact | KNOWN_RENDERER_DELTA | no missing/extra region or detached leaf found |
| archetype.focus-group.mobile.current-v1 | PASS | PASS; 2/2 linked | large type/wrapping and lower-content raster variance | represented composition intact | KNOWN_RENDERER_DELTA | no missing/extra region or detached leaf found |
| archetype.artifacts.desktop.current-v1 | PASS | PASS; 3/3 linked | no semantic difference found | default owner represented | PASS | none |
| archetype.artifacts.mobile.current-v1 | PASS | PASS; 3/3 linked | no semantic difference found | default owner represented | PASS | none |
| archetype.information-pages.desktop.current-v1 | PASS | PASS; 4/4 linked | no semantic difference found | partnership route composition represented | PASS | none |
| archetype.information-pages.mobile.current-v1 | PASS | PASS; 4/4 linked | typography/wrapping and capture variance only | partnership route composition represented | KNOWN_RENDERER_DELTA | hero, benefits and directory identities remain present |
| archetype.special-state.desktop.current-v1 | PASS | PASS; 1/1 linked | sparse-state typography/alignment variance | represented special state intact | KNOWN_RENDERER_DELTA | no semantic defect found |
| archetype.special-state.mobile.current-v1 | PASS | PASS; 1/1 linked | sparse-state typography/alignment variance | represented special state intact | KNOWN_RENDERER_DELTA | no semantic defect found |

### Baseline visual conclusion

- `PASS`: 12 cases.
- `KNOWN_RENDERER_DELTA`: 22 cases.
- `MINOR`: 0 cases.
- `MAJOR`: 0 cases.
- `BLOCKED_EVIDENCE`: 0 cases.
- No image stretching, letterboxing, missing/extra page region, route/fixture substitution, detached composition or changed responsive branch was proven in the 34 committed comparisons.
- High RMSE cases were not treated as failures by threshold. Focus Group, Search mobile, Information Pages mobile and Festivals desktop retain their expected semantic regions and linked ownership.

## State-coverage matrix

The corrected contracts declare 180 states. Of these, 172 are materialization-eligible and have an owner-board, linked source-component or explicit runtime/Git evidence path. Eight declared states remain explicit source-evidence gaps. They are not silently counted as represented and do not invalidate the 34 default owner-board identities; they do block a claim of complete flow coverage for the affected archetypes.

| archetype | required states/compositions | represented | runtime-only | gaps |
| --- | --- | --- | --- | --- |
| archetype.home | 4 declared; desktop/mobile shell, hero, quick navigation, cold-start/personalized branch | 4/4 through two owner boards and linked Home components | personalized-local and prelaunch environment behavior remain runtime/Git-evidenced | none |
| archetype.listing.date | 13 declared; date navigation, listing composition and loading/error branches | 13/13 through owner boards, linked date navigation and source-bound list-state components | network/loading transition behavior | none |
| archetype.listing.weekend | 8 declared; desktop/mobile weekend listing compositions | 8/8 through owner boards and linked listing dependencies | no separate static runtime board required | none |
| archetype.listing.popular | 6 declared; grouping plus personalized/unpersonalized branches | 6/6 through owner boards and linked grouping components | personalization selection | none |
| archetype.listing.unusual | 6 declared; default and stale branches | 6/6 through owner boards and source-bound state evidence | stale-data transition | none |
| archetype.search | 20 evidence-bound states covering idle, validation, loading/progress, results, empty, error, retry, load-more, timeout, recovery and anonymous/authenticated boundaries | 20/20 through owner composition, page-level state components and exact source/browser evidence | authorization, request timing, focus trapping, incremental load and recovery mechanics | none |
| archetype.event-detail | 31 declared compositions/states across layout, media, transport and support actions | 26/31: current desktop/mobile owners plus linked editorial-with-poster-companion, desktop no-image, mobile photo and poster/protected-media, transport absent/rail/bus/Kaup, question CTA, page feedback and event-error-report ownership | gallery/dialog behavior, ticket/calendar/share/like runtime transitions | `layout.editorial-wide`; `layout.split-poster`; `mobile-media.no-image`; `transport.multiple`; `transport.stale` |
| archetype.collections | 6 declared collection compositions | 6/6 through owner boards and linked collection regions | collection data refresh | none |
| archetype.festivals | 6 declared festival compositions | 6/6 through owner boards and linked header/timeline/card regions | schedule data refresh | none |
| archetype.exhibitions | 8 declared, including hidden, personalized, undo and unpersonalized branches | 8/8 through owner boards, linked exhibition regions and source/runtime evidence | personalization, hide and undo mechanics | none |
| archetype.interest-clubs | 5 declared index/detail compositions | 5/5 through owner boards and linked club regions | detail data loading | none |
| archetype.favorites | 16 declared across local-only, auth-required, reconciliation, populated/empty and failure flows | 14/16: anonymous-empty owners plus linked local/auth/reconciliation/empty/catalog-failure/cloud-failure evidence | authentication, loading, retry and stale reconciliation mechanics | `favorites.populated`; `favorites.action-refresh` |
| archetype.personal-feed | 20 declared across consent, profile readiness, loading, empty/populated, stale/error, hidden and restore flows | 19/20 through consent-undecided owners, linked feed/profile components and source/runtime evidence | filtering, reranking, stale refresh and restore mechanics | `personal-feed.storage-failure` |
| archetype.focus-group | 15 declared stages and diagnostic branches | 15/15 through owner boards, linked program navigation/hero/steps/stage cards and runtime evidence | invitation, identity, feedback, completion and diagnostic transitions | none |
| archetype.artifacts | 6 declared artifact states | 6/6 through owner boards and linked artifact regions | locked/unlocked authorization behavior | none |
| archetype.information-pages | 4 declared information-page compositions | 4/4 through partnership owner boards and linked hero/benefit/directory regions | route content loading | none |
| archetype.special-state | 6 declared special access states | 6/6 through owner boards and exact source/runtime evidence | checking, locked and prelaunch environment behavior | none |

### State-coverage conclusion

- All 172 materialization-eligible states have a bounded evidence disposition.
- The eight gaps are explicit and source-related; no speculative Penpot board should be invented to hide them.
- Event Detail, Favorites and Personal Feed are not ready for a claim of complete flow coverage until each gap is either source-proven and checkpointed or explicitly reclassified outside the AS-IS owner-review scope with a stable runtime/unresolved disposition.
- Search state ownership is sufficient: static components cover visible states, while authorization, focus, request timing and recovery mechanics remain correctly runtime-owned.

## Unified Design Wave 1 matrix

Live revision 2479 and the committed readback confirm native candidate identities, reuse of existing semantic components, stable component IDs and no candidate-specific foundation fork. The deficiencies are evidence/context completeness problems, not detached-component or duplicate-family defects.

| case | context | architecture | responsive/state completeness | verdict |
| --- | --- | --- | --- | --- |
| 01.search-nav.desktop | isolated 1280×120 header region; route body absent | existing desktop header plus native linked search-entry candidate; route links retained | current 1280 state shown; narrow desktop, long-label pressure, auth/account branch and destination/page context absent | NEEDS_PAGE_CONTEXT |
| 02.search-nav.mobile | existing bottom-navigation region with Search as the current destination | linked current mobile navigation; no second mobile navigation family | preservation question is sufficiently represented and target remains `/poisk/` | READY_FOR_OWNER_REVIEW |
| 03.selectors.desktop | isolated 1180×88 selector surface; real Date Listing composition absent | native candidate reuses existing filter controls as one contextual owner | default only; open, selected, long label, error, zero-results and page placement absent | NEEDS_REQUIRED_STATES |
| 04.selectors.mobile | isolated 390×112 trigger surface; existing date rail intentionally retained | native two-trigger responsive branch; no duplicate date controller | actual sheet/dialog relation, focus/Escape behavior, selected/error/long-label/zero-results states and page placement absent | NEEDS_REQUIRED_STATES |
| 05.floating.desktop | isolated 404×220 action island; full Event Detail composition absent | native candidate reuses linked Calendar/Share/Like semantics; not applicable to listing/search remains justified | sticky/scrolled anchoring, long labels/counts, focus order, underlays and archived/sold-out/unavailable states absent | NEEDS_PAGE_CONTEXT |
| 06.floating.mobile | isolated 366×196 action island; no real long-content or safe-area context | native responsive branch reuses shared semantic actions; no universal floating-pill expansion | safe-area, occlusion, last-content reachability, scroll, underlays, focus order and unavailable states absent | NEEDS_PAGE_CONTEXT |

### Wave 1 conclusion

- Native architecture: `PASS` for all six cases.
- Candidate-specific foundation fork: none found.
- Detached visual duplicate family: none found.
- Ready now: only `02.search-nav.mobile`.
- Five cases require bounded page/state evidence before a combined owner review.

## Validator independence

Independent checks include hashes, exact file/case sets, file existence, screenshot hashes, geometry equality, board IDs and URLs, linked ancestry, generation diff and replay invariants. These establish identity, integrity and reproducibility.

The semantic status labels, builder receipts and their validators still share one evidence-production pipeline. No independent oracle checks whether a comparison that exists is visually or product-semantically correct. Therefore validator success is supporting evidence, not the final UI/state verdict; the baseline, state and Wave 1 matrices above are based on the independent case-level semantic audit.

## Findings

### P0

None.

### P1

1. Event Detail lacks a resolved evidence disposition for `layout.editorial-wide`, `layout.split-poster` and `mobile-media.no-image`.
2. Event Detail lacks a resolved evidence disposition for `transport.multiple` and `transport.stale`.
3. Favorites lacks source-bound `favorites.populated` and `favorites.action-refresh` coverage.
4. Personal Feed lacks source-bound `personal-feed.storage-failure` coverage.
5. Desktop Search navigation candidate is structurally sound but is not shown in enough real page, narrow-width and auth/account context.
6. Responsive selectors are structurally sound but lack the real Date Listing placement and required visible desktop/mobile states.
7. Floating action island is structurally sound but lacks full Event Detail placement, scrolling, safe-area, underlay and unavailable-action evidence.

### Significant P2

- `archetype.listing.popular.mobile.current-v1` has bounded instance-level live drift. It does not stale the baseline; a single-case exact-live evidence refresh is optional.
- Validators strongly prove artifact integrity and repeatability but do not independently prove semantic visual correctness. Independent semantic review must remain a release gate.
- The final live Penpot re-check was unavailable because the connector returned `FORBIDDEN`. This limits only a new post-checkpoint read; it does not invalidate the successful revision-2479 readbacks already incorporated into the remote audit checkpoints.

## Bounded fixes

### BF-01 — Event Detail layout and media evidence

```text
severity: P1
scope: resolve three declared layout/media gaps without changing production Astro
archetype_or_pattern: archetype.event-detail
viewport_state: desktop layout.editorial-wide; desktop layout.split-poster; mobile mobile-media.no-image
penpot_page_id: d87e18f1-dcb4-80a6-8008-880bfdfbf2ec
penpot_board_id: d87e18f1-dcb4-80a6-8008-880bfe361a1d; d87e18f1-dcb4-80a6-8008-880c01b4fbef
git_paths: catalog/global-archetype-sot-v1/archetype-contracts/event-detail.semantic-contract.v1.json; catalog/global-archetype-sot-v1/penpot-materialization-plan.v1.json; catalog/round-trip-reconstruction/v1/bindings.v1.json; evidence/round-trip-reconstruction/v1/{astro,penpot,comparisons}/archetype.event-detail.*
problem: the contract requests three compositions for which the pinned source/browser evidence does not currently prove an exact AS-IS state
evidence: state census 31 declared / 26 represented; explicit gaps remain source-unproven
lowest_owning_fix: for each state either bind an exact source-proven deterministic fixture and linked component checkpoint, or explicitly classify it runtime_only/unresolved and outside AS-IS owner-review scope; never fabricate a visual state
 affected_consumers: Event Detail desktop/mobile; Floating action island applicability review
revalidation: exact fixture/state identity, linked ancestry, no stretch/letterbox, desktop/mobile export, overlay/diff, validate()=[], production Astro diff 0
```

### BF-02 — Event Detail transport evidence

```text
severity: P1
scope: resolve transport.multiple and transport.stale disposition
archetype_or_pattern: archetype.event-detail
viewport_state: desktop/mobile transport.multiple; transport.stale
penpot_page_id: d87e18f1-dcb4-80a6-8008-880bfdfbf2ec
penpot_board_id: d87e18f1-dcb4-80a6-8008-880bfe361a1d; d87e18f1-dcb4-80a6-8008-880c01b4fbef
git_paths: catalog/global-archetype-sot-v1/archetype-contracts/event-detail.semantic-contract.v1.json; catalog/global-archetype-sot-v1/penpot-materialization-plan.v1.json; catalog/round-trip-reconstruction/v1/bindings.v1.json; evidence/round-trip-reconstruction/v1/{astro,penpot,comparisons}/archetype.event-detail.*
problem: absent/rail/bus/Kaup are owned, but multiple and stale have no exact source/browser checkpoint
evidence: two explicit transport gaps in the corrected contract census
lowest_owning_fix: source-prove and checkpoint the two states under the existing transport owner, or retain a stable explicit non-materialized disposition; do not create a second transport family
 affected_consumers: Event Detail; ticket/action-island context when transport changes page height
revalidation: owner identity, fixture lock, responsive composition, stale labeling, linked dependencies, comparisons, production Astro diff 0
```

### BF-03 — Favorites populated and refresh flow

```text
severity: P1
scope: complete the two missing visible Favorites flow states
archetype_or_pattern: archetype.favorites
viewport_state: desktop/mobile favorites.populated; favorites.action-refresh
penpot_page_id: d87e18f1-dcb4-80a6-8008-880d209a7fcd
penpot_board_id: d87e18f1-dcb4-80a6-8008-880d20bc67e8; d87e18f1-dcb4-80a6-8008-880d230a2b8b
git_paths: catalog/global-archetype-sot-v1/archetype-contracts/favorites.semantic-contract.v1.json; catalog/global-archetype-sot-v1/penpot-materialization-plan.v1.json; catalog/round-trip-reconstruction/v1/bindings.v1.json; evidence/round-trip-reconstruction/v1/{astro,penpot,comparisons}/archetype.favorites.*
problem: anonymous-empty owners do not prove populated content or post-action refresh/reconciliation
 evidence: 16 declared / 14 represented; exact gaps favorites.populated and favorites.action-refresh
lowest_owning_fix: bind source-proven populated and refresh fixtures to the existing Favorites owner/state components; retain local/auth/reconciliation ownership and avoid a detached duplicate flow
 affected_consumers: Favorites desktop/mobile; mobile bottom navigation destination
revalidation: populated/empty transition, local/cloud reconciliation, action refresh result, linked ancestry, desktop/mobile comparisons, production Astro diff 0
```

### BF-04 — Personal Feed storage failure

```text
severity: P1
scope: resolve the missing storage-failure recovery state
archetype_or_pattern: archetype.personal-feed
viewport_state: desktop/mobile personal-feed.storage-failure
penpot_page_id: d87e18f1-dcb4-80a6-8008-880d8bcc2d0b
penpot_board_id: d87e18f1-dcb4-80a6-8008-880d8c05a466; d87e18f1-dcb4-80a6-8008-880d8db35320
git_paths: catalog/global-archetype-sot-v1/archetype-contracts/personal-feed.semantic-contract.v1.json; catalog/global-archetype-sot-v1/penpot-materialization-plan.v1.json; catalog/round-trip-reconstruction/v1/bindings.v1.json; evidence/round-trip-reconstruction/v1/{astro,penpot,comparisons}/archetype.personal-feed.*
problem: consent/profile/feed states are owned, but storage failure has no exact source-bound visible checkpoint
 evidence: 20 declared / 19 represented; explicit personal-feed.storage-failure gap
lowest_owning_fix: bind the existing feed owner to a source-proven failure/recovery fixture or classify the branch as explicit runtime-only with owner and recovery contract; do not invent storage behavior
 affected_consumers: Personal Feed desktop/mobile; hidden/restore and consent recovery
revalidation: failure copy/action ownership, restore path, linked ancestry, responsive export/comparison, production Astro diff 0
```

### BF-05 — Desktop Search navigation page context

```text
severity: P1
scope: add bounded real-page and responsive evidence around the existing candidate
archetype_or_pattern: pattern.desktop-search-navigation.candidate-v1
viewport_state: desktop default/current-search; narrow desktop; long labels; auth/account
penpot_page_id: 8e7accff-5c78-8007-8008-89bf021cf5fd
penpot_board_id: 8e7accff-5c78-8007-8008-89bf5c941649
git_paths: catalog/unified-design-wave1/v1/patterns/desktop-search-navigation.candidate-v1.json; catalog/unified-design-wave1/v1/penpot-materialization-plan.v1.json; evidence/unified-design-wave1/v1/penpot-readback.v1.json; evidence/unified-design-wave1/v1/review-manifest.v1.json; evidence/unified-design-wave1/v1/comparisons/*search*
problem: the isolated 1280×120 strip proves architecture but not fit, destination context or narrow/auth branches
 evidence: final Wave 1 verdict NEEDS_PAGE_CONTEXT; mobile preservation case is already reviewable
lowest_owning_fix: place the same linked header/search-entry candidate in bounded real consumer page contexts, add narrow-width and auth/account variants, and keep route links plus `/poisk/` destination unchanged
 affected_consumers: archetype.listing.date; archetype.event-detail; archetype.search
revalidation: no route-link removal, 44px target, keyboard focus, long labels, narrow desktop fit, exact linked component IDs, candidate foundations unchanged
```

### BF-06 — Responsive selectors states and placement

```text
severity: P1
scope: complete desktop/mobile state evidence in real Date Listing context
archetype_or_pattern: pattern.responsive-context-selector.candidate-v1
viewport_state: desktop open/selected/long-label/error/zero-results; mobile trigger/sheet/focus/Escape/selected/error/long-label/zero-results
penpot_page_id: 8e7accff-5c78-8007-8008-89bf7fa6b295
penpot_board_id: 8e7accff-5c78-8007-8008-89bfec3c8ee0; 8e7accff-5c78-8007-8008-89bfece6f86a
git_paths: catalog/unified-design-wave1/v1/patterns/responsive-context-selector.candidate-v1.json; catalog/unified-design-wave1/v1/penpot-materialization-plan.v1.json; evidence/unified-design-wave1/v1/penpot-readback.v1.json; evidence/unified-design-wave1/v1/review-manifest.v1.json; evidence/unified-design-wave1/v1/comparisons/*selector*
problem: default isolated controls do not prove the actual dialog relation, long values, failure/zero-results behavior or page fit
 evidence: final desktop/mobile verdict NEEDS_REQUIRED_STATES
lowest_owning_fix: retain one semantic date/place/order owner, preserve the mobile date rail, add a real Date Listing placement and only the required visible state boards; runtime focus trapping remains code-owned but must have a documented focus/Escape checkpoint
 affected_consumers: archetype.listing.date
revalidation: date rail retained, no duplicate controller family, touch targets, sheet ownership, focus/Escape contract, long-label fit, zero-results/error copy, linked identities and comparison evidence
```

### BF-07 — Floating action island page and availability context

```text
severity: P1
scope: prove bounded applicability inside real Event Detail desktop/mobile compositions
archetype_or_pattern: pattern.floating-action-island.candidate-v1
viewport_state: desktop/mobile default, sticky/scrolled, long labels/counts, unavailable, light/photo/poster/saturated underlays, safe area and end-of-content
penpot_page_id: 8e7accff-5c78-8007-8008-89c00a062ffc
penpot_board_id: 8e7accff-5c78-8007-8008-89c0907d9643; 8e7accff-5c78-8007-8008-89c09120e978
git_paths: catalog/unified-design-wave1/v1/patterns/floating-action-island.candidate-v1.json; catalog/unified-design-wave1/v1/penpot-materialization-plan.v1.json; evidence/unified-design-wave1/v1/penpot-readback.v1.json; evidence/unified-design-wave1/v1/review-manifest.v1.json; evidence/unified-design-wave1/v1/comparisons/*floating*
problem: isolated islands prove linked action reuse but not anchoring, occlusion, reachability, underlay contrast or sold-out/archived behavior
 evidence: final desktop/mobile verdict NEEDS_PAGE_CONTEXT
lowest_owning_fix: embed the same native candidate in bounded Event Detail page contexts, add sticky/scrolled and availability variants, preserve linked Calendar/Share/Like actions, and keep listing/search explicitly not applicable
 affected_consumers: archetype.event-detail only
revalidation: no content occlusion, mobile safe area, last-content reachability, focus/keyboard order, long labels/counts, unavailable states, underlay contrast, linked dependencies, no universal floating-pill expansion
```

## Codex correction prompt

```text
@GitHub @Penpot

Read the final audit report from branch `audit/independent-as-is-wave1-20260825`:
`docs/audits/independent-as-is-baseline-wave1-audit-20260825.md`.

Create a child correction branch from that audit branch HEAD. Do not change, merge or rewrite PR #52, its pinned head `b86bab3e91511b3d4bd7d953b22bceb847f02a51`, production Astro, canonical foundations or unrelated Penpot pages.

Implement only BF-01…BF-07 from the report. Resolve state gaps from exact source/browser evidence; when evidence does not exist, keep an explicit runtime_only/unresolved disposition instead of inventing UI. In Penpot mutate only the exact pages/boards named in the fixes, one bounded page call at a time, after checking file/page/board IDs. Reuse native linked components; create no detached duplicate families.

For Wave 1 add only the missing real-page/state context: desktop Search navigation, responsive selectors in Date Listing, and the floating action island inside Event Detail. Keep mobile Search navigation unchanged, preserve the mobile date rail, keep listing/search not_applicable for the action island, and keep production Astro diff at 0.

After each fix group update contracts/readback/evidence, commit and push a small checkpoint. Re-run exact case identity, linked ancestry, Penpot validation, affected exports/comparisons and production-generation-diff checks. Open a Draft correction PR; no merge or deploy. Return the seven fix verdicts and exact commit SHAs.
```

## Audit progress

- [x] Checkpoint materialized and pushed from the pinned audited head
- [x] Delivery and live identity verified
- [x] 34/34 owner-board identity and structure retained
- [x] Three live staleness deltas semantically classified
- [x] Final 34-case baseline visual verdicts assigned
- [x] Final 17-archetype state-coverage matrix assigned
- [x] Final six-case Unified Design Wave 1 verdicts assigned
- [x] Terminal verdict, bounded fixes and correction prompt published

## Checkpoint history

| commit | completed scope | remaining work |
| --- | --- | --- |
| `3e1c6632b1fa6bbe05d3fab7b24c1e801314106d` — `docs(audit): materialize independent audit checkpoint` | authoritative checkpoint preserved on remote audit branch; immutable scope and prior evidence retained | staleness, visual, state, Wave 1 and terminal verdict |
| `0ff316b6c09d74d5eee27809ffa9ad5c71967c54` — `docs(audit): classify baseline visual and staleness findings` | three live deltas classified; 34-case visual matrix completed; committed baseline found current | state coverage, Wave 1 and terminal verdict |
| `177f85cf2c4f42697e366c62fe858199ba85a519` — `docs(audit): complete state and Wave 1 coverage` | 17-archetype state matrix and six-case Wave 1 matrix completed | terminal verdict, bounded fixes and correction prompt |
| `(this commit)` — `docs(audit): finalize independent audit verdict` | terminal verdict, findings, seven bounded fixes and correction prompt published | execute bounded correction prompt, then re-audit only affected cases |
