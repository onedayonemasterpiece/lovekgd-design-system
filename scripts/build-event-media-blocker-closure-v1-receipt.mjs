#!/usr/bin/env node
import fs from 'node:fs';import path from 'node:path';
import { BRANCH, PR_NUMBER, PR_URL, RECEIPT_PATH, gitCommand, stable } from './event-media-blocker-closure-v1/lib.mjs';
import { buildReceipt, receiptMetadata, verifyReceipt } from './event-media-blocker-closure-v1/receipt.mjs';
const args=process.argv.slice(2);const value=(flag)=>{const i=args.indexOf(flag);if(i<0)return null;if(!args[i+1]||args[i+1].startsWith('--'))throw new Error(`${flag} requires a value`);return args[i+1]};
try {
 const known=new Set(['--root','--events-repo','--write','--output','--check','--fixture-mode','--materialization-parent','--pr-number','--pr-url','--branch']);for(let i=0;i<args.length;i++){if(!known.has(args[i]))throw new Error(`unknown argument: ${args[i]}`);if(['--root','--events-repo','--output','--check','--materialization-parent','--pr-number','--pr-url','--branch'].includes(args[i]))i++;}
 const root=path.resolve(value('--root')??'.');const eventsRoot=value('--events-repo');const write=args.includes('--write');const output=value('--output');const check=value('--check');const fixtureMode=args.includes('--fixture-mode');if([write,Boolean(output),Boolean(check)].filter(Boolean).length>1)throw new Error('--write, --output and --check are mutually exclusive');
 let metadata;if(check){metadata=receiptMetadata(root,path.relative(root,path.resolve(check)));}else if(!write&&!output){metadata=receiptMetadata(root);}else metadata={materializationParent:value('--materialization-parent')??gitCommand(root,['rev-parse','HEAD']),prNumber:Number(value('--pr-number')??PR_NUMBER),prUrl:value('--pr-url')??PR_URL,branch:value('--branch')??BRANCH};
 if(write){if(gitCommand(root,['status','--porcelain','--untracked-files=no']))throw new Error('tracked worktree must be clean before --write');}
 const receipt=buildReceipt({root,eventsRoot,fixtureMode,...metadata});
 if(write||output){const destination=write?path.join(root,RECEIPT_PATH):path.resolve(output);fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,stable(receipt));}else verifyReceipt(root,receipt,check?path.relative(root,path.resolve(check)):RECEIPT_PATH);
 console.log(JSON.stringify({status:write||output?'written':'valid',receipt:write?RECEIPT_PATH:(output??check??RECEIPT_PATH),output_count:receipt.output_count,output_bytes:receipt.output_bytes,final_status:receipt.status}));
} catch(error){console.error(JSON.stringify({status:'rejected',error:error?.toJSON?.()??{code:'EMC_RECEIPT_BUILD_FAILED',diagnostic:error.message}}));process.exit(1);}
