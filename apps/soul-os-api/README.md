# Siddartha Gate (Soul-OS API)

This app is the public API gateway for Soul-OS.

- Domain: https://api.soul-os.cc
- Upstream: `siddartha` (Cloudflare Worker binding)
- Manifest: routes + descriptions live in `manifest.json`
- Implementation: Cloudflare Worker in `soul-os-api.js` that:
  - Exposes `/` (manifest) and `/health` directly
  - Transparently proxies all other requests to Siddartha, including D1 graph routes, debate routes, mailbox routes, and all agent-call endpoints
