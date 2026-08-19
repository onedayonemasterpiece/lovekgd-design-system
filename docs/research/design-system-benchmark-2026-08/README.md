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

## Ограничение Figma-аудита

Figma MCP позволил ранее провести прямой структурный аудит Consta `GallerySlider` и связанных страниц. Во время текущего расширенного исследования лимит Figma MCP был исчерпан. Поэтому:

- внутренние структуры новых Figma Community files не описываются как напрямую наблюдённые;
- выводы по VK/Paradigm, T2, ISPsystem и другим системам опираются на их официальные сайты, repositories, Storybook и first-party публикации;
- пользовательские Figma links сохранены в source register как обязательные targets для следующего bounded visual pass;
- pixel-level parity, точные counts, component-property names и качество конкретных Community files не заявляются без read-back.

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

### 3. Tokens должны иметь уровни и consumers

Переносимый target:

```text
raw primitives
→ semantic foundation tokens
→ component tokens
→ pattern/archetype tokens only when justified
→ product theme aliases
```

T2 разделяет Foundation UI, component-specific T2D2 UI и product-facing T2D2 Styles. Paradigm хранит общие cross-platform tokens в repository и связывает names с Figma Variables. Vienna разделяет tokens, primitives, themes и UI packages. Ростелеком отделяет engine Atomaro от brand themes.

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

Consta, Paradigm, Gravity, Ростелеком и Kontur подтверждают разные части этой модели. LoveKGD должен собирать их вокруг одного Component Contract tuple.

### 5. Visual maturity не равна implementation maturity

Качественный Figma/Penpot sheet может относиться к deprecated, canary, design-only или unbound resource. Это видно на deprecated Consta Android/iOS files, старой Figma Taiga, archived Alfa `arui-feather` и Ростелеком Gen1.

Каждая визуальная сущность LoveKGD должна показывать exact lifecycle, version и binding status.

### 6. Variants описывают одну identity, а не скрывают разные компоненты

Component set допустим только когда anatomy, semantics и ownership остаются одной identity. Distinct patterns, domain behaviors и page compositions нельзя маскировать variant axis.

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

Paradigm формализует design review через темы, target widths, реальные данные, flows, interaction и system states. Penpot review model LoveKGD расширяет это exact identity, comments, receipts и conformance.

### 9. Page archetype — versioned composition contract

Архетип фиксирует user/job outcome, semantic regions, allowed graph, responsive branches, page states, content stress, navigation, accessibility, product representations и migration.

### 10. Documentation, tests и machine-readable data должны расходиться fail-closed

Если variant/state есть только в одной surface, resource считается неполным. Registry, docs, specimens, tests и review matrix должны генерироваться или валидироваться из одной contract model.

### 11. Versioning, deprecation и supersession должны быть видимыми

Сильные patterns: current/LTS/unsupported, stable/canary/deprecated, Gen1/Gen2, explicit deprecation runway, superseded docs banner и release history.

### 12. Ownership и support — часть продукта дизайн-системы

Dossier и archetype page обязаны показывать owner, review channel, last-reviewed date, open blockers и support route.

## Состав результата

- [01-system-profiles.md](01-system-profiles.md) — profiles всех переданных систем и границы evidence;
- [02-pattern-matrix.md](02-pattern-matrix.md) — сравнительная матрица и повторяющиеся patterns;
- [03-sot-ui-architecture.md](03-sot-ui-architecture.md) — target SoT architecture для LoveKGD;
- [04-penpot-review-model.md](04-penpot-review-model.md) — правила оформления Resource Graph и review;
- [05-page-archetype-model.md](05-page-archetype-model.md) — contract model архетипов страниц;
- [06-adopt-adapt-avoid.md](06-adopt-adapt-avoid.md) — приоритеты adoption и anti-patterns;
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

Research completeness, Penpot completeness и owner review не сокращают нормативный 11-state lifecycle и сами по себе не разрешают implementation.
