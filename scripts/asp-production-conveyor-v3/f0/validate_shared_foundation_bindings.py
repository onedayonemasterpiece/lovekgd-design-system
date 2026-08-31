#!/usr/bin/env python3
"""Fail-closed validator for the F0 shared-foundation binding candidate."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import sys
from typing import Any


REQUIRED_REGISTRY_FIELDS = (
    "asset_id",
    "semantic_slot",
    "authoritative_repository",
    "source_commit",
    "source_path",
    "git_blob_sha1",
    "sha256",
    "media_type",
    "view_box_or_intrinsic_size",
    "nominal_box",
    "fill_stroke_contract",
    "astro_consumer",
    "penpot_consumer",
    "provenance",
    "licence_or_reuse_status",
    "owner_disposition",
)

ALLOWED_EDGE_KINDS = {
    "primitive>semantic",
    "semantic>component",
    "component>pattern",
    "pattern>archetype",
    "asset>component",
    "semantic>specimen",
    "asset>specimen",
}

FORBIDDEN_DIRECT_TARGET_KINDS = {"component", "pattern", "archetype"}


def fail(message: str) -> None:
    raise AssertionError(message)


def file_identity(path: Path) -> dict[str, Any]:
    data = path.read_bytes()
    header = f"blob {len(data)}\0".encode("ascii")
    return {
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "git_blob_sha1": hashlib.sha1(header + data).hexdigest(),
    }


def require_identity(repo: Path, record: dict[str, Any], label: str) -> None:
    path = repo / record["path"]
    if not path.is_file():
        fail(f"{label}: missing {record['path']}")
    actual = file_identity(path)
    for field in ("bytes", "sha256", "git_blob_sha1"):
        expected = record.get(field)
        if expected is not None and actual[field] != expected:
            fail(
                f"{label}: {field} mismatch for {record['path']}: "
                f"expected {expected}, got {actual[field]}"
            )


def registry_asset_section(text: str, asset_id: str) -> str:
    try:
        assets = text.split("\nassets:\n", 1)[1]
    except IndexError as exc:
        raise AssertionError("registry: missing top-level assets mapping") from exc
    assets = assets.split("\nintegration_gate:\n", 1)[0]
    marker = f"  {asset_id}:\n"
    start = assets.find(marker)
    if start < 0:
        fail(f"registry: missing asset section {asset_id}")
    tail = assets[start + len(marker) :]
    next_asset = re.search(r"(?m)^  icon\.[^\n]+:\n", tail)
    return tail[: next_asset.start()] if next_asset else tail


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--manifest",
        default="catalog/asp-production-conveyor-v3/f0/"
        "F-SHARED-FOUNDATION-BINDINGS.package.v1.json",
    )
    parser.add_argument("--repo", default=None)
    args = parser.parse_args()

    repo = (
        Path(args.repo).resolve()
        if args.repo
        else Path(__file__).resolve().parents[3]
    )
    manifest_path = (repo / args.manifest).resolve()
    if not manifest_path.is_file():
        fail(f"manifest missing: {manifest_path}")

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("package_id") != "F-SHARED-FOUNDATION-BINDINGS":
        fail("manifest: wrong package_id")
    if manifest.get("owner") != "F0":
        fail("manifest: wrong owner")
    if manifest.get("status") not in {
        "READY_FOR_D0_INTEGRATE",
        "READY_TO_PUBLISH",
    }:
        fail("manifest: invalid candidate lifecycle status")

    assets = manifest["assets_and_hashes"]
    registry_record = assets["registry"]
    require_identity(repo, registry_record, "registry")
    registry_text = (repo / registry_record["path"]).read_text(encoding="utf-8")

    required_ids = manifest["validation"]["required_asset_registry_ids"]
    if sorted(required_ids) != sorted(
        [
            "icon.action.not_interested",
            "icon.action.calendar_add",
            "icon.action.share",
            "icon.action.favorite",
        ]
    ):
        fail("manifest: required free-collection asset set changed")

    for asset_id in required_ids:
        section = registry_asset_section(registry_text, asset_id)
        for field in REQUIRED_REGISTRY_FIELDS:
            if re.search(rf"(?m)^\s{{4}}{re.escape(field)}:", section) is None:
                fail(f"registry: {asset_id} missing required field {field}")
        if "status: RESOLVED_CANDIDATE_PENDING_INTEGRATE" not in section:
            fail(f"registry: {asset_id} is not a resolved candidate")
        if "owner_disposition: APPROVED_CURRENT_ASTRO_AS_IS_REFERENCE" not in section:
            fail(f"registry: {asset_id} lacks F0 owner disposition")

    for record in assets["physical_assets"]:
        require_identity(repo, record, "physical asset")

    producer_ids: set[str] = set()
    for record in assets["producer_packages"]:
        require_identity(repo, record, "producer package")
        producer = json.loads((repo / record["path"]).read_text(encoding="utf-8"))
        if producer.get("package_id") != record["package_id"]:
            fail(f"producer package ID mismatch: {record['path']}")
        producer_ids.add(record["package_id"])

    expected_producers = {
        "F-ACTION-NAV-ICONS",
        "F-MEDALLIONS-BRAND-ASSETS",
        "F-FOUNDATIONS-SPECIMENS",
        "F-TYPOGRAPHY-LAYOUT",
        "F-BRANDBOOK-BASELINE",
    }
    if producer_ids != expected_producers:
        fail(
            "producer package coverage mismatch: "
            f"expected {sorted(expected_producers)}, got {sorted(producer_ids)}"
        )

    graph = manifest["binding_graph"]
    node_kinds = {node["id"]: node["kind"] for node in graph["nodes"]}
    if len(node_kinds) != len(graph["nodes"]):
        fail("binding graph: duplicate node ID")

    for edge in graph["edges"]:
        source = edge["from"]
        target = edge["to"]
        if source not in node_kinds or target not in node_kinds:
            fail(f"binding graph: dangling edge {source} -> {target}")
        pair = f"{node_kinds[source]}>{node_kinds[target]}"
        if pair not in ALLOWED_EDGE_KINDS:
            fail(f"binding graph: forbidden edge kind {pair}: {source} -> {target}")
        if (
            node_kinds[source] == "primitive"
            and node_kinds[target] in FORBIDDEN_DIRECT_TARGET_KINDS
        ):
            fail(f"binding graph: direct primitive coupling {source} -> {target}")

    required_consumers = set(manifest["validation"]["required_consumer_ids"])
    actual_consumers = {
        binding["consumer_id"] for binding in manifest["consumer_bindings"]
    }
    missing_consumers = required_consumers - actual_consumers
    if missing_consumers:
        fail(f"consumer coverage missing: {sorted(missing_consumers)}")

    aliases = manifest["compatibility_aliases"]
    for alias in aliases:
        if alias["migration"] != "NO_OP_VALUE_PRESERVING":
            fail(f"alias is not no-op: {alias['from']}")

    if manifest["materialization_entry_point"]["penpot_write_authority"] != "D0/PUBLISH_ONLY":
        fail("manifest: unauthorized Penpot writer")
    if manifest["materialization_entry_point"]["requires_integrate_pass"] is not True:
        fail("manifest: fail-closed INTEGRATE gate missing")

    print(
        "F0_SHARED_FOUNDATION_BINDINGS_VALIDATION_PASS "
        + json.dumps(
            {
                "manifest": str(manifest_path.relative_to(repo)),
                "registry_sha256": registry_record["sha256"],
                "required_assets": len(required_ids),
                "producer_packages": len(producer_ids),
                "graph_nodes": len(graph["nodes"]),
                "graph_edges": len(graph["edges"]),
                "consumer_bindings": len(actual_consumers),
            },
            ensure_ascii=False,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, KeyError, json.JSONDecodeError, OSError) as exc:
        print(f"F0_SHARED_FOUNDATION_BINDINGS_VALIDATION_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
