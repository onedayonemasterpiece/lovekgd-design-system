# 01 — System profiles

## Как читать profiles

Каждый profile разделён на:

- **Observed** — подтверждено direct source, official repository/site или ранее считанным Figma metadata;
- **Transferable pattern** — сильный подход, применимый к LoveKGD;
- **Risk / limit** — то, что нельзя переносить буквально или пока нельзя подтвердить;
- **LoveKGD action** — конкретная адаптация без изменения authority.

Evidence grades:

| Grade | Значение |
|---|---|
| `A` | exact source file/node/blob или direct official documentation inspected |
| `B` | official repository/site/Storybook or first-party article |
| `C` | official profile/link, but internal structure not inspected |
| `D` | indirect discovery; используется только для поиска первичного источника |

Все source IDs раскрыты в [source-register.md](source-register.md).

---

## 1. Consta — Web

**Evidence:** `A` — exact `GallerySlider` Figma metadata, official UI Kit repository and stand files. `[S-CONSTA-FIGMA-WEB] [S-CONSTA-GITHUB-README] [S-CONSTA-STAND]`

### Observed

- Consta связывает repository, npm package, documentation stand и Figma layouts.
- Stand делит component knowledge на `Обзор`, `Код и свойства`, `Дизайнерам`, `Песочница`, `Как использовать`.
- Component metadata включает version, status, aliases, sandbox и exact Figma deep link.
- Code, docs, examples и tests colocated рядом с component source.
- `GallerySlider` sheet показывает default/theme comparisons, named axes, nested supporting components, usage examples и support.
- Button documentation начинает с пользовательской задачи, отдельно раскрывает API и content-design rules.

### Transferable pattern

**Component dossier** с разными reading paths для дизайнера, разработчика и product user, но с одной identity.

### Risk / limit

- В Figma metadata встречаются spelling drift и неодинаковые section names.
- Визуальная completeness не гарантирует code binding: `GallerySlider` не был найден под тем же identity в inspected UI Kit repository.
- Parallel theme sheets могут стать редактируемыми копиями.

### LoveKGD action

- сохранить Consta dossier approach;
- axis names получать из Component Contract;
- темы показывать generated snapshots;
- binding status выводить явно;
- naming consistency валидировать fail-closed.

---

## 2. Consta — Android и iOS deprecated

**Evidence:** `C` для конкретных files; их titles помечают платформенные kits как deprecated. `[S-CONSTA-FIGMA-ANDROID] [S-CONSTA-FIGMA-IOS]`

### Observed

Переданные Community files явно содержат `deprecated` в названиях. В актуальной экосистеме Consta публично фигурирует общий mobile direction, тогда как старые Android/iOS files остаются historical references.

### Transferable pattern

Deprecated design libraries должны оставаться доступными как migration evidence, но быть визуально отделены от current library.

### Risk / limit

Внутренняя structure, parity и replacement mapping этих Figma files в текущем pass не инспектировались.

### LoveKGD action

Для platform resources хранить `platform_scope`, `supported_versions`, `replacement_ref`, `migration_status`, `last_verified_at`, `historical_only`. Не создавать отдельные Web/iOS/Android identities, если различия выражаются tokens, layout branches и platform adapters одной semantic contract.

---

## 3. VK / Paradigm / VKUI

**Evidence:** `A/B` — official Paradigm portal, token documentation, Figma operating rules and design-review guide. Figma profile itself — `C`. `[S-VK-FIGMA] [S-PARADIGM-SITE] [S-PARADIGM-TOKENS] [S-PARADIGM-FIGMA] [S-PARADIGM-REVIEW]`

### Observed

- Portal имеет role-based entrances для Designer, Manager и Developer.
- Components Paradigm построены на VKUI.
- Token repository является общим cross-platform data source; Figma names соответствуют token names.
- Tokens покрывают themes, platforms, states и responsive values; exports собираются в разные code formats.
- Figma library разделяет `Regular` и `Compact` platform density.
- Local project libraries разрешены, но standard instances рекомендуется не detach.
- Design review требует real-like data, light/dark, target widths, full flow, hover/pressed, errors, empty/loading, screenshot overlay и повторную проверку.
- Content guidelines рассматриваются как часть системы, а не внешний editorial appendix.

