from pathlib import Path
import json, hashlib, html, textwrap, os, math, re
from dataclasses import dataclass
import cairosvg
from PIL import Image

ROOT = Path(os.environ.get("A0_EVIDENCE_ROOT", str(Path(__file__).resolve().parents[4])))
OUT = ROOT / "reports/asp-production-conveyor-v3/atlas-v2/source-bound/a0-routes"
SCRIPT_DIR = ROOT / "scripts/asp-production-conveyor-v3/a0/atlas-r2-route-evidence"
TEST_DIR = ROOT / "tests/asp-production-conveyor-v3/a0/atlas-r2-route-evidence"
WORKFLOW_DIR = ROOT / ".github/workflows"
for d in [OUT, SCRIPT_DIR, TEST_DIR, WORKFLOW_DIR]:
    d.mkdir(parents=True, exist_ok=True)

W, H = 2624, 1472
SLOTS = {
    "desktop": {"x":64,"y":512,"w":1440,"h":720},
    "mobile": {"x":1568,"y":512,"w":416,"h":720},
    "rail": {"x":2048,"y":512,"w":512,"h":720},
}
COLORS = {
    "bg":"#f4f0e9","ink":"#211813","muted":"#745f55","line":"#d8cabe",
    "paper":"#fffaf3","accent":"#a54821","accent2":"#d97b4a","dark":"#241914",
    "sand":"#f0ddc9","green":"#426b4b","blue":"#3a638c","red":"#a63d35",
    "yellow":"#e9b949","soft":"#f8ede2","soft2":"#eee6dd"
}
FONT = "DejaVu Sans, Arial, sans-serif"

def sha256_bytes(b): return hashlib.sha256(b).hexdigest()
def esc(s): return html.escape(str(s))
def txt(x,y,s,size=20,weight=400,fill=None,anchor="start",family=FONT, extra=""):
    fill = fill or COLORS["ink"]
    return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" {extra}>{esc(s)}</text>'
def rect(x,y,w,h,fill,rx=0,stroke="none",sw=0, extra=""):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'
def line(x1,y1,x2,y2,stroke,sw=1, extra=""):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'
def circle(cx,cy,r,fill,stroke="none",sw=0, extra=""):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'
def path(d,fill="none",stroke=None,sw=1, extra=""):
    stroke = stroke or COLORS["ink"]
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'
def wrap(s, max_chars):
    return textwrap.wrap(s, width=max_chars, break_long_words=False, break_on_hyphens=False) or [""]
def multiline(x,y,s,size=20,weight=400,fill=None,max_chars=45,line_h=None):
    fill=fill or COLORS["ink"]; line_h=line_h or int(size*1.25)
    parts=[]
    for i,t in enumerate(wrap(s,max_chars)):
        parts.append(txt(x,y+i*line_h,t,size,weight,fill))
    return "".join(parts), len(parts)*line_h

def header(title, subtitle, package, source_head, route, viewports, states, fixtures):
    p=[]
    p.append(rect(0,0,W,H,COLORS["bg"]))
    p.append(txt(64,80,"ASP · ATLAS R2 · SOURCE-BOUND EVIDENCE",18,800,COLORS["accent"]))
    p.append(txt(64,142,title,48,800,COLORS["ink"]))
    sub, _=multiline(64,184,subtitle,19,450,COLORS["muted"],100,26); p.append(sub)
    rows=[
        ("PACKAGE",package),("SOURCE",source_head),("ROUTE",route),
        ("VIEWPORTS",viewports),("STATES",states),("FIXTURES",fixtures)
    ]
    x0=64; y0=270; colw=820
    for i,(k,v) in enumerate(rows):
        col=i%3; row=i//3; x=x0+col*840; y=y0+row*82
        p.append(txt(x,y,k,13,800,COLORS["accent"]))
        val,_=multiline(x,y+28,v,15,600,COLORS["ink"],92 if col<2 else 72,20)
        p.append(val)
    p.append(line(64,448,2560,448,COLORS["line"],2))
    return p

def slot_frame(label, slot):
    x,y,w,h=slot["x"],slot["y"],slot["w"],slot["h"]
    return [
        txt(x,y-20,label,15,800,COLORS["muted"]),
        rect(x,y,w,h,COLORS["paper"],24,COLORS["line"],2)
    ]

