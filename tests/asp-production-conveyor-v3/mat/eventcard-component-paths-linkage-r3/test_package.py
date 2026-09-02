import json
import pathlib
import unittest
import hashlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[4]
PACKAGE = ROOT / "catalog/asp-production-conveyor-v3/mat/eventcard-component-paths-linkage-r3/MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-LINKAGE-R3.package.v1.json"
RUNTIME = ROOT / "scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-linkage-r3/eventcard_component_paths_linkage_r3.js"
NATIVE_RUNTIME = ROOT / "scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-linkage-r3/eventcard_component_paths_penpot_runtime_r3.js"
BUNDLE = ROOT / "scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-linkage-r3/eventcard_paths_penpot_standalone_bundle_v1.js"

class PackageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.package = json.loads(PACKAGE.read_text(encoding="utf-8"))
        cls.runtime = RUNTIME.read_text(encoding="utf-8")
        cls.native_runtime = NATIVE_RUNTIME.read_text(encoding="utf-8")
        cls.bundle_bytes = BUNDLE.read_bytes()
        cls.bundle = cls.bundle_bytes.decode("utf-8")

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

    def test_concrete_native_successor_is_gated_and_exact(self):
        execution = self.package["execution"]
        self.assertEqual(execution["entrypoint"], "executeEventcardPathsPenpotR3")
        self.assertTrue(execution["concrete_penpot_adapter"])
        self.assertTrue(execution["lease_expiry_recheck_before_every_native_mutation"])
        self.assertEqual(execution["second_run_created"], 0)
        self.assertIn("assertPhysicalActive(context, authorization);", self.native_runtime)
        self.assertNotIn("component.path = row.expectedCanonicalPath", self.native_runtime)
        self.assertEqual(self.package["native_preflight"]["file_local_components"], 35)
        self.assertEqual(self.package["native_preflight"]["protected_non_eventcard_components"], 17)

    def test_blocked_profile_is_not_globally_overridden(self):
        preflight = self.package["native_preflight"]
        self.assertEqual(preflight["authority_card_comment_id"], 5514360206)
        self.assertIn("EVENTCARD_PATHS_RECEIPT_RECOVERY_ONLY", preflight["authority_card_scope"])
        self.assertIn("EVENTCARD_PATHS", preflight["mutation_authorization_requires_exact_bounded_owner_directive"])
        self.assertFalse(self.package["boundaries"]["penpot_execution_authorized"])


    def test_standalone_bundle_identity_and_forbidden_runtime_tokens(self):
        meta = self.package["browser_plugin_bundle"]
        self.assertEqual(meta["schema"], "D0_PLUGIN_BUNDLE_V1")
        self.assertEqual(meta["global"], "KenigEventsD0EventcardPathsR3StandaloneV5")
        self.assertEqual(meta["artifact"]["bytes"], len(self.bundle_bytes))
        self.assertEqual(meta["artifact"]["sha256"], hashlib.sha256(self.bundle_bytes).hexdigest())
        for name in ["require", "module", "exports", "process", "Buffer"]:
            self.assertIsNone(re.search(rf"\b{name}\b", self.bundle))
        self.assertIn("bundle_sha256_binding: 'EXTERNAL_AUTHORIZATION_TUPLE'", self.bundle)
        self.assertIn("PATHS_R3_BUNDLE_AUTHORIZATION_MISMATCH", self.bundle)
        self.assertNotIn("__d0BundleConformance", self.bundle)
        self.assertNotIn("structuredClone", self.bundle)
        self.assertTrue(meta["receipt_only_recovery"])
        self.assertTrue(meta["production_entrypoints_exercised_by_conformance"])
        self.assertEqual(meta["caller_injected_helpers"], 0)
        self.assertEqual(meta["recovery_contract"]["expected_native_creates"], 0)
        self.assertEqual(meta["recovery_contract"]["expected_native_setters"], 0)
        self.assertEqual(meta["shared_conformance"]["head"], "62f26df36b8199e4b8899b9252f796b1fa5e9d42")
        self.assertEqual(meta["shared_conformance"]["tree"], "23bc8ef208c9e68e76890183fdda15c1a60f5fbd")

    def test_native_main_name_projection_recovery_is_exact_and_write_free(self):
        recovery = self.package["native_automatic_main_layer_projection_recovery"]
        self.assertEqual(recovery["observed_revision"], 181)
        self.assertTrue(recovery["arbitrary_main_name_rejected"])
        self.assertEqual(recovery["recovery_path_setters"], 0)
        self.assertEqual(recovery["recovery_creates"], 0)
        self.assertEqual(recovery["preserved_linked_instance_ids"], 26)
        self.assertIn("nativeProjectedMainLayerName", self.runtime)
        self.assertIn("exactRecoveryReceipt", self.native_runtime)

    def test_boundaries(self):
        boundaries = self.package["boundaries"]
        self.assertEqual(boundaries["penpot_reads_by_u0"], 0)
        self.assertEqual(boundaries["penpot_mutations_by_u0"], 0)
        self.assertFalse(boundaries["penpot_execution_authorized"])
        self.assertEqual(boundaries["new_eventcard_families"], 0)

if __name__ == "__main__":
    unittest.main()
