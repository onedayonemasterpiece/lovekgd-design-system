# Реестр owner review

Status: `ACCEPTED_OPERATIONAL_ROUTER`

Этот файл — обязательная точка входа для всех отзывов владельца о дизайн-системе: комментариев Penpot, голосовых и текстовых сообщений Telegram, а также последующих browser/device review. Он маршрутизирует источник → отдельный intake-файл → processing ledger → Git SoT/Penpot evidence → owner re-review.

## 1. Обязательное правило регистрации

Каждое новое появление или отдельная сессия review получает:

1. устойчивый `review_id` формата `REV-<SOURCE>-<YYYYMMDD>-<NN>`;
2. отдельный файл в `docs/reviews/` с точной границей источника, временем, часовым поясом, marker/dedup key, исходными item/transcription refs и нормализованными требованиями;
3. строку в этом реестре в том же Git-коммите, в котором появляется intake-файл;
4. один владеющий processing ledger — отдельный или тот же файл — с состоянием каждого пункта;
5. точные Git SoT, Penpot UUID/revision/export/readback и owner-disposition evidence до закрытия;
6. append-only supersession history: исправления не удаляют предыдущую запись молча.

Если отдельный review-файл не зарегистрирован здесь, review считается `UNREGISTERED`, даже если его текст существует где-то в ветке, PR, Telegram или Penpot.

Стандарт новой записи: [`review-record-template.md`](review-record-template.md).

## 2. Состояния обработки

| Status | Смысл |
|---|---|
| `CAPTURED` | источник сохранён, но требование ещё не реализовано и не проверено |
| `TRIAGED` | определены actionability, target и владеющий ledger |
| `IN_PROGRESS` | выполняется Git SoT/Penpot reconciliation; закрытие не заявляется |
| `EVIDENCE_INCOMPLETE` | часть реализации существует, но обязательный scope/readback/lineage/visual proof неполон |
| `CONTEXT_ONLY` | запись важна для интерпретации review, но не требует продуктовой мутации |
| `BLOCKED` | пункт является открытым release/review blocker |
| `READY_FOR_OWNER_REREVIEW` | реализация и обязательный readback завершены; owner acceptance ещё отсутствует |
| `OWNER_ACCEPTED` | владелец явно принял ограниченный результат |
| `CLOSED` | acceptance и все обязательные evidence/receipts сохранены; маршрут терминален |

`processed: YES` разрешён только для `CONTEXT_ONLY`, `OWNER_ACCEPTED` или `CLOSED`. Частичная реализация, ответ в thread, один экспорт, визуальное сходство или сам факт записи в Git не являются обработанным review.

## 3. Реестр сессий

