#!/usr/bin/env python3
from __future__ import annotations

import copy
import importlib.util
import json
from pathlib import Path
import unittest


REPO = Path(__file__).resolve().parents[3]
SCRIPT = REPO / "scripts/asp-production-conveyor-v3/u0/compile_eventcard_v0_next_inputs.py"
MEDIA = REPO / "catalog/asp-production-conveyor-v3/u0/U-EVENTCARD-MEDIA-COVERAGE-INPUT.package.v1.json"
PATHS = REPO / "catalog/asp-production-conveyor-v3/u0/U-EVENTCARD-NATIVE-COMPONENT-PATHS.package.v1.json"

spec = importlib.util.spec_from_file_location("u0_eventcard_v0_next", SCRIPT)
assert spec is not None and spec.loader is not None
compiler = importlib.util.module_from_spec(spec)
spec.loader.exec_module(compiler)


class EventCardV0NextInputsTest(unittest.TestCase):
    def setUp(self) -> None:
        self.media = json.loads(MEDIA.read_text(encoding="utf-8"))
        self.paths = json.loads(PATHS.read_text(encoding="utf-8"))

    def reject_media(self, value: dict, fragment: str) -> None:
        with self.assertRaises(compiler.ContractError) as caught:
            compiler.validate_media(value)
        self.assertIn(fragment, str(caught.exception))

    def reject_paths(self, value: dict, fragment: str) -> None:
        with self.assertRaises(compiler.ContractError) as caught:
            compiler.validate_paths(value)
        self.assertIn(fragment, str(caught.exception))

    def test_01_valid_cross_contract_and_parent_bytes(self) -> None:
        compiler.validate_cross(self.media, self.paths)
        compiler.verify_repository_inputs(REPO, self.media, self.paths)

    def test_02_both_compilers_are_deterministic(self) -> None:
        media_a = compiler.render(compiler.compile_media(self.media))
        media_b = compiler.render(compiler.compile_media(copy.deepcopy(self.media)))
        paths_a = compiler.render(compiler.compile_paths(self.paths))
        paths_b = compiler.render(compiler.compile_paths(copy.deepcopy(self.paths)))
        self.assertEqual(media_a, media_b)
        self.assertEqual(paths_a, paths_b)
        self.assertEqual(len(json.loads(paths_a)["expected_paths"]), 18)

    def test_03_media_probe_cannot_mutate_accepted_roots(self) -> None:
        broken = copy.deepcopy(self.media)
        broken["lifecycle"]["ready_for_consumer_mutation"] = True
        self.reject_media(broken, "unproven media mutation allowed")

        broken = copy.deepcopy(self.media)
        broken["lifecycle"]["probe_must_not_touch_accepted_roots"] = False
        self.reject_media(broken, "probe isolation")

    def test_04_factual_raster_bytes_and_fit_cannot_drift(self) -> None:
        broken = copy.deepcopy(self.media)
        broken["factual_media"]["event.real.8006"]["sha256"] = "0" * 64
        self.reject_media(broken, "event.real.8006: sha256")

        broken = copy.deepcopy(self.media)
        broken["factual_media"]["event.real.2182"]["fit"] = "contain"
        self.reject_media(broken, "event.real.2182: fit")

    def test_05_media_boxes_and_centered_focal_semantics_are_exact(self) -> None:
        broken = copy.deepcopy(self.media)
        broken["factual_media"]["event.real.8006"]["desktop_box"]["width"] = 532
        self.reject_media(broken, "event.real.8006: desktop_box")

        broken = copy.deepcopy(self.media)
        broken["factual_media"]["event.real.2182"]["focal_position"] = "0% 0%"
        self.reject_media(broken, "event.real.2182: focal_position")

    def test_06_all_native_probe_variants_and_exports_are_required(self) -> None:
        broken = copy.deepcopy(self.media)
        del broken["required_native_probe"]["variants"]["C_direct_native_fill"]
        self.reject_media(broken, "media probe variants")

        broken = copy.deepcopy(self.media)
        broken["required_native_probe"]["readback_per_variant"].remove(
            "image-rectangle export"
        )
        self.reject_media(broken, "media export comparison")

    def test_07_media_repair_preserves_ids_and_uses_no_second_root(self) -> None:
        broken = copy.deepcopy(self.media)
        broken["production_repair_after_probe"]["preserve_root_and_component_ids"] = False
        self.reject_media(broken, "media ID preservation")

        broken = copy.deepcopy(self.media)
        broken["production_repair_after_probe"]["new_root_allowed"] = True
        self.reject_media(broken, "media second root")

    def test_08_all_eighteen_native_path_keys_are_required(self) -> None:
        broken = copy.deepcopy(self.paths)
        del broken["expected_paths"]["event.action.share.mobile.8006"]
        self.reject_paths(broken, "expected path key set")

    def test_09_generation_specific_or_wrong_group_path_is_rejected(self) -> None:
        broken = copy.deepcopy(self.paths)
        broken["expected_paths"]["event.media-frame.desktop.8006"] = (
            "KenigEvents / G19 / Leaves"
        )
        self.reject_paths(broken, "desktop leaf path")

        broken = copy.deepcopy(self.paths)
        broken["path_policy"]["generation_or_run_id_in_path"] = True
        self.reject_paths(broken, "generation path allowed")

    def test_10_plugin_metadata_cannot_substitute_for_native_path(self) -> None:
        broken = copy.deepcopy(self.paths)
        broken["path_policy"]["plugin_metadata_as_substitute"] = True
        self.reject_paths(broken, "metadata path substitute")

    def test_11_path_repair_cannot_create_rename_or_rebuild_components(self) -> None:
        broken = copy.deepcopy(self.paths)
        broken["required_path_only_repair"]["change_component_name"] = True
        self.reject_paths(broken, "path rename allowed")

        broken = copy.deepcopy(self.paths)
        broken["required_path_only_repair"]["new_component_allowed"] = True
        self.reject_paths(broken, "new component allowed")

        broken = copy.deepcopy(self.paths)
        broken["required_path_only_repair"]["change_geometry_or_content"] = True
        self.reject_paths(broken, "path content mutation allowed")

    def test_12_path_acceptance_requires_18_of_18_and_zero_id_changes(self) -> None:
        broken = copy.deepcopy(self.paths)
        broken["acceptance"]["native_paths_exact_match"] = 17
        self.reject_paths(broken, "path exact acceptance")

        broken = copy.deepcopy(self.paths)
        broken["acceptance"]["component_id_changes"] = 1
        self.reject_paths(broken, "path ID changes")

        broken = copy.deepcopy(self.paths)
        broken["materialization_entry_point"]["penpot_adapter_included"] = True
        self.reject_paths(broken, "path U0 adapter")


if __name__ == "__main__":
    unittest.main()
