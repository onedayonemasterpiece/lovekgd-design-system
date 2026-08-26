# Source requirements on page archetypes

> Status: accepted source-mapping and Penpot publication contract.  
> Machine-readable contract: [`../contracts/page-archetype-requirements.v1.json`](../contracts/page-archetype-requirements.v1.json).  
> Product source map: `onedayonemasterpiece/events-bot-new/docs/features/static-site-pages/page-archetype-source-map.md` at merge SHA `3a7294328449375729e4d6ade29aada356acf3f5`.  
> Route evidence snapshot: `events-bot-new@0bfbc3f94a6a8bebd9d7c849c3699e3358efde30`.

## Decision

Every page-family zone on `60 — Page archetypes` may contain a managed **Source requirements and verified routes** overlay. It keeps the requirement that existed before or during implementation beside the future archetype, so a reviewer can answer four questions without leaving Penpot:

1. What user or product problem was this page meant to solve?
2. Which source document contains the complete requirement?
3. Which routes and Astro files currently implement the page family?
4. Which old, assumed or planned routes are not current evidence?

The overlay is not the archetype itself. It has:

```text
authority_mode: reconstructed
canonical: false
object_kind: source-requirements-overlay
visual_archetype_status: not accepted by this record
```

Product meaning remains in `events-bot-new` and Product Atlas. A future visual archetype must still pass candidate review, implementation and runtime conformance.

In the normative [family lifecycle](normalization/design-system-family-lifecycle.md), this overlay is evidence for `AS_IS_RECONSTRUCTED` only. It does not satisfy `PAGE_ARCHETYPE_CANDIDATE`, `PRODUCT_REPRESENTATIONS` or `FAMILY_AND_ARCHETYPE_PROMOTION`. Those states require a native instance graph, real configured screens and their own receipts.

## Owner-page materialization rule

A Penpot owner page used for Astro ↔ UI SoT ↔ Penpot review must obey all of the following:

- a full page board shows the complete vertical page content;
- desktop and mobile full page boards are arranged horizontally in one owner-page row;
- specimens, diagnostics, annotations and anatomy sit outside that full-page row;
- horizontal clipping is valid inside a real viewport for an intrinsic horizontal rail;
- horizontal clipping never justifies vertical truncation of a page board.

The rule controls review evidence placement only. It does not widen a mobile viewport, change runtime behavior, promote an archetype, or create a component contract.

## Why this belongs beside the archetype

A page composition without its original purpose is easy to copy but hard to evaluate. The source overlay prevents three common errors:

- treating current code as the complete product requirement;
- reviving historical routes as though they were current;
- accepting a visually plausible board that no longer solves the intended user task.

The full requirement is not duplicated into Penpot. Penpot holds a concise summary, exact source paths, pinned SHA, verified routes and gaps. Git remains the durable text authority.

## Verified route corrections

| Historical or assumed | Verified current state |
|---|---|
| `/search` | `/poisk/` |
| `/events/{id}` | `/sobytiya/{slug}/` |
| `/personal` | `/dlya-menya/` |
| `/collections/...` | `/podborki/`, `/podborki/{slug}/` |
| `/festivali/{slug}/` | absent on the pinned Astro snapshot; `/festivali/` only |
| `/vystavki/{slug}/` | absent on the pinned Astro snapshot; `/vystavki/` only |
| `/events/{id}/register` | unverified requirement gap |

## Page-family mapping

| Penpot zone | Requirement authority | Verified current routes |
|---|---|---|
| Home | static-site `README.md`; personal-feed contract | `/` |
| Today, tomorrow and dated listings | listing surface, personal-feed and schedule requirements | `/segodnya/`, `/zavtra/`, `/date-{date}/` |
| Weekend and special listings | listing surface and Popular contracts | `/vyhodnye/`, `/vyhodnye/{start}/`, `/populyarnoe/`, `/neobychnoe/` |
| Search | Smart Vector Search requirements and mobile shell | `/poisk/` |
| Event detail | event-page product/design and responsive media contracts | `/sobytiya/{slug}/`, `/sobytiya/{slug}/event.ics` |
| Collections, festivals and exhibitions | collections TO-BE, gastronomy, festival and exhibition contracts | `/podborki/`, `/podborki/{slug}/`, `/podborki/gastronomiya/`, `/festivali/`, `/vystavki/`, `/kluby-po-interesam/`, `/kluby-po-interesam/{slug}/` |
| Favorites and personal feed | schedule, favorites and personal-feed requirements | `/izbrannoe/`, `/dlya-menya/` |
| Focus group | focus-group programme and product contract | `/fokus-gruppa/` plus invitation, completion and diagnostics branches |
| Partner and registration | partner implementations plus unresolved registration requirement | `/partners/`, `/partnerstvo/`; registration route is a gap |
| Special/unavailable/closed | release and focus-group lifecycle contracts | `/zakrytaya-afisha/`; other states live in matrices/representations |

Cross-cutting zones record responsive obligations, Product Atlas/acceptance links, runtime consumers and coverage gaps. They do not create routes.

## Penpot object contract

Each overlay uses stable ID:

```text
rg.source-requirements.60.{entry-id}
```

Required visible sections:

```text
SOURCE REQUIREMENTS · ROUTES VERIFIED
Purpose before implementation
Source documents
Current routes and source files
Historical / missing route evidence
Pinned source identity
```

Required plugin metadata:

```text
managed = true
object_kind = source-requirements-overlay
stable_id = rg.source-requirements.60.{entry-id}
zone_id = rg.zone.60.page-archetypes.{entry-id}
authority_mode = reconstructed
canonical = false
source_repository = onedayonemasterpiece/events-bot-new
source_map_merge_sha = 3a7294328449375729e4d6ade29aada356acf3f5
route_snapshot_sha = 0bfbc3f94a6a8bebd9d7c849c3699e3358efde30
contract_schema_id = lovekgd.page-archetype-requirements.v1
```

The overlay is appended inside the existing managed zone. It may not replace the zone wrapper, move navigation, create a Penpot component, import a screenshot or mark the archetype accepted.

Publishing or refreshing an overlay never advances the family lifecycle or changes authority.

## Update rule

A route refresh must compare a new exact `events-bot-new` SHA with the contract. Changes are material only when a route is added, removed, renamed or rebound to another page family, or when a source requirement is superseded. A moving `main` label is never enough.

If source requirements and current implementation disagree, both are retained and the discrepancy is written to `Archetype coverage and gaps`. The implementation is not silently treated as the requirement, and the requirement is not silently presented as implemented.

## Acceptance of this publication

This publication is complete only when:

- all contract entries resolve to an existing managed Penpot zone;
- each overlay contains the pinned source identity and routes from the contract;
- historical and missing routes remain visually distinct from current routes;
- existing Resource Graph navigation and zone wrappers are preserved;
- no native component, variant, token or visual archetype is created;
- a read-back receipt records the created object IDs and validation counts.
