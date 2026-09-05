# Floating Islands — KenigEvents

Pattern **`pattern.detached-chrome-control-islands`**, существующий [PR #47](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/47). 2026-09-05. Текущая документальная composition revision **v1.5**. Runtime, визуальная приёмка и native A=S=P — отдельные проверяемые результаты.

## Текущий договор

**[Навигация и контекст v1.5](top-row-composition-v1.1.md)** — единственный владелец последних адресных изменений; путь сохранён для входящих ссылок.

| Режим | Где пользователь видит название страницы | Состав плавающего контекста |
|---|---|---|
| Desktop с видимой навигацией | В выделенном пункте «Популярное» среди «Сегодня / Завтра / Выходные / …» | **Только текущая полка**, например «Набирают популярность». Не повторять «Популярное» ещё раз. |
| Mobile без полосы desktop-навигации | В основном тексте контекстного острова | **Одна поверхность, две надписи:** «Популярное» + дочерняя полка. Города отдельно. |
| Тесный desktop | Активный пункт оставлен видимым; допустим trigger «Популярное ▾» | Shelf-only допустим пока page identity реально видна. Безымянная кнопка/скрытый active item не заменяют название. |

До прокрутки desktop сохраняет обычный H1 и **развёрнутый ряд городских вариантов**, а не один закрытый dropdown. После — меню, контекст полки и города формируют один ряд при достаточной геометрии. Часть городов/неактивных destinations может перейти в явно разные раскрытия «Ещё города» / «Ещё разделы»; «Популярное» не прячется. Смена полки не меняет текущую страницу или выбор городов.

На mobile нет дополнительной полосы «Сегодня / Завтра / Выходные / Популярное». Двойной остров сохраняет два начертания внутри одной поверхности. Page-title morph начинается с первых пикселей и движется диагонально без отдельного горизонтального этапа; desktop H1 не создаёт duplicate floating label там, где active navigation уже обозначает страницу. Полка сменяется в собственном slot, обратимо, не превращает каждый H2 в дополнительный sticky этаж.

Кожаная бирка **не меняется** из-за соседней компоновки. Нижний dock — один цельный остров; тяжёлая rejected skin не возвращается, будущее macOS-like оформление не принимается этой схемой. Exact Free medallion equivalence/text fallback, original city controls и FI/RB guarantees сохраняются.

## Конкретное расхождение с прочитанным runtime

На events-bot-new **414a9cf103e77345132afc9b08e0147446d6496a** массив HEADER_NAVIGATION содержит popular, но visibleHeaderNavigation исключает `item.key !== 'popular'`. Поэтому прежде чем убрать desktop page-context, нужно вернуть видимый selected popular **в действительно отображаемый existing navigation view**, а не только исправить концепт. Проверить связанные CSS/Reference4 branches и feature-gated пункты. Этот ход не менял runtime; отсутствие active item не объявляется исправленным.

## Карта источников

| Документ | Ответственность |
|---|---|
| [Композиция v1.5](top-row-composition-v1.1.md) | Desktop/mobile identity, конкретные состояния, навигация/города/переполнение, current-source gap, required actual tests. |
| [Core FI-01–20](system-design-v1.md) | Roles/C1–C6, occupied-space, scroll/keyboard/layers, Search adapter и A=S=P; с адресными поправками current composition. |
| [Release bindings RB-01–03](release-bindings-v1.md) | Receipts, served/exposure, frozen prefix/hides/undo, optional analytics OFF и existing upstream owners. |
| [Consumer matrix](consumer-matrix-v1.md) | Actual registry routes/owners; перед migration проверить current manifest. |
| [FI-P1](implementation-package-1.md) | Existing bounded integration lane; current composition уточняет видимое поведение, не запускает отдельного оркестратора. |
| [Historical sources](sources-and-decisions-v1.md) | Прочитанные в прежних итерациях facts и их доказательная граница. |
| [Dossier](planned-design-pattern.md), [planned JSON](planned-pattern.json) | История lifecycle/proposed variants, не текущая release readiness или native evidence. |

## Артефакты v1.5

В разговоре переданы editable SVG-схемы **desktop1440 и1920**, по4 состояния; mobile390 — отдельный сравнительный SVG. Использованы реальные названия navigation registry и условные content/city specimens; никакой image generation или raster embedding. Самостоятельный HTML переключает эти состояния/размеры и экспортирует выбранный SVG. Это **просмотрщик схем, не scroll-анимация продукта и не настоящий filter**.

Прошли12 проверок XML/model invariants, внутренние контрольные отрисовки просмотрены. Проверены полное исходное меню, visible active item, сохранённые overflow destinations/cities, непересекающийся общий ряд и отсутствие duplicate floating page title на desktop. Эти результаты не являются CI Astro/OS keyboard/native P. SVG/HTML переданы файлами разговора; Markdown commit не выдаётся за загрузку их bytes в Git.

Предыдущая [v1.4](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/ee41396f40addbfae8084e3d7838af9b187f40d9/docs/research/floating-control-islands-2026-08/README.md) и её artifacts сохраняются как история. Generated raster boards, где потеряно меню и/или добавлены чужие разделы, **не являются требованиями к реализации**.

## Отдельный исторический runtime checkpoint

[Events#638](https://github.com/onedayonemasterpiece/events-bot-new/pull/638), ранее проверенный source ea07efaa58d6eb911cfb6cb62914cd8ae10c2dd6 / [run33969915797](https://github.com/onedayonemasterpiece/events-bot-new/actions/runs/33969915797):23 Node +114 browser assertions закрыли city inline-fallback defect на July23 fixtures, DIAGNOSTIC_PASS_NOT_ACCEPTANCE. Это не внедрение новой v1.5 identity policy. Current PR/HEAD прочитывается заново при продолжении.

[Прежняя запись о доступах и артефактах](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/67a39c0a0607206e53675d87204b9fedef6860fe/docs/research/floating-control-islands-2026-08/README.md) остаётся историей. Успешный GitHub write не доказывает доступность Penpot. Новая Penpot страница этим ходом не создана.

## Границы

Runtime/production/root/current/ICS, shared foundations, canonical components и STATUS не менялись. Требуется согласование current shell/heading/navigation ownership, actual measured views и source-bound S/P на одном corpus/clock/assets. Public Kaggle preview/native P/нормализация не объявляются завершёнными. #621 — integration и единый publisher; #587 — Search/release; #39 — tracker. Не добавлять второй menu/filter/router или переписывать весь контракт в новый prompt.

Исходные [observations](screen-observations.json), [provenance](source-manifest.json), исследовательские SVG и [offline model](top-row-model.py) сохраняются как history/exploration, а не принятые токены. Частная исходная графика/шрифты не публикуются.
