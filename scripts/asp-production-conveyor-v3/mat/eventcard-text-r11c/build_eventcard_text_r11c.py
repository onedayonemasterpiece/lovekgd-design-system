#!/usr/bin/env python3
"""Deterministically freeze the Git-only EventCard R11c compatible repair package."""
from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path
from typing import Any

PACKAGE_ID = "MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR"
REL = Path("catalog/asp-production-conveyor-v3/mat/eventcard-text-r11c")
SCRIPT_REL = Path("scripts/asp-production-conveyor-v3/mat/eventcard-text-r11c")
PACKAGE_REL = REL / "MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR.package.v1.json"
EXECUTOR_REL = REL / "native-repair-executor.v1.js"
READBACK_REL = REL / "distinct-later-readback.v1.js"
REQUEST_REL = REL / "ASP_BUILD_REQUEST_V2.json"
MANIFEST_REL = REL / "manifest.v1.json"
SOURCE_REL = SCRIPT_REL / "repair-spec.source.json"
EXECUTOR_TEMPLATE_REL = SCRIPT_REL / "executor.template.js"
READBACK_TEMPLATE_REL = SCRIPT_REL / "later-readback.template.js"
HARNESS_REL = SCRIPT_REL / "native_like_harness.mjs"
SELF_REL = SCRIPT_REL / "build_eventcard_text_r11c.py"

IMMUTABLE_INPUTS = [
    {
        "repository": "onedayonemasterpiece/lovekgd-design-system",
        "head": "65d69509313d7450328861d73a0458fb5f7e3c92",
        "tree": "b05a79c8f9ae76e1c19d1e7aa278c2bb41cbd47d",
        "path": "catalog/materialization-bundles/eventcard-free-slice.g4.ready-v1.json",
        "git_blob_sha1": "281101e1bbef92284eb3800302d2cbcd5a7018d7",
        "bytes": 4061,
        "sha256": "600362047b24df707712598c6ccf2b79047aad62a143afbfdb41daa103a5351d",
    },
    {
        "repository": "onedayonemasterpiece/lovekgd-design-system",
        "head": "c2d6ff107c632311d1c1d0cb1b74d7eb0a465b18",
        "tree": "ddff285e2a16f2f0590ac2964b27dedd853d4de8",
        "path": "catalog/asp-production-conveyor-v3/u0/U-EVENTCARD-FOUR-CASES.package.v1.json",
        "git_blob_sha1": "6496f9fdf2c19cce06c2a07d5b4d48061afe5522",
        "bytes": 20051,
        "sha256": "bf25934808144ba1a34c6676fdb4dd6147916713da783eaf7c7e50a61b196f81",
    },
]
CONTRACT = {
    "id": "kenigevents.asp-conformance",
    "version": "1.0.0",
    "repository": "onedayonemasterpiece/lovekgd-design-system",
    "commit": "7607143afc240b9f96abd51270ab82735aabf9bc",
    "tree": "805cf61ed020c15f1c7bc57dc891a0dca0145548",
    "path": "docs/product-governance/astro-sot-penpot-conformance.md",
    "git_blob_sha1": "1facf0b2ae80b114d9c8b028b5c22769982e3fb7",
    "bytes": 10969,
    "sha256": "75c70629f01f8d60fb98290fa2e6e8abc201fc84885339c16010bcd75ddd4289",
}


