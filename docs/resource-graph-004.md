# Resource Graph 004

Resource Graph 004 is the next Penpot delivery after Runtime Review 003.2.

003.2 remains a verified transport and review mechanism: it can import exact runtime screenshots, preserve comments, recover from an interrupted sync and build deterministic prompts. It is not the final design-system model because its managed objects are raster boards rather than Penpot resources and component instances.

This document is the canonical operating contract for connecting three planes that must not evolve independently:

```text
design-system resources and component states
→ page archetypes and real product representations
→ UX flows, review comments, UI gaps and accepted improvements
```

The broader product representation schema is expanded in [`product-atlas-penpot-extension.md`](product-atlas-penpot-extension.md). This document owns the authority model, promotion gates, heavy-operation policy and safe MCP mutation protocol.

## Operating thesis

Penpot is not only a gallery of screenshots and it is not the sole source of truth for every fact. It is the visual product-design operating layer in a closed loop:

```text
source and runtime evidence
→ reconstructed resource graph
→ native Penpot components and compositions
→ product screens and UX flows
→ comments and structured gaps
→ candidate design decisions
→ owner acceptance
→ implementation handoff
→ runtime verification
→ updated evidence and authority status
```

The loop must support both the current recovery phase and the future design-system-led phase without changing object identities or inventing a second disconnected backlog.

## Required result

```text
one accepted production release
→ one machine-readable production and iconography inventory
→ one Penpot plugin update
→ native colors, typographies and icon resources
→ component and variant graph
→ composite product patterns assembled from instances
→ archetypes assembled from instances
→ real product representations at required viewports and states
→ UX flows linked to those representations
→ separate automated screenshot evidence
→ resource/component/archetype/screen/flow/evidence comments
→ structured gaps and candidate decisions
→ accepted visual exports for implementation verification
```

The product-side inventory contracts are maintained in `events-bot-new`:

- `site/src/data/design-system-production-surface-contract.v1.json`;
- `site/src/data/design-system-iconography-contract.v1.json`;
- `site/scripts/check-design-system-production-surface-contract.mjs`;
- `site/scripts/check-design-system-iconography-contract.mjs`;
- `docs/features/static-site-pages/design-system/penpot-resource-graph-004.md`.

This repository consumes the resulting immutable inventories. It does not rediscover current pages or icons from the old `/lab/design-system/` route.

## Two-state authority model

Resource Graph 004 has exactly two authority states:

```text
reconstructed
design-system-led
```

Migration may be mixed by resource family, but that does not create a third authority state. For example, Button may already be design-system-led while EventCard remains reconstructed. The system-level status is therefore derived from the authority status of its resource families rather than controlled by one unsafe global switch.

Every managed component family, pattern, archetype and product representation stores:

```text
authority_mode: reconstructed | design-system-led
authority_scope: resource-family identifier
promotion_status: not-ready | candidate | pilot | accepted
source_release_ref
source_ir_sha256
design_revision_ref
promotion_receipt_ref
rollback_ref
```

### State A — reconstructed

This is the initial state while the design system is being recovered from the latest accepted implementation and while the workflow for creating, accepting and implementing new UI decisions is not yet proven stable.

Rules:

- the accepted production source and runtime evidence describe what currently exists;
- IR and Penpot normalize that implementation, expose fragmentation and model missing states;
- a Penpot object must not be treated as normative merely because it has been generated;
- source-first UI changes remain possible, but they must be synchronized back into the reconstructed graph;
- visual diffs are diagnostic evidence unless an individual baseline has been explicitly accepted;
- candidate redesigns remain separate from current reconstructed resources;
- unresolved ambiguity is represented as a gap, not silently resolved by the importer or MCP operator.

The reconstructed state is not a disposable prototype. It must already use stable IDs, native components, variants, nested instances and machine-readable traceability so that accepted resources can later be promoted without rebuilding the system from unrelated drawings.

### State B — design-system-led

A resource family enters this state only after the design workflow has been proven end to end for that family.

Rules:

- the accepted design-system contract becomes normative for the promoted scope;
- new implementation must use the accepted components, variants, compositions and constraints;
- implementation changes require a prior or concurrent design-contract change, or an explicit temporary exception;
- accepted Penpot specimens and exports may become visual-regression baselines;
- runtime screenshots become conformance evidence rather than the origin of the design definition;
- implementation must never update an accepted baseline automatically;
- new UI decisions begin in candidate/exploration space, receive acceptance and are promoted before becoming canonical.

