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

ATLAS_HEAD = "a32b9874e1eec367fd6b98bc3c601d0638408843"
ATLAS_TREE = "f527c628ed0dfc17eec9208b0ae15b8a29bbedb2"
A0_HEAD = "4edc859861fba3f18fab0e65e9d2e8c0a7394bdb"
A0_TREE = "3132550212222ec3dea716710821e732ad0d92bb"
A0_BRANCH = "a0/asp-penpot-page-wave-v1-20260901"
CHECKPOINT_COMMENT = 5489851638

# package_id: (atlas page order, package lane, source package blob)
EXPECTED = {
    "A0-PAGE-AUX-OWNER_REVIEW_INDEX-R1": (0, "aux", "9f1497b0091fe3d99f4bf2dd8f7bf0978d60a34c"),
    "A0-PAGE-AUX-DATE_LISTING_SHELL-R1": (32, "aux", "052c8950004b61cee9095080409e4ecaba30e771"),
    "A0-PAGE-WAVE2-SEARCH-R1": (46, "wave2", "97b341ff2904d9767e6f76cc75d6c59d34291506"),
    "A0-PAGE-WAVE2-FAVORITES-R1": (47, "wave2", "8171abc54b5f07c91ed98419e30696dfaac4d0f6"),
    "A0-PAGE-WAVE2-PERSONAL_FEED-R1": (48, "wave2", "f594361bf36e658a2738317edfa414a21abf1239"),
    "A0-PAGE-WAVE2-FESTIVALS-R1": (49, "wave2", "f730efc39ecab8c99ee57383e9947c2ce42c4775"),
    "A0-PAGE-WAVE2-INTEREST_CLUBS-R1": (50, "wave2", "019b3714427f50fece7476ce93c9e024950c1d57"),
    "A0-PAGE-WAVE2-ARTIFACTS-R1": (51, "wave2", "4fb6e972988cbffc9798f6fd6995c8d50d06ea7c"),
    "A0-PAGE-WAVE2-EVENT_DETAIL-R1": (52, "wave2", "cf7783738f62953a7d08ed71252655dfa45a1c79"),
    "A0-PAGE-WAVE2-FOCUS_GROUP-R1": (53, "wave2", "529eda708b663d2b51b97fd5f11d2f21e0b90ae8"),
    "A0-PAGE-WAVE2-INFORMATION_PAGES-R1": (54, "wave2", "b61e2d8d14c031d15f09f56182a51acde20e11de"),
    "A0-PAGE-WAVE2-SPECIAL_STATE-R1": (55, "wave2", "ffaffae8fd9735bec77c9611c17c7e17f5ca7c02"),
}


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def git(*args: str, text: bool = True):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=text)


def git_bytes(spec: str) -> bytes:
    return git("show", spec, text=False)


def selected(unit: dict) -> bool:
    package_id = unit["package_id"]
    return package_id.startswith(("A0-PAGE-WAVE2-", "A0-PAGE-AUX-"))


def compact_record_sha256(record: dict) -> str:
    content = dict(record)
    content.pop("package_record_sha256", None)
    raw = json.dumps(
        content, ensure_ascii=False, separators=(",", ":"), sort_keys=True
    ).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


