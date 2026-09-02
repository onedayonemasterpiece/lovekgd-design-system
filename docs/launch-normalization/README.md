# KenigEvents UI normalization — 48-hour launch programme

Status: `ACTIVE`  
Coordination: `onedayonemasterpiece/events-bot-new#621`

This document is the current operational route. The failed ASP conveyor in
`lovekgd-design-system#57` is donor/history, not a mandatory sequence of gates.

## Product result

```text
A0 = current Astro with historical UI drift
A0
→ normalize shared foundations and component families
→ A* = normalized executable Astro used by real route templates
→ S* = thin family/state/corpus/Penpot binding in Git
→ P* = native Penpot masters and linked page instances
→ visual review of the same Golden route surfaces
→ real-data build through the existing production/Kaggle path
```

The product lives in Astro. The owner reviews real page compositions. Penpot
shows native component identity, variants and linked reuse and proves parity; it
does not delay browser design work.

## Authority; no new SoT

### `events-bot-new`

Owns the executable launch UI:

- semantic tokens and foundations;
- Astro components and variants;
- route/page compositions;
- Golden and real-data builds;
- production generation and browser behaviour.

Branch:

```text
integration/ui-normalization-launch-20260902
base: 61f7a6af5f5e82515dcd42c93dd02748297112bc
```

### `lovekgd-design-system`

Owns only the thin cross-surface binding:

- stable family/component/archetype IDs;
- variant/state axes and component dependencies;
- Golden Corpus and route projections;
- exact visible asset identities;
- Astro source bindings;
- intended Penpot pages/masters;
- visual status and accepted differences;
- selective donor evidence.

It does not contain a second independently edited Astro implementation during
this launch.

Branch:

```text
integration/launch-normalized-sot-penpot-20260902
```

### Penpot

Owns native masters, variants, linked instances, route review boards, owner
comments and exports. Before visual acceptance a candidate page may be replaced
instead of migrated with preserved candidate IDs.

## Owner review uses actual route templates

No new `/lab/launch/*` pages are created. The owner is not asked to review
components on separate laboratory pages.

Golden data is injected into the same route templates that serve the product:

```text
/date-{FRIDAY}/
/date-{SATURDAY}/
/date-{SUNDAY}/
/vyhodnye/{SATURDAY}/
/podborki/besplatnye-sobytiya/
```

The exact generated clickable URLs are posted to issue #621. They may live
under an immutable preview host or build prefix, but their page templates,
components and composition are the real route implementations.

The existing `/lab/design-system/` may remain as an internal automated
regression harness because it already exists. It is not an owner checkpoint,
must not be expanded for this programme and cannot prove page composition.

Design corrections are made while reviewing the actual Golden date, weekend
and free-collection pages. After Golden acceptance, the same routes are built
with current real events.

## How component reuse is proved without owner lab pages

For every normalized family:

1. Astro has one central source/component identity.
2. All relevant route consumers import/use that family rather than page-local
   copies or internal CSS overrides.
3. Debug evidence binds rendered instances to `family_id`, version/state and
   fixture without changing layout.
4. Thin S records the exact Astro source, consumer set, variant/state axes,
   assets and Penpot master target.
5. Penpot has one native master/variant family; route boards use linked
   instances from it.
6. V0 checks the actual route DOM/bounds and the matching Penpot route board.

The owner therefore reviews the useful page, while the system proves that the
same medallion/card/control is reused across pages. A visually similar detached
copy does not pass.

## Reuse before reconstruction

Use existing capital before creating anything new:

- current `design-system.css`, shared components and route implementations;
- decoder snapshot: 107 logical components;
- normalization synthesis: 47 analytical families;
- PR #37: cards, icons, medallions, artifacts and framing;
- PR #42: exact Golden events/assets and four EventCard cases;
- PR #43: Date Listing + Shell;
- PR #52: 17 route archetypes and 34 desktop/mobile cases;
- PR #53: owner corrections and safe Penpot lessons;
- old Penpot ZIP for exact assets, anatomy, framing and composition only.

Never reuse old Penpot UUID/component/shapeRef lineage, detached copies,
screenshots as implementation or historical PASS labels. Donor extraction is
timeboxed to 20 minutes per family; otherwise rebuild from normalized Astro.

## Golden Corpus v1

Use a frozen `Europe/Kaliningrad` reference clock and three consecutive dates:
Friday, Saturday and Sunday.

Required actual page compositions:

- single-date listing on Friday;
- the same listing family on Saturday;
- the same listing family on Sunday;
- weekend/two-day page reusing the same Saturday/Sunday occurrences;
- free collection derived from the same event corpus.

Density target:

```text
Friday: 5 occurrences, minimum 4
Saturday: 6 occurrences, minimum 5
Sunday: 5 occurrences, minimum 4
```

Across the three dates cover landscape photo, portrait poster,
contain-required artwork/OCR, missing or broken image, multiple images, short
and long titles, long venue/address, exact and absent time, free/paid/sold-out,
calendar present/absent, cancelled/rescheduled, continuing exhibition and
medallion context.

Prefer exact records from PR #42, the current free-collection corpus and current
snapshots. A synthetic record is allowed only for a missing stress cell and must
be visibly marked synthetic. Corpus updates are append-only for at least two
weeks.

