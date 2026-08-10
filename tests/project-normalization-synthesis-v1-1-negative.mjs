#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  MANDATORY_MUTATIONS,
  MUTATION_CATALOG_PATH,
  runMutationProof,
} from '../scripts/normalization-v1-1/project-normalization-mutation-proof.mjs';

const args = process.argv.slice(2);
const positional = args.filter((argument) => !argument.startsWith('--'));
const root = path.resolve(positional[0] ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const writeCatalog = args.includes('--write-catalog');
const catalogPath = path.join(root, MUTATION_CATALOG_PATH);

const { catalogBytes, runResult } = runMutationProof(root);

const requireProof = (condition, diagnostic) => {
  if (!condition) throw new Error(diagnostic);
};

requireProof(MANDATORY_MUTATIONS.length === 14, 'mandatory mutation contract must define exactly 14 cases');
requireProof(runResult.status === 'PASS', 'mutation proof status is not PASS');
requireProof(runResult.receipt_validation_enabled === false, 'receipt validation was not disabled');
requireProof(/^[0-9a-f]{40}$/u.test(runResult.exact_head_sha), 'run result exact head SHA is invalid');
requireProof(Number.isInteger(runResult.duration_ms) && runResult.duration_ms >= 0, 'run result duration is invalid');
requireProof(runResult.total_cases === MANDATORY_MUTATIONS.length, 'mandatory mutation result cardinality differs');
requireProof(runResult.passed_cases === runResult.total_cases && runResult.failed_cases === 0, 'not every mandatory mutation passed');
requireProof(runResult.baseline_rechecks === runResult.total_cases + 1, 'baseline was not checked initially and after every case');
requireProof(runResult.cases.every((item) => item.expected_error_code === item.actual_error_code), 'expected and actual error codes differ');
requireProof(runResult.cases.every((item) => item.exact_head_sha === runResult.exact_head_sha
  && Number.isInteger(item.duration_ms) && item.duration_ms >= 0), 'a case lacks exact-head or duration provenance');
requireProof(runResult.cases.every((item) => typeof item.case_id === 'string' && item.case_id.length > 0
  && typeof item.lane === 'string' && item.lane.length > 0
  && item.kind === 'negative'
  && item.target_validator === 'scripts/normalization-v1-1/validate-mutation-candidate.mjs'
  && typeof item.mutation_description === 'string' && item.mutation_description.length > 0
  && item.source_test_file === 'tests/project-normalization-synthesis-v1-1-negative.mjs'), 'a case lacks required machine-readable mutation metadata');
requireProof(runResult.cases.every((item) => item.targeted_rejected && item.aggregate_rejected), 'targeted or aggregate rejection is missing');
requireProof(runResult.cases.every((item) => item.receipt_validation_enabled === false), 'a case enabled receipt validation');
requireProof(runResult.cases.every((item) => item.bytes_restored && item.baseline_passed && item.pass), 'restoration or post-case baseline failed');

if (writeCatalog) {
  fs.mkdirSync(path.dirname(catalogPath), { recursive: true });
  fs.writeFileSync(catalogPath, catalogBytes);
} else {
  requireProof(fs.existsSync(catalogPath), `mutation catalog missing: ${MUTATION_CATALOG_PATH}; run with --write-catalog`);
  requireProof(fs.readFileSync(catalogPath).equals(catalogBytes),
    `mutation catalog deterministic regeneration differs: ${MUTATION_CATALOG_PATH}; run with --write-catalog`);
}

process.stdout.write(`${JSON.stringify(runResult)}\n`);
