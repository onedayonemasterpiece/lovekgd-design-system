#!/usr/bin/env python3
"""Build the package-local, self-contained EventCard Media Penpot bundle."""
from pathlib import Path
import re
import json
import hashlib

HERE = Path(__file__).resolve().parent
LOGIC = HERE / 'eventcard_media_same_tuple_r3.js'
RUNTIME = HERE / 'eventcard_media_penpot_runtime_r3.js'
OUTPUT = HERE / 'eventcard_media_penpot_standalone_bundle_v1.js'
PROVIDER = HERE / 'provider-envelope.v1.json'
GLOBAL = 'KenigEventsD0EventcardMediaR3StandaloneV7'

SHA256 = r'''
function __bundleUtf8Bytes(text) {
  const out = [];
  for (let i = 0; i < text.length; i += 1) {
    let code = text.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
      const low = text.charCodeAt(i + 1);
      if (low >= 0xdc00 && low <= 0xdfff) { code = 0x10000 + ((code - 0xd800) << 10) + (low - 0xdc00); i += 1; }
    }
    if (code < 0x80) out.push(code);
    else if (code < 0x800) out.push(0xc0 | (code >>> 6), 0x80 | (code & 63));
    else if (code < 0x10000) out.push(0xe0 | (code >>> 12), 0x80 | ((code >>> 6) & 63), 0x80 | (code & 63));
    else out.push(0xf0 | (code >>> 18), 0x80 | ((code >>> 12) & 63), 0x80 | ((code >>> 6) & 63), 0x80 | (code & 63));
  }
  return new Uint8Array(out);
}
function __bundleSha256Bytes(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ];
  const bitLength = bytes.length * 8;
  const paddedLength = (((bytes.length + 9 + 63) >> 6) << 6);
  const msg = new Uint8Array(paddedLength); msg.set(bytes); msg[bytes.length] = 0x80;
  const view = new DataView(msg.buffer);
  const hi = Math.floor(bitLength / 0x100000000), lo = bitLength >>> 0;
  view.setUint32(paddedLength - 8, hi, false); view.setUint32(paddedLength - 4, lo, false);
  let h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a,h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19;
  const rotr = (x,n) => (x >>> n) | (x << (32-n));
  for (let off=0; off<msg.length; off+=64) {
    const w = new Uint32Array(64);
    for (let i=0;i<16;i+=1) w[i]=view.getUint32(off+i*4,false);
    for (let i=16;i<64;i+=1) { const a=w[i-15],b=w[i-2]; const s0=rotr(a,7)^rotr(a,18)^(a>>>3),s1=rotr(b,17)^rotr(b,19)^(b>>>10); w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0; }
    let a=h0,b=h1,c=h2,d=h3,e=h4,f=h5,g=h6,h=h7;
    for (let i=0;i<64;i+=1) { const s1=rotr(e,6)^rotr(e,11)^rotr(e,25),ch=(e&f)^(~e&g),t1=(h+s1+ch+K[i]+w[i])>>>0,s0=rotr(a,2)^rotr(a,13)^rotr(a,22),maj=(a&b)^(a&c)^(b&c),t2=(s0+maj)>>>0; h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0; }
    h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+c)>>>0;h3=(h3+d)>>>0;h4=(h4+e)>>>0;h5=(h5+f)>>>0;h6=(h6+g)>>>0;h7=(h7+h)>>>0;
  }
  return [h0,h1,h2,h3,h4,h5,h6,h7].map((v)=>v.toString(16).padStart(8,'0')).join('');
}
function __bundleSha256Text(text) { return __bundleSha256Bytes(__bundleUtf8Bytes(String(text))); }
'''.strip()


def strip_header(source: str) -> str:
    return re.sub(r"^'use strict';\s*", '', source, count=1)


