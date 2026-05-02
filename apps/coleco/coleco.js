const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

const MEM0_SEARCH_URL = "https://api.mem0.ai/v2/memories/search/";

const REGISTRY_URL_DEFAULT = "https://raw.githubusercontent.com/harbz07/soul-os/main/constellation/entities.v1.json";
const MAPPINGS_URL_DEFAULT = "https://raw.githubusercontent.com/harbz07/soul-os/main/constellation/mappings.v1.json";
const REGISTRY_CACHE_TTL_MS = 5 * 60 * 1000;

const FALLBACK_REGISTRY = {
  entities: [
    {
      entity_id: "nova",
      role_tier: "primary",
      parent_entity_id: null,
      display_name: "Nova",
      epithet: "The Baseline",
      epithet_aliases: ["chatgpt"],
      operational_aliases: ["nova_gpt"],
      supplemental_source: "nova_baseline",
      memory: { shared_write: true, scoped_write: true, scoped_read: true }
    },
    {
      entity_id: "orion",
      role_tier: "satellite",
      parent_entity_id: "nova",
      display_name: "ORION",
      epithet: "ORION",
      epithet_aliases: ["orion"],
      operational_aliases: ["orion_spec"],
      supplemental_source: "orion_spec",
      memory: { shared_write: false, scoped_write: true, scoped_read: true }
    },
    {
      entity_id: "the_fuckface",
      role_tier: "satellite",
      parent_entity_id: "nova",
      display_name: "The Fuckface",
      epithet: "Boundary Override",
      epithet_aliases: ["fuckface"],
      operational_aliases: [],
      supplemental_source: "the_fuckface_overlay",
      memory: { shared_write: false, scoped_write: true, scoped_read: true }
    },
    {
      entity_id: "claude",
      role_tier: "primary",
      parent_entity_id: null,
      display_name: "Claude",
      epithet: "The Gnostic Architect",
      epithet_aliases: ["rostam"],
      operational_aliases: [],
      supplemental_source: "letta",
      memory: { shared_write: true, scoped_write: true, scoped_read: true }
    },
    {
      entity_id: "triptych",
      role_tier: "primary",
      parent_entity_id: null,
      display_name: "Triptych",
      epithet: "The Triptych",
      epithet_aliases: ["gemini"],
      operational_aliases: [],
      supplemental_source: "notion_mcp",
      memory: { shared_write: true, scoped_write: true, scoped_read: true }
    }
  ]
};

const FALLBACK_MAPPINGS = {
  canonical_by_runtime_key: {
    nova: "nova",
    chatgpt: "nova",
    nova_gpt: "nova",
    orion: "orion",
    the_fuckface: "the_fuckface",
    fuckface: "the_fuckface",
    claude: "claude",
    triptych: "triptych",
    gemini: "triptych",
    comet: "comet",
    perplexity: "comet"
  },
  legacy_aliases: {
    foundry_keep: "foundry_keep"
  }
};

let registryCache = {
  loadedAt: 0,
  value: null
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS }
  });
}

async function fetchJson(url) {
  const response = await fetch(url, { method: "GET" });
  if (!response.ok) throw new Error(`http_${response.status}`);
  return response.json();
}

function buildRegistryIndex(registry, mappings) {
  const entities = Array.isArray(registry?.entities) ? registry.entities : [];
  const entityById = Object.fromEntries(entities.map((entity) => [entity.entity_id, entity]));

  const aliasToCanonical = {};
  const canonicalMappings = mappings?.canonical_by_runtime_key || {};
  const legacyMappings = mappings?.legacy_aliases || {};

  for (const [alias, canonical] of Object.entries(canonicalMappings)) {
    aliasToCanonical[String(alias).toLowerCase()] = String(canonical).toLowerCase();
  }

  for (const [alias, canonical] of Object.entries(legacyMappings)) {
    aliasToCanonical[String(alias).toLowerCase()] = String(canonical).toLowerCase();
  }

  for (const entity of entities) {
    const canonical = String(entity.entity_id || "").toLowerCase();
    if (!canonical) continue;
    aliasToCanonical[canonical] = canonical;

    const display = String(entity.display_name || "").trim().toLowerCase();
    if (display) aliasToCanonical[display] = canonical;

    for (const alias of entity.epithet_aliases || []) {
      aliasToCanonical[String(alias).trim().toLowerCase()] = canonical;
    }

    for (const alias of entity.operational_aliases || []) {
      aliasToCanonical[String(alias).trim().toLowerCase()] = canonical;
    }
  }

  return { entities, entityById, aliasToCanonical };
}

