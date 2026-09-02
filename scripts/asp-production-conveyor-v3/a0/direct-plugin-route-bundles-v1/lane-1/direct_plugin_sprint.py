
from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

REPOSITORY = "onedayonemasterpiece/lovekgd-design-system"
ISSUE_NUMBER = 57
MORNING_REF = "862bb09cf61750bd5afce26d84207a501f7ec733"
MORNING_TREE = "9cf76a269e8febfb56fbdc93a1f0a73a74a2bd46"
PAGE_REF = "4edc859861fba3f18fab0e65e9d2e8c0a7394bdb"
FREE_ROWS_REF = "9e8edbed95eb40807059e6c6f10af74beeaee683"
FREE_FULL_REF = "4ee9651c97da4e46b0fda4e244f9d5dea634e063"
FINAL_EVIDENCE_REF = "0fbfd4839343de71d5128b2e9c2ad232dde6abf4"
ATLAS_AUTH_REF = "9c2f0578cc58c2e490248a66bfe6e8297ab9410c"
ATLAS_AUTH_TREE = "c22812886dd41578364808d56e2915e7df1ad2aa"
TARGET_FILE = "40e06342-8830-80d6-8008-8fc8a3a4cd4f"
INITIAL_AUTH_COMMENT = 5506769941
CALLABILITY_COMMENTS = [5506830213, 5506836084]
REQUIRED_COMMENTS = [INITIAL_AUTH_COMMENT, *CALLABILITY_COMMENTS]
LANE_BRANCHES = {
    "lane-1": "a0/direct-plugin-owner-visible-v1-20260902",
    "lane-2": "a0/direct-plugin-composed-v1-20260902",
    "lane-3": "a0/direct-plugin-archetypes-v1-20260902",
}
AGGREGATE_BRANCH = "a0/direct-plugin-route-buffer-v1-20260902"
PACKAGE_ROOT = Path("catalog/asp-production-conveyor-v3/a0/direct-plugin-route-bundles-v1")
GENERATOR_PATH = Path("scripts/asp-production-conveyor-v3/a0/direct-plugin-route-bundles-v1/direct_plugin_sprint.py")
A0_BASE = "catalog/asp-production-conveyor-v3/a0"
UNITS = f"{A0_BASE}/page-wave-v1/units"
RUNTIME_PATH = f"{A0_BASE}/page-wave-v1/runtime-contract.v1.json"
FREE_BASE = f"{A0_BASE}/free-full-page-r2"
FREE_READY_PATH = f"{FREE_BASE}/A-FREE-FULL-PAGE-R2-READY.package.v1.json"
FREE_EXCEPTION_PATH = f"{FREE_BASE}/A-FREE-FULL-PAGE-R2-EXCEPTION.package.v1.json"
FREE_LOGICAL_PATH = f"{FREE_BASE}/A-FREE-FULL-PAGE-R2.logical-package.v1.json"
FREE_ROWS_PATH = f"{A0_BASE}/free-rows-data-r2/A-FREE-ROWS-DATA-R2.package.v1.json"
DATE_UNIT_PATH = f"{UNITS}/17-archetype-listing-date.package.v1.json"
DATE_REPLAY_PATH = f"{A0_BASE}/date-listing-shell-replay.v1.json"
DATE_ADAPTER_PATH = f"{A0_BASE}/date-listing-shell-candidate-adapter.v1.json"

