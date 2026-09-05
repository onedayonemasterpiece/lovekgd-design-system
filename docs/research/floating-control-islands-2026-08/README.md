# Floating Islands — KenigEvents

Pattern ID: **`pattern.detached-chrome-control-islands`**. Existing owner: [PR #47](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/47). 2026-09-05, **текущая composition revision v1.2**.

## Начать здесь

**Брендовое меню «Полюбить Калининград Анонсы» не меняется.** Оно занимает своё существующее место и не участвует в сжатии/перестановке/state transitions соседних островов. Предложенная в v1.1 замена его на текстовый/glyph trigger отменена прямым уточнением владельца. Собственное existing открытие/закрытие меню сохраняется.

[Актуальный контракт композиции v1.2](top-row-composition-v1.1.md) сохранён по прежнему пути, чтобы существующие ссылки в core/пакетах вели в текущую редакцию. Он имеет приоритет в трёх адресно изменённых вопросах: защищённый бренд, **эквивалентный medallion вместо дублирующего floating title**, отдельная desktop presentation нижнего dock. Остальные FI/RB requirements не отменяются.

| Документ | Область |
|---|---|
| **[Композиция v1.2](top-row-composition-v1.1.md)** | Неизменяемый branded menu; одна contextual row вокруг него; semantic Free identity; прямоугольное раскрытие городов; desktop-specific dock; текущий код/evidence и границы. |
| [Системный core FI-01–20](system-design-v1.md) | Общие roles/C1–C6, occupied-space/scroll/keyboard/layers, Search adapter и A=S=P. Старые разрешения изменить бренд и безусловно сохранить отдельный title читаются с отменяющей v1.2 поправкой, не являются параллельным разрешением. |
| [Release bindings RB-01–03](release-bindings-v1.md) | Receipts, served/exposure, frozen prefix/hides/undo, optional analytics OFF, existing transport/profile ownership. |
| [Матрица consumers](consumer-matrix-v1.md) | Actual registry routes/owners и scenarios; current manifest проверяется перед migration. Вместо ещё одного набора routes v1.2 накладывает новые presentation правила на тех же consumers. |
| [FI-P1](implementation-package-1.md) | Общий порядок исходного slice; scope уточнён v1.2. Частичный draft #638 не объявляется полным выполнением FI-P1. |
| [Исходное evidence](sources-and-decisions-v1.md) | Historical sources и прежние ограниченные browser captures; не сегодняшний production PASS. |
| [Planned dossier](planned-design-pattern.md), [JSON](planned-pattern.json) | Lifecycle/base C1–C6. Proposed registry не deployment manifest и не proof native P. |

## Уже есть исполняемый черновик

[Events PR #638](https://github.com/onedayonemasterpiece/events-bot-new/pull/638), branch `work/floating-islands-owner-preview-20260905`: preview-only код поверх существующих controls, не новый global menu/filter/nav controller. Точная реализация/текущий head/terminal artifacts — в этом PR и [source note](https://github.com/onedayonemasterpiece/events-bot-new/blob/work/floating-islands-owner-preview-20260905/docs/features/static-site-pages/design-system/floating-islands-owner-review.md).

Первый [run33964702848](https://github.com/onedayonemasterpiece/events-bot-new/actions/runs/33964702848) **реально сгенерировал Astro Popular и Free**, затем Chromium снял/проверил390×844,1280×800,1920×1080. 15 unit/source tests отдельно. Artifact ZIP bytes получены и hashes сверены; screenshots лично просмотрены. На Free найден leftover background старого title; следующая source correction добавляет проверки его удаления/границ. Последующий PASS берётся только из соответствующего run, не переносится с первого.

Это **generated-page diagnostics на committed fixture corpus2026-07-23**, не current-real Kaggle publication и не A=S=P. Нет новой публичной интерактивной ссылки или native Penpot. Инструменты my-data-hub/browser/Penpot установлены, но не предоставили callable methods в этом окне. Read-only CI не заменяет единый canonical publisher и не получает owner-release credit.

## Что сохраняется

Четыре primary destinations и единый resolver — одинаковы на desktop/mobile; geometry/иконки/подписи могут отличаться. Mobile dock не обязан расти вместе с desktop. Основное H1 остаётся в документе, даже когда floating page identity представлена одним medallion. City disclosure использует те же checkboxes и немедленное применение; оно не становится глобальным меню.

Проектирование и draft diagnostics разрешены сейчас, без ложного объявления всей нормализации завершённой. Перед интеграцией нужны current source, registry/impact/scenario updates, affected baseline, owner review, exact assets/geometry и release gates. Без real native P нет A=S=P. Общие foundations, production/root/current/ICS и STATUS не изменяются этим пакетом.

#621 владеет runtime integration и Kaggle published-preview; #587 — Search/release interfaces; #39 — tracker. Нового оркестратора/публикационного конвейера нет. Не смешивать 14 исторических offline-model checks, 32+5 planned runtime scenarios и 15 новых source tests с выполненными browser cases.

## Историческая research база

Сохранены без переработки: [screen-observations.json](screen-observations.json), [source-manifest.json](source-manifest.json), [reference board](assets/reference-board.svg), [anatomy](assets/anatomy.svg), ранние [distributed](assets/variant-a-distributed.svg)/[split dock](assets/variant-b-split-dock.svg). Это source-informed/anonymized exploration, не наши accepted screens/tokens. Raw private/third-party screenshots не публикуются.

[Исследование v1.1@eb330959](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/eb3309591be368d729ea52c90b6ef99d1acbad6b/docs/research/floating-control-islands-2026-08/top-row-composition-v1.1.md#2-что-показало-исследование) остаётся обоснованием principled grouping/compaction/reflow, но не отменяет новое прямое указание владельца о бренде. [Offline model](top-row-model.py) — историческая арифметика со synthetic slots, включая теперь **неприменимый к branded menu** compact/glyph пример; не подключать его как production policy.

Цель — меньше смысловых дублей и более удобный контентный интерфейс. Ни количество документов, ни красиво уменьшенный header не заменяет работающие controls и проверку реального preliminary candidate.