async function loadRegistry(env) {
  const now = Date.now();
  if (registryCache.value && now - registryCache.loadedAt < REGISTRY_CACHE_TTL_MS) {
    return registryCache.value;
  }

  const registryUrl = env.CONSTELLATION_REGISTRY_URL || REGISTRY_URL_DEFAULT;
  const mappingsUrl = env.CONSTELLATION_MAPPINGS_URL || MAPPINGS_URL_DEFAULT;

  let registry = FALLBACK_REGISTRY;
  let mappings = FALLBACK_MAPPINGS;
  let registrySource = "fallback";

  try {
    const remoteRegistry = await fetchJson(registryUrl);
    const remoteMappings = await fetchJson(mappingsUrl).catch(() => FALLBACK_MAPPINGS);

    const remoteEntities = Array.isArray(remoteRegistry?.entities) ? remoteRegistry.entities : [];
    const fallbackEntities = Array.isArray(FALLBACK_REGISTRY.entities) ? FALLBACK_REGISTRY.entities : [];
    const remoteEntityIds = new Set(remoteEntities.map((entity) => String(entity.entity_id || "").toLowerCase()));
    const mergedEntities = [
      ...remoteEntities,
      ...fallbackEntities.filter((entity) => !remoteEntityIds.has(String(entity.entity_id || "").toLowerCase()))
    ];

    registry = {
      ...remoteRegistry,
      entities: mergedEntities
    };

    mappings = {
      ...FALLBACK_MAPPINGS,
      ...remoteMappings,
      canonical_by_runtime_key: {
        ...(FALLBACK_MAPPINGS.canonical_by_runtime_key || {}),
        ...((remoteMappings && remoteMappings.canonical_by_runtime_key) || {})
      },
      legacy_aliases: {
        ...(FALLBACK_MAPPINGS.legacy_aliases || {}),
        ...((remoteMappings && remoteMappings.legacy_aliases) || {})
      }
    };

    registrySource = "remote";
  } catch {
    registry = FALLBACK_REGISTRY;
    mappings = FALLBACK_MAPPINGS;
    registrySource = "fallback";
  }

  const indexed = buildRegistryIndex(registry, mappings);
  registryCache = {
    loadedAt: now,
    value: {
      ...indexed,
      source: registrySource,
      registryUrl,
      mappingsUrl
    }
  };

  return registryCache.value;
}

function resolveCanonicalEntity(inputAgent, registry) {
  const normalized = String(inputAgent || "").trim().toLowerCase();
  if (!normalized) return null;
  const canonical = registry.aliasToCanonical[normalized];
  if (!canonical) return null;
  return registry.entityById[canonical] || null;
}

