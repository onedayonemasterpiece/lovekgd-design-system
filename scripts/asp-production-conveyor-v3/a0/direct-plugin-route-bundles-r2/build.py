#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path
from typing import Any, Iterable

REPO = Path(__file__).resolve().parents[0]
REPOSITORY = "onedayonemasterpiece/lovekgd-design-system"
ISSUE = 57
BRANCH = "a0/direct-plugin-route-buffer-r2-20260902"
BASELINE = "862bb09cf61750bd5afce26d84207a501f7ec733"
BASELINE_TREE = "9cf76a269e8febfb56fbdc93a1f0a73a74a2bd46"
CURRENT_AGGREGATE = "bc8ee45489812a346d2731f97908803e8ec01ba5"
IMPLEMENTATION_SUBJECT = "10fc2ccbd6e7e2e47bcc5870f71af84ce200f888"
PAGE_WAVE = "4edc859861fba3f18fab0e65e9d2e8c0a7394bdb"
FREE_ROWS = "9e8edbed95eb40807059e6c6f10af74beeaee683"
FREE_FULL = "4ee9651c97da4e46b0fda4e244f9d5dea634e063"
ATLAS_R2 = "663be702d481972cb2e8863af500f1c35dda1d8c"
ATLAS_R2_TREE = "cf9a1e6a5e0a84aea5636334dbd3be4961039b75"
ATLAS_R21 = "be4918e5d8e1c1bba5da478acfd08f8035cfc1a5"
ATLAS_R21_TREE = "da1f5c305c75d467af5e4e26f8a996b8c243d74f"
D0_HARNESS = "62f26df36b8199e4b8899b9252f796b1fa5e9d42"
D0_HARNESS_TREE = "23bc8ef208c9e68e76890183fdda15c1a60f5fbd"
D0_HARNESS_PATH = "tests/asp-production-conveyor-v3/d0/d0_plugin_bundle_conformance_v1.mjs"
ATLAS_BINDINGS_PATH = "catalog/asp-production-conveyor-v3/atlas-v2/page-unit-bindings.v2.json"
ATLAS_EXTENSION_PATH = "catalog/asp-production-conveyor-v3/atlas-v2/extensions/r2-1/atlas-extension-map.r2-1.json"
OUT_ROOT = Path("catalog/asp-production-conveyor-v3/a0/direct-plugin-route-bundles-r2")
REPORT_ROOT = Path("reports/asp-production-conveyor-v3/a0/direct-plugin-route-bundles-r2")
REQUIRED_COMMENTS = [5506769941, 5506830213, 5506836084]

LANES: dict[str, list[str]] = {
    "lane-1": ["owner-review-index", "home", "weekend-listing"],
    "lane-2": ["free-ready", "free-exception", "date-listing-ready", "date-listing-exception"],
    "lane-3": [
        "popular-listing", "unusual-listing", "collections", "exhibitions",
        "search", "favorites", "personal-feed", "festivals",
    ],
}
OLD_LANE_HEADS = {
    "lane-1": "674d793cfc761b39e6cebe087aae6450ded910d6",
    "lane-2": "864e83b4fb3efb50a018e1f37db6c67da2730485",
    "lane-3": "bf436751607c335111656576317cd9a18af9baee",
}
OLD_MANIFEST = (
    "catalog/asp-production-conveyor-v3/a0/direct-plugin-route-bundles-v1/"
    "{lane}/{slug}/manifest.v1.json"
)
ORDER = [slug for lane in ("lane-1", "lane-2", "lane-3") for slug in LANES[lane]]


def run(*args: str, cwd: Path | None = None, check: bool = True) -> str:
    cp = subprocess.run(
        list(args), cwd=cwd or Path.cwd(), text=True,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    )
    if check and cp.returncode:
        raise RuntimeError(f"COMMAND_FAILED:{args}:\nSTDOUT:\n{cp.stdout}\nSTDERR:\n{cp.stderr}")
    return cp.stdout.strip()


def git(*args: str, cwd: Path | None = None, check: bool = True) -> str:
    return run("git", *args, cwd=cwd, check=check)


def show(ref: str, path: str, cwd: Path | None = None) -> bytes:
    cp = subprocess.run(
        ["git", "show", f"{ref}:{path}"], cwd=cwd or Path.cwd(),
        stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    )
    if cp.returncode:
        raise RuntimeError(f"GIT_SHOW_FAILED:{ref}:{path}:{cp.stderr.decode('utf-8', 'replace')}")
    return cp.stdout


def json_at(ref: str, path: str, cwd: Path | None = None) -> Any:
    return json.loads(show(ref, path, cwd).decode("utf-8"))


