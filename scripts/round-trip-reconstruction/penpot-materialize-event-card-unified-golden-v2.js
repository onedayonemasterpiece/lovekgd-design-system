/** Central native EventCard · Large variants backed by Golden Event Corpus v2.
 *
 * This page is the single Penpot edit point for the four structural contexts
 * consumed by the September free collection. Product/archetype pages contain
 * linked instances of these masters and only fixture data overrides.
 */

const FILE_ID='3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_NAME='40.1b — EventCard · Unified Golden variants';
const PATH='Event cards / Large / Unified Golden v2';
const DESKTOP_BASE_ID='b0fe69fd-ccaf-8025-8008-846f0b7f12cd';
const MOBILE_BASE_ID='7f078c80-87b8-80f5-8008-85839e8975f6';
const CORPUS_ID='ui-reference-events.v2';

const EVENTS={
  8006:{title:'Донорская акция «Стань донором крови»',type:'встреча',occurrence:'2 сентября 09:00',price:'Бесплатно · регистрация',place:'Гурьевск · Центр культуры и досуга',shares:1,likes:9},
  8200:{title:'Музыкальная экспедиция Бориса Андрианова',type:'концерт',occurrence:'6 сентября 15:00',price:'Бесплатно · вход свободный',place:'Храброво · Кирха Святой Барбары',shares:5,likes:17},
  2182:{title:'Песчаная палитра Куршской косы',type:'выставка',occurrence:'11 января 14:00',price:'Бесплатно · вход свободный',place:'Калининград · Калининградская областная научная библиотека',shares:0,likes:0},
  6711:{title:'Выставка «Под шум балтийского ветра»',type:'выставка',occurrence:'6 июля',price:'Бесплатно · вход свободный',place:'Светлогорск · Информационно-туристический центр',shares:5,likes:35},
  7609:{title:'Выставка «Живая нить традиций»',type:'выставка',occurrence:'15 августа 11:00',price:'Бесплатно · вход свободный',place:'Советск · ОКЦ ТеплоСеть',shares:6,likes:48},
};

const VARIANTS={
  'desktop-wide-calendar':{name:'EventCard · Large · Desktop wide · calendar present',viewport:'desktop',group:'events',fixture:8006,x:0,y:120,width:531,height:870.515625,media:617.15625,body:132.609375},
  'desktop-packed-no-calendar':{name:'EventCard · Large · Desktop packed · calendar absent',viewport:'desktop',group:'exhibitions',fixture:2182,x:600,y:120,width:347.328125,height:622.09375,media:345.328125,body:156.015625},
  'mobile-wide-calendar':{name:'EventCard · Large · Mobile wide · calendar present',viewport:'mobile',group:'events',fixture:8006,x:1020,y:120,width:340,height:660.046875,media:394.328125,body:144.96875},
  'mobile-packed-no-calendar':{name:'EventCard · Large · Mobile packed · calendar absent',viewport:'mobile',group:'exhibitions',fixture:2182,x:1430,y:120,width:340,height:603.71875,media:338,body:144.96875},
};

