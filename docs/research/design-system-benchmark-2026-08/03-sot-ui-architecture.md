# 03 — Target SoT UI architecture for LoveKGD

## 1. Решение

LoveKGD использует **federated surfaces with one authority model**, а не «единственный файл, где лежит всё».

```text
Product Atlas / exact runtime source
        │
        ▼
Foundation, Component, Pattern and Archetype Contracts in Git
        │
        ├── generated types and registries
        ├── canonical package candidates
        ├── fixture and specimen plans
        ├── Penpot materialization manifests
        ├── documentation views
        └── tests, receipts, migrations
                │
                ├── Penpot Resource Graph
                ├── isolated code specimens
                ├── product representations
                └── production runtime evidence
```

Нормативный центр — versioned graph в Git. Contract задаёт identity, semantics, axes, constraints, bindings и required evidence; visual implementation живёт в Penpot и code, но не может независимо менять contract truth.

## 2. Sources of truth по типу знания

| Знание | Authoritative source | Supporting surfaces |
|---|---|---|
| user need, Job, outcome, capability | Product Atlas + accepted product contracts | archetype docs, routes |
| current executable behavior до promotion | exact product source/runtime | decoder snapshot, screenshots |
| resource identity/version/lifecycle | Git contract registry | catalog, Penpot header, package metadata |
| content, terminology and formatting rules | Git foundation contract/registry | dossiers, lint, fixtures, product copy reviews |
| brand asset identity/provenance/usage | Git asset registry + accepted source files | Penpot assets, code package, usage pages |
| token identity and semantic role | Git token contract/package | Penpot token library, CSS variables |
| typography/iconography/media/layout rules | Git foundation contracts | Penpot libraries, code adapters, fixtures |
| visual native implementation candidate | Penpot binding at exact revision | accepted exports, screenshots |
| executable presentation candidate | package implementation at exact SHA | isolated specimen, product preview |
| page composition identity | archetype contract | Penpot archetype candidate, route mapping |
| review decision | review receipt | Penpot comments, PR discussion |
| production conformance | runtime capsule at exact release | CI artifacts, visual/a11y/interaction evidence |
| external design systems | labelled research evidence with availability state | source register, benchmark, screenshots |

## 3. Stable identity

Tool object IDs are references, not resource identity.

### Foundation tuple

```text
foundation_id
foundation_domain
foundation_version
foundation_sha256
mode_or_context
consumer_id
```

### Component tuple

```text
component_id
contract_version
contract_sha256
state_key
fixture_id
viewport_id
candidate_package_sha
```

### Pattern tuple

```text
pattern_id
pattern_version
pattern_sha256
composition_key
fixture_id
viewport_id
dependency_graph_sha256
candidate_package_sha
```

### Page archetype tuple

```text
archetype_id
archetype_version
archetype_sha256
composition_key
page_state_key
fixture_set_id
viewport_id
candidate_package_sha
```

### Product representation tuple

```text
archetype_id + version
route_id
product_context_id
representation_id
source_snapshot_sha
fixture_set_id
runtime_release_sha
```

Every Penpot root board, code specimen, screenshot, review packet and receipt binds one of these tuples.

## 4. Resource kinds

```yaml
foundation:
  examples: content/terminology, brand assets, color, typography, iconography, media, spacing, grid, motion, accessibility

primitive:
  examples: surface, text, icon renderer, focus ring

component:
  owns: bounded semantic interaction and anatomy

pattern:
  owns: repeatable multi-component composition and behavior

page_archetype:
  owns: page-level semantic regions, state model and composition constraints

product_representation:
  owns: exact product data/context realization of an archetype

fixture:
  owns: deterministic content/media/state stress input

evidence:
  owns: observation, test result, review or conformance output
```

A resource cannot change kind through a documentation label. A family decision receipt is required.

## 4.1. Foundation contract graph

Foundations are versioned resources, not a single undifferentiated token page. Required domains include:

```text
communication/content and terminology
brand assets
color and modes
typography
iconography
media
breakpoints, containers and grid
spacing, radius, opacity and elevation
motion
accessibility
```

Each foundation record binds:

```yaml
foundation_id:
foundation_domain:
version:
content_hash:
owner:
status:
source_refs:
semantic_roles:
primitive_values_or_rules:
modes:
consumer_refs:
compatibility:
validation_rules:
evidence_refs:
migration_or_replacement_ref:
```

Components, patterns and archetypes reference exact foundation versions. Historical guides can reveal missing domains and rationale, but cannot supply current LoveKGD values without exact product evidence and owner decision.

## 5. Token architecture

### 5.1 Layers

