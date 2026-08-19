# Source register and evidence ledger

Observed date: **2026-08-19**.

Evidence grades: `A` exact inspected source; `B` official repository/site or first-party publication; `C` official link whose internals were not inspected; `D` indirect discovery only.

## A. User-provided design sources

| ID | System | Source | Grade | Limitation |
|---|---|---|---|---|
| `S-CONSTA-FIGMA-WEB` | Consta Web | https://www.figma.com/community/file/853774806786762374/consta-ui-kit | `A/C` | official binding confirmed; not every page audited |
| `S-CONSTA-FIGMA-ANDROID` | Consta Android deprecated | https://www.figma.com/community/file/1027541331523291146/consta-ui-kit-android-deprecated | `C` | internals not inspected |
| `S-CONSTA-FIGMA-IOS` | Consta iOS deprecated | https://www.figma.com/community/file/1027541533393761291/consta-ui-kit-ios-deprecated | `C` | internals not inspected |
| `S-VK-FIGMA` | VK | https://www.figma.com/@vk | `C` | profile internals not inspected |
| `S-T2-FIGMA-PROFILE` | T2 | https://www.figma.com/@t2digital | `C` | profile internals not inspected |
| `S-T2-FIGMA-WEB` | T2D2 Web | https://www.figma.com/community/file/1509554620086084342/t2d2-public-web | `C` | internals not inspected |
| `S-T2-FIGMA-APP` | T2D2 App | https://www.figma.com/community/file/1509555010746495735/t2d2-public-app | `C` | internals not inspected |
| `S-PARADIGM-FIGMA-PROFILE` | Paradigm | https://www.figma.com/@paradigm | `C` | profile internals not inspected |
| `S-ISPSYSTEM-FIGMA` | ISPsystem | https://www.figma.com/@ispsystem | `C` | profile internals not inspected |
| `S-GRAVITY-FIGMA` | Gravity UI | https://www.figma.com/community/file/1271150067798118027/gravity-ui-design-system | `C/A` | official repository binding confirmed; internals not inspected in this pass |
| `S-HSE-FIGMA` | HSE General Library | https://www.figma.com/file/cBHD57QcCt9WDT4e7e2B3w/hse_general_library | `C` | internals not inspected |
| `S-ROSATOM-FIGMA` | Rosatom | https://www.figma.com/community/file/1144567424019815189 | `C` | internals not inspected |

### Figma quota note

Direct Figma MCP quota was exhausted during this benchmark. No pixel-level or exhaustive page claims are made for `C` rows. These sources remain a bounded follow-up visual-audit queue.

## B. Official repositories

| ID | System | Source | Grade | Inspected scope |
|---|---|---|---|---|
| `S-CONSTA-GITHUB-README` | Consta | https://github.com/consta-design-system/uikit | `A` | package/docs/Figma boundary |
| `S-CONSTA-STAND` | Consta | `src/stand/standConfig.ts`, `src/components/Button/__stand__/*`, tests | `A` | audience tabs, metadata, docs split, examples, tests |
| `S-ALFA-ARUI` | Alfa | https://github.com/alfa-laboratory/arui-feather | `A` | deprecated/replacement, tests, releases and migration policy |
| `S-GRAVITY-UIKIT` | Gravity | https://github.com/gravity-ui/uikit | `A` | themes, a11y, RTL, SSR, i18n, tests and package routing |
| `S-GRAVITY-PAGE-CONSTRUCTOR` | Gravity | https://github.com/gravity-ui/page-constructor | `A` | blocks, JSON schemas, renderer mapping, stories, editor templates |
| `S-VIENNA-REPO` | ViennaUI | https://github.com/Raiffeisen-DGTL/ViennaUI | `A` | tokens/primitives/theme/UI packages |
| `S-VIENNA-REVIEW` | ViennaUI | https://github.com/Raiffeisen-DGTL/ViennaUI/blob/master/REVIEW_INSTRUCTIONS.md | `A` | actionable review format |
| `S-TAIGA-REPO` | Taiga UI | https://github.com/taiga-family/taiga-ui | `A` | packages, compatibility, LTS and Figma lag |
| `S-TAIGA-LUMBERMILL` | Taiga | https://github.com/taiga-family/taiga-lumbermill | `A` | WIP templates, dashboards and pages |
| `S-YANDEX-REPO` | Yandex UI | https://github.com/bem/yandex-ui | `A` | package, Storybook and modifier structure |
| `S-YANDEX-STORYBOOK` | Yandex UI | https://yastatic.net/s3/frontend/lego/storybook/index.html | `B` | official documentation surface |
| `S-ELEPHAS-REPO` | Elephas | https://github.com/cft-group/elephas | `A` | CSS/HTML core, layout, Storybook and adapters |
| `S-KONTUR-REPO` | Kontur UI | https://github.com/skbkontur/retail-ui | `A` | components/templates/principles and package ecosystem |
| `S-KONTUR-DOCS` | Kontur UI | https://tech.skbkontur.ru/kontur-ui/ | `B` | current docs, themer, guides and sandbox |
| `S-GOVDESIGN-ORG` | Govdesign | https://github.com/govdesign | `B` | resource repositories |
| `S-GOVDESIGN-A11Y` | Govdesign | https://github.com/govdesign/accessibility-guidelines/blob/master/Checklist.rst | `A` | WCAG AA cross-role checklist |