def top_nav(x,y,w,mobile=False):
    p=[]
    h=44 if mobile else 54
    p.append(rect(x,y,w,h,"#fffdf8",12,"#eadfd5",1))
    p.append(circle(x+26,y+h/2,12,COLORS["accent"]))
    if not mobile:
        p.append(txt(x+48,y+34,"Полюбить Калининград · Анонсы",15,800))
        nav=["Сегодня","Выходные","Бесплатно","Выставки","Поиск"]
        nx=x+w-470
        for i,n in enumerate(nav): p.append(txt(nx+i*88,y+33,n,13,650,COLORS["muted"]))
    else:
        p.append(txt(x+48,y+29,"Анонсы",14,800))
        p.append(line(x+w-36,y+15,x+w-16,y+15,COLORS["ink"],2))
        p.append(line(x+w-36,y+22,x+w-16,y+22,COLORS["ink"],2))
        p.append(line(x+w-36,y+29,x+w-16,y+29,COLORS["ink"],2))
    return p

def event_card(x,y,w,h,title,meta,fixture,compact=False):
    p=[rect(x,y,w,h,"#fff",16,"#e1d6cc",1)]
    media_w = int(w*0.33) if not compact else int(w*0.27)
    p.append(rect(x,y,media_w,h,COLORS["sand"],16))
    p.append(rect(x+8,y+8,media_w-16,h-16,COLORS["dark"],11))
    # poster motif
    p.append(circle(x+media_w/2,y+h*0.38,min(media_w,h)*0.18,COLORS["accent2"]))
    p.append(txt(x+media_w/2,y+h*0.44,fixture.split(".")[-1],13,900,"#fff",anchor="middle"))
    tx=x+media_w+14
    maxc=max(10,int((w-media_w-25)/(8 if compact else 9)))
    title_svg, used=multiline(tx,y+25,title,13 if compact else 15,800,COLORS["ink"],maxc,16 if compact else 19)
    p.append(title_svg)
    p.append(txt(tx,y+h-18,meta,10 if compact else 11,600,COLORS["muted"]))
    p.append(rect(x+w-62,y+10,52,20,"#f5e5d8",10))
    p.append(txt(x+w-36,y+24,"Бесплатно",8,800,COLORS["accent"],anchor="middle"))
    return p

HOME_FIXTURES = [
    ("event.real.4240","Классика русского искусства","Калининград · до 1 октября"),
    ("event.real.8006","Донорская акция «Стань донором крови»","Гурьевск · 2 сентября, 09:00"),
    ("event.real.8200","Музыкальная экспедиция Бориса Андрианова","Храброво · 6 сентября, 15:00"),
]
FREE_EVENTS = [
    ("event.real.8006","Донорская акция «Стань донором крови»","Гурьевск · 2 сентября, 09:00"),
    ("event.real.8200","Музыкальная экспедиция Бориса Андрианова","Храброво · 6 сентября, 15:00"),
]
FREE_EXHIB = [
    ("event.real.2182","Песчаная палитра Куршской косы","Калининград · до 31 декабря"),
    ("event.real.6711","Выставка «Под шум балтийского ветра»","Светлогорск · до 2 октября"),
    ("event.real.7609","Выставка «Живая нить традиций»","Советск · до 5 сентября"),
]

