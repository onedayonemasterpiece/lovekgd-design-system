#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'evidence/round-trip-reconstruction/v1/foundation-audit-pack-v1';
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const sha256 = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const idFor = (prefix, value) => `${prefix}.${createHash('sha256').update(value).digest('hex').slice(0, 16)}`;
const bindings = read('catalog/round-trip-reconstruction/v1/bindings.v1.json');
const review = read('catalog/round-trip-reconstruction/v1/owner-review-manifest.v1.json');
const comparisons = read('evidence/round-trip-reconstruction/v1/comparisons/manifest.v1.json');
const browser = read(join(dir, 'astro-browser-computed.v1.json'));
const source = read(join(dir, 'source-and-sot-census.v1.json'));
const penpot = read(join(dir, 'penpot-instance-census.v1.json'));
const astroValidation = read('evidence/round-trip-reconstruction/v1/astro-validation/receipt.v1.json');
const checklistPath = 'docs/design-system-post-baseline-audits-and-product-atlas-checklist.md';
const incidentPath = 'evidence/round-trip-reconstruction/v1/penpot-stability/incident-20260825-react-185.md';
mkdirSync(dir, { recursive: true });

const colorValues = new Map();
const addColor = (value, sourceName, usage = 0, consumers = [], role = null) => {
  if (!value) return;
  const key = String(value).toLowerCase().replace(/\s+/g, ' ');
  let entry = colorValues.get(key);
  if (!entry) entry = { current_id: idFor('color.current', key), value: key, observed_sources: new Set(), usage_count: 0, consumer_ids: new Set(), current_roles: new Set() }, colorValues.set(key, entry);
  entry.observed_sources.add(sourceName);
  entry.usage_count += Number(usage) || 0;
  consumers.forEach(consumer => entry.consumer_ids.add(consumer));
  if (role) entry.current_roles.add(role);
};
browser.colors.forEach(item => addColor(item.value, 'astro.browser-computed', item.usage_count, item.case_ids));
penpot.observed.colors.forEach(item => addColor(item.value, 'penpot.instance', item.visible_shape_count, item.board_ids));
Object.entries(source.sot.semantic_colors).forEach(([role, value]) => addColor(value, 'sot.semantic_colors', 0, [], role));
penpot.library.colors.forEach(item => addColor(item.color, 'penpot.library', 0, [item.id], `${item.path}/${item.name}`));

const typeValues = new Map();
const addType = (record, sourceName, usage, consumers) => {
  const normalized = JSON.stringify(record);
  let entry = typeValues.get(normalized);
  if (!entry) entry = { current_id: idFor('typography.current', normalized), observed: record, observed_sources: new Set(), usage_count: 0, consumer_ids: new Set() }, typeValues.set(normalized, entry);
  entry.observed_sources.add(sourceName);
  entry.usage_count += Number(usage) || 0;
  consumers.forEach(consumer => entry.consumer_ids.add(consumer));
};
browser.typography.forEach(item => addType(Object.fromEntries(['font_family','font_size','font_weight','font_style','line_height','letter_spacing','text_transform','text_decoration','white_space','text_overflow'].map(key => [key, item[key] ?? null])), 'astro.browser-computed', item.usage_count, item.case_ids));
penpot.observed.typography.forEach(item => addType(Object.fromEntries(['font_family','font_size','font_weight','font_style','line_height','letter_spacing','text_transform','text_decoration','grow_type'].map(key => [key, item[key] ?? null])), 'penpot.instance', item.visible_shape_count, item.board_ids));

const template = {
  schema_version: 'foundation-audit.current-to-candidate-template.v1',
  status: 'UNRESOLVED_AWAITING_INDEPENDENT_AUDITS_AND_OWNER_DECISION',
  colors: [...colorValues.values()].map(entry => ({ ...entry, observed_sources: [...entry.observed_sources].sort(), consumer_ids: [...entry.consumer_ids].sort(), current_roles: [...entry.current_roles].sort(), disposition: 'UNRESOLVED', candidate_role: null, rationale: null, owner_decision: null })).sort((a, b) => b.usage_count - a.usage_count || a.value.localeCompare(b.value)),
  typography: [...typeValues.values()].map(entry => ({ ...entry, observed_sources: [...entry.observed_sources].sort(), consumer_ids: [...entry.consumer_ids].sort(), disposition: 'UNRESOLVED', candidate_role: null, responsive_rule: null, rationale: null, owner_decision: null })).sort((a, b) => b.usage_count - a.usage_count || a.current_id.localeCompare(b.current_id)),
  prohibitions: ['no automatic token merge', 'no canonical Penpot foundation mutation', 'no production Astro mutation', 'no candidate acceptance before two independent audits, synthesis and owner decision']
};
const templatePath = join(dir, 'current-to-candidate-template.v1.json');
writeFileSync(templatePath, `${JSON.stringify(template, null, 2)}\n`);

