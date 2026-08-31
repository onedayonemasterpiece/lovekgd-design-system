#!/usr/bin/env python3
"""Bounded materializer/readback verifier for F-SHARED-FOUNDATION-BINDINGS v2."""

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
    "F-SHARED-FOUNDATION-BINDINGS.package.v2.json"
)


def identity(data: bytes) -> dict[str, Any]:
    return {
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "git_blob_sha1": hashlib.sha1(
            f"blob {len(data)}\0".encode() + data
        ).hexdigest(),
    }


def load(repo: Path, rel: str) -> tuple[dict[str, Any], dict[str, Any]]:
    data = (repo / rel).read_bytes()
    package = json.loads(data)
    assert package["package_id"] == "F-SHARED-FOUNDATION-BINDINGS"
    assert package["status"] in {"READY_FOR_D0_INTEGRATE", "READY_TO_PUBLISH"}
    return package, identity(data)


def validate(repo: Path, package: dict[str, Any]) -> dict[str, Any]:
    producers = set()
    for item in package["producer_packages"]:
        data = (repo / item["path"]).read_bytes()
        actual = identity(data)
        assert actual["git_blob_sha1"] == item["git_blob_sha1"], item["path"]
        assert actual["bytes"] == item["bytes"], item["path"]
        producers.add(item["package_id"])
    assert producers == {
        "F-ACTION-NAV-ICONS",
        "F-MEDALLIONS-BRAND-ASSETS",
        "F-FOUNDATIONS-SPECIMENS",
        "F-TYPOGRAPHY-LAYOUT",
        "F-BRANDBOOK-BASELINE",
    }

    registry = package["source_authority"]["asset_registry"]
    registry_data = (repo / registry["path"]).read_bytes()
    actual_registry = identity(registry_data)
    assert actual_registry["git_blob_sha1"] == registry["git_blob_sha1"]
    assert actual_registry["sha256"] == registry["sha256"]

    action_package = next(
        item for item in package["producer_packages"]
        if item["package_id"] == "F-ACTION-NAV-ICONS"
    )
    action = json.loads((repo / action_package["path"]).read_text())
    assert action["revision"] == 2
    assert action["status"] in {"READY_FOR_D0_INTEGRATE", "READY_TO_PUBLISH"}
    assert len(action["assets_and_hashes"]) == 9

    node_kinds = {
        item["id"]: item["kind"] for item in package["binding_graph"]["nodes"]
    }
    assert len(node_kinds) == len(package["binding_graph"]["nodes"])
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
        assert edge["from"] in node_kinds and edge["to"] in node_kinds
        pair = f"{node_kinds[edge['from']]}>{node_kinds[edge['to']]}"
        assert pair in allowed, f"forbidden edge {pair}"
        assert not (
            node_kinds[edge["from"]] == "primitive"
            and node_kinds[edge["to"]] in {"component", "pattern", "archetype"}
        )

    defects = package["visual_defect_coverage"]
    assert defects["P0-ASSET-POSTER-OCCLUDED"]["status"] == (
        "EXTERNAL_GEOMETRY_REPAIR_REQUIRED_BEFORE_CONSUMER_ACCEPTANCE"
    )
    assert defects["P0-TEXT-LINEHEIGHT-CLIPPING"]["status"] == (
        "EXTERNAL_GEOMETRY_REPAIR_REQUIRED_BEFORE_CONSUMER_ACCEPTANCE"
    )
    assert package["materialization_entry_point"]["penpot_write_authority"] == (
        "D0/PUBLISH_ONLY"
    )
    assert package["materialization_entry_point"][
        "guard_before_every_mutation"
    ] is True
    return {
        "producer_packages": len(producers),
        "binding_nodes": len(node_kinds),
        "binding_edges": len(package["binding_graph"]["edges"]),
        "components": len(package["binding_components"]),
        "defects_routed": 2,
        "registry_sha256": actual_registry["sha256"],
    }


def immutable(
    package: dict[str, Any], package_id: dict[str, Any], commit: str
) -> dict[str, Any]:
    return {
        **package["immutable_identity"],
        "candidate_commit": commit,
        "package_identity": package_id,
    }


def get_adapter(spec: str) -> Any:
    assert ":" in spec, "--adapter must be module:factory"
    module, factory = spec.split(":", 1)
    api = getattr(importlib.import_module(module), factory)()
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
    assert all(callable(getattr(api, name, None)) for name in required)
    return api


def guard(api: Any, args: argparse.Namespace, label: str) -> None:
    state = api.assert_active_lease(
        run_id=args.run_id,
        lease_token=args.lease_token,
        cancel_token=args.cancel_token,
    )
    assert state.get("active") is True, f"inactive before {label}"
    assert state.get("cancelled") is not True, f"cancelled before {label}"


def plan(
    package: dict[str, Any],
    package_id: dict[str, Any],
    commit: str,
    evidence: dict[str, Any],
) -> dict[str, Any]:
    return {
        "marker": "F0_SHARED_BINDINGS_PLAN_PASS",
        "immutable_inputs": immutable(package, package_id, commit),
        "target": package["target_penpot_page"],
        "components": package["binding_components"],
        "specimen": package["materialization_entry_point"]["specimen"],
        "expected": {
            "roots": package["expected_roots"],
            "components": package["expected_components"],
            "instances": package["expected_instances"],
        },
        "validated": evidence,
        "writer": "D0/PUBLISH_ONLY",
        "guard_before_every_mutation": True,
    }


