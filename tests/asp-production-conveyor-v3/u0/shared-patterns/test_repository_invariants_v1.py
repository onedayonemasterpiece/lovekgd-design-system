import json
import pathlib
import re
import unittest

ROOT = next(parent for parent in pathlib.Path(__file__).resolve().parents if (parent / "catalog").exists() and (parent / "scripts").exists())
CATALOG = ROOT / "catalog"
SCRIPTS = ROOT / "scripts"
PACKAGE = json.loads((ROOT / "catalog/asp-production-conveyor-v3/u0/shared-patterns" / "U-SHARED-PATTERNS.package.v1.json").read_text(encoding="utf-8"))

class PackageInvariantTests(unittest.TestCase):
    def test_identity_and_authority(self):
        self.assertEqual(PACKAGE["package_id"], "U-SHARED-PATTERNS")
        self.assertEqual(PACKAGE["owner"], "U0")
        self.assertEqual(PACKAGE["source_authority"]["head"], "8f46f068ba41dab4dca538806d11693c8c0d3042")
        self.assertEqual(PACKAGE["source_authority"]["tree"], "a1739a4881262c2db9acd679e7b962a969ab5968")
        self.assertEqual(PACKAGE["atlas_r2"]["head"], "663be702d481972cb2e8863af500f1c35dda1d8c")
        self.assertFalse(PACKAGE["authorization"]["penpot_execution_authorized"])
        self.assertFalse(PACKAGE["authorization"]["promotion_authorized"])
        self.assertEqual(PACKAGE["authorization"]["visual_acceptance"], "PENDING_V0")

    def test_source_lineage_is_frozen(self):
        files = PACKAGE["source_authority"]["files"]
        self.assertGreater(len(files), 0)
        for item in files:
            self.assertTrue(item["path"].startswith("site/"))
            self.assertRegex(item.get("git_blob_sha1", ""), r"^[0-9a-f]{40}$")

    def test_bounded_pages_and_linked_specimens(self):
        for unit in PACKAGE["page_units"]:
            managed = 1 + len(unit["components"]) + len(unit["specimens"])
            self.assertEqual(managed, unit["managed_nodes_expected"])
            self.assertLessEqual(managed, 30)
            component_ids = {item["component_id"] for item in unit["components"]}
            for specimen in unit["specimens"]:
                self.assertTrue(set(specimen["component_ids"]).issubset(component_ids))

    def test_no_forbidden_lineage_or_substitution(self):
        text = json.dumps(PACKAGE, ensure_ascii=False).lower()
        for banned in ("detached-copy", "screenshot-shape", "raster-substitute", "old-penpot-uuid"):
            self.assertNotIn(banned, text)
        self.assertEqual(PACKAGE["boundaries"]["penpot_reads_by_u0"], 0)
        self.assertEqual(PACKAGE["boundaries"]["penpot_mutations_by_u0"], 0)
        self.assertEqual(PACKAGE["boundaries"]["eventcard_mat_repairs"], 0)
        self.assertTrue(PACKAGE["boundaries"]["atlas_r2_read_only"])

    def test_executor_is_concrete_and_guarded(self):
        runtime = (ROOT / "scripts/asp-production-conveyor-v3/u0/shared-patterns" / "native_runtime_v1.js").read_text(encoding="utf-8")
        entry = (ROOT / "scripts/asp-production-conveyor-v3/u0/shared-patterns" / "native_executor_v1.js").read_text(encoding="utf-8")
        self.assertIn("async function runExecutablePackage", runtime)
        self.assertIn("assertActiveLease", runtime)
        self.assertIn("linked-review-specimen", runtime)
        self.assertIn("runExecutablePackage", entry)

    def test_atlas_extension_has_no_page_order(self):
        request = (ROOT / "catalog/asp-production-conveyor-v3/u0/shared-patterns" / "ASP_ATLAS_EXTENSION_REQUEST_V1.md").read_text(encoding="utf-8")
        self.assertIn("ASP_ATLAS_EXTENSION_REQUEST_V1", request)
        self.assertNotRegex(request, r"(?m)^page_order:")

    def test_lane_specific_acceptance(self):
        self.assertEqual(len(PACKAGE["patterns"]), 6)
        self.assertEqual(len(PACKAGE["page_units"]), 6)
        for unit in PACKAGE["page_units"]:
            for component in unit["components"]:
                self.assertGreaterEqual(len(component["source_consumers"]), 2)
        self.assertEqual(PACKAGE["acceptance"]["route_specific_one_offs_promoted"], 0)

if __name__ == "__main__":
    unittest.main()