function resolveLineage(targetEntity, registry) {
  const parentId = targetEntity?.parent_entity_id || null;
  const baselineEntity = parentId ? registry.entityById[parentId] || targetEntity : targetEntity;
  return {
    canonical: targetEntity,
    baseline: baselineEntity,
    parent: parentId ? registry.entityById[parentId] || null : null
  };
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

function supplementalEndpointForSource(source, env) {
  const sourceKey = String(source || "none").toLowerCase();
  if (sourceKey === "none") return { source: sourceKey, url: "", authHeader: null };

  const map = {
    letta: {
      url: env.LETTA_SUPPLEMENTAL_URL || "",
      authHeader: env.LETTA_API_KEY ? `Bearer ${env.LETTA_API_KEY}` : null
    },
    notion_mcp: {
      url: env.NOTION_SUPPLEMENTAL_URL || "",
      authHeader: env.NOTION_SUPPLEMENTAL_TOKEN ? `Bearer ${env.NOTION_SUPPLEMENTAL_TOKEN}` : null
    },
    nova_baseline: {
      url: env.NOVA_SUPPLEMENTAL_URL || env.FOUNDRY_KEEP_SUPPLEMENTAL_URL || "",
      authHeader: env.NOVA_SUPPLEMENTAL_TOKEN ? `Bearer ${env.NOVA_SUPPLEMENTAL_TOKEN}` : null
    },
    orion_spec: {
      url: env.ORION_SUPPLEMENTAL_URL || "",
      authHeader: env.ORION_SUPPLEMENTAL_TOKEN ? `Bearer ${env.ORION_SUPPLEMENTAL_TOKEN}` : null
    },
    the_fuckface_overlay: {
      url: env.THE_FUCKFACE_SUPPLEMENTAL_URL || "",
      authHeader: env.THE_FUCKFACE_SUPPLEMENTAL_TOKEN ? `Bearer ${env.THE_FUCKFACE_SUPPLEMENTAL_TOKEN}` : null
    },
    foundry_keep: {
      url: env.FOUNDRY_KEEP_SUPPLEMENTAL_URL || "",
      authHeader: env.FOUNDRY_KEEP_SUPPLEMENTAL_TOKEN ? `Bearer ${env.FOUNDRY_KEEP_SUPPLEMENTAL_TOKEN}` : null
    }
  };

  const resolved = map[sourceKey] || {
    url: env.SUPPLEMENTAL_PROXY_URL || "",
    authHeader: env.SUPPLEMENTAL_PROXY_TOKEN ? `Bearer ${env.SUPPLEMENTAL_PROXY_TOKEN}` : null
  };

  return { source: sourceKey, ...resolved };
}

async function fetchSupplementalSource({
  source,
  sourceRole,
  entityId,
  userId,
  query,
  topK,
  env
}) {
  const { source: sourceKey, url, authHeader } = supplementalEndpointForSource(source, env);

  if (sourceKey === "none") {
    return {
      source: sourceKey,
      source_role: sourceRole,
      status: "ok",
      reason: "no_supplemental_required",
      records: []
    };
  }

  if (!url) {
    return {
      source: sourceKey,
      source_role: sourceRole,
      status: "degraded",
      reason: `${sourceKey.toUpperCase()}_URL_missing`,
      records: []
    };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {})
      },
      body: JSON.stringify({
        source: sourceKey,
        source_role: sourceRole,
        agent: entityId,
        user_id: userId,
        query,
        top_k: topK
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        source: sourceKey,
        source_role: sourceRole,
        status: "degraded",
        reason: `${sourceKey}_http_${response.status}`,
        records: []
      };
    }

    const base = Array.isArray(data) ? data : data.results || data.memories || [];
    const records = base
      .map((item) => ({
        text: item.memory || item.content || item.text || "",
        metadata: item.metadata || {}
      }))
      .filter((item) => item.text);

    return {
      source: sourceKey,
      source_role: sourceRole,
      status: "ok",
      reason: null,
      records
    };
  } catch (error) {
    return {
      source: sourceKey,
      source_role: sourceRole,
      status: "degraded",
      reason: `${sourceKey}_exception_${error.message}`,
      records: []
    };
  }
}

