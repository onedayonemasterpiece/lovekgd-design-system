# 08 — Rosatom digital-product style guide, September 2022

```text
document_kind: direct-historical-design-system-source-study
status: reviewed-research
observed_at: 2026-08-19
source_date: 2022-09
evidence_grade: A for the attached historical guide
authority_effect: none
component_acceptance: none
token_acceptance: none
family_lifecycle_transition: none
canonical: false
```

## 1. Source and boundary

Source: user-provided `rosatom-style-guide.pdf`, 18 pages.

```yaml
sha256: c045730142865fa4425bd4642d4f8e87ab9f50baf0722cd5ffaba14a18e00e7c
file_size_bytes: 10798006
pdf_modified_at: 2022-09-13T09:11:00Z
stated_edition: 09.2022
```

The guide is an exact historical source for how the Rosatom digital-product system was presented in September 2022. It does **not** establish current Figma availability, current component APIs, current token values, current Vue/React parity or current lifecycle. The first-party Community file remains unavailable in the direct 2026 read-back documented in [07-direct-figma-readback-t2d2-rosatom.md](07-direct-figma-readback-t2d2-rosatom.md).

The transferable value is therefore structural: what knowledge a mature design system should make explicit, how foundations relate to components, and where static documentation is insufficient.

## 2. Directly observed structure

| Domain | Pages | Direct observation | Transferable LoveKGD requirement | Not proven |
|---|---:|---|---|---|
| Product positioning | 1, 18 | The system connects Figma, Vue.js, React, a public portal and a support channel | Every resource must expose design, code, docs, owner/support and compatibility entry points | Current parity and release status |
| Information architecture | 2 | Communication, editorial rules, brand, foundations and components are listed in one index | Foundations and content rules must be first-class resource kinds, not hidden inside components | Completeness of each linked component page |
| Communication style | 3 | Open, compact, respectful language; avoid bureaucratic wording; create the image of a helpful assistant | Content design is a versioned foundation with tone, purpose, examples and ownership | Applicability to LoveKGD wording without product review |
| Editorial standards | 4–5 | Rules for punctuation, `ё`, numerals, phone numbers, symbols, terminology, footnotes and borrowings | A terminology/editorial registry and lintable rules must feed fixtures, docs and UI copy | That every rule is still current or appropriate for LoveKGD |
| Brand assets | 6 | Logo variants, protection field and prohibited use are shown | Brand assets require stable IDs, provenance, rights, protection zones, allowed contexts, modes and prohibited uses | Current brand assets or legal status |
| Color modes | 7–8 | Separate Default/Dark maps cover content, backgrounds, social/partner colors, shadows and faders, with hover/pressed/opacity values | One semantic token graph must generate modes and state values; contrast and parity are tested | Current values, accessibility or code binding |
| Typography | 9 | `Голос` is the stated typeface; heading/body/support/control ramps include size, line height and weight | Typography needs semantic styles, font provenance/licence, fallback, language coverage and responsive behavior | Current font package and browser rendering |
| Iconography | 10 | Monochrome outline icons use 16/20/32/56/72 boxes and 2/3 px strokes; Figma and icon-font delivery are linked | Iconography needs semantic ID, optical grid, stroke/fill rules, source SVG, accessibility and delivery adapters | Current icon inventory and semantic completeness |
| Media containers | 11 | Image ratios `10:16`, `3:4`, `1:1`, `4:3`, `16:10`, `2:1`; video `16:9` | Media ratios, crop/contain/focal behavior, fallback and accessible alternative belong to contracts | Which ratios LoveKGD actually needs |
| Breakpoints | 12 | Discrete ranges: `narrow 320–599`, `middle 600–1023`, `wide 1024–1359`, `widest 1360+`; layout “rebuilds” at thresholds | Responsive behavior is a versioned layout contract, not only screenshots | Current target devices and breakpoint suitability |
| Grid and outer margins | 13–14 | Six columns for narrow/middle, twelve for wide/widest; gutters and outer-margin rules are documented | Grid, container, gutter, max-width and outer-margin formulas require machine-readable identities and fixtures | Exact current max widths and browser behavior |
| Spacing | 15 | A 4 px micro-module and directional utility notation are described | Primitive spacing may use a base scale, but public component/pattern APIs reference semantic spacing roles | That utility notation should become LoveKGD API |
| Radius and opacity | 16 | Scales and usage by object size are shown | Radius/opacity are typed primitives with semantic consumers and exceptions | Current values and accessible contrast/compositing |
| Component catalogue | 2, 17 | A broad inventory and visual overview of controls, layouts and product elements is shown | A catalogue overview aids discovery, but every accepted component needs a dossier and contract | Anatomy, valid combinations, behavior, a11y and lifecycle of individual components |
| Ownership/support | 18 | Public portal and Telegram support are visible | Owner, review route and support route are part of every dossier and foundation package | Current support channel |

## 3. Strong patterns worth adapting

### 3.1 Foundations precede components

The guide does not start with buttons. It starts with communication, editorial rules, brand, color, type, iconography, media, breakpoints, grid, spacing, radii and opacity. This confirms that a correct system is assembled as a knowledge graph:

```text
content and brand rules
→ primitive values
→ semantic foundations
→ components
→ patterns
→ page archetypes
→ product representations
```

### 3.2 Content design is part of the system