| Review ID | Source boundary | Intake record | Processing ledger | Working contour | Current status | Processed |
|---|---|---|---|---|---|---|
| `REV-PENPOT-20260826-01` | Resource Graph Penpot, текущие owner threads `#178–#202` и связанные исторические defects | [`penpot-owner-comments-resolution-20260826.md`](penpot-owner-comments-resolution-20260826.md) — legacy/current combined intake+ledger | тот же файл | branch `fix/penpot-owner-comments-20260826`, Draft PR `#53` | `IN_PROGRESS` | `NO` |
| `REV-TG-20260826-01` | Telegram `KenigEvents · UI review`, `https://t.me/c/4337049383/1030`; initial marker batch `2026-08-26 22:54:08` — `2026-08-27 00:42:23`; continuation `2026-08-27 08:06:31` — `09:24:56`, `Europe/Kaliningrad` | [`telegram-owner-voice-intake-20260826-27.md`](telegram-owner-voice-intake-20260826-27.md) (`OV-01…OV-08`); [`telegram-owner-voice-intake-20260827-continuation-01.md`](telegram-owner-voice-intake-20260827-continuation-01.md) (`OV-09…OV-49`) | [`penpot-owner-comments-resolution-20260826.md`](penpot-owner-comments-resolution-20260826.md) for existing implementation evidence; continuation file is the capture/triage ledger for `OV-09…OV-49` until bounded ownership is assigned | branch `fix/penpot-owner-comments-20260826`, Draft PR `#53` | `IN_PROGRESS` | `NO` |
| `REV-IDEAHUB-20260828-01` | Complete fetched Git history of `inbox/voice/2026/08` at IdeaHub HEAD `76c337ee1bf5a0d90b93222cf9db662e6d4167e6`: 27 commits / 23 packets | [`idea-hub-owner-voice-intake-20260828.md`](idea-hub-owner-voice-intake-20260828.md): 2 relevant design-system audits; 21 non-design-system packets excluded | existing `OV-04`, `OV-05`, `OV-08`, `OV-30`, `OV-33`, `OV-42`, `OV-45…OV-49`; new `OV-50…OV-52` | branch `fix/penpot-owner-comments-20260826`, Draft PR `#53` | `HISTORY_AUDITED / TRIAGED` | `NO` |
| `REV-IDEAHUB-20260828-02` | Incremental fetched history after `76c337e…` through IdeaHub HEAD `669cd14d692e6fd9eee061aee7b63d15bbf0a6e8`: 7 commits / 7 packets | [`idea-hub-owner-voice-intake-20260828-continuation-02.md`](idea-hub-owner-voice-intake-20260828-continuation-02.md): 2 relevant design-system audits; 5 other-project/technical packets excluded | existing `OV-02`, `OV-08`, `OV-30`, `OV-41`, `OV-42`; no new IDs | branch `fix/penpot-owner-comments-20260826`, Draft PR `#53` | `IN_PROGRESS` | `NO` |
| `REV-IDEAHUB-20260828-03` | Incremental fetched history after `669cd14…` through IdeaHub HEAD `6c5ce46fac1050dec956e19720271688f61ee82d`: 2 commits / 2 packets | [`idea-hub-owner-voice-intake-20260828-continuation-03.md`](idea-hub-owner-voice-intake-20260828-continuation-03.md): SVGRepo candidate lifecycle/style classes and cross-cutting Penpot tokens | new `OV-53`, `OV-54` | branch `fix/penpot-owner-comments-20260826`, Draft PR `#53` | `IN_PROGRESS` | `NO` |
| `REV-IDEAHUB-20260828-04` | Incremental fetched history after `6c5ce46…` through IdeaHub HEAD `3fa7d9521590a1279966df3a8d5d402a5286fb2d`: 1 commit / 1 packet | [`idea-hub-owner-voice-intake-20260828-continuation-04.md`](idea-hub-owner-voice-intake-20260828-continuation-04.md): record-idea-hub periodic chunk upload; other project | no KenigEvents/LoveKGD item | branch `fix/penpot-owner-comments-20260826`, Draft PR `#53` | `CONTEXT_ONLY` | `YES` |
| `REV-IDEAHUB-20260828-05` | Incremental fetched history after `3fa7d95…` through IdeaHub HEAD `9d87120851b7d6d4fc24f901f59e721af037e50c`: 1 commit / 1 packet | [`idea-hub-owner-voice-intake-20260828-continuation-05.md`](idea-hub-owner-voice-intake-20260828-continuation-05.md): Edinburgh Festival/media history, AI-industry criticism and recorder control phrase | no KenigEvents/LoveKGD item | branch `fix/penpot-owner-comments-20260826`, Draft PR `#53` | `CONTEXT_ONLY` | `YES` |
| `REV-IDEAHUB-20260828-06` | Incremental fetched history after `9d87120…` through IdeaHub HEAD `7f22f55d48306e7683f42aa5f3a37ffcba4d33fc`: 1 commit / 1 packet | [`idea-hub-owner-voice-intake-20260828-continuation-06.md`](idea-hub-owner-voice-intake-20260828-continuation-06.md): IdeaHub Android offline recording and reconnect sync test | no KenigEvents/LoveKGD item | branch `fix/penpot-owner-comments-20260826`, Draft PR `#53` | `CONTEXT_ONLY` | `YES` |
| `REV-IDEAHUB-20260828-07` | Incremental fetched history after `7f22f55…` through IdeaHub HEAD `0d61090fda75db5c737e1c522ffd7d731246d3ba`: 1 commit / 1 packet | [`idea-hub-owner-voice-intake-20260828-continuation-07.md`](idea-hub-owner-voice-intake-20260828-continuation-07.md): record-idea-hub Android Activity recreation/session continuity test | no KenigEvents/LoveKGD item | branch `fix/penpot-owner-comments-20260826`, Draft PR `#53` | `CONTEXT_ONLY` | `YES` |
| `REV-IDEAHUB-20260828-08` | Incremental fetched history after `0d61090…` through IdeaHub HEAD `f251c257e9124451d0b338e451d591455aa89a00`: 5 voice commits / 5 packets; later 5 microelectronics commits excluded | [`idea-hub-owner-voice-intake-20260828-continuation-08.md`](idea-hub-owner-voice-intake-20260828-continuation-08.md): Event Detail vertical Hero image, parallax/keyboard SoT, terminology correction, transport and related-events continuation | new `OV-55`, `OV-56`; 3 other-project voice packets and 5 later non-voice commits excluded | branch `fix/penpot-owner-comments-20260826`, Draft PR `#53` | `CORRECTION_MATERIALIZED / OWNER_REREVIEW_REQUIRED` | `NO` |
| `REV-IDEAHUB-20260829-09` | Incremental fetched history after `dc77b87…` through IdeaHub HEAD `eca10ad747d742ccdff1fc9ebacf1f7ba6a46d02`: 2 voice commits / 2 packets | [`idea-hub-owner-voice-intake-20260829-continuation-09.md`](idea-hub-owner-voice-intake-20260829-continuation-09.md): corporate API quota pools and Supabase limiter constraints belong to IdeaHub infrastructure | no KenigEvents/LoveKGD item; both packets excluded after full-transcript triage | branch `fix/penpot-owner-comments-20260826`, Draft PR `#53` | `CONTEXT_ONLY` | `YES` |

