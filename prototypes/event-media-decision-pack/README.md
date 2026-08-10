# Event Media owner decision pack

This is a deterministic, standalone, evidence-only comparison pack for the
three pending Event Media owner decisions. Open `index.html` with JavaScript
enabled; it loads only vendored local assets and is understandable without any
catalog JSON.

## Status and limits

- `PENDING_OWNER_DECISION`
- `NOT_MERGED`
- evidence-only and non-production
- no option is selected or accepted
- no implemented variant is depicted
- no production UI, Penpot, token, contract acceptance, migration, physical
  merge/split, experiment or promotion is authorized
- Product Value remains `observe` / `pending_product_model` / false

All nine options use the identical ordered 13-fixture contract at the exact
desktop and mobile viewport identities. Only the decision annotation differs.
The 4:5 file is a deterministic Sharp derivative; the 2:3 example is a contain
container around the unchanged 3:2 source. Unknown-text is a metadata state,
not a claim inferred from rendered pixels.

## Provenance and rights

- `fixture-provenance.jsonl` binds every vendored/derived asset to byte and
  decoded-pixel SHA-256, dimensions and pinned source provenance.
- `behavioral-evidence-provenance.jsonl` binds the state/placement treatments
  to the already reviewed Behavioral Decoder v1.1 capture; its PNGs are not
  redistributed into this pack.
- usage is existing owner-controlled internal evidence only;
- no redistribution right or license result is claimed;
- no production-state equivalence is claimed.

## Deterministic build, validation and render

```bash
python3 prototypes/event-media-decision-pack/scripts/build-index.py
python3 prototypes/event-media-decision-pack/scripts/validate.py
node prototypes/event-media-decision-pack/scripts/render.mjs \
  --output-dir /tmp/a-new-empty-directory
```

The renderer pins a 1920×1080 CSS viewport, DPR 1, `en-US`, UTC, light color
scheme, reduced motion, central Playwright/browser infrastructure and a strict
local-file/data-only request gate. It refuses to clear or overwrite a non-empty
output directory.
