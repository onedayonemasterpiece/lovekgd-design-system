import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { SPEC, DECLARED_CHECKOUT } from './data.v1.mjs';

function canonical(value){if(Array.isArray(value))return`[${value.map(canonical).join(',')}]`;if(value&&typeof value==='object')return`{${Object.keys(value).sort().map((key)=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;return JSON.stringify(value);}
export function digest(value){return crypto.createHash('sha256').update(canonical(value)).digest('hex');}

export class NativeLikeDocument {
  constructor(){
    this.kind='native-like-document-v2';this.nodes=new Map();this.pluginData=new Map();this.currentCreated=0;this.activePackage=null;
    this.projections=Object.fromEntries(Object.values(SPEC.protected_projections).map((item)=>[item.projection_id,item.sha256]));
    this._preloadMaster('ATLAS_PAGE_HEADER_V2','atlas-header-master');
    const ids=SPEC.kind==='foundation'?SPEC.families.map((item)=>item.id):SPEC.kind==='typography'?[...new Set(SPEC.placements.map((item)=>item.component_id))]:[];
    ids.forEach((id)=>this._preloadMaster(id,'protected-source-component-master'));
  }
  _preloadMaster(id,role){this.nodes.set(`existing.${id}`,{id:`existing.${id}`,type:'component-master',parentId:null,children:[],role,stableId:id,protectedSource:true,ownerPackageId:null,props:{stableId:id,role,protectedSource:true}});}
  beginRun(packageId){assert.equal(this.activePackage,null);this.activePackage=packageId;this.currentCreated=0;}
  endRun(){const value=this.currentCreated;this.activePackage=null;return value;}
  projectionDigest(id){assert.ok(id in this.projections,`unknown protected projection ${id}`);return this.projections[id];}
  ensureNode(id,type,parentId,props){const parent=parentId?this.nodes.get(parentId):null;if(parentId)assert.ok(parent,`${id}: missing parent ${parentId}`);const existing=this.nodes.get(id);if(existing){assert.equal(existing.type,type);assert.equal(existing.parentId,parentId||null);assert.equal(canonical(existing.props),canonical(props),`${id}: property drift`);return existing;}const node={id,type,parentId:parentId||null,children:[],props:structuredClone(props),...structuredClone(props)};this.nodes.set(id,node);if(parent)parent.children.push(id);this.currentCreated++;return node;}
  ensurePage(id,props){return this.ensureNode(id,'page',null,props)}
  ensureBoard(id,parentId,props){return this.ensureNode(id,'board',parentId,props)}
  ensureGrid(id,parentId,props){return this.ensureNode(id,'grid',parentId,props)}
  ensureFlex(id,parentId,props){return this.ensureNode(id,'flex',parentId,props)}
  ensureComponentMaster(id,props){return this.ensureNode(id,'component-master',null,props)}
  resolveComponentMaster(stableId){return [...this.nodes.values()].find((node)=>node.type==='component-master'&&node.stableId===stableId)||null;}
  ensureLinkedInstance(id,parentId,masterId,props){assert.ok(this.nodes.has(masterId),`${id}: missing master ${masterId}`);return this.ensureNode(id,'linked-instance',parentId,{...props,componentId:masterId,linked:true});}
  ensureText(id,parentId,props){return this.ensureNode(id,'text',parentId,props)}
  ensureShape(id,parentId,props){return this.ensureNode(id,'shape',parentId,props)}
  ensureArtwork(id,parentId,handle,props){assert.equal(handle.verified,true);return this.ensureNode(id,'artwork',parentId,{...props,assetHandle:handle});}
  ensureSpecimenVisual(id,parentId,props){return this.ensureNode(id,'specimen-visual',parentId,props)}
  ensureInstanceOverrideGroup(id,parentId,props){return this.ensureNode(id,'instance-override-group',parentId,props)}
  ensureInstanceTextOverride(id,parentId,props){return this.ensureNode(id,'instance-text-override',parentId,props)}
  setSharedPluginData(node,namespace,key,value){assert.equal(typeof value,'string',`shared-plugin-data value must be string: ${namespace}:${key}`);const id=`${node.id}|${namespace}|${key}`;if(this.pluginData.has(id))assert.equal(this.pluginData.get(id),value);this.pluginData.set(id,value);}
  descendants(id){const out=[];const visit=(nodeId)=>{for(const childId of this.nodes.get(nodeId)?.children||[]){const child=this.nodes.get(childId);out.push(child);visit(childId);}};visit(id);return out;}
  validatePackage(packageId,kind){
    const owned=[...this.nodes.values()].filter((node)=>node.ownerPackageId===packageId);
    const instances=owned.filter((node)=>node.type==='linked-instance');
    const linkedSpecimens=owned.filter((node)=>node.role==='linked-specimen');
    const detached=instances.filter((node)=>!node.linked||!node.componentId||!this.nodes.has(node.componentId)).length;
    const screenshots=owned.filter((node)=>node.type==='image'||node.screenshot===true).length;
    const placeholders=owned.filter((node)=>String(node.role||'').includes('placeholder')||String(node.role||'').includes('generic-circle')||node.placeholder===true).length;
    const empty=linkedSpecimens.filter((node)=>{
      if(kind==='medallions'){const master=this.nodes.get(node.componentId);return !this.descendants(master.id).some((child)=>child.role==='source-artwork'&&child.assetHandle?.verified===true);}
      const children=this.descendants(node.id);
      if(kind==='foundation')return !(children.some((child)=>child.role==='specimen-visual')&&children.some((child)=>child.role==='specimen-label'));
      return children.filter((child)=>child.role==='editable-cyrillic-specimen'&&child.editable===true).length!==SPEC.responsive_roles.length;
    }).length;
    const newFoundationFamilies=owned.filter((node)=>node.type==='component-master'&&String(node.id).startsWith('component.foundation.')).length;
    return {duplicates:0,detached,screenshots,empty_specimen_wells:empty,metadata_only_surfaces:empty,placeholder_only_surfaces:placeholders,new_foundation_families:newFoundationFamilies,linked_specimens:linkedSpecimens.length,owned_nodes:owned.length};
  }
  countRole(role,packageId=SPEC.package_id){return [...this.nodes.values()].filter((node)=>node.role===role&&node.ownerPackageId===packageId).length;}
  snapshot(){return digest({nodes:[...this.nodes.values()],pluginData:[...this.pluginData.entries()].sort()});}
}

export function buildFixtureContext(){
  const document=new NativeLikeDocument();
  const assetCheckout={async readVerifiedAsset(descriptor){assert.ok(DECLARED_CHECKOUT);const row=DECLARED_CHECKOUT.assets.find((item)=>item.path===descriptor.path);assert.deepEqual(row,descriptor);return Object.freeze({...descriptor,verified:true,content_kind:'provider-verified-exact-bytes-v1',handle_id:`asset:${descriptor.git_blob_sha1}`});}};
  const fontCheckout={async readVerifiedFont(descriptor){return Object.freeze({...descriptor,verified:true,content_kind:'provider-verified-exact-font-bytes-v1',handle_id:`font:${descriptor.sha256}`});}};
  return {document,assetCheckout,fontCheckout};
}
