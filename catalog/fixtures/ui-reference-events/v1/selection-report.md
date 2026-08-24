# Golden Event Corpus v1 — selection report

Status: **immutable candidate corpus**. This report does not promote EventCard.

## Provenance and frozen clock

- Production SQLite was copied with SQLite backup semantics and opened by the
  existing `export-production-preview-data.py` in read-only mode.
- Production exporter SHA: `17d3d03db763c3a537f653dce6cb806b7bf05d4a`.
- Snapshot SHA-256: `5ff3be3ce417145f97b4b5c5a2d315fd820acf0ba5d222ea282523d04500adf1`.
- Exact full public export: 712 `PreviewEvent` rows; local source artifact
  SHA-256 `ed44beabb7e90278f5e6018cc2a8cc9c5ddfa2ea24c0de1bca92ef39282a8b65`.
- Frozen clock: `2026-08-21`, `2026-08-21T09:00:00+02:00`,
  `Europe/Kaliningrad`.
- The canonical corpus contains full public `PreviewEvent` payloads, not raw
  database rows. Normal tests never contact the live database.

## Selected real events

| Fixture | Real event | Coverage |
|---|---|---|
| `event.real.8156` | «Выставка „Мой город“» | reference day; long-running; portrait poster; OCR/protected; admission unavailable |
| `event.real.7906` | «Концерт „Откровения Вены“» | next day; nearest weekend; crop-safe landscape; 3 images; price |
| `event.real.6399` | «Ева & Лилит: поэтический концерт Марии Меженной» | +61 days; portrait/OCR; 2 images; price |
| `event.real.4327` | «Отдыха не знали, Из руин подняли» | long-running exhibition; OCR document; 3 images; long place; free |
| `event.real.7888` | «Открытие выставки „Море внутри“» | next day/weekend; long-running; no image; admission unavailable |
| `event.real.7807` | «Праздничная программа ко Дню Государственного флага Российской Федерации» | next day/weekend; crop-safe landscape; long title; free |
| `event.real.3132` | «Крыли — Сольный концерт» | +57 days; portrait/OCR; long place; price |
| `event.real.6628` | «ТОГДА» | long-running exhibition; portrait/OCR; 5 images; admission unavailable |

All twelve requested classes are covered. One fixture may intentionally cover
several classes. Selection is explicit and ordered; no “first matching event”
or fabricated event is used.

## EventCard Large pilot mapping

1. landscape crop-safe: `event.real.7906`;
2. portrait poster: `event.real.8156`;
3. OCR/protected document: `event.real.4327`;
4. no-image fallback: `event.real.7888`.

The gallery cardinality is fixture coverage, not a new EventCard variant axis.
Desktop and mobile cases must reuse these exact payload hashes.
