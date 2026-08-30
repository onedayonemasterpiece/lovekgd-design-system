#!/usr/bin/env node
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

const require = createRequire(import.meta.url);
const { loadResolvedCaseIndex } = require('../round-trip-reconstruction/resolved-case-loader.js');

export function projectResolvedCase({ root, indexPath, indexFileSha256, caseId }) {
  const loaded = loadResolvedCaseIndex(root, indexPath, indexFileSha256, [caseId]);
  return {
    schema: 'kenigevents.ui-sot-resolved-case-projection.v1',
    consumer: 'UI SoT projection',
    case_id: caseId,
    resolved_case_content_sha256: loaded.cases[caseId].content_sha256,
    resolved_case_index_sha256: loaded.payloadHash,
    payload: loaded.cases[caseId].payload,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [indexPath, indexFileSha256, caseId] = process.argv.slice(2);
  if (!indexPath || !indexFileSha256 || !caseId) throw new Error('usage: index-path index-file-sha256 case-id');
  process.stdout.write(`${JSON.stringify(projectResolvedCase({ root: process.cwd(), indexPath: path.normalize(indexPath), indexFileSha256, caseId }))}\n`);
}
