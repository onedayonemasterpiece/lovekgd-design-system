from __future__ import annotations

import hashlib
import json
import subprocess
import unittest
from decimal import Decimal
from pathlib import Path

import jsonschema


ROOT = Path(__file__).resolve().parents[1]
BASE_HEAD = "663be702d481972cb2e8863af500f1c35dda1d8c"
BASE_TREE = "cf9a1e6a5e0a84aea5636334dbd3be4961039b75"
OVERLAY = ROOT / "catalog/asp-production-conveyor-v3/atlas-v2/extensions/r2-1"
MANIFEST = OVERLAY / "atlas-extension-map.r2-1.json"
BINDINGS = OVERLAY / "page-unit-bindings.r2-1.json"
SCHEMA = OVERLAY / "atlas-extension.schema.r2-1.json"
QUEUE = OVERLAY / "morning-parallel-execution.v1.json"
OWNER_CARD = OVERLAY / "eventcard-text-owner-action-card.v1.json"
BASE_MAP = "catalog/asp-production-conveyor-v3/atlas-v2/penpot-page-map.v2.json"


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def git_bytes(spec: str) -> bytes:
    return subprocess.check_output(["git", "show", spec], cwd=ROOT)


def git_text(*args: str) -> str:
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


class AtlasExtensionR21(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = load(MANIFEST)
        cls.bindings = load(BINDINGS)
        cls.schema = load(SCHEMA)
        cls.queue = load(QUEUE)
        cls.owner_card = load(OWNER_CARD)
        cls.pages = cls.manifest["extension_pages"]
        cls.base_map = json.loads(git_bytes(f"{BASE_HEAD}:{BASE_MAP}"))

    def test_base_identity_and_every_required_atlas_file_is_byte_identical(self):
        base = self.manifest["base"]
        self.assertEqual((base["head"], base["tree"]), (BASE_HEAD, BASE_TREE))
        self.assertEqual(git_text("rev-parse", f"{BASE_HEAD}^{{tree}}"), BASE_TREE)
        self.assertEqual(git_text("rev-parse", "origin/o0/penpot-atlas-layout-v2-20260901"), BASE_HEAD)
        self.assertEqual((base["mapping_object_count"], base["physical_page_count"]), (42, 42))
        self.assertTrue(base["all_existing_bytes_immutable"])
        self.assertTrue(base["all_existing_page_order_keys_byte_immutable"])
        self.assertEqual(len(self.base_map["page_units"]), 42)
        for item in base["required_files"]:
            raw = git_bytes(f"{BASE_HEAD}:{item['path']}")
            self.assertEqual((len(raw), hashlib.sha256(raw).hexdigest()), (item["byte_count"], item["sha256"]))
            self.assertEqual(git_text("rev-parse", f"{BASE_HEAD}:{item['path']}"), item["git_blob_sha1"])
            self.assertEqual((ROOT / item["path"]).read_bytes(), raw)

    def test_overlay_does_not_modify_base_or_package_owned_paths(self):
        changed = set(filter(None, subprocess.check_output(
            ["git", "diff", "--name-only", BASE_HEAD, "--"], cwd=ROOT, text=True
        ).splitlines()))
        changed.update(filter(None, subprocess.check_output(
            ["git", "ls-files", "--others", "--exclude-standard", "--",
             "catalog/asp-production-conveyor-v3/atlas-v2/extensions/r2-1",
             "tests/asp_production_conveyor_v3_atlas_extension_r2_1_test.py"],
            cwd=ROOT, text=True
        ).splitlines()))
        allowed_prefix = "catalog/asp-production-conveyor-v3/atlas-v2/extensions/r2-1/"
        self.assertTrue(changed)
        self.assertTrue(all(path.startswith(allowed_prefix) or path == "tests/asp_production_conveyor_v3_atlas_extension_r2_1_test.py" for path in changed))

    def test_schema_counts_and_acceptance_verdict(self):
        jsonschema.Draft202012Validator.check_schema(self.schema)
        jsonschema.Draft202012Validator(self.schema).validate(self.manifest)
        counts = self.manifest["counts"]
        self.assertEqual(counts, {
            "accepted_u0_pages": 12,
            "extension_page_count": 12,
            "merged_physical_page_count": 54,
            "rejected_u0_pages": 0,
        })
        self.assertEqual(len(self.pages), 12)
        self.assertEqual(self.manifest["marker"], "ASP_PENPOT_ATLAS_EXTENSION_R2_1")

    def test_exact_source_tuples_and_package_bytes(self):
        expected = {
            "FREE_SHELL_NATIVE_R2": ("60ff5406bd4654d8b1961a6fa9ea3e766cb76dab", "63b7cec779f5598c9ab179cad5100aeed36b5eed"),
            "RECOVERED_CARDS_NATIVE_R2": ("3f8e54e9d39fb8489877e4df5fc2decfab7c88d6", "296a82e5fc3cf39f2c0a33075c9de53082b66644"),
            "SHARED_PATTERNS_NATIVE_R3": ("6c0496874764b3019cdaafcac53ed330664f323e", "78502699abbea223a73929a01940f1b00df4f58f"),
        }
        tuples = self.bindings["source_tuples"]
        for key, (head, tree) in expected.items():
            item = tuples[key]
            self.assertEqual((item["head"], item["tree"], item["provider_identity"]), (head, tree, "PASS"))
            self.assertEqual(git_text("rev-parse", f"origin/{item['branch']}"), head)
            self.assertEqual(git_text("rev-parse", f"{head}^{{tree}}"), tree)
            raw = git_bytes(f"{head}:{item['package_path']}")
            self.assertEqual(git_text("rev-parse", f"{head}:{item['package_path']}"), item["package_git_blob_sha1"])
            self.assertEqual((len(raw), hashlib.sha256(raw).hexdigest()), (item["package_byte_count"], item["package_sha256"]))
        predecessor = tuples["SHARED_PATTERNS_NATIVE_R2_PREDECESSOR"]
        self.assertEqual(predecessor["status"], "SUPERSEDED_EXECUTABLE_TUPLE")
        self.assertFalse(predecessor["bound_to_extension_pages"])
        self.assertEqual(predecessor["superseded_by"], "SHARED_PATTERNS_NATIVE_R3")

    def test_unique_ids_orders_and_source_role_pairs(self):
        self.assertEqual(len({p["atlas_page_id"] for p in self.pages}), 12)
        self.assertEqual(len({p["page_order"] for p in self.pages}), 12)
        self.assertEqual(len({(p["source_package_id"], p["extension_page_role"]) for p in self.pages}), 12)
        base_ids = {p["atlas_page_id"] for p in self.base_map["page_units"]}
        base_orders = {p["page_order"] for p in self.base_map["page_units"]}
        self.assertFalse(base_ids & {p["atlas_page_id"] for p in self.pages})
        self.assertFalse(base_orders & {p["page_order"] for p in self.pages})

    def test_exact_decimal_insertion_is_strict_and_deterministic(self):
        insertion = self.manifest["insertion_contract"]
        self.assertEqual(insertion["previous_anchor"], {"atlas_page_id": "shell-footer-breadcrumbs", "page_order": "0230"})
        self.assertEqual(insertion["next_anchor"], {"atlas_page_id": "date-listing-shell-ready", "page_order": "0240"})
        self.assertEqual(insertion["merged_comparator"], "EXACT_ARBITRARY_PRECISION_DECIMAL_NUMERIC_ASC")
        self.assertEqual(insertion["secondary_uniqueness_check"], "FAIL_CLOSED")
        orders = [Decimal(p["page_order"]) for p in self.pages]
        self.assertEqual(orders, sorted(orders))
        self.assertTrue(all(Decimal("0230") < order < Decimal("0240") for order in orders))
        merged = sorted(self.base_map["page_units"] + self.pages, key=lambda p: Decimal(p["page_order"]))
        previous_index = next(i for i, p in enumerate(merged) if p["atlas_page_id"] == "shell-footer-breadcrumbs")
        next_index = next(i for i, p in enumerate(merged) if p["atlas_page_id"] == "date-listing-shell-ready")
        self.assertEqual([p["atlas_page_id"] for p in merged[previous_index + 1:next_index]], [p["atlas_page_id"] for p in self.pages])

    def test_exact_page_fields_and_v0_scopes(self):
        names = [
            "07 · Free collection · Shell states · Candidate",
            "08.1 · Components · Compact card · Candidate",
            "08.2 · Components · Festival card · Candidate",
            "08.3 · Components · Club card · Candidate",
            "08.4 · Components · Artifact card · Candidate",
            "08.5 · Components · Collection card · Candidate",
            "09.1 · Components · Discovery rails · Candidate",
            "09.2 · Components · Content shelves · Candidate",
            "09.3 · Components · Section headers · Candidate",
            "09.4 · Components · Search and control bars · Candidate",
            "09.5 · Components · Content groupings · Candidate",
            "09.6 · Components · Row and group composition · Candidate",
        ]
        self.assertEqual([p["physical_page_name"] for p in self.pages], names)
        self.assertEqual([p["exact_package_page_name"] for p in self.pages], names)
        self.assertEqual([p["page_order"] for p in self.pages], [f"0230.{i:03d}" for i in range(1, 13)])
        self.assertEqual([p["section"] for p in self.pages], ["content-free-collection"] + ["component-cards"] * 5 + ["shared-patterns"] * 6)
        self.assertEqual([p["template_id"] for p in self.pages], ["COMPOSED_ROUTE_READY_STATES_V2"] + ["COMPONENT_STATE_GRID_V2"] * 11)
        self.assertEqual([p["density_profile"] for p in self.pages], ["COMPOSED_ROUTE_READY_3_ROWS"] + ["COMPONENT_STATE_GRID_STANDARD_3COL"] * 11)
        self.assertTrue(all(p["projection_role"] == "READY" for p in self.pages))
        self.assertEqual(self.pages[0]["semantic_slot_bindings"], {"header": "page_header", "desktop": "desktop_state", "mobile": "mobile_state", "states": "paired_desktop_mobile_evidence_rows", "evidence": "source_a_and_v0_evidence"})
        component_slots = {"header": "page_header", "master_column": "package_owned_masters", "state_grid": "linked_state_instances"}
        self.assertTrue(all(p["semantic_slot_bindings"] == component_slots for p in self.pages[1:]))
        common = {"exact_page_identity_and_header_metadata", "minimum_margins_and_gaps", "documentation_shell_consistency", "clipping_and_overlap", "no_managed_nodes_outside_candidate_root", "no_free_floating_managed_nodes", "source_a_correspondence", "package_bytes_unchanged"}
        self.assertTrue(all(common <= set(p["v0_review_scope"]["checks"]) for p in self.pages))
        self.assertIn("desktop_mobile_pairing", self.pages[0]["v0_review_scope"]["checks"])
        self.assertTrue(all("no_family_cross_contamination" in p["v0_review_scope"]["checks"] for p in self.pages[1:6]))
        self.assertTrue(all("complete_native_local_and_shared_enumeration" in p["v0_review_scope"]["checks"] for p in self.pages[6:]))
        search = next(p for p in self.pages if p["extension_page_role"] == "SEARCH_CONTROL_BARS")
        self.assertEqual(search["density_profile"], "COMPONENT_STATE_GRID_STANDARD_3COL")
        self.assertIn("standard_three_column_no_improvised_wide_row", search["v0_review_scope"]["checks"])

    def test_bindings_are_exactly_one_per_extension_page(self):
        rows = self.bindings["page_bindings"]
        self.assertEqual(len(rows), 12)
        by_id = {row["atlas_page_id"]: row for row in rows}
        self.assertEqual(len(by_id), 12)
        for page in self.pages:
            row = by_id[page["atlas_page_id"]]
            for field in ("page_order", "source_package_id", "extension_page_role", "projection_role", "source_tuple_ref"):
                self.assertEqual(row[field], page[field])

    def test_queue_categories_lanes_and_publishability_fail_closed(self):
        categories = ["V0_REVIEWABLE", "EXACT_QA_INTEGRATE_READY", "PACKAGE_REPAIR_RUNNING", "ATLAS_EXTENSION_ACCEPTED", "PUBLISHABLE_NOW", "OWNER_DECISION_REQUIRED"]
        lanes = ["F0", "U0", "A0", "V0", "D0/PUBLISH"]
        self.assertEqual(self.queue["categories"], categories)
        self.assertEqual(self.queue["lanes"], lanes)
        self.assertEqual(set(self.queue["queues"]), set(categories))
        self.assertGreaterEqual(self.queue["snapshot"]["final_tip_comment_id"], 5505712654)
        required_gates = ["concrete_native_executor", "current_page_activation_and_identity_guard", "bounded_resumable_max_creates_lte_3", "exact_remote_bytes", "qa_pass_same_tuple", "integrate_pass_same_tuple", "owner_and_profile_gate_clear"]
        for item in self.queue["queues"]["PUBLISHABLE_NOW"]:
            self.assertTrue(all(item["gates"].get(gate) is True for gate in required_gates))
        self.assertEqual(self.queue["executable_buffer"]["minimum"], 3)
        self.assertEqual(self.queue["executable_buffer"]["proven_count"], len(self.queue["queues"]["PUBLISHABLE_NOW"]))
        self.assertEqual(self.queue["executable_buffer"]["deficit"], max(0, 3 - len(self.queue["queues"]["PUBLISHABLE_NOW"])))
        self.assertTrue(self.queue["continuous_consumption"]["one_repair_does_not_block_unrelated_jobs"])
        self.assertTrue(self.queue["continuous_consumption"]["d0_does_not_wait_for_all_producers"])
        self.assertEqual(self.queue["continuous_consumption"]["next_transition"], "D0_CONTINUOUS_CONSUMPTION")

    def test_owner_action_card_is_single_and_eventcard_text_only(self):
        cards = list(OVERLAY.glob("*owner-action-card*.json"))
        self.assertEqual(cards, [OWNER_CARD])
        card = self.owner_card
        self.assertEqual(card["marker"], "OWNER_ACTION_CARD_V1 — EVENTCARD_TEXT_PROFILE_AUTHORITY")
        self.assertEqual(card["scope"], "EVENTCARD_TEXT_ONLY")
        self.assertEqual(card["package"]["id"], "MAT-EVENTCARD-TEXT-R11C-EXECUTION-BINDING-R2")
        self.assertFalse(card["active_profile"]["materialization"]["allowed_to_mutate_penpot"])
        self.assertEqual(card["owner_response_options"], ["APPROVE_EVENTCARD_TEXT_ONE_BOUNDED_MUTATION", "KEEP_EVENTCARD_TEXT_BLOCKED"])
        self.assertEqual(card["bounded_action"], {"mutation_invocations": 1, "target_count": 4, "later_readback": "DISTINCT_LATER_READBACK"})
        self.assertEqual(card["unblocked_work"], ["Paths", "Media", "F0", "V0", "Atlas extension"])

    def test_penpot_zero_deterministic_json_and_diff_check(self):
        self.assertEqual(self.manifest["penpot_access"], {"mutations": 0, "reads": 0})
        self.assertEqual(self.queue["penpot_access"], {"mutations": 0, "reads": 0})
        self.assertEqual(self.owner_card["penpot_access"], {"mutations": 0, "reads": 0})
        before = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in OVERLAY.glob("*.json")}
        subprocess.run(["python3", str(OVERLAY / "regenerate-json.py")], cwd=ROOT, check=True)
        after = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in OVERLAY.glob("*.json")}
        self.assertEqual(before, after)
        subprocess.run(["git", "diff", "--check"], cwd=ROOT, check=True)


if __name__ == "__main__":
    unittest.main()
