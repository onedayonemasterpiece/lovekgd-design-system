#!/usr/bin/env python3
"""Build the package-local, self-contained EventCard Paths Penpot bundle."""
from pathlib import Path
import re

HERE = Path(__file__).resolve().parent
LOGIC = HERE / 'eventcard_component_paths_linkage_r3.js'
RUNTIME = HERE / 'eventcard_component_paths_penpot_runtime_r3.js'
OUTPUT = HERE / 'eventcard_paths_penpot_standalone_bundle_v1.js'
GLOBAL = 'KenigEventsD0EventcardPathsR3StandaloneV4'

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

runtime = strip_header(RUNTIME.read_text()).replace('This module is inert', 'This source is inert')
runtime = runtime.replace("const M = require('./eventcard_component_paths_linkage_r3.js');\n\n", '')
export_match = re.search(r"\nmodule\.exports\s*=\s*\{([\s\S]*?)\n\};\s*$", runtime)
if not export_match:
    raise SystemExit('missing runtime export block')
public_members = export_match.group(1).strip()
runtime = runtime[:export_match.start()] + '\n'

bundle = f"""/* Generated deterministically by {Path(__file__).name}. Do not hand-edit. */
(function (global) {{
'use strict';
{SHA256}
const M = (() => {{
{logic}
}})();
{runtime}
function __assertBundleAuthorization(host) {{
  const auth = host && host.authorization;
  if (!host || typeof host.exactBundleSha256 !== 'string' || !/^[0-9a-f]{{64}}$/.test(host.exactBundleSha256) ||
      !Number.isInteger(host.exactBundleBytes) || host.exactBundleBytes <= 0 ||
      !auth || auth.bundleSha256 !== host.exactBundleSha256 || auth.bundleBytes !== host.exactBundleBytes ||
      !auth.provenance || auth.provenance.bundleSha256 !== host.exactBundleSha256 ||
      auth.provenance.bundleBytes !== host.exactBundleBytes) {{
    const error = new Error('PATHS_R3_BUNDLE_AUTHORIZATION_MISMATCH');
    error.code = 'PATHS_R3_BUNDLE_AUTHORIZATION_MISMATCH'; error.retryAllowed = false; throw error;
  }}
}}
const __CONFORMANCE_NS = 'd0-eventcard-paths-bundle-v1';
const __CONFORMANCE_KEY = 'stable';
function __conformanceWrite(node,value){{node.setSharedPluginData(__CONFORMANCE_NS,__CONFORMANCE_KEY,value);}}
async function __seedProductionHost(seed){{
  const p=seed.penpot,node=seed.pluginNode;p.currentFile.id=M.FILE_ID;p.currentFile.revn=188;
  const page=p.__seedPage(M.PAGE_ID);page.id=M.PAGE_ID;page.name='00 · Components · Free collection';
  const board=node(M.COLLECTION_ID,'board');board.name=M.COLLECTION_NAME;page.root.appendChild(board);const components=[];
  for(let index=0;index<M.SPECS.length;index+=1){{const spec=M.SPECS[index],main=node(spec.mainId||'main-'+index,'board'),component={{id:spec.componentId||'component-'+index,name:spec.displayName,path:M.PATHS[spec.group],mainInstance:()=>main}};main.name=M.PATHS[spec.group]+' / '+spec.displayName;main.component=()=>component;board.appendChild(main);components.push(component);}}
  for(let caseIndex=0;caseIndex<4;caseIndex+=1){{const main=components[14+caseIndex].mainInstance(),pool=caseIndex<2?components.slice(0,7):components.slice(7,14),selected=M.SPECS[14+caseIndex].linkedCount===7?pool:pool.filter((_,i)=>i!==4).slice(0,6);for(let i=0;i<selected.length;i+=1){{const linked=node('linked-'+caseIndex+'-'+i,'instance');linked.component=()=>selected[i];main.appendChild(linked);}}}}
  for(let i=0;i<17;i+=1){{const main=node('other-main-'+i,'board'),c={{id:'other-component-'+i,name:'other.component.'+i,path:'Protected / Other / '+i,mainInstance:()=>main}};main.name='other.main.'+i;main.component=()=>c;components.push(c);}}p.library.local.components.push(...components);
  const host={{penpot:p,storage:seed.storage,exactPackageHead:'a'.repeat(40),exactPackageTree:'b'.repeat(40),exactBundleSha256:'c'.repeat(64),exactBundleBytes:1,expectedState:'terminal',pageProfile:{{profileId:'free-collection.owner-review.v1',state:'BLOCKED_OWNER_REJECTED',allowedToMutatePenpot:false,profileSha256:'e'.repeat(64)}}}};
  const projection=await projectEventcardPathsPenpotR3(host,'terminal'),provenance={{sessionId:'session-01a0581e',taskId:'task-paths-recovery',writerId:'/root/publish_r2',triggeredBy:'d0-conformance-paths-recovery',cancelToken:'cancel-paths-recovery',leaseToken:'lease-paths-recovery',leaseExpiresAt:Date.now()+60000,packageId:M.PACKAGE_ID,packageHead:host.exactPackageHead,packageTree:host.exactPackageTree,pageProfileSha256:host.pageProfile.profileSha256,ownerDirective:OWNER_DIRECTIVE,authorityCardCommentId:AUTHORITY_CARD_COMMENT_ID,authorityScope:AUTHORITY_SCOPE,bundleSha256:host.exactBundleSha256,bundleBytes:host.exactBundleBytes,revision:projection.revision,projectionSha256:projection.projectionSha256}};
  host.authorization={{schema:AUTH_SCHEMA,packageId:M.PACKAGE_ID,parentPackageId:M.PARENT_PACKAGE_ID,packageHead:host.exactPackageHead,packageTree:host.exactPackageTree,state:'ACTIVE',authorized:true,cancelled:false,revision:projection.revision,projectionSha256:projection.projectionSha256,triggeredBy:provenance.triggeredBy,sessionId:provenance.sessionId,taskId:provenance.taskId,writerId:provenance.writerId,cancelToken:provenance.cancelToken,leaseToken:provenance.leaseToken,provenance,pageProfileSha256:provenance.pageProfileSha256,ownerDirective:OWNER_DIRECTIVE,authorityCardCommentId:AUTHORITY_CARD_COMMENT_ID,authorityScope:AUTHORITY_SCOPE,bundleSha256:host.exactBundleSha256,bundleBytes:host.exactBundleBytes}};
  p.currentFile.setSharedPluginData(ACTIVE_NAMESPACE,ACTIVE_KEY,M.canonical({{schema:ACTIVE_SCHEMA,state:'ACTIVE',authorized:true,cancelled:false,sessionId:provenance.sessionId,taskId:provenance.taskId,writerId:provenance.writerId,packageId:M.PACKAGE_ID,packageHead:host.exactPackageHead,packageTree:host.exactPackageTree,triggeredBy:provenance.triggeredBy,pageProfileSha256:provenance.pageProfileSha256,ownerDirective:OWNER_DIRECTIVE,authorityCardCommentId:AUTHORITY_CARD_COMMENT_ID,authorityScope:AUTHORITY_SCOPE,cancelToken:provenance.cancelToken,leaseToken:provenance.leaseToken,leaseExpiresAt:provenance.leaseExpiresAt,bundleSha256:provenance.bundleSha256,bundleBytes:provenance.bundleBytes,revision:provenance.revision,projectionSha256:provenance.projectionSha256}}));return host;
}}
async function __replayHost(host,seed){{return {{...host,storage:seed.storage,receipt:null}};}}
const PUBLIC_API = Object.freeze({{
  metadata: Object.freeze({{
    schema: 'D0_PLUGIN_BUNDLE_V1', package_id: M.PACKAGE_ID, bundle_sha256_binding: 'EXTERNAL_AUTHORIZATION_TUPLE',
    global_name: '{GLOBAL}',
    entrypoints: Object.freeze({{projection:'projection', execution:'execution', settlement:'settlement'}}),
    current_page_activation: true, max_creates_per_phase: 3, replay_created: 0, receipt_only_recovery: true,
    recovery_contract: Object.freeze({{expected_native_creates:0,expected_native_setters:0,physical_active_current_file:true,full_authorization_tuple:true,receipt:Object.freeze({{namespace:ACTIVE_NAMESPACE,key:RECEIPT_KEY,value_sha256:'76d637b82f34177b151a2511ff455f1b60949a549910e42f48333ffedb26c86d'}})}}),
    mutation_scope: 'receipt-only recovery; zero path setters', unknown_outcome: 'DISTINCT_READ_ONLY_PROJECTION_NO_RETRY'
  }}),
  projection: (host) => projectEventcardPathsPenpotR3(host, host && host.expectedState || 'any'),
  execution: async (host) => {{ __assertBundleAuthorization(host); const receipt = await executeEventcardPathsPenpotR3(host, host.authorization); host.receipt = receipt; return receipt; }},
  settlement: (host) => readEventcardPathsPenpotSettlementR3(host, host && host.receipt),
  conformance: Object.freeze({{
    createHost: __seedProductionHost,
    prepareReplay: __replayHost,
    strictStringProbe: async (host) => {{ const page=host.penpot.__seedPage('eventcard-paths-string-probe'); const values={{number:374,object:{{x:1}},boolean:true,null:null,undefined:void 0}},result={{string:'FAIL'}}; __conformanceWrite(page,'374');result.string='PASS';for(const key of Object.keys(values)){{try{{__conformanceWrite(page,values[key]);result[key]='ACCEPTED';}}catch{{result[key]='REJECTED';}}}}return result; }}
  }}),
  constants: Object.freeze({{ packageId:M.PACKAGE_ID, fileId:M.FILE_ID, pageId:M.PAGE_ID, collectionId:M.COLLECTION_ID }}),
  internals: Object.freeze({{ logic: M, {public_members} }})
}});
Object.defineProperty(global, '{GLOBAL}', {{value: PUBLIC_API, enumerable: true, configurable: false, writable: false}});
}})(globalThis);
"""

forbidden = [r'\brequire\s*\(', r'\bmodule\b', r'\bexports\b', r'\bprocess\b', r'\bBuffer\b', r'\bimport\s*\(', r'\bimport\s+']
for pattern in forbidden:
    if re.search(pattern, bundle):
        raise SystemExit(f'forbidden token in generated bundle: {pattern}')
OUTPUT.write_text(bundle)
print(OUTPUT)
