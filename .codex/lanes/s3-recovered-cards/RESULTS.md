# Lane result — S3-RECOVERED-CARDS repair

## Scope and verdict

- Lane: `s3-recovered-cards-repair`
- Requirement: `RD-U0-U-RECOVERED-CARD-FAMILIES`
- Directive: issue #57, comment `5499373802`
- Base SHA/tree: `5df944f3b72331fdf7a28205c328827a660b726f` / `0e5b9b8cfd124084f9d08db9e74b83e16931033a`
- Rejected predecessor: `74ac7d94b3ce8a79d59865053ec3f6e68d7a6295`
- Repair implementation SHA/tree: `905ec4c759e738716d4701f0f857617c204245d2` / `5e9cba870bf39907269989122e1735198dbded5c`
- Branch: `agent/d0-executable-buffer-v2/u0-recovered-cards-native-r2`
- Independent QA on repair implementation SHA: `PASS`
- Independent INTEGRATE on the same SHA: `PASS`
- Exact status: `ATLAS_EXTENSION_PENDING`
- Penpot authorization: `false`

## Root cause and repair

The rejected predecessor listed 23 declared states but only materialized 16
specimens. Its generic substring dispatcher omitted compact
`document-bounded-cover`, festival `visual-media`/`document-media`, club
`cover-ready`/`future-meetings`/`reduced-motion`, and artifact
`collecting`/`reduced-motion`; it also invented `cover-ready-future`. The old
projection omitted paints, radius, opacity, plugin data, component binding and
Flex, while the screenshot scan only recognized names/metadata. Finally,
`maximum_managed_nodes=30` contradicted the executor's actual first-run count
of 31.

The repair:

- materializes all 23/23 declared states as independently linked visible
  specimens and removes the invented combined state;
- applies explicit source-bound state layout/style behavior, including compact
  contain/bounded-cover, festival 16:10 visual vs 4:5 document cover, club
  cover/fallback/future/focus/reduced-motion, artifact
  default/awake/collecting/collected/focus/reduced-motion, and collection
  lifecycle states;
- keeps the artifact found badge hidden by default and visible only when
  collected;
- uses a complete protected and managed projection over text, fills, strokes,
  image fills, radii, opacity, plugin data, component identity and Flex;
- rejects `type=image` and any `fillImage` anywhere below a managed root;
- stores and enforces the complete managed replay projection across the two
  real native-like executions;
- enforces the coherent census `38/38`: 5 pages + 5 roots + 5 masters + 23
  wrappers/linked instances, with `first_run_created=38` and
  `second_run_created=0`.

## Provider-backed remote readback

GitHub API read the branch ref, commit, tree and each key blob at exact repair
implementation SHA `905ec4c759e738716d4701f0f857617c204245d2`:

