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

## Workflow skills

- Use [`$penpot-visual-reconstruction`](../.codex/skills/penpot-visual-reconstruction/SKILL.md) to materialize ready semantic SoT as native UI-only Penpot archetypes.
- Use [`$ui-component-certification`](../.codex/skills/ui-component-certification/SKILL.md) only when a component certification trigger is present. Ordinary linked reuse remains assembly.
- [`$ui-three-way-conformance`](../.codex/skills/ui-three-way-conformance/SKILL.md) is deprecated compatibility only.

The four bounded validators in the reconstruction skill gate handoff freshness, Penpot UI-only plans, visual readiness, and the assembly/certification boundary.

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

### Canonical UI Exploration target

Канонический контур незавершённого визуального исследования находится в
отдельном Penpot file **LoveKGD — UI Exploration**:

- team ID: `81f57451-85cc-819d-8008-70ebaeab3fd6`;
- file ID: `81f57451-85cc-819d-8008-76829a28696b`;
- entry page: `00 — Exploration map`, page ID
  `81f57451-85cc-819d-8008-76829a28696c`;
- [прямая ссылка на UI Exploration](https://design.penpot.app/#/workspace?team-id=81f57451-85cc-819d-8008-70ebaeab3fd6&file-id=81f57451-85cc-819d-8008-76829a28696b&page-id=81f57451-85cc-819d-8008-76829a28696c).

Machine authority: [`../contracts/ui-exploration-target.v1.json`](../contracts/ui-exploration-target.v1.json).
Фактический Event Media read-back: [`../receipts/penpot/event-media-visual-exploration-v1.json`](../receipts/penpot/event-media-visual-exploration-v1.json).

Penpot Plugin API и современный workspace URL не раскрывают `project_id`.
Поэтому contract сохраняет `project_id: null` с точным статусом ограничения,
вместо выдуманного UUID. Team, file, page и revision проверены read-back.

Этот file не является Resource Graph authority. Нативные ресурсы с
`status: EXPLORATION_ONLY` остаются визуальными кандидатами до отдельного
owner receipt; их наличие не переводит family lifecycle в
`PENPOT_COMPONENT_CANDIDATE`.

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

### Penpot stores UI only

Resource Graph pages contain native visual foundations, reusable component
masters, linked instances, archetype compositions, and real product screen
states. Git owns source-state indexes, lifecycle/status data, coverage and gap
ledgers, test results, hashes, run receipts, and other service metadata. Those
operational records may link to Penpot objects, but they must not be represented
as Penpot boards or components.

Consequently a review hub/dashboard is not an owner-review target. Review is an
ordered list of direct links to small real UI pages. Archetype pages contain
desktop/mobile visual compositions and only states that change the visible UI;
dense/stress/full-list behavior remains a generated-Astro test concern.

## Page composition, archetype and representation

```text
page composition
= конкретная исследуемая сборка

page archetype
= reusable route/page-family contract; candidate until final family/archetype promotion

product representation
= реальный configured candidate/accepted screen state из одного archetype и native instances
```

Один archetype может иметь mobile/desktop, authorized/anonymous, open/sold-out/ended, wide-photo/portrait-poster/no-image representations.

The exact authority boundary is defined by the [normative family lifecycle](normalization/design-system-family-lifecycle.md): `PAGE_ARCHETYPE_CANDIDATE` and `PRODUCT_REPRESENTATIONS` remain reconstructed candidates; archetype acceptance occurs only at `FAMILY_AND_ARCHETYPE_PROMOTION`. A source-requirements overlay or detached screen mockup is not an archetype.

### Обязательная раскладка archetype review

Каждое проверяемое состояние archetype размещается отдельной горизонтальной
строкой, без перекрытий и скрытого clipping:

```text
[locked SOURCE EVIDENCE · exact Astro screenshot]
[COMPONENT RECONSTRUCTION · linked native instances]
[VISUAL COMPARISON · overlay/blink/diff + findings]
```

Source evidence и reconstruction стоят рядом и имеют одинаковый viewport и
пиксельный размер. Screenshot никогда не публикуется в Resources и не маскирует
недостающие компоненты. Reconstruction собирается только из linked accepted
components; fixture text/media are overrides, а detached copy, source skeleton
под компонентом и общая визуальная «нашлёпка» запрещены.

Перед передачей владельцу агент обязан экспортировать reconstruction, заново
импортировать/отрендерить пару и **посмотреть глазами** в масштабе, достаточном
для проверки шрифтов, crop, baseline, spacing, opacity, icon alignment,
clipping и порядка элементов. Обязательны side-by-side и 50% overlay/blink;
pixel diff добавляется, когда доступен. Все необъяснённые расхождения получают
component/slot owner и исправляются системно во всех consumers.

Точный capture manifest, критерии остановки и reverse Astro gate заданы в
[`ui-source-of-truth-roundtrip.md`](ui-source-of-truth-roundtrip.md#3a-mandatory-archetype-visual-parity-gate).

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

This UI-improvement lifecycle is orthogonal to the family lifecycle. A resolved comment, owner-approved correction or completed handoff does not by itself advance a family state or change authority.

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

For family work, “explicit acceptance” here means the machine lifecycle transition. Candidate writes remain `authority_mode=reconstructed`, `canonical=false` until `FAMILY_AND_ARCHETYPE_PROMOTION`.

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

### Gemini MCP visual audit

The `GEMINI_MCP_VISUAL_AUDIT` lifecycle state uses Penpot MCP only for read-only inspection/export of a hash-bound full-resolution bundle. Only `gemini-3-pro-preview` or `gemini-3.1-pro-preview` satisfies the advisory review gate. Gemini may report visible hierarchy, composition, reuse, responsive and state-coverage risks, but cannot prove DOM/accessibility semantics, interaction behavior, contract hashes, three-way conformance, production release, owner acceptance or promotion. It may not mutate Penpot or resolve comments. Lower-class probes and provider failures do not satisfy the gate.

## Baseline policy

```text
accepted Penpot specimen/export
→ immutable reference manifest

Astro/runtime actual
→ screenshot and diff
```

Runtime actual никогда не заменяет accepted baseline автоматически. Visual diff дополняет, но не заменяет functional, interaction и accessibility tests.

Во время первичной реконструкции pinned Astro screenshot является AS-IS source
evidence. После owner acceptance accepted Penpot reconstruction становится
visual reference того же Git SoT contract. Это разные роли: ни один raster сам
по себе не является SoT.
