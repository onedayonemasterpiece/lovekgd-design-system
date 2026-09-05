# LoveKGD Design System — post-baseline audits and Product Atlas checklist

> **Status:** mandatory companion to `design-system-progress-checklist.md`, `design-system-execution-sequence.md` and `design-system-planned-patterns-checklist.md`.  
> **Updated:** 25 August 2026.  
> **Boundary:** this checklist does not authorize automatic redesign, token merge, UI promotion or Penpot mutation.

## 1. Place in the delivery sequence

```text
production Astro AS-IS
→ stable Git UI semantic contracts
→ native Penpot AS-IS
→ exact Astro == Git SoT == Penpot baseline
→ audit evidence packs
→ independent color + typography audits
→ synthesis + owner decisions
→ Unified Design v1 candidates
→ Penpot + isolated Astro implementation
→ browser/device conformance
→ migration and promotion
```

Product Atlas follows a related but separate sequence:

```text
stable route/archetype/region IDs
+ Product Atlas Git model
→ Git-only Product Atlas linkage
→ Jobs / outcomes / journeys / capabilities / UI gaps
→ reviewed source and evidence locks
→ after the safe target/parity gate: explicit Penpot MCP materialization
→ exact read-back receipt
→ owner review
```

Product Atlas Git SoT does not wait for final visual unification. Its Penpot projection must not invent native bindings before a safe target and read-back exist.

Canonical product meaning remains in `events-bot-new`. The design-system repository owns only UI foreign-key projection and visual/runtime conformance.

## 2. Independent audit principle

Foundation decisions cannot be accepted from one attractive board or one model opinion.

Minimum protocol for color and typography:

1. one exact evidence pack for every reviewer;
2. at least two independent passes that do not read each other first;
3. one visual pass with direct read-only archetype/Penpot access;
4. one source/runtime pass using Astro, generated HTML, computed styles, usage census and Git SoT;
5. one synthesis that exposes agreements, disagreements and owner decisions;
6. no majority-vote auto-acceptance;
7. merge/keep/split/deprecate is based on semantic role, real consumers, accessibility and product context, not value similarity alone.

## 3. Baseline entry gate for foundation audits

- [ ] 100% production routes are mapped to archetypes.
- [ ] 17/17 archetypes have stable semantic contracts.
- [ ] Desktop/mobile representations contain real UI, not metadata scaffolds.
- [ ] Astro and Penpot use the same fixtures/state/viewport.
- [ ] Stable component/archetype IDs link to Astro implementation and read-back Penpot IDs.
- [ ] Service-only resources are absent from product UI boards.
- [ ] Detached copies and unregistered terminal overrides are absent.
- [ ] Renderer/tool limitations are separated from design decisions.
- [ ] Owner review can reach exact UI objects and source evidence.

Before this gate, audit inventory and scripts may be prepared, but a visible difference cannot yet be classified confidently as a foundation problem.

## 4. Foundation Audit Pack v1

The same versioned pack is used for every independent reviewer.

Required:

- exact design-system, Astro and semantic SoT SHAs;
- exact Penpot file/revision and read-back receipt;
- direct references to 17 archetype pages and desktop/mobile representations;
- route/archetype/component/state/fixture IDs;
- generated HTML and browser-computed output;
- Astro source selectors/files;
- Penpot resources and actual instance usage;
- usage count and consumer list per value/role;
- representative screenshots;
- contrast/accessibility results;
- known renderer/API limits;
- explicit unresolved list;
- machine-readable current → candidate template.

Forbidden:

- [ ] token declarations without real consumers;
- [ ] Penpot library inventory without instance census;
- [ ] screenshot proxy treated as native component evidence;
- [ ] AS-IS observation mixed with candidate recommendation;
- [ ] rare values hidden from the census;
- [ ] values merged only by visual similarity.

## 5. Independent color audit

### Evidence census

- [ ] collect actual colors from Astro source and computed output;
- [ ] collect Git semantic roles;
- [ ] collect Penpot library values and actual instance fills/strokes/text;
- [ ] count use and consumer coverage;
- [ ] separate canvas, surface, text, border, action, brand, status, overlay, media-support and interaction roles;
- [ ] test default/hover/focus/active/disabled/error/success/warning;
- [ ] test contrast on real backgrounds;
- [ ] show use on representative archetypes;
- [ ] separate intentional editorial/artifact color from drift.

Every value receives one disposition:

```text
KEEP
MERGE_INTO_ROLE
SPLIT_BY_SEMANTICS
DEPRECATE
EXCEPTION_WITH_OWNER
UNRESOLVED
```

Perceptual distance can suggest clusters but cannot prove semantic identity.

Required output:

