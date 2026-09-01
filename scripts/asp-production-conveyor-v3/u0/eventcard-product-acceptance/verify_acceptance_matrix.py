#!/usr/bin/env python3
from __future__ import annotations
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[4]
CAT = ROOT / "catalog/asp-production-conveyor-v3/u0/eventcard-product-acceptance"
MATRIX = json.loads((CAT / "U0-EVENTCARD-THREE-REPAIRS.acceptance-matrix.v1.json").read_text(encoding="utf-8"))
ADDENDA = json.loads((CAT / "ASP_BUILD_REQUEST_V2.corrected-addenda.v1.json").read_text(encoding="utf-8"))

def run(*args: str) -> str:
    return subprocess.check_output(args, cwd=ROOT, text=True).strip()

def show_json(commit: str, path: str) -> dict:
    return json.loads(run("git", "show", f"{commit}:{path}"))

assert MATRIX["state"] == "U0_EVENTCARD_THREE_REPAIRS_REMOTE_READY"
assert MATRIX["issue"]["durable_marker_state"] == "THREE_EVENTCARD_REPAIRS_REMOTE_READY"
assert MATRIX["issue"]["new_repair_lanes_created_by_u0"] == 0
assert len(MATRIX["cases"]) == 4
assert len({row["root_id"] for row in MATRIX["cases"]}) == 4
assert len({row["component_id"] for row in MATRIX["cases"]}) == 4
assert sum(row["linked_leaf_instances"] for row in MATRIX["cases"]) == 26
assert MATRIX["u0_boundaries"] == {
    "atlas_mutations": 0,
    "broad_shared_ui_wave": 0,
    "kaggle_calls": 0,
    "new_card_families": 0,
    "penpot_mutations": 0,
    "penpot_reads": 0,
}
assert MATRIX["v0_evidence_required"]["whole_eventcard_pass_additional_requirement"]["whole_eventcard_visual_pass_now"] is False

expected = {
    "text_repair": {
        "head": "d4ef6db8a4e1583308556b384d95f45e61223872",
        "tree": "c2e1b18d170cdccc580262c77fe7524c10f50df9",
        "count": 13,
        "package_path": "catalog/asp-production-conveyor-v3/mat/eventcard-text-r11c/MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR.package.v1.json",
        "package_id": "MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR",
        "executor_path": "catalog/asp-production-conveyor-v3/mat/eventcard-text-r11c/native-repair-executor.v1.js",
        "executor_blob": "fb62a81e4f3d215148cf2ea7f3e7d522a8559054",
    },
    "media_repair": {
        "head": "c0174621635e3c4336f4b88674c3b47fa7d7acb2",
        "tree": "81d9753b305c5d1dea67c4ca27f1efb99e09ebc5",
        "count": 8,
        "package_path": "catalog/asp-production-conveyor-v3/mat/eventcard-media-r1/MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1.package.v1.json",
        "package_id": "MAT-EVENTCARD-MEDIA-COVERAGE-REPAIR-R1",
        "executor_path": "scripts/asp-production-conveyor-v3/mat/eventcard-media-r1/eventcard_media_repair_v1.js",
        "executor_blob": "1f66b5e5a9cba0eefbcb37088b9e40d1072c5ec0",
    },
    "component_path_repair": {
        "head": "757652ed656f32569d5ade7dd75f5cd58cf9df96",
        "tree": "2ffd893a8eba54156818b55fa5f63f88afbcc4c0",
        "count": 8,
        "package_path": "catalog/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-REPAIR-R1.package.v1.json",
        "package_id": "MAT-EVENTCARD-NATIVE-COMPONENT-PATHS-REPAIR-R1",
        "executor_path": "scripts/asp-production-conveyor-v3/mat/eventcard-component-paths-r1/eventcard_component_paths_native_executor_r1.js",
        "executor_blob": "71b91f619db5fb289bbd7c9d3764d0b95ecf571b",
    },
}
base = MATRIX["base_queue"]["head"]
for key, spec in expected.items():
    row = MATRIX["packages"][key]
    assert row["head"] == spec["head"] and row["tree"] == spec["tree"]
    assert run("git", "rev-parse", f"{spec['head']}^{{tree}}") == spec["tree"]
    files = run("git", "diff", "--name-only", base, spec["head"]).splitlines()
    assert len(files) == spec["count"], (key, len(files), files)
    pkg = show_json(spec["head"], spec["package_path"])
    assert pkg["package_id"] == spec["package_id"]
    assert pkg["penpot_execution_authorized"] is False
    executor_blob = run("git", "rev-parse", f"{spec['head']}:{spec['executor_path']}")
    assert executor_blob == spec["executor_blob"], (key, executor_blob)

text = show_json(expected["text_repair"]["head"], expected["text_repair"]["package_path"])
assert len(text["targets"]) == 4
assert len(text["protected_untargeted_offender_ids"]) == 16
assert sorted(text["target_ids"]) == sorted(row["text"]["r11c_occurrence_target"]["id"] for row in MATRIX["cases"])
assert text["post_readback_census"]["contained"] == 22 and text["post_readback_census"]["offenders"] == 16
text_exec = run("git", "show", f"{expected['text_repair']['head']}:{expected['text_repair']['executor_path']}")
text_readback = run("git", "show", f"{expected['text_repair']['head']}:catalog/asp-production-conveyor-v3/mat/eventcard-text-r11c/distinct-later-readback.v1.js")
assert "shape.growType = \"auto-width\"" in text_exec
assert "shape.characters = shape.characters" in text_exec
assert "R11C_POST_SETTLEMENT_CONTAINMENT_UNKNOWN" in text_exec
assert "R11C_PREEXISTING_MARKER_UNKNOWN_OUTCOME" in text_exec
assert "COMPATIBLE_OCCURRENCE_PEERS_MEASUREMENT_PASS" in text_readback

media = show_json(expected["media_repair"]["head"], expected["media_repair"]["package_path"])
assert len(media["terminal_identity"]["roots"]) == 4
assert len(media["probe"]["variants"]) == 4
assert media["repair"]["idempotent_replay_mutations"] == 0
assert media["readback_contract"]["opaque_non_source_overlay_count"] == 0
assert media["factual_media"]["event.real.8006"]["sha256"] == "dd8834258d4a1ebde029aca1960bdd224bdf636d3fd8aee8fc7824012475de8b"
assert media["factual_media"]["event.real.2182"]["sha256"] == "99d4b75ef3291c90e1457b6fdc3fe89e519b327f9d6c8ff56cd95f763e71ab1e"

paths = show_json(expected["component_path_repair"]["head"], expected["component_path_repair"]["package_path"])
assert len(paths["components"]) == 18
assert paths["path_policy"]["known_initial_paths"] == {
    "empty": 15,
    "legacy_nonempty": 3,
    "legacy_path": "KenigEvents / G19 / EventCard 8006 / Accepted",
}
assert paths["resumability"]["terminal_second_run_mutations"] == 0
assert paths["stable_lineage_acceptance"]["linked_instance_ids_preserved"] == "all 26 existing links (7+6+7+6)"
assert paths["interpretation"]["component_name_changes"] == 0
assert paths["interpretation"]["main_name_changes"] == 0

assert ADDENDA["state"] == "MANDATORY_ADDENDA_TO_EXISTING_FROZEN_REQUESTS"
assert len(ADDENDA["addenda"]) == 3
assert ADDENDA["penpot_execution_authorized"] is False
print("U0_EVENTCARD_PRODUCT_ACCEPTANCE_STATIC_AUDIT_PASS")
