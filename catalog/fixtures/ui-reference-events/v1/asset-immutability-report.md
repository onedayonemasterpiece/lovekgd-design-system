# Golden Event Corpus v1 — asset immutability report

The eight fixtures reference 16 exact image byte streams (1,894,810 bytes at
extraction time).

- 13 assets use `/p/image/v2/<sha256>.webp`. For every one, the downloaded byte
  SHA-256 equals the 64-hex path key. They remain URL-backed with a mandatory
  pre-render byte verification. A changed response yields
  `BLOCKED_ASSET_MISMATCH`.
- 3 legacy `/p/dh16/` assets belonging to `event.real.4327` are not
  content-addressed: their byte hashes differ from the path keys. Their exact
  bytes are stored in the small versioned content-addressed bundle under
  `assets/<byte-sha256>.webp` (175,312 bytes total).
- No organizer-origin URL is used by a comparison case. Once materialized,
  comparison relies only on verified immutable CDN objects or the committed
  fixture bundle.
- `assets-manifest.json` records source/resolved URL, MIME type, dimensions,
  byte length, byte hash, storage mode, and local/bundle reference for every
  asset.

This report does not assert that `Cache-Control` alone is enough. The byte hash
is the gate.
