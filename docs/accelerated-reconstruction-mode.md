# Accelerated visual reconstruction mode

Pinned semantic handoff: PR `#44`, immutable head
`8c6b9c1017f1fb646b6bb757e1b6b2cf0e7b815d`, successful workflow run `58`
(`32718565248`), artifact `9516848991`, ZIP SHA-256
`7fa40f13b67720067d3b43f2d8fb406877dc3ba93ee05fa2bad6f8d249dea775`.
Its exact design-system parent is
`149cc9c56a1245e846c1abc614723078c3417cb7`; its exact Astro source is
`7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00`.

The local proof and allow-list are recorded in
`catalog/global-archetype-sot-v1/handoff-lock.v1.json`. If either repository
input, any approved semantic hash, or the immutable artifact fails that lock,
the state is `BLOCKED_SOT_HANDOFF` and Penpot must not be mutated.

This is the canonical operating contract for `global-archetype-sot-v1`. While
the complete reconstruction goal is active, it has priority over the older
per-wave review and per-parent reproof sequence.

## Pipeline

```text
pinned Astro source + generated browser output
→ verified global-archetype-sot-v1 semantic outputs in Git
→ native reusable UI and linked visual compositions in Penpot
→ direct owner review of the 17 real UI pages
```

Only the route/archetype registry, semantic contracts, component graph,
foundations, fixtures, reuse/new map, and gap ledger are build inputs. The old
Penpot plane, review route, source-state-index materialization, coverage/status
boards, tests, hashes, and operational receipts are not build inputs. They stay
in Git or historical evidence and never become UI.

The semantic plane owns anatomy, states, responsive branches, reuse/new
identity, foundations, fixtures, and explicit gaps. Penpot object IDs and
browser/Penpot evidence never enter product semantics.

## Materialization

- Penpot stores UI only. Page `63.00` and every service-only
  source-state-index/status/coverage/gap/test/hash board or component must be
  deleted from active review scope.
- Pages `63.01`–`63.17` remain owner pages, but their old scaffolds/proxies are
  replaced with native Astro AS-IS desktop and mobile compositions.
- Place reusable masters on their semantic owner pages and consume them through
  linked native instances. An archetype owner page is a composition, not a
  second component library.
- A reused resource is always a linked native instance; detached copies and
  screenshot masters are forbidden.
- Every visible datum comes from the pinned fixtures. Unique states are included
  only when they produce different UI. Event Detail includes every required
  media composition from its semantic contract.
- Freeze a source-conformant component. Reopen it only for an owner defect, a
  changed semantic contract/new structural context, or a failed regression.
- One lowest-owning central fix triggers one dependency-closure regression
  batch, not per-parent receipts or Telegram messages.
- Validate dense/stress/full-list behavior in generated Astro. Do not expand a
  Penpot page into a production-sized list merely to prove repetition.
- Keep pages bounded: one archetype family, its real desktop/mobile UI, and only
  its visible state variants. Do not add a state index or operational dashboard.

## Review

The handoff is an ordered set of direct links to the 17 real UI pages. A global
Penpot dashboard is forbidden. Owner comments continue through the normal
SoT-first loop; absence of a comment is not approval.

## Completion gate

`VISUAL_RECONSTRUCTION_READY` requires all of the following at once:

- all 17 archetypes have reviewable desktop and mobile UI;
- all SoT regions and required visible states are materialized, or an exact
  semantic gap remains explicit in Git;
- detached instances `0`;
- unregistered overrides `0`;
- Penpot validation `[]`;
- Astro↔Penpot desktop/mobile comparison `PASS` per archetype family;
- owner receives direct links to the real UI pages, not a dashboard;
- no redesign, backport, merge, promotion or deploy.

## Reproduction

```bash
node scripts/global-archetype-sot-v1/validate-handoff.mjs
```
