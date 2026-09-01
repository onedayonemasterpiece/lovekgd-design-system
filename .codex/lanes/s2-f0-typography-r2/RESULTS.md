# S2-TYPOx2 results

## Lane contract

- **Lane ID:** `s2-f0-typography-r2` (`S2-TYPOx2`).
- **Requirement IDs:** `F-TYPOGRAPHY-TYPE-SCALE-SMALL-PAGE`, `F-TYPOGRAPHY-LAYOUT-RULES-SMALL-PAGE`, `S2-ATLAS-R2-WIDE`, `S2-NATIVE-REPLAY`, `S2-STRICT-PLUGIN-DATA`, `S2-EVENTCARD-BOUNDARY`, `S2-REMOTE-READBACK`.
- **Writable scope:** the two package JSONs and receipts under `typography-layout-r4`, their two executor entry points, the shared runtime limited to this two-page family, native-like test double/tests, the canonical typography successor document and index, `CHANGELOG.md`, and this result record.
- **Forbidden scope:** Penpot reads/mutations/tools/APIs, PUBLISH, Atlas R2 files, Kaggle, new component families/broad packages, other worktrees/branches.
- **Done when:** both packages have separate frozen tuples and independent QA/INTEGRATE verdicts at one exact remote head; actual same-document second replay has `created=0`; duplicates/detached/screenshots/empty wells are zero; protected projections are unchanged; exact fonts, editable Cyrillic, linked `ATLAS_PAGE_HEADER_V2`, native Flex/Grid WIDE formulas, source-bound visible specimens, strict string-only plugin data, and `does_not_repair_eventcard_text=true` are enforced.

## Git identity

- Base head: `eb388db611fb997283ba63c452b6642ff3508678`
- Base tree: `95dd6b548d1a5fd071b6fe35d74a893f8db21d7a`
- Implementation/evidence head: `ba5ae7e06cb8c61a600844515e32866b14e46a48`
- Implementation/evidence tree: `d8e949a237254de892d61f5ae349e95fc157a74b`
- Branch: `agent/d0-executable-buffer-v2/f0-typography-r2`
- Atlas input head (unchanged): `663be702d481972cb2e8863af500f1c35dda1d8c`
- Atlas input tree (unchanged): `cf9a1e6a5e0a84aea5636334dbd3be4961039b75`

`git ls-remote`, GitHub ref API, and GitHub commit API all returned the exact implementation head/tree above. GitHub Contents API returned identical blob IDs, sizes, and decoded bytes for every implementation-head change:

| Path | Git blob SHA-1 | Bytes | SHA-256 | GitHub readback |
|---|---|---:|---|---|
| `CHANGELOG.md` | `8efa78c59065fb2d9db65e51e6289d52e7b9920b` | 501 | `ddbf0e5b6feedf3131eca595bc670ae1a1c136a46ffaea30c7ab03be2e089070` | PASS |
| `catalog/asp-production-conveyor-v3/f0/typography-layout-r4/F-TYPOGRAPHY-LAYOUT-RULES-SMALL-PAGE.package.r2.json` | `63038843dc5b87165bd3f01a6ff3747220971ea4` | 6690 | `897380578dc873dd7c5bef51967f468dfdc76bb67a5b5ba6b9dca25de27f202e` | PASS |
| `catalog/asp-production-conveyor-v3/f0/typography-layout-r4/F-TYPOGRAPHY-TYPE-SCALE-SMALL-PAGE.package.r2.json` | `aeaf1a9cdae776131fd7b4c58f57d5c2679d60e9` | 6619 | `d317a9fcded552164f2ba0cc236f65808398d50e4b105aef807a36ac8e3e4165` | PASS |
| `docs/foundations/typography-atlas-r2-native-successors.md` | `3b38387c70a58ee7317d014ce44af992c89f8691` | 4100 | `10932ad385c119cb1cbdb2e36f2b760ddef2c11b03e8f48e1e3a49219f131cf4` | PASS |
| `docs/index.md` | `793488763adb9ade5392ec1e51f50ee40b1d79ea` | 11547 | `fb449a8361e00ff4acd78413e67a2f246a6657566627b17b2b2a2fb2c15556e8` | PASS |
| `receipts/asp-production-conveyor-v3/f0/typography-layout-r4/F-TYPOGRAPHY-LAYOUT-RULES-SMALL-PAGE.receipt.r2.json` | `39b72d5556274c606288e5c31cab7a7e19de88ab` | 2662 | `3f784e6a053502de788e13a630157845dafbd7c2bb08af319b17c6b4ae76a5df` | PASS |
| `receipts/asp-production-conveyor-v3/f0/typography-layout-r4/F-TYPOGRAPHY-TYPE-SCALE-SMALL-PAGE.receipt.r2.json` | `696862c2301ccafa100cfa3da5b6f43dcea5f113` | 2648 | `8992f30c0ba1d8431426727f4a8a4d619fd381f9e6e56d0869b39ed7b9d0cb0c` | PASS |
| `scripts/asp-production-conveyor-v3/f0/typography-layout-r4/layout_rules_small_page_atlas_r2.js` | `03e098d893a88e31cf46b32c440ab02b41c779f8` | 6933 | `1ca133fe8b12d64707c94ba3a192ac01ba21e5b1328d466d6381c1b887980c0a` | PASS |
| `scripts/asp-production-conveyor-v3/f0/typography-layout-r4/type_scale_small_page_atlas_r2.js` | `5e29d1161d2a899823577124fc3a865adf63278f` | 7198 | `1098da117df4f6d265e9ff296cb685f67e3f7a67a3489ffce9c73f2fe25465bf` | PASS |
| `scripts/asp-production-conveyor-v3/f0/typography-layout-r4/typography_atlas_r2_native_runtime.js` | `84a1d6f87da3f876e0bc2788e286d66d3e8eddcd` | 25392 | `6f96297fd8bb5451bcc33929a1255b80be0c5d4bc40c2c3e9734469955ddd9cf` | PASS |
| `tests/asp-production-conveyor-v3/f0/typography-layout-r4/layout_rules_small_page_atlas_r2.test.js` | `62e3a5dfd2f8b1c072002bab787010eb6156b690` | 6214 | `8a8b0b4bc0af2303f5d0b3895a4ca35c6c228cb0c558533c4a101e3dcdde5cc3` | PASS |
| `tests/asp-production-conveyor-v3/f0/typography-layout-r4/native_like_penpot_double.js` | `3633e4b2c43903b946ac165e846446dc4ff53767` | 7829 | `e42470d2f1340a2eadc33d93d609bdedde34244f0fb03543a09cd6cf0b6a127e` | PASS |
| `tests/asp-production-conveyor-v3/f0/typography-layout-r4/test_typography_atlas_r2_package_contracts.py` | `ef93b535c6a9d55acd0939539c166b80362a20e3` | 6592 | `728dca7f6b1047bbce10fa0bc6729f3dcf1eefff6ee082ebd63f40fd481456b2` | PASS |
| `tests/asp-production-conveyor-v3/f0/typography-layout-r4/type_scale_small_page_atlas_r2.test.js` | `aeac1278b702ef038da27189563063469a8af64a` | 5889 | `240c9187960731a70093e571ebacfe2e201f05b682e8c2bb061261f04bd16d16` | PASS |

