// d1.js — soulOS D1 persistence layer
// Handles sessions, traces, conversation threads, and the agent graph.
// All functions are safe-to-call with a null/undefined db — they no-op silently
// so Siddartha degrades gracefully when DB binding is absent.

// ── Helpers ──────────────────────────────────────────────────────────────────

function uuid() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}

// Silent no-op guard
function noDb(db, label) {
  if (!db) {
    console.warn(`[d1] DB not bound — skipping ${label}`);
    return true;
  }
  return false;
}

// ── Sessions ─────────────────────────────────────────────────────────────────

/**
 * Open a new session. Returns the session id.
 * @param {D1Database} db
 * @param {{ threadId?, source?, agent?, seed?, mode?, initiatedBy?, meta? }} opts
 */
export async function sessionOpen(db, opts = {}) {
  if (noDb(db, "sessionOpen")) return null;
  const id = uuid();
  const ts = now();
  try {
    await db.prepare(`
      INSERT INTO sessions (id, thread_id, source, initiated_by, agent, seed, status, mode, started_at, turn_count, meta)
      VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?, 0, ?)
    `).bind(
      id,
      opts.threadId ?? null,
      opts.source ?? "api",
      opts.initiatedBy ?? "harvey",
      opts.agent ?? null,
      opts.seed ? opts.seed.slice(0, 2000) : null,
      opts.mode ?? null,
      ts,
      opts.meta ? JSON.stringify(opts.meta) : null
    ).run();

    // Upsert agent_state.last_session
    if (opts.agent) {
      await agentStateTouch(db, opts.agent, { lastSession: id, lastSeen: ts });
    }

    return id;
  } catch (e) {
    console.error("[d1] sessionOpen failed:", e.message);
    return null;
  }
}

/**
 * Close a session and update its turn count.
 */
export async function sessionClose(db, sessionId, { turnCount } = {}) {
  if (noDb(db, "sessionClose")) return;
  try {
    await db.prepare(`
      UPDATE sessions SET status = 'closed', ended_at = ?, turn_count = COALESCE(?, turn_count)
      WHERE id = ?
    `).bind(now(), turnCount ?? null, sessionId).run();
  } catch (e) {
    console.error("[d1] sessionClose failed:", e.message);
  }
}

/**
 * Increment a session's turn counter.
 */
export async function sessionIncrementTurns(db, sessionId) {
  if (noDb(db, "sessionIncrementTurns")) return;
  try {
    await db.prepare(`UPDATE sessions SET turn_count = turn_count + 1 WHERE id = ?`)
      .bind(sessionId).run();
  } catch (e) {
    console.error("[d1] sessionIncrementTurns failed:", e.message);
  }
}

/**
 * Fetch a session by id.
 */
export async function sessionGet(db, sessionId) {
  if (noDb(db, "sessionGet")) return null;
  try {
    const row = await db.prepare(`SELECT * FROM sessions WHERE id = ?`).bind(sessionId).first();
    return row ?? null;
  } catch (e) {
    console.error("[d1] sessionGet failed:", e.message);
    return null;
  }
}

/**
 * List recent sessions, optionally filtered by agent or thread.
 */
export async function sessionList(db, { agent, threadId, limit = 20 } = {}) {
  if (noDb(db, "sessionList")) return [];
  try {
    let query = `SELECT * FROM sessions`;
    const conditions = [];
    const binds = [];
    if (agent) { conditions.push("agent = ?"); binds.push(agent); }
    if (threadId) { conditions.push("thread_id = ?"); binds.push(threadId); }
    if (conditions.length) query += ` WHERE ${conditions.join(" AND ")}`;
    query += ` ORDER BY started_at DESC LIMIT ?`;
    binds.push(limit);
    const result = await db.prepare(query).bind(...binds).all();
    return result.results ?? [];
  } catch (e) {
    console.error("[d1] sessionList failed:", e.message);
    return [];
  }
}

// ── Traces ────────────────────────────────────────────────────────────────────

/**
 * Write a trace record. Returns the trace id.
 * @param {D1Database} db
 * @param {{ sessionId, threadId?, agent, epithet?, role?, triggerType?, request?, response?,
 *           model?, roundNumber?, turnNumber?, partyNodes?, reasoning?, error?, latencyMs? }} opts
 */