### Transferable pattern

Role-oriented documentation, common token repository, controlled local extension, explicit design-review protocol, content policy and adaptive behavior.

### Risk / limit

Разрешение копий базовых styles/components в local libraries повышает риск drift, если нет upstream mapping и expiration policy.

### LoveKGD action

Local extension допускается только как `project-extension` contract с owner, upstream resource, reason и review date. No-detach для accepted resources. Review checklist Paradigm адаптируется к Penpot comments и exact tuples; content design включается в dossier и archetype contracts.

---

## 4. T2D2 — Web и App

**Evidence:** `B/C` — first-party architecture article, official design portal and user-provided public Web/App kits. `[S-T2-FIGMA-WEB] [S-T2-FIGMA-APP] [S-T2-ARCHITECTURE] [S-T2-PORTAL]`

### Observed

T2 описывает исходные проблемы: stale UI kit, design/code mismatch, отдельные Web и App kits и трудное масштабирование.

Target architecture:

```text
Foundation UI
→ base colors, typography, sizing grid

T2D2 UI
→ component-specific tokens

T2D2 Styles
→ product-facing designer tokens, shared with development

Block library
→ designer-owned pattern gallery
```

Official portal отдельно показывает components/code library, block constructor, templates и grids.

### Transferable pattern

Layered tokens, one cross-platform semantic system и controlled pattern layer between components and pages.

### Risk / limit

Designer-owned Block library без machine contract и usage census может стать вторым uncontrolled UI kit.

### LoveKGD action

Каждый pattern/block получает `pattern_id`, version, owner, component graph, allowed contexts, slots, responsive contract, source examples and promotion status. Pattern не становится component только потому, что часто копируется.

---

## 5. ISPsystem

**Evidence:** `B/C` — official Figma profile link и first-party design-system process articles. `[S-ISPSYSTEM-FIGMA] [S-ISPSYSTEM-DESIGN-SAPIENS]`

### Observed

- Evolution от общего file к организованным libraries с auto layout и atomic logic.
- Неудобная общая color library привела к разделению product-specific colors.
- Планировались category navigation, component overview, links/descriptions и design/code connection.
- Authors подчёркивают три части DS: code components/states, construction/behavior rules и logic rules.
- Process history показывает важность совместной команды designers/frontend.

### Transferable pattern

Catalog overview, category navigation, guides separated from masters, product theme separation and shared ownership.

### Risk / limit

Historical material отражает переходное состояние, а product-specific color libraries могут законсервировать divergence.

### LoveKGD action

Product-specific differences оформлять semantic aliases/themes с explicit convergence or permanence decision, а не свободными parallel palettes.

---

## 6. Gravity UI

**Evidence:** `A` — official UIKit and Page Constructor repositories. `[S-GRAVITY-FIGMA] [S-GRAVITY-UIKIT] [S-GRAVITY-PAGE-CONSTRUCTOR]`

### Observed

UIKit: foundational package, 70+ components, light/dark/high-contrast, accessibility, RTL, SSR, i18n, linked Figma/Themer/Storybook/docs, tests and explicit `when to use / when not to use` routing to specialized packages.

Page Constructor:

- pages generated from typed JSON;
- blocks and sub-blocks;
- new block requires model/type, mapping, JSON Schema validator, README, Storybook demo data, editor template and optional preview;
- custom/loadable blocks, ready template and static builder.

### Transferable pattern

```text
block identity
+ typed data
+ schema validation
+ renderer mapping
+ story fixture
+ editor template
→ composable page
```

### Risk / limit

Free-order block constructor is not equal to a product archetype.

### LoveKGD action

Use schema-driven blocks, но archetypes определяют required/optional regions, order/dependencies, repetitions, navigation, responsive branches, accessibility sequence and product-state rules.

---

## 7. HSE

