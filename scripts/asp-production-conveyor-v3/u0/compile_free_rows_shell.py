#!/usr/bin/env python3
"""Compile exact U0 free-collection rows and shell inputs for D0/MAT.

The compiler is intentionally Penpot-free. It validates ownership boundaries,
immutable source coordinates, A0 factual order, current-Astro shell anatomy,
asset gates and candidate-page safety. External immutable bytes are verified by
D0/INTEGRATE at the declared commits; this tool never discovers or substitutes
missing data or assets.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import sys
from typing import Any

ROWS_PATH = (
    "catalog/asp-production-conveyor-v3/u0/"
    "U-FREE-ROWS-2-PLUS-3.package.v1.json"
)
SHELL_PATH = "catalog/asp-production-conveyor-v3/u0/U-FREE-SHELL.package.v1.json"

REQ_SHA = "54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72"
SOURCE_COMMIT = "c7c3e2367db8fd8865a735c8b9f5df1ef2b6efd1"
SOURCE_TREE = "3c7b231d10e93866899cede299c3523c8b996711"
A0_COMMIT = "d85b38c7883d53f43b628d885513c5851c164b25"
A0_TREE = "d7778f5c674a414617124600629310f9a8c0fdd0"
A0_BLOB = "7165c7055040aeac87340e8773378f1cd50430b5"
A0_PROJECTION = "e645fb8e023c2271ee05b109bcc828e0e95959162ef3008653d0b2be08b4c471"
A0_STATE = "afeda31dfc19de3d98d35d4574cda757b01b8d5144c6227eaa60c3595a4e86f2"
EVENTCARD_COMMIT = "101e5a0b76084da0811be244fe0e7281910c1452"
EVENTCARD_BLOB = "6496f9fdf2c19cce06c2a07d5b4d48061afe5522"

EXPECTED_ROWS = {
    "free.events.row": {
        "group": "events",
        "count": 2,
        "fixtures": ["event.real.8006", "event.real.8200"],
        "heading": "2 событий",
    },
    "free.exhibitions.row": {
        "group": "exhibitions",
        "count": 3,
        "fixtures": ["event.real.2182", "event.real.6711", "event.real.7609"],
        "heading": "Бесплатные выставки · 3",
    },
}

EXPECTED_INSTANCE_ORDER = [
    "free.events.row.event.real.8006",
    "free.events.row.event.real.8200",
    "free.exhibitions.row.event.real.2182",
    "free.exhibitions.row.event.real.6711",
    "free.exhibitions.row.event.real.7609",
]

EXPECTED_SOURCE_FILES = {
    "route": (
        "site/src/pages/podborki/[slug]/index.astro",
        "3d4333ef611efccf7e3dec5c16e5bcf0d6f14654",
    ),
    "free-surface": (
        "site/src/components/FreeCollectionSurface.astro",
        "c76e94893efc0241b555e2fa0eaa08ba789bb696",
    ),
    "event-layout": (
        "site/src/layouts/EventLayout.astro",
        "f90eb29949841f72755254e52d58912fc6f27b2e",
    ),
    "search-collection-data": (
        "site/src/data/searchCollections.ts",
        "b9b8a80fbeaa26fa8185d67a06e55714dcf140c1",
    ),
    "breadcrumbs": (
        "site/src/components/Breadcrumbs.astro",
        "a38066c8ffe75bf0cb41a224578fc0d7ae268667",
    ),
    "mobile-bottom-nav": (
        "site/src/components/MobileBottomNav.astro",
        "54fe6d86372e531a1d0320cd52afbdbbb5e10448",
    ),
    "site-footer": (
        "site/src/components/SiteFooter.astro",
        "3c74525a41be0dfb88fa882a62404941ac95b572",
    ),
    "brand-lockup": (
        "site/src/components/brand/AnnouncementsLockup.astro",
        "8e493372e75d52cec258e97ffc5ae6f5af554a64",
    ),
    "global-foundations": (
        "site/src/styles/design-system.css",
        "4d54d3c59f8f1a4e844953edf8d9c86078ccb8c1",
    ),
}

EXPECTED_ANATOMY = {
    "shell.desktop-header",
    "shell.mobile-header",
    "shell.breadcrumbs",
    "shell.free-hero",
    "shell.free-medallion.hero",
    "shell.free-medallion.sticky",
    "shell.section.events",
    "shell.section.exhibitions",
    "shell.site-footer",
    "shell.mobile-bottom-nav",
}

EXPECTED_SCENARIOS = {
    "a0.free.desktop.top.v1": ([1280, 800], "top", "normal"),
    "a0.free.desktop.scrolled.v1": ([1280, 800], "scrolled", "sticky/floating"),
    "a0.free.desktop.full.v1": ([1280, 800], "full", "sticky/floating"),
    "a0.free.mobile.top.v1": ([390, 844], "top", "normal"),
    "a0.free.mobile.scrolled.v1": ([390, 844], "scrolled", "sticky/floating"),
    "a0.free.mobile.full.v1": ([390, 844], "full", "sticky/floating"),
}

EXPECTED_NAV_ASSETS = {
    "icon.navigation.ticket",
    "icon.navigation.calendar",
    "icon.navigation.search",
    "icon.navigation.personal",
}

EXPECTED_MEDALLION = {
    "asset_id": "asset.badge.free-listing-medallion",
    "source_repository": "onedayonemasterpiece/events-bot-new",
    "source_commit": SOURCE_COMMIT,
    "source_path": "site/public/assets/badges/free-listing-medallion.svg",
    "git_blob_sha1": "3f6f7aadf0dc818112ab310875d8ad270c563b45",
    "sha256": "27cc37743a0212868f28edbf3b1f0b6ad5033241d93154b26501cb7538122b31",
    "bytes": 754,
    "viewBox": "0 0 512 512",
    "central_registry_status": "MISSING_PENDING_F0",
    "fallback": False,
}


class ContractError(AssertionError):
    """Raised on any unsafe or stale producer contract."""


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ContractError(message)


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(
        value,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")


def digest(value: Any) -> str:
    return hashlib.sha256(canonical_bytes(value)).hexdigest()


def load(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ContractError(f"cannot load {path}: {exc}") from exc
    require(isinstance(value, dict), f"{path}: root must be object")
    return value


def validate_lifecycle(package: dict[str, Any], package_id: str) -> None:
    require(package.get("package_id") == package_id, f"{package_id}: wrong package ID")
    require(package.get("owner") == "U0", f"{package_id}: wrong owner")
    require(package.get("priority") == "P0", f"{package_id}: wrong priority")
    require(
        package.get("status") == "READY_FOR_D0_INTEGRATE",
        f"{package_id}: unsafe lifecycle status",
    )
    lifecycle = package["lifecycle"]
    require(
        lifecycle.get("ready_for_d0_integrate") is True,
        f"{package_id}: integration readiness missing",
    )
    require(
        lifecycle.get("ready_to_publish") is False,
        f"{package_id}: U0 may not self-approve publication",
    )
    require(
        lifecycle.get("penpot_mutations_by_u0") == 0,
        f"{package_id}: U0 Penpot mutation is forbidden",
    )
    require(
        lifecycle.get("sole_penpot_writer") == "/root/publish_r2",
        f"{package_id}: wrong sole writer",
    )
    require(
        package["requirements_contract"].get("sha256") == REQ_SHA,
        f"{package_id}: requirements tuple mismatch",
    )


def validate_a0_authority(authority: dict[str, Any], *, state: bool = False) -> None:
    require(authority.get("commit") == A0_COMMIT, "A0 commit mismatch")
    if "tree" in authority:
        require(authority.get("tree") == A0_TREE, "A0 tree mismatch")
    require(authority.get("git_blob_sha1") == A0_BLOB, "A0 bundle blob mismatch")
    require(authority.get("projection_record_sha256") == A0_PROJECTION, "A0 projection mismatch")
    if state:
        require(authority.get("state_packet_sha256") == A0_STATE, "A0 state packet mismatch")


def validate_rows(rows: dict[str, Any]) -> None:
    require(
        rows.get("schema_version") == "kenigevents.asp-u0-free-rows-package.v1",
        "rows: wrong schema",
    )
    validate_lifecycle(rows, "U-FREE-ROWS-2-PLUS-3")
    require(rows["scope"].get("route") == "/podborki/besplatnye-sobytiya/", "rows: route")
    require(rows["scope"].get("rows") == 2, "rows: row count")
    require(rows["scope"].get("eventcard_instances") == 5, "rows: instance count")
    validate_a0_authority(rows["factual_authority"])

    source = rows["current_astro_authority"]
    require(source.get("commit") == SOURCE_COMMIT, "rows: Source-A commit")
    require(source.get("tree") == SOURCE_TREE, "rows: Source-A tree")
    require(
        source.get("surface_git_blob_sha1") == EXPECTED_SOURCE_FILES["free-surface"][1],
        "rows: free-surface blob",
    )
    require(
        source.get("route_git_blob_sha1") == EXPECTED_SOURCE_FILES["route"][1],
        "rows: route blob",
    )
    require(
        source.get("search_collections_git_blob_sha1")
        == EXPECTED_SOURCE_FILES["search-collection-data"][1],
        "rows: collection-data blob",
    )

    eventcard = rows["eventcard_dependency"]
    require(eventcard.get("commit") == EVENTCARD_COMMIT, "rows: EventCard commit")
    require(eventcard.get("git_blob_sha1") == EVENTCARD_BLOB, "rows: EventCard blob")
    require(
        eventcard.get("row_publication_requires_eventcard_v0_pass") is True,
        "rows: EventCard visual gate missing",
    )
    require(
        eventcard.get("runtime_state_at_package_time")
        == "R6_REPAIR_ACTIVE_AFTER_REVISION_58_VISIBLE_WITH_DIFF",
        "rows: EventCard runtime status is stale",
    )

    matrix = rows["row_matrix"]
    require(len(matrix) == 2, "rows: matrix must contain two rows")
    by_id = {row.get("row_id"): row for row in matrix}
    require(set(by_id) == set(EXPECTED_ROWS), "rows: row identities")
    require(len(by_id) == len(matrix), "rows: duplicate row ID")
    for row_id, expected in EXPECTED_ROWS.items():
        row = by_id[row_id]
        require(row.get("source_group") == expected["group"], f"{row_id}: group")
        require(row.get("count") == expected["count"], f"{row_id}: count")
        require(row.get("fixture_order") == expected["fixtures"], f"{row_id}: order")
        require(row.get("visible_heading") == expected["heading"], f"{row_id}: heading")
    exhibition = by_id["free.exhibitions.row"]
    require(
        exhibition.get("eyebrow") == "Можно посетить в течение дня",
        "rows: exhibition eyebrow",
    )
    require(
        "calendar" in exhibition.get("calendar_contract", "")
        and "no synthetic date" in exhibition.get("calendar_contract", ""),
        "rows: exhibition calendar safety",
    )

    composition = rows["composition_contract"]
    require(composition.get("source_grid_class") == "cards-grid", "rows: grid class")
    require(
        composition.get("mobile_override")
        == {"media": "max-width:759px", "grid_template_columns": "minmax(0,1fr)"},
        "rows: mobile layout",
    )
    require(
        composition.get("order_policy") == "exact factual-authority order; DOM order equals visual order",
        "rows: ordering policy",
    )
    require(composition.get("duplicate_eventcard_masters") is False, "rows: duplicate masters")

    instances = rows["instance_contract"]
    require([item.get("instance_id") for item in instances] == EXPECTED_INSTANCE_ORDER, "rows: instance order")
    require(len({item.get("instance_id") for item in instances}) == 5, "rows: duplicate instance")
    require(
        [(item.get("row_id"), item.get("position")) for item in instances]
        == [
            ("free.events.row", 0),
            ("free.events.row", 1),
            ("free.exhibitions.row", 0),
            ("free.exhibitions.row", 1),
            ("free.exhibitions.row", 2),
        ],
        "rows: position contract",
    )

    target = rows["expected_candidate_materialization"]
    require(target.get("target_page_id") is None, "rows: invented page ID")
    require(target.get("roots") == 2, "rows: target roots")
    require(target.get("eventcard_instances") == 5, "rows: target instances")
    require(target.get("new_eventcard_component_masters") == 0, "rows: duplicate master creation")
    require(target.get("screenshots") == 0, "rows: screenshot implementation")
    require(target.get("old_penpot_uuids") == 0, "rows: old UUID lineage")
    require(target.get("validation") == [], "rows: terminal validation")
    require(rows["materialization_entry_point"].get("penpot_adapter_included") is False, "rows: Penpot adapter")


def validate_shell(shell: dict[str, Any]) -> None:
    require(
        shell.get("schema_version") == "kenigevents.asp-u0-free-shell-package.v1",
        "shell: wrong schema",
    )
    validate_lifecycle(shell, "U-FREE-SHELL")
    lifecycle = shell["lifecycle"]
    require(
        lifecycle.get("blocking_asset_gate") == "F0_FREE_MEDALLION_AND_NAV_ASSET_REGISTRY",
        "shell: asset gate missing",
    )
    require(
        lifecycle.get("blocking_component_gate") == "U_FREE_ROWS_PLUS_EVENTCARD_R6",
        "shell: component gate missing",
    )

    source = shell["current_astro_authority"]
    require(source.get("commit") == SOURCE_COMMIT, "shell: Source-A commit")
    require(source.get("tree") == SOURCE_TREE, "shell: Source-A tree")
    files = {
        item.get("role"): (item.get("path"), item.get("git_blob_sha1"))
        for item in source.get("source_files", [])
    }
    require(files == EXPECTED_SOURCE_FILES, "shell: source file lock")

    content = shell["route_content"]
    require(content.get("slug") == "besplatnye-sobytiya", "shell: slug")
    require(content.get("title") == "Бесплатные события", "shell: title")
    require(
        content.get("description")
        == "Все актуальные события с подтверждённым бесплатным входом, включая продолжающиеся выставки.",
        "shell: description",
    )
    require(
        content.get("criteria")
        == "Событие активно, ещё не закончилось, а в выгрузке афиши вход подтверждён как бесплатный.",
        "shell: criteria",
    )
    require(content.get("mobile_section_literal_from_route") == "home", "shell: mobile literal")
    require(
        content.get("mobile_section_domain_from_component")
        == ["afisha", "dates", "search", "personal", None],
        "shell: mobile domain",
    )
    require(content.get("mobile_nav_current_match_count") == 0, "shell: current nav state")
    require(
        content.get("source_contract_mismatch") == "MOBILE_SECTION_HOME_OUTSIDE_DECLARED_DOMAIN",
        "shell: source mismatch must be explicit",
    )
    require(
        "do not silently map home to afisha" in content.get("package_policy", ""),
        "shell: silent nav remapping allowed",
    )

    anatomy = shell["anatomy"]
    by_id = {item.get("id"): item for item in anatomy}
    require(set(by_id) == EXPECTED_ANATOMY, "shell: anatomy coverage")
    require(len(by_id) == len(anatomy), "shell: duplicate anatomy ID")
    sticky = by_id["shell.free-medallion.sticky"]
    require(sticky.get("activation") == "hero.getBoundingClientRect().bottom <= top + 16", "shell: sticky activation")
    require(sticky.get("desktop") == {"top_px": 57, "size_px": 58, "z_index": 48}, "shell: sticky desktop")
    require(sticky.get("mobile") == {"top_px": 64, "size_px": 50, "z_index": 35}, "shell: sticky mobile")
    require(sticky.get("reduced_motion") == "transition:none", "shell: reduced motion")
    nav = by_id["shell.mobile-bottom-nav"]
    require(nav.get("columns") == 4 and nav.get("z_index") == 40, "shell: mobile nav geometry")
    require(nav.get("current_item") is None, "shell: invented selected navigation item")
    require({item[2] for item in nav.get("items", [])} == EXPECTED_NAV_ASSETS, "shell: nav slots")

    state = shell["state_authority"]
    validate_a0_authority(state, state=True)
    scenarios = state.get("scenarios", [])
    require(len(scenarios) == 6, "shell: scenario count")
    by_scenario = {item.get("scenario_id"): item for item in scenarios}
    require(set(by_scenario) == set(EXPECTED_SCENARIOS), "shell: scenario identities")
    for scenario_id, (viewport, scroll, medallion) in EXPECTED_SCENARIOS.items():
        item = by_scenario[scenario_id]
        require(item.get("viewport") == viewport, f"{scenario_id}: viewport")
        require(item.get("scroll_state") == scroll, f"{scenario_id}: scroll")
        require(item.get("medallion") == medallion, f"{scenario_id}: medallion")
    require(
        state.get("runtime")
        == {
            "auth": "anonymous",
            "clock": "2026-09-01T12:00:00+02:00",
            "personalization": "off",
            "randomness": "forbidden",
        },
        "shell: deterministic runtime",
    )

    assets = shell["asset_bindings"]
    require(assets.get("free_medallion") == EXPECTED_MEDALLION, "shell: medallion identity")
    mobile_assets = assets["mobile_navigation"]
    require(set(mobile_assets.get("required_asset_ids", [])) == EXPECTED_NAV_ASSETS, "shell: nav asset set")
    require(mobile_assets.get("central_registry_status") == "MISSING_PENDING_F0", "shell: nav registry state")
    require(mobile_assets.get("fallback") is False, "shell: nav fallback")
    require(assets["brand_and_footer"].get("fallback") is False, "shell: brand fallback")

    donor = shell["donor_reuse"]
    require(donor.get("pr") == 43, "shell: donor PR")
    require(donor.get("commit") == "da16dde8812220125a806bd5a03d5015357d4c07", "shell: donor commit")
    require(donor.get("classification") == "REUSE_STRUCTURE_AFTER_RECONSTRUCTION", "shell: donor classification")
    require("old Penpot UUIDs" in donor.get("forbidden", []), "shell: old UUID prohibition")

    target = shell["target_candidate"]
    require(target.get("exact_page_id") is None, "shell: invented page ID")
    require(target.get("resolution_owner") == "D0/INTEGRATE", "shell: page resolution owner")
    require(target.get("active_page_profile_required") is True, "shell: page profile gate")
    require(target.get("scenario_roots") == 6, "shell: target scenario roots")
    require(target.get("clearly_marked_candidate") is True, "shell: candidate marker")
    require(target.get("screenshots") == 0, "shell: screenshot implementation")
    require(target.get("old_penpot_uuids") == 0, "shell: old UUID lineage")
    require(target.get("validation") == [], "shell: terminal validation")
    require(shell["materialization_entry_point"].get("penpot_adapter_included") is False, "shell: Penpot adapter")


def validate_cross(rows: dict[str, Any], shell: dict[str, Any]) -> None:
    dependency = shell["row_dependency"]
    require(dependency.get("package_id") == rows.get("package_id"), "cross: row package ID")
    require(dependency.get("path") == ROWS_PATH, "cross: row package path")
    require(dependency.get("required_instances") == 5, "cross: row instance count")
    anatomy = {item["id"]: item for item in shell["anatomy"]}
    require(
        anatomy["shell.section.events"].get("child_package")
        == "U-FREE-ROWS-2-PLUS-3#free.events.row",
        "cross: events row binding",
    )
    require(
        anatomy["shell.section.exhibitions"].get("child_package")
        == "U-FREE-ROWS-2-PLUS-3#free.exhibitions.row",
        "cross: exhibitions row binding",
    )


def compile_rows(rows: dict[str, Any]) -> dict[str, Any]:
    validate_rows(rows)
    payload = {
        "schema_version": "kenigevents.u0-free-rows-mat-input.v1",
        "package_id": rows["package_id"],
        "owner": "U0",
        "consumer": "D0/MAT",
        "requirements_contract": rows["requirements_contract"],
        "factual_authority": rows["factual_authority"],
        "current_astro_authority": rows["current_astro_authority"],
        "eventcard_dependency": rows["eventcard_dependency"],
        "row_matrix": rows["row_matrix"],
        "composition_contract": rows["composition_contract"],
        "instance_contract": rows["instance_contract"],
        "expected_candidate_materialization": rows["expected_candidate_materialization"],
        "gates": {
            "eventcard_r6_native_readback": "REQUIRED",
            "eventcard_v0_visual_pass": "REQUIRED",
            "active_target_page_profile": "REQUIRED",
            "active_run_marker": "REQUIRED",
        },
    }
    return {
        "integrity": {
            "canonicalization": "UTF-8 sorted compact JSON",
            "payload_sha256": digest(payload),
        },
        **payload,
    }


def compile_shell(rows: dict[str, Any], shell: dict[str, Any]) -> dict[str, Any]:
    validate_rows(rows)
    validate_shell(shell)
    validate_cross(rows, shell)
    payload = {
        "schema_version": "kenigevents.u0-free-shell-mat-input.v1",
        "package_id": shell["package_id"],
        "owner": "U0",
        "consumer": "D0/MAT",
        "requirements_contract": shell["requirements_contract"],
        "current_astro_authority": shell["current_astro_authority"],
        "route_content": shell["route_content"],
        "anatomy": shell["anatomy"],
        "state_authority": shell["state_authority"],
        "asset_bindings": shell["asset_bindings"],
        "rows_input_sha256": digest(compile_rows(rows)),
        "donor_reuse": shell["donor_reuse"],
        "target_candidate": shell["target_candidate"],
        "gates": {
            "d0_integrate_exact_remote_bytes": "REQUIRED",
            "active_page_profile_and_page_id": "REQUIRED",
            "f0_free_medallion_registry": "REQUIRED",
            "f0_mobile_navigation_registry": "REQUIRED",
            "rows_input": "REQUIRED",
            "eventcard_r6_and_v0": "REQUIRED_FOR_FULL_PAGE_ACCEPTANCE",
            "active_run_marker": "REQUIRED",
        },
    }
    return {
        "integrity": {
            "canonicalization": "UTF-8 sorted compact JSON",
            "payload_sha256": digest(payload),
        },
        **payload,
    }


def render(value: dict[str, Any]) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n").encode("utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--rows", action="store_true")
    mode.add_argument("--shell", action="store_true")
    parser.add_argument("--repo", default=None)
    parser.add_argument("--rows-manifest", default=ROWS_PATH)
    parser.add_argument("--shell-manifest", default=SHELL_PATH)
    parser.add_argument("--check-repository-inputs", action="store_true")
    parser.add_argument("--emit", default="-")
    parser.add_argument("--check-output", default=None)
    args = parser.parse_args()

    repo = Path(args.repo).resolve() if args.repo else Path(__file__).resolve().parents[3]
    rows_path = repo / args.rows_manifest
    shell_path = repo / args.shell_manifest
    rows = load(rows_path)
    shell = load(shell_path)
    validate_rows(rows)
    validate_shell(shell)
    validate_cross(rows, shell)

    if args.check_repository_inputs:
        require(rows_path.is_file(), "rows manifest missing")
        require(shell_path.is_file(), "shell manifest missing")
        # External A0, Source-A, donor and F0 bytes are intentionally not copied
        # into this branch. D0/INTEGRATE must remote-read the declared commits.

    if args.rows:
        value = compile_rows(rows)
    elif args.shell:
        value = compile_shell(rows, shell)
    else:
        value = {
            "schema_version": "kenigevents.u0-free-rows-shell-mat-input.v1",
            "rows": compile_rows(rows),
            "shell": compile_shell(rows, shell),
        }
        value = {
            "integrity": {
                "canonicalization": "UTF-8 sorted compact JSON",
                "payload_sha256": digest(value),
            },
            **value,
        }

    output = render(value)
    if args.check_output:
        expected = repo / args.check_output
        require(expected.is_file(), f"compiled output missing: {args.check_output}")
        require(expected.read_bytes() == output, f"compiled output stale: {args.check_output}")

    if args.emit == "-":
        sys.stdout.buffer.write(output)
    else:
        target = repo / args.emit
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(output)

    print("U0_FREE_ROWS_SHELL_CONTRACT_PASS", file=sys.stderr)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ContractError as exc:
        print(f"U0_FREE_ROWS_SHELL_CONTRACT_FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
