import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const productRoot = process.env.PRODUCT_ATLAS_PRODUCT_ROOT;

test("Product Atlas UI linkage resolves against the locked product registry", () => {
  assert.ok(productRoot, "PRODUCT_ATLAS_PRODUCT_ROOT is required for cross-repository validation");
  const output = execFileSync(
    process.execPath,
    [resolve(root, "scripts/validate-product-atlas-ui-linkage-v1.mjs"), "--product-root", productRoot],
    { encoding: "utf8" },
  );
  assert.match(output, /^PRODUCT_ATLAS_UI_LINKAGE_PASS /m);
});
