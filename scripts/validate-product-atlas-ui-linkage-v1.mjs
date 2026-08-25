#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG = join(ROOT, "catalog", "product-atlas-ui-linkage-v1");
const args = process.argv.slice(2);
const productRootIndex = args.indexOf("--product-root");
const PRODUCT_ROOT = resolve(
  productRootIndex >= 0 && args[productRootIndex + 1]
    ? args[productRootIndex + 1]
    : process.env.PRODUCT_ATLAS_PRODUCT_ROOT || join(ROOT, "..", "events-bot-new"),
);

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
const PRODUCT_ENTITY_FILES = [
  "product-core.v1.json",
  "journeys.v1.json",
  "capabilities.v1.json",
  "work-items.v1.json",
  "enablers-and-guardrails.v1.json",
  "acceptance.v1.json",
  "measurement-and-decisions.v1.json",
];
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

class ValidationError extends Error {}

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

function collectProductIds() {
  const atlas = join(PRODUCT_ROOT, "docs", "product-model", "atlas", "v1");
  const byId = new Map();
  for (const filename of PRODUCT_ENTITY_FILES) {
    const document = load(join(atlas, filename));
    if (!Array.isArray(document.entities) || document.entities.length === 0) {
      fail(`product ${filename}: non-empty entities[] required`);
    }
    for (const entity of document.entities) {
      if (!entity || typeof entity.id !== "string" || !entity.id) {
        fail(`product ${filename}: entity ID required`);
      }
      if (byId.has(entity.id)) fail(`duplicate product entity ID: ${entity.id}`);
      byId.set(entity.id, entity);
    }
  }
  return byId;
}

function validateSourceLock(sourceLock) {
  const product = sourceLock.product_authority;
  const ui = sourceLock.corrected_ui_sot;
  if (!product || !HEX40.test(product.sha)) fail("product source SHA must be exact");
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
    fail("UI source lock requires exact Git blobs");
  }
  for (const value of [
    ui.manifest_sha256,
    ui.route_registry_sha256,
    ui.component_graph_sha256,
    ui.contract_directory_manifest_sha256,
  ]) {
    if (!HEX64.test(value)) fail(`invalid locked SHA-256: ${value}`);
  }

  const actualProductHead = gitHead(PRODUCT_ROOT);
  if (actualProductHead !== product.sha) {
    fail(`product checkout drift: locked ${product.sha}, actual ${actualProductHead}`);
  }

  const manifestPath = join(ROOT, ui.manifest_path);
  const routePath = join(ROOT, ui.route_registry_path);
  const graphPath = join(ROOT, ui.component_graph_path);
  if (sha256(manifestPath) !== ui.manifest_sha256) fail("UI manifest content drift");
  if (sha256(routePath) !== ui.route_registry_sha256) fail("route registry content drift");
  if (sha256(graphPath) !== ui.component_graph_sha256) fail("component graph content drift");

  const routeRegistry = load(routePath);
  const coverage = routeRegistry.coverage || {};
  if (
    coverage.route_pattern_mapping_percent !== 100 ||
    coverage.source_page_mapping_percent !== 100 ||
    coverage.generated_route_mapping_percent !== 100 ||
    coverage.production_route_patterns !== 29 ||
    coverage.generated_routes !== 32
  ) {
    fail("local corrected route registry no longer proves 100% source/route mapping");
  }
}

function validateNoProductDefinitions(linkDocument) {
  walk(linkDocument.links, (value, path) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const key of Object.keys(value)) {
        if (FORBIDDEN_PRODUCT_KEYS.has(key)) {
          fail(`design-system projection copied forbidden product field ${path}.${key}`);
        }
      }
    }
  });
}

