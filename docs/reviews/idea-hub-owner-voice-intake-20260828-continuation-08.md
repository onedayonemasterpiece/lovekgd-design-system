# IdeaHub owner voice intake — 2026-08-28/29 continuation 08

Status: `HISTORY_AUDITED / TRIAGED / IN_PROGRESS`

- review ID: `REV-IDEAHUB-20260828-08`
- source repository: `onedayonemasterpiece/idea-hub` (read-only)
- prior voice cursor: `0d61090fda75db5c737e1c522ffd7d731246d3ba`
- evaluated source HEAD: `e0760b9927eecf794cb3fcbae02048497eeecb9c`
- boundary: every commit after the prior cursor touching `inbox/voice/2026/08`
- commits/packets evaluated: `5` / `5`
- relevant LoveKGD/KenigEvents design-system audits: `2`
- excluded packets: `3`
- new item IDs: `OV-55`, `OV-56`
- processed: `NO`

The packets were discovered, fetched and announced during the active Astro ↔
UI SoT ↔ Penpot recovery. Triage uses each full transcript, not only generated
summaries. The two relevant packets correct Event Detail terminology and add
missing source states/continuation requirements. They do not authorize the
future Floating Island redesign before the factual AS-IS is finished.

## Relevant packets

| Item | Packet | Commit | Owner requirement | Initial disposition |
|---|---|---|---|---|
| `OV-55` | `voice-20260829-000214-17b772ab` | `bcd2f03` | Add a real Event Detail vertical-image state; preserve/document the Astro hero-image parallax contract and keyboard navigation; keep universal Floating Island as a later candidate after AS-IS | `IN_PROGRESS`: locate real Astro fixture and exact motion/keyboard source before Penpot mutation; no invented Floating Island |
| `OV-56` | `voice-20260829-000723-952a7c41` | `76bdb6d` | Correct terminology to **Hero image** (not Hero Talk) on event pages; include transport and `related events → footer`; prove EventCard and medallion inheritance and split boards if needed for operability | `IN_PROGRESS`: audit Page 63.07 continuation and exact linked ancestry; correct lowest owning SoT |

## Excluded packets

| Packet | Commit | Owning topic | Disposition |
|---|---|---|---|
| `voice-20260828-232135-cec59ead` | `a76e47c` | Fragmentary IdeaHub recorder session | `CONTEXT_ONLY / EXCLUDED_OTHER_PROJECT` |
| `voice-20260828-234448-73cfc280` | `c2c1238` | Manual-vs-automatic IdeaHub intake test | `CONTEXT_ONLY / EXCLUDED_OTHER_PROJECT` |
| `voice-20260828-235646-b7119487` | `7a8b118` | Wonderful Lections evidence/quiz framework | `CONTEXT_ONLY / EXCLUDED_OTHER_PROJECT` |

## Owner corrections preserved verbatim in meaning

- Event Detail uses **Hero image / Hero picture / main image**. `Hero Talk` is
  the separate mosaic text+image system primarily used on Home.
- Parallax is already an Astro behavior and must not disappear from the semantic
  SoT merely because a static Penpot frame cannot execute it.
- Floating Island is a universal future wave. Current recovery completes AS-IS
  first and must not silently shift hero geometry to the future candidate.
- Related cards and medallions must remain linked to their one owning component
  families. A visually similar detached copy is a defect.

## Cursor

- latest fetched repository HEAD evaluated:
  `e0760b9927eecf794cb3fcbae02048497eeecb9c`;
- latest relevant directory commit evaluated: `76bdb6d`;
- latest packet by capture time evaluated:
  `voice-20260829-000723-952a7c41`;
- future intake must compare Git history so backfilled packets are not skipped.

`processed: NO` remains mandatory until each relevant requirement has source
evidence, native Penpot materialization where applicable, round-trip validation
and direct owner rereview.
