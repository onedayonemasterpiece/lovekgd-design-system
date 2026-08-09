# Source-first component and current-UI decoder

## Статус

Архитектурный контракт принят. Первый ограниченный v1 decoder выполнен, визуально проверен и импортирован как immutable compact snapshot.

Decoder создаёт реконструируемое описание текущего UI и candidate Component Contracts. Он **не** строит дизайн-систему в Penpot и **не** сопоставляет Astro со старыми Penpot-экспериментами.

### Выполненный snapshot

- compact catalog: [`../catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/`](../catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/);
- product source: `events-bot-new@ef7aa62e45c60f7a12da6160f490719c0721ec03`;
- capture decoder: `events-bot-new@961cd3506f5dc538097299b67c975b4fa117e5c9`;
- review materializer: `events-bot-new@25d82f59f891b9d64861cd15b787c5c0f86fd129`;
- [Actions run 31293484656](https://github.com/onedayonemasterpiece/events-bot-new/actions/runs/31293484656), artifact `9032355884`, digest `sha256:add07915b6b70da2a7d825e64e08a91da6d8eb28657d70a0009d087bc0f952b2`;
- [permanent heavy-evidence release r2](https://github.com/onedayonemasterpiece/events-bot-new/releases/tag/current-ui-decoder-v1-snapshot-20260808T124842-4786ac53bc-r2), digest `sha256:a6ad9244b3ead55424f303fc15efbd988c07a507843bdf9728626e2850335e9c`;
- 107 logical component dispositions, 12 candidate AS-IS contracts, 6 reviewed capsules;
- 22 controlled observations, 135 raster-backed page records and 157/157 indexed rasters manually inspected;
- reviewed manifest `sha256:f7740f7f533c3f0cda5d4d0b8ebe98b565d7f521368b96462daecbd26522d5cc` and review ledger `sha256:88eeaf712a8d7534d53ffabaa0ab98c6eaa54f3e8dea54c2086d8d5c69f7165b`;
- receipt verdict: `GO_FOR_FAMILY_SCOPED_DEFRAGMENTATION`.

`GO` здесь означает, что evidence достаточно для отдельного family-scoped анализа дефрагментации. Это **не** означает принятие contracts, equivalence, merge/split, tokenization, normalization, Penpot materialization или изменение Astro/CSS/runtime. Все candidate contracts имеют `candidate-as-is-not-accepted`, а решения остаются `NOT_MERGED`.

### Append-only behavioral supplement v1.1

Behavioral/action/media evidence не переписывает завершённый v1. Для его reviewed final import
зарезервирован отдельный sibling-каталог:

```text
catalog/component-decoder/
├── decoder-v1-snapshot-20260808T124842-4786ac53bc/                 # immutable
└── behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/ # append-only sibling
```

Reviewed v1.1 импортирован как evidence-запись с финальным статусом
`EVIDENCE_COLLECTION_INCOMPLETE`. Все заявленные output bytes/SHA проходят отдельный validator,
124/124 raster имеют file-level `reviewed-full-resolution`, Actions artifact продублирован
durable GitHub Release asset, secret scan прошёл, independent audit имеет `PASS`. Два уникальных
readiness blocker сохранены: отсутствует рабочее native `End`/`Home` поведение mobile rail, а
полная 293-row breakpoint/container matrix не имеет отдельного truthful runtime probe для каждой
строки.

Проверка после импорта:

```bash
node scripts/validate-behavioral-decoder-supplement-v1-1.mjs \
  catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc
```

Отдельный workflow одновременно повторно проверяет v1 и требует его исходный Git tree
`e77fc2457fadfdffb46ed2d90304ebb91e89a715`. Behavioral supplement не добавляет, не удаляет,
не объединяет и не делит компоненты v1; controlled runtime не объявляется production evidence.
Текущий статус не разрешает следующий project normalization synthesis и тем более не означает
`READY_FOR_PHYSICAL_DEFRAGMENTATION`. Даже возможный будущий
`READY_FOR_PROJECT_NORMALIZATION_SYNTHESIS` будет означать только аналитическую готовность, а не
автоматическое физическое изменение компонентов.

Воспроизводимая проверка compact tree:

```bash
node scripts/validate-component-decoder-snapshot.mjs \
  catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc
```

## Цель

```text
Astro source and generators
→ controlled isolated component specimens
→ cheap complete runtime reachability scan
→ representative real-page verification
→ source/specimen/page reconciliation
→ candidate Component Contracts and gaps
→ Git snapshot + heavy Actions artifact
→ STOP
```

## Входы

- exact pinned `events-bot-new` source SHA;
- Astro/TS/JS/CSS source;
- component-generating scripts and generated-file provenance;
- production-surface contracts;
- route/data fixture generators;
- current built pages from the same SHA.

Старые Penpot component names/IDs, screenshots и catalogs не являются входом.

## Почему runtime-first 005 не подходит как основной decoder

Run `31242437901`, job `93065530845`:

- успешно построил 469 Astro pages;
- обработал 390 runtime clusters;
- затем упал на `JSON.stringify(catalog)` с `RangeError: Invalid string length`;
- не создал `receipt.json`;
- не загрузил usable artifact.

Помимо serialization failure, pipeline превращал почти каждый route instance в отдельный cluster. Сотни event/date pages чаще являются fixtures нескольких route families, а не самостоятельными archetypes.

Полезные части 005 сохраняются только как runtime evidence, outlier detection и responsive verification. Он не определяет component identity.

## Три слоя evidence

### 1. Source and generators

Извлекаются:

- definitions and exports;
- generator provenance;
- imports and consumers;
- component composition graph;
- props, defaults, unions/enums;
- slots;
- conditional branches and derived states;
- class/style/token references;
- media and responsive logic;
- runtime data attributes;
- route/template consumers;
- local/external CSS overrides.

### 2. Controlled isolated specimens

Specimen harness строится из реальных component definitions и содержит:

- production-observed combinations;
- required structural states;
- explicitly labelled synthetic stress fixtures.

Не создаётся полный Cartesian product.

### 3. Real generated pages

Все pages участвуют в cheap reachability/state-signature pass. Дорогие screenshots/traces/accessibility/computed-style captures выполняются на set-cover selection плюс structural outliers.

## Component family discovery

Decoder не предполагает `one .astro file = one design component`. Он должен обнаруживать:

```text
one Astro component → one UI family
one Astro component → several candidate components
several components/fragments → one candidate family
inline reusable fragments
CSS-only patterns
monolithic reusable substructures
duplicated implementations
runtime-only structures
source-only/lab-only structures
unresolved mappings
```

Visual similarity и похожие names — только supporting evidence. Неопределённость остаётся explicit.

## Candidate record

```yaml
candidate_component_id: core.button
source_bindings: []
relationship_kind: one-to-one | one-to-many | many-to-one | missing | unresolved
evidence: []
confidence: deterministic | observed | inferred | unresolved

candidate_contract:
  version: 0.x
  semantic_role: ...
  anatomy: []
  props: {}
  slots: {}
  variant_axes: {}
  state_axes: {}
  nested_component_refs: []
  token_refs: []
  responsive_contract: []
  fixture_classes: []

production_consumers: []
normalization_gaps: []
promotion_blockers: []
unresolved_alternatives: []
```

## Boundary instrumentation

Astro component boundaries исчезают в итоговом HTML. Decoder использует test-only instrumentation, которое не меняет production output и layout.

Предпочтение:

```html
<!-- ds:start component=... version=... state=... -->
...
<!-- ds:end -->
```

Для multi-root fragments Playwright измеряет DOM Range между comments. Layout-affecting wrappers не добавляются без доказанной необходимости.

## Route-family model

Ready pages группируются по:

- route/template family;
- component composition;
- state signature;
- responsive structure;
- meaningful media/content stress class.

Один dynamic event-detail archetype имеет несколько states/fixtures, а не отдельный archetype на каждое событие.

## Reconciliation results

Для каждой reviewed family сравниваются:

```text
source says
specimen shows
real page shows
```

Допустимые conclusions:

- match;
- source/specimen mismatch;
- specimen/page mismatch;
- local production override;
- page-only state;
- specimen-only state;
- duplicated implementation;
- missing normalized component;
- unresolved mapping.

Mismatch не нормализуется молча.

## Обязательные read-only capsules

Первый decoder snapshot содержит минимум три капсулы:

1. explicit variant/state component — предпочтительно EventHero или лучший обнаруженный аналог;
2. fragmented family — предпочтительно Button/CTA;
3. media-heavy component — EventCard/EventHero или лучший обнаруженный аналог.

Каждая капсула содержит source facts, candidate contract, isolated specimen, real-page consumer, state/token/dependency mapping, screenshots, override findings и reviewer conclusion.

Penpot в этих capsules не участвует. Three-way Penpot conformance начинается после первой materialization.

## Neural supervision

LLM/agent не заменяет deterministic extraction. Он обязан визуально и семантически проверить:

- все три capsules;
- наиболее используемые families;
- все proposed merges;
- Button/CTA fragmentation;
- все high-impact mismatches;
- все route-family outliers;
- все unresolved high-impact mappings.

Для каждого review сохраняются evidence, альтернативная интерпретация и confidence.

## Output architecture

Один монолитный `catalog` запрещён. Используются streamed/sharded, diffable outputs:

```text
catalog/component-decoder/<snapshot-id>/
├── manifest.json
├── receipt.json
├── summary.md
├── source-files.jsonl
├── component-families.jsonl
├── components/*.json
├── candidate-contracts/*.contract.json
├── source-bindings.jsonl
├── composition-edges.jsonl
├── consumers.jsonl
├── route-families.jsonl
├── page-state-signatures.jsonl
├── specimen-plan.jsonl
├── specimen-observations.jsonl
├── page-verification.jsonl
├── mismatches.jsonl
├── unresolved.jsonl
├── conformance-capsules/**
├── penpot-materialization-candidates.json
└── artifact-index.json
```

Screenshots, traces, detailed DOM, accessibility snapshots, computed styles and full logs остаются в immutable GitHub Actions artifact.

Behavioral v1.1 использует такой же compact/heavy split: diffable JSON/JSONL, receipts и audit
лежат в sibling supplement, а 124 raster files остаются в Actions artifact и durable Release asset.
Compact `artifact-index.json` обязан связывать каждую raster path/SHA с её full-resolution review.

## Failure safety

- file-size budgets enforced;
- no embedded base64 media/full repeated HTML;
- output bytes/largest entries measured per shard;
- partial receipt always written;
- artifact upload runs with `if: always()`;
- injected-failure test proves resumability/diagnostics;
- exact source and decoder SHAs recorded.

## Heavy operations policy

GitHub Actions выполняет corpus-wide extraction, build, full scans, screenshots, diffs, validation and artifact packaging. Interactive agent потребляет compact summary, mismatches, capsules и requested slices — не перечитывает весь corpus.

## Stop boundary

Decoder task заканчивается после:

- successful Actions run;
- downloadable non-empty artifact;
- committed compact snapshot;
- recorded counts/checksums;
- reviewed capsules and unresolved list.

Он не:

- мутирует Penpot;
- создаёт native components;
- переносит Astro components в новый package;
- рефакторит production UI;
- принимает contracts;
- включает visual baseline gate;
- запускает следующую реализацию автоматически.

Для behavioral supplement STOP дополнительно запрещает:

- выдавать controlled exact-source specimen за production observation;
- заменять full-resolution review perceptual hash/contact sheet;
- выбирать winner среди CTA или transport treatments;
- превращать 2:3, 4:5 или 5:4 в универсальный media token;
- начинать physical defragmentation на основании одного статуса synthesis readiness.
