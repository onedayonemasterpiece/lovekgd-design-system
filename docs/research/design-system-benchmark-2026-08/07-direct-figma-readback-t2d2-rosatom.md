# 07 — Direct Figma read-back: T2D2 Web and Rosatom

## Status

```yaml
document_kind: direct-external-figma-readback
status: reviewed-research
observed_at: 2026-08-19
authority_effect: none
component_acceptance: none
archetype_acceptance: none
penpot_mutation: none
production_mutation: none
canonical: false
```

Этот документ исправляет ограничение первоначального benchmark: ссылки T2D2 Web и Росатома были зарегистрированы как targets, но внутренний Figma-файл не был прочитан. В текущем проходе выполнены два разных результата:

| Reference | Current result | Evidence state |
|---|---|---|
| T2D2 Public — WEB | живая Community-публикация, public embed canvas и raw checkpoint прочитаны | `LIVE_CHECKPOINT_READBACK` |
| Дизайн-система Росатома | Community page и embed сейчас возвращают Figma 404 | `UNPUBLISHED_OR_INACCESSIBLE` |

Для Росатома доступна только историческая публичная карточка и cover из независимого Community index. Она не заменяет current live read-back.

## 1. Method and provenance

### 1.1. Почему не использован обычный Figma MCP file read

Community numeric ID не является обычным Figma file key, а доступный Figma MCP Starter quota оставался исчерпан. Поэтому был применён read-only public-viewer path:

```text
first-party Figma Community resource page
→ first-party embedded Community viewer
→ checkpoint response, загруженный самим viewer
→ offline decoding по embedded Kiwi schema
→ bounded structural inventory
```

Авторизованные cookies, private tokens и Figma mutations не использовались.

### 1.2. Checkpoint identity

T2D2 viewer загрузил raw Figma checkpoint со следующими признаками:

```yaml
format: fig-kiwi
format_version: 101
chunk_count: 2
schema_compression: zstd
message_compression: zstd
schema_definitions: 507
schema_bytes: 57103
message_bytes: 31852334
raw_checkpoint_sha256: e3e5590b328c0b79e9c560d20d316ffaa54e76aaf85264fd2f5109fd09d73c5e
decoded_json_gz_sha256: 93be132d4b45ea6620ab718c73a34fa25770210fc07b60ab03be4cba737d7dff
```

Format decoding является reverse-engineered research instrumentation, а не официальным Figma API contract. Встроенная schema checkpoint используется как source для decoder; project-specific schema не подставляется вручную.

### 1.3. Reproducible tooling

На review branch добавлены:

- `scripts/research/capture_grida_community_viewer.py` — public page/embed browser capture;
- `scripts/research/decode_fig_kiwi.cjs` — chunk-aware `fig-kiwi` decoder;
- `scripts/research/summarize_decoded_fig.py` — bounded inventory;
- `.github/workflows/figma-community-inspection.yml` — deterministic capture, decoding, validation и artifact upload.

GitHub Actions run `32254392968` прошёл полностью, включая evidence-envelope validation. Heavy decoded evidence остаётся Actions artifact, а не canonical package content.

## 2. T2D2 Public — WEB: first-party Community metadata

Прямой response Figma Community подтверждает:

```yaml
community_file_id: 1509554620086084342
name: T2D2 Public -- WEB
description: UI-kit сайта T2
publisher: t2 Digital
publisher_profile: t2digital
verification_status: verified
publishing_status: approved_public
category: UI kits
tag: Components
license: CC BY 4.0
valid_prototype: true
likes: 10
duplicates_or_users: 653
comments: 0
```

Exact library key:

```text
lk-a4354f87800668d1974faf24f48103681ea9d42578e52518c660d683956fdd3b795f24fabf671b4476571ba8a1a042216f3d7995e4fe90de2391cb092472ccc2
```

### Version history

| Version | Created | Prototype | Release notes | Thumbnail node |
|---:|---|---|---|---|
| 1 | 2025-05-28 13:51 UTC | valid | absent | `20875:15408` |
| 2 | 2025-05-28 14:05 UTC | valid | absent | `20875:15408` |
| 3 | 2025-05-30 08:57 UTC | valid | absent | `26831:48` |

**Observation.** Public version identity exists, but all three release-note fields are empty. Version presence therefore does not by itself explain design change, compatibility or migration.

## 3. Exact T2D2 structural inventory

### 3.1. Global counts