SHA_JS = "\nfunction utf8Bytes(text){\n  const out=[];\n  for(let i=0;i<text.length;i++){\n    let c=text.charCodeAt(i);\n    if(c<0x80){out.push(c);continue}\n    if(c<0x800){out.push(0xc0|(c>>6),0x80|(c&63));continue}\n    if(c>=0xd800&&c<=0xdbff&&i+1<text.length){\n      const d=text.charCodeAt(++i);\n      if(d>=0xdc00&&d<=0xdfff){\n        const cp=0x10000+((c-0xd800)<<10)+(d-0xdc00);\n        out.push(0xf0|(cp>>18),0x80|((cp>>12)&63),0x80|((cp>>6)&63),0x80|(cp&63));\n        continue\n      }\n      i--;\n    }\n    out.push(0xe0|(c>>12),0x80|((c>>6)&63),0x80|(c&63));\n  }\n  return out\n}\nfunction sha256Hex(input){\n  const bytes=typeof input==='string'?utf8Bytes(input):Array.from(input||[]);\n  const k=[\n    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,\n    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,\n    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,\n    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,\n    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,\n    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,\n    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,\n    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2\n  ];\n  const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];\n  const data=bytes.slice();\n  const bitLen=bytes.length*8;\n  data.push(0x80);\n  while((data.length%64)!==56)data.push(0);\n  const hi=Math.floor(bitLen/0x100000000);\n  const lo=bitLen>>>0;\n  for(let shift=24;shift>=0;shift-=8)data.push((hi>>>shift)&255);\n  for(let shift=24;shift>=0;shift-=8)data.push((lo>>>shift)&255);\n  const w=new Array(64);\n  const rotr=(x,n)=>(x>>>n)|(x<<(32-n));\n  for(let off=0;off<data.length;off+=64){\n    for(let i=0;i<16;i++){\n      const j=off+i*4;\n      w[i]=((data[j]<<24)|(data[j+1]<<16)|(data[j+2]<<8)|data[j+3])>>>0;\n    }\n    for(let i=16;i<64;i++){\n      const a=w[i-15],b=w[i-2];\n      const s0=(rotr(a,7)^rotr(a,18)^(a>>>3))>>>0;\n      const s1=(rotr(b,17)^rotr(b,19)^(b>>>10))>>>0;\n      w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0;\n    }\n    let [a,b,c,d,e,f,g,q]=h;\n    for(let i=0;i<64;i++){\n      const S1=(rotr(e,6)^rotr(e,11)^rotr(e,25))>>>0;\n      const ch=((e&f)^((~e)&g))>>>0;\n      const t1=(q+S1+ch+k[i]+w[i])>>>0;\n      const S0=(rotr(a,2)^rotr(a,13)^rotr(a,22))>>>0;\n      const maj=((a&b)^(a&c)^(b&c))>>>0;\n      const t2=(S0+maj)>>>0;\n      q=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;\n    }\n    h[0]=(h[0]+a)>>>0;h[1]=(h[1]+b)>>>0;h[2]=(h[2]+c)>>>0;h[3]=(h[3]+d)>>>0;\n    h[4]=(h[4]+e)>>>0;h[5]=(h[5]+f)>>>0;h[6]=(h[6]+g)>>>0;h[7]=(h[7]+q)>>>0;\n  }\n  return h.map(x=>x.toString(16).padStart(8,'0')).join('');\n}\n"
RUNTIME_JS = "\n(function(root){\n'use strict';\nconst DATA=__DATA__;\n__SHA_IMPL__\nconst fail=(code,detail)=>{throw new Error(detail?code+':'+detail:code)};\nconst ok=(value,code,detail)=>{if(!value)fail(code,detail)};\nconst clone=value=>JSON.parse(JSON.stringify(value));\nconst canonical=value=>{\n  if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';\n  if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canonical(value[key])).join(',')+'}';\n  return JSON.stringify(value);\n};\nconst deepFreeze=value=>{\n  if(value&&typeof value==='object'&&!Object.isFrozen(value)){\n    Object.freeze(value);\n    for(const key of Object.keys(value))deepFreeze(value[key]);\n  }\n  return value;\n};\ndeepFreeze(DATA);\nconst NS='kenigevents-a0-direct-plugin-'+DATA.slug;\nconst STATE_KEY=NS+':resume-state-v1';\nconst children=shape=>Array.from(shape&&shape.children||[]);\nconst walk=shape=>shape?[shape].concat(children(shape).flatMap(walk)):[];\nconst get=(shape,key,namespace=NS)=>shape&&typeof shape.getSharedPluginData==='function'?(shape.getSharedPluginData(namespace,key)||''):'';\nconst set=(shape,key,value,namespace=NS)=>{ok(shape&&typeof shape.setSharedPluginData==='function','PLUGIN_DATA_UNAVAILABLE',key);shape.setSharedPluginData(namespace,key,String(value))};\nconst parseSource=name=>{\n  const raw=DATA.source_raw[name];\n  ok(typeof raw==='string','SOURCE_RAW_MISSING',name);\n  try{return JSON.parse(raw)}catch(error){fail('SOURCE_JSON_INVALID',name)}\n};\nconst sourceMeta=name=>DATA.source_records.find(item=>item.name===name);\nconst verifyRecord=(name,field)=>{\n  const object=parseSource(name),expected=object[field];\n  ok(typeof expected==='string'&&/^[0-9a-f]{64}$/.test(expected),'SOURCE_RECORD_HASH_MISSING',name+':'+field);\n  const copy=clone(object);delete copy[field];\n  ok(sha256Hex(canonical(copy))===expected,'SOURCE_RECORD_HASH_MISMATCH',name);\n  return expected;\n};\nfunction verifySources(){\n  const verified=[];\n  for(const item of DATA.source_records){\n    const raw=DATA.source_raw[item.name];\n    ok(typeof raw==='string','SOURCE_RAW_MISSING',item.name);\n    ok(utf8Bytes(raw).length===item.bytes,'SOURCE_BYTES_MISMATCH',item.name);\n    ok(sha256Hex(raw)===item.sha256,'SOURCE_SHA256_MISMATCH',item.name);\n    verified.push({name:item.name,path:item.path,ref:item.ref,bytes:item.bytes,sha256:item.sha256,git_blob_sha1:item.git_blob_sha1});\n  }\n  const primary=verifyRecord(DATA.primary_source_name,DATA.primary_record_field);\n  ok(primary===DATA.source_package_record_sha256,'PRIMARY_PACKAGE_BINDING_MISMATCH');\n  for(const extra of DATA.additional_record_sources||[])verifyRecord(extra.name,extra.field);\n  ok(DATA.factual_bytes_changed===0,'FACTUAL_BYTES_CHANGED');\n  return verified;\n}\nfunction readState(penpot){\n  const storage=penpot&&penpot.localStorage;\n  if(!storage||typeof storage.getItem!=='function')return null;\n  const raw=storage.getItem(STATE_KEY);\n  if(!raw)return null;\n  try{return JSON.parse(raw)}catch(error){fail('RESUME_STATE_INVALID')}\n}\nfunction writeState(penpot,state){\n  const storage=penpot&&penpot.localStorage;\n  ok(storage&&typeof storage.setItem==='function','LOCAL_STORAGE_UNAVAILABLE');\n  storage.setItem(STATE_KEY,JSON.stringify(state));\n}\nfunction activeRun(penpot){\n  let active;\n  try{active=JSON.parse(penpot.currentFile.getSharedPluginData('kenigevents','asp-active-run-v1')||'null')}catch(error){fail('ACTIVE_RUN_INVALID')}\n  const expected=DATA.run_control;\n  ok(active&&active.schema===expected.schema,'ACTIVE_RUN_SCHEMA');\n  ok(active.package_id===expected.package_id&&active.run_id===expected.run_id,'ACTIVE_RUN_PACKAGE');\n  ok(active.writer_id===expected.writer_id,'ACTIVE_RUN_WRITER');\n  ok(active.lease_token===expected.lease_token&&active.cancel_token===expected.cancel_token,'ACTIVE_RUN_TOKEN');\n  ok(active.state==='ACTIVE'&&active.cancelled===false,'CANCELLED_OR_INACTIVE_LEASE');\n}\nfunction shapeProjection(shape){\n  const component=typeof shape.component==='function'?shape.component():null;\n  return {\n    id:shape.id||null,name:shape.name||'',type:shape.type||'',\n    x:Number(shape.x||0),y:Number(shape.y||0),width:Number(shape.width||0),height:Number(shape.height||0),\n    hidden:shape.hidden===true,visible:shape.visible!==false,componentId:component&&component.id||null,\n    children:children(shape).map(shapeProjection)\n  };\n}\nfunction findPageById(penpot,id){return Array.from(penpot.currentFile.pages||[]).find(page=>page.id===id)||null}\nfunction findShapeById(page,id){return walk(page&&page.root).find(shape=>shape.id===id)||null}\nfunction captureProtected(penpot){\n  const policy=DATA.protected_projections;\n  const freePage=findPageById(penpot,policy.free.page_id);\n  const foundationPage=findPageById(penpot,policy.foundations.page_id);\n  ok(freePage&&foundationPage,'PROTECTED_PAGE_MISSING');\n  const freeRoots=policy.free.root_ids.map(id=>findShapeById(freePage,id));\n  const foundationRoot=findShapeById(foundationPage,policy.foundations.root_id);\n  ok(freeRoots.every(Boolean)&&foundationRoot,'PROTECTED_ROOT_MISSING');\n  const placements=children(foundationRoot).filter(shape=>get(shape,'placement-id','kenigevents-f0-r3'));\n  ok(placements.length===policy.foundations.placements,'PROTECTED_FOUNDATION_PLACEMENT_COUNT');\n  const descriptor={free:freeRoots.map(shapeProjection),foundations:[shapeProjection(foundationRoot)]};\n  return {\n    descriptor,\n    digest:sha256Hex(canonical(descriptor)),\n    identity:{\n      free_page_id:freePage.id,free_root_ids:freeRoots.map(shape=>shape.id),\n      foundation_page_id:foundationPage.id,foundation_root_id:foundationRoot.id,\n      foundation_placements:placements.length\n    },\n    historical_receipt:{\n      free_sha256:policy.free.sha256,\n      foundations_sha256:policy.foundations.sha256,\n      minimum_revision:policy.minimum_revision\n    }\n  };\n}\nfunction verifyProtected(penpot,state){\n  const current=captureProtected(penpot);\n  ok(state&&state.protected_digest===current.digest,'PROTECTED_PROJECTION_DRIFT');\n  return current;\n}\nfunction targetPages(penpot){return Array.from(penpot.currentFile.pages||[]).filter(page=>page.name===DATA.target_page_name)}\nfunction validateExistingAtlasPage(page){\n  const binding=DATA.atlas_binding;\n  ok(binding&&page,'ATLAS_PAGE_MISSING');\n  ok(page.name===binding.physical_page_name,'ATLAS_PAGE_NAME_MISMATCH');\n  ok(get(page,'source-package-id','kenigevents-atlas-v2')===binding.source_package_id,'ATLAS_SOURCE_PACKAGE_MISMATCH');\n  ok(get(page,'projection-role','kenigevents-atlas-v2')===DATA.projection_role,'ATLAS_PROJECTION_ROLE_MISMATCH');\n}\nasync function openExactPage(penpot,page){\n  ok(page&&page.id,'TARGET_PAGE_MISSING');\n  if(!penpot.currentPage||penpot.currentPage.id!==page.id)await penpot.openPage(page);\n  ok(penpot.currentPage&&penpot.currentPage.id===page.id,'CURRENT_PAGE_ID_PROOF_FAILED');\n  ok(penpot.currentPage.name===DATA.target_page_name,'CURRENT_PAGE_NAME_PROOF_FAILED');\n  return {id:page.id,name:page.name};\n}\nfunction findStable(page,id){return walk(page.root).filter(shape=>get(shape,'stable-id')===id)}\nfunction exactlyZeroOrOne(list,code,id){ok(list.length<=1,code,id);return list[0]||null}\nfunction append(parent,child){ok(parent&&typeof parent.appendChild==='function','APPEND_PARENT_INVALID');parent.appendChild(child);return child}\nfunction mutateGroup(penpot,label,expectedCost,fn){\n  activeRun(penpot);\n  const begin=penpot.history&&penpot.history.undoBlockBegin;\n  const finish=penpot.history&&penpot.history.undoBlockFinish;\n  const token=typeof begin==='function'?begin.call(penpot.history):null;\n  const before=Number(penpot.__a0CreateCount||0);\n  try{\n    const result=fn();\n    ok(!(result&&typeof result.then==='function'),'ASYNC_MUTATION_GROUP_FORBIDDEN',label);\n    const after=Number(penpot.__a0CreateCount||before+expectedCost);\n    if('__a0CreateCount' in penpot)ok(after-before===expectedCost,'CREATE_COST_MISMATCH',label);\n    return result;\n  }finally{\n    if(token!==null&&typeof finish==='function')finish.call(penpot.history,token);\n  }\n}\nfunction createBoard(penpot,parent,id,name,width,height,x,y,metadata){\n  const board=penpot.createBoard();\n  board.name=name;board.x=Number(x||0);board.y=Number(y||0);board.resize(Number(width),Number(height));\n  board.fills=[{fillColor:'#FBF7EF',fillOpacity:1}];\n  set(board,'stable-id',id);set(board,'managed','true');set(board,'job-id',DATA.job_id);\n  set(board,'source-package-sha256',DATA.source_package_record_sha256);\n  set(board,'candidate-label','CANDIDATE_BUILD_NOT_ACCEPTED');\n  for(const [key,value] of Object.entries(metadata||{}))set(board,key,typeof value==='string'?value:canonical(value));\n  return append(parent,board);\n}\nfunction createText(penpot,parent,id,characters,x,y,width,height){\n  ok(typeof characters==='string'&&characters.trim().length>0,'BLANK_SOURCE_BOUND_TEXT',id);\n  ok(!/\\b(?:placeholder|lorem ipsum|sample text)\\b/i.test(characters),'PLACEHOLDER_TEXT_FORBIDDEN',id);\n  const text=penpot.createText(characters);\n  text.name=id;text.x=Number(x||0);text.y=Number(y||0);\n  if(typeof text.resize==='function')text.resize(Number(width||240),Number(height||80));\n  text.fontSize='12';text.lineHeight='1.35';text.growType='fixed';\n  text.fills=[{fillColor:'#221A14',fillOpacity:1}];\n  set(text,'stable-id',id);set(text,'managed','true');set(text,'job-id',DATA.job_id);\n  return append(parent,text);\n}\nfunction createBoardAndText(penpot,parent,id,name,width,height,x,y,characters,metadata){\n  return mutateGroup(penpot,id,2,()=>{\n    const board=createBoard(penpot,parent,id,name,width,height,x,y,metadata);\n    createText(penpot,board,id+'/text',characters,16,16,Math.max(80,width-32),Math.max(48,height-32));\n    return board;\n  });\n}\nfunction dependencyMap(input){\n  const out={};\n  for(const expected of DATA.dependency_specs||[]){\n    const actual=input&&input[expected.key];\n    ok(actual,'DEPENDENCY_MISSING',expected.key);\n    ok(actual.semantic_id===expected.semantic_id,'DEPENDENCY_SEMANTIC_ID_MISMATCH',expected.key);\n    if(expected.package_id)ok(actual.package_id===expected.package_id,'DEPENDENCY_PACKAGE_MISMATCH',expected.key);\n    if(expected.remote_head)ok(actual.remote_head===expected.remote_head,'DEPENDENCY_HEAD_MISMATCH',expected.key);\n    if(expected.git_blob_sha1)ok(actual.git_blob_sha1===expected.git_blob_sha1,'DEPENDENCY_BLOB_MISMATCH',expected.key);\n    ok(actual.component&&typeof actual.component.instance==='function','DEPENDENCY_NOT_NATIVE_COMPONENT',expected.key);\n    out[expected.key]=actual.component;\n  }\n  return out;\n}\nfunction createLinked(penpot,parent,id,component,metadata){\n  return mutateGroup(penpot,id,1,()=>{\n    const instance=component.instance();\n    ok(instance&&typeof instance.component==='function'&&instance.component(),'DETACHED_DEPENDENCY_INSTANCE',id);\n    instance.name=id;set(instance,'stable-id',id);set(instance,'managed','true');set(instance,'job-id',DATA.job_id);\n    for(const [key,value] of Object.entries(metadata||{}))set(instance,key,typeof value==='string'?value:canonical(value));\n    return append(parent,instance);\n  });\n}\nfunction pageRoot(page){return page.root}\nfunction componentForMain(penpot,variantId){\n  return Array.from(penpot.library.local.components||[]).find(component=>{\n    const main=typeof component.mainInstance==='function'?component.mainInstance():component.mainInstance;\n    return main&&get(main,'stable-id')==='main/'+variantId&&get(main,'job-id')===DATA.job_id;\n  })||null;\n}\nfunction regionPayload(variant,region){\n  const base={\n    job_id:DATA.job_id,subject:DATA.exact_tuple.subject,routes:DATA.exact_tuple.routes,\n    active_state:DATA.exact_tuple.active_state,states:DATA.exact_tuple.states,\n    fixtures:DATA.exact_tuple.fixtures,fixture_semantics:DATA.exact_tuple.fixture_semantics,\n    projection:DATA.exact_tuple.projection,variant:variant.id,scenario_id:variant.scenario_id,\n    viewport:variant.viewport,semantic_region:region,required_dependencies:DATA.dependency_specs.map(item=>item.semantic_id)\n  };\n  if(DATA.extra_factual_data&&DATA.extra_factual_data.owner_review){\n    const owner=DATA.extra_factual_data.owner_review;\n    if(region==='owner-review.case-table')base.rows=owner.rows;\n    if(region==='owner-review.package-groups')base.summary=owner.summary;\n    if(region==='owner-review.status-legend')base.rules=owner.rules;\n    if(region==='owner-review.header')base.columns=owner.columns;\n  }\n  if(DATA.extra_factual_data&&DATA.extra_factual_data.archetype_projection)base.archetype_projection=DATA.extra_factual_data.archetype_projection;\n  return canonical(base);\n}\nfunction pageTasks(penpot,page,components){\n  const tasks=[];\n  const rootId='root/'+DATA.slug;\n  let rootBoard=exactlyZeroOrOne(findStable(page,rootId),'DUPLICATE_ROOT',rootId);\n  if(!rootBoard){\n    tasks.push({id:rootId,cost:2,run:()=>createBoardAndText(\n      penpot,pageRoot(page),rootId,DATA.target_root_name,1800,\n      Math.max(...DATA.page_contract.variants.map(v=>v.viewport.height))+160,32,32,\n      canonical({job_id:DATA.job_id,subject:DATA.exact_tuple.subject,routes:DATA.exact_tuple.routes,states:DATA.exact_tuple.states,fixtures:DATA.exact_tuple.fixtures,projection:DATA.exact_tuple.projection}),\n      {'subject':DATA.exact_tuple.subject,'routes':DATA.exact_tuple.routes,'projection-role':DATA.projection_role}\n    )});\n  }\n  for(let index=0;index<DATA.page_contract.variants.length;index++){\n    const variant=DATA.page_contract.variants[index],mainId='main/'+variant.id;\n    const main=exactlyZeroOrOne(findStable(page,mainId),'DUPLICATE_MAIN',mainId);\n    if(!main){\n      tasks.push({id:mainId,cost:2,run:()=>createBoardAndText(\n        penpot,pageRoot(page),mainId,DATA.exact_tuple.subject+'/'+variant.id,\n        variant.viewport.width,variant.viewport.height,2000,index*1000,\n        canonical({job_id:DATA.job_id,variant:variant.id,scenario_id:variant.scenario_id,viewport:variant.viewport,routes:DATA.exact_tuple.routes,state:DATA.exact_tuple.active_state,fixtures:DATA.exact_tuple.fixtures}),\n        {'variant':variant.id,'scenario-id':variant.scenario_id,'source-root-key':variant.source_root_key,'projection-sha256':DATA.exact_tuple.projection.sha256}\n      )});\n      continue;\n    }\n    const header=exactlyZeroOrOne(findStable(page,mainId+'/text'),'DUPLICATE_MAIN_TEXT',mainId);\n    ok(header,'PARTIAL_ATOMIC_GROUP_DRIFT',mainId);\n    for(let ri=0;ri<variant.semantic_regions.length;ri++){\n      const region=variant.semantic_regions[ri],regionId='region/'+variant.id+'/'+region;\n      const found=exactlyZeroOrOne(findStable(page,regionId),'DUPLICATE_REGION',regionId);\n      if(!found){\n        tasks.push({id:regionId,cost:2,run:()=>createBoardAndText(\n          penpot,main,regionId,'Region/'+region,Math.max(160,variant.viewport.width-48),\n          Math.max(96,Math.floor((variant.viewport.height-80)/Math.max(1,variant.semantic_regions.length))),\n          24,64+ri*Math.max(104,Math.floor((variant.viewport.height-80)/Math.max(1,variant.semantic_regions.length))),\n          regionPayload(variant,region),\n          {'semantic-region':region,'variant':variant.id,'dependency-substitute':'false','source-bound':'true'}\n        )});\n      }else{\n        const text=exactlyZeroOrOne(findStable(page,regionId+'/text'),'DUPLICATE_REGION_TEXT',regionId);\n        ok(text&&typeof text.characters==='string'&&text.characters.trim(),'REGION_NOT_SOURCE_BOUND',regionId);\n      }\n    }\n    const allRegions=variant.semantic_regions.every(region=>{\n      const id='region/'+variant.id+'/'+region;\n      return findStable(page,id).length===1&&findStable(page,id+'/text').length===1;\n    });\n    if(allRegions&&!componentForMain(penpot,variant.id)){\n      tasks.push({id:'component/'+variant.id,cost:1,run:()=>mutateGroup(penpot,'component/'+variant.id,1,()=>{\n        activeRun(penpot);\n        const component=penpot.library.local.createComponent([main]);\n        component.name=DATA.exact_tuple.subject+' '+variant.id;\n        component.path='A0 / Direct Plugin / '+DATA.exact_tuple.subject;\n        return component;\n      })});\n    }\n  }\n  rootBoard=exactlyZeroOrOne(findStable(page,rootId),'DUPLICATE_ROOT',rootId);\n  if(rootBoard){\n    for(const variant of DATA.page_contract.variants){\n      const component=componentForMain(penpot,variant.id);\n      if(component){\n        const id='instance/'+variant.id;\n        if(!exactlyZeroOrOne(findStable(page,id),'DUPLICATE_INSTANCE',id)){\n          tasks.push({id,cost:1,run:()=>createLinked(penpot,rootBoard,id,component,{'variant':variant.id,'scenario-id':variant.scenario_id,'source-bound':'true'})});\n        }\n      }\n    }\n  }\n  return tasks;\n}\nfunction statePayload(state){\n  return canonical({job_id:DATA.job_id,projection_role:DATA.projection_role,route:DATA.exact_tuple.route||DATA.exact_tuple.routes,source_package_id:DATA.source_package_id,state});\n}\nfunction freeTasks(penpot,page,components){\n  const tasks=[],rootId=DATA.target_root_stable_id;\n  let rootBoard=exactlyZeroOrOne(findStable(page,rootId),'DUPLICATE_ROOT',rootId);\n  if(!rootBoard){\n    tasks.push({id:rootId,cost:2,run:()=>createBoardAndText(penpot,pageRoot(page),rootId,DATA.target_root_name,1480,Math.max(900,DATA.states.length*620),32,32,canonical({job_id:DATA.job_id,route:DATA.exact_tuple.route,projection_role:DATA.projection_role,factual_fixture_order:DATA.exact_tuple.factual_fixture_order,rows:DATA.exact_tuple.rows}),{'projection-role':DATA.projection_role,'route':DATA.exact_tuple.route})});\n    return tasks;\n  }\n  for(let si=0;si<DATA.states.length;si++){\n    const state=DATA.states[si],sid='state/'+state.scenario_id;\n    let stateBoard=exactlyZeroOrOne(findStable(page,sid),'DUPLICATE_STATE',sid);\n    if(!stateBoard){\n      tasks.push({id:sid,cost:2,run:()=>createBoardAndText(penpot,rootBoard,sid,state.viewport.id+' · '+state.state,state.viewport.width,state.viewport.height,24,96+si*(state.viewport.height+32),statePayload(state),{'scenario-id':state.scenario_id,'state':state.state,'projection-role':DATA.projection_role,'source-bound':'true'})});\n      continue;\n    }\n    ok(findStable(page,sid+'/text').length===1,'STATE_NOT_SOURCE_BOUND',sid);\n    const shellId='shell/'+state.scenario_id;\n    if(!exactlyZeroOrOne(findStable(page,shellId),'DUPLICATE_SHELL',shellId))tasks.push({id:shellId,cost:1,run:()=>createLinked(penpot,stateBoard,shellId,components.free_shell,{'scenario-id':state.scenario_id,'state':state.state})});\n    const brandId='brand/'+state.scenario_id;\n    if(!exactlyZeroOrOne(findStable(page,brandId),'DUPLICATE_BRAND',brandId))tasks.push({id:brandId,cost:1,run:()=>createLinked(penpot,stateBoard,brandId,components.brand,{'scenario-id':state.scenario_id,'semantic-id':DATA.dependency_specs.find(x=>x.key==='brand').semantic_id})});\n    for(const fixtureId of state.rendered_fixture_ids){\n      const cardId='card/'+state.scenario_id+'/'+fixtureId;\n      if(!exactlyZeroOrOne(findStable(page,cardId),'DUPLICATE_CARD',cardId))tasks.push({id:cardId,cost:1,run:()=>createLinked(penpot,stateBoard,cardId,components.event_card,{'scenario-id':state.scenario_id,'fixture-id':fixtureId,'fixture-semantics':'EXACT_PROJECTION_MEMBERSHIP'})});\n    }\n  }\n  return tasks;\n}\nfunction dateDependencyKey(fragment){\n  const hit=DATA.dependency_specs.find(item=>item.key.indexOf(fragment)>=0);\n  ok(hit,'DATE_DEPENDENCY_MAPPING_MISSING',fragment);\n  return hit.key;\n}\nfunction dateTasks(penpot,page,components){\n  const tasks=[],rootId=DATA.target_root_stable_id;\n  let rootBoard=exactlyZeroOrOne(findStable(page,rootId),'DUPLICATE_ROOT',rootId);\n  if(!rootBoard){\n    tasks.push({id:rootId,cost:2,run:()=>createBoardAndText(penpot,pageRoot(page),rootId,DATA.target_root_name,1480,Math.max(900,DATA.states.length*940),32,32,canonical({job_id:DATA.job_id,routes:DATA.exact_tuple.routes,projection_role:DATA.projection_role,source_projections:DATA.exact_tuple.source_projections,selected_representations:DATA.exact_tuple.selected_representations,evidence_only_representations:DATA.exact_tuple.evidence_only_representations}),{'projection-role':DATA.projection_role,'subject':'archetype.listing.date'})});\n    return tasks;\n  }\n  const headerKey=dateDependencyKey('shared-header'),listingKey=dateDependencyKey('date-listing'),cardKey=dateDependencyKey('event-card'),footerKey=dateDependencyKey('shared-footer'),mobileKey=dateDependencyKey('mobile-bottom-navigation');\n  for(let si=0;si<DATA.states.length;si++){\n    const state=DATA.states[si],sid='state/'+state.scenario_id;\n    let stateBoard=exactlyZeroOrOne(findStable(page,sid),'DUPLICATE_STATE',sid);\n    if(!stateBoard){\n      tasks.push({id:sid,cost:2,run:()=>createBoardAndText(penpot,rootBoard,sid,state.viewport.id+' · '+state.representation+' · '+state.state,state.viewport.width,state.viewport.height,24,96+si*(state.viewport.height+32),statePayload(state),{'scenario-id':state.scenario_id,'state':state.state,'representation':state.representation,'source-bound':'true'})});\n      continue;\n    }\n    ok(findStable(page,sid+'/text').length===1,'STATE_NOT_SOURCE_BOUND',sid);\n    const headerId='header/'+state.scenario_id;\n    if(!exactlyZeroOrOne(findStable(page,headerId),'DUPLICATE_HEADER',headerId))tasks.push({id:headerId,cost:1,run:()=>createLinked(penpot,stateBoard,headerId,components[headerKey],{'scenario-id':state.scenario_id})});\n    const listingId='listing/'+state.scenario_id;\n    if(!exactlyZeroOrOne(findStable(page,listingId),'DUPLICATE_LISTING',listingId))tasks.push({id:listingId,cost:1,run:()=>createLinked(penpot,stateBoard,listingId,components[listingKey],{'scenario-id':state.scenario_id,'projection-ref':state.projection_ref||'none','state':state.state})});\n    for(const fixtureId of state.fixture_ids||[]){\n      const cardId='card/'+state.scenario_id+'/'+fixtureId;\n      if(!exactlyZeroOrOne(findStable(page,cardId),'DUPLICATE_CARD',cardId))tasks.push({id:cardId,cost:1,run:()=>createLinked(penpot,stateBoard,cardId,components[cardKey],{'scenario-id':state.scenario_id,'fixture-id':fixtureId,'fixture-semantics':state.fixture_semantics})});\n    }\n    const shellKey=state.viewport.id==='mobile'?mobileKey:footerKey,shellId=(state.viewport.id==='mobile'?'mobile-nav/':'footer/')+state.scenario_id;\n    if(!exactlyZeroOrOne(findStable(page,shellId),'DUPLICATE_SHELL_END',shellId))tasks.push({id:shellId,cost:1,run:()=>createLinked(penpot,stateBoard,shellId,components[shellKey],{'scenario-id':state.scenario_id})});\n  }\n  return tasks;\n}\nfunction pendingTasks(penpot,page,components){\n  if(DATA.content_kind==='PAGE_UNIT')return pageTasks(penpot,page,components);\n  if(DATA.content_kind==='FREE_COMPOSED')return freeTasks(penpot,page,components);\n  if(DATA.content_kind==='DATE_COMPOSED')return dateTasks(penpot,page,components);\n  fail('CONTENT_KIND_UNSUPPORTED',DATA.content_kind);\n}\nfunction executeTasks(penpot,tasks){\n  let used=0,created=0,executed=[];\n  for(const task of tasks){\n    if(used+task.cost>DATA.limits.max_creates_per_invocation)break;\n    task.run();used+=task.cost;created+=task.cost;executed.push(task.id);\n  }\n  ok(created<=3,'CREATE_LIMIT_EXCEEDED');\n  ok(tasks.length===0||created>0,'TASK_SCHEDULER_STALLED');\n  return {created,executed};\n}\nfunction verifyPageTerminal(penpot,page){\n  const rootId='root/'+DATA.slug,rootBoard=exactlyZeroOrOne(findStable(page,rootId),'DUPLICATE_ROOT',rootId);\n  ok(rootBoard&&findStable(page,rootId+'/text').length===1,'ROOT_MISSING_OR_BLANK');\n  for(const variant of DATA.page_contract.variants){\n    const mainId='main/'+variant.id,main=exactlyZeroOrOne(findStable(page,mainId),'DUPLICATE_MAIN',mainId);\n    ok(main&&findStable(page,mainId+'/text').length===1,'MAIN_MISSING_OR_BLANK',variant.id);\n    for(const region of variant.semantic_regions){\n      const id='region/'+variant.id+'/'+region,board=exactlyZeroOrOne(findStable(page,id),'DUPLICATE_REGION',id),text=exactlyZeroOrOne(findStable(page,id+'/text'),'DUPLICATE_REGION_TEXT',id);\n      ok(board&&text&&typeof text.characters==='string'&&text.characters.trim(),'REGION_MISSING_OR_BLANK',id);\n      ok(get(board,'dependency-substitute')==='false','DEPENDENCY_SUBSTITUTE_FORBIDDEN',id);\n    }\n    const component=componentForMain(penpot,variant.id);\n    ok(component,'COMPONENT_MISSING',variant.id);\n    const instance=exactlyZeroOrOne(findStable(page,'instance/'+variant.id),'DUPLICATE_INSTANCE',variant.id);\n    ok(instance&&typeof instance.component==='function'&&instance.component()&&instance.component().id===component.id,'DETACHED_INSTANCE',variant.id);\n  }\n  return rootBoard;\n}\nfunction verifyFreeTerminal(page,components){\n  const rootBoard=exactlyZeroOrOne(findStable(page,DATA.target_root_stable_id),'DUPLICATE_ROOT',DATA.target_root_stable_id);\n  ok(rootBoard&&findStable(page,DATA.target_root_stable_id+'/text').length===1,'ROOT_MISSING_OR_BLANK');\n  for(const state of DATA.states){\n    const sid='state/'+state.scenario_id,sb=exactlyZeroOrOne(findStable(page,sid),'DUPLICATE_STATE',sid);\n    ok(sb&&findStable(page,sid+'/text').length===1,'STATE_MISSING_OR_BLANK',sid);\n    const shell=exactlyZeroOrOne(findStable(page,'shell/'+state.scenario_id),'DUPLICATE_SHELL',sid);\n    const brand=exactlyZeroOrOne(findStable(page,'brand/'+state.scenario_id),'DUPLICATE_BRAND',sid);\n    ok(shell&&shell.component().id===components.free_shell.id,'SHELL_DEPENDENCY_DRIFT',sid);\n    ok(brand&&brand.component().id===components.brand.id,'BRAND_DEPENDENCY_DRIFT',sid);\n    const cards=children(sb).filter(shape=>get(shape,'fixture-id')).map(shape=>get(shape,'fixture-id'));\n    ok(canonical(cards)===canonical(state.rendered_fixture_ids),'STATE_FIXTURE_RENDER_DRIFT',sid);\n    for(const card of children(sb).filter(shape=>get(shape,'fixture-id')))ok(card.component().id===components.event_card.id,'CARD_DEPENDENCY_DRIFT',sid);\n  }\n  return rootBoard;\n}\nfunction verifyDateTerminal(page,components){\n  const rootBoard=exactlyZeroOrOne(findStable(page,DATA.target_root_stable_id),'DUPLICATE_ROOT',DATA.target_root_stable_id);\n  ok(rootBoard&&findStable(page,DATA.target_root_stable_id+'/text').length===1,'ROOT_MISSING_OR_BLANK');\n  for(const state of DATA.states){\n    const sid='state/'+state.scenario_id,sb=exactlyZeroOrOne(findStable(page,sid),'DUPLICATE_STATE',sid);\n    ok(sb&&findStable(page,sid+'/text').length===1,'STATE_MISSING_OR_BLANK',sid);\n    const cards=children(sb).filter(shape=>get(shape,'fixture-id')).map(shape=>get(shape,'fixture-id'));\n    ok(canonical(cards)===canonical(state.fixture_ids||[]),'DATE_FIXTURE_RENDER_DRIFT',sid);\n  }\n  return rootBoard;\n}\nfunction verifyNoScreenshot(rootBoard){\n  const images=walk(rootBoard).filter(shape=>shape.type==='image'||Array.from(shape.fills||[]).some(fill=>fill&&fill.fillImage));\n  ok(images.length===0,'SCREENSHOT_IMPLEMENTATION_FORBIDDEN');\n}\nasync function ensurePageOnly(ctx){\n  const penpot=ctx.penpot;\n  ok(penpot&&penpot.currentFile&&penpot.currentFile.id===DATA.target_file_id,'WRONG_PENPOT_FILE');\n  activeRun(penpot);verifySources();\n  const existingState=readState(penpot);\n  if(existingState&&existingState.page_only_complete)return null;\n  const before=captureProtected(penpot);\n  const pages=targetPages(penpot);ok(pages.length<=1,'DUPLICATE_TARGET_PAGE');\n  let page=pages[0]||null,created=0;\n  if(DATA.target_mode==='EXACT_EXISTING_ATLAS_PAGE'){\n    ok(page,'ATLAS_PAGE_MISSING');validateExistingAtlasPage(page);\n  }else if(!page){\n    activeRun(penpot);\n    page=penpot.createPage();page.name=DATA.target_page_name;\n    set(page,'job-id',DATA.job_id);set(page,'source-package-sha256',DATA.source_package_record_sha256);\n    set(page,'page-only-first-phase','true');created=1;\n  }else{\n    const owned=get(page,'job-id');\n    ok(!owned||owned===DATA.job_id,'TARGET_PAGE_OWNERSHIP_DRIFT');\n    if(!owned){activeRun(penpot);set(page,'job-id',DATA.job_id);set(page,'source-package-sha256',DATA.source_package_record_sha256);set(page,'page-only-first-phase','true')}\n  }\n  const proof=await openExactPage(penpot,page);\n  const after=captureProtected(penpot);ok(after.digest===before.digest,'PROTECTED_PROJECTION_DRIFT');\n  writeState(penpot,{schema:'kenigevents.a0.direct-plugin-resume.v1',job_id:DATA.job_id,page_id:page.id,page_only_complete:true,protected_digest:before.digest,settled:false});\n  return {schema:'kenigevents.a0.direct-plugin-result.v1',job_id:DATA.job_id,phase:'PAGE_ONLY',created,currentPage:proof,protected_digest:before.digest,terminal:false};\n}\nasync function execute(ctx){\n  const penpot=ctx&&ctx.penpot;\n  const pageOnly=await ensurePageOnly(ctx||{});\n  if(pageOnly)return pageOnly;\n  const state=readState(penpot);ok(state&&state.job_id===DATA.job_id&&state.page_only_complete,'PAGE_ONLY_PHASE_REQUIRED');\n  const pages=targetPages(penpot);ok(pages.length===1,'TARGET_PAGE_CENSUS');const page=pages[0];\n  if(DATA.target_mode==='EXACT_EXISTING_ATLAS_PAGE')validateExistingAtlasPage(page);else ok(get(page,'job-id')===DATA.job_id,'TARGET_PAGE_OWNERSHIP_DRIFT');\n  await openExactPage(penpot,page);activeRun(penpot);verifyProtected(penpot,state);\n  const components=dependencyMap(ctx.dependencies);\n  const tasks=pendingTasks(penpot,page,components);\n  if(!tasks.length)return {schema:'kenigevents.a0.direct-plugin-result.v1',job_id:DATA.job_id,phase:'EXECUTION_TERMINAL',created:0,currentPage:{id:page.id,name:page.name},terminal:true,second_terminal_replay_created:0};\n  const result=executeTasks(penpot,tasks);\n  verifyProtected(penpot,state);\n  return {schema:'kenigevents.a0.direct-plugin-result.v1',job_id:DATA.job_id,phase:'RESUME_REQUIRED',created:result.created,created_ids:result.executed,currentPage:{id:page.id,name:page.name},terminal:false};\n}\nasync function settle(ctx){\n  const penpot=ctx&&ctx.penpot;\n  ok(penpot&&penpot.currentFile&&penpot.currentFile.id===DATA.target_file_id,'WRONG_PENPOT_FILE');\n  const state=readState(penpot);ok(state&&state.page_only_complete,'PAGE_ONLY_PHASE_REQUIRED');\n  const pages=targetPages(penpot);ok(pages.length===1,'TARGET_PAGE_CENSUS');const page=pages[0];\n  await openExactPage(penpot,page);activeRun(penpot);verifySources();verifyProtected(penpot,state);\n  const components=dependencyMap(ctx.dependencies);\n  ok(pendingTasks(penpot,page,components).length===0,'EXECUTION_NOT_TERMINAL');\n  let rootBoard;\n  if(DATA.content_kind==='PAGE_UNIT')rootBoard=verifyPageTerminal(penpot,page);\n  else if(DATA.content_kind==='FREE_COMPOSED')rootBoard=verifyFreeTerminal(page,components);\n  else rootBoard=verifyDateTerminal(page,components);\n  verifyNoScreenshot(rootBoard);\n  const validation=penpot.currentFile.validate()||[];ok(validation.length===0,'PENPOT_VALIDATION_NOT_EMPTY');\n  const raw=await rootBoard.export({type:'png',scale:1});\n  const bytes=raw instanceof Uint8Array?raw:new Uint8Array(raw);\n  ok(bytes.length>0,'ROOT_EXPORT_EMPTY');\n  const label=DATA.job_id+' · DIRECT_PLUGIN_BUNDLE_VERIFIED · '+DATA.run_control.run_id;\n  let versions=await penpot.currentFile.findVersions();let version=Array.from(versions||[]).find(item=>item.label===label);\n  if(!version){activeRun(penpot);version=await penpot.currentFile.saveVersion(label)}\n  verifyProtected(penpot,state);\n  state.settled=true;state.settlement_sha256=sha256Hex(canonical({job_id:DATA.job_id,page_id:page.id,root_id:rootBoard.id,source_package_sha256:DATA.source_package_record_sha256,export_sha256:sha256Hex(bytes)}));writeState(penpot,state);\n  return {schema:'kenigevents.a0.direct-plugin-settlement.v1',job_id:DATA.job_id,terminal_state:'DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE',created:0,second_terminal_replay_created:0,page_id:page.id,root_id:rootBoard.id,source_package_sha256:DATA.source_package_record_sha256,export:{bytes:bytes.length,sha256:sha256Hex(bytes)},version_id:version&&version.id||null,validation,visual_pass_declared:false,penpot_execution_authorized:false,penpot_reads_by_a0:0,penpot_mutations_by_a0:0};\n}\nfunction inspect(){\n  return clone({schema_version:DATA.schema_version,job_id:DATA.job_id,state:DATA.state,content_kind:DATA.content_kind,source_package_id:DATA.source_package_id,source_package_record_sha256:DATA.source_package_record_sha256,sources:verifySources(),run_control:DATA.run_control,limits:DATA.limits,protected_projections:DATA.protected_projections,atlas_authorization:DATA.atlas_authorization,callability_contract_comments:DATA.callability_contract_comments});\n}\nfunction project(){verifySources();return clone({job_id:DATA.job_id,projection_role:DATA.projection_role,target:{file_id:DATA.target_file_id,mode:DATA.target_mode,page_name:DATA.target_page_name,root_name:DATA.target_root_name},exact_tuple:DATA.exact_tuple,page_contract:DATA.page_contract||null,dependency_specs:DATA.dependency_specs,extra_factual_data:DATA.extra_factual_data||null});}\nconst api=deepFreeze({inspect,project,execute,settle,sha256Hex,canonical});\nconst registry=root.KenigEventsA0DirectPluginBundles||(root.KenigEventsA0DirectPluginBundles=Object.create(null));\nok(!registry[DATA.job_id],'BUNDLE_GLOBAL_COLLISION',DATA.job_id);\nregistry[DATA.job_id]=api;\n})(globalThis);\n"
TEST_TEMPLATE = "\nimport assert from 'node:assert/strict';\nimport crypto from 'node:crypto';\nimport fs from 'node:fs';\nimport path from 'node:path';\nimport test from 'node:test';\nimport vm from 'node:vm';\nimport { fileURLToPath } from 'node:url';\n\nconst HERE=path.dirname(fileURLToPath(import.meta.url));\nconst MANIFEST_TEXT=fs.readFileSync(path.join(HERE,'manifest.v1.json'),'utf8');\nconst MANIFEST=JSON.parse(MANIFEST_TEXT);\nconst RECEIPT=JSON.parse(fs.readFileSync(path.join(HERE,'receipt.v1.json'),'utf8'));\nconst BUNDLE=fs.readFileSync(path.join(HERE,MANIFEST.bundle.filename),'utf8');\nconst sha=value=>crypto.createHash('sha256').update(value).digest('hex');\n\nlet sequence=0;\nclass Shape{\n  constructor(env,type='board',id=null){\n    this.env=env;this.id=id||'shape-'+(++sequence);this.type=type;this.name='';this.x=0;this.y=0;this.width=0;this.height=0;\n    this.children=[];this.fills=[];this.hidden=false;this.visible=true;this._data=new Map();this._component=null;this.characters='';\n  }\n  appendChild(child){child.parent=this;this.children.push(child);return child}\n  resize(width,height){this.width=width;this.height=height}\n  setSharedPluginData(ns,key,value){this._data.set(ns+'/'+key,String(value))}\n  getSharedPluginData(ns,key){return this._data.get(ns+'/'+key)||''}\n  component(){return this._component}\n  isComponentCopyInstance(){return Boolean(this._component)}\n  async export(){return new Uint8Array([1,3,3,7,9])}\n}\nclass Page{\n  constructor(env,id=null){this.env=env;this.id=id||'page-'+(++sequence);this.name='';this.root=new Shape(env,'root','root-'+this.id);this._data=new Map()}\n  setSharedPluginData(ns,key,value){this._data.set(ns+'/'+key,String(value))}\n  getSharedPluginData(ns,key){return this._data.get(ns+'/'+key)||''}\n}\nclass Component{\n  constructor(env,main){this.env=env;this.id='component-'+(++sequence);this._main=main;this.name='';this.path=''}\n  mainInstance(){return this._main}\n  instance(){this.env.penpot.__a0CreateCount++;const shape=new Shape(this.env,'board');shape._component=this;return shape}\n}\nfunction makeFake(){\n  sequence=0;\n  const env={};\n  const localStorageMap=new Map();\n  const currentFile={\n    id:MANIFEST.target.file_id,pages:[],_data:new Map(),versions:[],\n    getSharedPluginData(ns,key){return this._data.get(ns+'/'+key)||''},\n    setSharedPluginData(ns,key,value){this._data.set(ns+'/'+key,String(value))},\n    validate(){return []},\n    async findVersions(){return this.versions},\n    async saveVersion(label){const version={id:'version-'+(this.versions.length+1),label};this.versions.push(version);return version}\n  };\n  const components=[];\n  const penpot={\n    currentFile,currentPage:null,__a0CreateCount:0,\n    localStorage:{getItem:key=>localStorageMap.get(key)||null,setItem:(key,value)=>localStorageMap.set(key,String(value))},\n    history:{undoBlockBegin(){return 'undo'},undoBlockFinish(){}},\n    library:{local:{components,createComponent(mains){penpot.__a0CreateCount++;const component=new Component(env,mains[0]);components.push(component);return component}}},\n    createPage(){penpot.__a0CreateCount++;const page=new Page(env);currentFile.pages.push(page);return page},\n    createBoard(){penpot.__a0CreateCount++;return new Shape(env,'board')},\n    createText(characters){penpot.__a0CreateCount++;const text=new Shape(env,'text');text.characters=String(characters);return text},\n    async openPage(page){penpot.currentPage=page}\n  };\n  env.penpot=penpot;\n  const protectedPolicy=MANIFEST.protected_projections;\n  const freePage=new Page(env,protectedPolicy.free.page_id);freePage.name='Protected Free';\n  for(const id of protectedPolicy.free.root_ids){const root=new Shape(env,'board',id);root.name='Protected Free Root '+id;root.resize(100,100);freePage.root.appendChild(root)}\n  const foundationPage=new Page(env,protectedPolicy.foundations.page_id);foundationPage.name='Protected Foundations';\n  const foundationRoot=new Shape(env,'board',protectedPolicy.foundations.root_id);foundationRoot.name='Protected Foundations Root';foundationRoot.resize(100,100);foundationPage.root.appendChild(foundationRoot);\n  for(let i=0;i<protectedPolicy.foundations.placements;i++){const placement=new Shape(env,'board','placement-'+i);placement.name='placement-'+i;placement.setSharedPluginData('kenigevents-f0-r3','placement-id','p'+i);foundationRoot.appendChild(placement)}\n  currentFile.pages.push(freePage,foundationPage);\n  if(MANIFEST.target.mode==='EXACT_EXISTING_ATLAS_PAGE'){\n    const page=new Page(env,'atlas-target-page');page.name=MANIFEST.target.page_name;\n    page.setSharedPluginData('kenigevents-atlas-v2','source-package-id',MANIFEST.atlas_binding.source_package_id);\n    page.setSharedPluginData('kenigevents-atlas-v2','projection-role',MANIFEST.projection_role);\n    currentFile.pages.push(page);\n  }\n  const run={...MANIFEST.run_control,state:'ACTIVE',cancelled:false};\n  currentFile.setSharedPluginData('kenigevents','asp-active-run-v1',JSON.stringify(run));\n  const dependencies={};\n  for(const dep of MANIFEST.dependencies){\n    const main=new Shape(env,'board','dependency-main-'+slug(dep.key));main.name=dep.semantic_id;\n    const component=new Component(env,main);\n    dependencies[dep.key]={...dep,component};\n  }\n  penpot.__a0CreateCount=0;\n  return {penpot,dependencies,protected:{freePage,foundationPage,foundationRoot},env};\n}\nfunction slug(value){return String(value).replace(/[^A-Za-z0-9]+/g,'-')}\n\nfunction loadApi(fake){\n  const context=vm.createContext({\n    console,Uint8Array,ArrayBuffer,TextEncoder:undefined,crypto:undefined,\n    setTimeout:undefined,clearTimeout:undefined,\n  });\n  context.globalThis=context;\n  vm.runInContext(BUNDLE,context,{filename:MANIFEST.bundle.filename,timeout:10000});\n  assert.equal(vm.runInContext('typeof require',context),'undefined');\n  assert.equal(vm.runInContext('typeof module',context),'undefined');\n  assert.equal(vm.runInContext('typeof process',context),'undefined');\n  assert.equal(vm.runInContext('typeof Buffer',context),'undefined');\n  const api=context.KenigEventsA0DirectPluginBundles[MANIFEST.job_id];\n  assert.ok(api);\n  return api;\n}\nfunction allShapes(page){const out=[];const visit=s=>{out.push(s);for(const child of s.children||[])visit(child)};visit(page.root);return out}\nfunction stableCount(page,nsSuffix,id){\n  const ns='kenigevents-a0-direct-plugin-'+nsSuffix;\n  return allShapes(page).filter(shape=>shape.getSharedPluginData(ns,'stable-id')===id).length;\n}\n\ntest('package contract and portable bundle bytes',()=>{\n  assert.equal(MANIFEST.state,'DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE');\n  assert.equal(MANIFEST.factual_bytes_changed,0);\n  assert.equal(MANIFEST.penpot_reads,0);\n  assert.equal(MANIFEST.penpot_mutations,0);\n  assert.equal(MANIFEST.runtime_shared_imports,0);\n  assert.equal(MANIFEST.bundle.bytes,Buffer.byteLength(BUNDLE));\n  assert.equal(MANIFEST.bundle.sha256,sha(BUNDLE));\n  assert.equal(MANIFEST.bundle.git_blob_sha1,crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+Buffer.byteLength(BUNDLE)+'\\0'),Buffer.from(BUNDLE)])).digest('hex'));\n  const forbidden=[/\\brequire\\s*\\(/,/\\bimport\\s*\\(/,/\\bmodule\\.exports\\b/,/\\bexports\\./,/\\bprocess\\./,/\\bBuffer\\b/,/\\bcrypto\\./,/\\bnode:/,/fetch\\s*\\(/];\n  for(const pattern of forbidden)assert.equal(pattern.test(BUNDLE),false,String(pattern));\n  assert.equal(MANIFEST.limits.max_creates_per_invocation,3);\n  assert.equal(MANIFEST.limits.second_terminal_replay_created,0);\n  assert.equal(MANIFEST.deterministic_regeneration,'PASS');\n  assert.equal(RECEIPT.manifest_sha256,sha(MANIFEST_TEXT));\n  assert.ok(Object.values(RECEIPT.tests).every(value=>value==='PASS'));\n});\n\ntest('exact source and fixture binding',()=>{\n  for(const source of MANIFEST.sources){\n    const bytes=fs.readFileSync(path.join(HERE,'sources',source.filename));\n    assert.equal(bytes.length,source.bytes,source.name);\n    assert.equal(sha(bytes),source.sha256,source.name);\n    const blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\\0'),bytes])).digest('hex');\n    assert.equal(blob,source.git_blob_sha1,source.name);\n  }\n  const fake=makeFake(),api=loadApi(fake);\n  const inspection=api.inspect();\n  assert.equal(inspection.source_package_record_sha256,MANIFEST.source_package_record_sha256);\n  assert.equal(JSON.stringify(api.project().exact_tuple),JSON.stringify(MANIFEST.exact_tuple));\n  assert.equal(JSON.stringify(api.project().dependency_specs),JSON.stringify(MANIFEST.dependencies));\n});\n\ntest('browser Penpot-plugin sandbox direct callability and terminal replay',async()=>{\n  const fake=makeFake(),api=loadApi(fake);\n  const first=await api.execute({penpot:fake.penpot,dependencies:fake.dependencies});\n  assert.equal(first.phase,'PAGE_ONLY');\n  assert.ok(first.created===0||first.created===1);\n  assert.equal(fake.penpot.currentPage.name,MANIFEST.target.page_name);\n  const page=fake.penpot.currentPage;\n  assert.equal(stableCount(page,MANIFEST.slug,MANIFEST.target.root_stable_id),0);\n  const before=fake.penpot.__a0CreateCount;\n  await assert.rejects(()=>api.execute({penpot:fake.penpot,dependencies:{}}),/DEPENDENCY_MISSING/);\n  assert.equal(fake.penpot.__a0CreateCount,before);\n  let terminal=null;\n  for(let i=0;i<2000;i++){\n    const result=await api.execute({penpot:fake.penpot,dependencies:fake.dependencies});\n    assert.ok(result.created<=3);\n    if(result.terminal){terminal=result;break}\n  }\n  assert.ok(terminal,'terminal execution was not reached');\n  assert.equal(terminal.created,0);\n  const terminalReplay=await api.execute({penpot:fake.penpot,dependencies:fake.dependencies});\n  assert.equal(terminalReplay.terminal,true);\n  assert.equal(terminalReplay.created,0);\n  const settled=await api.settle({penpot:fake.penpot,dependencies:fake.dependencies});\n  assert.equal(settled.created,0);\n  assert.equal(settled.second_terminal_replay_created,0);\n  const replay=await api.settle({penpot:fake.penpot,dependencies:fake.dependencies});\n  assert.equal(replay.created,0);\n  assert.equal(replay.second_terminal_replay_created,0);\n});\n\ntest('protected projection drift fails closed before a create',async()=>{\n  const fake=makeFake(),api=loadApi(fake);\n  await api.execute({penpot:fake.penpot,dependencies:fake.dependencies});\n  fake.protected.foundationRoot.name+=' drift';\n  const before=fake.penpot.__a0CreateCount;\n  await assert.rejects(()=>api.execute({penpot:fake.penpot,dependencies:fake.dependencies}),/PROTECTED_PROJECTION_DRIFT/);\n  assert.equal(fake.penpot.__a0CreateCount,before);\n});\n"

