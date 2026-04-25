const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

const MEM0_SEARCH_URL = "https://api.mem0.ai/v2/memories/search/";

const AGENT_PROFILES = {
  claude: {
    canonical: "claude",
    epithet: "The Gnostic Architect",
    supplemental: "letta"
  },
  triptych: {
    canonical: "triptych",
    epithet: "The Triptych",
    supplemental: "notion"
  },
  comet: {
    canonical: "comet",
    epithet: "The Courier",
    supplemental: "none"
  },
  orion: {
    canonical: "orion",
    epithet: "The Foundry Keep",
    supplemental: "none"
  },
  mephistopheles: {
    canonical: "mephistopheles",
    epithet: "The Adversary",
    supplemental: "none"
  }
};

const AGENT_ALIASES = {
  gemini: "triptych",
  perplexity: "comet",
  rostam: "claude"
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS }
  });
}

function resolveAgent(inputAgent) {
  const normalized = String(inputAgent || "").trim().toLowerCase();
  if (!normalized) return null;
  if (AGENT_PROFILES[normalized]) return normalized;
  const alias = AGENT_ALIASES[normalized];
  if (alias && AGENT_PROFILES[alias]) return alias;
  return null;
}

async function fetchSharedMemories({ userId, query, topK, env }) {
  const token = env.MEM0_API_KEY || "";
  if (!token) {
    return {
      source: "mem0_shared",
      status: "degraded",
      reason: "MEM0_API_KEY_missing",
      records: []
    };
  }

  try {
    const res = await fetch(MEM0_SEARCH_URL, {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        filters: { user_id: userId },
        top_k: topK
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        source: "mem0_shared",
        status: "degraded",
        reason: `mem0_http_${res.status}`,
        records: []
      };
    }

    const results = Array.isArray(data) ? data : data.results || [];
    const records = results
      .map((r) => ({
        id: r.id || null,
        text: r.memory || r.content || "",
        score: r.score ?? null,
        metadata: r.metadata || {}
      }))
      .filter((r) => r.text);

    return {
      source: "mem0_shared",
      status: "ok",
      reason: null,
      records
    };
  } catch (error) {
    return {
      source: "mem0_shared",
      status: "degraded",
      reason: `mem0_exception_${error.message}`,
      records: []
    };
  }
}

async function fetchSupplementalMemories({ canonicalAgent, userId, query, topK, env }) {
  if (canonicalAgent === "claude") {
    const url = env.LETTA_SUPPLEMENTAL_URL || "";
    if (!url) {
      return {
        source: "letta",
        status: "degraded",
        reason: "LETTA_SUPPLEMENTAL_URL_missing",
        records: []
      };
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(env.LETTA_API_KEY ? { "Authorization": `Bearer ${env.LETTA_API_KEY}` } : {})
        },
        body: JSON.stringify({
          agent: canonicalAgent,
          user_id: userId,
          query,
          top_k: topK
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          source: "letta",
          status: "degraded",
          reason: `letta_http_${res.status}`,
          records: []
        };
      }
      const base = Array.isArray(data) ? data : data.results || data.memories || [];
      const records = base
        .map((item) => ({ text: item.memory || item.content || item.text || "", metadata: item.metadata || {} }))
        .filter((item) => item.text);
      return { source: "letta", status: "ok", reason: null, records };
    } catch (error) {
      return {
        source: "letta",
        status: "degraded",
        reason: `letta_exception_${error.message}`,
        records: []
      };
    }
  }

  if (canonicalAgent === "triptych") {
    const url = env.NOTION_SUPPLEMENTAL_URL || "";
    if (!url) {
      return {
        source: "notion_mcp",
        status: "degraded",
        reason: "NOTION_SUPPLEMENTAL_URL_missing",
        records: []
      };
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(env.NOTION_SUPPLEMENTAL_TOKEN ? { "Authorization": `Bearer ${env.NOTION_SUPPLEMENTAL_TOKEN}` } : {})
        },
        body: JSON.stringify({
          agent: canonicalAgent,
          user_id: userId,
          query,
          top_k: topK
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          source: "notion_mcp",
          status: "degraded",
          reason: `notion_http_${res.status}`,
          records: []
        };
      }
      const base = Array.isArray(data) ? data : data.results || data.memories || [];
      const records = base
        .map((item) => ({ text: item.memory || item.content || item.text || "", metadata: item.metadata || {} }))
        .filter((item) => item.text);
      return { source: "notion_mcp", status: "ok", reason: null, records };
    } catch (error) {
      return {
        source: "notion_mcp",
        status: "degraded",
        reason: `notion_exception_${error.message}`,
        records: []
      };
    }
  }

  return {
    source: "supplemental",
    status: "ok",
    reason: "no_supplemental_required",
    records: []
  };
}