const caseById = new Map(review.cases.map(item => [item.case_id, item]));
const representativeIds = [
  'archetype.listing.date.desktop.current-v1', 'archetype.listing.date.mobile.current-v1',
  'archetype.event-detail.desktop.current-v1', 'archetype.event-detail.mobile.current-v1',
  'archetype.search.desktop.current-v1', 'archetype.search.mobile.current-v1'
];
const representative = representativeIds.map(caseId => {
  const item = caseById.get(caseId);
  return { case_id: caseId, penpot_url: item.penpot.direct_url, astro_route: item.astro.route, comparison: `evidence/round-trip-reconstruction/v1/comparisons/${caseId}.comparison.png` };
});
const contrastSummary = browser.contrast.reduce((summary, item) => {
  summary.tested += item.tested_count;
  summary.pass += item.pass_count;
  summary.fail += item.fail_count;
  summary.unresolved += item.unresolved_count;
  return summary;
}, { tested: 0, pass: 0, fail: 0, unresolved: 0 });

const manifest = {
  schema_version: 'foundation-audit-pack.v1',
  status: 'AUDIT_INPUT_READY_NOT_A_FOUNDATION_DECISION',
  generated_at: new Date().toISOString(),
  authority: {
    design_system_commit: bindings.authority.design_system_commit,
    astro_commit: bindings.authority.astro_commit,
    sot_manifest: bindings.authority.manifest,
    checklist: { source_commit: 'a2991f8b7cc516d7e80f95057d7b9e21ec81097f', path: checklistPath, sha256: sha256(checklistPath) },
    penpot: { file_id: bindings.penpot.file_id, revision: penpot.revision, validation: penpot.validation }
  },
  coverage: {
    archetypes: bindings.coverage.archetypes,
    boards: review.coverage.reviewable,
    direct_ui_links: review.cases.length,
    astro_browser_cases: browser.scope.cases,
    penpot_census_boards: penpot.scope.boards,
    colors: { astro_computed_records: browser.colors.length, penpot_observed_records: penpot.observed.colors.length, penpot_library_resources: penpot.library.color_count, mapping_rows: template.colors.length },
    typography: { astro_computed_records: browser.typography.length, penpot_observed_records: penpot.observed.typography.length, penpot_library_resources: penpot.library.typography_count, mapping_rows: template.typography.length },
    contrast: contrastSummary
  },
  artifacts: [
    'catalog/round-trip-reconstruction/v1/bindings.v1.json',
    'catalog/round-trip-reconstruction/v1/owner-review-manifest.v1.json',
    'evidence/round-trip-reconstruction/v1/comparisons/manifest.v1.json',
    join(dir, 'astro-browser-computed.v1.json'),
    join(dir, 'source-and-sot-census.v1.json'),
    join(dir, 'penpot-instance-census.v1.json'),
    templatePath,
    join(dir, 'ready-prompts.md'),
    incidentPath
  ].map(path => ({ path, sha256: path.endsWith('ready-prompts.md') ? null : sha256(path) })),
  representative_archetypes: representative,
  renderer_limitations: [
    { id: 'penpot.static-font-weight-set', evidence: `${incidentPath} and Penpot API read-back`, impact: 'Astro variable weights such as 820/920 require nearest supported Penpot weight and must not be misclassified as a semantic type decision.' },
    { id: 'penpot.negative-letter-spacing-api', evidence: 'scripts/round-trip-reconstruction/penpot-fix-exhibitions-mobile-section.js', impact: 'Penpot 2.17.2-RC2 rejects some negative tracking values through the plugin API.' },
    { id: 'penpot.text-layout-navigation-loop', evidence: incidentPath, impact: 'Page navigation while text resize events drain can trigger React #185; audit reads remain page-bounded and read-only.' },
    { id: 'exhibition.slider-browser-authoritative', evidence: 'scripts/round-trip-reconstruction/penpot-fix-exhibitions-desktop-rows-v1.js', impact: 'Static first state is native in Penpot; slider dynamics remain Astro-authoritative by explicit owner exception.' },
    { id: 'contrast.complex-underlay', evidence: join(dir, 'astro-browser-computed.v1.json'), impact: 'Image/gradient underlays are marked unresolved rather than assigned fabricated flat-background contrast.' }
  ],
  unresolved: [
    'Independent visual color audit not yet supplied.',
    'Independent source/runtime color audit not yet supplied.',
    'Independent visual typography audit not yet supplied.',
    'Independent source/runtime typography audit not yet supplied.',
    'Synthesis and owner decision package not yet created.',
    'Skeleton archive not supplied; only loading-state redesign is blocked.',
    'Candidate palette/type scale entries intentionally remain UNRESOLVED.'
  ],
  boundaries: { colors_changed: false, typography_changed: false, penpot_foundations_mutated: false, production_astro_changed: false, independent_audits_required: 2 },
  validation: { baseline_round_trip: 'ROUND_TRIP_VALIDATION_PASS', astro: astroValidation, comparisons: { expected: comparisons.expected_cases, compared: comparisons.compared_cases, missing: comparisons.missing_cases } }
};

