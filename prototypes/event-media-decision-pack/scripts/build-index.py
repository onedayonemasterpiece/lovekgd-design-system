#!/usr/bin/env python3
"""Build the standalone Event Media owner-decision HTML from exact L2 cards.

The generated document embeds all data needed for human review. It never reads
catalog JSON at runtime and never loads a network resource.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


PACK = Path(__file__).resolve().parents[1]
REPO = Path(__file__).resolve().parents[3]


def read_jsonl(path: Path) -> list[dict]:
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line]


def compact(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=PACK / "index.html")
    args = parser.parse_args()

    decisions = read_jsonl(REPO / "catalog/normalization/event-media/owner-decisions.jsonl")
    fixtures = read_jsonl(REPO / "catalog/normalization/event-media/decision-fixtures.jsonl")
    provenance = read_jsonl(PACK / "fixture-provenance.jsonl")
    if [row["id"] for row in decisions] != [
        "decision.EM-CENSUS-001",
        "decision.EM-GOV-010",
        "decision.EM-LABRAIL-011",
    ]:
        raise SystemExit("unexpected decision-card identity/order")
    if len(fixtures) != 13:
        raise SystemExit("expected exactly 13 fixtures")

    provenance_by_fixture = {row["fixture_id"]: row for row in provenance}
    fixture_contract = []
    for fixture in fixtures:
        fixture_contract.append(
            {
                "id": fixture["id"],
                "coverage": fixture["coverage"],
                "render_contract": fixture["render_contract"],
                "required_viewports": fixture["required_viewports"],
                "materialized_raw_sha256": provenance_by_fixture.get(fixture["id"], {}).get(
                    "raw_sha256"
                ),
                "source_kind": fixture["source"]["kind"],
            }
        )
    fixture_set_sha = hashlib.sha256(compact(fixture_contract).encode()).hexdigest()

    embedded_decisions = []
    for card in decisions:
        embedded_decisions.append(
            {
                "id": card["id"],
                "blocker_id": card["blocker_id"],
                "question": card["question"],
                "scoped_owner_prompt": card["scoped_owner_prompt"],
                "source_statement": card["source_statement"],
                "source_closure_condition": card["source_closure_condition"],
                "exact_owner_choice_needed": card["exact_owner_choice_needed"],
                "affected_consumer_application_refs": card[
                    "affected_consumer_application_refs"
                ],
                "affected_surfaces": card["affected_surfaces"],
                "agent_recommendation": card["agent_recommendation"],
                "options": card["options"],
                "status": card["status"],
                "decision": card["decision"],
            }
        )

    html = TEMPLATE.replace("__DECISIONS__", compact(embedded_decisions))
    html = html.replace("__FIXTURE_SET_SHA__", fixture_set_sha)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(html, encoding="utf-8", newline="\n")
    print(
        compact(
            {
                "decision_cards": len(decisions),
                "fixture_set_sha256": fixture_set_sha,
                "fixtures": len(fixtures),
                "output": str(args.output),
            }
        )
    )


TEMPLATE = r'''<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>Event Media — owner decision pack</title>
  <style>
    :root{--ink:#182521;--muted:#596561;--paper:#f3f0e8;--panel:#fffdf8;--line:#c9c8c0;--teal:#0d5b50;--teal-soft:#dcebe6;--amber:#8b5d08;--amber-soft:#fff0c9;--red:#9f2f28;--red-soft:#f9ded9;--violet:#57429a;--violet-soft:#ebe5ff;--shadow:0 14px 34px rgba(24,37,33,.08)}
    *{box-sizing:border-box}
    html{background:#222824}
    body{margin:0;font-family:Arial,"Liberation Sans",sans-serif;color:var(--ink);background:#222824;-webkit-font-smoothing:antialiased}
    *,:before,:after{animation:none!important;transition:none!important;caret-color:transparent!important}
    .pack-nav{width:1920px;margin:0 auto;padding:22px 64px;background:#182521;color:#fff;display:flex;gap:14px;align-items:center}
    .pack-nav a{color:#fff;text-decoration:none;border:1px solid #64746e;border-radius:999px;padding:9px 15px;font-weight:700}
    .pack-nav strong{margin-right:auto}
    .decision-board{width:1920px;margin:0 auto 24px;padding:54px 64px 46px;background:var(--paper);position:relative;overflow:hidden}
    .decision-board:before{content:"EVIDENCE ONLY · NON-PRODUCTION · NOT_MERGED";position:absolute;right:64px;top:18px;text-align:center;background:var(--red);color:#fff;padding:8px 13px;border-radius:8px;font-size:13px;font-weight:900;letter-spacing:.07em;z-index:5}
    .kicker{font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:var(--teal);font-weight:900;margin-bottom:10px}
    h1{font-size:48px;line-height:1.04;margin:0 0 12px;max-width:1380px;letter-spacing:-.035em}
    .question{font-size:25px;line-height:1.3;max-width:1520px;margin:0;color:#2c3935}
    .status-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}
    .chip{font-size:13px;line-height:1;border:1px solid var(--line);background:var(--panel);padding:10px 12px;border-radius:999px;font-weight:800}
    .chip.pending{background:var(--amber-soft);border-color:#d6a747;color:#684404}
    .chip.stop{background:var(--red-soft);border-color:#d8847d;color:#79211c}
    .chip.evidence{background:var(--teal-soft);border-color:#7fb7a9;color:#08493f}
    .summary-grid{display:grid;grid-template-columns:1.25fr .75fr;gap:20px;margin-top:24px}
    .summary-card,.boundary,.owner-callout,.fixture-atlas,.common-guardrail{background:var(--panel);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow)}
    .summary-card{padding:20px 22px}
    .summary-card h2,.boundary h2,.fixture-atlas h2{margin:0 0 10px;font-size:20px}
    .summary-card p{margin:5px 0;font-size:16px;line-height:1.45}
    .mono{font-family:"Liberation Mono",Consolas,monospace;overflow-wrap:anywhere}
    .boundary{padding:22px;margin-top:20px}
    .diagram{display:flex;align-items:stretch;gap:12px;margin-top:16px}
    .diagram-node{flex:1;min-height:102px;border:2px solid #9ba8a3;background:#f8faf8;border-radius:14px;padding:14px;display:flex;flex-direction:column;justify-content:center;text-align:center}
    .diagram-node.pending{border-style:dashed;border-color:#c68c23;background:var(--amber-soft)}
    .diagram-node.locked{border-color:#ce817a;background:var(--red-soft)}
    .diagram-arrow{display:flex;align-items:center;font-size:28px;font-weight:900;color:#71807b}
    .diagram-label{font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:900;color:var(--muted);margin-bottom:6px}
    .diagram-title{font-size:16px;font-weight:900;line-height:1.25}
    .diagram-note{font-size:13px;color:var(--muted);line-height:1.3;margin-top:5px}
    .owner-callout{margin-top:20px;padding:20px 22px;background:#172d28;color:#fff;display:flex;gap:24px;align-items:flex-start}
    .owner-callout strong{font-size:19px;min-width:240px}
    .owner-callout span{font-size:17px;line-height:1.45}
    .options-title{display:flex;align-items:end;justify-content:space-between;margin-top:34px;margin-bottom:14px}
    .options-title h2{font-size:29px;margin:0}
    .options-title p{margin:0;color:var(--muted);font-size:15px;max-width:860px;text-align:right}
    .option-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;align-items:stretch}
    .option{border:2px solid #b9beb9;background:var(--panel);border-radius:18px;padding:20px;position:relative;display:flex;flex-direction:column;min-width:0}
    .option.recommended{border-color:var(--teal);box-shadow:0 0 0 4px rgba(13,91,80,.10)}
    .option-index{font-size:12px;font-weight:900;letter-spacing:.12em;color:var(--muted);text-transform:uppercase}
    .option h3{font-size:22px;line-height:1.17;margin:7px 0 8px;min-height:52px}
    .option-id{font-size:12px;color:var(--muted);min-height:35px}
    .recommendation{background:var(--teal-soft);color:#08493f;border-radius:10px;padding:9px 10px;font-size:13px;font-weight:900;margin:10px 0}
    .not-recommended{height:43px;margin:10px 0}
    .option h4{font-size:13px;text-transform:uppercase;letter-spacing:.08em;margin:15px 0 6px;color:#3e4b47}
    .option ul{margin:0;padding-left:19px;font-size:14px;line-height:1.38}
    .option li+li{margin-top:5px}
    .consequence-grid{display:grid;grid-template-columns:1fr;gap:6px;margin-top:8px}
    .consequence{border-left:3px solid #9aa9a3;padding:5px 8px;font-size:13px;line-height:1.32}
    .consequence b{display:block;text-transform:uppercase;font-size:10px;letter-spacing:.08em;color:var(--muted);margin-bottom:2px}
    .impact{background:#f1efe8;border-radius:10px;padding:9px 10px;font-size:13px;line-height:1.35;margin-top:8px}
    .visual-proof{margin-top:auto;padding-top:18px}
    .visual-proof-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.07em;color:var(--muted)}
    .frame-pair{display:grid;grid-template-columns:1fr 134px;gap:9px;align-items:start}
    .mini-frame{background:#dde2df;border:1px solid #8d9a95;border-radius:11px;padding:7px;position:relative;overflow:hidden}
    .mini-frame.desktop{height:218px}
    .mini-frame.mobile{height:218px}
    .device-label{position:absolute;top:5px;left:5px;background:#172d28;color:#fff;font-size:8px;font-weight:900;padding:4px 6px;border-radius:6px;z-index:3}
    .mini-desktop-layout{height:100%;display:grid;grid-template-columns:1.8fr 1fr;gap:5px;padding-top:20px}
    .mini-primary{border-radius:6px;overflow:hidden;position:relative;background:#293833}
    .mini-primary img{width:100%;height:100%;object-fit:cover;object-position:65% 45%;display:block}
    .safe-overlay{position:absolute;left:46.2%;top:8.8%;width:27.8%;height:66%;border:2px dashed #fff;box-shadow:0 0 0 1px #0b3f36}
    .mini-side{display:grid;grid-template-columns:1fr 1fr;gap:4px}
    .mini-side img{width:100%;height:100%;min-height:0;object-fit:cover;border-radius:4px;display:block;background:#283630}
    .mini-side img.contain{object-fit:contain;background:#17231f}
    .mini-states{position:absolute;bottom:6px;left:8px;right:8px;display:grid;grid-template-columns:repeat(4,1fr);gap:3px}
    .mini-state{background:rgba(255,253,248,.94);border:1px solid #aeb6b1;border-radius:4px;text-align:center;padding:3px 1px;font-size:7px;font-weight:900;color:#33413d}
    .mini-mobile-layout{height:100%;padding-top:20px;display:grid;grid-template-rows:1.5fr 42px 38px;gap:5px}
    .mini-mobile-layout .mobile-primary{border-radius:6px;overflow:hidden;background:#17231f}
    .mini-mobile-layout .mobile-primary img{width:100%;height:100%;display:block;object-fit:contain}
    .mobile-previews{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
    .mobile-previews img{width:100%;height:100%;object-fit:cover;border-radius:4px}
    .mobile-state-list{display:grid;grid-template-columns:repeat(2,1fr);gap:3px}
    .mobile-state-list span{font-size:6px;padding:3px;background:#fff;border:1px solid #adb7b2;border-radius:3px;text-align:center;font-weight:900}
    .fixture-bind{margin-top:8px;padding:7px;background:#eceae3;border-radius:8px;color:#4a5652;font-size:10px;line-height:1.3}
    .fixture-bind b{color:#1b2a25}
    .fixture-atlas{padding:22px;margin-top:26px}
    .atlas-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:14px}
    .atlas-head p{max-width:980px;margin:0;color:var(--muted);line-height:1.45;text-align:right;font-size:14px}
    .atlas-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
    .fixture{border:1px solid #bfc4bf;border-radius:13px;background:#f8f7f2;padding:10px;min-width:0}
    .fixture-visual{height:142px;background:#1b2b26;border-radius:8px;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center}
    .fixture-visual.ratio-2x3{height:168px;margin:0 auto;width:112px}
    .fixture-visual img{width:100%;height:100%;display:block;object-fit:cover}
    .fixture-visual img.contain{object-fit:contain}
    .fixture-visual img.tiny{width:96px;height:96px;image-rendering:auto}
    .fixture .focal{position:absolute;left:65%;top:45%;width:12px;height:12px;margin:-6px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 2px #0d5b50}
    .fixture .safe{position:absolute;left:46.2%;top:8.8%;width:27.8%;height:66%;border:2px dashed #fff;box-shadow:0 0 0 1px #0d5b50}
    .fixture h3{font-size:14px;line-height:1.22;margin:9px 0 5px}
    .fixture-meta{font-size:11px;color:var(--muted);line-height:1.35}
    .metadata-badge{position:absolute;left:7px;bottom:7px;background:var(--violet-soft);color:#3f2c80;border:1px solid #aa9de0;padding:5px 7px;border-radius:6px;font-size:9px;font-weight:900}
    .broken-state{width:100%;height:100%;display:grid;place-content:center;text-align:center;background:repeating-linear-gradient(135deg,#f8ded9 0,#f8ded9 10px,#f1c6c0 10px,#f1c6c0 20px);color:#7f261f;font-weight:900}
    .broken-state small{display:block;font-weight:700;margin-top:5px}
    .skeleton{width:100%;height:100%;padding:15px;background:#e7e8e3}
    .skeleton span{display:block;background:#c8ccc8;border-radius:6px;margin-bottom:9px;height:18px}
    .skeleton span:first-child{height:72px}
    .composite{width:100%;height:100%;display:grid;grid-template-columns:1.8fr 1fr;gap:4px;padding:5px}
    .composite img{object-fit:cover;border-radius:4px}
    .composite .stack{display:grid;grid-template-rows:1fr 1fr;gap:4px}
    .common-guardrail{margin-top:20px;padding:18px 22px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px;background:#fff7e1}
    .common-guardrail div{font-size:13px;line-height:1.35}
    .common-guardrail b{display:block;color:#6e4a09;margin-bottom:4px}
    .board-footer{margin-top:18px;border-top:2px solid #aeb5b1;padding-top:14px;display:flex;justify-content:space-between;gap:20px;color:#4b5853;font-size:12px;line-height:1.4}
    .board-footer div:first-child{max-width:1150px}
    @media(max-width:1000px){.pack-nav,.decision-board{width:1920px}}
  </style>
</head>
<body>
  <nav class="pack-nav" aria-label="Decision board navigation"><strong>Event Media · evidence-only decision pack</strong></nav>
  <main id="pack"></main>
  <script>
  "use strict";
  const DECISIONS=__DECISIONS__;
  const FIXTURE_SET_SHA="__FIXTURE_SET_SHA__";
  const FIXTURE_IDS=[
    "fixture.photo-landscape-3x2-focal-safe-cover","fixture.photo-portrait-4x5-derived-cover","fixture.photo-reviewed-5x4-cover","fixture.photo-2x3-container-contain","fixture.poster-ocr-square-1x1-contain","fixture.poster-ocr-intrinsic-contain","fixture.unknown-text-contain","fixture.mixed-primary-previews","fixture.poster-companion","fixture.state-missing","fixture.state-broken","fixture.state-tiny","fixture.state-skeleton-reservation"
  ];
  const VIEWPORTS=["desktop-1440x1024","mobile-390x844"];
  const esc=value=>String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[ch]));
  const bullets=items=>`<ul>${items.map(item=>`<li>${esc(item)}</li>`).join("")}</ul>`;
  const assets={landscape:"fixtures/photo-landscape-3x2-focal-safe-cover.webp",portrait:"fixtures/photo-portrait-derived-4x5.webp",reviewed:"fixtures/photo-reviewed-5x4-cover.webp",source:"fixtures/photo-source-3x2-for-2x3-contain.webp",square:"fixtures/poster-ocr-square-1x1-contain.png",poster:"fixtures/poster-ocr-intrinsic-contain.webp",unknown:"fixtures/unknown-text-contain.webp",missing:"fixtures/state-missing-fallback.webp",tiny:"fixtures/state-tiny.jpg"};

  function diagram(id){
    const arrow='<div class="diagram-arrow" aria-hidden="true">→</div>';
    if(id==="decision.EM-CENSUS-001") return `<div class="diagram"><div class="diagram-node"><span class="diagram-label">Immutable evidence</span><span class="diagram-title">52 applications · 31 boundaries</span><span class="diagram-note">Consumers and placements stay unchanged</span></div>${arrow}<div class="diagram-node pending"><span class="diagram-label">Owner choice pending</span><span class="diagram-title">Identity candidates / composition-only / defer</span><span class="diagram-note">No merge or split is inferred</span></div>${arrow}<div class="diagram-node locked"><span class="diagram-label">Locked until receipt</span><span class="diagram-title">Readiness and target contract</span><span class="diagram-note">No option is selected on this board</span></div></div>`;
    if(id==="decision.EM-GOV-010") return `<div class="diagram"><div class="diagram-node"><span class="diagram-label">Preserved</span><span class="diagram-title">Immutable candidate evidence</span></div>${arrow}<div class="diagram-node pending"><span class="diagram-label">Current gate</span><span class="diagram-title">Separate owner receipt</span><span class="diagram-note">Review / recommendation / normalization permission</span></div>${arrow}<div class="diagram-node locked"><span class="diagram-label">Still separate</span><span class="diagram-title">Positive readiness</span></div>${arrow}<div class="diagram-node locked"><span class="diagram-label">Not authorized</span><span class="diagram-title">Acceptance · implementation</span></div></div>`;
    return `<div class="diagram"><div class="diagram-node"><span class="diagram-label">Lab evidence only</span><span class="diagram-title">EventMediaRail</span><span class="diagram-note">Not production-equivalent</span></div>${arrow}<div class="diagram-node pending"><span class="diagram-label">Owner choice pending</span><span class="diagram-title">Exclude / separate boundary / host composition</span></div>${arrow}<div class="diagram-node locked"><span class="diagram-label">Never inferred here</span><span class="diagram-title">Viewer identity or shared variant</span><span class="diagram-note">Semantic/runtime closure remains explicit</span></div></div>`;
  }

  function miniFrame(kind){
    const binding=`data-fixture-set-sha256="${FIXTURE_SET_SHA}" data-fixture-ids="${FIXTURE_IDS.join(" ")}" data-viewports="${VIEWPORTS.join(" ")}"`;
    if(kind==="desktop") return `<div class="mini-frame desktop" ${binding}><span class="device-label">DESKTOP · 1440×1024</span><div class="mini-desktop-layout"><div class="mini-primary"><img src="${assets.landscape}" alt="Landscape photography fixture"><span class="safe-overlay"></span></div><div class="mini-side"><img src="${assets.portrait}" alt="4 by 5 derived photography fixture"><img src="${assets.reviewed}" alt="5 by 4 artwork fixture"><img class="contain" src="${assets.poster}" alt="Intrinsic portrait poster fixture"><img class="contain" src="${assets.unknown}" alt="Unknown-text metadata fixture"></div></div><div class="mini-states"><span class="mini-state">MISSING</span><span class="mini-state">BROKEN</span><span class="mini-state">TINY</span><span class="mini-state">SKELETON</span></div></div>`;
    return `<div class="mini-frame mobile" ${binding}><span class="device-label">MOBILE · 390×844</span><div class="mini-mobile-layout"><div class="mobile-primary"><img src="${assets.poster}" alt="Contained portrait poster fixture"></div><div class="mobile-previews"><img src="${assets.landscape}" alt="Photography preview"><img src="${assets.portrait}" alt="4 by 5 preview"><img src="${assets.reviewed}" alt="5 by 4 preview"></div><div class="mobile-state-list"><span>UNKNOWN-TEXT</span><span>MISSING</span><span>BROKEN</span><span>SKELETON</span></div></div></div>`;
  }

  function option(card,option,index){
    const recommended=card.agent_recommendation.option_id===option.option_id;
    const consequences=Object.entries(option.consequences).map(([key,value])=>`<div class="consequence"><b>${esc(key)}</b>${esc(value)}</div>`).join("");
    return `<article class="option ${recommended?'recommended':''}" data-option-id="${esc(option.option_id)}" data-fixture-set-sha256="${FIXTURE_SET_SHA}" data-fixture-count="13" data-viewports="${VIEWPORTS.join(' ')}"><div class="option-index">Option ${index+1} · PENDING · NOT_MERGED</div><h3>${esc(option.label)}</h3><div class="option-id mono">${esc(option.option_id)}</div>${recommended?`<div class="recommendation">Agent recommendation · confidence ${esc(card.agent_recommendation.confidence.level)} ${esc(card.agent_recommendation.confidence.score)} · NOT ACCEPTANCE</div>`:'<div class="not-recommended" aria-hidden="true"></div>'}<h4>Если владелец выберет</h4>${bullets(option.changed_if_owner_selects)}<h4>Последствия</h4><div class="consequence-grid">${consequences}</div><div class="impact"><b>Migration · ${esc(option.migration_impact.level)}</b><br>${esc(option.migration_impact.description)}</div><div class="impact"><b>Reversibility · ${esc(option.reversibility.rating)}</b><br>${esc(option.reversibility.reversal_action)}</div><div class="visual-proof"><div class="visual-proof-head"><span>Same exact 13-fixture matrix</span><span>annotation only</span></div><div class="frame-pair">${miniFrame('desktop')}${miniFrame('mobile')}</div><div class="fixture-bind"><b>Not an implemented variant.</b> Identical bytes, states, crop contract and viewport set across all three options. Fixture-set SHA-256: <span class="mono">${FIXTURE_SET_SHA}</span></div></div></article>`;
  }

  function fixtureAtlas(){
    const fixture=(id,title,meta,visual)=>`<article class="fixture" data-fixture-id="${id}"><div class="fixture-visual">${visual}</div><h3>${title}</h3><div class="fixture-meta">${meta}</div></article>`;
    return `<section class="fixture-atlas"><div class="atlas-head"><h2>Один и тот же fixture atlas · 13/13</h2><p>Атлас доказывает покрытие media/state/placement, а не реализованные варианты. Во всех опциях используются те же байты, state и viewport contract. Unknown-text — метаданный fail-closed state; bitmap не объявляет собственную семантику.</p></div><div class="atlas-grid">
      ${fixture(FIXTURE_IDS[0],'Photography · focal/safe','3:2 · cover · primary',`<img src="${assets.landscape}" alt="Landscape event photo"><span class="safe"></span><span class="focal"></span>`)}
      ${fixture(FIXTURE_IDS[1],'Photography · derived portrait','4:5 container · cover · primary/preview',`<img src="${assets.portrait}" alt="Deterministic 4 by 5 derivative">`)}
      ${fixture(FIXTURE_IDS[2],'Artwork · reviewed compact','5:4 · cover · small preview',`<img src="${assets.reviewed}" alt="Reviewed five by four artwork">`)}
      <article class="fixture" data-fixture-id="${FIXTURE_IDS[3]}"><div class="fixture-visual ratio-2x3"><img class="contain" src="${assets.source}" alt="Three by two photo contained in a two by three frame"></div><h3>Photography · ratio container</h3><div class="fixture-meta">2:3 container · contain · intrinsic source stays 3:2</div></article>
      ${fixture(FIXTURE_IDS[4],'Meaningful artwork/OCR','1:1 · contain · crop forbidden',`<img class="contain" src="${assets.square}" alt="Square meaningful-text artwork">`)}
      ${fixture(FIXTURE_IDS[5],'Portrait poster/OCR','intrinsic 906×1280 · contain · full text',`<img class="contain" src="${assets.poster}" alt="Portrait poster with meaningful text">`)}
      ${fixture(FIXTURE_IDS[6],'Unknown-text · metadata only','intrinsic · contain · safe_crop=false',`<img class="contain" src="${assets.unknown}" alt="Media whose text semantics are unknown"><span class="metadata-badge">UNKNOWN-TEXT · METADATA STATE</span>`)}
      ${fixture(FIXTURE_IDS[7],'Primary + small previews','composite · cover/contain · same leaf bytes',`<div class="composite"><img src="${assets.landscape}" alt="Primary photography"><div class="stack"><img src="${assets.poster}" alt="Poster preview"><img src="${assets.reviewed}" alt="Artwork preview"></div></div>`)}
      ${fixture(FIXTURE_IDS[8],'Poster companion','photo primary + contained poster + preview',`<div class="composite"><img src="${assets.landscape}" alt="Primary photo"><div class="stack"><img class="contain" src="${assets.poster}" alt="Contained poster companion"><img src="${assets.portrait}" alt="Small preview"></div></div>`)}
      ${fixture(FIXTURE_IDS[9],'Missing media','no-source · reserved 1:1 · typed fallback evidence',`<img class="contain" src="${assets.missing}" alt="Existing fallback art used when media is missing"><span class="metadata-badge">SOURCE MISSING</span>`)}
      ${fixture(FIXTURE_IDS[10],'Broken/error','ERR_FAILED · geometry reserved · browser marker hidden',`<div class="broken-state">MEDIA UNAVAILABLE<small>controlled error state</small></div>`)}
      ${fixture(FIXTURE_IDS[11],'Tiny source','320×320 source · contain · no accepted upscale ceiling',`<img class="tiny" src="${assets.tiny}" alt="Tiny 320 pixel source artwork"><span class="metadata-badge">SOURCE 320×320</span>`)}
      ${fixture(FIXTURE_IDS[12],'Skeleton/loading','5:4 reservation · motion disabled',`<div class="skeleton"><span></span><span></span><span style="width:68%"></span></div>`)}
    </div></section>`;
  }

  function board(card){
    const surfaceCount=card.affected_surfaces.length;
    const commonPreserved=card.options[0].preserved;
    return `<section class="decision-board" id="${card.id}" data-decision-id="${card.id}" data-status="${card.status}" data-decision="${card.decision}" data-fixture-set-sha256="${FIXTURE_SET_SHA}"><header><div class="kicker">Owner decision card · exact blocker ${esc(card.blocker_id)}</div><h1>${esc(card.id)}</h1><p class="question">${esc(card.question)}</p><div class="status-row"><span class="chip pending">PENDING_OWNER_DECISION</span><span class="chip stop">NOT_MERGED</span><span class="chip evidence">evidence-only · non-production</span><span class="chip">${card.affected_consumer_application_refs.length} consumer refs</span><span class="chip">${surfaceCount} surfaces</span><span class="chip">13 fixtures × 2 viewports × 3 options</span></div></header><div class="summary-grid"><section class="summary-card"><h2>Scoped owner prompt</h2><p>${esc(card.scoped_owner_prompt)}</p></section><section class="summary-card"><h2>Exact blocker</h2><p><b>${esc(card.source_statement)}</b></p><p>Closure: ${esc(card.source_closure_condition)}</p></section></div><section class="boundary"><h2>Boundary diagram · comparison only</h2>${diagram(card.id)}</section><div class="owner-callout"><strong>Точный receipt нужен от владельца</strong><span>${esc(card.exact_owner_choice_needed)}</span></div><div class="options-title"><h2>Три допустимых решения</h2><p>Ни один вариант не выбран. Различается только decision annotation; fixture bytes/state/crop/viewport set неизменны.</p></div><section class="option-grid">${card.options.map((item,index)=>option(card,item,index)).join('')}</section>${fixtureAtlas()}<section class="common-guardrail">${commonPreserved.map((item,index)=>`<div><b>Preserved ${index+1}</b>${esc(item)}</div>`).join('')}</section><footer class="board-footer"><div>Rights: existing owner-controlled internal evidence only. No redistribution or license claim. No production-state claim. No production UI, Penpot, tokens, contract acceptance, implementation, migration, merge/split or promotion is authorized by this pack.</div><div class="mono">fixture-set-sha256<br>${FIXTURE_SET_SHA}</div></footer></section>`;
  }

  const pack=document.getElementById('pack');
  pack.innerHTML=DECISIONS.map(board).join('');
  const nav=document.querySelector('.pack-nav');
  DECISIONS.forEach(card=>{const link=document.createElement('a');link.href=`#${card.id}`;link.textContent=card.blocker_id;nav.appendChild(link)});
  document.documentElement.dataset.renderReady="true";
  </script>
</body>
</html>
'''


if __name__ == "__main__":
    main()
