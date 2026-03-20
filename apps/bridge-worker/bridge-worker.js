// bridge-worker.js

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

const SIDDHARTHA_BASE_URL = "https://siddartha.harveytagalicud7.workers.dev";

// Helper: Fetch with Siddhartha backend
async function callSiddhartha(env, path, method = "POST", body = null, headers = {}) {
  const url = `https://siddhartha.internal${path}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    ...(body && { body: JSON.stringify(body) })
  };
  const res = env?.SIDDARTHA
    ? await env.SIDDARTHA.fetch(new Request(url, options))
    : await fetch(`${SIDDHARTHA_BASE_URL}${path}`, options);
  if (!res.ok) throw new Error(`Siddhartha error: ${res.status}`);
  return res.json();
}

// Helper: Dispatch to Notion/Discord
async function dispatchToNotion(notionToken, notionDbId, source, agentId, payload, trigger = "T1") {
  if (!notionToken || !notionDbId) return { ok: false, error: "Notion not configured" };
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${notionToken}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    },
    body: JSON.stringify({
      parent: { database_id: notionDbId },
      properties: {
        Name: { title: [{ text: { content: `[${trigger}] ${source}` } }] },
        Source: { rich_text: [{ text: { content: source } }] },
        "Agent ID": { rich_text: [{ text: { content: agentId } }] },
        "Trigger Type": { select: { name: trigger } },
        Payload: { rich_text: [{ text: { content: String(payload).slice(0, 2000) } }] },
        Timestamp: { date: { start: new Date().toISOString() } }
      }
    })
  });
  return res.ok ? { ok: true, id: (await res.json()).id } : { ok: false, error: "Notion API error" };
}

async function dispatchToDiscord(discordWebhookUrl, source, agentId, payload, trigger = "T1") {
  if (!discordWebhookUrl) return { ok: false, error: "Discord not configured" };
  const content = `**Siddhartha Bridge**\n**From:** \`${source}\` via \`${agentId}\`\n**Trigger:** ${trigger}\n${String(payload).slice(0, 1900)}`;
  const res = await fetch(discordWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });
  return res.ok ? { ok: true } : { ok: false, error: `Discord HTTP ${res.status}` };
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  }
};

