#!/usr/bin/env node

import assert from 'node:assert/strict';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  WorkflowPathFilterError,
  extractEventPaths,
  validateWorkflowPathFilters,
} from '../scripts/normalization-v1-1/validate-workflow-path-filters.mjs';
import { captureRunnerProvenance } from '../scripts/normalization-v1-1/runner-version-provenance.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryRelative = 'contracts/normalization/project-normalization-v1-1-input-paths.json';
const workflowRelative = '.github/workflows/project-normalization-synthesis-v1-1.yml';

const fixture = () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'normalization-workflow-paths-'));
  fs.mkdirSync(path.join(temporary, path.dirname(registryRelative)), { recursive: true });
  fs.mkdirSync(path.join(temporary, path.dirname(workflowRelative)), { recursive: true });
  fs.copyFileSync(path.join(root, registryRelative), path.join(temporary, registryRelative));
  fs.copyFileSync(path.join(root, workflowRelative), path.join(temporary, workflowRelative));
  return temporary;
};

const expectCode = (callback, code) => assert.throws(callback, (error) => error instanceof WorkflowPathFilterError && error.code === code);

test('committed push and pull_request filters equal the machine registry', () => {
  const result = validateWorkflowPathFilters({ root });
  assert.equal(result.status, 'PASS');
  assert.equal(result.trigger_events.length, 2);
});

test('replay workflow binds the branch head and every events census source object', () => {
  const workflow = fs.readFileSync(path.join(root, workflowRelative), 'utf8');
  assert.match(workflow, /NORMALIZATION_SOURCE_SHA:\s*\$\{\{ github\.event\.pull_request\.head\.sha \|\| github\.sha \}\}/u);
  assert.doesNotMatch(workflow, /git -C "\$events_source" fetch[^\n]*--depth(?:=|\s)/u);
  for (const sha of [
    '66bc0d43e36299417626f992021cfb7299ddf704',
    '5a9d804438377f65fe4b26bd7019e73626529864',
    'ef7aa62e45c60f7a12da6160f490719c0721ec03',
  ]) {
    assert.match(workflow, new RegExp(sha, 'u'));
  }
  assert.match(workflow, /git -C "\$events_source" cat-file -e "\$NORMALIZATION_CURRENT_ROOT_SHA\^\{commit\}"/u);
  assert.match(workflow, /git -C "\$events_source" cat-file -e "\$NORMALIZATION_BEHAVIORAL_SOURCE_SHA\^\{commit\}"/u);
  for (const context of ['name', 'os', 'arch', 'environment']) {
    assert.match(workflow, new RegExp(`NORMALIZATION_RUNNER_[A-Z]+: \\$\\{\\{ runner\\.${context} \\}\\}`, 'u'));
  }
});

test('hosted runner provenance is truthful when semantic runner version is not exposed', () => {
  const runner = captureRunnerProvenance({
    env: {
      GITHUB_ACTIONS: 'true',
      NORMALIZATION_RUNNER_NAME: 'GitHub Actions 1000000000',
      NORMALIZATION_RUNNER_OS: 'Linux',
      NORMALIZATION_RUNNER_ARCH: 'X64',
      NORMALIZATION_RUNNER_ENVIRONMENT: 'github-hosted',
      ImageOS: 'ubuntu24',
      ImageVersion: '20260805.1',
      NORMALIZATION_RUNS_ON: 'ubuntu-24.04',
    },
    resolvedVersion: null,
    requireActionsContext: true,
  });
  assert.equal(runner.actions_runner_version, null);
  assert.equal(runner.version_resolution_status, 'not_exposed_by_hosted_runner');
  assert.equal(runner.image_os, 'ubuntu24');
  assert.equal(runner.image_version, '20260805.1');
});

test('hosted runner provenance rejects incomplete image identity', () => {
  assert.throws(() => captureRunnerProvenance({
    env: {
      GITHUB_ACTIONS: 'true',
      NORMALIZATION_RUNNER_NAME: 'GitHub Actions 1000000000',
      NORMALIZATION_RUNNER_OS: 'Linux',
      NORMALIZATION_RUNNER_ARCH: 'X64',
      NORMALIZATION_RUNNER_ENVIRONMENT: 'github-hosted',
      ImageOS: 'ubuntu24',
      NORMALIZATION_RUNS_ON: 'ubuntu-24.04',
    },
    resolvedVersion: null,
    requireActionsContext: true,
  }), /runner provenance field is missing: image_version/u);
});

