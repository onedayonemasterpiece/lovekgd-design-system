import hashlib
import json
import pathlib
import re
import unittest

ROOT = next(parent for parent in pathlib.Path(__file__).resolve().parents if (parent / "catalog").exists() and (parent / "scripts").exists())
LOCAL = ROOT / "catalog/asp-production-conveyor-v3/u0/free-shell-review"
PACKAGE_PATH = LOCAL / "U-FREE-SHELL-REVIEW-PAGE-R1.package.v2.json"
PACKAGE = json.loads(PACKAGE_PATH.read_text(encoding="utf-8"))
PRODUCT = json.loads((LOCAL / "product-contract.v1.json").read_text(encoding="utf-8"))
REQUEST = LOCAL / "ASP_ATLAS_EXTENSION_REQUEST_V1.md"
RUNTIME = ROOT / "scripts/asp-production-conveyor-v3/u0/free-shell-review/native_runtime_v2.js"
EXECUTOR = ROOT / "scripts/asp-production-conveyor-v3/u0/free-shell-review/native_executor_v2.js"
NODE_TEST = ROOT / "tests/asp-production-conveyor-v3/u0/free-shell-review/test_native_executor_v2.js"


def git_blob_sha1(path: pathlib.Path) -> str:
    payload = path.read_bytes()
    return hashlib.sha1(f"blob {len(payload)}\0".encode() + payload).hexdigest()


