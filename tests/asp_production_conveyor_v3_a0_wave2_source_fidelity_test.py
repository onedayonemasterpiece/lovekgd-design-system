#!/usr/bin/env python3
from pathlib import Path
import copy, hashlib, json, re, subprocess
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'catalog/asp-production-conveyor-v3/a0'
def load(path): return json.loads(path.read_text(encoding='utf-8'))
def canon(o): return json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
def sha(o): return hashlib.sha256(canon(o)).hexdigest()
old=load(BASE/'archetype-wave-2.v1.json')
new=load(BASE/'archetype-wave-2.v2.json')
focus=json.loads(subprocess.check_output(['git','show','9b8043f3bdb86fab4eee00bf94b0f10d4f029c50:catalog/global-archetype-sot-v1/archetype-contracts/focus-group.semantic-contract.v1.json'],cwd=ROOT).decode('utf-8'))
manifest=load(BASE/'ready-manifests-phase2-repair.v4.json')
n=0
def check(v,label):
    global n
    assert v,label
    n+=1
old_focus=next(x for x in old['archetypes'] if x['archetype_id']=='archetype.focus-group')
new_focus=next(x for x in new['archetypes'] if x['archetype_id']=='archetype.focus-group')
check('/fokus-gruppa/priglashenie/' not in old_focus['route_patterns'],'old invitation omitted')
check('/fokus-gruppa/zavershenie/' not in old_focus['route_patterns'],'old completion omitted')
check(new_focus['route_patterns']==focus['route_contract']['route_patterns'],'exact route repair')
check(new_focus['source_pages']==focus['route_contract']['source_pages'],'exact source-page repair')
check(new['count']==old['count']==10 and new['case_count']==old['case_count']==20,'counts stable')
check(new['supersedes']['record_sha256']==old['record_sha256'],'supersedes receipt')
check(new['repair_lineage']['policy_comment']==5481580183,'V6 policy')
check(new['repair_lineage']['restored_route_patterns']==['/fokus-gruppa/priglashenie/','/fokus-gruppa/zavershenie/'],'restored routes')
check(new['repair_lineage']['restored_source_pages']==['site/src/pages/fokus-gruppa/priglashenie/index.astro','site/src/pages/fokus-gruppa/zavershenie/index.astro'],'restored pages')
check(sha({k:v for k,v in new.items() if k!='record_sha256'})==new['record_sha256'],'source record hash')
check(sha({k:v for k,v in manifest.items() if k!='record_sha256'})==manifest['record_sha256'],'manifest record hash')
check(manifest['repair']['replacement_source_record_sha256']==new['record_sha256'],'manifest source receipt')
check(manifest['repair']['case_count_unchanged']==20 and manifest['repair']['product_semantics_changed'] is False,'bounded repair')
check(manifest['repair']['penpot_lineage_reused'] is False and manifest['repair']['old_visual_status_inherited'] is False,'lineage boundary')
check(new['volunteer']['status']=='EXCLUDED_NO_FACTUAL_CURRENT_ROUTE_CONTRACT','volunteer unchanged')
text=json.dumps(new,ensure_ascii=False)
check('design.penpot.app' not in text,'no direct URL')
check(not re.search(r'"(?:page_id|board_id|component_id|shape_id|penpot_uuid)"',text),'no UUID keys')
for key in ('route_patterns','source_pages'):
    bad=copy.deepcopy(new)
    target=next(x for x in bad['archetypes'] if x['archetype_id']=='archetype.focus-group')
    target[key]=target[key][:-1]
    check(target[key] != focus['route_contract'][key],'negative '+key)
print(json.dumps({'status':'PASS','checks_passed':n,'checks_failed':0},separators=(',',':')))
