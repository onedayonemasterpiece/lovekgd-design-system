# Golden Event Corpus v2 — selection and projection policy

Status: **immutable September 2026 diagnostic corpus**. This corpus does not by
itself promote or redesign EventCard.

## Why v2 exists

Golden Event Corpus v1 remains byte-locked historical certification evidence.
It must not be edited merely because calendar time or route data changed. v2 is
an adjacent, fresh corpus for current Astro ↔ UI SoT ↔ Penpot page work.

The earlier attempt to use five July/August records already present on the free
collection was rejected. Recency alone is also insufficient: five homogeneous
OCR posters cannot exercise the branches that a visual conformance corpus is
supposed to diagnose.

## Provenance

- production `PreviewEvent` exporter repository SHA:
  `8710e56fa3685f6c30a90cd062d532dce0348cce`;
- exact bounded export SHA-256:
  `7e4ea8f4a6c6273e17d5531ca009b4dfaf184a2328f45832e41b308bfe170032`;
- exporter catalog revision:
  `6668f5a6f22f6c9a4e1f28af242e77bedb81eab1d06a37ba1227c8898133f409`;
- frozen clock: `2026-08-29T14:00:00+02:00`, Europe/Kaliningrad;
- normal tests consume the frozen full public `PreviewEvent` wrappers and never
  contact production.

The v2 schema calls this value a `preview-export-catalog-revision`, not a
database snapshot hash. A full SQLite backup was not used, so the stronger v1
field name would have overstated the evidence.

## Eight-event diagnostic corpus

| Fixture | September role | Diagnostic coverage |
|---|---|---|
| `event.real.2182` | active all September, free | crop-safe visual-only landscape; single image |
| `event.real.6711` | active through 2 Oct, free | crop-safe 4:3 visual-only gallery |
| `event.real.7609` | active through 5 Sep, free | square OCR poster; multi-image |
| `event.real.8006` | 2 Sep, free | 3:4 portrait OCR poster; single image |
| `event.real.8200` | 6 Sep, free | 6:7 programme/document; single image |
| `event.real.7907` | active through 13 Oct, free supplement | landscape OCR document plus visual gallery; long title |
| `event.real.6942` | 17 Sep | 4:5 OCR poster; exact bundled legacy CDN bytes |
| `event.real.7020` | 26–27 Sep | portrait OCR poster plus mixed-aspect gallery |

The set jointly covers landscape, square, 4:5 and portrait media; OCR and
visual-only modes; crop-safe and preserve modes; single and multi-image cards;
free and paid admission; long-copy pressure and mixed media.

## Free-collection projection

`projections/free-collection-september.v1.json` selects the five factual-free
fixtures `2182, 6711, 7609, 8006, 8200` from this same corpus. They are all
active during September and have normalized media. The actual Astro surface
groups them as two dated events and three continuing exhibitions. Both groups
form a full-width row (2 cards and 3 cards respectively); evidence must
preserve that real grouping instead of pretending there is one five-card row.

The repeated green Chernyakhovsk programme artwork is explicitly excluded. It
was shared by several unrelated event rows and therefore made different cards
look like duplicates. Such a set is a poor visual diagnostic even when every
row is factually current.

## Durable selection rule

1. Factual predicates (free/active/public) are non-negotiable route gates.
2. Among eligible events, maximize distinct component states and media aspect
   ratios; do not select the first five rows or five visually homogeneous rows.
3. Route projections are subsets of the Golden corpus, not new page-local event
   databases.
4. Missing-media is a deliberate diagnostic state only when required; it must
   not crowd out current, verified images.
5. Astro and Penpot use the exact same fixture IDs, full payload hashes and
   media bytes. Geometry/readback without native-scale visual inspection is not
   acceptance.
