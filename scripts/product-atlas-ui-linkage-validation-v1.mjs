import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG = join(ROOT, "catalog", "product-atlas-ui-linkage-v1");

const EXPECTED_ARCHETYPES = new Set([
  "archetype.home",
  "archetype.artifacts",
  "archetype.collections",
  "archetype.event-detail",
  "archetype.exhibitions",
  "archetype.favorites",
  "archetype.festivals",
  "archetype.focus-group",
  "archetype.information-pages",
  "archetype.interest-clubs",
  "archetype.listing.date",
  "archetype.listing.popular",
  "archetype.listing.unusual",
  "archetype.listing.weekend",
  "archetype.personal-feed",
  "archetype.search",
  "archetype.special-state",
]);
const FORBIDDEN_PRODUCT_KEYS = new Set([
  "title",
  "definition",
  "confidence",
  "facets",
  "unresolved_conflicts",
  "supersession_history",
  "finding",
  "decision",
  "outcome_target",
]);
const UUID_LIKE = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i;
const HEX40 = /^[0-9a-f]{40}$/;
const HEX64 = /^[0-9a-f]{64}$/;

export class ValidationError extends Error {}

function fail(message) {
  throw new ValidationError(message);
}

function load(path) {
  if (!existsSync(path)) fail(`missing required file: ${path}`);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`invalid JSON ${path}: ${error.message}`);
  }
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function gitHead(path) {
  try {
    return execFileSync("git", ["-C", path, "rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    fail(`cannot resolve Git HEAD for ${path}: ${error.message}`);
  }
}

function walk(value, visitor, path = "$") {
  visitor(value, path);
  if (Array.isArray(value)) {
    value.forEach((child, index) => walk(child, visitor, `${path}[${index}]`));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => walk(child, visitor, `${path}.${key}`));
  }
}

function sortedStrings(value, label) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    fail(`${label}: string array required`);
  }
  return [...value].sort();
}

function requireSameForeignKeys(actual, expected, label) {
  const a = sortedStrings(actual, `${label} actual`);
  const e = sortedStrings(expected, `${label} expected`);
  if (JSON.stringify(a) !== JSON.stringify(e)) {
    fail(`${label}: foreign-key drift; expected=${JSON.stringify(e)} actual=${JSON.stringify(a)}`);
  }
}

function validateCanonicalProduct(productRoot, lockedSha) {
  const actualHead = gitHead(productRoot);
  if (actualHead !== lockedSha) {
    fail(`product checkout drift: locked ${lockedSha}, actual ${actualHead}`);
  }
  const validator = join(productRoot, "scripts", "validate_product_atlas_v1.py");
  let output;
  try {
    output = execFileSync("python3", [validator], {
      cwd: productRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    const stdout = error.stdout?.toString?.() || "";
    const stderr = error.stderr?.toString?.() || "";
    fail(`canonical product validator failed: ${stdout} ${stderr}`.trim());
  }
  const prefix = "PRODUCT_ATLAS_V1_PASS ";
  if (!output.startsWith(prefix)) fail(`unexpected product validator output: ${output}`);
  try {
    return JSON.parse(output.slice(prefix.length));
  } catch (error) {
    fail(`invalid product validator summary: ${error.message}`);
  }
}

function validateLocks(sourceLock, productRoot) {
  const product = sourceLock.product_authority;
  const ui = sourceLock.corrected_ui_sot;
  if (!product || !HEX40.test(product.sha)) fail("exact product SHA required");
  const productSummary = validateCanonicalProduct(productRoot, product.sha);

  if (!ui || ui.sha !== "9b8043f3bdb86fab4eee00bf94b0f10d4f029c50") {
    fail("corrected UI SoT SHA drift");
  }
  if (ui.manifest_sha256 !== "ac2cb64bbccb113dd7c81cdb8caec953d3d5e2f56ea10a1f54914d7a0ed46819") {
    fail("corrected UI manifest SHA-256 drift");
  }
  if (ui.archetype_contract_count !== 17 || ui.production_route_pattern_count !== 29 || ui.generated_route_count !== 32) {
    fail("corrected UI coverage lock drift");
  }
  if (!HEX40.test(ui.route_registry_blob_sha) || !HEX40.test(ui.component_graph_blob_sha)) {
    fail("exact UI Git blobs required");
  }
  for (const value of [
    ui.manifest_sha256,
    ui.route_registry_sha256,
    ui.component_graph_sha256,
    ui.contract_directory_manifest_sha256,
  ]) {
    if (!HEX64.test(value)) fail(`invalid locked SHA-256: ${value}`);
  }

  const manifestPath = join(ROOT, ui.manifest_path);
  const routePath = join(ROOT, ui.route_registry_path);
  const graphPath = join(ROOT, ui.component_graph_path);
  if (sha256(manifestPath) !== ui.manifest_sha256) fail("UI manifest content drift");
  if (sha256(routePath) !== ui.route_registry_sha256) fail("route registry content drift");
  if (sha256(graphPath) !== ui.component_graph_sha256) fail("component graph content drift");

  const coverage = load(routePath).coverage || {};
  if (
    coverage.route_pattern_mapping_percent !== 100 ||
    coverage.source_page_mapping_percent !== 100 ||
    coverage.generated_route_mapping_percent !== 100 ||
    coverage.production_route_patterns !== 29 ||
    coverage.production_source_pages !== 29 ||
    coverage.generated_routes !== 32
  ) {
    fail("corrected route registry no longer proves 100% source/route mapping");
  }
  return productSummary;
}

function validateNoProductDefinitions(document) {
  walk(document.links, (value, path) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const key of Object.keys(value)) {
        if (FORBIDDEN_PRODUCT_KEYS.has(key)) {
          fail(`projection copied forbidden product field ${path}.${key}`);
        }
      }
    }
  });
}