## 4. Disposition текущего Telegram review

Первый batch review определён явным Telegram marker и содержит `OV-01…OV-08`. Продолжение той же source-сессии зарегистрировано отдельно как [`REV-TG-20260826-01-CONT-01`](telegram-owner-voice-intake-20260827-continuation-01.md) и содержит `OV-09…OV-49`.

Continuation не смешивает продуктовые completion counts: `OV-09…OV-19` сохраняют semantic feedback по IdeaHub/Penpot Business как cross-contour capture, а `OV-20…OV-49` относятся к Astro ↔ Penpot design-system parity. Все `41` continuation items имеют `processed: NO`.

| Item | Requirement | Current status | Processed | Текущее доказательство / открытый gate |
|---|---|---|---|---|
| `OV-01` | `40.3A`: единый canonical Rail, period-date variant, отсутствие page-local альтернативных roots | `READY_FOR_OWNER_REREVIEW` | `NO` | Fresh page-scoped census records all `26` visible Rail roots as linked instances of one `MobileListingRailRow · Schedule variants` family: `22` exact-date + `4` period, former component copies `0`, alternative Rail root components `0`, detached roots `0`, `validate()=[]`. Both `event.real.5459` period instances preserve `5 июня–\n30 августа`. Receipt: `evidence/recovery-20260828/penpot/popular-mobile-rail-lineage-census.v1.json` |
| `OV-02` | `40.3A`: cover crop без полей, letterbox и растяжения | `READY_FOR_OWNER_REREVIEW` | `NO` | Astro owner now includes both rail surface files and `mobileListingRailMedia.mjs`; real-data browser readback proves `5374` = `140×112 cover`, protected `6936` = `75×112 contain`, and source-reviewed override `6652` = `140×112 cover`. Native authored-contain component `8f804431-c282-8075-8008-8db194fb8344` is linked into `6936`; `6652` is restored to canonical cover. `validate()=[]`. Receipt: `evidence/recovery-20260828/penpot/mobile-rail-media-parity-receipt.v1.json` |
| `OV-03` | владелец намеренно не взаимодействовал с контролами во время аудита | `CONTEXT_ONLY` | `YES` | контекст сохранён; отсутствие кликов нельзя интерпретировать как отсутствие необходимых interaction states |
| `OV-04` | отдельная owner-readable Branding page | `READY_FOR_OWNER_REREVIEW` | `NO` | Page `10.1` materialized from the Astro/UI SoT with the preserved wordmark master, native desktop/mobile lockup masters, linked specimens, exact readback, `validate()=[]` and focused visual export |
| `OV-05` | desktop/mobile tag, vertical/horizontal lockups, spacing и component/static-asset classification | `READY_FOR_OWNER_REREVIEW` | `NO` | Desktop/mobile leather-backed tags, horizontal/vertical linked lockups, spacing/min-size rules, ownership matrix and PWA any/maskable specimens are present; canonical 512 PWA PNGs remain Git authority while Penpot uses labelled 256 display proxies after MCP HTTP 413 |
| `OV-06` | `63.15 Artifacts`: 7/7 artifacts и none/subset/all expanded, hover/focus, selected-detail states | `READY_FOR_OWNER_REREVIEW` | `NO` | Visual base is the real pre-presentation donor `008839b14598105d1fed5b4e386d6d6f29d93d1f`; Astro `812ffc279728221b547707474bcb521f27c4a73d` was rebuilt with the required preview feature tuple (`PUBLIC_SITE_MODE=preview`, `PUBLIC_ENABLE_AMBER_ARTIFACT_RESEARCH=tail`) and passed generated `2/2` plus source `6/6` artifact tests. Browser readback proves exact `0/7` and `7/7` states at `1280` and `390`, all seven images loaded, seven dialogs, donor marker present, and no unavailable/blank overlay. Page `63.15` has the native exact-seven desktop/mobile owners selected (`1280×2718`, `390×2951`), three linked shell/body regions each, and `validate()=[]`; the stale unavailable linkage labels were regenerated out of Product Atlas. Receipts: `evidence/recovery-20260828/penpot/artifact-collection-1-owner-exact-seven-receipt.v1.json`, `evidence/recovery-20260829/astro/artifacts-preview-tail-r11/artifacts-astro-roundtrip-evidence.v1.json` |
| `OV-07` | Home HeroTalk: полная `phrase → arrow → phrase → …` chain | `PENPOT_MATERIALIZED / VISUAL_QA_BLOCKED` | `NO` | Native page `40.6` at revision `2641` contains all 7 source-faithful chains and 13 arrows, has a named version and `validate()=[]`. Structural receipt: `evidence/recovery-20260828/penpot/hero-talk-chains-structural-receipt.v1.json`. Whole-board and bounded-row PNG/SVG exports returned Penpot HTTP 504; focused visual export and owner re-review remain open. |
| `OV-08` | глобальный запрет визуально скрытых duplicate component roots | `PARTIAL_SOT / PENPOT_PAUSED` | `NO` | corrective Event-card consumer map now source-locks `63.01…63.07` to one required Penpot family owner; icon/other-family scope, exact canonical UUID, global census and detached-instance proof remain open |

