# ASP Production Conveyor — Non-blocking work stealing V6

Date: 2026-08-31

This is an operational addendum to the current A=S=P conveyor. It does not replace `kenigevents.asp-conformance`, alter product semantics, create a new generation, or authorize a second Penpot writer.

## Product invariant

The unit of progress is a persistent, reviewable Penpot visual delta followed by direct Astro ↔ Penpot review. Git packages, receipts, tests, manifests and queue markers are enabling artifacts, not product output.

## Package-local blocking

A defect blocks only the affected package or mutation phase.

It must not block an entire ChatGPT role, an entire Codex child, the publisher, or the conveyor when independent work exists.

Within two minutes of a package-local stop, the owning role must do one of the following:

1. start the lowest-owner repair for that package; and
2. continue its independent secondary backlog; or
3. claim another non-overlapping ready item.

A role may report `WAITING` only when all of its primary and secondary backlog items are either terminal or depend on a real product decision.

## Role work-stealing rules

### O0

- Reconcile liveness from fresh actions, not old `ACTIVE` markers.
- A stale ChatGPT role never blocks publication.
- Publish one exact resume prompt for a stale role, then route critical implementation to D0 children and continue.
- Maintain at least two publisher-consumable candidates where possible.
- During repair of the priority free-page package, route the highest-priority independent candidate to PUBLISH.

### V0

While waiting for a new Penpot delta:

- freeze upcoming exact Astro DOM/bounds/PNG cases;
- prepare bounded comparison regions;
- review the latest stable Penpot roots;
- trace visual defects to G0/U0/A0/MAT ownership;
- verify whether a shared defect propagates to other consumers.

V0 does not wait idly for the next export.

### F0

If one foundation package is blocked, continue with the next independent package among:

- exact SVG/action/navigation assets;
- medallions and brand assets;
- foundation specimens;
- typography/layout;
- brandbook baseline;
- shared foundation bindings.

F0 does not access Penpot and does not wait for D0 to publish an earlier F0 package.

### U0

If EventCard repair is blocked, continue independent work on:

- controls/primitives;
- free rows 2+3;
- free shell;
- shared card families;
- shelves/patterns;
- header/footer/navigation;
- floating island and medallion placement.

U0 continuously consumes V0 defects and publishes corrected immutable packages. U0 does not access Penpot.

### A0

If one archetype package is blocked, continue with:

- Golden Corpus fidelity/schema/hash closure;
- projections and deterministic state packets;
- Date Listing replay;
- next archetype wave;
- selective donor recovery;
- compact owner-review index.

A0 does not wait for prior archetype publication before preparing the next independent package.

### D0 / PUBLISH

PUBLISH is the only Penpot writer.

If the priority package stops in REPAIR:

1. preserve its accepted persistent state;
2. route the exact defect to MAT/QA or the producer;
3. immediately claim the highest-priority independent executable candidate;
4. keep Penpot visibly growing;
5. return to the priority package as soon as its repair passes.

A package in `REPAIR` must not be used to rewrite queue depth to zero when other candidate packages exist.

When a producer package is declarative but has a complete deterministic build contract, D0/MAT may build the smallest technical adapter required for candidate materialization. It must not restart source discovery or a global acceptance audit.

## Current independent candidate backlog

At publication time, issue #57 contains independent candidate inputs including:

- U0 free rows 2+3 and free shell;
- F0 foundation specimens;
- A0 Date Listing + Shell candidate adapter;
- A0 archetype wave 1 candidate adapter.

These candidates may remain non-promoted and visually pending V0. That status does not prevent bounded candidate materialization on separate candidate pages.

## Five-minute visual output rule

When at least one executable candidate exists:

- first persistent visual mutation begins within five minutes;
- further meaningful visual micro-batches appear no more than five minutes apart;
- empty boards, placeholders, canaries, setup metadata and invisible migrations do not count;
- each visual delta records revision, persistent IDs, component/instance counts, validation and an exportable review root.

If five minutes pass without a meaningful delta, O0 records a publisher-stall incident and PUBLISH switches to an independent ready candidate while the blocked item is repaired.

## Old Penpot donor archive

Exact archive identity:

```text
name: Новый файл 1 (дизайн система penpot).zip
bytes: 214075969
sha256: 271dad387a11487019cca0d27f01f9895da0f419ec09982ef3eef18a32cf32c3
old Penpot file: 3be9e5e1-190f-8090-8008-713c0fbe6260
```

ChatGPT producer windows with File Library access may locate the archive by exact name and must verify the fingerprint before using it.

The direct Codex server does not automatically gain access to ChatGPT File Library. D0/RECOVERY consumes bounded donor artifacts extracted by a ChatGPT producer into Git, unless the owner separately places the raw archive on the development server.

Allowed reuse:

- exact SVG/raster bytes;
- semantic identities;
- component anatomy;
- variant/state names;
- media framing rules;
- bounded page composition;
- materialization/evidence patterns.

Forbidden reuse:

- whole-file import;
- old Penpot UUIDs/component IDs/shapeRefs;
- detached copies;
- hidden roots;
- screenshots as implementation;
- stale fixtures;
- historical PASS/READY labels.

## Adoption and liveness

GitHub is durable pull-based state, not a wake-up bus.

An active turn adopts this addendum only after a fresh read. A stopped ChatGPT window must be resumed by one owner message. On resume, it must continue from its latest remote checkpoint and must not repeat completed work.

Common resume message:

```text
Fresh-read issue #57 from ASP_NONBLOCKING_WORK_STEALING_V6 onward and adopt WORK_STEALING_V6.md. Continue your existing role from its latest remote checkpoint. A blocked package does not block the role: start its exact repair and immediately continue the highest-priority independent backlog item. Do not restart the global audit, do not create another Penpot writer, and publish the next immutable package or visual result.
```
