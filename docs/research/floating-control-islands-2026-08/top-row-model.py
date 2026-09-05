"""Offline feasibility model for Floating Islands top-row v1.1.

Synthetic CSS-pixel widths only: not Astro, a browser, a layout implementation,
Penpot materialization or accessibility certification. No network/dependencies.
Run: python top-row-model.py
"""
from dataclasses import dataclass, replace
from math import isfinite
import json
import unittest

@dataclass(frozen=True)
class Slot:
    role: str
    width: float
    height: float
    text: bool
    icon: bool
    action: str | None = None

@dataclass(frozen=True)
class Profile:
    key: str
    slots: tuple[Slot, ...]
    flow_roles: tuple[str, ...] = ()

# Widths deliberately synthetic. Real variants must supply measured sizes and
# source-bound assets; this model does not infer width from text or icon names.
PROFILES = (
    Profile('full', (
        Slot('page',240,56,True,True,'page-top'),
        Slot('shelf',480,56,True,True,'section-context'),
        Slot('menu',144,48,True,True,'global-menu'),
        Slot('medallion',64,64,False,False))),
    Profile('lean', (
        Slot('page',176,48,True,False,'page-top'),
        Slot('shelf',280,48,True,False,'section-context'),
        Slot('menu',72,48,True,False,'global-menu'),
        Slot('medallion',56,56,False,False))),
    Profile('compact', (
        Slot('page',96,48,True,False,'page-top'),
        Slot('shelf',120,48,True,False,'section-context'),
        Slot('menu',44,44,False,True,'global-menu'),
        Slot('medallion',56,56,False,False))),
    Profile('flow-medallion', (
        Slot('page',96,48,True,False,'page-top'),
        Slot('shelf',120,48,True,False,'section-context'),
        Slot('menu',44,44,False,True,'global-menu')), ('medallion',)),
    Profile('flow-context', (
        Slot('page',96,48,True,False,'page-top'),
        Slot('menu',44,44,False,True,'global-menu')), ('shelf','medallion')),
)


def validate(profiles: tuple[Profile, ...]) -> None:
    keys = set()
    actions: dict[str, str] = {}
    for profile in profiles:
        if profile.key in keys:
            raise ValueError('duplicate profile')
        keys.add(profile.key)
        roles = [s.role for s in profile.slots] + list(profile.flow_roles)
        if sorted(roles) != ['medallion', 'menu', 'page', 'shelf']:
            raise ValueError('lost or duplicated semantic role')
        for slot in profile.slots:
            if not all(isfinite(v) and v > 0 for v in (slot.width,slot.height)):
                raise ValueError('invalid geometry')
            if slot.role in ('page','shelf') and not slot.text:
                raise ValueError('context cannot become an unidentified glyph')
            if slot.action:
                if min(slot.width,slot.height) < 44:
                    raise ValueError('interactive hit target too small')
                if slot.role in actions and actions[slot.role] != slot.action:
                    raise ValueError('compaction changed the action')
                actions[slot.role] = slot.action
                if not slot.text and not slot.icon:
                    raise ValueError('invisible control')


def solve(width: float, *, mode: str = 'reading', previous: str | None = None,
          locked: bool = False, safe_left: float = 0, safe_right: float = 0,
          edge: float = 12, gap: float = 8, max_height: float = 64,
          expand_slack: float = 16,
          profiles: tuple[Profile, ...] = PROFILES) -> dict:
    validate(profiles)
    if mode not in ('reading','overview'):
        raise ValueError('unknown mode')
    if not all(isfinite(v) and v >= 0 for v in
               (width,safe_left,safe_right,edge,gap,max_height,expand_slack)):
        raise ValueError('invalid budget')
    left, right = max(edge,safe_left), max(edge,safe_right)
    budget = max(0,width-left-right)
    def need(p):
        return sum(s.width for s in p.slots) + gap * (len(p.slots)-1)
    def fits(p):
        return need(p) <= budget and max(s.height for s in p.slots) <= max_height
    choices = profiles if mode == 'overview' else profiles[1:]
    old = next((p for p in profiles if p.key == previous), None)
    if previous is not None and old is None:
        raise ValueError('unknown previous profile')
    if locked and old is not None:
        if not fits(old):
            # The runtime must cancel/acknowledge the unsafe gesture first.
            return {'mode':'cancel-before-relayout','activate_action':False}
        selected = old
    else:
        selected = next((p for p in choices if fits(p)), None)
        if selected is None:
            return {'mode':'flow','flow_roles':['page','shelf','menu','medallion']}
        if old in choices and fits(old) and choices.index(selected) < choices.index(old):
            if budget - need(selected) < expand_slack:
                selected = old
    row_width = need(selected)
    x = left + (budget-row_width)/2
    boxes = []
    for slot in selected.slots:
        boxes.append({'role':slot.role,'x':x,'width':slot.width,
                      'height':slot.height,'text':slot.text,'icon':slot.icon,
                      'action':slot.action})
        x += slot.width + gap
    return {'mode':'row','profile':selected.key,'width':row_width,
            'height':max(s.height for s in selected.slots),'rows':1,
            'boxes':boxes,'flow_roles':list(selected.flow_roles)}


