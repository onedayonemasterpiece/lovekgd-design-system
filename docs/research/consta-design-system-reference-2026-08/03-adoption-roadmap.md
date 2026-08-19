# 03 — План внедрения Component Dossier Standard

## Цель

Встроить лучшие presentation patterns Consta в существующую архитектуру LoveKGD так, чтобы документация:

- улучшала discoverability и принятие решений;
- не создавала параллельный source of truth;
- не опережала family lifecycle;
- связывала design, code, fixtures, tests и evidence;
- масштабировалась по resource families, patterns и archetypes.

## Неизменяемые ограничения

На всех этапах остаются в силе:

```text
no automatic component acceptance
no automatic family merge/split
no Figma/Penpot-only authority
no canonical=true before terminal promotion
no documentation completeness as conformance evidence
no screenshot-only acceptance
no detached accepted component copies
```

## Этап 0 — Review исследования и standard boundary

### Действия

1. Review [наблюдаемых паттернов](01-observed-patterns.md).
2. Отдельно принять, исправить или отклонить [candidate standard](02-lovekgd-documentation-standard.md).
3. Зафиксировать, является ли standard:
   - research only;
   - accepted documentation contract;
   - input для machine schema pilot.
4. Назначить owner для terminology, metadata и documentation UX.

### Выход

Decision record со статусом standard, без решений по component families.

### Gate

Не допускается формулировка, связывающая принятие standard с `CANDIDATE_CONTRACT_ACCEPTED` или promotion любого компонента.

## Этап 1 — Machine-readable documentation metadata

### Действия

Создать candidate schema для header и catalog card, повторно используя authoritative поля Component Contract, а не дублируя их вручную.

Предлагаемый boundary:

```text
contract fields
  component_id, version, axes, states, bindings, lifecycle, canonical

presentation fields
  display_name, summary, aliases, reading order, owner display,
  support link, documentation sections, generated-view configuration

computed fields
  display_status, coverage summary, blockers, last evidence date
```

### Checks

- presentation metadata не может переопределить contract truth;
- `display_status` вычисляется fail-closed;
- missing bindings видимы как blockers;
- aliases не изменяют stable identity;
- external links имеют source and observed date;
- schema запрещает `canonical: true` без authoritative terminal state.

### Выход

Candidate schema, validator и negative fixtures. Penpot mutation не требуется.

## Этап 2 — Выбор pilot family

Pilot выбирается не по визуальной простоте и не по известности компонента.

### Обязательные критерии

- family существует в current analytical registry;
- есть exact source identity;
- есть reviewed candidate contract или достаточно evidence для bounded hypothesis review;
- axes/states не зависят от неразрешённого parent ownership;
- существуют representative and stress fixtures;
- доступен isolated implementation path;
- можно показать минимум один реальный consumer context;
- blockers достаточно узкие и явно перечислены;
- работа не пересекается с активной mutation/normalization branch без согласованного base.

### Предпочтительный профиль pilot

```text
small or medium family
+ meaningful interaction/accessibility behavior
+ at least two variants or states
+ light/dark or context mode relevance
+ one responsive rule
+ real product usage
```

Слишком тривиальный primitive не проверит dossier architecture; крупный Event Card-like composite может смешать standard pilot с незавершённой family normalization.

### Выход

Pilot selection receipt с reason, current lifecycle state, source SHA, owner и explicit non-promotion boundary.

## Этап 3 — Git-first dossier pilot

### Действия

1. Заполнить [component dossier template](templates/component-dossier-template.md).
2. Связать exact Component Contract/source identities.
3. Сгенерировать или проверить:
   - axes/defaults table;
   - valid/invalid combinations;
   - canonical state keys;
   - fixture index;
   - code import/API summary;
   - evidence coverage map.
4. Написать human-reviewed sections:
   - purpose and selection;
   - content guidance;
   - prohibited usage;
   - design rationale;
   - migration/support.
5. Проверить [readiness checklist](templates/component-page-readiness-checklist.md).

### Выход

Dossier в Git со статусом, соответствующим фактическому lifecycle. Никакой автоматической materialization.

### Gate

Dossier не может показывать `ACCEPTED`, если authoritative lifecycle не terminal. Empty evidence cells не удаляются; они остаются blockers или `not-applicable` с reason.

## Этап 4 — Resource Graph visualization

После Git review dossier может быть визуализирован в Resource Graph как noncanonical candidate representation.

### Раскладка по существующим страницам

| Resource Graph page | Что получает |
|---|---|
| `00 — System map` | ссылка на documentation standard, status и catalog route |
| `05 — Recent changes` | versioned documentation changes и migration notices |
| `15 — Methodology and contracts` | standard boundary, metadata model и validation rules |
| `20 — Foundations` | shared tokens/content/a11y foundations, на которые ссылаются dossiers |
| `25 — Iconography` | icon resource dossiers и semantic/accessibility rules |
| `30 — Core UI resources` | core component family dossiers |
| `40 — Announcements components` | domain component family dossiers |
| `50 — Product patterns` | composition-level usage, not duplicated component masters |
| `60 — Page archetypes` | accepted/candidate consumer representations and fixture contexts |
| `70 — Coverage and fragmentation` | completeness, drift, duplicate/legacy and unresolved binding views |

