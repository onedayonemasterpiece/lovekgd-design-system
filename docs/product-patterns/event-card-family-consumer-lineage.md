# Event-card family: corrective consumer lineage

Status: `BOUNDED_CENTRALIZATION_VERIFIED / GLOBAL_LINEAGE_OPEN / OWNER_REREVIEW_REQUIRED`

`OV-08`, `OV-30`, `OV-58` and current owner correction `OV-59` require
technical lineage, not visually similar page-local roots.

## Authority

**SoT UI is the central system.** It owns semantic family identity,
representation contracts, shared primitives, versioning, fixture authority and
propagation rules.

- Penpot materializes library masters and linked instances for review.
- Astro implements executable representation adapters.
- Neither Penpot nor Astro may create an independent competing family identity.
- An accepted Penpot change returns to SoT UI before both projections update.

Current correction:
[`../reviews/owner-text-sot-ui-centrality-correction-20260829.md`](../reviews/owner-text-sot-ui-centrality-correction-20260829.md).

## Target family boundary

Astro may retain separate adapters where runtime anatomy and interaction differ:

1. `EventCard.astro` — general large event preview;
2. `ListingEventCard.astro@9` — compact desktop listing representation;
3. `MobileListingRailRow.astro` inside `MobileListingRailSurface.astro` —
   intrinsic horizontal track;
4. `FestivalCard.astro` — festival-specific semantic renderer.

These are representations of one navigable semantic event-card system, not
permission for route-local visual forks. They must expose exact identity/version
and share SoT-backed primitives wherever the contract says they do.

Event content is fixture/state override, not component identity.

## Penpot placement rule

- masters and state catalogs live on bounded library pages;
- archetypes contain linked instances;
- page-local masters beside an archetype are forbidden;
- detached terminal copies and screenshots-as-components are forbidden;
- visual similarity never proves lineage.

The owner voice's instruction to separate component types from archetypes means
separating **masters/catalogs**, not removing linked component instances from
real page compositions.

## What is already proven

Later source-bound receipts prove bounded corrections:

- Date and Weekend compact cards:
  `catalog/reconstruction-atlas/v1/listing-event-card-centralization-20260829.v1.json`
  — structural correction verified;
- Popular compact cards:
  `catalog/reconstruction-atlas/v1/popular-listing-event-card-centralization-20260829.v1.json`
  — structural PASS, visual QA partial;
- Festival cards:
  `catalog/reconstruction-atlas/v1/festival-card-centralization-20260829.v1.json`
  — bounded owners componentized and linked;
- mobile listing Rail:
  nested former-component copies migrated to canonical Rail/media ancestry;
- related/collection/archetype consumers:
  source-bound contracts and receipts routed through `docs/reviews/index.md`.

These are real bounded proofs. They do not establish one globally accepted
technical ancestor across every representation and page.

## Fixture dependency

Lineage evidence must reference SoT-governed fixture records. The current
8-event component corpus and disjoint 5-event archetype pool are an open
fixture-authority unification gap. A card can have correct Penpot ancestry while
a cross-level parity claim is still invalid because fixture authority differs.

Status: `SOT_FIXTURE_AUTHORITY_UNIFICATION_OPEN`.

## Current global closure gate

Global closure requires:

- one semantic family registry with explicit representation owners;
- one canonical SoT fixture authority or explicit supersession links;
- zero unauthorized page-local alternative masters;
- zero detached terminal copies;
- exact source/version/fixture bindings for every consumer;
- actual owner-descendant readback, not component-main-only evidence;
- focused visual parity for every required state/viewport;
- explicit owner acceptance;
- per-family promotion and complete Astro consumer migration.

The machine-readable map remains
[`consumer-lineage.v1.json`](../../catalog/ui-components/event-card-family/consumer-lineage.v1.json).
Its global Penpot root UUID remains null because no complete all-consumer proof
exists; IDs must not be fabricated.

## Status semantics

- bounded centralization: verified for named scopes;
- fixture authority across levels: open;
- global lineage closure: open;
- owner acceptance: not claimed;
- family promotion / production migration: not authorized.

A green Astro test, one Penpot export, visual similarity or `validate()=[]` never
closes the lineage gate by itself.
