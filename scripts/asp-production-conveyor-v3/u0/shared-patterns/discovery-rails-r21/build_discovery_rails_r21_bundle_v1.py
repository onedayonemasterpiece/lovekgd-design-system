#!/usr/bin/env python3
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[5]
HERE=Path(__file__).resolve().parent
source=json.loads((ROOT/'catalog/asp-production-conveyor-v3/u0/shared-patterns/U-SHARED-PATTERNS.native-successor.v2.json').read_text())
native=json.loads((ROOT/'catalog/asp-production-conveyor-v3/u0/shared-patterns/native-product-contract.v2.json').read_text())
unit=source['page_units'][0]; component=native['components'][unit['component_ids'][0]]
data={'unit':unit,'component':component,'specimens':{k:native['specimens'][k] for k in unit['specimen_ids']},'source':source['source_authority'],'sourceLineage':source['component_source_lineage'][unit['component_ids'][0]],'atlas':{'head':'be4918e5d8e1c1bba5da478acfd08f8035cfc1a5','tree':'da1f5c305c75d467af5e4e26f8a996b8c243d74f','pageOrder':'0230.007','template':'COMPONENT_STATE_GRID_V2'}}
template=(HERE/'discovery_rails_r21_bundle.template.js').read_text()
assert template.count('/*__DATA__*/')==1
out=template.replace('/*__DATA__*/',json.dumps(data,ensure_ascii=False,separators=(',',':')))
(HERE/'discovery_rails_r21_standalone_bundle_v1.js').write_text(out)
print(HERE/'discovery_rails_r21_standalone_bundle_v1.js')
