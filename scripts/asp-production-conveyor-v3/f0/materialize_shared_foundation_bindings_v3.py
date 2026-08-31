#!/usr/bin/env python3
"""Contract-current runner for F-SHARED-FOUNDATION-BINDINGS v3.

The runner verifies all producer package identities plus the centralized asset
registry. `plan` is read-only. `execute` is restricted to a D0/PUBLISH native
adapter and checks ACTIVE lease/cancel state before every mutation. `verify`
checks the ASP_BUILD_RESULT_V2 receipt independently.
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
    "F-SHARED-FOUNDATION-BINDINGS.package.v3.json"
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
    assert package["package_id"] == "F-SHARED-FOUNDATION-BINDINGS"
    assert package["revision"] == 3
    assert package["status"] in {"READY_FOR_D0_INTEGRATE", "READY_TO_PUBLISH"}
    return package, identity(data)


def validate_registry(repo: Path, package: dict[str, Any]) -> dict[str, Any]:
    expected = package["source_authority"]["asset_registry"]
    data = (repo / expected["path"]).read_bytes()
    actual = identity(data)
    assert actual["git_blob_sha1"] == expected["git_blob_sha1"]
    assert actual["bytes"] == expected["bytes"]
    text = data.decode("utf-8")
    assert "registry_version: 1.2.0-candidate.1" in text
    assert "required_slots_total: 8" in text
    assert "resolved_candidate_slots: 8" in text
    assert "unresolved_candidate_slots: 0" in text
    return actual


def validate_producers(repo: Path, package: dict[str, Any]) -> dict[str, Any]:
    expected_ids = {
        "F-ACTION-NAV-ICONS",
        "F-MEDALLIONS-BRAND-ASSETS",
        "F-FOUNDATIONS-SPECIMENS",
        "F-TYPOGRAPHY-LAYOUT",
        "F-BRANDBOOK-BASELINE",
    }
    seen: set[str] = set()
    receipts: list[dict[str, Any]] = []
    for producer in package["producer_packages"]:
        data = (repo / producer["path"]).read_bytes()
        actual = identity(data)
        assert actual["git_blob_sha1"] == producer["git_blob_sha1"], producer["path"]
        assert actual["bytes"] == producer["bytes"], producer["path"]
        parsed = json.loads(data)
        assert parsed["package_id"] == producer["package_id"]
        if producer["package_id"] == "F-ACTION-NAV-ICONS":
            assert parsed["revision"] == 3
            assert parsed["status"] in {"READY_FOR_D0_INTEGRATE", "READY_TO_PUBLISH"}
            assert len(parsed["assets_and_hashes"]) == 9
            assert parsed["source_authority"]["asset_registry"]["git_blob_sha1"] == (
                package["source_authority"]["asset_registry"]["git_blob_sha1"]
            )
        seen.add(producer["package_id"])
        receipts.append(
            {
                "package_id": producer["package_id"],
                "path": producer["path"],
                **actual,
            }
        )
    assert seen == expected_ids, f"producer coverage mismatch: {seen}"
    return {"count": len(seen), "packages": receipts}


def validate_graph(package: dict[str, Any]) -> dict[str, int]:
    nodes = package["binding_graph"]["nodes"]
    kinds = {node["id"]: node["kind"] for node in nodes}
    assert len(kinds) == len(nodes), "duplicate graph node"
    allowed = {
        "primitive>semantic",
        "semantic>component",
        "component>pattern",
        "pattern>archetype",
        "asset>component",
        "semantic>specimen",
        "asset>specimen",
    }
    for edge in package["binding_graph"]["edges"]:
        assert edge["from"] in kinds and edge["to"] in kinds
        pair = f"{kinds[edge['from']]}>{kinds[edge['to']]}"
        assert pair in allowed, f"forbidden graph edge {pair}"
        assert not (
            kinds[edge["from"]] == "primitive"
            and kinds[edge["to"]] in {"component", "pattern", "archetype"}
        ), f"direct primitive coupling: {edge}"
    return {"nodes": len(nodes), "edges": len(package["binding_graph"]["edges"])}


def validate_package(repo: Path, package: dict[str, Any]) -> dict[str, Any]:
    registry = validate_registry(repo, package)
    producers = validate_producers(repo, package)
    graph = validate_graph(package)
    assert len(package["binding_components"]) == 9
    assert len(package["materialization_entry_point"]["specimen"]["placements"]) == 32
    assert package["expected_roots"] == 1
    assert package["expected_components"] == 9
    assert package["expected_instances"] == 32
    defects = package["visual_defect_coverage"]
    for defect_id in (
        "P0-ASSET-POSTER-OCCLUDED",
        "P0-TEXT-LINEHEIGHT-CLIPPING",
    ):
        assert defects[defect_id]["status"] == (
            "EXTERNAL_GEOMETRY_REPAIR_REQUIRED_BEFORE_CONSUMER_ACCEPTANCE"
        )
        assert defects[defect_id]["closed"] is False
    entry = package["materialization_entry_point"]
    assert entry["penpot_write_authority"] == "D0/PUBLISH_ONLY"
    assert entry["requires_d0_integrate_pass"] is True
    assert entry["guard_before_every_mutation"] is True
    return {"registry": registry, "producers": producers, "graph": graph}


def immutable(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    evidence: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        **package["immutable_identity"],
        "candidate_commit": candidate_commit,
        "package_identity": package_identity,
        "registry_identity": evidence["registry"],
        "producer_identities": evidence["producers"]["packages"],
    }


def load_adapter(spec: str) -> Any:
    assert ":" in spec, "--adapter must be module:factory"
    module_name, factory_name = spec.split(":", 1)
    api = getattr(importlib.import_module(module_name), factory_name)()
    required = (
        "read_document",
        "assert_active_lease",
        "ensure_page",
        "upsert_foundation_binding_component",
        "upsert_binding_specimen",
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
    evidence: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        "marker": "F0_SHARED_BINDINGS_PLAN_PASS",
        "immutable_inputs": immutable(
            package, package_identity, evidence, candidate_commit
        ),
        "target": package["target_penpot_page"],
        "binding_components": package["binding_components"],
        "specimen": package["materialization_entry_point"]["specimen"],
        "expected": {
            "roots": package["expected_roots"],
            "components": package["expected_components"],
            "instances": package["expected_instances"],
        },
        "visual_defects": package["visual_defect_coverage"],
        "graph_validation": evidence["graph"],
        "writer": "D0/PUBLISH_ONLY",
        "guard_before_every_mutation": True,
    }


def execute(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    evidence: dict[str, Any],
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
            "registry_blob_sha1": evidence["registry"]["git_blob_sha1"],
            "registry_sha256": evidence["registry"]["sha256"],
        },
    )
    page_id = page["page_id"]

    component_ids: list[str] = []
    for component in package["binding_components"]:
        guard(api, args, f"component:{component['id']}")
        result = api.upsert_foundation_binding_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=component["penpot_name"],
            binding=component,
            metadata={
                "package_id": package["package_id"],
                "stable_id": component["id"],
                "source_package": component["source_package"],
                "registry_blob_sha1": evidence["registry"]["git_blob_sha1"],
            },
        )
        component_ids.append(result["component_id"])

    specimen = package["materialization_entry_point"]["specimen"]
    guard(api, args, "binding-specimen")
    specimen_result = api.upsert_binding_specimen(
        file_id=target["file_id"],
        page_id=page_id,
        exact_name=specimen["name"],
        component_ids=component_ids,
        placements=specimen["placements"],
        metadata={
            "package_id": package["package_id"],
            "visual_defect_coverage": package["visual_defect_coverage"],
            "consumer_geometry_claimed": False,
        },
    )
    root_id = specimen_result["shape_id"]

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
            package, package_identity, evidence, args.candidate_commit
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
            "registry_git_blob_sha1": evidence["registry"]["git_blob_sha1"],
            "registry_sha256": evidence["registry"]["sha256"],
            "package_git_blob_sha1": package_identity["git_blob_sha1"],
            "producer_identities": evidence["producers"]["packages"],
            "geometry_scope": "standalone shared-foundation binding board",
            "accepted_consumer_root_geometry_claimed": False,
            "consumer_defects_closed": False,
        },
    }


def verify(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    evidence: dict[str, Any],
    candidate_commit: str,
    receipt: dict[str, Any],
) -> None:
    assert receipt["marker"] == "ASP_BUILD_RESULT_V2"
    assert receipt["package_id"] == package["package_id"]
    assert receipt["package_revision"] == package["revision"]
    assert receipt["writer"] == "D0/PUBLISH"
    assert receipt["immutable_inputs"] == immutable(
        package, package_identity, evidence, candidate_commit
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
    assert provenance["registry_git_blob_sha1"] == evidence["registry"][
        "git_blob_sha1"
    ]
    assert provenance["registry_sha256"] == evidence["registry"]["sha256"]
    assert provenance["producer_identities"] == evidence["producers"]["packages"]
    assert provenance["accepted_consumer_root_geometry_claimed"] is False
    assert provenance["consumer_defects_closed"] is False


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
    evidence = validate_package(repo, package)

    if args.mode == "plan":
        result = build_plan(
            package, package_identity, evidence, args.candidate_commit
        )
        marker = "F0_SHARED_BINDINGS_PLAN_PASS"
    elif args.mode == "execute":
        result = execute(package, package_identity, evidence, args)
        marker = "F0_SHARED_BINDINGS_EXECUTE_PASS"
    else:
        assert args.receipt, "verify requires --receipt"
        receipt = json.loads(Path(args.receipt).read_text(encoding="utf-8"))
        verify(
            package,
            package_identity,
            evidence,
            args.candidate_commit,
            receipt,
        )
        result = {
            "status": "READBACK_VERIFIED",
            "immutable_inputs": immutable(
                package, package_identity, evidence, args.candidate_commit
            ),
        }
        marker = "F0_SHARED_BINDINGS_READBACK_PASS"

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
        print(f"F0_SHARED_BINDINGS_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
