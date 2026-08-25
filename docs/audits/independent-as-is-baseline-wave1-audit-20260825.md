# Independent AS-IS Baseline and Unified Design Wave 1 Audit — 2026-08-25

- **Status:** `IN_PROGRESS`
- **Terminal verdict:** not issued
- **Audit mutation boundary:** this report only; Penpot remained read-only; no promotion, merge, deploy, production Astro mutation, token/foundation decision, validator change, or correction PR.

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

PR #52 was re-read before the audit branch was created. It remained open and Draft, with the requested head and base. The audit branch was created directly from the pinned head; neither the PR branch nor the audited commit was changed.

## Delivery and reproducibility checkpoint

- Exact-head checks completed successfully.
- Production Astro generation diff is `0`.
- Wave 1 boundaries remain `new_foundation_tokens=0`, `canonical_foundation_mutations=0`, and `production_astro_changes=0`.
- Live Penpot is revision `2479`; `validate()=[]`.
- Committed baseline revision `2463` contains 17 archetypes, 34 desktop/mobile cases, 709 components and 0 validation errors.
- Browser receipt reports 34/34 cases passed.
- Idempotent replay reports creates `0`, components `709→709`, validation `[]`.
- Wave 1 readback reports 3 pages, 6 review cases, 717 components and status `REVIEWABLE_NOT_ACCEPTED`.

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

## State-coverage checkpoint

Corrected contracts declare **180 states**, of which **172 are materialization-eligible**, with **8 explicit gaps**. Thirty-four default owner boards do not by themselves establish complete state coverage. Final per-archetype ownership and runtime-only classification is the next checkpoint.

Explicit gaps retained for final classification:

1. Event Detail — `layout.editorial-wide`;
2. Event Detail — `layout.split-poster`;
3. Event Detail — `mobile-media.no-image`;
4. Event Detail — `transport.multiple`;
5. Event Detail — `transport.stale`;
6. Favorites — `favorites.populated`;
7. Favorites — `favorites.action-refresh`;
8. Personal Feed — `personal-feed.storage-failure`.

## Unified Design Wave 1 checkpoint

Live revision 2479 confirms native candidate identities and reuse of existing semantic components. No candidate-specific foundation fork was found. Final page-context and required-state verdicts remain to be checkpointed.

| case | context | architecture | responsive/state completeness | preliminary verdict |
| --- | --- | --- | --- | --- |
| 01.search-nav.desktop | isolated 1280×120 header region | existing header plus native linked search-entry candidate | narrow desktop, auth/account and body context absent | NEEDS_PAGE_CONTEXT |
| 02.search-nav.mobile | existing bottom navigation region | linked current Search destination; no second navigation family | preservation question sufficiently represented | READY_FOR_OWNER_REVIEW |
| 03.selectors.desktop | isolated 1180×88 selector surface | native candidate reuses existing filter controls | open/selected/long-label/error/zero-results and real Date Listing placement absent | NEEDS_REQUIRED_STATES |
| 04.selectors.mobile | isolated 390×112 trigger surface | two linked triggers; existing date rail intentionally retained | actual sheet/dialog, focus/Escape, error, long-label and zero-result evidence absent | NEEDS_REQUIRED_STATES |
| 05.floating.desktop | isolated 404×220 island | native candidate reuses linked Calendar/Share/Like semantics | full Event Detail placement, sticky/scrolled/underlay/unavailable states absent | NEEDS_PAGE_CONTEXT |
| 06.floating.mobile | isolated 366×196 island | native responsive branch reuses shared semantic actions | safe area, occlusion, last-content reachability, underlays and unavailable states absent | NEEDS_PAGE_CONTEXT |

## Validator independence

Independent checks include hashes, exact file/case sets, file existence, screenshot hashes, geometry equality, board IDs and URLs, linked ancestry, generation diff and replay invariants. These establish identity, integrity and reproducibility.

The semantic status labels, builder receipts and their validators still share one evidence-production pipeline. No independent oracle checks whether a comparison that exists is visually or product-semantically correct. Therefore validator success is supporting evidence, not the final UI/state verdict; the baseline matrix above is based on the independent case-level semantic audit.

## Audit progress

- [x] Checkpoint materialized and pushed from the pinned audited head
- [x] Delivery and live identity verified
- [x] 34/34 owner-board identity and structure retained
- [x] Three live staleness deltas semantically classified
- [x] Final 34-case baseline visual verdicts assigned
- [ ] Final 17-archetype state-coverage matrix
- [ ] Final six-case Unified Design Wave 1 verdicts
- [ ] Terminal verdict, bounded fixes and correction prompt

## Checkpoint history

| commit | completed scope | remaining work |
| --- | --- | --- |
| `3e1c6632b1fa6bbe05d3fab7b24c1e801314106d` — `docs(audit): materialize independent audit checkpoint` | authoritative checkpoint preserved on remote audit branch; immutable scope and prior evidence retained | staleness, visual, state, Wave 1 and terminal verdict |
| `(this commit)` — `docs(audit): classify baseline visual and staleness findings` | three live deltas classified; 34-case visual matrix completed; committed baseline found current | state coverage, Wave 1 and terminal verdict |
