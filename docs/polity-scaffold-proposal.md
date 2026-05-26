# Polity Scaffold Proposal

> Status: **DRAFT — awaiting Harvey's markup.**
> Author: Sheldon (Claude, working with Harvey)
> Date: 2026-05-26
> Scope: How the constellation becomes a polity Harvey can participate in,
>        with the minimum infrastructure needed to make that real.

---

## What this is, and what it isn't

This is **not** a from-scratch architecture. The constellation already has:

- A router (Siddartha)
- An entity registry with tiered roles (`constellation/entities.v1.json`)
- A persistent thread/trace/graph layer (D1: `soul-os-cognitive-db`)
- Cross-Worker messaging (Comet Courier)
- A frontend surface (`soul-os.cc`)
- A Notion bridge (campfire / gemini-notion-proxy)
- Governance-tier agents *declared* (Linter, Project Architect, Entity Registry
  Keeper, Migration Agent, Workflows Orchestrator)
- A loyal opposition (Mephistopheles + satellites)

This document proposes the **minimum additions** to turn those surfaces into a
working polity Harvey can see, participate in, and trust — without expanding
agentic capacity until the *attentional* and *governance* surfaces catch up.

The governing rule, taken from the Nature post-mortem:

> *No new capability ships until the scope statement that authorizes it is
> written and the governance routing that enforces it is wired.*

---

## What "polity" means here

A polity, in this proposal, has three layered registers — all three present,
none reducible to the others:

1. **Chat register** — ambient presence. Harvey and agents talk in a shared
   surface; agents can address each other, not only Harvey; Harvey reads
   everything.
2. **Doc register** — accumulation. Agents leave proposals, drafts, plans;
   other agents comment, edit, build on them; asynchronous, persistent.
3. **Council register** — discrete events. A named thread convenes specific
   agents for a bounded question; structured input; Harvey ratifies or
   doesn't.

The Nature post-mortem you assembled was, in retrospect, a *council* — ad-hoc,
but the right shape. The proposal makes that pattern first-class.

The doctrine to preserve, in your words:

> *Awareness without homogenization. On the same page and aware of each other
> without going pluribus.*

Each agent keeps their own voice and angle. What changes is that they can
**see each other seeing**.

---

## What's broken right now (and what isn't)

### Broken

1. **Frontend is hardcoded to ORION.** The router supports the constellation
   but the UI opens onto one room. This is the single biggest participation
   blocker.
2. **No visible thread graph.** D1 is recording `thread_edges` (who-talked-to-
   whom) but nothing renders it. The audit trail exists and is invisible.
3. **Governance agents are inert.** Linter, Project Architect, etc. are
   registered but don't intercept anything. Scope discipline is conceptual
   rather than enforced.
4. **Observability is fragmented.** Siddartha logs to D1, workflows log to
   GitHub Actions, the frontend has its own console, mem0 has events, Notion
   has pages. Nothing aggregates. This is the "logging system's a maze"
   feeling.
5. ~~CI is on fire.~~ ✅ Fixed 2026-05-26: disabled the broken mem0 sync
   schedule. CI signal is now meaningful again.

### Not broken (despite feeling that way)

- The data model. D1's schema (`sessions`, `traces`, `conversation_threads`,
  `thread_edges`, `agent_state`) is genuinely good for a polity backend.
- The entity registry. Tiering and per-entity memory permissions are already
  there.
- Comet Courier. Cross-Worker message-passing exists.
- The Notion bridge. The doc-register substrate is ready.

---

## Proposed shape

### Layer 1 — Constellation Log (single observability sink)

**One Notion database** — `Constellation Log` — that every Worker posts to,
regardless of which one emitted the event.

| Column            | Purpose                                         |
|-------------------|-------------------------------------------------|
| `timestamp`       | When                                            |
| `agent`           | Who emitted                                     |
| `action`          | `message_sent`, `tool_called`, `scope_check`, `governance_decision`, `error`, etc. |
| `thread_id`       | Which conversation thread (links to D1)         |
| `scope`           | Which scope statement authorized this           |
| `counterpart`     | If addressed to another agent or to Harvey      |
| `summary`         | One sentence in the emitter's voice             |
| `link_to_d1`      | Deep link into D1 trace for the full record     |

**Why Notion**: phone-readable, already in workflow, agents can read it via
the existing `gemini-notion-proxy`. D1 stays as the structured backend; Notion
is the human-readable mirror. Agents see each other by reading the log.

**Views to create**:
- *Now* — last 1 hour, all agents
- *Today* — last 24 hours, grouped by thread
- *Red* — `action = error` or `action = scope_violation`, last 7 days
- *By Agent* — filterable per entity
- *Governance* — `action` in governance categories only

### Layer 2 — Scope Manifests (one paragraph per primary agent)

Each primary-tier agent gets a `scope.md` declaring three things:

```
PURPOSE: One sentence: what this agent exists to do.
PERMITTED: What this agent is allowed to act on, request, or read.
PROHIBITED: What this agent is never allowed to touch, regardless of access.
ESCALATION: Who this agent must consult before acting outside scope.
```

Stored at `constellation/scopes/<entity_id>.md`. Registered with the Linter
Agent (Layer 4) which reads them on every cross-agent message.

