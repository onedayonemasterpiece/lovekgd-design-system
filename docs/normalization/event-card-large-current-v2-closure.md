# EventCard Large current-v2 closure contour

Status: **BLOCKED — evidence packs and current contract metadata read-back are not yet complete.**
This document describes an additive staging contour. It does not promote the family,
change production UI, resolve Penpot comments, or rewrite historical receipts.

> Semantic supersession (2026-08-22): the chip inventory below is exact Golden
> Corpus build evidence, not a complete production vocabulary. Admission
> `Условия уточняются` is retained here only as observed historical fixture
> output; the owner-corrected candidate resolves unknown admission to honest
> absence and forbids that display literal. See
> [EventCard Large semantic content contract v1](event-card-large-semantic-content-contract-v1.md).

## One active seven-case registry

`catalog/ui-components/event-card-large/current-v2/active-registry.json` is the only
active current-v2 batch index:

- desktop 1280 / used card width 380: 7906, 8156, 6628, 4327;
- mobile 390: 7906, 8156, 4327.

Legacy 474 px cases remain historical and are excluded from the active registry.
PR pairs design #40 / events #546 and old review boards are superseded contours, not
owner-review targets. Owner comments route to the staging v2 master/archetype.
External GitHub PR state still has to be updated outside this repository.

Every current row uses the same literal contract hash and canonical `case_id` across
the case, additive resolved-case binding, final blocked receipt, Penpot cache tuple,
and Telegram publication binding. Git SHAs are immutable. Actual Astro source and
conformance tooling are separate provenance fields.

## Chip audit is based on an Astro build

Primary evidence is the events repository build report
`tests/fixtures/ui-conformance/event-card-large-chip-inventory.v1.json`
(SHA-256 `74ec329cba6b1885ba36e56f74a2eb50536243f489da60f3155a112d115b2446`),
built from Astro source `22ebe3c5e92b13684cca32c14357ef7b91834977`. Resolver source hashes are
supplementary, not substituted for rendered output.

Golden Corpus v1 actually renders:

- event types: `концерт`, `выставка`, `лекция`;
- admission: `1500 ₽`, `1000 ₽`, `Бесплатно · вход свободный`, `Билеты`,
  `Бесплатно · регистрация`, `Условия уточняются`, `Запись по телефону`;
- eight exact occurrence labels;
- like and share states with absent or positive counts;
- calendar present and absent;
- fixed actions `Не интересно`, `Поделиться`, `В календарь` when eligible.

Admission generator families also include sold-out, free booking, donation, phone,
ticket, free, price, arbitrary and unspecified. These are behavioral/content states,
not a component per literal. Event type and admission are linked Penpot masters with
text overrides. Occurrence is currently only a raw content slot: `event.meta.occurrence`
is a **semantic target missing materialization**, not a claimed existing component.

The current Penpot boards do not yet show every corpus specimen. Missing review
specimens include `лекция`, `1500 ₽`, `Бесплатно · регистрация`,
`Условия уточняются`, and positive share count `5`. The catalog records those as gaps
rather than reporting false coverage.

## Evidence and CI

The existing reusable `.github/workflows/ui-three-way-conformance.yml` now accepts
only immutable `design_sha`, `events_tooling_sha`, and `astro_sha`, plus `batch`,
`publish_telegram`, and `trusted_source`. `batch=event-card-large-current-v2` selects
all seven cases. Empty changed scope reports explicit `NOT_APPLICABLE`, never a
conformance PASS.

Selected cases invoke the events runtime for materialization, browser capture,
identity/structural/raster checks, agent review, and final receipts. Penpot reuse is
hash-bound to file/page/shape/revision/contract/resolved-case; missing cache/export or
review fails closed. No workflow performs a blind live Penpot export.

Telegram is not republished by this additive layer. A future message must be a
superseding message with changed image/verdict content hash and verified read-back.

Mobile historical PNG hashes remain preserved, but their exact numeric export revision
is unavailable. Mobile `revision` is therefore `null`,
`export_revision_status=unknown_historical_verified_hash`, and the cases remain
BLOCKED. The independent structural/metadata read-back revision 1408 is stored
separately and is never misrepresented as the export revision.
