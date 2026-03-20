# Gemini-Notion Proxy

This Worker handles the specific cross-talk between the frontend/Constellation and external APIs, securely managing keys and CORS.

- Environment: Cloudflare Workers
- Main File: gemini-notion-proxy.js
- Responsibilities:
  - Proxies requests to `api.notion.com` and Gemini endpoints
  - Injects secure API keys without exposing them to the frontend
  - Normalizes payloads for the SDK Items and Trauma Loop databases