Итог первого batch: `7` actionable items остаются необработанными; `OV-04`,
`OV-05` и `OV-07` имеют Git SoT, но остаются незакрытыми без Penpot/readback,
а `OV-01`, `OV-02` и `OV-06` готовы к owner rereview; `OV-08` сохраняет partial gate.
`1` context-only item зарегистрирован.

### Continuation `REV-TG-20260826-01-CONT-01`

- intake/triage record: [`telegram-owner-voice-intake-20260827-continuation-01.md`](telegram-owner-voice-intake-20260827-continuation-01.md);
- source boundary: `2026-08-27 08:06:31` — `09:24:56`, `Europe/Kaliningrad`;
- registered: `41` (`OV-09…OV-49`);
- exact transcript ready: `41`; pending transcript: `0`;
- cross-contour IdeaHub/Penpot Business comments: `11` (`OV-09…OV-19`);
- design-system/Astro ↔ Penpot observations: `30` (`OV-20…OV-49`);
- processed: `0`;
- Penpot mutation/readback/visual evidence in this registration commit: none.

Current bounded corrections from this continuation:

| Item | Status | Evidence | Processed |
|---|---|---|---|
| `OV-20`, `OV-21`, `OV-22` | `STRUCTURAL_CORRECTION_VERIFIED / VISUAL_EXPORT_BLOCKED` | Page `64.03` now exposes one native responsive action family instead of two competing visible baselines. The desktop secondary row is left-aligned; the canonical Like wrapper grows to `77×52` for factual count `164`; and a linked three-state matrix makes `calendar-label`, `share-label` and `icons-only` explicit. Astro `4d660b079` removes the mobile fixed width/hidden overflow. Two bounded Penpot exports returned HTTP 504, so no visual-pass claim is made. Contract: `catalog/reconstruction-atlas/v1/floating-action-island-ov20-22-source-exact.v1.json` | `NO` |
| `OV-23`, `OV-24` | `STRUCTURAL_CORRECTION_VERIFIED / VISUAL_EXPORT_DEFERRED_AFTER_504` | Astro `53f7b2c2c` and the canonical Penpot Mobile bottom navigation now use a `366×64` island inside the `390px` viewport, with `12px` side insets, `10px` bottom inset, all-side rounding and page visibility around it. Page `64.01` retains a linked Search-active copy and hides the rejected full-width baseline. Desktop analysis resolves to `not-applicable`: keep header navigation plus the separate Search entry rather than duplicate the mobile bottom island. Contract: `catalog/reconstruction-atlas/v1/navigation-floating-island-ov23-24-source-exact.v1.json` | `NO` |
| `OV-25`, `OV-26`, `OV-27` | `READY_FOR_OWNER_REREVIEW` | Fresh bounded readback of `40.3a` finds no blocking gray overlay. All `26` visible Rail roots resolve to the canonical `40.3` Schedule family (`22` exact-date + `4` period), with `0` former page-local copies, `0` alternative Rail roots, `0` detached roots and `validate()=[]`. The two remaining filled group headers are legitimate `fast_growth` / `discussed` context surfaces, not overlays. Receipt: `evidence/recovery-20260829/penpot/popular-mobile-rail-ov25-27-final-readback.v1.json` | `NO` |
| `OV-38`, `OV-39` | `READY_FOR_OWNER_REREVIEW` | Page `63.12` revision `2737` now uses the real future fixtures `7030` calendar-saved, followed by liked `7006` and `6947`, in three desktop columns / one mobile column. Both full owners retain the anonymous identity gate, linked canonical EventCard ancestry and source-sized document frames. Contract: `catalog/reconstruction-atlas/v1/favorites-ov38-39-populated-source-exact.v1.json` | `NO` |
| `OV-34` | `READY_FOR_OWNER_REREVIEW` | Page `63.16` now reconstructs current Astro `/partners/` rather than the invented `/partnerstvo/` funnel: exact heading/lead, six factual partner marks, linked shell/body components, native editable text/image fills, and zero screenshot overlays. Six obsolete funnel/directory components are hidden and deprecated. Contract: `catalog/reconstruction-atlas/v1/partners-ov34-source-exact.v1.json` | `NO` |
| `OV-35` | `READY_FOR_OWNER_REREVIEW` | Page `63.14` now follows actual Astro `/fokus-gruppa/priglashenie/` with four native desktop/mobile owners for install and tested six-digit email OTP. The OTP fixtures retain six editable boxes and source auto-submit copy; nine speculative programme/stage components are hidden and deprecated. Contract: `catalog/reconstruction-atlas/v1/focus-group-ov35-source-exact.v1.json` | `NO` |
| `OV-36`, `OV-37` | `READY_FOR_OWNER_REREVIEW` | Page `63.13` is rebuilt as a native, always-populated projection of current Astro `/dlya-menya/`: the workspace is visible without an extra consent step, both email and Yandex authentication choices are present, and exact fixtures `5459`, `6870`, `6941` represent the source nine-card recommendation set in three desktop columns / one mobile column. Both owners retain six linked regions, contain no full-page source projection, and pass `validate()=[]`. Contract: `catalog/reconstruction-atlas/v1/personal-feed-ov36-37-source-exact.v1.json` | `NO` |
| `OV-40` | `READY_FOR_OWNER_REREVIEW` | Page `63.11` revision `2739` now shows the three factual Astro clubs in both complete owners. All `3 + 3` roots remain linked to the canonical Club card component; stale empty-state header identities are now `state=ready;catalog=3`. Contract: `catalog/reconstruction-atlas/v1/interest-clubs-ov40-source-exact.v1.json` | `NO` |
| `OV-41`, `OV-42`, `OV-43` | `READY_FOR_OWNER_REREVIEW` | Page `63.09` now contains the complete factual `21`-festival July—December Astro projection in `1280×3604` and `390×4091` owners, including the emphasized `21` / `Июль—декабрь` metrics and actual `1`, `4+3`, `4+1`, `4+1`, `2`, `1` desktop formations. Native page `40.7` retains `12` linked packed-row instances, `0` detached copies and now has focused visual QA. Contract: `catalog/reconstruction-atlas/v1/festivals-ov41-43-source-exact.v1.json` | `NO` |
| `OV-44` | `READY_FOR_OWNER_REREVIEW` | Page `63.08` now projects the concrete Free collection rather than a button catalog: source medallion, `23` events, `14` ongoing exhibitions, large source-bound EventCard adapters, linked shell and compact sticky identity. Desktop/mobile focused exports now pass visual QA. Contract: `catalog/reconstruction-atlas/v1/collection-free-ov44-owner-exact.v1.json` | `NO` |
| `OV-45` | `READY_FOR_OWNER_REREVIEW` | Page `63.07` restores the exact desktop overlap, linked top-medallion and multi-occurrence family from Astro. Complete-owner and focused state exports now pass visual QA. Contract: `catalog/reconstruction-atlas/v1/event-detail-ov45-owner-exact.v1.json` | `NO` |
| `OV-46` | `READY_FOR_OWNER_REREVIEW` | The formerly contextless mobile report is bound to `63.07 Event detail`; its exact `5459` mobile owner has focused visual QA and a source contract. Contract: `catalog/reconstruction-atlas/v1/event-detail-ov46-mobile-owner-exact.v1.json` | `NO` |
| `OV-47`, `OV-48` | `READY_FOR_OWNER_REREVIEW` / context resolved | Page `63.06` now contains the factual authenticated Astro Search: loading/skeleton/progress and results on mobile/desktop plus the measured mobile validation, empty, error/retry, recovery and load-more ready/loading states. The internal stale-epoch guard is recorded as non-visual rather than invented as a screen. Revision `2813`, linked native owners, `validate()=[]`; lifecycle visual export remains deferred after exporter HTTP 504. Contract: `catalog/reconstruction-atlas/v1/search-ov47-mobile-source-exact.v1.json` | `NO` |
| `OV-49` | `EXPLICIT_DECISION_REQUIRED` | A fresh authority audit at Astro `812ffc279728221b547707474bcb521f27c4a73d` found `0` approved items in the current manifest and in every Git version of that manifest; the public `/neobychnoe/` route currently returns HTTP `404`. No accepted last-good exists. Concrete event IDs therefore cannot be materialized without fabricating publication authority; the remaining gate is an owner/editorial-approved nonempty manifest. Contract: `catalog/reconstruction-atlas/v1/unusual-listing-ov49-authority-gap.v1.json` | `NO` |

