# Реестр owner review

Status: `ACCEPTED_OPERATIONAL_ROUTER`

Current revision: `REV-IDEAHUB-20260829-14`.

Этот файл — обязательная короткая точка входа для всех отзывов владельца о
дизайн-системе: Penpot comments, IdeaHub/Telegram voice, text review и
последующих browser/device review.

## Сохранение предыдущего реестра

Полный реестр и подробный per-item ledger через
`REV-IDEAHUB-20260829-13` / `OV-57` сохранён **без изменения байтов** в
[`index-through-20260829-13.md`](index-through-20260829-13.md).

Это не удаление истории и не смена evidence authority. Новый `index.md` является
коротким current router; точные старые формулировки, UUID, revisions, receipts и
supersession history остаются в архивном снимке и связанных source-bound
файлах. Более новый exact-source contract/receipt может уточнять статус, но не
переписывает историческое evidence задним числом.

## Обязательное правило регистрации

Каждая отдельная review-сессия получает:

1. устойчивый `review_id`;
2. отдельный intake record с точной source boundary и dedup;
3. строку в этом реестре;
4. owner-item routing и processing/evidence owner;
5. точные Git SoT, Penpot UUID/revision/export/readback и owner disposition;
6. append-only supersession вместо молчаливого удаления.

Если review отсутствует здесь и в сохранённом through-13 register, он считается
`UNREGISTERED`.

Стандарт: [`review-record-template.md`](review-record-template.md).

## Зарегистрированные сессии

| Review ID | Intake / durable register | Current status | Processed |
|---|---|---|---|
| `REV-PENPOT-20260826-01` | [`penpot-owner-comments-resolution-20260826.md`](penpot-owner-comments-resolution-20260826.md); exact prior row in [`index-through-20260829-13.md`](index-through-20260829-13.md) | `IN_PROGRESS` | `NO` |
| `REV-TG-20260826-01` | [`telegram-owner-voice-intake-20260826-27.md`](telegram-owner-voice-intake-20260826-27.md), [`telegram-owner-voice-intake-20260827-continuation-01.md`](telegram-owner-voice-intake-20260827-continuation-01.md) | `IN_PROGRESS` | `NO` |
| `REV-IDEAHUB-20260828-01` | [`idea-hub-owner-voice-intake-20260828.md`](idea-hub-owner-voice-intake-20260828.md) | `HISTORY_AUDITED / TRIAGED` | `NO` |
| `REV-IDEAHUB-20260828-02` | [`idea-hub-owner-voice-intake-20260828-continuation-02.md`](idea-hub-owner-voice-intake-20260828-continuation-02.md) | `IN_PROGRESS` | `NO` |
| `REV-IDEAHUB-20260828-03` | [`idea-hub-owner-voice-intake-20260828-continuation-03.md`](idea-hub-owner-voice-intake-20260828-continuation-03.md) | `IN_PROGRESS` | `NO` |
| `REV-IDEAHUB-20260828-04` | [`idea-hub-owner-voice-intake-20260828-continuation-04.md`](idea-hub-owner-voice-intake-20260828-continuation-04.md) | `CONTEXT_ONLY` | `YES` |
| `REV-IDEAHUB-20260828-05` | [`idea-hub-owner-voice-intake-20260828-continuation-05.md`](idea-hub-owner-voice-intake-20260828-continuation-05.md) | `CONTEXT_ONLY` | `YES` |
| `REV-IDEAHUB-20260828-06` | [`idea-hub-owner-voice-intake-20260828-continuation-06.md`](idea-hub-owner-voice-intake-20260828-continuation-06.md) | `CONTEXT_ONLY` | `YES` |
| `REV-IDEAHUB-20260828-07` | [`idea-hub-owner-voice-intake-20260828-continuation-07.md`](idea-hub-owner-voice-intake-20260828-continuation-07.md) | `CONTEXT_ONLY` | `YES` |
| `REV-IDEAHUB-20260828-08` | [`idea-hub-owner-voice-intake-20260828-continuation-08.md`](idea-hub-owner-voice-intake-20260828-continuation-08.md) | `CORRECTION_MATERIALIZED / OWNER_REREVIEW_REQUIRED` | `NO` |
| `REV-IDEAHUB-20260829-09` | [`idea-hub-owner-voice-intake-20260829-continuation-09.md`](idea-hub-owner-voice-intake-20260829-continuation-09.md) | `CONTEXT_ONLY` | `YES` |
| `REV-IDEAHUB-20260829-10` | [`idea-hub-owner-voice-intake-20260829-continuation-10.md`](idea-hub-owner-voice-intake-20260829-continuation-10.md) | `ASTRO_AND_PENPOT_STRUCTURALLY_VERIFIED / VISUAL_EXPORT_BLOCKED` | `NO` |
| `REV-IDEAHUB-20260829-11` | [`idea-hub-owner-voice-intake-20260829-continuation-11.md`](idea-hub-owner-voice-intake-20260829-continuation-11.md) | `AUDITED / NO_NEW_RELEVANT_PACKET` | `NO` |
| `REV-IDEAHUB-20260829-12` | [`idea-hub-owner-voice-intake-20260829-continuation-12.md`](idea-hub-owner-voice-intake-20260829-continuation-12.md) | `AUDITED / NO_NEW_RELEVANT_PACKET` | `NO` |
| `REV-IDEAHUB-20260829-13` | [`idea-hub-owner-voice-intake-20260829-continuation-13.md`](idea-hub-owner-voice-intake-20260829-continuation-13.md) | `AUDITED / NO_NEW_RELEVANT_PACKET` | `NO` |
| `REV-IDEAHUB-20260829-14` | [`idea-hub-owner-voice-intake-20260829-continuation-14.md`](idea-hub-owner-voice-intake-20260829-continuation-14.md) | `READY_FOR_OWNER_REREVIEW` | `NO` |