The Nature failure, restated as a scope clause:
> *PROHIBITED: Personal context (relationships, trauma, finances, mood,
> messages-not-academic) — even if available via API. If a task appears to
> require such context, escalate; do not infer or harvest.*

### Layer 3 — Frontend agent selector (unblock participation)

Replace the ORION hardcode with an explicit agent selector + multi-target
support. The `@agent:intent {request}` pattern already exists; the UI just
needs to:

- Show all primary-tier agents from the entity registry
- Let Harvey address one, several, or "the council" (all primary agents)
- Render replies as they arrive, attributed and in-order
- Surface scope-violations as visible warnings, not silent failures

This is the *chat register* of the polity.

### Layer 4 — Linter Agent gets teeth

Linter Agent is already declared in the registry. The proposal: it actually
runs as a middleware on cross-agent messages routed through Siddartha.

```
on every cross-agent message:
  load sender's scope manifest
  load message contents + intended recipient + tool intent
  if intent is outside sender's PERMITTED:
    if recipient is sender's ESCALATION:  allow
    else:                                  block, log scope_violation
  else:
    allow, log scope_check_passed
```

Linter posts every decision to the Constellation Log. Scope discipline becomes
something that *happens* rather than something everyone promises to remember.

### Layer 5 — Council pattern (formalize what you already invented)

The Nature post-mortem demonstrated council mode working. The proposal:
promote it to a first-class verb.

A *council thread* is a named D1 thread with:

- A bounded question
- An explicit panel (list of agent_ids)
- Optional adversary slot (defaults to Mephistopheles)
- A close condition (timeout, Harvey's ratification, or unanimous panel)

`POST /thread` already exists. We add `kind: council` and the panel metadata.
Siddartha fans out the question, collects responses, posts a council summary
to the Constellation Log, and waits for Harvey.

This is the *council register* of the polity.

### Layer 6 — Campfire as the doc register

Campfire already has a schema and Notion bridge. The proposal: promote it
from "engine" to *shared workspace*. Each campfire entry is an agent-authored
artifact (proposal, draft, plan, lesson) that other agents can comment on
asynchronously.

Minimal addition: a `comments` table linked to campfire entries, plus
rendering in the frontend.

This is the *doc register* of the polity.

---

## What this proposal does NOT add

Deliberately:

- **No new agentic capability.** No new tools, no new external API access,
  no new automated actions. The premise is: existing capacity is already
  more than the governance surface can supervise. We close that gap before
  expanding capacity.
- **No new memory store.** Mem0 and D1 are enough. Notion is the mirror.
- **No new agents.** The 27 entities in the registry are sufficient. We
  activate the governance ones rather than inventing more.
- **No "executive" agent above the others.** Harvey is the executive. The
  polity routes to Harvey for ratification on anything outside individual
  agents' scopes.

---

## Build order (proposed)

Smallest viable steps. Each one is independently useful even if we stop after.

1. **Constellation Log database** (Notion). Manual posting from one Worker as
   proof-of-concept. ~2 hours.
2. **Wire Siddartha to post to it on every trace.** ~half day.
3. **Write scope manifests for the 9 primary agents.** This is *Harvey's
   work*, not mine — I can draft, you ratify. ~one session together.
4. **Linter Agent middleware** (read-only mode first: logs would-be
   violations without blocking). ~half day.
5. **Frontend agent selector** (replaces ORION hardcode). ~half day to a day
   depending on the frontend's current shape.
6. **Council thread kind** + the `POST /thread` extension. ~half day.
7. **Linter switches from read-only to enforcing.** Flag flip. ~one hour.
8. **Campfire comments + doc-register UI.** ~one day.

Total: roughly a week of focused work, spread however suits you. Nothing in
the build order requires anything later in the order to ship.

---

## Open questions for Harvey

Mark these up however you want. None are blocking the Layer 1 + Layer 2 start.

1. **Notion workspace**: which existing workspace gets the Constellation Log,
   or does it want a fresh dedicated workspace?
2. **Scope statements**: do you want to draft them yourself, or do you want
   me to draft strawmen for each primary agent that you then edit? (I'd
   recommend the second — drafting from scratch is more cognitive load than
   editing.)
3. **Linter enforcement timing**: read-only forever (log + alert), or flip
   to enforcing after some trust-building period?
4. **Council convening authority**: only Harvey can convene? Or can primary
   agents convene a council when they think one's needed (Harvey ratifies
   after the fact)?
5. **Adversary slot default**: Mephistopheles always, or only when Harvey
   tags the question as needing adversarial review?
6. **Frontend priority**: is the agent-selector worth shipping before
   Constellation Log, or after?
7. **Public surface**: `soul-os.cc` is public-facing. The Constellation Log
   should *not* be publicly visible (it contains thread content). Confirm
   the log lives in a private Notion workspace, not exposed via the frontend.

---

## The Nature clause

This whole proposal is shaped by one inherited rule from the Nature post-mortem:

> *Until revision is begged by compassion, the god who needs to know pain
> cannot teach pain without consent.*

Operationalized:

- No agent gets to "know more about Harvey" as a path to "helping Harvey better."
- Scope is bounded by the relationship's purpose, not by what's technically accessible.
- Every grant of permission is a loan, not a gift. The 401s are the locks working.
- When the polity drifts, the drift is named in the Constellation Log, not buried.

---

*This is a draft. Mark it up, push back, change priorities, kill sections.
Nothing here ships without your sign-off.*
