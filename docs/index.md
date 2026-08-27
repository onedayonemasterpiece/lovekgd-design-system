# LoveKGD Design System — карта документации

## Нормативные документы

| Документ | Владеет | Текущий статус |
|---|---|---|
| [`ui-source-of-truth-roundtrip.md`](ui-source-of-truth-roundtrip.md) | обязательный Astro → Git SoT → Penpot → owner review → Astro preview → production round trip и межрепозиторные gates | accepted operational contract |
| [`reviews/index.md`](reviews/index.md) | обязательный реестр owner review: отдельные intake records, per-item status, processing evidence и fail-closed readiness routing | accepted operational router; `REV-TG-20260826-01` IN_PROGRESS |
| [`normalization/event-card-large-primitives-owner-comments-20260820.md`](normalization/event-card-large-primitives-owner-comments-20260820.md) | owner-authorized correction contract for EventCard Large actions, counts, typography, icon geometry, and meta primitives | in-progress candidate contract |
| [`normalization/event-card-systemic-component-boundaries-20260820.md`](normalization/event-card-systemic-component-boundaries-20260820.md) | systemic icon+count, semantic naming, Medallion consumer and intrinsic mobile-rail correction across all event-card families | reconciled to Penpot rev1034; ready for bounded owner re-review; candidate/noncanonical |
| [`normalization/event-card-owner-review-2-20260820.md`](normalization/event-card-owner-review-2-20260820.md) | owner comments 96–125: source-faithful consumer geometry, state matrices, Exhibition/Festival recomposition and Page40.1b retirement | reconciled to Penpot rev1087; awaiting owner rereview; candidate/noncanonical |
| [`resource-graph-004.md`](resource-graph-004.md) | роль Resource Graph, страницы, lifecycle, MCP/plugin/Actions, promotion | canonical operating contract |
| [`page-archetype-requirements.md`](page-archetype-requirements.md) | исходные требования, verified routes и Penpot overlays страницы 60 | accepted source-mapping contract |
| [`component-contract-authority.md`](component-contract-authority.md) | единый component authority, versioning, Penpot/Astro/runtime conformance | accepted target architecture |
| [`source-first-component-decoder.md`](source-first-component-decoder.md) | декодирование текущего Astro UI до candidate contracts и append-only behavioral evidence | reviewed immutable v1 complete; sibling v1.1 closure complete; candidates not accepted |
| [`normalization/project-normalization-synthesis-v1.md`](normalization/project-normalization-synthesis-v1.md) | historical v1 synthesis and candidate registry | superseded by red-team remediation; not current readiness authority |
| [`normalization/project-normalization-synthesis-v1-1.md`](normalization/project-normalization-synthesis-v1-1.md) | exact-once evidence, typed analytical groups, positive readiness, dossiers and observe-mode value gate | v1.1.1 proof definitions materialized; 0 strict-ready; exact-head attestation and independent delta re-audit pending |
| [`normalization/design-system-family-lifecycle.md`](normalization/design-system-family-lifecycle.md) | normative 11-state code → Penpot → archetype → visual audit → promotion lifecycle | accepted contract; current state AS_IS_RECONSTRUCTED |
| [`normalization/event-media-boundary-and-contract-decision-v1.md`](normalization/event-media-boundary-and-contract-decision-v1.md) | exact Event Media census, semantic/boundary model, candidate contracts, blockers and delivery gate | boundary complete; not ready with exact blockers; Draft PR only |
| [`audits/project-normalization-synthesis-v1-1-independent-red-team-reaudit.md`](audits/project-normalization-synthesis-v1-1-independent-red-team-reaudit.md) | byte-preserved independent v1.1 re-audit (61,775 bytes; SHA-bound) | controlling verdict for audited head; delta re-audit required for reconciled head |
| [`audits/project-normalization-synthesis-v1-1-1-proof-closure-report.md`](audits/project-normalization-synthesis-v1-1-1-proof-closure-report.md) | six-finding v1.1.1 correction/evidence ledger | implementation evidence only; no merge authorization |
| [`penpot-product-design-operating-model.md`](penpot-product-design-operating-model.md) | связь Product Atlas → UI Exploration → Resource Graph → implementation | accepted cross-plane model |
| [`legacy-experiments.md`](legacy-experiments.md) | границы и выводы 003–005 | historical/noncanonical |
| [`research/ui-normalization-2026-08/README.md`](research/ui-normalization-2026-08/README.md) | evidence-based research: UI normalization и component defragmentation | research corpus; not an acceptance decision |
| [`research/first-party-action-map-2026-08/README.md`](research/first-party-action-map-2026-08/README.md) | semantic signals for component-level action observability | research input; not an acceptance decision |

