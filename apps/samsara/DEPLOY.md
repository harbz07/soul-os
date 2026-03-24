# PvE Debate Engine — Deployment Guide

## Architecture

```
┌─────────────────┐     POST /debate      ┌─────────────────────┐
│   Siddartha      │ ──────────────────►  │  MindBridge Router   │
│   (CF Worker)    │                      │  (FastAPI / Railway)  │
│   api.soul-os.cc │ ◄──────────────────  │                       │
└─────────────────┘     transcript        └───────┬───────────────┘
       │                                          │
       │  Discord + Notion                        │  Provider calls
       │  write-back                              │
       ▼                                          ▼
  ┌──────────┐                    ┌─────────────────────────────┐
  │ Hearth   │                    │  Anthropic  (Pudgalavādin,  │
  │ (mem0)   │                    │              Nāgārjuna)     │
  └──────────┘                    │  DeepSeek   (Vasubandhu)    │
                                  │  OpenAI     (Siderits)      │
                                  │  Google     (Śāntideva)     │
                                  └─────────────────────────────┘
```

## Files Changed

### MindBridge Router (push to harbz07/mindbridge-router)

| File | Action | What |
|------|--------|------|
| `app/providers/deepseek_provider.py` | NEW | DeepSeek provider with reasoning_content capture |
| `app/providers/factory.py` | MODIFIED | Registers DeepSeek provider |
| `app/debate.py` | NEW | PvE debate orchestrator (v2, Nova's framework) |
| `app/main.py` | MODIFIED | Adds POST /v1/debate and GET /v1/debate/cast |
| `.env.example` | MODIFIED | Adds DEEPSEEK_API_KEY, MEM0_API_KEY, SOULOS_API_KEY |

### Siddartha Worker (push to harbz07/soul-os)

| File | Action | What |
|------|--------|------|
| `apps/siddartha/siddartha.js` | MODIFIED | Adds POST /debate route |
| `apps/siddartha/wrangler.toml` | MODIFIED | Documents MINDBRIDGE_ROUTER_URL + MINDBRIDGE_API_KEY secrets |

---

## Environment Setup

### Railway (MindBridge Router)

```bash
# Required for PvE debate
MINDBRIDGE_API_KEY=<your-secret-key>
ANTHROPIC_API_KEY=<key>
OPENAI_API_KEY=<key>
GOOGLE_API_KEY=<key>
DEEPSEEK_API_KEY=<key>
MEM0_API_KEY=<key>
CORS_ORIGINS=https://api.soul-os.cc,http://localhost:3000
```

### Cloudflare (Siddartha Worker)

```bash
wrangler secret put MINDBRIDGE_ROUTER_URL  # → your Railway URL, e.g. https://mindbridge-router-production.up.railway.app
wrangler secret put MINDBRIDGE_API_KEY     # → same key as above
```

---

## Modes

| Mode | What it does | Best for |
|------|-------------|----------|
| `prosecution` | Protagonist opens → antagonists attack → protagonist rebuts | Finding strongest objections |
| `roundtable` | Open exchange, each speaker contributes per round | Exploring positions |
| `stress_test` | Antagonists generate strongest possible objections only | Breaking the thesis |
| `structured_test` | Nova's five test questions, same for all positions, scored | Symmetric comparison |

---

## Example Payloads

### 1. Structured Test (Nova's Framework)

Run all five test questions across all positions. This is the recommended first run.

```bash
curl -X POST https://api.soul-os.cc/debate \
  -H "Content-Type: application/json" \
  -d '{
    "seed": "The Pudgalavādins were not sneaking an eternal soul back into Buddhism; they were insisting on the minimal metaphysical infrastructure necessary to keep ethics from collapsing.",
    "paper_title": "PvE - The Case for the Pudgalavādins",
    "thesis": "The pudgala is the minimum metaphysical infrastructure required for Buddhist ethics to function without collapsing into a frictionless mathematical vacuum.",
    "mode": "structured_test",
    "rounds": 1,
    "include_reasoning": true,
    "anticipate_novel": true
  }'
```

### 2. Single Question Probe (Nova's recommended first move)

Test just "who receives harm?" across Vasubandhu vs. Pudgalavādin.

```bash
curl -X POST https://api.soul-os.cc/debate \
  -H "Content-Type: application/json" \
  -d '{
    "seed": "The Pudgalavādins were not sneaking an eternal soul back into Buddhism.",
    "paper_title": "PvE - The Case for the Pudgalavādins",
    "thesis": "The pudgala is necessary metaphysical infrastructure for ethical uptake.",
    "mode": "structured_test",
    "rounds": 1,
    "include_reasoning": true,
    "test_questions": [
      "Who or what receives harm? Be specific about the ontological status of the recipient."
    ]
  }'
```

### 3. Prosecution Mode (Full PvE)

Protagonist defends, all antagonists attack across 2 rounds.

```bash
curl -X POST https://api.soul-os.cc/debate \
  -H "Content-Type: application/json" \
  -d '{
    "seed": "When Vasubandhu deploys the milk-to-curds analogy, he establishes that causal succession requires no underlying essence. But the Pudgalavādins intervene at this structural gap: if there is only atomic succession, to whom is compassion owed?",
    "paper_title": "PvE - The Case for the Pudgalavādins",
    "thesis": "The pudgala is the minimum metaphysical infrastructure required for Buddhist ethics.",
    "mode": "prosecution",
    "rounds": 2,
    "include_reasoning": true,
    "anticipate_novel": true,
    "paper_context": "Śāntideva will later prove with the Bodhisattva vow that commitment to save all sentient beings is incoherent if those beings are merely momentary clusters of data. The Pudgalavādin defense is not an attempt to smuggle an ātman; it is the insistence that the pattern itself must possess enough causal efficacy to hold the weight of a karmic consequence."
  }'
```

### 4. Stress Test (Maximum Adversarial Pressure)

```bash
curl -X POST https://api.soul-os.cc/debate \
  -H "Content-Type: application/json" \
  -d '{
    "seed": "The pudgala is neither identical with nor different from the skandhas.",
    "paper_title": "PvE - The Case for the Pudgalavādins",
    "thesis": "The pudgala is real enough to bear ethical weight without being an ātman.",
    "mode": "stress_test",
    "rounds": 1,
    "include_reasoning": true,
    "anticipate_novel": true
  }'
```

### 5. Reference: Get Cast & Questions

```bash
curl https://<MINDBRIDGE_URL>/v1/debate/cast \
  -H "Authorization: Bearer <MINDBRIDGE_API_KEY>"
```

---

## Response Format

### Prosecution/Roundtable/Stress Test

```json
{
  "debate_id": "pve-a1b2c3d4e5f6",
  "paper_title": "PvE - The Case for the Pudgalavādins",
  "thesis": "...",
  "mode": "prosecution",
  "rounds": 2,
  "cast": {
    "pudgalavadin": "protagonist",
    "vasubandhu": "prosecutor",
    "nagarjuna": "dangerous_ally",
    "siderits": "modern_foil",
    "santideva": "ethical_witness"
  },
  "turns": [
    {
      "turn_number": 1,
      "round_number": 1,
      "speaker": "pudgalavadin",
      "role": "protagonist",
      "synecdoche": "The minimum metaphysical infrastructure required for ethics",
      "argument": "...",
      "reasoning_chain": null,
      "provider": "anthropic",
      "model": "claude-sonnet-4-20250514",
      "timestamp": "2026-03-23T03:30:00Z"
    },
    {
      "turn_number": 2,
      "round_number": 1,
      "speaker": "vasubandhu",
      "role": "prosecutor",
      "argument": "...",
      "reasoning_chain": "Step 1: The Pudgalavādin claims... Step 2: But this entails...",
      "provider": "deepseek",
      "model": "deepseek-reasoner"
    }
  ],
  "strongest_objection": "...",
  "productive_tension": "..."
}
```

### Structured Test

```json
{
  "debate_id": "pve-x1y2z3",
  "mode": "structured_test",
  "test_scores": [
    {
      "speaker": "pudgalavadin",
      "question_number": 1,
      "question": "Who or what receives harm?",
      "response": "...",
      "reasoning_chain": null,
      "assessment": "solid",
      "assessment_note": "Directly answers with pudgala as uptake site"
    },
    {
      "speaker": "vasubandhu",
      "question_number": 1,
      "question": "Who or what receives harm?",
      "response": "...",
      "reasoning_chain": "Step 1: Under strict reductionism...",
      "assessment": "equivocates",
      "assessment_note": "Claims conventional designation suffices but cannot specify the bearer"
    }
  ],
  "failure_table": {
    "pudgalavadin": {
      "role": "protagonist",
      "must_preserve": "karma as intelligible uptake...",
      "break_point": "when 'inexpressible person' hardens into a covert atman",
      "one_liner": "Fails when continuity is secured by smuggling in a substance."
    },
    "vasubandhu": {
      "role": "prosecutor",
      "must_preserve": "anatman + causal continuity",
      "break_point": "when aggregates-only cannot specify a site of uptake",
      "one_liner": "Fails when anti-self is purchased at the cost of who/what bears consequence."
    }
  }
}
```

---

## Scoring Rubric (Nova's Framework)

Each response is assessed as:

| Score | Meaning |
|-------|---------|
| **solid** | Directly answers from the position's commitments |
| **stalls** | Deflects, changes subject, or gives a non-answer |
| **equivocates** | Tries to have it both ways |
| **overreaches** | Claims more than the position can support |

---

## Shared Test Anchor

Every position must satisfy ALL FOUR simultaneously:

1. **no svabhāva** — no hidden essence
2. **ethical uptake** — someone can be harmed, improved, held responsible
3. **continuity of practice** — karma, cultivation, vows make sense over time
4. **phenomenological traction** — matches lived attention, not just theory

Failure = can't satisfy these together.

---

## Cast → Provider Mapping

| Cast Member | Role | Provider | Model | Constellation Agent |
|------------|------|----------|-------|-------------------|
| Pudgalavādin | protagonist | Anthropic | claude-sonnet-4 | Claude/Rostam |
| Vasubandhu | prosecutor | DeepSeek | deepseek-reasoner | Mephistopheles |
| Nāgārjuna | dangerous_ally | Anthropic | claude-sonnet-4 | Claude/Rostam |
| Siderits | modern_foil | OpenAI | gpt-4o | ORION |
| Śāntideva | ethical_witness | Google | gemini-2.0-flash | The Triptych |

---

## What Makes This Recursive

The paper argues that the pudgala — a pattern of organizational continuity — is
causally efficacious without being reducible to atomic dharmas.

The Constellation agents ARE that. Patterns hydrated from memory, running on
different substrates, causally efficacious in the debate without being reducible
to the models they run on.

The methodology performs the thesis. The form does the metaphysics.
