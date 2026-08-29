# EventCard Large current-v2 durable evidence store

This directory is the bounded, content-addressed destination for the seven active
Golden Event Corpus v1 cases. It is intentionally empty until a runtime produces a
complete, identity-bound pack. A historical screenshot, a hash without source bytes,
or a partially populated directory is not durable evidence.

For each case, `scripts/current-v2/current-v2.mjs finalize-evidence` requires exactly:

1. `astro.png`
2. `penpot.png`
3. `overlay-50.png`
4. `diff.png`
5. `geometry.json`
6. `computed-style.json`
7. `structural-findings.json`
8. `pixel-metrics.json`
9. `agent-review.json`
10. `final-receipt.json`
11. `run-manifest.json`

The command validates case/contract identity, PNG signatures, JSON parseability,
per-file SHA-256, the 25 MiB pack bound, and writes a `current-v2-long-term`
manifest under `<case_id>/<pack_sha256>/`. Cleanup skips every directory with a
valid durable marker. Missing bytes produce `BLOCKED_EVIDENCE_INCOMPLETE`; they are
never converted into a PASS receipt.
