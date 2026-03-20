export default {
  async fetch(request, env, ctx) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    if (request.method !== 'POST') {
      return Response.json({ success: false, error: 'Method not allowed. Use POST.' }, { status: 405 });
    }
    
    // Authentication
    const auth = request.headers.get('Authorization');
    if (auth !== `Bearer ${env.COMET_SECRET}`) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let intent, requestText, memory;
    try {
      const body = await request.json();
      intent      = body.intent  ?? 'query';
      requestText = body.request ?? body.message ?? '';
      memory      = body.memory  ?? null;
    } catch {
      return Response.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
    }

    if (!requestText) {
      return Response.json({ success: false, error: 'Missing request/message field.' }, { status: 400 });
    }

    // Build Perplexity messages
    const messages = [];
    const systemPrompt = memory ?? "You are Comet, a courier agent in the Constellation system. Be precise and concise.";
    messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: `[${intent}] ${requestText}` });

    let perplexityResp;
    try {
      perplexityResp = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar-pro',
          messages,
          max_tokens: body.max_tokens ?? 2048,
        }),
      });
    } catch (err) {
      return Response.json({ success: false, error: `Perplexity fetch failed: ${err.message}` }, { status: 502 });
    }

    if (!perplexityResp.ok) {
      const errText = await perplexityResp.text();
      return Response.json({ success: false, error: `Perplexity error ${perplexityResp.status}: ${errText}` }, { status: 502 });
    }

    const data = await perplexityResp.json();
    const response = data.choices?.[0]?.message?.content ?? '(no response)';

    return Response.json({
      success: true,
      agent: 'comet',
      intent,
      response,                       // ← siddartha reads cometData.response
      citations: data.citations ?? [],
    });
  },
};
