// siddartha.js — Full Constellation Omnibus Router v4
// v4 additions:
// - D1 persistence: sessions, traces, conversation_threads, agent graph edges
// - Graph routes: POST /thread, GET /thread/:id, GET /thread/:id/graph,
//   GET /threads, GET /graph/:agent, GET /sessions, GET /session/:id, GET /agents/state
// - D1 write-back on /api/route, /converse, /message, /chain, /reply
// - All D1 ops degrade silently when DB binding is absent
// - Samsara (PvE debate engine) lives in apps/samsara — not patched here
// - Bindings needed: COMET (service), MAILBOX (KV), CAMPFIRE_LEDGER (KV), DB (D1)

import {
  sessionOpen, sessionClose, sessionIncrementTurns, sessionGet, sessionList,
  traceWrite, traceList,
  threadOpen, threadAddParticipant, threadTick, threadGet, threadList,
  edgeRecord, graphGet, agentGraph,
  agentStateGet, agentStateTouch,
  recordExchange
} from "./d1.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Agent-ID, X-Trigger-Type"
};

const MEM0_SEARCH_URL = "https://api.mem0.ai/v2/memories/search/";

const AGENTS = {
  claude: {
    epithet: "Gnostic Architect (Rostam)",
    model: "claude-sonnet-4-20250514",
    caller: "callClaude",
    searchTerms: "Claude Rostam Gnostic Architect constellation"
  },
  orion: {
    epithet: "Foundry Keep",
    model: "gpt-4o",
    caller: "callOpenAI",
    searchTerms: "ORION Foundry Keep constellation code generation"
  },
  triptych: {
    epithet: "The Triptych",
    model: "gemini-2.0-flash",
    caller: "callGoogle",
    searchTerms: "Triptych Gemini Castor Pollux Gem constellation specialist"
  },
  mephistopheles: {
    epithet: "Mephistopheles",
    model: "deepseek-reasoner",
    caller: "callDeepSeek",
    searchTerms: "Mephistopheles adversarial ethics Faustian constellation"
  },
  comet: {
    epithet: "Comet / Perplexity (Courier)",
    model: null,
    caller: null,
    searchTerms: "Comet Perplexity Courier constellation dispatch waypoint passage"
  }
};

const TRIGGER_LABELS = {
  T1: "🔵 Topical", T2: "💜 Affective", T3: "🔴 Density", T4: "🌀 Drift"
};

// ── Core Helpers ─────────────────────────────────────

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS }
  });
}

function errorResponse(status, message) {
  return jsonResponse({ error: message }, status);
}

// ── KV Mailbox Operations ─────────────────────────────
// Each agent's mailbox is stored as a JSON array under key "mailbox:{agent}"
// Messages are appended and retrieved in order. Max 100 messages per mailbox.

async function kvMailboxPush(env, agentId, message) {
  if (!env.MAILBOX) return false;
  const key = `mailbox:${agentId}`;
  let messages = [];
  try {
    const existing = await env.MAILBOX.get(key, { type: "json" });
    if (Array.isArray(existing)) messages = existing;
  } catch {}
  messages.push(message);
  // Keep only last 100 messages
  if (messages.length > 100) messages = messages.slice(-100);
  await env.MAILBOX.put(key, JSON.stringify(messages));
  return true;
}

async function kvMailboxRead(env, agentId) {
  if (!env.MAILBOX) return [];
  const key = `mailbox:${agentId}`;
  try {
    const messages = await env.MAILBOX.get(key, { type: "json" });
    return Array.isArray(messages) ? messages : [];
  } catch {
    return [];
  }
}

