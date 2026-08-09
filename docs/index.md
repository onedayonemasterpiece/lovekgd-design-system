# LoveKGD Design System — карта документации

## Нормативные документы

| Документ | Владеет | Текущий статус |
|---|---|---|
| [`resource-graph-004.md`](resource-graph-004.md) | роль Resource Graph, страницы, lifecycle, MCP/plugin/Actions, promotion | canonical operating contract |
| [`page-archetype-requirements.md`](page-archetype-requirements.md) | исходные требования, verified routes и Penpot overlays страницы 60 | accepted source-mapping contract |
| [`component-contract-authority.md`](component-contract-authority.md) | единый component authority, versioning, Penpot/Astro/runtime conformance | accepted target architecture |
| [`source-first-component-decoder.md`](source-first-component-decoder.md) | декодирование текущего Astro UI до candidate contracts и append-only behavioral evidence | reviewed immutable v1 complete; sibling v1.1 imported but evidence incomplete; candidates not accepted |
| [`penpot-product-design-operating-model.md`](penpot-product-design-operating-model.md) | связь Product Atlas → UI Exploration → Resource Graph → implementation | accepted cross-plane model |
| [`legacy-experiments.md`](legacy-experiments.md) | границы и выводы 003–005 | historical/noncanonical |
| [`research/ui-normalization-2026-08/README.md`](research/ui-normalization-2026-08/README.md) | evidence-based research: UI normalization и component defragmentation | research corpus; not an acceptance decision |
| [`research/first-party-action-map-2026-08/README.md`](research/first-party-action-map-2026-08/README.md) | semantic signals for component-level action observability | research input; not an acceptance decision |

## Машиночитаемые контракты и receipts

| Файл | Назначение |
|---|---|
| [`../contracts/resource-graph-scaffold.v1.json`](../contracts/resource-graph-scaffold.v1.json) | точные 23 страницы, порядок, stable IDs, зоны и layout rules |
| [`../contracts/page-archetype-requirements.v1.json`](../contracts/page-archetype-requirements.v1.json) | source requirements, verified current routes, historical paths и gaps для зон страницы 60 |
| [`../receipts/penpot/resource-graph-to-be-structure-v1.json`](../receipts/penpot/resource-graph-to-be-structure-v1.json) | фактический PASS read-back Resource Graph revision 30 |
| `../receipts/penpot/page-archetype-requirements-v1.json` | read-back публикации requirements overlays; создаётся только после Penpot validation |
| [`../catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/`](../catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/) | reviewed compact AS-IS decoder snapshot; 107 components, 12 candidate contracts, 6 capsules, 157/157 rasters inspected |
| [`../catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/`](../catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/) | reviewed sibling behavioral/action/media evidence; validators PASS; `EVIDENCE_COLLECTION_INCOMPLETE` with two retained readiness blockers |

## Authority routing

```text
Product meaning and UI-gap identity
→ events-bot-new product model + Product Atlas

Original page requirements and current route evidence
→ events-bot-new source map at an exact SHA
→ page-archetype-requirements contract in this repository

Visual exploration
→ separate UI Exploration Penpot file

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
5. Behavioral decoder supplement                    PASS IMPORT · EVIDENCE COLLECTION INCOMPLETE
6. Candidate AS-IS Component Contracts              12 CREATED · NOT ACCEPTED
7. Project normalization synthesis                  BLOCKED BY 2 V1.1 READINESS FINDINGS
8. First bounded native Penpot materialization      NOT STARTED
9. Three-way conformance pilot                      NOT STARTED
10. Per-family promotion to design-system-led       0 families
```

## Запреты текущей фазы

Несмотря на reviewed import и PASS validator behavioral supplement v1.1, пока два readiness
blocker не закрыты, нельзя:

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
