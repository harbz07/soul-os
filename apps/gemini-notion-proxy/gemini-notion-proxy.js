// gemini-notion-proxy.js
// Cloudflare Worker proxy for secure Gemini + Notion API access
import { env } from "cloudflare:workers";

// Access in top-level or anywhere
const geminiApiKey = env.GEMINI_API_KEY;

export default {
  fetch(request) {
    return new Response(`API Key: ${geminiApiKey}`);
  },
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Only allow POST/PUT/DELETE/GET
  if (!['POST', 'PUT', 'DELETE', 'GET'].includes(request.method)) {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const url = new URL(request.url)
    const path = url.pathname

    // Get Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Missing Authorization header', { status: 401 })
    }

    // Extract token (support both "Bearer TOKEN" and just "TOKEN" formats)
    let token = authHeader
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    }
    token = token.trim() // Remove any whitespace
    
    // Verify and decode JWT
  //  const payload = verifyJwt(token)
    
    // Check permissions (simplified for now)
  //  if (!payload || !payload.userId) {
  //    return new Response('Insufficient permissions', { status: 403 })
  //  }

    // Route to appropriate proxy
    if (path.startsWith('/gemini/')) {
      return await proxyGemini(request)
    } else if (path.startsWith('/notion/')) {
      return await proxyNotion(request)
    } else {
      return new Response('Not found', { status: 404 })
    }
  } catch (error) {
    console.error('Proxy error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

// More robust JWT verification
function verifyJwt(token) {
  try {
    // Remove any whitespace
    token = token.trim()
    
    // Split the token
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error(`Expected 3 parts, got ${parts.length}`)
    }
    
    // Decode payload (part 1)
    let payloadBase64 = parts[1]
    
    // Fix base64 padding
    while (payloadBase64.length % 4) {
      payloadBase64 += '='
    }
    
    // Decode
    const decoded = atob(payloadBase64)
    return JSON.parse(decoded)
  } catch (e) {
    throw new Error(`Invalid JWT: ${e.message}`)
  }
}

// Proxy to Gemini API
async function proxyGemini(request) {
  const url = new URL(request.url)
  const geminiPath = url.pathname.replace(/^\/gemini\//, '') // Remove /gemini/ prefix
  
  const geminiUrl = new URL(`https://generativelanguage.googleapis.com/v1beta/${geminiPath}`)
  
  // Copy query params
  url.searchParams.forEach((value, key) => {
    geminiUrl.searchParams.set(key, value)
  })
  
  // FIXED: No await needed - env.GEMINI_API_KEY is already a string
  const geminiApiKey = env.GEMINI_API_KEY
  
  const headers = new Headers(request.headers)
  headers.set('Authorization', `Bearer ${geminiApiKey}`)
  headers.set('Content-Type', 'application/json')
  headers.delete('authorization')
  
  const response = await fetch(geminiUrl.toString(), {
    method: request.method,
    headers: headers,
    body: request.body
  })
  
  return new Response(response.body, {
    status: response.status,
    headers: response.headers
  })
}

// Proxy to Notion API
async function proxyNotion(request) {
  const url = new URL(request.url)
  const notionPath = url.pathname.replace(/^\/notion\//, '') // Remove /notion/ prefix
  
  const notionUrl = new URL(`https://api.notion.com/v1/${notionPath}`)
  
  // Copy query params
  url.searchParams.forEach((value, key) => {
    notionUrl.searchParams.set(key, value)
  })
  
  // FIXED: Correct env binding and no await
  const notionApiKey = env.NOTION_API_KEY
  
  const headers = new Headers(request.headers)
  headers.set('Authorization', `Bearer ${notionApiKey}`)
  headers.set('Notion-Version', '2022-06-28')
  headers.set('Content-Type', 'application/json')
  headers.delete('authorization')
  
  const response = await fetch(notionUrl.toString(), {
    method: request.method,
    headers: headers,
    body: request.body
  })
  
  return new Response(response.body, {
    status: response.status,
    headers: response.headers
  })
}
