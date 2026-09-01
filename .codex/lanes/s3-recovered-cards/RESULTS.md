# Lane result — S3-RECOVERED-CARDS

## Scope and verdict

- Lane: `S3-RECOVERED-CARDS`
- Requirement: `RD-U0-U-RECOVERED-CARD-FAMILIES`
- Directive: issue #57, comment `5499373802`
- Base SHA: `5df944f3b72331fdf7a28205c328827a660b726f`
- Base tree: `0e5b9b8cfd124084f9d08db9e74b83e16931033a`
- Successor head SHA: `59aea300a526fbebb0328883abf979daf40e7c92`
- Successor tree: `70034514eef2f1d962f64cfc3da17137ee5a6400`
- Branch: `agent/d0-executable-buffer-v2/u0-recovered-cards-native-r2`
- Independent QA on successor head: `PASS`
- Independent INTEGRATE on successor head: `PASS`
- Exact status: `ATLAS_EXTENSION_PENDING`
- Penpot authorization: `false`

## Delivered

- Package-local v2 successor with five concrete native page/root/component
  paths and sixteen linked visible state specimens.
- Family-specific visible anatomy, product layout, styling, Cyrillic content,
  and state overrides for compact, festival, club, artifact, and collection
  cards.
- No `penpot.ensure` in the v2 execution path.
- Strict `typeof value === "string"` shared-plugin-data runtime and test double;
  non-strings are rejected with no coercion.
- Two executions of the actual native-like executor on the same surface:
  `first_run_created=31`, `second_run_created=0`.
- Duplicate, detached, screenshot, source-lineage, protected-projection,
  validation, and cancellation gates.
- Exact source head/tree and eight unchanged role/path/blob pins.
- Existing Atlas extension request preserved byte-for-byte; Atlas page order is
  not assigned.

## Provider-backed remote readback

GitHub API read the branch ref, commit, tree, and every key blob at exact
successor head `59aea300a526fbebb0328883abf979daf40e7c92`:

| Path | Git blob SHA-1 | Bytes | SHA-256 |
|---|---|---:|---|
| `catalog/asp-production-conveyor-v3/u0/recovered-card-families/U-RECOVERED-CARD-FAMILIES.package.v2.json` | `a51c093459e011bdad92fc4c13d1cc63765d4dff` | 20479 | `d12654468e115247223e648262bd5b8b56be0192fd12636f64962c6e207b4b19` |
| `scripts/asp-production-conveyor-v3/u0/recovered-card-families/native_runtime_v2.js` | `b392c226526849dc162bc1a55f0ad1da63988aa6` | 32404 | `7591112d1b87bb780a95547f14183610536e91f45f58cac096d4996f0f85c441` |
| `scripts/asp-production-conveyor-v3/u0/recovered-card-families/native_executor_v2.js` | `6a3ad5aab493261b052fe4411e6d357714bc3c86` | 282 | `6260024eb0cbbac1571290644a8859f743e173dc85db803abe9d26e1e2942ee2` |
| `scripts/asp-production-conveyor-v3/u0/recovered-card-families/setup_v2.js` | `29f48c72a99d28b48b7b139ef6d1fc03b482ee50` | 1229 | `36fe59cdefac31d2221d7744c13abc504c637d5c4a37390912f2b1911e8fec04` |
| `tests/asp-production-conveyor-v3/u0/recovered-card-families/test_native_executor_v2.js` | `4cfdd7c25c479545614a9a60ed762d55c53c268e` | 13056 | `51ef9d64e49dfe2aab0bb53642575911ae202ef04ebe599b9dfea1c1fe6c9b21` |
| `tests/asp-production-conveyor-v3/u0/recovered-card-families/test_repository_invariants_v2.py` | `38b3fd77beff9901f3da93dfd65c23d77aa9dd5e` | 7259 | `e5046818e74a8ced34633717acfa6e7ee0aeba8048fa76bef0ee653cc8085d0f` |
| `catalog/asp-production-conveyor-v3/u0/recovered-card-families/NATIVE_SUCCESSOR_V2.md` | `47f3e6c97d68c98762bdd66645b79a4d80af94a2` | 2467 | `6056f621a467c8fba37641d93e5704488f79d08abd5b10858b71f2c7b20eac20` |
| `catalog/asp-production-conveyor-v3/u0/recovered-card-families/native-successor-local-receipt.v2.json` | `59dd04f4d5a65ab2f36ad1d8d991c12ffa885bcd` | 1854 | `331a21f0ba42c1bc0bd93974cccf66b030e773aada1cf2b06f7e1be56ca37261` |
| unchanged `ASP_ATLAS_EXTENSION_REQUEST_V1.md` | `1ecbada6d8159723f2d5618b8f809af1e4ad1653` | 995 | `b9b7e3264ef59f6fa0fd93b1d1c69666a7212eece763bb02acca990d27c68b55` |

