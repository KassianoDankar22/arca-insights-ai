
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { handleCreateThread } from "./thread-management.ts";
import { handleSendMessage } from "./message-management.ts";
import { handleRunAssistant, handleCheckRunStatus } from "./run-management.ts";
import { handleGetMessages } from "./message-retrieval.ts";
import { CorsHeaders } from "./utils.ts";

// Get the OpenAI API key from the environment variables
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const ASSISTANT_ID = "asst_nPUpDeVkDUmc1PUrBr7NsmrR";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CorsHeaders });
  }

  try {
    // Debug logging
    console.log("[DEBUG] Request received:", req.method, req.url);
    
    // Log API key status (without revealing the actual key)
    console.log("[DEBUG] API key status:", OPENAI_API_KEY ? `Available (${OPENAI_API_KEY.length} chars)` : "Not available");
    console.log("[DEBUG] API key starts with:", OPENAI_API_KEY.slice(0, 5) + "...");
    
    if (!OPENAI_API_KEY) {
      console.error("[ERROR] Missing OpenAI API key");
      throw new Error("OpenAI API key is not configured. Please check your environment variables.");
    }
    
    const { action, data } = await req.json();
    console.log(`[DEBUG] Action: ${action}, Data:`, JSON.stringify(data || {}));

    switch (action) {
      case "createThread":
        return await handleCreateThread(OPENAI_API_KEY, CorsHeaders);
      
      case "sendMessage":
        return await handleSendMessage(data, OPENAI_API_KEY, CorsHeaders);
      
      case "runAssistant":
        return await handleRunAssistant(data, OPENAI_API_KEY, ASSISTANT_ID, CorsHeaders);
      
      case "checkRunStatus":
        return await handleCheckRunStatus(data, OPENAI_API_KEY, CorsHeaders);
      
      case "getMessages":
        return await handleGetMessages(data, OPENAI_API_KEY, CorsHeaders);
      
      default:
        return new Response(
          JSON.stringify({ error: "Invalid action", success: false }),
          { status: 400, headers: { ...CorsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("[ERROR] Edge function error:", error.message);
    console.error("[ERROR] Stack trace:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred", 
        success: false,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...CorsHeaders, "Content-Type": "application/json" } }
    );
  }
});
