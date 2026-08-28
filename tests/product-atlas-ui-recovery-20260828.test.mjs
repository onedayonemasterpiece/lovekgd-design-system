import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("Product Atlas UI recovery remains closed and binding-pending", () => {
  const args = ["scripts/validate-product-atlas-ui-recovery-20260828.mjs"];
  if (process.env.PRODUCT_ATLAS_PRODUCT_ROOT) args.push("--product-root", process.env.PRODUCT_ATLAS_PRODUCT_ROOT);
  if (process.env.PRODUCT_ATLAS_REVIEW_ROOT) args.push("--review-root", process.env.PRODUCT_ATLAS_REVIEW_ROOT);
  if (process.env.PRODUCT_ATLAS_ASTRO_ROOT) args.push("--astro-root", process.env.PRODUCT_ATLAS_ASTRO_ROOT);
  if (process.env.PRODUCT_ATLAS_HYPOTHESIS_ROOT) args.push("--hypothesis-root", process.env.PRODUCT_ATLAS_HYPOTHESIS_ROOT);
  const output = execFileSync("node", args, { cwd: ROOT, encoding: "utf8" });
  assert.match(output, /PRODUCT_ATLAS_UI_RECOVERY_20260828_PASS/);
});
