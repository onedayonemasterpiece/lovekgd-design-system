from __future__ import annotations

import hashlib
import json
import subprocess
import unittest
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ATLAS = ROOT / "catalog/asp-production-conveyor-v3/atlas"
PAGE_MAP = ATLAS / "penpot-page-map.v1.json"
BINDINGS = ATLAS / "page-unit-bindings.v1.json"
TEMPLATES = ATLAS / "page-template-registry.v1.json"
CLASSIFICATION = ATLAS / "integration/a0-wave1-r04.v1.json"

ATLAS_HEAD = "a32b9874e1eec367fd6b98bc3c601d0638408843"
ATLAS_TREE = "f527c628ed0dfc17eec9208b0ae15b8a29bbedb2"
A0_BRANCH = "a0/asp-penpot-page-wave-v1-20260901"
A0_HEAD = "4edc859861fba3f18fab0e65e9d2e8c0a7394bdb"
A0_TREE = "3132550212222ec3dea716710821e732ad0d92bb"
EXECUTOR_PATH = "scripts/asp-production-conveyor-v3/a0/page-wave-v1/native-page-unit-executor.v1.js"
EXECUTOR_BLOB = "5643b0373aa092ae64d03d79abf29a7de9b2ab45"
EXECUTOR_SHA256 = "d0cff3136a9cd99736db5b6adba79e2a5a63a5345df78e9457cf5d5a89108d5d"

EXPECTED = {
    "A0-PAGE-WAVE1-HOME-R1": (40, "66bff015f866393493fc3e4af9f51a1d3893ce45"),
    "A0-PAGE-WAVE1-LISTING_WEEKEND-R1": (41, "940a282838a2cc993f9daba823c05889b1e6e687"),
    "A0-PAGE-WAVE1-LISTING_POPULAR-R1": (42, "d59a7e4a51b0c7b07f9ac7af4a39798ae8554770"),
    "A0-PAGE-WAVE1-LISTING_UNUSUAL-R1": (43, "5c951fd5645efbd218cf00ed3047586de6d156c0"),
    "A0-PAGE-WAVE1-COLLECTIONS-R1": (44, "fbf93c21c2017e2f4b6723ffb8e687f3ed0a4959"),
    "A0-PAGE-WAVE1-EXHIBITIONS-R1": (45, "576c049339c36140644a31738fda7bad7defb925"),
}


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def git(*args: str, text: bool = True):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=text)