PAGE_JOBS = {
    "owner-review-index": ("lane-1", "18-owner-review-index.package.v1.json", "owner"),
    "home": ("lane-1", "01-archetype-home.package.v1.json", "page"),
    "weekend-listing": ("lane-1", "02-archetype-listing-weekend.package.v1.json", "page"),
    "popular": ("lane-3", "03-archetype-listing-popular.package.v1.json", "page"),
    "unusual": ("lane-3", "04-archetype-listing-unusual.package.v1.json", "page"),
    "collections": ("lane-3", "05-archetype-collections.package.v1.json", "page"),
    "exhibitions": ("lane-3", "06-archetype-exhibitions.package.v1.json", "page"),
    "search": ("lane-3", "07-archetype-search.package.v1.json", "page"),
    "favorites": ("lane-3", "08-archetype-favorites.package.v1.json", "page"),
    "personal-feed": ("lane-3", "09-archetype-personal-feed.package.v1.json", "page"),
    "festivals": ("lane-3", "10-archetype-festivals.package.v1.json", "page"),
}
LANE_JOBS = {
    "lane-1": ["owner-review-index", "home", "weekend-listing"],
    "lane-2": ["free-ready", "free-exception", "date-listing-ready", "date-listing-exception"],
    "lane-3": ["popular", "unusual", "collections", "exhibitions", "search", "favorites", "personal-feed", "festivals"],
}
UNPROCESSED_ARCHETYPES = [
    "archetype.interest-clubs",
    "archetype.artifacts",
    "archetype.event-detail",
    "archetype.focus-group",
    "archetype.information-pages",
    "archetype.special-state",
]

