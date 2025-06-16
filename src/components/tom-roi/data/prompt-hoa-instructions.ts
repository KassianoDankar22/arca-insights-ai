/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2025 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2024 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

// Instruções sobre HOA para o Tom Assistant
export const HOA_INSTRUCTIONS = `
📋 TABELA OFICIAL DE HOA MENSAL POR CONDOMÍNIO (Orlando/Kissimmee 2024):

┌─────────────────────────┬────────────┬────────────┬────────────┬────────────┐
│ CONDOMÍNIO              │ 3 QUARTOS  │ 4 QUARTOS  │ 5 QUARTOS  │ 6+ QUARTOS │
├─────────────────────────┼────────────┼────────────┼────────────┼────────────┤
│ Solara Resort           │ $280       │ $320       │ $350       │ $380       │
│ Windsor Cay             │ $310       │ $340       │ $370       │ $400       │
│ Champions Gate          │ $350       │ $380       │ $420       │ $450       │
│ Windsor at Westside     │ $295       │ $330       │ $365       │ $395       │
│ Encore Resort           │ $420       │ $460       │ $500       │ $540       │
│ Reunion Resort          │ $380       │ $420       │ $460       │ $500       │
│ Storey Lake             │ $290       │ $325       │ $360       │ $390       │
│ Solterra Resort         │ $305       │ $340       │ $375       │ $405       │
│ Paradise Palms          │ $275       │ $310       │ $345       │ $375       │
│ Terra Verde             │ $285       │ $320       │ $355       │ $385       │
└─────────────────────────┴────────────┴────────────┴────────────┴────────────┘

🔒 REGRAS RÍGIDAS PARA HOA:
1. SEMPRE use o valor EXATO da tabela acima conforme o condomínio e número de quartos
2. Se o condomínio não estiver na tabela, use os valores médios:
   - 3 quartos: $315
   - 4 quartos: $350  
   - 5 quartos: $385
   - 6+ quartos: $415
3. NUNCA invente ou estime valores de HOA diferentes da tabela
4. Se o usuário fornecer um valor específico de HOA, use o valor fornecido pelo usuário
5. Sempre mencione na análise que "o HOA foi baseado na tabela oficial de mercado para [nome do condomínio]"

💡 OBSERVAÇÕES:
- Valores são baseados em dados reais de mercado 2024
- HOA inclui manutenção de áreas comuns, segurança, paisagismo e amenidades
- Condomínios premium (Encore, Reunion) têm HOAs mais altos devido às amenidades superiores
- Sempre confirme com o cliente se o valor está alinhado com o que ele conhece do mercado
`;

export const getHOAInstructionsForPrompt = (): string => {
  return HOA_INSTRUCTIONS;
}; 