def canonical(value) -> bytes:
    return (json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode()


class A0Wave1AtlasIntegrationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page_map = load(PAGE_MAP)
        cls.bindings = load(BINDINGS)
        cls.templates = load(TEMPLATES)
        cls.classification = load(CLASSIFICATION)
        cls.report_by_id = {u["package_id"]: u for u in cls.classification["units"]}

    def test_exact_frozen_heads_trees_and_executor_blob(self):
        self.assertEqual(git("show", "-s", "--format=%T", ATLAS_HEAD).strip(), ATLAS_TREE)
        self.assertEqual(git("show", "-s", "--format=%T", A0_HEAD).strip(), A0_TREE)
        self.assertEqual(
            git("rev-parse", f"refs/remotes/origin/{A0_BRANCH}").strip(), A0_HEAD
        )
        spec = f"{A0_HEAD}:{EXECUTOR_PATH}"
        raw = git("show", spec, text=False)
        self.assertEqual(git("rev-parse", spec).strip(), EXECUTOR_BLOB)
        self.assertEqual(len(raw), 11238)
        self.assertEqual(hashlib.sha256(raw).hexdigest(), EXECUTOR_SHA256)

    def test_wave1_package_lookup_is_exactly_once_in_both_atlas_records(self):
        map_counts = Counter(u["package_id"] for u in self.page_map["page_units"])
        binding_counts = Counter(u["package_id"] for u in self.bindings["units"])
        self.assertEqual(set(self.report_by_id), set(EXPECTED))
        for package_id in EXPECTED:
            self.assertEqual(map_counts[package_id], 1, package_id)
            self.assertEqual(binding_counts[package_id], 1, package_id)
            map_unit = next(u for u in self.page_map["page_units"] if u["package_id"] == package_id)
            binding_unit = next(u for u in self.bindings["units"] if u["package_id"] == package_id)
            self.assertEqual(map_unit, binding_unit, package_id)

    def test_exact_remote_package_bytes_page_names_and_artifact_binding(self):
        for package_id, (page_order, expected_blob) in EXPECTED.items():
            unit = next(u for u in self.page_map["page_units"] if u["package_id"] == package_id)
            report = self.report_by_id[package_id]
            remote = unit["publication_dependency"]["remote_binding"]
            spec = f'{A0_HEAD}:{remote["source_path"]}'
            raw = git("show", spec, text=False)
            package = json.loads(raw)

            self.assertEqual(unit["inventory_class"], "A0")
            self.assertEqual(unit["page_order"], page_order)
            self.assertEqual(unit["template_id"], "ARCHETYPE_DESKTOP_MOBILE_V1")
            self.assertEqual(git("rev-parse", spec).strip(), expected_blob)
            self.assertEqual(remote["git_blob_sha1"], expected_blob)
            self.assertEqual(len(raw), remote["byte_count"])
            self.assertEqual(hashlib.sha256(raw).hexdigest(), remote["sha256"])
            self.assertEqual(remote["remote_head"], A0_HEAD)
            self.assertEqual(remote["remote_tree"], A0_TREE)
            self.assertEqual(package["package_id"], package_id)
            self.assertEqual(package["unit_id"], package_id)
            self.assertEqual(package["page_contract"]["page_name"], unit["exact_package_page_name"])
            self.assertEqual(package["artifacts"]["executor"]["git_blob_sha1"], EXECUTOR_BLOB)
            self.assertEqual(package["artifacts"]["executor"]["sha256"], EXECUTOR_SHA256)
            self.assertEqual(report["git_blob_sha1"], expected_blob)
            self.assertEqual(report["remote_integrity"], "PASS")
            self.assertEqual(report["lookup_cardinality"], "PASS")
            self.assertEqual(report["page_name_binding"], "PASS")

    def test_shared_executor_is_not_bound_to_the_atlas_template_contract(self):
        template = self.templates["templates"]["ARCHETYPE_DESKTOP_MOBILE_V1"]
        source = git("show", f"{A0_HEAD}:{EXECUTOR_PATH}")

        self.assertEqual(template["page_root_width"], 2624)
        self.assertEqual(template["header"], [64, 64, 2496, 128])
        self.assertEqual(template["desktop"], [64, 256, 1440, "AUTO"])
        self.assertEqual(template["mobile"], [1568, 256, 390, "AUTO"])
        self.assertEqual(template["evidence"], [2048, 256, 512, "AUTO"])
        self.assertNotIn("template_id", source)
        self.assertNotIn("semantic_slot_bindings", source)
        self.assertIn("x.resize(1800,", source)
        self.assertIn("V(p,x,'x',v.id==='desktop'?32:1350)", source)
        self.assertIn("V(p,x,'y',32)", source)
        self.assertIn("V(p,x,'x',2000)", source)
        self.assertIn("V(p,x,'y',v.id==='desktop'?0:1000)", source)
        self.assertIn("function CM(p,g,n,v)", source)
        cm_body = source.split("function CM(p,g,n,v)", 1)[1].split("function RG", 1)[0]
        self.assertIn("J(p,g.root,x)", cm_body)

        self.assertEqual(self.classification["overall_verdict"], "ATLAS_LAYOUT_REPAIR")
        self.assertEqual(self.classification["checks"]["shared_atlas_execution_binding"], "REPAIR")
        for report in self.classification["units"]:
            self.assertEqual(report["template_binding"], "REPAIR", report["package_id"])
            self.assertEqual(report["verdict"], "ATLAS_LAYOUT_REPAIR", report["package_id"])
            self.assertEqual(report["repair_scope"], "AFFECTED_PACKAGE_ONLY")

    def test_repair_contract_is_fail_closed_and_does_not_improvise_coordinates(self):
        contract = self.classification["required_adapter_contract"]
        self.assertEqual(contract["input_binding"], "EXACT_ATLAS_RECORD_PLUS_EXACT_PACKAGE_RECORD")
        self.assertEqual(contract["package_lookup_cardinality"], "EXACTLY_ONCE_IN_PAGE_MAP_AND_BINDINGS")
        self.assertEqual(contract["read_fields"], ["template_id", "semantic_slot_bindings"])
        self.assertEqual(contract["coordinate_policy"], "CALCULATE_FROM_TEMPLATE_HONOR_AND_CHECK")
        self.assertEqual(contract["coordinate_improvisation"], "FORBIDDEN")
        self.assertEqual(contract["overlap"], "REJECT")
        self.assertEqual(contract["managed_nodes_boundary"], "CANDIDATE_ROOT_ONLY")
        self.assertEqual(contract["missing_exact_evidence"], "ABORT_NO_PLACEHOLDER_OR_SCREENSHOT")
        self.assertEqual(contract["max_managed_creations_per_invocation"], 3)
        self.assertEqual(contract["second_run_created"], 0)
        self.assertFalse(self.classification["promotion_authorized"])
        self.assertEqual(self.classification["penpot_mutations"], 0)

    def test_classification_is_canonical_json(self):
        self.assertEqual(canonical(self.classification), CLASSIFICATION.read_bytes())


if __name__ == "__main__":
    unittest.main()
