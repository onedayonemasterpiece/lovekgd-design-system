# Floating Islands — KenigEvents

Pattern **`pattern.detached-chrome-control-islands`**, existing owner [PR #47](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/47). 2026-09-05, current composition **v1.3**. Product direction unchanged; evidence below updated after the access recheck.

## Последние решения владельца

**Нижний остров один цельный, стилистически ближе к macOS. Не отдельные острова-иконки или плитки.** Широкая тяжёлая desktop skin отклонена и удалена из draft #638. Прежнее оформление восстановлено; новая Mac-like skin пока направление для последующего visual review, не реализованный или принятый дизайн.

**Брендовое меню «Полюбить Калининград Анонсы» не меняется:** не сжимается/не переставляется по состояниям соседей. Собственное existing управление сохраняется. Contextual islands учитывают занятое им место. Exact Free допускает canonical медальон вместо повторного floating title с сохранёнными H1/accessible name/qualifiers; при ошибке изображения остаётся текст. Города используют исходный fieldset, а не второй filter/state owner.

| Документ | Ответственность |
|---|---|
| **[Композиция v1.3](top-row-composition-v1.1.md)** | Последние owner corrections, единый нижний остров, защищённый бренд, medallion equivalence и city lifecycle. Путь сохранён ради входящих ссылок. Его section7 содержит исторические source checkpoints; текущий terminal result — ниже и в PR #638. |
| [Core FI-01–20](system-design-v1.md) | Roles/C1–C6, occupied-space, scroll/keyboard/layers, Search adapter/A=S=P. Старые brand-mutation permissions перекрыты current composition. |
| [Release bindings RB-01–03](release-bindings-v1.md) | Receipts, served/exposure, frozen prefix/hides/undo, optional analytics OFF; existing transport/profile authority. |
| [Consumer matrix](consumer-matrix-v1.md) | Actual registry routes/owners/scenarios; current release manifest проверяется перед migration. |
| [FI-P1](implementation-package-1.md) | Общий bounded integration package. Частичная реализация #638 не равна выполнению всей системы. |
| [Historical sources](sources-and-decisions-v1.md) | Исходные source/public/browser facts с собственными датами и границами. |
| [Dossier](planned-design-pattern.md), [JSON](planned-pattern.json) | Lifecycle/proposed variants; не deployment manifest и не доказательство native P. |

## Текущий проверенный runtime checkpoint

[Draft events #638](https://github.com/onedayonemasterpiece/events-bot-new/pull/638), branch `work/floating-islands-owner-preview-20260905`. **Exact tested source `ea07efaa58d6eb911cfb6cb62914cd8ae10c2dd6`**. [Run33969915797](https://github.com/onedayonemasterpiece/events-bot-new/actions/runs/33969915797) terminal SUCCESS обоих focused jobs. Draft не слит и не объявлен merge-ready/полным FI-P1.

Закрыт ранее падавший Popover-unavailable case: city rectangle теперь занимает место в документе, не перекрывается карточками и не мешает H1. Исправление ограничено candidate CSS. Natural height освобождён на трёх уровнях: compact controls; expanded-inline rail; его inner grid, ранее сохранявший `grid-template-rows:48px`. Нельзя было лечить это z-index или forced click. Бренд, lower dock, cards и shared foundations не менялись.

Первая возобновлённая правка ef133607 / run33969596843 оказалась недостаточной именно из-за grid track. Её FAIL сохранён, не переписан в PASS. ea07 добавляет actual containment assertions (panelBottom≤railBottom), сохраняя все настоящие click/selection/Escape/outside/cleanup проверки.

**Лично прочитанные artifacts:**23 Node checks, обычные browser Popular34/34 + Free39/39; recovery Popular34/34 + Free7/7. Итого114 browser assertions отдельно от23 Node tests. Chromium149.0.7827.55, regular viewports390×844/1280×800/1920×1080. API-unavailable/open/full-height screenshot просмотрен: следующий контент идёт после прямоугольника, а не поверх него. Resize до220px — synthetic pressure, не native OSK или полная проверка usability физически малого экрана.

Все четыре JSON summary содержат **DIAGNOSTIC_PASS_NOT_ACCEPTANCE**, exact ea07. ZIP hashes проверены:

- Popular9970621606: `2b77f6b2a3611050cfac16dfe0f62ba5ce35d57d803719954ecdea358caea501`;
- Free9970624780: `5c60ae7e5dec97c21979e5241434e030da01a0771d0514972b30d877c3e1c900`.

Настоящий Astro сгенерирован existing `local:focused`, но **на fixture2026-07-23**, snapshot`1f86e940ee43d7ab4fcfd6a33e5980674c4b4e37b3e1bd806b3172cda18fa147`. Не свежий September corpus/public Kaggle preview/native Penpot. Artifacts только PNG/JSON/TAP без font files/credentials/private DB.

## Ретроспектива доступа — что именно изменилось

Полностью прочитаны [основная ретроспектива](https://github.com/onedayonemasterpiece/idea-hub/blob/main/docs/github-access-retrospective-2026-08-27.md) и [recurrence](https://github.com/onedayonemasterpiece/idea-hub/blob/main/docs/github-access-retrospective-recurrence-2026-08-27.md). Подтверждены schemas, repository push permission и exact branch. **Один повтор той же ранее заблокированной create_tree** принял ту же CSS правку. create_commit/update_ref(force=false) и remote readback успешны. Не использовался другой маршрут записи, force-push, изменение разрешений или переустановка. Причина предыдущего safety-status отказа неизвестна; этот отказ больше не активный blocker.

Browser/Penpot/my-data-hub — другой случай: Plugin Management подтверждает installed/enabled, однако namespace discovery в этом разговоре не отдаёт их callable methods. Успех GitHub не доказывает их доступность. Read-only CI диагностирует страницы, не подменяет Kaggle publisher или Penpot integration.

## Незавершённая интеграция

Draft остаётся на прежней source base. Ранее прочитанный integration46fc5268… имеет пересекающуюся top-band/menu implementation и не слит сюда. Нужно согласовать единого owner с защищённым брендом, полный upper-row behavior, canonical family/impact/scenario/control-plane registration, root Unreleased integration и current-corpus Kaggle interactive preview. Required native S/P evidence отсутствует; A=S=P не заявлено.

Один actual conformance owner сохраняется. Production/root/current/ICS/shared foundations/STATUS не менялись. #621 — integration и один Kaggle путь, #587 — Search/release, #39 — tracker. Нет нового оркестратора, global menu, фильтра, профиля или publisher.

## Сохранённое исследование

[screen-observations.json](screen-observations.json), [source-manifest.json](source-manifest.json), [reference board](assets/reference-board.svg), [anatomy](assets/anatomy.svg), [distributed](assets/variant-a-distributed.svg)/[split dock](assets/variant-b-split-dock.svg) — прежняя exploration, не accepted tokens/pages. Raw private screenshots не публикуются.

[Исследование v1.1@eb330959](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/eb3309591be368d729ea52c90b6ef99d1acbad6b/docs/research/floating-control-islands-2026-08/top-row-composition-v1.1.md#2-что-показало-исследование) сохраняет основания grouping/compaction/reflow; не отменяет owner corrections. [Offline model](top-row-model.py) — synthetic history, не текущая branded-menu runtime policy.

Technical diagnostic PASS, visual acceptance, source integration и опубликованный продукт — различные факты. Устранение этого regression не объявляет всю нормализацию законченной.
