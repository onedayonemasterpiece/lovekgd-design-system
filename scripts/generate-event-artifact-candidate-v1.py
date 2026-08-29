#!/usr/bin/env python3
"""Generate the candidate artifact/easter-egg contract from an exact events-bot-new Git tree."""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import pathlib
import re
import subprocess
from typing import Any

SOURCE_COMMIT = "a68c7f23c4e014c6e9f66e95f394656e9cb0f411"
OUTPUT = pathlib.Path("catalog/normalization/families/event-preview-representations/event-artifact-candidate-v1.json")
THUMBNAIL_ROOT = pathlib.Path("catalog/normalization/families/event-preview-representations/assets/artifact-reference-thumbnails")


def git_bytes(repo: pathlib.Path, commit: str, path: str) -> bytes:
    return subprocess.check_output(
        ["git", "-C", str(repo), "show", f"{commit}:{path}"],
        stderr=subprocess.DEVNULL,
    )


def sha_record(repo: pathlib.Path, commit: str, path: str, *, allow_untracked_reference: bool = False) -> dict[str, Any]:
    source_status = "tracked-at-exact-commit"
    try:
        data = git_bytes(repo, commit, path)
    except subprocess.CalledProcessError:
        if not allow_untracked_reference:
            raise
        data = (repo / path).read_bytes()
        source_status = "local-source-reference-untracked-at-exact-baseline"
    record: dict[str, Any] = {
        "path": path,
        "sha256": hashlib.sha256(data).hexdigest(),
        "byte_length": len(data),
        "source_status": source_status,
    }
    if path.endswith((".webp", ".png")):
        from PIL import Image

        with Image.open(io.BytesIO(data)) as image:
            record["dimensions"] = [image.width, image.height]
    return record


