#!/usr/bin/env node

import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const BASE_SHA = '317938bc72cf7a47ea798b2614d92d3d285dd97a';
const EVENTS_SHA = '66bc0d43e36299417626f992021cfb7299ddf704';
const MUTATION_SCHEMA = 'project_normalization_mutation_run_v1';
const MUTATION_RESULT_PATH = 'project-normalization-v1-1-mutation-results.json';
const ATTESTATION_PATH = 'project-normalization-v1-1-execution-attestation.json';
const AUDITS = [
  {
    path: 'docs/audits/project-normalization-synthesis-v1-independent-red-team-audit.md',
    bytes: 8046,
    sha256: 'a466ae5ff4846a1895eb11429c2fe4f175115a119dc9904d5a4a4e50a9507f76',
  },
  {
    path: 'docs/audits/project-normalization-synthesis-v1-1-independent-red-team-reaudit.md',
    bytes: 61775,
    sha256: '7dfdb90abc7798a0c3c69db8d818f16ef803571bcac4ac32b921fd1514db3b41',
  },
];
const REQUIRED_COMMAND_LABELS = [
  'verify-design-bundle',
  'clone-design',
  'checkout-design',
  'verify-events-bundle',
  'clone-events',
  'checkout-events',
  'design-clean-before',
  'events-clean-before',
  'committed-range-diff-check',
  'clone-historical',
  'checkout-historical',
  'validate-historical-v1',
  'validate-workflow-path-filters',
  'test-workflow-path-filters',
  'build-raw-partition',
  'build-registry-readiness',
  'validate-event-media-dossier',
  'validate-medallions-navigation',
  'validate-family-lifecycle',
  'validate-resource-graph',
  'validate-normalization-schemas',
  'validate-current-synthesis',
  'test-registry-readiness',
  'test-event-media-dossier',
  'test-medallions-navigation',
  'test-family-lifecycle',
  'test-evidence-value-gates',
  'test-project-mutations',
  'scan-secrets',
  'design-clean-after',
  'events-clean-after',
];

const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
};
const root = path.resolve(valueAfter('--root') ?? '.');
const eventsRoot = path.resolve(valueAfter('--events-repo') ?? '');
const outputDir = valueAfter('--output-dir') ? path.resolve(valueAfter('--output-dir')) : null;
const sourceSha = valueAfter('--source-sha');
const ledgerPath = valueAfter('--ledger') ? path.resolve(valueAfter('--ledger')) : null;
const mutationResultPath = valueAfter('--mutation-result') ? path.resolve(valueAfter('--mutation-result')) : null;
const verifyInputsOnly = args.includes('--verify-inputs-only');
const requireRunnerVersion = args.includes('--require-actions-runner-version');