class FreeShellNativeSuccessorTests(unittest.TestCase):
    def test_exact_successor_identity_and_non_authorization(self):
        self.assertEqual(PACKAGE["schema_version"], "kenigevents.u0-review-page-package.v2")
        self.assertEqual(PACKAGE["package_id"], "U-FREE-SHELL-REVIEW-PAGE-R1")
        self.assertEqual(PACKAGE["branch"], "agent/d0-executable-buffer-v2/u0-free-shell-native-r2")
        self.assertEqual(PACKAGE["atlas_r2"]["head"], "663be702d481972cb2e8863af500f1c35dda1d8c")
        self.assertEqual(PACKAGE["atlas_r2"]["tree"], "cf9a1e6a5e0a84aea5636334dbd3be4961039b75")
        self.assertTrue(PACKAGE["atlas_r2"]["read_only"])
        self.assertFalse(PACKAGE["authorization"]["penpot_execution_authorized"])
        self.assertFalse(PACKAGE["authorization"]["promotion_authorized"])
        self.assertFalse(PACKAGE["native_successor"]["atlas_page_order_assigned"])
        self.assertEqual(PACKAGE["native_successor"]["expected_status"], "ATLAS_EXTENSION_PENDING")

    def test_brandbook_medallions_and_collection_catalog_are_exact(self):
        self.assertEqual(PACKAGE["dependencies"]["brandbook"]["tree"], "29ad3ccf0628e448d0881007129981b9f766856f")
        self.assertEqual(PACKAGE["dependencies"]["medallions"]["tree"], "95ab14cbd64697910c871ccb1a7ca7428cf618bd")
        roles = {item["role"]: item for item in PACKAGE["source_authority"]["files"]}
        self.assertEqual(roles["CollectionCatalog"], {
            "role": "CollectionCatalog",
            "path": "site/src/pages/podborki/index.astro",
            "git_blob_sha1": "1a3dc3e2fb6d1df644625d2f2578b3042b3406bb",
        })
        breadcrumbs = next(item for item in PACKAGE["page_units"][0]["components"] if item["component_id"] == "U-SHELL-BREADCRUMBS")
        self.assertIn("CollectionCatalog", breadcrumbs["source_consumers"])

    def test_product_component_semantics_are_preserved_and_visuals_are_concrete(self):
        product_components = {item["component_id"]: item for item in PRODUCT["components"]}
        package_components = {item["component_id"]: item for item in PACKAGE["page_units"][0]["components"]}
        self.assertEqual(set(package_components), set(product_components))
        for component_id, product in product_components.items():
            package = package_components[component_id]
            for field in ("anatomy", "states", "responsive_behavior", "dependencies", "source_consumers"):
                self.assertEqual(package[field], product[field], f"{component_id}:{field}")
            visual = package["native_visual"]
            self.assertGreater(visual["size"][0], 0)
            self.assertGreater(visual["size"][1], 0)
            self.assertIn(visual["direction"], ("row", "column"))
            self.assertRegex(visual["fill"], r"^(?:#[0-9a-fA-F]{6}|rgba?\()")
            roles = [node[0] for node in visual["nodes"]]
            anatomy = [node if isinstance(node, str) else node["key"] for node in product["anatomy"]]
            self.assertEqual(roles, anatomy)
            self.assertTrue(all(node[2] or node[0] for node in visual["nodes"]))
            self.assertTrue(set(product["states"]).issubset(visual["state_styles"]))

    def test_every_master_source_consumer_resolves_to_exact_blob(self):
        sources = {item["role"]: item for item in PACKAGE["source_authority"]["files"]}
        self.assertGreater(len(sources), 0)
        for source in sources.values():
            self.assertTrue(source["path"].startswith("site/"))
            self.assertRegex(source["git_blob_sha1"], r"^[0-9a-f]{40}$")
        for component in PACKAGE["page_units"][0]["components"]:
            for role in component["source_consumers"]:
                self.assertIn(role, sources, f"{component['component_id']}:{role}")

    def test_native_executor_replaces_metadata_ensure_and_is_string_strict(self):
        runtime = RUNTIME.read_text(encoding="utf-8")
        executor = EXECUTOR.read_text(encoding="utf-8")
        node_test = NODE_TEST.read_text(encoding="utf-8")
        self.assertNotIn("penpot.ensure", runtime + executor)
        self.assertIn("penpot.createPage", runtime)
        self.assertIn("penpot.createBoard", runtime)
        self.assertIn("penpot.createText", runtime)
        self.assertIn("library.local.createComponent", runtime)
        self.assertIn("record.instance()", runtime)
        self.assertIn("typeof value === 'string'", runtime)
        self.assertIn("typeof value !== 'string'", node_test)
        self.assertNotIn("String(value)", runtime + node_test)
        self.assertNotIn("String(v)", runtime + node_test)
        self.assertIn("second.created, 0", node_test)
        for gate in ("DUPLICATE", "DETACHED", "SCREENSHOT", "PROTECTED_PROJECTION_CHANGED"):
            self.assertIn(gate, runtime + node_test)

    def test_every_specimen_has_exact_family_state_binding_and_no_generic_palette(self):
        components = {item["component_id"]: item for item in PACKAGE["page_units"][0]["components"]}
        for specimen in PACKAGE["page_units"][0]["specimens"]:
            self.assertEqual(set(specimen["component_state_bindings"]), set(specimen["component_ids"]))
            for component_id, state in specimen["component_state_bindings"].items():
                self.assertIn(state, components[component_id]["states"])
                self.assertIn(state, components[component_id]["native_visual"]["state_styles"])
        serialized = json.dumps(PACKAGE, ensure_ascii=False).lower()
        for old_generic in ("#ffc629", "#6e3d9a", "#fff4d6", "#d8cfc5", "#f7f1e8"):
            self.assertNotIn(old_generic, serialized)
        self.assertEqual(PACKAGE["acceptance"]["unbound_state_fallbacks"], 0)

    def test_source_style_and_exact_asset_evidence_are_frozen(self):
        sources = {item["role"]: item for item in PACKAGE["source_authority"]["files"]}
        for component in PACKAGE["page_units"][0]["components"]:
            evidence = component["native_visual"]["source_style_evidence"]
            self.assertGreater(len(evidence), 0)
            for row in evidence:
                self.assertIn(row["role"], sources)
                self.assertEqual(row["git_blob_sha1"], sources[row["role"]]["git_blob_sha1"])
                self.assertTrue(row["selector"] and row["exact_declarations"])
        asset = PACKAGE["asset_bindings"]["free_listing_medallion"]
        payload = asset["svg"].encode()
        self.assertEqual(len(payload), asset["bytes"])
        self.assertEqual(hashlib.sha256(payload).hexdigest(), asset["sha256"])
        self.assertEqual(asset["git_blob_sha1"], "3f6f7aadf0dc818112ab310875d8ad270c563b45")

    def test_complete_protection_global_integrity_and_coherent_census_are_enforced(self):
        runtime = RUNTIME.read_text(encoding="utf-8")
        node_test = NODE_TEST.read_text(encoding="utf-8")
        self.assertEqual(PACKAGE["native_successor"]["managed_nodes_expected"], 40)
        self.assertEqual(PACKAGE["acceptance"]["maximum_managed_nodes"], 40)
        self.assertEqual(PACKAGE["acceptance"]["exact_managed_nodes"], 40)
        for field in ("characters", "fills", "strokes", "pluginData", "components"):
            self.assertIn(field, runtime)
        self.assertIn("const nodes = walk(root)", runtime)
        self.assertIn("node.type === 'image'", runtime)
        self.assertIn("UNTAGGED_SPECIMEN_CHILD", runtime + node_test)
        self.assertIn("PROTECTED_PROJECTION_CHANGED", runtime + node_test)
        self.assertIn("UNBOUND_SPECIMEN_COMPONENT_STATE", runtime + node_test)

    def test_extension_request_is_byte_preserved_and_order_is_o0_only(self):
        self.assertEqual(git_blob_sha1(REQUEST), "2ad8f60cd717e36df1908c3bc7857ecbaa83d8cf")
        text = REQUEST.read_text(encoding="utf-8")
        self.assertIn("page_order_assignment: O0_ONLY", text)
        self.assertNotRegex(text, r"(?m)^page_order:")
        self.assertEqual(PACKAGE["native_successor"]["atlas_extension_request_git_blob_sha1"], git_blob_sha1(REQUEST))

    def test_boundaries_and_acceptance_remain_fail_closed(self):
        self.assertEqual(PACKAGE["boundaries"]["penpot_reads_by_u0"], 0)
        self.assertEqual(PACKAGE["boundaries"]["penpot_mutations_by_u0"], 0)
        self.assertFalse(PACKAGE["boundaries"]["kaggle_used"])
        self.assertEqual(PACKAGE["acceptance"]["second_run_created"], 0)
        self.assertEqual(PACKAGE["acceptance"]["exact_managed_nodes"], 40)
        self.assertEqual(PACKAGE["acceptance"]["duplicates"], 0)
        self.assertEqual(PACKAGE["acceptance"]["detached_instances"], 0)
        self.assertEqual(PACKAGE["acceptance"]["screenshot_shapes"], 0)
        self.assertTrue(PACKAGE["acceptance"]["protected_projections_unchanged"])
        self.assertTrue(PACKAGE["acceptance"]["plugin_data_string_only"])


if __name__ == "__main__":
    unittest.main()
