# LoveKGD Design System — карта документации

## Текущий оперативный роутер

- [`static-site-design-system-current-state.md`](static-site-design-system-current-state.md) — **первая точка входа** для статического сайта, Astro ↔ Git UI SoT ↔ Penpot, fixture scenarios, component lineage и текущих Draft PR. Документ отделяет целевой контракт от доказанного состояния и перечисляет запретные ложные утверждения.
- [`ui-source-of-truth-roundtrip.md`](ui-source-of-truth-roundtrip.md) — нормативный cross-repository lifecycle и обязательный three-way parity gate.
- [`reviews/index.md`](reviews/index.md) — per-item owner-review status и processing evidence; `processed: NO` не равен отсутствию реализации, но всегда означает отсутствие terminal owner acceptance.

`lovekgd-design-system/main@c6419a62af3d73f53e81d95a518fbe62a4a1c942`
является историческим опубликованным снимком от 19 августа 2026 года. Текущий
AS-IS baseline находится в Draft PR `#52`, а активный owner-review delta — в
Draft PR `#53`. Нельзя выводить текущее состояние только из `main` или старого
PR body: перед работой нужен fresh-read реального head.

## Нормативные документы

| Документ | Владеет | Текущий статус |
|---|---|---|
| [`static-site-design-system-current-state.md`](static-site-design-system-current-state.md) | layered authority, factual state, current gaps и routing для человека/агента | current operational router |
| [`ui-source-of-truth-roundtrip.md`](ui-source-of-truth-roundtrip.md) | обязательный Astro → Git SoT → Penpot → owner review → Astro preview → production round trip и межрепозиторные gates | accepted operational contract |
| [`reviews/index.md`](reviews/index.md) | обязательный реестр owner review: отдельные intake records, per-item status, processing evidence и fail-closed readiness routing | accepted operational router; активный contour IN_PROGRESS |
| [`normalization/event-card-large-primitives-owner-comments-20260820.md`](normalization/event-card-large-primitives-owner-comments-20260820.md) | owner-authorized correction contract for EventCard Large actions, counts, typography, icon geometry, and meta primitives | in-progress candidate contract |
| [`normalization/event-card-systemic-component-boundaries-20260820.md`](normalization/event-card-systemic-component-boundaries-20260820.md) | systemic icon+count, semantic naming, Medallion consumer and intrinsic mobile-rail correction across all event-card families | reconciled to Penpot rev1034; ready for bounded owner re-review; candidate/noncanonical |
| [`normalization/event-card-owner-review-2-20260820.md`](normalization/event-card-owner-review-2-20260820.md) | owner comments 96–125: source-faithful consumer geometry, state matrices, Exhibition/Festival recomposition and Page40.1b retirement | reconciled to Penpot rev1087; awaiting owner rereview; candidate/noncanonical |
| [`resource-graph-004.md`](resource-graph-004.md) | роль Resource Graph, страницы, lifecycle, MCP/plugin/Actions, promotion | canonical operating contract |
| [`page-archetype-requirements.md`](page-archetype-requirements.md) | исходные требования, verified routes и Penpot overlays страницы 60 | accepted source-mapping contract |
| [`component-contract-authority.md`](component-contract-authority.md) | единый component authority, versioning, Penpot/Astro/runtime conformance | accepted target architecture |
| [`source-first-component-decoder.md`](source-first-component-decoder.md) | декодирование текущего Astro UI до candidate contracts и append-only behavioral evidence | reviewed immutable v1 complete; sibling v1.1 closure complete; candidates not accepted |
| [`normalization/project-normalization-synthesis-v1.md`](normalization/project-normalization-synthesis-v1.md) | historical v1 synthesis and candidate registry | superseded by red-team remediation; not current readiness authority |
| [`normalization/project-normalization-synthesis-v1-1.md`](normalization/project-normalization-synthesis-v1-1.md) | exact-once evidence, typed analytical groups, positive readiness, dossiers and observe-mode value gate | v1.1.1 proof definitions materialized; not a promotion decision |
| [`normalization/design-system-family-lifecycle.md`](normalization/design-system-family-lifecycle.md) | normative 11-state code → Penpot → archetype → visual audit → promotion lifecycle | accepted contract; promotion remains per-family and fail-closed |
| [`normalization/event-media-boundary-and-contract-decision-v1.md`](normalization/event-media-boundary-and-contract-decision-v1.md) | exact Event Media census, semantic/boundary model, candidate contracts, blockers and delivery gate | candidate contract; later source-bound receipts may supersede individual status statements |
| [`audits/project-normalization-synthesis-v1-1-independent-red-team-reaudit.md`](audits/project-normalization-synthesis-v1-1-independent-red-team-reaudit.md) | byte-preserved independent v1.1 re-audit (61,775 bytes; SHA-bound) | controlling verdict for its audited head only; later delta requires newer evidence |
| [`audits/project-normalization-synthesis-v1-1-1-proof-closure-report.md`](audits/project-normalization-synthesis-v1-1-1-proof-closure-report.md) | six-finding v1.1.1 correction/evidence ledger | implementation evidence only; no merge authorization |
| [`penpot-product-design-operating-model.md`](penpot-product-design-operating-model.md) | связь Product Atlas → UI Exploration → Resource Graph → implementation | accepted cross-plane model |
| [`legacy-experiments.md`](legacy-experiments.md) | границы и выводы 003–005 | historical/noncanonical |
| [`research/ui-normalization-2026-08/README.md`](research/ui-normalization-2026-08/README.md) | evidence-based research: UI normalization и component defragmentation | research corpus; not an acceptance decision |
| [`research/first-party-action-map-2026-08/README.md`](research/first-party-action-map-2026-08/README.md) | semantic signals for component-level action observability | research input; not an acceptance decision |

