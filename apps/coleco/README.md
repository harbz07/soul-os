# Coleco

Coleco is the soulOS context broker for federated memory hydration.

## Responsibilities

- Assemble hydration context in parallel from:
  - shared mem0 semantic memory
  - Claude supplemental source (Letta proxy)
  - Triptych supplemental source (Notion MCP proxy)
- Return an `Ensemble_Manifest` with source status and degradation flags.
- Return a hydration-ready `system_prompt` for runtime handoff.

## Routes

- `GET /health`
- `POST /api/manifest`
- `POST /api/hydrate`

## Environment / Secrets

- `MEM0_API_KEY`
- `LETTA_SUPPLEMENTAL_URL`
- `LETTA_API_KEY`
- `NOTION_SUPPLEMENTAL_URL`
- `NOTION_SUPPLEMENTAL_TOKEN`
