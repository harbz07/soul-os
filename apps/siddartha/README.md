# Siddartha (Constellation Omnibus)

This is the core logic and routing engine for the Constellation. It is the upstream service for `soul-os-api`.

- Environment: Cloudflare Workers
- Main File: `siddartha.js`
- Responsibilities:
  - Agent routing & calling (Claude, ORION, Triptych, Mephistopheles)
  - Mem0 context hydration
  - Notion / Discord dispatching
  - KV Mailbox operations
  - Parietal Overlay & Campfire engine