const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const read = (absolute) => fs.readFileSync(absolute);
const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const git = (cwd, commandArgs) => childProcess.execFileSync('git', commandArgs, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const commandText = (command, commandArgs = []) => childProcess.execFileSync(command, commandArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const stable = (value) => `${JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.entries(item).sort(([left], [right]) => left.localeCompare(right)))
  : item, 2)}\n`;

const verifyInputs = () => {
  assert(/^[a-f0-9]{40}$/.test(sourceSha ?? ''), 'source SHA must be an exact 40-character Git object ID');
  assert(git(root, ['rev-parse', 'HEAD']) === sourceSha, 'secondary design checkout is not the requested exact source SHA');
  assert(git(eventsRoot, ['rev-parse', 'HEAD']) === EVENTS_SHA, 'secondary events checkout is not the pinned evidence SHA');
  assert(git(eventsRoot, ['rev-parse', 'HEAD^{tree}']) === '72e24f49ad6642915131438de8c56b804c4826b0', 'events source tree differs');
  assert(git(eventsRoot, ['rev-parse', 'HEAD:site/src']) === 'd737458f8a87a9b7dad4f4badffd1b3f4ce544dd', 'events site/src tree differs');
  assert(git(eventsRoot, ['rev-parse', 'HEAD:site/public']) === 'f42a045ec9ff3b1b2f3396a4df9f54cc6a767934', 'events site/public tree differs');

  const audits = AUDITS.map((expected) => {
    const buffer = read(path.join(root, expected.path));
    const actual = { path: expected.path, bytes: buffer.byteLength, sha256: sha256(buffer) };
    assert(actual.bytes === expected.bytes, `${expected.path}: expected ${expected.bytes} bytes, got ${actual.bytes}`);
    assert(actual.sha256 === expected.sha256, `${expected.path}: SHA-256 differs`);
    return { ...actual, byte_exact: true };
  });

  childProcess.execFileSync('git', [
    'diff', '--check', `${BASE_SHA}..${sourceSha}`, '--', '.',
    `:(exclude)${AUDITS[0].path}`,
    `:(exclude)${AUDITS[1].path}`,
  ], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
  const changed = git(root, ['diff', '--name-only', `${BASE_SHA}...${sourceSha}`, '--']).split('\n').filter(Boolean);
  const forbidden = changed.filter((relative) => /^(penpot|prototypes)\//.test(relative) || /(^|\/)site\/(src|public)(\/|$)/.test(relative));
  assert(forbidden.length === 0, `forbidden STOP paths changed: ${forbidden.join(', ')}`);
  assert(git(root, ['status', '--porcelain']) === '', 'secondary design checkout is dirty');
  assert(git(eventsRoot, ['status', '--porcelain']) === '', 'secondary events checkout is dirty');
  return { audits, changed_paths: changed.length, forbidden_paths: forbidden.length };
};

const resolveRunnerVersion = () => {
  if (/^\d+\.\d+\.\d+$/.test(process.env.ACTIONS_RUNNER_VERSION ?? '')) return process.env.ACTIONS_RUNNER_VERSION;
  let pid = process.ppid;
  for (let depth = 0; depth < 12 && pid > 1; depth += 1) {
    try {
      const executable = fs.readlinkSync(`/proc/${pid}/exe`);
      const match = executable.match(/\/runners\/(\d+\.\d+\.\d+)\/bin\/Runner\.(?:Worker|Listener)$/);
      if (match) return match[1];
      const status = fs.readFileSync(`/proc/${pid}/status`, 'utf8');
      pid = Number(status.match(/^PPid:\s+(\d+)$/m)?.[1] ?? 0);
    } catch { break; }
  }
  try {
    const rootEntries = fs.readdirSync('/home/runner/runners', { withFileTypes: true });
    const versions = rootEntries.filter((entry) => entry.isDirectory() && /^\d+\.\d+\.\d+$/.test(entry.name)).map((entry) => entry.name);
    return versions.sort((left, right) => left.localeCompare(right, undefined, { numeric: true })).at(-1) ?? null;
  } catch { return null; }
};

const captureVersions = () => {
  const pythonDetails = JSON.parse(commandText('python3', ['-c', [
    'import importlib.metadata as m, json, platform',
    'names = ["jsonschema", "attrs", "jsonschema-specifications", "referencing", "rpds-py"]',
    'print(json.dumps({"python": platform.python_version(), "packages": {name: m.version(name) for name in names}}, sort_keys=True))',
  ].join('; ')]));
  const requested = {
    node: process.env.NORMALIZATION_NODE_VERSION ?? null,
    python: process.env.NORMALIZATION_PYTHON_VERSION ?? null,
    jsonschema: process.env.NORMALIZATION_JSONSCHEMA_VERSION ?? null,
  };
  const resolved = {
    git: commandText('git', ['--version']).replace(/^git version\s+/, ''),
    node: process.version.replace(/^v/, ''),
    python: pythonDetails.python,
    python_packages: pythonDetails.packages,
  };
  if (requested.node) assert(resolved.node === requested.node, `resolved Node ${resolved.node} differs from requested ${requested.node}`);
  if (requested.python) assert(resolved.python === requested.python, `resolved Python ${resolved.python} differs from requested ${requested.python}`);
  if (requested.jsonschema) assert(resolved.python_packages.jsonschema === requested.jsonschema, `resolved jsonschema ${resolved.python_packages.jsonschema} differs from requested ${requested.jsonschema}`);
  const runnerVersion = resolveRunnerVersion();
  if (requireRunnerVersion) assert(runnerVersion !== null, 'GitHub Actions runner version could not be resolved');
  return {
    schema_version: 'project_normalization_workflow_versions_v1',
    captured_at: new Date().toISOString(),
    requested,
    resolved,
    runner: {
      actions_runner_version: runnerVersion,
      name: process.env.RUNNER_NAME ?? null,
      os: process.env.RUNNER_OS ?? process.platform,
      arch: process.env.RUNNER_ARCH ?? process.arch,
      environment: process.env.RUNNER_ENVIRONMENT ?? null,
      image_os: process.env.ImageOS ?? null,
      image_version: process.env.ImageVersion ?? null,
      runs_on: 'ubuntu-24.04',
    },
  };
};

const parseLedger = () => {
  assert(ledgerPath && fs.existsSync(ledgerPath), 'command ledger is missing');
  const buffer = read(ledgerPath);
  const entries = buffer.toString('utf8').split('\n').filter(Boolean).map((line, index) => {
    try { return JSON.parse(line); }
    catch (error) { fail(`command ledger line ${index + 1}: ${error.message}`); }
  });
  assert(entries.length > 0, 'command ledger is empty');
  assert(entries.every((entry, index) => entry.schema_version === 'project_normalization_command_ledger_entry_v1' && entry.sequence === index + 1), 'command ledger sequence/schema differs');
  assert(new Set(entries.map((entry) => entry.label)).size === entries.length, 'command ledger labels are not unique');
  assert(entries.every((entry) => entry.exit_code === 0 && entry.signal === null), 'one or more replay commands failed');
  for (const label of REQUIRED_COMMAND_LABELS) assert(entries.some((entry) => entry.label === label), `command ledger is missing full replay command: ${label}`);
  for (const label of ['design-clean-before', 'events-clean-before', 'design-clean-after', 'events-clean-after']) {
    const entry = entries.find((item) => item.label === label);
    assert(entry.stdout.bytes === 0, `${label} did not record an empty clean status`);
  }
  return { entries, sha256: sha256(buffer) };
};

const parseMutationRun = () => {
  assert(mutationResultPath && fs.existsSync(mutationResultPath), 'captured mutation result JSON is missing');
  const text = read(mutationResultPath).toString('utf8');
  const lines = text.split('\n').filter((line) => line.trim() !== '');
  assert(lines.length === 1, 'mutation harness stdout must contain exactly one non-empty JSON line');
  const result = JSON.parse(lines[0]);
  assert(result.schema_version === MUTATION_SCHEMA && result.status === 'PASS', 'mutation run schema/status differs');
  assert(result.exact_head_sha === sourceSha, 'mutation run exact_head_sha differs from the replayed source SHA');
  assert(Number.isInteger(result.duration_ms) && result.duration_ms >= 0, 'mutation run duration_ms is invalid');
  assert(result.receipt_validation_enabled === false, 'mutation receipt validation must remain disabled');
  assert(result.catalog_path === 'receipts/normalization/project-normalization-v1-1-mutation-catalog.json', 'mutation catalog path differs');
  assert(/^[a-f0-9]{64}$/.test(result.catalog_sha256 ?? ''), 'mutation catalog SHA-256 is invalid');
  const catalog = read(path.join(root, result.catalog_path));
  assert(sha256(catalog) === result.catalog_sha256, 'captured mutation catalog SHA-256 differs from the exact checkout');
  const catalogDocument = JSON.parse(catalog.toString('utf8'));
  const mandatoryDefinitions = catalogDocument.mandatory_cases;
  const laneDefinitions = catalogDocument.lane_suites;
  assert(Array.isArray(mandatoryDefinitions) && mandatoryDefinitions.length === 14, 'mandatory mutation definition set differs');
  assert(Array.isArray(laneDefinitions) && laneDefinitions.length > 0, 'lane mutation definitions are missing');
  assert(laneDefinitions.every((lane) => lane.negative_count === lane.negative_cases.length
    && lane.positive_baseline_count === lane.positive_baseline_cases.length
    && lane.positive_preservation_count === lane.positive_preservation_cases.length), 'lane mutation definition counts are not derived from their case arrays');
  const derivedLaneNegatives = laneDefinitions.reduce((total, lane) => total + lane.negative_cases.length, 0);
  const derivedPositiveBaselines = laneDefinitions.reduce((total, lane) => total + lane.positive_baseline_cases.length, 0);
  const derivedTotalNegatives = mandatoryDefinitions.length + derivedLaneNegatives;
  const derivedBaselineRechecks = mandatoryDefinitions.length + 1;
  assert(result.total_cases === mandatoryDefinitions.length
    && result.passed_cases === mandatoryDefinitions.length
    && result.failed_cases === 0, 'mandatory mutation case counts differ from the catalog definitions');
  assert(result.lane_negative_mutation_count === derivedLaneNegatives
    && result.positive_baseline_count === derivedPositiveBaselines
    && result.total_negative_mutation_count === derivedTotalNegatives, 'live lane/positive/total mutation counts differ from executable catalog definitions');
  assert(result.baseline_rechecks === derivedBaselineRechecks, 'mutation baseline recheck count differs from the mandatory definition cardinality');
  assert(Array.isArray(result.cases) && result.cases.length === mandatoryDefinitions.length
    && new Set(result.cases.map((item) => item.id)).size === mandatoryDefinitions.length, 'mutation case list cardinality differs');
  assert(JSON.stringify(result.cases.map((item) => item.id)) === JSON.stringify(mandatoryDefinitions.map((item) => item.id)), 'live mutation case order/identity differs from the catalog definitions');
  assert(result.cases.every((item) => typeof item.expected_error_code === 'string' && item.expected_error_code === item.actual_error_code
    && item.targeted_rejected === true && item.aggregate_rejected === true && item.receipt_validation_enabled === false
    && item.bytes_restored === true && item.baseline_passed === true && item.pass === true
    && item.exact_head_sha === sourceSha && Number.isInteger(item.duration_ms) && item.duration_ms >= 0), 'one or more mutation cases lack exact targeted/aggregate code proof');
  return result;
};

try {
  const verified = verifyInputs();
  if (verifyInputsOnly) {
    process.stdout.write(`${JSON.stringify({ schema_version: 'project_normalization_workflow_input_verification_v1', status: 'PASS', source_sha: sourceSha, audits: verified.audits, changed_paths: verified.changed_paths, forbidden_paths: verified.forbidden_paths })}\n`);
  } else {
    assert(outputDir, '--output-dir is required for attestation materialization');
    fs.mkdirSync(outputDir, { recursive: true });
    const versions = captureVersions();
    fs.writeFileSync(path.join(outputDir, 'versions.json'), stable(versions));
    const ledger = parseLedger();
    const mutationRun = parseMutationRun();
    const attestation = {
      schema_version: 'project_normalization_execution_attestation_v1',
      status: 'PASS',
      generated_at: new Date().toISOString(),
      source: {
        repository: 'onedayonemasterpiece/lovekgd-design-system',
        requested_sha: sourceSha,
        checked_out_sha: git(root, ['rev-parse', 'HEAD']),
        clean_before: true,
        clean_after: true,
      },
      product_evidence: {
        repository: 'onedayonemasterpiece/events-bot-new',
        requested_sha: EVENTS_SHA,
        checked_out_sha: git(eventsRoot, ['rev-parse', 'HEAD']),
        clean_before: true,
        clean_after: true,
      },
      audit_inputs: verified.audits,
      runtime_versions_path: 'versions.json',
      command_ledger: {
        path: 'command-ledger.jsonl',
        entries: ledger.entries.length,
        all_exit_zero: true,
        sha256: ledger.sha256,
      },
      mutation_run: mutationRun,
      replay: {
        script: 'replay.sh',
        historical_v1_replayed: true,
        full_current_validators_replayed: true,
        full_negative_suites_replayed: true,
      },
      artifact_integrity: {
        sha256_manifest: 'SHA256SUMS',
        upload_transport_immutability_claimed: false,
        limitation: 'SHA256SUMS verifies downloaded artifact bytes; this attestation makes no claim that the GitHub artifact transport or retention is immutable.',
      },
    };
    fs.writeFileSync(path.join(outputDir, ATTESTATION_PATH), stable(attestation));
    process.stdout.write(`${JSON.stringify({ schema_version: attestation.schema_version, status: attestation.status, source_sha: sourceSha, commands: ledger.entries.length, mutation_cases: mutationRun.total_cases, output: ATTESTATION_PATH })}\n`);
  }
} catch (error) {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
}