## Unit of normalization

The unit is a complete component family in its real consumers:

```text
bounded drift census
→ decide component / variant / state / composition / accidental drift
→ record thin S target
→ normalize the central Astro implementation
→ migrate all launch consumers
→ show the result on actual Golden routes
→ create native Penpot master and linked route instances
→ V0 visual PASS or one lowest-owner REPAIR
```

No family is complete because a contract, test, isolated specimen or empty
Penpot page exists.

## Parallel ChatGPT Pro windows

The windows are parallel product owners, not sequential approval gates:

- `N0`: documentation, Golden Corpus, integration and release;
- `F0`: foundations, primitives, icons and brand;
- `M0`: MediaFrame and component/card families;
- `A0`: shell, listings and route archetypes;
- `V0`: independent actual-route browser/Penpot visual audit;
- `K0`: detailed consultant and prompt author on owner request.

One direct persistent Codex goal `R0` supplies implementation worktrees:

```text
FOUNDATIONS
MEDIA-CARDS
SHELL-LISTINGS
ARCHETYPES
CORPUS-ROUTES
RELEASE
MERGE-TEST
PENPOT   # sole writer
```

There is no mandatory candidate chain `MAT → QA → INTEGRATE → PUBLISH`.
Technical smoke tests run inside each build lane and on the integration branch.
V0 reviews after a visible browser/Penpot candidate exists.

## GitHub communication

Single mailbox: `events-bot-new#621`.

Only meaningful messages are published:

```text
[RESULT]
[OWNER_REVIEW_READY]
[BLOCKER]
```

No comments for page/root creation, routine hashes, test phases or internal
agent handoffs. N0 alone consolidates `STATUS.md`. The owner never copies task
IDs, branches or results between windows.

Before changing a family, its owner checks relevant current voice notes in
`idea-hub` and records only resulting decisions.

## Owner-visible schedule

`T+0` begins when N0, F0, M0, A0, V0 and R0 accept this programme.

| Latest | What the owner can open | Surface |
|---:|---|---|
| T+1h | plan, branch map and live status | issue #621 + docs |
| T+3h | Friday, Saturday, Sunday and weekend on the Golden Corpus | actual route preview URLs |
| T+4h | corpus coverage and selected fixture identities | issue #621 / route evidence |
| T+6h | first normalized actual date/weekend pages after foundations wave | actual route preview URLs |
| T+7h | native Foundations, Icons and MediaFrame masters plus linked route examples | Penpot |
| T+10h | normalized MediaFrame and four EventCard cases visible inside actual route pages; matching Penpot family | browser + Penpot export |
| T+14h | complete Golden free collection desktop/mobile | actual free-collection route |
| T+16h | matching Penpot free-page board and V0 verdict | Penpot + issue #621 |
| T+20h | corrected date/weekend/free surfaces after owner comments | actual route preview URLs |
| T+24h | first real-data generated preview; at least half launch archetypes | real route URLs |
| T+30h | foundations, cards, shell and 8–10 route boards | Penpot |
| T+36h | every launch-critical archetype on Golden data | actual route preview URLs |
| T+40h | real-data Kaggle/production-form candidate | exact review link |
| T+44h | every launch archetype represented with linked components/status | Penpot owner index |
| T+48h | final real-data candidate; free page A=S=P; broad launch status | browser + Penpot + GitHub |

A checkpoint is satisfied only by a readable owner-visible page/board/export.
Commits, tests, isolated lab specimens, empty Penpot pages and hidden trees do
not satisfy it.

Five minutes is a liveness threshold, not a reason to split one meaningful
batch into page/root/instance phases. Expected visible cadence is one family or
route result every 30–90 minutes and one complete page every 2–4 hours.

## Owner review order

1. Golden Friday/Saturday/Sunday/weekend routes and corpus suitability.
2. The same routes after foundations, framing and component normalization.
3. Complete Golden free collection desktop/mobile.
4. Matching Penpot masters and linked route boards for identity/parity.
5. The same actual routes on current real data.

## Explicitly outside the 48-hour critical path

- new SoT repository or extracted Astro package;
- new decoder, broad research programme or archetype wave;
- new lifecycle/generation/governance system;
- new owner-facing lab pages;
- palette redesign before an actual route review requests it;
- per-candidate lease/provider cryptography;
- mandatory pre-write QA/INTEGRATE chains;
- bespoke Penpot runner per family;
- page/root/instance micro-checkpoints;
- full old-Penpot reconstruction;
- promotion receipts before visual acceptance;
- pixel-perfect rejection for anti-aliasing or invisible 1–2 px rounding.

## Terminal minimum at T+48

- current documentation routes correctly;
- Golden Corpus covers Friday/Saturday/Sunday plus weekend with several events
  per date;
- launch-critical foundations and component families are normalized in Astro;
- actual launch routes use central families or record a bounded deviation;
- production-form generation works on real data;
- a fresh real-data review candidate exists;
- thin S binds families, actual routes, fixtures, Astro and Penpot;
- Penpot contains native foundations/components and linked representative route
  boards;
- EventCard and the free collection have visual A=S=P PASS;
- every other launch archetype has an explicit browser/Penpot status.