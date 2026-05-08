-- Campfire schema migration
-- Applied to soul-os-cognitive-db (d7ec816c-693d-4e6b-99ff-ead94fb44f16) on 2026-05-03
-- Author: Claude (during the Opus Schism conversation)
--
-- Closes the agent write-back gap that left debate_transcripts empty for 6 weeks.
-- Replaces conversation-shaped storage with event-shaped storage so configuration
-- (who's holding what, who deferred, what shifted) survives, not just content.

CREATE TABLE IF NOT EXISTS campfires (
  campfire_id    TEXT PRIMARY KEY,
  title          TEXT NOT NULL,
  frame          TEXT,                                    -- e.g. 'council', 'reflective', 'adversarial', 'ritual'
  status         TEXT NOT NULL DEFAULT 'active'
                 CHECK(status IN ('active','dormant','closed')),
  participants   TEXT NOT NULL DEFAULT '[]',              -- JSON array of agent_ids (incl. 'harvey')
  created_at     TEXT NOT NULL,
  last_event_at  TEXT,
  metadata       TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS campfire_events (
  event_id         TEXT PRIMARY KEY,
  campfire_id      TEXT NOT NULL,
  ts               TEXT NOT NULL,                          -- ISO 8601
  agent_id         TEXT NOT NULL,                          -- 'harvey' or any agent slug
  event_type       TEXT NOT NULL
                   CHECK(event_type IN ('spoke','yielded','invoked','deferred',
                                        'refused','shifted','held_silence','entered','left')),
  content          TEXT,                                   -- speech/action body, may be NULL for held_silence/entered/left
  target_agent_id  TEXT,                                   -- if event is directed
  affect_snapshot  TEXT NOT NULL DEFAULT '{}',             -- JSON: {posture, mood, contradiction_level, stress, ...}
  bond_delta       TEXT NOT NULL DEFAULT '{}',             -- JSON: {other_agent_id: delta}
  frame_marker     TEXT,                                   -- if this event shifted the frame, name it
  parent_event_id  TEXT,                                   -- threading
  metadata         TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_campfire_events_campfire_ts
  ON campfire_events(campfire_id, ts);

CREATE INDEX IF NOT EXISTS idx_campfire_events_agent
  ON campfire_events(agent_id, ts);

CREATE TABLE IF NOT EXISTS campfire_renders (
  render_id          TEXT PRIMARY KEY,
  campfire_id        TEXT NOT NULL,
  rendered_at        TEXT NOT NULL,
  audience           TEXT NOT NULL DEFAULT 'human',
  scene              TEXT,                                  -- frame description
  present            TEXT,                                  -- JSON: [{agent, posture}]
  holding            TEXT,                                  -- who's load-bearing
  tension            TEXT,                                  -- the live disagreement
  deferred           TEXT,                                  -- what got dodged
  last_move          TEXT,                                  -- in social-situation terms, not content
  opening            TEXT,                                  -- where Harvey could enter
  through_event_id   TEXT,                                  -- last event included in this render
  full_render        TEXT NOT NULL DEFAULT '{}'             -- raw JSON for downstream uses
);

CREATE INDEX IF NOT EXISTS idx_campfire_renders_campfire_ts
  ON campfire_renders(campfire_id, rendered_at DESC);
