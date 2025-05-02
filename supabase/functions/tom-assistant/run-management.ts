
import { handleApiErrorResponse, createSuccessResponse } from "./utils.ts";

// Run an assistant on a thread
export async function handleRunAssistant(data: any, apiKey: string, assistantId: string, corsHeaders: HeadersInit) {
  const { threadId } = data;
  
  if (!threadId) {
    throw new Error("threadId is required");
  }
  
  console.log(`[DEBUG] Running assistant ${assistantId} on thread ${threadId}`);
  
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v1"
      },
      body: JSON.stringify({
        assistant_id: assistantId
      })
    });

    if (!response.ok) {
      return handleApiErrorResponse(response);
    }

    const responseData = await response.json();
    console.log("[DEBUG] Run created successfully with ID:", responseData.id);
    
    return createSuccessResponse(responseData, corsHeaders);
  } catch (error) {
    console.error("[ERROR] Error running assistant:", error);
    throw error;
  }
}

// Check the status of a run
export async function handleCheckRunStatus(data: any, apiKey: string, corsHeaders: HeadersInit) {
  const { threadId, runId } = data;
  
  if (!threadId || !runId) {
    throw new Error("threadId and runId are required");
  }
  
  console.log(`[DEBUG] Checking status of run ${runId} on thread ${threadId}`);
  
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
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
    console.log(`[DEBUG] Run ${runId} status:`, responseData.status);
    
    return createSuccessResponse(responseData, corsHeaders);
  } catch (error) {
    console.error("[ERROR] Error checking run status:", error);
    throw error;
  }
}