class TopRowModelTests(unittest.TestCase):
    def test_profiles(self):
        validate(PROFILES)

    def test_reading_does_not_fill_spare_space(self):
        self.assertEqual(solve(1920)['profile'],'lean')
        self.assertEqual(solve(1280,mode='overview')['profile'],'full')

    def test_four_roles_mobile(self):
        result=solve(390)
        self.assertEqual(result['profile'],'compact')
        self.assertEqual(len(result['boxes']),4)

    def test_narrow_relocates_not_deletes(self):
        result=solve(320)
        self.assertEqual(result['profile'],'flow-medallion')
        self.assertEqual(result['flow_roles'],['medallion'])

    def test_extreme_width_keeps_readable_flow(self):
        self.assertEqual(solve(150)['mode'],'flow')

    def test_icons_are_not_monotonic_but_actions_are(self):
        views=[next(s for s in p.slots if s.role=='menu') for p in PROFILES[:3]]
        self.assertEqual([s.icon for s in views],[True,False,True])
        self.assertEqual({s.action for s in views},{'global-menu'})

    def test_focus_lock_and_forced_resize(self):
        self.assertEqual(solve(1280,previous='compact',locked=True)['profile'],'compact')
        result=solve(320,previous='compact',locked=True)
        self.assertEqual(result['mode'],'cancel-before-relayout')
        self.assertFalse(result['activate_action'])

    def test_hysteresis(self):
        self.assertEqual(solve(640,previous='compact')['profile'],'compact')
        self.assertEqual(solve(656,previous='compact')['profile'],'lean')

    def test_safe_area_not_added_twice(self):
        result=solve(390,safe_left=20,safe_right=20)
        first,last=result['boxes'][0],result['boxes'][-1]
        self.assertAlmostEqual(first['x'],25)
        self.assertAlmostEqual(last['x']+last['width'],365)

    def test_height_budget_not_sum(self):
        result=solve(1280)
        self.assertEqual(result['height'],56)
        self.assertEqual(solve(1280,max_height=43)['mode'],'flow')

    def test_invalid_values(self):
        for value in (float('nan'),float('inf'),-1):
            with self.assertRaises(ValueError): solve(value)
        with self.assertRaises(ValueError): solve(390,previous='nonexistent')

    def test_glyph_title_and_tiny_target_rejected(self):
        first=PROFILES[0]
        for bad in (replace(first.slots[0],text=False),replace(first.slots[0],width=24)):
            broken=(replace(first,slots=(bad,)+first.slots[1:]),)+PROFILES[1:]
            with self.assertRaises(ValueError): validate(broken)

    def test_lost_role_or_action_fork_rejected(self):
        with self.assertRaises(ValueError):
            validate((replace(PROFILES[0],slots=PROFILES[0].slots[:-1]),))
        bad=replace(PROFILES[1].slots[2],action='section-menu')
        with self.assertRaises(ValueError):
            validate((PROFILES[0],replace(PROFILES[1],slots=PROFILES[1].slots[:2]+(bad,)+PROFILES[1].slots[3:])))

    def test_all_integer_widths(self):
        for width in range(160,1921):
            result=solve(width)
            if result['mode']!='row': continue
            self.assertEqual(result['rows'],1)
            boxes=result['boxes']
            self.assertGreaterEqual(boxes[0]['x'],12)
            self.assertLessEqual(boxes[-1]['x']+boxes[-1]['width'],width-12)
            for a,b in zip(boxes,boxes[1:]):
                self.assertGreaterEqual(b['x']-(a['x']+a['width']),8)

if __name__=='__main__':
    suite=unittest.defaultTestLoader.loadTestsFromTestCase(TopRowModelTests)
    result=unittest.TextTestRunner(verbosity=2).run(suite)
    if not result.wasSuccessful(): raise SystemExit(1)
    print(json.dumps({'evidence':'MODEL_ONLY_SYNTHETIC_WIDTHS',
        'tests':result.testsRun,'samples':{str(w):solve(w) for w in (320,390,768,1280)}},
        ensure_ascii=False,indent=2))
