# External Memory Service Contract

soulOS treats graph memory and agent wiring as an external dependency, not vendored runtime code.

## Purpose

- Keep `soul-os` focused on orchestration/runtime deployment.
- Keep memory/agent wiring in its own repository and lifecycle.
- Integrate only through stable API and environment contracts.

## Integration Target

Recommended service source: external `graph_memory_database` deployment.

soulOS components (especially `apps/coleco`) should call this service via HTTPS and authenticated headers.

## Required Environment Variables

- `CONSTELLATION_API_URL`: Base URL for external memory service.
- `CONSTELLATION_API_KEY`: Bearer token for service authorization.

Optional/supplemental (Coleco-specific federation inputs):

- `MEM0_API_KEY`
- `LETTA_SUPPLEMENTAL_URL`
- `LETTA_API_KEY`
- `NOTION_SUPPLEMENTAL_URL`
- `NOTION_SUPPLEMENTAL_TOKEN`

## Endpoint Contract

Expected externally available endpoints:

- `GET /config`
- `GET /entities`
- `POST /memory/search`
- `POST /memory/shared`
- `POST /memory/member`
- `POST /memory/batch`
- `GET /memory/all`

Request headers:

- `Authorization: Bearer <CONSTELLATION_API_KEY>`
- `Content-Type: application/json`

## Degradation Requirements

When external memory service is unavailable:

- Coleco must mark source as degraded in manifest output.
- Siddartha should continue with available prompt context.
- Runtime must not hard-fail request routing due solely to memory unavailability.

## Repo Hygiene Rules

- Do not commit external workspace internals into `soul-os`.
- Keep secrets in environment bindings only.
- Exclude local artifacts and caches (`venv`, `__pycache__`, generated exports).
