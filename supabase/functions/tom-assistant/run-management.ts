/// <reference types="https://esm.sh/v135/@deno/sync@0.2.1/types.d.ts" />
import { handleApiErrorResponse, createSuccessResponse } from "./utils.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define hard-coded Supabase URL based on project ID (same as in frontend client)
const SUPABASE_URL = "https://dkykekkdjqajqfyrgqhi.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreWtla2tkanFhanFmeXJncWhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzIyOTQyMywiZXhwIjoyMDYyODA1NDIzfQ.v3IUsqP75rQHYWrhNo3xbc-VFbkBVSnWoxFrzsQltqA";

// Initialize Supabase client with the service role key
const supabaseAdmin = createClient(
  SUPABASE_URL,
  Deno.env.get("SERVICE_ROLE_KEY") || SUPABASE_SERVICE_ROLE_KEY
);
// --- End Supabase Client ---

// Run an assistant on a thread
export async function handleRunAssistant(data: any, apiKey: string, assistantId: string, corsHeaders: HeadersInit, authHeader: string | null) {
  const { threadId, instructions } = data;
  
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
  
  console.log(`[DEBUG] Running assistant ${assistantId} on thread ${threadId}`);
  
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      },
      body: JSON.stringify({
        assistant_id: assistantId,
        instructions: instructions || "Analise os dados fornecidos e gere uma análise detalhada do ROI."
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ERROR] Failed to run assistant: ${response.status} ${response.statusText}. Error: ${errorText}`);
      return new Response(
        JSON.stringify({ 
          error: `Failed to run assistant: ${response.status} ${response.statusText}`, 
          details: errorText,
          success: false,
          code: "ASSISTANT_RUN_ERROR"
        }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const responseData = await response.json();
    console.log("[DEBUG] Run created successfully with ID:", responseData.id);
    
    return new Response(
      JSON.stringify({ 
        ...responseData, 
        success: true,
        runId: responseData.id
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[ERROR] Error running assistant:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to run assistant", 
      success: false,
      code: "ASSISTANT_RUN_ERROR",
      details: typeof error === 'object' ? JSON.stringify(error) : 'Unknown error'
    }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
}

// Check the status of a run
export async function handleCheckRunStatus(data: any, apiKey: string, corsHeaders: HeadersInit, authHeader: string | null) {
  const { threadId, runId } = data;
  
  if (!threadId || !runId) {
    return new Response(
      JSON.stringify({ 
        error: "threadId and runId are required", 
        success: false,
        code: "MISSING_PARAMETERS"
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  console.log(`[DEBUG] Checking status of run ${runId} on thread ${threadId}`);
  
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ERROR] Failed to check run status: ${response.status} ${response.statusText}. Error: ${errorText}`);
      return new Response(
        JSON.stringify({ 
          error: `Failed to check run status: ${response.status} ${response.statusText}`, 
          details: errorText,
          success: false,
          code: "RUN_STATUS_ERROR"
        }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const responseData = await response.json();
    console.log(`[DEBUG] Run ${runId} status:`, responseData.status);
    
    return new Response(
      JSON.stringify({ 
        ...responseData, 
        success: true,
        status: responseData.status
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[ERROR] Error checking run status:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to check run status", 
      success: false,
      code: "RUN_STATUS_ERROR",
      details: typeof error === 'object' ? JSON.stringify(error) : 'Unknown error'
    }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
}
