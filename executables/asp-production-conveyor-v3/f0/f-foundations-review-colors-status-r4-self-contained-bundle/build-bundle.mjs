#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE=dirname(fileURLToPath(import.meta.url));
const INPUT=join(HERE,'bundle-input.v1.json'),RUNTIME=join(HERE,'src','runtime.js'),OUT=join(HERE,'dist','penpot-plugin.bundle.js');
const inputBytes=await readFile(INPUT),input=JSON.parse(inputBytes),runtime=await readFile(RUNTIME,'utf8');
const spec=input.spec,ok=(value,code)=>{if(!value)throw new Error(code)},sha256=(value)=>createHash('sha256').update(value).digest('hex');
ok(spec.package_id==='F-FOUNDATIONS-REVIEW-COLORS-STATUS','PACKAGE_ID');
ok(spec.atlas.head==='663be702d481972cb2e8863af500f1c35dda1d8c'&&spec.atlas.tree==='cf9a1e6a5e0a84aea5636334dbd3be4961039b75','ATLAS_AUTHORITY');
ok(spec.atlas.atlas_page_id==='foundations-review-colors-status'&&spec.atlas.page_order==='0050'&&spec.atlas.template_id==='FOUNDATION_ASSET_GRID_STANDARD_V2','ATLAS_PAGE_BINDING');
ok(spec.page.name==='03.1 · Foundations · Colors & status · Candidate'&&spec.page.width===2176&&spec.page.height===2304,'ATLAS_GEOMETRY');
ok(JSON.stringify(spec.page.header_bounds)===JSON.stringify([64,64,2048,128]),'ATLAS_HEADER_GEOMETRY');
ok(spec.atlas.header_component_id==='250f32b9-f4ec-800e-8008-92c64c51fdc0'&&spec.atlas.header_main_id==='250f32b9-f4ec-800e-8008-92c64a6147cc','HEADER_NATIVE_IDS');
ok(spec.families.length===2&&spec.placements.length===26,'SOURCE_CENSUS');
ok(new Set(spec.placements.map((item)=>item.id)).size===26,'PLACEMENT_ID_UNIQUE');
const expectedFamilies={
 'foundation.colors-and-modes':['313fb1ed-0d5c-8095-8008-9189b21c5ddc','313fb1ed-0d5c-8095-8008-918348f8d9c1','ColorsAndModes'],
 'foundation.status':['313fb1ed-0d5c-8095-8008-9189b288bc37','313fb1ed-0d5c-8095-8008-9189b22d2137','StatusPairs'],
};
for(const family of spec.families){const exact=expectedFamilies[family.stable_id];ok(exact&&family.component_id===exact[0]&&family.main_id===exact[1]&&family.component_name===exact[2]&&family.component_path==='Foundation / Specimen','SOURCE_NATIVE_TUPLE:'+family.stable_id)}
for(const placement of spec.placements)ok(expectedFamilies[placement.component_id]&&typeof placement.label_ru==='string'&&placement.label_ru.length>0&&typeof placement.value==='string','SOURCE_PLACEMENT:'+placement.id);
ok(spec.expected.linked_specimens===26&&spec.expected.product_components_reused===2&&spec.expected.detached===0&&spec.expected.screenshots===0&&spec.expected.second_run_created===0,'EXPECTED_CENSUS');
ok(input.manifest.mode==='EXACT_MUTATION_FREE_REVN_BOUND_PROJECTION'&&input.manifest.native_revn_evidence===192,'PROTECTED_REVN_INPUT');
const data={schema:'kenigevents.d0.f0-colors-status-direct-plugin.v6',package_id:spec.package_id,file_id:input.manifest.file_id,requirements_contract:{id:'kenigevents.asp-conformance',version:'1.1.0',status:'ACTIVE',commit:'f134001382f547cebe8b025da24065128b174ffb',blob:'24e02d3048f2feba912cb990f8226b23006e8c2c',sha256:'54002c01430d48d836af491a09f493526c309e0779c2c6f0deedbf434975cf72'},source_bundle:{classification:'BUNDLE_REPAIR',blocker:'CONFORMANCE_AUTHORIZATION_BYPASS_FORBIDDEN',branch:'f0/f-foundations-review-colors-status-r5-d0-conformant-bundle-20260902',head:'5ec1068282b22565812b956438637f599f381bb9',tree:'1e094dd205343fb4681bcdf5e30157bd33bd5b34',path:'executables/asp-production-conveyor-v3/f0/f-foundations-review-colors-status-r4-self-contained-bundle/dist/penpot-plugin.bundle.js',blob:'948f0f0c3c1171d28ea6402ba9d1526b5477953c',bytes:29324,sha256:'94baaea25195eb310841d42d2147f2cec322b9643fa7ed91ef684f0e025f4cc5'},atlas:spec.atlas,page:spec.page,families:spec.families,placements:spec.placements,protected:spec.protected,expected:spec.expected,source_projection_sha256:sha256(Buffer.from(JSON.stringify({families:spec.families,placements:spec.placements}))),input_sha256:sha256(inputBytes),harness:{head:'62f26df36b8199e4b8899b9252f796b1fa5e9d42',tree:'23bc8ef208c9e68e76890183fdda15c1a60f5fbd',blob:'660d4c965384c9b7033a65b4960d5f57387c4d50',sha256:'1642a5ccb8e1f51441eb012667f51284663c11046478a56ae0e98403fbc9bb62'}};
const output=`(()=>{\n'use strict';\nconst DATA=${JSON.stringify(data)};\n${runtime.trim()}\n})();\n`;
if(process.argv.includes('--check')){ok(await readFile(OUT,'utf8')===output,'DETERMINISTIC_REGENERATION_MISMATCH')}else await writeFile(OUT,output,'utf8');
console.log(JSON.stringify({state:'F0_COLORS_STATUS_V6_BUNDLE_GENERATED',bytes:Buffer.byteLength(output),sha256:sha256(Buffer.from(output)),source_projection_sha256:data.source_projection_sha256}));
