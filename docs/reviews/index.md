# Реестр owner review

Status: `ACCEPTED_OPERATIONAL_ROUTER`

Current revision: `REV-CHAT-20260829-01` / `OV-59`.

Этот файл — обязательная короткая точка входа для owner review дизайн-системы:
Penpot comments, IdeaHub/Telegram voice, текстовых уточнений и browser/device
review.

## История и полные ledgers

Полный register через `REV-IDEAHUB-20260829-13` / `OV-57` сохранён без
изменения evidence в
[`index-through-20260829-13.md`](index-through-20260829-13.md).

Следующие отдельные records сохраняют более позднюю историю:

- [`idea-hub-owner-voice-intake-20260829-continuation-14.md`](idea-hub-owner-voice-intake-20260829-continuation-14.md)
  — первоначальный анализ последнего IdeaHub voice; теперь interpretation
  superseded;
- [`owner-text-sot-ui-centrality-correction-20260829.md`](owner-text-sot-ui-centrality-correction-20260829.md)
  — точное owner clarification и текущая authority.

Исторические формулировки не удаляются молча. Новый owner decision supersedes
ошибочную интерпретацию, но не переписывает source evidence задним числом.

## Зарегистрированные последние review

| Review ID | Source | Item | Current status | Processed |
|---|---|---|---|---|
| `REV-IDEAHUB-20260829-14` | `voice-20260829-201612-4feb9e87` | `OV-58` | `INTERPRETATION_SUPERSEDED` | `NO` |
| `REV-CHAT-20260829-01` | owner text correction after the OV-58 handoff | `OV-59` | `READY_FOR_OWNER_REREVIEW` | `NO` |

All earlier sessions, exact source boundaries, UUIDs, revisions and receipts are
routed through the preserved through-13 ledger and their individual intake
files.

## Current authority correction: `OV-59`

Owner decision:

- **SoT UI is the central system**;
- its current durable implementation is versioned Git contracts/package data,
  fixture registry, bindings and receipts in `lovekgd-design-system`;
- Penpot is a native visual projection and review surface;
- Astro is the executable projection/consumer and, before promotion, current
  AS-IS evidence;
- an accepted Penpot review change returns to SoT UI first;
- target propagation is `SoT UI → Penpot` and `SoT UI → Astro`;
- Penpot must never become a direct or competing source for Astro.

The original full transcript already said that Source of Truth is the center.
The false “Penpot is central” thesis came from the generated summary and later
analysis, not from the owner.

Current router:
[`../static-site-design-system-current-state.md`](../static-site-design-system-current-state.md).

## Fixture authority correction

`OV-59` also reopens one earlier interpretation:

- current component certification uses 8 events;
- current archetype core uses 5 different events;
- both can support exact bounded tests;
- they are not yet proven to be one canonical Golden Corpus authority.

Target:

```text
one SoT UI fixture authority
→ typed fixture records
→ named scenarios/subsets
→ identical IDs and hashes in Astro and Penpot per case
```

Current status: `SOT_FIXTURE_AUTHORITY_UNIFICATION_OPEN`.

Different entity types and named scenario subsets are allowed. Parallel unlinked
event authorities are not a finished target architecture.

## High-signal current item routing

Detailed evidence remains in the preserved ledger and linked contracts.

| Item(s) | Current status / route |
|---|---|
| `OV-01…OV-08` | exact prior statuses and receipts in `index-through-20260829-13.md`; global lineage remains open under `OV-08` |
| `OV-09…OV-19` | cross-contour capture; not silently counted as design-system completion |
| `OV-20…OV-27` | action/navigation/Rail corrections; several visual exports remain blocked/deferred |
| `OV-28…OV-33` | exact dispositions in preserved ledger; `OV-30` continues to feed global lineage |
| `OV-34…OV-48` | bounded source-bound archetype and state receipts; owner acceptance remains separate |
| `OV-49` | `EXPLICIT_DECISION_REQUIRED` for `/neobychnoe/` editorial authority |
| `OV-50…OV-52` | bounded HeroTalk/Weekend/Floating Island corrections ready for rereview |
| `OV-53` | icon candidate taxonomy materialized; visual export blocked |
| `OV-54` | foundations/root migrations advanced; global migration and acceptance open |
| `OV-55`, `OV-56` | Event Detail portrait/motion/keyboard/continuation corrections materialized; owner rereview open |
| `OV-57` | bounded fixtures and FestivalCard structural parity; raster comparison blocked |
| `OV-58` | superseded only where it falsely attributed Penpot centrality and normalized fixture split |
| `OV-59` | corrected SoT authority and fixture reanalysis ready for owner rereview |

## Status semantics

- `READY_FOR_OWNER_REREVIEW` means documentation/implementation/readback is
  available but explicit owner acceptance is absent;
- `processed: YES` is limited to `CONTEXT_ONLY`, `OWNER_ACCEPTED` or `CLOSED`;
- structural PASS, visual PASS, owner acceptance, promotion and deploy are
  separate gates;
- a correction can supersede interpretation without closing the underlying
  visual/component items.

## Mandatory route

```text
owner review
→ separate intake/correction record
→ registration here
→ exact SoT disposition
→ bounded Penpot/Astro projections from the same SoT version
→ structural readback + visual evidence
→ READY_FOR_OWNER_REREVIEW
→ explicit owner acceptance
→ CLOSED
```

## Whole-contour blockers

Global `READY_FOR_OWNER_REVIEW` remains forbidden while any of these are open:

- component and non-card lineage census/acceptance outside proven scopes;
- SoT fixture-authority unification across component and archetype event cases;
- required visual exports blocked by Penpot HTTP 504;
- `/neobychnoe/` editorial authority;
- token/family migration and per-family promotion;
- explicit owner acceptance;
- release approval and post-deploy conformance.
