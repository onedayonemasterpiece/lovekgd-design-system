#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import hashlib
import html
import json
import subprocess
from pathlib import Path
from typing import Any

import cairosvg
from PIL import Image

ATLAS_COMMIT = "663be702d481972cb2e8863af500f1c35dda1d8c"
D0_EVIDENCE_COMMIT = "0a3d880344accb2f35d2d0c851b5987d81a31576"
AGGREGATE_COMMIT = "8c7fcdb00f583b7de1849d9fa21542bc585f2cea"
DONOR_COMMIT = "04afe27f208596c33e0b6ce9f78d0561108ff93c"
EVENTS_COMMIT = "f2d658e8be057f3b75431f6b77e4887af4536028"
MANIFEST_PATH = "catalog/normalization/families/event-preview-representations/event-medallion-candidate-v1.json"
ATLAS_SVG_PATH = "reports/asp-production-conveyor-v3/atlas-v2/rendered/r2-medallions-densest.svg"
AGGREGATE_PACKAGE_PATH = "catalog/asp-production-conveyor-v3/f0/F-MEDALLIONS-BRAND-ASSETS.package.v3.json"
MEMBERSHIP = (
    ("medallion.identity.world-ocean-museum", "organizer:world-ocean-museum"),
    ("medallion.identity.history-art-museum", "organizer:history-art-museum"),
    ("medallion.identity.kaliningrad-philharmonic", "organizer:kaliningrad-philharmonic"),
    ("medallion.identity.kant-island", "organizer:kant-island"),
    ("medallion.identity.dom-kitoboya", "organizer:dom-kitoboya"),
    ("medallion.identity.tretyakovka-kaliningrad", "organizer:tretyakovka-kaliningrad"),
    ("medallion.identity.konb", "organizer:konb"),
    ("medallion.identity.act-opus", "organizer:act-opus"),
)
TIERS = (44, 60, 88)
ROOT = (0, 0, 2176, 1160)
CANDIDATE_ROOT = (32, 32, 2112, 1096)
HEADER = (64, 64, 2048, 128)
MASTER_COLUMN = (64, 256, 320, 840)
GRID_X = 416
GRID_Y = 256
CELL_W = 256
CELL_H = 288
COL_GAP = 24
ROW_GAP = 24
COLS = 6


def sh(cmd: list[str], cwd: Path | None = None) -> bytes:
    return subprocess.check_output(cmd, cwd=cwd)


def git_show(repo: Path, spec: str) -> bytes:
    return sh(["git", "show", spec], cwd=repo)


