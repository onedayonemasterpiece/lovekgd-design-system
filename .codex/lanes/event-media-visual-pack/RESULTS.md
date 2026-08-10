# Lane event-media-visual-pack Results

## Status

- **R06 — Done:** deterministic standalone HTML decision pack, exactly one
  comparable PNG board for each of the three exact L2 decision cards, exact
  fixture/capture provenance, and one full-resolution review row for every new
  PNG beneath the prototype.
- Branch: `agent/event-media-blocker-closure-v1/visual-pack`
- Lane base: `95f6c329605f9d8fa1600bcc1fd566e1c6736fde`
- Pinned read-only events authority:
  `onedayonemasterpiece/events-bot-new@66bc0d43e36299417626f992021cfb7299ddf704`
- Reviewed Behavioral authority:
  `current-ui-behavioral-decoder-v1-1-capture-31318132051/capture/behavior-rasters`

Only the assigned L3 scopes were changed:

- `prototypes/event-media-decision-pack/**`;
- `catalog/normalization/event-media/decision-visual-review-ledger.jsonl`;
- this result file.

No L1/L2 artifact, production UI, `site/src`, `site/public`, Penpot, token,
contract, readiness, experiment, migration or physical boundary was changed.

## Delivered

### Standalone pack

`prototypes/event-media-decision-pack/index.html` embeds the exact three L2
cards and their exact nine options. It needs no catalog JSON at runtime and
loads local files only. Every board contains:

- the exact owner question, scoped prompt, blocker and closure condition;
- a clear boundary diagram;
- all three pending option IDs, consequences, migration impact and
  reversibility;
- the L2 recommendation labelled **not acceptance**;
- one desktop and one mobile mini-frame for every option;
- one shared 13-fixture atlas understandable without JSON;
- prominent `EVIDENCE ONLY`, `NON-PRODUCTION`, `PENDING_OWNER_DECISION` and
  `NOT_MERGED` labels;
- the exact owner receipt required and preserved guardrails.

The comparison does not fabricate implemented variants. All nine options bind
the identical ordered 13-fixture/state/crop/viewport contract; only decision
annotation differs. Fixture-set SHA-256:
`7e3639bd6a7b5a1cf9a3c611455a766798f485cc918606435dae16ef85ee9dc7`.

Coverage is explicit and honest for photography, portrait poster,
meaningful artwork/OCR, unknown-text metadata state, 4:5, 5:4, 3:2, a 2:3
contain container, 1:1, intrinsic ratio, cover/contain, focal/safe area,
primary/previews/poster companion, missing/broken/tiny/skeleton and both
viewports. The 4:5 asset is a deterministic derived crop. The 2:3 frame
contains the unchanged 3:2 source. Unknown-text is a metadata fail-closed
state and does not claim semantics from pixels.

### Pinned fixtures and Behavioral evidence

- 9 vendored/derived local files, 1.1 MiB total;
- every file has raw SHA-256, decoded RGB pixel SHA-256, dimensions, exact
  pinned source ref/commit and honest rights fields in
  `fixture-provenance.jsonl`;
- three exact pinned remote asset URLs were materialized without search and
  matched the pinned event record's decoded-pixel SHA/dimensions;
- pinned Git blobs matched their exact source SHA/dimensions;
- the 4:5 derivative is bound to
  `sharp@0.34.5/libvips@8.17.3/webp@1.6.0`, centre cover, 800×1000, quality 90;
- 9 exact rows in `behavioral-evidence-provenance.jsonl` bind loaded 4:5/5:4,
  primary/previews, missing, broken loading/error, tiny and skeleton→loaded
  state/placement evidence to the already reviewed Behavioral capture. Those
  Behavioral PNGs were not copied into this prototype.

Rights remain existing owner-controlled internal evidence only.
`redistribution_rights_claimed=false` and
`license_research_performed=false`; no production equivalence is claimed.

## Deterministic renderer

- central Playwright: **1.58.2**;
- central browser: **Chromium 145.0.7632.6**;
- viewport: 1920×1080 CSS px;
- DPR: 1;
- locale: `en-US`;
- timezone: `UTC`;
- light color scheme and reduced motion;
- fixed `Date.now`, `Math.random` and animation-frame behavior;
- local `file:` / `data:` resources only, with network requests fail-closed;
- all images decoded before capture;
- renderer refuses to clear or overwrite a non-empty directory.

Two final renders to separate temp directories were byte-identical to each
other and to the committed screenshots:

| Board | Dimensions | Bytes | SHA-256 |
|---|---:|---:|---|
| `decision.EM-CENSUS-001.png` | 1920×2971 | 1,459,695 | `66be16cb2be1ef1df74073628b67da9ddac5dc7accdb5369060fe65c2904cbee` |
| `decision.EM-GOV-010.png` | 1920×2928 | 1,435,499 | `e037eecc2f91b6117a0b1d9e855c03e4c2581103ae095fefa625a0260bc47c69` |
| `decision.EM-LABRAIL-011.png` | 1920×2948 | 1,449,764 | `dbb35d368be33188bf8d827dfb824d11efb8f73d1245101d581ec8b9b815b08b` |

Final proof output: `BYTE_IDENTICAL_AND_COMMITTED_MATCH=PASS`; both runs
observed 10 local requests, 0 network requests, 9 option regions, and exactly
one desktop plus one mobile frame per option.

## Full-resolution visual review

