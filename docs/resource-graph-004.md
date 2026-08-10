# Resource Graph 004 — canonical operating contract

> Status: accepted operating model; implementation is in reconstruction phase.  
> Penpot file: `3be9e5e1-190f-8090-8008-713c0fbe6260`.  
> Current validated revision: `30`.  
> Native component/resource content: intentionally empty.

## 1. Current truth

Resource Graph 004 is not an extension of an existing accepted component library. No accepted LoveKGD component design system existed before this phase.

Earlier Runtime Review 003.*, Resource Graph 004a/004b and runtime-derived 005 are noncanonical technical experiments. Their useful transport, recovery, evidence and comment-ingestion lessons may be reused, but their Penpot objects, component IDs, catalogs and status claims are not retained as design-system truth.

The active Resource Graph was cleared and rebuilt as a structure-only TO-BE scaffold. Read-back validation returned `PASS`:

```text
pages: 23
root boards: 23
managed zones: 257
navigation references/interactions: 90 / 90
native components: 0
variants: 0
colors/typographies/tokens: 0
images/SVG assets: 0
authority mode: reconstructed
```

The exact receipt is stored at [`../receipts/penpot/resource-graph-to-be-structure-v1.json`](../receipts/penpot/resource-graph-to-be-structure-v1.json). The page/zone contract is [`../contracts/resource-graph-scaffold.v1.json`](../contracts/resource-graph-scaffold.v1.json).

## 2. Role of Resource Graph

Resource Graph is the mature design-system and evidence plane:

```text
foundations and brand resources
→ native components and variants
→ composite product patterns
→ page archetypes
→ real product representations and state matrices
→ UX-flow links
→ coverage, fragmentation, comments and gaps
→ promotion packages
→ runtime evidence
→ accepted exports and test references
```

It is not:

- the Product Atlas;
- a free-form UI brainstorm canvas;
- a screenshot mirror of every generated route;
- a second independent backlog;
- the sole executable source of browser behavior;
- an automatic source of production code without conformance checks.

## 3. Connected planes

### Product Atlas

Owns product meaning and UI-gap identity:

- user need;
- Job/Job Story;
- user and owner outcomes;
- journey;
- capability;
- stories/enablers;
- acceptance scenarios;
- product problem and UI gap;
- decisions, readiness and risks.

### UI Exploration

Owns unfinished visual work:

- current runtime/archetype context;
- references and AI visual seeds;
- local component and pattern candidates;
- page compositions;
- whole iterations;
- shortlist and selected for build;
- parked/rejected alternatives;
- runtime closure.

### Resource Graph

Owns mature, systemically evaluated design resources, compositions, evidence and promotion.

The complete cross-plane loop is specified in [`penpot-product-design-operating-model.md`](penpot-product-design-operating-model.md).

## 4. Two-state authority model

Every resource family has one of two authority modes.

### `reconstructed`

Current phase. Rules:

- `events-bot-new` Astro source and runtime evidence describe what currently exists;
- source-first decoder reconstructs component families, states, consumers and fragmentation;
- candidate contracts and Penpot resources do not become normative merely because they were generated;
- ambiguity is a first-class gap;
- visual diffs are diagnostic unless an explicit reference has been accepted;
- candidates remain separate from reconstructed current representations.

### `design-system-led`

Enabled per bounded resource family after promotion. Rules:

- accepted Component Contract is normative for ID, version, API, variants and states;
- native Penpot component and canonical Astro implementation implement the same contract version/hash;
- application code consumes a pinned package version;
- runtime instances emit known state keys and prove conformance;
- implementation cannot silently update accepted references;
- new changes begin as candidate versions and pass acceptance before release.

A global one-step switch for the whole system is forbidden.

## 5. Component authority

The target single center is a versioned component package in Git:

```text
Component Contract
+ Astro presentation implementation
+ generated types
+ fixtures/specimens
+ interaction/accessibility/visual tests
+ Penpot binding
+ accepted references
+ migration/promotion/rollback receipts
```

Detailed rules, state keys and three-way conformance are defined in [`component-contract-authority.md`](component-contract-authority.md).

## 6. Source-first reconstruction