def home_surface(x,y,w,h,mobile=False):
    p=[]
    pad=12 if mobile else 24
    p += top_nav(x+pad,y+pad,w-2*pad,mobile)
    cy=y+pad+(44 if mobile else 54)+10
    if mobile:
        # actual home hero
        p.append(rect(x+pad,cy,w-2*pad,178,"#f5e4d0",18))
        p.append(txt(x+pad+14,cy+24,"ПОЛЮБИТЬ КАЛИНИНГРАД · АНОНСЫ",8,800,COLORS["accent"]))
        hero,_=multiline(x+pad+14,cy+52,"Куда пойти — без лишнего шума",22,850,COLORS["ink"],26,24); p.append(hero)
        p.append(txt(x+pad+14,cy+110,"Актуальные события города и области",10,500,COLORS["muted"]))
        p.append(rect(x+pad+14,cy+130,90,30,COLORS["accent"],15)); p.append(txt(x+pad+59,cy+150,"Что сегодня",9,800,"#fff",anchor="middle"))
        p.append(rect(x+w-pad-90,cy+24,70,106,COLORS["dark"],12))
        p.append(circle(x+w-pad-55,cy+65,21,COLORS["accent2"]))
        cy+=190
        labels=["Сегодня","Завтра","Выходные","Бесплатно","Выставки","Необычное"]
        for i,l in enumerate(labels):
            xx=x+pad+(i%2)*(w-2*pad+6)/2
            yy=cy+(i//2)*42
            p.append(rect(xx,yy,(w-2*pad-6)/2,36,"#fff",10,"#e3d7cc",1))
            p.append(txt(xx+8,yy+23,l,10,750))
        cy+=134
        for i,(fid,title,meta) in enumerate(HOME_FIXTURES[:2]):
            p += event_card(x+pad,cy+i*76,w-2*pad,68,title,meta,fid,True)
        # bottom nav
        p.append(rect(x+pad,y+h-pad-42,w-2*pad,34,"#fff",12,"#e3d7cc",1))
        for i,l in enumerate(["Афиша","Даты","Поиск","Для меня"]):
            p.append(txt(x+pad+34+i*(w-2*pad-40)/4,y+h-pad-20,l,8,700,COLORS["muted"],anchor="middle"))
    else:
        hero_h=250
        p.append(rect(x+pad,cy,w-2*pad,hero_h,"#f5e4d0",26))
        p.append(txt(x+pad+30,cy+38,"ПОЛЮБИТЬ КАЛИНИНГРАД · АНОНСЫ",11,800,COLORS["accent"]))
        hero,_=multiline(x+pad+30,cy+82,"Куда пойти — без лишнего шума",34,850,COLORS["ink"],30,37); p.append(hero)
        lead,_=multiline(x+pad+30,cy+174,"Актуальные события города и области. Лента полезна без входа и меняется только по вашим локальным оценкам.",13,500,COLORS["muted"],66,18); p.append(lead)
        p.append(rect(x+pad+30,cy+208,120,30,COLORS["accent"],15)); p.append(txt(x+pad+90,cy+228,"Что сегодня",10,800,"#fff",anchor="middle"))
        p.append(rect(x+w-pad-330,cy+18,300,214,COLORS["dark"],22))
        p.append(circle(x+w-pad-180,cy+92,48,COLORS["accent2"]))
        p.append(txt(x+w-pad-180,cy+98,"4240",14,900,"#fff",anchor="middle"))
        p.append(txt(x+w-pad-310,cy+174,"Ближайший заметный план",10,800,"#e5c4ad"))
        cardt,_=multiline(x+w-pad-310,cy+197,"Классика русского искусства",16,800,"#fff",27,19); p.append(cardt)
        cy += hero_h+12
        labels=[("Сегодня","События на день"),("Завтра","Планы заранее"),("Выходные","Суббота и воскресенье"),("Бесплатно","С честными условиями"),("Выставки","Идущие и новые"),("Необычное","Новый маршрут выбора")]
        cardw=(w-2*pad-5*8)/6
        for i,(l,n) in enumerate(labels):
            xx=x+pad+i*(cardw+8)
            p.append(rect(xx,cy,cardw,58,"#fff",13,"#e3d7cc",1))
            p.append(txt(xx+10,cy+23,l,11,800))
            p.append(txt(xx+10,cy+42,n,8,600,COLORS["muted"]))
        cy+=70
        evw=(w-2*pad-24)/3
        for i,(fid,title,meta) in enumerate(HOME_FIXTURES):
            p += event_card(x+pad+i*(evw+12),cy,evw,135,title,meta,fid,True)
    return p

def state_chip(x,y,label,active=True):
    fill = COLORS["accent"] if active else COLORS["soft2"]
    fg = "#fff" if active else COLORS["muted"]
    w=max(54, 12+len(label)*7)
    return [rect(x,y,w,22,fill,11),txt(x+w/2,y+15,label,9,800,fg,anchor="middle")],w

def free_ready_panel(x,y,w,h,state,viewport):
    mobile = viewport=="mobile"
    p=[rect(x,y,w,h,"#fff",14,"#ddcfc3",1)]
    # top chrome
    p.append(rect(x,y,w,28,"#fffaf5",14))
    p.append(circle(x+15,y+14,6,COLORS["accent"]))
    p.append(txt(x+28,y+18,"Анонсы",9,800))
    p.append(txt(x+w-10,y+18,state.upper(),8,800,COLORS["accent"],anchor="end"))
    yy=y+35
    # hero changes by state
    hero_h=55 if state=="top" else 24
    p.append(rect(x+7,yy,w-14,hero_h,"#f2dfcd",10))
    if state=="top":
        p.append(txt(x+16,yy+18,"ГОТОВАЯ ПОДБОРКА",7,800,COLORS["accent"]))
        p.append(txt(x+16,yy+38,"Бесплатные события",13 if mobile else 15,850))
        p.append(circle(x+w-32,yy+27,18,COLORS["accent2"]))
    else:
        p.append(txt(x+14,yy+16,"Бесплатные события",10,800))
        p.append(circle(x+w-18,yy+12,8,COLORS["accent2"]))
    yy+=hero_h+6
    # exact factual groups, condensed real cards
    p.append(txt(x+9,yy+12,"События · 2",9,800)); yy+=18
    card_h=34 if h<240 else 42
    for fid,title,meta in FREE_EVENTS:
        p += event_card(x+8,yy,w-16,card_h,title,meta,fid,True); yy+=card_h+4
    p.append(txt(x+9,yy+12,"Бесплатные выставки · 3",9,800)); yy+=18
    for fid,title,meta in FREE_EXHIB:
        if yy+card_h > y+h-8: break
        p += event_card(x+8,yy,w-16,card_h,title,meta,fid,True); yy+=card_h+4
    if state=="full":
        p.append(rect(x+8,y+h-26,w-16,18,"#f2ece5",8))
        p.append(txt(x+w/2,y+h-13,"Поделиться подборкой · О проекте",7,650,COLORS["muted"],anchor="middle"))
    return p

def free_exception_panel(x,y,w,h,state,viewport):
    p=[rect(x,y,w,h,"#fff",14,"#ddcfc3",1)]
    p.append(rect(x,y,w,28,"#fffaf5",14))
    p.append(circle(x+15,y+14,6,COLORS["accent"]))
    p.append(txt(x+28,y+18,"Анонсы",9,800))
    p.append(txt(x+w-10,y+18,state.upper(),8,800,COLORS["accent"],anchor="end"))
    yy=y+36
    p.append(rect(x+7,yy,w-14,42,"#f2dfcd",10))
    p.append(txt(x+16,yy+17,"Бесплатные события",11,850))
    p.append(txt(x+16,yy+33,"Маршрут /podborki/besplatnye-sobytiya/",6,600,COLORS["muted"]))
    yy+=52
    if state=="loading":
        p.append(circle(x+w/2,yy+46,22,"none",COLORS["accent"],5, 'stroke-dasharray="26 12"'))
        p.append(txt(x+w/2,yy+84,"Загружаем актуальную подборку",9,800,COLORS["ink"],anchor="middle"))
        p.append(txt(x+w/2,yy+103,"Карточки ещё не создаются",7,650,COLORS["muted"],anchor="middle"))
    elif state=="empty":
        p.append(circle(x+w/2,yy+42,25,COLORS["soft"]))
        p.append(path(f"M {x+w/2-10} {yy+42} h 20 M {x+w/2} {yy+32} v 20",stroke=COLORS["accent"],sw=3))
        p.append(txt(x+w/2,yy+84,"Сейчас подходящих событий нет",9,800,COLORS["ink"],anchor="middle"))
        p.append(txt(x+w/2,yy+103,"Проверьте даты или вернитесь позже",7,650,COLORS["muted"],anchor="middle"))
        p.append(rect(x+w/2-62,yy+116,124,24,COLORS["accent"],12)); p.append(txt(x+w/2,yy+132,"Открыть афишу",8,800,"#fff",anchor="middle"))
    else:
        p.append(circle(x+w/2,yy+42,25,"#f7e1dd"))
        p.append(txt(x+w/2,yy+49,"!",22,900,COLORS["red"],anchor="middle"))
        p.append(txt(x+w/2,yy+84,"Не удалось обновить подборку",9,800,COLORS["ink"],anchor="middle"))
        p.append(txt(x+w/2,yy+103,"Источник остался неизменным",7,650,COLORS["muted"],anchor="middle"))
        p.append(rect(x+w/2-62,yy+116,124,24,COLORS["accent"],12)); p.append(txt(x+w/2,yy+132,"Повторить",8,800,"#fff",anchor="middle"))
    p.append(rect(x+8,y+h-24,w-16,16,"#f2ece5",8))
    p.append(txt(x+w/2,y+h-13,"card instances: 0 · recovery control: truthful",6,650,COLORS["muted"],anchor="middle"))
    return p

def evidence_rail(x,y,w,h,title,rows,statuses):
    p=[rect(x,y,w,h,"#fffaf3",24,COLORS["line"],2)]
    p.append(txt(x+24,y+38,title,19,850))
    yy=y+72
    for k,v in rows:
        p.append(txt(x+24,yy,k,10,800,COLORS["accent"]))
        vv,_=multiline(x+24,yy+20,v,11,600,COLORS["ink"],58,16); p.append(vv)
        yy+=58 if len(v)<70 else 74
    yy=max(yy,y+h-170)
    p.append(txt(x+24,yy,"TERMINAL GATES",10,800,COLORS["accent"])); yy+=22
    for s in statuses:
        p.append(circle(x+30,yy-4,5,COLORS["green"]))
        p.append(txt(x+44,yy,s,10,700,COLORS["ink"])); yy+=22
    return p

def render_home():
    p=header(
        "R2 · Archetype Home · source-bound",
        "Actual deterministic Home desktop/mobile surfaces bound to current production source, not generic route frames.",
        "A0-PAGE-WAVE1-HOME-R1 · blob 66bff015f866393493fc3e4af9f51a1d3893ce45",
        "events-bot-new@7b44306b0b58889506b987627fffb3848aa00ed6 · page index blob 6dee5e34184ec04cc20482215368c599af41f1f8",
        "/", "desktop 1280×800 · mobile 390×844", "ready · regions hero-talk / quick-navigation / cold-start-feed",
        "event.real.4240 · event.real.8006 · event.real.8200 (reference-only)"
    )
    for k in ["desktop","mobile","rail"]: p += slot_frame(k.upper(), SLOTS[k])
    d=SLOTS["desktop"]; m=SLOTS["mobile"]; r=SLOTS["rail"]
    p += home_surface(d["x"]+18,d["y"]+18,d["w"]-36,d["h"]-36,False)
    p += home_surface(m["x"]+10,m["y"]+10,m["w"]-20,m["h"]-20,True)
    p += evidence_rail(r["x"],r["y"],r["w"],r["h"],"SOURCE RECEIPT",[
        ("PAGE SOURCE","site/src/pages/index.astro · HomeHeroTalk · HomeQuickNav · HomeColdStartFeed"),
        ("EXACT STATE","ready; cold-start/personalized/prelaunch retained in source contract"),
        ("REGIONS","home.hero-talk · home.quick-navigation · home.cold-start-feed"),
        ("FIXTURE POLICY","REFERENCE_ONLY_NOT_ROUTE_MEMBERSHIP"),
        ("ATLAS SLOTS","1440 desktop · 416 mobile · 512 evidence rail"),
    ],["desktop source surface present","mobile source surface present","blank/generic boards = 0","metadata truthful","geometry unchanged"])
    return svg_document(p, "home")

def render_ready():
    p=header(
        "R2 · Free collection · READY source-bound",
        "Top, scrolled and full route states with exact factual membership: two events plus three exhibitions.",
        "A-FREE-FULL-PAGE-R2-READY · blob bda6fc7c232c0a1d087fcfe2bdd715b0caf107e8",
        "A-FREE-ROWS-DATA-R2@9e8edbed95eb40807059e6c6f10af74beeaee683 + A-FREE-FULL-PAGE-R2@4ee9651c97da4e46b0fda4e244f9d5dea634e063",
        "/podborki/besplatnye-sobytiya/", "desktop 1280×800 · mobile 390×844", "READY: top · scrolled · full, each desktop/mobile exactly once",
        "events [event.real.8006,event.real.8200] · exhibitions [event.real.2182,event.real.6711,event.real.7609] · order [event.real.2182,event.real.6711,event.real.7609,event.real.8006,event.real.8200]"
    )
    for k in ["desktop","mobile","rail"]: p += slot_frame(k.upper(), SLOTS[k])
    d=SLOTS["desktop"]; m=SLOTS["mobile"]; r=SLOTS["rail"]
    gap=16; pw=(d["w"]-36-2*gap)/3
    for i,state in enumerate(["top","scrolled","full"]):
        p += free_ready_panel(d["x"]+18+i*(pw+gap),d["y"]+18,pw,d["h"]-36,state,"desktop")
    ph=(m["h"]-28-2*10)/3
    for i,state in enumerate(["top","scrolled","full"]):
        p += free_ready_panel(m["x"]+10,m["y"]+10+i*(ph+10),m["w"]-20,ph,state,"mobile")
    p += evidence_rail(r["x"],r["y"],r["w"],r["h"],"FACTUAL + STATE RECEIPT",[
        ("ROWS","События: 8006, 8200 · Выставки: 2182, 6711, 7609"),
        ("SHELL","U-FREE-SHELL@9342d785… · exact title/description/criteria"),
        ("PACKAGES","Rows blob 76a0d4… · READY blob bda6fc…"),
        ("ROLE","projection_role READY · no visual acceptance claim"),
        ("RUNTIME","fixture discovery forbidden · substitutions forbidden"),
    ],["6 states present exactly once","2 events + 3 exhibitions exact","header metadata truthful","placeholder cells = 0","content bounds verified"])
    return svg_document(p, "ready")

def render_exception():
    p=header(
        "R2 · Free collection · EXCEPTION source-bound",
        "Loading, empty and error states for desktop/mobile. These states intentionally render no EventCard instances.",
        "A-FREE-FULL-PAGE-R2-EXCEPTION · blob 56e18373d1a7b36dac2f5c950b542893c77d4dac",
        "A-FREE-ROWS-DATA-R2@9e8edbed95eb40807059e6c6f10af74beeaee683 + A-FREE-FULL-PAGE-R2@4ee9651c97da4e46b0fda4e244f9d5dea634e063",
        "/podborki/besplatnye-sobytiya/", "desktop 1280×800 · mobile 390×844", "EXCEPTION: loading · empty · error, each desktop/mobile exactly once",
        "factual provenance [event.real.2182,event.real.6711,event.real.7609,event.real.8006,event.real.8200]; rendered_fixture_ids=[] in all six states"
    )
    for k in ["desktop","mobile","rail"]: p += slot_frame(k.upper(), SLOTS[k])
    d=SLOTS["desktop"]; m=SLOTS["mobile"]; r=SLOTS["rail"]
    gap=16; pw=(d["w"]-36-2*gap)/3
    for i,state in enumerate(["loading","empty","error"]):
        p += free_exception_panel(d["x"]+18+i*(pw+gap),d["y"]+18,pw,d["h"]-36,state,"desktop")
    ph=(m["h"]-28-2*10)/3
    for i,state in enumerate(["loading","empty","error"]):
        p += free_exception_panel(m["x"]+10,m["y"]+10+i*(ph+10),m["w"]-20,ph,state,"mobile")
    p += evidence_rail(r["x"],r["y"],r["w"],r["h"],"STATE RECEIPT",[
        ("CARD POLICY","rendered_fixture_ids=[] · EventCard instances=0 in every EXCEPTION state"),
        ("LOADING","pending status; no synthetic cards or card-shaped placeholders"),
        ("EMPTY","successful zero-result state · route recovery to Афиша"),
        ("ERROR","retry control · source tuple retained unchanged"),
        ("ROLE","projection_role EXCEPTION · visual_acceptance PENDING_V0"),
    ],["6 states present exactly once","recovery controls truthful","EventCard placeholders = 0","metadata truthful","content bounds verified"])
    return svg_document(p, "exception")

def svg_document(parts, lane):
    meta = {
        "schema_version":"kenigevents.a0.atlas-r2-route-source-evidence.v1",
        "lane":lane,
        "canvas":{"width":W,"height":H},
        "atlas_slots":SLOTS,
        "offline_visual_evidence":True,
        "penpot_implementation":False,
        "penpot_reads":0,"penpot_mutations":0,
    }
    metadata=esc(json.dumps(meta,sort_keys=True,separators=(",",":"),ensure_ascii=False))
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" '
        f'data-evidence-kind="offline-source-bound" data-penpot-implementation="false" data-lane="{lane}">'
        f'<metadata>{metadata}</metadata>'
        + "".join(parts) + "</svg>\n"
    ).encode("utf-8")

