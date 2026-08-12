#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs';
import { validateEventMediaPolicy } from './component-synthesis-v0.1/media-policy.mjs';
import { ComponentSynthesisValidationError } from './component-synthesis-v0.1/structured-error.mjs';

const args = process.argv.slice(2);
const root = path.resolve(args[args.indexOf('--root') + 1] || '.');
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const readJsonl = (relative) => fs.readFileSync(path.join(root, relative), 'utf8').trimEnd().split('\n').map(JSON.parse);
try {
  const entities = readJsonl('catalog/normalization/component-synthesis-v0.1/entity-registry.jsonl');
  const plan = readJson('catalog/normalization/component-synthesis-v0.1/penpot-materialization-plan.json');
  const fixtureCatalog = readJson('catalog/normalization/component-synthesis-v0.1/fixtures/fixture-catalog.json');
  const hierarchy = readJson('catalog/normalization/component-synthesis-v0.1/component-hierarchy.json');
  const applications = readJsonl('catalog/normalization/event-media/consumer-requirement-matrix.jsonl').map((row) => row.application_id || row.id);
  const result = validateEventMediaPolicy({ root, applicationRefs: applications, fixtureIds: new Set(fixtureCatalog.fixtures.map((row) => row.fixture_id)), entityIds: new Set(entities.map((row) => row.entity_id)), hierarchyEdges: hierarchy.edges, materializableIds: plan.waves.slice(0, 4).flatMap((row) => row.entity_ids) });
  process.stdout.write(`${JSON.stringify({ status: 'PASS', ...result.counts })}\n`);
} catch (error) {
  const detail = error instanceof ComponentSynthesisValidationError ? error.toJSON() : { name: error.name, code: 'ACS_UNEXPECTED', diagnostic: error.message };
  process.stderr.write(`${JSON.stringify({ status: 'REJECTED', error: detail })}\n`);
  process.exitCode = 1;
}
