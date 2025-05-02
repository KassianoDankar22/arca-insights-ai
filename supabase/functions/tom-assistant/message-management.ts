
import { handleApiErrorResponse, createSuccessResponse } from "./utils.ts";

// Send a message to a thread
export async function handleSendMessage(data: any, apiKey: string, corsHeaders: HeadersInit) {
  const { threadId, content } = data;
  
  if (!threadId) {
    throw new Error("threadId is required");
  }
  
  console.log(`[DEBUG] Sending message to thread ${threadId}`);
  
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v1"
      },
      body: JSON.stringify({
        role: "user",
        content: content
      })
    });

    if (!response.ok) {
      return handleApiErrorResponse(response);
    }

    const responseData = await response.json();
    console.log("[DEBUG] Message sent successfully:", responseData.id);
    
    return createSuccessResponse(responseData, corsHeaders);
  } catch (error) {
    console.error("[ERROR] Error sending message:", error);
    throw error;
  }
}
