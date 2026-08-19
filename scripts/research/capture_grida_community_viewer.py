#!/usr/bin/env python3
"""Capture a public Figma Community or compatible viewer with Chromium/Selenium.

This is a read-only research probe. It records:
- rendered DOM and visible text;
- viewport screenshot;
- browser console;
- performance resource URLs;
- selected JSON/text response bodies exposed to the browser.

No authenticated cookies or credentials are used. Captured metadata and previews do
not establish component identity, code binding, acceptance or lifecycle status.
"""

from __future__ import annotations

import argparse
import base64
import json
import re
import time
from pathlib import Path
from urllib.parse import urlparse

from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.chrome.options import Options


KEYWORDS = (
    "figma",
    "community",
    "archive",
    "supabase",
    "graphql",
    "api/",
    "multiplayer",
    "thumbnail",
    "cover",
    "hub/file",
    ".json",
    ".fig",
    "grida",
)
MAX_BODY_BYTES = 30 * 1024 * 1024


def safe_file(value: str) -> str:
    return re.sub(r"[^0-9A-Za-z_.-]+", "-", value).strip("-")[:180] or "response"


def target_id(url: str) -> str:
    match = re.search(r"/community/file/(\d+)", url)
    if match:
        return match.group(1)
    parsed = urlparse(url)
    return safe_file(parsed.netloc + parsed.path)


def capture(url: str, output: Path, seconds: int) -> None:
    output.mkdir(parents=True, exist_ok=True)
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1200")
    options.add_argument("--hide-scrollbars")
    options.add_argument("--lang=en-US")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument(
        "--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
    )
    options.set_capability("goog:loggingPrefs", {"performance": "ALL", "browser": "ALL"})

    driver = webdriver.Chrome(options=options)
    driver.execute_cdp_cmd(
        "Network.enable",
        {"maxTotalBufferSize": 150_000_000, "maxResourceBufferSize": 60_000_000},
    )
    navigation_error = None
    try:
        try:
            driver.get(url)
        except WebDriverException as exc:
            navigation_error = str(exc)

        deadline = time.time() + seconds
        previous = ""
        stable_rounds = 0
        while time.time() < deadline:
            time.sleep(2)
            try:
                current = driver.find_element("tag name", "body").text[:40000]
            except Exception:
                current = ""
            if current == previous and len(current) > 20:
                stable_rounds += 1
            else:
                stable_rounds = 0
            previous = current
            if stable_rounds >= 7:
                break

        (output / "capture-status.json").write_text(
            json.dumps(
                {
                    "requested_url": url,
                    "final_url": driver.current_url,
                    "title": driver.title,
                    "navigation_error": navigation_error,
                },
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        (output / "page-source.html").write_text(driver.page_source, encoding="utf-8")
        try:
            body_text = driver.find_element("tag name", "body").text
        except Exception:
            body_text = ""
        (output / "body-text.txt").write_text(body_text, encoding="utf-8")
        driver.save_screenshot(str(output / "viewport.png"))

        try:
            resources = driver.execute_script(
                "return performance.getEntriesByType('resource').map(x => "
                "({name:x.name, initiatorType:x.initiatorType, duration:x.duration, "
                "transferSize:x.transferSize, decodedBodySize:x.decodedBodySize}));"
            )
        except Exception:
            resources = []
        (output / "performance-resources.json").write_text(
            json.dumps(resources, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )

        browser_logs = driver.get_log("browser")
        (output / "browser-console.json").write_text(
            json.dumps(browser_logs, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )

        events = []
        responses = []
        response_dir = output / "responses"
        response_dir.mkdir(exist_ok=True)
        for raw in driver.get_log("performance"):
            try:
                message = json.loads(raw["message"])["message"]
            except Exception:
                continue
            method = message.get("method")
            params = message.get("params") or {}
            if method not in {
                "Network.requestWillBeSent",
                "Network.responseReceived",
                "Network.loadingFailed",
            }:
                continue
            events.append(message)
            if method != "Network.responseReceived":
                continue
            response = params.get("response") or {}
            response_url = str(response.get("url") or "")
            mime = str(response.get("mimeType") or "")
            lower = response_url.lower()
            interesting = any(word in lower for word in KEYWORDS) or any(
                token in mime for token in ("json", "text", "javascript", "octet-stream")
            )
            record = {
                "requestId": params.get("requestId"),
                "url": response_url,
                "status": response.get("status"),
                "mimeType": mime,
                "encodedDataLength": response.get("encodedDataLength"),
                "fromDiskCache": response.get("fromDiskCache"),
                "fromServiceWorker": response.get("fromServiceWorker"),
                "interesting": interesting,
            }
            responses.append(record)
            if not interesting:
                continue
            request_id = params.get("requestId")
            if not request_id:
                continue
            try:
                body = driver.execute_cdp_cmd("Network.getResponseBody", {"requestId": request_id})
                data = body.get("body", "")
                if body.get("base64Encoded"):
                    payload = base64.b64decode(data)
                else:
                    payload = data.encode("utf-8", errors="replace")
                if len(payload) > MAX_BODY_BYTES:
                    payload = payload[:MAX_BODY_BYTES]
                parsed = urlparse(response_url)
                suffix = Path(parsed.path).suffix or ".txt"
                name = safe_file(f"{len(responses):04d}-{parsed.netloc}-{parsed.path}") + suffix
                (response_dir / name).write_bytes(payload)
                record["saved_body"] = f"responses/{name}"
                record["saved_bytes"] = len(payload)
            except Exception as exc:
                record["body_error"] = str(exc)

        (output / "network-events.json").write_text(
            json.dumps(events, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        (output / "network-responses.json").write_text(
            json.dumps(responses, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        candidates = [
            f"{r.get('status')}\t{r.get('mimeType')}\t{r.get('url')}\t{r.get('saved_body', '')}"
            for r in responses
            if r.get("interesting")
        ]
        (output / "endpoint-candidates.tsv").write_text(
            "\n".join(candidates) + "\n", encoding="utf-8"
        )
    finally:
        driver.quit()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", action="append", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--seconds", type=int, default=45)
    args = parser.parse_args()
    for url in args.url:
        capture(url, args.output / target_id(url), args.seconds)


if __name__ == "__main__":
    main()