- [ ] current palette census;
- [ ] semantic role map;
- [ ] compact palette candidate;
- [ ] current → candidate mapping;
- [ ] justified exceptions;
- [ ] affected components/archetypes;
- [ ] contrast matrix;
- [ ] 3–5 baseline/candidate examples;
- [ ] migration/rollback;
- [ ] disagreements and owner decisions.

No production or canonical Penpot color changes occur before synthesis and owner decision.

## 6. Independent typography audit

### Evidence census

- [ ] collect family, size, weight, line-height, tracking, case and decoration from Astro/computed output;
- [ ] collect Git roles and Penpot instance values;
- [ ] count use and consumers;
- [ ] separate display/page title, section, card title, body, meta, label, control, data/time and long-form roles;
- [ ] test desktop/mobile branches;
- [ ] test Cyrillic, long Russian titles, addresses, dates, prices and controls;
- [ ] test line length, wrapping, truncation, vertical rhythm and density;
- [ ] separate renderer limits from design drift;
- [ ] verify real available weights/variable-font behavior.

Every current style receives one disposition:

```text
KEEP
MAP_TO_SEMANTIC_ROLE
MERGE
SPLIT_BY_CONTENT_JOB
DEPRECATE
EXCEPTION_WITH_OWNER
UNRESOLVED
```

A smaller token count is not a goal if hierarchy, readability or accessible reflow is lost.

Required output:

- [ ] current typography census;
- [ ] semantic role map;
- [ ] compact type scale candidate;
- [ ] current → candidate mapping;
- [ ] responsive/wrapping rules;
- [ ] justified exceptions;
- [ ] affected components/archetypes;
- [ ] 3–5 examples;
- [ ] migration/rollback;
- [ ] disagreements and owner decisions.

## 7. Actual skeleton/loading states

The existing screenshot archive is AS-IS evidence. Loading geometry must not be guessed from static pages.

```text
AS-IS baseline nearly closed
→ ingest skeleton archive
→ hashes + route/component/state mapping
→ loading-state audit
→ unified loading/skeleton design
```

Archive intake:

- [ ] preserve archive SHA-256 and manifest;
- [ ] identify source date, viewport and route/component/state;
- [ ] remove only proven duplicates/irrelevant frames;
- [ ] exclude secret/personal data;
- [ ] link each frame to archetype region and owner component/pattern;
- [ ] classify production, prototype, obsolete and unresolved;
- [ ] measure loading→content geometry shift;
- [ ] separate skeleton, progress, optimistic, empty and blocked states.

Required output:

- [ ] `skeleton-as-is-manifest`;
- [ ] route/component/state coverage matrix;
- [ ] missing/obsolete/duplicate list;
- [ ] representative evidence links;
- [ ] candidate loading vocabulary;
- [ ] redesign decision package.

Absence of the archive does not block all parity, but it blocks loading-state redesign.

## 8. Structured audits instead of one giant review

Use bounded passes:

1. color;
2. typography;
3. spacing/radius/elevation/grid;
4. controls/selectors/menus/overlays;
5. navigation/search/shell;
6. loading/feedback/status/accessibility;
7. product linkage.

Every pass uses the shared archetypes but has its own evidence pack, outputs and decision boundary.

## 9. Product Atlas authority and current implementation

Canonical product model:

```text
onedayonemasterpiece/events-bot-new/docs/product-model/atlas/v1/
```

Corrected UI foreign-key projection:

```text
catalog/product-atlas-ui-linkage-v1/
```

Active Product Atlas Penpot delivery:

```text
reviewed Git Product Atlas SoT
→ explicit scoped Penpot MCP task
→ exact target verification
→ bounded mutation
→ read-back
→ Git receipt
→ owner review
```

The historical Product Atlas delivery experiment is not an active architecture. Its contract, workflow and prototype are removed from the current UI-linkage child branch; history remains available in Git.

Product Atlas remains a separate Penpot file. Resource Graph does not receive product dashboards.

## 9.1 Gate P0 — Git-only Product Atlas SoT

- [x] production route → archetype mapping is 100% in corrected UI SoT;
- [x] 17 stable archetype IDs exist;
- [x] semantic regions and ProductScreenStates exist, with unresolved states explicit;
- [x] product authority is `events-bot-new`;
- [x] Product Atlas IDs do not derive from coordinates/display text;
- [x] future partner meaning remains `not_modeled`;
- [x] Product Atlas Git registry candidate exists in Draft PR `events-bot-new#574`;
- [x] all 17 archetypes have product foreign-key linkage in Draft child PR `lovekgd-design-system#51`;
- [ ] product and UI-linkage validation workflows are green;
- [ ] owner has reviewed entity boundaries/statuses and unresolved evidence.

A Draft PR is a candidate, not publication in `main` or outcome proof.

## 9.2 Git Product Atlas scope

