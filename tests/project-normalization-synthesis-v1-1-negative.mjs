#!/usr/bin/env node

import childProcess from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(process.argv[2] ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'normalization-v1-1-negative-'));
const fixture = path.join(temporary, 'repo');
childProcess.execFileSync('cp', ['-a', '--reflink=auto', `${root}/.`, fixture]);

const validator = path.join(fixture, 'scripts/validate-project-normalization-synthesis-v1-1.mjs');
const run = (semanticOnly = false) => childProcess.execFileSync(process.execPath, [validator, fixture, '--fixture-mode', '--skip-receipt', ...(semanticOnly ? ['--semantic-only'] : [])], {
  cwd: fixture,
  encoding: 'utf8',
  stdio: 'pipe',
  maxBuffer: 128 * 1024 * 1024,
});
const readRows = (relative) => fs.readFileSync(path.join(fixture, relative), 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const writeRows = (relative, rows) => fs.writeFileSync(path.join(fixture, relative), `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(fixture, relative), 'utf8'));
const writeJson = (relative, value) => fs.writeFileSync(path.join(fixture, relative), `${JSON.stringify(value, null, 2)}\n`);

const cases = [
  {
    id: 'missing-component-path',
    files: ['catalog/normalization/analysis-group-registry.jsonl'],
    mutate: () => {
      const rows = readRows('catalog/normalization/analysis-group-registry.jsonl');
      rows[0].member_component_ids[0] = 'component.missing-path';
      rows[0].member_relations[0].component_id = 'component.missing-path';
      writeRows('catalog/normalization/analysis-group-registry.jsonl', rows);
    },
  },
  {
    id: 'duplicate-stable-id',
    files: ['catalog/normalization/analysis-group-registry.jsonl'],
    mutate: () => {
      const rows = readRows('catalog/normalization/analysis-group-registry.jsonl');
      rows.push(structuredClone(rows[0]));
      writeRows('catalog/normalization/analysis-group-registry.jsonl', rows);
    },
  },
  {
    id: 'broken-foreign-key',
    files: ['catalog/normalization/component-applications.jsonl'],
    mutate: () => {
      const rows = readRows('catalog/normalization/component-applications.jsonl');
      rows[0].family_id = 'family.missing';
      writeRows('catalog/normalization/component-applications.jsonl', rows);
    },
  },
  {
    id: 'missing-raw-identity',
    files: ['catalog/normalization/authoritative-raw-universe.jsonl'],
    mutate: () => {
      const rows = readRows('catalog/normalization/authoritative-raw-universe.jsonl');
      rows.pop();
      writeRows('catalog/normalization/authoritative-raw-universe.jsonl', rows);
    },
  },
  {
    id: 'duplicate-raw-identity',
    files: ['catalog/normalization/authoritative-raw-universe.jsonl'],
    mutate: () => {
      const rows = readRows('catalog/normalization/authoritative-raw-universe.jsonl');
      rows.push(structuredClone(rows[0]));
      writeRows('catalog/normalization/authoritative-raw-universe.jsonl', rows);
    },
  },
  {
    id: 'invalid-typed-alias',
    files: ['catalog/normalization/raw-alias-registry.jsonl'],
    mutate: () => {
      const rows = readRows('catalog/normalization/raw-alias-registry.jsonl');
      [rows[0].projection_raw_identity_id, rows[1].projection_raw_identity_id] = [rows[1].projection_raw_identity_id, rows[0].projection_raw_identity_id];
      writeRows('catalog/normalization/raw-alias-registry.jsonl', rows);
    },
  },
  {
    id: 'finding-without-operational-disposition',
    files: ['catalog/normalization/findings-disposition.jsonl'],
    mutate: () => {
      const rows = readRows('catalog/normalization/findings-disposition.jsonl');
      delete rows[0].operational_disposition;
      writeRows('catalog/normalization/findings-disposition.jsonl', rows);
    },
  },
  {
    id: 'invented-product-id',
    files: ['catalog/normalization/component-applications.jsonl'],
    mutate: () => {
      const rows = readRows('catalog/normalization/component-applications.jsonl');
      rows[0].need_ids = ['need.invented'];
      writeRows('catalog/normalization/component-applications.jsonl', rows);
    },
  },
  {
    id: 'promotion-ready-while-product-model-pending',
    files: ['catalog/normalization/component-applications.jsonl'],
    mutate: () => {
      const rows = readRows('catalog/normalization/component-applications.jsonl');
      rows[0].promotion_ready = true;
      writeRows('catalog/normalization/component-applications.jsonl', rows);
    },
  },
  {
    id: 'accepted-experiment-without-decision-receipt',
    files: ['catalog/normalization/component-applications.jsonl'],
    mutate: () => {
      const rows = readRows('catalog/normalization/component-applications.jsonl');
      const row = rows.find((item) => item.value_evidence_mode === 'experimental');
      row.value_evidence_status = 'validated_quantitative';
      row.value_claim = 'invented accepted outcome';
      row.expected_mechanism = 'invented mechanism';
      row.experimental_evidence_satisfied = true;
      row.experimental_evidence_gaps = [];
      row.decision_receipt = null;
      writeRows('catalog/normalization/component-applications.jsonl', rows);
    },
  },
  {
    id: 'source-only-relabeled-runtime-observed',
    files: ['catalog/normalization/authoritative-raw-universe.jsonl'],
    mutate: () => {
      const rows = readRows('catalog/normalization/authoritative-raw-universe.jsonl');
      const row = rows.find((item) => item.runtime_evidence?.status === 'source_only');
      row.runtime_evidence.status = 'runtime_observed';
      writeRows('catalog/normalization/authoritative-raw-universe.jsonl', rows);
    },
  },
  {
    id: 'immutable-decoder-v1-mutation',
    files: ['catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/manifest.json'],
    mutate: () => fs.appendFileSync(path.join(fixture, 'catalog/component-decoder/decoder-v1-snapshot-20260808T124842-4786ac53bc/manifest.json'), ' '),
  },
  {
    id: 'incomplete-family-dossier-dimensions',
    files: ['catalog/normalization/families/event-media/dossier.json'],
    mutate: () => {
      const dossier = readJson('catalog/normalization/families/event-media/dossier.json');
      delete dossier.consumer_policy_matrix[0].loading_and_layout;
      writeJson('catalog/normalization/families/event-media/dossier.json', dossier);
    },
  },
  {
    id: 'first-wave-without-positive-readiness',
    files: ['catalog/normalization/family-wave-plan.json'],
    mutate: () => {
      const wave = readJson('catalog/normalization/family-wave-plan.json');
      wave.first_wave_family_ids = ['family.event-media'];
      wave.families.find((row) => row.family_id === 'family.event-media').selected_first_wave = true;
      writeJson('catalog/normalization/family-wave-plan.json', wave);
    },
  },
];

const rejected = [];
try {
  run();
  for (const test of cases) {
    const originals = new Map(test.files.map((relative) => [relative, fs.readFileSync(path.join(fixture, relative))]));
    test.mutate();
    let failed = false;
    try { run(true); }
    catch { failed = true; }
    for (const [relative, contents] of originals) fs.writeFileSync(path.join(fixture, relative), contents);
    if (!failed) throw new Error(`semantic mutation was accepted: ${test.id}`);
    rejected.push(test.id);
  }
  run();
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}

if (rejected.length !== 14 || new Set(rejected).size !== rejected.length) throw new Error('negative mutation suite cardinality mismatch');
process.stdout.write(`${JSON.stringify({ status: 'valid', semantic_mutations_rejected: rejected.length, mutations: rejected })}\n`);