def replace_export(source: str, prefix: str) -> str:
    pattern = r"\nmodule\.exports\s*=\s*\{([\s\S]*?)\n\};\s*$"
    match = re.search(pattern, source)
    if not match:
        raise SystemExit(f'missing export block in {prefix}')
    return source[:match.start()] + '\nreturn {' + match.group(1) + '\n};\n'

logic = strip_header(LOGIC.read_text())
logic = logic.replace("const crypto = require('node:crypto');\n\n", '')
logic = logic.replace("const sha256 = (value) => crypto.createHash('sha256').update(canonical(value)).digest('hex');",
                      "const sha256 = (value) => __bundleSha256Text(canonical(value));")
logic = replace_export(logic, 'logic')

runtime = strip_header(RUNTIME.read_text())
runtime = runtime.replace("const M = require('./eventcard_media_same_tuple_r3.js');\n\n", '')
runtime_bytes = RUNTIME.read_bytes()
provider = json.loads(PROVIDER.read_text())
payload_sha256 = hashlib.sha256(runtime_bytes).hexdigest()
payload_blob_sha1 = hashlib.sha1(f"blob {len(runtime_bytes)}\0".encode() + runtime_bytes).hexdigest()
if (provider['bundleSha256'] != payload_sha256 or provider['bundleBlobSha1'] != payload_blob_sha1 or
        provider['bundleBytes'] != len(runtime_bytes)):
    raise SystemExit('provider payload attestation mismatch')
provider_literal = json.dumps(provider, separators=(',', ':'))
runtime, provider_replacements = re.subn(
    r"const EXACT_PROVIDER_IDENTITY = Object\.freeze\(\{[\s\S]*?\n\}\);",
    f"const EXACT_PROVIDER_IDENTITY = Object.freeze({provider_literal});", runtime, count=1)
if provider_replacements != 1:
    raise SystemExit('missing exact provider identity declaration')
runtime = runtime.replace("return require('node:crypto').createHash('sha256').update(data).digest('hex');", "return __bundleSha256Bytes(data);")
export_match = re.search(r"\nmodule\.exports\s*=\s*\{([\s\S]*?)\};\s*$", runtime)
if not export_match:
    raise SystemExit('missing runtime export block')
public_members = export_match.group(1).strip()
runtime = runtime[:export_match.start()] + '\n'

ASSET_DIR = HERE.parents[3] / 'catalog/asp-production-conveyor-v3/mat/eventcard-media-same-tuple-r3/assets'
asset_literals = {}
import base64
for asset in sorted(ASSET_DIR.glob('*.webp')):
    asset_literals[asset.stem] = base64.b64encode(asset.read_bytes()).decode('ascii')
asset_js = ',\n'.join(f"  {key!r}: __decodeBase64({value!r})" for key, value in asset_literals.items())

