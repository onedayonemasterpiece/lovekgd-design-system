# Apply LoveKGD Component Synthesis v0.1

## Цель

Интегрировать уже сформированную candidate component model в существующую normalization architecture, материализовать native Penpot candidates и собрать page archetypes. Не выполнять повторную component taxonomy.

## Входы

- `entity-registry.jsonl` — 111 entity records;
- `current-to-candidate-mapping.jsonl` / `.csv` — exact 107 current files;
- `component-hierarchy.json` — nesting/composition graph;
- `page-archetype-registry.jsonl` — 18 candidate archetypes;
- `technical-reconciliation-queue.jsonl` — 6 evidence tasks;
- `penpot-materialization-plan.json` — W1–W5;
- existing decoder/behavioral snapshots in `main`.

## Обязательное исполнение

1. На актуальном `events-bot-new` SHA проверить exact equality 107 source paths и consumer/import edges; любое расхождение оформить finding, не переписывать silently.
2. Встроить records в существующие `catalog/normalization`, `contracts/normalization`, validators и receipts; не создавать параллельную architecture.
3. Сохранить high-confidence decompositions и transport split, пока точное source/runtime evidence им не противоречит.
4. Выполнить 6 technical reconciliation items. Они не являются owner questions.
5. Создать W1–W4 native candidate components в Resource Graph; все reconstructed/unaccepted/not promotion-ready.
6. Собрать 18 archetype candidates из component instances; uncovered regions помечать explicit gaps.
7. Старый Event Media owner pack оставить историей: `WITHDRAWN_FROM_OWNER_REVIEW`, `NEEDS_REVISION`, selected=0, accepted=0.
8. Открыть Draft PR. Не менять production `events-bot-new`, не merge PR автоматически.

## Fail-closed acceptance

- 107/107 current paths имеют ровно одну terminal mapping row;
- every mapping target, nested ref, hierarchy edge and archetype ref resolves;
- runtime/evidence/experiment/unresolved entities не становятся Penpot masters;
- every Penpot component имеет stable Git binding;
- every archetype состоит из instances или explicit gap;
- experiments остаются `NOT_MERGED`;
- owner ambiguity queue содержит 0 governance/technical questions;
- production source и public runtime не изменены;
- candidate materialization не означает acceptance/promotion.

## Source reconciliation checkpoint

- design-system origin/main: `c59a3576c7361c1953b31ad9b98ed096640e92c7`; extraction/lane base: `8bf4ad465cbd9d943935c201378b867a5d539456`;
- events source-reconciliation checkpoint: `96784bd572c03b965f303366c4ff0bb85d1b9a3f`; current Event Media truth audit: `f66330f8af81d4b898d137d83356e77914dce90a`; synthesis-observed: `a161061d8161409566412db2b1909031949dc104`; decoder-pinned: `66bc0d43e36299417626f992021cfb7299ddf704`;
- exact source paths: `107/107`; post-synthesis source/blob drift: `0`; decoder→current bounded nonmaterial instrumentation delta: `1`; import/consumer edge drift: `0`;
- entity count remains `111`: the obsolete unresolved mobile-search wrapper entity was removed while `listing.event-card` was added;
- current candidate components/controls: `63`; product patterns: `15`; evidence/experiment/unresolved: `7`; Penpot-eligible entities: `94`;
- W1–W4 plan: original package `61`, reconciled `64` (`16/13/17/18`). Lab-only `event.media-rail` and `event.list-item` are not materialized; current `listing.rail-row` replaces the false rail→EventCard model and owns `0..N` linked `event.media-frame` instances;
- mapping remains exact `107/107`; all six technical queue items have terminal results; owner ambiguity remains `0`;
- all records remain `canonical=false`, `accepted=false`, `promotion_ready=false`.

The immutable ZIP/manifest continue to bind the original package. The extracted JSONL/JSON/CSV records and reconciliation ledgers are the integrated, diffable source of truth.

## Implementation result

The candidate package is now executable rather than archive-only:

- immutable input: 51,301 bytes, SHA-256 `cb13d1bb7368eefa7b98763c1b065b27406e6a20b3c9b393935c2dc830aed446`; all 16 manifest entries matched;
- current source replay: 107/107 files and recorded import/consumer fingerprints at events commit `f66330f8af81d4b898d137d83356e77914dce90a`; 106 bounded Astro implementations, zero post-synthesis blob drift and one declared decoder-to-current non-material instrumentation delta;
- terminal technical reconciliation: 6/6, with `OWNER_AMBIGUITY_COUNT=0`;
- candidate contracts: 64 W1–W4 records and 64 exact fixture bindings over 39 shared fixtures;
- archetypes: 18/18 deterministic instance graphs, 349 materializable component/pattern instance nodes and 12 explicit gaps; detached copies and local overrides remain zero;
- deterministic Resource Graph IR: 64 native masters, 442 variants, 637 nested instances, 1,113 linked native fixture specimens and 349 archetype instances;
- rollback: exact synthesis-namespace stable-ID inventory, pre-W1 named-version requirement, scaffold preservation and explicit destructive authorization gate;
- validation: Draft 2020-12 registry/contract/archetype/receipt schemas, exact source replay, deterministic IR check and semantic negative mutations.

