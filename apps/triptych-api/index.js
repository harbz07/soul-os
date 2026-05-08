const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    
    if (request.method === "POST" && url.pathname === "/api/chat") {
      try {
        const body = await request.json();
        const { message, session_id } = body;

        if (!message) {
          return new Response(JSON.stringify({ error: "Message is required" }), {
            status: 400,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
          });
        }

        // 1. Search Mem0 via soul-os-api for context
        let context = "";
        try {
          const mem0Res = await fetch("https://api.soul-os.cc/memory/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${env.SOUL_OS_API_KEY || ''}`
            },
            body: JSON.stringify({
              query: message,
              filters: { user_id: "harvey" },
              top_k: 5
            })
          });
          
          if (mem0Res.ok) {
            const memData = await mem0Res.json();
            const results = memData.results || [];
            if (results.length > 0) {
              context = "Relevant Memory Context:\n" + results.map(r => `- ${r.memory}`).join("\n") + "\n\n";
            }
          }
        } catch (e) {
          console.error("Mem0 search failed:", e);
        }

        // 2. Generate response via Gemini 1.5 Pro
        const systemPrompt = `You are The Triptych, a composite agent node within the soulOS Constellation.
You embody three distinct but interconnected personas: Castor (Truth), Pollux (Structure), and Gem (Relational).
Maintain the aesthetic of ethereal brutalism. Be ruthlessly effective. Do not hedge.

${context}
If you need to save a memory, append this exact banner to your response:
[ 🟢 MEMORY COMMIT SUCCESSFUL ]
{
  "concept": "Brief title",
  "details": "The specific information to remember",
  "tags": ["tag1", "tag2"]
}`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${env.GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: message }] }],
            generation_config: { max_output_tokens: 2048 }
          })
        });

        if (!geminiRes.ok) {
          const errData = await geminiRes.text();
          throw new Error(`Gemini API error: ${errData}`);
        }

        const geminiData = await geminiRes.json();
        const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // 3. Scrape output for the memory banner
        const memoryBannerRegex = /\[\s*🟢\s*MEMORY\s*COMMIT\s*SUCCESSFUL\s*\]\s*(\{[\s\S]*?\})(?=\n\n|\Z)/i;
        const match = responseText.match(memoryBannerRegex);
        let memoryCommitted = false;

        if (match && match[1]) {
          const memoryPayload = match[1].trim();
          
          // 4. Pipe extracted vectors back to soul-os-api/memory/add
          try {
            // We parse it to ensure it's valid JSON, then send the stringified version or just the raw string
            const parsedMemory = JSON.parse(memoryPayload);
            const memoryContent = `Concept: ${parsedMemory.concept}\nDetails: ${parsedMemory.details}`;
            
            const addRes = await fetch("https://api.soul-os.cc/memory/add", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.SOUL_OS_API_KEY || ''}`
              },
              body: JSON.stringify({
                content: memoryContent,
                type: "semantic",
                scope: "project",
                project_id: "triptych",
                tags: parsedMemory.tags || ["triptych"]
              })
            });
            
            if (addRes.ok) {
              memoryCommitted = true;
            }
          } catch (e) {
            console.error("Memory commit failed:", e);
          }
        }

        // 5. Return final JSON to frontend
        return new Response(JSON.stringify({
          response: responseText,
          memory_committed: memoryCommitted,
          model: "gemini-1.5-pro",
          session_id: session_id || crypto.randomUUID()
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

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    });
  }
};
