#!/usr/bin/env node
import path from 'node:path';
import { validateApplyComponentSynthesis } from './component-synthesis-v0.1/lib.mjs';
import { ComponentSynthesisValidationError } from './component-synthesis-v0.1/structured-error.mjs';

const args = process.argv.slice(2);
const value = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index === -1 ? fallback : args[index + 1];
};
const root = path.resolve(value('--root', '.'));
const fixtureMode = args.includes('--fixture-mode');
const eventsRepoValue = value('--events-repo', null);
const eventsRepo = eventsRepoValue ? path.resolve(eventsRepoValue) : null;

try {
  const result = validateApplyComponentSynthesis({ root, fixtureMode, eventsRepo });
  const { receipt_document: _, ...report } = result;
  process.stdout.write(`${JSON.stringify(report)}\n`);
} catch (error) {
  const detail = error instanceof ComponentSynthesisValidationError ? error.toJSON() : { name: error.name, code: 'ACS_UNEXPECTED', diagnostic: error.message };
  process.stderr.write(`${JSON.stringify({ status: 'REJECTED', error: detail })}\n`);
  process.exitCode = 1;
}
