#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG = join(ROOT, "catalog", "product-atlas-ui-linkage-v1");
const args = process.argv.slice(2);

function arg(name, fallback = null) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? resolve(args[index + 1]) : fallback;
}

const PRODUCT_ROOT = arg("--product-root", process.env.PRODUCT_ATLAS_PRODUCT_ROOT ? resolve(process.env.PRODUCT_ATLAS_PRODUCT_ROOT) : null);
const REVIEW_ROOT = arg("--review-root", process.env.PRODUCT_ATLAS_REVIEW_ROOT ? resolve(process.env.PRODUCT_ATLAS_REVIEW_ROOT) : null);
const ASTRO_ROOT = arg("--astro-root", process.env.PRODUCT_ATLAS_ASTRO_ROOT ? resolve(process.env.PRODUCT_ATLAS_ASTRO_ROOT) : null);
const HYPOTHESIS_ROOT = arg("--hypothesis-root", process.env.PRODUCT_ATLAS_HYPOTHESIS_ROOT ? resolve(process.env.PRODUCT_ATLAS_HYPOTHESIS_ROOT) : null);

const ENTITY_FILES = [
  "product-core.v1.json",
  "journeys.v1.json",
  "capabilities.v1.json",
  "work-items.v1.json",
  "enablers-and-guardrails.v1.json",
  "acceptance.v1.json",
  "measurement-and-decisions.v1.json",
];
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
const EXPECTED_VIEW_IDS = new Set([
  "view.product-system-overview",
  "view.site-as-is-map",
  "view.product-problem-radar",
  "view.outcome-evidence-map",
  "view.journeys-and-recovery",
  "view.current-and-hypotheses",
]);
const FORBIDDEN_PRODUCT_FIELDS = new Set([
  "title",
  "definition",
  "confidence",
  "facets",
  "unresolved_conflicts",
  "supersession_history",
]);
const UUID_LIKE = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i;
const HEX40 = /^[0-9a-f]{40}$/;

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
function gitHead(path) {
  try {
    return execFileSync("git", ["-C", path, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch (error) {
    fail(`cannot resolve Git HEAD for ${path}: ${error.message}`);
  }
}
function gitBlobSha(path) {
  const bytes = readFileSync(path);
  return createHash("sha1").update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest("hex");
}
function walk(value, visitor, path = "$") {
  visitor(value, path);
  if (Array.isArray(value)) {
    value.forEach((child, index) => walk(child, visitor, `${path}[${index}]`));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => walk(child, visitor, `${path}.${key}`));
  }
}
function collectProductIds(productRoot) {
  const atlas = join(productRoot, "docs", "product-model", "atlas", "v1");
  const ids = new Set();
  for (const filename of ENTITY_FILES) {
    const document = load(join(atlas, filename));
    if (!Array.isArray(document.entities)) fail(`product ${filename}: entities[] required`);
    for (const entity of document.entities) {
      if (!entity || typeof entity.id !== "string" || !entity.id) fail(`product ${filename}: entity ID required`);
      if (ids.has(entity.id)) fail(`duplicate product entity ID: ${entity.id}`);
      ids.add(entity.id);
    }
  }
  const delta = load(join(atlas, "product-delta.2026-08-28.v2.json"));
  if (!Array.isArray(delta.new_entities)) fail("product delta new_entities[] required");
  for (const entity of delta.new_entities) {
    if (!entity || typeof entity.id !== "string" || !entity.id) fail("product delta entity ID required");
    if (ids.has(entity.id)) fail(`product delta entity collides with stable ID: ${entity.id}`);
    ids.add(entity.id);
  }
  return ids;
}
function validateNoProductDefinitions(document) {
  walk(document, (value, path) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const key of Object.keys(value)) {
        if (FORBIDDEN_PRODUCT_FIELDS.has(key)) fail(`UI projection copied product field ${path}.${key}`);
      }
    }
  });
}

