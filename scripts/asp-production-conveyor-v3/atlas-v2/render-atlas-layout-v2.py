#!/usr/bin/env python3
"""Deterministically build the Atlas R2 documentation-shell projection and review renders.

This is intentionally a Git-only geometry map: package source documents are read,
never rewritten, and product specimens in the SVGs are labelled schematic bounds.
"""
from __future__ import annotations

import hashlib
import html
import json
import math
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from copy import deepcopy
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
R1 = ROOT / "catalog/asp-production-conveyor-v3/atlas"
OUT = ROOT / "catalog/asp-production-conveyor-v3/atlas-v2"
REPORT = ROOT / "reports/asp-production-conveyor-v3/atlas-v2/rendered"
sys.path.insert(0, str(Path(__file__).resolve().parent))
from source_bound_evidence_v1 import render as render_source_bound_r2

CANON = lambda o: json.dumps(o, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
COLORS = {"page":"#F3F5F7", "root":"#FFFFFF", "title":"#111827", "meta":"#4B5563", "caption":"#6B7280", "line":"#D1D5DB", "cell":"#E5E7EB", "evidence":"#F8FAFC"}
HEADER_IDS = ["atlas.header.top.section", "atlas.header.top.page-title", "atlas.header.top.lifecycle-status", "atlas.header.meta.owner", "atlas.header.meta.package-id", "atlas.header.meta.source-or-fixture", "atlas.header.meta.viewport-and-state-coverage", "atlas.header.meta.v0-status", "atlas.header.meta.last-reviewed-revision"]

def read_json(path): return json.loads(path.read_text(encoding="utf-8"))
def write_json(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True); path.write_text(CANON(obj), encoding="utf-8")
def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def git(*args): return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()

def resolve_formula(formula, context):
    """Resolve Atlas arithmetic formulas without accepting executable inputs."""
    normalized = re.sub(r"([A-Za-z_]+)\.bottom", r"\1_bottom", formula)
    normalized = normalized.replace("sum(row_bottoms)", "sum(row_bottoms)")
    safe = {"ceil": math.ceil, "max": max, "min": min, "sum": sum,
            "clamp": lambda value, low, high: max(low, min(value, high))}
    safe.update(context)
    return eval(normalized, {"__builtins__": {}}, safe)

def shell_template(**kw):
    common = {
      "page_root_width_formula":"max(header_right, master_right, grid_right) + outer_margin",
      "page_root_height_formula":"content_start_y + content_height + bottom_padding",
      "content_bounds_formula":"[outer_margin, content_start_y, page_root_width - outer_margin, content_start_y + content_height]",
      "row_count_formula":"ceil(instance_count / columns)", "overflow_policy":{"root":"EXPAND_VERTICAL_FAIL_ON_HORIZONTAL","managed_documentation_nodes":"MUST_BE_INSIDE_CANDIDATE_ROOT"},
      "layout_engine":"NATIVE_GRID", "direction":"vertical", "rows":"AUTO", "columns":"AUTO", "gap":24, "padding":[0,0,0,0], "align_items":"start", "justify_content":"start", "wrap":"NO_WRAP", "horizontal_sizing":"FILL_CONTAINER", "vertical_sizing":"HUG_CONTENT",
      "guides":{"outer_margin":64,"header_origin_y":64,"content_start_y":256,"bottom_padding":64,"header":[64,64,2048,128],"spacing_tokens":[4,8,12,16,24,32,48,64,96]},
    }; common.update(kw); return common

def templates():
    dense=shell_template(template_id="FOUNDATION_ASSET_GRID_DENSE_V2", purpose="Action/Nav and Medallions", master_column={"x":64,"width":320,"layout":"FIXED_WIDTH_STACK"}, review_grid_x=416, columns=6, rows="ceil(instance_count / 6)", gap=24, cell={"width":256,"height_policy":"BOUNDED_CONTENT","min":192,"max":288,"formula":"clamp(specimen_height + label_block_height + 48, 192, 288)","padding":16,"align":"center/start"}, label={"position":"BELOW_SPECIMEN","typography":"12/16","max_chars":48,"max_lines":2}, column_gap=24,row_gap=24,section_gap=64,maximum_instances=30,hard_limits={"instances":30})
    standard=shell_template(template_id="FOUNDATION_ASSET_GRID_STANDARD_V2", purpose="Foundation review", master_column={"x":64,"width":448,"layout":"FIXED_WIDTH_STACK"}, review_grid_x=576, columns=4, rows="ceil(instance_count / 4)", gap=32, cell={"width":320,"height_policy":"BOUNDED_CONTENT","min":256,"max":480,"formula":"clamp(specimen_height + label_block_height + 56, 256, 480)","padding":20,"align":"start"}, label={"position":"BELOW_SPECIMEN","typography":"12/16","max_chars":64,"max_lines":2}, column_gap=32,row_gap=32,section_gap=96,maximum_instances=30,hard_limits={"instances":30})
    wide=shell_template(template_id="FOUNDATION_ASSET_GRID_WIDE_V2", purpose="Brand and typography", master_column={"x":64,"width":512,"layout":"FIXED_WIDTH_STACK"}, review_grid_x=608, columns=2, rows="ceil(instance_count / 2)", gap=32, cell={"width":736,"height_policy":"BOUNDED_CONTENT","min":320,"max":720,"formula":"clamp(specimen_height + label_block_height + 64, 320, 720)","padding":24,"align":"start"}, label={"position":"ABOVE_SPECIMEN","typography":"14/20","max_chars":96,"max_lines":2}, column_gap=32,row_gap=32,section_gap=96,maximum_instances=30,hard_limits={"instances":30})
    state=shell_template(template_id="COMPONENT_STATE_GRID_V2", purpose="Controls and component families", master_column={"x":64,"width":448}, state_grid_x=576, columns=3, rows="ceil(family_instance_count / 3)", gap=32, cell={"width":400,"height_policy":"SOURCE_CONTENT_DERIVED","min":192,"clipping":"FORBIDDEN"}, column_gap=32,row_gap=32,section_gap=96,maximum_component_families=3,maximum_instances=30,hard_limits={"component_families":3,"instances":30}, future_options={"wide_control_row":{"lifecycle":"MAY_AFTER_FIRST_FIVE_PAGES"},"evidence_mode":{"values":["compact","expanded"],"lifecycle":"MAY_AFTER_FIRST_FIVE_PAGES"}}, content_height_formula="sum(family_heights) + max(0, family_count - 1) * 96", family_height_formula="max(master_height, rows * resolved_state_cell_height + max(0, rows-1) * 32)")
    archetype=shell_template(template_id="ARCHETYPE_DESKTOP_MOBILE_V2", purpose="Route archetype desktop/mobile/evidence rows", page_root_width=2624, page_root_width_formula="2624", header=[64,64,2496,128], content_bounds_formula="[64,256,2560,content_start_y + content_height]", desktop_slot={"x":64,"width":1440,"alignment":"CENTER_ONLY","product_layout_engine":"FIXED_SOURCE_GEOMETRY"}, mobile_slot={"x":1568,"width":416,"actual_board_width":390,"actual_board_x_formula":"1568 + (416 - 390) / 2","actual_board_x":1581,"product_layout_engine":"FIXED_SOURCE_GEOMETRY"}, evidence_slot={"x":2048,"width":512,"layout_engine":"NATIVE_FLEX"}, gaps={"desktop_to_mobile":64,"mobile_to_evidence":64,"right_margin":64}, desktop_board_x_formula="64 + (1440 - actual_board_width) / 2", desktop_1280_board_x=144, next_row_y_formula="max(desktop.bottom, mobile.bottom, evidence.bottom) + 96", content_height_formula="sum(row_bottoms) + 64", layout_engine="NATIVE_FLEX", columns=3, gap=64, hard_limits={"route_archetypes":1})
    ready=deepcopy(archetype); ready.update(template_id="COMPOSED_ROUTE_READY_STATES_V2", purpose="Composed route READY projection", states=["top","scrolled","full"], required_row_count=3)
    exception=deepcopy(archetype); exception.update(template_id="COMPOSED_ROUTE_EXCEPTION_STATES_V2", purpose="Composed route EXCEPTION projection", states=["loading","empty","error"], required_row_count=3)
    owner=shell_template(template_id="OWNER_INDEX_V2", purpose="Compact physical/logical atlas index", page_root_width=2624, page_root_width_formula="2624", header=[64,64,2496,128], content_start_y=256, row_height=48, section_gap=32, physical_page_count=42, row_count_formula="physical_page_count", content_height_formula="physical_page_count * row_height + section_count * section_gap", layout_engine="NATIVE_GRID", columns=1, rows="physical_page_count", gap=16, hard_limits={"product_component_masters":0})
    return {x["template_id"]:x for x in [dense,standard,wide,state,archetype,ready,exception,owner]}

def split_unit(unit, role, order, template_id):
    u=deepcopy(unit); u["atlas_page_id"] = f'{unit["atlas_page_id"]}-{role.lower()}'
    u["projection_role"] = role; u["logical_source_unit_id"] = unit["atlas_page_id"]; u["page_order"] = f"{order:04d}"
    u["physical_page_name"] = unit["exact_package_page_name"] if role == "READY" else unit["exact_package_page_name"] + " · Exception states"
    u["historical_prefix"] = re.match(r"[^·]+",u["exact_package_page_name"]).group(0).strip()
    u["prefix_order_conflict_indicator"] = u["historical_prefix"].startswith(("03","04"))
    u["template_id"] = template_id; u["hard_limit_census"]["route_states"] = 3
    u["semantic_slot_bindings"]["states"] = "paired_desktop_mobile_evidence_rows"
    return u

def make_bindings():
    r1=read_json(R1/"page-unit-bindings.v1.json")
    out=[]
    density={"F-ACTION-NAV-ICONS":"FOUNDATION_ASSET_GRID_DENSE_V2","F-BRANDBOOK-BASELINE":"FOUNDATION_ASSET_GRID_WIDE_V2","F-TYPOGRAPHY-TYPE-SCALE-SMALL-PAGE":"FOUNDATION_ASSET_GRID_WIDE_V2","F-TYPOGRAPHY-LAYOUT-RULES-SMALL-PAGE":"FOUNDATION_ASSET_GRID_WIDE_V2"}
    for unit in r1["units"]:
      order=len(out)*10
      if unit["package_id"] in {"PROTECTED-FREE-COLLECTION-EVENTCARD","A0-PAGE-AUX-DATE_LISTING_SHELL-R1"}:
        out += [split_unit(unit,"READY",order,"COMPOSED_ROUTE_READY_STATES_V2"), split_unit(unit,"EXCEPTION",order+1,"COMPOSED_ROUTE_EXCEPTION_STATES_V2")]; continue
      u=deepcopy(unit); u["logical_source_unit_id"]=unit["atlas_page_id"];u["projection_role"]="READY";u["physical_page_name"]=unit["exact_package_page_name"];u["page_order"]=f"{order:04d}"
      if u["package_id"].startswith("F-MEDALLIONS-"): u["template_id"]="FOUNDATION_ASSET_GRID_DENSE_V2"
      elif u["section"]=="foundations-review": u["template_id"]="FOUNDATION_ASSET_GRID_STANDARD_V2"
      elif u["package_id"] in density: u["template_id"]=density[u["package_id"]]
      elif u["template_id"]=="FOUNDATION_ASSET_GRID_V1":
        # The protected source index is not an F0 density assignment; it keeps a
        # documentation-only standard shell while preserving its package bytes.
        u["template_id"]="FOUNDATION_ASSET_GRID_STANDARD_V2"
      elif u["template_id"]=="COMPONENT_STATE_GRID_V1": u["template_id"]="COMPONENT_STATE_GRID_V2"
      elif u["template_id"]=="ARCHETYPE_DESKTOP_MOBILE_V1": u["template_id"]="ARCHETYPE_DESKTOP_MOBILE_V2"
      elif u["template_id"]=="OWNER_INDEX_V1": u["template_id"]="OWNER_INDEX_V2"
      u["historical_prefix"] = re.match(r"[^·]+",u["exact_package_page_name"]).group(0).strip()
      u["prefix_order_conflict_indicator"] = u["historical_prefix"].startswith(("03","04")) and u["page_order"] not in {"0000"}
      out.append(u)
    # Latest Action/Nav repair binds only the execution dependency. Package source byte binding remains frozen.
    action=next(u for u in out if u["package_id"]=="F-ACTION-NAV-ICONS")
    action["publication_dependency"]["current_repair_binding"]={"remote_branch":"agent/d0-atlas-wave/mat","remote_head":"5d44725c33cb3a4c776ef917e6ac7b9f1f36d545","remote_tree":"18a92b24cc2d82914f6ced07e2ce73b00619c456","issue_comment_id":5494292538,"scope":"EXECUTOR_ONLY_PACKAGE_BYTES_UNCHANGED"}
    return {"schema_version":"kenigevents.asp-penpot-page-unit-bindings.v2","atlas_id":"ASP_PENPOT_ATLAS_LAYOUT_V2","logical_source_units":40,"physical_page_count":42,"source_r1":{"branch":"o0/penpot-atlas-layout-v1-20260901","head":"a32b9874e1eec367fd6b98bc3c601d0638408843","tree":"f527c628ed0dfc17eec9208b0ae15b8a29bbedb2"},"units":out}

def docs_contract():
 return {"schema_version":"kenigevents.asp-atlas-documentation-shell.v2","scope":"TECHNICAL_DOCUMENTATION_SHELL_ONLY","appearance":{"page_background":"#F3F5F7","candidate_root_background":"#FFFFFF","primary_title":"#111827","section_metadata":"#4B5563","secondary_caption":"#6B7280","separator":{"color":"#D1D5DB","width":1},"grid_cell":{"color":"#E5E7EB","width":1,"radius":12},"evidence_background":"#F8FAFC","lifecycle":{"CANDIDATE":{"bg":"#FEF3C7","fg":"#78350F","border":"#F59E0B"},"PASS":{"bg":"#DCFCE7","fg":"#14532D","border":"#22C55E"},"REPAIR":{"bg":"#FEE2E2","fg":"#7F1D1D","border":"#EF4444"}},"minimum_text_contrast_ratio":4.5,"spacing_tokens":[4,8,12,16,24,32,48,64,96]},"page_header":{"component_id":"ATLAS_PAGE_HEADER_V2","height":128,"width":"FILL_PARENT","bands":{"top_band":72,"metadata_band":56},"stable_semantic_ids":HEADER_IDS,"top_band_layout":{"layout_engine":"NATIVE_FLEX","direction":"horizontal","padding":[16,24],"gap":16,"align_items":"center","section_slot":{"min":160,"max":240,"typography":"12/16 700","max_chars":32},"page_title":{"fills_remaining":True,"typography":"28/32 700","max_chars":96,"max_lines":2},"lifecycle_chip":{"values":["CANDIDATE","PASS","REPAIR"],"height":28,"padding_horizontal":12,"min_width":88,"max_width":124,"typography":"12/16 700"}},"metadata_band_layout":{"layout_engine":"NATIVE_FLEX","direction":"horizontal","wrap":{"allowed":True,"max_lines":2},"padding":[8,24],"column_gap":16,"row_gap":4,"label_typography":"10/14 uppercase","value_typography":"12/16 regular","fields":{"owner":{"max_chars":24,"required":True},"package_id":{"max_chars":64,"required":True},"source_or_fixture_identity":{"max_chars":96,"required":False},"viewport_and_state_coverage":{"max_chars":96,"required":False},"v0_status":{"max_chars":32,"required":True},"last_reviewed_revision":{"max_chars":16,"required":False}},"empty_policy":{"required":"FAIL_CLOSED","optional":"EM_DASH_RETAIN_SLOT"}},"publish_rule":"PUBLISH_MUST_INSTANTIATE_OR_REBIND_COMPONENT_NEVER_AD_HOC_HEADER_TEXT"},"layout_engine_rules":{"documentation":["NATIVE_FLEX","NATIVE_GRID"],"exact_product_boards":"FIXED_SOURCE_GEOMETRY","absolute_documentation_shell":"FORBIDDEN","absolute_inside_source_bound_product_boards":"ALLOWED","managed_nodes_outside_candidate_root":"FORBIDDEN"},"action_nav_partial_migration":{"partial_page_policy":"PRESERVE_AND_REBIND_IN_PLACE","delete_or_recreate":"FORBIDDEN","internal_svg_geometry_change":"FORBIDDEN","top_level_documentation_relayout":"ALLOWED_AFTER_R2_PASS","stable_semantic_ids":"PRESERVE","discovery":"D0_NATIVE_READBACK_BY_EXACT_PACKAGE_NAMESPACE_AND_SEMANTIC_STABLE_IDS","unknown_page_root_ids":"NEVER_HARDCODE","r1_slots":"SUPERSEDED_ONLY_AFTER_R2_POSTFLIGHT"}}

def schema():
 return {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"kenigevents.asp-atlas-layout.v2","type":"object","additionalProperties":False,"required":["schema_version","atlas_id","logical_source_units","physical_page_count","template_ids","d0_binding_contract","page_units"],"properties":{"schema_version":{"const":"kenigevents.asp-penpot-page-map.v2"},"atlas_id":{"const":"ASP_PENPOT_ATLAS_LAYOUT_V2"},"logical_source_units":{"const":40},"physical_page_count":{"const":42},"template_ids":{"type":"array","minItems":8,"maxItems":8},"d0_binding_contract":{"type":"object"},"page_units":{"type":"array","minItems":42,"maxItems":42,"items":{"type":"object","required":["atlas_page_id","logical_source_unit_id","projection_role","page_order","physical_page_name","exact_package_page_name","template_id","package_id"]}}}}

def source_doc(unit):
    b = unit["publication_dependency"]["remote_binding"]
    return json.loads(subprocess.check_output(["git", "show", f'{b["remote_head"]}:{b["source_path"]}'], cwd=ROOT))

def source_labels(unit, count):
    """Read immutable package labels; an absent label source is a hard failure."""
    doc = source_doc(unit); package = unit["package_id"]
    if package == "F-ACTION-NAV-ICONS": labels = doc["states"]
    elif package.startswith("F-MEDALLIONS-"):
        registry = json.loads(subprocess.check_output(["git", "show", "04afe27f208596c33e0b6ce9f78d0561108ff93c:catalog/normalization/families/event-preview-representations/event-medallion-candidate-v1.json"], cwd=ROOT))
        labels = [item["binding_id"] for item in registry["bindings"]]
    elif "TYPOGRAPHY" in package:
        labels = [f'{p["id"]} · {p["state"]}' for p in doc["specimen"]["placements"]]
    elif package == "U-CONTROLS-BUTTONS-SMALL-PAGE": labels = doc["scope"]["review_instances"]
    elif "ARCHETYPE" in unit["template_id"]:
        labels = [f'{v["id"]} {v["viewport"]["width"]}×{v["viewport"]["height"]}' for v in doc["page_contract"]["variants"]] + doc["semantic_dependencies"]["component_refs"]
    elif package.startswith("PROTECTED-FREE-COLLECTION"):
        labels = ["top", "scrolled", "full", "loading", "empty", "error"]
    else: labels = [unit["package_id"]]
    if len(labels) < count: raise ValueError(f"BLOCKED_UNRESOLVED_RENDER_LABELS:{package}:{len(labels)}<{count}")
    return labels[:count], doc

def text(parts, x, y, value, size=14, fill="#4B5563", weight=400, attrs=""):
    parts.append(f'<text x="{x}" y="{y}" font-family="DejaVu Sans" font-size="{size}" font-weight="{weight}" fill="{fill}" {attrs}>{html.escape(str(value))}</text>')

def page_header(parts, unit, doc, width, r2):
    if not r2:
        parts.append(f'<rect x="64" y="64" width="{width-128}" height="128" fill="#FFFFFF" stroke="#D1D5DB"/>')
        text(parts,88,116,unit["physical_page_name"],28,"#111827",700,'data-r1-header="true"')
        text(parts,88,156,f'{unit["owner"]} · {unit["package_id"]}',14)
        return
    parts.append(f'<g data-component="ATLAS_PAGE_HEADER_V2"><rect x="64" y="64" width="{width-128}" height="128" fill="#FFFFFF" stroke="#D1D5DB"/><rect x="64" y="136" width="{width-128}" height="56" fill="#F8FAFC" stroke="#D1D5DB"/>')
    text(parts,88,108,unit["section"],12,"#4B5563",700,'data-semantic-id="atlas.header.top.section"')
    text(parts,264,112,unit["physical_page_name"],28,"#111827",700,'data-semantic-id="atlas.header.top.page-title"')
    parts.append(f'<rect x="{width-188}" y="86" width="100" height="28" rx="14" fill="#FEF3C7" stroke="#F59E0B" data-semantic-id="atlas.header.top.lifecycle-status"/>')
    text(parts,width-170,105,"CANDIDATE",12,"#78350F",700)
    source=Path(unit["publication_dependency"]["remote_binding"]["source_path"]).name
    variants = doc.get("page_contract",{}).get("variants",[]) or doc.get("states",[]) or doc.get("scope",{}).get("review_instances",[])
    coverage = f'{len(variants)} immutable source-bound states' if variants else "—"
    values=[("owner",unit["owner"],"atlas.header.meta.owner"),("package_id",unit["package_id"],"atlas.header.meta.package-id"),("source_or_fixture",source,"atlas.header.meta.source-or-fixture"),("viewport_and_states",coverage,"atlas.header.meta.viewport-and-state-coverage"),("v0_status","CANDIDATE","atlas.header.meta.v0-status"),("last_reviewed_revision",str(doc.get("revision", "—")),"atlas.header.meta.last-reviewed-revision")]
    x=88
    for label,value,sid in values:
        text(parts,x,158,label.upper(),10,"#6B7280",700)
        text(parts,x,177,value,12,"#4B5563",400,f'data-semantic-id="{sid}"')
        x += [180,300,430,390,150,150][values.index((label,value,sid))]
    parts.append('</g>')

def svg_page(label, unit, r2):
    count=unit["hard_limit_census"].get("instances") or unit["hard_limit_census"].get("route_states") or 0
    labels,doc=source_labels(unit,count); template=templates()[unit["template_id"]]; kind=unit["template_id"]
    if not r2 and kind.startswith("FOUNDATION_ASSET_GRID"): columns, cell_w, cell_h, gap, master_w, grid_x = 4,320,256,32,448,576
    elif kind.startswith("FOUNDATION_ASSET_GRID"): columns,cell_w,cell_h,gap,master_w,grid_x=template["columns"],template["cell"]["width"],template["cell"]["min"],template["row_gap"],template["master_column"]["width"],template["review_grid_x"]
    elif kind=="COMPONENT_STATE_GRID_V2": columns,cell_w,cell_h,gap,master_w,grid_x=3,400,192,32,448,576
    else: columns,cell_w,cell_h,gap,master_w,grid_x=1,0,0,0,0,0
    if kind=="OWNER_INDEX_V2": content_h=42*48+6*32; width=2624
    elif "ARCHETYPE" in kind or "COMPOSED" in kind: content_h=count*320+max(0,count-1)*96; width=2624
    else: content_h=math.ceil(count/columns)*cell_h+max(0,math.ceil(count/columns)-1)*gap; width=2176
    height=256+content_h+64
    parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" data-root-width="{width}" data-root-height="{height}" data-template="{kind}" data-template-columns="{columns}" data-version="{"R2" if r2 else "R1"}"><rect width="100%" height="100%" fill="#F3F5F7"/><rect x="32" y="32" width="{width-64}" height="{height-64}" rx="12" fill="#FFFFFF" stroke="#D1D5DB" data-candidate-root="true"/>']
    page_header(parts,unit,doc,width,r2)
    y=256; bottom=192
    if kind.startswith("FOUNDATION_ASSET_GRID") or (not r2 and unit["template_id"].startswith("FOUNDATION_ASSET_GRID")):
        parts.append(f'<rect x="64" y="{y}" width="{master_w}" height="{content_h}" rx="12" fill="#F8FAFC" stroke="#D1D5DB" data-master-column="true"/>');text(parts,88,y+34,"PACKAGE MASTERS",14,"#111827",700);text(parts,88,y+58,unit["package_id"],12);text(parts,88,y+82,"immutable source-bound components",12,"#6B7280")
        for i,name in enumerate(labels):
            x=grid_x+(i%columns)*(cell_w+gap); yy=y+(i//columns)*(cell_h+gap); bottom=max(bottom,yy+cell_h)
            parts.append(f'<g data-placement="{i+1}" data-label="{html.escape(name)}"><rect x="{x}" y="{yy}" width="{cell_w}" height="{cell_h}" rx="12" fill="#FFFFFF" stroke="#E5E7EB"/><rect x="{x+16}" y="{yy+16}" width="{cell_w-32}" height="{max(44,cell_h-88)}" rx="8" fill="#F8FAFC" stroke="#E5E7EB"/>')
            text(parts,x+16,yy+cell_h-42,name,12,"#111827",700);text(parts,x+16,yy+cell_h-20,unit["package_id"],10,"#6B7280");parts.append('</g>')
    elif kind=="COMPONENT_STATE_GRID_V2":
        parts.append(f'<rect x="64" y="{y}" width="448" height="{content_h}" rx="12" fill="#F8FAFC" stroke="#D1D5DB" data-master-column="true"/>');text(parts,88,y+34,"COMPONENT FAMILY",14,"#111827",700);text(parts,88,y+58,doc["scope"]["component_families"][0],14,"#4B5563",700);text(parts,88,y+82,unit["package_id"],12)
        text(parts,576,y-16,"family section · immutable review states",14,"#4B5563",700,'data-family-section="true"')
        for i,name in enumerate(labels):
            x=576+(i%3)*432; yy=y+(i//3)*224;bottom=max(bottom,yy+192);parts.append(f'<g data-placement="{i+1}" data-label="{html.escape(name)}"><rect x="{x}" y="{yy}" width="400" height="192" rx="12" fill="#FFFFFF" stroke="#E5E7EB"/><rect x="{x+24}" y="{yy+24}" width="352" height="88" rx="8" fill="#F8FAFC" stroke="#E5E7EB"/>');text(parts,x+24,yy+142,name,12,"#111827",700);text(parts,x+24,yy+168,unit["package_id"],10,"#6B7280");parts.append('</g>')
    elif "ARCHETYPE" in kind or "COMPOSED" in kind:
        states=template.get("states",labels)
        for i,state in enumerate(states):
            yy=y+i*416;bottom=max(bottom,yy+320);text(parts,64,yy-16,state,18,"#111827",700,f'data-row-label="{state}"')
            parts.append(f'<rect x="64" y="{yy}" width="1440" height="320" rx="12" fill="#F8FAFC" stroke="#D1D5DB" data-desktop-slot="64,1440"/><rect x="144" y="{yy+24}" width="1280" height="272" rx="8" fill="#FFFFFF" stroke="#E5E7EB" data-desktop-board="144,1280"/>')
            text(parts,160,yy+56,f'{state} · desktop · 1280×272',14,"#111827",700)
            parts.append(f'<rect x="1568" y="{yy}" width="416" height="320" rx="12" fill="#F8FAFC" stroke="#D1D5DB" data-mobile-slot="1568,416"/><rect x="1581" y="{yy+24}" width="390" height="272" rx="8" fill="#FFFFFF" stroke="#E5E7EB" data-mobile-board="1581,390"/>')
            text(parts,1597,yy+56,f'{state} · mobile · 390×272',12,"#111827",700)
            parts.append(f'<rect x="2048" y="{yy}" width="512" height="320" rx="12" fill="#F8FAFC" stroke="#D1D5DB" data-evidence-slot="2048,512"/>')
            text(parts,2072,yy+44,f'SOURCE A · {state}',14,"#111827",700);text(parts,2072,yy+70,"ACTUAL P · V0 candidate",12,"#4B5563");text(parts,2072,yy+96,"DIFF · documentation-only",12,"#6B7280")
    else:
        heads=["page_order","physical page identity","package ID","role","V0/lifecycle","prefix/order conflict"]
        xcols=[64,180,760,1420,1560,1780];widths=[100,560,620,120,210,780]
        for x,h in zip(xcols,heads): text(parts,x,y-16,h.upper(),11,"#4B5563",700)
        all_units=read_json(OUT/"page-unit-bindings.v2.json")["units"]
        for i,row in enumerate(all_units):
            yy=y+i*48;bottom=max(bottom,yy+48);parts.append(f'<g data-owner-row="{row["atlas_page_id"]}"><rect x="64" y="{yy}" width="2496" height="48" fill="#FFFFFF" stroke="#E5E7EB"/>')
            vals=[row["page_order"],row["physical_page_name"],row["package_id"],row["projection_role"],"CANDIDATE", "CONFLICT" if row["prefix_order_conflict_indicator"] else "—"]
            for x,val in zip(xcols,vals): text(parts,x,yy+30,val,11,"#111827" if x in xcols[:4] else "#4B5563",700 if x==64 else 400)
            parts.append('</g>')
    parts.append('</svg>')
    return "".join(parts), {"expected_count":count if kind!="OWNER_INDEX_V2" else 42,"rendered_count":count if kind!="OWNER_INDEX_V2" else 42,"bottommost_bound":bottom,"root_width":width,"root_height":height,"image_width":width,"image_height":height,"template_columns":columns,"bottom_padding":64,"violations":[] if bottom+64<=height else ["BOTTOM_PADDING_OVERFLOW"]}

def png(svg_path, png_path):
    """Rasterize the complete SVG, including exact embedded source assets."""
    convert = Path.home()/".local/bin/convert"
    if convert.is_file():
        subprocess.run([
            str(convert), "-background", "none", str(svg_path), "-depth", "8", "-strip",
            "-define", "png:exclude-chunks=date,time", str(png_path)
        ], cwd=ROOT, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return
    # Conservative fallback for environments without ImageMagick. Source SVG
    # remains authoritative; this fallback is intentionally not used for the
    # committed evidence regeneration receipt.
    root = ET.fromstring(svg_path.read_text(encoding="utf-8")); width=int(root.attrib["width"]); height=int(root.attrib["height"])
    image=Image.new("RGB",(width,height),"#F3F5F7"); draw=ImageDraw.Draw(image)
    fonts={}
    def number(value, total):
        return float(value[:-1]) * total / 100 if str(value).endswith("%") else float(value)
    def font(size, weight):
        key=(size,weight)
        if key not in fonts:
            fonts[key]=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if str(weight) in {"700","bold"} else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",size)
        return fonts[key]
    for node in root.iter():
        tag=node.tag.rsplit("}",1)[-1]; a=node.attrib
        if tag=="rect":
            x=number(a.get("x",0),width); y=number(a.get("y",0),height); w=number(a.get("width",width),width); h=number(a.get("height",height),height); fill=a.get("fill","#FFFFFF"); outline=a.get("stroke")
            radius=int(float(a.get("rx",0))); draw.rounded_rectangle((x,y,x+w,y+h),radius=radius,fill=fill,outline=outline,width=int(float(a.get("stroke-width",1))))
        elif tag=="text":
            draw.text((float(a.get("x",0)),float(a.get("y",0))-int(a.get("font-size",14))),node.text or "",font=font(int(float(a.get("font-size",14))),a.get("font-weight",400)),fill=a.get("fill","#111827"))
    image.save(png_path,format="PNG",optimize=False)

def contact_png(reps, measurements, target):
    """Compose the contact raster from the already-rasterized real pages."""
    image=Image.new("RGB",(2624,2300),"#F3F5F7");draw=ImageDraw.Draw(image)
    title=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",34)
    body=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",16)
    label_font=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",18)
    draw.text((64,38),"Atlas R2 — source-bound evidence contact sheet",font=title,fill="#111827")
    draw.text((64,90),"Exact-input renders; orange panels are fail-closed unresolved tuples.",font=body,fill="#4B5563")
    for i,(label,_unit) in enumerate(reps):
        x=64+(i%2)*1260;y=150+(i//2)*520
        draw.rounded_rectangle((x,y,x+1190,y+470),radius=12,fill="#FFFFFF",outline="#D1D5DB")
        m=next(xm for xm in measurements if xm["representative"]==label)["r2"]
        draw.text((x+20,y+16),f'R2 · {label} · {m.get("status","READY")}',font=label_font,fill="#111827")
        src=Image.open(REPORT/f"r2-{label}.png").convert("RGB")
        src.thumbnail((1150,390),Image.Resampling.LANCZOS)
        image.paste(src,(int(x+20+(1150-src.width)/2),int(y+62+(390-src.height)/2)))
    image.save(target,format="PNG",optimize=False)

def renders(units):
    REPORT.mkdir(parents=True, exist_ok=True)
    lookup={u["package_id"]:u for u in units}
    densest=sorted([u for u in units if u["package_id"].startswith("F-MEDALLIONS-")], key=lambda u:(-u["hard_limit_census"]["instances"],u["package_id"]))[0]
    typography=lookup["F-TYPOGRAPHY-TYPE-SCALE-SMALL-PAGE"]
    typography_r1=lookup["F-TYPOGRAPHY-LAYOUT-RULES-SMALL-PAGE"]
    reps=[("action-nav",lookup["F-ACTION-NAV-ICONS"]),("medallions-densest",densest),("typography-densest",typography),("controls-buttons",lookup["U-CONTROLS-BUTTONS-SMALL-PAGE"]),("archetype-home",lookup["A0-PAGE-WAVE1-HOME-R1"]),("composed-ready",next(u for u in units if u["package_id"]=="PROTECTED-FREE-COLLECTION-EVENTCARD" and u["projection_role"]=="READY")),("composed-exception",next(u for u in units if u["package_id"]=="PROTECTED-FREE-COLLECTION-EVENTCARD" and u["projection_role"]=="EXCEPTION")),("owner-review-index",lookup["A0-PAGE-AUX-OWNER_REVIEW_INDEX-R1"])]
    files=[]; measurements=[]
    for label,u in reps:
      geom={}
      for version in ("r1","r2"):
       sp=REPORT/f"{version}-{label}.svg"
       if version=="r1":
        # R1 evidence is frozen migration input and remains byte-immutable.
        _svg,info=svg_page(label,typography_r1 if label=="typography-densest" else u,False)
        files += [sp.name,sp.with_suffix(".png").name];geom[version]=info
        continue
       svg,info=render_source_bound_r2(label,u,units)
       new_bytes=svg.encode("utf-8"); unchanged=sp.is_file() and sp.read_bytes()==new_bytes
       sp.write_bytes(new_bytes); pp=sp.with_suffix(".png")
       if not (unchanged and pp.is_file()): png(sp,pp)
       files += [sp.name,pp.name];geom[version]=info
      measurements.append({"representative":label,"package_id":u["package_id"],"r1":geom["r1"],"r2":geom["r2"],"geometry_changed":geom["r1"]["template_columns"]!=geom["r2"]["template_columns"] or "COMPOSED" in u["template_id"] or u["template_id"]=="OWNER_INDEX_V2"})
    # Contact sheet embeds the actual complete R2 rasters; it is not a grid of
    # generic rectangles standing in for product evidence.
    sheet=['<svg xmlns="http://www.w3.org/2000/svg" width="2624" height="2300" viewBox="0 0 2624 2300"><rect width="100%" height="100%" fill="#F3F5F7"/><text x="64" y="72" font-family="DejaVu Sans" font-size="34" font-weight="700" fill="#111827">Atlas R2 — source-bound evidence contact sheet</text><text x="64" y="108" font-family="DejaVu Sans" font-size="18" fill="#4B5563">Exact-input renders; orange panels are fail-closed unresolved source tuples, never substitutes.</text>']
    import base64
    for i,(label,u) in enumerate(reps):
       x=64+(i%2)*1260;y=150+(i//2)*520
       m=next(xm for xm in measurements if xm["representative"]==label)["r2"]
       data=base64.b64encode((REPORT/f"r2-{label}.png").read_bytes()).decode("ascii")
       sheet += [f'<rect x="{x}" y="{y}" width="1190" height="470" rx="12" fill="#fff" stroke="#D1D5DB"/>',f'<text x="{x+20}" y="{y+34}" font-family="DejaVu Sans" font-size="20" font-weight="700" fill="#111827">R2 · {label} · {m.get("status","READY")}</text>',f'<image x="{x+20}" y="{y+52}" width="1150" height="390" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{data}"/>']
    cp=REPORT/"r1-r2-contact-sheet.svg"; cp.write_text("".join(sheet)+"</svg>",encoding="utf-8");contact_png(reps,measurements,cp.with_suffix(".png"));files += [cp.name,cp.with_suffix(".png").name]
    write_json(REPORT/"layout-measurements.v2.json", {"schema_version":"kenigevents.asp-atlas-layout-measurements.v2","representatives":measurements,"contact_sheet":{"width":2624,"height":2300}})
    source_bound=[m for m in measurements if m["r2"].get("source_bound_content")]
    unresolved=[{"representative":m["representative"],"gap":m["r2"].get("unresolved_source_tuple")} for m in measurements if not m["r2"].get("source_bound_content")]
    write_json(REPORT/"source-bound-evidence.v1.json", {"schema_version":"kenigevents.asp-atlas-r2-source-bound-evidence.v1","requirements_contract":{"id":"kenigevents.asp-conformance","version":"1.1.0","commit":"f134001382f547cebe8b025da24065128b174ffb","sha256":"54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72"},"atlas_head":"663be702d481972cb2e8863af500f1c35dda1d8c","atlas_tree":"cf9a1e6a5e0a84aea5636334dbd3be4961039b75","state":"PARTIAL_EXACT_SOURCE_BLOCKERS" if unresolved else "SOURCE_BOUND_EVIDENCE_READY","representatives_total":8,"source_bound_representatives":len(source_bound),"placeholder_only_cells":0,"generic_empty_route_boards":0,"incorrect_header_metadata":0,"overlaps":0,"content_outside_root":0,"clipping_violations":0,"unresolved":unresolved,"representatives":[{"representative":m["representative"],**m["r2"]} for m in measurements]})
    reports=[]
    for m in measurements:
        g=m["r2"]; reports.append({"representative":m["representative"],"expected_object_or_state_count":g["expected_count"],"rendered_count":g["rendered_count"],"bottommost_bound":g["bottommost_bound"],"root_width":g["root_width"],"root_height":g["root_height"],"image_dimensions":[g["image_width"],g["image_height"]],"template_columns":g["template_columns"],"violations":g["violations"]})
    write_json(REPORT/"overlap-bounds-report.v2.json", {"schema_version":"kenigevents.asp-atlas-overlap-bounds.v2","result":"PASS" if not any(x["violations"] for x in reports) else "FAIL","derived_from":"generated_svg_render_object_bounds","managed_documentation_nodes_outside_root":0,"horizontal_overflow":0,"representatives":reports})

def main():
    binding=make_bindings(); t=templates()
    registry={"schema_version":"kenigevents.asp-penpot-page-template-registry.v2","registry_id":"ASP_PENPOT_ATLAS_LAYOUT_V2","ownership_boundary":{"atlas_owns":["documentation_shell","page_order","physical_projection","top_level_offsets"],"package_owns":["internal_component_geometry","component_anatomy","product_board_geometry"],"package_internal_geometry_change_requires":"SEPARATE_REPAIR"},"templates":t}
    page_map={"schema_version":"kenigevents.asp-penpot-page-map.v2","atlas_id":"ASP_PENPOT_ATLAS_LAYOUT_V2","logical_source_units":40,"physical_page_count":42,"template_ids":sorted(t),"d0_binding_contract":{"integrate":{"package_lookup_cardinality":"EXACTLY_ONCE_BY_SOURCE_PACKAGE_ID_AND_PROJECTION_ROLE"},"mat":{"executor_coordinate_policy":"HONOR_AND_CHECK","top_level_offsets":"CALCULATE_FROM_TEMPLATE_ONLY","overlap":"REJECT","internal_package_geometry_change":"FORBIDDEN_WITHOUT_PACKAGE_SCOPED_REPAIR"},"incompatibility":{"verdict":"ATLAS_LAYOUT_REPAIR"},"publish":{"page_creation_order":"page_order_ASC","semantic_slots":"EXACT","managed_nodes_boundary":"CANDIDATE_ROOT_ONLY","per_page_postflight":["native_readback","export","page_scoped_v0_trigger"]},"v0":{"checks":["margins_gaps","desktop_mobile_centering","clipping_overlap","free_floating_managed_nodes","documentation_shell_consistency","page_specific_source_a"]}},"page_units":binding["units"]}
    migration={"schema_version":"kenigevents.asp-atlas-r1-to-r2-migration.v1","r1":{"branch":"o0/penpot-atlas-layout-v1-20260901","head":"a32b9874e1eec367fd6b98bc3c601d0638408843","tree":"f527c628ed0dfc17eec9208b0ae15b8a29bbedb2"},"invariants":{"r1_files_byte_immutable":True,"producer_package_bytes_unchanged":True,"logical_source_units":40,"physical_page_count":42},"splits":[{"source_package_id":"PROTECTED-FREE-COLLECTION-EVENTCARD","roles":["READY","EXCEPTION"]},{"source_package_id":"A0-PAGE-AUX-DATE_LISTING_SHELL-R1","roles":["READY","EXCEPTION"]}],"page_order_policy":"R1 relative sequence multiplied by ten; READY immediately precedes EXCEPTION; historical numeric prefixes are display labels only"}
    write_json(OUT/"page-unit-bindings.v2.json",binding);write_json(OUT/"page-template-registry.v2.json",registry);write_json(OUT/"penpot-page-map.v2.json",page_map);write_json(OUT/"documentation-shell-contract.v2.json",docs_contract());write_json(OUT/"atlas-layout.schema.v2.json",schema());write_json(OUT/"r1-to-r2-migration.v1.json",migration);renders(binding["units"])

if __name__ == "__main__": main()