## Текущие source-bound контракты и receipts

| Файл | Назначение / текущая роль |
|---|---|
| [`../catalog/fixtures/design-system-reference/v1/registry.v1.json`](../catalog/fixtures/design-system-reference/v1/registry.v1.json) | versioned fixture pools и factual event payload authority для archetype parity |
| [`ui-reference-fixture-registry.md`](ui-reference-fixture-registry.md) | правила scenario/fixture identity и executable consumer bridge |
| [`product-patterns/event-card-container-packed-rows.md`](product-patterns/event-card-container-packed-rows.md) | packed rows + ecological crop; Astro/Penpot materialized, visual QA pass, owner rereview open |
| [`normalization/event-detail-motion-keyboard-source-contract-v1.md`](normalization/event-detail-motion-keyboard-source-contract-v1.md) | Event Detail Hero image, portrait, parallax, keyboard и continuation order; source-exact, owner rereview open |
| [`../catalog/reconstruction-atlas/v1/listing-event-card-centralization-20260829.v1.json`](../catalog/reconstruction-atlas/v1/listing-event-card-centralization-20260829.v1.json) | Date/Weekend compact card centralization structural evidence |
| [`../catalog/reconstruction-atlas/v1/popular-listing-event-card-centralization-20260829.v1.json`](../catalog/reconstruction-atlas/v1/popular-listing-event-card-centralization-20260829.v1.json) | Popular compact card centralization; structural pass, visual QA partial |
| [`../catalog/reconstruction-atlas/v1/festival-card-centralization-20260829.v1.json`](../catalog/reconstruction-atlas/v1/festival-card-centralization-20260829.v1.json) | bounded FestivalCard centralization and Penpot lineage evidence |
| [`../catalog/reconstruction-atlas/v1/design-system-reference-fixtures-ov57.v1.json`](../catalog/reconstruction-atlas/v1/design-system-reference-fixtures-ov57.v1.json) | owner requirement for bounded shared fixture pools; structural parity evidence |

Более старые status-документы остаются историей решений, но не могут
перекрывать более новый exact-source contract/receipt на активном head.

## Базовые машиночитаемые контракты

