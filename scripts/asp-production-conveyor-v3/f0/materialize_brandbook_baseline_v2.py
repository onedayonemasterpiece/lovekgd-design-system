#!/usr/bin/env python3
"""Executable brandbook baseline materializer for F-BRANDBOOK-BASELINE v2.

Brand identities are resolved from the immutable v1 inventory, then verified
against an exact events-bot-new checkout before any Penpot write. `plan` is
read-only; `execute` is D0/PUBLISH-only and checks ACTIVE lease/cancel before
every mutation; `verify` validates the ASP_BUILD_RESULT_V2 receipt.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib
import json
from pathlib import Path
import subprocess
import sys
from typing import Any, Iterator

DEFAULT_PACKAGE = (
    "catalog/asp-production-conveyor-v3/f0/"
    "F-BRANDBOOK-BASELINE.package.v2.json"
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
    assert package["package_id"] == "F-BRANDBOOK-BASELINE"
    assert package["revision"] == 2
    assert package["status"] in {"READY_FOR_D0_INTEGRATE", "READY_TO_PUBLISH"}
    return package, package_identity


def walk(value: Any, path: tuple[str, ...] = ()) -> Iterator[tuple[tuple[str, ...], dict[str, Any]]]:
    if isinstance(value, dict):
        yield path, value
        for key, child in value.items():
            yield from walk(child, path + (str(key),))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, path + (str(index),))


def normalized_path(path: tuple[str, ...]) -> str:
    return ".".join(path).lower().replace("-", "_")


def record_field(record: dict[str, Any], *names: str) -> Any:
    for name in names:
        if record.get(name) is not None:
            return record[name]
    return None


def resolve_assets(
    source: dict[str, Any], registry: dict[str, Any]
) -> list[dict[str, Any]]:
    resolved: list[dict[str, Any]] = []
    records = list(walk(source))
    for entry in registry["assets"]:
        candidates = [item.lower().replace("-", "_") for item in entry["inventory_json_key_candidates"]]
        matches: dict[tuple[str, str], tuple[tuple[str, ...], dict[str, Any]]] = {}
        for path, record in records:
            path_text = normalized_path(path)
            if not any(candidate in path_text for candidate in candidates):
                continue
            source_path = record_field(record, "path", "source_path", "asset_path")
            sha256 = record_field(record, "sha256", "content_sha256")
            blob = record_field(record, "git_blob_sha1", "blob_sha1", "git_blob")
            if not (isinstance(source_path, str) and isinstance(sha256, str) and isinstance(blob, str)):
                continue
            matches[(source_path, sha256)] = (path, record)
        assert len(matches) == 1, (
            f"{entry['asset_id']}: expected one immutable inventory record, "
            f"found {len(matches)}"
        )
        (_, _), (json_path, record) = next(iter(matches.items()))
        item = {
            **entry,
            "inventory_json_path": ".".join(json_path),
            "source_path": record_field(record, "path", "source_path", "asset_path"),
            "sha256": record_field(record, "sha256", "content_sha256"),
            "git_blob_sha1": record_field(record, "git_blob_sha1", "blob_sha1", "git_blob"),
            "bytes": record_field(record, "bytes", "size", "byte_count"),
            "view_box_or_intrinsic_size": record_field(
                record, "view_box_or_intrinsic_size", "viewBox", "intrinsic_size"
            ),
        }
        resolved.append(item)
    assert len(resolved) == 3
    assert len({item["asset_id"] for item in resolved}) == 3
    return resolved


def validate_inputs(
    repo: Path, package: dict[str, Any]
) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any], list[dict[str, Any]]]:
    source, source_identity = load_json(repo, package["source_package"]["path"])
    assert source_identity["git_blob_sha1"] == package["source_package"]["git_blob_sha1"]
    assert source_identity["bytes"] == package["source_package"]["bytes"]
    assert source["package_id"] == package["package_id"]

    registry, registry_identity = load_json(
        repo, package["source_authority"]["asset_registry"]["path"]
    )
    expected_registry = package["source_authority"]["asset_registry"]
    if expected_registry.get("git_blob_sha1"):
        assert registry_identity["git_blob_sha1"] == expected_registry["git_blob_sha1"]
    assert registry["registry_id"] == "kenigevents.ui-assets.brand.v1"
    assert registry["status"] == "CANDIDATE_RESOLUTION_RECIPE_PENDING_D0_INTEGRATE"
    resolved = resolve_assets(source, registry)

    assert len(package["brand_components"]) == 5
    placements = package["materialization_entry_point"]["specimen"]["placements"]
    assert len(placements) == 14
    assert len({item["id"] for item in placements}) == 14
    assert package["expected_roots"] == 1
    assert package["expected_components"] == 5
    assert package["expected_instances"] == 14
    return source_identity, registry_identity, registry, resolved


def checkout_head(repo: Path) -> str:
    result = subprocess.run(
        ["git", "-C", str(repo), "rev-parse", "HEAD"],
        check=True,
        text=True,
        capture_output=True,
    )
    return result.stdout.strip()


def verify_asset_checkout(
    asset_repo: Path, expected_commit: str, resolved: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    assert checkout_head(asset_repo) == expected_commit, (
        f"asset checkout must be exactly {expected_commit}"
    )
    verified: list[dict[str, Any]] = []
    for item in resolved:
        path = asset_repo / item["source_path"]
        data = path.read_bytes()
        actual = identity(data)
        assert actual["sha256"] == item["sha256"], item["asset_id"]
        assert actual["git_blob_sha1"] == item["git_blob_sha1"], item["asset_id"]
        if item.get("bytes") is not None:
            assert actual["bytes"] == item["bytes"], item["asset_id"]
        verified.append({"asset_id": item["asset_id"], "source_path": item["source_path"], **actual})
    return verified


def immutable(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    source_identity: dict[str, Any],
    registry_identity: dict[str, Any],
    resolved: list[dict[str, Any]],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        **package["immutable_identity"],
        "candidate_commit": candidate_commit,
        "package_identity": package_identity,
        "source_package_identity": source_identity,
        "registry_identity": registry_identity,
        "resolved_asset_identity": [
            {
                "asset_id": item["asset_id"],
                "source_path": item["source_path"],
                "sha256": item["sha256"],
                "git_blob_sha1": item["git_blob_sha1"],
                "bytes": item.get("bytes"),
            }
            for item in resolved
        ],
    }


def load_adapter(spec: str) -> Any:
    assert ":" in spec, "--adapter must be module:factory"
    module_name, factory_name = spec.split(":", 1)
    api = getattr(importlib.import_module(module_name), factory_name)()
    required = (
        "read_document",
        "assert_active_lease",
        "ensure_page",
        "upsert_svg_asset_component",
        "upsert_brand_lockup_component",
        "upsert_brandbook_specimen",
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
    registry_identity: dict[str, Any],
    resolved: list[dict[str, Any]],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        "marker": "F0_BRANDBOOK_PLAN_PASS",
        "immutable_inputs": immutable(
            package,
            package_identity,
            source_identity,
            registry_identity,
            resolved,
            candidate_commit,
        ),
        "target": package["target_penpot_page"],
        "resolved_asset_registry": resolved,
        "components": package["brand_components"],
        "specimen": package["materialization_entry_point"]["specimen"],
        "expected": {
            "roots": package["expected_roots"],
            "components": package["expected_components"],
            "instances": package["expected_instances"],
        },
        "write_contract": {
            "writer": "D0/PUBLISH_ONLY",
            "exact_asset_checkout_required": True,
            "guard_before_every_mutation": True,
            "consumer_geometry_claimed": False,
        },
    }


def execute(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    source_identity: dict[str, Any],
    registry_identity: dict[str, Any],
    resolved: list[dict[str, Any]],
    args: argparse.Namespace,
) -> dict[str, Any]:
    assert all(
        (
            args.adapter,
            args.asset_repo,
            args.run_id,
            args.lease_token,
            args.cancel_token,
            args.candidate_commit,
        )
    ), "execute requires adapter/asset-repo/run/lease/cancel/candidate-commit"
    asset_repo = Path(args.asset_repo).resolve()
    verified_assets = verify_asset_checkout(
        asset_repo,
        package["source_authority"]["asset_repository"]["commit"],
        resolved,
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
            "source_package_blob_sha1": source_identity["git_blob_sha1"],
            "registry_blob_sha1": registry_identity["git_blob_sha1"],
        },
    )
    page_id = page["page_id"]

    asset_component_ids: dict[str, str] = {}
    for item in resolved:
        guard(api, args, f"asset:{item['asset_id']}")
        result = api.upsert_svg_asset_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=item["penpot_consumer"]["asset_component_name"],
            svg_bytes=(asset_repo / item["source_path"]).read_bytes(),
            metadata={
                **item,
                "package_id": package["package_id"],
                "asset_repository_commit": package["source_authority"][
                    "asset_repository"
                ]["commit"],
            },
        )
        asset_component_ids[item["asset_id"]] = result["component_id"]

    lockup_component_ids: list[str] = []
    for component in package["brand_components"]:
        if component["kind"] != "lockup":
            continue
        guard(api, args, f"lockup:{component['id']}")
        result = api.upsert_brand_lockup_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=component["penpot_name"],
            linked_asset_component_ids={
                asset_id: asset_component_ids[asset_id]
                for asset_id in component["asset_ids"]
            },
            component_spec=component,
            metadata={
                "package_id": package["package_id"],
                "source_component": component["source_component"],
                "detached_assets": False,
            },
        )
        lockup_component_ids.append(result["component_id"])

    all_component_ids = list(asset_component_ids.values()) + lockup_component_ids
    specimen = package["materialization_entry_point"]["specimen"]
    guard(api, args, "specimen-root")
    root = api.upsert_brandbook_specimen(
        file_id=target["file_id"],
        page_id=page_id,
        exact_name=specimen["name"],
        component_ids=all_component_ids,
        placements=specimen["placements"],
        misuse_rules=package["misuse_rules"],
        metadata={
            "package_id": package["package_id"],
            "resolved_registry": [
                {
                    "asset_id": item["asset_id"],
                    "source_path": item["source_path"],
                    "sha256": item["sha256"],
                    "git_blob_sha1": item["git_blob_sha1"],
                }
                for item in resolved
            ],
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
        shape_ids=all_component_ids + [root_id],
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
            package,
            package_identity,
            source_identity,
            registry_identity,
            resolved,
            args.candidate_commit,
        ),
        "run_control": {
            "run_id": args.run_id,
            "lease_token_sha256": hashlib.sha256(args.lease_token.encode()).hexdigest(),
            "cancel_token_sha256": hashlib.sha256(args.cancel_token.encode()).hexdigest(),
            "guard_before_every_mutation": True,
        },
        "asset_verification": {
            "checkout_commit": checkout_head(asset_repo),
            "before_any_asset_mutation": True,
            "assets": verified_assets,
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
            "components": len(all_component_ids),
            "instances": readback.get("instance_count"),
            "detached_instances": readback.get("detached_instance_count"),
            "screenshot_shapes": readback.get("screenshot_shape_count"),
        },
        "created_or_reused": {
            "asset_component_ids": asset_component_ids,
            "lockup_component_ids": lockup_component_ids,
            "root_id": root_id,
        },
        "validation": validation,
        "export": export,
        "provenance_receipt": {
            "contract_sha256": package["source_authority"]["requirements_contract"][
                "sha256"
            ],
            "package_git_blob_sha1": package_identity["git_blob_sha1"],
            "source_package_git_blob_sha1": source_identity["git_blob_sha1"],
            "registry_git_blob_sha1": registry_identity["git_blob_sha1"],
            "resolved_asset_identity": [
                {
                    "asset_id": item["asset_id"],
                    "source_path": item["source_path"],
                    "sha256": item["sha256"],
                    "git_blob_sha1": item["git_blob_sha1"],
                }
                for item in resolved
            ],
            "geometry_scope": "standalone brandbook baseline board",
            "accepted_consumer_root_geometry_claimed": False,
        },
    }


def verify(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    source_identity: dict[str, Any],
    registry_identity: dict[str, Any],
    resolved: list[dict[str, Any]],
    candidate_commit: str,
    receipt: dict[str, Any],
) -> None:
    assert receipt["marker"] == "ASP_BUILD_RESULT_V2"
    assert receipt["package_id"] == package["package_id"]
    assert receipt["package_revision"] == package["revision"]
    assert receipt["writer"] == "D0/PUBLISH"
    assert receipt["immutable_inputs"] == immutable(
        package,
        package_identity,
        source_identity,
        registry_identity,
        resolved,
        candidate_commit,
    )
    assert receipt["asset_verification"]["before_any_asset_mutation"] is True
    expected_assets = {
        (item["asset_id"], item["sha256"], item["git_blob_sha1"])
        for item in resolved
    }
    actual_assets = {
        (item["asset_id"], item["sha256"], item["git_blob_sha1"])
        for item in receipt["asset_verification"]["assets"]
    }
    assert actual_assets == expected_assets
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
    assert receipt["provenance_receipt"][
        "accepted_consumer_root_geometry_claimed"
    ] is False


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("plan", "execute", "verify"))
    parser.add_argument("--repo")
    parser.add_argument("--package", default=DEFAULT_PACKAGE)
    parser.add_argument("--candidate-commit", required=True)
    parser.add_argument("--asset-repo")
    parser.add_argument("--adapter")
    parser.add_argument("--run-id")
    parser.add_argument("--lease-token")
    parser.add_argument("--cancel-token")
    parser.add_argument("--receipt")
    parser.add_argument("--output")
    args = parser.parse_args()

    repo = Path(args.repo).resolve() if args.repo else Path(__file__).resolve().parents[3]
    package, package_identity = load_package(repo, args.package)
    source_identity, registry_identity, _, resolved = validate_inputs(repo, package)

    if args.mode == "plan":
        result = build_plan(
            package,
            package_identity,
            source_identity,
            registry_identity,
            resolved,
            args.candidate_commit,
        )
        marker = "F0_BRANDBOOK_PLAN_PASS"
    elif args.mode == "execute":
        result = execute(
            package,
            package_identity,
            source_identity,
            registry_identity,
            resolved,
            args,
        )
        marker = "F0_BRANDBOOK_EXECUTE_PASS"
    else:
        assert args.receipt, "verify requires --receipt"
        receipt = json.loads(Path(args.receipt).read_text(encoding="utf-8"))
        verify(
            package,
            package_identity,
            source_identity,
            registry_identity,
            resolved,
            args.candidate_commit,
            receipt,
        )
        result = {
            "status": "READBACK_VERIFIED",
            "immutable_inputs": immutable(
                package,
                package_identity,
                source_identity,
                registry_identity,
                resolved,
                args.candidate_commit,
            ),
        }
        marker = "F0_BRANDBOOK_READBACK_PASS"

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
        subprocess.CalledProcessError,
        TypeError,
        json.JSONDecodeError,
    ) as exc:
        print(f"F0_BRANDBOOK_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