Статус `READY_FOR_OWNER_REVIEW` запрещён. Следующий продуктовый этап — назначить owning contour для каждого item и выполнять bounded source-faithful fixes с доказательствами, а не считать Git-регистрацию обработкой.

### IdeaHub voice continuation `REV-IDEAHUB-20260828-01`

- intake record: [`idea-hub-owner-voice-intake-20260828.md`](idea-hub-owner-voice-intake-20260828.md);
- evaluated IdeaHub HEAD: `76c337ee1bf5a0d90b93222cf9db662e6d4167e6`;
- history boundary: every fetched commit touching `inbox/voice/2026/08`;
- census: `27` commits, `23` packets, `2` relevant audits, `21` excluded non-design-system packets;
- dedup result: source clarification/supersession refs added to existing `OV-*`; new IDs: `OV-50…OV-52`;
- `OV-09…OV-19` remain cross-contour and outside design-system completion;
- cursor: `inbox/voice/2026/08/voice-20260828-142841-979ee3f3.md` at the evaluated HEAD; history-aware intake must still detect backfilled older captures;
- processed: `0`; Penpot mutation/readback evidence in this intake: none.

| Item | Requirement | Current status | Processed | Current evidence / open gate |
|---|---|---|---|---|
| `OV-50` | `63.01 Home`: replace the fabricated/legacy hero with the real HeroTalk `Photo Mosaic` product mechanism | `READY_FOR_OWNER_REREVIEW` | `NO` | Accepted preview and historical Astro source are restored in `events-bot-new#596` commit `4243401a4`; rejected `7d026b30d` is reverted. Penpot revision `2639` has linked accepted desktop/mobile mains, `validate()=[]`, a named version, focused exports and exact receipt `evidence/recovery-20260828/penpot/home-herotalk-accepted-receipt.v1.json`. Desktop uses the explicitly allowed lightweight overlay while phrase/cursor remain native; mobile is native text-only. |
| `OV-51` | `61.3 Weekend Time marker`: no opaque page-local block background | `READY_FOR_OWNER_REREVIEW` | `NO` | Astro SoT declares `.ke-weekend-time-rail { background: transparent; }`. Penpot revision `2614` removed the only opaque review-board fill, preserved the marker content, passed reopen readback and `validate()=[]`; focused PNG: `evidence/recovery-20260828/penpot/weekend-time-marker-transparent.png`. Global ancestry remains tracked separately by `OV-08`/`OV-30`. |
| `OV-52` | `61.10 Weekend Discovery rail exact`: content-sized transparent `Floating Island` rather than a full-width installed shelf | `READY_FOR_OWNER_REREVIEW` | `NO` | Shared Astro owner `ListingDiscoveryRail@6` exposes `plane` / `floating-island`; Weekend consumes the transparent content-sized island. Penpot revision `2621` records the Git-bound native master and linked copy, `validate()=[]`, plus focused Astro/Penpot evidence. |
| `OV-53` | SVGRepo candidate icon acquisition with provenance, lifecycle and visual-style classes | `PENPOT_TAXONOMY_MATERIALIZED / VISUAL_EXPORT_BLOCKED` | `NO` | Page `25` revision `2653` has six token-bound style classes, lifecycle/provenance gate and explicit zero-candidate state; no arbitrary icon was promoted. Exact readback/validation pass, bounded exporter returns HTTP 504 |
| `OV-54` | cross-cutting Penpot tokens for colors, typography, spacing, radii, elevation and sizing | `PENPOT_FOUNDATIONS + NINE COMPONENT MIGRATION BATCHES / GLOBAL MIGRATION IN_PROGRESS` | `NO` | Page `20` projects the source-conformant foundation set; the current set has `97` tokens. Nine bounded migrations now cover Announcements, shared navigation/social-proof/discovery roots, exact-seven Artifact collection/card roots, the responsive Interest Club card, Personal Feed owners, Search roots and Event Detail mobile/source-state roots. Batch `09` binds all seven `180×250` Artifact card mains to `radius.12` (`28/28` properties) on their owning source page, then reconfirms persistence from the selected review owner at revision `2818`; geometry is unchanged and `validate()=[]`. `space.4` remains a documented Plugin API persistence defect; global coverage and post-binding visual export remain open. |

