#!/usr/bin/env python3

import json
import os
import sys
from typing import Any

import httpx


def require_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def check_endpoint(client: httpx.Client, method: str, path: str, payload: dict[str, Any] | None = None) -> tuple[bool, str]:
    try:
        if method == "GET":
            resp = client.get(path)
        else:
            resp = client.post(path, json=payload or {})

        if resp.status_code >= 400:
            return False, f"{method} {path} -> HTTP {resp.status_code}"

        return True, f"{method} {path} -> OK"
    except Exception as exc:
        return False, f"{method} {path} -> EXCEPTION {exc}"


def main() -> int:
    base_url = require_env("CONSTELLATION_API_URL")
    api_key = require_env("CONSTELLATION_API_KEY")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    checks: list[tuple[str, str, dict[str, Any] | None]] = [
        ("GET", "/config", None),
        ("GET", "/entities", None),
        (
            "POST",
            "/memory/search",
            {
                "query": "constellation memory smoke check",
                "top_k": 2,
            },
        ),
    ]

    results = []
    with httpx.Client(base_url=base_url.rstrip("/"), headers=headers, timeout=15.0) as client:
        for method, path, payload in checks:
            ok, message = check_endpoint(client, method, path, payload)
            results.append({"ok": ok, "message": message})

    failures = [r for r in results if not r["ok"]]
    print(json.dumps(results, indent=2))

    if failures:
        return 1
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"smoke-check failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
