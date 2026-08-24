#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const servicePattern = /source[- ]state|route registry|coverage|status dashboard|gap ledger|gap dashboard|hash|sha\b|test report|receipt|execution log|readiness card|review index|metadata[- ]only/i;

export function validatePenpotUiOnly(plan) {
  const errors = [];
  for (const object of plan?.objects ?? []) {
    const identity = `${object.kind ?? ''} ${object.name ?? ''} ${object.purpose ?? ''}`;
    if (servicePattern.test(identity) || object.serviceOnly === true) errors.push(`service-only Penpot object: ${object.name ?? object.kind ?? 'unnamed'}`);
    if (object.metadataOnly === true) errors.push(`metadata-only Penpot component: ${object.name ?? 'unnamed'}`);
    if (object.library === 'Product' && object.resourceClass === 'service') errors.push(`service resource in Product library: ${object.name ?? 'unnamed'}`);
  }
  return errors;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const plan = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  const errors = validatePenpotUiOnly(plan);
  console.log(JSON.stringify({ validator: 'validate-penpot-ui-only', status: errors.length ? 'FAIL' : 'PASS', errors }, null, 2));
  process.exitCode = errors.length ? 1 : 0;
}