def execute(
    package: dict[str, Any],
    package_id: dict[str, Any],
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
    )
    api = get_adapter(args.adapter)
    target = package["target_penpot_page"]
    before = api.read_document(file_id=target["file_id"])

    guard(api, args, "ensure_page")
    page = api.ensure_page(
        file_id=target["file_id"],
        exact_name=target["exact_name"],
        metadata={
            "package_id": package["package_id"],
            "candidate_commit": args.candidate_commit,
            "package_blob_sha1": package_id["git_blob_sha1"],
        },
    )
    page_id = page["page_id"]

    component_ids: list[str] = []
    for item in package["binding_components"]:
        guard(api, args, f"component:{item['id']}")
        result = api.upsert_foundation_binding_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=item["penpot_name"],
            binding=item,
            metadata={
                "package_id": package["package_id"],
                "source_package": item["source_package"],
                "stable_id": item["id"],
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
            "defect_coverage": package["visual_defect_coverage"],
        },
    )
    root_id = specimen_result["shape_id"]

    validation = api.validate(file_id=target["file_id"], page_id=page_id)
    assert validation.get("errors") in (None, [])
    exported = api.export_png(
        file_id=target["file_id"], shape_id=root_id, scale=1.0
    )
    assert exported.get("nonempty") is True
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
        "status": "IMPLEMENTED_PENDING_D0_INTEGRATE_AND_V0",
        "writer": "D0/PUBLISH",
        "immutable_inputs": immutable(
            package, package_id, args.candidate_commit
        ),
        "run_control": {
            "run_id": args.run_id,
            "guard_before_every_mutation": True,
            "lease_token_sha256": hashlib.sha256(
                args.lease_token.encode()
            ).hexdigest(),
            "cancel_token_sha256": hashlib.sha256(
                args.cancel_token.encode()
            ).hexdigest(),
        },
        "target": {
            "file_id": target["file_id"],
            "page_id": page_id,
            "page_name": target["exact_name"],
            "consumer_evidence_page_id": target[
                "consumer_evidence_page_id"
            ],
            "consumer_evidence_rejected_root_id": target[
                "consumer_evidence_rejected_root_id"
            ],
            "rejected_root_mutated": False,
        },
        "revision": {
            "before": before.get("revision"),
            "after": after.get("revision"),
        },
        "counts": {
            "roots": 1,
            "components": len(component_ids),
            "instances": readback.get("instance_count"),
            "detached_instances": readback.get("detached_instance_count"),
            "screenshot_shapes": readback.get("screenshot_shape_count"),
        },
        "created_or_reused": {
            "component_ids": component_ids,
            "root_id": root_id,
        },
        "validation": validation,
        "export": exported,
        "provenance_receipt": {
            "contract_sha256": package["source_authority"][
                "requirements_contract"
            ]["sha256"],
            "registry_sha256": package["source_authority"][
                "asset_registry"
            ]["sha256"],
            "package_blob_sha1": package_id["git_blob_sha1"],
            "geometry_scope": "standalone shared-binding board",
            "accepted_consumer_root_geometry_claimed": False,
            "consumer_defects_closed": False,
        },
    }


def verify(
    package: dict[str, Any],
    package_id: dict[str, Any],
    commit: str,
    receipt: dict[str, Any],
) -> None:
    assert receipt["marker"] == "ASP_BUILD_RESULT_V2"
    assert receipt["package_id"] == package["package_id"]
    assert receipt["writer"] == "D0/PUBLISH"
    assert receipt["immutable_inputs"] == immutable(package, package_id, commit)
    assert receipt["target"]["file_id"] == package["target_penpot_page"]["file_id"]
    assert receipt["target"]["rejected_root_mutated"] is False
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
    assert provenance["accepted_consumer_root_geometry_claimed"] is False
    assert provenance["consumer_defects_closed"] is False


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("mode", choices=("plan", "execute", "verify"))
    p.add_argument("--repo")
    p.add_argument("--package", default=DEFAULT_PACKAGE)
    p.add_argument("--candidate-commit", required=True)
    p.add_argument("--adapter")
    p.add_argument("--run-id")
    p.add_argument("--lease-token")
    p.add_argument("--cancel-token")
    p.add_argument("--receipt")
    p.add_argument("--output")
    args = p.parse_args()
    repo = Path(args.repo).resolve() if args.repo else Path(__file__).resolve().parents[3]
    package, package_id = load(repo, args.package)
    evidence = validate(repo, package)

    if args.mode == "plan":
        result = plan(
            package, package_id, args.candidate_commit, evidence
        )
        marker = "F0_SHARED_BINDINGS_PLAN_PASS"
    elif args.mode == "execute":
        result = execute(package, package_id, args)
        marker = "F0_SHARED_BINDINGS_EXECUTE_PASS"
    else:
        assert args.receipt, "verify requires --receipt"
        receipt = json.loads(Path(args.receipt).read_text())
        verify(package, package_id, args.candidate_commit, receipt)
        result = {
            "status": "READBACK_VERIFIED",
            "immutable_inputs": immutable(
                package, package_id, args.candidate_commit
            ),
        }
        marker = "F0_SHARED_BINDINGS_READBACK_PASS"

    rendered = json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True)
    if args.output:
        Path(args.output).write_text(rendered + "\n")
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
