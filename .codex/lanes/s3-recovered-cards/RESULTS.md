# Lane result — S3-RECOVERED-CARDS final common-gate repair

## Scope and verdict

- Lane: `s3-recovered-cards-repair`
- Requirement: `RD-U0-U-RECOVERED-CARD-FAMILIES`
- Directive: issue #57, comment `5499373802`
- Original base SHA/tree: `5df944f3b72331fdf7a28205c328827a660b726f` / `0e5b9b8cfd124084f9d08db9e74b83e16931033a`
- This repair iteration base SHA/tree: `d198bbdf15efd7c45f485eef0dd774e01a893777` / `ac725af701233b6f300ea217db563979283d4da4`
- Final head/tree: the single combined implementation-and-evidence commit containing this file; exact provider readback is emitted in the terminal parent handoff (a commit cannot contain its own SHA without a circular hash).
- Branch: `agent/d0-executable-buffer-v2/u0-recovered-cards-native-r2`
- Exact status: `ATLAS_EXTENSION_PENDING`
- Penpot authorization: `false`

## Final repair

Independent QA found that the prior full projection still omitted shadows,
complete typography and several supported native style/layout properties; its
managed replay adversarial combined shadow drift with other mutations; detached
scan only covered tagged specimen instances; and plugin data used a fixed key
fallback that could not see a foreign namespace.

The final combined repair:

- projects complete fill/stroke fields including gradients, references, caps and
  image fills;
- projects all native ShapeBase style state used by the executor/test surface:
  per-corner radii, opacity, blend mode, shadows, layer/background blur,
  constraints, visibility/locking, flips/rotation, layout-child, grid-cell and
  token bindings;
- projects every supported typography property: font id/family/variant/size/
  weight/style, line height, letter spacing, transform, decoration, direction,
  horizontal/vertical alignment and grow mode;
- projects all Flex common-layout alignment, gap, padding and sizing fields;
- proves a shadow-only managed replay corruption fails with
  `MANAGED_REPLAY_PROJECTION_CHANGED`;
- recursively scans every managed root and every component master, and rejects
  an untagged nested detached component copy on its first materialization run;
- removes fixed projection keys, enumerates local plugin keys and all shared
  namespaces/keys, and fails before the first undo block/write when complete
  namespace enumeration is unavailable;
- proves a foreign shared-plugin namespace mutation fails the protected gate;
- preserves 23/23 actual source-bound states, census 38/38, Flex construction,
  `first_run_created=38`, `second_run_created=0`, and the unchanged Atlas
  request with no page order.

## Validation commands

```text
node --check scripts/.../native_runtime_v2.js
node --check scripts/.../native_executor_v2.js
node --check scripts/.../setup_v2.js
node --test test_native_executor_v1.js test_native_executor_v2.js
  12/12 PASS
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover ... 'test_repository_invariants_v*.py' -v
  15/15 PASS
git diff --check
```

V2-only acceptance:

```text
Node v2: 7/7 PASS
Python v2: 8/8 PASS
all 23 states: PASS
managed census 38/38: PASS
second_run_created=0: PASS
shadow-only replay corruption: fail-closed PASS
recursive untagged nested detached copy: fail-closed PASS
missing namespace enumeration before mutation: fail-closed PASS
foreign namespace mutation: fail-closed PASS
```

Fresh provider-backed QA and INTEGRATE are run against the exact single final
commit after its ordinary fast-forward push; exact final head/tree/key blob
SHA/bytes/SHA-256 evidence is returned in the terminal handoff.

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

- The official PluginData surface enumerates shared keys only for a namespace
  already known to the caller. Complete projection therefore requires an
  execution adapter to provide `getSharedPluginDataNamespaces()`; without that
  capability this package deliberately stops before mutation.
- This is Git/native-like evidence, not Penpot execution or visual acceptance.
- O0 still owns Atlas extension binding and any Atlas page-order assignment;
  ActionNav/V0 remains pending.
- No Penpot read/mutation, PUBLISH, Atlas R2 edit or Kaggle operation occurred.
