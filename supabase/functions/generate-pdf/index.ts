// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { launch as launchBrowser } from "https://deno.land/x/astral@0.3.0/mod.ts";

console.log("Edge Function 'generate-pdf' inicializada com Astral.");

serve(async (req: Request) => {
  // 1. Validar que é um método POST e que o corpo é JSON
  // Adicionar verificação CORS se chamar de um domínio diferente
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Ou seu domínio específico: 'https://sua-app.com'
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Responder a preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Método não permitido", { status: 405, headers: corsHeaders });
  }

  let analysisData: any;
  try {
    analysisData = await req.json();
  } catch (error) {
    console.error("Erro ao parsear JSON:", error);
    return new Response("Corpo da requisição inválido", { status: 400, headers: corsHeaders });
  }

  // --- Verificação básica dos dados recebidos (adapte conforme sua estrutura) ---
  if (!analysisData || typeof analysisData.valor_imovel === 'undefined') {
    console.error("Dados da análise incompletos:", analysisData);
    return new Response("Dados da análise incompletos", { status: 400, headers: corsHeaders });
  }
  console.log("Dados da análise recebidos:", analysisData);

  // Chave da API do Browserless.io
  const BROWSERLESS_API_KEY = "2SIdP0PUUh0N6Wl78b4f465fde4d255dfcd8bbd97979803f3";
  const browserWSEndpoint = `wss://chrome.browserless.io?token=${BROWSERLESS_API_KEY}`;

  let browser: any = null; // Definir fora do try para garantir o disconnect

  try {
    console.log("Iniciando conexão com Browserless.io via Astral...");
    // Usar launch do Astral para conectar
    browser = await launchBrowser({
      wsEndpoint: browserWSEndpoint,
    });
    console.log("Conectado ao Browserless.io via Astral.");
    const page = await browser.newPage();
    console.log("Nova página aberta no browser remoto.");

    // --- Criar o conteúdo HTML para o PDF ---
    // (Lembre-se de formatar os valores como moeda, percentual etc.)
    // Helper para formatação de moeda (adapte se necessário)
    const formatCurrency = (value: number | undefined | null) => {
       if (value === undefined || value === null) return "N/A";
       return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    // Helper para formatação de porcentagem (adapte se necessário)
     const formatPercent = (value: number | undefined | null, decimals = 1) => {
       if (value === undefined || value === null) return "N/A";
       return `${value.toFixed(decimals)}%`;
     };

     // Extrair dados ou usar defaults (Similar ao MetricsSummary)
     // !! IMPORTANTE: Adapte esta lógica e os nomes das variáveis para corresponderem aos DADOS REAIS !!
     const metrics = {
       propertyValue: analysisData.valor_imovel || 0,
       downPaymentPercentage: analysisData.entrada_percentual || 30,
       downPaymentValue: analysisData.entrada_valor || (analysisData.valor_imovel * (analysisData.entrada_percentual || 30) / 100),
       interestRate: analysisData.taxa_juros || 7,
       monthlyPayment: analysisData.parcela_mensal || 2957.22,

       dailyRate: analysisData.diaria_media || 350.00,
       occupancyRate: analysisData.ocupacao_media || 80,
       monthlyGrossIncome: analysisData.aluguel_mensal || 8400.00,
       yearlyGrossIncome: analysisData.aluguel_anual || 100800.00,

       expenses: analysisData.despesas_detalhadas || { // Adapte a estrutura real das despesas
           admin: 1680.00, hoa: 400.00, energia: 300.00,
           agua: 125.00, iptu: 525.00, seguro: 185.00
       },
       monthlyTotalExpenses: analysisData.despesa_total_mensal || 3335.00,

       monthlyNetIncome: analysisData.liquido_mensal_antes_financ || 5065.00,
       monthlyIncomeAfterFinancing: analysisData.liquido_mensal_pos_financ || 2107.78,
       yearlyIncomeAfterFinancing: analysisData.liquido_anual_pos_financ || 25293.32,

       yearlyAppreciationPercentage: analysisData.valorizacao_percentual || 6,
       yearlyAppreciationValue: analysisData.valorizacao_valor || 38099.40,

       totalYearlyReturn: analysisData.retorno_total_anual_valor || 63392.72,
       roiPercentage: analysisData.roi_percentual || 33.3
     };

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Análise de ROI - ${analysisData.condominio || "Propriedade"}</title>
        <style>
          /* Reset Básico & Fontes */
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size: 9pt; color: #374151; background-color: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

          /* Layout Geral */
          .container { width: 100%; max-width: 190mm; margin: 0 auto; padding: 10px; background-color: #fff; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
          .logo { max-width: 100px; max-height: 40px; object-fit: contain; }
          .date-block { text-align: right; }
          .date-label { font-size: 8pt; color: #6b7280; }
          .date-value { font-size: 10pt; font-weight: 500; color: #1f2937; }

          /* Banner Propriedade */
          .property-banner { border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; margin-bottom: 15px; background-color: #f9fafb; }
          .property-banner h2 { font-size: 14pt; font-weight: bold; text-transform: uppercase; color: #111827; margin-bottom: 5px; }
          .property-banner .info { font-size: 9pt; color: #4b5563; margin-bottom: 3px; display: flex; align-items: center; }
          .property-banner .info svg { width: 12px; height: 12px; margin-right: 5px; color: #6b7280; }
          .property-banner .value-line { margin-top: 8px; display: flex; align-items: baseline; }
          .property-banner .value-label { font-size: 9pt; color: #6b7280; margin-right: 5px; }
          .property-banner .value-amount { font-size: 16pt; font-weight: bold; color: #111827; }
          .stars { color: #facc15; font-size: 10pt; margin-bottom: 3px; }
          .premium-tag { font-size: 7pt; font-weight: 500; color: #6b7280; text-transform: uppercase; margin-left: 5px; background-color: #e5e7eb; padding: 1px 4px; border-radius: 3px; }

          /* Banners ROI/Retorno */
          .summary-banners { display: flex; gap: 5px; margin-bottom: 15px; }
          .banner { flex: 1; padding: 10px; border-radius: 6px; color: white; }
          .banner-blue { background-color: #0051a0 !important; }
          .banner-green { background-color: #16a34a !important; }
          .banner-title { font-size: 8pt; font-weight: 600; text-transform: uppercase; opacity: 0.9; margin-bottom: 4px; }
          .banner-value { font-size: 14pt; font-weight: bold; margin-bottom: 4px; display: flex; align-items: center; }
          .banner-value svg { width: 12px; height: 12px; margin-right: 4px; }
          .banner-subtitle { font-size: 8pt; opacity: 0.9; }

          /* Grid Principal */
          .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
          .column { display: flex; flex-direction: column; gap: 10px; }

          /* Seções */
          .section { background-color: #f9fafb !important; padding: 8px; border-radius: 6px; border: 1px solid #f3f4f6; page-break-inside: avoid; }
          .section-title { font-size: 9pt; font-weight: 600; margin-bottom: 8px; padding-left: 6px; text-transform: uppercase; display: flex; align-items: center; }
          .section-title svg { width: 10px; height: 10px; margin-right: 4px; }
          .border-blue { border-left: 3px solid #0051a0; }
          .border-green { border-left: 3px solid #16a34a; }
          .border-red { border-left: 3px solid #dc2626; }
          .border-yellow { border-left: 3px solid #f59e0b; }

          /* Layouts Internos das Seções */
          .kv-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 8px; }
          .kv-item { display: flex; flex-direction: column; }
          .kv-label { font-size: 8pt; color: #6b7280; margin-bottom: 1px; }
          .kv-value { font-size: 9pt; font-weight: 500; color: #1f2937; line-height: 1.2; }
          .kv-value.highlight-red { color: #dc2626; font-weight: 600; }
          .kv-value.highlight-green { color: #16a34a; font-weight: 600; }
          .kv-value.highlight-yellow { color: #d97706; font-weight: 600; }
          .kv-value.inline-badge { background-color: #f3f4f6 !important; padding: 1px 4px; border-radius: 3px; display: inline-block; font-weight: normal; }

          /* Despesas Mensais */
          .expenses-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
          .expense-card { background-color: #fff !important; padding: 5px; border-radius: 4px; border: 1px solid #e5e7eb; text-align: center; page-break-inside: avoid; }
          .expense-label { font-size: 7.5pt; text-transform: uppercase; color: #6b7280; margin-bottom: 2px; }
          .expense-value { font-size: 9pt; font-weight: 600; color: #1f2937; }
          .total-line { margin-top: 8px; padding-top: 5px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
          .total-label { font-size: 8pt; color: #6b7280; }
          .total-value { font-size: 9pt; font-weight: 600; color: #dc2626; }

          /* Fluxo de Caixa Líquido */
          .cashflow-line { background-color: #f3f4f6 !important; padding: 6px; border-radius: 4px; margin-bottom: 8px; display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 5px; }
          .cashflow-item { text-align: center; }
          .cashflow-label { font-size: 8pt; font-weight: 500; color: #4b5563; }
          .cashflow-value { font-size: 9pt; font-weight: 600; }
          .cashflow-op { font-size: 10pt; font-weight: bold; color: #6b7280; padding: 0 5px; }

          /* Resumo Investimento */
          .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
          .summary-card { background-color: #fff !important; padding: 8px; border-radius: 4px; border: 1px solid #e5e7eb; display: flex; flex-direction: column; height: 100%; page-break-inside: avoid; }
          .summary-title { font-size: 8.5pt; font-weight: 500; margin-bottom: 5px; display: flex; align-items: center; }
          .summary-title svg { width: 10px; height: 10px; margin-right: 4px; }
          .summary-main-value { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
          .summary-main-value .value { font-size: 13pt; font-weight: bold; }
          .summary-main-value .unit { font-size: 8pt; color: #6b7280; }
          .summary-subtitle { font-size: 8pt; color: #6b7280; margin-bottom: 8px; }
          .summary-details { margin-top: auto; }
          .summary-detail-line { display: flex; justify-content: space-between; align-items: baseline; font-size: 8.5pt; margin-bottom: 2px; }
          .summary-detail-line .label { color: #4b5563; }
          .summary-detail-line .value { font-weight: 500; text-align: right; }
          .summary-total-line { margin-top: 5px; padding-top: 5px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: baseline; }
          .summary-total-line .label { font-size: 9pt; color: #374151; }
          .summary-total-line .value { font-size: 10pt; font-weight: bold; text-align: right; }

          /* Cores específicas */
          .text-blue { color: #0051a0; }
          .text-green { color: #16a34a; }
          .text-red { color: #dc2626; }
          .text-yellow { color: #d97706; }

          /* Footer */
          .footer { margin-top: 15px; padding-top: 10px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 8pt; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">

          <!-- Cabeçalho -->
          <div class="header">
             <!-- Adapte para sua logo -->
             <!-- <img src="data:image/png;base64,..." alt="Logo" class="logo"> -->
             <div></div> <!-- Placeholder para logo -->
             <div class="date-block">
                <div class="date-label">Data da Análise</div>
                <div class="date-value">${new Date().toLocaleDateString('pt-BR')}</div>
             </div>
          </div>

          <!-- Banner Propriedade -->
           <div class="property-banner">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                      <div style="display: flex; align-items: center; margin-bottom: 4px;">
                        <span class="stars">★★★★★</span>
                        <span class="premium-tag">PREMIUM</span>
                      </div>
                      <h2>${analysisData.condominio || "N/A"}</h2>
                      <div class="info"><span>${analysisData.localizacao || "N/A"}</span></div>
                      <div class="info"><span>${`${analysisData.modelo || "Casa"}, ${analysisData.quartos || 0} quartos, ${analysisData.piscina ? "com piscina" : "sem piscina"}`}</span></div>
                      <div class="value-line">
                          <span class="value-label">Valor:</span>
                          <span class="value-amount">${formatCurrency(metrics.propertyValue)}</span>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Banners Resumo -->
          <div class="summary-banners">
              <div class="banner banner-blue">
                  <div class="banner-title">ROI sobre investimento</div>
                  <div class="banner-value">${formatPercent(metrics.roiPercentage)}</div>
                  <div class="banner-subtitle">Retorno sobre valor investido</div>
              </div>
              <div class="banner banner-green">
                  <div class="banner-title">Retorno anual total</div>
                  <div class="banner-value">${formatCurrency(metrics.totalYearlyReturn)}</div>
                  <div class="banner-subtitle">Aluguel + valorização anual</div>
              </div>
          </div>

          <!-- Grid Principal -->
          <div class="main-grid">
              <!-- Coluna 1 -->
              <div class="column">
                  <!-- FINANCIAMENTO -->
                  <div class="section">
                      <div class="section-title border-blue">FINANCIAMENTO</div>
                      <div class="kv-grid" style="grid-template-columns: 1fr 1fr;">
                          <div class="kv-item">
                              <span class="kv-label">Valor do imóvel</span>
                              <span class="kv-value">${formatCurrency(metrics.propertyValue)}</span>
                          </div>
                          <div class="kv-item">
                              <span class="kv-label">Entrada (${formatPercent(metrics.downPaymentPercentage, 0)})</span>
                              <span class="kv-value">${formatCurrency(metrics.downPaymentValue)}</span>
                          </div>
                          <div class="kv-item">
                              <span class="kv-label">Parcela mensal</span>
                              <span class="kv-value highlight-red">${formatCurrency(metrics.monthlyPayment)}</span>
                          </div>
                           <div class="kv-item">
                              <span class="kv-label">Taxa de juros</span>
                              <span class="kv-value inline-badge">${formatPercent(metrics.interestRate, 0)}</span>
                          </div>
                      </div>
                  </div>

                  <!-- DESPESAS MENSAIS -->
                  <div class="section">
                      <div class="section-title border-red">DESPESAS MENSAIS</div>
                      <div class="expenses-grid">
                           <!-- Adapte os nomes das chaves em metrics.expenses -->
                          <div class="expense-card"><span class="expense-label">ADMIN</span><span class="expense-value">${formatCurrency(metrics.expenses.admin)}</span></div>
                          <div class="expense-card"><span class="expense-label">HOA</span><span class="expense-value">${formatCurrency(metrics.expenses.hoa)}</span></div>
                          <div class="expense-card"><span class="expense-label">ENERGIA</span><span class="expense-value">${formatCurrency(metrics.expenses.energia)}</span></div>
                          <div class="expense-card"><span class="expense-label">ÁGUA</span><span class="expense-value">${formatCurrency(metrics.expenses.agua)}</span></div>
                          <div class="expense-card"><span class="expense-label">IMPOSTO</span><span class="expense-value">${formatCurrency(metrics.expenses.iptu)}</span></div>
                          <div class="expense-card"><span class="expense-label">SEGURO</span><span class="expense-value">${formatCurrency(metrics.expenses.seguro)}</span></div>
                      </div>
                       <div class="total-line">
                          <span class="total-label">Total mensal</span>
                          <span class="total-value">-${formatCurrency(metrics.monthlyTotalExpenses)}</span>
                      </div>
                  </div>
              </div>

               <!-- Coluna 2 -->
              <div class="column">
                  <!-- RECEITA DE ALUGUEL -->
                   <div class="section">
                      <div class="section-title border-green">RECEITA DE ALUGUEL</div>
                      <div class="kv-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 8px;">
                          <div class="kv-item">
                              <span class="kv-label">Diária média</span>
                              <span class="kv-value">${formatCurrency(metrics.dailyRate)}</span>
                          </div>
                          <div class="kv-item">
                              <span class="kv-label">Ocupação</span>
                              <span class="kv-value">${formatPercent(metrics.occupancyRate, 0)}</span>
                          </div>
                      </div>
                       <div class="kv-grid" style="grid-template-columns: 1fr 1fr;">
                          <div class="kv-item">
                              <span class="kv-label">Aluguel mensal</span>
                              <span class="kv-value highlight-green">${formatCurrency(metrics.monthlyGrossIncome)}</span>
                          </div>
                          <div class="kv-item">
                              <span class="kv-label">Aluguel anual</span>
                              <span class="kv-value highlight-green">${formatCurrency(metrics.yearlyGrossIncome)}</span>
                          </div>
                      </div>
                  </div>

                  <!-- FLUXO DE CAIXA LÍQUIDO -->
                  <div class="section">
                       <div class="section-title border-blue">FLUXO DE CAIXA LÍQUIDO</div>
                       <div class="cashflow-line">
                           <div class="cashflow-item">
                               <span class="cashflow-label">Aluguel</span>
                               <span class="cashflow-value text-green">+${formatCurrency(metrics.monthlyGrossIncome)}</span>
                           </div>
                           <span class="cashflow-op">-</span>
                            <div class="cashflow-item">
                               <span class="cashflow-label">Despesas</span>
                               <span class="cashflow-value text-red">-${formatCurrency(metrics.monthlyTotalExpenses)}</span>
                           </div>
                           <span class="cashflow-op">=</span>
                            <div class="cashflow-item">
                               <span class="cashflow-label">Líquido</span>
                               <span class="cashflow-value text-blue">${formatCurrency(metrics.monthlyNetIncome)}</span>
                           </div>
                       </div>
                        <div class="kv-grid" style="grid-template-columns: 1fr 1fr;">
                          <div class="kv-item">
                              <span class="kv-label">Mensal após financ.</span>
                              <span class="kv-value">${formatCurrency(metrics.monthlyIncomeAfterFinancing)}</span>
                          </div>
                          <div class="kv-item">
                              <span class="kv-label">Anual após financ.</span>
                              <span class="kv-value">${formatCurrency(metrics.yearlyIncomeAfterFinancing)}</span>
                          </div>
                      </div>
                  </div>

                  <!-- VALORIZAÇÃO ANUAL -->
                  <div class="section">
                      <div class="section-title border-yellow">VALORIZAÇÃO ANUAL</div>
                      <div class="kv-grid" style="grid-template-columns: auto 1fr; align-items: baseline;">
                           <span class="kv-value inline-badge" style="margin-right: 5px;">${formatPercent(metrics.yearlyAppreciationPercentage, 0)} =</span>
                           <div class="kv-item">
                              <span class="kv-label">Valor anual</span>
                              <span class="kv-value highlight-yellow">${formatCurrency(metrics.yearlyAppreciationValue)}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Resumo Investimento -->
          <div class="section summary-container" style="background-color: #f9fafb; padding: 10px;">
              <div class="section-title border-blue" style="margin-bottom: 10px;">RESUMO DO INVESTIMENTO</div>
              <div class="summary-grid">
                  <!-- Card 1: ROI -->
                  <div class="summary-card">
                      <div class="summary-title text-blue">Retorno sobre Investimento</div>
                      <div class="summary-main-value">
                          <span class="value">${formatPercent(metrics.roiPercentage)}</span>
                          <span class="unit">ao ano</span>
                      </div>
                      <div class="summary-subtitle">Retorno anual sobre o valor investido (entrada)</div>
                  </div>
                  <!-- Card 2: Fluxo Caixa Anual -->
                  <div class="summary-card">
                      <div class="summary-title text-green">Fluxo de Caixa Anual</div>
                      <div class="summary-details">
                           <!-- Adapte para cálculo correto das despesas anuais se necessário -->
                          <div class="summary-detail-line"><span class="label">Aluguel</span><span class="value text-green">+${formatCurrency(metrics.yearlyGrossIncome)}</span></div>
                          <div class="summary-detail-line"><span class="label">Despesas</span><span class="value text-red">-${formatCurrency(metrics.monthlyTotalExpenses * 12)}</span></div>
                          <div class="summary-detail-line"><span class="label">Financiamento</span><span class="value text-red">-${formatCurrency(metrics.monthlyPayment * 12)}</span></div>
                      </div>
                      <div class="summary-total-line">
                          <span class="label">Líquido anual</span>
                          <span class="value text-green">${formatCurrency(metrics.yearlyIncomeAfterFinancing)}</span>
                      </div>
                  </div>
                   <!-- Card 3: Retorno Total -->
                  <div class="summary-card">
                      <div class="summary-title text-yellow">Retorno Total Anual</div>
                       <div class="summary-details">
                          <div class="summary-detail-line"><span class="label">Aluguel líquido</span><span class="value text-green">${formatCurrency(metrics.yearlyIncomeAfterFinancing)}</span></div>
                          <div class="summary-detail-line"><span class="label">Valorização (${formatPercent(metrics.yearlyAppreciationPercentage,0)})</span><span class="value text-yellow">${formatCurrency(metrics.yearlyAppreciationValue)}</span></div>
                      </div>
                      <div class="summary-total-line">
                          <span class="label">Total anual</span>
                          <span class="value text-yellow">${formatCurrency(metrics.totalYearlyReturn)}</span>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Rodapé -->
          <div class="footer">
              Análise de ROI gerada com Arca Insights AI - © ${new Date().getFullYear()} Arca Intelligence
          </div>

        </div>
      </body>
      </html>
    `;

    console.log("HTML Content gerado. Definindo na página...");
    await page.setContent(htmlContent, { waitUntil: "networkidle0" }); // Espera a rede ficar ociosa
    console.log("Conteúdo definido. Gerando PDF...");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // Importante para cores de fundo
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });
    console.log("PDF Buffer gerado.");

    // Desconectar
    if (browser) {
        await browser.disconnect(); 
        console.log("Desconectado do Browserless.io.");
    }

    return new Response(pdfBuffer, {
      headers: {
        ...corsHeaders, // Adiciona headers CORS à resposta final
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="analise_roi.pdf"', // inline para tentar abrir no navegador
      },
      status: 200,
    });

  } catch (error) {
    console.error("Erro ao gerar PDF com Astral/Browserless:", error);
    
    // Garantir desconexão em caso de erro
    if (browser) {
        try { await browser.disconnect(); } catch (disconnectError) { console.error("Erro ao desconectar após falha:", disconnectError); }
    }

    // Retornar a mensagem de erro detalhada na resposta
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ 
        message: "Erro interno do servidor ao gerar PDF.", 
        error: errorMessage, 
        stack: error instanceof Error ? error.stack : undefined // Opcional: incluir stack trace
      }), 
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" // Mudar para JSON para enviar o erro
        } 
      }
    );
  }
});
