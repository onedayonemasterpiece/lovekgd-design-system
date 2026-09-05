# Floating Islands — KenigEvents

Pattern **`pattern.detached-chrome-control-islands`**, существующий [PR #47](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/47). 2026-09-05. Текущая документальная composition revision **v1.7**. Runtime, visual acceptance и native A=S=P — отдельные результаты.

## Текущий договор

**[Навигация и контекст v1.7](top-row-composition-v1.1.md)** — единое место последних адресных изменений, без нового хронологического дубля требований.

**Не сжимать desktop-меню заранее.** До прокрутки оно полное, когда помещается в нынешней композиции. Будущее появление других островов в верхней строке не является основанием скрыть пункты на первом экране. Постоянен правый край меню; ширина/профиль могут измениться только при actual fit pressure. Требование v1.6 «одинаковый профиль на первом и самом плотном экране» отменено.

После закрепления порядок сохраняется: **бирка → текущая полка → города → меню с выделенным «Популярное» у правого края**. Сначала сохраняется полный nav, затем по необходимости сокращаются города; nav overflow допустим лишь если читаемая минимальная city presentation тоже не помещается. Это не правило скрыть города всегда: при достаточной ширине остаются прямые варианты или весь набор. Активная страница/выбор/действия не теряются, held/focused controls не подменяются.

| Режим | Название страницы | Плавающий контекст |
|---|---|---|
| Desktop с видимым right-menu | Обычный H1 уезжает вверх с документом; page identity остаётся в selected «Популярное» меню | **Только текущая полка**. Нет второго floating «Популярное». |
| Mobile | С первых пикселей H1 label плавно и диагонально превращается в остров | **Одна combined surface: страница + полка**. Города рядом той же высоты; никакой дополнительной desktop-nav полосы. |
| Тесный desktop без visible identity | Нужен visible named current trigger либо combined identity | Shelf-only недопустим при безымянно скрытой текущей странице. |

**Большая карточка:** `Бесплатно · Вход свободный` сокращается до **`Бесплатно`**. Регистрация, временные/аудиторные ограничения, закрытый доступ, платный вход на площадку и неизвестные условия не удаляются вместе с тавтологией. Нужна единая presentation для SSR и подгружаемых EventCard, а не CSS скрытие или глобальная подмена источников/описаний. Полный договор и реальные source dependencies — §5–6 owning specification.

Mobile context/city сохраняют общие верх/низ, совместимый radius/material; точки обычного размера и сокращают ширину, не высоту. При необходимом wrap растут оба. Бренд не переставляется/не компактируется от соседей. Нижний dock — один цельный остров; rejected heavy skin не возвращается, новое macOS-like оформление не утверждается этой схемой.

## Карта источников

| Документ | Ответственность |
|---|---|
| [Композиция v1.7](top-row-composition-v1.1.md) | Current-state fit, right anchor, desktop/mobile H1 behavior, city overflow, короткая free-card label и границы реализации. |
| [Core FI-01–20](system-design-v1.md) | Roles/C1–C6, occupied-space, scroll/keyboard/layers, Search adapter/A=S=P с текущими owner amendments. |
| [RB-01–03](release-bindings-v1.md) | Receipts, served/exposure, frozen prefix/hides/undo, optional analytics OFF и существующие upstream owners. |
| [Consumer matrix](consumer-matrix-v1.md) | Actual registry routes/owners; latest manifest проверяется перед integration. |
| [FI-P1](implementation-package-1.md) | Existing bounded source-integration lane, не новая orchestration задача. |
| [Historical sources](sources-and-decisions-v1.md) | Исторические checked facts с их датами и evidence boundaries. |
| [Dossier](planned-design-pattern.md), [planned JSON](planned-pattern.json) | Lifecycle/proposals, не текущая release readiness/native evidence. |

## Артефакты и личные проверки v1.7

Editable SVG: desktop1280/1440/1920 по4 состояния, individual frames, mobile320/390/430 с прежней равной высотой пары. Исходный desktop показывает полный nav и ряд городов. В данной модели1440/1920 сохраняют full nav и после закрепления; при1280 возникает actual shared-row deficit и допускается overflow. При2320 все примеры помещаются. Числа — specimen inputs, не breakpoints/tokens.

В schematic EventCard уже короткое «Бесплатно»; карточки/цены — примеры, не факты реальной афиши. Standalone HTML переключает/экспортирует векторные состояния, не реализует product filters или непрерывную scroll-анимацию.

**24 XML/model tests и77 standalone browser-viewer checks прошли.** Проверены полнота исходного nav, actual justification перед collapse, right anchor, отсутствие compaction при достаточном месте, H1 desktop/mobile distinctions, membership/current, mobile heights, короткая label и отсутствие внешних запросов/JS errors/raster embedding. Desktop initial/pinned кадры просмотрены. Это **SCHEMATIC_ONLY**, не CI Astro/native-P acceptance. Пакет разговора `popular-nav-correction-v17`; эти Markdown commits не загружают SVG/HTML bytes в Git автоматически.

## Source continuity и честная граница

В текущем ходе прочитан draft#638 `ea07efaa…`: EventCard SSR отображает `eventAdmissionLabel(event)` в `[data-card-status]` и использует status также в share metadata. Найден dynamic fill того же поля в EventLayout. При реализации карточной подписи необходимо согласовать обе ветви и не менять полный доменный статус других surfaces. **Runtime-formatter в этой проектной итерации ещё не изменён.**

Историческое чтение executable414a9cf… выявляло исключение popular из visibleHeaderNavigation. Это не новое чтение latest integration; перед убиранием desktop floating title нужно fresh-read настоящего navigation/Reference4/CSS owner и восстановить/подтвердить видимый selected item. Feature-gated «Клубы» не включаются в production из-за illustrative SVG.

[Events#638](https://github.com/onedayonemasterpiece/events-bot-new/pull/638) ea07 / run33969915797 — исторический проверенный city-fallback repair на July23 fixtures. Его23 Node/114 browser counts не относятся к новой policy меню или цены. Ссылки на прежние normative revisions и артефакты доступны через Git history; v1.6 initial collapsed menu больше не руководство.

Runtime/production/root/current/ICS, shared foundations/canonical components/STATUS в этом ходе не менялись. Actual source/SoT integration, актуальный same-corpus Kaggle preview и native P остаются открытыми. Изменение A должно сопровождаться тем же label/layout decision в S и обязательными проверками P; документы/схемы не подменяют этого результата. #621 — integration/publisher, #587 — Search/release, #39 — tracker.

Исходные observations/provenance/research SVG и offline model сохраняются как history/exploration, не принятые tokens. Нет image generation, добавочных навигационных владельцев, нового фильтра или раздачи font files.
