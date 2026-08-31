#!/usr/bin/env python3
"""Validate and compile the U0 controls/primitives package. Penpot-free."""

from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path
from typing import Any

DEFAULT = "catalog/asp-production-conveyor-v3/u0/U-CONTROLS-PRIMITIVES.package.v1.json"
SOURCE_COMMIT = "f2d658e8be057f3b75431f6b77e4887af4536028"
SOURCE_TREE = "a274f07297d46cc105f4cea7841a4b8563e2f72c"
REQ_SHA = "54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72"
REG_PATH = "contracts/assets/ui-asset-registry.v1.yaml"
REG_BLOB = "271a622633f399bb52cfe322c259a8dc4162bf7e"
REG_SHA = "bbb07cc7d218d4ff69cc21ee002652b21c9e6c4efdbf65a23b9805f97eb7efb4"

SOURCE_FILES = [
 ["styles","site/src/styles/design-system.css","4d54d3c59f8f1a4e844953edf8d9c86078ccb8c1",87733],
 ["button","site/src/components/design-system/Button.astro","26c04968463fe826f699bfc0bc848c96adeebcf3",1613],
 ["badge","site/src/components/design-system/Badge.astro","b9c9d845fdad793631ee1b93af33c9d998605427",335],
 ["field","site/src/components/design-system/Field.astro","d4f29e1b83791355b16e3f2e44bd81cd655439dd",975],
 ["state-panel","site/src/components/design-system/StatePanel.astro","57cf167e72a14554cc99702d088a4df580e9c388",771],
 ["event-actions","site/src/components/EventCard.astro","e7b299660572dda731ca15bd5052b3bf5714cd7c",15799],
 ["gallery","site/src/pages/lab/design-system/index.astro","257c0e9c76597f1d6502f5effb15d478698bf9b8",63233],
]
ASSETS = {
 "icon.action.not_interested":["catalog/asp-production-conveyor-v3/f0/assets/free-collection/not-interested.svg","2cd0ebf989d63176a8e5f240c681316fab2e0670","2716788d41848f0332bf0cd7f4f16c2b9f58b2dd73a05345eae7ae788d2ade98",912,"0 0 512 512"],
 "icon.action.calendar_add":["catalog/asp-production-conveyor-v3/f0/assets/free-collection/calendar-add.svg","539baa5a7ab4f8794c2af3dae63a732cb00d1408","0089a7c95e9366540feca517c143b6f70b994d2077272f6a064e40c7d5131ae7",374,"0 0 32 32"],
 "icon.action.share":["catalog/asp-production-conveyor-v3/f0/assets/free-collection/share.svg","3b6a82536becf79040c1201b327c93123080b557","c8fe389bb046818566e92900418ca74cb986369e9539c3a561878250fde819cb",719,"0 0 24 24"],
 "icon.action.favorite.outline":["catalog/asp-production-conveyor-v3/f0/assets/free-collection/favorite-outline.svg","e7b836f1f102ab787364077f1cc84fb2863b87ca","8f94e7f1e1e8abdf27cb207b300699ef1dff5090c34fafd7331326ae11214df7",459,"0 0 24 24"],
 "icon.action.favorite.solid":["catalog/asp-production-conveyor-v3/f0/assets/free-collection/favorite-solid.svg","bcf4370e13e32ef35f7b43b1964bc06a2ae86dd3","ede237bb37e7aed328f663364b6c2b0952f1483e19e764994e86cf18de211517",275,"0 0 24 24"],
}
FAMILY_COUNTS = {
 "control.button":14, "status.badge":6, "control.field":7,
 "feedback.state-panel":6, "control.event-feedback-action":5,
}
BUTTON_VARIANTS={"primary","secondary","quiet","inverse","danger"}
BUTTON_SIZES={"compact","default","large"}
BUTTON_STATES={"default","hover","focus","pressed","loading","disabled"}
BADGE_TONES={"neutral","brand","accent","success","warning","danger"}
FIELD_TYPES={"text","search","email"}
FIELD_STATES={"default","hover","focus","error","disabled"}
PANEL_TONES={"neutral","info","success","warning","danger","loading"}
EVENT_ACTIONS={"not_interested","calendar_add","share","favorite"}

class ContractError(AssertionError): pass
def need(ok: bool, msg: str) -> None:
    if not ok: raise ContractError(msg)
def canonical(v: Any) -> bytes:
    return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()
def sha(data: bytes) -> str: return hashlib.sha256(data).hexdigest()
def blob(data: bytes) -> str:
    return hashlib.sha1(f"blob {len(data)}\0".encode()+data).hexdigest()

def load(path: Path) -> dict[str,Any]:
    try: value=json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc: raise ContractError(f"cannot load {path}: {exc}") from exc
    need(isinstance(value,dict),"manifest root must be object")
    return value

