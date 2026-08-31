#!/usr/bin/env python3
"""Compile the U0 controls candidate after F0 copy/check asset closure.

This tool performs no Penpot operation. It validates the existing controls
candidate, the immutable F0 asset tuple and the exact twelve-specimen extension
before emitting a deterministic D0/MAT input.
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
    "U-CONTROLS-PRIMITIVES.asset-closure.v2.json"
)
BASE_PACKAGE_PATH = (
    "catalog/asp-production-conveyor-v3/u0/"
    "U-CONTROLS-PRIMITIVES.package.v1.json"
)
BASE_PACKAGE_BLOB = "ffe05f3fc99529448eeadc30108f965ecce2ba7f"
BASE_PACKAGE_BYTES = 12159
REQUIREMENTS_SHA = "54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72"
F0_COMMIT = "b780d299b2403ddea8d0d6c5185db2c5e29c223a"
F0_PACKAGE_BLOB = "74dcb1fd12381495a239944839670988b615f0ff"
F0_EXTENSION_BLOB = "7108aef4856c2851c1eadbcfe8597ae8cb7d9a26"

EXPECTED_ASSETS = {
    "icon.action.copy": {
        "path": "catalog/asp-production-conveyor-v3/f0/assets/controls/copy.svg",
        "git_blob_sha1": "39a1affb019ba0e9d55348be6d9be6314c2f4f91",
        "sha256": "48710ac3735ed6a66aa775294d266f68800c140641dee0ed1029a85cb48cd049",
        "bytes": 405,
        "viewBox": "0 0 24 24",
        "fill": "none",
        "stroke": "currentColor",
        "stroke_width": 1.8,
    },
    "icon.status.check": {
        "path": "catalog/asp-production-conveyor-v3/f0/assets/controls/check.svg",
        "git_blob_sha1": "b227ceaaf956194bcb7e4e33fb2d8c5bd91645ca",
        "sha256": "3baf2a43953c61ce4d654002042c682ef9ecca73baff7d527359d170a6a40558",
        "bytes": 230,
        "viewBox": "0 0 24 24",
        "fill": "none",
        "stroke": "currentColor",
        "stroke_width": 2.2,
    },
}
EXPECTED_FAMILIES = {"control.copy-action", "control.button.icon-only"}
EXPECTED_COPY_STATES = {
    "default",
    "busy",
    "success",
    "error",
    "focus-visible",
    "pressed",
}
EXPECTED_ICON_BUTTON_STATES = {
    "default",
    "hover",
    "focus",
    "pressed",
    "disabled",
    "success",
}
EXPECTED_COPY_SPECIMENS = {
    "copy-action.secondary.default": ("secondary", "default", "icon.action.copy"),
    "copy-action.secondary.busy": ("secondary", "busy", "icon.action.copy"),
    "copy-action.secondary.success": ("secondary", "success", "icon.status.check"),
    "copy-action.secondary.error": ("secondary", "error", "icon.action.copy"),
    "copy-action.inverse.default": ("inverse", "default", "icon.action.copy"),
    "copy-action.inverse.success": ("inverse", "success", "icon.status.check"),
}
EXPECTED_ICON_SPECIMENS = {
    "button.icon-only.secondary.copy.default": ("secondary", "default", "icon.action.copy"),
    "button.icon-only.secondary.copy.hover": ("secondary", "hover", "icon.action.copy"),
    "button.icon-only.secondary.copy.focus": ("secondary", "focus", "icon.action.copy"),
    "button.icon-only.secondary.copy.pressed": ("secondary", "pressed", "icon.action.copy"),
    "button.icon-only.secondary.copy.disabled": ("secondary", "disabled", "icon.action.copy"),
    "button.icon-only.inverse.check.success": ("inverse", "success", "icon.status.check"),
}


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


def validate_manifest(manifest: dict[str, Any]) -> None:
    require(
        manifest.get("schema_version")
        == "kenigevents.asp-u0-controls-primitives-asset-closure.v2",
        "schema mismatch",
    )
    require(manifest.get("package_id") == "U-CONTROLS-PRIMITIVES", "package ID")
    require(manifest.get("package_revision") == 2, "package revision")
    require(manifest.get("owner") == "U0", "owner")
    require(manifest.get("status") == "READY_FOR_D0_INTEGRATE", "status")

    lifecycle = manifest["lifecycle"]
    require(lifecycle.get("ready_for_d0_integrate") is True, "integration readiness")
    require(lifecycle.get("ready_to_publish") is False, "U0 self-publication")
    require(lifecycle.get("candidate_only") is True, "candidate marker")
    require(lifecycle.get("visual_pass") is False, "U0 visual PASS")
    require(lifecycle.get("penpot_mutations_by_u0") == 0, "U0 Penpot mutation")
    require(lifecycle.get("sole_penpot_writer") == "/root/publish_r2", "sole writer")

    base = manifest["base_candidate"]
    require(base.get("commit") == "0f6d98fe8c4798b1be630f5fc635252c0ac5ace9", "base commit")
    require(base["package"].get("path") == BASE_PACKAGE_PATH, "base package path")
    require(base["package"].get("git_blob_sha1") == BASE_PACKAGE_BLOB, "base package blob")
    require(base["package"].get("bytes") == BASE_PACKAGE_BYTES, "base package bytes")
    require(base.get("families") == 5 and base.get("specimens") == 38, "base census")
    require(
        set(base.get("deferred_families_now_closed", [])) == EXPECTED_FAMILIES,
        "closed family set",
    )

    require(
        manifest["requirements_contract"].get("sha256") == REQUIREMENTS_SHA,
        "requirements tuple",
    )
    source = manifest["source_a"]
    require(source.get("commit") == "f2d658e8be057f3b75431f6b77e4887af4536028", "Source A commit")
    require(source.get("authority_mode") == "ASTRO_AS_IS_REFERENCE", "authority mode")
    require(
        source["files"]["copy_action"].get("git_blob_sha1")
        == "7f01708518e034c86ceb576f1dfdee849ea787be",
        "CopyAction source blob",
    )
    require(
        source["files"]["button"].get("git_blob_sha1")
        == "26c04968463fe826f699bfc0bc848c96adeebcf3",
        "Button source blob",
    )

    f0 = manifest["f0_asset_closure"]
    require(f0.get("commit") == F0_COMMIT, "F0 commit")
    require(f0["package"].get("git_blob_sha1") == F0_PACKAGE_BLOB, "F0 package blob")
    require(
        f0["package"].get("sha256")
        == "97b42867d554285283a60752bc8e9f122d524570867b6d12d99230fc23373a7c",
        "F0 package SHA-256",
    )
    extension = f0["registry_extension"]
    require(extension.get("git_blob_sha1") == F0_EXTENSION_BLOB, "F0 extension blob")
    require(
        extension.get("sha256")
        == "cfb48c0cf8bbff9bf744beb951f86653db8ac57520ca9665aefaa470939080fb",
        "F0 extension SHA-256",
    )
    require(extension.get("bytes") == 7409, "F0 extension bytes")
    require(f0.get("assets") == EXPECTED_ASSETS, "physical copy/check asset tuple")
    require(f0.get("fallback") is False, "asset fallback")

    families = manifest["new_families"]
    require(set(families) == EXPECTED_FAMILIES, "new family set")
    copy_family = families["control.copy-action"]
    require(set(copy_family.get("variants", [])) == {"secondary", "inverse"}, "copy variants")
    require(set(copy_family.get("states", [])) == EXPECTED_COPY_STATES, "copy states")
    require(copy_family.get("minimum_box_px") == 44, "copy target size")
    require(copy_family.get("default_asset") == "icon.action.copy", "copy default asset")
    require(copy_family.get("success_asset") == "icon.status.check", "copy success asset")
    require(copy_family.get("reset_delay_default_ms") == 2200, "copy reset delay")
    require(
        "aria-label-required" in copy_family.get("a11y", [])
        and "polite-atomic-status" in copy_family.get("a11y", []),
        "copy accessibility",
    )
    icon_family = families["control.button.icon-only"]
    require(set(icon_family.get("variants", [])) == {"secondary", "inverse"}, "icon variants")
    require(set(icon_family.get("states", [])) == EXPECTED_ICON_BUTTON_STATES, "icon states")
    require(icon_family.get("minimum_box_px") == 44, "icon target size")
    require(icon_family.get("aria_label_required") is True, "icon aria label")
    require(set(icon_family.get("allowed_assets", [])) == set(EXPECTED_ASSETS), "icon asset set")
    require(icon_family.get("fallback") is False, "icon fallback")

    specimens = manifest["new_specimens"]
    require(set(specimens) == EXPECTED_FAMILIES, "specimen family set")
    copy_specimens = {item.get("id"): item for item in specimens["control.copy-action"]}
    icon_specimens = {item.get("id"): item for item in specimens["control.button.icon-only"]}
    require(len(copy_specimens) == 6, "copy specimen count")
    require(len(icon_specimens) == 6, "icon specimen count")
    require(set(copy_specimens) == set(EXPECTED_COPY_SPECIMENS), "copy specimen IDs")
    require(set(icon_specimens) == set(EXPECTED_ICON_SPECIMENS), "icon specimen IDs")
    for specimen_id, (variant, state, asset) in EXPECTED_COPY_SPECIMENS.items():
        item = copy_specimens[specimen_id]
        require(item.get("variant") == variant, f"{specimen_id}: variant")
        require(item.get("state") == state, f"{specimen_id}: state")
        require(item.get("visible_asset") == asset, f"{specimen_id}: asset")
    for specimen_id, (variant, state, asset) in EXPECTED_ICON_SPECIMENS.items():
        item = icon_specimens[specimen_id]
        require(item.get("variant") == variant, f"{specimen_id}: variant")
        require(item.get("state") == state, f"{specimen_id}: state")
        require(item.get("asset") == asset, f"{specimen_id}: asset")

    result = manifest["resulting_candidate"]
    require(
        result
        == {
            "families": 7,
            "specimens": 50,
            "base_families": 5,
            "base_specimens": 38,
            "new_families": 2,
            "new_specimens": 12,
            "unresolved_asset_identities": 0,
            "generic_or_unicode_fallbacks": 0,
        },
        "resulting candidate census",
    )

    target = manifest["target"]
    require(target.get("file_id") == "40e06342-8830-80d6-8008-8fc8a3a4cd4f", "target file")
    require(target.get("page_id") == "RESOLVE_OR_CREATE_BY_D0_INTEGRATE", "target page gate")
    require(target.get("candidate_label") == "CANDIDATE_BUILD_NOT_ACCEPTED", "candidate label")
    require(target.get("one_candidate_root") is True, "candidate root count")
    require(target.get("accepted_eventcard_page_mutation") is False, "EventCard mutation allowed")
    require(target.get("screenshots") == 0 and target.get("old_penpot_uuids") == 0, "unsafe implementation")

    materialization = manifest["materialization_entry_point"]
    require(materialization.get("consumer") == "D0/MAT", "consumer")
    require(materialization.get("penpot_adapter_included") is False, "U0 Penpot adapter")
    require(
        "protect the accepted EventCard page by pre/post digest"
        in materialization.get("required_operations", []),
        "EventCard page protection",
    )


def verify_repository_inputs(repo: Path, manifest: dict[str, Any]) -> None:
    validate_manifest(manifest)
    path = repo / BASE_PACKAGE_PATH
    require(path.is_file(), "base controls package missing")
    data = path.read_bytes()
    require(len(data) == BASE_PACKAGE_BYTES, "base controls package byte drift")
    require(git_blob_sha1(data) == BASE_PACKAGE_BLOB, "base controls package blob drift")


def compile_input(manifest: dict[str, Any]) -> dict[str, Any]:
    validate_manifest(manifest)
    payload = {
        "schema_version": "kenigevents.u0-controls-primitives-candidate.v2",
        "package_id": manifest["package_id"],
        "package_revision": 2,
        "owner": "U0",
        "consumer": "D0/MAT",
        "base_candidate": manifest["base_candidate"],
        "requirements_contract": manifest["requirements_contract"],
        "source_a": manifest["source_a"],
        "f0_asset_closure": manifest["f0_asset_closure"],
        "new_families": manifest["new_families"],
        "new_specimens": manifest["new_specimens"],
        "resulting_candidate": manifest["resulting_candidate"],
        "target": manifest["target"],
        "forbidden": manifest["forbidden"],
        "gates": {
            "remote_verify_f0_tuple": "REQUIRED",
            "d0_integrate_pass": "REQUIRED",
            "active_candidate_run": "REQUIRED",
            "accepted_eventcard_pre_post_digest": "REQUIRED",
            "native_readback_and_nonempty_export": "REQUIRED",
            "v0_review": "REQUIRED",
        },
        "run_control": {
            "sole_writer": "/root/publish_r2",
            "candidate_only": True,
            "accepted_eventcard_mutation": False,
            "new_root_count": 1,
        },
    }
    return {
        "integrity": {
            "canonicalization": "UTF-8 sorted compact JSON",
            "payload_sha256": sha256(canonical_bytes(payload)),
        },
        **payload,
    }


def render(value: dict[str, Any]) -> bytes:
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
    output = render(compile_input(manifest))

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

    print("U0_CONTROLS_PRIMITIVES_ASSET_CLOSURE_PASS", file=sys.stderr)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ContractError as exc:
        print(f"U0_CONTROLS_PRIMITIVES_ASSET_CLOSURE_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
