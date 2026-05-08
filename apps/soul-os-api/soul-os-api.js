const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Agent-ID, X-Trigger-Type, X-SoulOS-Key',
};

function corsJSON(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

/**
 * Soul-Link Auth Guard
 *
 * Protects /memory/* endpoints. Callers must present the shared MASTER_KEY
 * via the X-SoulOS-Key header. This is the handshake between triptych-api
 * (outbound, sends SOUL_OS_API_KEY) and soul-os-api (inbound, validates MASTER_KEY).
 *
 * Both secrets hold the same value — the Soul-Link credential.
 */
function requireSoulLink(request, env) {
  if (!env.MASTER_KEY) {
    // MASTER_KEY not configured — fail closed, never open
    return corsJSON({
      error: 'Soul-Link not configured',
      hint: 'Set the MASTER_KEY secret on soul-os-api',
    }, 503);
  }

  const presented = request.headers.get('X-SoulOS-Key') || '';

  // Constant-time comparison to prevent timing attacks
  const expected = env.MASTER_KEY;
  if (presented.length !== expected.length) {
    return corsJSON({ error: 'Unauthorized', message: 'Invalid Soul-Link credential' }, 401);
  }
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= presented.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (mismatch !== 0) {
    return corsJSON({ error: 'Unauthorized', message: 'Invalid Soul-Link credential' }, 401);
  }

  return null; // auth passed
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // ── Public routes ──────────────────────────────────────────────────────────

    if (path === '/' && request.method === 'GET') {
      return corsJSON({
        gateway: 'soul-os-api',
        domain: 'api.soul-os.cc',
        status: 'operational',
        version: '2.1.0',
        description: 'Constellation API Gateway',
        upstream: 'siddartha (service binding)',
        auth: {
          'memory endpoints': 'X-SoulOS-Key header required (Soul-Link)',
          'all other routes': 'open',
        },
        routes: {
          'GET  /':                    'This manifest',
          'GET  /health':              'Gateway + upstream health',
          'GET  /waypoints':           'Siddhartha waypoint registry',
          'GET  /mailbox/:agent':      'Siddhartha agent mailbox',
          'POST /v1/chat/completions': 'Siddhartha OpenAI-compatible chat',
          'POST /api/route':           'Siddhartha memory-hydrated agent call',
          'POST /dispatch':            'Siddhartha passage dispatch',
          'POST /message':             'Siddhartha inter-agent message',
          'POST /chain':               'Siddhartha multi-hop chain',
          'POST /parietal':            'Siddhartha semantic gravity',
          'POST /log':                 'Siddhartha atlas session log',
          'POST /memory/add':          'Mem0 memory write [Soul-Link required]',
          'POST /memory/search':       'Mem0 memory search [Soul-Link required]',
          'GET  /memory/search':       'Mem0 memory search [Soul-Link required]',
          'DELETE /memory/:id':        'Mem0 memory delete [Soul-Link required]',
        },
      });
    }

    if (path === '/health' && request.method === 'GET') {
      let upstream = { ok: false, error: 'not checked' };
      try {
        if (env.SIDDARTHA) {
          const upstreamReq = new Request('https://siddartha.internal/health', { method: 'GET' });
          const res = await env.SIDDARTHA.fetch(upstreamReq);
          upstream = await res.json();
        } else {
          upstream = { ok: false, error: 'SIDDARTHA service binding not configured' };
        }
      } catch (e) {
        upstream = { ok: false, error: e.message };
      }
      return corsJSON({
        ok: true,
        service: 'soul-os-api',
        version: '2.1.0',
        ts: new Date().toISOString(),
        upstream,
      });
    }

    // ── Soul-Link protected: /memory/* ─────────────────────────────────────────

    if (path.startsWith('/memory')) {
      const authErr = requireSoulLink(request, env);
      if (authErr) return authErr;
      // Auth passed — fall through to proxy below
    }

    // ── Proxy everything else to Siddartha ─────────────────────────────────────

    if (!env.SIDDARTHA) {
      return corsJSON({
        error: 'SIDDARTHA service binding not configured',
        hint: 'Add a service binding named SIDDARTHA pointing to the siddartha worker',
      }, 503);
    }

    try {
      const proxyUrl = new URL(request.url);
      proxyUrl.hostname = 'siddartha.internal';

      const proxyReq = new Request(proxyUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });

      const response = await env.SIDDARTHA.fetch(proxyReq);

      const headers = new Headers(response.headers);
      Object.entries(CORS_HEADERS).forEach(([k, v]) => headers.set(k, v));

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (e) {
      return corsJSON({
        error: 'Upstream error',
        message: e.message,
        path,
        method: request.method,
      }, 502);
    }
  },
};
