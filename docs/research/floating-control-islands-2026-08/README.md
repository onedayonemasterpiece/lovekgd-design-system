# Floating Islands / detached chrome — KenigEvents

Pattern ID: **`pattern.detached-chrome-control-islands`**. Продолжение существующего [PR #47](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/47).

**2026-09-05: система документально спроектирована; верхняя композиция уточнена до v1.1 по владельцу. Runtime новой системы, новый visual skin, A=S=P и завершение нормализации не заявлены.** Исследовательские skeletons остаются `exploration_input`, не native components или новые foundation tokens.

## Текущая спецификация — одна точка входа

**Главная поправка v1.1: сначала одна верхняя строка с отдельными островами и свободным пространством.** Page context, полка/controls, меню и подходящий medallion компактируются согласованно, но каждый по своей карте представлений. Допустимо icon+label → label → icon при неизменных action/meaning. Нет автоматического второго sticky этажа, glyph-only непонятного заголовка или уменьшения target ради одной строки.

| Документ | За чем идти |
|---|---|
| **[Одна верхняя строка и компактизация v1.1](top-row-composition-v1.1.md)** | Исследование первичных источников, anatomy/whitespace, независимые views, иконки/меню/медальоны, width fit, стабильность, semantic heading projection, accessibility и actual integration. |
| [Системная спецификация v1 с адресными поправками](system-design-v1.md) | FI-01–FI-20: роли, C1–C6, occupied-space/keyboard/scroll/layers, Search adapter и A=S=P. FI-02/05/09/11 согласованы с v1.1. |
| [Обязательные release bindings](release-bindings-v1.md) | RB-01–03: honest receipt state, occlusion→served/exposure, frozen prefix/global hides/undo, analytics OFF и MeasurementQuestions. |
| [Матрица потребителей и состояний](consumer-matrix-v1.md) | Все 17 archetypes прочитанного actual registry; C1–C6 и fixtures, согласованные с общей row. Current release manifest проверяется перед migration. |
| **[Первый пакет FI-P1](implementation-package-1.md)** | One-row Popular как первый видимый результат; compatible existing menu/rail adapters; regression Today/Free/event-detail; source/preview/rollback/acceptance. |
| [Offline top-row model](top-row-model.py) | 14 выполненных unit checks на искусственных размерах. Не Astro/runtime/browser, не typography tokens, не P materialization. `python top-row-model.py`. |
| [Источники исходного проектирования](sources-and-decisions-v1.md) | Исторические source/public pins и ограниченные browser captures. Поздние release reads — RB; новые source/web/tool boundaries — v1.1 §§2/9/12. |
| [Pattern dossier](planned-design-pattern.md), [planned-pattern JSON](planned-pattern.json) | Lifecycle, C1–C6 и target binding status. Не второй release manifest; current composition refinement маршрутизируется через эту точку входа и core spec. |

Это один pattern с разделёнными ответственностями, не три competing specs. Core описывает общую систему, v1.1 уточняет верхнюю композицию, RB — только стыки с существующим продуктом. Иконки, реальные медальоны, карточки и меню сохраняют canonical owners.

32 core и 5 binding сценариев остаются **спроектированными runtime cases**, а не пройденными тестами. 12 top-row acceptance categories расширяют соответствующие случаи, не требуют 12 новых workflows. 14 tests модели проверяют только арифметику/решения на synthetic inputs; не заменяют real font/DOM/browser/native/P evidence.

**Допуск:** документально проектировать можно сейчас. Визуальное изменение требует honest baseline затронутого consumer, versioned family и owner review; без native P нет A=S=P. Нормализация всего сайта не объявляется пройденной. Production/shared foundations/STATUS не меняются этой documentary lane.

**Инструменты v1.1:** GitHub reads/writes доступны. Browser/Penpot actual calls вернули `FORBIDDEN: This conversation does not support developer MCPs`; новых screenshots/native objects нет, обхода нет. Existing STATUS теперь сообщает public/source2fe28b1…/version22; это receipt, не повторённая здесь browser проверка. Полезность нового compact UI на людях ещё не измерена.

Голосовой Search — один из потребителей, его product/API/capture/resource authority — [events-bot-new#587](https://github.com/onedayonemasterpiece/events-bot-new/pull/587). Integration/normalization — [#621](https://github.com/onedayonemasterpiece/events-bot-new/issues/621), tracker — [#39](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/39). Нового оркестратора/конвейера нет.

## Сохранённая исследовательская база

![Source-informed six-screen reference board](assets/reference-board.svg)

![Historical pattern anatomy and validation gates](assets/anatomy.svg)

Anonymized source-informed skeletons по шести прежним screenshots, не готовые KenigEvents pages. Исторический текст gates на anatomy board читается с FI-01; картинка не переопределяет актуальный документ.

| Поле | Историческая фиксация |
|---|---|
| Telegram source | `https://t.me/c/4337049383/1162` |
| eventsBot MCP | Metadata прочитаны; materialization media bytes не удалась |
| Direct input | Шесть attachments921×2048, просмотренных автором исходного исследования |
| Telegram media count | Два элемента альбома, не число прямых attachments |
| Raw screenshots в Git | Нет: private names/messages/avatars/third-party content |
| Наблюдения | [screen-observations.json](screen-observations.json) |
| Provenance | [source-manifest.json](source-manifest.json) |
| Полный прежний текст | [README@774bcf0](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/774bcf0659915dffa16431847d408b2a6a6f2302/docs/research/floating-control-islands-2026-08/README.md) |

Повторный просмотр исходных приватных screenshots не заявляется. Их сохранённые принципы:

| Пример | Сохраняемый смысл |
|---|---|
| Kimi home | Menu/context/audio/composer имеют разных owners. |
| Kimi reading | Scroll recovery не меняет место чтения или identity composer. |
| Telegram list | Сравнительно монолитная шапка совместима с отдельными filters/navigation; не всё обязано стать island. |
| Telegram conversation | Back/identity/utilities/pinned context различаются по смыслу и lifecycle. |
| Media player | Immersive canvas допускает верхние controls, но не закрытие важного content. |
| Media library | Persistent state и navigation различны; разработка плеера для сайта не поручена. |

## Термины и непрерывность

`Pill/capsule` — геометрия, не component identity; `chip` — компактный filter/select/suggestion/input control, не вся шапка/composer/nav. Четыре слоя: surface → composition → control semantics → runtime/layout. Общий radius не объединяет разные функции.

Source-era `unresolved`, `reuse_existing=[]`, `new_component=[]` в observational JSON сохраняют историческое значение. Current applicability и proposals читаются выше; promotion не выводится из таблицы.

[Distributed](assets/variant-a-distributed.svg) и [Split dock](assets/variant-b-split-dock.svg) — ранние non-source-faithful explorations, не C1–C6 и не A=S=P evidence. Исходные observations/assets не переписаны новым исследованием.

Для adoption нужны реальные baseline/candidate на одинаковых fixtures/assets/states/viewports, lineage, browser/device checks и owner approval. Skeleton geometry/blur/spacing не становится canonical tokens; compact glyph в текстовой схеме не заменяет hash-bound SVG asset.
