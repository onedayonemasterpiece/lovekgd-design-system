#!/usr/bin/env python3
"""Fail-closed producer/runtime contract for bounded F0 candidate pages.

F0 uses this module only to prepare and test immutable packages. A real Penpot
mutation remains D0/PUBLISH-only and requires a separately published
D0_INTEGRATION_RESULT_V2 PASS and a fresh ACTIVE writer marker.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import sys
from pathlib import Path
from typing import Any, Mapping

SCHEMA = "kenigevents.asp-package-integration-candidate.v3"
MARKER = "ASP_PACKAGE_INTEGRATION_CANDIDATE_V3"
TARGET_FILE_ID = "40e06342-8830-80d6-8008-8fc8a3a4cd4f"
READ_METHODS = (
    "current_file_id",
    "active_run",
    "protected_digest",
    "validate_file",
    "read_candidate",
    "find_component",
)
MUTATION_METHODS = (
    "ensure_page",
    "ensure_root",
    "create_component_shape",
    "make_component",
    "create_instance",
    "save_version",
    "export_root",
    "readback_candidate",
)

class ContractError(RuntimeError):
    pass


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def git_blob_sha1(data: bytes) -> str:
    header = f"blob {len(data)}\0".encode("ascii")
    return hashlib.sha1(header + data).hexdigest()


def load_json(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ContractError(f"JSON object required: {path}")
    return value


def _require(condition: bool, message: str) -> None:
    if not condition:
        raise ContractError(message)


def validate_manifest(manifest: Mapping[str, Any]) -> None:
    _require(manifest.get("schema_version") == SCHEMA, "wrong package schema")
    _require(manifest.get("marker") == MARKER, "wrong package marker")
    _require(manifest.get("owner") == "F0", "package owner must be F0")
    _require(manifest.get("state") == "READY_FOR_D0_INTEGRATE", "dishonest package state")
    _require(manifest.get("penpot_mutations_by_f0") == 0, "F0 Penpot mutation forbidden")
    target = manifest.get("target") or {}
    _require(target.get("file_id") == TARGET_FILE_ID, "wrong current Penpot file")
    page = target.get("page_name")
    root = target.get("root_name")
    _require(isinstance(page, str) and page.endswith(" · Candidate"), "exact candidate page required")
    _require(isinstance(root, str) and root.startswith("CANDIDATE_BUILD_NOT_ACCEPTED · "), "candidate root label required")
    _require(target.get("old_penpot_uuid_lineage") == 0, "old Penpot UUID lineage forbidden")
    _require(manifest.get("promotion_state") == "BLOCKED_UNTIL_NATIVE_DELTA_AND_V0_REVIEW", "candidate/promotion lifecycle collapsed")

    budget = manifest.get("page_budget") or {}
    managed = budget.get("managed_nodes")
    _require(isinstance(managed, int) and 1 <= managed <= 30, "small-page managed-node budget exceeded")
    _require(1 <= int(budget.get("family_count", 0)) <= 3, "small-page family budget exceeded")
    _require(1 <= int(budget.get("max_native_creates_per_call", 0)) <= 3, "native create batch must be bounded to <=3")

    expected = manifest.get("expected") or {}
    _require(expected.get("roots") == 1, "exactly one candidate root required")
    _require(expected.get("detached_instances") == 0, "detached instances forbidden")
    _require(expected.get("screenshot_shapes") == 0, "screenshot shapes forbidden")
    _require(expected.get("validation") == [], "validation must be []")
    _require(expected.get("second_run_created") == 0, "idempotent second run required")

    components = manifest.get("components") or []
    placements = manifest.get("placements") or []
    _require(isinstance(components, list) and components, "component contract required")
    _require(isinstance(placements, list) and placements, "placement contract required")
    component_ids = [c.get("id") for c in components]
    placement_ids = [p.get("id") for p in placements]
    _require(all(isinstance(x, str) and x for x in component_ids), "component stable IDs required")
    _require(all(isinstance(x, str) and x for x in placement_ids), "placement stable IDs required")
    _require(len(component_ids) == len(set(component_ids)), "duplicate component stable ID")
    _require(len(placement_ids) == len(set(placement_ids)), "duplicate placement stable ID")
    _require(all(p.get("component_id") in set(component_ids) for p in placements), "placement references foreign component")
    _require(expected.get("components") == len(components), "component count mismatch")
    _require(expected.get("instances") == len(placements), "instance count mismatch")
    _require(expected.get("linked_instances") == len(placements), "linked-instance count mismatch")

    sources = manifest.get("sources") or []
    source_ids = set()
    for source in sources:
        sid = source.get("id")
        _require(isinstance(sid, str) and sid and sid not in source_ids, "duplicate/missing source ID")
        source_ids.add(sid)
        kind = source.get("kind")
        _require(kind in {"git_file", "external_bytes", "literal_contract"}, f"unsupported source kind: {kind}")
        if kind == "git_file":
            for field in ("repository", "commit", "path", "git_blob_sha1", "bytes"):
                _require(source.get(field) not in (None, ""), f"git source missing {field}: {sid}")
            _require(len(str(source["commit"])) == 40 and len(str(source["git_blob_sha1"])) == 40, f"non-exact git tuple: {sid}")
        elif kind == "external_bytes":
            _require(isinstance(source.get("bytes"), int) and source["bytes"] > 0, f"external bytes missing: {sid}")
            _require(isinstance(source.get("sha256"), str) and len(source["sha256"]) == 64, f"external sha256 missing: {sid}")
        else:
            _require(isinstance(source.get("value"), (str, int, float, list, dict)), f"literal value missing: {sid}")

    for component in components:
        for sid in component.get("source_ids") or []:
            _require(sid in source_ids, f"component references foreign source: {sid}")
        _require(component.get("mode") in {"create", "existing"}, "component mode must be create|existing")

    immutable_files = manifest.get("immutable_files") or []
    _require(len(immutable_files) >= 3, "helper/runner/tests immutable tuples required")
    for item in immutable_files:
        for field in ("role", "path", "git_blob_sha1", "sha256", "bytes"):
            _require(item.get(field) not in (None, ""), f"immutable file missing {field}")
        _require(len(item["git_blob_sha1"]) == 40 and len(item["sha256"]) == 64, "non-exact immutable file hash")

    forbidden_text = canonical_json(manifest)
    for placeholder in ("TODO", "TBD", "COMPUTED_AND_BOUND", "ISSUE_BOUND_FROZEN_BRANCH_HEAD", "RESOLVE_OR_CREATE"):
        _require(placeholder not in forbidden_text, f"placeholder forbidden in immutable package: {placeholder}")


def _parse_assignments(values: list[str], label: str) -> dict[str, Path]:
    result: dict[str, Path] = {}
    for raw in values:
        key, sep, value = raw.partition("=")
        if not sep or not key or not value:
            raise ContractError(f"{label} must use key=/path: {raw}")
        result[key] = Path(value).resolve()
    return result


def verify_sources(
    manifest: Mapping[str, Any],
    source_roots: Mapping[str, Path],
    external_sources: Mapping[str, Path],
) -> dict[str, dict[str, Any]]:
    receipts: dict[str, dict[str, Any]] = {}
    for source in manifest.get("sources") or []:
        sid = source["id"]
        kind = source["kind"]
        if kind == "literal_contract":
            payload = canonical_json(source["value"]).encode("utf-8")
            digest = sha256_bytes(payload)
            expected = source.get("sha256")
            if expected:
                _require(digest == expected, f"literal contract drift: {sid}")
            receipts[sid] = {"kind": kind, "sha256": digest, "bytes": len(payload)}
            continue
        if kind == "git_file":
            root = source_roots.get(source["repository"])
            _require(root is not None, f"missing source root for {source['repository']}")
            path = root / source["path"]
        else:
            path = external_sources.get(sid)
            _require(path is not None, f"missing external source path: {sid}")
        _require(path.is_file(), f"source file missing: {sid}: {path}")
        data = path.read_bytes()
        _require(len(data) == source["bytes"], f"source byte-count drift: {sid}")
        actual_sha256 = sha256_bytes(data)
        if source.get("sha256"):
            _require(actual_sha256 == source["sha256"], f"source sha256 drift: {sid}")
        actual_blob = git_blob_sha1(data)
        if source.get("git_blob_sha1"):
            _require(actual_blob == source["git_blob_sha1"], f"source Git blob drift: {sid}")
        receipts[sid] = {
            "kind": kind,
            "path": str(path),
            "bytes": len(data),
            "sha256": actual_sha256,
            "git_blob_sha1": actual_blob,
        }
    return receipts


def build_plan(manifest: Mapping[str, Any]) -> dict[str, Any]:
    validate_manifest(manifest)
    plan = {
        "schema": "kenigevents.f0-small-page-plan.v1",
        "package_id": manifest["package_id"],
        "revision": manifest["revision"],
        "target": manifest["target"],
        "page_budget": manifest["page_budget"],
        "expected": manifest["expected"],
        "components": manifest["components"],
        "placements": manifest["placements"],
        "source_tuples": [
            {key: source[key] for key in sorted(source) if key not in {"notes"}}
            for source in manifest.get("sources") or []
        ],
        "dependencies": manifest.get("dependencies") or [],
        "producer_inputs": manifest.get("producer_inputs") or [],
    }
    plan["plan_sha256"] = sha256_bytes(canonical_json(plan).encode("utf-8"))
    return plan


def _require_adapter_surface(adapter: Any) -> None:
    for method in READ_METHODS + MUTATION_METHODS:
        _require(callable(getattr(adapter, method, None)), f"adapter method missing before first mutation: {method}")


def _shape_id(value: Any, label: str) -> str:
    if isinstance(value, Mapping):
        sid = value.get("id")
    else:
        sid = getattr(value, "id", None)
    _require(isinstance(sid, str) and sid, f"malformed adapter result before dependent mutation: {label}")
    return sid


def candidate_matches(manifest: Mapping[str, Any], readback: Mapping[str, Any] | None) -> bool:
    if not readback:
        return False
    expected = manifest["expected"]
    target = manifest["target"]
    return (
        readback.get("page_name") == target["page_name"]
        and readback.get("root_name") == target["root_name"]
        and readback.get("components") == expected["components"]
        and readback.get("instances") == expected["instances"]
        and readback.get("linked_instances") == expected["linked_instances"]
        and readback.get("detached_instances") == 0
        and readback.get("screenshot_shapes") == 0
        and readback.get("validation") == []
    )


def _verify_readback(manifest: Mapping[str, Any], readback: Mapping[str, Any]) -> None:
    _require(candidate_matches(manifest, readback), "candidate readback census mismatch")
    _require(readback.get("protected_digest_after") == manifest["protected_surface"]["sha256"], "protected surface drift")
    _require(int(readback.get("export_bytes", 0)) > 0, "empty native export")
    _require(isinstance(readback.get("export_sha256"), str) and len(readback["export_sha256"]) == 64, "export sha256 missing")


def execute(
    manifest: Mapping[str, Any],
    adapter: Any,
    source_roots: Mapping[str, Path],
    external_sources: Mapping[str, Path],
) -> dict[str, Any]:
    validate_manifest(manifest)
    _require_adapter_surface(adapter)
    # Byte/source preflight must finish before *any* adapter call, including ensure_page.
    source_receipts = verify_sources(manifest, source_roots, external_sources)
    _require(adapter.current_file_id() == manifest["target"]["file_id"], "wrong Penpot file")
    run = adapter.active_run()
    _require(isinstance(run, Mapping), "ACTIVE run receipt missing")
    _require(run.get("state") == "ACTIVE" and run.get("cancelled") is not True, "writer is not ACTIVE")
    _require(run.get("writer_id") == "/root/publish_r2", "wrong Penpot writer")
    _require(run.get("package_id") == manifest["package_id"], "wrong active package")
    protected_before = adapter.protected_digest()
    _require(protected_before == manifest["protected_surface"]["sha256"], "protected preflight drift")
    _require(adapter.validate_file() == [], "preflight validation must be []")
    existing = adapter.read_candidate(manifest["target"])
    if candidate_matches(manifest, existing):
        _verify_readback(manifest, existing)
        return {
            "schema": "kenigevents.f0-small-page-receipt.v1",
            "package_id": manifest["package_id"],
            "revision": manifest["revision"],
            "state": "CANDIDATE_READBACK_VERIFIED",
            "created": 0,
            "second_run_created": 0,
            "source_receipts": source_receipts,
            **dict(existing),
        }

    page = adapter.ensure_page(manifest["target"])
    _shape_id(page, "page")
    root = adapter.ensure_root(page, manifest["target"])
    _shape_id(root, "root")
    resolved_components: dict[str, Any] = {}
    for component in manifest["components"]:
        if component["mode"] == "existing":
            resolved = adapter.find_component(component)
            _shape_id(resolved, f"existing component {component['id']}")
        else:
            shape = adapter.create_component_shape(root, component, source_receipts)
            _shape_id(shape, f"component shape {component['id']}")
            # Explicit boundary: malformed factory shape can never reach make_component.
            resolved = adapter.make_component(shape, component)
            _shape_id(resolved, f"component {component['id']}")
        resolved_components[component["id"]] = resolved

    for placement in manifest["placements"]:
        instance = adapter.create_instance(root, resolved_components[placement["component_id"]], placement)
        _shape_id(instance, f"instance {placement['id']}")

    version = adapter.save_version(manifest["package_id"], manifest["revision"])
    version_id = _shape_id(version, "version")
    exported = adapter.export_root(root)
    _require(isinstance(exported, (bytes, bytearray)) and len(exported) > 0, "empty native export")
    readback = adapter.readback_candidate(manifest["target"])
    _require(isinstance(readback, Mapping), "candidate readback missing")
    readback = dict(readback)
    readback.setdefault("export_bytes", len(exported))
    readback.setdefault("export_sha256", sha256_bytes(bytes(exported)))
    readback.setdefault("protected_digest_after", adapter.protected_digest())
    _verify_readback(manifest, readback)
    _require(adapter.validate_file() == [], "post-readback validation must be []")
    return {
        "schema": "kenigevents.f0-small-page-receipt.v1",
        "package_id": manifest["package_id"],
        "revision": manifest["revision"],
        "state": "CANDIDATE_READBACK_VERIFIED",
        "created": 1 + 1 + sum(c["mode"] == "create" for c in manifest["components"]) + len(manifest["placements"]),
        "second_run_created": 0,
        "version_id": version_id,
        "source_receipts": source_receipts,
        **readback,
    }


def verify_receipt(manifest: Mapping[str, Any], receipt: Mapping[str, Any]) -> None:
    validate_manifest(manifest)
    _require(receipt.get("schema") == "kenigevents.f0-small-page-receipt.v1", "wrong receipt schema")
    _require(receipt.get("package_id") == manifest["package_id"], "receipt package mismatch")
    _require(receipt.get("revision") == manifest["revision"], "receipt revision mismatch")
    _require(receipt.get("state") == "CANDIDATE_READBACK_VERIFIED", "receipt not terminal")
    _require(receipt.get("second_run_created") == 0, "second run must create zero")
    _verify_readback(manifest, receipt)


def _load_adapter(spec: str) -> Any:
    path_text, sep, factory_name = spec.partition(":")
    if not sep:
        raise ContractError("adapter must be /path/module.py:factory")
    path = Path(path_text).resolve()
    module_spec = importlib.util.spec_from_file_location("f0_adapter", path)
    if module_spec is None or module_spec.loader is None:
        raise ContractError(f"cannot load adapter: {path}")
    module = importlib.util.module_from_spec(module_spec)
    module_spec.loader.exec_module(module)
    factory = getattr(module, factory_name, None)
    if not callable(factory):
        raise ContractError(f"adapter factory missing: {factory_name}")
    adapter = factory()
    _require_adapter_surface(adapter)
    return adapter


def cli(package_path: Path) -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    for name in ("plan", "execute"):
        p = sub.add_parser(name)
        p.add_argument("--source-root", action="append", default=[])
        p.add_argument("--external-source", action="append", default=[])
        p.add_argument("--output", required=True)
        if name == "execute":
            p.add_argument("--adapter", required=True)
    p_verify = sub.add_parser("verify")
    p_verify.add_argument("--receipt", required=True)
    args = parser.parse_args()
    manifest = load_json(package_path)
    if args.command == "verify":
        verify_receipt(manifest, load_json(Path(args.receipt)))
        print("F0_SMALL_PAGE_VERIFY_PASS")
        return 0
    roots = _parse_assignments(args.source_root, "--source-root")
    external = _parse_assignments(args.external_source, "--external-source")
    if args.command == "plan":
        sources = verify_sources(manifest, roots, external)
        value = {**build_plan(manifest), "source_receipts": sources}
        Path(args.output).write_text(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        print("F0_SMALL_PAGE_PLAN_PASS")
        return 0
    adapter = _load_adapter(args.adapter)
    receipt = execute(manifest, adapter, roots, external)
    Path(args.output).write_text(json.dumps(receipt, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print("F0_SMALL_PAGE_EXECUTE_PASS")
    return 0
