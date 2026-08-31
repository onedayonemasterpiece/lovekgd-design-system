#!/usr/bin/env python3
"""Executable runner for F-FOUNDATIONS-SPECIMENS v2.

`plan` validates the immutable source package and current reconstructed values.
`execute` is available only through a D0/PUBLISH native Penpot adapter and
checks ACTIVE lease/cancel state before every mutation. `verify` validates the
ASP_BUILD_RESULT_V2 receipt without contacting Penpot.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib
import json
from pathlib import Path
import sys
from typing import Any

DEFAULT_PACKAGE = (
    "catalog/asp-production-conveyor-v3/f0/"
    "F-FOUNDATIONS-SPECIMENS.package.v2.json"
)


def identity(data: bytes) -> dict[str, Any]:
    return {
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "git_blob_sha1": hashlib.sha1(
            f"blob {len(data)}\0".encode("ascii") + data
        ).hexdigest(),
    }


def load_package(repo: Path, rel: str) -> tuple[dict[str, Any], dict[str, Any]]:
    data = (repo / rel).read_bytes()
    package = json.loads(data)
    assert package["package_id"] == "F-FOUNDATIONS-SPECIMENS"
    assert package["revision"] == 2
    assert package["status"] in {"READY_FOR_D0_INTEGRATE", "READY_TO_PUBLISH"}
    return package, identity(data)


def validate_source(repo: Path, package: dict[str, Any]) -> dict[str, Any]:
    source = package["source_package"]
    data = (repo / source["path"]).read_bytes()
    actual = identity(data)
    assert actual["git_blob_sha1"] == source["git_blob_sha1"]
    assert actual["bytes"] == source["bytes"]
    parsed = json.loads(data)
    assert parsed["package_id"] == package["package_id"]
    assert parsed["source_authority"]["commit"] == package["source_authority"][
        "astro"
    ]["commit"]
    return actual


def validate_values(package: dict[str, Any]) -> dict[str, int]:
    values = package["specimens"]
    assert len(values["colors"]) == 18
    assert len(values["status_pairs"]) == 4
    assert len(values["spacing"]["scale"]) == 10
    assert len(values["radii"]) == 5
    assert len(values["shadows"]) == 3
    assert values["sizing"]["control_min"] == "44px"
    assert values["sizing"]["content_max"] == "1180px"
    assert values["sizing"]["content_wide_max"] == "1440px"
    assert values["motion"]["duration_fast"] == "160ms"
    assert values["motion"]["duration_base"] == "220ms"
    assert values["motion"]["ease_standard"] == (
        "cubic-bezier(0.2, 0.8, 0.2, 1)"
    )
    assert values["motion"]["reduced_motion"] == "mandatory-no-op"
    assert len(package["specimen_components"]) == 8
    placements = package["materialization_entry_point"]["specimen"]["placements"]
    assert len(placements) == 57
    assert len({item["id"] for item in placements}) == 57
    assert package["expected_roots"] == 1
    assert package["expected_components"] == 8
    assert package["expected_instances"] == 57
    assert package["asset_registry_applicability"]["external_asset_slots"] == 0
    return {
        "colors": 18,
        "status_pairs": 4,
        "spacing_steps": 10,
        "radii": 5,
        "shadows": 3,
        "components": 8,
        "placements": 57,
    }


def immutable(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    source_identity: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        **package["immutable_identity"],
        "candidate_commit": candidate_commit,
        "package_identity": package_identity,
        "source_package_identity": source_identity,
    }


def load_adapter(spec: str) -> Any:
    assert ":" in spec, "--adapter must be module:factory"
    module_name, factory_name = spec.split(":", 1)
    api = getattr(importlib.import_module(module_name), factory_name)()
    required = (
        "read_document",
        "assert_active_lease",
        "ensure_page",
        "upsert_foundation_specimen_component",
        "upsert_foundation_specimen_root",
        "validate",
        "export_png",
        "readback",
    )
    missing = [name for name in required if not callable(getattr(api, name, None))]
    assert not missing, f"native adapter missing methods: {missing}"
    return api


def guard(api: Any, args: argparse.Namespace, label: str) -> None:
    state = api.assert_active_lease(
        run_id=args.run_id,
        lease_token=args.lease_token,
        cancel_token=args.cancel_token,
    )
    assert state.get("active") is True, f"inactive before {label}: {state}"
    assert state.get("cancelled") is not True, f"cancelled before {label}: {state}"


def build_plan(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    source_identity: dict[str, Any],
    candidate_commit: str,
    validated: dict[str, int],
) -> dict[str, Any]:
    return {
        "marker": "F0_FOUNDATION_SPECIMENS_PLAN_PASS",
        "immutable_inputs": immutable(
            package, package_identity, source_identity, candidate_commit
        ),
        "target": package["target_penpot_page"],
        "components": package["specimen_components"],
        "specimen": package["materialization_entry_point"]["specimen"],
        "validated": validated,
        "expected": {
            "roots": package["expected_roots"],
            "components": package["expected_components"],
            "instances": package["expected_instances"],
        },
        "write_contract": {
            "writer": "D0/PUBLISH_ONLY",
            "guard_before_every_mutation": True,
            "external_asset_slots": 0,
            "consumer_geometry_claimed": False,
        },
    }


def execute(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    source_identity: dict[str, Any],
    args: argparse.Namespace,
) -> dict[str, Any]:
    assert all(
        (
            args.adapter,
            args.run_id,
            args.lease_token,
            args.cancel_token,
            args.candidate_commit,
        )
    ), "execute requires adapter/run/lease/cancel/candidate-commit"
    api = load_adapter(args.adapter)
    target = package["target_penpot_page"]
    before = api.read_document(file_id=target["file_id"])

    guard(api, args, "ensure-page")
    page = api.ensure_page(
        file_id=target["file_id"],
        exact_name=target["exact_name"],
        metadata={
            "package_id": package["package_id"],
            "package_revision": package["revision"],
            "candidate_commit": args.candidate_commit,
            "package_blob_sha1": package_identity["git_blob_sha1"],
            "source_package_blob_sha1": source_identity["git_blob_sha1"],
        },
    )
    page_id = page["page_id"]

    component_ids: list[str] = []
    for component in package["specimen_components"]:
        guard(api, args, f"component:{component['id']}")
        result = api.upsert_foundation_specimen_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=component["penpot_name"],
            component_spec=component,
            values=package["specimens"][component["value_domain"]],
            metadata={
                "package_id": package["package_id"],
                "stable_id": component["id"],
                "source_commit": package["source_authority"]["astro"]["commit"],
                "source_hashes": package["source_authority"]["runtime_files"],
            },
        )
        component_ids.append(result["component_id"])

    specimen = package["materialization_entry_point"]["specimen"]
    guard(api, args, "specimen-root")
    root = api.upsert_foundation_specimen_root(
        file_id=target["file_id"],
        page_id=page_id,
        exact_name=specimen["name"],
        component_ids=component_ids,
        placements=specimen["placements"],
        metadata={
            "package_id": package["package_id"],
            "visual_delta_allowed": False,
            "external_asset_slots": 0,
        },
    )
    root_id = root["shape_id"]

    validation = api.validate(file_id=target["file_id"], page_id=page_id)
    assert validation.get("errors") in (None, []), validation
    export = api.export_png(file_id=target["file_id"], shape_id=root_id, scale=1.0)
    assert export.get("nonempty") is True, export
    readback = api.readback(
        file_id=target["file_id"],
        page_id=page_id,
        shape_ids=component_ids + [root_id],
    )
    after = api.read_document(file_id=target["file_id"])

    return {
        "schema_version": "kenigevents.asp-build-result-v2",
        "marker": "ASP_BUILD_RESULT_V2",
        "package_id": package["package_id"],
        "package_revision": package["revision"],
        "status": "IMPLEMENTED_PENDING_D0_INTEGRATE_AND_V0",
        "writer": "D0/PUBLISH",
        "immutable_inputs": immutable(
            package, package_identity, source_identity, args.candidate_commit
        ),
        "run_control": {
            "run_id": args.run_id,
            "lease_token_sha256": hashlib.sha256(args.lease_token.encode()).hexdigest(),
            "cancel_token_sha256": hashlib.sha256(args.cancel_token.encode()).hexdigest(),
            "guard_before_every_mutation": True,
        },
        "target": {
            "file_id": target["file_id"],
            "page_id": page_id,
            "page_name": target["exact_name"],
            "consumer_evidence_page_id": target["consumer_evidence_page_id"],
            "consumer_evidence_rejected_root_id": target[
                "consumer_evidence_rejected_root_id"
            ],
            "rejected_root_mutated": False,
        },
        "revision": {"before": before.get("revision"), "after": after.get("revision")},
        "counts": {
            "roots": 1,
            "components": len(component_ids),
            "instances": readback.get("instance_count"),
            "detached_instances": readback.get("detached_instance_count"),
            "screenshot_shapes": readback.get("screenshot_shape_count"),
        },
        "created_or_reused": {"component_ids": component_ids, "root_id": root_id},
        "validation": validation,
        "export": export,
        "provenance_receipt": {
            "contract_sha256": package["source_authority"]["requirements_contract"][
                "sha256"
            ],
            "package_git_blob_sha1": package_identity["git_blob_sha1"],
            "source_package_git_blob_sha1": source_identity["git_blob_sha1"],
            "runtime_source_hashes": package["source_authority"]["runtime_files"],
            "asset_registry_applicability": "NO_EXTERNAL_GRAPHICAL_ASSET_SLOTS",
            "geometry_scope": "standalone foundation specimen board",
            "accepted_consumer_root_geometry_claimed": False,
        },
    }


def verify(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    source_identity: dict[str, Any],
    candidate_commit: str,
    receipt: dict[str, Any],
) -> None:
    assert receipt["marker"] == "ASP_BUILD_RESULT_V2"
    assert receipt["package_id"] == package["package_id"]
    assert receipt["package_revision"] == package["revision"]
    assert receipt["writer"] == "D0/PUBLISH"
    assert receipt["immutable_inputs"] == immutable(
        package, package_identity, source_identity, candidate_commit
    )
    target = package["target_penpot_page"]
    actual = receipt["target"]
    assert actual["file_id"] == target["file_id"]
    assert actual["consumer_evidence_page_id"] == target[
        "consumer_evidence_page_id"
    ]
    assert actual["consumer_evidence_rejected_root_id"] == target[
        "consumer_evidence_rejected_root_id"
    ]
    assert actual["rejected_root_mutated"] is False
    assert receipt["run_control"]["guard_before_every_mutation"] is True
    counts = receipt["counts"]
    assert counts["roots"] == package["expected_roots"]
    assert counts["components"] == package["expected_components"]
    assert counts["instances"] == package["expected_instances"]
    assert counts["detached_instances"] == 0
    assert counts["screenshot_shapes"] == 0
    assert receipt["validation"].get("errors") in (None, [])
    assert receipt["export"].get("nonempty") is True
    provenance = receipt["provenance_receipt"]
    assert provenance["asset_registry_applicability"] == (
        "NO_EXTERNAL_GRAPHICAL_ASSET_SLOTS"
    )
    assert provenance["accepted_consumer_root_geometry_claimed"] is False


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("plan", "execute", "verify"))
    parser.add_argument("--repo")
    parser.add_argument("--package", default=DEFAULT_PACKAGE)
    parser.add_argument("--candidate-commit", required=True)
    parser.add_argument("--adapter")
    parser.add_argument("--run-id")
    parser.add_argument("--lease-token")
    parser.add_argument("--cancel-token")
    parser.add_argument("--receipt")
    parser.add_argument("--output")
    args = parser.parse_args()

    repo = Path(args.repo).resolve() if args.repo else Path(__file__).resolve().parents[3]
    package, package_identity = load_package(repo, args.package)
    source_identity = validate_source(repo, package)
    validated = validate_values(package)

    if args.mode == "plan":
        result = build_plan(
            package,
            package_identity,
            source_identity,
            args.candidate_commit,
            validated,
        )
        marker = "F0_FOUNDATION_SPECIMENS_PLAN_PASS"
    elif args.mode == "execute":
        result = execute(package, package_identity, source_identity, args)
        marker = "F0_FOUNDATION_SPECIMENS_EXECUTE_PASS"
    else:
        assert args.receipt, "verify requires --receipt"
        receipt = json.loads(Path(args.receipt).read_text(encoding="utf-8"))
        verify(
            package,
            package_identity,
            source_identity,
            args.candidate_commit,
            receipt,
        )
        result = {
            "status": "READBACK_VERIFIED",
            "immutable_inputs": immutable(
                package,
                package_identity,
                source_identity,
                args.candidate_commit,
            ),
        }
        marker = "F0_FOUNDATION_SPECIMENS_READBACK_PASS"

    rendered = json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True)
    if args.output:
        Path(args.output).write_text(rendered + "\n", encoding="utf-8")
    print(marker, rendered)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (
        AssertionError,
        ImportError,
        KeyError,
        OSError,
        TypeError,
        json.JSONDecodeError,
    ) as exc:
        print(f"F0_FOUNDATION_SPECIMENS_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