def validate(m: dict[str,Any]) -> None:
    need(m.get("schema_version")=="kenigevents.asp-u0-controls-primitives-package.v1","schema")
    need(m.get("package_id")=="U-CONTROLS-PRIMITIVES","package")
    need(m.get("owner")=="U0","owner")
    need(m.get("status")=="READY_FOR_D0_INTEGRATE","status")
    life=m["lifecycle"]
    need(life.get("ready_for_d0_integrate") is True,"integration readiness")
    need(life.get("ready_to_publish") is False,"U0 self-approval")
    need(life.get("penpot_mutations_by_u0")==0,"U0 Penpot mutation")
    need(life.get("sole_penpot_writer")=="/root/publish_r2","sole writer")

    src=m["source"]
    need(src.get("mode")=="ASTRO_AS_IS_REFERENCE","authority mode")
    need(src.get("repository")=="onedayonemasterpiece/events-bot-new","source repo")
    need(src.get("commit")==SOURCE_COMMIT and src.get("tree")==SOURCE_TREE,"source tuple")
    need(src.get("files")==SOURCE_FILES,"source file lock")
    need(m["requirements"].get("sha256")==REQ_SHA,"requirements")

    t=m["tokens"]
    need(t.get("interactive_min_px",0)>=44,"interactive target")
    need(t.get("field_min_height_px",0)>=48,"field height")
    need(t.get("large_button_min_height_px",0)>=52,"large button")
    need(t.get("focus_ring_px",0)>=3 and t.get("focus_offset_px",0)>=3,"focus")
    need(t.get("duration_fast_ms")==160 and t.get("duration_base_ms")==220,"durations")
    need(t.get("reduced_motion_spinner_ms")==1400,"reduced motion")

    terms=m["terminology"]
    need(terms.get("pill")=="geometry_only" and terms.get("capsule")=="geometry_only","geometry terms")
    need(terms.get("badge")=="read_only_status_or_category","badge term")
    need(terms.get("chip")=="compact_filter_selection_suggestion_or_input_only","chip term")
    need(terms.get("generic_chip") is False,"generic chip")

    fam=m["families"]
    need(set(fam)==set(FAMILY_COUNTS),"families")
    b=fam["control.button"]
    need(set(b["variants"])==BUTTON_VARIANTS,"button variants")
    need(set(b["sizes"])==BUTTON_SIZES,"button sizes")
    need(set(b["states"])==BUTTON_STATES,"button states")
    need(set(b["render_modes"])=={"button","link"},"button modes")
    need(set(b["core_excludes"])=={"icon-only","link-specimen"},"button exclusions")
    need({"min44","focus-visible","aria-busy","aria-pressed"}.issubset(b["a11y"]),"button a11y")
    badge=m["families"]["status.badge"]
    need(set(badge["tones"])==BADGE_TONES,"badge tones")
    need(badge.get("interactive") is False and badge.get("chip_alias") is False,"badge classification")
    f=fam["control.field"]
    need(set(f["types"])==FIELD_TYPES and set(f["states"])==FIELD_STATES,"field contract")
    need({"label-binding","aria-invalid-on-error","aria-describedby","min48"}.issubset(f["a11y"]),"field a11y")
    p=fam["feedback.state-panel"]
    need(set(p["tones"])==PANEL_TONES,"panel tones")
    need(p["a11y"]=={"danger_live":"assertive","loading_live":"polite","loading_busy":True},"panel a11y")
    need(p.get("mark")=="source_text_not_icon_substitution","panel mark")
    a=fam["control.event-feedback-action"]
    need(set(a["actions"])==EVENT_ACTIONS,"event actions")
    need(a.get("asset_fallback") is False,"event asset fallback")
    need(a.get("favorite")=="aria-pressed=false:outline;aria-pressed=true:solid","favorite binding")
    need(a.get("calendar")=="conditional","calendar semantics")

    reg=m["asset_registry"]
    need(reg.get("path")==REG_PATH and reg.get("git_blob_sha1")==REG_BLOB,"registry identity")
    need(reg.get("sha256")==REG_SHA and reg.get("status")=="ACTIVE","registry state")
    need(reg.get("assets")==ASSETS and reg.get("fallback") is False,"assets")
    deferred=m["deferred_asset_wave"]
    need(set(deferred.get("families",[]))=={"control.copy-action","control.button.icon-only"},"deferred families")
    need({x[0] for x in deferred.get("required",[])}=={"icon.action.copy","icon.status.check"},"deferred assets")
    need(deferred.get("owner")=="F0" and deferred.get("fallback") is False,"deferred gate")

    specs=m["specimens"]
    need(set(specs)==set(FAMILY_COUNTS),"specimen families")
    need({k:len(v) for k,v in specs.items()}==FAMILY_COUNTS,"specimen counts")
    ids=[]
    for row in specs["control.button"]:
        need(len(row)==5 and row[1] in BUTTON_VARIANTS and row[2] in BUTTON_SIZES and row[3] in BUTTON_STATES,"button specimen")
        need(row[4] in (None,False,True),"button pressed")
        ids.append(row[0])
    for row in specs["status.badge"]:
        need(len(row)==2 and row[1] in BADGE_TONES,"badge specimen"); ids.append(row[0])
    for row in specs["control.field"]:
        need(len(row)==4 and row[1] in FIELD_TYPES and row[2] in FIELD_STATES,"field specimen")
        need(row[3] is (row[2]=="error"),"field error"); ids.append(row[0])
    for row in specs["feedback.state-panel"]:
        need(len(row)==2 and row[1] in PANEL_TONES,"panel specimen"); ids.append(row[0])
    for row in specs["control.event-feedback-action"]:
        need(len(row)==4 and row[1] in EVENT_ACTIONS and row[2] in ASSETS,"action specimen")
        if row[1]=="calendar_add": need(row[2]=="icon.action.calendar_add","calendar asset")
        ids.append(row[0])
    need(len(ids)==38 and len(set(ids))==38,"specimen identities")
    need(m["counts"]=={"families":5,"specimens":38,"button":14,"badge":6,"field":7,"state_panel":6,"event_action":5},"declared counts")

    target=m["target_page"]
    need(target.get("exact_page_id") is None,"invented page id")
    need(target.get("resolve_by")=="D0/INTEGRATE" and target.get("active_profile_required") is True,"page gate")
    need(target.get("one_root") is True and target.get("screenshots")==0 and target.get("old_penpot_uuids")==0,"page safety")
    mat=m["materialization"]
    need(mat.get("consumer")=="D0/MAT" and mat.get("penpot_adapter_included") is False,"materialization boundary")

