# Floating Islands / detached chrome — KenigEvents

Pattern ID: **`pattern.detached-chrome-control-islands`**. Продолжение существующего [PR #47](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/47).

**2026-09-05: сквозная система документально спроектирована. Новая система ещё не внедрена, новый visual skin не принят; A=S=P и нормализация сайта не объявляются пройденными.** Исследовательские skeletons ниже остаются `exploration_input`, не native components и не источник новых foundation tokens.

## Текущие документы

| Документ | За чем идти |
|---|---|
| [Системная спецификация v1](system-design-v1.md) | Единственное место правил FI-01–FI-20: роли, композиции, состояния, геометрия, scroll/keyboard, layers, accessibility, Search adapter и A=S=P. |
| [Матрица потребителей и состояний](consumer-matrix-v1.md) | Все 17 зарегистрированных архетипов, реальные owners/routes, шесть proposed compositions и state-fixture coverage. |
| [Первый пакет реализации FI-P1](implementation-package-1.md) | Shared geometry + сменяемый контекст полок на «Популярном», совместимость с Today/Free/event-detail, 32 конкретных тест-сценария и критерии поставки. |
| [Источники и решения](sources-and-decisions-v1.md) | Точные source/public SHA, записи владельца, личные browser observations, найденные расхождения, Penpot safety block и границы доказательств. |
| [Pattern dossier / gate](planned-design-pattern.md) | Направление, текущий этап, адресное before→after уточнение допуска к проектированию и routing. |
| [Planned-pattern JSON](planned-pattern.json) | Машиночитаемые lifecycle/proposed variant ссылки. Не второй контракт геометрии и не production manifest. |

**Уточнение допуска:** документальный дизайн/fixtures готовятся сейчас; визуальное изменение требует честного baseline затронутого потребителя. Полный незавершённый AS-IS/P всего сайта не блокирует проектирование. Без реального native P никто не заявляет A=S=P. Production promotion, принятые shared foundations и STATUS остаются под действующими владельцами. Подробное owner amendment — FI-01, не переписанная в каждом prompt версия требования.

Голосовой Search — один из потребителей, его product/API/capture/лимиты принадлежат [events-bot-new#587](https://github.com/onedayonemasterpiece/events-bot-new/pull/587). Интеграция/normalization — существующий [#621](https://github.com/onedayonemasterpiece/events-bot-new/issues/621). Tracker [#39](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/39) ссылается сюда, не создаёт альтернативный system design.

## Сохранённая исследовательская база

![Source-informed six-screen reference board](assets/reference-board.svg)

![Historical pattern anatomy and validation gates](assets/anatomy.svg)

Это anonymized source-informed skeletons по шести ранее переданным владельцем mobile screenshots, а не готовые экраны KenigEvents. Текст gates на исторической anatomy board читается с текущим уточнением FI-01; картинка не переопределяет действующий документ.

| Поле | Исторически зафиксировано |
|---|---|
| Telegram source | `https://t.me/c/4337049383/1162` |
| eventsBot MCP | Metadata прочитаны; materialization исходных media bytes не удалась |
| Прямой визуальный input | Шесть отдельных attachments 921×2048, просмотренных автором исходного исследования |
| Media count в Telegram metadata | Два элемента альбома; это не число шести прямых attachments |
| Raw screenshots в Git | Не сохраняются: private names/messages/avatars и чужие изображения/branding |
| Наблюдения | [screen-observations.json](screen-observations.json) |
| Provenance | [source-manifest.json](source-manifest.json) |
| Полный исходный текст исследования | [README до системного проектирования](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/774bcf0659915dffa16431847d408b2a6a6f2302/docs/research/floating-control-islands-2026-08/README.md) |

В окне 2026-09-05 перечитаны сохранённые observations; повторный просмотр исходных шести приватных изображений не заявляется. Новые настоящие KenigEvents browser captures перечислены отдельно в sources.

| Пример | Сохраняемый вывод |
|---|---|
| Kimi home | Leading menu, mode context, audio utility и composer имеют разных owners. |
| Kimi reading | Transient scroll utility не должна менять место чтения или identity composer. |
| Telegram chat list | Контрпример: сравнительно монолитная шапка совместима с отдельными filter/FAB/navigation поверхностями. |
| Telegram conversation | Back, identity, related utilities и pinned context — разные, но согласованные роли. |
| Media player | Immersive canvas может начинаться сверху; это не автоматическое разрешение перекрыть важное содержимое. |
| Media library | Persistent state и destination navigation имеют разные lifecycles; это не поручение добавить плеер в KenigEvents. |

## Термины и непрерывность исследования

`Detached chrome` / `floating chrome` описывают отделённую оболочку; `floating control islands` — композицию role-owned поверхностей. `Pill` и `capsule` — геометрия, не component identity. `Chip` — компактный filter/select/suggestion/input control, а не название всей шапки, composer или nav.

Исходный вывод сохранён: четыре слоя **surface → composition → control semantics → runtime/layout behavior**. Общий radius не является достаточным основанием объединить components. Состав действий определяется реальными KenigEvents consumers; чужие интерфейсы не копируются один в один.

Source-era поля `unresolved`, `reuse_existing=[]`, `new_component=[]` в observational JSON — исторические dispositions исходного research. Current applicability и предложенные composition IDs читаются из текущего пакета выше; они не означают принятие новых native families или tokens.

## Ранние exploratory variants

[Distributed control islands](assets/variant-a-distributed.svg) и [Split dock + context island](assets/variant-b-split-dock.svg) сохранены как ранние non-source-faithful варианты. Они не трассировки шести изображений, не новые C1–C6 и не baseline/candidate evidence для A=S=P.

Для любого будущего visual adoption нужны реальные consumer baseline/candidate с теми же fixtures, assets, states и viewport, корректная component lineage, browser/device evidence и действующий owner review. Нельзя переводить blur, размеры, spacing или elevation исследовательских skeletons в foundations либо тихо заменять принятый nav. Сами эти требования не запрещают выполнять уже разрешённое документальное проектирование.
