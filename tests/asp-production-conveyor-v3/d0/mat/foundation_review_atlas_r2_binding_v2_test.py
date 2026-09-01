import hashlib
import json
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
ATLAS_HEAD = "663be702d481972cb2e8863af500f1c35dda1d8c"
ATLAS_TREE = "cf9a1e6a5e0a84aea5636334dbd3be4961039b75"
ATLAS_PREFIX = "catalog/asp-production-conveyor-v3/atlas-v2"
CATALOG = ROOT / "catalog/asp-production-conveyor-v3/d0/mat/atlas-layout-repair"
PAYLOAD = ROOT / "scripts/asp-production-conveyor-v3/d0/mat/foundation_review_atlas_r2_relayout_payload_v2.js"
LAUNCHER = ROOT / "scripts/asp-production-conveyor-v3/d0/mat/foundation_review_atlas_r2_relayout_v2.js"
NATIVE_TEST = ROOT / "tests/asp-production-conveyor-v3/d0/mat/foundation_review_atlas_r2_relayout_v2.test.js"
PACKAGES = (
    "F-FOUNDATIONS-REVIEW-COLORS-STATUS",
    "F-FOUNDATIONS-REVIEW-SPACING-SIZING",
    "F-FOUNDATIONS-REVIEW-SHAPE-ELEVATION",
    "F-FOUNDATIONS-REVIEW-MOTION-ACCESSIBILITY",
)
INSTANCE_COUNTS = dict(zip(PACKAGES, (26, 14, 8, 9)))


def git(*args, text=True):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=text)


def git_json(spec):
    return json.loads(git("show", spec))


def blob(path):
    return git("hash-object", str(path)).strip()


def identity(path):
    raw = path.read_bytes()
    return len(raw), hashlib.sha256(raw).hexdigest(), blob(path)


