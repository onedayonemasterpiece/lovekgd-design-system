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

## 4. Disposition текущего Telegram review

Первый batch review определён явным Telegram marker и содержит `OV-01…OV-08`. Продолжение той же source-сессии зарегистрировано отдельно как [`REV-TG-20260826-01-CONT-01`](telegram-owner-voice-intake-20260827-continuation-01.md) и содержит `OV-09…OV-49`.

Continuation не смешивает продуктовые completion counts: `OV-09…OV-19` сохраняют semantic feedback по IdeaHub/Penpot Business как cross-contour capture, а `OV-20…OV-49` относятся к Astro ↔ Penpot design-system parity. Все `41` continuation items имеют `processed: NO`.

| Item | Requirement | Current status | Processed | Текущее доказательство / открытый gate |
|---|---|---|---|---|
| `OV-01` | `40.3A`: единый canonical Rail, period-date variant, отсутствие page-local альтернативных roots | `EVIDENCE_INCOMPLETE` | `NO` | CP-01 подтверждает period wrap и связанные fixture rows; полный canonical-root/lineage census и доказательство отсутствия альтернативных roots ещё не закрыты |
| `OV-02` | `40.3A`: cover crop без полей, letterbox и растяжения | `EVIDENCE_INCOMPLETE` | `NO` | два затронутых fixture получили wrapper/crop/export readback; полный affected-scope visual proof и owner re-review отсутствуют |
| `OV-03` | владелец намеренно не взаимодействовал с контролами во время аудита | `CONTEXT_ONLY` | `YES` | контекст сохранён; отсутствие кликов нельзя интерпретировать как отсутствие необходимых interaction states |
| `OV-04` | отдельная owner-readable Branding page | `CAPTURED` | `NO` | Branding page/readback отсутствуют; блокирует общий `READY_FOR_OWNER_REVIEW` |
| `OV-05` | desktop/mobile tag, vertical/horizontal lockups, spacing и component/static-asset classification | `CAPTURED` | `NO` | variant matrix, classification и ancestry/readback evidence отсутствуют |
| `OV-06` | `63.15 Artifacts`: 7/7 artifacts и none/subset/all expanded, hover/focus, selected-detail states | `BLOCKED` | `NO` | существование общей Artifacts page не закрывает расширенный state matrix; обязательные state boards/readback отсутствуют |
| `OV-07` | Home HeroTalk: полная `phrase → arrow → phrase → …` chain | `CAPTURED` | `NO` | source-faithful chain specimen и mapping/readback отсутствуют |
| `OV-08` | глобальный запрет визуально скрытых duplicate component roots | `BLOCKED` | `NO` | глобальный lineage table, duplicate-root census, canonical UUIDs и detached-instance proof отсутствуют |

Итог первого batch: `7` actionable items остаются необработанными (`2` partial/evidence-incomplete, `5` captured/blocked); `1` context-only item зарегистрирован.

### Continuation `REV-TG-20260826-01-CONT-01`

- intake/triage record: [`telegram-owner-voice-intake-20260827-continuation-01.md`](telegram-owner-voice-intake-20260827-continuation-01.md);
- source boundary: `2026-08-27 08:06:31` — `09:24:56`, `Europe/Kaliningrad`;
- registered: `41` (`OV-09…OV-49`);
- exact transcript ready: `41`; pending transcript: `0`;
- cross-contour IdeaHub/Penpot Business comments: `11` (`OV-09…OV-19`);
- design-system/Astro ↔ Penpot observations: `30` (`OV-20…OV-49`);
- processed: `0`;
- Penpot mutation/readback/visual evidence in this registration commit: none.

Статус `READY_FOR_OWNER_REVIEW` запрещён. Следующий продуктовый этап — назначить owning contour для каждого item и выполнять bounded source-faithful fixes с доказательствами, а не считать Git-регистрацию обработкой.

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
