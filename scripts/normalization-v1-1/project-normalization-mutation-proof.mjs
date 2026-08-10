import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  MANDATORY_VALIDATION_CONTRACTS,
  validateNamedMutationInvariant,
} from './validate-mutation-candidate.mjs';
import {
  NormalizationValidationError,
  structuredValidationError,
} from './structured-validation-error.mjs';

export const MUTATION_CATALOG_PATH = 'receipts/normalization/project-normalization-v1-1-mutation-catalog.json';
export const MUTATION_CATALOG_SCHEMA_PATH = 'contracts/normalization/project-normalization-mutation-catalog.v1.schema.json';
export const MUTATION_RUN_SCHEMA_PATH = 'contracts/normalization/project-normalization-mutation-run.v1.schema.json';
const AGGREGATE_VALIDATOR = 'scripts/validate-project-normalization-synthesis-v1-1.mjs';
const AGGREGATE_ARGS = ['--fixture-mode', '--skip-receipt', '--semantic-only'];

const readRows = (root, relative) => fs.readFileSync(path.join(root, relative), 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const writeRows = (root, relative, rows) => fs.writeFileSync(path.join(root, relative), `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
const readJson = (root, relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const writeJson = (root, relative, value) => fs.writeFileSync(path.join(root, relative), `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const elapsedMilliseconds = (startedAt) => Number((process.hrtime.bigint() - startedAt) / 1_000_000n);

const definitions = [
  {
    id: 'missing-component-path',
    files: ['catalog/normalization/analysis-group-registry.jsonl'],
    mutate: (root) => {
      const rows = readRows(root, 'catalog/normalization/analysis-group-registry.jsonl');
      rows[0].member_component_ids[0] = 'component.missing-path';
      rows[0].member_relations[0].component_id = 'component.missing-path';
      writeRows(root, 'catalog/normalization/analysis-group-registry.jsonl', rows);
    },
  },
  {
    id: 'duplicate-stable-id',
    files: ['catalog/normalization/analysis-group-registry.jsonl'],
    mutate: (root) => {
      const rows = readRows(root, 'catalog/normalization/analysis-group-registry.jsonl');
      rows.push(structuredClone(rows[0]));
      writeRows(root, 'catalog/normalization/analysis-group-registry.jsonl', rows);
    },
  },
  {
    id: 'broken-foreign-key',
    files: ['catalog/normalization/component-applications.jsonl'],
    mutate: (root) => {
      const rows = readRows(root, 'catalog/normalization/component-applications.jsonl');
      rows[0].family_id = 'family.missing';
      writeRows(root, 'catalog/normalization/component-applications.jsonl', rows);
    },
  },
  {
    id: 'missing-raw-identity',
    files: ['catalog/normalization/authoritative-raw-universe.jsonl'],
    mutate: (root) => {
      const rows = readRows(root, 'catalog/normalization/authoritative-raw-universe.jsonl');
      rows.pop();
      writeRows(root, 'catalog/normalization/authoritative-raw-universe.jsonl', rows);
    },
  },
  {
    id: 'duplicate-raw-identity',
    files: ['catalog/normalization/authoritative-raw-universe.jsonl'],
    mutate: (root) => {
      const rows = readRows(root, 'catalog/normalization/authoritative-raw-universe.jsonl');
      rows.push(structuredClone(rows[0]));
      writeRows(root, 'catalog/normalization/authoritative-raw-universe.jsonl', rows);
    },
  },
  {
    id: 'invalid-typed-alias',
    files: ['catalog/normalization/raw-alias-registry.jsonl'],
    mutate: (root) => {
      const rows = readRows(root, 'catalog/normalization/raw-alias-registry.jsonl');
      [rows[0].projection_raw_identity_id, rows[1].projection_raw_identity_id] =
        [rows[1].projection_raw_identity_id, rows[0].projection_raw_identity_id];
      writeRows(root, 'catalog/normalization/raw-alias-registry.jsonl', rows);
    },
  },
  {
    id: 'finding-without-operational-disposition',
    files: ['catalog/normalization/findings-disposition.jsonl'],
    mutate: (root) => {
      const rows = readRows(root, 'catalog/normalization/findings-disposition.jsonl');
      delete rows[0].operational_disposition;
      writeRows(root, 'catalog/normalization/findings-disposition.jsonl', rows);
    },
  },
  {
    id: 'invented-product-id',
    files: ['catalog/normalization/component-applications.jsonl'],
    mutate: (root) => {
      const rows = readRows(root, 'catalog/normalization/component-applications.jsonl');
      rows[0].need_ids = ['need.invented'];
      writeRows(root, 'catalog/normalization/component-applications.jsonl', rows);
    },
  },
  {
    id: 'promotion-ready-while-product-model-pending',
    files: ['catalog/normalization/component-applications.jsonl'],
    mutate: (root) => {
      const rows = readRows(root, 'catalog/normalization/component-applications.jsonl');
      rows[0].promotion_ready = true;
      writeRows(root, 'catalog/normalization/component-applications.jsonl', rows);
    },
  },
  {
    id: 'accepted-experiment-without-decision-receipt',
    files: ['catalog/normalization/component-applications.jsonl'],
    mutate: (root) => {
      const rows = readRows(root, 'catalog/normalization/component-applications.jsonl');
      const row = rows.find((item) => item.value_evidence_mode === 'experimental');
      row.value_evidence_status = 'validated_quantitative';
      row.value_claim = 'invented accepted outcome';
      row.expected_mechanism = 'invented mechanism';
      row.experimental_evidence_satisfied = true;
      row.experimental_evidence_gaps = [];
      row.decision_receipt = null;
      writeRows(root, 'catalog/normalization/component-applications.jsonl', rows);
    },
  },
  {
    id: 'source-only-relabeled-runtime-observed',
    files: ['catalog/normalization/authoritative-raw-universe.jsonl'],
    mutate: (root) => {
      const rows = readRows(root, 'catalog/normalization/authoritative-raw-universe.jsonl');
      const row = rows.find((item) => item.runtime_evidence?.status === 'source_only');
      row.runtime_evidence.status = 'runtime_observed';
      writeRows(root, 'catalog/normalization/authoritative-raw-universe.jsonl', rows);
    },
  },
  {
    id: 'immutable-decoder-v1-mutation',
    files: ['catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/manifest.json'],
    mutate: (root) => fs.appendFileSync(path.join(root,
      'catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/manifest.json'), ' '),
  },
  {
    id: 'incomplete-family-dossier-dimensions',
    files: ['catalog/normalization/families/event-media/dossier.json'],
    mutate: (root) => {
      const dossier = readJson(root, 'catalog/normalization/families/event-media/dossier.json');
      delete dossier.consumer_policy_matrix[0].loading_and_layout;
      writeJson(root, 'catalog/normalization/families/event-media/dossier.json', dossier);
    },
  },
  {
    id: 'first-wave-without-positive-readiness',
    files: ['catalog/normalization/family-wave-plan.json'],
    mutate: (root) => {
      const wave = readJson(root, 'catalog/normalization/family-wave-plan.json');
      wave.first_wave_family_ids = ['family.event-media'];
      wave.families.find((row) => row.family_id === 'family.event-media').selected_first_wave = true;
      writeJson(root, 'catalog/normalization/family-wave-plan.json', wave);
    },
  },
];

const contracts = new Map(MANDATORY_VALIDATION_CONTRACTS.map((contract) => [contract.id, contract]));
export const MANDATORY_MUTATIONS = Object.freeze(definitions.map((definition) => Object.freeze({
  ...definition,
  expected_error_code: contracts.get(definition.id)?.code,
  stage: contracts.get(definition.id)?.stage,
})));

if (MANDATORY_MUTATIONS.some((definition) => !definition.expected_error_code)
  || MANDATORY_MUTATIONS.length !== MANDATORY_VALIDATION_CONTRACTS.length
  || new Set(MANDATORY_MUTATIONS.map((definition) => definition.id)).size !== MANDATORY_MUTATIONS.length) {
  throw new Error('mandatory mutation definitions and validation contracts differ');
}

const source = (root, relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const namedCalls = (contents, callee) => [...contents.matchAll(new RegExp(`^\\s*${callee}\\(\\s*(['\"])([^'\"]+)\\1`, 'gmu'))]
  .map((match) => match[2]);

const namedArrayCases = (contents, declarationName) => {
  const declaration = new RegExp(`(?:const|let)\\s+${declarationName}\\s*=\\s*\\[`, 'u').exec(contents);
  if (!declaration) throw new Error(`case definition array not found: ${declarationName}`);
  const start = declaration.index + declaration[0].lastIndexOf('[');
  let depth = 0;
  let quote = null;
  let escaped = false;
  let end = -1;
  for (let index = start; index < contents.length; index += 1) {
    const character = contents[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (['\'', '"', '`'].includes(character)) { quote = character; continue; }
    if (character === '[') depth += 1;
    if (character === ']') {
      depth -= 1;
      if (depth === 0) { end = index; break; }
    }
  }
  if (end < 0) throw new Error(`unterminated case definition array: ${declarationName}`);
  return [...contents.slice(start + 1, end).matchAll(/^\s*\[\s*(['"])([^'"]+)\1\s*,/gmu)].map((match) => match[2]);
};

const nodeTestCases = (contents) => {
  const matches = [...contents.matchAll(/^test\(\s*(['"])([^'"]+)\1\s*,/gmu)];
  return matches.map((match, index) => {
    const next = matches[index + 1]?.index ?? contents.length;
    const body = contents.slice(match.index, next);
    return { name: match[2], classification: /\brejects\s*\(/u.test(body) ? 'negative_mutation' : 'positive_baseline' };
  });
};

export const discoverLaneMutationDefinitions = (root) => {
  const rawPath = 'scripts/normalization-v1-1/build-raw-partition.mjs';
  const registryPath = 'scripts/normalization-v1-1/build-registry-readiness.mjs';
  const eventMediaPath = 'scripts/normalization-v1-1/test-event-media-dossier-validator.mjs';
  const medallionsPath = 'scripts/validate-project-normalization-v1-1-medallions-navigation.test.mjs';
  const lifecyclePath = 'tests/family-lifecycle-v1-negative.mjs';
  const evidencePath = 'scripts/test-evidence-value-gates-v1-1-negative.mjs';
  const medallionCases = nodeTestCases(source(root, medallionsPath));
  const lifecycle = source(root, lifecyclePath);
  const evidence = source(root, evidencePath);
  const suites = [
    {
      id: 'raw-partition',
      definition_paths: [rawPath],
      classification_method: 'literal expectReject calls are negative mutations',
      negative_cases: namedCalls(source(root, rawPath), 'expectReject'),
      positive_baseline_cases: [],
      positive_preservation_cases: [],
    },
    {
      id: 'registry-readiness',
      definition_paths: [registryPath],
      classification_method: 'literal expectRejected calls are negative mutations',
      negative_cases: namedCalls(source(root, registryPath), 'expectRejected'),
      positive_baseline_cases: [],
      positive_preservation_cases: [],
    },
    {
      id: 'event-media',
      definition_paths: [eventMediaPath],
      classification_method: 'entries in the mutations definition array are negative mutations',
      negative_cases: namedArrayCases(source(root, eventMediaPath), 'mutations'),
      positive_baseline_cases: [],
      positive_preservation_cases: [],
    },
    {
      id: 'medallions-navigation',
      definition_paths: [medallionsPath],
      classification_method: 'node:test cases calling rejects are negative; the remaining validation test is a positive baseline',
      negative_cases: medallionCases.filter((item) => item.classification === 'negative_mutation').map((item) => item.name),
      positive_baseline_cases: medallionCases.filter((item) => item.classification === 'positive_baseline').map((item) => item.name),
      positive_preservation_cases: [],
    },
    {
      id: 'lifecycle',
      definition_paths: [lifecyclePath],
      classification_method: 'entries in mutations and schemaMutations definition arrays are negative mutations',
      negative_cases: [...namedArrayCases(lifecycle, 'mutations'), ...namedArrayCases(lifecycle, 'schemaMutations')],
      positive_baseline_cases: [],
      positive_preservation_cases: [],
    },
    {
      id: 'evidence-product-value',
      definition_paths: [evidencePath],
      classification_method: 'literal reject calls are negative; literal accept calls are positive preservation cases and excluded',
      negative_cases: namedCalls(evidence, 'reject'),
      positive_baseline_cases: [],
      positive_preservation_cases: namedCalls(evidence, 'accept'),
    },
  ];
  for (const suite of suites) {
    const allCaseNames = [...suite.negative_cases, ...suite.positive_baseline_cases, ...suite.positive_preservation_cases];
    if (new Set(allCaseNames).size !== allCaseNames.length) throw new Error(`${suite.id}: duplicate discovered case name`);
  }
  return suites.map((suite) => ({
    ...suite,
    negative_count: suite.negative_cases.length,
    positive_baseline_count: suite.positive_baseline_cases.length,
    positive_preservation_count: suite.positive_preservation_cases.length,
  }));
};

const aggregate = (root) => childProcess.spawnSync(process.execPath, [path.join(root, AGGREGATE_VALIDATOR), root, ...AGGREGATE_ARGS], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 128 * 1024 * 1024,
});

const aggregateDiagnostic = (result) => {
  const combined = `${result.stderr ?? ''}\n${result.stdout ?? ''}`;
  return combined.match(/Error:\s*([^\n]+)/u)?.[1]?.trim()
    ?? combined.split('\n').map((line) => line.trim()).find(Boolean)
    ?? 'aggregate validator exited nonzero';
};

const assertAggregatePass = (result, label) => {
  if (result.status !== 0) throw new Error(`${label}: aggregate baseline failed: ${aggregateDiagnostic(result)}`);
};

const assertAggregateRejected = (result, label) => {
  if (result.error) throw new Error(`${label}: aggregate validator did not spawn: ${result.error.message}`);
  if (result.signal) throw new Error(`${label}: aggregate validator terminated by signal ${result.signal}`);
  if (!Number.isInteger(result.status)) throw new Error(`${label}: aggregate validator returned no exit status`);
  if (result.status === 0) throw new Error(`${label}: aggregate validator accepted the mutation`);
};

const buildCatalog = (laneSuites, caseResults, baselineRechecks) => {
  const laneNegativeMutationCount = laneSuites.reduce((total, suite) => total + suite.negative_count, 0);
  const positiveBaselineCount = laneSuites.reduce((total, suite) => total + suite.positive_baseline_count, 0);
  return {
    $schema: '../../contracts/normalization/project-normalization-mutation-catalog.v1.schema.json',
    schema_version: 'project_normalization_mutation_catalog_v1',
    status: 'PASS',
    receipt_validation_enabled: false,
    aggregate_validator: {
      path: AGGREGATE_VALIDATOR,
      arguments: ['<fixture-root>', ...AGGREGATE_ARGS],
      receipt_disable_flag: '--skip-receipt',
    },
    counts: {
      mandatory_mutation_cases: MANDATORY_MUTATIONS.length,
      mandatory_cases_passed: caseResults.filter((item) => item.pass).length,
      mandatory_cases_failed: caseResults.filter((item) => !item.pass).length,
      lane_negative_mutation_count: laneNegativeMutationCount,
      positive_baseline_count: positiveBaselineCount,
      total_negative_mutation_count: laneNegativeMutationCount + MANDATORY_MUTATIONS.length,
      baseline_rechecks: baselineRechecks,
    },
    lane_suites: laneSuites,
    mandatory_cases: caseResults.map(({ exact_head_sha: _exactHead, duration_ms: _duration, ...item }) => item),
  };
};

export const serializeMutationCatalog = (catalog) => `${JSON.stringify(catalog, null, 2)}\n`;

export const runMutationProof = (sourceRoot) => {
  const runStartedAt = process.hrtime.bigint();
  const root = path.resolve(sourceRoot);
  const exactHeadSha = childProcess.execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (!/^[0-9a-f]{40}$/u.test(exactHeadSha)) throw new Error(`invalid exact head SHA: ${exactHeadSha}`);
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'normalization-v1-1-mutation-proof-'));
  const fixture = path.join(temporary, 'repo');
  let baselineRechecks = 0;
  const caseResults = [];
  try {
    childProcess.execFileSync('cp', ['-a', '--reflink=auto', `${root}/.`, fixture]);
    for (const definition of MANDATORY_MUTATIONS) validateNamedMutationInvariant(fixture, definition.id);
    assertAggregatePass(aggregate(fixture), 'initial');
    baselineRechecks += 1;

    for (const definition of MANDATORY_MUTATIONS) {
      const caseStartedAt = process.hrtime.bigint();
      const originals = new Map(definition.files.map((relative) => [relative, fs.readFileSync(path.join(fixture, relative))]));
      let actualError = null;
      let aggregateResult;
      try {
        definition.mutate(fixture);
        try {
          validateNamedMutationInvariant(fixture, definition.id);
        } catch (error) {
          if (!(error instanceof NormalizationValidationError)) throw error;
          actualError = structuredValidationError(error);
        }
        if (!actualError) throw new Error(`${definition.id}: targeted candidate validator accepted the mutation`);
        aggregateResult = aggregate(fixture);
        assertAggregateRejected(aggregateResult, definition.id);
      } finally {
        for (const [relative, contents] of originals) fs.writeFileSync(path.join(fixture, relative), contents);
      }

      const bytesRestored = [...originals].every(([relative, contents]) => fs.readFileSync(path.join(fixture, relative)).equals(contents));
      if (!bytesRestored) throw new Error(`${definition.id}: mutated bytes were not restored exactly`);
      validateNamedMutationInvariant(fixture, definition.id);
      assertAggregatePass(aggregate(fixture), `${definition.id} post-restore`);
      baselineRechecks += 1;

      const codeMatch = actualError.code === definition.expected_error_code;
      if (!codeMatch) {
        throw new Error(`${definition.id}: expected ${definition.expected_error_code}, actual ${actualError.code}`);
      }
      caseResults.push({
        id: definition.id,
        exact_head_sha: exactHeadSha,
        duration_ms: elapsedMilliseconds(caseStartedAt),
        mutation_files: definition.files,
        expected_error_code: definition.expected_error_code,
        actual_error_code: actualError.code,
        error: actualError,
        named_proof_source: 'targeted_candidate_validator',
        aggregate_diagnostic_counted_as_named_proof: false,
        targeted_rejected: true,
        aggregate_rejected: true,
        receipt_validation_enabled: false,
        bytes_restored: bytesRestored,
        baseline_passed: true,
        pass: codeMatch && bytesRestored,
      });
    }
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }

  const laneSuites = discoverLaneMutationDefinitions(root);
  const catalog = buildCatalog(laneSuites, caseResults, baselineRechecks);
  const catalogBytes = Buffer.from(serializeMutationCatalog(catalog));
  const runResult = {
    schema_version: 'project_normalization_mutation_run_v1',
    status: catalog.status,
    receipt_validation_enabled: false,
    exact_head_sha: exactHeadSha,
    duration_ms: elapsedMilliseconds(runStartedAt),
    catalog_path: MUTATION_CATALOG_PATH,
    catalog_sha256: sha256(catalogBytes),
    total_cases: caseResults.length,
    passed_cases: caseResults.filter((item) => item.pass).length,
    failed_cases: caseResults.filter((item) => !item.pass).length,
    lane_negative_mutation_count: catalog.counts.lane_negative_mutation_count,
    positive_baseline_count: catalog.counts.positive_baseline_count,
    total_negative_mutation_count: catalog.counts.total_negative_mutation_count,
    baseline_rechecks: baselineRechecks,
    cases: caseResults.map((item) => ({
      id: item.id,
      exact_head_sha: item.exact_head_sha,
      duration_ms: item.duration_ms,
      expected_error_code: item.expected_error_code,
      actual_error_code: item.actual_error_code,
      targeted_rejected: item.targeted_rejected,
      aggregate_rejected: item.aggregate_rejected,
      receipt_validation_enabled: item.receipt_validation_enabled,
      bytes_restored: item.bytes_restored,
      baseline_passed: item.baseline_passed,
      pass: item.pass,
    })),
  };
  return { catalog, catalogBytes, runResult };
};
