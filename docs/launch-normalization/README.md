# KenigEvents UI normalization — 48-hour launch

Status: `ACTIVE`  
Coordination: `onedayonemasterpiece/events-bot-new#621`

This is the current operational route. The failed ASP conveyor in
`lovekgd-design-system#57` is donor/history, not a mandatory gate sequence.

## 1. Verified current product model

The product already exists in `events-bot-new` and is substantially componentized.
It also contains historical drift that must be normalized rather than copied.

Actual date/weekend route semantics are:

```text
/segodnya/                  current build date
/zavtra/                    next date
/date-YYYY-MM-DD/           arbitrary date
/vyhodnye/                  active/nearest Saturday–Sunday range
/vyhodnye/YYYY-MM-DD/       explicitly selected available weekend range
```

`/segodnya/`, `/zavtra/` and `/date-YYYY-MM-DD/` already use the shared
`DateListingSurface`. Weekend routes use the distinct shared
`WeekendListingSurface`. Normalization must preserve intentional composition
differences while eliminating duplicated foundations, cards, controls, media,
icons and page-local visual forks.

The existing immutable preview build already has an owner entry point:

```text
/<buildId>/__preview/
```

It links the real top-level product routes and adapts to desktop/mobile. No new
owner-facing lab or review route is created.

## 2. Product path

```text
fresh production events
→ existing Astro preview build and /<buildId>/__preview/
→ normalize foundations and component families in actual route consumers
→ rebuild the same real-data preview for owner visual sanity
→ record the normalized facts in thin S
→ materialize native Penpot masters and linked route boards
→ run deterministic Golden A=S=P comparisons internally
→ build the same actual routes from fresh production data for release
```

The owner reviews real pages with real events. Golden Corpus is an internal,
deterministic conformance input, not an owner-review prerequisite.

## 3. Authority; no new SoT

### `events-bot-new`

Owns the executable normalized product:

- `site/src/styles/design-system.css` — canonical foundations and semantic tokens;
- `site/src/components/design-system/**` — shared primitives;
- `site/src/components/**` — product component families;
- `site/src/layouts/**` and `site/src/pages/**` — actual route compositions;
- current data export, preview, production and Kaggle generation;
- browser behaviour and release checks.

Branch:

```text
integration/ui-normalization-launch-20260902
base: 61f7a6af5f5e82515dcd42c93dd02748297112bc
```

### `lovekgd-design-system`

Owns only the thin cross-surface record:

- stable family/component IDs;
- component/variant/state/composition decisions;
- actual Astro source and consumer bindings;
- exact visible SVG/raster identities;
- Golden fixture and route bindings;
- Penpot master/page placement;
- visual conformance status and accepted renderer differences;
- selective donor evidence.

It does not contain a second independently edited Astro implementation.

Branch:

```text
integration/launch-normalized-sot-penpot-20260902
```

### Penpot

Owns native tokens/components/variants, linked instances, actual-route review
boards, comments and exports. Before visual acceptance a candidate page may be
replaced rather than migrated with preserved candidate IDs.

## 4. Real-data owner review

The first implementation result is a fresh real-data preview generated through
the existing exporter/build path. Issue #621 must publish one exact clickable
`/<buildId>/__preview/` URL. From it the owner opens the current product routes,
including today, tomorrow, weekend, free collection and other launch surfaces.

Owner review is intentionally lightweight:

- does the rebuilt site still look like the product;
- did normalization damage composition or responsive behaviour;
- are framing, spacing, typography, radii, colours, controls and icons coherent;
- are there visible page-specific anomalies.

The owner does not inspect a new component catalogue and does not validate the
Golden dataset.

## 5. Internal Golden conformance

Golden Corpus exists only to make A=S=P repeatable on identical text, images,
states and dates.

Use one frozen `Europe/Kaliningrad` clock whose current date is a Friday. The
same actual route implementations then provide the required coverage:

```text
/segodnya/                              Friday, several events
/zavtra/                                Saturday, several events
/date-YYYY-MM-DD/                       Sunday, several events
/vyhodnye/                              the same Saturday + Sunday occurrences
/podborki/besplatnye-sobytiya/          free subset from the same corpus
```

Target event density is `5 / 6 / 5`, minimum `4 / 5 / 4`. Across those events
cover materially different media, title/address length, exact/absent time,
admission, calendar, cancellation/reschedule, continuing exhibition and
medallion cases. Existing PR #42/free-collection fixtures are reused; new
synthetic records are allowed only for a missing stress cell and are explicitly
marked. Updates are append-only for at least two weeks.

No `/lab/launch/*` routes are created. The existing `/lab/design-system/` may
remain unchanged as an internal automated regression harness; it is not an
owner checkpoint and cannot prove route composition.

## 6. Unit of normalization

The unit is a complete shared family in its actual consumers:

```text
bounded current consumer/drift census
→ decide component / variant / state / composition / accidental drift
→ normalize the central Astro implementation and foundations
→ migrate all launch consumers; remove forbidden local forks/overrides
→ rebuild the real-data preview
→ record the resulting family facts in thin S
→ create native Penpot master/variants and linked route instances
→ V0 compares deterministic Golden Astro and Penpot exports
```

Thin S records the result; it is not a precondition for changing Astro.
Penpot follows every completed family batch and must not be postponed until the
end of all normalization, but Penpot transport cannot block Astro work.

## 7. Required normalization report

For each accepted wave, the owner receives one compact report rather than a new
review surface. The final report must state:

