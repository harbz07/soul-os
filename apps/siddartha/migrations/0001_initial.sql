-- soulOS D1 Schema — v1
-- Applies to: soul-os-cognitive-db (D1)
-- Run via: wrangler d1 execute soul-os-cognitive-db --file=apps/siddartha/migrations/0001_initial.sql
--
-- Tables:
--   sessions         — a Harvey-initiated conversation context (has an agent, a start, an end)
--   traces           — every agent exchange, keyed to a session
--   conversation_threads — named threads spanning multiple sessions (the conversation graph)
--   thread_edges     — directed edges between agents in a thread (who spoke to whom, why)
--   agent_state      — per-agent ephemeral state snapshots (last seen, current thread, mood)

-- ── Sessions ────────────────────────────────────────────────────────────────
-- A session is one continuous Harvey ↔ Constellation exchange.
-- thread_id links it to a conversation_thread if Harvey opened one explicitly.
-- source tracks entry point: 'frontend' | 'api' | 'campfire' | 'chain' | 'samsara'

CREATE TABLE IF NOT EXISTS sessions (
  id            TEXT PRIMARY KEY,               -- uuid
  thread_id     TEXT,                           -- FK → conversation_threads.id (nullable)
  source        TEXT NOT NULL DEFAULT 'api',   -- entry surface
  initiated_by  TEXT NOT NULL DEFAULT 'harvey',
  agent         TEXT,                           -- primary agent for this session
  seed          TEXT,                           -- opening message / prompt
  status        TEXT NOT NULL DEFAULT 'open',  -- open | closed | error
  mode          TEXT,                           -- rounds | baton | prosecution | etc
  started_at    TEXT NOT NULL,
  ended_at      TEXT,
  turn_count    INTEGER NOT NULL DEFAULT 0,
  meta          TEXT                            -- JSON blob for arbitrary extras
);