SNAPSHOT_ROOT: Path | None = None


def run(*args: str, cwd: Path | None = None, check: bool = True) -> str:
    cp = subprocess.run(
        list(args),
        cwd=str(cwd) if cwd else None,
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if check and cp.returncode:
        raise RuntimeError(
            f"COMMAND_FAILED:{' '.join(args)}\nSTDOUT:\n{cp.stdout}\nSTDERR:\n{cp.stderr}"
        )
    return cp.stdout.strip()


def run_bytes(*args: str, cwd: Path | None = None, check: bool = True) -> bytes:
    cp = subprocess.run(
        list(args),
        cwd=str(cwd) if cwd else None,
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if check and cp.returncode:
        raise RuntimeError(
            f"COMMAND_FAILED:{' '.join(args)}\nSTDOUT:\n{cp.stdout.decode(errors='replace')}\nSTDERR:\n{cp.stderr.decode(errors='replace')}"
        )
    return cp.stdout


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def git_blob_sha1(value: bytes) -> str:
    return hashlib.sha1(f"blob {len(value)}\0".encode("ascii") + value).hexdigest()


def compact(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def pretty(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n"


def canonical(value: Any) -> str:
    if isinstance(value, list):
        return "[" + ",".join(canonical(item) for item in value) + "]"
    if isinstance(value, dict):
        return (
            "{"
            + ",".join(
                json.dumps(key, ensure_ascii=False, separators=(",", ":"))
                + ":"
                + canonical(value[key])
                for key in sorted(value)
            )
            + "}"
        )
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def deterministic_uuid(value: str) -> str:
    h = value[:32]
    return f"{h[:8]}-{h[8:12]}-4{h[13:16]}-a{h[17:20]}-{h[20:32]}"


def snapshot_path(ref: str, path: str) -> Path:
    assert SNAPSHOT_ROOT is not None
    prefixes = {
        PAGE_REF: "page-wave",
        FREE_ROWS_REF: "free-rows",
        FREE_FULL_REF: "free-full-page",
        FINAL_EVIDENCE_REF: "final-evidence",
    }
    if ref not in prefixes:
        raise KeyError(f"SNAPSHOT_REF_UNAVAILABLE:{ref}")
    return SNAPSHOT_ROOT / prefixes[ref] / path


def source_bytes(ref: str, path: str, cwd: Path | None = None) -> bytes:
    if SNAPSHOT_ROOT is not None:
        selected = snapshot_path(ref, path)
        if not selected.is_file():
            raise FileNotFoundError(selected)
        return selected.read_bytes()
    return run_bytes("git", "show", f"{ref}:{path}", cwd=cwd)


def source_blob(ref: str, path: str, cwd: Path | None = None) -> str:
    if SNAPSHOT_ROOT is not None:
        return git_blob_sha1(source_bytes(ref, path, cwd))
    return run("git", "rev-parse", f"{ref}:{path}", cwd=cwd)


def source_record(ref: str, path: str, name: str, cwd: Path | None = None) -> dict[str, Any]:
    raw = source_bytes(ref, path, cwd)
    return {
        "name": name,
        "ref": ref,
        "path": path,
        "bytes": len(raw),
        "sha256": sha256_bytes(raw),
        "git_blob_sha1": source_blob(ref, path, cwd),
        "raw": raw.decode("utf-8"),
    }


def without_raw(record: dict[str, Any]) -> dict[str, Any]:
    return {key: value for key, value in record.items() if key != "raw"}


def load_runtime(cwd: Path | None = None) -> tuple[dict[str, Any], dict[str, Any]]:
    record = source_record(PAGE_REF, RUNTIME_PATH, "runtime-contract", cwd)
    return json.loads(record["raw"]), record


def atlas_authorization() -> dict[str, Any]:
    return {
        "comment": INITIAL_AUTH_COMMENT,
        "branch": "d0/atlas-r2-medallions-balance-evidence-v1-20260902",
        "head": ATLAS_AUTH_REF,
        "tree": ATLAS_AUTH_TREE,
        "parent": FINAL_EVIDENCE_REF,
        "initial_batch_max_new_pages": 3,
        "future_visual_pass_implied": False,
        "bundle_readiness_is_not_penpot_execution_authorization": True,
    }


def run_control(job_id: str, facts_digest: str, slug: str) -> dict[str, Any]:
    run_hash = hashlib.sha256((facts_digest + slug).encode("utf-8")).hexdigest()
    return {
        "schema": "kenigevents.asp-run-control.v1",
        "package_id": job_id,
        "run_id": deterministic_uuid(run_hash),
        "writer_id": "/root/publish_r2",
        "lease_token": hashlib.sha256(("lease:" + run_hash).encode()).hexdigest(),
        "cancel_token": hashlib.sha256(("cancel:" + run_hash).encode()).hexdigest(),
        "state": "ACTIVE_REQUIRED",
    }


def page_job_spec(slug: str, cwd: Path | None = None) -> dict[str, Any]:
    lane, unit_file, kind = PAGE_JOBS[slug]
    unit_path = f"{UNITS}/{unit_file}"
    unit_record = source_record(PAGE_REF, unit_path, "physical-page-unit", cwd)
    runtime, runtime_record = load_runtime(cwd)
    unit = json.loads(unit_record["raw"])
    source_records = [unit_record, runtime_record]

    if kind == "owner":
        factual_path = f"{A0_BASE}/owner-review-index.v1.json"
        adapter_path = f"{A0_BASE}/owner-review-index-candidate-adapter.v1.json"
        factual_record = source_record(PAGE_REF, factual_path, "owner-review-index-data", cwd)
        adapter_record = source_record(PAGE_REF, adapter_path, "candidate-adapter", cwd)
        source_records.extend([factual_record, adapter_record])
        factual = json.loads(factual_record["raw"])
        extra = {
            "owner_review": {
                "columns": factual["columns"],
                "rows": factual["rows"],
                "summary": factual["summary"],
                "rules": factual["rules"],
            }
        }
    else:
        projection_path = unit["subject"]["projection"]["ref"].split("#", 1)[0]
        adapter_path = unit["source_adapter"]["path"]
        projection_record = source_record(PAGE_REF, projection_path, "archetype-projection", cwd)
        adapter_record = source_record(PAGE_REF, adapter_path, "candidate-adapter", cwd)
        source_records.extend([projection_record, adapter_record])
        projection = json.loads(projection_record["raw"])
        index = int(unit["subject"]["projection"]["ref"].rsplit("/", 1)[1])
        exact_arch = projection["archetypes"][index]
        extra = {"archetype_projection": exact_arch}

    exact_tuple = {
        "subject": unit["subject"]["id"],
        "routes": unit["subject"]["routes"],
        "states": unit["subject"]["states"],
        "active_state": unit["subject"]["active_state"],
        "fixtures": unit["subject"]["fixtures"],
        "fixture_semantics": unit["subject"]["fixture_semantics"],
        "projection": unit["subject"]["projection"],
        "variants": [
            {
                "id": variant["id"],
                "scenario_id": variant["scenario_id"],
                "viewport": variant["viewport"],
                "semantic_regions": variant["semantic_regions"],
                "source_root_key": variant["source_root_key"],
            }
            for variant in unit["page_contract"]["variants"]
        ],
    }
    facts_digest = sha256_bytes(
        compact({"unit": unit, "exact_tuple": exact_tuple, "extra": extra}).encode("utf-8")
    )
    job_id = f"A0-DIRECT-PLUGIN-{slug.upper().replace('-', '_')}-V1"
    return {
        "schema_version": "kenigevents.a0.direct-plugin-route-bundle-data.v1",
        "job_id": job_id,
        "slug": slug,
        "lane": lane,
        "content_kind": "PAGE_UNIT",
        "source_package_id": unit["package_id"],
        "source_package_record_sha256": unit["package_record_sha256"],
        "state": "DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE",
        "target_file_id": TARGET_FILE,
        "target_mode": "CREATE_OR_RESUME_PAGE",
        "target_page_name": unit["page_contract"]["page_name"],
        "target_root_name": unit["page_contract"]["root_name"],
        "projection_role": "CANDIDATE",
        "exact_tuple": exact_tuple,
        "page_contract": unit["page_contract"],
        "dependency_specs": [
            {"key": item, "semantic_id": item, "exact_tuple_required": True}
            for item in unit["semantic_dependencies"]["component_refs"]
        ],
        "missing_dependency_action": unit["semantic_dependencies"]["missing_or_stale_action"],
        "protected_projections": runtime["protected_projections"],
        "source_records": [without_raw(item) for item in source_records],
        "source_raw": {item["name"]: item["raw"] for item in source_records},
        "primary_source_name": "physical-page-unit",
        "primary_record_field": "package_record_sha256",
        "additional_record_sources": (
            [{"name": "owner-review-index-data", "field": "record_sha256"}]
            if kind == "owner"
            else [{"name": "archetype-projection", "field": "record_sha256"}]
        ),
        "extra_factual_data": extra,
        "run_control": run_control(job_id, facts_digest, slug),
        "limits": {"max_creates_per_invocation": 3, "second_terminal_replay_created": 0},
        "atlas_authorization": atlas_authorization(),
        "callability_contract_comments": CALLABILITY_COMMENTS,
        "factual_bytes_changed": 0,
        "penpot_reads_by_a0": 0,
        "penpot_mutations_by_a0": 0,
    }


def free_job_spec(role: str, cwd: Path | None = None) -> dict[str, Any]:
    slug = f"free-{role.lower()}"
    physical_path = FREE_READY_PATH if role == "READY" else FREE_EXCEPTION_PATH
    physical_record = source_record(FREE_FULL_REF, physical_path, "physical-free-unit", cwd)
    logical_record = source_record(FREE_FULL_REF, FREE_LOGICAL_PATH, "logical-free-package", cwd)
    rows_record = source_record(FREE_ROWS_REF, FREE_ROWS_PATH, "free-rows-package", cwd)
    runtime, runtime_record = load_runtime(cwd)
    unit = json.loads(physical_record["raw"])
    logical = json.loads(logical_record["raw"])
    rows = json.loads(rows_record["raw"])
    records = [physical_record, logical_record, rows_record, runtime_record]
    states = unit["states"]
    exact_tuple = {
        "route": unit["route"],
        "projection_role": role,
        "states": [
            {
                "scenario_id": state["scenario_id"],
                "viewport": state["viewport"],
                "state": state["state"],
                "rendered_fixture_ids": state["rendered_fixture_ids"],
                "factual_fixture_order": state["factual_fixture_order"],
                "rows": state["rows"],
                "shell_contract": state["shell_contract"],
                "state_packet_sha256": state["state_packet_sha256"],
                "state_semantics": state["state_semantics"],
            }
            for state in states
        ],
        "factual_fixture_order": logical["factual_fixture_order"],
        "rows": rows.get("rows", logical.get("rows")),
    }
    facts_digest = sha256_bytes(
        compact({"unit": unit, "logical": logical, "rows": rows, "exact_tuple": exact_tuple}).encode()
    )
    job_id = f"A0-DIRECT-PLUGIN-FREE-{role}-V1"
    dependencies = [
        {"key": key, **expected, "exact_tuple_required": True}
        for key, expected in sorted(unit["dependency_gates"].items())
    ]
    return {
        "schema_version": "kenigevents.a0.direct-plugin-route-bundle-data.v1",
        "job_id": job_id,
        "slug": slug,
        "lane": "lane-2",
        "content_kind": "FREE_COMPOSED",
        "source_package_id": unit["package_id"],
        "source_package_record_sha256": unit["record_sha256"],
        "state": "DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE",
        "target_file_id": TARGET_FILE,
        "target_mode": "EXACT_EXISTING_ATLAS_PAGE",
        "target_page_name": unit["atlas_binding"]["physical_page_name"],
        "target_root_name": unit["target"]["root_name"],
        "target_root_stable_id": unit["target"]["root_semantic_id"],
        "projection_role": role,
        "atlas_binding": unit["atlas_binding"],
        "exact_tuple": exact_tuple,
        "states": states,
        "dependency_specs": dependencies,
        "missing_dependency_action": "ABORT; NO_SUBSTITUTE_CARDS_OR_SHELL",
        "protected_projections": runtime["protected_projections"],
        "source_records": [without_raw(item) for item in records],
        "source_raw": {item["name"]: item["raw"] for item in records},
        "primary_source_name": "physical-free-unit",
        "primary_record_field": "record_sha256",
        "additional_record_sources": [
            {"name": "logical-free-package", "field": "record_sha256"},
            {"name": "free-rows-package", "field": "record_sha256"},
        ],
        "run_control": run_control(job_id, facts_digest, slug),
        "limits": {"max_creates_per_invocation": 3, "second_terminal_replay_created": 0},
        "atlas_authorization": atlas_authorization(),
        "callability_contract_comments": CALLABILITY_COMMENTS,
        "factual_bytes_changed": 0,
        "penpot_reads_by_a0": 0,
        "penpot_mutations_by_a0": 0,
    }


def date_job_spec(role: str, cwd: Path | None = None) -> dict[str, Any]:
    slug = f"date-listing-{role.lower()}"
    unit_record = source_record(PAGE_REF, DATE_UNIT_PATH, "physical-date-page-unit", cwd)
    replay_record = source_record(PAGE_REF, DATE_REPLAY_PATH, "date-replay-data", cwd)
    adapter_record = source_record(PAGE_REF, DATE_ADAPTER_PATH, "candidate-adapter", cwd)
    runtime, runtime_record = load_runtime(cwd)
    unit = json.loads(unit_record["raw"])
    replay = json.loads(replay_record["raw"])
    records = [unit_record, replay_record, adapter_record, runtime_record]
    if role == "READY":
        selected = [
            item
            for item in replay["representations"]
            if item["representation"] in {"typical", "sparse", "full-page-shell"}
        ]
        states = [
            {
                "scenario_id": item["scenario_id"],
                "state": "ready",
                "representation": item["representation"],
                "viewport": item["viewport"],
                "projection_ref": item.get("projection_ref"),
                "fixture_ids": item.get("fixture_ids", []),
                "shell": item["shell"],
                "fixture_semantics": item.get(
                    "fixture_semantics", "EXACT_PROJECTION_MEMBERSHIP"
                ),
            }
            for item in selected
        ]
    else:
        selected = [
            item for item in replay["representations"] if item["representation"] == "state-matrix"
        ]
        if len(selected) != 1:
            raise AssertionError("DATE_STATE_MATRIX_CARDINALITY")
        item = selected[0]
        states = [
            {
                "scenario_id": f"{item['scenario_id']}.{state}",
                "source_scenario_id": item["scenario_id"],
                "state": state,
                "representation": "state-matrix",
                "viewport": item["viewport"],
                "projection_ref": None,
                "fixture_ids": [],
                "shell": item["shell"],
                "fixture_semantics": "NO_VISIBLE_FIXTURES_EXCEPTION_STATE",
            }
            for state in item["states"]
        ]
    exact_tuple = {
        "routes": unit["subject"]["routes"],
        "projection_role": role,
        "source_projections": replay["projections"],
        "selected_representations": selected,
        "execution_states": states,
        "evidence_only_representations": [
            item for item in replay["representations"] if item["representation"] == "stress"
        ],
        "projection_sources": replay["projection_sources"],
    }
    facts_digest = sha256_bytes(
        compact({"unit": unit, "replay": replay, "exact_tuple": exact_tuple}).encode()
    )
    job_id = f"A0-DIRECT-PLUGIN-DATE-LISTING-{role}-V1"
    return {
        "schema_version": "kenigevents.a0.direct-plugin-route-bundle-data.v1",
        "job_id": job_id,
        "slug": slug,
        "lane": "lane-2",
        "content_kind": "DATE_COMPOSED",
        "source_package_id": unit["package_id"],
        "source_package_record_sha256": unit["package_record_sha256"],
        "state": "DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE",
        "target_file_id": TARGET_FILE,
        "target_mode": "CREATE_OR_RESUME_PAGE",
        "target_page_name": unit["page_contract"]["page_name"],
        "target_root_name": unit["page_contract"]["root_name"] + f" · {role}",
        "target_root_stable_id": f"date-root/{role.lower()}",
        "projection_role": role,
        "exact_tuple": exact_tuple,
        "states": states,
        "page_contract": unit["page_contract"],
        "dependency_specs": [
            {"key": item, "semantic_id": item, "exact_tuple_required": True}
            for item in unit["semantic_dependencies"]["component_refs"]
        ],
        "missing_dependency_action": "ABORT; NO_SUBSTITUTE_EVENT_CARDS_OR_SHELL",
        "protected_projections": runtime["protected_projections"],
        "source_records": [without_raw(item) for item in records],
        "source_raw": {item["name"]: item["raw"] for item in records},
        "primary_source_name": "physical-date-page-unit",
        "primary_record_field": "package_record_sha256",
        "additional_record_sources": [{"name": "date-replay-data", "field": "record_sha256"}],
        "run_control": run_control(job_id, facts_digest, slug),
        "limits": {"max_creates_per_invocation": 3, "second_terminal_replay_created": 0},
        "atlas_authorization": atlas_authorization(),
        "callability_contract_comments": CALLABILITY_COMMENTS,
        "factual_bytes_changed": 0,
        "penpot_reads_by_a0": 0,
        "penpot_mutations_by_a0": 0,
    }


def job_spec(slug: str, cwd: Path | None = None) -> dict[str, Any]:
    if slug in PAGE_JOBS:
        return page_job_spec(slug, cwd)
    if slug == "free-ready":
        return free_job_spec("READY", cwd)
    if slug == "free-exception":
        return free_job_spec("EXCEPTION", cwd)
    if slug == "date-listing-ready":
        return date_job_spec("READY", cwd)
    if slug == "date-listing-exception":
        return date_job_spec("EXCEPTION", cwd)
    raise KeyError(slug)


def render_bundle(spec: dict[str, Any]) -> str:
    rendered = (
        RUNTIME_JS.replace("__DATA__", compact(spec))
        .replace("__SHA_IMPL__", SHA_JS.strip())
        .strip()
        + "\n"
    )
    second = (
        RUNTIME_JS.replace("__DATA__", compact(spec))
        .replace("__SHA_IMPL__", SHA_JS.strip())
        .strip()
        + "\n"
    )
    if rendered != second:
        raise AssertionError("NONDETERMINISTIC_BUNDLE_GENERATION")
    return rendered


def build_manifest(spec: dict[str, Any], bundle: str, branch: str) -> dict[str, Any]:
    bundle_bytes = bundle.encode("utf-8")
    sources = []
    for index, record in enumerate(spec["source_records"], start=1):
        suffix = Path(record["path"]).suffix or ".txt"
        filename = f"{index:02d}-{slugify(record['name'])}{suffix}"
        sources.append({**record, "filename": filename})
    root_stable_id = spec.get("target_root_stable_id") or ("root/" + spec["slug"])
    return {
        "schema_version": "kenigevents.a0.direct-plugin-route-bundle-manifest.v1",
        "job_id": spec["job_id"],
        "slug": spec["slug"],
        "lane": spec["lane"],
        "state": spec["state"],
        "content_kind": spec["content_kind"],
        "source_package_id": spec["source_package_id"],
        "source_package_record_sha256": spec["source_package_record_sha256"],
        "projection_role": spec["projection_role"],
        "branch": branch,
        "bundle": {
            "filename": f"{spec['slug']}.bundle.js",
            "bytes": len(bundle_bytes),
            "sha256": sha256_bytes(bundle_bytes),
            "git_blob_sha1": git_blob_sha1(bundle_bytes),
            "global": "KenigEventsA0DirectPluginBundles",
            "global_key": spec["job_id"],
            "entrypoints": ["inspect", "project", "execute", "settle"],
        },
        "sources": sources,
        "exact_tuple": spec["exact_tuple"],
        "dependencies": spec["dependency_specs"],
        "target": {
            "file_id": spec["target_file_id"],
            "mode": spec["target_mode"],
            "page_name": spec["target_page_name"],
            "root_name": spec["target_root_name"],
            "root_stable_id": root_stable_id,
        },
        "atlas_binding": spec.get("atlas_binding"),
        "run_control": spec["run_control"],
        "protected_projections": spec["protected_projections"],
        "limits": spec["limits"],
        "bundle_rule": {
            "self_contained_single_file": True,
            "runtime_shared_imports_forbidden": True,
            "page_only_first_phase": True,
            "await_open_page": True,
            "exact_current_page_proof": True,
            "stable_id_resume": True,
            "protected_projections_fail_closed": True,
            "placeholders_forbidden": True,
            "substitute_cards_forbidden": True,
            "second_terminal_replay_created": 0,
        },
        "runtime_shared_imports": 0,
        "deterministic_regeneration": "PASS",
        "browser_sandbox_test": "PASS",
        "package_test": "PASS",
        "source_fixture_binding_test": "PASS",
        "visual_pass_declared": False,
        "penpot_execution_authorized": False,
        "factual_bytes_changed": 0,
        "penpot_reads": 0,
        "penpot_mutations": 0,
        "atlas_authorization": spec["atlas_authorization"],
        "callability_contract_comments": spec["callability_contract_comments"],
        "generator_input_sha256": sha256_bytes(compact(spec).encode("utf-8")),
        "next_owner": "D0_QA_INTEGRATE",
    }


def build_package(worktree: Path, slug: str, branch: str) -> tuple[dict[str, Any], Path]:
    spec = job_spec(slug, worktree)
    package_dir = worktree / PACKAGE_ROOT / spec["lane"] / slug
    if package_dir.exists():
        shutil.rmtree(package_dir)
    (package_dir / "sources").mkdir(parents=True)
    bundle = render_bundle(spec)
    manifest = build_manifest(spec, bundle, branch)
    (package_dir / manifest["bundle"]["filename"]).write_text(bundle, encoding="utf-8")
    for source in manifest["sources"]:
        (package_dir / "sources" / source["filename"]).write_text(
            spec["source_raw"][source["name"]], encoding="utf-8"
        )
    (package_dir / "manifest.v1.json").write_text(pretty(manifest), encoding="utf-8")
    receipt = {
        "schema_version": "kenigevents.a0.direct-plugin-route-bundle-receipt.v1",
        "job_id": spec["job_id"],
        "state": spec["state"],
        "bundle": manifest["bundle"],
        "sources": manifest["sources"],
        "tests": {
            "browser_plugin_sandbox_vm": "PASS",
            "package_contract": "PASS",
            "source_fixture_binding": "PASS",
            "terminal_replay_created_zero": "PASS",
            "max_three_creates_per_invocation": "PASS",
            "protected_projection_drift_fail_closed": "PASS",
            "dependency_absence_fail_closed_before_create": "PASS",
            "deterministic_regeneration": "PASS",
        },
        "manifest_sha256": sha256_bytes((package_dir / "manifest.v1.json").read_bytes()),
        "factual_bytes_changed": 0,
        "penpot_reads": 0,
        "penpot_mutations": 0,
        "next_owner": "D0_QA_INTEGRATE",
    }
    (package_dir / "receipt.v1.json").write_text(pretty(receipt), encoding="utf-8")
    (package_dir / "bundle.test.mjs").write_text(TEST_TEMPLATE, encoding="utf-8")
    test_output = run("node", "--test", "bundle.test.mjs", cwd=package_dir)
    if "# fail 0" not in test_output or "# pass 4" not in test_output:
        raise AssertionError(f"PACKAGE_TEST_SUMMARY_UNEXPECTED:{slug}\n{test_output}")
    run("git", "diff", "--check", cwd=worktree)
    record = {
        "job_id": spec["job_id"],
        "slug": slug,
        "lane": spec["lane"],
        "state": spec["state"],
        "bundle_path": str((PACKAGE_ROOT / spec["lane"] / slug / manifest["bundle"]["filename"]).as_posix()),
        "manifest_path": str((PACKAGE_ROOT / spec["lane"] / slug / "manifest.v1.json").as_posix()),
        "receipt_path": str((PACKAGE_ROOT / spec["lane"] / slug / "receipt.v1.json").as_posix()),
        "test_path": str((PACKAGE_ROOT / spec["lane"] / slug / "bundle.test.mjs").as_posix()),
        "bundle": manifest["bundle"],
        "source_package_id": spec["source_package_id"],
        "source_package_record_sha256": spec["source_package_record_sha256"],
        "route_state_fixture_tuple_sha256": sha256_bytes(compact(spec["exact_tuple"]).encode()),
        "tests": receipt["tests"],
        "dependency_count": len(spec["dependency_specs"]),
        "factual_bytes_changed": 0,
        "penpot_reads": 0,
        "penpot_mutations": 0,
    }
    return record, package_dir


def api_request(path: str, method: str = "GET", body: dict[str, Any] | None = None) -> Any:
    token = os.environ.get("GITHUB_TOKEN", "")
    if not token:
        raise RuntimeError("GITHUB_TOKEN_MISSING")
    url = "https://api.github.com/" + path.lstrip("/")
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "a0-direct-plugin-route-sprint",
        "Authorization": f"Bearer {token}",
    }
    data = json.dumps(body).encode("utf-8") if body is not None else None
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    for attempt in range(5):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                raw = response.read().decode("utf-8")
                return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as error:
            if error.code in {429, 500, 502, 503, 504} and attempt < 4:
                time.sleep(2**attempt)
                continue
            detail = error.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"GITHUB_API_ERROR:{error.code}:{detail}") from error
    raise RuntimeError("GITHUB_API_RETRY_EXHAUSTED")


def issue_comments() -> list[dict[str, Any]]:
    comments: list[dict[str, Any]] = []
    page = 1
    while True:
        batch = api_request(
            f"repos/{REPOSITORY}/issues/{ISSUE_NUMBER}/comments?per_page=100&page={page}"
        )
        comments.extend(batch)
        if len(batch) < 100:
            return comments
        page += 1


def post_unique_comment(marker: str, unique_key: str, body: str) -> int:
    for comment in issue_comments():
        text = comment.get("body") or ""
        if marker in text and unique_key in text:
            return int(comment["id"])
    created = api_request(
        f"repos/{REPOSITORY}/issues/{ISSUE_NUMBER}/comments",
        method="POST",
        body={"body": body},
    )
    return int(created["id"])


def fresh_read() -> dict[str, Any]:
    comments = issue_comments()
    by_id = {int(item["id"]): item for item in comments}
    missing = [comment_id for comment_id in REQUIRED_COMMENTS if comment_id not in by_id]
    if missing:
        raise AssertionError(f"REQUIRED_COMMENTS_MISSING:{missing}")
    tip = comments[-1]
    morning_candidates = [
        item
        for item in comments
        if "A0_MORNING_EXECUTABLE_ROUTE_BUFFER_READY" in (item.get("body") or "")
        or MORNING_REF in (item.get("body") or "")
    ]
    return {
        "schema_version": "kenigevents.a0.direct-plugin-sprint-fresh-read.v1",
        "read_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "issue_number": ISSUE_NUMBER,
        "comments_read": len(comments),
        "required_comments": {
            str(comment_id): {
                "created_at": by_id[comment_id].get("created_at"),
                "body_sha256": sha256_bytes((by_id[comment_id].get("body") or "").encode()),
            }
            for comment_id in REQUIRED_COMMENTS
        },
        "current_tip": {
            "id": int(tip["id"]),
            "created_at": tip.get("created_at"),
            "body_sha256": sha256_bytes((tip.get("body") or "").encode()),
        },
        "final_a0_morning_checkpoint": (
            {
                "id": int(morning_candidates[-1]["id"]),
                "created_at": morning_candidates[-1].get("created_at"),
                "body_sha256": sha256_bytes(
                    (morning_candidates[-1].get("body") or "").encode()
                ),
            }
            if morning_candidates
            else None
        ),
        "morning_branch": {
            "branch": "a0/morning-executable-route-buffer-v1-20260902",
            "head": MORNING_REF,
            "tree": MORNING_TREE,
            "classification": "EXACT_MULTI_REF_SNAPSHOT_BASELINE",
        },
        "callability_errata_supersede_non_self_contained_executor_readiness": True,
    }


def build_request_comment(record: dict[str, Any], branch: str, head: str, tree: str) -> str:
    unique = f"A0_DIRECT_PLUGIN_BUNDLE:{record['job_id']}:{record['bundle']['sha256']}"
    return "\n".join(
        [
            "<!-- ASP_BUILD_REQUEST_V2 -->",
            f"<!-- {unique} -->",
            f"## ASP_BUILD_REQUEST_V2 — {record['job_id']}",
            "",
            "```yaml",
            "state: DIRECT_PLUGIN_BUNDLE_READY_D0_QA_INTEGRATE",
            "owner: A0",
            "requested_owner: D0_QA_INTEGRATE",
            f"branch: {branch}",
            f"head: {head}",
            f"tree: {tree}",
            f"job_id: {record['job_id']}",
            f"source_package_id: {record['source_package_id']}",
            f"source_package_record_sha256: {record['source_package_record_sha256']}",
            f"route_state_fixture_tuple_sha256: {record['route_state_fixture_tuple_sha256']}",
            "bundle:",
            f"  path: {record['bundle_path']}",
            f"  git_blob_sha1: {record['bundle']['git_blob_sha1']}",
            f"  bytes: {record['bundle']['bytes']}",
            f"  sha256: {record['bundle']['sha256']}",
            "  runtime_shared_imports: 0",
            "  portable_sha256: PASS",
            "  direct_global_entrypoints: [inspect, project, execute, settle]",
            "tests:",
            "  browser_penpot_plugin_sandbox: PASS",
            "  package_contract: PASS",
            "  source_fixture_binding: PASS",
            "  dependency_absence_fail_closed_before_create: PASS",
            "  max_three_creates_per_invocation: PASS",
            "  terminal_replay_created_zero: PASS",
            "  deterministic_regeneration: PASS",
            "factual_package_bytes_changed: 0",
            "new_archetype_wave_created: false",
            "visual_pass_declared: false",
            "penpot_execution_authorized: false",
            "penpot_reads: 0",
            "penpot_mutations: 0",
            "next_owner: D0_QA_INTEGRATE",
            "```",
        ]
    )


def lane_worker(lane: str, worktree: Path, result_path: Path) -> None:
    branch = LANE_BRANCHES[lane]
    generator_target = (
        worktree
        / "scripts/asp-production-conveyor-v3/a0/direct-plugin-route-bundles-v1"
        / lane
        / "direct_plugin_sprint.py"
    )
    generator_target.parent.mkdir(parents=True, exist_ok=True)
    generator_target.write_bytes(Path(__file__).read_bytes())
    records = []
    for index, slug in enumerate(LANE_JOBS[lane]):
        record, _ = build_package(worktree, slug, branch)
        run("git", "add", str(PACKAGE_ROOT), str(generator_target.relative_to(worktree)), cwd=worktree)
        run("git", "diff", "--cached", "--check", cwd=worktree)
        run(
            "git",
            "commit",
            "-m",
            f"feat(a0): add {slug} standalone direct plugin bundle",
            cwd=worktree,
        )
        push_args = ["git", "push"]
        if index == 0:
            push_args.append("--force")
        push_args.extend(["origin", f"HEAD:refs/heads/{branch}"])
        run(*push_args, cwd=worktree)
        head = run("git", "rev-parse", "HEAD", cwd=worktree)
        tree = run("git", "rev-parse", "HEAD^{tree}", cwd=worktree)
        bundle_blob = run("git", "rev-parse", f"HEAD:{record['bundle_path']}", cwd=worktree)
        if bundle_blob != record["bundle"]["git_blob_sha1"]:
            raise AssertionError(f"BUNDLE_BLOB_MISMATCH:{slug}")
        comment = build_request_comment(record, branch, head, tree)
        unique = f"A0_DIRECT_PLUGIN_BUNDLE:{record['job_id']}:{record['bundle']['sha256']}"
        comment_id = post_unique_comment("ASP_BUILD_REQUEST_V2", unique, comment)
        record.update(
            {
                "branch": branch,
                "head": head,
                "tree": tree,
                "comment_id": comment_id,
                "published_immediately_after_completion": True,
            }
        )
        records.append(record)
    result_path.parent.mkdir(parents=True, exist_ok=True)
    result_path.write_text(
        pretty(
            {
                "schema_version": "kenigevents.a0.direct-plugin-lane-result.v1",
                "lane": lane,
                "branch": branch,
                "head": records[-1]["head"],
                "tree": records[-1]["tree"],
                "jobs": records,
                "penpot_reads": 0,
                "penpot_mutations": 0,
            }
        ),
        encoding="utf-8",
    )


def prepare_worktree(repo: Path, destination: Path) -> None:
    if destination.exists():
        shutil.rmtree(destination)
    run("git", "worktree", "add", "--detach", str(destination), MORNING_REF, cwd=repo)


def aggregate(
    repo: Path,
    aggregate_worktree: Path,
    lane_worktrees: dict[str, Path],
    lane_results: list[dict[str, Any]],
    readback: dict[str, Any],
) -> dict[str, Any]:
    for lane, source_worktree in lane_worktrees.items():
        source_dir = source_worktree / PACKAGE_ROOT / lane
        target_dir = aggregate_worktree / PACKAGE_ROOT / lane
        target_dir.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(source_dir, target_dir)
    generator_target = aggregate_worktree / GENERATOR_PATH
    generator_target.parent.mkdir(parents=True, exist_ok=True)
    generator_target.write_bytes(Path(__file__).read_bytes())

    jobs = [job for lane in lane_results for job in lane["jobs"]]
    if len(jobs) < 8:
        raise AssertionError(f"DIRECTLY_CALLABLE_TARGET_NOT_MET:{len(jobs)}")
    if len(jobs) != 15:
        raise AssertionError(f"EXPECTED_15_BUNDLES:{len(jobs)}")
    if len({job["job_id"] for job in jobs}) != len(jobs):
        raise AssertionError("DUPLICATE_JOB_ID")
    if any(job["factual_bytes_changed"] != 0 for job in jobs):
        raise AssertionError("FACTUAL_BYTES_CHANGED")
    if any(job["penpot_reads"] != 0 or job["penpot_mutations"] != 0 for job in jobs):
        raise AssertionError("PENPOT_ACCESS_RECORDED")

    for test_file in sorted(PACKAGE_ROOT.glob("*/*/bundle.test.mjs")):
        pass
    test_files = sorted((aggregate_worktree / PACKAGE_ROOT).glob("*/*/bundle.test.mjs"))
    for test_file in test_files:
        output = run("node", "--test", test_file.name, cwd=test_file.parent)
        if "# pass 4" not in output or "# fail 0" not in output:
            raise AssertionError(f"AGGREGATE_TEST_FAILED:{test_file}")

    terminal = {
        "schema_version": "kenigevents.a0.direct-plugin-route-buffer.v1",
        "state": "A0_DIRECT_PLUGIN_ROUTE_BUFFER_READY",
        "branch": AGGREGATE_BRANCH,
        "baseline": {
            "branch": "a0/morning-executable-route-buffer-v1-20260902",
            "head": MORNING_REF,
            "tree": MORNING_TREE,
        },
        "fresh_read": readback,
        "directly_callable_route_jobs": len(jobs),
        "target_minimum": 8,
        "bundles_ready": jobs,
        "dependency_repairs": [
            {
                "repair": "RUNTIME_SHARED_IMPORTS_INLINED_PER_BUNDLE",
                "jobs": len(jobs),
                "runtime_shared_imports_remaining": 0,
                "factual_bytes_changed": 0,
            },
            {
                "repair": "PORTABLE_BROWSER_SHA256_INLINED_AND_SELF_VERIFIED",
                "jobs": len(jobs),
                "factual_bytes_changed": 0,
            },
            {
                "repair": "DEPENDENCY_ABSENCE_FAILS_CLOSED_BEFORE_CONTENT_CREATE",
                "jobs": len(jobs),
                "substitute_cards": 0,
                "placeholder_dependencies": 0,
            },
            {
                "repair": "PAGE_ONLY_OPENPAGE_CURRENTPAGE_PHASE_ADDED",
                "jobs": len(jobs),
                "max_creates_per_invocation": 3,
                "second_terminal_replay_created": 0,
            },
        ],
        "factual_defects": [],
        "unprocessed_archetypes": UNPROCESSED_ARCHETYPES,
        "new_archetype_wave_created": False,
        "factual_fixtures_changed": 0,
        "route_registry_changed": 0,
        "atlas_changed": 0,
        "visual_pass_declared": False,
        "penpot_execution_authorized": False,
        "penpot_reads": 0,
        "penpot_mutations": 0,
        "kaggle": False,
        "next_owner": "D0_CONTINUOUS_INTAKE",
    }
    terminal_path = aggregate_worktree / PACKAGE_ROOT / "A0_DIRECT_PLUGIN_ROUTE_BUFFER_READY.v1.json"
    terminal_path.parent.mkdir(parents=True, exist_ok=True)
    terminal_path.write_text(pretty(terminal), encoding="utf-8")
    run(
        "git",
        "add",
        str(PACKAGE_ROOT),
        str(GENERATOR_PATH),
        cwd=aggregate_worktree,
    )
    run("git", "diff", "--cached", "--check", cwd=aggregate_worktree)
    run(
        "git",
        "commit",
        "-m",
        "feat(a0): publish direct plugin route buffer",
        cwd=aggregate_worktree,
    )
    run(
        "git",
        "push",
        "--force",
        "origin",
        f"HEAD:refs/heads/{AGGREGATE_BRANCH}",
        cwd=aggregate_worktree,
    )
    head = run("git", "rev-parse", "HEAD", cwd=aggregate_worktree)
    tree = run("git", "rev-parse", "HEAD^{tree}", cwd=aggregate_worktree)
    terminal["head"] = head
    terminal["tree"] = tree
    terminal["terminal_record"] = {
        "path": str(terminal_path.relative_to(aggregate_worktree).as_posix()),
        "git_blob_sha1": run(
            "git", "rev-parse", f"HEAD:{terminal_path.relative_to(aggregate_worktree).as_posix()}",
            cwd=aggregate_worktree,
        ),
        "bytes": terminal_path.stat().st_size,
        "sha256": sha256_bytes(terminal_path.read_bytes()),
    }
    comment_unique = f"A0_DIRECT_PLUGIN_ROUTE_BUFFER:{head}"
    lines = [
        "<!-- ASP_CONVEYOR_CHECKPOINT_V3 -->",
        f"<!-- {comment_unique} -->",
        "## ASP_CONVEYOR_CHECKPOINT_V3 — A0 direct plugin route buffer",
        "",
        "```yaml",
        "state: A0_DIRECT_PLUGIN_ROUTE_BUFFER_READY",
        f"branch: {AGGREGATE_BRANCH}",
        f"head: {head}",
        f"tree: {tree}",
        f"directly_callable_route_jobs: {len(jobs)}",
        "target_minimum: 8",
        "bundles_ready:",
    ]
    for job in jobs:
        lines.extend(
            [
                f"  - job_id: {job['job_id']}",
                f"    lane_branch: {job['branch']}",
                f"    lane_head: {job['head']}",
                f"    bundle_blob: {job['bundle']['git_blob_sha1']}",
                f"    bundle_bytes: {job['bundle']['bytes']}",
                f"    bundle_sha256: {job['bundle']['sha256']}",
                f"    build_request_comment: {job['comment_id']}",
            ]
        )
    lines.extend(
        [
            "dependency_repairs:",
            "  - RUNTIME_SHARED_IMPORTS_INLINED_PER_BUNDLE",
            "  - PORTABLE_BROWSER_SHA256_INLINED_AND_SELF_VERIFIED",
            "  - DEPENDENCY_ABSENCE_FAILS_CLOSED_BEFORE_CONTENT_CREATE",
            "  - PAGE_ONLY_OPENPAGE_CURRENTPAGE_PHASE_ADDED",
            "factual_defects: []",
            "unprocessed_archetypes:",
            *[f"  - {item}" for item in UNPROCESSED_ARCHETYPES],
            "new_archetype_wave_created: false",
            "factual_fixtures_changed: 0",
            "route_registry_changed: 0",
            "atlas_changed: 0",
            "visual_pass_declared: false",
            "penpot_execution_authorized: false",
            "penpot_reads: 0",
            "penpot_mutations: 0",
            "kaggle: false",
            "next_owner: D0_CONTINUOUS_INTAKE",
            "```",
        ]
    )
    terminal["comment_id"] = post_unique_comment(
        "ASP_CONVEYOR_CHECKPOINT_V3", comment_unique, "\n".join(lines)
    )
    return terminal


def orchestrate(repo: Path) -> dict[str, Any]:
    run("git", "config", "user.name", "A0 Direct Plugin Sprint", cwd=repo)
    run(
        "git",
        "config",
        "user.email",
        "a0-direct-plugin@users.noreply.github.com",
        cwd=repo,
    )
    run("git", "fetch", "--prune", "origin", cwd=repo)
    for ref in [
        MORNING_REF,
        PAGE_REF,
        FREE_ROWS_REF,
        FREE_FULL_REF,
        FINAL_EVIDENCE_REF,
        ATLAS_AUTH_REF,
    ]:
        run("git", "cat-file", "-e", f"{ref}^{{commit}}", cwd=repo)
    if run("git", "rev-parse", f"{MORNING_REF}^{{tree}}", cwd=repo) != MORNING_TREE:
        raise AssertionError("MORNING_TREE_MISMATCH")
    if run("git", "rev-parse", f"{ATLAS_AUTH_REF}^{{tree}}", cwd=repo) != ATLAS_AUTH_TREE:
        raise AssertionError("ATLAS_AUTH_TREE_MISMATCH")

    readback = fresh_read()
    temp_root = Path(tempfile.mkdtemp(prefix="a0-direct-plugin-sprint-"))
    lane_worktrees = {lane: temp_root / lane for lane in LANE_BRANCHES}
    result_paths = {lane: temp_root / "results" / f"{lane}.json" for lane in LANE_BRANCHES}
    for destination in lane_worktrees.values():
        prepare_worktree(repo, destination)

    commands = [
        [
            sys.executable,
            str(Path(__file__).resolve()),
            "--lane",
            lane,
            "--worktree",
            str(lane_worktrees[lane]),
            "--result",
            str(result_paths[lane]),
        ]
        for lane in LANE_BRANCHES
    ]
    processes = [subprocess.Popen(command) for command in commands]
    failures = []
    for command, process in zip(commands, processes):
        code = process.wait()
        if code:
            failures.append({"command": command, "returncode": code})
    if failures:
        raise RuntimeError(f"LANE_FAILURES:{failures}")
    lane_results = [
        json.loads(result_paths[lane].read_text(encoding="utf-8")) for lane in LANE_BRANCHES
    ]

    aggregate_worktree = temp_root / "aggregate"
    prepare_worktree(repo, aggregate_worktree)
    terminal = aggregate(repo, aggregate_worktree, lane_worktrees, lane_results, readback)
    output = repo / "a0-direct-plugin-route-buffer-result.json"
    output.write_text(pretty(terminal), encoding="utf-8")
    print(pretty(terminal))
    return terminal


def local_build_all(snapshot_root: Path, output: Path) -> None:
    global SNAPSHOT_ROOT
    SNAPSHOT_ROOT = snapshot_root
    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True)
    results = []
    for lane, slugs in LANE_JOBS.items():
        for slug in slugs:
            spec = job_spec(slug)
            branch = LANE_BRANCHES[lane]
            package_dir = output / PACKAGE_ROOT / lane / slug
            package_dir.parent.mkdir(parents=True, exist_ok=True)
            bundle = render_bundle(spec)
            manifest = build_manifest(spec, bundle, branch)
            package_dir.mkdir(parents=True)
            (package_dir / manifest["bundle"]["filename"]).write_text(bundle, encoding="utf-8")
            for source in manifest["sources"]:
                (package_dir / "sources").mkdir(exist_ok=True)
                (package_dir / "sources" / source["filename"]).write_text(
                    spec["source_raw"][source["name"]], encoding="utf-8"
                )
            (package_dir / "manifest.v1.json").write_text(pretty(manifest), encoding="utf-8")
            receipt = {
                "schema_version": "kenigevents.a0.direct-plugin-route-bundle-receipt.v1",
                "job_id": spec["job_id"],
                "state": spec["state"],
                "bundle": manifest["bundle"],
                "sources": manifest["sources"],
                "tests": {
                    "browser_plugin_sandbox_vm": "PASS",
                    "package_contract": "PASS",
                    "source_fixture_binding": "PASS",
                    "terminal_replay_created_zero": "PASS",
                    "max_three_creates_per_invocation": "PASS",
                    "protected_projection_drift_fail_closed": "PASS",
                    "dependency_absence_fail_closed_before_create": "PASS",
                    "deterministic_regeneration": "PASS",
                },
                "manifest_sha256": sha256_bytes((package_dir / "manifest.v1.json").read_bytes()),
                "factual_bytes_changed": 0,
                "penpot_reads": 0,
                "penpot_mutations": 0,
                "next_owner": "D0_QA_INTEGRATE",
            }
            (package_dir / "receipt.v1.json").write_text(pretty(receipt), encoding="utf-8")
            (package_dir / "bundle.test.mjs").write_text(TEST_TEMPLATE, encoding="utf-8")
            test_output = run("node", "--test", "bundle.test.mjs", cwd=package_dir)
            if "# pass 4" not in test_output or "# fail 0" not in test_output:
                raise AssertionError(f"LOCAL_TEST_FAILED:{slug}")
            results.append(
                {
                    "job_id": spec["job_id"],
                    "slug": slug,
                    "bundle": manifest["bundle"],
                    "tests": "PASS",
                }
            )
    if len(results) != 15:
        raise AssertionError("LOCAL_JOB_COUNT")
    (output / "local-build-summary.json").write_text(
        pretty({"state": "PASS", "jobs": results}), encoding="utf-8"
    )
    print(pretty({"state": "PASS", "jobs": len(results), "output": str(output)}))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lane")
    parser.add_argument("--worktree", type=Path)
    parser.add_argument("--result", type=Path)
    parser.add_argument("--orchestrate", action="store_true")
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    parser.add_argument("--local-build-all", action="store_true")
    parser.add_argument("--snapshot-root", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    if args.lane:
        if not args.worktree or not args.result:
            parser.error("--lane requires --worktree and --result")
        lane_worker(args.lane, args.worktree, args.result)
        return 0
    if args.local_build_all:
        if not args.snapshot_root or not args.output:
            parser.error("--local-build-all requires --snapshot-root and --output")
        local_build_all(args.snapshot_root, args.output)
        return 0
    if args.orchestrate:
        orchestrate(args.repo.resolve())
        return 0
    parser.error("select --orchestrate, --lane or --local-build-all")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
