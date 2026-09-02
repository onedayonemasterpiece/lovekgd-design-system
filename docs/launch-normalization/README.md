# KenigEvents UI normalization launch — 48-hour programme

Status: `ACTIVE_PROGRAMME_CANDIDATE`  
Date: 2026-09-02  
Coordination: `onedayonemasterpiece/events-bot-new#621`

This is the current launch programme. It replaces the failed ASP Production
Conveyor as the operational route for **new launch work**. The old issue #57,
PRs, branches, decoder outputs, corpus packages and Penpot archive remain donor
capital; they are not a mandatory sequence of gates.

## 1. Product result

```text
A0 = current Astro with historical component drift

A0
→ bounded component-family normalization
→ S* = thin normalized family/corpus/Penpot contract
→ A* = normalized executable Astro
→ P* = native Penpot projection of the same family/state/corpus
→ visual review A* ↔ P*
→ real-data build through the existing local/Kaggle release path
```

The product lives in Astro. Penpot remains required for native visual
representation and A=S=P evidence, but it no longer blocks browser-based design
work or normalization.

The first owner review is always the fixed Golden Corpus. Real production-event
review starts only after the Golden surfaces are usable.

## 2. No new SoT

No new repository, component package or second Astro implementation is created.

### `events-bot-new`

Launch implementation authority for:

- semantic tokens and foundations;
- Astro components and variants;
- route/page compositions;
- runtime catalogue and Golden lab pages;
- production generation and browser behaviour.

Branch:

```text
integration/ui-normalization-launch-20260902
base: events-bot-new@61f7a6af5f5e82515dcd42c93dd02748297112bc
```

### `lovekgd-design-system`

Thin S and delivery authority for:

- stable family/component/archetype IDs;
- variant/state axes and composition dependencies;
- Golden Corpus and route projection bindings;
- canonical visible asset identities;
- Astro source bindings;
- Penpot page/family placement;
- browser/Penpot visual status and accepted differences;
- selective donor assets and evidence.

It does not own another independently edited Astro implementation during this
programme.

Branch:

```text
integration/launch-normalized-sot-penpot-20260902
base: lovekgd-design-system@b3567cb72d81a7aad4b47a68e220325f055697a2
```

### Penpot

The current new file owns:

- native components and variants;
- linked instances;
- component-family review boards;
- Golden date/weekend/free-page boards;
- route archetype boards;
- owner comments and exports.

Before visual acceptance, candidate pages are replaceable. Stable-ID migration
and promotion discipline begin after a family receives visual acceptance.

## 3. Reuse before reconstruction

Mandatory donors:

- current Astro `site/src/styles/design-system.css`;
- current primitives under `site/src/components/design-system/`;
- current `/lab/design-system/` runtime catalogue and checks;
- decoder snapshot: 107 logical current-UI components;
- normalization synthesis: 47 analytical families;
- PR #37: card families, icons, medallions, artifacts and framing;
- PR #42: Golden Event Corpus and four EventCard cases;
- PR #43: Date Listing + Shell;
- PR #52: 17 route archetypes / 34 desktop-mobile cases;
- PR #53: owner corrections and bounded-mutation lessons;
- old Penpot ZIP: exact assets, anatomy, variants, framing and compositions only.

Do not reuse old Penpot UUID/component/shapeRef lineage, detached copies,
screenshots as implementation, stale PASS labels or whole-file imports.

A donor extraction is timeboxed to 20 minutes per family. If no healthy reusable
structure is obtained, rebuild from normalized Astro.

## 4. Golden Corpus v1

The corpus must remain usable for at least the next two weeks without replacing
its existing records. New cases are append-only.

### Fixed calendar coverage

Use one frozen `Europe/Kaliningrad` reference clock independent of wall time.
The exact dates may be chosen by N0, but they must be consecutive:

```text
Friday
Saturday
Sunday
```

Required page types:

1. **Single-date listing family** rendered for all three dates.
2. **Weekend/two-day family** rendered from the same Saturday and Sunday
   occurrences.

Minimum event density:

```text
Friday:   target 5 occurrences, minimum 4
Saturday: target 6 occurrences, minimum 5
Sunday:   target 5 occurrences, minimum 4
```

A multi-day/ongoing occurrence may appear across dates only when the projection
explicitly tests continuation/deduplication. The weekend page reuses the same
Saturday/Sunday source records; it does not maintain a duplicate dataset.

### Required stress coverage across the three dates

- landscape event photo;
- portrait poster;
- text-heavy artwork / contain-required media;
- OCR/document or unknown-text-protected media;
- no image or broken-image fallback;
- multi-image event;
- short and long titles;
- long venue/address;
- exact time and absent/approximate time;
- free, paid and sold-out admission;
- calendar action present and absent;
- cancelled and rescheduled states;
- continuing exhibition;
- venue/brand medallion context.

Prefer exact records already present in PR #42, the September/free-collection
corpus and current real-data snapshots. A missing stress cell may use a clearly
marked deterministic synthetic fixture; it must never masquerade as a real
source record.

### Golden browser surfaces

One owner index must link to:

```text
/lab/launch/
/lab/launch/date-friday/
/lab/launch/date-saturday/
/lab/launch/date-sunday/
/lab/launch/weekend/
/lab/launch/free-collection/
/lab/design-system/
```

The implementation may choose equivalent stable lab routes, but issue #621 must
publish exact clickable URLs. The owner never constructs URLs manually.

## 5. Unit of normalization

The unit is a complete component family with representative cases, not a CSS
rule, Penpot rectangle or empty page.

```text
1. bounded census of current consumers and drift;
2. decision: component / variant / state / composition / accidental drift;
3. normalized target recorded in thin S;
4. Astro implementation changed;
5. production consumers migrated;
6. Golden specimens visible in browser;
7. automated smoke checks pass;
8. native Penpot component/instances materialized in one meaningful batch;
9. V0 compares browser and Penpot;
10. PASS or one lowest-owner REPAIR.
```

Design improvements are made during browser review of each Golden surface. They
are not deferred until Penpot. Penpot follows the accepted Astro candidate and
proves the same family/state.

## 6. Six ChatGPT Pro windows

These are parallel owners, not sequential approval gates.

### N0 — documentation, corpus, integration and release

Owns:

- this programme and Astro-side routing documentation;
- Golden Corpus selection, fixed clock and lab index;
- integration branches and merge order;
- current status consolidation;
- local production build, real-data snapshot and Kaggle release lane;
- exact owner review links.

N0 may delegate implementation to Codex. N0 does not approve every mutation.

### F0 — foundations, primitives, icons and brand

Owns:

- font family/weights;
- typography roles;
- spacing/sizing;
- containers/grid/breakpoints;
- colours/status roles;
- radii/borders/elevation/layering;
- buttons, badges, fields and state panels;
- canonical SVG/action/social/navigation icons;
- logos and medallions;
- brand baseline.

Starts from the existing Astro design system; it does not create a new token
framework.

### M0 — MediaFrame and component/card families

Owns:

- canonical MediaFrame contract and implementation;
- event/media framing, crop, focal and fallback;
- EventCard and ListingEventCard;
- EventHero, EventFacts, EventCTA and EventMediaRail;
- Festival/Exhibition/InterestClub/content-card families;
- issue #300 image-shell defect;
- migration of page-local card/media forks.

### A0 — shell, listings and route archetypes

Owns:

- EventLayout;
- header, footer, desktop/mobile navigation and floating island;
- page headings, containers, rows, shelves and listing controls;
- date, today/tomorrow, weekend, popular and unusual compositions;
- collections, search, favourites, personal, festivals, exhibitions, clubs,
  event detail and special-state compositions;
- assembly from F0/M0 components without inventing new page-local primitives.

### V0 — independent browser/Penpot visual auditor

Owns no implementation. Uses browser debug plus Penpot read/export to:

- inspect live Golden/real-data pages;
- read DOM, computed style and bounds;
- capture browser PNG;
- export matching Penpot root;
- inspect both at native review scale;
- identify one lowest-owner defect;
- publish PASS or REPAIR to issue #621.