## Independent package verdicts at the same exact head

| Package | QA | INTEGRATE | Exact head | Terminal status |
|---|---|---|---|---|
| `F-TYPOGRAPHY-TYPE-SCALE-SMALL-PAGE` | PASS (6/6) | PASS | `ba5ae7e06cb8c61a600844515e32866b14e46a48` | `PUBLISHABLE_AFTER_ATLAS_EVIDENCE_GATE` |
| `F-TYPOGRAPHY-LAYOUT-RULES-SMALL-PAGE` | PASS (6/6) | PASS | `ba5ae7e06cb8c61a600844515e32866b14e46a48` | `PUBLISHABLE_AFTER_ATLAS_EVIDENCE_GATE` |

These are Git-side executable verdicts only. They are not Penpot authorization, visual acceptance, or publication authorization.

## Commands and evidence

- `node --check` on the shared runtime and both executor entry points — PASS.
- `node --test .../type_scale_small_page_atlas_r2.test.js` — PASS, 6/6; two real native-like same-document runs, second `created=0`.
- `node --test .../layout_rules_small_page_atlas_r2.test.js` — PASS, 6/6; two real native-like same-document runs, second `created=0`.
- `node --test tests/asp-production-conveyor-v3/f0/typography-layout-r4/*.test.js` — PASS, 12/12.
- `python3 .../test_typography_atlas_r2_package_contracts.py` — PASS, 6/6 independent INTEGRATE checks.
- `python3 tests/asp-production-conveyor-v3/f0/test_typography_layout_candidate_v3.py` — PASS, 5/5 predecessor regression checks.
- `git diff --check` — PASS.
- Post-push independent QA and INTEGRATE were repeated on exact head `ba5ae7e06cb8c61a600844515e32866b14e46a48` — PASS.

Measured gates for both packages: `second_run_created=0`, `duplicates=0`, `detached=0`, `screenshots=0`, `empty_wells=0`, protected projections unchanged, and `does_not_repair_eventcard_text=true`. The native-like test double rejects non-string shared-plugin-data values and contains no `String(value)` coercion.

## Changed files

The exact 14 implementation-head paths are enumerated in the remote-readback table. This record is the only follow-up file after that evidence head.

## Safety and residual risk

- `penpot_reads=0`; `penpot_mutations=0`; `publish_started=false`; `atlas_modified=false`; `kaggle_used=false`.
- No new component family or broad package was created. The executors retain only the ten pre-existing source component identities split 4/6 across the two package-local pages.
- Exact DejaVu Sans font streams are fail-closed preflight inputs: regular 759720 bytes / `ae7b7855e115a5966d8b1b3f80f254ccc117ec86f9965e202ee2940453837280`; bold 708920 bytes / `5c1247acef7f2b8522a31742c76d6adcb5569bacc0be7ceaa4dc39dd252ce895`.
- No live Penpot run was performed by design. The remaining Atlas evidence gate is therefore explicit and cannot be represented as Penpot authorization.