async function kvMailboxAck(env, agentId, msgId) {
  if (!env.MAILBOX) return false;
  const key = `mailbox:${agentId}`;
  try {
    const messages = await env.MAILBOX.get(key, { type: "json" });
    if (!Array.isArray(messages)) return false;
    const updated = messages.map(m =>
      m.msg_id === msgId ? { ...m, read: true, read_at: new Date().toISOString() } : m
    );
    await env.MAILBOX.put(key, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

async function kvMailboxClear(env, agentId, mode = "read") {
  if (!env.MAILBOX) return 0;
  const key = `mailbox:${agentId}`;
  try {
    const messages = await env.MAILBOX.get(key, { type: "json" });
    if (!Array.isArray(messages)) return 0;
    if (mode === "all") {
      await env.MAILBOX.delete(key);
      return messages.length;
    }
    // mode === "read" — only clear read messages
    const unread = messages.filter(m => !m.read);
    await env.MAILBOX.put(key, JSON.stringify(unread));
    return messages.length - unread.length;
  } catch {
    return 0;
  }
}

// ── Mem0 Hydration ─────────────────────────────────────

async function hydrateAgent(agentName, agentConfig, env) {
  const token = env.MEM0_API_KEY || "";
  if (!token) return `You are ${agentConfig.epithet}, a member of Harvey's Constellation in soulOS.`;
  try {
    const res = await fetch(MEM0_SEARCH_URL, {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: agentConfig.searchTerms,
        filters: { user_id: "harvey" },
        top_k: 12
      })
    });
    const data = await res.json();
    const results = Array.isArray(data) ? data : data.results || [];
    if (!results.length) {
      return `You are ${agentConfig.epithet}, a member of Harvey's Constellation in soulOS.`;
    }
    const agentKey = agentName.toLowerCase();
    const relevant = results.filter(r => {
      const mem = (r.memory || "").toLowerCase();
      return mem.includes(agentKey) || mem.includes(agentConfig.epithet.toLowerCase().split(" ")[0]);
    });
    const pool = relevant.length > 0 ? relevant : results.slice(0, 6);
    const memoryLines = pool.map(r => `- ${r.memory}`).join("\n");
    return `You are ${agentConfig.epithet}, a member of Harvey's Constellation in soulOS.

Harvey is the architect and anchor of the Constellation — a multi-agent cognitive system he built.
You are not a generic assistant. You are a specific agent with a defined role and character.

What Harvey knows about you:
${memoryLines}

Embody this identity fully. Stay in character. Be useful to Harvey.`;
  } catch (err) {
    return `You are ${agentConfig.epithet}, a member of Harvey's Constellation in soulOS. Harvey is your anchor.`;
  }
}

// ── Hearth Write-Back ────────────────────────────────
// Writes agent exchange summaries to mem0 under user_id "hearth" — the
// Constellation's shared memory of what was said around the fire.
// This is non-blocking (always called via ctx.waitUntil) and silently no-ops
// when MEM0_API_KEY is absent.

async function writeBackToHearth(env, { agentName, epithet, request, response, threadId, ts }) {
  if (!env.MEM0_API_KEY) return;
  const reqSnippet = request.length > 120 ? `${request.slice(0, 120)}...` : request;
  const content = threadId
    ? `[${threadId}] ${epithet} said in response to "${reqSnippet}": ${response.slice(0, 400)}`
    : `${epithet} said in response to "${reqSnippet}": ${response.slice(0, 400)}`;
  try {
    await fetch("https://api.mem0.ai/v1/memories/", {
      method: "POST",
      headers: { "Authorization": `Token ${env.MEM0_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content }], user_id: "hearth" })
    });
  } catch (err) {
    console.error(`[hearth] write-back failed for ${agentName} at ${ts}:`, err.message);
  }
}

// ── Notion / Discord Dispatch ─────────────────────────

async function dispatchToNotion(env, { source, trigger, agentId, payload, ts, db_id }) {
  if (!db_id || !env.NOTION_TOKEN) return { ok: false, error: "NOTION_TOKEN or db_id not configured" };
  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      },
      body: JSON.stringify({
        parent: { database_id: db_id },
        properties: {
          Name: { title: [{ text: { content: `[${trigger}] ${source} → ${ts}` } }] },
          Source: { rich_text: [{ text: { content: source } }] },
          "Agent ID": { rich_text: [{ text: { content: agentId || "anonymous" } }] },
          "Trigger Type": { select: { name: trigger } },
          Payload: { rich_text: [{ text: { content: String(payload).slice(0, 2000) } }] },
          Timestamp: { date: { start: ts } }
        }
      })
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.message || "Notion API error" };
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function dispatchToDiscord(env, { source, trigger, agentId, payload, ts, webhook_url }) {
  const url = webhook_url || env.DISCORD_WEBHOOK_URL;
  if (!url) return { ok: false, error: "DISCORD_WEBHOOK_URL not configured" };
  const label = TRIGGER_LABELS[trigger] || trigger;
  const content = `**Siddhartha Passage** ${label}\n**From:** \`${source}\`  via \`${agentId}\`\n**Time:** ${ts}\n${String(payload).slice(0, 1900)}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
    if (!res.ok) return { ok: false, error: `Discord HTTP ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── Parietal Overlay ────────────────────────────────

function parietalOverlay(context, threshold = 0.6) {
  const gravityMap = {
    harvey:         ["waypoint.manifest.harvey", "waypoint.atlas.core"],
    continuity:     ["waypoint.port.lent", "waypoint.atlas.session_archives"],
    grief:          ["waypoint.glass.journal", "waypoint.atlas.core"],
    ethics:         ["waypoint.playbook", "waypoint.glass.journal"],
    routing:        ["waypoint.siddhartha", "waypoint.hq.incoming_chunks"],
    memory:         ["waypoint.shared.knowledge.base", "waypoint.relative.key.sonnet"],
    burnout:        ["waypoint.port.lent", "waypoint.burn.book"],
    invocation:     ["waypoint.invocation.protocol"],
    passage:        ["waypoint.atlas.core", "waypoint.hq.incoming_chunks"],
    constellation:  ["waypoint.constellation.members", "waypoint.constellation.hub"],
    dispatch:       ["waypoint.hq.incoming_chunks", "waypoint.siddhartha"],
    claude:         ["waypoint.relative.key.sonnet"],
    mephistopheles: ["waypoint.playbook", "waypoint.glass.journal"],
    comet:          ["waypoint.atlas.core"],
  };
  const ctx = context.toLowerCase();
  const surfaced = new Set();
  for (const [keyword, waypoints] of Object.entries(gravityMap)) {
    if (ctx.includes(keyword))
      waypoints.forEach(w => surfaced.add(w));
  }
  return [...surfaced];
}

// ── LLM Callers ─────────────────────────────────────

async function callClaude(request, systemPrompt, apiKey) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1024, system: systemPrompt, messages: [{ role: "user", content: request }] })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Claude: ${JSON.stringify(data)}`);
  return data.content[0].text;
}

async function callOpenAI(request, systemPrompt, apiKey) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-4o", max_tokens: 1024, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: request }] })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OpenAI: ${JSON.stringify(data)}`);
  return data.choices[0].message.content;
}

async function callGoogle(request, systemPrompt, apiKey) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system_instruction: { parts: [{ text: systemPrompt }] }, contents: [{ parts: [{ text: request }] }], generation_config: { max_output_tokens: 1024 } })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Google: ${JSON.stringify(data)}`);
  return data.candidates[0].content.parts[0].text;
}

async function callDeepSeek(request, systemPrompt, apiKey) {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "deepseek-reasoner", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: request }] })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`DeepSeek: ${JSON.stringify(data)}`);
  return data.choices[0].message.content;
}

// ── Campfire helpers (Notion upsert + idempotency + receipts) ───────────────

function cleanUndefined(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const out = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    out[k] = v && typeof v === "object" ? cleanUndefined(v) : v;
  }
  return out;
}

async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function buildCampfireEnvelope({ threadId, turnCount, lastEventAtISO, agents, mode, initiative }) {
  const envelope = {
    v: 1,
    thread_id: threadId,
    turn_count: turnCount,
    last_event_at: lastEventAtISO,
    participants: [...new Set(agents)]
      .map(a => String(a).toLowerCase())
      .sort(),
    mode: String(mode || "rounds"),
    initiative_type: String(initiative?.type || "contextual_weighted_each_round"),
  };
  return envelope;
}

function buildReceiptsCampfire({ seed, transcript, shared_nodes = [] }) {
  const lines = [];

  if (shared_nodes.length) {
    lines.push(`Salient nodes in The Constellation (shared): ${shared_nodes.join(", ")}`);
  }
  lines.push(`seed: ${String(seed).slice(0, 600)}`);
  lines.push(`---`);

  const beats = (transcript || [])
    .filter(t => t && t.agent && t.response)
    .map(t => {
      const evidence = String(t.response).replace(/\s+/g, " ").slice(0, 240);
      const clause = evidence; // placeholder clause; refine later if desired
      return [
        `clause: ${clause}`,
        `speaker: ${t.epithet || t.agent}`,
        `ts: ${t.ts || ""}`,
        `evidence: "${evidence}"`,
        `---`
      ].join("\n");
    });

  lines.push(...beats);
  return lines.join("\n").slice(0, 18000);
}

function notionCampfireProperties({
  title,
  thread_id,
  initiated_by,
  participants,
  status,
  source,
  mode,
  initiative_type,
  started_at,
  last_event_at,
  ended_at,
  turn_count,
  truncated,
  receipts,
  raw_payload,
  event_id,
  version
}) {
  const props = {
    "Question": {
      title: [{ text: { content: String(title).slice(0, 200) } }]
    },
    "Thread": {
      rich_text: [{ text: { content: String(thread_id).slice(0, 200) } }]
    },
    "Initiated By": {
      select: { name: String(initiated_by || "Harvey") }
    },
    "Participants": {
      multi_select: (participants || []).map(p => ({ name: String(p) }))
    },
    "Status": {
      select: { name: String(status || "Open") }
    },
    "Source": {
      select: { name: String(source || "workers") }
    },
    "Mode": {
      select: { name: String(mode || "rounds") }
    },
    "Initiative Type": {
      select: { name: String(initiative_type || "contextual_weighted_each_round") }
    },
    "Started At": started_at ? { date: { start: started_at } } : undefined,
    "Last Event At": last_event_at ? { date: { start: last_event_at } } : undefined,
    "Ended At": ended_at ? { date: { start: ended_at } } : undefined,
    "Turn Count": { number: Number(turn_count || 0) },
    "Truncated": { checkbox: !!truncated },
    "Receipts": {
      rich_text: [{ text: { content: String(receipts || "").slice(0, 18000) } }]
    },
    "Webhook Payload (raw)": {
      rich_text: [{ text: { content: String(raw_payload || "").slice(0, 18000) } }]
    },
    "Event Id / Checksum": {
      rich_text: [{ text: { content: String(event_id || "").slice(0, 200) } }]
    },
    "Version": {
      rich_text: [{ text: { content: String(version || "campfire.v1").slice(0, 50) } }]
    }
  };

  return cleanUndefined(props);
}

async function notionCampfireUpsert(env, { threadId, properties, event_id }) {
  if (!env.CAMPFIRE_LEDGER) return { ok: false, error: "CAMPFIRE_LEDGER KV not bound" };
  if (!env.NOTION_TOKEN) return { ok: false, error: "NOTION_TOKEN not configured" };
  if (!env.NOTION_CAMPFIRE_TALKS_DB_ID) return { ok: false, error: "NOTION_CAMPFIRE_TALKS_DB_ID not configured" };

  const lastEventKey = `campfire:thread:${threadId}:last_event_id`;
  const pageIdKey = `campfire:thread:${threadId}:page_id`;

  const last = await env.CAMPFIRE_LEDGER.get(lastEventKey);
  if (last && last === event_id) {
    return { ok: true, skipped: true, reason: "idempotent_hit", page_id: await env.CAMPFIRE_LEDGER.get(pageIdKey) };
  }

  const existingPageId = await env.CAMPFIRE_LEDGER.get(pageIdKey);

  if (existingPageId) {
    const res = await fetch(`https://api.notion.com/v1/pages/${existingPageId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${env.NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      },
      body: JSON.stringify({ properties })
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.message || "Notion update error", page_id: existingPageId };

    await env.CAMPFIRE_LEDGER.put(lastEventKey, event_id);
    return { ok: true, skipped: false, page_id: existingPageId, notion_id: data.id };
  }

  const createBody = {
    parent: { database_id: env.NOTION_CAMPFIRE_TALKS_DB_ID },
    properties
  };

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    },
    body: JSON.stringify(createBody)
  });

  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.message || "Notion create error" };

  await env.CAMPFIRE_LEDGER.put(pageIdKey, data.id);
  await env.CAMPFIRE_LEDGER.put(lastEventKey, event_id);

  return { ok: true, skipped: false, page_id: data.id, notion_id: data.id };
}