### K0 — detailed consultant and prompt author

K0 is the sixth window. It owns interpretation of this programme and the owner
visibility schedule. It does not orchestrate continuously, write code or mutate
Penpot. On owner request it fresh-reads the plan, status, issue #621 and branch
heads, then writes exact launch/resume/correction prompts for N0/F0/M0/A0/V0 or
R0.

Exact role: `docs/launch-normalization/CONSULTANT-K0.md`.

## 7. Codex execution topology

One direct persistent goal `R0` may run bounded worktrees in parallel:

```text
FOUNDATIONS
MEDIA-CARDS
SHELL-LISTINGS
ARCHETYPES
CORPUS-LAB
RELEASE
MERGE-TEST
PENPOT   # sole Penpot writer
```

ChatGPT owners make product/architecture decisions and review results. Codex
implements, tests, migrates consumers, builds lab/production output and prepares
whole Penpot batches.

There is no mandatory pre-write chain `MAT → QA → INTEGRATE → PUBLISH`.
Candidate Penpot materialization requires only:

- correct target file/page;
- sole writer;
- bounded replaceable candidate page/family;
- exact normalized Astro/S input;
- batch-level readback, validation and export.

A Penpot batch creates/reuses the page, meaningful review root, native masters,
linked instances, real Golden content, validation and export in one active turn.
An empty page/root is never a checkpoint.

## 8. GitHub coordination

Single mailbox: `events-bot-new#621`.

The owner does not copy results between windows. Each window writes one comment
per meaningful result, review request or real blocker:

```text
[RESULT]
[OWNER_REVIEW_READY]
[BLOCKER]
```

No comments for internal phase changes, routine hashes, page-only creation,
agent handoffs or test-by-test progress. N0 alone consolidates `STATUS.md`.

Before designing a new or changed family, the owning window checks relevant
fresh voice notes in `idea-hub` for this project/family and records only the
resulting decision, not a transcript.

## 9. Owner visibility schedule

`T+0` begins when N0, F0, M0, A0, V0 and R0 have accepted this programme.

| Latest time | What the owner must be able to open | Surface | Off-plan if missing |
|---|---|---|---|
| T+1h | canonical plan, live status and branch map | GitHub issue #621 + docs | yes |
| T+3h | Golden index; Friday, Saturday, Sunday single-date pages; weekend page | browser links | yes |
| T+4h | corpus coverage matrix and selected fixture identities | browser index + GitHub | yes |
| T+6h | normalized foundations/primitives/icons catalogue | `/lab/design-system/` | yes |
| T+7h | first meaningful Penpot boards: Foundations, Icons, MediaFrame | Penpot | yes unless MCP is externally unavailable; Astro continues |
| T+10h | MediaFrame specimens and four EventCard Golden cases | browser + Penpot export | yes |
| T+14h | complete free-collection desktop/mobile Golden page | browser | yes |
| T+16h | matching free-page Penpot board and V0 verdict | Penpot + issue #621 | yes unless external MCP outage |
| T+20h | normalized single-date and weekend pages after shared-family corrections | browser | yes |
| T+24h | first real-data generated preview link; at least half of launch archetypes visible in browser | browser / secret preview | yes |
| T+30h | foundations, cards, shell and 8–10 archetype boards visible in Penpot | Penpot | yes unless external MCP outage |
| T+36h | all launch-critical route archetypes visible on Golden data | browser owner index | yes |
| T+40h | real-data Kaggle/production-form candidate and broad browser gate result | exact review link | yes |
| T+44h | all launch archetypes represented in Penpot with visual status | Penpot owner index | yes unless external MCP outage |
| T+48h | final checked real-data candidate; free page A=S=P; broad launch status | browser + Penpot + GitHub | terminal |

A checkpoint is satisfied only by a readable, owner-visible surface. Commits,
receipts, tests, empty Penpot pages and hidden trees do not satisfy it.

### Owner review sequence

1. T+3–4h: review Golden Corpus composition and data coverage.
2. T+6–10h: review foundations, framing and components in browser; design
   corrections happen here.
