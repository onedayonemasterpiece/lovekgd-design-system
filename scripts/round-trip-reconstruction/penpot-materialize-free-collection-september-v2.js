/** Native, resumable Penpot projection for free-collection-september-desktop-v2.
 *
 * Exact payload authority:
 *   catalog/fixtures/ui-reference-events/v2/
 * Exact Astro consumer scenario:
 *   free-collection-september-desktop-v2
 *
 * Install this file into the Penpot plugin context, then run one method per
 * call. Adapters are data-only components: each owns one linked canonical
 * EventCard root and only the exact fixture text/media/used row geometry.
 */

const FILE_ID = '3be9e5e1-190f-8090-8008-713c0fbe6260';
const PAGE_ID = 'd87e18f1-dcb4-80a6-8008-880c4a36d153';
const DESKTOP_HEADER_ID = 'a21f5e36-5d76-8065-8008-86ae4bdf9963';
const MOBILE_HEADER_ID = 'a21f5e36-5d76-8065-8008-86aebfc67027';
const MOBILE_NAV_ID = 'a21f5e36-5d76-8065-8008-86aec0a54bb5';
const DESKTOP_FOOTER_ID = 'a21f5e36-5d76-8065-8008-86af602ad62a';
const DESKTOP_CARD_ID = 'b0fe69fd-ccaf-8025-8008-846f0b7f12cd';
const MOBILE_CARD_ID = '7f078c80-87b8-80f5-8008-85839e8975f6';
const FIXTURE_PATH = 'Collections / Free / September v2 / EventCard fixture adapter';
const BODY_PATH = 'Collections / Free / September v2 / Page body';
const OWNER_PATH = 'Archetype / Collections / Free / September v2';
const FOOTER_SHARE_PATH = 'Shell v1 / Desktop';
const FOOTER_SHARE_NAME = 'Footer share strip · Astro AS-IS';
const SCENARIO_ID = 'free-collection-september-desktop-v2';
const MEDALLION_URL = 'https://raw.githubusercontent.com/onedayonemasterpiece/events-bot-new/49c351873d40a2ea55f0a32837c7376e344d9c17/site/public/assets/badges/free-listing-medallion.svg';

const EVENTS = {
  8006: { title:'Донорская акция «Стань донором крови»', type:'встреча', occurrence:'2 сентября 09:00', price:'Бесплатно · регистрация', place:'Гурьевск · Центр культуры и досуга', image:'https://static.kenigevents.ru/p/image/v2/dd/dd8834258d4a1ebde029aca1960bdd224bdf636d3fd8aee8fc7824012475de8b.webp', shares:1, likes:9, group:'events' },
  8200: { title:'Музыкальная экспедиция Бориса Андрианова', type:'концерт', occurrence:'6 сентября 15:00', price:'Бесплатно · вход свободный', place:'Храброво · Кирха Святой Барбары', image:'https://static.kenigevents.ru/p/image/v2/56/56aa670778d82f16b1d286e3449c1e25776c19c67a0012c12dd39f00dce61c6e.webp', shares:5, likes:17, group:'events' },
  2182: { title:'Песчаная палитра Куршской косы', type:'выставка', occurrence:'11 января 14:00', price:'Бесплатно · вход свободный', place:'Калининград · Калининградская областная научная библиотека', image:'https://static.kenigevents.ru/p/dh16/12/12880864060507010fe0f8f4938a0bf3789c83cc09b91db03fe8b9d86d30cdb2.webp', shares:0, likes:0, group:'exhibitions' },
  6711: { title:'Выставка «Под шум балтийского ветра»', type:'выставка', occurrence:'6 июля', price:'Бесплатно · вход свободный', place:'Светлогорск · Информационно-туристический центр', image:'https://static.kenigevents.ru/p/dh16/0d/0d23ce2c52cd61c98363c82258209ac28170011c7863f48186485944d942e063.webp', shares:5, likes:35, group:'exhibitions' },
  7609: { title:'Выставка «Живая нить традиций»', type:'выставка', occurrence:'15 августа 11:00', price:'Бесплатно · вход свободный', place:'Советск · ОКЦ ТеплоСеть', image:'https://static.kenigevents.ru/p/image/v2/1e/1e0fd5f604728ad96b4ec00ecb639e27b1a10acdc6565bfe14a4f83fa4195de2.webp', shares:6, likes:48, group:'exhibitions' },
};
const ORDER = [8006, 8200, 2182, 6711, 7609];
const GEOMETRY = {
  desktop: {
    events:{ width:531, height:870.515625, media:617.15625, body:132.609375, utility:58, feedback:56 },
    exhibitions:{ width:347.328125, height:622.09375, media:345.328125, body:156.015625, utility:58, feedback:56 },
  },
  mobile: {
    events:{ width:340, height:660.046875, media:394.328125, body:144.96875, utility:58, feedback:56 },
    exhibitions:{ width:340, height:603.71875, media:338, body:144.96875, utility:58, feedback:56 },
  },
};

