# Prototype 003 — exact AS-IS runtime → named Penpot pages

This prototype replaces the synthetic 002B load corpus with screenshots rendered from the real Astro site at an exact `events-bot-new` commit.

## Source contract

- `site/src/pages/lab/design-system/index.astro` is an existing runtime component gallery and registry.
- Public page archetypes are captured from the built routes (`/`, `/segodnya/`, `/zavtra/`, `/vyhodnye/`, `/populyarnoe/`, `/podborki/`, `/festivali/`, and one generated event page when available).
- Playwright captures desktop and mobile runtime output.
- Every screenshot is committed with SHA-256, source path, route, selector, viewport and exact source commit.
- The Penpot plugin only imports those exact screenshots. It does not redraw UI.

## Penpot page architecture

- `00 — System map`
- `20 — Foundations`
- `30 — Core UI`
- `40 — Announcements components`
- `60 — Page archetypes`
- `70 — AS-IS registry`
- `80 — Candidate review`
- `90 — Review archive`
- `99 — Technical tests`

If the current file contains Prototype 002B boards on an unnamed `Page 1`, the plugin renames that page to `99 — Technical tests`. It does not delete foreign or manually created boards.

## Current-mirror rules

- one current board per `elementId`;
- unchanged exact screenshot → `noop`;
- changed screenshot without comments → replace;
- changed screenshot with native Penpot comments → keep the old board as a review snapshot and create the new current board;
- removed screenshot without comments → remove;
- removed screenshot with comments → preserve as review evidence;
- all new/replacement boards are staged before the current mirror switches;
- any hash/upload/staging failure stops the sync.

## What this prototype proves

1. Real runtime capture rather than invented components.
2. Named, layered Penpot pages rather than one anonymous canvas.
3. Desktop and mobile evidence.
4. Exact Git provenance.
5. Native Penpot comment → deterministic prompt flow.
6. Safe repeat sync when `events-bot-new` changes.

This is still AS-IS evidence. It does not automatically promote a runtime state to an approved design-system rule. Candidate and released layers require explicit owner sign-off.