**Evidence:** `C/B` — direct Figma link supplied but not inspected; public portal evidence confirms a large multi-site ecosystem and versioned design-system reference. `[S-HSE-FIGMA] [S-HSE-PORTAL]`

### Observed

HSE operates a large multi-site ecosystem and stable site/page types. Public guidance distinguishes templates, static/composite pages, news, announcements, program pages and content operations. Public references point to a versioned design-system endpoint.

### Transferable pattern

At ecosystem scale, page archetypes and editorial workflows matter at least as much as atomic controls.

### Risk / limit

Internal Figma structure and exact version-to-code binding were not inspected.

### LoveKGD action

Page archetypes are first-class versioned resources with editorial/content rules and route mappings.

---

## 8. Alfa-Bank `arui-feather`

**Evidence:** `A` — official archived repository and README. `[S-ALFA-ARUI]`

### Observed

- Repository explicitly deprecated and points to replacement.
- Docs cover adaptive/mobile, colors and theming.
- Quality includes lint, unit/mobile tests and per-component Gemini visual regression.
- Release automation generates changelog, tags, build and publication.
- Deprecation policy requires docs update, minor warning, communication and runway before major removal.

### Transferable pattern

```text
mark and document
→ announce
→ provide replacement/migration
→ retain runway
→ remove in breaking release
```

### Risk / limit

Archived code is migration evidence, not current implementation recommendation.

### LoveKGD action

Every deprecated promoted resource needs replacement, migration fixtures, affected consumers and removal gate.

---

## 9. Госдизайн

**Evidence:** `A/B` — official public organization and WCAG AA checklist. `[S-GOVDESIGN-ORG] [S-GOVDESIGN-A11Y]`

### Observed

Public corpus is distributed by resource type: maps, symbols, accessibility, articles and wishlists. Accessibility guidance assigns responsibilities across designers, developers, managers, testers and editors; it covers contrast, non-color cues, focus, keyboard, semantic structure, text alternatives and ARIA.

### Transferable pattern

Accessibility is a cross-role acceptance system with component, pattern, page and content checks.

### Risk / limit

The corpus is historical and not a modern unified component package.

### LoveKGD action

Create cross-role evidence: design requirement, code requirement, content requirement, manual test, automated test, page-flow test and owner.

---

## 10. Kontur UI

**Evidence:** `A/B` — current repository and documentation. `[S-KONTUR-REPO] [S-KONTUR-DOCS]`

### Observed

- UI package contains components, templates and principles.
- Entry links docs, quick start, Themer, Guides and sandboxes.
- Ecosystem separates base controls, validation, addons, side menu, icons, typography, colors, error pages, empty states, mass actions, hidden links, skeletons and complex tables.
- Old docs visibly point to current portal.
- Docs cover customization, adaptivity, a11y, locales and validation.

### Transferable pattern

Package boundaries by responsibility, specialized page-state resources, explicit supersession, sandboxes and theme playground.

### Risk / limit

A large package list creates discoverability debt without entity kinds and dependency routing.

### LoveKGD action

Catalog cards differ by `entity_kind`; deprecated docs show exact superseded target.

---

## 11. ViennaUI

**Evidence:** `A` — official repository README and review instructions. `[S-VIENNA-REPO] [S-VIENNA-REVIEW]`

### Observed

- Core UI plus packages for icons, hooks, tokens, primitives, theme and utils.
- ThemeProvider/tokens are explicit customization boundary.
- Catalog includes generic controls and banking/domain components.
- Review format: `Problem → Consequence → Solution`, concrete references, no preference-only feedback.

### Transferable pattern

Token/primitives/theme/UI package layering and actionable review.

### Risk / limit

Flat component index mixes generic and domain resources.

### LoveKGD action

Penpot comment template adds exact contract/state/fixture/viewport identity to Vienna's review discipline.

---

## 12. Taiga UI

**Evidence:** `A` — official repository and template repository. `[S-TAIGA-REPO] [S-TAIGA-LUMBERMILL]`

### Observed