| Файл | Назначение |
|---|---|
| [`../contracts/resource-graph-scaffold.v1.json`](../contracts/resource-graph-scaffold.v1.json) | исторический TO-BE scaffold, stable IDs и layout rules |
| [`../contracts/ui-exploration-target.v1.json`](../contracts/ui-exploration-target.v1.json) | canonical team/file/page identity и authority boundary отдельного UI Exploration file |
| [`../contracts/page-archetype-requirements.v1.json`](../contracts/page-archetype-requirements.v1.json) | source requirements, verified current routes, historical paths и gaps для зон страницы 60 |
| [`../catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/`](../catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/) | reviewed compact AS-IS decoder snapshot; 107 components, 12 candidate contracts, 6 capsules, 157/157 rasters inspected |
| [`../catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/`](../catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/) | reviewed sibling behavioral/action/media evidence; 293 terminal probes and 134/134 raster reviews |
| [`../contracts/normalization/family-lifecycle.v1.json`](../contracts/normalization/family-lifecycle.v1.json) | exact 11 ordered states, 10 adjacent gates, authority and evidence rules |
| [`../contracts/normalization/family-lifecycle.v1.schema.json`](../contracts/normalization/family-lifecycle.v1.schema.json) | fail-closed machine schema for the lifecycle contract |
| [`../contracts/normalization/analytical-entity-kinds.v1.schema.json`](../contracts/normalization/analytical-entity-kinds.v1.schema.json) | component identities versus catalogs, compositions, surfaces, workflows, runtime and evidence groups |
| [`../contracts/normalization/semantic-readiness.v1.schema.json`](../contracts/normalization/semantic-readiness.v1.schema.json) | positive readiness dimensions; historical assessment does not override later bounded receipts |

## Authority routing

```text
Product meaning and UI-gap identity
→ events-bot-new product model + Product Atlas

Current AS-IS executable fact before family promotion
→ pinned events-bot-new Astro/runtime

Durable candidate and accepted UI decisions
→ versioned Git UI SoT contracts/registry/receipts in this repository

Visual implementation and review
→ native Penpot masters + linked instances + exact readback/exports

Bounded browser candidate
→ isolated events-bot-new branch/preview using the same contract and fixtures

Promotion and production conformance
→ explicit owner approvals + package/consumer migration + runtime evidence
```

Penpot не является автоматическим двусторонним синхронизатором. Любая
коррекция проходит contract/decision → materialization/integration → exact
readback → tests → focused visual review.

## Фактическая последовательность на 2026-08-29

```text
1. Historical TO-BE Resource Graph scaffold          PASS · HISTORICAL
2. Source-first decoder + behavioral supplement      PASS · IMMUTABLE SNAPSHOTS
3. Candidate contracts / normalization hypotheses    CREATED · NOT GLOBALLY ACCEPTED
4. Source-proven AS-IS baseline (#52)                 PASS · DRAFT / UNMERGED
   17 archetypes · 34 desktop/mobile cases
5. Owner-review corrections (#53)                    IN_PROGRESS
   many bounded structural/visual gates ready for rereview; acceptance open
6. Golden Event Corpus component pilot (#42)         IDENTITY PASS · VISUAL FAIL
7. Current reference-scenario registry               ACTIVE IN #53 / #596
8. Bounded three-way conformance                      MIXED PASS / PARTIAL / BLOCKED
9. Per-family promotion                              0 globally promoted families
10. Production migration of draft candidate          NOT AUTHORIZED
```

`ROUND_TRIP_VALIDATION_PASS`, Penpot `validate()=[]`, a green test or a focused
visual PASS do not themselves mean owner acceptance, promotion or deployment.

## Текущие запреты

Пока Draft PR и owner-review gates не закрыты, нельзя:

- описывать Penpot как самостоятельный или автоматический Source of Truth;
- считать `main` единственной актуальной картой состояния;
- объявлять всю дизайн-систему accepted/promoted;
- считать визуальное сходство доказательством component lineage;
- создавать page-local masters, detached lookalikes или screenshot-as-component;
- сравнивать Astro и Penpot на разных fixture IDs, clock, state или viewport;
- выдавать structural PASS за visual PASS либо owner acceptance;
- считать Draft PR `events-bot-new#596` production UI;
- запускать merge/deploy/promotion без соответствующих owner и release gates.
