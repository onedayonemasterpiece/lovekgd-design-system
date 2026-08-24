#!/usr/bin/env python3
"""Deprecated compatibility entrypoint for ui-component-certification."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).resolve().parents[2] / 'ui-component-certification' / 'scripts' / 'send-telegram-topic.py'), run_name='__main__')