Every new PNG beneath `prototypes/event-media-decision-pack/` was personally
opened with `view_image(detail="original")`:

1. `prototypes/event-media-decision-pack/fixtures/poster-ocr-square-1x1-contain.png`;
2. `prototypes/event-media-decision-pack/screenshots/decision.EM-CENSUS-001.png`;
3. `prototypes/event-media-decision-pack/screenshots/decision.EM-GOV-010.png`;
4. `prototypes/event-media-decision-pack/screenshots/decision.EM-LABRAIL-011.png`.

The first board review found a clipped diagonal status ribbon. It was corrected
to a fully contained status badge, the HTML was rebuilt, and all three boards
were rendered and reviewed again. Final conclusions:

- exact questions, option IDs, consequences and owner-receipt prompts are
  readable;
- no board heading, body copy, mini-frame, atlas item, status badge or footer
  is clipped;
- fixture images decode without damage and contain/cover/focal/safe-area
  treatments remain visually distinct;
- every three-option comparison visibly repeats the same desktop/mobile
  fixture matrix;
- evidence-only, non-production, pending, `NOT_MERGED` and
  recommendation-not-acceptance status are unambiguous;
- the intrinsic 512×512 PNG preserves the complete artwork and
  `БАХОСЛУЖЕНИЕ` wordmark without clipping.

The canonical ledger has exactly 4 rows, one per PNG, with path, byte SHA,
bytes, dimensions, exact decision/option/fixture/viewport context, reviewer,
`review_status=reviewed-full-resolution`,
`full_resolution_opened=true`, substantive conclusion and
`decision=NOT_MERGED`.

## Exact commands and validation

```text
git -C /home/dev/.codex/worktrees/events-bot-new/action-map-design-pinned-events rev-parse HEAD
git -C /home/dev/.codex/worktrees/events-bot-new/action-map-design-pinned-events status --porcelain

curl --fail --silent --show-error --location --proto '=https' --tlsv1.2 \
  <each exact src_from_pinned_record URL> --output <isolated temp path>
python3 <one-off pinned-record raw/pixel-SHA/dimension verifier>
node <one-off exact Sharp 0.34.5 800x1000 centre-cover quality-90 derivation>

python3 prototypes/event-media-decision-pack/scripts/build-index.py
node prototypes/event-media-decision-pack/scripts/render.mjs \
  --output-dir /tmp/emv-proof-a.wZT5kB/output
node prototypes/event-media-decision-pack/scripts/render.mjs \
  --output-dir /tmp/emv-proof-b.KTbAU4/output
python3 <A/B/committed byte-identity verifier> \
  /tmp/emv-proof-a.wZT5kB/output \
  /tmp/emv-proof-b.KTbAU4/output \
  prototypes/event-media-decision-pack/screenshots

view_image(path=<each of the four paths listed above>, detail="original")

python3 prototypes/event-media-decision-pack/scripts/validate.py
python3 -m py_compile \
  prototypes/event-media-decision-pack/scripts/build-index.py \
  prototypes/event-media-decision-pack/scripts/validate.py
node --check prototypes/event-media-decision-pack/scripts/render.mjs
git diff --check
```

Strict prototype validation: **PASS** — cards=3, options=9, fixtures=13,
materialized assets=9, Behavioral bindings=9, boards=3, prototype PNGs=4,
review rows=4, exact viewports=2, exact events commit pinned, source checkout
clean, canonical JSONL/index rebuild, local-only renderer contract and writable
scope all verified.

Key catalog/proof hashes:

- `index.html`: `2c1cc31f8fac2b500360c95d0302bc58755529773d5de254a18c3267af65a7af`;
- `fixture-provenance.jsonl`: `36803b515ec39e7ea5aac60336a21f3892b88cdf47b8e222124475e796bb84f6`;
- `behavioral-evidence-provenance.jsonl`: `550e2a3a6afec931e393f5dc76b067b0270d10e49fca335b58b9af69b55cce5a`;
- `decision-visual-review-ledger.jsonl`: `e99fd95473902c516caad966cdc9bcf6421de790ea4b0f411e0e33facadd830c`.

## Risks and honest limits

- No owner option is selected; recommendations remain advisory only.
- The boards compare evidence and decision consequences, not production-ready
  component variants.
- Existing internal-evidence usage does not establish redistribution rights or
  complete license research.
- Behavioral bindings preserve reviewed state/placement evidence; the pack's
  controlled state drawings are not pixel copies and do not claim production
  equivalence.
- Cross-host byte identity requires the same central Playwright, Chromium and
  font environment; this lane proves exact reproducibility on the pinned host
  environment and records its versions.
- Product Value remains `observe` / `pending_product_model` /
  `promotion_ready=false`.

## L5 handoff

L5 should fail closed if integration changes:

- any L2 decision/question/option/fixture order or substitutes bytes/state/
  crop/viewport between options;
- the exact 3-board target set or 4-row all-PNG review binding;
- a board/fixture/provenance SHA without regenerating, full-resolution review
  and exact ledger rebinding;
- pending/unselected/`NOT_MERGED`/non-production status;
- rights, Product Value or no-implementation guardrails.

L5 should include the HTML, all vendored assets, all three PNG boards, both
prototype provenance JSONLs, the review ledger, scripts and this lane result in
the final output-set/receipt validator and Actions path contract. This lane does
not authorize contract acceptance, implementation or owner decision.