```text
primitive
  color.blue.500
  spacing.400
  radius.200

semantic foundation
  color.background.primary
  color.text.secondary
  spacing.control.inline

component
  button.background.primary.default
  button.padding.inline.medium

pattern (only where composition owns a stable rule)
  event-list.gap.desktop
  filter-toolbar.sticky-offset

theme/product aliases
  theme.lovekgd.color.accent
  product.announcements.media-ratio.card
```

### 5.2 Rules

1. Primitive tokens are never used as public component API.
2. Semantic tokens describe role, not current appearance.
3. Component tokens belong to one component contract and may alias semantic tokens.
4. Pattern/archetype tokens appear only for repeated composition invariants.
5. Theme aliases may replace values but not component semantics.
6. Responsive token values have explicit breakpoint/container context.
7. Token deletion requires consumer census and migration.
8. Penpot values must bind token identities; hard values are candidate defects unless explicitly permitted.
9. Modes are not duplicate libraries.
10. Token names, descriptions, types and allowed consumers are validated.
11. Canonical IDs are semantic; opaque mnemonic names are optional display/search aliases only.
12. Imported/local collections require owner, source version/hash, modes, consumers, compatibility and supersession.
13. External token values remain hypotheses until product, accessibility and migration evidence exists.

## 6. Cross-platform and multi-framework model

### 6.1 One semantic contract

```text
component_id: core.button
semantic axes: importance, size, state, icon placement
        │
        ├── Astro/Web implementation
        ├── future native/mobile adapter
        └── Penpot visual implementations/modes
```

Platform-specific behavior is declared, not silently forked. It creates a second identity only when purpose, anatomy or interaction semantics genuinely differ.

### 6.2 Adapter requirements

Every adapter must prove:

- same contract version/hash;
- exact foundation compatibility;
- supported axes/states;
- explicit unsupported values;
- semantic/a11y parity;
- fixture parity;
- release compatibility;
- migration mapping.

## 7. Contract-to-surface generation

```text
contract schema
→ TypeScript/Astro types
→ state_key encoder/decoder
→ Penpot property/materialization manifest
→ specimen matrix
→ Storybook/docs tables
→ content/terminology lint and fixture registry
→ test parameter registry
→ valid/invalid combination checks
→ migration diff
```

### Drift classes

| Drift | Example | Required response |
|---|---|---|
| identity drift | different name/version in Penpot and code | blocker |
| axis drift | Penpot property missing in code | blocker |
| value drift | same token name, different value | blocker until classified |
| foundation drift | component references incompatible content/grid/media/token version | blocker |
| behavior drift | visual match, different interaction | blocker |
| fixture drift | examples use unrelated content | invalidate comparison |
| documentation drift | docs list removed prop or historical rule as current | fail docs check |
| lifecycle drift | deprecated resource shown as accepted | critical blocker |
| archetype drift | product page uses undeclared region/order | reviewed gap or contract update |

## 8. Conflict resolution

```text
1. Preserve exact observations; do not overwrite evidence.
2. Check current authority mode and lifecycle.
3. Before promotion, current executable source wins for AS-IS behavior.
4. Candidate contract describes target, not production fact.
5. External/historical sources create hypotheses, not current truth.
6. After promotion, accepted package/contract version is normative.
7. Penpot or runtime mismatch becomes conformance defect.
8. Contract changes require versioning, migration and review.
```

## 9. SoT catalog requirements

Each entry displays:

```yaml
resource_id:
resource_kind:
family_id:
version:
hash:
authority_mode:
lifecycle_state:
decision_status:
canonical:
display_status:
owner:
last_reviewed_at:
compatibility:
bindings:
foundation_dependencies:
dependencies:
consumers:
evidence:
open_blockers:
replacement:
```

Search aliases are allowed, but aliases never replace stable ID.

## 10. Anti-patterns

Forbidden as target architecture:

- `Penpot file = SoT` without versioned contract;
- copied pages as archetypes;
- screenshots as contracts;
- component names inferred from layer names;
- one flat catalog for foundations, components, patterns, fixtures and pages;
- product CSS overrides of component internals;
- local libraries without upstream/expiry metadata;
- default values that differ between code/design/docs;
- automatic promotion after materialization;
- visual similarity as merge evidence;
- all combinations generated without validity rules;
- documentation that cannot state exact compatible release;
- static PDF/style guide treated as current executable authority;
- opaque mnemonic labels used as canonical token/style IDs;
- content/terminology policy kept outside versioned contracts;
- external breakpoints, media ratios, palette or brand rules copied without current product evidence;
- component showroom/catalogue treated as dossier readiness.
