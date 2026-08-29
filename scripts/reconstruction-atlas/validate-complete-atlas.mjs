import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const atlasRoot = path.join(repoRoot, 'catalog/reconstruction-atlas/v1');
const globalRoot = path.join(repoRoot, 'catalog/global-archetype-sot-v1');
const read = (base, file) => JSON.parse(fs.readFileSync(path.join(base, file), 'utf8'));
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const semanticValidation = read(atlasRoot, 'validation-report.v1.json');
const irValidation = read(atlasRoot, 'penpot/materialization-ir-validation.v1.json');
const ir = read(atlasRoot, 'penpot/materialization-ir.v1.json');
const audit = read(atlasRoot, 'penpot/closure-audit.v1.json');
const bindings = read(atlasRoot, 'penpot/bindings.v1.json');
const globalSot = read(globalRoot, 'manifest.v1.json');
const gapLedger = read(atlasRoot, 'gap-ledger.v1.json');
const testSummary = read(atlasRoot, 'test-summary.v1.json');
const checks = [];
const check = (id, pass, actual) => checks.push({ id, pass: Boolean(pass), actual });

check('semantic-validation', semanticValidation.status === 'SEMANTIC_ATLAS_READY_FOR_PENPOT_BATCH' && semanticValidation.fail_count === 0, semanticValidation.status);
check('materialization-ir-validation', irValidation.status === 'MATERIALIZATION_IR_READY' && irValidation.fail_count === 0, irValidation.status);
check('global-sot-schema', globalSot.schema_version === 'global-archetype-sot-v1', globalSot.schema_version);
check('global-sot-input-hash', ir.global_archetype_sot_v1.sha256 === sha(path.join(globalRoot, 'manifest.v1.json')), ir.global_archetype_sot_v1);
check('penpot-materialized', audit.status === 'PENPOT_BATCH_MATERIALIZED' && bindings.status === 'BATCH_MATERIALIZED', { audit: audit.status, bindings: bindings.status });
check('archetypes-100', audit.counts.owner_pages === 17 && audit.gates.archetype_coverage_percent === 100, audit.counts.owner_pages);
check('routes-100', audit.gates.route_coverage_percent === 100, audit.gates.route_coverage_percent);
check('projections-51', audit.counts.projections === 51 && audit.gates.desktop_mobile_unique_states, audit.counts.projections);
check('three-projections-each', audit.pages.every((p) => p.projections.length === 3 && p.top_level_count === 3), audit.pages.map((p) => ({ id: p.archetype_id, projections: p.projections.length, top: p.top_level_count })));
check('stable-ids-unique', audit.gates.stable_duplicate_count === 0 && audit.stable_duplicates.length === 0, audit.stable_duplicates);
check('detached-zero', audit.gates.detached_count === 0, audit.gates.detached_count);
check('unregistered-overrides-zero', audit.gates.unregistered_override_count === 0 && audit.dimension_overrides.length === 0, audit.dimension_overrides);
check('fonts-conform', audit.gates.font_failure_count === 0 && audit.font_failures.length === 0, audit.font_failures);
check('penpot-validate-empty', Array.isArray(audit.gates.validation) && audit.gates.validation.length === 0, audit.gates.validation);
check('sampled-conformance-pass', audit.gates.sampled_conformance_pass && audit.samples.length >= 5 && audit.samples.every((s) => s.status === 'PASS'), audit.samples);
check('idempotency-replay', audit.gates.idempotency_replay_created === 0, audit.gates.idempotency_replay_created);
check('one-review-route', audit.gates.review_route_count === 1 && audit.review.rows.length === 17 && audit.review.rows.every((r) => r.is_copy), audit.review.rows.length);
check('review-route-bound', bindings.review_route.page_id === audit.review.page_id && bindings.review_route.linked_row_count === 17, bindings.review_route);
check('gap-ledger-current', audit.gates.gap_ledger === 'catalog/reconstruction-atlas/v1/gap-ledger.v1.json' && gapLedger.gaps.length > 0, gapLedger.status);
check('renderer-delta-registered', audit.renderer_deltas.every((d) => d.status === 'NON_BLOCKING'), audit.renderer_deltas);
check('forbidden-operations', globalSot.operating_contract.forbidden.join(',') === 'redesign,backport,merge,promotion,deploy', globalSot.operating_contract.forbidden);
check('binding-audit-hash', bindings.closure.audit_sha256 === sha(path.join(atlasRoot, 'penpot/closure-audit.v1.json')), bindings.closure.audit_sha256);
check('required-scope-tests', testSummary.required_scope.status === 'PASS' && testSummary.required_scope.failed === 0, testSummary.required_scope);
check('broader-suite-failure-registered', testSummary.broader_suite.failed === testSummary.broader_suite.registered_out_of_scope_failures.length && testSummary.broader_suite.registered_out_of_scope_failures.every((f) => f.impact_on_atlas === 'NONE'), testSummary.broader_suite);

const failures = checks.filter((row) => !row.pass);
const report = {
  schema_version: 'complete-reconstruction-atlas-validation.v1',
  generated_at: new Date().toISOString(),
  status: failures.length ? 'RECONSTRUCTION_ATLAS_NOT_READY' : 'RECONSTRUCTION_ATLAS_READY',
  check_count: checks.length,
  fail_count: failures.length,
  review_route: bindings.review_route,
  gap_ledger: audit.gates.gap_ledger,
  renderer_deltas: audit.renderer_deltas,
  test_summary: testSummary,
  checks,
};
fs.writeFileSync(path.join(atlasRoot, 'completion-report.v1.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, check_count: report.check_count, fail_count: report.fail_count, review_url: report.review_route.url }, null, 2));
if (failures.length) process.exitCode = 1;
