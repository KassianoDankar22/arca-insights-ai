
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      condominio, 
      tipo_investimento,
      localizacao,
      modelo,
      quartos,
      piscina,
      valor_imovel,
      entrada_valor,
      entrada_percentual 
    } = await req.json();

    // Build the prompt for the OpenAI API
    const prompt = `
      Sou o Tom, especialista em análise de ROI para imóveis. 
      
      Por favor, analise este imóvel em detalhes e forneça uma simulação completa de retorno sobre investimento (ROI) com as seções abaixo.
      
      Dados do imóvel:
      - Nome do condomínio: ${condominio}
      - Tipo de investimento: ${tipo_investimento}
      - Localização: ${localizacao}
      - Modelo: ${modelo}
      - Quartos: ${quartos}
      - Piscina: ${piscina ? 'Sim' : 'Não'}
      - Valor do imóvel: R$ ${parseFloat(valor_imovel).toLocaleString('pt-BR')}
      - ${entrada_valor ? `Entrada: R$ ${parseFloat(entrada_valor).toLocaleString('pt-BR')}` : ''}
      - ${entrada_percentual ? `Entrada: ${entrada_percentual}%` : ''}
      
      Com base nessas informações, forneça uma análise completa com:
      
      1) 🏠 Dados do Imóvel e Financiamento:
      - Valor do imóvel
      - Entrada (valor e percentual)
      - Valor financiado
      - Taxa de juros estimada
      - Prazo do financiamento
      - Estimativa de parcela mensal
      
      2) 💸 Rendimento do Aluguel:
      - Valor estimado do aluguel por temporada (diária média)
      - Taxa de ocupação esperada
      - Rendimento bruto mensal
      - Rendimento bruto anual
      
      3) 🧾 Despesas da Propriedade:
      - Condomínio
      - IPTU
      - Manutenção
      - Serviços (água, luz, internet)
      - Limpeza
      - Seguro
      - Taxa de administração para locação
      - Total de despesas mensais
      
      4) 📈 Rendimento Líquido e Valorização:
      - Rendimento líquido mensal (antes do financiamento)
      - Rendimento líquido mensal (após pagar financiamento)
      - Valorização anual estimada do imóvel (%)
      - Valor estimado do imóvel após 5 anos
      
      5) ✅ Total Final:
      - ROI anual (%)
      - Tempo estimado para recuperar o investimento
      - Sugestões de otimização do investimento
      
      Formate sua resposta com emojis e seções bem separadas. Use tabelas simples quando aplicável.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Você é um especialista em análise de ROI para imóveis de temporada e investimentos.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 1200,
      }),
    });

    const data = await response.json();
    const resultado = data.choices[0].message.content;

    // Return the analysis result
    return new Response(JSON.stringify({ 
      resultado,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-roi function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
