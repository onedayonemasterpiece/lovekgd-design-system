#!/usr/bin/env python3
"""Validate and compile the U0 EventCard R10 layout-invalidation input.

This compiler is Penpot-free. It binds the exact rev74 R9 partial outcome,
official Penpot waitForLayoutUpdate API evidence, canary-first selection rules,
production preservation invariants and native acceptance gates. D0/MAT builds
the executable; D0/PUBLISH remains the sole Penpot writer; V0 owns visual PASS.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import sys
from typing import Any


DEFAULT_MANIFEST = (
    "catalog/asp-production-conveyor-v3/u0/"
    "U-EVENTCARD-TEXT-R10-LAYOUT-INVALIDATION.package.v1.json"
)
R9_PATH = (
    "catalog/asp-production-conveyor-v3/u0/"
    "U-EVENTCARD-TEXT-R9-LOWEST-OWNER-INPUT.package.v1.json"
)
R9_COMMIT = "d93382e210adc73e3b29940f22e7b63c8e7b4a5d"
R9_BLOB = "ef690e4b4557c985bc84bad485e7d6e646396343"
R9_BYTES = 11176
R9_D0_COMMIT = "722be36fb8d90bd8cb6eab2761675605c8d65053"
R9_D0_TREE = "6138e9f08827afc60c28bed242801a62a6b3970a"
PAYLOAD_SHA = "9ada6460e93ab362012b5e8164ed340054fd352983d1706873402b4e1e356d33"
COLLECTION_ROOT = "313fb1ed-0d5c-8095-8008-912c45090653"
COLLECTION_BOARD = "313fb1ed-0d5c-8095-8008-9108df52b2ce"
FULL_ROOTS = {
    "313fb1ed-0d5c-8095-8008-912c45090653",
    "313fb1ed-0d5c-8095-8008-914c76615924",
    "313fb1ed-0d5c-8095-8008-916b340de148",
    "313fb1ed-0d5c-8095-8008-916bd0ab6c98",
}
REQUIREMENTS_SHA = "54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72"
PENPOT_COMMIT = "5b3a1d93603cb14ce0f584cb462050895a6c5c3a"
PENPOT_TREE = "4d732d2a46f29fc7ee4ac73ddf7c45dc03f27d5e"
PENPOT_TYPES_BLOB = "83a0c9ec660fe05e863d0cb06abadd7311b9ca9b"
PENPOT_TYPES_BYTES = 153836
PENPOT_TEST_BLOB = "c2b67a4d5b9ea69f2ad91804cf7dc901817bc824"
PENPOT_TEST_BYTES = 27138

EXPECTED_MULTIPLIERS = {"1.08", "1.15", "1.2", "1.25", "1.6"}
EXPECTED_CANARY_ROLES = {"occurrence", "event_type", "share_root_fail"}
EXPECTED_SINGLE_CANDIDATES = {
    "C1_CHARACTERS_SAME_VALUE",
    "C2_FONT_SIZE_SAME_VALUE",
    "C3_GROW_TYPE_SAME_VALUE",
    "C4_RESIZE_EXACT_CURRENT_SIZE",
}
EXPECTED_DIAGNOSTIC_CANDIDATES = {
    "D1_CHARACTERS_ROUND_TRIP_CANARY_ONLY",
    "D2_GROW_TYPE_ROUND_TRIP_CANARY_ONLY",
}
EXPECTED_SNAPSHOT_FIELDS = {
    "id",
    "parent chain",
    "characters",
    "fontId",
    "fontFamily",
    "fontStyle",
    "fontWeight",
    "fontSize",
    "lineHeight",
    "letterSpacing",
    "growType",
    "x",
    "y",
    "width",
    "height",
    "textBounds",
    "plugin data",
}
EXPECTED_WAIT_DECLARATIONS = {
    "Penpot.waitForLayoutUpdate(timeout?: number): Promise<void>",
    "Shape.waitForLayoutUpdate(timeout?: number): Promise<void>",
}
EXPECTED_SEPARATE_LANES = {"media", "native_component_paths", "controls_candidate"}
EXPECTED_PRESERVATIONS = {
    "all_four_full_root_ids",
    "all_eighteen_component_ids",
    "all_thirty_eight_text_ids",
    "all_factual_strings",
    "font_binding_and_source_provenance",
    "normalized_r9_line_height_ratios",
    "text_frame_geometry",
    "card_and_action_geometry",
    "event_2182_calendar_absence_and_hidden_counts",
    "media_shapes_fills_fit_and_focal_semantics",
    "native_component_paths",
    "one_collection_root_and_18_18_census",
}


class ContractError(AssertionError):
    """Raised whenever R10 input is stale, broadened or unsafe."""


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ContractError(message)


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(
        value,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")


def sha256(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def git_blob_sha1(value: bytes) -> str:
    return hashlib.sha1(f"blob {len(value)}\0".encode("utf-8") + value).hexdigest()


def load(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ContractError(f"cannot load {path}: {exc}") from exc
    require(isinstance(value, dict), f"{path}: root must be object")
    return value


def validate_manifest(manifest: dict[str, Any]) -> None:
    require(
        manifest.get("schema_version")
        == "kenigevents.asp-u0-eventcard-text-r10-layout-input.v1",
        "schema mismatch",
    )
    require(
        manifest.get("package_id") == "U-EVENTCARD-TEXT-R10-LAYOUT-INVALIDATION",
        "package ID mismatch",
    )
    require(manifest.get("owner") == "U0", "owner mismatch")
    require(manifest.get("priority") == "P0", "priority mismatch")
    require(
        manifest.get("status") == "READY_FOR_D0_CANARY_AND_INTEGRATE",
        "unsafe lifecycle status",
    )

    lifecycle = manifest["lifecycle"]
    require(lifecycle.get("ready_for_d0_canary") is True, "canary readiness missing")
    require(
        lifecycle.get("ready_for_d0_integrate") is True,
        "integration readiness missing",
    )
    require(
        lifecycle.get("ready_for_consumer_mutation") is False,
        "consumer mutation allowed before canary",
    )
    require(
        lifecycle.get("ready_to_publish") is False,
        "U0 may not self-authorize publication",
    )
    require(lifecycle.get("visual_pass") is False, "U0 may not grant visual PASS")
    require(
        lifecycle.get("penpot_mutations_by_u0") == 0,
        "U0 Penpot mutation is forbidden",
    )
    require(
        lifecycle.get("astro_mutations_by_u0") == 0,
        "R10 may not mutate Astro",
    )
    require(
        lifecycle.get("sole_penpot_writer") == "/root/publish_r2",
        "sole writer mismatch",
    )
    require(
        lifecycle.get("production_write_requires_canary_pass") is True,
        "canary gate disabled",
    )

    r9 = manifest["u0_r9_lineage"]
    require(r9.get("commit") == R9_COMMIT, "U0 R9 commit mismatch")
    require(r9.get("path") == R9_PATH, "U0 R9 path mismatch")
    require(r9.get("git_blob_sha1") == R9_BLOB, "U0 R9 blob mismatch")
    require(r9.get("bytes") == R9_BYTES, "U0 R9 byte count mismatch")
    require(r9.get("request_comment") == 5481550515, "U0 R9 request mismatch")

    d0 = manifest["d0_r9_execution"]
    require(d0.get("commit") == R9_D0_COMMIT, "D0 R9 commit mismatch")
    require(d0.get("tree") == R9_D0_TREE, "D0 R9 tree mismatch")
    require(d0.get("penpot_revision_after_partial_outcome") == 74, "R10 must start at rev74")
    require(d0.get("integration_pass_revoked_comment") == 5481593090, "R9 revocation receipt")
    require(d0.get("native_counterexample_comment") == 5481613882, "native counterexample receipt")
    require(d0.get("version_saved") is False, "failed R9 version incorrectly accepted")
    require(d0.get("full_root_exports_created") is False, "failed R9 exports incorrectly accepted")
    require(d0.get("retry_allowed") is False, "blind R9 retry allowed")
    require(d0["manifest"].get("payload_sha256") == PAYLOAD_SHA, "R9 payload mismatch")
    require(
        d0["manifest"].get("executable_set_sha256")
        == "7b03bee81d855e02dd53d9a971b8cb7751c306124559874f1d8668d39fc663ac",
        "R9 executable set mismatch",
    )
    phase = d0["phase_p91"]
    require(phase.get("git_blob_sha1") == "ebb63137c67ff3179435c10b9b68cd17db7462e9", "P91 blob mismatch")
    require(
        phase.get("sha256")
        == "6d8ec06dd6c10142a77adeea12aa54413c2a3f39bb0d9b494a70bc204c1d9923",
        "P91 SHA-256 mismatch",
    )
    require(phase.get("bytes") == 5008, "P91 byte count mismatch")
    require(phase.get("terminal_error") == "P91_TEXT_BOUNDS_NOT_CONTAINED", "P91 terminal error")

    require(
        manifest["requirements_contract"].get("sha256") == REQUIREMENTS_SHA,
        "requirements tuple mismatch",
    )

    api = manifest["official_penpot_api"]
    require(api.get("repository") == "penpot/penpot", "Penpot repository mismatch")
    require(api.get("commit") == PENPOT_COMMIT, "Penpot commit mismatch")
    require(api.get("tree") == PENPOT_TREE, "Penpot tree mismatch")
    types = api["plugin_types"]
    require(types.get("git_blob_sha1") == PENPOT_TYPES_BLOB, "plugin-types blob mismatch")
    require(types.get("bytes") == PENPOT_TYPES_BYTES, "plugin-types byte count mismatch")
    require(
        set(types.get("required_declarations", [])) == EXPECTED_WAIT_DECLARATIONS,
        "waitForLayoutUpdate declarations mismatch",
    )
    tests = api["wait_layout_tests"]
    require(tests.get("git_blob_sha1") == PENPOT_TEST_BLOB, "wait-layout test blob mismatch")
    require(tests.get("bytes") == PENPOT_TEST_BYTES, "wait-layout test byte count mismatch")
    proven = set(tests.get("proven_behaviors", []))
    require(
        {
            "context wait resolves only after pending reflow is applied",
            "shape-level wait observes its own pending layout work",
            "text characters mutation followed by wait updates measured geometry",
            "text fontSize mutation followed by wait updates measured geometry",
        }.issubset(proven),
        "official wait-layout evidence incomplete",
    )
    require(api.get("runtime_capability_required") is True, "runtime capability gate missing")
    require(
        api.get("unsupported_runtime_result")
        == "BLOCKED_NATIVE_API_NO_ACCEPTED_ROOT_MUTATION",
        "unsupported runtime policy mismatch",
    )

    state = manifest["current_native_state"]
    require(state.get("penpot_revision") == 74, "native revision mismatch")
    require(state.get("collection_root_id") == COLLECTION_BOARD, "collection root mismatch")
    require(state.get("page_direct_roots") == 1, "page root census mismatch")
    require(state.get("board_children") == 18, "board child census mismatch")
    require(state.get("board_descendants") == 248, "descendant census mismatch")
    require(state.get("local_components") == 18, "component census mismatch")
    require(state.get("accepted_cards") == 4, "accepted-card census mismatch")
    require(state.get("managed_text_count") == 38, "managed-text census mismatch")
    require(state.get("normalized_line_height_count") == 38, "normalized line-height census mismatch")
    require(state.get("validation") == [], "native validation is not empty")
    require(set(state.get("full_root_ids", [])) == FULL_ROOTS, "full root identity mismatch")

    outcome = manifest["r9_partial_outcome"]
    require(outcome.get("line_height_values_are_now_correct") is True, "R9 ratios not preserved")
    require(
        set(outcome.get("allowed_normalized_multipliers", [])) == EXPECTED_MULTIPLIERS,
        "normalized multiplier set mismatch",
    )
    require(outcome.get("contained_in_own_frame_with_tolerance_2") == 14, "own-frame baseline")
    require(outcome.get("contained_in_card_root_with_tolerance_2") == 34, "root baseline")
    require(outcome.get("own_frame_offenders") == 24, "own-frame offender count")
    require(outcome.get("card_root_offenders") == 4, "root offender count")
    require(outcome.get("layout_cache_invalidated") is False, "stale layout truth lost")
    require(
        outcome.get("repeating_line_height_write_is_a_valid_repair") is False,
        "blind line-height retry allowed",
    )

    selection = manifest["target_selection"]
    card_filter = selection["accepted_card_filter"]
    require(card_filter.get("plugin_data_role") == "accepted-card-master", "card role filter")
    require(card_filter.get("plugin_data_payload_sha256") == PAYLOAD_SHA, "card payload filter")
    require(card_filter.get("plugin_data_build_state") == "COMPLETE", "card build-state filter")
    require(card_filter.get("expected_count") == 4, "card target count")
    text_filter = selection["managed_text_filter"]
    require(text_filter.get("descendant_type") == "text", "text type filter")
    require(text_filter.get("characters") == "non-empty", "text character filter")
    require(text_filter.get("expected_count") == 38, "text target count")
    require(
        text_filter.get("line_height_must_already_be_normalized") is True,
        "normalized precondition missing",
    )
    require(
        set(selection.get("preflight_snapshot_fields", [])) == EXPECTED_SNAPSHOT_FIELDS,
        "preflight snapshot field set mismatch",
    )
    require(
        selection.get("snapshot_digest_required_before_any_canary_or_production_write")
        is True,
        "preflight snapshot digest missing",
    )

    canary = manifest["canary_protocol"]
    require(canary.get("phase") == "ISOLATED_BEFORE_ACCEPTED_ROOT_MUTATION", "canary phase")
    require(
        canary.get("target_page") == "D0_INTEGRATE_RESOLVES_DEDICATED_CANDIDATE_PAGE",
        "canary page gate",
    )
    require(
        canary.get("accepted_eventcard_page_pre_post_digest_required") is True,
        "accepted page digest gate missing",
    )
    require(
        canary.get("accepted_eventcard_page_mutation_during_canary") is False,
        "accepted page mutation allowed during canary",
    )
    require(set(canary.get("representative_roles", [])) == EXPECTED_CANARY_ROLES, "canary role set")
    require(canary.get("canary_count") == 3, "canary count")
    require(canary.get("construct_from_read_only_snapshot") is True, "canary source snapshot")
    require(
        set(canary.get("runtime_capability_probe", []))
        == {
            "typeof penpot.waitForLayoutUpdate === 'function'",
            "typeof canaryText.waitForLayoutUpdate === 'function'",
        },
        "runtime capability probe mismatch",
    )
    diagnostic_wait = canary["diagnostic_wait_only"]
    require(
        diagnostic_wait.get("selectable_as_production_repair") is False,
        "wait-only diagnostic incorrectly selectable",
    )
    candidates = canary.get("single_final_state_candidates", [])
    by_id = {item.get("id"): item for item in candidates}
    require(set(by_id) == EXPECTED_SINGLE_CANDIDATES, "single-state candidate set")
    require(len(by_id) == len(candidates), "duplicate canary candidate ID")
    for candidate_id, item in by_id.items():
        waits = set(item.get("await", []))
        require(
            waits
            == {
                "canaryText.waitForLayoutUpdate(timeout)",
                "penpot.waitForLayoutUpdate(timeout)",
            },
            f"{candidate_id}: shape/context wait set",
        )
        require(item.get("operation"), f"{candidate_id}: operation missing")
    diagnostics = canary.get("reversible_diagnostic_candidates", [])
    diagnostic_ids = {item.get("id") for item in diagnostics}
    require(diagnostic_ids == EXPECTED_DIAGNOSTIC_CANDIDATES, "diagnostic candidate set")
    require(all(item.get("production_allowed") is False for item in diagnostics), "round-trip production allowed")
    final_gate = canary["per_candidate_final_state_gate"]
    require(all(value is True for value in final_gate.values()), "canary final-state gate disabled")
    require(
        "all three canaries" in canary.get("selection_rule", "")
        and "idempotent canary replay" in canary.get("selection_rule", ""),
        "canary selection rule incomplete",
    )
    require(
        canary.get("no_single_final_state_candidate_passes")
        == "BLOCKED_NATIVE_API_NO_ACCEPTED_ROOT_MUTATION",
        "no-candidate failure policy mismatch",
    )

    production = manifest["production_protocol"]
    require(production.get("expected_revision") == 74, "production expected revision")
    require(production.get("new_active_run_marker_required") is True, "new run marker gate")
    require(
        production.get("selected_operation_must_equal_canary_operation") is True,
        "unproven production operation allowed",
    )
    require(
        production.get("prevalidate_all_38_before_first_write") is True,
        "full prevalidation missing",
    )
    require(
        set(production.get("active_lease_checks", []))
        == {
            "before every property or resize write",
            "before and after every shape-level wait",
            "before and after every context-level wait",
            "before native readback, validation, version and export",
        },
        "ACTIVE guard coverage mismatch",
    )
    sequence = production.get("per_text_sequence", [])
    require("await Text.waitForLayoutUpdate(timeout)" in sequence, "shape wait missing")
    require("await penpot.waitForLayoutUpdate(timeout)" in sequence, "context wait missing")
    require("read fresh Text.textBounds" in sequence, "fresh textBounds readback missing")
    require(production.get("arbitrary_sleep_or_timer_as_settlement") is False, "timer settlement allowed")
    require(production.get("direct_text_bounds_write") is False, "direct textBounds write allowed")
    require(production.get("line_height_rewrite") is False, "line-height rewrite allowed")
    require(production.get("writes_outside_38_target_texts") is False, "out-of-scope writes allowed")
    require(production.get("one_undo_block") is True, "undo block missing")
    require(production.get("save_version_only_after_all_38_pass") is True, "early version allowed")
    require(production.get("four_root_exports_only_after_all_38_pass") is True, "early export allowed")
    require(production.get("second_run_mutations") == 0, "idempotent replay gate")

    acceptance = manifest["acceptance"]
    expected_acceptance = {
        "managed_texts": 38,
        "normalized_line_height_values_preserved": 38,
        "own_frame_contained_with_tolerance_2": 38,
        "card_root_contained_with_tolerance_2": 38,
        "own_frame_offenders": 0,
        "card_root_offenders": 0,
        "fresh_text_bounds_after_shape_and_context_wait": 38,
        "characters_changes": 0,
        "font_binding_changes": 0,
        "font_size_changes": 0,
        "line_height_changes": 0,
        "letter_spacing_changes": 0,
        "grow_type_final_changes": 0,
        "x_y_width_height_changes": 0,
        "root_or_component_id_changes": 0,
        "new_or_deleted_roots": 0,
        "new_or_deleted_components": 0,
        "page_direct_roots": 1,
        "board_children": 18,
        "board_descendants": 248,
        "local_components": 18,
        "saved_versions": 1,
        "nonempty_full_root_exports": 4,
    }
    for key, expected in expected_acceptance.items():
        require(acceptance.get(key) == expected, f"acceptance.{key}")
    require(acceptance.get("validation") == [], "acceptance validation")
    require(
        acceptance.get("v0_independent_visual_review_required") is True,
        "V0 review gate missing",
    )

    preserve = manifest["must_preserve"]
    require(set(preserve) == EXPECTED_PRESERVATIONS, "preservation field set mismatch")
    require(all(value is True for value in preserve.values()), "preservation invariant disabled")

    separate = manifest["separate_open_lanes"]
    require(set(separate) == EXPECTED_SEPARATE_LANES, "separate lane set mismatch")
    require(separate["media"].get("must_not_be_bundled_into_r10") is True, "media bundled into R10")
    require(
        separate["native_component_paths"].get("must_not_be_bundled_into_r10")
        is True,
        "component paths bundled into R10",
    )
    require(
        separate["controls_candidate"].get("independent_candidate") is True,
        "controls candidate incorrectly coupled",
    )

    forbidden = set(manifest.get("forbidden", []))
    required_forbidden = {
        "blind rerun of P91 or any lineHeight rewrite",
        "arbitrary setTimeout or sleep as the sole settlement mechanism",
        "direct mutation of Text.textBounds",
        "accepted-root mutation before canary and committed-byte PASS",
        "production use of a reversible canary-only round trip",
        "bundling media or native component-path repair",
        "saveVersion or export before 38/38 containment",
    }
    require(required_forbidden.issubset(forbidden), "forbidden operation set incomplete")

    materialization = manifest["materialization_entry_point"]
    require(materialization.get("consumer") == "D0/MAT", "materializer consumer mismatch")
    require(
        materialization.get("penpot_adapter_included") is False,
        "U0 Penpot adapter is forbidden",
    )


def verify_repository_inputs(repo: Path, manifest: dict[str, Any]) -> None:
    validate_manifest(manifest)
    r9_path = repo / R9_PATH
    require(r9_path.is_file(), "U0 R9 package missing")
    data = r9_path.read_bytes()
    require(len(data) == R9_BYTES, "U0 R9 package byte drift")
    require(git_blob_sha1(data) == R9_BLOB, "U0 R9 package blob drift")


def compile_materializer_input(manifest: dict[str, Any]) -> dict[str, Any]:
    validate_manifest(manifest)
    payload = {
        "schema_version": "kenigevents.u0-eventcard-text-r10-mat-input.v1",
        "package_id": manifest["package_id"],
        "owner": "U0",
        "consumer": "D0/MAT",
        "u0_r9_lineage": manifest["u0_r9_lineage"],
        "d0_r9_execution": manifest["d0_r9_execution"],
        "requirements_contract": manifest["requirements_contract"],
        "official_penpot_api": manifest["official_penpot_api"],
        "current_native_state": manifest["current_native_state"],
        "r9_partial_outcome": manifest["r9_partial_outcome"],
        "target_selection": manifest["target_selection"],
        "canary_protocol": manifest["canary_protocol"],
        "production_protocol": manifest["production_protocol"],
        "acceptance": manifest["acceptance"],
        "must_preserve": manifest["must_preserve"],
        "separate_open_lanes": manifest["separate_open_lanes"],
        "forbidden": manifest["forbidden"],
        "negative_regressions_required": manifest["negative_regressions_required"],
        "run_control": {
            "sole_writer": "/root/publish_r2",
            "expected_revision": 74,
            "collection_root_id": COLLECTION_BOARD,
            "accepted_root_mutation_before_canary": False,
            "new_root_on_accepted_page_allowed": False,
            "new_component_allowed": False,
            "visual_pass_owner": "V0",
        },
    }
    return {
        "integrity": {
            "canonicalization": "UTF-8 sorted compact JSON",
            "payload_sha256": sha256(canonical_bytes(payload)),
        },
        **payload,
    }


def render_output(value: dict[str, Any]) -> bytes:
    return (
        json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n"
    ).encode("utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", default=None)
    parser.add_argument("--manifest", default=DEFAULT_MANIFEST)
    parser.add_argument("--check-repository-inputs", action="store_true")
    parser.add_argument("--emit", default="-")
    parser.add_argument("--check-output", default=None)
    args = parser.parse_args()

    repo = Path(args.repo).resolve() if args.repo else Path(__file__).resolve().parents[3]
    manifest = load(repo / args.manifest)
    validate_manifest(manifest)
    if args.check_repository_inputs:
        verify_repository_inputs(repo, manifest)
    output = render_output(compile_materializer_input(manifest))

    if args.check_output:
        expected = repo / args.check_output
        require(expected.is_file(), f"compiled output missing: {args.check_output}")
        require(expected.read_bytes() == output, f"compiled output stale: {args.check_output}")

    if args.emit == "-":
        sys.stdout.buffer.write(output)
    else:
        target = repo / args.emit
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(output)

    print("U0_EVENTCARD_TEXT_R10_INPUT_PASS", file=sys.stderr)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ContractError as exc:
        print(f"U0_EVENTCARD_TEXT_R10_INPUT_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