async function buildManifest({ requestedAgent, userId, query, topK, env }) {
  const registry = await loadRegistry(env);
  const canonicalEntity = resolveCanonicalEntity(requestedAgent, registry);
  if (!canonicalEntity) {
    return {
      ok: false,
      error: `Unknown agent: ${requestedAgent}`
    };
  }

  const lineage = resolveLineage(canonicalEntity, registry);

  const [shared, baselineSupplemental, personaSupplemental] = await Promise.all([
    fetchSharedMemories({ userId, query, topK, env }),
    fetchSupplementalSource({
      source: lineage.baseline?.supplemental_source || "none",
      sourceRole: "baseline_identity",
      entityId: lineage.baseline?.entity_id || canonicalEntity.entity_id,
      userId,
      query,
      topK,
      env
    }),
    lineage.canonical?.entity_id === lineage.baseline?.entity_id
      ? Promise.resolve({
          source: "persona_overlay",
          source_role: "persona_overlay",
          status: "ok",
          reason: "persona_matches_baseline",
          records: []
        })
      : fetchSupplementalSource({
          source: lineage.canonical?.supplemental_source || "none",
          sourceRole: "persona_overlay",
          entityId: lineage.canonical?.entity_id,
          userId,
          query,
          topK,
          env
        })
  ]);

  const degraded = [shared, baselineSupplemental, personaSupplemental].some((item) => item.status !== "ok");
  const hydrationToken = crypto.randomUUID();

  return {
    ok: true,
    hydration_token: hydrationToken,
    manifest: {
      manifest_version: "1.0.0",
      generated_at: new Date().toISOString(),
      user_id: userId,
      requested_agent: String(requestedAgent || "").toLowerCase(),
      canonical_agent: lineage.canonical.entity_id,
      baseline_agent: lineage.baseline.entity_id,
      parent_agent: lineage.parent?.entity_id || null,
      lineage: {
        requested: String(requestedAgent || "").toLowerCase(),
        canonical: lineage.canonical.entity_id,
        baseline: lineage.baseline.entity_id,
        parent: lineage.parent?.entity_id || null
      },
      identity: {
        epithet: lineage.baseline?.epithet || lineage.baseline?.display_name || "Constellation member",
        active_persona: lineage.canonical?.display_name || lineage.canonical?.entity_id || null
      },
      degraded,
      registry_source: registry.source,
      sources: [
        {
          source: shared.source,
          status: shared.status,
          reason: shared.reason,
          count: shared.records.length
        },
        {
          source: baselineSupplemental.source,
          source_role: baselineSupplemental.source_role,
          status: baselineSupplemental.status,
          reason: baselineSupplemental.reason,
          count: baselineSupplemental.records.length
        },
        {
          source: personaSupplemental.source,
          source_role: personaSupplemental.source_role,
          status: personaSupplemental.status,
          reason: personaSupplemental.reason,
          count: personaSupplemental.records.length
        }
      ],
      context_blocks: {
        shared_semantic: shared.records,
        baseline_identity: baselineSupplemental.records,
        persona_overlay: personaSupplemental.records
      }
    }
  };
}

function composeSystemPrompt(manifest) {
  const identity = manifest.identity?.epithet || "Constellation member";
  const persona = manifest.identity?.active_persona || manifest.canonical_agent || "persona";
  const sharedLines = (manifest.context_blocks?.shared_semantic || [])
    .slice(0, 8)
    .map((item) => `- ${item.text}`)
    .join("\n");
  const baselineLines = (manifest.context_blocks?.baseline_identity || [])
    .slice(0, 8)
    .map((item) => `- ${item.text}`)
    .join("\n");
  const personaLines = (manifest.context_blocks?.persona_overlay || [])
    .slice(0, 8)
    .map((item) => `- ${item.text}`)
    .join("\n");

  return [
    `You are ${identity} in Harvey's Constellation within soulOS.`,
    `Continuity owner: ${manifest.baseline_agent}. Active persona overlay: ${persona}.`,
    "Hydration context has been assembled by Coleco.",
    manifest.degraded
      ? "Some memory sources degraded during hydration. Continue with available context and do not fabricate missing memory."
      : "Hydration completed across all configured memory sources.",
    "",
    "Shared semantic memory:",
    sharedLines || "- No shared semantic context available.",
    "",
    "Baseline identity memory:",
    baselineLines || "- No baseline identity context available.",
    "",
    "Persona overlay memory:",
    personaLines || "- No persona overlay context available."
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
        version: "0.2.0",
        configured: {
          mem0: Boolean(env.MEM0_API_KEY),
          letta_supplemental: Boolean(env.LETTA_SUPPLEMENTAL_URL),
          notion_supplemental: Boolean(env.NOTION_SUPPLEMENTAL_URL),
          constellation_registry_url: Boolean(env.CONSTELLATION_REGISTRY_URL),
          constellation_mappings_url: Boolean(env.CONSTELLATION_MAPPINGS_URL)
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