async function buildManifest({ requestedAgent, userId, query, topK, env }) {
  const canonicalAgent = resolveAgent(requestedAgent);
  if (!canonicalAgent) {
    return {
      ok: false,
      error: `Unknown agent: ${requestedAgent}`
    };
  }

  const profile = AGENT_PROFILES[canonicalAgent];
  const [shared, supplemental] = await Promise.all([
    fetchSharedMemories({ userId, query, topK, env }),
    fetchSupplementalMemories({ canonicalAgent, userId, query, topK, env })
  ]);

  const degraded = shared.status !== "ok" || supplemental.status !== "ok";
  const hydrationToken = crypto.randomUUID();

  return {
    ok: true,
    hydration_token: hydrationToken,
    manifest: {
      manifest_version: "1.0.0",
      generated_at: new Date().toISOString(),
      user_id: userId,
      requested_agent: String(requestedAgent || "").toLowerCase(),
      canonical_agent: canonicalAgent,
      identity: {
        epithet: profile.epithet
      },
      degraded,
      sources: [
        {
          source: shared.source,
          status: shared.status,
          reason: shared.reason,
          count: shared.records.length
        },
        {
          source: supplemental.source,
          status: supplemental.status,
          reason: supplemental.reason,
          count: supplemental.records.length
        }
      ],
      context_blocks: {
        shared_semantic: shared.records,
        supplemental: supplemental.records
      }
    }
  };
}

function composeSystemPrompt(manifest) {
  const identity = manifest.identity?.epithet || "Constellation member";
  const sharedLines = (manifest.context_blocks?.shared_semantic || [])
    .slice(0, 8)
    .map((item) => `- ${item.text}`)
    .join("\n");
  const supplementalLines = (manifest.context_blocks?.supplemental || [])
    .slice(0, 8)
    .map((item) => `- ${item.text}`)
    .join("\n");

  return [
    `You are ${identity} in Harvey's Constellation within soulOS.`,
    "Hydration context has been assembled by Coleco.",
    manifest.degraded
      ? "Some memory sources degraded during hydration. Continue with available context and do not fabricate missing memory."
      : "Hydration completed across all configured memory sources.",
    "",
    "Shared semantic memory:",
    sharedLines || "- No shared semantic context available.",
    "",
    "Supplemental memory:",
    supplementalLines || "- No supplemental context available."
  ].join("\n");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return jsonResponse({
        service: "coleco",
        status: "ok",
        version: "0.1.0",
        configured: {
          mem0: Boolean(env.MEM0_API_KEY),
          letta_supplemental: Boolean(env.LETTA_SUPPLEMENTAL_URL),
          notion_supplemental: Boolean(env.NOTION_SUPPLEMENTAL_URL)
        }
      });
    }

    if (request.method === "POST" && (url.pathname === "/api/manifest" || url.pathname === "/api/hydrate")) {
      let body;
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: "Invalid JSON body" }, 400);
      }

      const requestedAgent = body.agent;
      const userId = body.user_id || "harvey";
      const query = body.query || `hydrate ${requestedAgent || "agent"} constellation context`;
      const topK = Number(body.top_k || 12);

      if (!requestedAgent) {
        return jsonResponse({ error: "agent is required" }, 400);
      }

      const result = await buildManifest({
        requestedAgent,
        userId,
        query,
        topK,
        env
      });

      if (!result.ok) {
        return jsonResponse({ error: result.error }, 400);
      }

      if (url.pathname === "/api/manifest") {
        return jsonResponse({
          hydration_token: result.hydration_token,
          manifest: result.manifest
        });
      }

      return jsonResponse({
        hydration_token: result.hydration_token,
        manifest: result.manifest,
        system_prompt: composeSystemPrompt(result.manifest)
      });
    }

    return jsonResponse({ error: "Not found" }, 404);
  }
};
