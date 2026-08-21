import { createHash } from 'node:crypto';
import {
  existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, readdirSync,
  rmSync, statSync, writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, isAbsolute, join, parse, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

export const CASE_SCHEMA_VERSION = 'ui_conformance_case_v1';
export const MANIFEST_SCHEMA_VERSION = 'ui_conformance_run_manifest_v1';
export const AUTHORITY_MODES = new Set(['astro-reference', 'penpot-candidate-reference', 'promoted-contract-reference']);
export const PROFILES = new Set(['pixel-strict', 'state-sampled', 'structure-and-behavior', 'nonvisual']);
export const AGENT_VERDICTS = new Set(['pass', 'minor', 'fail', 'exception', 'blocked']);
export const DISPLAY_STATUS = Object.freeze({ pass: '✅ PASS', minor: '🟡 MINOR', fail: '🔴 FAIL', exception: '⚪ EXCEPTION', blocked: '⛔ BLOCKED' });
export const BLOCKERS = new Set([
  'BLOCKED_IDENTITY_MISMATCH', 'BLOCKED_FIXTURE_MISMATCH', 'BLOCKED_FONT_ENV',
  'BLOCKED_ASSET_MISMATCH', 'BLOCKED_PENPOT_EXPORT',
]);
const SHA256 = /^[a-f0-9]{64}$/u;
const GIT_SHA = /^[a-f0-9]{40}$/u;
const SAFE_ID = /^[a-z0-9][a-z0-9._-]{2,159}$/u;
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/u;

export function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  }
  return value;
}

