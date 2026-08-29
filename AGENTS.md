# Agent operating contract — LoveKGD Design System

## Start here

For every UI, component, archetype, Penpot or Astro synchronization task read:

1. `docs/static-site-design-system-current-state.md` — current authority and
   factual gaps;
2. `docs/reviews/index.md` — latest owner correction and per-item routing;
3. `docs/ui-source-of-truth-roundtrip.md` — cross-repository lifecycle;
4. `docs/ui-reference-fixture-registry.md` — fixture authority and current
   corpus-unification gate;
5. `docs/component-contract-authority.md` and the affected family contract;
6. the newest source-bound Penpot/Astro receipt.

Latest authority correction: `REV-CHAT-20260829-01` / `OV-59`.

Material visual component/foundation/archetype change → use project skill
`ui-three-way-conformance`.

Exact owner decisions outrank generated summaries and derived documentation.
Never rewrite historical source evidence to make a later decision look
pre-existing; use explicit supersession.

## SoT UI authority — critical

- **SoT UI is the central system.** Its current durable form is versioned Git
  contract/package data, tokens, behavior contracts, fixture registry, bindings
  and receipts in this repository.
- Penpot is a native visual projection and review surface. It is not a central
  system, independent SoT or release authority.
- Astro is the executable projection/consumer. Before family promotion, pinned
  Astro/runtime also remains evidence of current AS-IS behavior.
- Owner feedback or a visual edit in Penpot must return to SoT UI first. Only
  then may the same SoT version be materialized into Penpot and integrated into
  Astro.
- The intended propagation direction is `SoT UI → Penpot` and
  `SoT UI → Astro`. Direct Penpot → Astro propagation and bidirectional
  competing authority are forbidden.
- A Penpot-only fix, route-local Astro fork or visually similar unrelated root
  is not a design-system correction.

## Required round trip

```text
owner/product decision
→ SoT UI contract/package update
→ Penpot projection + Astro projection from the same version
→ exact structural readback
→ component/group/archetype visual parity
→ owner rereview and acceptance
→ per-family promotion
→ production consumer migration and post-deploy evidence
```

`CANONICAL_CODE_CANDIDATE`, Penpot acceptance, browser approval, promotion and
production verification are separate states.

## Fixture authority — critical

- One exact comparison uses the same fixture IDs, payload/media hashes, clock,
  locale, viewport, DPR and interaction state in Astro and Penpot.
- Target architecture has one SoT UI fixture authority with typed pools and
  named scenario subsets.
- Different entity types and scenario subsets are allowed; parallel unlinked
  event authorities are not.
- Current `8`-event component corpus and disjoint `5`-event archetype pool are a
  documented `SOT_FIXTURE_AUTHORITY_UNIFICATION_OPEN` gap. Do not present them
  as a finished single Golden Corpus.
- Page-local fixture arrays are forbidden except explicit legacy
  characterization.
- Dense/full production data remains Astro stress evidence; Penpot stays
  bounded and repeatable.

## Penpot review and evidence

- Penpot stores native foundations, reusable masters, linked instances and real
  desktop/mobile visual compositions. Operational dashboards and receipts stay
  in Git.
- Component masters/state catalogs belong on bounded library pages; archetypes
  consume linked instances. Do not create page-local masters beside an
  archetype.
- Screenshots are evidence, never components or implementation fills.
- Ingest comments file-scoped, bind to exact page/board/resource and deduplicate
  by stable source identity.
- A mutation is not acceptance. Thread resolution needs evidence; final visual
  acceptance remains explicit and human.
- Archetype evidence must inspect actual owner descendants. Component-main
  readback alone is insufficient.
- If a viewport clips content, materialize/read back required scrolled states
  and a full review projection.

## Repository boundary

This repository owns SoT UI contracts, decisions, component identity/version,
fixture authority, Penpot bindings/materialization receipts, accepted references
and the promoted package.

`events-bot-new` owns product/domain state resolution, the executable Astro
consumer, isolated candidate preview, release, production generation and
runtime evidence. It must not keep an independently editable fork of a promoted
component.

## Completion

- Never collapse structural PASS, visual PASS, owner acceptance, promotion,
  release and production verification into “done”.
- Validate changed contracts/receipts, run changed-scope tests and `git diff
  --check`, commit and push durable changes unless explicitly forbidden.
- Never fabricate IDs, revisions, hashes, links, fixture authority, validation,
  review or release evidence.
