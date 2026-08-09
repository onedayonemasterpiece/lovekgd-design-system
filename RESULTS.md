# Behavioral Decoder v1.1 design-repository import

## Imported evidence

- Imported the reviewed behavioral v1.1 compact supplement as a sibling of immutable Decoder v1.
- Added a fail-closed behavioral supplement validator and a separate GitHub Actions workflow.
- Kept the existing v1 validator unchanged and pinned the immutable v1 Git tree to
  `e77fc2457fadfdffb46ed2d90304ebb91e89a715` in the new workflow.
- Updated catalog/navigation/source-first documentation and the R-07 living adoption ledger with exact provenance.
- Corrected the reviewed v1 raster count from 155 to 157.
- Did not edit R-01…R-06 and did not rewrite immutable Decoder v1.

## Receipt

- Imported supplement commit: `7da6cfb18763e34a81b4890249e490e0945e9a07`.
- Imported supplement tree: `b558869473397a51d03e4f87220e6a1889a088ea`.
- Manifest SHA-256: `c6c62cee8bea4e9440ff85bc75c46bc85cf5abf3e2fdcd4c7357c6ece916436f`.
- Actions run: `31318132051`; artifact `9039433060`; archive SHA-256
  `c677f69572ccdbf5b7f1402037a3cb8c164bd2f503fae35eae9168c46eb8d909`.
- Full-resolution visual review: 124/124; ledger SHA-256
  `97c8cbcf2e4bbc34fd7e8c03454f09219bfb723acd4751b89744d6a8eb0f7731`.
- Independent audit: `PASS` for truthful evidence import.
- Final status: `EVIDENCE_COLLECTION_INCOMPLETE` because exactly two readiness blockers remain.

Both validators and the immutable v1 tree assertion pass. The result is durable evidence, not
permission to normalize, consolidate components, choose a CTA/transport winner or mutate Penpot.
