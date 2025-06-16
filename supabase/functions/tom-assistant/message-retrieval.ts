import { handleApiErrorResponse, createSuccessResponse } from "./utils.ts";

// Get messages from a thread
export async function handleGetMessages(data: any, apiKey: string, corsHeaders: HeadersInit, authHeader: string | null) {
  const { threadId } = data;
  
  if (!threadId) {
    return new Response(
      JSON.stringify({ 
        error: "threadId is required", 
        success: false,
        code: "MISSING_THREAD_ID"
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  console.log(`[DEBUG] Getting messages from thread ${threadId}`);
  // console.log(`[DEBUG] Auth header in handleGetMessages: ${authHeader ? authHeader.substring(0,10) + '...' : 'null'}`); // Exemplo de log
  
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ERROR] Failed to get messages from thread ${threadId}: ${response.status} ${response.statusText}. Error: ${errorText}`);
      return new Response(
        JSON.stringify({ 
          error: `Failed to get messages: ${response.status} ${response.statusText}`, 
          details: errorText,
          success: false,
          code: "MESSAGE_RETRIEVAL_ERROR"
        }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const responseData = await response.json();
    console.log(`[DEBUG] Retrieved ${responseData.data?.length || 0} messages from thread ${threadId}`);
    
    // Additional logging to help with debugging message contents
    if (responseData.data?.length > 0) {
      console.log(`[DEBUG] Last message role: ${responseData.data[0].role}`);
      console.log(`[DEBUG] Message content type: ${typeof responseData.data[0].content}`);
      console.log(`[DEBUG] First message content:`, responseData.data[0].content);
    }
    
    return new Response(
      JSON.stringify({ 
        messages: responseData.data || [],
        success: true
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[ERROR] Error getting messages:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to retrieve messages", 
      success: false,
      code: "MESSAGE_RETRIEVAL_ERROR",
      details: typeof error === 'object' ? JSON.stringify(error) : 'Unknown error'
    }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
}
