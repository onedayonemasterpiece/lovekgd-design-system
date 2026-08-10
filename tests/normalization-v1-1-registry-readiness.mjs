#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = execFileSync(process.execPath, [
  path.join(root, 'scripts/normalization-v1-1/build-registry-readiness.mjs'),
  '--check',
  '--self-test'
], { cwd: root, encoding: 'utf8' }).trim();

const result = JSON.parse(output);
if (result.status !== 'valid'
  || result.analytical_groups !== 47
  || result.component_memberships !== 107
  || result.readiness_rows !== 47
  || result.strict_ready !== 0
  || result.first_wave !== 0
  || result.semantic_mutations_rejected !== 10) {
  throw new Error(`unexpected registry/readiness validation result: ${output}`);
}

process.stdout.write(`${JSON.stringify({ status: 'PASS', suite: 'normalization-v1-1-registry-readiness', result })}\n`);
