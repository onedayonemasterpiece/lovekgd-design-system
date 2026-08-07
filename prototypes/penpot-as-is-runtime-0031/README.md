# Prototype 003.1 — detailed diagnostics and transport-safe media

This revision keeps the Prototype 003 exact-runtime contract and addresses the first real Penpot synchronization failure (`staging_failed:http error`).

## What changed

- the exact Git screenshot is still downloaded and SHA-256 verified before any transformation;
- images that are unusually tall, visually downscaled on the Penpot board, or larger than the conservative transport budget are converted in the plugin UI to a bounded WebP derivative;
- source SHA, source dimensions and source byte length remain canonical metadata;
- transport SHA, dimensions, MIME type and transformation reason are stored separately on the Penpot board;
- each upload is sequential, paced and retried at most three times;
- failures produce a structured diagnostic with incident ID, phase, element ID, page, artifact path, source and transport dimensions/bytes, attempt number, Penpot version and all readable error properties;
- the full diagnostic can be copied from the plugin UI;
- failed staging boards are removed, existing current boards are unchanged, and named pages can be reused on the next attempt.

## Why a derivative is allowed

The Penpot file is a review projection, not the canonical asset store. The canonical artifact remains the exact Playwright screenshot committed in Git. The transport derivative only makes the verified screenshot safe to upload and display in Penpot; it is never treated as a new design or a replacement source of truth.

## Catalog source

The plugin reads the existing live catalog at:

```text
penpot-as-is-live/prototypes/penpot-as-is-runtime-003/catalog/catalog.json
```

No synthetic load fixture is added to the managed pages.
