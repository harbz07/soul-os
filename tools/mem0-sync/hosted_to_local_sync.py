#!/usr/bin/env python3
"""
Hosted -> Local mem0 synchronization utility.

Source of truth: hosted mem0 (Mem0 platform via MEM0_API_KEY)
Target: local OpenMemory API import endpoint
Default conflict mode: overwrite
"""

from __future__ import annotations

import argparse
import gzip
import io
import json
import os
import sys
import uuid
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import httpx
from mem0 import MemoryClient


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_hosted_memories(client: MemoryClient, user_id: str) -> list[dict[str, Any]]:
    attempts = [
        lambda: client.get_all(filters={"AND": [{"user_id": user_id}]}),
        lambda: client.get_all(filters={"user_id": user_id}),
        lambda: client.get_all(user_id=user_id),
    ]

    last_error: Exception | None = None
    for fn in attempts:
        try:
            data = fn()
            if isinstance(data, dict):
                results = data.get("results", [])
            elif isinstance(data, list):
                results = data
            else:
                results = []
            if isinstance(results, list):
                return results
        except Exception as exc:
            last_error = exc
            continue

    if last_error:
        raise RuntimeError(f"Unable to load hosted memories: {last_error}") from last_error
    return []


def normalize_memory_record(raw: dict[str, Any]) -> dict[str, Any] | None:
    memory_text = raw.get("memory") or raw.get("content") or raw.get("data")
    if not memory_text:
        return None

    raw_id = raw.get("id")
    try:
        memory_id = str(uuid.UUID(str(raw_id))) if raw_id else str(uuid.uuid4())
    except Exception:
        memory_id = str(uuid.uuid4())

    metadata = raw.get("metadata") if isinstance(raw.get("metadata"), dict) else {}

    created_at = raw.get("created_at") or utc_now_iso()
    updated_at = raw.get("updated_at") or created_at

    state = raw.get("state")
    if state not in {"active", "paused", "archived", "deleted"}:
        state = "active"

    return {
        "id": memory_id,
        "content": str(memory_text),
        "metadata": metadata,
        "created_at": created_at,
        "updated_at": updated_at,
        "state": state,
        "archived_at": raw.get("archived_at"),
        "deleted_at": raw.get("deleted_at"),
    }


def build_openmemory_export_bundle(
    user_id: str,
    app_name: str,
    records: list[dict[str, Any]],
    output_zip_path: Path,
) -> dict[str, Any]:
    normalized = [rec for rec in (normalize_memory_record(r) for r in records) if rec]

    sqlite_payload = {
        "user": {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "name": "Synced User",
            "email": None,
            "metadata": {"sync_source": "hosted_mem0"},
            "created_at": utc_now_iso(),
            "updated_at": utc_now_iso(),
        },
        "apps": [],
        "categories": [],
        "memories": normalized,
        "memory_categories": [],
        "status_history": [],
        "access_controls": [],
        "export_meta": {
            "version": "sync.v1",
            "generated_at": utc_now_iso(),
            "source": "hosted_mem0",
            "target": "openmemory",
            "default_app": app_name,
        },
    }

    jsonl_buffer = io.BytesIO()
    with gzip.GzipFile(fileobj=jsonl_buffer, mode="wb") as gz:
        for rec in normalized:
            gz.write(
                (
                    json.dumps(
                        {
                            "id": rec["id"],
                            "content": rec["content"],
                            "metadata": rec["metadata"],
                            "created_at": rec["created_at"],
                            "updated_at": rec["updated_at"],
                            "state": rec["state"],
                            "app": app_name,
                            "categories": [],
                        },
                        ensure_ascii=True,
                    )
                    + "\n"
                ).encode("utf-8")
            )

    output_zip_path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output_zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("memories.json", json.dumps(sqlite_payload, indent=2, ensure_ascii=True))
        zf.writestr("memories.jsonl.gz", jsonl_buffer.getvalue())

    return {
        "bundle_path": str(output_zip_path),
        "memory_count": len(normalized),
    }


