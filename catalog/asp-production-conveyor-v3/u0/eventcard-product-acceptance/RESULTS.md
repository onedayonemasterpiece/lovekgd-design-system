# U0 EventCard three-repair product acceptance

## State

`U0_EVENTCARD_THREE_REPAIRS_REMOTE_READY`

Observed: `2026-09-01T19:35:42Z`. Durable marker `THREE_EVENTCARD_REPAIRS_REMOTE_READY`
already existed at issue comment `5497775838`; U0 created no duplicate repair lane.

## Frozen packages reviewed

| Package | Head | Tree | U0 verdict |
|---|---|---|---|
| `MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR` | `d4ef6db8a4e1583308556b384d95f45e61223872` | `c2e1b18d170cdccc580262c77fe7524c10f50df9` | QA/INTEGRATE gated PASS with execution-semantics addendum |
| `MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1` | `c0174621635e3c4336f4b88674c3b47fa7d7acb2` | `81d9753b305c5d1dea67c4ca27f1efb99e09ebc5` | QA/INTEGRATE gated PASS only after exact read-only target projection |
| `MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-REPAIR-R1` | `757652ed656f32569d5ade7dd75f5cd58cf9df96` | `2ffd893a8eba54156818b55fa5f63f88afbcc4c0` | QA/INTEGRATE gated PASS only after exact 18-component projection |

Each remote branch is exactly one commit ahead of the shared queue base
`c25b62aa743341f96472223c09a9dd4d43cadc65`; changed paths are respectively
13, 8 and 8, with no overlap.

## Product verdict

The three packages are valid bounded repair inputs, not a whole-EventCard visual
PASS. Text R11C intentionally changes only four compatible occurrence nodes and
leaves sixteen exact text offenders protected. Media and native paths still
require live read-only target binding and later V0 evidence.

The corrected addenda are mandatory for D0/QA and D0/INTEGRATE. They do not
modify or supersede the frozen package heads.

## Boundaries

- Penpot reads by U0: `0`
- Penpot mutations by U0: `0`
- Atlas mutations: `0`
- New card families: `0`
- Broad shared-UI wave: `0`
- Kaggle calls: `0`
- Next owner: `D0_QA_INTEGRATE`
