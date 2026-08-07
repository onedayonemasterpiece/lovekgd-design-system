# Penpot review-plugin prototype 002B — current mirror load

## Product goal

This prototype replaces the append-only revision row from 002A with a Git-backed **current mirror**:

```text
exact Git catalog
→ preload and validate every artifact
→ stage all new/replacement boards off-canvas
→ make the current mirror match one catalog SHA
→ preserve only commented old boards in the review lane
→ remove unreviewed obsolete boards
```

Penpot remains a read-only visual projection plus native comments. Git is the canonical source. The plugin performs no GitHub, Supabase, bot or product-database writes.

## Implemented runtime

The installed plugin now provides:

- one current board per `elementId`;
- `CURRENT`, `STALE` and `SYNC FAILED` states;
- actions `create`, `replace`, `archive-replace`, `move`, `metadata`, `remove`, `archive-remove`, `noop`;
- full artifact validation before Penpot mutation;
- off-canvas staging for all create/replace boards;
- visible mirror verification before obsolete unreviewed boards are deleted;
- best-effort rollback of staged and moved boards if staging or commit fails;
- native Penpot comment preservation by moving the **same old board** to the review lane;
- deterministic comment-to-prompt generation;
- load, inspect, stage and commit timings.

## Load corpus A

The first live catalog contains **57 reviewable boards**:

- 36 exact inline SVG transport fixtures generated from Git-tracked source;
- 11 immutable SVG assets from `events-bot-new` at commit `c6a679dbbb3bbd65eb096becbd5976e7ccd67a26`;
- 10 real product raster assets (WebP/PNG) from the same commit.

The transport fixtures are explicitly marked `NOT APPROVED DESIGN`. They exercise states and layout without pretending to be the decoded final design system. Brand marks, icons, festival graphics, listing images and event fallbacks are actual repository assets.

Wave A is stored as `catalog/catalog.json.gz.b64`. The plugin UI resolves the current `penpot-mirror-live` SHA, then reads this file by immutable commit URL.

## Current-mirror rules

| Situation | Action |
|---|---|
| Hash and slot match | `noop` |
| Same visual artifact, new slot | move the current board |
| Metadata changed only | update metadata |
| Changed element with no comments | replace current board |
| Changed element with comments | move old board to review lane; put new board in the current slot |
| Removed element with no comments | remove current board |
| Removed element with comments | preserve it in review lane |
| Duplicate current board IDs | stop; do not guess |
| Any asset fails validation | stop before Penpot mutation |
| Any staging board fails | remove staging; restore moved boards |

The main canvas contains only one current board per element. Historical technical revisions are not appended.

## Staging and rollback

1. The UI resolves the current `penpot-mirror-live` commit SHA through the read-only GitHub REST API.
2. It fetches the compressed catalog by immutable SHA and decompresses it in the plugin UI.
3. It validates inline SVGs with SHA-256.
4. It validates external SVG/images against their exact Git blob SHA.
5. It passes already verified payloads to the Penpot plugin context.
6. The plugin builds all create/replace boards at an off-canvas staging origin.
7. Only after every staged board exists does it switch the visible mirror.
8. Old unreviewed boards first move to an off-canvas trash lane; cleanup runs only after the current mirror passes count/hash/slot verification.
9. Commented boards retain their identity and native comment threads and move to the review lane.

## Performance evidence emitted by the plugin

- total catalog load time;
- artifact validation time;
- plan/inspection time;
- staging time;
- commit time;
- loaded bytes;
- counts of inline SVG, external SVG and images;
- create/replace/archive/move/remove/noop counts;
- `CURRENT`, `STALE` or `SYNC FAILED`.

## Prepared Wave B

Wave B is generated deterministically by:

```bash
WAVE=B node scripts/generate-catalog.mjs
```

To keep each Git text blob small and independently verifiable, its compressed Base64 payload is stored as four ordered parts:

```text
catalog/wave-b/000.b64
catalog/wave-b/001.b64
catalog/wave-b/002.b64
catalog/wave-b/003.b64
```

Their exact Git blob SHAs are pinned in `scripts/validate-compressed.mjs`. Concatenation reproduces one valid gzip/Base64 stream.

Validated Wave B delta:

- 57 boards total;
- 38 inline SVG fixtures, 10 real SVG assets, 9 real images;
- 3 removed IDs;
- 3 added IDs;
- 44 changed visual artifacts;
- 53 moved slots.

Wave B is intentionally not live until Wave A has passed in the owner’s Penpot file. Publishing it later tests replace, archive, remove, create and substantial reflow **without reinstalling the plugin**.

## Reproducibility evidence

Local deterministic validation completed successfully:

```text
Wave A: 57 = 36 inline SVG + 11 Git SVG + 10 images
Wave B: 57 = 38 inline SVG + 10 Git SVG + 9 images
Removed: 3
Added: 3
Changed: 44
Moved: 53
Wave B concatenated blob: c23b0080149c622456f545d41b461a8e77ce3d68
Generator reproducibility: PASS
Catalog contract: PASS
```

The four remote Wave B part blob SHAs also match the locally generated parts exactly.

## Manual acceptance A

1. Install the immutable 002B plugin manifest.
2. Open a clean Penpot page or file.
3. Let the automatic read-only check finish.
4. Verify `STALE` and exactly 57 creates.
5. Verify artifact counts: `36 inline SVG`, `11 Git SVG`, `10 images`.
6. Run **Synchronize current mirror**.
7. Verify 57 current boards, real SVGs and real images, with no append-only revision row.
8. Recheck and verify `CURRENT`, all 57 actions `noop`.
9. Assess load time, pan/zoom and image/SVG fidelity.
10. Put a native comment on `load.fixture.button.default` for Wave B.

Prototype 002B is not accepted until the manual Penpot load and Wave B transition are both observed.