async function handleRequest(request, env, ctx) {
  const {
    MEM0_API_KEY: mem0ApiKey = "",
    NOTION_TOKEN: notionToken = "",
    NOTION_INCOMING_DB_ID: notionIncomingDbId = "",
    DISCORD_WEBHOOK_URL: discordWebhookUrl = ""
  } = env || {};

  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  // CORS preflight
  if (method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  // Health check
  if (method === "GET" && pathname === "/api/health") {
    const discordCheck = discordWebhookUrl
      ? fetch(discordWebhookUrl).then(r => r.ok).catch(() => false)
      : Promise.resolve(false);
    const [siddhartha, notion, discord] = await Promise.allSettled([
      callSiddhartha(env, "/health", "GET").then(() => true).catch(() => false),
      fetch("https://api.notion.com/v1/databases", {
        headers: { "Authorization": `Bearer ${notionToken}`, "Notion-Version": "2022-06-28" }
      }).then(r => r.ok).catch(() => false),
      discordCheck
    ]);
    return new Response(
      JSON.stringify({
        status: "ok",
        bridge: { version: "1.0.0" },
        siddhartha: siddhartha.status === "fulfilled" && siddhartha.value ? "healthy" : "unhealthy",
        notion: notion.status === "fulfilled" && notion.value ? "healthy" : "unhealthy",
        discord: discord.status === "fulfilled" && discord.value ? "healthy" : "unhealthy"
      }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  // Initialize (idempotent)
  if (method === "GET" && pathname === "/api/init") {
    if (!notionToken || !notionIncomingDbId) {
      return new Response(JSON.stringify({ error: "Notion not configured" }), {
        status: 503,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ initialized: true, message: "Bridge initialized" }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    });
  }

  // Chat endpoint (frontend's main endpoint)
  if (method === "POST" && pathname === "/api/chat") {
    let body;
    try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }); }
    const { message, session_id, project_id, loadout_id, skill_hints, metadata } = body;
    if (!message) return new Response(JSON.stringify({ error: "Missing message" }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });

    try {
      // Call Siddhartha's /api/route endpoint
      const siddharthaResponse = await callSiddhartha(env, "/api/route", "POST", {
        userRequest: `@orion:default ${message}`
      });

      // Dispatch to Notion/Discord for observability
      if (ctx) {
        ctx.waitUntil(dispatchToNotion(
          notionToken,
          notionIncomingDbId,
          `frontend→orion`,
          "orion",
          `**Request:** ${message}\n**Response:** ${siddharthaResponse.response}`,
          "T1"
        ));
        ctx.waitUntil(dispatchToDiscord(
          discordWebhookUrl,
          `frontend→orion`,
          "orion",
          `**Request:** ${message}\n**Response:** ${siddharthaResponse.response}`,
          "T1"
        ));
      }

      // Return response in frontend's expected format
      return new Response(
        JSON.stringify({
          trace_id: siddharthaResponse.trace_id,
          session_id: session_id || siddharthaResponse.session_id,
          response: siddharthaResponse.response,
          model: siddharthaResponse.agent,
          token_breakdown: siddharthaResponse.token_breakdown || { system: 0, context: 0, history: 0, user_message: 0, total: 0 },
          skills_activated: siddharthaResponse.epithet ? [siddharthaResponse.epithet] : [],
          memory_items_retrieved: 0,
          consolidation_queued: false
        }),
        { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message, trace_id: null }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }
  }

  // Memory endpoints (forwards to Mem0/KV)
  if (method === "POST" && pathname === "/api/memory") {
    let body;
    try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }); }
    const { content, type = "semantic", scope = "project", tags = [], confidence = 0.8, project_id } = body;
    if (!content) return new Response(JSON.stringify({ error: "Missing content" }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });

    try {
      // Call Mem0 to store memory
      const mem0Res = await fetch("https://api.mem0.ai/v2/memories/", {
        method: "POST",
        headers: {
          "Authorization": `Token ${mem0ApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          memory: content,
          user_id: "harvey",
          metadata: { type, scope, tags, confidence, project_id }
        })
      });
      if (!mem0Res.ok) throw new Error("Mem0 error");

      return new Response(
        JSON.stringify({ id: crypto.randomUUID(), created: true }),
        { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }
  }

  if (method === "GET" && pathname === "/api/memory") {
    const params = new URL(request.url).searchParams;
    const scope = params.get("scope") || "";
    const type = params.get("type") || "";
    const session_id = params.get("session_id") || "";
    const limit = parseInt(params.get("limit") || "20", 10);

    try {
      // Call Mem0 to query memories
      const mem0Res = await fetch("https://api.mem0.ai/v2/memories/search/", {
        method: "POST",
        headers: {
          "Authorization": `Token ${mem0ApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: "harvey",
          filters: { user_id: "harvey", scope, type },
          top_k: limit
        })
      });
      if (!mem0Res.ok) throw new Error("Mem0 error");
      const memories = await mem0Res.json();

      return new Response(
        JSON.stringify({ items: memories.results || [], count: memories.results?.length || 0 }),
        { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }
  }

  if (method === "DELETE" && pathname.startsWith("/api/memory/")) {
    const id = pathname.split("/")[3];
    try {
      // Call Mem0 to delete memory
      const mem0Res = await fetch(`https://api.mem0.ai/v2/memories/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Token ${mem0ApiKey}`,
          "Content-Type": "application/json"
        }
      });
      if (!mem0Res.ok) throw new Error("Mem0 error");

      return new Response(JSON.stringify({ deleted: true }), { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }
  }

  // Traces endpoint (queries Notion)
  if (method === "GET" && pathname === "/api/traces") {
    const params = new URL(request.url).searchParams;
    const session_id = params.get("session_id") || "";
    const limit = parseInt(params.get("limit") || "20", 10);

    try {
      // Query Notion database for traces
      const notionRes = await fetch(`https://api.notion.com/v1/databases/${notionIncomingDbId}/query`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${notionToken}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28"
        },
        body: JSON.stringify({
          page_size: limit,
          filter: session_id ? { property: "Session ID", rich_text: { equals: session_id } } : undefined
        })
      });
      if (!notionRes.ok) throw new Error("Notion error");
      const data = await notionRes.json();
      const traces = data.results.map(page => ({
        trace_id: page.properties["Event Id / Checksum"]?.rich_text?.[0]?.plain_text || page.id,
        session_id: page.properties["Thread"]?.rich_text?.[0]?.plain_text || "",
        request_at: page.properties.Timestamp?.date?.start || "",
        error: page.properties.Payload?.rich_text?.[0]?.plain_text?.includes("Error") ? "error" : null
      }));

      return new Response(
        JSON.stringify({ traces, count: traces.length }),
        { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }
  }

  // Skills endpoint (hardcoded for now)
  if (method === "GET" && pathname === "/api/skills") {
    return new Response(
      JSON.stringify({
        skills: [
          { id: "general", name: "General Assistant", priority: 0, token_budget: 200, enabled: true },
          { id: "code", name: "Code Assistant", priority: 10, token_budget: 300, enabled: true },
          { id: "research", name: "Research Mode", priority: 5, token_budget: 250, enabled: true }
        ]
      }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  // 404 for unknown routes
  return new Response(JSON.stringify({ error: "Route not found" }), {
    status: 404,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
  });
}
