#!/usr/bin/env python3
"""Verified loader for compact immutable F0 small-page package bundles."""
from __future__ import annotations
import argparse, base64, hashlib, importlib.util, json, zlib
from pathlib import Path

class BundleError(RuntimeError): pass

def _req(ok, msg):
    if not ok: raise BundleError(msg)
def _sha(b): return hashlib.sha256(b).hexdigest()
def _blob(b): return hashlib.sha1(f"blob {len(b)}\0".encode("ascii")+b).hexdigest()
def _load_module(path:Path, name:str):
    spec=importlib.util.spec_from_file_location(name,path)
    _req(spec is not None and spec.loader is not None,f"cannot load {path}")
    module=importlib.util.module_from_spec(spec); spec.loader.exec_module(module); return module

def load_bundle(pointer_path:Path):
    pointer=json.loads(pointer_path.read_text(encoding="utf-8"))
    _req(pointer.get("schema_version")=="kenigevents.asp-package-bundle.v1","wrong pointer schema")
    _req(pointer.get("marker")=="ASP_PACKAGE_INTEGRATION_CANDIDATE_V3","wrong marker")
    spec=pointer["spec_bundle"]; root=pointer_path.resolve().parents[3]
    spec_path=root/spec["path"]; encoded=spec_path.read_bytes()
    _req(len(encoded)==spec["bytes"],"spec bundle byte drift")
    _req(_sha(encoded)==spec["sha256"],"spec bundle sha256 drift")
    _req(_blob(encoded)==spec["git_blob_sha1"],"spec bundle Git blob drift")
    compressed=base64.b64decode(encoded,validate=True)
    _req(len(compressed)==spec["compressed_bytes"],"compressed byte drift")
    _req(_sha(compressed)==spec["compressed_sha256"],"compressed sha drift")
    raw=zlib.decompress(compressed)
    _req(len(raw)==spec["manifest_bytes"],"manifest byte drift")
    _req(_sha(raw)==spec["manifest_sha256"],"manifest sha drift")
    manifest=json.loads(raw.decode("utf-8"))
    _req(manifest["package_id"]==pointer["package_id"],"package mismatch")
    _req(manifest["revision"]==pointer["revision"],"revision mismatch")
    _req(manifest["target"]==pointer["target"],"target mismatch")
    _req(manifest["expected"]==pointer["expected"],"expected census mismatch")
    return pointer,manifest

def runtime_for(pointer_path:Path):
    pointer,manifest=load_bundle(pointer_path); root=pointer_path.resolve().parents[3]
    runtime=_load_module(root/pointer["runtime"]["helper_path"],"f0_runtime")
    runtime.validate_manifest(manifest)
    return pointer,manifest,runtime

def cli(pointer_path:Path):
    pointer,manifest,runtime=runtime_for(pointer_path)
    parser=argparse.ArgumentParser(); sub=parser.add_subparsers(dest="command",required=True)
    for name in ("plan","execute"):
        p=sub.add_parser(name); p.add_argument("--source-root",action="append",default=[]); p.add_argument("--external-source",action="append",default=[]); p.add_argument("--output",required=True)
        if name=="execute": p.add_argument("--adapter",required=True)
    p=sub.add_parser("verify"); p.add_argument("--receipt",required=True)
    args=parser.parse_args()
    if args.command=="verify":
        runtime.verify_receipt(manifest,runtime.load_json(Path(args.receipt))); print("F0_SMALL_PAGE_BUNDLE_VERIFY_PASS"); return 0
    roots=runtime._parse_assignments(args.source_root,"--source-root"); external=runtime._parse_assignments(args.external_source,"--external-source")
    if args.command=="plan":
        sources=runtime.verify_sources(manifest,roots,external); value={**runtime.build_plan(manifest),"source_receipts":sources}
        Path(args.output).write_text(json.dumps(value,ensure_ascii=False,indent=2,sort_keys=True)+"\n",encoding="utf-8")
        print("F0_SMALL_PAGE_BUNDLE_PLAN_PASS"); return 0
    adapter=runtime._load_adapter(args.adapter); receipt=runtime.execute(manifest,adapter,roots,external)
    Path(args.output).write_text(json.dumps(receipt,ensure_ascii=False,indent=2,sort_keys=True)+"\n",encoding="utf-8")
    print("F0_SMALL_PAGE_BUNDLE_EXECUTE_PASS"); return 0
