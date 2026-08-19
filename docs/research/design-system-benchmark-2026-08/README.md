# Comparative design-system benchmark — August 2026

Этот раздел фиксирует сравнительное исследование публичных дизайн-систем и UI-kits, переданных для анализа. Исследование отвечает на три практических вопроса LoveKGD:

1. как оформить **Source of Truth UI**, не превращая Penpot, документацию или runtime в конкурирующие источники истины;
2. как организовать **Penpot Resource Graph** для предметного review владельцем;
3. как перейти от foundations и компонентов к **patterns, page archetypes и product representations**.

## Статус и границы

```text
document_kind: comparative-external-reference-study
status: reviewed-research
observed_at: 2026-08-19
authority_effect: none
component_acceptance: none
family_lifecycle_transition: none
penpot_mutation: none
production_mutation: none
canonical: false
```

Этот корпус не принимает компоненты, токены, variant axes, patterns или page archetypes. Он не заменяет:

- [Component Contract authority](../../component-contract-authority.md);
- [Resource Graph operating contract](../../resource-graph-004.md);
- [family and archetype lifecycle](../../normalization/design-system-family-lifecycle.md);
- [page-archetype requirements](../../page-archetype-requirements.md).

## Исследованный корпус

| Группа | Системы и источники |
|---|---|
| Компонентные библиотеки с design/code связью | Consta, Paradigm/VKUI, Gravity UI, Kontur UI, ViennaUI, Taiga UI, Yandex UI, Elephas |
| Корпоративные design-system portals | T2D2, ISPsystem, Ростелеком, Росатом, HSE |
| Lifecycle и migration cases | Consta deprecated/canary, Alfa `arui-feather`, Taiga major/Figma compatibility, Ростелеком Gen1→Gen2 |
| Pattern/template/archetype references | T2 Block library, Gravity Page Constructor, Taiga Lumbermill, Kontur templates, Ростелеком Patterns, HSE site templates |
| Public standards and specialist guidance | Госдизайн accessibility corpus |
| Design-tool operating model | Figma references из корпуса и актуальная официальная документация Penpot |

Подробная фиксация источников и уровня evidence находится в [source-register.md](source-register.md).

## Figma audit status

Figma MCP позволил ранее провести прямой структурный аудит Consta `GallerySlider`. Во время расширенного исследования обычный MCP quota был исчерпан. После этого для двух отдельно запрошенных Community references выполнен альтернативный read-only pass:

| Reference | Result |
|---|---|
| T2D2 Public — WEB | first-party Community metadata, embed canvas и raw `fig-kiwi` checkpoint прочитаны; structural inventory создан |
| Rosatom | current Community page и embed возвращают 404; доступна только историческая индексная карточка/cover |

Полный результат: [07-direct-figma-readback-t2d2-rosatom.md](07-direct-figma-readback-t2d2-rosatom.md).

Для остальных непрочитанных Figma sources сохраняются исходные ограничения: pixel-level parity, точные counts и component-property claims не делаются без прямого read-back.

## Executive synthesis

### 1. Лучший SoT — не один инструмент, а одна authority model

Зрелые системы связывают несколько поверхностей:

```text
tokens and contracts
→ design library
→ code package
→ documentation and examples
→ tests and release history
→ product templates / page compositions
```

Ошибка возникает, когда каждая поверхность считается самостоятельным SoT. Для LoveKGD нормативным центром остаётся versioned package/contract graph в Git; Penpot — native visual implementation и review surface; runtime — evidence surface.

### 2. Нужна обязательная иерархия ресурсов

Сравнительный корпус устойчиво подтверждает слой между компонентами и страницами:

```text
foundations
→ primitives
→ components
→ patterns / blocks
→ page archetypes / templates
→ product representations
→ runtime routes
```

T2 называет его `Block library`, Gravity — `blocks/sub-blocks` в Page Constructor, Taiga развивает отдельный Lumbermill с templates и dashboards, Ростелеком отделяет Patterns от Components, Kontur публикует специализированные page/template packages.

Direct T2D2 Figma read-back дополнительно показывает обратную сторону: плоский каталог компонентов и product widgets сам по себе ещё не образует page-archetype layer.

### 3. Tokens должны иметь уровни и consumers

Переносимый target:

```text
raw primitives
→ semantic foundation tokens
→ component tokens
→ pattern/archetype tokens only when justified
→ product theme aliases
```

T2 разделяет Foundation UI, component-specific T2D2 UI и product-facing T2D2 Styles. Direct T2D2 checkpoint содержит локальные global/semantic/component/font/design sets и значительный imported-library graph. Paradigm хранит общие cross-platform tokens в repository и связывает names с Figma Variables. Vienna разделяет tokens, primitives, themes и UI packages. Ростелеком отделяет engine Atomaro от brand themes.

