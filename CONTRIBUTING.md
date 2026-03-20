# Contributing to Soul-OS

This repo is the source of truth for the Soul-OS constellation. Cloudflare is just the projection surface. Changes should flow **repo → CI/CD → Workers**, not the other way around.

## Workflow Overview

1. Edit code in `apps/*` locally (Siddartha, soul-os-api, frontend, comet-courier, bridge workers).
2. Run any local checks (lint/tests when they exist).
3. Commit changes to a branch and open a PR.
4. On merge to `main`, GitHub Actions run Wrangler to deploy updated Workers to Cloudflare.

## Repository Layout

- `apps/siddartha/` – inner monastery / core Constellation logic.
- `apps/soul-os-api/` – public API gateway at `api.soul-os.cc`.
- `apps/soul-os-frontend/` – Cognitive Runtime UI at `soul-os.cc`.
- `apps/comet-courier/` – async dispatch and system transit.
- `apps/gemini-notion-proxy/` – bridge to Mem0, Notion, Discord, etc.
- `docs/` – architecture notes, diagrams, design memos.
- `packages/` – shared libraries and Cerebral SDK components.

## Making Changes

1. **Create a branch**

   ```bash
   git checkout -b feature/<short-description>