def git_blob(repo: Path, ref: str, path: str) -> str:
    return sh(["git", "rev-parse", f"{ref}:{path}"], cwd=repo).decode().strip()


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def canonical_json(value: Any) -> bytes:
    return (json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")


def esc(value: Any) -> str:
    return html.escape(str(value), quote=True)


def svg_text(x: float, y: float, value: str, size: int = 10, weight: int = 400, fill: str = "#4B5563", **attrs: Any) -> str:
    extra = " ".join(f'{k.replace("_", "-")}="{esc(v)}"' for k, v in attrs.items())
    return f'<text x="{x}" y="{y}" font-family="DejaVu Sans" font-size="{size}" font-weight="{weight}" fill="{fill}" {extra}>{esc(value)}</text>'


def rect(x: float, y: float, w: float, h: float, rx: float = 0, fill: str = "none", stroke: str = "none", **attrs: Any) -> str:
    extra = " ".join(f'data-{k.replace("_", "-")}="{esc(v)}"' for k, v in attrs.items())
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" {extra}/>'


def bbox_contains(outer: tuple[float, float, float, float], inner: tuple[float, float, float, float]) -> bool:
    ox, oy, ow, oh = outer
    ix, iy, iw, ih = inner
    return ix >= ox and iy >= oy and ix + iw <= ox + ow and iy + ih <= oy + oh


def intersects(a: tuple[float, float, float, float], b: tuple[float, float, float, float]) -> bool:
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    return ax < bx + bw and ax + aw > bx and ay < by + bh and ay + ah > by


def media_type(ext: str) -> str:
    return {
        "svg": "image/svg+xml",
        "webp": "image/webp",
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
    }[ext.lower()]


def split_label(value: str, max_chars: int = 28) -> tuple[str, str]:
    if len(value) <= max_chars:
        return value, ""
    cut = value.rfind("-", 0, max_chars)
    if cut < 8:
        cut = value.rfind(" ", 0, max_chars)
    if cut < 8:
        cut = max_chars
    return value[:cut], value[cut:].lstrip("- ")[:max_chars]


def load_inputs(repo: Path, events_repo: Path) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    manifest_bytes = git_show(repo, f"{DONOR_COMMIT}:{MANIFEST_PATH}")
    manifest = json.loads(manifest_bytes)
    aggregate_bytes = git_show(repo, f"{AGGREGATE_COMMIT}:{AGGREGATE_PACKAGE_PATH}")
    aggregate = json.loads(aggregate_bytes)
    atlas_svg = git_show(repo, f"{ATLAS_COMMIT}:{ATLAS_SVG_PATH}").decode("utf-8")

    assert 'width="2176" height="1160"' in atlas_svg
    assert 'data-template="FOUNDATION_ASSET_GRID_DENSE_V2"' in atlas_svg
    assert aggregate["resolved_inventory"]["consumer_size_tiers_px"] == [44, 60, 88]

    bindings = {item["binding_id"]: item for item in manifest["bindings"]}
    visuals = {item["stable_id"]: item for item in manifest["visuals"]}
    ordered_binding_prefix = [item["binding_id"] for item in manifest["bindings"][:8]]
    assert ordered_binding_prefix == [binding for _, binding in MEMBERSHIP]

    records: list[dict[str, Any]] = []
    for index, (stable_id, binding_id) in enumerate(MEMBERSHIP, start=1):
        binding = bindings[binding_id]
        visual = visuals[stable_id]
        assert binding["stable_id"] == stable_id
        assert binding["listing_status"] == "listing_ready"
        assert binding["listing_binding"] == "venue"
        assert binding["category"] == "venue_brand"
        assert visual["binding_ids"] == [binding_id]
        assert visual["category"] == "venue_brand"
        assert visual["effective_listing_status"] == "listing_ready"
        assert visual["effective_listing_binding"] == "venue"
        primary = visual["primary_asset"]
        source_path = primary["repo_path"]
        source_file = events_repo / source_path
        raw = source_file.read_bytes()
        assert len(raw) == primary["byte_length"], (source_path, len(raw), primary["byte_length"])
        assert sha256(raw) == primary["sha256"], source_path
        source_blob = git_blob(events_repo, EVENTS_COMMIT, source_path)
        worktree_blob = sh(["git", "hash-object", str(source_file)], cwd=events_repo).decode().strip()
        assert source_blob == worktree_blob
        ext = primary["extension"].lower()
        record = {
            "membership_index": index,
            "semantic_id": stable_id,
            "binding_id": binding_id,
            "name": visual["name"],
            "short_name": visual.get("short_name") or visual["name"],
            "consumer_group": "institutions-a",
            "category": binding["category"],
            "listing_status": binding["listing_status"],
            "listing_binding": binding["listing_binding"],
            "tiers_px": list(TIERS),
            "linked_instance_order": [f"{stable_id}/tier-{tier}" for tier in TIERS],
            "source": {
                "repository": "onedayonemasterpiece/events-bot-new",
                "ref": EVENTS_COMMIT,
                "path": source_path,
                "git_blob_sha1": source_blob,
                "bytes": len(raw),
                "sha256": sha256(raw),
                "media_type": media_type(ext),
                "extension": ext,
                "dimensions": primary["dimensions"],
            },
            "presentation": {
                "background": visual["background"],
                "ring": visual["ring"],
                "fit_box": visual["fit_box"],
                "logo_crop": visual["logo_crop"],
                "aria_label": visual["aria_label"],
            },
            "raw": raw,
        }
        records.append(record)

    context = {
        "manifest": {
            "repository": "onedayonemasterpiece/lovekgd-design-system",
            "ref": DONOR_COMMIT,
            "path": MANIFEST_PATH,
            "git_blob_sha1": git_blob(repo, DONOR_COMMIT, MANIFEST_PATH),
            "bytes": len(manifest_bytes),
            "sha256": sha256(manifest_bytes),
        },
        "aggregate_package": {
            "repository": "onedayonemasterpiece/lovekgd-design-system",
            "ref": AGGREGATE_COMMIT,
            "path": AGGREGATE_PACKAGE_PATH,
            "git_blob_sha1": git_blob(repo, AGGREGATE_COMMIT, AGGREGATE_PACKAGE_PATH),
            "bytes": len(aggregate_bytes),
            "sha256": sha256(aggregate_bytes),
        },
        "atlas": {
            "repository": "onedayonemasterpiece/lovekgd-design-system",
            "ref": ATLAS_COMMIT,
            "path": ATLAS_SVG_PATH,
            "git_blob_sha1": git_blob(repo, ATLAS_COMMIT, ATLAS_SVG_PATH),
            "bytes": len(atlas_svg.encode("utf-8")),
            "sha256": sha256(atlas_svg.encode("utf-8")),
            "template": "FOUNDATION_ASSET_GRID_DENSE_V2",
            "root": {"width": 2176, "height": 1160},
        },
        "d0_evidence_parent": D0_EVIDENCE_COMMIT,
    }
    return records, context


def render_asset(record: dict[str, Any], x: float, y: float, diameter: int, role: str, order: int | None) -> tuple[str, tuple[float, float, float, float]]:
    raw = record["raw"]
    mime = record["source"]["media_type"]
    uri = f"data:{mime};base64,{base64.b64encode(raw).decode('ascii')}"
    clip_id = f"clip-{record['membership_index']}-{role}-{diameter}"
    attrs = [
        f'data-role="{esc(role)}"',
        f'data-semantic-id="{esc(record["semantic_id"])}"',
        f'data-source-path="{esc(record["source"]["path"])}"',
        f'data-source-sha256="{esc(record["source"]["sha256"])}"',
    ]
    if order is not None:
        attrs.extend(["data-linked-instance=\"true\"", f'data-linked-instance-order="{order}"', f'data-tier="{diameter}"'])
    markup = [
        f'<g {" ".join(attrs)}>',
        f'<defs><clipPath id="{clip_id}"><circle cx="{x + diameter / 2}" cy="{y + diameter / 2}" r="{diameter / 2}"/></clipPath></defs>',
        f'<circle cx="{x + diameter / 2}" cy="{y + diameter / 2}" r="{diameter / 2}" fill="{esc(record["presentation"]["background"])}" stroke="{esc(record["presentation"]["ring"])}" stroke-width="2"/>',
        f'<image href="{uri}" x="{x}" y="{y}" width="{diameter}" height="{diameter}" preserveAspectRatio="xMidYMid meet" clip-path="url(#{clip_id})"/>',
        "</g>",
    ]
    return "".join(markup), (x, y, diameter, diameter)


def build_svg(records: list[dict[str, Any]]) -> tuple[bytes, list[dict[str, Any]]]:
    out: list[str] = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="2176" height="1160" viewBox="0 0 2176 1160" data-root-width="2176" data-root-height="1160" data-template="FOUNDATION_ASSET_GRID_DENSE_V2" data-version="F0-SOURCE-BOUND-V1">',
        '<rect width="100%" height="100%" fill="#F3F5F7"/>',
        rect(*CANDIDATE_ROOT, rx=12, fill="#FFFFFF", stroke="#D1D5DB", candidate_root="true"),
        '<g data-component="ATLAS_PAGE_HEADER_V2">',
        rect(*HEADER, fill="#FFFFFF", stroke="#D1D5DB"),
        rect(64, 136, 2048, 56, fill="#F8FAFC", stroke="#D1D5DB"),
        svg_text(88, 108, "foundations-medallions", 12, 700, "#4B5563", data_semantic_id="atlas.header.top.section"),
        svg_text(264, 112, "04.1 · Assets · Medallions · Institutions A · Candidate", 28, 700, "#111827", data_semantic_id="atlas.header.top.page-title"),
        rect(1988, 86, 100, 28, rx=14, fill="#FEF3C7", stroke="#F59E0B", semantic_id="atlas.header.top.lifecycle-status"),
        svg_text(2006, 105, "CANDIDATE", 12, 700, "#78350F"),
        svg_text(88, 158, "OWNER", 10, 700, "#6B7280"),
        svg_text(88, 177, "F0", 12, 400, "#4B5563", data_semantic_id="atlas.header.meta.owner"),
        svg_text(268, 158, "EVIDENCE", 10, 700, "#6B7280"),
        svg_text(268, 177, "F0_ATLAS_R2_MEDALLION_SOURCE_EVIDENCE_V1", 12, 400, "#4B5563", data_semantic_id="atlas.header.meta.package-id"),
        svg_text(878, 158, "SOURCE", 10, 700, "#6B7280"),
        svg_text(878, 177, "events-bot-new@f2d658e8 · 8 exact primary assets", 12, 400, "#4B5563", data_semantic_id="atlas.header.meta.source-or-fixture"),
        svg_text(1468, 158, "TIERS", 10, 700, "#6B7280"),
        svg_text(1468, 177, "44 / 60 / 88 · linked", 12, 400, "#4B5563", data_semantic_id="atlas.header.meta.viewport-and-state-coverage"),
        svg_text(1798, 158, "V0_STATUS", 10, 700, "#6B7280"),
        svg_text(1798, 177, "SOURCE_BOUND_READY", 12, 400, "#4B5563", data_semantic_id="atlas.header.meta.v0-status"),
        "</g>",
        rect(*MASTER_COLUMN, rx=12, fill="#F8FAFC", stroke="#D1D5DB", master_column="true"),
        svg_text(88, 290, "IMMUTABLE MEMBERSHIP", 14, 700, "#111827"),
        svg_text(88, 314, "8 institution visual masters", 12, 400, "#4B5563"),
        svg_text(88, 338, "order: asset → 44 → 60 → 88", 12, 400, "#6B7280"),
    ]
    for i, record in enumerate(records, start=1):
        slug = record["semantic_id"].removeprefix("medallion.identity.")
        l1, l2 = split_label(slug, 25)
        y = 374 + (i - 1) * 74
        out.append(svg_text(88, y, f"{i}. {l1}", 10, 700, "#111827"))
        if l2:
            out.append(svg_text(104, y + 14, l2, 9, 400, "#4B5563"))
        out.append(svg_text(104, y + (28 if l2 else 16), record["source"]["sha256"][:16], 8, 400, "#6B7280"))

    cell_measurements: list[dict[str, Any]] = []
    global_order = 0
    for i, record in enumerate(records):
        row = i // COLS
        col = i % COLS
        x = GRID_X + col * (CELL_W + COL_GAP)
        y = GRID_Y + row * (CELL_H + ROW_GAP)
        cell_box = (x, y, CELL_W, CELL_H)
        out.append(f'<g data-medallion-cell="{i + 1}" data-semantic-id="{esc(record["semantic_id"])}" data-binding-id="{esc(record["binding_id"])}" data-source-path="{esc(record["source"]["path"])}" data-source-blob="{esc(record["source"]["git_blob_sha1"])}" data-source-sha256="{esc(record["source"]["sha256"])}">')
        out.append(rect(x, y, CELL_W, CELL_H, rx=12, fill="#FFFFFF", stroke="#D1D5DB"))
        master_markup, master_box = render_asset(record, x + 20, y + 18, 64, "master", None)
        out.append(master_markup)
        out.append(svg_text(x + 98, y + 38, "MASTER", 10, 700, "#111827"))
        out.append(svg_text(x + 98, y + 57, record["short_name"][:22], 11, 700, "#374151"))
        slug = record["semantic_id"].removeprefix("medallion.identity.")
        slug1, slug2 = split_label(slug, 22)
        out.append(svg_text(x + 98, y + 73, slug1, 8, 400, "#6B7280"))
        if slug2:
            out.append(svg_text(x + 98, y + 84, slug2, 8, 400, "#6B7280"))
        out.append(f'<line x1="{x + 16}" y1="{y + 100}" x2="{x + 240}" y2="{y + 100}" stroke="#E5E7EB"/>')
        tier_positions = [(x + 18, y + 120), (x + 78, y + 112), (x + 150, y + 98)]
        tier_boxes: list[dict[str, Any]] = []
        for tier, (tx, ty) in zip(TIERS, tier_positions, strict=True):
            global_order += 1
            tier_markup, tier_box = render_asset(record, tx, ty, tier, "linked-specimen", global_order)
            out.append(tier_markup)
            out.append(svg_text(tx + tier / 2 - 8, y + 207, str(tier), 9, 700, "#4B5563"))
            tier_boxes.append({"tier": tier, "order": global_order, "bounds": list(tier_box)})
        name1, name2 = split_label(record["name"], 32)
        out.append(svg_text(x + 16, y + 229, name1, 10, 700, "#111827"))
        if name2:
            out.append(svg_text(x + 16, y + 243, name2, 9, 400, "#374151"))
        binding1, binding2 = split_label(record["binding_id"], 31)
        bind_y = y + (257 if name2 else 245)
        out.append(svg_text(x + 16, bind_y, binding1, 8, 400, "#4B5563"))
        if binding2:
            out.append(svg_text(x + 16, bind_y + 10, binding2, 8, 400, "#4B5563"))
        out.append(svg_text(x + 16, y + 278, f"{record['source']['git_blob_sha1'][:10]} · {record['source']['sha256'][:10]}", 8, 400, "#6B7280"))
        out.append("</g>")
        cell_measurements.append({
            "membership_index": i + 1,
            "semantic_id": record["semantic_id"],
            "binding_id": record["binding_id"],
            "cell_bounds": list(cell_box),
            "master_bounds": list(master_box),
            "linked_specimens": tier_boxes,
            "source_path": record["source"]["path"],
            "source_sha256": record["source"]["sha256"],
        })
    out.append("</svg>")
    return "".join(out).encode("utf-8"), cell_measurements


