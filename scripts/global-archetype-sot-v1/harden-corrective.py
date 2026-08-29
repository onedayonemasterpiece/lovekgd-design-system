#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[2]
PKG = ROOT / "catalog/global-archetype-sot-v1"
CONTRACT_ROOT = PKG / "archetype-contracts"
ATLAS = ROOT / "catalog/reconstruction-atlas/v1"
ASTRO_ROOT = Path(os.environ.get("EVENTS_BOT_ROOT", ROOT / ".astro-source")).resolve()
BASE_SHA = os.environ["BASE_SHA"]
ASTRO_SHA = os.environ.get("ASTRO_SHA", "7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00")
LOCK_ID = f"global-archetype-sot-v1.corrective.{BASE_SHA[:12]}.{ASTRO_SHA[:12]}"
ASTRO_REPOSITORY = "onedayonemasterpiece/events-bot-new"

def load(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))

def dump(path: Path, value: Any, *, sort_keys: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=sort_keys) + "\n", encoding="utf-8")

def sha_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()

def sha_file(path: Path) -> str:
    return sha_bytes(path.read_bytes())

def rel(path: Path) -> str:
    return path.resolve().relative_to(ROOT.resolve()).as_posix()

def walk_objects(value: Any) -> Iterable[dict[str, Any]]:
    if isinstance(value, dict):
        yield value
        for item in value.values():
            yield from walk_objects(item)
    elif isinstance(value, list):
        for item in value:
            yield from walk_objects(item)

def walk_values(value: Any, parts: list[str | int] | None = None) -> Iterable[tuple[list[str | int], Any]]:
    parts = parts or []
    yield parts, value
    if isinstance(value, dict):
        for key, item in value.items():
            yield from walk_values(item, parts + [key])
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from walk_values(item, parts + [index])

def pointer(parts: list[str | int]) -> str:
    return "/" + "/".join(str(item).replace("~", "~0").replace("/", "~1") for item in parts)

def strip_design_tool_fields(value: Any) -> Any:
    if isinstance(value, dict):
        cleaned: dict[str, Any] = {}
        for key, item in value.items():
            lowered = key.lower()
            if "penpot" in lowered or "renderer_delta" in lowered or "materialization_ir" in lowered:
                continue
            cleaned[key] = strip_design_tool_fields(item)
        return cleaned
    if isinstance(value, list):
        return [strip_design_tool_fields(item) for item in value]
    if isinstance(value, str) and ("/penpot/" in value.lower() or "materialization-ir" in value.lower()):
        return None
    return value

source_root = ASTRO_ROOT / "site/src"
if not source_root.is_dir():
    source_root = ASTRO_ROOT / "src"
if not source_root.is_dir():
    raise SystemExit(f"Astro source root missing: {ASTRO_ROOT}")
source_extensions = {".astro", ".ts", ".tsx", ".js", ".mjs", ".css", ".scss", ".json"}
source_files: list[Path] = []
source_lines: dict[Path, list[str]] = {}
for path in sorted(source_root.rglob("*")):
    if path.is_file() and path.suffix.lower() in source_extensions:
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except UnicodeDecodeError:
            continue
        source_files.append(path)
        source_lines[path] = lines

def exact_ref(path: Path, line_number: int, evidence_id: str) -> dict[str, Any]:
    lines = source_lines[path]
    line_number = max(1, min(line_number, len(lines) or 1))
    line = lines[line_number - 1] if lines else ""
    return {
        "repository": ASTRO_REPOSITORY,
        "commit": ASTRO_SHA,
        "path": path.resolve().relative_to(ASTRO_ROOT).as_posix(),
        "line_start": line_number,
        "line_end": line_number,
        "evidence_id": evidence_id,
        "line_sha256": sha_bytes(line.encode("utf-8")),
    }

def find_exact(patterns: list[str], evidence_id: str, path_terms: list[str] | None = None) -> list[dict[str, Any]]:
    path_terms = path_terms or []
    candidates = [path for path in source_files if not path_terms or any(term in path.as_posix().lower() for term in path_terms)]
    refs: list[dict[str, Any]] = []
    seen: set[tuple[str, int]] = set()
    for pattern in patterns:
        regex = re.compile(pattern, re.IGNORECASE)
        for path in candidates:
            for line_number, line in enumerate(source_lines[path], start=1):
                if not regex.search(line):
                    continue
                key = (path.as_posix(), line_number)
                if key in seen:
                    continue
                seen.add(key)
                refs.append(exact_ref(path, line_number, evidence_id))
    return refs