The next stage decodes the current UI in this order:

```text
source and generators
→ controlled isolated specimens
→ all-page reachability/state scan
→ representative page verification
→ reconciliation and candidate contracts
```

Existing Penpot test objects are not decoder inputs. The decoder stops before Penpot materialization or production refactoring. See [`source-first-component-decoder.md`](source-first-component-decoder.md).

## 7. Native resource requirements

When the first resources are later materialized:

- every reusable UI resource is a native Penpot component master or variant component;
- icon masters are native vectors, not screenshots;
- composite components and product patterns use nested instances;
- archetypes use managed patterns/components rather than detached copies;
- product representations remain linked to the underlying native graph;
- screenshots stay on evidence pages and never substitute for component identity.

## 8. Structural states and fixtures

State modelling separates:

```text
structural variants/states
  anatomy, layout, visibility, behavior and semantics

content fixtures
  real text, images, dates, places and stress data
```

The system stores supported axes, valid/invalid combinations, curated required scenarios, production-observed fixtures, stress fixtures and explicit missing coverage. It does not generate a full Cartesian product.

## 9. Product graph entities

Canonical design-side records include at least:

```text
DesignResource
ComponentContractRef
ComponentVariant
ContentFixture
ProductPattern
PageArchetype
ProductScreen
ProductScreenState
ScreenComponentInstance
ScreenTransition
UXFlow
RuntimeEvidence
ReviewThread
Gap
Decision
AcceptanceReceipt
PromotionReceipt
RollbackReceipt
AcceptedExport
```

A ProductScreen is not an independent mockup. It references exact component variants, one archetype, fixture, viewport, flow steps, evidence and authority status.

## 10. Exact Penpot page model

The validated Resource Graph contains the following exact pages in this order:

```text
00 — System map
05 — Recent changes
10 — Brand assets
15 — Methodology and contracts
20 — Foundations
25 — Iconography
30 — Core UI resources
40 — Announcements components
50 — Product patterns
60 — Page archetypes
62 — Product representations
64 — Product state matrices
66 — UX flows and transitions
68 — UI gaps, comments and decisions
70 — Coverage and fragmentation
80 — Candidate review and promotion
89 — Review archive
90 — Evidence / desktop
91 — Evidence / tablet
92 — Evidence / mobile
93 — Evidence / interaction and accessibility
94 — Accepted exports and test references
99 — MCP diagnostics and sandbox
```

The machine-readable required zones are the authoritative detail. High-level page responsibilities follow.

### `00 — System map`

Current reconstruction status, topology, authority modes, lifecycle, operation channels and complete page index.

### `05 — Recent changes`

Machine-generated material changes grouped by iteration/package and calendar date. Metadata refresh, comment-only updates, layout noise and repeated catalog reads are not design changes.

### `10 — Brand assets`

Brand marks, lockups, channel/PWA/email/social assets, provenance, rights and usage constraints.

### `15 — Methodology and contracts`

Sources of truth, Component Contract model, authority/promotion, hierarchy, comment/gap lifecycle, MCP mutation classes, managed layout and rollback gates.

### `20 — Foundations`

Color, typography, spacing, sizing, radius, borders, elevation, grid, breakpoints, motion, accessibility and media foundations.

### `25 — Iconography`

System/action/navigation/status/social/transport/editorial/product icons, optical sizing, accessibility, provenance, licensing, duplicates and consumers.

### `30 — Core UI resources`

Generic actions, controls, navigation, status/feedback, overlays, disclosure, data display, utilities, interaction and responsive states.

### `40 — Announcements components`

Event cards, hero/media, facts/schedules, actions/registration/tickets, badges/medallions, participants/venues, transport, discovery/personalization/social proof, shelves/lists and stress fixtures.

### `50 — Product patterns`

Site shell, listing/timeline, search/results, event summary/action, registration/auth, favorites/personalization, collections/festivals, focus-group/feedback, partner/check-in, error/recovery patterns.

### `60 — Page archetypes`

Reusable contracts for Home, listings, search, event detail, collections/festivals, favorites/personal feed, focus group, partner/registration and unavailable pages.

### `62 — Product representations`