3. T+14–20h: review complete Golden free/date/weekend pages.
4. After Golden acceptance: review the first real-data build.
5. Penpot is reviewed for parity and component organization, not used as a
   prerequisite for browser design feedback.

K0 publishes or quotes the exact `[OWNER_REVIEW_READY]` entry. The owner only
opens links and comments; work on independent scopes continues.

## 10. Progress and deviation rules

Status values are intentionally small:

```text
NOT_STARTED
ASTRO_BUILDING
BROWSER_REVIEW
ASTRO_ACCEPTED
PENPOT_VISIBLE
ASP_PASS
REAL_DATA_PASS
BLOCKED_EXTERNAL
BLOCKED_PRODUCT_DECISION
```

Five minutes is a liveness threshold, not a reason to split a meaningful batch
into page/root/instance micro-phases.

Expected cadence:

- liveness/check: every 5–10 minutes internally;
- meaningful family/browser surface: every 30–90 minutes;
- complete page surface: every 2–4 hours;
- one compact GitHub result per meaningful surface.

When a checkpoint is missed, K0 classifies the single bottleneck and recommends
one reallocation. It does not add a generation, gate, schema or new control
plane.

## 11. 48-hour waves

### T+0–3h — routing and Golden visibility

- canonical docs and issue #621;
- Golden Corpus selection/fixed clock;
- four date/weekend browser pages;
- current production build preflight;
- F0/M0/A0 bounded drift census begins in parallel.

### T+3–10h — shared foundations and components

- foundations and primitives normalized;
- canonical icons/brand assets;
- MediaFrame normalized, issue #300 repaired;
- four EventCard cases;
- first Penpot family boards;
- V0 browser/Penpot review.

### T+10–20h — first product pages

- complete free-collection Golden page desktop/mobile;
- corrected single-date and weekend pages;
- Penpot free/date/weekend boards;
- browser-based owner design corrections;
- first A=S=P component/page verdicts.

### T+20–32h — broad route migration and real-data build

- today/tomorrow/date, weekend/popular/unusual;
- search/favourites/personal;
- collections/exhibitions/event detail;
- first real-data generated preview;
- 8–10 Penpot archetype boards.

### T+32–40h — remaining launch scope

- festivals, clubs, focus/partners, closed/special states;
- all Golden archetypes linked from owner index;
- Kaggle/production-form candidate;
- Penpot catch-up.

### T+40–48h — visual closure and final candidate

- grouped lowest-owner corrections only;
- browser matrix at launch widths;
- free page final A=S=P;
- representative desktop/mobile status for every launch archetype;
- final real-data candidate and compact remaining-deviation list.

## 12. Explicitly out of critical path

For these 48 hours do not create:

- a new SoT repository or extracted Astro package;
- a new decoder or broad research programme;
- a new lifecycle/generation/governance system;
- new archetype waves beyond the existing route scope;
- a new palette redesign before browser review requests it;
- per-package lease/cancel/provider-identity machinery for replaceable Penpot
  candidates;
- bespoke Penpot runner frameworks per component;
- full old-Penpot reconstruction;
- promotion receipts before browser/Penpot visual acceptance;
- pixel-perfect rejection for anti-aliasing or invisible 1–2 px renderer
  rounding.

A=S=P requires equal component identity, state, fixture, assets, tokens,
framing, hierarchy and visually equivalent composition. Image diff is a defect
finder; V0 makes the final visual judgement at native scale.

## 13. Terminal definition

At T+48 the minimum acceptable launch result is:

- current documentation routes correctly;
- Golden Corpus covers three dates plus weekend with several events per date;
- launch-critical foundations and component families are normalized in Astro;
- all launch routes use central families or have an explicit bounded deviation;
- Golden owner index and design-system catalogue are usable;
- production-form generation works on real data;
- a fresh real-data review candidate exists;
- thin S links families, cases, Astro and Penpot;
- Penpot contains foundations, component families, shell and every launch
  archetype at representative desktop/mobile states;
- EventCard and the free-collection page have visual A=S=P PASS;
- all other archetypes have an explicit browser/Penpot status and no hidden
  claim of completion.
