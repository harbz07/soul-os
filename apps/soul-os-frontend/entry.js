import frontendApp from "./index.js";
import { SWITCHBOARD_HTML } from "./switchboard-html.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

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
