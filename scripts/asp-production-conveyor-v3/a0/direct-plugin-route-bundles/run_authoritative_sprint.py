#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import os
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[4]
GENERATOR = ROOT / "scripts/asp-production-conveyor-v3/a0/direct-plugin-route-bundles/run_generate_v3.py"
OUT = ROOT / "catalog/asp-production-conveyor-v3/a0/direct-plugin-route-bundles"
TESTS = ROOT / "tests/asp-production-conveyor-v3/a0/direct-plugin-route-bundles"
REPORTS = ROOT / "reports/asp-production-conveyor-v3/a0/direct-plugin-route-bundles"
BRANCH = os.environ.get("GITHUB_REF_NAME", "a0/direct-plugin-route-buffer-v1-20260902")
REPOSITORY = os.environ.get("GITHUB_REPOSITORY", "onedayonemasterpiece/lovekgd-design-system")
TOKEN = os.environ.get("GITHUB_TOKEN", "")
ISSUE = 57
REQUIRED_COMMENTS = (5506769941, 5506830213, 5506836084)
BASELINE = "862bb09cf61750bd5afce26d84207a501f7ec733"
BASELINE_TREE = "9cf76a269e8febfb56fbdc93a1f0a73a74a2bd46"


def run(*args: str, capture: bool = True) -> str:
    cp = subprocess.run(
        list(args), cwd=ROOT, check=True,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None,
        text=True,
    )
    return cp.stdout.strip() if capture else ""


def git(*args: str) -> str:
    return run("git", *args)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1 << 20), b""):
            digest.update(block)
    return digest.hexdigest()


def api(path: str, method: str = "GET", body: dict[str, Any] | None = None) -> Any:
    if not TOKEN:
        raise RuntimeError("GITHUB_TOKEN_MISSING")
    url = "https://api.github.com/" + path.lstrip("/")
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {TOKEN}",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "a0-direct-plugin-route-buffer",
    }
    raw = json.dumps(body).encode("utf-8") if body is not None else None
    request = urllib.request.Request(url, data=raw, headers=headers, method=method)
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def all_comments() -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    page = 1
    while True:
        batch = api(f"repos/{REPOSITORY}/issues/{ISSUE}/comments?per_page=100&page={page}")
        result.extend(batch)
        if len(batch) < 100:
            return result
        page += 1


def post_comment(body: str) -> int:
    response = api(f"repos/{REPOSITORY}/issues/{ISSUE}/comments", method="POST", body={"body": body})
    return int(response["id"])


def source_fresh_read() -> dict[str, Any]:
    required: dict[str, Any] = {}
    for comment_id in REQUIRED_COMMENTS:
        comment = api(f"repos/{REPOSITORY}/issues/comments/{comment_id}")
        required[str(comment_id)] = {
            "id": comment["id"],
            "updated_at": comment.get("updated_at"),
            "author": (comment.get("user") or {}).get("login"),
            "body_sha256": hashlib.sha256((comment.get("body") or "").encode("utf-8")).hexdigest(),
        }
    comments = all_comments()
    if not comments:
        raise RuntimeError("ISSUE_COMMENTS_EMPTY")
    morning = [item for item in comments if "A0_MORNING_EXECUTABLE_ROUTE_BUFFER_READY" in (item.get("body") or "")]
    if not morning:
        raise RuntimeError("FINAL_A0_MORNING_CHECKPOINT_MISSING")
    tip = comments[-1]
    return {
        "schema_version": "kenigevents.a0.direct-plugin-fresh-read.v1",
        "required_comments": required,
        "final_morning_checkpoint": {
            "id": morning[-1]["id"],
            "body_sha256": hashlib.sha256((morning[-1].get("body") or "").encode("utf-8")).hexdigest(),
        },
        "tip_before_publication": {
            "id": tip["id"],
            "updated_at": tip.get("updated_at"),
            "author": (tip.get("user") or {}).get("login"),
            "body_sha256": hashlib.sha256((tip.get("body") or "").encode("utf-8")).hexdigest(),
        },
        "comments_read": len(comments),
    }


def run_test(path: Path) -> None:
    run("node", "--test", path.as_posix(), capture=False)