Real configured mobile/tablet/desktop screens, positive/negative states, authorization states, real fixtures and links to archetypes, instances, flows and evidence.

### `64 — Product state matrices`

Authorization, temporal, commerce/action, loading/empty/partial, error/offline/recovery, media, text stress, responsive, interaction and accessibility state coverage.

### `66 — UX flows and transitions`

Entry points, happy paths, auth branches, unavailable branches, external handoffs, errors/recovery, offline/permission states and screen-state references.

### `68 — UI gaps, comments and decisions`

Deduplicated comment intake, association, reproduced gaps, current/desired state, product/flow context, candidate links, impact reports, decisions, handoff and verification. Action-map hotspot, raw summary или generated overlay сами по себе сюда не попадают: accepted UI gap может быть создан только из reviewed finding со статусом `accepted`. This is explicitly **not a second backlog**.

### `70 — Coverage and fragmentation`

Source/family/native/variant/fixture/responsive/archetype/representation/flow/evidence coverage, duplicates, local overrides, promotion readiness and blockers.

### `80 — Candidate review and promotion`

Bounded packages from UI Exploration, candidate resource/archetype revisions, impact, shortlist, acceptance, implementation readiness, accepted/rejected/parked states and receipts.

### `89 — Review archive`

Resolved comments, closed gaps, historical revisions, rejected/parked candidates, deprecated resources, superseded archetypes, historical evidence and rollback history.

### `90–92 — Evidence / desktop, tablet, mobile`

Browser actual, owner-approved baseline, generated diff, component specimens, representations, archetypes, release/test identity and known noise. Для reviewed action-map evidence эти страницы содержат representative replay/render и page-level overlay соответствующего viewport; overlay всегда связан с immutable evidence package, scope, denominator и release/model/layout/component identities.

### `93 — Evidence / interaction and accessibility`

Interaction/accessibility traces, component-local action maps, semantic-zone summaries и activation/effect evidence. Component map сохраняет ссылку на точный Component Contract или reconstructed AS-IS identity, но не становится visual baseline.

Action-map evidence является runtime evidence. Ни page-level hotspot, ни component-local map, ни отсутствие ожидаемого эффекта автоматически не меняют Component Contract, не объединяют reconstructed families и не запускают promotion. Они могут стать входом reviewed finding; только явно принятый finding может создать accepted UI gap на странице `68`, после чего обычные review, decision и promotion gates продолжают действовать.

Canonical viewport IDs:

```text
mobile-390x844
mobile-430x932
tablet-768x1024
desktop-1280x800
desktop-1728x900
```

### `94 — Accepted exports and test references`

Accepted component/pattern/archetype exports, manifests, hashes, Astro specimen refs, runtime comparison refs, Actions test IDs, implementation packages and approval receipts.

### `99 — MCP diagnostics and sandbox`

Connection/read traversal, comment ingestion, metadata validation, bounded write/reflow/collision/rollback tests and a disposable noncanonical sandbox.

## 11. Managed spatial layout contract

```text
managed page
→ one root board
→ managed zones
→ stable wrapper boards
→ resources, instances, specimens and annotations
```

Each managed object records stable ID, schema version, zone, sort/layout slot, ownership bounds, minimum gap, overflow policy, authority mode and source/contract hash where applicable.

Rules:

- targeted patch does not move objects outside its owned wrapper;
- zone reflow moves only managed siblings of that zone;
- exploration/manual areas are never overwritten by routine sync;
- comment-bearing wrappers are identity anchors and should be preserved;
- overflow expands/wraps deterministically rather than overlapping neighbours;
- every write records before/after bounds and runs collision/off-canvas/clipping checks;
- topology changes use rematerialization rather than coordinate nudges.

## 12. Comment ingestion and routing

MCP comment reading was verified independently of the currently open page. Full page traversal returned the same file-level threads repeatedly, therefore ingestion is file-scoped first.

Primary dedupe key: stable Penpot thread ID/sequence. Fallback:

```text
normalized author
+ created_at
+ normalized initial text
+ origin page
+ origin board/frame
```

The open page never overwrites origin metadata. Association order:

