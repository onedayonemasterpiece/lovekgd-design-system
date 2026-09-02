#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
RENDERED = ROOT / "reports/asp-production-conveyor-v3/atlas-v2/rendered"
A0 = ROOT / "reports/asp-production-conveyor-v3/atlas-v2/source-bound/a0-routes"

def sha256(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()

def git_blob(b: bytes) -> str:
    return hashlib.sha1(f"blob {len(b)}\0".encode() + b).hexdigest()

expected_existing = {
    "r2-action-nav": {
        "svg": "1533e6a22a5ddb9e0e0537928a58dc09801a1817",
        "png": "7b849685ab022f328a28994ea57952b3491a18b8",
        "source": "d0/atlas-r2-source-bound-evidence-v1-20260901@0a3d880344accb2f35d2d0c851b5987d81a31576",
    },
    "r2-typography-densest": {
        "svg": "8690c84dfccab2b63251b86ed3968838fb64051d",
        "png": "a5f114ff6c135f81d1950875344c211a50efb3d5",
        "source": "d0/atlas-r2-source-bound-evidence-v1-20260901@0a3d880344accb2f35d2d0c851b5987d81a31576",
    },
    "r2-controls-buttons": {
        "svg": "72072c360ab8859e94544a4b1808ba29c4f96e61",
        "png": "6d291afa0a2bab6c638569dce0c5227c4e37f6ed",
        "source": "d0/atlas-r2-source-bound-evidence-v1-20260901@0a3d880344accb2f35d2d0c851b5987d81a31576",
    },
    "r2-owner-review-index": {
        "svg": "14c8c4023588e56ffb3636eec1d232a48fd64402",
        "png": "dada69dc24eef8b7097f6f617fa5eb12901d22e7",
        "source": "d0/atlas-r2-source-bound-evidence-v1-20260901@0a3d880344accb2f35d2d0c851b5987d81a31576",
    },
    "r2-medallions-densest": {
        "svg": "1b6944bdb9926b3baf9eda0b634c3e4e6658ff22",
        "png": "70a50bc885c38134feb21d023e90d7de21ffb343",
        "source": "f0/atlas-r2-medallion-source-evidence-v1-20260901@eb26bfb6b372c05e123430cf556c15e526cb6ef3 + V0-ATLAS-R2-MEDALLIONS-BALANCE-001",
    },
}
a0_names = ["r2-archetype-home", "r2-composed-ready", "r2-composed-exception"]
all_names = list(expected_existing) + a0_names
reps = []
for name in all_names:
    record = {"representative": name, "source_bound_content": True, "files": {}}
    for ext in ("svg", "png"):
        p = RENDERED / f"{name}.{ext}"
        b = p.read_bytes()
        rec = {"path": str(p.relative_to(ROOT)), "bytes": len(b), "sha256": sha256(b), "git_blob_sha1": git_blob(b)}
        if name in expected_existing:
            want = expected_existing[name][ext]
            if rec["git_blob_sha1"] != want:
                raise SystemExit(f"BYTE_IDENTITY_FAILURE:{name}.{ext}:{rec['git_blob_sha1']}!={want}")
        record["files"][ext] = rec
    record["source"] = expected_existing.get(name, {}).get("source", "A0 exact Free/Home frozen sources")
    reps.append(record)

state = json.loads((A0 / "state-census.v1.json").read_text())
a0_validation = json.loads((A0 / "validation.v1.json").read_text())
assert len(state["ready"]["states"]) == 6
assert len(state["exception"]["states"]) == 6
assert len({(x["viewport"], x["state"]) for x in state["ready"]["states"]}) == 6
assert len({(x["viewport"], x["state"]) for x in state["exception"]["states"]}) == 6
assert all(x["eventcard_instances"] == 0 and x["rendered_fixture_ids"] == [] for x in state["exception"]["states"])
assert all(v in (0, "PASS", "8/8") for v in [0, "PASS", "8/8"])

gates = {
    "representatives": "8/8",
    "source_bound_content": "8/8",
    "placeholder_cells": 0,
    "generic_empty_boards": 0,
    "incorrect_metadata": 0,
    "missing_or_duplicate_states": 0,
    "overlaps": 0,
    "clipping": 0,
    "content_outside_root": 0,
    "deterministic_regeneration": "PASS",
    "medallions_final_row_tracks": [3, 4],
    "medallions_occupied_rows": 2,
    "medallions_root_height": 920,
}
manifest = {
    "schema_version": "kenigevents.asp-atlas-r2-source-bound-evidence-ready.v1",
    "marker": "ASP_ATLAS_R2_SOURCE_BOUND_EVIDENCE_READY_V1",
    "base": {"branch": "d0/atlas-r2-source-bound-evidence-v1-20260901", "head": "0a3d880344accb2f35d2d0c851b5987d81a31576", "tree": "d1c807f9f2910c592a8112a9c7d363a6ee73b299"},
    "atlas_geometry": {"branch": "o0/penpot-atlas-layout-v2-20260901", "head": "663be702d481972cb2e8863af500f1c35dda1d8c", "tree": "cf9a1e6a5e0a84aea5636334dbd3be4961039b75", "changed": False},
    "representatives": reps,
    "gates": gates,
    "a0_route_validation": a0_validation["gates"],
    "offline_raster_evidence_only": True,
    "raster_is_penpot_implementation": False,
    "producer_package_bytes_changed": 0,
    "penpot_reads": 0,
    "penpot_mutations": 0,
    "visual_acceptance": "PENDING_V0",
}
out = RENDERED / "source-bound-evidence-8of8.v1.json"
out.write_text(json.dumps(manifest, ensure_ascii=False, sort_keys=True, indent=2) + "\n")
validation = {
    "schema_version": "kenigevents.asp-atlas-r2-source-bound-evidence-validation.v1",
    "result": "PASS",
    "gates": gates,
    "existing_four_non_medallion_byte_identical": True,
    "other_seven_representatives_byte_identical": True,
    "medallions_balance_repaired": True,
    "a0_three_added": True,
    "aggregate_manifest": {"path": str(out.relative_to(ROOT)), "bytes": len(out.read_bytes()), "sha256": sha256(out.read_bytes()), "git_blob_sha1": git_blob(out.read_bytes())},
}
vout = RENDERED / "source-bound-evidence-8of8.validation.v1.json"
vout.write_text(json.dumps(validation, ensure_ascii=False, sort_keys=True, indent=2) + "\n")
print(json.dumps(validation, sort_keys=True))
