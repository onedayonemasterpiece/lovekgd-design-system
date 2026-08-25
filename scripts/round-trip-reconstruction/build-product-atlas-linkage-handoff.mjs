#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const bindings = JSON.parse(readFileSync('catalog/round-trip-reconstruction/v1/bindings.v1.json', 'utf8'));
const planPath = 'catalog/global-archetype-sot-v1/penpot-materialization-plan.v1.json';
const graphPath = 'catalog/global-archetype-sot-v1/component-composition-graph.v1.json';
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const graph = JSON.parse(readFileSync(graphPath, 'utf8'));
const output = 'catalog/product-atlas-linkage-handoff/v1/design-system-linkage.v1.json';
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const planByArchetype = new Map(plan.owner_pages.map(item => [item.archetype_id, item]));
const graphBySemantic = new Map(graph.nodes.map(item => [item.semantic_id, item]));

const archetypes = bindings.archetypes.map(archetype => {
  const owner = planByArchetype.get(archetype.archetype_id);
  if (!owner) throw new Error(`missing materialization owner: ${archetype.archetype_id}`);
  const componentIds = archetype.dependencies.filter(item => item.dependency_type === 'component').map(item => item.component_id).sort();
  const runtimeIds = archetype.dependencies.filter(item => item.dependency_type === 'runtime_boundary').map(item => item.component_id).sort();
  return {
    archetype_id: archetype.archetype_id,
    contract_id: archetype.contract.contract_id,
    contract_ref: { path: archetype.contract.path, sha256: archetype.contract.sha256 },
    route: {
      patterns: archetype.source.route_patterns,
      representative_generated_routes: archetype.source.representative_generated_routes,
      source_pages: archetype.source.source_pages
    },
    region_ids: archetype.regions.map(region => ({ region_id: region.region_id, semantic_role: region.semantic_role, order: region.order, required: region.required, source_ref: `${archetype.contract.path}#/regions/${region.order - 1}` })),
    pattern_ids: owner.visual_patterns.map(patternId => ({ pattern_id: patternId, source_ref: `${planPath}#/owner_pages/${plan.owner_pages.indexOf(owner)}/visual_patterns`, status: 'proven' })),
    component_ids: componentIds.map(componentId => {
      const graphNode = graphBySemantic.get(componentId);
      const dependency = archetype.dependencies.find(item => item.component_id === componentId);
      return {
        component_id: componentId,
        graph_node_id: dependency.graph_node_id,
        graph_join: dependency.graph_join,
        source_identity_ids: graphNode?.source_identity_ids ?? [],
        source_refs: (graphNode?.source_identity_contract ?? []).flatMap(identity => identity.source_refs ?? []),
        status: dependency.graph_join === 'resolved' ? 'proven' : 'unresolved'
      };
    }),
    runtime_boundary_ids: runtimeIds,
    state_ids: archetype.states.map(state => ({ state_id: state.state_id, category: state.category, required: state.required, materialization_eligible: state.materialization_eligible, evidence_disposition: state.evidence_disposition, source_refs: state.source_refs, browser_observation_refs: state.browser_observation_refs, status: state.explicit_gap ? 'unresolved' : 'proven' })),
    fixture_slots: archetype.fixture_slots,
    penpot: {
      file_id: bindings.penpot.file_id,
      page_id: archetype.penpot_page.page_id,
      page_name: archetype.penpot_page.page_name,
      boards: archetype.boards.map(board => ({ case_id: board.case_id, viewport: board.viewport, board_id: board.penpot.board_id, board_name: board.penpot.board_name, direct_url: board.penpot.direct_url }))
    },
    product_links: {
      job_ids: [],
      outcome_ids: [],
      journey_ids: [],
      capability_ids: [],
      acceptance_scenario_ids: [],
      measurement_question_ids: [],
      status: 'not_modeled',
      rule: 'Populate only from reviewed events-bot-new product-model entities; never derive product IDs from display text or Penpot coordinates.'
    }
  };
});

const receipt = {
  schema_version: 'product-atlas.design-system-linkage-handoff.v1',
  status: 'READY_FOR_PARALLEL_GIT_ONLY_PRODUCT_ATLAS_SOT',
  generation: 'deterministic_from_bound_inputs_no_wall_clock',
  authority: {
    design_system_commit: bindings.authority.design_system_commit,
    astro_commit: bindings.authority.astro_commit,
    penpot_file_id: bindings.penpot.file_id,
    penpot_revision: bindings.penpot.revision,
    materialization_plan: { path: planPath, sha256: hash(planPath) },
    component_graph: { path: graphPath, sha256: hash(graphPath) }
  },
  coverage: {
    archetypes: archetypes.length,
    regions: archetypes.reduce((sum, item) => sum + item.region_ids.length, 0),
    patterns: archetypes.reduce((sum, item) => sum + item.pattern_ids.length, 0),
    components: new Set(archetypes.flatMap(item => item.component_ids.map(component => component.component_id))).size,
    states: archetypes.reduce((sum, item) => sum + item.state_ids.length, 0),
    boards: archetypes.reduce((sum, item) => sum + item.penpot.boards.length, 0),
    orphan_design_ids: []
  },
  archetypes,
  unresolved_product_model: {
    status: 'not_modeled',
    fabricated_jobs: 0,
    fabricated_outcomes: 0,
    fabricated_metrics: 0,
    owner: 'events-bot-new Product Atlas Git SoT'
  },
  penpot_projection: {
    status: 'NOT_STARTED',
    allowed_file: 'separate Product Atlas Penpot file only after P1 gate',
    design_system_penpot_dashboards_created: 0,
    current_file_mutations: 0
  }
};
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(`${output}: ${hash(output)} (${receipt.coverage.archetypes} archetypes, ${receipt.coverage.patterns} patterns, ${receipt.coverage.states} states)`);
