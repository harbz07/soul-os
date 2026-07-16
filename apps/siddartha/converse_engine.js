// converse_engine.js — Constellation Conversational Turn Engine
//
// Owns: POST /converse
//   - Multi-agent roundtable and baton-pass conversation modes
//   - Contextual weighted initiative system
//   - Parietal overlay + per-agent lens
//   - Campfire Notion upsert (idempotent, KV-ledgered)
//   - D1 write-back (threads, sessions, traces, edges)
//   - Discord dispatch
//
// Dependency contract (injected, never imported at module scope):
//   callAgent(agentName, agentConfig, prompt, systemPrompt, env) → Promise<string>
//   AGENTS       — the registry object from siddartha.js
//   hydrateAgent — memory hydration helper from siddartha.js
//   parietalOverlay — waypoint surfacing helper from siddartha.js
//   writeBackToHearth — mem0 write-back helper from siddartha.js
//   dispatchToDiscord — Discord webhook helper from siddartha.js
//   D1 helpers   — imported directly from ./d1.js (env-explicit, no module state)
//
// Workers safety: no top-level env-derived state. env is passed explicitly
// through every call. Isolate-persistent module scope holds only pure
// functions and constants — safe across requests.

import {
  sessionOpen, sessionClose,
  traceWrite,
  threadOpen, threadTick,
  edgeRecord
} from "./d1.js";

// ── Campfire helpers (converse-exclusive — grep confirmed no other consumers) ─

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
  return {
    v: 1,
    thread_id: threadId,
    turn_count: turnCount,
    last_event_at: lastEventAtISO,
    participants: [...new Set(agents)].map(a => String(a).toLowerCase()).sort(),
    mode: String(mode || "rounds"),
    initiative_type: String(initiative?.type || "contextual_weighted_each_round"),
  };
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
      return [
        `clause: ${evidence}`,
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
  title, thread_id, initiated_by, participants, status, source, mode,
  initiative_type, started_at, last_event_at, ended_at, turn_count,
  truncated, receipts, raw_payload, event_id, version
}) {
  const props = {
    "Question":              { title: [{ text: { content: String(title).slice(0, 200) } }] },
    "Thread":                { rich_text: [{ text: { content: String(thread_id).slice(0, 200) } }] },
    "Initiated By":          { select: { name: String(initiated_by || "Harvey") } },
    "Participants":          { multi_select: (participants || []).map(p => ({ name: String(p) })) },
    "Status":                { select: { name: String(status || "Open") } },
    "Source":                { select: { name: String(source || "workers") } },
    "Mode":                  { select: { name: String(mode || "rounds") } },
    "Initiative Type":       { select: { name: String(initiative_type || "contextual_weighted_each_round") } },
    "Started At":            started_at ? { date: { start: started_at } } : undefined,
    "Last Event At":         last_event_at ? { date: { start: last_event_at } } : undefined,
    "Ended At":              ended_at ? { date: { start: ended_at } } : undefined,
    "Turn Count":            { number: Number(turn_count || 0) },
    "Truncated":             { checkbox: !!truncated },
    "Receipts":              { rich_text: [{ text: { content: String(receipts || "").slice(0, 18000) } }] },
    "Webhook Payload (raw)": { rich_text: [{ text: { content: String(raw_payload || "").slice(0, 18000) } }] },
    "Event Id / Checksum":   { rich_text: [{ text: { content: String(event_id || "").slice(0, 200) } }] },
    "Version":               { rich_text: [{ text: { content: String(version || "campfire.v1").slice(0, 50) } }] }
  };
  return cleanUndefined(props);
}

async function notionCampfireUpsert(env, { threadId, properties, event_id }) {
  if (!env.CAMPFIRE_LEDGER)            return { ok: false, error: "CAMPFIRE_LEDGER KV not bound" };
  if (!env.NOTION_TOKEN)               return { ok: false, error: "NOTION_TOKEN not configured" };
  if (!env.NOTION_CAMPFIRE_TALKS_DB_ID) return { ok: false, error: "NOTION_CAMPFIRE_TALKS_DB_ID not configured" };

  const lastEventKey = `campfire:thread:${threadId}:last_event_id`;
  const pageIdKey    = `campfire:thread:${threadId}:page_id`;

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

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    },
    body: JSON.stringify({ parent: { database_id: env.NOTION_CAMPFIRE_TALKS_DB_ID }, properties })
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.message || "Notion create error" };

  await env.CAMPFIRE_LEDGER.put(pageIdKey, data.id);
  await env.CAMPFIRE_LEDGER.put(lastEventKey, event_id);
  return { ok: true, skipped: false, page_id: data.id, notion_id: data.id };
}