1. direct shape/component identity when available;
2. origin board;
3. exact managed wrapper/resource ID;
4. smallest containing managed bounds;
5. ambiguous/manual triage.

Low-confidence nearest-object guesses are not accepted silently. MCP may propose, patch and reply with evidence, but does not resolve comments without explicit owner acceptance.

## 13. UI gap lifecycle

```text
observed
→ reproduced
→ understood
→ proposed
→ designed
→ accepted or rejected
→ implemented
→ verified
→ closed
```

Gap records retain product, resource, archetype, representation, flow, evidence, review, severity, acceptance, implementation and verification references. Candidate decisions do not overwrite reconstructed or accepted resources.

Для action-map evidence lifecycle начинается вне gap registry:

```text
immutable evidence package
→ reviewed finding: accepted | rejected | insufficient-data
→ accepted finding
→ optional accepted UI gap on page 68
→ normal proposal / design / acceptance / implementation lifecycle
```

Hotspot не является finding, а finding не является contract revision или promotion receipt. Rejected/insufficient findings остаются evidence history и не материализуются как accepted UI gaps.

## 14. Operation channels

### GitHub Actions

Used for corpus-wide deterministic work:

- source/component inventory;
- graph construction;
- icon/media analysis;
- decoder/IR generation and validation;
- route/viewport capture;
- visual diffs;
- large export batches;
- full referential/collision checks;
- immutable artifact/receipt packaging.

### Resource Graph plugin

Used for reproducible bulk materialization, reconciliation, recovery and stable publication from an accepted package/IR.

### Penpot MCP

Used for scoped inspection, comments, candidate construction, targeted patch, bounded reflow, page rematerialization, diagnostics and focused evidence.

Plugin and MCP must consume one contract/IR and use operation locks. They do not own independent catalogs.

## 15. MCP write protocol

Operation classes:

```text
patch
reflow-zone
rematerialize-page
rebuild-file
```

Safe transaction:

1. read revision, page, metadata and target identities;
2. resolve resource/comment/gap/downstream impact;
3. produce dry-run plan and allowed movement scope;
4. create rollback point for non-trivial batch;
5. use one bounded undo transaction;
6. preserve stable comment-bearing wrappers;
7. apply deterministic layout rules;
8. validate references and component/variant links;
9. validate overlap/off-canvas/clipping/overflow/minimum gap;
10. export focused before/after evidence;
11. write changed-resource manifest and rollback ref;
12. leave candidate until explicit promotion.

## 16. Currentness model

A single green `CURRENT` badge is forbidden. Independent dimensions:

```text
production/source evidence
resource library
iconography
component/state coverage
pattern composition
archetype composition
product representations
UX-flow coverage
runtime evidence
review
promotion/authority mode
```

## 17. Baseline and test policy

```text
accepted Penpot specimen/export
→ immutable visual reference manifest

browser actual
→ screenshot + diff + functional/interaction/accessibility results
```

Actual does not auto-update baseline. A screenshot proves browser rendering; component/archetype/representation graphs explain construction and user state. All are required.

## 18. Promotion gate

A family is promoted only when:

1. current source consumers are inventoried at one exact SHA/release;
2. candidate Component Contract is reviewed and accepted;
3. native Penpot masters/variants exist with stable IDs;
4. canonical Astro implementation uses the same version/hash;
5. patterns/archetypes use nested instances;
6. state/responsive/media/stress coverage is explicit;
7. real product representations and relevant UX branches exist;
8. repeat materialization is idempotent;
9. comments/gaps are associated and reviewed;
10. three-way conformance passes;
11. accepted exports/tests are deterministic enough for the intended gate;
12. rollback is proven;
13. explicit owner acceptance receipt exists;
14. no unresolved critical gap contradicts the contract.

A successful extraction or visually plausible Penpot object is never sufficient alone.

## 19. Current stop boundary

At revision 30 the structure is complete but content is empty. The next approved stage is decoder implementation and evidence generation. Before decoder review, do not:

- materialize components;
- restore old Penpot resources;
- use old IDs;
- import runtime screenshot corpora;
- declare baselines;
- promote families;
- refactor production UI under an assumed component model.
