#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const root = 'evidence/unified-design-wave1/v1';
const penpotDir = `${root}/penpot`;
const comparisonDir = `${root}/comparisons`;
const output = `${root}/review-manifest.v1.json`;
const readbackPath = `${root}/penpot-readback.v1.json`;
const readback = JSON.parse(readFileSync(readbackPath, 'utf8'));
const sha = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const ref = path => ({ path, sha256: sha(path) });
const TEAM = '81f57451-85cc-819d-8008-70ebaeab3fd6';
const FILE = readback.file_id;
const url = (pageId, boardId) => `https://design.penpot.app/#/workspace?team-id=${TEAM}&file-id=${FILE}&page-id=${pageId}&board-id=${boardId}`;
mkdirSync(comparisonDir, { recursive: true });

const specs = [
  ['01.search-nav.desktop', 'pattern.desktop-search-navigation.candidate-v1', 0, 'desktop', 'wave1.search-nav.desktop', 'Add a bounded desktop Search entry without replacing route navigation.'],
  ['02.search-nav.mobile', 'pattern.desktop-search-navigation.candidate-v1', 0, 'mobile', 'wave1.search-nav.mobile', 'Keep the existing mobile Search destination; do not invent a second navigation pattern.'],
  ['03.selectors.desktop', 'pattern.responsive-context-selector.candidate-v1', 1, 'desktop', 'wave1.selectors.desktop', 'Unify date, place and ordering as explicit desktop context controls.'],
  ['04.selectors.mobile', 'pattern.responsive-context-selector.candidate-v1', 1, 'mobile', 'wave1.selectors.mobile', 'Preserve the date rail and expose place/ordering as two mobile sheet triggers.'],
  ['05.floating.desktop', 'pattern.floating-action-island.candidate-v1', 2, 'desktop', 'wave1.floating.desktop', 'Use one linked sticky-capable Event Detail action island.'],
  ['06.floating.mobile', 'pattern.floating-action-island.candidate-v1', 2, 'mobile', 'wave1.floating.mobile', 'Use the same semantic actions in a bottom-safe mobile island without covering content.']
];

const cases = specs.map(([caseId, patternId, pageIndex, viewport, stem, question]) => {
  const page = readback.pages[pageIndex];
  const baselineBoard = page.boards[`${viewport}_baseline`];
  const candidateBoard = page.boards[`${viewport}_candidate`];
  const baseline = `${penpotDir}/${stem}.baseline.png`;
  const candidate = `${penpotDir}/${stem}.candidate.png`;
  const labelledBaseline = `${comparisonDir}/${caseId}.baseline-labelled.png`;
  const labelledCandidate = `${comparisonDir}/${caseId}.candidate-labelled.png`;
  const comparison = `${comparisonDir}/${caseId}.baseline-above-candidate.png`;
  execFileSync('magick', [baseline, '-background', '#221a14', '-fill', '#fffaf2', '-gravity', 'northwest', '-splice', '0x28', '-pointsize', '14', '-annotate', '+10+7', 'BASELINE', labelledBaseline]);
  execFileSync('magick', [candidate, '-background', '#a6401d', '-fill', '#fffaf2', '-gravity', 'northwest', '-splice', '0x28', '-pointsize', '14', '-annotate', '+10+7', 'CANDIDATE', labelledCandidate]);
  execFileSync('magick', [labelledBaseline, labelledCandidate, '-background', '#fffaf2', '-gravity', 'center', '-append', comparison]);
  return {
    case_id: caseId,
    pattern_id: patternId,
    viewport,
    consumer: patternId.includes('selector') ? 'archetype.listing.date' : patternId.includes('floating') ? 'archetype.event-detail' : 'archetype.search + shared shell',
    layout: 'baseline_above_candidate',
    review_question: question,
    penpot: {
      page_id: page.page_id,
      page_name: page.page_name,
      baseline_board_id: baselineBoard.id,
      baseline_url: url(page.page_id, baselineBoard.id),
      candidate_board_id: candidateBoard.id,
      candidate_url: url(page.page_id, candidateBoard.id),
      baseline_export: ref(baseline),
      candidate_export: ref(candidate)
    },
    comparison: ref(comparison),
    status: 'AWAITING_OWNER_REVIEW'
  };
});

const manifest = {
  schema_version: 'unified-design-wave1.review-manifest.v1',
  status: 'WAVE1_REVIEWABLE_NOT_ACCEPTED',
  authority: {
    baseline_receipt: ref('evidence/round-trip-reconstruction/v1/baseline-closure-receipt.v1.json'),
    candidate_manifest: ref('catalog/unified-design-wave1/v1/manifest.v1.json'),
    penpot_readback: ref(readbackPath),
    penpot: { file_id: FILE, revision: readback.revision, validation: readback.validation }
  },
  review_policy: {
    order: 'listed_case_order',
    comparison_layout: 'baseline_above_candidate_for_square_readability',
    exact_native_penpot_boards: true,
    astro_candidate_before_owner_acceptance: false,
    telegram_publication_required_for_this_gate: false
  },
  coverage: { patterns: 3, pages: 3, cases: cases.length, desktop: 3, mobile: 3, missing: [] },
  cases,
  explicit_non_applicability: {
    'pattern.floating-action-island.candidate-v1': {
      'archetype.listing.date': 'not_applicable_actions_belong_to_cards',
      'archetype.search': 'not_applicable_no_persistent_primary_action'
    }
  },
  preserved_boundaries: {
    new_foundation_tokens: 0,
    canonical_foundation_mutations: 0,
    production_astro_changes: 0,
    product_atlas_penpot_dashboards: 0,
    service_boards: 0,
    full_page_screenshot_proxies: 0
  }
};
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${output}: ${sha(output)} (${cases.length} cases)`);