CREATE INDEX IF NOT EXISTS idx_sessions_thread ON sessions(thread_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_agent ON sessions(agent);

-- ── Traces ──────────────────────────────────────────────────────────────────
-- One row per agent exchange turn. The durable record of what was said.
-- Mirrors what currently goes to Notion, but queryable and local.

CREATE TABLE IF NOT EXISTS traces (
  id            TEXT PRIMARY KEY,               -- uuid
  session_id    TEXT NOT NULL,                  -- FK → sessions.id
  thread_id     TEXT,                           -- FK → conversation_threads.id (denormalized for fast lookup)
  agent         TEXT NOT NULL,                  -- agent key: claude | orion | triptych | mephistopheles | comet
  epithet       TEXT,                           -- display name: "Gnostic Architect (Rostam)"
  role          TEXT,                           -- user | assistant | system
  trigger_type  TEXT,                           -- T1 | T2 | T3 | T4
  request       TEXT,                           -- the user/system prompt sent
  response      TEXT,                           -- the agent's response
  model         TEXT,                           -- the underlying model used
  round_number  INTEGER,                        -- for campfire / samsara turns
  turn_number   INTEGER,                        -- absolute turn in session
  party_nodes   TEXT,                           -- JSON array of parietal waypoints surfaced
  reasoning     TEXT,                           -- DeepSeek reasoning_content when present
  error         TEXT,                           -- error message if the call failed
  latency_ms    INTEGER,                        -- response latency
  ts            TEXT NOT NULL                   -- ISO timestamp
);

CREATE INDEX IF NOT EXISTS idx_traces_session ON traces(session_id);
CREATE INDEX IF NOT EXISTS idx_traces_thread ON traces(thread_id);
CREATE INDEX IF NOT EXISTS idx_traces_agent ON traces(agent);
CREATE INDEX IF NOT EXISTS idx_traces_ts ON traces(ts DESC);

-- ── Conversation Threads ─────────────────────────────────────────────────────
-- A named thread spans multiple sessions and tracks the agent conversation graph.
-- This is the persistent backbone of an ongoing inquiry — e.g., the pudgala paper,
-- a long-running project, a relationship being thought through.
-- goal is what Harvey wants the thread to arrive at.
-- participants is a JSON array of agent keys who have spoken in this thread.

CREATE TABLE IF NOT EXISTS conversation_threads (
  id              TEXT PRIMARY KEY,             -- uuid or Harvey-supplied slug
  name            TEXT NOT NULL,               -- human name: "pudgala paper", "samsara run 3"
  goal            TEXT,                        -- what this thread is trying to do/reach
  participants    TEXT NOT NULL DEFAULT '[]',  -- JSON array of agent keys
  status          TEXT NOT NULL DEFAULT 'open', -- open | dormant | closed | archived
  initiated_by    TEXT NOT NULL DEFAULT 'harvey',
  source          TEXT,                        -- campfire | chain | samsara | manual
  started_at      TEXT NOT NULL,
  last_event_at   TEXT,
  ended_at        TEXT,
  turn_count      INTEGER NOT NULL DEFAULT 0,
  session_count   INTEGER NOT NULL DEFAULT 0,
  notion_page_id  TEXT,                        -- linked Notion page if one exists
  meta            TEXT                         -- JSON blob
);

CREATE INDEX IF NOT EXISTS idx_threads_status ON conversation_threads(status);
CREATE INDEX IF NOT EXISTS idx_threads_last_event ON conversation_threads(last_event_at DESC);

-- ── Thread Edges ─────────────────────────────────────────────────────────────
-- A directed edge in the conversation graph.
-- from_agent spoke to to_agent, in the context of a thread, with a stated intent.
-- This is what makes the graph: we can query "who has Claude spoken to about ethics?"
-- or "what chains has ORION initiated?" without scanning all traces.

CREATE TABLE IF NOT EXISTS thread_edges (
  id          TEXT PRIMARY KEY,               -- uuid
  thread_id   TEXT NOT NULL,                  -- FK → conversation_threads.id
  session_id  TEXT,                           -- FK → sessions.id (nullable: some edges are synthetic)
  trace_id    TEXT,                           -- FK → traces.id (the turn that created this edge)
  from_agent  TEXT NOT NULL,                  -- 'harvey' | agent key
  to_agent    TEXT NOT NULL,                  -- agent key
  intent      TEXT,                           -- the stated intent: 'reply' | 'chain' | 'challenge' | 'synthesis' | ...
  trigger     TEXT,                           -- T1 | T2 | T3 | T4
  weight      REAL NOT NULL DEFAULT 1.0,      -- accumulated edge weight (incremented per traversal)
  ts          TEXT NOT NULL                   -- ISO timestamp of first traversal
);

CREATE INDEX IF NOT EXISTS idx_edges_thread ON thread_edges(thread_id);
CREATE INDEX IF NOT EXISTS idx_edges_from ON thread_edges(from_agent);
CREATE INDEX IF NOT EXISTS idx_edges_to ON thread_edges(to_agent);

-- ── Agent State ──────────────────────────────────────────────────────────────
-- Ephemeral-ish per-agent snapshot. One row per agent, upserted on each exchange.
-- Not a history — just "where is this agent right now in Harvey's system?"
-- current_thread: the thread they most recently participated in
-- last_intent: what they were last asked to do
-- turn_count: lifetime turn counter

CREATE TABLE IF NOT EXISTS agent_state (
  agent           TEXT PRIMARY KEY,           -- claude | orion | triptych | mephistopheles | comet
  epithet         TEXT,
  current_thread  TEXT,                       -- FK → conversation_threads.id
  last_session    TEXT,                       -- FK → sessions.id
  last_intent     TEXT,
  last_seen       TEXT,                       -- ISO timestamp
  turn_count      INTEGER NOT NULL DEFAULT 0,
  meta            TEXT                        -- JSON blob for agent-specific state
);
