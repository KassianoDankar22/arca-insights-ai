
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { action, data } = await req.json();
    
    console.log(`Processing action: ${action} with data:`, JSON.stringify(data || {}));
    
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable not configured");
    }

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
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Error in tom-assistant function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Create a new thread
async function createThread(corsHeaders: HeadersInit) {
  console.log("Creating thread with OpenAI...");
  
  try {
    const response = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v1"
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("Thread created successfully with ID:", data.id);
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error;
  }
}

// Send a message to a thread
async function sendMessage(data: any, corsHeaders: HeadersInit) {
  const { threadId, content } = data;
  
  if (!threadId) {
    throw new Error("threadId is required");
  }
  
  console.log(`Sending message to thread ${threadId}`);
  
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
      const errorData = await response.json();
      console.error("OpenAI API error sending message:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Message sent successfully:", responseData.id);
    
    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Run an assistant on a thread
async function runAssistant(data: any, corsHeaders: HeadersInit) {
  const { threadId } = data;
  
  if (!threadId) {
    throw new Error("threadId is required");
  }
  
  console.log(`Running assistant ${ASSISTANT_ID} on thread ${threadId}`);
  
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
      const errorData = await response.json();
      console.error("OpenAI API error running assistant:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Run created successfully with ID:", responseData.id);
    
    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error running assistant:", error);
    throw error;
  }
}

// Check the status of a run
async function checkRunStatus(data: any, corsHeaders: HeadersInit) {
  const { threadId, runId } = data;
  
  if (!threadId || !runId) {
    throw new Error("threadId and runId are required");
  }
  
  console.log(`Checking status of run ${runId} on thread ${threadId}`);
  
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
      const errorData = await response.json();
      console.error("OpenAI API error checking run status:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const responseData = await response.json();
    console.log(`Run ${runId} status:`, responseData.status);
    
    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error checking run status:", error);
    throw error;
  }
}

// Get messages from a thread
async function getMessages(data: any, corsHeaders: HeadersInit) {
  const { threadId } = data;
  
  if (!threadId) {
    throw new Error("threadId is required");
  }
  
  console.log(`Getting messages from thread ${threadId}`);
  
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
      const errorData = await response.json();
      console.error("OpenAI API error getting messages:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const responseData = await response.json();
    console.log(`Retrieved ${responseData.data?.length || 0} messages from thread ${threadId}`);
    
    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
}
