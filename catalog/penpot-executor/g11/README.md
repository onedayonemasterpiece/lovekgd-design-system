# Generation-11 run-agnostic ordinary-Penpot executor

1. W3 runs `penpot-native-compatibility-probe.js` read-only against the exact target and sends the observation to W0.
2. W0 validates it and issues a signed `kenigevents.penpot-native-compatibility-probe-receipt.v1` plus a W3 run capsule conforming to `w0-issued-w3-run-capsule.v1.schema.json`.
3. W0 issues one short-lived ticket per `operationPlan()` entry and separate rollback tickets. A ticket is bound to owner W3, run, generation, file, page, sequence, operation, nonce and expiry.
4. Paste the single generated `capsule/penpot-visual-executor.g11.js` in an ordinary Penpot code window. It only installs `globalThis.__KENIGEVENTS_RUN_AGNOSTIC_EXECUTOR__`; it embeds no run authority.
5. Invoke `execute({capsule, probeReceipt})`. No Penpot write occurs before all static gates pass, and each native write consumes and checks its own ticket immediately before the call.

The executor is an immutable Git candidate only. This repository turn performs no Penpot access, mutation, promotion, or owner acceptance.