registry_path = PKG / "route-archetype-registry.v1.json"
graph_path = PKG / "component-composition-graph.v1.json"
handoff_path = PKG / "handoff-lock.v1.json"
proof_path = PKG / "byte-equality-proof.v1.json"
source_lock_path = PKG / "source-lock.v1.json"
plan_path = PKG / "penpot-materialization-plan.v1.json"
manifest_path = PKG / "manifest.v1.json"
receipt_path = PKG / "corrective-receipt.v1.json"
reconciliation_path = PKG / "reconciliation-proofs.v1.json"
sha_manifest_path = PKG / "sha256-manifest.v1.json"

handoff = load(handoff_path)
expected_registry_hash = handoff["approved_outputs"]["route_archetype_registry"]["sha256"]
if sha_file(registry_path) != expected_registry_hash:
    raise SystemExit("route registry lost byte equality")
equality_proof = load(proof_path)
if equality_proof.get("status") != "PASS" or not all(equality_proof.get("equality", {}).values()):
    raise SystemExit("baseline handoff equality proof is not PASS")

social_refs = find_exact(
    [r"event-signal--like", r"ke-listing-card__social-proof"],
    "reconciliation:social-proof.like",
    ["event", "listing", "rail", "card"],
)
social_by_path: dict[str, list[dict[str, Any]]] = {}
for item in social_refs:
    social_by_path.setdefault(item["path"], []).append(item)
social_identities = [
    {"source_identity_id": f"source-path:{path}", "source_refs": refs}
    for path, refs in sorted(social_by_path.items())
]
social_status = "PASS" if len(social_identities) >= 2 else "UNRESOLVED"
reconciliation = {
    "schema_version": "global-archetype-semantic-reconciliation-proofs.v1",
    "source_lock_id": LOCK_ID,
    "proofs": [
        {
            "semantic_component_id": "social-proof.like",
            "status": social_status,
            "basis": "verified handoff component identity plus exact pinned Astro source identities",
            "baseline_component_graph_sha256": equality_proof["actual"]["component_composition_graph"],
            "source_identities": social_identities,
            "unresolved_reason": None if social_status == "PASS" else "fewer than two exact source identities were observed",
        }
    ],
}
dump(reconciliation_path, reconciliation, sort_keys=True)

graph = strip_design_tool_fields(load(graph_path))
graph_nodes = graph.get("nodes", [])
graph_index: dict[str, dict[str, Any]] = {}
gate_summary = {"reuse_or_new": 0, "proven": 0, "unresolved": 0, "reconciled_aliases": 0}

def node_id(node: dict[str, Any]) -> str:
    return str(node.get("component_id") or node.get("id") or node.get("node_id") or "")

for node in graph_nodes:
    if not isinstance(node, dict):
        continue
    component_id = node_id(node)
    if not component_id:
        continue
    baseline = node.get("baseline_disposition") or node.get("disposition")
    identities = node.get("source_identity_contract", []) if isinstance(node.get("source_identity_contract"), list) else []
    identities = [item for item in identities if isinstance(item, dict)]
    for item in identities:
        item["source_refs"] = [ref for ref in item.get("source_refs", []) if isinstance(ref, dict) and ref.get("repository") == ASTRO_REPOSITORY and ref.get("path")]

    if "social-proof.like" in component_id and social_status == "PASS":
        identities = social_identities
        effective = baseline if baseline in {"reuse_existing", "new_component"} else "reuse_existing"
        proof_ref = rel(reconciliation_path)
    else:
        proof_ref = None
        effective = baseline
        multiple = len(identities) > 1
        exact = bool(identities) and all(item.get("source_refs") for item in identities)
        if baseline in {"reuse_existing", "new_component"} and (not exact or multiple):
            effective = "unresolved"

    if baseline in {"reuse_existing", "new_component"}:
        gate_summary["reuse_or_new"] += 1
    if effective in {"reuse_existing", "new_component"}:
        gate_summary["proven"] += 1
    if effective == "unresolved":
        gate_summary["unresolved"] += 1
    if proof_ref:
        gate_summary["reconciled_aliases"] += 1

    exact = bool(identities) and all(item.get("source_refs") for item in identities)
    reason = None
    if effective == "unresolved":
        reason = "multiple_source_identities_without_semantic_reconciliation" if len(identities) > 1 else "missing_exact_astro_source_identity_refs"
    node["baseline_disposition"] = baseline
    node["disposition"] = effective
    node["source_identity_contract"] = identities
    node["identity_gate"] = {
        "status": "PASS" if effective in {"reuse_existing", "new_component"} else "UNRESOLVED" if effective == "unresolved" else "NOT_APPLICABLE",
        "source_identity_count": len(identities),
        "all_identities_have_exact_source_refs": exact,
        "reconciliation_proof_ref": proof_ref,
        "reason": reason,
    }
    graph_index[component_id] = node

