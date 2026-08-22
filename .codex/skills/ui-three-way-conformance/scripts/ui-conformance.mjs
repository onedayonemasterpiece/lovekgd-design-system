#!/usr/bin/env node
import { existsSync, rmSync } from 'node:fs';
import { basename, resolve, join } from 'node:path';
import {
  applicableException, changedScope, cleanupRuns, compareStructuralFacts, createBlockedComparisonBoard, createComparisonArtifacts, createComparisonBoard,
  createRunDirectory, finalStatus, makeRunManifest, prepareTelegramPublication,
  preflightTuple, publicationRetentionClass, readJson, refreshRunManifest, sha256, stableJson, stageAstroDiagnostic, validateAgentReview, validateCase, validateExceptionRegistry,
  validateTelegramReadback, writeJson,
} from './lib.mjs';

function args(argv) {
  const [command = 'help', ...rest] = argv; const values = { _: [] };
  for (let index = 0; index < rest.length; index += 1) {
    const value = rest[index];
    if (!value.startsWith('--')) values._.push(value);
    else {
      const key = value.slice(2); const next = rest[index + 1];
      if (!next || next.startsWith('--')) values[key] = true; else { values[key] = next; index += 1; }
    }
  }
  return { command, values };
}

function need(values, key) { if (!values[key]) throw new Error(`--${key} is required`); return values[key]; }
function print(value) { process.stdout.write(`${JSON.stringify(value, null, 2)}\n`); }
function fail(errors) { print({ ok: false, errors }); process.exitCode = 1; }

const help = `ui-conformance commands:
  validate-case --case <json>
  validate-exceptions --registry <json>
  init-run --artifacts-root <absolute> --run-id <id> [--retention-class <class>]
  compare --case <json> --actual-tuple <json> --astro <png> --astro-facts <json> --run-dir <dir> [--penpot <png> --penpot-facts <json>]
  finalize --case <json> --run-dir <dir> --actual-tuple <json> [--exception-registry <json>]
  telegram-plan --case <json> --run-dir <dir> [--publish-telegram --target-verified --prior-receipts <json>]
  telegram-readback --run-dir <dir> --receipt <json>
  changed-scope --registry <json> --files <newline-delimited-paths>
  clean --artifacts-root <absolute> [--dry-run] [--older-than <hours>] [--all-ephemeral] [--repository-root <absolute>]

Default local and CI mode never publishes to Telegram. No command mutates Penpot,
production UI, lifecycle, or accepted baselines.
`;