const checklist = readFileSync(checklistPath, 'utf8');
const promptStart = checklist.indexOf('## 11.1. Color system audit');
const promptEnd = checklist.indexOf('## 11.3. Product Atlas Git-only bootstrap');
const prompts = `# Foundation Audit Pack v1 — independent audit prompts\n\nExact source: \`${checklistPath}\` @ \`a2991f8b7cc516d7e80f95057d7b9e21ec81097f\`.\n\n${checklist.slice(promptStart, promptEnd).trim()}\n`;
writeFileSync(join(dir, 'ready-prompts.md'), prompts);
manifest.artifacts.find(item => item.path.endsWith('ready-prompts.md')).sha256 = sha256(join(dir, 'ready-prompts.md'));
const manifestPath = join(dir, 'manifest.v1.json');
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const readme = `# Foundation Audit Pack v1\n\nStatus: **AUDIT_INPUT_READY_NOT_A_FOUNDATION_DECISION**.\n\nThis pack is the exact common input for two independent color passes, two independent typography passes, synthesis and owner decisions. It does **not** merge or change foundations.\n\n## Authority\n\n- Design-system/SoT: \`${manifest.authority.design_system_commit}\`\n- Astro: \`${manifest.authority.astro_commit}\`\n- Penpot: \`${manifest.authority.penpot.file_id}\`, revision \`${manifest.authority.penpot.revision}\`, validation \`[]\`\n- UI coverage: ${manifest.coverage.archetypes}/17 archetypes, ${manifest.coverage.boards}/34 direct boards\n\n## Census\n\n- Astro browser-computed color records: ${manifest.coverage.colors.astro_computed_records}\n- Penpot observed color records: ${manifest.coverage.colors.penpot_observed_records}; library colors: ${manifest.coverage.colors.penpot_library_resources}\n- Astro browser-computed typography records: ${manifest.coverage.typography.astro_computed_records}\n- Penpot observed typography records: ${manifest.coverage.typography.penpot_observed_records}; library typographies: ${manifest.coverage.typography.penpot_library_resources}\n- Contrast observations: ${contrastSummary.tested} total; ${contrastSummary.pass} AA pass; ${contrastSummary.fail} AA finding; ${contrastSummary.unresolved} complex-underlay unresolved\n\n## Review examples\n\n${representative.map(item => `- \`${item.case_id}\`: [Penpot](${item.penpot_url}) · Astro \`${item.astro_route}\` · \`${item.comparison}\``).join('\n')}\n\n## Boundary\n\nAll current→candidate rows are \`UNRESOLVED\`. No token merge, canonical Penpot foundation mutation or production Astro mutation is permitted before independent audits, synthesis and an owner decision.\n`;
writeFileSync(join(dir, 'README.md'), readme);
console.log(`${manifestPath}: ${sha256(manifestPath)} (${template.colors.length} colors, ${template.typography.length} typography rows)`);
