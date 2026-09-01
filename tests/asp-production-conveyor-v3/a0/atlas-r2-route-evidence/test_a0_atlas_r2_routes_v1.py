#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, os, subprocess, sys, tempfile, unittest
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[4]
GEN = ROOT / "scripts/asp-production-conveyor-v3/a0/atlas-r2-route-evidence/render_a0_atlas_r2_routes_v1.py"
FIN = ROOT / "scripts/asp-production-conveyor-v3/a0/atlas-r2-route-evidence/finalize_atlas_r2_evidence_8of8_v1.py"
A0 = ROOT / "reports/asp-production-conveyor-v3/atlas-v2/source-bound/a0-routes"
RENDERED = ROOT / "reports/asp-production-conveyor-v3/atlas-v2/rendered"
NAMES = ("r2-archetype-home", "r2-composed-ready", "r2-composed-exception")

def digest_tree(root: Path):
    return {str(p.relative_to(root)): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(root.rglob("*")) if p.is_file()}

class EvidenceTest(unittest.TestCase):
    def test_deterministic_regeneration(self):
        with tempfile.TemporaryDirectory() as a, tempfile.TemporaryDirectory() as b:
            for dst in (a,b):
                env = dict(os.environ, A0_EVIDENCE_ROOT=dst)
                subprocess.run([sys.executable, str(GEN)], check=True, env=env, stdout=subprocess.DEVNULL)
            da = digest_tree(Path(a) / "reports/asp-production-conveyor-v3/atlas-v2/source-bound/a0-routes")
            db = digest_tree(Path(b) / "reports/asp-production-conveyor-v3/atlas-v2/source-bound/a0-routes")
            self.assertEqual(da, db)

    def test_three_real_source_bound_surfaces(self):
        for name in NAMES:
            svg = (A0 / f"{name}.svg").read_text()
            root = ET.fromstring(svg)
            self.assertEqual(root.attrib["width"], "2624")
            self.assertEqual(root.attrib["height"], "1472")
            self.assertEqual(root.attrib["data-evidence-kind"], "offline-source-bound")
            self.assertEqual(root.attrib["data-penpot-implementation"], "false")
            self.assertNotIn("<image", svg)
            self.assertNotIn("wireframe", svg.lower())
            self.assertGreater(len(svg), 15000)
            self.assertGreater((A0 / f"{name}.png").stat().st_size, 100000)

    def test_home_contract(self):
        svg=(A0/"r2-archetype-home.svg").read_text()
        for value in ("Куда пойти — без лишнего шума","Сегодня","Завтра","Выходные","Бесплатно","Выставки","Необычное","event.real.4240","event.real.8006","event.real.8200"):
            self.assertIn(value, svg)

    def test_ready_membership_and_states(self):
        svg=(A0/"r2-composed-ready.svg").read_text()
        census=json.loads((A0/"state-census.v1.json").read_text())
        self.assertEqual(census["ready"]["events"], ["event.real.8006","event.real.8200"])
        self.assertEqual(census["ready"]["exhibitions"], ["event.real.2182","event.real.6711","event.real.7609"])
        pairs={(x["viewport"],x["state"]) for x in census["ready"]["states"]}
        self.assertEqual(pairs,{(v,s) for v in ("desktop","mobile") for s in ("top","scrolled","full")})
        for title in ("Донорская акция","Музыкальная экспедиция","Песчаная палитра","Под шум балтийского ветра","Живая нить традиций"):
            self.assertIn(title, svg)

    def test_exception_is_card_free(self):
        svg=(A0/"r2-composed-exception.svg").read_text()
        census=json.loads((A0/"state-census.v1.json").read_text())
        pairs={(x["viewport"],x["state"]) for x in census["exception"]["states"]}
        self.assertEqual(pairs,{(v,s) for v in ("desktop","mobile") for s in ("loading","empty","error")})
        self.assertTrue(all(x["rendered_fixture_ids"]==[] and x["eventcard_instances"]==0 for x in census["exception"]["states"]))
        for title in ("Донорская акция","Музыкальная экспедиция","Песчаная палитра","Под шум балтийского ветра","Живая нить традиций"):
            self.assertNotIn(title, svg)
        for control in ("Открыть афишу","Повторить"):
            self.assertIn(control,svg)

    def test_gates_and_aggregate(self):
        local=json.loads((A0/"validation.v1.json").read_text())
        self.assertEqual(local["gates"]["source_bound_content"],"3/3")
        for k in ("placeholder_cells","generic_empty_boards","incorrect_metadata","missing_or_duplicate_states","overlaps","clipping","content_outside_root"):
            self.assertEqual(local["gates"][k],0)
        agg=json.loads((RENDERED/"source-bound-evidence-8of8.v1.json").read_text())
        self.assertEqual(len(agg["representatives"]),8)
        self.assertEqual(agg["gates"]["representatives"],"8/8")
        self.assertEqual(agg["gates"]["source_bound_content"],"8/8")
        self.assertFalse(agg["raster_is_penpot_implementation"])
        self.assertEqual(agg["penpot_mutations"],0)

if __name__ == "__main__":
    unittest.main(verbosity=2)