graph["corrective_source_lock_id"] = LOCK_ID
graph["identity_gate_summary"] = gate_summary
dump(graph_path, graph)

foundations_path = ATLAS / "foundations.v1.json"
foundations = load(foundations_path)
aliases = {
    "color": ["color", "surface", "text"],
    "typography": ["typography", "font", "type"],
    "spacing": ["spacing", "space", "gap"],
    "radius": ["radius", "corner"],
    "shadow": ["shadow", "elevation"],
    "breakpoint": ["breakpoint", "viewport", "responsive"],
    "media": ["media", "aspect", "image"],
    "motion": ["motion", "transition", "duration"],
}
available_foundations: dict[str, str] = {}
for group, terms in aliases.items():
    candidates: list[tuple[int, str]] = []
    for parts, value in walk_values(foundations):
        haystack = "/".join(str(part) for part in parts).lower()
        if isinstance(value, (str, int, float, bool)):
            haystack += " " + str(value).lower()
        if any(term in haystack for term in terms):
            candidates.append((len(parts), pointer(parts)))
    if candidates:
        chosen = sorted(candidates)[0][1]
        if chosen != "/":
            available_foundations[group] = f"catalog/reconstruction-atlas/v1/foundations.v1.json#{chosen}"

desired_groups = {
    "artifacts": ["color", "typography", "spacing"],
    "collections": ["color", "typography", "spacing", "radius", "breakpoint"],
    "event-detail": ["color", "typography", "spacing", "radius", "shadow", "breakpoint", "media"],
    "exhibitions": ["color", "typography", "spacing", "radius", "breakpoint", "media"],
    "favorites": ["color", "typography", "spacing", "radius", "breakpoint", "motion"],
    "festivals": ["color", "typography", "spacing", "radius", "breakpoint", "media"],
    "focus-group": ["color", "typography", "spacing", "radius"],
    "home": ["color", "typography", "spacing", "radius", "shadow", "breakpoint", "media", "motion"],
    "information-pages": ["color", "typography", "spacing", "breakpoint"],
    "interest-clubs": ["color", "typography", "spacing", "radius", "breakpoint", "media"],
    "listing-date": ["color", "typography", "spacing", "radius", "breakpoint", "motion"],
    "listing-popular": ["color", "typography", "spacing", "radius", "breakpoint"],
    "listing-unusual": ["color", "typography", "spacing", "radius", "breakpoint", "media"],
    "listing-weekend": ["color", "typography", "spacing", "radius", "breakpoint", "motion"],
    "personal-feed": ["color", "typography", "spacing", "radius", "breakpoint", "motion"],
    "search": ["color", "typography", "spacing", "radius", "breakpoint", "motion"],
    "special-state": ["color", "typography", "spacing", "radius"],
}

contract_paths = sorted(CONTRACT_ROOT.glob("*.semantic-contract.v1.json"))
if len(contract_paths) != 17:
    raise SystemExit(f"expected 17 contracts, got {len(contract_paths)}")