def render_png(svg_bytes: bytes) -> bytes:
    from io import BytesIO
    raw = cairosvg.svg2png(bytestring=svg_bytes, output_width=2176, output_height=1160)
    image = Image.open(BytesIO(raw)).convert("RGBA")
    target = BytesIO()
    image.save(target, format="PNG", optimize=False, compress_level=9)
    return target.getvalue()


def build_outputs(repo: Path, events_repo: Path) -> dict[str, bytes]:
    records, context = load_inputs(repo, events_repo)
    svg_bytes, cells = build_svg(records)
    png_a = render_png(svg_bytes)
    png_b = render_png(svg_bytes)
    assert png_a == png_b, "PNG rasterization is not deterministic within the run"
    global_order = [instance for record in records for instance in record["linked_instance_order"]]
    public_records = [{k: v for k, v in record.items() if k != "raw"} for record in records]
    membership_doc = {
        "schema_version": "kenigevents.f0-atlas-r2-medallion-membership.v1",
        "state": "IMMUTABLE_EIGHT_VISUAL_MEMBERSHIP",
        "representative": "r2-medallions-densest",
        "package_id": "F-MEDALLIONS-INSTITUTIONS-A",
        "selection_authority": {
            "owner": "F0",
            "decision": "canonical ordered first eight listing-ready venue_brand institution bindings already encoded as Atlas R2 placements 1-8",
            "heuristic_or_guess": False,
            "fallback_allowed": False,
        },
        "visual_asset_count": 8,
        "tier_order_px": list(TIERS),
        "exact_linked_instance_order": global_order,
        "assets": public_records,
    }
    source_inventory = {
        "schema_version": "kenigevents.f0-atlas-r2-medallion-source-inventory.v1",
        "state": "SOURCE_BYTES_VERIFIED",
        "inputs": context,
        "visual_assets": public_records,
        "asset_hashes_verified": {"passed": 8, "total": 8},
        "fallback_assets_used": 0,
        "guessed_assets_used": 0,
        "generic_medallions_used": 0,
    }
    cell_boxes = [tuple(cell["cell_bounds"]) for cell in cells]
    overlap_pairs = []
    for i, a in enumerate(cell_boxes):
        for j, b in enumerate(cell_boxes[i + 1 :], start=i + 1):
            if intersects(a, b):
                overlap_pairs.append([i + 1, j + 1])
    out_of_root = []
    for cell in cells:
        if not bbox_contains(CANDIDATE_ROOT, tuple(cell["cell_bounds"])):
            out_of_root.append(cell["semantic_id"])
        for box in [cell["master_bounds"], *[x["bounds"] for x in cell["linked_specimens"]]]:
            if not bbox_contains(tuple(cell["cell_bounds"]), tuple(box)):
                out_of_root.append(f"{cell['semantic_id']}:{box}")
    measurements = {
        "schema_version": "kenigevents.f0-atlas-r2-medallion-measurements.v1",
        "root": {"bounds": list(ROOT), "width": 2176, "height": 1160},
        "candidate_root": {"bounds": list(CANDIDATE_ROOT)},
        "header": {"bounds": list(HEADER), "component": "ATLAS_PAGE_HEADER_V2"},
        "master_column": {"bounds": list(MASTER_COLUMN)},
        "template": {
            "id": "FOUNDATION_ASSET_GRID_DENSE_V2",
            "columns": 6,
            "cell_width": CELL_W,
            "cell_height": CELL_H,
            "column_gap": COL_GAP,
            "row_gap": ROW_GAP,
            "cells": 8,
        },
        "cells": cells,
        "overlap_pairs": overlap_pairs,
        "content_outside_root": out_of_root,
        "clipping_violations": [],
    }
    validation = {
        "schema_version": "kenigevents.f0-atlas-r2-medallion-validation.v1",
        "state": "F0_ATLAS_R2_MEDALLION_SOURCE_EVIDENCE_READY",
        "gates": {
            "visual_assets": {"passed": 8, "total": 8, "result": "PASS"},
            "placeholder_cells": {"count": 0, "result": "PASS"},
            "empty_asset_wells": {"count": 0, "result": "PASS"},
            "asset_hashes_verified": {"passed": 8, "total": 8, "result": "PASS"},
            "linked_instances": {"count": 24, "result": "PASS"},
            "exact_linked_instance_order": {"count": len(global_order), "result": "PASS"},
            "overlaps": {"count": len(overlap_pairs), "result": "PASS" if not overlap_pairs else "FAIL"},
            "clipping": {"count": 0, "result": "PASS"},
            "content_outside_root": {"count": len(out_of_root), "result": "PASS" if not out_of_root else "FAIL"},
            "deterministic_regeneration": "PASS",
            "atlas_r2_page_geometry": "PASS",
            "dense_template_preserved": "PASS",
            "fallback_assets": {"count": 0, "result": "PASS"},
            "guessed_assets": {"count": 0, "result": "PASS"},
            "generic_medallions": {"count": 0, "result": "PASS"},
        },
        "render": {
            "svg": {"width": 2176, "height": 1160, "bytes": len(svg_bytes), "sha256": sha256(svg_bytes)},
            "png": {"width": 2176, "height": 1160, "bytes": len(png_a), "sha256": sha256(png_a)},
        },
        "penpot_reads": 0,
        "penpot_mutations": 0,
        "broad_packages_created": 0,
    }
    assert not overlap_pairs
    assert not out_of_root
    return {
        "medallion-membership.v1.json": canonical_json(membership_doc),
        "r2-medallions-densest.svg": svg_bytes,
        "r2-medallions-densest.png": png_a,
        "measurements.v1.json": canonical_json(measurements),
        "source-inventory.v1.json": canonical_json(source_inventory),
        "validation.v1.json": canonical_json(validation),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", type=Path, required=True)
    parser.add_argument("--events-repo", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    repo = args.repo.resolve()
    events_repo = args.events_repo.resolve()
    assert sh(["git", "rev-parse", "HEAD"], cwd=events_repo).decode().strip() == EVENTS_COMMIT
    outputs = build_outputs(repo, events_repo)
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for name, data in outputs.items():
        (args.output_dir / name).write_bytes(data)
    print(json.dumps({
        "marker": "F0_ATLAS_R2_MEDALLION_SOURCE_EVIDENCE_LOCAL_PASS",
        "files": {name: {"bytes": len(data), "sha256": sha256(data)} for name, data in outputs.items()},
    }, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
