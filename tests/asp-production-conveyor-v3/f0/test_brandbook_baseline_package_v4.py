#!/usr/bin/env python3
from pathlib import Path
import sys, unittest
ROOT=Path(__file__).resolve().parents[3]; sys.path.insert(0,str(ROOT/'tests/asp-production-conveyor-v3/f0'))
from f0_small_page_testkit_v1 import suite
POINTER=ROOT/'catalog/asp-production-conveyor-v3/f0/F-BRANDBOOK-BASELINE.package.v4.json'
if __name__=="__main__": raise SystemExit(0 if unittest.TextTestRunner(verbosity=2).run(suite(POINTER,'F-BRANDBOOK-BASELINE',4)).wasSuccessful() else 1)
