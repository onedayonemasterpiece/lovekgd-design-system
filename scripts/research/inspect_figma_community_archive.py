#!/usr/bin/env python3
"""Inspect archived public Figma Community files without mutating Figma.

Input layout per file id:
  <input>/<file_id>/file.json.gz
  <input>/<file_id>/meta.json                 optional
  <input>/<file_id>/exports-meta.json         optional

Output:
  <output>/<slug>/summary.json
  <output>/<slug>/summary.md
  <output>/<slug>/inventory.csv
  <output>/<slug>/screenshots/*.png           when archived exports exist
  <output>/index.md

The script deliberately distinguishes direct archive observations from
interpretation. It does not infer canonical component identity or lifecycle.
"""

from __future__ import annotations

import argparse
import csv
import gzip
import json
import re
import shutil
import sys
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Iterable


FILE_SPECS = {
    "1509554620086084342": "t2d2-public-web",
    "1144567424019815189": "rosatom-design-system",
}
IMAGE_BUCKET = "https://figma-community-images.s3.us-west-1.amazonaws.com"
MAX_SCREENSHOTS = 24


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def load_file_json(path: Path) -> dict[str, Any]:
    try:
        with gzip.open(path, "rt", encoding="utf-8") as fh:
            return json.load(fh)
    except (gzip.BadGzipFile, OSError):
        return load_json(path)


def walk(node: dict[str, Any], page: str | None = None) -> Iterable[tuple[dict[str, Any], str | None]]:
    current_page = node.get("name") if node.get("type") == "CANVAS" else page
    yield node, current_page
    for child in node.get("children") or []:
        if isinstance(child, dict):
            yield from walk(child, current_page)


def bounds(node: dict[str, Any]) -> dict[str, float] | None:
    box = node.get("absoluteBoundingBox") or node.get("absoluteRenderBounds")
    if not isinstance(box, dict):
        return None
    required = ("x", "y", "width", "height")
    if not all(isinstance(box.get(k), (int, float)) for k in required):
        return None
    return {k: float(box[k]) for k in required}


def area(node: dict[str, Any]) -> float:
    box = bounds(node)
    return 0.0 if not box else box["width"] * box["height"]


def safe_name(value: str) -> str:
    value = re.sub(r"[^0-9A-Za-zА-Яа-я_.-]+", "-", value.strip())
    return value.strip("-")[:100] or "node"


