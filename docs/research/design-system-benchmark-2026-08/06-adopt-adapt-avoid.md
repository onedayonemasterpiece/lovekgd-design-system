# 06 — Adopt, adapt, avoid

## 1. Adopt directly as working principles

### A-01. One identity, multiple audience views

From Consta, Paradigm, Gravity, Ростелеком.

Implement as generated/validated dossier views:

```text
overview
design
usage/content
code/API
accessibility
evidence
migration
```

### A-02. Purpose and selection guidance

Every resource explains user/job outcome, when to use, when not to use, neighboring resource and product capability.

### A-03. Layered tokens

From T2D2, Paradigm, Gravity, ViennaUI, Ростелеком.

```text
primitive → semantic → component → justified pattern → product/theme alias
```

### A-04. Explicit version, lifecycle and compatibility

From Consta, Taiga, Alfa, Ростелеком, Kontur. Every catalog/Penpot header has exact version/hash and compatibility, not just `latest`.

### A-05. Typed and validated pattern blocks

From Gravity Page Constructor and T2 Block library. A pattern requires schema, dependency graph, fixtures, examples and owner.

### A-06. Separate page archetype layer

From T2, Gravity, Taiga, Kontur, HSE, Ростелеком. Components cannot substitute page information architecture.

### A-07. Formal review packet

From Paradigm and ViennaUI, extended by LoveKGD evidence model. Review comments are exact, actionable and tuple-bound.

### A-08. Visible support and ownership

Every resource has owner, review route, last-reviewed date and blockers.

### A-09. Deprecation runway

From Alfa, Taiga, Ростелеком and Kontur. No silent removal or invisible supersession.

### A-10. Cross-role accessibility

From Госдизайн, Paradigm, Gravity and Kontur. Accessibility evidence is owned across design, engineering, content and QA.

## 2. Adapt, not copy

### AD-01. Consta theme sheets

Use side-by-side review, but generate it from one master/modes; do not maintain copies.

### AD-02. Consta stable/canary/deprecated

Use readable display badges, but derive them from exact LoveKGD 11-state lifecycle.

### AD-03. Paradigm local libraries

Allow a product-extension lane only with upstream binding, reason, expiry, owner, no-detach and reconciliation gate.

### AD-04. T2 Block library

Use patterns as a designer-accessible catalog, but require contract/schema/evidence; frequency alone is not promotion.

### AD-05. Gravity Page Constructor

Use machine schemas, typed blocks, fixtures and editor templates, but let archetype constraints control composition.

### AD-06. Taiga template repository

Use a separate archetype/template corpus with exact compatibility and candidate status; WIP is not accepted.

### AD-07. Elephas multi-framework core

Use one semantic contract and multiple adapters, but require adapter-specific semantics/a11y/interaction conformance.

### AD-08. Rostelecom engine/themes

Use engine and brand-theme separation, but a theme must never change component semantics.

### AD-09. BEM modifier decomposition

Use explicit code axes with a central valid-combination registry and contract-derived tests.

### AD-10. Public documentation portals

Use role-based discovery, examples and changelog, but docs render from exact registry and are not independent SoT.

## 3. Avoid

- **AV-01:** one huge Penpot file as authority;
- **AV-02:** separate Web/App design identities by default;
- **AV-03:** detached copies for accepted use;
- **AV-04:** duplicate editable themes;
- **AV-05:** full Cartesian variant matrix;
- **AV-06:** `type`/`variant` axes without semantics;
- **AV-07:** pattern as “big component”;
- **AV-08:** page archetype as screenshot or free template;
- **AV-09:** decorative examples as evidence;
- **AV-10:** documentation completeness as promotion;
- **AV-11:** silent deprecated resources;
- **AV-12:** raw design values in candidate masters;
- **AV-13:** auto-resolving Penpot comments;
- **AV-14:** visual diff as sole conformance;
- **AV-15:** global refactor before bounded pilot.

## 4. Prioritized adoption backlog

### P0 — Required before systematic Penpot population

1. Accept or revise SoT/resource-kind model.
2. Define machine schemas for component, pattern and page archetype metadata.
3. Add token layer/consumer policy.
4. Add Penpot root/dossier metadata schema.
5. Add review packet and comment protocol.
6. Add design/code/version compatibility field.
7. Define fixture and viewport registries.
8. Select one bounded evidence-ready pilot family.
9. Define one candidate pattern and one candidate archetype around the pilot.
10. Keep all outputs candidate/noncanonical.

### P1 — Required before first archetype candidate review

1. Generate dossier sections from contract.
2. Materialize native Penpot candidate and read back.
3. Create isolated code specimen matrix.
4. Create source-proven product representations.
5. Add responsive/page-state matrices.
6. Add a11y and content stress fixtures.
7. Produce owner review packet.
8. Record corrections and rerun validations.

### P2 — Required before scale

1. Catalog search/aliases/entity-kind cards.
2. Automated naming/axis parity.
3. Design/code/docs/test coverage dashboard.
4. Token drift and hard-value checks.
5. Template/archetype compatibility matrix.
6. Migration/deprecation portal.
7. Automated Penpot comparative sheets.
8. Bounded release and consumer adoption receipts.
9. Cross-adapter conformance if more platforms/frameworks appear.
10. Metrics: reuse, fragmentation, unknown states, local overrides, migration completion.

## 5. Review questions for the owner

1. Is Git contract/package accepted as normative identity center?
2. Is Penpot accepted as native implementation/review surface, not sole SoT?
3. Is `pattern` a required resource kind between component and archetype?
4. Is page archetype defined as a versioned composition contract?
5. Which token layers are allowed?
6. Are local/product extensions allowed, and under what expiry/reconciliation policy?
7. What evidence is mandatory before owner review?
8. What owner review result permits the next lifecycle transition?
9. Which bounded family has the strongest existing evidence for a pilot?
10. Which product route class should provide the first archetype representation?

No answer may be silently inferred by tooling.
