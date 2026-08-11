#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { buildApplyComponentSynthesisReceipt, PATHS, stable } from './lib.mjs';
import { ComponentSynthesisValidationError, demand } from './structured-error.mjs';

const args = process.argv.slice(2);
const value = (flag, fallback = null) => {
  const index = args.indexOf(flag);
  return index === -1 ? fallback : args[index + 1];
};
const root = path.resolve(value('--root', '.'));
const eventsRepo = value('--events-repo');
const materializationParentSha = value('--materialization-parent');
const prNumber = Number(value('--pr-number', '35'));
const prUrl = value('--pr-url', 'https://github.com/onedayonemasterpiece/lovekgd-design-system/pull/35');
const write = args.includes('--write');

try {
  const receipt = buildApplyComponentSynthesisReceipt({ root, eventsRepo, materializationParentSha, prNumber, prUrl });
  const target = path.join(root, PATHS.receipt);
  const bytes = stable(receipt);
  if (write) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes);
  } else {
    demand(fs.existsSync(target) && fs.readFileSync(target, 'utf8') === bytes, 'ACS_RECEIPT_DRIFT', 'receipt-build', PATHS.receipt, '$', 'committed receipt differs from deterministic builder; pass --write deliberately to update it');
  }
  process.stdout.write(`${JSON.stringify({ status: 'PASS', mode: write ? 'write' : 'check', receipt: PATHS.receipt, outputs: Object.keys(receipt.outputs).length, conclusion: receipt.conclusion })}\n`);
} catch (error) {
  const detail = error instanceof ComponentSynthesisValidationError ? error.toJSON() : { name: error.name, code: 'ACS_UNEXPECTED', diagnostic: error.message };
  process.stderr.write(`${JSON.stringify({ status: 'REJECTED', error: detail })}\n`);
  process.exitCode = 1;
}