### Promotion gate

Promotion is per resource family or bounded vertical slice. It requires an explicit acceptance receipt and all of the following:

1. Current production consumers are inventoried at one exact source release.
2. Native Penpot masters and variants exist with stable resource IDs.
3. Composite patterns and archetypes use nested component instances rather than detached local copies.
4. Current states, responsive states, media strategies and required stress fixtures have explicit coverage.
5. At least one real product representation uses the resource at the required viewports.
6. Relevant UX-flow branches are represented, including negative and unavailable states.
7. A second materialization run is idempotent and reports zero unintended managed changes.
8. MCP comment reading, file-level deduplication and resource association work for the scope.
9. Candidate → acceptance → handoff → implementation → runtime verification has been proven.
10. Visual export and comparison are deterministic enough for the intended gate.
11. Rollback from a saved Penpot version and an immutable artifact has been tested.
12. No unresolved critical gap contradicts the proposed canonical contract.

A successful extraction run alone is not a promotion receipt.

## Canonical product-design chain

The graph must make this dependency chain queryable in both directions:

```text
tokens and foundations
→ primitives and icons
→ product components and variants
→ composite patterns
→ page archetypes
→ real product screens and states
→ UX flows and branches
→ comments and gaps
→ candidate decisions
→ accepted design contract
→ implementation and release
→ runtime evidence and metrics
```

A change to a lower-level resource must produce an impact report listing affected:

- component variants;
- composite patterns;
- archetypes;
- product screens and states;
- UX-flow steps and branches;
- accepted exports;
- runtime tests and evidence;
- unresolved comments and gaps.

A product representation is not an independent mockup. It references exact component variants, one archetype, content fixtures, route/evidence identity, viewport, related flows and current gaps.

## Production-only inventory

The catalog is accepted only when it identifies one exact production release by:

```text
repo_sha
build_id
run_id
snapshot_id
snapshot_sha256
catalog_sha256
```

Current inventory includes only:

- HTML routes found in that production artifact;
- source pages mapped to those routes at the same SHA;
- components transitively imported by those production page sources;
- icons referenced by those production-reachable components or the accepted artifact;
- brand assets emitted into the same release.

A component or icon that merely exists in Git but has no accepted production consumer is placed in candidate/coverage review, not in the current resource library. `/lab`, preview fixtures and deprecated implementations are excluded from current inventory.

## Native components, states and fixtures

Every reusable UI resource must be a native Penpot component master or variant component. A board, group or screenshot that only looks like a component does not satisfy the contract.

State modelling separates structural variants from content fixtures:

```text
structural variant
  changes layout, composition, behavior or supported options

content fixture
  provides real text, images, dates, places and data stress
```

For media-heavy components, exact image assets are fixtures, while image presence, aspect class, fit, crop, focal point, background continuation, poster mode and gallery behavior are component-state dimensions.

The system must not generate the full Cartesian product of every property. It maintains:

- supported structural variant dimensions;
- valid and invalid combinations;
- curated required scenarios;
- current-production fixtures;
- stress fixtures;
- a coverage matrix showing represented, missing and intentionally unsupported combinations.

A component state matrix may include:

```text
viewport
size and density
interaction state
content density
media kind and treatment
authorization state
temporal state
commerce/action state
loading, empty, partial and error states
optional nested elements
```

Composite components and patterns must be assembled from instances of lower-level components. A local hand-drawn substitute creates a first-class fragmentation gap.

## Iconography is a first-class plane

Iconography is not a handful of pictograms inside Foundations. Resource Graph 004 creates a dedicated page:

```text
25 — Iconography
```

It contains native vector component masters and documentation sections for:

- system and actions;
- navigation;
- status and feedback;
- social and external services;
- transport;
- festival and editorial categories;
- product-specialized symbols;
- optical alignment and size tests;
- accessibility semantics;
- duplicates, legacy and unclassified assets.

The machine-readable delivery contract is [`contracts/resource-graph-004.iconography.json`](../contracts/resource-graph-004.iconography.json).

Current icons are hierarchical native Resources, for example:

```text
Icon/UI/Share
Icon/Navigation/Search
Icon/Status/Warning
Icon/Social/VK
Icon/Transport/Bus
Icon/Editorial/Festival category/Theatre
Icon/Product/Artifact
```

