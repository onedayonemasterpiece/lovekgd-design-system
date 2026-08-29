# Статический сайт ↔ дизайн-система: текущий роутер

Status: `CURRENT_CROSS_BRANCH_ROUTER`

Последняя фактическая сверка: `2026-08-29`.

Latest registered owner review: `REV-IDEAHUB-20260829-14` / `OV-58` on active
PR `#53`.

Этот документ нужен потому, что опубликованный `main` и активная работа сейчас
находятся в разных слоях. Он не дублирует contracts/receipts, а показывает, где
искать текущую истину.

## Текущие слои

| Слой | Источник | Статус |
|---|---|---|
| Опубликованный snapshot | `main@c6419a62af3d73f53e81d95a518fbe62a4a1c942` | historical, 19 августа 2026; не текущий owner-review state |
| Source-proven AS-IS baseline | Draft PR `#52@b86bab3e91511b3d4bd7d953b22bceb847f02a51` | 17 архетипов / 34 desktop+mobile cases; no acceptance/promotion |
| Активный owner-review delta | Draft PR `#53`, branch `fix/penpot-owner-comments-20260826` | current contracts, Penpot readbacks, fixture registry, per-item review status |
| Golden Event Corpus pilot | Draft PR `#42@7a26772828a5d74a9683c08e7e6774ff15ac61a5` | identity gates PASS; visual conformance FAIL |
| Опубликованный Astro AS-IS | `events-bot-new/main@8710e56fa3685f6c30a90cd062d532dce0348cce` | current executable fact before promotion |
| Активный Astro/UI candidate | `events-bot-new#596`, branch `fix/audio-audit-ui-20260828` | Draft candidate; not production |

Fresh-read actual heads PR `#53` and `events-bot-new#596` before every new task.
SHA in this router is a checkpoint, not an eternal pointer.

## Source of Truth

Durable UI SoT is versioned Git contract/package data in this repository.

```text
before promotion:
pinned Astro/runtime → candidate Git UI SoT → native Penpot projection → owner review

after bounded owner acceptance:
accepted Git UI SoT/package → isolated Astro candidate
→ Penpot/Astro/generated-route parity → browser approval → promotion
```

Penpot is native visual implementation/review, not an independently editable
release authority. Automatic bidirectional Penpot ↔ Astro sync does not exist;
the operational loop is contract → materialization/integration → exact readback
→ tests → focused visual review.

## Last owner voice — factual corrections

Source: IdeaHub `voice-20260829-201612-4feb9e87`.

Canonical review route on active PR `#53`:
[`REV-IDEAHUB-20260829-14 / OV-58`](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/reviews/idea-hub-owner-voice-intake-20260829-continuation-14.md).

- Full bounded parity and technical lineage are valid requirements.
- “One Golden Corpus” means one exact named scenario/pool per comparison, not
  one universal event list. Current scopes include 8 component events, 5
  archetype events, 7 festivals, 3 clubs and 7 artifacts.
- Component masters/state catalogs stay on bounded library pages; archetypes
  consume linked instances. The forbidden state is a page-local master,
  detached copy or screenshot substitute.
- Bounded centralization is already proven for Date/Weekend/Popular/Festival
  and mobile Rail scopes, but global lineage closure and owner acceptance remain
  open.
- Structural PASS, visual PASS, owner acceptance, promotion and deploy are
  separate gates.

## Required route

1. [Current detailed router on active PR `#53`](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/static-site-design-system-current-state.md).
2. [Normative lifecycle on active PR `#53`](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/ui-source-of-truth-roundtrip.md).
3. [Owner-review router on active PR `#53`](https://github.com/onedayonemasterpiece/lovekgd-design-system/blob/fix/penpot-owner-comments-20260826/docs/reviews/index.md).
4. Exact affected family/archetype contract and latest receipt on `#53`.
5. Local Astro bridge on `events-bot-new#596`:
   `docs/features/static-site-pages/design-system/README.md`.
6. Executable fixture routing on `events-bot-new#596`:
   `docs/features/static-site-pages/design-system/reference-fixture-scenarios.md`.

## Forbidden claims

Until owner/release gates close, do not claim:

- automatic Penpot ↔ Astro synchronization;
- complete accepted/promoted design system;
- one proven technical ancestor for every visual card;
- universal Golden Corpus or site-wide visual PASS;
- Draft candidate in production;
- `validate()=[]` or a green test as owner acceptance.
