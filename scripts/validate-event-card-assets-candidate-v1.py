#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
import re
import sys
from jsonschema import Draft202012Validator

MED = "catalog/normalization/families/event-preview-representations/event-medallion-candidate-v1.json"
ART = "catalog/normalization/families/event-preview-representations/event-artifact-candidate-v1.json"
TAX = "catalog/normalization/families/event-preview-representations/event-card-taxonomy-candidate-v1.json"
MED_SCHEMA = "contracts/normalization/event-medallion-candidate.v1.schema.json"
ART_SCHEMA = "contracts/normalization/event-artifact-candidate.v1.schema.json"
UUID = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")


def fail(code: str, path: str, message: str) -> None:
    print(json.dumps({"status": "rejected", "error": {"code": code, "path": path, "diagnostic": message}}, sort_keys=True), file=sys.stderr)
    raise SystemExit(1)


def stable_hash(document: dict) -> str:
    clone = dict(document)
    clone.pop("contract_payload_sha256", None)
    return hashlib.sha256(json.dumps(clone, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()).hexdigest()


def schema_check(document: dict, schema: dict, path: str) -> None:
    Draft202012Validator.check_schema(schema)
    errors = sorted(Draft202012Validator(schema).iter_errors(document), key=lambda e: list(e.absolute_path))
    if errors:
        error = errors[0]
        fail("ECA_SCHEMA_REJECTED", path + "/" + "/".join(map(str, error.absolute_path)), error.message)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--require-penpot", action="store_true")
    args = parser.parse_args()
    root = pathlib.Path(args.root).resolve()
    med = json.loads((root / MED).read_text())
    art = json.loads((root / ART).read_text())
    tax = json.loads((root / TAX).read_text())
    schema_check(med, json.loads((root / MED_SCHEMA).read_text()), MED)
    schema_check(art, json.loads((root / ART_SCHEMA).read_text()), ART)
    for name, document in (("medallion", med), ("artifact", art)):
        expected = stable_hash(document)
        if document["contract_payload_sha256"] != expected:
            fail("ECA_HASH_MISMATCH", f"/{name}/contract_payload_sha256", f"expected {expected}")
        if document["source_baseline"]["exact_commit"] != "a68c7f23c4e014c6e9f66e95f394656e9cb0f411":
            fail("ECA_SOURCE_BASELINE_DRIFT", f"/{name}/source_baseline/exact_commit", "exact events-bot-new baseline required")
    if tax.get("package_bindings", {}).get("medallions", {}).get("contract_payload_sha256") != med["contract_payload_sha256"]:
        fail("ECA_TAXONOMY_MEDALLION_JOIN", "/package_bindings/medallions", "taxonomy hash join failed")
    if tax.get("package_bindings", {}).get("artifacts", {}).get("contract_payload_sha256") != art["contract_payload_sha256"]:
        fail("ECA_TAXONOMY_ARTIFACT_JOIN", "/package_bindings/artifacts", "taxonomy hash join failed")

    visuals = med["visuals"]
    bindings = med["bindings"]
    visual_ids = [item["stable_id"] for item in visuals]
    binding_ids = [item["binding_id"] for item in bindings]
    if len(visuals) != 42 or len(set(visual_ids)) != 42 or len(bindings) != 43 or len(set(binding_ids)) != 43:
        fail("ECA_MEDALLION_COUNTS", "/medallion", "42 unique visuals and 43 unique bindings required")
    kaup = next((item for item in visuals if item["stable_id"] == "medallion.identity.kaup"), None)
    if not kaup or set(kaup["binding_ids"]) != {"organizer:kaup", "festival:kaup"}:
        fail("ECA_KAUP_DEDUPE", "/medallion/deduplication", "Kaup must be one visual with two exact bindings")
    if any(not item["primary_asset"]["sha256"] or len(item["primary_asset"]["sha256"]) != 64 for item in visuals):
        fail("ECA_MEDALLION_ASSET_HASH", "/medallion/visuals", "every primary asset requires sha256")
    if len(med["source_baseline"]["registries"]) != 2 or sum(x["record_count"] for x in med["source_baseline"]["registries"]) != 39:
        fail("ECA_MEDALLION_REGISTRIES", "/medallion/source_baseline/registries", "28 organizer + 11 festival registry records required")

    runtime = art["runtime_product"]
    required_amber_states = {
        "presence=absent;lifecycle=idle;motion=full",
        "presence=amber-tail;lifecycle=idle;motion=full",
        "presence=amber-tail;lifecycle=awake;motion=full",
        "presence=amber-tail;lifecycle=keyboard-focus;motion=full",
        "presence=amber-tail;lifecycle=collecting-collected;motion=full",
        "presence=amber-tail;lifecycle=collected;motion=full",
        "presence=amber-tail;lifecycle=awake;motion=reduced",
        "presence=amber-tail;lifecycle=collected;motion=reduced",
    }
    if set(runtime["valid_state_keys"]) != required_amber_states:
        fail("ECA_AMBER_STATES", "/artifact/runtime_product/valid_state_keys", "exact eight source-proven states required")
    if runtime["placement_id"] != "weekend.rail.tail.v1" or runtime["rail_order"][-2:] != ["like", "amber-tail"]:
        fail("ECA_AMBER_PLACEMENT", "/artifact/runtime_product", "Amber must be mobile rail tail sibling after like")
    focus = art["focus_lab_prototype"]
    if focus["status"] != "lab-only-separate-from-amber" or len(focus["definitions"]) != 12 or {x["id"] for x in focus["definitions"]} != {f"FG-E{i:02d}" for i in range(1, 13)}:
        fail("ECA_FOCUS_SEPARATION", "/artifact/focus_lab_prototype", "exact separate FG-E01..FG-E12 lab prototype required")
    references = art["reference_inventory"]["items"]
    if len(references) != 7 or len({x["concept"] for x in references}) != 6:
        fail("ECA_REFERENCE_INVENTORY", "/artifact/reference_inventory", "7 source images / 6 concepts required")
    if any(x["source_status"] != "local-source-reference-untracked-at-exact-baseline" for x in references):
        fail("ECA_REFERENCE_AUTHORITY", "/artifact/reference_inventory/items", "untracked reference evidence must remain explicitly labelled")
    if any("not-implemented" not in x["status"] for x in references if x["concept"] != "Amber Cosmonaut"):
        fail("ECA_REFERENCE_PROMOTION", "/artifact/reference_inventory/items", "non-Amber concepts must remain not implemented")
    for index, item in enumerate(references):
        thumb = item.get("derived_review_thumbnail", {})
        thumb_path = root / thumb.get("repo_path", "")
        if not thumb_path.is_file() or hashlib.sha256(thumb_path.read_bytes()).hexdigest() != thumb.get("sha256"):
            fail("ECA_REFERENCE_THUMBNAIL", f"/artifact/reference_inventory/items/{index}/derived_review_thumbnail", "hash-bound lightweight review thumbnail required")
        if max(thumb.get("dimensions", [9999, 9999])) > 320 or thumb.get("use") != "Penpot review thumbnail only; not a production asset":
            fail("ECA_REFERENCE_THUMBNAIL_SCOPE", f"/artifact/reference_inventory/items/{index}/derived_review_thumbnail", "thumbnail must remain bounded review-only evidence")

    if args.require_penpot:
        collection = med["penpot_collection"]
        if collection.get("status") != "materialized-readback" or not UUID.fullmatch(str(collection.get("page_id", ""))):
            fail("ECA_MEDALLION_PENPOT", "/medallion/penpot_collection", "Page48 materialized readback required")
        if any(item["penpot_binding"].get("status") != "materialized-readback" or not UUID.fullmatch(str(item["penpot_binding"].get("component_id", ""))) for item in visuals):
            fail("ECA_MEDALLION_COMPONENTS", "/medallion/visuals", "all 42 native linked asset components required")
        frame = med["consumer_frame_contract"]["penpot_binding"]
        if frame.get("status") != "materialized-readback" or not UUID.fullmatch(str(frame.get("variant_container_id", ""))):
            fail("ECA_MEDALLION_FRAME", "/medallion/consumer_frame_contract/penpot_binding", "native frame variants required")
        page49 = art["penpot_collection"]
        if page49.get("status") != "materialized-readback" or not UUID.fullmatch(str(page49.get("page_id", ""))):
            fail("ECA_ARTIFACT_PENPOT", "/artifact/penpot_collection", "Page49 materialized readback required")
        for key in ("runtime_product", "collection_surface", "focus_lab_prototype"):
            binding = art[key]["penpot_binding"]
            if binding.get("status") != "materialized-readback" or not UUID.fullmatch(str(binding.get("variant_container_id", ""))):
                fail("ECA_ARTIFACT_COMPONENTS", f"/artifact/{key}/penpot_binding", "native variant container required")
    print(json.dumps({
        "status": "valid",
        "medallion_hash": med["contract_payload_sha256"],
        "artifact_hash": art["contract_payload_sha256"],
        "unique_visuals": len(visuals),
        "bindings": len(bindings),
        "amber_states": len(runtime["valid_state_keys"]),
        "focus_eggs": len(focus["definitions"]),
        "penpot_required": args.require_penpot,
    }, indent=2))


if __name__ == "__main__":
    main()