A current icon master must retain source path/hash, source `viewBox`, optical size, semantic role, decorative/informative semantics, attribution/license, exact release identity and production consumers. Raster screenshots may document rendering evidence but are forbidden as icon masters.

Specimens show `16`, `20`, `24` and `32` px sizes, a `44` px control target, relevant states and light/brand/dark/status backgrounds. Publication is blocked when a production icon is unclassified, lacks provenance or consumer links, or an archetype uses an unlinked local copy.

PWA icons, favicon and channel lockups remain on `10 — Brand assets`; Iconography cross-links them without misclassifying them as generic UI icons.

## Product representations

An archetype is a structural model. A product representation is a real configured screen or state assembled from that archetype and native component instances.

Required representation dimensions include:

- viewport and responsive composition;
- content fixture;
- authorization state;
- temporal state;
- commerce/action state;
- loading, error, empty, partial and unavailable states;
- navigation context;
- runtime route and evidence;
- related UX-flow steps;
- review comments and unresolved gaps.

Canonical records include at least:

```text
ProductScreen
ProductScreenState
ScreenComponentInstance
ScreenTransition
ContentFixture
RuntimeEvidence
ReviewThread
Gap
Decision
AcceptanceReceipt
```

Each representation must answer:

```text
which user situation is shown?
which archetype structures it?
which component variants are instantiated?
which real data and media fixtures stress it?
which flow steps enter and leave it?
what source/runtime evidence exists?
what is still unresolved?
which authority state applies?
```

## UX flows and UI-improvement flow

UX flows connect product intent to actual screens and component states. They are not decorative arrows added after the screens have been drawn.

A flow record includes:

```text
flow_id
goal
entry_points
steps
transitions
branch_conditions
component_refs
archetype_refs
product_screen_refs
evidence_refs
review_refs
unresolved_gap_refs
```

Every important flow must include relevant branches such as unauthenticated access, missing contact data, sold-out or ended events, external services, failed requests, offline behavior and permission denial.

The UI-improvement lifecycle is:

```text
observed evidence or comment
→ deduplicated review thread
→ linked resource and product context
→ reproduced gap
→ understood cause
→ candidate component/archetype/flow decision
→ impact report
→ owner acceptance or rejection
→ implementation handoff
→ runtime verification
→ resolved review thread and closed gap
```

Comments and gaps are linked to the existing product graph; they do not become a second backlog of disconnected requirements.

## Screenshots remain first-class

Resource Graph 004 does not remove screenshots. It separates their responsibility.

### Resource and archetype pages

Contain:

- native Penpot colors;
- native Penpot typographies;
- native vector icon component masters and specimens;
- component masters;
- variant sets;
- component instances;
- product patterns;
- page archetypes assembled from those instances;
- source, version, status, consumer and coverage metadata.

### Product representation pages

Contain:

- real configured screens assembled from archetypes and native instances;
- mobile, tablet and desktop representations;
- positive, negative and unavailable states;
- realistic text and media fixtures;
- screen-to-flow and screen-to-evidence links;
- review and gap overlays that do not replace the native objects.

### Evidence pages

Contain screenshots generated by automated tests:

```text
90 — Evidence / desktop
91 — Evidence / tablet
92 — Evidence / mobile
93 — Evidence / interaction and accessibility
```

Evidence kinds:

- actual;
- owner-approved baseline;
- generated diff.

Canonical viewport IDs:

```text
mobile-390x844
mobile-430x932
tablet-768x1024
desktop-1280x800
desktop-1728x900
```

Every required archetype and product representation references its actual screenshots. When a baseline exists, it also references the baseline and a diff when actual differs. References include the automated test ID and exact release identity.

A screenshot proves what the browser rendered. An archetype explains which components, icons and variants produced the page. A product representation explains the user-facing configuration and state. All three are required.

## One-update plugin UX

The user opens the plugin once for an update. The plugin exposes no per-page, per-icon or per-file workflow.

Maximum actions:

1. `Проверить актуальность` — optional because preflight runs on plugin open.
2. `Обновить дизайн-систему` — the only mutation command.
3. `Собрать промпт по комментариям` — review output.

The machine-readable interaction contract is [`contracts/resource-graph-004.plugin.json`](../contracts/resource-graph-004.plugin.json).