try {
  const { command, values } = args(process.argv.slice(2));
  if (command === 'help' || values.help) process.stdout.write(help);
  else if (command === 'validate-case') {
    const errors = validateCase(readJson(need(values, 'case'))); if (errors.length) fail(errors); else print({ ok: true });
  } else if (command === 'validate-exceptions') {
    const errors = validateExceptionRegistry(readJson(need(values, 'registry'))); if (errors.length) fail(errors); else print({ ok: true });
  } else if (command === 'init-run') {
    const manifest = makeRunManifest({ runId: need(values, 'run-id'), retentionClass: values['retention-class'] || 'failed-blocked-72h' });
    print({ ok: true, run_dir: createRunDirectory(resolve(need(values, 'artifacts-root')), manifest), manifest });
  } else if (command === 'compare') {
    const caseRow = readJson(need(values, 'case')); const runDir = resolve(need(values, 'run-dir'));
    for (const name of ['astro.png', 'penpot.png', 'overlay-50.png', 'diff.png', 'pixel-metrics.json', 'geometry.json', 'computed-style.json', 'structural-findings.json', 'preflight.json', 'comparison-board.png', 'final-receipt.json']) {
      rmSync(join(runDir, name), { force: true });
    }
    const preflight = preflightTuple(caseRow, readJson(need(values, 'actual-tuple')));
    const astroFacts = readJson(need(values, 'astro-facts'));
    const penpotFacts = preflight.status === 'READY_FOR_VISUAL_COMPARE' ? readJson(need(values, 'penpot-facts')) : null;
    const structural = preflight.status === 'READY_FOR_VISUAL_COMPARE'
      ? compareStructuralFacts(astroFacts, penpotFacts, caseRow.expected_candidate_deltas)
      : { status: 'blocked', findings: [], skipped_reason: `Exact tuple gate failed: ${(preflight.blockers || [preflight.status]).join(' + ')}` };
    writeJson(join(runDir, 'geometry.json'), { astro: astroFacts.root, penpot: preflight.status === 'READY_FOR_VISUAL_COMPARE' ? penpotFacts.root : null, skipped_reason: structural.skipped_reason || null });
    writeJson(join(runDir, 'computed-style.json'), { astro: astroFacts.typography || {}, penpot: preflight.status === 'READY_FOR_VISUAL_COMPARE' ? (penpotFacts.typography || {}) : null, skipped_reason: structural.skipped_reason || null });
    writeJson(join(runDir, 'structural-findings.json'), structural); writeJson(join(runDir, 'preflight.json'), preflight);
    let metrics = null;
    if (preflight.status === 'READY_FOR_VISUAL_COMPARE') metrics = createComparisonArtifacts({ astroPath: need(values, 'astro'), penpotPath: need(values, 'penpot'), runDir });
    else metrics = stageAstroDiagnostic({ astroPath: need(values, 'astro'), runDir, reason: (preflight.blockers || [preflight.status]).join(' + ') });
    print({ ok: preflight.status === 'READY_FOR_VISUAL_COMPARE', preflight, structural, metrics });
    if (preflight.status !== 'READY_FOR_VISUAL_COMPARE') process.exitCode = 2;
  } else if (command === 'finalize') {
    const caseRow = readJson(need(values, 'case')); const runDir = resolve(need(values, 'run-dir'));
    const preflight = existsSync(join(runDir, 'preflight.json')) ? readJson(join(runDir, 'preflight.json')) : preflightTuple(caseRow, readJson(need(values, 'actual-tuple')));
    const structural = readJson(join(runDir, 'structural-findings.json')); const reviewPath = join(runDir, 'agent-review.json');
    const review = existsSync(reviewPath) ? readJson(reviewPath) : null;
    if (review) { const errors = validateAgentReview(review, runDir); if (errors.length) { fail(errors); process.exit(); } }
    let exception = null;
    if (caseRow.exception_ref && values['exception-registry']) exception = applicableException(caseRow, readJson(values['exception-registry']));
    const final = finalStatus({ preflight, structural, review, exception }); const metrics = existsSync(join(runDir, 'pixel-metrics.json')) ? readJson(join(runDir, 'pixel-metrics.json')) : null;
    const blockers = structural.findings.filter((row) => row.severity === 'blocking').length;
    const runId = values['run-id'] || basename(runDir);
    const tupleStatus = (preflight.blockers || []).length ? preflight.blockers.join(' + ') : preflight.status;
    const board = existsSync(join(runDir, 'astro.png')) && existsSync(join(runDir, 'penpot.png'))
      ? createComparisonBoard({ runDir, caseRow, finalStatus: final.status, geometryBlockers: blockers, pixelRatio: metrics?.difference_ratio ?? null, fontStatus: (preflight.blockers || []).includes('BLOCKED_FONT_ENV') ? 'BLOCKED' : 'OK', tupleStatus, runId })
      : existsSync(join(runDir, 'astro.png')) ? createBlockedComparisonBoard({ runDir, caseRow, reason: (preflight.blockers || [preflight.status]).join(' + '), runId }) : null;
    const receipt = { schema_version: 'ui_conformance_final_receipt_v1', case_id: caseRow.case_id, fixture_mode: caseRow.fixture_mode, advisory: caseRow.fixture_mode === 'fresh-advisory', final, owner_status: 'AWAITING_REVIEW', preflight, structural_status: structural.status, agent_review_sha256: review ? sha256(stableJson(review)) : null, comparison_board: board, finalized_at: new Date().toISOString() };
    writeJson(join(runDir, 'final-receipt.json'), receipt);
    const runManifest = refreshRunManifest(runDir, { status: final.status, retentionClass: ['pass', 'minor'].includes(final.status) ? 'local-success-6h' : 'failed-blocked-72h' });
    print({ ...receipt, run_manifest: runManifest });
  } else if (command === 'telegram-plan') {
    const runDir = resolve(need(values, 'run-dir')); const receipt = readJson(join(runDir, 'final-receipt.json')); const metrics = existsSync(join(runDir, 'pixel-metrics.json')) ? readJson(join(runDir, 'pixel-metrics.json')) : null;
    const structural = readJson(join(runDir, 'structural-findings.json')); const prior = values['prior-receipts'] ? readJson(values['prior-receipts']) : [];
    const trustedCI = !(process.env.GITHUB_EVENT_NAME === 'pull_request' && process.env.GITHUB_HEAD_REPO_FORK === 'true');
    const plan = prepareTelegramPublication({ runDir, caseRow: readJson(need(values, 'case')), final: receipt.final, geometryBlockers: structural.findings.filter((row) => row.severity === 'blocking').length, pixelRatio: metrics?.difference_ratio ?? null, runId: basename(runDir), publish: Boolean(values['publish-telegram']), targetVerified: Boolean(values['target-verified']), trustedCI, priorReceipts: prior });
    print(plan); if (plan.status.startsWith('blocked')) process.exitCode = 2;
  } else if (command === 'telegram-readback') {
    const runDir = resolve(need(values, 'run-dir')); const plan = readJson(join(runDir, 'telegram-publish-plan.json')); const receipt = readJson(need(values, 'receipt')); const errors = validateTelegramReadback(receipt, plan);
    if (errors.length) fail(errors); else {
      writeJson(join(runDir, 'telegram-readback-receipt.json'), receipt);
      const finalReceipt = existsSync(join(runDir, 'final-receipt.json')) ? readJson(join(runDir, 'final-receipt.json')) : null;
      const retentionClass = publicationRetentionClass(finalReceipt?.final?.status);
      refreshRunManifest(runDir, { status: 'published-read-back', publishedMessageId: receipt.message_id, retentionClass });
      print({ ok: true, message_id: receipt.message_id, retention_class: retentionClass });
    }
  } else if (command === 'changed-scope') {
    const files = (await import('node:fs')).readFileSync(resolve(need(values, 'files')), 'utf8').split(/\r?\n/u).filter(Boolean);
    print({ ok: true, cases: changedScope(files, readJson(need(values, 'registry'))) });
  } else if (command === 'clean') {
    print(cleanupRuns({ root: resolve(need(values, 'artifacts-root')), dryRun: Boolean(values['dry-run']), olderThanHours: values['older-than'] === undefined ? null : Number(values['older-than']), allEphemeral: Boolean(values['all-ephemeral']), repositoryRoot: values['repository-root'] ? resolve(values['repository-root']) : null }));
  } else throw new Error(`Unknown command: ${command}`);
} catch (error) {
  fail([error instanceof Error ? error.message : String(error)]);
}
