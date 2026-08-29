#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[2]
PKG = ROOT / "catalog/global-archetype-sot-v1"
CONTRACT_ROOT = PKG / "archetype-contracts"
ATLAS = ROOT / "catalog/reconstruction-atlas/v1"
ASTRO_ROOT = Path(os.environ.get("EVENTS_BOT_ROOT", ROOT / ".astro-source")).resolve()
BASE_SHA = os.environ.get("BASE_SHA", "da16dde8812220125a806bd5a03d5015357d4c07")
ASTRO_SHA = os.environ.get("ASTRO_SHA", "7774004b48f1dd7ffe6eaa3a77d4bd4799d92c00")
LOCK_ID = f"global-archetype-sot-v1.corrective.{BASE_SHA[:12]}.{ASTRO_SHA[:12]}"
REPO = "onedayonemasterpiece/events-bot-new"

def load(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))

def dump(path: Path, value: Any, *, sort_keys: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=sort_keys) + "\n", encoding="utf-8")

def sha_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def sha_file(path: Path) -> str:
    return sha_bytes(path.read_bytes())

def rel(path: Path) -> str:
    return path.resolve().relative_to(ROOT.resolve()).as_posix()

def flatten_strings(value: Any) -> Iterable[str]:
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for key, item in value.items():
            yield str(key)
            yield from flatten_strings(item)
    elif isinstance(value, list):
        for item in value:
            yield from flatten_strings(item)

def walk_objects(value: Any) -> Iterable[dict[str, Any]]:
    if isinstance(value, dict):
        yield value
        for item in value.values():
            yield from walk_objects(item)
    elif isinstance(value, list):
        for item in value:
            yield from walk_objects(item)

def json_pointer(parts: list[str | int]) -> str:
    encoded = [str(part).replace("~", "~0").replace("/", "~1") for part in parts]
    return "/" + "/".join(encoded)

def walk_values(value: Any, parts: list[str | int] | None = None) -> Iterable[tuple[list[str | int], Any]]:
    parts = parts or []
    yield parts, value
    if isinstance(value, dict):
        for key, item in value.items():
            yield from walk_values(item, parts + [key])
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from walk_values(item, parts + [index])

handoff = load(PKG / "handoff-lock.v1.json")
registry_path = PKG / "route-archetype-registry.v1.json"
graph_path = PKG / "component-composition-graph.v1.json"
registry_hash = sha_file(registry_path)
expected_registry_hash = handoff["approved_outputs"]["route_archetype_registry"]["sha256"]
if registry_hash != expected_registry_hash:
    raise SystemExit(f"route registry changed before corrective build: {registry_hash} != {expected_registry_hash}")

contract_paths = sorted(CONTRACT_ROOT.glob("*.semantic-contract.v1.json"))
if len(contract_paths) != 17:
    raise SystemExit(f"expected 17 contracts, got {len(contract_paths)}")

proof_path = PKG / "byte-equality-proof.v1.json"
receipt_path = PKG / "corrective-receipt.v1.json"
baseline_contract_hashes: dict[str, str]
baseline_graph_hash: str
if proof_path.exists() and receipt_path.exists():
    proof = load(proof_path)
    receipt = load(receipt_path)
    if proof.get("status") != "PASS":
        raise SystemExit("stored byte-equality proof is not PASS")
    baseline_contract_hashes = dict(receipt["baseline_contract_hashes"])
    baseline_graph_hash = receipt["baseline_graph_sha256"]
else:
    baseline_contract_hashes = {path.name: sha_file(path) for path in contract_paths}
    baseline_graph_hash = sha_file(graph_path)
    manifest_lines = "".join(
        f"{baseline_contract_hashes[path.name]}  {rel(path)}\n" for path in contract_paths
    )
    actual = {
        "route_archetype_registry": registry_hash,
        "component_composition_graph": baseline_graph_hash,
        "archetype_contracts_sorted_manifest": sha_bytes(manifest_lines.encode("utf-8")),
        "archetype_contract_count": len(contract_paths),
    }
    expected = {
        "route_archetype_registry": expected_registry_hash,
        "component_composition_graph": handoff["approved_outputs"]["component_composition_graph"]["sha256"],
        "archetype_contracts_sorted_manifest": handoff["approved_outputs"]["archetype_contracts"]["sorted_checksum_manifest_sha256"],
        "archetype_contract_count": handoff["approved_outputs"]["archetype_contracts"]["count"],
    }
    equality = {key: actual[key] == expected[key] for key in expected}
    if not all(equality.values()):
        raise SystemExit(f"verified handoff byte equality failed: {equality}")
    proof = {
        "schema_version": "global-archetype-byte-equality-proof.v1",
        "status": "PASS",
        "corrective_parent_sha": BASE_SHA,
        "verified_handoff_head": handoff["green_handoff"]["head_sha"],
        "verified_handoff_workflow_run": handoff["green_handoff"]["workflow_run_id"],
        "expected": expected,
        "actual": actual,
        "equality": equality,
        "contract_files": [path.name for path in contract_paths],
    }
    dump(proof_path, proof, sort_keys=True)

source_root = ASTRO_ROOT / "site/src"
if not source_root.is_dir():
    source_root = ASTRO_ROOT / "src"
if not source_root.is_dir():
    raise SystemExit(f"Astro source root not found under {ASTRO_ROOT}")