def canonical_bytes(value: Any) -> bytes:
    return (json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode()


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def git(repo: Path, *args: str) -> bytes:
    return subprocess.check_output(["git", *args], cwd=repo)


def verify_git_object(repo: Path, item: dict[str, Any]) -> None:
    ref = item.get("head", item.get("commit"))
    if not ref:
        raise SystemExit(f"missing Git ref for {item['path']}")
    tree = git(repo, "rev-parse", f"{ref}^{{tree}}").decode().strip()
    blob = git(repo, "rev-parse", f"{ref}:{item['path']}").decode().strip()
    data = git(repo, "show", f"{ref}:{item['path']}")
    actual = {"tree": tree, "git_blob_sha1": blob, "bytes": len(data), "sha256": sha256(data)}
    expected = {key: item[key] for key in actual}
    if actual != expected:
        raise SystemExit(f"immutable input drift for {item['path']}: expected={expected!r} actual={actual!r}")


def artifact(path: str, data: bytes) -> dict[str, Any]:
    return {"path": path, "bytes": len(data), "sha256": sha256(data)}


def build(repo: Path) -> dict[Path, bytes]:
    for item in IMMUTABLE_INPUTS:
        verify_git_object(repo, item)
    verify_git_object(repo, CONTRACT)
    source = json.loads((repo / SOURCE_REL).read_text())
    if source["package_id"] != PACKAGE_ID or len(source["targets"]) != 4 or len(source["protected_untargeted_offenders"]) != 16:
        raise SystemExit("repair spec cardinality/package drift")
    target_ids = sorted(row["id"] for row in source["targets"])
    protected_ids = sorted(row["id"] for row in source["protected_untargeted_offenders"])
    if set(target_ids) & set(protected_ids):
        raise SystemExit("target/protected overlap")
    card_ids = sorted({row["root_id"] for row in source["targets"]})
    if len(card_ids) != 4:
        raise SystemExit("target cases must bind four exact card roots")

    package_without_hash = {
        "schema_version": "kenigevents.mat-eventcard-text-r11c-compatible-repair-package.v1",
        "package_id": PACKAGE_ID,
        "state": "MAT_PACKAGE_READY_QA_INTEGRATE_GATED",
        "penpot_execution_authorized": False,
        "package_sha256_contract": "SHA-256 of canonical UTF-8 JSON with package_sha256 omitted; indent=2, sort_keys=true, terminal newline=true",
        "scope": {
            "lane_kind": "MAT_ONLY_REPAIR",
            "surface": "00 · Components · Free collection; exact four EventCard cases",
            "repair": "four remaining occurrence offenders compatible with the canary-proven fixed-to-auto-width plus exact self-character native-layout invalidation",
            "no_product_redesign": True,
            "media_changes": 0,
            "component_path_changes": 0,
            "penpot_reads_or_mutations_by_mat": 0,
        },
        "requirements_contract": CONTRACT,
        "immutable_inputs": IMMUTABLE_INPUTS,
        "authoritative_receipts": source["derivation"],
        "penpot_target": source["penpot_target"],
        "baseline_census": source["baseline_census"],
        "post_readback_census": source["post_readback_census"],
        "accepted_card_root_ids": card_ids,
        "proof_targets": source["proof_targets"],
        "target_ids": target_ids,
        "targets": source["targets"],
        "protected_untargeted_offender_ids": protected_ids,
        "protected_untargeted_offenders": source["protected_untargeted_offenders"],
        "operation": source["operation"],
        "settlement_timeout_ms": 5000,
        "mutation_allowlist": ["Text.growType fixed→auto-width", "Text.characters exact self-assignment", "target-local plugin evidence keys"],
        "mutation_denylist": ["media shapes, image data, fills or transforms", "component IDs, names, paths, mains or linked-instance lineage", "untargeted text properties or plugin data", "frames, parents, card roots, accepted root or page structure", "saveVersion, export, delete, clone, detach or second accepted root"],
        "stable_id_contract": {
            "capture_before_first_write": ["page roots", "accepted-root children and descendants", "local component id/name rows", "four card root IDs", "all 38 managed text IDs"],
            "distinct_later_readback": "must be byte/value identical to the snapshot persisted on every targeted text",
            "protected_free_collection_offenders": "all 16 exact untargeted rows retain IDs, parents, strings, growType, markers, frame and textBounds",
        },
        "stop_readback_contract": {
            "execution_terminal_only": "MUTATED_PENDING_DISTINCT_LATER_READBACK",
            "accepted_readback_terminal_only": "COMPATIBLE_OCCURRENCE_PEERS_MEASUREMENT_PASS",
            "unknown_or_partial_outcome": "STOP_NO_RETRY_NO_OTHER_ROLE_NO_SAVE_NO_EXPORT_NO_VISUAL_PASS; preserve the balanced undo block and perform exact native readback before any decision",
            "distinct_execution_required": True,
            "executor_replay_forbidden": True,
            "readback_mutations": 0,
        },
        "authorization_contract": {
            "current": "NOT_AUTHORIZED",
            "qa_exact_committed_bytes_pass_required": True,
            "integrate_same_tuple_pass_required": True,
            "separate_runtime_execution_authorization_required": True,
            "separate_distinct_later_readback_authorization_required": True,
            "sole_writer_not_assigned_by_this_package": True,
        },
        "terminal_recommendation": "QA validate exact committed bytes and native-like negative gates; INTEGRATE may issue a separate runtime authorization only for this exact package. Do not execute Penpot from MAT and do not claim whole-EventCard visual PASS.",
    }
    package_digest = sha256(canonical_bytes(package_without_hash))
    package = dict(package_without_hash, package_sha256=package_digest)
    package_data = canonical_bytes(package)

    executor_template = (repo / EXECUTOR_TEMPLATE_REL).read_text()
    readback_template = (repo / READBACK_TEMPLATE_REL).read_text()
    if executor_template.count("__PACKAGE_SHA256__") != 1 or readback_template.count("__PACKAGE_SHA256__") != 1:
        raise SystemExit("template placeholder cardinality drift")
    executor_data = executor_template.replace("__PACKAGE_SHA256__", package_digest).encode()
    readback_data = readback_template.replace("__PACKAGE_SHA256__", package_digest).encode()
    if not executor_data.endswith(b"\n") or not readback_data.endswith(b"\n"):
        raise SystemExit("generated JavaScript must end in newline")

    request = {
        "schema_version": "ASP_BUILD_REQUEST_V2",
        "request_id": "MAT-EVENTCARD-TEXT-R11C-COMPATIBLE-REPAIR-20260901-R1",
        "package_id": PACKAGE_ID,
        "state": "MAT_PACKAGE_READY_QA_INTEGRATE_GATED",
        "from": "MAT",
        "to": ["QA", "INTEGRATE"],
        "penpot_execution_authorized": False,
        "operation": "APPLY_CANARY_PROVEN_FIXED_TO_AUTO_WIDTH_NATIVE_LAYOUT_INVALIDATION_TO_FOUR_EXACT_OCCURRENCE_OFFENDERS_ONLY",
        "immutable_inputs": IMMUTABLE_INPUTS,
        "contract": CONTRACT,
        "required_artifacts": [
            artifact(PACKAGE_REL.as_posix(), package_data),
            artifact(EXECUTOR_REL.as_posix(), executor_data),
            artifact(READBACK_REL.as_posix(), readback_data),
        ],
        "required_commands": [
            f"python3 {SELF_REL} --repo . --check",
            "python3 -m unittest discover -s tests/asp-production-conveyor-v3/mat/eventcard-text-r11c -p 'test_*.py'",
            "node --test tests/asp-production-conveyor-v3/mat/eventcard-text-r11c/test_native_like_harness.mjs",
        ],
        "qa_gates": ["exact immutable Git objects", "deterministic regeneration", "four exact target IDs and 16 exact protected offender IDs", "mutation allowlist only", "unknown outcome stops without retry", "native-like success plus negative/tamper cases"],
        "integrate_gates": ["same package/executor/readback hashes", "clean exact-head worktree", "separate runtime execution and readback authorizations remain absent until explicit INTEGRATE decision"],
        "publish_handoff": {"included": False, "reason": "This Git-only MAT package is not execution authorization."},
        "terminal_on_success": "MAT_PACKAGE_READY_QA_INTEGRATE_GATED",
    }
    request_data = canonical_bytes(request)

    outputs: dict[Path, bytes] = {
        PACKAGE_REL: package_data,
        EXECUTOR_REL: executor_data,
        READBACK_REL: readback_data,
        REQUEST_REL: request_data,
    }
    source_artifacts = []
    for path in [SOURCE_REL, EXECUTOR_TEMPLATE_REL, READBACK_TEMPLATE_REL, HARNESS_REL, SELF_REL]:
        data = (repo / path).read_bytes()
        source_artifacts.append(artifact(path.as_posix(), data))
    manifest = {
        "schema_version": "kenigevents.mat-eventcard-text-r11c-manifest.v1",
        "package_id": PACKAGE_ID,
        "state": "MAT_PACKAGE_READY_QA_INTEGRATE_GATED",
        "penpot_execution_authorized": False,
        "generation_contract": {"encoding": "UTF-8", "indent": 2, "sort_keys": True, "terminal_newline": True, "dynamic_timestamps": False},
        "immutable_inputs": IMMUTABLE_INPUTS,
        "package_semantic_sha256": package_digest,
        "generated_artifacts": [artifact(path.as_posix(), data) for path, data in sorted(outputs.items(), key=lambda item: item[0].as_posix())],
        "generator_sources": source_artifacts,
        "regenerate": f"python3 {SELF_REL} --repo . --write",
        "verify": f"python3 {SELF_REL} --repo . --check",
        "terminal_recommendation": package["terminal_recommendation"],
    }
    outputs[MANIFEST_REL] = canonical_bytes(manifest)
    return outputs


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", default=".")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--write", action="store_true")
    mode.add_argument("--check", action="store_true")
    args = parser.parse_args()
    repo = Path(args.repo).resolve()
    outputs = build(repo)
    drift = []
    for rel, data in outputs.items():
        path = repo / rel
        if args.write:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
        elif not path.exists() or path.read_bytes() != data:
            drift.append(rel.as_posix())
    if drift:
        print("generated artifact drift: " + ", ".join(drift), file=sys.stderr)
        return 1
    print(json.dumps({"package_id": PACKAGE_ID, "mode": "write" if args.write else "check", "artifacts": [p.as_posix() for p in outputs], "state": "MAT_PACKAGE_READY_QA_INTEGRATE_GATED"}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
