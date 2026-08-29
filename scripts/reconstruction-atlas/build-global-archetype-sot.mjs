import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const atlasRoot = path.join(repoRoot, 'catalog/reconstruction-atlas/v1');
const outputRoot = path.join(repoRoot, 'catalog/global-archetype-sot-v1');
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const ref = (relativePath) => ({
  path: `catalog/reconstruction-atlas/v1/${relativePath}`,
  sha256: sha256(path.join(atlasRoot, relativePath)),
});

fs.mkdirSync(outputRoot, { recursive: true });
const manifest = {
  schema_version: 'global-archetype-sot-v1',
  status: 'READY_FOR_BATCH_MATERIALIZATION',
  pinned_design_input_commit: 'adeb9e4',
  pinned_astro_commit: '7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00',
  authority: 'Current Astro source + generated browser output, normalized by the semantic atlas. Penpot bindings and evidence remain separate planes.',
  coverage: {
    archetypes: { covered: 17, total: 17, percent: 100 },
    astro_pages: { mapped: 29, total: 29, percent: 100 },
    browser_observations: 67,
    required_projection_classes: ['desktop', 'mobile', 'unique-state-index'],
  },
  semantic_plane: {
    semantic_atlas: ref('semantic-atlas.v1.json'),
    route_registry: ref('route-registry.v1.json'),
    foundations: ref('foundations.v1.json'),
    fixtures: ref('fixtures.v1.json'),
    reuse_new_map: ref('reuse-new-map.v1.json'),
    gap_ledger: ref('gap-ledger.v1.json'),
  },
  penpot_plane: {
    bindings: ref('penpot/bindings.v1.json'),
    materialization_ir: { path: 'catalog/reconstruction-atlas/v1/penpot/materialization-ir.v1.json', binding: 'IR hashes this manifest; no reverse hash to avoid a cyclic contract' },
    materialization_ir_validation: { path: 'catalog/reconstruction-atlas/v1/penpot/materialization-ir-validation.v1.json' },
  },
  evidence_plane: {
    index: ref('evidence/index.v1.json'),
    browser_observations: ref('evidence/browser-observations.v1.json'),
  },
  operating_contract: {
    path: 'docs/accelerated-reconstruction-mode.md',
    central_fix_dependency_closure: true,
    dense_stress_authority: 'generated Astro',
    penpot_projection_policy: 'representative linked instances',
    review_mode: 'REVIEW_BY_EXCEPTION',
    no_recorded_objection_is_approval: false,
    forbidden: ['redesign', 'backport', 'merge', 'promotion', 'deploy'],
  },
};
fs.writeFileSync(path.join(outputRoot, 'manifest.v1.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ output: path.join(outputRoot, 'manifest.v1.json'), schema_version: manifest.schema_version, status: manifest.status }, null, 2));