bundle = f"""/* Generated deterministically by {Path(__file__).name}. Do not hand-edit. */
(function (global) {{
'use strict';
{SHA256}
function __decodeBase64(text) {{
  const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const clean=String(text).replace(/=+$/,''); const out=[]; let bits=0,value=0;
  for (let i=0;i<clean.length;i+=1) {{ const n=alphabet.indexOf(clean[i]); if(n<0) continue; value=(value<<6)|n;bits+=6;if(bits>=8){{bits-=8;out.push((value>>>bits)&255);}} }}
  return new Uint8Array(out);
}}
const __BUNDLED_SOURCE_ASSETS = Object.freeze({{
{asset_js}
}});
const M = (() => {{
{logic}
}})();
{runtime}
function __withEmbeddedAssets(host) {{
  if (!host || typeof host !== 'object') return host;
  if (!host.sourceAssets) host.sourceAssets = __BUNDLED_SOURCE_ASSETS;
  return host;
}}
function __assertBundleAuthorization(host) {{
  const auth = host && host.authorization;
  const p=EXACT_PROVIDER_IDENTITY;
  if (!host || host.exactPackageHead!==p.packageHead || host.exactPackageTree!==p.packageTree ||
      host.exactBundleSha256!==p.bundleSha256 || host.exactBundleBlobSha1!==p.bundleBlobSha1 ||
      host.exactBundleBytes!==p.bundleBytes || host.exactOperationIdentitySha256!==p.operationIdentitySha256 ||
      host.exactSourceHead!==p.sourceHead || !auth || auth.bundleSha256!==p.bundleSha256 ||
      auth.bundleBlobSha1!==p.bundleBlobSha1 || auth.bundleBytes!==p.bundleBytes ||
      auth.operationIdentitySha256!==p.operationIdentitySha256 || auth.sourceHead!==p.sourceHead ||
      !auth.provenance || auth.provenance.bundleSha256!==p.bundleSha256 ||
      auth.provenance.bundleBlobSha1!==p.bundleBlobSha1 || auth.provenance.bundleBytes!==p.bundleBytes ||
      auth.provenance.operationIdentitySha256!==p.operationIdentitySha256 || auth.provenance.sourceHead!==p.sourceHead) {{
    const error = new Error('MEDIA_R3_BUNDLE_AUTHORIZATION_MISMATCH');
    error.code = 'MEDIA_R3_BUNDLE_AUTHORIZATION_MISMATCH'; error.retryAllowed = false; throw error;
  }}
}}
const __CONFORMANCE_NS = 'd0-eventcard-media-bundle-v1';
const __CONFORMANCE_KEY = 'stable';
function __conformanceWrite(node, value) {{ node.setSharedPluginData(__CONFORMANCE_NS, __CONFORMANCE_KEY, value); }}
async function __createNativeConformanceHost(seed) {{
  const p=seed.penpot,node=seed.pluginNode;p.currentFile.id=M.FILE_ID;p.currentFile.revn=192;
  const page=p.__seedPage(M.PAGE_ID);page.name='00 · Components · Free collection';
  const collection=node(M.COLLECTION_ID,'board');collection.name='KenigEvents · G12 bounded L0-L3';page.root.appendChild(collection);
  for(let index=0;index<M.CASES.length;index+=1){{
    const spec=M.CASES[index],asset=M.SOURCE_ASSETS[spec.fixtureId],root=node(spec.rootId,'board'),parent=node(spec.parentGroupId,'group'),shape=node(spec.mediaShapeId,'rect');
    root.name=spec.caseId;root.x=index*600;root.y=20;root.width=spec.width;root.height=spec.height;
    parent.name='event.media-frame';parent.x=30+index;parent.y=40+index;parent.width=spec.width;parent.height=spec.height;
    shape.name='image-content';shape.x=10+index;shape.y=11+index;shape.width=spec.width;shape.height=spec.height;shape.rotation=0;shape.flipX=false;shape.flipY=false;
    const bytes=__BUNDLED_SOURCE_ASSETS[asset.sha256],image={{id:`seed-image-${{index}}`,name:asset.sourceAssetPath.split('/').at(-1),width:asset.width,height:asset.height,mtype:asset.mimeType,data:async()=>new Uint8Array(bytes)}};
    let fills=[{{fillImage:image,fillOpacity:1,fillImageKeepAspectRatio:asset.fit==='contain'}}];Object.defineProperty(shape,'fills',{{enumerable:true,configurable:true,get:()=>fills,set:(value)=>{{fills=value;}}}});
    parent.appendChild(shape);root.appendChild(parent);collection.appendChild(root);
  }}
  while(collection.children.length<18){{const index=collection.children.length,dummy=node(`media-dummy-${{index}}`,'board');dummy.name=`event.leaf.${{index}}`;dummy.x=index;dummy.y=0;dummy.width=1;dummy.height=1;collection.appendChild(dummy);}}
  p.library.local.components=Array.from({{length:35}},(_,index)=>{{const target=index<18,name=target?(index<14?`event.leaf.${{index}}`:`eventcard.case.${{index}}`):`other.component.${{index}}`,main=node(`component-main-${{index}}`,'board');main.name=name;return {{id:`component-${{index}}`,name,path:`Path / ${{index}}`,mainInstance:()=>main}};}});
  const rawUpload=p.uploadMediaData.bind(p);p.uploadMediaData=async(name,bytes,mimeType)=>{{const image=await rawUpload(name,bytes,mimeType),asset=Object.values(M.SOURCE_ASSETS).find((value)=>value.bytes===bytes.byteLength&&value.mimeType===mimeType);if(!asset)throw new Error('MEDIA_CONFORMANCE_ASSET_UNKNOWN');image.name=name;image.width=asset.width;image.height=asset.height;image.mtype=asset.mimeType;image.data=async()=>new Uint8Array(bytes);return image;}};
  const provider=EXACT_PROVIDER_IDENTITY;
  const host={{penpot:p,storage:seed.storage,exactPackageHead:provider.packageHead,exactPackageTree:provider.packageTree,exactBundleSha256:provider.bundleSha256,exactBundleBlobSha1:provider.bundleBlobSha1,exactBundleBytes:provider.bundleBytes,exactOperationIdentitySha256:provider.operationIdentitySha256,exactSourceHead:provider.sourceHead}};
  await p.openPage(page);const projection=await projectEventcardMediaPenpotR3(__withEmbeddedAssets(host));
  const provenance={{sessionId:'session-media-v7',taskId:'task-media-v7',writerId:SOLE_WRITER,operationId:'operation-media-v7',triggeredBy:'d0-conformance-media-v7',cancelToken:'cancel-media-v7',leaseToken:'lease-media-v7-0',leaseExpiresAt:Date.now()+600000,packageId:M.PACKAGE_ID,packageHead:provider.packageHead,packageTree:provider.packageTree,ownerDirective:OWNER_DIRECTIVE,authorityCardCommentId:AUTHORITY_CARD_COMMENT_ID,authorityScope:AUTHORITY_SCOPE,bundleSha256:provider.bundleSha256,bundleBlobSha1:provider.bundleBlobSha1,bundleBytes:provider.bundleBytes,operationIdentitySha256:provider.operationIdentitySha256,sourceHead:provider.sourceHead,revision:projection.revision,projectionSha256:projection.projectionSha256,previousPhaseReceiptSha256:null}};
  host.authorization={{schema:AUTH_SCHEMA,packageId:M.PACKAGE_ID,parentPackageId:M.PARENT_PACKAGE_ID,packageHead:provider.packageHead,packageTree:provider.packageTree,state:'ACTIVE',authorized:true,cancelled:false,sourceRegistrySha256:M.sourceRegistrySha256(),ownerDirective:OWNER_DIRECTIVE,authorityCardCommentId:AUTHORITY_CARD_COMMENT_ID,authorityScope:AUTHORITY_SCOPE,triggeredBy:provenance.triggeredBy,sessionId:provenance.sessionId,taskId:provenance.taskId,writerId:provenance.writerId,operationId:provenance.operationId,cancelToken:provenance.cancelToken,leaseToken:provenance.leaseToken,bundleSha256:provenance.bundleSha256,bundleBlobSha1:provenance.bundleBlobSha1,bundleBytes:provenance.bundleBytes,operationIdentitySha256:provenance.operationIdentitySha256,sourceHead:provenance.sourceHead,revision:provenance.revision,projectionSha256:provenance.projectionSha256,previousPhaseReceiptSha256:null,provenance}};
  p.currentFile.setSharedPluginData(NAMESPACE,ACTIVE_KEY,M.canonical({{schema:ACTIVE_SCHEMA,state:'ACTIVE',authorized:true,cancelled:false,sessionId:provenance.sessionId,taskId:provenance.taskId,writerId:provenance.writerId,operationId:provenance.operationId,packageId:M.PACKAGE_ID,packageHead:provider.packageHead,packageTree:provider.packageTree,triggeredBy:provenance.triggeredBy,ownerDirective:OWNER_DIRECTIVE,authorityCardCommentId:AUTHORITY_CARD_COMMENT_ID,authorityScope:AUTHORITY_SCOPE,cancelToken:provenance.cancelToken,leaseToken:provenance.leaseToken,leaseExpiresAt:provenance.leaseExpiresAt,bundleSha256:provenance.bundleSha256,bundleBlobSha1:provenance.bundleBlobSha1,bundleBytes:provenance.bundleBytes,operationIdentitySha256:provenance.operationIdentitySha256,sourceHead:provenance.sourceHead,revision:provenance.revision,projectionSha256:provenance.projectionSha256,previousPhaseReceiptSha256:null}}));
  return host;
}}
const PUBLIC_API=Object.freeze({{
  metadata:Object.freeze({{
    schema:'D0_PLUGIN_BUNDLE_V1',package_id:M.PACKAGE_ID,bundle_sha256_binding:'EXTERNAL_AUTHORIZATION_TUPLE',
    global_name:'{GLOBAL}',entrypoints:Object.freeze({{projection:'projection',execution:'execution',settlement:'settlement'}}),
    current_page_activation:true,max_creates_per_phase:3,replay_created:0,
    mutation_scope:'four existing media fills plus target-local string evidence',unknown_outcome:'DISTINCT_READ_ONLY_FOUR_TARGET_PROJECTION_NO_RETRY',
    embedded_assets:2
  }}),
  projection:(host)=>projectEventcardMediaPenpotR3(__withEmbeddedAssets(host),host&&host.authorization||null),
  execution:async(host)=>{{__withEmbeddedAssets(host);__assertBundleAuthorization(host);const receipt=await executeEventcardMediaPenpotR3(host,host.authorization);if(receipt&&receipt.terminal===true)host.receipt=receipt;return receipt;}},
  settlement:(host)=>readEventcardMediaPenpotSettlementR3(__withEmbeddedAssets(host),host&&host.receipt),
  conformance:Object.freeze({{
    createHost:async(seed)=>__createNativeConformanceHost(seed),
    prepareReplay:async(host,seed)=>({{penpot:seed.penpot,storage:seed.storage,exactPackageHead:host.exactPackageHead,exactPackageTree:host.exactPackageTree,exactBundleSha256:host.exactBundleSha256,exactBundleBytes:host.exactBundleBytes,authorization:host.authorization}}),
    strictStringProbe:async(host)=>{{const page=host.penpot.__seedPage('eventcard-media-string-probe');const values={{number:374,object:{{x:1}},boolean:true,null:null,undefined:void 0}},result={{string:'FAIL'}};__conformanceWrite(page,'374');result.string='PASS';for(const key of Object.keys(values)){{try{{__conformanceWrite(page,values[key]);result[key]='ACCEPTED';}}catch{{result[key]='REJECTED';}}}}return result;}}
  }}),
  constants:Object.freeze({{packageId:M.PACKAGE_ID,fileId:M.FILE_ID,pageId:M.PAGE_ID,collectionId:M.COLLECTION_ID,sourceAssets:M.SOURCE_ASSETS,providerIdentity:EXACT_PROVIDER_IDENTITY}}),
  internals:Object.freeze({{logic:M,{public_members}}})
}});
Object.defineProperty(global,'{GLOBAL}',{{value:PUBLIC_API,enumerable:true,configurable:false,writable:false}});
}})(globalThis);
"""

forbidden = [r'\brequire\s*\(', r'\bmodule\b', r'\bexports\b', r'\bprocess\b', r'\bBuffer\b', r'\bimport\s*\(', r'\bimport\s+', r'\bstructuredClone\s*\(', r'\bcrypto\.subtle\b', r'\b__d0BundleConformance\b']
for pattern in forbidden:
    if re.search(pattern, bundle):
        raise SystemExit(f'forbidden token in generated bundle: {pattern}')
OUTPUT.write_text(bundle)
print(OUTPUT)
