#!/usr/bin/env python3
"""Build the exact event-card icon registry from an immutable Astro tree."""
from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
import re
import subprocess
from typing import Any

SOURCE_COMMIT = "a68c7f23c4e014c6e9f66e95f394656e9cb0f411"
OUTPUT = pathlib.Path(
    "catalog/normalization/iconography/event-card-icon-registry-candidate-v1.json"
)
INLINE_NAMES = ("heart", "comment", "calendar", "dislike", "share", "ticket", "spark", "info")
INLINE_CONSUMERS = {
    "heart": ["event.card", "listing.event-card", "listing.rail-row", "festival.card", "exhibition.row"],
    "comment": ["exhibition.row"],
    "calendar": ["event.card"],
    "dislike": ["event.card", "exhibition.row"],
    "share": ["event.card", "listing.event-card", "exhibition.row"],
    "ticket": ["event.medallion-frame"],
    "spark": ["event.medallion-frame"],
    "info": ["event.medallion-frame"],
}
FESTIVAL_ICONS = (
    "103262-theatre-masks.svg",
    "389003-anchor.svg",
    "389049-book-open.svg",
    "389059-camera.svg",
    "389063-carrot.svg",
    "389241-history.svg",
    "389291-map-pin.svg",
    "389302-mic.svg",
    "389324-music.svg",
    "389330-palette.svg",
    "389439-star.svg",
    "389461-ticket.svg",
    "389494-users.svg",
    "480248-saxophone-2.svg",
)