export async function traceWrite(db, opts = {}) {
  if (noDb(db, "traceWrite")) return null;
  const id = uuid();
  const ts = now();
  try {
    await db.prepare(`
      INSERT INTO traces
        (id, session_id, thread_id, agent, epithet, role, trigger_type, request, response,
         model, round_number, turn_number, party_nodes, reasoning, error, latency_ms, ts)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      opts.sessionId ?? null,
      opts.threadId ?? null,
      opts.agent ?? "unknown",
      opts.epithet ?? null,
      opts.role ?? "assistant",
      opts.triggerType ?? "T1",
      opts.request ? opts.request.slice(0, 4000) : null,
      opts.response ? opts.response.slice(0, 8000) : null,
      opts.model ?? null,
      opts.roundNumber ?? null,
      opts.turnNumber ?? null,
      opts.partyNodes ? JSON.stringify(opts.partyNodes) : null,
      opts.reasoning ? opts.reasoning.slice(0, 4000) : null,
      opts.error ?? null,
      opts.latencyMs ?? null,
      ts
    ).run();

    // Update agent_state turn counter
    if (opts.agent) {
      await agentStateTurnIncrement(db, opts.agent, {
        lastSession: opts.sessionId,
        lastIntent: opts.triggerType,
        lastSeen: ts,
        currentThread: opts.threadId
      });
    }

    return id;
  } catch (e) {
    console.error("[d1] traceWrite failed:", e.message);
    return null;
  }
}

/**
 * List traces for a session or thread.
 */
export async function traceList(db, { sessionId, threadId, agent, limit = 50 } = {}) {
  if (noDb(db, "traceList")) return [];
  try {
    let query = `SELECT * FROM traces`;
    const conditions = [];
    const binds = [];
    if (sessionId) { conditions.push("session_id = ?"); binds.push(sessionId); }
    if (threadId) { conditions.push("thread_id = ?"); binds.push(threadId); }
    if (agent) { conditions.push("agent = ?"); binds.push(agent); }
    if (conditions.length) query += ` WHERE ${conditions.join(" AND ")}`;
    query += ` ORDER BY ts ASC LIMIT ?`;
    binds.push(limit);
    const result = await db.prepare(query).bind(...binds).all();
    return result.results ?? [];
  } catch (e) {
    console.error("[d1] traceList failed:", e.message);
    return [];
  }
}

// ── Conversation Threads ──────────────────────────────────────────────────────

/**
 * Open or retrieve a conversation thread.
 * If id is provided and exists, returns the existing thread (upsert by id).
 * Returns the thread id.
 */
export async function threadOpen(db, opts = {}) {
  if (noDb(db, "threadOpen")) return null;
  const id = opts.id ?? uuid();
  const ts = now();
  try {
    // Check if it already exists
    const existing = await db.prepare(`SELECT id FROM conversation_threads WHERE id = ?`)
      .bind(id).first();

    if (existing) {
      // Touch last_event_at
      await db.prepare(`UPDATE conversation_threads SET last_event_at = ? WHERE id = ?`)
        .bind(ts, id).run();
      return id;
    }

    await db.prepare(`
      INSERT INTO conversation_threads
        (id, name, goal, participants, status, initiated_by, source, started_at, last_event_at, turn_count, session_count, notion_page_id, meta)
      VALUES (?, ?, ?, ?, 'open', ?, ?, ?, ?, 0, 0, ?, ?)
    `).bind(
      id,
      opts.name ?? `Thread ${id.slice(0, 8)}`,
      opts.goal ?? null,
      JSON.stringify(opts.participants ?? []),
      opts.initiatedBy ?? "harvey",
      opts.source ?? null,
      ts,
      ts,
      opts.notionPageId ?? null,
      opts.meta ? JSON.stringify(opts.meta) : null
    ).run();

    return id;
  } catch (e) {
    console.error("[d1] threadOpen failed:", e.message);
    return null;
  }
}

/**
 * Record a participant speaking in a thread.
 * Updates participants array, turn_count, and last_event_at.
 */
export async function threadAddParticipant(db, threadId, agentKey) {
  if (noDb(db, "threadAddParticipant")) return;
  try {
    const thread = await db.prepare(`SELECT participants FROM conversation_threads WHERE id = ?`)
      .bind(threadId).first();
    if (!thread) return;

    const parts = JSON.parse(thread.participants ?? "[]");
    if (!parts.includes(agentKey)) {
      parts.push(agentKey);
      await db.prepare(`UPDATE conversation_threads SET participants = ?, last_event_at = ? WHERE id = ?`)
        .bind(JSON.stringify(parts), now(), threadId).run();
    }
  } catch (e) {
    console.error("[d1] threadAddParticipant failed:", e.message);
  }
}

/**
 * Increment a thread's turn and session counters, touch last_event_at.
 */
export async function threadTick(db, threadId, { sessions = 0, turns = 1 } = {}) {
  if (noDb(db, "threadTick")) return;
  try {
    await db.prepare(`
      UPDATE conversation_threads
      SET turn_count = turn_count + ?, session_count = session_count + ?, last_event_at = ?
      WHERE id = ?
    `).bind(turns, sessions, now(), threadId).run();
  } catch (e) {
    console.error("[d1] threadTick failed:", e.message);
  }
}

/**
 * Get a thread by id.
 */
export async function threadGet(db, threadId) {
  if (noDb(db, "threadGet")) return null;
  try {
    return await db.prepare(`SELECT * FROM conversation_threads WHERE id = ?`).bind(threadId).first() ?? null;
  } catch (e) {
    console.error("[d1] threadGet failed:", e.message);
    return null;
  }
}

/**
 * List threads, optionally filtered by status.
 */
export async function threadList(db, { status, limit = 20 } = {}) {
  if (noDb(db, "threadList")) return [];
  try {
    let query = `SELECT * FROM conversation_threads`;
    const binds = [];
    if (status) { query += ` WHERE status = ?`; binds.push(status); }
    query += ` ORDER BY last_event_at DESC LIMIT ?`;
    binds.push(limit);
    const result = await db.prepare(query).bind(...binds).all();
    return result.results ?? [];
  } catch (e) {
    console.error("[d1] threadList failed:", e.message);
    return [];
  }
}

// ── Thread Edges (Conversation Graph) ────────────────────────────────────────

/**
 * Record a directed edge in the conversation graph.
 * If an edge (thread, from, to, intent) already exists, increment its weight.
 * Returns the edge id.
 */
export async function edgeRecord(db, opts = {}) {
  if (noDb(db, "edgeRecord")) return null;
  if (!opts.threadId || !opts.fromAgent || !opts.toAgent) return null;
  const ts = now();
  try {
    // Check for an existing edge on this (thread, from, to, intent) tuple
    const existing = await db.prepare(`
      SELECT id, weight FROM thread_edges
      WHERE thread_id = ? AND from_agent = ? AND to_agent = ? AND intent = ?
    `).bind(opts.threadId, opts.fromAgent, opts.toAgent, opts.intent ?? "message").first();

    if (existing) {
      await db.prepare(`UPDATE thread_edges SET weight = weight + 1 WHERE id = ?`)
        .bind(existing.id).run();
      return existing.id;
    }

    const id = uuid();
    await db.prepare(`
      INSERT INTO thread_edges (id, thread_id, session_id, trace_id, from_agent, to_agent, intent, trigger, weight, ts)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1.0, ?)
    `).bind(
      id,
      opts.threadId,
      opts.sessionId ?? null,
      opts.traceId ?? null,
      opts.fromAgent,
      opts.toAgent,
      opts.intent ?? "message",
      opts.trigger ?? "T1",
      ts
    ).run();

    return id;
  } catch (e) {
    console.error("[d1] edgeRecord failed:", e.message);
    return null;
  }
}

/**
 * Get the full conversation graph for a thread.
 * Returns nodes (unique agents) and edges (directed links with weights).
 */
export async function graphGet(db, threadId) {
  if (noDb(db, "graphGet")) return { nodes: [], edges: [] };
  try {
    const edgeResult = await db.prepare(`
      SELECT from_agent, to_agent, intent, trigger, SUM(weight) as weight, COUNT(*) as traversals
      FROM thread_edges WHERE thread_id = ?
      GROUP BY from_agent, to_agent, intent
      ORDER BY weight DESC
    `).bind(threadId).all();

    const edges = edgeResult.results ?? [];
    const nodeSet = new Set();
    edges.forEach(e => { nodeSet.add(e.from_agent); nodeSet.add(e.to_agent); });

    return { nodes: [...nodeSet], edges };
  } catch (e) {
    console.error("[d1] graphGet failed:", e.message);
    return { nodes: [], edges: [] };
  }
}

/**
 * Get all edges involving a specific agent (any thread).
 */
export async function agentGraph(db, agentKey) {
  if (noDb(db, "agentGraph")) return { outbound: [], inbound: [] };
  try {
    const [out, inb] = await Promise.all([
      db.prepare(`
        SELECT thread_id, to_agent, intent, SUM(weight) as weight FROM thread_edges
        WHERE from_agent = ? GROUP BY thread_id, to_agent, intent ORDER BY weight DESC LIMIT 50
      `).bind(agentKey).all(),
      db.prepare(`
        SELECT thread_id, from_agent, intent, SUM(weight) as weight FROM thread_edges
        WHERE to_agent = ? GROUP BY thread_id, from_agent, intent ORDER BY weight DESC LIMIT 50
      `).bind(agentKey).all()
    ]);
    return { outbound: out.results ?? [], inbound: inb.results ?? [] };
  } catch (e) {
    console.error("[d1] agentGraph failed:", e.message);
    return { outbound: [], inbound: [] };
  }
}

// ── Agent State ───────────────────────────────────────────────────────────────

/**
 * Upsert agent_state row for an agent. Non-destructive — only updates provided fields.
 */
export async function agentStateTouch(db, agentKey, opts = {}) {
  if (noDb(db, "agentStateTouch")) return;
  try {
    await db.prepare(`
      INSERT INTO agent_state (agent, epithet, current_thread, last_session, last_intent, last_seen, turn_count, meta)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?)
      ON CONFLICT(agent) DO UPDATE SET
        epithet        = COALESCE(excluded.epithet, epithet),
        current_thread = COALESCE(excluded.current_thread, current_thread),
        last_session   = COALESCE(excluded.last_session, last_session),
        last_intent    = COALESCE(excluded.last_intent, last_intent),
        last_seen      = COALESCE(excluded.last_seen, last_seen),
        meta           = COALESCE(excluded.meta, meta)
    `).bind(
      agentKey,
      opts.epithet ?? null,
      opts.currentThread ?? null,
      opts.lastSession ?? null,
      opts.lastIntent ?? null,
      opts.lastSeen ?? now(),
      opts.meta ? JSON.stringify(opts.meta) : null
    ).run();
  } catch (e) {
    console.error("[d1] agentStateTouch failed:", e.message);
  }
}

/**
 * Increment an agent's turn counter and update context fields.
 */
export async function agentStateTurnIncrement(db, agentKey, opts = {}) {
  if (noDb(db, "agentStateTurnIncrement")) return;
  try {
    await db.prepare(`
      INSERT INTO agent_state (agent, current_thread, last_session, last_intent, last_seen, turn_count)
      VALUES (?, ?, ?, ?, ?, 1)
      ON CONFLICT(agent) DO UPDATE SET
        turn_count     = turn_count + 1,
        current_thread = COALESCE(excluded.current_thread, current_thread),
        last_session   = COALESCE(excluded.last_session, last_session),
        last_intent    = COALESCE(excluded.last_intent, last_intent),
        last_seen      = excluded.last_seen
    `).bind(
      agentKey,
      opts.currentThread ?? null,
      opts.lastSession ?? null,
      opts.lastIntent ?? null,
      opts.lastSeen ?? now()
    ).run();
  } catch (e) {
    console.error("[d1] agentStateTurnIncrement failed:", e.message);
  }
}

/**
 * Get agent state for one or all agents.
 */
export async function agentStateGet(db, agentKey = null) {
  if (noDb(db, "agentStateGet")) return null;
  try {
    if (agentKey) {
      return await db.prepare(`SELECT * FROM agent_state WHERE agent = ?`).bind(agentKey).first() ?? null;
    }
    const result = await db.prepare(`SELECT * FROM agent_state ORDER BY last_seen DESC`).all();
    return result.results ?? [];
  } catch (e) {
    console.error("[d1] agentStateGet failed:", e.message);
    return agentKey ? null : [];
  }
}

// ── High-level composite operations ──────────────────────────────────────────

/**
 * Record a complete agent exchange in one call.
 * Opens/touches the session and thread, writes the trace, records graph edges.
 * Returns { sessionId, traceId, threadId }.
 *
 * This is what Siddartha calls after any successful agent response.
 */
export async function recordExchange(db, {
  sessionId,       // existing session id — if null, a new session is opened
  threadId,        // existing thread id — optional
  fromAgent,       // who initiated (usually 'harvey')
  toAgent,         // the agent that responded
  epithet,
  request,
  response,
  model,
  triggerType,
  roundNumber,
  turnNumber,
  partyNodes,
  reasoning,
  latencyMs,
  source,
  mode,
  seed,
}) {
  if (!db) return { sessionId: null, traceId: null, threadId: null };

  // Ensure session
  let sid = sessionId;
  if (!sid) {
    sid = await sessionOpen(db, {
      threadId,
      source: source ?? "api",
      agent: toAgent,
      seed,
      mode
    });
  }

  // Ensure thread if provided
  if (threadId) {
    await threadOpen(db, { id: threadId, source: source ?? "api" });
    await threadAddParticipant(db, threadId, toAgent);
    await threadTick(db, threadId, { turns: 1 });
  }

  // Write trace
  const traceId = await traceWrite(db, {
    sessionId: sid,
    threadId,
    agent: toAgent,
    epithet,
    role: "assistant",
    triggerType: triggerType ?? "T1",
    request,
    response,
    model,
    roundNumber,
    turnNumber,
    partyNodes,
    reasoning,
    latencyMs
  });

  // Record graph edge
  if (sid && threadId) {
    await edgeRecord(db, {
      threadId,
      sessionId: sid,
      traceId,
      fromAgent: fromAgent ?? "harvey",
      toAgent,
      intent: triggerType ?? "message",
      trigger: triggerType ?? "T1"
    });
  }

  // Increment session turns
  if (sid) await sessionIncrementTurns(db, sid);

  return { sessionId: sid, traceId, threadId: threadId ?? null };
}
