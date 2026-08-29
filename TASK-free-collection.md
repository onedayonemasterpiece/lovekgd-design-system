Codex task — close «Бесплатные события» to Astro = SoT UI = Penpot

Use the repository skill ui-sot-page-closure and, for every comparison
case, ui-three-way-conformance. Do not restart the audit and do not process
any other page, voice intake, Product Atlas item, typography programme, spacing,
tokens, or component family until this route is genuinely ready for owner
review.

Product result

Close exactly one real route:

/podborki/besplatnye-sobytiya/

Terminal result required:

PASS / READY_FOR_OWNER_REVIEW

Anything else is BLOCKED; phrases such as technically complete, almost,
PASS_WITH_*, MINOR, ready except export, or structural-only readiness are
forbidden.

Fresh-read, but do not redo discovery

Read current heads and reuse only source-bound work already created:

onedayonemasterpiece/events-bot-new current main and branch
feature/free-collection-september-v2-parity (historical checkpoint
6b0335dd819f09cad70bd5a067c01c10e8ff1e07);

onedayonemasterpiece/lovekgd-design-system current main, PR #54 and its
actual head (historical checkpoint
83400b01d88e10a6ffc322b80a96e84a968a88f9);

Penpot file 3be9e5e1-190f-8090-8008-713c0fbe6260;

current pages 40.1b — EventCard · Unified Golden variants,
63.08 — Atlas · Collections, and diagnostic 63.08b if it still exists;

latest proof free-collection-september-v2-three-way-proof.v5.json.

The v5 proof is a blocker record, not a baseline PASS: it has no fresh Penpot
PNG and no pixel diff.

PR lovekgd-design-system#54 contains 372 commits and 1451 files. Treat it as an
evidence/code donor only, not as the delivery unit for one-page closure. Create
or restore clean, narrow delivery branches containing only the exact SoT,
materializer, test, route projection, and evidence changes required here.

Frozen data scope

Use the existing Golden Corpus v2, not production queries and not a newly
selected substitute set:

corpus: catalog/fixtures/ui-reference-events/v2/corpus.json;

corpus ID: ui-reference-events.v2;

recorded corpus SHA-256:
b1746f0cd68be6dd6060858fb765c6863535aefbcf4844b9b50c279d69e9306a;

projection:
catalog/fixtures/ui-reference-events/v2/projections/free-collection-september.v1.json;

scenario:
catalog/fixtures/design-system-reference/v2/scenarios/archetype.collections.free.september.desktop-ready.v2.json.

Exact fixture input order:

2182, 6711, 7609, 8006, 8200

Exact rendered order/groups:

events: 8006, 8200;

exhibitions: 2182, 6711, 7609;

page order: 8006, 8200, 2182, 6711, 7609 (2 + 3, not 3 + 2).

Resolve the clock drift first

Current sources disagree: corpus v2 records
2026-08-29T14:00:00+02:00, while the September projection starts
2026-09-01 and v5 used reference date 2026-09-01.

Before any new comparison, make one bounded SoT decision and record one exact
reference timestamp used identically by:

scenario/manifest;

Astro build/runtime;

Penpot labels/states;

every screenshot and receipt.

Do not rewrite an immutable published corpus silently. Use an append-only
scenario/corpus revision or an explicit source-bound scenario clock override,
then update hashes and tests.

Central component boundary

SoT UI is central.

Astro must use the normal production chain:

FreeCollectionSurface → OptimizedEventCardGrid → EventCard

Penpot must use canonical linked EventCard variants from the central component
page. Requirements:

all five page cards descend from declared canonical EventCard masters;

detached cards = 0;

page-local visual card masters = 0;

screenshot cards = 0;

fixture wrappers may exist only as data-only wrappers with exactly one linked
canonical EventCard and no independent visual primitives, colors, spacing,
typography, actions, or media implementation;

row/page containers own only grouping/layout behavior;

any correction is applied to the lowest central SoT/component owner and then
propagated to every linked consumer.

Do not create another card implementation on 63.08 or 63.08b.

Export factory preflight

Perform this before further visual mutations:

capture one Astro card and the exact 3-card exhibition row;

export one linked Penpot card and the exact 3-card row;

try export_shape at most twice;

