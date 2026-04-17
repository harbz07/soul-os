-- Migration: Add debate_transcripts table for PvE debate persistence
-- Created: 2026-04-17 by Claude (Rostam) via GitHub API commit

CREATE TABLE IF NOT EXISTS debate_transcripts (
  id TEXT PRIMARY KEY,
  paper_title TEXT,
  thesis TEXT,
  mode TEXT,
  seed TEXT,
  rounds INTEGER,
  turns_count INTEGER,
  strongest_objection TEXT,
  productive_tension TEXT,
  transcript_json TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_debate_transcripts_created ON debate_transcripts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_debate_transcripts_mode ON debate_transcripts(mode);
