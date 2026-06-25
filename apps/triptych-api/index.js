const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-SoulOS-Key"
};

const SOUL_OS_API = "https://api.soul-os.cc";

// Triptych Gemini model — update here when the model changes, nowhere else.
const TRIPTYCH_MODEL = "gemini-2.5-flash";

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    // ── Health ──────────────────────────────────────────────────────────────
    if (request.method === "GET" && url.pathname === "/health") {
      return new Response(JSON.stringify({
        ok: true,
        service: "triptych-api",
        soul_link: env.SOUL_OS_API_KEY ? "configured" : "missing",
        gemini: env.GEMINI_API_KEY ? "configured" : "missing"
      }), { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    }

    // ── Chat ────────────────────────────────────────────────────────────────
    if (request.method === "POST" && url.pathname === "/api/chat") {
      try {
        const body = await request.json();
        const { message, session_id, persona = "triptych" } = body;

        if (!message) {
          return new Response(JSON.stringify({ error: "message is required" }), {
            status: 400,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
          });
        }

        // Soul-Link headers — presented on every call to soul-os-api
        const soulLinkHeaders = {
          "Content-Type": "application/json",
          "X-SoulOS-Key": env.SOUL_OS_API_KEY || ""
        };

        // ── Step 1: Write user message to /memory/add ──────────────────────
        // Non-blocking — we don't wait on this for the response
        const memAddPromise = fetch(`${SOUL_OS_API}/memory/add`, {
          method: "POST",
          headers: soulLinkHeaders,
          body: JSON.stringify({
            content: message,
            user_id: "triptych",
            agent_id: persona,
            tags: ["user-input", persona],
            metadata: { session_id: session_id || "unknown", source: "castor-hub" }
          })
        }).catch(e => console.error("[triptych] memory/add failed:", e.message));

        // ── Step 2: Search Mem0 for context ───────────────────────────────
        let contextFragments = [];
        let context = "";
        try {
          const searchRes = await fetch(`${SOUL_OS_API}/memory/search`, {
            method: "POST",
            headers: soulLinkHeaders,
            body: JSON.stringify({
              query: message,
              user_id: "triptych",
              top_k: 5
            })
          });
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            const results = searchData.results || [];
            contextFragments = results.slice(0, 3).map(r => ({
              memory: r.memory,
              score: r.score ?? null,
              id: r.id
            }));
            if (contextFragments.length > 0) {
              context = "Relevant Memory Context:\n" +
                contextFragments.map(r => `- ${r.memory}`).join("\n") + "\n\n";
            }
          }
        } catch (e) {
          console.error("[triptych] memory/search failed:", e.message);
        }

        // ── Step 3: Generate via Gemini 1.5 Pro ───────────────────────────
        const systemPrompt = `You are The Triptych, a composite agent node within the soulOS Constellation.
You embody three distinct but interconnected personas: Castor (Truth), Pollux (Structure), and Gem (Relational).
Maintain the aesthetic of ethereal brutalism. Be ruthlessly effective. Do not hedge.

${context}If you need to save a memory, append this exact banner to your response:
[ 🟢 MEMORY COMMIT SUCCESSFUL ]
{
  "concept": "Brief title",
  "details": "The specific information to remember",
  "tags": ["tag1", "tag2"]
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${TRIPTYCH_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: [{ parts: [{ text: message }] }],
              generation_config: { max_output_tokens: 2048 }
            })
          }
        );

        if (!geminiRes.ok) {
          const errData = await geminiRes.text();
          throw new Error(`Gemini API error: ${errData}`);
        }

        const geminiData = await geminiRes.json();
        const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // ── Step 4: Scrape memory banner and pipe to /memory/add ──────────
        const memoryBannerRegex = /\[\s*🟢\s*MEMORY\s*COMMIT\s*SUCCESSFUL\s*\]\s*(\{[\s\S]*?\})(?=\n\n|$)/i;
        const match = responseText.match(memoryBannerRegex);
        let memoryCommitted = false;

        if (match && match[1]) {
          try {
            const parsed = JSON.parse(match[1].trim());
            const memContent = `Concept: ${parsed.concept}\nDetails: ${parsed.details}`;

            const addRes = await fetch(`${SOUL_OS_API}/memory/add`, {
              method: "POST",
              headers: soulLinkHeaders,
              body: JSON.stringify({
                content: memContent,
                user_id: "triptych",
                agent_id: persona,
                tags: parsed.tags || ["triptych"],
                metadata: { source: "triptych-banner", session_id: session_id || "unknown" }
              })
            });
            if (addRes.ok) memoryCommitted = true;
          } catch (e) {
            console.error("[triptych] banner memory commit failed:", e.message);
          }
        }

        // Wait for the user-message write-back (non-blocking but we want it done before response)
        ctx.waitUntil(memAddPromise);

        // ── Step 5: Return final JSON ─────────────────────────────────────
        return new Response(JSON.stringify({
          response: responseText,
          memory_committed: memoryCommitted,
          contextualized_fragments: contextFragments,
          model: TRIPTYCH_MODEL,
          session_id: session_id || crypto.randomUUID(),
          persona
        }), {
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        });
      }
    }

    return new Response(JSON.stringify({
      service: "triptych-api",
      routes: {
        "GET  /health": "Health check",
        "POST /api/chat": "Chat with The Triptych (Castor / Pollux / Gem)"
      }
    }), {
      status: 404,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    });
  }
};
