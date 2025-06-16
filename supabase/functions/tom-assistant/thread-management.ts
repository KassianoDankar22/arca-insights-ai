import { OpenAI } from "https://deno.land/x/openai@v4.24.1/mod.ts";
import { CorsHeaders } from "./utils.ts";

// Create a new thread
export async function handleCreateThread(apiKey: string, corsHeaders: HeadersInit) {
  console.log("[THREAD_MGMT] Iniciando criação de thread com API Key " + (apiKey ? "disponível" : "indisponível"));
  
  if (!apiKey) {
    console.error("[ERROR] OpenAI API key is missing in handleCreateThread.");
    return new Response(
      JSON.stringify({ 
        error: "OpenAI API key is not configured.", 
        success: false,
        code: "MISSING_API_KEY"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    console.log("[THREAD_MGMT] Tentando criar thread diretamente via API...");
    
    const response = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ERROR] Erro específico da API OpenAI ao criar thread:", errorText);
      return new Response(
        JSON.stringify({ 
          error: `Failed to create thread: ${response.status} ${response.statusText}`, 
          details: errorText,
          success: false,
          code: "THREAD_CREATION_ERROR"
        }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const threadData = await response.json();
    console.log("[THREAD_MGMT] Thread criado com sucesso! ID:", threadData.id);
    
    return new Response(
      JSON.stringify({ 
        threadId: threadData.id, 
        object: threadData.object, 
        success: true
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Logs detalhados do erro
    console.error("[ERROR] Erro ao criar thread:", error);
    console.error("[ERROR] Tipo do erro:", typeof error);
    console.error("[ERROR] Message:", error.message || "No message");
    console.error("[ERROR] Status:", error.status || "No status");
    
    if (error.response) {
      try {
        console.error("[ERROR] Response status:", error.response.status);
        const responseText = await error.response.text();
        console.error("[ERROR] Response text:", responseText);
      } catch (e) {
        console.error("[ERROR] Não foi possível extrair texto da resposta:", e);
      }
    }
    
    // Preparar mensagem de erro detalhada para o frontend
    let errorMessage = "Falha ao criar thread no OpenAI";
    if (error.message) errorMessage += `: ${error.message}`;
    if (error.response?.status) errorMessage += ` (Status: ${error.response.status})`;
    
    // Resposta de erro padronizada para o frontend
    return new Response(
      JSON.stringify({ 
        error: errorMessage, 
        success: false,
        code: "THREAD_CREATION_ERROR",
        details: typeof error === 'object' ? JSON.stringify(error) : 'Unknown error'
      }),
      { status: error.status || 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}