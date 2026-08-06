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

Penpot remains a read-only visual projection plus native comments. Git is the canonical source. The plugin performs no GitHub or Supabase writes.

## Load corpus A

The first live catalog contains **57 reviewable boards**:

- 36 exact inline SVG transport fixtures generated from Git-tracked source;
- 11 immutable SVG assets from `events-bot-new` at commit `c6a679dbbb3bbd65eb096becbd5976e7ccd67a26`;
- 10 real product raster assets (WebP/PNG) from the same commit.

The transport fixtures are explicitly marked `NOT APPROVED DESIGN`. They exercise states and layout without pretending to be the decoded final design system. Brand marks, icons, festival graphics, listing images and event fallbacks are actual repository assets.

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
2. It fetches the catalog by immutable SHA.
3. It validates inline SVGs with SHA-256.
4. It validates external SVG/images against their exact Git blob SHA.
5. It passes already verified payloads to the Penpot plugin context.
6. The plugin builds all create/replace boards at an off-canvas staging origin.
7. Only after every staged board exists does it switch the visible mirror.
8. Old unreviewed boards first move to an off-canvas trash lane; cleanup runs after the visible mirror is valid.
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

`WAVE=B node scripts/generate-catalog.mjs` prepares a significant follow-up catalog, but it is intentionally not live yet. It contains:

- at least 10 changed visual artifacts;
- at least 20 moved slots;
- 3 removed elements;
- 3 added elements.

After the first load passes, one current board should receive a native Penpot comment. Publishing Wave B then tests replace, archive, remove, create and large reflow without reinstalling the plugin.

## Manual acceptance A

1. Install the immutable 002B plugin manifest.
2. Open a clean Penpot page or file.
3. Let the automatic read-only check finish.
4. Verify `STALE` and a plan of roughly 57 creates.
5. Run **Synchronize current mirror**.
6. Verify 57 current boards, real SVGs and real images.
7. Recheck and verify `CURRENT`, all actions `noop`.
8. Assess load time, pan/zoom and image/SVG fidelity.
9. Put a native comment on `load.fixture.button.default` for Wave B.

Prototype 002B is not accepted until the manual Penpot load and Wave B transition are both observed.
