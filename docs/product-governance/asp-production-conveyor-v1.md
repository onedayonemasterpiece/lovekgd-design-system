# ASP Production Conveyor — corrected one-day execution topology

Status: **active operating model**  
Date: 2026-08-31  
Coordination surface: issue #57  
Critical free-page surface: PR #55

This document is subordinate to the active `kenigevents.asp-conformance` contract. It does not redefine A=S=P, product semantics, visual authority or owner-review criteria. It replaces only fragmented execution habits that serialized unrelated work, repeatedly restarted analysis and made the owner transfer internal state between windows.

## 1. Critical topology correction

The strategy conversation is not operational and is not counted in the execution-window limit. It performs no queue polling, routine Git/Penpot operations or task scheduling.

The operational system has exactly:

- five long-lived ChatGPT Pro windows;
- one direct Codex `/goal` coordinator;
- six Codex child agents controlled by that goal;
- one sole Penpot writer among those children.

Total execution actors: twelve. The separate strategy conversation is consulted only for systemic incidents and real product or architecture decisions.

## 2. Product result

The first mandatory result is:

1. EventCard free slice visually proven A=S=P across four exact cases;
2. `/podborki/besplatnye-sobytiya/` desktop/mobile visually proven A=S=P;
3. the page ready for owner review in the new Penpot design-system file.

The same-day broad result is a visibly populated design system containing:

- current-reconstructed foundations;
- typography, headings, spacing, layout, grid, shape and elevation;
- canonical SVG/iconography, logos, medallions and brand assets;
- controls and shared primitives;
- card families and shared patterns;
- header, footer, navigation, shelves and floating island;
- desktop/mobile owner boards for every current route archetype;
- compact review index;
- actual visual status for every board: `PASS`, `VISIBLE_WITH_DIFF`, `BLOCKED_CORPUS_GAP` or `BLOCKED_PRODUCT_DECISION`.

A report, marker, hidden component count, empty board, test pass or temporary canary is not product progress.

## 3. Five operational ChatGPT windows

### O0 — Product orchestrator

Owns:

- product priority;
- cross-lane queue;
- incident response;
- direct-Codex and DevCoveer task routing;
- writer handoff;
- product dashboard;
- adoption of lane receipts;
- routine reversible technical decisions.

O0 does not become the visual-design author or a substitute Penpot publisher.

### V0 — Visual QA laboratory

Owns:

- direct `my-browser-bridge` operation;
- exact Astro browser sessions;
- DOM, bounds, viewport, state and screenshot capture;
- Penpot read/export windows;
- direct visual inspection of Astro and Penpot PNGs;
- overlay/diff/geometry evidence interpretation;
- exact defect routing to the lowest owner;
- repeated component, pattern and archetype review throughout the day.

V0 never accepts visuals from a Codex summary without inspecting the actual images.

### F0 — Foundations, brand and assets

Owns:

- current-reconstructed colors and modes;
- typography and heading roles;
- spacing, sizing, grid, responsive, density and layout;
- radius, border, opacity, elevation and layering;
- canonical SVG/iconography;
- logos, medallions and brand assets;
- current brandbook baseline;
- publishable foundation and asset packages.

F0 does not choose a future palette or redesign current Astro during baseline reconstruction.

### U0 — Shared UI, components and shell

Owns:

- controls, actions, chips, pills and forms;
- EventCard-related shared structure after the current critical slice;
- other card families;
- rows, rails, shelves and grouping patterns;
- header, footer, navigation and floating island;
- medallion placement and shell composition;
- publishable component and shell packages;
- corrections assigned by V0.

The currently running E0 window becomes U0 after a safe publisher handoff so its context is reused rather than discarded.

### A0 — Archetypes, recovery and corpora

Owns:

- migration reuse from historical PRs and the old archive;
- Golden Corpus fidelity;
- route projections;
- deterministic auth/query/personalization state packets;
- desktop/mobile/tablet scenarios;
- factual route/archetype readiness;
- publishable archetype packages;
- corpus and product-semantic blockers.

Each window has a substantial all-day backlog and continues after its first package.

## 4. Direct Codex `/goal` D0