def verify_repo(repo: Path, m: dict[str,Any]) -> None:
    rp=repo/REG_PATH
    need(rp.is_file(),"registry missing")
    data=rp.read_bytes()
    need(blob(data)==REG_BLOB and sha(data)==REG_SHA,"registry bytes")
    for aid,(path,gblob,digest,size,_viewbox) in ASSETS.items():
        p=repo/path; need(p.is_file(),f"{aid}: missing")
        data=p.read_bytes()
        need(len(data)==size and blob(data)==gblob and sha(data)==digest,f"{aid}: bytes")

def compile_input(m: dict[str,Any]) -> dict[str,Any]:
    validate(m)
    payload={
      "schema_version":"kenigevents.u0-controls-primitives-mat-input.v1",
      "package_id":m["package_id"],"owner":"U0","consumer":"D0/MAT",
      "source":m["source"],"requirements":m["requirements"],"tokens":m["tokens"],
      "terminology":m["terminology"],"families":m["families"],
      "asset_registry":m["asset_registry"],"specimens":m["specimens"],
      "target_page":m["target_page"],
      "gates":{
        "d0_integrate":"REQUIRED","active_page_profile":"REQUIRED",
        "d0_mat_adapter":"REQUIRED","active_run_marker":"REQUIRED",
        "native_readback":"REQUIRED","v0_visual_verdict":"REQUIRED"
      },
      "run_control":{"sole_writer":"/root/publish_r2","recheck_after_every_await":True,"post_cancel_product_writes":0}
    }
    return {"integrity":{"canonicalization":"sorted compact UTF-8 JSON","payload_sha256":sha(canonical(payload))},**payload}

def output(v: dict[str,Any]) -> bytes:
    return (json.dumps(v,ensure_ascii=False,sort_keys=True,indent=2)+"\n").encode()

def main() -> int:
    ap=argparse.ArgumentParser()
    ap.add_argument("--repo",default=None); ap.add_argument("--manifest",default=DEFAULT)
    ap.add_argument("--check-repository-inputs",action="store_true")
    ap.add_argument("--emit",default="-"); ap.add_argument("--check-output",default=None)
    ns=ap.parse_args()
    repo=Path(ns.repo).resolve() if ns.repo else Path(__file__).resolve().parents[3]
    m=load(repo/ns.manifest); validate(m)
    if ns.check_repository_inputs: verify_repo(repo,m)
    data=output(compile_input(m))
    if ns.check_output:
        p=repo/ns.check_output; need(p.is_file() and p.read_bytes()==data,"stale compiled output")
    if ns.emit=="-": sys.stdout.buffer.write(data)
    else:
        p=repo/ns.emit; p.parent.mkdir(parents=True,exist_ok=True); p.write_bytes(data)
    print("U0_CONTROLS_PRIMITIVES_CONTRACT_PASS",file=sys.stderr)
    return 0

if __name__=="__main__":
    try: raise SystemExit(main())
    except ContractError as exc:
        print(f"U0_CONTROLS_PRIMITIVES_CONTRACT_FAIL: {exc}",file=sys.stderr)
        raise SystemExit(1)
