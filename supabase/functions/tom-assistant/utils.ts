// Shared utility functions and constants

// Lista de origens permitidas (inclui localhost para desenvolvimento e produção)
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:3005',
  'http://localhost:5173',
  'http://192.168.100.91:3000',
  'http://192.168.100.91:3001',
  'http://192.168.100.91:3002',
  'http://192.168.100.91:3003',
  'http://192.168.100.91:3004',
  'http://192.168.100.91:3005',
  'http://192.168.100.91:5173',
  'https://app.arca.ai',
  'https://arca-insights-ai.vercel.app'
];

// Função auxiliar para criar cabeçalhos CORS para uma requisição específica
export function getCorsHeaders(requestOrigin: string | null) {
  // Se não houver origem, ou a origem não estiver na lista de permitidas, usar '*'
  // Obs: Em produção você deve considerar uma abordagem mais restritiva
  const origin = !requestOrigin || !ALLOWED_ORIGINS.includes(requestOrigin) 
    ? '*' 
    : requestOrigin;
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, content-length, accept, origin, accept-encoding',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '86400'
  };
}

// Cabeçalhos padrão para retrocompatibilidade
export const CorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, content-length, accept, origin, accept-encoding',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400'
};

// Helper function to handle API errors consistently
export async function handleApiErrorResponse(response: Response): Promise<Response> {
  const errorText = await response.text();
  console.error("[ERROR] OpenAI API error response:", errorText);
  
  let errorData;
  try {
    errorData = JSON.parse(errorText);
  } catch (e) {
    errorData = { error: { message: "Failed to parse error response" } };
  }
  
  return new Response(
    JSON.stringify({ 
      error: errorData.error?.message || response.statusText, 
      success: false,
      code: "API_ERROR",
      details: errorText
    }),
    { status: response.status, headers: { "Content-Type": "application/json" } }
  );
}

// Helper function to create a successful response
export function createSuccessResponse(data: any, corsHeaders: HeadersInit) {
  return new Response(
    JSON.stringify({ ...data, success: true }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
