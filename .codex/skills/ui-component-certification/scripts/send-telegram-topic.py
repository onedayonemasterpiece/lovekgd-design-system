#!/usr/bin/env python3
"""Send one UI conformance artifact to the single authorized Telegram topic."""

from __future__ import annotations

import argparse
import asyncio
import base64
import datetime as dt
import json
import os
import sys
from pathlib import Path

from telethon import TelegramClient
from telethon.sessions import StringSession


CHAT_ID = -1004337049383
ENTITY_ID = 4337049383
ENTITY_TITLE = "KenigEvents · UI review"
TOPIC_ID = 1030
TOPIC_TITLE = "Ревью компонентов (Astro - Penpot)"
SENDABLE_STATUS = "ready-for-existing-human-session-transport"


def load_env(path: Path) -> None:
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def telegram_config(env_path: Path) -> tuple[int, str, str, dict[str, str]]:
    load_env(env_path)
    api_id = int(os.getenv("TG_API_ID") or os.getenv("TELEGRAM_API_ID") or "0")
    api_hash = os.getenv("TG_API_HASH") or os.getenv("TELEGRAM_API_HASH") or ""
    session = (os.getenv("TELEGRAM_SESSION") or "").strip()
    client_kwargs: dict[str, str] = {}
    bundle = (os.getenv("TELEGRAM_AUTH_BUNDLE_E2E") or "").strip()
    if bundle:
        payload = json.loads(base64.urlsafe_b64decode(bundle.encode("ascii")).decode("utf-8"))
        session = (payload.get("session") or "").strip()
        for key in ("device_model", "system_version", "app_version", "lang_code", "system_lang_code"):
            if payload.get(key):
                client_kwargs[key] = str(payload[key])
    if not api_id or not api_hash or not session:
        raise RuntimeError("approved Telegram human session is unavailable")
    return api_id, api_hash, session, client_kwargs


def utc_iso(value: dt.datetime) -> str:
    return value.astimezone(dt.timezone.utc).isoformat().replace("+00:00", "Z")


def validate_plan(plan: dict) -> Path:
    if plan.get("target_link") != "https://t.me/c/4337049383/1030":
        raise RuntimeError("publication target is not the authorized review topic")
    if plan.get("topic_root_message_id") != TOPIC_ID:
        raise RuntimeError("publication plan has the wrong topic root")
    if plan.get("status") != SENDABLE_STATUS:
        raise RuntimeError(f"plan is not sendable: {plan.get('status')}")
    image = Path(plan["image_path"]).resolve()
    if not image.is_file():
        raise RuntimeError(f"comparison image is missing: {image}")
    return image


async def send_one(args: argparse.Namespace) -> None:
    plan_path = Path(args.plan).resolve()
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    image = validate_plan(plan)
    api_id, api_hash, session, client_kwargs = telegram_config(Path(args.env_file).resolve())
    client = TelegramClient(StringSession(session), api_id, api_hash, **client_kwargs)
    await client.connect()
    try:
        if not await client.is_user_authorized():
            raise RuntimeError("Telegram human session is not authorized")
        entity = await client.get_entity(CHAT_ID)
        root = await client.get_messages(entity, ids=TOPIC_ID)
        action = getattr(root, "action", None)
        if (
            getattr(entity, "id", None) != ENTITY_ID
            or getattr(entity, "title", None) != ENTITY_TITLE
            or not getattr(entity, "forum", False)
            or getattr(root, "id", None) != TOPIC_ID
            or getattr(action, "title", None) != TOPIC_TITLE
        ):
            raise RuntimeError("resolved Telegram entity/topic does not match the authorized target")

        sent_at = dt.datetime.now(dt.timezone.utc)
        message = await client.send_file(
            entity,
            str(image),
            caption=plan["caption"],
            # Receipts hash the literal caption.  Do not let Telethon's default
            # Markdown parser silently remove backticks or other formatting
            # markers before the read-back check.
            parse_mode=None,
            reply_to=TOPIC_ID,
            force_document=False,
        )
        read_back = await client.get_messages(entity, ids=message.id)
        reply = getattr(read_back, "reply_to", None)
        if (
            not read_back
            or read_back.id != message.id
            or not read_back.media
            or (read_back.message or "") != plan["caption"]
            or getattr(reply, "reply_to_msg_id", None) != TOPIC_ID
        ):
            raise RuntimeError(f"Telegram read-back mismatch for message {message.id}")

        receipt = {
            "schema_version": "ui_conformance_telegram_readback_receipt_v1",
            "chat_id": CHAT_ID,
            "topic_root_message_id": TOPIC_ID,
            "message_id": int(message.id),
            "message_link": f"https://t.me/c/4337049383/{message.id}",
            "supersedes_message_id": plan.get("supersedes_message_id"),
            "case_id": plan["case_id"],
            "run_id": plan["run_id"],
            "local_image_sha256": plan["image_sha256"],
            "caption_sha256": plan["caption_sha256"],
            "content_hash": plan["content_hash"],
            "telegram_media_metadata": {
                "kind": type(read_back.media).__name__,
                "has_media": True,
                "caption_exact": True,
                "reply_to_message_id": getattr(reply, "reply_to_msg_id", None),
            },
            "sent_at": utc_iso(sent_at),
            "read_back_at": utc_iso(dt.datetime.now(dt.timezone.utc)),
            "read_back_status": "verified",
        }
        output = Path(args.receipt_output).resolve() if args.receipt_output else plan_path.parent / "telegram-human-readback-receipt.input.json"
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        account = await client.get_me()
        print(json.dumps({
            "ok": True,
            "account_id": int(account.id),
            "username": getattr(account, "username", None),
            "message_id": int(message.id),
            "message_link": receipt["message_link"],
            "receipt": str(output),
        }, ensure_ascii=False, indent=2))
    finally:
        await client.disconnect()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--env-file", required=True)
    parser.add_argument("--plan", required=True, help="exactly one telegram-publish-plan.json")
    parser.add_argument("--receipt-output")
    if sys.argv[1:].count("--plan") != 1:
        parser.error("exactly one --plan argument is allowed; batching is forbidden")
    asyncio.run(send_one(parser.parse_args()))


if __name__ == "__main__":
    main()