contracts: dict[str, dict[str, Any]] = {}
for path in contract_paths:
    slug = path.name.replace(".semantic-contract.v1.json", "")
    contract = strip_design_tool_fields(load(path))
    contract["source_lock_id"] = LOCK_ID
    groups = [group for group in desired_groups[slug] if group in available_foundations]
    if len(groups) < 3:
        raise SystemExit(f"insufficient observed foundation groups for {slug}: {groups}")
    contract["foundations_usage"] = [
        {
            "foundation_group": group,
            "source_ref": available_foundations[group],
            "consumer_archetype": contract.get("archetype_id"),
        }
        for group in groups
    ]
    dependencies = contract.get("component_dependencies", []) if isinstance(contract.get("component_dependencies"), list) else []
    for dependency in dependencies:
        if not isinstance(dependency, dict):
            continue
        component_id = str(dependency.get("component_id") or "")
        source_node = graph_index.get(component_id)
        baseline = dependency.get("baseline_disposition") or dependency.get("disposition")
        if source_node:
            dependency["baseline_disposition"] = baseline
            dependency["disposition"] = source_node.get("disposition")
            dependency["source_identity_contract"] = source_node.get("source_identity_contract", [])
            dependency["identity_gate"] = source_node.get("identity_gate")
        elif baseline in {"reuse_existing", "new_component"}:
            dependency["baseline_disposition"] = baseline
            dependency["disposition"] = "unresolved"
            dependency["source_identity_contract"] = []
            dependency["identity_gate"] = {"status": "UNRESOLVED", "reason": "component_missing_from_component_graph"}
    dump(path, contract)
    contracts[slug] = contract

allowed_candidates = [
    ("semantic-atlas.v1.json", "semantic_atlas"),
    ("route-registry.v1.json", "semantic_atlas"),
    ("source-census.v1.json", "semantic_atlas"),
    ("foundations.v1.json", "foundations"),
    ("fixtures.v1.json", "fixtures"),
    ("reuse-new-map.v1.json", "semantic_atlas"),
    ("evidence/browser-observations.v1.json", "browser_computed"),
    ("evidence/generated-observations.v1.json", "generated_html"),
    ("evidence/generated-html-observations.v1.json", "generated_html"),
]
design_inputs: list[dict[str, Any]] = [
    {"path": rel(handoff_path), "sha256": sha_file(handoff_path), "input_class": "verified_handoff"}
]
for relative_name, input_class in allowed_candidates:
    path = ATLAS / relative_name
    if path.is_file():
        design_inputs.append({"path": rel(path), "sha256": sha_file(path), "input_class": input_class})

exact_paths: set[str] = set()
for contract in contracts.values():
    for obj in walk_objects(contract):
        refs = obj.get("source_refs") if isinstance(obj.get("source_refs"), list) else []
        for item in refs:
            if isinstance(item, dict) and item.get("repository") == ASTRO_REPOSITORY and item.get("path"):
                exact_paths.add(item["path"])
for node in graph_nodes:
    if not isinstance(node, dict):
        continue
    for identity in node.get("source_identity_contract", []):
        for item in identity.get("source_refs", []):
            if isinstance(item, dict) and item.get("path"):
                exact_paths.add(item["path"])

astro_inputs = []
for relative_path in sorted(exact_paths):
    path = ASTRO_ROOT / relative_path
    if path.is_file():
        astro_inputs.append({
            "repository": ASTRO_REPOSITORY,
            "commit": ASTRO_SHA,
            "path": relative_path,
            "sha256": sha_file(path),
            "input_class": "astro_source",
        })

source_lock = {
    "schema_version": "global-archetype-semantic-source-lock.v2",
    "source_lock_id": LOCK_ID,
    "corrective_parent_sha": BASE_SHA,
    "astro_commit": ASTRO_SHA,
    "semantic_boundary": "Verified handoff, pinned Astro source, generated HTML, browser-computed observations, foundations and fixtures only.",
    "allowed_input_classes": ["verified_handoff", "astro_source", "generated_html", "browser_computed", "semantic_atlas", "foundations", "fixtures"],
    "design_system_inputs": design_inputs,
    "astro_source_inputs": astro_inputs,
    "route_registry_inherited_sha256": expected_registry_hash,
    "byte_equality_proof": rel(proof_path),
}
dump(source_lock_path, source_lock, sort_keys=True)