test('a required contracts authority omission is rejected in one event', () => {
  const temporary = fixture();
  try {
    const workflow = path.join(temporary, workflowRelative);
    const text = fs.readFileSync(workflow, 'utf8');
    const pullRequestIndex = text.indexOf('  pull_request:');
    const before = text.slice(0, pullRequestIndex).replace("      - 'contracts/**'\n", '');
    fs.writeFileSync(workflow, before + text.slice(pullRequestIndex));
    expectCode(() => validateWorkflowPathFilters({ root: temporary }), 'PATH_FILTER_REGISTRY_DRIFT');
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test('a required tests authority omission is rejected in pull_request', () => {
  const temporary = fixture();
  try {
    const workflow = path.join(temporary, workflowRelative);
    const text = fs.readFileSync(workflow, 'utf8');
    const pullRequestIndex = text.indexOf('  pull_request:');
    fs.writeFileSync(workflow, text.slice(0, pullRequestIndex) + text.slice(pullRequestIndex).replace("      - 'tests/**'\n", ''));
    expectCode(() => validateWorkflowPathFilters({ root: temporary }), 'PATH_FILTER_REGISTRY_DRIFT');
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test('duplicate workflow patterns are rejected', () => {
  const temporary = fixture();
  try {
    const workflow = path.join(temporary, workflowRelative);
    const text = fs.readFileSync(workflow, 'utf8').replace("      - 'contracts/**'\n", "      - 'contracts/**'\n      - 'contracts/**'\n");
    fs.writeFileSync(workflow, text);
    expectCode(() => validateWorkflowPathFilters({ root: temporary }), 'PATH_FILTER_DUPLICATE');
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test('registry cannot weaken the mandatory authority set', () => {
  const temporary = fixture();
  try {
    const registryPath = path.join(temporary, registryRelative);
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    registry.mandatory_authority_patterns = registry.mandatory_authority_patterns.filter((pattern) => pattern !== 'docs/audits/**');
    fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
    expectCode(() => validateWorkflowPathFilters({ root: temporary }), 'INPUT_PATH_REGISTRY_AUTHORITY_MISMATCH');
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test('parser fails closed when an event paths block is absent', () => {
  expectCode(() => extractEventPaths('on:\n  push:\n    branches: [main]\n', 'push'), 'PATH_FILTER_LIST_MISSING');
});

test('workflow command ledger records stdout integrity and the exact exit code', () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'normalization-command-ledger-'));
  try {
    const ledger = path.join(temporary, 'command-ledger.jsonl');
    const logs = path.join(temporary, 'logs');
    const captured = path.join(temporary, 'result.json');
    const ledgerTool = path.join(root, 'scripts/normalization-v1-1/workflow-command-ledger.mjs');
    const success = childProcess.spawnSync(process.execPath, [
      ledgerTool,
      '--ledger', ledger,
      '--logs-dir', logs,
      '--label', 'capture-success',
      '--cwd', root,
      '--cwd-label', 'design',
      '--stdout-file', captured,
      '--', process.execPath, '-e', 'process.stdout.write(JSON.stringify({status:"PASS"})+"\\n")',
    ], { encoding: 'utf8' });
    assert.equal(success.status, 0);
    assert.equal(fs.readFileSync(captured, 'utf8'), '{"status":"PASS"}\n');

    const failure = childProcess.spawnSync(process.execPath, [
      ledgerTool,
      '--ledger', ledger,
      '--logs-dir', logs,
      '--label', 'capture-failure',
      '--cwd', root,
      '--cwd-label', 'design',
      '--', process.execPath, '-e', 'process.exit(7)',
    ], { encoding: 'utf8' });
    assert.equal(failure.status, 7);

    const rows = fs.readFileSync(ledger, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
    assert.deepEqual(rows.map((row) => row.exit_code), [0, 7]);
    assert.deepEqual(rows.map((row) => row.sequence), [1, 2]);
    assert.equal(rows[0].stdout.bytes, Buffer.byteLength('{"status":"PASS"}\n'));
    assert.match(rows[0].stdout.sha256, /^[a-f0-9]{64}$/);
    assert.equal(Object.hasOwn(rows[0], 'env'), false);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});
