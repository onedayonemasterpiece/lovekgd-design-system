#!/usr/bin/env python3
from pathlib import Path
import sys
HERE=Path(__file__).resolve().parent; ROOT=Path(__file__).resolve().parents[3]; sys.path.insert(0,str(HERE))
from f0_small_page_bundle_v1 import cli
POINTER=ROOT/'catalog/asp-production-conveyor-v3/f0/F-BRANDBOOK-BASELINE.package.v4.json'
if __name__=="__main__": raise SystemExit(cli(POINTER))