### 4. Component page должна быть dossier, а не showroom

Минимальный dossier:

```text
identity and authority
purpose and selection
default specimen
anatomy and slots
variants and valid combinations
states and behavior
themes and responsive rules
content design
accessibility
code API
fixtures and product use
tests and evidence
status, version, migration and owner
```

Consta, Paradigm, Gravity, Ростелеком, Kontur и direct T2D2 file подтверждают разные части этой модели. LoveKGD должен собирать их вокруг одного Component Contract tuple.

### 5. Visual maturity не равна implementation maturity

Качественный Figma/Penpot sheet может относиться к deprecated, canary, design-only, unbound, historical или снятому с публикации resource. Это видно на deprecated Consta Android/iOS files, старой Figma Taiga, archived Alfa `arui-feather`, Ростелеком Gen1 и текущей недоступности Rosatom Community file.

Каждая визуальная сущность LoveKGD должна показывать exact lifecycle, version, binding status и source-availability state.

### 6. Variants описывают одну identity, а не скрывают разные компоненты или версии

Component set допустим только когда anatomy, semantics и ownership остаются одной identity. Distinct patterns, domain behaviors, page compositions и contract versions нельзя маскировать variant axis.

Direct T2D2 read-back показывает, что `Ver.` присутствует почти в половине component sets. Для LoveKGD version остаётся contract/package metadata, а не variant property.

### 7. Product examples должны быть source-proven fixtures

Для LoveKGD каждый пример получает:

```text
fixture_id
source/context reference
component/pattern/archetype version
state_key
viewport/container
expected behavior
evidence status
```

### 8. Review должен быть встроенным lifecycle

Paradigm формализует design review через темы, target widths, реальные данные, flows, interaction и system states. T2D2 показывает полезную linked-navigation/public-review surface. Penpot review model LoveKGD расширяет это exact identity, comments, receipts и conformance.

### 9. Page archetype — versioned composition contract

Архетип фиксирует user/job outcome, semantic regions, allowed graph, responsive branches, page states, content stress, navigation, accessibility, product representations и migration.

### 10. Documentation, tests и machine-readable data должны расходиться fail-closed

Если variant/state есть только в одной surface, resource считается неполным. Registry, docs, specimens, tests и review matrix должны генерироваться или валидироваться из одной contract model.

### 11. Versioning, deprecation, availability и supersession должны быть видимыми

Сильные patterns: current/LTS/unsupported, stable/canary/deprecated, Gen1/Gen2, explicit deprecation runway, superseded docs banner, release history и current source availability.

### 12. Ownership и support — часть продукта дизайн-системы

Dossier и archetype page обязаны показывать owner, review channel, last-reviewed date, open blockers и support route.

### 13. Naming is a governed interface

Direct T2D2 checkpoint reveals real-world axis and value drift (`State/state`, multiple `Variant` and `Platform` labels, casing and spelling differences). Designer-friendly labels may remain expressive, but canonical IDs, axes and values must pass a fail-closed naming registry.

## Состав результата

- [01-system-profiles.md](01-system-profiles.md) — profiles всех переданных систем и границы evidence;
- [02-pattern-matrix.md](02-pattern-matrix.md) — сравнительная матрица и повторяющиеся patterns;
- [03-sot-ui-architecture.md](03-sot-ui-architecture.md) — target SoT architecture для LoveKGD;
- [04-penpot-review-model.md](04-penpot-review-model.md) — правила оформления Resource Graph и review;
- [05-page-archetype-model.md](05-page-archetype-model.md) — contract model архетипов страниц;
- [06-adopt-adapt-avoid.md](06-adopt-adapt-avoid.md) — приоритеты adoption и anti-patterns;
- [07-direct-figma-readback-t2d2-rosatom.md](07-direct-figma-readback-t2d2-rosatom.md) — direct public Figma metadata/canvas/checkpoint evidence;
- [source-register.md](source-register.md) — provenance и evidence grade;
- [Design-system development control v0.1](../../roadmaps/design-system-development-control-v0.1.md) — управляющий документ доработки;
- [`design-system-development-control.v0.1.json`](../../../contracts/design-system-development-control.v0.1.json) — machine-readable candidate plan.

## Controlling conclusion

```text
exact source and product need
→ family hypothesis and Component Contract
→ canonical code candidate
→ native Penpot candidate
→ component conformance
→ pattern contract
→ page archetype contract
→ product representations
→ owner review and corrections
→ bounded promotion
```

Research completeness, Penpot completeness, external-reference polish и owner review не сокращают нормативный 11-state lifecycle и сами по себе не разрешают implementation.
