import { handleApiErrorResponse, createSuccessResponse } from "./utils.ts";

// Send a message to a thread
export async function handleSendMessage(data: any, apiKey: string, corsHeaders: HeadersInit, authHeader: string | null) {
  // Validar dados de entrada
  if (!data) {
    console.error("[ERROR] Dados vazios enviados para handleSendMessage");
    return new Response(
      JSON.stringify({
        error: "Dados de mensagem vazios ou inválidos",
        success: false,
        code: "INVALID_MESSAGE_DATA"
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Log detalhado dos dados recebidos
  console.log("[DEBUG] handleSendMessage recebeu: ", {
    hasThreadId: !!data.threadId,
    threadId: data.threadId ? `${data.threadId.substring(0, 10)}...` : null,
    hasContent: !!data.content,
    contentType: data.content ? typeof data.content : 'undefined',
    contentLength: data.content ? data.content.length : 0,
    content: data.content ? `${data.content.substring(0, 50)}...` : null
  });

  // NOVO: Extrair e validar dados com maior segurança
  const threadId = data.threadId;
  // Forçar conversão para string e garantir que não é undefined ou null
  const content = data.content ? String(data.content) : '';
  
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
  
  // Validar conteúdo da mensagem - a OpenAI requer conteúdo não-vazio
  if (!content) {
    console.error("[ERROR] Empty or missing content in message data");
    return new Response(
      JSON.stringify({
        error: "Message content cannot be empty",
        success: false,
        code: "EMPTY_MESSAGE_CONTENT",
        receivedData: JSON.stringify({
          hasThreadId: !!threadId,
          contentExists: !!content,
          contentType: typeof content
        })
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Verificação adicional para strings vazias ou apenas espaços
  const trimmedContent = content.trim();
  if (trimmedContent === '') {
    console.error("[ERROR] Content contains only whitespace");
    return new Response(
      JSON.stringify({
        error: "Message content cannot be only whitespace",
        success: false,
        code: "WHITESPACE_ONLY_CONTENT"
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  console.log(`[DEBUG] Sending message to thread ${threadId}`);
  console.log(`[DEBUG] Message content length: ${trimmedContent.length} characters`);
  console.log(`[DEBUG] Message content beginning: ${trimmedContent.substring(0, 50)}...`);
  
  try {
    // NOVO: Criar o payload usando string literal para garantir que o conteúdo seja mantido
    const payload = JSON.stringify({
      role: "user",
      content: String(trimmedContent)
    });
    
    console.log(`[DEBUG] Payload para API OpenAI preparado: ${payload.length} bytes`);
    
    // Garantir que estamos enviando o conteúdo sanitizado
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      },
      body: payload
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ERROR] Failed to send message to thread ${threadId}: ${response.status} ${response.statusText}. Error: ${errorText}`);
      return new Response(
        JSON.stringify({ 
          error: `Failed to send message: ${response.status} ${response.statusText}`, 
          details: errorText,
          success: false,
          code: "MESSAGE_SEND_ERROR"
        }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const responseData = await response.json();
    console.log("[DEBUG] Message sent successfully:", responseData.id);
    
    return new Response(
      JSON.stringify({ 
        ...responseData, 
        success: true,
        messageId: responseData.id
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[ERROR] Error sending message:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to send message", 
      success: false,
      code: "MESSAGE_SEND_ERROR",
      details: typeof error === 'object' ? JSON.stringify(error) : 'Unknown error'
    }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
}
