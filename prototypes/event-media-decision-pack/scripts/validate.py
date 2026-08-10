#!/usr/bin/env python3
"""Fail-closed validation for the Event Media visual decision pack."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageOps


PACK = Path(__file__).resolve().parents[1]
REPO = Path(__file__).resolve().parents[3]
PINNED_COMMIT = "66bc0d43e36299417626f992021cfb7299ddf704"
DECISION_IDS = [
    "decision.EM-CENSUS-001",
    "decision.EM-GOV-010",
    "decision.EM-LABRAIL-011",
]
VIEWPORT_IDS = ["desktop-1440x1024", "mobile-390x844"]
PNG_PATHS = [
    "prototypes/event-media-decision-pack/fixtures/poster-ocr-square-1x1-contain.png",
    *[
        f"prototypes/event-media-decision-pack/screenshots/{decision_id}.png"
        for decision_id in DECISION_IDS
    ],
]


def fail(message: str) -> None:
    raise AssertionError(message)


def read_jsonl(path: Path, *, canonical: bool = True) -> list[dict]:
    rows = []
    for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line:
            fail(f"blank JSONL line: {path}:{number}")
        row = json.loads(line)
        if canonical:
            compact = json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
            if line != compact:
                fail(f"non-canonical JSONL: {path}:{number}")
        rows.append(row)
    return rows


def raw_sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def image_facts(path: Path) -> tuple[int, int, str]:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        image.load()
    payload = image.width.to_bytes(4, "big") + image.height.to_bytes(4, "big") + image.tobytes()
    return image.width, image.height, hashlib.sha256(payload).hexdigest()


def git(root: Path, *args: str) -> str:
    return subprocess.check_output(["git", "-C", str(root), *args], text=True).strip()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--events-root",
        type=Path,
        default=Path("/home/dev/.codex/worktrees/events-bot-new/action-map-design-pinned-events"),
    )
    parser.add_argument(
        "--behavioral-root",
        type=Path,
        default=Path(
            "/home/dev/projects/events-bot-new/artifacts/codex/current-ui-behavioral-v1-1/"
            "run-31318132051/download/current-ui-behavioral-decoder-v1-1-capture-31318132051/"
            "capture/behavior-rasters"
        ),
    )
    args = parser.parse_args()
    events = args.events_root.resolve()
    if git(events, "rev-parse", "HEAD") != PINNED_COMMIT:
        fail("events evidence checkout is not at the pinned commit")
    if git(events, "status", "--porcelain"):
        fail("events evidence checkout is dirty; read-only authority must remain unchanged")

    cards = read_jsonl(REPO / "catalog/normalization/event-media/owner-decisions.jsonl")
    fixtures = read_jsonl(REPO / "catalog/normalization/event-media/decision-fixtures.jsonl")
    provenance = read_jsonl(PACK / "fixture-provenance.jsonl")
    behavioral_provenance = read_jsonl(PACK / "behavioral-evidence-provenance.jsonl")
    ledger = read_jsonl(
        REPO / "catalog/normalization/event-media/decision-visual-review-ledger.jsonl"
    )
    if [card["id"] for card in cards] != DECISION_IDS:
        fail("decision card identity/order drift")
    if len(fixtures) != 13 or [fixture["order"] for fixture in fixtures] != list(range(1, 14)):
        fail("fixture manifest must contain ordered fixtures 1..13")
    fixture_ids = [fixture["id"] for fixture in fixtures]
    options_by_decision = {card["id"]: [option["option_id"] for option in card["options"]] for card in cards}
    all_option_ids = [item for decision_id in DECISION_IDS for item in options_by_decision[decision_id]]
    if len(all_option_ids) != 9 or len(set(all_option_ids)) != 9:
        fail("expected nine unique options")

    if len(behavioral_provenance) != 9:
        fail("expected nine reviewed Behavioral capture evidence bindings")
    behavioral_root = args.behavioral_root.resolve()
    for row in behavioral_provenance:
        if row["decision"] != "NOT_MERGED":
            fail(f"Behavioral provenance decision drift: {row['path']}")
        if row["review_authority"] != "reviewed Behavioral Decoder v1.1 capture":
            fail(f"Behavioral provenance authority drift: {row['path']}")
        if not set(row["fixture_ids"]).issubset(set(fixture_ids)):
            fail(f"Behavioral provenance fixture reference drift: {row['path']}")
        path = behavioral_root / row["path"]
        if not path.is_file() or path.stat().st_size != row["bytes"] or raw_sha(path) != row["sha256"]:
            fail(f"reviewed Behavioral capture byte mismatch: {row['path']}")
        with Image.open(path) as image:
            if image.format != "PNG" or image.size != (row["width"], row["height"]):
                fail(f"reviewed Behavioral capture format/dimension mismatch: {row['path']}")

    # Exact L2 comparison contract: one board, fixture order and viewport pair per decision.
    expected_viewports = [viewport["id"] for viewport in fixtures[0]["required_viewports"]]
    if expected_viewports != VIEWPORT_IDS:
        fail("unexpected fixture viewport identity/order")
    for fixture in fixtures:
        if [viewport["id"] for viewport in fixture["required_viewports"]] != VIEWPORT_IDS:
            fail(f"fixture viewport drift: {fixture['id']}")
        bindings = fixture["reuse_contract"]["option_bindings"]
        if len(bindings) != 9:
            fail(f"fixture does not bind all nine options: {fixture['id']}")
        observed = [(row["decision_card_id"], row["option_id"]) for row in bindings]
        expected = [(decision_id, option_id) for decision_id in DECISION_IDS for option_id in options_by_decision[decision_id]]
        if observed != expected:
            fail(f"fixture option binding drift: {fixture['id']}")
        reuse = fixture["reuse_contract"]
        if reuse["same_source_bytes_crop_state_and_viewport_across_options"] is not True:
            fail(f"fail-open fixture reuse contract: {fixture['id']}")
        if reuse["only_decision_annotation_may_differ_between_options"] is not True:
            fail(f"fail-open annotation contract: {fixture['id']}")

    for card in cards:
        if card["status"] != "PENDING_OWNER_DECISION" or card["decision"] != "NOT_MERGED":
            fail(f"decision status drift: {card['id']}")
        if card["owner_decision_accepted"] or card["accepted_option_id"] is not None:
            fail(f"owner choice fabricated: {card['id']}")
        if card["implementation_authorized"] or card["migration_started"]:
            fail(f"implementation/migration fabricated: {card['id']}")
        if card["promotion_ready"] or card["product_value_gate_mode"] != "observe":
            fail(f"Product Value gate drift: {card['id']}")
        targets = {option["visual_comparison"]["visual_board_target"] for option in card["options"]}
        expected_target = f"prototypes/event-media-decision-pack/screenshots/{card['id']}.png"
        if targets != {expected_target}:
            fail(f"option board target drift: {card['id']}")
        for option in card["options"]:
            visual = option["visual_comparison"]
            if visual["fixture_ids"] != fixture_ids or visual["viewports"] != VIEWPORT_IDS:
                fail(f"option fixture/viewport substitution: {card['id']}:{option['option_id']}")
            if not visual["same_fixture_bytes_and_state_across_options"]:
                fail(f"option fixture contract is fail-open: {card['id']}:{option['option_id']}")
            if not visual["annotation_only_difference"]:
                fail(f"option visual claims an implemented variant: {card['id']}:{option['option_id']}")

    # Verify every pinned record directly against the pinned source corpus.
    preview = json.loads((events / "site/src/data/preview-events.json").read_text(encoding="utf-8"))
    event_by_id = {event["id"]: event for event in preview["events"]}
    for fixture in fixtures:
        source = fixture["source"]
        if source["kind"] == "pinned_git_blob":
            source_path = events / source["path"]
            if raw_sha(source_path) != source["sha256"]:
                fail(f"pinned Git blob SHA mismatch: {fixture['id']}")
            width, height, _ = image_facts(source_path)
            if (width, height) != (source["width"], source["height"]):
                fail(f"pinned Git blob dimensions mismatch: {fixture['id']}")
        elif source["kind"] == "pinned_real_event_asset_record":
            event = event_by_id[source["event_id"]]
            asset = event["image_assets"][source["asset_index"]]
            if event["title"] != source["event_title"]:
                fail(f"pinned event title mismatch: {fixture['id']}")
            if asset["src"] != source["src_from_pinned_record"]:
                fail(f"pinned event URL mismatch: {fixture['id']}")
            if (asset["width"], asset["height"]) != (source["width"], source["height"]):
                fail(f"pinned event dimensions mismatch: {fixture['id']}")
            if asset["current_pixel_sha256"] != source["expected_pixel_sha256"]:
                fail(f"pinned event pixel SHA mismatch: {fixture['id']}")

    expected_provenance_ids = {
        fixture["id"]
        for fixture in fixtures
        if fixture["render_contract"].get("output_path") is not None
    } | {"fixture.state-missing"}
    if len(provenance) != 9 or {row["fixture_id"] for row in provenance} != expected_provenance_ids:
        fail("fixture provenance row set mismatch")
    provenance_by_fixture = {row["fixture_id"]: row for row in provenance}
    for row in provenance:
        if row["decision"] != "NOT_MERGED":
            fail(f"fixture provenance decision drift: {row['fixture_id']}")
        if row["usage_scope"] != "existing_owner-controlled_internal_evidence_only":
            fail(f"fixture usage-scope drift: {row['fixture_id']}")
        if row["redistribution_rights_claimed"] or row["license_research_performed"]:
            fail(f"fixture rights/license overclaim: {row['fixture_id']}")
        path = REPO / row["path"]
        if not path.is_file() or path.stat().st_size != row["bytes"] or raw_sha(path) != row["raw_sha256"]:
            fail(f"materialized fixture byte mismatch: {row['fixture_id']}")
        width, height, pixel_sha = image_facts(path)
        if (width, height, pixel_sha) != (row["width"], row["height"], row["pixel_sha256"]):
            fail(f"materialized fixture pixel/dimension mismatch: {row['fixture_id']}")
        manifest = next(fixture for fixture in fixtures if fixture["id"] == row["fixture_id"])
        expected_output = manifest["render_contract"].get("output_path")
        if expected_output is not None and row["path"] != expected_output:
            fail(f"materialized fixture output-path mismatch: {row['fixture_id']}")
        if manifest["source"]["kind"] == "pinned_real_event_asset_record":
            if pixel_sha != manifest["source"]["expected_pixel_sha256"]:
                fail(f"vendored remote fixture is not pixel-identical to pinned record: {row['fixture_id']}")
    derived = provenance_by_fixture["fixture.photo-portrait-4x5-derived-cover"]
    if derived["derivation"] != {
        "engine": "sharp@0.34.5/libvips@8.17.3/webp@1.6.0",
        "fit": "cover",
        "format": "webp",
        "height": 1000,
        "position": "centre",
        "quality": 90,
        "source_raw_sha256": "25694145872cbb048155d9f60b9b0d9fdf7232430df5338c39853d7f217c1503",
        "width": 800,
        "without_enlargement": False,
    }:
        fail("derived 4:5 Sharp contract drift")

    # The HTML must be standalone, exact-card-bound and reproducible.
    index = PACK / "index.html"
    html = index.read_text(encoding="utf-8")
    with tempfile.TemporaryDirectory(prefix="emv-index-rebuild-") as temp:
        rebuilt = Path(temp) / "index.html"
        subprocess.check_call([sys.executable, str(PACK / "scripts/build-index.py"), "--output", str(rebuilt)])
        if rebuilt.read_bytes() != index.read_bytes():
            fail("standalone index is not a deterministic build of exact L2 cards")
    for card in cards:
        for value in (card["id"], card["question"], card["scoped_owner_prompt"]):
            if value not in html:
                fail(f"decision content absent from standalone HTML: {card['id']}")
        for option in card["options"]:
            if option["option_id"] not in html or option["label"] not in html:
                fail(f"option absent from standalone HTML: {card['id']}:{option['option_id']}")
    for fixture_id in fixture_ids:
        if fixture_id not in html:
            fail(f"fixture absent from standalone HTML: {fixture_id}")
    required_html = [
        "EVIDENCE ONLY · NON-PRODUCTION · NOT_MERGED",
        "Not an implemented variant.",
        "UNKNOWN-TEXT · METADATA STATE",
        "Boundary diagram · comparison only",
        "13 fixtures × 2 viewports × 3 options",
        "No redistribution or license claim.",
    ]
    if any(value not in html for value in required_html):
        fail("standalone HTML is missing required honest-status or comparison copy")
    if re.search(r"https?://", html, flags=re.IGNORECASE):
        fail("standalone HTML contains a network URL")
    for forbidden in (
        "CONTRACT_ACCEPTED",
        "READY_FOR_PHYSICAL_DEFRAGMENTATION",
        "PENPOT_READY",
        "DESIGN_SYSTEM_COMPLETE",
    ):
        if forbidden in html:
            fail(f"forbidden readiness/acceptance claim in standalone HTML: {forbidden}")
    renderer = (PACK / "scripts/render.mjs").read_text(encoding="utf-8")
    for setting in (
        'viewport: { width: 1920, height: 1080 }',
        'deviceScaleFactor: 1',
        'locale: "en-US"',
        'timezoneId: "UTC"',
        'reducedMotion: "reduce"',
        'serviceWorkers: "block"',
        'PLAYWRIGHT_BROWSERS_PATH = "/opt/ms-playwright"',
        'url.startsWith("file:") || url.startsWith("data:")',
    ):
        if setting not in renderer:
            fail(f"renderer determinism/local-only setting absent: {setting}")

    # Every PNG beneath the prototype has exactly one substantive review row.
    observed_pngs = sorted(str(path.relative_to(REPO)) for path in PACK.rglob("*.png"))
    if observed_pngs != sorted(PNG_PATHS):
        fail(f"unexpected prototype PNG set: {observed_pngs}")
    if len(ledger) != len(PNG_PATHS) or sorted(row["path"] for row in ledger) != sorted(PNG_PATHS):
        fail("visual review ledger is not a one-to-one binding for prototype PNGs")
    ledger_by_path = {row["path"]: row for row in ledger}
    for path_string in PNG_PATHS:
        row = ledger_by_path[path_string]
        path = REPO / path_string
        with Image.open(path) as image:
            if image.format != "PNG" or getattr(image, "n_frames", 1) != 1:
                fail(f"PNG is animated or has wrong format: {path_string}")
            if image.info:
                fail(f"PNG contains non-deterministic/unexpected metadata: {path_string}:{image.info}")
            width, height = image.size
        if path.stat().st_size != row["bytes"] or raw_sha(path) != row["sha256"]:
            fail(f"review ledger byte/hash mismatch: {path_string}")
        if (width, height) != (row["width"], row["height"]):
            fail(f"review ledger dimensions mismatch: {path_string}")
        if row["review_status"] != "reviewed-full-resolution" or row["full_resolution_opened"] is not True:
            fail(f"PNG not reviewed at full resolution: {path_string}")
        if row["decision"] != "NOT_MERGED" or row["viewport_ids"] != VIEWPORT_IDS:
            fail(f"review status/viewport context drift: {path_string}")
        if row["reviewer_id"] != "Codex GPT-5.6 Sol · L3 event_media_visual_pack":
            fail(f"reviewer identity drift: {path_string}")
        conclusion = row["conclusion"].lower()
        for evidence in ("full-resolution", "clip", "intact"):
            if evidence not in conclusion:
                fail(f"review conclusion lacks substantive {evidence} evidence: {path_string}")
        if "/screenshots/" in path_string:
            decision_id = Path(path_string).stem
            if row["decision_card_ids"] != [decision_id]:
                fail(f"board review decision context mismatch: {path_string}")
            if row["option_ids"] != options_by_decision[decision_id] or row["fixture_ids"] != fixture_ids:
                fail(f"board review option/fixture context mismatch: {path_string}")
            if not any(word in conclusion for word in ("reuse", "comparable", "repeats")):
                fail(f"board review lacks option comparability finding: {path_string}")
            if "not_merged" not in conclusion or "readable" not in conclusion:
                fail(f"board review lacks readability/status finding: {path_string}")
        else:
            if row["decision_card_ids"] != DECISION_IDS or row["option_ids"] != all_option_ids:
                fail("PNG fixture review is not bound to all decision/option contexts")
            if row["fixture_ids"] != ["fixture.poster-ocr-square-1x1-contain"]:
                fail("PNG fixture review has wrong fixture context")

    # Current lane may only touch its explicit writable scope.
    status_paths = []
    for line in git(REPO, "status", "--porcelain", "--untracked-files=all").splitlines():
        if line:
            status_paths.append(line[3:].split(" -> ")[-1])
    allowed = (
        "prototypes/event-media-decision-pack/",
        "catalog/normalization/event-media/decision-visual-review-ledger.jsonl",
        ".codex/lanes/event-media-visual-pack/RESULTS.md",
    )
    for path in status_paths:
        if not (path.startswith(allowed[0]) or path in allowed[1:]):
            fail(f"file outside L3 writable scope: {path}")

    print(
        json.dumps(
            {
                "status": "PASS",
                "decision_boards": 3,
                "options": 9,
                "fixtures": 13,
                "materialized_assets": len(provenance),
                "reviewed_behavioral_capture_bindings": len(behavioral_provenance),
                "pngs": len(PNG_PATHS),
                "review_rows": len(ledger),
                "viewports": VIEWPORT_IDS,
                "events_commit": PINNED_COMMIT,
            },
            sort_keys=True,
        )
    )


if __name__ == "__main__":
    main()
