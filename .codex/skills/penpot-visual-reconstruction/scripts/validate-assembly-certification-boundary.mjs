#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const certificationTriggers = new Set(['new-component','semantic-contract-change','new-structural-state','new-context','failed-regression','owner-defect','promotion-gate']);
export const modeFor = (operation) => certificationTriggers.has(operation.trigger) ? 'CERTIFICATION' : 'ASSEMBLY';

export function validateAssemblyCertificationBoundary(plan) {
  const errors = [];
  for (const operation of plan?.operations ?? []) {
    const expected = modeFor(operation);
    if (operation.mode !== expected) errors.push(`${operation.id}: expected ${expected}, got ${operation.mode}`);
    if (expected === 'ASSEMBLY' && operation.certificationPackages > 0) errors.push(`${operation.id}: ordinary reuse opened certification`);
  }
  for (const defect of plan?.ownerDefects ?? []) {
    if (!defect.lowestOwner) errors.push(`${defect.id}: lowest owner missing`);
    if (defect.ownerFixCount !== 1) errors.push(`${defect.id}: owner defect must open one central fix`);
    if (defect.dependencyClosureCount !== 1) errors.push(`${defect.id}: central fix must run one dependency closure`);
    if ((defect.parentProofPackages ?? 0) !== 0) errors.push(`${defect.id}: parent consumers received separate proof packages`);
  }
  return errors;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const plan = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  const errors = validateAssemblyCertificationBoundary(plan);
  console.log(JSON.stringify({ validator: 'validate-assembly-certification-boundary', status: errors.length ? 'FAIL' : 'PASS', errors }, null, 2));
  process.exitCode = errors.length ? 1 : 0;
}
