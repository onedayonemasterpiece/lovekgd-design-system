#!/usr/bin/env python3
from __future__ import annotations

import copy
import importlib.util
import json
from pathlib import Path
import unittest


REPO = Path(__file__).resolve().parents[3]
SCRIPT = REPO / "scripts/asp-production-conveyor-v3/u0/compile_eventcard_text_r10_input.py"
MANIFEST = REPO / "catalog/asp-production-conveyor-v3/u0/U-EVENTCARD-TEXT-R10-LAYOUT-INVALIDATION.package.v1.json"

spec = importlib.util.spec_from_file_location("u0_eventcard_text_r10", SCRIPT)
assert spec is not None and spec.loader is not None
compiler = importlib.util.module_from_spec(spec)
spec.loader.exec_module(compiler)


class EventCardTextR10InputTest(unittest.TestCase):
    def setUp(self) -> None:
        self.manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

    def reject(self, value: dict, fragment: str) -> None:
        with self.assertRaises(compiler.ContractError) as caught:
            compiler.validate_manifest(value)
        self.assertIn(fragment, str(caught.exception))

    def test_01_valid_contract_and_r9_bytes(self) -> None:
        compiler.validate_manifest(self.manifest)
        compiler.verify_repository_inputs(REPO, self.manifest)

    def test_02_compilation_is_deterministic(self) -> None:
        first = compiler.render_output(
            compiler.compile_materializer_input(self.manifest)
        )
        second = compiler.render_output(
            compiler.compile_materializer_input(copy.deepcopy(self.manifest))
        )
        self.assertEqual(first, second)
        output = json.loads(first)
        self.assertEqual(
            output["schema_version"],
            "kenigevents.u0-eventcard-text-r10-mat-input.v1",
        )
        self.assertEqual(output["run_control"]["expected_revision"], 74)
        self.assertFalse(output["run_control"]["accepted_root_mutation_before_canary"])

    def test_03_r10_must_start_from_rev74_partial_outcome(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["current_native_state"]["penpot_revision"] = 73
        self.reject(broken, "native revision mismatch")

        broken = copy.deepcopy(self.manifest)
        broken["d0_r9_execution"]["penpot_revision_after_partial_outcome"] = 73
        self.reject(broken, "R10 must start at rev74")

    def test_04_exact_r9_counterexample_census_is_required(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["r9_partial_outcome"]["own_frame_offenders"] = 23
        self.reject(broken, "own-frame offender count")

        broken = copy.deepcopy(self.manifest)
        broken["r9_partial_outcome"]["card_root_offenders"] = 3
        self.reject(broken, "root offender count")

        broken = copy.deepcopy(self.manifest)
        broken["current_native_state"]["managed_text_count"] = 37
        self.reject(broken, "managed-text census mismatch")

    def test_05_official_penpot_api_bytes_and_both_waits_are_pinned(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["official_penpot_api"]["plugin_types"]["git_blob_sha1"] = "0" * 40
        self.reject(broken, "plugin-types blob mismatch")

        broken = copy.deepcopy(self.manifest)
        broken["official_penpot_api"]["wait_layout_tests"]["git_blob_sha1"] = "0" * 40
        self.reject(broken, "wait-layout test blob mismatch")

        broken = copy.deepcopy(self.manifest)
        broken["official_penpot_api"]["plugin_types"]["required_declarations"].pop()
        self.reject(broken, "waitForLayoutUpdate declarations mismatch")

    def test_06_canary_isolated_page_and_accepted_page_digest_are_required(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["canary_protocol"]["accepted_eventcard_page_mutation_during_canary"] = True
        self.reject(broken, "accepted page mutation allowed during canary")

        broken = copy.deepcopy(self.manifest)
        broken["canary_protocol"]["accepted_eventcard_page_pre_post_digest_required"] = False
        self.reject(broken, "accepted page digest gate missing")

        broken = copy.deepcopy(self.manifest)
        broken["canary_protocol"]["canary_count"] = 1
        self.reject(broken, "canary count")

    def test_07_shape_and_context_waits_are_required_for_every_candidate(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["canary_protocol"]["single_final_state_candidates"][0]["await"].pop()
        self.reject(broken, "shape/context wait set")

        broken = copy.deepcopy(self.manifest)
        broken["canary_protocol"]["runtime_capability_probe"].pop()
        self.reject(broken, "runtime capability probe mismatch")

    def test_08_round_trip_diagnostics_cannot_authorize_production(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["canary_protocol"]["reversible_diagnostic_candidates"][0][
            "production_allowed"
        ] = True
        self.reject(broken, "round-trip production allowed")

        broken = copy.deepcopy(self.manifest)
        broken["canary_protocol"]["diagnostic_wait_only"][
            "selectable_as_production_repair"
        ] = True
        self.reject(broken, "wait-only diagnostic incorrectly selectable")

    def test_09_timer_textbounds_and_lineheight_shortcuts_are_forbidden(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["production_protocol"]["arbitrary_sleep_or_timer_as_settlement"] = True
        self.reject(broken, "timer settlement allowed")

        broken = copy.deepcopy(self.manifest)
        broken["production_protocol"]["direct_text_bounds_write"] = True
        self.reject(broken, "direct textBounds write allowed")

        broken = copy.deepcopy(self.manifest)
        broken["production_protocol"]["line_height_rewrite"] = True
        self.reject(broken, "line-height rewrite allowed")

    def test_10_final_state_and_identity_preservation_cannot_be_relaxed(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["canary_protocol"]["per_candidate_final_state_gate"][
            "characters_unchanged"
        ] = False
        self.reject(broken, "canary final-state gate disabled")

        broken = copy.deepcopy(self.manifest)
        broken["must_preserve"]["all_thirty_eight_text_ids"] = False
        self.reject(broken, "preservation invariant disabled")

        broken = copy.deepcopy(self.manifest)
        broken["acceptance"]["root_or_component_id_changes"] = 1
        self.reject(broken, "acceptance.root_or_component_id_changes")

    def test_11_native_acceptance_requires_38_of_38_and_zero_offenders(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["acceptance"]["own_frame_contained_with_tolerance_2"] = 37
        self.reject(broken, "acceptance.own_frame_contained_with_tolerance_2")

        broken = copy.deepcopy(self.manifest)
        broken["acceptance"]["card_root_offenders"] = 1
        self.reject(broken, "acceptance.card_root_offenders")

        broken = copy.deepcopy(self.manifest)
        broken["acceptance"]["nonempty_full_root_exports"] = 3
        self.reject(broken, "acceptance.nonempty_full_root_exports")

    def test_12_scope_separation_and_u0_authority_are_fail_closed(self) -> None:
        broken = copy.deepcopy(self.manifest)
        broken["separate_open_lanes"]["media"]["must_not_be_bundled_into_r10"] = False
        self.reject(broken, "media bundled into R10")

        broken = copy.deepcopy(self.manifest)
        broken["lifecycle"]["ready_to_publish"] = True
        self.reject(broken, "U0 may not self-authorize publication")

        broken = copy.deepcopy(self.manifest)
        broken["materialization_entry_point"]["penpot_adapter_included"] = True
        self.reject(broken, "U0 Penpot adapter is forbidden")


if __name__ == "__main__":
    unittest.main()
