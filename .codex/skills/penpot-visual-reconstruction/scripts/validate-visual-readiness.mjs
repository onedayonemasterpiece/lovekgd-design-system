#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function validateVisualReadiness(input) {
  const projections = Array.isArray(input?.projections) ? input.projections : [input];
  const errors = [];
  for (const p of projections.filter(Boolean)) {
    const id = p.id ?? p.name ?? 'projection';
    if (!p.width || !p.height) errors.push(`${id}: viewport geometry missing`);
    if (p.blank || p.scaffold || p.stateIndex || p.metadataOnly) errors.push(`${id}: blank/scaffold/state-index projection`);
    if (p.textOnly) errors.push(`${id}: text-only labels are not visual UI`);
    if (p.screenshotOnly || p.nativeComposition === false) errors.push(`${id}: screenshot proxy is not native composition`);
    if (!Array.isArray(p.materialRegions) || p.materialRegions.length === 0) errors.push(`${id}: material regions missing`);
    if (!Array.isArray(p.linkedInstances) || p.linkedInstances.length === 0) errors.push(`${id}: linked component ancestry missing`);
    if (p.detachedCopies > 0) errors.push(`${id}: detached copies present`);
    if (p.terminalVisualOverrides > 0) errors.push(`${id}: terminal visual overrides present`);
  }
  if (projections.length === 0) errors.push('no visual projections');
  return errors;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const plan = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  const errors = validateVisualReadiness(plan);
  console.log(JSON.stringify({ validator: 'validate-visual-readiness', status: errors.length ? 'FAIL' : 'PASS', errors }, null, 2));
  process.exitCode = errors.length ? 1 : 0;
}
