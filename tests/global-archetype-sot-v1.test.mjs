import assert from 'node:assert/strict';
import { validateAll } from '../scripts/global-archetype-sot-v1/validate.mjs';

const result = validateAll();
assert.equal(result.status, 'PASS');
assert.equal(result.archetypes, 17);
assert.equal(result.production_source_pages, 29);
assert.equal(result.source_page_mapping_percent, 100);
assert.equal(result.route_pattern_mapping_percent, 100);
assert.equal(result.generated_route_mapping_percent, 100);
assert.equal(result.browser_observations, 67);
assert.equal(result.failed_browser_observations, 2);
assert.equal(result.speculative_component_merges, 0);

console.log(`global-archetype-sot-v1.test: PASS — ${result.production_source_pages}/${result.production_source_pages} production Astro pages mapped, ${result.generated_routes}/${result.generated_routes} generated routes mapped, ${result.browser_observations} browser observations, unresolved=${result.unresolved_contracts}, speculative_merges=0`);