source_extensions = {".astro", ".ts", ".tsx", ".js", ".mjs", ".css", ".scss", ".json"}
source_files: list[Path] = []
source_lines: dict[Path, list[str]] = {}
source_text: dict[Path, str] = {}
for path in sorted(source_root.rglob("*")):
    if path.is_file() and path.suffix.lower() in source_extensions:
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        source_files.append(path)
        source_text[path] = text
        source_lines[path] = text.splitlines()

def source_ref(path: Path, line_number: int, evidence_id: str) -> dict[str, Any]:
    lines = source_lines[path]
    line_number = max(1, min(line_number, len(lines) or 1))
    line = lines[line_number - 1] if lines else ""
    return {
        "repository": REPO,
        "commit": ASTRO_SHA,
        "path": path.resolve().relative_to(ASTRO_ROOT).as_posix(),
        "line_start": line_number,
        "line_end": line_number,
        "evidence_id": evidence_id,
        "line_sha256": sha_bytes(line.encode("utf-8")),
    }

def find_source(scope_terms: list[str], patterns: list[str], evidence_id: str, limit: int = 3) -> list[dict[str, Any]]:
    scoped = [
        path for path in source_files
        if any(term.lower() in path.as_posix().lower() for term in scope_terms)
    ]
    candidates = scoped or source_files
    hits: list[tuple[int, str, int, Path]] = []
    for pattern_index, pattern in enumerate(patterns):
        regex = re.compile(pattern, re.IGNORECASE)
        for path in candidates:
            for line_number, line in enumerate(source_lines[path], start=1):
                if regex.search(line):
                    score = pattern_index * 100
                    score -= sum(20 for term in scope_terms if term.lower() in path.as_posix().lower())
                    hits.append((score, path.as_posix(), line_number, path))
    refs: list[dict[str, Any]] = []
    seen: set[tuple[str, int]] = set()
    for _, _, line_number, path in sorted(hits):
        key = (path.as_posix(), line_number)
        if key in seen:
            continue
        seen.add(key)
        refs.append(source_ref(path, line_number, evidence_id))
        if len(refs) >= limit:
            break
    return refs

browser_path = ATLAS / "evidence/browser-observations.v1.json"
browser_data = load(browser_path) if browser_path.exists() else {}
browser_objects = list(walk_objects(browser_data))

def browser_refs(scope_terms: list[str], aliases: list[str], evidence_id: str, limit: int = 2) -> list[dict[str, Any]]:
    refs: list[dict[str, Any]] = []
    for obj in browser_objects:
        serialized = json.dumps(obj, ensure_ascii=False).lower()
        if not any(scope.lower() in serialized for scope in scope_terms):
            continue
        if not any(alias.lower() in serialized for alias in aliases):
            continue
        observation_id = obj.get("observation_id") or obj.get("id") or obj.get("route_id")
        if not observation_id:
            continue
        refs.append({
            "evidence_kind": "browser_computed",
            "source_ref": f"catalog/reconstruction-atlas/v1/evidence/browser-observations.v1.json#{observation_id}",
            "observation_id": str(observation_id),
            "viewport": obj.get("viewport") or obj.get("viewport_id"),
            "computed_output_sha256": obj.get("computed_output_sha256") or obj.get("computed_sha256") or obj.get("rendered_sha256"),
            "evidence_id": evidence_id,
        })
        if len(refs) >= limit:
            break
    return refs