// ── Initiative helpers ────────────────────────────────────────────────────────

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

function computeContextualWeights({ agents, initiative, contextText, parietalOverlay }) {
  const base         = initiative?.base_weights || {};
  const topicBoost   = initiative?.topic_boost ?? 1.0;
  const waypointBoost = initiative?.waypoint_boost ?? 0.35;

  const weights  = Object.fromEntries(agents.map(a => [a, base[a] ?? 1]));
  const ctxLower = (contextText || "").toLowerCase();

  const keywordBoosts = [
    { match: ["ethic", "harm", "policy", "consent", "privacy", "risk"],          agent: "mephistopheles", add: 0.8 },
    { match: ["design", "structure", "system", "architecture", "protocol"],       agent: "claude",         add: 0.5 },
    { match: ["build", "implement", "code", "refactor", "api", "bug"],            agent: "orion",          add: 0.6 },
    { match: ["creative", "metaphor", "myth", "voice", "style"],                  agent: "triptych",       add: 0.5 },
  ];

  for (const rule of keywordBoosts) {
    if (!agents.includes(rule.agent)) continue;
    if (rule.match.some(k => ctxLower.includes(k))) {
      weights[rule.agent] = (weights[rule.agent] ?? 1) + rule.add * topicBoost;
    }
  }

  const surfaced = parietalOverlay(contextText || "");
  const waypointAgentMap = {
    "waypoint.relative.key.sonnet":    "claude",
    "waypoint.playbook":               "mephistopheles",
    "waypoint.glass.journal":          "mephistopheles",
    "waypoint.siddhartha":             "orion",
    "waypoint.hq.incoming_chunks":     "orion",
    "waypoint.atlas.core":             "claude",
    "waypoint.atlas.session_archives": "claude",
    "waypoint.constellation.hub":      "triptych",
  };

  for (const w of surfaced) {
    const a = waypointAgentMap[w];
    if (a && agents.includes(a)) {
      weights[a] = (weights[a] ?? 1) + waypointBoost;
    }
  }

  return { weights, surfaced };
}

function rollInitiativeOrderContextual(agentIds, initiative, contextText, parietalOverlay) {
  const { weights, surfaced } = computeContextualWeights({ agents: agentIds, initiative, contextText, parietalOverlay });
  const order = weightedOrderWithoutReplacement(agentIds, weights);
  return { order, weights, surfaced };
}

function applyAgentLens(agentName, sharedSurfaced) {
  const lensPriority = {
    claude:          new Set(["waypoint.relative.key.sonnet", "waypoint.atlas.core", "waypoint.atlas.session_archives"]),
    orion:           new Set(["waypoint.siddhartha", "waypoint.hq.incoming_chunks", "waypoint.atlas.core"]),
    triptych:        new Set(["waypoint.constellation.hub", "waypoint.atlas.core"]),
    mephistopheles:  new Set(["waypoint.playbook", "waypoint.glass.journal"]),
  };
  const pri = lensPriority[agentName] || new Set();
  const preferred = [];
  const rest = [];
  for (const w of sharedSurfaced) {
    (pri.has(w) ? preferred : rest).push(w);
  }
  return [...preferred, ...rest];
}

// ── Main export ───────────────────────────────────────────────────────────────
//
// handleConverse(request, env, ctx, deps)
//
// deps = {
//   callAgent,        // (agentName, agentConfig, prompt, systemPrompt, env) → Promise<string>
//   AGENTS,           // registry object
//   hydrateAgent,     // (agentName, agentConfig, env) → Promise<string>
//   parietalOverlay,  // (contextText) → string[]
//   writeBackToHearth,// (env, { agentName, epithet, request, response, threadId, ts }) → Promise<void>
//   dispatchToDiscord,// (env, { source, trigger, agentId, payload, ts, webhook_url }) → Promise<{ok}>
//   jsonResponse,     // (data, status?) → Response
//   errorResponse,    // (status, message) → Response
// }