## Машиночитаемые контракты и receipts

| Файл | Назначение |
|---|---|
| [`../contracts/resource-graph-scaffold.v1.json`](../contracts/resource-graph-scaffold.v1.json) | точные 23 страницы, порядок, stable IDs, зоны и layout rules |
| [`../contracts/ui-exploration-target.v1.json`](../contracts/ui-exploration-target.v1.json) | canonical team/file/page identity и authority boundary отдельного UI Exploration file | canonical target; project UUID не раскрыт Plugin API |
| [`../contracts/page-archetype-requirements.v1.json`](../contracts/page-archetype-requirements.v1.json) | source requirements, verified current routes, historical paths и gaps для зон страницы 60 |
| [`../receipts/penpot/resource-graph-to-be-structure-v1.json`](../receipts/penpot/resource-graph-to-be-structure-v1.json) | фактический PASS read-back Resource Graph revision 30 |
| [`../receipts/penpot/event-media-visual-exploration-v1.json`](../receipts/penpot/event-media-visual-exploration-v1.json) | 7 pages, 3 native candidate groups, 9 options, 13 fixtures и 3 open owner comment threads | exploration ready; no option accepted |
| [`../receipts/penpot/event-card-library-architecture-remediation-v1.json`](../receipts/penpot/event-card-library-architecture-remediation-v1.json) | EventCard Large resource boundary, linked icons, long rail track, unified medallion namespace, 23 color and 15 typography AS-IS assets | candidate read-back PASS; owner visual-acceptance thread 64 remains open |
| [`../receipts/penpot/event-card-systemic-component-remediation-v1.json`](../receipts/penpot/event-card-systemic-component-remediation-v1.json) | systemic linked Social proof/actions, semantic slots and Medallion naming across card families plus full-row intrinsic mobile-rail review | ready for bounded owner re-review; comments 85–95 replied and open |
| [`../catalog/normalization/families/event-preview-representations/event-card-systemic-boundaries-candidate-v1.json`](../catalog/normalization/families/event-preview-representations/event-card-systemic-boundaries-candidate-v1.json) | superseding bounded semantic composition contract for Social proof, actions, Medallion naming, title/place slots and rail track/viewport split | candidate; noncanonical; owner acceptance open |
| `../receipts/penpot/page-archetype-requirements-v1.json` | read-back публикации requirements overlays; создаётся только после Penpot validation |
| [`../catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/`](../catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/) | reviewed compact AS-IS decoder snapshot; 107 components, 12 candidate contracts, 6 capsules, 157/157 rasters inspected |
| [`../catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/`](../catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/) | final reviewed sibling behavioral/action/media evidence; 293 terminal probes, zero readiness blockers, 134/134 raster reviews |
| [`../contracts/project-normalization-charter.v1.json`](../contracts/project-normalization-charter.v1.json) | project-specific candidate charter and R-01…R-07 disposition ledger | candidate; not accepted implementation authority |
| [`../contracts/normalization/family-lifecycle.v1.json`](../contracts/normalization/family-lifecycle.v1.json) | exact 11 ordered states, 10 adjacent gates, authority and evidence rules | normative lifecycle; current state AS_IS_RECONSTRUCTED |
| [`../contracts/normalization/family-lifecycle.v1.schema.json`](../contracts/normalization/family-lifecycle.v1.schema.json) | fail-closed machine schema for the lifecycle contract | accepted schema |
| [`../contracts/normalization/analytical-entity-kinds.v1.schema.json`](../contracts/normalization/analytical-entity-kinds.v1.schema.json) | distinguishes component identities from catalogs, compositions, surfaces, workflows, runtime and evidence groups | audit-remediated candidate schema |
| [`../contracts/normalization/semantic-readiness.v1.schema.json`](../contracts/normalization/semantic-readiness.v1.schema.json) | positive 23-dimension readiness evidence for every analytical group | 47 assessed; 0 ready |
| [`../contracts/product-value-evidence-binding.v1.schema.json`](../contracts/product-value-evidence-binding.v1.schema.json) | foreign-key-only product-value binding for every component application | gate mode `observe`; authoritative product registry pending |
| [`../catalog/normalization/family-registry.jsonl`](../catalog/normalization/family-registry.jsonl) | 47 primary families covering all 107 logical component paths | candidate family model; all decisions unaccepted |
| [`../receipts/normalization/project-normalization-synthesis-v1.json`](../receipts/normalization/project-normalization-synthesis-v1.json) | historical v1 receipt | retained; readiness proof superseded |
| [`../receipts/normalization/project-normalization-synthesis-v1-1.json`](../receipts/normalization/project-normalization-synthesis-v1-1.json) | v1.1.1 content/definition manifest, reconciliation lineage, STOP constraints and external attestation contract | execution attestation and independent delta re-audit required; merge forbidden |

