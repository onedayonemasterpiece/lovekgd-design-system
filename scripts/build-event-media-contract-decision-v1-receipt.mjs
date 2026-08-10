#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

import { gitCommand, RECEIPT_PATH, stable } from './event-media-contract-decision-v1/lib.mjs';
import { buildReceipt, readReceiptMetadata, verifyReceiptBytes } from './event-media-contract-decision-v1/receipt.mjs';

const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  if (index < 0) return null;
  if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`${flag} requires a value`);
  return args[index + 1];
};
const root = path.resolve(valueAfter('--root') ?? '.');
const eventsRoot = valueAfter('--events-repo');
const write = args.includes('--write');

try {
  let materializationParent;
  let prNumber;
  let prUrl;
  let branch;
  if (write) {
    const dirtyTracked = gitCommand(root, ['status', '--porcelain', '--untracked-files=no']);
    if (dirtyTracked) throw new Error('tracked worktree must be clean before --write');
    materializationParent = gitCommand(root, ['rev-parse', 'HEAD']);
    prNumber = Number(valueAfter('--pr-number'));
    prUrl = valueAfter('--pr-url');
    branch = gitCommand(root, ['branch', '--show-current']);
  } else {
    ({ materializationParent, prNumber, prUrl, branch } = readReceiptMetadata(root));
    const numberArg = valueAfter('--pr-number');
    const urlArg = valueAfter('--pr-url');
    if (numberArg !== null) prNumber = Number(numberArg);
    if (urlArg !== null) prUrl = urlArg;
  }
  const receipt = buildReceipt({ root, eventsRoot, materializationParent, prNumber, prUrl, branch });
  if (write) {
    const destination = path.join(root, RECEIPT_PATH);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, stable(receipt));
  } else verifyReceiptBytes(root, receipt);
  console.log(JSON.stringify({ status: write ? 'written' : 'valid', receipt: RECEIPT_PATH, output_count: receipt.output_count, output_bytes: receipt.output_bytes }));
} catch (error) {
  const structured = error?.toJSON?.() ?? { name: error.name ?? 'Error', code: 'EMV_RECEIPT_BUILD_FAILED', stage: 'receipt', record: RECEIPT_PATH, path: '/', diagnostic: error.message };
  console.error(JSON.stringify({ status: 'rejected', error: structured }));
  process.exit(1);
}
