from __future__ import annotations

import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
COVERAGE = ROOT / "catalog/asp-production-conveyor-v3/coverage"
MATRIX = COVERAGE / "design-system-coverage-matrix.v1.json"
QUEUE = COVERAGE / "producer-reactivation-queue.v1.json"
SCHEMA = COVERAGE / "coverage-matrix.schema.json"
ATLAS = ROOT / "catalog/asp-production-conveyor-v3/atlas/penpot-page-map.v1.json"

ALLOWED = {
    "CANONICAL_NATIVE_COMPONENT_LIBRARY_COVERAGE",
    "LINKED_USE_ONLY_ON_COMPOSED_PAGE",
    "REMOTE_PACKAGE_READY",
    "LOCAL_ONLY_PACKAGE",
    "DEPENDENCY_BLOCKED",
    "MISSING_COMPONENT_PACKAGE",
    "MISSING_REVIEW_PAGE",
    "INTENTIONALLY_POST_V1",
}
GAP_CLASSES = {
    "LINKED_USE_ONLY_ON_COMPOSED_PAGE",
    "LOCAL_ONLY_PACKAGE",
    "DEPENDENCY_BLOCKED",
    "MISSING_COMPONENT_PACKAGE",
    "MISSING_REVIEW_PAGE",
}


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def canonical(value) -> bytes:
    return (
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    ).encode("utf-8")


class CoverageMatrixTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.matrix = load(MATRIX)
        cls.queue = load(QUEUE)
        cls.schema = load(SCHEMA)
        cls.atlas = load(ATLAS)
        cls.items = cls.matrix["coverage_items"]

    def test_schema_and_canonical_json(self):
        import jsonschema

        jsonschema.Draft202012Validator.check_schema(self.schema)
        jsonschema.Draft202012Validator(self.schema).validate(self.matrix)
        queue_schema = {
            "$schema": self.schema["$schema"],
            "$defs": self.schema["$defs"],
            **self.schema["$defs"]["producer_queue"],
        }
        jsonschema.Draft202012Validator(queue_schema).validate(self.queue)
        for path in (MATRIX, QUEUE, SCHEMA):
            self.assertEqual(canonical(load(path)), path.read_bytes(), path.name)

    def test_frozen_atlas_and_exact_40_page_units(self):
        frozen = self.matrix["frozen_atlas"]
        self.assertEqual(frozen["head"], "a32b9874e1eec367fd6b98bc3c601d0638408843")
        self.assertEqual(frozen["tree"], "f527c628ed0dfc17eec9208b0ae15b8a29bbedb2")
        self.assertEqual(frozen["page_unit_count"], 40)
        units = self.matrix["atlas_page_units"]
        self.assertEqual(len(units), 40)
        expected = {
            (u["atlas_page_id"], u["package_id"], u["exact_package_page_name"])
            for u in self.atlas["page_units"]
        }
        actual = {
            (u["atlas_page_id"], u["package_id"], u["exact_page_name"])
            for u in units
        }
        self.assertEqual(actual, expected)
        self.assertEqual(len(actual), 40)
        valid_refs = {u["atlas_page_id"] for u in units}
        for item in self.items:
            self.assertTrue(set(item["atlas_page_refs"]).issubset(valid_refs))

    def test_every_normative_scope_item_appears_exactly_once(self):
        normative = [x["scope_id"] for x in self.matrix["normative_scope_items"]]
        covered = [x["scope_id"] for x in self.items]
        self.assertEqual(len(normative), len(set(normative)))
        self.assertEqual(len(covered), len(set(covered)))
        self.assertEqual(covered, normative)

    def test_only_allowed_classifications_and_counts(self):
        self.assertEqual(set(self.matrix["classification_vocabulary"]), ALLOWED)
        self.assertTrue(all(item["classification"] in ALLOWED for item in self.items))
        observed = {name: 0 for name in ALLOWED}
        for item in self.items:
            observed[item["classification"]] += 1
        self.assertEqual(observed, self.matrix["category_counts"])

    def test_canonical_requires_remote_native_library_and_review_page_evidence(self):
        rule = self.matrix["canonical_coverage_rule"]
        self.assertTrue(rule["remote_immutable_package_required"])
        self.assertTrue(rule["native_component_or_library_evidence_required"])
        self.assertTrue(rule["review_page_evidence_required"])
        self.assertFalse(rule["component_name_alone_sufficient"])
        self.assertFalse(rule["linked_use_on_composed_page_counts_as_canonical"])
        canonical_items = [
            item
            for item in self.items
            if item["classification"]
            == "CANONICAL_NATIVE_COMPONENT_LIBRARY_COVERAGE"
        ]
        self.assertTrue(canonical_items)
        for item in canonical_items:
            evidence = item["canonical_evidence"]
            remote = evidence["remote_immutable_package"]
            self.assertRegex(remote["head"], r"^[0-9a-f]{40}$")
            self.assertRegex(remote["git_blob_sha1"], r"^[0-9a-f]{40}$")
            self.assertRegex(remote["sha256"], r"^[0-9a-f]{64}$")
            native = evidence["native_component_library_evidence"]
            self.assertEqual(native["kind"], "NATIVE_LOCAL_LIBRARY")
            self.assertGreater(native["component_count"], 0)
            self.assertGreater(native["linked_instance_count"], 0)
            self.assertTrue(evidence["review_page_evidence"]["exact_page_name"])
        for item in self.items:
            if item["classification"] == "LINKED_USE_ONLY_ON_COMPOSED_PAGE":
                self.assertNotIn("canonical_evidence", item)

    def test_each_real_gap_has_executable_handoff_fields(self):
        required = {
            "lowest_owner",
            "proposed_package_id",
            "non_overlapping_git_paths",
            "immutable_inputs",
            "target_penpot_page_or_dependency",
            "terminal_artifact",
            "replacement_window_resume_prompt",
        }
        for item in self.items:
            if item["classification"] in GAP_CLASSES:
                self.assertIn("gap", item, item["scope_id"])
                gap = item["gap"]
                self.assertTrue(required.issubset(gap), item["scope_id"])
                self.assertIn(gap["lowest_owner"], {"F0", "U0", "A0", "MAT"})
                self.assertEqual(gap["package_id"], gap["proposed_package_id"])
                self.assertTrue(gap["non_overlapping_git_paths"])
                self.assertTrue(gap["immutable_inputs"])
                self.assertGreaterEqual(
                    len(gap["replacement_window_resume_prompt"]), 20
                )

    def test_queue_has_unique_ids_paths_and_separate_mat_repairs(self):
        items = self.queue["items"]
        self.assertEqual([x["order"] for x in items], list(range(1, len(items) + 1)))
        ids = [x["package_id"] for x in items]
        self.assertEqual(len(ids), len(set(ids)))
        owned = []
        for entry in items:
            self.assertFalse(entry["ready_claim"])
            for path in entry["non_overlapping_git_paths"]:
                stem = path.removesuffix("/**")
                for previous in owned:
                    self.assertFalse(
                        stem == previous
                        or stem.startswith(previous.rstrip("/") + "/")
                        or previous.startswith(stem.rstrip("/") + "/"),
                        f"owned path overlap: {stem} vs {previous}",
                    )
                owned.append(stem)
        mat = [x for x in items if x["lane_kind"] == "MAT_ONLY_REPAIR"]
        producers = [x for x in items if x["lane_kind"] == "PRODUCER_REACTIVATION"]
        self.assertEqual({x["lowest_owner"] for x in mat}, {"MAT"})
        self.assertEqual(
            {x["lowest_owner"] for x in producers}, {"F0", "U0", "A0"}
        )
        transfer = self.matrix["u0_transfer_result"]
        self.assertEqual(transfer, self.queue["u0_transfer_result"])
        self.assertEqual(transfer["status"], "EXACT_RAW_BYTES_TRANSFER_BLOCKED")
        self.assertEqual(transfer["issue_comment_id"], 5492761555)
        self.assertEqual(
            transfer["remote_head"],
            "e3c8d3f8f3a7d45f5c3399be8c63e617c40b8b21",
        )
        self.assertEqual(
            transfer["remote_tree"],
            "848baf8b30a8bb6358a0159c0c20458fa7959dfc",
        )
        self.assertEqual(
            transfer["requested_result_tree"],
            "92a44400eb6834fb52af26feaa9c623636997bf9",
        )
        self.assertFalse(transfer["remote_commit_created"])
        self.assertFalse(transfer["push_performed"])
        self.assertFalse(transfer["force"])
        self.assertEqual(transfer["build_requests_published"], 0)
        self.assertEqual(transfer["expected_build_requests"], 6)
        self.assertEqual(transfer["penpot_mutations"], 0)

    def test_required_families_states_and_eventcard_open_markers(self):
        ids = {item["scope_id"] for item in self.items}
        required = {
            "u0.eventcard.four-cases",
            "u0.cards.compact",
            "u0.cards.festival",
            "u0.cards.club",
            "u0.cards.artifact",
            "u0.cards.collection",
            "u0.patterns.desktop-rows",
            "u0.patterns.rails",
            "u0.patterns.shelves",
            "u0.patterns.section-headers",
            "u0.patterns.search-control-bars",
            "u0.controls.fields",
            "u0.controls.dialogs",
            "u0.controls.validation",
            "u0.controls.menus",
            "u0.feedback.state-panels",
            "u0.feedback.toast",
            "u0.feedback.undo",
            "f0.foundation.shared-bindings",
            "a0.free-page.top",
            "a0.free-page.scrolled",
            "a0.free-page.full",
            "a0.free-page.loading",
            "a0.free-page.empty",
            "a0.free-page.error",
            "issue57.eventcard.defect.text",
            "issue57.eventcard.defect.media",
            "issue57.eventcard.defect.component-path",
        }
        self.assertTrue(required.issubset(ids), required - ids)
        defects = self.matrix["eventcard_defects"]
        self.assertEqual(defects["text"], "OPEN")
        self.assertEqual(defects["media"], "OPEN")
        self.assertEqual(defects["component_path"], "OPEN")
        self.assertFalse(defects["whole_eventcard_visual_pass"])
        self.assertFalse(defects["closing_evidence_at_issue_tip"])

    def test_no_ready_claim_for_local_blocked_or_missing_items(self):
        forbidden = {
            "LOCAL_ONLY_PACKAGE",
            "DEPENDENCY_BLOCKED",
            "MISSING_COMPONENT_PACKAGE",
            "MISSING_REVIEW_PAGE",
            "LINKED_USE_ONLY_ON_COMPOSED_PAGE",
        }
        for item in self.items:
            if item["classification"] in forbidden:
                self.assertEqual(item["readiness_claim"], "NONE", item["scope_id"])

    def test_current_repository_immutable_evidence_reproduces(self):
        for name, evidence in self.matrix["evidence_inputs"].items():
            if evidence["repository"] != "onedayonemasterpiece/lovekgd-design-system":
                continue
            if evidence["git_blob_sha1"] == "NOT_APPLICABLE_TREE_INPUT":
                continue
            spec = f'{evidence["head"]}:{evidence["path"]}'
            raw = subprocess.check_output(["git", "show", spec], cwd=ROOT)
            blob = subprocess.check_output(
                ["git", "rev-parse", spec], cwd=ROOT, text=True
            ).strip()
            tree = subprocess.check_output(
                ["git", "show", "-s", "--format=%T", evidence["head"]],
                cwd=ROOT,
                text=True,
            ).strip()
            self.assertEqual(blob, evidence["git_blob_sha1"], name)
            self.assertEqual(tree, evidence["tree"], name)
            self.assertEqual(len(raw), evidence["bytes"], name)
            self.assertEqual(hashlib.sha256(raw).hexdigest(), evidence["sha256"], name)

    def test_no_penpot_uuid_lineage(self):
        uuid = re.compile(
            rb"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b",
            re.I,
        )
        for path in (MATRIX, QUEUE, SCHEMA, Path(__file__)):
            self.assertIsNone(uuid.search(path.read_bytes()), path.name)


if __name__ == "__main__":
    unittest.main()
