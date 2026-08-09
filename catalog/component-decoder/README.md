# Current UI component decoder snapshots

Здесь хранятся только компактные, diffable и проверяемые снимки реконструкции текущего UI.

## Актуальный снимок

- [`decoder-v1-snapshot-20260808T124842-4786ac53bc/`](decoder-v1-snapshot-20260808T124842-4786ac53bc/)
- source: `events-bot-new@ef7aa62e45c60f7a12da6160f490719c0721ec03`
- capture decoder: `events-bot-new@961cd3506f5dc538097299b67c975b4fa117e5c9`
- review materializer: `events-bot-new@25d82f59f891b9d64861cd15b787c5c0f86fd129`
- Actions run: [`31293484656`](https://github.com/onedayonemasterpiece/events-bot-new/actions/runs/31293484656), artifact `9032355884`, digest `sha256:add07915b6b70da2a7d825e64e08a91da6d8eb28657d70a0009d087bc0f952b2`
- permanent heavy evidence: [GitHub Release r2](https://github.com/onedayonemasterpiece/events-bot-new/releases/tag/current-ui-decoder-v1-snapshot-20260808T124842-4786ac53bc-r2), digest `sha256:a6ad9244b3ead55424f303fc15efbd988c07a507843bdf9728626e2850335e9c`
- reviewed evidence: 22 controlled observations, 135 raster-backed page records and 157/157 indexed rasters
- verdict: `GO_FOR_FAMILY_SCOPED_DEFRAGMENTATION`

Этот verdict разрешает только следующий **аналитический** этап по отдельным семействам. Он не принимает candidate contracts, не объединяет компоненты, не нормализует цвета/типографику, не создаёт токены и не мутирует Penpot или Astro.

## Append-only behavioral supplement v1.1

Для dynamic/media/geometry/interaction evidence зарезервирован sibling-путь:

- `behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/`;
- base: immutable `decoder-v1-snapshot-20260808T124842-4786ac53bc/`;
- base manifest SHA-256: `f7740f7f533c3f0cda5d4d0b8ebe98b565d7f521368b96462daecbd26522d5cc`;
- expected immutable v1 Git tree: `e77fc2457fadfdffb46ed2d90304ebb91e89a715`;
- import status: **reviewed append-only evidence imported**;
- final status: `READY_FOR_PROJECT_NORMALIZATION_SYNTHESIS`;
- counts: 293 terminal probes (236 PASS, 39 MISMATCH, 18 UNREACHABLE_WITH_REASON),
  87 unresolved findings, zero readiness blockers, 134 observations/rasters/reviews;
- manifest SHA-256: `c676be4f2ad956b8a58c7707c8f71b7bb33afd771e506457309597e76d67d9a1`.

Все 134 raster прошли file-level full-resolution review; Actions artifact продублирован durable
GitHub Release asset, independent audit имеет `PASS`, оба validator проходят. Путь никогда не
вкладывается в immutable v1. Данные остаются `NOT_MERGED` и не разрешают физические component
operations, tokens, experiment winner, Penpot или production Astro/CSS/JS mutation.

Проверка:

```bash
node scripts/validate-component-decoder-snapshot.mjs \
  catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc
```

После импорта supplement:

```bash
node scripts/validate-behavioral-decoder-supplement-v1-1.mjs \
  catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc
```
