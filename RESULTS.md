# Behavioral Decoder v1.1 design-repository scaffold

## Scope completed

- Reserved the behavioral v1.1 compact import as a sibling of immutable Decoder v1.
- Added a fail-closed behavioral supplement validator and a separate GitHub Actions workflow.
- Kept the existing v1 validator unchanged and pinned the immutable v1 Git tree to
  `e77fc2457fadfdffb46ed2d90304ebb91e89a715` in the new workflow.
- Updated catalog/navigation/source-first documentation and the R-07 living adoption ledger.
- Corrected the reviewed v1 raster count from 155 to 157.
- Did not edit R-01…R-06 and did not import incomplete behavioral evidence.

## Integration placeholders still required

The final integration must import the reviewed compact supplement and replace the pending R-07
receipt fields with evidence-backed values for:

1. exact source/integration commit and imported design-repository commit/tree;
2. successful GitHub Actions run URL, run ID and attempt;
3. Actions artifact ID, URL, digest, bytes, creation and expiry timestamps;
4. durable GitHub Release tag, asset ID/name/URL, SHA-256 and bytes;
5. validator-confirmed packet, executable, blocker, observation, raster and review totals;
6. file-level full-resolution visual-review coverage and ledger digest;
7. independent reviewer, audited commit, report SHA-256 and `PASS`;
8. secret-scan `PASS` and final `READY_FOR_PROJECT_NORMALIZATION_SYNTHESIS` status;
9. PASS evidence for both validators and the immutable v1 tree assertion.

No placeholder may be replaced with a guessed identifier.