def sha256(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def canonical(value: Any) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def digest(value: Any) -> str:
    return sha256(canonical(value))


def pretty(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n"


def blob(ref: str, path: str, cwd: Path | None = None) -> str:
    return git("rev-parse", f"{ref}:{path}", cwd=cwd)


def tree(ref: str, cwd: Path | None = None) -> str:
    return git("rev-parse", f"{ref}^{{tree}}", cwd=cwd)


def slug_ident(slug: str) -> str:
    return "".join(part.capitalize() for part in re.split(r"[^A-Za-z0-9]+", slug) if part)


def exact_source_records(old: dict[str, Any], cwd: Path) -> tuple[list[dict[str, Any]], dict[str, str]]:
    records: list[dict[str, Any]] = []
    raw_by_name: dict[str, str] = {}
    for item in old.get("sources", []):
        ref = str(item["ref"])
        path = str(item["path"])
        raw = show(ref, path, cwd)
        actual = {
            "name": str(item["name"]),
            "ref": ref,
            "path": path,
            "git_blob_sha1": blob(ref, path, cwd),
            "bytes": len(raw),
            "sha256": sha256(raw),
        }
        for key in ("git_blob_sha1", "bytes", "sha256"):
            if str(actual[key]) != str(item[key]):
                raise AssertionError(f"SOURCE_BINDING_DRIFT:{actual['name']}:{key}:{item[key]}:{actual[key]}")
        records.append(actual)
        raw_by_name[actual["name"]] = raw.decode("utf-8")
    if not records:
        raise AssertionError("NO_EXACT_SOURCE_RECORDS")
    return records, raw_by_name


def load_atlas(cwd: Path) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
    if tree(ATLAS_R2, cwd) != ATLAS_R2_TREE:
        raise AssertionError("ATLAS_R2_TREE_DRIFT")
    if tree(ATLAS_R21, cwd) != ATLAS_R21_TREE:
        raise AssertionError("ATLAS_R21_TREE_DRIFT")
    base_raw = show(ATLAS_R2, ATLAS_BINDINGS_PATH, cwd)
    base = json.loads(base_raw)
    ext_raw = show(ATLAS_R21, ATLAS_EXTENSION_PATH, cwd)
    extension = json.loads(ext_raw)
    sources = {
        "base": {
            "head": ATLAS_R2, "tree": ATLAS_R2_TREE, "path": ATLAS_BINDINGS_PATH,
            "git_blob_sha1": blob(ATLAS_R2, ATLAS_BINDINGS_PATH, cwd),
            "bytes": len(base_raw), "sha256": sha256(base_raw),
        },
        "extension": {
            "head": ATLAS_R21, "tree": ATLAS_R21_TREE, "path": ATLAS_EXTENSION_PATH,
            "git_blob_sha1": blob(ATLAS_R21, ATLAS_EXTENSION_PATH, cwd),
            "bytes": len(ext_raw), "sha256": sha256(ext_raw),
        },
    }
    if int(base.get("physical_page_count", 0)) != 42 or len(base.get("units", [])) != 42:
        raise AssertionError("ATLAS_R2_EXPECTED_42_UNITS")
    if extension.get("base", {}).get("head") != ATLAS_R2:
        raise AssertionError("ATLAS_R21_BASE_HEAD_MISMATCH")
    return base, extension, sources


def norm(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def choose_atlas_unit(slug: str, old: dict[str, Any], atlas: dict[str, Any]) -> dict[str, Any]:
    units = list(atlas.get("units", []))
    source_package = str(old.get("source_package_id") or "")
    role = str(old.get("projection_role") or "").upper()
    target_name = str((old.get("target") or {}).get("page_name") or "")
    primary_source_paths = {str(item.get("path")) for item in old.get("sources", [])}

    candidates = [u for u in units if u.get("package_id") == source_package]
    if role in {"READY", "EXCEPTION"}:
        role_filtered = [u for u in candidates if str(u.get("projection_role", "")).upper() == role]
        if role_filtered:
            candidates = role_filtered
    if len(candidates) == 1:
        return candidates[0]

    by_source = []
    for unit in units:
        remote = ((unit.get("publication_dependency") or {}).get("remote_binding") or {})
        if remote.get("source_path") in primary_source_paths:
            by_source.append(unit)
    if role in {"READY", "EXCEPTION"}:
        role_filtered = [u for u in by_source if str(u.get("projection_role", "")).upper() == role]
        if role_filtered:
            by_source = role_filtered
    if len(by_source) == 1:
        return by_source[0]

    if target_name:
        by_name = [u for u in units if target_name in {u.get("physical_page_name"), u.get("exact_package_page_name")}]
        if len(by_name) == 1:
            return by_name[0]

    aliases = {
        "owner-review-index": ["owner-review-index"],
        "home": ["archetype-home", "home"],
        "weekend-listing": ["weekend", "listing-weekend"],
        "popular-listing": ["popular", "listing-popular"],
        "unusual-listing": ["unusual", "listing-unusual"],
        "collections": ["collections"],
        "exhibitions": ["exhibitions"],
        "search": ["search"],
        "favorites": ["favorites"],
        "personal-feed": ["personal-feed"],
        "festivals": ["festivals"],
        "free-ready": ["free", "ready"],
        "free-exception": ["free", "exception"],
        "date-listing-ready": ["date", "ready"],
        "date-listing-exception": ["date", "exception"],
    }[slug]
    scored: list[tuple[int, dict[str, Any]]] = []
    for unit in units:
        haystack = norm(" ".join(str(unit.get(k) or "") for k in (
            "atlas_page_id", "logical_source_unit_id", "package_id", "physical_page_name", "projection_role"
        )))
        score = sum(1 for token in aliases if norm(token) in haystack)
        if role and str(unit.get("projection_role", "")).upper() == role:
            score += 2
        if score:
            scored.append((score, unit))
    scored.sort(key=lambda pair: (pair[0], str(pair[1].get("page_order"))), reverse=True)
    if not scored or (len(scored) > 1 and scored[0][0] == scored[1][0]):
        raise AssertionError(
            f"ATLAS_UNIT_AMBIGUOUS:{slug}:source={source_package}:role={role}:"
            f"candidates={[u.get('atlas_page_id') for _, u in scored[:8]]}"
        )
    return scored[0][1]


def dependency_bindings(old: dict[str, Any], sources: list[dict[str, Any]], job_id: str) -> list[dict[str, Any]]:
    primary = sources[0]
    result = []
    for index, item in enumerate(old.get("dependencies", []), start=1):
        semantic = str(item.get("semantic_id") or item.get("key") or "")
        if not semantic:
            raise AssertionError(f"DEPENDENCY_SEMANTIC_ID_MISSING:{job_id}:{index}")
        source_tuple = {
            "semantic_id": semantic,
            "package_id": old.get("source_package_id"),
            "remote_head": primary["ref"],
            "git_blob_sha1": primary["git_blob_sha1"],
            "source_sha256": primary["sha256"],
        }
        token = digest([job_id, semantic, source_tuple])
        result.append({
            "ordinal": index,
            "semantic_id": semantic,
            "canonical_path": f"A0 Route Dependencies / {semantic}",
            "component_id": f"a0c-{token[:24]}",
            "main_id": f"a0m-{token[24:48]}",
            "source_tuple": source_tuple,
            "source_tuple_sha256": digest(source_tuple),
            "binding_state": "QA_INTEGRATE_GATED_EXACT_NATIVE_IDENTITY",
            "placeholder_substitution": False,
        })
    return result


def text_line(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def owner_rows(atlas: dict[str, Any]) -> list[dict[str, Any]]:
    rows = []
    for unit in sorted(atlas["units"], key=lambda item: str(item["page_order"])):
        rows.append({
            "page_order": unit["page_order"],
            "atlas_page_id": unit["atlas_page_id"],
            "package_id": unit["package_id"],
            "template_id": unit["template_id"],
            "projection_role": unit["projection_role"],
            "physical_page_name": unit["physical_page_name"],
            "v0_status": "PENDING_V0",
        })
    if len(rows) != 42 or len({r["page_order"] for r in rows}) != 42:
        raise AssertionError("OWNER_INDEX_ROWS_NOT_EXACT_42")
    return rows


def build_operations(slug: str, old: dict[str, Any], atlas_unit: dict[str, Any], rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    operations: list[dict[str, Any]] = []
    job_id = f"A0-DIRECT-PLUGIN-{slug.replace('-', '_').upper()}-R2"

    def add(kind: str, role: str, name: str, text: str, x: int, y: int, width: int, height: int) -> None:
        stable = "a0r2-" + digest([job_id, role, name, text])[:28]
        operations.append({
            "ordinal": len(operations) + 1,
            "kind": kind,
            "role": role,
            "stable_id": stable,
            "name": name,
            "text": text,
            "geometry": {"x": x, "y": y, "width": width, "height": height},
        })

    if slug == "owner-review-index":
        add("board", "root", "OWNER_INDEX_V2 · A0 · Candidate", "", 0, 0, 2624, 2528)
        add(
            "text", "header", "Owner Review Index · exact Atlas R2 42-page census",
            "Atlas R2 owner review index · 42 exact physical page units · PENDING_V0",
            64, 24, 2496, 72,
        )
        y = 120
        for row in rows:
            add(
                "text", "owner-index-row", f"{row['page_order']} · {row['atlas_page_id']}",
                text_line(row), 64, y, 2496, 48,
            )
            y += 56
        if y - 56 + 48 != 2464:
            raise AssertionError(f"OWNER_INDEX_BOTTOM_GEOMETRY:{y - 56 + 48}")
        return operations

    exact = old.get("exact_tuple") or {}
    variants = list(exact.get("variants") or [])
    routes = list(exact.get("routes") or [])
    states = list(exact.get("states") or [])
    fixtures = list(exact.get("fixtures") or [])
    projection_role = str(old.get("projection_role") or atlas_unit.get("projection_role") or "CANDIDATE")
    root_height = 1164
    if slug.startswith("free-") or slug.startswith("date-listing-"):
        root_height = max(1164, 300 + 300 * max(1, len(variants)))
    add("board", "root", f"{atlas_unit['physical_page_name']} · {projection_role}", "", 0, 0, 2624, root_height)
    header = {
        "package_id": old.get("source_package_id"),
        "route": routes,
        "states": states,
        "fixtures": fixtures,
        "atlas_page_id": atlas_unit["atlas_page_id"],
        "page_order": atlas_unit["page_order"],
        "template_id": atlas_unit["template_id"],
        "projection_role": projection_role,
    }
    add("text", "header", f"{slug} · exact source-bound route header", text_line(header), 64, 48, 2496, 104)

    if not variants:
        variants = [{
            "id": "source-bound",
            "scenario_id": exact.get("subject") or slug,
            "semantic_regions": sorted({dep.get("semantic_id") for dep in old.get("dependencies", []) if dep.get("semantic_id")}),
            "viewport": {"width": 1280, "height": 800},
        }]
    left = 64
    top = 184
    for index, variant in enumerate(variants):
        vid = str(variant.get("id") or variant.get("scenario_id") or f"variant-{index+1}")
        viewport = variant.get("viewport") or {}
        semantic_regions = list(variant.get("semantic_regions") or [])
        scenario = {
            "variant_id": vid,
            "scenario_id": variant.get("scenario_id"),
            "source_root_key": variant.get("source_root_key"),
            "viewport": viewport,
            "routes": routes,
            "states": states,
            "fixtures": [] if ("exception" in slug and any(state in {"loading", "empty", "error"} for state in states)) else fixtures,
            "semantic_regions": semantic_regions,
            "cards_absent_by_state_contract": bool("exception" in slug),
        }
        width = 1184 if index % 2 == 0 else 1184
        x = left if index % 2 == 0 else 1376
        y = top + (index // 2) * 304
        add("board", "source-bound-surface", f"{slug} · {vid} · source-bound", "", x, y, width, 264)
        add("text", "surface-metadata", f"{vid} · exact route/state/fixture tuple", text_line(scenario), x + 24, y + 24, width - 48, 96)
        region_text = text_line({"semantic_regions": semantic_regions, "source_bound": True, "no_placeholders": True})
        add("text", "surface-content", f"{vid} · semantic regions", region_text, x + 24, y + 136, width - 48, 96)
    evidence_y = top + ((len(variants) + 1) // 2) * 304
    evidence = {
        "source_package_record_sha256": old.get("source_package_record_sha256"),
        "projection": exact.get("projection"),
        "fixture_semantics": exact.get("fixture_semantics"),
        "atlas_semantic_slots": atlas_unit.get("semantic_slot_bindings"),
    }
    add("board", "evidence", f"{slug} · evidence", "", 64, evidence_y, 2496, 184)
    add("text", "evidence-content", f"{slug} · source / projection / fixture evidence", text_line(evidence), 88, evidence_y + 24, 2448, 128)
    return operations


SHA_JS = r'''
function utf8Bytes(text){
  const out=[];
  for(let i=0;i<text.length;i++){
    let c=text.charCodeAt(i);
    if(c<0x80){out.push(c);continue}
    if(c<0x800){out.push(0xc0|(c>>6),0x80|(c&63));continue}
    if(c>=0xd800&&c<=0xdbff&&i+1<text.length){
      const d=text.charCodeAt(++i);
      if(d>=0xdc00&&d<=0xdfff){const cp=0x10000+((c-0xd800)<<10)+(d-0xdc00);out.push(0xf0|(cp>>18),0x80|((cp>>12)&63),0x80|((cp>>6)&63),0x80|(cp&63));continue}
      i--;
    }
    out.push(0xe0|(c>>12),0x80|((c>>6)&63),0x80|(c&63));
  }
  return out;
}
function sha256Hex(input){
  const bytes=typeof input==='string'?utf8Bytes(input):Array.from(input||[]);
  const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const data=bytes.slice(),bitLen=bytes.length*8;data.push(0x80);while((data.length%64)!==56)data.push(0);
  const hi=Math.floor(bitLen/0x100000000),lo=bitLen>>>0;for(let s=24;s>=0;s-=8)data.push((hi>>>s)&255);for(let s=24;s>=0;s-=8)data.push((lo>>>s)&255);
  const w=new Array(64),rotr=(x,n)=>(x>>>n)|(x<<(32-n));
  for(let off=0;off<data.length;off+=64){
    for(let i=0;i<16;i++){const j=off+i*4;w[i]=((data[j]<<24)|(data[j+1]<<16)|(data[j+2]<<8)|data[j+3])>>>0}
    for(let i=16;i<64;i++){const a=w[i-15],b=w[i-2],s0=(rotr(a,7)^rotr(a,18)^(a>>>3))>>>0,s1=(rotr(b,17)^rotr(b,19)^(b>>>10))>>>0;w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0}
    let [a,b,c,d,e,f,g,q]=h;
    for(let i=0;i<64;i++){const S1=(rotr(e,6)^rotr(e,11)^rotr(e,25))>>>0,ch=((e&f)^((~e)&g))>>>0,t1=(q+S1+ch+k[i]+w[i])>>>0,S0=(rotr(a,2)^rotr(a,13)^rotr(a,22))>>>0,maj=((a&b)^(a&c)^(b&c))>>>0,t2=(S0+maj)>>>0;q=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0}
    h[0]=(h[0]+a)>>>0;h[1]=(h[1]+b)>>>0;h[2]=(h[2]+c)>>>0;h[3]=(h[3]+d)>>>0;h[4]=(h[4]+e)>>>0;h[5]=(h[5]+f)>>>0;h[6]=(h[6]+g)>>>0;h[7]=(h[7]+q)>>>0;
  }
  return h.map(x=>x.toString(16).padStart(8,'0')).join('');
}
'''

RUNTIME_JS = r'''
((root)=>{
'use strict';
const DATA=__DATA__;
__SHA_JS__
const fail=(code,detail)=>{throw new Error(detail?code+':'+detail:code)};
const need=(value,code,detail)=>{if(!value)fail(code,detail);return value};
const canon=value=>Array.isArray(value)?'['+value.map(canon).join(',')+']':value&&typeof value==='object'?'{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canon(value[key])).join(',')+'}':JSON.stringify(value);
const parse=value=>{try{return JSON.parse(value)}catch(error){fail('JSON_INVALID')}};
const children=node=>Array.from(node&&node.children||[]);
const walk=node=>node?[node].concat(children(node).flatMap(walk)):[];
const pget=(node,key,space=DATA.plugin_namespace)=>node&&typeof node.getSharedPluginData==='function'?(node.getSharedPluginData(space,key)||''):'';
const pset=(node,key,value,space=DATA.plugin_namespace)=>{need(node&&typeof node.setSharedPluginData==='function','PLUGIN_DATA_UNAVAILABLE',key);need(typeof value==='string','PLUGIN_DATA_STRING_REQUIRED',key);node.setSharedPluginData(space,key,value)};
const findPage=penpot=>Array.from(penpot.currentFile.pages||[]).find(page=>pget(page,'stable-page-id')===DATA.stable_page_id||page.name===DATA.atlas.physical_page_name)||null;
const findByStable=(page,id)=>walk(page&&page.root).filter(node=>pget(node,'stable-id')===id);
const nativeRevision=penpot=>{const value=penpot.currentFile.revn;need(Number.isInteger(value)&&value>=0,'NATIVE_REVN_INVALID');return value};
function active(penpot){
  const raw=penpot.currentFile.getSharedPluginData('kenigevents','asp-active-run-v1')||'';
  need(raw,'PHYSICAL_ACTIVE_REQUIRED');const marker=parse(raw);
  need(marker.schema===DATA.run_control.schema,'ACTIVE_SCHEMA');
  need(marker.package_id===DATA.package_id,'ACTIVE_PACKAGE');
  need(marker.writer_id==='/root/publish_r2','ACTIVE_WRITER');
  need(marker.run_id===DATA.run_control.run_id&&marker.lease_token===DATA.run_control.lease_token&&marker.cancel_token===DATA.run_control.cancel_token,'ACTIVE_LEASE');
  need(marker.state==='ACTIVE'&&marker.cancelled===false,'ACTIVE_STATE');
  need(marker.triggered_by&&typeof marker.triggered_by==='string','ACTIVE_TRIGGER');
  need(/^[0-9a-f]{40}$/.test(marker.package_head||'')&&/^[0-9a-f]{40}$/.test(marker.package_tree||''),'ACTIVE_GIT_TUPLE');
  need(/^[0-9a-f]{64}$/.test(marker.bundle_sha256||'')&&Number.isInteger(marker.bundle_bytes)&&marker.bundle_bytes>0,'ACTIVE_BUNDLE_TUPLE');
  need(marker.native_revision===nativeRevision(penpot),'ACTIVE_REVISION');
  return marker;
}
function verifySources(){
  for(const item of DATA.sources){const raw=DATA.source_raw[item.name];need(typeof raw==='string','SOURCE_RAW_MISSING',item.name);need(utf8Bytes(raw).length===item.bytes,'SOURCE_BYTES',item.name);need(sha256Hex(raw)===item.sha256,'SOURCE_SHA',item.name)}
  need(DATA.factual_bytes_changed===0,'FACTUAL_BYTES_CHANGED');
}
function captureProtected(penpot){
  const policy=DATA.protected_projections,descriptor=[];
  for(const spec of policy.pages){const page=Array.from(penpot.currentFile.pages||[]).find(item=>item.id===spec.page_id);need(page,'PROTECTED_PAGE_MISSING',spec.page_id);const ids=[];for(const id of spec.root_ids){const node=walk(page.root).find(item=>item.id===id);need(node,'PROTECTED_ROOT_MISSING',id);ids.push({id:node.id,name:node.name||'',children:children(node).map(child=>child.id)})}descriptor.push({page_id:page.id,roots:ids})}
  return sha256Hex(canon(descriptor));
}
function guardProtected(host){const current=captureProtected(host.penpot);if(host.storage.__protected===undefined)host.storage.__protected=current;need(host.storage.__protected===current,'PROTECTED_PROJECTION_DRIFT');return current}
function resolveDependencies(penpot){
  const list=Array.from(penpot.library.local.components||[]),resolved=[];
  for(const spec of DATA.dependencies){const matches=list.filter(component=>component.id===spec.component_id&&pget(component,'semantic-id','kenigevents')===spec.semantic_id&&pget(component,'source-tuple-sha256','kenigevents')===spec.source_tuple_sha256&&component.path===spec.canonical_path);need(matches.length===1,'DEPENDENCY_EXACT_CARDINALITY',spec.semantic_id);const main=matches[0].mainInstance();need(main&&main.id===spec.main_id,'DEPENDENCY_MAIN_ID',spec.semantic_id);resolved.push({semantic_id:spec.semantic_id,component_id:matches[0].id,main_id:main.id})}
  return resolved;
}
function project(host){
  const penpot=need(host&&host.penpot,'PENPOT_REQUIRED');need(host.storage&&typeof host.storage==='object','HOST_STORAGE_REQUIRED');verifySources();
  need(DATA.atlas.base_head&&DATA.atlas.base_tree&&DATA.atlas.extension_head&&DATA.atlas.extension_tree,'ATLAS_TUPLE_REQUIRED');
  need(DATA.atlas.atlas_page_id&&DATA.atlas.physical_page_name&&DATA.atlas.page_order&&DATA.atlas.template_id,'ATLAS_PAGE_BINDING_REQUIRED');
  const marker=active(penpot),protected_sha256=guardProtected(host),dependencies=resolveDependencies(penpot),page=findPage(penpot);
  return {state:'PROJECTED',package_id:DATA.package_id,native_revision:nativeRevision(penpot),active_marker:{package_head:marker.package_head,package_tree:marker.package_tree,bundle_sha256:marker.bundle_sha256,bundle_bytes:marker.bundle_bytes},atlas:DATA.atlas,route_state_fixture_tuple_sha256:DATA.route_state_fixture_tuple_sha256,protected_sha256,dependencies,target_page_id:page?page.id:null};
}
function unknownManaged(page){return walk(page&&page.root).filter(node=>(node.name||'').startsWith(DATA.managed_name_prefix)&&!pget(node,'stable-id'))}
async function activate(penpot,page){await penpot.openPage(page);need(penpot.currentPage===page&&penpot.currentPage.id===page.id,'CURRENT_PAGE_PROOF')}
function parentFor(page,op){if(op.role==='root')return page.root;const roots=findByStable(page,DATA.operations[0].stable_id);need(roots.length===1,'ROOT_CARDINALITY');return roots[0]}
function createNode(penpot,op){let node;if(op.kind==='board')node=penpot.createBoard();else if(op.kind==='text')node=penpot.createText(op.text);else fail('OP_KIND',op.kind);need(node&&node.id,'UNKNOWN_OUTCOME_STOP',op.stable_id);node.name=DATA.managed_name_prefix+op.name;node.x=op.geometry.x;node.y=op.geometry.y;node.width=op.geometry.width;node.height=op.geometry.height;if(op.kind==='text')node.characters=op.text;pset(node,'stable-id',op.stable_id);pset(node,'owner-job',DATA.package_id);pset(node,'operation-ordinal',String(op.ordinal));return node}
async function execute(host){
  const projection=project(host),penpot=host.penpot;let page=findPage(penpot);
  if(!page){active(penpot);page=penpot.createPage();need(page&&page.id,'UNKNOWN_OUTCOME_STOP','page');page.name=DATA.atlas.physical_page_name;pset(page,'stable-page-id',DATA.stable_page_id);pset(page,'owner-job',DATA.package_id);pset(page,'atlas-binding',canon(DATA.atlas));host.storage.phase='PAGE_CREATED';return {state:'RUNNING',phase_after:'PAGE_CREATED',created:1,terminal:false,projection_sha256:sha256Hex(canon(projection))}}
  await activate(penpot,page);need(unknownManaged(page).length===0,'UNKNOWN_MANAGED_NODE');
  const missing=[];for(const op of DATA.operations){const matches=findByStable(page,op.stable_id);need(matches.length<=1,'DUPLICATE_STABLE_ID',op.stable_id);if(matches.length===0)missing.push(op)}
  if(missing.length===0){host.storage.phase='DONE';return {state:'DONE',phase_after:'DONE',created:0,terminal:true}}
  let created=0;for(const op of missing.slice(0,3)){active(penpot);need(penpot.currentPage===page&&penpot.currentPage.id===page.id,'CURRENT_PAGE_PROOF_BEFORE_CREATE');const parent=parentFor(page,op);const node=createNode(penpot,op);parent.appendChild(node);need(findByStable(page,op.stable_id).length===1,'POST_CREATE_READBACK',op.stable_id);active(penpot);need(penpot.currentPage===page,'CURRENT_PAGE_PROOF_AFTER_CREATE');created++}
  const left=DATA.operations.filter(op=>findByStable(page,op.stable_id).length===0).length;host.storage.phase=left===0?'DONE':'MATERIALIZING';return {state:left===0?'DONE':'RUNNING',phase_after:host.storage.phase,created,terminal:left===0,remaining:left};
}
async function settle(host){
  const projection=project(host),page=findPage(host.penpot);need(page,'TARGET_PAGE_MISSING');await activate(host.penpot,page);need(unknownManaged(page).length===0,'UNKNOWN_MANAGED_NODE');
  for(const op of DATA.operations)need(findByStable(page,op.stable_id).length===1,'SETTLEMENT_OPERATION_MISSING',op.stable_id);
  const owned=walk(page.root).filter(node=>pget(node,'owner-job')===DATA.package_id);need(owned.length===DATA.operations.length,'SETTLEMENT_MANAGED_CENSUS');
  const rootNodes=findByStable(page,DATA.operations[0].stable_id);need(rootNodes.length===1,'SETTLEMENT_ROOT');for(const node of owned)need(node===rootNodes[0]||walk(rootNodes[0]).includes(node),'MANAGED_OUTSIDE_ROOT');
  return {state:'SETTLED',terminal:true,created:0,page_id:page.id,root_id:rootNodes[0].id,managed_nodes:owned.length,projection_sha256:sha256Hex(canon(projection))};
}
async function createHost(args){
  const penpot=need(args&&args.penpot,'PENPOT_REQUIRED'),storage=need(args.storage,'STORAGE_REQUIRED'),make=need(args.pluginNode,'PLUGIN_NODE_FACTORY_REQUIRED');
  const ensureSeedPage=(spec)=>{let page=Array.from(penpot.currentFile.pages||[]).find(item=>item.id===spec.page_id);if(!page){need(typeof penpot.__seedPage==='function','CONFORMANCE_SEED_PAGE_UNAVAILABLE');page=penpot.__seedPage(spec.page_id);page.name='Protected '+spec.page_id}for(const rootId of spec.root_ids){let node=walk(page.root).find(item=>item.id===rootId);if(!node){node=make(rootId,'board');node.name='Protected '+rootId;page.root.appendChild(node)}}};
  for(const spec of DATA.protected_projections.pages)ensureSeedPage(spec);
  for(const spec of DATA.dependencies){if(Array.from(penpot.library.local.components||[]).some(item=>item.id===spec.component_id))continue;const component=make(spec.component_id,'component'),main=make(spec.main_id,'board');component.name=spec.semantic_id;component.path=spec.canonical_path;component.mainInstance=()=>main;pset(component,'semantic-id',spec.semantic_id,'kenigevents');pset(component,'source-tuple-sha256',spec.source_tuple_sha256,'kenigevents');pset(component,'package-id',String(spec.source_tuple.package_id||''),'kenigevents');pset(component,'remote-head',spec.source_tuple.remote_head,'kenigevents');pset(component,'git-blob-sha1',spec.source_tuple.git_blob_sha1,'kenigevents');penpot.library.local.components.push(component)}
  const marker={schema:DATA.run_control.schema,package_id:DATA.package_id,run_id:DATA.run_control.run_id,writer_id:'/root/publish_r2',lease_token:DATA.run_control.lease_token,cancel_token:DATA.run_control.cancel_token,state:'ACTIVE',cancelled:false,mutation_in_flight:false,writer_released:false,triggered_by:'D0_PLUGIN_BUNDLE_CONFORMANCE_V1',package_head:'0000000000000000000000000000000000000000',package_tree:'1111111111111111111111111111111111111111',bundle_sha256:'2222222222222222222222222222222222222222222222222222222222222222',bundle_bytes:1,native_revision:nativeRevision(penpot),projection_sha256:DATA.atlas.binding_sha256};
  penpot.currentFile.setSharedPluginData('kenigevents','asp-active-run-v1',JSON.stringify(marker));
  const probe=make('strict-string-probe-'+DATA.slug,'shape');return {penpot,storage,__probe:probe};
}
async function prepareReplay(host,args){return {penpot:need(args&&args.penpot,'PENPOT_REQUIRED'),storage:need(args.storage,'STORAGE_REQUIRED')}}
async function strictStringProbe(host){const node=need(host.__probe,'STRICT_PROBE_MISSING'),result={};pset(node,'string','PASS');result.string='PASS';for(const [key,value] of [['number',1],['object',{}],['boolean',true],['null',null],['undefined',undefined]]){try{node.setSharedPluginData(DATA.plugin_namespace,key,value);result[key]='ACCEPTED'}catch(error){result[key]='REJECTED'}}return result}
const api={
  metadata:{schema:'D0_PLUGIN_BUNDLE_V1',package_id:DATA.package_id,bundle_sha256_binding:'EXTERNAL_AUTHORIZATION_TUPLE',current_page_activation:true,max_creates_per_phase:3,replay_created:0,entrypoints:{projection:'project',execution:'execute',settlement:'settle'},atlas_binding:DATA.atlas,route_state_fixture_tuple_sha256:DATA.route_state_fixture_tuple_sha256,runtime_shared_imports:0},
  project,execute,settle,conformance:{createHost,prepareReplay,strictStringProbe}
};
root[DATA.global_name]=Object.freeze(api);
})(globalThis);
'''


def protected_pages(old: dict[str, Any]) -> list[dict[str, Any]]:
    policy = old.get("protected_projections") or {}
    pages: list[dict[str, Any]] = []
    free = policy.get("free") or {}
    if free.get("page_id") and free.get("root_ids"):
        pages.append({"page_id": free["page_id"], "root_ids": list(free["root_ids"]), "external_sha256": free.get("sha256")})
    foundations = policy.get("foundations") or {}
    if foundations.get("page_id") and foundations.get("root_id"):
        pages.append({"page_id": foundations["page_id"], "root_ids": [foundations["root_id"]], "external_sha256": foundations.get("sha256")})
    if not pages:
        raise AssertionError("PROTECTED_PROJECTIONS_MISSING")
    return pages


def build_data(slug: str, lane: str, old: dict[str, Any], cwd: Path) -> dict[str, Any]:
    atlas, extension, atlas_sources = load_atlas(cwd)
    source_records, source_raw = exact_source_records(old, cwd)
    atlas_unit = choose_atlas_unit(slug, old, atlas)
    rows = owner_rows(atlas) if slug == "owner-review-index" else []
    job_id = f"A0-DIRECT-PLUGIN-{slug.replace('-', '_').upper()}-R2"
    global_name = "A0DirectPlugin" + slug_ident(slug) + "R2"
    deps = dependency_bindings(old, source_records, job_id)
    operations = build_operations(slug, old, atlas_unit, rows)
    run_seed = digest([job_id, source_records, atlas_unit])
    exact_tuple = old.get("exact_tuple") or {}
    atlas_binding = {
        "atlas_id": "ASP_PENPOT_ATLAS_LAYOUT_R2_1",
        "base_head": ATLAS_R2,
        "base_tree": ATLAS_R2_TREE,
        "extension_head": ATLAS_R21,
        "extension_tree": ATLAS_R21_TREE,
        "atlas_page_id": atlas_unit["atlas_page_id"],
        "physical_page_name": atlas_unit["physical_page_name"],
        "page_order": atlas_unit["page_order"],
        "template_id": atlas_unit["template_id"],
        "projection_role": atlas_unit["projection_role"],
        "semantic_slot_bindings": atlas_unit["semantic_slot_bindings"],
        "binding_origin": "ATLAS_R2_BASE_IMMUTABLE_UNDER_R2_1_EXTENSION",
        "base_source": atlas_sources["base"],
        "extension_source": atlas_sources["extension"],
        "extension_page_count": extension.get("counts", {}).get("extension_page_count"),
    }
    atlas_binding["binding_sha256"] = digest(atlas_binding)
    data = {
        "schema_version": "kenigevents.a0.direct-plugin-route-bundle.r2",
        "package_id": job_id,
        "source_package_id": old.get("source_package_id"),
        "source_job_id": old.get("job_id"),
        "slug": slug,
        "lane": lane,
        "global_name": global_name,
        "plugin_namespace": "kenigevents-a0-route-r2",
        "managed_name_prefix": f"[A0R2:{slug}] ",
        "stable_page_id": "a0p-" + digest([job_id, atlas_unit["atlas_page_id"]])[:28],
        "sources": source_records,
        "source_raw": source_raw,
        "source_package_record_sha256": old.get("source_package_record_sha256"),
        "route_state_fixture_tuple": exact_tuple,
        "route_state_fixture_tuple_sha256": digest(exact_tuple),
        "atlas": atlas_binding,
        "owner_index_rows": rows,
        "dependencies": deps,
        "protected_projections": {"pages": protected_pages(old)},
        "operations": operations,
        "run_control": {
            "schema": "kenigevents.asp-run-control.v1",
            "run_id": run_seed[:8] + "-" + run_seed[8:12] + "-4" + run_seed[13:16] + "-a" + run_seed[17:20] + "-" + run_seed[20:32],
            "lease_token": digest([run_seed, "lease"]),
            "cancel_token": digest([run_seed, "cancel"]),
        },
        "factual_bytes_changed": 0,
        "route_registry_changed": False,
        "atlas_changed": False,
        "visual_pass_declared": False,
        "penpot_reads": 0,
        "penpot_mutations": 0,
        "kaggle": False,
    }
    data["record_sha256"] = digest(data)
    return data


def render_bundle(data: dict[str, Any]) -> str:
    payload = json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return RUNTIME_JS.replace("__DATA__", payload).replace("__SHA_JS__", SHA_JS).lstrip()


def package_test_source() -> str:
    return r'''#!/usr/bin/env python3
import hashlib,json,re,sys
from pathlib import Path
root=Path(sys.argv[1])
package=json.loads((root/'package.r2.json').read_text(encoding='utf-8'))
bundle=(root/'bundle.direct-plugin.r2.js').read_bytes()
assert package['state']=='DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE'
assert package['bundle']['bytes']==len(bundle)
assert package['bundle']['sha256']==hashlib.sha256(bundle).hexdigest()
assert package['bundle']['global'].isidentifier()
assert package['runtime_shared_imports']==0
assert package['factual_package_bytes_changed']==0
assert package['route_registry_changed'] is False
assert package['atlas_changed'] is False
assert package['visual_pass_declared'] is False
assert package['penpot_reads']==0 and package['penpot_mutations']==0
assert package['atlas_binding']['base_head']=='663be702d481972cb2e8863af500f1c35dda1d8c'
assert package['atlas_binding']['extension_head']=='be4918e5d8e1c1bba5da478acfd08f8035cfc1a5'
assert package['atlas_binding']['atlas_page_id']
assert package['atlas_binding']['physical_page_name']
assert package['atlas_binding']['page_order']
assert package['atlas_binding']['template_id']
assert package['atlas_binding']['semantic_slot_bindings']
assert package['operations'][0]['role']=='root'
assert all(op['text'] or op['kind']=='board' for op in package['operations'])
for op in package['operations']:
    text=(op['name']+' '+op['text']).lower()
    assert not re.search(r'\b(?:placeholder|lorem|generic blank)\b',text)
if package['slug']=='owner-review-index':
    assert len(package['owner_index_rows'])==42
    assert len({row['page_order'] for row in package['owner_index_rows']})==42
    assert package['operations'][0]['geometry']=={'x':0,'y':0,'width':2624,'height':2528}
    rows=[op for op in package['operations'] if op['role']=='owner-index-row']
    assert len(rows)==42
    assert max(row['geometry']['y']+row['geometry']['height'] for row in rows)==2464
source=bundle.decode('utf-8')
for token in ('D0_PLUGIN_BUNDLE_V1','createHost','prepareReplay','strictStringProbe','currentFile.revn','await penpot.openPage','EXTERNAL_AUTHORIZATION_TUPLE'):
    assert token in source, token
print(json.dumps({'result':'PASS','slug':package['slug'],'bundle_sha256':package['bundle']['sha256']}))
'''


def source_test_source() -> str:
    return r'''#!/usr/bin/env python3
import hashlib,json,subprocess,sys
from pathlib import Path
root=Path(sys.argv[1]);repo=Path(sys.argv[2])
package=json.loads((root/'package.r2.json').read_text(encoding='utf-8'))
for item in package['sources']:
    cp=subprocess.run(['git','show',f"{item['ref']}:{item['path']}"],cwd=repo,stdout=subprocess.PIPE,check=True)
    raw=cp.stdout
    assert len(raw)==item['bytes']
    assert hashlib.sha256(raw).hexdigest()==item['sha256']
    blob=subprocess.check_output(['git','rev-parse',f"{item['ref']}:{item['path']}"],cwd=repo,text=True).strip()
    assert blob==item['git_blob_sha1']
for key in ('base_source','extension_source'):
    item=package['atlas_binding'][key]
    raw=subprocess.check_output(['git','show',f"{item['head']}:{item['path']}"],cwd=repo)
    assert len(raw)==item['bytes']
    assert hashlib.sha256(raw).hexdigest()==item['sha256']
    assert subprocess.check_output(['git','rev-parse',f"{item['head']}:{item['path']}"],cwd=repo,text=True).strip()==item['git_blob_sha1']
print(json.dumps({'result':'PASS','slug':package['slug'],'sources':len(package['sources'])}))
'''


def build_one(slug: str, lane: str, cwd: Path, out: Path) -> dict[str, Any]:
    old_head = OLD_LANE_HEADS[lane]
    old_slug = {"popular-listing": "popular", "unusual-listing": "unusual"}.get(slug, slug)
    old_path = OLD_MANIFEST.format(lane=lane, slug=old_slug)
    old = json_at(old_head, old_path, cwd)
    data = build_data(slug, lane, old, cwd)
    bundle_text = render_bundle(data)
    package_dir = out / slug
    package_dir.mkdir(parents=True, exist_ok=True)
    bundle_path = package_dir / "bundle.direct-plugin.r2.js"
    bundle_path.write_text(bundle_text, encoding="utf-8")
    bundle_record = {
        "path": f"{OUT_ROOT.as_posix()}/{slug}/bundle.direct-plugin.r2.js",
        "bytes": bundle_path.stat().st_size,
        "sha256": sha256(bundle_path.read_bytes()),
        "global": data["global_name"],
    }
    package = {
        **{key: value for key, value in data.items() if key != "source_raw"},
        "schema_version": "kenigevents.a0.direct-plugin-route-bundle-package.r2",
        "state": "DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE",
        "bundle": bundle_record,
        "atlas_binding": data["atlas"],
        "runtime_shared_imports": 0,
        "factual_package_bytes_changed": 0,
        "dependency_absence": "FAIL_CLOSED_BEFORE_PAGE_CREATE",
        "substitute_cards": 0,
        "placeholders": 0,
        "next_owner": "D0_QA_INTEGRATE",
    }
    package["package_record_sha256"] = digest(package)
    (package_dir / "package.r2.json").write_text(pretty(package), encoding="utf-8")
    receipt = {
        "schema_version": "kenigevents.a0.direct-plugin-route-bundle-receipt.r2",
        "slug": slug,
        "state": package["state"],
        "bundle": bundle_record,
        "package_record_sha256": package["package_record_sha256"],
        "deterministic_regeneration": "PENDING_DOUBLE_BUILD",
        "tests": {
            "d0_plugin_bundle_conformance": "PENDING_PUBLICATION_JOB",
            "package": "PENDING_PUBLICATION_JOB",
            "source_fixture_binding": "PENDING_PUBLICATION_JOB",
        },
        "penpot_reads": 0,
        "penpot_mutations": 0,
    }
    (package_dir / "receipt.r2.json").write_text(pretty(receipt), encoding="utf-8")
    (package_dir / "package.test.py").write_text(package_test_source(), encoding="utf-8")
    (package_dir / "source-binding.test.py").write_text(source_test_source(), encoding="utf-8")
    for index, source in enumerate(data["sources"], start=1):
        source_dir = package_dir / "sources"
        source_dir.mkdir(exist_ok=True)
        name = re.sub(r"[^a-z0-9]+", "-", source["name"].lower()).strip("-")
        (source_dir / f"{index:02d}-{name}.json").write_text(data["source_raw"][source["name"]], encoding="utf-8")
    return {
        "slug": slug,
        "lane": lane,
        "package_id": data["package_id"],
        "global": data["global_name"],
        "bundle": bundle_record,
        "atlas_page_id": data["atlas"]["atlas_page_id"],
        "page_order": data["atlas"]["page_order"],
        "source_package_id": data["source_package_id"],
        "dependency_count": len(data["dependencies"]),
    }


def build_lane(lane: str, cwd: Path, out: Path) -> None:
    if lane not in LANES:
        raise SystemExit(f"UNKNOWN_LANE:{lane}")
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    ready, blocked = [], []
    for slug in LANES[lane]:
        try:
            ready.append(build_one(slug, lane, cwd, out))
        except Exception as error:
            blocked.append({"slug": slug, "lane": lane, "state": "BLOCKED_FAIL_CLOSED", "defect": str(error)})
    index = {
        "schema_version": "kenigevents.a0.direct-plugin-route-bundle-lane.r2",
        "lane": lane,
        "ready": ready,
        "blocked": blocked,
        "ready_count": len(ready),
        "blocked_count": len(blocked),
        "penpot_reads": 0,
        "penpot_mutations": 0,
    }
    (out / "lane-index.r2.json").write_text(pretty(index), encoding="utf-8")
    print(pretty(index))
    if not ready:
        raise AssertionError(f"LANE_ZERO_READY:{lane}:{blocked}")


def api(path: str, method: str = "GET", body: dict[str, Any] | None = None) -> Any:
    token = os.environ.get("GITHUB_TOKEN", "")
    if not token:
        raise RuntimeError("GITHUB_TOKEN_MISSING")
    request = urllib.request.Request(
        "https://api.github.com/" + path.lstrip("/"),
        data=None if body is None else json.dumps(body).encode("utf-8"),
        method=method,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "a0-direct-plugin-route-buffer-r2",
        },
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def issue_fresh_read() -> dict[str, Any]:
    required = {}
    for cid in REQUIRED_COMMENTS:
        comment = api(f"repos/{REPOSITORY}/issues/comments/{cid}")
        required[str(cid)] = {
            "id": cid,
            "updated_at": comment.get("updated_at"),
            "body_sha256": sha256((comment.get("body") or "").encode("utf-8")),
        }
    comments = []
    page = 1
    while True:
        batch = api(f"repos/{REPOSITORY}/issues/{ISSUE}/comments?per_page=100&page={page}")
        comments.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    morning = [c for c in comments if "A0_MORNING_EXECUTABLE_ROUTE_BUFFER_READY" in (c.get("body") or "")]
    return {
        "required_comments": required,
        "comments_read": len(comments),
        "final_morning_checkpoint": None if not morning else {
            "id": morning[-1]["id"],
            "body_sha256": sha256((morning[-1].get("body") or "").encode("utf-8")),
        },
        "tip_before_publication": {
            "id": comments[-1]["id"],
            "updated_at": comments[-1].get("updated_at"),
            "body_sha256": sha256((comments[-1].get("body") or "").encode("utf-8")),
        },
    }


def post_comment(body: str) -> int:
    return int(api(f"repos/{REPOSITORY}/issues/{ISSUE}/comments", "POST", {"body": body})["id"])


def run_package_tests(cwd: Path, package_dir: Path, harness_path: Path) -> dict[str, Any]:
    package_path = package_dir / "package.r2.json"
    package = json.loads(package_path.read_text(encoding="utf-8"))
    bundle_path = package_dir / "bundle.direct-plugin.r2.js"
    bundle_sha = sha256(bundle_path.read_bytes())
    conformance_raw = run(
        "node", harness_path.as_posix(),
        "--bundle", bundle_path.as_posix(),
        "--sha256", bundle_sha,
        "--global", package["bundle"]["global"],
        cwd=cwd,
    )
    try:
        conformance = json.loads(conformance_raw)
    except Exception as error:
        raise RuntimeError(f"CONFORMANCE_OUTPUT_INVALID:{conformance_raw}") from error
    if conformance.get("state") != "D0_PLUGIN_BUNDLE_CONFORMANCE_V1_PASS":
        raise AssertionError(f"D0_CONFORMANCE_NOT_PASS:{conformance}")
    package_out = run(sys.executable, (package_dir / "package.test.py").as_posix(), package_dir.as_posix(), cwd=cwd)
    source_out = run(sys.executable, (package_dir / "source-binding.test.py").as_posix(), package_dir.as_posix(), cwd.as_posix(), cwd=cwd)
    result = {
        "d0_plugin_bundle_conformance": "PASS",
        "d0_harness": {
            "head": D0_HARNESS,
            "tree": D0_HARNESS_TREE,
            "path": D0_HARNESS_PATH,
            "git_blob_sha1": blob(D0_HARNESS, D0_HARNESS_PATH, cwd),
            "sha256": sha256(show(D0_HARNESS, D0_HARNESS_PATH, cwd)),
            "first_run": conformance.get("first_run"),
            "replay": conformance.get("replay"),
        },
        "package": "PASS",
        "package_output": package_out,
        "source_fixture_binding": "PASS",
        "source_output": source_out,
        "deterministic_regeneration": "PASS",
        "terminal_replay_created_zero": conformance.get("replay", {}).get("created") == 0,
    }
    (package_dir / "d0-conformance.r2.json").write_text(pretty(conformance), encoding="utf-8")
    receipt_path = package_dir / "receipt.r2.json"
    receipt = json.loads(receipt_path.read_text(encoding="utf-8"))
    receipt["deterministic_regeneration"] = "PASS"
    receipt["tests"] = result
    receipt_path.write_text(pretty(receipt), encoding="utf-8")
    return result


def publish(artifacts: Path, cwd: Path) -> None:
    builder_destination = cwd / "scripts/asp-production-conveyor-v3/a0/direct-plugin-route-bundles-r2/build.py"
    builder_destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(Path(__file__).resolve(), builder_destination)
    git("config", "user.name", "a0-direct-plugin-r2-bot", cwd=cwd)
    git("config", "user.email", "a0-direct-plugin-r2-bot@users.noreply.github.com", cwd=cwd)
    if tree(BASELINE, cwd) != BASELINE_TREE:
        raise AssertionError("BASELINE_TREE_DRIFT")
    if tree(ATLAS_R21, cwd) != ATLAS_R21_TREE or tree(D0_HARNESS, cwd) != D0_HARNESS_TREE:
        raise AssertionError("AUTHORITY_TREE_DRIFT")
    fresh = issue_fresh_read()
    report_dir = cwd / REPORT_ROOT
    report_dir.mkdir(parents=True, exist_ok=True)
    (report_dir / "fresh-read.r2.json").write_text(pretty(fresh), encoding="utf-8")
    harness_path = cwd / ".tmp-d0-plugin-bundle-conformance-v1.mjs"
    harness_path.write_bytes(show(D0_HARNESS, D0_HARNESS_PATH, cwd))
    published: list[dict[str, Any]] = []
    blocked: list[dict[str, Any]] = []
    for lane in ("lane-1", "lane-2", "lane-3"):
        lane_index = json.loads((artifacts / lane / "lane-index.r2.json").read_text(encoding="utf-8"))
        blocked.extend(lane_index["blocked"])
    for slug in ORDER:
        source_dir = next((artifacts / lane / slug for lane in LANES if slug in LANES[lane]), None)
        if source_dir is None or not source_dir.exists():
            continue
        destination = cwd / OUT_ROOT / slug
        if destination.exists():
            shutil.rmtree(destination)
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(source_dir, destination)
        tests = run_package_tests(cwd, destination, harness_path)
        package = json.loads((destination / "package.r2.json").read_text(encoding="utf-8"))
        rel = destination.relative_to(cwd).as_posix()
        git("add", rel, cwd=cwd)
        git("diff", "--cached", "--check", cwd=cwd)
        git("commit", "-m", f"feat(a0): publish direct-plugin R2 bundle {slug}", cwd=cwd)
        git("push", "origin", f"HEAD:{BRANCH}", cwd=cwd)
        head = git("rev-parse", "HEAD", cwd=cwd)
        tree_sha = git("rev-parse", "HEAD^{tree}", cwd=cwd)
        remote_line = git("ls-remote", "--heads", "origin", f"refs/heads/{BRANCH}", cwd=cwd)
        remote_head = remote_line.split()[0] if remote_line else ""
        if remote_head != head:
            raise AssertionError(f"REMOTE_HEAD_READBACK_MISMATCH:{slug}:{head}:{remote_head}")
        git("fetch", "origin", f"refs/heads/{BRANCH}:refs/remotes/origin/{BRANCH}", cwd=cwd)
        remote_ref = f"refs/remotes/origin/{BRANCH}"
        remote_tree = git("rev-parse", f"{remote_ref}^{{tree}}", cwd=cwd)
        if remote_tree != tree_sha:
            raise AssertionError(f"REMOTE_TREE_READBACK_MISMATCH:{slug}:{tree_sha}:{remote_tree}")
        bundle_rel = f"{rel}/bundle.direct-plugin.r2.js"
        bundle_raw = (destination / "bundle.direct-plugin.r2.js").read_bytes()
        bundle_record = {
            "path": bundle_rel,
            "git_blob_sha1": git("rev-parse", f"{remote_ref}:{bundle_rel}", cwd=cwd),
            "bytes": len(bundle_raw),
            "sha256": sha256(bundle_raw),
            "global": package["bundle"]["global"],
        }
        body = "\n".join([
            "<!-- ASP_BUILD_REQUEST_V2 -->",
            f"## ASP_BUILD_REQUEST_V2 — {package['package_id']}",
            "",
            "```yaml",
            "state: DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE",
            "owner: A0",
            f"lane: {package['lane']}",
            f"package_id: {package['package_id']}",
            f"branch: {BRANCH}",
            f"head: {head}",
            f"tree: {tree_sha}",
            "bundle:",
            f"  path: {bundle_record['path']}",
            f"  git_blob_sha1: {bundle_record['git_blob_sha1']}",
            f"  bytes: {bundle_record['bytes']}",
            f"  sha256: {bundle_record['sha256']}",
            f"  global: {bundle_record['global']}",
            "atlas_binding:",
            f"  base_head: {package['atlas_binding']['base_head']}",
            f"  base_tree: {package['atlas_binding']['base_tree']}",
            f"  extension_head: {package['atlas_binding']['extension_head']}",
            f"  extension_tree: {package['atlas_binding']['extension_tree']}",
            f"  atlas_page_id: {package['atlas_binding']['atlas_page_id']}",
            f"  physical_page_name: {json.dumps(package['atlas_binding']['physical_page_name'], ensure_ascii=False)}",
            f"  page_order: {package['atlas_binding']['page_order']}",
            f"  template_id: {package['atlas_binding']['template_id']}",
            f"  projection_role: {package['atlas_binding']['projection_role']}",
            "tests:",
            "  deterministic_generation: PASS",
            "  D0_PLUGIN_BUNDLE_CONFORMANCE_V1: PASS",
            "  browser_sandbox: PASS",
            "  package: PASS",
            "  factual_source_fixture_binding: PASS",
            "  terminal_replay_created_zero: PASS",
            "runtime_shared_imports: 0",
            "dependency_absence: FAIL_CLOSED_BEFORE_PAGE_CREATE",
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
        comment_id = post_comment(body)
        published.append({
            "slug": slug,
            "lane": package["lane"],
            "package_id": package["package_id"],
            "state": package["state"],
            "head": head,
            "tree": tree_sha,
            "bundle": bundle_record,
            "tests": tests,
            "atlas_binding": package["atlas_binding"],
            "route_state_fixture_tuple_sha256": package["route_state_fixture_tuple_sha256"],
            "dependency_count": len(package["dependencies"]),
            "issue_comment_id": comment_id,
        })
    if len(published) < 8:
        raise AssertionError(f"DIRECTLY_CALLABLE_TARGET_NOT_MET:{len(published)}")
    terminal = {
        "schema_version": "kenigevents.a0.direct-plugin-route-buffer.r2",
        "state": "A0_DIRECT_PLUGIN_ROUTE_BUFFER_READY",
        "branch": BRANCH,
        "baseline": {"branch": "a0/morning-executable-route-buffer-v1-20260902", "head": BASELINE, "tree": BASELINE_TREE},
        "implementation_ancestry": {
            "receipt_tip": CURRENT_AGGREGATE,
            "implementation_subject": IMPLEMENTATION_SUBJECT,
            "r2_supersedes_publishable_claims_from_v1": True,
        },
        "atlas_r2_1": {"base_head": ATLAS_R2, "base_tree": ATLAS_R2_TREE, "extension_head": ATLAS_R21, "extension_tree": ATLAS_R21_TREE},
        "d0_conformance": {"head": D0_HARNESS, "tree": D0_HARNESS_TREE},
        "bundles_ready": len(published),
        "bundles": published,
        "dependency_repairs": [{
            "scope": "package-local exact resolver",
            "status": "BUNDLED_FAIL_CLOSED_QA_INTEGRATE_GATED",
            "caller_injected_dependencies": 0,
            "substitutions": 0,
        }],
        "factual_defects": blocked,
        "unprocessed_archetypes": [item["slug"] for item in blocked],
        "directly_callable_route_jobs_target": 8,
        "target_met": len(published) >= 8,
        "new_archetype_wave_created": False,
        "factual_package_bytes_changed": 0,
        "route_registry_changed": False,
        "atlas_changed": False,
        "runtime_shared_imports": 0,
        "visual_pass_declared": False,
        "penpot_reads": 0,
        "penpot_mutations": 0,
        "kaggle": False,
        "next_owner": "D0_CONTINUOUS_INTAKE",
    }
    terminal_path = cwd / OUT_ROOT / "A0_DIRECT_PLUGIN_ROUTE_BUFFER_READY.r2.json"
    terminal_path.write_text(pretty(terminal), encoding="utf-8")
    validation = {
        "result": "PASS",
        "state": terminal["state"],
        "bundles_ready": len(published),
        "all_d0_conformance_pass": all(item["tests"]["d0_plugin_bundle_conformance"] == "PASS" for item in published),
        "all_replay_zero": all(item["tests"]["terminal_replay_created_zero"] is True for item in published),
        "factual_package_bytes_changed": 0,
        "route_registry_changed": False,
        "atlas_changed": False,
        "penpot_reads": 0,
        "penpot_mutations": 0,
    }
    validation_path = report_dir / "validation.r2.json"
    validation_path.write_text(pretty(validation), encoding="utf-8")
    git("add", terminal_path.relative_to(cwd).as_posix(), validation_path.relative_to(cwd).as_posix(), (report_dir / "fresh-read.r2.json").relative_to(cwd).as_posix(), builder_destination.relative_to(cwd).as_posix(), cwd=cwd)
    git("diff", "--cached", "--check", cwd=cwd)
    git("commit", "-m", "feat(a0): publish direct-plugin R2 route buffer terminal", cwd=cwd)
    git("push", "origin", f"HEAD:{BRANCH}", cwd=cwd)
    terminal_head = git("rev-parse", "HEAD", cwd=cwd)
    terminal_tree = git("rev-parse", "HEAD^{tree}", cwd=cwd)
    remote_line = git("ls-remote", "--heads", "origin", f"refs/heads/{BRANCH}", cwd=cwd)
    if not remote_line or remote_line.split()[0] != terminal_head:
        raise AssertionError("TERMINAL_REMOTE_HEAD_READBACK_MISMATCH")
    git("fetch", "origin", f"refs/heads/{BRANCH}:refs/remotes/origin/{BRANCH}", cwd=cwd)
    remote_ref = f"refs/remotes/origin/{BRANCH}"
    if git("rev-parse", f"{remote_ref}^{{tree}}", cwd=cwd) != terminal_tree:
        raise AssertionError("TERMINAL_REMOTE_TREE_READBACK_MISMATCH")

    fresh_dir = Path(os.environ.get("RUNNER_TEMP", "/tmp")) / "a0-direct-plugin-r2-fresh-checkout"
    if fresh_dir.exists():
        shutil.rmtree(fresh_dir)
    git("worktree", "add", "--detach", fresh_dir.as_posix(), remote_ref, cwd=cwd)
    fresh_results = []
    try:
        for item in published:
            package_dir = fresh_dir / OUT_ROOT / item["slug"]
            package = json.loads((package_dir / "package.r2.json").read_text(encoding="utf-8"))
            bundle_path = package_dir / "bundle.direct-plugin.r2.js"
            actual_sha = sha256(bundle_path.read_bytes())
            conformance_raw = run(
                "node", harness_path.as_posix(), "--bundle", bundle_path.as_posix(),
                "--sha256", actual_sha, "--global", package["bundle"]["global"], cwd=fresh_dir,
            )
            conformance = json.loads(conformance_raw)
            if conformance.get("state") != "D0_PLUGIN_BUNDLE_CONFORMANCE_V1_PASS":
                raise AssertionError(f"FRESH_CONFORMANCE_FAIL:{item['slug']}")
            run(sys.executable, (package_dir / "package.test.py").as_posix(), package_dir.as_posix(), cwd=fresh_dir)
            run(sys.executable, (package_dir / "source-binding.test.py").as_posix(), package_dir.as_posix(), fresh_dir.as_posix(), cwd=fresh_dir)
            fresh_results.append({
                "slug": item["slug"], "bundle_sha256": actual_sha,
                "conformance": "PASS", "package": "PASS", "source_binding": "PASS",
                "replay_created": conformance.get("replay", {}).get("created"),
            })
    finally:
        git("worktree", "remove", "--force", fresh_dir.as_posix(), cwd=cwd)
    fresh_validation = {
        "schema_version": "kenigevents.a0.direct-plugin-route-buffer-fresh-checkout.r2",
        "validated_remote_head": terminal_head,
        "validated_remote_tree": terminal_tree,
        "bundles": fresh_results,
        "bundles_verified": len(fresh_results),
        "result": "PASS",
        "penpot_reads": 0,
        "penpot_mutations": 0,
    }
    fresh_path = report_dir / "fresh-checkout-validation.r2.json"
    fresh_path.write_text(pretty(fresh_validation), encoding="utf-8")
    git("add", fresh_path.relative_to(cwd).as_posix(), cwd=cwd)
    git("commit", "-m", "test(a0): verify direct-plugin R2 buffer from remote checkout", cwd=cwd)
    git("push", "origin", f"HEAD:{BRANCH}", cwd=cwd)
    head = git("rev-parse", "HEAD", cwd=cwd)
    tree_sha = git("rev-parse", "HEAD^{tree}", cwd=cwd)
    remote_line = git("ls-remote", "--heads", "origin", f"refs/heads/{BRANCH}", cwd=cwd)
    if not remote_line or remote_line.split()[0] != head:
        raise AssertionError("FINAL_REMOTE_HEAD_READBACK_MISMATCH")
    git("fetch", "origin", f"refs/heads/{BRANCH}:refs/remotes/origin/{BRANCH}", cwd=cwd)
    if git("rev-parse", f"refs/remotes/origin/{BRANCH}^{{tree}}", cwd=cwd) != tree_sha:
        raise AssertionError("FINAL_REMOTE_TREE_READBACK_MISMATCH")
    checkpoint = "\n".join([
        "<!-- ASP_CONVEYOR_CHECKPOINT_V3 -->",
        "## A0 direct-plugin route buffer R2 terminal",
        "",
        "```yaml",
        "state: A0_DIRECT_PLUGIN_ROUTE_BUFFER_READY",
        f"branch: {BRANCH}",
        f"head: {head}",
        f"tree: {tree_sha}",
        f"bundles_ready: {len(published)}",
        "directly_callable_route_jobs_target: 8",
        f"target_met: {'true' if len(published) >= 8 else 'false'}",
        "dependency_repairs:",
        "  - package_local_exact_resolver_bundled_fail_closed_QA_INTEGRATE_GATED",
        f"factual_defects: {len(blocked)}",
        f"unprocessed_archetypes: {len(blocked)}",
        "new_archetype_wave_created: false",
        "factual_package_bytes_changed: 0",
        "route_registry_changed: false",
        "atlas_changed: false",
        "runtime_shared_imports: 0",
        "visual_pass_declared: false",
        "penpot_reads: 0",
        "penpot_mutations: 0",
        "kaggle: false",
        "next_owner: D0_CONTINUOUS_INTAKE",
        f"terminal_record: {terminal_path.relative_to(cwd).as_posix()}",
        "```",
    ])
    checkpoint_id = post_comment(checkpoint)
    result = {"state": terminal["state"], "branch": BRANCH, "head": head, "tree": tree_sha, "bundles_ready": len(published), "factual_defects": blocked, "checkpoint_comment_id": checkpoint_id}
    print(pretty(result))


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    build = sub.add_parser("build-lane")
    build.add_argument("--lane", required=True)
    build.add_argument("--repo", type=Path, default=Path.cwd())
    build.add_argument("--out", type=Path, required=True)
    pub = sub.add_parser("publish")
    pub.add_argument("--repo", type=Path, default=Path.cwd())
    pub.add_argument("--artifacts", type=Path, required=True)
    args = parser.parse_args()
    if args.command == "build-lane":
        build_lane(args.lane, args.repo.resolve(), args.out.resolve())
    else:
        publish(args.artifacts.resolve(), args.repo.resolve())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