def stable_hash(document: dict[str, Any]) -> str:
    clone = dict(document)
    clone.pop("contract_payload_sha256", None)
    payload = json.dumps(clone, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    return hashlib.sha256(payload).hexdigest()


def derived_thumbnail(repo: pathlib.Path, source_path: str, root: pathlib.Path) -> dict[str, Any]:
    from PIL import Image
    source = repo / source_path
    stem = pathlib.Path(source_path).stem.replace(" ", "-").replace("(", "").replace(")", "")
    relative = THUMBNAIL_ROOT / f"{stem}.webp"
    output = root / relative
    output.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = image.convert("RGB")
        image.thumbnail((320, 240), Image.Resampling.LANCZOS)
        image.save(output, "WEBP", quality=78, method=6)
        dimensions = [image.width, image.height]
    data = output.read_bytes()
    return {
        "repo_path": str(relative),
        "sha256": hashlib.sha256(data).hexdigest(),
        "byte_length": len(data),
        "dimensions": dimensions,
        "derivation": "PIL LANCZOS max-320x240 RGB WebP quality-78 method-6",
        "use": "Penpot review thumbnail only; not a production asset",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--events-repo", default="/home/dev/projects/events-bot-new")
    parser.add_argument("--commit", default=SOURCE_COMMIT)
    parser.add_argument("--root", default=".")
    args = parser.parse_args()
    repo = pathlib.Path(args.events_repo).resolve()
    root = pathlib.Path(args.root).resolve()
    source_paths = [
        "site/src/components/listings/AmberRailArtifact.astro",
        "site/src/components/artifacts/ArtifactCollection.astro",
        "site/src/lib/artifacts.mjs",
        "site/src/components/FocusEggArtifact.astro",
        "site/src/components/FocusEggCollectionCard.astro",
        "site/src/components/FocusEggSavedListDemo.astro",
        "site/src/lib/focus-easter-eggs.ts",
        "docs/features/static-site-pages/amber-artifact-easter-egg.md",
    ]
    source_evidence = [sha_record(repo, args.commit, path) for path in source_paths]
    amber_assets = [
        sha_record(repo, args.commit, f"site/public/assets/gamification/amber-cosmonaut-{scale}x.webp")
        for scale in (1, 2, 3)
    ]
    reference_root = "docs/features/static-site-pages/references/artefact-collection-1"
    reference_specs = [
        ("Baltic Light", "Baltic-light.png", "source-reference-not-implemented"),
        ("Luise Queen Bridge", "Luise-queen-bridge.png", "source-reference-not-implemented"),
        ("Marzipan Heart", "Marzypan-heart.png", "source-reference-not-implemented"),
        ("Sedov Bell", "Sedov-bell.png", "source-reference-not-implemented"),
        ("Amber Cosmonaut", "amber-cosmonavt (3).png", "runtime-active-concept-source-reference"),
        ("Amber Cosmonaut", "cosmonavt.png", "distinct-visual-reference-not-separate-runtime-artifact"),
        ("Old Brick", "old-brick.png", "source-reference-not-implemented"),
    ]
    references = []
    for concept, filename, status in reference_specs:
        source_path = f"{reference_root}/{filename}"
        references.append({
            "concept": concept,
            "status": status,
            **sha_record(repo, args.commit, source_path, allow_untracked_reference=True),
            "derived_review_thumbnail": derived_thumbnail(repo, source_path, root),
        })
    focus_source = git_bytes(repo, args.commit, "site/src/lib/focus-easter-eggs.ts").decode()
    focus_defs = [
        {"id": egg_id, "title": title, "hint": hint, "family": family}
        for egg_id, title, hint, family in re.findall(
            r"\{ id: '(FG-E\d\d)', title: '([^']+)', hint: '([^']+)', family: '([^']+)' \}",
            focus_source,
        )
    ]
    document: dict[str, Any] = {
        "$schema": "../../../../contracts/normalization/event-artifact-candidate.v1.schema.json",
        "schema_version": "event-artifact-candidate.v1",
        "package_id": "candidate.event-artifact-collection-v1",
        "contract_version": "1.0.0-candidate.3",
        "contract_payload_sha256": "",
        "hash_scope": "whole-document-except-contract_payload_sha256",
        "lifecycle": "candidate",
        "authority_mode": "reconstructed",
        "canonical": False,
        "promotion_status": "not_promoted",
        "source_baseline": {
            "repository": "onedayonemasterpiece/events-bot-new",
            "exact_commit": args.commit,
            "source_evidence": source_evidence,
        },
        "runtime_product": {
            "artifact_id": "amber_cosmonaut",
            "collection_id": "kaliningrad_artifacts_v1",
            "collection_storage_key": "ke_artifact_collection_v1",
            "legacy_storage_key": "ke_amber_artifact_prototype_v1:tail",
            "placement_id": "weekend.rail.tail.v1",
            "production_status": "unavailable",
            "research_gate": {
                "site_modes": ["preview", "secret_candidate"],
                "flag": "PUBLIC_ENABLE_AMBER_ARTIFACT_RESEARCH=tail",
                "production_hard_block": True,
                "noindex_required": True,
            },
            "assets": amber_assets,
            "rail_geometry_px": {"slot": [94, 112], "art_1x": [74, 96], "art_2x": [149, 192], "art_3x": [223, 288]},
            "rail_order": ["summary", "media", "digest", "identities", "free", "like", "amber-tail"],
            "variant_axes": {
                "presence": ["absent", "amber-tail"],
                "lifecycle": ["idle", "awake", "keyboard-focus", "collecting-collected", "collected"],
                "motion": ["full", "reduced"],
            },
            "valid_state_keys": [
                "presence=absent;lifecycle=idle;motion=full",
                "presence=amber-tail;lifecycle=idle;motion=full",
                "presence=amber-tail;lifecycle=awake;motion=full",
                "presence=amber-tail;lifecycle=keyboard-focus;motion=full",
                "presence=amber-tail;lifecycle=collecting-collected;motion=full",
                "presence=amber-tail;lifecycle=collected;motion=full",
                "presence=amber-tail;lifecycle=awake;motion=reduced",
                "presence=amber-tail;lifecycle=collected;motion=reduced"
            ],
            "runtime_contract": {
                "wake_threshold": 0.72,
                "collect_event": "kenigevents:artifact-collected",
                "repeat_activation": "open-/artefakty/#amber_cosmonaut",
                "aria": ["aria-pressed", "changing aria-label", "aria-live found announcement"],
                "no_backend_transport": True,
            },
            "penpot_binding": {"status": "not-materialized", "page_id": None, "variant_container_id": None, "rail_instance_id": None},
        },
        "collection_surface": {
            "slot_count": 5,
            "implemented_artifact_count": 1,
            "reserved_future_slots": 4,
            "states": ["production-unavailable", "nonprod-empty-0-of-5", "found-1-of-5", "dialog-open-desktop", "dialog-open-mobile"],
            "responsive_layouts": ["desktop-five-column", "tablet-two-column", "mobile-one-column"],
            "review_presentation": {
                "dialog_open_required": True,
                "dialog_source_max_width_px": 760,
                "dialog_panel_layout": "180px artwork + flexible story column; mobile collapses to one column",
                "dialog_mobile_source_contract": "@media(max-width:850px) one-column centered panel; @media(max-width:430px) 112x145 artwork, max-height calc(100dvh - 24px), 20px horizontal padding",
                "required_review_states": ["dialog-open-desktop", "dialog-open-mobile"],
                "owner_comment_thread": 31,
                "required_copy": [
                    "Артефакт 01 · найдено",
                    "Янтарный космонавт",
                    "Янтарный космонавт напоминает о калининградской связи моря и космоса",
                    "История открыта только по локальной отметке этого браузера.",
                ],
                "forbidden_abbreviation": "dialog-open must not be represented only by a compact summary tile",
            },
            "forbidden_claim": "unimplemented reserved slots are not collectible artifacts",
            "penpot_binding": {"status": "not-materialized", "page_id": None, "variant_container_id": None},
        },
        "focus_lab_prototype": {
            "status": "lab-only-separate-from-amber",
            "program_id": "focus-2026-01",
            "rules_version": "focus-prize-pending-v1",
            "collection_version": "focus-eggs-v1",
            "placement_version": "focus-eggs-placement-v1",
            "storage_key": "kenigevents:focus-eggs:prototype:v1",
            "states": ["locked", "eligible", "found", "unavailable"],
            "densities": ["regular", "compact"],
            "definitions": focus_defs,
            "binding_ids": {
                "FocusArtifact": ["binding.f300cb7ac7560f97", "binding.5286981266b62c98"],
                "SavedDemo": ["binding.9852c8975443bba4", "binding.9252b77005b3f9dc"],
                "CollectionCard": ["binding.70ab1fd260916488", "binding.a72dedf9a83f501a"]
            },
            "penpot_binding": {"status": "not-materialized", "page_id": None, "variant_container_id": None},
        },
        "analytical_bindings": {
            "ArtifactCollection": ["binding.496bb662840aa110", "binding.575867c8bb2cd0b3"],
            "AmberRailArtifact": ["binding.1f82dfe328eaaf5d", "binding.1a93a370532f25d7"],
            "applications": ["application.0cf26a382b2eef95", "application.499c73aab79a5be6"]
        },
        "reference_inventory": {
            "status": "source-reference-not-implemented",
            "concept_count": 6,
            "source_image_count": 7,
            "review_presentation": {
                "fit": "contain",
                "aspect_ratio": "preserve-derived-thumbnail-dimensions",
                "cropping": "none",
                "stretching": "forbidden",
            },
            "items": references
        },
        "separation_invariants": [
            "Amber is the only runtime-active collectible",
            "Focus lab prototype is never merged into the Amber collection",
            "source-reference concepts are never labelled implemented",
            "rail has no unavailable or expired Amber state"
        ],
        "penpot_collection": {"page_name": "49 — Artifacts and easter eggs · Candidate collection v1", "page_id": None, "status": "not-materialized"},
    }
    if len(focus_defs) != 12:
        raise SystemExit(f"expected 12 focus definitions, got {len(focus_defs)}")
    document["contract_payload_sha256"] = stable_hash(document)
    output = root / OUTPUT
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"output": str(output), "focus_definitions": len(focus_defs), "hash": document["contract_payload_sha256"]}, indent=2))


if __name__ == "__main__":
    main()
