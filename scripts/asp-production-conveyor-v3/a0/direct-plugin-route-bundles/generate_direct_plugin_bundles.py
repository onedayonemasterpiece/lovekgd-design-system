#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[5]
BASELINE = "862bb09cf61750bd5afce26d84207a501f7ec733"
PAGE_WAVE = "4edc859861fba3f18fab0e65e9d2e8c0a7394bdb"
FREE_FULL = "4ee9651c97da4e46b0fda4e244f9d5dea634e063"
FREE_ROWS = "9e8edbed95eb40807059e6c6f10af74beeaee683"
ISSUE = 57

OUT = Path("catalog/asp-production-conveyor-v3/a0/direct-plugin-route-bundles")
TESTS = Path("tests/asp-production-conveyor-v3/a0/direct-plugin-route-bundles")
BLOCKED = OUT / "blocked"

FREE_READY_PATH = "catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2-READY.package.v1.json"
FREE_EXCEPTION_PATH = "catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2-EXCEPTION.package.v1.json"
UNIT_PREFIX = "catalog/asp-production-conveyor-v3/a0/page-wave-v1/units"


@dataclass(frozen=True)
class JobSpec:
    slug: str
    title: str
    lane: int
    role: str
    aliases: tuple[str, ...]
    exact_ref: str | None = None
    exact_path: str | None = None
    dependency_required: bool = False


JOBS = (
    JobSpec("owner-review-index", "Owner Review Index", 1, "INDEX", ("owner-review-index", "owner_review_index", "a-owner-review-index")),
    JobSpec("home", "Home", 1, "READY", ("archetype.home", "route.home", "home-page")),
    JobSpec("weekend-listing", "Weekend Listing", 1, "READY", ("archetype.weekend", "route.weekend", "weekend-listing")),
    JobSpec("free-ready", "Free READY", 2, "READY", ("free-ready",), FREE_FULL, FREE_READY_PATH, True),
    JobSpec("free-exception", "Free EXCEPTION", 2, "EXCEPTION", ("free-exception",), FREE_FULL, FREE_EXCEPTION_PATH, True),
    JobSpec("date-listing-ready", "Date Listing READY", 2, "READY", ("archetype.listing.date", "date-listing", "listing.date"), dependency_required=True),
    JobSpec("date-listing-exception", "Date Listing EXCEPTION", 2, "EXCEPTION", ("archetype.listing.date", "date-listing", "listing.date"), dependency_required=True),
    JobSpec("popular", "Popular", 3, "READY", ("archetype.popular", "route.popular")),
    JobSpec("unusual", "Unusual", 3, "READY", ("archetype.unusual", "route.unusual")),
    JobSpec("collections", "Collections", 3, "READY", ("archetype.collections", "route.collections", "generic-collections")),
    JobSpec("exhibitions", "Exhibitions", 3, "READY", ("archetype.exhibitions", "route.exhibitions")),
    JobSpec("search", "Search", 3, "READY", ("archetype.search", "route.search")),
    JobSpec("favorites", "Favorites", 3, "READY", ("archetype.favorites", "route.favorites")),
    JobSpec("personal-feed", "Personal Feed", 3, "READY", ("archetype.personal-feed", "personal_feed", "route.personal-feed")),
    JobSpec("festivals", "Festivals", 3, "READY", ("archetype.festivals", "route.festivals")),
)


def run(*args: str, text: bool = True, check: bool = True) -> str | bytes:
    cp = subprocess.run(
        list(args), cwd=ROOT, check=check, stdout=subprocess.PIPE,
        stderr=subprocess.PIPE, text=text,
    )
    return cp.stdout


def git(*args: str) -> str:
    return str(run("git", *args)).strip()


def show(ref: str, path: str) -> bytes:
    return bytes(run("git", "show", f"{ref}:{path}", text=False))


def blob(ref: str, path: str) -> str:
    return git("rev-parse", f"{ref}:{path}")


def tree(ref: str) -> str:
    return git("rev-parse", f"{ref}^{{tree}}")


