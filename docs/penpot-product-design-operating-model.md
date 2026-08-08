# Penpot product-design operating model

## Назначение

Документ связывает три визуальных контура и implementation/runtime loop, не превращая их во второй backlog или enterprise workflow engine.

```text
Product Atlas
product problem / Job / journey / capability / outcome / UI gap
        ↓ stable IDs and product context
UI Exploration
visual analysis / references / candidates / compositions / shortlist
        ↓ selected package
Resource Graph
contracts / components / patterns / archetypes / representations / evidence
        ↓ implementation package
Canonical Astro component or application implementation
        ↓ browser tests
Runtime evidence
        ↓ decision/readiness update
Product Atlas + Resource Graph
```

## Product Atlas

Владеет вопросом «зачем»:

- user need;
- Job and Job Story;
- user/owner outcome;
- journey;
- capability;
- stories/enablers;
- acceptance scenarios;
- product problem and UI-gap identity;
- implementation/release/runtime readiness;
- decisions and risks.

Product Atlas хранит link на visual exploration и Resource Graph evidence, но не весь brainstorm.

## UI Exploration

Владеет незавершённым визуальным поиском:

- current runtime/archetype context;
- product-value map snapshot;
- references, AI images and extracted claims;
- local component candidates;
- pattern/block candidates;
- page composition alternatives;
- whole iterations;
- shortlist;
- selected for build;
- parked/rejected alternatives;
- runtime closure after implementation.

Одна активная содержательная UI-gap задача по умолчанию занимает одну Penpot page. Whole iterations оформляются крупными coherent packages, а не серией микроправок.

## Resource Graph

Владеет созревшим системным представлением:

- foundations and brand resources;
- native components and variants;
- composite product patterns;
- page archetypes;
- real product representations;
- state matrices;
- UX-flow links;
- coverage and fragmentation;
- candidate promotion packages;
- runtime evidence;
- accepted exports/test references;
- review archive.

Resource Graph не является brainstorm-canvas. В `80 — Candidate review and promotion` попадают только bounded candidates, подготовленные к системному review/promotion.

## Page composition, archetype and representation

```text
page composition
= конкретная исследуемая сборка

page archetype
= принятый reusable contract route/page family

product representation
= реальный configured screen/state из archetype и native instances
```

Один archetype может иметь mobile/desktop, authorized/anonymous, open/sold-out/ended, wide-photo/portrait-poster/no-image representations.

## Product linkage

Generic component master не обязан иметь один Job. Product meaning фиксируется на уровне instance, product pattern, archetype region или ProductScreenState.

Минимальная связь archetype:

```yaml
product_links:
  job_ids: []
  outcome_ids: []
  journey_ids: []
  capability_ids: []
  acceptance_scenario_ids: []
```

UI gap содержит stable product links, affected archetypes/regions, current evidence, exploration ref и decision state.

## UI-improvement lifecycle

```text
comment or runtime evidence
→ file-level deduplicated review thread
→ exact resource/screen/flow association
→ reproduced gap
→ understood cause
→ visual/component/pattern/composition candidates
→ impact report
→ owner acceptance or rejection
→ implementation handoff
→ runtime verification
→ promotion or rollback
→ explicit comment resolution and gap closure
```

Комментарий не закрывается автоматически после mutation. Изменение не равно acceptance.

## Verified comment behavior

Официальный Penpot MCP подтвердил:

- comments читаются независимо от currently open page;
- file traversal может возвращать один и тот же thread на каждой page;
- ingestion therefore file-scoped first, page/resource-scoped second;
- primary dedupe key — stable thread ID/sequence;
- fallback signature: normalized author + created_at + initial text + origin page/board;
- currently open page не заменяет origin page;
- ambiguous spatial association remains manual/ambiguous.

## MCP operation model

```text
patch
  изменить properties/content/token/variant внутри stable wrapper

reflow-zone
  детерминированно переразложить managed siblings одной зоны

rematerialize-page
  пересобрать page/major section из IR при topology change

rebuild-file
  исключительная schema migration, не локальная правка
```

Каждая write operation:

1. читает revision/metadata/target IDs;
2. строит dry-run plan and impact scope;
3. создаёт rollback point для non-trivial batch;
4. использует bounded undo transaction;
5. сохраняет comment-bearing wrappers;
6. проверяет component links/references;
7. проверяет overlap/off-canvas/clipping/minimum gap;
8. экспортирует focused before/after evidence;
9. формирует changed-resource receipt;
10. оставляет результат candidate до explicit acceptance.

## Managed spatial layout

```text
managed page
→ managed zones
→ stable wrapper boards
→ native resources, instances, specimens and annotations
```

Targeted patch не двигает unrelated objects. Reflow ограничен zone. Manual/exploration space не перезаписывается. Topology change вызывает rematerialization, а не цепочку coordinate nudges.

## GitHub Actions, plugin and MCP

```text
GitHub Actions
  heavy deterministic work and immutable artifacts

Resource Graph plugin
  reproducible bulk materialization/reconciliation

MCP
  interactive scoped work, comments, candidates, diagnostics and evidence
```

Оба mutation channels используют один IR/Component Contract, stable IDs, hashes and operation locks.

## Baseline policy

```text
accepted Penpot specimen/export
→ immutable reference manifest

Astro/runtime actual
→ screenshot and diff
```

Runtime actual никогда не заменяет accepted baseline автоматически. Visual diff дополняет, но не заменяет functional, interaction и accessibility tests.
