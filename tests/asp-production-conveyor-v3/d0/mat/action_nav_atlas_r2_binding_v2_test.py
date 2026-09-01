import hashlib
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
ADAPTER = ROOT / "catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair/F-ACTION-NAV-ICONS.adapter.v2.json"
CONTRACT = ROOT / "catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair/F-ACTION-NAV-ICONS.layout-contract.v2.json"
ATLAS_HEAD = "663be702d481972cb2e8863af500f1c35dda1d8c"
ATLAS_TREE = "cf9a1e6a5e0a84aea5636334dbd3be4961039b75"
ATLAS_PREFIX = "catalog/asp-production-conveyor-v3/atlas-v2"


def git(*args, text=True):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=text)


def git_json(spec):
    return json.loads(git("show", spec))


def blob(path):
    return git("hash-object", str(path)).strip()


class ActionNavAtlasR2Binding(unittest.TestCase):
    def setUp(self):
        self.adapter = json.loads(ADAPTER.read_text())
        self.contract = json.loads(CONTRACT.read_text())

    def test_exact_atlas_r2_head_tree_blobs_and_action_binding(self):
        self.assertEqual(git("rev-parse", f"{ATLAS_HEAD}^{{tree}}").strip(), ATLAS_TREE)
        atlas = self.adapter["atlas"]
        self.assertEqual((atlas["head"], atlas["tree"]), (ATLAS_HEAD, ATLAS_TREE))
        expected_blobs = {
            "page_map_blob": f"{ATLAS_PREFIX}/penpot-page-map.v2.json",
            "page_unit_bindings_blob": f"{ATLAS_PREFIX}/page-unit-bindings.v2.json",
            "template_registry_blob": f"{ATLAS_PREFIX}/page-template-registry.v2.json",
            "documentation_shell_blob": f"{ATLAS_PREFIX}/documentation-shell-contract.v2.json",
        }
        for field, path in expected_blobs.items():
            self.assertEqual(atlas[field], git("rev-parse", f"{ATLAS_HEAD}:{path}").strip())
        page_map = git_json(f"{ATLAS_HEAD}:{ATLAS_PREFIX}/penpot-page-map.v2.json")
        units = [x for x in page_map["page_units"] if x["package_id"] == "F-ACTION-NAV-ICONS"]
        self.assertEqual(len(units), 1)
        unit = units[0]
        self.assertEqual(unit["template_id"], "FOUNDATION_ASSET_GRID_DENSE_V2")
        self.assertEqual(unit["page_order"], "0010")
        self.assertEqual(unit["physical_page_name"], self.adapter["target"]["page_name"])
        self.assertEqual(unit["semantic_slot_bindings"], self.adapter["semantic_slot_bindings"])

    def test_exact_dense_template_root_and_row_formulas(self):
        registry = git_json(f"{ATLAS_HEAD}:{ATLAS_PREFIX}/page-template-registry.v2.json")
        dense = registry["templates"]["FOUNDATION_ASSET_GRID_DENSE_V2"]
        self.assertEqual((dense["columns"], dense["column_gap"], dense["row_gap"], dense["cell"]["width"], dense["cell"]["padding"]), (6, 24, 24, 256, 16))
        self.assertEqual((dense["cell"]["min"], dense["cell"]["max"], dense["cell"]["height_policy"]), (192, 288, "BOUNDED_CONTENT"))
        self.assertEqual(dense["row_count_formula"], "ceil(instance_count / columns)")
        self.assertEqual(dense["page_root_height_formula"], "content_start_y + content_height + bottom_padding")
        self.assertEqual(dense["page_root_width_formula"], "max(header_right, master_right, grid_right) + outer_margin")
        layout = self.adapter["layout"]
        self.assertEqual((layout["review_grid"]["columns"], layout["review_grid"]["row_count"], layout["review_grid"]["height"]), (6, 3, 624))
        self.assertEqual((layout["root"]["width"], layout["root"]["height"]), (2176, 944))
        self.assertEqual(self.contract["template"]["template_id"], dense["template_id"])

    def test_linked_documentation_header_and_migration_policy(self):
        shell = git_json(f"{ATLAS_HEAD}:{ATLAS_PREFIX}/documentation-shell-contract.v2.json")
        doc = self.adapter["documentation_contract"]
        self.assertEqual(doc["component_id"], shell["page_header"]["component_id"])
        self.assertTrue(doc["linked_instance_required"])
        self.assertEqual(shell["action_nav_partial_migration"]["discovery"], "D0_NATIVE_READBACK_BY_EXACT_PACKAGE_NAMESPACE_AND_SEMANTIC_STABLE_IDS")
        repair = self.adapter["repair_policy"]
        self.assertTrue(repair["no_create_page_or_root_when_existing_partial_found"])
        self.assertTrue(repair["existing_page_id_preserved"])
        self.assertTrue(repair["existing_root_id_preserved"])
        self.assertTrue(repair["imported_svg_ids_preserved"])
        self.assertEqual(repair["internal_svg_geometry_change"], "FORBIDDEN")
        self.assertEqual(repair["top_level_documentation_relayout"], "ALLOWED")

    def test_executor_launcher_source_and_string_contract_identities(self):
        ep = self.adapter["entry_point"]
        for field in ("executor", "launcher"):
            item = ep[field]
            raw = (ROOT / item["path"]).read_bytes()
            self.assertEqual((len(raw), hashlib.sha256(raw).hexdigest(), blob(ROOT / item["path"])), (item["bytes"], item["sha256"], item["git_blob_sha1"]))
        source = self.adapter["source_binding"]
        raw = git("show", f"{source['remote_head']}:{source['source_path']}", text=False)
        git_blob = hashlib.sha1(f"blob {len(raw)}\0".encode() + raw).hexdigest()
        self.assertEqual((len(raw), hashlib.sha256(raw).hexdigest(), git_blob), (source["byte_count"], source["sha256"], source["git_blob_sha1"]))
        package = json.loads(raw)
        self.assertEqual(len(package["component_ids"]), 8)
        self.assertEqual(len(package["states"]), 18)
        self.assertEqual(len(package["assets_and_hashes"]), 9)
        self.assertEqual(self.adapter["exact_asset_contract"]["asset_bytes_plugin_data_type"], "DECIMAL_STRING")
        payload = (ROOT / ep["executor"]["path"]).read_text()
        self.assertIn("String(variants[0].bytes)", payload)
        self.assertIn("String(v.bytes)", payload)
        self.assertNotIn("Number(G(x,U.sourceNamespace,'asset-bytes'))", payload)

    def test_no_penpot_authorization_and_deterministic_json_readback(self):
        self.assertEqual(self.adapter["state"], "ATLAS_R2_REBIND_EXECUTABLE_CANDIDATE_NOT_LAUNCHED")
        self.assertEqual(self.adapter["entry_point"]["penpot_mutations_by_mat"], 0)
        self.assertFalse(self.adapter["repair_policy"]["promotion_authorized"])
        for path in (ADAPTER, CONTRACT):
            parsed = json.loads(path.read_text())
            with tempfile.TemporaryDirectory() as tmp:
                regenerated = Path(tmp) / path.name
                regenerated.write_text(json.dumps(parsed, ensure_ascii=False, indent=2) + "\n")
                self.assertEqual(json.loads(regenerated.read_text()), parsed)
                self.assertEqual(regenerated.read_bytes(), path.read_bytes())
                self.assertEqual(json.dumps(json.loads(regenerated.read_text()), ensure_ascii=False, sort_keys=True), json.dumps(parsed, ensure_ascii=False, sort_keys=True))


if __name__ == "__main__":
    unittest.main()