Provider commit readback:

```text
ref  refs/heads/agent/d0-executable-buffer-v2/u0-recovered-cards-native-r2
head 59aea300a526fbebb0328883abf979daf40e7c92
tree 70034514eef2f1d962f64cfc3da17137ee5a6400
parent 5df944f3b72331fdf7a28205c328827a660b726f
```

## Commands and tests

Local implementation validation:

```text
node --check native_runtime_v2.js/native_executor_v2.js/setup_v2.js
node --test test_native_executor_v1.js test_native_executor_v2.js
  10/10 PASS
python3 -m unittest discover ... 'test_repository_invariants_v*.py' -v
  14/14 PASS
python3 -m compileall -q ...
git diff --check
```

Independent QA used a fresh provider clone pinned to the successor head:

```text
QA_HEAD=59aea300a526fbebb0328883abf979daf40e7c92
QA_TREE=70034514eef2f1d962f64cfc3da17137ee5a6400
Node v2: 5/5 PASS
Python v2: 7/7 PASS
QA_VERDICT=PASS
```

Independent INTEGRATE used a second fresh provider clone at the same head:

```text
INTEGRATE_HEAD=59aea300a526fbebb0328883abf979daf40e7c92
INTEGRATE_TREE=70034514eef2f1d962f64cfc3da17137ee5a6400
parent/base exact: PASS
changed-path scope: PASS
Atlas extension request unchanged: PASS
Node v1+v2: 10/10 PASS
Python v1+v2: 14/14 PASS
status/authorization assertions: PASS
INTEGRATE_VERDICT=PASS
```

## Changed files on successor head

1. `catalog/asp-production-conveyor-v3/u0/recovered-card-families/NATIVE_SUCCESSOR_V2.md`
2. `catalog/asp-production-conveyor-v3/u0/recovered-card-families/RESULTS.md`
3. `catalog/asp-production-conveyor-v3/u0/recovered-card-families/U-RECOVERED-CARD-FAMILIES.package.v2.json`
4. `catalog/asp-production-conveyor-v3/u0/recovered-card-families/native-successor-local-receipt.v2.json`
5. `scripts/asp-production-conveyor-v3/u0/recovered-card-families/native_executor_v2.js`
6. `scripts/asp-production-conveyor-v3/u0/recovered-card-families/native_runtime_v2.js`
7. `scripts/asp-production-conveyor-v3/u0/recovered-card-families/setup_v2.js`
8. `tests/asp-production-conveyor-v3/u0/recovered-card-families/test_native_executor_v2.js`
9. `tests/asp-production-conveyor-v3/u0/recovered-card-families/test_repository_invariants_v2.py`

## Risks and remaining gate

- This is executable Git material plus native-like verification, not a Penpot
  mutation receipt or visual acceptance.
- O0 must bind the unchanged five-page Atlas extension request and assign any
  Atlas page order.
- ActionNav/V0 closure remains a dependency before publication authorization.
- No Penpot read/mutation, PUBLISH, Atlas edit, or Kaggle action occurred.
