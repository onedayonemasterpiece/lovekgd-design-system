#!/usr/bin/env python3
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