## C. Official portals and first-party material

| ID | System | Source | Grade | Scope |
|---|---|---|---|---|
| `S-PARADIGM-SITE` | Paradigm | https://paradigm.mail.ru/ | `B` | role-oriented portal and VKUI relationship |
| `S-PARADIGM-TOKENS` | Paradigm | official token documentation/repository links | `B` | cross-platform repository-driven tokens |
| `S-PARADIGM-FIGMA` | Paradigm | official Figma workflow/library guidance | `B` | Regular/Compact, variables, local libraries, no-detach |
| `S-PARADIGM-REVIEW` | Paradigm | official design-review guide | `B` | states, themes, viewports, data and overlay checks |
| `S-T2-ARCHITECTURE` | T2D2 | first-party T2 architecture publication | `B` | Foundation UI → T2D2 UI → Styles; old Web/App divergence |
| `S-T2-PORTAL` | T2D2 | official public portal | `B` | components, code, blocks, constructor, templates and grids |
| `S-ISPSYSTEM-DESIGN-SAPIENS` | ISPsystem | first-party process articles | `B` | library evolution, atomic model, product palettes and ownership |
| `S-HSE-PORTAL` | HSE | official public site/versioned references | `B/C` | page types and editorial model; exact DS internals not inspected |
| `S-RT-GETTING` | Rostelecom | https://design.rt.ru/gen2/designsystem/gettingStarted/intro | `A/B` | Gen2, foundations/components/patterns and implementation surfaces |
| `S-RT-BUTTON` | Rostelecom | official Gen2 component guide | `A/B` | purpose, anatomy, variants and content guidance |
| `S-RT-RELEASES` | Rostelecom | official release history | `A/B` | breaking/new/fixed/token changes and Gen1/Gen2 lifecycle |
| `S-ROSATOM-SITE` | Rosatom | https://design.rusatom.dev/ | `C/B` | portal shell; component content inaccessible to current crawler |

## D. Penpot official documentation

| ID | Source | Grade | Scope |
|---|---|---|---|
| `S-PENPOT-DESIGN-SYSTEMS` | https://help.penpot.app/user-guide/design-systems/ | `A/B` | tokens, components and libraries |
| `S-PENPOT-VARIANTS` | https://help.penpot.app/user-guide/components/variants/ | `A/B` | properties and connected-layer behavior |
| `S-PENPOT-MCP` | https://help.penpot.app/technical-guide/mcp-server/ | `A/B` | inspect/mutate capabilities and safe workflow |
| `S-PENPOT-BEST-PRACTICES` | official Penpot best-practices material | `B` | token use, functional groups, shallow structure and Flex/Grid semantics |

## E. Evidence interpretation rules

1. Official source does not make a resource canonical for LoveKGD.
2. `C` evidence may create a follow-up audit task, not a component/token/archetype decision.
3. Historical repositories support migration/governance lessons, not current implementation choices.
4. A code repository does not prove Figma parity.
5. Inference remains labelled and never produces `canonical: true`.
6. Direct Figma follow-up must record file key, node/page IDs, observed revision/date, screenshots and exact limitations.