STATE_SPECS: dict[str, list[tuple[str, list[str], list[str], list[str]]]] = {
    "event-detail": [
        ("layout.editorial-wide", ["event-detail", "eventdetail", "event"], [r"editorial[-_ ]wide"], ["editorial-wide"]),
        ("layout.split-poster", ["event-detail", "eventdetail", "event"], [r"split[-_ ]poster"], ["split-poster"]),
        ("layout.editorial-with-poster-companion", ["event-detail", "eventdetail", "event"], [r"editorial[-_ ]with[-_ ]poster[-_ ]companion", r"poster[-_ ]companion"], ["poster-companion"]),
        ("layout.no-image", ["event-detail", "eventdetail", "event"], [r"no[-_ ]image", r"without[-_ ]image", r"hasImage\s*[:=]\s*false"], ["no-image"]),
        ("mobile-media.single", ["event-detail", "media", "event"], [r"mobile.{0,40}(single|hero).{0,40}(image|media)", r"media.{0,40}mobile.{0,40}single"], ["mobile", "single"]),
        ("mobile-media.poster", ["event-detail", "media", "event"], [r"mobile.{0,40}poster", r"poster.{0,40}mobile"], ["mobile", "poster"]),
        ("mobile-media.gallery", ["event-detail", "media", "gallery"], [r"mobile.{0,40}gallery", r"gallery.{0,40}mobile"], ["mobile", "gallery"]),
        ("mobile-media.no-image", ["event-detail", "media", "event"], [r"mobile.{0,40}no[-_ ]image", r"no[-_ ]image.{0,40}mobile"], ["mobile", "no-image"]),
        ("transport.rail", ["transport", "event-detail", "event"], [r"\brail\b", r"поезд", r"железн"], ["rail", "поезд"]),
        ("transport.bus", ["transport", "event-detail", "event"], [r"\bbus\b", r"автобус"], ["bus", "автобус"]),
        ("transport.kaup", ["transport", "event-detail", "event"], [r"\bkaup\b", r"Кауп"], ["kaup"]),
        ("transport.multiple", ["transport", "event-detail", "event"], [r"transport.{0,80}(length|size).{0,20}>\s*1", r"multiple.{0,40}transport"], ["multiple", "transport"]),
        ("transport.absent", ["transport", "event-detail", "event"], [r"no[-_ ]transport", r"transport.{0,30}(null|undefined)", r"!\s*transport"], ["absent", "transport"]),
        ("transport.unavailable", ["transport", "event-detail", "event"], [r"transport.{0,40}unavailable", r"unavailable.{0,40}transport", r"транспорт.{0,40}недоступ"], ["unavailable", "transport"]),
        ("transport.stale", ["transport", "event-detail", "event"], [r"transport.{0,40}stale", r"stale.{0,40}transport", r"транспорт.{0,40}устар"], ["stale", "transport"]),
        ("transport.error", ["transport", "event-detail", "event"], [r"transport.{0,40}error", r"error.{0,40}transport", r"ошибк.{0,40}транспорт"], ["error", "transport"]),
        ("question-cta", ["event-detail", "question", "feedback", "event"], [r"question[-_ ]cta", r"ask.{0,20}question", r"Задать вопрос"], ["question", "cta"]),
        ("feedback-boundary.page-feedback", ["event-detail", "feedback", "event"], [r"page.{0,30}feedback", r"feedback.{0,30}page"], ["page", "feedback"]),
        ("feedback-boundary.event-error-report", ["event-detail", "feedback", "event"], [r"event.{0,40}error.{0,40}report", r"report.{0,40}event.{0,40}error", r"ошибк.{0,40}событ"], ["event", "error", "feedback"]),
    ],
    "focus-group": [
        ("feedback.overall-nps", ["focus", "feedback"], [r"\bnps\b", r"overall.{0,30}(score|rating)", r"общ.{0,30}оцен"], ["nps", "overall"]),
        ("feedback.page-usefulness", ["focus", "feedback"], [r"useful", r"usefulness", r"полезн"], ["useful", "полезн"]),
        ("feedback.improvement-suggestion", ["focus", "feedback"], [r"improv", r"suggestion", r"улучш"], ["improvement", "suggestion"]),
        ("feedback.event-error-report", ["focus", "feedback"], [r"event.{0,40}error", r"ошибк.{0,40}событ", r"report.{0,40}event"], ["event", "error"]),
    ],
    "search": [
        ("search.validation", ["search"], [r"validation", r"invalid", r"query.{0,30}(min|trim|length)", r"Введите.{0,20}поиск"], ["validation", "invalid"]),
        ("search.progress", ["search"], [r"search[-_ ]progress", r"aria-busy", r"progress"], ["progress"]),
        ("search.loading", ["search"], [r"isLoading", r"loading", r"загруз"], ["loading"]),
        ("search.results", ["search"], [r"searchResults", r"search[-_ ]results", r"results"], ["results"]),
        ("search.empty", ["search"], [r"no[-_ ]results", r"empty", r"Ничего не найден"], ["empty", "no-results"]),
        ("search.error", ["search"], [r"search.{0,40}error", r"error.{0,40}search", r"ошибк"], ["error"]),
        ("search.retry", ["search"], [r"retry", r"Повторить"], ["retry"]),
        ("search.stale", ["search"], [r"stale", r"устар"], ["stale"]),
        ("search.load-more", ["search"], [r"load[-_ ]more", r"loadMore", r"Показать ещё"], ["load-more"]),
        ("search.timeout", ["search"], [r"timeout", r"AbortSignal\.timeout", r"setTimeout"], ["timeout"]),
        ("search.recovery", ["search"], [r"recover", r"recovery", r"восстанов", r"retry"], ["recovery", "retry"]),
    ],
    "favorites": [
        ("favorites.local-only", ["favorite"], [r"localStorage", r"local[-_ ]only", r"localOnly"], ["local-only"]),
        ("favorites.auth-required", ["favorite", "auth"], [r"auth[-_ ]required", r"sign[-_ ]in", r"Войд", r"требуется.{0,20}авторизац"], ["auth-required"]),
        ("favorites.reconciling", ["favorite", "reconcil"], [r"reconcil", r"syncing", r"merge.{0,30}favorite"], ["reconciling"]),
        ("favorites.populated", ["favorite"], [r"populated", r"favorites?.{0,30}length", r"hasFavorites"], ["populated"]),
        ("favorites.empty", ["favorite"], [r"empty", r"favorites?.{0,30}length.{0,20}0", r"Нет избран"], ["empty"]),
        ("favorites.catalog-failure", ["favorite", "catalog"], [r"catalog.{0,40}error", r"error.{0,40}catalog", r"каталог.{0,40}ошиб"], ["catalog", "error"]),
        ("favorites.cloud-failure", ["favorite", "cloud", "sync"], [r"cloud.{0,40}error", r"sync.{0,40}error", r"remote.{0,40}error"], ["cloud", "error"]),
        ("favorites.action-refresh", ["favorite", "refresh"], [r"refresh", r"Обновить"], ["refresh"]),
    ],
    "personal-feed": [
        ("personal-feed.consent", ["personal", "feed", "consent", "profile"], [r"consent", r"соглас"], ["consent"]),
        ("personal-feed.profile-insufficient", ["personal", "feed", "profile"], [r"insufficient", r"not[-_ ]enough", r"недостат"], ["insufficient"]),
        ("personal-feed.profile-ready", ["personal", "feed", "profile"], [r"profile.{0,30}ready", r"ready.{0,30}profile"], ["profile-ready"]),
        ("personal-feed.profile-deleted", ["personal", "feed", "profile"], [r"profile.{0,30}deleted", r"deleted.{0,30}profile", r"профил.{0,30}удал"], ["profile-deleted"]),
        ("personal-feed.loading", ["personal", "feed"], [r"isLoading", r"loading", r"загруз"], ["loading"]),
        ("personal-feed.empty", ["personal", "feed"], [r"empty", r"no[-_ ]recommend", r"Нет рекомендац"], ["empty"]),
        ("personal-feed.populated", ["personal", "feed"], [r"populated", r"recommendations?.{0,30}length", r"items.{0,30}length"], ["populated"]),
        ("personal-feed.stale", ["personal", "feed"], [r"stale", r"устар"], ["stale"]),
        ("personal-feed.error", ["personal", "feed"], [r"personal.{0,40}error", r"feed.{0,40}error", r"ошибк"], ["error"]),
        ("personal-feed.hidden", ["personal", "feed", "hidden"], [r"hidden", r"hide.{0,30}event", r"скрыт"], ["hidden"]),
        ("personal-feed.restore", ["personal", "feed", "restore"], [r"restore", r"undo", r"Вернуть", r"Восстанов"], ["restore"]),
        ("personal-feed.storage-failure", ["personal", "feed", "storage"], [r"storage.{0,40}error", r"localStorage.{0,40}(catch|error)", r"хранилищ.{0,40}ошиб"], ["storage", "error"]),
    ],
}