- Modular/tree-shakable ecosystem; 130+ components/directives/tokens/utilities.
- CSS custom properties and dark theme.
- Exact compatibility table for current, LTS and unsupported majors.
- Figma explicitly available only for older 2.x/3.x while current code is newer.
- Lumbermill targets templates, dashboards and pages.

### Transferable pattern

Exact version compatibility, separate archetype/template corpus and public acknowledgment of design/code lag.

### Risk / limit

WIP template repository is not an accepted archetype catalog.

### LoveKGD action

Every Penpot header shows exact compatible package/contract versions; mismatch is a blocker.

---

## 13. Yandex UI

**Evidence:** `A/B` — official repository, Storybook and modifier-based source. `[S-YANDEX-REPO] [S-YANDEX-STORYBOOK]`

### Observed

React UI Kit on BEM/bem-react. Behavior is decomposed through explicit modifier directories/files; Storybook is main docs/example surface; platform support is documented.

### Transferable pattern

Modifier-based composition makes axes explicit and modular.

### Risk / limit

Modifier files can multiply and create implicit combination rules without a central registry.

### LoveKGD action

Use explicit axes with canonical valid/invalid combination matrix and contract-derived tests.

---

## 14. CFT Elephas

**Evidence:** `A` — official repository README and tree. `[S-ELEPHAS-REPO]`

### Observed

Framework-neutral CSS/HTML core, Storybook examples, React and Angular wrappers, layout separated from core.

### Transferable pattern

One framework-neutral semantic/visual core can support multiple adapters.

### Risk / limit

Shared CSS alone does not prove semantic, accessibility or interaction parity.

### LoveKGD action

Adapters bind one contract and share fixtures/tests; each proves native semantics and behavior.

---

## 15. Ростелеком Design System / Atomaro

**Evidence:** `A/B` — official portal, component guides and release history. `[S-RT-GETTING] [S-RT-BUTTON] [S-RT-RELEASES]`

### Observed

- IA separates foundations/style, components and patterns.
- React/Vue Storybooks and designer libraries.
- Gen2 is engine (`Atomaro`) plus Rostelecom themes.
- Gen1 is maintained but not developed; new projects use Gen2.
- Component pages cover purpose, variants, sizes, anatomy, when/not, good/bad and content rules.
- Releases expose breaking changes, new components, fixes and token changes.

### Transferable pattern

Engine vs brand theme separation, generation migration policy, first-class patterns and rich usage rules.

### Risk / limit

Parallel framework releases require parity evidence.

### LoveKGD action

One contract version binds every adapter; theme cannot redefine semantics.

---

## 16. Росатом

**Evidence:** `C/B` — user-provided Figma file and official portal shell. `[S-ROSATOM-FIGMA] [S-ROSATOM-SITE]`

### Observed

Public positioning separates style guide, Figma library and implementation preview. Portal content was not exposed to the current crawler.

### Transferable pattern

Portal should connect design resources and executable preview.

### Risk / limit

No component/token/lifecycle claim is made from current evidence.

### LoveKGD action

Keep as target for later direct browser/Figma audit; do not use it for current detailed architecture decisions.

---

## 17. Penpot as LoveKGD review surface

**Evidence:** `A/B` — official current Penpot documentation. `[S-PENPOT-DESIGN-SYSTEMS] [S-PENPOT-VARIANTS] [S-PENPOT-MCP] [S-PENPOT-BEST-PRACTICES]`

### Observed

- Native tokens, components, libraries and variants.
- Variant properties map states/styles closer to code.
- Stable connected layer names/types/hierarchy preserve overrides.
- View mode supports comments and Inspect.
- MCP can inspect/mutate; safe guidance recommends read-only first and small reversible edits.
- Best practices recommend tokens, functional grouping, variants only within one pattern, shallow hierarchy and semantic Flex/Grid.

### Transferable pattern

Penpot supports native candidate implementation, specimens, owner comments, inspectable metadata and read-back evidence.

### Risk / limit

Feature availability does not make a file authoritative; MCP write capability can amplify mistakes.

### LoveKGD action

Materialization is Git/contract-driven, scoped, reversible and read-back validated. Authority transfers only at existing promotion gate.
