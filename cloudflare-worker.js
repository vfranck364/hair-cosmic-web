// Cloudflare Worker pour HAIR Chatbot - Proxy API sécurisé
// Déploiement : https://workers.cloudflare.com/
// 
// Instructions :
// 1. Créez un compte Cloudflare (gratuit)
// 2. Allez sur "Workers & Pages" → "Create Worker"
// 3. Copiez ce code
// 4. Dans "Settings" → "Variables" → Ajoutez :
//    - GEMINI_API_KEY = AIzaSyA-wadl5mW611OLnaA6y8jQ0oGCGg2lePI
//    - ALLOWED_ORIGINS = http://localhost:5500,https://votre-domaine.com
// 5. Déployez

export default {
  async fetch(request, env) {
    // Gestion CORS (préflight requests)
    if (request.method === 'OPTIONS') {
      return handleCORS(request, env);
    }

    // Vérifier que c'est une requête POST
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Use POST.' }),
        { 
          status: 405,
          headers: corsHeaders(env)
        }
      );
    }

    try {
      // Récupérer le corps de la requête
      const body = await request.json();
      
      // Vérifier la clé API
      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'API key not configured' }),
          { 
            status: 500,
            headers: corsHeaders(env)
          }
        );
      }

      // Forward à Gemini API
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(body)
        }
      );

      // Vérifier la réponse de Gemini
      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API Error:', geminiResponse.status, errorText);
        
        return new Response(
          JSON.stringify({ 
            error: 'Gemini API error',
            details: errorText,
            status: geminiResponse.status
          }),
          { 
            status: geminiResponse.status,
            headers: corsHeaders(env)
          }
        );
      }

      // Retourner la réponse de Gemini
      const data = await geminiResponse.json();
      
      return new Response(
        JSON.stringify(data),
        { 
          status: 200,
          headers: corsHeaders(env)
        }
      );

    } catch (error) {
      console.error('Worker Error:', error);
      
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error',
          message: error.message 
        }),
        { 
          status: 500,
          headers: corsHeaders(env)
        }
      );
    }
  }
};

// Gestion des requêtes CORS preflight
async function handleCORS(request, env) {
  const origin = request.headers.get('Origin') || '';
  
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': getAllowedOrigin(origin, env),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }
  });
}

// Helper pour les headers CORS
function corsHeaders(env) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Note: L'origin sera ajouté dynamiquement dans la réponse
  return headers;
}

// Helper pour vérifier l'origine autorisée
function getAllowedOrigin(requestOrigin, env) {
  const allowedOrigins = env.ALLOWED_ORIGINS 
    ? env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:5500'];
  
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }
  
  // Fallback au premier origin autorisé (dev)
  return allowedOrigins[0] || '*';
}