def git_bytes(repo: pathlib.Path, commit: str, path: str) -> bytes:
    return subprocess.check_output(["git", "-C", str(repo), "show", f"{commit}:{path}"])


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def stable_hash(document: dict[str, Any]) -> str:
    clone = dict(document)
    clone.pop("contract_payload_sha256", None)
    payload = json.dumps(clone, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    return sha(payload)


def normalize_astro_svg_fragment(fragment: str) -> str:
    fragment = re.sub(r"^\s*//.*$", "", fragment, flags=re.M)
    fragment = fragment.replace("<>", "").replace("</>", "")
    return fragment.strip()


def extract_inline(source: str, name: str) -> str:
    pattern = rf"\{{name === '{re.escape(name)}' && \(\s*(.*?)\s*\n\s*\)\}}"
    match = re.search(pattern, source, re.S)
    if not match:
        raise SystemExit(f"could not extract Icon.astro branch: {name}")
    return normalize_astro_svg_fragment(match.group(1))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--events-repo", default="/home/dev/projects/events-bot-new")
    parser.add_argument("--commit", default=SOURCE_COMMIT)
    parser.add_argument("--root", default=".")
    args = parser.parse_args()
    repo = pathlib.Path(args.events_repo).resolve()
    root = pathlib.Path(args.root).resolve()

    icon_path = "site/src/components/Icon.astro"
    icon_bytes = git_bytes(repo, args.commit, icon_path)
    icon_source = icon_bytes.decode()
    icons: list[dict[str, Any]] = []
    for name in INLINE_NAMES:
        view_box = "0 0 32 32" if name == "calendar" else "0 0 512 512" if name == "dislike" else "0 0 24 24"
        fragment = extract_inline(icon_source, name)
        svg_markup = f'<svg viewBox="{view_box}" xmlns="http://www.w3.org/2000/svg">{fragment}</svg>'
        icons.append({
            "icon_id": f"icon.ui.{name}",
            "penpot_name": f"Icon/UI/{name}",
            "semantic_role": name,
            "source_type": "astro-inline-svg",
            "source_path": icon_path,
            "source_sha256": sha(icon_bytes),
            "geometry_sha256": sha(svg_markup.encode()),
            "source_view_box": view_box,
            "svg_markup": svg_markup,
            "optical_size_px": 24,
            "decorative_or_informative": "decorative-inside-labelled-control",
            "license_or_provenance": "repository-owned-or-source-comment-provenance",
            "status": "current",
            "production_consumers": INLINE_CONSUMERS[name],
        })

    rail_source_path = "site/src/components/listings/MobileListingRailRow.astro"
    rail_bytes = git_bytes(repo, args.commit, rail_source_path)
    rail_markup = '<svg viewBox="0 0 48 23" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5H40M31 2.5L40 11.5L31 20.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    icons.append({
        "icon_id": "icon.product.rail-arrow-right",
        "penpot_name": "Icon/Product/rail-arrow-right",
        "semantic_role": "horizontal-rail-continuation",
        "source_type": "astro-local-inline-svg",
        "source_path": rail_source_path,
        "source_sha256": sha(rail_bytes),
        "geometry_sha256": sha(rail_markup.encode()),
        "source_view_box": "0 0 48 23",
        "svg_markup": rail_markup,
        "optical_size_px": 48,
        "decorative_or_informative": "decorative-inside-event-link",
        "license_or_provenance": "repository-owned",
        "status": "current",
        "production_consumers": ["listing.rail-row"],
    })

    amber_path = "site/src/components/listings/AmberRailArtifact.astro"
    amber_bytes = git_bytes(repo, args.commit, amber_path)
    amber_markup = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="m4 10 4 4 8-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    icons.append({
        "icon_id": "icon.status.amber-found-check",
        "penpot_name": "Icon/Status/amber-found-check",
        "semantic_role": "artifact-collected",
        "source_type": "astro-local-inline-svg",
        "source_path": amber_path,
        "source_sha256": sha(amber_bytes),
        "geometry_sha256": sha(amber_markup.encode()),
        "source_view_box": "0 0 20 20",
        "svg_markup": amber_markup,
        "optical_size_px": 20,
        "decorative_or_informative": "decorative-with-adjacent-state-label",
        "license_or_provenance": "repository-owned",
        "status": "current",
        "production_consumers": ["artifact.amber-rail"],
    })

    festival_root = "site/public/assets/icons/festival-categories"
    for filename in FESTIVAL_ICONS:
        path = f"{festival_root}/{filename}"
        data = git_bytes(repo, args.commit, path)
        raw_markup = data.decode("utf-8", "replace")
        markup = raw_markup[raw_markup.lower().index("<svg"):]
        view_box = (re.search(r"viewBox\s*=\s*['\"]([^'\"]+)", markup, re.I) or [None, "unknown"])[1]
        slug = filename.removesuffix(".svg")
        icons.append({
            "icon_id": f"icon.editorial.festival.{slug}",
            "penpot_name": f"Icon/Editorial/Festival category/{slug}",
            "semantic_role": f"festival-category-{slug}",
            "source_type": "svg-asset",
            "source_path": path,
            "source_sha256": sha(data),
            "geometry_sha256": sha(data),
            "source_view_box": view_box,
            "svg_markup": markup,
            "optical_size_px": 24,
            "decorative_or_informative": "decorative-with-adjacent-category-label",
            "license_or_provenance": f"{festival_root}/ATTRIBUTION.md",
            "status": "current",
            "production_consumers": ["festival.card"],
        })

    document: dict[str, Any] = {
        "$schema": "../../../contracts/normalization/event-card-icon-registry-candidate.v1.schema.json",
        "schema_version": "event-card-icon-registry-candidate.v1",
        "package_id": "candidate.event-card-iconography-v1",
        "contract_version": "1.0.0-candidate.1",
        "contract_payload_sha256": "",
        "hash_scope": "whole-document-except-contract_payload_sha256",
        "lifecycle": "candidate",
        "authority_mode": "reconstructed",
        "canonical": False,
        "promotion_status": "not_promoted",
        "source_baseline": {
            "repository": "onedayonemasterpiece/events-bot-new",
            "exact_commit": args.commit,
            "iconography_contract_path": "site/src/data/design-system-iconography-contract.v1.json",
            "iconography_contract_sha256": sha(git_bytes(repo, args.commit, "site/src/data/design-system-iconography-contract.v1.json")),
        },
        "scope": "All exact icons rendered by the five event-card families and the nested Amber rail artifact.",
        "counts": {"icons": len(icons), "current": len(icons), "unclassified": 0},
        "icons": icons,
        "penpot_collection": {
            "page_id": "10a29786-8dcf-802c-8008-739d919b8bb2",
            "page_name": "25 — Iconography",
            "status": "not-materialized",
        },
        "consumer_invariant": "Every icon visible in a Penpot event-card/artifact master is a linked instance of exactly one registry-bound icon component.",
    }
    document["contract_payload_sha256"] = stable_hash(document)
    output = root / OUTPUT
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"output": str(output), "icons": len(icons), "hash": document["contract_payload_sha256"]}, indent=2))


if __name__ == "__main__":
    main()