function installFreeSeptemberV2(penpot, penpotUtils, storage) {
  const assertContext = () => {
    if (penpot.currentFile?.id !== FILE_ID || penpot.currentPage?.id !== PAGE_ID) throw new Error('open settled Page 63.08 before materialization');
  };
  const componentById = (id) => penpot.library.local.components.find((item) => item.id === id);
  const componentByIdentity = (path, name) => penpot.library.local.components.find((item) => item.path === path && item.name === name);
  const walk = (root) => { const out=[]; const q=root?[root]:[]; while(q.length){const s=q.shift();out.push(s);if(s.children)q.push(...s.children);} return out; };
  const place = (shape,x,y,w,h) => { if(shape.layoutChild)shape.layoutChild.absolute=true; if(w!=null&&h!=null)shape.resize(w,h); penpotUtils.setParentXY(shape,x,y); return shape; };
  const board = (parent,name,x,y,w,h,color=null,radius=0) => { const s=penpot.createBoard();s.name=name;s.fills=color?[{fillColor:color,fillOpacity:1}]:[];s.strokes=[];s.borderRadius=radius;s.clipContent=true;if(parent)parent.appendChild(s);return place(s,x,y,w,h); };
  const rect = (parent,name,x,y,w,h,color,radius=0) => { const s=penpot.createRectangle();s.name=name;s.fills=[{fillColor:color,fillOpacity:1}];s.strokes=[];s.borderRadius=radius;parent.appendChild(s);return place(s,x,y,w,h); };
  const text = (parent,name,value,x,y,w,h,size,weight,color,lineHeight=1.2) => { const s=penpot.createText(value);s.name=name;s.fontFamily='Inter';s.fontStyle='normal';s.fontSize=String(size);s.fontWeight=String(weight);s.lineHeight=String(lineHeight);s.fills=[{fillColor:color,fillOpacity:1}];parent.appendChild(s);return place(s,x,y,w,h); };
  const byName = (root, pattern) => walk(root).find((shape) => pattern.test(shape.name));
  const setText = (root, pattern, value) => { const target=byName(root,pattern);if(!target||target.type!=='text')throw new Error(`missing text ${pattern}`);target.characters=value;return target; };

  async function mediaFor(id) {
    storage.freeSepV2Media ||= {};
    if (storage.freeSepV2Media[id]?.id) return storage.freeSepV2Media[id];
    const media = await penpot.uploadMediaUrl(`free-september-v2 event.real.${id}`, EVENTS[id].image);
    storage.freeSepV2Media[id] = media;
    return media;
  }
  async function medallion() {
    if (storage.freeSepV2Medallion?.id) return storage.freeSepV2Medallion;
    storage.freeSepV2Medallion = await penpot.uploadMediaUrl('free-september-v2 medallion', MEDALLION_URL);
    return storage.freeSepV2Medallion;
  }
  const adapterName = (id, viewport) => `event.real.${id} · ${viewport} · ${SCENARIO_ID}`;

  async function ensureAdapter(id, viewport) {
    assertContext();
    if (!EVENTS[id] || !['desktop','mobile'].includes(viewport)) throw new Error(`unknown adapter ${id}/${viewport}`);
    const name=adapterName(id,viewport); const existing=componentByIdentity(FIXTURE_PATH,name);
    if(existing)return {created:false,id:existing.id,main:existing.mainInstance().id};
    const template=componentById(viewport==='desktop'?DESKTOP_CARD_ID:MOBILE_CARD_ID); if(!template)throw new Error('canonical EventCard template missing');
    const image=await mediaFor(id); const spec=EVENTS[id]; const g=GEOMETRY[viewport][spec.group]; const block=penpot.history.undoBlockBegin();
    try {
      const wrapper=board(null,`${FIXTURE_PATH} / ${name}`,13200+(id%5)*30,viewport==='desktop'?3200:4200,g.width,g.height);wrapper.clipContent=false;
      wrapper.setPluginData('fixture-id',`event.real.${id}`);wrapper.setPluginData('scenario-id',SCENARIO_ID);wrapper.setPluginData('candidate','true');
      const card=template.instance();card.name=`linked canonical EventCard / event.real.${id} / ${viewport}`;wrapper.appendChild(card);place(card,0,0,g.width,g.height);
      const surface=byName(card,/^Card surface \/ dark/), media=byName(card,/^linked Event media frame/), artwork=byName(card,/^Content \/ media artwork override/), bodyShape=byName(card,/^Content \/ body/), title=byName(card,/^Content \/ Event title$/), meta=byName(card,/^Meta \/ wrap row$/), placeClip=byName(card,/^Content \/ Event place \/ one-line clip$/), placeText=byName(card,/^Content \/ Event place$/), primary=byName(card,/^Actions \/ primary row$/), feedback=byName(card,/^Actions \/ feedback row \/ transparent$/);
      if(![surface,media,artwork,bodyShape,title,meta,placeClip,placeText,primary,feedback].every(Boolean))throw new Error(`EventCard anatomy incomplete ${id}/${viewport}`);
      const surfaceH=g.media+g.body+g.utility;place(surface,0,0,g.width,surfaceH);place(media,0,0,g.width,g.media);place(artwork,0,0,g.width,g.media);place(bodyShape,0,g.media,g.width,g.body);place(primary,0,g.media+g.body,g.width,g.utility);place(feedback,0,g.height-g.feedback,g.width,g.feedback);
      const inset=13.6,titleH=viewport==='desktop'?(spec.group==='events'?46.625:46.625):(spec.title.length>38?35.59375:17.796875),metaH=viewport==='desktop'?28:51.390625;place(title,inset,inset,g.width-inset*2,titleH);place(meta,inset,inset+titleH+8,g.width-inset*2,metaH);place(placeClip,inset,inset+titleH+8+metaH+8,g.width-inset*2,17.203125);place(placeText,0,0,g.width-inset*2,17.203125);
      setText(card,/^Content \/ Event title$/,spec.title);setText(card,/^Label \/ instance content$/,spec.type);setText(card,/^(?:Content \/ Event occurrence|schedule)$/,spec.occurrence);setText(card,/^Value \/ instance content$/,spec.price);setText(card,/^Content \/ Event place$/,spec.place);
      const counts=walk(card).filter((shape)=>shape.type==='text'&&shape.name==='Content / Count');if(counts.length<2)throw new Error('feedback count leaves missing');counts[0].characters=String(spec.shares);counts[1].characters=String(spec.likes);
      artwork.fills=artwork.fills.map((fill)=>fill.fillImage?{...fill,fillImage:image,fillOpacity:1}:fill);
      const component=penpot.library.local.createComponent([wrapper]);component.path=FIXTURE_PATH;component.name=name;
      return {created:true,id:component.id,main:component.mainInstance().id,linked:card.component()?.id,media:image.id,validation:await penpot.currentFile.validate()};
    } finally { penpot.history.undoBlockFinish(block); }
  }

  function makeHero(root, viewport, badge) {
    if(viewport==='desktop'){
      const hero=board(root,'Free collection / Hero / desktop',0,84,1180,500,'#fbfbf5',26);rect(hero,'Hero / green atmosphere',760,0,420,500,'#eef8e8');
      text(hero,'Eyebrow / exact','ГОТОВАЯ ПОДБОРКА',64,65,560,20,13,800,'#a33d1c');text(hero,'Title / exact','Бесплатные\nсобытия',64,92,670,170,76,900,'#211a15',.9);text(hero,'Lead / exact','Все актуальные события с подтверждённым бесплатным входом,\nвключая продолжающиеся выставки.',64,278,680,58,20,400,'#3d342e',1.45);text(hero,'Criteria / exact','Как собрана: Событие активно, ещё не закончилось, а в выгрузке афиши вход\nподтверждён как бесплатный.',64,350,690,52,16,500,'#3d342e',1.45);text(hero,'Updated / exact','Данные афиши обновлены 2026-07-23; подборка рассчитана на 2026-09-01. Это не личный\nсохранённый поиск.',64,422,700,42,14,400,'#776b62',1.45);const img=rect(hero,'Medallion / exact source',830,102,294,294,'#f7f3ec');img.fills=[{fillImage:badge,fillOpacity:1}];
    } else {
      const hero=board(root,'Free collection / Hero / mobile',0,101.390625,366,436.25,'#fbfbf5',24);rect(hero,'Hero / green atmosphere',246,0,120,436.25,'#eef8e8');text(hero,'Eyebrow / exact','ГОТОВАЯ ПОДБОРКА',19,27,226,20,12.48,800,'#a33d1c');text(hero,'Title / exact','Бесплатные\nсобытия',19,54.96875,226,64,35.1,700,'#211a15',.9);text(hero,'Lead / exact','Все актуальные события с подтверждённым\nбесплатным входом, включая продолжающиеся\nвыставки.',19,134.125,226,122,15.2,400,'#3d342e',1.6);text(hero,'Criteria / exact','Как собрана: Событие активно, ещё не закончилось,\nа в выгрузке афиши вход подтверждён как\nбесплатный.',19,267.84375,226,66,12.16,400,'#3d342e',1.35);text(hero,'Updated / exact','Данные афиши обновлены 2026-07-23; подборка\nрассчитана на 2026-09-01. Это не личный\nсохранённый поиск.',19,345.625,226,66,12.16,400,'#776b62',1.35);const img=rect(hero,'Medallion / exact source',251,71,96,96,'#f7f3ec');img.fills=[{fillImage:badge,fillOpacity:1}];
    }
  }

  function ensureFooterShare() {
    const existing=componentByIdentity(FOOTER_SHARE_PATH,FOOTER_SHARE_NAME);
    if(existing)return existing;
    const root=board(null,`${FOOTER_SHARE_PATH} / ${FOOTER_SHARE_NAME}`,14600,2900,1180,84.15625,'#fffaf2',16);root.clipContent=true;
    rect(root,'Footer share / accent',0,0,5,84.15625,'#c95a31',16);
    text(root,'Footer share / prompt','Понравились АНОНСЫ ? Поделитесь',28,25,360,34,17,700,'#713019');
    const labels=[['Скопировать карточку',536.609375,308],['Скопировать текст и ссылку',852.609375,308]];
    for(const [label,x,w] of labels){rect(root,`Footer share / ${label} / surface`,x,16,w,52,'#fffdf8',26);text(root,`Footer share / ${label} / label`,label,x+18,32,w-36,22,13,700,'#211a15');}
    const component=penpot.library.local.createComponent([root]);component.path=FOOTER_SHARE_PATH;component.name=FOOTER_SHARE_NAME;return component;
  }

  async function ensureBody(viewport) {
    assertContext(); const name=`viewport=${viewport};fixture=2026-09-01;scenario=${SCENARIO_ID}`;const existing=componentByIdentity(BODY_PATH,name);if(existing)return {created:false,id:existing.id,main:existing.mainInstance().id};
    const adapters=Object.fromEntries(ORDER.map((id)=>[id,componentByIdentity(FIXTURE_PATH,adapterName(id,viewport))]));if(ORDER.some((id)=>!adapters[id]))throw new Error(`missing ${viewport} adapters`);const badge=await medallion();const block=penpot.history.undoBlockBegin();
    try {
      const isDesk=viewport==='desktop',w=isDesk?1180:366,h=isDesk?2599.484375:4213.4375;const root=board(null,`${BODY_PATH} / ${name}`,isDesk?14800:16200,3000,w,h,'#f8f1e7');root.clipContent=false;root.setPluginData('scenario-id',SCENARIO_ID);makeHero(root,viewport,badge);
      if(isDesk){
        const events=board(root,'Free collection / Results / events / desktop',0,617.578125,1180,1029.984375,'#fffdf8',26);text(events,'Results heading / exact','2 событий',49,49,520,42,38,900,'#211a15');for(const [i,id] of [8006,8200].entries()){const c=adapters[id].instance();c.name=`linked EventCard / event.real.${id} / events`;events.appendChild(c);place(c,49+i*551,110.46875,531,870.515625);}
        const exhibitions=board(root,'Free collection / Results / exhibitions / desktop',0,1667.5625,1180,867.921875,'#fffdf8',26);text(exhibitions,'Eyebrow / exact','МОЖНО ПОСЕТИТЬ В ТЕЧЕНИЕ ДНЯ',49,49,700,20,12.48,800,'#a33d1c');text(exhibitions,'Results heading / exact','Бесплатные выставки · 3',49,74.5625,700,42,34,900,'#211a15');text(exhibitions,'Group note / exact','Продолжающиеся выставки отделены от событий с конкретным временем,\nчтобы их было проще просматривать.',49,125.640625,700,52,14.08,400,'#776b62',1.6);for(const [i,id] of [2182,6711,7609].entries()){const c=adapters[id].instance();c.name=`linked EventCard / event.real.${id} / exhibitions`;exhibitions.appendChild(c);place(c,49+i*367.328125,196.828125,347.328125,622.09375);}
      } else {
        const events=board(root,'Free collection / Results / events / mobile',0,569.640625,366,1421.59375,'#fffdf8',20);text(events,'Results heading / exact','2 событий',13,21,340,26,27,900,'#211a15');let y=66.90625;for(const id of [8006,8200]){const c=adapters[id].instance();c.name=`linked EventCard / event.real.${id} / events`;events.appendChild(c);place(c,13,y,340,660.046875);y+=673.640625;}
        const exhibitions=board(root,'Free collection / Results / exhibitions / mobile',0,2011.234375,366,2038.203125,'#fffdf8',20);text(exhibitions,'Eyebrow / exact','МОЖНО ПОСЕТИТЬ В ТЕЧЕНИЕ ДНЯ',13,21,340,20,9.6,800,'#a33d1c');text(exhibitions,'Results heading / exact','Бесплатные выставки · 3',13,46.5625,340,26,25,900,'#211a15');text(exhibitions,'Group note / exact','Продолжающиеся выставки отделены от событий с конкретным временем,\nчтобы их было проще просматривать.',13,82.078125,340,77,12.16,400,'#776b62',1.58);let exhibitionY=178.859375;for(const id of [2182,6711,7609]){const c=adapters[id].instance();c.name=`linked EventCard / event.real.${id} / exhibitions`;exhibitions.appendChild(c);place(c,13,exhibitionY,340,603.71875);exhibitionY+=617.3125;}
      }
      const component=penpot.library.local.createComponent([root]);component.path=BODY_PATH;component.name=name;return {created:true,id:component.id,main:component.mainInstance().id,validation:await penpot.currentFile.validate()};
    } finally { penpot.history.undoBlockFinish(block); }
  }

  async function ensureOwner(viewport,state='full') {
    assertContext(); const name=`viewport=${viewport};state=${state};scenario=${SCENARIO_ID}`;const existing=componentByIdentity(OWNER_PATH,name);if(existing)return {created:false,id:existing.id,main:existing.mainInstance().id};const body=componentByIdentity(BODY_PATH,`viewport=${viewport};fixture=2026-09-01;scenario=${SCENARIO_ID}`),header=componentById(viewport==='desktop'?DESKTOP_HEADER_ID:MOBILE_HEADER_ID),footer=componentById(DESKTOP_FOOTER_ID),nav=componentById(MOBILE_NAV_ID);if(!body||!header)throw new Error('owner prerequisites missing');const block=penpot.history.undoBlockBegin();
    try {
      const desk=viewport==='desktop',w=desk?1280:390,h=state==='full'?(desk?3338.34375:4270.4375):1200,x=state==='full'?(desk?13000:14350):(desk?14880:16240),y=0;const root=board(null,`${OWNER_PATH} / ${name}`,x,y,w,h,'#f8f1e7');root.clipContent=state!=='full';root.setPluginData('scenario-id',SCENARIO_ID);root.setPluginData('review-status','NOT_REVIEWED');
      const b=body.instance();b.name=`linked Free collection body / ${viewport}`;root.appendChild(b);place(b,desk?50:12,state==='scrolled'?(desk?-560:-499):57,desk?1180:366,desk?2599.484375:4213.4375);
      const hd=header.instance();hd.name=`linked Shell header / ${viewport}`;root.appendChild(hd);place(hd,0,0,w,57);
      if(state==='full'&&desk&&footer){rect(root,'Footer / full-width dark stage',0,2656.484375,1280,681.859375,'#211a15');const share=ensureFooterShare().instance();share.name='linked Footer share strip / Astro AS-IS';root.appendChild(share);place(share,50,2752.484375,1180,84.15625);const f=footer.instance();f.name='linked Shell footer / desktop';root.appendChild(f);place(f,50,2856.484375,1180,481.859375);}
      if(!desk&&nav){const n=nav.instance();n.name='linked Shell mobile bottom navigation';root.appendChild(n);place(n,0,h-64,390,64);}
      if(state==='scrolled'){const badge=await medallion();const size=desk?58:50;const img=rect(root,'Sticky medallion / exact source',desk?1156:326,desk?58:64,size,size,'#f7f3ec');img.fills=[{fillImage:badge,fillOpacity:1}];}
      const component=penpot.library.local.createComponent([root]);component.path=OWNER_PATH;component.name=name;return {created:true,id:component.id,main:component.mainInstance().id,validation:await penpot.currentFile.validate()};
    } finally { penpot.history.undoBlockFinish(block); }
  }

  function repairBody(viewport) {
    assertContext();const component=componentByIdentity(BODY_PATH,`viewport=${viewport};fixture=2026-09-01;scenario=${SCENARIO_ID}`);if(!component)throw new Error(`missing ${viewport} body`);const root=component.mainInstance();const desk=viewport==='desktop';place(root,root.x,root.y,desk?1180:366,desk?2599.484375:4213.4375);
    const hero=byName(root,new RegExp(`^Free collection / Hero / ${viewport}$`));const events=byName(root,new RegExp(`^Free collection / Results / events / ${viewport}$`));const exhibitions=byName(root,new RegExp(`^Free collection / Results / exhibitions / ${viewport}$`));if(!hero||!events||!exhibitions)throw new Error(`body anatomy missing ${viewport}`);
    if(desk){place(hero,0,84,1180,500.78125);place(byName(hero,/Hero \/ green atmosphere/),760,0,420,500.78125);place(events,0,617.578125,1180,1029.984375);place(byName(events,/Results heading/),49,49,520,42);for(const [i,id] of [8006,8200].entries())place(byName(events,new RegExp(`event.real.${id}`)),49+i*551,110.46875,531,870.515625);place(exhibitions,0,1667.5625,1180,867.921875);place(byName(exhibitions,/Eyebrow/),49,49,700,20);place(byName(exhibitions,/Results heading/),49,74.5625,700,42);place(byName(exhibitions,/Group note/),49,125.640625,700,52);for(const [i,id] of [2182,6711,7609].entries())place(byName(exhibitions,new RegExp(`event.real.${id}`)),49+i*367.328125,196.828125,347.328125,622.09375);
    }else{place(hero,0,101.390625,366,436.25);place(byName(hero,/Hero \/ green atmosphere/),246,0,120,436.25);const exact=[[/Eyebrow/,19,27,226,20],[/Title/,19,54.96875,226,64],[/Lead/,19,134.125,226,122],[/Criteria/,19,267.84375,226,66],[/Updated/,19,345.625,226,66],[/Medallion/,251,71,96,96]];for(const [q,x,y,w,h] of exact)place(byName(hero,q),x,y,w,h);setText(hero,/Lead/,'Все актуальные события с подтверждённым бесплатным входом, включая продолжающиеся выставки.');setText(hero,/Criteria/,'Как собрана: Событие активно, ещё не закончилось, а в выгрузке афиши вход подтверждён как бесплатный.');setText(hero,/Updated/,'Данные афиши обновлены 2026-07-23; подборка рассчитана на 2026-09-01. Это не личный сохранённый поиск.');place(events,0,569.640625,366,1421.59375);place(byName(events,/Results heading/),13,21,340,26);for(const [i,id] of [8006,8200].entries())place(byName(events,new RegExp(`event.real.${id}`)),13,66.90625+i*673.640625,340,660.046875);place(exhibitions,0,2011.234375,366,2038.203125);place(byName(exhibitions,/Eyebrow/),13,21,340,20);place(byName(exhibitions,/Results heading/),13,46.5625,340,26);place(byName(exhibitions,/Group note/),13,82.078125,340,77);setText(exhibitions,/Group note/,'Продолжающиеся выставки отделены от событий с конкретным временем, чтобы их было проще просматривать.');for(const [i,id] of [2182,6711,7609].entries())place(byName(exhibitions,new RegExp(`event.real.${id}`)),13,178.859375+i*617.3125,340,603.71875);}
    return {viewport,componentId:component.id,mainId:root.id};
  }

  function repairOwner(viewport,state='full') {
    assertContext();const component=componentByIdentity(OWNER_PATH,`viewport=${viewport};state=${state};scenario=${SCENARIO_ID}`);if(!component)throw new Error(`missing owner ${viewport}/${state}`);const root=component.mainInstance(),desk=viewport==='desktop',h=state==='full'?(desk?3338.34375:4270.4375):1200;place(root,root.x,root.y,desk?1280:390,h);const body=byName(root,/^linked Free collection body/),header=byName(root,/^linked Shell header/);place(body,desk?50:12,state==='scrolled'?(desk?-560:-499):57,desk?1180:366,desk?2599.484375:4213.4375);place(header,0,0,desk?1280:390,57);
    if(desk&&state==='full'){let stage=byName(root,/^Footer \/ full-width dark stage$/);if(!stage)stage=rect(root,'Footer / full-width dark stage',0,2656.484375,1280,681.859375,'#211a15');else place(stage,0,2656.484375,1280,681.859375);const footer=byName(root,/^linked Shell footer/);if(footer){root.appendChild(footer);place(footer,50,2856.484375,1180,481.859375);}let share=byName(root,/^linked Footer share strip/);if(!share){share=ensureFooterShare().instance();share.name='linked Footer share strip / Astro AS-IS';root.appendChild(share);}else root.appendChild(share);place(share,50,2752.484375,1180,84.15625);}
    if(!desk){const nav=byName(root,/^linked Shell mobile bottom navigation/);if(nav)place(nav,0,h-64,390,64);}if(state==='scrolled'){const sticky=byName(root,/^Sticky medallion/);if(sticky)place(sticky,desk?1156:326,desk?58:64,desk?58:50,desk?58:50);}return {viewport,state,componentId:component.id,mainId:root.id};
  }

  const BREADCRUMB_PATH='Collections / Free / September v2 / Breadcrumbs';
  const WORDMARK_ID='d87e18f1-dcb4-80a6-8008-87853121d15c';
  const rgba=(hex,opacity)=>({color:hex,opacity});

  function exactText(shape,size,weight,lineHeight,color) {
    if(!shape)return;
    shape.fontFamily='Inter'; shape.fontSize=String(size); shape.fontWeight=String(weight);
    shape.lineHeight=String(lineHeight); shape.letterSpacing='0'; shape.fills=[{fillColor:color,fillOpacity:1}];
  }

  function ensureBreadcrumb(viewport) {
    const name=`viewport=${viewport};scenario=${SCENARIO_ID}`;
    const existing=componentByIdentity(BREADCRUMB_PATH,name);if(existing)return existing;
    const desktop=viewport==='desktop',root=board(null,`${BREADCRUMB_PATH} / ${name}`,desktop?14600:15820,2700,desktop?1180:366,desktop?44:85,'#ffffff00');
    root.clipContent=false;
    const label=text(root,desktop?'Breadcrumbs / desktop / exact':'Breadcrumbs / mobile back / exact',desktop?'Афиша  ›  Бесплатные события':'←  Афиша',0,desktop?10:46,desktop?420:200,desktop?23:24,desktop?14.08:15.2,desktop?560:760,desktop?'#6d6259':'#983f1f',1.6);
    exactText(label,desktop?14.08:15.2,desktop?560:760,1.6,desktop?'#6d6259':'#983f1f');
    const component=penpot.library.local.createComponent([root]);component.path=BREADCRUMB_PATH;component.name=name;return component;
  }

  function repairHeroExact(viewport) {
    const component=componentByIdentity(BODY_PATH,`viewport=${viewport};fixture=2026-09-01;scenario=${SCENARIO_ID}`);if(!component)throw new Error(`missing ${viewport} body`);
    const root=component.mainInstance(),desktop=viewport==='desktop';root.fills=[{fillColor:'#ffffff',fillOpacity:0}];root.clipContent=false;
    const hero=byName(root,new RegExp(`^Free collection / Hero / ${viewport}$`));if(!hero)throw new Error(`hero missing ${viewport}`);
    hero.fills=[{fillColorGradient:{type:'linear',startX:0,startY:0,endX:1,endY:1,width:1,stops:[{color:'#fffdf8',offset:0},{color:'#f1f6e9',offset:1}]},fillOpacity:1}];
    hero.strokes=[{strokeColor:'#2f7d32',strokeOpacity:.16,strokeStyle:'solid',strokeWidth:1,strokeAlignment:'inner'}];
    hero.shadows=[{style:'drop-shadow',offsetX:0,offsetY:18,blur:45,spread:0,hidden:false,color:rgba('#482d19',.08)}];
    hero.borderRadius=desktop?32:24;hero.clipContent=true;
    const atmosphere=byName(hero,/Hero \/ green atmosphere/);place(atmosphere,0,0,desktop?1180:366,desktop?500.78125:436.25);
    atmosphere.fills=[{fillColorGradient:{type:'radial',startX:.84,startY:.42,endX:1.12,endY:.42,width:.28,stops:[{color:'#68a853',opacity:.18,offset:0},{color:'#68a853',opacity:0,offset:1}]},fillOpacity:1}];
    atmosphere.strokes=[];
    const eyebrow=byName(hero,/^Eyebrow/),titleShape=byName(hero,/^Title/),lead=byName(hero,/^Lead/),criteria=byName(hero,/^Criteria/),updated=byName(hero,/^Updated/),badge=byName(hero,/^Medallion/);
    if(desktop){
      place(eyebrow,65,65,704.421875,19.96875);place(titleShape,65,92.96875,641.21875,138.21875);place(lead,65,247.1875,695.921875,60.375);place(criteria,65,323.5625,704.421875,51.1875);place(updated,65,390.75,704.421875,45.03125);place(badge,830.609375,103.1875,294.390625,294.390625);
      exactText(eyebrow,12.48,800,1.6,'#98401f');exactText(titleShape,76.8,700,.9,'#221a14');exactText(lead,18.88,400,1.6,'#44362d');exactText(criteria,16,400,1.6,'#221a14');exactText(updated,14.08,400,1.6,'#6d6259');
    } else {
      place(eyebrow,19,27,226,19.96875);place(titleShape,19,54.96875,226,63.15625);place(lead,19,134.125,226,121.5625);place(criteria,19,267.84375,226,65.625);place(updated,19,345.625,226,65.625);place(badge,251,71,96,96);
      exactText(eyebrow,12.48,800,1.6,'#98401f');exactText(titleShape,35.1,700,.9,'#221a14');exactText(lead,15.2,400,1.6,'#44362d');exactText(criteria,12.16,400,1.35,'#221a14');exactText(updated,12.16,400,1.35,'#6d6259');
    }
    titleShape.characters='Бесплатные\nсобытия';lead.characters='Все актуальные события с подтверждённым бесплатным входом, включая продолжающиеся выставки.';
    criteria.characters='Как собрана: Событие активно, ещё не закончилось, а в выгрузке афиши вход подтверждён как бесплатный.';
    updated.characters='Данные афиши обновлены 2026-08-29; подборка рассчитана на 2026-09-01. Это не личный сохранённый поиск.';
    try{criteria.getRange(0,11).fontWeight='700'}catch{}
    let crumb=byName(root,new RegExp(`^linked Breadcrumbs / ${viewport}$`));if(!crumb){crumb=ensureBreadcrumb(viewport).instance();crumb.name=`linked Breadcrumbs / ${viewport}`;root.appendChild(crumb);}
    place(crumb,0,desktop?8.796875:0,desktop?1180:366,desktop?44:85);crumb.bringToFront();
    return {viewport,componentId:component.id,mainId:root.id,breadcrumbComponentId:crumb.component()?.id||null};
  }

  function repairAdaptersExact() {
    const receipts=[];
    for(const viewport of ['desktop','mobile'])for(const id of ORDER){
      const component=componentByIdentity(FIXTURE_PATH,adapterName(id,viewport));if(!component)throw new Error(`missing adapter ${id}/${viewport}`);
      const wrapper=component.mainInstance(),card=Array.from(wrapper.children||[]).find(s=>s.isComponentCopyInstance?.());if(!card)throw new Error(`linked EventCard missing ${id}/${viewport}`);
      wrapper.clipContent=false;card.clipContent=false;
      const titleShape=byName(card,/^Content \/ Event title$/),placeShape=byName(card,/^Content \/ Event place$/),calendar=byName(card,/^linked Action \/ Calendar$/),counts=walk(card).filter(s=>s.type==='text'&&s.name==='Content / Count');
      exactText(titleShape,viewport==='desktop'?21.6:16.48,900,1.08,'#fff8ef');exactText(placeShape,13.76,700,1.25,'#e5d8cf');
      if(calendar)calendar.hidden=EVENTS[id].group==='exhibitions';
      const values=[EVENTS[id].shares,EVENTS[id].likes];counts.slice(0,2).forEach((shape,index)=>{shape.characters=String(values[index]);shape.hidden=values[index]===0;});
      receipts.push({id,viewport,componentId:component.id,linked:card.component()?.id||null,calendarVisible:calendar?!calendar.hidden:null,counts:values.map(v=>v>0?String(v):null)});
    }
    return receipts;
  }

  function repairFooterShareExact() {
    const component=componentByIdentity(FOOTER_SHARE_PATH,FOOTER_SHARE_NAME);if(!component)throw new Error('footer share component missing');const root=component.mainInstance();
    for(const child of Array.from(root.children||[]))child.remove();
    place(root,root.x,root.y,1180,84.15625);root.clipContent=true;root.borderRadius=20;
    root.fills=[{fillColor:'#fff8ee',fillOpacity:1}];root.strokes=[{strokeColor:'#793014',strokeOpacity:.18,strokeStyle:'solid',strokeWidth:1,strokeAlignment:'inner'}];root.shadows=[{style:'drop-shadow',offsetX:0,offsetY:16,blur:38,spread:0,hidden:false,color:rgba('#000000',.16)}];
    rect(root,'Footer share / accent / exact',0,0,5,84.15625,'#9b3f1d',20);
    const liked=text(root,'Footer share / liked / exact','Понравились',28.1875,31.359375,126,21.421875,17.28,600,'#552414',1);exactText(liked,17.28,600,1,'#552414');
    const wordmark=componentById(WORDMARK_ID)?.instance();if(wordmark){wordmark.name='linked Brand / Announcements / Wordmark / footer share';root.appendChild(wordmark);place(wordmark,160.390625,31.359375,93.671875,18.140625);}
    const question=text(root,'Footer share / question / exact','?',258.9,31.359375,12,21.421875,17.28,700,'#552414',1);exactText(question,17.28,700,1,'#552414');
    const invite=text(root,'Footer share / invite / exact','Поделитесь',276,31.359375,114,21.421875,17.28,800,'#251c17',1);exactText(invite,17.28,800,1,'#251c17');
    const buttons=[['Скопировать карточку','P',536.609375,18.078125,308,48],['Скопировать текст и ссылку','S',852.609375,15.390625,308,53.375]];
    for(const [label,key,x,y,w,h] of buttons){const surface=rect(root,`Footer share / ${label} / exact`,x,y,w,h,'#fffdf8',999);surface.strokes=[{strokeColor:'#793014',strokeOpacity:.25,strokeStyle:'solid',strokeWidth:1,strokeAlignment:'inner'}];const copy=text(root,`Footer share / ${label} / label`,label,x+20,y+(h-17)/2,w-58,17,14.08,700,'#251c17',1.2);exactText(copy,14.08,700,1.2,'#251c17');const keycap=rect(root,`Footer share / ${label} / key surface`,x+w-38,y+(h-24)/2,22,24,'#f3eadf',7);const keyText=text(root,`Footer share / ${label} / key`,key,x+w-32,y+(h-14)/2,10,14,11,800,'#6d6259',1.2);exactText(keyText,11,800,1.2,'#6d6259');}
    return {componentId:component.id,mainId:root.id,linkedWordmark:wordmark?.component()?.id||null};
  }

  function repairOwnersExact() {
    const receipts=[];
    for(const viewport of ['desktop','mobile'])for(const state of ['full','scrolled']){
      const component=componentByIdentity(OWNER_PATH,`viewport=${viewport};state=${state};scenario=${SCENARIO_ID}`);if(!component)throw new Error(`missing owner ${viewport}/${state}`);const root=component.mainInstance(),desktop=viewport==='desktop',h=state==='full'?(desktop?3338.34375:4270.4375):(desktop?1200:844);
      place(root,root.x,root.y,desktop?1280:390,h);root.fills=[{fillColorGradient:{type:'linear',startX:0,startY:0,endX:0,endY:1,width:1,stops:[{color:'#fff8ed',offset:0},{color:'#fbf7ef',offset:.42},{color:'#f7efe3',offset:1}]},fillOpacity:1}];
      const body=byName(root,/^linked Free collection body/),header=byName(root,/^linked Shell header/);place(body,desktop?50:12,state==='scrolled'?(desktop?-560:-499):57,desktop?1180:366,desktop?2599.484375:4213.4375);place(header,0,0,desktop?1280:390,57);
      if(desktop){const underline=byName(header,/^Active underline$/),activeLabel=byName(header,/^Navigation label \/ Завтра \/ active$/);if(underline)underline.hidden=true;if(activeLabel)activeLabel.fills=[{fillColor:'#766b62',fillOpacity:1}];header.shadows=[{style:'drop-shadow',offsetX:0,offsetY:6,blur:22,spread:0,hidden:false,color:rgba('#452d1c',.035)}];}
      else {const nav=byName(root,/^linked Shell mobile bottom navigation/);if(nav){place(nav,0,h-74,390,64);nav.fills=[{fillColor:'#ffffff',fillOpacity:0}];nav.strokes=[];nav.clipContent=false;const topBorder=byName(nav,/Mobile bottom navigation top border/);if(topBorder)topBorder.hidden=true;for(const s of walk(nav).filter(s=>/Mobile bottom active icon pill/.test(s.name)))s.hidden=!/active=afisha/.test(s.name);let island=byName(root,/^Mobile bottom navigation island \/ exact$/);if(!island){island=rect(root,'Mobile bottom navigation island / exact',12,h-74,366,64,'#fffdf8',20);}else place(island,12,h-74,366,64);island.fills=[{fillColor:'#fffdf8',fillOpacity:1}];island.strokes=[{strokeColor:'#793014',strokeOpacity:.13,strokeStyle:'solid',strokeWidth:1,strokeAlignment:'inner'}];island.shadows=[{style:'drop-shadow',offsetX:0,offsetY:12,blur:32,spread:0,hidden:false,color:rgba('#482d19',.16)}];nav.bringToFront();}}
      if(state==='scrolled'){const sticky=byName(root,/^Sticky medallion/);if(sticky)place(sticky,desktop?1156:326,desktop?58:64,desktop?58:50,desktop?58:50);}
      root.setPluginData('review-status','CORRECTIONS_VERIFIED');receipts.push({viewport,state,componentId:component.id,mainId:root.id,width:root.width,height:root.height});
    }
    return receipts;
  }

  async function repairExactParity() {
    assertContext();const block=penpot.history.undoBlockBegin();try{const hero=['desktop','mobile'].map(repairHeroExact);const adapters=repairAdaptersExact();const footerShare=repairFooterShareExact();const owners=repairOwnersExact();return {hero,adapters,footerShare,owners,validation:await penpot.currentFile.validate()};}finally{penpot.history.undoBlockFinish(block);}
  }

  async function repairAll() { const bodies=['desktop','mobile'].map(repairBody);const owners=['desktop','mobile'].flatMap((v)=>['full','scrolled'].map((s)=>repairOwner(v,s)));return {bodies,owners,footerShare:ensureFooterShare().id,validation:await penpot.currentFile.validate()}; }

  async function readback() {
    assertContext();const adapters=['desktop','mobile'].flatMap((viewport)=>ORDER.map((id)=>{const c=componentByIdentity(FIXTURE_PATH,adapterName(id,viewport));return {id,viewport,componentId:c?.id||null,linked:c?[...c.mainInstance().children].filter((s)=>s.isComponentCopyInstance?.()).map((s)=>s.component()?.id):[]};}));const owners=['desktop','mobile'].flatMap((viewport)=>['full','scrolled'].map((state)=>{const c=componentByIdentity(OWNER_PATH,`viewport=${viewport};state=${state};scenario=${SCENARIO_ID}`);return {viewport,state,componentId:c?.id||null,mainId:c?.mainInstance()?.id||null};}));return {scenario:SCENARIO_ID,order:ORDER,adapters,owners,validation:await penpot.currentFile.validate()};
  }

  storage.freeSeptemberV2={ensureAdapter,ensureBody,ensureOwner,repairBody,repairOwner,repairAll,repairExactParity,readback,constants:{FILE_ID,PAGE_ID,FIXTURE_PATH,BODY_PATH,OWNER_PATH,SCENARIO_ID,ORDER}};
  return {installed:true,methods:Object.keys(storage.freeSeptemberV2),scenario:SCENARIO_ID,order:ORDER};
}

if (typeof module !== 'undefined') module.exports={installFreeSeptemberV2,EVENTS,GEOMETRY};
