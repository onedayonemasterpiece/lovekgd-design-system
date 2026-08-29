# Golden Event Corpus v2 — asset immutability report

The eight fixtures reference 16 exact image byte streams.

- Assets whose `/p/image/v2/<sha256>.webp` path key equals the downloaded byte
  hash remain URL-backed and require a pre-render hash check.
- Six `/p/dh16/` responses are not safely represented by their URL key and are
  therefore stored as exact content-addressed bundles: the primary image for
  `event.real.2182`, all four images for `event.real.6711`, and the primary
  image for `event.real.6942`.
- `assets-manifest.json` records URL, dimensions, MIME type, byte length, byte
  hash, storage mode and optional bundle path for every asset.
- A changed response is `BLOCKED_ASSET_MISMATCH`, never an implicit visual
  update.