### Правила materialization

- существующий root/zone managed spatial contract сохраняется;
- все objects получают stable metadata;
- visual page рендерит Git/contract IR;
- repeated mode specimens являются instances/generated outputs;
- no detached copies;
- exact contract/state/fixture tuple видима или встроена в metadata;
- second pass idempotency обязателен;
- read-back receipt фиксирует фактические IDs/counts/revision;
- materialization сама не меняет lifecycle.

### Выход

Penpot candidate page + read-back receipt + export references, всё с `canonical: false` до terminal promotion.

## Этап 5 — Isolated code and evidence view

### Действия

1. Подключить exact candidate implementation/package.
2. Создать isolated specimens для required state/fixture classes.
3. Добавить interaction and accessibility scenarios.
4. Проверить responsive/container classes.
5. Показать generated API/props view в dossier.
6. Связать screenshots с DOM/a11y/interaction evidence, а не хранить отдельно.

### Выход

Runnable documentation view и coverage receipt.

### Gate

Sandbox или story page не объявляется canonical implementation до соответствующего lifecycle state. Copy-pasted demo implementation запрещена.

## Этап 6 — Three-way conformance integration

Для family, дошедшего до соответствующей стадии, dossier становится readable index для существующей three-way capsule:

```text
native Penpot candidate
↕ exact tuple
isolated Astro candidate specimen
↕ exact tuple
real generated-page candidate instance
```

Dossier отображает результаты, но не генерирует PASS самостоятельно.

### Required checks

- identity/version/hash parity;
- state and fixture parity;
- anatomy and dependency parity;
- token mapping;
- geometry/text/media behavior;
- interaction and accessibility;
- responsive behavior;
- no forbidden local overrides;
- accepted/candidate visual reference policy;
- evidence and rollback refs.

### Выход

Three-way capsule reference and blocker summary в dossier.

## Этап 7 — Promotion/deprecation presentation

### Promotion

Только после `FAMILY_AND_ARCHETYPE_PROMOTION` dossier меняет display status на `ACCEPTED`, показывает `canonical: true`, accepted package version, promotion receipt и production conformance.

### Deprecation

Deprecated dossier сохраняет:

- прежнюю identity/version;
- reason and decision date;
- replacement component/pattern;
- migration mapping;
- compatibility window;
- affected consumers;
- rollback/support route;
- historical evidence.

Search направляет новых пользователей к replacement, но не уничтожает трассировку старых instances.

## Этап 8 — Масштабирование каталога

После успешного pilot можно генерировать единый catalog поверх registry.

### Catalog views

- by entity kind;
- by product capability/archetype;
- by lifecycle/display status;
- by owner;
- by coverage/blocker;
- by package/version;
- by deprecated/replacement chain;
- by recent changes.

### Quality controls

- naming lint;
- broken-link and stale-binding checks;
- docs–contract parity;
- specimen/test coverage;
- fixture provenance;
- mode parity;
- lifecycle legality;
- duplicate/fragmentation signals;
- documentation freshness warning.

Freshness warning не изменяет authority и не удаляет старое evidence.

## Роли

| Роль | Ответственность |
|---|---|
| Product owner | purpose, selection, capability/outcome and acceptance decisions |
| Design-system owner | identity, axes, anatomy, standard consistency and lifecycle routing |
| Product designer | product contexts, variants, responsive and prohibited usage |
| Content designer/editor | labels, terminology, localization and stress content |
| Engineer | API, semantics, behavior, package and consumer boundary |
| Accessibility reviewer | keyboard, focus, semantics, announcements, contrast/reflow/motion |
| Evidence/CI owner | schemas, fixtures, generated specimens, receipts and fail-closed checks |
| Penpot operator | bounded materialization, read-back, stable IDs and comments |

Одна роль может исполняться одним человеком, но тип решения и reviewer должны оставаться явными.

## Metrics без подмены authority

Полезные operational metrics:

```text
share of registry identities with a discoverable dossier
share with complete identity/binding header
required state/specimen/test coverage
fixture provenance coverage
broken or unresolved design–code bindings
stale review warnings
open documentation blockers
migration completeness for deprecated resources
search success and support questions by component
```

Запрещённая интерпретация:

```text
100% documentation coverage != 100% accepted design system
```

## Pilot completion criteria

Pilot считается успешным как documentation pilot, когда:

1. exact identity/lifecycle truth не дублируется и не искажается;
2. дизайнер, инженер и content owner находят нужный reading path из одного entry point;
3. default, axes, states, anatomy, responsive, content and a11y rules понятны без чтения всех source files;
4. specimens связаны с exact state/fixture identities;
5. design/code/test/evidence links работают;
6. blockers видимы;
7. generated sections воспроизводимы;
8. Penpot rendering, если выполнялась, idempotent и read-back verified;
9. ни один authority/promotion gate не был обойдён;
10. standard можно применить к следующей family без копирования ad hoc structure.

## Следующий decision point

После review этого research раздела следует принять только одно bounded решение: запускать ли documentation-standard pilot и на какой уже доказанной family. Само исследование не выбирает component winner и не инициирует implementation автоматически.
