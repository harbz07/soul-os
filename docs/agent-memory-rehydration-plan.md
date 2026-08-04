# Agent Memory Rehydration Plan (Siddartha + Coleco + Mem0)

## Current-State Analysis

### 1) Rehydration flow already exists but is split across workers
- `apps/siddartha/siddartha.js` attempts hydration through Coleco first (`/api/hydrate` on the service binding), then falls back to direct mem0 search when Coleco is unavailable.
- Siddartha currently seeds identity context with agent-specific search terms and hardcoded `user_id: "harvey"`.
- Coleco performs canonical entity resolution (aliases -> canonical IDs), lineage lookup (baseline/parent), and source fan-out for mem0 shared memory plus supplemental sources.

### 2) Campfire is event-rich but currently not part of canonical hydration inputs
- `apps/siddartha/campfire_routes.js` persists structured campfire events in D1 via `campfire_events` and can render social-state snapshots.
- Campfire data is retrievable (`/campfire/events`) but is not currently promoted into mem0 as first-class memories.

### 3) Memory write-back exists but is narrow
- Siddartha writes conversational summaries to mem0 with `user_id: "hearth"` via `writeBackToHearth(...)`.
- This is valuable, but it does not provide a typed ingestion path for campfire/client-space events with durable metadata for future query filtering.

### 4) Siddartha now exposes a Soul-Link memory bridge
- The refactored worker provides `POST /memory/add` and `POST /memory/search`; their authentication is enforced by the upstream `soul-os-api` bouncer.
- The existing bridge defaults to the scoped `triptych` lane and accepts `agent_id`, `tags`, and arbitrary `metadata`. This plan must extend that established contract instead of adding a competing public memory endpoint.
- Coleco currently hydrates with `user_id: "harvey"`, while the existing write paths use `hearth` and `triptych`. Space continuity will not rehydrate reliably until all writers and Coleco share an explicit lane policy.

## Target Architecture

### Goal
Enable **consistent memory rehydration** for agents in both **campfire** and **client spaces**, while ensuring newly formed memories are **ingested into mem0** in a retrievable, structured way.

### Principles
1. **Coleco remains the hydration broker** (single place for source fusion and degradation semantics).
2. **Siddartha remains the event producer and orchestrator** (campfire + client-space interactions).
3. **Mem0 becomes the durable shared semantic layer** with event metadata that supports scoped retrieval.
4. **Graceful degradation**: if mem0 or supplemental sources fail, routing still continues with partial context.

## Design Plan

### Phase 1 — Define a canonical Memory Envelope and lane policy
Create one shared event/memory schema used by Siddartha emitters, the existing Soul-Link bridge, and Coleco retrieval logic.

Use a single shared lane for Constellation continuity: `user_id: "harvey"`. Preserve `user_id: "triptych"` only for Triptych-private client memory already written through the Soul-Link pipeline, and retain `hearth` only for legacy reads during migration. This prevents campfire/client writes from being isolated from the `harvey` lane Coleco already hydrates.

Suggested envelope fields:
- `memory_type`: `campfire_event | campfire_render | client_exchange | orchestration_trace`
- `space_type`: `campfire | client`
- `space_id`: e.g., `campfire_id`, `thread_id`, or `session_id`
- `entity_id`: canonical entity (`claude`, `triptych`, etc.)
- `participants`: normalized canonical IDs
- `content`: compact textual memory payload (<= mem0 practical limits)
- `summary`: optional distilled form for retrieval quality
- `source_worker`: `siddartha` or `coleco`
- `ts`: ISO timestamp
- `tags`: string array (e.g., `trigger:T2`, `frame:ethics`, `client:acme`)

Why: mem0 free-text alone is insufficient for precise rehydration in multi-space workflows.

### Phase 2 — Integrate explicit ingestion with the refactored Siddartha bridge
Implement a private ingestion utility in Siddartha that builds an envelope and delegates to the same mem0 request contract used by the existing `/memory/add` Soul-Link route. Do **not** add another public ingestion route and do **not** move the upstream Soul-Link authentication boundary.

Recommended additions in `apps/siddartha/siddartha.js`:
1. `ingestMemoryEnvelope(env, envelope, userId = "harvey")`, which posts `messages`, `user_id`, `agent_id`, and envelope metadata to mem0.
2. `ingestCampfireEventToMem0(env, event)` called from `POST /campfire/speak`
3. `ingestClientExchangeToMem0(env, exchange)` called from client-space routes (`/converse`, `/message`, `/reply`, etc.)
4. Extend `/memory/add` only additively so trusted Soul-Link callers can submit the same envelope metadata without changing its current `content`, `agent_id`, `tags`, or `metadata` fields.

