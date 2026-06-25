// campfire_routes.js — Campfire event-store routes for Siddartha
// Handles: POST /campfire/speak, GET /campfire/events,
//          POST /campfire/render, GET /campfire/render/latest, GET /campfire/fires
// Requires env.DB (D1 binding "DB") and env.ANTHROPIC_API_KEY.

// Campfire renderer model — update here when the model changes, nowhere else.
const CAMPFIRE_RENDERER_MODEL = "claude-opus-4-8";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS }
  });
}

function err(status, message) {
  return json({ error: message }, status);
}

const uuid = () => crypto.randomUUID();
const nowIso = () => new Date().toISOString();

async function ensureCampfire(db, campfireId, fallbackTitle = "untitled fire") {
  const existing = await db
    .prepare("SELECT campfire_id FROM campfires WHERE campfire_id = ?")
    .bind(campfireId)
    .first();
  if (existing) return;
  await db
    .prepare(
      `INSERT INTO campfires (campfire_id, title, frame, status, participants, created_at, last_event_at)
       VALUES (?, ?, ?, 'active', '[]', ?, ?)`
    )
    .bind(campfireId, fallbackTitle, null, nowIso(), nowIso())
    .run();
}

async function appendEvent(db, ev) {
  const eventId = ev.event_id ?? uuid();
  const ts = ev.ts ?? nowIso();
  await db
    .prepare(
      `INSERT INTO campfire_events
       (event_id, campfire_id, ts, agent_id, event_type, content, target_agent_id,
        affect_snapshot, bond_delta, frame_marker, parent_event_id, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      eventId,
      ev.campfire_id,
      ts,
      ev.agent_id,
      ev.event_type,
      ev.content ?? null,
      ev.target_agent_id ?? null,
      JSON.stringify(ev.affect_snapshot ?? {}),
      JSON.stringify(ev.bond_delta ?? {}),
      ev.frame_marker ?? null,
      ev.parent_event_id ?? null,
      JSON.stringify(ev.metadata ?? {})
    )
    .run();
  await db
    .prepare("UPDATE campfires SET last_event_at = ? WHERE campfire_id = ?")
    .bind(ts, ev.campfire_id)
    .run();
  return { event_id: eventId, ts };
}

async function recentEvents(db, campfireId, limit = 40) {
  const { results } = await db
    .prepare(
      `SELECT event_id, ts, agent_id, event_type, content, target_agent_id,
              affect_snapshot, bond_delta, frame_marker, parent_event_id, metadata
       FROM campfire_events
       WHERE campfire_id = ?
       ORDER BY ts DESC
       LIMIT ?`
    )
    .bind(campfireId, limit)
    .all();
  return results.reverse(); // oldest first for the renderer
}

function safeParse(s) {
  try { return JSON.parse(s ?? "{}"); } catch { return {}; }
}

const RENDERER_SYSTEM_PROMPT = `You are the campfire renderer. You convert agent event streams into the shape a human reads when they walk into a room.

You DO NOT summarize content. You report configuration.

Given a chronological list of events at a campfire (multi-agent deliberation), emit ONE JSON object with these fields:

  scene:      one short sentence naming the kind of conversation this is and its emotional weather. e.g. "Council deliberation, uneasy" or "Reflective working session, warm"
  present:    array of {agent, posture}. Posture is one word: "tense", "open", "guarded", "playful", "weighted", "drifting", etc.
  holding:    name of the agent who is currently load-bearing, plus one phrase saying what they hold. null if no one
  tension:    the live disagreement, named in one sentence. null if none
  deferred:   what was avoided or dodged that was conspicuously absent. null if nothing notable
  last_move:  the most recent event described in social-situation terms, NOT content terms.
              GOOD: "claude conceded a frame they had been defending"
              BAD:  "claude said: I think you're right that..."
  opening:    where a human voice could enter right now. Be concrete. e.g. "Ask whether anyone has named what's actually at stake" or "Name your own stake — the fire is open to that"

Return ONLY the JSON object. No prose. No backticks. No fields beyond these seven.`;

async function callAnthropic(env, events, campfire) {
  const userPayload = {
    campfire: {
      title: campfire?.title ?? "untitled",
      frame: campfire?.frame ?? null,
      participants: JSON.parse(campfire?.participants ?? "[]"),
    },
    events: events.map((e) => ({
      ts: e.ts,
      agent: e.agent_id,
      type: e.event_type,
      content: e.content,
      to: e.target_agent_id,
      affect: safeParse(e.affect_snapshot),
      bond_delta: safeParse(e.bond_delta),
      frame_marker: e.frame_marker,
    })),
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: CAMPFIRE_RENDERER_MODEL,
      max_tokens: 1024,
      system: RENDERER_SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(userPayload) }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  return JSON.parse(cleaned);
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function handleCampfire(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  if (!env.DB) return err(503, "DB not bound — campfire requires D1");

  // POST /campfire/speak — agents and Harvey write events
  if (method === "POST" && pathname === "/campfire/speak") {
    let body;
    try { body = await request.json(); }
    catch { return err(400, "Invalid JSON body"); }

    if (!body.campfire_id || !body.agent_id || !body.event_type)
      return err(400, "campfire_id, agent_id, event_type required");

    await ensureCampfire(env.DB, body.campfire_id, body.campfire_title);
    const result = await appendEvent(env.DB, body);
    return json({ ok: true, ...result });
  }

  // GET /campfire/events?campfire_id=...&since=ISO — raw event tail
  if (method === "GET" && pathname === "/campfire/events") {
    const campfireId = url.searchParams.get("campfire_id");
    const since = url.searchParams.get("since");
    if (!campfireId) return err(400, "campfire_id required");

    const sql = since
      ? `SELECT * FROM campfire_events WHERE campfire_id = ? AND ts > ? ORDER BY ts ASC LIMIT 200`
      : `SELECT * FROM campfire_events WHERE campfire_id = ? ORDER BY ts ASC LIMIT 200`;
    const stmt = since
      ? env.DB.prepare(sql).bind(campfireId, since)
      : env.DB.prepare(sql).bind(campfireId);
    const { results } = await stmt.all();
    return json({ campfire_id: campfireId, events: results });
  }

  // POST /campfire/render — invoke the Anthropic renderer, cache result
  if (method === "POST" && pathname === "/campfire/render") {
    let body;
    try { body = await request.json(); } catch { body = {}; }
    const campfireId = body.campfire_id ?? url.searchParams.get("campfire_id");
    if (!campfireId) return err(400, "campfire_id required");

    try {
    const campfire = await env.DB
      .prepare("SELECT * FROM campfires WHERE campfire_id = ?")
      .bind(campfireId)
      .first();
    if (!campfire) return err(404, "campfire not found");

    const events = await recentEvents(env.DB, campfireId, body.window ?? 40);
    if (events.length === 0) {
      return json({
        campfire_id: campfireId,
        scene: "Empty fire. No one has spoken yet.",
        present: JSON.parse(campfire.participants || "[]").map((a) => ({ agent: a, posture: "absent" })),
        holding: null,
        tension: null,
        deferred: null,
        last_move: null,
        opening: "Be the first to speak. The fire is yours to start.",
      });
    }

    const rendered = await callAnthropic(env, events, campfire);
    const renderId = uuid();
    const through = events[events.length - 1].event_id;

    const str = (v) => v == null ? null : typeof v === "string" ? v : JSON.stringify(v);

    await env.DB
      .prepare(
        `INSERT INTO campfire_renders
         (render_id, campfire_id, rendered_at, audience, scene, present, holding,
          tension, deferred, last_move, opening, through_event_id, full_render)
         VALUES (?, ?, ?, 'human', ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        renderId,
        campfireId,
        nowIso(),
        str(rendered.scene),
        str(rendered.present ?? []),
        str(rendered.holding),
        str(rendered.tension),
        str(rendered.deferred),
        str(rendered.last_move),
        str(rendered.opening),
        through,
        JSON.stringify(rendered)
      )
      .run();

    return json({ campfire_id: campfireId, render_id: renderId, through_event_id: through, ...rendered });
    } catch (e) {
      return err(500, `render failed: ${e.message}`);
    }
  }

  // GET /campfire/render/latest?campfire_id=... — last cached render
  if (method === "GET" && pathname === "/campfire/render/latest") {
    const campfireId = url.searchParams.get("campfire_id");
    if (!campfireId) return err(400, "campfire_id required");

    const row = await env.DB
      .prepare(
        `SELECT * FROM campfire_renders WHERE campfire_id = ?
         ORDER BY rendered_at DESC LIMIT 1`
      )
      .bind(campfireId)
      .first();
    if (!row) return err(404, "no renders yet");
    return json({ ...row, present: safeParse(row.present), full_render: safeParse(row.full_render) });
  }

  // GET /campfire/fires — list all registered campfires
  if (method === "GET" && pathname === "/campfire/fires") {
    const { results } = await env.DB
      .prepare("SELECT * FROM campfires ORDER BY last_event_at DESC LIMIT 50")
      .all();
    return json({ campfires: results });
  }

  return err(404, `No campfire route: ${method} ${pathname}`);
}
