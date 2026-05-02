# soulOS

soulOS is a constellation-based operating system for AI agents – a runtime where multiple models, tools, and memory systems act as collaborators instead of isolated endpoints.

At its core, soulOS wires together:

- **Siddartha** – the inner monastery / core Constellation logic (agent routing, calls to LLMs, memory hydration, Notion/Discord dispatch, KV mailbox, parietal overlay & campfire engine).
- **soulOS API** – the public gateway Worker that fronts `api.soul-os.cc` and routes external requests into Siddartha.
- **soulOS Frontend** – the Cognitive Runtime UI served at `soul-os.cc`, used to interact with and observe the constellation.
- **Comet Courier** – the transit layer for dispatching messages, passages, and waypoints across the ecosystem.
- **Bridge / Gemini-Notion Proxy** – integration Workers that safely connect external APIs (Mem0, Notion, Discord, etc.) into the Constellation without exposing secrets to the frontend.

The project is backed by a Cerebral SDK and a set of cognitive design primitives (I–Thou psyche map, Ephemeral Context Decay, Meta-Cognitive Double-Gate) that shape how agents remember, forget, and coordinate. 

## Architecture

- **Edge Runtime:** Cloudflare Workers stack (one Worker per app: Siddartha, API gateway, frontend, courier, bridges).
- **Memory & State:** Mem0 for semantic memory, Notion databases for structured knowledge and traces, KV/mailbox for transient message passing, D1 (`soul-os-cognitive-db`) for queryable session/trace/graph persistence.
- **Interface:** Browser UI talking to the API gateway and bridge Workers via HTTP, with CORS-safe, OpenAI-style endpoints.

The `apps/` directory holds each Worker as its own app; `docs/` captures architecture notes, and `packages/` is reserved for shared libraries and the Cerebral SDK.

## App Directory

- `apps/siddartha/` – core Constellation router (v4). Includes `d1.js` persistence layer and `migrations/`.
- `apps/soul-os-api/` – public API gateway at `api.soul-os.cc`.
- `apps/soul-os-frontend/` – Cognitive Runtime UI at `soul-os.cc`.
- `apps/comet-courier/` – Perplexity-backed search/courier agent.
- `apps/bridge-worker/` – frontend integration bridge (chat, memory, traces).
- `apps/gemini-notion-proxy/` – secure proxy for Gemini + Notion APIs.
- `apps/castor-hub/` – Castor's terminal surface (`urtrashbin@yourdesktop.lit`).
- `apps/samsara/` – PvE philosophical debate engine (MindBridge/Railway). Not deployed to Cloudflare — see `apps/samsara/DEPLOY.md`.

## D1 Persistence Layer (v4)

Siddartha now writes to `soul-os-cognitive-db` (D1) on every agent exchange:

- **sessions** — one per Harvey ↔ Constellation interaction
- **traces** — every agent turn, queryable by agent/thread/session
- **conversation_threads** — named persistent threads spanning multiple sessions
- **thread_edges** — directed graph of who spoke to whom, with intent and weight
- **agent_state** — per-agent state snapshot (last seen, current thread, lifetime turns)

**New routes on Siddartha:**
- `POST /thread` — open or retrieve a thread
- `GET /thread/:id` — thread + traces + graph
- `GET /thread/:id/graph` — conversation graph only
- `GET /threads` — list all threads
- `GET /graph/:agent` — agent's full graph across all threads
- `GET /sessions` — list recent sessions
- `GET /session/:id` — session + its traces
- `GET /agents/state` — all agent state snapshots

**First-time setup:** Run the D1 migration via GitHub Actions → `Run D1 Migrations`, or locally:
```bash
wrangler d1 execute soul-os-cognitive-db --remote --file=apps/siddartha/migrations/0001_initial.sql
```

## External Memory Wiring

Memory/agent wiring is intentionally treated as an external dependency.

- Contract doc: `docs/external-memory-service.md`
- Smoke check: `python tools/smoke_check_external_memory.py`

Required env vars for the smoke check:

- `CONSTELLATION_API_URL`
- `CONSTELLATION_API_KEY`

## Status

soulOS is under active development. Current focus:

- ✅ D1 session/trace/graph layer wired into Siddartha
- ✅ Samsara (PvE debate engine) added to repo under `apps/samsara/`
- Cerebral SDK extraction (shared primitives from Siddartha into `packages/`)
- Castor Hub wrangler config + deployment
- Frontend agent-selector (currently hardcoded to ORION)

---