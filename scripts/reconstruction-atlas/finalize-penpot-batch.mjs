import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const root = path.join(repoRoot, 'catalog/reconstruction-atlas/v1');
const read = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const hash = (relative) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex');
const audit = read('penpot/closure-audit.v1.json');
const previous = read('penpot/bindings.v1.json');

if (audit.status !== 'PENPOT_BATCH_MATERIALIZED') throw new Error(`Unexpected audit status: ${audit.status}`);
if (audit.gates.validation.length) throw new Error('Penpot validation is not empty');
if (!audit.gates.sampled_conformance_pass) throw new Error('Sampled conformance did not pass');

const reviewUrl = `https://design.penpot.app/#/workspace?team-id=81f57451-85cc-819d-8008-70ebaeab3fd6&file-id=${audit.file_id}&page-id=${audit.review.page_id}`;
const bindings = {
  schema_version: 'reconstruction-atlas-penpot-bindings.v1',
  status: 'BATCH_MATERIALIZED',
  file_id: audit.file_id,
  checkpoint_revision: previous.checkpoint_revision,
  checkpoint: previous.checkpoint,
  materialization_input: {
    design_commit: '1d252c5',
    global_archetype_sot_v1: audit.global_archetype_sot_v1,
    materialization_ir_path: 'catalog/reconstruction-atlas/v1/penpot/materialization-ir.v1.json',
    materialization_ir_sha256: hash('penpot/materialization-ir.v1.json'),
  },
  batch_bindings: audit.pages.map((page) => ({
    archetype_id: page.archetype_id,
    page_id: page.page_id,
    page_name: page.page_name,
    top_level_count: page.top_level_count,
    projections: page.projections.map((projection) => ({
      projection_id: projection.projection_id,
      stable_id: projection.stable_id,
      shape_id: projection.shape_id,
      component_id: projection.component_id,
      width: projection.width,
      height: projection.height,
    })),
  })),
  review_route: {
    page_id: audit.review.page_id,
    page_name: audit.review.page_name,
    url: reviewUrl,
    linked_row_count: audit.review.rows.length,
    rows: audit.review.rows,
    review_semantics: {
      default: 'NOT_REVIEWED',
      bounded_feedback_verified: 'REVIEWED_BY_EXCEPTION',
      no_comment: 'NO_RECORDED_OBJECTION',
      no_recorded_objection_is_approval: false,
    },
  },
  closure: {
    audit_path: 'catalog/reconstruction-atlas/v1/penpot/closure-audit.v1.json',
    audit_sha256: hash('penpot/closure-audit.v1.json'),
    counts: audit.counts,
    gates: audit.gates,
    samples: audit.samples,
    renderer_deltas: audit.renderer_deltas,
    final_named_version: audit.version,
  },
};

fs.writeFileSync(path.join(root, 'penpot/bindings.v1.json'), `${JSON.stringify(bindings, null, 2)}\n`);
console.log(JSON.stringify({ status: bindings.status, owner_pages: bindings.batch_bindings.length, review_url: reviewUrl }, null, 2));
