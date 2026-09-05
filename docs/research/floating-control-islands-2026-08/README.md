# Floating Islands — KenigEvents

Pattern **`pattern.detached-chrome-control-islands`**, существующий [PR #47](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/47). 2026-09-05. Текущая документальная composition revision **v1.6**. Runtime, visual acceptance и native A=S=P — отдельные результаты.

## Текущая поправка владельца

**[Навигация и контекст v1.6](top-row-composition-v1.1.md)** — единственный владелец последних адресных правил; прежний путь сохранён.

**Desktop после закрепления: бирка → текущая полка → города → меню с выделенным «Популярное». Меню постоянно у правого края.** Его right anchor, rect и visible targets не меняются от прокрутки или длины названия полки. Сначала резервируется правая область меню, затем доступная слева область для полки и городов. Resize может менять профиль, но не его правую привязку. На неизменной ширине профиль меню одинаков до/после scroll, без внезапного перемещения active item.

**Mobile: контекст и соседний city trigger одинаковы по высоте и вертикальному выравниванию.** Двойной page+section island сохраняется. Кнопка «…» сокращается по ширине, не превращается в маленький низкий круг возле высокого контекста. Материал/радиус/граница согласованы; glyph обычного размера по центру. Если дочерняя подпись переносится, оба острова растут вместе. Бренд для этого не масштабируется.

| Режим | Page identity | Плавающий контекст |
|---|---|---|
| Desktop с видимым right-menu | Выделенное «Популярное» в навигации | Только текущая полка, слева от городов и меню. |
| Mobile без desktop-полосы | «Популярное» внутри combined island | Page+section в одной поверхности, города отдельной поверхностью той же высоты. |
| Тесный desktop | Current item остаётся видимым; допустим named trigger «Популярное ▾» | Shelf-only пока identity действительно видна; безымянный trigger её не заменяет. |

Desktop начинается с обычного H1 и развёрнутого ряда доступных городских вариантов. При pinning города могут сохранять несколько прямых choices и «Ещё города». «Ещё разделы» — другое раскрытие. Не прятать current item, не сокращать всё только от scroll offset и не возвращать дополнительную навигационную полку на mobile.

Смена полки не меняет выбранную страницу/города и не двигает меню. Mobile morph остаётся immediate/reversible/diagonal, без отдельного горизонтального этапа; текущий state viewer не выдаётся за доказанную анимацию. Настоящая бирка неизменна, нижний dock один цельный, rejected skin не возвращается. Free medallion equivalence, original city controls и FI/RB guards сохранены.

## Документы

| Документ | Ответственность |
|---|---|
| [Композиция v1.6](top-row-composition-v1.1.md) | Правый menu anchor, порядок desktop, общий H мобильной пары, overflow/identity/motion/owner и acceptance boundaries. |
| [Core FI-01–20](system-design-v1.md) | Общая система, C1–C6, occupied-space, scroll/keyboard/layers, Search adapter/A=S=P с current amendments. |
| [RB-01–03](release-bindings-v1.md) | Receipts, served/exposure, frozen prefix/hides/undo, optional analytics OFF и upstream owners. |
| [Consumer matrix](consumer-matrix-v1.md) | Registry consumers; current manifest проверяется перед migration. |
| [FI-P1](implementation-package-1.md) | Existing bounded integration lane, не второй orchestrator. |
| [Historical sources](sources-and-decisions-v1.md) | Прежние reads/evidence и их границы. |
| [Dossier](planned-design-pattern.md), [JSON](planned-pattern.json) | Lifecycle/proposed variants, не release readiness и не native evidence. |

## Артефакты v1.6 и выполненная проверка

В разговоре переданы editable SVG: desktop1440/1920 по4 состояния с stationary right-menu; mobile390/430/320 с равновысокой парой, отдельные frames, layout JSON и HTML viewer/export. Pure primitives/text, без image generation/raster embedding/font files. В схеме64/80px — пример common row height, не approved runtime tokens. На320 дочерний текст переносится без потери смысла, оба острова увеличиваются.

**18 локальных model/XML tests прошли. 50 проверок standalone HTML viewer в локальном Chromium прошли.** Проверяются right anchor/unchanged rect, порядок/gaps, видимый current, membership/overflow, mobile common height/top/radius/wrap, защищённый бренд, editable export и отсутствие external requests/JS errors. Контрольные SVG-отрисовки просмотрены. Это **SCHEMATIC_ONLY**, не Astro/native Penpot/A=S=P и не новый CI итог #638. HTML — переключатель схем, не работающие product filters или проверенная scroll-анимация.

Файлы пакета `popular-nav-correction-v16` переданы в разговоре. Их локальное наличие не объявляется GitHub blobs/public website; эта ветка сохраняет нормативный текст. Предыдущие [v1.5-схемы](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/b3df0b52ea56dd5eeaed8321a1b04119408fcb4b/docs/research/floating-control-islands-2026-08/README.md) с меню посередине и низким mobile-circle больше не определяют целевую компоновку.

## Известные source gaps и отдельный runtime checkpoint

Предыдущее чтение events source **414a9cf103e77345132afc9b08e0147446d6496a** показало exclusion `item.key !== 'popular'` в visibleHeaderNavigation. Это historical observation, не fresh runtime audit текущего v1.6. Перед actual implementation проверить latest EventLayout/Reference4/CSS/feature-gates и восстановить/подтвердить selected popular в действительно видимом menu owner до удаления desktop page-context. Не внедрять иллюстративные gated пункты автоматически.

Ранее проверенный [events#638](https://github.com/onedayonemasterpiece/events-bot-new/pull/638): ea07efaa58d6eb911cfb6cb62914cd8ae10c2dd6 / [run33969915797](https://github.com/onedayonemasterpiece/events-bot-new/actions/runs/33969915797),23 Node+114 browser assertions на July23 fixtures закрыли конкретный city inline-fallback defect. Это не внедрение v1.6. Актуальный PR/HEAD читается заново при продолжении.

[История доступа/артефактов](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/67a39c0a0607206e53675d87204b9fedef6860fe/docs/research/floating-control-islands-2026-08/README.md) сохраняется. Успех GitHub не доказывает доступность Penpot. Новая native страница здесь не создавалась.

## Граница результата

Не менялись runtime/production/root/current/ICS/shared foundations/canonical components/STATUS. Source-bound family/impact/scenario mapping, same-corpus Kaggle interactive preview и native P остаются отдельной интеграцией. Current spec требует проверки menu anchor и common mobile row height вместе с actual full labels/assets/geometry; schematic PNG/SVG не дают A=S=P PASS.

#621 — интеграция и единый publisher, #587 — Search/release, #39 — tracker. Нет второго menu/filter/router и переписывания требований в новый prompt. Первичные research [observations](screen-observations.json), [provenance](source-manifest.json), прежние SVG и [offline model](top-row-model.py) остаются exploration/history, не новыми принятыми токенами.