D0 is a long-lived implementation coordinator, not product owner or visual acceptance authority.

It controls six child agents:

1. `PUBLISH` — sole Penpot writer; consumes immutable ready packages and publishes persistent visual micro-batches.
2. `MAT` — materializer compiler and runtime repair.
3. `INTEGRATE` — package integration, path ownership, queue readiness and remote readback.
4. `CORPUS` — corpus/projection/state/schema/test implementation requested by A0.
5. `RECOVERY` — extraction of exact reusable assets and healthy structures from historical PRs/archive without old Penpot UUID lineage.
6. `QA` — independent technical validation, receipts, hashes, lineage and evidence automation; never self-accepts product visuals.

Several children may run concurrently. Only `PUBLISH` may call Penpot mutators.

## 5. Reuse-first authority

The following are migration capital, not restart prompts:

- Current UI Decoder and behavioral evidence;
- Component Synthesis IR;
- PR #37 card families, icons, medallions, artifacts and bounded review topology;
- PR #42 Golden Event Corpus and known visual drift;
- PR #43 Date Listing + Shell;
- PR #50/#52 17-archetype contracts and 34 desktop/mobile cases;
- PR #53 owner corrections and bounded-mutation lessons;
- current promoted free-page SoT, resolved cases, Astro evidence and current materializer;
- the old Penpot archive for exact bytes and healthy structural data.

`candidate`, `noncanonical` and `owner-review-pending` do not mean discard.

Reuse decisions:

- exact asset bytes: reuse by hash;
- semantic identities: reuse after current-consumer validation;
- anatomy, variants and layout patterns: reconstruct with new Penpot IDs;
- materialization logic and evidence structure: reuse after current input validation;
- old Penpot UUIDs/component IDs/shapeRefs: never reuse;
- detached copies and hidden roots: never reuse;
- screenshots: evidence only;
- stale PASS/READY labels: never reuse as current acceptance.

## 6. Communication and queue

Issue #57 is the shared mailbox. Every operational ChatGPT window and D0 reads and writes it directly. The owner does not carry task IDs, receipts or prompts between windows.

Queue lifecycle:

`DISCOVERED → PREPARING → READY_TO_PUBLISH → PUBLISHING → VISIBLE → VISUAL_REVIEW → PASS | REPAIR | BLOCKED_CORPUS_GAP | BLOCKED_PRODUCT_DECISION`

Markers:

- `ASP_CONVEYOR_CHECKPOINT_V2`
- `ASP_PACKAGE_READY_V2`
- `ASP_BUILD_REQUEST_V1`
- `ASP_PENPOT_VISUAL_DELTA_V2`
- `ASP_VISUAL_REVIEW_V2`
- `ASP_DEFECT_DIRECTIVE_V2`
- `ASP_CONVEYOR_INCIDENT_V2`
- `ASP_CONVEYOR_TERMINAL_V2`

Every package contains:

- package ID and priority;
- owning ChatGPT role;
- source branch and exact SHA;
- exact owning paths;
- source/donor authority;
- assets and hashes;
- component/pattern/archetype identities;
- resolved fixtures/state packets;
- target Penpot page/root;
- expected root/component/instance counts;
- materialization entry point;
- validation;
- exact Astro evidence cases;
- remaining blockers.

`ANALYSIS_COMPLETE`, `REGISTERED` and `PREPARED` are not terminal product states. Producer success is `READY_TO_PUBLISH`, `READY_TO_REPAIR`, `BLOCKED_CORPUS_GAP` or `BLOCKED_PRODUCT_DECISION`.

## 7. Owner interaction boundary

The owner is not the event loop.

Normal intervention is at most once every 40–60 minutes to resume a ChatGPT turn that the platform ended, using the same message:

`Продолжи по последнему ASP_CONVEYOR_CHECKPOINT_V2 в issue #57. Не повторяй завершённую работу.`

No copying of IDs, SHA values, receipts or directives between windows.

Routine reversible technical transitions require no owner approval. Owner input is reserved for:

- contract changes;
- product semantics;
- intentional visible redesign;
- future palette, typography or brand direction;
- irreversible action;
- genuinely ambiguous corpus membership.

