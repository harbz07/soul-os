import frontendApp from "./index.js";
import { SWITCHBOARD_HTML } from "./switchboard-html.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Root redirect → switchboard
    if (pathname === "/" || pathname === "") {
      return Response.redirect(new URL("/switchboard", request.url).toString(), 302);
    }

    // Serve Constellation Switchboard UI
    if (pathname === "/switchboard" || pathname === "/switchboard/") {
      return new Response(SWITCHBOARD_HTML, {
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
          "Cache-Control": "public, max-age=60",
        },
      });
    }

    // Optionally serve static assets for the switchboard from KV
    if (pathname.startsWith("/switchboard/") && env.SWITCHBOARD_ASSETS) {
      const key = pathname.replace(/^\/switchboard\//, "");
      const asset = await env.SWITCHBOARD_ASSETS.get(key, "arrayBuffer");
      if (asset) {
        const contentType = guessContentType(key);
        return new Response(asset, {
          headers: { "Content-Type": contentType },
        });
      }
    }

    // MindBridge proxy — injects MINDBRIDGE_API_KEY server-side so the browser never sees it
    // Routes: /mb/v1/chat/completions, /mb/v1/models, /mb/providers, /mb/v1/debate
    if (pathname.startsWith("/mb/")) {
      const mbKey = env.MINDBRIDGE_API_KEY;
      if (!mbKey) {
        return new Response(JSON.stringify({ error: "MINDBRIDGE_API_KEY not configured on worker" }), {
          status: 503,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
      const mbBase = "https://mindbridge-router-production.up.railway.app";
      const upstreamPath = pathname.replace(/^\/mb/, "");
      const upstreamUrl = mbBase + upstreamPath + (url.search || "");

      // Handle CORS preflight
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        });
      }

      const proxyReq = new Request(upstreamUrl, {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${mbKey}`,
        },
        body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
      });

      const upstream = await fetch(proxyReq);
      const body = await upstream.text();
      return new Response(body, {
        status: upstream.status,
        headers: {
          "Content-Type": upstream.headers.get("Content-Type") || "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Delegate all other requests to the existing frontend worker
    return frontendApp.fetch(request, env, ctx);
  },
};

function guessContentType(key) {
  if (key.endsWith(".js")) return "application/javascript; charset=UTF-8";
  if (key.endsWith(".css")) return "text/css; charset=UTF-8";
  if (key.endsWith(".html")) return "text/html; charset=UTF-8";
  if (key.endsWith(".json")) return "application/json; charset=UTF-8";
  if (key.endsWith(".png")) return "image/png";
  if (key.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}