function validateLinks(linkDocument, productIds) {
  const links = linkDocument.links;
  if (!Array.isArray(links) || links.length !== 17) {
    fail("product-links.v1.json must contain exactly 17 archetype links");
  }
  const seenLinks = new Set();
  const seenArchetypes = new Set();
  for (const link of links) {
    if (!link.link_id || seenLinks.has(link.link_id)) fail(`duplicate/invalid link ID: ${link.link_id}`);
    seenLinks.add(link.link_id);
    if (!EXPECTED_ARCHETYPES.has(link.archetype_id) || seenArchetypes.has(link.archetype_id)) {
      fail(`duplicate/unexpected archetype: ${link.archetype_id}`);
    }
    seenArchetypes.add(link.archetype_id);

    const contractPath = join(ROOT, link.archetype_contract_ref || "");
    const contract = load(contractPath);
    if (contract.archetype_id !== link.archetype_id) {
      fail(`${link.link_id}: archetype contract identity mismatch`);
    }

    if (!link.route_registry_selector || link.route_registry_selector.archetype_id !== link.archetype_id) {
      fail(`${link.link_id}: exact route-registry selector required`);
    }
    if (!Array.isArray(link.region_bindings) || link.region_bindings.length === 0) {
      fail(`${link.link_id}: region bindings required`);
    }

    for (const id of link.product_entity_ids || []) {
      if (!productIds.has(id)) fail(`${link.link_id}: orphan product entity ${id}`);
    }
    for (const id of link.acceptance_scenario_ids || []) {
      if (!productIds.has(id)) fail(`${link.link_id}: orphan acceptance entity ${id}`);
    }
    for (const id of link.measurement_question_ids || []) {
      if (!productIds.has(id)) fail(`${link.link_id}: orphan measurement question ${id}`);
    }
    if ((link.measurement_question_ids || []).length === 0 && link.measurement_status !== "not_modeled") {
      fail(`${link.link_id}: measurement foreign key or not_modeled marker required`);
    }

    const contractRegions = new Set((contract.regions || []).map((region) => region.region_id));
    for (const region of link.region_bindings) {
      if (!region.region_id || !contractRegions.has(region.region_id)) {
        fail(`${link.link_id}: region not present in corrected contract: ${region.region_id}`);
      }
      if (!region.pattern_id || !region.component_id) {
        fail(`${link.link_id}:${region.region_id}: pattern and component IDs required`);
      }
      if (!Array.isArray(region.state_ids) || region.state_ids.length === 0) {
        fail(`${link.link_id}:${region.region_id}: ProductScreenState IDs required`);
      }
      if (region.native_binding !== "binding_pending") {
        fail(`${link.link_id}:${region.region_id}: unpublished binding must be binding_pending`);
      }
    }
  }
  if (seenArchetypes.size !== EXPECTED_ARCHETYPES.size) fail("17-archetype coverage mismatch");
  for (const archetype of EXPECTED_ARCHETYPES) {
    if (!seenArchetypes.has(archetype)) fail(`missing archetype link: ${archetype}`);
  }

  if (linkDocument.coverage?.route_registry_mapping_percent !== 100) {
    fail("projection route coverage must remain 100%");
  }
  validateNoProductDefinitions(linkDocument);
}

function validateBindings(bindings, links) {
  if (bindings.binding_status !== "binding_pending" || bindings.fabricated_ids !== 0) {
    fail("binding ledger must be binding_pending with zero fabricated IDs");
  }
  if (bindings.penpot_reads_in_this_change !== 0 || bindings.penpot_writes_in_this_change !== 0) {
    fail("Git-only change must record zero Penpot reads/writes");
  }
  const byLink = new Map(links.map((link) => [link.link_id, link.archetype_id]));
  const placeholders = bindings.archetype_bindings;
  if (!Array.isArray(placeholders) || placeholders.length !== 17) {
    fail("binding ledger must contain exactly 17 archetype placeholders");
  }
  const seen = new Set();
  for (const placeholder of placeholders) {
    if (placeholder.binding !== "binding_pending") fail("only binding_pending is allowed");
    if (byLink.get(placeholder.link_id) !== placeholder.archetype_id) {
      fail(`binding/link mismatch: ${placeholder.link_id}`);
    }
    if (seen.has(placeholder.archetype_id)) fail(`duplicate binding placeholder: ${placeholder.archetype_id}`);
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
    if (existsSync(join(ROOT, path))) fail(`obsolete Product Atlas delivery artifact still active: ${path}`);
  }
  for (const required of [
    "docs/product-atlas-penpot-mcp.md",
    "docs/product-atlas-penpot-extension.md",
    "docs/penpot-product-design-operating-model.md",
  ]) {
    if (!existsSync(join(ROOT, required))) fail(`missing current Product Atlas/MCP doc: ${required}`);
  }
}

function validate() {
  if (!existsSync(PRODUCT_ROOT)) fail(`product checkout not found: ${PRODUCT_ROOT}`);
  const sourceLock = load(join(CATALOG, "source-lock.v1.json"));
  const links = load(join(CATALOG, "product-links.v1.json"));
  const bindings = load(join(CATALOG, "binding-placeholders.v1.json"));

  validateSourceLock(sourceLock);
  const productIds = collectProductIds();
  validateLinks(links, productIds);
  validateBindings(bindings, links.links);
  validateNoFabricatedIds(sourceLock, links, bindings);
  validateObsoleteArtifactsRemoved();

  return {
    product_entities: productIds.size,
    archetypes: links.links.length,
    region_bindings: links.links.reduce((sum, link) => sum + link.region_bindings.length, 0),
    pending_native_bindings: bindings.archetype_bindings.length,
    fabricated_ids: 0,
  };
}

try {
  const summary = validate();
  console.log(`PRODUCT_ATLAS_UI_LINKAGE_PASS ${JSON.stringify(summary)}`);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`PRODUCT_ATLAS_UI_LINKAGE_FAIL ${error.message}`);
    process.exit(1);
  }
  throw error;
}