| Entity | Count |
|---|---:|
| Node changes / unique nodes | 42,110 |
| Canvases | 47 |
| Visible canvases | 46 |
| Hidden canvases | 1 |
| Divider canvases | 4 |
| Variant/component sets (`isStateGroup`) | 227 |
| Component masters (`SYMBOL`) | 3,776 |
| Instances | 9,963 |
| Variables | 2,325 |
| Variable-set records | 32 |
| Styles | 156 |

Node-type composition:

| Type | Count |
|---|---:|
| `FRAME` | 12,818 |
| `INSTANCE` | 9,963 |
| `TEXT` | 6,312 |
| `VECTOR` | 5,200 |
| `SYMBOL` | 3,776 |
| `VARIABLE` | 2,325 |
| `ROUNDED_RECTANGLE` | 925 |
| `ELLIPSE` | 355 |
| `BOOLEAN_OPERATION` | 323 |
| `CANVAS` | 47 |
| `VARIABLE_SET` | 32 |
| `SECTION` | 10 |

### 3.2. Public and internal authoring surfaces

The file contains one hidden canvas named `Internal Only Canvas`.

| Surface | Component sets | Masters | Instances |
|---|---:|---:|---:|
| visible/public canvases | 121 | 1,902 | 5,064 |
| hidden internal canvas | 106 | 1,874 | 4,899 |

This is a significant authoring pattern: public documentation and internal source material are separated spatially. It improves review clarity, but creates a drift risk when both surfaces contain independently editable masters.

**LoveKGD adaptation:** public dossier pages must be generated from or bound to one canonical candidate graph. A hidden source canvas and visible review canvas cannot become two authorities.

## 4. Figma information architecture

### 4.1. Linked navigation cover

The first embedded canvas shows:

```text
T2D2 public / WEB cover
+ a separate linked Navigation index
```

The index exposes these visible destinations in file order:

```text
Navigation
Style guides
Grafics
Logo
Badge
Banner
Breadcrumbs
Buttons
Cards
Checkbox
Chips
Collapse
Counter
Date picker
Dropdown list
Footer/nav
Geo accept
Input
Like
List
Loader
Logo container
MIA
Modal
Notice
Pagination
Price
Progress bar
Radio
Segmented radio
Snackbar
Stepper
Stickers group
Sticky
Stories
Switcher
Tabs
Tooltip
Typography
//Cover
//Cross line
-- Teaser (Service card)
```

Four additional canvases are divider pages named `---`.

### 4.2. Strengths of the IA

- the cover clearly identifies platform scope: `WEB`;
- a dedicated navigation page provides one-click access to resources;
- foundations have a dedicated `Style guides` canvas;
- visual assets, generic controls and product-specific resources are discoverable by name;
- internal authoring content is hidden from the public review lane;
- prototype navigation is enabled.

### 4.3. Entity-kind ambiguity

The same top-level catalog mixes:

```text
foundation/style guide
brand asset
primitive/control
compound component
product pattern
navigation shell
domain-specific widget
internal documentation utility
```

Examples:

- generic components: `Badge`, `Buttons`, `Checkbox`, `Input`, `Modal`;
- compositions/patterns: `Banner`, `Footer/nav`, `Cards`, `Stories`;
- domain resources: `Geo accept`, `Price`, `MIA`, `Stickers group`;
- documentation utilities: `//Cover`, `//Cross line`.

**Finding:** visual catalog position does not encode resource kind. LoveKGD must show explicit `foundation | primitive | component | pattern | archetype | representation | utility` metadata and separate pattern/archetype navigation.

### 4.4. Page archetype layer

The visible T2D2 Web IA does not expose a dedicated page-archetype or page-template section. It provides components and several pattern-like product resources, but does not visibly answer:

- which page classes exist;
- which semantic regions are required;
- which components/patterns are allowed per region;
- which page states and responsive branches are normative;
- how product routes bind to a page class.

This reinforces the LoveKGD requirement to keep `components → patterns → page archetypes` as three explicit layers.

## 5. Foundations, styles and variables

### 5.1. Style guide structure

`Style guides` has four top-level frames:

```text
Gradients
Spaces
Typography
Colors
```

The decoded file contains 156 style records:

| Style type | Count |
|---|---:|
| text | 82 |
| fill | 62 |
| effect | 6 |
| grid | 6 |

This is a good review pattern: foundations are visible as a dedicated documentation surface rather than hidden only in component internals.

### 5.2. Local variable layers

Seven local sets contain 1,243 variables:

| Local set | Variables | Modes |
|---|---:|---|
| `00 -- Global` | 399 | `Mode 1` |
| `01 -- Color Semantic` | 122 | `t2` |
| `02 -- WEB -- cmt color` | 425 | `Day`, `Night` |
| `04 -- Font parameters` | 49 | `t2` |
| `05 -- Design-Colors` | 210 | `Day`, `Night` |
| `06 -- Design-Size` | 25 | `Mode 1` |
| `Button` | 13 | `Medium` |

The hierarchy demonstrates useful separation between global values, semantic color, component color, font parameters, design color and sizing.

### 5.3. Imported-library graph

The checkpoint also contains:

```text
1,082 imported variable nodes
25 external variable-set records
9 distinct external library keys
```

Imported sets include repeated or parallel names such as:

```text
00 -- Global
01 -- Component Alias
Global
Design-Colors
Design-Size
01 -- Alias color
```

Modes across imported resources include:

```text
Day / Night
Day / Night / Skylink
t2 / miranda
```

**Finding:** the file demonstrates a real multi-library token graph, but duplicate names and parallel modes make ownership and compatibility difficult to infer visually.

**LoveKGD adaptation:** every token set requires stable ID, owning package, source library/version, consumer list, replacement/supersession status and drift validation. Imported-set display names are not sufficient identity.

## 6. Component model

### 6.1. Native Figma features are used extensively

The file contains:

- 227 native state/component groups;
- text, boolean and instance-swap properties;
- variant axes;
- nested instances;
- day/night variables;
- desktop/mobile axes;
- component-local variables and style references.

Component-property types in the decoded state groups:

| Property type | Count |
|---|---:|
| variant | 542 |
| boolean | 196 |
| text | 97 |
| instance swap | 68 |

This is materially stronger than a detached visual kit: the file models editable content, optional regions, nested-resource swaps and state selection.

### 6.2. Representative component sets

#### Badge

```text
36 variants
Clickable: false | true
Size: M | S
Ver.: 1.1
Color: Default | Red | Blue | Green | Pink | Transparent
Variant: Solid | Tinted
properties: badge text, left-icon visibility
```

#### Card

```text
20 variants
Background: Light | Gray | Dark | Primary | Secondary | Tethry |
            Quanty | Transparent | Default | Black
Ver.: 1.0
Platform: Mobile | Desktop
properties: content instance swap, counter visibility
```

#### Date picker / Desktop

```text
8 variants
Background: Primary | Secondary
Type: Period | On day
View: Days | Months | Years
```

#### Popup

```text
12 variants
Ver.: 1.0
Size: Normal | Small
Platform: Mobile | Desktop
onBackground: Default | White | Black
properties: content swap, scroll, buttons, loader, lawyer info
```

#### Stories item

```text
12 variants
State: Default | Hover | Active
Platform: Mobile | Desktop
Variant: Unread | Read
```

These examples show useful separation of content properties, nested slots and structural axes. They also reveal where product pattern concerns enter generic component matrices.

## 7. Variant and naming audit

### 7.1. Version is encoded as a variant axis

`Ver.` appears in 112 of 227 component sets — approximately 49.3%.

Typical values:

```text
1.0
1.1
2.0
Ver.2
```

**Risk:** old/new implementations coexist inside the same design component matrix. Version then becomes selectable visual state rather than immutable contract/package identity.

**LoveKGD rule:** `contract_version` and package version must never be a public variant axis. A breaking or semantically changed version receives a new versioned contract/binding and explicit migration mapping.

### 7.2. Axis aliases are not normalized

Semantically similar axes are expressed as:

```text
State | state | 🎮 State
Variant | 🔄 Variant | 🔁 Variant
Platform | platform | 🖥️📱 Platform | 📱🖥️ Platform | 🖥️📱Platform
Size | size | 📏 Size
Ver. | Ver
Background | Backgroun | onBackground | BackgroundColor
```

Values also vary by spelling/case:

```text
Default / default
Hover / hover
Focus / Focused / focused
Disabled / Disable
Mobile / mobile
True / true / On / on
Primary / Pimary
```

### 7.3. Directly observed naming defects

Examples in node/property/page names:

```text
Grafics
Pimary
Discription
Moble
Succes
Allign
Backgroun
monts
Bеntfit
```

Some names may be internal display labels, but they still affect search, review, handoff and automation.

**LoveKGD rule:** canonical machine names must pass a fail-closed naming registry. Designer-facing emoji/labels can be rendered separately, but cannot define `component_id`, axis identity or `state_key`.

### 7.4. Variant coverage requires a validity contract

Large matrices exist, but file structure alone does not prove that every Cartesian combination is valid in product behavior.

LoveKGD must store:

```text
variant_axes
state_axes
valid_combinations
invalid_combinations
conditional properties
source-proven observed states
required test/specimen coverage
```