def evidence_rows(group: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for state_id, scopes, patterns, aliases in STATE_SPECS[group]:
        refs = find_source(scopes, patterns, f"{group}:{state_id}")
        browser = browser_refs(scopes, aliases, f"{group}:{state_id}")
        observed = bool(refs or browser)
        row: dict[str, Any] = {
            "state_id": state_id,
            "disposition": "observed" if observed else "unresolved",
            "materialization_eligible": observed,
            "source_refs": refs,
            "browser_observation_refs": browser,
        }
        if not observed:
            row["unresolved_reason"] = "No exact Astro source token or pinned browser-computed observation proves this requested state."
        rows.append(row)
    return rows

atlas_inputs: list[Any] = []
for name in ["reuse-new-map.v1.json", "semantic-atlas.v1.json", "source-census.v1.json", "route-registry.v1.json"]:
    path = ATLAS / name
    if path.exists():
        atlas_inputs.append(load(path))

source_path_pattern = re.compile(r"(?:^|/)(?:site/)?src/[^\s#'\"]+\.(?:astro|ts|tsx|js|mjs|css|scss)(?:#[^\s'\"]+)?", re.IGNORECASE)

def objects_for_needles(needles: list[str]) -> list[dict[str, Any]]:
    lowered = [needle.lower() for needle in needles if needle]
    found: list[dict[str, Any]] = []
    for dataset in atlas_inputs:
        for obj in walk_objects(dataset):
            text = json.dumps(obj, ensure_ascii=False).lower()
            if any(needle in text for needle in lowered):
                found.append(obj)
    return found

def normalize_source_candidate(raw: str) -> tuple[Path | None, str | None]:
    fragment = None
    value = raw.strip().strip("`'\"")
    if "#" in value:
        value, fragment = value.split("#", 1)
    value = value.replace("\\", "/")
    if "/site/src/" in value:
        value = "site/src/" + value.split("/site/src/", 1)[1]
    elif value.startswith("src/"):
        value = "site/" + value
    elif not value.startswith("site/src/") and value.endswith(tuple(ext.lstrip(".") for ext in source_extensions)):
        matches = [path for path in source_files if path.name == Path(value).name]
        if len(matches) == 1:
            return matches[0], fragment
    path = ASTRO_ROOT / value
    if path.is_file() and path in source_text:
        return path, fragment
    matches = [candidate for candidate in source_files if candidate.as_posix().endswith(value)]
    if len(matches) == 1:
        return matches[0], fragment
    return None, fragment

def mapped_source_refs(identity: str, component_id: str) -> list[dict[str, Any]]:
    refs: list[dict[str, Any]] = []
    candidates: set[str] = set()
    for obj in objects_for_needles([identity, component_id]):
        for string in flatten_strings(obj):
            for match in source_path_pattern.finditer(string):
                candidates.add(match.group(0).lstrip("/"))
            if re.search(r"\.(astro|ts|tsx|js|mjs|css|scss)(#|$)", string, re.IGNORECASE):
                candidates.add(string)
    for raw in sorted(candidates):
        path, fragment = normalize_source_candidate(raw)
        if not path:
            continue
        line_number = 1
        if fragment:
            token = fragment.split("/")[-1].lstrip(".#")
            for index, line in enumerate(source_lines[path], start=1):
                if token and token.lower() in line.lower():
                    line_number = index
                    break
        refs.append(source_ref(path, line_number, f"identity:{identity}"))
    exact_tokens = [identity, component_id, identity.replace(".", "-"), component_id.replace(".", "-")]
    for token in exact_tokens:
        if len(token) < 6:
            continue
        token_lower = token.lower()
        for path in source_files:
            for line_number, line in enumerate(source_lines[path], start=1):
                if token_lower in line.lower():
                    refs.append(source_ref(path, line_number, f"identity:{identity}"))
                    break
    unique: list[dict[str, Any]] = []
    seen: set[tuple[str, int]] = set()
    for ref_item in refs:
        key = (ref_item["path"], ref_item["line_start"])
        if key not in seen:
            seen.add(key)
            unique.append(ref_item)
    return unique[:4]

graph = load(graph_path)
nodes = graph.get("nodes", [])
reconciliation_receipt = PKG / "reconciliation-proofs.v1.json"
reconciliation_ok = False
ambiguous_components = {"document.typography", "listing.page-pattern"}
graph_index: dict[str, dict[str, Any]] = {}
graph_gate_counts = {"reuse_or_new": 0, "proven": 0, "unresolved": 0, "reconciled_aliases": 0}

def component_id_of(node: dict[str, Any]) -> str:
    return str(node.get("component_id") or node.get("id") or node.get("node_id") or "")

def identity_ids_of(node: dict[str, Any], component_id: str) -> list[str]:
    raw = node.get("source_identity_ids") or node.get("source_identities") or []
    ids: list[str] = []
    if isinstance(raw, list):
        for item in raw:
            if isinstance(item, str):
                ids.append(item)
            elif isinstance(item, dict):
                value = item.get("source_identity_id") or item.get("identity_id") or item.get("id")
                if value:
                    ids.append(str(value))
    elif isinstance(raw, str):
        ids.append(raw)
    return sorted(set(ids or ([component_id] if component_id else [])))

for node in nodes:
    if not isinstance(node, dict):
        continue
    component_id = component_id_of(node)
    if not component_id:
        continue
    baseline_disposition = node.get("baseline_disposition") or node.get("disposition") or node.get("corrective_disposition")
    if baseline_disposition not in {"reuse_existing", "new_component", "unresolved", "runtime_only"}:
        graph_index[component_id] = node
        continue
    identities = identity_ids_of(node, component_id)
    contracts: list[dict[str, Any]] = []
    for identity in identities:
        refs = mapped_source_refs(identity, component_id)
        contracts.append({"source_identity_id": identity, "source_refs": refs})

    if component_id in ambiguous_components:
        all_refs = mapped_source_refs(component_id, component_id)
        by_path = sorted({item["path"] for item in all_refs})
        if len(by_path) > 1:
            contracts = []
            for source_path in by_path:
                path_refs = [item for item in all_refs if item["path"] == source_path]
                contracts.append({
                    "source_identity_id": f"source-path:{source_path}",
                    "source_refs": path_refs,
                })

    if "social-proof.like" in component_id and reconciliation_ok:
        social_refs = find_source(
            ["listing", "event", "rail"],
            [r"event-signal--like", r"ke-listing-card__social-proof"],
            "identity:social-proof.like",
            limit=6,
        )
        if social_refs:
            contracts = [
                {"source_identity_id": f"source-path:{item['path']}", "source_refs": [item]}
                for item in social_refs
            ]

    source_identity_count = len(contracts)
    all_have_refs = bool(contracts) and all(item.get("source_refs") for item in contracts)
    reconciled = source_identity_count > 1 and "social-proof.like" in component_id and reconciliation_ok
    effective = baseline_disposition
    reason = None
    if baseline_disposition in {"reuse_existing", "new_component"}:
        graph_gate_counts["reuse_or_new"] += 1
        if source_identity_count > 1 and not reconciled:
            effective = "unresolved"
            reason = "multiple_source_identities_without_alias_or_reconciliation_proof"
        elif not all_have_refs:
            effective = "unresolved"
            reason = "missing_exact_astro_source_identity_refs"
        else:
            graph_gate_counts["proven"] += 1
    if effective == "unresolved":
        graph_gate_counts["unresolved"] += 1
    if reconciled:
        graph_gate_counts["reconciled_aliases"] += 1

    node["baseline_disposition"] = baseline_disposition
    node["disposition"] = effective
    node["source_identity_contract"] = contracts
    node["identity_gate"] = {
        "status": "PASS" if effective in {"reuse_existing", "new_component"} else "UNRESOLVED" if effective == "unresolved" else "NOT_APPLICABLE",
        "source_identity_count": source_identity_count,
        "all_identities_have_exact_source_refs": all_have_refs,
        "reconciliation_proof_ref": rel(reconciliation_receipt) if reconciled else None,
        "reason": reason,
    }
    graph_index[component_id] = node

graph["identity_gate_summary"] = graph_gate_counts
graph["corrective_source_lock_id"] = LOCK_ID
dump(graph_path, graph)

FOUNDATION_GROUPS: dict[str, list[str]] = {
    "artifacts": ["color", "typography", "spacing", "border"],
    "collections": ["color", "typography", "spacing", "radius", "breakpoint"],
    "event-detail": ["color", "typography", "spacing", "radius", "shadow", "breakpoint", "media"],
    "exhibitions": ["color", "typography", "spacing", "radius", "breakpoint", "media"],
    "favorites": ["color", "typography", "spacing", "radius", "breakpoint", "motion", "state"],
    "festivals": ["color", "typography", "spacing", "radius", "breakpoint", "media"],
    "focus-group": ["color", "typography", "spacing", "radius", "state"],
    "home": ["color", "typography", "spacing", "radius", "shadow", "breakpoint", "media", "motion"],
    "information-pages": ["color", "typography", "spacing", "breakpoint"],
    "interest-clubs": ["color", "typography", "spacing", "radius", "breakpoint", "media"],
    "listing-date": ["color", "typography", "spacing", "radius", "breakpoint", "motion"],
    "listing-popular": ["color", "typography", "spacing", "radius", "breakpoint"],
    "listing-unusual": ["color", "typography", "spacing", "radius", "breakpoint", "media"],
    "listing-weekend": ["color", "typography", "spacing", "radius", "breakpoint", "motion"],
    "personal-feed": ["color", "typography", "spacing", "radius", "breakpoint", "motion", "state", "storage"],
    "search": ["color", "typography", "spacing", "radius", "breakpoint", "motion", "state"],
    "special-state": ["color", "typography", "spacing", "radius", "state"],
}
foundation_aliases = {
    "color": ["color", "surface", "text"],
    "typography": ["typography", "font", "type"],
    "spacing": ["spacing", "space", "gap"],
    "radius": ["radius", "corner"],
    "shadow": ["shadow", "elevation"],
    "breakpoint": ["breakpoint", "viewport", "responsive"],
    "media": ["media", "aspect", "image"],
    "motion": ["motion", "transition", "duration"],
    "state": ["state", "status", "feedback", "error"],
    "storage": ["storage", "persistence"],
    "border": ["border", "stroke", "divider"],
}
foundations_path = ATLAS / "foundations.v1.json"
foundations = load(foundations_path)

def foundation_pointer(group: str) -> str:
    aliases = foundation_aliases[group]
    choices: list[tuple[int, str]] = []
    for parts, value in walk_values(foundations):
        haystack = "/".join(str(part) for part in parts).lower() + " " + (str(value).lower() if isinstance(value, (str, int, float, bool)) else "")
        if any(alias in haystack for alias in aliases):
            pointer = json_pointer(parts)
            choices.append((len(parts), pointer))
    pointer = sorted(choices)[0][1] if choices else "/"
    return f"catalog/reconstruction-atlas/v1/foundations.v1.json#{pointer}"

high_risk_rows = {key: evidence_rows(key) for key in STATE_SPECS}
contract_by_slug: dict[str, dict[str, Any]] = {}
changed_scopes: dict[str, list[str]] = {}

for path in contract_paths:
    slug = path.name.replace(".semantic-contract.v1.json", "")
    contract = load(path)
    contract["source_lock_id"] = LOCK_ID
    contract["foundations_usage"] = [
        {
            "foundation_group": group,
            "source_ref": foundation_pointer(group),
            "consumer_archetype": contract.get("archetype_id"),
        }
        for group in FOUNDATION_GROUPS[slug]
    ]
    scopes = ["consumer-specific foundations", "corrective semantic source lock"]

    dependencies = contract.get("component_dependencies", [])
    if isinstance(dependencies, list):
        for dependency in dependencies:
            if not isinstance(dependency, dict):
                continue
            component_id = str(dependency.get("component_id") or "")
            graph_node = graph_index.get(component_id)
            baseline_disposition = dependency.get("baseline_disposition") or dependency.get("disposition")
            if graph_node:
                effective = graph_node.get("disposition") or baseline_disposition
                dependency["baseline_disposition"] = baseline_disposition
                dependency["disposition"] = effective
                dependency["source_identity_contract"] = graph_node.get("source_identity_contract", [])
                dependency["identity_gate"] = graph_node.get("identity_gate")
            elif baseline_disposition in {"reuse_existing", "new_component"}:
                dependency["baseline_disposition"] = baseline_disposition
                dependency["disposition"] = "unresolved"
                dependency["source_identity_contract"] = []
                dependency["identity_gate"] = {
                    "status": "UNRESOLVED",
                    "reason": "component_missing_from_component_composition_graph",
                }
    scopes.append("exact component source identities / fail-closed dispositions")

    if slug in high_risk_rows:
        rows = high_risk_rows[slug]
        contract["state_evidence_version"] = "exact-astro-or-browser-computed.v1"
        contract["evidence_bound_states"] = rows
        contract["unresolved_state_ids"] = [row["state_id"] for row in rows if row["disposition"] == "unresolved"]
        if slug == "event-detail":
            contract["event_detail_layout_variants"] = [row for row in rows if row["state_id"].startswith("layout.")]
            contract["event_detail_mobile_media_variants"] = [row for row in rows if row["state_id"].startswith("mobile-media.")]
            contract["event_detail_transport_states"] = [row for row in rows if row["state_id"].startswith("transport.")]
            contract["event_detail_question_and_feedback_boundaries"] = [row for row in rows if row["state_id"].startswith("question-") or row["state_id"].startswith("feedback-boundary.")]
        elif slug == "focus-group":
            contract["focus_feedback_surfaces"] = rows
        elif slug == "search":
            contract["search_lifecycle_states"] = rows
        elif slug == "favorites":
            contract["favorites_lifecycle_states"] = rows
        elif slug == "personal-feed":
            contract["personal_feed_lifecycle_states"] = rows
        scopes.append("evidence-bound high-risk states")
    dump(path, contract)
    contract_by_slug[slug] = contract
    changed_scopes[path.name] = scopes

allowed_atlas_inputs = [
    "semantic-atlas.v1.json",
    "route-registry.v1.json",
    "source-census.v1.json",
    "foundations.v1.json",
    "fixtures.v1.json",
    "reuse-new-map.v1.json",
    "evidence/browser-observations.v1.json",
]
allowed_inputs: list[dict[str, Any]] = []
for relative_name in allowed_atlas_inputs:
    path = ATLAS / relative_name
    if path.is_file():
        allowed_inputs.append({"path": rel(path), "sha256": sha_file(path), "input_class": "browser_computed" if "browser-observations" in relative_name else "semantic_atlas"})

exact_astro_paths: set[str] = set()
for contract in contract_by_slug.values():
    for obj in walk_objects(contract):
        for ref_item in obj.get("source_refs", []) if isinstance(obj.get("source_refs"), list) else []:
            if isinstance(ref_item, dict) and ref_item.get("repository") == REPO and ref_item.get("path"):
                exact_astro_paths.add(ref_item["path"])
for node in nodes:
    if not isinstance(node, dict):
        continue
    for identity in node.get("source_identity_contract", []):
        for ref_item in identity.get("source_refs", []):
            if isinstance(ref_item, dict) and ref_item.get("path"):
                exact_astro_paths.add(ref_item["path"])

astro_inputs: list[dict[str, Any]] = []
for relative_path in sorted(exact_astro_paths):
    path = ASTRO_ROOT / relative_path
    if path.is_file():
        astro_inputs.append({
            "repository": REPO,
            "commit": ASTRO_SHA,
            "path": relative_path,
            "sha256": sha_file(path),
            "input_class": "astro_source",
        })

source_lock = {
    "schema_version": "global-archetype-semantic-source-lock.v1",
    "source_lock_id": LOCK_ID,
    "corrective_parent_sha": BASE_SHA,
    "astro_commit": ASTRO_SHA,
    "semantic_boundary": "Astro source, generated HTML, browser-computed observations, foundations and fixtures only.",
    "allowed_input_classes": ["astro_source", "generated_html", "browser_computed", "semantic_atlas", "foundations", "fixtures"],
    "design_system_inputs": allowed_inputs,
    "astro_source_inputs": astro_inputs,
    "route_registry_inherited_sha256": registry_hash,
    "byte_equality_proof": rel(proof_path),
}
source_lock_path = PKG / "source-lock.v1.json"
dump(source_lock_path, source_lock, sort_keys=True)

def collect_state_strings(value: Any) -> list[str]:
    strings: list[str] = []
    if isinstance(value, str):
        strings.append(value)
    elif isinstance(value, dict):
        for key, item in value.items():
            if key in {"state_id", "id", "state", "name"} and isinstance(item, str):
                strings.append(item)
            else:
                strings.extend(collect_state_strings(item))
    elif isinstance(value, list):
        for item in value:
            strings.extend(collect_state_strings(item))
    return strings

banned_visual_tokens = ["source-state-index", "dashboard", "coverage", "hash", "test", "service-review", "runtime-only"]
owner_pages: list[dict[str, Any]] = []
for slug, contract in sorted(contract_by_slug.items()):
    dependencies = contract.get("component_dependencies", []) if isinstance(contract.get("component_dependencies"), list) else []
    ui_components = sorted({
        dep.get("component_id") for dep in dependencies
        if isinstance(dep, dict) and dep.get("component_id") and dep.get("disposition") in {"reuse_existing", "new_component"}
    })
    patterns = [
        item.get("part_id") for item in contract.get("anatomy", [])
        if isinstance(item, dict) and item.get("part_id")
    ]
    responsive = contract.get("responsive_branches", []) if isinstance(contract.get("responsive_branches"), list) else []
    desktop_branches = [item for item in responsive if "desktop" in json.dumps(item, ensure_ascii=False).lower() or "wide" in json.dumps(item, ensure_ascii=False).lower()]
    mobile_branches = [item for item in responsive if "mobile" in json.dumps(item, ensure_ascii=False).lower() or "compact" in json.dumps(item, ensure_ascii=False).lower()]
    if slug in high_risk_rows:
        states = [row["state_id"] for row in high_risk_rows[slug] if row["materialization_eligible"]]
    else:
        states = sorted(set(collect_state_strings(contract.get("states", []))))
        states = [state for state in states if not any(token in state.lower() for token in banned_visual_tokens)][:24]
    owner_pages.append({
        "owner_page_key": f"owner.{slug}",
        "archetype_id": contract.get("archetype_id"),
        "foundations": [item["foundation_group"] for item in contract["foundations_usage"]],
        "ui_components": ui_components,
        "visual_patterns": patterns,
        "compositions": {
            "desktop": {"responsive_branches": desktop_branches, "region_ids": [region.get("region_id") for region in contract.get("regions", []) if isinstance(region, dict) and region.get("region_id")]},
            "mobile": {"responsive_branches": mobile_branches, "region_ids": [region.get("region_id") for region in contract.get("regions", []) if isinstance(region, dict) and region.get("region_id")]},
        },
        "visual_states": states,
    })

plan = {
    "schema_version": "global-archetype-ui-materialization-plan.v1",
    "materialization_scope": "ui_only",
    "allowed_content": ["foundations", "ui_components", "visual_patterns", "desktop_compositions", "mobile_compositions", "visual_states"],
    "forbidden_content": ["source-state indexes", "runtime dashboards", "status dashboards", "coverage dashboards", "gap dashboards", "hash dashboards", "test dashboards", "service review routes"],
    "owner_pages": owner_pages,
}
plan_path = PKG / "penpot-materialization-plan.v1.json"
dump(plan_path, plan)

new_contract_hashes = {path.name: sha_file(path) for path in contract_paths}
changed_contracts = [name for name in sorted(new_contract_hashes) if new_contract_hashes[name] != baseline_contract_hashes[name]]
contract_manifest_lines = "".join(f"{new_contract_hashes[path.name]}  {rel(path)}\n" for path in contract_paths)
new_graph_hash = sha_file(graph_path)
observed_states = sum(1 for rows in high_risk_rows.values() for row in rows if row["disposition"] == "observed")
unresolved_states = sum(1 for rows in high_risk_rows.values() for row in rows if row["disposition"] == "unresolved")

manifest = {
    "schema_version": "global-archetype-sot-v1.corrective",
    "status": "CORRECTIVE_CANDIDATE_READY_WITH_EXPLICIT_UNRESOLVED",
    "authority_mode": "reconstructed",
    "canonical": False,
    "corrective_parent_sha": BASE_SHA,
    "astro_commit": ASTRO_SHA,
    "source_lock_id": LOCK_ID,
    "baseline_byte_equality": {"status": "PASS", "proof": rel(proof_path)},
    "route_registry": {"path": rel(registry_path), "sha256": registry_hash, "byte_changed": False},
    "component_graph": {"path": rel(graph_path), "sha256": new_graph_hash, "identity_gate_summary": graph_gate_counts},
    "contracts": {"count": 17, "sorted_checksum_manifest_sha256": sha_bytes(contract_manifest_lines.encode("utf-8")), "changed": changed_contracts},
    "high_risk_state_evidence": {"observed": observed_states, "unresolved": unresolved_states},
    "outputs": {
        "source_lock": rel(source_lock_path),
        "ui_materialization_plan": rel(plan_path),
        "corrective_receipt": rel(receipt_path),
        "sha256_manifest": "catalog/global-archetype-sot-v1/sha256-manifest.v1.json",
    },
    "constraints": {"design_tool_mutation": False, "date_weekend_artifact_changes": False, "production_astro_changes": False, "merge": False, "promotion": False, "deploy": False},
}
manifest_path = PKG / "manifest.v1.json"
dump(manifest_path, manifest, sort_keys=True)

receipt = {
    "schema_version": "global-archetype-corrective-receipt.v1",
    "status": "PASS",
    "corrective_parent_sha": BASE_SHA,
    "astro_commit": ASTRO_SHA,
    "baseline_byte_equality_proof": rel(proof_path),
    "route_registry_sha256_before_after": {"before": expected_registry_hash, "after": registry_hash, "equal": expected_registry_hash == registry_hash},
    "baseline_graph_sha256": baseline_graph_hash,
    "corrected_graph_sha256": new_graph_hash,
    "baseline_contract_hashes": baseline_contract_hashes,
    "corrected_contract_hashes": new_contract_hashes,
    "changed_contracts": [
        {"file": name, "sha256": new_contract_hashes[name], "change_scopes": changed_scopes[name]}
        for name in changed_contracts
    ],
    "high_risk_state_evidence": {"observed": observed_states, "unresolved": unresolved_states},
    "component_identity_gate": graph_gate_counts,
}
dump(receipt_path, receipt, sort_keys=True)

tracked_hash_paths = [
    registry_path,
    graph_path,
    source_lock_path,
    plan_path,
    manifest_path,
    receipt_path,
    proof_path,
    ROOT / "scripts/global-archetype-sot-v1/build-corrective.py",
    ROOT / "tests/global-archetype-sot-v1-semantic-completeness.test.mjs",
] + contract_paths
sha_manifest = {
    "schema_version": "global-archetype-corrective-sha256-manifest.v1",
    "corrective_parent_sha": BASE_SHA,
    "astro_commit": ASTRO_SHA,
    "files": {rel(path): sha_file(path) for path in tracked_hash_paths if path.exists()},
    "contract_directory_sorted_manifest_sha256": sha_bytes(contract_manifest_lines.encode("utf-8")),
}
sha_manifest_path = PKG / "sha256-manifest.v1.json"
dump(sha_manifest_path, sha_manifest, sort_keys=True)

source_lock_text = source_lock_path.read_text(encoding="utf-8").lower()
for forbidden in ["/penpot/", "materialization-ir", "renderer", "penpot_component_id", "penpot_main_shape_id"]:
    if forbidden in source_lock_text:
        raise SystemExit(f"forbidden semantic source-lock token: {forbidden}")
if sha_file(registry_path) != expected_registry_hash:
    raise SystemExit("route registry was rewritten by corrective builder")
print(json.dumps({
    "status": "PASS",
    "route_registry_byte_equal": True,
    "changed_contracts": changed_contracts,
    "observed_high_risk_states": observed_states,
    "unresolved_high_risk_states": unresolved_states,
    "component_identity_gate": graph_gate_counts,
    "source_lock_id": LOCK_ID,
}, ensure_ascii=False, indent=2))
