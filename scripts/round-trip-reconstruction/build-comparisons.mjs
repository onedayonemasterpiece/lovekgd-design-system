#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const bindingsPath = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const bindings = JSON.parse(readFileSync(bindingsPath, 'utf8'));
const evidence = 'evidence/round-trip-reconstruction/v1';
const outputDir = join(root, evidence, 'comparisons');
mkdirSync(outputDir, { recursive: true });
const sha256 = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const identify = path => execFileSync('magick', ['identify', '-format', '%w %h', path], { encoding: 'utf8' }).trim().split(' ').map(Number);
const run = args => execFileSync('magick', args, { stdio: 'pipe' });
const cases = [];

for (const item of bindings.cases) {
  const astro = join(root, evidence, 'astro', `${item.case_id}.png`);
  const penpot = join(root, evidence, 'penpot', `${item.case_id}.png`);
  if (!existsSync(astro) || !existsSync(penpot)) continue;
  const astroSize = identify(astro);
  const penpotSize = identify(penpot);
  const geometryEqual = astroSize[0] === penpotSize[0] && astroSize[1] === penpotSize[1];
  if (!geometryEqual) throw new Error(`${item.case_id}: geometry mismatch ${astroSize} vs ${penpotSize}`);
  const overlay = join(outputDir, `${item.case_id}.overlay-50.png`);
  const diff = join(outputDir, `${item.case_id}.diff.png`);
  const panel = join(outputDir, `${item.case_id}.comparison.png`);
  run([astro, penpot, '-alpha', 'on', '-compose', 'blend', '-define', 'compose:args=50,50', '-composite', overlay]);
  const comparison = spawnSync('magick', ['compare', '-metric', 'RMSE', astro, penpot, diff], { encoding: 'utf8' });
  const metric = String(comparison.stderr || comparison.stdout || '').trim();
  const append = item.viewport === 'desktop' ? '-append' : '+append';
  run([astro, penpot, append, panel]);
  cases.push({
    case_id: item.case_id,
    layout: item.viewport === 'desktop' ? 'astro_above_penpot' : 'astro_left_penpot_right',
    geometry_equal: true,
    width: astroSize[0],
    height: astroSize[1],
    rmse: metric,
    astro: { path: `${evidence}/astro/${item.case_id}.png`, sha256: sha256(astro) },
    penpot: { path: `${evidence}/penpot/${item.case_id}.png`, sha256: sha256(penpot) },
    overlay: { path: `${evidence}/comparisons/${item.case_id}.overlay-50.png`, sha256: sha256(overlay) },
    diff: { path: `${evidence}/comparisons/${item.case_id}.diff.png`, sha256: sha256(diff) },
    comparison: { path: `${evidence}/comparisons/${item.case_id}.comparison.png`, sha256: sha256(panel) }
  });
  console.log(`${item.case_id}: ${metric}`);
}

const manifest = {
  schema_version: 'round-trip-reconstruction.comparisons.v1',
  bindings_sha256: sha256(join(root, bindingsPath)),
  expected_cases: bindings.cases.length,
  compared_cases: cases.length,
  missing_cases: bindings.cases.filter(item => !cases.some(entry => entry.case_id === item.case_id)).map(item => item.case_id),
  cases
};
const path = join(outputDir, 'manifest.v1.json');
writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${path}: ${sha256(path)} (${cases.length}/${bindings.cases.length})`);
