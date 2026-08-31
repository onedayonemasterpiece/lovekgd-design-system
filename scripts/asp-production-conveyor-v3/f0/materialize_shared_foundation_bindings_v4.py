#!/usr/bin/env python3
"""Dependency-gated runner for F-SHARED-FOUNDATION-BINDINGS v4.

The plan binds exact identities for the five current executable producer
packages and three asset registries. Execute requires a D0 integration PASS
receipt for every producer, then uses only a D0/PUBLISH native adapter and
checks ACTIVE lease/cancel state before every mutation. Verify checks the
ASP_BUILD_RESULT_V2 receipt independently.
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
    "F-SHARED-FOUNDATION-BINDINGS.package.v4.json"
)


def identity(data: bytes) -> dict[str, Any]:
    return {
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "git_blob_sha1": hashlib.sha1(
            f"blob {len(data)}\0".encode("ascii") + data
        ).hexdigest(),
    }


def load_json(repo: Path, rel: str) -> tuple[dict[str, Any], dict[str, Any]]:
    data = (repo / rel).read_bytes()
    return json.loads(data), identity(data)


def load_package(repo: Path, rel: str) -> tuple[dict[str, Any], dict[str, Any]]:
    package, package_identity = load_json(repo, rel)
    assert package["package_id"] == "F-SHARED-FOUNDATION-BINDINGS"
    assert package["revision"] == 4
    assert package["status"] in {"READY_FOR_D0_INTEGRATE", "READY_TO_PUBLISH"}
    return package, package_identity


def validate_producers(repo: Path, package: dict[str, Any]) -> list[dict[str, Any]]:
    expected = {
        "F-ACTION-NAV-ICONS": 3,
        "F-MEDALLIONS-BRAND-ASSETS": 2,
        "F-FOUNDATIONS-SPECIMENS": 2,
        "F-TYPOGRAPHY-LAYOUT": 2,
        "F-BRANDBOOK-BASELINE": 2,
    }
    found: dict[str, int] = {}
    identities: list[dict[str, Any]] = []
    for producer in package["producer_packages"]:
        parsed, file_identity = load_json(repo, producer["path"])
        package_id = parsed["package_id"]
        revision = parsed["revision"]
        assert package_id == producer["package_id"]
        assert revision == producer["revision"]
        assert expected[package_id] == revision
        assert parsed["status"] in {"READY_FOR_D0_INTEGRATE", "READY_TO_PUBLISH"}
        assert parsed["materialization_entry_point"]["penpot_write_authority"] == (
            "D0/PUBLISH_ONLY"
        )
        assert parsed["materialization_entry_point"][
            "requires_d0_integrate_pass"
        ] is True
        assert parsed["materialization_entry_point"][
            "guard_before_every_mutation"
        ] is True
        found[package_id] = revision
        identities.append(
            {
                "package_id": package_id,
                "revision": revision,
                "path": producer["path"],
                **file_identity,
            }
        )
    assert found == expected
    return sorted(identities, key=lambda item: item["package_id"])


def validate_registries(repo: Path, package: dict[str, Any]) -> list[dict[str, Any]]:
    identities: list[dict[str, Any]] = []
    for registry in package["asset_registries"]:
        path = registry["path"]
        data = (repo / path).read_bytes()
        file_identity = identity(data)
        if path.endswith(".json"):
            parsed = json.loads(data)
            assert parsed["registry_id"] == registry["registry_id"]
        else:
            text = data.decode("utf-8")
            assert f"registry_id: {registry['registry_id']}" in text
        if registry.get("git_blob_sha1"):
            assert file_identity["git_blob_sha1"] == registry["git_blob_sha1"]
        if registry.get("bytes"):
            assert file_identity["bytes"] == registry["bytes"]
        identities.append({"registry_id": registry["registry_id"], "path": path, **file_identity})
    assert len(identities) == 3
    return sorted(identities, key=lambda item: item["registry_id"])


def validate_graph(package: dict[str, Any]) -> dict[str, int]:
    nodes = package["binding_graph"]["nodes"]
    kinds = {node["id"]: node["kind"] for node in nodes}
    assert len(kinds) == len(nodes)
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
    producers = validate_producers(repo, package)
    registries = validate_registries(repo, package)
    graph = validate_graph(package)
    assert len(package["binding_components"]) == 9
    placements = package["materialization_entry_point"]["specimen"]["placements"]
    assert len(placements) == 32
    assert len({item["id"] for item in placements}) == 32
    assert package["expected_roots"] == 1
    assert package["expected_components"] == 9
    assert package["expected_instances"] == 32
    for defect_id in (
        "P0-ASSET-POSTER-OCCLUDED",
        "P0-TEXT-LINEHEIGHT-CLIPPING",
    ):
        defect = package["visual_defect_coverage"][defect_id]
        assert defect["closed"] is False
        assert defect["status"] == (
            "EXTERNAL_GEOMETRY_REPAIR_REQUIRED_BEFORE_CONSUMER_ACCEPTANCE"
        )
    return {"producers": producers, "registries": registries, "graph": graph}


def load_dependency_receipts(
    directory: Path, package: dict[str, Any]
) -> list[dict[str, Any]]:
    expected = {
        (producer["package_id"], producer["revision"])
        for producer in package["producer_packages"]
    }
    found: dict[tuple[str, int], dict[str, Any]] = {}
    for path in sorted(directory.glob("*.json")):
        receipt = json.loads(path.read_text(encoding="utf-8"))
        package_id = receipt.get("package_id")
        revision = receipt.get("package_revision", receipt.get("revision"))
        key = (package_id, revision)
        if key not in expected:
            continue
        assert receipt.get("marker") == "D0_INTEGRATION_RESULT_V2"
        assert receipt.get("verdict") == "PASS"
        assert receipt.get("penpot_mutations") == 0
        found[key] = {
            "package_id": package_id,
            "revision": revision,
            "path": str(path),
            "receipt_identity": identity(path.read_bytes()),
            "exact_package_tuple": receipt.get("exact_package_tuple"),
            "materializer_adapter_tuple": receipt.get(
                "materializer_adapter_tuple"
            ),
        }
    assert set(found) == expected, (
        f"missing producer integration PASS receipts: {expected-set(found)}"
    )
    return [found[key] for key in sorted(found)]


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
        "producer_identities": evidence["producers"],
        "registry_identities": evidence["registries"],
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
        "marker": "F0_SHARED_BINDINGS_V4_PLAN_PASS",
        "immutable_inputs": immutable(
            package, package_identity, evidence, candidate_commit
        ),
        "target": package["target_penpot_page"],
        "producer_dependencies": evidence["producers"],
        "asset_registries": evidence["registries"],
        "binding_components": package["binding_components"],
        "specimen": package["materialization_entry_point"]["specimen"],
        "graph_validation": evidence["graph"],
        "expected": {
            "roots": package["expected_roots"],
            "components": package["expected_components"],
            "instances": package["expected_instances"],
        },
        "write_contract": {
            "writer": "D0/PUBLISH_ONLY",
            "five_dependency_integration_pass_receipts_required": True,
            "guard_before_every_mutation": True,
            "consumer_geometry_claimed": False,
            "consumer_defects_closed": False,
        },
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
            args.dependency_receipts_dir,
            args.run_id,
            args.lease_token,
            args.cancel_token,
            args.candidate_commit,
        )
    ), "execute requires adapter/dependency-receipts-dir/run/lease/cancel/candidate-commit"
    dependency_receipts = load_dependency_receipts(
        Path(args.dependency_receipts_dir).resolve(), package
    )
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
            "producer_integration_receipts": dependency_receipts,
            "registry_identities": evidence["registries"],
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
                "producer_integration_receipts": dependency_receipts,
                "registry_identities": evidence["registries"],
            },
        )
        component_ids.append(result["component_id"])

    specimen = package["materialization_entry_point"]["specimen"]
    guard(api, args, "binding-specimen")
    root = api.upsert_binding_specimen(
        file_id=target["file_id"],
        page_id=page_id,
        exact_name=specimen["name"],
        component_ids=component_ids,
        placements=specimen["placements"],
        metadata={
            "package_id": package["package_id"],
            "visual_defect_coverage": package["visual_defect_coverage"],
            "consumer_geometry_claimed": False,
            "consumer_defects_closed": False,
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
        "status": "IMPLEMENTED_PENDING_V0",
        "writer": "D0/PUBLISH",
        "immutable_inputs": immutable(
            package, package_identity, evidence, args.candidate_commit
        ),
        "dependency_integration_receipts": dependency_receipts,
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
            "producer_identities": evidence["producers"],
            "registry_identities": evidence["registries"],
            "dependency_integration_receipts": dependency_receipts,
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
    dependencies = receipt["dependency_integration_receipts"]
    assert len(dependencies) == 5
    assert all(item["receipt_identity"]["sha256"] for item in dependencies)
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
    assert provenance["accepted_consumer_root_geometry_claimed"] is False
    assert provenance["consumer_defects_closed"] is False


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("plan", "execute", "verify"))
    parser.add_argument("--repo")
    parser.add_argument("--package", default=DEFAULT_PACKAGE)
    parser.add_argument("--candidate-commit", required=True)
    parser.add_argument("--dependency-receipts-dir")
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
        marker = "F0_SHARED_BINDINGS_V4_PLAN_PASS"
    elif args.mode == "execute":
        result = execute(package, package_identity, evidence, args)
        marker = "F0_SHARED_BINDINGS_V4_EXECUTE_PASS"
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
        marker = "F0_SHARED_BINDINGS_V4_READBACK_PASS"

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
        print(f"F0_SHARED_BINDINGS_V4_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