## 8. Adopt, adapt and avoid from T2D2

### Adopt

- platform-labelled cover;
- linked navigation/index board;
- dedicated foundation documentation;
- native text/boolean/instance-swap properties;
- day/night modes;
- explicit desktop/mobile specimens;
- real product-specific resources rather than only generic controls;
- separate internal authoring and public review zones.

### Adapt

- flat catalog → entity-kind navigation;
- hidden source canvas → generated/bound review dossiers;
- local/imported variable sets → versioned token dependency graph;
- emoji property labels → display labels over canonical axes;
- platform variants → responsive/consumer contract where anatomy is truly shared;
- product-specific resources → explicit pattern contracts;
- public version records → changelog, compatibility and migration receipts.

### Avoid

- version as component variant;
- duplicate semantic axis names;
- case-sensitive state drift;
- editable duplication between internal/public surfaces;
- imported token sets without source/version ownership;
- treating domain pattern and primitive as the same resource kind;
- assuming a component catalog is already a page-archetype system.

## 9. Rosatom: current availability and historical evidence

### 9.1. Current first-party result

At observation time:

```yaml
community_page: Figma 404
embedded_viewer: Figma 404
live_checkpoint: unavailable
node_tree: unavailable
current_version_binding: unverified
```

Therefore no current claims are made about Rosatom pages, components, variants, variables or design/code parity.

### 9.2. Historical public index

A historical public index preserves this metadata:

```yaml
name: Дизайн-система Росатома
publisher: Илья Хромов
version: 10
created_at: 2022-08-25T09:42:18.917Z
likes: 26
duplicates: 729
support_contact: ilykhromov@rusatom-utilities.ru
license: CC BY 4.0
```

Description:

```text
Руководство по стилю цифровых продуктов и библиотека UI-компонентов для Фигмы.
```

Linked references:

```text
design.rusatom.dev
SberConf 2021 video
```

Tags include `tokens`, `ui-kit`, `vue`, `vue-js`, `design system`.

The historical cover communicates a useful cross-surface model:

```text
Figma
+ Vue.js
+ React
+ light and dark product screenshots
+ documentation portal URL
```

This is a strong presentation pattern, but the source is no longer live-verifiable and must be treated as `HISTORICAL_INDEX_ONLY`, not active SoT evidence.

## 10. New controlling requirements for LoveKGD

### R-FIG-01. External-reference availability state

Every external design reference in research must declare:

```yaml
reference_state: >-
  LIVE_CHECKPOINT_READBACK |
  LIVE_NODE_API_READBACK |
  LIVE_METADATA_ONLY |
  HISTORICAL_INDEX_ONLY |
  UNPUBLISHED_OR_INACCESSIBLE
observed_at:
source_version:
current_url_status:
checkpoint_or_response_sha256:
limitations:
```

### R-FIG-02. Visual polish does not override source availability

A historical cover or screenshot cannot establish current component API, token model, code binding or lifecycle.

### R-FIG-03. Review and source surfaces must share one graph

Public Penpot dossier pages and internal materialization zones must be projections of the same stable contract/IR, not separately maintained copies.

### R-FIG-04. Version identity is outside variant axes

`contract_version`, package version and migration status are authority metadata. They are never designer-selectable variants.

### R-FIG-05. Resource-kind navigation is mandatory

Penpot System Map and catalog must distinguish:

```text
foundation
primitive
component
pattern
page archetype
product representation
utility/evidence
historical/superseded reference
```

### R-FIG-06. Naming is machine-validated

Axis names, values, IDs and display aliases require separate fields. Canonical names pass normalization, spelling, casing and uniqueness checks.

### R-FIG-07. Token dependencies are explicit

Each local/imported token collection records owner, library/package version, source hash, consumers, modes, compatibility and supersession.

## 11. Controlling conclusion

T2D2 demonstrates a substantial, native and product-oriented Figma library with strong discoverability, component properties, responsive variants and token layers. Its most transferable presentation patterns are the platform cover, linked index, dedicated foundations and public/internal separation.

The direct read-back also reveals why LoveKGD needs stricter governance:

```text
resource kind cannot be inferred from a flat page list
version cannot be a component variant
axis naming cannot be free-form
imported token sets need exact ownership
public/internal views cannot become duplicate authorities
component catalog does not replace page archetypes
```

Rosatom demonstrates the complementary lifecycle lesson: an attractive, historically useful design-system reference may become unavailable. Source availability, last successful read-back and supersession state therefore belong in the SoT graph itself.