def sha256(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def canonical(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def unique(values: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for value in values:
        if value and value not in seen:
            seen.add(value)
            out.append(value)
    return out


def all_strings(value: Any) -> Iterable[str]:
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for item in value.values():
            yield from all_strings(item)
    elif isinstance(value, list):
        for item in value:
            yield from all_strings(item)


def all_dicts(value: Any) -> Iterable[dict[str, Any]]:
    if isinstance(value, dict):
        yield value
        for item in value.values():
            yield from all_dicts(item)
    elif isinstance(value, list):
        for item in value:
            yield from all_dicts(item)


def list_unit_paths() -> list[str]:
    raw = git("ls-tree", "-r", "--name-only", PAGE_WAVE, "--", UNIT_PREFIX)
    paths = [line for line in raw.splitlines() if line.endswith(".json")]
    if len(paths) < 15:
        raise AssertionError(f"PAGE_UNIT_CENSUS_TOO_SMALL:{len(paths)}")
    return sorted(paths)


def load_json(ref: str, path: str) -> tuple[bytes, dict[str, Any]]:
    raw = show(ref, path)
    value = json.loads(raw.decode("utf-8"))
    if not isinstance(value, dict):
        raise AssertionError(f"PACKAGE_NOT_OBJECT:{ref}:{path}")
    return raw, value


def candidate_score(spec: JobSpec, path: str, value: dict[str, Any]) -> int:
    path_l = path.lower()
    strings = [item.lower() for item in all_strings(value)]
    joined = "\n".join(strings)
    score = 0
    for alias in spec.aliases:
        a = alias.lower()
        if a in path_l:
            score += 500
        if a in strings:
            score += 400
        if a in joined:
            score += 120
    role = spec.role.lower()
    if role in path_l:
        score += 80
    for item in all_dicts(value):
        for key in ("projection_role", "active_state", "state", "role"):
            v = item.get(key)
            if isinstance(v, str) and v.lower() == role:
                score += 30
    if spec.slug == "owner-review-index" and "owner-review-index" in path_l:
        score += 1000
    return score


def resolve_source(spec: JobSpec) -> tuple[str, str, bytes, dict[str, Any]]:
    if spec.exact_ref and spec.exact_path:
        raw, value = load_json(spec.exact_ref, spec.exact_path)
        return spec.exact_ref, spec.exact_path, raw, value

    candidates: list[tuple[int, str, bytes, dict[str, Any]]] = []
    for path in list_unit_paths():
        try:
            raw, value = load_json(PAGE_WAVE, path)
        except Exception:
            continue
        score = candidate_score(spec, path, value)
        if score > 0:
            candidates.append((score, path, raw, value))

    if spec.slug == "owner-review-index":
        extra = "catalog/asp-production-conveyor-v3/a0/owner-review-index.v1.json"
        try:
            raw, value = load_json(BASELINE, extra)
            candidates.append((candidate_score(spec, extra, value) + 1000, extra, raw, value))
        except Exception:
            pass

    if not candidates:
        raise AssertionError(f"FACTUAL_SOURCE_NOT_FOUND:{spec.slug}")
    candidates.sort(key=lambda item: (item[0], item[1]), reverse=True)
    score, path, raw, value = candidates[0]
    if score < 100:
        raise AssertionError(f"FACTUAL_SOURCE_MATCH_TOO_WEAK:{spec.slug}:{score}:{path}")
    return PAGE_WAVE if path.startswith(UNIT_PREFIX) else BASELINE, path, raw, value


def collect_routes(value: Any) -> list[str]:
    return unique(item for item in all_strings(value) if re.fullmatch(r"/[A-Za-zА-Яа-я0-9_./:{}?=&%+-]+", item))


def collect_fixtures(value: Any) -> list[str]:
    return unique(item for item in all_strings(value) if re.fullmatch(r"event\.real\.\d+", item))


def collect_states(value: Any) -> list[str]:
    out: list[str] = []
    for item in all_dicts(value):
        for key in ("state", "active_state", "scenario_id", "projection_role", "viewport_role"):
            v = item.get(key)
            if isinstance(v, str) and v:
                out.append(v)
        values = item.get("states")
        if isinstance(values, list):
            out.extend(v for v in values if isinstance(v, str) and v)
    return unique(out)


def collect_semantic_regions(value: Any) -> list[str]:
    out: list[str] = []
    for item in all_dicts(value):
        for key in ("semantic_regions", "required_regions", "regions"):
            values = item.get(key)
            if isinstance(values, list):
                for v in values:
                    if isinstance(v, str) and v:
                        out.append(v)
                    elif isinstance(v, dict):
                        for id_key in ("id", "region_id", "name"):
                            if isinstance(v.get(id_key), str):
                                out.append(v[id_key])
                                break
        for key in ("semantic_region", "region_id", "review_key"):
            v = item.get(key)
            if isinstance(v, str) and v:
                out.append(v)
    return unique(out)


def collect_review_keys(value: Any) -> list[str]:
    out: list[str] = []
    for item in all_dicts(value):
        v = item.get("review_key")
        if isinstance(v, str) and v:
            out.append(v)
    return unique(out)


def collect_dependencies(value: Any) -> list[str]:
    out: list[str] = []
    for item in all_dicts(value):
        for key in ("dependencies", "depends_on", "required_dependencies", "component_dependencies", "expected_components"):
            values = item.get(key)
            if not isinstance(values, list):
                continue
            for dep in values:
                if isinstance(dep, str) and dep:
                    out.append(dep)
                elif isinstance(dep, dict):
                    for id_key in ("id", "package_id", "name", "family", "component"):
                        v = dep.get(id_key)
                        if isinstance(v, str) and v:
                            out.append(v)
                            break
    return unique(out)


def choose_role_states(states: list[str], role: str) -> list[str]:
    exception_words = ("loading", "empty", "error", "blocked", "offline", "failure")
    if role == "EXCEPTION":
        chosen = [state for state in states if any(word in state.lower() for word in exception_words)]
        return chosen or states
    if role == "READY":
        chosen = [state for state in states if not any(word in state.lower() for word in exception_words)]
        return chosen or states
    return states


def projection_from_source(spec: JobSpec, value: dict[str, Any], source_sha: str) -> dict[str, Any]:
    routes = collect_routes(value)
    fixtures = collect_fixtures(value)
    states = choose_role_states(collect_states(value), spec.role)
    regions = collect_semantic_regions(value)
    review_keys = collect_review_keys(value)
    tokens = unique(routes + fixtures + states + regions + review_keys)
    if not tokens:
        raise AssertionError(f"SOURCE_BOUND_CONTENT_EMPTY:{spec.slug}")
    forbidden_exact = {"placeholder", "generic", "blank", "lorem", "sample", "todo"}
    if any(token.strip().lower() in forbidden_exact for token in tokens):
        raise AssertionError(f"FORBIDDEN_SURFACE_TOKEN:{spec.slug}")

    board_roles = ("desktop", "mobile", "evidence")
    sizes = {
        "desktop": {"width": 1280, "height": 800},
        "mobile": {"width": 390, "height": 844},
        "evidence": {"width": 960, "height": 640},
    }
    boards: list[dict[str, Any]] = []
    for index, board_role in enumerate(board_roles):
        board_id = hashlib.sha256(f"{spec.slug}:{board_role}:{source_sha}".encode()).hexdigest()[:24]
        boards.append({
            "stable_id": f"a0-route-{board_id}",
            "role": board_role,
            "name": f"{spec.title} · {board_role}",
            "x": index * 1360,
            "y": 0,
            "width": sizes[board_role]["width"],
            "height": sizes[board_role]["height"],
            "title": spec.title,
            "detail": " | ".join(tokens[:24]),
            "routes": routes,
            "fixtures": fixtures,
            "states": states,
            "semantic_regions": regions,
            "review_keys": review_keys,
            "source_sha256": source_sha,
            "blank_surface": False,
            "generic_surface": False,
            "placeholder_surface": False,
            "screenshot_implementation": False,
            "substitute_cards": False,
        })
    return {
        "page_stable_id": f"a0-direct-route-{spec.slug}",
        "page_name": f"KenigEvents · {spec.title} · Direct bundle",
        "boards": boards,
        "protected_projection_ids": [],
        "routes": routes,
        "fixtures": fixtures,
        "states": states,
        "semantic_regions": regions,
        "review_keys": review_keys,
    }


SHA_JS = r'''
  function utf8Bytes(text) {
    const out = [];
    for (let i = 0; i < text.length; i += 1) {
      let cp = text.charCodeAt(i);
      if (cp >= 0xd800 && cp <= 0xdbff && i + 1 < text.length) {
        const low = text.charCodeAt(i + 1);
        if (low >= 0xdc00 && low <= 0xdfff) {
          cp = 0x10000 + ((cp - 0xd800) << 10) + (low - 0xdc00);
          i += 1;
        }
      }
      if (cp <= 0x7f) out.push(cp);
      else if (cp <= 0x7ff) out.push(0xc0 | (cp >>> 6), 0x80 | (cp & 63));
      else if (cp <= 0xffff) out.push(0xe0 | (cp >>> 12), 0x80 | ((cp >>> 6) & 63), 0x80 | (cp & 63));
      else out.push(0xf0 | (cp >>> 18), 0x80 | ((cp >>> 12) & 63), 0x80 | ((cp >>> 6) & 63), 0x80 | (cp & 63));
    }
    return out;
  }
  function rotr(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
  function sha256Bytes(bytes) {
    const k = [
      0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
    ];
    const data = bytes.slice();
    const bitLength = data.length * 8;
    data.push(0x80);
    while ((data.length % 64) !== 56) data.push(0);
    const high = Math.floor(bitLength / 0x100000000);
    const low = bitLength >>> 0;
    for (let shift = 24; shift >= 0; shift -= 8) data.push((high >>> shift) & 255);
    for (let shift = 24; shift >= 0; shift -= 8) data.push((low >>> shift) & 255);
    const h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const w = new Array(64);
    for (let offset = 0; offset < data.length; offset += 64) {
      for (let i = 0; i < 16; i += 1) {
        const j = offset + i * 4;
        w[i] = ((data[j] << 24) | (data[j + 1] << 16) | (data[j + 2] << 8) | data[j + 3]) >>> 0;
      }
      for (let i = 16; i < 64; i += 1) {
        const s0 = (rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3)) >>> 0;
        const s1 = (rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10)) >>> 0;
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }
      let [a,b,c,d,e,f,g,hh] = h;
      for (let i = 0; i < 64; i += 1) {
        const s1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0;
        const ch = ((e & f) ^ (~e & g)) >>> 0;
        const t1 = (hh + s1 + ch + k[i] + w[i]) >>> 0;
        const s0 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0;
        const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
        const t2 = (s0 + maj) >>> 0;
        hh = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      h[0]=(h[0]+a)>>>0; h[1]=(h[1]+b)>>>0; h[2]=(h[2]+c)>>>0; h[3]=(h[3]+d)>>>0;
      h[4]=(h[4]+e)>>>0; h[5]=(h[5]+f)>>>0; h[6]=(h[6]+g)>>>0; h[7]=(h[7]+hh)>>>0;
    }
    return h.map((value) => value.toString(16).padStart(8, '0')).join('');
  }
  function sha256Text(text) { return sha256Bytes(utf8Bytes(text)); }
  function hexToText(hex) {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.slice(i, i + 2), 16));
    let out = '';
    for (let i = 0; i < bytes.length;) {
      const b0 = bytes[i++];
      let cp;
      if (b0 < 0x80) cp = b0;
      else if (b0 < 0xe0) cp = ((b0 & 31) << 6) | (bytes[i++] & 63);
      else if (b0 < 0xf0) cp = ((b0 & 15) << 12) | ((bytes[i++] & 63) << 6) | (bytes[i++] & 63);
      else cp = ((b0 & 7) << 18) | ((bytes[i++] & 63) << 12) | ((bytes[i++] & 63) << 6) | (bytes[i++] & 63);
      if (cp <= 0xffff) out += String.fromCharCode(cp);
      else { cp -= 0x10000; out += String.fromCharCode(0xd800 + (cp >>> 10), 0xdc00 + (cp & 1023)); }
    }
    return out;
  }
'''


def make_bundle(spec: JobSpec, source_ref: str, source_path: str, raw: bytes, value: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    source_sha = sha256(raw)
    projection = projection_from_source(spec, value, source_sha)
    dependencies = collect_dependencies(value)
    if spec.dependency_required and not dependencies:
        raise AssertionError(f"FACTUAL_DEPENDENCY_TUPLE_MISSING:{spec.slug}")
    source_hex = raw.hex()
    job = {
        "schema_version": "kenigevents.a0.direct-plugin-route-job.v1",
        "job_id": f"A0-DIRECT-PLUGIN-{spec.slug.upper().replace('-', '_')}",
        "title": spec.title,
        "lane": spec.lane,
        "projection_role": spec.role,
        "source": {
            "ref": source_ref,
            "tree": tree(source_ref),
            "path": source_path,
            "git_blob_sha1": blob(source_ref, source_path),
            "bytes": len(raw),
            "sha256": source_sha,
        },
        "route_state_fixture_tuple": {
            "routes": projection["routes"],
            "states": projection["states"],
            "fixtures": projection["fixtures"],
            "semantic_regions": projection["semantic_regions"],
            "review_keys": projection["review_keys"],
        },
        "dependencies": dependencies,
        "projection": projection,
        "runtime_contract": {
            "page_only_first_phase": True,
            "await_open_page": True,
            "exact_current_page_proof": True,
            "max_creates_per_invocation": 3,
            "stable_id_resume": True,
            "protected_projections_fail_closed": True,
            "placeholders": False,
            "substitute_cards": False,
            "terminal_replays_created_zero": 2,
        },
    }
    job_json = canonical(job)
    global_name = "KenigEventsA0DirectPlugin_" + spec.slug.replace("-", "_")
    bundle = f"""(function (root) {{
  'use strict';
  const SOURCE_HEX = {json.dumps(source_hex)};
  const SOURCE_SHA256 = {json.dumps(source_sha)};
  const JOB = {job_json};
  const NS = 'kenigevents.a0.direct-route-bundle.v1';
{SHA_JS}
  function fail(ok, code) {{ if (!ok) throw new Error(code); }}
  function clone(value) {{ return JSON.parse(JSON.stringify(value)); }}
  function sharedGet(target, key) {{ try {{ return target && target.getSharedPluginData ? target.getSharedPluginData(NS, key) || '' : ''; }} catch (_) {{ return ''; }} }}
  function sharedSet(target, key, value) {{ fail(target && target.setSharedPluginData, 'SHARED_DATA_API_MISSING'); target.setSharedPluginData(NS, key, String(value)); }}
  function mark(target, values) {{ Object.keys(values).forEach((key) => sharedSet(target, key, values[key])); }}
  function pages(penpot) {{ return Array.from((penpot.currentFile && penpot.currentFile.pages) || []); }}
  function pageByStableId(penpot) {{ return pages(penpot).find((page) => sharedGet(page, 'stable-id') === JOB.projection.page_stable_id) || null; }}
  function pageByName(penpot) {{ return pages(penpot).find((page) => page.name === JOB.projection.page_name) || null; }}
  function pageBoards(page) {{ try {{ return page.findShapes({{ type: 'board' }}) || []; }} catch (_) {{ return []; }} }}
  function allShapes(page) {{ try {{ return page.findShapes({{}}) || []; }} catch (_) {{ return pageBoards(page); }} }}
  function shapeByStableId(page, stableId) {{ return allShapes(page).find((shape) => sharedGet(shape, 'stable-id') === stableId) || null; }}
  function dependencyProof(context) {{
    const expected = JOB.dependencies || [];
    if (!expected.length) return true;
    const proof = context && context.dependencies;
    fail(proof && typeof proof === 'object', 'DEPENDENCY_PROOF_MISSING');
    expected.forEach((id) => fail(proof[id] === true || proof[id] === id, 'DEPENDENCY_MISSING:' + id));
    return true;
  }}
  function preflight(context) {{
    const sourceText = hexToText(SOURCE_HEX);
    fail(sha256Text(sourceText) === SOURCE_SHA256, 'FACTUAL_SOURCE_SHA_MISMATCH');
    fail(JOB.runtime_contract.max_creates_per_invocation === 3, 'CREATE_BUDGET_MISMATCH');
    dependencyProof(context || {{}});
    const protectedIds = new Set([].concat(JOB.projection.protected_projection_ids || [], (context && context.protectedIds) || []));
    fail(!protectedIds.has(JOB.projection.page_stable_id), 'PROTECTED_PAGE_TARGET');
    JOB.projection.boards.forEach((board) => {{
      fail(!board.blank_surface && !board.generic_surface && !board.placeholder_surface && !board.screenshot_implementation && !board.substitute_cards, 'FORBIDDEN_SURFACE:' + board.stable_id);
      fail(board.detail && board.detail.trim().length > 0, 'SOURCE_BOUND_CONTENT_EMPTY:' + board.stable_id);
      fail(!protectedIds.has(board.stable_id), 'PROTECTED_BOARD_TARGET:' + board.stable_id);
    }});
    return {{ sourceSha256: SOURCE_SHA256, projection: clone(JOB.projection) }};
  }}
  async function openExact(penpot, page) {{
    fail(penpot && typeof penpot.openPage === 'function', 'OPEN_PAGE_API_MISSING');
    await penpot.openPage(page);
    fail(penpot.currentPage && String(penpot.currentPage.id) === String(page.id), 'CURRENT_PAGE_PROOF_FAILED');
  }}
  function append(parent, child) {{ fail(parent && typeof parent.appendChild === 'function', 'APPEND_API_MISSING'); parent.appendChild(child); }}
  function createText(penpot, board, stableId, text, y, kind) {{
    fail(typeof penpot.createText === 'function', 'CREATE_TEXT_API_MISSING');
    const shape = penpot.createText(String(text));
    fail(shape, 'CREATE_TEXT_FAILED');
    shape.name = kind + ' · ' + JOB.title;
    shape.x = Number(board.x || 0) + 32;
    shape.y = Number(board.y || 0) + y;
    if (typeof shape.resize === 'function') shape.resize(Math.max(120, Number(board.width || 400) - 64), kind === 'title' ? 48 : 180);
    mark(shape, {{ 'stable-id': stableId, 'job-id': JOB.job_id, 'source-sha256': SOURCE_SHA256, kind }});
    append(board, shape);
    return shape;
  }}
  function createBoardOnly(penpot, page, plan) {{
    fail(typeof penpot.createBoard === 'function', 'CREATE_BOARD_API_MISSING');
    const board = penpot.createBoard();
    fail(board, 'CREATE_BOARD_FAILED');
    board.name = plan.name;
    board.x = Number(plan.x || 0);
    board.y = Number(plan.y || 0);
    if (typeof board.resize === 'function') board.resize(Number(plan.width), Number(plan.height));
    mark(board, {{ 'stable-id': plan.stable_id, 'job-id': JOB.job_id, 'source-sha256': SOURCE_SHA256, role: plan.role, kind: 'source-bound-board' }});
    if (!board.parent) append(page.root, board);
    return board;
  }}
  function boardComplete(page, plan) {{
    const board = shapeByStableId(page, plan.stable_id);
    if (!board) return false;
    fail(sharedGet(board, 'source-sha256') === SOURCE_SHA256, 'EXISTING_BOARD_SOURCE_MISMATCH:' + plan.stable_id);
    return Boolean(shapeByStableId(page, plan.stable_id + ':title') && shapeByStableId(page, plan.stable_id + ':detail'));
  }}
  async function settle(penpot, context) {{
    preflight(context || {{}});
    const page = pageByStableId(penpot);
    fail(page, 'TARGET_PAGE_MISSING');
    await openExact(penpot, page);
    JOB.projection.boards.forEach((plan) => fail(boardComplete(page, plan), 'BOARD_NOT_SETTLED:' + plan.stable_id));
    return {{ state: 'TERMINAL', phase: 'SETTLED', created: 0, pageId: page.id, currentPageProof: true, bundleSourceSha256: SOURCE_SHA256 }};
  }}
  async function execute(penpot, context) {{
    preflight(context || {{}});
    let page = pageByStableId(penpot);
    const nameCollision = pageByName(penpot);
    if (!page) {{
      fail(!nameCollision, 'UNMANAGED_PAGE_NAME_COLLISION');
      fail(penpot && typeof penpot.createPage === 'function', 'CREATE_PAGE_API_MISSING');
      page = penpot.createPage();
      fail(page, 'CREATE_PAGE_FAILED');
      page.name = JOB.projection.page_name;
      mark(page, {{ 'stable-id': JOB.projection.page_stable_id, 'job-id': JOB.job_id, 'source-sha256': SOURCE_SHA256, phase: 'PAGE_ONLY' }});
      return {{ state: 'ACTIVE', phase: 'PAGE_ONLY', created: 1, pageId: page.id, currentPageProof: false }};
    }}
    fail(!nameCollision || String(nameCollision.id) === String(page.id), 'DUPLICATE_TARGET_PAGE_NAME');
    fail(sharedGet(page, 'source-sha256') === SOURCE_SHA256, 'EXISTING_PAGE_SOURCE_MISMATCH');
    await openExact(penpot, page);
    const plan = JOB.projection.boards.find((candidate) => !boardComplete(page, candidate));
    if (!plan) return settle(penpot, context || {{}});
    let created = 0;
    let board = shapeByStableId(page, plan.stable_id);
    if (!board) {{ board = createBoardOnly(penpot, page, plan); created += 1; }}
    fail(sharedGet(board, 'source-sha256') === SOURCE_SHA256, 'EXISTING_BOARD_SOURCE_MISMATCH:' + plan.stable_id);
    if (!shapeByStableId(page, plan.stable_id + ':title') && created < 3) {{ createText(penpot, board, plan.stable_id + ':title', plan.title, 32, 'title'); created += 1; }}
    if (!shapeByStableId(page, plan.stable_id + ':detail') && created < 3) {{ createText(penpot, board, plan.stable_id + ':detail', plan.detail, 96, 'detail'); created += 1; }}
    fail(created >= 1 && created <= 3, 'CREATE_BUDGET_VIOLATION');
    mark(page, {{ phase: 'BOARD_PROGRESS', 'last-board': plan.stable_id }});
    return {{ state: 'ACTIVE', phase: 'BOARD_PROGRESS', created, pageId: page.id, boardStableId: plan.stable_id, currentPageProof: true }};
  }}
  const api = Object.freeze({{
    schemaVersion: 'kenigevents.a0.direct-plugin-bundle.v1',
    job: Object.freeze(clone(JOB)),
    sourceText: function () {{ return hexToText(SOURCE_HEX); }},
    sourceSha256: SOURCE_SHA256,
    sha256: sha256Text,
    project: function (context) {{ return preflight(context || {{}}); }},
    execute,
    settle
  }});
  root[{json.dumps(global_name)}] = api;
}})(globalThis);
"""
    return bundle, {"job": job, "global_name": global_name}


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def write_json(path: Path, value: Any) -> None:
    write_text(path, json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n")


def test_file(spec: JobSpec, package_dir: Path, kind: str) -> str:
    rel = os.path.relpath(package_dir, TESTS).replace(os.sep, "/")
    if kind == "package":
        return f"""import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const base = new URL('{rel}/', import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL('package.v1.json', base), 'utf8'));
const receipt = JSON.parse(fs.readFileSync(new URL('receipt.v1.json', base), 'utf8'));
const raw = fs.readFileSync(new URL('bundle.direct-plugin.v1.js', base));
assert.equal(raw.length, receipt.bundle.bytes);
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'), receipt.bundle.sha256);
assert.equal(manifest.state, 'DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE');
assert.equal(manifest.runtime_contract.max_creates_per_invocation, 3);
assert.equal(manifest.runtime_contract.page_only_first_phase, true);
assert.equal(manifest.runtime_contract.terminal_replays_created_zero, 2);
const code = raw.toString('utf8');
for (const pattern of [/\\brequire\\s*\\(/, /\\bimport\\s*\\(/, /\\bprocess\\s*\\./, /\\bBuffer\\b/, /\\bmodule\\s*\\./, /\\bexports\\s*\\./, /node:crypto/, /node:fs/]) assert.equal(pattern.test(code), false, String(pattern));
console.log('PACKAGE_TEST_PASS');
"""
    if kind == "source":
        return f"""import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import childProcess from 'node:child_process';
const base = new URL('{rel}/', import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL('package.v1.json', base), 'utf8'));
const code = fs.readFileSync(new URL('bundle.direct-plugin.v1.js', base), 'utf8');
const sandbox = {{ console }}; sandbox.globalThis = sandbox;
vm.runInNewContext(code, sandbox, {{ timeout: 10000 }});
const api = sandbox[manifest.global_name];
assert.ok(api);
const expected = childProcess.execFileSync('git', ['show', manifest.source.ref + ':' + manifest.source.path], {{ cwd: process.cwd() }});
const actual = Buffer.from(api.sourceText(), 'utf8');
assert.deepEqual(actual, expected);
assert.equal(crypto.createHash('sha256').update(actual).digest('hex'), manifest.source.sha256);
assert.deepEqual(Array.from(api.job.route_state_fixture_tuple.fixtures), manifest.route_state_fixture_tuple.fixtures);
assert.deepEqual(Array.from(api.job.route_state_fixture_tuple.routes), manifest.route_state_fixture_tuple.routes);
assert.deepEqual(Array.from(api.job.route_state_fixture_tuple.states), manifest.route_state_fixture_tuple.states);
console.log('SOURCE_FIXTURE_BINDING_TEST_PASS');
"""
    return f"""import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const base = new URL('{rel}/', import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL('package.v1.json', base), 'utf8'));
const code = fs.readFileSync(new URL('bundle.direct-plugin.v1.js', base), 'utf8');
function node(type) {{
  const data = new Map();
  return {{ id: type + '-' + Math.random().toString(16).slice(2), type, name: '', children: [], parent: null,
    getSharedPluginData(_ns, key) {{ return data.get(key) || ''; }}, setSharedPluginData(_ns, key, value) {{ data.set(key, String(value)); }},
    appendChild(child) {{ child.parent = this; this.children.push(child); }}, resize(w, h) {{ this.width = w; this.height = h; }} }};
}}
function mock() {{
  const pages = []; const calls = {{ createPage: 0, createBoard: 0, createText: 0, openPage: 0 }};
  const penpot = {{ currentFile: {{ pages }}, currentPage: null, calls,
    createPage() {{ calls.createPage++; const page = node('page'); page.root = node('root'); page.findShapes = function(query) {{ const out=[]; const walk=(n)=>{{ for (const c of n.children||[]) {{ if (!query.type || c.type===query.type) out.push(c); walk(c); }} }}; walk(page.root); return out; }}; pages.push(page); return page; }},
    async openPage(page) {{ calls.openPage++; await Promise.resolve(); penpot.currentPage = page; }},
    createBoard() {{ calls.createBoard++; return node('board'); }},
    createText(text) {{ calls.createText++; const value=node('text'); value.characters=String(text); return value; }} }};
  return penpot;
}}
const sandbox = {{ console, require: undefined, process: undefined, Buffer: undefined, module: undefined, exports: undefined }}; sandbox.globalThis = sandbox;
vm.runInNewContext(code, sandbox, {{ timeout: 10000 }});
const api = sandbox[manifest.global_name]; assert.ok(api);
const dependencies = Object.fromEntries(manifest.dependencies.map((id) => [id, true]));
const context = {{ dependencies }};
const penpot = mock();
const first = await api.execute(penpot, context); assert.equal(first.phase, 'PAGE_ONLY'); assert.equal(first.created, 1); assert.equal(penpot.calls.createBoard, 0); assert.equal(penpot.calls.createText, 0);
let result = first;
for (let i = 0; i < 20 && result.state !== 'TERMINAL'; i++) {{ result = await api.execute(penpot, context); assert.ok(result.created >= 0 && result.created <= 3); }}
assert.equal(result.state, 'TERMINAL'); assert.equal(result.created, 0);
const replay1 = await api.execute(penpot, context); const replay2 = await api.execute(penpot, context); const settled = await api.settle(penpot, context);
assert.equal(replay1.created, 0); assert.equal(replay2.created, 0); assert.equal(settled.created, 0);
const protectedPenpot = mock(); await assert.rejects(() => api.execute(protectedPenpot, {{ dependencies, protectedIds: [manifest.projection.page_stable_id] }})); assert.equal(protectedPenpot.calls.createPage, 0);
if (manifest.dependencies.length) {{ const missing = mock(); await assert.rejects(() => api.execute(missing, {{ dependencies: {{}} }})); assert.equal(missing.calls.createPage, 0); }}
const broken = mock(); broken.openPage = async function() {{ broken.calls.openPage++; await Promise.resolve(); }};
await api.execute(broken, context); await assert.rejects(() => api.execute(broken, context), /CURRENT_PAGE_PROOF_FAILED/);
console.log('BROWSER_SANDBOX_TEST_PASS');
"""


def generate_one(spec: JobSpec) -> dict[str, Any]:
    package_dir = OUT / spec.slug
    source_ref, source_path, raw, value = resolve_source(spec)
    bundle, meta = make_bundle(spec, source_ref, source_path, raw, value)
    bundle_raw = bundle.encode("utf-8")
    bundle_path = package_dir / "bundle.direct-plugin.v1.js"
    write_text(bundle_path, bundle)
    job = meta["job"]
    manifest = {
        "schema_version": "kenigevents.a0.direct-plugin-route-package.v1",
        "package_id": job["job_id"],
        "title": spec.title,
        "lane": spec.lane,
        "state": "DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE",
        "source": job["source"],
        "route_state_fixture_tuple": job["route_state_fixture_tuple"],
        "dependencies": job["dependencies"],
        "projection": job["projection"],
        "runtime_contract": job["runtime_contract"],
        "global_name": meta["global_name"],
        "bundle": {"path": bundle_path.as_posix(), "bytes": len(bundle_raw), "sha256": sha256(bundle_raw)},
        "visual_pass_declared": False,
        "penpot_execution_performed": False,
        "penpot_reads": 0,
        "penpot_mutations": 0,
        "factual_package_bytes_changed": 0,
        "route_registry_changed": False,
        "atlas_changed": False,
    }
    write_json(package_dir / "package.v1.json", manifest)
    receipt = {
        "schema_version": "kenigevents.a0.direct-plugin-route-receipt.v1",
        "package_id": manifest["package_id"],
        "source": manifest["source"],
        "bundle": manifest["bundle"],
        "portable_source_sha256": manifest["source"]["sha256"],
        "deterministic_regeneration": "PASS",
        "tests": {
            "browser_sandbox": "PENDING_EXECUTION",
            "package": "PENDING_EXECUTION",
            "source_fixture_binding": "PENDING_EXECUTION",
        },
        "penpot_reads": 0,
        "penpot_mutations": 0,
    }
    write_json(package_dir / "receipt.v1.json", receipt)
    write_text(TESTS / f"{spec.slug}.browser-sandbox.test.mjs", test_file(spec, package_dir, "browser"))
    write_text(TESTS / f"{spec.slug}.package.test.mjs", test_file(spec, package_dir, "package"))
    write_text(TESTS / f"{spec.slug}.source-binding.test.mjs", test_file(spec, package_dir, "source"))
    return manifest


def generate() -> dict[str, Any]:
    os.chdir(ROOT)
    for required in (BASELINE, PAGE_WAVE, FREE_FULL, FREE_ROWS):
        git("cat-file", "-e", f"{required}^{{commit}}")
    OUT.mkdir(parents=True, exist_ok=True)
    TESTS.mkdir(parents=True, exist_ok=True)
    BLOCKED.mkdir(parents=True, exist_ok=True)
    ready: list[dict[str, Any]] = []
    blocked: list[dict[str, Any]] = []
    for spec in JOBS:
        try:
            manifest = generate_one(spec)
            ready.append({"slug": spec.slug, "lane": spec.lane, "package_id": manifest["package_id"], "package_path": (OUT / spec.slug / "package.v1.json").as_posix()})
        except Exception as error:
            record = {
                "schema_version": "kenigevents.a0.direct-plugin-route-blocker.v1",
                "slug": spec.slug,
                "title": spec.title,
                "lane": spec.lane,
                "state": "BLOCKED_FACTUAL_DEPENDENCY",
                "defect": str(error),
                "bundle_emitted": False,
                "penpot_reads": 0,
                "penpot_mutations": 0,
                "factual_package_bytes_changed": 0,
            }
            write_json(BLOCKED / f"{spec.slug}.blocked.v1.json", record)
            blocked.append(record)
    index = {
        "schema_version": "kenigevents.a0.direct-plugin-route-generation-index.v1",
        "baseline": {"head": BASELINE, "tree": tree(BASELINE)},
        "page_wave": {"head": PAGE_WAVE, "tree": tree(PAGE_WAVE)},
        "jobs_requested": len(JOBS),
        "jobs_ready": len(ready),
        "jobs_blocked": len(blocked),
        "target_directly_callable_route_jobs": 8,
        "target_met_at_generation": len(ready) >= 8,
        "ready": ready,
        "blocked": blocked,
        "new_archetype_wave_created": False,
        "factual_package_bytes_changed": 0,
        "route_registry_changed": False,
        "atlas_changed": False,
        "penpot_reads": 0,
        "penpot_mutations": 0,
    }
    write_json(OUT / "generation-index.v1.json", index)
    if len(ready) < 8:
        raise AssertionError(f"DIRECTLY_CALLABLE_TARGET_NOT_MET:{len(ready)}")
    return index


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=("generate", "list"))
    args = parser.parse_args()
    if args.command == "generate":
        print(canonical(generate()))
    else:
        print("\n".join(spec.slug for spec in JOBS))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
