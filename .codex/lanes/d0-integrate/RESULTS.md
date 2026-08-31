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

The resolved-case tuple's authoritative source is
`w2-free-collection-sot-g4-clean@78a84576740cb650b2efbe2900377f371faf49a1`.
The relevant G19 output bytes are hash-identical, but the G19 producer tree is
not a self-contained source snapshot: validation of the index reports 15
missing-reference assertions across the two v3 scenarios, packed-row input,
indexed generator/input/geometry proof and four case specifications. This is a
provenance-closure gap, not permission to infer or recreate those inputs.

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

## Canonical remote-main check

Fresh remote readback confirms `origin/main` remains
`b3567cb72d81a7aad4b47a68e220325f055697a2`. Its controlling file hashes are:

- active contract: `54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72`;
- blocked page profile: `2359082956b9bb3bc0003103045a7a1c169dd0d13c7cee187b2b6c671a60cee3`;
- unresolved asset registry: `03e0209794b58c59dcb04edba8593d25866a9d701df1b8671861c0cc79ebb7bc`;
- requirements lock: `e3fb97fe7e77cd8302f8ed65ed6c6b1c27ef43622d4e060c4310f0ccdc049c58`.

The profile still says `BLOCKED_OWNER_REJECTED`,
`materialization.status: BLOCKED`, and `allowed_to_mutate_penpot: false`.

## Source-A browser-server recovery pointer

The exact frozen source is `onedayonemasterpiece/events-bot-new` branch
`w2-free-collection-visual-evidence-g12` at
`c7c3e2367db8fd8865a735c8b9f5df1ef2b6efd1` (tree
`3c7b231d10e93866899cede299c3523c8b996711`). PR #55 comment `5476927675`
records this persistent server command, run from its `site` directory:

```bash
env PUBLIC_STATIC_SITE_CURRENT_DATE=2026-08-30 TZ=Europe/Kaliningrad \
  ./node_modules/.bin/astro dev \
  --root /home/dev/.codex/worktrees/events-bot-new/g19-browser-evidence-source-a/site/evidence/free-collection-g12/harness \
  --host 127.0.0.1 --port 4339
```

The repository capture script's port `4329` is ephemeral, not the persistent
V0 review server. A new receipt must record the new PID/run identity, detached
clean SHA, loopback HTTP 200 and zero tracked mutation.

## F-ACTION-NAV-ICONS preflight

Issue #57 comment `5479544692` points to
`ffb0ad990400f239a28ba23825033b5bea408a99`, but the named remote branch has
already advanced to `af1a62aaa820bee2aefabaad578a4e926c713784`. The immutable
package remains readable. Its JSON is 15,447 bytes with SHA-256
`43d77199de192ec190c7cb6df6874a740d5888739593c9a83e27baa14fa6c0ef`.

Terminal preflight is `REPAIR`, not publisher-consumable:

- it contains only JSON with prose `declarative-penpot-build-plan`
  operations; it has no executable Penpot materializer;
- there is no repository schema implementing `asp.foundation-package.v3`;
- each of the nine declared byte sizes and SHA-256 values matches the JSON
  `svg` string only after appending an undocumented LF; the literal embedded
  strings match `0/9` declared hashes;
- issue #56 still leaves the foundation baseline
  `IMPLEMENTED_PENDING_INDEPENDENT_REVIEW` and explicitly grants no Penpot
  authorization;
- the package does not close the canonical active asset registry or supply all
  required binding/run-control/provenance fields.

The source commits and paths exist and their geometry can remain recovery
capital. F0 must repair the exact-byte convention, complete the foundation and
active-profile gates, and ship a bounded executable plus readback before
PUBLISH can consume this package.
