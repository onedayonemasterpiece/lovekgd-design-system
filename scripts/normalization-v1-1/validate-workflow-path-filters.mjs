#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SCHEMA_VERSION = 'project_normalization_workflow_input_paths_v1';
const EXPECTED_WORKFLOW = '.github/workflows/project-normalization-synthesis-v1-1.yml';
const EXPECTED_EVENTS = ['push', 'pull_request'];
const REQUIRED_AUTHORITY_PATTERNS = [
  'contracts/**',
  'catalog/normalization/**',
  'docs/normalization/**',
  'docs/audits/**',
  'receipts/normalization/**',
  'scripts/normalization-v1-1/**',
  'tests/**',
  EXPECTED_WORKFLOW,
];
const AUTHORIZED_PROTOTYPE_PREFIX = 'prototypes/event-media-decision-pack/';

export const isForbiddenProjectNormalizationStopPath = (relative) => (
  /^penpot\//u.test(relative)
  || (/^prototypes\//u.test(relative) && !relative.startsWith(AUTHORIZED_PROTOTYPE_PREFIX))
  || /(^|\/)site\/(src|public)(\/|$)/u.test(relative)
);

export class WorkflowPathFilterError extends Error {
  constructor(code, message) {
    super(`${code}: ${message}`);
    this.name = 'WorkflowPathFilterError';
    this.code = code;
  }
}

const fail = (code, message) => { throw new WorkflowPathFilterError(code, message); };
const assert = (condition, code, message) => { if (!condition) fail(code, message); };
const unique = (values) => new Set(values).size === values.length;

const parseYamlScalar = (raw, lineNumber) => {
  const value = raw.trim();
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
  if (value.startsWith('"') && value.endsWith('"')) {
    try { return JSON.parse(value); }
    catch (error) { fail('PATH_FILTER_YAML_SCALAR_INVALID', `line ${lineNumber}: ${error.message}`); }
  }
  assert(value !== '' && !value.includes(' #'), 'PATH_FILTER_YAML_SCALAR_INVALID', `line ${lineNumber}: paths must use one plain or quoted scalar per line`);
  return value;
};

export const extractEventPaths = (workflowText, eventName) => {
  const lines = workflowText.split(/\r?\n/);
  const eventLine = lines.findIndex((line) => new RegExp(`^ {2}${eventName}:\\s*$`).test(line));
  assert(eventLine >= 0, 'PATH_FILTER_EVENT_MISSING', `workflow event is missing: ${eventName}`);

  let pathsLine = -1;
  for (let index = eventLine + 1; index < lines.length; index += 1) {
    if (/^\S/.test(lines[index]) || /^ {2}\S/.test(lines[index])) break;
    if (/^ {4}paths:\s*$/.test(lines[index])) {
      pathsLine = index;
      break;
    }
  }
  assert(pathsLine >= 0, 'PATH_FILTER_LIST_MISSING', `${eventName}.paths is missing`);

  const paths = [];
  for (let index = pathsLine + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === '' || /^\s*#/.test(line)) continue;
    if (!/^ {6}-\s+/.test(line)) break;
    paths.push(parseYamlScalar(line.replace(/^ {6}-\s+/, ''), index + 1));
  }
  assert(paths.length > 0, 'PATH_FILTER_LIST_EMPTY', `${eventName}.paths is empty`);
  return paths;
};

const assertStringArray = (value, name) => {
  assert(Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string' && item.length > 0), 'INPUT_PATH_REGISTRY_INVALID', `${name} must be a non-empty string array`);
  assert(unique(value), 'INPUT_PATH_REGISTRY_DUPLICATE', `${name} contains a duplicate`);
};

export const validateWorkflowPathFilters = ({ root = '.', registryPath, workflowPath } = {}) => {
  const absoluteRoot = path.resolve(root);
  const registryRelative = registryPath ?? 'contracts/normalization/project-normalization-v1-1-input-paths.json';
  let registry;
  try { registry = JSON.parse(fs.readFileSync(path.join(absoluteRoot, registryRelative), 'utf8')); }
  catch (error) { fail('INPUT_PATH_REGISTRY_UNREADABLE', `${registryRelative}: ${error.message}`); }

  assert(registry && typeof registry === 'object' && !Array.isArray(registry), 'INPUT_PATH_REGISTRY_INVALID', 'registry root must be an object');
  assert(registry.schema_version === SCHEMA_VERSION, 'INPUT_PATH_REGISTRY_SCHEMA_MISMATCH', `expected ${SCHEMA_VERSION}`);
  assert(registry.workflow_path === EXPECTED_WORKFLOW, 'INPUT_PATH_REGISTRY_WORKFLOW_MISMATCH', `workflow_path must be ${EXPECTED_WORKFLOW}`);
  assert(JSON.stringify(registry.trigger_events) === JSON.stringify(EXPECTED_EVENTS), 'INPUT_PATH_REGISTRY_EVENTS_MISMATCH', 'trigger_events must be push and pull_request in canonical order');
  assertStringArray(registry.path_patterns, 'path_patterns');
  assertStringArray(registry.mandatory_authority_patterns, 'mandatory_authority_patterns');
  assert(JSON.stringify(registry.mandatory_authority_patterns) === JSON.stringify(REQUIRED_AUTHORITY_PATTERNS), 'INPUT_PATH_REGISTRY_AUTHORITY_MISMATCH', 'mandatory authority patterns differ from the fail-closed set');

  for (const required of REQUIRED_AUTHORITY_PATTERNS) {
    assert(registry.path_patterns.includes(required), 'INPUT_PATH_REGISTRY_AUTHORITY_OMISSION', `path_patterns omits ${required}`);
  }
  for (const pattern of registry.path_patterns) {
    assert(!pattern.startsWith('!') && !path.posix.isAbsolute(pattern) && !pattern.split('/').includes('..'), 'INPUT_PATH_REGISTRY_UNSAFE_PATTERN', `unsafe path pattern: ${pattern}`);
  }

  const actualWorkflowRelative = workflowPath ?? registry.workflow_path;
  assert(actualWorkflowRelative === registry.workflow_path, 'INPUT_PATH_REGISTRY_WORKFLOW_MISMATCH', 'validated workflow path differs from registry authority');
  const workflowText = fs.readFileSync(path.join(absoluteRoot, actualWorkflowRelative), 'utf8');
  const eventPaths = Object.fromEntries(EXPECTED_EVENTS.map((event) => [event, extractEventPaths(workflowText, event)]));
  for (const event of EXPECTED_EVENTS) {
    assert(unique(eventPaths[event]), 'PATH_FILTER_DUPLICATE', `${event}.paths contains a duplicate`);
    const expected = JSON.stringify(registry.path_patterns);
    const actual = JSON.stringify(eventPaths[event]);
    assert(actual === expected, 'PATH_FILTER_REGISTRY_DRIFT', `${event}.paths differs from the ordered machine registry`);
  }

  return {
    schema_version: SCHEMA_VERSION,
    status: 'PASS',
    workflow_path: registry.workflow_path,
    trigger_events: EXPECTED_EVENTS,
    path_pattern_count: registry.path_patterns.length,
    mandatory_authority_pattern_count: registry.mandatory_authority_patterns.length,
  };
};

const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  const args = process.argv.slice(2);
  const valueAfter = (flag) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : null;
  };
  try {
    const result = validateWorkflowPathFilters({
      root: valueAfter('--root') ?? args.find((arg) => !arg.startsWith('--')) ?? '.',
      registryPath: valueAfter('--registry') ?? undefined,
      workflowPath: valueAfter('--workflow') ?? undefined,
    });
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    const code = error instanceof WorkflowPathFilterError ? error.code : 'PATH_FILTER_UNEXPECTED_ERROR';
    process.stderr.write(`${JSON.stringify({ schema_version: SCHEMA_VERSION, status: 'FAIL', error_code: code, message: error.message })}\n`);
    process.exitCode = 1;
  }
}
