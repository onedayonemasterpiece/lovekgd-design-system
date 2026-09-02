import json
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[4]
PACKAGE = ROOT / "catalog/asp-production-conveyor-v3/mat/eventcard-component-paths-linkage-r3/MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-LINKAGE-R3.package.v1.json"
RUNTIME = ROOT / "scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-linkage-r3/eventcard_component_paths_linkage_r3.js"

class PackageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.package = json.loads(PACKAGE.read_text(encoding="utf-8"))
        cls.runtime = RUNTIME.read_text(encoding="utf-8")

    def test_identity_model_is_explicit(self):
        self.assertEqual(set(self.package["identity_model"]), {
            "display_name", "canonical_library_path", "main_component_relationship", "main_layer_name"
        })

    def test_exact_census_and_parent(self):
        self.assertEqual(self.package["parent"]["head"], "5a99ec37ccf82d6ba7428a4f22862206b295a622")
        self.assertEqual(self.package["native_observation"]["components"], 18)
        self.assertEqual(self.package["native_observation"]["mains"], 18)
        self.assertEqual(self.package["native_observation"]["linked_instances"], 26)

    def test_three_legacy_mains_are_bounded(self):
        decision = self.package["bounded_main_layer_normalization_decision"]
        self.assertEqual(len(self.package["legacy_main_layer_names"]), 3)
        self.assertEqual(len(decision["eligible_main_ids"]), 3)
        self.assertFalse(decision["active"])
        self.assertFalse(decision["this_package_authorizes_normalization"])

    def test_runtime_does_not_use_main_name_for_component_cardinality(self):
        self.assertIn("inventory.filter((item) => item && item.name === spec.displayName)", self.runtime)
        self.assertNotIn("item.main.name === spec.displayName", self.runtime)

    def test_boundaries(self):
        boundaries = self.package["boundaries"]
        self.assertEqual(boundaries["penpot_reads_by_u0"], 0)
        self.assertEqual(boundaries["penpot_mutations_by_u0"], 0)
        self.assertFalse(boundaries["penpot_execution_authorized"])
        self.assertEqual(boundaries["new_eventcard_families"], 0)

if __name__ == "__main__":
    unittest.main()
