# Accelerated reconstruction mode

Pinned semantic/materialization input: design-system commit `adeb9e4` and Astro
commit `7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00`.

This is the canonical operating contract for `global-archetype-sot-v1`. While
the complete reconstruction goal is active, it has priority over the older
per-wave review and per-parent reproof sequence.

## Pipeline

```text
current Astro source + generated browser output
→ global-archetype-sot-v1 semantic plane
→ separate Penpot binding and evidence planes
→ one bounded dependency-closure materialization batch
→ one review route + gap ledger
```

The semantic plane owns anatomy, states, responsive branches, reuse/new map,
foundations and fixtures. Penpot object IDs never enter it. Browser and Penpot
evidence never become product semantics.

## Materialization

- Place masters directly on final owner pages.
- A reused resource is always a linked native instance; detached copies and
  screenshot masters are forbidden.
- Freeze a source-conformant component. Reopen it only for an owner defect, a
  changed semantic contract/new structural context, or a failed regression.
- One lowest-owning central fix triggers one dependency-closure regression
  batch, not per-parent receipts or Telegram messages.
- Validate dense/stress lists in generated Astro. Penpot keeps representative
  linked instances and the source state index.
- Keep pages bounded: one archetype family and its desktop, mobile and unique
  state-index masters per owner page.

## Review by exception

| Observed fact | Status |
|---|---|
| no owner interaction | `NOT_REVIEWED` |
| bounded feedback and verified correction | `REVIEWED_BY_EXCEPTION` |
| no recorded comment | `NO_RECORDED_OBJECTION` |
| Astro-conflicting/product change | explicit decision required |

`NO_RECORDED_OBJECTION` is not explicit approval.

## Completion gate

`RECONSTRUCTION_ATLAS_READY` requires all of the following at once:

- route/archetype coverage `100%`;
- required desktop/mobile/unique-state projections;
- detached instances `0`;
- unregistered overrides `0`;
- Penpot validation `[]`;
- sampled conformance `PASS` for new/changed resources;
- exactly one review route and the current gap ledger;
- no redesign, backport, merge, promotion or deploy.

## Reproduction

```bash
node scripts/reconstruction-atlas/build-source-atlas.mjs
node scripts/reconstruction-atlas/capture-browser-atlas.mjs
node scripts/reconstruction-atlas/validate-reconstruction-atlas.mjs
node scripts/reconstruction-atlas/build-materialization-ir.mjs
node scripts/reconstruction-atlas/validate-materialization-ir.mjs
node scripts/reconstruction-atlas/build-global-archetype-sot.mjs
node --test tests/reconstruction-atlas-v1.test.mjs \
  tests/reconstruction-atlas-materialization-ir.test.mjs
```
