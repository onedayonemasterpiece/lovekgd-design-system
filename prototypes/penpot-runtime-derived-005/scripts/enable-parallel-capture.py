#!/usr/bin/env python3
from pathlib import Path

PATH = Path("prototypes/penpot-runtime-derived-005/scripts/build-runtime-catalog.mjs")
PARALLELISM = 2

text = PATH.read_text(encoding="utf-8")

start_old = """    for (const viewport of viewports) {
      const context = await browser.newContext({"""
start_new = f"""    for (let viewportStart = 0; viewportStart < viewports.length; viewportStart += {PARALLELISM}) {{
      await Promise.all(viewports.slice(viewportStart, viewportStart + {PARALLELISM}).map(async (viewport) => {{
        const context = await browser.newContext({{"""

if start_old in text:
    text = text.replace(start_old, start_new, 1)
elif start_new not in text:
    raise SystemExit("viewport_parallel_start_anchor_missing")

end_old = """      } finally {
        await context.close();
      }
    }
    pageResults.push(pageEntry);"""
end_new = """      } finally {
        await context.close();
      }
      }));
    }
    pageEntry.viewports.sort(
      (a, b) => viewports.findIndex((item) => item.id === a.id)
        - viewports.findIndex((item) => item.id === b.id),
    );
    pageResults.push(pageEntry);"""

if end_old in text:
    text = text.replace(end_old, end_new, 1)
elif end_new not in text:
    raise SystemExit("viewport_parallel_end_anchor_missing")

PATH.write_text(text, encoding="utf-8")
print(f"[rg005] viewport capture parallelism enabled: {PARALLELISM}")