function validateLinks(document, canonicalDocument) {
  const links = document.links;
  const canonicalLinks = canonicalDocument.links;
  if (!Array.isArray(links) || links.length !== 17) fail("exactly 17 UI links required");
  if (!Array.isArray(canonicalLinks) || canonicalLinks.length !== 17) {
    fail("canonical Product Atlas linkage must contain exactly 17 links");
  }
  const canonicalById = new Map(canonicalLinks.map((link) => [link.id, link]));
  const seenIds = new Set();
  const seenArchetypes = new Set();
  let regionBindings = 0;

  for (const link of links) {
    if (!link.link_id || seenIds.has(link.link_id)) fail(`duplicate/invalid link ID: ${link.link_id}`);
    seenIds.add(link.link_id);
    if (!EXPECTED_ARCHETYPES.has(link.archetype_id) || seenArchetypes.has(link.archetype_id)) {
      fail(`duplicate/unexpected archetype: ${link.archetype_id}`);
    }
    seenArchetypes.add(link.archetype_id);

    const canonical = canonicalById.get(link.link_id);
    if (!canonical) fail(`${link.link_id}: canonical Product Atlas link missing`);
    if (canonical.archetype_id !== link.archetype_id) fail(`${link.link_id}: archetype drift`);
    requireSameForeignKeys(link.product_entity_ids || [], canonical.product_entity_ids || [], `${link.link_id} product_entity_ids`);
    requireSameForeignKeys(link.acceptance_scenario_ids || [], canonical.acceptance_scenario_ids || [], `${link.link_id} acceptance_scenario_ids`);
    requireSameForeignKeys(link.measurement_question_ids || [], canonical.measurement_question_ids || [], `${link.link_id} measurement_question_ids`);
    if ((link.measurement_question_ids || []).length === 0 && link.measurement_status !== canonical.measurement_status) {
      fail(`${link.link_id}: not_modeled measurement marker drift`);
    }

    const contract = load(join(ROOT, link.archetype_contract_ref || ""));
    if (contract.archetype_id !== link.archetype_id) fail(`${link.link_id}: contract identity mismatch`);
    if (link.route_registry_selector?.archetype_id !== link.archetype_id) {
      fail(`${link.link_id}: exact route-registry selector required`);
    }
    if (!Array.isArray(link.region_bindings) || link.region_bindings.length === 0) {
      fail(`${link.link_id}: region bindings required`);
    }
    const contractRegions = new Set((contract.regions || []).map((region) => region.region_id));
    const canonicalRegions = new Set((canonical.semantic_regions || []).map((region) => region.region_id));
    for (const region of link.region_bindings) {
      regionBindings += 1;
      if (!contractRegions.has(region.region_id)) {
        fail(`${link.link_id}: region absent from corrected contract: ${region.region_id}`);
      }
      if (!canonicalRegions.has(region.region_id)) {
        fail(`${link.link_id}: region absent from canonical Product Atlas link: ${region.region_id}`);
      }
      if (!region.pattern_id || !region.component_id) {
        fail(`${link.link_id}:${region.region_id}: pattern/component IDs required`);
      }
      if (!Array.isArray(region.state_ids) || region.state_ids.length === 0) {
        fail(`${link.link_id}:${region.region_id}: ProductScreenStates required`);
      }
      if (region.native_binding !== "binding_pending") {
        fail(`${link.link_id}:${region.region_id}: native binding must remain binding_pending`);
      }
    }
  }

  for (const archetype of EXPECTED_ARCHETYPES) {
    if (!seenArchetypes.has(archetype)) fail(`missing archetype link: ${archetype}`);
  }
  if (document.coverage?.route_registry_mapping_percent !== 100) {
    fail("projection route coverage must remain 100%");
  }
  validateNoProductDefinitions(document);
  return regionBindings;
}

