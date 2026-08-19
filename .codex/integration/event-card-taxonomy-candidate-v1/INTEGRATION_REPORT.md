# Event-card candidate integration report — bounded native materialization

## Material result

- Exact source baseline: `events-bot-new@a68c7f23c4e014c6e9f66e95f394656e9cb0f411`.
- Git SoT taxonomy: five families / **65** exact representative state keys.
- Penpot: **65/65** source-native variants; exact set equality, no extra or
  duplicate state keys. `event.card` is split 12/11 across two lightweight
  pages to avoid the earlier memory failure.
- Parent surfaces own removal/undo and loading skeletons; those states are not
  misrepresented as visible card variants.
- Page25: **24** semantic source-bound icon components. Final family scans find
  zero visible named card-icon paths outside linked icon instances.
- Page48: **42 unique medallion visuals / 43 registry bindings**, plus six native source-geometry medallion-frame variants.
- Page49: eight Amber runtime states, four native collection-surface states, 12 separate Focus lab definitions and
  seven reference-only thumbnails. The rail Amber-tail variant contains the
  real linked Amber component.
- Screenshot census remains **S01–S08 / 23 of 23 items**, as visual-oracle
  bindings rather than raster card content.
- Page15 and Page45 were replaced by compact functional boards; Page45 owner
  threads 11–13 are resolved. Page40 and Page46 are lightweight indices.

## Readback and validation

- Penpot file validation: zero errors.
- Stable state readback: 65 expected / 65 actual; zero missing, extra or
  duplicates; zero variant errors.
- Per-family page budgets remain below 900 shapes. Index pages are 142 and 35
  shapes respectively.
- Second-run reconciliation is read-only and creates zero objects.
- Taxonomy, asset, iconography and negative validators pass with Penpot-bound
  receipts at file revision 455.

## Acceptance status

The implementation is materially complete but deliberately remains
**NOT READY** in Page46 and Git visual acceptance. Independent visual closure
has not yet passed, so no canonical promotion or review-ready claim is made.
