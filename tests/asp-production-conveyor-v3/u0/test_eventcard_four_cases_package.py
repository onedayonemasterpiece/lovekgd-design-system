#!/usr/bin/env python3
from __future__ import annotations

import copy
import importlib.util
import json
from pathlib import Path
import unittest


REPO = Path(__file__).resolve().parents[3]
SCRIPT = REPO / "scripts/asp-production-conveyor-v3/u0/compile_eventcard_four_cases.py"
MANIFEST = REPO / "catalog/asp-production-conveyor-v3/u0/U-EVENTCARD-FOUR-CASES.package.v1.json"

spec = importlib.util.spec_from_file_location("u0_eventcard_compiler", SCRIPT)
assert spec is not None and spec.loader is not None
compiler = importlib.util.module_from_spec(spec)
spec.loader.exec_module(compiler)


class EventCardFourCasesContractTest(unittest.TestCase):
    def setUp(self) -> None:
        self.manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

    def assertRejected(self, value: dict, fragment: str) -> None:
        with self.assertRaises(compiler.ContractError) as caught:
            compiler.validate_manifest(value)
        self.assertIn(fragment, str(caught.exception))

    def test_01_valid_contract(self) -> None:
        compiler.validate_manifest(self.manifest)

    def test_02_repository_inputs_are_exact(self) -> None:
        compiler.verify_repository_inputs(REPO)

    def test_03_compiler_is_deterministic_and_emits_four_cases(self) -> None:
        first = compiler.render_output(compiler.compile_materializer_input(self.manifest))
        second = compiler.render_output(compiler.compile_materializer_input(copy.deepcopy(self.manifest)))
        self.assertEqual(first, second)
        compiled = json.loads(first)
        self.assertEqual(compiled["schema_version"], "kenigevents.u0-eventcard-mat-input.v1")
        self.assertEqual(len(compiled["cases"]), 4)
        self.assertEqual(
            {case["case_id"] for case in compiled["cases"]},
            set(compiler.EXPECTED_CASES),
        )
        self.assertEqual(
            sum(len(case["core_action_bindings"]) for case in compiled["cases"]),
            12,
        )
        self.assertEqual(
            sum(case["calendar_binding"] is not None for case in compiled["cases"]),
            2,
        )

    def test_04_missing_event_type_target_is_rejected(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["component_contract"]["required_linked_leaf_semantic_ids"].remove(
            "event.meta.event-type"
        )
        self.assertRejected(broken, "linked leaf coverage mismatch")

    def test_05_opaque_media_overlay_is_rejected(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["media_stack_contract"]["opaque_non_source_overlay_above_media"] = True
        self.assertRejected(broken, "opaque media overlay allowed")

    def test_06_wrong_physical_action_asset_is_rejected(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["asset_binding_contract"]["physical_assets"][
            "icon.action.not_interested"
        ]["sha256"] = "0" * 64
        self.assertRejected(broken, "physical action assets changed")

    def test_07_calendar_in_packed_2182_is_rejected(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["asset_binding_contract"]["conditional_calendar_cases"].append(
            "eventcard.desktop-packed-calendar-absent.2182"
        )
        self.assertRejected(broken, "calendar-present matrix changed")

    def test_08_stale_page_profile_is_rejected(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["current_contract"]["page_profile"]["sha256"] = (
            "2359082956b9bb3bc0003103045a7a1c169dd0d13c7cee187b2b6c671a60cee3"
        )
        self.assertRejected(broken, "stale page-profile hash")

    def test_09_second_root_or_wrong_partial_resume_is_rejected(self) -> None:
        second_root = copy.deepcopy(self.manifest)
        second_root["target_and_resume_contract"]["second_top_level_root_allowed"] = True
        self.assertRejected(second_root, "second root allowed")

        wrong_partial = copy.deepcopy(self.manifest)
        wrong_partial["target_and_resume_contract"]["partial_root"]["id"] = (
            "00000000-0000-0000-0000-000000000000"
        )
        self.assertRejected(wrong_partial, "partial-root resume tuple mismatch")


if __name__ == "__main__":
    unittest.main()
