#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const bindingsPath = 'catalog/round-trip-reconstruction/v1/bindings.v1.json';
const comparisonsPath = 'evidence/round-trip-reconstruction/v1/comparisons/manifest.v1.json';
const outputPath = 'catalog/round-trip-reconstruction/v1/owner-review-manifest.v1.json';
const bindings = JSON.parse(readFileSync(bindingsPath, 'utf8'));
const comparisons = existsSync(comparisonsPath) ? JSON.parse(readFileSync(comparisonsPath, 'utf8')) : { cases: [] };
const comparisonById = new Map(comparisons.cases.map(item => [item.case_id, item]));
const sha256 = path => createHash('sha256').update(readFileSync(path)).digest('hex');

const cases = bindings.cases.map(item => {
  const comparison = comparisonById.get(item.case_id);
  const penpotPath = `evidence/round-trip-reconstruction/v1/penpot/${item.case_id}.png`;
  const astroPath = `evidence/round-trip-reconstruction/v1/astro/${item.case_id}.png`;
  return {
    case_id: item.case_id,
    archetype_id: item.archetype_id,
    viewport: item.viewport,
    review_order: `${String(bindings.archetypes.findIndex(archetype => archetype.archetype_id === item.archetype_id) + 1).padStart(2, '0')}.${item.viewport === 'desktop' ? '1' : '2'}`,
    penpot: {
      page_id: item.penpot.page_id,
      board_id: item.penpot.board_id,
      direct_url: item.penpot.direct_url,
      screenshot: existsSync(penpotPath) ? { path: penpotPath, sha256: sha256(penpotPath) } : null
    },
    astro: {
      commit: item.astro.commit,
      route: item.astro.route,
      candidate_url: `http://127.0.0.1:4322${item.astro.route}`,
      screenshot: existsSync(astroPath) ? { path: astroPath, sha256: sha256(astroPath) } : null
    },
    comparison: comparison ?? null,
    status: comparison ? 'reviewable' : 'missing_evidence'
  };
});

const output = {
  schema_version: 'round-trip-reconstruction.owner-review-manifest.v1',
  authority: bindings.authority,
  bindings_sha256: sha256(bindingsPath),
  review_policy: {
    order: 'page_sequence_then_desktop_mobile',
    desktop_comparison_layout: 'astro_above_penpot',
    mobile_comparison_layout: 'astro_left_penpot_right',
    service_dashboards_in_penpot: false
  },
  coverage: {
    expected: cases.length,
    reviewable: cases.filter(item => item.status === 'reviewable').length,
    missing: cases.filter(item => item.status !== 'reviewable').map(item => item.case_id)
  },
  cases
};
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`${outputPath}: ${sha256(outputPath)} (${output.coverage.reviewable}/${output.coverage.expected})`);
