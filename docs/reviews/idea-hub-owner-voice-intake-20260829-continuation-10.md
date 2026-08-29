# IdeaHub owner voice intake — 2026-08-29 continuation 10

## Cursor

- previous audited IdeaHub cursor: `eca10ad747d742ccdff1fc9ebacf1f7ba6a46d02`
- fetched IdeaHub HEAD: `eaac25fda5e31d58e3207ea1a06dd4e79e896560`
- new voice commits: `5`
- relevant to LoveKGD Design System: `1`
- excluded as other-project scope: `4`

## Relevant packet

### OV-57 — bounded shared reference fixture pools

- packet: `voice-20260829-072140-eed2c8df`
- commit: `e655631`
- project: LoveKGD Design System
- status: `IN_PROGRESS`
- processed: `NO`

Owner correction: Penpot must not reproduce a full production listing merely to
look like the Astro page. Design-system pages use a small, fixed, versioned data
pool shared with an Astro fixture profile. The pool must be sufficient to prove
different layout, crop, framing and ratio mechanics. Dense/full-content,
scrolling and performance validation remains in generated Astro.

Bounded SoT: `catalog/reconstruction-atlas/v1/design-system-reference-fixtures-ov57.v1.json`.
The immediate violating owner is Festivals, currently projected with all 21
production festivals. Its target representative profile is three rows with
`1 / 4 / 2` factual festivals. Clubs already use the exact bounded three-item
catalogue. Existing golden event fixtures remain the shared event pool.

Later owner visual review exposed a second, independent typification defect in
that bounded Festival projection: six cards per viewport were still native
boards assembled next to the owner. The correction is now materialized at
Penpot revision `2917`: all seven cards in each desktop/mobile owner are linked
instances under `Event cards / Festival / Context`, with zero owner-local
Festival card boards. Astro commit `67197ef3e` likewise delegates the repeated
timeline markup to `site/src/components/festivals/FestivalCard.astro`. The
executable contract and receipt are
`catalog/reconstruction-atlas/v1/festival-card-centralization-20260829.v1.json`
and
`evidence/recovery-20260829/penpot/festival-card-centralization-receipt.v1.json`.
The one bounded Penpot export attempt returned HTTP 504, so visual acceptance is
not claimed.

## Excluded packets

| Packet | Commit | Reason |
|---|---|---|
| `voice-20260829-065203-f42cafa5` | `4425a0c` | MCP educational presentation / IdeaHub |
| `voice-20260829-070008-e6507aa7` | `1ce8fd4` | MCP mobile client architecture |
| `voice-20260829-071822-5fe7d875` | `267b96a` | record-idea-hub ↔ MCP integration |
| `voice-20260829-072922-363d659f` | `eaac25f` | MCP client clarification UI |
