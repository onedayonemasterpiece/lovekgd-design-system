# LoveKGD Design System — карта документации

## Нормативные документы

| Документ | Владеет | Текущий статус |
|---|---|---|
| [`resource-graph-004.md`](resource-graph-004.md) | роль Resource Graph, страницы, lifecycle, MCP/plugin/Actions, promotion | canonical operating contract |
| [`component-contract-authority.md`](component-contract-authority.md) | единый component authority, versioning, Penpot/Astro/runtime conformance | accepted target architecture |
| [`source-first-component-decoder.md`](source-first-component-decoder.md) | декодирование текущего Astro UI до candidate contracts | accepted next-stage contract; implementation not started |
| [`penpot-product-design-operating-model.md`](penpot-product-design-operating-model.md) | связь Product Atlas → UI Exploration → Resource Graph → implementation | accepted cross-plane model |
| [`legacy-experiments.md`](legacy-experiments.md) | границы и выводы 003–005 | historical/noncanonical |

## Машиночитаемые контракты и receipts

| Файл | Назначение |
|---|---|
| [`../contracts/resource-graph-scaffold.v1.json`](../contracts/resource-graph-scaffold.v1.json) | точные 23 страницы, порядок, stable IDs, зоны и layout rules |
| [`../receipts/penpot/resource-graph-to-be-structure-v1.json`](../receipts/penpot/resource-graph-to-be-structure-v1.json) | фактический PASS read-back Resource Graph revision 30 |

## Authority routing

```text
Product meaning and UI-gap identity
→ events-bot-new product model + Product Atlas

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
2. Documentation and contracts consolidation        THIS CHANGE
3. Source-first decoder                             NOT STARTED
4. Reviewed candidate Component Contracts           NOT CREATED
5. First bounded native Penpot materialization      NOT STARTED
6. Three-way conformance pilot                      NOT STARTED
7. Per-family promotion to design-system-led        0 families
```

## Запреты текущей фазы

До завершения decoder review нельзя:

- восстанавливать старые Penpot components;
- использовать старые Penpot object IDs;
- объявлять component family accepted;
- включать visual baseline gate;
- автоматически выводить component identity только по визуальному сходству;
- импортировать весь runtime corpus как набор archetypes;
- повышать всю систему в `design-system-led` одним переключателем.
