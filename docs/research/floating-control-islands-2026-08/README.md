# Floating Islands — KenigEvents

Pattern **`pattern.detached-chrome-control-islands`**, existing owner [PR #47](https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/47). 2026-09-05, current composition **v1.3**.

## Начать здесь: последние решения владельца

**Нижний остров один цельный, стилистически ближе к macOS. Не отдельные острова-иконки или плитки.** Широкий desktop-вариант с тяжёлой рамкой отклонён и удалён из draft #638. Прежнее оформление восстановлено; новая Mac-like skin пока направление для последующего review, не реализованный или принятый дизайн.

**Брендовое меню «Полюбить Калининград Анонсы» не меняется:** не сжимается и не переставляется по состояниям соседних островов; его собственное существующее управление сохраняется. Остальные contextual islands компонуют вокруг его реального места. Exact Free может использовать canonical медальон вместо дублирующего floating title, сохраняя H1 и richer-scope qualifiers. Города раскрывают исходный fieldset в прямоугольнике с реальным восстановлением после resize/fallback.

| Документ | Ответственность |
|---|---|
| **[Актуальная композиция v1.3](top-row-composition-v1.1.md)** | Последние owner corrections, один нижний остров, защищённый бренд, эквивалентный medallion, city-panel lifecycle и текущая граница source/acceptance. Имя файла сохранено ради входящих ссылок. |
| [Core FI-01–20](system-design-v1.md) | Общие roles/C1–C6, occupied-space, scroll/keyboard/layers, Search adapter и A=S=P. Старые разрешения менять бренд/сохранять rejected skin перекрыты актуальной composition revision. |
| [Release bindings RB-01–03](release-bindings-v1.md) | Честные receipts, served/exposure, frozen prefix/hides/undo, optional analytics OFF; existing transport/profile authority. |
| [Матрица consumers](consumer-matrix-v1.md) | Реальные registry routes/owners/scenarios. Current release manifest проверяется перед migration; нет второй таблицы маршрутов. |
| [Первый пакет FI-P1](implementation-package-1.md) | Общий порядок bounded integration. Частичный #638 не равен полному FI-P1; актуальные owner corrections имеют приоритет. |
| [Источники исходного дизайна](sources-and-decisions-v1.md) | Historical source/public/browser evidence с его собственными датами и ограничениями. |
| [Dossier](planned-design-pattern.md), [JSON](planned-pattern.json) | Lifecycle и proposed variants, не production manifest/доказательство native P. |

## Исполняемая работа и текущий честный результат

[Draft events #638](https://github.com/onedayonemasterpiece/events-bot-new/pull/638), `work/floating-islands-owner-preview-20260905`. Последняя сохранённая source revision **30a0c977362a4e791c9f5a83d8c7def534d6f3c1**. Rollback rejected dock — **be4a15d1…**, [run33966294014](https://github.com/onedayonemasterpiece/events-bot-new/actions/runs/33966294014) passed focused generated-page diagnostics.

На30a0c977 реализованы city-panel resize/recovery, original fieldset/selection/focus preservation, cleanup, lane-aware obstacles и Free image-error text fallback. [Run33966645022](https://github.com/onedayonemasterpiece/events-bot-new/actions/runs/33966645022) **частично не прошёл**: 22 Node checks и обычные Popular/Free browser cases прошли, Free recovery7/7, Popular recovery27/28. При искусственно отключённом Popover API inline rectangle конфликтует с horizontal/sticky rail, реальный outside click не проходит. Этот отрицательный результат сохранён; тест не ослаблялся.

Поправка CSS для этого случая подготовлена, но её `GitHub.create_tree` запись заблокирована OpenAI safety-status validation. **Она не закоммичена и не проверена.** Другой путь записи не использовался. Точная граница: [#638 comment5551914914](https://github.com/onedayonemasterpiece/events-bot-new/pull/638#issuecomment-5551914914). Обновлённое описание PR содержит final receipt и artifact hashes; старые PASS-скриншоты rejected skin не являются текущей приёмкой.

Generated pages — настоящий Astro через existing `local:focused`, но на committed fixture2026-07-23. Это не свежий September corpus, не public Kaggle preview, не нативная OS-клавиатура и не A=S=P. Read-only CI не создаёт второго publisher. my-data-hub/browser/Penpot не предоставили callable methods в этом окне.

## Открытые интеграционные границы

Прочитан actual trunk46fc5268… с параллельной top-band/menu implementation, не слит в draft. Нужно согласовать owners с защищённым брендом, завершить единую верхнюю композицию, family/impact/scenario registration, current-corpus Kaggle preview и required native conformance. Не накладывать конкурирующие controllers и не отменять crop/full-pool изменения других задач.

Один источник A=S=P остаётся active conformance contract. Без actual native P нет PASS. Production/root/current/ICS/shared foundations/STATUS не меняются этой lane. #621 — integration и единый Kaggle путь; #587 — Search/release; #39 — tracker. Ни нового оркестратора, ни нового глобального меню/фильтра/профиля не создаётся.

## Сохранённая исследовательская история

[screen-observations.json](screen-observations.json), [source-manifest.json](source-manifest.json), [reference board](assets/reference-board.svg), [anatomy](assets/anatomy.svg), [distributed](assets/variant-a-distributed.svg)/[split dock](assets/variant-b-split-dock.svg) остаются exploration, не accepted screens/tokens. Raw private/third-party screenshots не публикуются.

[Исследование v1.1@eb330959](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/eb3309591be368d729ea52c90b6ef99d1acbad6b/docs/research/floating-control-islands-2026-08/top-row-composition-v1.1.md#2-что-показало-исследование) обосновывает grouping/compaction/reflow, но не отменяет owner corrections. [Offline model](top-row-model.py) — историческая synthetic geometry; его теперь неприменимый branded-menu compact example не подключать как runtime policy.

Технический PASS, visual approval, source integration и опубликованный продукт — разные факты. Цель — работающий чистый интерфейс, не число документов или формально зелёных проверок.
