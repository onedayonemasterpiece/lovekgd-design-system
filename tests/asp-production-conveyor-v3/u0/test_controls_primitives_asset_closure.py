#!/usr/bin/env python3
from __future__ import annotations

import copy
import importlib.util
import json
from pathlib import Path
import unittest


REPO = Path(__file__).resolve().parents[3]
SCRIPT = REPO / "scripts/asp-production-conveyor-v3/u0/compile_controls_primitives_asset_closure.py"
MANIFEST = REPO / "catalog/asp-production-conveyor-v3/u0/U-CONTROLS-PRIMITIVES.asset-closure.v2.json"

spec = importlib.util.spec_from_file_location("u0_controls_asset_closure", SCRIPT)
assert spec is not None and spec.loader is not None
compiler = importlib.util.module_from_spec(spec)
spec.loader.exec_module(compiler)


class ControlsPrimitivesAssetClosureTest(unittest.TestCase):
    def setUp(self) -> None:
        self.manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

    def reject(self, value: dict, fragment: str) -> None:
        with self.assertRaises(compiler.ContractError) as caught:
            compiler.validate_manifest(value)
        self.assertIn(fragment, str(caught.exception))

    def test_01_valid_contract_and_base_bytes(self) -> None:
        compiler.validate_manifest(self.manifest)
        compiler.verify_repository_inputs(REPO, self.manifest)

    def test_02_compilation_is_deterministic_and_totals_50(self) -> None:
        first = compiler.render(compiler.compile_input(self.manifest))
        second = compiler.render(compiler.compile_input(copy.deepcopy(self.manifest)))
        self.assertEqual(first, second)
        output = json.loads(first)
        self.assertEqual(output["resulting_candidate"]["families"], 7)
        self.assertEqual(output["resulting_candidate"]["specimens"], 50)
        self.assertEqual(
            sum(len(items) for items in output["new_specimens"].values()),
            12,
        )

    def test_03_f0_asset_package_and_extension_are_immutable(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["f0_asset_closure"]["commit"] = "0" * 40
        self.reject(broken, "F0 commit")

        broken = copy.deepcopy(self.manifest)
        broken["f0_asset_closure"]["registry_extension"]["git_blob_sha1"] = "0" * 40
        self.reject(broken, "F0 extension blob")

    def test_04_copy_and_check_physical_bytes_cannot_drift(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["f0_asset_closure"]["assets"]["icon.action.copy"]["sha256"] = "0" * 64
        self.reject(broken, "physical copy/check asset tuple")

        broken = copy.deepcopy(self.manifest)
        broken["f0_asset_closure"]["assets"]["icon.status.check"]["stroke_width"] = 1.8
        self.reject(broken, "physical copy/check asset tuple")

    def test_05_fallbacks_are_forbidden(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["f0_asset_closure"]["fallback"] = True
        self.reject(broken, "asset fallback")

        broken = copy.deepcopy(self.manifest)
        broken["new_families"]["control.button.icon-only"]["fallback"] = True
        self.reject(broken, "icon fallback")

    def test_06_copy_action_states_and_accessibility_are_required(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["new_families"]["control.copy-action"]["states"].remove("error")
        self.reject(broken, "copy states")

        broken = copy.deepcopy(self.manifest)
        broken["new_families"]["control.copy-action"]["a11y"].remove(
            "polite-atomic-status"
        )
        self.reject(broken, "copy accessibility")

    def test_07_icon_only_aria_label_and_target_size_are_required(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["new_families"]["control.button.icon-only"]["aria_label_required"] = False
        self.reject(broken, "icon aria label")

        broken = copy.deepcopy(self.manifest)
        broken["new_families"]["control.button.icon-only"]["minimum_box_px"] = 40
        self.reject(broken, "icon target size")

    def test_08_exact_twelve_specimens_are_required(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["new_specimens"]["control.copy-action"].pop()
        self.reject(broken, "copy specimen count")

        broken = copy.deepcopy(self.manifest)
        broken["new_specimens"]["control.button.icon-only"][0]["asset"] = (
            "icon.action.share"
        )
        self.reject(broken, "asset")

    def test_09_success_state_requires_check_asset(self) -> None:
        broken = copy.deepcopy(self.manifest)
        item = next(
            item
            for item in broken["new_specimens"]["control.copy-action"]
            if item["state"] == "success"
        )
        item["visible_asset"] = "icon.action.copy"
        self.reject(broken, "asset")

    def test_10_resulting_candidate_census_is_fail_closed(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["resulting_candidate"]["specimens"] = 49
        self.reject(broken, "resulting candidate census")

        broken = copy.deepcopy(self.manifest)
        broken["resulting_candidate"]["unresolved_asset_identities"] = 1
        self.reject(broken, "resulting candidate census")

    def test_11_candidate_cannot_touch_eventcard_or_reuse_old_uuid(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["target"]["accepted_eventcard_page_mutation"] = True
        self.reject(broken, "EventCard mutation allowed")

        broken = copy.deepcopy(self.manifest)
        broken["target"]["old_penpot_uuids"] = 1
        self.reject(broken, "unsafe implementation")

    def test_12_u0_cannot_publish_or_embed_penpot_adapter(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["lifecycle"]["ready_to_publish"] = True
        self.reject(broken, "U0 self-publication")

        broken = copy.deepcopy(self.manifest)
        broken["materialization_entry_point"]["penpot_adapter_included"] = True
        self.reject(broken, "U0 Penpot adapter")


if __name__ == "__main__":
    unittest.main()
