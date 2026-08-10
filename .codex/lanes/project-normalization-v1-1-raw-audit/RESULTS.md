# L1 raw/audit lane results

## Scope

- Requirements: R01, R02, R06.
- Branch: `agent/project-normalization-v1-1/raw-audit`.
- Base: `50f51565041a9ea36768784d1cc9ca1d7345acb7`.
- Immutable Decoder v1, Behavioral v1.1 source evidence, production source, Penpot and prototypes were read-only.

## Delivered

- Bound the byte-exact red-team report, SHA-256
  `a466ae5ff4846a1895eb11429c2fe4f175115a119dc9904d5a4a4e50a9507f76`, to a complete
  `AUD-PN-001…013` disposition ledger with 7 HIGH, 5 MEDIUM and 1 LOW findings.
- Reconstructed the authoritative universe independently from pinned manifests and source artifacts:
  - 57 non-PASS terminal probes;
  - 87 unresolved rows;
  - 16 fragmentation candidates;
  - 12 candidate AS-IS contracts;
  - 107 logical components;
  - 279 total raw identities.
- Added 57 typed probe/unresolved aliases and a 279-row raw-to-canonical partition:
  - 165 direct members;
  - 114 typed-alias members;
  - 222 exact canonical targets.
- Added a strict Draft 2020-12 finding schema and regenerated all 222 findings with exact raw identity joins,
  source/artifact/commit/record provenance and an operational disposition distinct from `NOT_MERGED`.
- Protected the three immutable decoder rows that conflate dead and unreachable with `preserve` and
  `not_observed_under_pinned_evidence`:
  - `component.02effc1d8ab8434b` (`PopularCategoryFilter`);
  - `component.29e9aebbf63be827` (`MobileSearchBottomNav`);
  - `component.d65fb5ef1db02f46` (`WeekendTimeMatrix`).

## Conservative operational counts

| Disposition | Count |
|---|---:|
| `preserve` | 104 |
| `investigate` | 36 |
| `decoder_issue` | 39 |
| `split_identity_candidate` | 16 |
| `await_experiment_decision` | 14 |
| `reconcile_requirement_runtime` | 6 |
| `fix_implementation` | 4 |
| `await_accessibility_decision` | 2 |
| `accepted_current_difference` | 1 |
| **Total** | **222** |

No runtime split, deprecation, product-model decision, experiment winner or positive semantic-readiness
decision is encoded by these dispositions.

## Validation

Command:

```text
node scripts/normalization-v1-1/build-raw-partition.mjs --check --self-test
```

Result:

```json
{"status":"valid","raw_identities":279,"aliases":57,"partition_rows":279,"canonical_findings":222,"operational_dispositions":{"preserve":104,"investigate":36,"decoder_issue":39,"split_identity_candidate":16,"await_experiment_decision":14,"reconcile_requirement_runtime":6,"fix_implementation":4,"await_accessibility_decision":2,"accepted_current_difference":1},"semantic_mutations_rejected":7}
```

The targeted semantic mutations reject:

1. one missing raw identity plus one duplicate while total count remains unchanged;
2. generic two-member canonicalization without a typed alias;
3. swapped unresolved alias projections;
4. substitution of a PASS probe into a terminal alias;
5. a missing operational disposition;
6. source-only evidence relabeled runtime-observed;
7. substituted artifact record provenance.

`git diff --check` passes. Deterministic `--write` followed by `--check` produces byte-identical outputs.
Python `jsonschema.Draft202012Validator` validates **222/222** canonical finding rows with zero errors.

The legacy v1 synthesis validator reaches its receipt check and then rejects the changed
`catalog/normalization/findings-disposition.jsonl` byte count, as expected: the v1 receipt still binds the
pre-remediation file. The v1.1 integrator owns the new validator and receipt binding.

## Generated artifact hashes

| Artifact | Rows | SHA-256 |
|---|---:|---|
| `catalog/normalization/authoritative-raw-universe.jsonl` | 279 | `cc2301d2b1285177b7384cafc678b058de588f883986b2b710d2601861feea3e` |
| `catalog/normalization/raw-alias-registry.jsonl` | 57 | `b6a4afc22e7f1af2f761099e55edcd93ba09a9b3351ba7a032336cce70bffa0f` |
| `catalog/normalization/raw-to-canonical-partition.jsonl` | 279 | `557ba04c74e12e1219479bf232572ee8219038f4a2ca8d072dc610b328f1448d` |
| `catalog/normalization/findings-disposition.jsonl` | 222 | `961c15f7eead1d89ca428d52761ae720c9ee0a96eb6de05bbcf98052657e59da` |

The hashes above are produced by the deterministic generator and must be refreshed here if its serialized
schema changes before integration.