| Path | Git blob SHA-1 | Bytes | SHA-256 |
|---|---|---:|---|
| `catalog/asp-production-conveyor-v3/u0/recovered-card-families/U-RECOVERED-CARD-FAMILIES.package.v2.json` | `a8af0c554ece240f2d70446ba477ee1dac225e11` | 25364 | `64e2e7e76baa73591161e0abdc1aba0326894f49f0e702eec935a96b2cd42d9a` |
| `scripts/asp-production-conveyor-v3/u0/recovered-card-families/native_runtime_v2.js` | `fc6cb0e9604ca4bd96e34fe75290ef3582c990b1` | 45295 | `e3c6743f29e860c2dc6db8f9ad1e7653bc19d3b25958d4d3ec3eb974f36c2a02` |
| `scripts/asp-production-conveyor-v3/u0/recovered-card-families/native_executor_v2.js` | `6a3ad5aab493261b052fe4411e6d357714bc3c86` | 282 | `6260024eb0cbbac1571290644a8859f743e173dc85db803abe9d26e1e2942ee2` |
| `scripts/asp-production-conveyor-v3/u0/recovered-card-families/setup_v2.js` | `29f48c72a99d28b48b7b139ef6d1fc03b482ee50` | 1229 | `36fe59cdefac31d2221d7744c13abc504c637d5c4a37390912f2b1911e8fec04` |
| `tests/asp-production-conveyor-v3/u0/recovered-card-families/test_native_executor_v2.js` | `36e10797641a6bb8105e7c370fe6e6935edb6320` | 18990 | `4000867659114b664d614eb6e516a44a805f07d741a23c6c5edb04f580d4460a` |
| `tests/asp-production-conveyor-v3/u0/recovered-card-families/test_repository_invariants_v2.py` | `203a9ee07525848871a80860638eb2d1161f5f1c` | 8923 | `4f5da22c92576823bb31fa475179046e83395d45ecc5c94d7b8aeb417a0b3e21` |
| `catalog/asp-production-conveyor-v3/u0/recovered-card-families/NATIVE_SUCCESSOR_V2.md` | `df81a4d8bc24208ad54576b6f1c19b5754c2c7e9` | 2850 | `a06c5de2161d83c3c2f2956a9ba8fa057066ae114eeff98893a66a697b9eab2a` |
| `catalog/asp-production-conveyor-v3/u0/recovered-card-families/native-successor-local-receipt.v2.json` | `f6bc79b1e235dede8eb51d7795697207c01fb369` | 2079 | `c00fddc2cc33ce761e30820b60ef086f4e581d37e917ca8dc12dda72ed3110f8` |
| unchanged `ASP_ATLAS_EXTENSION_REQUEST_V1.md` | `1ecbada6d8159723f2d5618b8f809af1e4ad1653` | 995 | `b9b7e3264ef59f6fa0fd93b1d1c69666a7212eece763bb02acca990d27c68b55` |

Provider ref readback exactly matched local head/tree and every downloaded blob
matched local bytes.

## Commands and tests

Implementation validation:

```text
node --check native_runtime_v2.js native_executor_v2.js setup_v2.js
node --test test_native_executor_v1.js test_native_executor_v2.js
  11/11 PASS
python3 -m unittest discover ... 'test_repository_invariants_v*.py' -v
  15/15 PASS
python3 -m compileall -q ...
git diff --check
```

Independent QA used a fresh provider clone pinned to the repair implementation:

```text
QA_HEAD=905ec4c759e738716d4701f0f857617c204245d2
QA_TREE=5e9cba870bf39907269989122e1735198dbded5c
Node v2: 6/6 PASS
Python v2: 8/8 PASS
QA_VERDICT=PASS
```

Independent INTEGRATE used another fresh provider clone at the same head:

```text
INTEGRATE_HEAD=905ec4c759e738716d4701f0f857617c204245d2
INTEGRATE_TREE=5e9cba870bf39907269989122e1735198dbded5c
base ancestry/tree exact: PASS
Atlas request exact unchanged blob: PASS
Node v1+v2: 11/11 PASS
Python v1+v2: 15/15 PASS
compileall/clean clone: PASS
INTEGRATE_VERDICT=PASS
```

## Changed files

1. `catalog/asp-production-conveyor-v3/u0/recovered-card-families/NATIVE_SUCCESSOR_V2.md`
2. `catalog/asp-production-conveyor-v3/u0/recovered-card-families/RESULTS.md`
3. `catalog/asp-production-conveyor-v3/u0/recovered-card-families/U-RECOVERED-CARD-FAMILIES.package.v2.json`
4. `catalog/asp-production-conveyor-v3/u0/recovered-card-families/native-successor-local-receipt.v2.json`
5. `scripts/asp-production-conveyor-v3/u0/recovered-card-families/native_runtime_v2.js`
6. `tests/asp-production-conveyor-v3/u0/recovered-card-families/test_native_executor_v2.js`
7. `tests/asp-production-conveyor-v3/u0/recovered-card-families/test_repository_invariants_v2.py`
8. `.codex/lanes/s3-recovered-cards/RESULTS.md`

## Risks and remaining gate

- This is executable Git material plus native-like verification, not a Penpot
  mutation receipt or visual authorization.
- O0 still owns Atlas extension binding and any page-order assignment.
- ActionNav/V0 closure remains pending.
- The existing Atlas request is byte-identical; no Atlas R2, Penpot, PUBLISH or
  Kaggle operation occurred.
