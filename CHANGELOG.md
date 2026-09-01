# Changelog

## [Unreleased]

### Added

- Added independent package-local Atlas R2 WIDE native executors, frozen tuples,
  receipts, and two-run tests for the typography type-scale and layout-rules
  small pages.

### Fixed

- Grouped Type Scale's editable Cyrillic wrapping specimens under the existing
  exact-font native family to honor the Atlas R2 three-family hard limit, with
  a fail-closed runtime census and pre-mutation negative test.
- Replaced the typography backlog's metadata-only readiness with strict
  string-only plugin data, exact font-byte preflight, linked
  `ATLAS_PAGE_HEADER_V2`, non-empty native specimens, idempotent replay, and
  protected-projection gates without reading or mutating Penpot.