export async function handleConverse(request, env, ctx, deps) {
  const {
    callAgent, AGENTS, hydrateAgent, parietalOverlay,
    writeBackToHearth, dispatchToDiscord,
    jsonResponse, errorResponse
  } = deps;

  // Bind D1 — passed through env, never cached at module scope
  const DB = env.DB || null;

  let body;
  try { body = await request.json(); }
  catch { return errorResponse(400, "Invalid JSON body"); }

  const {
    agents,
    seed,
    turns = 3,
    thread_tag,
    max_turns = 10,
    mode = "rounds",
    initiative = {
      type: "contextual_weighted_each_round",
      base_weights: { claude: 1.1, orion: 1.0, triptych: 0.9, mephistopheles: 1.2 },
      topic_boost: 1.0,
      waypoint_boost: 0.35
    },
    rotate_start = false,
    include_seed_each_round = true,
    max_context_messages = 12,
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

  // Validate agents
  for (let i = 0; i < agents.length; i++) {
    const name = String(agents[i]).toLowerCase();
    if (name === "comet")
      return errorResponse(400, 'Agent "comet" is not supported in /converse');
    const cfg = AGENTS[name];
    if (!cfg)         return errorResponse(400, `Unknown agent: ${agents[i]}`);
    if (!cfg.caller)  return errorResponse(400, `Agent ${agents[i]} has no API caller`);
    agents[i] = name;
  }

  const actualTurns    = Math.min(turns, max_turns);
  const threadId       = thread_tag || `converse-${crypto.randomUUID().slice(0, 8)}`;
  const startedAtISO   = new Date().toISOString();
  const transcript     = [];
  const transcriptMessages = [];
  let currentMessage   = seed;

  // Hydrate all system prompts upfront
  const systemPrompts = {};
  for (const name of agents) {
    systemPrompts[name] = await hydrateAgent(name, AGENTS[name], env);
  }

  // ── Round loop ────────────────────────────────────────────────────────────
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
      const rolled = rollInitiativeOrderContextual(agents, initiative, contextText, parietalOverlay);
      orderThisRound   = rolled.order;
      weightsThisRound = rolled.weights;
      partyNodes       = rolled.surfaced || [];
    } else if (initType === "fixed") {
      orderThisRound = [...agents];
      partyNodes     = parietalOverlay(contextText);
    } else if (initType === "random_each_round") {
      const equal = Object.fromEntries(agents.map(a => [a, 1]));
      orderThisRound = weightedOrderWithoutReplacement(agents, equal);
      partyNodes     = parietalOverlay(contextText);
    } else {
      const rolled = rollInitiativeOrderContextual(agents, initiative, contextText, parietalOverlay);
      orderThisRound   = rolled.order;
      weightsThisRound = rolled.weights;
      partyNodes       = rolled.surfaced || [];
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
      const agentConfig  = AGENTS[agentName];
      const lensed       = applyAgentLens(agentName, partyNodes);
      const cappedParty  = (partyNodes || []).slice(0, 8);
      const cappedLens   = (lensed || []).slice(0, 8);

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
        response = await callAgent(agentName, agentConfig, prompt, systemPrompts[agentName], env);
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

  // ── Post-round: campfire upsert ───────────────────────────────────────────
  const turnCount       = transcript.filter(t => t && t.agent).length;
  const lastEventAtISO  = transcriptMessages.length
    ? (transcriptMessages[transcriptMessages.length - 1].ts || new Date().toISOString())
    : startedAtISO;

  const envelope = buildCampfireEnvelope({ threadId, turnCount, lastEventAtISO, agents, mode, initiative });
  const event_id = await sha256Hex(JSON.stringify(envelope));

  const partyNodesUnion = Array.from(new Set(
    transcriptMessages.flatMap(m => Array.isArray(m.party_nodes) ? m.party_nodes : [])
  )).slice(0, 24);

  const receipts    = buildReceiptsCampfire({ seed, transcript, shared_nodes: partyNodesUnion });
  const raw_payload = JSON.stringify({ envelope, seed, transcript, transcript_messages: transcriptMessages });
  const title       = `Converse • ${agents.join(" ↔ ")} • ${seed.slice(0, 80)}`;

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

  const upsertResult = await notionCampfireUpsert(env, { threadId, properties, event_id });

  // ── Discord dispatch ──────────────────────────────────────────────────────
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

  // ── D1 write-back ─────────────────────────────────────────────────────────
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
      await edgeRecord(DB, {
        threadId: tId, sessionId: sId, traceId: trId,
        fromAgent: "harvey", toAgent: turn.agent,
        intent: "campfire", trigger: "T2"
      });
    }
    // Inter-agent edges within each round
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