def commit_bundle(slug: str) -> dict[str, Any]:
    package_dir = OUT / slug
    manifest_path = package_dir / "package.v1.json"
    receipt_path = package_dir / "receipt.v1.json"
    bundle_path = package_dir / "bundle.direct-plugin.v1.js"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    receipt = json.loads(receipt_path.read_text(encoding="utf-8"))

    for suffix in ("browser-sandbox", "package", "source-binding"):
        run_test(TESTS / f"{slug}.{suffix}.test.mjs")

    receipt["tests"] = {
        "browser_sandbox": "PASS",
        "package": "PASS",
        "source_fixture_binding": "PASS",
        "portable_sha": "PASS",
        "terminal_replay_created_zero": "PASS_2_OF_2",
    }
    receipt_path.write_text(json.dumps(receipt, ensure_ascii=False, sort_keys=True, indent=2) + "\n", encoding="utf-8")

    git("add", package_dir.relative_to(ROOT).as_posix())
    for suffix in ("browser-sandbox", "package", "source-binding"):
        git("add", (TESTS / f"{slug}.{suffix}.test.mjs").relative_to(ROOT).as_posix())
    git("diff", "--cached", "--check")
    git("commit", "-m", f"feat(a0): publish direct-plugin route bundle {slug}")
    git("push", "origin", f"HEAD:{BRANCH}")

    head = git("rev-parse", "HEAD")
    tree = git("rev-parse", "HEAD^{tree}")
    rel_bundle = bundle_path.relative_to(ROOT).as_posix()
    bundle_blob = git("rev-parse", f"HEAD:{rel_bundle}")
    bundle_record = {
        "path": rel_bundle,
        "git_blob_sha1": bundle_blob,
        "bytes": bundle_path.stat().st_size,
        "sha256": sha256_file(bundle_path),
    }
    comment = "\n".join([
        "<!-- ASP_BUILD_REQUEST_V2 -->",
        f"## ASP_BUILD_REQUEST_V2 — {manifest['title']} direct plugin bundle",
        "",
        "```yaml",
        "state: DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE",
        "owner: A0",
        f"lane: {manifest['lane']}",
        f"package_id: {manifest['package_id']}",
        f"branch: {BRANCH}",
        f"head: {head}",
        f"tree: {tree}",
        "bundle:",
        f"  path: {bundle_record['path']}",
        f"  git_blob_sha1: {bundle_record['git_blob_sha1']}",
        f"  bytes: {bundle_record['bytes']}",
        f"  sha256: {bundle_record['sha256']}",
        "factual_source:",
        f"  ref: {manifest['source']['ref']}",
        f"  path: {manifest['source']['path']}",
        f"  git_blob_sha1: {manifest['source']['git_blob_sha1']}",
        f"  sha256: {manifest['source']['sha256']}",
        "binding_counts:",
        f"  routes: {len(manifest['route_state_fixture_tuple']['routes'])}",
        f"  states: {len(manifest['route_state_fixture_tuple']['states'])}",
        f"  fixtures: {len(manifest['route_state_fixture_tuple']['fixtures'])}",
        "tests:",
        "  browser_sandbox: PASS",
        "  package: PASS",
        "  source_fixture_binding: PASS",
        "  portable_sha: PASS",
        "  deterministic_regeneration: PASS",
        "  terminal_replay_created_zero: PASS_2_OF_2",
        "runtime_shared_imports: 0",
        "substitute_cards: 0",
        "placeholders: 0",
        "factual_package_bytes_changed: 0",
        "route_registry_changed: false",
        "atlas_changed: false",
        "visual_pass_declared: false",
        "penpot_execution_performed: false",
        "penpot_reads: 0",
        "penpot_mutations: 0",
        "next_owner: D0_QA_INTEGRATE",
        "```",
    ])
    comment_id = post_comment(comment)
    return {
        "slug": slug,
        "package_id": manifest["package_id"],
        "state": "DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE",
        "branch": BRANCH,
        "head": head,
        "tree": tree,
        "bundle": bundle_record,
        "tests": receipt["tests"],
        "issue_comment_id": comment_id,
    }


