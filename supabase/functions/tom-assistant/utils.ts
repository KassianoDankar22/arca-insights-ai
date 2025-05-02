
// Shared utility functions and constants

export const CorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to handle API errors consistently
export async function handleApiErrorResponse(response: Response): Promise<never> {
  const errorText = await response.text();
  console.error("[ERROR] OpenAI API error response:", errorText);
  
  let errorData;
  try {
    errorData = JSON.parse(errorText);
  } catch (e) {
    errorData = { error: { message: "Failed to parse error response" } };
  }
  
  throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
}

// Helper function to create a successful response
export function createSuccessResponse(data: any, corsHeaders: HeadersInit) {
  return new Response(
    JSON.stringify({ ...data, success: true }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
