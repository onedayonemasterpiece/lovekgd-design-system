#!/usr/bin/env python3
from __future__ import annotations

import copy
import importlib.util
import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[3]
SCRIPT = ROOT / "scripts/asp-production-conveyor-v3/u0/compile_free_rows_shell.py"
ROWS = ROOT / "catalog/asp-production-conveyor-v3/u0/U-FREE-ROWS-2-PLUS-3.package.v1.json"
SHELL = ROOT / "catalog/asp-production-conveyor-v3/u0/U-FREE-SHELL.package.v1.json"

spec = importlib.util.spec_from_file_location("u0_free_rows_shell", SCRIPT)
assert spec is not None and spec.loader is not None
compiler = importlib.util.module_from_spec(spec)
spec.loader.exec_module(compiler)


class FreeRowsShellContractTest(unittest.TestCase):
    def setUp(self) -> None:
        self.rows = json.loads(ROWS.read_text(encoding="utf-8"))
        self.shell = json.loads(SHELL.read_text(encoding="utf-8"))

    def reject_rows(self, value: dict, fragment: str) -> None:
        with self.assertRaises(compiler.ContractError) as caught:
            compiler.validate_rows(value)
        self.assertIn(fragment, str(caught.exception))

    def reject_shell(self, value: dict, fragment: str) -> None:
        with self.assertRaises(compiler.ContractError) as caught:
            compiler.validate_shell(value)
        self.assertIn(fragment, str(caught.exception))

    def test_01_valid_rows_shell_and_cross_contract(self) -> None:
        compiler.validate_rows(self.rows)
        compiler.validate_shell(self.shell)
        compiler.validate_cross(self.rows, self.shell)

    def test_02_compilation_is_deterministic(self) -> None:
        rows_a = compiler.render(compiler.compile_rows(self.rows))
        rows_b = compiler.render(compiler.compile_rows(copy.deepcopy(self.rows)))
        shell_a = compiler.render(compiler.compile_shell(self.rows, self.shell))
        shell_b = compiler.render(
            compiler.compile_shell(copy.deepcopy(self.rows), copy.deepcopy(self.shell))
        )
        self.assertEqual(rows_a, rows_b)
        self.assertEqual(shell_a, shell_b)
        rows_payload = json.loads(rows_a)
        shell_payload = json.loads(shell_a)
        self.assertEqual(len(rows_payload["instance_contract"]), 5)
        self.assertEqual(len(shell_payload["state_authority"]["scenarios"]), 6)

    def test_03_exact_two_plus_three_order_is_required(self) -> None:
        broken = copy.deepcopy(self.rows)
        broken["row_matrix"][0]["fixture_order"].reverse()
        self.reject_rows(broken, "free.events.row: order")

        broken = copy.deepcopy(self.rows)
        broken["row_matrix"][1]["count"] = 2
        self.reject_rows(broken, "free.exhibitions.row: count")

    def test_04_instance_order_and_positions_are_required(self) -> None:
        broken = copy.deepcopy(self.rows)
        broken["instance_contract"][0], broken["instance_contract"][1] = (
            broken["instance_contract"][1],
            broken["instance_contract"][0],
        )
        self.reject_rows(broken, "instance order")

        broken = copy.deepcopy(self.rows)
        broken["instance_contract"][4]["position"] = 1
        self.reject_rows(broken, "position contract")

    def test_05_no_duplicate_eventcard_master_or_invented_page_id(self) -> None:
        broken = copy.deepcopy(self.rows)
        broken["expected_candidate_materialization"]["new_eventcard_component_masters"] = 1
        self.reject_rows(broken, "duplicate master creation")

        broken = copy.deepcopy(self.rows)
        broken["expected_candidate_materialization"]["target_page_id"] = "invented"
        self.reject_rows(broken, "invented page ID")

    def test_06_eventcard_runtime_and_visual_gate_cannot_be_removed(self) -> None:
        broken = copy.deepcopy(self.rows)
        broken["eventcard_dependency"]["runtime_state_at_package_time"] = "PASS"
        self.reject_rows(broken, "runtime status is stale")

        broken = copy.deepcopy(self.rows)
        broken["eventcard_dependency"]["row_publication_requires_eventcard_v0_pass"] = False
        self.reject_rows(broken, "visual gate missing")

    def test_07_current_astro_source_lock_is_fail_closed(self) -> None:
        broken = copy.deepcopy(self.shell)
        broken["current_astro_authority"]["source_files"][1]["git_blob_sha1"] = "0" * 40
        self.reject_shell(broken, "source file lock")

    def test_08_mobile_home_mismatch_must_not_be_silently_remapped(self) -> None:
        broken = copy.deepcopy(self.shell)
        broken["route_content"]["mobile_nav_current_match_count"] = 1
        self.reject_shell(broken, "current nav state")

        broken = copy.deepcopy(self.shell)
        broken["anatomy"][-1]["current_item"] = "afisha"
        self.reject_shell(broken, "invented selected navigation item")

    def test_09_medallion_identity_and_no_fallback_are_required(self) -> None:
        broken = copy.deepcopy(self.shell)
        broken["asset_bindings"]["free_medallion"]["sha256"] = "0" * 64
        self.reject_shell(broken, "medallion identity")

        broken = copy.deepcopy(self.shell)
        broken["asset_bindings"]["mobile_navigation"]["fallback"] = True
        self.reject_shell(broken, "nav fallback")

    def test_10_all_six_scenarios_are_required(self) -> None:
        broken = copy.deepcopy(self.shell)
        broken["state_authority"]["scenarios"].pop()
        self.reject_shell(broken, "scenario count")

        broken = copy.deepcopy(self.shell)
        broken["state_authority"]["scenarios"][0]["viewport"] = [1440, 1024]
        self.reject_shell(broken, "viewport")

    def test_11_sticky_geometry_and_reduced_motion_are_required(self) -> None:
        broken = copy.deepcopy(self.shell)
        sticky = next(
            item
            for item in broken["anatomy"]
            if item["id"] == "shell.free-medallion.sticky"
        )
        sticky["desktop"]["top_px"] = 56
        self.reject_shell(broken, "sticky desktop")

        broken = copy.deepcopy(self.shell)
        sticky = next(
            item
            for item in broken["anatomy"]
            if item["id"] == "shell.free-medallion.sticky"
        )
        sticky["reduced_motion"] = "unchanged"
        self.reject_shell(broken, "reduced motion")

    def test_12_donor_old_uuid_and_u0_self_approval_are_forbidden(self) -> None:
        broken = copy.deepcopy(self.shell)
        broken["donor_reuse"]["forbidden"].remove("old Penpot UUIDs")
        self.reject_shell(broken, "old UUID prohibition")

        broken = copy.deepcopy(self.shell)
        broken["lifecycle"]["ready_to_publish"] = True
        self.reject_shell(broken, "U0 may not self-approve publication")

        broken = copy.deepcopy(self.shell)
        broken["materialization_entry_point"]["penpot_adapter_included"] = True
        self.reject_shell(broken, "Penpot adapter")


if __name__ == "__main__":
    unittest.main()
