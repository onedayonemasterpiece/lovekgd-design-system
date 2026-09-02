import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { SPEC, PROTECTED_MANIFEST } from '../f-medallions-institutions-a-r3-runtime/package.v3.mjs';

const NS='kenigevents-f0-morning-r4';
const canonical=(value)=>Array.isArray(value)?`[${value.map(canonical).join(',')}]`:value&&typeof value==='object'?`{${Object.keys(value).sort().map((key)=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`:JSON.stringify(value);
const sha=(bytes)=>crypto.createHash('sha256').update(bytes).digest('hex');

class PluginData {
  constructor(){this._shared=new Map();}
  setSharedPluginData(namespace,key,value){assert.equal(typeof value,'string');this._shared.set(`${namespace}|${key}`,value);}
  getSharedPluginData(namespace,key){return this._shared.get(`${namespace}|${key}`)||'';}
}
class Shape extends PluginData {
  constructor(host,type,id){super();this.host=host;this.type=type;this.id=id;this.name='';this.children=[];this.parent=null;this.width=0;this.height=0;this.x=0;this.y=0;this.fills=[];this.strokes=[];this.layoutCell={};this.export=async()=>new Uint8Array(Buffer.from(`PNG:${this.id}:${this.width}x${this.height}`));}
  resize(width,height){this.width=width;this.height=height;}
  appendChild(child){assert.ok(child);if(child.parent&&child.parent!==this)throw new Error('child already attached');child.parent=this;if(!this.children.includes(child))this.children.push(child);}
  addGridLayout(){if(this.grid)return this.grid;const owner=this;this.grid={columns:[],rows:[],addColumn(type,value){this.columns.push({type,value});},addRow(type,value){this.rows.push({type,value});},appendChild(child,row,column){owner.appendChild(child);child.layoutCell={row,column,rowSpan:1,columnSpan:1};}};return this.grid;}
  addFlexLayout(){if(this.flex)return this.flex;this.flex={dir:'row',wrap:'wrap'};return this.flex;}
}
class Component extends PluginData {
  constructor(host,id,main,stableId){super();this.host=host;this.id=id;this._main=main;this.stableId=stableId;this.name=stableId;this.path='';}
  main(){return this._main;}
  instance(){return this.host._create('component-instance',{component:this,componentId:this.id});}
}
class Page extends PluginData {
  constructor(host,id){super();this.host=host;this.id=id;this.name='';this.root=new Shape(host,'page-root',`${id}.root`);}
}
export class NativeLikePenpot {
  constructor(){
    this.currentFile={id:PROTECTED_MANIFEST.file_id,revision:PROTECTED_MANIFEST.revision,pages:[],validate:()=>[]};
    this.currentPage=null;this._counter=0;this.openPageCalls=0;this.nativeCreates=0;this.media=[];
    const components=[];
    const preload=(stableId)=>{
      const main=new Shape(this,'component-main',`existing.${stableId}.main`);
      main.setSharedPluginData(NS,'component-stable-id',stableId);
      main.setSharedPluginData(NS,'protected-source','true');
      components.push(new Component(this,`existing.${stableId}`,main,stableId));
    };
    preload('ATLAS_PAGE_HEADER_V2');
    if(SPEC.kind==='foundation')SPEC.families.forEach((item)=>preload(item.stable_id));
    if(SPEC.kind==='typography')SPEC.product_components.forEach((item)=>preload(item.stable_id));
    this.library={local:{components,createComponent:(input)=>{
      this._requireActive();const shape=Array.isArray(input)?input[0]:input;assert.ok(shape);
      const stable=shape.getSharedPluginData(NS,'stable-id').replace(/^.*master\./,'')||shape.id;
      const component=new Component(this,`component.created.${stable}`,shape,stable);
      components.push(component);this.nativeCreates++;return component;
    }}};
  }
  _requireActive(){assert.ok(this.currentPage,'shape creation without current page');}
  _create(type,extra={}){this._requireActive();this.nativeCreates++;const shape=new Shape(this,type,`${type}.${++this._counter}`);Object.assign(shape,extra);if(type==='component-instance')shape.component=()=>extra.component;return shape;}
  createPage(){this.nativeCreates++;const page=new Page(this,`page.${++this._counter}`);this.currentFile.pages.push(page);return page;}
  async openPage(page){assert.ok(this.currentFile.pages.includes(page));this.currentPage=page;this.openPageCalls++;await Promise.resolve();}
  createBoard(){return this._create('board');}
  createRectangle(){return this._create('rectangle');}
  createEllipse(){return this._create('ellipse');}
  createText(text){const shape=this._create('text');shape.characters=text;return shape;}
  createShapeFromSvg(text){assert.match(text,/<svg/);const shape=this._create('svg');shape.svgText=text;return shape;}
  async uploadMediaData(name,blob){this._requireActive();assert.ok(blob.size>0);this.nativeCreates++;const bytes=new Uint8Array(await blob.arrayBuffer());const media={id:`media.${++this._counter}`,name,bytes:blob.size,type:blob.type,data:async()=>new Uint8Array(bytes)};this.media.push(media);return media;}
}
function fakePayload(source){
  if(source.extension==='svg'){
    const prefix=`<svg xmlns="http://www.w3.org/2000/svg"><metadata>${source.path}</metadata>`;
    const suffix='</svg>';
    const target=source.bytes;
    const middle='x'.repeat(Math.max(0,target-Buffer.byteLength(prefix)-Buffer.byteLength(suffix)));
    let buffer=Buffer.from(prefix+middle+suffix);
    if(buffer.length!==target)buffer=Buffer.concat([buffer,Buffer.alloc(Math.max(0,target-buffer.length))]).subarray(0,target);
    return new Uint8Array(buffer);
  }
  return new Uint8Array(source.bytes).fill(source.path.length%251);
}
export function buildContext({projectionDrift=false,revision=PROTECTED_MANIFEST.revision}={}){
  const penpot=new NativeLikePenpot();penpot.currentFile.revision=revision;
  const storage={};
  const claim={schema:'kenigevents.f0-runtime-claim.v4',package_id:SPEC.package_id,writer_id:SPEC.lease.writer_id,run_id:'run-12345678',lease_token:'lease-12345678',cancel_token:'cancel-12345678',state:'ACTIVE',cancelled:false};
  storage[`${SPEC.lease.namespace}:lease`]=JSON.stringify({schema:'kenigevents.f0-package-lease.v4',package_id:SPEC.package_id,run_id:claim.run_id,lease_token:claim.lease_token,cancel_token:claim.cancel_token,state:'ACTIVE',cancelled:false});
  const entityDigests=Object.fromEntries(Object.entries(PROTECTED_MANIFEST.entities).map(([key,value])=>[key,value.sha256]));
  const projectionProvider={async readExactRevisionBoundManifest(){return {schema_version:PROTECTED_MANIFEST.schema_version,mode:PROTECTED_MANIFEST.mode,file_id:PROTECTED_MANIFEST.file_id,revision:PROTECTED_MANIFEST.revision,manifest_sha256:PROTECTED_MANIFEST.manifest_sha256,entity_digests:projectionDrift?{...entityDigests,free_eventcard:'0'.repeat(64)}:entityDigests,namespace_enumeration_used:false,finite_guessed_namespace_list_used:false,read_only:true,mutation_count:0};}};
  const assetProvider={async fetchExact(source){const payload=fakePayload(source);return {...source,payload,verified:true};}};
  const fontProvider={async readExactFont(face){return {...face,verified:true};}};
  return {penpot,storage,claim,projectionProvider,assetProvider,fontProvider};
}
function plainShape(shape){
  return {id:shape.id,type:shape.type,name:shape.name,x:shape.x,y:shape.y,width:shape.width,height:shape.height,
    componentId:shape.componentId||null,characters:shape.characters||null,
    pluginData:[...shape._shared.entries()].sort(),children:(shape.children||[]).map(plainShape)};
}
export function snapshot(context){
  const pages=context.penpot.currentFile.pages.map((page)=>({id:page.id,name:page.name,pluginData:[...page._shared.entries()].sort(),root:plainShape(page.root)}));
  return sha(Buffer.from(canonical(pages)));
}
