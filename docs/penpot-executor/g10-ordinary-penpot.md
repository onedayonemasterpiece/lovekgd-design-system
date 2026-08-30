# Generation 10 ordinary-Penpot visual executor

The generated file `catalog/penpot-executor/g10/capsule/penpot-visual-executor.g10.js` is pasted as one script into an ordinary Penpot code window. It has no filesystem, network, GitHub, CommonJS, or external-loader dependency.

Before execution, the operator must place a JSON value matching `contracts/penpot-executor/ordinary-penpot-runtime-binding.g10.schema.json` at Penpot local-storage key `kenigevents.asp.execution-control.g10`. The target file/page UUIDs are run-specific values in that runtime binding only. The script refuses to mutate unless generation 10 is ACTIVE, the exact W2 lease and accepted bundle authorization match, cancellation is false, and the current Penpot file/page match the runtime target.

The script rereads control, cancellation, and the single-run lease immediately before every mutation wrapper. It emits a complete receipt at `kenigevents.asp.executor-receipt.g10`. This repository task does not run the script and performs no Penpot mutation.