## 5. Обязательный маршрут обработки

```text
source review
→ отдельный intake record
→ регистрация в этом index
→ dedup + actionability
→ per-item Git SoT disposition
→ bounded Penpot mutation
→ exact structural readback + focused visual exports
→ per-item READY_FOR_OWNER_REREVIEW
→ explicit owner acceptance
→ CLOSED
```

Review нельзя закрыть агрегированной фразой «комментарии обработаны». Для каждого item должны быть видны: текущий status, `processed YES/NO`, target, evidence и owner disposition.

## 6. Fail-closed проверки перед `READY_FOR_OWNER_REVIEW`

- все review-файлы текущего contour зарегистрированы в этом реестре;
- source boundary и dedup key доказуемы;
- каждый actionable item имеет terminal либо owner-rereview-ready status;
- нет `CAPTURED`, `IN_PROGRESS`, `EVIDENCE_INCOMPLETE` или `BLOCKED` items;
- Git SoT и Penpot evidence ссылаются на точные версии/UUID/revisions;
- визуальный export не подменяет component-lineage readback;
- owner acceptance не выводится из thread resolution или отсутствия новых комментариев.

## 7. Continuation access gate — 2026-08-27

- Existing branch `fix/penpot-owner-comments-20260826` and Draft PR `#53` were fresh-read before further Penpot mutation.
- Pre-write remote head: `3237f12db06df57af9386509661f607281e7030e`.
- The Library skill and handoff records were recovered; their Penpot state is treated as provisional until exact page-scoped structural readback.
- This checkpoint proves direct GitHub `update_file` → commit/push on the existing branch. It does not claim a Penpot fix and does not change any owner item to processed.