function validate() {
  if (!PRODUCT_ROOT) fail("--product-root is required");
  const lock = load(join(CATALOG, "current-source-lock.2026-08-28.v2.json"));
  const overlay = load(join(CATALOG, "recovery-overlay.2026-08-28.v2.json"));
  const bindings = load(join(CATALOG, "visualization-binding-placeholders.2026-08-28.v1.json"));
  const baseLinks = load(join(CATALOG, "product-links.v1.json"));
  const localHandoffPath = join(ROOT, "catalog", "product-atlas-linkage-handoff", "v1", "design-system-linkage.v1.json");
  const localHandoff = load(localHandoffPath);

  if (lock.schema_version !== "lovekgd-product-atlas-ui-current-source-lock.v2") fail("unexpected UI current source-lock schema");
  if (overlay.schema_version !== "lovekgd-product-atlas-ui-recovery-overlay.v2") fail("unexpected UI recovery overlay schema");
  if (bindings.schema_version !== "lovekgd-product-atlas-visualization-bindings.v1") fail("unexpected visualization binding schema");

  const product = lock.product_authority;
  if (!product || !HEX40.test(product.sha)) fail("exact product recovery SHA required");
  if (gitHead(PRODUCT_ROOT) !== product.sha) fail(`product recovery checkout drift: ${gitHead(PRODUCT_ROOT)} != ${product.sha}`);

  const productAtlas = join(PRODUCT_ROOT, "docs", "product-model", "atlas", "v1");
  const productCurrentLock = load(join(productAtlas, "current-source-lock.2026-08-28.v2.json"));
  const productDelta = load(join(productAtlas, "product-delta.2026-08-28.v2.json"));
  const productHandoff = load(join(productAtlas, "visualization-handoff.2026-08-28.v1.json"));
  if (productCurrentLock.lock_id !== "product-atlas-recovery-2026-08-28") fail("wrong product recovery lock");
  if (productDelta.delta_id !== "product-atlas-delta-2026-08-28") fail("wrong product recovery delta");
  if (productHandoff.handoff_id !== "product-atlas-visualization-2026-08-28") fail("wrong product visualization handoff");

  const productIds = collectProductIds(PRODUCT_ROOT);
  const productViewIds = new Set((productHandoff.views || []).map((view) => view.view_id));
  if (productViewIds.size !== EXPECTED_VIEW_IDS.size || [...EXPECTED_VIEW_IDS].some((id) => !productViewIds.has(id))) {
    fail("product visualization view IDs drifted");
  }

  const asIs = lock.ui_layers?.find((row) => row.layer === "source_proven_as_is_baseline");
  if (!asIs || asIs.sha !== "b86bab3e91511b3d4bd7d953b22bceb847f02a51") fail("AS-IS baseline lock drift");
  if (asIs.handoff_blob_sha !== "6c5fe775e2bcc7c767a9a1c3509b61f1feafce77") fail("AS-IS handoff blob lock drift");
  if (gitBlobSha(localHandoffPath) !== asIs.handoff_blob_sha) fail("local AS-IS handoff content drift");
  const expectedCoverage = {
    archetypes: 17,
    boards: 34,
    regions: 97,
    patterns: 97,
    components: 75,
    states: 180,
    orphan_design_ids: 0,
  };
  if (JSON.stringify(asIs.coverage) !== JSON.stringify(expectedCoverage)) fail("AS-IS lock coverage drift");
  if (localHandoff.status !== "READY_FOR_PARALLEL_GIT_ONLY_PRODUCT_ATLAS_SOT") fail("AS-IS handoff is not Product Atlas ready");
  const localCoverage = localHandoff.coverage || {};
  if (
    localCoverage.archetypes !== 17 ||
    localCoverage.boards !== 34 ||
    localCoverage.regions !== 97 ||
    localCoverage.patterns !== 97 ||
    localCoverage.components !== 75 ||
    localCoverage.states !== 180 ||
    !Array.isArray(localCoverage.orphan_design_ids) ||
    localCoverage.orphan_design_ids.length !== 0
  ) fail("local AS-IS handoff coverage drift");

  const baseLinkIds = new Map((baseLinks.links || []).map((link) => [link.link_id, link.archetype_id]));
  const overlays = overlay.archetype_overlays;
  if (!Array.isArray(overlays) || overlays.length !== 17) fail("recovery overlay must contain 17 archetypes");
  const seenArchetypes = new Set();
  for (const record of overlays) {
    if (!EXPECTED_ARCHETYPES.has(record.archetype_id) || seenArchetypes.has(record.archetype_id)) {
      fail(`duplicate/unexpected recovery archetype ${record.archetype_id}`);
    }
    seenArchetypes.add(record.archetype_id);
    if (baseLinkIds.get(record.base_link_id) !== record.archetype_id) fail(`${record.archetype_id}: base link mismatch`);
    if (record.binding_status !== "binding_pending" || record.target_binding !== null) {
      fail(`${record.archetype_id}: target binding must remain null/binding_pending`);
    }
    for (const productId of record.active_product_entity_ids || []) {
      if (!productIds.has(productId)) fail(`${record.archetype_id}: orphan active product ID ${productId}`);
    }
  }
  if ([...EXPECTED_ARCHETYPES].some((id) => !seenArchetypes.has(id))) fail("recovery overlay archetype coverage mismatch");
  if (overlay.coverage?.binding_pending !== 17 || overlay.coverage?.fabricated_ids !== 0) fail("recovery overlay binding coverage drift");
  validateNoProductDefinitions(overlay);

  const target = bindings.target;
  if (!target || target.binding_status !== "binding_pending" || target.transport !== "penpot_mcp") {
    fail("separate-account target must remain MCP binding_pending");
  }
  for (const field of ["account", "team_id", "file_id"]) {
    if (target[field] !== null) fail(`target ${field} must remain null before MCP readback`);
  }
  if (target.separate_account !== true || target.reuse_design_system_penpot_ids !== false || target.plugin !== "not_applicable") {
    fail("separate-account/no-reuse/no-plugin boundary drift");
  }
  if (target.penpot_reads_in_this_change !== 0 || target.penpot_writes_in_this_change !== 0 || target.fabricated_ids !== 0) {
    fail("Git-only UI recovery must record zero Penpot calls and IDs");
  }
  const viewBindings = bindings.view_bindings;
  if (!Array.isArray(viewBindings) || viewBindings.length !== EXPECTED_VIEW_IDS.size) fail("six visualization view placeholders required");
  const bindingViewIds = new Set();
  for (const record of viewBindings) {
    if (!EXPECTED_VIEW_IDS.has(record.view_id) || bindingViewIds.has(record.view_id)) fail(`duplicate/unexpected view binding ${record.view_id}`);
    bindingViewIds.add(record.view_id);
    if (record.page_id !== null || record.binding_status !== "binding_pending") fail(`${record.view_id}: page binding must remain pending/null`);
    if (!Array.isArray(record.board_ids) || record.board_ids.length || !Array.isArray(record.object_ids) || record.object_ids.length) {
      fail(`${record.view_id}: board/object IDs must remain empty`);
    }
  }
  if ([...productViewIds].some((id) => !bindingViewIds.has(id))) fail("view binding IDs differ from canonical product handoff");
  validateNoProductDefinitions(bindings);

  if (REVIEW_ROOT) {
    if (gitHead(REVIEW_ROOT) !== "47d0fef53c33200492d92f6a086d9b8813fe187e") fail("owner-review checkout SHA drift");
    const ledger = join(REVIEW_ROOT, "docs", "reviews", "penpot-owner-comments-resolution-20260826.md");
    if (gitBlobSha(ledger) !== "8157e074a882fdc03a7db2a043078870d75a2a88") fail("owner-review ledger blob drift");
    const text = readFileSync(ledger, "utf8");
    for (const marker of ["Status: `IN_PROGRESS`", "OV-50", "OV-52", "READY_FOR_OWNER_REREVIEW", "processed: NO", "ListingDiscoveryRail@6"]) {
      if (!text.includes(marker)) fail(`owner-review ledger missing marker: ${marker}`);
    }
  }

  if (ASTRO_ROOT) {
    if (gitHead(ASTRO_ROOT) !== "49c351873d40a2ea55f0a32837c7376e344d9c17") fail("Astro candidate checkout SHA drift");
    const rail = join(ASTRO_ROOT, "site", "src", "components", "listings", "ListingDiscoveryRail.astro");
    const inventory = join(ASTRO_ROOT, "docs", "features", "static-site-pages", "artifacts", "collection-1-inventory-2026-08-28.md");
    if (gitBlobSha(rail) !== "beb7f6c650d69f2b9eec245a004ff264d01010e9") fail("ListingDiscoveryRail@6 blob drift");
    if (gitBlobSha(inventory) !== "3df5587c6c5766c5a3e18c1d6202cfb68795d895") fail("exact-seven artifact inventory blob drift");
  }

  if (HYPOTHESIS_ROOT) {
    if (gitHead(HYPOTHESIS_ROOT) !== "f78e7c5974b4192bddf9eea901ee6d8b57f51560") fail("hypothesis checkout SHA drift");
    if (!existsSync(join(HYPOTHESIS_ROOT, "docs", "features", "location-directory", "README.md"))) fail("canonical location hypothesis missing");
    if (!existsSync(join(HYPOTHESIS_ROOT, "docs", "features", "static-site-pages", "smart-vector-search", "agent-assisted-event-discovery.md"))) fail("agent-assisted discovery hypothesis missing");
  }

  for (const path of [
    join(CATALOG, "current-source-lock.2026-08-28.v2.json"),
    join(CATALOG, "recovery-overlay.2026-08-28.v2.json"),
    join(CATALOG, "visualization-binding-placeholders.2026-08-28.v1.json"),
  ]) {
    if (UUID_LIKE.test(readFileSync(path, "utf8"))) fail(`fabricated/reused UUID in ${path}`);
  }

  return {
    product_entities: productIds.size,
    archetypes: overlays.length,
    views: viewBindings.length,
    target_bindings: 0,
  };
}

try {
  const summary = validate();
  console.log(`PRODUCT_ATLAS_UI_RECOVERY_20260828_PASS ${JSON.stringify(summary)}`);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`PRODUCT_ATLAS_UI_RECOVERY_20260828_FAIL: ${error.message}`);
    process.exit(1);
  }
  throw error;
}