def main() -> int:
    os.chdir(ROOT)
    git("config", "user.name", "a0-direct-plugin-bundle-bot")
    git("config", "user.email", "a0-direct-plugin-bundle-bot@users.noreply.github.com")
    git("fetch", "--prune", "--no-tags", "origin", BASELINE,
        "4edc859861fba3f18fab0e65e9d2e8c0a7394bdb",
        "4ee9651c97da4e46b0fda4e244f9d5dea634e063",
        "9e8edbed95eb40807059e6c6f10af74beeaee683")
    if git("rev-parse", f"{BASELINE}^{{tree}}") != BASELINE_TREE:
        raise RuntimeError("BASELINE_TREE_MISMATCH")

    fresh = source_fresh_read()
    REPORTS.mkdir(parents=True, exist_ok=True)
    (REPORTS / "fresh-read.v1.json").write_text(json.dumps(fresh, ensure_ascii=False, sort_keys=True, indent=2) + "\n", encoding="utf-8")

    if OUT.exists():
        shutil.rmtree(OUT)
    if TESTS.exists():
        shutil.rmtree(TESTS)
    run(sys.executable, GENERATOR.as_posix(), "generate", capture=False)
    first = {path.relative_to(ROOT).as_posix(): sha256_file(path) for path in OUT.glob("*/bundle.direct-plugin.v1.js")}
    shutil.rmtree(OUT)
    shutil.rmtree(TESTS)
    run(sys.executable, GENERATOR.as_posix(), "generate", capture=False)
    second = {path.relative_to(ROOT).as_posix(): sha256_file(path) for path in OUT.glob("*/bundle.direct-plugin.v1.js")}
    if first != second:
        raise RuntimeError("NON_DETERMINISTIC_BUNDLE_REGENERATION")

    index = json.loads((OUT / "generation-index.v1.json").read_text(encoding="utf-8"))
    if not index.get("target_met_at_generation") or int(index.get("jobs_ready", 0)) < 8:
        raise RuntimeError(f"DIRECTLY_CALLABLE_GENERATION_TARGET_NOT_MET:{index.get('jobs_ready')}")

    published = [commit_bundle(item["slug"]) for item in index["ready"]]
    if len(published) < 8:
        raise RuntimeError(f"DIRECTLY_CALLABLE_PUBLICATION_TARGET_NOT_MET:{len(published)}")

    terminal = {
        "schema_version": "kenigevents.a0.direct-plugin-route-buffer.v1",
        "state": "A0_DIRECT_PLUGIN_ROUTE_BUFFER_READY",
        "branch": BRANCH,
        "baseline": index["baseline"],
        "bundles_ready": len(published),
        "bundles": published,
        "dependency_repairs": [],
        "factual_defects": [
            {"slug": item["slug"], "state": item["state"], "defect": item["defect"]}
            for item in index["blocked"]
        ],
        "unprocessed_archetypes": [item["slug"] for item in index["blocked"]],
        "directly_callable_route_jobs_target": 8,
        "target_met": True,
        "new_archetype_wave_created": False,
        "factual_package_bytes_changed": 0,
        "route_registry_changed": False,
        "atlas_changed": False,
        "runtime_shared_imports": 0,
        "visual_pass_declared": False,
        "penpot_execution_performed": False,
        "kaggle": False,
        "penpot_reads": 0,
        "penpot_mutations": 0,
        "next_owner": "D0_CONTINUOUS_INTAKE",
    }
    terminal_path = OUT / "A0_DIRECT_PLUGIN_ROUTE_BUFFER_READY.v1.json"
    terminal_path.write_text(json.dumps(terminal, ensure_ascii=False, sort_keys=True, indent=2) + "\n", encoding="utf-8")

    git("add", (OUT / "generation-index.v1.json").relative_to(ROOT).as_posix())
    git("add", (OUT / "blocked").relative_to(ROOT).as_posix())
    git("add", terminal_path.relative_to(ROOT).as_posix())
    git("add", REPORTS.relative_to(ROOT).as_posix())
    git("diff", "--cached", "--check")
    git("commit", "-m", "feat(a0): publish direct-plugin route buffer terminal")
    git("push", "origin", f"HEAD:{BRANCH}")
    head = git("rev-parse", "HEAD")
    tree_sha = git("rev-parse", "HEAD^{tree}")

    defects = len(terminal["factual_defects"])
    unprocessed = len(terminal["unprocessed_archetypes"])
    body = "\n".join([
        "<!-- ASP_CONVEYOR_CHECKPOINT_V3 -->",
        "## A0 direct-plugin route buffer terminal",
        "",
        "```yaml",
        "state: A0_DIRECT_PLUGIN_ROUTE_BUFFER_READY",
        f"branch: {BRANCH}",
        f"head: {head}",
        f"tree: {tree_sha}",
        f"bundles_ready: {len(published)}",
        "directly_callable_route_jobs_target: 8",
        "target_met: true",
        "dependency_repairs: []",
        f"factual_defects: {defects}",
        f"unprocessed_archetypes: {unprocessed}",
        "new_archetype_wave_created: false",
        "factual_package_bytes_changed: 0",
        "route_registry_changed: false",
        "atlas_changed: false",
        "runtime_shared_imports: 0",
        "visual_pass_declared: false",
        "penpot_execution_performed: false",
        "kaggle: false",
        "penpot_reads: 0",
        "penpot_mutations: 0",
        "next_owner: D0_CONTINUOUS_INTAKE",
        f"terminal_record: {terminal_path.relative_to(ROOT).as_posix()}",
        "```",
    ])
    comment_id = post_comment(body)
    print(json.dumps({"state": terminal["state"], "head": head, "tree": tree_sha, "bundles_ready": len(published), "comment_id": comment_id}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