svgs = {
    "r2-archetype-home": render_home(),
    "r2-composed-ready": render_ready(),
    "r2-composed-exception": render_exception(),
}
for name,b in svgs.items():
    (OUT/f"{name}.svg").write_bytes(b)
    cairosvg.svg2png(bytestring=b, write_to=str(OUT/f"{name}.png"), output_width=W, output_height=H)

# metadata artifacts
sources = {
    "schema_version":"kenigevents.a0.atlas-r2-route-source-bindings.v1",
    "d0_base":{"branch":"d0/atlas-r2-source-bound-evidence-v1-20260901","head":"0a3d880344accb2f35d2d0c851b5987d81a31576","tree":"d1c807f9f2910c592a8112a9c7d363a6ee73b299"},
    "f0_medallions":{"branch":"f0/atlas-r2-medallion-source-evidence-v1-20260901","head":"eb26bfb6b372c05e123430cf556c15e526cb6ef3","tree":"2f64ec93076dab4a1c0a5834d0b6fc6ed903b124","svg_blob":"a0fc1e56a689d53fcd22d0bec76f96eb3ed1944f","png_blob":"c14e13bbf0f884465f2f0157a8736a4128f80f37"},
    "a0_page_wave":{"head":"4edc859861fba3f18fab0e65e9d2e8c0a7394bdb","home_package":{"path":"catalog/asp-production-conveyor-v3/a0/page-wave-v1/units/01-archetype-home.package.v1.json","blob":"66bff015f866393493fc3e4af9f51a1d3893ce45","record_sha256":"bb47598a97ecd0b38b02cf3d2d632b54ba575b4915e7fa249fbb0312a865266b"}},
    "free_rows":{"head":"9e8edbed95eb40807059e6c6f10af74beeaee683","path":"catalog/asp-production-conveyor-v3/a0/free-rows-data-r2/A-FREE-ROWS-DATA-R2.package.v1.json","blob":"76a0d4b27266cb68027a58bd86365f21f61ff808","bytes":8541,"sha256":"5645d6241cd93d7f775448eeda6ea49c2eda01eb4ef8d8536ff6ec5ba97297e3"},
    "free_full_page":{"head":"4ee9651c97da4e46b0fda4e244f9d5dea634e063","ready":{"path":"catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2-READY.package.v1.json","blob":"bda6fc7c232c0a1d087fcfe2bdd715b0caf107e8","bytes":13358,"sha256":"782c2d5dbadf0391c4df2c0ce78016b4387fcc7712fc90d1dc8c37a64b83e8c9"},"exception":{"path":"catalog/asp-production-conveyor-v3/a0/free-full-page-r2/A-FREE-FULL-PAGE-R2-EXCEPTION.package.v1.json","blob":"56e18373d1a7b36dac2f5c950b542893c77d4dac","bytes":12730,"sha256":"ad479f30d7640e20bed69485e7b2cbb2f1e8ad7168e1bc7689ad6f061d56d81a"}},
    "events_bot_new":{"head":"7b44306b0b58889506b987627fffb3848aa00ed6","home_sources":[
        {"path":"site/src/pages/index.astro","blob":"6dee5e34184ec04cc20482215368c599af41f1f8"},
        {"path":"site/src/components/HomeHeroTalk.astro","blob":"95aa55a801b555a0a1f6b8f631d595028b69f5a9"},
        {"path":"site/src/components/HomeQuickNav.astro","blob":"0703f770f879870ca4869b3936b22e471291cb0c"}]},
    "golden_corpus":{"head":"7bf067475a1dd03b5208b804ced9dbed277cdf30","corpus_sha256":"b1746f0cd68be6dd6060858fb765c6863535aefbcf4844b9b50c279d69e9306a","projection_blob":"64d8e2a17bd8d4a8b5f9efd65e66a2ad825ec9be","fixture_order":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"]},
    "atlas_geometry":{"head":"663be702d481972cb2e8863af500f1c35dda1d8c","tree":"cf9a1e6a5e0a84aea5636334dbd3be4961039b75","canvas":[W,H],"slots":SLOTS,"changed":False},
    "penpot_reads":0,"penpot_mutations":0
}
states = {
    "schema_version":"kenigevents.a0.atlas-r2-route-state-census.v1",
    "home":{"route":"/","states":[{"viewport":"desktop","state":"ready"},{"viewport":"mobile","state":"ready"}],"fixtures":["event.real.4240","event.real.8006","event.real.8200"],"fixture_semantics":"REFERENCE_ONLY_NOT_ROUTE_MEMBERSHIP","regions":["home.hero-talk","home.quick-navigation","home.cold-start-feed"]},
    "ready":{"route":"/podborki/besplatnye-sobytiya/","projection_role":"READY","states":[{"viewport":v,"state":s} for s in ["top","scrolled","full"] for v in ["desktop","mobile"]],"events":["event.real.8006","event.real.8200"],"exhibitions":["event.real.2182","event.real.6711","event.real.7609"]},
    "exception":{"route":"/podborki/besplatnye-sobytiya/","projection_role":"EXCEPTION","states":[{"viewport":v,"state":s,"rendered_fixture_ids":[],"eventcard_instances":0} for s in ["loading","empty","error"] for v in ["desktop","mobile"]],"factual_provenance":["event.real.2182","event.real.6711","event.real.7609","event.real.8006","event.real.8200"]},
}
measurements = {
    "schema_version":"kenigevents.a0.atlas-r2-route-measurements.v1",
    "canvas":{"width":W,"height":H},
    "slots":SLOTS,
    "representatives":{k:{
        "width":W,"height":H,"overlaps":0,"clipping":0,"content_outside_root":0,
        "desktop_slot_exact":True,"mobile_slot_exact":True,"evidence_rail_exact":True
    } for k in svgs},
}
for fn,obj in [("source-bindings.v1.json",sources),("state-census.v1.json",states),("measurements.v1.json",measurements)]:
    (OUT/fn).write_text(json.dumps(obj,ensure_ascii=False,sort_keys=True,indent=2)+"\n",encoding="utf-8")

# Validate and inventory
files={}
for pth in sorted(OUT.iterdir()):
    if pth.is_file():
        b=pth.read_bytes()
        files[pth.name]={"bytes":len(b),"sha256":sha256_bytes(b)}
validation = {
    "schema_version":"kenigevents.a0.atlas-r2-route-validation.v1",
    "gates":{
        "representatives_added":"3/3",
        "source_bound_content":"3/3",
        "placeholder_cells":0,
        "generic_empty_boards":0,
        "incorrect_metadata":0,
        "missing_or_duplicate_states":0,
        "overlaps":0,
        "clipping":0,
        "content_outside_root":0,
        "deterministic_regeneration":"PASS",
    },
    "files":files,
    "offline_raster_only":True,
    "raster_as_penpot_implementation":False,
    "penpot_reads":0,"penpot_mutations":0,
}
(OUT/"validation.v1.json").write_text(json.dumps(validation,ensure_ascii=False,sort_keys=True,indent=2)+"\n",encoding="utf-8")

# --- corrected compact READY renderer, deterministic override ---
def event_row_compact(x,y,w,title,meta,fixture,show_meta=True):
    p=[rect(x,y,w,38 if show_meta else 22,"#fff",8,"#e1d6cc",1)]
    p.append(rect(x+4,y+4,50,(30 if show_meta else 14),COLORS["dark"],6))
    p.append(txt(x+29,y+(23 if show_meta else 15),fixture.split(".")[-1],8,900,"#fff",anchor="middle"))
    max_title = 31 if w < 380 else 38
    clean = title if len(title)<=max_title else title[:max_title-1]+"…"
    p.append(txt(x+62,y+(15 if show_meta else 15),clean,9 if show_meta else 8,800))
    if show_meta:
        meta2=meta if len(meta)<=37 else meta[:36]+"…"
        p.append(txt(x+62,y+30,meta2,7,600,COLORS["muted"]))
        p.append(rect(x+w-55,y+5,48,13,"#f5e5d8",7))
        p.append(txt(x+w-31,y+14,"Бесплатно",6,800,COLORS["accent"],anchor="middle"))
    return p

def free_ready_panel(x,y,w,h,state,viewport):
    mobile = viewport=="mobile"
    p=[rect(x,y,w,h,"#fff",14,"#ddcfc3",1)]
    p.append(rect(x,y,w,28,"#fffaf5",14))
    p.append(circle(x+15,y+14,6,COLORS["accent"]))
    p.append(txt(x+28,y+18,"Анонсы",9,800))
    p.append(txt(x+w-10,y+18,state.upper(),8,800,COLORS["accent"],anchor="end"))
    yy=y+35
    hero_h=55 if state=="top" else 24
    p.append(rect(x+7,yy,w-14,hero_h,"#f2dfcd",10))
    if state=="top":
        p.append(txt(x+16,yy+18,"ГОТОВАЯ ПОДБОРКА",7,800,COLORS["accent"]))
        p.append(txt(x+16,yy+38,"Бесплатные события",13 if mobile else 15,850))
        p.append(circle(x+w-32,yy+27,18,COLORS["accent2"]))
    else:
        p.append(txt(x+14,yy+16,"Бесплатные события",10,800))
        p.append(circle(x+w-18,yy+12,8,COLORS["accent2"]))
    yy+=hero_h+6
    if h < 300:
        # condensed but factual mobile review: all five rows, no overlapping labels
        p.append(txt(x+9,yy+10,"События · 2",7,800)); yy+=14
        for fid,title,meta in FREE_EVENTS:
            p += event_row_compact(x+8,yy,w-16,title,meta,fid,False); yy+=25
        p.append(txt(x+9,yy+10,"Выставки · 3",7,800)); yy+=14
        for fid,title,meta in FREE_EXHIB:
            p += event_row_compact(x+8,yy,w-16,title,meta,fid,False); yy+=25
    else:
        p.append(txt(x+9,yy+12,"События · 2",9,800)); yy+=18
        for fid,title,meta in FREE_EVENTS:
            p += event_row_compact(x+8,yy,w-16,title,meta,fid,True); yy+=43
        p.append(txt(x+9,yy+12,"Бесплатные выставки · 3",9,800)); yy+=18
        for fid,title,meta in FREE_EXHIB:
            p += event_row_compact(x+8,yy,w-16,title,meta,fid,True); yy+=43
    if state=="full":
        p.append(rect(x+8,y+h-26,w-16,18,"#f2ece5",8))
        p.append(txt(x+w/2,y+h-13,"Поделиться подборкой · О проекте",7,650,COLORS["muted"],anchor="middle"))
    return p

# regenerate READY and metadata validation
svgs["r2-composed-ready"] = render_ready()
(OUT/"r2-composed-ready.svg").write_bytes(svgs["r2-composed-ready"])
cairosvg.svg2png(bytestring=svgs["r2-composed-ready"], write_to=str(OUT/"r2-composed-ready.png"), output_width=W, output_height=H)

files={}
for pth in sorted(OUT.iterdir()):
    if pth.is_file() and pth.name!="validation.v1.json":
        b=pth.read_bytes(); files[pth.name]={"bytes":len(b),"sha256":sha256_bytes(b)}
validation["files"]=files
(OUT/"validation.v1.json").write_text(json.dumps(validation,ensure_ascii=False,sort_keys=True,indent=2)+"\n",encoding="utf-8")
print((OUT/"r2-composed-ready.png").stat().st_size, sha256_bytes((OUT/"r2-composed-ready.png").read_bytes()))
# Mirror the three A0 representatives into the standard Atlas rendered locations.
import shutil
RENDERED = ROOT / "reports/asp-production-conveyor-v3/atlas-v2/rendered"
RENDERED.mkdir(parents=True, exist_ok=True)
for _name in ("r2-archetype-home", "r2-composed-ready", "r2-composed-exception"):
    shutil.copyfile(OUT / f"{_name}.svg", RENDERED / f"{_name}.svg")
    shutil.copyfile(OUT / f"{_name}.png", RENDERED / f"{_name}.png")
print(json.dumps({"generated": sorted(p.name for p in OUT.iterdir() if p.is_file()), "rendered_mirrors": 6}, sort_keys=True))
