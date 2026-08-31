#!/usr/bin/env python3
"""Validate/compile the next U0 EventCard visual-defect inputs.

The two modes are deliberately independent:
- media: an isolated native construction probe, not accepted-root mutation;
- paths: an in-place native LibraryComponent.path-only repair.
No Penpot operation is implemented here.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import sys
from typing import Any


MEDIA_PATH = (
    "catalog/asp-production-conveyor-v3/u0/"
    "U-EVENTCARD-MEDIA-COVERAGE-INPUT.package.v1.json"
)
PATHS_PATH = (
    "catalog/asp-production-conveyor-v3/u0/"
    "U-EVENTCARD-NATIVE-COMPONENT-PATHS.package.v1.json"
)
PARENT_PATH = (
    "catalog/asp-production-conveyor-v3/u0/"
    "U-EVENTCARD-TEXT-R9-LOWEST-OWNER-INPUT.package.v1.json"
)
PARENT_BLOB = "ef690e4b4557c985bc84bad485e7d6e646396343"
PARENT_BYTES = 11176
COLLECTION_ROOT = "313fb1ed-0d5c-8095-8008-9108df52b2ce"
FULL_ROOTS = {
    "313fb1ed-0d5c-8095-8008-912c45090653",
    "313fb1ed-0d5c-8095-8008-914c76615924",
    "313fb1ed-0d5c-8095-8008-916b340de148",
    "313fb1ed-0d5c-8095-8008-916bd0ab6c98",
}
EXPECTED_MEDIA = {
    "event.real.8006": {
        "sha256": "dd8834258d4a1ebde029aca1960bdd224bdf636d3fd8aee8fc7824012475de8b",
        "bytes": 111072,
        "intrinsic_width": 1440,
        "intrinsic_height": 1920,
        "intrinsic_aspect": "0.75",
        "fit": "contain",
        "focal_position": "50% 50%",
        "desktop_box": {"width": 531.797, "height": 709.063, "aspect": "0.75"},
    },
    "event.real.2182": {
        "sha256": "99d4b75ef3291c90e1457b6fdc3fe89e519b327f9d6c8ff56cd95f763e71ab1e",
        "bytes": 229072,
        "intrinsic_width": 1280,
        "intrinsic_height": 853,
        "intrinsic_aspect": "1.500586",
        "fit": "cover",
        "focal_position": "50% 50%",
        "desktop_box": {"width": 531.797, "height": 425.438, "aspect": "1.25"},
    },
}
DESKTOP_LEAVES = {
    "event.media-frame.desktop.8006",
    "event.meta.event-type.desktop.8006",
    "event.meta.admission.desktop.8006",
    "event.action.not-interested.desktop.8006",
    "event.action.calendar.desktop.8006",
    "event.action.share.desktop.8006",
    "event.action.like.desktop.8006",
}
MOBILE_LEAVES = {item.replace("desktop", "mobile") for item in DESKTOP_LEAVES}
DESKTOP_CASES = {
    "eventcard.desktop-wide-calendar.8006",
    "eventcard.desktop-packed-calendar-absent.2182",
}
MOBILE_CASES = {
    "eventcard.mobile-wide-calendar.8006",
    "eventcard.mobile-packed-calendar-absent.2182",
}
EXPECTED_PATH_KEYS = DESKTOP_LEAVES | MOBILE_LEAVES | DESKTOP_CASES | MOBILE_CASES
PATH_DESKTOP_LEAVES = "KenigEvents / EventCard / Leaves / Desktop"
PATH_MOBILE_LEAVES = "KenigEvents / EventCard / Leaves / Mobile"
PATH_DESKTOP_CASES = "KenigEvents / EventCard / Cases / Desktop"
PATH_MOBILE_CASES = "KenigEvents / EventCard / Cases / Mobile"


class ContractError(AssertionError):
    pass


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


def validate_parent(reference: dict[str, Any]) -> None:
    require(reference.get("commit") == "d93382e210adc73e3b29940f22e7b63c8e7b4a5d", "parent commit")
    require(reference.get("path") == PARENT_PATH, "parent path")
    require(reference.get("git_blob_sha1") == PARENT_BLOB, "parent blob")
    require(reference.get("bytes") == PARENT_BYTES, "parent bytes")


def validate_media(manifest: dict[str, Any]) -> None:
    require(
        manifest.get("schema_version")
        == "kenigevents.asp-u0-eventcard-media-coverage-input.v1",
        "media schema",
    )
    require(manifest.get("package_id") == "U-EVENTCARD-MEDIA-COVERAGE-INPUT", "media package")
    require(manifest.get("owner") == "U0", "media owner")
    require(manifest.get("status") == "READY_FOR_D0_NATIVE_PROBE", "media status")
    lifecycle = manifest["lifecycle"]
    require(lifecycle.get("ready_for_d0_native_probe") is True, "media probe readiness")
    require(lifecycle.get("ready_for_consumer_mutation") is False, "unproven media mutation allowed")
    require(lifecycle.get("ready_to_publish") is False, "media self-publication")
    require(lifecycle.get("penpot_mutations_by_u0") == 0, "media U0 mutation")
    require(lifecycle.get("probe_must_not_touch_accepted_roots") is True, "probe isolation")
    validate_parent(manifest["parent_text_package"])

    source = manifest["source_a"]
    require(source.get("commit") == "c7c3e2367db8fd8865a735c8b9f5df1ef2b6efd1", "media Source A")
    geometry = manifest["geometry_authority"]
    require(
        geometry.get("proof_payload_sha256")
        == "5395c56376847d36a6ebc8e5d4988a2b06c4cac9acd27426dd73276620031307",
        "media geometry proof",
    )
    identity = manifest["terminal_identity"]
    require(identity.get("penpot_revision") == 73, "media revision")
    require(identity.get("collection_root_id") == COLLECTION_ROOT, "media collection root")
    require(identity.get("collection_children") == 18, "media child census")
    require(identity.get("local_components") == 18, "media component census")
    require(set(identity.get("full_root_ids", [])) == FULL_ROOTS, "media full root IDs")
    require(identity.get("validation") == [], "media validation")

    defect = manifest["defect"]
    require(defect.get("id") == "V0-1-G19-MEDIA-IMAGE-FILL-017", "media defect")
    require(defect.get("directive_comment") == 5481094733, "media directive")
    require(defect.get("affected_full_roots") == 4, "media affected roots")
    require(
        defect.get("mismatch_class")
        == "IMPORTED_IMAGE_FILL_PAINTS_ONLY_PART_OF_FULL_SIZE_RECTANGLE",
        "media mismatch class",
    )

    factual = manifest["factual_media"]
    require(set(factual) == set(EXPECTED_MEDIA), "media fixture set")
    for fixture, expected in EXPECTED_MEDIA.items():
        item = factual[fixture]
        for key, value in expected.items():
            require(item.get(key) == value, f"{fixture}: {key}")
        require("zero dark leak" in item.get("acceptance", ""), f"{fixture}: acceptance")

    probe = manifest["required_native_probe"]
    require(
        probe.get("target") == "isolated disposable candidate root outside accepted consumer roots",
        "media probe target",
    )
    require(set(probe.get("exact_rasters", [])) == set(EXPECTED_MEDIA), "media probe rasters")
    require(set(probe.get("variants", {})) == {"A_current", "B_no_post_import_resize", "C_direct_native_fill", "D_optional_minimal_import"}, "media probe variants")
    require(
        "raw-fill export" in probe.get("readback_per_variant", [])
        and "image-rectangle export" in probe.get("readback_per_variant", []),
        "media export comparison",
    )

    production = manifest["production_repair_after_probe"]
    require(production.get("apply_to_four_existing_roots") is True, "media four-root repair")
    require(production.get("preserve_root_and_component_ids") is True, "media ID preservation")
    require(production.get("new_root_allowed") is False, "media second root")
    require(production.get("visual_review_owner") == "V0", "media visual owner")
    require(manifest["materialization_entry_point"].get("penpot_adapter_included") is False, "media U0 adapter")


def validate_paths(manifest: dict[str, Any]) -> None:
    require(
        manifest.get("schema_version")
        == "kenigevents.asp-u0-eventcard-native-component-paths.v1",
        "path schema",
    )
    require(manifest.get("package_id") == "U-EVENTCARD-NATIVE-COMPONENT-PATHS", "path package")
    require(manifest.get("owner") == "U0", "path owner")
    require(manifest.get("status") == "READY_FOR_D0_MAT_AND_INTEGRATE", "path status")
    lifecycle = manifest["lifecycle"]
    require(lifecycle.get("ready_for_d0_mat") is True, "path MAT readiness")
    require(lifecycle.get("ready_for_d0_integrate") is True, "path integration readiness")
    require(lifecycle.get("ready_to_publish") is False, "path self-publication")
    require(lifecycle.get("serialize_after_text_r9") is True, "path serialization")
    require(lifecycle.get("penpot_mutations_by_u0") == 0, "path U0 mutation")
    validate_parent(manifest["parent_text_package"])

    identity = manifest["terminal_identity"]
    require(identity.get("penpot_revision") == 73, "path revision")
    require(identity.get("collection_root_id") == COLLECTION_ROOT, "path collection root")
    require(identity.get("collection_children") == 18, "path child census")
    require(identity.get("local_components") == 18, "path component census")
    require(identity.get("validation") == [], "path validation")

    defect = manifest["defect"]
    require(defect.get("terminal_review_comment") == 5481337267, "path terminal review")
    require(defect["observed_native_paths"] == {"nonempty": 3, "empty": 15, "expected_nonempty": 18}, "path baseline census")
    require("G19" in defect.get("observed_legacy_nonempty_path", ""), "legacy path evidence")

    policy = manifest["path_policy"]
    require(policy.get("native_property") == "LibraryComponent.path", "native path property")
    require(policy.get("path_required") is True, "path requirement")
    require(policy.get("plugin_metadata_as_substitute") is False, "metadata path substitute")
    require(policy.get("generation_or_run_id_in_path") is False, "generation path allowed")
    require(policy.get("component_name_mutation") is False, "component rename allowed")

    paths = manifest["expected_paths"]
    require(set(paths) == EXPECTED_PATH_KEYS, "expected path key set")
    for key in DESKTOP_LEAVES:
        require(paths.get(key) == PATH_DESKTOP_LEAVES, f"{key}: desktop leaf path")
    for key in MOBILE_LEAVES:
        require(paths.get(key) == PATH_MOBILE_LEAVES, f"{key}: mobile leaf path")
    for key in DESKTOP_CASES:
        require(paths.get(key) == PATH_DESKTOP_CASES, f"{key}: desktop case path")
    for key in MOBILE_CASES:
        require(paths.get(key) == PATH_MOBILE_CASES, f"{key}: mobile case path")
    require(all("G19" not in value for value in paths.values()), "generation-specific path")

    groups = manifest["semantic_groups"]
    require(groups["desktop_leaves"] == {"path": PATH_DESKTOP_LEAVES, "count": 7}, "desktop leaf group")
    require(groups["mobile_leaves"] == {"path": PATH_MOBILE_LEAVES, "count": 7}, "mobile leaf group")
    require(groups["desktop_cases"] == {"path": PATH_DESKTOP_CASES, "count": 2}, "desktop case group")
    require(groups["mobile_cases"] == {"path": PATH_MOBILE_CASES, "count": 2}, "mobile case group")

    repair = manifest["required_path_only_repair"]
    require(repair.get("set_exact_native_path") is True, "path write missing")
    require(repair.get("change_component_name") is False, "path rename allowed")
    require(repair.get("change_main_shape_or_instances") is False, "path structural mutation allowed")
    require(repair.get("change_geometry_or_content") is False, "path content mutation allowed")
    require(repair.get("new_component_allowed") is False, "new component allowed")
    require(repair.get("delete_component_allowed") is False, "delete component allowed")
    require(repair.get("new_root_allowed") is False, "path second root")
    require(repair.get("post_write_native_path_readback") == "18/18 exact", "path readback")

    preserve = manifest["must_preserve"]
    require(all(value is True for value in preserve.values()), "path preservation disabled")
    acceptance = manifest["acceptance"]
    require(acceptance.get("native_paths_nonempty") == 18, "path nonempty acceptance")
    require(acceptance.get("native_paths_exact_match") == 18, "path exact acceptance")
    require(acceptance.get("component_id_changes") == 0, "path ID changes")
    require(acceptance.get("new_or_deleted_components") == 0, "path component changes")
    require(acceptance.get("new_roots") == 0, "path root changes")
    require(acceptance.get("validation") == [], "path acceptance validation")
    require(manifest["materialization_entry_point"].get("penpot_adapter_included") is False, "path U0 adapter")


def validate_cross(media: dict[str, Any], paths: dict[str, Any]) -> None:
    validate_media(media)
    validate_paths(paths)
    require(media["parent_text_package"] == paths["parent_text_package"], "parent tuple divergence")
    require(
        media["terminal_identity"]["collection_root_id"]
        == paths["terminal_identity"]["collection_root_id"],
        "terminal root divergence",
    )
    require(
        media["terminal_identity"]["penpot_revision"]
        == paths["terminal_identity"]["penpot_revision"],
        "terminal revision divergence",
    )


def verify_repository_inputs(repo: Path, media: dict[str, Any], paths: dict[str, Any]) -> None:
    validate_cross(media, paths)
    parent = repo / PARENT_PATH
    require(parent.is_file(), "parent text package missing")
    data = parent.read_bytes()
    require(len(data) == PARENT_BYTES, "parent text package byte drift")
    require(git_blob_sha1(data) == PARENT_BLOB, "parent text package blob drift")


def compile_media(media: dict[str, Any]) -> dict[str, Any]:
    validate_media(media)
    payload = {
        "schema_version": "kenigevents.u0-eventcard-media-coverage-input.v1",
        "package_id": media["package_id"],
        "owner": "U0",
        "consumer": "D0/MAT",
        "source_a": media["source_a"],
        "geometry_authority": media["geometry_authority"],
        "terminal_identity": media["terminal_identity"],
        "defect": media["defect"],
        "factual_media": media["factual_media"],
        "required_native_probe": media["required_native_probe"],
        "production_repair_after_probe": media["production_repair_after_probe"],
        "forbidden": media["forbidden"],
        "gate": "NATIVE_PROBE_PASS_THEN_NEW_IMMUTABLE_REPAIR_PACKAGE",
    }
    return {"integrity": {"payload_sha256": sha256(canonical_bytes(payload))}, **payload}


def compile_paths(paths: dict[str, Any]) -> dict[str, Any]:
    validate_paths(paths)
    payload = {
        "schema_version": "kenigevents.u0-eventcard-native-component-paths.v1",
        "package_id": paths["package_id"],
        "owner": "U0",
        "consumer": "D0/MAT",
        "terminal_identity": paths["terminal_identity"],
        "path_policy": paths["path_policy"],
        "expected_paths": paths["expected_paths"],
        "semantic_groups": paths["semantic_groups"],
        "required_path_only_repair": paths["required_path_only_repair"],
        "must_preserve": paths["must_preserve"],
        "acceptance": paths["acceptance"],
        "forbidden": paths["forbidden"],
        "gate": "SERIALIZE_AFTER_TEXT_R9_AND_REQUIRE_QA_INTEGRATE_PASS",
    }
    return {"integrity": {"payload_sha256": sha256(canonical_bytes(payload))}, **payload}


def render(value: dict[str, Any]) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n").encode("utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--media", action="store_true")
    mode.add_argument("--paths", action="store_true")
    parser.add_argument("--repo", default=None)
    parser.add_argument("--media-manifest", default=MEDIA_PATH)
    parser.add_argument("--paths-manifest", default=PATHS_PATH)
    parser.add_argument("--check-repository-inputs", action="store_true")
    parser.add_argument("--emit", default="-")
    args = parser.parse_args()

    repo = Path(args.repo).resolve() if args.repo else Path(__file__).resolve().parents[3]
    media = load(repo / args.media_manifest)
    paths = load(repo / args.paths_manifest)
    validate_cross(media, paths)
    if args.check_repository_inputs:
        verify_repository_inputs(repo, media, paths)

    if args.media:
        value = compile_media(media)
    elif args.paths:
        value = compile_paths(paths)
    else:
        payload = {
            "schema_version": "kenigevents.u0-eventcard-v0-next-inputs.v1",
            "media": compile_media(media),
            "paths": compile_paths(paths),
        }
        value = {"integrity": {"payload_sha256": sha256(canonical_bytes(payload))}, **payload}

    output = render(value)
    if args.emit == "-":
        sys.stdout.buffer.write(output)
    else:
        target = repo / args.emit
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(output)
    print("U0_EVENTCARD_V0_NEXT_INPUTS_PASS", file=sys.stderr)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ContractError as exc:
        print(f"U0_EVENTCARD_V0_NEXT_INPUTS_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