function validateBindings(bindings, links) {
  if (bindings.binding_status !== "binding_pending" || bindings.fabricated_ids !== 0) {
    fail("binding ledger must be pending with zero fabricated IDs");
  }
  if (bindings.penpot_reads_in_this_change !== 0 || bindings.penpot_writes_in_this_change !== 0) {
    fail("Git-only change must record zero Penpot reads/writes");
  }
  const byLink = new Map(links.map((link) => [link.link_id, link.archetype_id]));
  if (!Array.isArray(bindings.archetype_bindings) || bindings.archetype_bindings.length !== 17) {
    fail("exactly 17 binding placeholders required");
  }
  const seen = new Set();
  for (const placeholder of bindings.archetype_bindings) {
    if (placeholder.binding !== "binding_pending") fail("only binding_pending is allowed");
    if (byLink.get(placeholder.link_id) !== placeholder.archetype_id) {
      fail(`binding/link mismatch: ${placeholder.link_id}`);
    }
    if (seen.has(placeholder.archetype_id)) fail(`duplicate placeholder: ${placeholder.archetype_id}`);
    seen.add(placeholder.archetype_id);
  }
}

function validateNoFabricatedIds(...documents) {
  for (const document of documents) {
    if (UUID_LIKE.test(JSON.stringify(document))) fail("fabricated or unpublished UUID found");
  }
}

function validateObsoleteArtifactsRemoved() {
  const forbiddenPaths = [
    "contracts/product-atlas-001.plugin.json",
    "prototypes/penpot-product-atlas-001/README.md",
    "prototypes/penpot-product-atlas-001/STATUS.md",
    "prototypes/penpot-product-atlas-001/catalog/catalog.json",
    "prototypes/penpot-product-atlas-001/dist/icon.svg",
    "prototypes/penpot-product-atlas-001/dist/manifest.json",
    "prototypes/penpot-product-atlas-001/dist/plugin.js",
    "prototypes/penpot-product-atlas-001/dist/ui.html",
    "prototypes/penpot-product-atlas-001/scripts/validate.mjs",
    ".github/workflows/penpot-product-atlas-001-smoke.yml",
  ];
  for (const path of forbiddenPaths) {
    if (existsSync(join(ROOT, path))) fail(`obsolete delivery artifact remains active: ${path}`);
  }
  for (const required of [
    "docs/product-atlas-penpot-mcp.md",
    "docs/product-atlas-penpot-extension.md",
    "docs/penpot-product-design-operating-model.md",
  ]) {
    if (!existsSync(join(ROOT, required))) fail(`current Product Atlas/MCP doc missing: ${required}`);
  }
}

export function validate(productRoot) {
  if (!existsSync(productRoot)) fail(`product checkout not found: ${productRoot}`);
  const sourceLock = load(join(CATALOG, "source-lock.v1.json"));
  const links = load(join(CATALOG, "product-links.v1.json"));
  const bindings = load(join(CATALOG, "binding-placeholders.v1.json"));
  const productSummary = validateLocks(sourceLock, productRoot);
  const canonical = load(join(productRoot, "docs", "product-model", "atlas", "v1", "ui-linkage.v1.json"));
  const regionBindings = validateLinks(links, canonical);
  validateBindings(bindings, links.links);
  validateNoFabricatedIds(sourceLock, links, bindings);
  validateObsoleteArtifactsRemoved();
  return {
    product_entities: productSummary.entities,
    product_entity_kinds: productSummary.entity_kinds,
    product_sources: productSummary.sources,
    archetypes: links.links.length,
    region_bindings: regionBindings,
    pending_native_bindings: bindings.archetype_bindings.length,
    fabricated_ids: 0,
  };
}
