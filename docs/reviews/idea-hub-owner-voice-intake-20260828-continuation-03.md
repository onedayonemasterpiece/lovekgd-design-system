# IdeaHub owner voice intake — 2026-08-28 continuation 03

Status: `HISTORY_AUDITED / TRIAGED / IN_PROGRESS`

- review ID: `REV-IDEAHUB-20260828-03`
- source repository: `onedayonemasterpiece/idea-hub` (read-only)
- prior cursor: `669cd14d692e6fd9eee061aee7b63d15bbf0a6e8`
- evaluated source HEAD: `6c5ce46fac1050dec956e19720271688f61ee82d`
- boundary: every commit after the prior cursor touching `inbox/voice/2026/08`
- commits/packets evaluated: `2` / `2`
- relevant LoveKGD/KenigEvents design-system audits: `2`
- excluded packets: `0`
- new item IDs: `OV-53`, `OV-54`
- processed: `NO`

These packets were found during the active Astro ↔ UI SoT ↔ Penpot recovery.
They extend the open work and do not supersede any earlier owner item.

## OV-53 — SVGRepo candidate icon acquisition and style classes

- packet: `voice-20260828-191736-05305086`
- commit: `39fb8057ac98f8e84efdc5f1bd7a3c6602ec16d9`
- captured: `2026-08-28 19:17:36–19:19:50 Europe/Kaliningrad`

Normalized requirements:

1. SVGRepo is an approved discovery source, not automatic production authority.
2. The existing SVGRepo finder skill is the acquisition mechanism.
3. Every acquired glyph enters the design system as a candidate with exact
   source URL, license/provenance, semantic role and immutable SVG hash.
4. Candidate collections are grouped by visual class, including at minimum
   thin outline, regular outline, bold/solid and illustrative/drawn.
5. A candidate can later be accepted, rejected or superseded; discovery alone
   must never replace an existing production icon.
6. Penpot Page `25 — Iconography` is the visual projection. The Git registry is
   the lifecycle/provenance authority.

Current disposition: `PENPOT_TAXONOMY_MATERIALIZED /
VISUAL_EXPORT_BLOCKED`.
The existing event-card registry already proves 24 production-bound icons and
zero unclassified items, but it does not yet implement the requested SVGRepo
candidate acquisition queue or style taxonomy. Penpot revision `2653` adds the
six style-class cards, exact provenance/lifecycle gate and an explicit
zero-candidate state; no arbitrary glyph was introduced without a semantic
need. Exact readback found `24` token-bound shapes and `validate()=[]`. The
bounded PNG export returned external exporter HTTP `504`.

## OV-54 — cross-cutting tokens and globally changeable foundations

- packet: `voice-20260828-192122-db18c7b4`
- commit: `6c5ce46fac1050dec956e19720271688f61ee82d`
- captured: `2026-08-28 19:21:22–19:22:37 Europe/Kaliningrad`

Normalized requirements:

1. Color, typography, spacing, sizing, radii and elevation must be represented
   as reusable Penpot tokens/foundations rather than copied local values.
2. Components and owner-readable specimens must bind those tokens so a
   foundation change propagates through linked consumers.
3. Astro CSS variables and Penpot tokens are projections of the same semantic
   Git SoT; neither side may invent a separate palette or spacing scale.
4. Page `20 — Foundations` must show the exact current values, ownership and
   coverage/gaps rather than remain an empty scaffold.
5. Migration is evidence-driven: token existence is not enough. Bound-shape
   census, component ancestry, validation and visual comparison are required.

Read-only audit at Penpot revision `2647` found one active set,
`listing-foundations-candidate-v1`, with `40` source-conformant color/spacing/
radius/sizing tokens, but `0` token-bound shapes across `112` pages and `25,504`
shapes. There were no typography tokens, themes or bound component consumers.
The packet therefore identifies a real implementation gap.

Current disposition: `PENPOT_FOUNDATIONS_PILOT /
COMPONENT_MIGRATION_PENDING / VISUAL_EXPORT_BLOCKED`.

Penpot revision `2651` now has `94` tokens, active theme
`Brand / KenigEvents current`, and a source-conformant Page `20` with `70`
token-bound shapes across color, typography, radii, shadow, sizing and spacing
specimens. Ten of eleven spacing-gap bindings read back; `space.4` preserves
the correct visual gap but the Plugin API did not persist its token link after
repeated exact calls. Global component migration is intentionally still open;
the whole-board and bounded-zone exports returned external exporter HTTP `504`.

The first real component-family migration then bound the canonical
Announcements wordmark/desktop/mobile lockup masters to four exact color and
typography properties. Revision `2656` read back all four token names and
unchanged source values with `validate()=[]`. This advances the task from a
specimen-only pilot to bounded component migration, but it does not claim
global coverage.

## Active route

1. source-lock the SVGRepo candidate lifecycle/style vocabulary and the
   cross-cutting foundations contract in Git;
2. extend the Penpot token catalog with exact Astro/UI SoT roles and a current
   theme without creating alternate local palettes;
3. materialize Page `20` as the token ownership/coverage board and Page `25`
   as the candidate icon intake board;
4. migrate bounded canonical component families to tokens with before/after
   readback and no detached copies;
5. keep `processed: NO` until owner rereview.
