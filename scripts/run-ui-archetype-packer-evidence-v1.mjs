#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const PINNED_SHA = '7d4b1d32710f60d65c7eb0dbd084d8cad058b5dc';
const sourceRoot = resolve(process.argv[2] || '');
if (!process.argv[2]) throw new Error('usage: run-ui-archetype-packer-evidence-v1.mjs <pinned-events-bot-checkout>');
const actualSha = execFileSync('git', ['rev-parse', 'HEAD'], {cwd:sourceRoot, encoding:'utf8'}).trim();
if (actualSha !== PINNED_SHA) throw new Error(`events-bot checkout must be pinned to ${PINNED_SHA}; got ${actualSha}`);
const { packRelatedCardRows } = await import(pathToFileURL(resolve(sourceRoot, 'site/src/lib/relatedCardLayout.mjs')).href);
const corpusRoot = resolve(import.meta.dirname, '../catalog/fixtures/ui-reference-events/v1/events');
const inputIds = [7906, 8156, 4327, 6628];
const events = inputIds.map((id) => JSON.parse(readFileSync(resolve(corpusRoot, `event.real.${id}.json`), 'utf8')).preview_event);
const packed = packRelatedCardRows(events, {limit:4, rowSize:3, mediaTreatment:'hybrid'});
const output = {
  input_fixture_ids: inputIds.map((id) => `event.real.${id}`),
  output: packed.map(({item, layout}) => ({fixture_id:`event.real.${item.id}`, layout})),
};
process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