def compact_properties(node: dict[str, Any]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    definitions = node.get("componentPropertyDefinitions")
    if isinstance(definitions, dict):
        for key, definition in definitions.items():
            if not isinstance(definition, dict):
                continue
            result[key] = {
                "type": definition.get("type"),
                "defaultValue": definition.get("defaultValue"),
                "preferredValues": definition.get("preferredValues"),
            }
    return result


def parse_variant_name(name: str) -> dict[str, str]:
    result: dict[str, str] = {}
    for part in name.split(","):
        if "=" not in part:
            continue
        key, value = part.split("=", 1)
        key, value = key.strip(), value.strip()
        if key and value:
            result[key] = value
    return result


def union_bounds(nodes: Iterable[dict[str, Any]]) -> dict[str, float] | None:
    boxes = [bounds(node) for node in nodes]
    boxes = [box for box in boxes if box]
    if not boxes:
        return None
    x0 = min(box["x"] for box in boxes)
    y0 = min(box["y"] for box in boxes)
    x1 = max(box["x"] + box["width"] for box in boxes)
    y1 = max(box["y"] + box["height"] for box in boxes)
    return {"x": x0, "y": y0, "width": x1 - x0, "height": y1 - y0}


def download(url: str, destination: Path) -> bool:
    destination.parent.mkdir(parents=True, exist_ok=True)
    try:
        request = urllib.request.Request(url, headers={"User-Agent": "LoveKGD-research/1.0"})
        with urllib.request.urlopen(request, timeout=90) as response:
            destination.write_bytes(response.read())
        return True
    except Exception as exc:  # external archive; record failure instead of hiding it
        print(f"warning: download failed {url}: {exc}", file=sys.stderr)
        return False


def analyze(file_id: str, slug: str, input_root: Path, output_root: Path) -> dict[str, Any]:
    input_dir = input_root / file_id
    output_dir = output_root / slug
    output_dir.mkdir(parents=True, exist_ok=True)

    file_path = input_dir / "file.json.gz"
    if not file_path.exists():
        raise FileNotFoundError(file_path)

    data = load_file_json(file_path)
    document = data.get("document") or {}
    meta = load_json(input_dir / "meta.json") if (input_dir / "meta.json").exists() else {}
    export_meta = (
        load_json(input_dir / "exports-meta.json")
        if (input_dir / "exports-meta.json").exists()
        else {}
    )

    indexed: dict[str, tuple[dict[str, Any], str | None]] = {}
    type_counts: Counter[str] = Counter()
    page_counts: dict[str, Counter[str]] = defaultdict(Counter)
    text_names: Counter[str] = Counter()
    auto_layout_counts: Counter[str] = Counter()
    component_sets: list[dict[str, Any]] = []
    components_in_tree: list[dict[str, Any]] = []

    for node, page in walk(document):
        node_id = str(node.get("id") or "")
        if node_id:
            indexed[node_id] = (node, page)
        node_type = str(node.get("type") or "UNKNOWN")
        type_counts[node_type] += 1
        if page:
            page_counts[page][node_type] += 1
        if node.get("layoutMode"):
            auto_layout_counts[str(node["layoutMode"])] += 1
        if node_type == "TEXT":
            name = str(node.get("name") or "").strip()
            if name:
                text_names[name] += 1
        if node_type == "COMPONENT_SET":
            variants = []
            for child in node.get("children") or []:
                if isinstance(child, dict) and child.get("type") == "COMPONENT":
                    variants.append(
                        {
                            "id": child.get("id"),
                            "name": child.get("name"),
                            "parsed_axes": parse_variant_name(str(child.get("name") or "")),
                        }
                    )
            axes: dict[str, set[str]] = defaultdict(set)
            for variant in variants:
                for key, value in variant["parsed_axes"].items():
                    axes[key].add(value)
            component_sets.append(
                {
                    "id": node.get("id"),
                    "name": node.get("name"),
                    "page": page,
                    "variant_count": len(variants),
                    "axes": {key: sorted(values) for key, values in axes.items()},
                    "property_definitions": compact_properties(node),
                    "bounds": bounds(node),
                    "variants": variants[:120],
                }
            )
        elif node_type == "COMPONENT":
            components_in_tree.append(
                {
                    "id": node.get("id"),
                    "name": node.get("name"),
                    "page": page,
                    "properties": compact_properties(node),
                    "bounds": bounds(node),
                }
            )

    pages = []
    for page in document.get("children") or []:
        if not isinstance(page, dict) or page.get("type") != "CANVAS":
            continue
        top_level = [child for child in page.get("children") or [] if isinstance(child, dict)]
        pages.append(
            {
                "id": page.get("id"),
                "name": page.get("name"),
                "top_level_count": len(top_level),
                "node_count": sum(page_counts[str(page.get("name"))].values()),
                "type_counts": dict(page_counts[str(page.get("name"))].most_common()),
                "canvas_bounds": union_bounds(top_level),
                "top_level": [
                    {
                        "id": node.get("id"),
                        "name": node.get("name"),
                        "type": node.get("type"),
                        "bounds": bounds(node),
                        "child_count": len(node.get("children") or []),
                        "layoutMode": node.get("layoutMode"),
                    }
                    for node in sorted(top_level, key=area, reverse=True)[:100]
                ],
            }
        )

    style_counts = Counter()
    for style in (data.get("styles") or {}).values():
        if isinstance(style, dict):
            style_counts[str(style.get("styleType") or "UNKNOWN")] += 1

    archive_components = data.get("components") or {}
    archive_component_sets = data.get("componentSets") or {}

    summary: dict[str, Any] = {
        "observation_kind": "public-community-archive-readback",
        "authority_effect": "none",
        "canonical": False,
        "file_id": file_id,
        "slug": slug,
        "file": {
            "name": data.get("name") or meta.get("name"),
            "lastModified": data.get("lastModified") or meta.get("lastModified"),
            "version": data.get("version") or meta.get("version"),
            "thumbnailUrl": data.get("thumbnailUrl") or meta.get("thumbnailUrl"),
            "role": data.get("role"),
            "editorType": data.get("editorType"),
        },
        "counts": {
            "pages": len(pages),
            "nodes": sum(type_counts.values()),
            "component_sets_in_tree": len(component_sets),
            "components_in_tree": len(components_in_tree),
            "archive_component_registry": len(archive_components),
            "archive_component_set_registry": len(archive_component_sets),
            "styles": len(data.get("styles") or {}),
            "exportable_nodes": len((export_meta.get("map") or {})),
        },
        "node_type_counts": dict(type_counts.most_common()),
        "auto_layout_counts": dict(auto_layout_counts.most_common()),
        "style_type_counts": dict(style_counts.most_common()),
        "pages": pages,
        "component_sets": sorted(component_sets, key=lambda x: (x.get("page") or "", x.get("name") or "")),
        "standalone_components": sorted(components_in_tree, key=lambda x: (x.get("page") or "", x.get("name") or ""))[:500],
        "frequent_text_layer_names": text_names.most_common(100),
        "limitations": [
            "Archived public Community snapshot, not a live Figma library read-back.",
            "Variables API data is not guaranteed to exist in the archived file response.",
            "A visually polished object is not evidence of code binding or current lifecycle status.",
            "No LoveKGD identity, acceptance or promotion is inferred from this read-back.",
        ],
    }

    screenshots_dir = output_dir / "screenshots"
    screenshot_records: list[dict[str, Any]] = []
    export_map = export_meta.get("map") or {}
    candidates = []
    for node_id in export_map:
        record = indexed.get(str(node_id))
        if not record:
            continue
        node, page = record
        if node.get("type") in {"FRAME", "SECTION", "COMPONENT_SET", "COMPONENT", "INSTANCE"}:
            candidates.append((area(node), str(node_id), node, page))
    candidates.sort(reverse=True, key=lambda item: item[0])

    selected: list[tuple[float, str, dict[str, Any], str | None]] = []
    seen_pages: Counter[str] = Counter()
    for item in candidates:
        _, _, node, page = item
        page_key = page or "unknown"
        if seen_pages[page_key] >= 4:
            continue
        selected.append(item)
        seen_pages[page_key] += 1
        if len(selected) >= MAX_SCREENSHOTS:
            break

    for _, node_id, node, page in selected:
        filename = f"{safe_name(page or 'page')}__{safe_name(str(node.get('name') or node_id))}__{node_id.replace(':', '-')}.png"
        url = f"{IMAGE_BUCKET}/{file_id}/exports/{node_id}.png"
        destination = screenshots_dir / filename
        if download(url, destination):
            screenshot_records.append(
                {
                    "node_id": node_id,
                    "name": node.get("name"),
                    "type": node.get("type"),
                    "page": page,
                    "bounds": bounds(node),
                    "path": str(destination.relative_to(output_dir)),
                    "archive_url": url,
                }
            )

    thumbnail_url = summary["file"].get("thumbnailUrl")
    if isinstance(thumbnail_url, str) and thumbnail_url:
        thumbnail_path = output_dir / "community-thumbnail.png"
        if download(thumbnail_url, thumbnail_path):
            summary["community_thumbnail"] = str(thumbnail_path.relative_to(output_dir))

    summary["screenshots"] = screenshot_records

    with (output_dir / "summary.json").open("w", encoding="utf-8") as fh:
        json.dump(summary, fh, ensure_ascii=False, indent=2)
        fh.write("\n")

    with (output_dir / "inventory.csv").open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(["kind", "page", "id", "name", "variant_count", "axes_or_properties"])
        for item in summary["component_sets"]:
            writer.writerow([
                "component_set",
                item.get("page"),
                item.get("id"),
                item.get("name"),
                item.get("variant_count"),
                json.dumps(item.get("axes") or item.get("property_definitions"), ensure_ascii=False),
            ])
        for item in summary["standalone_components"]:
            writer.writerow([
                "component",
                item.get("page"),
                item.get("id"),
                item.get("name"),
                "",
                json.dumps(item.get("properties"), ensure_ascii=False),
            ])

    markdown = [
        f"# {summary['file'].get('name') or slug} — direct archive read-back",
        "",
        "```text",
        "observation_kind: public-community-archive-readback",
        "authority_effect: none",
        "canonical: false",
        f"community_file_id: {file_id}",
        "```",
        "",
        "## Counts",
        "",
    ]
    for key, value in summary["counts"].items():
        markdown.append(f"- `{key}`: {value}")
    markdown.extend(["", "## Pages", ""])
    for page in pages:
        markdown.append(
            f"### {page['name']} — {page['node_count']} nodes, {page['top_level_count']} top-level objects"
        )
        markdown.append("")
        for item in page["top_level"][:20]:
            markdown.append(
                f"- `{item['type']}` `{item['id']}` — {item['name']}"
            )
        markdown.append("")
    markdown.extend(["## Component sets", ""])
    for item in summary["component_sets"][:250]:
        axes = ", ".join(f"{k}={v}" for k, v in item["axes"].items()) or "no parseable name axes"
        markdown.append(
            f"- **{item['name']}** · page `{item['page']}` · {item['variant_count']} variants · {axes}"
        )
    markdown.extend(["", "## Archived visual exports", ""])
    for shot in screenshot_records:
        markdown.append(
            f"- `{shot['page']}` / **{shot['name']}** (`{shot['node_id']}`) — `{shot['path']}`"
        )
    markdown.extend(["", "## Limitations", ""])
    markdown.extend(f"- {item}" for item in summary["limitations"])
    (output_dir / "summary.md").write_text("\n".join(markdown) + "\n", encoding="utf-8")
    return summary


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--file-id", action="append", dest="file_ids")
    args = parser.parse_args()

    file_ids = args.file_ids or list(FILE_SPECS)
    args.output.mkdir(parents=True, exist_ok=True)
    summaries = []
    for file_id in file_ids:
        summaries.append(analyze(file_id, FILE_SPECS.get(file_id, file_id), args.input, args.output))

    index = ["# Figma Community direct archive read-back", ""]
    for summary in summaries:
        name = summary["file"].get("name") or summary["slug"]
        index.append(
            f"- [{name}]({summary['slug']}/summary.md) — "
            f"{summary['counts']['pages']} pages, "
            f"{summary['counts']['component_sets_in_tree']} component sets, "
            f"{len(summary['screenshots'])} archived visual exports"
        )
    (args.output / "index.md").write_text("\n".join(index) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