function installUnifiedGoldenEventCards(penpot,penpotUtils,storage){
  const assertContext=()=>{if(penpot.currentFile?.id!==FILE_ID||penpot.currentPage?.name!==PAGE_NAME)throw new Error(`open settled ${PAGE_NAME}`);};
  const componentById=(id)=>penpot.library.local.components.find(c=>c.id===id);
  const componentByIdentity=(path,name)=>penpot.library.local.components.find(c=>c.path===path&&c.name===name);
  const walk=(root)=>{const out=[],q=root?[root]:[];while(q.length){const s=q.shift();out.push(s);if(s.children)q.push(...s.children);}return out;};
  const byName=(root,re)=>walk(root).find(s=>re.test(s.name));
  const place=(shape,x,y,w,h)=>{if(shape.layoutChild)shape.layoutChild.absolute=true;if(w!=null&&h!=null)shape.resize(w,h);penpotUtils.setParentXY(shape,x,y);return shape;};
  const board=(name,x,y,w,h)=>{const s=penpot.createBoard();s.name=name;s.fills=[];s.strokes=[];s.clipContent=false;penpot.currentPage.root.appendChild(s);return place(s,x,y,w,h);};
  const setText=(root,re,value)=>{const s=byName(root,re);if(!s||s.type!=='text')throw new Error(`missing text ${re}`);s.characters=value;return s;};
  const exactText=(shape,size,weight,lineHeight,color,opacity=1)=>{shape.fontFamily='Inter';shape.fontSize=String(size);shape.fontWeight=String(weight);shape.lineHeight=String(lineHeight);shape.letterSpacing='0';shape.fills=[{fillColor:color,fillOpacity:opacity}];};

  function applyFixture(card,id){
    const spec=EVENTS[id];if(!spec)throw new Error(`unknown Golden fixture ${id}`);
    setText(card,/^Content \/ Event title$/,spec.title);setText(card,/^Label \/ instance content$/,spec.type);setText(card,/^(?:Content \/ Event occurrence|schedule)$/,spec.occurrence);setText(card,/^Value \/ instance content$/,spec.price);setText(card,/^Content \/ Event place$/,spec.place);
    for(const count of walk(card).filter(s=>s.type==='text'&&s.name==='Content / Count')){
      const lineage=[];let p=count.parent;while(p&&p!==card){lineage.push(p.name);p=p.parent;}const share=lineage.some(n=>/Share/.test(n));const value=share?spec.shares:spec.likes;count.characters=String(value);count.hidden=value===0;
    }
    const image=storage.freeSepV2Media?.[id];const artwork=byName(card,/^Content \/ media artwork override/);if(image&&artwork)artwork.fills=artwork.fills.map(fill=>fill.fillImage?{...fill,fillImage:image,fillOpacity:1}:fill);
    card.setPluginData('fixture-id',`event.real.${id}`);card.setPluginData('fixture-corpus',CORPUS_ID);
  }

  function applyGeometry(card,key){
    const v=VARIANTS[key];if(!v)throw new Error(`unknown variant ${key}`);const desktop=v.viewport==='desktop',event=v.group==='events';
    place(card,0,0,v.width,v.height);card.clipContent=false;
    const surface=byName(card,/^Card surface \/ dark/),media=byName(card,/^linked Event media frame/),artwork=byName(card,/^Content \/ media artwork override/),body=byName(card,/^Content \/ body/),title=byName(card,/^Content \/ Event title$/),meta=byName(card,/^Meta \/ wrap row$/),placeClip=byName(card,/^Content \/ Event place \/ one-line clip$/),placeText=byName(card,/^Content \/ Event place$/),primary=byName(card,/^Actions \/ primary row$/),feedback=byName(card,/^Actions \/ feedback row \/ transparent$/),calendar=byName(card,/^linked Action \/ Calendar$/);
    if(![surface,media,artwork,body,title,meta,placeClip,placeText,primary,feedback].every(Boolean))throw new Error(`EventCard anatomy incomplete ${key}`);
    const bodyY=v.media+1,primaryY=bodyY+v.body,surfaceH=primaryY+58,inset=14.59375,titleH=desktop?46.625:35.59375,metaH=desktop?(event?28:51.390625):51.390625;
    place(surface,0,0,v.width,surfaceH);surface.borderRadius=24;surface.clipContent=true;surface.fills=[{fillColor:'#15110f',fillOpacity:1}];surface.strokes=[];
    place(media,1,1,v.width-2,v.media);place(artwork,0,0,v.width-2,v.media);
    place(body,0,bodyY,v.width,v.body);body.fills=[{fillColor:'#15110f',fillOpacity:1}];
    place(primary,0,primaryY,v.width,58);primary.fills=[{fillColor:'#15110f',fillOpacity:1}];primary.strokes=[{strokeColor:'#793014',strokeOpacity:.13,strokeStyle:'solid',strokeWidth:1,strokeAlignment:'inner'}];
    place(feedback,1.59375,v.height-56,v.width-3.1875,56);
    place(title,inset,13.59375,v.width-inset*2,titleH);place(meta,inset,13.59375+titleH+8,v.width-inset*2,metaH);place(placeClip,inset,13.59375+titleH+8+metaH+8,v.width-inset*2,17.203125);place(placeText,0,0,v.width-inset*2,17.203125);
    exactText(title,desktop?21.6:16.48,900,1.08,'#ffffff');exactText(placeText,13.76,700,1.25,'#ffffff',.84);placeText.setPluginData('astro-source-font-weight','760');
    if(calendar){place(calendar,desktop?145.125:142.25,1.546875,desktop?147.4375:185.875,44);calendar.hidden=!event;}
    return {key,width:v.width,height:v.height,media:{x:1,y:1,width:v.width-2,height:v.media},bodyY,primaryY,feedbackY:v.height-56};
  }

  function ensureVariant(key){
    assertContext();const v=VARIANTS[key];if(!v)throw new Error(`unknown variant ${key}`);const existing=componentByIdentity(PATH,v.name);if(existing)return {created:false,key,componentId:existing.id,mainId:existing.mainInstance().id};
    const base=componentById(v.viewport==='desktop'?DESKTOP_BASE_ID:MOBILE_BASE_ID);if(!base)throw new Error(`base EventCard missing ${v.viewport}`);
    const root=board(`${PATH} / ${v.name}`,v.x,v.y,v.width,v.height);root.setPluginData('component-family','event-card-large');root.setPluginData('variant-key',key);root.setPluginData('fixture-corpus',CORPUS_ID);root.setPluginData('candidate','true');
    const card=base.instance();card.name=`linked EventCard base / ${key}`;root.appendChild(card);const geometry=applyGeometry(card,key);applyFixture(card,v.fixture);
    const component=penpot.library.local.createComponent([root]);component.path=PATH;component.name=v.name;return {created:true,key,componentId:component.id,mainId:component.mainInstance().id,baseComponentId:card.component()?.id||null,fixture:`event.real.${v.fixture}`,geometry};
  }

  function readback(){
    assertContext();return {pageId:penpot.currentPage.id,pageName:penpot.currentPage.name,variants:Object.entries(VARIANTS).map(([key,v])=>{const c=componentByIdentity(PATH,v.name),m=c?.mainInstance(),card=m?[...m.children].find(s=>s.isComponentCopyInstance?.()):null;return {key,componentId:c?.id||null,mainId:m?.id||null,width:m?.width||null,height:m?.height||null,linkedBase:card?.component?.()?.id||null,fixture:card?.getPluginData?.('fixture-id')||null};}),validation:penpot.currentFile.validate()};
  }

  storage.unifiedGoldenEventCards={ensureVariant,applyFixture,applyGeometry,readback,constants:{FILE_ID,PAGE_NAME,PATH,CORPUS_ID,VARIANTS}};
  return {installed:true,methods:Object.keys(storage.unifiedGoldenEventCards),page:PAGE_NAME,variants:Object.keys(VARIANTS)};
}

if(typeof module!=='undefined')module.exports={installUnifiedGoldenEventCards,EVENTS,VARIANTS};
