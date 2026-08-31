#!/usr/bin/env python3
"""Executable F0 action/navigation package runner.

`plan` is Git-only. `execute` is permitted only to D0/PUBLISH through a
native adapter and checks lease/cancel before every mutation. `verify` checks
the resulting ASP_BUILD_RESULT_V2 receipt without contacting Penpot.
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
    "F-ACTION-NAV-ICONS.package.v2.json"
)


def ident(data: bytes) -> dict[str, Any]:
    return {
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "git_blob_sha1": hashlib.sha1(
            f"blob {len(data)}\0".encode() + data
        ).hexdigest(),
    }


def load(repo: Path, rel: str) -> tuple[Path, dict[str, Any], dict[str, Any]]:
    path = repo / rel
    data = path.read_bytes()
    package = json.loads(data)
    assert package["package_id"] == "F-ACTION-NAV-ICONS"
    assert package["status"] in {"READY_FOR_D0_INTEGRATE", "READY_TO_PUBLISH"}
    return path, package, ident(data)


def validate_assets(repo: Path, package: dict[str, Any]) -> list[dict[str, Any]]:
    expected = {
        ("icon.action.not_interested", "default"),
        ("icon.action.calendar_add", "default"),
        ("icon.action.share", "default"),
        ("icon.action.favorite", "outline"),
        ("icon.action.favorite", "solid"),
        ("icon.navigation.afisha", "default"),
        ("icon.navigation.dates", "default"),
        ("icon.navigation.search", "default"),
        ("icon.navigation.personal", "default"),
    }
    seen: set[tuple[str, str]] = set()
    out: list[dict[str, Any]] = []
    for item in package["assets_and_hashes"]:
        key = (item["asset_id"], item["variant"])
        assert key not in seen, f"duplicate {key}"
        seen.add(key)
        data = (repo / item["path"]).read_bytes()
        actual = ident(data)
        for field in ("bytes", "sha256", "git_blob_sha1"):
            assert item[field] == actual[field], (
                f"{key} {field}: {item[field]} != {actual[field]}"
            )
        assert data.startswith(b"<svg ") and data.endswith(b"</svg>\n")
        out.append({"asset_id": key[0], "variant": key[1], **actual})
    assert seen == expected, f"coverage: missing={expected-seen}, extra={seen-expected}"
    return out


def immutable(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    return {
        **package["immutable_identity"],
        "candidate_commit": candidate_commit,
        "package_identity": package_identity,
    }


def adapter(spec: str) -> Any:
    assert ":" in spec, "--adapter must be module:factory"
    module, factory = spec.split(":", 1)
    result = getattr(importlib.import_module(module), factory)()
    required = (
        "read_document",
        "assert_active_lease",
        "ensure_page",
        "upsert_svg_component",
        "upsert_specimen",
        "validate",
        "export_png",
        "readback",
    )
    assert all(callable(getattr(result, name, None)) for name in required)
    return result


def guard(api: Any, args: argparse.Namespace, label: str) -> None:
    state = api.assert_active_lease(
        run_id=args.run_id,
        lease_token=args.lease_token,
        cancel_token=args.cancel_token,
    )
    assert state.get("active") is True, f"inactive before {label}: {state}"
    assert state.get("cancelled") is not True, f"cancelled before {label}: {state}"


def plan(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    candidate_commit: str,
) -> dict[str, Any]:
    groups: dict[str, list[dict[str, Any]]] = {}
    for item in package["assets_and_hashes"]:
        groups.setdefault(item["component_name"], []).append(
            {
                "asset_id": item["asset_id"],
                "variant": item["variant"],
                "path": item["path"],
                "sha256": item["sha256"],
            }
        )
    return {
        "marker": "F0_ACTION_NAV_PLAN_V2",
        "immutable_inputs": immutable(package, package_identity, candidate_commit),
        "target": package["target_penpot_page"],
        "components": [
            {"name": name, "variants": sorted(items, key=lambda x: x["variant"])}
            for name, items in sorted(groups.items())
        ],
        "specimens": package["materialization_entry_point"]["specimens"],
        "expected": {
            "roots": package["expected_roots"],
            "components": package["expected_components"],
            "instances": package["expected_instances"],
        },
        "write_contract": {
            "writer": "D0/PUBLISH_ONLY",
            "guard_before_every_mutation": True,
            "rejected_root_mutation": False,
        },
    }


def execute(
    repo: Path,
    package: dict[str, Any],
    package_identity: dict[str, Any],
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
    api = adapter(args.adapter)
    target = package["target_penpot_page"]
    before = api.read_document(file_id=target["file_id"])

    guard(api, args, "ensure_page")
    page = api.ensure_page(
        file_id=target["file_id"],
        exact_name=target["exact_name"],
        metadata={
            "package_id": package["package_id"],
            "candidate_commit": args.candidate_commit,
            "package_blob_sha1": package_identity["git_blob_sha1"],
        },
    )
    page_id = page["page_id"]

    groups: dict[str, list[dict[str, Any]]] = {}
    for item in package["assets_and_hashes"]:
        groups.setdefault(item["component_name"], []).append(item)

    component_ids: list[str] = []
    for name, items in sorted(groups.items()):
        guard(api, args, f"component:{name}")
        items = sorted(items, key=lambda x: x["variant"])
        result = api.upsert_svg_component(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=name,
            svg_bytes=(repo / items[0]["path"]).read_bytes(),
            variants=[
                {
                    "name": item["variant"],
                    "svg_bytes": (repo / item["path"]).read_bytes(),
                    "sha256": item["sha256"],
                }
                for item in items
            ],
            metadata={
                "package_id": package["package_id"],
                "canonical_id": items[0]["asset_id"],
                "source_commit": items[0]["source_commit"],
                "viewBox": items[0]["viewBox"],
                "nominal_box": items[0]["nominal_box"],
                "fill_stroke_contract": items[0]["fill_stroke_contract"],
                "variant_hashes": {
                    item["variant"]: item["sha256"] for item in items
                },
            },
        )
        component_ids.append(result["component_id"])

    specimen_ids: list[str] = []
    for item in package["materialization_entry_point"]["specimens"]:
        guard(api, args, f"specimen:{item['name']}")
        result = api.upsert_specimen(
            file_id=target["file_id"],
            page_id=page_id,
            exact_name=item["name"],
            component_ids=component_ids,
            metadata={
                "package_id": package["package_id"],
                "states": item["states"],
                "consumer": item["consumer"],
            },
        )
        specimen_ids.append(result["shape_id"])

    validation = api.validate(file_id=target["file_id"], page_id=page_id)
    assert validation.get("errors") in (None, [])

    exports: list[dict[str, Any]] = []
    for shape_id in specimen_ids:
        result = api.export_png(
            file_id=target["file_id"], shape_id=shape_id, scale=1.0
        )
        assert result.get("nonempty") is True
        exports.append(result)

    readback = api.readback(
        file_id=target["file_id"],
        page_id=page_id,
        shape_ids=component_ids + specimen_ids,
    )
    after = api.read_document(file_id=target["file_id"])
    return {
        "schema_version": "kenigevents.asp-build-result-v2",
        "marker": "ASP_BUILD_RESULT_V2",
        "package_id": package["package_id"],
        "status": "IMPLEMENTED_PENDING_D0_INTEGRATE_AND_V0",
        "writer": "D0/PUBLISH",
        "immutable_inputs": immutable(
            package, package_identity, args.candidate_commit
        ),
        "run_control": {
            "run_id": args.run_id,
            "lease_token_sha256": hashlib.sha256(
                args.lease_token.encode()
            ).hexdigest(),
            "cancel_token_sha256": hashlib.sha256(
                args.cancel_token.encode()
            ).hexdigest(),
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
        "revision": {
            "before": before.get("revision"),
            "after": after.get("revision"),
        },
        "created_or_reused": {
            "component_ids": component_ids,
            "specimen_shape_ids": specimen_ids,
        },
        "counts": {
            "roots": len(specimen_ids),
            "components": len(component_ids),
            "instances": readback.get("instance_count"),
            "detached_instances": readback.get("detached_instance_count"),
            "screenshot_shapes": readback.get("screenshot_shape_count"),
        },
        "asset_readback": readback.get("asset_metadata"),
        "validation": validation,
        "exports": exports,
        "provenance_receipt": {
            "contract_sha256": package["source_authority"][
                "requirements_contract"
            ]["sha256"],
            "registry_sha256": package["source_authority"]["asset_registry"][
                "sha256"
            ],
            "package_blob_sha1": package_identity["git_blob_sha1"],
            "geometry_scope": "standalone library only",
            "accepted_consumer_root_geometry_claimed": False,
        },
    }


def verify(
    package: dict[str, Any],
    package_identity: dict[str, Any],
    candidate_commit: str,
    receipt: dict[str, Any],
) -> None:
    assert receipt["marker"] == "ASP_BUILD_RESULT_V2"
    assert receipt["package_id"] == package["package_id"]
    assert receipt["writer"] == "D0/PUBLISH"
    assert receipt["immutable_inputs"] == immutable(
        package, package_identity, candidate_commit
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
    assert counts["components"] == package["expected_components"]
    assert counts["instances"] == package["expected_instances"]
    assert counts["detached_instances"] == 0
    assert counts["screenshot_shapes"] == 0
    assert receipt["validation"].get("errors") in (None, [])
    assert len(receipt["exports"]) == package["expected_roots"]
    assert all(item.get("nonempty") is True for item in receipt["exports"])
    provenance = receipt["provenance_receipt"]
    assert provenance["contract_sha256"] == package["source_authority"][
        "requirements_contract"
    ]["sha256"]
    assert provenance["registry_sha256"] == package["source_authority"][
        "asset_registry"
    ]["sha256"]
    assert provenance["accepted_consumer_root_geometry_claimed"] is False


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
    _, package, package_identity = load(repo, args.package)
    validated = validate_assets(repo, package)

    if args.mode == "plan":
        result = plan(package, package_identity, args.candidate_commit)
        result["validated_assets"] = validated
        marker = "F0_ACTION_NAV_PLAN_PASS"
    elif args.mode == "execute":
        result = execute(repo, package, package_identity, args)
        marker = "F0_ACTION_NAV_EXECUTE_PASS"
    else:
        assert args.receipt, "verify requires --receipt"
        receipt = json.loads(Path(args.receipt).read_text(encoding="utf-8"))
        verify(package, package_identity, args.candidate_commit, receipt)
        result = {
            "status": "READBACK_VERIFIED",
            "immutable_inputs": immutable(
                package, package_identity, args.candidate_commit
            ),
        }
        marker = "F0_ACTION_NAV_READBACK_PASS"

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
        print(f"F0_ACTION_NAV_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
