#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const workflowPath = '.github/workflows/event-media-contract-decision-v1.yml';
const workflow = fs.readFileSync(path.join(root, workflowPath), 'utf8');
const replay = fs.readFileSync(path.join(root, 'scripts/normalization-v1-1/replay-normalization-workflow.sh'), 'utf8');

const eventPaths = (event) => {
  const lines = workflow.split(/\r?\n/u);
  const eventIndex = lines.findIndex((line) => line === `  ${event}:`);
  assert.notEqual(eventIndex, -1, `${event} event missing`);
  const pathsIndex = lines.findIndex((line, index) => index > eventIndex && line === '    paths:');
  assert.notEqual(pathsIndex, -1, `${event}.paths missing`);
  const result = [];
  for (let index = pathsIndex + 1; index < lines.length; index += 1) {
    const match = lines[index].match(/^      - '([^']+)'$/u);
    if (!match) break;
    result.push(match[1]);
  }
  return result;
};

const globRegex = (pattern) => {
  let source = '';
  for (let index = 0; index < pattern.length; index += 1) {
    if (pattern.slice(index, index + 2) === '**') { source += '.*'; index += 1; }
    else if (pattern[index] === '*') source += '[^/]*';
    else source += pattern[index].replace(/[|\\{}()[\]^$+?.]/gu, '\\$&');
  }
  return new RegExp(`^${source}$`, 'u');
};
const covered = (patterns, relative) => patterns.some((pattern) => globRegex(pattern).test(relative));

const push = eventPaths('push');
const pullRequest = eventPaths('pull_request');
assert.deepEqual(push, pullRequest, 'push and pull_request path filters must be byte-equivalent');
assert.equal(new Set(push).size, push.length, 'path filters must not contain duplicates');

const requiredInputs = [
  '.codex/lanes/event-media-validation/RESULTS.md',
  '.github/workflows/event-media-contract-decision-v1.yml',
  '.github/workflows/project-normalization-synthesis-v1-1.yml',
  'catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/manifest.json',
  'catalog/component-decoder/behavioral-supplement-v1.1-snapshot-20260808T124842-4786ac53bc/experiment-registry.jsonl',
  'catalog/normalization/event-media/consumer-requirement-matrix.jsonl',
  'catalog/normalization/event-media/semantic-media-types.jsonl',
  'catalog/normalization/event-media/boundary-model.jsonl',
  'catalog/normalization/event-media/blocker-closure.jsonl',
  'catalog/normalization/event-media/alternatives-and-recommendations.jsonl',
  'catalog/normalization/event-media/readiness.jsonl',
  'catalog/normalization/event-media/owner-decision-queue.jsonl',
  'catalog/normalization/event-media/candidate-contracts/candidate.event-primary-media.json',
  'catalog/normalization/families/event-media/dossier.json',
  'catalog/normalization/semantic-readiness.jsonl',
  'catalog/normalization/family-wave-plan.json',
  'catalog/normalization/component-applications.jsonl',
  'catalog/normalization/product-value-readiness.jsonl',
  'contracts/normalization/event-media-boundary-model.v1.json',
  'contracts/normalization/event-media-candidate-contract.v1.schema.json',
  'contracts/normalization/event-media-contract-decision-catalog.v1.schema.json',
  'contracts/normalization/event-media-contract-decision-receipt.v1.schema.json',
  'docs/index.md',
  'docs/normalization/event-media-boundary-and-contract-decision-v1.md',
  'penpot/file.json',
  'prototypes/event-media/index.html',
  'receipts/normalization/event-media-contract-decision-v1.json',
  'scripts/event-media-contract-decision-v1/lib.mjs',
  'scripts/build-event-media-contract-decision-v1-receipt.mjs',
  'scripts/validate-event-media-contract-decision-v1.mjs',
  'scripts/validate-event-media-contract-decision-schemas-v1.py',
  'scripts/normalization-v1-1/replay-normalization-workflow.sh',
  'tests/event-media-contract-decision-v1-negative.mjs',
  'tests/event-media-contract-decision-v1-workflow-path-filters.mjs',
];
for (const relative of requiredInputs) assert.ok(covered(push, relative), `workflow path filters omit ${relative}`);

assert.match(workflow, /actions\/checkout@11bd71901bbe5b1630ceea73d27597364c9af683/u);
assert.match(workflow, /actions\/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020/u);
assert.match(workflow, /actions\/setup-python@8d9ed9ac5c53483de85588cdf95a591a75ab9f55/u);
assert.match(workflow, /EVENT_MEDIA_NODE_VERSION: '22\.18\.0'/u);
assert.match(workflow, /EVENT_MEDIA_PYTHON_VERSION: '3\.13\.7'/u);
assert.match(workflow, /EVENT_MEDIA_JSONSCHEMA_VERSION: '4\.25\.1'/u);
assert.match(workflow, /45288b001d724e0d3603d0c44d392ff370407bd0/u);
assert.match(workflow, /66bc0d43e36299417626f992021cfb7299ddf704/u);
assert.match(workflow, /fetch --no-tags origin "\$EVENT_MEDIA_EVENTS_SHA"/u);
assert.doesNotMatch(workflow, /fetch[^\n]*--depth/u);
assert.doesNotMatch(workflow, /pull_request_target|secrets\.|permissions:\s*write|gh pr merge|git push|deploy/iu);
assert.match(workflow, /persist-credentials: false/u);

assert.match(replay, /EVENT_MEDIA_RECEIPT_FROZEN_SHA='45288b001d724e0d3603d0c44d392ff370407bd0'/u);
const frozenStart = replay.indexOf('run validate-event-media-receipt-frozen');
const currentStart = replay.indexOf('run validate-current-synthesis');
assert.ok(frozenStart > 0 && currentStart > frozenStart, 'legacy bridge commands are missing or out of order');
const frozenCommand = replay.slice(frozenStart, currentStart);
const currentCommand = replay.slice(currentStart, replay.indexOf('\n\n', currentStart));
assert.doesNotMatch(frozenCommand, /--skip-receipt/u, 'frozen proof must keep receipt validation enabled');
assert.match(currentCommand, /--skip-receipt/u, 'current-head legacy replay must explicitly skip only the frozen receipt');

console.log(JSON.stringify({ status: 'valid', workflow: workflowPath, path_patterns: push.length, required_inputs: requiredInputs.length, pinned_actions: 3, legacy_bridge: 'frozen-receipt-enabled-plus-current-semantic-skip' }));
