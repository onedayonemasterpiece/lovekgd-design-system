# Floating Islands — KenigEvents

Pattern **`pattern.detached-chrome-control-islands`**, существующий [PR #47](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/47). 2026-09-06. Текущая композиция **v1.8**. Документальная постановка не означает внедрение runtime или native A=S=P.

## Запуск реализации

**[Задача для ручного Codex: все пользовательские архетипы](codex-implementation-all-user-archetypes-20260906.md).** Поручены текущая source integration, executable UI SoT, автотесты, same-corpus проверки и один актуальный опубликованный Kaggle preview. Служебные/lab/diagnostic страницы исключены из продуктового redesign. Сохранение файла не запускает Codex или сборку.

Задача больше прежнего FI-P1: первые stress cases Popular/Weekend/Free/event-detail — начало, не финальная граница. Прочитанный текущий runtime trunk **64f63420754eb702e877da281d9affe13dfd28b6**; [CODE receipt в #621](https://github.com/onedayonemasterpiece/events-bot-new/issues/621#issuecomment-5553304045). Перед работой читать fresh HEAD. Draft#638 ea07 — donor отдельных исправлений/тестов, не база для слепого merge: CODE подтвердил конфликт ownership его city controller с текущей оболочкой.

## Текущий UI-договор

**[Навигация, центрирование и Weekend v1.8](top-row-composition-v1.1.md)** — единое место актуальных UI-решений; старый путь сохранён ради ссылок.

Desktop: неподвижная бирка → контекст → города → постоянное правое меню. H1 уходит с документом; при видимом выбранном пункте меню остров показывает только текущую полку. Меню/города не компактируются заранее: только по фактической нехватке места. Правый anchor сохраняется, ширина может меняться при реальном fit pressure. Current page/выбор/focus не теряются.

**Городская группа центрируется:** до pinning — в собственной контентной строке, после — в оставшемся свободном диапазоне между левым контекстом и правым меню. Не подменять центрирование растягиванием chips или геометрическим центром экрана поверх соседей.

Mobile: без лишней desktop-полосы разделов; немедленное плавное диагональное преобразование в combined page+child island. Соседние города той же высоты/top/bottom; dots сокращают ширину, не высоту. Бренд не меняется. Последовательные полки имеют обратимый handoff, не дублируют навигацию.

**Weekend — отдельный обязательный consumer:** реальные две desktop колонки и range/time navigation. Общие controls формируют одну строку, а day headers сохраняют связь со своими колонками. Стартовый implementation candidate — одинаковые компактные `день · дата`, без дубля `Сб + Суббота`, тяжёлых баннеров или глобального fake-selected Saturday. Обе колонки равноправны; их context не сменяется как последовательные полки Popular. Точные условия и tests в v1.8 §5.

Большая карточка: `Бесплатно · Вход свободный` → `Бесплатно`, но регистрация/ограничения/availability не удаляются. SSR и appended presentation едины. Exact Free medallion-only сохраняет H1/qualifiers/asset-error text fallback. Нижний dock остаётся одним цельным островом; rejected heavy skin не возвращается, будущее macOS-like оформление не утверждается этой постановкой.

## Карта источников

| Документ | Владелец содержания |
|---|---|
| [Композиция v1.8](top-row-composition-v1.1.md) | Последние owner UI-решения и Weekend candidate; приоритет над противоречащими ранними примерами. |
| [Codex implementation task](codex-implementation-all-user-archetypes-20260906.md) | Scope, fresh refs, текущие owners/конфликты, порядок кода, тестов, source-bound проекции и публикации всех пользовательских archetypes. |
| [Core FI-01–20](system-design-v1.md) | Общие роли/geometry/interaction/scroll/layers и Search adapter с текущими amendments. |
| [RB-01–03](release-bindings-v1.md) | Receipts, delivery/exposure/served, profile freeze/hides/undo и optional analytics OFF; upstream owners не копируются. |
| [Consumer matrix](consumer-matrix-v1.md) | Стартовый census; actual current registry/manifest уточняется исполнителем, не вечное число routes. |
| [FI-P1](implementation-package-1.md) | Исторический первый slice, не ограничение нового all-archetypes задания. |
| [Historical sources](sources-and-decisions-v1.md), [dossier](planned-design-pattern.md), [planned JSON](planned-pattern.json) | История источников/lifecycle/proposals; не доказательство текущего release/P readiness. |

## Доказательства и ограничения

В этом ходе прочитаны GitHub refs, latest#621 receipt, actual archetype registry и Weekend owners; **новые runtime/browser/native тесты не запускались**, код сайта/production/foundations/STATUS не менялись. Сохраняются документы и готовая постановка для последующего ручного запуска.

[Предыдущая v1.7 с SVG/model evidence](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/5058b93b1040eda78cb85e102d369d3e1592f0a0/docs/research/floating-control-islands-2026-08/README.md) и [ea07 city repair receipt](https://github.com/onedayonemasterpiece/events-bot-new/pull/638) остаются историей. Их checks не засчитываются новой реализации. Генеративные изображения, где пропущено реальное меню или заменена структура Weekend, не baseline и не visual authority. Рисунки/пиксели из схем не canonical tokens.

Действующий `kenigevents.asp-conformance` остаётся единственным определением A=S=P. Любая implemented A-правка сопровождается соответствующим S/versions/consumers/test изменением, не отложенной «SoT потом». Required P строится существующим materializer как native linked instances на тех же inputs. Недоступный P не прерывает независимую кодовую работу, но остаётся незакрытым доказательством, не объявляется PASS.

#621 — integration и единый Kaggle publisher; #587 — Search/release; #39 — tracker. Никаких новых управляющих контуров, per-page menu/filter forks или альтернативного build/publish pipeline.

Исходные observations/provenance/research SVG и offline model сохраняются как exploration/history. Raw private images и font files не публикуются.
