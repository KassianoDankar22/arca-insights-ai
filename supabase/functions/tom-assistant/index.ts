console.log("[DEPLOY_CONFIRMATION_V5] Loading tom-assistant function index.ts - " + new Date().toISOString());

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { handleCreateThread } from "./thread-management.ts";
import { handleSendMessage } from "./message-management.ts";
import { handleRunAssistant, handleCheckRunStatus } from "./run-management.ts";
import { handleGetMessages } from "./message-retrieval.ts";
import { handleRetrieveOAIFileContent } from "./file-retrieval.ts";
import { CorsHeaders, getCorsHeaders } from "./utils.ts";

// Get the OpenAI API key from the environment variables
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
// Usando apenas a chave de ambiente e validando sua presença
const VALID_API_KEY = OPENAI_API_KEY;
const ASSISTANT_ID = "asst_nPUpDeVkDUmc1PUrBr7NsmrR";

// Main handler function
serve(async (req) => {
  console.log(`[tom-assistant:${new Date().toISOString()}] Recebida requisição: ${req.method} ${req.url}`);
  
  // Obter origem da requisição
  const requestOrigin = req.headers.get('origin');
  console.log(`[tom-assistant] Origem da requisição: ${requestOrigin || 'Não especificada'}`);
  
  // Gerar cabeçalhos CORS dinâmicos baseados na origem
  const corsHeaders = getCorsHeaders(requestOrigin);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("[tom-assistant] Respondendo a requisição OPTIONS para CORS");
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  // Verificar se a requisição não é POST, mas retornar 200 para aceitar
  if (req.method !== "POST") {
    console.log(`[tom-assistant] Método ${req.method} não é POST, mas retornando 200 para teste`);
    return new Response(
      JSON.stringify({ message: `Method ${req.method} received. For API calls, use POST.`, success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Debug logging
    console.log("[DEBUG] Request received:", req.method, req.url);
    
    // Ping para teste simples
    let requestBody;
    try {
      requestBody = await req.json();
      console.log("[DEBUG] Request body parsed:", JSON.stringify(requestBody));
      
      // Verificar estrutura da requisição
      if (!requestBody) {
        console.error("[ERROR] Request body is empty");
        return new Response(
          JSON.stringify({ 
            error: "Request body is required", 
            success: false,
            hint: "Body should be JSON with format: { action: string, data?: object }"
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Verificar se a action está presente
      if (!requestBody.action) {
        console.error("[ERROR] Missing 'action' field in request");
        return new Response(
          JSON.stringify({ 
            error: "Missing 'action' field in request", 
            success: false,
            expectedFormat: { action: "string", data: "object (optional)" }
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Garantir que data seja um objeto, mesmo vazio
      if (requestBody.data === undefined) {
        console.log("[DEBUG] Request has no data field, adding empty object");
        requestBody.data = {};
      }
      
    } catch (e) {
      console.log("[ERROR] Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ 
          message: "Invalid JSON", 
          success: false,
          expectedFormat: { action: "string", data: "object (optional)" }
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (requestBody.action === 'ping') {
      console.log("[tom-assistant] Recebido ping, respondendo com pong");
      return new Response(
        JSON.stringify({ message: "pong", success: true, timestamp: new Date().toISOString(), status: "ok" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Log API key status (without revealing the actual key)
    const apiKeyLength = VALID_API_KEY ? VALID_API_KEY.length : 0;
    console.log("[DEBUG] API key status: " + (apiKeyLength > 0 ? `Available (${apiKeyLength} chars)` : "Not available"));
    if (apiKeyLength > 0) {
      console.log("[DEBUG] API key starts with:", VALID_API_KEY.substring(0, 3) + "...");
    }
    
    if (!VALID_API_KEY || VALID_API_KEY.trim() === "") {
      console.error("[ERROR] Missing OpenAI API key");
      return new Response(
        JSON.stringify({ 
          error: "OpenAI API key is not configured. Please check your environment variables.", 
          success: false,
          code: "API_KEY_MISSING"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Extract action and data from the validated request body
    const action = requestBody.action;
    const data = requestBody.data || {};
    
    // Get auth header for potential use
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      console.log("[DEBUG] Authorization header received:", authHeader.substring(0, 15) + "...");
    } else {
      console.log("[DEBUG] No Authorization header received.");
    }

    // Process based on the requested action
    console.log(`[DEBUG] Processing action: ${action}`);
    let result;
    
    switch (action) {
      case "createThread":
        console.log("[DEBUG] index.ts - Entrou no case 'createThread'. Chamando handleCreateThread...");
        try {
          console.log("[DEBUG] index.ts - Iniciando chamada para handleCreateThread");
          console.log("[DEBUG] index.ts - OpenAI API Key disponível:", !!VALID_API_KEY);
          console.log("[DEBUG] index.ts - Comprimento da API Key:", VALID_API_KEY.length);
          result = await handleCreateThread(VALID_API_KEY, corsHeaders);
          console.log(`[DEBUG] index.ts - Retorno de handleCreateThread. Status: ${result?.status}, Headers: ${JSON.stringify(Array.from(result?.headers?.entries() || []))}`);
        } catch (error) {
          console.error("[ERROR] index.ts - Erro ao chamar handleCreateThread:", error);
          throw error;
        }
        break;
      
      case "sendMessage":
        console.log("[DEBUG] index.ts - Entrou no case 'sendMessage'. Chamando handleSendMessage...");
        result = await handleSendMessage(data, VALID_API_KEY, corsHeaders, authHeader);
        break;
      
      case "runAssistant":
        console.log("[DEBUG] index.ts - Entrou no case 'runAssistant'. Chamando handleRunAssistant...");
        result = await handleRunAssistant(data, VALID_API_KEY, ASSISTANT_ID, corsHeaders, authHeader);
        break;
      
      case "checkRunStatus":
        console.log("[DEBUG] index.ts - Entrou no case 'checkRunStatus'. Chamando handleCheckRunStatus...");
        result = await handleCheckRunStatus(data, VALID_API_KEY, corsHeaders, authHeader);
        break;
      
      case "getMessages":
        console.log("[DEBUG] index.ts - Entrou no case 'getMessages'. Chamando handleGetMessages...");
        result = await handleGetMessages(data, VALID_API_KEY, corsHeaders, authHeader);
        break;
      
      case "retrieveOAIFileContent":
        console.log("[DEBUG] index.ts - Entrou no case 'retrieveOAIFileContent'. Chamando handleRetrieveOAIFileContent...");
        result = await handleRetrieveOAIFileContent(data, VALID_API_KEY, corsHeaders, authHeader);
        break;
      
      case "analyzeROIAction":
        console.log("[DEBUG] index.ts - Entrou no case 'analyzeROIAction'. Processando análise de ROI...");
        try {
          // Validar dados recebidos
          if (!data || !data.system_prompt || !data.user_prompt || !data.propertyData) {
            console.error("[ERROR] Dados inválidos recebidos para analyzeROIAction:", data); // Log mais específico
            return new Response(
              JSON.stringify({
                error: "Dados inválidos para análise de ROI",
                success: false,
                code: "INVALID_DATA_ROI", // Código de erro específico
                details: {
                  has_system_prompt: !!data?.system_prompt,
                  has_user_prompt: !!data?.user_prompt,
                  has_property_data: !!data?.propertyData
                }
              }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Criar um novo thread
          console.log("[DEBUG] Criando thread para análise de ROI");
          const threadResponse = await handleCreateThread(VALID_API_KEY, corsHeaders);
          if (!threadResponse.ok) {
            const threadErrorText = await threadResponse.text();
            console.error(`[ERROR] Falha ao criar thread. Status: ${threadResponse.status}. Body: ${threadErrorText}`);
            throw new Error(`Falha ao criar thread: ${threadErrorText}`);
          }
          const threadData = await threadResponse.json();
          const threadId = threadData.threadId || threadData.id;
          if (!threadId) {
            console.error("[ERROR] threadId não encontrado na resposta de handleCreateThread:", threadData);
            throw new Error("ID do thread não retornado após criação.");
          }

          // Enviar a mensagem com o prompt do sistema primeiro
          console.log("[DEBUG] Enviando mensagem do sistema para o thread:", threadId);
          const systemMessageResponse = await handleSendMessage(
            { threadId, content: data.system_prompt, role: "user" }, // Role explícito
            VALID_API_KEY,
            corsHeaders,
            authHeader
          );
          if (!systemMessageResponse.ok) {
            const messageErrorText = await systemMessageResponse.text();
            console.error(`[ERROR] Falha ao enviar mensagem do sistema. Status: ${systemMessageResponse.status}. Body: ${messageErrorText}`);
            throw new Error(`Falha ao enviar mensagem do sistema: ${messageErrorText}`);
          }

          // Enviar a mensagem com o prompt do usuário
          console.log("[DEBUG] Enviando mensagem do usuário para o thread:", threadId);
          const userMessageResponse = await handleSendMessage(
            { threadId, content: data.user_prompt, role: "user" }, // Role explícito
            VALID_API_KEY,
            corsHeaders,
            authHeader
          );
          if (!userMessageResponse.ok) {
            const messageErrorText = await userMessageResponse.text();
            console.error(`[ERROR] Falha ao enviar mensagem do usuário. Status: ${userMessageResponse.status}. Body: ${messageErrorText}`);
            throw new Error(`Falha ao enviar mensagem do usuário: ${messageErrorText}`);
          }
          
          // Executar o assistente
          console.log("[DEBUG] Executando assistente no thread:", threadId);
          const runResponse = await handleRunAssistant(
            {
              threadId,
              assistantId: ASSISTANT_ID
              // instructions: data.system_prompt // Comentado para teste: Deixar o assistente usar suas instruções padrão
            },
            VALID_API_KEY,
            ASSISTANT_ID, // assistantId é passado novamente, o que é redundante mas ok
            corsHeaders,
            authHeader
          );

          if (!runResponse.ok) {
            // runResponse já é uma Response com status e corpo JSON de erro
            // vindo de handleRunAssistant (que inclui code: ASSISTANT_RUN_ERROR ou similar)
            const errorBodyForLog = await runResponse.clone().text(); // Clonar para poder ler o body e ainda retornar a response
            console.error(`[PROPAGATING_ERROR] handleRunAssistant falhou. Status: ${runResponse.status}. Body: ${errorBodyForLog}. Retornando sua resposta diretamente.`);
            return runResponse; // Simplesmente retorna a resposta de erro de handleRunAssistant
          }

          const runData = await runResponse.json();
          const runId = runData.runId || runData.id;

          if (!runId) {
            console.error("[ERROR] runId não encontrado na resposta de handleRunAssistant:", runData);
            throw new Error("ID da execução não retornado pelo assistente. Resposta: " + JSON.stringify(runData));
          }
          console.log(`[DEBUG] Assistente executado com sucesso. Thread ID: ${threadId}, Run ID: ${runId}`);

          // Aguardar a conclusão da execução
          console.log(`[DEBUG] Aguardando conclusão da execução do Run ID: ${runId}`);
          let runStatus;
          let attempts = 0;
          const maxAttempts = 60; // Aumentado para 60 segundos (60 tentativas de 1s)
          
          do {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo entre verificações
            attempts++;
            console.log(`[DEBUG] Verificando status da execução (tentativa ${attempts}/${maxAttempts}), Run ID: ${runId}`);
            
            const statusResponse = await handleCheckRunStatus(
              { threadId, runId },
              VALID_API_KEY,
              corsHeaders,
              authHeader
            );
            
            if (!statusResponse.ok) {
              const statusErrorText = await statusResponse.text();
              console.error(`[ERROR] Falha ao verificar status da execução. Run ID: ${runId}. Status: ${statusResponse.status}. Body: ${statusErrorText}`);
              throw new Error(`Falha ao verificar status da execução: ${statusErrorText}`);
            }
            
            const statusData = await statusResponse.json();
            runStatus = statusData.status;
            console.log(`[DEBUG] Status da execução do Run ID ${runId}: ${runStatus}`);
            
            if (["failed", "cancelled", "expired"].includes(runStatus)) {
              console.error(`[ERROR] Execução do Run ID ${runId} falhou com status: ${runStatus}. Detalhes:`, statusData.last_error || 'Sem detalhes de erro.');
              throw new Error(`Execução falhou com status: ${runStatus}. Erro: ${statusData.last_error?.message || 'Desconhecido'}`);
            }
            
            if (attempts >= maxAttempts && runStatus !== "completed") {
              console.error(`[ERROR] Timeout ao aguardar conclusão da execução do Run ID ${runId} após ${maxAttempts} segundos.`);
              throw new Error("Timeout ao aguardar conclusão da execução do assistente.");
            }
          } while (runStatus !== "completed");

          // Obter as mensagens
          console.log(`[DEBUG] Execução concluída. Obtendo mensagens do Thread ID: ${threadId}`);
          const messagesResponse = await handleGetMessages(
            { threadId, order: "desc", limit: 10 }, // Pegar as últimas mensagens
            VALID_API_KEY,
            corsHeaders,
            authHeader
          );
          
          if (!messagesResponse.ok) {
            const messagesErrorText = await messagesResponse.text();
            console.error(`[ERROR] Falha ao obter mensagens. Thread ID: ${threadId}. Status: ${messagesResponse.status}. Body: ${messagesErrorText}`);
            throw new Error(`Falha ao obter mensagens: ${messagesErrorText}`);
          }
          
          const messagesData = await messagesResponse.json();
          
          if (!messagesData.messages || !messagesData.messages.length) {
            console.error("[ERROR] Nenhuma mensagem retornada pelo assistente no Thread ID:", threadId);
            throw new Error("Nenhuma mensagem retornada pelo assistente.");
          }

          // Encontrar a última mensagem do assistente
          const assistantMessages = messagesData.messages.filter((m: any) => m.role === 'assistant');

          if (!assistantMessages.length) {
            console.error("[ERROR] Nenhuma mensagem do assistente encontrada no Thread ID:", threadId, "Mensagens:", messagesData.messages);
            throw new Error("Nenhuma mensagem do assistente encontrada.");
          }

          const lastMessage = assistantMessages[0]; // A mais recente devido a order: "desc"
          
          if (!lastMessage.content || !lastMessage.content[0] || !lastMessage.content[0].text || !lastMessage.content[0].text.value) {
            console.error("[ERROR] Formato de mensagem inválido retornado pelo assistente. Thread ID:", threadId, "Última mensagem:", lastMessage);
            throw new Error("Formato de mensagem inválido retornado pelo assistente.");
          }

          const assistantReply = lastMessage.content[0].text.value;
          console.log(`[DEBUG] Resposta do assistente obtida (primeiros 100 chars): ${assistantReply.substring(0,100)}...`);

          // Retornar o resultado
          return new Response(
            JSON.stringify({
              resultado: assistantReply,
              threadId,
              runId,
              status: "completed", // Status final da operação analyzeROIAction
              success: true
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          console.error("[ERROR] Falha crítica ao processar análise de ROI (analyzeROIAction):", error.message);
          // Log do stack trace se disponível
          if (error.stack) {
            console.error("[STACK_TRACE] analyzeROIAction:", error.stack);
          }
          return new Response(
            JSON.stringify({
              error: "Erro ao processar análise de ROI: " + error.message,
              success: false,
              code: error.code || "ASSISTANT_PROCESS_ERROR" // Usar código do erro se existir
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      
      case "checkROIAnalysisStatus":
        console.log("[DEBUG] index.ts - Verificando status da análise de ROI");
        try {
          const { threadId, runId } = data;
          
          if (!threadId || !runId) {
            return new Response(
              JSON.stringify({
                error: "threadId e runId são obrigatórios para verificar status",
                success: false
              }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          
          // Verificar status do run
          const checkData = {
            threadId,
            runId
          };
          
          const runStatusResponse = await handleCheckRunStatus(checkData, VALID_API_KEY, corsHeaders, authHeader);
          const runStatusData = await runStatusResponse.json();
          
          // Se o status for 'completed', buscar as mensagens
          if (runStatusData.status === 'completed') {
            const messagesData = { threadId };
            const messagesResponse = await handleGetMessages(messagesData, VALID_API_KEY, corsHeaders, authHeader);
            const messagesResult = await messagesResponse.json();
            
            let assistantResponse = "Análise concluída, mas não foi possível recuperar o conteúdo.";
            
            // Encontrar a mensagem do assistente mais recente
            if (messagesResult && messagesResult.messages && messagesResult.messages.length > 0) {
              // Filtrar mensagens do assistente e ordenar pela mais recente
              const assistantMessages = messagesResult.messages
                .filter(m => m.role === 'assistant')
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                
              if (assistantMessages.length > 0 && assistantMessages[0].content) {
                assistantResponse = assistantMessages[0].content[0].text.value;
              }
            }
            
            return new Response(
              JSON.stringify({
                success: true,
                status: "completed",
                resultado: assistantResponse,
                threadId,
                runId
              }),
              { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          
          // Retornar o status atual
          return new Response(
            JSON.stringify({
              success: true,
              status: runStatusData.status,
              threadId,
              runId
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch (error) {
          console.error("[ERROR] Erro ao verificar status da análise:", error);
          return new Response(
            JSON.stringify({
              error: "Erro ao verificar status: " + (error.message || "erro desconhecido"),
              success: false
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: `Invalid action: ${action}`, success: false }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
    
    console.log(`[DEBUG] Action ${action} completed successfully`);
    return result;
    
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
