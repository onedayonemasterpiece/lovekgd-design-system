/**
 * OV-47 mobile terminal/pagination Search states from measured built Astro.
 * Native shapes only; browser captures are evidence and never become fills.
 */
const FILE_ID='3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID='d87e18f1-dcb4-80a6-8008-880ac732b6ae';
const HEADER_ID='a21f5e36-5d76-8065-8008-86aebfc67027';
const NAV_ID='8e7accff-5c78-8007-8008-89c2fd86089e';
const QUERY_PATH='Search / Runtime query controller';
const OWNER_PATH='Archetype / Search';
const COLLECTION_PATH='Search / Collection links';
const COLLECTION_NAME='viewport=mobile;source-exact-with-notes';
const CARD_PATH='Fixture adapters / Search result';
const CARD_NAME='EventCard large mobile;fixture=event.real.7003;state=fallback';
const EXISTING_RESULTS='viewport=mobile;state=results;count=1;query=послушать хор';
const STATES={
  validation:{query:'я',queryName:'viewport=mobile;state=validation;query=я',ownerName:'viewport=mobile;state=validation;query=я · Astro AS-IS',queryH:470.890625,docH:1612,collectionY:584.484375,x:15920},
  empty:{query:'пустой запрос',queryName:'viewport=mobile;state=empty;count=0;query=пустой запрос',ownerName:'viewport=mobile;state=empty;count=0 · Astro AS-IS',queryH:849.359375,docH:1991,collectionY:962.953125,x:16350},
  error:{query:'ошибка провайдера',queryName:'viewport=mobile;state=error-retry;query=ошибка провайдера',ownerName:'viewport=mobile;state=error-retry · Astro AS-IS',queryH:510.4375,docH:1652,collectionY:624.03125,x:16780},
  loadReady:{query:'пагинация событий',queryName:'viewport=mobile;state=load-more-ready;count=1;query=пагинация событий',ownerName:'viewport=mobile;state=load-more-ready;count=1 · Astro AS-IS',queryH:1262.359375,docH:2404,collectionY:1375.953125,x:17210},
  loadLoading:{query:'пагинация событий',queryName:'viewport=mobile;state=load-more-loading;count=1;query=пагинация событий',ownerName:'viewport=mobile;state=load-more-loading;count=1 · Astro AS-IS',queryH:1291.09375,docH:2432,collectionY:1404.6875,x:17640},
  recovery:{ownerName:'viewport=mobile;state=recovery-after-error;fixture=event.real.7003 · Astro AS-IS',queryH:1400.234375,docH:2544,collectionY:1516.15625,x:18070},
};