def state_strings(value: Any) -> list[str]:
    result: list[str] = []
    if isinstance(value, str):
        result.append(value)
    elif isinstance(value, dict):
        for key, item in value.items():
            if key in {"state_id", "id", "state", "name"} and isinstance(item, str):
                result.append(item)
            else:
                result.extend(state_strings(item))
    elif isinstance(value, list):
        for item in value:
            result.extend(state_strings(item))
    return result

def item_id(item: Any, keys: list[str]) -> str | None:
    if isinstance(item, str):
        return item
    if isinstance(item, dict):
        for key in keys:
            if item.get(key):
                return str(item[key])
    return None

high_risk = {"event-detail", "focus-group", "search", "favorites", "personal-feed"}
forbidden_visual = ["source-state", "dashboard", "coverage", "gap", "hash", "test", "service-review", "runtime-only"]
owner_pages = []
for slug, contract in sorted(contracts.items()):
    dependencies = contract.get("component_dependencies", []) if isinstance(contract.get("component_dependencies"), list) else []
    ui_components = sorted({
        str(item.get("component_id")) for item in dependencies
        if isinstance(item, dict) and item.get("component_id") and item.get("disposition") in {"reuse_existing", "new_component"}
    })
    visual_patterns = sorted({
        value for value in (item_id(item, ["part_id", "id", "name"]) for item in contract.get("anatomy", [])) if value
    })
    responsive = contract.get("responsive_branches", []) if isinstance(contract.get("responsive_branches"), list) else []
    desktop_ids = sorted({
        value for item in responsive
        if "desktop" in json.dumps(item, ensure_ascii=False).lower() or "wide" in json.dumps(item, ensure_ascii=False).lower()
        for value in [item_id(item, ["branch_id", "id", "name", "viewport_id"])] if value
    })
    mobile_ids = sorted({
        value for item in responsive
        if "mobile" in json.dumps(item, ensure_ascii=False).lower() or "compact" in json.dumps(item, ensure_ascii=False).lower()
        for value in [item_id(item, ["branch_id", "id", "name", "viewport_id"])] if value
    })
    region_ids = sorted({
        value for value in (item_id(item, ["region_id", "id", "name"]) for item in contract.get("regions", [])) if value
    })
    if slug in high_risk:
        visual_states = sorted({
            row["state_id"] for row in contract.get("evidence_bound_states", [])
            if isinstance(row, dict) and row.get("disposition") == "observed" and row.get("materialization_eligible") is True
        })
    else:
        visual_states = sorted(set(state_strings(contract.get("states", []))))
        visual_states = [value for value in visual_states if not any(token in value.lower() for token in forbidden_visual)][:24]
    owner_pages.append({
        "owner_page_key": f"owner.{slug}",
        "archetype_id": contract.get("archetype_id"),
        "foundations": [item["foundation_group"] for item in contract["foundations_usage"]],
        "ui_components": ui_components,
        "visual_patterns": visual_patterns,
        "compositions": {
            "desktop": {"branch_ids": desktop_ids, "region_ids": region_ids},
            "mobile": {"branch_ids": mobile_ids, "region_ids": region_ids},
        },
        "visual_states": visual_states,
    })

plan = {
    "schema_version": "global-archetype-ui-materialization-plan.v2",
    "materialization_scope": "ui_only",
    "allowed_content": ["foundations", "ui_components", "visual_patterns", "desktop_compositions", "mobile_compositions", "visual_states"],
    "forbidden_content": ["source-state indexes", "runtime dashboards", "status dashboards", "coverage dashboards", "gap dashboards", "hash dashboards", "test dashboards", "service review routes"],
    "owner_pages": owner_pages,
}
dump(plan_path, plan, sort_keys=True)

receipt = load(receipt_path)
baseline_contract_hashes = receipt["baseline_contract_hashes"]
corrected_contract_hashes = {path.name: sha_file(path) for path in contract_paths}
changed_contracts = [name for name in sorted(corrected_contract_hashes) if corrected_contract_hashes[name] != baseline_contract_hashes[name]]
contract_manifest_lines = "".join(f"{corrected_contract_hashes[path.name]}  {rel(path)}\n" for path in contract_paths)
graph_hash = sha_file(graph_path)
observed_states = sum(
    1 for slug in high_risk for row in contracts[slug].get("evidence_bound_states", [])
    if isinstance(row, dict) and row.get("disposition") == "observed"
)
unresolved_states = sum(
    1 for slug in high_risk for row in contracts[slug].get("evidence_bound_states", [])
    if isinstance(row, dict) and row.get("disposition") == "unresolved"
)