class A0Wave2AuxAtlasBindingTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page_map = load(PAGE_MAP)
        cls.bindings = load(BINDINGS)
        cls.templates = load(TEMPLATES)["templates"]
        cls.map_units = [unit for unit in cls.page_map["page_units"] if selected(unit)]
        cls.binding_units = [unit for unit in cls.bindings["units"] if selected(unit)]

    def test_exact_atlas_and_a0_commit_trees_are_available(self):
        self.assertEqual(git("show", "-s", "--format=%T", ATLAS_HEAD).strip(), ATLAS_TREE)
        self.assertEqual(git("show", "-s", "--format=%T", A0_HEAD).strip(), A0_TREE)

    def test_exactly_ten_wave2_and_two_aux_packages_are_bound_once(self):
        all_map_ids = [unit["package_id"] for unit in self.page_map["page_units"]]
        all_binding_ids = [unit["package_id"] for unit in self.bindings["units"]]
        self.assertEqual(Counter(all_map_ids), Counter(all_binding_ids))
        self.assertEqual(set(EXPECTED), {unit["package_id"] for unit in self.map_units})
        self.assertEqual(set(EXPECTED), {unit["package_id"] for unit in self.binding_units})
        self.assertEqual(sum(package.startswith("A0-PAGE-WAVE2-") for package in EXPECTED), 10)
        self.assertEqual(sum(package.startswith("A0-PAGE-AUX-") for package in EXPECTED), 2)
        for package_id in EXPECTED:
            self.assertEqual(all_map_ids.count(package_id), 1, package_id)
            self.assertEqual(all_binding_ids.count(package_id), 1, package_id)

        map_by_id = {unit["package_id"]: unit for unit in self.map_units}
        bindings_by_id = {unit["package_id"]: unit for unit in self.binding_units}
        self.assertEqual(map_by_id, bindings_by_id)

    def test_atlas_records_pin_exact_a0_head_tree_branch_blob_and_package_identity(self):
        for unit in self.map_units:
            package_id = unit["package_id"]
            expected_order, expected_lane, expected_blob = EXPECTED[package_id]
            dependency = unit["publication_dependency"]
            binding = dependency["remote_binding"]

            self.assertEqual(unit["inventory_class"], "A0", package_id)
            self.assertEqual(unit["owner"], "A0", package_id)
            self.assertEqual(unit["page_order"], expected_order, package_id)
            self.assertEqual(dependency["dependency_state"], "REMOTE_BOUND", package_id)
            self.assertEqual(binding["checkpoint_comment_id"], CHECKPOINT_COMMENT, package_id)
            self.assertEqual(binding["remote_branch"], A0_BRANCH, package_id)
            self.assertEqual(binding["remote_head"], A0_HEAD, package_id)
            self.assertEqual(binding["remote_tree"], A0_TREE, package_id)
            self.assertEqual(binding["git_blob_sha1"], expected_blob, package_id)

            spec = f'{A0_HEAD}:{binding["source_path"]}'
            raw = git_bytes(spec)
            self.assertEqual(git("rev-parse", spec).strip(), expected_blob, package_id)
            self.assertEqual(len(raw), binding["byte_count"], package_id)
            self.assertEqual(hashlib.sha256(raw).hexdigest(), binding["sha256"], package_id)

            package = json.loads(raw)
            self.assertEqual(package["unit_id"], package_id)
            self.assertEqual(package["package_id"], package_id)
            self.assertEqual(package["owner"], "A0")
            self.assertEqual(package["lane"], expected_lane)
            self.assertEqual(package["target_branch"], A0_BRANCH)
            self.assertEqual(package["state"], "MAT_PACKAGE_READY_QA_INTEGRATE_GATED")
            self.assertFalse(package["penpot_execution_authorized"])
            self.assertEqual(package["page_contract"]["page_name"], unit["exact_package_page_name"])
            self.assertEqual(package["page_contract"]["candidate_roots"], 1)
            self.assertEqual({variant["id"] for variant in package["page_contract"]["variants"]}, {"desktop", "mobile"})
            self.assertEqual(package["old_penpot_lineage"], "FORBIDDEN")
            self.assertEqual(package["visual_acceptance"], "PENDING_V0")
            self.assertFalse(package["promotion_authorized"])
            self.assertEqual(compact_record_sha256(package), package["package_record_sha256"])

    def test_shared_executor_runtime_setup_test_and_source_adapter_blobs_are_exact(self):
        for unit in self.map_units:
            package_id = unit["package_id"]
            package_binding = unit["publication_dependency"]["remote_binding"]
            package = json.loads(git_bytes(f'{A0_HEAD}:{package_binding["source_path"]}'))

            adapter = package["source_adapter"]
            adapter_spec = f'{A0_HEAD}:{adapter["path"]}'
            self.assertTrue(adapter["byte_identical_required"], package_id)
            self.assertEqual(git("rev-parse", adapter_spec).strip(), adapter["git_blob_sha1"], package_id)

            for artifact_name, artifact in package["artifacts"].items():
                spec = f'{A0_HEAD}:{artifact["path"]}'
                raw = git_bytes(spec)
                self.assertEqual(git("rev-parse", spec).strip(), artifact["git_blob_sha1"], f"{package_id}:{artifact_name}")
                self.assertEqual(len(raw), artifact["bytes"], f"{package_id}:{artifact_name}")
                self.assertEqual(hashlib.sha256(raw).hexdigest(), artifact["sha256"], f"{package_id}:{artifact_name}")

            terminal = package["terminal_contract"]
            self.assertTrue(terminal["page_nonempty"], package_id)
            self.assertTrue(terminal["root_nonempty"], package_id)
            self.assertTrue(terminal["export_nonempty"], package_id)
            self.assertTrue(terminal["native_readback"], package_id)
            self.assertEqual(terminal["second_run_created"], 0, package_id)
            self.assertTrue(terminal["page_scoped_v0_trigger"], package_id)

    def test_atlas_templates_and_semantic_slots_are_package_local_and_complete(self):
        for unit in self.map_units:
            package_id = unit["package_id"]
            template = self.templates[unit["template_id"]]
            slots = unit["semantic_slot_bindings"]
            rules = unit["protected_surface_rules"]
            self.assertTrue(set(template["required_slots"]).issubset(slots), package_id)
            self.assertFalse(rules["managed_nodes_outside_candidate_root_allowed"], package_id)
            self.assertTrue(rules["atlas_internal_geometry_mutation_forbidden"], package_id)
            self.assertEqual(rules["internal_package_geometry_owner"], "PACKAGE_REPAIR_ONLY", package_id)

            if package_id.startswith("A0-PAGE-WAVE2-"):
                self.assertEqual(unit["template_id"], "ARCHETYPE_DESKTOP_MOBILE_V1", package_id)
                self.assertEqual(
                    slots,
                    {
                        "header": "page_header",
                        "desktop": "desktop_1440",
                        "mobile": "mobile_390",
                        "evidence": "source_a_and_v0_evidence",
                    },
                    package_id,
                )
            elif package_id == "A0-PAGE-AUX-DATE_LISTING_SHELL-R1":
                self.assertEqual(unit["template_id"], "COMPOSED_ROUTE_STATES_V1")
                self.assertEqual(slots["states"], ["top", "scrolled", "full", "loading", "empty", "error"])
            elif package_id == "A0-PAGE-AUX-OWNER_REVIEW_INDEX-R1":
                self.assertEqual(unit["template_id"], "OWNER_INDEX_V1")
                self.assertEqual(unit["hard_limit_census"]["product_component_masters"], 0)


if __name__ == "__main__":
    unittest.main()
