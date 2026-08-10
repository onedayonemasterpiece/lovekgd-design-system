#!/usr/bin/env node
import childProcess from 'node:child_process';
import path from 'node:path';

import { collectAndValidate, RECEIPT_PATH } from './event-media-contract-decision-v1/lib.mjs';
import { buildReceipt, readReceiptMetadata, verifyReceiptBytes } from './event-media-contract-decision-v1/receipt.mjs';

const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  if (index < 0) return null;
  if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`${flag} requires a value`);
  return args[index + 1];
};

try {
  const root = path.resolve(valueAfter('--root') ?? '.');
  const eventsRoot = valueAfter('--events-repo');
  const skipReceipt = args.includes('--skip-receipt');
  const fixtureMode = args.includes('--fixture-mode');
  const recognized = new Set(['--root', '--events-repo', '--skip-receipt', '--fixture-mode']);
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!recognized.has(arg)) throw new Error(`unknown argument: ${arg}`);
    if (['--root', '--events-repo'].includes(arg)) index += 1;
  }
  if (!fixtureMode && !eventsRoot) throw new Error('--events-repo is required outside --fixture-mode');

  const schemaArgs = [path.join(root, 'scripts/validate-event-media-contract-decision-schemas-v1.py'), '--root', root];
  if (skipReceipt) schemaArgs.push('--skip-receipt');
  const schema = childProcess.spawnSync('python3', schemaArgs, { cwd: root, encoding: 'utf8' });
  if (schema.status !== 0) {
    const lastLine = schema.stderr.trim().split('\n').filter(Boolean).at(-1);
    if (lastLine) {
      const payload = JSON.parse(lastLine);
      const error = new Error(payload.error?.diagnostic ?? 'schema validation failed');
      Object.assign(error, payload.error ?? {}, { schemaOutput: payload });
      throw error;
    }
    throw new Error(`schema validation failed with exit ${schema.status}`);
  }

  const result = collectAndValidate({ root, eventsRoot, fixtureMode });
  if (!skipReceipt) {
    const metadata = readReceiptMetadata(root);
    const expected = buildReceipt({ root, eventsRoot, ...metadata });
    verifyReceiptBytes(root, expected);
  }
  console.log(JSON.stringify({
    status: 'valid',
    receipt: skipReceipt ? 'skipped-explicitly' : RECEIPT_PATH,
    fixture_mode: fixtureMode,
    final_statuses: result.finalStatuses,
    facts: result.facts,
  }, null, 2));
} catch (error) {
  const structured = error?.toJSON?.() ?? {
    name: error.name ?? 'Error',
    code: error.code ?? 'EMV_VALIDATION_FAILED',
    stage: error.stage ?? 'validator',
    record: error.record ?? 'event-media-contract-decision-v1',
    path: error.path ?? '/',
    diagnostic: error.diagnostic ?? error.message,
  };
  console.error(JSON.stringify({ status: 'rejected', error: structured }));
  process.exit(1);
}