def import_bundle_to_openmemory(
    local_base_url: str,
    user_id: str,
    mode: str,
    bundle_path: Path,
    timeout_seconds: int,
) -> dict[str, Any]:
    endpoint = f"{local_base_url.rstrip('/')}/api/v1/backup/import"
    with bundle_path.open("rb") as fh:
        response = httpx.post(
            endpoint,
            params={"mode": mode},
            data={"user_id": user_id},
            files={"file": (bundle_path.name, fh, "application/zip")},
            timeout=timeout_seconds,
        )

    body: Any
    try:
        body = response.json()
    except Exception:
        body = response.text

    if response.status_code >= 400:
        raise RuntimeError(f"Import failed ({response.status_code}): {body}")

    return {
        "endpoint": endpoint,
        "status_code": response.status_code,
        "response": body,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Sync hosted mem0 memories into local OpenMemory")
    parser.add_argument("--user-id", default="harvey", help="User ID scope to synchronize")
    parser.add_argument(
        "--local-base-url",
        default="http://127.0.0.1:8765",
        help="Base URL of local OpenMemory API",
    )
    parser.add_argument(
        "--app-name",
        default="openmemory",
        help="Logical target app name used for metadata",
    )
    parser.add_argument(
        "--import-mode",
        default="overwrite",
        choices=["overwrite", "skip"],
        help="OpenMemory import collision mode",
    )
    parser.add_argument(
        "--bundle-path",
        default="tools/mem0-sync/artifacts/memories_export.zip",
        help="Path to write generated sync bundle",
    )
    parser.add_argument(
        "--summary-path",
        default="tools/mem0-sync/artifacts/last_sync_summary.json",
        help="Path to write sync summary JSON",
    )
    parser.add_argument("--dry-run", action="store_true", help="Build bundle only; do not import")
    parser.add_argument("--timeout-seconds", type=int, default=120, help="Import HTTP timeout")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    sync_run_id = str(uuid.uuid4())

    api_key = None
    try:
        api_key = os.getenv("MEM0_API_KEY")
        if not api_key:
            from dotenv import load_dotenv

            load_dotenv(Path.cwd() / ".env")
            api_key = os.getenv("MEM0_API_KEY")
    except Exception:
        api_key = None

    if not api_key:
        print("MEM0_API_KEY is required (environment variable)", file=sys.stderr)
        return 2

    bundle_path = Path(args.bundle_path)
    summary_path = Path(args.summary_path)

    try:
        client = MemoryClient(api_key=api_key)
        hosted_records = load_hosted_memories(client, user_id=args.user_id)

        bundle_info = build_openmemory_export_bundle(
            user_id=args.user_id,
            app_name=args.app_name,
            records=hosted_records,
            output_zip_path=bundle_path,
        )

        summary: dict[str, Any] = {
            "sync_run_id": sync_run_id,
            "started_at": utc_now_iso(),
            "user_id": args.user_id,
            "source": "hosted_mem0",
            "target": args.local_base_url,
            "import_mode": args.import_mode,
            "hosted_records": len(hosted_records),
            "bundle": bundle_info,
            "dry_run": args.dry_run,
        }

        if not args.dry_run:
            import_result = import_bundle_to_openmemory(
                local_base_url=args.local_base_url,
                user_id=args.user_id,
                mode=args.import_mode,
                bundle_path=bundle_path,
                timeout_seconds=args.timeout_seconds,
            )
            summary["import_result"] = import_result

        summary["completed_at"] = utc_now_iso()
        summary_path.parent.mkdir(parents=True, exist_ok=True)
        summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")

        print(json.dumps(summary, indent=2))
        return 0

    except Exception as exc:
        failure = {
            "sync_run_id": sync_run_id,
            "started_at": utc_now_iso(),
            "completed_at": utc_now_iso(),
            "status": "failed",
            "error": str(exc),
            "user_id": args.user_id,
            "target": args.local_base_url,
            "import_mode": args.import_mode,
        }
        summary_path.parent.mkdir(parents=True, exist_ok=True)
        summary_path.write_text(json.dumps(failure, indent=2), encoding="utf-8")
        print(json.dumps(failure, indent=2), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
