#!/usr/bin/env python3
"""Create a bounded structural inventory from decoded Figma Kiwi JSON.

The output is evidence, not a design-system acceptance decision. It records
pages, node types, component-like nodes, names and property-bearing fields while
keeping the full decoded checkpoint as a separate artifact.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
from collections import Counter, defaultdict, deque
from pathlib import Path
from typing import Any, Iterable


COMPONENT_TYPES = {
    "COMPONENT",
    "COMPONENT_SET",
    "SYMBOL",
    "STATE_GROUP",
    "INSTANCE",
    "SYMBOL_INSTANCE",
}
PAGE_TYPES = {"CANVAS", "PAGE"}
INTERESTING_KEY = re.compile(
    r"component|symbol|variant|property|properties|style|variable|token|slot|override|"
    r"stack|layout|padding|spacing|align|constraint|visible|opacity|description",
    re.IGNORECASE,
)
TEXT_KEY = re.compile(r"characters|text|content", re.IGNORECASE)


def guid(value: Any) -> str | None:
    if not isinstance(value, dict):
        return None
    session = value.get("sessionID", value.get("sessionId", value.get("session")))
    local = value.get("localID", value.get("localId", value.get("local")))
    if session is None or local is None:
        return None
    return f"{session}:{local}"


def parent_guid(node: dict[str, Any]) -> str | None:
    parent = node.get("parentIndex")
    if isinstance(parent, dict):
        result = guid(parent.get("guid"))
        if result:
            return result
    for key in ("parentGuid", "parent", "parentID", "parentId"):
        value = node.get(key)
        result = guid(value) if isinstance(value, dict) else str(value) if value is not None else None
        if result:
            return result
    return None


def compact(value: Any, depth: int = 0) -> Any:
    if depth >= 2:
        if isinstance(value, dict):
            return {"_kind": "object", "keys": sorted(map(str, value.keys()))[:30]}
        if isinstance(value, list):
            return {"_kind": "array", "length": len(value)}
        return value
    if isinstance(value, str):
        return value[:500]
    if isinstance(value, (int, float, bool)) or value is None:
        return value
    if isinstance(value, list):
        return [compact(item, depth + 1) for item in value[:20]] + (
            [{"_truncated": len(value) - 20}] if len(value) > 20 else []
        )
    if isinstance(value, dict):
        return {str(key): compact(item, depth + 1) for key, item in list(value.items())[:40]}
    return repr(value)[:500]


def strings(value: Any, prefix: str = "", depth: int = 0) -> Iterable[tuple[str, str]]:
    if depth > 5:
        return
    if isinstance(value, str):
        if value.strip():
            yield prefix, value.strip()
        return
    if isinstance(value, list):
        for index, item in enumerate(value[:200]):
            yield from strings(item, f"{prefix}[{index}]", depth + 1)
        return
    if isinstance(value, dict):
        for key, item in value.items():
            path = f"{prefix}.{key}" if prefix else str(key)
            yield from strings(item, path, depth + 1)


def merge_changes(changes: list[dict[str, Any]]) -> tuple[dict[str, dict[str, Any]], Counter[str]]:
    nodes: dict[str, dict[str, Any]] = {}
    anonymous: Counter[str] = Counter()
    for change in changes:
        node_id = guid(change.get("guid"))
        if not node_id:
            anonymous[str(change.get("type") or "UNKNOWN")] += 1
            continue
        if change.get("isDeleted") or str(change.get("phase") or "").upper() == "DELETE":
            nodes.pop(node_id, None)
            continue
        merged = dict(nodes.get(node_id) or {})
        merged.update(change)
        nodes[node_id] = merged
    return nodes, anonymous


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("decoded", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    message = json.loads(args.decoded.read_text(encoding="utf-8"))
    changes = message.get("nodeChanges") or []
    if not isinstance(changes, list):
        raise TypeError("decoded message does not contain a nodeChanges array")
    changes = [item for item in changes if isinstance(item, dict)]
    nodes, anonymous_changes = merge_changes(changes)

    children: dict[str, list[str]] = defaultdict(list)
    roots: list[str] = []
    for node_id, node in nodes.items():
        parent = parent_guid(node)
        if parent and parent in nodes and parent != node_id:
            children[parent].append(node_id)
        else:
            roots.append(node_id)

    type_counts = Counter(str(node.get("type") or "UNKNOWN") for node in nodes.values())
    key_counts = Counter(key for node in nodes.values() for key in node)

    page_ids = [
        node_id
        for node_id, node in nodes.items()
        if str(node.get("type") or "").upper() in PAGE_TYPES
    ]
    page_ids.sort(key=lambda item: (str(nodes[item].get("name") or ""), item))

    node_page: dict[str, str] = {}
    for page_id in page_ids:
        queue = deque([page_id])
        while queue:
            node_id = queue.popleft()
            if node_id in node_page and node_id != page_id:
                continue
            node_page[node_id] = page_id
            queue.extend(children.get(node_id) or [])

    def descendants(root_id: str) -> list[str]:
        result: list[str] = []
        queue = deque(children.get(root_id) or [])
        while queue:
            node_id = queue.popleft()
            result.append(node_id)
            queue.extend(children.get(node_id) or [])
        return result

    pages = []
    for page_id in page_ids:
        desc = descendants(page_id)
        top_level = children.get(page_id) or []
        pages.append(
            {
                "id": page_id,
                "name": nodes[page_id].get("name"),
                "type": nodes[page_id].get("type"),
                "descendant_count": len(desc),
                "top_level_count": len(top_level),
                "component_like_count": sum(
                    1 for item in desc if str(nodes[item].get("type") or "").upper() in COMPONENT_TYPES
                ),
                "type_counts": dict(
                    Counter(str(nodes[item].get("type") or "UNKNOWN") for item in desc).most_common()
                ),
                "top_level": [
                    {
                        "id": item,
                        "type": nodes[item].get("type"),
                        "name": nodes[item].get("name"),
                        "child_count": len(children.get(item) or []),
                        "size": compact(nodes[item].get("size")),
                        "transform": compact(nodes[item].get("transform")),
                    }
                    for item in top_level[:250]
                ],
            }
        )

    components = []
    for node_id, node in nodes.items():
        node_type = str(node.get("type") or "").upper()
        name = str(node.get("name") or "")
        component_signal = node_type in COMPONENT_TYPES or any(
            INTERESTING_KEY.search(str(key)) and "component" in str(key).lower()
            for key in node
        )
        if not component_signal:
            continue
        page_id = node_page.get(node_id)
        interesting = {
            key: compact(value)
            for key, value in node.items()
            if INTERESTING_KEY.search(str(key))
        }
        components.append(
            {
                "id": node_id,
                "type": node.get("type"),
                "name": name,
                "page_id": page_id,
                "page_name": nodes.get(page_id, {}).get("name") if page_id else None,
                "parent_id": parent_guid(node),
                "child_count": len(children.get(node_id) or []),
                "interesting_fields": interesting,
            }
        )
    components.sort(key=lambda item: (str(item.get("page_name") or ""), str(item.get("name") or ""), item["id"]))

    names = []
    text_values = []
    for node_id, node in nodes.items():
        name = node.get("name")
        if isinstance(name, str) and name.strip():
            names.append(
                {
                    "id": node_id,
                    "type": node.get("type"),
                    "page_name": nodes.get(node_page.get(node_id), {}).get("name") if node_page.get(node_id) else None,
                    "name": name.strip(),
                }
            )
        for path, value in strings(node):
            if TEXT_KEY.search(path) and len(value) <= 4000:
                text_values.append(
                    {
                        "id": node_id,
                        "type": node.get("type"),
                        "page_name": nodes.get(node_page.get(node_id), {}).get("name") if node_page.get(node_id) else None,
                        "path": path,
                        "value": value,
                    }
                )
                if len(text_values) >= 30000:
                    break

    summary = {
        "document_kind": "decoded-public-figma-checkpoint-inventory",
        "authority_effect": "none",
        "canonical": False,
        "decoder": message.get("_decoder"),
        "top_level_message_keys": sorted(message.keys()),
        "node_change_count": len(changes),
        "unique_node_count": len(nodes),
        "root_count": len(roots),
        "page_count": len(pages),
        "component_like_count": len(components),
        "anonymous_change_types": dict(anonymous_changes.most_common()),
        "node_type_counts": dict(type_counts.most_common()),
        "frequent_node_keys": dict(key_counts.most_common(200)),
        "pages": pages,
        "component_like_nodes": components,
        "limitations": [
            "Checkpoint was loaded by the public Community viewer and decoded offline.",
            "Internal node types and fields are reverse-engineered, not an official Figma API contract.",
            "Component-like classification is structural and does not establish current code binding.",
            "No LoveKGD identity, lifecycle transition, acceptance or promotion is inferred.",
        ],
    }
    (args.output / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    with (args.output / "nodes.csv").open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(["page", "type", "id", "name"])
        for item in sorted(names, key=lambda row: (str(row["page_name"] or ""), str(row["type"] or ""), row["name"])):
            writer.writerow([item["page_name"], item["type"], item["id"], item["name"]])

    with (args.output / "text.csv").open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(["page", "type", "id", "path", "value"])
        for item in text_values:
            writer.writerow([item["page_name"], item["type"], item["id"], item["path"], item["value"]])

    markdown = [
        "# Direct T2D2 Figma checkpoint inventory",
        "",
        "```text",
        "document_kind: decoded-public-figma-checkpoint-inventory",
        "authority_effect: none",
        "canonical: false",
        "```",
        "",
        "## Counts",
        "",
        f"- node changes: `{len(changes)}`",
        f"- unique nodes: `{len(nodes)}`",
        f"- pages: `{len(pages)}`",
        f"- component-like nodes: `{len(components)}`",
        "",
        "## Pages",
        "",
    ]
    for page in pages:
        markdown.append(
            f"### {page.get('name') or page['id']} — {page['descendant_count']} descendants, "
            f"{page['component_like_count']} component-like nodes"
        )
        markdown.append("")
        for item in page["top_level"][:80]:
            markdown.append(
                f"- `{item.get('type')}` `{item['id']}` — {item.get('name') or '(unnamed)'}"
            )
        markdown.append("")
    markdown.extend(["## Component-like inventory", ""])
    for item in components[:1000]:
        markdown.append(
            f"- `{item.get('type')}` **{item.get('name') or '(unnamed)'}** · "
            f"page `{item.get('page_name')}` · `{item['id']}` · children `{item['child_count']}`"
        )
    markdown.extend(["", "## Limitations", ""])
    markdown.extend(f"- {item}" for item in summary["limitations"])
    (args.output / "summary.md").write_text("\n".join(markdown) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