## 8. Rail cleanup live checkpoint — batch 1

Status: `IN_PROGRESS`; `processed: NO`.

At Penpot revision `2568`, three additional nested former-component consumers were migrated one at a time, in place, on `40.3a — Popular mobile fixtures · current-v1`:

| Fixture | Surviving UUID | Canonical Rail | Canonical EventMediaFrame | Focused PNG |
|---|---|---|---|---:|
| `5374` | `e57c842a-ea36-803b-8008-8b62b0207781` | exact-date component `cd5c3cad-a82a-806e-8008-8c351a4f2dcb`; main `cd5c3cad-a82a-806e-8008-8c3515bb5cc6` | component `a21f0524-f565-8038-8008-787378260237`; main `a21f0524-f565-8038-8008-787377eb13b2`; cover `140×112`, image `167.6725×112` | `28,083` bytes |
| `7015` | `e57c842a-ea36-803b-8008-8b62b27c87df` | same canonical exact-date owner | same canonical media owner; cover `90×112`, image `90×112.3902` | `28,158` bytes |
| `6710` | `e57c842a-ea36-803b-8008-8b62b3b1a60d` | same canonical exact-date owner | same canonical media owner; cover `168×112`, image `168.6588×112` | `33,314` bytes |

Exact content overrides, image-fill IDs, original parent positions and target UUIDs survived. `validate()=[]`; former-component census decreased `12 → 9`. Rail cleanup and the full actionable contour remain incomplete.

