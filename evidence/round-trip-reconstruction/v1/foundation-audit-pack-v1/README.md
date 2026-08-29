# Foundation Audit Pack v1

Status: **AUDIT_INPUT_READY_NOT_A_FOUNDATION_DECISION**.

This pack is the exact common input for two independent color passes, two independent typography passes, synthesis and owner decisions. It does **not** merge or change foundations.

## Authority

- Design-system/SoT: `9b8043f3bdb86fab4eee00bf94b0f10d4f029c50`
- Astro: `7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00`
- Penpot: `3be9e5e1-190f-8090-8008-713c0fbe6260`, revision `2463`, validation `[]`
- UI coverage: 17/17 archetypes, 34/34 direct boards

## Census

- Astro browser-computed color records: 306
- Penpot observed color records: 295; library colors: 37
- Astro browser-computed typography records: 268
- Penpot observed typography records: 294; library typographies: 21
- Contrast observations: 1159 total; 722 AA pass; 7 AA finding; 430 complex-underlay unresolved

## Review examples

- `archetype.listing.date.desktop.current-v1`: [Penpot](https://design.penpot.app/#/workspace?team-id=81f57451-85cc-819d-8008-70ebaeab3fd6&file-id=3be9e5e1-190f-8090-8008-713c0fbe6260&page-id=d87e18f1-dcb4-80a6-8008-8807f67e8a2e&board-id=d87e18f1-dcb4-80a6-8008-8807f6b14cd1) · Astro `/lab/date-listing-shell-v1/full-page-desktop-shell/` · `evidence/round-trip-reconstruction/v1/comparisons/archetype.listing.date.desktop.current-v1.comparison.png`
- `archetype.listing.date.mobile.current-v1`: [Penpot](https://design.penpot.app/#/workspace?team-id=81f57451-85cc-819d-8008-70ebaeab3fd6&file-id=3be9e5e1-190f-8090-8008-713c0fbe6260&page-id=d87e18f1-dcb4-80a6-8008-8807f67e8a2e&board-id=d87e18f1-dcb4-80a6-8008-8807f91d5293) · Astro `/lab/date-listing-shell-v1/full-page-mobile-shell/` · `evidence/round-trip-reconstruction/v1/comparisons/archetype.listing.date.mobile.current-v1.comparison.png`
- `archetype.event-detail.desktop.current-v1`: [Penpot](https://design.penpot.app/#/workspace?team-id=81f57451-85cc-819d-8008-70ebaeab3fd6&file-id=3be9e5e1-190f-8090-8008-713c0fbe6260&page-id=d87e18f1-dcb4-80a6-8008-880bfdfbf2ec&board-id=d87e18f1-dcb4-80a6-8008-880bfe361a1d) · Astro `/sobytiya/predmetnye-strasti-natyurmort-xx-veka-kaliningrad-5459/` · `evidence/round-trip-reconstruction/v1/comparisons/archetype.event-detail.desktop.current-v1.comparison.png`
- `archetype.event-detail.mobile.current-v1`: [Penpot](https://design.penpot.app/#/workspace?team-id=81f57451-85cc-819d-8008-70ebaeab3fd6&file-id=3be9e5e1-190f-8090-8008-713c0fbe6260&page-id=d87e18f1-dcb4-80a6-8008-880bfdfbf2ec&board-id=d87e18f1-dcb4-80a6-8008-880c01b4fbef) · Astro `/sobytiya/predmetnye-strasti-natyurmort-xx-veka-kaliningrad-5459/` · `evidence/round-trip-reconstruction/v1/comparisons/archetype.event-detail.mobile.current-v1.comparison.png`
- `archetype.search.desktop.current-v1`: [Penpot](https://design.penpot.app/#/workspace?team-id=81f57451-85cc-819d-8008-70ebaeab3fd6&file-id=3be9e5e1-190f-8090-8008-713c0fbe6260&page-id=d87e18f1-dcb4-80a6-8008-880ac732b6ae&board-id=d87e18f1-dcb4-80a6-8008-880ac7b07e0b) · Astro `/poisk/` · `evidence/round-trip-reconstruction/v1/comparisons/archetype.search.desktop.current-v1.comparison.png`
- `archetype.search.mobile.current-v1`: [Penpot](https://design.penpot.app/#/workspace?team-id=81f57451-85cc-819d-8008-70ebaeab3fd6&file-id=3be9e5e1-190f-8090-8008-713c0fbe6260&page-id=d87e18f1-dcb4-80a6-8008-880ac732b6ae&board-id=d87e18f1-dcb4-80a6-8008-880acb90d104) · Astro `/poisk/` · `evidence/round-trip-reconstruction/v1/comparisons/archetype.search.mobile.current-v1.comparison.png`

## Boundary

All current→candidate rows are `UNRESOLVED`. No token merge, canonical Penpot foundation mutation or production Astro mutation is permitted before independent audits, synthesis and an owner decision.