class FoundationReviewAtlasR2Binding(unittest.TestCase):
    def setUp(self):
        self.adapters = {pid: json.loads((CATALOG / f"{pid}.adapter.v2.json").read_text()) for pid in PACKAGES}
        self.contracts = {pid: json.loads((CATALOG / f"{pid}.layout-contract.v2.json").read_text()) for pid in PACKAGES}

    def test_exact_atlas_r2_head_tree_and_git_only_blobs(self):
        self.assertEqual(git("rev-parse", f"{ATLAS_HEAD}^{{tree}}").strip(), ATLAS_TREE)
        expected = {
            "page_map_blob": f"{ATLAS_PREFIX}/penpot-page-map.v2.json",
            "page_unit_bindings_blob": f"{ATLAS_PREFIX}/page-unit-bindings.v2.json",
            "template_registry_blob": f"{ATLAS_PREFIX}/page-template-registry.v2.json",
            "documentation_shell_blob": f"{ATLAS_PREFIX}/documentation-shell-contract.v2.json",
        }
        for adapter in self.adapters.values():
            self.assertEqual((adapter["atlas"]["head"], adapter["atlas"]["tree"]), (ATLAS_HEAD, ATLAS_TREE))
            for field, path in expected.items():
                self.assertEqual(adapter["atlas"][field], git("rev-parse", f"{ATLAS_HEAD}:{path}").strip())

    def test_four_package_local_frozen_execution_tuples_are_independent(self):
        ids = set()
        for pid, adapter in self.adapters.items():
            frozen = adapter["frozen_execution_tuple"]
            self.assertEqual((adapter["package_id"], adapter["execution_tuple_id"], frozen["package_id"]), (pid, pid, pid))
            self.assertEqual(frozen["adapter_id"], f"D0-MAT-{pid}-ATLAS-R2")
            self.assertEqual(frozen["template_id"], "FOUNDATION_ASSET_GRID_STANDARD_V2")
            self.assertEqual(frozen["atlas_head"], ATLAS_HEAD)
            self.assertEqual(frozen["atlas_tree"], ATLAS_TREE)
            self.assertEqual(frozen["atlas_bindings_blob"], "23475806beebfbe21bd77759440c169c60627550")
            ids.add(frozen["adapter_id"])
            self.assertEqual(adapter["terminal_status"], "PUBLISHABLE_AFTER_ATLAS_EVIDENCE_GATE")
            self.assertFalse(adapter["repair_policy"]["promotion_authorized"])
            self.assertFalse(adapter["repair_policy"]["penpot_authorization"])
        self.assertEqual(len(ids), 4)

    def test_exact_local_executor_launcher_and_remote_source_bytes(self):
        for adapter in self.adapters.values():
            self.assertEqual(identity(PAYLOAD), tuple(adapter["entry_point"]["executor"][key] for key in ("bytes", "sha256", "git_blob_sha1")))
            self.assertEqual(identity(LAUNCHER), tuple(adapter["entry_point"]["launcher"][key] for key in ("bytes", "sha256", "git_blob_sha1")))
            source = adapter["source_binding"]
            raw = git("show", f"{source['remote_head']}:{source['source_path']}", text=False)
            source_blob = hashlib.sha1(f"blob {len(raw)}\0".encode() + raw).hexdigest()
            self.assertEqual((len(raw), hashlib.sha256(raw).hexdigest(), source_blob), (source["byte_count"], source["sha256"], source["git_blob_sha1"]))

    def test_exact_standard_v2_rows_root_and_linked_header_contract(self):
        registry = git_json(f"{ATLAS_HEAD}:{ATLAS_PREFIX}/page-template-registry.v2.json")
        shell = git_json(f"{ATLAS_HEAD}:{ATLAS_PREFIX}/documentation-shell-contract.v2.json")
        standard = registry["templates"]["FOUNDATION_ASSET_GRID_STANDARD_V2"]
        self.assertEqual((standard["columns"], standard["column_gap"], standard["row_gap"], standard["cell"]["width"], standard["cell"]["padding"]), (4, 32, 32, 320, 20))
        self.assertEqual(standard["row_count_formula"], "ceil(instance_count / columns)")
        self.assertEqual(standard["page_root_height_formula"], "content_start_y + content_height + bottom_padding")
        self.assertEqual(standard["page_root_width_formula"], "max(header_right, master_right, grid_right) + outer_margin")
        self.assertEqual(shell["page_header"]["component_id"], "ATLAS_PAGE_HEADER_V2")
        for pid, contract in self.contracts.items():
            template = contract["template"]
            self.assertEqual(template["template_id"], "FOUNDATION_ASSET_GRID_STANDARD_V2")
            self.assertEqual(template["root"]["width"], 2176)
            self.assertEqual(template["root"]["height_formula"], standard["page_root_height_formula"])
            self.assertEqual(template["root"]["width_formula"], standard["page_root_width_formula"])
            rows = (INSTANCE_COUNTS[pid] + 3) // 4
            review_height = rows * 256 + max(rows - 1, 0) * 32
            self.assertEqual(template["review_grid"]["layout_engine"], "NATIVE_GRID")
            self.assertEqual(template["review_grid"]["instance_count"], INSTANCE_COUNTS[pid])
            self.assertEqual(template["review_grid"]["row_count"], rows)
            self.assertEqual(template["review_grid"]["row_count_formula"], "ceil(instance_count / columns)")
            self.assertEqual(template["review_grid"]["height"], review_height)
            self.assertNotIn("family_rows", template["review_grid"])
            self.assertEqual(template["root"]["height"], 256 + max(288, review_height) + 64)
            self.assertEqual(contract["documentation_header"]["component_id"], "ATLAS_PAGE_HEADER_V2")
            self.assertEqual(contract["documentation_header"]["lineage"], "LINKED_DOCUMENTATION_PAGEHEADER_ONLY")
            self.assertEqual(contract["documentation_header"]["layout_engine"], "NATIVE_FLEX")

    def test_pinned_atlas_units_match_each_successor_without_modifying_atlas(self):
        page_map = git_json(f"{ATLAS_HEAD}:{ATLAS_PREFIX}/penpot-page-map.v2.json")
        for pid, adapter in self.adapters.items():
            units = [unit for unit in page_map["page_units"] if unit["package_id"] == pid]
            self.assertEqual(len(units), 1)
            unit = units[0]
            self.assertEqual(unit["atlas_page_id"], adapter["atlas_page_id"])
            self.assertEqual(unit["page_order"], adapter["page_order"])
            self.assertEqual(unit["physical_page_name"], adapter["target"]["page_name"])
            self.assertEqual(unit["template_id"], adapter["template_id"])
            self.assertEqual(unit["semantic_slot_bindings"], adapter["semantic_slot_bindings"])

    def test_strict_string_only_test_double_and_actual_second_replay_contract(self):
        payload = PAYLOAD.read_text()
        native_test = NATIVE_TEST.read_text()
        self.assertIn("typeof value==='string'", payload)
        self.assertIn("PLUGIN_DATA_VALUE_NOT_STRING", payload)
        self.assertNotIn("String(v)", payload)
        self.assertIn("if(typeof value!=='string')throw Error('PLUGIN_DATA_VALUE_NOT_STRING')", native_test)
        self.assertNotIn("String(", native_test)
        self.assertIn("const second=await runFoundationReviewAtlasR2RelayoutV2", native_test)
        self.assertIn("a.equal(second.secondRunCreated,0)", native_test)
        self.assertIn("duplicates:0,detached:0,screenshots:0", payload)
        self.assertIn("penpotAuthorization:false", payload)
        self.assertIn("review.addGridLayout()", payload)
        self.assertIn("review.grid.appendChild(shape,row,column)", payload)
        self.assertIn("'NATIVE_GRID'", payload)
        self.assertIn("ceil(instance_count / columns)", payload)
        self.assertNotIn("ceil(family_instance_count / columns)", payload)
        self.assertIn("Shape and Elevation uses two global rows for eight instances", native_test)
        self.assertIn("protected Free fill drift rejects", native_test)
        self.assertIn("protected Foundation text drift rejects", native_test)


if __name__ == "__main__":
    unittest.main()