## 9. Rail cleanup live checkpoint — batch 2

Status: `IN_PROGRESS`; `processed: NO`.

At Penpot revision `2570`, the two remaining nested former-component consumers were migrated in place:

| Fixture | Surviving UUID | Schedule / source disposition | Canonical media / crop | Focused PNG |
|---|---|---|---|---:|
| `6936` | `e57c842a-ea36-803b-8008-8b62b5004102` | canonical exact-date component `cd5c3cad-a82a-806e-8008-8c351a4f2dcb`; main `cd5c3cad-a82a-806e-8008-8c3515bb5cc6` | canonical `EventMediaFrame`; wrapper `93×112`; image `93×139.6364`, `y=-13.8182`; image `502b4555-3f5f-807a-8008-8966abab8953` | `31,623` bytes |
| `4211` | `e57c842a-ea36-803b-8008-8b62b8611dcc` | pinned Astro authority `events-bot-new@7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00` declares `startDate=2026-08-08`, `endDate=2026-08-09`, label `8–9 августа`; therefore canonical **period** component `cd5c3cad-a82a-806e-8008-8c33cdfc0d1c`; main `cd5c3cad-a82a-806e-8008-8c33ca5b2d62` | canonical `EventMediaFrame`; square wrapper/image `112×112`; image `c269caa0-e456-818c-8008-8966af7fdcd6` | `36,312` bytes |

The page-scoped former-component census is now `7`, all seven are root fixtures and nested former-component copies are `0`. `validate()=[]`. Rail cleanup is not complete until the root fixtures are migrated and the remote checkpoint is updated.
