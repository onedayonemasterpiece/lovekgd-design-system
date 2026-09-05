# Floating Islands — KenigEvents

Pattern **`pattern.detached-chrome-control-islands`**, existing owner [PR #47](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/47). 2026-09-05. Текущая документально-визуальная composition revision **v1.4**; actual runtime integration и native conformance отдельно.

## Начать здесь

**[Композиция и движение v1.4](top-row-composition-v1.1.md)** — текущие правила. Путь сохранён, чтобы прежние ссылки вели к актуальному владельцу, а не плодились competing specifications.

Уточнение по одобренной в целом SVG-схеме:

- «Популярное» начинает превращаться в остров с первых пикселей прокрутки, а не исчезает перед появлением копии. Преобразование обратимо и не пересекает неизменную бирку.
- Первый уровень на mobile — `[Популярное] [Города]`; на узкой ширине сокращаются города до `…`, не бренд или название.
- Второй уровень — **контекст текущей полки**, не меню разделов сайта. Proposed mobile placement: узкая capsule под первичной парой, без full-width strip; desktop: та же полка в одной строке с title/cities. Следующая полка вытесняет предыдущую; при обратной прокрутке возвращается прежняя.
- На исходном экране уже видно событие; нет дополнительной полки «Сегодня / Завтра / Выходные / Популярное» или раскрытого по умолчанию выбора городов.

Один цельный нижний остров сохраняется; новое macOS-like оформление по-прежнему отдельный future visual review, а отклонённая тяжёлая skin не возвращается. Бренд «Полюбить Калининград Анонсы» не подвергается соседней compaction/repositioning. Exact Free medallion equivalence, canonical assets/text fallback, original city fieldset и FI/RB guards сохраняются.

## Карта документов

| Документ | Ответственность |
|---|---|
| [Композиция v1.4](top-row-composition-v1.1.md) | Immediate reversible motion, оба уровня, смена полок, desktop, protected brand, Free identity, city disclosure и граница schematic/production. |
| [Core FI-01–20](system-design-v1.md) | Общие roles/C1–C6, occupied-space/scroll/keyboard/layers, Search adapter и A=S=P. Старые более общие формулировки читаются с адресными owner amendments current composition. |
| [Release bindings RB-01–03](release-bindings-v1.md) | Receipts, served/exposure, frozen prefix/hides/undo, optional analytics OFF; existing transport/profile authority. |
| [Consumer matrix](consumer-matrix-v1.md) | Actual registry routes/owners/scenarios; current release manifest проверяется перед migration. |
| [FI-P1](implementation-package-1.md) | Bounded source integration; current composition уточняет его видимое поведение, не создаёт нового orchestrator. |
| [Historical sources](sources-and-decisions-v1.md) | Прочитанные source/public/browser facts с собственными датами. |
| [Dossier](planned-design-pattern.md), [JSON](planned-pattern.json) | Lifecycle/proposed variants; не deployment manifest и не доказательство native P. |

## Новые schematic artifacts и проверки

В текущем разговоре владельцу переданы editable SVG: mobile initial/middle/pinned, narrow320, second-level handoff и desktop before/after; GIF transitions; self-contained HTML со своим scrollport, scrub/play/reverse,320/390/1280, reduced-motion и export-current-SVG. Source/тесты входят в переданный пакет `popular-islands-motion`.

12 pure-model и20 standalone-browser checks прошли; изображения просмотрены. Это **SCHEMATIC_MODEL_ONLY**, не Astro, не реальный corpus и не native Penpot. Numeric112/56px endpoints и synthetic cards/brand — проверочные inputs, не canonical tokens/дизайн существующей бирки. Пенпот-страница не создана. Эти Markdown commits сохраняют правила; SVG/HTML bytes из разговора не объявляются находящимися в Git.

## Последний отдельный runtime checkpoint

Ранее проверенный source [events#638](https://github.com/onedayonemasterpiece/events-bot-new/pull/638): **ea07efaa58d6eb911cfb6cb62914cd8ae10c2dd6**, [run33969915797](https://github.com/onedayonemasterpiece/events-bot-new/actions/runs/33969915797).23 Node checks и114 browser assertions закрыли конкретный city inline-fallback regression. July23 fixtures; DIAGNOSTIC_PASS_NOT_ACCEPTANCE. Этот результат **не относится к новому движению v1.4**. При продолжении читать current PR/HEAD, не считать зафиксированный исторический source вечным latest.

Подробный прежний terminal receipt, hashes и access retrospective сохранены [в README@67a39c0](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/67a39c0a0607206e53675d87204b9fedef6860fe/docs/research/floating-control-islands-2026-08/README.md) и PR#638. Вновь объявлять актуальную GitHub write блокировку по прежнему отказу нельзя: тогда same-action retry завершился сохранением и readback. Доступность GitHub не доказывает callable Penpot/browser/my-data-hub.

## Границы внедрения

Новая визуализация не модифицирует runtime, production/root/current/ICS, shared foundations, canonical components или STATUS. Требуются fresh-read пересекающейся shell implementation, один heading/layout/filter owner, protected-brand reconciliation, source-bound family/impact/scenario mapping, текущий same-corpus Kaggle preview и native P по active A=S=P authority. Schematic SVG не является native materialization или приёмкой всей нормализации.

#621 — integration и единый Kaggle путь; #587 — Search/release; #39 — tracker. Никаких новых transport/profile/analytics/publisher контуров.

## Сохранённое исследование

[screen-observations.json](screen-observations.json), [source-manifest.json](source-manifest.json), [reference board](assets/reference-board.svg), [anatomy](assets/anatomy.svg), [distributed](assets/variant-a-distributed.svg)/[split dock](assets/variant-b-split-dock.svg) остаются research exploration, не approved screens/tokens. Raw private screenshots не публикуются.

[Исследование v1.1](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/eb3309591be368d729ea52c90b6ef99d1acbad6b/docs/research/floating-control-islands-2026-08/top-row-composition-v1.1.md#2-что-показало-исследование) сохраняет основания grouping/compaction/reflow, но не отменяет owner amendments. [Старая offline модель](top-row-model.py) — synthetic history, не действующая policy branded-menu compaction.