Pages 3–5 show tone and editorial rules next to visual foundations. LoveKGD should therefore treat UI copy, terminology, date/number formatting, truncation and prohibited wording as contract data used by design, code, tests and product fixtures.

### 3.3 Modes and interaction values are visible together

Default and Dark maps include hover, pressed and opacity variants. The transferable pattern is one mode-aware token graph, not duplicated theme components.

### 3.4 Responsive layout is explained as rules

Pages 12–14 describe ranges, column counts, gutters and outer-margin behavior. A responsive foundation must encode transformation rules and expected composition, not merely preserve two screenshots.

### 3.5 Media and brand assets have usage constraints

Logo protection zones and media aspect ratios are explicit. Assets are not anonymous blobs: their allowed contexts, geometry, rights and fallbacks must be governed.

### 3.6 Support is visible

The final page exposes a support route. Ownership and support are design-system product features, not repository metadata that users must discover themselves.

## 4. Risks and limits exposed by the guide

### 4.1 Historical values must not be copied as LoveKGD truth

The document is dated September 2022. Exact colors, breakpoints, font choices and component sets can create hypotheses or comparison fixtures, but cannot be adopted without current LoveKGD product evidence, accessibility checks and owner decision.

### 4.2 Opaque mnemonic names are poor canonical IDs

Colors use film names, typography uses cheese names, and other scales use arbitrary mnemonics. Such labels may help a particular team remember a palette, but they do not describe semantic role and are difficult to validate or migrate.

LoveKGD rule:

```yaml
canonical_id: color.text.primary
display_alias: optional human mnemonic
```

Canonical IDs are stable, semantic and machine validated. Display aliases never replace them.

### 4.3 The historical source contains naming/value drift

The guide visibly includes inconsistent labels and probable editorial/value defects, for example `ColorNameOpacity`, mixed lightness notation, and values whose labels do not obviously match the stated mode. The source must be preserved as evidence; it must not be silently “cleaned” and promoted.

LoveKGD requires schema validation, spelling/terminology lint, contrast tests, cross-mode parity tests and explicit correction receipts.

### 4.4 A component overview is not a dossier

Page 17 is a useful catalogue/showroom, but it does not establish purpose, anatomy, properties, valid combinations, state transitions, accessibility, code API, lifecycle, migration, owner or exact bindings.

LoveKGD keeps two distinct surfaces:

```text
catalogue overview for discovery
component dossier for authority, behavior and evidence
```

### 4.5 Static PDF is not an executable source of truth

The guide is readable but cannot by itself prevent design/code drift. Foundation and component documentation must be generated from or validated against machine-readable contracts, package exports, Penpot bindings and test registries.

### 4.6 Icon font delivery is not an icon contract

An icon font may be one adapter, but it does not establish semantic names, SVG source, optical alignment, accessible labels, RTL behavior or version compatibility.

## 5. Required LoveKGD additions

### A. Foundation contract package

Create explicit foundation domains:

```text
communication_and_content
editorial_and_terminology
brand_assets
color_and_modes
typography
iconography
media
responsive_breakpoints
container_and_grid
spacing
radius
opacity
elevation_and_shadow
motion
accessibility
```

Each domain must record:

```yaml
foundation_id:
version:
content_hash:
owner:
status:
source_refs:
semantic_roles:
primitive_values:
modes:
consumer_refs:
compatibility:
validation_rules:
evidence_refs:
migration_ref:
replacement_ref:
```

### B. Content and terminology registry

Required data:

- tone principles and product voice;
- UI action vocabulary;
- preferred/prohibited terms;
- punctuation and numeral policy;
- dates, time, prices, places, phone numbers and pluralization;
- truncation/expansion behavior;
- localization and screen-reader alternatives;
- lint rules and exception process;
- owner and last-reviewed date.

### C. Semantic naming registry

Primitive and semantic IDs are separate from display labels. Spelling, casing, aliases, collisions and migrations are fail-closed. Historical aliases remain searchable but do not remain public API.

### D. Responsive/layout registry

Breakpoints, containers, columns, gutters, outer margins, max widths, region transformations and content behavior receive stable IDs. Every branch is proved by fixtures and expected composition keys.

### E. Media policy registry

Aspect classes, crop/contain, focal point, posters, fallback, missing media, accessible alternatives and rights/provenance are reusable contracts shared by components, patterns and archetypes.

### F. Brand-asset registry

Logo/mark/illustration assets require stable identity, source hash, rights, safe area, allowed sizes/backgrounds, light/dark variants, prohibited use, consumer census and replacement history.

### G. Foundation compatibility in every dossier

Every component, pattern and archetype must bind exact foundation versions. A screenshot that “looks correct” cannot substitute for token/content/grid/media compatibility.

### H. Generated catalogue plus dossier

The catalogue provides navigation and quick comparison. Dossiers provide exact identity, purpose, anatomy, states, content, responsive behavior, accessibility, code, tests, lifecycle, migration and support.

## 6. Controlling conclusion

The Rosatom guide confirms an important structural lesson: a design system is not assembled by drawing a component library first. It is assembled by making the rules of communication, brand, tokens, layout, content, media, behavior and ownership explicit, binding components to those rules, and proving the same identities in design, code, documentation and runtime.

The guide is a strong historical reference for **what must be documented**. It is not a current authority for **which exact values LoveKGD should use**.