export function stableJson(value) { return JSON.stringify(stableValue(value)); }
export function sha256(value) { return createHash('sha256').update(value).digest('hex'); }
export function sha256File(path) { return sha256(readFileSync(path)); }
export function readJson(path) { return JSON.parse(readFileSync(path, 'utf8')); }
export function writeJson(path, value) {
  mkdirSync(dirname(resolve(path)), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function expect(condition, message, errors) { if (!condition) errors.push(message); }
function nullableSha(value) { return value === null || SHA256.test(value || ''); }

export function validateCase(row) {
  const errors = [];
  expect(row && typeof row === 'object' && !Array.isArray(row), 'case must be an object', errors);
  if (errors.length) return errors;
  expect(row.schema_version === CASE_SCHEMA_VERSION, `schema_version must be ${CASE_SCHEMA_VERSION}`, errors);
  expect(SAFE_ID.test(row.case_id || ''), 'invalid case_id', errors);
  expect(SAFE_ID.test(row.component_id || ''), 'invalid component_id', errors);
  expect(typeof row.contract_version === 'string' && row.contract_version.length > 0, 'contract_version is required', errors);
  expect(SHA256.test(row.contract_sha256 || ''), 'contract_sha256 must be sha256', errors);
  expect(typeof row.state_key === 'string' && row.state_key.length > 0, 'state_key is required', errors);
  const fixtureNone = row.fixture_id === null;
  expect(fixtureNone ? row.fixture_sha256 === null && row.fixture_source === null && row.fixture_snapshot_sha256 === null
    : typeof row.fixture_id === 'string' && SHA256.test(row.fixture_sha256 || '') && typeof row.fixture_source === 'string' && SHA256.test(row.fixture_snapshot_sha256 || ''),
  'fixture fields must be all null or all exact', errors);
  expect(['blocking-golden', 'fresh-advisory'].includes(row.fixture_mode), 'invalid fixture_mode', errors);
  expect(SAFE_ID.test(row.viewport_id || ''), 'invalid viewport_id', errors);
  for (const key of ['viewport_width', 'viewport_height', 'container_width']) expect(Number.isInteger(row[key]) && row[key] > 0 && row[key] <= 8192, `${key} must be an integer 1..8192`, errors);
  expect(typeof row.device_scale_factor === 'number' && row.device_scale_factor > 0 && row.device_scale_factor <= 4, 'invalid device_scale_factor', errors);
  expect(AUTHORITY_MODES.has(row.authority_mode), 'invalid authority_mode', errors);
  expect(PROFILES.has(row.conformance_profile), 'invalid conformance_profile', errors);
  const p = row.penpot_binding || {};
  expect(UUID.test(p.file_id || ''), 'invalid penpot file_id', errors);
  expect(UUID.test(p.page_id || ''), 'invalid penpot page_id', errors);
  expect(/^Page [0-9]/u.test(p.page_label || ''), 'page_label must explicitly start with Page', errors);
  expect(UUID.test(p.board_or_component_id || ''), 'invalid Penpot board_or_component_id', errors);
  expect(/^Board /u.test(p.board_label || ''), 'board_label must explicitly start with Board', errors);
  expect(Number.isInteger(p.revision) || (typeof p.revision === 'string' && p.revision.length > 0), 'Penpot revision is required', errors);
  expect(nullableSha(p.export_sha256), 'invalid Penpot export_sha256', errors);
  expect(nullableSha(p.font_manifest_sha256), 'invalid Penpot font_manifest_sha256', errors);
  const a = row.astro_binding || {};
  expect(GIT_SHA.test(a.repository_sha || ''), 'invalid Astro repository_sha', errors);
  expect(GIT_SHA.test(a.candidate_package_sha || ''), 'invalid candidate_package_sha', errors);
  expect(typeof a.specimen_route === 'string' && a.specimen_route.startsWith('/'), 'invalid specimen_route', errors);
  expect(typeof a.root_selector === 'string' && a.root_selector.length > 0, 'root_selector is required', errors);
  expect(Array.isArray(row.expected_candidate_deltas), 'expected_candidate_deltas must be an array', errors);
  for (const [index, delta] of (row.expected_candidate_deltas || []).entries()) {
    expect(delta && typeof delta.region === 'string' && typeof delta.property === 'string' && typeof delta.reason === 'string' && Object.hasOwn(delta, 'expected'), `invalid expected_candidate_deltas[${index}]`, errors);
  }
  expect(row.exception_ref === null || typeof row.exception_ref === 'string', 'exception_ref must be null or string', errors);
  return errors;
}

export function validateAgentReview(review, runDir = null) {
  const errors = [];
  expect(review && typeof review === 'object' && !Array.isArray(review), 'agent review must be an object', errors);
  if (errors.length) return errors;
  expect(AGENT_VERDICTS.has(review.verdict), 'invalid agent verdict', errors);
  expect(Array.isArray(review.findings), 'findings must be an array', errors);
  for (const [index, finding] of (review.findings || []).entries()) {
    expect(finding && typeof finding.region === 'string' && ['info', 'minor', 'blocking'].includes(finding.severity)
      && typeof finding.kind === 'string' && typeof finding.description === 'string'
      && Array.isArray(finding.evidence_files) && finding.evidence_files.length > 0, `invalid finding ${index}`, errors);
  }
  const required = review.verdict === 'blocked' ? ['astro.png'] : ['astro.png', 'penpot.png', 'overlay-50.png', 'diff.png'];
  expect(Array.isArray(review.reviewed_files) && required.every((name) => review.reviewed_files.includes(name)), review.verdict === 'blocked' ? 'blocked review must inspect the Astro diagnostic' : 'all four image artifacts must be reviewed', errors);
  if (runDir) for (const name of required) expect(existsSync(join(runDir, name)), `reviewed file is missing: ${name}`, errors);
  expect(review.reviewer_kind === 'code-agent', 'reviewer_kind must be code-agent', errors);
  expect(!Number.isNaN(Date.parse(review.reviewed_at || '')), 'reviewed_at must be RFC3339', errors);
  return errors;
}

export function validateExceptionRegistry(registry) {
  const errors = [];
  expect(registry?.schema_version === 'ui_conformance_exception_registry_v1', 'invalid exception registry schema', errors);
  expect(Array.isArray(registry?.exceptions), 'exceptions must be an array', errors);
  const ids = new Set();
  for (const [index, row] of (registry?.exceptions || []).entries()) {
    expect(SAFE_ID.test(row.exception_id || '') && !ids.has(row.exception_id), `invalid/duplicate exception ${index}`, errors); ids.add(row.exception_id);
    expect(SAFE_ID.test(row.component_id || ''), `invalid component_id in exception ${index}`, errors);
    expect(typeof row.contract_version === 'string' && row.contract_version.length > 0, `missing contract_version in exception ${index}`, errors);
    for (const key of ['state_scope', 'region_or_behavior_scope', 'penpot_required_checkpoints', 'browser_test_refs']) {
      expect(Array.isArray(row[key]) && row[key].length > 0 && !row[key].includes('*'), `${key} must be bounded in exception ${index}`, errors);
    }
    expect(['state-sampled', 'structure-and-behavior', 'nonvisual'].includes(row.conformance_profile), `invalid exception profile ${index}`, errors);
    expect(row.review_on_contract_change === true, `exception ${index} must invalidate on contract change`, errors);
    expect(['candidate_exception', 'owner_approved'].includes(row.decision_status), `invalid decision status ${index}`, errors);
    if (row.decision_status !== 'owner_approved') expect(row.approved_at === null, `candidate exception ${index} cannot have approved_at`, errors);
  }
  return errors;
}

export function preflightTuple(caseRow, actual) {
  const caseErrors = validateCase(caseRow);
  if (caseErrors.length) return { status: 'BLOCKED_IDENTITY_MISMATCH', blockers: ['BLOCKED_IDENTITY_MISMATCH'], reasons: caseErrors };
  const reasons = [];
  const identityFields = [
    ['component_id', caseRow.component_id], ['contract_version', caseRow.contract_version],
    ['contract_sha256', caseRow.contract_sha256], ['state_key', caseRow.state_key],
    ['viewport_id', caseRow.viewport_id], ['viewport_width', caseRow.viewport_width],
    ['viewport_height', caseRow.viewport_height], ['container_width', caseRow.container_width],
    ['device_scale_factor', caseRow.device_scale_factor],
  ];
  for (const [key, expected] of identityFields) if (actual?.[key] !== expected) reasons.push(`${key}: expected ${expected}, got ${actual?.[key]}`);
  if (reasons.length) return { status: 'BLOCKED_IDENTITY_MISMATCH', blockers: ['BLOCKED_IDENTITY_MISMATCH'], reasons };
  const blockers = []; const remainingReasons = [];
  if (actual?.penpot_export_sha256 && actual?.penpot_renderable_native_surface !== true) {
    blockers.push('BLOCKED_IDENTITY_MISMATCH');
    remainingReasons.push('Penpot binding is not an exact renderable native component or instance');
  }
  if (actual?.penpot_renderable_native_surface === true) {
    if (actual?.penpot_component_id !== caseRow.component_id) {
      if (!blockers.includes('BLOCKED_IDENTITY_MISMATCH')) blockers.push('BLOCKED_IDENTITY_MISMATCH');
      remainingReasons.push(`Penpot component_id: expected ${caseRow.component_id}, got ${actual?.penpot_component_id}`);
    }
    if (actual?.penpot_state_key !== caseRow.state_key) {
      if (!blockers.includes('BLOCKED_IDENTITY_MISMATCH')) blockers.push('BLOCKED_IDENTITY_MISMATCH');
      remainingReasons.push(`Penpot state_key: expected ${caseRow.state_key}, got ${actual?.penpot_state_key}`);
    }
  }
  const fixtureFields = ['fixture_id', 'fixture_sha256', 'fixture_snapshot_sha256'];
  const fixtureReasons = fixtureFields.filter((key) => actual?.[key] !== caseRow[key]).map((key) => `Astro ${key} mismatch`);
  for (const key of fixtureFields) if ((actual?.[`penpot_${key}`] ?? null) !== (caseRow[key] ?? null)) fixtureReasons.push(`Penpot ${key} mismatch`);
  if (caseRow.fixture_id !== null && actual?.penpot_resolved_render_case_sha256 !== actual?.resolved_render_case_sha256) fixtureReasons.push('Penpot and Astro resolved-render-case hashes differ');
  if (fixtureReasons.length) { blockers.push('BLOCKED_FIXTURE_MISMATCH'); remainingReasons.push(...fixtureReasons); }
  if (actual.font_loaded !== true || actual.font_manifest_sha256 !== caseRow.penpot_binding.font_manifest_sha256) { blockers.push('BLOCKED_FONT_ENV'); remainingReasons.push('font load or manifest mismatch'); }
  if (actual.asset_manifest_sha256 && actual.expected_asset_manifest_sha256 && actual.asset_manifest_sha256 !== actual.expected_asset_manifest_sha256) { blockers.push('BLOCKED_ASSET_MISMATCH'); remainingReasons.push('Astro asset manifest mismatch'); }
  if (caseRow.fixture_id !== null && actual.penpot_asset_manifest_sha256 !== actual.expected_asset_manifest_sha256) { blockers.push('BLOCKED_ASSET_MISMATCH'); remainingReasons.push('Penpot asset manifest is missing or mismatched'); }
  if (!caseRow.penpot_binding.export_sha256 || actual.penpot_export_sha256 !== caseRow.penpot_binding.export_sha256) { blockers.push('BLOCKED_PENPOT_EXPORT'); remainingReasons.push('exact Penpot export is missing or hash-mismatched'); }
  if (blockers.length) return { status: blockers[0], blockers, reasons: remainingReasons };
  return { status: 'READY_FOR_VISUAL_COMPARE', blockers: [], reasons: [] };
}

function num(value) { return typeof value === 'number' && Number.isFinite(value) ? value : null; }
function addFinding(findings, region, kind, expected, actual, severity = 'blocking') { findings.push({ region, severity, kind, expected, actual }); }

export function compareStructuralFacts(astro = {}, penpot = {}, deltas = []) {
  const findings = [];
  const covered = new Set(deltas.map((row) => `${row.region}:${row.property}`));
  const mismatch = (region, property, expected, actual, severity = 'blocking') => {
    if (covered.has(`${region}:${property}`) && stableJson(actual) === stableJson(deltas.find((d) => d.region === region && d.property === property)?.expected)) {
      addFinding(findings, region, 'expected-candidate-delta', expected, actual, 'minor');
    } else addFinding(findings, region, property, expected, actual, severity);
  };
  for (const prop of ['width', 'height']) {
    const av = num(astro.root?.[prop]); const pv = num(penpot.root?.[prop]);
    if (av === null || pv === null || Math.abs(av - pv) > 0.75) mismatch('root', prop, av, pv);
  }
  for (const prop of ['padding', 'gap', 'border_radius', 'border', 'background_color', 'color', 'box_shadow', 'opacity']) {
    if (stableJson(astro.box_model?.[prop] ?? null) !== stableJson(penpot.box_model?.[prop] ?? null)) mismatch('root', prop, astro.box_model?.[prop] ?? null, penpot.box_model?.[prop] ?? null);
  }
  const astroRegions = astro.regions || {}; const penpotRegions = penpot.regions || {};
  for (const key of new Set([...Object.keys(astroRegions), ...Object.keys(penpotRegions)])) {
    if (!astroRegions[key] || !penpotRegions[key]) mismatch(key, 'presence', Boolean(astroRegions[key]), Boolean(penpotRegions[key]));
    else for (const prop of ['x', 'y', 'width', 'height']) if (num(astroRegions[key][prop]) !== null && num(penpotRegions[key][prop]) !== null && Math.abs(astroRegions[key][prop] - penpotRegions[key][prop]) > 0.75) mismatch(key, prop, astroRegions[key][prop], penpotRegions[key][prop]);
  }
  const textKeys = ['font_family', 'font_weight', 'font_size', 'line_height', 'line_count', 'overflow'];
  for (const region of new Set([...Object.keys(astro.typography || {}), ...Object.keys(penpot.typography || {})])) {
    for (const prop of textKeys) if (stableJson(astro.typography?.[region]?.[prop]) !== stableJson(penpot.typography?.[region]?.[prop])) mismatch(region, prop, astro.typography?.[region]?.[prop], penpot.typography?.[region]?.[prop]);
  }
  for (const region of new Set([...Object.keys(astro.region_styles || {}), ...Object.keys(penpot.region_styles || {})])) {
    for (const prop of ['padding', 'gap', 'border_radius', 'border', 'background_color', 'color', 'box_shadow', 'opacity']) {
      if (stableJson(astro.region_styles?.[region]?.[prop] ?? null) !== stableJson(penpot.region_styles?.[region]?.[prop] ?? null)) mismatch(region, `style.${prop}`, astro.region_styles?.[region]?.[prop] ?? null, penpot.region_styles?.[region]?.[prop] ?? null);
    }
  }
  for (const prop of ['icon_ids', 'region_order', 'nested_component_ids', 'media_fit', 'media_position', 'crop_window', 'state_markers']) {
    if (stableJson(astro[prop] ?? null) !== stableJson(penpot[prop] ?? null)) mismatch('root', prop, astro[prop] ?? null, penpot[prop] ?? null);
  }
  if ((astro.forbidden_consumer_overrides || []).length) addFinding(findings, 'consumer', 'forbidden-consumer-override', [], astro.forbidden_consumer_overrides);
  return { status: findings.some((row) => row.severity === 'blocking') ? 'fail' : findings.length ? 'minor' : 'pass', findings };
}

function command(name, args, options = {}) {
  const result = spawnSync(name, args, { encoding: 'utf8', ...options });
  if (result.error || result.status !== 0) throw new Error(`${name} failed: ${(result.error?.message || result.stderr || result.stdout).trim()}`);
  return result;
}

const MAGICK7 = spawnSync('magick', ['-version'], { encoding: 'utf8' }).status === 0;
function imageConvert(args) { return command(MAGICK7 ? 'magick' : 'convert', args); }
function imageIdentify(args) { return command(MAGICK7 ? 'magick' : 'identify', MAGICK7 ? ['identify', ...args] : args); }
function imageCompare(args) { return spawnSync(MAGICK7 ? 'magick' : 'compare', MAGICK7 ? ['compare', ...args] : args, { encoding: 'utf8' }); }

export function imageDimensions(path) {
  const result = imageIdentify(['-format', '%w %h', resolve(path)]);
  const [width, height] = result.stdout.trim().split(/\s+/u).map(Number);
  if (!Number.isInteger(width) || !Number.isInteger(height)) throw new Error(`Could not identify PNG: ${path}`);
  return { width, height };
}

export function createComparisonArtifacts({ astroPath, penpotPath, runDir }) {
  const dir = resolve(runDir); mkdirSync(dir, { recursive: true });
  const astro = join(dir, 'astro.png'); const penpot = join(dir, 'penpot.png');
  writeFileSync(astro, readFileSync(resolve(astroPath))); writeFileSync(penpot, readFileSync(resolve(penpotPath)));
  const ad = imageDimensions(astro); const pd = imageDimensions(penpot);
  const width = Math.max(ad.width, pd.width); const height = Math.max(ad.height, pd.height);
  const ac = join(dir, '.astro-canvas.png'); const pc = join(dir, '.penpot-canvas.png');
  imageConvert([astro, '-background', 'none', '-gravity', 'northwest', '-extent', `${width}x${height}`, ac]);
  imageConvert([penpot, '-background', 'none', '-gravity', 'northwest', '-extent', `${width}x${height}`, pc]);
  imageConvert([ac, pc, '-define', 'compose:args=50', '-compose', 'blend', '-composite', '-strip', join(dir, 'overlay-50.png')]);
  imageConvert([ac, pc, '-compose', 'difference', '-composite', '-strip', join(dir, 'diff.png')]);
  const metric = imageCompare(['-metric', 'AE', ac, pc, 'null:']);
  if (![0, 1].includes(metric.status)) throw new Error(`Image comparison failed: ${(metric.stderr || metric.stdout).trim()}`);
  const absoluteError = Number.parseFloat((metric.stderr || metric.stdout).trim()) || 0;
  rmSync(ac); rmSync(pc);
  const metrics = {
    no_automatic_scaling: true, alignment: 'top-left-common-canvas', astro_dimensions: ad,
    penpot_dimensions: pd, comparison_canvas: { width, height }, same_dimensions: ad.width === pd.width && ad.height === pd.height,
    absolute_error_pixels: absoluteError, pixel_count: width * height,
    difference_ratio: width * height ? absoluteError / (width * height) : null,
    final_verdict_derived_from_threshold: false,
  };
  writeJson(join(dir, 'pixel-metrics.json'), metrics); return metrics;
}

export function stageAstroDiagnostic({ astroPath, runDir, reason }) {
  const dir = resolve(runDir); mkdirSync(dir, { recursive: true }); const astro = join(dir, 'astro.png');
  writeFileSync(astro, readFileSync(resolve(astroPath)));
  const metrics = { no_automatic_scaling: true, diagnostic_only: true, skipped_reason: reason, astro_dimensions: imageDimensions(astro), penpot_dimensions: null, difference_ratio: null, final_verdict_derived_from_threshold: false };
  writeJson(join(dir, 'pixel-metrics.json'), metrics); return metrics;
}

function statusColor(status) {
  return ({ pass: '#18794E', minor: '#9A6700', fail: '#C9372C', exception: '#59636E', blocked: '#5E6472' })[status] || '#5E6472';
}

export function createComparisonBoard({ runDir, caseRow, finalStatus, geometryBlockers = 0, pixelRatio = null, fontStatus = 'OK', tupleStatus = 'READY', runId }) {
  const dir = resolve(runDir); const astro = join(dir, 'astro.png'); const penpot = join(dir, 'penpot.png');
  const ad = imageDimensions(astro); const pd = imageDimensions(penpot); const gap = 28; const pad = 32;
  const bodyWidth = ad.width + pd.width + gap + pad * 2;
  if (bodyWidth > 2048) throw new Error(`Comparison board would exceed 2048px without forbidden scaling: ${bodyWidth}px`);
  const header = 170; const footer = 110; const label = 42; const bodyHeight = Math.max(ad.height, pd.height);
  const totalHeight = header + label + bodyHeight + footer + pad;
  const status = DISPLAY_STATUS[finalStatus] || DISPLAY_STATUS.blocked;
  const title = `${status} · ${caseRow.component_id}`;
  const state = `State: ${caseRow.state_key}`;
  const sub = `Contract ${caseRow.contract_version} · fixture ${caseRow.fixture_id ?? 'none'} · ${caseRow.viewport_id}`;
  const foot = `Geometry blockers: ${geometryBlockers} · Pixel diff: ${pixelRatio === null ? 'n/a' : pixelRatio.toFixed(6)} · Fonts: ${fontStatus}`;
  const tupleLine = `Tuple: ${tupleStatus}`; const runLine = `Run ${runId} · ${caseRow.authority_mode} · ${caseRow.contract_sha256.slice(0, 10)}`;
  const output = join(dir, 'comparison-board.png');
  imageConvert([
    '-size', `${bodyWidth}x${totalHeight}`, `xc:#111418`,
    '-fill', statusColor(finalStatus), '-draw', `rectangle 0,0 ${bodyWidth},${header}`,
    '-font', 'DejaVu-Sans-Bold', '-fill', 'white', '-pointsize', '28', '-annotate', `+${pad}+40`, title,
    '-font', 'DejaVu-Sans', '-pointsize', '14', '-annotate', `+${pad}+78`, state,
    '-pointsize', '16', '-annotate', `+${pad}+114`, sub,
    '-font', 'DejaVu-Sans-Bold', '-pointsize', '18', '-annotate', `+${pad}+${header + 29}`, 'ASTRO',
    '-annotate', `+${pad + ad.width + gap}+${header + 29}`, 'PENPOT',
    astro, '-geometry', `+${pad}+${header + label}`, '-composite',
    penpot, '-geometry', `+${pad + ad.width + gap}+${header + label}`, '-composite',
    '-font', 'DejaVu-Sans', '-fill', '#E6E9ED', '-pointsize', '13', '-annotate', `+${pad}+${header + label + bodyHeight + 34}`, foot,
    '-pointsize', '11', '-annotate', `+${pad}+${header + label + bodyHeight + 58}`, tupleLine,
    '-pointsize', '9', '-annotate', `+${pad}+${header + label + bodyHeight + 82}`, runLine,
    '-strip', output,
  ]);
  return { path: output, sha256: sha256File(output), width: bodyWidth, height: totalHeight, actual_scale: 1, stretched: false };
}

export function createBlockedComparisonBoard({ runDir, caseRow, reason, runId }) {
  const dir = resolve(runDir); const astro = join(dir, 'astro.png'); const ad = imageDimensions(astro);
  const rightWidth = Math.max(420, ad.width); const gap = 28; const pad = 32; const bodyWidth = ad.width + rightWidth + gap + pad * 2;
  if (bodyWidth > 2048) throw new Error(`Blocked comparison board would exceed 2048px without forbidden scaling: ${bodyWidth}px`);
  const header = 170; const label = 42; const footer = 92; const bodyHeight = Math.max(ad.height, 260); const totalHeight = header + label + bodyHeight + footer + pad;
  const output = join(dir, 'comparison-board.png'); const rightX = pad + ad.width + gap; const bodyY = header + label; const reasons = reason.split(' + ');
  const commandArgs = [
    '-size', `${bodyWidth}x${totalHeight}`, 'xc:#111418',
    '-fill', statusColor('blocked'), '-draw', `rectangle 0,0 ${bodyWidth},${header}`,
    '-font', 'DejaVu-Sans-Bold', '-fill', 'white', '-pointsize', '28', '-annotate', `+${pad}+40`, `${DISPLAY_STATUS.blocked} · ${caseRow.component_id}`,
    '-font', 'DejaVu-Sans', '-pointsize', '14', '-annotate', `+${pad}+78`, `State: ${caseRow.state_key}`,
    '-pointsize', '16', '-annotate', `+${pad}+114`, `Contract ${caseRow.contract_version} · fixture ${caseRow.fixture_id ?? 'none'} · ${caseRow.viewport_id}`,
    '-font', 'DejaVu-Sans-Bold', '-pointsize', '18', '-annotate', `+${pad}+${header + 29}`, 'ASTRO',
    '-annotate', `+${rightX}+${header + 29}`, 'PENPOT',
    astro, '-geometry', `+${pad}+${bodyY}`, '-composite',
    '-fill', '#252A31', '-draw', `roundrectangle ${rightX},${bodyY} ${rightX + rightWidth},${bodyY + bodyHeight} 18,18`,
    '-font', 'DejaVu-Sans-Bold', '-fill', '#FFFFFF', '-pointsize', '24', '-annotate', `+${rightX + 28}+${bodyY + 80}`, 'СРАВНЕНИЕ НЕ ЗАПУЩЕНО',
    '-font', 'DejaVu-Sans', '-fill', '#D5D9DF', '-pointsize', '14',
  ];
  reasons.forEach((value, index) => commandArgs.push('-annotate', `+${rightX + 28}+${bodyY + 122 + index * 28}`, value));
  commandArgs.push(
    '-fill', '#E6E9ED', '-pointsize', '13', '-annotate', `+${pad}+${header + label + bodyHeight + 34}`, `Blockers: ${reasons.length} · no scaling · see Penpot panel`,
    '-pointsize', '10', '-annotate', `+${pad}+${header + label + bodyHeight + 60}`, `Run ${runId} · ${caseRow.authority_mode} · ${caseRow.contract_sha256.slice(0, 10)}`,
    '-strip', output,
  );
  imageConvert(commandArgs);
  return { path: output, sha256: sha256File(output), width: bodyWidth, height: totalHeight, actual_scale: 1, stretched: false, diagnostic_only: true };
}

export function finalStatus({ preflight, structural, review, exception = null }) {
  if (preflight?.status?.startsWith('BLOCKED_')) return { status: 'blocked', reason: preflight.status };
  if (structural?.status === 'fail') return { status: 'fail', reason: 'STRUCTURAL_FAILURE' };
  if (!review) return { status: 'blocked', reason: 'BLOCKED_AGENT_REVIEW_MISSING' };
  if (review.verdict === 'exception') {
    if (!exception || exception.decision_status !== 'owner_approved') return { status: 'exception', reason: 'CANDIDATE_EXCEPTION' };
    return { status: 'exception', reason: 'SCOPED_EXCEPTION' };
  }
  return { status: review.verdict, reason: `AGENT_${review.verdict.toUpperCase()}` };
}

export function applicableException(caseRow, registry) {
  if (!caseRow.exception_ref || !registry?.exceptions) return null;
  const row = registry.exceptions.find((item) => item.exception_id === caseRow.exception_ref);
  if (!row || row.component_id !== caseRow.component_id || row.contract_version !== caseRow.contract_version) return null;
  return row;
}

export function makeRunManifest({ runId, status = 'running', retentionClass = 'failed-blocked-72h', createdAt = new Date(), keep = false }) {
  const hours = ({ 'local-success-6h': 6, 'published-24h': 24, 'failed-blocked-72h': 72, 'gha-3d': 72, 'mass-owner-7d': 168 })[retentionClass];
  if (!hours) throw new Error(`Invalid retention class: ${retentionClass}`);
  return {
    schema_version: MANIFEST_SCHEMA_VERSION, run_id: runId,
    created_at: createdAt.toISOString(), expires_at: new Date(createdAt.getTime() + hours * 3600_000).toISOString(),
    retention_class: retentionClass, status, bytes: 0, published_message_id: null, keep, durable: false,
  };
}

export function createRunDirectory(root, manifest) {
  assertSafeArtifactRoot(root);
  if (!SAFE_ID.test(manifest.run_id || '')) throw new Error('Invalid run ID');
  const dir = resolve(root, manifest.run_id); mkdirSync(dir, { recursive: false });
  writeFileSync(join(dir, '.ui-conformance-run'), 'ui-conformance-run-v1\n'); writeJson(join(dir, 'manifest.json'), manifest);
  return dir;
}

export function assertSafeArtifactRoot(root, repositoryRoot = null) {
  if (!root || !isAbsolute(root)) throw new Error('Artifact root must be absolute');
  const resolved = resolve(root); const filesystemRoot = parse(resolved).root; const home = resolve(homedir());
  if (resolved === filesystemRoot || resolved === home || resolved.length < 16) throw new Error(`Unsafe artifact root: ${resolved}`);
  if (repositoryRoot && resolved === resolve(repositoryRoot)) throw new Error('Artifact root cannot equal repository root');
  if (existsSync(resolved) && lstatSync(resolved).isSymbolicLink()) throw new Error('Artifact root cannot be a symlink');
  return resolved;
}

function directoryBytes(path) {
  let total = 0;
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const child = join(path, entry.name);
    if (entry.isSymbolicLink()) continue;
    total += entry.isDirectory() ? directoryBytes(child) : statSync(child).size;
  }
  return total;
}

export function refreshRunManifest(runDir, { status, publishedMessageId = undefined, retentionClass = undefined } = {}) {
  const dir = resolve(runDir); const marker = join(dir, '.ui-conformance-run'); const path = join(dir, 'manifest.json');
  if (!existsSync(marker) || !existsSync(path)) throw new Error('Run marker or manifest is missing');
  const manifest = readJson(path); if (manifest.schema_version !== MANIFEST_SCHEMA_VERSION || manifest.run_id !== basename(dir) || manifest.durable !== false) throw new Error('Invalid ephemeral run manifest');
  if (status) manifest.status = status;
  if (publishedMessageId !== undefined) manifest.published_message_id = publishedMessageId;
  if (retentionClass) {
    const hours = ({ 'local-success-6h': 6, 'published-24h': 24, 'failed-blocked-72h': 72, 'gha-3d': 72, 'mass-owner-7d': 168 })[retentionClass];
    if (!hours) throw new Error(`Invalid retention class: ${retentionClass}`);
    manifest.retention_class = retentionClass; manifest.expires_at = new Date(Date.parse(manifest.created_at) + hours * 3600_000).toISOString();
  }
  manifest.bytes = 0; writeJson(path, manifest); manifest.bytes = directoryBytes(dir); writeJson(path, manifest); return manifest;
}

export function cleanupRuns({ root, now = new Date(), dryRun = false, olderThanHours = null, allEphemeral = false, diskCapBytes = 2 * 1024 ** 3, repositoryRoot = null }) {
  const artifactRoot = assertSafeArtifactRoot(root, repositoryRoot); if (!existsSync(artifactRoot)) return { removed: [], skipped: [], bytes_removed: 0, dry_run: dryRun };
  const rootReal = realpathSync(artifactRoot); const candidates = []; const skipped = [];
  for (const entry of readdirSync(artifactRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.isSymbolicLink()) { skipped.push({ name: entry.name, reason: 'not-real-directory' }); continue; }
    const dir = join(artifactRoot, entry.name); const real = realpathSync(dir);
    if (relative(rootReal, real).startsWith('..')) { skipped.push({ name: entry.name, reason: 'symlink-escape' }); continue; }
    if (!existsSync(join(dir, '.ui-conformance-run')) || !existsSync(join(dir, 'manifest.json'))) { skipped.push({ name: entry.name, reason: 'missing-marker-or-manifest' }); continue; }
    let manifest; try { manifest = readJson(join(dir, 'manifest.json')); } catch { skipped.push({ name: entry.name, reason: 'invalid-manifest-json' }); continue; }
    if (manifest.schema_version !== MANIFEST_SCHEMA_VERSION || manifest.run_id !== entry.name || manifest.durable !== false) { skipped.push({ name: entry.name, reason: 'invalid-or-durable-manifest' }); continue; }
    if (existsSync(join(dir, '.lock')) || manifest.keep === true) { skipped.push({ name: entry.name, reason: existsSync(join(dir, '.lock')) ? 'active-lock' : 'keep' }); continue; }
    const created = Date.parse(manifest.created_at); const expires = Date.parse(manifest.expires_at);
    if (!Number.isFinite(created) || !Number.isFinite(expires)) { skipped.push({ name: entry.name, reason: 'invalid-manifest-dates' }); continue; }
    const ageHours = (now.getTime() - created) / 3600_000; const eligible = allEphemeral || (olderThanHours !== null ? ageHours >= olderThanHours : now.getTime() >= expires);
    candidates.push({ name: entry.name, dir, created, eligible, bytes: directoryBytes(dir) });
  }
  const chosen = new Set(candidates.filter((row) => row.eligible).map((row) => row.name));
  let remaining = candidates.filter((row) => !chosen.has(row.name)).reduce((sum, row) => sum + row.bytes, 0);
  for (const row of [...candidates].sort((a, b) => a.created - b.created)) if (remaining > diskCapBytes && !chosen.has(row.name)) { chosen.add(row.name); remaining -= row.bytes; }
  const removed = []; let bytesRemoved = 0;
  for (const row of candidates) {
    if (!chosen.has(row.name)) { skipped.push({ name: row.name, reason: 'not-eligible' }); continue; }
    removed.push({ name: row.name, bytes: row.bytes }); bytesRemoved += row.bytes;
    if (!dryRun) rmSync(row.dir, { recursive: true, force: false });
  }
  return { removed, skipped, bytes_removed: bytesRemoved, dry_run: dryRun };
}

export function telegramCaption({ caseRow, final, geometryBlockers, pixelRatio, runId }) {
  const status = DISPLAY_STATUS[final.status] || DISPLAY_STATUS.blocked;
  const comparison = final.status === 'blocked' ? 'Comparison: NOT RUN (exact tuple gate)' : 'Comparison: completed';
  return `${status.split(' · ')[0]} UI CONFORMANCE · ${final.status.toUpperCase()}\n\n${caseRow.component_id} · ${caseRow.state_key}\nFixture: ${caseRow.fixture_id ?? 'none'} · ${caseRow.fixture_mode}\nAuthority: ${caseRow.authority_mode}\nContract: ${caseRow.contract_version} · ${caseRow.contract_sha256.slice(0, 10)}\n${comparison}\nGeometry blockers: ${geometryBlockers}\nPixel/perceptual diff: ${pixelRatio ?? 'n/a'}\n\nAgent verdict: ${final.status.toUpperCase()}\nOwner status: AWAITING_REVIEW\nRun: ${runId}`;
}

export function prepareTelegramPublication({ runDir, caseRow, final, geometryBlockers, pixelRatio, runId, publish = false, targetVerified = false, trustedCI = true, priorReceipts = [] }) {
  const image = join(resolve(runDir), 'comparison-board.png'); if (!existsSync(image)) throw new Error('comparison-board.png is missing');
  const caption = telegramCaption({ caseRow, final, geometryBlockers, pixelRatio, runId });
  const contentHash = sha256(Buffer.concat([readFileSync(image), Buffer.from(caption)]));
  const duplicate = priorReceipts.find((row) => row.content_hash === contentHash && row.read_back_status === 'verified');
  const superseded = [...priorReceipts].reverse().find((row) => row.case_id === caseRow.case_id && row.read_back_status === 'verified' && row.content_hash !== contentHash);
  const plan = {
    schema_version: 'ui_conformance_telegram_publish_plan_v1', target_link: 'https://t.me/c/4337049383/1030', topic_root_message_id: 1030,
    case_id: caseRow.case_id, run_id: runId, image_path: image, image_sha256: sha256File(image), caption,
    caption_sha256: sha256(caption), content_hash: contentHash, publish_requested: publish,
    status: duplicate ? 'deduplicated' : !publish ? 'dry-run' : !trustedCI ? 'blocked-untrusted-ci' : !targetVerified ? 'blocked-target-not-verified' : 'ready-for-existing-human-session-transport',
    duplicate_message_id: duplicate?.message_id ?? null, supersedes_message_id: superseded?.message_id ?? null,
  };
  writeJson(join(resolve(runDir), 'telegram-publish-plan.json'), plan); return plan;
}

export function validateTelegramReadback(receipt, plan) {
  const errors = [];
  expect(receipt?.schema_version === 'ui_conformance_telegram_readback_receipt_v1', 'invalid Telegram receipt schema', errors);
  expect(receipt?.topic_root_message_id === 1030, 'wrong Telegram topic root', errors);
  expect(receipt?.case_id === plan.case_id && receipt?.run_id === plan.run_id, 'Telegram case/run mismatch', errors);
  expect(receipt?.local_image_sha256 === plan.image_sha256 && receipt?.caption_sha256 === plan.caption_sha256, 'Telegram content hash mismatch', errors);
  expect(receipt?.read_back_status === 'verified' && Number.isInteger(receipt?.message_id), 'Telegram send lacks exact read-back', errors);
  expect(new RegExp(`^https://t\\.me/c/4337049383/${receipt?.message_id}$`, 'u').test(receipt?.message_link || ''), 'Telegram message link mismatch', errors);
  return errors;
}

export function changedScope(files, registry) {
  const changed = new Set(files.filter(Boolean)); const selected = [];
  for (const row of registry.cases || []) {
    const refs = row.affected_paths || [];
    if (refs.some((path) => [...changed].some((file) => file === path || file.startsWith(`${path}/`) || path.startsWith(`${file}/`)))) selected.push(row.case_id);
  }
  return [...new Set(selected)].sort();
}
