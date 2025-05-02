
import { handleApiErrorResponse, createSuccessResponse } from "./utils.ts";

// Get messages from a thread
export async function handleGetMessages(data: any, apiKey: string, corsHeaders: HeadersInit) {
  const { threadId } = data;
  
  if (!threadId) {
    throw new Error("threadId is required");
  }
  
  console.log(`[DEBUG] Getting messages from thread ${threadId}`);
  
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v1"
      }
    });

    if (!response.ok) {
      return handleApiErrorResponse(response);
    }

    const responseData = await response.json();
    console.log(`[DEBUG] Retrieved ${responseData.data?.length || 0} messages from thread ${threadId}`);
    
    return createSuccessResponse(responseData, corsHeaders);
  } catch (error) {
    console.error("[ERROR] Error getting messages:", error);
    throw error;
  }
}
