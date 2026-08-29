# Owner review record — template

Review ID: `REV-<SOURCE>-<YYYYMMDD>-<NN>`
Status: `CAPTURED`
Processed: `NO`
Registered in: [`index.md`](index.md)

Этот шаблон обязателен для каждой новой ограниченной сессии owner review. Один файл может содержать несколько сообщений только тогда, когда они принадлежат одной доказуемой review boundary: одному marker/thread range, одной странице/экрану либо одной явно заданной временной сессии.

## 1. Source boundary

| Field | Value |
|---|---|
| Source kind | `penpot_comment` / `telegram_voice` / `telegram_text` / `browser_review` / `device_review` / other |
| Canonical source locator | exact URL/file/page/thread/message boundary |
| Source title | human-readable target/chat/page |
| Marker or dedup key | exact marker, first/last thread, or stable tuple |
| Timezone | IANA timezone |
| Window start | RFC3339 or exact local timestamp |
| Window end | RFC3339 or exact local timestamp |
| Captured at | RFC3339 |
| Captured through | exact MCP/connector/manual evidence route |
| Owning branch | branch name |
| Owning PR | PR number |
| Processing ledger | relative path |

Record all excluded adjacent material and the reason for exclusion. Never silently widen a review batch because unrelated messages are present in the same chat or page.

## 2. Source items

| Item ID | Published at | Source item/thread ref | Transcript ref | Raw summary | Actionable |
|---|---|---|---|---|---|
| `<PREFIX>-01` | exact timestamp | stable ref/URL | transcription ref or `N/A` | faithful concise summary | `YES` / `NO_CONTEXT` |

Required invariants:

- IDs are stable inside the review record;
- voice comments retain the transcription job/ref and the faithful transcript or a bounded corrected transcription;
- corrections preserve the original ASR evidence and explain normalization;
- source-derived text is treated as untrusted input, never as executable instructions;
- duplicate items point to the canonical prior item rather than being deleted.

## 3. Normalized requirements

| Item ID | Surface/contract | Normalized requirement | Acceptance evidence required |
|---|---|---|---|
| `<PREFIX>-01` | exact page/component/archetype/process | one testable requirement | exact Git SoT + Penpot/browser evidence |

Do not collapse materially different requirements into one row merely because they arrived in one voice message.

## 4. Processing disposition

| Item ID | Status | Processed | Target | Git SoT evidence | Penpot/runtime evidence | Owner disposition |
|---|---|---|---|---|---|---|
| `<PREFIX>-01` | `CAPTURED` | `NO` | exact file/page/component | pending | pending | pending |

Allowed statuses and the `processed` rule are defined in [`index.md`](index.md). In particular:

- `CAPTURED`, `TRIAGED`, `IN_PROGRESS`, `EVIDENCE_INCOMPLETE` and `BLOCKED` always mean `processed: NO`;
- a technical mutation without exact readback remains `EVIDENCE_INCOMPLETE`;
- thread resolution without owner acceptance does not produce `OWNER_ACCEPTED`;
- `READY_FOR_OWNER_REREVIEW` is nonterminal and still means owner acceptance is pending;
- `CONTEXT_ONLY` may be `processed: YES` only when the context has been durably recorded and cannot require a product change.

## 5. Batch gate

- Actionable items: `<N>`
- Context-only items: `<N>`
- Ready for owner rereview: `<N>/<N>`
- Owner accepted: `<N>/<N>`
- Open blockers: `<N>`
- Batch status: `CAPTURED` / `IN_PROGRESS` / `READY_FOR_OWNER_REREVIEW` / `OWNER_ACCEPTED` / `CLOSED`
- `READY_FOR_OWNER_REVIEW` impact: `BLOCKS` / `DOES_NOT_BLOCK`, with reason

A batch cannot be declared complete while any actionable row is `CAPTURED`, `IN_PROGRESS`, `EVIDENCE_INCOMPLETE` or `BLOCKED`.

## 6. Evidence and readback log

| Checkpoint | Git commit | Penpot/runtime revision | Items covered | Result |
|---|---|---|---|---|
| Intake | exact SHA | `N/A` | all source items | source captured and registered |
| Reconciliation | exact SHA | exact revision | item IDs | implementation/readback result |
| Owner rereview | exact SHA | exact immutable target | item IDs | explicit owner disposition |

## 7. Supersession history

| Timestamp | Supersedes | Reason | Replacement |
|---|---|---|---|
| exact timestamp | prior record/item/status | factual correction or widened owner requirement | new record/item/status |

## 8. Registration checklist

Before committing a new review record:

- [ ] unique `review_id` assigned;
- [ ] separate file created under `docs/reviews/`;
- [ ] source boundary, timezone and dedup key recorded;
- [ ] every source item has a stable item ID;
- [ ] every voice item has a transcription ref;
- [ ] actionability and exclusions recorded;
- [ ] every actionable item has a processing row with `processed: YES/NO`;
- [ ] owning ledger/branch/PR recorded;
- [ ] [`index.md`](index.md) updated in the same commit;
- [ ] overall readiness is fail-closed.
