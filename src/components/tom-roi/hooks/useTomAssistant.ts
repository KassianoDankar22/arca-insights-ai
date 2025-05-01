
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { FormValues } from '../types/analyzer-types';

export const useTomAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [progress, setProgress] = useState<{
    stage: 'creating-thread' | 'sending-message' | 'running-assistant' | 'checking-status' | 'getting-results' | 'complete' | null;
    percentage: number;
  }>({ stage: null, percentage: 0 });

  const analyzeROI = useCallback(async (data: FormValues) => {
    setIsLoading(true);
    setProgress({ stage: 'creating-thread', percentage: 10 });
    
    try {
      // Format the data as specified in the requirements
      const messageContent = `Nome do condomínio: ${data.condominio}
Tipo de investimento: ${data.tipo_investimento}
Localização: ${data.localizacao}
Modelo da casa: ${data.modelo}
Quartos: ${data.quartos}
Possui piscina: ${data.piscina ? 'Sim' : 'Não'}
Valor do imóvel: ${data.valor_imovel}
${data.entrada_valor ? `Entrada: $${data.entrada_valor}` : ''}${data.entrada_percentual ? ` ou ${data.entrada_percentual}%` : ''}`;

      console.log("Starting analysis with data:", messageContent);

      // Step 1: Create a new thread
      setProgress({ stage: 'creating-thread', percentage: 20 });
      const { data: threadData, error: threadError } = await supabase.functions
        .invoke('tom-assistant', {
          body: { action: 'createThread' },
        });
      
      console.log("Thread creation response:", threadData, threadError);

      if (threadError) {
        console.error("Thread creation error:", threadError);
        throw new Error(`Falha ao criar thread: ${threadError.message || 'Erro desconhecido'}`);
      }
      
      if (!threadData?.id) {
        console.error("Thread creation failed: No thread ID returned");
        throw new Error("Falha ao criar thread: Nenhum ID de thread retornado");
      }
      
      const threadId = threadData.id;
      console.log("Thread created successfully with ID:", threadId);
      
      // Step 2: Send a message to the thread
      setProgress({ stage: 'sending-message', percentage: 40 });
      const { data: messageData, error: messageError } = await supabase.functions
        .invoke('tom-assistant', {
          body: { 
            action: 'sendMessage', 
            data: { 
              threadId,
              content: messageContent
            } 
          },
        });
      
      console.log("Message send response:", messageData, messageError);

      if (messageError) {
        console.error("Message send error:", messageError);
        throw new Error(`Falha ao enviar mensagem: ${messageError.message || 'Erro desconhecido'}`);
      }
      
      // Step 3: Run the assistant on the thread
      setProgress({ stage: 'running-assistant', percentage: 60 });
      const { data: runData, error: runError } = await supabase.functions
        .invoke('tom-assistant', {
          body: { 
            action: 'runAssistant', 
            data: { threadId } 
          },
        });
      
      console.log("Assistant run response:", runData, runError);

      if (runError) {
        console.error("Run assistant error:", runError);
        throw new Error(`Falha ao iniciar assistente: ${runError.message || 'Erro desconhecido'}`);
      }
      
      if (!runData?.id) {
        console.error("Run assistant failed: No run ID returned");
        throw new Error("Falha ao iniciar assistente: Nenhum ID de execução retornado");
      }
      
      const runId = runData.id;
      
      // Step 4: Poll for completion
      setProgress({ stage: 'checking-status', percentage: 70 });
      let runStatus = null;
      let attempts = 0;
      const MAX_ATTEMPTS = 30; // Timeout after 30 attempts (total 1.5 minutes)
      
      while (attempts < MAX_ATTEMPTS) {
        attempts++;
        
        const { data: statusData, error: statusError } = await supabase.functions
          .invoke('tom-assistant', {
            body: { 
              action: 'checkRunStatus', 
              data: { 
                threadId,
                runId 
              } 
            },
          });
        
        console.log(`Check run status attempt ${attempts}:`, statusData, statusError);

        if (statusError) {
          console.error("Check run status error:", statusError);
          throw new Error(`Falha ao verificar status: ${statusError.message || 'Erro desconhecido'}`);
        }
        
        runStatus = statusData?.status;
        setProgress({ stage: 'checking-status', percentage: 70 + Math.min((attempts / 10) * 10, 20) }); 
        
        if (runStatus === 'completed') {
          break;
        } else if (runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'expired') {
          console.error("Run ended with error status:", runStatus, statusData?.last_error);
          throw new Error(`Análise falhou com status: ${runStatus}. Motivo: ${statusData?.last_error?.message || 'Desconhecido'}`);
        }
        
        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      if (runStatus !== 'completed') {
        console.error("Run timed out or did not complete successfully");
        throw new Error('Tempo limite excedido ou análise não foi concluída com sucesso');
      }
      
      // Step 5: Get the messages from the thread
      setProgress({ stage: 'getting-results', percentage: 95 });
      const { data: messagesData, error: messagesError } = await supabase.functions
        .invoke('tom-assistant', {
          body: { 
            action: 'getMessages', 
            data: { threadId } 
          },
        });
      
      console.log("Get messages response:", messagesData, messagesError);

      if (messagesError) {
        console.error("Get messages error:", messagesError);
        throw new Error(`Falha ao obter mensagens: ${messagesError.message || 'Erro desconhecido'}`);
      }
      
      // Find the assistant's response
      const assistantMessages = messagesData?.data
        ?.filter((msg: any) => msg.role === 'assistant')
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      if (!assistantMessages || assistantMessages.length === 0) {
        console.error("No assistant response found");
        throw new Error('Nenhuma resposta do assistente encontrada');
      }
      
      const latestMessage = assistantMessages[0];
      
      // Check for tool calls (save to Supabase)
      if (latestMessage.tool_calls && latestMessage.tool_calls.length > 0) {
        const saveTool = latestMessage.tool_calls.find(
          (tool: any) => tool.function?.name === 'salvar_analise'
        );
        
        if (saveTool) {
          try {
            const saveParams = JSON.parse(saveTool.function.arguments);
            
            // Save to Supabase
            const { error: saveError } = await supabase
              .from('roi_analises')
              .insert([{
                condominio: data.condominio,
                tipo_investimento: data.tipo_investimento,
                localizacao: data.localizacao,
                modelo: data.modelo,
                quartos: parseInt(data.quartos),
                piscina: data.piscina,
                valor_imovel: parseFloat(data.valor_imovel),
                entrada_valor: data.entrada_valor ? parseFloat(data.entrada_valor) : null,
                entrada_percentual: data.entrada_percentual ? parseFloat(data.entrada_percentual) : null,
                resultado_texto: getMessageContent(latestMessage),
                user_id: (await supabase.auth.getUser()).data.user?.id
              }]);
            
            if (saveError) {
              console.error('Error saving analysis to database:', saveError);
              // Continue despite save error
              toast({
                title: 'Aviso',
                description: 'A análise foi concluída, mas não foi possível salvá-la. Você ainda pode exportá-la.',
                variant: 'warning',
              });
            } else {
              console.log('Analysis saved successfully to database');
            }
          } catch (e) {
            console.error('Error processing save tool call:', e);
            // Continue despite tool call error
          }
        }
      }
      
      // Process the message content
      setResult({
        condominio: data.condominio,
        tipo_investimento: data.tipo_investimento,
        localizacao: data.localizacao,
        modelo: data.modelo,
        quartos: parseInt(data.quartos),
        piscina: data.piscina,
        valor_imovel: parseFloat(data.valor_imovel),
        entrada_valor: data.entrada_valor ? parseFloat(data.entrada_valor) : undefined,
        entrada_percentual: data.entrada_percentual ? parseFloat(data.entrada_percentual) : undefined,
        resultado_texto: getMessageContent(latestMessage),
      });
      
      setProgress({ stage: 'complete', percentage: 100 });
      
    } catch (error) {
      console.error('Error in ROI analysis:', error);
      
      toast({
        title: 'Erro na análise',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao processar sua análise',
        variant: 'destructive',
      });
      
      setProgress({ stage: null, percentage: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Extract text content from the message
  const getMessageContent = (message: any): string => {
    if (!message?.content || message.content.length === 0) {
      return '';
    }
    
    return message.content
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text.value)
      .join('\n\n');
  };

  const resetAnalysis = useCallback(() => {
    setResult(null);
    setProgress({ stage: null, percentage: 0 });
  }, []);

  return {
    isLoading,
    result,
    progress,
    analyzeROI,
    resetAnalysis
  };
};