The exact source boundary and evidence for every through-13 row remain in the
preserved register. Continuation 14 is a targeted registration of
`voice-20260829-201612-4feb9e87`, the latest owner voice about static-site /
design-system authority and parity.

## Current item routing

Detailed evidence through `OV-57` remains in
[`index-through-20260829-13.md`](index-through-20260829-13.md) and the linked
contracts/receipts. The table below is a non-lossy status router, not a
replacement for those receipts.

| Item(s) | Current status | Owning evidence / open gate |
|---|---|---|
| <a id="OV-01"></a>`OV-01` | `READY_FOR_OWNER_REREVIEW` | canonical Mobile Rail ancestry/readback complete; owner acceptance open |
| `OV-02` | `READY_FOR_OWNER_REREVIEW` | source-bound cover/contain decisions and media parity readback complete |
| `OV-03` | `CONTEXT_ONLY` | lack of owner clicks is not absence of required interaction states |
| `OV-04`, `OV-05` | `READY_FOR_OWNER_REREVIEW` | Branding page, lockups, spacing and classification materialized; owner acceptance open |
| `OV-06` | `READY_FOR_OWNER_REREVIEW` | exact-seven Artifacts owners and Astro/browser evidence complete |
| `OV-07` | `PENPOT_MATERIALIZED / VISUAL_QA_BLOCKED` | HeroTalk chain structural receipt exists; focused export blocked by HTTP 504 |
| `OV-08` | `STRUCTURAL_CORRECTION_ADVANCED / GLOBAL_NONCARD_CENSUS_PENDING` | event-card lineage has bounded proofs; global lineage and owner acceptance remain open |
| `OV-20…OV-24` | `STRUCTURAL_CORRECTION_VERIFIED / VISUAL_EXPORT_BLOCKED_OR_DEFERRED` | responsive action/navigation islands have exact contracts; visual evidence remains open after HTTP 504 |
| `OV-25…OV-27` | `READY_FOR_OWNER_REREVIEW` | Popular mobile Rail final readback complete |
| `OV-34…OV-46` | `READY_FOR_OWNER_REREVIEW` | Partners, Focus Group, Personal Feed, Favorites, Clubs, Festivals, Free Collection and Event Detail have bounded source-bound receipts |
| `OV-47`, `OV-48` | `READY_FOR_OWNER_REREVIEW / CONTEXT_RESOLVED` | Search visual/runtime states materialized; some lifecycle export evidence remains deferred |
| `OV-49` | `EXPLICIT_DECISION_REQUIRED` | `/neobychnoe/` has no approved nonempty editorial manifest or accepted last-good source |
| `OV-50`, `OV-51`, `OV-52` | `READY_FOR_OWNER_REREVIEW` | accepted HeroTalk, Weekend marker and Floating Island Rail bounded corrections |
| `OV-53` | `PENPOT_TAXONOMY_MATERIALIZED / VISUAL_EXPORT_BLOCKED` | icon candidate taxonomy/provenance exists; no arbitrary asset promotion |
| `OV-54` | `FOUNDATIONS_AND_OWNER_ROOT_MIGRATIONS / GLOBAL_MIGRATION_IN_PROGRESS` | current token/root census is source-bound; remaining global/visual gates stay open |
| `OV-57` | `ASTRO_AND_PENPOT_STRUCTURALLY_VERIFIED / VISUAL_EXPORT_BLOCKED` | exact bounded fixture pools and centralized FestivalCard lineage proven; final raster comparison blocked by one HTTP 504 |
| <a id="OV-58"></a>`OV-58` | `READY_FOR_OWNER_REREVIEW` | actual Astro ↔ Git UI SoT ↔ Penpot authority, named-pool parity and agent routing corrected across design-system, static-site and IdeaHub docs |