## 8. Five-minute visual-output contract

When at least one package is `READY_TO_PUBLISH`:

- the sole publisher claims immediately;
- first persistent real Penpot mutation occurs within five minutes;
- further meaningful visual micro-batches occur no more than five minutes apart;
- each micro-batch is a real component, linked group, asset-library slice, review region or desktop/mobile archetype board;
- placeholders, empty boards, surrogate UI and temporary canaries do not count;
- each delta records revision, created IDs, component/instance counts, page/root and validation;
- V0 starts review within ten minutes of `VISIBLE`.

Five minutes without a visual delta is `PUBLISHER_STALL_INCIDENT`.

Incident response:

1. classify the exact cause;
2. route materializer/package repair;
3. if critical item remains blocked, publish the highest-priority independent fallback package;
4. return immediately when critical repair is ready;
5. do not stop the whole conveyor or ask the owner for a routine transition.

## 9. Blocker policy

Blockers are lane-local by default. A broken package moves to `REPAIR`; independent packages continue.

Global stop is allowed only for:

- duplicate Penpot writers;
- shared Penpot corruption;
- immutable tuple conflict;
- genuine owner product decision.

No new generation for normal success, visual review, package handoff or ordinary repair. No repeated preflight after a capability has already been proved.

## 10. Queue depth and fallback publication

- target `READY_TO_PUBLISH` depth: 3;
- minimum sustainable depth: 2;
- while PUBLISH handles N, producers prepare N+2 and V0 reviews N−1;
- a critical repair may not leave the writer idle when independent ready packages exist.

Fallback visual packages:

- exact action/navigation SVGs;
- medallions and brand/media assets;
- foundation specimens;
- controls/primitives;
- recovered card families;
- Date Listing + Shell replay;
- other archetype owner boards.

## 11. Current priority order

Critical free-page order:

1. four EventCard cases;
2. rows 2+3;
3. header, hero, medallion, footer and mobile navigation;
4. desktop/mobile top, scrolled and full-page cases;
5. final free-page visual review and owner-ready state.

Broad parallel order:

1. canonical icons/actions;
2. medallions and brand assets;
3. foundation specimens;
4. controls/primitives;
5. recovered card families;
6. shell patterns;
7. Date Listing + Shell;
8. all remaining archetype boards.

## 12. One-day milestone plan

### T+0–30 minutes

- O0, V0, F0, A0 and D0 registered;
- current E0 continues safely and prepares U0 handoff;
- six Codex child agents active;
- queue depth at least 2;
- V0 has exact Astro captures;
- first real Penpot visual delta appears.

### T+30–120 minutes

- EventCard four-case slice materialized;
- V0 performs direct Astro/Penpot review;
- systemic defects routed and repaired;
- icon/asset, foundations and shell packages enter queue;
- Penpot receives persistent visual micro-batches every several minutes.

### T+2–4 hours

- EventCard A=S=P;
- free rows and shell materialized;
- full desktop/mobile free page reviewed;
- free page becomes `READY_FOR_OWNER_REVIEW`.

### T+4–8 hours

- foundations, iconography, controls, card families and shell pages visibly populated;
- first half of current archetypes materialized and reviewed;
- Date Listing, Weekend and Exhibitions exact closure begins.

### T+8–16 hours

- every current archetype board physically exists in Penpot;
- corpus/state gaps resolved or isolated;
- V0 mass comparison and systemic propagation repairs.

### T+16–24 hours

- remaining differences repaired;
- compact owner index complete;
- every board has an actual visual status;
- final same-day owner-review package published.

## 13. Acceptance

The day succeeds only if:

- EventCard and the free page are visually proven rather than structurally asserted;
- Penpot visibly grows throughout the day;
- all five ChatGPT windows carry substantial continuous workload;
- D0 and its children keep implementation parallel;
- the owner is not used as message bus or micro-scheduler;
- historical work is reused rather than re-audited from zero;
- every current archetype is physically represented and visually classified.

Current running work is adopted non-destructively at its next safe checkpoint. No active Penpot mutator is interrupted merely to change orchestration topology.
