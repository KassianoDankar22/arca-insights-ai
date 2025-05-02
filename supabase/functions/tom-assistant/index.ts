
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Get the OpenAI API key from the environment variables
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const ASSISTANT_ID = "asst_nPUpDeVkDUmc1PUrBr7NsmrR";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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
        return await createThread(corsHeaders);
      
      case "sendMessage":
        return await sendMessage(data, corsHeaders);
      
      case "runAssistant":
        return await runAssistant(data, corsHeaders);
      
      case "checkRunStatus":
        return await checkRunStatus(data, corsHeaders);
      
      case "getMessages":
        return await getMessages(data, corsHeaders);
      
      default:
        return new Response(
          JSON.stringify({ error: "Invalid action", success: false }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Create a new thread
async function createThread(corsHeaders: HeadersInit) {
  console.log("[DEBUG] Creating thread...");
  
  try {
    // Verify API key is available
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing. Check your environment variables.");
    }
    
    console.log("[DEBUG] Starting OpenAI API request to create thread");
    
    const response = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v1"
      },
      body: JSON.stringify({})
    });

    console.log(`[DEBUG] Thread creation response status: ${response.status}`);
    
    if (!response.ok) {
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

    const data = await response.json();
    console.log("[DEBUG] Thread created successfully:", data.id);
    
    return new Response(
      JSON.stringify({ ...data, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[ERROR] Thread creation error:", error);
    throw error;
  }
}

// Send a message to a thread
async function sendMessage(data: any, corsHeaders: HeadersInit) {
  const { threadId, content } = data;
  
  if (!threadId) {
    throw new Error("threadId is required");
  }
  
  console.log(`[DEBUG] Sending message to thread ${threadId}`);
  
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v1"
      },
      body: JSON.stringify({
        role: "user",
        content: content
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ERROR] Send message error response:", errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: { message: "Failed to parse error response" } };
      }
      
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const responseData = await response.json();
    console.log("[DEBUG] Message sent successfully:", responseData.id);
    
    return new Response(
      JSON.stringify({ ...responseData, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[ERROR] Error sending message:", error);
    throw error;
  }
}

// Run an assistant on a thread
async function runAssistant(data: any, corsHeaders: HeadersInit) {
  const { threadId } = data;
  
  if (!threadId) {
    throw new Error("threadId is required");
  }
  
  console.log(`[DEBUG] Running assistant ${ASSISTANT_ID} on thread ${threadId}`);
  
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v1"
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ERROR] Run assistant error response:", errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: { message: "Failed to parse error response" } };
      }
      
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const responseData = await response.json();
    console.log("[DEBUG] Run created successfully with ID:", responseData.id);
    
    return new Response(
      JSON.stringify({ ...responseData, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[ERROR] Error running assistant:", error);
    throw error;
  }
}

// Check the status of a run
async function checkRunStatus(data: any, corsHeaders: HeadersInit) {
  const { threadId, runId } = data;
  
  if (!threadId || !runId) {
    throw new Error("threadId and runId are required");
  }
  
  console.log(`[DEBUG] Checking status of run ${runId} on thread ${threadId}`);
  
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v1"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ERROR] Check run status error response:", errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: { message: "Failed to parse error response" } };
      }
      
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const responseData = await response.json();
    console.log(`[DEBUG] Run ${runId} status:`, responseData.status);
    
    return new Response(
      JSON.stringify({ ...responseData, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[ERROR] Error checking run status:", error);
    throw error;
  }
}

// Get messages from a thread
async function getMessages(data: any, corsHeaders: HeadersInit) {
  const { threadId } = data;
  
  if (!threadId) {
    throw new Error("threadId is required");
  }
  
  console.log(`[DEBUG] Getting messages from thread ${threadId}`);
  
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v1"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ERROR] Get messages error response:", errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: { message: "Failed to parse error response" } };
      }
      
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const responseData = await response.json();
    console.log(`[DEBUG] Retrieved ${responseData.data?.length || 0} messages from thread ${threadId}`);
    
    return new Response(
      JSON.stringify({ ...responseData, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[ERROR] Error getting messages:", error);
    throw error;
  }
}