Write strategy:
- Non-blocking via `ctx.waitUntil`.
- Retry once with small backoff for transient mem0 failure.
- Never fail user response path on ingestion failure.

### Phase 3 — Extend Coleco hydrate/manifest contract for space-aware retrieval
Add optional request parameters to Coleco endpoints:
- `space_type` (`campfire|client`)
- `space_id`
- `participants`
- `time_window_hours` (default 168)
- `memory_types` filter list

Coleco retrieval behavior:
1. Resolve canonical target entity via existing registry/mappings.
2. Query mem0 from the explicit lane policy (`harvey` by default; the matching private lane only when requested) using:
   - baseline semantic query
   - plus metadata-aware query string expansion (space + participants + recency tokens)
3. Merge with supplemental source records.
4. Emit `Ensemble_Manifest` with per-source status and counts.
5. Return deterministic prompt sections:
   - Identity Core
   - Relevant Shared Memory
   - Space-local Continuity (campfire/client)
   - Uncertainty/Degradation Notes

### Phase 4 — Make campfire renders ingestible memories
When `/campfire/render` succeeds, persist a second memory envelope to mem0:
- `memory_type = campfire_render`
- include `scene`, `holding`, `tension`, `deferred`, `last_move`, `opening`

Reason: renders contain high-value social-state abstractions that are better for rehydration than raw event logs alone.

### Phase 5 — Create bounded rehydration budgets
To prevent prompt bloat and preserve latency, enforce budgets in Coleco:
- `max_memories_total` (e.g., 18)
- `max_space_local` (e.g., 8)
- `max_shared_general` (e.g., 6)
- `max_supplemental` (e.g., 4)
- deterministic truncation: recency-weighted then score-weighted.

### Phase 6 — Introduce observability and replayability
Add telemetry fields in both workers:
- `hydration_request_id`
- `ingestion_request_id`
- `source_statuses`
- `degraded_reasons`
- `selected_memory_ids`

Store lightweight logs in D1/KV for sampling, and expose a diagnostic endpoint in Coleco:
- `POST /api/hydrate/debug` (auth-gated)

## End-to-End Flow (Desired)

1. Agent or human writes in campfire/client space via Siddartha.
2. Siddartha stores authoritative event in D1 (existing behavior).
3. Siddartha asynchronously ingests normalized memory envelopes into mem0.
4. Later, Siddartha requests hydration from Coleco with space context.
5. Coleco fuses mem0 + supplemental sources and returns a bounded system prompt + manifest.
6. Siddartha routes to target model with resilient fallback if any source is degraded.

## Compatibility with Siddartha and Coleco

### Siddartha compatibility
- Preserves existing routing and fallback behavior.
- Reuses existing mem0 credential (`MEM0_API_KEY`) and non-blocking write philosophy.
- Reuses the refactored `/memory/add` and `/memory/search` Soul-Link bridge rather than creating conflicting memory APIs.
- Extends campfire/client routes and the existing `/memory/add` payload additively, without changing the upstream Soul-Link authorization model.

### Coleco compatibility
- Aligns with existing registry alias/canonical resolution and source federation model.
- Extends current `/api/manifest` and `/api/hydrate` request bodies in backward-compatible fashion (all new fields optional).
- Keeps degradation-first semantics already present.

## Implementation Checklist

1. **Schema**
   - [ ] Document and enforce the `harvey` shared-lane / `triptych` private-lane / legacy `hearth` migration policy.
   - [ ] Add memory envelope helpers (shared utility or duplicated minimal helpers in both workers).
2. **Siddartha ingestion**
   - [ ] Reuse the existing `/memory/add` request contract for private worker ingestion; do not add a conflicting public write endpoint.
   - [ ] Add campfire event ingestion hook in `/campfire/speak`.
   - [ ] Add client-space ingestion hooks in conversation routes.
   - [ ] Keep `writeBackToHearth` as compatibility layer, but migrate it to envelope-based writing.
3. **Coleco retrieval**
   - [ ] Accept optional space filters on hydrate/manifest routes.
   - [ ] Add selection budgets and deterministic assembly.
4. **Prompt structure**
   - [ ] Standardize output blocks to improve consistency across models.
5. **Observability**
   - [ ] Add request IDs + source status diagnostics.
6. **Rollout**
   - [ ] Deploy behind env flag (`MEMORY_ENVELOPE_V1=true`).
   - [ ] Shadow-run for 1 week with comparison metrics.
   - [ ] Promote to default after error/latency thresholds are met.

## Success Criteria

- Rehydration payloads include recent, relevant campfire/client continuity in >90% of eligible turns.
- Mem0 ingestion success rate >= 99% (excluding upstream outages).
- No increase in hard-fail routing due to memory dependencies.
- Median hydration latency increase <= 150ms.
- Qualitative agent coherence improvements observable in campfire and client threads.