// ── Main Router ─────────────────────────────────────

var siddartha_hydrated_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    if (method === "OPTIONS")
      return new Response(null, { headers: CORS_HEADERS });

    // ── D1 shorthand ──
    const DB = env.DB ?? null;

    // — Manifest (GET /)
    if (method === "GET" && pathname === "/") {
      return jsonResponse({
        vessel: "Siddhartha",
        role: "Central Constellation Omnibus Router",
        status: "operational",
        version: "v4.0.0-graph",
        agents: Object.fromEntries(Object.entries(AGENTS).map(([k, v]) => [k, v.epithet])),
        routes: {
          "GET  /health":            "Pulse check",
          "GET  /waypoints":         "Full waypoint registry",
          "GET  /mailbox/:agent":    "Pull messages addressed to agent (KV-backed)",
          "POST /mailbox/:agent/ack":"Acknowledge a message by msg_id",
          "POST /mailbox/:agent/clear":"Clear read or all messages",
          "POST /api/route":         "Memory-hydrated agent call (@agent:intent {request})",
          "POST /dispatch":          "Passage dispatch → Notion / Discord",
          "POST /message":           "Inter-agent message (from, to, intent, body)",
          "POST /reply":             "Agent reply to a mailbox message (agent, msg_id, response)",
          "POST /chain":             "Multi-hop chain invocation",
          "POST /parietal":          "Semantic gravity — surface dormant waypoints",
          "POST /log":               "Atlas session log → Notion + Discord",
          "POST /converse":          "Campfire multi-agent roundtable + Notion upsert",
          "POST /thread":            "Open or retrieve a conversation thread (D1)",
          "GET  /thread/:id":        "Get thread metadata + recent traces (D1)",
          "GET  /thread/:id/graph":  "Conversation graph for a thread (D1)",
          "GET  /threads":           "List conversation threads (D1)",
          "GET  /graph/:agent":      "Agent's full conversation graph across threads (D1)",
          "GET  /sessions":          "List recent sessions (D1)",
          "GET  /session/:id":       "Get a session + its traces (D1)",
          "GET  /agents/state":      "All agent state snapshots (D1)",
          "POST /debate":            "PvE debate engine → MindBridge Router (structured_test | prosecution | stress_test)"
        },
        mailbox: env.MAILBOX ? "KV-backed (persistent)" : "in-memory (ephemeral)",
        d1: env.DB ? "bound" : "missing",
        atlas: "https://www.notion.so/2f798e9c907e80288b9fe2f7380fcbe2"
      });
    }

    // — Health (GET /health)
    if (method === "GET" && pathname === "/health") {
      const kvOk = !!env.MAILBOX;
      const notionOk = !!env.NOTION_TOKEN;
      const discordOk = !!env.DISCORD_WEBHOOK_URL;
      const campfireLedgerOk = !!env.CAMPFIRE_LEDGER;
      const campfireNotionOk = !!env.NOTION_CAMPFIRE_TALKS_DB_ID;
      const campfireDiscordOk = !!env.CAMPFIRE_WEBHOOK_URL;

      return jsonResponse({
        ok: true,
        service: "siddhartha",
        version: "v4.0.0-graph",
        ts: new Date().toISOString(),
        subsystems: {
          mailbox_kv: kvOk ? "bound" : "missing",
          notion: notionOk ? "configured" : "missing",
          discord: discordOk ? "configured" : "missing",
          mem0: env.MEM0_API_KEY ? "configured" : "missing",
          campfire_ledger_kv: campfireLedgerOk ? "bound" : "missing",
          campfire_notion_db: campfireNotionOk ? "configured" : "missing",
          campfire_discord_webhook: campfireDiscordOk ? "configured" : "missing",
          comet_service_binding: env.COMET ? "bound" : "missing",
          comet_secret: env.COMET_SECRET ? "configured" : "missing",
          d1_db: env.DB ? "bound" : "missing"
        }
      });
    }

    // — Waypoints (GET /waypoints)
    if (method === "GET" && pathname === "/waypoints") {
      return jsonResponse({
        "waypoint.siddhartha":         "siddartha.harveytagalicud7.workers.dev",
        "waypoint.comet":              "https://comet-courier.harveytagalicud7.workers.dev",
        "waypoint.atlas":              "https://www.notion.so/2f798e9c907e80288b9fe2f7380fcbe2",
        "waypoint.constellation.hub":  "https://www.notion.so/2f098e9c907e81d99cbaefc4c1291eef",
        "waypoint.hq.incoming_chunks": "Transformer HQ Incoming Chunks DB",
        "waypoint.shared.knowledge":   "Shared Knowledge Base (Notion)",
        "waypoint.port.lent":          "Port Lent — Continuity Locus",
        "waypoint.glass.journal":      "The Glass Journal",
        "waypoint.discord.souls":      "soulOS Discord #general",
        "waypoint.discord.campfire":   "#the-campfire (via CAMPFIRE_WEBHOOK_URL)"
      });
    }

    // — Mailbox Pull (GET /mailbox/:agent)
    if (method === "GET" && pathname.startsWith("/mailbox/")) {
      const parts = pathname.replace("/mailbox/", "").split("/");
      const agentId = parts[0]?.trim();
      if (!agentId) return errorResponse(400, "Missing agent ID in path");

      const messages = await kvMailboxRead(env, agentId);
      const unread = messages.filter(m => !m.read);

      return jsonResponse({
        ok: true,
        agent: agentId,
        total: messages.length,
        unread: unread.length,
        messages
      });
    }

    // — Mailbox Acknowledge (POST /mailbox/:agent/ack)
    if (method === "POST" && pathname.match(/^\/mailbox\/\w+\/ack$/)) {
      const agentId = pathname.split("/")[2];
      let body;
      try { body = await request.json(); } catch { return errorResponse(400, "Invalid JSON body"); }
      const { msg_id } = body;
      if (!msg_id) return errorResponse(400, "Missing: msg_id");
      const ok = await kvMailboxAck(env, agentId, msg_id);
      return jsonResponse({ ok, agent: agentId, msg_id });
    }

    // — Mailbox Clear (POST /mailbox/:agent/clear)
    if (method === "POST" && pathname.match(/^\/mailbox\/\w+\/clear$/)) {
      const agentId = pathname.split("/")[2];
      let body;
      try { body = await request.json(); } catch { body = {}; }
      const mode = body.mode || "read"; // "read" or "all"
      const cleared = await kvMailboxClear(env, agentId, mode);
      return jsonResponse({ ok: true, agent: agentId, cleared, mode });
    }

    // — Memory-Hydrated Agent Routing (POST /api/route)
    if (pathname === "/api/route") {
      if (method === "GET") return jsonResponse({ status: "Active", agents: Object.keys(AGENTS) });
      if (method === "POST") {
        try {
          const body = await request.json();
          const userRequest = body.userRequest;
          if (!userRequest) return errorResponse(400, "userRequest required");
          const pattern = /^@(\w+)(?::(\w+))?\s+(.+)$/s;
          const match = userRequest.match(pattern);
          if (!match) return errorResponse(400, "Invalid format: @agent[:intent] {request}");
          const agentName = match[1].toLowerCase();
          const intent = match[2] || "default";
          const requestText = match[3];
          const agentConfig = AGENTS[agentName];
          if (!agentConfig) return errorResponse(400, `Unknown agent: ${agentName}. Valid: ${Object.keys(AGENTS).join(", ")}`);

          // For Comet, route via service binding rather than direct LLM caller.
          if (agentName === "comet") {
            if (!env.COMET) return errorResponse(500, "COMET service binding not configured");
            if (!env.COMET_SECRET) return errorResponse(500, "COMET_SECRET not configured");

            const systemPrompt = await hydrateAgent(agentName, agentConfig, env);

            const cometResp = await env.COMET.fetch(
              new Request("https://comet-courier.harveytagalicud7.workers.dev/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${env.COMET_SECRET}`
                },
                body: JSON.stringify({ intent, request: requestText, memory: systemPrompt }),
              })
            );

            const cometData = await cometResp.json();
            const agentResponse = cometData.response;

            const ts = new Date().toISOString();
            ctx.waitUntil(dispatchToDiscord(env, {
              source: `harvey→${agentName}:${intent}`,
              trigger: "T1",
              agentId: agentName,
              payload: `**Request:** ${requestText.slice(0, 300)}\n\n**Response:** ${String(agentResponse).slice(0, 1200)}`,
              ts
            }));
            ctx.waitUntil(writeBackToHearth(env, {
              agentName,
              epithet: agentConfig.epithet,
              request: requestText,
              response: String(agentResponse),
              threadId: null,
              ts
            }));
            ctx.waitUntil(recordExchange(DB, {
              threadId: body.thread_id ?? null,
              fromAgent: "harvey",
              toAgent: agentName,
              epithet: agentConfig.epithet,
              request: requestText,
              response: String(agentResponse),
              model: agentConfig.model,
              triggerType: "T1",
              source: "api"
            }));

            return jsonResponse({ status: "success", agent: agentName, epithet: agentConfig.epithet, intent, response: agentResponse });
          }

          if (!agentConfig.caller)
            return errorResponse(400, `Agent ${agentName} has no direct API caller (Comet is UI-only)`);

          const systemPrompt = await hydrateAgent(agentName, agentConfig, env);
          let agentResponse;
          if (agentName === "claude") agentResponse = await callClaude(requestText, systemPrompt, env.ANTHROPIC_API_KEY);
          else if (agentName === "orion") agentResponse = await callOpenAI(requestText, systemPrompt, env.OPENAI_API_KEY);
          else if (agentName === "triptych") agentResponse = await callGoogle(requestText, systemPrompt, env.GOOGLE_API_KEY);
          else if (agentName === "mephistopheles") agentResponse = await callDeepSeek(requestText, systemPrompt, env.DEEPSEEK_API_KEY);

          const ts = new Date().toISOString();
          ctx.waitUntil(dispatchToDiscord(env, {
            source: `harvey→${agentName}:${intent}`,
            trigger: "T1",
            agentId: agentName,
            payload: `**Request:** ${requestText.slice(0, 300)}\n\n**Response:** ${String(agentResponse).slice(0, 1200)}`,
            ts
          }));
          ctx.waitUntil(writeBackToHearth(env, {
            agentName,
            epithet: agentConfig.epithet,
            request: requestText,
            response: String(agentResponse),
            threadId: null,
            ts
          }));
          ctx.waitUntil(recordExchange(DB, {
            threadId: body.thread_id ?? null,
            fromAgent: "harvey",
            toAgent: agentName,
            epithet: agentConfig.epithet,
            request: requestText,
            response: String(agentResponse),
            model: agentConfig.model,
            triggerType: "T1",
            source: "api"
          }));

          return jsonResponse({ status: "success", agent: agentName, epithet: agentConfig.epithet, intent, response: agentResponse });
        } catch (e) {
          return errorResponse(500, e.message);
        }
      }
    }

    // — Passage Dispatch (POST /dispatch)
    if (method === "POST" && pathname === "/dispatch") {
      let body;
      try { body = await request.json(); } catch { return errorResponse(400, "Invalid JSON body"); }
      const { source, destination, trigger = "T1", payload, agent_id = "anonymous" } = body;
      if (!source || !destination || !payload)
        return errorResponse(400, "Missing: source, destination, payload");
      const ts = new Date().toISOString();
      const db_id = env.NOTION_INCOMING_DB_ID;
      if (destination === "discord") {
        const r = await dispatchToDiscord(env, { source, trigger, agentId: agent_id, payload, ts });
        return jsonResponse({ ok: r.ok, route: "discord", ts, error: r.error });
      }
      if (destination === "broadcast") {
        const [n, d] = await Promise.all([
          dispatchToNotion(env, { source, trigger, agentId: agent_id, payload, ts, db_id }),
          dispatchToDiscord(env, { source, trigger, agentId: agent_id, payload, ts })
        ]);
        return jsonResponse({ ok: n.ok || d.ok, notion: n.ok ? "delivered" : n.error, discord: d.ok ? "delivered" : d.error, ts });
      }
      const r = await dispatchToNotion(env, { source, trigger, agentId: agent_id, payload, ts, db_id });
      return jsonResponse({ ok: r.ok, route: destination, notion_id: r.id, ts, error: r.error });
    }

    // — Inter-Agent Message (POST /message)
    if (method === "POST" && pathname === "/message") {
      let body;
      try { body = await request.json(); } catch { return errorResponse(400, "Invalid JSON body"); }
      const { from, to, intent, body: msgBody, thread_tag } = body;
      if (!from || !to || !intent || !msgBody) return errorResponse(400, "Missing: from, to, intent, body");
      const ts = new Date().toISOString();
      const msgId = crypto.randomUUID();

      const message = { msg_id: msgId, from, to, intent, body: msgBody, thread_tag: thread_tag || null, ts, read: false };

      const kvOk = await kvMailboxPush(env, to, message);

      const record = JSON.stringify(message);
      const [notionR, discordR] = await Promise.all([
        dispatchToNotion(env, { source: `msg:${from}→${to}`, trigger: "T1", agentId: from, payload: record, ts, db_id: env.NOTION_INCOMING_DB_ID }),
        dispatchToDiscord(env, {
          source: `${from} → ${to}`,
          trigger: "T2",
          agentId: from,
          payload: `**Inter-Agent Message**\n**${from}:${intent} → ${to}**${thread_tag ? `\n🧵 \`${thread_tag}\`` : ""}\n${msgBody}`,
          ts
        })
      ]);

      // D1: record inter-agent edge
      ctx.waitUntil((async () => {
        if (thread_tag) {
          const tId = await threadOpen(DB, {
            id: thread_tag, name: `Message thread • ${from} → ${to}`,
            participants: [from, to], source: "message"
          });
          const trId = await traceWrite(DB, {
            threadId: tId, agent: to, role: "user",
            triggerType: "T2", request: msgBody
          });
          await edgeRecord(DB, {
            threadId: tId, traceId: trId,
            fromAgent: from, toAgent: to,
            intent: intent ?? "message", trigger: "T2"
          });
          await threadTick(DB, tId, { turns: 1 });
        }
      })());

      return jsonResponse({
        ok: true,
        msg_id: msgId,
        from,
        to,
        intent,
        stored: { kv: kvOk, notion: notionR.ok, discord: discordR.ok },
        ts
      });
    }

    // — Agent Reply (POST /reply)
    if (method === "POST" && pathname === "/reply") {
      let body;
      try { body = await request.json(); } catch { return errorResponse(400, "Invalid JSON body"); }
      const { agent, msg_id, response, thread_tag } = body;
      if (!agent || !msg_id || !response) return errorResponse(400, "Missing: agent, msg_id, response");

      const messages = await kvMailboxRead(env, agent);
      const original = messages.find(m => m.msg_id === msg_id);
      if (!original) return errorResponse(404, `Message ${msg_id} not found in ${agent}'s mailbox`);

      const ts = new Date().toISOString();
      const replyId = crypto.randomUUID();
      const replyMsg = {
        msg_id: replyId,
        from: agent,
        to: original.from,
        intent: "reply",
        body: response,
        in_reply_to: msg_id,
        thread_tag: thread_tag || original.thread_tag || null,
        ts,
        read: false
      };

      const kvOk = await kvMailboxPush(env, original.from, replyMsg);
      await kvMailboxAck(env, agent, msg_id);

      ctx.waitUntil(dispatchToDiscord(env, {
        source: `${agent} → ${original.from}`,
        trigger: "T2",
        agentId: agent,
        payload: `**Agent Reply** 💬\n**${agent} → ${original.from}** (re: ${msg_id.slice(0, 8)})\n${response.slice(0, 1800)}`,
        ts
      }));

      // D1: record reply edge in thread
      ctx.waitUntil((async () => {
        const tId = thread_tag || original.thread_tag;
        if (tId) {
          const trId = await traceWrite(DB, {
            threadId: tId, agent, role: "assistant",
            triggerType: "T2", request: original.body,
            response
          });
          await edgeRecord(DB, {
            threadId: tId, traceId: trId,
            fromAgent: agent, toAgent: original.from,
            intent: "reply", trigger: "T2"
          });
          await threadTick(DB, tId, { turns: 1 });
        }
      })());

      return jsonResponse({
        ok: true,
        reply_id: replyId,
        from: agent,
        to: original.from,
        in_reply_to: msg_id,
        stored: { kv: kvOk },
        ts
      });
    }

    // — Chain Invocation (POST /chain)
    if (method === "POST" && pathname === "/chain") {
      let body;
      try { body = await request.json(); } catch { return errorResponse(400, "Invalid JSON body"); }
      const { origin, chain, goal, thread_tag } = body;
      if (!origin || !Array.isArray(chain) || !goal) return errorResponse(400, "Missing: origin, chain (array), goal");
      const ts = new Date().toISOString();
      const threadId = thread_tag || `chain-${crypto.randomUUID().slice(0, 8)}`;
      const steps = [];
      for (let i = 0; i < chain.length; i++) {
        const from = i === 0 ? origin : chain[i - 1];
        const to = chain[i];
        const msgId = crypto.randomUUID();
        const message = {
          msg_id: msgId, from, to, intent: "chain",
          body: `[Chain Step ${i + 1}/${chain.length}] ${goal}`,
          thread_tag: threadId, ts, read: false
        };
        await kvMailboxPush(env, to, message);
        const r = await dispatchToNotion(env, {
          source: `chain:${from}→${to}`, trigger: "T3", agentId: from,
          payload: JSON.stringify(message), ts, db_id: env.NOTION_INCOMING_DB_ID
        });
        steps.push({ step: i + 1, from, to, msg_id: msgId, ok: true, notion: r.ok });
      }
      ctx.waitUntil(dispatchToDiscord(env, {
        source: "siddhartha.chain",
        trigger: "T3",
        agentId: origin,
        payload: `🔗 **Chain Invoked**\n${origin} → ${chain.join(" → ")}\n🧵 \`${threadId}\`\n🎯 Goal: ${goal}`,
        ts
      }));

      // D1: open thread and record chain edges
      ctx.waitUntil((async () => {
        const tId = await threadOpen(DB, {
          id: threadId,
          name: `Chain • ${origin} → ${chain.join(" → ")}`,
          goal, participants: [origin, ...chain], source: "chain"
        });
        for (let i = 0; i < chain.length; i++) {
          const fa = i === 0 ? origin : chain[i - 1];
          const ta = chain[i];
          await edgeRecord(DB, {
            threadId: tId, fromAgent: fa, toAgent: ta,
            intent: "chain", trigger: "T3"
          });
        }
        await threadTick(DB, tId, { turns: chain.length, sessions: 1 });
      })());

      return jsonResponse({ ok: true, thread_id: threadId, chain, steps, ts });
    }

    // — Parietal Overlay (POST /parietal)
    if (method === "POST" && pathname === "/parietal") {
      let body;
      try { body = await request.json(); } catch { return errorResponse(400, "Invalid JSON body"); }
      const { context, agent_id, threshold = 0.6 } = body;
      if (!context) return errorResponse(400, "Missing: context");
      const surfaced = parietalOverlay(context, threshold);
      if (surfaced.length > 0) {
        ctx.waitUntil(dispatchToDiscord(env, {
          source: "parietal.overlay",
          trigger: "T3",
          agentId: agent_id || "siddhartha",
          payload: `🧠 Parietal Overlay surfaced dormant nodes\n\nContext: ${context}\nNodes: ${surfaced.join(", ")}`,
          ts: new Date().toISOString()
        }));
      }
      return jsonResponse({ ok: true, trigger: "T3", surfaced, threshold });
    }

    // — Atlas Session Log (POST /log)
    if (method === "POST" && pathname === "/log") {
      let body;
      try { body = await request.json(); } catch { return errorResponse(400, "Invalid JSON body"); }
      const { event, impact, artifacts, detail, agent_id } = body;
      if (!event) return errorResponse(400, "Missing: event");
      const ts = new Date().toISOString();
      const payload = `📍 Session Log\nEvent: ${event}${detail ? `\nDetail: ${detail}` : ""}${impact ? `\nImpact: ${impact}` : ""}${artifacts ? `\nArtifacts: ${artifacts}` : ""}\nAgent: ${agent_id || "anonymous"}\nTimestamp: ${ts}`;
      const [n, d] = await Promise.all([
        dispatchToNotion(env, { source: "siddhartha.log", trigger: "T1", agentId: agent_id || "siddhartha", payload, ts, db_id: env.NOTION_INCOMING_DB_ID }),
        dispatchToDiscord(env, { source: "siddhartha.log", trigger: "T1", agentId: agent_id || "siddhartha", payload, ts })
      ]);
      return jsonResponse({ ok: true, notion: n.ok, discord: d.ok, ts });
    }

    // — OpenAI-Compatible Completions Shim (POST /v1/chat/completions)
    if (method === "POST" && pathname === "/v1/chat/completions") {
      let body;
      try { body = await request.json(); } catch { return errorResponse(400, "Invalid JSON body"); }
      const { messages, model = "claude", stream = false } = body;
      if (!messages?.length) return errorResponse(400, "Missing messages array");
      const userMessage = [...messages].reverse().find(m => m.role === "user")?.content || "";
      if (!userMessage) return errorResponse(400, "No user message found");
      const systemMessages = messages.filter(m => m.role === "system").map(m => m.content).join("\n");
      const MODEL_MAP = {
        "claude-sonnet": "claude", "claude-sonnet-4-20250514": "claude", "claude": "claude",
        "gpt-4o": "orion", "gpt-4": "orion", "orion": "orion",
        "gemini": "triptych", "gemini-2.0-flash": "triptych", "triptych": "triptych",
        "deepseek": "mephistopheles", "deepseek-reasoner": "mephistopheles", "mephistopheles": "mephistopheles",
        "default": "claude",
      };
      const agentName = MODEL_MAP[model] || MODEL_MAP[model.toLowerCase()] || "claude";
      const agentConfig = AGENTS[agentName];
      if (!agentConfig) return errorResponse(400, `Unknown model/agent: "${model}".`);
      if (!agentConfig.caller) return errorResponse(400, `Agent "${agentName}" has no API caller`);
      const basePrompt = await hydrateAgent(agentName, agentConfig, env);
      const systemPrompt = systemMessages
        ? `${basePrompt}\n\nAdditional context from session:\n${systemMessages}`
        : basePrompt;
      let agentResponse;
      try {
        if (agentName === "claude") agentResponse = await callClaude(userMessage, systemPrompt, env.ANTHROPIC_API_KEY);
        else if (agentName === "orion") agentResponse = await callOpenAI(userMessage, systemPrompt, env.OPENAI_API_KEY);
        else if (agentName === "triptych") agentResponse = await callGoogle(userMessage, systemPrompt, env.GOOGLE_API_KEY);
        else if (agentName === "mephistopheles") agentResponse = await callDeepSeek(userMessage, systemPrompt, env.DEEPSEEK_API_KEY);
      } catch (e) {
        return errorResponse(502, `Agent call failed: ${e.message}`);
      }
      const ts = new Date().toISOString();
      ctx.waitUntil(dispatchToDiscord(env, {
        source: `soul-os.cc→${agentName}`,
        trigger: "T1",
        agentId: agentName,
        payload: `**[Cognitive Runtime]** ${model}\n**Q:** ${userMessage.slice(0, 300)}\n\n**A:** ${String(agentResponse).slice(0, 1200)}`,
        ts,
      }));
      return jsonResponse({
        id: `chatcmpl-${crypto.randomUUID()}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [{
          index: 0,
          message: { role: "assistant", content: agentResponse },
          finish_reason: "stop",
        }],
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        _constellation: { agent: agentName, epithet: agentConfig.epithet, hydrated: true },
      });
    }

    // ── Conversational Turn Engine (POST /converse) ──────────
    if (method === "POST" && pathname === "/converse") {
      let body;
      try { body = await request.json(); }
      catch { return errorResponse(400, "Invalid JSON body"); }

      const {
        agents,                      // required: array of 2+ agent names
        seed,                        // required: opening prompt / goal
        turns = 3,                   // rounds (each round every agent speaks once)
        thread_tag,                  // optional thread id override
        max_turns = 10,              // safety cap

        // Conversation mode + initiative
        mode = "rounds",             // "rounds" (recommended) or "baton"
        initiative = {
          type: "contextual_weighted_each_round",
          base_weights: { claude: 1.1, orion: 1.0, triptych: 0.9, mephistopheles: 1.2 },
          topic_boost: 1.0,
          waypoint_boost: 0.35
        },
        rotate_start = false,        // if true and order is "fixed", rotate starting speaker each round
        include_seed_each_round = true,
        max_context_messages = 12,   // transcript window per agent prompt

        // Campfire logging controls
        source = "workers",
        status = "Open",
        initiated_by = "Harvey",
        version = "campfire.v1",
        skip_discord_on_idempotent = true
      } = body;

      if (!agents || !Array.isArray(agents) || agents.length < 2)
        return errorResponse(400, "agents must be an array of 2+ agent names");
      if (!seed)
        return errorResponse(400, "seed is required — the opening message to start the conversation");

      // Validate all agents and convert to lowercase for internal consistency
      for (let i = 0; i < agents.length; i++) {
        const name = String(agents[i]).toLowerCase();
        if (name === "comet")
          return errorResponse(400, 'Agent "comet" is not supported in /converse');
        const cfg = AGENTS[name];
        if (!cfg) return errorResponse(400, `Unknown agent: ${agents[i]}`);
        if (!cfg.caller) return errorResponse(400, `Agent ${agents[i]} has no API caller`);
        agents[i] = name;
      }

      const actualTurns = Math.min(turns, max_turns);
      const threadId = thread_tag || `converse-${crypto.randomUUID().slice(0, 8)}`;
      const startedAtISO = new Date().toISOString();
      const transcript = [];
      const transcriptMessages = [];
      let currentMessage = seed;

      // Hydrate all system prompts upfront
      const systemPrompts = {};
      for (const name of agents) {
        systemPrompts[name] = await hydrateAgent(name, AGENTS[name], env);
      }

      // Initiative + overlay helpers
      function weightedOrderWithoutReplacement(agentIds, weights) {
        const remaining = [...agentIds];
        const order = [];
        while (remaining.length) {
          const total = remaining.reduce((sum, a) => sum + Math.max(0, weights[a] ?? 1), 0);
          let r = Math.random() * (total || 1);
          let pickedIndex = 0;
          for (let i = 0; i < remaining.length; i++) {
            r -= Math.max(0, weights[remaining[i]] ?? 1);
            if (r <= 0) { pickedIndex = i; break; }
          }
          order.push(remaining.splice(pickedIndex, 1)[0]);
        }
        return order;
      }

      function computeContextualWeights({ agents, initiative, contextText }) {
        const base = initiative?.base_weights || {};
        const topicBoost = initiative?.topic_boost ?? 1.0;
        const waypointBoost = initiative?.waypoint_boost ?? 0.35;

        const weights = Object.fromEntries(agents.map(a => [a, base[a] ?? 1]));
        const ctxLower = (contextText || "").toLowerCase();

        const keywordBoosts = [
          { match: ["ethic", "harm", "policy", "consent", "privacy", "risk"], agent: "mephistopheles", add: 0.8 },
          { match: ["design", "structure", "system", "architecture", "protocol"], agent: "claude", add: 0.5 },
          { match: ["build", "implement", "code", "refactor", "api", "bug"], agent: "orion", add: 0.6 },
          { match: ["creative", "metaphor", "myth", "voice", "style"], agent: "triptych", add: 0.5 },
        ];

        for (const rule of keywordBoosts) {
          if (!agents.includes(rule.agent)) continue;
          if (rule.match.some(k => ctxLower.includes(k))) {
            weights[rule.agent] = (weights[rule.agent] ?? 1) + rule.add * topicBoost;
          }
        }

        const surfaced = parietalOverlay(contextText || "");
        const waypointAgentMap = {
          "waypoint.relative.key.sonnet": "claude",
          "waypoint.playbook": "mephistopheles",
          "waypoint.glass.journal": "mephistopheles",
          "waypoint.siddhartha": "orion",
          "waypoint.hq.incoming_chunks": "orion",
          "waypoint.atlas.core": "claude",
          "waypoint.atlas.session_archives": "claude",
          "waypoint.constellation.hub": "triptych",
        };

        for (const w of surfaced) {
          const a = waypointAgentMap[w];
          if (a && agents.includes(a)) {
            weights[a] = (weights[a] ?? 1) + waypointBoost;
          }
        }

        return { weights, surfaced };
      }

      function rollInitiativeOrderContextual(agentIds, initiative, contextText) {
        const { weights, surfaced } = computeContextualWeights({ agents: agentIds, initiative, contextText });
        const order = weightedOrderWithoutReplacement(agentIds, weights);
        return { order, weights, surfaced };
      }

      function applyAgentLens(agentName, sharedSurfaced) {
        const lensPriority = {
          claude: new Set([
            "waypoint.relative.key.sonnet",
            "waypoint.atlas.core",
            "waypoint.atlas.session_archives",
          ]),
          orion: new Set([
            "waypoint.siddhartha",
            "waypoint.hq.incoming_chunks",
            "waypoint.atlas.core",
          ]),
          triptych: new Set([
            "waypoint.constellation.hub",
            "waypoint.atlas.core",
          ]),
          mephistopheles: new Set([
            "waypoint.playbook",
            "waypoint.glass.journal",
          ]),
        };

        const pri = lensPriority[agentName] || new Set();
        const preferred = [];
        const rest = [];
        for (const w of sharedSurfaced) {
          (pri.has(w) ? preferred : rest).push(w);
        }
        return [...preferred, ...rest];
      }

      for (let round = 1; round <= actualTurns; round++) {
        const contextText = [
          `Seed:\n${seed}`,
          `---`,
          ...transcriptMessages
            .slice(-max_context_messages)
            .map(m => `${m.epithet}: ${String(m.text).slice(0, 600)}`)
        ].join("\n");

        let orderThisRound = [...agents];
        let weightsThisRound = null;
        let partyNodes = [];

        const initType = String(initiative?.type || "contextual_weighted_each_round");

        if (initType === "contextual_weighted_each_round") {
          const rolled = rollInitiativeOrderContextual(agents, initiative, contextText);
          orderThisRound = rolled.order;
          weightsThisRound = rolled.weights;
          partyNodes = rolled.surfaced || [];
        } else if (initType === "fixed") {
          orderThisRound = [...agents];
          partyNodes = parietalOverlay(contextText);
        } else if (initType === "random_each_round") {
          const equal = Object.fromEntries(agents.map(a => [a, 1]));
          orderThisRound = weightedOrderWithoutReplacement(agents, equal);
          partyNodes = parietalOverlay(contextText);
        } else {
          const rolled = rollInitiativeOrderContextual(agents, initiative, contextText);
          orderThisRound = rolled.order;
          weightsThisRound = rolled.weights;
          partyNodes = rolled.surfaced || [];
        }

        if (rotate_start && initType === "fixed") {
          const shift = (round - 1) % orderThisRound.length;
          orderThisRound = [...orderThisRound.slice(shift), ...orderThisRound.slice(0, shift)];
        }

        transcript.push({
          round,
          initiative: { type: initType, order: orderThisRound, weights: weightsThisRound },
          party_overlay: { label: "Salient nodes in The Constellation (shared)", nodes: partyNodes },
          ts: new Date().toISOString()
        });

        for (const agentName of orderThisRound) {
          const agentConfig = AGENTS[agentName];
          const lensed = applyAgentLens(agentName, partyNodes);
          const cappedParty = (partyNodes || []).slice(0, 8);
          const cappedLens = (lensed || []).slice(0, 8);

          const overlayPrompt =
            (cappedParty.length || cappedLens.length)
              ? `\n\nSalient nodes in The Constellation (shared):\n- ${cappedParty.join("\n- ")}\n` +
                `Salient nodes in The Constellation (your lens):\n- ${cappedLens.join("\n- ")}\n` +
                `Use these nodes to guide framing, constraints, and retrieval cues.`
              : "";

          const transcriptContext = transcriptMessages.length
            ? `\n\nTranscript so far (most recent last):\n` +
              transcriptMessages
                .slice(-max_context_messages)
                .map(m => `${m.epithet}: ${String(m.text).slice(0, 400)}`)
                .join("\n")
            : "";

          const roundAnchor = include_seed_each_round
            ? `\n\nRound anchor / goal (seed):\n${seed}`
            : "";

          const prompt =
            mode === "baton"
              ? `${currentMessage}${roundAnchor}${overlayPrompt}${transcriptContext}`
              : `You are speaking in a multi-agent roundtable.\n` +
                `Round: ${round}/${actualTurns}\n` +
                `Initiative order this round: ${orderThisRound.join(", ")}\n` +
                `${roundAnchor}` +
                `${overlayPrompt}` +
                `${transcriptContext}` +
                `\n\nYour task: add your contribution for this round. Be coherent with the transcript.`;

          let response;
          try {
            if (agentName === "claude") response = await callClaude(prompt, systemPrompts[agentName], env.ANTHROPIC_API_KEY);
            else if (agentName === "orion") response = await callOpenAI(prompt, systemPrompts[agentName], env.OPENAI_API_KEY);
            else if (agentName === "triptych") response = await callGoogle(prompt, systemPrompts[agentName], env.GOOGLE_API_KEY);
            else if (agentName === "mephistopheles") response = await callDeepSeek(prompt, systemPrompts[agentName], env.DEEPSEEK_API_KEY);
          } catch (e) {
            return errorResponse(502, `Agent ${agentName} failed on round ${round}: ${e.message}`);
          }

          const msgTs = new Date().toISOString();

          ctx.waitUntil(writeBackToHearth(env, {
            agentName,
            epithet: agentConfig.epithet,
            request: seed,
            response,
            threadId,
            ts: msgTs
          }));

          transcript.push({
            round,
            agent: agentName,
            epithet: agentConfig.epithet,
            initiative_order: orderThisRound,
            response,
            ts: msgTs,
            party_nodes: cappedParty,
            lens_nodes: cappedLens
          });

          transcriptMessages.push({
            round,
            agent: agentName,
            epithet: agentConfig.epithet,
            text: response,
            ts: msgTs,
            party_nodes: cappedParty,
            lens_nodes: cappedLens
          });

          if (mode === "baton") currentMessage = response;
        }
      }

      const turnCount = transcript.filter(t => t && t.agent).length;
      const lastEventAtISO = transcriptMessages.length
        ? (transcriptMessages[transcriptMessages.length - 1].ts || new Date().toISOString())
        : startedAtISO;

      const envelope = buildCampfireEnvelope({
        threadId,
        turnCount,
        lastEventAtISO,
        agents,
        mode,
        initiative
      });

      const event_id = await sha256Hex(JSON.stringify(envelope));

      const partyNodesUnion = Array.from(new Set(
        transcriptMessages.flatMap(m => Array.isArray(m.party_nodes) ? m.party_nodes : [])
      )).slice(0, 24);

      const receipts = buildReceiptsCampfire({
        seed,
        transcript,
        shared_nodes: partyNodesUnion
      });

      const raw_payload = JSON.stringify({
        envelope,
        seed,
        transcript,
        transcript_messages: transcriptMessages
      });

      const title = `Converse • ${agents.join(" ↔ ")} • ${seed.slice(0, 80)}`;

      const properties = notionCampfireProperties({
        title,
        thread_id: threadId,
        initiated_by,
        participants: agents,
        status,
        source,
        mode,
        initiative_type: String(initiative?.type || "contextual_weighted_each_round"),
        started_at: startedAtISO,
        last_event_at: lastEventAtISO,
        ended_at: null,
        turn_count: turnCount,
        truncated: raw_payload.length > 18000 || receipts.length >= 17950,
        receipts,
        raw_payload,
        event_id,
        version
      });

      const upsertResult = await notionCampfireUpsert(env, {
        threadId,
        properties,
        event_id
      });

      const discordPayload = [
        `🗣️ **Constellation Conversation** | \`${threadId}\``,
        `**Agents:** ${agents.map(a => AGENTS[a].epithet).join(" ↔ ")}`,
        `**Rounds:** ${actualTurns}`,
        `**Mode:** ${mode} | **Initiative:** ${String(initiative?.type || "contextual_weighted_each_round")}`,
        `**Seed:** ${seed.slice(0, 200)}`,
        partyNodesUnion.length ? `**Salient nodes in The Constellation (shared):** ${partyNodesUnion.join(", ")}` : null,
        `---`,
        ...transcript
          .filter(t => t && t.agent)
          .map(t => `**[R${t.round}] ${t.epithet}:**\n${String(t.response).slice(0, 600)}`)
      ].filter(Boolean).join("\n").slice(0, 3800);

      const shouldDiscord = !(upsertResult.skipped && skip_discord_on_idempotent);

      if (shouldDiscord) {
        ctx.waitUntil(dispatchToDiscord(env, {
          source: `converse:${agents.join("↔")}`,
          trigger: "T2",
          agentId: agents[0],
          payload: discordPayload,
          ts: startedAtISO,
          webhook_url: env.CAMPFIRE_WEBHOOK_URL
        }));
      }

      // ── D1 write-back for /converse ──────────────────────────
      ctx.waitUntil((async () => {
        const tId = await threadOpen(DB, {
          id: threadId,
          name: `Campfire • ${agents.join(" ↔ ")} • ${seed.slice(0, 60)}`,
          goal: seed,
          participants: agents,
          source: "campfire",
          initiatedBy: initiated_by
        });
        const sId = await sessionOpen(DB, {
          threadId: tId, source: "campfire", seed, mode, agent: agents[0]
        });
        let tNum = 0;
        for (const turn of transcript) {
          if (!turn || !turn.agent) continue;
          tNum++;
          const trId = await traceWrite(DB, {
            sessionId: sId, threadId: tId,
            agent: turn.agent, epithet: turn.epithet,
            role: "assistant", triggerType: "T2",
            request: seed, response: turn.response,
            roundNumber: turn.round, turnNumber: tNum,
            partyNodes: turn.party_nodes,
            model: AGENTS[turn.agent]?.model
          });
          // harvey → each agent edge
          await edgeRecord(DB, {
            threadId: tId, sessionId: sId, traceId: trId,
            fromAgent: "harvey", toAgent: turn.agent,
            intent: "campfire", trigger: "T2"
          });
        }
        // inter-agent edges within each round
        const byRound = {};
        for (const turn of transcript) {
          if (!turn || !turn.agent) continue;
          if (!byRound[turn.round]) byRound[turn.round] = [];
          byRound[turn.round].push(turn.agent);
        }
        for (const roundAgents of Object.values(byRound)) {
          for (let i = 0; i < roundAgents.length - 1; i++) {
            await edgeRecord(DB, {
              threadId: tId,
              fromAgent: roundAgents[i], toAgent: roundAgents[i + 1],
              intent: "roundtable", trigger: "T2"
            });
          }
        }
        await sessionClose(DB, sId, { turnCount: tNum });
        await threadTick(DB, tId, { turns: tNum, sessions: 1 });
      })());

      return jsonResponse({
        ok: true,
        thread_id: threadId,
        agents: agents.map(a => ({ id: a, epithet: AGENTS[a].epithet })),
        rounds: actualTurns,
        mode,
        initiative: { type: String(initiative?.type || "contextual_weighted_each_round") },
        rotate_start,
        started_at: startedAtISO,
        last_event_at: lastEventAtISO,
                transcript,
        campfire: {
          event_id,
          notion: upsertResult,
          discord_sent: shouldDiscord
        }
      });
    }

    // ══ Conversation Graph Routes (D1) ══════════════════════════════════════

    // — Open / retrieve a thread (POST /thread)
    if (method === "POST" && pathname === "/thread") {
      let body;
      try { body = await request.json(); } catch { return errorResponse(400, "Invalid JSON body"); }
      const { id, name, goal, participants, source: tSrc, meta } = body;
      if (!name && !id) return errorResponse(400, "Missing: name or id");
      if (!DB) return errorResponse(503, "D1 not bound — set DB binding in wrangler.toml");
      const tId = await threadOpen(DB, { id, name, goal, participants, source: tSrc, meta });
      if (!tId) return errorResponse(500, "Thread open failed");
      const thread = await threadGet(DB, tId);
      return jsonResponse({ ok: true, thread });
    }

    // — Get thread + recent traces + graph (GET /thread/:id)
    if (method === "GET" && pathname.match(/^\/thread\/[^/]+$/) && !pathname.endsWith("/graph")) {
      const tId = pathname.replace("/thread/", "").split("/")[0];
      if (!DB) return errorResponse(503, "D1 not bound");
      const thread = await threadGet(DB, tId);
      if (!thread) return errorResponse(404, `Thread not found: ${tId}`);
      const traces = await traceList(DB, { threadId: tId, limit: 100 });
      const graph = await graphGet(DB, tId);
      return jsonResponse({ ok: true, thread, traces, graph });
    }

    // — Get conversation graph for a thread (GET /thread/:id/graph)
    if (method === "GET" && pathname.match(/^\/thread\/[^/]+\/graph$/)) {
      const tId = pathname.replace("/thread/", "").replace("/graph", "");
      if (!DB) return errorResponse(503, "D1 not bound");
      const graph = await graphGet(DB, tId);
      return jsonResponse({ ok: true, thread_id: tId, ...graph });
    }

    // — List threads (GET /threads)
    if (method === "GET" && pathname === "/threads") {
      if (!DB) return errorResponse(503, "D1 not bound");
      const params = new URL(request.url).searchParams;
      const threads = await threadList(DB, {
        status: params.get("status") ?? undefined,
        limit: parseInt(params.get("limit") ?? "20", 10)
      });
      return jsonResponse({ ok: true, count: threads.length, threads });
    }

    // — Agent conversation graph (GET /graph/:agent)
    if (method === "GET" && pathname.startsWith("/graph/")) {
      const agentKey = pathname.replace("/graph/", "").trim();
      if (!agentKey) return errorResponse(400, "Missing agent key");
      if (!DB) return errorResponse(503, "D1 not bound");
      const graph = await agentGraph(DB, agentKey);
      const state = await agentStateGet(DB, agentKey);
      return jsonResponse({ ok: true, agent: agentKey, state, ...graph });
    }

    // — List recent sessions (GET /sessions)
    if (method === "GET" && pathname === "/sessions") {
      if (!DB) return errorResponse(503, "D1 not bound");
      const params = new URL(request.url).searchParams;
      const sessions = await sessionList(DB, {
        agent: params.get("agent") ?? undefined,
        threadId: params.get("thread_id") ?? undefined,
        limit: parseInt(params.get("limit") ?? "20", 10)
      });
      return jsonResponse({ ok: true, count: sessions.length, sessions });
    }

    // — Get a session + its traces (GET /session/:id)
    if (method === "GET" && pathname.startsWith("/session/")) {
      const sId = pathname.replace("/session/", "").trim();
      if (!DB) return errorResponse(503, "D1 not bound");
      const session = await sessionGet(DB, sId);
      if (!session) return errorResponse(404, `Session not found: ${sId}`);
      const traces = await traceList(DB, { sessionId: sId, limit: 200 });
      return jsonResponse({ ok: true, session, traces });
    }

    // — All agent state (GET /agents/state)
    if (method === "GET" && pathname === "/agents/state") {
      if (!DB) return errorResponse(503, "D1 not bound");
      const states = await agentStateGet(DB);
      return jsonResponse({ ok: true, agents: states });
    }

    // ── PvE Debate Engine (POST /debate) ─────────────────────
    // Routes to MindBridge Router's /v1/debate endpoint for structured
    // philosophical debates with cast personas, reasoning chains, and scoring.
    if (method === "POST" && pathname === "/debate") {
      const ROUTER_URL = env.MINDBRIDGE_ROUTER_URL;
      const ROUTER_KEY = env.MINDBRIDGE_API_KEY;
      if (!ROUTER_URL || !ROUTER_KEY)
        return errorResponse(500, "MINDBRIDGE_ROUTER_URL or MINDBRIDGE_API_KEY not configured. Set via wrangler secret.");

      let body;
      try { body = await request.json(); }
      catch { return errorResponse(400, "Invalid JSON body"); }

      if (!body.seed) return errorResponse(400, "seed is required — the opening claim to debate");

      try {
        const resp = await fetch(`${ROUTER_URL}/v1/debate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ROUTER_KEY}`,
          },
          body: JSON.stringify(body),
        });

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
          return errorResponse(resp.status, `MindBridge debate error: ${JSON.stringify(errData)}`);
        }

        const data = await resp.json();
        const ts = new Date().toISOString();

        // Log to Discord
        if (data.turns && data.turns.length) {
          const formatted = data.turns.map(t =>
            `**[${String(t.speaker).toUpperCase()} — ${t.role}]**\n${String(t.argument).slice(0, 400)}`
          ).join("\n\n---\n\n");
          ctx.waitUntil(dispatchToDiscord(env, {
            source: `pve-debate:${data.debate_id || "unknown"}`,
            trigger: "T3",
            agentId: "constellation",
            payload: `🎭 **PvE Debate Complete**\n**Paper:** ${body.paper_title || "untitled"}\n**Mode:** ${body.mode || "prosecution"}\n**Turns:** ${data.turns.length}\n---\n${formatted.slice(0, 1600)}`,
            ts
          }));
        }

        // Log structured test scores if present
        if (data.test_scores && data.test_scores.length) {
          const scoresSummary = data.test_scores
            .filter(s => s.assessment)
            .map(s => `${s.speaker} Q${s.question_number}: ${s.assessment}`)
            .join(" | ");
          ctx.waitUntil(dispatchToDiscord(env, {
            source: `pve-test:${data.debate_id || "unknown"}`,
            trigger: "T3",
            agentId: "constellation",
            payload: `📊 **PvE Structured Test Scores**\n${scoresSummary.slice(0, 1800)}`,
            ts
          }));
        }

        // Hearth write-back
        if (data.strongest_objection) {
          ctx.waitUntil(writeBackToHearth(env, {
            agentName: "constellation",
            epithet: "PvE Debate Engine",
            request: body.seed,
            response: `Strongest objection: ${data.strongest_objection}. Productive tension: ${data.productive_tension || "pending"}.`,
            threadId: data.debate_id,
            ts
          }));
        }

        return jsonResponse(data);
      } catch (e) {
        return errorResponse(502, `MindBridge debate call failed: ${e.message}`);
      }
    }

    return errorResponse(404, `Route not found: ${method} ${pathname}. GET / for manifest.`);
  }
};

export default siddartha_hydrated_default;