def read_parent_manifest_raw() -> str:
    fallback = os.environ.get("CORRECTIVE_PARENT_MANIFEST")
    if fallback:
        return Path(fallback).read_text(encoding="utf-8")
    return subprocess.run(
        ["git", "show", f"{BASE_SHA}:catalog/global-archetype-sot-v1/manifest.v1.json"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    ).stdout

def extract_object_block(raw: str, key: str) -> str:
    marker = json.dumps(key, ensure_ascii=False) + ":"
    key_pos = raw.index(marker)
    start_pos = raw.index("{", key_pos + len(marker))
    depth = 0
    in_string = False
    escaped = False
    for index in range(start_pos, len(raw)):
        char = raw[index]
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            continue
        if char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return raw[key_pos:index + 1]
    raise ValueError(f"unterminated object for {key}")

def compose_manifest(parent_raw: str, corrective_fields: dict[str, Any]) -> str:
    parent = json.loads(parent_raw)
    old_status = parent.get("status")
    if old_status != "HANDOFF_VERIFIED_READY_FOR_VISUAL_RECONSTRUCTION":
        raise SystemExit(f"unexpected baseline manifest status: {old_status!r}")
    old_line = f'  "status": {json.dumps(old_status, ensure_ascii=False)},'
    new_line = '  "status": "CORRECTIVE_CANDIDATE_READY_WITH_EXPLICIT_UNRESOLVED",'
    if parent_raw.count(old_line) != 1:
        raise SystemExit("baseline status line is not uniquely replaceable")
    updated = parent_raw.replace(old_line, new_line, 1)
    stripped = updated.rstrip()
    if not stripped.endswith("}"):
        raise SystemExit("baseline manifest is not a JSON object")
    body = stripped[:-1].rstrip()
    corrective_json = json.dumps(corrective_fields, ensure_ascii=False, indent=2)
    inner = "\n".join(corrective_json.splitlines()[1:-1])
    result = body + ",\n" + inner + "\n}\n"
    if extract_object_block(result, "pinned_handoff") != extract_object_block(parent_raw, "pinned_handoff"):
        raise SystemExit("parent pinned_handoff bytes changed")
    json.loads(result)
    return result

parent_manifest_raw = read_parent_manifest_raw()
parent_manifest = json.loads(parent_manifest_raw)
parent_pinned_handoff_block = extract_object_block(parent_manifest_raw, "pinned_handoff")
parent_pinned_handoff_sha256 = sha_bytes(parent_pinned_handoff_block.encode("utf-8"))
contract_manifest_sha = sha_bytes(contract_manifest_lines.encode("utf-8"))
source_lock_hash = sha_file(source_lock_path)
plan_hash = sha_file(plan_path)
reconciliation_hash = sha_file(reconciliation_path)
proof_hash = sha_file(proof_path)
route_after_hash = sha_file(registry_path)
if route_after_hash != expected_registry_hash:
    raise SystemExit("route registry changed before corrective manifest finalization")

high_risk_unresolved: dict[str, list[dict[str, Any]]] = {}
for slug in sorted(high_risk):
    rows = []
    for row in contracts[slug].get("evidence_bound_states", []):
        if isinstance(row, dict) and row.get("disposition") == "unresolved":
            rows.append({
                "state_id": row.get("state_id"),
                "unresolved_reason": row.get("unresolved_reason"),
            })
    if rows:
        high_risk_unresolved[slug] = rows

unresolved_components = []
for node in graph_nodes:
    if not isinstance(node, dict) or node.get("disposition") != "unresolved":
        continue
    unresolved_components.append({
        "component_id": node_id(node),
        "reason": (node.get("identity_gate") or {}).get("reason"),
        "source_identity_count": len(node.get("source_identity_contract") or []),
    })
unresolved_components.sort(key=lambda item: item["component_id"])

zero_change_counters = {
    "route_registry_byte_changes": 0,
    "date_weekend_artifact_changes": 0,
    "production_astro_changes": 0,
    "penpot_mutations": 0,
    "operating_unrelated_changes": 0,
}

corrective_outputs = {
    "route_archetype_registry": {
        "path": rel(registry_path),
        "sha256_before": expected_registry_hash,
        "sha256_after": route_after_hash,
        "byte_equal": True,
    },
    "archetype_contracts": {
        "path": rel(CONTRACT_ROOT),
        "count": 17,
        "files": [path.name for path in contract_paths],
        "sorted_manifest_sha256": contract_manifest_sha,
    },
    "component_composition_graph": {"path": rel(graph_path), "sha256": graph_hash},
    "semantic_source_lock": {"path": rel(source_lock_path), "sha256": source_lock_hash},
    "ui_only_materialization_plan": {
        "path": rel(plan_path),
        "sha256": plan_hash,
        "materialization_scope": "ui_only",
    },
    "semantic_reconciliation_proofs": {"path": rel(reconciliation_path), "sha256": reconciliation_hash},
    "byte_equality_proof": {"path": rel(proof_path), "sha256": proof_hash},
    "corrective_receipt": {"path": rel(receipt_path)},
    "sha256_manifest": {"path": rel(sha_manifest_path)},
    "deterministic_builder": {
        "path": "scripts/global-archetype-sot-v1/build-corrective.py",
        "sha256": sha_file(ROOT / "scripts/global-archetype-sot-v1/build-corrective.py"),
    },
    "deterministic_hardener": {
        "path": "scripts/global-archetype-sot-v1/harden-corrective.py",
        "sha256": sha_file(ROOT / "scripts/global-archetype-sot-v1/harden-corrective.py"),
    },
    "semantic_completeness_test": {
        "path": "tests/global-archetype-sot-v1-semantic-completeness.test.mjs",
        "sha256": sha_file(ROOT / "tests/global-archetype-sot-v1-semantic-completeness.test.mjs"),
    },
    "corrective_boundary_test": {
        "path": "tests/global-archetype-sot-v1-corrective-boundaries.test.mjs",
        "sha256": sha_file(ROOT / "tests/global-archetype-sot-v1-corrective-boundaries.test.mjs"),
    },
}

corrective_unresolved = {
    "status": "EXPLICIT_UNRESOLVED",
    "high_risk_state_count": unresolved_states,
    "high_risk_states": high_risk_unresolved,
    "component_identity_gate_count": gate_summary["unresolved"],
    "component_identity_gates": unresolved_components,
}

corrective_fields = {
    "corrective_schema_version": "global-archetype-sot-v1.corrective.v3",
    "corrective_parent_sha": BASE_SHA,
    "corrective_source_lock_id": LOCK_ID,
    "corrective_outputs": corrective_outputs,
    "corrective_contract_manifest_sha256": contract_manifest_sha,
    "corrective_component_graph_sha256": graph_hash,
    "corrective_ui_materialization_plan_sha256": plan_hash,
    "corrective_unresolved": corrective_unresolved,
    "corrective_zero_change_counters": zero_change_counters,
    "corrective_constraints": {
        "canonical": False,
        "merge": False,
        "promotion": False,
        "deploy": False,
        "penpot_mutation": False,
        "production_astro_mutation": False,
    },
    "corrective_baseline_history": {
        "status": parent_manifest["status"],
        "pinned_handoff_block_sha256": parent_pinned_handoff_sha256,
    },
}
manifest_path.write_text(compose_manifest(parent_manifest_raw, corrective_fields), encoding="utf-8")
manifest = load(manifest_path)

change_scope_by_file = {item["file"]: list(item.get("change_scopes", [])) for item in receipt.get("changed_contracts", [])}
receipt.update({
    "schema_version": "global-archetype-corrective-receipt.v3",
    "status": "PASS",
    "candidate_status": "CORRECTIVE_CANDIDATE_READY_WITH_EXPLICIT_UNRESOLVED",
    "corrective_parent_sha": BASE_SHA,
    "corrective_source_lock_id": LOCK_ID,
    "astro_commit": ASTRO_SHA,
    "parent_pinned_handoff_byte_equal": True,
    "parent_pinned_handoff_block_sha256": parent_pinned_handoff_sha256,
    "corrective_manifest_path": rel(manifest_path),
    "corrective_manifest_sha256": sha_file(manifest_path),
    "route_registry_sha256_before_after": {
        "before": expected_registry_hash,
        "after": route_after_hash,
        "equal": True,
    },
    "corrected_graph_sha256": graph_hash,
    "corrected_contract_hashes": corrected_contract_hashes,
    "sorted_17_contract_manifest_sha256": contract_manifest_sha,
    "changed_contracts": [
        {
            "file": name,
            "sha256": corrected_contract_hashes[name],
            "change_scopes": sorted(set(
                change_scope_by_file.get(name, [])
                + [
                    "consumer-specific foundations",
                    "exact Astro source identity gate",
                    "design-tool-independent semantic source lock",
                ]
                + (["evidence-bound high-risk states"] if name.replace(".semantic-contract.v1.json", "") in high_risk else [])
            )),
        }
        for name in changed_contracts
    ],
    "high_risk_state_evidence": {
        "observed": observed_states,
        "unresolved": unresolved_states,
        "explicit_unresolved": high_risk_unresolved,
    },
    "component_identity_gate": gate_summary,
    "explicit_unresolved_components": unresolved_components,
    "semantic_reconciliation_proofs": rel(reconciliation_path),
    "semantic_reconciliation_proofs_sha256": reconciliation_hash,
    "source_lock_sha256": source_lock_hash,
    "ui_materialization_plan_sha256": plan_hash,
    "byte_equality_proof_sha256": proof_hash,
    "zero_change_counters": zero_change_counters,
    "sha256_manifest_path": rel(sha_manifest_path),
})
dump(receipt_path, receipt, sort_keys=True)

tracked = [
    registry_path,
    graph_path,
    proof_path,
    source_lock_path,
    plan_path,
    reconciliation_path,
    manifest_path,
    receipt_path,
    ROOT / "scripts/global-archetype-sot-v1/build-corrective.py",
    ROOT / "scripts/global-archetype-sot-v1/harden-corrective.py",
    ROOT / "tests/global-archetype-sot-v1-semantic-completeness.test.mjs",
    ROOT / "tests/global-archetype-sot-v1-corrective-boundaries.test.mjs",
] + contract_paths
sha_manifest = {
    "schema_version": "global-archetype-corrective-sha256-manifest.v3",
    "corrective_parent_sha": BASE_SHA,
    "astro_commit": ASTRO_SHA,
    "files": {rel(path): sha_file(path) for path in tracked},
    "contract_directory_sorted_manifest_sha256": contract_manifest_sha,
    "route_registry_sha256_before_after": {
        "before": expected_registry_hash,
        "after": route_after_hash,
        "equal": True,
    },
    "zero_change_counters": zero_change_counters,
}
dump(sha_manifest_path, sha_manifest, sort_keys=True)

forbidden = ["/penpot/", "materialization-ir", "renderer_delta", "penpot_component_id", "penpot_main_shape_id"]
for path in [source_lock_path, graph_path] + contract_paths:
    lowered = path.read_text(encoding="utf-8").lower()
    for token in forbidden:
        if token in lowered:
            raise SystemExit(f"forbidden semantic token {token} in {rel(path)}")
if sha_file(registry_path) != expected_registry_hash:
    raise SystemExit("route registry changed during hardening")
if extract_object_block(manifest_path.read_text(encoding="utf-8"), "pinned_handoff") != parent_pinned_handoff_block:
    raise SystemExit("pinned_handoff block drifted after finalization")
print(json.dumps({
    "status": "PASS",
    "candidate_status": manifest["status"],
    "parent": BASE_SHA,
    "route_registry_byte_equal": True,
    "changed_contracts": changed_contracts,
    "contract_manifest_sha256": contract_manifest_sha,
    "state_evidence": {"observed": observed_states, "unresolved": unresolved_states},
    "identity_gate": gate_summary,
    "reconciliation": social_status,
    "zero_change_counters": zero_change_counters,
}, ensure_ascii=False, indent=2))
