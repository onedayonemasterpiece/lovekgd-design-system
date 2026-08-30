# Phase-B Penpot-only execution

This candidate does not authorize a Penpot mutation. In a later W0-issued Penpot WRITE lease, transfer the complete `catalog/penpot-executor/g9/capsule/` directory into the isolated executor window. No repository or network lookup is permitted.

The host supplies the ordinary Penpot native API object to `runPenpotPhaseB` from `root/scripts/round-trip-reconstruction/penpot-phase-b-executor.js`, together with a run ID and the pinned executor SHA-256. The executor verifies every manifest entry, the generation-9 accepted-bundle control, target capsule, source hashes and current native lease/cancellation state before writing. Preserve the returned JSON receipt verbatim. A state other than `SUCCEEDED` is not materialization evidence; `FAILED_PARTIAL_STATE` requires manual isolation and W0 review.
