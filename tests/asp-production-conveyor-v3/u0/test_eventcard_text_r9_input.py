#!/usr/bin/env python3
from __future__ import annotations

import copy
import importlib.util
import json
from pathlib import Path
import unittest


REPO = Path(__file__).resolve().parents[3]
SCRIPT = REPO / "scripts/asp-production-conveyor-v3/u0/compile_eventcard_text_r9_input.py"
MANIFEST = REPO / "catalog/asp-production-conveyor-v3/u0/U-EVENTCARD-TEXT-R9-LOWEST-OWNER-INPUT.package.v1.json"

spec = importlib.util.spec_from_file_location("u0_eventcard_text_r9", SCRIPT)
assert spec is not None and spec.loader is not None
compiler = importlib.util.module_from_spec(spec)
spec.loader.exec_module(compiler)


class EventCardTextR9InputTest(unittest.TestCase):
    def setUp(self) -> None:
        self.manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

    def reject(self, value: dict, fragment: str) -> None:
        with self.assertRaises(compiler.ContractError) as caught:
            compiler.validate_manifest(value)
        self.assertIn(fragment, str(caught.exception))

    def test_01_valid_contract_and_repository_inputs(self) -> None:
        compiler.validate_manifest(self.manifest)
        compiler.verify_repository_inputs(REPO, self.manifest)

    def test_02_compiler_is_deterministic(self) -> None:
        first = compiler.render_output(compiler.compile_materializer_input(self.manifest))
        second = compiler.render_output(
            compiler.compile_materializer_input(copy.deepcopy(self.manifest))
        )
        self.assertEqual(first, second)
        compiled = json.loads(first)
        self.assertEqual(
            compiled["schema_version"],
            "kenigevents.u0-eventcard-text-r9-mat-input.v1",
        )
        self.assertEqual(len(compiled["text_role_contract"]["roles"]), 8)
        self.assertFalse(compiled["run_control"]["new_root_allowed"])

    def test_03_raw_pixel_like_value_is_required_as_observed_failure(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["text_role_contract"]["roles"]["title"][
            "observed_invalid_line_height"
        ] = "1.08"
        self.reject(broken, "title: observed value")

    def test_04_target_ratio_must_equal_observed_divided_by_font_size(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["text_role_contract"]["roles"]["occurrence"][
            "target_multiplier"
        ] = "1.2"
        self.reject(broken, "occurrence: target multiplier")

    def test_05_all_eight_text_roles_are_required(self) -> None:
        broken = copy.deepcopy(self.manifest)
        del broken["text_role_contract"]["roles"]["calendar_share"]
        self.reject(broken, "text role set mismatch")

    def test_06_terminal_root_and_component_ids_are_immutable(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["persistent_identity"]["full_roots"][0]["root_id"] = (
            "00000000-0000-0000-0000-000000000000"
        )
        self.reject(broken, "root ID drift")

        broken = copy.deepcopy(self.manifest)
        broken["persistent_identity"]["full_roots"][3]["component_id"] = (
            "00000000-0000-0000-0000-000000000000"
        )
        self.reject(broken, "component ID drift")

    def test_07_one_root_and_eighteen_component_census_are_required(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["persistent_identity"]["page_direct_roots"] = 2
        self.reject(broken, "page root census")

        broken = copy.deepcopy(self.manifest)
        broken["persistent_identity"]["local_components"] = 19
        self.reject(broken, "component census")

    def test_08_text_bounds_gate_cannot_use_ordinary_shape_bounds(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["required_mat_r9_behavior"]["settlement"][
            "readback_property"
        ] = "Shape.bounds"
        self.reject(broken, "textBounds gate")

        broken = copy.deepcopy(self.manifest)
        broken["required_mat_r9_behavior"]["settlement"][
            "ordinary_shape_bounds_as_substitute"
        ] = True
        self.reject(broken, "ordinary bounds substitution allowed")

    def test_09_text_frame_or_font_mutation_is_rejected(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["text_role_contract"]["text_frame_geometry_mutable"] = True
        self.reject(broken, "text frame mutation allowed")

        broken = copy.deepcopy(self.manifest)
        broken["text_role_contract"]["font_binding_mutable"] = True
        self.reject(broken, "font binding mutation allowed")

    def test_10_media_and_path_repairs_remain_separate(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["separate_open_lanes"]["media"]["must_not_be_bundled_into_r9"] = False
        self.reject(broken, "media bundled into R9")

        broken = copy.deepcopy(self.manifest)
        broken["separate_open_lanes"]["native_component_paths"][
            "must_not_be_bundled_into_r9"
        ] = False
        self.reject(broken, "path repair bundled into R9")

    def test_11_preservation_and_publish_gates_cannot_be_disabled(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["must_preserve"]["raster_shapes_and_fills"] = False
        self.reject(broken, "preservation invariant disabled")

        broken = copy.deepcopy(self.manifest)
        broken["acceptance_before_publish"]["committed_byte_qa_pass"] = False
        self.reject(broken, "publication gate disabled")

    def test_12_u0_cannot_self_publish_or_embed_penpot_adapter(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["lifecycle"]["ready_to_publish"] = True
        self.reject(broken, "U0 may not self-authorize publication")

        broken = copy.deepcopy(self.manifest)
        broken["materialization_entry_point"]["penpot_adapter_included"] = True
        self.reject(broken, "U0 Penpot adapter forbidden")


if __name__ == "__main__":
    unittest.main()
