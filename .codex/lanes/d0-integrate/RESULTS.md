# D0 INTEGRATE — G19 remote-readback result

## Identity

- role: `INTEGRATE`
- source branch/head: `chatgpt/asp-production-conveyor-20260831@cb50ae86ec6cc5ae46b566c3e9279b2e03dd82d2`
- lane branch: `task/d0-integrate-20260831`
- lane worktree: `/home/dev/projects/lovekgd-design-system-d0-integrate-20260831`
- producer branch/head read from `origin`:
  `task/g19-p2-materialize-actual@2d05f359af9b3f58cae0449edb879f21b432032c`

No Penpot access or mutation was used by this lane.

## Immutable executable validation

The producer head is remote-readable and its G19 executable snapshot is
internally immutable:

- manifest: `catalog/penpot-executor/g19/manifest.json`
- manifest SHA-256:
  `e9f733d118734cfc1818030d8973ce64eeb6f4a53a4c39f42ce2fa1a896f4a35`
- payload SHA-256:
  `c6c35b6f39e3cd5bc68bfe183c1df0652475533d4eecbaea8bd7bca1b4b35219`
- payload transport SHA-256:
  `82db0a8db5d4bb2ea6bb10a581d349afa44452dd5aaf3da94a2e83154b1e9862`
- executable-set SHA-256:
  `e5d1dded182bef14326befe43edc57769d08ddb04af773fd6a63cfa0aaf46952`
- manifest inputs: `20/20` paths, byte sizes and SHA-256 values match;
- manifest outputs: `28/28` paths, byte sizes and SHA-256 values match;
- executable-set identity recomputation: `PASS`;
- focused materializer tests: `6/6 PASS`.

## Publisher entry points and target

Exact target embedded in the manifest and runtime:

- file: `40e06342-8830-80d6-8008-8fc8a3a4cd4f`
- page: `c16498cb-b51d-8030-8008-904bd8fc9c53`
- existing root: `313fb1ed-0d5c-8095-8008-9108df52b2ce`
- root name: `KenigEvents · G12 bounded L0-L3`
- original empty baseline: revision `41`
- expected terminal census: one page root, `18` root children, `18` local
  components and `validate() = []`.

Same-session setup order is `phase-00-bootstrap.js`, eleven ordered
`phase-01-payload-*.js` chunks, then `phase-02-install-runtime.js`.
The bounded mutator order is P10, P11, P20, P21, P30, P31, P40, P41, P50,
P51, P60, P61 and P90, with `readback.js` after every mutator. Final bounded
export is `export-roots.js`.

Issue #57 comment `5479467434` is the current v3 queue adoption record. It
defines the remaining three publisher micro-batches and their exact entry
points without changing producer bytes:

1. mobile 8006: P50 then P51;
2. desktop 2182: P40 then P41;
3. mobile 2182: P60 then P61.

## Readiness reconciliation

The executable snapshot is technically valid, but the original legacy bundle
is not independently provenance-closed at the producer head:

- bundle: `catalog/materialization-bundles/eventcard-free-slice.g4.ready-v1.json`
- bundle SHA-256:
  `600362047b24df707712598c6ccf2b79047aad62a143afbfdb41daa103a5351d`
- it declares `READY_FOR_W0_PROMOTION`, not `READY_TO_PUBLISH`;
- its bound legacy asset-registry hash
  `d2360d5ab3581fdfdb3c10aa5d995d4d652e127a1da111f8da2e4e4907c1ac48`
  and page-profile hash
  `4ed73c4203a32fc775bdaf82bd65d32ad82040e81038afe8e50a7d5eb2c4017b`
  existed at historical commit
  `6f66a9b9f27bfbe2c8473c453c46adb911e16e41`, but both required paths are
  absent at the G19 producer head;
- current active contract/profile at the D0 source head remain fail-closed:
  the profile has `materialization.status: BLOCKED` and
  `allowed_to_mutate_penpot: false`; required asset and geometry proofs are
  unresolved;
- the G19 payload embeds the obsolete writer string `E0_CHATGPT_PRO`; the
  runtime does not enforce that string and issue #57 records the current
  D0/PUBLISH writer claim, but a terminal run receipt must reconcile actor and
  run-control identity instead of copying the obsolete metadata.

O0's explicit `ASP_PACKAGE_READY_V3` adoption in issue #57 is therefore the
publisher queue record; the legacy bundle alone is not the current queue
authority. No replacement bundle was created by INTEGRATE because one would
either duplicate the adopted immutable executable or silently rewrite product
and governance semantics.

## Terminal status

`REPAIR` as of issue #57 incident comment `5479504424`.

P40 created a resumable `BUILDING` root and then failed with
`LINKED_TEXT_OVERRIDE_TARGET_MISSING` against the persistent V2 leaves. The
incident readback recorded revision `56`, root children `16`, local components
`15`, and validation `[]`. Blind retry is forbidden. MAT must produce a bounded
V2-to-V3 resume repair; INTEGRATE must revalidate its exact remote SHA, output
hashes, target and mutator order before PUBLISH resumes.