- [x] user needs;
- [x] Jobs / Job Stories;
- [x] user and owner outcomes;
- [x] journeys, steps and recovery paths;
- [x] capabilities;
- [x] User Stories, operator jobs and technical enablers;
- [x] guardrails;
- [x] acceptance rules/scenarios;
- [x] stable domain events;
- [x] measurement questions;
- [x] product problems, UI gaps, findings and decisions;
- [x] independent implementation/release/runtime/evidence/outcome facets;
- [x] unresolved/not-modeled/binding-pending ledger;
- [x] exact product-to-UI context links;
- [ ] owner review and merge decision.

## 9.3 Minimum UI-side linkage

```yaml
product_links:
  product_entity_ids: []
  acceptance_scenario_ids: []
  measurement_question_ids: []
  route_or_route_pattern: ...
  archetype_id: ...
  semantic_region_id: ...
  pattern_id: ...
  component_id: ...
  product_screen_state_ids: []
  native_binding: binding_pending
  relation_status: proven | partial | unresolved | not_modeled | not_applicable
```

For every link preserve exact product/UI IDs, context/state, relation status, source lock and unresolved reason. Never copy product definitions into the design-system repository.

Generic component masters do not need one Job; meaning may belong to configured instance, pattern, archetype region or ProductScreenState.

## 9.4 Gate P1 — Penpot MCP materialization

- [ ] exact Product Atlas Git revision accepted for the requested scope;
- [ ] linked UI IDs stable enough for that scope;
- [ ] exact Product Atlas target file/page read through MCP;
- [ ] no assumed file/page/board/object IDs;
- [ ] bounded dry-run and impact scope reviewed;
- [ ] comment/unmanaged-object preservation defined;
- [ ] rollback/read-back procedure defined;
- [ ] raw analytics/production DB access absent;
- [ ] `binding_pending` retained for unresolved native identities;
- [ ] MCP receipt schema accepted.

No Penpot mutation belongs to P0. P1 is a later explicit task and must not run while another design task owns the target context.

## 10. Synthesis and Unified Design v1

After independent audits:

- [ ] build agreement/disagreement matrix;
- [ ] test recommendations on all 17 archetypes;
- [ ] assess effect on Product Atlas Jobs/outcomes and accessibility;
- [ ] choose bounded foundation candidates;
- [ ] show baseline/candidate on Date Listing, Event Detail, Search or better justified consumers;
- [ ] obtain owner decisions by exception;
- [ ] fix exact semantic contracts and migration plan;
- [ ] apply one version in Git SoT, Penpot and isolated Astro;
- [ ] run browser/device conformance;
- [ ] migrate selected consumers;
- [ ] enable drift gates.

Floating control islands, desktop search/menu and other redesign directions start only over this audit-ready baseline.

## 11. Review prompts

### Color audit

```text
Perform a read-only professional color-system audit using the exact Foundation Audit Pack. Use Astro computed values, Git roles, Penpot library and real instance usage, counts, contrast and representative archetypes. For every current value choose KEEP | MERGE_INTO_ROLE | SPLIT_BY_SEMANTICS | DEPRECATE | EXCEPTION_WITH_OWNER | UNRESOLVED. Separate OBSERVED, INFERRED and RECOMMENDED; do not accept a candidate or mutate Git/Penpot/Astro.
```

### Typography audit

```text
Perform a read-only professional typography audit using the exact Foundation Audit Pack. Include actual family/size/weight/line-height/tracking, Git roles, Penpot instances, consumer counts, Cyrillic, long Russian content, wrapping, density and accessible reflow. For every style choose KEEP | MAP_TO_SEMANTIC_ROLE | MERGE | SPLIT_BY_CONTENT_JOB | DEPRECATE | EXCEPTION_WITH_OWNER | UNRESOLVED. Separate OBSERVED, INFERRED and RECOMMENDED; do not mutate or accept candidates.
```

### Product Atlas MCP materialization

```text
Use only the accepted Product Atlas Git revision and corrected UI-linkage lock. Read the exact Product Atlas Penpot target through MCP before any write. Produce a bounded dry-run, preserve comments and unrelated objects, keep unknown bindings as binding_pending, mutate only the verified scope, read back every changed identity/relation and commit a Git receipt. Do not read production DB/raw analytics and do not infer product meaning in the design repository.
```

## 12. Closure criteria

- [ ] Astro == Git SoT == Penpot AS-IS baseline closed;
- [ ] color and typography evidence packs published;
- [ ] independent audits complete;
- [ ] synthesis and owner decisions complete;
- [ ] skeleton archive linked or an explicit loading-redesign blocker remains;
- [ ] Product Atlas product PR and UI-linkage child PR pass validation;
- [ ] Product Atlas entity/status review complete;
- [ ] Penpot MCP entry gate and receipt contract are verified;
- [ ] Unified Design v1 uses versioned accepted decisions;
- [ ] browser/device conformance and migration plan are ready.