function installOv47SearchMobileLifecycle(penpot,penpotUtils,storage){
  const assertContext=()=>{if(penpot.currentFile?.id!==FILE_ID||penpot.currentPage?.id!==PAGE_ID)throw new Error(`open settled Search page ${PAGE_ID}`)};
  const byId=id=>penpot.library.local.components.find(c=>c.id===id);
  const byIdentity=(path,name)=>penpot.library.local.components.find(c=>c.path===path&&c.name===name);
  const place=(s,x,y,w,h)=>{if(s.layoutChild)s.layoutChild.absolute=true;if(w!=null&&h!=null)s.resize(w,h);penpotUtils.setParentXY(s,x,y);return s};
  const board=(parent,name,x,y,w,h,color=null,radius=0,clip=false)=>{const s=penpot.createBoard();s.name=name;s.fills=color?[{fillColor:color,fillOpacity:1}]:[];s.strokes=[];s.borderRadius=radius;s.clipContent=clip;if(parent)parent.appendChild(s);return place(s,x,y,w,h)};
  const rect=(parent,name,x,y,w,h,color,radius=0,opacity=1)=>{const s=penpot.createRectangle();s.name=name;s.fills=[{fillColor:color,fillOpacity:opacity}];s.strokes=[];s.borderRadius=radius;parent.appendChild(s);return place(s,x,y,w,h)};
  const ellipse=(parent,name,x,y,w,h,color)=>{const s=penpot.createEllipse();s.name=name;s.fills=[{fillColor:color,fillOpacity:1}];s.strokes=[];parent.appendChild(s);return place(s,x,y,w,h)};
  const text=(parent,name,chars,x,y,w,h,size,weight,lineHeight,color,align='left')=>{const s=penpot.createText(chars);s.name=name;s.fontFamily='Inter';s.fontStyle='normal';s.fontSize=String(size);s.fontWeight=String(weight);s.lineHeight=String(lineHeight);s.letterSpacing='0';s.align=align;s.fills=[{fillColor:color,fillOpacity:1}];parent.appendChild(s);return place(s,x,y,w,h)};
  const linked=(id,name)=>{const c=byId(id);if(!c)throw new Error(`missing component ${id}`);const s=c.instance();s.name=name;return s};
  const component=root=>penpot.library.local.createComponent([root]);
  const stroke=s=>{s.strokes=[{strokeColor:'#e2d3c7',strokeOpacity:1,strokeStyle:'solid',strokeWidth:1,strokeAlignment:'inner'}]};
  const accountHead=root=>{
    text(root,'Eyebrow / source exact','УМНЫЙ ПОИСК',0,0,250,18,13,800,1.15,'#9a3f20');
    text(root,'Title / source exact','Найти событие',0,28,366,52,40,900,1.02,'#241913');
    text(root,'Description / source exact','Опишите желание обычной фразой —\nжанр, настроение, время или с кем\nхотите пойти.',0,86,366,64,16,500,1.35,'#766b63');
    const chip=board(root,'Account chip / authenticated / source exact',173,156.5,193,56,'#fffdf8',28);stroke(chip);
    ellipse(chip,'Account avatar surface',8,8,40,40,'#e7ece8');
    text(chip,'Account avatar initial','S',8,20,40,18,16,900,1,'#a54420','center');
    text(chip,'Account label','search-evidence@ex…',56,18,125,20,14,800,1.2,'#a54420');
  };
  const form=(root,query,label='Искать')=>{
    rect(root,'Form top divider / source exact',0,226.046875,366,1,'#e8d9cb');
    text(root,'Field label / source exact','ЧТО ХОЧЕТСЯ СДЕЛАТЬ?',0,241.046875,300,18,12,800,1.15,'#b64319');
    text(root,'Query / source exact',query,0,270.046875,366,32,22,700,1.15,'#241913');
    rect(root,'Field underline / source exact',0,356.046875,366,2,'#241913');
    rect(root,'Submit surface / source exact',0,369.046875,366,50,'#221a14',8);
    text(root,'Submit label / source exact',label,0,385.046875,366,18,13,800,1.1,'#fffdf8','center');
    rect(root,'Form bottom divider / source exact',0,435.046875,366,1,'#e8d9cb');
  };
  const heading=(root,y)=>text(root,'Results heading / source exact','Результаты поиска',0,y,366,28,21,800,1.15,'#9a3f20');
  const feedback=(root,y)=>{const f=board(root,'Search feedback / source exact',0,y,366,172,'#fff7ea',20);stroke(f);text(f,'Feedback question','Нашли то, что искали?',14,18,330,24,18,900,1.15,'#241913');const yes=board(f,'Feedback yes',14,54,122,42,'#fffdf8',21);stroke(yes);text(yes,'Feedback yes label','Да, нашёл',0,11,122,20,15,800,1.1,'#9a3f20','center');const no=board(f,'Feedback no',144,54,176,42,'#fffdf8',21);stroke(no);text(no,'Feedback no label','Нет, не нашёл',0,11,176,20,15,800,1.1,'#9a3f20','center');text(f,'Feedback note','Ответ поможет улучшить поиск и будущие\nготовые подборки.',14,116,330,44,15,500,1.4,'#766b63');return f};
  const resultCard=root=>{const c=byIdentity(CARD_PATH,CARD_NAME);if(!c)throw new Error('mobile event.real.7003 adapter missing');const i=c.instance();i.name='linked EventCard / event.real.7003 / source exact';root.appendChild(i);return place(i,0,486.890625,366,656.71875)};
  const makeQuery=(key)=>{
    assertContext();const spec=STATES[key];const existing=byIdentity(QUERY_PATH,spec.queryName);if(existing)return{existing:true,id:existing.id,main:existing.mainInstance().id};
    const block=penpot.history.undoBlockBegin();try{const root=board(null,`${QUERY_PATH} / ${spec.queryName}`,spec.x,2700,366,spec.queryH,null);accountHead(root);form(root,spec.query,key==='loadLoading'?'Ищу…':'Искать');
      if(key==='validation')text(root,'Validation status / source exact','Введите хотя бы 3 символа.',0,447.34375,366,23.546875,15,500,1.3,'#766b63');
      if(key==='error')text(root,'Error status / source exact','Поиск сейчас не сработал. Попробуйте ещё раз чуть позже.',0,447.34375,366,47.09375,15,500,1.3,'#766b63');
      if(key==='empty'){text(root,'Empty status / source exact','Ничего не нашлось. Попробуйте описать\nзапрос иначе.',0,447.34375,366,47.09375,15,500,1.3,'#766b63');heading(root,510.4375);const empty=board(root,'Empty result / source exact',0,549.4375,366,84,'#fff7ea',18);text(empty,'Empty result copy','По вашему запросу ничего не\nнайдено',14,20,338,48,17,800,1.35,'#766b63');feedback(root,666.4375);}
      if(key==='loadReady'||key==='loadLoading'){if(key==='loadLoading'){rect(root,'Submit progress / append / source exact',0,369.046875,100,50,'#a54420',8);text(root,'Submit loading label / source exact','Ищу…',0,385.046875,366,18,13,800,1.1,'#fffdf8','center');text(root,'Progress label / source exact','Открываю следующую страницу…',0,447.34375,366,23.546875,14,800,1.3,'#9a3f20');}text(root,'Quota status / source exact','Осталось поисков: 7 сегодня.',0,key==='loadLoading'?476.078125:447.34375,366,23.546875,15,500,1.3,'#766b63');heading(root,key==='loadLoading'?515.625:486.890625);resultCard(root);const y=key==='loadLoading'?1244.09375:1214.359375;const b=board(root,`Load more / ${key}`,0,y,366,48,'#fffdf8',24);stroke(b);text(b,'Load more label',key==='loadLoading'?'Загружаю ещё…':'Показать ещё',0,15,366,18,13,800,1.1,'#a54420','center');}
      const c=component(root);return{existing:false,id:c.id,main:c.mainInstance().id};
    }finally{penpot.history.undoBlockFinish(block)}};
  const makeOwner=(key)=>{assertContext();const spec=STATES[key];const existing=byIdentity(OWNER_PATH,spec.ownerName);if(existing)return{existing:true,id:existing.id,main:existing.mainInstance().id};const query=key==='recovery'?byIdentity(QUERY_PATH,EXISTING_RESULTS):byIdentity(QUERY_PATH,spec.queryName);const collection=byIdentity(COLLECTION_PATH,COLLECTION_NAME);if(!query||!collection)throw new Error(`missing query/collection for ${key}`);const block=penpot.history.undoBlockBegin();try{const root=board(null,`${OWNER_PATH} / ${spec.ownerName}`,spec.x,-520,390,spec.docH,'#fbf5eb',20,true);stroke(root);const header=linked(HEADER_ID,'linked Shell / Mobile header');root.appendChild(header);place(header,12,0,390,84);const q=query.instance();q.name=`linked Search / Runtime query / ${key}`;root.appendChild(q);place(q,12,96,366,spec.queryH);const col=collection.instance();col.name='linked Search / Collection links / source exact';root.appendChild(col);place(col,12,spec.collectionY,366,855.5625);const nav=linked(NAV_ID,'linked Shell / Mobile bottom navigation / current=search / sticky');root.appendChild(nav);place(nav,12,770,366,64);const c=component(root);return{existing:false,id:c.id,main:c.mainInstance().id,linked:[header.component()?.id,query.id,collection.id,nav.component()?.id]}}finally{penpot.history.undoBlockFinish(block)}};
  const readback=()=>({revision:penpot.currentFile.revn,states:Object.entries(STATES).map(([key,spec])=>{const q=spec.queryName?byIdentity(QUERY_PATH,spec.queryName):null;const o=byIdentity(OWNER_PATH,spec.ownerName);return{key,query:q?{id:q.id,main:q.mainInstance().id,size:[q.mainInstance().width,q.mainInstance().height]}:null,owner:o?{id:o.id,main:o.mainInstance().id,size:[o.mainInstance().width,o.mainInstance().height],direct:[...o.mainInstance().children].map(s=>({name:s.name,componentId:s.component?.()?.id||null,copy:s.isComponentCopyInstance?.()||false,x:s.x-o.mainInstance().x,y:s.y-o.mainInstance().y,width:s.width,height:s.height}))}:null}}),validation:penpot.currentFile.validate()});
  storage.ov47SearchLifecycle={ensureValidationQuery:()=>makeQuery('validation'),ensureEmptyQuery:()=>makeQuery('empty'),ensureErrorQuery:()=>makeQuery('error'),ensureLoadReadyQuery:()=>makeQuery('loadReady'),ensureLoadLoadingQuery:()=>makeQuery('loadLoading'),ensureValidationOwner:()=>makeOwner('validation'),ensureEmptyOwner:()=>makeOwner('empty'),ensureErrorOwner:()=>makeOwner('error'),ensureLoadReadyOwner:()=>makeOwner('loadReady'),ensureLoadLoadingOwner:()=>makeOwner('loadLoading'),ensureRecoveryOwner:()=>makeOwner('recovery'),readback};
  return{installed:true,methods:Object.keys(storage.ov47SearchLifecycle)};
}
if(typeof module!=='undefined')module.exports={installOv47SearchMobileLifecycle,constants:{FILE_ID,PAGE_ID,HEADER_ID,NAV_ID,STATES}};
