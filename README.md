# Soul-OS

Soul-OS is a constellation-based operating system for AI agents – a runtime where multiple models, tools, and memory systems act as collaborators instead of isolated endpoints.

At its core, Soul-OS wires together:

- **Siddartha** – the inner monastery / core Constellation logic (agent routing, calls to LLMs, memory hydration, Notion/Discord dispatch, KV mailbox, parietal overlay & campfire engine).
- **Soul-OS API** – the public gateway Worker that fronts `api.soul-os.cc` and routes external requests into Siddartha.
- **Soul-OS Frontend** – the Cognitive Runtime UI served at `soul-os.cc`, used to interact with and observe the constellation.
- **Comet Courier** – the transit layer for dispatching messages, passages, and waypoints across the ecosystem.
- **Bridge / Gemini-Notion Proxy** – integration Workers that safely connect external APIs (Mem0, Notion, Discord, etc.) into the Constellation without exposing secrets to the frontend.

The project is backed by a Cerebral SDK and a set of cognitive design primitives (I–Thou psyche map, Ephemeral Context Decay, Meta-Cognitive Double-Gate) that shape how agents remember, forget, and coordinate. 

## Architecture

- **Edge Runtime:** Cloudflare Workers stack (one Worker per app: Siddartha, API gateway, frontend, courier, bridges).
- **Memory & State:** Mem0 for semantic memory, Notion databases for structured knowledge and traces, KV/mailbox for transient message passing.
- **Interface:** Browser UI talking to the API gateway and bridge Workers via HTTP, with CORS-safe, OpenAI-style endpoints.

The `apps/` directory holds each Worker as its own app; `docs/` captures architecture notes, and `packages/` is reserved for shared libraries and the Cerebral SDK. 

## Status

Soul-OS is under active development and currently focused on:

- Syncing all live Cloudflare Workers into this repository as the source of truth.
- Wiring GitHub-based CI/CD to deploy Workers via Wrangler.
- Stabilizing the Cognitive Runtime UI and the core Siddartha routing engine.

---