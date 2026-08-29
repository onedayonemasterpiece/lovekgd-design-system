# IdeaHub owner voice intake — 2026-08-28 continuation 02

Status: `HISTORY_AUDITED / TRIAGED / IN_PROGRESS`

- review ID: `REV-IDEAHUB-20260828-02`
- source repository: `onedayonemasterpiece/idea-hub` (read-only)
- prior cursor: `76c337ee1bf5a0d90b93222cf9db662e6d4167e6`
- evaluated source HEAD: `669cd14d692e6fd9eee061aee7b63d15bbf0a6e8`
- boundary: every commit after the prior cursor touching `inbox/voice/2026/08`
- commits/packets evaluated: `7` / `7`
- relevant LoveKGD/KenigEvents audits: `2`
- excluded other-project or technical packets: `5`
- new `OV-*` IDs: `0`
- mapped existing items: `OV-02`, `OV-08`, `OV-30`, `OV-41`, `OV-42`
- processed: `NO`

This continuation was fetched while the previous audit fixes were still in
progress. It does not supersede or cancel them. The two relevant packets are
now part of the active Astro ↔ UI SoT ↔ Penpot work.

## Relevant packet 1 — multi-event rows and ecological crop

- packet: `voice-20260828-184659-08d36dc1`
- commit: `fe184e1657a17141fa3592613ffac30beb28324d`
- captured: `2026-08-28 18:46:59–18:50:42 Europe/Kaliningrad`
- source title: `Review дизайн-системы KenigEvents: унификация компонентов событий`

Normalized requirements:

1. Cards on a multi-event surface must retain one canonical family root; a
   visually similar page-local card root is not acceptable (`OV-08`, `OV-30`).
2. The design system must show container-level compositions, not only isolated
   cards: equal-height related-event rows and full-width festival/date/weekend
   rows with two, three or more cards (`OV-41`, `OV-42`).
3. Width allocation must be deterministic and may be equal or unequal based on
   source media ratios and bounded copy pressure, while the completed row fills
   the available container width (`OV-42`).
4. “Ecological crop” is a measurable objective: minimize the percentage of
   discarded source image area subject to semantic media protections. It does
   not authorize blind cover crop of OCR/document media (`OV-02`, `OV-42`).
5. Astro already contains two source oracles that must be reconciled into the
   central UI SoT and projected into Penpot rather than re-invented:
   `packRelatedCardRows` in `site/src/lib/relatedCardLayout.mjs` and
   `packFestivalTimeline` in `site/src/lib/festivalTimelineLayout.ts`.

Current implementation: `ASTRO_PROJECTED / PENPOT_MATERIALIZED /
VISUAL_EXPORT_BLOCKED`. Astro commit `c33652ed0` adds the source-bound lab route
and makes every two-event festival row full-width. Penpot revision `2643` adds
page `40.7` with `12` linked and `0` detached instances across the required
3/2/3/4-card rows. The external Penpot exporter returns HTTP `504`; exact
receipts are linked from
[`event-card-container-packed-rows.md`](../product-patterns/event-card-container-packed-rows.md).

## Relevant packet 2 — centralized round trip

- packet: `voice-20260828-185334-57cb865a`
- commit: `669cd14d692e6fd9eee061aee7b63d15bbf0a6e8`
- captured: `2026-08-28 18:53:34–18:54:44 Europe/Kaliningrad`
- source title: `Централизация дизайн-системы для Astro и Penpot`

Authority clarification:

- the semantic UI SoT is the general contract layer;
- Penpot is the visual projection of that contract;
- Astro is the generated/runtime projection of the same contract;
- a local-only Astro or Penpot change is incomplete even when it looks correct;
- the new multi-event-row work must therefore ship with a machine-readable SoT,
  an Astro fixture/runtime receipt and a native Penpot specimen/readback.

This is a process/authority clarification for the existing items, not a new
visual requirement ID.

## Excluded packets

| Packet | Commit | Disposition |
|---|---|---|
| `voice-20260828-154245-f07f28e2` | `fed582853` | Wonderful Lections / Russian Knowledge Society Penpot architecture; outside KenigEvents/LoveKGD |
| `voice-20260828-163102-f5645802` | `fb142c92f` | excluded synthetic record-idea-hub live acceptance fixture |
| `voice-20260828-163612-28516afe` | `ed070f0fa` | voice-intake regression verification |
| `voice-20260828-164228-1234ba3d` | `9ff1e09fa` | autonomous-systems lecture research / Kaggle master |
| `voice-20260828-184205-52767dfb` | `a844e7990` | Wonderful Lections presentation-generation service |

## Active closure route

1. source-lock the two existing Astro packing algorithms and crop formula in a
   machine-readable UI SoT contract;
2. add an Astro design-system fixture that consumes the production packers;
3. materialize a native Penpot page with source-bound 2/3/4-card rows, crop-loss
   annotations and canonical-root lineage;
4. perform exact readback, focused exports and cross-repo round-trip checks;
5. keep `processed: NO` until owner re-review.
