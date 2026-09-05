# Product Atlas parallel recovery gate — 28 августа 2026

> **Статус:** `GIT_RECOVERED_READY_FOR_SEPARATE_PENPOT_TARGET_BINDING`  
> **Penpot reads/writes:** `0 / 0`  
> **Назначение:** разрешить параллельную продуктовую визуализацию, не объявляя незавершённую дизайн-систему готовой.

## Решение

Product Atlas не обязан ждать завершения всех component-family, archetype, owner-review и promotion gates.

Действующая схема:

```text
stable Product Atlas semantic IDs
+ source-proven AS-IS UI baseline
+ active owner-review delta
+ active Astro candidate
+ product hypotheses
+ unresolved evidence/bindings
→ separate Product Atlas Penpot account/file later
```

Каждый слой сохраняет собственный статус. Нельзя смешивать их в один `latest UI` или представлять candidate UI как accepted design/outcome.

## Exact Git state

### Canonical product model

- repository: `onedayonemasterpiece/events-bot-new`;
- Draft PR: `#574`;
- head: `2b666550311d502bfec2f40a7ab3edfc8b65c8d9`;
- registry: `docs/product-model/atlas/v1/`;
- recovery lock: `current-source-lock.2026-08-28.v2.json`;
- current delta: `product-delta.2026-08-28.v2.json`;
- visualization handoff: `visualization-handoff.2026-08-28.v1.json`.

Targeted workflow `33211354213` — `SUCCESS`:

```text
282 stable entities
11 recovery entities
22 entity kinds
35 sources
17 archetypes
15 user stories
6 visualization views
2 focused tests passed
```

### Source-proven AS-IS UI substrate

- repository: `onedayonemasterpiece/lovekgd-design-system`;
- Draft PR: `#52`;
- head: `b86bab3e91511b3d4bd7d953b22bceb847f02a51`;
- handoff: `catalog/product-atlas-linkage-handoff/v1/design-system-linkage.v1.json`;
- handoff blob: `6c5fe775e2bcc7c767a9a1c3509b61f1feafce77`.

Coverage:

```text
17 archetypes
34 desktop/mobile boards
97 semantic regions
97 visual patterns
75 component identities
180 ProductScreenStates
0 orphan design IDs
```

Это достаточный site-as-is substrate для продуктовой проекции. Это не owner acceptance, promotion, deployment или outcome evidence.

### Active UI deltas

- owner-review PR `#53@47d0fef53c33200492d92f6a086d9b8813fe187e` — `IN_PROGRESS`; отдельные items имеют `READY_FOR_OWNER_REREVIEW`, но ещё `processed: NO`;
- Astro/UI candidate `events-bot-new#596@49c351873d40a2ea55f0a32837c7376e344d9c17` — unmerged Draft candidate;
- agent-assisted discovery/location plan `events-bot-new#587@f78e7c5974b4192bddf9eea901ee6d8b57f51560` — research/hypothesis only.

### Thin UI projection

- Draft PR: `lovekgd-design-system#51`;
- base: branch/head PR #52;
- head: `2e3e7c1d4a4e0a7053a0aecfa89889dd817fc2bf`;
- targeted workflow `33211606671` — `SUCCESS`.

Validation result:

```text
282 stable product entities
293 effective product entities after recovery delta
17 archetype links
97 region bindings
6 future view bindings
0 target bindings
0 fabricated IDs
2 focused tests passed
```

## Future Product Atlas views

The Git handoff declares:

1. product system overview;
2. site-as-is product map across 17 archetypes;
3. product problem/UI-gap radar;
4. outcome/evidence map;
5. journeys and recovery paths;
6. current product versus hypotheses.

## Separate Penpot target

The future target must be a **separate Penpot account and separate Product Atlas file**.

Before an explicit MCP target read:

```text
account/team/file IDs = null
page/board/object IDs = empty
binding_status = binding_pending
reuse design-system Penpot IDs = false
plugin = not_applicable
```

The existing design-system Penpot file and IDs are source evidence only. They are not target bindings for the new account.

## MCP entry gate

When Penpot becomes available:

1. fresh-read PR #574, #52, #53, #51 and relevant Astro candidate heads;
2. stop on any exact-source drift and write a new delta instead of silently mixing states;
3. read or create the separate Product Atlas target file;
4. record real account/team/file identity before mutation;
5. materialize only the six declared views;
6. keep accepted, AS-IS, active-review, hypothesis and unresolved layers visually distinct;
7. read back page/board/object identities;
8. commit a versioned MCP receipt;
9. only then replace `binding_pending` placeholders.

## Non-blocking unfinished design-system work

The following remain visible product/UI gaps but do not block Product Atlas visualization:

- component-family promotion and consumer migration;
- global component-lineage owner review;
- `ListingDiscoveryRail@6` owner rereview;
- exact seven-artifact Collection 1 owner rereview;
- Home HeroTalk Photo Mosaic owner rereview;
- Event Detail unresolved states;
- Search/Favorites/Personal Feed normalization;
- shell/foundation and loading-state vocabulary.

They must be shown as gaps/deltas, not hidden or upgraded to accepted.

## Completion boundary

This gate proves Git readiness for later product visualization. It does not claim:

- complete design-system normalization;
- processed owner review;
- merged/deployed Astro candidates;
- measured user/owner outcomes;
- existing Product Atlas Penpot target or bindings.
