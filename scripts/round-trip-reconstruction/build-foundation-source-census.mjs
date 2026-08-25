#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const astroRoot = '/home/dev/.codex/worktrees/events-bot-new/round-trip-astro-candidate-20260824';
const astroCommit = '7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00';
const designCommit = '9b8043f3bdb86fab4eee00bf94b0f10d4f029c50';
const output = 'evidence/round-trip-reconstruction/v1/foundation-audit-pack-v1/source-and-sot-census.v1.json';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const sampleLimit = 6;

const tracked = execFileSync('git', ['ls-files', 'site/src'], { cwd: astroRoot, encoding: 'utf8' })
  .trim().split('\n').filter(path => /\.(?:astro|css|scss|js|mjs|ts|tsx|jsx)$/.test(path));
const colorPattern = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|oklch\([^)]*\)/gi;
const colorMap = new Map();
const typographyDeclarations = new Map();
const interactionSelectors = [];

const add = (map, key, file, line, content) => {
  let entry = map.get(key);
  if (!entry) entry = { value: key, occurrences: 0, files: new Set(), samples: [] }, map.set(key, entry);
  entry.occurrences += 1;
  entry.files.add(file);
  if (entry.samples.length < sampleLimit) entry.samples.push({ file, line, content: content.trim().slice(0, 240) });
};

for (const file of tracked) {
  const bytes = readFileSync(join(astroRoot, file), 'utf8');
  const lines = bytes.split('\n');
  lines.forEach((line, index) => {
    for (const match of line.matchAll(colorPattern)) add(colorMap, match[0].toLowerCase().replace(/\s+/g, ' '), file, index + 1, line);
    const declaration = line.match(/\b(font-family|font-size|font-weight|line-height|letter-spacing|text-transform|text-decoration)\s*:\s*([^;}{]+)/i);
    if (declaration) add(typographyDeclarations, `${declaration[1].toLowerCase()}:${declaration[2].trim()}`, file, index + 1, line);
    if (/(?:hover|focus|focus-visible|active|disabled|aria-disabled|data-state)/i.test(line) && /[{,]/.test(line)) {
      if (interactionSelectors.length < 800) interactionSelectors.push({ file, line: index + 1, source: line.trim().slice(0, 300) });
    }
  });
}

const finalize = map => [...map.values()].map(entry => ({ ...entry, files: [...entry.files].sort() }))
  .sort((a, b) => b.occurrences - a.occurrences || a.value.localeCompare(b.value));
const foundationsPath = 'catalog/reconstruction-atlas/v1/foundations.v1.json';
const foundationsBytes = readFileSync(foundationsPath);
const foundations = JSON.parse(foundationsBytes);
const contractDir = 'catalog/global-archetype-sot-v1/archetype-contracts';
const contractPaths = execFileSync('find', [contractDir, '-type', 'f', '-name', '*.json'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean).sort();
const foundationConsumers = contractPaths.map(path => {
  const contract = JSON.parse(readFileSync(path, 'utf8'));
  const refs = (contract.foundation_bindings ?? contract.foundations ?? []).filter?.(item => item?.foundation_group) ?? [];
  const serialized = JSON.stringify(contract);
  const groups = [...new Set([...serialized.matchAll(/"foundation_group"\s*:\s*"([^"]+)"/g)].map(match => match[1]))];
  return groups.length ? { archetype_id: contract.archetype_id, contract_id: contract.contract_id, path, groups } : null;
}).filter(Boolean);

const sourceRefs = foundations.source_refs.map(path => {
  const absolute = join(astroRoot, path);
  const bytes = readFileSync(absolute);
  return { path, sha256: hash(bytes), bytes: bytes.length };
});
const receipt = {
  schema_version: 'foundation-audit.source-and-sot-census.v1',
  generated_at: new Date().toISOString(),
  authority: { astro_commit: astroCommit, design_system_commit: designCommit },
  astro_source: {
    root: astroRoot,
    tracked_source_files_scanned: tracked.length,
    colors: finalize(colorMap),
    typography_declarations: finalize(typographyDeclarations),
    interaction_state_declarations: interactionSelectors,
    source_refs: sourceRefs
  },
  sot: {
    foundations_path: foundationsPath,
    foundations_sha256: hash(foundationsBytes),
    status: foundations.status,
    authority: foundations.authority,
    typography: foundations.typography,
    semantic_colors: foundations.semantic_colors,
    accessibility: foundations.accessibility,
    cross_cutting_contracts: foundations.cross_cutting_contracts,
    archetype_consumers: foundationConsumers
  },
  boundary: {
    observation_only: true,
    tokens_changed: false,
    colors_merged: false,
    typography_merged: false,
    independent_audits_required: 2
  }
};
const bytes = `${JSON.stringify(receipt, null, 2)}\n`;
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, bytes);
console.log(`${output}: ${hash(bytes)} (${receipt.astro_source.colors.length} colors, ${receipt.astro_source.typography_declarations.length} typography declarations)`);
