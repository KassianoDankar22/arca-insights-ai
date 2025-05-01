
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
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Create a new thread
async function createThread(corsHeaders: HeadersInit) {
  const response = await fetch("https://api.openai.com/v1/threads", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v1"
    },
    body: JSON.stringify({})
  });

  const data = await response.json();
  
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Send a message to a thread
async function sendMessage(data: any, corsHeaders: HeadersInit) {
  const { threadId, content } = data;
  
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

  const responseData = await response.json();
  
  return new Response(
    JSON.stringify(responseData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Run an assistant on a thread
async function runAssistant(data: any, corsHeaders: HeadersInit) {
  const { threadId } = data;
  
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

  const responseData = await response.json();
  
  return new Response(
    JSON.stringify(responseData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Check the status of a run
async function checkRunStatus(data: any, corsHeaders: HeadersInit) {
  const { threadId, runId } = data;
  
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v1"
    }
  });

  const responseData = await response.json();
  
  return new Response(
    JSON.stringify(responseData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Get messages from a thread
async function getMessages(data: any, corsHeaders: HeadersInit) {
  const { threadId } = data;
  
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v1"
    }
  });

  const responseData = await response.json();
  
  return new Response(
    JSON.stringify(responseData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
