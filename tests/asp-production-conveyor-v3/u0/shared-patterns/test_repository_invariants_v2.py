import hashlib
import json
import pathlib
import re
import unittest


ROOT = next(parent for parent in pathlib.Path(__file__).resolve().parents if (parent / "catalog").exists() and (parent / "scripts").exists())
PACKAGE_DIR = ROOT / "catalog/asp-production-conveyor-v3/u0/shared-patterns"
SCRIPT_DIR = ROOT / "scripts/asp-production-conveyor-v3/u0/shared-patterns"
SUCCESSOR = json.loads((PACKAGE_DIR / "U-SHARED-PATTERNS.native-successor.v2.json").read_text(encoding="utf-8"))
PREDECESSOR = json.loads((PACKAGE_DIR / "U-SHARED-PATTERNS.package.v1.json").read_text(encoding="utf-8"))
PRODUCT = json.loads((PACKAGE_DIR / "product-contract.v1.json").read_text(encoding="utf-8"))
NATIVE = json.loads((PACKAGE_DIR / "native-product-contract.v2.json").read_text(encoding="utf-8"))


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def git_blob_sha1(path: pathlib.Path) -> str:
    data = path.read_bytes()
    return hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest()


class NativeSuccessorRepositoryTests(unittest.TestCase):
    def test_exact_predecessor_and_extension_request_bytes_are_unchanged(self):
        for record in SUCCESSOR["predecessor"].values():
            path = ROOT / record["path"]
            self.assertEqual(len(path.read_bytes()), record["bytes"])
            self.assertEqual(sha256(path), record["sha256"])
            self.assertEqual(git_blob_sha1(path), record["git_blob_sha1"])
        request = SUCCESSOR["atlas_extension_request"]
        path = ROOT / request["path"]
        self.assertEqual(len(path.read_bytes()), request["bytes"])
        self.assertEqual(sha256(path), request["sha256"])
        self.assertEqual(git_blob_sha1(path), request["git_blob_sha1"])
        self.assertEqual(request["git_blob_sha1"], "4eb5d0b9c87100c9811001bcb776d865efa61f00")

    def test_exact_base_and_boundary_are_frozen(self):
        self.assertEqual(SUCCESSOR["exact_base"]["head"], "9bde6ed4c3338cd3487f828c2aea27e22e274299")
        self.assertEqual(SUCCESSOR["exact_base"]["tree"], "02d9d78b44182f3615e2e2e974683d84d8ce57c6")
        self.assertEqual(SUCCESSOR["directive_id"], "RD-U0-U-SHARED-PATTERNS")
        self.assertEqual(SUCCESSOR["directive_source"]["comment_id"], 5499373802)
        self.assertEqual(SUCCESSOR["status"], "ATLAS_EXTENSION_PENDING")
        self.assertFalse(SUCCESSOR["authorization"]["penpot_execution_authorized"])
        self.assertFalse(SUCCESSOR["authorization"]["publish_authorized"])
        self.assertFalse(SUCCESSOR["authorization"]["real_penpot_execution_authorized"])
        self.assertTrue(SUCCESSOR["authorization"]["native_like_test_execution_authorized"])
        self.assertEqual(SUCCESSOR["execution"]["real_penpot_gates"]["o0_atlas_extension_binding"]["state"], "PENDING")
        self.assertEqual(SUCCESSOR["execution"]["real_penpot_gates"]["action_nav_v0_closure"]["state"], "PENDING")
        self.assertEqual(SUCCESSOR["execution"]["real_penpot_gates"]["action_nav_v0_closure"]["head"], "ad880d5c88d25cf6aa2016896e82db606bd7e432")
        self.assertFalse(SUCCESSOR["boundaries"]["atlas_page_order_assigned"])
        self.assertEqual(SUCCESSOR["boundaries"]["penpot_reads"], 0)
        self.assertEqual(SUCCESSOR["boundaries"]["penpot_mutations"], 0)
        self.assertEqual(SUCCESSOR["boundaries"]["atlas_r2_mutations"], 0)
        self.assertFalse(SUCCESSOR["boundaries"]["kaggle_used"])
        self.assertEqual(SUCCESSOR["boundaries"]["new_component_families"], 0)
        self.assertEqual(SUCCESSOR["boundaries"]["broad_packages_created"], 0)

    def test_six_units_and_source_consumer_lineage_are_exact(self):
        self.assertEqual(SUCCESSOR["patterns"], PREDECESSOR["patterns"])
        self.assertEqual(len(SUCCESSOR["page_units"]), 6)
        self.assertEqual(len(NATIVE["components"]), 7)
        self.assertEqual(len(NATIVE["specimens"]), 22)
        self.assertEqual(NATIVE["authority"]["style_owner"]["git_blob_sha1"], "4d54d3c59f8f1a4e844953edf8d9c86078ccb8c1")
        products = {component["component_id"]: component for pattern in PRODUCT["patterns"] for component in pattern["components"]}
        authority = {item["role"]: item for item in SUCCESSOR["source_authority"]["files"]}
        for component_id, component in NATIVE["components"].items():
            self.assertEqual(component["anatomy"], products[component_id]["anatomy"])
            self.assertEqual(component["states"], products[component_id]["states"])
            self.assertEqual(component["source_consumers"], products[component_id]["source_consumers"])
            self.assertEqual([item["key"] for item in component["anatomy_nodes"]], component["anatomy"])
            lineage = SUCCESSOR["component_source_lineage"][component_id]
            self.assertEqual([item["role"] for item in lineage], component["source_consumers"])
            for item in lineage:
                self.assertEqual(item, authority[item["role"]])
                self.assertRegex(item["git_blob_sha1"], r"^[0-9a-f]{40}$")
                self.assertTrue(item["path"].startswith("site/"))
        for specimen in NATIVE["specimens"].values():
            self.assertIn(specimen["state"], NATIVE["components"][specimen["component_id"]]["states"])
            self.assertGreater(len(specimen["visible_anatomy"]), 0)
            self.assertEqual(specimen["state_style"]["source_css_blob"], NATIVE["authority"]["style_owner"]["git_blob_sha1"])
            self.assertIn(specimen["state_style"]["layout"]["mode"], {"grid", "flex"})

    def test_runtime_is_native_not_metadata_only_and_plugin_data_is_strict(self):
        runtime = (SCRIPT_DIR / "native_runtime_v2.js").read_text(encoding="utf-8")
        executor = (SCRIPT_DIR / "native_executor_v2.js").read_text(encoding="utf-8")
        node_test = (ROOT / SUCCESSOR["execution"]["node_test"]).read_text(encoding="utf-8")
        self.assertNotIn("penpot.ensure", runtime)
        for operation in ("createPage", "openPage", "createBoard", "createText", "createComponent", ".instance()"):
            self.assertIn(operation, runtime)
        self.assertIn("runNativeSuccessor", executor)
        self.assertIn("typeof value !== 'string'", runtime)
        self.assertIn("typeof value !== 'string'", node_test)
        self.assertIsNone(re.search(r"\bString\(", runtime))
        self.assertIsNone(re.search(r"\bString\(", node_test))

    def test_duplicate_detach_screenshot_protected_and_replay_gates_are_committed(self):
        runtime = (SCRIPT_DIR / "native_runtime_v2.js").read_text(encoding="utf-8")
        node_test = (ROOT / SUCCESSOR["execution"]["node_test"]).read_text(encoding="utf-8")
        for gate in ("DUPLICATE_PAGE", "DUPLICATE_STABLE_ID", "DETACHED_INSTANCE", "SCREENSHOT_IMPLEMENTATION", "PROTECTED_PROJECTION_DRIFT", "MASTER_SOURCE_LINEAGE", "REAL_PENPOT_EXECUTION_GATED"):
            self.assertIn(gate, runtime)
        for evidence in ("second.created, 0", "DETACHED_INSTANCE", "SCREENSHOT_IMPLEMENTATION", "PROTECTED_PROJECTION_DRIFT", "MASTER_SOURCE_LINEAGE", "SPECIMEN_ANATOMY_GEOMETRY", "COMPONENT_LIBRARY_IDENTITY"):
            self.assertIn(evidence, node_test)
        self.assertEqual(SUCCESSOR["execution"]["actual_native_like_runs"], 2)
        self.assertEqual(SUCCESSOR["execution"]["second_run_created"], 0)
        self.assertEqual(SUCCESSOR["acceptance"]["duplicates"], 0)
        self.assertEqual(SUCCESSOR["acceptance"]["detached"], 0)
        self.assertEqual(SUCCESSOR["acceptance"]["screenshots"], 0)
        self.assertEqual(SUCCESSOR["acceptance"]["protected_projection_changes"], 0)

    def test_successor_does_not_assign_atlas_page_order(self):
        request = (PACKAGE_DIR / "ASP_ATLAS_EXTENSION_REQUEST_V1.md").read_text(encoding="utf-8")
        self.assertIn("page_order_assignment: O0_ONLY", request)
        self.assertIsNone(re.search(r"(?m)^\s*page_order:\s*", request))
        self.assertNotIn('"page_order":', json.dumps(SUCCESSOR, ensure_ascii=False))


if __name__ == "__main__":
    unittest.main()
