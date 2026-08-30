# Consta design-system presentation reference — August 2026

Этот раздел фиксирует структурный разбор оформления компонентов Consta в Figma, документационном стенде и исходном репозитории. Цель — перенести сильные паттерны в LoveKGD Design System, не копируя визуальный язык Consta и не меняя действующий component authority.

## Статус и границы

```text
document_kind: external-reference-study
status: reviewed-research
observed_at: 2026-08-19
authority_effect: none
component_acceptance: none
penpot_mutation: none
production_mutation: none
```

Материал является research input. Он не принимает компоненты, variants, tokens, naming или page archetypes; не переводит ни одно семейство по lifecycle; не заменяет [Component Contract authority](../../component-contract-authority.md), [Resource Graph operating contract](../../resource-graph-004.md) и [family lifecycle](../../normalization/design-system-family-lifecycle.md).

## Главный вывод

Сильная сторона Consta — не отдельный красивый component sheet, а связанный **component dossier**:

```text
назначение и выбор компонента
+ визуальная система вариантов и состояний
+ правила применения и контент-дизайна
+ инженерный API и интерактивные примеры
+ код, тесты, sandbox и Figma deep link
+ status, version, aliases и support
```

Для LoveKGD этот паттерн нужно адаптировать к более строгой модели authority. В каждом dossier сначала показываются identity, lifecycle state, `canonical`, bindings и evidence, а уже затем визуальные specimens.

## Исследованные источники

| Источник | Что проверено | Метод и provenance |
|---|---|---|
| [Consta Components — Community](https://www.figma.com/design/0Zym9QbjtLvJUFMkpqRBE1/Consta-Components--Community-?node-id=2233-99065) | `GallerySlider`, три темы, variant matrix, supporting components, product examples, source links и support block | Figma MCP metadata, file key `0Zym9QbjtLvJUFMkpqRBE1`, node `2233:99065`, 2026-08-19 |
| [Consta UI Kit — Community](https://www.figma.com/community/file/853774806786762374/consta-ui-kit) | официальный UI-kit boundary и per-component Figma binding | подтверждено официальным README и `standConfig.ts`; Button deep link указывает на file key `v9Jkm2GrymD277dIGpRBSH`, node `9601:151` |
| [consta-design-system/uikit](https://github.com/consta-design-system/uikit) | library IA, component colocation, documentation tabs, metadata, status, aliases, examples и tests | branch `dev`; inspected file blobs перечислены в [01-observed-patterns.md](01-observed-patterns.md) |
| [Consta UI Kit stand](https://consta.design/libs/uikit) | связь каталога, документации, параметров, Figma и sandbox | официальный stand URL из репозитория Consta; структура дополнительно подтверждена source config |
| LoveKGD repository | authority, lifecycle, Resource Graph pages и research conventions | `main` на момент начала работы; изменения изолированы в research branch |

## Что переносим

1. **Один компонент — один dossier для нескольких аудиторий.** Обзор, дизайн, правила применения, API, sandbox и evidence должны быть связаны одной identity.
2. **Контекст раньше матрицы.** Сначала назначение, критерии выбора и ограничения, затем default specimen и варианты.
3. **Явные axes и defaults.** Variant/state dimensions показываются как именованные свойства, default отмечается, invalid combinations не маскируются отсутствием примера.
4. **Темы и modes проверяются системно.** Сравнительные snapshots полезны для review, но их следует генерировать из variables/modes, а не поддерживать как независимые копии.
5. **Compound component раскрывается по частям.** Anatomy, slots, nested components и supporting primitives документируются отдельно от итоговой композиции.
6. **Продуктовые fixtures обязательны.** После isolated specimens показываются реальные контексты, stress content, responsive states и prohibited usage.
7. **Design–code discoverability.** Version, maturity, aliases, package import, code path, design node, sandbox и support доступны в заголовке dossier.
8. **Документация живёт рядом с implementation и tests.** Это уменьшает drift и позволяет валидировать coverage в CI.
9. **Content guidance — отдельный контрактный слой.** Тексты, длины, терминология, локализация и недопустимые формулировки не должны теряться внутри props table.
10. **Deprecation видима в каталоге.** Старый компонент остаётся находимым, но ведёт к replacement и migration path.

## Что адаптируем, а не копируем

| Паттерн Consta | Адаптация для LoveKGD |
|---|---|
| `stable / canary / deprecated` | компактный display badge поверх точного 11-state lifecycle; display status не меняет authority |
| Figma deep link в metadata | Penpot binding + exact contract/package/source identities + accepted export/evidence refs |
| theme frames side by side | generated review snapshots из canonical modes; один authoring source |
| component examples | source-proven fixtures с `fixture_id`, viewport/container и consumer context |
| props table | contract-derived axes, valid/invalid combinations, defaults и migration semantics |
| sandbox | isolated Astro specimen, interaction/a11y checks и three-way conformance capsule |

## Что не переносим

- Figma как самостоятельный источник истины;
- независимые копии одного component master для каждой темы;
- полный Cartesian product вариантов без product evidence;
- design-only component без видимого implementation binding и maturity status;
- декоративные product mockups без fixture provenance;
- naming, который расходится между Figma properties, code props, test keys и documentation anchors;
- автоматическое повышение authority вследствие полноты или красоты документации.

## Навигация

| Документ | Назначение |
|---|---|
| [01 — Наблюдаемые паттерны Consta](01-observed-patterns.md) | evidence ledger по Figma, stand, source и tests; сильные стороны и риски |
| [02 — Candidate standard для LoveKGD](02-lovekgd-documentation-standard.md) | предлагаемая структура component dossier, visual page и catalog metadata |
| [03 — План внедрения](03-adoption-roadmap.md) | безопасное встраивание в текущий Resource Graph и family lifecycle |
| [Component dossier template](templates/component-dossier-template.md) | копируемый Markdown-шаблон для family-scoped документации |
| [Component page readiness checklist](templates/component-page-readiness-checklist.md) | проверка identity, design, behavior, accessibility, code, evidence и migration |

## Решение, предлагаемое к отдельному review

Использовать **Component Dossier Standard v0.1** как documentation-only candidate:

```text
Component Contract remains authority
→ dossier renders/explains the contract
→ Penpot page visualizes the same identity and evidence
→ code specimen exercises the same state/fixture tuple
→ CI checks documentation completeness and binding parity
```

До отдельного принятия этот standard не является canonical contract и не разрешает Penpot materialization или family promotion.

## Ограничения исследования

Figma MCP Starter quota завершилась после структурного чтения прямого `GallerySlider` node. Поэтому выводы по этому node основаны на полном metadata tree, именах variants, hierarchy и links, но не являются pixel-level visual audit. Официальный Community UI Kit подтверждён source-of-record Consta repository и его exact per-component Figma bindings; исчерпывающий обход всех страниц Community file не заявляется.
