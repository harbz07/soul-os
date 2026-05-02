# Siddartha (Constellation Omnibus)

This is the core logic and routing engine for the Constellation. It is the upstream service for `soul-os-api`.

- Environment: Cloudflare Workers
- Main File: `siddartha.js`
- Responsibilities:
  - Agent routing & calling (Claude, Nova, ORION, Triptych, Mephistopheles, The Fuckface, Comet)
  - Coleco-mediated context hydration (falls back to direct Mem0 if Coleco is unavailable)
  - Notion / Discord dispatching
  - KV Mailbox operations
  - Parietal Overlay & Campfire engine
  - D1 persistence: sessions, traces, threads, agent graph edges
  - MindBridge Router integration for PvE debate engine
