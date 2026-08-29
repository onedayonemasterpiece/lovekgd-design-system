# Event-card family: corrective consumer lineage

Status: `BOUNDED_CENTRALIZATION_VERIFIED / GLOBAL_LINEAGE_OPEN / OWNER_REREVIEW_REQUIRED`

`OV-08`, `OV-30` and the later owner voice
`voice-20260829-201612-4feb9e87` require technical lineage, not a set of
visually similar page-local roots. This record supersedes the earlier *candidate*
choice to treat `event.card`, `listing.event-card` and `listing.rail-row` as
unrelated visual systems.

## Target boundary

Astro may retain separate implementation adapters where runtime anatomy and
interaction really differ:

1. `EventCard.astro` — general large preview;
2. `ListingEventCard.astro@9` — compact desktop listing representation;
3. `MobileListingRailRow.astro` inside `MobileListingRailSurface.astro` —
   intrinsic horizontal track;
4. `FestivalCard.astro` — festival-specific semantic renderer.

They must still be navigable members of one semantic event-card family, share
source-backed primitives where the contract says they do, expose exact
representation/version IDs and avoid route-local visual forks. Event content is
an instance override, not a component identity axis.

In Penpot, library masters/state catalogs belong on bounded component pages and
archetypes consume linked instances. The prohibition is against page-local
masters, detached terminal copies, screenshots-as-components and lookalikes
without lineage — not against placing linked component instances inside an
archetype.

## What is already proven

The old status `PARTIAL_SOT / PENPOT_PAUSED` is no longer current. Later
source-bound receipts on this branch prove bounded corrections:

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
  nested former-component copies were migrated to canonical Rail/media ancestry;
- related/collection/archetype consumers:
  source-bound contracts and receipts exist in `catalog/reconstruction-atlas/v1/`
  and are routed per item through `docs/reviews/index.md`.

These receipts prove real progress; they do **not** prove one globally accepted
technical ancestor across every event-card representation or every page.

## Current open gate

Global closure still requires a fresh exact-ID census over the complete bounded
consumer set, with:

- one recorded semantic family registry and explicit representation owners;
- zero unauthorized page-local alternative masters;
- zero detached terminal copies;
- exact source/version/fixture bindings for every claimed consumer;
- structural readback of actual owner descendants, not only component mains;
- focused visual parity for every required state/viewport;
- explicit owner acceptance followed by per-family promotion.

The current machine-readable map remains
[`consumer-lineage.v1.json`](../../catalog/ui-components/event-card-family/consumer-lineage.v1.json),
but its `canonical_component_id: null` is intentional: no global Penpot family
root UUID is fabricated from the bounded receipts.

## Status semantics

- bounded centralization: **verified for named scopes above**;
- global lineage closure: **open**;
- owner acceptance: **not claimed**;
- family promotion / production migration: **not authorized**.

Visual similarity, a green Astro test, one Penpot export or `validate()=[]` never
closes the lineage gate by itself.