`Обновить дизайн-систему` internally performs all phases:

```text
validate one catalog
→ recover interrupted staging
→ colors
→ typographies
→ icon inventory, native masters and specimens
→ component masters
→ variants
→ patterns
→ archetypes and icon-consumer links
→ product representations and state matrices
→ UX-flow links
→ desktop/tablet/mobile/interaction evidence
→ cross-links
→ comments and review snapshots
→ final verification
```

Internal batching, retries and page switching remain invisible orchestration details. They never become repeated user steps.

## Penpot page model

```text
00 — System map
10 — Brand assets
20 — Foundations
25 — Iconography
30 — Core UI resources
40 — Announcements components
50 — Product patterns
60 — Page archetypes
62 — Product representations
64 — Product state matrices
66 — UX flows and transitions
68 — Product review and flow gaps
70 — Coverage and fragmentation
80 — Candidate review
89 — Review archive
90 — Evidence / desktop
91 — Evidence / tablet
92 — Evidence / mobile
93 — Evidence / interaction and accessibility
99 — Technical tests
```

Resource, pattern, archetype and product documentation uses parent boards with native flex/grid layout. Objects are not left as unrelated boards on an infinite canvas.

## Managed spatial layout contract

MCP and plugin mutations must operate on an explicit layout model rather than moving objects by ad hoc coordinates.

The hierarchy is:

```text
managed page
→ managed zones
→ stable resource wrapper boards
→ component masters, instances, specimens and annotations
```

Each managed wrapper stores plugin data equivalent to:

```text
managed_by
schema_version
resource_id
zone_id
layout_slot
sort_key
owned_bounds
minimum_gap
overflow_policy
authority_mode
source_ir_sha256
```

Required zones include, where relevant:

- overview and metadata;
- native master;
- variant matrix;
- real fixtures and stress specimens;
- responsive compositions;
- product consumers;
- runtime evidence references;
- gaps and comments;
- candidate decisions;
- reserved manual/exploration space.

Rules:

- a targeted mutation may not move unrelated objects outside its owned wrapper;
- a zone reflow may move only managed siblings inside that zone;
- manual/exploration zones are never overwritten by a routine sync;
- comment-bearing wrapper boards are identity anchors and should be preserved while their children are patched;
- overflow is handled by deterministic wrapping or zone expansion, not by overlapping neighboring boards;
- every mutation records before/after bounds and runs collision, off-canvas and minimum-gap checks;
- topology changes use page rematerialization from IR rather than a chain of fragile coordinate nudges.

## Currentness model

One green `CURRENT` badge is replaced by independent dimensions:

```text
Production source
Resource library
Iconography
Archetype composition
Product representation
UX-flow coverage
Evidence
Coverage
Review
Authority mode
```

This prevents a technically current screenshot mirror from hiding an incomplete component inventory, an untested responsive state or a reconstructed resource that has not yet become normative.

## Verified MCP comment ingestion

The official MCP path has been verified to read comments independently of the currently open page.

Observed behavior on 8 August 2026:

- the current page was `40 — Announcements components`;
- MCP still retrieved unresolved threads originating on `30 — Core UI resources`;
- the same file-level threads were returned during each page traversal;
- after deduplication there were two unique unresolved Button-related threads, not one copy per page.

Therefore comment ingestion is file-scoped first and page-scoped second.

The primary deduplication key is the stable Penpot thread ID or sequence number. If a transport omits a stable ID, the fallback signature is:

```text
normalized author
+ created_at
+ normalized initial text
+ origin page
+ origin board/frame
```

The record preserves these fields separately:

```text
file_thread_id
origin_page_id
origin_board_id
origin_frame_name
observed_from_page_id
position
resolved
comments[]
resource_association
association_confidence
```

The currently open page must never overwrite the origin page. Repeated discovery on several pages must never multiply comment counts.

Resource association follows this order:

1. direct shape or component identity, when exposed;
2. origin board identity;
3. exact managed wrapper/resource ID at the position;
4. spatial inference inside the smallest managed bounds;
5. explicit ambiguous/manual triage result.

No low-confidence nearest-object association is silently accepted.

## Comment routing

Comments target the selected level:

- color/typography resource comment → token and all consumers;
- icon master/variant comment → shared icon, provenance and all consumers;
- icon instance comment → icon master plus exact archetype context;
- icon collection comment → optical consistency, licensing or fragmentation policy;
- component master/variant comment → shared component and all archetypes;
- instance comment → shared component plus exact archetype/product-screen context;
- pattern comment → product composition/user task;
- archetype comment → page composition and route family;
- product-screen comment → configured state and flow context;
- UX-flow comment → transition or branch behavior;
- screenshot/diff comment → runtime regression or local override.

The generated review package includes resource IDs, variant values, source files, production identity, consumers, archetype/screen/flow/evidence references and Penpot thread IDs.

MCP may read, deduplicate, classify, associate and summarize comments, propose changes and reply with evidence. It must not automatically resolve a thread merely because a mutation was made. Resolution requires explicit owner acceptance or instruction.

## Gap and decision model

A gap progresses through:

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

A gap stores:

```text
gap_id
resource_refs
archetype_refs
product_screen_refs
flow_refs
evidence_refs
review_refs
severity
current_state
desired_state
proposed_solution
acceptance_criteria
implementation_refs
verification_refs
```

A candidate decision never overwrites the reconstructed or accepted canonical resource. It stores an impact report and remains in `80 — Candidate review` until accepted.

## Heavy operations belong in GitHub Actions

Long, corpus-wide and deterministic operations should run in GitHub Actions and produce immutable artifacts. This is a core architecture rule, not only a performance optimization.

Use Actions for:

- production/source discovery and full component inventory;
- transitive consumer graph construction;
- icon and media analysis;
- complete IR generation and schema validation;
- expansion of required scenario matrices;
- full route and viewport screenshot capture;
- visual diff generation;
- large export batches;
- collision and referential-integrity reports across the complete graph;
- packaging of source, evidence and design manifests;
- reproducibility checks and release receipts.

Each heavy run should publish a compact reviewable package containing:

```text
canonical IR
manifest and schema version
source and runtime provenance
checksums
validation results
change summary
coverage and gap summary
sample previews
machine-readable error report
```

MCP and an interactive agent should consume the summary and exact requested slices rather than repeatedly reading or reasoning over the entire corpus. This preserves interactive capacity for design judgement, comment triage, bounded edits and acceptance analysis.

GitHub Actions does not replace MCP or the Penpot plugin:

```text
GitHub Actions
  heavy deterministic extraction, validation and packaging

Penpot plugin
  reproducible bulk materialization from an accepted package

MCP
  scoped inspection, comments, exploration, bounded mutations and review
```

## Interpretation of the latest extraction run

Workflow run `31242437901`, job `93065530845`, completed successfully on 8 August 2026. Its successful steps included source/evidence checkout, component inspection, public fixture validation, IR build, IR validation, summary and the artifact-upload step.

This is useful evidence that the current extraction pipeline can execute and validate a machine-readable package. It does **not** yet prove:

- semantic completeness of the component/state inventory;
- native Penpot master and variant materialization;
- nested composition of patterns and archetypes;
- product representation or UX-flow coverage;
- safe comment association;
- idempotent mutation of a real Penpot file;
- candidate/accepted separation;
- visual-baseline determinism;
- artifact retention and downstream accessibility;
- readiness to promote any resource family to design-system-led authority.

The run should be retained as reconstruction evidence and as an input to a pilot, not treated as the final design system.

## MCP operating model after population

MCP is an interactive operator over the live Penpot graph. It is not a second batch renderer and it must not improvise global canvas layout.

### Operation classes

Every write declares one class before mutation:

```text
patch
  change properties, text, media, tokens or a variant inside one stable wrapper

reflow-zone
  deterministically repack managed siblings inside one bounded zone

rematerialize-page
  rebuild one managed page or major section from IR after a topology change

rebuild-file
  exceptional schema migration only; never the default response to a local comment
```

Whole-page redraw is not used for a local component correction. Conversely, a structural schema change is not implemented through hundreds of coordinate nudges.

### Safe MCP transaction

A write follows this protocol:

1. Read the current file revision, page, managed metadata and target identities.
2. Resolve the exact resource, variant, product representation, comment/gap and downstream impact scope.
3. Produce a dry-run mutation plan including operation class and objects allowed to move.
4. Save a named Penpot file version for rollback before a non-trivial batch.
5. Use one undo transaction for the bounded mutation.
6. Prefer patching children inside stable, comment-bearing wrapper boards over deleting the wrappers.
7. Apply deterministic layout rules for the affected wrapper or zone.
8. Validate Penpot referential integrity, component/variant links and graph references.
9. Run overlap, off-canvas, clipping, overflow and minimum-gap checks.
10. Export focused before/after evidence and a changed-resource manifest.
11. Link the result back to comments, gaps and affected product contexts.
12. Leave the change in candidate state until explicit owner acceptance.
13. Promote or roll back through a separate explicit action.

A result report includes all changed Penpot IDs, resource IDs, old/new bounds, authority state, impacted consumers, validation output and rollback reference.

### Future MCP skill contract

A dedicated skill should eventually expose bounded operations such as:

```text
inspect
test-comment-ingestion
triage-comments
propose
patch
reflow-zone
rematerialize-page
validate
export-evidence
promote
rollback
```

The skill must enforce:

- read before write;
- explicit mutation scope;
- managed-zone ownership;
- stable wrapper identities;
- no silent detach of component instances;
- no automatic accepted-baseline replacement;
- file-level comment deduplication;
- transaction, validation and rollback receipts;
- explicit reporting of every affected product context.

The skill is a later implementation item. This document does not create a coding-agent task for it.

## Recommended first vertical-slice pilot

The first MCP-native pilot should be deliberately smaller than EventCard but must exercise the full chain.

Recommended scope:

```text
Button / ActionButton component family
→ EventActionPanel composite pattern
→ Event detail action archetype region
→ real product states
→ event-action UX flow
→ existing Button review comments
```

Why this scope:

- two real unresolved comments already exist around Button states;
- Button is small enough to test safe native variants and targeted edits;
- EventActionPanel proves nested component composition;
- real event states prove product representation rather than isolated components;
- the action flow proves screen-to-transition linkage;
- the scope is bounded enough to test layout, idempotency, comments, export and rollback before touching the combinatorial EventCard family.

Minimum pilot states:

- primary/default, hover, focus, pressed, disabled and loading;
- icon/no-icon and hug/fill width where production requires them;
- current `Smoke`/surface contexts that are actually in use;
- free registration;
- paid/external ticket action;
- sold out;
- event ended;
- authorization required;
- failure and recovery;
- mobile and desktop representations.

Pilot exit criteria:

1. Native component masters and a valid variant set exist.
2. EventActionPanel is assembled from Button instances.
3. Product screens use the pattern at mobile and desktop sizes.
4. One branching UX flow links the screens and states.
5. The two existing comments are deduplicated and associated without guessing.
6. A candidate correction is made through a bounded MCP operation.
7. A second run is idempotent.
8. Focused exports and runtime evidence can be compared.
9. Rollback is proven.
10. Owner acceptance can promote the Button family without promoting unrelated reconstructed resources.

The pilot is a review proposal only. No Penpot reconstruction, bulk redraw or coding-agent implementation begins from this document alone.

## Non-goals before consolidated review

Until this operating model is reviewed, do not:

- create a coding-agent implementation task;
- reset or bulk-rebuild the live Penpot file;
- promote the full design system to design-system-led authority;
- treat the successful extraction run as semantic acceptance;
- generate the complete EventCard state space;
- close existing comments automatically;
- enable a visual regression gate from unaccepted baselines;
- make Product Atlas screens independent copies of design-system components.

## Acceptance

Resource Graph 004 is accepted only after a real-file test proves:

- one plugin opening;
- at most three user actions for a bulk update;
- one production inventory, not stale `/lab` data;
- native colors, typographies, components and variants;
- `25 — Iconography` with native current icon masters;
- zero unclassified production icons;
- icon source/provenance, consumer and archetype links;
- required composite patterns and archetypes composed from instances;
- real product representations at required mobile/tablet/desktop states;
- UX flows linked to screens, components and evidence;
- automated actual/baseline/diff screenshots on separate evidence pages;
- working archetype/product-screen-to-evidence navigation;
- file-level comment deduplication and correctly scoped review packages;
- managed-zone mutation without accidental overlap or unrelated movement;
- crash recovery without page-by-page continuation;
- a second preflight with zero pending managed changes and explicit coverage gaps;
- candidate and canonical resources remain distinct;
- one bounded family completes the promotion gate and can be rolled back;
- no resource is declared design-system-led without an explicit promotion receipt.
