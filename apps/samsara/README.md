# 🔄 Samsara — PvE Debate Engine

> *samsāra: the cycle of death and rebirth. the engine runs the debate until
> the argument is reborn in its strongest form.*

This directory contains the PvE (Player vs Environment) philosophical debate
engine for Harvey's Pudgalavādin paper. It lives on its own branch so it
doesn't touch the existing Siddartha deployment until it's proven.

## What's Here

```
apps/samsara/
├── DEPLOY.md                          # Full deployment guide + example payloads
├── README.md                          # This file
├── mindbridge-additions/              # Files to add/replace in mindbridge-router
│   ├── .env.example                   # Updated env template
│   ├── debate.py                      # PvE debate orchestrator (551 lines)
│   ├── main.py                        # Updated FastAPI app with /v1/debate
│   └── providers/
│       ├── deepseek_provider.py       # DeepSeek provider with reasoning capture
│       └── factory.py                 # Updated factory (registers DeepSeek)
└── siddartha-patch/                   # Siddartha additions (apply when ready)
    ├── siddartha-debate.patch         # Git patch file (apply with git apply)
    ├── siddartha-with-debate.js       # Full patched siddartha.js
    └── wrangler-with-debate.toml      # Updated wrangler.toml with new secrets
```

## How to Deploy

### Step 1: MindBridge Router (push to harbz07/mindbridge-router)

```bash
# Copy files into your mindbridge-router checkout
cp mindbridge-additions/providers/deepseek_provider.py  ../mindbridge-router/app/providers/
cp mindbridge-additions/providers/factory.py             ../mindbridge-router/app/providers/
cp mindbridge-additions/debate.py                        ../mindbridge-router/app/
cp mindbridge-additions/main.py                          ../mindbridge-router/app/
cp mindbridge-additions/.env.example                     ../mindbridge-router/

# Push
cd ../mindbridge-router
git add -A && git commit -m "feat: PvE debate engine + DeepSeek provider"
git push origin main
```

Then set in Railway:
- `DEEPSEEK_API_KEY`
- `MEM0_API_KEY`

### Step 2: Siddartha Worker (when ready to go live)

Option A — Apply patch:
```bash
cd apps/siddartha
git apply ../samsara/siddartha-patch/siddartha-debate.patch
```

Option B — Replace file:
```bash
cp apps/samsara/siddartha-patch/siddartha-with-debate.js apps/siddartha/siddartha.js
cp apps/samsara/siddartha-patch/wrangler-with-debate.toml apps/siddartha/wrangler.toml
```

Then set in Cloudflare:
```bash
wrangler secret put MINDBRIDGE_ROUTER_URL   # Railway URL
wrangler secret put MINDBRIDGE_API_KEY      # Same key as MindBridge auth
```

## Quick Test (after deployment)

Nova's recommended first move — one question, two positions:

```bash
curl -X POST https://api.soul-os.cc/debate \
  -H "Content-Type: application/json" \
  -d '{
    "seed": "The pudgala is necessary metaphysical infrastructure for ethical uptake.",
    "paper_title": "PvE - The Case for the Pudgalavādins",
    "thesis": "The pudgala is the minimum metaphysical infrastructure required for Buddhist ethics.",
    "mode": "structured_test",
    "rounds": 1,
    "include_reasoning": true,
    "test_questions": [
      "Who or what receives harm? Be specific about the ontological status of the recipient."
    ]
  }'
```

## Design

See DEPLOY.md for full architecture, all four modes, response format, and
Nova's failure-condition framework.

The recursive insight: each cast member is a pattern hydrated from memory
onto a model substrate — causally efficacious without being reducible to
the model. The methodology performs the thesis.

## When to Merge

This branch merges to main when:
1. MindBridge Router is deployed with the debate endpoint working
2. At least one structured_test run completes successfully
3. The Siddartha /debate route is tested end-to-end
4. Harvey says so