## `OV-58`: latest owner voice

Source: `REV-IDEAHUB-20260829-14` / `voice-20260829-201612-4feb9e87`.

Factual disposition:

- durable UI SoT is versioned Git contract/package data in this repository;
- pinned Astro/runtime remains executable AS-IS fact before family promotion;
- Penpot is native visual implementation/review, not an independent automatic
  release authority;
- no automatic bidirectional Penpot ↔ Astro sync exists;
- one bounded comparison uses one exact named scenario/pool, fixture IDs and
  hashes; the 8-event component corpus and 5-event archetype pool are distinct;
- component masters/state catalogs stay on bounded library pages; archetypes
  consume linked instances;
- visual similarity never proves component lineage;
- bounded centralization is real, while global acceptance/promotion is open.

Current router:
[`../static-site-design-system-current-state.md`](../static-site-design-system-current-state.md).

Static-site bridge:
`events-bot-new#596/docs/features/static-site-pages/design-system/README.md`.

## Status semantics

- `CAPTURED` / `TRIAGED` / `IN_PROGRESS` / `EVIDENCE_INCOMPLETE` / `BLOCKED`
  are nonterminal;
- `READY_FOR_OWNER_REREVIEW` means implementation/readback is ready but owner
  acceptance is absent;
- `processed: YES` is limited to `CONTEXT_ONLY`, `OWNER_ACCEPTED` or `CLOSED`;
- structural PASS, visual PASS, owner acceptance, promotion and deploy are
  separate gates.

## Mandatory processing route

```text
source review
→ separate intake record
→ registration in this index
→ dedup + owner-item routing
→ per-item Git SoT disposition
→ bounded Penpot/Astro materialization
→ exact structural readback + focused visual evidence
→ READY_FOR_OWNER_REREVIEW
→ explicit owner acceptance
→ CLOSED
```

## Fail-closed current gates

`READY_FOR_OWNER_REVIEW` for the whole contour remains forbidden while any of
these are open:

- global component-lineage census/acceptance outside already proven scopes;
- required focused visual exports blocked by Penpot HTTP 504;
- `/neobychnoe/` editorial authority;
- open token/family migration and per-family promotion;
- explicit owner acceptance;
- release approval and post-deploy conformance.

A green test, `validate()=[]`, one screenshot, one component-main readback or a
Draft PR never closes those gates by itself.
