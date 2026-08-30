#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ROOT=path.resolve(process.cwd());
const ASTRO_ROOT=path.resolve(process.env.ASTRO_G12_ROOT||'/home/dev/.codex/worktrees/events-bot-new/w2-free-collection-visual-evidence-g12');
const OUT='catalog/penpot-executor/g14/font-source-binding.json';
const ASTRO_HEAD='c7c3e2367db8fd8865a735c8b9f5df1ef2b6efd1';
const ASTRO_TREE='3c7b231d10e93866899cede299c3523c8b996711';
const FONT_MANIFEST='site/evidence/free-collection-g12/runtime-font-manifest.json';
const REGULAR='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
const BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';
const EXPECTED_REGULAR='ae7b7855e115a5966d8b1b3f80f254ccc117ec86f9965e202ee2940453837280';
const sha=(bytes)=>createHash('sha256').update(bytes).digest('hex');
const stable=(value)=>JSON.stringify(value,(_key,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.entries(item).sort(([a],[b])=>a.localeCompare(b))):item);
const git=(args)=>execFileSync('git',['-C',ASTRO_ROOT,...args],{encoding:'utf8'}).trim();
if(git(['rev-parse','HEAD'])!==ASTRO_HEAD||git(['rev-parse','HEAD^{tree}'])!==ASTRO_TREE)throw Error('FROZEN_ASTRO_TUPLE_MISMATCH');
const regularBytes=await readFile(REGULAR),boldBytes=await readFile(BOLD);
if(sha(regularBytes)!==EXPECTED_REGULAR)throw Error('FONT_SOURCE_ENVIRONMENT_DRIFT');
const evidenceBytes=await readFile(path.join(ASTRO_ROOT,FONT_MANIFEST));
const source=async(sourcePath,bytes,weight)=>({source_path:sourcePath,byte_size:(await stat(sourcePath)).size,sha256:sha(bytes),weight});
const payload={schema:'kenigevents.font-source-binding.g14.v1',family:'DejaVu Sans',required_weights:[400,700],sources:{regular:await source(REGULAR,regularBytes,400),bold:await source(BOLD,boldBytes,700)},frozen_astro_evidence:{repository:'onedayonemasterpiece/events-bot-new',branch:'w2-free-collection-visual-evidence-g12',head:ASTRO_HEAD,tree:ASTRO_TREE,runtime_font_manifest_path:FONT_MANIFEST,runtime_font_manifest_git_blob_sha1:git(['rev-parse',`HEAD:${FONT_MANIFEST}`]),runtime_font_manifest_sha256:sha(evidenceBytes)},font_binaries_in_git:false,normalization:'UTF8_LF_STABLE_JSON_SORTED_KEYS_EXCLUDING_CONTENT_SHA256'};
payload.content_sha256=sha(Buffer.from(stable(payload)));
await mkdir(path.dirname(path.join(ROOT,OUT)),{recursive:true});
await writeFile(path.join(ROOT,OUT),JSON.stringify(payload,null,2)+'\n');
console.log(JSON.stringify({path:OUT,content_sha256:payload.content_sha256,regular:payload.sources.regular,bold:payload.sources.bold}));