## Authority routing

```text
Product meaning and UI-gap identity
→ events-bot-new product model + Product Atlas

Original page requirements and current route evidence
→ events-bot-new source map at an exact SHA
→ page-archetype-requirements contract in this repository

Visual exploration
→ canonical [LoveKGD — UI Exploration](https://design.penpot.app/#/workspace?team-id=81f57451-85cc-819d-8008-70ebaeab3fd6&file-id=81f57451-85cc-819d-8008-76829a28696b&page-id=81f57451-85cc-819d-8008-76829a28696c)
→ exploration-only native candidates; owner comments; no promotion authority

Mature design-system graph and evidence
→ Resource Graph Penpot file + this repository

Current executable UI before promotion
→ events-bot-new Astro source

Promoted component identity/API/states and Astro presentation
→ future versioned component package in this repository

Production conformance
→ events-bot-new runtime + GitHub Actions evidence
```

## Текущая последовательность

```text
1. TO-BE Resource Graph scaffold                    PASS
2. Documentation and contracts consolidation        PASS
3. Page-archetype source requirements mapping       IN PUBLICATION
4. Source-first decoder                             PASS · IMMUTABLE REVIEWED V1
5. Behavioral decoder supplement                    PASS · TERMINAL EVIDENCE COMPLETE
6. Candidate AS-IS Component Contracts              12 CREATED · NOT ACCEPTED
7. Project normalization synthesis v1.1.1 proof definitions materialized · exact-head attestation and independent delta re-audit pending
8. First exploration-only native Penpot candidates EVENT MEDIA READY · AWAITING OWNER COMMENTS
   Lifecycle PENPOT_COMPONENT_CANDIDATE             NOT STARTED
9. Three-way conformance pilot                      NOT STARTED
10. Per-family promotion to design-system-led       0 families
```

The detailed sequence above is now governed by the machine contract and cannot be shortened:

```text
AS_IS_RECONSTRUCTED
→ FAMILY_HYPOTHESIS_REVIEWED
→ CANDIDATE_CONTRACT_ACCEPTED
→ CANONICAL_CODE_CANDIDATE
→ PENPOT_COMPONENT_CANDIDATE
→ COMPONENT_THREE_WAY_CONFORMANCE
→ PAGE_ARCHETYPE_CANDIDATE
→ PRODUCT_REPRESENTATIONS
→ GEMINI_MCP_VISUAL_AUDIT
→ REVIEWED_CORRECTIONS
→ FAMILY_AND_ARCHETYPE_PROMOTION
```

The v1.1 remediation does not authorize the first transition and does not prove
`FAMILY_HYPOTHESIS_REVIEWED`; its positive gate currently selects zero groups.

## Запреты текущей фазы

Несмотря на завершённые evidence и synthesis, до отдельных family decision receipts нельзя:

- восстанавливать старые Penpot components;
- использовать старые Penpot object IDs;
- объявлять component family или visual archetype accepted;
- считать requirements overlay компонентом, архетипом или production evidence;
- включать visual baseline gate;
- автоматически выводить component identity только по визуальному сходству;
- импортировать весь runtime corpus как набор archetypes;
- повышать всю систему в `design-system-led` одним переключателем.
- считать controlled exact-source runtime production observation;
- выбирать winner для CTA/transport experiments без отдельного decision receipt;
- начинать merge/split/delete, normalization, tokenization или Penpot materialization.