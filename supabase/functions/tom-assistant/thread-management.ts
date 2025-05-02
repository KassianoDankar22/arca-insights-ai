
import { CorsHeaders, handleApiErrorResponse, createSuccessResponse } from "./utils.ts";

// Create a new thread
export async function handleCreateThread(apiKey: string, corsHeaders: HeadersInit) {
  console.log("[DEBUG] Creating thread...");
  
  try {
    // Verify API key is available
    if (!apiKey) {
      throw new Error("OpenAI API key is missing. Check your environment variables.");
    }
    
    console.log("[DEBUG] Starting OpenAI API request to create thread");
    
    const response = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v1"
      },
      body: JSON.stringify({})
    });

    console.log(`[DEBUG] Thread creation response status: ${response.status}`);
    
    if (!response.ok) {
      return handleApiErrorResponse(response);
    }

    const data = await response.json();
    console.log("[DEBUG] Thread created successfully:", data.id);
    
    return createSuccessResponse(data, corsHeaders);
  } catch (error) {
    console.error("[ERROR] Thread creation error:", error);
    throw error;
  }
}