- canonical font families and available weights;
- exact H1/H2/H3/H4, body, label and metadata roles;
- spacing/sizing scale and page/container rules;
- colours and semantic roles;
- radii, borders, elevation and layering;
- exactly four icon size roles, their token values and all consumer mappings;
- canonical SVG identities and removal of alternate glyph copies;
- MediaFrame roles, ratios, contain/cover, crop/focal/clip/fallback rules;
- normalized component families, variants/states and actual route consumers;
- page-local forks and internal overrides removed;
- bounded remaining deviations;
- fresh real-data preview URL and checks run;
- Penpot master/linked-instance status and A=S=P verdicts.

Icon consumers use one of four semantic size roles. Concrete dimensions live in
central tokens/utilities, never in individual component implementations, so a
single token change updates every icon of that role across the site.

## 8. Reuse before reconstruction

Mandatory donors:

- current Astro foundations, components, route surfaces and checks;
- decoder: 107 logical components;
- normalization synthesis: 47 analytical families;
- PR #37: cards, icons, medallions, artifacts and framing;
- PR #42: exact Golden events/assets and four EventCard cases;
- PR #43: Date Listing + Shell;
- PR #52: 17 route archetypes / 34 desktop-mobile cases;
- PR #53: owner corrections and bounded Penpot lessons;
- old Penpot ZIP for exact assets, anatomy, variants, framing and composition.

Do not reuse old Penpot UUID/component/shapeRef lineage, detached copies,
screenshots as implementation or historical PASS labels. Donor extraction is
timeboxed to 20 minutes per family; otherwise normalize from current Astro.

## 9. Parallel owners and execution

Six ChatGPT Pro windows are parallel product owners, not approval gates:

- `N0`: current documentation, fresh real-data generation, internal Golden
  corpus, integration and release;
- `F0`: foundations, primitives, four icon-size roles, SVG and brand;
- `M0`: MediaFrame and component/card families;
- `A0`: shell, listings and actual route archetypes;
- `V0`: independent real-data visual sanity plus internal Golden Astro↔Penpot
  conformance;
- `K0`: detailed consultant and prompt author on owner request.

One direct persistent Codex goal `R0` supplies implementation worktrees:

```text
FOUNDATIONS
MEDIA-CARDS
SHELL-LISTINGS
ARCHETYPES
CORPUS-CONFORMANCE
RELEASE
MERGE-TEST
PENPOT   # sole writer
```

There is no mandatory candidate chain `MAT → QA → INTEGRATE → PUBLISH`.
Each implementation lane runs bounded smoke checks; integration runs shared
checks; V0 reviews after a visible candidate exists.

## 10. Communication

Single mailbox: `events-bot-new#621`.

Only meaningful messages are published:

```text
[RESULT]
[OWNER_REVIEW_READY]
[BLOCKER]
```

No comments for routine hashes, page/root creation, test phases or internal
handoffs. N0 alone consolidates `STATUS.md`. The owner never copies task IDs,
branches or results between windows.

Before changing a family, its owner checks relevant fresh voice notes in
`idea-hub` and records only resulting decisions.

## 11. Owner-visible schedule

`T+0` begins only when N0/F0/M0/A0/V0 and R0 accept this programme.

| Latest | What the owner can open or read |
|---:|---|
| T+1h | exact fresh real-data `/<buildId>/__preview/` link and current build verdict |
| T+3h | normalization baseline report: foundations, family drift, icon/media plan |
| T+6h | refreshed real-data preview with first foundations/icon normalization applied |
| T+10h | refreshed real-data preview with normalized MediaFrame and EventCard family |
| T+14h | normalized free collection plus today/tomorrow/weekend/date surfaces on real data |
| T+16h | Penpot native foundations/icons/MediaFrame/EventCard and linked free-page board; first V0 Golden verdict |
| T+24h | at least half launch route families normalized; fresh real-data preview |
| T+32h | all launch-critical route families normalized or carrying one bounded deviation |
| T+36h | internal Golden conformance coverage for all launch-critical shared families |
| T+40h | real-data Kaggle/production-form candidate |
| T+44h | Penpot native masters and linked representative route boards for launch scope |
| T+48h | final checked real-data candidate; normalization report; EventCard and free page A=S=P |

A checkpoint is satisfied only by a real-data preview link, readable
normalization report, meaningful Penpot master/linked route board or final build.
Commits, tests, isolated specimens, empty pages and hidden trees do not count.

Five minutes is a liveness threshold, not a reason to split one family batch
into page/root/instance micro-phases. Expected visible cadence is one real page
or family report every 30–90 minutes and one complete page wave every 2–4 hours.

## 12. Outside the 48-hour critical path

- new SoT repository or extracted Astro package;
- new decoder, broad research programme or archetype wave;
- new owner-facing lab pages;
- new lifecycle/generation/governance system;
- palette redesign before real-page review requests it;
- per-candidate lease/provider cryptography;
- mandatory pre-write QA/INTEGRATE chains;
- bespoke Penpot runner per family;
- page/root/instance micro-checkpoints;
- full old-Penpot reconstruction;
- promotion receipts before visual acceptance;
- pixel-perfect rejection for anti-aliasing or invisible 1–2 px rounding.

## 13. Terminal minimum

At T+48:

- current documentation routes correctly;
- a fresh real-data build is reviewable and release generation works;
- launch-critical foundations and component families are normalized in Astro;
- actual launch routes use central families or record a bounded deviation;
- thin S records the normalized facts and actual consumers;
- internal Golden Corpus gives deterministic A=S=P coverage;
- Penpot contains native foundations/components and linked representative route
  boards;
- EventCard and the free collection have visual A=S=P PASS;
- every other launch archetype has an explicit Astro/Penpot status.