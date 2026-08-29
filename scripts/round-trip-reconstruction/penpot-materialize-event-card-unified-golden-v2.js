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
const CALENDAR_ACTION_ID='c0d4e5a2-7db6-80c7-8008-81f1911414a5';
const CORPUS_ID='ui-reference-events.v2';
const PACKED_PLACE={2182:'Калининград · Калининградская…',6711:'Светлогорск · Информационно-…'};

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
  const autoText=(shape,size,weight,lineHeight,color,opacity=1)=>{exactText(shape,size,weight,lineHeight,color,opacity);shape.growType='auto-width';if(shape.layoutChild){shape.layoutChild.absolute=false;shape.layoutChild.horizontalSizing='auto';shape.layoutChild.verticalSizing='auto';}};

  function applyNestedAstroGeometry(card,key){
    const v=VARIANTS[key],desktop=v.viewport==='desktop',event=v.group==='events';
    const meta=byName(card,/^Meta \/ wrap row$/),type=byName(card,/^linked Meta \/ Event type$/),typeLabel=byName(card,/^Label \/ instance content$/),occurrence=byName(card,/^(?:Content \/ Event occurrence|schedule)$/),admission=byName(card,/^linked Meta \/ Admission$/),admissionLabel=byName(card,/^Value \/ instance content$/);
    if(![meta,type,typeLabel,occurrence,admission,admissionLabel].every(Boolean))throw new Error(`EventCard meta anatomy incomplete ${key}`);
    meta.flex.wrap='nowrap';meta.flex.alignItems='start';meta.flex.alignContent='start';meta.flex.justifyContent='start';meta.flex.rowGap=5.12;meta.flex.columnGap=6.72;
    type.flex.leftPadding=0;type.flex.rightPadding=0;type.flex.topPadding=0;type.flex.bottomPadding=0;type.flex.horizontalSizing='fix';type.flex.verticalSizing='fix';place(type,0,0,event?67.390625:76.84375,18.28125);type.layoutChild.absolute=true;
    place(typeLabel,7.04,2.24,event?53.310625:62.76375,13.824);exactText(typeLabel,11.52,900,1.2,'#ffffff');typeLabel.growType='fixed';typeLabel.layoutChild.absolute=true;
    place(occurrence,event?74.109375:83.5625,.9375,event?128.671875:128,16.40625);exactText(occurrence,13.12,800,1.25,'#ffffff',.84);occurrence.growType='fixed';occurrence.layoutChild.absolute=true;occurrence.setPluginData('astro-source-font-weight','750');
    const admissionInline=desktop&&event,admissionX=admissionInline?209.5:0,admissionWidth=event?192.75:219.84375;
    admission.flex.leftPadding=0;admission.flex.rightPadding=0;admission.flex.topPadding=0;admission.flex.bottomPadding=0;admission.flex.horizontalSizing='fix';admission.flex.verticalSizing='fix';place(admission,admissionX,admissionInline?0:23.390625,admissionWidth,28);admission.layoutChild.absolute=true;
    place(admissionLabel,8.8,7.1,admissionWidth-17.6,13.8);exactText(admissionLabel,12,900,1.15,'#dff7f1');admissionLabel.growType='fixed';admissionLabel.layoutChild.absolute=true;admissionLabel.setPluginData('astro-source-font-weight','850');

    const primary=byName(card,/^Actions \/ primary row$/),negative=byName(card,/^linked Action \/ Not interested$/),negativeIcon=byName(negative,/^linked Icon \/ UI \/ Dislike/),negativeLabel=byName(negative,/^Content \/ Action label$/);
    if(![primary,negative,negativeIcon,negativeLabel].every(Boolean))throw new Error(`EventCard utility anatomy incomplete ${key}`);
    const negativeX=desktop?13.46875:11.875,negativeY=5.40625;
    place(negative,negativeX,negativeY,124.9375,36.28125);negative.layoutChild.absolute=true;
    place(negativeIcon,4.515625,10.140625,16,16);place(negativeLabel,27.234375,8.671875,93.1875,18.9375);exactText(negativeLabel,11.84,900,1.6,'#ffffff',.56);
    let calendar=byName(card,/^linked Action \/ Calendar$/);if(calendar){
      const target=componentById(CALENDAR_ACTION_ID);
      if(target&&calendar.component?.()?.id!==target.id)calendar.swapComponent(target);
      const calendarIcon=byName(calendar,/^linked Icon \/ UI \/ Calendar/),calendarLabel=byName(calendar,/^Content \/ Action label$/);
      if(calendarIcon&&calendarLabel){place(calendarIcon,11.875,12,20,20);place(calendarLabel,38.59375,11.5,96.96875,21);}
    }

    const feedback=byName(card,/^Actions \/ feedback row \/ transparent$/),shareAction=byName(card,/^Event cards \/ Shared \/ Action \/ Share action$/),share=byName(card,/^linked Social proof \/ Share \/ count-owned$/),shareIcon=byName(share,/^linked Icon \/ UI \/ Share/),shareLabel=byName(share,/^Content \/ Action label$/),shareCount=walk(share).find(s=>s.type==='text'&&s.name==='Content / Count'),likeAction=byName(card,/^linked Action \/ Like \/ count inside$/),like=byName(card,/^linked Social proof \/ Like \/ count-owned$/),likeIcon=byName(like,/^linked Icon \/ UI \/ Heart/),likeCount=walk(like).find(s=>s.type==='text'&&s.name==='Content / Count');
    if(![feedback,shareAction,share,shareIcon,shareLabel,shareCount,likeAction,like,likeIcon,likeCount].every(Boolean))throw new Error(`EventCard feedback anatomy incomplete ${key}`);
    if(!feedback.flex)feedback.addFlexLayout();feedback.flex.dir='row';feedback.flex.wrap='nowrap';feedback.flex.horizontalSizing='fix';feedback.flex.verticalSizing='fix';feedback.flex.leftPadding=0;feedback.flex.rightPadding=0;feedback.flex.topPadding=0;feedback.flex.bottomPadding=0;
    feedback.flex.alignItems='center';feedback.flex.justifyContent='end';feedback.flex.columnGap=desktop?4.8:5.44;
    for(const action of [shareAction,likeAction]){action.layoutChild.absolute=false;action.layoutChild.horizontalSizing='auto';action.layoutChild.verticalSizing='fix';action.flex.horizontalSizing='auto';action.flex.verticalSizing='fix';}
    shareAction.flex.leftPadding=desktop?5.4625:5.48;shareAction.flex.rightPadding=desktop?5.4625:5.48;
    likeAction.flex.leftPadding=5.48;likeAction.flex.rightPadding=5.48;
    share.flex.columnGap=6.72;share.flex.horizontalSizing='auto';share.layoutChild.absolute=false;share.layoutChild.horizontalSizing='auto';shareIcon.resize(desktop?20.48:18.88,desktop?20.48:18.88);exactText(shareLabel,desktop?13.44:13.12,900,1.6,'#3a3028',.70);shareLabel.growType='fixed';shareLabel.resize(desktop?92.59375:90.328125,desktop?21.5:21);shareLabel.layoutChild.absolute=false;shareLabel.layoutChild.horizontalSizing='fix';autoText(shareCount,desktop?13.44:13.12,900,1.6,'#3a3028',.70);
    like.flex.columnGap=6.72;like.flex.horizontalSizing='auto';like.layoutChild.absolute=false;like.layoutChild.horizontalSizing='auto';like.layoutChild.minWidth=desktop?33.04:33.04;likeIcon.resize(20,20);autoText(likeCount,15.68,900,1.6,'#ff5267');
    return {key,meta:'astro-wrap',utility:'astro-split-actions',feedback:'content-sized-end-aligned'};
  }

  function applyFixture(card,id){
    const spec=EVENTS[id];if(!spec)throw new Error(`unknown Golden fixture ${id}`);
    setText(card,/^Content \/ Event title$/,spec.title);setText(card,/^Label \/ instance content$/,spec.type);setText(card,/^(?:Content \/ Event occurrence|schedule)$/,spec.occurrence);setText(card,/^Value \/ instance content$/,spec.price);setText(card,/^Content \/ Event place$/,card.width<400?(PACKED_PLACE[id]||spec.place):spec.place);
    for(const count of walk(card).filter(s=>s.type==='text'&&s.name==='Content / Count')){
      const lineage=[];let p=count.parent;while(p&&p!==card){lineage.push(p.name);p=p.parent;}const share=lineage.some(n=>/Share/.test(n));const value=share?spec.shares:spec.likes;count.characters=String(value);count.hidden=value===0;
    }
    const shareAction=byName(card,/^Event cards \/ Shared \/ Action \/ Share action$/),share=byName(card,/^linked Social proof \/ Share \/ count-owned$/),shareCount=walk(share).find(s=>s.type==='text'&&s.name==='Content / Count'),likeAction=byName(card,/^linked Action \/ Like \/ count inside$/),like=byName(card,/^linked Social proof \/ Like \/ count-owned$/),likeCount=walk(like).find(s=>s.type==='text'&&s.name==='Content / Count');
    if([shareAction,share,shareCount,likeAction,like,likeCount].every(Boolean)){
      const shareDigits=String(spec.shares).length,likeDigits=String(spec.likes).length;
      const shareCountWidth=shareDigits===1?9.359375:18.71875,shareActionWidth=spec.shares===0?130.71875:146.796875+(shareDigits-1)*9.359375;
      const likeCountWidth=likeDigits===1?10.90625:21.8125,likeActionWidth=spec.likes===0?44:(likeDigits===1?48.5625:59.46875);
      shareCount.growType='fixed';shareCount.resize(shareCountWidth,21.5);shareCount.layoutChild.horizontalSizing='fix';shareAction.layoutChild.horizontalSizing='fix';shareAction.resize(shareActionWidth,44);share.flex.horizontalSizing='fix';share.resize(shareActionWidth-(card.width<400?10.925:10.925),44);
      likeCount.growType='fixed';likeCount.resize(likeCountWidth,25.09375);likeCount.layoutChild.horizontalSizing='fix';likeAction.layoutChild.horizontalSizing='fix';likeAction.resize(likeActionWidth,44);like.flex.horizontalSizing='fix';like.resize(likeActionWidth-10.96,44);
    }
    const image=storage.freeSepV2Media?.[id],frame=byName(card,/^linked Event media frame/),artwork=byName(card,/^Content \/ media artwork override/);
    if(image&&artwork){
      artwork.fills=artwork.fills.map(fill=>fill.fillImage?{...fill,fillImage:image,fillOpacity:1}:fill);
      if(frame&&image.width&&image.height){
        const sourceRatio=image.width/image.height,frameRatio=frame.width/frame.height;
        let width,height,x,y;
        if(sourceRatio>frameRatio){height=frame.height;width=height*sourceRatio;x=(frame.width-width)/2;y=0;}
        else {width=frame.width;height=width/sourceRatio;x=0;y=(frame.height-height)/2;}
        frame.clipContent=true;place(artwork,x,y,width,height);artwork.setPluginData('media-fit','cover');artwork.setPluginData('media-position','center');
      }
    }
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
    exactText(title,desktop?23.52:17.92,900,desktop?.992:.9932,'#ffffff');exactText(placeText,13.76,800,1.25,'#ffffff',.84);placeText.setPluginData('astro-source-font-weight','760');
    if(calendar){place(calendar,desktop?145.125:142.25,1.546875,desktop?147.4375:185.875,44);calendar.hidden=!event;}
    const nested=applyNestedAstroGeometry(card,key);
    return {key,width:v.width,height:v.height,media:{x:1,y:1,width:v.width-2,height:v.media},bodyY,primaryY,feedbackY:v.height-56,nested};
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

  function repairVariant(key){
    assertContext();const v=VARIANTS[key],component=componentByIdentity(PATH,v.name);if(!component)throw new Error(`missing unified EventCard ${key}`);const root=component.mainInstance(),card=[...root.children].find(s=>s.isComponentCopyInstance?.());if(!card)throw new Error(`missing linked base ${key}`);const geometry=applyGeometry(card,key);applyFixture(card,v.fixture);return {key,componentId:component.id,mainId:root.id,baseComponentId:card.component()?.id||null,geometry};
  }

  async function repairAll(){const variants=Object.keys(VARIANTS).map(repairVariant);return {variants,validation:await penpot.currentFile.validate()};}

  storage.unifiedGoldenEventCards={ensureVariant,repairVariant,repairAll,applyFixture,applyGeometry,readback,constants:{FILE_ID,PAGE_NAME,PATH,CORPUS_ID,VARIANTS}};
  return {installed:true,methods:Object.keys(storage.unifiedGoldenEventCards),page:PAGE_NAME,variants:Object.keys(VARIANTS)};
}

if(typeof module!=='undefined')module.exports={installUnifiedGoldenEventCards,EVENTS,VARIANTS};
