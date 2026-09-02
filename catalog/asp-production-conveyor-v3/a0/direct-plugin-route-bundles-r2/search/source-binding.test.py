#!/usr/bin/env python3
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