The IR uses the existing 23-page / 257-zone Resource Graph scaffold. Component masters resolve to canonical stable zones on pages 10/30/40/50; fixture projections use pages 62/64; archetype boards use page 60; no new page, screenshot master or detached copy is permitted.

## Live Penpot boundary

Only live mutation and live read-back are blocked. After the owner reloaded Penpot, a current probe succeeded against the exact Resource Graph at revision 33 with 23 pages and zero local native components. The original full-plan dry-run then exceeded the MCP request window and returned `HTTP 504`; a subsequent minimal probe also returned 504 and the alternate connector returned an internal error. The materializer was corrected to index shapes once and to support bounded component/archetype batches. Official troubleshooting: <https://help.penpot.app/mcp/>. No live write was performed: the failure occurred during read-only dry-run planning. A fresh page reload is required before the corrected bounded batches can execute.

The latest successful read earlier in the same task thread confirmed Resource Graph revision 33, 23 scaffold pages and zero native components at that time. It is retained only as `latest_confirmed_live_read`; it is **not** represented as current state. The current read-back count and revision-after remain null. The committed materializers are ready for a resumed exact-file run and perform a real second pass that must create zero objects.

The historical Event Media UI Exploration plan likewise preserves all existing object/thread IDs while targeting `WITHDRAWN_FROM_OWNER_REVIEW`, `NEEDS_REVISION`, selected=0, accepted=0 and owner consent absent.

## Event Media policy defragmentation

The previous `35` prose policy cells were not a single executable crop contract. They mixed producer truth, consumer requirements, stale CSS, deliberate exceptions and runtime gaps. The current candidate layer now separates them into:

- `21` source-pinned rule dispositions (`KEEP_CORE`, `KEEP_CONSUMER_PROFILE`, `REPLACE`, `BLOCKED_EVIDENCE`, `REMOVE_AS_STALE`);
- `17` consumer profiles that partition all `52` historical Event Media applications exactly once;
- `18` explicit fixture/state cases;
- one candidate resolver `foundation.event-media-decision`, with no global ratio, fit, crop, object-position or upscale default;
- one reusable `event.media-frame` whose native Penpot axis is only `case`, while fit/crop/object-position are resolver outputs, not independently selectable variants.

The two fail-closed conflicts remain open: the hero/gallery fill-first exception conflicts with the open exact-pixel geometry incident, and manual crop overrides are not exact-pixel-bound. The repository model does not silently choose a product rule for either conflict.

Current production `MobileListingRailRow` is modeled as `listing.rail-row`: the component owns row content plus `0..N` linked `EventMediaFrame` instances, preserves source order, uses default cap `4` and hard cap `6`, and leaves clipping/scrolling to the browser viewport. The old lab `EventMediaRail` and `EventListItem` are retained only as evidence and receive no native master.

### Lightweight Penpot proof

A separate small proof page was used instead of another tall whole-system canvas:

- page `43 — Media policy · EventMediaFrame`, id `a21f0524-f565-8038-8008-7885ffaaaf38`;
- native variant container `a21f0524-f565-8038-8008-78869aaecd24` with exactly five cases: safe cover, protected contain, reserved loading, broken fallback and bounded tiny source;
- native `listing.rail-row` proof `a21f0524-f565-8038-8008-7887764c732e` with four linked, non-detached frame instances selected by exact case;
- live read-back at revision `108`, duplicate stable IDs `0`, detached copies `0`, `File.validate()` errors `0`;
- second reconcile created `0` and updated `0` objects.

Direct page: <https://design.penpot.app/#/workspace?team-id=81f57451-85cc-819d-8008-70ebaeab3fd6&file-id=3be9e5e1-190f-8090-8008-713c0fbe6260&page-id=a21f0524-f565-8038-8008-7885ffaaaf38>.

Penpot's separate export backend returned exact HTTP `504` twice (container and small rail), while MCP semantic read-back remained healthy. The machine receipt therefore records `BLOCKED_EXPORTER_HTTP_504` and does not claim raster export evidence. The native objects and exact nesting were verified through semantic read-back.

## Reproducible commands

```bash
python3 scripts/component-synthesis-v0.1/validate-schemas.py --root . --require-receipt
node scripts/component-synthesis-v0.1/build-materialization-ir.mjs --root . --check
node scripts/validate-apply-component-synthesis-v0.1.mjs \
  --root . --events-repo /path/to/events-bot-new-at-f66330f
node tests/apply-component-synthesis-v0.1-negative.mjs .
node scripts/component-synthesis-v0.1/build-receipt.mjs \
  --root . --events-repo /path/to/events-bot-new-at-f66330f \
  --materialization-parent <pre-receipt-commit>
```

This application does not set `canonical`, `accepted` or `promotion_ready`, does not select an experiment winner, does not modify production Astro or the events repository, and does not merge the Draft PR.
