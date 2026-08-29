# IdeaHub owner voice intake — 2026-08-28/29 continuation 08

Status: `HISTORY_AUDITED / TRIAGED / CORRECTION_MATERIALIZED / OWNER_REREVIEW_REQUIRED`

- review ID: `REV-IDEAHUB-20260828-08`
- source repository: `onedayonemasterpiece/idea-hub` (read-only)
- prior voice cursor: `0d61090fda75db5c737e1c522ffd7d731246d3ba`
- evaluated source HEAD: `f251c257e9124451d0b338e451d591455aa89a00`
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
| `OV-55` | `voice-20260829-000214-17b772ab` | `bcd2f03` | Add a real Event Detail vertical-image state; preserve/document the Astro hero-image parallax contract and keyboard navigation; keep universal Floating Island as a later candidate after AS-IS | `CORRECTION_MATERIALIZED`: real `event.real.4783` Hero image/rail and two-up efficient viewer were reconstructed natively; exact desktop/mobile motion and keyboard rules are recorded in `event-detail-motion-keyboard-source-contract-v1.md`; Floating Island remains deferred |
| `OV-56` | `voice-20260829-000723-952a7c41` | `76bdb6d` | Correct terminology to **Hero image** (not Hero Talk) on event pages; include transport and `related events → footer`; prove EventCard and medallion inheritance and split boards if needed for operability | `CORRECTION_MATERIALIZED`: real `event.real.4671` Kaup transport and `transport → related → footer` continuation are native/linked on Page 63.07; owner rereview remains required |

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
  `f251c257e9124451d0b338e451d591455aa89a00`;
- latest relevant directory commit evaluated: `76bdb6d`;
- latest packet by capture time evaluated:
  `voice-20260829-000723-952a7c41`;
- the five commits after `e0760b9` through `f251c25` are a microelectronics
  dataset batch; none touches `inbox/voice/2026/08` and none is relevant to the
  LoveKGD/KenigEvents design-system recovery;
- future intake must compare Git history so backfilled packets are not skipped.

`processed: NO` remains mandatory until each relevant requirement has source
evidence, native Penpot materialization where applicable, round-trip validation
and direct owner rereview.
