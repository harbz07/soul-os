# Siddartha Gate (Soul-OS API)

This app is the public API gateway for Soul-OS.

- Domain: https://api.soul-os.cc
- Upstream: `siddartha` (Cloudflare Worker binding)
- Manifest: routes + descriptions live in `manifest.json`
- Implementation: Cloudflare Worker in `soul-os-api.js` that:
  - Exposes `/` and `/health` for status/identity
  - Proxies `/v1/chat/completions`, `/api/route`, `/dispatch`, `/message`, `/chain`, `/parietal`, `/log` to Siddhartha