on 504, immediately use plugin-context
shape.export({type:'png'}) through
scripts/round-trip-reconstruction/penpot-bounded-export.js;

retrieve chunks, decode, verify dimensions/bytes/SHA and create a real
side-by-side + overlay + diff;

manual clipboard export is not an acceptance path.

Do not continue page mutation unless this automated round trip works.

Known mismatches that must be rechecked, not assumed fixed

The previous direct PNG comparison exposed at least:

wrong dark/black background around cards;

clipped/non-wrapping Бесплатно admission chip;

different handling of long addresses;

different Share/Like sizing and alignment;

different action typography;

desktop inactive Завтра weight/state drift;

mobile bottom navigation placed at the end of a tall canvas instead of fixed
at the real viewport edge;

hero background/shadow and text-wrap drift;

share-strip drift;

stale comparison images and duplicated/far-away review frames.

Reproduce each finding with fresh evidence, fix it centrally, and prove it gone.
Do not merely copy this list into a receipt.

Required acceptance matrix

Components

Compare every materially different EventCard state used by the five fixtures on
both desktop and mobile, in the real parent surface.

Groups

desktop events row: exact 2 cards;

desktop exhibitions row: exact 3 cards;

mobile stacked events group;

mobile stacked exhibitions group;

headings, gaps, equal-height rules, crop/framing and actions.

Full route states

Desktop, DPR 1:

top, exact 1280 × 1200;

hero-passed-sticky-medallion, exact 1280 × 1200;

full-page, native full height.

Mobile, DPR 1:

top, explicit 390 × 844 scenario;

scrolled viewport proving sticky/fixed behavior and the bottom navigation;

full-page, native full height.

If the existing SoT lacks the mobile scenario, add it as a bounded sibling of
the desktop scenario. Do not infer mobile state only from a tall Penpot board.

For each case produce after the final mutation:

fresh astro.png;

fresh penpot.png;

side-by-side.png;

overlay-50.png;

diff.png;

geometry/computed-style/lineage evidence;

agent visual review;

hashes tied to exact Git SHAs and Penpot revision/IDs.

Open and inspect all visual artifacts. A structural readback or threshold alone
is not a visual verdict.

Correction loop

Work one mismatch at a time:

fresh pair → visual/diff diagnosis → lowest SoT owner → central fix → propagate → fresh pair

After every material Penpot mutation immediately perform readback,
validate(), bounded export, and comparison. Do not accumulate a long unchecked
batch.

No writable fanout. Read-only diagnostic help is allowed, but one integrator owns
SoT, Astro, Penpot, exports, and final verdict serially.

Review workspace

Make the owner-review surface obvious and clean:

current pairs start near the page origin and are ordered desktop then mobile;

each pair has a short visible label containing state, scenario and current
status;

remove only verified stale/duplicate diagnostic frames;

do not mix central component masters with archetype review boards;

provide exact direct page/board IDs in the handoff.

Definition of done

Do not report PASS until all are simultaneously true:

one clock/scenario/fixture/hash tuple across SoT, Astro and Penpot;

exact five fixtures and exact rendered order;

all cards and containers use central owners;

detached/page-local visual roots = 0;

no unexplained visual or responsive difference in any required case;

fresh final Astro/Penpot PNGs and visual diffs exist for every case;

every agent verdict = PASS;

real route build and targeted tests pass;

no new CI regression;

both worktrees are clean and pushed;

final review canvas is clean;

page closure manifest passes:

node .codex/skills/ui-sot-page-closure/scripts/validate-page-closure.mjs \
  <final-page-closure-manifest.json>

Raw pixel equality is not replaced by a vague “renderer difference”. If a
residual raster-only difference remains after exact fonts, dimensions, wraps,
colors and geometry are proven, keep the case non-PASS and present the exact
region/metrics for owner disposition.

Final response

Return only a compact product handoff:

PASS / READY_FOR_OWNER_REVIEW or exact BLOCKED;

route/scenario/reference timestamp;

final Astro and SoT SHAs;

Penpot file/page/board IDs and revision;

six ordered full-route review cases;

component/group evidence links;

lineage counts;

tests/build/CI;

artifact directory and hashes.

Do not start the next page, typography, spacing, foundations, or UI improvement
work. Wait for explicit owner review of this closed page.