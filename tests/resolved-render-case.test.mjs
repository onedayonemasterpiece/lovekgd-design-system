import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';
import { projectResolvedCase } from '../scripts/ui_conformance/project-free-collection-resolved-case.mjs';

const require = createRequire(import.meta.url);
const { loadResolvedCaseIndex, sha256 } = require('../scripts/round-trip-reconstruction/resolved-case-loader.js');
const root = path.resolve(import.meta.dirname, '..');
const indexPath = 'catalog/ui-conformance/free-collection/g4/resolved/resolved-cases.index.json';
const indexFileSha256 = sha256(fs.readFileSync(path.join(root, indexPath)));
const planPath = path.join(root, 'catalog/ui-conformance/free-collection/g4/evidence-plan.json');
const plan = JSON.parse(fs.readFileSync(planPath));

function validatePlan(document) {
  assert.equal(document.schema, 'kenigevents.free-collection-evidence-plan.v1');
  assert.equal(document.control_generation, 4);
  assert.deepEqual(document.levels, ['L0_ASSETS','L1_LEAVES','L2_EVENTCARD','L3_ROWS_AND_GROUPS','L4_SHELL','L5_FULL_PAGE']);
  const allowed = new Set(['DIRECT_CASE','REGION_PROOF_FROM_PARENT_CASE','NONVISUAL_PROOF','NOT_APPLICABLE']);
  assert.equal(new Set(document.cases.map((entry) => entry.case_id)).size, document.cases.length);
  for (const node of document.material_nodes) {
    assert.ok(allowed.has(node.proof.mode), `${node.node_id}:${node.proof.mode}`);
    if (node.proof.mode === 'NOT_APPLICABLE') {
      assert.ok(node.proof.reason_code);
      assert.ok(node.proof.reason);
    }
    if (node.proof.mode === 'DIRECT_CASE') assert.ok(document.cases.some((entry) => entry.case_id === node.proof.case_id));
    if (node.proof.mode === 'REGION_PROOF_FROM_PARENT_CASE') {
      for (const key of ['parent_case_id','region_selector','geometry_contract_ref','evidence_artifact_ref','source_candidate_tuple']) assert.ok(node.proof[key], `${node.node_id}:${key}`);
    }
  }
}

test('evidence plan covers exact L0-L5 levels with one allowed proof mode per node', () => validatePlan(plan));
test('deterministic generator reproduces byte-stable cases and index', () => {
  const output = execFileSync(process.execPath, ['scripts/ui_conformance/generate-free-collection-resolved-cases.mjs', '--astro-root', '/home/dev/projects/events-bot-new', '--check'], { cwd: root, encoding: 'utf8' });
  assert.match(output, /^10 resolved cases; index=[a-f0-9]{64}/u);
});
test('UI SoT projection consumes the indexed resolved case and preserves its payload hash', () => {
  const caseId = 'eventcard.desktop-wide-calendar.8006';
  const loaded = loadResolvedCaseIndex(root, indexPath, indexFileSha256, [caseId]);
  const projected = projectResolvedCase({ root, indexPath, indexFileSha256, caseId });
  assert.equal(projected.resolved_case_content_sha256, loaded.cases[caseId].content_sha256);
  assert.equal(projected.resolved_case_index_sha256, loaded.payloadHash);
  assert.deepEqual(projected.payload, loaded.cases[caseId].payload);
});
test('resolved-case file or binding mismatch fails closed', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'resolved-case-negative-'));
  const copiedRoot = path.join(temp, 'catalog/ui-conformance/free-collection/g4/resolved');
  fs.mkdirSync(path.dirname(copiedRoot), { recursive: true });
  fs.cpSync(path.join(root, 'catalog/ui-conformance/free-collection/g4/resolved'), copiedRoot, { recursive: true });
  const copiedIndex = path.join(copiedRoot, 'resolved-cases.index.json');
  const index = JSON.parse(fs.readFileSync(copiedIndex));
  const target = path.join(temp, index.cases[0].resolved_case_path);
  fs.appendFileSync(target, ' ');
  assert.throws(() => loadResolvedCaseIndex(temp, 'catalog/ui-conformance/free-collection/g4/resolved/resolved-cases.index.json', sha256(fs.readFileSync(copiedIndex)), [index.cases[0].case_id]), /RESOLVED_CASE_FILE_HASH_MISMATCH/u);
});
test('materializer and projection contain no independently authored visual payload', () => {
  const files = [
    'scripts/round-trip-reconstruction/materialization-execution-kernel.js',
    'scripts/round-trip-reconstruction/penpot-materialize-event-card-unified-golden-v2.js',
    'scripts/round-trip-reconstruction/penpot-materialize-free-collection-september-v2.js',
    'scripts/ui_conformance/project-free-collection-resolved-case.mjs',
  ];
  const forbidden = [String.raw`const\s+EVENTS\s*=`, String.raw`const\s+GEOMETRY\s*=`, 'static.kenigevents.ru/', 'event.real.8006.*title', 'recommended_hero_fit.*:'];
  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    for (const pattern of forbidden) assert.doesNotMatch(source, new RegExp(pattern, 'u'), `${file}:${pattern}`);
  }
});
test('an unrecognized coverage mode is rejected', () => {
  const bad = structuredClone(plan);
  bad.material_nodes[0].proof.mode = ['COVERED', 'BY', 'PAGE'].join('_');
  assert.throws(() => validatePlan(bad));
});
